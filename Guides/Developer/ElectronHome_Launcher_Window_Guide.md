# ElectronHome Launcher Window Guide

## Overview

This guide documents the dedicated FinForge launcher window implemented as a separate Electron screen from the main import workspace.

## Files

- [ElectronHome/main.js](../../ElectronHome/main.js)
- [ElectronHome/preload.js](../../ElectronHome/preload.js)
- [ElectronHome/src/launcher.html](../../ElectronHome/src/launcher.html)
- [ElectronHome/src/launcher_renderer.js](../../ElectronHome/src/launcher_renderer.js)
- [ElectronHome/src/index.html](../../ElectronHome/src/index.html)
- [ElectronHome/src/renderer.js](../../ElectronHome/src/renderer.js)

## Purpose

The launcher window is a compact entry screen that provides quick actions without embedding launcher controls inside the main statement-import workspace.

## Main Components

### `main.js`

Responsibilities:

- Creates and manages two windows:
  - launcher window (`launcher.html`)
  - main workspace window (`index.html`)
- Opens launcher window on application startup.
- Handles launcher IPC actions for local file/process commands.
- Exposes `finforge:openImportWindow` to open/focus the main workspace window from launcher actions.

Inputs:

- Electron lifecycle events
- IPC requests from preload/renderer

Outputs:

- separate launcher and main workspace windows

### `preload.js`

Responsibilities:

- Exposes controlled `window.finforge` APIs in renderer contexts.
- Adds `openImportWindow(options)` for launcher to open the main workspace window.

### `launcher.html`

Responsibilities:

- Defines the separate compact launcher UI:
  - quick action buttons
  - launcher status cards
  - action status line

### `launcher_renderer.js`

Responsibilities:

- Binds launcher button events.
- Calls preload IPC bridge methods.
- Renders launcher health/status from `getLauncherStatus`.
- Opens the separate main workspace window using `openImportWindow`.

### `index.html` and `renderer.js`

Responsibilities:

- Keep the main import/ratio workspace independent from launcher UI.
- Start on the Home tab when the main workspace opens.

## Inputs and Outputs

### Inputs

- Launcher button clicks
- Filesystem status from IPC (`workbook`, `venv`, scripts, project/data paths)

### Outputs

- Open workbook
- Open data/project folders
- Run setup/uninstall scripts
- Open main workspace in separate window

## Environment Requirements

- Windows
- Electron runtime installed in `ElectronHome/node_modules`
- `contextIsolation: true` with preload bridge enabled

## Assumptions and Limitations

- `shell.openPath` is used for local actions and relies on OS file associations.
- Launcher and workspace windows run independently; both can remain open at the same time.
- Launcher status checks validate path existence only.

## Example Usage

1. Start Electron app from `ElectronHome`:

```bash
npm start
```

2. Use launcher window actions.
3. Click **Open statement import window** to open the main workspace in a separate window.
