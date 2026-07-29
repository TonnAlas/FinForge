"""
Ratio Calculator - Parquet Data Source

Calculates financial ratios using data from Parquet storage.
Fast, reliable, and efficient data access.
"""

import sys
from pathlib import Path
import pandas as pd
import xlwings as xw
from PySide6.QtWidgets import QApplication, QMessageBox, QProgressDialog
from PySide6.QtCore import Qt

# Add parent to path
sys.path.append(str(Path(__file__).parent.parent.parent))
from Internal.Ratios.ratio_handeling import get_ratios_from_config

# Configuration
RATIOS_SHEET = "Ratios"
RATIO_DATA_START_ROW = 7      # Row where ratio names begin in Column A (like BS/IS)
TICKER_ROW = 4                # Row where ticker symbols are placed (like BS/IS)
DATA_DIR = Path(__file__).parent.parent.parent / "data" / "fundamentals"


class RatioCalculator:
    """Calculate ratios using Parquet data"""
    
    def __init__(self, workbook):
        self.wb = workbook
        self.ws = None
        self.ratios_config = {}
        self.assigned_ratios = []   # Ratio names from Column A (row 7+)
        self.ticker_columns = []    # [(col_letter, ticker)] from Row 4
        self.tickers = []
        self.balance_sheet_data = None
        self.income_statement_data = None
    
    def load_parquet_data(self):
        """Load financial data from Parquet files (new per-ticker structure)"""
        try:
            # Check if data directory exists
            if not DATA_DIR.exists():
                raise FileNotFoundError(f"Data directory not found: {DATA_DIR}\n\nPlease run data import first.")
            
            # New structure: fundamentals/{data_type}/{TICKER}.parquet
            # Load all balance sheet data from individual ticker files
            bs_dir = DATA_DIR / "balance_sheet"
            if bs_dir.exists() and bs_dir.is_dir():
                bs_frames = []
                for ticker_file in bs_dir.glob("*.parquet"):
                    df = pd.read_parquet(ticker_file)
                    bs_frames.append(df)
                if bs_frames:
                    self.balance_sheet_data = pd.concat(bs_frames, ignore_index=True)
                    print(f"Loaded balance sheet data: {self.balance_sheet_data.shape}")
            
            # Fallback: check old structure
            if self.balance_sheet_data is None:
                bs_path = DATA_DIR / "balance_sheet.parquet"
                if bs_path.exists():
                    self.balance_sheet_data = pd.read_parquet(bs_path)
                    print(f"Loaded balance sheet data (old format): {self.balance_sheet_data.shape}")
            
            if self.balance_sheet_data is None:
                raise FileNotFoundError(f"Balance sheet data not found.\n\nExpected location: data/fundamentals/balance_sheet/{'{TICKER}'}.parquet\nPlease import balance sheet data first.")
            
            # Load all income statement data from individual ticker files
            is_dir = DATA_DIR / "income_statement"
            if is_dir.exists() and is_dir.is_dir():
                is_frames = []
                for ticker_file in is_dir.glob("*.parquet"):
                    df = pd.read_parquet(ticker_file)
                    is_frames.append(df)
                if is_frames:
                    self.income_statement_data = pd.concat(is_frames, ignore_index=True)
                    print(f"Loaded income statement data: {self.income_statement_data.shape}")
            
            # Fallback: check old structure
            if self.income_statement_data is None:
                is_path = DATA_DIR / "income_statement.parquet"
                if is_path.exists():
                    self.income_statement_data = pd.read_parquet(is_path)
                    print(f"Loaded income statement data (old format): {self.income_statement_data.shape}")
            
            if self.income_statement_data is None:
                raise FileNotFoundError(f"Income statement data not found.\n\nExpected location: data/fundamentals/income_statement/{'{TICKER}'}.parquet\nPlease import income statement data first.")
            
            return True
            
        except Exception as e:
            print(f"Error loading Parquet data: {e}")
            raise  # Re-raise to show detailed error to user
    
    def initialize(self):
        """Initialize calculator with Excel data.
        
        New layout (matching BS/IS sheets):
          Row 4:     Ticker symbols in columns B-Z (like BS/IS)
          Row 7+:    Ratio names in Column A, calculated values in B-Z
          
        INDEX columns are populated with the ratio names from Column A.
        CUSTOM columns are left untouched for user-entered data.
        """
        try:
            self.ws = self.wb.sheets[RATIOS_SHEET]
            self.ratios_config = get_ratios_from_config()
            if not self.ratios_config:
                raise ValueError("No ratios found in configuration")

            # Read assigned ratios from Column A (starting RATIO_DATA_START_ROW)
            col_a_data = self.ws.range(f"A{RATIO_DATA_START_ROW}:A200").value
            self.assigned_ratios = []
            if col_a_data:
                for item in col_a_data:
                    if item and isinstance(item, str) and item.strip() in self.ratios_config:
                        self.assigned_ratios.append(item.strip())

            if not self.assigned_ratios:
                raise ValueError("No assigned ratios found in Column A (starting from row 7)")

            # Read row 4 headers and classify columns
            row4_data = self.ws.range("B4:Z4").value
            self.ticker_columns = []
            self.index_columns = []
            self.custom_columns = []
            if row4_data:
                for idx, value in enumerate(row4_data):
                    if value and isinstance(value, str):
                        header = value.strip().upper()
                        col_letter = chr(66 + idx)  # B=66, C=67, etc.
                        if header == "INDEX":
                            self.index_columns.append(col_letter)
                        elif header == "CUSTOM":
                            self.custom_columns.append(col_letter)
                        elif header:
                            self.ticker_columns.append((col_letter, header))

            self.tickers = [t for _, t in self.ticker_columns]
            if not self.ticker_columns:
                raise ValueError("No tickers found in row 4")

            if not self.load_parquet_data():
                raise ValueError("Failed to load Parquet data files")

            return True

        except Exception as e:
            print(f"Initialization error: {e}")
            raise
    
    def parse_ratio_formula(self, formula):
        """
        Parse ratio formula to extract components
        Supports: Division (/), Subtraction (-), Addition (+), Multiplication (*)
        Format: "BS: Item Name / IS: Item Name"
        Also supports single-field formulas: "BS: Item Name" (no operation)
        Also supports numeric literals: "BS: Net Debt / 2"
        
        Returns: (operation, (left_sheet, left_item), (right_sheet, right_item))
                 For single-field formulas: ('SINGLE', (sheet_type, item_name), None)
                 For numeric literals: sheet_type will be 'NUMBER' and item will be the numeric value
        """
        try:
            def parse_component(text):
                """Extract sheet type and item name, or detect numeric literal"""
                text = text.strip()
                # Remove leading '=' if present
                if text.startswith('='):
                    text = text[1:].strip()
                
                # Check if it's a numeric literal
                try:
                    numeric_value = float(text)
                    return 'NUMBER', str(numeric_value)
                except ValueError:
                    pass
                
                if ':' in text:
                    sheet_type, item = text.split(':', 1)
                    return sheet_type.strip().upper(), item.strip()
                return None, text.strip()
            
            # Normalize formula: remove newlines and extra spaces, remove leading '='
            formula = ' '.join(formula.split())  # Collapse whitespace/newlines
            if formula.startswith('='):
                formula = formula[1:].strip()
            
            # Remove bracket content temporarily to avoid false operator detection
            # E.g., "P: Close Price [-22D]" should not detect '-' as subtraction
            bracket_content = {}
            bracket_idx = 0
            
            def replace_brackets(match):
                nonlocal bracket_idx
                placeholder = f"__BRACKET_{bracket_idx}__"
                bracket_content[placeholder] = match.group(0)
                bracket_idx += 1
                return placeholder
            
            import re
            formula_no_brackets = re.sub(r'\[[^\]]*\]', replace_brackets, formula)
            
            # Detect operation type (now without bracket confusion)
            operation = None
            parts = None
            for op in ['/', '-', '+', '*']:
                if op in formula_no_brackets:
                    operation = op
                    parts = formula_no_brackets.split(op)
                    if len(parts) == 2:
                        break
            
            # Restore brackets in parts
            def restore_brackets(text):
                for placeholder, original in bracket_content.items():
                    text = text.replace(placeholder, original)
                return text
            
            # Single-field formula (no operation) - just return the value
            if not operation:
                left_sheet, left_item = parse_component(formula)
                return 'SINGLE', (left_sheet, left_item), None
            
            if len(parts) != 2:
                print(f"Invalid formula format: {formula}")
                return None, None, None
            
            # Restore brackets in parts before parsing
            left_part = restore_brackets(parts[0].strip())
            right_part = restore_brackets(parts[1].strip())
            
            left_sheet, left_item = parse_component(left_part)
            right_sheet, right_item = parse_component(right_part)
            
            return operation, (left_sheet, left_item), (right_sheet, right_item)
            
        except Exception as e:
            print(f"❌ Error parsing formula '{formula}': {e}")
            return None, None, None
    
    def get_financial_value(self, ticker, sheet_type, item_name, recursion_depth=0):
        """
        Get financial value from Parquet data or calculate from another ratio
        
        Args:
            ticker: Stock ticker symbol
            sheet_type: 'BS' for balance sheet, 'IS' for income statement, 'RATIO' for existing ratio, 'NUMBER' for numeric literal, 'P' for price data
            item_name: Financial item name, ratio name, numeric value as string, or price field name
            recursion_depth: Tracks recursion to prevent infinite loops
        
        Returns: Numeric value or None
        """
        try:
            # Prevent infinite recursion (max 10 levels deep)
            if recursion_depth > 10:
                print(f"⚠️ Max recursion depth exceeded for {item_name}")
                return None
            
            # Handle NUMBER type - just return the numeric value
            if sheet_type == 'NUMBER':
                try:
                    return float(item_name)
                except ValueError:
                    print(f"⚠️ Invalid number: {item_name}")
                    return None
            
            # Handle RATIO: references - calculate the referenced ratio
            if sheet_type == 'RATIO':
                ratio_name = item_name.strip()
                ratio_data = self.ratios_config.get(ratio_name)
                if not ratio_data:
                    print(f"⚠️ Referenced ratio '{ratio_name}' not found")
                    return None
                
                # Recursively calculate the referenced ratio
                result = self._calculate_ratio_internal(ratio_name, ticker, recursion_depth + 1)
                if isinstance(result, (int, float)):
                    return float(result)
                return None
            
            # Handle PRICE data (P: High Price, P: Open Price [-15D], etc.)
            if sheet_type == 'P':
                print(f"DEBUG: Getting PRICE data for {ticker}, field: {item_name}")
                # Load price data for this ticker
                prices_dir = Path(__file__).parent.parent.parent / "data" / "prices"
                price_file = prices_dir / f"{ticker.upper()}.parquet"
                
                if not price_file.exists():
                    print(f"Price data not found for ticker: {ticker}")
                    return None
                
                try:
                    import re
                    price_df = pd.read_parquet(price_file)
                    
                    if price_df.empty:
                        print(f"No price data available for {ticker}")
                        return None
                    
                    # Ensure Date column is datetime and sorted
                    if 'Date' in price_df.columns:
                        price_df['Date'] = pd.to_datetime(price_df['Date'])
                        price_df = price_df.sort_values('Date').reset_index(drop=True)
                    
                    # Parse item_name for date offset syntax: "Close Price [-15D]"
                    item_clean = item_name.strip().replace("P:", "").strip()
                    days_offset = 0
                    
                    # Check for [-XD] pattern (days ago)
                    offset_match = re.search(r'\[[-]?(\d+)D\]', item_clean, re.IGNORECASE)
                    if offset_match:
                        days_offset = int(offset_match.group(1))
                        # Remove the offset from field name
                        item_clean = re.sub(r'\s*\[[-]?\d+D\]', '', item_clean, flags=re.IGNORECASE).strip()
                    
                    item_lower = item_clean.lower()
                    
                    # Handle calculated fields: Change and Change Percent
                    # These compare current Close to Close at days_offset
                    if item_lower in ['change', 'price change']:
                        # Calculate price change: Current Close - Close at offset
                        current_idx = len(price_df) - 1
                        past_idx = current_idx - days_offset if days_offset > 0 else current_idx - 1
                        
                        if past_idx < 0:
                            print(f"Not enough data for Change calculation ({ticker})")
                            return None
                        
                        current_close = price_df['Close'].iloc[current_idx]
                        past_close = price_df['Close'].iloc[past_idx]
                        
                        if pd.isna(current_close) or pd.isna(past_close):
                            return None
                        
                        return float(current_close - past_close)
                    
                    if item_lower in ['change percent', 'change %', 'percent change', 'price change percent']:
                        # Calculate price change percent: (Current - Past) / Past * 100
                        current_idx = len(price_df) - 1
                        past_idx = current_idx - days_offset if days_offset > 0 else current_idx - 1
                        
                        if past_idx < 0:
                            print(f"Not enough data for Change Percent calculation ({ticker})")
                            return None
                        
                        current_close = price_df['Close'].iloc[current_idx]
                        past_close = price_df['Close'].iloc[past_idx]
                        
                        if pd.isna(current_close) or pd.isna(past_close) or past_close == 0:
                            return None
                        
                        return float((current_close - past_close) / past_close * 100)
                    
                    # Handle 'previous close' explicitly - always uses iloc[-2] (last completed trading day)
                    if item_lower == 'previous close':
                        if len(price_df) < 2:
                            print(f"Not enough price data for Previous Close ({ticker})")
                            return None
                        value = price_df['Close'].iloc[-2]
                        if pd.isna(value):
                            print(f"No Previous Close value available for {ticker}")
                            return None
                        return float(value)
                    
                    # Map common price field names to parquet columns
                    price_field_map = {
                        'high price': 'High',
                        'high': 'High',
                        'low price': 'Low',
                        'low': 'Low',
                        'open price': 'Open',
                        'open': 'Open',
                        'close price': 'Close',
                        'close': 'Close',
                        'closing price': 'Close',
                        'adjusted close': 'Adj Close',
                        'adj close': 'Adj Close',
                        'volume': 'Volume',
                        'dividends': 'Dividends',
                        'stock splits': 'Stock Splits'
                    }
                    
                    # Find the matching column
                    parquet_column = price_field_map.get(item_lower)
                    
                    if not parquet_column or parquet_column not in price_df.columns:
                        # Try direct column name match
                        matching_cols = [col for col in price_df.columns if col.lower() == item_lower]
                        if matching_cols:
                            parquet_column = matching_cols[0]
                        else:
                            print(f"Price field '{item_clean}' not found for {ticker}")
                            print(f"   Available columns: {price_df.columns.tolist()}")
                            return None
                    
                    # Calculate the row index based on days offset
                    # days_offset=0 means latest, days_offset=15 means 15 trading days ago
                    row_index = len(price_df) - 1 - days_offset
                    
                    if row_index < 0:
                        print(f"Not enough historical data for {days_offset} days offset ({ticker})")
                        return None
                    
                    value = price_df[parquet_column].iloc[row_index]
                    
                    if pd.isna(value):
                        print(f"No value available for {item_clean} in {ticker} at offset {days_offset}")
                        return None
                    
                    return float(value)
                    
                except Exception as e:
                    print(f"Error loading price data for {ticker}: {e}")
                    return None
            
            # Select appropriate dataset for BS and IS
            if sheet_type == 'BS':
                df = self.balance_sheet_data
            elif sheet_type == 'IS':
                df = self.income_statement_data
            else:
                df = self.balance_sheet_data  # Default to BS
            
            # Filter by ticker
            ticker_data = df[df['ticker'].str.upper() == ticker.upper()]
            
            if ticker_data.empty:
                print(f"⚠️ No data found for ticker: {ticker}")
                return None
            
            # Find the item by matching the 'index' column (case-insensitive)
            item_lower = item_name.lower()
            
            # Try exact match first in 'index' column
            matching_rows = ticker_data[ticker_data['index'].str.lower() == item_lower]
            
            if matching_rows.empty:
                # Try partial match in 'index' column
                matching_rows = ticker_data[ticker_data['index'].str.lower().str.contains(item_lower, na=False)]
            
            if matching_rows.empty:
                print(f"⚠️ Item '{item_name}' not found for {ticker}")
                print(f"   Available items: {ticker_data['index'].tolist()[:5]}...")
                return None
            
            # Get the most recent value (first date column that's not NaN)
            date_columns = [col for col in matching_rows.columns if col not in ['index', 'ticker', 'last_updated']]
            
            for col in date_columns:
                value = matching_rows[col].iloc[0]
                if pd.notna(value):
                    try:
                        return float(value)
                    except (ValueError, TypeError):
                        continue
            
            print(f"⚠️ No valid data found for '{item_name}' ({ticker})")
            return None
            
        except Exception as e:
            print(f"❌ Error getting value for {ticker}, {item_name}: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def calculate_ratio(self, ratio_name, ticker):
        """
        Calculate a specific ratio for a ticker (public interface)
        
        Args:
            ratio_name: Name of the ratio
            ticker: Stock ticker
        
        Returns: Calculated ratio value or error string
        """
        return self._calculate_ratio_internal(ratio_name, ticker, recursion_depth=0)
    
    def _calculate_ratio_internal(self, ratio_name, ticker, recursion_depth=0):
        """
        Internal method to calculate a ratio with recursion tracking
        
        Args:
            ratio_name: Name of the ratio
            ticker: Stock ticker
            recursion_depth: Current recursion depth to prevent infinite loops
        
        Returns: Calculated ratio value or error string
        """
        try:
            # Prevent infinite recursion
            if recursion_depth > 10:
                return "ERROR: Circular reference"
            
            # Get ratio formula
            ratio_data = self.ratios_config.get(ratio_name)
            if not ratio_data:
                return "ERROR: Ratio not found"
            
            formula = ratio_data.get('formula', '')
            if not formula:
                return "ERROR: No formula"
            
            # Parse formula (returns: operation, left_info, right_info)
            operation, left_info, right_info = self.parse_ratio_formula(formula)
            if not operation or not left_info:
                return "ERROR: Invalid formula"
            
            left_sheet, left_item = left_info
            
            # Debug output for price data
            print(f"DEBUG: Calculating {ratio_name} for {ticker}")
            print(f"DEBUG: operation={operation}, left_sheet={left_sheet}, left_item={left_item}")
            
            # Handle single-field formulas (just return the value, no calculation)
            if operation == 'SINGLE':
                value = self.get_financial_value(ticker, left_sheet, left_item, recursion_depth)
                print(f"DEBUG: SINGLE value result = {value}")
                if value is None:
                    return "N/A"
                return round(value, 4) if isinstance(value, float) else value
            
            # For operations, we need right_info
            if not right_info:
                return "ERROR: Invalid formula"
            
            right_sheet, right_item = right_info
            
            # Get values (pass recursion_depth for RATIO: references)
            left_value = self.get_financial_value(ticker, left_sheet, left_item, recursion_depth)
            right_value = self.get_financial_value(ticker, right_sheet, right_item, recursion_depth)
            
            # Check for missing data
            if left_value is None or right_value is None:
                return "N/A"
            
            # Perform calculation based on operation
            if operation == '/':
                if right_value == 0:
                    return "DIV/0"
                result = left_value / right_value
            elif operation == '-':
                result = left_value - right_value
            elif operation == '+':
                result = left_value + right_value
            elif operation == '*':
                result = left_value * right_value
            else:
                return f"ERROR: Unknown operation '{operation}'"
            
            return round(result, 4)
            
        except Exception as e:
            print(f"❌ Error calculating {ratio_name} for {ticker}: {e}")
            import traceback
            traceback.print_exc()
            return "ERROR"
    
    def _clear_empty_ticker_columns(self):
        """Clear ratio values from columns where the ticker has been removed from row 4.
        
        Preserves CUSTOM columns (user-entered data) and INDEX columns
        (they are re-populated by calculate_all_ratios).
        """
        try:
            if not self.assigned_ratios:
                return
            row4_data = self.ws.range("B4:Z4").value
            active_columns = set()
            if row4_data:
                for idx, value in enumerate(row4_data):
                    if value and isinstance(value, str):
                        header = value.strip().upper()
                        if header and header not in ("INDEX", "CUSTOM", ""):
                            active_columns.add(chr(66 + idx))
                        elif header == "CUSTOM":
                            # Protect CUSTOM columns from being cleared
                            active_columns.add(chr(66 + idx))
            all_columns = [chr(66 + i) for i in range(25)]
            num_ratio_rows = len(self.assigned_ratios)
            for col_letter in all_columns:
                if col_letter not in active_columns:
                    for row_offset in range(num_ratio_rows):
                        row = RATIO_DATA_START_ROW + row_offset
                        cell = f"{col_letter}{row}"
                        cell_range = self.ws.range(cell)
                        if cell_range.value is not None:
                            cell_range.value = None
        except Exception as e:
            print(f"Warning: Error clearing empty ticker columns: {e}")

    def _clear_column_data(self, col_letter):
        """Clear data values from a single column (preserve formatting)."""
        num_rows = len(self.assigned_ratios)
        for row_offset in range(num_rows):
            row = RATIO_DATA_START_ROW + row_offset
            cell_range = self.ws.range(f"{col_letter}{row}")
            if cell_range.value is not None:
                cell_range.value = None

    def _write_index_items(self, col_letter):
        """Write ratio names from Column A into an INDEX column.
        
        This mirrors the _write_index_items pattern from the financial statement
        importers (balance sheet, income statement, cash flow).
        """
        print(f"  Writing INDEX items to column {col_letter}")
        
        row_index = RATIO_DATA_START_ROW
        for ratio_name in self.assigned_ratios:
            cell = f"{col_letter}{row_index}"
            cell_range = self.ws.range(cell)
            cell_range.value = ratio_name
            try:
                cell_range.font.bold = True
            except Exception:
                pass
            row_index += 1
        
        print(f"    Written {len(self.assigned_ratios)} INDEX items to column {col_letter}")

    def calculate_all_ratios(self):
        """Calculate all assigned ratios for all tickers.
        
        New layout (matching BS/IS sheets):
          Row 4:     Ticker symbols, INDEX, or CUSTOM in columns B-Z
          Row 7+:    Ratio names in Column A, calculated values in B-Z
          
        INDEX columns are populated with ratio names (mirroring BS/IS behavior).
        CUSTOM columns are left entirely untouched for user-entered data.
        """
        try:
            self._clear_empty_ticker_columns()
            
            # Handle INDEX columns: clear old data, then write ratio names
            for col_letter in self.index_columns:
                self._clear_column_data(col_letter)
                self._write_index_items(col_letter)
            
            total_calculations = len(self.ticker_columns) * len(self.assigned_ratios)
            current = 0
            errors = []

            app = QApplication.instance() or QApplication(sys.argv)
            progress = QProgressDialog("Calculating ratios...", "Cancel", 0, total_calculations)
            progress.setWindowTitle("Ratio Calculator")
            progress.setWindowModality(Qt.WindowModal)
            progress.setStyleSheet("""
                QProgressDialog { background-color: #2d2d2d; }
                QProgressDialog QLabel { color: #e0e0e0; font-size: 11pt; }
                QProgressDialog QPushButton { background-color: #0d7377; color: #ffffff; border: none; border-radius: 5px; padding: 8px 16px; font-weight: bold; }
                QProgressDialog QPushButton:hover { background-color: #14a085; }
                QProgressBar { background-color: #1e1e1e; border: 1px solid #3e3e3e; border-radius: 5px; text-align: center; }
                QProgressBar::chunk { background-color: #0d7377; border-radius: 4px; }
            """)
            progress.show()

            for col_letter, ticker in self.ticker_columns:
                for row_offset, ratio_name in enumerate(self.assigned_ratios):
                    if progress.wasCanceled():
                        return False
                    row = RATIO_DATA_START_ROW + row_offset
                    try:
                        value = self.calculate_ratio(ratio_name, ticker)
                        cell = f"{col_letter}{row}"
                        cell_range = self.ws.range(cell)
                        if isinstance(value, (int, float)):
                            cell_range.value = value
                            try:
                                cell_range.number_format = '0.0000'
                            except:
                                pass
                        else:
                            cell_range.value = str(value)
                            try:
                                cell_range.number_format = 'General'
                            except:
                                pass
                    except Exception as cell_err:
                        error_msg = f"Error writing {ratio_name} for {ticker} to {col_letter}{row}: {cell_err}"
                        print(f"Error: {error_msg}")
                        errors.append(error_msg)
                        try:
                            self.ws.range(f"{col_letter}{row}").value = "ERROR"
                        except:
                            pass
                    current += 1
                    progress.setValue(current)
                    progress.setLabelText(f"Calculating {ratio_name} for {ticker}... ({current}/{total_calculations})")
                    app.processEvents()

            progress.close()

            try:
                self.wb.save()
            except:
                pass

            if errors:
                print(f"\nCompleted with {len(errors)} errors:")
                for err in errors[:5]:
                    print(f"  - {err}")
                if len(errors) > 5:
                    print(f"  ... and {len(errors) - 5} more errors")
            return True
        except Exception as e:
            print(f"Critical error in calculate_all_ratios: {e}")
            import traceback
            traceback.print_exc()
            raise


def calculate_ratios():
    """Main function to calculate all ratios"""
    try:
        # Initialize app and apply dark theme for dialogs
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
            QMessageBox QPushButton:hover {
                background-color: #14a085;
            }
        """)
        
        # Get workbook
        wb = xw.Book.caller()
        
        # Create calculator
        calculator = RatioCalculator(wb)
        
        # Initialize
        calculator.initialize()
        
        # Calculate
        success = calculator.calculate_all_ratios()
        
        if success:
            QMessageBox.information(
                None,
                "Success",
                f"✓ Calculated {len(calculator.assigned_ratios)} ratios for {len(calculator.tickers)} tickers"
            )
        
    except Exception as e:
        app = QApplication.instance() or QApplication(sys.argv)
        QMessageBox.critical(
            None,
            "Calculation Error",
            f"Failed to calculate ratios:\n\n{str(e)}"
        )


@xw.sub
def refresh_ratios():
    """Excel-callable function to refresh/calculate all ratios"""
    calculate_ratios()


# ---------------------------------------------------------------------------
# Column A Management — called from ElectronHome terminal
# ---------------------------------------------------------------------------

WORKBOOK_PATH = Path(__file__).parent.parent.parent / "FinForge.xlsm"


def _open_workbook_readonly():
    """Open the workbook for read/write operations, handling hidden Excel."""
    try:
        wb = xw.Book(str(WORKBOOK_PATH))
    except Exception:
        app = xw.App(visible=False, add_book=False)
        wb = app.books.open(str(WORKBOOK_PATH))
    return wb


def sync_ratio_sheet_from_config(workbook):
    """Sync ratio names into Column A.

    Ratios with a 'row' field set are placed at that exact row position
    (sorted by row number); ratios without a row are auto-assigned to
    the remaining rows in order.

    Preserves CUSTOM columns (user-entered data) and INDEX columns
    (they are re-populated by the calculator during calculate_all_ratios).
    """
    ratios = get_ratios_from_config()
    ws = workbook.sheets[RATIOS_SHEET]

    # Clear data columns but preserve CUSTOM columns (user data)
    row4_data = ws.range("B4:Z4").value
    for idx in range(24):  # B-Z
        col_letter = chr(66 + idx)
        # Skip CUSTOM columns - never touch user data
        if row4_data and idx < len(row4_data):
            val = row4_data[idx]
            if val and isinstance(val, str) and val.strip().upper() == "CUSTOM":
                continue
        # Clear this column's data area
        ws.range(f"{col_letter}{RATIO_DATA_START_ROW}:{col_letter}200").clear_contents()

    # Also clear Column A (will be rewritten below)
    ws.range(f"A{RATIO_DATA_START_ROW}:A200").clear_contents()

    # Separate ratios with/without explicit row numbers
    named = []
    for name, data in ratios.items():
        raw_row = data.get('row', '') if isinstance(data, dict) else ''
        try:
            row_num = int(raw_row)
        except (ValueError, TypeError):
            row_num = None
        named.append((name, row_num))

    explicit = [(n, r) for n, r in named if r is not None]
    auto     = [n for n, r in named if r is None]
    explicit.sort(key=lambda x: x[1])
    ordered = [n for n, _ in explicit] + auto

    row = RATIO_DATA_START_ROW
    for name in ordered:
        ws.range(f"A{row}").value = name
        ws.range(f"A{row}").font.bold = True
        row += 1
    return ws


def refresh_ratios_from_terminal():
    """Refresh the Ratios sheet directly from the terminal workflow."""
    app = None
    try:
        try:
            workbook = xw.Book(str(WORKBOOK_PATH))
        except Exception:
            app = xw.App(visible=False, add_book=False)
            workbook = app.books.open(str(WORKBOOK_PATH))

        sync_ratio_sheet_from_config(workbook)

        calculator = RatioCalculator(workbook)
        calculator.initialize()
        calculator.calculate_all_ratios()
        workbook.save()
        return True

    except Exception as e:
        print(f"❌ Error refreshing ratios from terminal: {e}")
        raise

    finally:
        if app is not None:
            app.quit()


def get_sheet_ratio_names():
    """Return the list of ratio names currently in Column A of the Ratios sheet."""
    try:
        wb = _open_workbook_readonly()
        ws = wb.sheets[RATIOS_SHEET]
        col_a = ws.range(f"A{RATIO_DATA_START_ROW}:A200").value
        names = []
        if col_a:
            for item in col_a:
                if item and isinstance(item, str):
                    names.append(item.strip())
        wb.close()
        return names
    except Exception as e:
        print(f"Error reading sheet ratios: {e}")
        return []


def sync_assigned_ratios(ratio_names_json: str):
    """Set Column A of the Ratios sheet to exactly the given list of ratio names.
    
    Ratios with a 'row' field in the config are placed at that row position;
    ratios without one are auto-assigned to the remaining rows in order.
    Called from ElectronHome terminal via IPC. Accepts a JSON array string.
    """
    import json
    try:
        ratio_names = json.loads(ratio_names_json)
        if not isinstance(ratio_names, list):
            raise ValueError("Expected a JSON array of ratio names")
    except Exception as e:
        print(f"❌ Invalid ratio_names_json: {e}")
        return False

    all_ratios = get_ratios_from_config()
    named_list = []
    for name in ratio_names:
        entry = all_ratios.get(name, {})
        raw_row = entry.get('row', '') if isinstance(entry, dict) else ''
        try:
            row_num = int(raw_row)
        except (ValueError, TypeError):
            row_num = None
        named_list.append((name, row_num))

    explicit = [(n, r) for n, r in named_list if r is not None]
    auto = [n for n, r in named_list if r is None]
    explicit.sort(key=lambda x: x[1])
    ordered_names = [n for n, _ in explicit] + auto

    app = None
    try:
        try:
            wb = xw.Book(str(WORKBOOK_PATH))
        except Exception:
            app = xw.App(visible=False, add_book=False)
            wb = app.books.open(str(WORKBOOK_PATH))

        ws = wb.sheets[RATIOS_SHEET]
        clear_end = max(RATIO_DATA_START_ROW + 200, RATIO_DATA_START_ROW + len(ordered_names) + 10)
        
        # Clear data columns but preserve CUSTOM columns (user data)
        row4_data = ws.range("B4:Z4").value
        for idx in range(24):  # B-Z
            col_letter = chr(66 + idx)
            # Skip CUSTOM columns - never touch user data
            if row4_data and idx < len(row4_data):
                val = row4_data[idx]
                if val and isinstance(val, str) and val.strip().upper() == "CUSTOM":
                    continue
            # Clear this column's data area
            ws.range(f"{col_letter}{RATIO_DATA_START_ROW}:{col_letter}{clear_end}").clear_contents()
        
        # Also clear Column A (will be rewritten below)
        ws.range(f"A{RATIO_DATA_START_ROW}:A{clear_end}").clear_contents()
        
        row = RATIO_DATA_START_ROW
        for name in ordered_names:
            ws.range(f"A{row}").value = name
            ws.range(f"A{row}").font.bold = True
            row += 1
        wb.save()
        print(f"✓ Synced {len(ordered_names)} ratios to Column A")
        return True
    except Exception as e:
        print(f"❌ Error syncing assigned ratios: {e}")
        return False
    finally:
        if app is not None:
            app.quit()


if __name__ == "__main__":
    calculate_ratios()
