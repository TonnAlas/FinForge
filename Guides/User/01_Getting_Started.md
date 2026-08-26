# Getting Started

Welcome to FinForge! This guide will help you get up and running quickly.

---

## What is FinForge?

FinForge is a financial analysis tool that:
- Fetches real-time stock data from Yahoo Finance
- Stores data efficiently in Parquet format
- Imports financial statements into Excel
- Lets you create custom financial ratios
- Calculates and displays ratios for multiple tickers

---

## Quick Start

### Step 1: Run First-Time Setup

1. Double-click `setup.bat` in the main folder
2. Wait for the setup to install the Python virtual environment and dependencies
3. Enable Excel Macros so the workbook can run its automation:
   - Open Excel, go to **File > Options > Trust Center > Trust Center Settings**
   - Click **Macro Settings** and select **Enable all macros**
   - Check **Trust access to the VBA project object model**, then click OK and restart Excel

### Step 2: Launch the Application

1. Double-click `launch_finforge.bat` in the main folder
2. The FinForge launcher window will open

### Step 3: Open the Workspace

1. In the launcher, click **Open terminal** (the main workspace window)
2. The workspace window opens with sidebar navigation (Imports, Ratios, Company Profile, Research)

### Step 4: Add Your First Ticker

1. Go to the **Search** tab and find a ticker symbol (e.g., `AAPL`)
2. Select the ticker and add it to the import list
3. Data fetching starts automatically in the background

### Step 5: Import Financial Data to Excel

1. In the Imports tab, choose **Balance sheet** or **Income statement** scope
2. Select the line items you want to print
3. Click **Import** to send data to Excel

---

## System Requirements

- Windows 10 or later
- Microsoft Excel (with macros enabled)
- Python 3.10+ (included in .venv)
- Node.js 18+ (for Electron, auto-installed by setup)
- Internet connection (for data fetching)

---

## Folder Structure

```
FinForge/
+-- FinForge.xlsm           <- Main Excel workbook
+-- launch_finforge.bat     <- Quick launcher
+-- setup.bat               <- First-time setup
+-- data/                   <- All fetched data stored here
|   +-- fundamentals/       <- Financial statements
|   +-- holders/            <- Holder information
|   +-- metadata/           <- Company info
|   +-- prices/             <- Price history
+-- ElectronHome/           <- Electron desktop UI
+-- Guides/                 <- Documentation (you are here)
|   +-- User/               <- User guides
|   +-- Developer/          <- Technical docs
+-- Importing/              <- Import scripts
+-- Internal/               <- Core modules
+-- Ticker_management/      <- Ticker CRUD
+-- data_management/        <- Data persistence
```

---

## Next Steps

- [Ticker Management](02_Ticker_Management.md) - Add and manage stock tickers
- [Importing Data](03_Importing_Data.md) - Import financial statements to Excel
- [Creating Ratios](04_Creating_Ratios.md) - Build custom financial ratios
- [Assigning Ratios](05_Assigning_Ratios.md) - Display ratios in Excel

---

## Need Help?

- Check the other guides in this folder
- Review `Available_Data_Reference.md` for all available data fields
- Check `Color_Reference.md` for the app's color scheme
