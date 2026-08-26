# ElectronHome Graph Settings Panel

Guide for the Graph Settings panel in the Visualize tab (bottom container), covering its compact responsive card layout.

## Overview

The Graph Settings panel (`#viz-graph-settings-view`, a tab inside `#viz-bottom-container`) lets the user control chart appearance: toggles (ON/OFF), dropdowns, and color pickers. It is rendered entirely client-side by `renderVizGraphSettings()` in `ElectronHome/src/renderer.js`.

Layout changed (Aug 2026) from a single full-width vertical list of rows to a **responsive grid of category cards**. Each existing section (Chart, Axis Settings, X-Axis, Y-Axis, Lines & Grid, Colors) is now one bordered card. Cards flow left-to-right in ~200px-wide columns (~4 per row on a wide window) and automatically wrap to fewer columns as the Electron window shrinks.

## How the layout works

- The whole panel is one `<div class="viz-settings-grid">`.
- CSS (in the inline `<style>` block of `ElectronHome/src/index.html` — note `styles.css` is orphaned/not loaded, so layout CSS lives in the inline block):

```css
#viz-graph-settings-view { padding: 4px; }
.viz-settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 4px;
}
.viz-settings-card { min-width: 0; }
.viz-info-panel { grid-column: 1 / -1; }
```

- `repeat(auto-fill, minmax(200px, 1fr))` = as many 200px columns as fit, then wrap to the next row. This is what makes the panel responsive with no JavaScript.
- `.viz-settings-card` = one category. Cards use the design-system tokens via Tailwind utilities: `border border-outline-variant bg-surface-container-low`, header band `bg-surface-container-high`.
- `.viz-info-panel` = the "How it works" expansions for Axis Stretch and Dynamic Y-Axis. They are direct children of the grid (siblings of the cards) and span the full width (`grid-column: 1 / -1`) when opened, so a narrow card never bloats with long text.

## Controls inventory

Each control is a row inside its card: label on the left, control on the right.

| Card | Control | Type | data attribute |
| --- | --- | --- | --- |
| Chart | Show Markers | ON/OFF button | `data-viz-setting="showMarkers"` |
| Axis Settings | Axis Stretch | ON/OFF button + info | `data-viz-setting="axisStretch"`, `data-viz-info="axisStretch"` |
| Axis Settings | Dynamic Y-Axis | ON/OFF button + info | `data-viz-setting="dynamicYAxis"`, `data-viz-info="dynamicYAxis"` |
| Axis Settings | Y-Axis Decimals | dropdown | `data-viz-dropdown="yAxisDecimals"` |
| X-Axis | Date Format | dropdown | `data-viz-dropdown="xDateFormat"` |
| X-Axis | Tick Frequency | dropdown | `data-viz-dropdown="xTickMode"` (Auto adaptive / Yearly / Quarterly / Monthly / Weekly / Daily) |
| X-Axis | Tick Angle | dropdown | `data-viz-dropdown="xTickAngle"` |
| Y-Axis | Log Scale | ON/OFF button | `data-viz-setting="yLogScale"` |
| Lines & Grid | Smooth Lines | ON/OFF button | `data-viz-setting="smoothLines"` |
| Lines & Grid | X Gridlines | ON/OFF button | `data-viz-setting="gridX"` |
| Lines & Grid | X Gridline Density | dropdown | `data-viz-dropdown="xGridDensity"` (Match Labels / More / Dense) |
| Lines & Grid | Y Gridlines | ON/OFF button | `data-viz-setting="gridY"` |
| Colors | Background / Axis / Grid | color inputs (single 3-column swatch row) | `data-viz-setting="graphBg"` / `"axisColor"` / `"gridColor"` |

## Adaptive X-axis ticks (Tick Frequency = Auto)

When Tick Frequency is `Auto`, the X-axis no longer uses Plotly's native auto formatting. Instead the app chooses the label granularity from the visible date span:

- span > 730 days -> year labels (`2022`, `2023`, ...)
- span > 75 days -> hierarchical month labels: the year is shown once at a year change (e.g. `2024`), then the following months are month abbreviations (`Feb`, `Mar`, ...)
- otherwise -> hierarchical day labels: year at a year change, month at a month change, then day numbers (`02`, `03`, ...)

Day-number labels are thinned automatically so they never overlap: year/month context labels are always kept, and the remaining day labels are spread evenly to fit the plot width (`VIZ_MIN_PX_PER_X_LABEL = 48` px per label).

Ticks are recomputed on every pan/zoom (`plotly_relayout` with an `xaxis.range` key), debounced 120ms, via `attachVizAdaptiveXTickRelayoutListener()`. The re-entrancy guard `state.vizAdaptiveXTickPending` prevents relayout loops.

