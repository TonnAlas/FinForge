# ElectronHome Statement Import UI

This guide documents the FinForge Electron importing screen implemented in `ElectronHome/src/index.html` and `ElectronHome/src/renderer.js`.

## Purpose
The screen lets the user choose which balance-sheet or income-statement line items should be printed into Excel. The full Yahoo Finance statement data remains stored in parquet by the Python import pipeline; the UI only controls the printed subset and display scaling preferences.

## Files
- `ElectronHome/main.js` - Main process (IPC handlers, window management, Python spawning)
- `ElectronHome/preload.js` - Preload bridge (exposes `window.finforge` to renderer)
- `ElectronHome/src/index.html` - Main workspace HTML
- `ElectronHome/src/renderer.js` - Workspace renderer logic (Imports, Ratios, Company Profile, Research)
- `ElectronHome/src/launcher.html` - Launcher window HTML
- `ElectronHome/src/launcher_renderer.js` - Launcher window logic
- `ElectronHome/src/styles.css` - Application styles

## UI Layout (Workspace Window)
The workspace window has a left sidebar navigation and a main content panel.

### Sidebar Tabs
- **Imports** - Statement import UI (balance sheet, income statement, cash flow)
- **Ratios** - Ratio maker with formula builder (create, edit, delete ratios)
- **Company Profile** - View company metadata for selected tickers
- **Research** - Search for equity research papers (DuckDuckGo or Google/Whoogle)

### Imports Tab Layout
- Top bar: scope buttons (Balance sheet, Income statement, Cash flow), Import button, Save button, status indicator
- Left panel: searchable statement catalog with line items
- Right panel: selected items for printing, display mode and divisor controls
- Footer: ticker search bar with autocomplete results from Yahoo Finance

## Renderer Behavior
### Data model
The renderer keeps a local state object with:
- `scope`: `balanceSheet`, `incomeStatement`, or `cashFlow`
- `search`: lower-cased filter text
- `catalog`: object containing `balanceSheet`, `incomeStatement`, and `cashFlow` arrays
- `settings`: object matching `data/statement_settings.json`
- `tickers`: current import list
- `researchResults`: search results from research module

### Main functions (Imports tab)
- `setStatus(message, tone)` updates the status pill.
- `normalizeSettings(settings)` coerces raw JSON into a safe settings shape.
- `getSelectedItems(scope)` returns the selected items for the active scope.
- `getCatalogItems(scope)` returns the available items for the active scope.
- `renderScopeButtons()` updates active tab styling.
- `renderCatalog()` renders the searchable catalog list.
- `renderSelected()` renders the selected print subset.
- `renderDisplay()` syncs display inputs from settings.
- `renderAll()` refreshes all visible panels.
- `toggleItem(scope, item)` adds or removes a line item from the selection.
- `setScope(scope)` switches between balance-sheet, income-statement, and cash-flow lists.
- `loadFromDisk()` loads catalog and settings through the preload bridge.
- `saveToDisk()` persists the current settings to JSON.
- `importData()` saves settings and spawns the Python import script.
- `fetchTickerData(ticker)` spawns the Python data fetch for a single ticker.

### Main functions (Ratios tab)
- `loadRatios()` loads ratio definitions from `Importing/ratio_config.json`.
- `saveRatio()` persists ratio definitions.
- `deleteRatio()` removes a ratio.
- `refreshRatiosSheet()` spawns the Python ratio calculator.

### Main functions (Company Profile tab)
- `loadCompanyProfile(ticker)` loads metadata from `data/metadata/{TICKER}.json`.

### Main functions (Research tab)
- `searchResearchPapers(query, source)` spawns the Python research module.

### Ticker Search
- Typing in the ticker search bar triggers `searchTickerUniverse(query)` via the preload bridge.
- Results from Yahoo Finance are filtered to show only EQUITY instruments.
- Clicking a result adds it to the import list.

### Inputs
- Search text in the filter box (catalog filter + ticker search).
- Clicks on catalog rows to toggle selection.
- Clicks on selected rows to remove items.
- Display mode and divisor inputs.
- Scope button clicks to switch statement type.
- Import button click to run the import.
- Token button clicks in the Ratio Maker.

### Outputs
- Updates the visible catalog and selection lists.
- Writes the canonical settings JSON file via the preload bridge.
- Spawns Python import scripts for data transfer to Excel.
- Writes updated ratio config to disk.

## Preload Bridge Contract
The renderer depends on `window.finforge` with these methods:
- `loadStatementCatalog()` returns an object with `balanceSheet`, `incomeStatement`, and `cashFlow` arrays.
- `loadStatementSettings()` returns the persisted settings object.
- `saveStatementSettings(settings)` writes the settings object back to disk.
- `loadImportList()` returns the current ticker list.
- `saveImportList(importList)` persists the ticker list.
- `searchTickerUniverse(query)` searches Yahoo Finance for tickers.
- `importStatement(scope)` runs the Python import script.
- `fetchTickerData(ticker)` fetches data for a single ticker.
- `loadCompanyProfile(ticker)` loads company metadata.
- `searchResearchPapers(query, source)` searches for research papers.
- `loadRatios()` / `saveRatios(ratios)` manage ratio definitions.
- `refreshRatiosSheet()` recalculates all ratios.

See the full [Preload Contract](ElectronHome_Preload_Contract.md) for complete API documentation.

## Configuration
- Requires Electron with `contextIsolation: true` and `nodeIntegration: false`.
- Requires the repo root `data/` directory to contain `statement_settings.json` and `statement_catalog.json`.
- Python virtual environment at `.venv/Scripts/python.exe` for import and fetch operations.

## Assumptions and Limits
- The catalog is loaded from JSON, not fetched from the network.
- The UI does not mutate Parquet data directly.
- Excel printing still depends on the Python importers reading the same shared settings file.
- Research papers are fetched via DuckDuckGo by default; Google search requires a local Whoogle server.

## Example Workflow
### Importing Statements
1. Open the importing screen from the workspace window.
2. Choose `Balance sheet`, `Income statement`, or `Cash flow`.
3. Search for a line item in the catalog.
4. Click rows to add or remove them from the printed subset.
5. Adjust display scaling if needed.
6. Click `Save settings` or click `Import` to save and import.

### Adding and Fetching a Ticker
1. Type a ticker symbol in the search bar.
2. Select the ticker from the autocomplete results.
3. The ticker is added to the import list.
4. Data is fetched automatically in the background.

### Creating a Ratio
1. Go to the Ratios tab.
2. Enter a name, formula, and optional notes.
3. Use token buttons to insert data sources (IS:, BS:, CF:, P:, RATIO:).
4. Click Save to persist the ratio.
