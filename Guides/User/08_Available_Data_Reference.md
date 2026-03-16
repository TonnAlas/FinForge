# Available Data Reference

This document lists all data fetched from Yahoo Finance and stored in Parquet format.

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

## 1. Financial Statements (Annual)

### Income Statement
**File:** `fundamentals/income_statement/{TICKER}.parquet`

| Field | Description |
|-------|-------------|
| Total Revenue | Total revenue from all sources |
| Operating Revenue | Revenue from core operations |
| Cost Of Revenue | Direct costs of goods/services sold |
| Gross Profit | Revenue minus cost of revenue |
| Operating Expense | Operating costs (R&D, SG&A, etc.) |
| Research And Development | R&D spending |
| Selling General And Administration | SG&A expenses |
| Selling And Marketing Expense | Marketing costs |
| General And Administrative Expense | Admin costs |
| Other Gand A | Other general & admin expenses |
| Operating Income | Profit from core operations |
| Net Non Operating Interest Income Expense | Non-operating interest |
| Interest Income Non Operating | Interest earned |
| Interest Expense Non Operating | Interest paid |
| Other Non Operating Income Expenses | Other non-operating items |
| Special Income Charges | One-time charges |
| Write Off | Asset write-offs |
| Gain On Sale Of Security | Gains from selling securities |
| Other Income Expense | Other income/expense items |
| Pretax Income | Income before taxes |
| Tax Provision | Income tax expense |
| Net Income Continuous Operations | Net income from continuing ops |
| Net Income Including Noncontrolling Interests | Total net income |
| Net Income | Net income attributable to company |
| Net Income Common Stockholders | Net income for common shareholders |
| Diluted NI Availto Com Stockholders | Diluted net income |
| Basic EPS | Earnings per share (basic) |
| Diluted EPS | Earnings per share (diluted) |
| Basic Average Shares | Average shares (basic) |
| Diluted Average Shares | Average shares (diluted) |
| Total Operating Income As Reported | Reported operating income |
| Total Expenses | Total expenses |
| Net Income From Continuing And Discontinued Operation | Combined net income |
| Normalized Income | Adjusted net income |
| Interest Income | Total interest income |
| Interest Expense | Total interest expense |
| Net Interest Income | Net interest income |
| EBIT | Earnings before interest & taxes |
| EBITDA | Earnings before interest, taxes, depreciation & amortization |
| Reconciled Cost Of Revenue | Adjusted cost of revenue |
| Reconciled Depreciation | Adjusted depreciation |
| Net Income From Continuing Operation Net Minority Interest | Net income excluding minority interest |
| Total Unusual Items Excluding Goodwill | Unusual items (excl. goodwill) |
| Total Unusual Items | All unusual items |
| Normalized EBITDA | Adjusted EBITDA |
| Tax Rate For Calcs | Effective tax rate |
| Tax Effect Of Unusual Items | Tax impact of unusual items |

---

### Balance Sheet
**File:** `fundamentals/balance_sheet/{TICKER}.parquet`

