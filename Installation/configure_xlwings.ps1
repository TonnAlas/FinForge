# ============================================
# FinForge - xlwings Configuration
# ============================================
# This script safely configures xlwings.conf with correct Python paths.

param(
    [string]$ProjectDir
)

$ErrorActionPreference = "Stop"

# If ProjectDir not provided, calculate it (script is in Installation subfolder)
if (-not $ProjectDir) {
    $ProjectDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommandPath)
}

# Normalize project path for reliable xlwings quoting behavior.
$ProjectDir = [System.IO.Path]::GetFullPath($ProjectDir)
if ($ProjectDir.Length -gt 3) {
    $ProjectDir = $ProjectDir.TrimEnd([char[]]@('\', '/'))
}

# Prefer project venv, but fall back to available Python interpreters.
$interpreterCandidates = @(
    (Join-Path $ProjectDir ".venv\Scripts\python.exe")
)

try {
    $pyCmd = Get-Command py -ErrorAction Stop
    $pyResolved = & $pyCmd.Source -c "import sys; print(sys.executable)" 2>$null
    if ($LASTEXITCODE -eq 0 -and $pyResolved) {
        $interpreterCandidates += $pyResolved.Trim()
    }
}
catch {
}

try {
    $pythonCmd = Get-Command python -ErrorAction Stop
    $pythonResolved = & $pythonCmd.Source -c "import sys; print(sys.executable)" 2>$null
    if ($LASTEXITCODE -eq 0 -and $pythonResolved) {
        $interpreterCandidates += $pythonResolved.Trim()
    }
}
catch {
}

$interpreterPath = $null
foreach ($candidate in ($interpreterCandidates | Select-Object -Unique)) {
    if ($candidate -and (Test-Path $candidate)) {
        $interpreterPath = [System.IO.Path]::GetFullPath($candidate)
        break
    }
}

$xlwingsConfDir = Join-Path $env:USERPROFILE ".xlwings"
$xlwingsConfFile = Join-Path $xlwingsConfDir "xlwings.conf"

# Validate interpreter exists
if (-not $interpreterPath) {
    Write-Error "No usable Python interpreter found."
    Write-Error "Run setup.bat to create .venv, or ensure 'python'/'py' is installed and available."
    exit 1
}

# Safety check: only allow interpreters from the selected project folder.
$projectPrefix = $ProjectDir + [System.IO.Path]::DirectorySeparatorChar
if (($interpreterPath -ne $ProjectDir) -and (-not $interpreterPath.StartsWith($projectPrefix, [System.StringComparison]::OrdinalIgnoreCase))) {
    Write-Error "Refusing to configure xlwings with interpreter outside project folder."
    Write-Error "Interpreter: $interpreterPath"
    Write-Error "Project: $ProjectDir"
    Write-Error "Run setup.bat in this exact project folder to create .venv."
    exit 1
}

# Create xlwings config directory if needed
if (-not (Test-Path $xlwingsConfDir)) {
    Write-Host "Creating xlwings config directory..."
    New-Item -ItemType Directory -Path $xlwingsConfDir -Force | Out-Null
}

# Write configuration file with proper format
$configContent = @"
"INTERPRETER_WIN","$interpreterPath"
"PYTHONPATH","$ProjectDir"
"@

try {
    Set-Content -Path $xlwingsConfFile -Value $configContent -Encoding UTF8 -NoNewline
    Write-Host "xlwings configured successfully!"
    Write-Host "  Interpreter: $interpreterPath"
    Write-Host "  Python path: $ProjectDir"
}
catch {
    Write-Error "Failed to write xlwings.conf: $_"
    exit 1
}
