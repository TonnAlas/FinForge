'==============================================================================
' FinForge Excel Add-in - ThisWorkbook Module
'==============================================================================
'
' DESCRIPTION:
' Workbook-level initialization and event handlers for the FinForge add-in.
' This module runs when the Excel add-in file is loaded and initializes
' ribbon UI references and validation checks.
'
' EVENTS:
' - Workbook_Open: Triggered when add-in is loaded into Excel
' - Workbook_AddinInstall: Triggered when add-in is first installed
' - Workbook_AddinUninstall: Triggered when add-in is removed
'
' DEPENDENCIES:
' - CustomRibbon.xml: Ribbon UI definition (must be embedded in XLAM file)
' - RibbonCallback.vba: Ribbon event handlers
'
' NOTE:
' This is a standard class module in any Excel file. For add-in files (XLAM),
' this module is particularly important for initialization.
'
' This code must be placed in the "ThisWorkbook" class module of your XLAM file.
'
'==============================================================================

Option Explicit

' Module-level variable to store ribbon reference for dynamic updates
Private mRibbon As IRibbonUI


'==============================================================================
' EVENT: Workbook_Open
'==============================================================================
' PURPOSE:
'   Executes automatically when the add-in workbook is opened/loaded by Excel.
'   Performs initialization checks and logs that the add-in is ready.
'
' WHEN IT RUNS:
'   - First time: When user enables add-in in Excel (File > Options > Add-ins)
'   - Subsequent: Each time Excel starts (if add-in is enabled)
'
' TASKS:
'   - Validate xlwings is properly installed
'   - Log initialization status
'   - Prepare ribbon for user interaction
'==============================================================================

Private Sub Workbook_Open()
    
    On Error GoTo ErrorHandler
    
    ' Log that add-in has loaded
    Debug.Print "=" & String(78, "=")
    Debug.Print "FinForge Excel Add-in - Initialization"
    Debug.Print "=" & String(78, "=")
    Debug.Print "Timestamp: " & Format(Now, "yyyy-mm-dd hh:mm:ss")
    Debug.Print "Status: Add-in loaded successfully"
    Debug.Print "Ribbon: Custom 'FinForge' tab available"
    Debug.Print "=" & String(78, "=")
    
    ' Perform optional setup checks (currently disabled by default)
    ' Uncomment if you want automatic validation on startup:
    ' Call ValidateSetup()
    
    Exit Sub

ErrorHandler:
    Debug.Print "ERROR during add-in initialization: " & Err.Description
    ' Don't crash Excel on initialization error
    ' User will see error when clicking ribbon button
End Sub


'==============================================================================
' EVENT: Workbook_AddinInstall
'==============================================================================
' PURPOSE:
'   Executes the first time the add-in is installed/enabled in Excel.
'   Use for one-time setup tasks (creating registry entries, etc.)
'
' WHEN IT RUNS:
'   - Only once: First time add-in is enabled in Excel
'   - Triggered by Excel automatically, not by user action
'
' CURRENT IMPLEMENTATION:
'   Minimal - just logs the installation event
'
' FUTURE ENHANCEMENTS:
'   - Create registry entries for add-in configuration
'   - Initialize user preferences or settings
'   - Create support files or folders
'==============================================================================

Private Sub Workbook_AddinInstall()
    Debug.Print "FinForge Add-in installed: " & Format(Now, "yyyy-mm-dd hh:mm:ss")
End Sub


'==============================================================================
' EVENT: Workbook_AddinUninstall
'==============================================================================
' PURPOSE:
'   Executes when the add-in is uninstalled/disabled by user.
'   Use for cleanup tasks (removing registry entries, temporary files, etc.)
'
' WHEN IT RUNS:
'   - When user disables add-in (File > Options > Add-ins > Remove)
'   - Before add-in is completely removed from Excel
'
' CURRENT IMPLEMENTATION:
'   Minimal - just logs the uninstallation event
'
' FUTURE ENHANCEMENTS:
'   - Clean up registry entries
'   - Remove temporary configuration files
'   - Close any background processes related to add-in
'==============================================================================

Private Sub Workbook_AddinUninstall()
    Debug.Print "FinForge Add-in uninstalled: " & Format(Now, "yyyy-mm-dd hh:mm:ss")
End Sub


'==============================================================================
' SUBROUTINE: StoreRibbonReference
'==============================================================================
' PURPOSE:
'   Store ribbon reference for potential dynamic ribbon updates.
'   Called from ribbon callback (OnRibbonLoad) if ribbon updates needed.
'
' INPUTS:
'   ribbon (IRibbonUI): Ribbon object from Excel
'
' OUTPUTS:
'   None (stores in module-level variable)
'
' NOTE:
'   Currently unused, but available for future enhancements like:
'   - Dynamically enabling/disabling ribbon buttons
'   - Changing button labels at runtime
'   - Showing/hiding ribbon controls based on workbook state
'==============================================================================

Public Sub StoreRibbonReference(ribbon As IRibbonUI)
    Set mRibbon = ribbon
    Debug.Print "Ribbon reference stored for dynamic updates"
End Sub


'==============================================================================
' SUBROUTINE: ValidateSetup
'==============================================================================
' PURPOSE:
'   Validates that FinForge add-in prerequisites are installed/configured.
'   Checks for xlwings and Python environment availability.
'
' INPUTS:
'   None
'
' OUTPUTS:
'   None (displays messagebox if issues found)
'
' VALIDATION CHECKS:
'   - xlwings library available via Python
'   - Python executable in system PATH
'   - FinForge_addin.py file accessible
'
' NOTE:
'   This sub is not called automatically. To enable:
'   1. Uncomment the call in Workbook_Open() above
'   2. Or call manually from VBA immediate window: ValidateSetup
'
' ALTERNATIVE:
'   Validation happens automatically when user first clicks Dashboard button.
'   This sub is useful for proactive checking during add-in load.
'==============================================================================

Private Sub ValidateSetup()
    
    ' This is a placeholder for setup validation logic.
    ' Actual validation would require calling Python via xlwings,
    ' which is deferred until user clicks the Dashboard button.
    '
    ' Early validation can be added here if needed for better UX,
    ' but is disabled by default to avoid slowing down add-in initialization.
    
    Debug.Print "Setup validation placeholder (disabled by default)"
    
End Sub


'==============================================================================
' NOTES ON RIBBON UI INITIALIZATION:
'==============================================================================
'
' The ribbon UI is defined in CustomRibbon.xml (also stored in the FinForge_addin folder).
'
' For the ribbon to appear in Excel:
' 1. ThisWorkbook.vba must exist (you are reading it)
' 2. CustomRibbon.xml must be embedded in the XLAM file
' 3. RibbonCallback.vba must handle ribbon events
' 4. XLAM file structure must include ribbon relationships
'
' When XLAM is properly configured:
' - Excel automatically loads CustomRibbon.xml on startup
' - Calls OnRibbonLoad() when ribbon is initialized
' - Routes button clicks to LaunchDashboard() in RibbonCallback.vba
'
' For assembly instructions, see: FinForge_addin/AddIn_Assembly_Instructions.md
'
'==============================================================================