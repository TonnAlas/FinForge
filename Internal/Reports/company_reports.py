"""
Company Reports Data Provider

Provides categorized links to company-prepared reports for a ticker:

  - SEC EDGAR filings (annual, quarterly, current events, governance, other)
  - Investor Relations links (annual report, IR page, presentations, ESG)

Data sources (in priority order):
  1. SEC EDGAR Submissions API - free, keyless, complete filing history with
     direct document links. Covers US-listed companies and foreign companies
     that file with the SEC (20-F / 6-K, e.g. ADR issuers).
  2. Cached parquet at data/fundamentals/sec_filings/{TICKER}.parquet
     (local fallback when the SEC API is unreachable).
  3. Investor Relations links - curated data/company_ir_links.json, else
     derived from the company website reported by Yahoo Finance. This is the
     universal fallback for companies that do not file with the SEC (for
     example home-exchange-only issuers in Europe and Asia).

Public entry point:
    get_company_reports(ticker, refresh=False) -> dict (JSON-serializable)

Return shape:
    {
        "ok": true,
        "ticker": "AAPL",
        "cik": "320193" | null,
        "name": "Apple Inc.",
        "hasSecFilings": true | false,
        "source": "sec_edgar" | "local_cache" | "ir_only" | "none",
        "region": "...",
        "exchange": "...",
        "fetchedAt": "ISO-8601",
        "reports": {
            "ir":          [ {"label", "url"} ],
            "annual":      [ report record ],
            "quarterly":   [ report record ],
            "events":      [ report record ],
            "governance":  [ report record ],
            "other":       [ report record ],
        }
    }

Report record shape:
    {
        "form", "filingDate", "reportDate", "accessionNumber",
        "primaryDocument", "description", "documentUrl",
        "filingIndexUrl", "size", "category"
    }
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests

# SEC programmatic-access policy requires a descriptive User-Agent with a
# contact point. Replace the contact placeholder with the operator's details.
SEC_USER_AGENT = os.environ.get("FINFORGE_SEC_USER_AGENT", "FinForge investor-terminal contact@example.com")

SEC_COMPANY_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json"
SEC_SUBMISSIONS_URL = "https://data.sec.gov/submissions/CIK{cik:010d}.json"
SEC_ARCHIVES_URL = "https://www.sec.gov/Archives/edgar/data/{cik}/{accession}/{document}"
SEC_FILING_INDEX_URL = "https://www.sec.gov/Archives/edgar/data/{cik}/{accession}/"
SEC_BROWSE_URL = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={cik}&type={form}"

COMPANY_TICKERS_CACHE_TTL_SECONDS = 7 * 24 * 60 * 60  # 7 days
REPORTS_CACHE_TTL_SECONDS = 24 * 60 * 60             # 24 hours

# SEC form-type -> report category mapping.
ANNUAL_FORMS = {"10-K", "10-K/A", "20-F", "20-F/A", "40-F", "40-F/A", "ARS", "ARS/A"}
QUARTERLY_FORMS = {"10-Q", "10-Q/A", "6-K", "6-K/A"}
EVENT_FORMS = {"8-K", "8-K/A"}
GOVERNANCE_FORMS = {
    "DEF 14A", "DEF 14C", "PRE 14A", "PRE 14C",
    "S-1", "S-1/A", "S-3", "S-4", "S-4/A",
    "424B2", "424B3", "424B4", "424B5",
    "SC 13D", "SC 13D/A", "SC 13G", "SC 13G/A",
}

# Yahoo Finance ticker suffix -> region/exchange defaults. Used when no
# exchange metadata is stored in data/tickers.json.
SUFFIX_REGION_MAP = {
    ".L": {"region": "United Kingdom", "exchange": "LSE"},
    ".IL": {"region": "United Kingdom", "exchange": "LSE"},
    ".DE": {"region": "Germany", "exchange": "Xetra"},
    ".F": {"region": "Germany", "exchange": "Frankfurt"},
    ".PA": {"region": "France", "exchange": "Euronext Paris"},
    ".AS": {"region": "Netherlands", "exchange": "Euronext Amsterdam"},
    ".BR": {"region": "Belgium", "exchange": "Euronext Brussels"},
    ".MI": {"region": "Italy", "exchange": "Borsa Italiana"},
    ".MC": {"region": "Spain", "exchange": "Bolsa de Madrid"},
    ".T": {"region": "Japan", "exchange": "Tokyo"},
    ".HK": {"region": "Hong Kong", "exchange": "HKEX"},
    ".SS": {"region": "China", "exchange": "Shanghai"},
    ".SZ": {"region": "China", "exchange": "Shenzhen"},
    ".AX": {"region": "Australia", "exchange": "ASX"},
    ".TO": {"region": "Canada", "exchange": "TSX"},
    ".V": {"region": "Canada", "exchange": "TSX Venture"},
    ".NS": {"region": "India", "exchange": "NSE"},
    ".BO": {"region": "India", "exchange": "BSE"},
    ".SI": {"region": "Singapore", "exchange": "SGX"},
    ".KS": {"region": "South Korea", "exchange": "KRX"},
    ".KQ": {"region": "South Korea", "exchange": "KOSDAQ"},
    ".TW": {"region": "Taiwan", "exchange": "TWSE"},
    ".SW": {"region": "Switzerland", "exchange": "SIX"},
    ".OL": {"region": "Norway", "exchange": "Oslo Bors"},
    ".ST": {"region": "Sweden", "exchange": "Nasdaq Stockholm"},
    ".CO": {"region": "Denmark", "exchange": "Nasdaq Copenhagen"},
    ".HE": {"region": "Finland", "exchange": "Nasdaq Helsinki"},
}


def _project_root() -> Path:
    return Path(__file__).resolve().parent.parent.parent


def _reports_dir() -> Path:
    return _project_root() / "data" / "reports"


def _read_json(path: Path, fallback: Any = None) -> Any:
    try:
        if path.exists():
            with open(path, "r", encoding="utf-8") as handle:
                return json.load(handle)
    except (OSError, ValueError):
        pass
    return fallback


def _write_json(path: Path, value: Any) -> None:
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as handle:
            json.dump(value, handle, indent=2, ensure_ascii=True)
    except OSError:
        pass


def _http_get_json(url: str, timeout: float = 20.0) -> Optional[Any]:
    try:
        response = requests.get(url, headers={"User-Agent": SEC_USER_AGENT}, timeout=timeout)
        if response.status_code != 200:
            return None
        return response.json()
    except requests.RequestException:
        return None


def _iso_to_age_seconds(value: Any) -> Optional[float]:
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(str(value))
    except (TypeError, ValueError):
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return datetime.now(timezone.utc).timestamp() - parsed.timestamp()


def _lookup_cik(lookup: Dict[str, str], ticker: str) -> Optional[str]:
    if ticker in lookup:
        return lookup[ticker]
    # SEC uses a dash for dual-class symbols such as BRK.B -> BRK-B.
    dashed = ticker.replace(".", "-")
    if dashed in lookup:
        return lookup[dashed]
    plain = ticker.split(".")[0]
    if plain in lookup:
        return lookup[plain]
    return None


def resolve_cik(ticker: str) -> Optional[str]:
    """Resolve a ticker to its SEC CIK (without leading zeros).

    Returns None for companies that do not file with the SEC (for example
    home-exchange-only foreign issuers). The bulk ticker->CIK map is cached
    for a week.
    """
    normalized = str(ticker or "").strip().upper()
    if not normalized:
        return None

    cache_path = _reports_dir() / "company_tickers_cache.json"
    cache = _read_json(cache_path)
    if isinstance(cache, dict) and isinstance(cache.get("map"), dict):
        age = _iso_to_age_seconds(cache.get("fetchedAt"))
        if age is not None and age < COMPANY_TICKERS_CACHE_TTL_SECONDS:
            return _lookup_cik(cache["map"], normalized)

    payload = _http_get_json(SEC_COMPANY_TICKERS_URL)
    if isinstance(payload, dict):
        lookup: Dict[str, str] = {}
        for entry in payload.values():
            if not isinstance(entry, dict):
                continue
            symbol = str(entry.get("ticker", "")).strip().upper()
            cik = str(entry.get("cik_str", "")).strip()
            if symbol and cik:
                lookup[symbol] = cik
        if lookup:
            _write_json(cache_path, {
                "map": lookup,
                "fetchedAt": datetime.now(timezone.utc).isoformat(),
            })
            return _lookup_cik(lookup, normalized)

    return None


def fetch_submissions(cik: str) -> Optional[Dict[str, Any]]:
    """Fetch the SEC Submissions JSON for a CIK."""
    try:
        cik_int = int(str(cik).strip())
    except (TypeError, ValueError):
        return None
    return _http_get_json(SEC_SUBMISSIONS_URL.format(cik=cik_int))


def _categorize(form: str) -> str:
    form_key = str(form or "").strip().upper()
    if form_key in ANNUAL_FORMS:
        return "annual"
    if form_key in QUARTERLY_FORMS:
        return "quarterly"
    if form_key in EVENT_FORMS:
        return "events"
    if form_key in GOVERNANCE_FORMS:
        return "governance"
    return "other"


def build_submission_records(submissions: Dict[str, Any], cik: str) -> List[Dict[str, Any]]:
    """Convert the submissions JSON into a flat list of report records."""
    records: List[Dict[str, Any]] = []
    filings = (submissions or {}).get("filings") or {}
    recent = filings.get("recent") if isinstance(filings, dict) else None
    if not isinstance(recent, dict):
        return records

    keys = ("accessionNumber", "filingDate", "reportDate", "form",
            "primaryDocument", "primaryDocDescription", "items", "size")
    columns = {key: recent.get(key) for key in keys}
    lengths = [len(value) for value in columns.values() if isinstance(value, list)]
    count = min(lengths) if lengths else 0

    try:
        cik_int = int(str(cik).strip())
    except (TypeError, ValueError):
        cik_int = 0

    for index in range(count):
        accession = str(columns.get("accessionNumber")[index] or "").strip()
        if not accession:
            continue

        form = str(columns.get("form")[index] or "").strip().upper()
        primary_doc = str(columns.get("primaryDocument")[index] or "").strip()
        filing_date = str(columns.get("filingDate")[index] or "").strip()
        report_date = str(columns.get("reportDate")[index] or "").strip()
        description = str(columns.get("primaryDocDescription")[index] or "").strip()
        items = columns.get("items")[index] if columns.get("items") else ""
        size = columns.get("size")[index] if columns.get("size") else None

        accession_clean = accession.replace("-", "")
        document_url = (
            SEC_ARCHIVES_URL.format(cik=cik_int, accession=accession_clean, document=primary_doc)
            if primary_doc else ""
        )
        filing_index_url = SEC_FILING_INDEX_URL.format(cik=cik_int, accession=accession_clean)

        records.append({
            "form": form,
            "filingDate": filing_date,
            "reportDate": report_date,
            "accessionNumber": accession,
            "primaryDocument": primary_doc,
            "description": description,
            "items": items,
            "documentUrl": document_url,
            "filingIndexUrl": filing_index_url,
            "browseUrl": SEC_BROWSE_URL.format(cik=cik_int, form=form) if form else "",
            "size": size,
        })

    return records


def group_records(records: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    grouped: Dict[str, List[Dict[str, Any]]] = {
        "annual": [], "quarterly": [], "events": [], "governance": [], "other": [],
    }
    for record in records:
        grouped.setdefault(_categorize(record.get("form", "")), []).append(record)
    return grouped


def load_ir_links(ticker: str) -> Dict[str, str]:
    """Load curated Investor Relations links for a ticker."""
    path = _project_root() / "data" / "company_ir_links.json"
    payload = _read_json(path)
    if not isinstance(payload, dict):
        return {}
    entry = payload.get(str(ticker or "").strip().upper())
    return entry if isinstance(entry, dict) else {}


def derive_ir_links(ticker: str) -> Dict[str, str]:
    """Derive the company website from Yahoo Finance.

    Only the company website is derived because it comes directly from the
    Yahoo profile. An Investor Relations URL is intentionally not guessed
    (e.g. `{website}/investors`) because such a page is not guaranteed to
    exist; curated entries in `data/company_ir_links.json` are the only
    source of verified IR links.
    """
    website = ""
    try:
        import yfinance as yf  # imported lazily to keep the fast path light
        info = yf.Ticker(ticker).info or {}
        website = str(info.get("website") or "").strip()
    except Exception:
        website = ""

    links: Dict[str, str] = {}
    if website:
        links["website"] = website
    return links


def load_exchange_metadata(ticker: str) -> Dict[str, str]:
    """Load exchange/region metadata stored in data/tickers.json."""
    path = _project_root() / "data" / "tickers.json"
    payload = _read_json(path)
    exchanges = payload.get("exchanges") if isinstance(payload, dict) else None
    if not isinstance(exchanges, dict):
        return {}
    entry = exchanges.get(str(ticker or "").strip().upper())
    return entry if isinstance(entry, dict) else {}


def resolve_exchange_info(ticker: str) -> Dict[str, str]:
    """Return region/exchange info, preferring stored metadata over suffix defaults."""
    meta = load_exchange_metadata(ticker)
    if meta.get("region") or meta.get("exchange"):
        return meta

    upper = str(ticker or "").strip().upper()
    for suffix, info in SUFFIX_REGION_MAP.items():
        if upper.endswith(suffix):
            return dict(info)
    return {}


def _load_sec_records_cached(ticker: str, cik: str, refresh: bool = False) -> List[Dict[str, Any]]:
    """Fetch SEC records with a per-ticker 24h JSON cache, falling back to the
    stale cache when the network is unavailable."""
    cache_path = _reports_dir() / f"{ticker}.json"

    if not refresh:
        cache = _read_json(cache_path)
        if isinstance(cache, dict) and cache.get("cik") == cik:
            age = _iso_to_age_seconds(cache.get("fetchedAt"))
            if age is not None and age < REPORTS_CACHE_TTL_SECONDS and isinstance(cache.get("records"), list):
                return cache["records"]

    submissions = fetch_submissions(cik)
    if not submissions:
        cache = _read_json(cache_path)
        if isinstance(cache, dict) and isinstance(cache.get("records"), list):
            return cache["records"]
        return []

    records = build_submission_records(submissions, cik)
    if records:
        _write_json(cache_path, {
            "ticker": ticker,
            "cik": cik,
            "name": submissions.get("name", ""),
            "fetchedAt": datetime.now(timezone.utc).isoformat(),
            "records": records,
        })
    return records


def _pick(row: Dict[str, Any], keys: List[str]) -> Any:
    for key in keys:
        value = row.get(key)
        if value is not None and str(value).strip() not in ("", "nan", "None", "NaT"):
            return value
    return ""


def _row_to_record(row: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Tolerantly map a parquet row (yfinance old/new column names) to a record."""
    form = str(_pick(row, ["Form", "form"])).strip().upper()
    accession = str(_pick(row, ["Accession Number", "accessionNumber", "AccessionNumber"])).strip()
    if not form and not accession:
        return None

    return {
        "form": form or "FILING",
        "filingDate": str(_pick(row, ["Filing Date", "filingDate", "FilingDate"])).strip(),
        "reportDate": str(_pick(row, ["Report Date", "reportDate", "ReportDate"])).strip(),
        "accessionNumber": accession,
        "primaryDocument": str(_pick(row, ["Primary Document", "primaryDocument", "PrimaryDocument"])).strip(),
        "description": str(_pick(row, ["Primary Doc Description", "primaryDocDescription", "Type", "type"])).strip(),
        "items": "",
        "documentUrl": "",
        "filingIndexUrl": "",
        "browseUrl": "",
        "size": None,
    }


