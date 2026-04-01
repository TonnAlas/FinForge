# Uninstalling FinForge

This guide explains how to reverse FinForge setup actions using the uninstall scripts.

---

## Purpose

FinForge setup creates and configures environment components such as:

- Project virtual environment (`.venv`)
- xlwings Excel add-in (current Windows user)
- xlwings user configuration (`%USERPROFILE%\.xlwings\xlwings.conf`)
- Generated workbook (`FinForge.xlsm`) if created from template
- Setup temp files (`%SystemDrive%\fftmp`)

The uninstall flow lets you remove these items interactively.

---

## Files Involved

- `uninstall.bat`
- `Installation/unconfigure_xlwings.ps1`

---

## How It Works

### 1) `uninstall.bat`

Main interactive uninstall wizard.

#### Behavior

- Prompts for confirmation before uninstall starts
- Asks what to remove using Yes/No questions
- Executes cleanup in ordered steps
- Shows warnings for partial failures and continues where possible

#### Cleanup Steps

1. Remove xlwings add-in (`xlwings addin remove`) if selected
2. Run `Installation/unconfigure_xlwings.ps1` if selected
3. Remove `.venv` folder if selected
4. Delete `FinForge.xlsm` if selected
5. Delete `Temporary/launch_diagnostics.log` if selected
6. Delete `%SystemDrive%\fftmp` if selected

#### Internal Routines

- `:prompt_yes_no`
  - Input:
    - Question text (string)
    - Default answer (`Y` or `N`)
    - Output variable name
  - Output:
    - Sets target variable to `Y` or `N`

- `:remove_xlwings_addin`
  - Input: none
  - Output:
    - Attempts add-in removal if xlwings command is available
    - Returns success even when skipped

### 2) `Installation/unconfigure_xlwings.ps1`

Safe xlwings config remover.

#### Behavior

- Reads `%USERPROFILE%\.xlwings\xlwings.conf`
- Parses `INTERPRETER_WIN` and `PYTHONPATH`
- Removes config only if it points to the current project directory
- Leaves unrelated xlwings configuration untouched
- Removes `%USERPROFILE%\.xlwings` only when empty

#### Parameters

- `-ProjectDir` (string, optional)
  - Project root path
  - If omitted, script derives it from its own location

#### Output

- Exit code `0` for success/skip
- Exit code `1` only for unexpected script errors

---

## Usage

### Recommended (Explorer)

1. Open the project folder
2. Double-click `uninstall.bat`
3. Answer each prompt

### Command Line

```powershell
cd C:\FinForge
./uninstall.bat
```

---

## What Is Not Removed

Uninstall intentionally does not delete:

- Source code files
- Guides and documentation
- Project structure
- Downloaded Python installation itself

This keeps the repository reusable after uninstall.

---

## Assumptions and Limitations

- Windows-only flow (batch and PowerShell scripts)
- xlwings add-in removal is user-scoped
- Workbook deletion is optional because it may contain user edits
- If files are locked (for example by Excel), deletion can fail with a warning

---

## Reinstall

To install again after uninstall:

1. Run `setup.bat`
2. Launch with `launch_finforge.bat`
