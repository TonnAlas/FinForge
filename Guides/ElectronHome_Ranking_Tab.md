# ElectronHome Ranking Tab

The Ranking tab scores a set of stocks across user-selected metrics and produces a
ranked table using a weighted, multi-criteria scoring model. Each metric maps a raw
value to points in `[0, maxPoints]` via a user-editable "curve"; `maxPoints` is the
metric's weight. Totals are normalized to 0-100.

## Statistical method

Weighted additive model (WSUM). For each metric `j` with weight `Wj = maxPoints`,
a value function `vj(x)` maps the raw value `x` to points in `[0, Wj]`. A stock's
score is `100 * sum(vj) / sum(Wj)` over the metrics that are present. Missing values
(NaN / null / negative PE) drop that metric for that stock and the denominator is
re-normalized.

Supported curve families (per metric):

| Curve       | Formula | Direction | Parameters |
|-------------|---------|-----------|------------|
| Percentile  | `W * rank(x)`, `W * (1 - rank(x))` for lower | higher / lower | none |
| Bell (Gaussian) | `W * exp(-((x-mu)^2)/(2*sigma^2))` | higher / lower / target | center (mu), steepness (sigma) |
| S-Curve (Sigmoid) | `W / (1 + exp(-k(x-x0)))` | higher / lower | midpoint (x0), slope (k) |
| Linear | `W * clamp((x-low)/(high-low))` | higher / lower | low, high anchors |
| Steps | bucket lookup | encoded in points | thresholds, points |
| Custom | piecewise-linear / Catmull-Rom through user points | none (y is the score) | points `[{x,y}]`, smoothness 0..1 |

Direction semantics:
- `higher` = larger values score higher; `lower` = smaller values score higher.
- `target` (Gaussian only) = full bell peaked at the center; score falls on both sides.
- The Gaussian is one-sided for `higher`/`lower`: flat at max points on the preferred
  side of the center, decaying with `sigma` on the other side.

Auto parameters: when a parameter is left blank, it is derived from the selected
universe (median / inter-quartile range / 1st and 99th percentiles). Percentile uses
average-rank with tie handling and is outlier-robust; linear auto anchors are
winsorized.

Draggable handles: every curve except Percentile renders yellow handles on the
mini-chart. Drag them with the mouse to reshape the curve; typing into the number
inputs still works and stays in sync after a drag ends.
- Bell: a "center" handle (drag to move the peak) and a "width" handle (drag to set
  steepness). The width handle sits on the decaying side for one-sided curves.
- S-Curve: "midpoint" and "slope" handles.
- Linear: "low" and "high" anchor handles.
- Steps: each "threshold" handle drags horizontally (boundaries stay ordered); each
  "score" handle drags vertically (clamped to max points). Clicking empty space on a
  Steps chart inserts a new threshold boundary (the two neighbouring bins are split).
  Thresholds and points are also shown as two editable columns below the chart;
  hovering a cell shows the matching handle's hover box on the chart. Thresholds are
  clamped to the data range so bins never invert.
- Custom: click empty space to add a point, drag a point to move it (points stay
  ordered left-to-right), right-click a point to delete it (a minimum of two remain).
  A point list below the chart shows every point with editable x/y cells and a delete
  button; hovering a row shows the matching hover box on the chart. The Smoothness
  slider blends the connections from straight lines (0) to soft Catmull-Rom curves
  (1); it is compact and paired with a 0-100% number input.

## Architecture

- Metric VALUES are computed in Python (`Internal/Ranking`) by reusing the existing
  formula engine (`Internal/Ratios/metric_history`).
- Scoring math lives in the renderer (`renderer.js`) so curve edits recompute
  instantly without a Python round-trip.

### Backend files

- `Internal/Ranking/__init__.py` — package marker.
- `Internal/Ranking/ranking_engine.py` — `compute_latest_metric_values(tickers, metrics)`.
  Builds a batch request and calls `compute_metric_history_batch`, then takes the last
  non-null value of each history series. Returns `{ticker: {metric_name: value | None}}`.