| Field | Description |
|-------|-------------|
| **ASSETS** | |
| Total Assets | Sum of all assets |
| Current Assets | Assets convertible to cash within 1 year |
| Cash Cash Equivalents And Short Term Investments | Liquid assets |
| Cash And Cash Equivalents | Cash on hand |
| Cash Financial | Cash position |
| Cash Equivalents | Near-cash instruments |
| Other Short Term Investments | Short-term investment securities |
| Receivables | Money owed to company |
| Accounts Receivable | Customer receivables |
| Gross Accounts Receivable | Total receivables before allowances |
| Allowance For Doubtful Accounts Receivable | Bad debt reserve |
| Inventory | Goods held for sale |
| Raw Materials | Unprocessed inventory |
| Work In Process | Partially completed goods |
| Finished Goods | Completed inventory |
| Hedging Assets Current | Current hedging instruments |
| Other Current Assets | Other short-term assets |
| Total Non Current Assets | Long-term assets |
| Net PPE | Property, plant & equipment (net) |
| Gross PPE | Property, plant & equipment (gross) |
| Accumulated Depreciation | Total depreciation to date |
| Land And Improvements | Land assets |
| Buildings And Improvements | Building assets |
| Machinery Furniture Equipment | Equipment assets |
| Leases | Lease assets |
| Other Properties | Other property assets |
| Properties | Total property |
| Goodwill And Other Intangible Assets | Intangible assets |
| Goodwill | Goodwill from acquisitions |
| Other Intangible Assets | Patents, trademarks, etc. |
| Investments And Advances | Investment holdings |
| Investmentin Financial Assets | Financial investments |
| Available For Sale Securities | Securities available for sale |
| Long Term Equity Investment | Long-term equity stakes |
| Financial Assets | Total financial assets |
| Other Non Current Assets | Other long-term assets |
| **LIABILITIES** | |
| Total Liabilities Net Minority Interest | All liabilities |
| Current Liabilities | Debts due within 1 year |
| Payables And Accrued Expenses | Current payables |
| Payables | Money owed to suppliers |
| Accounts Payable | Supplier payables |
| Total Tax Payable | Taxes owed |
| Income Tax Payable | Income taxes due |
| Pensionand Other Post Retirement Benefit Plans Current | Current pension obligations |
| Current Debt And Capital Lease Obligation | Short-term debt |
| Current Debt | Short-term borrowings |
| Commercial Paper | Short-term commercial paper |
| Other Current Borrowings | Other short-term loans |
| Current Deferred Liabilities | Current deferred items |
| Current Deferred Revenue | Prepaid customer payments |
| Other Current Liabilities | Other short-term liabilities |
| Total Non Current Liabilities Net Minority Interest | Long-term liabilities |
| Long Term Debt And Capital Lease Obligation | Long-term debt |
| Long Term Debt | Long-term borrowings |
| Long Term Capital Lease Obligation | Long-term leases |
| Non Current Deferred Liabilities | Long-term deferred items |
| Non Current Deferred Revenue | Long-term prepayments |
| Non Current Deferred Taxes Liabilities | Deferred tax liabilities |
| Tradeand Other Payables Non Current | Long-term payables |
| Other Non Current Liabilities | Other long-term liabilities |
| **EQUITY** | |
| Total Equity Gross Minority Interest | Total equity |
| Stockholders Equity | Shareholder equity |
| Common Stock Equity | Common stockholder equity |
| Capital Stock | Total capital stock |
| Common Stock | Common shares value |
| Retained Earnings | Accumulated profits |
| Gains Losses Not Affecting Retained Earnings | Other comprehensive income |
| Other Equity Adjustments | Other equity items |
| Total Capitalization | Total capital |
| **CALCULATED METRICS** | |
| Net Debt | Total debt minus cash |
| Total Debt | Sum of all debt |
| Working Capital | Current assets minus current liabilities |
| Invested Capital | Equity plus debt |
| Tangible Book Value | Book value minus intangibles |
| Net Tangible Assets | Tangible assets minus liabilities |
| Capital Lease Obligations | Total lease obligations |
| Ordinary Shares Number | Number of common shares |
| Share Issued | Total shares issued |

---

### Cash Flow Statement
**File:** `fundamentals/cash_flow/{TICKER}.parquet`

