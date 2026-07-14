# FinForge Documentation

Welcome to the FinForge documentation. This folder contains guides and reference materials for using the application.

---

## Folder Structure

```
Guides/
├── README.md          ← You are here
├── User/              ← End-user documentation
├── Developer/         ← Technical and developer docs
├── FinForge_AddIn_Guide.md       ← Excel add-in architecture
├── ElectronHome_Preload_Contract.md  ← IPC bridge API reference
└── ElectronHome_Statement_Import_UI.md  ← Import screen documentation
```

---

## User Guides

For day-to-day use of FinForge:

| Guide | Description |
|-------|-------------|
| [01_Getting_Started](User/01_Getting_Started.md) | Installation, first launch, system requirements |
| [02_Ticker_Management](User/02_Ticker_Management.md) | Add, edit, delete stock tickers |
| [03_Importing_Data](User/03_Importing_Data.md) | Import financial statements to Excel |
| [04_Creating_Ratios](User/04_Creating_Ratios.md) | Build custom financial ratios |
| [05_Assigning_Ratios](User/05_Assigning_Ratios.md) | Assign ratios to Excel columns |
| [06_Advanced_Ratio_Features](User/06_Advanced_Ratio_Features.md) | Advanced ratio maker features |
| [07_Quick_Reference](User/07_Quick_Reference.md) | Quick reference card |
| [08_Available_Data_Reference](User/08_Available_Data_Reference.md) | Complete list of available data fields |
| [09_Color_Reference](User/09_Color_Reference.md) | Syntax highlighting color reference |
| [10_Data_Cleanup](User/10_Data_Cleanup.md) | Automatic data cleanup system |
| [11_Uninstalling_FinForge](User/11_Uninstalling_FinForge.md) | Reverse setup and remove environment components |
| [Complete_User_Guide](User/Complete_User_Guide.md) | Full end-to-end walkthrough |

### Quick Start Path

If you're new, follow this order:
1. **Getting Started** → Set up and first launch
2. **Ticker Management** → Add your stocks
3. **Importing Data** → Get data into Excel
4. **Creating Ratios** → Build your own ratios
5. **Assigning Ratios** → Display in Excel

---

## Developer Guides

For technical reference and development:

| Guide | Description |
|-------|-------------|
| [01_Yahoo_Finance_Data_Structure](Developer/01_Yahoo_Finance_Data_Structure.md) | Complete Yahoo Finance data structure reference |
| [Balance_Sheet_Default_Order](Developer/Balance_Sheet_Default_Order.md) | How balance sheet imports determine default order |
| [Balance_Sheet_Long_Format](Developer/Balance_Sheet_Long_Format.md) | Long-format balance sheet storage |
| [Income_Statement_Long_Format](Developer/Income_Statement_Long_Format.md) | Long-format income statement storage |
| [Cash_Flow_Import_Guide](Developer/Cash_Flow_Import_Guide.md) | Cash flow statement import module |
| [ElectronHome_Launcher_Window_Guide](Developer/ElectronHome_Launcher_Window_Guide.md) | Launcher window architecture |
| [ElectronHome_Ratio_Maker_Guide](Developer/ElectronHome_Ratio_Maker_Guide.md) | Ratio maker in Electron |
| [FinForge_Electron_Home_Guide](Developer/FinForge_Electron_Home_Guide.md) | Electron home application overview |
| [FinForge_Home_Launcher_Batch_Guide](Developer/FinForge_Home_Launcher_Batch_Guide.md) | Batch file launcher chain |
| [FinForge_Home_Window_Guide](Developer/FinForge_Home_Window_Guide.md) | PySide6 home window (legacy) |
| [Launcher_Data_Cleanup](Developer/Launcher_Data_Cleanup.md) | Ticker data deletion on launch |
| [Research_Search_Module_Guide](Developer/Research_Search_Module_Guide.md) | Research paper search module |
| [Whoogle_Search_Setup_Guide](Developer/Whoogle_Search_Setup_Guide.md) | Whoogle Google proxy setup |
| [Alternative_Research_Search_Ideas](Developer/Alternative_Research_Search_Ideas.md) | Alternative research API ideas |
| [Git_Push_Public_Repo_Report](Developer/Git_Push_Public_Repo_Report.md) | Git push to public repo report |

---

## Quick Links

### Common Tasks

| Task | Guide Section |
|------|---------------|
| Launch the app | [Getting Started](User/01_Getting_Started.md) |
| Add a ticker | [Ticker Management](User/02_Ticker_Management.md) |
| Import balance sheet | [Importing Data](User/03_Importing_Data.md) |
| Create a ratio | [Creating Ratios](User/04_Creating_Ratios.md) |
| Assign ratio to column | [Assigning Ratios](User/05_Assigning_Ratios.md) |
| See all available fields | [Available Data Reference](User/08_Available_Data_Reference.md) |

### Formula Examples

| Ratio | Formula |
|-------|---------|
| Gross Margin | `(IS: Total Revenue - IS: Cost Of Revenue) / IS: Total Revenue` |
| Current Ratio | `BS: Current Assets / BS: Current Liabilities` |
| ROE | `IS: Net Income / BS: Stockholders Equity` |
| Debt to Equity | `BS: Total Debt / BS: Stockholders Equity` |

See [Creating Ratios](User/04_Creating_Ratios.md) for more examples.

---

## Application Overview

### What is FinForge?

A comprehensive financial analysis tool that:
- **Fetches** real-time data from Yahoo Finance
- **Stores** data efficiently in Parquet format (wide and long formats)
- **Imports** financial statements (BS, IS, CF) into Excel
- **Calculates** custom financial ratios
- **Displays** analysis in an organized dashboard
- **Searches** for equity research papers
- **Provides** an Electron desktop UI with launcher and workspace windows

### Key Components

| Component | Purpose |
|-----------|---------|
| Electron Launcher | Application entry point with quick action buttons |
| Electron Workspace | Main UI with Imports, Ratios, Company Profile, and Research tabs |
| Excel Dashboard | Display and analysis interface |
| Ratio Maker | Create custom financial ratios (Python + Electron) |
| Ratio Manager | Assign ratios to Excel columns |
| Data Importer | Transfer data from Parquet to Excel |
| Research Module | Search for equity research papers via DuckDuckGo or Whoogle |
| Template System | Save and load workbook configurations |

### Data Flow

```
Yahoo Finance API (yfinance)
       ↓
  fetch_stocks.py
       ↓
  Parquet Storage (data/ folder)
  - Wide format: data/fundamentals/*/{TICKER}.parquet
  - Long format: data/fundamentals/*_long/{TICKER}.parquet
       ↓
  Import Scripts (import_*.py) → Excel Sheets
       ↓
  Ratio Calculator → Ratios Sheet
       ↓
  Electron UI reads/writes settings via preload bridge
```

---

## Need Help?

1. **Check the relevant guide** in the User folder
2. **Search for keywords** in the guides
3. **Check troubleshooting sections** at the end of each guide
4. **Use the complete user guide** for a full walkthrough: [Complete User Guide](User/Complete_User_Guide.md)

---

*Last Updated: July 2026*
