@echo off
REM FinForge Launcher
REM This script activates the virtual environment and launches FinForge

REM Change to the directory where this batch file is located
cd /d "%~dp0"

REM Check if virtual environment exists
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
    start "" pythonw "%~dp0Internal\launch\stock_launcher.py"
) else (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first to install the application.
    echo.
    pause
)
