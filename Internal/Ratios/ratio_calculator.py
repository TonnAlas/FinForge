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
DATA_DIR = Path(__file__).parent.parent.parent / "data" / "fundamentals"


class RatioCalculator:
    """Calculate ratios using Parquet data"""
    
    def __init__(self, workbook):
        self.wb = workbook
        self.ws = None
        self.ratios_config = {}
        self.assignments = {}  # {column: ratio_name}
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
        """Initialize calculator with Excel data"""
        try:
            # Get Ratios sheet
            self.ws = self.wb.sheets[RATIOS_SHEET]
            
            # Load ratio configurations
            self.ratios_config = get_ratios_from_config()
            if not self.ratios_config:
                raise ValueError("No ratios found in configuration")
            
            # Read assignments from Row 4
            row4_data = self.ws.range("B4:Z4").value
            if row4_data:
                for idx, value in enumerate(row4_data):
                    if value and value in self.ratios_config:
                        col_letter = chr(66 + idx)  # B=66, C=67, etc.
                        self.assignments[col_letter] = value
            
            if not self.assignments:
                raise ValueError("No ratios assigned to columns")
            
            # Read tickers from Column A (starting Row 7)
            # Exclude "CUSTOM" entries - those are user-managed rows
            col_a_data = self.ws.range("A7:A100").value
            self.tickers = [t for t in col_a_data if t and isinstance(t, str) and t.strip() and t.strip().upper() != "CUSTOM"]
            
            if not self.tickers:
                raise ValueError("No tickers found in column A (starting from row 7)")
            
            # Load Parquet data
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
    
    def _clear_empty_ticker_rows(self):
        """Clear ratio values from rows where the ticker has been removed"""
        try:
            # Read column A from row 7 to 100 to find empty ticker cells
            col_a_data = self.ws.range("A7:A100").value
            
            if not col_a_data:
                return
            
            # Get all assigned column letters
            assigned_columns = list(self.assignments.keys())
            if not assigned_columns:
                return
            
            # Check each row
            for row_idx, ticker_value in enumerate(col_a_data):
                row = 7 + row_idx
                
                # Skip CUSTOM rows - preserve their values
                if isinstance(ticker_value, str) and ticker_value.strip().upper() == "CUSTOM":
                    continue
                
                # If ticker cell is empty, clear all ratio values in that row
                if not ticker_value or (isinstance(ticker_value, str) and not ticker_value.strip()):
                    for col_letter in assigned_columns:
                        cell = f"{col_letter}{row}"
                        cell_range = self.ws.range(cell)
                        # Only clear if cell has a value
                        if cell_range.value is not None:
                            cell_range.value = None
                            print(f"Cleared {cell} (no ticker in row)")
                            
        except Exception as e:
            print(f"Warning: Error clearing empty ticker rows: {e}")

    def calculate_all_ratios(self):
        """Calculate all assigned ratios for all tickers"""
        try:
            # First, clear values in rows where ticker has been removed
            self._clear_empty_ticker_rows()
            
            total_calculations = len(self.tickers) * len(self.assignments)
            current = 0
            errors = []  # Track any errors during calculation
            
            # Create progress dialog with dark theme
            app = QApplication.instance() or QApplication(sys.argv)
            progress = QProgressDialog(
                "Calculating ratios...",
                "Cancel",
                0,
                total_calculations
            )
            progress.setWindowTitle("Ratio Calculator")
            progress.setWindowModality(Qt.WindowModal)
            
            # Apply dark theme to progress dialog
            progress.setStyleSheet("""
                QProgressDialog {
                    background-color: #2d2d2d;
                }
                QProgressDialog QLabel {
                    color: #e0e0e0;
                    font-size: 11pt;
                }
                QProgressDialog QPushButton {
                    background-color: #0d7377;
                    color: #ffffff;
                    border: none;
                    border-radius: 5px;
                    padding: 8px 16px;
                    font-weight: bold;
                }
                QProgressDialog QPushButton:hover {
                    background-color: #14a085;
                }
                QProgressBar {
                    background-color: #1e1e1e;
                    border: 1px solid #3e3e3e;
                    border-radius: 5px;
                    text-align: center;
                }
                QProgressBar::chunk {
                    background-color: #0d7377;
                    border-radius: 4px;
                }
            """)
            
            progress.show()
            
            # Calculate for each ticker
            for ticker_idx, ticker in enumerate(self.tickers):
                row = 7 + ticker_idx  # Start from row 7
                
                # Calculate each assigned ratio
                for col_letter, ratio_name in self.assignments.items():
                    if progress.wasCanceled():
                        return False
                    
                    try:
                        # Calculate ratio
                        value = self.calculate_ratio(ratio_name, ticker)
                        
                        # Write to Excel
                        cell = f"{col_letter}{row}"
                        cell_range = self.ws.range(cell)
                        
                        if isinstance(value, (int, float)):
                            # Numeric value - set value and format
                            cell_range.value = value
                            try:
                                cell_range.number_format = '0.0000'
                            except Exception as fmt_err:
                                print(f"⚠️ Format warning for {cell}: {fmt_err}")
                                pass  # If format fails, continue with default
                        else:
                            # String value (N/A, ERROR, DIV/0) - just set value
                            cell_range.value = str(value)
                            try:
                                cell_range.number_format = 'General'  # Reset to general format
                            except:
                                pass
                    
                    except Exception as cell_err:
                        # Track error but continue with other calculations
                        error_msg = f"Error writing {ratio_name} for {ticker} to {col_letter}{row}: {cell_err}"
                        print(f"❌ {error_msg}")
                        errors.append(error_msg)
                        
                        # Write error indicator to cell
                        try:
                            self.ws.range(f"{col_letter}{row}").value = "ERROR"
                        except:
                            pass
                    
                    current += 1
                    progress.setValue(current)
                    progress.setLabelText(
                        f"Calculating {ratio_name} for {ticker}...\n"
                        f"({current}/{total_calculations})"
                    )
                    
                    app.processEvents()
            
            progress.close()
            
            # Save workbook
            try:
                self.wb.save()
            except Exception as save_err:
                print(f"⚠️ Warning: Could not save workbook: {save_err}")
                # Don't fail if save fails - user can save manually
            
            # Report any errors that occurred
            if errors:
                print(f"\n⚠️ Completed with {len(errors)} errors:")
                for err in errors[:5]:  # Show first 5 errors
                    print(f"  - {err}")
                if len(errors) > 5:
                    print(f"  ... and {len(errors) - 5} more errors")
            
            return True
            
        except Exception as e:
            print(f"❌ Critical error in calculate_all_ratios: {e}")
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
                f"✓ Calculated {len(calculator.assignments)} ratios for {len(calculator.tickers)} tickers"
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


if __name__ == "__main__":
    calculate_ratios()
