"""
Balance Sheet Data Importer

DESCRIPTION:
This module imports balance sheet data from Parquet storage files into the Excel 
balance sheets sheet. Handles multiple stock tickers with proper data organization
and Excel integration. Replicates functionality of xlwings backup but uses Parquet data.

INPUTS:
- Excel workbook: FinForge.xlsm with "balance sheets" sheet
- Ticker symbols: Located in row 4 of the Excel sheet
- Parquet files: Balance sheet data from Yahoo Finance
- Settings sheet: Custom configuration for INDEX items

OUTPUTS:
- Updated "balance sheets" Excel sheet with financial data
- Console output showing import progress and status
- Error highlighting for missing data (light red cells)
- INDEX column management with Settings sheet integration

DEPENDENCIES:
- xlwings: Excel integration and manipulation
- pandas: Data processing and handling
- data_management.stock_data_manager: StockDataManager class for Parquet data access

RELATED FILES:
- Uses: data_management/stock_data_manager.py for data retrieval
- Called by: Excel VBA ImportBalanceSheets() macro
- Writes to: FinForge.xlsm "balance sheets" sheet
- Reads from: Settings sheet for INDEX configuration
"""

import xlwings as xw
import pandas as pd
from pathlib import Path
import sys
import os
from collections import defaultdict

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from data_management.stock_data_manager import StockDataManager

# Font color definitions (RGB tuples for xlwings) - using text colors instead of background
RED_RGB = (255, 0, 0)      # Red text for missing data
DARK_RED_RGB = (139, 0, 0) # Dark red text for unavailable
YELLOW_RGB = (255, 255, 255)  # White text for empty values
NORMAL_RGB = (237, 125, 49)   # Orange text (#ED7D31) for normal/valid data

