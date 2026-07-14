# Developer Guide - FinForge

Welcome to the FinForge Developer Documentation. This folder contains technical documentation for understanding and extending the FinForge financial analysis system.

## Quick Start

1. **Understanding Data Flow** → Start with [01_Yahoo_Finance_Data_Structure.md](01_Yahoo_Finance_Data_Structure.md)
2. **Understanding Architecture** → Review core modules in `Internal/` folder
3. **Extending Functionality** → Learn how to add new ratios, data sources, or features

## Available Documentation

### Data & Structure
- **[01_Yahoo_Finance_Data_Structure.md](01_Yahoo_Finance_Data_Structure.md)** - Complete guide to all Yahoo Finance data available for import
  - Financial statements (income, balance sheet, cash flow)
  - Analyst estimates and recommendations
  - Holder information
  - Price history and metadata
  - Ratio formula system
  - Implementation details

### Statement Import
- **[Cash_Flow_Import_Guide.md](Cash_Flow_Import_Guide.md)** - Cash flow statement import module documentation
  - Parquet data format (wide-to-long conversion)
  - UI integration with scope buttons and catalog
  - Line item ordering and formatting

### Data Storage Formats
- **[Balance_Sheet_Long_Format.md](Balance_Sheet_Long_Format.md)** - Long-format balance sheet storage schema and migration
- **[Income_Statement_Long_Format.md](Income_Statement_Long_Format.md)** - Long-format income statement storage schema and migration
- **[Balance_Sheet_Default_Order.md](Balance_Sheet_Default_Order.md)** - How balance sheet import determines default line item order

### Electron Desktop UI
- **[ElectronHome_Launcher_Window_Guide.md](ElectronHome_Launcher_Window_Guide.md)** - Launcher window architecture and IPC flow
- **[ElectronHome_Ratio_Maker_Guide.md](ElectronHome_Ratio_Maker_Guide.md)** - Ratio maker workspace inside ElectronHome
- **[FinForge_Electron_Home_Guide.md](FinForge_Electron_Home_Guide.md)** - Electron home application overview
- **[FinForge_Home_Launcher_Batch_Guide.md](FinForge_Home_Launcher_Batch_Guide.md)** - Batch file launcher chain
- **[FinForge_Home_Window_Guide.md](FinForge_Home_Window_Guide.md)** - PySide6 home window (legacy)

### Data Cleanup
- **[Launcher_Data_Cleanup.md](Launcher_Data_Cleanup.md)** - Ticker data deletion on launch

### Research
- **[Research_Search_Module_Guide.md](Research_Search_Module_Guide.md)** - Research paper search module (DuckDuckGo)
- **[Whoogle_Search_Setup_Guide.md](Whoogle_Search_Setup_Guide.md)** - Whoogle Google proxy setup
- **[Alternative_Research_Search_Ideas.md](Alternative_Research_Search_Ideas.md)** - Alternative research API ideas

### Repository
- **[Git_Push_Public_Repo_Report.md](Git_Push_Public_Repo_Report.md)** - Git push to public repo report

## Core Modules

### Data Management
**Location:** `data_management/stock_data_manager.py`
**Purpose:** Parquet file storage and retrieval

Key classes:
- `StockDataManager` - Main interface for data persistence

Main methods:
- `save_stock_prices(ticker, df)` - Save historical prices
- `save_fundamental_data(ticker, data_type, df)` - Save financial statements
- `save_holders_data(ticker, holder_type, df)` - Save ownership data
- `save_metadata(ticker, metadata)` - Save company info
- `get_stock_prices(ticker)` - Retrieve prices
- `get_fundamental_data(ticker, data_type)` - Retrieve statements
- `schedule_ticker_deletion(ticker)` - Mark ticker for deletion
- `process_pending_deletions()` - Execute scheduled deletions

### Data Fetching
**Location:** `Internal/ticker_management/fetch_stocks.py`
**Purpose:** Download data from Yahoo Finance and store in Parquet

Main function:
- `fetch_ticker_data(ticker, data_manager, start_date, end_date)` - Fetch all available data

Fetches:
- 1 year of daily price history
- 3-5 years of annual financial statements
- Latest 4 quarters of quarterly statements
- Analyst estimates, recommendations, price targets
- Shareholder information
- Company metadata

### Ticker Management
**Location:** `Ticker_management/ticker_manager.py`
**Purpose:** Track and manage stock ticker list

Main class:
- `TickerManager` - Handles CRUD operations for ticker list

Features:
- Add/remove tickers
- Validate ticker symbols
- Save/load from JSON
- Integration with UI launcher

### Launcher
**Location:** `Internal/launch/stock_launcher.py`
**Purpose:** Main application entry point and UI

Main class:
- `StockLauncher` - GUI for ticker management and data fetching

