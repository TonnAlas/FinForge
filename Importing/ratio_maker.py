import sys
import json
import re
from pathlib import Path
from PySide6.QtWidgets import (QApplication, QMainWindow, QPushButton, QVBoxLayout, 
                             QWidget, QDialog, QLineEdit, QComboBox, QHBoxLayout, 
                             QLabel, QTextEdit, QScrollArea, QSpinBox, QGridLayout,
                             QCheckBox, QFrame)
from PySide6.QtCore import Qt, Signal, QSize
from PySide6.QtGui import QSyntaxHighlighter, QTextCharFormat, QColor, QFont, QPainter, QPen
import pandas as pd
from datetime import datetime, timedelta
import xlwings as xw

# Make the repo root importable so the shared formula engine can be imported
# even when this module is launched standalone (`python Importing/ratio_maker.py`).
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from Internal.Ratios.formula_resolver import eval_ast, parse_formula_ast, resolve_latest

# Configuration
CONFIG_FILE = Path(__file__).parent / "ratio_config.json"
DATA_DIR = Path(__file__).parent.parent / "data"
FUNDAMENTALS_DIR = DATA_DIR / "fundamentals"
PRICES_DIR = DATA_DIR / "prices"
TICKERS_FILE = Path(__file__).parent.parent / "data" / "tickers.json"


class FormulaHighlighter(QSyntaxHighlighter):
    """Syntax highlighter for financial formulas with VS Code-style colors"""
    
    def __init__(self, parent, available_fields):
        super().__init__(parent)
        self.available_fields = available_fields
        self.setup_formats()
    
    def setup_formats(self):
        """Setup text formats for different syntax elements"""
        
        # Operators: Orange (#FF9800)
        self.operator_format = QTextCharFormat()
        self.operator_format.setForeground(QColor("#FF9800"))
        self.operator_format.setFontWeight(QFont.Weight.Bold)
        
        # Brackets: Yellow (#FFD700)
        self.bracket_format = QTextCharFormat()
        self.bracket_format.setForeground(QColor("#FFD700"))
        self.bracket_format.setFontWeight(QFont.Weight.Bold)
        
        # P: items (Price): Purple (#CE93D8)
        self.price_format = QTextCharFormat()
        self.price_format.setForeground(QColor("#CE93D8"))
        
        # BS: items (Balance Sheet): Light Blue (#81D4FA)
        self.balance_sheet_format = QTextCharFormat()
        self.balance_sheet_format.setForeground(QColor("#81D4FA"))
        
        # IS: items (Income Statement): Green (#81C784)
        self.income_statement_format = QTextCharFormat()
        self.income_statement_format.setForeground(QColor("#81C784"))
        
        # RATIO: items (Existing Ratios): Gold (#FFD700)
        self.ratio_format = QTextCharFormat()
        self.ratio_format.setForeground(QColor("#FFD700"))
        self.ratio_format.setFontWeight(QFont.Weight.Bold)
        
        # Advanced Functions: Yellow-Orange (#FFC107)
        self.function_format = QTextCharFormat()
        self.function_format.setForeground(QColor("#FFC107"))
        self.function_format.setFontWeight(QFont.Weight.Bold)
        
        # Error: Red (#F44336)
        self.error_format = QTextCharFormat()
        self.error_format.setForeground(QColor("#F44336"))
        self.error_format.setUnderlineStyle(QTextCharFormat.UnderlineStyle.WaveUnderline)
        self.error_format.setUnderlineColor(QColor("#F44336"))
        
        # Numbers: Light Blue (#90CAF9)
        self.number_format = QTextCharFormat()
        self.number_format.setForeground(QColor("#90CAF9"))
    
    def highlightBlock(self, text):
        """Apply syntax highlighting to a block of text"""
        if not text.strip():
            return
        
        # Track which characters have been highlighted to avoid overlaps
        highlighted = [False] * len(text)
        
        # 1. Highlight equals sign at the beginning (formula marker)
        if text.strip().startswith('='):
            equals_match = re.match(r'^\s*=', text)
            if equals_match:
                start, end = equals_match.span()
                self.setFormat(start, end - start, self.operator_format)
                highlighted[start:end] = [True] * (end - start)
        
        # 2. Highlight operators (+, -, *, /)
        operator_pattern = r'[+\-*/]'
        for match in re.finditer(operator_pattern, text):
            start, end = match.span()
            if not any(highlighted[start:end]):
                self.setFormat(start, end - start, self.operator_format)
                highlighted[start:end] = [True] * (end - start)
        
        # 3. Highlight brackets
        bracket_pattern = r'[()]'
        for match in re.finditer(bracket_pattern, text):
            start, end = match.span()
            if not any(highlighted[start:end]):
                self.setFormat(start, end - start, self.bracket_format)
                highlighted[start:end] = [True] * (end - start)
        
        # 4. Highlight valid financial fields
        for field in sorted(self.available_fields, key=len, reverse=True):
            # Escape special regex characters in field name
            escaped_field = re.escape(field)
            pattern = r'\b' + escaped_field + r'\b'
            
            for match in re.finditer(pattern, text, re.IGNORECASE):
                start, end = match.span()
                if not any(highlighted[start:end]):
                    # Choose format based on prefix
                    if field.startswith('P:'):
                        format_to_use = self.price_format
                    elif field.startswith('BS:'):
                        format_to_use = self.balance_sheet_format
                    elif field.startswith('IS:'):
                        format_to_use = self.income_statement_format
                    elif field.startswith('METRIC:') or field.startswith('RATIO:'):
                        format_to_use = self.ratio_format
                    else:
                        continue  # Unknown prefix, skip
                    
                    self.setFormat(start, end - start, format_to_use)
                    highlighted[start:end] = [True] * (end - start)
        
        # 5. Highlight advanced functions (AVERAGE, SUM, MAX, MIN, etc.)
        function_pattern = r'\b(AVERAGE|SUM|MAX|MIN|MEDIAN|STDEV|VAR|COUNT|GROWTH_RATE)\b'
        for match in re.finditer(function_pattern, text, re.IGNORECASE):
            start, end = match.span()
            if not any(highlighted[start:end]):
                self.setFormat(start, end - start, self.function_format)
                highlighted[start:end] = [True] * (end - start)
        
        # 6. Highlight numbers
        number_pattern = r'\b\d+\.?\d*\b'
        for match in re.finditer(number_pattern, text):
            start, end = match.span()
            if not any(highlighted[start:end]):
                self.setFormat(start, end - start, self.number_format)
                highlighted[start:end] = [True] * (end - start)
        
        # 7. Highlight price fields that may not be in available_fields (e.g., P: Close Price [Q0])
        # Match pattern: P: followed by text (letters/spaces), stopping at comma, paren, or bracket
        # This handles fields inside function calls like AVERAGE(P: Low Price, 50 periods)
        price_pattern = r'P:\s+[A-Za-z][A-Za-z\s]*(?:\s*\[[^\]]+\])?'
        for match in re.finditer(price_pattern, text):
            start, end = match.span()
            # Trim trailing spaces from match
            matched_text = text[start:end].rstrip()
            end = start + len(matched_text)
            if not all(highlighted[start:end]):
                self.setFormat(start, end - start, self.price_format)
                highlighted[start:end] = [True] * (end - start)
        
        # 8. Error detection - find invalid tokens (non-whitespace that wasn't highlighted)
        # Split by valid separators and check each token
        tokens = re.finditer(r'\S+', text)
        
        # Common words used in field names that should not be flagged as errors
        valid_field_words = {
            'price', 'high', 'low', 'open', 'close', 'volume', 'closing', 'opening',
            'adjusted', 'adj', 'dividends', 'splits', 'stock', 'market', 'cap',
            'week', 'average', 'previous', 'day', 'change', 'percent',
            'periods', 'periods)'  # For function syntax
        }
        
        for token_match in tokens:
            start, end = token_match.span()
            token = token_match.group()
            
            # Check if this entire token is unhighlighted
            if not all(highlighted[start:end]):
                # Remove trailing punctuation for checking
                token_clean = token.rstrip('(),')
                
                # Check if it's a valid field, operator, bracket, number, function, or part of price field
                is_valid = (
                    token in self.available_fields or
                    token_clean.lower() in valid_field_words or
                    re.fullmatch(r'[=+\-*/(),]', token) or
                    re.fullmatch(r'\d+\.?\d*', token) or
                    re.fullmatch(r'(AVERAGE|SUM|MAX|MIN|MEDIAN|STDEV|VAR|COUNT|GROWTH_RATE)', token, re.IGNORECASE) or
                    token in ['P:', 'IS:', 'BS:', 'RATIO:', 'METRIC:'] or  # Prefixes alone
                    re.match(r'[\[\]-]', token) or  # Brackets and dashes used in date references
                    re.match(r'\d+[DWM]', token)  # Rolling date suffixes like 15D, 3W, 2M
                )
                
                if not is_valid:
                    # Mark as error
                    self.setFormat(start, end - start, self.error_format)
                    highlighted[start:end] = [True] * (end - start)


