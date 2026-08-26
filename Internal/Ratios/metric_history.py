"""
Metric History Calculator — Computes time series for a financial metric.

Given a ticker and a metric formula (e.g. "BS: Current Assets / BS: Current Liabilities"),
iterates over ALL historical periods and evaluates the formula for each period,
returning aligned date/value arrays suitable for charting.

Entry point for ElectronHome IPC:
    compute_metric_history_entry(json_payload) → prints JSON to stdout
"""

import json
import sys
from pathlib import Path

import pandas as pd

from Internal.Ratios.formula_resolver import (
    eval_ast,
    parse_formula_ast,
    resolve_at_date,
    resolve_series,
)

ROOT_DIR = Path(__file__).parent.parent.parent
RATIO_CONFIG_FILE = ROOT_DIR / "Importing" / "ratio_config.json"

# Sheets whose values are single snapshots rather than historical series.
SNAPSHOT_SHEETS = {"M", "H", "E", "A"}


def _load_ratios_config():
    if RATIO_CONFIG_FILE.exists():
        try:
            with open(RATIO_CONFIG_FILE, "r", encoding="utf-8") as fh:
                return json.load(fh)
        except (OSError, ValueError):
            return {}
    return {}


# ── Single-Period Value Lookup ──

def _get_value_at_date(ticker, sheet, item, date_col, df_cache, ratios_config, recursion=0):
    """Resolve one reference value at a specific date column."""
    if recursion > 10:
        return None

    sheet_upper = (sheet or "").upper()

    if sheet_upper == "NUMBER":
        try:
            return float(item)
        except (TypeError, ValueError):
            return None

    if sheet_upper in ("RATIO", "METRIC"):
        metric_data = ratios_config.get((item or "").strip())
        if not metric_data:
            return None
        formula = metric_data.get("formula", "")
        if not formula:
            return None
        return _evaluate_at_date(ticker, formula, date_col, df_cache, ratios_config, recursion + 1)

    return resolve_at_date(ticker, sheet_upper, item, date_col, df_cache)


def _evaluate_at_date(ticker, formula, date_col, df_cache, ratios_config, recursion=0):
    """Evaluate a formula string at a single historical date."""
    ast = parse_formula_ast(formula)
    if ast is None:
        return None
    return eval_ast(
        ast,
        lambda sheet, item: _get_value_at_date(
            ticker, sheet, item, date_col, df_cache, ratios_config, recursion
        ),
    )


def _collect_axis(ticker, ast, df_cache, ratios_config, depth=0):
    """Walk an AST and return (list of dates, has_series_source)."""
    if depth > 10 or ast is None:
        return [], False

    kind = ast[0]

    if kind == "NUM":
        return [], False

    if kind == "ID":
        sheet, item = ast[1], ast[2]
        sheet_upper = (sheet or "").upper()

        if sheet_upper in ("RATIO", "METRIC"):
            metric_data = ratios_config.get((item or "").strip())
            formula = metric_data.get("formula", "") if metric_data else ""
            sub_ast = parse_formula_ast(formula) if formula else None
            return _collect_axis(ticker, sub_ast, df_cache, ratios_config, depth + 1)

        if sheet_upper == "NUMBER":
            return [], False

        series = resolve_series(ticker, sheet_upper, item, df_cache)
        dates = [] if series is None or series.empty else series.dropna().index.tolist()
        return dates, (sheet_upper not in SNAPSHOT_SHEETS)

    if kind == "BIN":
        left_dates, left_series = _collect_axis(ticker, ast[2], df_cache, ratios_config, depth)
        right_dates, right_series = _collect_axis(ticker, ast[3], df_cache, ratios_config, depth)
        return left_dates + right_dates, (left_series or right_series)

    return [], False


# ── Main: Compute Metric History ──

