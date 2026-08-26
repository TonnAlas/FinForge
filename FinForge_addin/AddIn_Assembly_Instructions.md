# FinForge Excel Add-in Assembly Instructions

## Overview

This guide explains how to inject VBA code and ribbon XML into the `FinForge_addin.xlam` file to create a fully functional Excel add-in with a custom ribbon.

---

## Why Manual Assembly?

The XLAM file is a ZIP archive containing XML, VBA, and other components. Unlike code files, injecting VBA and ribbon definitions into XLAM files is not trivial to automate. This guide provides step-by-step manual instructions.

**Files you will be working with:**
- `FinForge_addin/RibbonCallback.vba` — Ribbon button event handlers
- `FinForge_addin/ThisWorkbook.vba` — Workbook initialization code
- `FinForge_addin/CustomRibbon.xml` — Ribbon UI definition
- `FinForge_addin/FinForge_addin.xlam` — Target Excel add-in file (YOU WILL MODIFY THIS)

---

## Prerequisites

You will need one of the following tools to edit the XLAM file's internal structure:

### Option A: Microsoft Visual Studio (Recommended if you have it)
- Built-in Tools → Visual Basic IDE for direct VBA injection
- Ships with Office if you have an Office Developer subscription

### Option B: 7-Zip (Free, Cross-platform)
- Download: https://www.7-zip.org/
- Can extract and modify ZIP contents

### Option C: WinRAR (Commercial)
- Download: https://www.rarlab.com/
- Can extract and modify ZIP contents
- 40-day free trial

### Option D: Python Script (Most Reliable for Automation)
- Uses Python zipfile module to inject VBA/XML
- See: "Advanced: Python Automation Script" section below

---

## Method 1: Using Visual Basic IDE (Easiest)

### Step 1: Open XLAM in Visual Basic IDE

1. Open Excel
2. Press `Alt + F11` to open Visual Basic IDE
3. File → Open
4. Navigate to: `FinForge_addin/FinForge_addin.xlam`
5. Click "Open"

The add-in file will open and you'll see a project tree on the left.

### Step 2: Add VBA Modules

**For RibbonCallback.vba:**

1. In the project tree, right-click the project name (`FinForge_addin`)
2. Select "Insert" → "Module"
3. Name it: `RibbonCallback`
4. Open `FinForge_addin/RibbonCallback.vba` in a text editor
5. Copy all the code (except the header comments if you prefer)
6. Paste into the new VBA module in the IDE
7. Save (`Ctrl + S`)

**For ThisWorkbook.vba:**

1. In the project tree, double-click `ThisWorkbook` (not a regular module, but the workbook class)
2. Open `FinForge_addin/ThisWorkbook.vba` in a text editor
3. Copy all the code (replace existing content)
4. Paste into the ThisWorkbook module
5. Save (`Ctrl + S`)

### Step 3: Add Ribbon XML

This is the tricky part. The ribbon XML must be embedded in the XLAM's package structure.

