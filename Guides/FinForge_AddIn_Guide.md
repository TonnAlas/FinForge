# FinForge Excel Add-in Technical Guide

## Overview

This document explains the architecture, components, and functionality of the FinForge Excel add-in. It covers how the custom ribbon integrates with your Python dashboard application.

---

## Architecture Overview

The FinForge add-in consists of three main layers:

```
┌─────────────────────────────────────────────┐
│ Excel Application (User Layer)              │
│ - Custom Ribbon with "Dashboard" button     │
│ - Standard Excel interface                  │
└────────────────┬────────────────────────────┘
                 │ User clicks "Dashboard" button
                 ▼
┌─────────────────────────────────────────────┐
│ VBA Bridge Layer (Communication)            │
│ - RibbonCallback.vba: Handles button clicks │
│ - xlwings: VBA-to-Python bridge             │
└────────────────┬────────────────────────────┘
                 │ Calls launch_home_window()
                 ▼
┌─────────────────────────────────────────────┐
│ Python Backend (Application Layer)          │
│ - FinForge_addin.py: xlwings interface      │
│ - data_management.py: Stock data operations │
│ - Python business logic and Excel bridge    │
└────────────────┬────────────────────────────┘
                 │ Launches Electron home app
                 ▼
┌─────────────────────────────────────────────┐
│ Electron UI Layer                           │
│ - ElectronHome/: FinForge home application  │
│ - Sidebar navigation and settings pages     │
└─────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Excel Add-in File (FinForge_addin.xlam)

The XLAM file is the core of the add-in. It's a ZIP archive containing:

```
FinForge_addin.xlam (ZIP archive)
├── _rels/
│   └── workbook.xml.rels          (Relationships, includes ribbon reference)
├── xl/
│   ├── workbook.xml               (Workbook structure)
│   └── worksheets/
│       └── sheet1.xml             (Empty sheet for add-in)
├── customUI/
│   └── customUI1.xml              (Ribbon UI definition - INJECTED)
├── vbaProject.bin                 (VBA code - NOT SHOWN, binary format)
└── [Content_Types].xml            (File type definitions)
```

**Key Points:**
- The VBA code (RibbonCallback.vba, ThisWorkbook.vba) is compiled into `vbaProject.bin`
- The ribbon XML must be added to `customUI/customUI1.xml`
- The relationship must be registered in `workbook.xml.rels`
- The XLAM file itself is minimal; most logic is in VBA/Python

### 2. VBA Module: RibbonCallback.vba

**Purpose:** Event handler for ribbon controls

**Key Subroutine:**
```vba
Sub LaunchDashboard(control As IRibbonControl)
```

**Workflow:**
1. User clicks "Dashboard" button in the FinForge ribbon tab
2. Excel calls `LaunchDashboard(control)` automatically
3. VBA resolves the project root folder
4. VBA starts `Internal/launch/launch_finforge_terminal.bat` via `Shell` with a hidden window
5. The batch file sets `FINFORGE_START_WINDOW=workspace` and launches the Electron app
6. VBA displays a confirmation message to the user

**Code Flow:**
```vba
LaunchDashboard()
    → Resolve project root folder
    → Verify Internal/launch/launch_finforge_terminal.bat exists
    → Start batch file in a separate (hidden) process
    → MsgBox with confirmation
```

### 3. VBA Module: ThisWorkbook.vba

**Purpose:** Workbook-level initialization and cleanup

**Key Events:**
- `Workbook_Open()` — Runs when add-in loads into Excel
- `Workbook_AddinInstall()` — Runs when add-in first installed
- `Workbook_AddinUninstall()` — Runs when add-in removed

**Responsibilities:**
- Initialize ribbon references
- Log add-in load status
- Validate Python environment (optional)
- Register event handlers

### 4. Ribbon Definition: CustomRibbon.xml

**Purpose:** Defines the ribbon UI (tabs, groups, buttons)

**Structure:**
```xml
<customUI> (root)
└── <ribbon>
    └── <tabs>
        └── <tab id="finforgeTab" label="FinForge">
            ├── <group id="mainGroup" label="Dashboard">
            │   └── <button id="dashboardButton" onAction="LaunchDashboard" ... />
            └── <group id="infoGroup" label="Help">
                (placeholder for future Help button)
