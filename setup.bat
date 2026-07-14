@echo off
setlocal EnableExtensions EnableDelayedExpansion
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

REM Fail fast if project path is too long (common cause of pip install failures on Windows)
set "PROJECT_PATH=%CD%"
call :strlen PROJECT_PATH PROJECT_PATH_LEN
set "MAX_SAFE_PROJECT_PATH_LEN=70"
if %PROJECT_PATH_LEN% GTR %MAX_SAFE_PROJECT_PATH_LEN% (
    echo ERROR: Project path is too long: %PROJECT_PATH%
    echo Current path length: %PROJECT_PATH_LEN% characters
    echo Recommended maximum: %MAX_SAFE_PROJECT_PATH_LEN% characters
    echo.
    echo Please move FinForge to a shorter path and run setup again.
    echo Example: C:\FinForge
    echo.
    pause
    exit /b 1
)

REM ============================================
REM STEP 1: Check Python Installation
REM ============================================
echo [1/9] Checking Python installation...
set "PYTHON_CMD="
python --version >nul 2>&1
if not errorlevel 1 set "PYTHON_CMD=python"

if not defined PYTHON_CMD (
    py -3 --version >nul 2>&1
    if not errorlevel 1 set "PYTHON_CMD=py -3"
)

if not defined PYTHON_CMD (
    echo.
    echo ERROR: Python is not installed or not in PATH!
    echo.
    echo Please install Python 3.10 or later from:
    echo https://www.python.org/downloads/
    echo.
    echo IMPORTANT: During installation, check the box that says:
    echo Add Python to PATH
    echo.
    echo Then close this window and run setup.bat again.
    echo.
    pause
    exit /b 1
)
echo Python command: %PYTHON_CMD%
echo Python found!
echo.

REM Check Python version
for /f "tokens=2 delims= " %%a in ('%PYTHON_CMD% --version 2^>^&1') do set PYTHON_VERSION=%%a
echo Python version: %PYTHON_VERSION%
echo.

REM ============================================
REM STEP 2: Check Node.js Installation (for Electron launcher UI)
REM ============================================
echo [2/9] Checking Node.js installation...
set "NODE_FOUND=0"
set "NPM_FOUND=0"

node --version >nul 2>&1
if not errorlevel 1 (
    set "NODE_FOUND=1"
    for /f "delims=" %%a in ('node --version 2^>^&1') do set "NODE_VERSION=%%a"
    echo Node.js found: !NODE_VERSION!
) else (
    echo Node.js not found.
)

npm --version >nul 2>&1
if not errorlevel 1 (
    set "NPM_FOUND=1"
    for /f "delims=" %%a in ('npm --version 2^>^&1') do set "NPM_VERSION=%%a"
    echo npm found: !NPM_VERSION!
) else (
    echo npm not found.
)

if "!NODE_FOUND!"=="0" (
    echo.
    echo WARNING: Node.js is not installed!
    echo.
    echo Node.js is required for the FinForge Launcher (Electron UI).
    echo Without it, you can still use FinForge.xlsm in Excel directly.
    echo.
    echo To install Node.js:
    echo   1. Download from: https://nodejs.org/
    echo   2. Choose the LTS version (recommended)
    echo   3. Run the installer - npm is included automatically
    echo   4. After installation, run setup.bat again
    echo.
    echo Continuing without Node.js - Electron UI will not be available...
    echo.
)

REM Check Windows long path support (helpful for large packages like PySide6)
for /f "tokens=3" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v LongPathsEnabled 2^>nul ^| find "LongPathsEnabled"') do set LONG_PATHS=%%a
if /i not "%LONG_PATHS%"=="0x1" (
    echo WARNING: Windows Long Path support appears to be disabled.
    echo Some packages may fail to install on deep folder paths.
    echo Recommended: Extract FinForge to a short path like C:\FinForge
    echo.
)

REM ============================================
REM STEP 3: Set up Python Virtual Environment
REM ============================================
echo [3/9] Setting up virtual environment...
if not exist "%~dp0.venv" (
    echo Creating virtual environment...
    %PYTHON_CMD% -m venv "%~dp0.venv"
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

REM ============================================
REM STEP 4: Activate venv & upgrade pip
REM ============================================
echo [4/9] Activating virtual environment and upgrading pip...
call "%~dp0.venv\Scripts\activate.bat"
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment!
    pause
    exit /b 1
)
set "VENV_PYTHON=%~dp0.venv\Scripts\python.exe"
if not exist "%VENV_PYTHON%" (
    echo ERROR: Virtual environment Python was not found at %VENV_PYTHON%
    pause
    exit /b 1
)
echo Virtual environment activated!

"%VENV_PYTHON%" -m pip install --upgrade pip --quiet
echo Pip upgraded!
echo.

REM ============================================
REM STEP 5: Install Python Packages
REM ============================================
echo [5/9] Installing required Python packages...
echo This may take a few minutes (especially PySide6)...
echo.