| Field | Description |
|-------|-------------|
| **OPERATING ACTIVITIES** | |
| Operating Cash Flow | Cash from operations |
| Cash Flow From Continuing Operating Activities | Operating cash (continuing) |
| Net Income From Continuing Operations | Starting net income |
| Depreciation Amortization Depletion | Non-cash depreciation |
| Depreciation And Amortization | D&A expense |
| Depreciation | Depreciation only |
| Deferred Tax | Deferred tax adjustments |
| Deferred Income Tax | Deferred income tax |
| Stock Based Compensation | Stock-based comp expense |
| Asset Impairment Charge | Impairment charges |
| Unrealized Gain Loss On Investment Securities | Unrealized investment changes |
| Operating Gains Losses | Operating gains/losses |
| Gain Loss On Investment Securities | Investment gains/losses |
| Change In Working Capital | Working capital changes |
| Change In Receivables | Receivables change |
| Changes In Account Receivables | A/R change |
| Change In Inventory | Inventory change |
| Change In Payables And Accrued Expense | Payables change |
| Change In Payable | Payables change |
| Change In Account Payable | A/P change |
| Change In Tax Payable | Tax payable change |
| Change In Income Tax Payable | Income tax payable change |
| Change In Other Current Assets | Other current asset changes |
| Change In Other Current Liabilities | Other current liability changes |
| Change In Other Working Capital | Other working capital changes |
| **INVESTING ACTIVITIES** | |
| Investing Cash Flow | Cash used in investing |
| Cash Flow From Continuing Investing Activities | Investing cash (continuing) |
| Capital Expenditure | CapEx spending |
| Purchase Of PPE | Property purchases |
| Net PPE Purchase And Sale | Net property transactions |
| Purchase Of Investment | Investment purchases |
| Sale Of Investment | Investment sales |
| Net Investment Purchase And Sale | Net investment transactions |
| Purchase Of Business | Business acquisitions |
| Net Business Purchase And Sale | Net business transactions |
| Net Other Investing Changes | Other investing items |
| **FINANCING ACTIVITIES** | |
| Financing Cash Flow | Cash from financing |
| Cash Flow From Continuing Financing Activities | Financing cash (continuing) |
| Issuance Of Debt | New debt raised |
| Long Term Debt Issuance | Long-term borrowings |
| Short Term Debt Issuance | Short-term borrowings |
| Repayment Of Debt | Debt repayments |
| Long Term Debt Payments | Long-term debt repaid |
| Net Issuance Payments Of Debt | Net debt change |
| Net Long Term Debt Issuance | Net long-term debt |
| Net Short Term Debt Issuance | Net short-term debt |
| Issuance Of Capital Stock | New shares issued |
| Common Stock Issuance | Common stock issued |
| Repurchase Of Capital Stock | Stock buybacks |
| Common Stock Payments | Stock repurchases |
| Net Common Stock Issuance | Net share issuance |
| Cash Dividends Paid | Dividend payments |
| Common Stock Dividend Paid | Common dividends |
| Net Other Financing Charges | Other financing items |
| **SUMMARY** | |
| Changes In Cash | Total cash change |
| Effect Of Exchange Rate Changes | FX impact on cash |
| Beginning Cash Position | Starting cash |
| End Cash Position | Ending cash |
| Free Cash Flow | Operating cash minus CapEx |

---

## 2. Financial Statements (Quarterly)

Same fields as annual statements:
- `fundamentals/quarterly_income_statement/{TICKER}.parquet`
- `fundamentals/quarterly_balance_sheet/{TICKER}.parquet`
- `fundamentals/quarterly_cash_flow/{TICKER}.parquet`

---

## 3. Analyst Estimates

### Earnings Estimate
**File:** `fundamentals/earnings_estimate/{TICKER}.parquet`

| Column | Description |
|--------|-------------|
| avg | Average EPS estimate |
| low | Low EPS estimate |
| high | High EPS estimate |
| yearAgoEps | EPS from same period last year |
| numberOfAnalysts | Number of analysts |
| growth | Expected growth rate |

**Periods:** 0q (current quarter), +1q (next quarter), 0y (current year), +1y (next year)

---

### Revenue Estimate
**File:** `fundamentals/revenue_estimate/{TICKER}.parquet`

| Column | Description |
|--------|-------------|
| avg | Average revenue estimate |
| low | Low revenue estimate |
| high | High revenue estimate |
| numberOfAnalysts | Number of analysts |
| yearAgoRevenue | Revenue from same period last year |
| growth | Expected growth rate |

---

### Analyst Price Targets
**File:** `fundamentals/analyst_price_targets/{TICKER}.parquet`

| Field | Description |
|-------|-------------|
| current | Current stock price |
| high | Highest analyst target |
| low | Lowest analyst target |
| mean | Average target price |
| median | Median target price |

---

### EPS Trend
**File:** `fundamentals/eps_trend/{TICKER}.parquet`

| Column | Description |
|--------|-------------|
| current | Current EPS estimate |
| 7daysAgo | Estimate 7 days ago |
| 30daysAgo | Estimate 30 days ago |
| 60daysAgo | Estimate 60 days ago |
| 90daysAgo | Estimate 90 days ago |

