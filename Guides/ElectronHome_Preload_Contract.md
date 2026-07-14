# ElectronHome Preload Contract

This guide documents the Electron preload bridge implemented in `ElectronHome/preload.js`.

## Purpose
The preload bridge exposes safe, file-backed helpers to the renderer so the importing, ratio, ticker, and research UIs can read and persist application state. The bridge is the sole communication channel between the Electron renderer and the host system.

## Exposed API
The bridge registers `window.finforge` with these members:

### `version`
- Type: `string`
- Value: `0.1.0`

---

### Statement Catalog & Settings

#### `loadStatementCatalog()`
- Input: none
- Output: object with:
  - `balanceSheet`: `string[]`
  - `incomeStatement`: `string[]`
  - `cashFlow`: `string[]`
- Behavior: reads `data/statement_catalog.json` if it exists; otherwise returns empty arrays.

#### `loadStatementSettings()`
- Input: none
- Output: object with:
  - `mode`: `balanceSheet | incomeStatement | cashFlow`
  - `display`: `{ mode: string, divisor: number }`
  - `balanceSheet`: `{ selected: string[] }`
  - `incomeStatement`: `{ selected: string[] }`
  - `cashFlow`: `{ selected: string[] }`
- Behavior: reads `data/statement_settings.json` if it exists; otherwise returns defaults.

#### `saveStatementSettings(settings)`
- Input: settings object matching the schema above.
- Output: the same object after it is written to disk.
- Behavior: writes `data/statement_settings.json`.

---

### Ticker / Import List

#### `loadImportList()`
- Input: none
- Output: object with `tickers: string[]` and `last_updated: string` (ISO date).
- Behavior: reads `data/tickers.json` if it exists; otherwise returns `{ tickers: [] }`.

#### `saveImportList(importList)`
- Input: object with `tickers: string[]` (or a raw array of ticker strings).
- Output: `{ ok: boolean, importList: { tickers: string[], last_updated: string } }`
- Behavior: writes the deduplicated, normalized ticker list to `data/tickers.json`.

---

### Ticker Search

#### `searchTickerUniverse(query)`
- Input: `query` — string ticker or company name to search.
- Output: `{ ok: boolean, results: { ticker, companyName, exchange, quoteType }[] }`
- Behavior: fetches live suggestions from Yahoo Finance's v1/search endpoint.
- **Note:** Only `quoteType === 'EQUITY'` results are returned. ETFs, ETPs, options, mutual funds, and other non-equity instruments are filtered out.

---

### Company Profile

#### `loadCompanyProfile(ticker)`
- Input: `ticker` — string stock ticker symbol.
- Output: object with company metadata from `data/metadata/{TICKER}.json`, or an error object if not found.
- Behavior: reads the ticker's JSON metadata file via IPC.

---

### Data Fetching & Status

#### `fetchTickerData(ticker)`
- Input: `ticker` — string ticker symbol.
- Output: `{ ok: boolean, message: string }`
- Behavior: spawns the Python fetch script for the given ticker and returns the result.

#### `checkTickerDataStatus(ticker)`
- Input: `ticker` — string ticker symbol.
- Output: object describing what data exists for the ticker.
- Behavior: checks Parquet and JSON file existence for the given ticker.

#### `checkAllTickersDataStatus(tickers)`
- Input: `tickers` — array of ticker strings.
- Output: object mapping each ticker to its data status.
- Behavior: batches `checkTickerDataStatus` across all provided tickers.

---

### Statement Import

#### `importStatement(scope)`
- Input: `scope` — string, one of `balanceSheet`, `incomeStatement`, or `cashFlow`.
- Output: `{ ok: boolean, message: string }`
- Behavior: saves current settings, then spawns the corresponding Python import script.

---

### Ratio System

#### `loadRatios()`
- Input: none
- Output: object mapping ratio names to ratio definitions from `Importing/ratio_config.json`.
- Behavior: reads the ratio config file via IPC.

#### `saveRatios(ratios)`
- Input: object mapping ratio names to ratio definitions.
- Output: the same object after it is written to disk.
- Behavior: writes `Importing/ratio_config.json`.

#### `loadSheetRatios()`
- Input: none
- Output: array of ratio assignments currently on the Excel Ratios sheet.
- Behavior: reads sheet ratio data from the workbook.

#### `syncAssignedRatios(ratioNames)`
- Input: `ratioNames` — array of ratio name strings.
- Output: `{ ok: boolean, message: string }`
- Behavior: synchronises the ratio assignment list in the workbook.

