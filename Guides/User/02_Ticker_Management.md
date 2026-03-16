# Ticker Management

Learn how to add, edit, and manage stock tickers in your portfolio.

---

## Opening the Ticker Manager

The ticker management is built into FinForge. Launch it by:
- Double-clicking `launch_finforge.bat`, or
- Running from command line (see Getting Started)

---

## Adding Tickers

### Single Ticker

1. Type the ticker symbol in the input field (e.g., `MSFT`)
2. Click **Add** or press Enter
3. The ticker appears in the list
4. Data fetching starts automatically in the background

**Example:**
```
Input: AAPL
Result: Apple Inc. added to list, data fetching begins
```

### Validation Rules

- Tickers must be 1-5 letters only
- No numbers or special characters
- Duplicates are not allowed

---

## Removing Tickers

### Delete a Single Ticker

1. Find the ticker in the list
2. Click the **✕** (delete) button next to it
3. Confirm the deletion

### What Happens to the Data?

When you remove a ticker:
1. The ticker is removed from your list immediately
2. The data is **scheduled for deletion** in 3 days
3. If you re-add the ticker within 3 days, the data is preserved
4. After 3 days, data is permanently deleted on next app launch

See [Ticker Data Cleanup Guide](Ticker_Data_Cleanup_Guide.md) for details.

---

## Editing Tickers

1. Find the ticker in the list
2. Click the **✎** (edit) button
3. Enter the new ticker symbol
4. Click OK

**Note:** Editing a ticker schedules the old ticker's data for deletion.

---

## Selecting Tickers for Launch

When launching the Excel dashboard:
1. Click on tickers to select/deselect them
2. Selected tickers will be highlighted
3. Click **Launch Dashboard** to open Excel with selected tickers

---

## Fetching Data

### Automatic Fetching

Data is fetched automatically when you:
- Add a new ticker
- Launch the dashboard with tickers that need updates

### Manual Refresh

To refresh data for all tickers:
1. Run the fetch script: `.venv\Scripts\python.exe Internal\ticker_management\fetch_stocks.py`
2. Or use the refresh button in the launcher (if available)

### What Data is Fetched?

For each ticker, the app fetches:

| Category | Data Types |
|----------|------------|
| Financials | Income statement, balance sheet, cash flow (annual & quarterly) |
| Analyst | Earnings estimates, revenue estimates, price targets, recommendations |
| Holders | Major, institutional, mutual fund holders, insider roster |
| Insider | Transactions, purchases summary |
| Historical | Dividends, splits, price history |
| Other | News, SEC filings, calendar, company info |

See [Available Data Reference](Available_Data_Reference.md) for complete field list.

---

## Where is Ticker Data Stored?

Tickers are saved in: `Ticker_management/tickers.json`

```json
{
  "tickers": ["MSFT", "AAPL", "GOOGL"]
}
```

Stock data is stored in: `data/` folder as Parquet files

---

## Troubleshooting

### "Invalid Ticker" Error

**Cause:** Ticker contains numbers or is too long
**Solution:** Use only letters, 1-5 characters

### "Duplicate Ticker" Message

**Cause:** Ticker already exists in your list
**Solution:** Check your list, ticker is already there

### Data Not Fetching

**Cause:** Network issue or invalid ticker symbol
**Solution:** 
1. Check your internet connection
2. Verify the ticker exists on Yahoo Finance
3. Check the terminal for error messages

### Ticker Shows No Data

**Cause:** Yahoo Finance doesn't have data for this ticker
**Solution:** Some tickers (especially foreign or OTC) have limited data