- `Internal/Ranking/ranking_entry.py` — `ranking_entry(json_payload)` IPC entry.
  Input JSON: `{ "tickers": [...], "metrics": [{ "name", "formula" }] }`.
  Output JSON (stdout): `{ "ok": true, "values": {...} }` or `{ "ok": false, "error" }`.

### Electron plumbing

- `preload.js` — exposes `window.finforge.computeRanking(payload)`,
  `loadRankingPresets()`, `saveRankingPresets(presets)`.
- `main.js` — `finforge:computeRanking` (spawns Python via `buildRankingCommand`,
  120s timeout), `finforge:loadRankingPresets` / `finforge:saveRankingPresets`
  (pure-Node read/write of `data/ranking_presets.json`).

### Frontend (renderer.js)

- `rankingState` holds selected tickers, metric configs, cached values, presets,
  the active side-panel view (`view`), search terms, and the single expanded metric
  (`expandedMetric`).
- `rankingScore(value, metric, universe)` — the value-function dispatcher.
- `rankingComputeResults()` — aggregation + sort.
- `rankingEffectiveParams(metric, universe)` — resolves auto parameters.
- `drawRankingCurve(index)` — Plotly mini-chart (curve line + one dot per stock).
- Renderers: `renderRankingTickerList`, `renderRankingMetricList` (folder-grouped,
  searchable, with toggle rows), `renderRankingCards`. The ranking output is the
  bottom **Ticker cards** panel (`renderRankingTickerCards`); the older ranked
  results table was removed (`renderRankingResults` now only refreshes those cards).
- Metrics subtab: `toggleRankingMetric(name)` adds/removes a metric and expands
  its card when added; `removeAllRankingMetrics()` clears the selection;
  `renderRankingMetricList` reuses the Folders-subtab grouping
  (`getAllFolders` / `getMetricsInFolder` / `getUnassignedMetrics`) with
  "Show selected" / "Remove all" footer buttons.
- Side panel: `setRankingView(view)` switches the three icon subtabs
  (tickers / metrics / presets); `collapseAllRankingCards()` collapses every
  scoring card.
- Presets: `loadRankingPresetsFromDisk`, `saveRankingPresetsToDisk`,
  `rankingSavePreset`, `rankingDeletePreset`, `rankingApplyPreset`.
- Advanced view: `rankingCardHtml` (single-card renderer extracted from
  `renderRankingCards`), `openRankingAdvanced`, `closeRankingAdvanced`,
  `selectRankingAdvancedMetric`, `renderRankingAdvancedMetricList`,
  `renderRankingAdvancedDropdown`, `toggleRankingAdvancedDropdown`,
  `closeRankingAdvancedDropdown`.

## Data formats

Metric config object (persisted in presets):

```
{
  name: string,
  formula: string,          // "IS: Net Income / BS: Stockholders Equity"
  curveType: 'percentile' | 'gaussian' | 'sigmoid' | 'linear' | 'step' | 'custom',
  direction: 'higher' | 'lower' | 'target',
  maxPoints: number,
  params: { mu, sigma, x0, k, low, high, thresholds: [], points: [], customPoints: [], smoothness: 0.5 }
}
```

Preset object (`data/ranking_presets.json`):

```
{
  id: string,
  name: string,
  tickers: [string],
  metrics: [metric config],
  updatedAt: ISO string
}
```

## Configuration and environment

- No new Python dependencies; uses pandas/numpy already in `requirements.txt`.
- No new JS dependencies; uses the existing Plotly CDN and Tailwind theme.
- Backend runs with `cwd = project root`; `PYTHONUTF8=1` is set by main.js.

## Assumptions and limitations

- Values are the LATEST available period per metric (no per-metric historical
  ranking in v1).
- Scoring is cross-sectional within the selected universe; percentile/linear
  parameters are relative to that universe.
- The Step curve editor shows two editable columns (thresholds as x cells, points as
  y cells); points must have one more entry than thresholds (the catch-all bin is
  last). Thresholds are clamped to the data range so bins never invert.
