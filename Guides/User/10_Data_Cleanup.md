# Ticker Data Cleanup System

## Overview

FinForge includes an automatic data cleanup system that manages parquet file storage when tickers are removed or changed. This prevents the system from accumulating unused data while providing a safety window to recover accidentally deleted tickers.

## How It Works

### Delayed Deletion (3-Day Grace Period)

When you remove or change a ticker in the UI, the system does NOT immediately delete the data. Instead:

1. The ticker is added to a pending deletions list (`data/pending_deletions.json`)
2. A deletion date is set for 3 days in the future
3. The actual data deletion occurs on the next app launch after the 3-day period

### Automatic Cleanup on Startup

Every time you launch FinForge:

1. The system checks `pending_deletions.json` for any tickers past their deletion date
2. For each ticker past its 3-day grace period, all associated data is permanently deleted
3. The pending deletions list is updated

### Recovery Window

If you accidentally remove a ticker, you have 3 days to re-add it:

- Simply add the ticker again using the launcher
- The pending deletion will be automatically cancelled
- Your existing data will be preserved

## What Gets Deleted

When a ticker's data is permanently deleted, the following files are affected:

| Data Type | File Location | Action |
|-----------|---------------|--------|
| Price History | `data/prices/{TICKER}.parquet` | File deleted |
| Metadata | `data/metadata/{TICKER}.json` | File deleted |
| Income Statement | `data/fundamentals/income_statement/{TICKER}.parquet` | File deleted |
| Balance Sheet | `data/fundamentals/balance_sheet/{TICKER}.parquet` | File deleted |
| Cash Flow | `data/fundamentals/cash_flow/{TICKER}.parquet` | File deleted |
| Recommendations | `data/fundamentals/recommendations/{TICKER}.parquet` | File deleted |
| Major Holders | `data/holders/major_holders/{TICKER}.parquet` | File deleted |
| Institutional Holders | `data/holders/institutional_holders/{TICKER}.parquet` | File deleted |
| Mutual Fund Holders | `data/holders/mutualfund_holders/{TICKER}.parquet` | File deleted |

## Configuration

The deletion delay is configured in `data_management/stock_data_manager.py`:

```python
DELETION_DELAY_DAYS = 3  # Number of days before data is permanently deleted
```

To change the grace period, modify this value.

## Pending Deletions File

The pending deletions are tracked in `data/pending_deletions.json`:

```json
{
  "TICKER1": {
    "scheduled_date": "2025-12-06T21:28:50.896922",
    "deletion_date": "2025-12-09T21:28:50.896910"
  },
  "TICKER2": {
    "scheduled_date": "2025-12-05T10:00:00.000000",
    "deletion_date": "2025-12-08T10:00:00.000000"
  }
}
```

- `scheduled_date`: When the ticker was removed from the UI
- `deletion_date`: When the data will be permanently deleted

## Actions That Trigger Deletion Scheduling

| Action | Result |
|--------|--------|
| Remove ticker (delete button) | Ticker scheduled for deletion in 3 days |
| Edit ticker to new symbol | Old ticker scheduled for deletion in 3 days |
| Clear all tickers | Each ticker scheduled for deletion in 3 days |

## Actions That Cancel Scheduled Deletions

| Action | Result |
|--------|--------|
| Add a ticker that was pending deletion | Deletion cancelled, data preserved |

## Manual Data Management

If you need to manually manage the pending deletions:

### View Pending Deletions

```python
from data_management.stock_data_manager import StockDataManager

dm = StockDataManager(base_path='data')
print(dm.get_pending_deletions())
```

### Cancel a Specific Deletion

```python
dm.cancel_ticker_deletion('AAPL')
```

### Force Immediate Deletion

```python
dm.delete_ticker_data('AAPL')  # Immediately deletes all data for AAPL
```

### Process Pending Deletions Now

```python
deleted = dm.process_pending_deletions()
print(f"Deleted: {deleted}")
```

## Related Files

- `data_management/stock_data_manager.py` - Contains the deletion logic
- `Internal/launch/stock_launcher.py` - Integrates deletion with UI actions
- `data/pending_deletions.json` - Tracks scheduled deletions
