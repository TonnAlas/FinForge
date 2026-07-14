# Balance Sheet Default Order

## Purpose
This document describes how the balance sheet import determines the default line item order when no user-defined order is provided in the Settings sheet, using long-format balance sheet data.

## Behavior Summary
- If the Settings sheet includes a custom INDEX list, that order is used.
- Otherwise, the importer derives the default order from the first ticker in the balance sheets sheet that has available annual balance sheet data.
- A Yahoo-style template order is applied first, and any remaining items are appended in source order.
- If no ticker in the sheet has available data, the importer falls back to AAPL as a reference.

## Data Sources
- Excel workbook: FinForge.xlsm
- Sheet: balance sheets
- Parquet data: data/fundamentals/balance_sheet_long/{TICKER}.parquet

## Functions and Responsibilities
### BalanceSheetImporter._get_valid_items_and_populate_column_a(ws, wb)
- Inputs:
  - ws: xlwings sheet for balance sheets
  - wb: xlwings workbook
- Outputs:
  - List[str] of line items (order used for Column A and data mapping)
- Logic:
  - Reads a Settings override if present.
  - Otherwise applies the Yahoo template order to the first available ticker data.
  - Falls back to AAPL if no ticker data is available.

### BalanceSheetImporter._get_default_items_from_sheet(ws)
- Inputs:
  - ws: xlwings sheet for balance sheets
- Outputs:
  - List[str] of line items in the default order, or an empty list if no data is found
- Logic:
  - Scans row 4 for the first ticker with available annual balance sheet data.
  - Returns a Yahoo-ordered list of line items, appending any items not in the template.

## Inputs and Outputs
- Input: Annual balance sheet long-format Parquet files produced by yfinance data fetch.
- Output: Column A line items and corresponding data columns ordered to match the default Yahoo Finance structure unless overridden in Settings.

## Assumptions and Limitations
- The default order is based on the first ticker with data in the sheet and a Yahoo template list; any missing items are appended in source order.
- Quarterly balance sheet ordering is not handled here.

## Example Usage
- Open FinForge.xlsm, add tickers on the balance sheets sheet, and run the Balance Sheet import.
- If Settings has a custom order, that order will be used.
- If Settings is empty, the order will follow the first available ticker in the sheet.
