# ElectronHome Ranking - Full-screen Results View

## Purpose

The Ranking tab's **Results** button opens a full-screen, sortable results table. It
replaces the entire ranking grid (left configuration panel, scoring cards, and the
bottom Ticker cards panel) with a single table showing each selected ticker, the
points it earned per selected metric, and a trailing **Total** column
(`totalPoints / totalMax pts`). A Back button (with a "Ranking / Results" breadcrumb)
returns to the normal ranking grid.

## How it works

- The data comes from the existing aggregation function `rankingComputeResults()` in
  `ElectronHome/src/renderer.js`. No new backend work, IPC channel, or Python code is
  required; the Results view is a new presentation of data the Ranking tab already
  computes.
- `renderRankingResultsTable()` builds the table header and body, applies the current
  sort, and renders into `#ranking-results-head` / `#ranking-results-body`.
- `renderRankingResults()` (the shared refresh entry point kept for the existing call
  sites) now additionally calls `renderRankingResultsTable()` whenever
  `rankingState.resultsOpen` is true, so the open table stays current after Analyze,
  curve edits, ticker/metric changes, and preset loads.

## Markup (ElectronHome/src/index.html)

- `#ranking-results-btn` — the toolbar button (placed next to Advanced) that opens
  the view.
- `#ranking-results-view` — the full-screen container, a sibling of
  `#ranking-main-grid` inside the `<section data-page="ranking">`. Hidden by default.
- `#ranking-results-back` — Back button.
- `#ranking-results-status` — right-aligned stock/metric counter.
- `#ranking-results-table-wrap` — scrollable wrapper (`overflow-auto`).
- `#ranking-results-table`, `#ranking-results-head` (`<thead>`),
  `#ranking-results-body` (`<tbody>`) — the table. Header cells use
  `sticky top-0 z-10 bg-surface-container-high` so the header stays visible while
  scrolling.

## State (ElectronHome/src/renderer.js)

- `rankingState.resultsOpen` (boolean) — whether the full-screen Results view is
  open. Default `false`.
- `rankingState.resultsSort` (`{ key, dir }`) — active sort. Default
  `{ key: 'totalPoints', dir: 'desc' }`. `key` is one of `'ticker'`, `'score'`,
  `'totalPoints'`, or a metric name; `dir` is `'asc'` or `'desc'`.

## Functions

| Function | Inputs | Outputs / behavior |
|----------|--------|--------------------|
| `renderRankingResultsTable()` | none | Renders the thead + tbody from `rankingComputeResults()`, honoring `resultsSort`. Shows an empty-state row ("No tickers selected" / "No metrics selected") when applicable, and updates the counter. |
| `rankingResultsCompare(a, b, key)` | `a`, `b` (row objects), `key` (sort key) | Returns `-1`, `0`, or `1`. `ticker` compares alphabetically; `totalPoints` and `score` compare numerically; a metric key compares `perMetric[key].points` with missing values treated as `-Infinity` (so `n/a` rows sort last). Ties fall back to ticker order. |
| `setRankingResultsSort(key)` | `key` (string) | If `key` matches the current sort key, toggles direction; otherwise sets the key and applies a sensible default direction (`ticker` -> ascending, everything else -> descending). Re-renders the table. |
| `cycleRankingResultsTotalSort()` | none | Cycles the Total-column sort through four states: total points desc -> total points asc -> score desc -> score asc. Re-renders the table. |
| `openRankingResults()` | none | Closes the advanced view if open, sets `resultsOpen = true`, hides `#ranking-main-grid`, shows `#ranking-results-view`, renders the table, and triggers `loadRankingData()` if no values are cached yet. |
| `closeRankingResults()` | none | Sets `resultsOpen = false`, hides `#ranking-results-view`, shows `#ranking-main-grid`, and calls `renderRankingTab()` to restore the grid. |

Supporting helpers: `rankingResultsSortKey()` and `rankingResultsSortDir()` read the
current sort state defensively (falling back to the defaults); `rankingResultsSortArrow`
maps `'asc'`/`'desc'` to the Material Symbols icon names `arrow_upward` /
`arrow_downward`.

## Sorting behavior

- **Ticker** header: toggles A-Z then Z-A.
- **Metric** headers: sort by that metric's points; rows with no data for that metric
  (`n/a`) always sort to the bottom regardless of direction.
- **Total** header: cycles total points desc -> total points asc -> score desc ->
  score asc. The header label shows the active mode ("Total · Pts" or "Total · Score")
  and an arrow indicating direction. This covers both interpretations of "order by
  max point": the raw sum of points and the normalized 0-100 score.

## Event listeners

- `#ranking-results-btn` click -> `openRankingResults()`.
- `#ranking-results-back` click -> `closeRankingResults()`.
- `#ranking-results-head` click (delegated) -> reads the closest
  `[data-ranking-sort]` button; `data-ranking-sort="total"` calls
  `cycleRankingResultsTotalSort()`, any other key calls `setRankingResultsSort(key)`.

## Mutual exclusion

- `openRankingResults()` closes the advanced view first
  (`if (rankingState.advancedOpen) closeRankingAdvanced()`).
- `openRankingAdvanced()` closes the Results view first
  (`if (rankingState.resultsOpen) closeRankingResults()`).

Both are full-screen presentations of the same data, so only one is ever visible.

## Configuration and environment

- No new dependencies (Python or JavaScript).
- No new IPC channels; reuses `finforge:computeRanking` via `loadRankingData()`.
- Uses the existing design tokens (Tailwind theme: `border-hairline`,
  `bg-surface-container-high`, `text-on-surface`, `text-primary`,
  `text-outline-variant`) and the `mono` label/body typography.

## Assumptions and limitations

- The Results view reuses `rankingState.tickers` and `rankingState.metrics`, so it
  reflects exactly the same universe and metrics as the grid view.
- The Total column displays raw `totalPoints` out of the available `totalMax`
  (metrics with missing data are excluded from the denominator, matching the grid's
  Ticker cards panel).
- `resultsOpen` persists across page switches (consistent with how the Advanced view
  already behaves). Re-entering the Ranking tab keeps whichever view was last active.
- There is no search box in the Results view (not requested); filtering remains
  available in the grid's bottom Ticker cards panel.

## Example usage

1. Go to Data > Ranking, select tickers and metrics, and click Analyze.
2. Click **Results** in the toolbar. The full-screen table appears with a Ticker
   column, one points column per metric, and a Total column.
3. Click the Ticker header to sort A-Z (click again for Z-A).
4. Click any metric header to sort by that metric's points.
5. Click the Total header repeatedly to cycle total points and score ordering.
6. Click **Back** to return to the ranking grid.