# Configuration
CONFIG_FILE = Path(__file__).parent / "ratio_config.json"
DASHBOARD_PATH = Path(__file__).parent.parent / "FinForge.xlsm"
METRICS_SHEET_NAME = "Metrics"          # canonical sheet name (renamed from "Ratios")
LEGACY_RATIOS_SHEET_NAME = "Ratios"     # pre-rename sheet name, kept for backward compatibility

class StockPriceDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.init_ui()
        
    def init_ui(self):
        self.setWindowTitle('Stock Price Selection')
        self.setMinimumSize(500, 450)
        
        # Apply dark theme styling
        self.setStyleSheet("""
            QDialog {
                background-color: #121212;
                color: #E0E0E0;
            }
            QLabel {
                color: #E0E0E0;
                font-size: 12px;
                font-weight: bold;
                margin: 3px;
            }
            QComboBox, QLineEdit {
                background-color: #1E1E1E;
                color: #E0E0E0;
                border: 1px solid #2C2C2C;
                border-radius: 6px;
                padding: 8px;
                font-size: 11px;
                margin: 2px;
                min-width: 120px;
            }
            QComboBox:focus, QLineEdit:focus {
                border-color: #29B6F6;
            }
            QPushButton {
                background-color: #1E1E1E;
                color: #E0E0E0;
                border: 1px solid #29B6F6;
                padding: 8px;
                font-size: 11px;
                font-weight: bold;
                border-radius: 6px;
                margin: 2px;
                min-height: 20px;
            }
            QPushButton:hover {
                background-color: #2C2C2C;
                border-color: #1E88E5;
            }
            QPushButton:pressed {
                background-color: #29B6F6;
                border-color: #1565C0;
            }
            QTextEdit {
                background-color: #1E1E1E;
                color: #E0E0E0;
                border: 1px solid #2C2C2C;
                border-radius: 6px;
                padding: 8px;
                font-size: 11px;
                margin: 2px;
            }
            QTextEdit:focus {
                border-color: #29B6F6;
            }
        """)
        
        layout = QVBoxLayout()
        
        # Price type selection
        price_layout = QGridLayout()
        price_layout.addWidget(QLabel('Price Type:'), 0, 0)
        self.price_type_combo = QComboBox()
        self.price_type_combo.addItems([
            'Close Price',
            'Open Price',
            'High Price',
            'Low Price',
            'Volume',
            'Dividends',
            'Stock Splits',
            '--- Calculated ---',
            'Change',
            'Change Percent'
        ])
        price_layout.addWidget(self.price_type_combo, 0, 1)
        
        # Date reference selection
        price_layout.addWidget(QLabel('Date Reference:'), 1, 0)
        self.date_ref_combo = QComboBox()
        self.date_ref_combo.addItems([
            'Current/Latest',
            'Days Ago'
        ])
        self.date_ref_combo.currentTextChanged.connect(self.on_date_ref_changed)
        price_layout.addWidget(self.date_ref_combo, 1, 1)
        
        # Rolling period input (hidden initially)
        self.rolling_period_label = QLabel('Time Period:')
        price_layout.addWidget(self.rolling_period_label, 3, 0)
        self.rolling_period_spin = QSpinBox()
        self.rolling_period_spin.setMinimum(1)
        self.rolling_period_spin.setMaximum(365)
        self.rolling_period_spin.setValue(15)
        price_layout.addWidget(self.rolling_period_spin, 3, 1)
        
        # Hide rolling period initially
        self.rolling_period_label.hide()
        self.rolling_period_spin.hide()
        
        layout.addLayout(price_layout)
        
        # Preview section
        layout.addWidget(QLabel('Price Field Preview:'))
        self.preview_text = QTextEdit()
        self.preview_text.setMaximumHeight(100)
        self.preview_text.setReadOnly(True)
        layout.addWidget(self.preview_text)
        
        # Update preview when selections change
        self.price_type_combo.currentTextChanged.connect(self.update_preview)
        self.date_ref_combo.currentTextChanged.connect(self.update_preview)
        self.rolling_period_spin.valueChanged.connect(self.update_preview)
        
        # Buttons
        button_layout = QHBoxLayout()
        self.insert_btn = QPushButton('Insert Price Field')
        self.insert_btn.clicked.connect(self.accept)
        self.cancel_btn = QPushButton('Cancel')
        self.cancel_btn.clicked.connect(self.reject)
        button_layout.addWidget(self.insert_btn)
        button_layout.addWidget(self.cancel_btn)
        layout.addLayout(button_layout)
        
        self.setLayout(layout)
        
        # Connect price type change to handle calculated fields
        self.price_type_combo.currentTextChanged.connect(self.on_price_type_changed)
        self.update_preview()
    
    def on_price_type_changed(self):
        """Handle price type changes - auto-switch to Days Ago for calculated fields"""
        price_type = self.price_type_combo.currentText()
        
        # Skip separator
        if price_type == '--- Calculated ---':
            self.price_type_combo.setCurrentIndex(0)
            return
        
        # For Change/Change Percent, auto-switch to Days Ago since they need a period
        if price_type in ['Change', 'Change Percent']:
            if self.date_ref_combo.currentText() != 'Days Ago':
                self.date_ref_combo.setCurrentText('Days Ago')
        
        self.update_preview()
    
    def on_date_ref_changed(self):
        date_ref = self.date_ref_combo.currentText()
        
        # Hide rolling period initially
        self.rolling_period_label.hide()
        self.rolling_period_spin.hide()
        
        # Show rolling period input for "Days Ago"
        if date_ref == 'Days Ago':
            self.rolling_period_label.setText('Days Ago:')
            self.rolling_period_label.show()
            self.rolling_period_spin.setMaximum(365)
            self.rolling_period_spin.show()
        
        self.update_preview()
    
    def update_preview(self):
        price_type = self.price_type_combo.currentText()
        date_ref = self.date_ref_combo.currentText()
        
        # Skip separator
        if price_type == '--- Calculated ---':
            self.preview_text.setPlainText("")
            return
        
        # Build the price field string
        if date_ref == 'Days Ago':
            period_value = self.rolling_period_spin.value()
            preview = f"P: {price_type} [-{period_value}D]"
        else:
            # Current/Latest - no date modifier
            preview = f"P: {price_type}"
        
        self.preview_text.setPlainText(preview)
    
    def get_price_field(self):
        return self.preview_text.toPlainText()


