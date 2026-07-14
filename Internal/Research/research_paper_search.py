"""
Research Paper Search Module

Provides programmatic search for PDF research documents with multiple backends:
  1. DuckDuckGo (default, no server needed) -- adds "pdf" keyword + filters by .pdf extension
  2. Google via Whoogle (optional, server needed) -- uses real Google filetype:pdf

Usage:
    from Internal.Research.research_paper_search import (
        search_papers, search_papers_google, search_papers_for_ticker
    )

    # DuckDuckGo (default, works out of the box)
    results = search_papers("Equity Research Apple")

    # Google via Whoogle (requires whoogle-search running on port 5000)
    results = search_papers_google("Equity Research AAPL")
"""

import subprocess
import sys
import time
from pathlib import Path


# ── Configuration ──────────────────────────────────────────────────────────────
WHOOGLE_HOST = "127.0.0.1"
WHOOGLE_PORT = 5000
WHOOGLE_URL = f"http://{WHOOGLE_HOST}:{WHOOGLE_PORT}/search"


# ── DuckDuckGo Backend ─────────────────────────────────────────────────────────

def search_papers(query: str, max_results: int = 10) -> list[dict]:
    """
    Search for PDF research documents using DuckDuckGo.

    DuckDuckGo does not support "filetype:pdf", so this adds "pdf" to the
    query and filters results by .pdf URL extension.

    Args:
        query: Search query (e.g. "Equity Research AAPL")
        max_results: Max results to return (1-12)

    Returns:
        List of dicts with title, url, snippet, source keys.
    """
    try:
        from ddgs import DDGS
    except ImportError:
        try:
            from duckduckgo_search import DDGS
        except ImportError:
            raise ImportError(
                "The 'ddgs' package is required. "
                "Install it with: pip install ddgs"
            )

    capped_results = min(max(max_results, 1), 12)
    pdf_query = query.strip() + " pdf"
    fetch_count = min(max(capped_results * 4, 20), 50)

    try:
        with DDGS() as ddgs:
            raw_results = list(ddgs.text(pdf_query, max_results=fetch_count))
    except Exception as exc:
        msg = str(exc).lower()
        if "instantiate" in msg:
            raise Exception(
                "DuckDuckGo search failed: could not connect. "
                "Check your internet connection or try again later."
            ) from exc
        if "ratelimit" in msg or "rate" in msg:
            raise Exception(
                "DuckDuckGo search rate limited. Please wait a moment and try again."
            ) from exc
        raise Exception(f"DuckDuckGo search failed: {exc}") from exc

    pdf_results = []
    for item in raw_results:
        url = (item.get("href") or "").strip()
        if url.lower().endswith(".pdf"):
            pdf_results.append({
                "title": item.get("title", "").strip(),
                "url": url,
                "snippet": item.get("body", "").strip(),
                "source": "duckduckgo",
            })

    return pdf_results[:capped_results]


# ── Google (Whoogle) Backend ───────────────────────────────────────────────────

def _patch_whoogle_symlinks():
    """
    Windows does not support os.symlink without admin privileges.
    Patch the Whoogle installation to use shutil.copy2 instead.
    Runs once; harmless on subsequent calls.
    """
    try:
        init_file = (
            Path(__file__).parent.parent.parent
            / ".venv"
            / "Lib"
            / "site-packages"
            / "app"
            / "__init__.py"
        )
        if not init_file.exists():
            return
        content = init_file.read_text(encoding="utf-8")
        if "os.symlink" not in content:
            return
        patched = content.replace(
            "os.symlink(full_cb_path, build_path)",
            "shutil.copy2(full_cb_path, build_path)",
        )
        patched = patched.replace(
            "os.symlink(full_cb_path, full_build_path)",
            "shutil.copy2(full_cb_path, full_build_path)",
        )
        if "import shutil" not in patched:
            patched = patched.replace("import os", "import os\nimport shutil", 1)
        init_file.write_text(patched, encoding="utf-8")
    except Exception:
        pass  # Non-critical; Whoogle will still work with a warning


def is_whoogle_running() -> bool:
    """Check if the Whoogle server is running and responsive."""
    try:
        import requests
        resp = requests.get(
            f"http://{WHOOGLE_HOST}:{WHOOGLE_PORT}/",
            timeout=2
        )
        return resp.status_code == 200
    except Exception:
        return False


def start_whoogle(wait_seconds: int = 8) -> bool:
    """
    Start the Whoogle search server as a background process.

    Returns True if the server started and responded within wait_seconds.
    """
    _patch_whoogle_symlinks()

    try:
        proc = subprocess.Popen(
            [
                sys.executable, "-m", "app.routes",
                "--port", str(WHOOGLE_PORT),
                "--host", WHOOGLE_HOST,
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0,
        )
    except Exception:
        return False

    # Wait for the server to become responsive
    for _ in range(wait_seconds * 2):
        time.sleep(0.5)
        if is_whoogle_running():
            return True

    # Server did not start in time
    try:
        proc.terminate()
    except Exception:
        pass
    return False


def search_papers_google(query: str, max_results: int = 10) -> list[dict]:
    """
    Search for PDF research documents using Google via Whoogle.

    Supports "filetype:pdf" and all Google search operators natively.

    Args:
        query: Search query (e.g. "Equity Research AAPL filetype:pdf")
        max_results: Max results to return (1-20)

    Returns:
        List of dicts with title, url, snippet, source keys.

    Raises:
        Exception: If Whoogle cannot be started or the search fails.
    """
    import requests

    if not is_whoogle_running():
        started = start_whoogle()
        if not started:
            raise Exception(
                "Google search (Whoogle) is not available. "
                "Start it manually with: whoogle-search --port 5000"
            )

    capped_results = min(max(max_results, 1), 30)

    try:
        resp = requests.get(
            WHOOGLE_URL,
            params={"q": query, "format": "json"},
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
    except Exception as exc:
        raise Exception(f"Google search failed: {exc}") from exc

    raw_results = data.get("results") or []
    formatted = []
    for item in raw_results[:capped_results]:
        url = (item.get("href") or "").strip()
        if not url:
            continue
        formatted.append({
            "title": (item.get("title") or "").strip(),
            "url": url,
            "snippet": (item.get("content") or item.get("text") or "").strip(),
            "source": "google",
        })

    return formatted


# ── Ticker Convenience ─────────────────────────────────────────────────────────

def search_papers_for_ticker(
    ticker: str,
    company_name: str = "",
    topic: str = "Market Research",
    max_results: int = 8,
    source: str = "duckduckgo",
) -> list[dict]:
    """
    Convenience function: search for PDF research papers about a stock ticker.

    Args:
        ticker: Stock ticker symbol (e.g. "AAPL")
        company_name: Full company name (uses ticker if empty)
        topic: Research category (e.g. "Equity Research")
        max_results: Max results to return
        source: "duckduckgo" (default) or "google"

    Returns:
        Same format as search_papers() / search_papers_google()
    """
    name = company_name or ticker
    query = f"{topic} {name}"

    if source == "google":
        return search_papers_google(query + " filetype:pdf", max_results=max_results)

    return search_papers(query, max_results=max_results)


if __name__ == "__main__":
    import json
    print("=== DuckDuckGo ===")
    r = search_papers("Equity Research Apple", max_results=3)
    print(json.dumps(r, indent=2))
    print(f"\n=== Google (Whoogle) ===")
    r = search_papers_google("Equity Research AAPL filetype:pdf", max_results=3)
    print(json.dumps(r, indent=2))