Features:
- Add/remove tickers from tracked list
- Fetch data for single or all tickers
- Real-time progress updates
- Company name lookup from Yahoo Finance

### Ratio System
**Location:** `Importing/ratio_maker.py`
**Purpose:** Create and manage custom financial ratios

Main classes:
- `RatioMaker` - GUI for ratio definition
- `FormulaHighlighter` - Syntax highlighting for formulas
- `AdvancedFunctionDialog` - Advanced formula builder

Features:
- Create custom ratio formulas
- Syntax highlighting with color-coded elements
- Formula validation
- Support for historical data offsets
- Export to Excel
- Advanced functions (AVERAGE, SUM, GROWTH, etc.)

### Ratio Manager
**Location:** `Importing/ratio_handeling.py` or `Internal/Ratios/ratio_manager_ui.py`
**Purpose:** Assign calculated ratios to Excel columns

Features:
- Assign ratios to specific Excel columns
- Manage ratio calculation order
- Handle dependencies between ratios
- Update Excel in real-time

### Ratio Calculator
**Location:** `Internal/Ratios/ratio_calculator.py`
**Purpose:** Execute ratio calculations on loaded data

Main class:
- `RatioCalculator` - Calculates custom ratios

Features:
- Loads Parquet data
- Evaluates formula expressions
- Handles date offsets and historical lookups
- Caches results for performance

### Import System
**Location:** `Importing/import_balance_sheets.py`, `Importing/import_income_statements.py`
**Purpose:** Transfer financial data from Parquet to Excel

Main classes:
- `BalanceSheetImporter` - Imports balance sheet data
- `IncomeStatementImporter` - Imports income statement data

Features:
- Multi-ticker column layout
- Multiple date periods per ticker
- INDEX column management
- Custom item configuration via Settings sheet
- Error highlighting for missing data
- Progress tracking

---

## Architecture Overview

### Data Flow

```
Yahoo Finance API (yfinance library)
           ↓
  fetch_stocks.py
  (fetch_ticker_data)
           ↓
  stock_data_manager.py
  (save_* methods)
           ↓
  Parquet Storage
  (data/fundamentals/, data/holders/, data/prices/, data/metadata/)
           ↓
  ┌─────────────────────────────────────────────┐
  │                                             │
  │  Parquet files can be loaded by:           │
  │  - Excel importers (import_*.py)           │
  │  - Ratio calculator (ratio_calculator.py)  │
  │  - ratio_maker.py (for formula preview)    │
  │                                             │
  └─────────────────────────────────────────────┘
           ↓
  ┌─────────────────────────────────────────────┐
  │  Excel Workbook (FinForge.xlsm)            │
  │  - Balance Sheets sheet                    │
  │  - Income Statements sheet                 │
  │  - Ratios sheet                            │
  │  - Settings sheet                          │
  └─────────────────────────────────────────────┘
```

### File Structure

```
project_root/
├── data/                          # All stored data (Parquet + JSON)
│   ├── fundamentals/              # Financial statements & analyst data
│   ├── holders/                   # Ownership information
│   ├── prices/                    # Historical price data
│   ├── metadata/                  # Company information (JSON)
│   ├── tickers.json              # Tracked ticker list
│   └── pending_deletions.json     # Deletion scheduling
│
├── Importing/                     # Excel data import scripts
│   ├── ratio_maker.py            # Ratio creation UI
│   ├── import_balance_sheets.py   # Import balance sheets
│   ├── import_income_statements.py # Import income statements
│   ├── ratio_config.json          # Ratio definitions
│   └── ratio_results.csv          # Recent calculation results
│
├── Internal/                      # Core application modules
│   ├── launch/                    # Launcher UI
│   │   └── stock_launcher.py
│   ├── ticker_management/         # Ticker operations
│   │   └── fetch_stocks.py
│   ├── Ratios/                    # Ratio calculation
│   │   ├── ratio_calculator.py
│   │   └── ratio_manager_ui.py
│   └── cheking_and_structure/     # Excel structure utilities
│       └── create_sheet.py
│
├── data_management/               # Data persistence layer
│   └── stock_data_manager.py     # Parquet I/O
│
├── Ticker_management/             # Ticker list management
│   ├── ticker_manager.py
│   └── tickers.json
│
├── Guides/                        # Documentation
│   ├── Developer/                 # Developer documentation (this folder)
│   └── User/                      # User guides
│
└── FinForge.xlsm                 # Main Excel workbook
```

---

## Key Concepts

### Parquet Storage
- **Format:** Apache Parquet (binary, highly compressed)
- **Advantages:** 90% smaller than CSV, faster to read, maintains data types
- **Location:** `data/` folder, organized by data type and ticker
- **Access:** Via `StockDataManager` class

