# ElectronHome Chart Legend (Visualize tab bottom container)

This guide documents the chart legend view that lives in the bottom container of the Visualize tab (`#viz-bottom-container`). The legend lists the active tickers and metrics and lets the user choose, per item, the chart type (Line / Area / Bar / Auto) and the color used on the chart.

## Purpose

Before this feature, chart styling was controlled only globally:

- Color was assigned per metric (`metric.color`) and shared by every ticker of that metric.
- Chart type was a single global dropdown in Graph Settings (`state.vizChartType`).
- Tickers were distinguished only by dash pattern.

The legend gives per-item control so each active ticker and each active metric can have its own color and chart type, matching the request to display active tickers and metrics with per-item chart-type and color selection.

## Design decisions

| Aspect | Behavior |
|---|---|
| Color scope | Mode-based. **Metric colouring wins except when comparing many tickers on a single metric** (1x1 and 1xN -> metric colouring; Nx1 -> ticker colouring). The non-active dimension's color control is disabled (greyed out) in the legend. |
| Chart type scope | Per combination. A trace (ticker x metric) resolves its chart type from the ticker override first, then the metric override, then defaults to Line. |
| Global Chart Type | Removed from Graph Settings. The legend is now the only place to set chart types. |
| Sections | Tickers and Metrics sections are collapsible (click the header), matching the Metrics folder collapse pattern. |

## State (renderer.js)

Two in-memory maps are added to the `state` object:

```js
vizTickerStyles: {},          // ticker      -> { color: string|null, chartType: 'auto'|'line'|'area'|'bar' }
vizMetricStyles: {},          // metric name -> { color: string|null, chartType: 'auto'|'line'|'area'|'bar' }
vizLegendCollapsed: { tickers: false, metrics: false },  // collapsible section state
```

These are in-memory only (not persisted to localStorage), consistent with the other graph settings (Axis Stretch, Dynamic Y-Axis, Y-Axis Decimals, Show Markers).

## Functions

### `getVizTickerStyle(ticker)`
- Input: `ticker` (string).
- Output: `{ color, chartType }` for the ticker, lazily created with `{ color: null, chartType: 'auto' }` when absent.

### `getVizMetricStyle(metricName)`
- Input: `metricName` (string).
- Output: `{ color, chartType }` for the metric, lazily created with `{ color: null, chartType: 'auto' }` when absent.

### `getVizColorMode()`
- Input: none.
- Output: `'ticker'` only when many tickers are compared on a single metric (`vizActiveTickers.size > 1 && vizMetrics.length === 1`); otherwise `'metric'`. This includes the 1 ticker x 1 metric case, where the single metric drives the colour.

### `resolveVizTraceColor(ticker, metric)`
- Input: `ticker` (string), `metric` (object with `.name` and `.color`).
- Output: effective hex color for a trace.
- Resolution order:
  - Metric mode (1 ticker x 1 metric, or 1 ticker x many metrics): metric style color -> `metric.color` -> `VIZ_COLORS[0]`.
  - Ticker mode (many tickers x 1 metric): ticker style color -> `VIZ_COLORS[0]`.

### `resolveVizTraceChartType(ticker, metric)`
- Input: `ticker` (string), `metric` (object with `.name`).
- Output: `'line' | 'area' | 'bar'`.
- Resolution order: ticker style `chartType` (if not `'auto'`) -> metric style `chartType` (if not `'auto'`) -> `'line'`.

### `renderVizLegendRow(kind, name, color, chartType, colorEnabled)`
- Input:
  - `kind`: `'ticker'` | `'metric'`.
  - `name`: display name (ticker symbol or metric name).
  - `color`: hex color shown in the swatch.
  - `chartType`: current chart type for the item.
  - `colorEnabled`: whether the color control is active for this item (false when the other dimension controls the colour scheme).
- Output: HTML string for one compact legend row containing:
  - A color swatch plus a native `<input type="color">` (`data-viz-legend-color`), disabled when `colorEnabled` is false.
  - The item name (`data-viz-legend-kind` / `data-viz-legend-name` on the row).
  - A chart-type button (`data-viz-legend-type`) showing the current type + an `arrow_drop_down` chevron. Clicking it opens a custom dropdown menu (see `openVizChartTypeMenu`).
  - A remove button (`data-viz-legend-remove`).

### `renderVizLegend()`
- Input: none (reads `state.vizActiveTickers` and `state.vizMetrics`).
- Output: replaces the innerHTML of `#viz-bottom-content`.
- Renders:
  - Two collapsible sections (click the header to collapse/expand, matching the Metrics folder system):
    - **Tickers (N)** — one row per active ticker.
    - **Metrics (N)** — one row per active metric.
- Color pickers are disabled on the dimension that does not drive the current colour scheme.
- When there are no active tickers or metrics, renders an empty-state message.

### `openVizChartTypeMenu(btn, row)`
- Input: `btn` (the chart-type button element), `row` (the legend row element).
- Output: none.
- Builds a `#viz-chart-type-menu` div with Auto/Line/Area/Bar options (current type highlighted with a check) and appends it inside the row's `relative` wrapper (`data-viz-legend-type-wrap`) as a `position: absolute` menu right-aligned to the button.
- CSS-anchored positioning makes it immune to font-scale `zoom`, transforms, and viewport math, so it always appears exactly at the button.
- Opens below the button and flips upward when there is not enough room inside the legend container.
- Clicking an option updates the item's `chartType`, updates the button label in place, closes the menu, then calls `updateVizChart()`.
- Closes on outside click, Escape, scroll, or window resize.