REM Use a short temp directory to reduce path-length issues during wheel extraction
set "ORIGINAL_TEMP=%TEMP%"
set "ORIGINAL_TMP=%TMP%"
set "SHORT_TEMP=%SystemDrive%\fftmp"
if not exist "%SHORT_TEMP%" mkdir "%SHORT_TEMP%"
set "TEMP=%SHORT_TEMP%"
set "TMP=%SHORT_TEMP%"

"%VENV_PYTHON%" -m pip install -r "%~dp0requirements.txt"
set "TEMP=%ORIGINAL_TEMP%"
set "TMP=%ORIGINAL_TMP%"

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install some packages!
    echo If you see a path length error, enable Windows Long Paths or move the project to a shorter path (example: C:\FinForge).
    pause
    exit /b 1
)
echo.
echo All Python packages installed successfully!
echo.

REM ============================================
REM STEP 6: Install Node.js Packages (Electron UI)
REM ============================================
if "!NODE_FOUND!"=="1" if "!NPM_FOUND!"=="1" (
    echo [6/9] Installing Node.js packages for FinForge Launcher...
    pushd "%~dp0ElectronHome"
    call npm install
    set "NPM_EXIT=!errorlevel!"
    popd
    if !NPM_EXIT! equ 0 (
        echo Electron and dependencies installed successfully!
    ) else (
        echo.
        echo WARNING: npm install failed in ElectronHome.
        echo The FinForge Launcher (Electron UI) may not work.
        echo You can still use FinForge.xlsm in Excel directly.
        echo To fix this later, run: cd ElectronHome ^&^& npm install
        echo.
    )
) else (
    echo [6/9] Skipping Node.js packages - Node.js not available.
    echo The Electron Launcher UI will not be available.
    echo You can still use FinForge.xlsm in Excel directly.
)
echo.

REM ============================================
REM STEP 7: Initialize Data Directories & Default Files
REM ============================================
echo [7/9] Initializing data directories and default files...

REM Ensure all data subdirectories exist
set "DATA_DIR=%~dp0data"
set "FUND_DIR=%DATA_DIR%\fundamentals"
set "HOLDERS_DIR=%DATA_DIR%\holders"

if not exist "%DATA_DIR%" mkdir "%DATA_DIR%"
if not exist "%FUND_DIR%" mkdir "%FUND_DIR%"
if not exist "%HOLDERS_DIR%" mkdir "%HOLDERS_DIR%"

REM Fundamentals subdirectories
for %%d in (
    actions analyst_price_targets balance_sheet balance_sheet_long
    calendar cash_flow dividends earnings_estimate earnings_history
    eps_trend growth_estimates income_statement income_statement_long
    insider_purchases insider_transactions news quarterly_balance_sheet
    quarterly_cash_flow quarterly_income_statement recommendations
    recommendations_summary revenue_estimate sec_filings splits
    upgrades_downgrades
) do (
    if not exist "%FUND_DIR%\%%d" mkdir "%FUND_DIR%\%%d"
)

REM Holders subdirectories
for %%d in (
    insider_roster_holders institutional_holders major_holders mutualfund_holders
) do (
    if not exist "%HOLDERS_DIR%\%%d" mkdir "%HOLDERS_DIR%\%%d"
)

REM Other data directories
if not exist "%DATA_DIR%\metadata" mkdir "%DATA_DIR%\metadata"
if not exist "%DATA_DIR%\prices" mkdir "%DATA_DIR%\prices"
if not exist "%DATA_DIR%\templates_excel" mkdir "%DATA_DIR%\templates_excel"

REM Ensure Temporary directory exists
if not exist "%~dp0Temporary" mkdir "%~dp0Temporary"

REM Initialize tickers.json with default tickers if missing
set "TICKERS_FILE=%DATA_DIR%\tickers.json"
if not exist "%TICKERS_FILE%" (
    echo Creating default tickers.json...
    (
        echo {
        echo   "tickers": ["AAPL", "MSFT", "GOOG"],
        echo   "last_updated": ""
        echo }
    ) > "%TICKERS_FILE%"
    echo Default tickers.json created.
) else (
    echo tickers.json already exists.
)

REM Initialize statement_settings.json if missing
set "SETTINGS_FILE=%DATA_DIR%\statement_settings.json"
if not exist "%SETTINGS_FILE%" (
    echo Creating default statement_settings.json...
    (
        echo {
        echo   "mode": "balanceSheet",
        echo   "display": {
        echo     "mode": "millions",
        echo     "divisor": 1000000
        echo   },
        echo   "balanceSheet": {
        echo     "selected": ["Total Assets", "Current Assets", "Cash And Cash Equivalents", "Total Liabilities Net Minority Interest", "Stockholders Equity", "Total Debt", "Current Liabilities"]
        echo   },
        echo   "incomeStatement": {
        echo     "selected": ["Total Revenue", "Cost Of Revenue", "Gross Profit", "Operating Income", "Net Income", "EBITDA", "Basic EPS", "Diluted EPS"]
        echo   },
        echo   "cashFlow": {
        echo     "selected": ["Operating Cash Flow", "Free Cash Flow", "Capital Expenditure", "Cash Dividends Paid"]
        echo   }
        echo }
    ) > "%SETTINGS_FILE%"
    echo Default statement_settings.json created.
) else (
    echo statement_settings.json already exists.
)