---

### Growth Estimates
**File:** `fundamentals/growth_estimates/{TICKER}.parquet`

| Column | Description |
|--------|-------------|
| stockTrend | Stock growth trend |
| indexTrend | Index comparison trend |

**Periods:** 0q, +1q, 0y, +1y, LTG (long-term growth)

---

### Earnings History
**File:** `fundamentals/earnings_history/{TICKER}.parquet`

| Column | Description |
|--------|-------------|
| epsActual | Actual reported EPS |
| epsEstimate | Expected EPS |
| epsDifference | Actual minus estimate |
| surprisePercent | Surprise as percentage |

---

## 4. Analyst Recommendations

### Recommendations
**File:** `fundamentals/recommendations/{TICKER}.parquet`

| Column | Description |
|--------|-------------|
| period | Time period |
| strongBuy | Number of strong buy ratings |
| buy | Number of buy ratings |
| hold | Number of hold ratings |
| sell | Number of sell ratings |
| strongSell | Number of strong sell ratings |

---

### Recommendations Summary
**File:** `fundamentals/recommendations_summary/{TICKER}.parquet`

Same structure as recommendations, but summarized.

---

### Upgrades/Downgrades
**File:** `fundamentals/upgrades_downgrades/{TICKER}.parquet`

| Column | Description |
|--------|-------------|
| Firm | Analyst firm name |
| ToGrade | New rating |
| FromGrade | Previous rating |
| Action | Action taken (upgrade/downgrade) |
| priceTargetAction | Price target action |
| currentPriceTarget | New price target |
| priorPriceTarget | Previous price target |

---

## 5. Holder Data

### Major Holders
**File:** `holders/major_holders/{TICKER}.parquet`

| Metric | Description |
|--------|-------------|
| insidersPercentHeld | Percentage held by insiders |
| institutionsPercentHeld | Percentage held by institutions |
| institutionsFloatPercentHeld | Institutional % of float |
| institutionsCount | Number of institutional holders |

---

### Institutional Holders
**File:** `holders/institutional_holders/{TICKER}.parquet`

| Column | Description |
|--------|-------------|
| Date Reported | Reporting date |
| Holder | Institution name |
| pctHeld | Percentage of shares held |
| Shares | Number of shares |
| Value | Dollar value of position |
| pctChange | Change from previous report |

---

### Mutual Fund Holders
**File:** `holders/mutualfund_holders/{TICKER}.parquet`

Same structure as institutional holders.

---

### Insider Roster
**File:** `holders/insider_roster_holders/{TICKER}.parquet`

| Column | Description |
|--------|-------------|
| Name | Insider name |
| Position | Title/role |
| URL | Profile link |
| Most Recent Transaction | Last transaction type |
| Latest Transaction Date | Date of last transaction |
| Shares Owned Directly | Direct ownership |
| Position Direct Date | Date of position |

---

## 6. Insider Activity

### Insider Transactions
**File:** `fundamentals/insider_transactions/{TICKER}.parquet`

| Column | Description |
|--------|-------------|
| Shares | Number of shares |
| Value | Transaction value |
| URL | Filing link |
| Text | Transaction description |
| Insider | Insider name |
| Position | Title/role |
| Transaction | Transaction type |
| Start Date | Transaction date |
| Ownership | Ownership type |

---

### Insider Purchases Summary
**File:** `fundamentals/insider_purchases/{TICKER}.parquet`

| Metric | Description |
|--------|-------------|
| Purchases | Total shares purchased (6 months) |
| Sales | Total shares sold (6 months) |
| Net Shares Purchased (Sold) | Net insider activity |
| Total Insider Shares Held | Total insider ownership |
| % Net Shares Purchased (Sold) | Net as % of holdings |
| % Buy Shares | Buy % of total |
| % Sell Shares | Sell % of total |

---

## 7. Historical Data

### Dividends
**File:** `fundamentals/dividends/{TICKER}.parquet`

Historical dividend payments with dates and amounts.

---

### Stock Splits
**File:** `fundamentals/splits/{TICKER}.parquet`

