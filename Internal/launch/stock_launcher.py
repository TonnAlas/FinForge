"""
Stock Portfolio Launcher

DESCRIPTION:
Main entry point and central launcher for the stock portfolio management system.
Combines ticker management with Excel dashboard integration, providing a streamlined
interface for data fetching and portfolio analysis workflow.

INPUTS:
- User selections: Ticker choices and launch commands via GUI
- Ticker data: From inherited TickerManager functionality
- Excel workbook: FinForge.xlsm for dashboard integration

OUTPUTS:
- Launched Excel workbook: Opens FinForge.xlsm with selected tickers
- Data fetching: Triggers stock data retrieval for selected symbols
- GUI feedback: Progress indicators and status messages
- Updated ticker lists: Through inherited ticker management functionality

DEPENDENCIES:
- PySide6.QtWidgets: GUI framework for launcher interface
- PySide6.QtCore: Qt core functionality and timers
- PySide6.QtGui: Fonts and icons for interface styling
- subprocess: System process execution for launching applications
- pathlib: Cross-platform file path operations
- Ticker_management.ticker_manager: TickerManager class inheritance

RELATED FILES:
- Inherits from: Ticker_management/ticker_manager.py
- Launches: FinForge.xlsm (Excel workbook)
- Uses: stock_data_manager.py for data operations
- Called by: launch_finforge.bat (desktop launcher)
"""

import sys
import os
import subprocess
import datetime
import json
import requests
from pathlib import Path
from PySide6.QtWidgets import (QApplication, QMainWindow, QVBoxLayout, QHBoxLayout, 
                               QWidget, QPushButton, QLineEdit, QListWidget, QLabel, 
                               QMessageBox, QInputDialog, QListWidgetItem, QProgressDialog)
from PySide6.QtCore import Qt, QTimer, QThread, Signal
from PySide6.QtGui import QFont, QIcon

# Add the parent directory to path to import ticker_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from Ticker_management.ticker_manager import TickerManager
from data_management.stock_data_manager import StockDataManager


class DataFetchWorker(QThread):
    """Worker thread for fetching stock data without blocking the UI"""
    finished = Signal(str, bool, str)  # ticker, success, message
    progress = Signal(str)  # status message
    
    def __init__(self, ticker, data_manager):
        super().__init__()
        self.ticker = ticker
        self.data_manager = data_manager
    
    def run(self):
        """Fetch all data for a single ticker and save to parquet"""
        try:
            import yfinance as yf
            import pandas as pd
            from datetime import datetime, timedelta
            
            self.progress.emit(f"Fetching data for {self.ticker}...")
            
            stock = yf.Ticker(self.ticker)
            
            # Date range for historical data
            end_date = datetime.today().date()
            start_date = end_date - timedelta(days=365)
            
            def prepare_df(df):
                """Prepare DataFrame for storage"""
                if df is None or df.empty:
                    return pd.DataFrame()
                df = df.copy()
                if isinstance(df.index, pd.DatetimeIndex):
                    df.index = df.index.tz_localize(None)
                df.reset_index(inplace=True)
                return df
            
            # 1. Historical Data
            hist = stock.history(start=start_date, end=end_date)
            if not hist.empty:
                hist = prepare_df(hist)
                self.data_manager.save_stock_prices(self.ticker, hist)
            
            # 2. Income Statement
            income = prepare_df(stock.income_stmt)
            if not income.empty:
                self.data_manager.save_fundamental_data(self.ticker, 'income_statement', income)
            
            # 3. Balance Sheet
            balance = prepare_df(stock.balance_sheet)
            if not balance.empty:
                self.data_manager.save_fundamental_data(self.ticker, 'balance_sheet', balance)
            
            # 4. Cash Flow
            cashflow = prepare_df(stock.cashflow)
            if not cashflow.empty:
                self.data_manager.save_fundamental_data(self.ticker, 'cash_flow', cashflow)
            
            # 5. Major Holders
            major_holders = prepare_df(stock.major_holders)
            if not major_holders.empty:
                self.data_manager.save_holders_data(self.ticker, 'major_holders', major_holders)
            
            # 6. Institutional Holders
            institutional_holders = prepare_df(stock.institutional_holders)
            if not institutional_holders.empty:
                self.data_manager.save_holders_data(self.ticker, 'institutional_holders', institutional_holders)
            
            # 7. Mutual Fund Holders
            mutualfund_holders = prepare_df(stock.mutualfund_holders)
            if not mutualfund_holders.empty:
                self.data_manager.save_holders_data(self.ticker, 'mutualfund_holders', mutualfund_holders)
            
            # 8. Recommendations
            recommendations = prepare_df(stock.recommendations)
            if not recommendations.empty:
                self.data_manager.save_fundamental_data(self.ticker, 'recommendations', recommendations)
            
            # 9. Calendar
            cal = stock.calendar
            if isinstance(cal, pd.DataFrame) and not cal.empty:
                cal = prepare_df(cal)
                self.data_manager.save_fundamental_data(self.ticker, 'calendar', cal)
            
            # 10. Info (full metadata)
            info = stock.info
            if info and isinstance(info, dict):
                self.data_manager.save_metadata(self.ticker, info)
            
            self.finished.emit(self.ticker, True, f"Data saved for {self.ticker}")
            
        except Exception as e:
            self.finished.emit(self.ticker, False, f"Error fetching {self.ticker}: {str(e)}")


