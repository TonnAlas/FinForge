@echo off
REM ========================================
REM FinForge - First Time Setup
REM ========================================
REM This script will set up everything you need to run FinForge
REM Run this once after downloading the project

echo ========================================
echo    FinForge - Setup Wizard
echo ========================================
echo.

REM Change to the directory where this batch file is located
cd /d "%~dp0"

REM Check if Python is installed
echo [1/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Python is not installed or not in PATH!
    echo.
    echo Please install Python 3.10 or later from:
    echo https://www.python.org/downloads/
    echo.
    echo IMPORTANT: During installation, check the box that says:
    echo "Add Python to PATH"
    echo.
    pause
    exit /b 1
)
echo Python found!
echo.

REM Check Python version
for /f "tokens=2 delims= " %%a in ('python --version 2^>^&1') do set PYTHON_VERSION=%%a
echo Python version: %PYTHON_VERSION%
echo.

REM Create virtual environment if it doesn't exist
echo [2/5] Setting up virtual environment...
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo Virtual environment created!
) else (
    echo Virtual environment already exists.
)
echo.

REM Activate virtual environment
echo [3/5] Activating virtual environment...
call .venv\Scripts\activate.bat
echo Virtual environment activated!
echo.

REM Upgrade pip
echo [4/5] Upgrading pip...
python -m pip install --upgrade pip --quiet
echo Pip upgraded!
echo.

REM Install requirements
echo [5/5] Installing required packages...
echo This may take a few minutes...
echo.
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install some packages!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)
echo.
echo All packages installed successfully!
echo.

REM Install xlwings add-in for Excel
echo ----------------------------------------
echo Installing xlwings Excel Add-in...
echo ----------------------------------------
xlwings addin install
echo.

REM Configure xlwings to use the virtual environment Python
echo ----------------------------------------
echo Configuring xlwings...
echo ----------------------------------------
REM Create xlwings config directory if it doesn't exist
if not exist "%USERPROFILE%\.xlwings" mkdir "%USERPROFILE%\.xlwings"

REM Create xlwings.conf with the correct Python interpreter path
echo "INTERPRETER_WIN","%~dp0.venv\Scripts\python.exe" > "%USERPROFILE%\.xlwings\xlwings.conf"
echo "PYTHONPATH","%~dp0" >> "%USERPROFILE%\.xlwings\xlwings.conf"
echo xlwings configured to use project's Python environment!
echo.

REM Setup complete
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo IMPORTANT: Before using the Excel macros, please:
echo   1. Open Excel
echo   2. Go to File - Options - Trust Center - Trust Center Settings
echo   3. Click "Macro Settings" and enable macros
echo   4. Check "Trust access to the VBA project object model"
echo   5. Click OK and restart Excel
echo.
echo You can now run the application by:
echo   1. Double-click "launch_finforge.bat"
echo   2. Or open FinForge.xlsm in Excel
echo.
echo For help, see the Guides folder.
echo.
pause
