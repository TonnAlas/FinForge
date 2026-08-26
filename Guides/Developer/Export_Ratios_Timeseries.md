# Export Ratios Timeseries

## Overview

This feature wires the "Export timeseries" button in the ElectronHome Metrics
tab so that a selected set of metrics can be exported with their full
historical values into a new Excel sheet named `Export Ratios` inside the
`FinForge.xlsm` workbook.

The ratio values are computed with the exact same engine the Visualize graph
uses (`Internal/Ratios/metric_history.py::compute_metric_history`), so the
exported numbers match the graph for the same ticker, metric, and date.

## Sheet layout

| Row | Column A | Columns B+ |
| --- | --- | --- |
| 1 | `Export Ratios` (bold, size 14) | (empty) |
| 2 | `Date` | One `TICKER - RatioName` header per ticker/metric combination |
| 3+ | Reporting date string | Numeric ratio value, or `N/A` where missing |

Columns are grouped per ticker: all selected metrics for the first ticker come
first, then all metrics for the second ticker, and so on. The date axis is the
sorted union of every computed series' dates.

## Data flow

1. User checks metrics in the Metrics tab and clicks `Export timeseries`.
2. A modal lists the imported tickers with checkboxes, plus `Select all` and
   `Deselect all` controls.
3. On `Export`, the renderer builds `{ tickers, metrics }` and calls
   `window.finforge.exportRatiosTimeseries(payload)`.
4. The preload bridge invokes `finforge:exportRatiosTimeseries`.
5. The main process spawns Python to run
   `Internal/Ratios/export_ratios_timeseries.py::export_ratios_timeseries_entry`.
6. The module computes each series and writes the `Export Ratios` sheet.

## Files

| File | Purpose |
| --- | --- |
| `Internal/Ratios/export_ratios_timeseries.py` | New backend module that computes and writes the sheet |
| `ElectronHome/main.js` | New `finforge:exportRatiosTimeseries` IPC handler and command builder |
| `ElectronHome/preload.js` | New `exportRatiosTimeseries` bridge method |
| `ElectronHome/src/index.html` | New ticker-selection modal (`#export-tickers-modal`) |
| `ElectronHome/src/renderer.js` | Modal state, helpers, and button wiring |

## Backend module

`Internal/Ratios/export_ratios_timeseries.py`

### Constants

- `WORKBOOK_PATH` - absolute path to `FinForge.xlsm`.
- `EXPORT_SHEET` - the sheet name, `"Export Ratios"`.
- `DATE_HEADER` - the date column header, `"Date"`.
- `MISSING_VALUE` - the string written for gaps, `"N/A"`.
- `TITLE_ROW`, `HEADER_ROW`, `DATA_START_ROW` - layout row numbers (1, 2, 3).

### Functions

- `_sort_dates_ascending(dates)` - sorts date strings chronologically using
  `pd.Timestamp`, falling back to lexicographic sort.
- `_open_workbook()` - opens the workbook, reusing an already open Excel
  instance and otherwise starting a hidden `xlwings` app.
- `_get_or_create_sheet(workbook)` - returns the export sheet, creating it at
  the end of the workbook when missing and clearing it when it already exists.
- `_compute_series(tickers, metrics)` - calls `compute_metric_history` for every
  ticker/metric pair and returns `{header, dates, values}` entries.
- `_build_master_dates(series)` - deduplicates and sorts the union of all dates.
- `export_ratios_timeseries(tickers, metrics)` - orchestrates computation and
  writing. Returns `{"ok": true, "sheet", "rows", "columns"}` on success or
  `{"ok": false, "error"}` on failure.
- `export_ratios_timeseries_entry(json_payload)` - CLI entry point that prints
  the JSON result to stdout.

### Input

`json_payload` is a JSON string with this shape:

```json
{
  "tickers": ["AAPL", "MSFT"],
  "metrics": [
    { "name": "Current Ratio", "formula": "BS: Current Assets / BS: Current Liabilities" },
    { "name": "Return on Equity", "formula": "IS: Net Income / BS: Stockholders Equity" }
  ]
}
```

### Output

A single-line JSON object printed to stdout:

```json
{ "ok": true, "sheet": "Export Ratios", "rows": 10, "columns": 5 }
```

On error the module prints `{ "ok": false, "error": "..." }`.

## Electron changes

### `ElectronHome/main.js`

- `buildExportRatiosTimeseriesCommand(payloadJson)` escapes the payload and
  returns the Python `-c` command that invokes
  `export_ratios_timeseries_entry`.
- `ipcMain.handle('finforge:exportRatiosTimeseries', ...)` validates the
  workbook exists, spawns Python with a 120 second timeout, parses stdout JSON,
  and returns `{ ok: true, data }` or `{ ok: false, error }`.

### `ElectronHome/preload.js`

- `exportRatiosTimeseries(payload)` invokes
  `finforge:exportRatiosTimeseries` via `ipcRenderer.invoke`.

### `ElectronHome/src/renderer.js`

- `state.exportTickerSelection` holds the tickers chosen in the modal.
- `openExportTickersModal`, `closeExportTickersModal`,
  `renderExportTickersList`, `setExportTickersAll`, and
  `submitExportTimeseries` manage the modal and the export request.
- The existing `ratioExportTimeseriesButton` element is now wired to open the
  modal when at least one metric is selected.

## Requirements

- The project virtual environment must include `pandas` and `xlwings`
  (already listed in `requirements.txt`).
- `FinForge.xlsm` must exist at the project root. If it is open in Excel, the
  export writes into the open workbook; otherwise a hidden Excel instance is
  used and then closed.
- `Internal.Ratios.metric_history` must be importable from the project root
  (it already is, as used by the graph).

## Assumptions and limitations

- Values use the same semantics as the graph: a ratio is evaluated at each exact
  reporting date and yields no value when any operand is missing for that date.
  There is no forward-fill, except price operands which use the last trading
  day on or before the anchor date.
- Dates are written as the strings produced by `compute_metric_history`.
- The sheet is fully cleared and rewritten on every export, so previous exports
  do not leave stale rows or columns behind.
- Missing cells are written as the text `"N/A"`.

## Example usage

From the project root:

```
python -c "from Internal.Ratios.export_ratios_timeseries import export_ratios_timeseries_entry; export_ratios_timeseries_entry('{\"tickers\":[\"AAPL\"],\"metrics\":[{\"name\":\"Current Ratio\",\"formula\":\"BS: Current Assets / BS: Current Liabilities\"}]}')"
```
