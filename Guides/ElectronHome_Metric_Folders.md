# ElectronHome - Metric Folders Feature Guide

## Overview

The Metrics tab in the ElectronHome terminal now supports organizing metrics under
named folders. Users can create, rename, and delete folders, assign metrics to
folders (from the metric editor), and view the folder structure in the "Folders"
sub-tab of the Metrics page.

This guide documents how the feature works, the data model, the UI entry points,
and the persistence layer.

## Files Touched

- `ElectronHome/src/index.html` - UI structure: Folders sub-tab container, folder
  picker in the metric editor, the folder name modal.
- `ElectronHome/src/renderer.js` - All folder logic (state, rendering, create /
  rename / delete, folder picker, persistence calls).
- `ElectronHome/main.js` - New IPC handlers `finforge:loadFolders` and
  `finforge:saveFolders` backed by `data/folders.json`.
- `ElectronHome/preload.js` - Exposes `loadFolders()` and `saveFolders(folders)`
  to the renderer.

## Data Model

A folder is a plain string name. There are two sources of folder membership:

1. **Persisted folder list** - `state.folders` (array of names) stored in
   `data/folders.json`. This is the authoritative list of folders the user has
   created, and it persists even when a folder has no metrics assigned to it.
2. **Derived folders** - folders referenced by the `folder` field on any metric
   (ratio) object. Metrics live in `state.ratios` as
   `{ name: { formula, notes, row, folder } }`.

`getAllFolders()` returns the union of both sources, sorted alphabetically. This
ensures a folder created in the Folders tab still appears even if empty, and a
folder referenced by a metric always appears even if it was never explicitly
created.

## Persistence

- `data/folders.json` holds the array of folder names.
- `main.js`:
  - `ipcMain.handle('finforge:loadFolders', ...)` reads the file (fallback `[]`).
  - `ipcMain.handle('finforge:saveFolders', ...)` writes the file and returns
    `{ ok: true, folders }` or `{ ok: false, error }`.
- `preload.js` exposes `loadFolders()` and `saveFolders(folders)` via the
  `window.finforge` bridge.
- `renderer.js`:
  - `loadFoldersFromDisk()` populates `state.folders` on startup.
  - `saveFoldersToDisk()` persists `state.folders`.
  - Metric assignments are persisted separately through the existing
    `saveRatiosToDisk()` mechanism (the `folder` field is part of each ratio).

## UI Entry Points

### 1. "New folder" action button

- Located in the Actions panel, visible only when the "Folders" sub-tab is active
  (toggled in `setRatioMiddleView`).
- Clicking it calls `createNewFolder()`, which opens the folder name modal in
  "create" mode.

### 2. Folder name modal

- A modal overlay (`#folder-modal`) used for both creating and renaming folders.
- Elements: `#folder-modal-title`, `#folder-modal-input`,
  `#folder-modal-error`, `#folder-modal-save`, `#folder-modal-cancel`,
  `#folder-modal-close`.
- Functions:
  - `openFolderModal()` - shows the modal, sets the title/input for the current
    mode, focuses and selects the input.
  - `closeFolderModal()` - hides the modal and clears the input.
  - `submitFolderModal()` - validates the name (required, no duplicates),
    creates or renames the folder, saves to disk, re-renders the folder list.
- Enter submits, Escape closes.

### 3. Folder view (Folders sub-tab)

- Rendered by `renderFolders()` into `#ratio-folder-list`.
- Each folder is a collapsible group:
  - Header shows chevron, folder icon, folder name, metric count, and actions
    (Rename icon, Delete).
  - Body is hidden by default; clicking the header toggles it open to reveal the
    metrics assigned to that folder.
- An "Unassigned" group lists metrics with no folder.
- Functions:
  - `getAllFolders()` - union of persisted and derived folders.
  - `getMetricsInFolder(name)` - metrics assigned to a folder.
  - `getUnassignedMetrics()` - metrics with no folder.
  - `renderFolderMetricRow(name, folder)` - a metric row with "Edit folder" and
    "Remove" buttons.

### 4. Rename folder

- Each folder row has an edit icon (`data-folder-rename`). Clicking it opens the
  modal in "rename" mode with the current name pre-filled.
- `renameFolder(oldName, newName)` updates both `state.folders` and the `folder`
  field on every assigned metric, then saves both stores.

### 5. Delete folder

- Each folder row has a Delete button. `deleteFolder(name)` confirms, unassigns
  all metrics in the folder, removes the name from `state.folders`, and saves
  both stores.

### 6. Assign a folder while creating/editing a metric

- The metric editor (left panel) has a "Folder" field with a "Choose folder..."
  trigger button (`#ratio-folder-trigger`).
- Clicking the trigger toggles the folder picker (`#ratio-folder-picker`) in the
  right "Available options" panel.
- Selecting a folder assigns it to the metric (`state.ratios[name].folder`), or
  stores it as `state._pendingFolderSelection` for a brand-new metric. Selecting
  a folder also registers it in `state.folders` so it persists.
- `renderRatioFolderPicker()` re-renders the picker and syncs the left trigger
  button text/icon.

## Folder icon on metric cards

- In the Metrics list (`renderRatios()`), each metric card shows a folder icon +
  folder name between the metric name and the Row field when the metric has a
  folder assigned.

## Functions Reference (renderer.js)

| Function | Inputs | Output | Description |
| --- | --- | --- | --- |
| `loadFoldersFromDisk()` | - | - | Loads `state.folders` from `data/folders.json` |
| `saveFoldersToDisk()` | - | `true` / `false` | Persists `state.folders` |
| `getAllFolders()` | - | `string[]` | Union of persisted + derived folders, sorted |
| `getMetricsInFolder(folderName)` | `folderName: string` | `string[]` | Metric names in a folder |
| `getUnassignedMetrics()` | - | `string[]` | Metrics with no folder |
| `setMetricFolder(metricName, folderName)` | `metricName`, `folderName` | - | Assigns metric to folder, registers folder, saves |
| `removeMetricFromFolder(metricName)` | `metricName` | - | Clears metric's folder |
| `createNewFolder()` | - | - | Opens modal in create mode |
| `openFolderModal()` | - | - | Shows modal |
| `closeFolderModal()` | - | - | Hides modal |
| `submitFolderModal()` | - | - | Validates + creates/renames folder |
| `renameFolder(oldName, newName)` | `oldName`, `newName` | - | Renames folder + all assignments |
| `deleteFolder(folderName)` | `folderName` | - | Deletes folder, unassigns metrics |
| `renderFolders()` | - | - | Renders folder view |
| `renderRatioFolderPicker()` | - | - | Renders folder picker in editor |

## Assumptions and Limitations

- Folder names must be unique (case-sensitive comparison).
- Renaming/deleting a folder affects every metric assigned to it.
- Empty folders persist in `data/folders.json`; folders derived only from
  metrics disappear once all assigned metrics are removed or reassigned.
- The browser preview (opening `index.html` directly) lacks the Electron bridge,
  so persistence calls no-op but the UI still works for a session.

## Example Usage

1. Go to Metrics -> Folders.
2. Click "New folder", type "Liquidity", press Enter.
3. Click the edit icon on "Liquidity", rename it to "Liquidity Ratios", Save.
4. Click "Create metric", fill in the fields, click "Choose folder...", select
   "Liquidity Ratios" from the right panel, save the metric.
5. Back in the Folders tab, "Liquidity Ratios" now shows 1 metric; click the
   header to expand and see the metric with "Edit folder" / "Remove" actions.
