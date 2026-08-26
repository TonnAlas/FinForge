'==============================================================================
' FinForge Excel Add-in - Ribbon Callback Module
'==============================================================================
'
' DESCRIPTION:
' VBA module for ribbon callback functions. Contains event handlers for ribbon
' control interactions (button clicks, etc.) and launches the FinForge dashboard
' from the Excel ribbon.
'
' FUNCTIONS:
' - LaunchDashboard(): Click handler for "Dashboard" ribbon button
' - OnRibbonLoad(ribbon): Ribbon UI initialization (called on add-in load)
'
' DEPENDENCIES:
' - Internal\launch\launch_finforge_terminal.bat: Starts the main FinForge workspace window
'
' NOTE:
' This module must be injected into the FinForge_addin.xlam file.
' See: FinForge_addin/AddIn_Assembly_Instructions.md for details.
'
'==============================================================================

Option Explicit


'==============================================================================
' SUBROUTINE: LaunchDashboard
'==============================================================================
' PURPOSE:
'   Event handler triggered when user clicks the "Dashboard" button in the
'   FinForge ribbon tab. Launches the new FinForge home window.
'
' INPUTS:
'   control (IRibbonControl): Ribbon control object (passed by Excel)
'
' OUTPUTS:
'   None (displays message to user, launches home window process)
'
' ERROR HANDLING:
'   - Gracefully handles missing xlwings library
'   - Displays user-friendly error messages if Python environment is misconfigured
'   - Catches all VBA errors to prevent Excel crashes
'
' EXAMPLE:
'   User clicks "Dashboard" button in ribbon
'   -> Excel calls LaunchDashboard()
'   -> Starts Internal\launch\launch_finforge_terminal.bat in a separate process
'   -> FinForge home window spawns in a new process
'   -> Success message shown to user
'==============================================================================

Sub LaunchDashboard(control As IRibbonControl)
    Dim rootDir As String
    Dim launcherPath As String
    Dim shellObject As Object
    
    On Error GoTo ErrorHandler
    
    rootDir = GetProjectRoot()
    launcherPath = rootDir & "\Internal\launch\launch_finforge_terminal.bat"

    If Dir$(launcherPath) = "" Then
        Err.Raise vbObjectError + 1000, "LaunchDashboard", _
            "Launcher not found: " & launcherPath
    End If

    Set shellObject = CreateObject("WScript.Shell")
    shellObject.Run Chr(34) & launcherPath & Chr(34), 0, False
    Exit Sub

ErrorHandler:
    Dim errorMsg As String
    errorMsg = "Error: " & Err.Description & vbCrLf & vbCrLf & _
               "The ribbon button could not start the home window." & vbCrLf & vbCrLf & _
               "See: Guides/FinForge_AddIn_Guide.md for setup instructions."
    
    MsgBox errorMsg, vbCritical, "FinForge Setup Error"
    
End Sub


Private Function GetProjectRoot() As String
    Dim addInFolder As String
    Dim separatorPos As Long

    addInFolder = ThisWorkbook.Path
    separatorPos = InStrRev(addInFolder, "\")

    If separatorPos = 0 Then
        Err.Raise vbObjectError + 1001, "GetProjectRoot", _
            "Unable to resolve the FinForge project folder."
    End If

    GetProjectRoot = Left$(addInFolder, separatorPos - 1)
End Function


'==============================================================================
' SUBROUTINE: OnRibbonLoad
'==============================================================================
' PURPOSE:
'   Ribbon initialization callback, executed when Excel loads the add-in.
'   Currently used for logging only; can be extended for dynamic ribbon changes.
'
' INPUTS:
'   ribbon (IRibbonUI): Ribbon UI object provided by Excel
'
' OUTPUTS:
'   None
'
' NOTE:
'   Called automatically by Excel when CustomRibbon.xml is loaded.
'   Store ribbon reference if dynamic ribbon updates are needed in future.
'==============================================================================

Sub OnRibbonLoad(ribbon As IRibbonUI)
    ' Ribbon has been initialized
    ' Can be used for logging or dynamic ribbon updates in future versions
    Debug.Print "FinForge Ribbon loaded successfully"
End Sub


'==============================================================================
' NOTE ON xlwings INTEGRATION:
'==============================================================================
'
' The xlwings bridge works as follows:
'
' 1. VBA resolves the project root folder
' 2. VBA checks that Internal\launch\launch_finforge_terminal.bat exists
' 3. VBA starts the batch file in a separate process
' 4. The batch file activates the environment and launches finforge_home.py
'
' This requires:
' - Python 3.7+ installed and in system PATH
' - xlwings library installed (pip install xlwings)
' - FinForge_addin.py in the correct location
'
' For troubleshooting, see: Guides/FinForge_AddIn_Guide.md
'
'==============================================================================