```

**Key Attributes:**
- `id` — Unique identifier (used in VBA callbacks)
- `label` — Display text in Excel ribbon
- `onAction` — VBA macro to call (must match subroutine name exactly)
- `imageMso` — Built-in Excel icon ID
- `screentip` — Tooltip on hover

### 5. Python Module: FinForge_addin.py

**Purpose:** Python backend called via xlwings from VBA

**Key Function:**
```python
def launch_home_window():
    """
    Launch the FinForge home window.
    
    Returns:
        {"success": bool, "message": str}
    """
```

**Workflow:**
1. xlwings routes VBA call to this function
2. Function validates that Internal/launch/launch_finforge_terminal.bat exists
3. Spawns new process: `subprocess.Popen(["cmd", "/c", "start", "", launcher_path])`
4. Returns success/error status dictionary
5. Dictionary is marshaled back to VBA as COM object

**Error Handling:**
- Checks if Internal/launch/launch_finforge_terminal.bat exists
- Handles FileNotFoundError (missing Python environment)
- Catches all exceptions with descriptive messages
- Returns user-friendly error messages for display in Excel

---

## Data Flow Diagram

### User Clicks "Dashboard" Button

```
User clicks Excel ribbon button
  ↓
Excel ribbon framework routes to VBA
  ↓
LaunchDashboard() [RibbonCallback.vba]
    ├─ Resolve project root folder
        ├─ Verify Internal/launch/launch_finforge_terminal.bat exists
    ├─ Start batch file via Shell
        ├─ Batch file launches ElectronHome/ in workspace mode
        ├─ Electron workspace window opens in a new process
    ├─ Display MsgBox confirmation
  ↓
User sees launch confirmation or error message
```

---

## File Dependencies

```
FinForge_addin.xlam
├── [INJECTED] RibbonCallback.vba
│   └── Uses: Internal/launch/launch_finforge_terminal.bat
├── [INJECTED] ThisWorkbook.vba
│   └── Event handlers for workbook load
└── [INJECTED] CustomRibbon.xml
    └── Defines UI for "FinForge" ribbon tab

FinForge_addin.py [Python]
├── import subprocess
├── import xlwings
└── from pathlib import Path
    └── Calls: Internal/launch/launch_finforge_terminal.bat

