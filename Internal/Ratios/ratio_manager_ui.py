"""
Ratio Manager UI - Assignment and Management System

This module provides a comprehensive UI for managing ratio assignments in Excel.
All functionality is in Python for reliability and maintainability.

Features:
- View all created ratios with their sheet status
- Add ratios to Column A (like BS/IS line items)
- Remove ratios from Column A
- Set ticker symbol in Row 4 (like BS/IS)
- View ratio notes
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
RATIO_DATA_START_ROW = 7  # Matching BS/IS layout


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
        self.sheet_ratios = []   # Ratio names currently in Column A
        self.sheet_tickers = []  # Tickers from Row 4  [(col_letter, ticker)]
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
        info = QLabel("Manage which ratios appear in Column A (like BS/IS line items)")
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
        
        # Buttons - Row 1
        button_layout = QHBoxLayout()
        button_layout.setSpacing(10)
        
        self.add_btn = QPushButton("➕ Add to Sheet (Column A)")
        self.add_btn.clicked.connect(self.add_ratio_to_sheet)
        self.add_btn.setMinimumHeight(40)
        button_layout.addWidget(self.add_btn)
        
        self.remove_btn = QPushButton("➖ Remove from Sheet")
        self.remove_btn.clicked.connect(self.remove_ratio_from_sheet)
        self.remove_btn.setMinimumHeight(40)
        button_layout.addWidget(self.remove_btn)
        
        main_layout.addLayout(button_layout)
        
        # Buttons - Row 2
        button_layout2 = QHBoxLayout()
        button_layout2.setSpacing(10)
        
        self.ticker_btn = QPushButton("📌 Set Ticker (Row 4)")
        self.ticker_btn.clicked.connect(self.set_ticker)
        self.ticker_btn.setMinimumHeight(40)
        button_layout2.addWidget(self.ticker_btn)
        
        self.notes_btn = QPushButton("📝 View Notes")
        self.notes_btn.clicked.connect(self.view_notes)
        self.notes_btn.setMinimumHeight(40)
        button_layout2.addWidget(self.notes_btn)
        
        self.refresh_btn = QPushButton("🔄 Refresh")
        self.refresh_btn.clicked.connect(self.load_data)
        self.refresh_btn.setMinimumHeight(40)
        button_layout2.addWidget(self.refresh_btn)
        
        main_layout.addLayout(button_layout2)
        
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
        """Load ratios and current sheet state from Excel"""
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
            
            # Read assigned ratios from Column A (row 7+)
            self.sheet_ratios = []
            col_a_data = self.ws.range(f"A{RATIO_DATA_START_ROW}:A200").value
            if col_a_data:
                for item in col_a_data:
                    if item and isinstance(item, str) and item.strip() in self.ratios:
                        self.sheet_ratios.append(item.strip())
            
            # Read tickers from Row 4 (columns B-Z)
            self.sheet_tickers = []
            row4_data = self.ws.range("B4:Z4").value
            if row4_data:
                for idx, value in enumerate(row4_data):
                    if value and isinstance(value, str):
                        ticker = value.strip().upper()
                        if ticker and ticker not in ("INDEX", "CUSTOM", ""):
                            col_letter = chr(66 + idx)
                            self.sheet_tickers.append((col_letter, ticker))
            
            # Update UI list
            self.update_ratio_list()
            
            ticker_str = ", ".join(t for _, t in self.sheet_tickers) if self.sheet_tickers else "None"
            self.status_label.setText(
                f"✓ Loaded {len(self.ratios)} ratios, "
                f"{len(self.sheet_ratios)} in Column A, "
                f"Ticker(s): {ticker_str}"
            )
            
        except Exception as e:
            self.status_label.setText(f"❌ Error loading data: {str(e)}")
            QMessageBox.critical(self, "Error", f"Failed to load data:\n{str(e)}")
    
    def _setup_sheet_structure(self):
        """Initialize the Ratios sheet structure (matching BS/IS layout)"""
        # Row 1: Title
        self.ws.range("A1").value = "Financial Ratios"
        self.ws.range("A1").font.size = 14
        self.ws.range("A1").font.bold = True
        
        # Row 4: Ticker label + ticker input
        self.ws.range("A4").value = "Ticker"
        self.ws.range("A4").font.bold = True
        
        # Row 5: Reserved for date (like BS/IS)
        self.ws.range("B5:Z5").clear_contents()
    
    def update_ratio_list(self):
        """Update the ratio list showing which ratios are in Column A"""
        self.ratio_list.clear()
        
        sheet_ratio_set = set(self.sheet_ratios)
        
        for ratio_name in sorted(self.ratios.keys()):
            if ratio_name in sheet_ratio_set:
                item_text = f"✓ {ratio_name} (In Column A)"
                item = QListWidgetItem(item_text)
                item.setForeground(Qt.green)
            else:
                item_text = f"✗ {ratio_name} (Not on sheet)"
                item = QListWidgetItem(item_text)
                item.setForeground(Qt.gray)
            
            item.setData(Qt.UserRole, ratio_name)
            self.ratio_list.addItem(item)
    
    def add_ratio_to_sheet(self):
        """Add selected ratio to Column A of the Ratios sheet"""
        current_item = self.ratio_list.currentItem()
        if not current_item:
            QMessageBox.warning(self, "No Selection", "Please select a ratio to add.")
            return
        
        ratio_name = current_item.data(Qt.UserRole)
        
        # Check if already in Column A
        if ratio_name in self.sheet_ratios:
            QMessageBox.information(
                self, 
                "Already on Sheet", 
                f"'{ratio_name}' is already in Column A."
            )
            return
        
        try:
            # Find the next empty row in Column A
            next_row = RATIO_DATA_START_ROW + len(self.sheet_ratios)
            
            # Write ratio name to Column A
            self.ws.range(f"A{next_row}").value = ratio_name
            self.ws.range(f"A{next_row}").font.bold = True
            
            self.wb.save()
            
            # Update internal state
            self.sheet_ratios.append(ratio_name)
            self.update_ratio_list()
            
            self.status_label.setText(f"✓ Added '{ratio_name}' to Column A (row {next_row})")
            
        except Exception as e:
            self.status_label.setText(f"❌ Failed to add: {str(e)}")
            QMessageBox.critical(self, "Error", f"Failed to add ratio:\n{str(e)}")
    
    def remove_ratio_from_sheet(self):
        """Remove selected ratio from Column A of the Ratios sheet"""
        current_item = self.ratio_list.currentItem()
        if not current_item:
            QMessageBox.warning(self, "No Selection", "Please select a ratio to remove.")
            return
        
        ratio_name = current_item.data(Qt.UserRole)
        
        # Check if in Column A
        if ratio_name not in self.sheet_ratios:
            QMessageBox.information(
                self, 
                "Not on Sheet", 
                f"'{ratio_name}' is not in Column A."
            )
            return
        
        reply = QMessageBox.question(
            self, "Confirm Remove",
            f"Remove '{ratio_name}' from Column A?\n\n"
            "This will delete the row and shift remaining ratios up.",
            QMessageBox.Yes | QMessageBox.No
        )
        
        if reply != QMessageBox.Yes:
            return
        
        try:
            # Find the row index of this ratio in Column A
            idx = self.sheet_ratios.index(ratio_name)
            row = RATIO_DATA_START_ROW + idx
            
            # Clear the row data (all columns)
            clear_range = self.ws.range(f"A{row}:Z{row}")
            clear_range.clear_contents()
            
            # Shift rows below up by one (if not the last)
            col_a_data = self.ws.range(f"A{RATIO_DATA_START_ROW}:A200").value
            if col_a_data and idx < len(col_a_data) - 1:
                for shift_idx in range(idx, len(self.sheet_ratios) - 1):
                    src_row = RATIO_DATA_START_ROW + shift_idx + 1
                    dst_row = RATIO_DATA_START_ROW + shift_idx
                    # Copy ratio name
                    src_name = self.ws.range(f"A{src_row}").value
                    self.ws.range(f"A{dst_row}").value = src_name
                    if src_name:
                        self.ws.range(f"A{dst_row}").font.bold = True
                    # Clear source
                    self.ws.range(f"A{src_row}").clear_contents()
            
            self.wb.save()
            
            # Update internal state
            self.sheet_ratios.remove(ratio_name)
            self.update_ratio_list()
            
            self.status_label.setText(f"✓ Removed '{ratio_name}' from Column A")
            
        except Exception as e:
            self.status_label.setText(f"❌ Failed to remove: {str(e)}")
            QMessageBox.critical(self, "Error", f"Failed to remove ratio:\n{str(e)}")
    
    def set_ticker(self):
        """Set a ticker symbol in Row 4 (like BS/IS)"""
        current_tickers = ", ".join(t for _, t in self.sheet_tickers) if self.sheet_tickers else "None"
        
        ticker, ok = QInputDialog.getText(
            self,
            "Set Ticker",
            f"Current ticker(s): {current_tickers}\n\n"
            "Enter ticker symbol to place in B4:\n"
            "(Leave empty to clear, or enter multiple comma-separated)",
            text=self.sheet_tickers[0][1] if self.sheet_tickers else ""
        )
        
        if not ok:
            return
        
        try:
            tickers_list = [t.strip().upper() for t in ticker.split(",") if t.strip()] if ticker.strip() else []
            
            # Clear old tickers from Row 4
            self.ws.range("B4:Z4").clear_contents()
            
            # Write new tickers
            for idx, t in enumerate(tickers_list):
                col_letter = chr(66 + idx)  # B=66
                self.ws.range(f"{col_letter}4").value = t
                self.ws.range(f"{col_letter}4").font.bold = True
                self.ws.range(f"{col_letter}4").color = (217, 234, 211)  # Light green
            
            self.wb.save()
            
            # Reload to refresh state
            self.load_data()
            
            self.status_label.setText(f"✓ Set ticker(s): {', '.join(tickers_list) if tickers_list else 'None'}")
            
        except Exception as e:
            self.status_label.setText(f"❌ Failed to set ticker: {str(e)}")
            QMessageBox.critical(self, "Error", f"Failed to set ticker:\n{str(e)}")
    
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
