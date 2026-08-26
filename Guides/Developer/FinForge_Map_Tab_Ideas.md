# FinForge Map Tab Ideas (Industry / Sector Explorer)

This document catalogs the research and design ideas for a new "Map" tab that lets the
user click a stock's Sector or Industry (from search results or the company page) and
open a Map listing every sector/industry, with each group's stocks sorted by market cap
(Finviz-style). Preserved here for future review and implementation.

---

## 1. Feature Goal

- Every stock has a Sector and an Industry.
- User clicks the Sector or Industry of a stock and is taken to the Map tab.
- On the Map tab the user can search and select from all sectors and industries.
- Selecting a sector/industry shows that group's stocks, ordered by market cap (desc).
- Must work for US stocks AND non-US stocks (e.g. Tencent TCEHY, an OTC ADR).

---

## 2. Data Source Options (evaluated 2026-08-13)

### Option A: Local cached metadata only (REJECTED)

- Read `data/metadata/*.json` (full `stock.info` per ticker, includes sector, industry,
  marketCap, longName/shortName, currency, exchange).
- Pros: instant, offline, no API.
- Cons: only covers tickers the user has already fetched/viewed. Not a real universe.

### Option B: finvizfinance Python library (REJECTED)

- `pip install finvizfinance`; `Overview().screener_view()` returns the full Finviz
  screener (sector, industry, market cap).
- Pros: free, no API key, one library call, US coverage.
- Cons: US-only; HTML scraping (brittle if Finviz changes markup); hundreds of requests
  on a full pull; adds a new Python dependency. Raw Finviz requests are blocked
  (verified: redirect to ad/consent page), so the library is required.
- **Verdict:** superseded by the Yahoo sector screeners (Option C) and StockAnalysis (Option D).

### Option C: Yahoo predefined sector screeners (KEEP for US / search chips)

Endpoint (no auth, no crumb):

```
https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=MS_TECHNOLOGY&count=250&offset=0
```

Verified facts:
- 11 predefined sector screeners with canonicalName `MS_*`:
  `MS_BASIC_MATERIALS`, `MS_COMMUNICATION_SERVICES`, `MS_CONSUMER_CYCLICAL`,
  `MS_CONSUMER_DEFENSIVE`, `MS_ENERGY`, `MS_FINANCIAL_SERVICES`, `MS_HEALTHCARE`,
  `MS_INDUSTRIALS`, `MS_REAL_ESTATE`, `MS_TECHNOLOGY`, `MS_UTILITIES`.
- Each is already sorted by `intradaymarketcap` DESC (exactly "ordered by market cap").
- Every quote includes `symbol`, `longName`, `marketCap`, `sector`, `industry`,
  `regularMarketPrice`, `regularMarketChangePercent`, `currency`.
- `count` caps at 250 (500 returns HTTP 400); paginate via `offset`.
- **US ONLY**: criteria hardcode exchange IN (NMS, NYQ, NAS) and price > 5, so OTC
  (PNK) and foreign listings are excluded. No global version exists.
- No auth needed (same host + User-Agent pattern as the existing searchTickerUniverse).

### Option D: StockAnalysis.com global screener (RECOMMENDED for a global map)

- Free, no login, no auth. Global coverage (verified tickers: TSM, ASML, SKHY, AAPL, TSLA,
  JPM, WMT all present; supports non-US exchanges).
- Default view lists ~5,610 US stocks; has a Country filter (defaults to US) and supports
  global exchanges.
- Shows industry + market cap, already sorted by market cap desc.
- Requires HTML scraping (no official API), similar approach to finvizfinance.
- Best free source for "biggest 250-400 worldwide stocks in a specified industry".

### Option E: Yahoo general screener (REJECTED - gated)

- The interactive screener at finance.yahoo.com supports Region/Sector/Industry filters
  and could theoretically cover global markets.
