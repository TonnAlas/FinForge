# Balance Sheet Long Format

## Purpose
This document describes the long-format balance sheet storage, how it is generated, and how it is used by the balance sheet import.

## Storage Location
- Long format files: data/fundamentals/balance_sheet_long/{TICKER}.parquet
- Wide format files are still saved for compatibility: data/fundamentals/balance_sheet/{TICKER}.parquet

## Long Format Schema
Each row represents a single line item for a single statement date.

Columns:
- line_item (str): The balance sheet line item name.
- line_item_order (int): Preserves the original source order for that line item.
- statement_date (str): Statement date for the value (string form).
- value (number): Line item value.
- ticker (str): Added at save time by StockDataManager.
- last_updated (datetime): Added at save time by StockDataManager.

## Generation
Long format is generated at fetch time:
- Internal/launch/stock_launcher.py
- Internal/ticker_management/fetch_stocks.py

The conversion uses:
- data_management.stock_data_manager.convert_fundamental_wide_to_long

## Import Behavior
- The importer reads long-format files from data/fundamentals/balance_sheet_long.
- If Settings has a custom INDEX order, it is used.
- Otherwise, a Yahoo-style template list is applied, and any remaining items are appended in the source order.

## Migration Script
The wide-to-long conversion is now handled in production code by
`data_management/stock_data_manager.py` (`convert_fundamental_wide_to_long`).
The one-off migration script has been removed.

## Example Usage
Run the Balance Sheet import in Excel as usual.

## Assumptions and Limitations
- Only annual balance sheet data is converted to long format at this time.
- Quarterly balance sheets are not handled yet.
- The Yahoo-style template is a best-effort default and can be overridden in Settings.
