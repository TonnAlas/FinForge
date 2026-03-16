"""
Stock Data Fetcher

Fetches all available financial data from Yahoo Finance and stores in Parquet format.
"""

import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
from pathlib import Path
import json
import os
import sys

sys.path.insert(0, str(Path(__file__).parent.parent.parent))
from data_management.stock_data_manager import StockDataManager


def get_tickers(data_manager):
    """Get tickers from available sources in priority order."""
    tickers_json = Path(__file__).parent.parent.parent / "Ticker_management" / "tickers.json"
    if tickers_json.exists():
        with open(tickers_json, 'r') as f:
            data = json.load(f)
            if isinstance(data, dict) and 'tickers' in data:
                return data['tickers']
            elif isinstance(data, list):
                return data
    
    tickers = data_manager.get_tickers_list()
    if tickers:
        return tickers
    
    return ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']


def prepare_df(df):
    """Prepare DataFrame for storage."""
    if df is None:
        return pd.DataFrame()
    if isinstance(df, pd.Series):
        df = df.to_frame()
    if df.empty:
        return pd.DataFrame()
    df = df.copy()
    if isinstance(df.index, pd.DatetimeIndex):
        df.index = df.index.tz_localize(None)
    df.reset_index(inplace=True)
    return df


def prepare_list_data(data, name='item'):
    """Convert list of dicts to DataFrame."""
    if not data or not isinstance(data, list):
        return pd.DataFrame()
    if isinstance(data[0], dict):
        return pd.DataFrame(data)
    return pd.DataFrame({name: data})


