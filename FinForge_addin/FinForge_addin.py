"""
FinForge Excel Add-in - Python Backend

DESCRIPTION:
Backend module for the FinForge Excel add-in. Provides Python functions that are
called from VBA via xlwings, enabling communication between Excel ribbon controls
and the FinForge home window / dashboard application.

INPUTS:
- Function calls from VBA via xlwings library
- Environment: Requires Python in system PATH, xlwings installed

OUTPUTS:
- Launched home window GUI: Electron-based FinForge control center
- Status/error messages: Returned to VBA for display in Excel

DEPENDENCIES:
- xlwings: VBA-Python bridge library
- subprocess: System process execution for launching the FinForge home window
- sys, os: System utilities for path management
- Internal.launch.finforge_home: Legacy Python home window launcher

RELATED FILES:
- FinForge_addin.xlam: Excel add-in file (contains VBA ribbon code)
- ElectronHome/: Electron-based FinForge home window implementation
- Guides/FinForge_AddIn_Guide.md: Technical documentation

NOTE:
This module must be installed as a pyinstaller-frozen executable or run with
xlwings ServerAddin configuration for standalone use. See setup documentation
for installation instructions.
"""

import os
import subprocess
from pathlib import Path


def launch_home_window():
    """
    Launch the FinForge home window from Excel ribbon button.
    
    This function is called by VBA when the user clicks the "Dashboard" button
    in the Excel ribbon. It spawns a new process running the FinForge home GUI.
    
    INPUTS:
        None (called from VBA ribbon callback)
    
    OUTPUTS:
        Returns: Dictionary with status information
        {
            "success": bool,
            "message": str (descriptive message for user)
        }
    
    ERROR HANDLING:
        - Catches all exceptions and returns them as user-friendly messages
        - Handles missing finforge_home.py gracefully
        - Provides setup instructions if Python environment is misconfigured
    
    EXAMPLE USAGE (from VBA):
        result = xlwings.API.launch_home_window()
        if result["success"] Then
            MsgBox "Home window launched successfully"
        Else
            MsgBox "Error: " & result["message"]
        End If
    """
    try:
        # Get the project root directory
        # This script is at: <root>/FinForge_addin/FinForge_addin.py
        # We need to get to: <root>/Internal/launch/launch_finforge_terminal.bat
        addon_dir = Path(__file__).parent  # FinForge_addin directory
        root_dir = addon_dir.parent         # Project root
        launcher_path = root_dir / "Internal" / "launch" / "launch_finforge_terminal.bat"
        
        if not launcher_path.exists():
            return {
                "success": False,
                "message": f"Terminal launcher not found at: {launcher_path}\n\nPlease ensure FinForge is properly installed."
            }
        
        # Launch the Electron home window without opening a visible console window.
        subprocess.Popen(
            ["cmd", "/c", str(launcher_path)],
            cwd=str(root_dir),
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
        )
        
        return {
            "success": True,
            "message": "Home window launched successfully"
        }
    
    except FileNotFoundError as e:
        return {
            "success": False,
            "message": f"Python environment error: {e}\n\nEnsure Python is in your system PATH."
        }
    
    except Exception as e:
        return {
            "success": False,
            "message": f"Unexpected error: {type(e).__name__}: {e}\n\nPlease check your FinForge installation."
        }
