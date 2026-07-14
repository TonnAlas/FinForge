# Cash Flow Statement Import Module Guide

## Overview

The Cash Flow Statement Import module (`import_cash_flow.py`) imports cash flow statement data from local Parquet storage into the "cash flow" sheet of the `FinForge.xlsm` workbook. It follows the exact same pattern as the existing Balance Sheet (`import_balance_sheets.py`) and Income Statement (`import_income_statements.py`) import modules.

## File Location

```
Importing/
  import_cash_flow.py          # Main import module
```

## Dependencies

- **xlwings**: Excel integration and manipulation
- **pandas**: Data processing and handling
- **data_management.stock_data_manager.StockDataManager**: Parquet data access
- **data_management.stock_data_manager.convert_fundamental_wide_to_long**: Wide-to-long format conversion

## Data Source

Cash flow data is stored in a **wide format** in:
```
data/fundamentals/cash_flow/{TICKER}.parquet
```

The wide format has:
- `index` column: line item names (renamed to `line_item` during conversion)
- Date columns: one column per fiscal period (e.g., `2024-12-31 00:00:00`)
- `ticker` column: stock ticker symbol
- `last_updated` column: timestamp of last data fetch

The `convert_fundamental_wide_to_long()` function converts this to a standard long format with columns: `line_item`, `statement_date`, `value`, `line_item_order`.

## Class: `CashFlowImporter`

### Constructor: `__init__()`

Initializes the importer with:
- `self.sheet_name = "cash flow"` — the target Excel sheet
- `self.data_type = "cash_flow"` — the Parquet folder name
- `self.START_ROW = 4` — where ticker symbols are located
- `self.DATA_START_ROW = 7` — where financial line items begin
- Paths to `statement_settings.json` for user-configured line item selections

### Method: `import_data()`

Main entry point. Executes the full import workflow:

1. Connects to the Excel workbook (via `xlwings.Book.caller()` or active workbook)
2. Reads ticker symbols from row 4, columns 2+
3. Retrieves user-selected line items from `statement_settings.json` and populates Column A
4. For each ticker column:
   - Skips INDEX and CUSTOM columns
   - Loads Parquet data for the ticker
   - Converts wide format to long format if needed
   - Finds the appropriate statement date (supports multiple occurrences per ticker)
   - Writes data to Excel with proper formatting (orange text for valid data, red for N/A, white for empty)

### Method: `_get_valid_items_and_populate_column_a(ws, wb)`

Reads selected line items from `statement_settings.json` section `"cashFlow"` and writes them to Column A of the sheet. Falls back to line items from the first available ticker's data if no settings are found.

### Method: `_load_terminal_settings()`

Loads the `statement_settings.json` file with defaults:
```json
{
  "mode": "cashFlow",
  "display": {"mode": "millions", "divisor": 1000000},
  "balanceSheet": {"selected": []},
  "incomeStatement": {"selected": []},
  "cashFlow": {"selected": []}
}
```

### Method: `_get_selected_items_from_terminal_settings(section_name, default_items)`

Returns only the line items the user has explicitly selected in the terminal settings file. The section name for cash flow is `"cashFlow"`.

### Method: `_get_default_items_from_sheet(ws)`

Scans existing ticker columns in the sheet for available cash flow data, then builds a default item list using the Yahoo template ordering.

### Method: `_build_default_items_from_long_df(df)`

Builds an ordered list of cash flow line items using:
1. `line_item_order` column if available (from long format conversion)
2. Falls back to preserving the original data order
3. Applies `_apply_yahoo_order()` to sort items into a logical presentation order

### Method: `_apply_yahoo_order(available_items)`

Sorts available line items according to the `YAHOO_CASH_FLOW_ORDER` template, which organizes items into three sections:
- **Operating Activities**: Operating Cash Flow, Net Income, Depreciation, Working Capital changes, etc.
- **Investing Activities**: Investing Cash Flow, Capital Expenditure, PPE purchases/sales, Investment purchases/sales
- **Financing Activities**: Financing Cash Flow, Debt issuance/repayment, Stock issuance/repurchase, Dividends
- **Supplemental**: Exchange rate effects, Cash position changes, Free Cash Flow, Interest/Taxes paid

### Method: `_sort_statement_dates(date_values)`

Sorts statement dates in descending chronological order.

### Method: `_write_data_to_excel(ws, col_index, stmt_data, valid_items)`

Writes financial data to Excel cells with formatting:
- **Valid data** → Orange text (`#ED7D31`) with the value scaled by the display divisor
- **Missing items (N/A)** → Red text
- **Empty values** → White text with "-" placeholder

### Method: `_mark_column_unavailable(ws, col_index, message)`

Marks a column as unavailable with error formatting and fills all cells with "N/A" in red.

## Excel-Callable Function

```python
@xw.sub
def import_cash_flow():
    """Import cash flow statement data from Parquet to Excel - Called by Electron"""
```

This function is the entry point called by the Electron application via:
```python
from Importing.import_cash_flow import import_cash_flow; import_cash_flow()
```

## Configuration Files

### `data/statement_settings.json`

The `"cashFlow"` section stores user-selected line items:
```json
{
  "cashFlow": {
    "selected": ["Operating Cash Flow", "Free Cash Flow", ...]
  }
}
```

### `data/statement_catalog.json`

Contains the full catalog of available cash flow line items for the UI:
```json
{
  "cashFlow": [
    "Operating Cash Flow",
    "Free Cash Flow",
    ...
  ]
}
```

## UI Integration

Cash flow scope support is added to the ElectronHome UI:

1. **Scope button**: "Cash flow" button in the Field Catalog section of the Statement Lines page (`index.html`)
2. **Scope labels**: `scopeLabels.cashFlow = 'Cash flow'`
3. **Scope keys**: `scopeKeys.cashFlow = 'cashFlow'`
4. **Settings defaults**: `cashFlow: { selected: [] }` in state, normalizeSettings, snapshotSettings, saveToDisk
5. **Catalog**: `cashFlow` array in catalog loading and embedded fallback
6. **Main process**: `buildImportCommand('cashFlow')` routes to `import_cash_flow` Python function
7. **Import IPC**: `normalizedScope = scope === 'cashFlow' ? 'cashFlow' : ...`

## Format Differences from IS/BS

Unlike Income Statement and Balance Sheet data which is stored in **long format** (`line_item`, `statement_date`, `value`), cash flow data is stored in **wide format** (dates as columns). The importer uses `convert_fundamental_wide_to_long()` to normalize the data before processing.

This wide-to-long conversion happens transparently and produces the same `line_item`, `statement_date`, `value`, and `line_item_order` columns used by the import workflow.

## Assumptions and Limitations

- The "cash flow" sheet must already exist in `FinForge.xlsm`
- Cash flow data must be available in `data/fundamentals/cash_flow/{TICKER}.parquet`
- Wide-format conversion assumes the `index` column contains line item names
- Multiple occurrences of the same ticker use successive statement dates (most recent first)
- Display divisor defaults to millions (1,000,000) and can be configured in the UI
