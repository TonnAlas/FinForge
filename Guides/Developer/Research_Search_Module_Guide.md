# Research Paper Search Module

## Overview

This module provides programmatic search for research papers and PDF documents using DuckDuckGo. It replaces the previous approach of redirecting users to Google in an external browser by fetching results server-side and displaying them directly in the FinForge Electron UI.

## Directory Structure

```
Internal/Research/
    __init__.py                   # Package init
    research_paper_search.py     # Core search logic

ElectronHome/
    main.js                      # IPC handler: finforge:searchResearchPapers
    preload.js                   # Bridge: window.finforge.searchResearchPapers()
    src/renderer.js              # UI: renders results inline
```

## Python Module: `research_paper_search.py`

### Functions

#### `search_papers(query, max_results=10)`

Searches for documents matching the query using DuckDuckGo.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `query` | str | - | Search query string (e.g. "Equity Research AAPL") |
| `max_results` | int | 10 | Max results to return (1-50) |

**Returns:** `list[dict]` -- each dict contains:
- `title` (str): Result title
- `url` (str): Full URL to the document
- `snippet` (str): Short description/context
- `source` (str): Always `"duckduckgo"`

**Raises:** `ImportError` if the `ddgs` package is not installed. `Exception` on network failure.

### Example Usage (Python)

```python
from Internal.Research.research_paper_search import search_papers

# General search
results = search_papers("Equity Research Apple", max_results=5)
for r in results:
    print(r["title"], "-", r["url"])
```

### Dependencies

- `ddgs>=9.0.0` (DuckDuckGo search library)

## IPC Flow

```
Renderer (renderer.js)
  |-- calls window.finforge.searchResearchPapers(query)
  |
  v
Preload Bridge (preload.js)
  |-- ipcRenderer.invoke('finforge:searchResearchPapers', query)
  |
  v
Main Process (main.js)
  |-- spawns Python: python -c "import...; search_papers(query)"
  |-- parses JSON stdout
  |-- returns { ok: true, results: [...] }
  |
  v
Renderer (renderer.js)
  |-- updates state.researchResults
  |-- calls updateResearchResultsUI()
  |-- renders results inline
```

## UI Behavior

1. User clicks a topic button (e.g. "Equity Research") in the Research Papers section
2. A loading indicator is shown
3. The Python module performs the DuckDuckGo search
4. Results appear inline in a scrollable list below the buttons
5. Each result shows: title (clickable link), snippet, and URL
6. Clicking a result link opens it in the default browser via `shell.openExternal`

## Configuration

No configuration required. The DuckDuckGo API does not need an API key.

## Limitations

- DuckDuckGo does not support `filetype:pdf` filtering like Google does -- results include all web content, not just PDFs
- Rate limiting may apply for very frequent searches
- Not all results will be PDF files; some may be web articles, LinkedIn posts, etc.
- Requires an active internet connection
