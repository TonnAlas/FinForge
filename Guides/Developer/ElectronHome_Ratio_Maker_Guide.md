# ElectronHome Ratio Maker Guide

## Overview

This guide documents the Ratio Maker workspace inside the ElectronHome desktop shell. The Ratios tab now loads, displays, filters, edits, creates, and deletes ratios from the shared ratio store at `Importing/ratio_config.json`.

## Files

- [ElectronHome/main.js](../../ElectronHome/main.js)
- [ElectronHome/preload.js](../../ElectronHome/preload.js)
- [ElectronHome/src/index.html](../../ElectronHome/src/index.html)
- [ElectronHome/src/renderer.js](../../ElectronHome/src/renderer.js)

## Main Components

### `main.js`

Adds IPC handlers for ratio persistence.

Inputs:

- `finforge:loadRatios`
- `finforge:saveRatios`

Outputs:

- ratio objects read from or written to `Importing/ratio_config.json`

### `preload.js`

Exposes ratio methods on `window.finforge` so the renderer can read and write the ratio store.

### `index.html`

Defines the Ratio Maker tab layout:

- ratio creation form
- formula token buttons
- preview card at the bottom of the builder column
- pinned right-side selection drawer for statement lines and data modes
- token-driven data mode chooser panel for prefix tokens
- searchable field picker for P, IS, BS, and RATIO inserts
- created ratios container
- ratio search and reload controls

### `renderer.js`

Controls all ratio tab behavior:

- loads ratio data from disk
- normalizes ratio records
- renders ratio cards
- filters the list
- opens a data mode chooser when a prefix token is pressed
- keeps the statement line and data mode panels open after selection
- highlights the active line or mode in green until the same option is clicked again
- opens a searchable picker when a data prefix is chosen
- inserts the selected field with the chosen data mode
- saves, reloads, resets, and deletes ratios
- switches cleanly between create and edit mode

## Inputs and Outputs

### Inputs

- ratio name text
- ratio formula text
- ratio notes text
- token button clicks
- data mode selections
- repeated line and mode clicks used to deselect the current selection
- reload and delete actions

### Outputs

- live ratio preview text
- filtered ratio cards in the right-side container
- updates to `Importing/ratio_config.json`
- formula tokens annotated with the chosen mode in the editor flow

## Environment Requirements

- Windows
- Electron runtime installed in `ElectronHome`
- access to the workspace root so the app can read `Importing/ratio_config.json`

## Assumptions and Limitations

- The ratio store remains a flat object keyed by ratio name.
- The renderer currently manages ratio CRUD locally through the Electron bridge.
- The preview is a lightweight text preview, not a syntax-highlighting editor.
- The picker currently uses the embedded statement catalog for balance sheet and income statement fields, and the shared ratio store for RATIO items.
- The new data mode chooser is UI-driven and currently stores the selected mode inline in the formula text flow.
- The right-side statement line and data mode drawer remains open after selection so the current formula item can be edited without reopening the panel.
- Clicking the same line or mode again clears that selection and removes the current inserted token from the formula.

## Example Usage

1. Open the ElectronHome app.
2. Click the Ratios tab.
3. Enter a ratio name, formula, and optional notes.
4. Use the token buttons to insert common prefixes and operators.
5. Click Save ratio.

## Related Design Sources

The layout follows the existing FinForge ElectronHome terminal styling and the ratio workflow described in:

- [Guides/User/04_Creating_Ratios.md](../User/04_Creating_Ratios.md)
- [Guides/User/06_Advanced_Ratio_Features.md](../User/06_Advanced_Ratio_Features.md)