class BalanceSheetImporter:
    def __init__(self):
        # Get the project root directory (parent of Importing)
        project_root = Path(__file__).parent.parent
        data_path = project_root / "data"
        self.data_manager = StockDataManager(data_path)
        self.sheet_name = "balance sheets"
        self.data_type = "balance_sheet"
        self.START_ROW = 4  # Where tickers are listed
        self.DATA_START_ROW = 7  # Where financial line items begin
    
    def import_data(self):
        """
        Import balance sheet data from Parquet storage to Excel sheet
        """
        print(f"=== Starting Balance Sheet Import ===")
        
        try:
            # Connect to the Excel workbook
            try:
                wb = xw.Book.caller()
            except:
                # For testing outside Excel, try to connect to active workbook
                print("⚠️  Running outside Excel - attempting to connect to active workbook")
                wb = xw.books.active
                if wb is None:
                    print("❌ No active Excel workbook found. Please run from Excel or open FinForge.xlsm")
                    return
            
            ws = wb.sheets[self.sheet_name]
            
            # Get used range with safety limits
            try:
                max_col = min(ws.api.UsedRange.Columns.Count, 100)
            except:
                try:
                    max_col = min(ws.range('A1').current_region.columns.count, 100)
                except:
                    max_col = 100
            
            print(f"Processing up to column: {max_col}")
            
            # ALWAYS get valid items and populate Column A first
            valid_items = self._get_valid_items_and_populate_column_a(ws, wb)
            
            if valid_items is None or len(valid_items) == 0:
                print("Warning: Could not determine valid items for INDEX")
                valid_items = []
            
            # Clear all data columns before importing (preserve column A)
            self._clear_sheet_data(ws, len(valid_items) if valid_items else 200)
            
            # Process all columns (including INDEX columns)
            ticker_counter = defaultdict(int)
            success_count = 0
            
            for col_index in range(2, max_col + 1):  # Start from column 2 (skip column A)
                ticker_cell = ws.range((self.START_ROW, col_index))
                ticker_value = ticker_cell.value
                
                if not ticker_value:
                    continue
                
                ticker = str(ticker_value).strip().upper()
                print(f"\nProcessing column {col_index}: '{ticker}'")
                
                if ticker == "INDEX":
                    # Populate this column with INDEX items
                    self._write_index_items(ws, col_index, valid_items)
                    continue
                
                if ticker == "CUSTOM":
                    print(f"  Skipping CUSTOM column - left for user data")
                    continue  # Skip CUSTOM columns completely
                
                # Track occurrences for multiple periods
                ticker_counter[ticker] += 1
                occurrence = ticker_counter[ticker]
                print(f"  Occurrence #{occurrence} for ticker '{ticker}'")
                
                # Get data from Parquet storage
                df = self.data_manager.get_fundamental_data(ticker, self.data_type)
                
                if df.empty:
                    print(f"  No balance sheet data found for {ticker}")
                    self._mark_column_unavailable(ws, col_index, "No data found")
                    continue
                
                # Set the 'index' column as the DataFrame index
                if 'index' in df.columns:
                    df = df.set_index('index')
                
                # Get available statement dates (exclude non-date columns)
                date_columns = []
                for col in df.columns:
                    if col in ['ticker', 'last_updated']:
                        continue
                    # Check if column name contains date pattern
                    col_str = str(col)
                    if '-' in col_str and ('00:00:00' in col_str or len(col_str.split('-')) >= 3):
                        # Only include dates that have actual data
                        if df[col].dropna().shape[0] > 0:
                            date_columns.append(col)
                
                if not date_columns:
                    print(f"  No statement dates with data found for {ticker}")
                    self._mark_column_unavailable(ws, col_index, "No dates with data")
                    continue
                
                # Sort dates to get most recent first
                date_columns = sorted(date_columns, reverse=True)
                print(f"  Found {len(date_columns)} statement dates: {date_columns}")
                
                if occurrence > len(date_columns):
                    msg = f"Only {len(date_columns)} periods available"
                    print(f"  {msg}")
                    self._mark_column_unavailable(ws, col_index, msg)
                    continue
                
                # Get the specific statement date for this occurrence
                statement_date = date_columns[occurrence - 1]
                print(f"  Using statement date: '{statement_date}'")
                
                # Write statement date to Excel
                ws.range((self.START_ROW + 1, col_index)).value = statement_date
                
                # Get data for this specific date
                if statement_date not in df.columns:
                    print(f"  Error: Date column '{statement_date}' not found in data")
                    self._mark_column_unavailable(ws, col_index, "Date col not found")
                    continue
                
                stmt_data = df[statement_date].dropna().to_dict()
                print(f"  Retrieved {len(stmt_data)} balance sheet items for '{statement_date}'")
                
                # Write data to Excel
                valid_count = self._write_data_to_excel(ws, col_index, stmt_data, valid_items)
                
                if valid_count > 0:
                    print(f"  Successfully imported {valid_count} items for {ticker} (#{occurrence})")
                    success_count += 1
                else:
                    print(f"  No valid data written for {ticker}")
            
            print(f"\n✅ Balance Sheet Import completed successfully")
            print(f"📊 Successfully processed {success_count} ticker columns")
            
        except Exception as e:
            print(f"❌ Error during balance sheet import: {str(e)}")
            import traceback
            traceback.print_exc()
            raise
    
    def _get_valid_items_and_populate_column_a(self, ws, wb):
        """Get valid items from Settings/defaults and ALWAYS populate Column A"""
        print("  Populating Column A with INDEX items...")
        
        # Get default items from Parquet data (using AAPL as reference)
        default_items = []
        df = self.data_manager.get_fundamental_data('AAPL', self.data_type)
        if not df.empty and 'index' in df.columns:
            df = df.set_index('index')
            default_items = list(df.index)
        
        print(f"  Found {len(default_items)} default items from AAPL data")
        
        # Check Settings sheet for custom configuration
        configured_items = []
        try:
            settings_ws = wb.sheets["Settings"]
            print("  Found Settings sheet, checking for custom configuration...")
            
            # Find balance sheets section
            balance_sheet_col = self._find_or_create_settings_section(settings_ws, "balance sheets")
            
            # Get/create INDEX columns
            default_col = balance_sheet_col
            config_col = balance_sheet_col + 1
            
            # Set headers
            settings_ws.range((2, default_col)).value = "INDEX default"
            settings_ws.range((2, config_col)).value = "INDEX config"
            
            # Write default items
            self._write_default_items_to_settings(settings_ws, default_col, default_items)
            
            # Read configured items
            configured_items = self._read_configured_items(settings_ws, config_col, default_items)
            
        except Exception as e:
            print(f"  Error accessing Settings sheet: {str(e)}")
            print("  Using default items")
        
        # Use configured items if available, otherwise use defaults
        line_items = configured_items if configured_items else default_items
        
        # ALWAYS write to Column A
        row_index = self.DATA_START_ROW
        
        # Clear Column A first - clear enough rows to remove all old data from previous imports
        clear_end_row = min(self.DATA_START_ROW + 200, 1000)
        clear_range = ws.range((self.DATA_START_ROW, 1), (clear_end_row, 1))
        clear_range.value = None
        
        # Write items to Column A
        for item in line_items:
            col_a_cell = ws.range((row_index, 1))
            col_a_cell.value = item
            row_index += 1
        
        print(f"  Written {len(line_items)} INDEX items to Column A")
        
        return line_items
    
    def _handle_index_column(self, ws, wb, col_index):
        """Handle INDEX columns with Settings sheet integration - LEGACY, use _get_valid_items_and_populate_column_a instead"""
        print(f"  Processing INDEX column - managing line items for column {col_index}")
        ws.range((self.START_ROW + 1, col_index)).value = "INDEX"
        
        # Get default items from Parquet data (using AAPL as reference)
        default_items = []
        df = self.data_manager.get_fundamental_data('AAPL', self.data_type)
        
        if not df.empty and 'index' in df.columns:
            df = df.set_index('index')
            default_items = list(df.index)
        
        print(f"Found {len(default_items)} default items from AAPL data")
        
        # Check Settings sheet for custom configuration
        configured_items = []
        try:
            settings_ws = wb.sheets["Settings"]
            print("Found Settings sheet, checking for custom configuration...")
            
            # Find balance sheets section
            balance_sheet_col = self._find_or_create_settings_section(settings_ws, "balance sheets")
            
            # Get/create INDEX columns
            default_col = balance_sheet_col
            config_col = balance_sheet_col + 1
            
            # Set headers
            settings_ws.range((2, default_col)).value = "INDEX default"
            settings_ws.range((2, config_col)).value = "INDEX config"
            
            # Write default items
            self._write_default_items_to_settings(settings_ws, default_col, default_items)
            
            # Read configured items
            configured_items = self._read_configured_items(settings_ws, config_col, default_items)
            
        except Exception as e:
            print(f"Error accessing Settings sheet: {str(e)}")
            print("Using default items")
        
        # Use configured items if available, otherwise use defaults
        line_items = configured_items if configured_items else default_items
        
        # Clear data in the sheet when processing first INDEX column
        # Clear up to max of default items to remove any leftover rows from previous imports
        if col_index <= 2:
            max_rows_to_clear = max(len(default_items), len(line_items))
            self._clear_sheet_data(ws, max_rows_to_clear)
        
        # Write items to the dashboard
        self._write_index_items(ws, col_index, line_items)
        
        return line_items
    
    def _find_or_create_settings_section(self, settings_ws, section_name):
        """Find or create a section in Settings sheet"""
        # Check first 100 columns for existing section
        for col in range(1, 101):
            header_value = settings_ws.range((1, col)).value
            if header_value and str(header_value).lower() == section_name.lower():
                return col
        
        # If not found, create in next available column
        last_col = 1
        for col in range(1, 101):
            if settings_ws.range((1, col)).value:
                last_col = col
        
        new_col = last_col + 1
        settings_ws.range((1, new_col)).value = section_name
        return new_col
    
    def _write_default_items_to_settings(self, settings_ws, col, default_items):
        """Write default items to Settings sheet - preserve formatting except errors"""
        # Clear existing items first in bulk - only clear values, preserve all formatting
        clear_range = settings_ws.range((3, col), (min(len(default_items) + 10, 1003), col))
        clear_range.value = None
        # Don't clear background colors anymore - preserve all background formatting
        
        # Write all default items starting from row 3
        for i, item in enumerate(default_items, start=3):
            item_cell = settings_ws.range((i, col))
            item_cell.value = item
            # Only clear error text colors, preserve all other formatting including backgrounds
            if item_cell.font.color in [RED_RGB, DARK_RED_RGB, YELLOW_RGB]:
                item_cell.font.color = NORMAL_RGB  # Set to orange for normal text
        
        print(f"Written {len(default_items)} items to Settings INDEX default column")
    
    def _read_configured_items(self, settings_ws, col, default_items):
        """Read configured items from Settings sheet - preserve formatting except errors"""
        configured_items = []
        invalid_items = []
        
        # Read from row 3 onwards
        for row in range(3, 1003):
            cell_value = settings_ws.range((row, col)).value
            if not cell_value:
                break
            
            item = str(cell_value).strip()
            if item in default_items:
                configured_items.append(item)
                # Clear any error text formatting for valid items - preserve background colors
                cell = settings_ws.range((row, col))
                if cell.font.color in [RED_RGB, DARK_RED_RGB, YELLOW_RGB]:
                    cell.font.color = NORMAL_RGB  # Set to orange for normal text
            else:
                invalid_items.append(item)
                # Clear invalid item but preserve all formatting
                invalid_cell = settings_ws.range((row, col))
                invalid_cell.value = None
                # Don't clear any colors anymore - preserve all formatting
        
        if invalid_items:
            print(f"Warning: Removed invalid items from config: {invalid_items}")
        
        if configured_items:
            print(f"Found {len(configured_items)} valid configured items")
        
        return configured_items
    
    def _clear_sheet_data(self, ws, num_items=None):
        """Clear all data columns (except Column A and CUSTOM columns) - preserve formatting"""
        try:
            last_col = min(ws.range((1,1)).end('right').column, 100)
        except:
            last_col = 100
        
        # Always clear enough rows to cover the maximum possible data
        # Use at least 200 rows or num_items, whichever is larger, to remove leftover rows from previous imports
        clear_rows = max(num_items if num_items else 0, 200)
        end_row = self.DATA_START_ROW + clear_rows
        end_row = min(end_row, 1000)  # Still apply absolute safety limit
        
        # Start from column 2 - Column A is always INDEX and handled separately
        for col in range(2, last_col + 1):
            # Skip CUSTOM columns - never touch user data
            header_value = ws.range((self.START_ROW, col)).value
            if header_value and str(header_value).strip().upper() == "CUSTOM":
                continue
            
            # Clear row 5 (dates) - ONLY VALUE, preserve formatting
            date_cell = ws.range((5, col))
            date_cell.value = None
            
            # Clear data values - preserve all formatting
            clear_range = ws.range((self.DATA_START_ROW, col), (end_row, col))
            clear_range.value = None
    
    def _write_index_items(self, ws, col_index, line_items):
        """Write line items to the specified INDEX column - preserve existing formatting"""
        print(f"  Writing INDEX items to column {col_index}")
        
        # Set the row 5 cell to "INDEX" label
        ws.range((self.START_ROW + 1, col_index)).value = "INDEX"
        
        row_index = self.DATA_START_ROW
        
        # Write items to this column
        for item in line_items:
            index_cell = ws.range((row_index, col_index))
            index_cell.value = item
            row_index += 1
        
        print(f"    Written {len(line_items)} INDEX items to column {col_index}")
    
    def _write_data_to_excel(self, ws, col_index, stmt_data, valid_items):
        """Write statement data to Excel with proper formatting - preserve existing formatting except for errors"""
        valid_count = 0
        
        # Process each row based on line items in column A
        row_index = self.DATA_START_ROW
        # Use the number of valid items as our limit if available, otherwise use safety limit
        max_rows = len(valid_items) if valid_items else 500
        
        while row_index < (self.DATA_START_ROW + max_rows):
            line_item_cell = ws.range((row_index, 1))
            line_item_value = line_item_cell.value
            
            if not line_item_value:
                break
            
            line_item = str(line_item_value).strip()
            data_cell = ws.range((row_index, col_index))
            
            # Skip items not in valid_items list - clear content but preserve formatting
            if valid_items is not None and line_item not in valid_items:
                data_cell.value = None
                # Don't change formatting - leave as is
                row_index += 1
                continue
            
            # Write data based on availability
            if line_item in stmt_data:
                value = stmt_data[line_item]
                if pd.isna(value) or value == "":
                    data_cell.value = "-"
                    # Apply error text color only for empty values
                    data_cell.font.color = YELLOW_RGB
                else:
                    data_cell.value = value
                    # Set normal data to orange color - preserves background colors
                    data_cell.font.color = NORMAL_RGB  # Orange color for valid data
                    valid_count += 1
            else:
                data_cell.value = "N/A"
                # Apply error text color only for missing data
                data_cell.font.color = RED_RGB
            
            row_index += 1
        
        return valid_count
    
    def _mark_column_unavailable(self, ws, col_index, message):
        """Mark a column as unavailable with error formatting"""
        print(f"  Marking column {col_index} as unavailable: {message}")
        
        # Set status message
        status_cell = ws.range((self.START_ROW + 1, col_index))
        status_cell.value = message
        status_cell.font.color = DARK_RED_RGB
        
        # Clear and mark data cells as N/A
        row_index = self.DATA_START_ROW
        max_rows = 500  # Safety limit
        while row_index < (self.DATA_START_ROW + max_rows):
            line_item_cell = ws.range((row_index, 1))
            if not line_item_cell.value:
                break
            
            data_cell = ws.range((row_index, col_index))
            data_cell.value = "N/A"
            data_cell.font.color = RED_RGB
            row_index += 1

# Excel-callable function
@xw.sub
def import_balance_sheets():
    """Import balance sheet data from Parquet to Excel - Called by VBA"""
    try:
        importer = BalanceSheetImporter()
        importer.import_data()
    except Exception as e:
        print(f"Error in import_balance_sheets: {str(e)}")
        raise

if __name__ == "__main__":
    # For testing
    importer = BalanceSheetImporter()
    importer.import_data()
