# FinForge Home Window Guide (Legacy)

## Overview

This document describes the legacy PySide6 home window that was used as an interim launcher. It has been superseded by the Electron-based home application (see [FinForge_Electron_Home_Guide.md](FinForge_Electron_Home_Guide.md)). This guide is kept for reference only.

## Purpose

The new window is the main application shell for FinForge. Excel remains a supporting extension layer, while this window becomes the primary home for:

- general settings
- future advanced settings
- statement-focused navigation
- application-level controls and sections

## File

- [Internal/launch/finforge_home.py](../../Internal/launch/finforge_home.py)

## Main Components

### `NavButton`

Sidebar navigation button used for the left panel.

Inputs:

- `text: str` - button label shown in the sidebar

Outputs:

- A checkable sidebar button styled for navigation

### `InfoCard`

Reusable content card used in the home page sections.

Inputs:

- `title: str` - card title
- `body: str` - descriptive text
- `accent: str` - accent color value in hex format

Outputs:

- A framed UI card containing a title and supporting text

### `FinForgeHomeWindow`

Main application window.

Responsibilities:

- build the left navigation sidebar
- show the home page
- show the Financial Statements page
- show the Advanced Settings page
- apply the dark, gradient-based visual theme

### `main()`

Starts the Qt application and displays the home window.

### `launch_home_window()`

Compatibility wrapper that returns the same window entry point for external launchers.

## Sidebar Sections

The left-side navigation currently contains:

- Home
- Financial Statements
- Advanced Settings

The Financial Statements page is the main requested section and is where future statement controls should be developed.

## Inputs and Outputs

### Inputs

- user clicks on the ribbon button
- the launcher batch file starts the Python window
- Qt runs the desktop UI event loop

### Outputs

- a new desktop window titled `FinForge Home`
- navigation between app sections
- placeholder cards for future settings and controls

## Environment Requirements

- Windows
- Python environment with PySide6 installed
- `launch_finforge.bat` configured to start this module

## Assumptions and Limitations

- This is a UI shell, not the final feature implementation.
- The Financial Statements page currently contains placeholder cards and layout structure only.
- The window is intentionally independent from the old stock launcher workflow.

## Example Usage

To launch the window directly:

```python
from Internal.launch.finforge_home import main

main()
```

To keep backward compatibility from older entry points:

```python
from Internal.launch.finforge_home import launch_home_window

launch_home_window()
```