- Requires a `crumb`/CSRF token obtained via a cookie handshake:
  `https://query1.finance.yahoo.com/v1/test/getcrumb` returns 401 without an
  authenticated session (verified).
- Undocumented and fragile. Not reliable for production.

### Option F: Paid providers (FUTURE UPGRADE PATH)

- Polygon, Financial Modeling Prep, or Intrinio for a complete, reliable global universe
  (every listed stock worldwide per industry).
- Only needed if a truly exhaustive global map is ever required. Map UI stays unchanged;
  only the universe fetcher source changes.

---

## 3. Non-US Stocks (e.g. Tencent)

Verified: Yahoo SEARCH returns sector/industry for non-US equities too:
- `TCEHY` (OTC/PNK) -> sector "Communication Services", industry "Internet Content & Information"
- `0700.HK` (Hong Kong) -> same sector/industry
- `63TA.F` (Frankfurt) -> same sector/industry

Implication: search-result chips can work for ANY equity by reading the quote's own
`sector`/`industry` fields (extend searchTickerUniverse to return them), not just US stocks.
And local metadata (auto-saved on company-page load) gives non-US tickers a record for the Map.

---

## 4. Sector / Industry Taxonomy Matching (Yahoo vs StockAnalysis)

Important because search chips come from Yahoo while a StockAnalysis-based Map universe
uses StockAnalysis names.

- INDUSTRIES MATCH EXACTLY (both use GICS industry names). Verified:
  Consumer Electronics, Auto Manufacturers, Banks - Diversified, Discount Stores,
  Semiconductors, Internet Content & Information, Software - Infrastructure,
  Semiconductor Equipment & Materials, Drug Manufacturers - General,
  Insurance - Diversified. No mapping needed for industry.

- SECTORS: mostly match, but 4 Yahoo names differ from StockAnalysis:

| Yahoo | StockAnalysis |
|---|---|
| Consumer Cyclical | Consumer Discretionary |
| Consumer Defensive | Consumer Staples |
| Basic Materials | Materials |
| Financial Services | Financials |

  Identical sectors: Technology, Communication Services, Healthcare, Industrials,
  Energy, Real Estate, Utilities.

- FIX: a small 4-entry sector-name normalization map applied when a Yahoo-sourced chip is
  clicked (Yahoo name -> StockAnalysis name). Stable taxonomy, lives in config/constants.

---

## 5. Recommended Design (hybrid)

1. Universe = StockAnalysis global screener (recommended) OR Yahoo MS_* screeners
   (US) UNION local `data/metadata/*.json` (foreign/OTC tickers the user has seen).
   Cached to `data/yahoo_universe.json` (or equivalent); refresh is manual.
2. Search chips = each search result's own `sector`/`industry` (Yahoo search),
   falling back to the universe index. Works for US and non-US equities.
3. Clicking a chip calls `openMapPage({kind, value}, sourceTicker)`:
   - sector value normalized via the 4-entry map,
   - sourceTicker guaranteed present in the Map list (one-time live info fetch if never cached).
4. Map tab UI: left = search + grouped "Sectors (N)" / "Industries (N)" list; right =
   stock table (rank, ticker, company, market cap, price, change %) sorted by market cap desc.
5. Search-result row renders Sector and Industry chips; clicking a stock still opens the
   company page.

---

## 6. Known Constraints / Notes

- No free source gives a complete global universe. Foreign stocks appear in the Map only
  if they are in the chosen universe (StockAnalysis global) or in local metadata.
- Yahoo MS_* screeners are US-only and sorted server-side by intraday market cap.
- Yahoo general screener is crumb-gated (401 without session) - avoid.
- finvizfinance and StockAnalysis both require HTML scraping (brittle, no SLA).
- refresh cadence: manual for now; optional auto-refresh if cache older than 24h.
- Sector-name normalization table must be applied when mixing Yahoo chips with a
  StockAnalysis-based Map.