class NotesDialog(QDialog):
    def __init__(self, parent=None, initial_notes=""):
        super().__init__(parent)
        self.setWindowTitle('Ratio Notes')
        self.setGeometry(100, 100, 400, 300)
        
        # Apply dark theme
        self.setStyleSheet("""
            QDialog {
                background-color: #121212;
                color: #E0E0E0;
                border: 1px solid #2C2C2C;
            }
            QLabel {
                color: #E0E0E0;
                font-size: 11px;
                font-weight: bold;
                margin: 5px;
            }
            QTextEdit {
                background-color: #1E1E1E;
                color: #E0E0E0;
                border: 1px solid #2C2C2C;
                border-radius: 6px;
                padding: 8px;
                font-size: 11px;
                font-family: Segoe UI, Arial, sans-serif;
            }
            QTextEdit:focus {
                border-color: #29B6F6;
            }
            QPushButton {
                background-color: #1E1E1E;
                color: #E0E0E0;
                border: 1px solid #29B6F6;
                padding: 8px;
                font-size: 11px;
                font-weight: bold;
                border-radius: 6px;
                margin: 2px;
                min-height: 20px;
                min-width: 70px;
            }
            QPushButton:hover {
                background-color: #2C2C2C;
                border-color: #64B5F6;
            }
            QPushButton:pressed {
                background-color: #29B6F6;
                color: #121212;
                border-color: #1976D2;
            }
        """)
        
        layout = QVBoxLayout()
        
        # Notes label
        layout.addWidget(QLabel('Notes for this ratio:'))
        
        # Notes text area
        self.notes_edit = QTextEdit()
        self.notes_edit.setPlainText(initial_notes)
        self.notes_edit.setPlaceholderText("Enter any notes, explanations, or comments about this ratio...")
        layout.addWidget(self.notes_edit)
        
        # Buttons
        button_layout = QHBoxLayout()
        save_btn = QPushButton('Save')
        save_btn.setStyleSheet("""
            QPushButton {
                background-color: #1E1E1E;
                color: #4CAF50;
                border: 1px solid #4CAF50;
                padding: 8px;
                font-size: 11px;
                font-weight: bold;
                border-radius: 6px;
                margin: 2px;
                min-height: 20px;
                min-width: 70px;
            }
            QPushButton:hover {
                background-color: #2C2C2C;
                border-color: #66BB6A;
            }
            QPushButton:pressed {
                background-color: #4CAF50;
                color: #121212;
                border-color: #388E3C;
            }
        """)
        save_btn.clicked.connect(self.accept)
        cancel_btn = QPushButton('Cancel')
        cancel_btn.clicked.connect(self.reject)
        
        button_layout.addWidget(save_btn)
        button_layout.addWidget(cancel_btn)
        layout.addLayout(button_layout)
        
        self.setLayout(layout)
    
    def get_notes(self):
        return self.notes_edit.toPlainText().strip()

