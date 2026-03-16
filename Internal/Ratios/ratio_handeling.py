import sys
import json
from pathlib import Path
from PySide6.QtWidgets import (QApplication, QMainWindow, QPushButton, QVBoxLayout, 
                             QWidget, QDialog, QLineEdit, QComboBox, QHBoxLayout, 
                             QLabel, QTextEdit, QScrollArea, QListWidget, QCheckBox,
                             QMessageBox)
from PySide6.QtCore import Qt
import xlwings as xw

# Configuration  
CONFIG_FILE = Path(__file__).parent.parent.parent / "Importing" / "ratio_config.json"  # Go up to Stocks folder
DASHBOARD_PATH = Path(__file__).parent.parent.parent / "FinForge.xlsm"

class RatioInfoDialog(QDialog):
    def __init__(self, ratio_name, ratio_formula, parent=None):
        super().__init__(parent)
        self.ratio_name = ratio_name
        self.ratio_formula = ratio_formula
        self.init_ui()
        
    def init_ui(self):
        self.setWindowTitle('Ratio Information')
        self.setMinimumWidth(500)
        
        layout = QVBoxLayout()
        
        # Ratio name
        name_layout = QHBoxLayout()
        name_layout.addWidget(QLabel('Name:'))
        name_label = QLabel(self.ratio_name)
        name_label.setStyleSheet("font-weight: bold;")
        name_layout.addWidget(name_label)
        layout.addLayout(name_layout)
        
        # Ratio formula
        layout.addWidget(QLabel('Formula:'))
        formula_text = QTextEdit()
        formula_text.setPlainText(self.ratio_formula)
        formula_text.setReadOnly(True)
        layout.addWidget(formula_text)
        
        # Buttons
        button_layout = QHBoxLayout()
        edit_btn = QPushButton('Edit Ratio')
        edit_btn.clicked.connect(self.edit_ratio)
        close_btn = QPushButton('Close')
        close_btn.clicked.connect(self.accept)
        button_layout.addWidget(edit_btn)
        button_layout.addWidget(close_btn)
        layout.addLayout(button_layout)
        
        self.setLayout(layout)
    
    def edit_ratio(self):
        self.edit_dialog = RatioEditDialog(self.ratio_name, self.ratio_formula, self)
        if self.edit_dialog.exec():
            # Update the ratio in config file
            ratios = get_ratios_from_config()
            ratios[self.ratio_name] = self.edit_dialog.get_formula()
            save_ratios_to_config(ratios)
            QMessageBox.information(self, "Success", "Ratio updated successfully!")
            self.accept()

class RatioEditDialog(QDialog):
    def __init__(self, ratio_name, ratio_formula, parent=None):
        super().__init__(parent)
        self.ratio_name = ratio_name
        self.ratio_formula = ratio_formula
        self.init_ui()
        
    def init_ui(self):
        self.setWindowTitle('Edit Ratio')
        self.setMinimumWidth(500)
        
        layout = QVBoxLayout()
        
        # Ratio name
        name_layout = QHBoxLayout()
        name_layout.addWidget(QLabel('Name:'))
        self.name_edit = QLineEdit(self.ratio_name)
        name_layout.addWidget(self.name_edit)
        layout.addLayout(name_layout)
        
        # Ratio formula
        layout.addWidget(QLabel('Formula:'))
        self.formula_edit = QTextEdit()
        self.formula_edit.setPlainText(self.ratio_formula)
        layout.addWidget(self.formula_edit)
        
        # Buttons
        button_layout = QHBoxLayout()
        save_btn = QPushButton('Save')
        save_btn.clicked.connect(self.accept)
        cancel_btn = QPushButton('Cancel')
        cancel_btn.clicked.connect(self.reject)
        button_layout.addWidget(save_btn)
        button_layout.addWidget(cancel_btn)
        layout.addLayout(button_layout)
        
        self.setLayout(layout)
    
    def get_formula(self):
        return self.formula_edit.toPlainText()

def get_ratios_from_config():
    """Load ratio definitions from the config file"""
    try:
        if CONFIG_FILE.exists():
            with open(CONFIG_FILE, 'r') as f:
                return json.load(f)
        return {}
    except Exception as e:
        print(f"Error loading ratios: {e}")
        return {}

def save_ratios_to_config(ratios):
    """Save ratio definitions to the config file"""
    try:
        with open(CONFIG_FILE, 'w') as f:
            json.dump(ratios, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving ratios: {e}")
        return False

def show_ratio_info(ratio_name, ratio_formula):
    """Show the ratio information dialog"""
    app = QApplication.instance() or QApplication(sys.argv)
    dialog = RatioInfoDialog(ratio_name, ratio_formula)
    dialog.exec()

@xw.sub  # This decorator allows Excel to call this function
def show_ratio_info_from_excel(ratio_name):
    """This function will be called from Excel VBA when clicking the info button"""
    try:
        ratios = get_ratios_from_config()
        if ratio_name in ratios:
            show_ratio_info(ratio_name, ratios[ratio_name])
        else:
            QMessageBox.warning(None, "Error", f"Ratio '{ratio_name}' not found!")
    except Exception as e:
        print(f"Error showing ratio info: {e}")
        QMessageBox.warning(None, "Error", f"Error showing ratio info: {str(e)}")

if __name__ == '__main__':
    # Test code
    ratios = get_ratios_from_config()
    if ratios:
        test_ratio_name = list(ratios.keys())[0]
        show_ratio_info(test_ratio_name, ratios[test_ratio_name])
