# FinForge

A comprehensive financial analysis tool that fetches stock data from Yahoo Finance, stores it efficiently, and provides an Electron-based desktop UI alongside a powerful Excel dashboard for custom ratio analysis.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)

---

## Features

- **Real-time Data Fetching** - Get stock data directly from Yahoo Finance
- **Efficient Storage** - Data stored in Parquet format for fast access
- **Electron Desktop UI** - Modern launcher and workspace with sidebar navigation
- **Excel Dashboard** - Interactive dashboard in Excel via xlwings
- **Custom Ratios** - Create your own financial ratios with a visual formula builder
- **Multi-Ticker Support** - Analyze multiple stocks simultaneously
- **Automatic Calculations** - Ratios calculated and updated automatically
- **Statement Import UI** - Choose which line items to print to Excel
- **Research Paper Search** - Search for equity research via DuckDuckGo or Whoogle
- **Company Profiles** - View detailed company metadata
- **Cash Flow Import** - Import cash flow statements alongside BS and IS
- **Template System** - Save and load Excel workbook templates
- **FinForge Add-in** - Excel ribbon add-in for launching the workspace from Excel

---

## Requirements

- Windows 10 or later
- Python 3.10 or later
- Microsoft Excel (with macros enabled)
- Node.js 18+ (for Electron, auto-installed by setup)
- Internet connection (for data fetching)

---

## Installation

### Quick Setup (Recommended)

1. **Download** this repository (Code > Download ZIP) and extract it
2. **Move** the extracted folder to a short path (recommended: `C:\FinForge`)
3. **Run** `setup.bat` by double-clicking it
4. **Wait** for the setup to complete (installs Python dependencies and Electron)
5. **Done!** Launch the app with `launch_finforge.bat`

### Uninstall

To remove FinForge setup components from this folder, run:

1. Double-click `uninstall.bat`
2. Choose what to remove (virtual environment, xlwings setup, workbook, temp files)
3. Wait for the uninstall summary

This is designed to reverse setup changes without deleting source code.

### Manual Setup

If the automatic setup doesn't work:

```powershell
# Open PowerShell in the project folder

# Create virtual environment
python -m venv .venv

# Activate it
.\.venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt

# Install xlwings Excel add-in
xlwings addin install

# Install Electron for the desktop UI
cd ElectronHome
npm install
```

---

## Usage

### Starting the Application

1. Double-click `launch_finforge.bat`
2. The FinForge launcher window opens with action buttons (Launch workbook, Open terminal, Open data folder, Open project folder, Run setup, Uninstall)
3. Click **Open terminal** to open the main workspace

### Adding Stocks

1. In the workspace window, go to the **Search** tab in the sidebar
2. Search for tickers using the search bar (e.g., `AAPL`, `MSFT`, `GOOGL`)
3. Select tickers and add them to the import list
4. Data will be fetched automatically

### Importing Financial Data to Excel

1. Select the tickers and line items you want in the **Statement Lines** tab
2. Choose balance sheet, income statement, or cash flow scope
3. Click **Import** to send data to Excel
4. The Python importers populate the workbook automatically

### Creating Custom Ratios

1. Go to the **Ratios** tab in the workspace
2. Use the formula builder with token buttons (BS:, IS:, CF:, P:, RATIO:)
3. Save ratios to the shared config
4. Assign ratios to Excel columns

### Opening the Excel Dashboard

1. Click **Open Workbook** in the launcher or workspace
2. Excel opens `FinForge.xlsm` with your data

---

## Folder Structure

