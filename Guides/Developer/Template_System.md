# Template System - Developer Guide

## Overview

The FinForge template system allows users to save, load, and manage workspace configurations including statement settings, ratio definitions, ticker lists, and linked Excel workbook templates. The system follows a full CRUD (Create, Read, Update, Delete) pattern for both metadata and Excel files.

## Architecture

The template system spans three layers:

```
Renderer (renderer.js / launcher_renderer.js)
    |
    | IPC (contextBridge via preload.js)
    v
Main Process (main.js)
    |
    v
File System (data/templates.json, data/templates_excel/)
```

### Data Files

| File | Purpose |
|------|---------|
| `data/templates.json` | Template metadata (name, notes, settings, ratios, tickers, excelTemplate ref) |
| `data/templates_excel/` | Directory containing saved `.xlsm` copies of the workbook |

## Data Model

### Template Object

```json
{
  "id": "unique-template-id",
  "name": "My Template",
  "notes": "Optional description",
  "isDefault": false,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-15T12:30:00.000Z",
  "settings": {
    "mode": "balanceSheet",
    "display": { "mode": "millions", "divisor": 1000000 },
    "balanceSheet": { "selected": ["Total Assets", ...] },
    "incomeStatement": { "selected": ["Total Revenue", ...] },
    "cashFlow": { "selected": ["Operating Cash Flow", ...] }
  },
  "ratios": {
    "Current Ratio": {
      "formula": "BS: Current Assets / BS: Current Liabilities",
      "notes": "Measures short-term liquidity"
    }
  },
  "tickers": ["AAPL", "MSFT", "GOOG"],
  "excelTemplate": null
}
```

### Default Template

The default template (`id: "default"`) is always present in `templates.json` and is read-only. It cannot be deleted or overwritten. Its `excelTemplate` field starts as `null` because no Excel file is pre-shipped with the application.

## IPC API Reference

### Preload Exposed Methods (via `window.finforge`)

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `loadTemplates()` | none | `{ ok, templates[] }` | Load all templates from disk |
| `saveTemplate(template)` | template object | `{ ok, templates[] }` | Create or update a template |
| `deleteTemplate(templateId)` | string id | `{ ok, templates[] }` | Delete template + its Excel file |
| `loadTemplate(templateId)` | string id | `{ ok, template, excelOpened }` | Apply template settings to workspace |
| `saveExcelTemplate(templateId)` | string id | `{ ok, templates[], excelFile }` | Copy FinForge.xlsm to templates_excel/{id}.xlsm |
| `deleteExcelTemplate(templateId)` | string id | `{ ok, templates[], template }` | Remove Excel file from template (keeps metadata) |
| `replaceWorkbookWithTemplate(templateId)` | string id | `{ ok, template }` | Replace FinForge.xlsm with template's Excel copy |
| `openTemplateExcelFile(excelFile)` | string filename | `{ ok }` | Open a template Excel file in Excel |
| `openTemplateFolder()` | none | `{ ok }` | Open the templates_excel directory |

## Main Process Handlers

### `finforge:loadTemplates`
Reads `data/templates.json`. If the default template is missing, it prepends it to the file.

### `finforge:saveTemplate`
- Creates a new template or updates an existing one.
- Rejects saves with `id === 'default'`.
- Automatically sets `updatedAt` timestamp.
- If new, sets `createdAt` timestamp.

### `finforge:deleteTemplate`
- Removes the template from the JSON array.
- Deletes the associated `{templateId}.xlsm` from `templates_excel/` if it exists.
- Cannot delete the default template.

### `finforge:saveExcelTemplate`
- Copies `FinForge.xlsm` to `data/templates_excel/{templateId}.xlsm`.
- Updates the template's `excelTemplate` field to `{templateId}.xlsm`.
- Returns the new filename.

### `finforge:deleteExcelTemplate`
- Deletes `data/templates_excel/{templateId}.xlsm` if it exists.
- Sets the template's `excelTemplate` field to `null`.
- Preserves all template metadata.

### `finforge:replaceWorkbookWithTemplate`
- Reads the template's `excelTemplate` filename.
- Copies that file over `FinForge.xlsm` (replacing the main workbook).
- Also overwrites `statement_settings.json`, `ratio_config.json`, and `tickers.json` with the template's stored values.
- The user must reopen the workbook in Excel for changes to take effect.

## UI Components

### Workspace Templates Page (`/templates`)

Located in `src/index.html` (section `data-page="templates"`) and `src/renderer.js`.

**Layout:**
- Left panel: Template list with New/Delete/Open folder buttons
- Right panel: Template editor with:
  - Name and notes fields
  - "Capture current settings" button (snapshots current workspace state)
  - Template contents summary (statement lines, ratios, tickers, Excel file)
  - Excel template section with:
    - "Save current workbook as template" - copies FinForge.xlsm
    - "Open Excel template" - opens the linked Excel file
    - ~~"Replace FinForge.xlsm with this template"~~ - overwrites main workbook
    - "Remove Excel template file" - deletes Excel file, keeps metadata
  - Action buttons: Load template, Cancel, Save, Delete

**State management:**
- `templateState` object tracks: `templates[]`, `selectedTemplateId`, `editorMode`, `capturedSettings`, `capturedRatios`, `capturedTickers`, `excelTemplateFile`
- `selectTemplate(templateId)` populates the editor with template data
- `resetTemplateEditor()` clears the editor for creating a new template

### Launcher Template Section

Located in `src/launcher.html` and `src/launcher_renderer.js`.

**Layout:**
- Template dropdown selector
- "Load" button (applies template settings and opens workbook)
- "Replace workbook with template" button (overwrites FinForge.xlsm)
- Template info display (notes, ticker count, line count, ratio count)

## CRUD Operations Summary

| Operation | Metadata | Excel File | UI Location |
|-----------|----------|------------|-------------|
| **Create** | New template | Save Excel button | Editor (New template) |
| **Read** | List/view templates | Excel status display | Template list + Editor |
| **Update** | Edit name/notes/capture | Re-save Excel | Editor (Save button) |
| **Delete** | Delete template | Delete Excel + template | List (Del button) or Editor Delete |
| **Delete Excel only** | Keeps template | Remove Excel button | Editor (Remove button) |
| **Replace workbook** | N/A | Copy over FinForge.xlsm | Editor / Launcher |

## File Locations

- `ElectronHome/main.js` - IPC handlers for all template operations
- `ElectronHome/preload.js` - IPC bridge exposing template APIs
- `ElectronHome/src/renderer.js` - Workspace template UI (lines ~3767-4165+)
- `ElectronHome/src/launcher_renderer.js` - Launcher template UI
- `ElectronHome/src/index.html` - Workspace template HTML (section ~541-610)
- `ElectronHome/src/launcher.html` - Launcher template HTML
- `data/templates.json` - Template metadata storage
- `data/templates_excel/` - Saved Excel template files