def get_company_name(ticker):
    """Get company name from Yahoo Finance API"""
    try:
        # Use Yahoo Finance query API
        url = f"https://query1.finance.yahoo.com/v1/finance/search?q={ticker}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        
        data = response.json()
        if 'quotes' in data and len(data['quotes']) > 0:
            for quote in data['quotes']:
                if quote.get('symbol', '').upper() == ticker.upper():
                    return quote.get('longname', ticker)
        
        # Fallback to first result if exact match not found
        if 'quotes' in data and len(data['quotes']) > 0:
            return data['quotes'][0].get('longname', ticker)
            
    except Exception as e:
        print(f"Error fetching company name for {ticker}: {e}")
    
    return ticker  # Return ticker if company name not found

class TickerItemWidget(QWidget):
    def __init__(self, ticker, parent_launcher):
        super().__init__()
        self.ticker = ticker
        self.parent_launcher = parent_launcher
        self.is_hovered = False
        
        # Enable styled background and mouse tracking
        self.setAttribute(Qt.WA_StyledBackground, True)
        self.setMouseTracking(True)
        self.setFixedHeight(36)
        
        # Set initial style
        self.update_style(False)
        
        # Main layout
        main_layout = QHBoxLayout(self)
        main_layout.setContentsMargins(12, 8, 12, 8)
        main_layout.setSpacing(8)
        
        # Ticker label - initially show just ticker, company name will be loaded asynchronously
        self.company_name = "Loading..."
        self.ticker_label = QLabel(f"{ticker} - {self.company_name}")
        self.ticker_label.setStyleSheet("""
            QLabel {
                color: #E0E0E0;
                font-weight: normal;
                font-size: 12px;
                background-color: transparent;
                border: none;
                padding: 0px;
            }
        """)
        self.ticker_label.setAlignment(Qt.AlignLeft | Qt.AlignVCenter)
        main_layout.addWidget(self.ticker_label, 1)
        
        # Load company name asynchronously
        QTimer.singleShot(100, self.load_company_name)
        
        # Add stretch to push buttons to the right
        main_layout.addStretch()
        
        # Edit button
        self.edit_btn = QPushButton("✏")
        self.edit_btn.setFixedSize(18, 18)
        self.edit_btn.setToolTip("Edit ticker")
        self.edit_btn.setStyleSheet("""
            QPushButton {
                background-color: #1E1E1E;
                color: #29B6F6;
                border: 1px solid #29B6F6;
                border-radius: 2px;
                font-size: 8px;
                font-weight: bold;
                padding: 0px;
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
        self.edit_btn.clicked.connect(self.edit_ticker)
        main_layout.addWidget(self.edit_btn)
        
        # Small spacing between buttons
        main_layout.addSpacing(2)
        
        # Delete button
        self.delete_btn = QPushButton("✕")
        self.delete_btn.setFixedSize(18, 18)
        self.delete_btn.setToolTip("Delete ticker")
        self.delete_btn.setStyleSheet("""
            QPushButton {
                background-color: #1E1E1E;
                color: #F44336;
                border: 1px solid #F44336;
                border-radius: 2px;
                font-size: 8px;
                font-weight: bold;
                padding: 0px;
                margin: 0px;
            }
            QPushButton:hover {
                background-color: #F44336;
                color: #FFFFFF;
            }
            QPushButton:pressed {
                background-color: #D32F2F;
                color: #FFFFFF;
            }
        """)
        self.delete_btn.clicked.connect(self.delete_ticker)
        main_layout.addWidget(self.delete_btn)
    
    def update_style(self, hovered):
        """Update the widget style based on hover state"""
        if hovered:
            self.setStyleSheet("""
                TickerItemWidget {
                    background-color: #2C2C2C;
                    border: 2px solid #29B6F6;
                    border-radius: 6px;
                }
            """)
        else:
            self.setStyleSheet("""
                TickerItemWidget {
                    background-color: #1E1E1E;
                    border: 1px solid #2C2C2C;
                    border-radius: 6px;
                }
            """)
    
    def enterEvent(self, event):
        """Handle mouse enter event"""
        self.is_hovered = True
        self.update_style(True)
        super().enterEvent(event)
    
    def leaveEvent(self, event):
        """Handle mouse leave event"""
        self.is_hovered = False
        self.update_style(False)
        super().leaveEvent(event)
    
    def mousePressEvent(self, event):
        """Handle mouse press event"""
        if event.button() == Qt.LeftButton:
            self.setStyleSheet("""
                TickerItemWidget {
                    background-color: #29B6F6;
                    border: 2px solid #1E88E5;
                    border-radius: 6px;
                }
            """)
        super().mousePressEvent(event)
    
    def mouseReleaseEvent(self, event):
        """Handle mouse release event"""
        if self.is_hovered:
            self.update_style(True)
        else:
            self.update_style(False)
        super().mouseReleaseEvent(event)
    
    def load_company_name(self):
        """Load company name asynchronously"""
        try:
            self.company_name = get_company_name(self.ticker)
            self.update_ticker_display()
        except Exception as e:
            print(f"Error loading company name for {self.ticker}: {e}")
            self.company_name = self.ticker
            self.update_ticker_display()
    
    def update_ticker_display(self):
        """Update the ticker label with ticker and company name"""
        if self.company_name and self.company_name != self.ticker:
            self.ticker_label.setText(f"{self.ticker} - {self.company_name}")
        else:
            self.ticker_label.setText(self.ticker)
    
    def edit_ticker(self):
        """Edit this ticker"""
        new_ticker, ok = QInputDialog.getText(self, "Edit Ticker", 
                                             "Enter new ticker symbol:", 
                                             text=self.ticker)
        
        if ok and new_ticker.strip():
            new_ticker = new_ticker.strip().upper()
            
            if not new_ticker.isalpha() or len(new_ticker) > 5:
                QMessageBox.warning(self, "Invalid Ticker", "Ticker should be 1-5 letters only.")
                return
            
            # Check if new ticker already exists
            if self.parent_launcher.ticker_exists(new_ticker) and new_ticker != self.ticker:
                QMessageBox.information(self, "Duplicate Ticker", f"Ticker {new_ticker} already exists.")
                return
            
            # Update the ticker
            old_ticker = self.ticker
            self.ticker = new_ticker
            self.company_name = "Loading..."
            self.update_ticker_display()
            
            # Update in parent
            self.parent_launcher.update_ticker_in_list(old_ticker, new_ticker)
            
            # Fetch data for the new ticker if it changed
            if old_ticker != new_ticker:
                self.parent_launcher.fetch_ticker_data(new_ticker)
            
            # Load new company name
            QTimer.singleShot(100, self.load_company_name)
    
    def delete_ticker(self):
        """Delete this ticker"""
        reply = QMessageBox.question(self, "Confirm Removal", 
                                   f"Are you sure you want to remove {self.ticker}?",
                                   QMessageBox.Yes | QMessageBox.No)
        
        if reply == QMessageBox.Yes:
            self.parent_launcher.remove_ticker_from_list(self.ticker)

class StockLauncher(TickerManager):
    def __init__(self):
        # Initialize the QMainWindow first
        QMainWindow.__init__(self)
        
        # Set up the tickers file path (go back to main Stocks directory)
        main_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        self.tickers_file = os.path.join(main_dir, 'Ticker_management', 'tickers.json')
        
        # Initialize the data manager for fetching stock data to parquet
        self.data_manager = StockDataManager(base_path=os.path.join(main_dir, 'data'))
        
        # Process any pending deletions on startup (deletes data for tickers removed 3+ days ago)
        self._process_pending_deletions_on_startup()
        
        # Track active fetch workers
        self.active_workers = []
        
        # Flag to track if we're in the middle of auto-updating data
        self.is_auto_updating = False
        self.data_update_complete = False
        
        # Set window properties
        self.setWindowTitle("Launch")
        self.setGeometry(150, 150, 800, 550)  # Landscape orientation with more height
        
        # Update the styling to match the official color scheme
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
                font-size: 12px;
                font-weight: bold;
                color: #E0E0E0;
                margin: 3px;
                background-color: transparent;
            }
            QPushButton {
                background-color: #1E1E1E;
                color: #E0E0E0;
                border: 2px solid #29B6F6;
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
            QPushButton:disabled {
                background-color: #1E1E1E;
                color: #777777;
                border-color: #2C2C2C;
            }
            QLineEdit {
                padding: 8px;
                font-size: 11px;
                border: 2px solid #2C2C2C;
                border-radius: 6px;
                margin: 2px;
                background-color: #1E1E1E;
                color: #E0E0E0;
                selection-background-color: #29B6F6;
                selection-color: #E0E0E0;
            }
            QLineEdit:focus {
                border-color: #29B6F6;
                background-color: #1E1E1E;
            }
            QLineEdit::placeholder {
                color: #B0B0B0;
            }
            QListWidget {
                border: 2px solid #2C2C2C;
                border-radius: 6px;
                background-color: #1E1E1E;
                color: #E0E0E0;
                font-size: 11px;
                margin: 2px;
                alternate-background-color: #121212;
                selection-background-color: #29B6F6;
                selection-color: #E0E0E0;
            }
            QListWidget::item {
                padding: 6px;
                border-bottom: 1px solid #2C2C2C;
                background-color: transparent;
            }
            QListWidget::item:selected {
                background-color: #29B6F6;
                color: #E0E0E0;
            }
            QListWidget::item:hover {
                background-color: #2C2C2C;
                color: #E0E0E0;
            }
            QMessageBox {
                background-color: #1E1E1E;
                color: #E0E0E0;
            }
            QMessageBox QPushButton {
                background-color: #29B6F6;
                color: #E0E0E0;
                padding: 6px 12px;
                border-radius: 4px;
                min-width: 60px;
            }
        """)
        
        self.customize_ui()
        
    def customize_ui(self):
        """Customize the UI for the launcher with landscape layout"""
        # Update the central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # Main horizontal layout (landscape)
        main_layout = QHBoxLayout(central_widget)
        main_layout.setSpacing(20)
        main_layout.setContentsMargins(20, 20, 20, 20)
        
        # LEFT SIDE - Controls and actions
        left_widget = QWidget()
        left_layout = QVBoxLayout(left_widget)
        left_layout.setSpacing(18)
        
        # Header section
        header_layout = QVBoxLayout()
        header_layout.setSpacing(12)
        
        # Main title
        title_label = QLabel("FinForge")
        title_font = QFont()
        title_font.setPointSize(22)
        title_font.setBold(True)
        title_label.setFont(title_font)
        title_label.setAlignment(Qt.AlignCenter)
        title_label.setStyleSheet("color: #E0E0E0; margin: 8px; padding: 4px; background-color: transparent;")
        title_label.setMinimumHeight(35)
        header_layout.addWidget(title_label)
        
        # Subtitle
        subtitle_label = QLabel("Select your stock tickers and launch your analysis dashboard")
        subtitle_label.setAlignment(Qt.AlignCenter)
        subtitle_label.setStyleSheet("color: #B0B0B0; font-size: 12px; padding: 5px; background-color: transparent;")
        subtitle_label.setWordWrap(True)
        header_layout.addWidget(subtitle_label)
        
        left_layout.addLayout(header_layout)
        
        # Ticker count info
        self.ticker_count_label = QLabel()
        self.ticker_count_label.setAlignment(Qt.AlignCenter)
        self.ticker_count_label.setStyleSheet("color: #E0E0E0; font-size: 14px; background-color: #1E1E1E; padding: 8px; border-radius: 6px; margin: 8px; border: 1px solid #2C2C2C;")
        left_layout.addWidget(self.ticker_count_label)
        
        # Add ticker section
        add_section = QVBoxLayout()
        add_label = QLabel("Add New Ticker:")
        add_section.addWidget(add_label)
        
        add_layout = QHBoxLayout()
        self.ticker_input = QLineEdit()
        self.ticker_input.setPlaceholderText("Enter ticker symbol (e.g., AAPL)")
        self.ticker_input.returnPressed.connect(self.add_ticker_and_update)
        add_layout.addWidget(self.ticker_input)
        
        add_button = QPushButton("Add")
        add_button.clicked.connect(self.add_ticker_and_update)
        add_layout.addWidget(add_button)
        
        add_section.addLayout(add_layout)
        left_layout.addLayout(add_section)
        
        # Management buttons
        mgmt_layout = QVBoxLayout()
        mgmt_layout.setSpacing(8)
        
        clear_button = QPushButton("Clear All")
        clear_button.clicked.connect(self.clear_all_and_update)
        mgmt_layout.addWidget(clear_button)
        
        left_layout.addLayout(mgmt_layout)
        
        # Add stretch to push launch button to bottom
        left_layout.addStretch()
        
        # Launch button (moved to bottom)
        launch_layout = QVBoxLayout()
        launch_layout.setSpacing(10)
        
        # Main launch button
        launch_button = QPushButton("Launch")
        launch_button.clicked.connect(self.launch_dashboard)
        launch_button.setStyleSheet("""
            QPushButton { 
                font-size: 14px; 
                font-weight: bold; 
                padding: 12px;
                margin: 4px;
            }
        """)
        launch_layout.addWidget(launch_button)
        
        left_layout.addLayout(launch_layout)
        
        # Status/info
        info_label = QLabel("Your tickers are automatically saved. Click 'Launch' to open dashboard with your selected stocks.")
        info_label.setAlignment(Qt.AlignCenter)
        info_label.setStyleSheet("color: #B0B0B0; font-size: 10px; font-style: italic; margin: 8px; padding: 8px; background-color: #1E1E1E; border-radius: 6px; border: 1px solid #2C2C2C;")
        info_label.setWordWrap(True)
        left_layout.addWidget(info_label)
        
        # Set fixed width for left side
        left_widget.setMaximumWidth(350)
        main_layout.addWidget(left_widget)
        
        # RIGHT SIDE - Ticker list
        right_widget = QWidget()
        right_widget.setStyleSheet("QWidget { background-color: #121212; }")
        right_layout = QVBoxLayout(right_widget)
        right_layout.setSpacing(10)
        right_layout.setContentsMargins(0, 0, 0, 0)
        
        # Ticker list header
        tickers_label = QLabel("Selected Tickers:")
        tickers_label.setStyleSheet("color: #E0E0E0; font-size: 14px; font-weight: bold; margin-bottom: 8px; background-color: transparent;")
        right_layout.addWidget(tickers_label)
        
        # Ticker list - completely rewritten
        self.tickers_list = QListWidget()
        self.tickers_list.setVerticalScrollBarPolicy(Qt.ScrollBarAsNeeded)
        self.tickers_list.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.tickers_list.setSelectionMode(QListWidget.SingleSelection)
        self.tickers_list.setSpacing(2)
        self.tickers_list.setStyleSheet("""
            QListWidget {
                border: 2px solid #2C2C2C;
                border-radius: 8px;
                background-color: #1E1E1E;
                color: #E0E0E0;
                font-size: 12px;
                padding: 8px;
                outline: none;
                selection-background-color: transparent;
            }
            QListWidget::item {
                padding: 0px;
                border: none;
                background-color: transparent;
                min-height: 38px;
                max-height: 38px;
                margin: 1px 0px;
                selection-background-color: transparent;
            }
            QListWidget::item:selected {
                background-color: transparent;
                border: none;
                outline: none;
            }
            QListWidget::item:hover {
                background-color: transparent;
                border: none;
            }
            QListWidget::item:focus {
                background-color: transparent;
                border: none;
                outline: none;
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
        right_layout.addWidget(self.tickers_list, 1)  # Give it stretch factor
        
        main_layout.addWidget(right_widget)
        
        # Load existing tickers
        self.load_tickers()
        
        # Update the ticker count after loading
        self.update_ticker_count()
        
    def load_tickers(self):
        """Load tickers from JSON file"""
        try:
            if os.path.exists(self.tickers_file):
                import json
                with open(self.tickers_file, 'r') as f:
                    data = json.load(f)
                    tickers = data.get('tickers', [])
            else:
                # Default tickers if file doesn't exist
                tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
                self.save_tickers_data(tickers)
            
            self.tickers_list.clear()
            for ticker in tickers:
                self.add_ticker_to_list(ticker.upper())
                
        except Exception as e:
            QMessageBox.warning(self, "Error", f"Error loading tickers: {str(e)}")
    
    def add_ticker_to_list(self, ticker):
        """Add a ticker to the list with custom widget"""
        # Create list item
        item = QListWidgetItem()
        item.setFlags(item.flags() & ~Qt.ItemIsSelectable)  # Disable selection
        
        # Create custom widget
        widget = TickerItemWidget(ticker, self)
        
        # Set size hint to match widget
        item.setSizeHint(widget.sizeHint())
        
        # Add to list and set widget
        self.tickers_list.addItem(item)
        self.tickers_list.setItemWidget(item, widget)
        
        # Ensure proper display
        self.tickers_list.repaint()
    
    def ticker_exists(self, ticker):
        """Check if ticker already exists in the list"""
        for i in range(self.tickers_list.count()):
            item = self.tickers_list.item(i)
            widget = self.tickers_list.itemWidget(item)
            if widget and widget.ticker == ticker:
                return True
        return False
    
    def update_ticker_in_list(self, old_ticker, new_ticker):
        """Update a ticker in the list (when ticker symbol is changed)"""
        # Schedule the old ticker's data for deletion (after 3 days)
        if old_ticker != new_ticker:
            self.data_manager.schedule_ticker_deletion(old_ticker)
        self.save_tickers()
        self.update_ticker_count()
    
    def remove_ticker_from_list(self, ticker):
        """Remove a ticker from the list and schedule its data for deletion"""
        for i in range(self.tickers_list.count()):
            item = self.tickers_list.item(i)
            widget = self.tickers_list.itemWidget(item)
            if widget and widget.ticker == ticker:
                self.tickers_list.takeItem(i)
                break
        
        # Schedule the ticker's data for deletion (after 3 days)
        self.data_manager.schedule_ticker_deletion(ticker)
        
        self.save_tickers()
        self.update_ticker_count()
    
    def save_tickers_data(self, tickers=None):
        """Save tickers to JSON file"""
        try:
            if tickers is None:
                tickers = []
                for i in range(self.tickers_list.count()):
                    item = self.tickers_list.item(i)
                    widget = self.tickers_list.itemWidget(item)
                    if widget:
                        tickers.append(widget.ticker)
            
            import datetime
            import json
            data = {
                'tickers': tickers,
                'last_updated': str(datetime.datetime.now())
            }
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(self.tickers_file), exist_ok=True)
            
            with open(self.tickers_file, 'w') as f:
                json.dump(data, f, indent=2)
                
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Error saving tickers: {str(e)}")
    
    # Override the parent save_tickers method
    def save_tickers(self, tickers=None):
        """Save tickers using our custom method"""
        self.save_tickers_data(tickers)
    
    def fetch_ticker_data(self, ticker):
        """Fetch data for a single ticker in background thread and save to parquet"""
        worker = DataFetchWorker(ticker, self.data_manager)
        worker.finished.connect(self.on_fetch_finished)
        worker.progress.connect(self.on_fetch_progress)
        self.active_workers.append(worker)
        worker.start()
    
    def on_fetch_finished(self, ticker, success, message):
        """Handle completion of data fetch"""
        if success:
            print(f"Successfully fetched and saved data for {ticker}")
        else:
            print(f"Warning: {message}")
        
        # Clean up finished workers
        self.active_workers = [w for w in self.active_workers if w.isRunning()]
    
    def on_fetch_progress(self, message):
        """Handle progress updates from data fetch"""
        print(message)
    
    def _process_pending_deletions_on_startup(self):
        """Process any pending deletions when the app starts"""
        try:
            deleted = self.data_manager.process_pending_deletions()
            if deleted:
                print(f"Startup cleanup: Deleted data for {len(deleted)} ticker(s): {', '.join(deleted)}")
        except Exception as e:
            print(f"Warning: Could not process pending deletions: {e}")
    
    def _get_data_age_days(self):
        """Get the age of the stock price data in days (returns None if no data exists)"""
        try:
            import pandas as pd
            from pathlib import Path
            
            prices_dir = Path(self.data_manager.base_path) / 'prices'
            
            if not prices_dir.exists():
                return None
            
            # Find the most recent date across all ticker files
            max_date = None
            parquet_files = list(prices_dir.glob('*.parquet'))
            
            if not parquet_files:
                return None
            
            for parquet_file in parquet_files:
                try:
                    df = pd.read_parquet(parquet_file)
                    if 'Date' in df.columns:
                        df['Date'] = pd.to_datetime(df['Date'])
                        file_max_date = df['Date'].max()
                        if max_date is None or file_max_date > max_date:
                            max_date = file_max_date
                except Exception as e:
                    print(f"Warning: Could not read date from {parquet_file.name}: {e}")
                    continue
            
            if max_date is None:
                return None
            
            # Calculate age in days
            age = (pd.Timestamp.now() - max_date).days
            return age
            
        except Exception as e:
            print(f"Warning: Could not determine data age: {e}")
            return None
    
    def _check_and_auto_update_data(self):
        """Check if data is stale and auto-update if needed (called when window is shown)"""
        try:
            if self.is_auto_updating or self.data_update_complete:
                return  # Don't run if already updating or already checked
            
            data_age = self._get_data_age_days()
            
            # If data is more than 1 day old, suggest updating
            if data_age is not None and data_age > 1:
                print(f"Data is {data_age} days old - fetching fresh data...")
                self.is_auto_updating = True
                
                # Load tickers first
                self.load_tickers()
                
                if self.tickers_list.count() > 0:
                    # Fetch data for all tickers silently
                    for i in range(self.tickers_list.count()):
                        item = self.tickers_list.item(i)
                        widget = self.tickers_list.itemWidget(item)
                        if widget:
                            self.fetch_ticker_data(widget.ticker)
                    
                    print(f"Auto-update started for {self.tickers_list.count()} ticker(s)")
                
                self.is_auto_updating = False
                self.data_update_complete = True
            else:
                self.data_update_complete = True
                if data_age is not None:
                    print(f"Data is current ({data_age} days old)")
                else:
                    print("No price data found yet")
                    
        except Exception as e:
            print(f"Warning: Error checking data age: {e}")
            self.data_update_complete = True
    
    def showEvent(self, event):
        """Override showEvent to check data when window first appears"""
        super().showEvent(event)
        # Check data age only once when window first shows
        if not self.data_update_complete:
            QTimer.singleShot(500, self._check_and_auto_update_data)
    
    def add_ticker(self):
        """Add a new ticker to the list and fetch its data"""
        ticker = self.ticker_input.text().strip().upper()
        
        if not ticker:
            QMessageBox.warning(self, "Invalid Input", "Please enter a ticker symbol.")
            return
        
        if not ticker.isalpha() or len(ticker) > 5:
            QMessageBox.warning(self, "Invalid Ticker", "Ticker should be 1-5 letters only.")
            return
        
        # Check if ticker already exists
        if self.ticker_exists(ticker):
            QMessageBox.information(self, "Duplicate Ticker", f"Ticker {ticker} already exists.")
            self.ticker_input.clear()
            return
        
        # Cancel any pending deletion for this ticker (in case it was removed and re-added)
        self.data_manager.cancel_ticker_deletion(ticker)
        
        self.add_ticker_to_list(ticker)
        self.ticker_input.clear()
        self.save_tickers()
        
        # Automatically fetch data for the new ticker and save to parquet
        self.fetch_ticker_data(ticker)
    
    def remove_ticker(self):
        """Remove selected ticker from the list"""
        current_item = self.tickers_list.currentItem()
        if current_item:
            widget = self.tickers_list.itemWidget(current_item)
            if widget:
                ticker = widget.ticker
                reply = QMessageBox.question(self, "Confirm Removal", 
                                           f"Are you sure you want to remove {ticker}?",
                                           QMessageBox.Yes | QMessageBox.No)
                
                if reply == QMessageBox.Yes:
                    self.tickers_list.takeItem(self.tickers_list.row(current_item))
                    self.save_tickers()
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
    
    def add_ticker_and_update(self):
        """Add ticker and update the counter"""
        self.add_ticker()
        self.update_ticker_count()
        
    def remove_ticker_and_update(self):
        """Remove ticker and update the counter"""
        self.remove_ticker()
        self.update_ticker_count()
        
    def clear_all_and_update(self):
        """Clear all tickers and update the counter"""
        self.clear_all_tickers()
        self.update_ticker_count()
        
    def update_ticker_count(self):
        """Update the ticker count display"""
        count = self.tickers_list.count()
        if count == 0:
            self.ticker_count_label.setText("No tickers selected. Add some tickers to start!")
        elif count == 1:
            self.ticker_count_label.setText("1 ticker selected and ready for analysis")
        else:
            self.ticker_count_label.setText(f"{count} tickers selected and ready for analysis")
    
    def launch_dashboard(self):
        """Launch the Excel dashboard with selected tickers"""
        if self.tickers_list.count() == 0:
            QMessageBox.warning(self, "No Tickers Selected", 
                              "Please add at least one ticker before launching the dashboard.")
            return
        
        # Save current tickers
        self.save_tickers()
        
        # Find the Excel workbook
        excel_files = [
            "FinForge.xlsm",
            "FinForge.xlsx"
        ]
        
        excel_path = None
        for filename in excel_files:
            # Look in the main Stocks directory, not the launch subdirectory
            main_dir = Path(__file__).parent.parent.parent
            potential_path = main_dir / filename
            if potential_path.exists():
                excel_path = potential_path
                break
        
        if not excel_path:
            # If no existing file, ask user if they want to create one from template
            reply = QMessageBox.question(self, "Excel File Not Found", 
                                       "No Excel dashboard found. Would you like to create a new one from template?",
                                       QMessageBox.Yes | QMessageBox.No)
            if reply == QMessageBox.Yes:
                excel_path = self.create_new_workbook()
                if not excel_path:
                    return
            else:
                return
        
        try:
            # Show launching message
            QMessageBox.information(self, "Launching Dashboard", 
                                  f"Opening Excel dashboard with {self.tickers_list.count()} tickers...\n\n"
                                  f"Dashboard: {excel_path.name}")
            
            # Open Excel file
            if os.name == 'nt':  # Windows
                os.startfile(excel_path)
            else:  # macOS/Linux
                subprocess.run(['open' if sys.platform == 'darwin' else 'xdg-open', excel_path])
            
            # Close the launcher after a short delay
            QTimer.singleShot(2000, self.close)
            
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Could not open Excel dashboard:\n{str(e)}")
    
    def fetch_data_first(self):
        """Fetch fresh data before launching"""
        if self.tickers_list.count() == 0:
            QMessageBox.warning(self, "No Tickers", "Please add some tickers first.")
            return
        
        reply = QMessageBox.question(self, "Fetch Data", 
                                   f"Fetch fresh data for {self.tickers_list.count()} tickers?\n"
                                   "This may take a few minutes.",
                                   QMessageBox.Yes | QMessageBox.No)
        
        if reply == QMessageBox.Yes:
            try:
                # Save tickers first
                self.save_tickers()
                
                # Show progress message
                QMessageBox.information(self, "Fetching Data", 
                                      "Data fetching started! Please wait while we gather the latest information...\n\n"
                                      "The dashboard will open automatically when complete.")
                
                # Import and run fetch_stocks
                import sys
                main_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
                sys.path.append(main_dir)
                
                # Execute fetch_stocks by running it as a script using pythonw to avoid console window
                import subprocess
                fetch_script_path = os.path.join(main_dir, 'fetch_stocks.py')
                
                # Use pythonw to avoid showing console window
                if os.name == 'nt':  # Windows
                    subprocess.run([sys.executable.replace('python.exe', 'pythonw.exe'), fetch_script_path], cwd=main_dir)
                else:
                    subprocess.run([sys.executable, fetch_script_path], cwd=main_dir)
                
                # After fetching, launch dashboard
                QTimer.singleShot(3000, self.launch_dashboard)
                
            except Exception as e:
                QMessageBox.critical(self, "Error", f"Error fetching data: {str(e)}")
    
    def open_advanced_manager(self):
        """Open the full ticker manager - REMOVED FUNCTIONALITY"""
        # This method is no longer used but kept for compatibility
        pass
    
    def create_new_workbook(self):
        """Create a new Excel workbook from template"""
        try:
            import sys
            sys.path.append(os.path.dirname(os.path.dirname(__file__)))
            from Internal.cheking_and_structure.create_sheet import create_workbook_from_template
            
            # Create new workbook from template
            excel_path = create_workbook_from_template()
            QMessageBox.information(self, "Success", 
                                  f"New Excel workbook created successfully!\n\n{excel_path.name}")
            return excel_path
            
        except FileNotFoundError as e:
            QMessageBox.critical(self, "Template Not Found", 
                               f"Could not find template file.\n\n{str(e)}")
            return None
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Could not create new workbook: {str(e)}")
            return None

def main():
    app = QApplication.instance() or QApplication(sys.argv)
    app.setApplicationName("Stock Portfolio Launcher")
    
    # Set application icon if available (look in main directory)
    main_dir = Path(__file__).parent.parent.parent
    icon_path = main_dir / "stock_icon.ico"
    if icon_path.exists():
        app.setWindowIcon(QIcon(str(icon_path)))
    
    window = StockLauncher()
    window.show()
    
    app.exec()

if __name__ == "__main__":
    main()