ElectronHome/
├── main.js
├── preload.js
├── src/index.html
├── src/renderer.js
└── src/styles.css
```

---

## xlwings Bridge Explained

### What is xlwings?

xlwings is a Python library that creates a bridge between Excel VBA and Python. It allows:
- VBA code to call Python functions
- Python code to read/write Excel cells
- Seamless data marshaling between VBA and Python

### How Does It Work?

1. **Registration Phase:**
   - xlwings is installed via pip
   - Python registers itself as a COM server
   - Excel can now find and call Python functions

2. **Call Phase (VBA → Python):**
   ```vba
   Dim api As Object
   Set api = CreateObject("win32com.client.Dispatch")("python.excel.api")
   Dim result = api.launch_dashboard()
   ```
   
   - VBA creates COM reference to Python
   - VBA calls Python function by name
   - Python function executes
   - Result is marshaled back to VBA as COM object

3. **Return Phase (Python → VBA):**
   ```python
   def launch_dashboard():
       return {"success": True, "message": "Dashboard launched"}
   ```
   
   - Python dictionary is converted to COM-compatible object
   - VBA receives as object with named properties
   - VBA accesses via: `result("success")`, `result("message")`

### Requirements for xlwings

- Python 3.7+ installed and in system PATH
- xlwings library installed: `pip install xlwings`
- Windows (or macOS/Linux with some configuration)
- Excel 2007 or later

---

## Installation & Setup Steps

### Step 1: Install Python Dependencies

```bash
pip install xlwings
```

### Step 2: Assemble the Add-in

Follow the instructions in: [Temporary/AddIn_Assembly_Instructions.md](../Temporary/AddIn_Assembly_Instructions.md)

Three methods are provided:
- **Method 1:** Visual Basic IDE (easiest, most direct)
- **Method 2:** 7-Zip GUI (if you don't have VB IDE)
- **Method 3:** Python script (most reliable for automation)

### Step 3: Trust the Add-in Location

1. Open Excel
2. File → Options → Trust Center → Trust Center Settings
3. Trusted Locations → Add New Location
4. Browse to: `C:\Users\tonna\Desktop\Stocks-Main_Public_Test\FinForge_addin\`
5. Click OK

### Step 4: Enable the Add-in

1. File → Options → Add-ins → Manage: Excel Add-ins
2. Click "Browse"
3. Navigate to: `FinForge_addin/FinForge_addin.xlam`
4. Click "Open"
5. Close Excel completely and reopen

### Step 5: Verify Installation

1. Look for new "FinForge" tab in ribbon (should appear after "Home" tab)
2. Click "Dashboard" button
3. Should see success message or error details
4. If successful, PySide6 GUI window should launch

---

## Troubleshooting Guide

### Symptom: Ribbon doesn't appear

**Possible Causes:**
1. CustomRibbon.xml not injected into XLAM
2. Relationship not registered in workbook.xml.rels
3. Add-in location not in Trusted Locations
4. Excel macro security blocked the add-in

**Solutions:**
1. Verify XLAM file structure using 7-Zip (see [AddIn_Assembly_Instructions.md](../Temporary/AddIn_Assembly_Instructions.md))
2. Re-run assembly process using correct method
3. Add XLAM folder to Trusted Locations (see Step 3 above)
4. Restart Excel completely (not just close workbook)

### Symptom: "Unable to launch Dashboard" error

**Possible Causes:**
1. xlwings not installed
2. Python not in system PATH
3. FinForge_addin.py not found

**Solutions:**
1. Run: `pip install xlwings`
2. Verify Python: Open command prompt, run: `python --version`
3. Verify file location: `FinForge_addin/FinForge_addin.py` should exist
4. Check file paths in launch_dashboard() function

### Symptom: Macro security warning appears

**Solution:**
1. File → Options → Trust Center → Trust Center Settings
2. Macro Settings → Select "Disable all macros with notification"
3. When warned, click "Enable Content"

### Symptom: Dashboard doesn't launch after success message

**Possible Causes:**
1. GUI dependencies not installed (PySide6)
2. stock_launcher.py has syntax errors
3. Python environment misconfigured

**Solutions:**
1. Install: `pip install PySide6`
2. Test stock_launcher.py manually: `python Internal/launch/stock_launcher.py`
3. Check Python terminal output for error messages

### Symptom: "Python not in PATH" error

**Solution (Windows):**
1. Open System Properties (Win + Pause)
2. Click "Environment variables"
3. Under System variables, find "Path"
4. Click "Edit"
5. Click "New"
6. Add: `C:\Users\tonna\AppData\Local\Programs\Python\Python311` (adjust version as needed)
7. Click OK, restart command prompt and Excel

---

## Customization Guide

### Add a New Ribbon Button

**Step 1: Update CustomRibbon.xml**

Add this inside the `<group>` element:

```xml
<button
    id="refreshButton"
    label="Refresh Data"
    imageMso="Refresh"
    size="large"
    onAction="RefreshData"
    screentip="Refresh Stock Data"
    supertip="Update all stock data from Yahoo Finance."
/>
```

**Step 2: Add VBA Handler in RibbonCallback.vba**

```vba
Sub RefreshData(control As IRibbonControl)
    ' Call Python function
    Set api = CreateObject("win32com.client.Dispatch")("python.excel.api")
    Set result = api.refresh_data()
    
    ' Display result
    If result("success") Then
        MsgBox result("message"), vbInformation, "Refresh Data"
    Else
        MsgBox result("message"), vbCritical, "Refresh Data Error"
    End If
End Sub
```

**Step 3: Add Python Function in FinForge_addin.py**

```python
def refresh_data():
    """Refresh stock data from Yahoo Finance."""
    try:
        # Your refresh logic here
        return {
            "success": True,
            "message": "Stock data refreshed successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Refresh failed: {e}"
        }
