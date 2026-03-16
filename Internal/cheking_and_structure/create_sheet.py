import xlwings as xw
import shutil
from pathlib import Path

# Template location
TEMPLATE_PATH = Path(__file__).parent / "Template.xlsm"

# Expected sheets in the workbook
REQUIRED_SHEETS = ["balance sheets", "income statements", "Ratios", "Settings"]


def get_main_workbook_path():
    """Get the path where FinForge.xlsm should be located"""
    return Path(__file__).parent.parent.parent / "FinForge.xlsm"


def create_workbook_from_template():
    """
    Create a new FinForge.xlsm by copying from the template.
    Returns the path to the new workbook.
    """
    target_path = get_main_workbook_path()
    
    if not TEMPLATE_PATH.exists():
        raise FileNotFoundError(f"Template not found at: {TEMPLATE_PATH}")
    
    # Copy template to main directory
    shutil.copy2(TEMPLATE_PATH, target_path)
    print(f"Created new workbook from template: {target_path}")
    return target_path


def restore_missing_sheets(wb=None):
    """
    Check for missing sheets in the workbook and restore them from template.
    If wb is None, uses the active workbook.
    """
    if wb is None:
        wb = xw.books.active
    
    print(f"Checking workbook: {wb.name}")
    
    # Get list of existing sheet names
    existing_sheets = [sheet.name for sheet in wb.sheets]
    missing_sheets = [s for s in REQUIRED_SHEETS if s not in existing_sheets]
    
    if not missing_sheets:
        print("All required sheets are present")
        return
    
    print(f"Missing sheets: {missing_sheets}")
    
    if not TEMPLATE_PATH.exists():
        raise FileNotFoundError(f"Template not found at: {TEMPLATE_PATH}")
    
    # Open template workbook (hidden)
    app = wb.app
    template_wb = app.books.open(str(TEMPLATE_PATH))
    
    try:
        for sheet_name in missing_sheets:
            try:
                # Get the sheet from template
                template_sheet = template_wb.sheets[sheet_name]
                
                # Copy the sheet to the target workbook
                template_sheet.api.Copy(Before=wb.sheets[0].api)
                
                # The copied sheet might have a different name, rename it
                # The copy appears as the first sheet
                wb.sheets[0].name = sheet_name
                
                print(f"Restored sheet '{sheet_name}' from template")
            except Exception as e:
                print(f"Error restoring sheet '{sheet_name}': {e}")
    finally:
        # Close template without saving
        template_wb.close()
    
    wb.save()
    print("Workbook saved with restored sheets")


if __name__ == "__main__":
    # Example usage: restore missing sheets in active workbook
    restore_missing_sheets()
