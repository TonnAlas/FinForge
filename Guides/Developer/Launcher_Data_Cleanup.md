# Launcher Data Cleanup

## Purpose
This document describes the launcher behavior that deletes stored data for tickers not selected when launching the dashboard.

## Behavior Summary
- When the user clicks Launch, the launcher compares selected tickers with stored data tickers.
- Any ticker data not present in the launcher list is deleted after user confirmation.
- Deletion is immediate and permanent.

## Data Sources Checked
- Prices: data/prices/{TICKER}.parquet
- Metadata: data/metadata/{TICKER}.json
- Fundamentals (new structure): data/fundamentals/*/{TICKER}.parquet
- Fundamentals (old structure): data/fundamentals/*.parquet
- Holders (new structure): data/holders/*/{TICKER}.parquet
- Holders (old structure): data/holders/*.parquet

## Implementation Details
### StockLauncher._delete_unselected_ticker_data()
- Inputs:
  - Selected tickers from the launcher list
  - Stored tickers from StockDataManager.get_all_data_tickers()
- Outputs:
  - Deletes stored data for any ticker not in the selected list
  - Returns True if deletion completed or not needed, False if user cancels

### StockDataManager.get_all_data_tickers()
- Scans all data folders for tickers in both the new and old storage layouts.
- Returns a sorted list of tickers with stored data.

## User Confirmation
A confirmation dialog appears before deletion, listing tickers to remove.

## Example Usage
- Select tickers in the launcher and click Launch.
- Confirm deletion when prompted to remove data for non-selected tickers.

## Assumptions and Limitations
- Only tickers with stored data are considered.
- Deletion cannot be undone.
