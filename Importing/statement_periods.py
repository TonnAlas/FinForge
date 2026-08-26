"""
List available statement reporting periods for tickers.

DESCRIPTION:
Reads income-statement parquet data (annual or quarterly) as the canonical source
of a company's reporting periods and prints a JSON dict {TICKER: [date, ...]}
with dates sorted newest first. Used by ElectronHome's advanced period picker.

INPUTS (entrypoint):
- frequency: "annual" | "quarterly"
- tickers_json: JSON array of ticker symbols

OUTPUT (stdout):
- JSON object mapping each ticker to its available statement dates.

RELATED FILES:
- Uses: data_management/stock_data_manager.py for parquet access
- Called by: Electron (main.js) via Python subprocess
"""

import json
import os
import sys
from pathlib import Path

import pandas as pd

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from data_management.stock_data_manager import (
    StockDataManager,
    convert_fundamental_wide_to_long,
)


ANNUAL_DATA_TYPE = "income_statement_long"
QUARTERLY_DATA_TYPE = "quarterly_income_statement"


def _sort_statement_dates(date_values):
    """Sort statement dates descending using parsed datetime when possible."""
    parsed_items = []
    unparsed_items = []

    for value in date_values:
        parsed_value = pd.to_datetime(value, errors="coerce")
        if pd.isna(parsed_value):
            unparsed_items.append(str(value))
        else:
            parsed_items.append((parsed_value, value))

    parsed_items.sort(key=lambda item: item[0], reverse=True)
    unparsed_items.sort(reverse=True)

    return [value for _, value in parsed_items] + unparsed_items


def _normalize_date(value):
    """Return a clean YYYY-MM-DD string for a statement date value."""
    text = str(value).strip()
    parsed = pd.to_datetime(text, errors="coerce")
    if pd.isna(parsed):
        return text
    return parsed.strftime("%Y-%m-%d")


def _load_long_df(data_manager, ticker, data_type):
    """Load statement data for a ticker, melting wide format to long when needed."""
    df = data_manager.get_fundamental_data(ticker, data_type)
    if df.empty:
        return df
    if "line_item" not in df.columns and "index" in df.columns:
        df = convert_fundamental_wide_to_long(df)
    return df


def list_statement_periods(frequency, tickers):
    """Return {TICKER: [date, ...]} for the given frequency."""
    project_root = Path(__file__).resolve().parents[1]
    data_path = project_root / "data"
    data_manager = StockDataManager(data_path)

    data_type = QUARTERLY_DATA_TYPE if frequency == "quarterly" else ANNUAL_DATA_TYPE

    result = {}
    for ticker in tickers:
        ticker = str(ticker).strip().upper()
        if not ticker:
            continue

        df = _load_long_df(data_manager, ticker, data_type)
        if df.empty or "statement_date" not in df.columns or "value" not in df.columns:
            result[ticker] = []
            continue

        date_values = df.loc[df["value"].notna(), "statement_date"].unique().tolist()
        result[ticker] = [_normalize_date(value) for value in _sort_statement_dates(date_values)]

    return result


def list_statement_periods_entry(frequency, tickers_json):
    """Entrypoint used by Electron main.js; prints JSON to stdout."""
    try:
        tickers = json.loads(tickers_json) if tickers_json else []
        if not isinstance(tickers, list):
            tickers = [tickers]
    except (TypeError, json.JSONDecodeError):
        tickers = []

    result = list_statement_periods(frequency, tickers)
    print(json.dumps(result))


if __name__ == "__main__":
    frequency = sys.argv[1] if len(sys.argv) > 1 else "annual"
    tickers_json = sys.argv[2] if len(sys.argv) > 2 else "[]"
    list_statement_periods_entry(frequency, tickers_json)