```
FinForge/
+-- FinForge.xlsm              # Main Excel workbook
+-- launch_finforge.bat        # Quick launcher
+-- setup.bat                  # First-time setup
+-- uninstall.bat              # Uninstall wizard
+-- requirements.txt           # Python dependencies
+-- FINANCIAL_DISCLAIMER.md    # Legal notice
+-- LICENSE                    # MIT license
+-- README.md                  # This file
+-- data/                      # Stock data storage
|   +-- fundamentals/          # Financial statements (wide + long formats)
|   +-- holders/               # Holder information
|   +-- metadata/              # Company info (JSON)
|   +-- prices/                # Price history (Parquet)
|   +-- pending_deletions.json # Pending ticker deletions
|   +-- ratios.parquet         # Calculated ratios
|   +-- statement_settings.json # Import UI settings
|   +-- statement_catalog.json  # Available line items
|   +-- templates.json          # Workbook templates
|   +-- templates_excel/        # Saved Excel workbook templates
|   +-- tickers.json            # Ticker import list
+-- ElectronHome/              # Electron desktop UI
|   +-- main.js                # Main process
|   +-- preload.js             # IPC bridge
|   +-- src/                   # Renderer (HTML, CSS, JS)
+-- Guides/                    # Documentation
|   +-- User/                  # User guides
|   +-- Developer/             # Technical docs
+-- Internal/                  # Core modules
|   +-- launch/                # Launcher scripts
|   +-- Ratios/                # Ratio system
|   +-- Research/              # Research paper search
+-- Importing/                 # Import scripts
+-- Ticker_management/         # Ticker CRUD
+-- data_management/           # Data persistence
+-- FinForge_addin/            # Add-in VBA/Python source
|   +-- FinForge_addin.xlam    # Excel add-in with ribbon
+-- Installation/              # xlwings config scripts
+-- Temporary/                 # Diagnostics & migration tools
```

---

## Documentation

See the [Guides](Guides/README.md) folder for detailed documentation:

- [Getting Started](Guides/User/01_Getting_Started.md) - First-time setup and launch
- [Ticker Management](Guides/User/02_Ticker_Management.md) - Managing stocks
- [Importing Data](Guides/User/03_Importing_Data.md) - Import statements to Excel
- [Creating Ratios](Guides/User/04_Creating_Ratios.md) - Building custom ratios
- [Assigning Ratios](Guides/User/05_Assigning_Ratios.md) - Assign ratios to columns
- [Available Data](Guides/User/08_Available_Data_Reference.md) - All available data fields
- [Complete User Guide](Guides/User/Complete_User_Guide.md) - Full walkthrough
- [Add-in Guide](Guides/FinForge_AddIn_Guide.md) - Excel ribbon add-in architecture
- [Electron Preload Contract](Guides/ElectronHome_Preload_Contract.md) - IPC bridge API
- [Statement Import UI](Guides/ElectronHome_Statement_Import_UI.md) - Import screen docs

---

## Excel Setup

For full functionality, you need to:

1. **Enable Macros** in Excel
   - File > Options > Trust Center > Trust Center Settings
   - Macro Settings > Enable all macros

2. **Enable xlwings Add-in**
   - The setup script installs this automatically
   - If needed, run: `xlwings addin install`

3. **Unblock the workbook file in Windows**
   - Right-click `FinForge.xlsm` > **Properties** > **General** tab
   - Under **Security**, check **Unblock** ("This file came from another computer and might be blocked")
   - Click **Apply** and **OK** before launching from Excel

---

## Troubleshooting

### "Python not found"
- Install Python from [python.org](https://www.python.org/downloads/)
- Make sure to check "Add Python to PATH" during installation

### "Module not found"
- Run `setup.bat` again to reinstall dependencies
- Or manually: `pip install -r requirements.txt`

### "Electron not found"
- Run `cd ElectronHome && npm install` to install Electron
- Or run `setup.bat` which does this automatically

### "Could not install packages due to an OSError" (long path)
- Move the project to a shorter folder path like `C:\FinForge`
- Make sure the project is fully extracted before running `setup.bat` (do not run from inside a ZIP)
- Enable Windows Long Paths (Group Policy or Registry `LongPathsEnabled=1`) and retry setup

### "Macros disabled in Excel"
- Enable macros in Trust Center settings
- Click "Enable Content" when opening the workbook

### "Buttons/macros still blocked after setup"
- Right-click `FinForge.xlsm` > Properties > General
- Under Security, check **Unblock**, then click **Apply** and **OK**
- Close and reopen Excel and the workbook

### Data not loading
- Check your internet connection
- Refresh data in the workspace Import tab

---

## Financial Disclaimer

**IMPORTANT**: This software is a data analysis tool only and NOT financial advice. Please read the [Financial Disclaimer](FINANCIAL_DISCLAIMER.md) before using this tool for any investment decisions.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## Acknowledgments

- [yfinance](https://github.com/ranaroussi/yfinance) - Yahoo Finance API
- [xlwings](https://www.xlwings.org/) - Excel-Python integration
- [PySide6](https://www.qt.io/) - GUI framework
- [pandas](https://pandas.pydata.org/) - Data manipulation
