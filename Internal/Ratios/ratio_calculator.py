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
from Internal.Ratios.formula_resolver import eval_ast, parse_formula_ast, resolve_latest

# Configuration
METRICS_SHEET = "Metrics"          # canonical sheet name (renamed from "Ratios")
LEGACY_RATIOS_SHEET = "Ratios"     # pre-rename sheet name, kept for backward compatibility
RATIO_DATA_START_ROW = 7      # Row where metric names begin in Column A (like BS/IS)
TICKER_ROW = 4                # Row where ticker symbols are placed (like BS/IS)
DATA_DIR = Path(__file__).parent.parent.parent / "data" / "fundamentals"


def _column_letter(col_index: int) -> str:
    """Convert a 1-based column index to its Excel letter (1 -> A, 27 -> AA)."""
    letters = ""
    while col_index > 0:
        col_index, remainder = divmod(col_index - 1, 26)
        letters = chr(65 + remainder) + letters
    return letters


def _resolve_metrics_sheet(workbook):
    """Return the Metrics sheet, falling back to the legacy 'Ratios' sheet if present."""
    sheet_names = [s.name for s in workbook.sheets]
    if METRICS_SHEET in sheet_names:
        return workbook.sheets[METRICS_SHEET]
    if LEGACY_RATIOS_SHEET in sheet_names:
        return workbook.sheets[LEGACY_RATIOS_SHEET]
    raise ValueError(
        f"Sheet '{METRICS_SHEET}' (or legacy '{LEGACY_RATIOS_SHEET}') not found in workbook"
    )


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
          Row 7+:    Metric names in Column A, calculated values in B-Z
          
        INDEX columns are populated with the metric names from Column A.
        CUSTOM columns are left untouched for user-entered data.
        """
        try:
            self.ws = _resolve_metrics_sheet(self.wb)
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

            # Read row 4 headers and classify columns (through the used range,
            # not just B:Z, so tickers past column Z are not silently ignored)
            last_col = min(self.ws.range("B4").end("right").column, 100)
            row4_data = self.ws.range(f"B4:{_column_letter(last_col)}4").value
            self.ticker_columns = []
            self.index_columns = []
            self.custom_columns = []
            if row4_data:
                for idx, value in enumerate(row4_data):
                    if value and isinstance(value, str):
                        header = value.strip().upper()
                        col_letter = _column_letter(idx + 2)  # B=2, C=3, ...
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
    
    def get_financial_value(self, ticker, sheet_type, item_name, recursion_depth=0):
        """Resolve one reference's latest value for the Metrics sheet.

        Numeric literals and METRIC:/RATIO: recursion are handled here; every
        leaf sheet type (BS/IS/CF/P/M/H/E/A) is resolved through the shared
        ``formula_resolver`` so the Metrics sheet agrees with the charts.
        Unknown sheet types resolve to None (never to another statement).
        """
        if recursion_depth > 10:
            return None

        sheet_upper = (sheet_type or "").upper()

        if sheet_upper == "NUMBER":
            try:
                return float(item_name)
            except (TypeError, ValueError):
                return None

        if sheet_upper in ("RATIO", "METRIC"):
            result = self._calculate_ratio_internal(item_name.strip(), ticker, recursion_depth + 1)
            if isinstance(result, (int, float)):
                return float(result)
            return None

        return resolve_latest(ticker, sheet_upper, item_name)

    def calculate_ratio(self, ratio_name, ticker):
        """Calculate a specific ratio for a ticker (public interface)."""
        return self._calculate_ratio_internal(ratio_name, ticker, recursion_depth=0)

    def _calculate_ratio_internal(self, ratio_name, ticker, recursion_depth=0):
        """Internal method to calculate a ratio with recursion tracking.

        Returns a rounded float, "N/A" when data is missing, or an "ERROR: ..."
        string when the formula is invalid.
        """
        try:
            if recursion_depth > 10:
                return "ERROR: Circular reference"

            ratio_data = self.ratios_config.get(ratio_name)
            if not ratio_data:
                return "ERROR: Ratio not found"

            formula = ratio_data.get("formula", "")
            if not formula:
                return "ERROR: No formula"

            ast = parse_formula_ast(formula)
            if ast is None:
                return "ERROR: Invalid formula"

            value = eval_ast(
                ast,
                lambda sheet, item: self.get_financial_value(ticker, sheet, item, recursion_depth),
            )

            if value is None:
                return "N/A"

            return round(value, 6)

        except Exception as e:
            print(f"Error calculating {ratio_name} for {ticker}: {e}")
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
            last_col = min(self.ws.range("B4").end("right").column, 100)
            row4_data = self.ws.range(f"B4:{_column_letter(last_col)}4").value
            active_columns = set()
            if row4_data:
                for idx, value in enumerate(row4_data):
                    if value and isinstance(value, str):
                        header = value.strip().upper()
                        if header and header not in ("INDEX", "CUSTOM", ""):
                            active_columns.add(_column_letter(idx + 2))
                        elif header == "CUSTOM":
                            # Protect CUSTOM columns from being cleared
                            active_columns.add(_column_letter(idx + 2))
            all_columns = [_column_letter(c) for c in range(2, last_col + 1)]
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
                f"✓ Calculated {len(calculator.assigned_ratios)} metrics for {len(calculator.tickers)} tickers"
            )
        
    except Exception as e:
        app = QApplication.instance() or QApplication(sys.argv)
        QMessageBox.critical(
            None,
            "Calculation Error",
            f"Failed to calculate metrics:\n\n{str(e)}"
        )


@xw.sub
def refresh_ratios():
    """Excel-callable function to refresh/calculate all metrics"""
    calculate_ratios()


# ---------------------------------------------------------------------------
# Column A Management — called from ElectronHome terminal
# ---------------------------------------------------------------------------

WORKBOOK_PATH = Path(__file__).parent.parent.parent / "FinForge.xlsm"


def _open_workbook_readonly():
    """Open the workbook, returning ``(workbook, app)``.

    ``app`` is None when an already-running Excel instance owns the workbook;
    otherwise it is the hidden ``xw.App`` created here, which the caller must
    quit after closing the workbook to avoid leaking an Excel process.
    """
    try:
        wb = xw.Book(str(WORKBOOK_PATH))
        return wb, None
    except Exception:
        app = xw.App(visible=False, add_book=False)
        wb = app.books.open(str(WORKBOOK_PATH))
        return wb, app


def sync_ratio_sheet_from_config(workbook):
    """Sync metric names into Column A.

    Metrics with a 'row' field set are placed at that exact row position
    (sorted by row number); metrics without a row are auto-assigned to
    the remaining rows in order.

    Preserves CUSTOM columns (user-entered data) and INDEX columns
    (they are re-populated by the calculator during calculate_all_ratios).
    """
    ratios = get_ratios_from_config()
    ws = _resolve_metrics_sheet(workbook)

    # Clear data columns but preserve CUSTOM columns (user data)
    last_col = min(ws.range("B4").end("right").column, 100)
    row4_data = ws.range(f"B4:{_column_letter(last_col)}4").value
    for col_index in range(2, last_col + 1):
        col_letter = _column_letter(col_index)
        # Skip CUSTOM columns - never touch user data
        if row4_data:
            idx = col_index - 2
            if idx < len(row4_data):
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
    """Refresh the Metrics sheet directly from the terminal workflow."""
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
    """Return the list of metric names currently in Column A of the Metrics sheet."""
    wb = None
    app = None
    try:
        wb, app = _open_workbook_readonly()
        ws = _resolve_metrics_sheet(wb)
        col_a = ws.range(f"A{RATIO_DATA_START_ROW}:A200").value
        names = []
        if col_a:
            for item in col_a:
                if item and isinstance(item, str):
                    names.append(item.strip())
        return names
    except Exception as e:
        print(f"Error reading sheet ratios: {e}")
        return []
    finally:
        if wb is not None:
            try:
                wb.close()
            except Exception:
                pass
        if app is not None:
            try:
                app.quit()
            except Exception:
                pass


def sync_assigned_ratios(ratio_names_json: str):
    """Set Column A of the Metrics sheet to exactly the given list of metric names.
    
    Metrics with a 'row' field in the config are placed at that row position;
    metrics without one are auto-assigned to the remaining rows in order.
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

        ws = _resolve_metrics_sheet(wb)
        clear_end = max(RATIO_DATA_START_ROW + 200, RATIO_DATA_START_ROW + len(ordered_names) + 10)
        
        # Clear data columns but preserve CUSTOM columns (user data)
        last_col = min(ws.range("B4").end("right").column, 100)
        row4_data = ws.range(f"B4:{_column_letter(last_col)}4").value
        for col_index in range(2, last_col + 1):
            col_letter = _column_letter(col_index)
            # Skip CUSTOM columns - never touch user data
            if row4_data:
                idx = col_index - 2
                if idx < len(row4_data):
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
