# Financial Charting Guide

Interactive time-series charting for FinForge using Plotly.

---

## Overview

FinForge uses **Plotly** (MIT license) for all interactive charting. Plotly was chosen because:

- **Python-native** -- integrates directly with pandas DataFrames and the existing ratio engine
- **Multi-stock overlay** -- plot multiple tickers on the same chart with one line of code
- **Multi-ratio support** -- dual y-axes for comparing different metrics (e.g., P/E ratio on left, Revenue on right)
- **Zoomable time-series** -- built-in range slider for scrubbing through time
- **SaaS-ready** -- the same code powers desktop charts (via PySide6 QWebEngineView) and future web deployment (via Dash)

---

## Dependencies

The charting system requires:

```
plotly>=5.0.0
```

This is already included in `requirements.txt`. Install or update with:

```powershell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

For desktop integration (displaying charts inside PySide6 windows), the QtWebEngine module from PySide6 is used -- no additional install needed since PySide6 is already a dependency.

---

## Architecture

The charting system lives in `Internal/Ratios/` and follows this flow:

```
User selects stocks + ratios
         |
         v
ratio_calculator.py    Computes ratio values over time from stored fundamental data
         |
         v
ratio_charting.py      Builds Plotly figure with traces, layout, and interactivity
         |
         v
Display layer          Desktop: QWebEngineView (PySide6)
                        Future: Dash/Flask web app
```

### Key modules

| Module | Path | Purpose |
|--------|------|---------|
| `ratio_charting.py` | `Internal/Ratios/ratio_charting.py` | Builds Plotly figures from ratio data |
| `ratio_calculator.py` | `Internal/Ratios/ratio_calculator.py` | Computes ratio values from financial statements |
| `stock_data_manager.py` | `data_management/stock_data_manager.py` | Retrieves stored fundamental data |

---

## Chart Types

### 1. Ratio Time-Series (Default)

Line chart of a single ratio over time for one or more stocks.

**Example:** P/E ratio for AAPL, MSFT, and GOOG over the last 5 years.

```
Single y-axis, one trace per stock.
Legend auto-generated from ticker symbols.
X-axis is date (zoomable via range slider).
```

### 2. Multi-Ratio Comparison

Two or more ratios plotted on the same chart with dual y-axes.

**Example:** P/E Ratio (left axis) + Net Profit Margin (right axis) for AAPL.

```
Left y-axis:  Primary ratio (e.g., P/E)
Right y-axis: Secondary ratio (e.g., Net Profit Margin)
Color-coded by ratio name.
```

### 3. Multi-Stock, Multi-Ratio

Multiple stocks and multiple ratios combined in one figure using subplots.

**Example:** Top subplot = P/E (AAPL + MSFT), Bottom subplot = Revenue (AAPL + MSFT).

```
make_subplots(rows=2, cols=1, shared_xaxes=True)
Each row = one ratio, each trace = one stock.
```

---

## Data Format

The charting functions expect data as a pandas DataFrame with the following structure:

```python
# Input format for a single ratio across multiple stocks
{
    "AAPL": pd.DataFrame({
        "Date": ["2020-01-01", "2021-01-01", ...],     # datetime or string
        "P/E":  [25.3, 28.1, ...]                        # float values
    }),
    "MSFT": pd.DataFrame({
        "Date": ["2020-01-01", "2021-01-01", ...],
        "P/E":  [32.1, 35.4, ...]
    })
}
```

Data is fetched from Parquet files stored in `data/fundamentals/` and `data/prices/` via `StockDataManager`.

---

## Key Interactive Features

All charts include these Plotly features out of the box:

| Feature | Behavior |
|---------|----------|
| **Zoom** | Drag to zoom on any axis. Double-click to reset. |
| **Pan** | Click and drag after zooming to pan through time. |
| **Range Slider** | Bottom-of-chart slider for scrubbing the visible date range. |
| **Hover** | Crosshair tooltip showing exact values on hover. |
| **Legend** | Click legend entries to toggle traces on/off. |
| **Download** | Camera icon in modebar to download chart as PNG. |
| **Auto-scale** | Double-click on axis to auto-fit data. |

---

## Usage Examples

### Single ratio, multiple stocks

```python
import pandas as pd
from Internal.Ratios.ratio_charting import build_ratio_chart

# Pass pre-computed ratio data
ratio_data = {
    "AAPL": pd.DataFrame({"Date": [...], "P/E": [...]}),
    "MSFT": pd.DataFrame({"Date": [...], "P/E": [...]}),
}

fig = build_ratio_chart(
    ratio_data=ratio_data,
    ratio_name="P/E",
    title="P/E Ratio Comparison"
)

# Show in browser
fig.show()

# Or save as standalone HTML
fig.write_html("pe_ratio_chart.html")
```

### Multiple ratios, single stock (dual y-axis)

```python
fig = build_ratio_chart(
    ratio_data={
        "P/E": pd.DataFrame({"Date": [...], "value": [...]}),
        "Revenue": pd.DataFrame({"Date": [...], "value": [...]}),
    },
    ratio_name=None,
    title="AAPL: P/E and Revenue",
    dual_y=True
)
```

### Display inside PySide6

```python
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtCore import QUrl
from tempfile import NamedTemporaryFile

# Build chart
fig = build_ratio_chart(ratio_data, ratio_name="P/E")

# Save to temp HTML and load in QWebEngineView
with NamedTemporaryFile(suffix=".html", delete=False) as f:
    fig.write_html(f.name)
    view = QWebEngineView()
    view.load(QUrl.fromLocalFile(f.name))
```

---

## Future SaaS Architecture

When deploying to a web server, the same Plotly code powers a Dash application:

```
User's Browser
     |
     v
Dash Web App (served from server)
     |
     ├── Plotly charts (identical figures)
     ├── Callbacks (stock/ratio selectors update the chart)
     ├── Authentication (user accounts)
     |
     v
PostgreSQL + Redis (pre-computed ratios cached for performance)
     |
     v
Python ratio engine (same Internal/Ratios/ code)
```

The migration path:

| Phase | Display Layer | Code Changes |
|-------|---------------|--------------|
| Desktop (now) | PySide6 + QWebEngineView | Charting code in `Internal/Ratios/` |
| Local web (next) | Flask/Dash server on localhost | Add `Dash` routes, reuse same figure builders |
| SaaS (future) | Dash deployed to cloud | Add auth, PostgreSQL, subscription billing |

No charting code changes are needed between phases -- only the display layer changes.

---

## Configuration

Chart appearance is configured via a centralized dict in `ratio_charting.py`:

```python
CHART_THEME = {
    "template": "plotly_dark",
    "colors": ["#4d8eff", "#4edea3", "#ffb95f", "#ff6b6b"],
    "font": {"family": "Inter, sans-serif", "size": 12},
    "hovermode": "x unified",
}
```

The dark theme matches the FinForge institutional terminal design system. Colors align with the primary/secondary/tertiary palette.

---

## Notes

- Plotly figures are standalone HTML files -- they can be saved, emailed, or embedded anywhere a browser can render them.
- For large datasets (100K+ points), use Plotly's `datashader` integration or aggregate data server-side before sending to the browser.
- All charting code is MIT licensed (matching Plotly's license), safe for commercial SaaS deployment.