- The Custom curve stores ordered points `[{x, y}]`; the score is the clamped y of
  the interpolated curve (flat outside the point range). Its Smoothness parameter is
  clamped to 0..1 and defaults to 0.5. Points and smoothness persist with presets.
- Plotly must finish loading before charts render; cards show a fallback message
  otherwise.

## Advanced single-metric view

The Ranking toolbar has an **Advanced** button (next to Collapse all). Clicking it
opens a full-screen single-metric view that replaces the normal two-column grid:

- Header: **Back** button (returns to the grid) and a **metrics dropdown** that lists
  every metric in the catalog grouped by folder, with a search box. The currently
  shown metric is checked; metrics already added to the ranking show an "added"
  label. Selecting a metric switches the view to it (adding it to the ranking if it
  was not already selected). **Create new metric** closes the advanced view, opens
  the Metrics tab, and starts the metric editor in create mode.
- Body: a single scoring card (curve type, direction, max points, and the curve's
  parameters) with an enlarged curve chart. All curve interactions (drag handles,
  x-pan, click-to-add points) work exactly as in the grid, because the single card is
  rendered into the same `#ranking-cards` container.
- Advanced layout (all curve types): every type uses the Custom side-by-side UI — a
  "points location" card on the left (`w-[22rem]`) and the docked TICKERS card on
  the right (`w-80`), with the hint and chart below. The left card holds the editable
  point list (Custom), the thresholds/points editor (Steps), or the curve parameter
  inputs (Bell: Center/Steepness, S-Curve: Midpoint/Slope, Linear: Low/High
  anchors). Percentile has no editable points, so it renders only the docked TICKERS
  card on the right (no left card). The grid (non-advanced) expanded cards keep
  their original layout.

State: `rankingState.advancedOpen`, `rankingState.advancedMetricName`,
`rankingState.advancedSearch`. Functions: `openRankingAdvanced`,
`closeRankingAdvanced`, `selectRankingAdvancedMetric`,
`renderRankingAdvancedMetricList`, `renderRankingAdvancedDropdown`,
`toggleRankingAdvancedDropdown`, `closeRankingAdvancedDropdown`.

`renderRankingCards()` is advanced-aware: when `advancedOpen` is true it renders only
the selected metric's card, keeping the metric's true index so `drawRankingCurve`
still resolves the correct chart. The single-metric card HTML is generated by
`rankingCardHtml(m, idx)`, extracted from the previous inline map so the grid and the
advanced view share identical markup. The larger chart height is set by the inline
CSS rule `#ranking-main-grid.ranking-advanced [data-ranking-chart]`; the grid is
switched to a single column via `#ranking-main-grid.ranking-advanced`.

## Curve editor improvements

- **Per-point editors**: Custom curves render a point list (index, editable x/y,
  delete button) and Steps curves render two editable columns (thresholds as x cells
  with a per-row delete button, points as y cells). Edits update the curve live
  while typing; row/cell order is re-sorted on commit so focus is not lost mid-edit.
- **Hover sync (list to graph)**: hovering an editor row/cell calls
  `rankingPanToX` to center the chart on that point's x, then `Plotly.Fx.hover` on
  the handles trace so the matching hover box appears on the chart; it is cleared on
  mouse-leave.
- **Smoothness**: the slider is narrow (`w-24`) and paired with a 0-100 integer
  percentage input; both stay in sync and clamp to 0..100 (stored as 0..1).
- **Adaptive sampling**: `rankingSampleCurve` samples Steps as exact bins, Custom
  per-segment (24-120 samples between consecutive points so close points stay
  smooth), and all other families on a 720-point uniform grid. This removes the
  jagged appearance when points are close together.
- **Step clamping**: `rankingCurveDomain` is the single source of truth for the
  padded data range; thresholds are clamped in `rankingApplyDrag`,
  `rankingAddStepThreshold`, and `rankingNormalizeStepParams` so dragging a
  threshold past the last ticker value no longer desyncs the curve from the handles.