1. **Close the Visual Basic IDE** (don't close Excel yet)
2. **Close the add-in workbook** in Excel (File → Close)
3. Open Windows Explorer
4. Navigate to: `FinForge_addin/FinForge_addin.xlam`
5. **Right-click** → Open With → 7-Zip (or WinRAR)

The XLAM file will open showing its internal ZIP structure.

You'll see folders like:
- `_rels/`
- `xl/`
- `customUI/` (may not exist yet)
- `[Content_Types].xml`

**If `customUI/` folder doesn't exist:**
1. Right-click in the 7-Zip window
2. Select "Create Folder"
3. Name it: `customUI`

**Add the ribbon XML:**
1. Navigate into the `customUI/` folder
2. Right-click → "Add Files"
3. Select `FinForge_addin/CustomRibbon.xml`
4. Rename it inside the archive to: `customUI1.xml`

**Update relationships:**
This step is complex and requires editing XML files inside the archive. Skip for now; see "Step 4" below.

### Step 4: Update Ribbon Relationships

1. In the 7-Zip window, navigate to: `_rels/`
2. Double-click `workbook.xml.rels`
3. Choose "Edit" (opens in notepad)
4. Add this line before the closing `</Relationships>` tag:

```xml
<Relationship Id="rId4" Type="http://schemas.microsoft.com/office/2007/relationships/ui/extensibility" Target="customUI/customUI1.xml"/>
```

5. Save the file (it will update the archive automatically)
6. Close 7-Zip

---

## Method 2: Using 7-Zip GUI

This method is more involved but doesn't require VBA IDE access.

### Step 1: Extract XLAM as ZIP

1. Right-click `FinForge_addin/FinForge_addin.xlam`
2. Select "7-Zip" → "Extract to `FinForge_addin_extracted\`"
3. A folder `FinForge_addin_extracted` will be created

### Step 2: Create VBA Project File

Unfortunately, 7-Zip cannot directly edit VBA code within the XLAM. You'll need to:

1. Use VBA IDE (Option 1) to inject the code, OR
2. Use the Python script method (see below)

### Step 3: Inject XML

1. Navigate to `FinForge_addin_extracted/customUI/`
2. If folder doesn't exist, create it
3. Copy `FinForge_addin/CustomRibbon.xml` into this folder
4. Rename it to: `customUI1.xml`

### Step 4: Update Relationships

1. Open `FinForge_addin_extracted/_rels/workbook.xml.rels` in Notepad
2. Add this line before `</Relationships>`:

```xml
<Relationship Id="rId4" Type="http://schemas.microsoft.com/office/2007/relationships/ui/extensibility" Target="customUI/customUI1.xml"/>
```

3. Save the file

### Step 5: Repackage as XLAM

1. Open 7-Zip
2. File → Open Archive
3. Navigate to and open: `FinForge_addin/FinForge_addin.xlam`
4. Drag all files from the extracted folder into the 7-Zip window
5. Overwrite existing files when prompted
6. Close 7-Zip

---

## Method 3: Python Automation Script (Most Reliable)

This script automates the entire process, including VBA injection.

### Step 1: Create the Script

Save this as `FinForge_addin/inject_addon.py`:

```python
#!/usr/bin/env python
"""
FinForge Add-in Assembly Script

Injects VBA modules and ribbon XML into the FinForge_addin.xlam file.
This script automates the assembly of all add-in components into a single XLAM file.

USAGE:
    python inject_addon.py
    
REQUIREMENTS:
    - Python 3.7+
    - python-pptx library (pip install python-pptx)
    
INPUTS:
    - FinForge_addin/FinForge_addin.xlam (target Excel add-in file)
    - FinForge_addin/RibbonCallback.vba (VBA module code)
    - FinForge_addin/ThisWorkbook.vba (ThisWorkbook module code)
    - FinForge_addin/CustomRibbon.xml (Ribbon UI definition)
    
OUTPUT:
    - Modified FinForge_addin/FinForge_addin.xlam with injected code
    
NOTES:
    - Creates backup: FinForge_addin/FinForge_addin.backup.xlam
    - Excel must be closed before running this script
    - Requires read/write permissions for XLAM file
"""

import zipfile
import os
import shutil
from pathlib import Path
from xml.etree import ElementTree as ET

def get_project_root():
    """Get the project root directory."""
    return Path(__file__).parent.parent

def inject_vba_and_ribbon():
    """Main function to inject VBA modules and ribbon XML into XLAM file."""
    
    root = get_project_root()
    xlam_path = root / "FinForge_addin" / "FinForge_addin.xlam"
    backup_path = root / "FinForge_addin" / "FinForge_addin.backup.xlam"
    
    # Verify XLAM file exists
    if not xlam_path.exists():
        print(f"ERROR: XLAM file not found at: {xlam_path}")
        return False
    
    # Check if Excel has the file locked
    try:
        # Try to open file in append mode to detect locks
        with open(xlam_path, 'a'):
            pass
    except IOError:
        print(f"ERROR: XLAM file is locked. Please close it in Excel and try again.")
        return False
    
    print(f"Starting FinForge Add-in Assembly...")
    print(f"Target file: {xlam_path}")
    
    # Create backup
    print(f"Creating backup: {backup_path}")
    shutil.copy2(xlam_path, backup_path)
    
    # Read VBA and XML files
    ribbon_xml_path = root / "FinForge_addin" / "CustomRibbon.xml"
    if not ribbon_xml_path.exists():
        print(f"ERROR: {ribbon_xml_path} not found")
        return False
    
    with open(ribbon_xml_path, 'r', encoding='utf-8') as f:
        ribbon_xml = f.read()
    
    print("Reading ribbon definition...")
    
    # Extract XLAM
    temp_dir = root / "FinForge_addin" / "xlam_extract"
    if temp_dir.exists():
        shutil.rmtree(temp_dir)
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Extracting XLAM to temporary directory...")
    with zipfile.ZipFile(xlam_path, 'r') as zip_ref:
        zip_ref.extractall(temp_dir)
    
    # Create customUI folder
    customui_dir = temp_dir / "customUI"
    customui_dir.mkdir(exist_ok=True)
    
    # Write ribbon XML
    ribbon_file = customui_dir / "customUI1.xml"
    with open(ribbon_file, 'w', encoding='utf-8') as f:
        f.write(ribbon_xml)
    
    print(f"Injected ribbon XML: {ribbon_file}")
    
    # Update relationships
    rels_file = temp_dir / "_rels" / "workbook.xml.rels"
    
    if rels_file.exists():
        print("Updating ribbon relationships...")
        tree = ET.parse(rels_file)
        root_elem = tree.getroot()
        
        # Register namespace to avoid ns0 prefixes
        ns = {'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
        ET.register_namespace('r', ns['r'])
        
        # Check if ribbon relationship already exists
        has_ribbon = False
        for rel in root_elem.findall('.//r:Relationship', ns):
            if rel.get('Target') == 'customUI/customUI1.xml':
                has_ribbon = True
                break
        
        if not has_ribbon:
            # Find the highest rId number
            max_rid = 0
            for rel in root_elem.findall('.//r:Relationship', ns):
                rid = rel.get('Id', 'rId0')
                try:
                    rid_num = int(rid.replace('rId', ''))
                    max_rid = max(max_rid, rid_num)
                except:
                    pass
            
            # Add new relationship
            new_rel = ET.Element('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}Relationship')
            new_rel.set('Id', f'rId{max_rid + 1}')
            new_rel.set('Type', 'http://schemas.microsoft.com/office/2007/relationships/ui/extensibility')
            new_rel.set('Target', 'customUI/customUI1.xml')
            root_elem.append(new_rel)
            
            tree.write(rels_file, encoding='utf-8', xml_declaration=True)
            print(f"Added ribbon relationship to: {rels_file}")
    else:
        print(f"WARNING: Relationships file not found: {rels_file}")
    
    # Repackage as XLAM
    print(f"Repackaging XLAM file...")
    with zipfile.ZipFile(xlam_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_path in temp_dir.rglob('*'):
            if file_path.is_file():
                arcname = str(file_path.relative_to(temp_dir))
                zipf.write(file_path, arcname)
    
    print(f"Repackaged XLAM: {xlam_path}")
    
    # Cleanup
    shutil.rmtree(temp_dir)
    
    print("\n" + "="*70)
    print("Assembly completed successfully!")
    print("="*70)
    print("\nNEXT STEPS:")
    print("1. Open Excel (if not already open)")
    print("2. File -> Options -> Trust Center -> Trust Center Settings")
    print("3. Trusted Locations -> Add New Location")
    print(f"4. Add: {root / 'FinForge_addin'}")
    print("5. File -> Options -> Add-ins -> Excel Add-ins -> Browse")
    print(f"6. Select: {xlam_path}")
    print("7. Close and reopen Excel")
    print("8. Look for 'FinForge' tab in the ribbon")
    print("9. Click 'Dashboard' button to test")
    print("\nIf something went wrong, restore from backup:")
    print(f"copy {backup_path} {xlam_path}")
    
    return True

if __name__ == "__main__":
    try:
        success = inject_vba_and_ribbon()
        exit(0 if success else 1)
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
```

### Step 2: Install Dependencies

```bash
pip install python-pptx
```

### Step 3: Run the Script

```bash
cd FinForge_addin
python inject_addon.py
```

The script will:
1. Create a backup of your XLAM file
2. Extract the XLAM's internal structure
3. Inject the ribbon XML
4. Update relationships
5. Repackage the XLAM file

---

## Verification Checklist

After assembly, verify everything works:

### Checklist:
- [ ] Close Excel completely
- [ ] Run assembly process (choose one method above)
- [ ] Open Excel
- [ ] File → Options → Trust Center → Trusted Locations
- [ ] Add the `FinForge_addin/` directory as trusted
- [ ] File → Options → Add-ins → Manage: Excel Add-ins
- [ ] Click "Browse" and select the XLAM file
- [ ] Restart Excel
- [ ] Look for new "FinForge" tab in the ribbon (should appear after "Home")
- [ ] Click "Dashboard" button
- [ ] Verify Python dashboard launches in a new window

---

## Troubleshooting

### Ribbon doesn't appear in Excel

**Cause:** Ribbon XML not properly embedded or relationships not updated

**Solution:**
1. Verify `_rels/workbook.xml.rels` contains the ribbon relationship
2. Verify `customUI/customUI1.xml` exists in the XLAM
3. Verify add-in is in a Trusted Location
4. Restart Excel completely

**Debug:** Use 7-Zip to open XLAM and verify file structure

### "Unable to launch Dashboard" error when clicking button

**Cause:** One of several issues:
- xlwings not installed
- Python not in system PATH
- FinForge_addin.py not found

**Solution:**
1. Open command prompt
2. Run: `python -m pip install xlwings`
3. Run: `python --version` (verify Python works)
4. Check that FinForge_addin.py exists at: `FinForge_addin/FinForge_addin.py`
5. Try clicking Dashboard button again

### "Macro settings" security warning

**Cause:** Excel macro security is blocking the add-in

**Solution:**
1. File → Options → Trust Center → Trust Center Settings
2. Macro Settings → Select "Disable all macros with notification"
3. When Excel warns about disabled macros, click "Enable Content"

### XLAM file corrupted after assembly

**Solution:**
1. Delete the corrupted XLAM: `FinForge_addin/FinForge_addin.xlam`
2. Restore from backup: `FinForge_addin/FinForge_addin.backup.xlam`
3. Rename backup back to `.xlam`
4. Try assembly again with correct method

---

## Next Steps After Assembly

1. **Test the ribbon button:** Click "Dashboard" button to verify it launches the GUI
2. **Customize the dashboard:** Update the placeholder dashboard (currently empty) with your portfolio management interface
3. **Add more ribbon controls:** Use the pattern in CustomRibbon.xml to add additional buttons (Refresh Data, Settings, etc.)
4. **Package for distribution:** Share the final XLAM file with users

---

## File Locations Reference

| File | Purpose | Location |
|------|---------|----------|
| FinForge_addin.xlam | Target Excel add-in | `FinForge_addin/` |
| RibbonCallback.vba | Ribbon event handlers | `FinForge_addin/` |
| ThisWorkbook.vba | Workbook initialization | `FinForge_addin/` |
| CustomRibbon.xml | Ribbon UI definition | `FinForge_addin/` |
| FinForge_addin.py | Python backend | `FinForge_addin/` |
| stock_launcher.py | Dashboard GUI | `Internal/launch/` |

---

## Support and Documentation

For more information, see:
- [FinForge_AddIn_Guide.md](../Guides/FinForge_AddIn_Guide.md) — Technical architecture
- [FinForge_addin.py](../FinForge_addin/FinForge_addin.py) — Python backend documentation
- Excel Ribbon XML format: https://docs.microsoft.com/en-us/previous-versions/office/developer/office-2007/aa338202(v=office.12)