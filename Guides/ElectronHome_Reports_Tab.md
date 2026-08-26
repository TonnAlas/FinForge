# ElectronHome — Company Reports Tab

This guide documents the **Reports** subtab on the company page. The tab lists
company-prepared reports for a selected ticker: annual reports, quarterly
reports, current events/press releases, governance filings, and Investor
Relations links.

## Overview

The Reports tab is a per-company subtab (alongside Overview, Insiders,
Research, Ownership, and Estimates). It fetches report links on first open and
shows them grouped by category. Each row links out to the underlying document,
which opens in the default external browser.

Data comes from two sources:

1. **SEC EDGAR Submissions API** — the primary automated source. It is free,
   keyless, and covers every company that files with the U.S. SEC: US-listed
   companies (10-K, 10-Q, 8-K, DEF 14A) and foreign companies that file with
   the SEC, such as ADR issuers (20-F, 6-K).
2. **Investor Relations links** — the universal fallback. Every public company
   publishes annual/interim reports on its IR site, so this works even for
   companies that do not file with the SEC (home-exchange-only issuers in
   Europe and Asia). Links come from `data/company_ir_links.json` when curated,
   otherwise from the company website reported by Yahoo Finance.

## Data flow

```
Reports tab clicked
  -> switchView('reports')
  -> loadSelectedCompanyReports(refresh)            (renderer.js)
  -> window.finforge.loadCompanyReports(ticker)     (preload.js)
  -> ipcMain 'finforge:loadCompanyReports'          (main.js)
  -> loadCompanyReports(ticker, refresh)            (main.js, spawns Python)
  -> Internal.Reports.company_reports.get_company_reports(ticker, refresh)
  -> JSON printed to stdout -> parsed -> returned to renderer
  -> renderReportsContent() renders grouped links
```

## Files

| File | Role |
|---|---|
| `Internal/Reports/company_reports.py` | New data provider (SEC EDGAR + IR links + caches) |
| `Internal/Reports/__init__.py` | Package marker |
| `data/company_ir_links.json` | Curated per-ticker Investor Relations links |
| `data/reports/` | Runtime caches (`company_tickers_cache.json`, `{TICKER}.json`) |
| `ElectronHome/main.js` | `buildCompanyReportsCommand`, `loadCompanyReports`, IPC handler |
| `ElectronHome/preload.js` | `loadCompanyReports(ticker, refresh)` bridge method |
| `ElectronHome/src/renderer.js` | Reports tab UI, state, and lazy-loading |
| `Internal/ticker_management/fetch_stocks.py` | Persists exchange/region metadata |

## Python module: `Internal/Reports/company_reports.py`

Public entry point:

```python
get_company_reports(ticker: str, refresh: bool = False) -> dict
```

### Output shape

```json
{
  "ok": true,
  "ticker": "AAPL",
  "cik": "320193",
  "name": "",
  "hasSecFilings": true,
  "source": "sec_edgar",
  "region": "",
  "exchange": "",
  "fetchedAt": "2026-08-19T...",
  "reports": {
    "ir": [ { "label": "Investor relations", "url": "https://..." } ],
    "annual":     [ report_record ],
    "quarterly":  [ report_record ],
    "events":     [ report_record ],
    "governance": [ report_record ],
    "other":      [ report_record ]
  }
}
```

### Report record shape

```json
{
  "form": "10-K",
  "filingDate": "2025-10-31",
  "reportDate": "2025-09-27",
  "accessionNumber": "0000320193-25-000079",
  "primaryDocument": "aapl-20250927.htm",
  "description": "10-K",
  "documentUrl": "https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/aapl-20250927.htm",
  "filingIndexUrl": "https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/",
  "browseUrl": "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=320193&type=10-K",
  "size": 9392337
}
```

### Functions

- `resolve_cik(ticker) -> str | None` — maps a ticker to its SEC CIK via the
  cached bulk `company_tickers.json`. Returns `None` for companies that do not
  file with the SEC.
- `fetch_submissions(cik) -> dict | None` — GET the SEC Submissions JSON for a
  10-digit CIK.
- `build_submission_records(submissions, cik) -> list` — flattens the
  submissions JSON into report records and builds document URLs.
- `_categorize(form) -> str` — maps a form type to `annual`, `quarterly`,
  `events`, `governance`, or `other`.
- `load_ir_links(ticker) -> dict` — reads curated IR links from
  `data/company_ir_links.json`.
- `derive_ir_links(ticker) -> dict` — derives only the company website from
  Yahoo Finance (no IR URL is guessed).
