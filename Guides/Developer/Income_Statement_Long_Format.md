# Income Statement Long Format

## Purpose
This document describes the long-format income statement storage, how it is generated, and how it is used by the income statement import.

## Storage Location
- Long format files: data/fundamentals/income_statement_long/{TICKER}.parquet
- Wide format files are still saved for compatibility: data/fundamentals/income_statement/{TICKER}.parquet

## Long Format Schema
Each row represents a single line item for a single statement date.

Columns:
- line_item (str): The income statement line item name.
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
- The importer reads long-format files from data/fundamentals/income_statement_long.
- If Settings has a custom INDEX order, it is used.
- Otherwise, a Yahoo-style template list is applied, and any remaining items are appended in the source order.

## Migration Script
Temporary script:
- Temporary/migrate_income_statement_long_format.py

Purpose:
- Converts existing wide income statement files to long format.

Removal:
- This script can be deleted after long-format files are created.

## Example Usage
Run the migration script once to generate long-format files:

```
python Temporary/migrate_income_statement_long_format.py
```

Then run the Income Statement import in Excel as usual.

## Assumptions and Limitations
- Only annual income statement data is converted to long format at this time.
- Quarterly income statements are not handled yet.
- The Yahoo-style template is a best-effort default and can be overridden in Settings.