def _load_parquet_fallback(ticker: str) -> List[Dict[str, Any]]:
    """Load SEC filing metadata from the local parquet cache (offline fallback)."""
    try:
        import pandas as pd  # imported lazily
        from data_management.stock_data_manager import StockDataManager

        manager = StockDataManager(_project_root() / "data")
        frame = manager.get_fundamental_data(ticker, "sec_filings")
        if frame is None or getattr(frame, "empty", True):
            return []

        records: List[Dict[str, Any]] = []
        for _, row in frame.iterrows():
            row_dict = {str(key): value for key, value in row.items()}
            record = _row_to_record(row_dict)
            if record:
                records.append(record)
        return records
    except Exception:
        return []


def get_company_reports(ticker: str, refresh: bool = False) -> Dict[str, Any]:
    """Return categorized report links for a ticker (JSON-serializable dict)."""
    normalized = str(ticker or "").strip().upper()
    if not normalized:
        return {"ok": False, "error": "Ticker symbol is required", "ticker": ""}

    result: Dict[str, Any] = {
        "ok": True,
        "ticker": normalized,
        "cik": None,
        "name": "",
        "hasSecFilings": False,
        "source": "none",
        "region": "",
        "exchange": "",
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
        "reports": {"ir": [], "annual": [], "quarterly": [], "events": [], "governance": [], "other": []},
    }

    exchange_info = resolve_exchange_info(normalized)
    result["region"] = exchange_info.get("region", "")
    result["exchange"] = exchange_info.get("exchange", "")

    # IR links: curated config first, then derived from the company website.
    ir_links = dict(load_ir_links(normalized))
    derived = derive_ir_links(normalized)
    for key in ("irUrl", "annualReportUrl", "presentationsUrl", "esgUrl", "website"):
        if not ir_links.get(key):
            ir_links[key] = derived.get(key, "")

    ir_list = []
    for label, key in (
        ("Investor relations", "irUrl"),
        ("Annual report", "annualReportUrl"),
        ("Presentations", "presentationsUrl"),
        ("ESG / sustainability", "esgUrl"),
        ("Company website", "website"),
    ):
        url = str(ir_links.get(key) or "").strip()
        if url:
            ir_list.append({"label": label, "url": url})
    result["reports"]["ir"] = ir_list

    # SEC EDGAR filings.
    cik = resolve_cik(normalized)
    if cik:
        result["cik"] = cik
        records = _load_sec_records_cached(normalized, cik, refresh=refresh)
        if records:
            result["hasSecFilings"] = True
            result["source"] = "sec_edgar"
            grouped = group_records(records)
        else:
            records = _load_parquet_fallback(normalized)
            if records:
                result["hasSecFilings"] = True
                result["source"] = "local_cache"
            grouped = group_records(records)
    else:
        records = _load_parquet_fallback(normalized)
        if records:
            result["hasSecFilings"] = True
            result["source"] = "local_cache"
        grouped = group_records(records)

    for key in ("annual", "quarterly", "events", "governance", "other"):
        result["reports"][key] = grouped.get(key, [])

    if not result["hasSecFilings"]:
        result["source"] = "ir_only"

    return result


if __name__ == "__main__":
    import sys

    symbol = sys.argv[1] if len(sys.argv) > 1 else "AAPL"
    print(json.dumps(get_company_reports(symbol), ensure_ascii=True, indent=2))
