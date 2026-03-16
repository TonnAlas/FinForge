import pandas as pd
from pathlib import Path
from datetime import datetime, timedelta
import json

# Default number of days before deleted ticker data is permanently removed
DELETION_DELAY_DAYS = 3

class StockDataManager:
    def __init__(self, base_path: str | Path = "data"):
        self.base_path = Path(base_path)
        
        # Create directory structure
        self.dirs = {
            'prices': self.base_path / 'prices',
            'fundamentals': self.base_path / 'fundamentals',
            'holders': self.base_path / 'holders',
            'metadata': self.base_path / 'metadata'
        }
        
        for dir_path in self.dirs.values():
            dir_path.mkdir(parents=True, exist_ok=True)
        
        # Pending deletions file path
        self.pending_deletions_file = self.base_path / 'pending_deletions.json'
    
    # ==================== PENDING DELETION MANAGEMENT ====================
    
    def _load_pending_deletions(self) -> dict:
        """Load the pending deletions tracker"""
        if not self.pending_deletions_file.exists():
            return {}
        
        try:
            with open(self.pending_deletions_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return {}
    
    def _save_pending_deletions(self, deletions: dict):
        """Save the pending deletions tracker"""
        with open(self.pending_deletions_file, 'w') as f:
            json.dump(deletions, f, indent=2)
    
    def schedule_ticker_deletion(self, ticker: str):
        """Schedule a ticker for deletion after DELETION_DELAY_DAYS days"""
        ticker = ticker.upper()
        deletions = self._load_pending_deletions()
        
        # Only add if not already scheduled
        if ticker not in deletions:
            deletion_date = (datetime.now() + timedelta(days=DELETION_DELAY_DAYS)).isoformat()
            deletions[ticker] = {
                'scheduled_date': datetime.now().isoformat(),
                'deletion_date': deletion_date
            }
            self._save_pending_deletions(deletions)
            print(f"Scheduled {ticker} for data deletion on {deletion_date[:10]}")
    
    def cancel_ticker_deletion(self, ticker: str):
        """Cancel a scheduled deletion (e.g., if ticker is re-added)"""
        ticker = ticker.upper()
        deletions = self._load_pending_deletions()
        
        if ticker in deletions:
            del deletions[ticker]
            self._save_pending_deletions(deletions)
            print(f"Cancelled scheduled deletion for {ticker}")
    
    def process_pending_deletions(self):
        """Process and execute any deletions that are past their delay period"""
        deletions = self._load_pending_deletions()
        now = datetime.now()
        tickers_to_delete = []
        
        for ticker, info in deletions.items():
            deletion_date = datetime.fromisoformat(info['deletion_date'])
            if now >= deletion_date:
                tickers_to_delete.append(ticker)
        
        # Execute deletions
        for ticker in tickers_to_delete:
            print(f"Deleting data for {ticker} (scheduled deletion date reached)")
            self.delete_ticker_data(ticker)
            del deletions[ticker]
        
        # Save updated deletions list
        if tickers_to_delete:
            self._save_pending_deletions(deletions)
            print(f"Processed {len(tickers_to_delete)} pending deletion(s)")
        
        return tickers_to_delete
    
    def get_pending_deletions(self) -> dict:
        """Get list of tickers scheduled for deletion with their dates"""
        return self._load_pending_deletions()
    
    def delete_ticker_data(self, ticker: str):
        """Permanently delete all data for a ticker"""
        ticker = ticker.upper()
        deleted_files = []
        
        # 1. Delete price data file
        price_file = self.dirs['prices'] / f"{ticker}.parquet"
        if price_file.exists():
            price_file.unlink()
            deleted_files.append(str(price_file))
        
        # 2. Delete metadata file
        metadata_file = self.dirs['metadata'] / f"{ticker}.json"
        if metadata_file.exists():
            metadata_file.unlink()
            deleted_files.append(str(metadata_file))
        
        # 3. Delete ticker files from fundamentals subdirectories (new structure)
        for data_type_dir in self.dirs['fundamentals'].iterdir():
            if data_type_dir.is_dir():
                ticker_file = data_type_dir / f"{ticker}.parquet"
                if ticker_file.exists():
                    ticker_file.unlink()
                    deleted_files.append(str(ticker_file))
        
        # 3b. Also handle old structure: fundamentals/{data_type}.parquet
        for parquet_file in self.dirs['fundamentals'].glob('*.parquet'):
            try:
                df = pd.read_parquet(parquet_file)
                if 'ticker' in df.columns and ticker in df['ticker'].values:
                    df = df[df['ticker'] != ticker]
                    if df.empty:
                        parquet_file.unlink()
                        deleted_files.append(str(parquet_file))
                    else:
                        df.to_parquet(parquet_file, compression='snappy')
                        deleted_files.append(f"{parquet_file} (removed {ticker} rows)")
            except Exception as e:
                print(f"Warning: Could not process {parquet_file}: {e}")
        
        # 4. Delete ticker files from holders subdirectories (new structure)
        for holder_type_dir in self.dirs['holders'].iterdir():
            if holder_type_dir.is_dir():
                ticker_file = holder_type_dir / f"{ticker}.parquet"
                if ticker_file.exists():
                    ticker_file.unlink()
                    deleted_files.append(str(ticker_file))
        
        # 4b. Also handle old structure: holders/{holder_type}.parquet
        for parquet_file in self.dirs['holders'].glob('*.parquet'):
            try:
                df = pd.read_parquet(parquet_file)
                if 'ticker' in df.columns and ticker in df['ticker'].values:
                    df = df[df['ticker'] != ticker]
                    if df.empty:
                        parquet_file.unlink()
                        deleted_files.append(str(parquet_file))
                    else:
                        df.to_parquet(parquet_file, compression='snappy')
                        deleted_files.append(f"{parquet_file} (removed {ticker} rows)")
            except Exception as e:
                print(f"Warning: Could not process {parquet_file}: {e}")
        
        if deleted_files:
            print(f"Deleted data for {ticker}: {len(deleted_files)} file(s) affected")
        
        return deleted_files
    
    # ==================== EXISTING METHODS ====================
    
    def save_stock_prices(self, ticker: str, df: pd.DataFrame):
        """Save historical price data"""
        if not df.empty:
            file_path = self.dirs['prices'] / f"{ticker.upper()}.parquet"
            df.to_parquet(file_path, compression='snappy')
    
    def save_fundamental_data(self, ticker: str, data_type: str, df: pd.DataFrame):
        """Save fundamental data (income statement, balance sheet, cash flow)
        
        Each ticker's data is saved as a separate file to avoid column conflicts
        from different fiscal year dates between companies.
        """
        if df is None or df.empty:
            return
        
        # Create subdirectory for this data type
        data_type_dir = self.dirs['fundamentals'] / data_type
        data_type_dir.mkdir(parents=True, exist_ok=True)
        
        file_path = data_type_dir / f"{ticker.upper()}.parquet"
        
        # Add ticker and timestamp columns
        df = df.copy()
        df['ticker'] = ticker
        df['last_updated'] = datetime.now()
        
        df.to_parquet(file_path, compression='snappy')
    
    def save_holders_data(self, ticker: str, holder_type: str, df: pd.DataFrame):
        """Save holders data (major, institutional, mutual fund)
        
        Each ticker's data is saved as a separate file.
        """
        if df is None or df.empty:
            return
        
        # Create subdirectory for this holder type
        holder_type_dir = self.dirs['holders'] / holder_type
        holder_type_dir.mkdir(parents=True, exist_ok=True)
        
        file_path = holder_type_dir / f"{ticker.upper()}.parquet"
        
        # Add ticker and timestamp columns
        df = df.copy()
        df['ticker'] = ticker
        df['last_updated'] = datetime.now()
        
        df.to_parquet(file_path, compression='snappy')
    
    def save_metadata(self, ticker: str, metadata: dict):
        """Save stock metadata/info"""
        if not metadata:
            return
            
        file_path = self.dirs['metadata'] / f"{ticker.upper()}.json"
        metadata['last_updated'] = datetime.now().isoformat()
        
        with open(file_path, 'w') as f:
            json.dump(metadata, f, indent=2)
    
    def get_stock_prices(self, ticker: str) -> pd.DataFrame:
        """Load historical price data"""
        file_path = self.dirs['prices'] / f"{ticker.upper()}.parquet"
        return pd.read_parquet(file_path) if file_path.exists() else pd.DataFrame()
    
    def get_fundamental_data(self, ticker: str, data_type: str) -> pd.DataFrame:
        """Load fundamental data for a specific ticker"""
        # New structure: fundamentals/{data_type}/{TICKER}.parquet
        file_path = self.dirs['fundamentals'] / data_type / f"{ticker.upper()}.parquet"
        if file_path.exists():
            return pd.read_parquet(file_path)
        
        # Fallback: check old structure fundamentals/{data_type}.parquet
        old_file_path = self.dirs['fundamentals'] / f"{data_type}.parquet"
        if old_file_path.exists():
            df = pd.read_parquet(old_file_path)
            if 'ticker' in df.columns:
                return df[df['ticker'] == ticker]
        
        return pd.DataFrame()
    
    def get_holders_data(self, ticker: str, holder_type: str) -> pd.DataFrame:
        """Load holders data for a specific ticker"""
        # New structure: holders/{holder_type}/{TICKER}.parquet
        file_path = self.dirs['holders'] / holder_type / f"{ticker.upper()}.parquet"
        if file_path.exists():
            return pd.read_parquet(file_path)
        
        # Fallback: check old structure holders/{holder_type}.parquet
        old_file_path = self.dirs['holders'] / f"{holder_type}.parquet"
        if old_file_path.exists():
            df = pd.read_parquet(old_file_path)
            if 'ticker' in df.columns:
                return df[df['ticker'] == ticker]
        
        return pd.DataFrame()
    
    def get_metadata(self, ticker: str) -> dict:
        """Load stock metadata/info"""
        file_path = self.dirs['metadata'] / f"{ticker.upper()}.json"
        if not file_path.exists():
            return {}
            
        with open(file_path, 'r') as f:
            return json.load(f)
    
    def get_all_tickers(self) -> list:
        """Get list of all tickers in the system"""
        # Get unique tickers from all data sources
        tickers = set()
        
        # Check price data
        for file in self.dirs['prices'].glob('*.parquet'):
            tickers.add(file.stem)
            
        # Check fundamentals
        for file in self.dirs['fundamentals'].glob('*.parquet'):
            df = pd.read_parquet(file)
            tickers.update(df['ticker'].unique())
            
        return sorted(list(tickers))
    
    def save_tickers_list(self, tickers: list):
        """Save the master list of tickers"""
        file_path = self.base_path / 'tickers.json'
        with open(file_path, 'w') as f:
            json.dump({'tickers': tickers, 'last_updated': datetime.now().isoformat()}, f, indent=2)
    
    def get_tickers_list(self) -> list:
        """Load the master list of tickers"""
        file_path = self.base_path / 'tickers.json'
        if not file_path.exists():
            return []
            
        with open(file_path, 'r') as f:
            data = json.load(f)
            return data.get('tickers', [])
