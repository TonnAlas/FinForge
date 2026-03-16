"""
Ticker Management GUI

DESCRIPTION:
Interactive graphical user interface for managing stock ticker symbols. Provides full
CRUD operations (Create, Read, Update, Delete) for ticker lists with real-time validation
and integration with the stock data management system.

INPUTS:
- User interactions: Add, edit, remove ticker operations via GUI
- Ticker symbols: Stock symbols entered by user (e.g., 'AAPL', 'MSFT')
- JSON files: Existing ticker lists for loading/saving

OUTPUTS:
- tickers.json: Persistent storage of ticker lists
- GUI display: Real-time ticker list visualization
- Validation messages: User feedback for ticker operations
- Updated ticker data: Clean, validated ticker symbols

DEPENDENCIES:
- PySide6.QtWidgets: GUI components (windows, buttons, lists, inputs)
- PySide6.QtCore: Core Qt functionality and event handling
- PySide6.QtGui: Font and display formatting
- json: JSON file operations for ticker persistence
- sys, os: System operations and file path handling

RELATED FILES:
- Creates/Updates: tickers.json (ticker storage)
- Used by: stock_launcher.py (inherits from TickerManager)
- Integrates with: stock_data_manager.py for data operations
"""

import sys
import os
import json
from PySide6.QtWidgets import (QApplication, QMainWindow, QVBoxLayout, QHBoxLayout, 
                               QWidget, QPushButton, QLineEdit, QListWidget, QLabel, 
                               QMessageBox, QInputDialog, QListWidgetItem)
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont

