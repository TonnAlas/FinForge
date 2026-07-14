# FinForge Electron Home Guide

## Overview

This guide documents the Electron-based FinForge home application. The goal is to keep Python as the backend while moving the product shell and launcher flow to a JavaScript desktop UI.

## Files

- [ElectronHome/package.json](../../ElectronHome/package.json)
- [ElectronHome/main.js](../../ElectronHome/main.js)
- [ElectronHome/preload.js](../../ElectronHome/preload.js)
- [ElectronHome/src/index.html](../../ElectronHome/src/index.html)
- [ElectronHome/src/styles.css](../../ElectronHome/src/styles.css)
- [ElectronHome/src/renderer.js](../../ElectronHome/src/renderer.js)
- [Guides/Developer/ElectronHome_Ratio_Maker_Guide.md](ElectronHome_Ratio_Maker_Guide.md)

## Main Components

### `main.js`

Creates the Electron `BrowserWindow` and loads the home screen.

Inputs:

- Electron app lifecycle events
- launcher command requests from the renderer through IPC

Outputs:

- a desktop window titled `FinForge Home`
- secure IPC responses for launcher actions (open workbook/folders, run setup, run uninstall)

### `preload.js`

Exposes a minimal `window.finforge` object for future controlled integration with Python or other local APIs.

The preload contract now includes launcher actions:

- `getLauncherStatus`
- `openWorkbook`
- `openProjectRoot`
- `openDataFolder`
- `runSetupScript`
- `runUninstallScript`

### `index.html`

Defines the structure of the home screen:

- left navigation sidebar
- Home launcher page (terminal-style quick actions + status terminal)
- Financial Statements page
- Ratios page

### `styles.css`

Provides the dark, gradient-based UI theme and responsive layout.

### `renderer.js`

Controls page switching between the sidebar sections.

The Ratios tab now renders a working ratio maker shell backed by `Importing/ratio_config.json`.

The Home tab now acts as the JavaScript launcher and intentionally does not include ticker/stock-picker controls.

### `package.json`

Defines the Electron runtime dependency and the `npm start` command.

## Inputs and Outputs

### Inputs

- `launch_finforge.bat` launches the Electron home batch file
- user clicks sidebar navigation buttons
- future backend events can be passed through the preload layer

### Outputs

- a modern desktop shell for FinForge
- a JavaScript launcher page with terminal-style command controls
- a dedicated Financial Statements section on the left sidebar
- a settings-first product home screen

## Environment Requirements

- Windows
- Node.js installed for development
- Electron installed via `npm install`
- Python backend kept separate from the UI shell

## Assumptions and Limitations

- Stock picker UI is intentionally excluded from the launcher and can be moved into terminal workflows later.
- Python remains the backend for import workflows.
- Launcher actions are local file/process actions only.
- When searching for tickers via the Import page search bar, **only equity instruments (`quoteType === 'EQUITY'`) are shown**. ETFs, ETPs, options, mutual funds, and other non-equity instruments are filtered out by the `searchTickerUniverse` handler in `main.js` because they require different import and analysis logic.

## Example Usage

From the ElectronHome folder:

```bash
npm install
npm start
```

## Next Extension Point

The next step is to connect the Electron UI to the Python backend through a localhost API or IPC bridge so statements, settings, and workbook actions can become live.
