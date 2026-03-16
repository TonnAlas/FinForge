# FinForge - Complete User Guide

Welcome to FinForge! This comprehensive guide covers everything you need to know to use the application effectively.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Ticker Management](#2-ticker-management)
3. [Importing Data to Excel](#3-importing-data-to-excel)
4. [Creating Financial Ratios](#4-creating-financial-ratios)
5. [Assigning Ratios to Excel](#5-assigning-ratios-to-excel)
6. [Advanced Ratio Features](#6-advanced-ratio-features)
7. [Quick Reference](#7-quick-reference)
8. [Available Data Reference](#8-available-data-reference)
9. [Color Reference](#9-color-reference)
10. [Data Cleanup System](#10-data-cleanup-system)
11. [Troubleshooting](#11-troubleshooting)

---

# 1. Getting Started

## What is FinForge?

FinForge is a financial analysis tool that:
- Fetches real-time stock data from Yahoo Finance
- Stores data efficiently in Parquet format
- Imports financial statements into Excel
- Lets you create custom financial ratios
- Calculates and displays ratios for multiple tickers

---

## Quick Start

### Step 1: Launch the Application

**Option A - Using the Batch File (Recommended)**
1. Double-click `launch_finforge.bat` in the main folder
2. The FinForge window will open

**Option B - From Command Line**
```powershell
cd <your-finforge-folder>
.\.venv\Scripts\Activate.ps1
python -c "from Internal.launch.stock_launcher import main; main()"
```

### Step 2: Add Your First Ticker

1. In the launcher, type a ticker symbol (e.g., `AAPL`) in the input field
2. Click **Add** or press Enter
3. The app will automatically fetch all available data for that ticker

### Step 3: Launch Excel Dashboard

1. Select the tickers you want to analyze
2. Click **Launch Dashboard**
3. Excel will open with your selected tickers loaded

---

## System Requirements

- Windows 10 or later
- Microsoft Excel (with macros enabled)
- Python 3.10+ (included in .venv)
- Internet connection (for data fetching)

---

## First-Time Setup

If this is your first time using the app:

1. **Enable Excel Macros**
   - Open Excel, go to File > Options > Trust Center
   - Click Trust Center Settings > Macro Settings
   - Select "Enable all macros"

2. **Install xlwings Add-in** (if prompted)
   - The app uses xlwings to communicate with Excel
   - Follow any prompts to install the add-in

---

## Folder Structure

```
Stocks/
  FinForge.xlsm             <- Main Excel workbook
  launch_finforge.bat       <- Quick launcher
  data/                     <- All fetched data stored here
    fundamentals/           <- Financial statements
    holders/                <- Holder information
    metadata/               <- Company info
    prices/                 <- Price history
  Guides/                   <- Documentation
    User/                   <- User guides
    Developer/              <- Technical docs
  Importing/                <- Import scripts
  Internal/                 <- Core modules
```

---

# 2. Ticker Management

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
2. Click the **X** (delete) button next to it
3. Confirm the deletion

### What Happens to the Data?

When you remove a ticker:
1. The ticker is removed from your list immediately
2. The data is **scheduled for deletion** in 3 days
3. If you re-add the ticker within 3 days, the data is preserved
4. After 3 days, data is permanently deleted on next app launch

---

## Editing Tickers

1. Find the ticker in the list
2. Click the **Edit** button
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

### What Data is Fetched?

For each ticker, the app fetches:

| Category | Data Types |
|----------|------------|
| Financials | Income statement, balance sheet, cash flow (annual and quarterly) |
| Analyst | Earnings estimates, revenue estimates, price targets, recommendations |
| Holders | Major, institutional, mutual fund holders, insider roster |
| Insider | Transactions, purchases summary |
| Historical | Dividends, splits, price history |
| Other | News, SEC filings, calendar, company info |

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

# 3. Importing Data to Excel

Learn how to import financial statement data from your stored Parquet files into Excel.

---

## Overview

The import system transfers data from Parquet files to your Excel workbook:
- Balance sheet data goes to the "balance sheets" sheet
- Income statement data goes to the "income statements" sheet

---

## Prerequisites

Before importing:
1. Have tickers with fetched data (see Ticker Management)
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
cd <your-finforge-folder>
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
cd <your-finforge-folder>
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

# 4. Creating Financial Ratios

Learn how to create custom financial ratios using the Ratio Maker tool.

---

## What are Financial Ratios?

Financial ratios are calculations that use financial statement data to measure:
- Profitability (e.g., Profit Margin, ROE)
- Liquidity (e.g., Current Ratio, Quick Ratio)
- Leverage (e.g., Debt-to-Equity)
- Efficiency (e.g., Asset Turnover)
- Valuation (e.g., P/E Ratio, P/B Ratio)

---

## Opening the Ratio Maker

### From Excel

1. Open `FinForge.xlsm`
2. Run the macro: `OpenRatioMaker()`
   - Press `Alt + F8`
   - Select `OpenRatioMaker`
   - Click Run

### From Python

```powershell
cd <your-finforge-folder>
.\.venv\Scripts\Activate.ps1
python Importing/ratio_maker.py
```

---

## Creating Your First Ratio

### Step 1: Click "New Ratio"

The Create Ratio dialog opens.

### Step 2: Enter Ratio Name

Give your ratio a descriptive name:
- "Gross Margin"
- "Current Ratio"
- "Debt to Equity"

### Step 3: Build the Formula

Use the field selector and operators to build your formula.

**Available Data Sources:**

| Prefix | Source | Example Fields |
|--------|--------|----------------|
| `IS:` | Income Statement | Total Revenue, Net Income, EBITDA |
| `BS:` | Balance Sheet | Total Assets, Total Debt, Cash |
| `CF:` | Cash Flow | Operating Cash Flow, Free Cash Flow |
| `RATIO:` | Other Ratios | Use your previously created ratios |

**Available Operators:**

| Button | Operation |
|--------|-----------|
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `(` | Open parenthesis |
| `)` | Close parenthesis |

### Step 4: Add Notes (Optional)

Add a description or notes about the ratio:
- What it measures
- How to interpret it
- Reference ranges

### Step 5: Save

Click Save to store the ratio in `ratio_config.json`.

---

## Formula Examples

### Profitability Ratios

**Gross Margin**
```
(IS: Total Revenue - IS: Cost Of Revenue) / IS: Total Revenue
```

**Operating Margin**
```
IS: Operating Income / IS: Total Revenue
```

**Net Profit Margin**
```
IS: Net Income / IS: Total Revenue
```

**Return on Assets (ROA)**
```
IS: Net Income / BS: Total Assets
```

**Return on Equity (ROE)**
```
IS: Net Income / BS: Stockholders Equity
```

### Liquidity Ratios

**Current Ratio**
```
BS: Current Assets / BS: Current Liabilities
```

**Quick Ratio**
```
(BS: Current Assets - BS: Inventory) / BS: Current Liabilities
```

### Leverage Ratios

**Debt to Equity**
```
BS: Total Debt / BS: Stockholders Equity
```

**Debt to Assets**
```
BS: Total Debt / BS: Total Assets
```

### Efficiency Ratios

**Asset Turnover**
```
IS: Total Revenue / BS: Total Assets
```

### Using Other Ratios

**ROE using DuPont Analysis**
```
RATIO: Net Profit Margin * RATIO: Asset Turnover * RATIO: Equity Multiplier
```

---

## Understanding Syntax Highlighting

As you type, the formula is color-coded:

| Color | Meaning |
|-------|---------|
| Green | Income Statement fields (IS:) |
| Light Blue | Balance Sheet fields (BS:) |
| Purple | Price/Cash Flow fields |
| Orange | Operators (+, -, *, /) |
| Yellow | Parentheses |
| Gold | Other Ratios (RATIO:) |
| Light Blue | Numbers |
| Red + Wavy | Errors (typos, invalid fields) |

---

## Editing Existing Ratios

1. Select the ratio in the list
2. Click **Edit**
3. Modify the name, formula, or notes
4. Click **Save**

**Note:** If the ratio is assigned to an Excel column, the column header is automatically updated with the new name.

---

## Deleting Ratios

1. Select the ratio in the list
2. Click **Delete**
3. Confirm the deletion

**Warning:** If the ratio is assigned to an Excel column, unassign it first.

---

## Where are Ratios Stored?

Ratios are saved in: `Importing/ratio_config.json`

```json
{
  "ratios": {
    "Gross Margin": {
      "formula": "(IS: Total Revenue - IS: Cost Of Revenue) / IS: Total Revenue",
      "notes": "Measures profitability after direct costs"
    },
    "Current Ratio": {
      "formula": "BS: Current Assets / BS: Current Liabilities",
      "notes": "Measures short-term liquidity"
    }
  }
}
```

---

## Tips for Creating Good Ratios

1. **Use descriptive names** - "Gross Margin" not "GM1"
2. **Add notes** - Document what the ratio measures
3. **Test with known values** - Verify calculations are correct
4. **Use parentheses** - Ensure correct order of operations
5. **Check field names** - Use exact field names from the data

---

# 5. Assigning Ratios to Excel

Learn how to assign your created ratios to Excel columns for automatic calculation.

---

## Key Features

### What You Can Do:
1. **Assign Ratios**: Assign any created ratio to Excel columns (B, C, D, etc.)
2. **View Status**: See which ratios are assigned and to which columns
3. **View Notes**: Read ratio notes/descriptions
4. **Unassign Ratios**: Quick one-click unassignment
5. **Calculate Ratios**: Compute all ratios for all tickers using Parquet data
6. **Manual Tickers**: Enter tickers manually in Column A

### Benefits:
- **Fast**: Uses Parquet data for quick calculations
- **Reliable**: Minimal VBA, all logic in Python
- **Simple**: Clean UI with clear feedback
- **Flexible**: Assign any ratio to any column

---

## Excel Layout (Ratios Sheet)

```
Row 1: Financial Ratios [Title]
Row 2: [Empty]
Row 3: [Empty]
Row 4: Ticker | Ratio1 Name | Ratio2 Name | Ratio3 Name | ...
Row 5: Refresh | Unassign    | Unassign    | Unassign    | ...
Row 6: [Empty - Reserved]
Row 7: AAPL   | 1.2500      | 0.8500      | 2.4500      | ...
Row 8: MSFT   | 1.3000      | 0.9200      | 2.5000      | ...
Row 9: GOOGL  | 1.1800      | 0.7800      | 2.3200      | ...
...
```

### Column Structure:
- **Column A**: Ticker symbols (enter manually from Row 7 onwards)
- **Column B+**: Assigned ratios with calculated values

### Row Functions:
- **Row 4**: Ratio names (set by assignment)
- **Row 5**: Click to unassign ratio from that column
- **Row 7+**: Your data (tickers + calculated ratios)

---

## How to Use

### Step 1: Open Ratio Manager

**From Excel:**
- Run VBA macro: `OpenRatioManager()`
- Or create a button assigned to this macro

**From Python:**
```python
python -c "from Internal.Ratios.ratio_manager_ui import launch_ratio_manager; launch_ratio_manager()"
```

### Step 2: Assign a Ratio

In Ratio Manager UI:
1. Select a ratio from the list
2. Click **"Assign to Column"**
3. Enter column letter (B, C, D, etc.)
4. Click OK

Result: Ratio name appears in Row 4, unassign button in Row 5

**Rules:**
- Can only assign to columns B and onwards
- Cannot assign same ratio to multiple columns
- Cannot assign to a column that's already in use

### Step 3: View Ratio Notes

In Ratio Manager UI:
1. Select a ratio
2. Click **"View Notes"**
3. Read notes in popup dialog

### Step 4: Enter Tickers

In Excel (Ratios sheet):
1. Go to Column A, Row 7
2. Type ticker symbol (e.g., "AAPL")
3. Continue adding tickers in rows below

### Step 5: Calculate Ratios

**Option A - From Excel:**
- Run VBA macro: `RefreshRatios()`
- Or click the "Refresh" indicator in A5

**Option B - From Python:**
```python
python -c "from Internal.Ratios.ratio_calculator import calculate_ratios; calculate_ratios()"
```

**What Happens:**
- System reads all tickers from Column A
- Loads financial data from Parquet files
- Calculates each assigned ratio for each ticker
- Writes results to Excel
- Shows progress dialog

### Step 6: Unassign a Ratio

**Simple Method:**
1. In Excel, click the cell in Row 5 under the ratio you want to unassign
2. Confirm the dialog
3. Done! Column is cleared and ready for new assignment

---

## VBA Macros

### Essential Functions:

```vba
' Open the Ratio Manager UI
OpenRatioManager()

' Unassign ratio (automatic when clicking Row 5)
UnassignRatio()

' Calculate all ratios
RefreshRatios()
```

### Setting Up Buttons:

1. **Insert Developer Tab** > Insert > Button
2. **Assign macro** to button:
   - "Manage Ratios" > `OpenRatioManager`
   - "Calculate Ratios" > `RefreshRatios`

---

## Example Workflow

### Complete Example:

1. **Create Ratios** (using Ratio Maker)
   - Current Ratio: `BS: Current Assets / BS: Current Liabilities`
   - Quick Ratio: `BS: Cash / BS: Current Liabilities`

2. **Open Ratio Manager**
   - See both ratios as "Not assigned"

3. **Assign Ratios**
   - Current Ratio > Column B
   - Quick Ratio > Column C

4. **Enter Tickers**
   ```
   A7: AAPL
   A8: MSFT
   A9: GOOGL
   ```

5. **Calculate**
   - Click "Refresh" or run `RefreshRatios()`
   - See results:
   ```
   B7: 1.2500    C7: 0.8500
   B8: 1.3000    C8: 0.9200
   B9: 1.1800    C9: 0.7800
   ```

6. **Unassign if Needed**
   - Click cell B5 or C5 to unassign

---

## Best Practices

1. **Create ratios first** before trying to assign
2. **Enter tickers** before calculating
3. **Use meaningful ratio names** for easy identification
4. **Add notes** to ratios to remember what they do
5. **Refresh data** regularly to keep ratios up to date
6. **Save Excel** after assigning ratios

---

# 6. Advanced Ratio Features

## Horizontal Operator Layout

All operators and buttons are arranged **left-to-right** for an intuitive workflow.

**Operator Buttons:**
- `+` Addition
- `-` Subtraction  
- `*` Multiplication
- `/` or division sign Division (toggleable)
- `(` Opening parenthesis
- `)` Closing parenthesis

---

## Real-Time Syntax Highlighting

As you type or insert items, the formula is **immediately color-coded**:

| Element | Color | Example |
|---------|-------|---------|
| **Operators** | Orange (#FF9800) | `+`, `-`, `*`, `/` |
| **Brackets** | Yellow (#FFD700) | `(`, `)` |
| **Income Statement** | Green (#81C784) | `IS: Revenue`, `IS: Net Income` |
| **Balance Sheet** | Light Blue (#81D4FA) | `BS: Total Assets`, `BS: Cash` |
| **Price Data** | Purple (#CE93D8) | `P: Closing Price` |
| **Functions** | Yellow-Orange (#FFC107) | `AVERAGE`, `SUM`, `MAX` |
| **Numbers** | Light Blue (#90CAF9) | `100`, `1.5`, `0.25` |
| **Errors** | Red (#F44336) | Invalid fields, typos |

---

## Error Detection and Highlighting

Invalid tokens are automatically detected and marked with:
- **Red text color**
- **Wavy red underline**

**Examples of errors:**
- Typos: `IS: Reveneu` (misspelled)
- Invalid fields: `XYZ: Unknown`
- Incomplete operators: `IS: Revenue +` (missing right operand)

---

## Advanced Functions

Advanced functions are coming soon. Currently supported features include:
- Basic price data (Close, Open, High, Low, Volume)
- Historical price offsets using `[-XD]` syntax
- Calculated fields (Change, Change Percent)

---

## Color Legend

A built-in **color legend** appears above the formula preview showing:
```
Operators  Brackets  IS: Items  BS: Items  P: Items  Errors
```

Each bullet is colored to match its syntax highlighting.

---

## Usage Examples

### Example 1: Simple Ratio with Highlighting
**Gross Margin Formula:**
```
(IS: Revenue - IS: Cost of Revenue) / IS: Revenue
```

**How it appears:**
- `(` and `)` in **yellow**
- `IS: Revenue` in **green**
- `-` and `/` in **orange**
- `IS: Cost of Revenue` in **green**

### Example 2: Price Data with Historical Offset
**10-Day Price Change Percent:**
```
P: Change Percent [-10D]
```

**How it appears:**
- `P: Change Percent` in **purple**
- `[-10D]` offset in **brackets**
- `(` and `)` in **yellow**
- `IS: Revenue` in **green**
- `50` in **light blue**

### Example 3: Error Detection
**Typo in field name:**
```
IS: Reveneu / IS: Cost
```

**How it appears:**
- `IS:` in **green** (valid prefix)
- `Reveneu` in **red with wavy underline** (invalid field)
- `/` in **orange**
- `IS: Cost` in **red with wavy underline** (incomplete field name)

---

## Best Practices

### Use Color Feedback
- **Green/Blue/Purple** = Valid fields
- **Orange/Yellow** = Valid operators/brackets
- **Red** = Fix immediately!

### Validation Before Saving
1. Check for **red errors**
2. Verify all fields are **green**, **blue**, or **purple**
3. Ensure operators are **orange** or **yellow**

---

# 7. Quick Reference

## Color Guide (At-a-Glance)

```
Orange     >  Operators       >  + - * /
Yellow     >  Brackets        >  ( )
Green      >  IS: Items       >  Revenue, Net Income, EBITDA
Light Blue >  BS: Items       >  Total Assets, Cash, Debt
Purple     >  P: Items        >  Close Price, Change Percent
Light Blue >  Numbers         >  100, 1.5, 3.14
Red + Wave >  Errors          >  Typos, invalid fields
```

---

## Button Layout (Horizontal)

```
Operators:  [ + ]  [ - ]  [ * ]  [ / ]  [ ( ]  [ ) ]
```

---

## Common Formulas

### Gross Margin
```
(IS: Revenue - IS: Cost of Revenue) / IS: Revenue
```

### Current Ratio
```
BS: Current Assets / BS: Current Liabilities
```

### P/E Ratio
```
P: Closing Price / IS: Earnings Per Share
```

### ROE (Return on Equity)
```
IS: Net Income / BS: Total Equity
```

### Debt-to-Equity
```
BS: Total Debt / BS: Total Equity
```

### Operating Margin
```
IS: Operating Income / IS: Revenue
```

### Working Capital
```
BS: Current Assets - BS: Current Liabilities
```

---

## Pre-Save Checklist

1. No red errors
2. All fields are green/blue/purple
3. Operators are orange/yellow
4. Brackets match
5. Formula makes sense

---

## Quick Actions

| Action | How |
|--------|-----|
| Add field | Select > Insert Field |
| Add operator | Click operator button |
| Add function | Click Advanced Functions |
| Add notes | Click Notes |
| Save ratio | Click green Save |
| Cancel | Click Cancel |

---

## File Locations

- **Ratio Config**: `Importing/ratio_config.json`
- **Main App**: `Importing/ratio_maker.py`

---

# 8. Available Data Reference

This section lists all data fetched from Yahoo Finance and stored in Parquet format.

---

## Data Storage Structure

```
data/
  fundamentals/
    income_statement/{TICKER}.parquet
    balance_sheet/{TICKER}.parquet
    cash_flow/{TICKER}.parquet
    quarterly_income_statement/{TICKER}.parquet
    quarterly_balance_sheet/{TICKER}.parquet
    quarterly_cash_flow/{TICKER}.parquet
    earnings_estimate/{TICKER}.parquet
    revenue_estimate/{TICKER}.parquet
    analyst_price_targets/{TICKER}.parquet
    eps_trend/{TICKER}.parquet
    growth_estimates/{TICKER}.parquet
    earnings_history/{TICKER}.parquet
    recommendations/{TICKER}.parquet
    recommendations_summary/{TICKER}.parquet
    upgrades_downgrades/{TICKER}.parquet
    insider_transactions/{TICKER}.parquet
    insider_purchases/{TICKER}.parquet
    calendar/{TICKER}.parquet
    dividends/{TICKER}.parquet
    splits/{TICKER}.parquet
    actions/{TICKER}.parquet
    news/{TICKER}.parquet
    sec_filings/{TICKER}.parquet
  holders/
    major_holders/{TICKER}.parquet
    institutional_holders/{TICKER}.parquet
    mutualfund_holders/{TICKER}.parquet
    insider_roster_holders/{TICKER}.parquet
  prices/
    {TICKER}.parquet
  metadata/
    {TICKER}.json
```

---

## Income Statement Fields

| Field | Description |
|-------|-------------|
| Total Revenue | Total revenue from all sources |
| Operating Revenue | Revenue from core operations |
| Cost Of Revenue | Direct costs of goods/services sold |
| Gross Profit | Revenue minus cost of revenue |
| Operating Expense | Operating costs (R&D, SG&A, etc.) |
| Research And Development | R&D spending |
| Selling General And Administration | SG&A expenses |
| Operating Income | Profit from core operations |
| Pretax Income | Income before taxes |
| Tax Provision | Income tax expense |
| Net Income | Net income attributable to company |
| Net Income Common Stockholders | Net income for common shareholders |
| Basic EPS | Earnings per share (basic) |
| Diluted EPS | Earnings per share (diluted) |
| EBIT | Earnings before interest and taxes |
| EBITDA | Earnings before interest, taxes, depreciation and amortization |

---

## Balance Sheet Fields

### Assets
| Field | Description |
|-------|-------------|
| Total Assets | Sum of all assets |
| Current Assets | Assets convertible to cash within 1 year |
| Cash And Cash Equivalents | Cash on hand |
| Receivables | Money owed to company |
| Inventory | Goods held for sale |
| Total Non Current Assets | Long-term assets |
| Net PPE | Property, plant and equipment (net) |
| Goodwill | Goodwill from acquisitions |

### Liabilities
| Field | Description |
|-------|-------------|
| Total Liabilities Net Minority Interest | All liabilities |
| Current Liabilities | Debts due within 1 year |
| Accounts Payable | Supplier payables |
| Current Debt | Short-term borrowings |
| Long Term Debt | Long-term borrowings |

### Equity
| Field | Description |
|-------|-------------|
| Total Equity Gross Minority Interest | Total equity |
| Stockholders Equity | Shareholder equity |
| Common Stock | Common shares value |
| Retained Earnings | Accumulated profits |

### Calculated Metrics
| Field | Description |
|-------|-------------|
| Net Debt | Total debt minus cash |
| Total Debt | Sum of all debt |
| Working Capital | Current assets minus current liabilities |
| Invested Capital | Equity plus debt |

---

## Cash Flow Statement Fields

### Operating Activities
| Field | Description |
|-------|-------------|
| Operating Cash Flow | Cash from operations |
| Net Income From Continuing Operations | Starting net income |
| Depreciation Amortization Depletion | Non-cash depreciation |
| Stock Based Compensation | Stock-based comp expense |
| Change In Working Capital | Working capital changes |

### Investing Activities
| Field | Description |
|-------|-------------|
| Investing Cash Flow | Cash used in investing |
| Capital Expenditure | CapEx spending |
| Purchase Of Investment | Investment purchases |
| Sale Of Investment | Investment sales |

### Financing Activities
| Field | Description |
|-------|-------------|
| Financing Cash Flow | Cash from financing |
| Issuance Of Debt | New debt raised |
| Repayment Of Debt | Debt repayments |
| Common Stock Issuance | Common stock issued |
| Cash Dividends Paid | Dividend payments |

### Summary
| Field | Description |
|-------|-------------|
| Changes In Cash | Total cash change |
| Free Cash Flow | Operating cash minus CapEx |

---

## Analyst Estimates

### Earnings Estimate
| Column | Description |
|--------|-------------|
| avg | Average EPS estimate |
| low | Low EPS estimate |
| high | High EPS estimate |
| yearAgoEps | EPS from same period last year |
| numberOfAnalysts | Number of analysts |
| growth | Expected growth rate |

### Revenue Estimate
| Column | Description |
|--------|-------------|
| avg | Average revenue estimate |
| low | Low revenue estimate |
| high | High revenue estimate |
| numberOfAnalysts | Number of analysts |

### Analyst Price Targets
| Field | Description |
|-------|-------------|
| current | Current stock price |
| high | Highest analyst target |
| low | Lowest analyst target |
| mean | Average target price |
| median | Median target price |

---

## Holder Data

### Major Holders
| Metric | Description |
|--------|-------------|
| insidersPercentHeld | Percentage held by insiders |
| institutionsPercentHeld | Percentage held by institutions |
| institutionsFloatPercentHeld | Institutional % of float |
| institutionsCount | Number of institutional holders |

### Institutional Holders
| Column | Description |
|--------|-------------|
| Holder | Institution name |
| pctHeld | Percentage of shares held |
| Shares | Number of shares |
| Value | Dollar value of position |

---

## Price Data

| Column | Description |
|--------|-------------|
| Date | Trading date |
| Open | Opening price |
| High | Day high |
| Low | Day low |
| Close | Closing price |
| Volume | Trading volume |
| Dividends | Dividend amount (if any) |
| Stock Splits | Split ratio (if any) |

---

## Using This Data in Ratio Formulas

Use these prefixes to reference data:

| Prefix | Data Source |
|--------|-------------|
| IS: | Income Statement |
| BS: | Balance Sheet |
| CF: | Cash Flow |

Example formulas:
- `IS: Net Income / BS: Total Assets` (ROA)
- `BS: Total Debt / BS: Stockholders Equity` (Debt to Equity)
- `CF: Free Cash Flow / IS: Net Income` (FCF Conversion)

---

# 9. Color Reference

## Syntax Highlighting Color Palette

### Operator Colors
```
ORANGE (#FF9800) - Arithmetic Operators
  + (addition)
  - (subtraction)
  * (multiplication)
  / (division)
```

### Bracket Colors
```
YELLOW (#FFD700) - Grouping Brackets
  ( (open parenthesis)
  ) (close parenthesis)
```

### Financial Item Colors

#### Income Statement Items
```
GREEN (#81C784) - Income Statement Fields
  IS: Revenue
  IS: Net Income
  IS: Operating Income
  IS: EBITDA
  ... (any field prefixed with "IS:")
```

#### Balance Sheet Items
```
LIGHT BLUE (#81D4FA) - Balance Sheet Fields
  BS: Total Assets
  BS: Total Equity
  BS: Total Liabilities
  BS: Cash
  ... (any field prefixed with "BS:")
```

#### Price/Market Data
```
PURPLE (#CE93D8) - Price & Market Data
  P: Closing Price
  P: Opening Price
  P: Volume
  ... (any field prefixed with "P:")
```

### Function Colors
```
YELLOW-ORANGE (#FFC107) - Advanced Functions
  AVERAGE
  SUM
  MAX
  MIN
  MEDIAN
  STDEV
```

### Number Colors
```
LIGHT BLUE (#90CAF9) - Numeric Literals
  100
  1.5
  0.25
```

### Error Colors
```
RED (#F44336) - Invalid Tokens/Errors
  - Misspelled field names
  - Unknown prefixes
  - Unrecognized tokens
  - Typos
  
  Visual indicators:
  - Red text color
  - Wavy red underline
```

---

## Example Formulas with Color Coding

### Gross Margin
```
(IS: Revenue - IS: Cost of Revenue) / IS: Revenue
```
**Colors:**
- `(`, `)` = Yellow
- `IS: Revenue` = Green (appears twice)
- `IS: Cost of Revenue` = Green
- `-`, `/` = Orange

### Current Ratio
```
BS: Current Assets / BS: Current Liabilities
```
**Colors:**
- `BS: Current Assets` = Light Blue
- `BS: Current Liabilities` = Light Blue
- `/` = Orange

### P/E Ratio
```
P: Closing Price / IS: Earnings Per Share
```
**Colors:**
- `P: Closing Price` = Purple
- `IS: Earnings Per Share` = Green
- `/` = Orange

### Error Example (Typo)
```
IS: Reveneu / BS: Totl Assets
```
**Colors:**
- `IS:` = Green (valid prefix)
- `Reveneu` = Red + wavy underline (invalid)
- `/` = Orange
- `BS:` = Light Blue (valid prefix)
- `Totl Assets` = Red + wavy underline (invalid)

---

## Dark Theme Background Colors

### Dialog Background
- **Main**: #121212 (Very Dark Gray)
- **Input Fields**: #1E1E1E (Dark Gray)
- **Borders**: #2C2C2C (Medium Dark Gray)

### Text Colors
- **Primary Text**: #E0E0E0 (Light Gray)
- **Secondary Text**: #B0B0B0 (Medium Gray)

### Accent Colors
- **Primary Accent**: #29B6F6 (Light Blue)
- **Success**: #4CAF50 (Green)
- **Danger**: #E57373 (Red)
- **Warning**: #FFA726 (Orange)

---

# 10. Data Cleanup System

## Overview

FinForge includes an automatic data cleanup system that manages parquet file storage when tickers are removed or changed. This prevents the system from accumulating unused data while providing a safety window to recover accidentally deleted tickers.

---

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

---

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

---

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

---

## Pending Deletions File

The pending deletions are tracked in `data/pending_deletions.json`:

```json
{
  "TICKER1": {
    "scheduled_date": "2025-12-06T21:28:50.896922",
    "deletion_date": "2025-12-09T21:28:50.896910"
  }
}
```

- `scheduled_date`: When the ticker was removed from the UI
- `deletion_date`: When the data will be permanently deleted

---

# 11. Troubleshooting

## Ticker Management Issues

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

---

## Import Issues

### No Data Appears
**Possible Causes:**
1. Tickers not in Row 4
2. Data not fetched yet
3. Column A doesn't say "INDEX"

**Solutions:**
1. Verify tickers are in Row 4, starting from column B
2. Run the fetch script first
3. Ensure column A, Row 4 contains "INDEX"

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

## Ratio Issues

### Red Error Highlighting
**Cause:** Invalid field name
**Solution:** Check spelling, use the field selector dropdown

### "Field not found" Error
**Cause:** Field doesn't exist in the data
**Solution:** See Available Data Reference for valid field names

### Calculation Shows #N/A
**Cause:** 
- Data missing for the ticker
- Division by zero

**Solution:**
- Verify data exists for the ticker
- Add logic to handle zero denominators

### Ratio Not Appearing in Manager
**Cause:** Save failed or file permission issue
**Solution:** 
- Check if ratio_config.json is writable
- Try saving again

---

## Ratio Assignment Issues

### "No ratios found"
**Solution:** Create ratios first using Ratio Maker

### "No tickers found"
**Solution:** Enter tickers in Column A starting from Row 7

### "Failed to load Parquet data"
**Solution:** Make sure data files exist. Run data import first if needed.

### "Column already in use"
**Solution:** Unassign the existing ratio first (click Row 5)

### Calculation shows "N/A"
**Reason:** Financial data not found for that ticker/item
**Check:** Ticker spelling and data availability

### Calculation shows "DIV/0"
**Reason:** Denominator is zero
**Normal:** Some ratios can legitimately be undefined

---

## General Tips

1. **Always fetch data first** before trying to import or calculate
2. **Check your internet connection** if data fetching fails
3. **Verify ticker symbols** exist on Yahoo Finance
4. **Enable Excel macros** for full functionality
5. **Save your work frequently** when working with Excel

---

# Support

For additional help:
- Check the Guides folder for more documentation
- Review the Developer guides for technical details
- Ensure all prerequisites are installed correctly

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Data Source: Yahoo Finance via yfinance library*