Historical stock split events with dates and ratios.

---

### Actions (Combined)
**File:** `fundamentals/actions/{TICKER}.parquet`

Combined dividends and splits history.

---

## 8. Calendar

**File:** `fundamentals/calendar/{TICKER}.parquet`

| Field | Description |
|-------|-------------|
| Dividend Date | Next dividend payment date |
| Ex-Dividend Date | Ex-dividend date |
| Earnings Date | Next earnings announcement |
| Earnings High | High earnings estimate |
| Earnings Low | Low earnings estimate |
| Earnings Average | Average earnings estimate |
| Revenue High | High revenue estimate |
| Revenue Low | Low revenue estimate |
| Revenue Average | Average revenue estimate |

---

## 9. News & Filings

### News
**File:** `fundamentals/news/{TICKER}.parquet`

Recent news articles about the company (structure varies).

---

### SEC Filings
**File:** `fundamentals/sec_filings/{TICKER}.parquet`

Recent SEC filing links and metadata.

---

## 10. Price Data

**File:** `prices/{TICKER}.parquet`

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

## 11. Metadata (Company Info)

**File:** `metadata/{TICKER}.json`

### Identification
| Field | Description |
|-------|-------------|
| symbol | Ticker symbol |
| shortName | Short company name |
| longName | Full company name |
| displayName | Display name |

### Business Info
| Field | Description |
|-------|-------------|
| sector | Business sector |
| sectorKey | Sector identifier |
| sectorDisp | Sector display name |
| industry | Industry classification |
| industryKey | Industry identifier |
| industryDisp | Industry display name |
| longBusinessSummary | Company description |
| fullTimeEmployees | Number of employees |
| website | Company website |
| irWebsite | Investor relations site |

### Location
| Field | Description |
|-------|-------------|
| address1 | Street address |
| city | City |
| state | State/province |
| zip | Postal code |
| country | Country |
| phone | Phone number |

### Exchange Info
| Field | Description |
|-------|-------------|
| exchange | Exchange code |
| fullExchangeName | Exchange name |
| quoteType | Security type |
| market | Market identifier |
| currency | Trading currency |
| financialCurrency | Reporting currency |

### Current Trading
| Field | Description |
|-------|-------------|
| currentPrice | Current price |
| regularMarketPrice | Regular session price |
| regularMarketOpen | Session open |
| regularMarketDayHigh | Session high |
| regularMarketDayLow | Session low |
| regularMarketVolume | Session volume |
| regularMarketChange | Price change |
| regularMarketChangePercent | % change |
| previousClose | Prior close |
| bid | Current bid |
| ask | Current ask |
| bidSize | Bid size |
| askSize | Ask size |
| volume | Volume |
| averageVolume | Average volume |
| averageVolume10days | 10-day avg volume |
| averageDailyVolume10Day | 10-day avg daily volume |
| averageDailyVolume3Month | 3-month avg daily volume |

### Price Metrics
| Field | Description |
|-------|-------------|
| fiftyTwoWeekHigh | 52-week high |
| fiftyTwoWeekLow | 52-week low |
| fiftyTwoWeekRange | 52-week range |
| fiftyTwoWeekHighChange | Change from 52w high |
| fiftyTwoWeekHighChangePercent | % from 52w high |
| fiftyTwoWeekLowChange | Change from 52w low |
| fiftyTwoWeekLowChangePercent | % from 52w low |
| fiftyTwoWeekChangePercent | 52-week % change |
| 52WeekChange | 52-week change |
| allTimeHigh | All-time high |
| allTimeLow | All-time low |
| fiftyDayAverage | 50-day moving average |
| fiftyDayAverageChange | Change from 50-day MA |
| fiftyDayAverageChangePercent | % from 50-day MA |
| twoHundredDayAverage | 200-day moving average |
| twoHundredDayAverageChange | Change from 200-day MA |
| twoHundredDayAverageChangePercent | % from 200-day MA |