def compute_metric_history(ticker, formula, metric_name=""):
    """
    Compute a metric's value for every available historical period.

    Args:
        ticker: Stock ticker symbol (e.g., "AAPL")
        formula: Metric formula string (e.g., "BS: Current Assets / BS: Current Liabilities")
        metric_name: Optional display name for the metric

    Returns:
        dict with keys:
            - dates: list of date strings (ISO format)
            - values: list of floats (None where data is missing)
            - metricName: str
            - ticker: str
            - snapshot: True (only when the formula resolves to a single
              snapshot value such as M:/H:/E:/A: references)
            - error: str (only if something went wrong)
    """
    try:
        ratios_config = _load_ratios_config()
        if metric_name and not formula:
            metric_data = ratios_config.get(metric_name)
            if metric_data:
                formula = metric_data.get("formula", "")

        if not formula:
            return {"dates": [], "values": [], "metricName": metric_name, "ticker": ticker,
                    "error": "No formula provided"}

        ast = parse_formula_ast(formula)
        if ast is None:
            return {"dates": [], "values": [], "metricName": metric_name, "ticker": ticker,
                    "error": "Invalid formula"}

        df_cache = {}
        raw_dates, has_series_source = _collect_axis(ticker, ast, df_cache, ratios_config)

        if not raw_dates:
            return {"dates": [], "values": [], "metricName": metric_name, "ticker": ticker,
                    "error": "No historical data found for this ticker"}

        date_columns = sorted(set(raw_dates))

        dates = []
        values = []
        for date_col in date_columns:
            value = _evaluate_at_date(ticker, formula, date_col, df_cache, ratios_config)
            dates.append(str(date_col))
            values.append(round(value, 6) if isinstance(value, float) else None)

        result = {
            "dates": dates,
            "values": values,
            "metricName": metric_name,
            "ticker": ticker,
        }
        if not has_series_source:
            result["snapshot"] = True

        return result

    except Exception as error:  # noqa: BLE001 - report failures to the UI
        import traceback
        traceback.print_exc()
        return {
            "dates": [], "values": [],
            "metricName": metric_name, "ticker": ticker,
            "error": str(error),
        }


def compute_metric_history_batch(requests):
    """
    Compute metric history for multiple ticker/metric combinations.

    Args:
        requests: list of {ticker, metricName, formula} dicts

    Returns:
        dict keyed by "TICKER|METRIC_NAME" → {dates, values, metricName, ticker}
    """
    ratios_config = _load_ratios_config()
    results = {}

    for req in requests:
        ticker = req.get("ticker", "")
        metric_name = req.get("metricName", "")
        formula = req.get("formula", "")

        if not formula and metric_name:
            metric_data = ratios_config.get(metric_name)
            if metric_data:
                formula = metric_data.get("formula", "")

        key = f"{ticker}|{metric_name}"
        results[key] = compute_metric_history(ticker, formula, metric_name)

    return results


# ── Entry Point for ElectronHome IPC ──

def compute_metric_history_entry(json_payload):
    """
    Called from ElectronHome via: python -c "from Internal.Ratios.metric_history import ...; print(...)"
    Expects a JSON string with either:
        { mode: "single", ticker, metricName, formula }
    or:
        { mode: "batch", requests: [{ticker, metricName, formula}, ...] }
    Prints JSON result to stdout.
    """
    try:
        payload = json.loads(json_payload)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON: {e}"}))
        return

    mode = payload.get("mode", "single")

    if mode == "batch":
        requests = payload.get("requests", [])
        result = compute_metric_history_batch(requests)
    else:
        ticker = payload.get("ticker", "")
        metric_name = payload.get("metricName", "")
        formula = payload.get("formula", "")
        result = compute_metric_history(ticker, formula, metric_name)

    print(json.dumps(result))


if __name__ == "__main__":
    # Test: compute a single metric for a ticker
    if len(sys.argv) > 1:
        compute_metric_history_entry(sys.argv[1])
    else:
        # Quick self-test
        test = compute_metric_history("AAPL", "BS: Current Assets / BS: Current Liabilities", "Current Ratio")
        print(json.dumps(test, indent=2))
