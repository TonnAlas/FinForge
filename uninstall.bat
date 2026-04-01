@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM ========================================
REM FinForge - Uninstall Wizard
REM ========================================

echo ========================================
echo    FinForge - Uninstall Wizard
echo ========================================
echo.
echo This will remove setup components from this project folder.
echo.

cd /d "%~dp0"

call :prompt_yes_no "Do you want to continue" "N" CONFIRM_UNINSTALL
if /i not "%CONFIRM_UNINSTALL%"=="Y" (
    echo.
    echo Uninstall cancelled.
    pause
    exit /b 0
)

call :prompt_yes_no "Remove virtual environment (.venv)" "Y" REMOVE_VENV
call :prompt_yes_no "Remove xlwings Excel add-in for this Windows user" "Y" REMOVE_XLWINGS_ADDIN
call :prompt_yes_no "Remove FinForge xlwings config if it points to this project" "Y" REMOVE_XLWINGS_CONF
call :prompt_yes_no "Delete generated FinForge.xlsm workbook" "N" REMOVE_WORKBOOK
call :prompt_yes_no "Delete launch diagnostics file in Temporary folder" "Y" REMOVE_DIAGNOSTICS
call :prompt_yes_no "Delete setup temp folder %SystemDrive%\fftmp" "Y" REMOVE_SHORT_TEMP

echo.
echo ----------------------------------------
echo Starting uninstall...
echo ----------------------------------------
echo.

if /i "%REMOVE_XLWINGS_ADDIN%"=="Y" (
    echo [1/6] Removing xlwings add-in...
    call :remove_xlwings_addin
) else (
    echo [1/6] Skipped xlwings add-in removal.
)

if /i "%REMOVE_XLWINGS_CONF%"=="Y" (
    echo [2/6] Removing xlwings config for this project...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Installation\unconfigure_xlwings.ps1" -ProjectDir "%~dp0"
    if errorlevel 1 (
        echo WARNING: xlwings config cleanup reported an issue.
    )
) else (
    echo [2/6] Skipped xlwings config cleanup.
)

if /i "%REMOVE_VENV%"=="Y" (
    echo [3/6] Removing virtual environment...
    if exist "%~dp0.venv" (
        rmdir /s /q "%~dp0.venv"
        if exist "%~dp0.venv" (
            echo WARNING: Could not remove .venv completely.
        ) else (
            echo Removed .venv
        )
    ) else (
        echo .venv not found. Nothing to remove.
    )
) else (
    echo [3/6] Skipped .venv removal.
)

if /i "%REMOVE_WORKBOOK%"=="Y" (
    echo [4/6] Removing FinForge workbook...
    if exist "%~dp0FinForge.xlsm" (
        del /f /q "%~dp0FinForge.xlsm"
        if exist "%~dp0FinForge.xlsm" (
            echo WARNING: Could not delete FinForge.xlsm
        ) else (
            echo Removed FinForge.xlsm
        )
    ) else (
        echo FinForge.xlsm not found. Nothing to remove.
    )
) else (
    echo [4/6] Skipped workbook deletion.
)

if /i "%REMOVE_DIAGNOSTICS%"=="Y" (
    echo [5/6] Removing launch diagnostics...
    if exist "%~dp0Temporary\launch_diagnostics.log" (
        del /f /q "%~dp0Temporary\launch_diagnostics.log"
        if exist "%~dp0Temporary\launch_diagnostics.log" (
            echo WARNING: Could not delete launch_diagnostics.log
        ) else (
            echo Removed Temporary\launch_diagnostics.log
        )
    ) else (
        echo launch_diagnostics.log not found. Nothing to remove.
    )
) else (
    echo [5/6] Skipped diagnostics cleanup.
)

if /i "%REMOVE_SHORT_TEMP%"=="Y" (
    echo [6/6] Removing setup temp folder...
    if exist "%SystemDrive%\fftmp" (
        rmdir /s /q "%SystemDrive%\fftmp"
        if exist "%SystemDrive%\fftmp" (
            echo WARNING: Could not remove %SystemDrive%\fftmp
        ) else (
            echo Removed %SystemDrive%\fftmp
        )
    ) else (
        echo %SystemDrive%\fftmp not found. Nothing to remove.
    )
) else (
    echo [6/6] Skipped setup temp cleanup.
)

echo.
echo ========================================
echo    Uninstall Completed
echo ========================================
echo.
echo FinForge setup components were removed based on your selections.
echo If you want to use FinForge again, run setup.bat.
echo.
pause
exit /b 0

:remove_xlwings_addin
if exist "%~dp0.venv\Scripts\activate.bat" (
    call "%~dp0.venv\Scripts\activate.bat"
)

where xlwings >nul 2>&1
if errorlevel 1 (
    echo xlwings command not found. Skipping add-in removal.
    exit /b 0
)

xlwings addin remove
if errorlevel 1 (
    echo WARNING: xlwings add-in removal failed.
) else (
    echo xlwings add-in removed.
)
exit /b 0

:prompt_yes_no
setlocal
set "QUESTION=%~1"
set "DEFAULT=%~2"
set "ANSWER="

:ask_again
if /i "%DEFAULT%"=="Y" (
    set /p ANSWER=%QUESTION% [Y/n]: 
) else (
    set /p ANSWER=%QUESTION% [y/N]: 
)

if "%ANSWER%"=="" set "ANSWER=%DEFAULT%"

if /i "%ANSWER%"=="Y" (
    endlocal & set "%~3=Y"
    exit /b 0
)
if /i "%ANSWER%"=="N" (
    endlocal & set "%~3=N"
    exit /b 0
)

echo Please answer Y or N.
goto ask_again
