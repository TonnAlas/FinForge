# ============================================
# FinForge - xlwings Unconfiguration
# ============================================
# This script removes xlwings.conf only if it points to this project.

param(
    [string]$ProjectDir
)

$ErrorActionPreference = "Stop"

function Normalize-PathSafe {
    param([string]$PathValue)

    if (-not $PathValue) {
        return $null
    }

    try {
        $full = [System.IO.Path]::GetFullPath($PathValue)
        if ($full.Length -gt 3) {
            $full = $full.TrimEnd([char[]]@('\\', '/'))
        }
        return $full
    }
    catch {
        return $PathValue.Trim()
    }
}

if (-not $ProjectDir) {
    $ProjectDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommandPath)
}

$projectPath = Normalize-PathSafe -PathValue $ProjectDir
$projectPrefix = $projectPath + [System.IO.Path]::DirectorySeparatorChar

$xlwingsConfDir = Join-Path $env:USERPROFILE ".xlwings"
$xlwingsConfFile = Join-Path $xlwingsConfDir "xlwings.conf"

if (-not (Test-Path $xlwingsConfFile)) {
    Write-Host "No xlwings.conf found. Nothing to remove."
    exit 0
}

$entries = @{}
Get-Content -Path $xlwingsConfFile | ForEach-Object {
    if ($_ -match '^\s*"([^"]+)"\s*,\s*"([^"]*)"\s*$') {
        $entries[$matches[1]] = $matches[2]
    }
}

$pythonPath = Normalize-PathSafe -PathValue $entries["PYTHONPATH"]
$interpreterWin = Normalize-PathSafe -PathValue $entries["INTERPRETER_WIN"]

$matchesProject = $false

if ($pythonPath -and $pythonPath.Equals($projectPath, [System.StringComparison]::OrdinalIgnoreCase)) {
    $matchesProject = $true
}

if (-not $matchesProject -and $interpreterWin -and $interpreterWin.StartsWith($projectPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    $matchesProject = $true
}

if (-not $matchesProject) {
    Write-Host "xlwings.conf does not point to this project. Skipping removal."
    exit 0
}

Remove-Item -Path $xlwingsConfFile -Force
Write-Host "Removed xlwings.conf for this project."

if ((Test-Path $xlwingsConfDir) -and -not (Get-ChildItem -Path $xlwingsConfDir -Force | Select-Object -First 1)) {
    Remove-Item -Path $xlwingsConfDir -Force
    Write-Host "Removed empty .xlwings directory."
}

exit 0