The thresholds are named constants (`VIZ_ADAPTIVE_YEAR_DAYS`, `VIZ_ADAPTIVE_MONTH_DAYS`) and can be tuned without touching the logic.

## X Gridline Density

The X Gridline Density dropdown controls how many vertical gridlines are drawn relative to the date labels, without adding more labels:

- `match` (default): gridlines only at the label ticks (previous behavior).
- `more`: gridlines one granularity step finer than the labels (e.g. year labels -> quarterly gridlines, month labels -> weekly gridlines).
- `dense`: gridlines two steps finer (e.g. year labels -> monthly gridlines, month labels -> daily gridlines).

The granularity ladder is `year -> quarter -> month -> week -> day` (`VIZ_TICK_LADDER`). Extra gridline-only positions are added to `xaxis.tickvals` with a blank `ticktext` entry so Plotly draws the gridline but no label. Density only has an effect when X Gridlines is ON.

## Adding a future category

The grid is designed to scale. To add a new category, insert one more card inside `.viz-settings-grid` in `renderVizGraphSettings()`:

```js
'<div class="viz-settings-card border border-outline-variant bg-surface-container-low">' +
  '<div class="px-md py-[2px] bg-surface-container-high flex items-center gap-sm">' +
    '<span class="text-[9px] text-outline uppercase mono flex-1">My Category</span>' +
  '</div>' +
  // ...rows (label left, control right)...
'</div>' +
```

The new card automatically joins the responsive grid and wraps to the next line when the window is narrow. For a new dropdown control, reuse `vizSettingDropdownHtml(setting)` plus a `setupVizSettingDropdown(setting, onSelect)` wiring inside `renderVizGraphSettings()`; for a new ON/OFF toggle, follow the existing `data-viz-setting` button pattern and add a click handler.

## Function reference

- `renderVizGraphSettings()` — rebuilds the whole panel HTML (header + card grid). Re-runs after every setting change and re-attaches handlers; preserves open info panels via the `_vizInfoPanelOpen` / `_vizDynYInfoPanelOpen` flags.
- `computeVizXAxisTicks(allDates, mode)` — groups plotted dates by period and keeps the first trading day of each; supports `year`, `quarter`, `month`, `week`, `day`.
- `applyVizHierarchicalLabels(ticks, mode)` — Finviz-style hierarchical labels for month/day modes (year/month shown once, then `Feb`, `Mar`, `02`, `03`, ...).
- `thinVizTickLabels(ticks, mode)` / `getVizMaxXAxisLabels()` — thin day-number labels to fit the plot width and avoid overlap.
- `buildVizXTicksWithDensity(allDates, labelMode, density)` — merges sparse label ticks with denser gridline ticks; gridline-only positions get a blank label.
- `pickVizAdaptiveTickMode(spanDays)` / `getVizVisibleDateRange(allDates)` / `filterVizDatesToRange(...)` — adaptive tick helpers.
- `applyVizAdaptiveXTicks()` / `attachVizAdaptiveXTickRelayoutListener()` — recompute adaptive ticks live on pan/zoom.
- `vizSettingDropdownHtml(setting)` — returns a `data-viz-dropdown` wrapper (button + absolutely positioned menu). Menu opens below the button and flips above via `positionVizSettingMenu()` when there is no room below within the panel.
- `setupVizSettingDropdown(setting, onSelect)` — wires open/close, option click, active check, and outside-click/Escape dismissal.
- `closeVizSettingDropdowns()` / `positionVizSettingMenu(wrap, menu)` — dropdown helpers, layout-agnostic.

## Integration points / risks

- Event handlers query `data-viz-setting` / `data-viz-info` / `data-viz-dropdown` within `#viz-graph-settings-view`, so card layout changes do not break wiring. Info panels are found by element ID (`#viz-axis-stretch-info`, `#viz-dynamic-yaxis-info`); those IDs must stay unique.
- Dropdown menus are `position: absolute; right: 0` inside each row's `relative` wrapper and can overlay neighbouring cards (cards have no `overflow: hidden`) — this is intentional so menus are not clipped.
- CSS must go in the inline `<style>` block of `index.html`; `styles.css` is not linked.
- Graph settings persist to localStorage under `finforge_viz_graph_settings` via `saveVizGraphSettings()` / `loadVizGraphSettings()`.

## Verification checklist

1. Visualize tab > Graph Settings shows 6 cards in ~4 columns on a wide window.
2. Resizing the window narrower wraps cards to 3, 2, then 1 column; no horizontal scrollbar.
3. Every ON/OFF toggle updates the chart as before.
4. Both "How it works" info banners open as full-width rows and persist across re-renders.
5. All four dropdowns open, flip above when near the bottom, apply the selection, and mark the active option.
6. The three color swatches recolor the chart live.
