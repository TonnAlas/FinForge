"""
Ratio Manager UI - Assignment and Management System

This module provides a comprehensive UI for managing ratio assignments in Excel.
All functionality is in Python for reliability and maintainability.

Features:
- View all created ratios with assignment status
- Assign ratios to Excel columns
- View ratio notes
- Unassign ratios from columns
- Minimal VBA dependency
"""

import sys
from pathlib import Path
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QListWidget, QListWidgetItem, QLabel, QMessageBox,
    QInputDialog, QTextEdit, QDialog
)
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont
import xlwings as xw

# Add parent director to path for imports
sys.path.append(str(Path(__file__).parent.parent.parent))
from Internal.Ratios.ratio_handeling import get_ratios_from_config

# Configuration
DASHBOARD_PATH = Path(__file__).parent.parent.parent / "FinForge.xlsm"
RATIOS_SHEET = "Ratios"


class NotesDialog(QDialog):
    """Dialog to display ratio notes"""
    
    def __init__(self, ratio_name, notes, parent=None):
        super().__init__(parent)
        self.ratio_name = ratio_name
        self.notes = notes
        self.init_ui()
    
    def init_ui(self):
        self.setWindowTitle(f"Notes: {self.ratio_name}")
        self.setMinimumSize(500, 300)
        
        # Apply dark theme
        self.setStyleSheet("""
            QDialog {
                background-color: #1e1e1e;
            }
            QLabel {
                color: #e0e0e0;
            }
            QTextEdit {
                background-color: #2d2d2d;
                color: #e0e0e0;
                border: 1px solid #3e3e3e;
                border-radius: 5px;
                padding: 10px;
                font-size: 10pt;
            }
            QPushButton {
                background-color: #0d7377;
                color: #ffffff;
                border: none;
                border-radius: 5px;
                padding: 10px;
                font-weight: bold;
                font-size: 11pt;
                min-height: 30px;
            }
            QPushButton:hover {
                background-color: #14a085;
            }
        """)
        
        layout = QVBoxLayout()
        layout.setSpacing(10)
        layout.setContentsMargins(20, 20, 20, 20)
        
        # Title
        title = QLabel(f"📝 Notes for: {self.ratio_name}")
        title.setFont(QFont("Arial", 12, QFont.Bold))
        title.setStyleSheet("color: #14a085; padding: 5px;")
        layout.addWidget(title)
        
        # Notes text
        notes_text = QTextEdit()
        notes_text.setPlainText(self.notes if self.notes else "No notes available.")
        notes_text.setReadOnly(True)
        layout.addWidget(notes_text)
        
        # Close button
        close_btn = QPushButton("Close")
        close_btn.clicked.connect(self.accept)
        layout.addWidget(close_btn)
        
        self.setLayout(layout)


