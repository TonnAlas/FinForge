"""
Export Ratios Time Series to Excel

Given a list of tickers and a list of metrics (name + formula), this module
computes the full historical time series for every ticker/metric combination
using the exact same engine the graph uses
(Internal.Ratios.metric_history.compute_metric_history) and writes the results
to the "Export Ratios" sheet of the FinForge workbook.

Sheet layout:
  Row 1:   Title ("Export Ratios")
  Row 2:   Header row -> "Date" then one "TICKER - RatioName" per combination
  Row 3+:  Data rows -> Column A = dates, following columns = values
           ("N/A" is written where a ratio has no value for a given date)

Entry point for ElectronHome IPC:
    export_ratios_timeseries_entry(json_payload) -> prints JSON to stdout
"""

import json
from pathlib import Path

import pandas as pd
import xlwings as xw

from Internal.Ratios.metric_history import compute_metric_history

ROOT_DIR = Path(__file__).parent.parent.parent
WORKBOOK_PATH = ROOT_DIR / "FinForge.xlsm"

EXPORT_SHEET = "Export Ratios"
DATE_HEADER = "Date"
MISSING_VALUE = "N/A"
TITLE_ROW = 1
HEADER_ROW = 2
DATA_START_ROW = 3


def _sort_dates_ascending(dates):
    """Sort date strings chronologically, falling back to lexicographic order."""
    try:
        return sorted(dates, key=lambda value: pd.Timestamp(value))
    except Exception:
        return sorted(dates)


def _open_workbook():
    """Open the workbook, reusing an open Excel instance when available."""
    app = None
    try:
        workbook = xw.Book(str(WORKBOOK_PATH))
    except Exception:
        app = xw.App(visible=False, add_book=False)
        workbook = app.books.open(str(WORKBOOK_PATH))
    return workbook, app


def _get_or_create_sheet(workbook):
    """Return the export sheet, resetting its contents when it already exists."""
    sheet_names = [sheet.name for sheet in workbook.sheets]
    if EXPORT_SHEET in sheet_names:
        sheet = workbook.sheets[EXPORT_SHEET]
        sheet.clear_contents()
        return sheet
    return workbook.sheets.add(EXPORT_SHEET, after=workbook.sheets[-1])


def _compute_series(tickers, metrics):
    """Compute one history series per ticker/metric combination."""
    series = []
    for ticker in tickers:
        for metric in metrics:
            name = metric.get("name", "")
            formula = metric.get("formula", "")
            result = compute_metric_history(ticker, formula, name)
            series.append(
                {
                    "header": f"{ticker} - {name}",
                    "dates": result.get("dates", []),
                    "values": result.get("values", []),
                }
            )
    return series


def _build_master_dates(series):
    """Union all series dates into a single deduplicated, chronologically sorted axis."""
    master = []
    for item in series:
        for date_value in item["dates"]:
            if date_value not in master:
                master.append(date_value)
    return _sort_dates_ascending(master)


def export_ratios_timeseries(tickers, metrics):
    """Compute the time-series table and write it to the export sheet."""
    tickers = [ticker for ticker in (tickers or []) if ticker]
    metrics = [metric for metric in (metrics or []) if metric and metric.get("name")]

    if not tickers:
        return {"ok": False, "error": "No tickers provided"}
    if not metrics:
        return {"ok": False, "error": "No metrics provided"}

    series = _compute_series(tickers, metrics)
    master_dates = _build_master_dates(series)

    headers = [DATE_HEADER] + [item["header"] for item in series]
    value_maps = [dict(zip(item["dates"], item["values"])) for item in series]

    rows = []
    for date_value in master_dates:
        row = [date_value]
        for value_map in value_maps:
            value = value_map.get(date_value)
            if value is None or (isinstance(value, float) and pd.isna(value)):
                row.append(MISSING_VALUE)
            else:
                row.append(value)
        rows.append(row)

    app = None
    try:
        workbook, app = _open_workbook()
        sheet = _get_or_create_sheet(workbook)

        title_cell = sheet.range(f"A{TITLE_ROW}")
        title_cell.value = EXPORT_SHEET
        title_cell.font.bold = True
        title_cell.font.size = 14

        header_range = sheet.range(f"A{HEADER_ROW}")
        header_range.value = headers
        header_range.font.bold = True

        if rows:
            sheet.range(f"A{DATA_START_ROW}").value = rows

        workbook.save()

        return {
            "ok": True,
            "sheet": EXPORT_SHEET,
            "rows": len(rows),
            "columns": len(headers),
        }
    finally:
        if app is not None:
            app.quit()


def export_ratios_timeseries_entry(json_payload):
    """Print a JSON result to stdout for the ElectronHome IPC caller."""
    try:
        payload = json.loads(json_payload)
    except json.JSONDecodeError as error:
        print(json.dumps({"ok": False, "error": f"Invalid JSON: {error}"}))
        return

    tickers = payload.get("tickers", [])
    metrics = payload.get("metrics", [])

    try:
        result = export_ratios_timeseries(tickers, metrics)
    except Exception as error:
        result = {"ok": False, "error": str(error)}

    print(json.dumps(result))
