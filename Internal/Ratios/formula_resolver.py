"""
Shared financial-formula tokenizer, parser and data resolver.

This module is the single source of truth for:

- Parsing metric formulas (parentheses, operator precedence, numeric literals).
- Resolving ``SHEET: Field [MODE]`` references against stored parquet/JSON data.
- The field mappings for price, metadata, holders, estimates and analyst data.

Both :mod:`Internal.Ratios.ratio_calculator` (the Excel "Metrics" sheet) and
:mod:`Internal.Ratios.metric_history` (the ElectronHome charts / ranking engine)
import from here so the two surfaces always agree on parsing and on the value a
given reference resolves to.

All fundamental/price values are RAW as stored by the data fetcher (no display
scaling). The Excel statement sheets display values divided by a display divisor
(millions by default); the metric engines intentionally do NOT apply that divisor
so unitless ratios are computed from full-precision raw values.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import pandas as pd

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = ROOT_DIR / "data"
FUNDAMENTALS_DIR = DATA_DIR / "fundamentals"
PRICES_DIR = DATA_DIR / "prices"
HOLDERS_DIR = DATA_DIR / "holders"
METADATA_DIR = DATA_DIR / "metadata"

SHEET_TO_DIR = {
    "BS": "balance_sheet",
    "IS": "income_statement",
    "CF": "cash_flow",
}

QUARTERLY_SHEET_TO_DIR = {
    "BS": "quarterly_balance_sheet",
    "IS": "quarterly_income_statement",
    "CF": "quarterly_cash_flow",
}

# Price field label -> Parquet column.
PRICE_FIELD_MAP = {
    "high price": "High",
    "high": "High",
    "low price": "Low",
    "low": "Low",
    "open price": "Open",
    "open": "Open",
    "close price": "Close",
    "close": "Close",
    "closing price": "Close",
    "adjusted close": "Adj Close",
    "adj close": "Adj Close",
    "volume": "Volume",
    "dividends": "Dividends",
    "stock splits": "Stock Splits",
}

# Metric-builder M: labels -> Yahoo Ticker.info keys.
METADATA_FIELD_MAP = {
    "market cap": "marketCap",
    "enterprise value": "enterpriseValue",
    "pe ratio": "trailingPE",
    "forward pe": "forwardPE",
    "peg ratio": "pegRatio",
    "ps ratio": "priceToSalesTrailing12Months",
    "pb ratio": "priceToBook",
    "eps": "trailingEps",
    "forward eps": "forwardEps",
    "dividend yield": "dividendYield",
    "dividend rate": "dividendRate",
    "beta": "beta",
    "52 week high": "fiftyTwoWeekHigh",
    "52 week low": "fiftyTwoWeekLow",
    "50 day ma": "fiftyDayAverage",
    "200 day ma": "twoHundredDayAverage",
    "shares outstanding": "sharesOutstanding",
    "float shares": "floatShares",
    "short ratio": "shortRatio",
    "revenue ttm": "totalRevenue",
    "gross profit ttm": "grossProfits",
    "operating margin": "operatingMargins",
    "profit margin": "profitMargins",
    "roa": "returnOnAssets",
    "roe": "returnOnEquity",
    "revenue per share": "revenuePerShare",
    "book value per share": "bookValue",
    "free cash flow": "freeCashflow",
    "current ratio": "currentRatio",
    "debt to equity": "debtToEquity",
    "number of analysts": "numberOfAnalystOpinions",
}

# Holder labels. Values stored by yfinance are FRACTIONS (0.66417 == 66.417%),
# so the percentage fields are multiplied by 100 to match their "%" label.
# ``mutual fund ownership %`` is not present in the stored major_holders table
# and therefore resolves to None (documented limitation).
HOLDER_PERCENT_FIELDS = {
    "institutional ownership %": ("major_holders", "institutionsPercentHeld"),
    "insider ownership %": ("major_holders", "insidersPercentHeld"),
    "mutual fund ownership %": ("major_holders", "mutualFundPercentHeld"),
}

# Estimate labels -> (parquet data_type, period, column).
ESTIMATE_FIELD_MAP = {
    "eps estimate current quarter": ("earnings_estimate", "0q", "avg"),
    "eps estimate next quarter": ("earnings_estimate", "+1q", "avg"),
    "eps estimate current year": ("earnings_estimate", "0y", "avg"),
    "eps estimate next year": ("earnings_estimate", "+1y", "avg"),
    "revenue estimate current quarter": ("revenue_estimate", "0q", "avg"),
    "revenue estimate next quarter": ("revenue_estimate", "+1q", "avg"),
    "revenue estimate current year": ("revenue_estimate", "0y", "avg"),
    "revenue estimate next year": ("revenue_estimate", "+1y", "avg"),
    "growth estimate current quarter": ("growth_estimates", "0q", "stockTrend"),
    "growth estimate next quarter": ("growth_estimates", "+1q", "stockTrend"),
    "growth estimate current year": ("growth_estimates", "0y", "stockTrend"),
    "growth estimate next year": ("growth_estimates", "+1y", "stockTrend"),
    "number of analysts eps": ("earnings_estimate", "0y", "numberOfAnalysts"),
    "number of analysts revenue": ("revenue_estimate", "0y", "numberOfAnalysts"),
}

# Analyst labels -> (parquet data_type, period or None, column).
ANALYST_FIELD_MAP = {
    "strong buy count": ("recommendations_summary", "0m", "strongBuy"),
    "buy count": ("recommendations_summary", "0m", "buy"),
    "hold count": ("recommendations_summary", "0m", "hold"),
    "sell count": ("recommendations_summary", "0m", "sell"),
    "strong sell count": ("recommendations_summary", "0m", "strongSell"),
    "target mean price": ("analyst_price_targets", None, "mean"),
    "target high price": ("analyst_price_targets", None, "high"),
    "target low price": ("analyst_price_targets", None, "low"),
}

# Approximate number of trading rows per calendar unit for price offsets and
# rolling windows. These are documented approximations (Yahoo daily bars).
_OFFSET_ROWS = {"D": 1, "W": 5, "M": 21, "Y": 252}


# ── Formula tokenization and AST parsing ──────────────────────────────────────

_NUM_RE = re.compile(r"\d+(?:\.\d+)?")
_PREFIX_RE = re.compile(r"[A-Za-z]+:")


def tokenize(formula: str) -> list:
    """Turn a formula string into a flat token list.

    Tokens are either operator strings (``+ - * / ( )``), ``("NUM", float)``
    or ``("ID", prefix, item)``. ``[...]`` regions are kept inside the item so
    mode suffixes like ``[-15D]`` or ``[TTM]`` never trigger operator handling.
    """
    text = (formula or "").strip()
    if text.startswith("="):
        text = text[1:].lstrip()

    tokens: list = []
    i, n = 0, len(text)
    while i < n:
        ch = text[i]
        if ch.isspace():
            i += 1
            continue
        if ch in "()+-*/":
            tokens.append(ch)
            i += 1
            continue

        num_match = _NUM_RE.match(text, i)
        if num_match:
            tokens.append(("NUM", float(num_match.group(0))))
            i = num_match.end()
            continue

        prefix_match = _PREFIX_RE.match(text, i)
        if prefix_match:
            prefix = prefix_match.group(0)[:-1].upper()
            i = prefix_match.end()

            item_chars: list = []
            while i < n:
                ch = text[i]
                if ch == "[":
                    close = text.find("]", i)
                    if close == -1:
                        item_chars.append(text[i:])
                        i = n
                    else:
                        item_chars.append(text[i:close + 1])
                        i = close + 1
                    continue
                if ch in "()+-*/":
                    break
                item_chars.append(ch)
                i += 1

            tokens.append(("ID", prefix, "".join(item_chars).strip()))
            continue

        i += 1  # skip any unrecognized character

    return tokens


def parse_formula_ast(formula: str):
    """Parse a formula into an AST, or return None when the formula is empty.

    AST nodes:
        ("NUM", value)                      numeric literal
        ("ID", sheet, item)                 ``SHEET: Field [MODE]`` reference
        ("BIN", op, left, right)            binary operation

    Precedence: ``* /`` bind tighter than ``+ -``; parentheses override.
    """
    tokens = tokenize(formula)
    if not tokens:
        return None

    pos = 0

    def peek():
        return tokens[pos] if pos < len(tokens) else None

    def advance():
        nonlocal pos
        pos += 1

    def parse_expr():
        node = parse_term()
        while peek() in ("+", "-"):
            op = peek()
            advance()
            node = ("BIN", op, node, parse_term())
        return node

    def parse_term():
        node = parse_factor()
        while peek() in ("*", "/"):
            op = peek()
            advance()
            node = ("BIN", op, node, parse_factor())
        return node

    def parse_factor():
        token = peek()
        if token == "(":
            advance()
            node = parse_expr()
            if peek() == ")":
                advance()
            return node
        if isinstance(token, tuple) and token[0] == "NUM":
            advance()
            return ("NUM", token[1])
        if isinstance(token, tuple) and token[0] == "ID":
            advance()
            return ("ID", token[1], token[2])
        advance()  # skip an unexpected token
        return ("NUM", None)

    return parse_expr()


def eval_ast(node, resolve):
    """Evaluate an AST. ``resolve(sheet, item)`` must return a float or None."""
    if node is None:
        return None

    kind = node[0]

    if kind == "NUM":
        try:
            return float(node[1])
        except (TypeError, ValueError):
            return None

    if kind == "ID":
        value = resolve(node[1], node[2])
        try:
            return float(value)
        except (TypeError, ValueError):
            return None

    if kind == "BIN":
        op = node[1]
        left = eval_ast(node[2], resolve)
        right = eval_ast(node[3], resolve)
        if left is None or right is None:
            return None
        if op == "/":
            if right == 0:
                return None
            return left / right
        if op == "*":
            return left * right
        if op == "+":
            return left + right
        if op == "-":
            return left - right

    return None


# ── Mode suffix parsing ───────────────────────────────────────────────────────

_MODE_SUFFIX_RE = re.compile(r"\[([^\]]*)\]$")


def split_field_mode(item: str):
    """Split an item string into ``(field, mode)``.

    ``mode`` is None for a plain reference, otherwise a tuple such as
    ``("ttm",)``, ``("offset", 15, "D")`` or ``("custom", 4, "Q", "SUM")``.
    """
    item = (item or "").strip()
    match = _MODE_SUFFIX_RE.search(item)
    if not match:
        return item, None
    return item[:match.start()].strip(), _parse_mode(match.group(1).strip())


def _parse_mode(mode_text: str):
    text = (mode_text or "").upper()
    if text == "TTM":
        return ("ttm",)
    if text == "QUARTER":
        return ("quarter",)
    if text == "ANNUAL":
        return ("annual",)
    if text == "PREVIOUS":
        return ("previous",)
    if text == "YOY":
        return ("yoy",)

    match = re.match(r"^TRAILING[:\s]*(\d+)[_\s]*([A-Z]+)$", text)
    if match:
        return ("trailing", int(match.group(1)), match.group(2))

    match = re.match(r"^CUSTOM[:\s]*(\d+)([QY])[_\s]*([A-Z]+)$", text)
    if match:
        return ("custom", int(match.group(1)), match.group(2), match.group(3))

    match = re.match(r"^-?(\d+)([DWMY])$", text)
    if match:
        return ("offset", int(match.group(1)), match.group(2))

    return None


# ── Data loaders ──────────────────────────────────────────────────────────────

def _load_wide(ticker: str, dir_name: str) -> pd.DataFrame:
    path = FUNDAMENTALS_DIR / dir_name / f"{ticker.upper()}.parquet"
    if not path.exists():
        return pd.DataFrame()
    return pd.read_parquet(path)


def _series_from_wide(df: pd.DataFrame, field: str) -> pd.Series:
    """Extract one line item from a wide fundamental frame as a date-indexed Series.

    Matching is exact and case-insensitive (no substring fallback, which could
    bind a short name to the wrong line item).
    """
    if df.empty or "index" not in df.columns:
        return pd.Series(dtype=float)

    rows = df[df["index"].astype(str).str.strip().str.lower() == field.lower()]
    if rows.empty:
        return pd.Series(dtype=float)

    meta = {"index", "ticker", "last_updated"}
    date_cols = [col for col in rows.columns if col not in meta]

    row = rows.iloc[0]
    values = {}
    for col in date_cols:
        value = row[col]
        if pd.notna(value):
            try:
                values[pd.Timestamp(col)] = float(value)
            except (ValueError, TypeError):
                continue
    return pd.Series(values).sort_index()


def _load_prices(ticker: str) -> pd.DataFrame:
    path = PRICES_DIR / f"{ticker.upper()}.parquet"
    if not path.exists():
        return pd.DataFrame()
    df = pd.read_parquet(path)
    if df.empty:
        return df
    if "Date" in df.columns:
        df["Date"] = pd.to_datetime(df["Date"])
        df = df.sort_values("Date").reset_index(drop=True)
    return df


def _load_metadata(ticker: str):
    path = METADATA_DIR / f"{ticker.upper()}.json"
    if not path.exists():
        return None
    try:
        with open(path, "r", encoding="utf-8") as handle:
            return json.load(handle)
    except (OSError, ValueError):
        return None


def _snapshot_series(value, updated):
    """Wrap a single snapshot value into a one-point date-indexed Series."""
    if value is None:
        return pd.Series(dtype=float)
    try:
        index = pd.Timestamp(updated)
    except (TypeError, ValueError):
        index = pd.Timestamp.now()
    return pd.Series([float(value)], index=[index])


# ── Fundamental resolution ────────────────────────────────────────────────────

def _apply_fundamental_mode(annual: pd.Series, quarterly: pd.Series, mode):
    """Apply a fundamental mode to annual/quarterly series (ascending by date)."""
    if mode is None or mode[0] in ("latest", "annual"):
        annual = annual.dropna()
        if not annual.empty:
            return annual
        return quarterly.dropna()

    if mode[0] == "quarter":
        return quarterly.dropna()

    if mode[0] == "ttm":
        q = quarterly.dropna().sort_index()
        out = {}
        values = q.tolist()
        dates = q.index.tolist()
        for i in range(len(values)):
            window = values[max(0, i - 3):i + 1]
            if len(window) >= 1:
                out[dates[i]] = float(sum(window))
        return pd.Series(out).sort_index()

    if mode[0] == "previous":
        a = annual.dropna().sort_index()
        if len(a) >= 2:
            return a.shift(1).dropna()
        return quarterly.dropna().sort_index().shift(1).dropna()

    if mode[0] == "yoy":
        q = quarterly.dropna().sort_index()
        if len(q) >= 5:
            out = {}
            for i in range(4, len(q)):
                current, prior = q.iloc[i], q.iloc[i - 4]
                if prior:
                    out[q.index[i]] = (current - prior) / abs(prior) * 100.0
            return pd.Series(out).sort_index()
        a = annual.dropna().sort_index()
        out = {}
        for i in range(1, len(a)):
            current, prior = a.iloc[i], a.iloc[i - 1]
            if prior:
                out[a.index[i]] = (current - prior) / abs(prior) * 100.0
        return pd.Series(out).sort_index()

    if mode[0] == "custom":
        _, count, unit, agg = mode
        base = (quarterly if unit == "Q" else annual).dropna().sort_index()
        if base.empty:
            return pd.Series(dtype=float)
        out = {}
        values = base.tolist()
        dates = base.index.tolist()
        for i in range(len(values)):
            window = values[max(0, i - count + 1):i + 1]
            if not window:
                continue
            if agg == "SUM":
                out[dates[i]] = float(sum(window))
            elif agg in ("AVG", "AVERAGE"):
                out[dates[i]] = float(sum(window) / len(window))
            else:  # SINGLE
                out[dates[i]] = float(values[i])
        return pd.Series(out).sort_index()

    return pd.Series(dtype=float)


def _resolve_fundamental_series(ticker: str, sheet: str, field: str, mode, cache: dict) -> pd.Series:
    annual_key = f"annual_{sheet}_{ticker}"
    quarterly_key = f"quarterly_{sheet}_{ticker}"

    if annual_key not in cache:
        cache[annual_key] = _load_wide(ticker, SHEET_TO_DIR[sheet])
    if quarterly_key not in cache:
        cache[quarterly_key] = _load_wide(ticker, QUARTERLY_SHEET_TO_DIR[sheet])

    annual = _series_from_wide(cache[annual_key], field)
    quarterly = _series_from_wide(cache[quarterly_key], field)
    return _apply_fundamental_mode(annual, quarterly, mode)


# ── Price resolution ──────────────────────────────────────────────────────────

def _resolve_price_series(ticker: str, field: str, mode, cache: dict) -> pd.Series:
    key = f"P_{ticker}"
    if key not in cache:
        cache[key] = _load_prices(ticker)
    df = cache[key]
    if df is None or df.empty or "Date" not in df.columns:
        return pd.Series(dtype=float)

    close = pd.Series(df["Close"].values, index=df["Date"].values, dtype=float).sort_index()

    field_lower = field.lower()

    if field_lower in ("change", "price change"):
        offset_rows = _mode_offset_rows(mode)
        return (close - close.shift(offset_rows)).dropna()

    if field_lower in ("change percent", "change %", "percent change", "price change percent"):
        offset_rows = _mode_offset_rows(mode)
        prior = close.shift(offset_rows)
        result = (close - prior) / prior.replace(0, pd.NA) * 100.0
        return result.dropna()

    if field_lower == "previous close":
        return close.shift(1).dropna()

    column = PRICE_FIELD_MAP.get(field_lower)
    if column is None or column not in df.columns:
        return pd.Series(dtype=float)

    base = pd.Series(df[column].values, index=df["Date"].values, dtype=float).sort_index()
    return _apply_price_mode(base, mode)


def _mode_offset_rows(mode):
    """Trading-day row offset for an offset mode; 1 when no offset is given."""
    if mode and mode[0] == "offset":
        unit = mode[2]
        return max(1, int(mode[1]) * _OFFSET_ROWS.get(unit, 1))
    return 1


def _apply_price_mode(base: pd.Series, mode) -> pd.Series:
    if mode is None:
        return base.dropna()

    if mode[0] == "offset":
        rows = max(1, int(mode[1]) * _OFFSET_ROWS.get(mode[2], 1))
        return base.shift(rows).dropna()

    if mode[0] == "trailing":
        _, periods, agg = mode
        window = base.rolling(periods, min_periods=1)
        if agg == "SUM":
            return window.sum().dropna()
        if agg == "MAX":
            return window.max().dropna()
        if agg == "MIN":
            return window.min().dropna()
        return window.mean().dropna()  # AVERAGE / AVG

    return base.dropna()


# ── Snapshot (M / H / E / A) resolution ───────────────────────────────────────

def _resolve_metadata_series(ticker: str, field: str, cache: dict) -> pd.Series:
    key = f"M_{ticker}"
    if key not in cache:
        cache[key] = _load_metadata(ticker)
    meta = cache[key]
    if not isinstance(meta, dict):
        return pd.Series(dtype=float)

    info_key = METADATA_FIELD_MAP.get(field.lower())
    if info_key is None:
        return pd.Series(dtype=float)

    value = meta.get(info_key)
    try:
        value = float(value)
    except (TypeError, ValueError):
        return pd.Series(dtype=float)

    return _snapshot_series(value, meta.get("last_updated"))


def _load_holders_frame(ticker: str, holder_type: str) -> pd.DataFrame:
    path = HOLDERS_DIR / holder_type / f"{ticker.upper()}.parquet"
    if not path.exists():
        return pd.DataFrame()
    return pd.read_parquet(path)


def _resolve_holder_series(ticker: str, field: str, cache: dict) -> pd.Series:
    field_lower = field.lower()

    if field_lower == "top institutional holders count":
        df = _load_holders_frame(ticker, "institutional_holders")
        if df.empty:
            return pd.Series(dtype=float)
        updated = df["last_updated"].iloc[0] if "last_updated" in df.columns else None
        return _snapshot_series(len(df), updated)

    if field_lower == "top mutual fund holders count":
        df = _load_holders_frame(ticker, "mutualfund_holders")
        if df.empty:
            return pd.Series(dtype=float)
        updated = df["last_updated"].iloc[0] if "last_updated" in df.columns else None
        return _snapshot_series(len(df), updated)

    spec = HOLDER_PERCENT_FIELDS.get(field_lower)
    if spec is None:
        return pd.Series(dtype=float)

    holder_type, index_key = spec
    df = _load_holders_frame(ticker, holder_type)
    if df.empty or "index" not in df.columns:
        return pd.Series(dtype=float)

    rows = df[df["index"].astype(str).str.strip().str.lower() == index_key.lower()]
    if rows.empty:
        return pd.Series(dtype=float)

    value = rows.iloc[0].get("Value")
    try:
        value = float(value)
    except (TypeError, ValueError):
        return pd.Series(dtype=float)

    updated = rows.iloc[0].get("last_updated")
    return _snapshot_series(value * 100.0, updated)


def _load_estimate_frame(ticker: str, data_type: str) -> pd.DataFrame:
    return _load_wide(ticker, data_type)


def _resolve_estimate_series(ticker: str, field: str, cache: dict) -> pd.Series:
    spec = ESTIMATE_FIELD_MAP.get(field.lower())
    if spec is None:
        return pd.Series(dtype=float)

    data_type, period, column = spec
    df = _load_estimate_frame(ticker, data_type)
    if df.empty or "period" not in df.columns:
        return pd.Series(dtype=float)

    rows = df[df["period"].astype(str).str.strip() == period]
    if rows.empty or column not in rows.columns:
        return pd.Series(dtype=float)

    value = rows.iloc[0].get(column)
    try:
        value = float(value)
    except (TypeError, ValueError):
        return pd.Series(dtype=float)

    updated = rows.iloc[0].get("last_updated")
    return _snapshot_series(value, updated)


def _resolve_analyst_series(ticker: str, field: str, cache: dict) -> pd.Series:
    spec = ANALYST_FIELD_MAP.get(field.lower())
    if spec is None:
        return pd.Series(dtype=float)

    data_type, period, column = spec
    df = _load_wide(ticker, data_type)
    if df.empty or column not in df.columns:
        return pd.Series(dtype=float)

    if period is not None:
        if "period" not in df.columns:
            return pd.Series(dtype=float)
        rows = df[df["period"].astype(str).str.strip() == period]
    else:
        rows = df

    if rows.empty:
        return pd.Series(dtype=float)

    value = rows.iloc[0].get(column)
    try:
        value = float(value)
    except (TypeError, ValueError):
        return pd.Series(dtype=float)

    updated = rows.iloc[0].get("last_updated")
    return _snapshot_series(value, updated)


# ── Public entry points ───────────────────────────────────────────────────────

def resolve_series(ticker: str, sheet: str, item: str, cache: dict | None = None) -> pd.Series:
    """Resolve a leaf reference to an ascending date-indexed Series of floats.

    METRIC:/RATIO: references are NOT resolved here (they require recursive
    formula evaluation, which the calling engine owns).
    """
    cache = cache if cache is not None else {}
    field, mode = split_field_mode(item)
    sheet_upper = (sheet or "").upper()

    if sheet_upper == "P":
        return _resolve_price_series(ticker, field, mode, cache)
    if sheet_upper in SHEET_TO_DIR:
        return _resolve_fundamental_series(ticker, sheet_upper, field, mode, cache)
    if sheet_upper == "M":
        return _resolve_metadata_series(ticker, field, cache)
    if sheet_upper == "H":
        return _resolve_holder_series(ticker, field, cache)
    if sheet_upper == "E":
        return _resolve_estimate_series(ticker, field, cache)
    if sheet_upper == "A":
        return _resolve_analyst_series(ticker, field, cache)

    # Unknown sheet types resolve to nothing (never fall back to another sheet).
    return pd.Series(dtype=float)


def resolve_latest(ticker: str, sheet: str, item: str, cache: dict | None = None):
    """Return the most recent non-null value for a leaf reference, or None."""
    series = resolve_series(ticker, sheet, item, cache)
    if series is None or series.empty:
        return None
    series = series.dropna()
    if series.empty:
        return None
    return float(series.iloc[-1])


def resolve_at_date(ticker: str, sheet: str, item: str, date_col, cache: dict | None = None):
    """Return the value for a reference at-or-before ``date_col``, or None."""
    series = resolve_series(ticker, sheet, item, cache)
    if series is None or series.empty:
        return None
    try:
        target = pd.Timestamp(date_col)
    except (TypeError, ValueError):
        return None
    before = series[series.index <= target].dropna()
    if before.empty:
        return None
    return float(before.iloc[-1])