class RatioManagerUI(QMainWindow):
    """Main Ratio Manager UI"""
    
    def __init__(self):
        super().__init__()
        self.ratios = {}
        self.assignments = {}  # {column: ratio_name}
        self.wb = None
        self.ws = None
        self.init_ui()
        self.load_data()
    
    def init_ui(self):
        self.setWindowTitle("Ratio Manager - Assign & Manage")
        self.setMinimumSize(600, 500)
        
        # Apply dark theme
        self.setStyleSheet("""
            QMainWindow {
                background-color: #1e1e1e;
            }
            QWidget {
                background-color: #1e1e1e;
                color: #e0e0e0;
            }
            QLabel {
                color: #e0e0e0;
            }
            QListWidget {
                background-color: #2d2d2d;
                color: #e0e0e0;
                border: 1px solid #3e3e3e;
                border-radius: 5px;
                padding: 5px;
            }
            QListWidget::item {
                padding: 8px;
                border-radius: 3px;
            }
            QListWidget::item:selected {
                background-color: #0d7377;
                color: #ffffff;
            }
            QListWidget::item:hover {
                background-color: #3e3e3e;
            }
            QPushButton {
                background-color: #0d7377;
                color: #ffffff;
                border: none;
                border-radius: 5px;
                padding: 10px;
                font-weight: bold;
                font-size: 11pt;
            }
            QPushButton:hover {
                background-color: #14a085;
            }
            QPushButton:pressed {
                background-color: #0a5a5d;
            }
        """)
        
        # Central widget
        central = QWidget()
        self.setCentralWidget(central)
        main_layout = QVBoxLayout(central)
        main_layout.setSpacing(10)
        main_layout.setContentsMargins(20, 20, 20, 20)
        
        # Title
        title = QLabel("📊 Financial Ratio Manager")
        title.setFont(QFont("Arial", 16, QFont.Bold))
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("color: #14a085; padding: 10px;")
        main_layout.addWidget(title)
        
        # Info label
        info = QLabel("Manage ratio assignments for the Ratios worksheet")
        info.setAlignment(Qt.AlignCenter)
        info.setStyleSheet("color: #a0a0a0; font-size: 10pt;")
        main_layout.addWidget(info)
        
        # Ratio list
        list_label = QLabel("Available Ratios:")
        list_label.setFont(QFont("Arial", 11, QFont.Bold))
        list_label.setStyleSheet("color: #e0e0e0; margin-top: 10px;")
        main_layout.addWidget(list_label)
        
        self.ratio_list = QListWidget()
        self.ratio_list.setSelectionMode(QListWidget.SingleSelection)
        main_layout.addWidget(self.ratio_list)
        
        # Buttons
        button_layout = QHBoxLayout()
        button_layout.setSpacing(10)
        
        self.assign_btn = QPushButton("📌 Assign to Column")
        self.assign_btn.clicked.connect(self.assign_ratio)
        self.assign_btn.setMinimumHeight(40)
        button_layout.addWidget(self.assign_btn)
        
        self.notes_btn = QPushButton("📝 View Notes")
        self.notes_btn.clicked.connect(self.view_notes)
        self.notes_btn.setMinimumHeight(40)
        button_layout.addWidget(self.notes_btn)
        
        self.refresh_btn = QPushButton("🔄 Refresh")
        self.refresh_btn.clicked.connect(self.load_data)
        self.refresh_btn.setMinimumHeight(40)
        button_layout.addWidget(self.refresh_btn)
        
        main_layout.addLayout(button_layout)
        
        # Status bar
        self.status_label = QLabel("Ready")
        self.status_label.setStyleSheet("""
            padding: 10px; 
            background-color: #2d2d2d; 
            border: 1px solid #3e3e3e;
            border-radius: 5px;
            color: #e0e0e0;
        """)
        main_layout.addWidget(self.status_label)
        
        # Close button
        close_btn = QPushButton("Close")
        close_btn.clicked.connect(self.close)
        close_btn.setStyleSheet("""
            QPushButton {
                background-color: #3e3e3e;
                color: #e0e0e0;
            }
            QPushButton:hover {
                background-color: #4e4e4e;
            }
        """)
        main_layout.addWidget(close_btn)
    
    def load_data(self):
        """Load ratios and current assignments from Excel"""
        try:
            self.status_label.setText("Loading data...")
            
            # Load ratios from config
            self.ratios = get_ratios_from_config()
            
            if not self.ratios:
                self.status_label.setText("⚠️ No ratios found. Create ratios first using Ratio Maker.")
                return
            
            # Connect to Excel
            try:
                self.wb = xw.Book.caller()
            except:
                if DASHBOARD_PATH.exists():
                    app = xw.App(visible=True)
                    self.wb = app.books.open(DASHBOARD_PATH)
                else:
                    raise FileNotFoundError("Excel dashboard not found")
            
            # Get or create Ratios sheet
            try:
                self.ws = self.wb.sheets[RATIOS_SHEET]
            except:
                self.ws = self.wb.sheets.add(RATIOS_SHEET)
                self._setup_sheet_structure()
            
            # Read current assignments from Row 4
            self.assignments = {}
            row4_data = self.ws.range("B4:Z4").value
            
            if row4_data:
                for idx, value in enumerate(row4_data):
                    if value and value in self.ratios:
                        col_letter = chr(66 + idx)  # B=66, C=67, etc.
                        self.assignments[col_letter] = value
            
            # Update UI list
            self.update_ratio_list()
            
            self.status_label.setText(f"✓ Loaded {len(self.ratios)} ratios, {len(self.assignments)} assigned")
            
        except Exception as e:
            self.status_label.setText(f"❌ Error loading data: {str(e)}")
            QMessageBox.critical(self, "Error", f"Failed to load data:\n{str(e)}")
    
    def _setup_sheet_structure(self):
        """Initialize the Ratios sheet structure"""
        # Row 1: Title
        self.ws.range("A1").value = "Financial Ratios"
        self.ws.range("A1").font.size = 14
        self.ws.range("A1").font.bold = True
        
        # Row 4: Headers
        self.ws.range("A4").value = "Ticker"
        self.ws.range("A4").font.bold = True
        
        # Row 5: Action indicators
        self.ws.range("A5").value = "↻ Refresh"
        self.ws.range("A5").font.bold = True
        self.ws.range("A5").color = (200, 230, 201)  # Light green
    
    def update_ratio_list(self):
        """Update the ratio list with assignment status"""
        self.ratio_list.clear()
        
        # Get reverse mapping (ratio_name -> column)
        ratio_to_col = {v: k for k, v in self.assignments.items()}
        
        for ratio_name in sorted(self.ratios.keys()):
            if ratio_name in ratio_to_col:
                col = ratio_to_col[ratio_name]
                item_text = f"✓ {ratio_name} → Column {col}"
                item = QListWidgetItem(item_text)
                item.setForeground(Qt.green)  # Bright green for dark theme
            else:
                item_text = f"✗ {ratio_name} (Not assigned)"
                item = QListWidgetItem(item_text)
                item.setForeground(Qt.gray)  # Gray for dark theme
            
            item.setData(Qt.UserRole, ratio_name)  # Store actual ratio name
            self.ratio_list.addItem(item)
    
    def assign_ratio(self):
        """Assign selected ratio to a column"""
        current_item = self.ratio_list.currentItem()
        if not current_item:
            QMessageBox.warning(self, "No Selection", "Please select a ratio to assign.")
            return
        
        ratio_name = current_item.data(Qt.UserRole)
        
        # Check if already assigned
        ratio_to_col = {v: k for k, v in self.assignments.items()}
        if ratio_name in ratio_to_col:
            QMessageBox.information(
                self, 
                "Already Assigned", 
                f"'{ratio_name}' is already assigned to column {ratio_to_col[ratio_name]}.\n\n"
                "Unassign it first if you want to move it to a different column."
            )
            return
        
        # Ask for column
        col_letter, ok = QInputDialog.getText(
            self,
            "Assign to Column",
            f"Enter column letter to assign '{ratio_name}':\n(B, C, D, E, etc.)",
            text="B"
        )
        
        if not ok or not col_letter:
            return
        
        col_letter = col_letter.strip().upper()
        
        # Validate column
        if len(col_letter) != 1 or col_letter < 'B':
            QMessageBox.warning(self, "Invalid Column", "Column must be B or later (B, C, D, etc.)")
            return
        
        # Check if column is already used
        if col_letter in self.assignments:
            QMessageBox.warning(
                self,
                "Column In Use",
                f"Column {col_letter} is already assigned to '{self.assignments[col_letter]}'.\n\n"
                "Choose a different column or unassign the existing ratio first."
            )
            return
        
        # Assign to Excel
        try:
            # Write ratio name to Row 4
            self.ws.range(f"{col_letter}4").value = ratio_name
            self.ws.range(f"{col_letter}4").font.bold = True
            self.ws.range(f"{col_letter}4").color = (217, 234, 211)  # Light green
            
            # Write unassign indicator to Row 5
            self.ws.range(f"{col_letter}5").value = "✕ Unassign"
            self.ws.range(f"{col_letter}5").color = (255, 205, 210)  # Light red
            self.ws.range(f"{col_letter}5").font.bold = True
            
            # Save
            self.wb.save()
            
            # Update internal state
            self.assignments[col_letter] = ratio_name
            self.update_ratio_list()
            
            self.status_label.setText(f"✓ Assigned '{ratio_name}' to column {col_letter}")
            QMessageBox.information(self, "Success", f"✓ '{ratio_name}' assigned to column {col_letter}")
            
        except Exception as e:
            self.status_label.setText(f"❌ Assignment failed: {str(e)}")
            QMessageBox.critical(self, "Error", f"Failed to assign ratio:\n{str(e)}")
    
    def view_notes(self):
        """View notes for selected ratio"""
        current_item = self.ratio_list.currentItem()
        if not current_item:
            QMessageBox.warning(self, "No Selection", "Please select a ratio to view notes.")
            return
        
        ratio_name = current_item.data(Qt.UserRole)
        ratio_data = self.ratios.get(ratio_name, {})
        notes = ratio_data.get('notes', '')
        
        dialog = NotesDialog(ratio_name, notes, self)
        dialog.exec()