```

### Change Ribbon Tab Name

In CustomRibbon.xml, change the `label` attribute:

```xml
<tab id="finforgeTab" label="My Custom Label">
```

### Change Button Icon

In CustomRibbon.xml, set the `imageMso` attribute to any Excel built-in icon ID:

Common icons:
- `PowerPointSlideShowFromCurrent` — Play icon
- `Refresh` — Refresh icon
- `Help` — Question mark icon
- `Save` — Save icon
- `Settings` — Gear icon

Browse all available icons: https://officeribbonxeditor.codeplex.com/

---

## Advanced Topics

### Running as Frozen Executable

Instead of relying on Python being installed:

1. Use `pyinstaller` to freeze `FinForge_addin.py` as executable
2. Update VBA to call the executable directly
3. Users don't need Python installed

```vba
Sub LaunchDashboard(control As IRibbonControl)
    Dim pythonPath As String
    pythonPath = ThisWorkbook.Path & "\FinForge_addin.exe"
    
    Shell pythonPath, vbNormalFocus
End Sub
```

### Embedding Images in Ribbon

Instead of using `imageMso`, embed custom PNG images:

1. Convert PNG to base64
2. Reference in XML as: `image="data:image/png;base64,..."`

### Using Ribbon Callbacks for Dynamic Updates

The `OnRibbonLoad()` callback can be used to:
- Enable/disable buttons based on workbook state
- Change button labels dynamically
- Show/hide ribbon groups

Requires storing `IRibbonUI` reference and calling `InvalidateControl()`.

---

## Performance Considerations

### Ribbon Loading Time

- Ribbon loads on Excel startup (one-time cost)
- Subsequent button clicks spawn background processes (non-blocking)

### Memory Usage

- XLAM file: ~100 KB (minimal)
- VBA modules: ~50 KB (in memory)
- Python subprocess: Depends on GUI complexity

### Process Management

Dashboard GUI runs in separate process:
- Won't block Excel if GUI hangs
- GUI can be closed independently
- Multiple instances can run simultaneously

---

## Security Considerations

### Macro Security

- VBA code requires user to enable macros
- Add-in must be in Trusted Location
- Users can verify code in VBA IDE before enabling

### Python Execution

- Python code runs with user's permissions
- No elevated privileges needed
- All I/O local to project directory

### Data Flow

- No data transmitted outside local machine
- All communication through COM interface
- No external network calls (unless explicitly in stock_launcher.py)

---

## FAQ

**Q: Can I use this with LibreOffice Calc or Google Sheets?**
A: No, this add-in is specific to Microsoft Excel. xlwings primarily supports Excel on Windows/macOS.

**Q: What if users don't have Python installed?**
A: Use PyInstaller to create a standalone executable. See "Advanced Topics" section.

**Q: Can I share the XLAM file with others?**
A: Yes, but they must:
1. Have Python 3.7+ installed
2. Have xlwings installed (`pip install xlwings`)
3. Add the XLAM folder to Trusted Locations
4. Enable the add-in

**Q: How do I update the add-in?**
A: Modify VBA/Python code and re-assemble using the injection script. Users will see updates when they reload Excel.

**Q: Can the add-in work offline?**
A: Yes, all functionality is local. The dashboard and data fetching work offline (unless stock_launcher explicitly requires internet for data).

**Q: Is there a limit to number of ribbon buttons?**
A: No practical limit, but too many buttons clutter the UI. Consider using dropdown menus or groups instead.

---

## Support & Documentation

- **Assembly Instructions:** [Temporary/AddIn_Assembly_Instructions.md](../Temporary/AddIn_Assembly_Instructions.md)
- **Python Backend:** [FinForge_addin/FinForge_addin.py](../FinForge_addin/FinForge_addin.py)
- **Dashboard Implementation:** [Internal/launch/stock_launcher.py](../Internal/launch/stock_launcher.py)
- **xlwings Documentation:** https://docs.xlwings.org/
- **Office Ribbon XML Spec:** https://docs.microsoft.com/en-us/previous-versions/office/developer/office-2007/aa338202(v=office.12)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-05-15 | Initial implementation: Custom ribbon with Dashboard button launching stock_launcher GUI via xlwings bridge |

---

## Next Steps

1. **Assemble the add-in** using [Temporary/AddIn_Assembly_Instructions.md](../Temporary/AddIn_Assembly_Instructions.md)
2. **Test installation** by following verification checklist
3. **Customize the dashboard** with your portfolio features (currently placeholder)
4. **Add more ribbon controls** as needed using customization guide
5. **Package for distribution** to users