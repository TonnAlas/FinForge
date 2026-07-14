# Alternative Research Search Ideas

This document catalogs additional approaches to programmatic research paper/PDF search for FinForge, beyond the currently implemented DuckDuckGo solution. These ideas are preserved for future review and potential implementation.

---

## 1. arXiv API (Academic Papers)

**Project:** [lukasschwab/arxiv.py](https://github.com/lukasschwab/arxiv.py)
**Package:** `pip install arxiv`
**Cost:** Free, no API key required

arXiv has a dedicated **Quantitative Finance (q-fin)** category that covers portfolio theory, asset pricing, market microstructure, and more.

```python
import arxiv

search = arxiv.Search(
    query="market research portfolio optimization",
    max_results=10
)
for paper in arxiv.Client().results(search):
    print(paper.title, paper.pdf_url)  # Direct PDF link!
```

**Pros:** All results have direct PDF links. Completely free. Well-maintained Python library.
**Cons:** Only arXiv-hosted papers. More academic than practical finance.

---

## 2. Semantic Scholar API (Academic Papers)

**Website:** [semanticscholar.org/product/api](https://www.semanticscholar.org/product/api)
**Cost:** Free, no API key required

Semantic Scholar indexes millions of academic papers across all disciplines, including finance and economics. It provides structured metadata, citation counts, and open-access PDF links.

```python
import requests

url = "https://api.semanticscholar.org/graph/v1/paper/search"
params = {
    "query": "equity research valuation",
    "limit": 10,
    "fields": "title,url,publicationDate,authors,openAccessPdf"
}
response = requests.get(url, params=params).json()
for paper in response.get("data", []):
    pdf = paper.get("openAccessPdf", {})
    if pdf:
        print(paper["title"], pdf["url"])  # PDF link!
```

**Pros:** Free, generous rate limits, structured data with PDF links.
**Cons:** Academic focus -- less broker/industry research.

---

## 3. SEC EDGAR via edgartools (Company Filings)

**Project:** [dgunning/edgartools](https://github.com/dgunning/edgartools)
**Package:** `pip install edgartools`
**Cost:** Free, no API key required

For stock-specific research, this is the best option. It returns actual company filings (10-K, 10-Q, annual reports, insider filings) as structured data.

```python
from edgar import Company

# Get Apple's latest 10-K (annual report) -- all available as text/HTML
company = Company("AAPL")
filing = company.get_filings(form="10-K").latest()
print(filing.text())  # Full filing text

# Or get insider filings
insider = company.get_filings(form="4").latest()
print(insider.obj())
```

**Pros:** Real company financial data. Free. No API key. Structured data (XBRL).
**Cons:** Only SEC filings -- not general research papers.

---

## 4. scholarly (Google Scholar)

**Project:** [scholarly-python-package/scholarly](https://github.com/scholarly-python-package/scholarly)
**Package:** `pip install scholarly`
**Cost:** Free, but requires proxies for heavy use

Directly queries Google Scholar for academic publications.

```python
from scholarly import scholarly

search_query = scholarly.search_pubs('Market Research Apple Inc.')
paper = next(search_query)
print(paper['bib']['title'])
print(paper['eprint_url'])  # PDF link if available
```

**Pros:** Access to Google Scholar's massive index.
**Cons:** Google blocks aggressive usage -- requires proxy configuration. May return CAPTCHAs. Not reliable for production use.

---

## 5. SerpAPI (Google Search Results)

**Website:** [serpapi.com](https://serpapi.com/)
**Cost:** Paid -- $50/month for 5,000 searches

Returns exact Google search results (including PDFs) as structured JSON. This is the closest replacement for what the old code did (opening Google in browser).

```python
from serpapi import GoogleSearch

params = {
    "q": "Equity Research Apple Inc. filetype:pdf",
    "api_key": "YOUR_API_KEY"
}
search = GoogleSearch(params)
results = search.get_dict()
for result in results.get("organic_results", []):
    print(result["title"], result["link"])
```

**Pros:** Exact Google results. Supports `filetype:pdf`. Structured JSON.
**Cons:** Paid. Monthly subscription.

---

## 6. Google Custom Search API

**Website:** [developers.google.com/custom-search](https://developers.google.com/custom-search)
**Cost:** Free tier: 100 queries/day. Paid: $5 per 1,000 queries.

Official Google API for searching the web. Must be configured with a search engine ID that searches the entire web.

```python
import requests

url = "https://www.googleapis.com/customsearch/v1"
params = {
    "q": "Equity Research Apple filetype:pdf",
    "cx": "YOUR_SEARCH_ENGINE_ID",
    "key": "YOUR_API_KEY"
}
response = requests.get(url, params=params).json()
```

**Pros:** Official Google API. Supports `filetype:pdf`.
**Cons:** Paid after free tier. Requires Google Cloud setup.

---

## 7. Bing Web Search API

**Website:** [azure.microsoft.com/products/cognitive-services/bing-web-search-api](https://azure.microsoft.com/en-us/products/cognitive-services/bing-web-search-api/)
**Cost:** Free tier: 1,000 calls/month. Paid: ~$7 per 1,000 calls.

Microsoft's web search API. Supports `filetype:pdf` and returns real web results.

```python
import requests

url = "https://api.bing.microsoft.com/v7.0/search"
headers = {"Ocp-Apim-Subscription-Key": "YOUR_KEY"}
params = {"q": "Equity Research Apple filetype:pdf", "count": 10}
response = requests.get(url, headers=headers, params=params).json()
```

**Pros:** Real web search results. Has free tier.
**Cons:** Requires Azure subscription. Paid after free tier.

---

## 8. CrossRef API (Scholarly DOIs)

**Website:** [api.crossref.org](https://api.crossref.org/)
**Cost:** Free, no API key required

CrossRef provides metadata for millions of scholarly publications with DOIs. Good for finding academic finance papers.

```python
import requests

url = "https://api.crossref.org/works"
params = {
    "query": "market research finance",
    "rows": 10,
    "filter": "type:journal-article"
}
response = requests.get(url, params=params).json()
```

**Pros:** Free. Large index. Rich metadata.
**Cons:** Not all results have PDF links. Academic focus.

---

## 9. SearXNG -- Self-Hosted Metasearch Engine

**Project:** [searxng/searxng](https://github.com/searxng/searxng)
**Setup:** Docker: `docker run -d -p 8888:8080 searxng/searxng`
**Cost:** Free (self-hosted)

A self-hosted metasearch engine that can query Google, Bing, DuckDuckGo, and 70+ other engines through a single API. Supports `filetype:pdf` when using the Google engine.

```python
import requests

response = requests.get("http://localhost:8888/search", params={
    "q": "Equity Research AAPL filetype:pdf",
    "format": "json",
    "engines": ["google"]
})

for r in response.json().get("results", []):
    print(r["title"], r["url"])
```

**Pros:** Free. Supports `filetype:pdf`. 70+ engines. No API keys. Result deduplication across engines.
**Cons:** Requires Docker. Heavier than Whoogle (~200MB). Needs YAML configuration for optimal setup.

---

## 10. Whoogle Search -- Google Proxy (Implemented)

**Project:** [benbusby/whoogle-search](https://github.com/benbusby/whoogle-search)
**Setup:** `pip install whoogle-search` then `whoogle-search --port 5000`
**Cost:** Free (self-hosted)

A lightweight, purpose-built Google search proxy. Runs as a Flask app, fetches Google results server-side, and returns them as JSON. Supports `filetype:pdf` and all Google search operators natively.

**This has been implemented as the Google search source in FinForge.**

```python
import requests

response = requests.get("http://localhost:5000/search", params={
    "q": "Equity Research AAPL filetype:pdf",
    "format": "json"
})

for r in response.json().get("results", []):
    print(r["title"], r["url"])
```

**Pros:**
- Free, no API keys
- Supports `filetype:pdf` and all Google operators
- Lightweight single-purpose Flask app (~80MB)
- Built-in JSON API endpoint

**Cons:**
- Must be running as a background process
- Windows requires a one-time symlink patch (handled automatically by the FinForge module)

---

## 11. DuckDuckGo (Current Implementation)

**Package:** `pip install ddgs`
**Cost:** Free, no API key required

**This is the default/fallback search source in FinForge.** Uses the `ddgs` Python library to search DuckDuckGo programmatically.

```python
from ddgs import DDGS

with DDGS() as ddgs:
    results = list(ddgs.text("Equity Research AAPL", max_results=10))
    for r in results:
        print(r["title"], r["href"])
```

**Pros:** Free. No API key. Works out of the box. No server needed.
**Cons:** No `filetype:pdf` filter. Rate limits unknown. Results include non-PDF content.

---

## Recommendation Summary

| Approach | Cost | PDF Links | Finance-Relevant | Effort to Integrate |
|---|---|---|---|---|
| DuckDuckGo (current) | Free | Some | Good | Already done |
| **Whoogle (Google)** | **Free** | **Yes** | **Excellent** | **Done (needs server)** |
| SearXNG | Free | Yes | Excellent | Medium (Docker) |
| arXiv | Free | Yes | Medium (q-fin) | Low |
| Semantic Scholar | Free | Some | Medium | Low |
| edgartools (SEC) | Free | Yes | Excellent | Low |
| scholarly | Free* | Some | Good | Medium (*needs proxies) |
| SerpAPI | Paid | Yes | Excellent | Low |
| Google CSE | Paid | Yes | Excellent | Low |
| Bing API | Paid | Yes | Excellent | Low |
| CrossRef | Free | Few | Low | Low |

**Current setup:** DuckDuckGo (default, no server needed) + Whoogle (optional, gives real Google results with `filetype:pdf`). Start Whoogle with `whoogle-search --port 5000` before using Google search mode.