def launch_ratio_manager():
    """Launch the Ratio Manager UI"""
    app = QApplication.instance() or QApplication(sys.argv)
    
    # Apply global dark theme for dialogs
    app.setStyleSheet("""
        QMessageBox {
            background-color: #2d2d2d;
        }
        QMessageBox QLabel {
            color: #e0e0e0;
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
        QMessageBox QPushButton:hover {
            background-color: #14a085;
        }
        QInputDialog {
            background-color: #2d2d2d;
        }
        QInputDialog QLabel {
            color: #e0e0e0;
        }
        QInputDialog QLineEdit {
            background-color: #1e1e1e;
            color: #e0e0e0;
            border: 1px solid #3e3e3e;
            border-radius: 3px;
            padding: 5px;
        }
        QInputDialog QPushButton {
            background-color: #0d7377;
            color: #ffffff;
            border: none;
            border-radius: 5px;
            padding: 8px 16px;
            min-width: 80px;
            font-weight: bold;
        }
        QInputDialog QPushButton:hover {
            background-color: #14a085;
        }
    """)
    
    window = RatioManagerUI()
    window.show()
    app.exec()


# xlwings callable function
@xw.sub
def open_ratio_manager():
    """Excel-callable function to open ratio manager"""
    launch_ratio_manager()


if __name__ == "__main__":
    launch_ratio_manager()
