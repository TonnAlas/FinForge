# ElectronHome Visualize Sub-Tabs Guide

## Overview

The Visualize page ticker selector (right sidebar) uses a header-based mode switcher. The container header shows the active mode as simple text (**Tickers** or **Data**). Clicking the mode text OR the dropdown icon beside it opens a small dropdown menu with two options: **Tickers** and **Data**. A search icon in the header toggles a shared search bar that appears under the header (hidden by default) and filters the currently active dataset.

- **Tickers** mode shows the existing watchlist selection panel (available/selected counters, ticker list, "Select all" and "Clear" buttons). This is the default and behaves exactly as before.
- **Data** mode is a placeholder panel displaying "Data view coming soon". It is intended to be extended later to show data categories for the selected tickers.

The mode switcher only affects the ticker selector sidebar. The chart area and splitters are unchanged.

## Files Changed

- `ElectronHome/src/index.html` - added the dynamic header title and the dropdown menu; removed the previous two-button toggle bar.
- `ElectronHome/src/renderer.js` - added state, menu open/close logic, outside-click handling, and initialization.

## How It Works

### HTML Structure (`index.html`)

Inside the right sidebar of `#viz-grid`:

1. Header block with a single clickable mode button (title text + dropdown arrow combined) and a search toggle:

   ```html
   <button id="viz-workspace-title-button" aria-haspopup="menu" aria-expanded="false">
     <span id="viz-workspace-title">Tickers</span>
     <span class="material-symbols-outlined">expand_more</span>
   </button>
   <button id="viz-workspace-search-button" aria-label="Toggle search" aria-expanded="false">
     <span class="material-symbols-outlined">search</span>
   </button>
   <div id="viz-workspace-menu" class="hidden absolute left-0 top-full mt-1 z-20 ...">
     <button data-viz-view="tickers" ...>Tickers</button>
     <button data-viz-view="data" ...>Data</button>
   </div>
   ```

2. `#viz-search-bar` - shared search bar under the header. Hidden by default via the `hidden` class; toggled by the search icon. Contains `#viz-ticker-search` and filters the active dataset.
3. `#viz-tickers-view` - wraps the counters, ticker list, and "Select all"/"Clear" buttons. Visible by default.
4. `#viz-data-view` - placeholder panel ("Data view coming soon"). Hidden by default via the `hidden` class.

Both view containers use `flex-1 min-h-0` so they fill the remaining sidebar height. Only one is visible at a time.

### JavaScript Logic (`renderer.js`)

Element references:

- `vizWorkspaceTitle` -> `#viz-workspace-title`
- `vizWorkspaceTitleButton` -> `#viz-workspace-title-button` (single combined mode button: title text + `expand_more` arrow; the old `#viz-workspace-menu-button` was merged into this one)
- `vizWorkspaceMenu` -> `#viz-workspace-menu`
- `vizWorkspaceSearchButton` -> `#viz-workspace-search-button`
- `vizSearchBar` -> `#viz-search-bar`
- `vizTickersView` -> `#viz-tickers-view`
- `vizDataView` -> `#viz-data-view`

State:

- `state.vizWorkspaceView` - current mode, either `'tickers'` (default) or `'data'`.
- `state.vizSearchVisible` - boolean, whether the shared search bar is shown (default `false`).

Functions:

- `setVizWorkspaceView(viewName)`:
  - **Input:** `viewName` - a string (`'tickers'` or `'data'`). Any other value falls back to `'tickers'`.
  - **Output:** none (mutates DOM and state).
  - Behavior:
    1. Sets `state.vizWorkspaceView`.
    2. Toggles the `hidden` class on `#viz-tickers-view` and `#viz-data-view`.
    3. Updates the header title text (`#viz-workspace-title`) to the active mode name.
    4. Highlights the active option in the dropdown (adds `text-primary` and `bg-primary/10`).
    5. Closes the dropdown menu.
- `openVizWorkspaceMenu()` - removes `hidden` from the menu and sets `aria-expanded="true"`.
- `closeVizWorkspaceMenu()` - adds `hidden` to the menu and sets `aria-expanded="false"`.
- `toggleVizWorkspaceMenu()` - opens if closed, closes if open.
- `setVizSearchBarVisible(visible)` - shows/hides `#viz-search-bar`, sets `state.vizSearchVisible`, and highlights the search icon when active (`text-primary`).
- `toggleVizSearchBar()` - flips `state.vizSearchVisible` and focuses the search input when shown.

Event listeners:

- Clicking `#viz-workspace-title-button` (title + arrow as one button) toggles the menu (uses `stopPropagation`).
- Clicking `#viz-workspace-search-button` toggles the shared search bar.
- Clicking an option inside `#viz-workspace-menu` (any `[data-viz-view]`) calls `setVizWorkspaceView` with that value.
- A `document` click listener closes the menu when clicking anywhere outside the button and the menu.
- The `#viz-ticker-search` input filters the active dataset via `handleVizTickerSearch` (currently the ticker list).

Initialization:

- `setVizWorkspaceView('tickers')` and `setVizSearchBarVisible(false)` are called once during startup to ensure the state, title, option highlighting, and search bar match the default HTML.

## Inputs and Outputs

| Item | Type | Description |
| --- | --- | --- |
| `state.vizWorkspaceView` | string (`'tickers'` \| `'data'`) | Current active mode. |
| `state.vizSearchVisible` | boolean | Whether the shared search bar is shown. |
| `setVizWorkspaceView(viewName)` | function | Switches the visible view and updates title, options, and menu. |
| `openVizWorkspaceMenu()` / `closeVizWorkspaceMenu()` | functions | Open and close the dropdown menu. |
| `setVizSearchBarVisible(visible)` / `toggleVizSearchBar()` | functions | Show/hide the shared search bar. |
| `#viz-tickers-view` | DOM element | Watchlist selection panel (ticker chooser). |
| `#viz-data-view` | DOM element | Placeholder panel for future data view. |

## Configuration / Environment

- No configuration required. Uses the existing Tailwind CSS (CDN) utility classes and the institutional terminal design system.
- No new dependencies.

## Assumptions and Limitations

- The **Data** mode is a placeholder only. It does not yet display any data. Extend it later using `state.vizSelectedTickers` to show data relevant to the currently selected tickers.
- The mode state (`state.vizWorkspaceView`) is in-memory only and resets when the window reloads.
- The chart area and splitter behavior are unaffected by the mode switch.

## Example Usage

```js
// Switch to the Data placeholder mode
setVizWorkspaceView('data');

// Switch back to the Tickers (watchlist) mode
setVizWorkspaceView('tickers');

// Show or hide the shared search bar
setVizSearchBarVisible(true);
toggleVizSearchBar();
```

## Verification

1. Open the Visualize page.
2. The ticker selector header shows **Tickers**, a dropdown icon, and a search icon. The full watchlist panel is visible and the search bar is hidden.
3. Click the dropdown icon OR the **Tickers** text - a menu opens with **Tickers** and **Data** options; the active option is highlighted.
4. Choose **Data** - the header title changes to **Data** and the placeholder "Data view coming soon" appears.
5. Click the dropdown icon again and choose **Tickers** - the header returns to **Tickers** and the watchlist panel returns.
6. Click the search icon - the search bar appears under the header. Clicking it again hides the search bar.
7. With the search bar open, type a filter (e.g. "MS") - the ticker list filters to matches and the counter updates ("1 available"). The search bar is available in both modes.
8. Clicking outside the open menu closes it.
9. Ticker selection, "Select all", and "Clear" continue to work exactly as before.