#### `refreshRatiosSheet()`
- Input: none
- Output: `{ ok: boolean, message: string }`
- Behavior: spawns the Python ratio calculator to recompute all assigned ratios.

---

### Launcher Actions

#### `getLauncherStatus()`
- Input: none
- Output: object with status booleans for `workbook`, `venv`, `electron`, `setupScript`, `uninstallScript`, `projectRoot`, `dataDir`.
- Behavior: checks filesystem paths for each component.

#### `checkSystemHealth()`
- Input: none
- Output: object with detailed health check results.
- Behavior: verifies Python, Node.js, Electron, xlwings config, and data directory integrity.

#### `openWorkbook()`
- Input: none
- Output: `{ ok: boolean, message: string }`
- Behavior: opens `FinForge.xlsm` via `shell.openPath`.

#### `openProjectRoot()`
- Input: none
- Output: `{ ok: boolean, message: string }`
- Behavior: opens the project root folder in Explorer.

#### `openDataFolder()`
- Input: none
- Output: `{ ok: boolean, message: string }`
- Behavior: opens the `data/` folder in Explorer.

#### `runSetupScript()`
- Input: none
- Output: `{ ok: boolean, message: string }`
- Behavior: spawns `setup.bat` in a new terminal window.

#### `runUninstallScript()`
- Input: none
- Output: `{ ok: boolean, message: string }`
- Behavior: spawns `uninstall.bat` in a new terminal window.

#### `openImportWindow(options)`
- Input: `options` — optional object with window preferences.
- Output: `{ ok: boolean, message: string }`
- Behavior: opens or focuses the main workspace window with `FINFORGE_START_WINDOW=workspace`.

---

### Template System

#### `loadTemplates()`
- Input: none
- Output: array of template objects from `data/templates.json`.
- Behavior: reads the template catalog.

#### `saveTemplate(template)`
- Input: template object with `id`, `name`, `description`, and configuration.
- Output: the updated template catalog.
- Behavior: adds or updates a template in `data/templates.json`.

#### `deleteTemplate(templateId)`
- Input: `templateId` — string identifier.
- Output: the updated template catalog.
- Behavior: removes a template from `data/templates.json`.

#### `loadTemplate(templateId)`
- Input: `templateId` — string identifier.
- Output: the full template object.
- Behavior: reads a single template's configuration.

#### `replaceWorkbookWithTemplate(templateId)`
- Input: `templateId` — string identifier.
- Output: `{ ok: boolean, message: string }`
- Behavior: replaces the current workbook with the template's workbook file.

#### `saveExcelTemplate(templateId)`
- Input: `templateId` — string identifier.
- Output: `{ ok: boolean, message: string }`
- Behavior: copies the current workbook as a template Excel file.

#### `openTemplateExcelFile(excelFile)`
- Input: `excelFile` — string filename.
- Output: `{ ok: boolean, message: string }`
- Behavior: opens a template Excel file via `shell.openPath`.

#### `openTemplateFolder()`
- Input: none
- Output: `{ ok: boolean, message: string }`
- Behavior: opens the `data/templates_excel/` folder in Explorer.

#### `openExternalUrl(url)`
- Input: `url` — string URL.
- Output: `{ ok: boolean, message: string }`
- Behavior: opens a URL in the default browser via `shell.openExternal`.

---

### Research Paper Search

#### `searchResearchPapers(query, source)`
- Input:
  - `query` — string search query (e.g., "Equity Research AAPL").
  - `source` — string, either `"duckduckgo"` or `"google"`.
- Output: `{ ok: boolean, results: { title, url, snippet, source }[] }`
- Behavior: spawns the Python research module to search for papers. DuckDuckGo works out of the box; Google requires a local Whoogle server.

---

## Inputs and Outputs
- Inputs must be plain JSON-compatible values.
- Outputs are plain JavaScript objects and arrays.
- Secrets are not involved; all data is local file state.

## Environment Requirements
- Electron renderer must run with `contextIsolation: true` and `nodeIntegration: false`.
- Node APIs are only available inside preload, not directly in the renderer.
- The repo must have a writable `data/` directory.
- Python virtual environment must exist at `.venv/Scripts/python.exe`.

## Assumptions and Limits
- The bridge is intentionally file-backed to keep the renderer simple.
- The bridge does not validate business rules beyond JSON parsing and default fallback.
- The bridge does not touch Parquet or Excel data directly; it delegates to Python scripts.
- The Python importers consume the same `data/statement_settings.json` file, so the bridge must keep the schema stable.
- `shell.openPath` is used for local file actions and relies on OS file associations.