class FormulaBuilderDialog(QDialog):
    def __init__(self, available_fields, parent=None):
        super().__init__(parent)
        self.available_fields = sorted(available_fields)
        self.notes = ""  # Store notes for this ratio
        self.init_ui()
        
    def init_ui(self):
        self.setWindowTitle('Create New Ratio')
        self.setMinimumWidth(700)  # Wider for horizontal layout
        
        # Apply dark theme styling
        self.setStyleSheet("""
            QDialog {
                background-color: #121212;
                color: #E0E0E0;
            }
            QLabel {
                color: #E0E0E0;
                font-size: 12px;
                font-weight: bold;
                margin: 3px;
            }
            QLineEdit {
                background-color: #1E1E1E;
                color: #E0E0E0;
                border: 1px solid #2C2C2C;
                border-radius: 6px;
                padding: 8px;
                font-size: 11px;
                margin: 2px;
            }
            QLineEdit:focus {
                border-color: #29B6F6;
            }
            QComboBox {
                background-color: #1E1E1E;
                color: #E0E0E0;
                border: 1px solid #2C2C2C;
                border-radius: 6px;
                padding: 8px;
                font-size: 11px;
                margin: 2px;
                min-width: 150px;
            }
            QComboBox:focus {
                border-color: #29B6F6;
            }
            QComboBox::drop-down {
                border: none;
                background-color: #29B6F6;
                border-top-right-radius: 6px;
                border-bottom-right-radius: 6px;
            }
            QComboBox::down-arrow {
                border: none;
            }
            QPushButton {
                background-color: #1E1E1E;
                color: #E0E0E0;
                border: 1px solid #29B6F6;
                padding: 8px;
                font-size: 11px;
                font-weight: bold;
                border-radius: 6px;
                margin: 2px;
                min-height: 20px;
            }
            QPushButton:hover {
                background-color: #2C2C2C;
                border-color: #1E88E5;
            }
            QPushButton:pressed {
                background-color: #29B6F6;
                border-color: #1565C0;
            }
            QTextEdit {
                background-color: #1E1E1E;
                color: #E0E0E0;
                border: 1px solid #2C2C2C;
                border-radius: 6px;
                padding: 8px;
                font-size: 12px;
                font-family: 'Consolas', 'Courier New', monospace;
                margin: 2px;
            }
            QTextEdit:focus {
                border-color: #29B6F6;
            }
            QCheckBox {
                color: #E0E0E0;
                font-size: 11px;
                spacing: 8px;
            }
            QCheckBox::indicator {
                width: 18px;
                height: 18px;
                border-radius: 4px;
                border: 2px solid #29B6F6;
                background-color: #1E1E1E;
            }
            QCheckBox::indicator:checked {
                background-color: #29B6F6;
                border-color: #29B6F6;
            }
            QCheckBox::indicator:hover {
                border-color: #64B5F6;
            }
        """)
        
        layout = QVBoxLayout()
        
        # Top row: Ratio name and Financial Item selector in one horizontal line
        top_row_layout = QHBoxLayout()
        
        # Ratio name input
        top_row_layout.addWidget(QLabel('Ratio Name:'))
        self.name_input = QLineEdit()
        self.name_input.setMinimumWidth(200)
        top_row_layout.addWidget(self.name_input)
        
        top_row_layout.addSpacing(20)  # Add some spacing
        
        # Field selector
        top_row_layout.addWidget(QLabel('Financial Item:'))
        self.field_selector = QComboBox()
        self.field_selector.setEditable(True)
        self.field_selector.addItems(self.available_fields)
        self.field_selector.setInsertPolicy(QComboBox.InsertPolicy.NoInsert)
        self.field_selector.setMinimumWidth(200)
        
        # Enable filtering/search in the combobox
        self.field_selector.setMaxVisibleItems(15)  # Show more items in dropdown
        self.field_selector.completer().setCompletionMode(self.field_selector.completer().CompletionMode.PopupCompletion)
        self.field_selector.completer().setFilterMode(Qt.MatchFlag.MatchContains)  # Match anywhere in the text
        
        top_row_layout.addWidget(self.field_selector)
        
        self.insert_field_btn = QPushButton('Insert Field')
        self.insert_field_btn.clicked.connect(self.insert_field)
        top_row_layout.addWidget(self.insert_field_btn)
        
        top_row_layout.addSpacing(20)  # Add some spacing
        
        # Stock Price button
        self.stock_price_btn = QPushButton('Stock Price')
        self.stock_price_btn.setStyleSheet("""
            QPushButton {
                background-color: #1E1E1E;
                color: #CE93D8;
                border: 1px solid #CE93D8;
                padding: 8px;
                font-size: 11px;
                font-weight: bold;
                border-radius: 6px;
                margin: 2px;
                min-height: 20px;
            }
            QPushButton:hover {
                background-color: #CE93D8;
                color: #121212;
            }
            QPushButton:pressed {
                background-color: #BA68C8;
            }
        """)
        self.stock_price_btn.clicked.connect(self.show_stock_price_dialog)
        top_row_layout.addWidget(self.stock_price_btn)
        
        layout.addLayout(top_row_layout)
        
        # Operator buttons - HORIZONTAL layout
        op_layout = QHBoxLayout()
        op_layout.addWidget(QLabel('Operators:'))
        
        # Math operators including division
        operators = ['+', '-', '*', '/', '(', ')']
        for op in operators:
            btn = QPushButton(op)
            btn.setFixedWidth(45)
            btn.setStyleSheet("""
                QPushButton {
                    background-color: #1E1E1E;
                    color: #FF9800;
                    border: 1px solid #FF9800;
                    padding: 8px;
                    font-size: 14px;
                    font-weight: bold;
                    border-radius: 6px;
                    margin: 2px;
                }
                QPushButton:hover {
                    background-color: #FF9800;
                    color: #121212;
                }
                QPushButton:pressed {
                    background-color: #F57C00;
                }
            """)
            btn.clicked.connect(lambda checked, op=op: self.insert_operator(op))
            op_layout.addWidget(btn)
        
        op_layout.addStretch()  # Push everything to the left
        
        layout.addLayout(op_layout)
        
        # Color legend
        legend_layout = QHBoxLayout()
        legend_layout.addWidget(QLabel('Color Legend:'))
        
        legend_items = [
            ('Operators', '#FF9800'),
            ('Brackets', '#FFD700'),
            ('IS: Items', '#81C784'),
            ('BS: Items', '#81D4FA'),
            ('P: Items', '#CE93D8'),
            ('Functions', '#FFC107'),
            ('Errors', '#F44336')
        ]
        
        for label_text, color in legend_items:
            color_label = QLabel(f'● {label_text}')
            color_label.setStyleSheet(f"""
                QLabel {{
                    color: {color};
                    font-size: 10px;
                    font-weight: normal;
                    margin: 2px 8px 2px 2px;
                }}
            """)
            legend_layout.addWidget(color_label)
        
        legend_layout.addStretch()
        layout.addLayout(legend_layout)
        
        # Formula preview with syntax highlighting
        layout.addWidget(QLabel('Formula Preview:'))
        self.formula_preview = QTextEdit()
        self.formula_preview.setMinimumHeight(120)
        self.formula_preview.setAcceptRichText(False)  # Use plain text mode (syntax highlighter works with this)
        self.formula_preview.setPlainText('= ')  # Start with equals sign
        
        # Apply syntax highlighter
        self.highlighter = FormulaHighlighter(self.formula_preview.document(), self.available_fields)
        
        # Move cursor to end after the equals sign
        cursor = self.formula_preview.textCursor()
        cursor.movePosition(cursor.MoveOperation.End)
        self.formula_preview.setTextCursor(cursor)
        
        layout.addWidget(self.formula_preview, 1)
        
        # Accept/Cancel buttons
        button_layout = QHBoxLayout()
        
        # Notes button
        self.notes_btn = QPushButton('📝 Notes')
        self.notes_btn.setStyleSheet("""
            QPushButton {
                background-color: #1E1E1E;
                color: #29B6F6;
                border: 1px solid #29B6F6;
                padding: 8px;
                font-size: 11px;
                font-weight: bold;
                border-radius: 6px;
                margin: 2px;
                min-height: 20px;
                min-width: 70px;
            }
            QPushButton:hover {
                background-color: #2C2C2C;
                border-color: #64B5F6;
            }
            QPushButton:pressed {
                background-color: #29B6F6;
                color: #121212;
                border-color: #1976D2;
            }
        """)
        self.notes_btn.clicked.connect(self.show_notes_dialog)
        button_layout.addWidget(self.notes_btn)
        
        # Spacer to push Save/Cancel to the right
        button_layout.addStretch()
        
        self.accept_btn = QPushButton('Save')
        self.accept_btn.setStyleSheet("""
            QPushButton {
                background-color: #1E1E1E;
                color: #4CAF50;
                border: 1px solid #4CAF50;
                padding: 8px;
                font-size: 11px;
                font-weight: bold;
                border-radius: 6px;
                margin: 2px;
                min-height: 20px;
                min-width: 70px;
            }
            QPushButton:hover {
                background-color: #2C2C2C;
                border-color: #66BB6A;
            }
            QPushButton:pressed {
                background-color: #4CAF50;
                color: #121212;
                border-color: #388E3C;
            }
        """)
        self.accept_btn.clicked.connect(self.accept)
        self.cancel_btn = QPushButton('Cancel')
        self.cancel_btn.clicked.connect(self.reject)
        button_layout.addWidget(self.accept_btn)
        button_layout.addWidget(self.cancel_btn)
        layout.addLayout(button_layout)
        
        self.setLayout(layout)
    

    
    def insert_field(self):
        current_text = self.formula_preview.toPlainText()
        field = self.field_selector.currentText()
        if field in self.available_fields:
            cursor = self.formula_preview.textCursor()
            if current_text and not current_text.endswith((' ', '(', '+', '-', '*', '/')):
                cursor.insertText(' ')
            cursor.insertText(field)
            self.formula_preview.setTextCursor(cursor)
    
    def show_stock_price_dialog(self):
        """Show stock price selection dialog"""
        dialog = StockPriceDialog(self)
        if dialog.exec():
            price_field = dialog.get_price_field()
            current_text = self.formula_preview.toPlainText()
            cursor = self.formula_preview.textCursor()
            
            # Add space before price field if needed
            if current_text and not current_text.endswith((' ', '(', '+', '-', '*', '/')):
                cursor.insertText(' ')
            cursor.insertText(price_field)
            self.formula_preview.setTextCursor(cursor)
    
    def insert_operator(self, op):
        cursor = self.formula_preview.textCursor()
        current_text = self.formula_preview.toPlainText()
        
        # Add space before operator if needed (except for opening parenthesis)
        if op != '(' and current_text and not current_text.endswith(' '):
            cursor.insertText(' ')
        
        cursor.insertText(f"{op} " if op != '(' else op)
        self.formula_preview.setTextCursor(cursor)
    
    def show_notes_dialog(self):
        """Show the notes dialog for this ratio"""
        dialog = NotesDialog(self, self.notes)
        if dialog.exec():
            self.notes = dialog.get_notes()
    
    def get_ratio_data(self):
        return {
            'name': self.name_input.text().strip(),
            'formula': self.formula_preview.toPlainText().strip(),
            'notes': self.notes
        }


