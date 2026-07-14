Attribute VB_Name = "Module2"
Option Explicit

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
    MsgBox "Error: " & Err.Description, vbCritical, "FinForge Setup Error"
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

Sub HelloFinForge()
End Sub
