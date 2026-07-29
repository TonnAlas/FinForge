# Ratios Sheet - INDEX and CUSTOM Column Support

## Overview

This document describes the INDEX and CUSTOM column handling added to the Ratios sheet
in `Internal/Ratios/ratio_calculator.py`, mirroring the same logic used by the financial
statement importers (Balance Sheet, Income Statement, Cash Flow).

## What Changed

**File:** `Internal/Ratios/ratio_calculator.py`

The `RatioCalculator` class now recognizes two special column headers in Row 4 (the ticker row):

- **INDEX** -- Automatically populated with the ratio names from Column A. Acts as a
  reference column so users can see which ratio is on which row.
- **CUSTOM** -- Left entirely untouched. This protects user-entered data from being
  overwritten during ratio calculation or sheet sync operations.

## Modified Methods

### `initialize()`

Row 4 headers are now classified into three categories instead of just filtering out
INDEX and CUSTOM:

- `self.ticker_columns` -- Columns with actual ticker symbols (calculated normally)
- `self.index_columns` -- Columns with "INDEX" header
- `self.custom_columns` -- Columns with "CUSTOM" header

### `calculate_all_ratios()`

Before processing ticker columns, the method now:

1. Calls `_clear_empty_ticker_columns()` to clean up orphaned data (unchanged)
2. For each INDEX column: clears old data and writes ratio names from Column A
3. Then proceeds to calculate ratios for ticker columns as before
4. CUSTOM columns are never touched

### `_clear_empty_ticker_columns()`

Updated to protect CUSTOM columns from being cleared. Previously, INDEX and CUSTOM
columns were excluded from the `active_columns` set, causing their data to be erased.
Now CUSTOM columns are added to the set so they are preserved.

### `_clear_column_data(col_letter)` -- NEW

Helper method that clears data values from a single column's data area (rows 7+)
while preserving formatting.

### `_write_index_items(col_letter)` -- NEW

Writes the list of ratio names from `self.assigned_ratios` (derived from Column A)
into the specified INDEX column, with bold formatting.

### External Functions

#### `sync_ratio_sheet_from_config(workbook)`

Updated to clear data columns selectively:
- Reads Row 4 to identify CUSTOM columns
- Skips CUSTOM columns during the clear operation
- Only clears Column A and non-CUSTOM data columns

#### `sync_assigned_ratios(ratio_names_json: str)`

Same selective-clearing logic applied: CUSTOM columns are preserved during the
clear operation that precedes writing new ratio names to Column A.

## Behavior Summary

| Column Header | Behavior |
|---|---|
| Ticker (e.g., AAPL) | Ratios are calculated from Parquet data |
| INDEX | Ratio names from Column A are copied into the column |
| CUSTOM | Column is never modified -- user data preserved |
| Empty | Data is cleared as orphaned column |
| Missing (was previously filled) | Data is cleared |

## Backward Compatibility

All changes are backward-compatible:
- Existing sheets without INDEX or CUSTOM columns behave exactly as before
- The pre-existing bug `calculator.assignments` (should be `assigned_ratios` in the
  success message) was fixed
- The `sync_assigned_ratios` function had an indentation bug that was corrected
