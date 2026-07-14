# Yahoo Finance Data Import Structure - Complete Developer Guide

## Table of Contents
1. [Overview](#overview)
2. [Data Architecture](#data-architecture)
3. [Financial Statements](#financial-statements)
4. [Analyst Data](#analyst-data)
5. [Holders Data](#holders-data)
6. [Historical Data](#historical-data)
7. [Metadata & Company Info](#metadata--company-info)
8. [Price Data](#price-data)
9. [Ratio Formulas](#ratio-formulas)
10. [Implementation Details](#implementation-details)

---

## Overview

FinForge fetches all available data from Yahoo Finance via the `yfinance` library and stores it in Parquet format for efficient querying and analysis. This guide documents every data type that can be imported, their structure, fields, and usage.

### Data Sources
- **Primary API:** yfinance (Yahoo Finance)
- **Storage Format:** Apache Parquet (binary columnar format)
- **Update Frequency:** As needed (manual or automated)
- **Retention:** Indefinite (with optional deletion scheduling)

### File Structure
```
data/
├── fundamentals/           # Financial statements & analyst data
│   ├── income_statement/
│   ├── balance_sheet/
│   ├── cash_flow/
│   ├── quarterly_income_statement/
│   ├── quarterly_balance_sheet/
│   ├── quarterly_cash_flow/
│   ├── earnings_estimate/
│   ├── revenue_estimate/
│   ├── analyst_price_targets/
│   ├── eps_trend/
│   ├── growth_estimates/
│   ├── earnings_history/
│   ├── recommendations/
│   ├── recommendations_summary/
│   ├── upgrades_downgrades/
│   ├── insider_transactions/
│   ├── insider_purchases/
│   ├── calendar/
│   ├── dividends/
│   ├── splits/
│   ├── actions/
│   ├── news/
│   └── sec_filings/
├── holders/                # Ownership data
│   ├── major_holders/
│   ├── institutional_holders/
│   ├── mutualfund_holders/
│   └── insider_roster_holders/
├── prices/                 # Historical price data
│   └── {TICKER}.parquet
├── metadata/               # Company info
│   └── {TICKER}.json
├── pending_deletions.json  # Deletion tracking
└── tickers.json           # Tracked ticker list
```

---

## Data Architecture

### Technical Stack
- **Data Fetching:** `yfinance` library (Python)
- **Data Processing:** `pandas` library
- **Data Storage:** Apache Parquet files (per-ticker)
- **Excel Integration:** `xlwings` for dynamic data import
- **GUI:** PySide6 for ratio maker and management UI

### Data Manager Class
Located in: `data_management/stock_data_manager.py`

Key methods:
- `save_stock_prices()` - Save historical price data
- `save_fundamental_data()` - Save financial statements & analyst data
- `save_holders_data()` - Save ownership information
- `save_metadata()` - Save company information
- `get_stock_prices()` - Retrieve price data
- `get_fundamental_data()` - Retrieve financial data
- `get_holders_data()` - Retrieve ownership data

### Data Fetching Script
Located in: `Internal/ticker_management/fetch_stocks.py`

Main function `fetch_ticker_data()` retrieves:
1. Historical price data (1 year)
2. Annual financial statements (3 years)
3. Quarterly financial statements (4 quarters)
4. Analyst estimates and recommendations
5. Holder information
6. Company metadata

---

## Financial Statements

### Annual Income Statement
**File:** `fundamentals/income_statement/{TICKER}.parquet`
**yfinance Source:** `Ticker.income_stmt`
**Columns:** Date (index) + All fields listed below
**Frequency:** Annual (typically 3-5 years of data)

#### Revenue & Gross Profit
- **Total Revenue** - Sum of all operating and non-operating revenue
- **Operating Revenue** - Revenue from primary business operations
- **Cost Of Revenue** - Direct costs of goods/services sold (COGS)
- **Gross Profit** - Total Revenue minus Cost Of Revenue

#### Operating Expenses
- **Research And Development** - R&D spending
- **Selling General And Administration** - SG&A expenses (selling, general, admin)
- **Selling And Marketing Expense** - Marketing and sales related costs
- **General And Administrative Expense** - Administrative overhead
- **Operating Expense** - Total operating expenses (all OpEx)
- **Other G and A** - Other general & administrative items

#### Operating Income
- **Operating Income** - Gross Profit minus Operating Expenses (EBIT proxy)
- **Total Operating Income As Reported** - Operating income as officially reported

#### Interest & Non-Operating Items
- **Net Non Operating Interest Income Expense** - Net non-operating interest (interest income - expense)
- **Interest Income Non Operating** - Interest earned on investments/cash
- **Interest Expense Non Operating** - Interest paid on debt
- **Other Non Operating Income Expenses** - Other non-operating gains/losses
- **Special Income Charges** - One-time or unusual items
- **Write Off** - Asset write-offs and impairments
- **Gain On Sale Of Security** - Gains from selling securities
- **Other Income Expense** - Other miscellaneous income/expense items

#### Pre-Tax & Taxes
- **Pretax Income** - Income/profit before income tax
- **Tax Provision** - Income tax expense
- **Tax Rate For Calcs** - Effective tax rate percentage

#### Net Income
- **Net Income** - Bottom line profit (net income attributable to shareholders)
- **Net Income Including Noncontrolling Interests** - Total net income including minority interests
- **Net Income Continuous Operations** - Net income from continuing operations
- **Net Income From Continuing Operation Net Minority Interest** - Continuing ops, less minority
- **Net Income Common Stockholders** - Net income available to common shareholders
- **Diluted NI Availto Com Stockholders** - Diluted net income for common stockholders
- **Net Income From Continuing And Discontinued Operation** - Combined net income

#### Normalized/Adjusted Metrics
- **Normalized Income** - Income adjusted for one-time items
- **Normalized EBITDA** - EBITDA adjusted for unusual items
- **Total Unusual Items** - All unusual/one-time items
- **Total Unusual Items Excluding Goodwill** - Unusual items excluding goodwill
- **Tax Effect Of Unusual Items** - Tax impact of unusual items

#### Per-Share Data
- **Basic EPS** - Earnings per share (undiluted; basic shares outstanding)
- **Diluted EPS** - Earnings per share (fully diluted; includes options, warrants, etc.)
- **Basic Average Shares** - Average shares outstanding (basic)
- **Diluted Average Shares** - Average shares outstanding (fully diluted)

#### EBIT & EBITDA
- **EBIT** - Earnings Before Interest & Taxes (proxy for Operating Income)
- **EBITDA** - Earnings Before Interest, Taxes, Depreciation & Amortization
- **Total Expenses** - Sum of all expenses
- **Total Interest Income** - All interest earned
- **Total Interest Expense** - All interest paid
- **Net Interest Income** - Interest income minus interest expense
- **Reconciled Cost Of Revenue** - Adjusted cost of revenue
- **Reconciled Depreciation** - Adjusted depreciation expense

---

### Annual Balance Sheet
**File:** `fundamentals/balance_sheet/{TICKER}.parquet`
**yfinance Source:** `Ticker.balance_sheet`
**Columns:** Date (index) + All fields listed below
**Frequency:** Annual (typically 3-5 years of data)

#### Assets - Current
- **Total Assets** - Sum of all assets (current + non-current)
- **Current Assets** - Assets expected to convert to cash within 12 months
- **Cash And Cash Equivalents** - Cash on hand + near-cash instruments
- **Cash Financial** - Cash positions at financial institutions
- **Cash Equivalents** - Money market instruments, short-term investments
- **Other Short Term Investments** - Short-term investment securities
- **Cash Cash Equivalents And Short Term Investments** - Total liquid assets

#### Receivables
- **Receivables** - Money/assets owed to the company
- **Accounts Receivable** - Customer receivables from sales
- **Gross Accounts Receivable** - Receivables before allowances
- **Allowance For Doubtful Accounts Receivable** - Reserve for bad debts

#### Inventory
- **Inventory** - Goods held for sale (total)
- **Raw Materials** - Raw/unprocessed inventory
- **Work In Process** - Partially completed goods
- **Finished Goods** - Completed inventory ready for sale

#### Other Current Assets
- **Hedging Assets Current** - Current hedging instruments/derivatives
- **Other Current Assets** - Other short-term assets

#### Assets - Non-Current

#### Property, Plant & Equipment (PP&E)
- **Net PPE** - PP&E at net/depreciated value
- **Gross PPE** - PP&E at original/undepreciated value
- **Accumulated Depreciation** - Total depreciation taken to date
- **Land And Improvements** - Land and improvements to land
- **Buildings And Improvements** - Building assets
- **Machinery Furniture Equipment** - Equipment and machinery
- **Leases** - Operating lease assets
- **Other Properties** - Other property assets
- **Properties** - Summary of all property holdings

#### Intangible Assets & Goodwill
- **Goodwill And Other Intangible Assets** - Combined intangibles
- **Goodwill** - Goodwill from acquisitions
- **Other Intangible Assets** - Patents, trademarks, copyrights, etc.

#### Investments & Financial Assets
- **Investments And Advances** - Investment holdings and advances
- **Investmentin Financial Assets** - Financial investments
- **Available For Sale Securities** - Securities classified as available-for-sale
- **Long Term Equity Investment** - Long-term equity stakes in other companies
- **Financial Assets** - Total financial assets

#### Other Non-Current Assets
- **Other Non Current Assets** - Other long-term assets

#### Liabilities - Current
- **Current Liabilities** - Obligations due within 12 months
- **Payables And Accrued Expenses** - Current payables and accruals
- **Payables** - Money owed to suppliers/vendors
- **Accounts Payable** - Supplier and vendor payables

#### Current Taxes & Debt
- **Total Tax Payable** - Total taxes owed
- **Income Tax Payable** - Income taxes due (current)
- **Current Debt And Capital Lease Obligation** - Short-term debt and leases
- **Current Debt** - Short-term borrowings/loans
- **Commercial Paper** - Short-term commercial paper outstanding
- **Other Current Borrowings** - Other short-term loans

#### Pensions & Current Deferred Items
- **Pensionand Other Post Retirement Benefit Plans Current** - Current pension/retirement obligations

#### Deferred Revenue & Other Liabilities
- **Current Deferred Liabilities** - Current deferred tax/revenue liabilities
- **Current Deferred Revenue** - Prepaid customer payments (current)
- **Other Current Liabilities** - Other short-term obligations

#### Liabilities - Non-Current

#### Long-Term Debt
- **Long Term Debt And Capital Lease Obligation** - Long-term debt and lease obligations
- **Long Term Debt** - Long-term borrowings/bonds
- **Long Term Capital Lease Obligation** - Long-term operating lease obligations
- **Capital Lease Obligations** - All lease-related obligations

#### Deferred Items & Other Long-Term
- **Non Current Deferred Liabilities** - Long-term deferred items
- **Non Current Deferred Revenue** - Long-term prepaid customer payments
- **Non Current Deferred Taxes Liabilities** - Deferred tax liabilities (long-term)
- **Tradeand Other Payables Non Current** - Long-term payables
- **Other Non Current Liabilities** - Other long-term obligations

#### Stakeholder's Equity
- **Stockholders Equity** - Total shareholders' equity (net assets)
- **Total Equity Gross Minority Interest** - Total equity including minority interests
- **Common Stock Equity** - Common shareholders' equity
- **Capital Stock** - Total capital stock value
- **Common Stock** - Common share value at par/stated value
- **Retained Earnings** - Accumulated profits/losses
- **Gains Losses Not Affecting Retained Earnings** - Other comprehensive income (OCI)
- **Other Equity Adjustments** - Other equity items
- **Share Issued** - Total shares issued/outstanding
- **Ordinary Shares Number** - Number of common shares outstanding

#### Capitalization & Derived Metrics
- **Total Capitalization** - Total capital (equity + debt)
- **Net Debt** - Total debt minus cash (derived metric)
- **Total Debt** - Sum of current + long-term debt (derived metric)
- **Working Capital** - Current assets minus current liabilities (derived metric)
- **Invested Capital** - Equity plus net debt (derived metric)
- **Tangible Book Value** - Equity minus intangible assets (derived metric)
- **Net Tangible Assets** - Tangible assets minus liabilities (derived metric)

---

### Annual Cash Flow Statement
**File:** `fundamentals/cash_flow/{TICKER}.parquet`
**yfinance Source:** `Ticker.cashflow`
**Columns:** Date (index) + All fields listed below
**Frequency:** Annual (typically 3-5 years of data)

#### Operating Activities
- **Operating Cash Flow** - Cash generated from core operations
- **Net Income** - Starting point (net income from continuing operations)
- **Depreciation And Amortization** - Non-cash depreciation & amortization
- **Deferred Taxes** - Changes in deferred tax accounts
- **Stock Based Compensation** - Non-cash stock compensation expense
- **Accounts Receivable** - Changes in accounts receivable (uses/sources cash)
- **Inventory** - Changes in inventory (uses/sources cash)
- **Accounts Payable** - Changes in accounts payable (uses/sources cash)
- **Other Operating Activities** - Other operating adjustments

#### Investing Activities
- **Investing Cash Flow** - Cash used for investing activities
- **Capital Expenditure** - Cash spent on purchases of PP&E
- **Net Other Investing Changes** - Other investing activities
- **Asset Purchases** - Purchases of marketable securities/investments
- **Asset Sales** - Sales of investments/securities

#### Financing Activities
- **Financing Cash Flow** - Cash from/used for financing activities
- **Debt Repayment** - Cash paid toward debt reduction
- **Common Stock Issued** - Cash raised from stock issuance
- **Common Stock Repurchased** - Cash used for share buybacks
- **Dividends Paid** - Cash paid as dividends
- **Other Financing Activities** - Other financing transactions

#### Summary
- **End Cash Position** - Cash at end of period
- **Beginning Cash Position** - Cash at beginning of period
- **Changes In Cash** - Net change in cash during period
- **Free Cash Flow** - Operating cash flow minus capital expenditures

---

### Quarterly Financial Statements
**Files:** 
- `fundamentals/quarterly_income_statement/{TICKER}.parquet`
- `fundamentals/quarterly_balance_sheet/{TICKER}.parquet`
- `fundamentals/quarterly_cash_flow/{TICKER}.parquet`

**yfinance Sources:**
- `Ticker.quarterly_income_stmt`
- `Ticker.quarterly_balance_sheet`
- `Ticker.quarterly_cashflow`

**Columns:** Date (index) + All fields from annual statements
**Frequency:** Quarterly (latest 4 quarters; 4 periods per year)

Quarterly statements contain the same fields as annual statements but with more recent, granular data. Most recent 4 quarters are available.

---

## Analyst Data

### Earnings Estimates
**File:** `fundamentals/earnings_estimate/{TICKER}.parquet`
**yfinance Source:** `Ticker.earnings_estimate`
**Type:** DataFrame or Series (depends on data availability)

| Field | Description |
|-------|-------------|
| Number Of Analysts | Count of analysts providing estimates |
| Low Estimate | Lowest earnings estimate |
| Avg Estimate | Average earnings estimate |
| High Estimate | Highest earnings estimate |
| Growth Estimate Next Year | Estimated earnings growth (%) next year |
| Growth Estimate Next 5 Years | Estimated earnings growth (%) next 5 years |
| Growth Estimate Past 5 Years | Historical earnings growth (%) past 5 years |

---

### Revenue Estimates
**File:** `fundamentals/revenue_estimate/{TICKER}.parquet`
**yfinance Source:** `Ticker.revenue_estimate`
**Type:** DataFrame or Series

| Field | Description |
|-------|-------------|
| Number Of Analysts | Count of analysts providing estimates |
| Low Estimate | Lowest revenue estimate |
| Avg Estimate | Average revenue estimate |
| High Estimate | Highest revenue estimate |

---

### EPS Trend (Earnings Per Share)
**File:** `fundamentals/eps_trend/{TICKER}.parquet`
**yfinance Source:** `Ticker.eps_trend`
**Type:** DataFrame (time-indexed)

Tracks earnings per share estimates and revisions over time:

| Field | Description |
|-------|-------------|
| Current Estimate | Current EPS estimate |
| Number Of Analysts | Number of analysts |
| Number Of Down Revisions | Count of downward estimate revisions |
| Number Of Up Revisions | Count of upward estimate revisions |

**Time Periods:**
- 0d (Current)
- 7d (7 days ago)
- 30d (30 days ago)

---

### Growth Estimates
**File:** `fundamentals/growth_estimates/{TICKER}.parquet`
**yfinance Source:** `Ticker.growth_estimates`
**Type:** DataFrame

Growth rate estimates for earnings, sales, and other metrics:

| Field | Description |
|-------|-------------|
| PE Ratio Current Estimate | P/E ratio based on current estimates |
| PE Ratio Forward Estimate | Forward P/E (estimates) |
| PEG Ratio | P/E to Growth ratio |
| Earnings Growth | Earnings growth estimate (%) |
| Sales Growth | Sales growth estimate (%) |
| Earnings Per Share Growth | EPS growth estimate (%) |

---

### Earnings History
**File:** `fundamentals/earnings_history/{TICKER}.parquet`
**yfinance Source:** `Ticker.earnings_history`
**Type:** DataFrame (time-indexed)

Historical earnings announcements and surprises:

| Field | Description |
|-------|-------------|
| Earnings Date | Date of earnings announcement |
| Estimate | EPS estimate for quarter |
| Reported | Actual EPS reported |
| Surprise | Difference between reported and estimate (%) |

---

### Recommendations
**File:** `fundamentals/recommendations/{TICKER}.parquet`
**yfinance Source:** `Ticker.recommendations`
**Type:** DataFrame (date-indexed)

Analyst recommendations over time:

| Field | Description |
|-------|-------------|
| Grade | Recommendation grade (Buy, Hold, Sell, etc.) |
| Firm | Analyst firm/company |
| To Grade | Target grade (in revisions) |
| From Grade | Previous grade (in revisions) |
| Action | Type of action (init/reit/down/up/main) |

---

### Recommendations Summary
**File:** `fundamentals/recommendations_summary/{TICKER}.parquet`
**yfinance Source:** `Ticker.recommendations_summary`
**Type:** DataFrame (date-indexed)

Summary of analyst recommendations by grade:

| Field | Description |
|-------|-------------|
| numberOfAnalystsRating | Total analysts providing rating |
| numberOfAnalystsStrongBuy | Count recommending Strong Buy |
| numberOfAnalystsBuy | Count recommending Buy |
| numberOfAnalystsHold | Count recommending Hold |
| numberOfAnalystsSell | Count recommending Sell |
| numberOfAnalystsStrongSell | Count recommending Strong Sell |

---

### Upgrades & Downgrades
**File:** `fundamentals/upgrades_downgrades/{TICKER}.parquet`
**yfinance Source:** `Ticker.upgrades_downgrades`
**Type:** DataFrame (date-indexed)

Historical rating changes:

| Field | Description |
|-------|-------------|
| Grade | Current/target grade |
| Action | Type (upgrade, downgrade, init, main, reit) |
| From Grade | Previous grade |
| To Grade | New grade |
| Firm | Analyst firm |

---

### Analyst Price Targets
**File:** `fundamentals/analyst_price_targets/{TICKER}.parquet`
**yfinance Source:** `Ticker.analyst_price_targets`
**Type:** Single record dictionary (stored as 1-row DataFrame)

| Field | Description |
|-------|-------------|
| numberOfAnalystsTargeting | Count of analysts with price targets |
| targetMeanPrice | Average price target |
| targetMedianPrice | Median price target |
| targetHighPrice | Highest price target |
| targetLowPrice | Lowest price target |
| numberOfAnalystsRevising | Count recently revising targets |
| targetPercentChange | Percent change of target vs current |

---

## Holders Data

### Major Shareholders
**File:** `holders/major_holders/{TICKER}.parquet`
**yfinance Source:** `Ticker.major_holders`
**Type:** DataFrame

| Column | Description |
|--------|-------------|
| Holder | Name of major shareholder |
| Shares | Number of shares held |
| Percent Out | Percentage of shares outstanding |
| Value | Value of holdings (if available) |

---

### Institutional Holders
**File:** `holders/institutional_holders/{TICKER}.parquet`
**yfinance Source:** `Ticker.institutional_holders`
**Type:** DataFrame

| Column | Description |
|--------|-------------|
| Holder | Name of institutional investor |
| Shares | Number of shares held |
| Percent Out | Percentage of shares outstanding |
| Value | Value of holdings (millions) |

Includes mutual funds, pension funds, hedge funds, banks, etc.

---

### Mutual Fund Holders
**File:** `holders/mutualfund_holders/{TICKER}.parquet`
**yfinance Source:** `Ticker.mutualfund_holders`
**Type:** DataFrame

| Column | Description |
|--------|-------------|
| Holder | Name of mutual fund |
| Shares | Number of shares held |
| Percent Out | Percentage of shares outstanding |
| Value | Value of holdings (millions) |

Mutual fund investors only.

---

### Insider Roster Holders
**File:** `holders/insider_roster_holders/{TICKER}.parquet`
**yfinance Source:** `Ticker.insider_roster_holders`
**Type:** DataFrame

| Column | Description |
|--------|-------------|
| Name | Insider name |
| Title | Position/title at company |
| Pay | Total compensation (if available) |
| Exercised | Options exercised |
| Unexercised | Unexercised options |
| Value | Value of unexercised options |

Company insiders (executives, directors, employees).

---

## Historical Data

### Dividends
**File:** `fundamentals/dividends/{TICKER}.parquet`
**yfinance Source:** `Ticker.dividends`
**Type:** Series (date-indexed) converted to DataFrame

| Column | Description |
|--------|-------------|
| Date | Ex-dividend date |
| Dividends | Dividend amount per share |

---

### Stock Splits
**File:** `fundamentals/splits/{TICKER}.parquet`
**yfinance Source:** `Ticker.splits`
**Type:** Series (date-indexed) converted to DataFrame

| Column | Description |
|--------|-------------|
| Date | Split date |
| Stock Splits | Split ratio (e.g., 2.0 for 2:1 split) |

---

### Combined Actions (Dividends + Splits)
**File:** `fundamentals/actions/{TICKER}.parquet`
**yfinance Source:** `Ticker.actions`
**Type:** DataFrame

Combined dividends and stock splits:

| Column | Description |
|--------|-------------|
| Date | Event date |
| Dividends | Dividend amount (0 if split-only) |
| Stock Splits | Split ratio (0 if dividend-only) |

---

## Metadata & Company Info

### Company Metadata
**File:** `metadata/{TICKER}.json`
**yfinance Source:** `Ticker.info` (dictionary)
**Type:** JSON object

Comprehensive company information snapshot:

#### Identification
- `symbol` - Stock ticker symbol
- `longName` - Full company name
- `shortName` - Short company name
- `industry` - Industry classification
- `industryKey` - Industry key for API
- `industryDisp` - Industry display name
- `sector` - Sector classification
- `sectorKey` - Sector key for API
- `sectorDisp` - Sector display name

#### Location & Business
- `address1` - Street address
- `city` - City
- `state` - State/province
- `zip` - ZIP code
- `country` - Country
- `phone` - Phone number
- `website` - Company website
- `longBusinessSummary` - Detailed business description
- `fullTimeEmployees` - Full-time employee count

#### Corporate Officers
- `companyOfficers` - Array of officer objects with:
  - `name` - Officer name
  - `age` - Age
  - `title` - Job title
  - `yearBorn` - Birth year
  - `totalPay` - Total compensation
  - `exercisedValue` - Value of exercised options
  - `unexercisedValue` - Value of unexercised options

#### Shares & Capital Structure
- `sharesOutstanding` - Shares outstanding
- `sharesFloat` - Floating shares
- `sharesShort` - Shares short
- `sharesShortPriorMonth` - Shares short (30 days ago)
- `shortRatio` - Days to cover short
- `heldPercentInsiders` - % shares held by insiders
- `heldPercentInstitutions` - % shares held by institutions

#### Market Data
- `trailingPE` - P/E ratio (trailing 12 months)
- `forwardPE` - P/E ratio (forward estimates)
- `priceToBook` - Price-to-book ratio
- `priceToSalesTrailing12Months` - P/S ratio
- `debtToEquity` - Debt to equity ratio
- `enterpriseToRevenue` - EV/Revenue ratio
- `enterpriseToEbitda` - EV/EBITDA ratio
- `beta` - Beta (volatility vs market)
- `52WeekChange` - 52-week price change
- `SandP52WeekChange` - S&P 500 52-week change

#### Valuation & Profitability
- `marketCap` - Market capitalization
- `enterpriseValue` - Enterprise value
- `trailingEps` - EPS (trailing 12 months)
- `forwardEps` - EPS (forward estimates)
- `pegRatio` - PEG ratio
- `profitMargins` - Profit margin
- `operatingMarginTTM` - Operating margin (TTM)
- `grossMarginsTTM` - Gross margin (TTM)
- `roe` - Return on equity
- `roa` - Return on assets
- `roic` - Return on invested capital

#### Financial Health
- `currentRatio` - Current ratio
- `quickRatio` - Quick ratio
- `debtToEquity` - Debt to equity
- `totalCash` - Total cash
- `totalDebt` - Total debt
- `totalRevenue` - Total revenue (TTM)
- `revenuePerShare` - Revenue per share
- `operatingCashflow` - Operating cash flow (TTM)
- `freeCashflow` - Free cash flow (TTM)
- `ebitda` - EBITDA
- `leveredFreeCashflow` - Levered free cash flow

#### Dividends & Buybacks
- `dividendRate` - Annual dividend rate
- `dividendYield` - Dividend yield (%)
- `exDividendDate` - Ex-dividend date (unix timestamp)
- `lastDividendValue` - Last dividend amount
- `lastDividendDate` - Last dividend date
- `payoutRatio` - Payout ratio (%)

#### Trading Information
- `firstTradeDateUtc` - IPO date
- `exchange` - Stock exchange
- `exchangeTimezoneName` - Exchange timezone
- `gmtOffSetMilliseconds` - GMT offset
- `quoteType` - Quote type (EQUITY, etc.)
- `timeZoneFullName` - Full timezone name
- `currency` - Quote currency
- `regularMarketPrice` - Current price
- `regularMarketOpen` - Day open price
- `regularMarketDayHigh` - Day high price
- `regularMarketDayLow` - Day low price
- `regularMarketVolume` - Day trading volume
- `trailingThreeMonthVolume` - 3-month avg volume
- `averageVolume` - Average daily volume
- `averageVolume10days` - 10-day average volume
- `fiftyTwoWeekLow` - 52-week low price
- `fiftyTwoWeekHigh` - 52-week high price
- `fiftyDayAverage` - 50-day moving average
- `twoHundredDayAverage` - 200-day moving average

#### Risk & Growth
- `fiveYearAvgDividendYield` - 5-year avg dividend yield
- `trailingAnnualDividendRate` - TTM dividend rate
- `trailingAnnualDividendYield` - TTM dividend yield
- `yields` - Various yield metrics
- `earningsGrowth` - Earnings growth rate
- `revenueGrowth` - Revenue growth rate
- `moneyFlow` - Money flow metrics

#### Analyst Data
- `recommendationKey` - Recommendation (buy/hold/sell)
- `recommendationRating` - Recommendation rating
- `numberOfAnalystOpinions` - Count of analysts
- `targetMeanPrice` - Target mean price
- `targetMedianPrice` - Target median price
- `numberOfAnalystsRevising` - Count recently revising

---

## Price Data

### Historical Stock Prices
**File:** `prices/{TICKER}.parquet`
**yfinance Source:** `Ticker.history(start=date, end=date)`
**Type:** DataFrame (date-indexed)
**Time Range:** Last 1 year (default; configurable)

| Column | Description |
|--------|-------------|
| Date | Trading date |
| Open | Opening price |
| High | Intraday high price |
| Low | Intraday low price |
| Close | Closing price |
| Volume | Trading volume (shares traded) |
| Dividends | Dividend amount on that date (0 if none) |
| Stock Splits | Stock split ratio on that date (0 if none) |

### Usage in Formulas
Price data is accessible in ratio formulas using the `P:` prefix:
- `P: Open Price` - Opening price
- `P: High Price` - Daily high
- `P: Low Price` - Daily low
- `P: Close Price` - Closing price
- `P: Volume` - Trading volume
- `P: Dividends` - Dividend amount
- `P: Stock Splits` - Split ratio

### Historical Lookup
Formulas support date offsets using `[-D]` syntax:
- `P: Close Price [-10D]` - Closing price 10 trading days ago
- `P: High Price [-30D]` - High price 30 trading days ago
- `P: Change Percent [-10D]` - Percent change vs 10 days ago

---

## Calendar

### Earnings & Events Calendar
**File:** `fundamentals/calendar/{TICKER}.parquet`
**yfinance Source:** `Ticker.calendar`
**Type:** DataFrame (single row or multi-row)

| Field | Description |
|-------|-------------|
| Dividend Date | Next dividend payment date |
| Ex-Dividend Date | Ex-dividend date |
| Earnings Date | Upcoming earnings announcement date |
| Earnings High | High earnings estimate |
| Earnings Low | Low earnings estimate |
| Earnings Average | Average earnings estimate |
| Revenue High | High revenue estimate |
| Revenue Low | Low revenue estimate |
| Revenue Average | Average revenue estimate |

---

## News & Filings

### News Articles
**File:** `fundamentals/news/{TICKER}.parquet`
**yfinance Source:** `Ticker.news`
**Type:** DataFrame

Structure varies but typically includes:

| Field | Description |
|-------|-------------|
| title | News headline |
| link | URL to article |
| publish_date | Publication date/time |
| source | News source |
| summary | Article summary (if available) |

---

### SEC Filings
**File:** `fundamentals/sec_filings/{TICKER}.parquet`
**yfinance Source:** `Ticker.sec_filings`
**Type:** DataFrame

| Field | Description |
|-------|-------------|
| Date | Filing date |
| Type | Form type (10-K, 10-Q, 8-K, etc.) |
| Title | Filing title |
| URL | Link to SEC EDGAR |

---

## Insider Activity

### Insider Transactions
**File:** `fundamentals/insider_transactions/{TICKER}.parquet`
**yfinance Source:** `Ticker.insider_transactions`
**Type:** DataFrame (date-indexed)

| Field | Description |
|-------|-------------|
| Name | Insider name |
| Title | Position at company |
| Transaction | Type (Buy, Sale, etc.) |
| Number of Shares | Quantity transacted |
| Value | Transaction value |
| Date | Transaction date |

---

### Insider Purchases
**File:** `fundamentals/insider_purchases/{TICKER}.parquet`
**yfinance Source:** `Ticker.insider_purchases`
**Type:** DataFrame (date-indexed)

Same as insider transactions but filtered to buys only - indicates insider confidence.

---

## Ratio Formulas

### Available Formula Components

#### Basic Data References
Formulas can reference any of the financial data above using prefixes:

- **`IS: {Field}`** - Income Statement field
  - Example: `IS: Total Revenue`
  - Example: `IS: Net Income`

- **`BS: {Field}`** - Balance Sheet field
  - Example: `BS: Total Assets`
  - Example: `BS: Total Equity`

- **`CF: {Field}`** - Cash Flow field
  - Example: `CF: Operating Cash Flow`
  - Example: `CF: Capital Expenditure`

- **`P: {Field}`** - Price data field
  - Example: `P: Close Price`
  - Example: `P: Volume`

- **`RATIO: {Name}`** - Previously calculated ratio
  - Example: `RATIO: Debt To Equity`
  - Enables ratio composition and multi-level formulas

#### Date Offsets
Access historical values for any time-series field:
- `[-D]` syntax: `[-1D]`, `[-10D]`, `[-30D]`, etc.
- Example: `P: Close Price [-10D]` - Closing price 10 trading days ago
- Example: `IS: Revenue [-1Y]` - Revenue from 1 year ago

#### Operators
Standard mathematical operators:
- Addition: `+`
- Subtraction: `-`
- Multiplication: `*`
- Division: `/`
- Parentheses: `()`

#### Functions (Advanced)
- `AVERAGE()` - Calculate average
- `SUM()` - Sum values
- `GROWTH()` - Calculate growth percentage
- `CHANGE()` - Absolute change
- Examples: `AVERAGE(P: Close Price [-30D])` for 30-day moving average

### Example Formulas

```
// Simple metrics
Debt To Equity = BS: Total Debt / BS: Total Equity
Current Ratio = BS: Current Assets / BS: Current Liabilities
Quick Ratio = (BS: Current Assets - BS: Inventory) / BS: Current Liabilities

// Profitability ratios
Gross Margin = (IS: Total Revenue - IS: Cost Of Revenue) / IS: Total Revenue
Operating Margin = IS: Operating Income / IS: Total Revenue
Net Margin = IS: Net Income / IS: Total Revenue
ROE = IS: Net Income / BS: Total Equity
ROA = IS: Net Income / BS: Total Assets

// Valuation
Price To Book = P: Close Price / (BS: Total Equity / Number Of Shares)
Price To Earnings = P: Close Price / IS: Basic EPS
EV/EBITDA = (Market Cap + BS: Total Debt - BS: Cash) / IS: EBITDA

// Per-share
Earnings Per Share = IS: Net Income / IS: Basic Average Shares
Book Value Per Share = BS: Total Equity / Number Of Shares

// Cash flow
Operating Cash Flow = CF: Operating Cash Flow
Free Cash Flow = CF: Operating Cash Flow - CF: Capital Expenditure
Cash Conversion = CF: Operating Cash Flow / IS: EBITDA

// Growth & trends
YoY Revenue Growth = (IS: Total Revenue - IS: Total Revenue [-1Y]) / IS: Total Revenue [-1Y]
YoY Earnings Growth = (IS: Net Income - IS: Net Income [-1Y]) / IS: Net Income [-1Y]
30D Price Change = (P: Close Price - P: Close Price [-30D]) / P: Close Price [-30D]
```

---

## Implementation Details

### Data Fetching Flow

1. **User initiates fetch** via FinForge launcher UI
2. **Ticker validation** - Verifies ticker exists on Yahoo Finance
3. **Parallel API calls** - Fetches all available data:
   - Last 1 year of price history
   - Latest financial statements (annual & quarterly)
   - Analyst estimates and recommendations
   - Holder information
   - Company metadata
4. **Data preparation** - Converts to DataFrames, handles nulls, normalizes formats
5. **Parquet storage** - Stores each data type in dedicated folder
6. **Status updates** - Progress shown in UI

### Excel Integration

**Import process:**
1. Data stored in Parquet files
2. Import scripts read Parquet data
3. Data transformed for Excel layout
4. Formatted and inserted into Excel worksheets
5. Supports multiple tickers per sheet
6. Automatic date/INDEX handling

**Sheets:**
- Balance Sheets - Balance sheet items by date and ticker
- Income Statements - Income statement items by date and ticker
- Ratios - Calculated financial ratios
- Settings - Configuration for INDEX items and custom formulas

### Configuration Files

**ratio_config.json** - Ratio definitions
```json
{
  "ratio-name": {
    "formula": "BS: Total Assets / BS: Total Equity",
    "notes": "Description of the ratio"
  }
}
```

**tickers.json** - Tracked tickers
```json
{
  "tickers": ["AAPL", "MSFT", "GOOGL"]
}
```

---

## Best Practices

### Data Management
1. **Naming conventions** - Use standard naming (TICKER in uppercase)
2. **Update frequency** - Refresh quarterly for financial data, daily for prices
3. **Storage optimization** - Parquet format is ~90% smaller than CSV
4. **Backup strategy** - Export important analyses to Excel regularly

### Formula Development
1. **Start simple** - Build basic ratios before complex formulas
2. **Document assumptions** - Note data sources and calculation methods
3. **Validate results** - Compare against known industry standards
4. **Test edge cases** - Check handling of missing data, negative values

### Data Quality
1. **Verify sources** - Confirm data matches official company reports
2. **Check for gaps** - Newer companies may lack historical data
3. **Monitor updates** - Yahoo Finance updates occasionally; re-fetch as needed
4. **Handle missing data** - Not all companies report all metrics

---

## References

- **yfinance Library:** https://github.com/ranaroussi/yfinance
- **Yahoo Finance:** https://finance.yahoo.com
- **Parquet Format:** https://parquet.apache.org
- **SEC EDGAR:** https://www.sec.gov/cgi-bin/browse-edgar
- **Financial Statement Analysis:** Standard accounting principles (GAAP/IFRS)

---

*Document Version: 1.0*
*Last Updated: April 13, 2026*
*Data Source: Yahoo Finance via yfinance library*
