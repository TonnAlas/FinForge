# ElectronHome Home Tab

This guide documents the Home tab implemented in the ElectronHome workspace (`ElectronHome/src/index.html` and `ElectronHome/src/renderer.js`) and its supporting persistence layer in `ElectronHome/main.js` and `ElectronHome/preload.js`.

## Purpose

The Home tab is the landing page of the FinForge workspace. It presents a minimal, bento-box style overview with three cards:

1. Links - website, feedback form, bug report, and financial disclaimer.
2. Data - the last time ticker data was fetched, plus a button to fetch all selected tickers.
3. Template - the currently active template and a shortcut to the Templates page.

The layout follows the institutional terminal design system already used across the app: square corners, mono labels, and the `surface-container` / `outline-variant` / `primary` / `secondary` color tokens.

## Layout and element IDs

The Home section lives in `ElectronHome/src/index.html` under `data-page="home"`. The renderer (`renderer.js`) targets these IDs:

| Element ID | Purpose |
| --- | --- |
| `home-links-list` | Container rendered with the four link rows. |
| `home-last-fetched` | Text showing the last data fetch timestamp. |
| `home-fetch-all-button` | Triggers a fetch of all selected tickers. |
| `home-fetch-status` | Optional inline status text shown while fetching. |
| `home-template-name` | Text showing the active template name. |
| `home-open-templates-button` | Navigates to the Templates page. |

## Links configuration

Links are declared in a single constant block at the top of `renderer.js`:

```js
const HOME_LINKS = {
  website: { label: 'Website', url: 'https://fin-forge.eu/' },
  feedback: { label: 'Feedback form', url: '' },
  bugs: { label: 'Report a bug', url: '' },
  disclaimer: { label: 'Financial disclaimer', url: 'https://fin-forge.eu/disclaimer/' },
};
```

- `website` and `disclaimer` are populated.
- `feedback` and `bugs` are placeholders (empty `url`). While a URL is empty, the row renders disabled with a `Pending` tag. To activate a link, fill in the URL string only; no other code changes are required.

Link rows with a URL open in the system browser through `window.finforge.openExternalUrl`.

## Home state persistence

Home state is stored in `data/home_state.json`:

```json
{
  "activeTemplateId": "default",
  "lastDataFetch": null
}
```

| Field | Type | Description |
| --- | --- | --- |
| `activeTemplateId` | string | ID of the last template that was loaded. Defaults to `default`. |
| `lastDataFetch` | string or null | ISO timestamp of the most recent completed data fetch. |

The file is created automatically on first run; a default copy is also committed under `data/home_state.json`.

### How the active template is tracked

The `finforge:loadTemplate` and `finforge:replaceWorkbookWithTemplate` handlers in `main.js` persist the loaded template ID via `saveHomeState({ activeTemplateId: template.id })`. The `loadHomeState()` helper resolves the ID back to a display name using `loadTemplates()`, falling back to the first template if the stored ID no longer exists.

### How the last fetched date is shown

The Data card shows the oldest data timestamp across the selected tickers. `getOldestTickerTimestamp()` scans `state.tickerDataTimestamps` for every ticker in `state.importList` and returns the earliest value; when no ticker has a timestamp, the card shows `Never`. The card re-renders whenever `refreshAllTickerStatuses()` or `updateTickerDataStatus()` updates a timestamp.

The dedicated `lastDataFetch` value in `home_state.json` still records the most recent fetch-batch completion time, but the Home card is driven by the per-ticker file timestamps so it reflects how old the oldest local data actually is.

## Main-process additions

Two helpers were added to `main.js`:

- `loadHomeState()` - reads and normalizes `data/home_state.json`, resolving `activeTemplateName`.
- `saveHomeState(partial)` - merges and writes a partial update to `data/home_state.json`.

Two IPC channels were added:

| Channel | Direction | Input | Output |
| --- | --- | --- | --- |
| `finforge:loadHomeState` | renderer -> main | none | `{ ok, activeTemplateId, activeTemplateName, lastDataFetch }` |
| `finforge:setLastDataFetch` | renderer -> main | `timestamp` (ISO string) | `{ ok, lastDataFetch }` |

## Preload bridge

`preload.js` exposes two methods on `window.finforge`:

- `loadHomeState()` - invokes `finforge:loadHomeState`.
- `setLastDataFetch(timestamp)` - invokes `finforge:setLastDataFetch` with an ISO timestamp string.

## Renderer functions

| Function | Purpose |
| --- | --- |
| `renderHomeLinks()` | Renders the four link rows into `home-links-list`. |
| `formatLastFetched(value)` | Formats an ISO timestamp or returns `Never`. |
| `getOldestTickerTimestamp()` | Returns the earliest per-ticker data timestamp across selected tickers, or `null`. |
| `renderHomePage()` | Refreshes all three Home cards from current state. |
| `loadHomeState()` | Loads home state over the bridge and re-renders. |
| `openHomeLink(url)` | Opens a URL externally. |
| `updateHomeLastFetched(timestamp)` | Records the most recent fetch-batch completion time. |
| `maybeMarkAllDataFetched()` | Persists the fetch-batch completion time once no ticker is still fetching. |

## Example usage

1. Launch the workspace and open the Home tab.
2. The Links card shows the website and disclaimer links; feedback and bug rows show `Pending` until their URLs are filled in `HOME_LINKS`.
3. The Template card shows `Beginning Template` by default. Load a custom template from the Templates page and the Home card updates to its name.
4. The Data card shows the oldest fetch date across the selected tickers, or `Never` when no ticker has local data. Add tickers in the Search tab and their data dates appear automatically; clicking `Fetch all data` refreshes the data and updates the date.

## Notes

- The Data card shows the oldest (least recent) timestamp among the selected tickers, so it surfaces the stalest local data. Tickers without a timestamp are ignored in the computation.
- The fetch button uses the same behavior as the Import tab's `Fetch all`: it fetches tickers that are missing or pending, and skips tickers that are already ready.
- All new functions guard against missing DOM elements, so the tab degrades gracefully if the bridge is unavailable (for example, when `index.html` is opened directly in a browser).