def _evaluate_formula_latest(ticker, formula, ratios_config, cache, depth=0):
    """Evaluate a formula to its latest value for one ticker.

    Uses the shared formula engine (the same parser and resolver that the
    Metrics sheet and the charts/ranking engine use) so every calculation
    surface produces identical values. RATIO:/METRIC: references are resolved
    recursively from ``ratios_config`` with a cycle guard.
    """
    if depth > 10:
        return None

    formula = (formula or '').strip()
    if formula.startswith('='):
        formula = formula[1:].strip()

    ast = parse_formula_ast(formula)
    if ast is None:
        return None

    def resolve(sheet, item):
        sheet_upper = (sheet or '').upper()
        if sheet_upper in ('RATIO', 'METRIC'):
            metric_data = ratios_config.get((item or '').strip())
            if not metric_data:
                return None
            ref_formula = metric_data if isinstance(metric_data, str) else metric_data.get('formula', '')
            if not ref_formula:
                return None
            return _evaluate_formula_latest(ticker, ref_formula, ratios_config, cache, depth + 1)
        return resolve_latest(ticker, sheet_upper, item, cache)

    return eval_ast(ast, resolve)


class RatioMaker(QMainWindow):
    def __init__(self):
        super().__init__()
        self.ratios = self.load_ratios()
        self.available_fields = self.get_available_fields()
        self.init_ui()
    
    def init_ui(self):
        self.setWindowTitle('Ratio Maker')
        self.setMinimumSize(600, 400)
        
        # Apply dark theme styling
        self.setStyleSheet("""
            QMainWindow {
                background-color: #121212;
                color: #E0E0E0;
            }
            QWidget {
                background-color: #121212;
                color: #E0E0E0;
            }
            QLabel {
                color: #E0E0E0;
                font-size: 12px;
                font-weight: bold;
                margin: 3px;
                background-color: transparent;
            }
            QPushButton {
                background-color: #1E1E1E;
                color: #E0E0E0;
                border: 1px solid #29B6F6;
                padding: 8px;
                font-size: 11px;
                font-weight: bold;
                border-radius: 6px;
                margin: 2px;
                min-height: 20px;
            }
            QPushButton:hover {
                background-color: #2C2C2C;
                color: #E0E0E0;
                border-color: #1E88E5;
            }
            QPushButton:pressed {
                background-color: #29B6F6;
                color: #E0E0E0;
                border-color: #1565C0;
            }
            QScrollArea {
                border: 1px solid #2C2C2C;
                border-radius: 6px;
                background-color: #1E1E1E;
                margin: 2px;
            }
            QScrollBar:vertical {
                background-color: #1E1E1E;
                width: 12px;
                border-radius: 6px;
                border: 1px solid #2C2C2C;
            }
            QScrollBar::handle:vertical {
                background-color: #29B6F6;
                border-radius: 5px;
                min-height: 20px;
            }
            QScrollBar::handle:vertical:hover {
                background-color: #1E88E5;
            }
            QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {
                border: none;
                background: none;
                height: 0px;
            }
            QScrollBar::add-page:vertical, QScrollBar::sub-page:vertical {
                background: none;
            }
        """)
        
        # Create central widget and layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)
        
        # Add buttons
        button_layout = QHBoxLayout()
        add_ratio_btn = QPushButton('Add Ratio')
        add_ratio_btn.clicked.connect(self.show_formula_builder)
        refresh_btn = QPushButton('Refresh Calculations')
        refresh_btn.clicked.connect(self.refresh_calculations)
        button_layout.addWidget(add_ratio_btn)
        button_layout.addWidget(refresh_btn)
        layout.addLayout(button_layout)
        
        # Add search bar
        search_layout = QHBoxLayout()
        search_label = QLabel('Search Ratios:')
        search_label.setStyleSheet("""
            QLabel {
                color: #E0E0E0;
                font-size: 12px;
                font-weight: bold;
                margin: 5px;
            }
        """)
        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("Type ratio name to search...")
        self.search_input.setStyleSheet("""
            QLineEdit {
                background-color: #1E1E1E;
                color: #E0E0E0;
                border: 1px solid #2C2C2C;
                border-radius: 6px;
                padding: 8px;
                font-size: 11px;
                margin: 2px;
            }
            QLineEdit:focus {
                border-color: #29B6F6;
            }
        """)
        self.search_input.textChanged.connect(self.filter_ratios)
        
        # Results counter
        self.results_label = QLabel()
        self.results_label.setStyleSheet("""
            QLabel {
                color: #B0B0B0;
                font-size: 11px;
                margin: 5px;
            }
        """)
        
        clear_search_btn = QPushButton('Clear')
        clear_search_btn.setFixedWidth(60)
        clear_search_btn.setStyleSheet("""
            QPushButton {
                background-color: #1E1E1E;
                color: #FFA726;
                border: 1px solid #FFA726;
                padding: 8px;
                font-size: 11px;
                font-weight: bold;
                border-radius: 6px;
                margin: 2px;
            }
            QPushButton:hover {
                background-color: #FFA726;
                color: #121212;
            }
        """)
        clear_search_btn.clicked.connect(self.clear_search)
        
        search_layout.addWidget(search_label)
        search_layout.addWidget(self.search_input, 1)  # Give search input most space
        search_layout.addWidget(self.results_label)
        search_layout.addWidget(clear_search_btn)
        layout.addLayout(search_layout)
        
        # Add ratios display area
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll_content = QWidget()
        self.ratios_layout = QVBoxLayout(scroll_content)
        scroll.setWidget(scroll_content)
        layout.addWidget(scroll)
        
        self.update_ratios_display()
    
    def filter_ratios(self):
        """Filter ratios based on search term"""
        self.update_ratios_display()
    
    def clear_search(self):
        """Clear the search field and show all ratios"""
        self.search_input.clear()
        self.update_ratios_display()
    
    def load_ratios(self):
        try:
            if CONFIG_FILE.exists():
                with open(CONFIG_FILE, 'r') as f:
                    return json.load(f)
            return {}
        except Exception as e:
            print(f"Error loading ratios: {e}")
            return {}
    
    def save_ratios(self):
        try:
            with open(CONFIG_FILE, 'w') as f:
                json.dump(self.ratios, f, indent=2)
        except Exception as e:
            print(f"Error saving ratios: {e}")
    
    def get_available_fields(self):
        """Get list of available fields from parquet files (new per-ticker structure)"""
        try:
            fields = []
            
            # Load income statement fields from parquet (new structure: fundamentals/income_statement/*.parquet)
            is_dir = FUNDAMENTALS_DIR / "income_statement"
            if is_dir.exists() and is_dir.is_dir():
                is_fields = set()
                for ticker_file in is_dir.glob("*.parquet"):
                    try:
                        is_df = pd.read_parquet(ticker_file)
                        if 'index' in is_df.columns:
                            is_fields.update(is_df['index'].unique().tolist())
                    except Exception as e:
                        print(f"Warning: Could not read {ticker_file}: {e}")
                fields.extend(["IS: " + str(field) for field in is_fields])
                print(f"Loaded {len(is_fields)} income statement fields from parquet")
            else:
                # Fallback: old structure
                is_path = FUNDAMENTALS_DIR / "income_statement.parquet"
                if is_path.exists():
                    is_df = pd.read_parquet(is_path)
                    is_fields = is_df['index'].unique().tolist()
                    fields.extend(["IS: " + str(field) for field in is_fields])
                    print(f"Loaded {len(is_fields)} income statement fields from parquet (old format)")
                else:
                    print(f"Income statement data not found")
            
            # Load balance sheet fields from parquet (new structure: fundamentals/balance_sheet/*.parquet)
            bs_dir = FUNDAMENTALS_DIR / "balance_sheet"
            if bs_dir.exists() and bs_dir.is_dir():
                bs_fields = set()
                for ticker_file in bs_dir.glob("*.parquet"):
                    try:
                        bs_df = pd.read_parquet(ticker_file)
                        if 'index' in bs_df.columns:
                            bs_fields.update(bs_df['index'].unique().tolist())
                    except Exception as e:
                        print(f"Warning: Could not read {ticker_file}: {e}")
                fields.extend(["BS: " + str(field) for field in bs_fields])
                print(f"Loaded {len(bs_fields)} balance sheet fields from parquet")
            else:
                # Fallback: old structure
                bs_path = FUNDAMENTALS_DIR / "balance_sheet.parquet"
                if bs_path.exists():
                    bs_df = pd.read_parquet(bs_path)
                    bs_fields = bs_df['index'].unique().tolist()
                    fields.extend(["BS: " + str(field) for field in bs_fields])
                    print(f"Loaded {len(bs_fields)} balance sheet fields from parquet (old format)")
                else:
                    print(f"Balance sheet data not found")
            
            # Add price fields based on actual parquet column names
            price_fields = [
                'P: Close Price',
                'P: Previous Close',
                'P: Open Price',
                'P: High Price',
                'P: Low Price',
                'P: Volume',
                'P: Dividends',
                'P: Stock Splits'
            ]
            fields.extend(price_fields)
            
            # Add existing metrics with METRIC: prefix so they can be used in formulas.
            # RATIO: is kept as a legacy alias so previously saved formulas still highlight.
            if hasattr(self, 'ratios') and self.ratios:
                for ratio_name in self.ratios.keys():
                    fields.append(f"METRIC: {ratio_name}")
                    fields.append(f"RATIO: {ratio_name}")
                print(f"Added {len(self.ratios)} existing metrics as available fields")
            
            return sorted(fields)
        except Exception as e:
            print(f"Error getting fields from parquet: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def show_formula_builder(self):
        dialog = FormulaBuilderDialog(self.available_fields, self)
        if dialog.exec():
            ratio_data = dialog.get_ratio_data()
            if ratio_data['name'] and ratio_data['formula']:
                # Store as dictionary with formula and notes
                self.ratios[ratio_data['name']] = {
                    'formula': ratio_data['formula'],
                    'notes': ratio_data.get('notes', '')
                }
                self.save_ratios()
                # Refresh available fields to include the new ratio
                self.available_fields = self.get_available_fields()
                self.update_ratios_display()
    
    def update_ratios_display(self):
        # Clear existing widgets
        while self.ratios_layout.count():
            child = self.ratios_layout.takeAt(0)
            if child.widget():
                child.widget().deleteLater()
        
        # Get search term
        search_term = self.search_input.text().lower().strip() if hasattr(self, 'search_input') else ""
        
        # Sort ratios alphabetically by name
        sorted_ratios = sorted(self.ratios.items())
        
        # Filter ratios based on search term
        if search_term:
            filtered_ratios = [(name, data) for name, data in sorted_ratios 
                             if search_term in name.lower()]
        else:
            filtered_ratios = sorted_ratios
        
        # Update results counter
        total_ratios = len(self.ratios)
        showing_ratios = len(filtered_ratios)
        if search_term:
            self.results_label.setText(f"Showing {showing_ratios} of {total_ratios} ratios")
        else:
            self.results_label.setText(f"{total_ratios} ratios")
        
        # Show "No results" message if search yields no results
        if search_term and not filtered_ratios:
            no_results_label = QLabel(f"No ratios found matching '{self.search_input.text()}'")
            no_results_label.setStyleSheet("""
                QLabel {
                    color: #B0B0B0;
                    font-size: 14px;
                    font-style: italic;
                    text-align: center;
                    padding: 20px;
                    margin: 20px;
                }
            """)
            no_results_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
            self.ratios_layout.addWidget(no_results_label)
            self.ratios_layout.addStretch()
            return
        
        # Add ratio containers
        for name, ratio_data in filtered_ratios:
            # Handle both old format (string) and new format (dict)
            if isinstance(ratio_data, str):
                formula = ratio_data
                notes = ""
            else:
                formula = ratio_data.get('formula', '')
                notes = ratio_data.get('notes', '')
            
            # Create ratio container
            ratio_container = QWidget()
            ratio_container.setFixedHeight(60)  # Fixed height for consistent sizing
            ratio_container.setStyleSheet("""
                QWidget {
                    background-color: #1E1E1E;
                    border: 1px solid #2C2C2C;
                    border-radius: 8px;
                    margin: 2px;
                    padding: 4px;
                }
                QWidget:hover {
                    background-color: #2C2C2C;
                    border-color: #29B6F6;
                }
            """)
            
            ratio_layout = QHBoxLayout(ratio_container)
            ratio_layout.setContentsMargins(12, 8, 12, 8)
            ratio_layout.setSpacing(8)
            
            # Ratio name and formula
            ratio_info = QVBoxLayout()
            ratio_info.setSpacing(2)
            
            name_label = QLabel(name)
            # Add notes indicator if ratio has notes
            if notes.strip():
                name_label.setText(f"{name} 📝")  # Add note emoji if there are notes
            name_label.setStyleSheet("""
                QLabel {
                    color: #E0E0E0;
                    font-size: 13px;
                    font-weight: bold;
                    margin: 0px;
                    background-color: transparent;
                }
            """)
            ratio_info.addWidget(name_label)
            
            formula_label = QLabel(f"Formula: {formula}")
            formula_label.setStyleSheet("""
                QLabel {
                    color: #B0B0B0;
                    font-size: 10px;
                    font-weight: normal;
                    margin: 0px;
                    background-color: transparent;
                }
            """)
            formula_label.setWordWrap(True)
            ratio_info.addWidget(formula_label)
            
            ratio_layout.addLayout(ratio_info, 1)  # Give it stretch factor
            
            # Button container
            button_layout = QHBoxLayout()
            button_layout.setSpacing(4)
            
            # Edit button
            edit_btn = QPushButton('Edit')
            edit_btn.setFixedSize(50, 25)
            edit_btn.setStyleSheet("""
                QPushButton {
                    background-color: #1E1E1E;
                    color: #29B6F6;
                    border: 1px solid #29B6F6;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: bold;
                    padding: 2px;
                    margin: 0px;
                }
                QPushButton:hover {
                    background-color: #29B6F6;
                    color: #FFFFFF;
                }
                QPushButton:pressed {
                    background-color: #1E88E5;
                    color: #FFFFFF;
                }
            """)
            edit_btn.clicked.connect(lambda checked, n=name, f=formula, note=notes: self.edit_ratio(n, f, note))
            button_layout.addWidget(edit_btn)
            
            # Notes button (only show if there are notes or always show for quick access)
            notes_btn = QPushButton('📝')
            notes_btn.setFixedSize(30, 25)
            notes_btn.setToolTip("View/Edit Notes")
            
            # Different styling based on whether notes exist
            if notes.strip():
                # Highlighted style when notes exist
                notes_btn.setStyleSheet("""
                    QPushButton {
                        background-color: #29B6F6;
                        color: #FFFFFF;
                        border: 1px solid #29B6F6;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: bold;
                        padding: 2px;
                        margin: 0px;
                    }
                    QPushButton:hover {
                        background-color: #1E88E5;
                        color: #FFFFFF;
                    }
                    QPushButton:pressed {
                        background-color: #1565C0;
                        color: #FFFFFF;
                    }
                """)
            else:
                # Subtle style when no notes exist
                notes_btn.setStyleSheet("""
                    QPushButton {
                        background-color: #1E1E1E;
                        color: #29B6F6;
                        border: 1px solid #29B6F6;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: bold;
                        padding: 2px;
                        margin: 0px;
                    }
                    QPushButton:hover {
                        background-color: #29B6F6;
                        color: #FFFFFF;
                    }
                    QPushButton:pressed {
                        background-color: #1E88E5;
                        color: #FFFFFF;
                    }
                """)
            
            notes_btn.clicked.connect(lambda checked, n=name, note=notes: self.view_notes(n, note))
            button_layout.addWidget(notes_btn)
            
            # Delete button
            delete_btn = QPushButton('Delete')
            delete_btn.setFixedSize(50, 25)
            delete_btn.setStyleSheet("""
                QPushButton {
                    background-color: #1E1E1E;
                    color: #E57373;
                    border: 1px solid #E57373;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: bold;
                    padding: 2px;
                    margin: 0px;
                }
                QPushButton:hover {
                    background-color: #E57373;
                    color: #FFFFFF;
                }
                QPushButton:pressed {
                    background-color: #D32F2F;
                    color: #FFFFFF;
                }
            """)
            delete_btn.clicked.connect(lambda checked, n=name: self.delete_ratio(n))
            button_layout.addWidget(delete_btn)
            
            ratio_layout.addLayout(button_layout)
            
            self.ratios_layout.addWidget(ratio_container)
        
        # Add stretch to push containers to the top
        self.ratios_layout.addStretch()
    
    def view_notes(self, name, current_notes):
        """View and edit notes for a ratio from the main list"""
        dialog = NotesDialog(self, current_notes)
        dialog.setWindowTitle(f'Notes for {name}')
        
        if dialog.exec():
            new_notes = dialog.get_notes()
            
            # Update the ratio with new notes
            if name in self.ratios:
                # Handle both old format (string) and new format (dict)
                if isinstance(self.ratios[name], str):
                    # Convert old format to new format
                    self.ratios[name] = {
                        'formula': self.ratios[name],
                        'notes': new_notes
                    }
                else:
                    # Update existing format
                    self.ratios[name]['notes'] = new_notes
                
                self.save_ratios()
                self.update_ratios_display()
    
    def delete_ratio(self, name):
        if name in self.ratios:
            del self.ratios[name]
            self.save_ratios()
            # Refresh available fields since a ratio was removed
            self.available_fields = self.get_available_fields()
            self.update_ratios_display()
    
    def edit_ratio(self, name, formula, notes=""):
        """Edit an existing ratio"""
        dialog = FormulaBuilderDialog(self.available_fields, self)
        
        # Pre-populate the dialog with existing ratio data
        dialog.name_input.setText(name)
        # Ensure formula starts with equals sign
        if not formula.strip().startswith('='):
            dialog.formula_preview.setPlainText('= ' + formula)
        else:
            dialog.formula_preview.setPlainText(formula)
        dialog.notes = notes  # Set the notes
        
        if dialog.exec():
            ratio_data = dialog.get_ratio_data()
            if ratio_data['name'] and ratio_data['formula']:
                old_name = name
                new_name = ratio_data['name']
                
                # Remove old ratio if name changed
                if new_name != old_name and old_name in self.ratios:
                    del self.ratios[old_name]
                    # Update Excel assignments if name changed
                    self._update_excel_ratio_name(old_name, new_name)
                
                # Add/update ratio with new structure
                self.ratios[new_name] = {
                    'formula': ratio_data['formula'],
                    'notes': ratio_data.get('notes', '')
                }
                self.save_ratios()
                # Refresh available fields to reflect the renamed ratio
                self.available_fields = self.get_available_fields()
                self.update_ratios_display()
    
    def _update_excel_ratio_name(self, old_name, new_name):
        """Update metric name in Excel Metrics sheet when a metric is renamed"""
        try:
            # Try to connect to Excel
            try:
                wb = xw.Book.caller()
            except:
                # Try to find the dashboard
                dashboard_path = Path(__file__).parent.parent / "FinForge.xlsm"
                if dashboard_path.exists():
                    # Check if already open
                    for book in xw.books:
                        if Path(book.fullname).resolve() == dashboard_path.resolve():
                            wb = book
                            break
                    else:
                        # Not open, skip update (will sync next time Excel is used)
                        print(f"Excel not open - ratio name change will sync when Excel opens")
                        return
                else:
                    return
            
            # Get Metrics sheet (falling back to legacy "Ratios" sheet name)
            try:
                sheet_names = [s.name for s in wb.sheets]
                if METRICS_SHEET_NAME in sheet_names:
                    ws = wb.sheets[METRICS_SHEET_NAME]
                elif LEGACY_RATIOS_SHEET_NAME in sheet_names:
                    ws = wb.sheets[LEGACY_RATIOS_SHEET_NAME]
                else:
                    # No Metrics sheet, nothing to update
                    return
            except Exception:
                return
            
            # Search row 4 for the old ratio name and replace with new name
            row4_data = ws.range("B4:Z4").value
            if row4_data:
                for idx, value in enumerate(row4_data):
                    if value == old_name:
                        col_letter = chr(66 + idx)  # B=66, C=67, etc.
                        ws.range(f"{col_letter}4").value = new_name
                        print(f"Updated Excel: Column {col_letter} ratio name '{old_name}' → '{new_name}'")
                        wb.save()
                        break
                        
        except Exception as e:
            print(f"Warning: Could not update Excel ratio name: {e}")
    
    def _load_fundamentals_data(self, data_type):
        """Load fundamentals data from new per-ticker structure or fallback to old structure"""
        # New structure: fundamentals/{data_type}/*.parquet
        data_dir = FUNDAMENTALS_DIR / data_type
        if data_dir.exists() and data_dir.is_dir():
            frames = []
            for ticker_file in data_dir.glob("*.parquet"):
                try:
                    df = pd.read_parquet(ticker_file)
                    frames.append(df)
                except Exception as e:
                    print(f"Warning: Could not read {ticker_file}: {e}")
            if frames:
                return pd.concat(frames, ignore_index=True)
        
        # Fallback: old structure fundamentals/{data_type}.parquet
        old_path = FUNDAMENTALS_DIR / f"{data_type}.parquet"
        if old_path.exists():
            return pd.read_parquet(old_path)
        
        return None
    
    def refresh_calculations(self):
        try:
            print("\n Starting ratio calculations using Parquet data...")
            
            # Load tickers from tickers.json
            if not TICKERS_FILE.exists():
                print(f"Tickers file not found: {TICKERS_FILE}")
                return
            
            with open(TICKERS_FILE, 'r') as f:
                tickers_data = json.load(f)
                # Handle both old format (list of tickers) and new format (dict with 'tickers' key)
                if isinstance(tickers_data, dict) and 'tickers' in tickers_data:
                    tickers = tickers_data['tickers']
                elif isinstance(tickers_data, list):
                    tickers = tickers_data
                else:
                    tickers = list(tickers_data.keys())
            
            if not tickers:
                print("No tickers found in tickers.json")
                return
            
            print(f"Found {len(tickers)} tickers: {', '.join(tickers[:5])}{'...' if len(tickers) > 5 else ''}")
            
            # Evaluate every ratio for every ticker using the shared formula
            # engine (the same parser and resolver used by the Metrics sheet
            # and the charts/ranking engine), so all calculation surfaces agree
            # and no user-supplied formula is ever passed to eval().
            ratio_names = list(self.ratios.keys())
            results = {}
            cache = {}
            print(f"\nCalculating {len(ratio_names)} ratios...")

            for ticker in tickers:
                ticker_key = str(ticker).upper()
                results[ticker_key] = {}
                for ratio_name, ratio_data in self.ratios.items():
                    formula = ratio_data if isinstance(ratio_data, str) else ratio_data.get('formula', '')
                    results[ticker_key][ratio_name] = _evaluate_formula_latest(
                        ticker_key, formula, self.ratios, cache
                    )
                print(f"  OK {ticker_key}")

            # Prepare results
            result_df = pd.DataFrame.from_dict(results, orient='index')
            result_df.index.name = 'ticker'
            
            # Add timestamp
            from datetime import datetime
            result_df['last_updated'] = datetime.now().isoformat()
            
            # Save to parquet (primary storage)
            ratios_parquet = DATA_DIR / "ratios.parquet"
            result_df.to_parquet(ratios_parquet, index=True)
            print(f"\n✅ Calculations complete! Results saved to: {ratios_parquet}")
            
            # Also save to CSV for easy viewing
            ratios_csv = Path(__file__).parent / "ratio_results.csv"
            result_df.drop('last_updated', axis=1).to_csv(ratios_csv)
            print(f"📄 CSV backup saved to: {ratios_csv}")
            
            # Export to Excel
            self.export_to_excel(result_df.drop('last_updated', axis=1))
            
            print(f"\n📊 Results Summary:")
            print(result_df.drop('last_updated', axis=1).to_string())
            
        except Exception as e:
            print(f"\n❌ Error refreshing calculations: {e}")
            import traceback
            traceback.print_exc()
    
    def export_to_excel(self, result_df):
        """Export calculated ratios to Excel file using xlwings (works with open files).

        Sheet layout (matching ratio_calculator.py / BS/IS sheets):
          Row 4:     Ticker symbols in columns B-Z
          Row 7+:    Ratio names in Column A, calculated values in B-Z
        """
        try:
            print(f"\nExporting to Excel...")

            # Try to connect to active workbook or open it
            try:
                wb = xw.Book.caller()
            except:
                try:
                    wb = xw.books.active
                    if wb is None:
                        excel_file = Path(__file__).parent.parent / "FinForge.xlsm"
                        wb = xw.Book(str(excel_file))
                except Exception as e:
                    excel_file = Path(__file__).parent.parent / "FinForge.xlsm"
                    if not excel_file.exists():
                        print(f"  Excel file not found: {excel_file}")
                        return
                    wb = xw.Book(str(excel_file))

            # Check if the Metrics sheet exists (fall back to legacy 'Ratios' sheet name)
            sheet_names = [s.name for s in wb.sheets]
            if METRICS_SHEET_NAME in sheet_names:
                ws = wb.sheets[METRICS_SHEET_NAME]
            elif LEGACY_RATIOS_SHEET_NAME in sheet_names:
                ws = wb.sheets[LEGACY_RATIOS_SHEET_NAME]
            else:
                print(f"  '{METRICS_SHEET_NAME}' sheet not found in Excel")
                return
            data_start_row = 7

            # ── Read tickers from Row 4 (columns B-Z) ──
            ticker_col_map = {}   # ticker -> column letter
            row4_data = ws.range("B4:Z4").value
            if row4_data:
                for idx, value in enumerate(row4_data):
                    if value and isinstance(value, str):
                        ticker = value.strip().upper()
                        col_letter = chr(66 + idx)  # B=66, C=67, ...
                        ticker_col_map[ticker] = col_letter

            if not ticker_col_map:
                print("  No tickers found in Row 4 — nothing to export")
                return

            # ── Read ratio names from Column A (rows 7+) ──
            ratio_row_map = {}    # ratio_name -> row number
            col_a = ws.range(f"A{data_start_row}:A200").value
            if col_a:
                for offset, item in enumerate(col_a):
                    if item and isinstance(item, str):
                        name = item.strip()
                        if name in result_df.columns:
                            ratio_row_map[name] = data_start_row + offset

            if not ratio_row_map:
                print("  No ratios found in Column A — nothing to export")
                return

            print(f"  Found {len(ticker_col_map)} ticker(s) and {len(ratio_row_map)} ratio(s) in sheet")

            # ── Write values at the intersection ──
            updates_count = 0
            for ratio_name, row_num in ratio_row_map.items():
                for ticker, col_letter in ticker_col_map.items():
                    if ticker not in result_df.index:
                        continue
                    value = result_df.loc[ticker, ratio_name]
                    cell = f"{col_letter}{row_num}"
                    if pd.isna(value):
                        ws.range(cell).value = None
                    else:
                        ws.range(cell).value = float(value)
                    updates_count += 1

            print(f"  Updated {updates_count} ratio values in Excel")
            
        except Exception as e:
            print(f"  ❌ Error exporting to Excel: {e}")
            import traceback
            traceback.print_exc()

def main():
    app = QApplication(sys.argv)
    window = RatioMaker()
    window.show()
    sys.exit(app.exec())

if __name__ == '__main__':
    main()
