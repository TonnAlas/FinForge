@echo off
REM FinForge Launcher
REM This script activates the virtual environment and launches FinForge

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

REM Check if virtual environment exists
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
        powershell -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('xlwings auto-configuration failed. Excel buttons may not work until configuration is fixed. Run setup.bat or re-run Installation\\configure_xlwings.ps1 from the FinForge folder.', 'FinForge Warning', [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning) | Out-Null"
    ) else (
        echo CONFIG_STATUS=OK>>"%LAUNCH_LOG%"
    )

    start "" pythonw "%~dp0Internal\launch\stock_launcher.py"
) else (
    echo CONFIG_STATUS=FAILED_VENV_MISSING>>"%LAUNCH_LOG%"
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first to install the application.
    echo.
    pause
)