class TickerManager(QMainWindow):
    def __init__(self):
        super().__init__()
        self.tickers_file = os.path.join(os.path.dirname(__file__), 'tickers.json')
        self.init_ui()
        self.load_tickers()
        
    def init_ui(self):
        self.setWindowTitle("Stock Ticker Manager")
        self.setGeometry(100, 100, 500, 600)
        self.setStyleSheet("""
            QMainWindow {
                background-color: #121212;
                color: #E0E0E0;
            }
            QLabel {
                font-size: 14px;
                font-weight: bold;
                color: #E0E0E0;
                margin: 5px;
                background-color: transparent;
            }
            QPushButton {
                background-color: #29B6F6;
                color: #FFFFFF;
                border: none;
                padding: 10px;
                font-size: 12px;
                border-radius: 5px;
                margin: 3px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #039BE5;
            }
            QPushButton:pressed {
                background-color: #0277BD;
            }
            QLineEdit {
                padding: 8px;
                font-size: 12px;
                border: 2px solid #424242;
                border-radius: 5px;
                margin: 3px;
                background-color: #1E1E1E;
                color: #E0E0E0;
            }
            QLineEdit:focus {
                border-color: #29B6F6;
            }
            QListWidget {
                border: 2px solid #424242;
                border-radius: 5px;
                background-color: #1E1E1E;
                font-size: 12px;
                margin: 3px;
                color: #E0E0E0;
            }
            QListWidget::item {
                padding: 5px;
                border-bottom: 1px solid #424242;
            }
            QListWidget::item:selected {
                background-color: #29B6F6;
                color: #FFFFFF;
            }
        """)
        
        # Central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # Main layout
        layout = QVBoxLayout(central_widget)
        layout.setSpacing(15)
        layout.setContentsMargins(20, 20, 20, 20)
        
        # Title
        title_label = QLabel("Stock Ticker Manager")
        title_font = QFont()
        title_font.setPointSize(18)
        title_font.setBold(True)
        title_label.setFont(title_font)
        title_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(title_label)
        
        # Add ticker section
        add_section = QVBoxLayout()
        add_label = QLabel("Add New Ticker:")
        add_section.addWidget(add_label)
        
        add_layout = QHBoxLayout()
        self.ticker_input = QLineEdit()
        self.ticker_input.setPlaceholderText("Enter ticker symbol (e.g., AAPL, MSFT)")
        self.ticker_input.returnPressed.connect(self.add_ticker)
        add_layout.addWidget(self.ticker_input)
        
        add_button = QPushButton("Add Ticker")
        add_button.clicked.connect(self.add_ticker)
        add_layout.addWidget(add_button)
        
        add_section.addLayout(add_layout)
        layout.addLayout(add_section)
        
        # Current tickers section
        tickers_label = QLabel("Current Tickers:")
        layout.addWidget(tickers_label)
        
        self.tickers_list = QListWidget()
        self.tickers_list.setMinimumHeight(300)
        layout.addWidget(self.tickers_list)
        
        # Buttons section
        buttons_layout = QHBoxLayout()
        
        remove_button = QPushButton("Remove Selected")
        remove_button.clicked.connect(self.remove_ticker)
        remove_button.setStyleSheet("QPushButton { background-color: #F44336; color: #FFFFFF; } QPushButton:hover { background-color: #D32F2F; }")
        buttons_layout.addWidget(remove_button)
        
        edit_button = QPushButton("Edit Selected")
        edit_button.clicked.connect(self.edit_ticker)
        edit_button.setStyleSheet("QPushButton { background-color: #29B6F6; color: #FFFFFF; } QPushButton:hover { background-color: #039BE5; }")
        buttons_layout.addWidget(edit_button)
        
        clear_button = QPushButton("Clear All")
        clear_button.clicked.connect(self.clear_all_tickers)
        clear_button.setStyleSheet("QPushButton { background-color: #ff9800; } QPushButton:hover { background-color: #f57c00; }")
        buttons_layout.addWidget(clear_button)
        
        layout.addLayout(buttons_layout)
        
        # Action buttons
        action_layout = QHBoxLayout()
        
        fetch_button = QPushButton("Fetch Data for All Tickers")
        fetch_button.clicked.connect(self.fetch_all_data)
        fetch_button.setStyleSheet("QPushButton { background-color: #9C27B0; font-size: 14px; font-weight: bold; } QPushButton:hover { background-color: #7B1FA2; }")
        action_layout.addWidget(fetch_button)
        
        save_button = QPushButton("Save & Close")
        save_button.clicked.connect(self.save_and_close)
        save_button.setStyleSheet("QPushButton { background-color: #4CAF50; font-size: 14px; font-weight: bold; }")
        action_layout.addWidget(save_button)
        
        layout.addLayout(action_layout)
        
        # Status info
        status_label = QLabel("Tickers will be saved automatically when you add/remove them.")
        status_label.setStyleSheet("color: #666; font-size: 10px; font-style: italic;")
        status_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(status_label)
    
    def load_tickers(self):
        """Load tickers from JSON file"""
        try:
            if os.path.exists(self.tickers_file):
                with open(self.tickers_file, 'r') as f:
                    data = json.load(f)
                    tickers = data.get('tickers', [])
            else:
                # Default tickers if file doesn't exist
                tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
                self.save_tickers(tickers)
            
            self.tickers_list.clear()
            for ticker in tickers:
                self.tickers_list.addItem(ticker.upper())
                
        except Exception as e:
            QMessageBox.warning(self, "Error", f"Error loading tickers: {str(e)}")
    
    def save_tickers(self, tickers=None):
        """Save tickers to JSON file"""
        try:
            if tickers is None:
                tickers = []
                for i in range(self.tickers_list.count()):
                    tickers.append(self.tickers_list.item(i).text())
            
            import datetime
            data = {
                'tickers': tickers,
                'last_updated': str(datetime.datetime.now())
            }
            
            with open(self.tickers_file, 'w') as f:
                json.dump(data, f, indent=2)
                
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Error saving tickers: {str(e)}")
    
    def add_ticker(self):
        """Add a new ticker to the list"""
        ticker = self.ticker_input.text().strip().upper()
        
        if not ticker:
            QMessageBox.warning(self, "Invalid Input", "Please enter a ticker symbol.")
            return
        
        if not ticker.isalpha() or len(ticker) > 5:
            QMessageBox.warning(self, "Invalid Ticker", "Ticker should be 1-5 letters only.")
            return
        
        # Check if ticker already exists
        for i in range(self.tickers_list.count()):
            if self.tickers_list.item(i).text() == ticker:
                QMessageBox.information(self, "Duplicate Ticker", f"Ticker {ticker} already exists.")
                self.ticker_input.clear()
                return
        
        self.tickers_list.addItem(ticker)
        self.ticker_input.clear()
        self.save_tickers()
        
        QMessageBox.information(self, "Success", f"Ticker {ticker} added successfully!")
    
    def remove_ticker(self):
        """Remove selected ticker from the list"""
        current_item = self.tickers_list.currentItem()
        if current_item:
            ticker = current_item.text()
            reply = QMessageBox.question(self, "Confirm Removal", 
                                       f"Are you sure you want to remove {ticker}?",
                                       QMessageBox.Yes | QMessageBox.No)
            
            if reply == QMessageBox.Yes:
                self.tickers_list.takeItem(self.tickers_list.row(current_item))
                self.save_tickers()
                QMessageBox.information(self, "Success", f"Ticker {ticker} removed successfully!")
        else:
            QMessageBox.warning(self, "No Selection", "Please select a ticker to remove.")
    
    def edit_ticker(self):
        """Edit selected ticker"""
        current_item = self.tickers_list.currentItem()
        if current_item:
            old_ticker = current_item.text()
            new_ticker, ok = QInputDialog.getText(self, "Edit Ticker", 
                                                 "Enter new ticker symbol:", 
                                                 text=old_ticker)
            
            if ok and new_ticker.strip():
                new_ticker = new_ticker.strip().upper()
                
                if not new_ticker.isalpha() or len(new_ticker) > 5:
                    QMessageBox.warning(self, "Invalid Ticker", "Ticker should be 1-5 letters only.")
                    return
                
                # Check if new ticker already exists
                for i in range(self.tickers_list.count()):
                    if self.tickers_list.item(i).text() == new_ticker and i != self.tickers_list.row(current_item):
                        QMessageBox.information(self, "Duplicate Ticker", f"Ticker {new_ticker} already exists.")
                        return
                
                current_item.setText(new_ticker)
                self.save_tickers()
                QMessageBox.information(self, "Success", f"Ticker updated from {old_ticker} to {new_ticker}!")
        else:
            QMessageBox.warning(self, "No Selection", "Please select a ticker to edit.")
    
    def clear_all_tickers(self):
        """Clear all tickers from the list"""
        if self.tickers_list.count() > 0:
            reply = QMessageBox.question(self, "Confirm Clear All", 
                                       "Are you sure you want to remove all tickers?",
                                       QMessageBox.Yes | QMessageBox.No)
            
            if reply == QMessageBox.Yes:
                self.tickers_list.clear()
                self.save_tickers()
                QMessageBox.information(self, "Success", "All tickers cleared!")
        else:
            QMessageBox.information(self, "No Tickers", "No tickers to clear.")
    
    def fetch_all_data(self):
        """Fetch data for all tickers"""
        if self.tickers_list.count() == 0:
            QMessageBox.warning(self, "No Tickers", "Please add some tickers first.")
            return
        
        reply = QMessageBox.question(self, "Fetch Data", 
                                   f"Fetch data for all {self.tickers_list.count()} tickers?",
                                   QMessageBox.Yes | QMessageBox.No)
        
        if reply == QMessageBox.Yes:
            try:
                # Import and run fetch_stocks
                sys.path.append(os.path.dirname(__file__))
                import Internal.ticker_management.fetch_stocks as fetch_stocks
                
                QMessageBox.information(self, "Success", "Data fetching started! Check the terminal for progress.")
                
            except Exception as e:
                QMessageBox.critical(self, "Error", f"Error fetching data: {str(e)}")
    
    def save_and_close(self):
        """Save and close the application"""
        self.save_tickers()
        QMessageBox.information(self, "Saved", "Tickers saved successfully!")
        self.close()
    
    def get_tickers_list(self):
        """Return list of current tickers"""
        tickers = []
        for i in range(self.tickers_list.count()):
            tickers.append(self.tickers_list.item(i).text())
        return tickers

def main():
    app = QApplication(sys.argv)
    app.setApplicationName("Ticker Manager")
    
    window = TickerManager()
    window.show()
    
    sys.exit(app.exec())

def get_tickers_from_file():
    """Utility function to get tickers from the JSON file"""
    tickers_file = os.path.join(os.path.dirname(__file__), 'tickers.json')
    try:
        if os.path.exists(tickers_file):
            with open(tickers_file, 'r') as f:
                data = json.load(f)
                return data.get('tickers', [])
        else:
            # Return default tickers if file doesn't exist
            return ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
    except Exception as e:
        print(f"Error reading tickers file: {e}")
        return ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']

if __name__ == "__main__":
    main()