- **Ticker values panel**: in the grid view it is a bottom section listing each
  ticker with its raw value(s) and `points / max`, rendered with the same fixed-width
  layout as the advanced view — a column header (metric name with **Value** / **Pts**,
  one group per selected metric) above ticker rows (`ticker w-14 | value w-20 | pts
  w-32`). In the advanced view the same list is rendered as a compact card docked to
  the right of the points/params card (the wide bottom panel is hidden), for every
  curve type including Percentile. The advanced rows use fixed-width Value/Pts
  columns aligned under a header. A search bar filters by ticker. Clicking a card
  toggles a focused marker on the curve: `drawRankingCurve` adds a dotted vertical
  guide line, a value label, and an enlarged marker at that ticker's x position, and
  `rankingCenterFocusedCharts` recenters the chart on it. The chart top margin is
  enlarged so the focus label is not clipped. Focus state lives in
  `rankingState.focusedTicker`.

Functions: `rankingStepEditorHtml`, `rankingCustomPointsHtml`,
`rankingCurveDomain`, `rankingSampleCurve`, `rankingPanToX`,
`rankingCenterFocusedCharts`, `renderRankingTickerCards`, `rankingFocusTicker`.

## Example usage

1. Go to Data > Ranking.
2. In the Tickers subtab, the import-list tickers are listed with Add/Selected
   toggles; use Search, All, and Remove all as needed.
3. In the Metrics subtab, the full metric catalog is listed by folder (like the
   Visualize tab). Search to find a metric, click a row to add it to the ranking
   (its scoring card expands), or click an added row to remove it. Use "Show
   selected" to filter to the metrics already added and "Remove all" to clear.
4. On each collapsed card, the top row shows the metric name, curve type, and an
   editable Max pts value; expand a card to edit direction, curve parameters, and
   the mini-chart. Only one card is expanded at a time; use "Collapse all" to close
   every card.
5. In the Presets subtab, name the current configuration and save it, or load/delete
   an existing preset.
6. Click **Advanced** in the toolbar to focus a single metric full-screen: use the
   metrics dropdown to switch or create metrics, edit the curve, then click **Back**
   to return to the grid.

## Verification checklist

- Confirm `ranking_entry` prints `{ "ok": true, "values": {...} }`.
- In ElectronHome, confirm the Ranking tab renders the three icon subtabs
  (Tickers / Metrics / Presets), the ticker toggle list, the searchable metric list,
  collapsible scoring cards (single active metric, editable Max pts while collapsed,
  Collapse all), the bottom Ticker cards panel, and preset save/load/delete; confirm no
  regressions on other tabs.

## Full-screen Results view

The Ranking toolbar also has a **Results** button (next to Advanced). It opens a
full-screen, sortable results table that replaces the whole ranking grid.

- Layout: a header (Back button, "Ranking / Results" breadcrumb text, and a
  stock/metric counter) above a scrollable table with a sticky header row.
- Columns: Ticker, one points column per selected metric (header shows the metric
  name and its max points, e.g. `ROE · 10 pts`), and a trailing Total column
  (`totalPoints / totalMax pts`).
- Sorting: every column header is a button. Ticker toggles A-Z / Z-A. Each metric
  column sorts by that metric's points (missing values always sink to the bottom).
  The Total header cycles through four orders: total points descending, total points
  ascending, normalized score descending, normalized score ascending; its label and
  arrow reflect the active mode.
- Back returns to the normal grid. Results and Advanced are mutually exclusive
  (opening one closes the other).
- The table is refreshed by the same call sites that refresh the bottom Ticker
  cards panel, so Analyze, curve edits, ticker/metric changes, and preset loads all
  keep the open table current.

State: `rankingState.resultsOpen`, `rankingState.resultsSort = { key, dir }`.
Functions: `renderRankingResultsTable`, `rankingResultsCompare`,
`setRankingResultsSort`, `cycleRankingResultsTotalSort`, `openRankingResults`,
`closeRankingResults`. Detailed reference:
`Guides/ElectronHome_Ranking_Results_View.md`.