REM Initialize pending_deletions.json if missing
set "PENDING_FILE=%DATA_DIR%\pending_deletions.json"
if not exist "%PENDING_FILE%" (
    echo {} > "%PENDING_FILE%"
    echo Default pending_deletions.json created.
) else (
    echo pending_deletions.json already exists.
)

REM Initialize ratio_config.json if missing
set "RATIO_FILE=%~dp0Importing\ratio_config.json"
if not exist "%~dp0Importing" mkdir "%~dp0Importing"
if not exist "%RATIO_FILE%" (
    echo Creating default ratio_config.json...
    (
        echo {
        echo   "Current Ratio": {
        echo     "formula": "BS: Current Assets / BS: Current Liabilities",
        echo     "notes": "Measures short-term liquidity"
        echo   },
        echo   "Debt to Equity": {
        echo     "formula": "BS: Total Debt / BS: Stockholders Equity",
        echo     "notes": "Measures financial leverage"
        echo   },
        echo   "Gross Margin": {
        echo     "formula": "(IS: Total Revenue - IS: Cost Of Revenue) / IS: Total Revenue",
        echo     "notes": "Measures profitability after direct costs"
        echo   },
        echo   "Net Profit Margin": {
        echo     "formula": "IS: Net Income / IS: Total Revenue",
        echo     "notes": "Measures overall profitability"
        echo   },
        echo   "Return on Equity": {
        echo     "formula": "IS: Net Income / BS: Stockholders Equity",
        echo     "notes": "Measures return on shareholder investment"
        echo   }
        echo }
    ) > "%RATIO_FILE%"
    echo Default ratio_config.json created.
) else (
    echo ratio_config.json already exists.
)
echo Data directories and files initialized.
echo.

REM ============================================
REM STEP 8: Install xlwings Excel Add-in & Configure
REM ============================================
echo [8/9] Installing xlwings Excel Add-in...
"%VENV_PYTHON%" -m xlwings addin install
if errorlevel 1 (
    echo WARNING: xlwings add-in installation failed.
    echo You may need to install it manually later.
) else (
    echo xlwings add-in installed.
)
echo.

echo Configuring xlwings for this project...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Installation\configure_xlwings.ps1" -ProjectDir "%~dp0"
if %errorlevel% equ 0 (
    echo xlwings configuration completed successfully.
) else (
    echo.
    echo WARNING: xlwings configuration failed.
    echo Please run the following command manually:
    echo   powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Installation\configure_xlwings.ps1" -ProjectDir "%~dp0"
)
echo.

REM ============================================
REM STEP 9: Create FinForge.xlsm Workbook
REM ============================================
echo [9/9] Checking FinForge workbook...
set "FINFORGE_WORKBOOK=%~dp0FinForge.xlsm"
set "FINFORGE_TEMPLATE=%~dp0Internal\cheking_and_structure\Template.xlsm"

if exist "%FINFORGE_WORKBOOK%" (
    echo FinForge.xlsm already exists.
) else (
    if exist "%FINFORGE_TEMPLATE%" (
        echo FinForge.xlsm not found. Creating from template...
        copy /Y "%FINFORGE_TEMPLATE%" "%FINFORGE_WORKBOOK%" >nul
        if errorlevel 1 (
            echo WARNING: Could not create FinForge.xlsm from template.
        ) else (
            echo Created FinForge.xlsm from template.
        )
    ) else (
        echo WARNING: Template file not found at:
        echo   %FINFORGE_TEMPLATE%
        echo FinForge.xlsm was not created.
    )
)
echo.

REM ============================================
REM SETUP COMPLETE
REM ============================================
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Quick Start:
echo   1. Double-click "launch_finforge.bat" to open the FinForge Launcher
echo   2. Or open "FinForge.xlsm" directly in Excel
echo.
echo IMPORTANT - Excel Macro Settings:
echo   1. Open Excel
echo   2. Go to File ^> Options ^> Trust Center ^> Trust Center Settings
echo   3. Click "Macro Settings" and select "Enable all macros"
echo   4. Check "Trust access to the VBA project object model"
echo   5. Click OK and restart Excel
echo.
if "!NODE_FOUND!"=="0" (
    echo NOTE: Node.js was not found. The Electron Launcher UI is unavailable.
    echo Install Node.js from https://nodejs.org/ then re-run setup.bat.
    echo.
)
echo For help and guides, see the "Guides" folder.
echo.
pause
exit /b 0

:strlen
setlocal EnableDelayedExpansion
set "s=!%~1!"
set "len=0"
:strlen_loop
if defined s (
    set "s=!s:~1!"
    set /a len+=1
    goto strlen_loop
)
endlocal & set "%~2=%len%"
exit /b 0
