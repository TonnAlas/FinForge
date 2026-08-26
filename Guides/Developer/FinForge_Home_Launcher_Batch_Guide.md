# FinForge Home Launcher Batch Guide

## Overview

This guide documents the launcher chain used to open the Electron-based FinForge home window.

## Purpose

The batch files are now the entry point for both desktop launches and ribbon-driven launches.

- `launch_finforge.bat` handles diagnostics and optional xlwings configuration, then forwards to Electron.
- `Internal/launch/launch_finforge_terminal.bat` starts the Electron runtime.

## File

- [launch_finforge.bat](../../launch_finforge.bat)
- [launch_finforge_terminal.bat](../../Internal/launch/launch_finforge_terminal.bat)

## Behavior

When `launch_finforge.bat` is executed, it:

1. Changes to the project directory
2. Creates a temporary diagnostics log in `Temporary/`
3. Activates the virtual environment if it exists
4. Refreshes xlwings configuration when possible
5. Calls `Internal/launch/launch_finforge_launcher.bat`

When `launch_finforge_terminal.bat` is executed, it:

1. Resolves the project root
2. Writes launcher diagnostics
3. Checks for the Electron runtime in `ElectronHome/node_modules`
4. Starts the Electron app from `ElectronHome/`

## Inputs

- the current project directory
- the local Electron app folder
- the Electron executable installed in `ElectronHome/node_modules`

## Outputs

- a new Electron-based FinForge home window
- JavaScript launcher home page (terminal-style actions)
- a diagnostics log at `Temporary/launch_terminal_diagnostics.log`
- a warning message if Electron is not installed

## Environment Requirements

- Windows
- Node.js available for development
- Electron installed with `npm install` inside `ElectronHome`

## Assumptions and Limitations

- The batch file assumes it is located in the repository root.
- The launcher no longer opens the legacy Python stock picker.
- If Electron has not been installed yet, the home window will not start.

## Example Usage

Run either entry point:

```bat
launch_finforge.bat
```

or:

```bat
Internal/launch/launch_finforge_terminal.bat
```

From VBA, the ribbon callback now starts it through a hidden `WScript.Shell.Run` call so no console window stays open.