### `closeVizChartTypeMenu()`
- Input: none.
- Output: none.
- Removes `#viz-chart-type-menu` and cleans up all temporary listeners.

## Event handling

Delegated listeners on `#viz-bottom-content`:

| Event | Target | Action |
|---|---|---|
| `click` | `[data-legend-toggle]` | Collapse/expand the section body and rotate the chevron (matches Metrics folder behaviour). |
| `click` | `[data-viz-legend-type]` | Open the custom chart-type dropdown via `openVizChartTypeMenu(btn, row)`. |
| `click` | `[data-viz-legend-type-opt]` | Set the item's `chartType`, update the button label, close the menu, and refresh the chart. |
| `change` | `[data-viz-legend-color]` | Update `color` in the corresponding style map, update the swatch background in place, then `updateVizChart()`. |
| `click` | `[data-viz-legend-remove]` | Remove the item via `toggleVizTicker(name)` or `toggleVizMetric(name)`. |

## Integration points

- `toggleVizTicker(ticker)`:
  - On add, seeds a default palette color (`VIZ_COLORS` cycled with `_vizTickerColorIndex`) and `chartType: 'auto'`.
  - On remove, deletes `vizTickerStyles[ticker]`.
  - Calls `renderVizLegend()`.
- `toggleVizMetric(metricName)`:
  - On add, ensures a `vizMetricStyles[metricName]` entry exists.
  - On remove, deletes `vizMetricStyles[metricName]`.
  - Calls `renderVizLegend()`.
- `renderVizChartTraces(tickers, metrics)`:
  - Uses `resolveVizTraceChartType(ticker, metric)` and `resolveVizTraceColor(ticker, metric)` for every trace instead of the old global `state.vizChartType` / `metric.color`.
  - Dash pattern remains per-ticker index (`VIZ_DASH_PATTERNS`).
- `setActivePage('visualize')`:
  - Calls `renderVizLegend()` alongside `renderVizTickerList()` and `renderVizMetricsList()`.
- Collapsed section state is stored in `state.vizLegendCollapsed` so it survives legend re-renders.
- `renderVizGraphSettings()`:
  - The global "Chart Type" dropdown and its auto-selected feedback were removed.
  - "Show Markers" is now always shown (previously hidden when the global type was Bar).

## HTML structure (index.html)

The bottom container content element (`#viz-bottom-content`) is a scrollable area that `renderVizLegend()` fills.

## Graph Settings dropdowns (custom, Aug 2026)

The Graph Settings view (`#viz-graph-settings-view`, opened via the `tune` icon in the bottom container header) contains four dropdowns that use the same custom dropdown pattern as the legend chart-type control:

| Setting | State key | Options |
|---|---|---|
| Y-Axis Decimals | `state.vizYAxisDecimals` | 0-6 (default 4) |
| Date Format | `state.vizXDateFormat` | System, DD.MM.YYYY, MM.DD.YY, MM.DD.YYYY, DD.MM.YY, MM/YY, Mon YYYY, Mon, YYYY, DD Mon YYYY |
| Tick Frequency | `state.vizXTickMode` | Auto, Yearly, Quarterly, Monthly |
| Tick Angle | `state.vizXTickAngle` | 0, -45, -90 (degrees) |

Native `<select>` elements were replaced because they show no arrow (Tailwind forms forces `appearance:none`) and their popups get clipped inside the scrollable `#viz-graph-settings-view` (overflow-y:auto) - the same issue that led to the legend's custom chart-type menu.

The implementation lives in `renderer.js` next to `renderVizGraphSettings()`:

- `VIZ_SETTING_OPTIONS` - value/label pairs for each setting.
- `vizSettingDropdownHtml(setting)` - renders the button (label + `arrow_drop_down` chevron) and the hidden absolute menu.
- `setupVizSettingDropdown(setting, onSelect)` - wires open/close and option selection; `onSelect` receives the chosen value.
- `closeVizSettingDropdowns()` / `positionVizSettingMenu()` - close all menus and flip the menu above the button when there is no room below.
- Document-level `mousedown` (outside click) and `Escape` close any open graph-settings menu.

## Assumptions / limitations

- Colors are stored as hex strings and are compatible with the native color input (`#rrggbb`).
- The chart-type control is a custom dropdown (not a native `<select>`) because native select popups get clipped inside the scrollable `#viz-bottom-content` container; the menu is `position: absolute` inside the row's relative wrapper, right-aligned to the button, and flips up/down to stay within the container.
- Style overrides are in-memory only and reset when the app reloads.
- Removing an item deletes its style entry; re-adding a ticker gets a fresh palette color, while metrics keep their existing `metric.color` as the fallback.
- The "Show Markers" setting remains a single global toggle and applies only to line/area traces.

## Example usage

1. Open the Visualize tab.
2. Add one or more tickers from the Tickers view in the right sidebar.
3. Add one or more metrics from the Metrics view.
4. In the bottom legend:
   - Click a color swatch to open the native color picker and change that item's color.
   - Use the dropdown to set the chart type (Auto/Line/Area/Bar) for that item.
   - Click the x to remove the item from the chart.
5. The chart updates live; a ticker color overrides a metric color, and a ticker chart type overrides a metric chart type.