### Financial Statement Fields
- **Income Statement** - Revenue, expenses, profitability
- **Balance Sheet** - Assets, liabilities, equity
- **Cash Flow** - Operating, investing, financing activities
- Quarterly versions for most recent 4 quarters
- Multiple years of annual history (typically 3-5 years)

### Ratio Formulas
- Text-based formulas with color-coded syntax highlighting
- Support for financial fields (IS:, BS:, CF:), prices (P:), and existing ratios (RATIO:)
- Historical lookups with `[-D]` notation (days ago)
- Mathematical operators and advanced functions
- Compiled to Python expressions for calculation

### Excel Integration
- **Workbook:** FinForge.xlsm (persistent user file)
- **Sheets:** Balance Sheets, Income Statements, Ratios, Settings
- **Data import:** Via Python scripts using xlwings library
- **Two-way communication:** Can read current sheet layout, write data and formulas

---

## Common Development Tasks

### Adding a New Ticker

1. **Via UI (easiest):**
   - Launch FinForge.xlsm
   - Open Stock Launcher
   - Enter ticker symbol
   - Click "Fetch Data"

2. **Programmatically:**
   ```python
   from Ticker_management.ticker_manager import TickerManager
   from data_management.stock_data_manager import StockDataManager
   from Internal.ticker_management.fetch_stocks import fetch_ticker_data
   from datetime import datetime, timedelta
   
   # Add to ticker list
   tm = TickerManager()
   tm.add_ticker("NEWticker")
   
   # Fetch data
   data_manager = StockDataManager("data")
   start_date = datetime.now() - timedelta(days=365)
   end_date = datetime.now()
   fetch_ticker_data("NEWICKER", data_manager, start_date, end_date)
   ```

### Creating a New Ratio

1. **Via Ratio Maker UI:**
   - Open `Importing/ratio_maker.py`
   - Click "New Ratio"
   - Enter name and formula
   - Click "Save"

2. **Adding programmatically:**
   Edit `Importing/ratio_config.json`:
   ```json
   {
     "My Ratio": {
       "formula": "BS: Total Assets / BS: Total Equity",
       "notes": "Measure of financial leverage"
     }
   }
   ```

### Accessing Parquet Data

```python
from data_management.stock_data_manager import StockDataManager
import pandas as pd

dm = StockDataManager("data")

# Get balance sheet
bs = dm.get_fundamental_data("AAPL", "balance_sheet")
print(bs.head())

# Get price history
prices = dm.get_stock_prices("AAPL")
print(prices.tail(10))

# Get company info
metadata = dm.load_metadata("AAPL")
print(f"Market Cap: {metadata.get('marketCap')}")
```

### Calculating a Ratio

```python
from Internal.Ratios.ratio_calculator import RatioCalculator

# Initialize calculator (loads all Parquet data)
rc = RatioCalculator()

# Calculate a specific ratio
result = rc.calculate_ratio(
    name="My Ratio",
    formula="BS: Total Assets / BS: Total Equity",
    ticker="AAPL"
)
print(result)
```

---

## Dependencies

Core libraries:
- **yfinance** - Yahoo Finance API
- **pandas** - Data manipulation and analysis
- **xlwings** - Excel-Python integration
- **PySide6** - GUI framework (Qt)
- **pyarrow/fastparquet** - Parquet file I/O

Python version: 3.8+

---

## Testing & Quality

### Unit Tests
Location: `Temporary/` (if test files exist)

Run tests:
```bash
python -m pytest tests/ -v
```

### Code Quality
Follow PEP 8 conventions. Key points:
- Use descriptive variable names
- Add docstrings to all functions/classes
- Keep functions focused (single responsibility)
- Handle exceptions gracefully

### Data Validation
- Verify Parquet data loads without errors
- Check for NaN/missing values
- Validate ticker symbols against Yahoo Finance
- Test ratio formulas with sample data

---

## Troubleshooting

### Common Issues

**Parquet file not found:**
- Ensure ticker has been fetched with `fetch_ticker_data()`
- Check file permissions on `data/` folder
- Verify data type folder exists (e.g., `fundamentals/income_statement/`)

**Excel import fails:**
- Ensure FinForge.xlsm is open and active
- Check that ticker is in row 4 of the sheet
- Verify Parquet files contain the expected data

**Ratio calculation error:**
- Check formula syntax in ratio_config.json
- Ensure referenced fields exist in Parquet files
- Verify that dependent ratios are defined first

**Yahoo Finance API rate limits:**
- Add delays between requests
- Use batched ticker operations
- Cache results in Parquet to minimize API calls

---

## Contributing

When adding new features:
1. Store code in appropriate module (Internal/, Importing/, etc.)
2. Add corresponding guide documentation in Guides/Developer/
3. Update this README if structure changes
4. Test with multiple tickers
5. Handle edge cases (missing data, invalid inputs, etc.)

---

*Last Updated: April 13, 2026*
