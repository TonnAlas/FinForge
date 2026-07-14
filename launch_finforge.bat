@echo off
REM FinForge Launcher
REM This script launches the Electron-based FinForge launcher window

REM Change to the directory where this batch file is located
cd /d "%~dp0"

REM Write diagnostics for path/config troubleshooting
if not exist "%~dp0Temporary" mkdir "%~dp0Temporary"
set "LAUNCH_LOG=%~dp0Temporary\launch_diagnostics.log"
echo ==================================================>>"%LAUNCH_LOG%"
echo [%date% %time%] FinForge launch attempt>>"%LAUNCH_LOG%"
echo USER=%USERNAME%>>"%LAUNCH_LOG%"
echo PROJECT_DIR=%~dp0>>"%LAUNCH_LOG%"
echo WORKING_DIR=%CD%>>"%LAUNCH_LOG%"

REM Configure xlwings when virtual environment exists
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat

    REM Refresh xlwings config for the current Windows user and folder location
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Installation\configure_xlwings.ps1" -ProjectDir "%~dp0" >>"%LAUNCH_LOG%" 2>&1

    REM Log current xlwings config details for easier debugging across accounts
    echo CONF_PATH=%USERPROFILE%\.xlwings\xlwings.conf>>"%LAUNCH_LOG%"
    if exist "%USERPROFILE%\.xlwings\xlwings.conf" (
        echo ---XLWINGS_CONF--->>"%LAUNCH_LOG%"
        type "%USERPROFILE%\.xlwings\xlwings.conf" >>"%LAUNCH_LOG%"
        echo ---END_XLWINGS_CONF--->>"%LAUNCH_LOG%"
    ) else (
        echo XLWINGS_CONF_MISSING=true>>"%LAUNCH_LOG%"
    )

    if errorlevel 1 (
        echo CONFIG_STATUS=FAILED>>"%LAUNCH_LOG%"
        echo WARNING: xlwings auto-configuration failed.
        echo Excel buttons may show "Could not find Interpreter".
        echo.
        echo Try running:
        echo   setup.bat
        echo   powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Installation\configure_xlwings.ps1" -ProjectDir "%~dp0"
        echo.
    ) else (
        echo CONFIG_STATUS=OK>>"%LAUNCH_LOG%"
    )
) else (
    echo CONFIG_STATUS=SKIPPED_VENV_MISSING>>"%LAUNCH_LOG%"
    echo WARNING: Virtual environment not found. Skipping xlwings configuration.>>"%LAUNCH_LOG%"
)

REM Check if Node.js and Electron are available for the launcher UI
set "ELECTRON_EXE=%~dp0ElectronHome\node_modules\electron\dist\electron.exe"
if exist "%ELECTRON_EXE%" (
    echo ELECTRON_STATUS=FOUND>>"%LAUNCH_LOG%"
) else (
    echo ELECTRON_STATUS=MISSING>>"%LAUNCH_LOG%"
    REM Check if Node.js/npm are available to auto-install
    node --version >nul 2>&1
    if not errorlevel 1 (
        echo.
        echo Electron not found. Installing Node.js dependencies...
        echo This may take a moment...
        pushd "%~dp0ElectronHome"
        call npm install
        popd
        if exist "%ELECTRON_EXE%" (
            echo Electron installed successfully!
        ) else (
            echo WARNING: npm install may have failed.
            echo Try running setup.bat or manually run:
            echo   cd ElectronHome ^&^& npm install
            echo.
            pause
        )
    ) else (
        echo.
        echo ========================================
        echo  Electron Launcher Not Available
        echo ========================================
        echo.
        echo Node.js is required for the FinForge Launcher UI.
        echo.
        echo Quick fix options:
        echo   1. Run setup.bat to install everything automatically
        echo   2. Install Node.js from https://nodejs.org/
        echo      Then run: cd ElectronHome ^&^& npm install
        echo   3. Open FinForge.xlsm directly in Excel instead
        echo.
        pause
    )
)

REM Launch Electron launcher window
call "%~dp0Internal\launch\launch_finforge_launcher.bat"
