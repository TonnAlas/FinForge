# FinForge

A comprehensive financial analysis tool that fetches stock data from Yahoo Finance, stores it efficiently, and provides a powerful Excel-based dashboard for custom ratio analysis.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)

---

## Features

- **Real-time Data Fetching** - Get stock data directly from Yahoo Finance
- **Efficient Storage** - Data stored in Parquet format for fast access
- **Excel Dashboard** - Beautiful, interactive dashboard in Excel
- **Custom Ratios** - Create your own financial ratios with a visual formula builder
- **Multi-Ticker Support** - Analyze multiple stocks simultaneously
- **Automatic Calculations** - Ratios calculated and updated automatically

---

## Requirements

- Windows 10 or later
- Python 3.10 or later
- Microsoft Excel (with macros enabled)
- Internet connection (for data fetching)

---

## Installation

### Quick Setup (Recommended)

1. **Download** this repository (Code > Download ZIP) and extract it
2. **Move** the extracted folder to a short path (recommended: `C:\FinForge`)
3. **Run** `setup.bat` by double-clicking it
4. **Wait** for the setup to complete (installs all dependencies)
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

# Install dependencies
pip install -r requirements.txt

# Install xlwings Excel add-in
xlwings addin install
```

---

## Usage

### Starting the Application

1. Double-click `launch_finforge.bat`
2. The FinForge window will open

### Adding Stocks

1. Type a ticker symbol (e.g., `AAPL`, `MSFT`, `GOOGL`)
2. Click **Add** or press Enter
3. Data will be fetched automatically

### Opening the Dashboard

1. Select the stocks you want to analyze
2. Click **Launch Dashboard**
3. Excel will open with your stocks loaded

### Creating Custom Ratios

1. In Excel, click the **Ratio Manager** button
2. Use the visual formula builder to create ratios
3. Assign ratios to columns in your dashboard

---

## Folder Structure

```
FinForge/
+-- FinForge.xlsm          # Main Excel workbook
+-- launch_finforge.bat    # Quick launcher
+-- setup.bat              # First-time setup
+-- uninstall.bat          # Uninstall wizard
+-- requirements.txt       # Python dependencies
+-- data/                  # Stock data storage
|   +-- fundamentals/      # Financial statements
|   +-- holders/           # Holder information
|   +-- metadata/          # Company info
|   +-- prices/            # Price history
+-- Guides/                # Documentation
|   +-- User/              # User guides
+-- Internal/              # Core modules
+-- Importing/             # Import scripts
```

---

## Documentation

See the [Guides](Guides/README.md) folder for detailed documentation:

- [Getting Started](Guides/User/01_Getting_Started.md) - First-time setup
- [Ticker Management](Guides/User/02_Ticker_Management.md) - Managing stocks
- [Creating Ratios](Guides/User/04_Creating_Ratios.md) - Building custom ratios
- [Available Data](Guides/User/08_Available_Data_Reference.md) - All available data fields

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
- Try refreshing the data in the launcher

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
