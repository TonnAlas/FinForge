# Importing Data to Excel

Learn how to import financial statement data from your stored Parquet files into Excel.

---

## Overview

The import system transfers data from Parquet files to your Excel workbook:
- Balance sheet data → "balance sheets" sheet
- Income statement data → "income statements" sheet

---

## Prerequisites

Before importing:
1. Have tickers with fetched data (see [Ticker Management](02_Ticker_Management.md))
2. Have Excel workbook open (`FinForge.xlsm`)
3. Tickers should be listed in Row 4 of the respective sheet

---

## Importing Balance Sheets

### From Excel (VBA Macro)

1. Open `FinForge.xlsm`
2. Go to the "balance sheets" sheet
3. Run the macro: `ImportBalanceSheets()`
   - Press `Alt + F8`
   - Select `ImportBalanceSheets`
   - Click Run

### From Python

```powershell
cd C:\Users\tonna\Desktop\Stocks
.\.venv\Scripts\Activate.ps1
python -c "from Importing.import_balance_sheets import main; main()"
```

### What Gets Imported

| Row | Content |
|-----|---------|
| 4 | Ticker symbols (you place these) |
| 5 | Most recent date |
| 6 | Second most recent date |
| 7+ | Financial line items |

**Example Layout:**
```
       A          B              C              D
4   INDEX       MSFT           AAPL           GOOGL
5              2024-06-30     2024-06-30     2024-06-30
6              2024-03-31     2024-03-31     2024-03-31
7   Total Assets  $411.9B       $352.5B        $402.3B
8   Cash          $18.3B        $28.4B         $24.0B
...
```

---

## Importing Income Statements

### From Excel (VBA Macro)

1. Open `FinForge.xlsm`
2. Go to the "income statements" sheet
3. Run the macro: `ImportIncomeStatements()`
   - Press `Alt + F8`
   - Select `ImportIncomeStatements`
   - Click Run

### From Python

```powershell
cd C:\Users\tonna\Desktop\Stocks
.\.venv\Scripts\Activate.ps1
python -c "from Importing.import_income_statements import main; main()"
```

---

## Customizing Which Items to Import

### Using the Settings Sheet

1. Go to the "Settings" sheet in Excel
2. Find the section for Balance Sheet or Income Statement items
3. List the items you want to import (one per row)
4. Run the import again

**Example Settings:**
```
Balance Sheet Items:
  Total Assets
  Total Liabilities
  Stockholders Equity
  Cash And Cash Equivalents
  Total Debt
```

### Default Items

If no custom items are specified, a default set of common items is used:
- Total Assets, Total Liabilities, Cash, Debt, etc.

---

## Understanding Color Codes

After importing, cells are color-coded:

| Color | Meaning |
|-------|---------|
| Orange text | Data found and imported successfully |
| Red text | Data not available for this ticker |
| White text | Empty/no value |

---

## Tips for Successful Imports

### Setting Up Tickers

1. In the import sheet (balance sheets or income statements)
2. Go to Row 4
3. Column A should say "INDEX"
4. Enter ticker symbols in columns B, C, D, etc.

**Example:**
```
Row 4: INDEX | MSFT | AAPL | GOOGL | AMZN
```

### After Adding New Tickers

1. First, fetch data using the launcher or fetch script
2. Then run the import macro
3. Data will populate for the new tickers

### Refreshing Data

To update with latest data:
1. Run the fetch script to get new data from Yahoo Finance
2. Run the import macro to update Excel

---

## Troubleshooting

### No Data Appears

**Possible Causes:**
1. Tickers not in Row 4
2. Data not fetched yet
3. Column A doesn't say "INDEX"

**Solutions:**
1. Verify tickers are in Row 4, starting from column B
2. Run the fetch script first
3. Ensure column A, Row 4 contains "INDEX"

### Wrong Data Columns

**Cause:** Data dates don't match expected columns
**Solution:** The importer uses the most recent 4 dates from the data

### "Cannot find data" Error

**Cause:** Parquet file doesn't exist for the ticker
**Solution:** Run the fetch script to download data

### Import Takes Too Long

**Cause:** Many tickers or slow disk access
**Solution:** 
- Import fewer tickers at once
- Close other Excel workbooks
- Wait for the process to complete

---

## Available Data Fields

For a complete list of all available fields in Balance Sheet and Income Statement data, see [Available Data Reference](Available_Data_Reference.md).

**Balance Sheet Examples:**
- Total Assets, Current Assets, Cash And Cash Equivalents
- Total Liabilities, Current Liabilities, Long Term Debt
- Stockholders Equity, Retained Earnings

**Income Statement Examples:**
- Total Revenue, Cost Of Revenue, Gross Profit
- Operating Income, Net Income, EBITDA
- Basic EPS, Diluted EPS
