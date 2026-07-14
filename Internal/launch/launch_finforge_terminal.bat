@echo off
REM FinForge Terminal Launcher
REM This script launches the Electron workspace window directly for Excel users

REM Resolve the project root from the launcher location
for %%I in ("%~dp0..\..") do set "PROJECT_ROOT=%%~fI"

REM Write diagnostics for path/config troubleshooting
if not exist "%PROJECT_ROOT%\Temporary" mkdir "%PROJECT_ROOT%\Temporary"
set "LAUNCH_LOG=%PROJECT_ROOT%\Temporary\launch_terminal_diagnostics.log"
echo ==================================================>>"%LAUNCH_LOG%"
echo [%date% %time%] FinForge terminal launch attempt>>"%LAUNCH_LOG%"
echo USER=%USERNAME%>>"%LAUNCH_LOG%"
echo PROJECT_DIR=%PROJECT_ROOT%>>"%LAUNCH_LOG%"
echo WORKING_DIR=%CD%>>"%LAUNCH_LOG%"

set "ELECTRON_APP_DIR=%PROJECT_ROOT%\ElectronHome"
set "ELECTRON_EXE=%ELECTRON_APP_DIR%\node_modules\electron\dist\electron.exe"

if exist "%ELECTRON_EXE%" (
    echo ELECTRON_STATUS=FOUND>>"%LAUNCH_LOG%"
    pushd "%ELECTRON_APP_DIR%"
    set "FINFORGE_START_WINDOW=workspace"
    start "" "%ELECTRON_EXE%" .
    popd
) else (
    echo ELECTRON_STATUS=MISSING>>"%LAUNCH_LOG%"
    echo ERROR: Electron is not installed for FinForge Terminal.
    echo.
    echo Run the following from the ElectronHome folder:
    echo   npm install
    echo.
    echo Then run Internal\launch\launch_finforge_terminal.bat again.
    echo.
    pause
)