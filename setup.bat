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

REM Check Windows long path support (helpful for large packages like PySide6)
for /f "tokens=3" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v LongPathsEnabled 2^>nul ^| find "LongPathsEnabled"') do set LONG_PATHS=%%a
if /i not "%LONG_PATHS%"=="0x1" (
    echo WARNING: Windows Long Path support appears to be disabled.
    echo Some packages may fail to install on deep folder paths.
    echo Recommended: Extract FinForge to a short path like C:\FinForge
    echo.
)

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

REM Use a short temp directory to reduce path-length issues during wheel extraction
set "ORIGINAL_TEMP=%TEMP%"
set "ORIGINAL_TMP=%TMP%"
set "SHORT_TEMP=%SystemDrive%\fftmp"
if not exist "%SHORT_TEMP%" mkdir "%SHORT_TEMP%"
set "TEMP=%SHORT_TEMP%"
set "TMP=%SHORT_TEMP%"

pip install -r requirements.txt
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

REM Ensure FinForge workbook exists (create from template if missing)
echo ----------------------------------------
echo Checking FinForge workbook...
echo ----------------------------------------
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
