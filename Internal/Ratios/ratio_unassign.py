"""
Ratio Unassignment Handler

Simple system to unassign ratios from columns by clicking the unassign indicator in Row 5.
Minimal VBA needed - just calls this Python function.
"""

import sys
from pathlib import Path
import xlwings as xw
from PySide6.QtWidgets import QApplication, QMessageBox

# Configuration
RATIOS_SHEET = "Ratios"


def unassign_ratio_from_column(column_letter):
    """
    Unassign a ratio from the specified column
    
    Args:
        column_letter: Column letter (B, C, D, etc.)
    """
    print(f"DEBUG: unassign_ratio_from_column called with column: {column_letter}")
    
    try:
        # Initialize app and apply dark theme
        app = QApplication.instance() or QApplication(sys.argv)
        app.setStyleSheet("""
            QMessageBox {
                background-color: #2d2d2d;
            }
            QMessageBox QLabel {
                color: #e0e0e0;
                font-size: 11pt;
            }
            QMessageBox QPushButton {
                background-color: #0d7377;
                color: #ffffff;
                border: none;
                border-radius: 5px;
                padding: 8px 16px;
                min-width: 80px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #14a085;
            }
        """)
        
        # Get workbook - try multiple methods
        try:
            wb = xw.Book.caller()
            print("DEBUG: Got workbook via caller()")
        except Exception as e:
            print(f"DEBUG: caller() failed: {e}")
            # If caller doesn't work, get active book
            wb = xw.books.active
            print("DEBUG: Got workbook via books.active")
        
        if wb is None:
            print("DEBUG: Workbook is None!")
            QMessageBox.critical(None, "Error", "Could not find active Excel workbook")
            return
        
        print(f"DEBUG: Workbook name: {wb.name}")
        ws = wb.sheets[RATIOS_SHEET]
        print(f"DEBUG: Got worksheet: {ws.name}")
        
        # Get ratio name from Row 4
        ratio_name = ws.range(f"{column_letter}4").value
        
        if not ratio_name:
            return  # Nothing to unassign
        
        # Confirm unassignment
        reply = QMessageBox.question(
            None,
            "Confirm Unassignment",
            f"Unassign '{ratio_name}' from column {column_letter}?",
            QMessageBox.Yes | QMessageBox.No
        )
        
        if reply == QMessageBox.Yes:
            # Clear Row 4 (ratio name)
            ws.range(f"{column_letter}4").clear_contents()
            ws.range(f"{column_letter}4").color = None
            
            # Clear Row 5 (unassign button)
            ws.range(f"{column_letter}5").clear_contents()
            ws.range(f"{column_letter}5").color = None
            
            # Clear all data below (Row 7 onwards)
            last_row = ws.range(f"{column_letter}7").end('down').row
            if last_row >= 7:
                ws.range(f"{column_letter}7:{column_letter}{last_row}").clear_contents()
            
            wb.save()
            
            QMessageBox.information(
                None,
                "Success",
                f"✓ '{ratio_name}' unassigned from column {column_letter}"
            )
            print(f"DEBUG: Successfully unassigned {ratio_name} from column {column_letter}")
            
    except Exception as e:
        print(f"DEBUG: Exception caught: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        
        app = QApplication.instance() or QApplication(sys.argv)
        QMessageBox.critical(
            None,
            "Error",
            f"Failed to unassign ratio:\n{str(e)}"
        )


@xw.sub
def unassign_from_cell():
    """
    Excel-callable function to unassign ratio when clicking Row 5
    Automatically detects which column was clicked
    """
    try:
        wb = xw.Book.caller()
        ws = wb.sheets[RATIOS_SHEET]
        
        # Get active cell
        active_cell = xw.apps.active.selection
        col_letter = active_cell.column_letter
        row = active_cell.row
        
        # Only process if Row 5 was clicked
        if row == 5 and col_letter >= 'B':
            unassign_ratio_from_column(col_letter)
        
    except Exception as e:
        print(f"Error in unassign_from_cell: {e}")


if __name__ == "__main__":
    # Test with a specific column
    import sys
    if len(sys.argv) > 1:
        col = sys.argv[1].upper()
        unassign_ratio_from_column(col)
