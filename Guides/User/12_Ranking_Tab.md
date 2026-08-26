# Ranking Tab

The **Ranking** tab scores a group of stocks across the metrics you choose and produces a single ranked score for each one. Instead of looking at each ratio on its own, you pick the metrics that matter to you, tell FinForge which direction is "good" (higher or lower), assign each metric a weight, and the app combines everything into one 0-100 score per stock.

---

## Opening the Ranking Tab

1. Launch the FinForge workspace (see Getting Started)
2. In the sidebar, expand **Data**
3. Click **Ranking**

The Ranking screen has three main areas:
- **Left panel** – choose tickers, choose metrics, and manage presets
- **Scoring cards** – one card per selected metric, where you set the weight and curve
- **Ticker cards panel** – the results, showing each stock's points and total score

---

## Quick Start

1. **Choose tickers** – in the left panel's Tickers subtab, select the stocks to rank
2. **Choose metrics** – in the Metrics subtab, toggle on the metrics to score
3. **Click Analyze** – FinForge computes the latest value of each metric for every selected stock
4. **Read the results** – the bottom Ticker cards panel shows each stock's points and total score

---

## Step 1: Select Tickers

In the left panel, click the **Tickers** icon (top of the panel).

- Type in the **Search tickers** box to filter the list
- Click a ticker row to select or deselect it
- Use **All** to select every imported ticker
- Use **Remove all** to clear the selection
- The selected count is shown at the bottom

---

## Step 2: Select Metrics

Click the **Metrics** icon (middle of the left panel).

- Metrics are grouped by folder (the same folders used in the Metrics tab)
- Use **Search metrics** to filter
- Click a metric row to add or remove it
- **Show selected** filters the list to only the metrics you have chosen
- **Remove all** clears the metric selection

---

## Step 3: Set Weights and Curves

Every selected metric appears as a scoring card on the right. Each card controls how that metric contributes to the final score.

### Max pts (Weight)

- The **Max pts** box is the metric's weight
- A metric can earn at most this many points
- A bigger Max pts means the metric matters more in the final ranking

### Direction

Choose which direction is "better":

- **Higher** – larger values score more points (e.g., ROE, revenue growth)
- **Lower** – smaller values score more points (e.g., debt-to-equity)
- **Target** – only available for the Bell curve; values near the center score best

### Curve Type

The curve determines how a raw value is converted into points:

| Curve | What it does | Parameters |
|-------|--------------|------------|
| Percentile | Ranks each stock against the others in your selection; outlier-robust | None (automatic) |
| Bell | Full points at a center value, falling off to the sides | Center, Steepness |
| S-Curve | Smooth transition from low to high points around a midpoint | Midpoint, Slope |
| Linear | Straight-line scoring between a low and high anchor | Low anchor, High anchor |
| Steps | Score is set by which bucket (bin) the value falls into | Thresholds, Points per bin |
| Custom | Draw your own curve by adding points | Points, Smoothness |

### Curve Parameters and the Mini-Chart

- Each card shows a small chart of the curve with one dot per selected stock
- **Yellow handles** on the curve can be dragged to reshape it; you can also type values into the parameter boxes (blank = automatic)
- When a parameter is left blank, FinForge derives it from your selected stocks (e.g., median, range)

Per-curve controls:

- **Percentile** – no parameters; fully automatic
- **Bell** – drag the **center** handle to move the peak and the **width** handle to change steepness
- **S-Curve** – drag the **midpoint** and **slope** handles
- **Linear** – drag the **low** and **high** anchor handles
- **Steps** – drag a threshold handle sideways to move a boundary, or drag a score handle up/down; click empty chart space to insert a new threshold; edit the Thresholds / Points columns below the chart
- **Custom** – click empty chart space to add a point, drag a point to move it, right-click a point to delete it; the Smoothness slider blends straight lines (0) with smooth curves (1); edit points in the list below the chart

---

## Step 4: Run the Analysis

Click **Analyze** in the toolbar to compute (or refresh) the ranking. FinForge takes the latest available value of each metric for each selected stock, converts each value to points, and combines them into a 0-100 score.

- **Collapse all** – collapses every scoring card to keep the screen tidy
- The status text (top-right of the toolbar) shows what is happening

---

## How the Scoring Works

- Each stock's score = **100 × (points earned) ÷ (maximum points available)**
- Every metric that has data for a stock contributes its points; metrics with missing data are skipped for that stock and the score is re-normalized, so a missing value never unfairly penalizes a stock
- Scores are always shown on a 0-100 scale

---

## Reading the Results

### Ticker Cards Panel (bottom)

After you click Analyze, the panel at the bottom shows each selected stock:

- One **Pts** column per metric (the metric's max points is shown in the header)
- A trailing **Total** column showing `total points / max points`
- Use the **Search tickers** box to filter the rows
- **Click a ticker row** to focus it – the charts draw a guide line on that stock so you can see where it sits on each curve

### Results Table (full screen)

Click **Results** in the toolbar to open a full-screen, sortable table:

- Columns: Ticker, one points column per metric, and a Total column
- Click any column header to sort:
  - **Ticker** – A-Z, then Z-A
  - **Metric** – by that metric's points (stocks with no data always sort last)
  - **Total** – click repeatedly to cycle: total points down, total points up, score down, score up
- Click **Back** to return to the ranking screen

### Advanced View (single metric)

Click **Advanced** to open a full-screen, enlarged view of one metric's scoring card:

- Use the **metric dropdown** (top-left) to switch between metrics; metrics already added show an "added" label
- **Create new metric** jumps to the Metrics tab and starts the editor
- All curve editing works exactly as in the grid (drag handles, add points, pan the chart)
- Click **Back** to return to the ranking grid

---

## Saving and Loading Presets

The left panel's **Presets** subtab lets you save and restore your ranking configuration (tickers + metrics + curves + weights):

- **Name** – type a name for the preset
- **Save** – save the current configuration under that name
- **Load** – pick a preset from the dropdown to restore it
- **New** – clear the current configuration to start fresh
- **Delete** – remove the currently loaded preset

---

## Tips

1. **Pick metrics that fit your strategy** – a mix of profitability, growth, and valuation metrics usually ranks better than several similar ones
2. **Use weights deliberately** – raise Max pts on the metrics that matter most to you
3. **Watch the direction** – make sure "Higher" vs "Lower" matches what good looks like for each metric
4. **Missing data is handled** – stocks without a metric's data are scored on the remaining metrics, so a stock is not penalized for missing a single value
5. **Save good setups as presets** – you can quickly re-run a ranking you like on new data
