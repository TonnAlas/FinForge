# Whoogle Search Setup Guide

This guide explains how to set up and run Whoogle Search for Google-based research paper search in FinForge.

## Overview

Whoogle Search is a lightweight Google search proxy that runs locally. It allows FinForge to search Google programmatically, supporting `filetype:pdf` and all Google search operators -- without using any external API keys.

## How It Works

```
FinForge UI (renderer.js)
  --> calls window.finforge.searchResearchPapers(query, "google")
  --> Main process spawns Python
  --> Python queries local Whoogle server (http://127.0.0.1:5000)
  --> Whoogle proxies the request to Google and returns results
  --> Results flow back to the UI
```

## Installation

Whoogle is included in `requirements.txt`. If you installed FinForge dependencies with `pip install -r requirements.txt`, it is already installed.

To install manually:

```bash
pip install whoogle-search cachetools
```

## Windows Compatibility

Whoogle uses `os.symlink` which requires admin privileges on Windows. The FinForge research module automatically patches this on first use by replacing symlinks with `shutil.copy2`. No manual action needed.

## Starting Whoogle

### Option 1: Manual Start (for testing)

Open a terminal and run:

```bash
whoogle-search --port 5000
```

The server will start on http://127.0.0.1:5000. Leave this terminal window open while using FinForge.

### Option 2: Auto-Start (recommended)

The FinForge research module (`search_papers_google`) will automatically attempt to start Whoogle if it is not already running. This happens transparently when you switch the search source to "Google" and click a research topic button.

### Option 3: As a Windows service (advanced)

You can use `nssm` (Non-Sucking Service Manager) to run Whoogle as a Windows background service:

```bash
nssm install FinForgeWhoogle "C:\path\to\.venv\Scripts\whoogle-search.exe" "--port 5000"
nssm start FinForgeWhoogle
```

## Usage in FinForge

1. Open the Company Profile for any ticker
2. Click the "Research" tab
3. Toggle the source to **Google** (next to the "Research papers" heading)
4. Click any research topic button (e.g., "Equity Research")
5. Results will be fetched from Google with `filetype:pdf` support

## Configuration

Whoogle runs on `127.0.0.1:5000` by default. These values are configured in:

```
Internal/Research/research_paper_search.py
```

| Variable | Default | Description |
|---|---|---|
| `WHOOGLE_HOST` | `127.0.0.1` | Host address |
| `WHOOGLE_PORT` | `5000` | Port number |

## Troubleshooting

### Whoogle fails to start

Check if the port is already in use:

```bash
netstat -ano | findstr :5000
```

If something else is using port 5000, change the port in `research_paper_search.py` or stop the conflicting process.

### No results returned

Ensure Whoogle is running:

```bash
curl http://127.0.0.1:5000/
```

If it returns HTML, Whoogle is working. Check your internet connection.

### Symlink errors on Windows

This is automatically handled by the FinForge module. If you see symlink errors, the module will patch Whoogle automatically. You can also manually reinstall:

```bash
pip install --force-reinstall whoogle-search
```

## Switching Between Search Sources

- **DuckDuckGo**: Default. Works out of the box, no server needed. Filters results by `.pdf` URL extension.
- **Google (Whoogle)**: Requires Whoogle server running. Supports `filetype:pdf` natively. Returns real Google results.