- `load_exchange_metadata(ticker) -> dict` — reads the `exchanges` map in
  `data/tickers.json`.
- `resolve_exchange_info(ticker) -> dict` — region/exchange, preferring stored
  metadata over Yahoo suffix defaults.
- `_load_sec_records_cached(ticker, cik, refresh) -> list` — SEC fetch with a
  24-hour per-ticker JSON cache and stale-cache fallback.
- `_load_parquet_fallback(ticker) -> list` — offline fallback that reads
  `data/fundamentals/sec_filings/{TICKER}.parquet`.

### Form-type categories

- **Annual**: `10-K`, `20-F`, `40-F`, `ARS` (and `/A` amendments).
- **Quarterly**: `10-Q`, `6-K` (and `/A` amendments).
- **Events**: `8-K` (current reports and earnings press releases).
- **Governance**: `DEF 14A/C`, `PRE 14A/C` (proxies), `S-1/S-3/S-4`
  (registrations), `424B*` (prospectuses), `SC 13D/G` (beneficial ownership).
- **Other**: everything else (e.g. `SD`, `11-K`, `3`, `5`, `4`, `144`).

## Configuration

- `data/company_ir_links.json` — object keyed by ticker. Recognized keys:
  `irUrl`, `annualReportUrl`, `presentationsUrl`, `esgUrl`. Only the company
  website is derived from Yahoo; IR links must be curated here because guessed
  IR paths are not guaranteed to exist. Example:

```json
{
  "MSFT": {
    "irUrl": "https://www.microsoft.com/en-us/Investor",
    "annualReportUrl": "https://www.microsoft.com/en-us/Investor/annual-reports.aspx",
    "esgUrl": "https://www.microsoft.com/en-us/corporate-responsibility"
  }
}
```

- SEC User-Agent — set via the `FINFORGE_SEC_USER_AGENT` environment variable,
  defaulting to `FinForge investor-terminal contact@example.com`. Replace the
  contact placeholder with the operator's contact per SEC policy.
- Cache TTLs are constants at the top of the module:
  `COMPANY_TICKERS_CACHE_TTL_SECONDS` (7 days) and
  `REPORTS_CACHE_TTL_SECONDS` (24 hours).

## Exchange/region metadata

`Internal/ticker_management/fetch_stocks.py` now writes an `exchanges` map into
`data/tickers.json` during each data fetch:

```json
{
  "tickers": ["AAPL"],
  "last_updated": "...",
  "exchanges": {
    "AAPL": { "exchange": "NMS", "fullExchangeName": "NasdaqGS", "region": "United States" }
  }
}
```

The Electron `saveImportList` handler preserves this map when the user edits
the import list. The Reports module uses it for the region label and as the
hook for future country-specific regulatory adapters.

## Renderer functions (`ElectronHome/src/renderer.js`)

- `renderReportsContent()` — renders the tab body (IR links + grouped filing
  sections + source line) with loading/error/empty states.
- `renderIrLinks(links)` — renders the Investor Relations link grid.
- `renderReportRows(records)` / `renderReportRow(record)` — render grouped
  filing rows with an Open button.
- `loadSelectedCompanyReports(refresh)` — lazy-loads reports with a
  request-id guard; updates `state.companyReports*`.
- `updateCompanyReportsContent()` — re-renders the reports pane in place when
  the Reports tab is active.

## Environment requirements

- Python packages: `requests` (SEC API), `pandas` + `pyarrow` (parquet
  fallback only), `yfinance` (IR derivation and profile data). All are already
  in `requirements.txt`.
- Network access to `data.sec.gov` and `www.sec.gov`.
- The Electron app must be running with the Python venv available at
  `.venv/Scripts/python.exe` (or `python` on PATH).

## Limitations and assumptions

- SEC EDGAR only covers companies that file with the SEC. Home-exchange-only
  issuers get IR links only, with a note shown in the tab.
- IR links are shown only from curated entries in `data/company_ir_links.json`;
  they are never guessed from the website because a guessed IR path is not
  guaranteed to exist. The company website itself is still derived from Yahoo.
- The SEC bulk ticker->CIK map is cached for 7 days; a brand-new listing may
  not resolve until the cache refreshes.
- Per-country regulators (Japan EDINET, Hong Kong HKEXnews, UK Companies
  House, etc.) are intentionally out of scope for this iteration.

## Example usage

From the venv, to validate the data layer manually:

```
python -c "from Internal.Reports.company_reports import get_company_reports; import json; print(json.dumps(get_company_reports('AAPL'), ensure_ascii=True, indent=2))"
```

Or run the module directly:

```
python Internal/Reports/company_reports.py AAPL
```