### Valuation Ratios
| Field | Description |
|-------|-------------|
| marketCap | Market capitalization |
| enterpriseValue | Enterprise value |
| trailingPE | P/E ratio (TTM) |
| forwardPE | Forward P/E ratio |
| priceToBook | Price-to-book ratio |
| priceToSalesTrailing12Months | Price-to-sales (TTM) |
| priceEpsCurrentYear | P/E current year |
| enterpriseToRevenue | EV/Revenue |
| enterpriseToEbitda | EV/EBITDA |
| trailingPegRatio | PEG ratio |

### Earnings & Profitability
| Field | Description |
|-------|-------------|
| trailingEps | EPS (TTM) |
| forwardEps | Forward EPS |
| epsTrailingTwelveMonths | EPS TTM |
| epsCurrentYear | Current year EPS |
| earningsQuarterlyGrowth | Quarterly earnings growth |
| earningsGrowth | Earnings growth rate |
| revenueGrowth | Revenue growth rate |
| grossMargins | Gross margin |
| operatingMargins | Operating margin |
| profitMargins | Profit margin |
| ebitdaMargins | EBITDA margin |

### Financial Health
| Field | Description |
|-------|-------------|
| totalRevenue | Total revenue |
| grossProfits | Gross profits |
| ebitda | EBITDA |
| netIncomeToCommon | Net income |
| freeCashflow | Free cash flow |
| operatingCashflow | Operating cash flow |
| totalCash | Total cash |
| totalCashPerShare | Cash per share |
| totalDebt | Total debt |
| debtToEquity | Debt-to-equity ratio |
| currentRatio | Current ratio |
| quickRatio | Quick ratio |
| bookValue | Book value per share |
| returnOnAssets | Return on assets |
| returnOnEquity | Return on equity |
| revenuePerShare | Revenue per share |

### Shares & Ownership
| Field | Description |
|-------|-------------|
| sharesOutstanding | Shares outstanding |
| floatShares | Public float |
| impliedSharesOutstanding | Implied shares |
| heldPercentInsiders | Insider ownership % |
| heldPercentInstitutions | Institutional ownership % |
| sharesShort | Shares sold short |
| sharesShortPriorMonth | Prior month short interest |
| sharesShortPreviousMonthDate | Prior short date |
| shortRatio | Short ratio |
| shortPercentOfFloat | Short % of float |
| sharesPercentSharesOut | Short % of shares |
| dateShortInterest | Short interest date |

### Dividends
| Field | Description |
|-------|-------------|
| dividendRate | Annual dividend rate |
| dividendYield | Dividend yield |
| exDividendDate | Ex-dividend date |
| dividendDate | Payment date |
| lastDividendDate | Last dividend date |
| lastDividendValue | Last dividend amount |
| trailingAnnualDividendRate | TTM dividend rate |
| trailingAnnualDividendYield | TTM dividend yield |
| fiveYearAvgDividendYield | 5-year avg yield |
| payoutRatio | Dividend payout ratio |

### Analyst Ratings
| Field | Description |
|-------|-------------|
| recommendationKey | Rating (buy/hold/sell) |
| recommendationMean | Mean rating score |
| averageAnalystRating | Average rating text |
| numberOfAnalystOpinions | Number of analysts |
| targetHighPrice | High price target |
| targetLowPrice | Low price target |
| targetMeanPrice | Mean price target |
| targetMedianPrice | Median price target |

### Risk Metrics
| Field | Description |
|-------|-------------|
| beta | Beta coefficient |
| overallRisk | Overall risk score |
| auditRisk | Audit risk score |
| boardRisk | Board risk score |
| compensationRisk | Compensation risk score |
| shareHolderRightsRisk | Shareholder rights risk |

### Other
| Field | Description |
|-------|-------------|
| SandP52WeekChange | S&P 52-week change |
| lastSplitDate | Last stock split date |
| lastSplitFactor | Last split ratio |
| mostRecentQuarter | Most recent quarter end |
| lastFiscalYearEnd | Last fiscal year end |
| nextFiscalYearEnd | Next fiscal year end |
| governanceEpochDate | Governance data date |
| companyOfficers | List of executives |
| executiveTeam | Executive team info |

---

## Using This Data

### In Ratio Formulas

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

*Document generated: December 2025*
*Data source: Yahoo Finance via yfinance library*
