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

### Step 1: Launch the Application

**Option A - Using the Batch File (Recommended)**
1. Double-click `launch_finforge.bat` in the main folder
2. The FinForge window will open

**Option B - From Command Line**
```powershell
cd C:\Users\tonna\Desktop\Stocks
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
   - Open Excel, go to File → Options → Trust Center
   - Click Trust Center Settings → Macro Settings
   - Select "Enable all macros"

2. **Install xlwings Add-in** (if prompted)
   - The app uses xlwings to communicate with Excel
   - Follow any prompts to install the add-in

---

## Folder Structure

```
FinForge/
+-- FinForge.xlsm           <- Main Excel workbook
+-- launch_finforge.bat     <- Quick launcher
+-- data/                   <- All fetched data stored here
|   +-- fundamentals/       <- Financial statements
|   +-- holders/            <- Holder information
|   +-- metadata/           <- Company info
|   +-- prices/             <- Price history
+-- Guides/                 <- Documentation (you are here)
|   +-- User/               <- User guides
|   +-- Developer/          <- Technical docs
+-- Importing/              <- Import scripts
+-- Internal/               <- Core modules
```

---

## Next Steps

- [Ticker Management](02_Ticker_Management.md) - Add and manage stock tickers
- [Importing Data](03_Importing_Data.md) - Import financial statements to Excel
- [Creating Ratios](04_Creating_Ratios.md) - Build custom financial ratios
- [Assigning Ratios](Ratio_Assignment_User_Guide.md) - Display ratios in Excel

---

## Need Help?

- Check the other guides in this folder
- Review `Available_Data_Reference.md` for all available data fields
- Check `Color_Reference.md` for the app's color scheme