def fetch_ticker_data(ticker_symbol, data_manager, start_date, end_date):
    """Fetch and save all available data for a single ticker."""
    stock = yf.Ticker(ticker_symbol)
    
    # === PRICE DATA ===
    hist = stock.history(start=start_date, end=end_date)
    if not hist.empty:
        data_manager.save_stock_prices(ticker_symbol, prepare_df(hist))
    
    # === ANNUAL FUNDAMENTALS ===
    annual_fundamentals = [
        ('income_statement', stock.income_stmt),
        ('balance_sheet', stock.balance_sheet),
        ('cash_flow', stock.cashflow),
    ]
    for data_type, df in annual_fundamentals:
        prepared = prepare_df(df)
        if not prepared.empty:
            data_manager.save_fundamental_data(ticker_symbol, data_type, prepared)
    
    # === QUARTERLY FUNDAMENTALS ===
    quarterly_fundamentals = [
        ('quarterly_income_statement', stock.quarterly_income_stmt),
        ('quarterly_balance_sheet', stock.quarterly_balance_sheet),
        ('quarterly_cash_flow', stock.quarterly_cashflow),
    ]
    for data_type, df in quarterly_fundamentals:
        prepared = prepare_df(df)
        if not prepared.empty:
            data_manager.save_fundamental_data(ticker_symbol, data_type, prepared)
    
    # === ANALYST DATA ===
    analyst_data = [
        ('recommendations', stock.recommendations),
        ('recommendations_summary', stock.recommendations_summary),
        ('upgrades_downgrades', stock.upgrades_downgrades),
        ('earnings_estimate', stock.earnings_estimate),
        ('revenue_estimate', stock.revenue_estimate),
        ('earnings_history', stock.earnings_history),
        ('eps_trend', stock.eps_trend),
        ('growth_estimates', stock.growth_estimates),
    ]
    for data_type, df in analyst_data:
        prepared = prepare_df(df)
        if not prepared.empty:
            data_manager.save_fundamental_data(ticker_symbol, data_type, prepared)
    
    # === ANALYST PRICE TARGETS (dict) ===
    try:
        targets = stock.analyst_price_targets
        if targets and isinstance(targets, dict):
            targets_df = pd.DataFrame([targets])
            data_manager.save_fundamental_data(ticker_symbol, 'analyst_price_targets', targets_df)
    except Exception:
        pass
    
    # === CALENDAR ===
    try:
        cal = stock.calendar
        if isinstance(cal, pd.DataFrame) and not cal.empty:
            data_manager.save_fundamental_data(ticker_symbol, 'calendar', prepare_df(cal))
        elif isinstance(cal, dict):
            cal_df = pd.DataFrame([cal])
            data_manager.save_fundamental_data(ticker_symbol, 'calendar', cal_df)
    except Exception:
        pass
    
    # === DIVIDENDS & SPLITS ===
    dividends = prepare_df(stock.dividends)
    if not dividends.empty:
        data_manager.save_fundamental_data(ticker_symbol, 'dividends', dividends)
    
    splits = prepare_df(stock.splits)
    if not splits.empty:
        data_manager.save_fundamental_data(ticker_symbol, 'splits', splits)
    
    actions = prepare_df(stock.actions)
    if not actions.empty:
        data_manager.save_fundamental_data(ticker_symbol, 'actions', actions)
    
    # === HOLDERS ===
    holders = [
        ('major_holders', stock.major_holders),
        ('institutional_holders', stock.institutional_holders),
        ('mutualfund_holders', stock.mutualfund_holders),
        ('insider_roster_holders', stock.insider_roster_holders),
    ]
    for holder_type, df in holders:
        prepared = prepare_df(df)
        if not prepared.empty:
            data_manager.save_holders_data(ticker_symbol, holder_type, prepared)
    
    # === INSIDER TRANSACTIONS ===
    insider_data = [
        ('insider_transactions', stock.insider_transactions),
        ('insider_purchases', stock.insider_purchases),
    ]
    for data_type, df in insider_data:
        prepared = prepare_df(df)
        if not prepared.empty:
            data_manager.save_fundamental_data(ticker_symbol, data_type, prepared)
    
    # === NEWS (list of dicts) ===
    try:
        news = stock.news
        if news:
            news_df = prepare_list_data(news)
            if not news_df.empty:
                data_manager.save_fundamental_data(ticker_symbol, 'news', news_df)
    except Exception:
        pass
    
    # === SEC FILINGS (list of dicts) ===
    try:
        filings = stock.sec_filings
        if filings:
            filings_df = prepare_list_data(filings)
            if not filings_df.empty:
                data_manager.save_fundamental_data(ticker_symbol, 'sec_filings', filings_df)
    except Exception:
        pass
    
    # === METADATA (info dict) ===
    try:
        info = stock.info
        if info and isinstance(info, dict):
            data_manager.save_metadata(ticker_symbol, info)
    except Exception:
        pass


def main():
    data_manager = StockDataManager()
    
    end_date = datetime.today().date()
    start_date = end_date - timedelta(days=365 * 5)  # 5 years of price history
    
    tickers = get_tickers(data_manager)
    if not tickers:
        raise ValueError("No tickers found. Add tickers using ticker_manager.py")
    
    print(f"Fetching all available data for {len(tickers)} tickers...")
    
    success_count = 0
    for i, ticker in enumerate(tickers, 1):
        try:
            fetch_ticker_data(ticker, data_manager, start_date, end_date)
            success_count += 1
            print(f"[{i}/{len(tickers)}] {ticker} - OK")
        except Exception as e:
            print(f"[{i}/{len(tickers)}] {ticker} - Error: {e}")
    
    print(f"\nCompleted: {success_count}/{len(tickers)} tickers")


if __name__ == "__main__":
    main()
    
    # Clean up legacy Excel file
    if os.path.exists("tickers.xlsx"):
        try:
            os.remove("tickers.xlsx")
            print("Removed legacy tickers.xlsx")
        except Exception:
            pass
    
    # Open dashboard if available
    dashboard_path = Path(__file__).parent.parent.parent / "FinForge.xlsm"
    if dashboard_path.exists():
        os.startfile(dashboard_path)


if __name__ == "__main__":
    main()
