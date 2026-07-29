const catalogList = document.getElementById('catalog-list');
const importButton = document.getElementById('import-button');
const importSearchInput = document.getElementById('import-search-input');
const importSearchResults = document.getElementById('import-search-results');
const importSearchCount = document.getElementById('import-search-count');
const importSearchStatus = document.getElementById('import-search-status');
const importSearchClearButton = document.getElementById('import-search-clear');
const importSelectedList = document.getElementById('import-selected-list');
const importSelectedCount = document.getElementById('import-selected-count');
const importClearButton = document.getElementById('import-clear-button');
const importFetchAllButton = document.getElementById('import-fetch-all-button');
const breadcrumbBar = document.getElementById('breadcrumb-bar');
const companyPage = document.getElementById('company-page');
const selectedList = document.getElementById('selected-list');
const searchInput = document.getElementById('search-input');
const saveButton = document.getElementById('save-button');
const refreshButton = document.getElementById('refresh-button');
const settingsStatus = document.getElementById('settings-status');
const catalogCount = document.getElementById('catalog-count');
const selectedCount = document.getElementById('selected-count');
const selectedTitle = document.getElementById('selected-title');
const displayMode = document.getElementById('display-mode');
const displayDivisor = document.getElementById('display-divisor');
const selectedSearchInput = document.getElementById('selected-search-input');
const ratioCount = document.getElementById('ratio-count');
const ratioNameInput = document.getElementById('ratio-name');
const ratioFormulaInput = document.getElementById('ratio-formula');
const ratioFormulaHighlight = document.getElementById('ratio-formula-highlight');
const ratioNotesInput = document.getElementById('ratio-notes');
const ratioRowInput = document.getElementById('ratio-row');
const ratioPreview = document.getElementById('ratio-preview');
const ratioSaveButton = document.getElementById('ratio-save-button');
const ratioResetButton = document.getElementById('ratio-reset-button');
const ratioCancelButton = document.getElementById('ratio-cancel-button');
const ratioEditorState = document.getElementById('ratio-editor-state');
const ratioSearchInput = document.getElementById('ratio-search-input');
const ratioList = document.getElementById('ratio-list');
const sheetRatioList = document.getElementById('sheet-ratio-list');
const ratioResultsCount = document.getElementById('ratio-results-count');
const ratioRefreshButton = document.getElementById('ratio-refresh-button');
const ratioCreateButton = document.getElementById('ratio-create-button');
const ratioListBackButton = document.getElementById('ratio-list-back-button');
const ratioListView = document.getElementById('ratio-list-view');
const ratioMakerView = document.getElementById('ratio-maker-view');
const ratioCountMaker = document.getElementById('ratio-count-maker');
const ratioTokenButtons = Array.from(document.querySelectorAll('.ratio-token'));
const ratioPrefixButtons = Array.from(document.querySelectorAll('.ratio-prefix'));
const ratioLinePanel = document.getElementById('ratio-line-panel');
const ratioLinePanelToken = document.getElementById('ratio-line-panel-token');
const ratioLinePanelSearch = document.getElementById('ratio-line-panel-search');
const ratioLinePanelList = document.getElementById('ratio-line-panel-list');
const ratioLinePanelClose = document.getElementById('ratio-line-panel-close');
const ratioLinePanelSubtitle = document.getElementById('ratio-line-panel-subtitle');
const ratioModePanel = document.getElementById('ratio-mode-panel');
const ratioModePanelToken = document.getElementById('ratio-mode-panel-token');
const ratioModePanelList = document.getElementById('ratio-mode-panel-list');
const ratioModePanelClose = document.getElementById('ratio-mode-panel-close');
const ratioModePanelSubtitle = document.getElementById('ratio-mode-panel-subtitle');
const ratioModeSubOptions = document.getElementById('ratio-mode-sub-options');
const ratioModeSubOptionsContent = document.getElementById('ratio-mode-sub-options-content');
const ratioModeSubOptionsTitle = document.getElementById('ratio-mode-sub-options-title');
const ratioFieldPicker = document.getElementById('ratio-field-picker');
const ratioFieldPickerTitle = document.getElementById('ratio-field-picker-title');
const ratioFieldPickerSubtitle = document.getElementById('ratio-field-picker-subtitle');
const ratioFieldPickerSearch = document.getElementById('ratio-field-picker-search');
const ratioFieldPickerList = document.getElementById('ratio-field-picker-list');
const ratioFieldPickerClose = document.getElementById('ratio-field-picker-close');
const scopeButtons = Array.from(document.querySelectorAll('.scope-button'));
const navButtons = Array.from(document.querySelectorAll('.nav-link'));
const pageSections = Array.from(document.querySelectorAll('.page-section'));

const priceFields = [
  'Open Price',
  'High Price',
  'Low Price',
  'Close Price',
  'Previous Close',
  'Volume',
  'Dividends',
  'Stock Splits',
  'Change Percent',
];

const scopeLabels = {
  balanceSheet: 'Balance sheet',
  incomeStatement: 'Income statement',
  cashFlow: 'Cash flow',
};

const scopeKeys = {
  balanceSheet: 'balanceSheet',
  incomeStatement: 'incomeStatement',
  cashFlow: 'cashFlow',
};

const state = {
  page: 'search',
  selectedCompany: { ticker: '', companyName: '' },
  companyProfile: null,
  companyProfileLoading: false,
  companyProfileError: '',
  companyProfileRequestId: 0,
  companyView: 'overview',
  scope: 'balanceSheet',
  search: '',
  selectedSearch: '',
  importList: [],
  tickerDataStatus: {},   // ticker -> 'checking' | 'fetching' | 'ready' | 'error'
  tickerDataTimestamps: {}, // ticker -> ISO timestamp of last fetch
  importSearch: '',
  importSearchResults: [],
  importSearchLoading: false,
  importSearchStatus: 'Type a ticker or company name to search',
  importSearchRequestId: 0,
  catalog: loadEmbeddedCatalogFallback(),
  ratios: {},
  sheetRatios: [],    // Ratio names currently in Column A of the Ratios sheet
  ratioSearch: '',
  selectedRatioName: '',
  ratioEditorMode: 'create',
  ratioEditorOriginalName: '',
  ratioWorkspaceView: 'list',
  ratioFieldPicker: {
    open: false,
    prefix: '',
    insertAt: 0,
    kind: '',
    search: '',
    selectedMode: 'latest',
  },
  ratioLinePanel: {
    open: false,
    kind: '',
    insertAt: 0,
    search: '',
    selectedLine: '',
  },
  ratioModePanel: {
    open: false,
    token: '',
    kind: '',
    insertAt: 0,
    selectedMode: '',
    tokenValue: '',
  },
  researchResults: [],
  researchLoading: false,
  researchError: '',
  researchActiveTopic: '',
  researchStatus: '',
  settings: {
    mode: 'balanceSheet',
    display: { mode: 'millions', divisor: 1000000 },
    balanceSheet: { selected: [] },
    incomeStatement: { selected: [] },
    cashFlow: { selected: [] },
  },
  lastSavedSnapshot: '',
  isDirty: false,
};

let importSearchDebounceTimer = null;

function renderBreadcrumbs() {
  if (!breadcrumbBar) {
    return;
  }

  const trail = state.page === 'home'
    ? [
        { label: 'General', page: 'home', active: false },
        { label: 'Home', page: 'home', active: true },
      ]
    : state.page === 'search'
      ? [
          { label: 'General', page: 'search', active: false },
          { label: 'Search', page: 'search', active: true },
        ]
    : state.page === 'templates'
      ? [
          { label: 'General', page: 'templates', active: false },
          { label: 'Templates', page: 'templates', active: true },
        ]
    : state.page === 'settings'
      ? [
          { label: 'General', page: 'settings', active: false },
          { label: 'Settings', page: 'settings', active: true },
        ]
    : state.page === 'company'
      ? [
          { label: 'General', page: 'search', active: false },
          { label: 'Search', page: 'search', active: false },
          { label: state.selectedCompany.companyName || state.selectedCompany.ticker || 'Company', page: 'company', active: true },
        ]
    : state.page === 'ratios'
    ? state.ratioWorkspaceView === 'maker'
      ? [
          { label: 'Data', page: 'import', active: false },
          { label: 'Ratios', page: 'ratios', active: false },
          { label: 'Create a ratio', page: 'ratios', active: true },
        ]
      : [
          { label: 'Data', page: 'import', active: false },
          { label: 'Ratios', page: 'ratios', active: true },
        ]
    : [
        { label: 'Data', page: 'import', active: false },
        { label: 'Statements Lines', page: 'import', active: true },
      ];

  breadcrumbBar.innerHTML = trail.map((crumb, index) => {
    const textClass = crumb.active
      ? 'text-primary'
      : 'text-on-surface-variant hover:text-primary cursor-pointer transition-colors';
    const buttonAttributes = crumb.active ? 'type="button" aria-current="page"' : `type="button" data-page="${crumb.page}"`;
    const separator = index < trail.length - 1
      ? '<span class="material-symbols-outlined text-[12px] opacity-40">chevron_right</span>'
      : '';

    return `
      <button ${buttonAttributes} class="${textClass}">${crumb.label}</button>
      ${separator}
    `;
  }).join('');
}

function setActivePage(pageName) {
  state.page = pageName === 'import-list' ? 'search' : pageName === 'import' ? 'import' : pageName === 'templates' ? 'templates' : pageName === 'settings' ? 'settings' : pageName;

  navButtons.forEach((button) => {
    const isActive = button.dataset.page === state.page;
    button.classList.toggle('bg-primary/10', isActive);
    button.classList.toggle('text-primary', isActive);
    button.classList.toggle('border-l-2', isActive);
    button.classList.toggle('border-primary', isActive);
    button.classList.toggle('text-on-surface-variant', !isActive);
    button.classList.toggle('hover:bg-surface-container-high', !isActive);
  });

  pageSections.forEach((section) => {
    section.classList.toggle('hidden', section.dataset.page !== state.page);
  });

  if (state.page === 'ratios') {
    setRatioWorkspaceView('list');
  }

  if (state.page === 'templates') {
    renderTemplateList();
  }

  renderBreadcrumbs();
}

function setRatioWorkspaceView(viewName) {
  state.ratioWorkspaceView = viewName === 'maker' ? 'maker' : 'list';
  ratioListView.classList.toggle('hidden', state.ratioWorkspaceView !== 'list');
  ratioMakerView.classList.toggle('hidden', state.ratioWorkspaceView !== 'maker');
  ratioListBackButton.classList.toggle('hidden', state.ratioWorkspaceView !== 'maker');
  ratioCreateButton.classList.toggle('hidden', state.ratioWorkspaceView !== 'list');
  renderBreadcrumbs();
}

function snapshotSettings() {
  return JSON.stringify({
    mode: state.scope,
    display: {
      mode: String(displayMode.value || 'millions'),
      divisor: Number(displayDivisor.value) || 1,
    },
    balanceSheet: { selected: [...state.settings.balanceSheet.selected] },
    incomeStatement: { selected: [...state.settings.incomeStatement.selected] },
    cashFlow: { selected: [...state.settings.cashFlow.selected] },
  });
}

function updateSaveStatus(isSaved) {
  if (isSaved) {
    settingsStatus.innerHTML = `
      <span class="w-1.5 h-1.5 bg-secondary rounded-full"></span>
      <span class="text-[9px] font-bold text-secondary uppercase mono">Saved</span>
    `;
    return;
  }

  settingsStatus.innerHTML = `
    <span class="w-1.5 h-1.5 bg-error rounded-full"></span>
    <span class="text-[9px] font-bold text-error uppercase mono">Changes made</span>
  `;
}

function syncDirtyState() {
  const currentSnapshot = snapshotSettings();
  state.isDirty = currentSnapshot !== state.lastSavedSnapshot;
  updateSaveStatus(!state.isDirty);
}

function setStatus(message, tone = 'success') {
  const colorClass = tone === 'error' ? 'bg-error' : tone === 'warning' ? 'bg-error' : 'bg-secondary';
  const textClass = tone === 'error' ? 'text-error' : tone === 'warning' ? 'text-error' : 'text-secondary';
  settingsStatus.innerHTML = `
    <span class="w-1.5 h-1.5 ${colorClass} rounded-full"></span>
    <span class="text-[9px] font-bold ${textClass} uppercase mono">${message}</span>
  `;
}

function normalizeSettings(settings) {
  const nextSettings = settings && typeof settings === 'object' ? settings : {};
  return {
    mode: nextSettings.mode === 'incomeStatement' ? 'incomeStatement' : nextSettings.mode === 'cashFlow' ? 'cashFlow' : 'balanceSheet',
    display: {
      mode: nextSettings.display && typeof nextSettings.display === 'object' ? String(nextSettings.display.mode || 'millions') : 'millions',
      divisor: nextSettings.display && typeof nextSettings.display.divisor !== 'undefined' ? Number(nextSettings.display.divisor) || 1000000 : 1000000,
    },
    balanceSheet: {
      selected: Array.isArray(nextSettings.balanceSheet && nextSettings.balanceSheet.selected) ? nextSettings.balanceSheet.selected.map(String) : [],
    },
    incomeStatement: {
      selected: Array.isArray(nextSettings.incomeStatement && nextSettings.incomeStatement.selected) ? nextSettings.incomeStatement.selected.map(String) : [],
    },
    cashFlow: {
      selected: Array.isArray(nextSettings.cashFlow && nextSettings.cashFlow.selected) ? nextSettings.cashFlow.selected.map(String) : [],
    },
  };
}

function normalizeImportTickers(tickers) {
  const nextTickers = Array.isArray(tickers) ? tickers : [];
  return Array.from(new Set(nextTickers.map((ticker) => String(ticker || '').trim().toUpperCase()).filter(Boolean)));
}

function isImportedTicker(ticker) {
  const normalizedTicker = String(ticker || '').trim().toUpperCase();
  return normalizedTicker ? state.importList.includes(normalizedTicker) : false;
}

function renderImportSearchResults() {
  if (!importSearchResults || !importSearchCount || !importSearchStatus || !importSelectedList || !importSelectedCount) {
    return;
  }

  const query = state.importSearch.trim();
  const selectedTickers = new Set(state.importList);

  importSearchCount.textContent = state.importSearchLoading ? 'Searching...' : `${state.importSearchResults.length} results`;
  importSelectedCount.textContent = `${state.importList.length} tickers`;

  if (!query) {
    importSearchStatus.textContent = 'Type a ticker or company name to search';
    importSearchResults.innerHTML = '';
  } else if (state.importSearchLoading) {
    importSearchStatus.textContent = `Searching ${query.toUpperCase()}...`;
    importSearchResults.innerHTML = '<div class="px-md py-3 text-[10px] text-outline mono uppercase">Loading results...</div>';
  } else {
    importSearchStatus.textContent = state.importSearchStatus;

    if (!state.importSearchResults.length) {
      importSearchResults.innerHTML = '<div class="px-md py-3 text-[10px] text-outline mono uppercase">No matching tickers found</div>';
    } else {
      importSearchResults.innerHTML = state.importSearchResults.map((result) => {
        const alreadySaved = selectedTickers.has(result.ticker);
        return `
          <div class="px-md py-2 flex items-start justify-between gap-sm hover:bg-surface-container-high/40 transition-colors cursor-pointer" data-company-open="${escapeHtml(result.ticker)}" data-company-name="${escapeHtml(result.companyName || result.ticker)}">
            <div class="min-w-0">
              <div class="font-label-md text-label-md text-on-surface mono">${escapeHtml(result.ticker)}</div>
              <div class="text-[10px] text-outline break-words">${escapeHtml(result.companyName || result.ticker)}</div>
            </div>
            <button class="px-2 py-[2px] border border-outline-variant bg-surface-container-high font-label-md text-label-md hover:border-primary transition-colors ${alreadySaved ? 'opacity-50 cursor-not-allowed' : ''}" data-import-add="${escapeHtml(result.ticker)}" ${alreadySaved ? 'disabled' : ''}>${alreadySaved ? 'Added' : 'Add'}</button>
          </div>
        `;
      }).join('');
    }
  }

  importSelectedList.innerHTML = state.importList.length
    ? state.importList.map((ticker) => {
        const status = state.tickerDataStatus[ticker];
        let statusHtml;
        if (status === 'fetching') {
          statusHtml = '<span class="inline-flex items-center gap-1 text-[10px] text-primary uppercase mono"><span class="inline-block w-2.5 h-2.5 rounded-full border-2 border-primary border-t-transparent animate-spin"></span> Fetching data...</span>';
        } else if (status === 'ready') {
          statusHtml = '<span class="inline-flex items-center gap-1 text-[10px] text-secondary uppercase mono"><span class="material-symbols-outlined text-[12px]">check_circle</span> Data ready</span>';
        } else if (status === 'error') {
          statusHtml = '<span class="inline-flex items-center gap-1 text-[10px] text-error uppercase mono">Fetch failed</span>';
        } else if (status === 'pending') {
          statusHtml = '<span class="text-[10px] text-outline uppercase mono">Pending</span>';
        } else {
          statusHtml = '<span class="text-[10px] text-outline uppercase mono">Queued</span>';
        }
        // Format last fetched timestamp
        const ts = state.tickerDataTimestamps[ticker];
        let lastFetchedHtml = '';
        if (ts) {
          const d = new Date(ts);
          const localStr = d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
          lastFetchedHtml = `<div class="text-[9px] text-outline/60 mt-[1px]">Fetched ${localStr}</div>`;
        }
        const needsRetry = status === 'error' || status === 'pending' || status === 'checking' || !status;
        return `
        <div class="px-md py-2 flex items-center justify-between gap-sm hover:bg-surface-container-high/40 transition-colors cursor-pointer border-b border-outline-variant/25" data-company-open="${escapeHtml(ticker)}" data-company-name="${escapeHtml(ticker)}">
          <div class="min-w-0">
            <div class="font-label-md text-label-md text-on-surface mono">${escapeHtml(ticker)}</div>
            <div class="mt-[2px]">${statusHtml}</div>
            ${lastFetchedHtml}
          </div>
          <div class="flex items-center gap-1 shrink-0">
            ${needsRetry ? `<button class="px-2 py-[2px] border border-outline-variant bg-surface-container-high font-label-md text-label-md hover:border-primary transition-colors text-[10px]" data-import-fetch="${escapeHtml(ticker)}">Fetch data</button>` : `<button class="px-2 py-[2px] border border-outline-variant bg-surface-container-high font-label-md text-label-md hover:border-secondary transition-colors text-[10px]" data-import-refetch="${escapeHtml(ticker)}">Refetch</button>`}
            <button class="px-2 py-[2px] border border-outline-variant bg-surface-container-high font-label-md text-label-md hover:border-error transition-colors" data-import-remove="${escapeHtml(ticker)}">Remove</button>
          </div>
        </div>
      `;
      }).join('')
    : '<div class="px-md py-3 text-[10px] text-outline mono uppercase">No tickers saved yet</div>';
}

function renderImportListPage() {
  renderImportSearchResults();
}

async function saveImportListToDisk() {
  if (!window.finforge || typeof window.finforge.saveImportList !== 'function') {
    throw new Error('Import list save action is unavailable');
  }

  const result = await window.finforge.saveImportList({ tickers: state.importList });
  if (!result || result.ok !== true) {
    throw new Error(result && result.error ? result.error : 'Unknown import list save error');
  }

  state.importList = normalizeImportTickers(result.importList && result.importList.tickers ? result.importList.tickers : state.importList);
  renderImportListPage();
  return true;
}

function addImportTicker(ticker) {
  const normalizedTicker = String(ticker || '').trim().toUpperCase();
  if (!normalizedTicker || isImportedTicker(normalizedTicker)) {
    return false;
  }

  state.importList = [...state.importList, normalizedTicker];
  return true;
}

function removeImportTicker(ticker) {
  const normalizedTicker = String(ticker || '').trim().toUpperCase();
  if (!normalizedTicker) {
    return false;
  }

  const nextImportList = state.importList.filter((item) => item !== normalizedTicker);
  if (nextImportList.length === state.importList.length) {
    return false;
  }

  state.importList = nextImportList;
  return true;
}

// ── Ticker data fetching & status ──

async function fetchTickerData(ticker) {
  if (!window.finforge || typeof window.finforge.fetchTickerData !== 'function') return;

  state.tickerDataStatus[ticker] = 'fetching';
  renderImportListPage();

  try {
    const result = await window.finforge.fetchTickerData(ticker);
    if (result && result.ok) {
      // After fetch completes, check what data actually arrived
      await updateTickerDataStatus(ticker);
    } else {
      state.tickerDataStatus[ticker] = 'error';
      renderImportListPage();
    }
  } catch {
    state.tickerDataStatus[ticker] = 'error';
    renderImportListPage();
  }
}

async function updateTickerDataStatus(ticker) {
  if (!window.finforge || typeof window.finforge.checkTickerDataStatus !== 'function') return;

  try {
    const result = await window.finforge.checkTickerDataStatus(ticker);
    if (result && result.ok) {
      state.tickerDataStatus[ticker] = result.status;  // 'ready' | 'pending'
      if (result.lastFetched) {
        state.tickerDataTimestamps[ticker] = result.lastFetched;
      }
    } else {
      state.tickerDataStatus[ticker] = 'error';
    }
  } catch {
    state.tickerDataStatus[ticker] = 'error';
  }
  renderImportListPage();
}

async function refreshAllTickerStatuses() {
  if (!window.finforge || typeof window.finforge.checkAllTickersDataStatus !== 'function') return;
  if (!state.importList.length) return;

  // Mark all tickers as 'checking' (overrides stale 'error' statuses)
  for (const ticker of state.importList) {
    state.tickerDataStatus[ticker] = 'checking';
  }
  renderImportListPage();

  try {
    const result = await window.finforge.checkAllTickersDataStatus(state.importList);
    if (result && result.ok && result.statuses) {
      for (const [ticker, status] of Object.entries(result.statuses)) {
        state.tickerDataStatus[ticker] = status;
      }
      if (result.timestamps) {
        for (const [ticker, ts] of Object.entries(result.timestamps)) {
          if (ts) state.tickerDataTimestamps[ticker] = ts;
        }
      }
      renderImportListPage();
    }
  } catch {
    // Silently fail — individual tickers stay as 'checking'
  }
}

function fetchAllTickerData() {
  if (!state.importList.length) return;

  const pending = state.importList.filter((t) => state.tickerDataStatus[t] !== 'ready');
  if (!pending.length) {
    setStatus('All ticker data is already fetched', 'success');
    return;
  }

  setStatus(`Fetching data for ${pending.length} ticker(s)...`, 'warning');

  // Fire all fetches in background — each updates its own status independently.
  // Not async, no await: the UI stays fully responsive while fetches run in background.
  for (const ticker of pending) {
    state.tickerDataStatus[ticker] = 'fetching';
  }
  renderImportListPage();
  for (const ticker of pending) {
    fetchTickerData(ticker);
  }
}

function refetchAllTickerData() {
  if (!state.importList.length) return;

  setStatus(`Refetching data for ${state.importList.length} ticker(s)...`, 'warning');

  // Mark all as 'fetching' regardless of current status
  for (const ticker of state.importList) {
    state.tickerDataStatus[ticker] = 'fetching';
  }
  renderImportListPage();
  for (const ticker of state.importList) {
    fetchTickerData(ticker);
  }
}

async function retryFetchTickerData(ticker) {
  if (!ticker) return;
  state.tickerDataStatus[ticker] = 'fetching';
  renderImportListPage();
  void fetchTickerData(ticker);
}

async function queueImportSearch(query) {
  const normalizedQuery = String(query || '').trim();
  state.importSearch = normalizedQuery;

  if (importSearchDebounceTimer) {
    clearTimeout(importSearchDebounceTimer);
  }

  if (!normalizedQuery) {
    state.importSearchResults = [];
    state.importSearchLoading = false;
    state.importSearchStatus = 'Type a ticker or company name to search';
    renderImportListPage();
    return;
  }

  state.importSearchLoading = true;
  state.importSearchStatus = `Searching ${normalizedQuery.toUpperCase()}...`;
  renderImportListPage();

  const requestId = state.importSearchRequestId + 1;
  state.importSearchRequestId = requestId;

  importSearchDebounceTimer = setTimeout(async () => {
    try {
      if (!window.finforge || typeof window.finforge.searchTickerUniverse !== 'function') {
        throw new Error('Ticker search action is unavailable');
      }

      const result = await window.finforge.searchTickerUniverse(normalizedQuery);
      if (requestId !== state.importSearchRequestId) {
        return;
      }

      if (!result || result.ok !== true) {
        throw new Error(result && result.error ? result.error : 'Unknown ticker search error');
      }

      state.importSearchResults = Array.isArray(result.results) ? result.results : [];
      state.importSearchStatus = state.importSearchResults.length ? `Found ${state.importSearchResults.length} matching tickers` : 'No matching tickers found';
    } catch (error) {
      if (requestId !== state.importSearchRequestId) {
        return;
      }

      state.importSearchResults = [];
      state.importSearchStatus = `Search failed: ${error.message || error}`;
    } finally {
      if (requestId === state.importSearchRequestId) {
        state.importSearchLoading = false;
        renderImportListPage();
      }
    }
  }, 220);
}

function loadEmbeddedCatalogFallback() {
  const embeddedCatalogElement = document.getElementById('statement-catalog-data');

  if (!embeddedCatalogElement || !embeddedCatalogElement.textContent) {
    return { balanceSheet: [], incomeStatement: [], cashFlow: [] };
  }

  try {
    const parsed = JSON.parse(embeddedCatalogElement.textContent);
    return {
      balanceSheet: Array.isArray(parsed.balanceSheet) ? parsed.balanceSheet.map(String) : [],
      incomeStatement: Array.isArray(parsed.incomeStatement) ? parsed.incomeStatement.map(String) : [],
      cashFlow: Array.isArray(parsed.cashFlow) ? parsed.cashFlow.map(String) : [],
    };
  } catch (error) {
    return { balanceSheet: [], incomeStatement: [], cashFlow: [] };
  }
}

function normalizeCompanyProfile(profile, ticker = '', companyName = '') {
  const nextProfile = profile && typeof profile === 'object' ? profile : {};
  return {
    ticker: String(nextProfile.ticker || ticker || '').trim().toUpperCase(),
    companyName: String(nextProfile.companyName || companyName || ticker || '').trim(),
    info: nextProfile.info && typeof nextProfile.info === 'object' ? nextProfile.info : {},
    majorHolders: Array.isArray(nextProfile.majorHolders) ? nextProfile.majorHolders : [],
    institutionalHolders: Array.isArray(nextProfile.institutionalHolders) ? nextProfile.institutionalHolders : [],
    mutualFundHolders: Array.isArray(nextProfile.mutualFundHolders) ? nextProfile.mutualFundHolders : [],
    insiderRosterHolders: Array.isArray(nextProfile.insiderRosterHolders) ? nextProfile.insiderRosterHolders : [],
    insiderTransactions: Array.isArray(nextProfile.insiderTransactions) ? nextProfile.insiderTransactions : [],
    earningsEstimate: Array.isArray(nextProfile.earningsEstimate) ? nextProfile.earningsEstimate : [],
    revenueEstimate: Array.isArray(nextProfile.revenueEstimate) ? nextProfile.revenueEstimate : [],
    epsTrend: Array.isArray(nextProfile.epsTrend) ? nextProfile.epsTrend : [],
    growthEstimates: Array.isArray(nextProfile.growthEstimates) ? nextProfile.growthEstimates : [],
    analystPriceTargets: Array.isArray(nextProfile.analystPriceTargets) ? nextProfile.analystPriceTargets : [],
    recommendationsSummary: Array.isArray(nextProfile.recommendationsSummary) ? nextProfile.recommendationsSummary : [],
    fetchedAt: String(nextProfile.fetchedAt || ''),
  };
}

function formatCompactNumber(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return formatGenericValue(value);
  }

  const absoluteValue = Math.abs(numericValue);
  const units = [
    { threshold: 1e12, suffix: 'T' },
    { threshold: 1e9, suffix: 'B' },
    { threshold: 1e6, suffix: 'M' },
    { threshold: 1e3, suffix: 'K' },
  ];

  for (const unit of units) {
    if (absoluteValue >= unit.threshold) {
      return `${(numericValue / unit.threshold).toFixed(2)}${unit.suffix}`;
    }
  }

  // Use user's chosen thousands separator for small numbers
  return formatNumberWithSep(numericValue, 2);
}

function formatCurrencyValue(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return formatGenericValue(value);
  }

  return `$${formatCompactNumber(numericValue)}`;
}

function formatPercentValue(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return formatGenericValue(value);
  }

  const percentValue = Math.abs(numericValue) <= 1 ? numericValue * 100 : numericValue;
  return `${percentValue.toFixed(2)}%`;
}

function formatDateValue(value) {
  if (value === null || typeof value === 'undefined' || value === '') {
    return '—';
  }

  const rawValue = Number(value);
  const date = Number.isFinite(rawValue)
    ? new Date(rawValue < 1e12 ? rawValue * 1000 : rawValue)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return formatGenericValue(value);
  }

  var day = String(date.getDate()).padStart(2, '0');
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var year = date.getFullYear();

  if (formatState.dateFmt === 'us') {
    return month + '/' + day + '/' + year;
  }
  return day + '/' + month + '/' + year;
}

function formatTimeValue(value) {
  if (value === null || typeof value === 'undefined' || value === '') {
    return '—';
  }

  const rawValue = Number(value);
  const date = Number.isFinite(rawValue)
    ? new Date(rawValue < 1e12 ? rawValue * 1000 : rawValue)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return formatGenericValue(value);
  }

  var hours = date.getHours();
  var minutes = String(date.getMinutes()).padStart(2, '0');

  if (formatState.timeFmt === '12h') {
    var ampm = hours >= 12 ? 'PM' : 'AM';
    var h12 = hours % 12 || 12;
    return h12 + ':' + minutes + ' ' + ampm;
  }
  return String(hours).padStart(2, '0') + ':' + minutes;
}

function formatGenericValue(value) {
  if (value === null || typeof value === 'undefined' || value === '') {
    return '—';
  }

  if (Array.isArray(value)) {
    return value.map((item) => formatGenericValue(item)).join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function pickValue(source, keys) {
  if (!source || typeof source !== 'object') {
    return '';
  }

  for (const key of keys) {
    const value = source[key];
    if (value !== null && typeof value !== 'undefined' && value !== '') {
      return value;
    }
  }

  return '';
}

function renderFieldCard(label, value, kind = 'text') {
  if (kind === 'html') {
    return `
      <div class="border border-outline-variant bg-surface-container-lowest px-2 py-2 space-y-1">
        <div class="text-[9px] text-outline uppercase mono">${escapeHtml(label)}</div>
        <div class="text-[11px] text-on-surface mono break-words">${value}</div>
      </div>
    `;
  }

  const formattedValue = kind === 'currency'
    ? formatCurrencyValue(value)
    : kind === 'percent'
      ? formatPercentValue(value)
      : kind === 'date'
        ? formatDateValue(value)
        : kind === 'number'
          ? formatCompactNumber(value)
          : formatGenericValue(value);

  return `
    <div class="border border-outline-variant bg-surface-container-lowest px-2 py-2 space-y-1">
      <div class="text-[9px] text-outline uppercase mono">${escapeHtml(label)}</div>
      <div class="text-[11px] text-on-surface mono break-words">${escapeHtml(formattedValue)}</div>
    </div>
  `;
}

function renderFieldGrid(fields, columnsClass = 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-xs') {
  return `
    <div class="${columnsClass}">
      ${fields.map((field) => renderFieldCard(field.label, field.value, field.kind)).join('')}
    </div>
  `;
}

function formatTableValue(value, kind) {
  // For tables, use full number formatting with separators (not compact B/M/K notation)
  if (kind === 'currency') {
    const num = Number(value);
    if (Number.isFinite(num)) return '$' + formatNumberWithSep(num, 2);
    return formatGenericValue(value);
  }
  if (kind === 'percent') return formatPercentValue(value);
  if (kind === 'number') return formatNumberWithSep(value, 2);
  if (kind === 'date') return formatDateValue(value);
  if (kind === 'time') return formatTimeValue(value);
  // Auto-detect: if no kind given but value looks numeric, use number format
  const num = Number(value);
  if (value !== null && value !== '' && typeof value !== 'boolean' && Number.isFinite(num)) {
    return formatNumberWithSep(num, 2);
  }
  return formatGenericValue(value);
}

function renderTable(rows, columns) {
  if (!rows.length) {
    return '<div class="text-[11px] text-outline-variant mono">No data available.</div>';
  }

  return `
    <div class="overflow-x-auto custom-scrollbar">
      <table class="w-full border-collapse text-[10px] mono">
        <thead>
          <tr class="text-outline uppercase">
            ${columns.map((column) => `<th class="text-left border-b border-outline-variant px-2 py-1 font-normal">${escapeHtml(column.label)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr class="align-top border-b border-outline-variant/40 last:border-b-0">
              ${columns.map((column) => {
                const raw = formatTableValue(row[column.key], column.kind);
                const cell = column.kind === 'html' ? raw : escapeHtml(raw);
                return `<td class="px-2 py-1 text-on-surface-variant">${cell}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function formatTransactionHtml(text) {
  if (!text) {
    return '<span class="text-[#51cf66]">● Acquire</span>';
  }
  const lower = text.toLowerCase();
  if (lower.startsWith('sale')) {
    return `<span class="text-[#ff6b6b]">● Sell</span> <span class="text-on-surface-variant">${escapeHtml(text)}</span>`;
  }
  if (lower.startsWith('stock gift') || lower.startsWith('gift')) {
    return `<span class="text-[#ffd93d]">● Gift</span> <span class="text-on-surface-variant">${escapeHtml(text)}</span>`;
  }
  return `<span class="text-[#51cf66]">● Acquire</span> <span class="text-on-surface-variant">${escapeHtml(text)}</span>`;
}

function normalizeHolderRow(row) {
  const source = row && typeof row === 'object' ? row : {};
  return {
    holder: pickValue(source, ['Holder', 'holder', 'Name', 'name', 'index']),
    shares: pickValue(source, ['Shares', 'shares', 'Number Of Shares', 'numberOfShares', 'shareCount']),
    percentOut: pickValue(source, ['pctHeld', 'Percent Out', 'percentOut', 'Percent', 'percent', 'percent_out']),
    value: pickValue(source, ['Value', 'value', 'Market Value', 'marketValue']),
  };
}

function renderMajorHoldersSummary(rows) {
  if (!rows || !rows.length) {
    return '<div class="text-[11px] text-outline-variant mono">No data available.</div>';
  }

  const labelMap = {
    insidersPercentHeld: 'Insider Ownership',
    institutionsPercentHeld: 'Institutional Ownership',
    institutionsFloatPercentHeld: 'Institutional Float Ownership',
    institutionsCount: 'Number of Institutions',
  };

  const cards = rows.map((row) => {
    const source = row && typeof row === 'object' ? row : {};
    const breakdown = pickValue(source, ['index', 'Breakdown', 'breakdown']);
    const rawValue = pickValue(source, ['Value', 'value']);

    const label = labelMap[breakdown] || breakdown;
    const kind = breakdown === 'institutionsCount' ? 'number' : 'percent';

    return renderFieldCard(label, rawValue, kind);
  });

  return `
    <div class="grid grid-cols-2 gap-xs">
      ${cards.join('')}
    </div>
  `;
}

function normalizeOfficerRow(row) {
  const source = row && typeof row === 'object' ? row : {};
  return {
    name: pickValue(source, ['name', 'Name']),
    title: pickValue(source, ['title', 'Title']),
    age: pickValue(source, ['age', 'Age']),
    yearBorn: pickValue(source, ['yearBorn', 'Year Born']),
    totalPay: pickValue(source, ['totalPay', 'Total Pay']),
    exercisedValue: pickValue(source, ['exercisedValue', 'Exercised Value']),
    unexercisedValue: pickValue(source, ['unexercisedValue', 'Unexercised Value']),
  };
}

function renderCompanyPage() {
  if (!companyPage) {
    return;
  }

  const ticker = state.selectedCompany.ticker || state.companyProfile && state.companyProfile.ticker || '';
  const profile = normalizeCompanyProfile(state.companyProfile, ticker, state.selectedCompany.companyName);
  const info = profile.info || {};

  if (state.companyProfileLoading) {
    companyPage.innerHTML = `
      <div class="border border-outline-variant bg-surface-container-low p-md space-y-sm">
        <div class="text-[9px] uppercase mono text-outline">Company profile</div>
        <div class="text-headline-lg mono text-on-surface">Loading ${escapeHtml(ticker || 'company')}...</div>
        <div class="text-[11px] text-outline-variant mono">Fetching data.</div>
      </div>
    `;
    return;
  }

  if (state.companyProfileError) {
    companyPage.innerHTML = `
      <div class="border border-error bg-surface-container-low p-md space-y-sm">
        <div class="text-[9px] uppercase mono text-error">Company profile</div>
        <div class="text-headline-lg mono text-on-surface">${escapeHtml(ticker || 'Company')}</div>
        <div class="text-[11px] text-error mono break-words">${escapeHtml(state.companyProfileError)}</div>
        <button id="company-retry-button" class="px-2 py-[2px] bg-surface-container-high border border-outline-variant font-label-md text-label-md hover:border-primary transition-colors">Retry</button>
      </div>
    `;

    const retryButton = document.getElementById('company-retry-button');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        void loadSelectedCompanyProfile(ticker, profile.companyName);
      });
    }
    return;
  }

  const metaFields = [
    { label: 'Long name', value: info.longName || profile.companyName || ticker },
    { label: 'Short name', value: info.shortName || '' },
    { label: 'Industry', value: info.industryDisp || info.industry || '' },
    { label: 'Sector', value: info.sectorDisp || info.sector || '' },
    { label: 'Industry key', value: info.industryKey || '' },
    { label: 'Sector key', value: info.sectorKey || '' },
  ];

  const addressStr = [info.address1, info.city, info.state, info.zip, info.country].filter(Boolean).join(', ');
  const mapsUrl = addressStr ? 'https://www.google.com/maps/search/' + encodeURIComponent(addressStr) : '';
  const websiteUrl = info.website || '';

  const locationFields = [
    { label: 'Address', value: addressStr && mapsUrl ? `<a href="#" onclick="event.preventDefault(); window.finforge && window.finforge.openExternalUrl('${mapsUrl.replace(/'/g, "\\'")}'); return false;" class="text-primary underline hover:opacity-80 transition-opacity">${escapeHtml(addressStr)}</a>` : (escapeHtml(addressStr) || ''), kind: 'html' },
    { label: 'Phone', value: info.phone || '' },
    { label: 'Website', value: websiteUrl ? `<a href="#" onclick="event.preventDefault(); window.finforge && window.finforge.openExternalUrl('${websiteUrl.replace(/'/g, "\\'")}'); return false;" class="text-primary underline hover:opacity-80 transition-opacity">${escapeHtml(websiteUrl)}</a>` : '', kind: 'html' },
    { label: 'Employees', value: info.fullTimeEmployees || '', kind: 'number' },
    { label: 'Exchange', value: info.exchange || '' },
    { label: 'Quote type', value: info.quoteType || '' },
  ];

  const shareFields = [
    { label: 'Shares outstanding', value: info.sharesOutstanding || '', kind: 'number' },
    { label: 'Shares float', value: info.sharesFloat || '', kind: 'number' },
    { label: 'Shares short', value: info.sharesShort || '', kind: 'number' },
    { label: 'Short prior month', value: info.sharesShortPriorMonth || '', kind: 'number' },
    { label: 'Short ratio', value: info.shortRatio || '' },
    { label: 'Held by insiders', value: info.heldPercentInsiders || '', kind: 'percent' },
    { label: 'Held by institutions', value: info.heldPercentInstitutions || '', kind: 'percent' },
    { label: 'Market cap', value: info.marketCap || '', kind: 'currency' },
    { label: 'Enterprise value', value: info.enterpriseValue || '', kind: 'currency' },
  ];

  const tradingFields = [
    { label: 'First trade date', value: info.firstTradeDateUtc || '', kind: 'date' },
    { label: 'Exchange timezone', value: info.exchangeTimezoneName || '' },
    { label: 'GMT offset', value: info.gmtOffSetMilliseconds || '', kind: 'number' },
    { label: 'Timezone name', value: info.timeZoneFullName || '' },
    { label: 'Currency', value: info.currency || '' },
    { label: 'Last updated', value: profile.fetchedAt || '', kind: 'date' },
  ];

  const holderTableColumns = [
    { key: 'holder', label: 'Name' },
    { key: 'shares', label: 'Shares', kind: 'number' },
    { key: 'percentOut', label: '% Out', kind: 'percent' },
    { key: 'value', label: 'Value', kind: 'currency' },
  ];

  const officerRows = (Array.isArray(info.companyOfficers) ? info.companyOfficers : []).map(normalizeOfficerRow);

  const activeView = state.companyView || 'overview';

  function viewBtnClass(viewName) {
    const isActive = activeView === viewName;
    return isActive
      ? 'px-2 py-[2px] bg-primary text-on-primary font-bold font-label-md text-label-md hover:opacity-90 transition-opacity'
      : 'px-2 py-[2px] bg-surface-container-high border border-outline-variant font-label-md text-label-md hover:border-primary transition-colors';
  }

  function renderOverviewContent() {
    const officersHtml = officerRows.length
      ? renderTable(officerRows, [
          { key: 'name', label: 'Name' },
          { key: 'title', label: 'Title' },
          { key: 'age', label: 'Age', kind: 'number' },
          { key: 'yearBorn', label: 'Born', kind: 'number' },
          { key: 'totalPay', label: 'Pay', kind: 'currency' },
          { key: 'exercisedValue', label: 'Exercised', kind: 'currency' },
          { key: 'unexercisedValue', label: 'Unexercised', kind: 'currency' },
        ])
      : '<div class="text-[11px] text-outline-variant mono">No officers available.</div>';

    return `
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-sm">
        <section class="border border-outline-variant bg-surface-container-low p-md space-y-sm">
          <div class="text-[9px] uppercase mono text-outline">Metadata &amp; company info</div>
          ${renderFieldGrid(metaFields)}
        </section>
        <section class="border border-outline-variant bg-surface-container-low p-md space-y-sm">
          <div class="text-[9px] uppercase mono text-outline">Location &amp; business</div>
          ${renderFieldGrid(locationFields)}
        </section>
      </div>

      ${info.longBusinessSummary ? `
      <section class="border border-outline-variant bg-surface-container-low p-md space-y-sm">
        <div class="text-[9px] uppercase mono text-outline">Business summary</div>
        <p class="text-[11px] text-on-surface-variant leading-relaxed">${escapeHtml(info.longBusinessSummary)}</p>
      </section>
      ` : ''}

      <section class="border border-outline-variant bg-surface-container-low p-md space-y-sm">
        <div class="text-[9px] uppercase mono text-outline">Corporate officers</div>
        ${officersHtml}
      </section>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-sm">
        <section class="border border-outline-variant bg-surface-container-low p-md space-y-sm">
          <div class="text-[9px] uppercase mono text-outline">Shares &amp; capital structure</div>
          ${renderFieldGrid(shareFields)}
        </section>
        <section class="border border-outline-variant bg-surface-container-low p-md space-y-sm">
          <div class="text-[9px] uppercase mono text-outline">Trading information</div>
          ${renderFieldGrid(tradingFields)}
        </section>
      </div>
    `;
  }

  function renderInsidersContent() {
    const insiderData = Array.isArray(profile.insiderRosterHolders) ? profile.insiderRosterHolders : [];
    const txnData = Array.isArray(profile.insiderTransactions) ? profile.insiderTransactions : [];
    return `
      <div class="space-y-sm">
        <section class="border border-outline-variant bg-surface-container-low p-md space-y-sm">
          <div class="text-[9px] uppercase mono text-outline">Insider roster holders</div>
          ${renderTable(insiderData.map((row) => ({
            name: pickValue(row, ['Name', 'name', 'holder']),
            title: pickValue(row, ['Position', 'position', 'Title', 'title']),
            transaction: pickValue(row, ['Most Recent Transaction', 'mostRecentTransaction', 'Transaction', 'transaction']),
            transactionDate: pickValue(row, ['Latest Transaction Date', 'latestTransactionDate', 'Transaction Date', 'transactionDate']),
            shares: pickValue(row, ['Shares Owned Directly', 'sharesOwnedDirectly', 'Shares', 'shares']),
            positionDate: pickValue(row, ['Position Direct Date', 'positionDirectDate']),
          })), [
            { key: 'name', label: 'Name' },
            { key: 'title', label: 'Title' },
            { key: 'shares', label: 'Shares', kind: 'number' },
            { key: 'transaction', label: 'Transaction' },
            { key: 'transactionDate', label: 'Date', kind: 'date' },
            { key: 'positionDate', label: 'Position Date', kind: 'date' },
          ])}
        </section>
        <section class="border border-outline-variant bg-surface-container-low p-md space-y-sm">
          <div class="text-[9px] uppercase mono text-outline">Insider transactions (${txnData.length})</div>
          <div class="flex items-center gap-sm text-[9px] mono text-outline">
            <span class="text-[#51cf66]">●</span> Acquire &nbsp;
            <span class="text-[#ff6b6b]">●</span> Sell &nbsp;
            <span class="text-[#ffd93d]">●</span> Gift
          </div>
          ${renderTable(txnData.map((row) => {
            const txnText = pickValue(row, ['Text', 'text', 'Transaction', 'transaction']);
            return {
              insider: pickValue(row, ['Insider', 'insider', 'Name', 'name']),
              position: pickValue(row, ['Position', 'position']),
              transaction: formatTransactionHtml(txnText),
              shares: pickValue(row, ['Shares', 'shares']),
              value: pickValue(row, ['Value', 'value']),
              date: pickValue(row, ['Start Date', 'startDate', 'Date', 'date']),
            };
          }), [
            { key: 'insider', label: 'Insider' },
            { key: 'position', label: 'Position' },
            { key: 'transaction', label: 'Type', kind: 'html' },
            { key: 'shares', label: 'Shares', kind: 'number' },
            { key: 'value', label: 'Value', kind: 'currency' },
            { key: 'date', label: 'Date', kind: 'date' },
          ])}
        </section>
      </div>
    `;
  }

  function renderResearchContent() {
    const companyName = escapeHtml(ticker);
    const researchTypes = [
      { label: 'Market Research', query: 'Market Research' },
      { label: 'Equity Research', query: 'Equity Research' },
      { label: 'Valuation Models', query: 'Valuation Models' },
      { label: 'Financial Modeling', query: 'Financial Modeling' },
      { label: 'Portfolio Research', query: 'Portfolio Research' },
      { label: 'Quantitative Research', query: 'Quantitative Research' },
      { label: 'Technical Analysis', query: 'Technical Analysis' },
      { label: 'Alternative Data', query: 'Alternative Data' },
    ];

    var resultsHtml = '';
    if (state.researchLoading) {
      var statusMsg = state.researchStatus ? escapeHtml(state.researchStatus) : 'Searching for research papers...';
      var isWarning = state.researchStatus && state.researchStatus.indexOf('WARNING:') === 0;
      if (isWarning) {
        statusMsg = escapeHtml(state.researchStatus.substring('WARNING:'.length));
      }
      var colorClass = isWarning ? 'text-tertiary' : 'text-outline';
      resultsHtml = '<div class="px-md py-md space-y-sm">' +
        '<div class="w-full h-[3px] bg-outline-variant rounded overflow-hidden">' +
        '<div class="h-full bg-primary rounded progress-bar-animate" style="width:60%"></div>' +
        '</div>' +
        '<div class="text-[11px] mono ' + colorClass + '">' + statusMsg + '</div>' +
        '</div>';
    } else if (state.researchError) {
      resultsHtml = '<div class="text-[11px] text-error mono px-md py-md">' + escapeHtml(state.researchError) + '</div>';
    } else if (state.researchResults.length > 0) {
      resultsHtml = state.researchResults.map(function (r, i) {
        var url = escapeHtml(r.url || '');
        var title = escapeHtml(r.title || 'Untitled');
        var snippet = escapeHtml(r.snippet || '');
        return '<div class="border-b border-outline-variant last:border-b-0 px-md py-sm space-y-1">' +
          '<div class="text-[10px] text-outline mono">' + (i + 1) + '. ' +
          '<a href="' + url + '" target="_blank" class="text-primary hover:underline" ' +
          'onclick="event.preventDefault(); window.finforge.openExternalUrl(\'' + url.replace(/'/g, "\\'") + '\')">' +
          title + '</a></div>' +
          (snippet ? '<div class="text-[10px] text-on-surface-variant mono leading-relaxed">' + snippet + '</div>' : '') +
          '<div class="text-[9px] text-outline mono truncate">' + url + '</div>' +
          '</div>';
      }).join('');
    } else {
      resultsHtml = '<div class="text-[11px] text-outline mono px-md py-md">Click a topic above to search for research papers.</div>';
    }

    return [
      '<div class="space-y-sm">',
      '  <section class="border border-outline-variant bg-surface-container-low p-md space-y-sm">',
      '    <div class="text-[9px] uppercase mono text-outline">Research papers</div>',
      '    <p class="text-[11px] text-on-surface-variant mono">Search for research papers about ' + companyName + ':</p>',
      '    <div class="grid grid-cols-2 sm:grid-cols-4 gap-xs">',
      researchTypes.map(function (type) {
        var isActive = state.researchActiveTopic === type.query;
        var btnClass = isActive
          ? 'research-paper-btn px-2 py-2 bg-primary text-on-primary font-bold border border-primary font-label-md text-label-md text-left transition-colors'
          : 'research-paper-btn px-2 py-2 bg-surface-container-high border border-outline-variant font-label-md text-label-md text-left hover:border-primary transition-colors';
        return '<button class="' + btnClass + '" ' +
          'data-search="' + escapeHtml(type.query + ' ' + ticker) + '">' +
          escapeHtml(type.label) + '</button>';
      }).join(''),
      '    </div>',
      '  </section>',
      '  <section class="border border-outline-variant bg-surface-container-low p-md space-y-sm" id="research-results-section">',
      '    <div class="flex items-center justify-between">',
      '      <div class="text-[9px] uppercase mono text-outline">Results</div>',
      state.researchResults.length > 0
        ? '<div class="text-[9px] text-outline mono">' + state.researchResults.length + ' papers found</div>'
        : '',
      '    </div>',
      '    <div id="research-results-list" class="border border-outline-variant bg-surface-container-high max-h-[400px] overflow-y-auto">',
      resultsHtml,
      '    </div>',
      '  </section>',
      '</div>',
    ].join('\n');
  }

  function renderOwnershipContent() {
    const majorRows = Array.isArray(profile.majorHolders) ? profile.majorHolders : [];
    const instRows = Array.isArray(profile.institutionalHolders) ? profile.institutionalHolders : [];
    const mfRows = Array.isArray(profile.mutualFundHolders) ? profile.mutualFundHolders : [];

    return `
      <div class="space-y-sm">
        <section class="border border-outline-variant bg-surface-container-low p-md space-y-sm">
          <div class="text-[9px] uppercase mono text-outline">Major shareholders</div>
          ${renderMajorHoldersSummary(majorRows)}
        </section>
        <section class="border border-outline-variant bg-surface-container-low p-md space-y-sm">
          <div class="text-[9px] uppercase mono text-outline">Institutional holders</div>
          ${renderTable(instRows.map(normalizeHolderRow), holderTableColumns)}
        </section>
        <section class="border border-outline-variant bg-surface-container-low p-md space-y-sm">
          <div class="text-[9px] uppercase mono text-outline">Mutual fund holders</div>
          ${renderTable(mfRows.map(normalizeHolderRow), holderTableColumns)}
        </section>
      </div>
    `;
  }

  function formatPeriodLabel(period) {
    if (!period || typeof period !== 'string') return period;
    var map = {
      '0q': 'Current Q',
      '+1q': 'Next Q',
      '0y': 'Current Y',
      '+1y': 'Next Y',
      'LTG': 'Long Term',
      '0m': 'Current',
      '-1m': '1m Ago',
      '-2m': '2m Ago',
      '-3m': '3m Ago',
    };
    return map[period] || period;
  }

  function renderEstimatesContent() {
    var estimateColumnDefs = {
      earningsEstimate: [
        { key: 'period', label: 'Period' },
        { key: 'avg', label: 'Avg' },
        { key: 'low', label: 'Low' },
        { key: 'high', label: 'High' },
        { key: 'yearAgoEps', label: 'Year Ago EPS' },
        { key: 'numberOfAnalysts', label: 'Analysts' },
        { key: 'growth', label: 'Growth', kind: 'percent' },
      ],
      revenueEstimate: [
        { key: 'period', label: 'Period' },
        { key: 'avg', label: 'Avg' },
        { key: 'low', label: 'Low' },
        { key: 'high', label: 'High' },
        { key: 'yearAgoRevenue', label: 'Year Ago Revenue' },
        { key: 'numberOfAnalysts', label: 'Analysts' },
        { key: 'growth', label: 'Growth', kind: 'percent' },
      ],
      epsTrend: [
        { key: 'period', label: 'Period' },
        { key: 'current', label: 'Current' },
        { key: '7daysAgo', label: '7 Days Ago' },
        { key: '30daysAgo', label: '30 Days Ago' },
        { key: '60daysAgo', label: '60 Days Ago' },
        { key: '90daysAgo', label: '90 Days Ago' },
      ],
      growthEstimates: [
        { key: 'period', label: 'Period' },
        { key: 'stockTrend', label: 'Stock Trend', kind: 'percent' },
        { key: 'indexTrend', label: 'Index Trend', kind: 'percent' },
      ],
      analystPriceTargets: [
        { key: 'current', label: 'Current' },
        { key: 'high', label: 'High' },
        { key: 'low', label: 'Low' },
        { key: 'mean', label: 'Mean' },
        { key: 'median', label: 'Median' },
      ],
      recommendationsSummary: [
        { key: 'period', label: 'Period' },
        { key: 'strongBuy', label: 'Strong Buy' },
        { key: 'buy', label: 'Buy' },
        { key: 'hold', label: 'Hold' },
        { key: 'sell', label: 'Sell' },
        { key: 'strongSell', label: 'Strong Sell' },
      ],
    };

    var sectionConfig = [
      { title: 'Earnings estimate', dataKey: 'earningsEstimate' },
      { title: 'Revenue estimate', dataKey: 'revenueEstimate' },
      { title: 'EPS trend', dataKey: 'epsTrend' },
      { title: 'Growth estimates', dataKey: 'growthEstimates' },
      { title: 'Analyst price targets', dataKey: 'analystPriceTargets' },
      { title: 'Recommendations summary', dataKey: 'recommendationsSummary' },
    ];

    return `
      <section class="border border-outline-variant bg-surface-container-low p-md space-y-sm">
        <div class="text-[9px] uppercase mono text-outline">Estimates</div>
        <div class="space-y-sm">
          ${sectionConfig.map(function(section) {
            var rows = profile[section.dataKey];
            var cols = estimateColumnDefs[section.dataKey] || [{ key: 'value', label: 'Value' }];
            var data = Array.isArray(rows) ? rows.map(function(row) {
              if (typeof row !== 'object' || row === null) return row;
              var copy = Object.assign({}, row);
              if ('period' in copy) {
                copy.period = formatPeriodLabel(copy.period);
              }
              return copy;
            }) : [];
            return `
            <div class="border border-outline-variant bg-surface-container-lowest p-md space-y-sm">
              <div class="text-[9px] uppercase mono text-outline">${escapeHtml(section.title)}</div>
              ${renderTable(data, cols)}
            </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  function renderViewContent() {
    switch (state.companyView) {
      case 'insiders': return renderInsidersContent();
      case 'research': return renderResearchContent();
      case 'ownership': return renderOwnershipContent();
      case 'estimates': return renderEstimatesContent();
      default: return renderOverviewContent();
    }
  }

  companyPage.innerHTML = `
    <div class="space-y-sm min-h-0">
      <div class="border border-outline-variant bg-surface-container-low p-md space-y-sm">
        <div class="flex items-start justify-between gap-sm">
          <div class="min-w-0 space-y-1">
            <div class="text-[9px] uppercase mono text-outline">Company overview</div>
            <div class="text-headline-lg mono text-on-surface break-words">${escapeHtml(profile.ticker || ticker || 'Company')}</div>
            <div class="text-body-sm text-on-surface-variant break-words">${escapeHtml(profile.companyName || info.longName || info.shortName || 'No company name available')}</div>
          </div>
          <div class="flex items-center gap-xs shrink-0">
            <button id="company-refresh-button" class="px-2 py-[2px] bg-surface-container-high border border-outline-variant font-label-md text-label-md hover:border-primary transition-colors">Refresh</button>
            <button id="company-overview-button" class="${viewBtnClass('overview')}">Overview</button>
            <button id="company-insiders-button" class="${viewBtnClass('insiders')}">Insiders</button>
            <button id="company-research-button" class="${viewBtnClass('research')}">Research</button>
            <button id="company-ownership-button" class="${viewBtnClass('ownership')}">Ownership</button>
            <button id="company-estimates-button" class="${viewBtnClass('estimates')}">Estimates</button>
          </div>
        </div>
        <div class="flex justify-end gap-xs">
          <button id="company-list-toggle-button" class="px-2 py-[2px] bg-surface-container-high border border-outline-variant font-label-md text-label-md hover:border-primary transition-colors">${isImportedTicker(ticker || profile.ticker) ? 'Remove from List' : 'Add to List'}</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-xs">
          ${renderFieldCard('Sector', info.sectorDisp || info.sector || '')}
          ${renderFieldCard('Industry', info.industryDisp || info.industry || '')}
          ${renderFieldCard('Exchange', info.exchange || '')}
          ${renderFieldCard('Currency', info.currency || '')}
        </div>
      </div>

      <div id="company-view-content" class="space-y-sm">
        ${renderViewContent()}
      </div>
    </div>
  `;

  function switchView(viewName) {
    state.companyView = viewName;
    // Clear research results when switching to research view
    if (viewName === 'research') {
      state.researchResults = [];
      state.researchLoading = false;
      state.researchError = '';
      state.researchActiveTopic = '';
      state.researchStatus = '';
    }
    const contentEl = document.getElementById('company-view-content');
    if (contentEl) {
      contentEl.innerHTML = renderViewContent();
      // Re-bind view-specific button events after content swap
      const researchOpenBtn = document.getElementById('company-research-open-button');
      if (researchOpenBtn) {
        researchOpenBtn.addEventListener('click', () => {
          const t = state.selectedCompany.ticker || (state.companyProfile && state.companyProfile.ticker) || '';
          if (t) {
            const url = `https://scholar.google.com/scholar?q=${encodeURIComponent(t + ' stock research')}`;
            if (window.finforge && typeof window.finforge.openExternalUrl === 'function') {
              window.finforge.openExternalUrl(url);
            } else {
              window.open(url, '_blank');
            }
          }
        });
      }
    }
    // Update active button styles
    const viewBtns = ['overview', 'insiders', 'research', 'ownership', 'estimates'];
    for (const v of viewBtns) {
      const btn = document.getElementById('company-' + v + '-button');
      if (btn) {
        const isActive = state.companyView === v;
        btn.className = isActive
          ? 'px-2 py-[2px] bg-primary text-on-primary font-bold font-label-md text-label-md hover:opacity-90 transition-opacity'
          : 'px-2 py-[2px] bg-surface-container-high border border-outline-variant font-label-md text-label-md hover:border-primary transition-colors';
      }
    }

    // Refresh the list toggle button text
    const listBtn = document.getElementById('company-list-toggle-button');
    if (listBtn) {
      const currentTicker = state.selectedCompany.ticker || (state.companyProfile && state.companyProfile.ticker) || '';
      listBtn.textContent = currentTicker && isImportedTicker(currentTicker) ? 'Remove from List' : 'Add to List';
    }
  }

  const refreshButton = document.getElementById('company-refresh-button');
  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      void loadSelectedCompanyProfile(ticker, profile.companyName);
    });
  }

  const overviewButton = document.getElementById('company-overview-button');
  if (overviewButton) {
    overviewButton.addEventListener('click', () => switchView('overview'));
  }

  const insidersButton = document.getElementById('company-insiders-button');
  if (insidersButton) {
    insidersButton.addEventListener('click', () => switchView('insiders'));
  }

  const researchButton = document.getElementById('company-research-button');
  if (researchButton) {
    researchButton.addEventListener('click', () => switchView('research'));
  }

  const ownershipButton = document.getElementById('company-ownership-button');
  if (ownershipButton) {
    ownershipButton.addEventListener('click', () => switchView('ownership'));
  }

  const estimatesButton = document.getElementById('company-estimates-button');
  if (estimatesButton) {
    estimatesButton.addEventListener('click', () => switchView('estimates'));
  }

  const listToggleButton = document.getElementById('company-list-toggle-button');
  if (listToggleButton) {
    listToggleButton.addEventListener('click', async () => {
      const currentTicker = ticker || profile.ticker || '';
      if (!currentTicker) return;

      const wasAdded = !isImportedTicker(currentTicker);
      if (wasAdded) {
        addImportTicker(currentTicker);
      } else {
        removeImportTicker(currentTicker);
      }

      try {
        await saveImportListToDisk();
      } catch (err) {
        console.error('Failed to save import list:', err);
      }

      // Update the button text immediately
      listToggleButton.textContent = isImportedTicker(currentTicker) ? 'Remove from List' : 'Add to List';

      // If we added the ticker, check status silently — no auto-fetch
      if (wasAdded) {
        state.tickerDataStatus[currentTicker] = 'checking';
        renderImportListPage();
        void updateTickerDataStatus(currentTicker);
      }
    });
  }

  const researchOpenButton = document.getElementById('company-research-open-button');
  if (researchOpenButton) {
    researchOpenButton.addEventListener('click', () => {
      const t = state.selectedCompany.ticker || (state.companyProfile && state.companyProfile.ticker) || '';
      if (t) {
        const url = `https://scholar.google.com/scholar?q=${encodeURIComponent(t + ' stock research')}`;
        if (window.finforge && typeof window.finforge.openExternalUrl === 'function') {
          window.finforge.openExternalUrl(url);
        } else {
          window.open(url, '_blank');
        }
      }
    });
  }

  // Research paper search buttons (bound via delegation on the view-content container)
  // Research paper search buttons (bound via delegation on the view-content container)
  const researchContentEl = document.getElementById('company-view-content');
  if (researchContentEl) {
    researchContentEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.research-paper-btn');
      if (btn) {
        var searchQuery = btn.getAttribute('data-search');
        if (searchQuery) {
          // Set active topic and re-render to update button styles
          state.researchActiveTopic = btn.textContent.trim();
          var contentEl = document.getElementById('company-view-content');
          if (contentEl) {
            contentEl.innerHTML = renderResearchContent();
          }
          performResearchSearch(searchQuery);
        }
      }
    });
  }
}

async function performResearchSearch(query) {
  state.researchLoading = true;
  state.researchError = '';
  state.researchResults = [];

  var resultsSection = document.getElementById('research-results-section');
  var resultsList = document.getElementById('research-results-list');
  if (resultsList) {
    resultsList.innerHTML = '<div class="text-[11px] text-outline mono px-md py-md">Searching for research papers...</div>';
  }

  try {
    if (!window.finforge || typeof window.finforge.searchResearchPapers !== 'function') {
      throw new Error('Research search action is unavailable');
    }

    // Listen for progress updates from the main process
    var removeProgressListener = null;
    if (window.finforge && typeof window.finforge.onResearchProgress === 'function') {
      removeProgressListener = window.finforge.onResearchProgress(function (data) {
        if (data && data.status) {
          state.researchStatus = data.status;
          var list = document.getElementById('research-results-list');
          if (list) {
            var isWarning = data.status.indexOf('WARNING:') === 0;
            var statusText = isWarning ? data.status.substring('WARNING:'.length) : data.status;
            var colorClass = isWarning ? 'text-tertiary' : 'text-outline';
            list.innerHTML = '<div class="px-md py-md space-y-sm">' +
              '<div class="w-full h-[3px] bg-outline-variant rounded overflow-hidden">' +
              '<div class="h-full bg-primary rounded progress-bar-animate" style="width:60%"></div>' +
              '</div>' +
              '<div class="text-[11px] mono ' + colorClass + '">' + escapeHtml(statusText) + '</div>' +
              '</div>';
          }
        }
      });
    }

    var result = await window.finforge.searchResearchPapers(query, 'google');

    if (!result || result.ok !== true) {
      throw new Error(result && result.error ? result.error : 'Unknown research search error');
    }

    state.researchResults = Array.isArray(result.results) ? result.results : [];
    state.researchError = '';
  } catch (error) {
    state.researchResults = [];
    state.researchError = error && error.message ? error.message : 'Search failed';
  } finally {
    state.researchLoading = false;
    state.researchStatus = '';
    // Clean up progress listener
    if (removeProgressListener) {
      removeProgressListener();
    }
    updateResearchResultsUI();
  }
}

function updateResearchResultsUI() {
  var resultsSection = document.getElementById('research-results-section');
  var resultsList = document.getElementById('research-results-list');
  if (!resultsList) {
    return;
  }

  if (state.researchLoading) {
    var statusMsg = state.researchStatus ? escapeHtml(state.researchStatus) : 'Searching for research papers...';
    var isWarning = state.researchStatus && state.researchStatus.indexOf('WARNING:') === 0;
    if (isWarning) {
      statusMsg = escapeHtml(state.researchStatus.substring('WARNING:'.length));
    }
    var colorClass = isWarning ? 'text-tertiary' : 'text-outline';
    resultsList.innerHTML = '<div class="px-md py-md space-y-sm">' +
      '<div class="w-full h-[3px] bg-outline-variant rounded overflow-hidden">' +
      '<div class="h-full bg-primary rounded progress-bar-animate" style="width:60%"></div>' +
      '</div>' +
      '<div class="text-[11px] mono ' + colorClass + '">' + statusMsg + '</div>' +
      '</div>';
    return;
  }

  if (state.researchError) {
    resultsList.innerHTML = '<div class="text-[11px] text-error mono px-md py-md">' + escapeHtml(state.researchError) + '</div>';
    return;
  }

  if (state.researchResults.length === 0) {
    resultsList.innerHTML = '<div class="text-[11px] text-outline mono px-md py-md">No research papers found for this topic. Try a different topic or ticker.</div>';
    return;
  }

  resultsList.innerHTML = state.researchResults.map(function (r, i) {
    var url = escapeHtml(r.url || '');
    var title = escapeHtml(r.title || 'Untitled');
    var snippet = escapeHtml(r.snippet || '');
    return '<div class="border-b border-outline-variant last:border-b-0 px-md py-sm space-y-1">' +
      '<div class="text-[10px] text-outline mono">' + (i + 1) + '. ' +
      '<a href="' + url + '" target="_blank" class="text-primary hover:underline" ' +
      'onclick="event.preventDefault(); window.finforge.openExternalUrl(\'' + url.replace(/'/g, "\\'") + '\')">' +
      title + '</a></div>' +
      (snippet ? '<div class="text-[10px] text-on-surface-variant mono leading-relaxed">' + snippet + '</div>' : '') +
      '<div class="text-[9px] text-outline mono truncate">' + url + '</div>' +
      '</div>';
  }).join('');

  var countEl = resultsSection ? resultsSection.querySelector('.flex .text-outline.mono') : null;
  if (countEl) {
    countEl.textContent = state.researchResults.length + ' papers found';
  }
}

async function loadSelectedCompanyProfile(ticker, companyName = '') {
  const normalizedTicker = String(ticker || '').trim().toUpperCase();
  if (!normalizedTicker) {
    return;
  }

  const requestId = state.companyProfileRequestId + 1;
  state.companyProfileRequestId = requestId;
  state.selectedCompany = {
    ticker: normalizedTicker,
    companyName: String(companyName || normalizedTicker).trim(),
  };
  state.companyView = 'overview';
  state.companyProfileLoading = true;
  state.companyProfileError = '';
  state.companyProfile = null;
  setActivePage('company');
  renderCompanyPage();

  try {
    if (!window.finforge || typeof window.finforge.loadCompanyProfile !== 'function') {
      throw new Error('Company profile action is unavailable');
    }

    const result = await window.finforge.loadCompanyProfile(normalizedTicker);
    if (requestId !== state.companyProfileRequestId) {
      return;
    }

    if (!result || result.ok !== true) {
      throw new Error(result && result.error ? result.error : 'Unknown company profile error');
    }

    state.companyProfile = normalizeCompanyProfile(result.profile, normalizedTicker, companyName || normalizedTicker);
    state.companyProfileError = '';
  } catch (error) {
    if (requestId !== state.companyProfileRequestId) {
      return;
    }

    state.companyProfile = normalizeCompanyProfile(null, normalizedTicker, companyName || normalizedTicker);
    state.companyProfileError = error.message || String(error);
  } finally {
    if (requestId === state.companyProfileRequestId) {
      state.companyProfileLoading = false;
      renderCompanyPage();
    }
  }
}

function normalizeRatios(ratios) {
  const nextRatios = ratios && typeof ratios === 'object' ? ratios : {};
  return Object.entries(nextRatios).reduce((accumulator, [name, ratio]) => {
    if (!name) {
      return accumulator;
    }

    if (typeof ratio === 'string') {
      accumulator[name] = { formula: ratio, notes: '', row: '' };
      return accumulator;
    }

    accumulator[name] = {
      formula: ratio && typeof ratio === 'object' ? String(ratio.formula || '') : '',
      notes: ratio && typeof ratio === 'object' ? String(ratio.notes || '') : '',
      row: ratio && typeof ratio === 'object' ? String(ratio.row || '') : '',
    };
    return accumulator;
  }, {});
}

function snapshotRatios() {
  return JSON.stringify(state.ratios);
}

function normalizeFormulaText(value) {
  return String(value || '').replace(/^\s*=\s*/, '').trimStart();
}

function normalizeFormulaValue(value) {
  const text = normalizeFormulaText(value);
  return text ? `=${text}` : '=';
}

function getNormalizedCursorPosition() {
  const rawValue = ratioFormulaInput.value;
  const rawPos = ratioFormulaInput.selectionStart ?? rawValue.length;
  const normalizedText = normalizeFormulaText(rawValue);
  const prefixLen = rawValue.length - normalizedText.length;
  return Math.max(0, rawPos - prefixLen);
}

function getFormulaText() {
  return normalizeFormulaText(ratioFormulaInput.value);
}

function setFormulaText(value) {
  ratioFormulaInput.value = normalizeFormulaValue(value);
}

function getFormulaReferenceEntries() {
  const references = [
    ...getCatalogItems('incomeStatement').map((field) => `IS: ${field}`),
    ...getCatalogItems('balanceSheet').map((field) => `BS: ${field}`),
    ...cashFlowFields.map((field) => `CF: ${field}`),
    ...metadataFields.map((field) => `M: ${field}`),
    ...holderFields.map((field) => `H: ${field}`),
    ...estimateFields.map((field) => `E: ${field}`),
    ...analystFields.map((field) => `A: ${field}`),
    ...priceFields.map((field) => `P: ${field}`),
    ...Object.keys(state.ratios).map((name) => `RATIO: ${name}`),
  ];

  return references.sort((left, right) => right.length - left.length);
}

function matchFormulaReference(text, startIndex) {
  const references = getFormulaReferenceEntries();

  for (const reference of references) {
    if (text.startsWith(reference, startIndex)) {
      return reference;
    }
  }

  return '';
}

function findTokenAtPosition(text, position) {
  const references = getFormulaReferenceEntries();
  for (const ref of references) {
    let idx = 0;
    while (idx < text.length) {
      const foundIdx = text.indexOf(ref, idx);
      if (foundIdx === -1) break;
      if (foundIdx <= position && position <= foundIdx + ref.length) {
        return { token: ref, start: foundIdx, end: foundIdx + ref.length };
      }
      idx = foundIdx + 1;
    }
  }
  return null;
}

function renderFormulaHighlight() {
  const text = normalizeFormulaText(ratioFormulaInput.value);
  const pieces = ['<span class="text-outline">=</span>'];
  let index = 0;

  while (index < text.length) {
    const character = text[index];

    if (/\s/.test(character)) {
      let end = index + 1;
      while (end < text.length && /\s/.test(text[end])) {
        end += 1;
      }
      pieces.push(escapeHtml(text.slice(index, end)));
      index = end;
      continue;
    }

    if (/[()+\-*/]/.test(character)) {
      pieces.push(`<span class="text-warning">${escapeHtml(character)}</span>`);
      index += 1;
      continue;
    }

    const matchedReference = matchFormulaReference(text, index);
    if (matchedReference) {
      pieces.push(`<span class="text-secondary">${escapeHtml(matchedReference)}</span>`);
      index += matchedReference.length;
      continue;
    }

    const numberMatch = text.slice(index).match(/^\d+(?:\.\d+)?/);
    if (numberMatch) {
      pieces.push(`<span class="text-info">${escapeHtml(numberMatch[0])}</span>`);
      index += numberMatch[0].length;
      continue;
    }

    let end = index + 1;
    while (end < text.length && !/\s|[()+\-*/]/.test(text[end])) {
      end += 1;
    }
    pieces.push(`<span class="text-error">${escapeHtml(text.slice(index, end))}</span>`);
    index = end;
  }

  ratioFormulaHighlight.innerHTML = pieces.join('');
  syncFormulaHighlightScroll();
}

function protectFormulaEquals() {
  const currentValue = ratioFormulaInput.value;
  const normalizedValue = normalizeFormulaValue(currentValue);

  if (normalizedValue === currentValue) {
    return;
  }

  const selectionStart = ratioFormulaInput.selectionStart ?? normalizedValue.length;
  const selectionEnd = ratioFormulaInput.selectionEnd ?? normalizedValue.length;
  const removedCharacters = currentValue.length - normalizedValue.length;

  ratioFormulaInput.value = normalizedValue;
  ratioFormulaInput.setSelectionRange(
    Math.max(0, selectionStart - removedCharacters),
    Math.max(0, selectionEnd - removedCharacters)
  );
}

function syncFormulaHighlightScroll() {
  ratioFormulaHighlight.scrollTop = ratioFormulaInput.scrollTop;
  ratioFormulaHighlight.scrollLeft = ratioFormulaInput.scrollLeft;
}

function placeFormulaCaretAtEnd() {
  const endPosition = ratioFormulaInput.value.length;
  ratioFormulaInput.focus();
  ratioFormulaInput.setSelectionRange(endPosition, endPosition);
}

const metadataFields = [
  'Market Cap', 'Enterprise Value', 'PE Ratio', 'Forward PE', 'PEG Ratio',
  'PS Ratio', 'PB Ratio', 'EPS', 'Forward EPS', 'Dividend Yield',
  'Dividend Rate', 'Beta', '52 Week High', '52 Week Low',
  '50 Day MA', '200 Day MA', 'Shares Outstanding', 'Float Shares',
  'Short Ratio', 'Revenue TTM', 'Gross Profit TTM', 'Operating Margin',
  'Profit Margin', 'ROA', 'ROE', 'Revenue Per Share', 'Book Value Per Share',
  'Free Cash Flow', 'Current Ratio', 'Debt to Equity',
  'Number of Analysts',
];

const cashFlowFields = [
  'Operating Cash Flow', 'Free Cash Flow', 'Capital Expenditure',
  'Depreciation And Amortization', 'Stock Based Compensation',
  'Other Operating Activities', 'Net Income Starting Line',
  'Changes In Accounts Receivables', 'Changes In Inventories',
  'Changes In Accounts Payable', 'Changes In Other Working Capital',
  'Investing Cash Flow', 'Purchase Of PPE', 'Sale Of PPE',
  'Purchase Of Investments', 'Sale Of Investments',
  'Financing Cash Flow', 'Dividends Paid', 'Common Stock Issuance',
  'Common Stock Repurchase', 'Debt Issuance', 'Debt Repayment',
  'Net Change In Cash', 'Cash Interest Paid', 'Cash Taxes Paid',
];

const holderFields = [
  'Institutional Ownership %', 'Mutual Fund Ownership %',
  'Insider Ownership %', 'Top Institutional Holders Count',
  'Top Mutual Fund Holders Count',
];

const estimateFields = [
  'EPS Estimate Current Quarter', 'EPS Estimate Next Quarter',
  'EPS Estimate Current Year', 'EPS Estimate Next Year',
  'Revenue Estimate Current Quarter', 'Revenue Estimate Next Quarter',
  'Revenue Estimate Current Year', 'Revenue Estimate Next Year',
  'Growth Estimate Current Quarter', 'Growth Estimate Next Quarter',
  'Growth Estimate Current Year', 'Growth Estimate Next Year',
  'Number of Analysts EPS', 'Number of Analysts Revenue',
];

const analystFields = [
  'Strong Buy Count', 'Buy Count', 'Hold Count', 'Sell Count',
  'Strong Sell Count', 'Target Mean Price', 'Target High Price',
  'Target Low Price',
];

function getRatioFieldOptions(kind) {
  if (kind === 'P') {
    return [...priceFields];
  }
  if (kind === 'IS') {
    return getCatalogItems('incomeStatement');
  }
  if (kind === 'BS') {
    return getCatalogItems('balanceSheet');
  }
  if (kind === 'CF') {
    return [...cashFlowFields];
  }
  if (kind === 'M') {
    return [...metadataFields];
  }
  if (kind === 'H') {
    return [...holderFields];
  }
  if (kind === 'E') {
    return [...estimateFields];
  }
  if (kind === 'A') {
    return [...analystFields];
  }
  if (kind === 'RATIO') {
    return Object.keys(state.ratios).sort((left, right) => left.localeCompare(right));
  }
  return [];
}

function getPickerLabel(kind) {
  if (kind === 'P') { return 'Price fields'; }
  if (kind === 'IS') { return 'Income statement fields'; }
  if (kind === 'BS') { return 'Balance sheet fields'; }
  if (kind === 'CF') { return 'Cash flow fields'; }
  if (kind === 'M') { return 'Market data fields'; }
  if (kind === 'H') { return 'Holder fields'; }
  if (kind === 'E') { return 'Estimate fields'; }
  if (kind === 'A') { return 'Analyst action fields'; }
  if (kind === 'RATIO') { return 'Saved ratios'; }
  return 'Fields';
}

function closeRatioFieldPicker() {
  state.ratioFieldPicker.open = false;
  ratioFieldPicker.classList.add('hidden');
  ratioFieldPickerSearch.value = '';
  state.ratioFieldPicker.search = '';
  state.ratioFieldPicker.selectedMode = 'latest';
}

function buildRatioSelectionToken(kind, line, mode) {
  const normalizedKind = String(kind || '').trim().toUpperCase();
  const normalizedLine = String(line || '').trim();
  const normalizedMode = String(mode || '').trim().toLowerCase();

  if (!normalizedLine) {
    return '';
  }

  const modeLabel = normalizedMode && normalizedMode !== 'latest'
    ? ` [${normalizedMode.toUpperCase()}]`
    : '';

  return `${normalizedKind ? `${normalizedKind}: ` : ''}${normalizedLine}${modeLabel}`;
}

function clearRatioSelectionToken() {
  const currentToken = String(state.ratioModePanel.tokenValue || '');
  if (currentToken) {
    const currentValue = getFormulaText();
    const startIndex = Number.isFinite(state.ratioModePanel.insertAt) ? state.ratioModePanel.insertAt : 0;
    setFormulaText(`${currentValue.slice(0, startIndex)}${currentValue.slice(startIndex + currentToken.length)}`);
  }

  state.ratioModePanel.tokenValue = '';
  state.ratioModePanel.selectedMode = '';
  state.ratioModePanel.token = '';
  syncRatioPreview();
  renderFormulaHighlight();
  syncDirtyState();
}

function syncRatioSelectionToken() {
  const selectedLine = String(state.ratioModePanel.token || '').trim();
  const selectedMode = String(state.ratioModePanel.selectedMode || '').trim() || 'latest';

  if (!selectedLine) {
    clearRatioSelectionToken();
    return;
  }

  const nextToken = buildRatioSelectionToken(state.ratioModePanel.kind, selectedLine, selectedMode);
  if (!nextToken) {
    return;
  }

  const currentValue = getFormulaText();
  const startIndex = Number.isFinite(state.ratioModePanel.insertAt) ? state.ratioModePanel.insertAt : currentValue.length;
  const previousToken = String(state.ratioModePanel.tokenValue || '');
  const nextValue = `${currentValue.slice(0, startIndex)}${nextToken}${currentValue.slice(startIndex + previousToken.length)}`;

  setFormulaText(nextValue);
  state.ratioModePanel.tokenValue = nextToken;
  syncRatioPreview();
  renderFormulaHighlight();
  syncDirtyState();
}

function closeRatioLinePanel() {
  state.ratioLinePanel.open = false;
  state.ratioLinePanel.kind = '';
  state.ratioLinePanel.insertAt = 0;
  state.ratioLinePanel.search = '';
  state.ratioLinePanel.selectedLine = '';
  if (ratioLinePanelSearch) {
    ratioLinePanelSearch.value = '';
  }
  ratioLinePanel.classList.add('hidden');
  closeRatioModePanel();
}

function closeRatioModePanel() {
  state.ratioModePanel.open = false;
  state.ratioModePanel.token = '';
  state.ratioModePanel.kind = '';
  state.ratioModePanel.insertAt = 0;
  state.ratioModePanel.selectedMode = '';
  state.ratioModePanel.tokenValue = '';
  state.ratioModePanel.modeParams = {};
  ratioModePanel.classList.add('hidden');
  ratioModeSubOptions.classList.add('hidden');
}

function getDataModeOptions(kind) {
  // Context-aware mode options based on prefix type
  if (kind === 'P') {
    return [
      { value: 'latest', label: 'Latest', description: 'Current value' },
      { value: 'trailing', label: 'Trailing', description: 'Rolling aggregation over periods', hasSubOptions: true },
      { value: 'offset', label: 'Offset', description: 'Value N days/weeks/months ago', hasSubOptions: true },
    ];
  }

  // Balance Sheet: point-in-time snapshots — TTM (summing quarters) is meaningless
  if (kind === 'BS') {
    return [
      { value: 'latest', label: 'Latest', description: 'Use the newest available value' },
      { value: 'quarter', label: 'Quarter', description: 'Single quarterly value' },
      { value: 'annual', label: 'Annual', description: 'Single annual value' },
      { value: 'previous', label: 'Previous', description: 'Previous matching period' },
      { value: 'yoy', label: 'YoY Change', description: 'Year-over-year percent change' },
      { value: 'custom', label: 'Custom', description: 'Manual period rule', hasSubOptions: true },
    ];
  }

  // Income Statement & Cash Flow: flow statements — TTM is meaningful
  if (kind === 'IS' || kind === 'CF') {
    return [
      { value: 'latest', label: 'Latest', description: 'Use the newest available value' },
      { value: 'ttm', label: 'TTM', description: 'Trailing 4 quarters summed' },
      { value: 'quarter', label: 'Quarter', description: 'Single quarterly value' },
      { value: 'annual', label: 'Annual', description: 'Single annual value' },
      { value: 'previous', label: 'Previous', description: 'Previous matching period' },
      { value: 'yoy', label: 'YoY Change', description: 'Year-over-year percent change' },
      { value: 'custom', label: 'Custom', description: 'Manual period rule', hasSubOptions: true },
    ];
  }

  if (kind === 'RATIO' || kind === 'M' || kind === 'H') {
    return [
      { value: 'latest', label: 'Latest', description: 'Current value' },
    ];
  }

  // Analyst & Estimates: point-in-time consensus snapshots — period is already encoded in field names
  if (kind === 'E' || kind === 'A') {
    return [
      { value: 'latest', label: 'Latest', description: 'Current consensus / most recent data' },
    ];
  }

  // Default fallback
  return [
    { value: 'latest', label: 'Latest', description: 'Current value' },
  ];
}

function openRatioModePanel(token, kind) {
  state.ratioModePanel = {
    open: true,
    token,
    kind,
    insertAt: getNormalizedCursorPosition(),
    selectedMode: '',
    tokenValue: '',
    modeParams: {},
  };
  ratioModePanel.classList.remove('hidden');
  renderRatioModePanel();
}

function getRatioLineOptions(kind) {
  if (kind === 'P') { return [...priceFields]; }
  if (kind === 'IS') { return getCatalogItems('incomeStatement'); }
  if (kind === 'BS') { return getCatalogItems('balanceSheet'); }
  if (kind === 'CF') { return [...cashFlowFields]; }
  if (kind === 'M') { return [...metadataFields]; }
  if (kind === 'H') { return [...holderFields]; }
  if (kind === 'E') { return [...estimateFields]; }
  if (kind === 'A') { return [...analystFields]; }
  if (kind === 'RATIO') { return Object.keys(state.ratios).sort((left, right) => left.localeCompare(right)); }
  return [];
}

function renderRatioLinePanel() {
  if (!state.ratioLinePanel.open) {
    return;
  }

  const options = getRatioLineOptions(state.ratioLinePanel.kind);
  const searchTerm = state.ratioLinePanel.search.trim().toLowerCase();
  const filtered = searchTerm ? options.filter((item) => item.toLowerCase().includes(searchTerm)) : options;

  ratioLinePanelToken.textContent = state.ratioLinePanel.kind ? `${state.ratioLinePanel.kind} lines` : 'No line selected';
  ratioLinePanelSubtitle.textContent = state.ratioLinePanel.kind ? 'Choose the exact line or ratio to insert. Click again to deselect.' : 'Choose the financial statement line first';
  ratioLinePanelList.innerHTML = filtered.length
    ? filtered.map((item) => `
      <button class="w-full text-left px-2 py-1.5 text-[10px] mono border border-outline-variant transition-colors ${item === state.ratioModePanel.token ? 'bg-secondary/10 text-secondary border-secondary' : 'text-on-surface hover:bg-surface-container border-outline-variant'}" data-line-item="${escapeHtml(item)}">
        ${escapeHtml(item)}
      </button>
    `).join('')
    : '<div class="px-2 py-2 text-[10px] text-on-surface-variant">No lines match the filter.</div>';

  ratioLinePanelList.querySelectorAll('[data-line-item]').forEach((button) => {
    button.addEventListener('click', () => {
      const selectedLine = button.dataset.lineItem || '';
      const selectedKind = state.ratioLinePanel.kind || 'RATIO';
      const isSameSelection = state.ratioModePanel.token === selectedLine && state.ratioModePanel.kind === selectedKind;

      if (isSameSelection) {
        clearRatioSelectionToken();
      } else {
        if (state.ratioModePanel.tokenValue) {
          clearRatioSelectionToken();
        }

        state.ratioModePanel.kind = selectedKind;
        state.ratioModePanel.token = selectedLine;
        state.ratioModePanel.insertAt = getNormalizedCursorPosition();
        state.ratioModePanel.selectedMode = 'latest';
        state.ratioModePanel.tokenValue = '';
        syncRatioSelectionToken();
      }

      renderRatioLinePanel();
      renderRatioModePanel();
    });
  });
}

function buildModeToken(kind, line, mode, modeParams) {
  const normalizedKind = String(kind || '').trim().toUpperCase();
  const normalizedLine = String(line || '').trim();
  const normalizedMode = String(mode || '').trim().toLowerCase();

  if (!normalizedLine) {
    return '';
  }

  let modeSuffix = '';
  if (normalizedMode === 'offset' && modeParams) {
    const value = modeParams.value || 15;
    const unit = modeParams.unit || 'D';
    modeSuffix = ` [${value}${unit}]`;
  } else if (normalizedMode === 'trailing' && modeParams) {
    const periods = modeParams.periods || 10;
    const aggregation = (modeParams.aggregation || 'AVERAGE').toUpperCase();
    modeSuffix = ` [TRAILING:${periods}_${aggregation}]`;
  } else if (normalizedMode === 'custom' && modeParams) {
    const periods = modeParams.periods || 2;
    const unit = modeParams.unit || 'Q';
    const aggregation = (modeParams.aggregation || 'AVG').toUpperCase();
    modeSuffix = ` [CUSTOM:${periods}${unit}_${aggregation}]`;
  } else if (normalizedMode && normalizedMode !== 'latest') {
    modeSuffix = ` [${normalizedMode.toUpperCase()}]`;
  }

  return `${normalizedKind}: ${normalizedLine}${modeSuffix}`;
}

function renderRatioModePanel() {
  if (!state.ratioModePanel.open) {
    return;
  }

  const searchToken = String(state.ratioModePanel.token || '');
  const kind = String(state.ratioModePanel.kind || 'BS');
  const options = getDataModeOptions(kind);

  ratioModePanelToken.textContent = searchToken || 'No line selected';
  ratioModePanelSubtitle.textContent = searchToken ? 'Choose how the selected line resolves.' : 'Choose the financial statement line first';

  let html = '';
  let selectedParametricMode = null;
  for (const modeOption of options) {
    const isSelected = state.ratioModePanel.selectedMode === modeOption.value;
    html += `
      <button class="w-full text-left px-2 py-1.5 text-[10px] mono border border-outline-variant transition-colors ${isSelected ? 'bg-secondary/10 text-secondary border-secondary' : 'text-on-surface hover:bg-surface-container border-outline-variant'}" data-mode-value="${escapeHtml(modeOption.value)}">
        <div class="flex items-center justify-between gap-2">
          <span>${escapeHtml(modeOption.label)}</span>
          <span class="text-[9px] text-outline-variant">${escapeHtml(modeOption.description)}</span>
        </div>
      </button>`;

    if (isSelected && modeOption.hasSubOptions) {
      selectedParametricMode = modeOption.value;
    }
  }

  ratioModePanelList.innerHTML = html;

  // Render sub-options in the separate container if a parametric mode is selected
  if (selectedParametricMode) {
    ratioModeSubOptionsContent.innerHTML = renderModeSubOptions(kind, selectedParametricMode, state.ratioModePanel.modeParams || {});
    ratioModeSubOptionsTitle.textContent = getSubOptionsTitle(selectedParametricMode);
    ratioModeSubOptions.classList.remove('hidden');

    // Bind sub-option input changes in the separate container
    const subInputs = ratioModeSubOptionsContent.querySelectorAll('[data-mode-param]');
    subInputs.forEach(function(input) {
      input.addEventListener('change', function() {
        const paramName = this.dataset.modeParam;
        const paramValue = this.value;
        if (!state.ratioModePanel.modeParams) {
          state.ratioModePanel.modeParams = {};
        }
        state.ratioModePanel.modeParams[paramName] = paramValue;
        syncRatioSelectionTokenWithMode();
        renderRatioModePanel();
      });
      input.addEventListener('input', function() {
        const paramName = this.dataset.modeParam;
        const paramValue = this.value;
        if (!state.ratioModePanel.modeParams) {
          state.ratioModePanel.modeParams = {};
        }
        state.ratioModePanel.modeParams[paramName] = paramValue;
        syncRatioSelectionTokenWithMode();
      });
    });
  } else {
    ratioModeSubOptions.classList.add('hidden');
    ratioModeSubOptionsContent.innerHTML = '';
  }

  // Bind mode selection clicks
  ratioModePanelList.querySelectorAll('[data-mode-value]').forEach((button) => {
    button.addEventListener('click', () => {
      const selectedMode = button.dataset.modeValue || 'latest';
      const selectedLine = state.ratioModePanel.token || '';

      if (!selectedLine) {
        return;
      }

      if (state.ratioModePanel.selectedMode === selectedMode) {
        state.ratioModePanel.selectedMode = '';
        state.ratioModePanel.modeParams = {};
        clearRatioSelectionToken();
      } else {
        state.ratioModePanel.selectedMode = selectedMode;
        state.ratioModePanel.modeParams = {};
        // If mode has no sub-options, sync immediately
        const modeOpt = options.find(function(o) { return o.value === selectedMode; });
        if (!modeOpt || !modeOpt.hasSubOptions) {
          syncRatioSelectionTokenWithMode();
        }
      }

      renderRatioModePanel();
      renderRatioLinePanel();
    });
  });
}

function getSubOptionsTitle(mode) {
  if (mode === 'offset') return 'Configure offset parameters';
  if (mode === 'trailing') return 'Configure trailing parameters';
  if (mode === 'custom') return 'Configure custom period rule';
  return 'Configure mode parameters';
}

function renderModeSubOptions(kind, mode, params) {
  if (mode === 'offset') {
    const value = params.value || 15;
    const unit = params.unit || 'D';
    return `
      <div class="pl-3 pr-1 py-2 space-y-1.5 border-l-2 border-secondary/30 ml-1">
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span>Value</span>
            <input data-mode-param="value" type="number" min="1" max="9999" value="${escapeHtml(String(value))}" class="w-16 h-7 bg-surface-container-lowest border border-outline-variant px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none"/>
          </label>
          <label class="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span>Unit</span>
            <select data-mode-param="unit" class="h-7 bg-surface-container-lowest border border-outline-variant px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none">
              <option value="D" ${unit === 'D' ? 'selected' : ''}>Days</option>
              <option value="W" ${unit === 'W' ? 'selected' : ''}>Weeks</option>
              <option value="M" ${unit === 'M' ? 'selected' : ''}>Months</option>
              <option value="Y" ${unit === 'Y' ? 'selected' : ''}>Years</option>
            </select>
          </label>
        </div>
      </div>`;
  }

  if (mode === 'trailing') {
    const periods = params.periods || 10;
    const aggregation = (params.aggregation || 'AVERAGE').toUpperCase();
    return `
      <div class="pl-3 pr-1 py-2 space-y-1.5 border-l-2 border-secondary/30 ml-1">
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span>Periods</span>
            <input data-mode-param="periods" type="number" min="1" max="999" value="${escapeHtml(String(periods))}" class="w-16 h-7 bg-surface-container-lowest border border-outline-variant px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none"/>
          </label>
          <label class="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span>Aggregation</span>
            <select data-mode-param="aggregation" class="h-7 bg-surface-container-lowest border border-outline-variant px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none">
              <option value="AVERAGE" ${aggregation === 'AVERAGE' || aggregation === 'AVG' ? 'selected' : ''}>Average</option>
              <option value="SUM" ${aggregation === 'SUM' ? 'selected' : ''}>Sum</option>
              <option value="MAX" ${aggregation === 'MAX' ? 'selected' : ''}>Max</option>
              <option value="MIN" ${aggregation === 'MIN' ? 'selected' : ''}>Min</option>
            </select>
          </label>
        </div>
      </div>`;
  }

  if (mode === 'custom') {
    const isBalanceSheet = String(kind || '').toUpperCase() === 'BS';
    // Balance Sheet: stock variables (snapshots) — Sum is meaningless, default to 1Q Single
    // Income Statement & Cash Flow: flow variables — Sum is meaningful, default to 4Q Sum
    const periods = isBalanceSheet ? (params.periods || 1) : (params.periods || 4);
    const unit = params.unit || 'Q';
    const aggregation = isBalanceSheet
      ? ((params.aggregation || 'SINGLE').toUpperCase())
      : ((params.aggregation || 'SUM').toUpperCase());
    const unitOptions = `
              <option value="Q" ${unit === 'Q' ? 'selected' : ''}>Quarters</option>
              <option value="Y" ${unit === 'Y' ? 'selected' : ''}>Years</option>`;
    const aggOptions = isBalanceSheet
      ? `
              <option value="SINGLE" ${aggregation === 'SINGLE' ? 'selected' : ''}>Single</option>
              <option value="AVG" ${aggregation === 'AVG' || aggregation === 'AVERAGE' ? 'selected' : ''}>Average</option>`
      : `
              <option value="SINGLE" ${aggregation === 'SINGLE' ? 'selected' : ''}>Single</option>
              <option value="AVG" ${aggregation === 'AVG' || aggregation === 'AVERAGE' ? 'selected' : ''}>Average</option>
              <option value="SUM" ${aggregation === 'SUM' ? 'selected' : ''}>Sum</option>`;
    return `
      <div class="pl-3 pr-1 py-2 space-y-1.5 border-l-2 border-secondary/30 ml-1">
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span>Periods</span>
            <input data-mode-param="periods" type="number" min="1" max="20" value="${escapeHtml(String(periods))}" class="w-16 h-7 bg-surface-container-lowest border border-outline-variant px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none"/>
          </label>
          <label class="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span>Unit</span>
            <select data-mode-param="unit" class="h-7 bg-surface-container-lowest border border-outline-variant px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none">${unitOptions}
            </select>
          </label>
          <label class="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span>Agg.</span>
            <select data-mode-param="aggregation" class="h-7 bg-surface-container-lowest border border-outline-variant px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none">${aggOptions}
            </select>
          </label>
        </div>
      </div>`;
  }

  return '';
}

function syncRatioSelectionTokenWithMode() {
  const selectedLine = String(state.ratioModePanel.token || '').trim();
  const selectedMode = String(state.ratioModePanel.selectedMode || '').trim() || 'latest';
  const modeParams = state.ratioModePanel.modeParams || {};
  const kind = String(state.ratioModePanel.kind || '').trim().toUpperCase();

  if (!selectedLine) {
    clearRatioSelectionToken();
    return;
  }

  const nextToken = buildModeToken(kind, selectedLine, selectedMode, modeParams);
  if (!nextToken) {
    return;
  }

  const currentValue = getFormulaText();
  const startIndex = Number.isFinite(state.ratioModePanel.insertAt) ? state.ratioModePanel.insertAt : currentValue.length;
  const previousToken = String(state.ratioModePanel.tokenValue || '');
  const nextValue = `${currentValue.slice(0, startIndex)}${nextToken}${currentValue.slice(startIndex + previousToken.length)}`;

  setFormulaText(nextValue);
  state.ratioModePanel.tokenValue = nextToken;
  syncRatioPreview();
  renderFormulaHighlight();
  syncDirtyState();
}

function openRatioLinePanel(kind) {
  state.ratioLinePanel = {
    open: true,
    kind,
    insertAt: getNormalizedCursorPosition(),
    search: '',
    selectedLine: '',
  };
  ratioLinePanel.classList.remove('hidden');
  if (ratioLinePanelSearch) {
    ratioLinePanelSearch.value = '';
  }
  renderRatioLinePanel();
  if (ratioLinePanelSearch) {
    requestAnimationFrame(() => ratioLinePanelSearch.focus());
  }
}

function renderRatioFieldPicker() {
  if (!state.ratioFieldPicker.open) {
    return;
  }

  const options = getRatioFieldOptions(state.ratioFieldPicker.kind);
  const searchTerm = state.ratioFieldPicker.search.trim().toLowerCase();
  const filtered = searchTerm ? options.filter((item) => item.toLowerCase().includes(searchTerm)) : options;

  ratioFieldPickerTitle.textContent = `${state.ratioFieldPicker.kind} picker`;
  ratioFieldPickerSubtitle.textContent = getPickerLabel(state.ratioFieldPicker.kind);
  ratioFieldPickerList.innerHTML = filtered.length
    ? filtered.map((item) => `
      <button class="w-full text-left px-2 py-1.5 text-[10px] text-on-surface mono hover:bg-surface-container border-0" data-picker-item="${escapeHtml(item)}">
        ${escapeHtml(item)}
      </button>
    `).join('')
    : '<div class="px-2 py-2 text-[10px] text-on-surface-variant">No fields match the filter.</div>';

  ratioFieldPickerList.querySelectorAll('[data-picker-item]').forEach((button) => {
    button.addEventListener('click', () => {
      insertPickedField(button.dataset.pickerItem || '');
    });
  });
}

function insertPickedField(fieldValue) {
  if (!fieldValue) {
    return;
  }

  const insertAt = state.ratioFieldPicker.insertAt;
  const currentValue = getFormulaText();
  const modeLabel = state.ratioFieldPicker.selectedMode && state.ratioFieldPicker.selectedMode !== 'latest'
    ? ` [${state.ratioFieldPicker.selectedMode.toUpperCase()}]`
    : '';
  const prefixText = state.ratioFieldPicker.kind ? `${state.ratioFieldPicker.kind}: ` : '';
  const nextValue = `${currentValue.slice(0, insertAt)}${prefixText}${fieldValue}${modeLabel}${currentValue.slice(insertAt)}`;
  setFormulaText(nextValue);
  syncRatioPreview();
  renderFormulaHighlight();
  syncDirtyState();
  closeRatioFieldPicker();
  requestAnimationFrame(placeFormulaCaretAtEnd);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function syncRatioPreview() {
  const name = ratioNameInput.value.trim();
  const formula = getFormulaText().trim();
  const notes = ratioNotesInput.value.trim();
  const row = ratioRowInput.value.trim();

  ratioPreview.innerHTML = `
    <div class="space-y-1">
      <div class="text-on-surface mono text-body-sm">${name ? escapeHtml(name) : 'Untitled ratio'}</div>
      <div class="flex items-center gap-2 text-[10px] uppercase mono">
        <span class="text-outline">Row</span>
        <span class="px-1.5 py-[1px] border border-outline-variant text-on-surface-variant bg-surface-container-high">${row ? escapeHtml(row) : 'Auto'}</span>
      </div>
      <div class="text-outline mono text-[10px] break-words">${formula ? escapeHtml(formula) : 'Enter a formula to preview the ratio.'}</div>
      <div class="text-outline text-[10px]">${notes ? escapeHtml(notes) : 'Add notes for interpretation, sources, or thresholds.'}</div>
    </div>
  `;
}

function setRatioForm(name = '', ratio = { formula: '', notes: '', row: '' }) {
  state.selectedRatioName = name;
  state.ratioEditorMode = name ? 'edit' : 'create';
  state.ratioEditorOriginalName = name;
  setRatioWorkspaceView('maker');
  ratioNameInput.value = name;
  setFormulaText(ratio.formula || '');
  ratioNotesInput.value = ratio.notes || '';
  ratioRowInput.value = String(ratio.row || '');
  ratioEditorState.textContent = name ? `Editing ${name}` : 'Creating new ratio';
  ratioCancelButton.classList.toggle('hidden', !name);
  ratioResetButton.classList.toggle('hidden', !!name);
  ratioNameInput.disabled = false;
  ratioFormulaInput.disabled = false;
  ratioNotesInput.disabled = false;
  ratioRowInput.disabled = false;
  syncRatioPreview();
  renderFormulaHighlight();
  closeRatioFieldPicker();
  clearRatioSelectionToken();
  closeRatioLinePanel();
  closeRatioModePanel();
}

function cancelRatioEdit() {
  const originalName = state.ratioEditorOriginalName;

  if (originalName && state.ratios[originalName]) {
    setRatioForm(originalName, state.ratios[originalName]);
    return;
  }

  setRatioForm();
}

function renderRatios() {
  const entries = Object.entries(state.ratios).sort(([leftName], [rightName]) => leftName.localeCompare(rightName));
  const searchTerm = state.ratioSearch.trim().toLowerCase();
  const filtered = searchTerm
    ? entries.filter(([name]) => name.toLowerCase().includes(searchTerm))
    : entries;
  ratioCount.textContent = `${entries.length} ratios`;
  if (ratioCountMaker) {
    ratioCountMaker.textContent = `${entries.length} ratios`;
  }
  const dupMap = getDuplicateRowMap();

  ratioResultsCount.textContent = `${filtered.length} shown`;
  ratioList.innerHTML = filtered.length
    ? filtered.map(([name, ratio]) => {
        const formula = ratio && typeof ratio === 'object' ? String(ratio.formula || '') : String(ratio || '');
        const notes = ratio && typeof ratio === 'object' ? String(ratio.notes || '') : '';
        const ratioRow = ratio && typeof ratio === 'object' ? String(ratio.row || '') : '';
        const isActive = state.selectedRatioName === name || state.ratioEditorOriginalName === name;
        const renderedFormula = isActive ? String(getFormulaText().trim() || '') : formula;
        const renderedNotes = isActive ? String(ratioNotesInput.value.trim() || '') : notes;
        const renderedRow = isActive ? String(ratioRowInput.value.trim() || '') : ratioRow;
        const rowDups = renderedRow && dupMap[renderedRow] ? dupMap[renderedRow].filter((n) => n !== name) : [];
        const isDup = rowDups.length > 0;
        const dupTitle = isDup ? `Duplicate row: ${rowDups.join(', ')}` : '';

        return `
          <article class="ratio-card border ${isActive ? 'border-secondary' : 'border-outline-variant'} bg-surface-container p-md" data-ratio-card data-ratio-name="${escapeHtml(name)}">
            <div class="flex flex-col lg:flex-row lg:items-stretch gap-sm min-w-0">
              <div class="min-w-0 lg:w-[22%] flex flex-col justify-between gap-sm">
                <div class="min-w-0">
                  <div class="text-on-surface mono text-body-md font-semibold leading-tight truncate">${escapeHtml(isActive ? ratioNameInput.value.trim() || name : name)}</div>
                  <div class="mt-1 flex items-center gap-2">
                    <span class="text-[9px] text-outline uppercase mono">Row</span>
                    <input class="ratio-row-input w-14 h-6 bg-surface-container-lowest px-1 text-[10px] font-label-md text-label-md text-on-surface placeholder:text-outline-variant outline-none mono text-center ${isDup ? 'border-error text-error' : 'border-outline-variant focus:border-secondary'}" type="number" min="7" placeholder="N/A" value="${escapeHtml(renderedRow)}" data-ratio-row="${escapeHtml(name)}" title="${escapeHtml(dupTitle)}"/>
                  </div>
                </div>
              </div>
              <div class="min-w-0 lg:flex-[1.1] border border-outline-variant bg-surface-container-lowest p-sm space-y-1">
                <div class="text-[9px] text-outline uppercase mono">Formula</div>
                <div class="text-[10px] text-on-surface-variant mono break-words">${escapeHtml(renderedFormula || 'No formula set.')}</div>
              </div>
              <div class="min-w-0 lg:flex-[1.2] border border-outline-variant bg-surface-container-lowest p-sm space-y-1">
                <div class="text-[10px] text-outline break-words">${escapeHtml(renderedNotes || 'No notes provided.')}</div>
              </div>
              <div class="shrink-0 flex flex-row lg:flex-col items-center lg:items-stretch justify-start gap-xs lg:w-[120px]">
                <button class="ratio-edit border border-outline-variant bg-surface-container-high px-2 py-[2px] text-[9px] font-label-md text-label-md hover:border-primary transition-colors w-full" data-ratio-edit="${escapeHtml(name)}">Edit</button>
                <button class="ratio-duplicate border border-outline-variant bg-surface-container-high px-2 py-[2px] text-[9px] font-label-md text-label-md hover:border-primary transition-colors w-full" data-ratio-duplicate="${escapeHtml(name)}">Duplicate</button>
                <button class="ratio-delete border border-outline-variant bg-surface-container-high px-2 py-[2px] text-[9px] font-label-md text-label-md hover:border-error transition-colors w-full" data-ratio-delete="${escapeHtml(name)}">Delete</button>
              </div>
            </div>
          </article>
        `;
      }).join('')
    : '<div class="border border-outline-variant bg-surface-container p-md text-body-sm text-on-surface-variant">No ratios match the filter.</div>';

  ratioList.querySelectorAll('[data-ratio-row]').forEach((input) => {
    input.addEventListener('change', async () => {
      const name = input.dataset.ratioRow || '';
      const rawVal = input.value.trim();
      const parsedVal = rawVal ? String(parseInt(rawVal, 10) || '') : '';
      if (state.ratios[name]) {
        state.ratios[name] = { ...state.ratios[name], row: parsedVal };
        await saveRatiosToDisk();
      }
    });
  });

  ratioList.querySelectorAll('[data-ratio-edit]').forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.dataset.ratioEdit || '';
      setRatioForm(name, state.ratios[name] || { formula: '', notes: '' });
    });
  });

  ratioList.querySelectorAll('[data-ratio-duplicate]').forEach((button) => {
    button.addEventListener('click', async () => {
      const name = button.dataset.ratioDuplicate || '';
      await duplicateRatio(name);
    });
  });

  ratioList.querySelectorAll('[data-ratio-delete]').forEach((button) => {
    button.addEventListener('click', async () => {
      const name = button.dataset.ratioDelete || '';
      if (!name || !window.confirm(`Delete ratio "${name}"?`)) {
        return;
      }

      delete state.ratios[name];
      if (state.selectedRatioName === name) {
        setRatioForm();
      }
      await saveRatiosToDisk();
      renderRatios();
      syncDirtyState();
    });
  });
}

function getDuplicateRatioName(name) {
  const baseName = `${name} (Duplicate)`;
  if (!state.ratios[baseName]) {
    return baseName;
  }

  let duplicateIndex = 2;
  while (state.ratios[`${name} (Duplicate ${duplicateIndex})`]) {
    duplicateIndex += 1;
  }

  return `${name} (Duplicate ${duplicateIndex})`;
}

async function duplicateRatio(name) {
  const sourceRatio = state.ratios[name];
  if (!name || !sourceRatio) {
    return;
  }

  const nextName = getDuplicateRatioName(name);
  state.ratios[nextName] = {
    formula: String(sourceRatio.formula || ''),
    notes: String(sourceRatio.notes || ''),
    row: String(sourceRatio.row || ''),
  };

  await saveRatiosToDisk();
  setRatioForm(nextName, state.ratios[nextName]);
  renderRatios();
}

function insertRatioToken(token) {
  const input = document.activeElement === ratioNotesInput ? ratioNotesInput : ratioFormulaInput;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  const nextValue = `${input.value.slice(0, start)}${token}${input.value.slice(end)}`;
  input.value = nextValue;
  input.focus();
  const cursor = start + token.length;
  input.setSelectionRange(cursor, cursor);
  syncRatioPreview();
  renderFormulaHighlight();
  syncDirtyState();
}

function handlePrefixButton(prefix) {
  const normalizedPrefix = String(prefix || '').trim().toUpperCase();
  if (!normalizedPrefix) {
    return;
  }

  if (state.ratioLinePanel.open && state.ratioLinePanel.kind === normalizedPrefix) {
    clearRatioSelectionToken();
    closeRatioLinePanel();
    closeRatioModePanel();
    return;
  }

  openRatioLinePanel(normalizedPrefix);
  openRatioModePanel('', normalizedPrefix);
}

function insertSelectedLineWithMode(selectedMode, selectedLine, selectedKind, insertAt) {
  const line = String(selectedLine || '').trim();
  if (!line) {
    return;
  }

  const targetInsertAt = Number.isFinite(insertAt) ? insertAt : (state.ratioLinePanel.insertAt || (ratioFormulaInput.selectionStart ?? ratioFormulaInput.value.length));
  const currentValue = getFormulaText();
  const modeLabel = selectedMode && selectedMode !== 'latest' ? ` [${String(selectedMode).toUpperCase()}]` : '';
  const nextValue = `${currentValue.slice(0, targetInsertAt)}${selectedKind}: ${line}${modeLabel}${currentValue.slice(targetInsertAt)}`;
  setFormulaText(nextValue);
  syncRatioPreview();
  renderFormulaHighlight();
  syncDirtyState();
  requestAnimationFrame(placeFormulaCaretAtEnd);
}

function syncRatiosStateFromForm() {
  const name = ratioNameInput.value.trim();
  if (!name) {
    return { ok: false, error: 'Ratio name is required' };
  }

  const originalName = state.ratioEditorOriginalName || name;
  if (originalName && originalName !== name) {
    delete state.ratios[originalName];
  }

  const rawRow = ratioRowInput.value.trim();
  const parsedRow = rawRow ? String(parseInt(rawRow, 10) || '') : '';

  state.ratios[name] = {
    formula: getFormulaText().trim(),
    notes: ratioNotesInput.value.trim(),
    row: parsedRow,
  };

  state.selectedRatioName = name;
  state.ratioEditorMode = 'edit';
  state.ratioEditorOriginalName = name;
  return { ok: true };
}

async function saveRatiosToDisk() {
  try {
    if (!window.finforge) {
      throw new Error('Electron bridge unavailable');
    }

    const nextRatios = normalizeRatios(state.ratios);
    state.ratios = nextRatios;
    const result = await window.finforge.saveRatios(nextRatios);
    if (!result || result.ok !== true) {
      throw new Error(result && result.error ? result.error : 'Unknown save error');
    }
    setStatus('Ratios saved', 'success');
    renderRatios();
    return true;
  } catch (error) {
    setStatus(`Ratio save failed: ${error.message || error}`, 'error');
    return false;
  }
}

async function loadRatiosFromDisk() {
  try {
    if (!window.finforge) {
      throw new Error('Electron bridge unavailable');
    }

    const ratios = normalizeRatios(await window.finforge.loadRatios());
    state.ratios = ratios;
    ratioSearchInput.value = '';
    state.ratioSearch = '';
    
    renderSheetAssignments();
    
    renderRatios();
    if (!state.selectedRatioName || !state.ratios[state.selectedRatioName]) {
      state.selectedRatioName = '';
      state.ratioEditorMode = 'create';
      state.ratioEditorOriginalName = '';
    }
    setStatus(Object.keys(state.ratios).length ? 'Ratios loaded' : 'Ratio store empty', Object.keys(state.ratios).length ? 'success' : 'warning');
    state.lastSavedRatiosSnapshot = snapshotRatios();
  } catch (error) {
    setStatus('Ratios loaded with fallback', 'warning');
    state.ratios = {};
    state.sheetRatios = [];
    renderRatios();
    state.selectedRatioName = '';
    state.ratioEditorMode = 'create';
    state.ratioEditorOriginalName = '';
  }
}

async function loadSheetRatiosFromDisk() {
  try {
    const result = await window.finforge.loadSheetRatios();
    if (result && result.ok && Array.isArray(result.names)) {
      state.sheetRatios = result.names;
    } else {
      state.sheetRatios = [];
    }
  } catch {
    state.sheetRatios = [];
  }
  renderSheetAssignments();
}

async function toggleRatioInSheet(ratioName) {
  if (!ratioName || !window.finforge) return;
  
  const isCurrentlyInSheet = state.sheetRatios.includes(ratioName);
  let updatedList;
  
  if (isCurrentlyInSheet) {
    updatedList = state.sheetRatios.filter((n) => n !== ratioName);
  } else {
    updatedList = [...state.sheetRatios, ratioName];
  }
  
  const result = await window.finforge.syncAssignedRatios(updatedList);
  if (result && result.ok) {
    state.sheetRatios = updatedList;
    renderSheetAssignments();
    setStatus(
      isCurrentlyInSheet ? `Removed '${ratioName}' from Column A` : `Added '${ratioName}' to Column A`,
      'success'
    );
  } else {
    setStatus(`Failed to update Column A: ${result?.error || 'unknown error'}`, 'error');
  }
}

function renderSheetAssignments() {
  if (!sheetRatioList) return;
  // Show all ratios; ones with a row number sort by it, the rest sort last
  const entries = Object.entries(state.ratios)
    .map(([name, ratio]) => {
      const row = parseInt(String(ratio && typeof ratio === 'object' ? ratio.row || '' : ''), 10);
      return { name, row: isFinite(row) ? row : Infinity };
    })
    .sort((a, b) => a.row - b.row);

  if (!entries.length) {
    sheetRatioList.innerHTML = '<div class="text-[10px] text-on-surface-variant px-1 py-2">No ratios exist yet. Create a ratio in the Ratio Maker tab.</div>';
    return;
  }
  const dupMap = getDuplicateRowMap();

  // Build list: name + editable row input
  sheetRatioList.innerHTML = entries.map(({ name, row }) => {
    const rowStr = row === Infinity ? '' : String(row);
    const rowDups = rowStr && dupMap[rowStr] ? dupMap[rowStr].filter((n) => n !== name) : [];
    const isDup = rowDups.length > 0;
    const dupTitle = isDup ? `Duplicate row: ${rowDups.join(', ')}` : '';
    return `
      <div class="border border-outline-variant bg-surface-container px-2 py-1.5 flex items-center justify-between gap-2" data-sheet-ratio="${escapeHtml(name)}">
        <span class="text-[10px] text-on-surface mono truncate min-w-0">${escapeHtml(name)}</span>
        <input class="sheet-row-input w-14 h-5 bg-surface-container-lowest px-1 text-[9px] font-label-md text-label-md text-on-surface placeholder:text-outline-variant outline-none mono text-center shrink-0 ${isDup ? 'border-error text-error' : 'border-outline-variant focus:border-secondary'}" type="number" min="7" placeholder="N/A" value="${escapeHtml(rowStr)}" data-sheet-ratio-row="${escapeHtml(name)}" title="${escapeHtml(dupTitle)}"/>
      </div>
    `;
  }).join('');

  // Bind change events on row inputs
  sheetRatioList.querySelectorAll('[data-sheet-ratio-row]').forEach((input) => {
    input.addEventListener('change', async () => {
      const name = input.dataset.sheetRatioRow || '';
      const rawVal = input.value.trim();
      const parsedVal = rawVal ? String(parseInt(rawVal, 10) || '') : '';
      if (state.ratios[name]) {
        state.ratios[name] = { ...state.ratios[name], row: parsedVal };
        await saveRatiosToDisk();
        renderSheetAssignments(); // re-render with new sort order
      }
    });
  });
}

function getDuplicateRowMap() {
  const rowMap = {};
  Object.entries(state.ratios).forEach(([name, ratio]) => {
    const row = ratio && typeof ratio === 'object' ? String(ratio.row || '') : '';
    if (!row) return;
    if (!rowMap[row]) rowMap[row] = [];
    rowMap[row].push(name);
  });
  return rowMap;
}

function getSelectedItems(scope) {
  return state.settings[scopeKeys[scope]].selected;
}

function getCatalogItems(scope) {
  return Array.isArray(state.catalog[scopeKeys[scope]]) ? state.catalog[scopeKeys[scope]] : [];
}

function renderScopeButtons() {
  scopeButtons.forEach((button) => {
    const isActive = button.dataset.scope === state.scope;
    if (isActive) {
      button.className = 'scope-button px-2 py-[2px] bg-primary/10 text-primary border border-primary font-label-md text-label-md';
    } else {
      button.className = 'scope-button px-2 py-[2px] border border-outline-variant text-on-surface-variant font-label-md text-label-md';
    }
  });
}

function renderCatalog() {
  const items = getCatalogItems(state.scope).filter((item) => item.toLowerCase().includes(state.search));
  const selected = new Set(getSelectedItems(state.scope));

  catalogCount.textContent = `${items.length} fields`;
  catalogList.innerHTML = items.length
    ? items.map((item) => {
        const isSelected = selected.has(item);
        return `
          <button class="w-full text-left px-md py-2 transition-colors flex items-center justify-between gap-md" data-item="${item.replaceAll('"', '&quot;')}" data-selected="${isSelected ? 'true' : 'false'}">
            <div class="min-w-0">
              <div class="text-body-sm text-on-surface mono truncate">${item}</div>
            </div>
            <div class="catalog-state text-[9px] uppercase mono px-1 py-[1px] border ${isSelected ? 'border-secondary text-secondary' : 'border-outline-variant text-outline'}">${isSelected ? 'Selected' : 'Add'}</div>
          </button>
        `;
      }).join('')
    : '<div class="p-md text-body-sm text-on-surface-variant">No fields match the filter.</div>';

  catalogList.querySelectorAll('[data-item]').forEach((button) => {
    const isSelected = button.dataset.selected === 'true';
    const stateLabel = button.querySelector('.catalog-state');

    const applyDefaultState = () => {
      if (isSelected) {
        if (stateLabel) {
          stateLabel.textContent = 'Selected';
          stateLabel.style.borderColor = '#4edea3';
          stateLabel.style.color = '#4edea3';
        }
      } else {
        if (stateLabel) {
          stateLabel.textContent = 'Add';
          stateLabel.style.borderColor = '#424754';
          stateLabel.style.color = '#8c909f';
        }
      }
    };

    const applyHoverState = () => {
      if (isSelected) {
        if (stateLabel) {
          stateLabel.textContent = 'Remove';
          stateLabel.style.borderColor = '#ffb4ab';
          stateLabel.style.color = '#ffb4ab';
        }
      } else {
        if (stateLabel) {
          stateLabel.textContent = 'Add';
          stateLabel.style.borderColor = '#4edea3';
          stateLabel.style.color = '#4edea3';
        }
      }
    };

    applyDefaultState();
    button.addEventListener('mouseenter', applyHoverState);
    button.addEventListener('mouseleave', applyDefaultState);
    button.addEventListener('click', () => {
      toggleItem(state.scope, button.dataset.item || '');
    });
  });
}

function renderSelected() {
  const selectedItems = getSelectedItems(state.scope);
  const selected = selectedItems.filter((item) => item.toLowerCase().includes(state.selectedSearch));
  selectedCount.textContent = `${selected.length} selected`;
  selectedList.innerHTML = selected.length
    ? selected.map((item) => {
        const itemIndex = selectedItems.indexOf(item);
        const moveUpDisabled = itemIndex <= 0;
        const moveDownDisabled = itemIndex < 0 || itemIndex >= selectedItems.length - 1;

        return `
          <div class="selected-row w-full px-md py-2 flex items-center justify-between gap-md text-left transition-colors" data-item="${item.replaceAll('"', '&quot;')}">
            <div class="min-w-0 flex-1">
              <div class="text-body-sm text-on-surface mono truncate">${item}</div>
            </div>
            <div class="flex items-center gap-xs shrink-0">
              <button class="selected-move-btn w-5 h-5 flex items-center justify-center border border-outline-variant text-outline text-[10px] mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed" data-move="up" data-item="${item.replaceAll('"', '&quot;')}" aria-label="Move ${item} up" ${moveUpDisabled ? 'disabled' : ''}>&uarr;</button>
              <button class="selected-move-btn w-5 h-5 flex items-center justify-center border border-outline-variant text-outline text-[10px] mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed" data-move="down" data-item="${item.replaceAll('"', '&quot;')}" aria-label="Move ${item} down" ${moveDownDisabled ? 'disabled' : ''}>&darr;</button>
              <button class="selected-remove-btn text-[9px] uppercase mono px-1 py-[1px] border border-outline-variant text-outline" data-remove="${item.replaceAll('"', '&quot;')}">Remove</button>
            </div>
          </div>
        `;
      }).join('')
    : '<div class="p-md text-body-sm text-on-surface-variant">No lines selected for printing.</div>';

  selectedList.querySelectorAll('[data-move]').forEach((button) => {
    button.addEventListener('click', () => {
      moveItem(state.scope, button.dataset.item || '', button.dataset.move || 'up');
    });
  });

  selectedList.querySelectorAll('[data-remove]').forEach((button) => {
    const applyDefaultState = () => {
      button.style.backgroundColor = 'transparent';
      button.style.boxShadow = 'none';
      button.style.borderColor = '#424754';
      button.style.color = '#8c909f';
    };

    const applyHoverState = () => {
      button.style.backgroundColor = 'transparent';
      button.style.boxShadow = 'none';
      button.style.borderColor = '#ffb4ab';
      button.style.color = '#ffb4ab';
    };

    applyDefaultState();
    button.addEventListener('mouseenter', applyHoverState);
    button.addEventListener('mouseleave', applyDefaultState);
    button.addEventListener('click', () => {
      toggleItem(state.scope, button.dataset.remove || '');
    });
  });
}

function renderDisplay() {
  displayMode.value = state.settings.display.mode || 'millions';
  displayDivisor.value = Number(state.settings.display.divisor || 1000000);
}

function renderAll() {
  renderBreadcrumbs();
  renderScopeButtons();
  renderDisplay();
  renderImportListPage();
  renderCompanyPage();
  renderCatalog();
  renderSelected();
  renderRatios();
  renderRatioLinePanel();
  renderRatioModePanel();
  renderRatioFieldPicker();
  renderFormulaHighlight();
}

function toggleItem(scope, item) {
  if (!item) {
    return;
  }

  const key = scopeKeys[scope];
  const selected = new Set(state.settings[key].selected);
  if (selected.has(item)) {
    selected.delete(item);
  } else {
    selected.add(item);
  }

  state.settings[key].selected = Array.from(selected);
  renderCatalog();
  renderSelected();
  syncDirtyState();
}

function moveItem(scope, item, direction) {
  if (!item) {
    return;
  }

  const key = scopeKeys[scope];
  const selected = [...state.settings[key].selected];
  const currentIndex = selected.indexOf(item);

  if (currentIndex < 0) {
    return;
  }

  const targetIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1;
  if (targetIndex < 0 || targetIndex >= selected.length) {
    return;
  }

  const [movedItem] = selected.splice(currentIndex, 1);
  selected.splice(targetIndex, 0, movedItem);

  state.settings[key].selected = selected;
  renderSelected();
  syncDirtyState();
}

function setScope(scope) {
  state.scope = scope;
  state.settings.mode = scope;
  renderAll();
  syncDirtyState();
}

async function loadFromDisk() {
  try {
    if (!window.finforge) {
      throw new Error('Electron bridge unavailable');
    }

    const catalog = await window.finforge.loadStatementCatalog();
    const importList = await window.finforge.loadImportList();
    const settings = normalizeSettings(await window.finforge.loadStatementSettings());
    const embeddedCatalog = loadEmbeddedCatalogFallback();
    const resolvedCatalog = catalog && typeof catalog === 'object' ? catalog : embeddedCatalog;

    state.catalog = {
      balanceSheet: Array.isArray(resolvedCatalog.balanceSheet) && resolvedCatalog.balanceSheet.length ? resolvedCatalog.balanceSheet : embeddedCatalog.balanceSheet,
      incomeStatement: Array.isArray(resolvedCatalog.incomeStatement) && resolvedCatalog.incomeStatement.length ? resolvedCatalog.incomeStatement : embeddedCatalog.incomeStatement,
      cashFlow: Array.isArray(resolvedCatalog.cashFlow) && resolvedCatalog.cashFlow.length ? resolvedCatalog.cashFlow : embeddedCatalog.cashFlow,
    };
    state.settings = settings;
    state.scope = settings.mode;
    state.importList = normalizeImportTickers(importList && importList.tickers);
    state.importSearch = '';
    state.importSearchResults = [];
    state.importSearchLoading = false;
    state.importSearchStatus = 'Type a ticker or company name to search';
    searchInput.value = '';
    selectedSearchInput.value = '';
    if (importSearchInput) {
      importSearchInput.value = '';
    }
    state.search = '';
    state.selectedSearch = '';
    state.selectedCompany = { ticker: '', companyName: '' };
    state.companyProfile = null;
    state.companyProfileLoading = false;
    state.companyProfileError = '';
    state.companyProfileRequestId = 0;
    setStatus(state.catalog.balanceSheet.length || state.catalog.incomeStatement.length || state.catalog.cashFlow.length ? 'Loaded' : 'Catalog empty', state.catalog.balanceSheet.length || state.catalog.incomeStatement.length || state.catalog.cashFlow.length ? 'success' : 'warning');
    renderAll();
    state.lastSavedSnapshot = snapshotSettings();
    state.isDirty = false;
    updateSaveStatus(true);
    await loadRatiosFromDisk();
    // Check data status for all saved tickers
    void refreshAllTickerStatuses();
  } catch (error) {
    state.catalog = loadEmbeddedCatalogFallback();
    state.importList = [];
    state.selectedCompany = { ticker: '', companyName: '' };
    state.companyProfile = null;
    state.companyProfileLoading = false;
    state.companyProfileError = '';
    state.companyProfileRequestId = 0;
    setStatus('Loaded fallback', 'warning');
    renderAll();
    state.lastSavedSnapshot = snapshotSettings();
    state.isDirty = false;
    updateSaveStatus(true);
    await loadRatiosFromDisk();
    // Check data status for all saved tickers
    void refreshAllTickerStatuses();
  }
}

async function saveToDisk() {
  try {
    if (!window.finforge) {
      throw new Error('Electron bridge unavailable');
    }

    const nextSettings = {
      mode: state.scope,
      display: {
        mode: displayMode.value,
        divisor: Number(displayDivisor.value) || 1,
      },
      balanceSheet: { selected: state.settings.balanceSheet.selected },
      incomeStatement: { selected: state.settings.incomeStatement.selected },
      cashFlow: { selected: state.settings.cashFlow.selected },
    };

    state.settings = normalizeSettings(nextSettings);
    state.settings.mode = state.scope;
    const result = await window.finforge.saveStatementSettings(state.settings);
    if (!result || result.ok !== true) {
      throw new Error(result && result.error ? result.error : 'Unknown save error');
    }
    state.lastSavedSnapshot = snapshotSettings();
    state.isDirty = false;
    updateSaveStatus(true);
    renderAll();
    return true;
  } catch (error) {
    setStatus(`Save failed: ${error.message || error}`, 'error');
    return false;
  }
}

async function runStatementImport() {
  if (!window.finforge) {
    throw new Error('Electron bridge unavailable');
  }

  const originalButtonText = importButton ? importButton.textContent : '';

  // Show visible feedback on the button itself
  if (importButton) {
    importButton.disabled = true;
    importButton.textContent = 'Importing...';
    importButton.style.opacity = '0.6';
  }

  try {
    const saved = await saveToDisk();
    if (!saved) {
      if (importButton) {
        importButton.textContent = 'Save failed';
        importButton.style.background = '#93000a';
        importButton.style.color = '#ffb4ab';
        setTimeout(() => {
          importButton.textContent = originalButtonText;
          importButton.style.background = '';
          importButton.style.color = '';
          importButton.style.opacity = '';
        }, 3000);
      }
      return false;
    }

    setStatus(`Importing ${scopeLabels[state.scope].toLowerCase()}...`, 'warning');
    const result = await window.finforge.importStatement(state.scope);
    if (!result || result.ok !== true) {
      throw new Error(result && result.error ? result.error : 'Unknown import error');
    }

    setStatus(`${scopeLabels[state.scope]} imported`, 'success');
    if (importButton) {
      importButton.textContent = 'Done!';
      importButton.style.background = '#00a572';
      importButton.style.color = '#003824';
      setTimeout(() => {
        importButton.textContent = originalButtonText;
        importButton.style.background = '';
        importButton.style.color = '';
        importButton.style.opacity = '';
      }, 2000);
    }
    return true;
  } catch (error) {
    setStatus(`Import failed: ${error.message || error}`, 'error');
    if (importButton) {
      importButton.textContent = 'Failed';
      importButton.style.background = '#93000a';
      importButton.style.color = '#ffb4ab';
      setTimeout(() => {
        importButton.textContent = originalButtonText;
        importButton.style.background = '';
        importButton.style.color = '';
        importButton.style.opacity = '';
      }, 4000);
    }
    return false;
  } finally {
    if (importButton) {
      importButton.disabled = false;
    }
  }
}

scopeButtons.forEach((button) => {
  button.addEventListener('click', () => setScope(button.dataset.scope || 'balanceSheet'));
});

navButtons.forEach((button) => {
  button.addEventListener('click', () => setActivePage(button.dataset.page || 'search'));
});

if (breadcrumbBar) {
  breadcrumbBar.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-page]');
    if (!button) {
      return;
    }

    setActivePage(button.dataset.page || 'search');
  });
}

if (importSearchInput) {
  importSearchInput.addEventListener('input', () => {
    void queueImportSearch(importSearchInput.value);
  });
}

if (importSearchClearButton) {
  importSearchClearButton.addEventListener('click', () => {
    if (importSearchInput) {
      importSearchInput.value = '';
      importSearchInput.focus();
    }

    void queueImportSearch('');
  });
}

if (importSearchResults) {
  importSearchResults.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-import-add]');
    if (!button) {
      const companyContainer = event.target.closest('[data-company-open]');
      if (!companyContainer) {
        return;
      }

      void loadSelectedCompanyProfile(
        companyContainer.dataset.companyOpen || '',
        companyContainer.dataset.companyName || companyContainer.dataset.companyOpen || ''
      );
      return;
    }

    const ticker = button.dataset.importAdd || '';
    if (!addImportTicker(ticker)) {
      return;
    }

    renderImportListPage();

    try {
      await saveImportListToDisk();
      if (state.importSearch) {
        void queueImportSearch(state.importSearch);
      }
    } catch (error) {
      setStatus(`Import list save failed: ${error.message || error}`, 'error');
    }

    // Check data status silently — no auto-fetch
    state.tickerDataStatus[ticker] = 'checking';
    renderImportListPage();
    void updateTickerDataStatus(ticker);
  });
}

if (importSelectedList) {
  importSelectedList.addEventListener('click', async (event) => {
    const fetchButton = event.target.closest('button[data-import-fetch]');
    if (fetchButton) {
      const ticker = fetchButton.dataset.importFetch || '';
      if (ticker) {
        void retryFetchTickerData(ticker);
      }
      return;
    }

    const refetchButton = event.target.closest('button[data-import-refetch]');
    if (refetchButton) {
      const ticker = refetchButton.dataset.importRefetch || '';
      if (ticker) {
        void retryFetchTickerData(ticker);
      }
      return;
    }

    const removeButton = event.target.closest('button[data-import-remove]');
    if (removeButton) {
      if (!removeImportTicker(removeButton.dataset.importRemove || '')) {
        return;
      }

      renderImportListPage();

      try {
        await saveImportListToDisk();
        if (state.importSearch) {
          void queueImportSearch(state.importSearch);
        }
      } catch (error) {
        setStatus(`Import list save failed: ${error.message || error}`, 'error');
      }
      return;
    }

    const companyContainer = event.target.closest('[data-company-open]');
    if (companyContainer) {
      void loadSelectedCompanyProfile(
        companyContainer.dataset.companyOpen || '',
        companyContainer.dataset.companyName || companyContainer.dataset.companyOpen || ''
      );
    }
  });
}

if (importClearButton) {
  importClearButton.addEventListener('click', async () => {
    if (!state.importList.length) {
      return;
    }

    state.importList = [];
    renderImportListPage();

    try {
      await saveImportListToDisk();
      if (state.importSearch) {
        void queueImportSearch(state.importSearch);
      }
    } catch (error) {
      setStatus(`Import list save failed: ${error.message || error}`, 'error');
    }
  });
}

if (importFetchAllButton) {
  importFetchAllButton.addEventListener('click', () => {
    if (!state.importList.length) {
      setStatus('No tickers to fetch', 'warning');
      return;
    }
    fetchAllTickerData();
  });
}

const importRefetchAllButton = document.getElementById('import-refetch-all-button');
if (importRefetchAllButton) {
  importRefetchAllButton.addEventListener('click', () => {
    if (!state.importList.length) {
      setStatus('No tickers to refetch', 'warning');
      return;
    }
    refetchAllTickerData();
  });
}

searchInput.addEventListener('input', () => {
  state.search = searchInput.value.trim().toLowerCase();
  renderCatalog();
});

selectedSearchInput.addEventListener('input', () => {
  state.selectedSearch = selectedSearchInput.value.trim().toLowerCase();
  renderSelected();
});

saveButton.addEventListener('click', saveToDisk);
if (importButton) {
  importButton.addEventListener('click', runStatementImport);
}
refreshButton.addEventListener('click', loadFromDisk);
displayMode.addEventListener('change', () => {
  state.settings.display.mode = displayMode.value;
  if (displayMode.value === 'thousands') {
    displayDivisor.value = '1000';
  } else if (displayMode.value === 'millions') {
    displayDivisor.value = '1000000';
  } else if (displayMode.value === 'billions') {
    displayDivisor.value = '1000000000';
  }
  syncDirtyState();
});
displayDivisor.addEventListener('change', () => {
  state.settings.display.divisor = Number(displayDivisor.value) || 1;
  if (!['thousands', 'millions', 'billions'].includes(displayMode.value)) {
    displayMode.value = 'custom';
  }
  syncDirtyState();
});

ratioTokenButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const token = button.dataset.token || '';
    const normalizedToken = token.trim();
    if (/^(BS|IS|P|RATIO)$/.test(normalizedToken)) {
      openRatioLinePanel(normalizedToken);
      return;
    }

    insertRatioToken(token);
  });
});

ratioPrefixButtons.forEach((button) => {
  button.addEventListener('click', () => handlePrefixButton(button.dataset.prefix || ''));
});

ratioFormulaInput.addEventListener('input', () => {
  protectFormulaEquals();
  renderFormulaHighlight();
  syncRatioPreview();
});
ratioFormulaInput.addEventListener('scroll', syncFormulaHighlightScroll);

ratioFormulaInput.addEventListener('beforeinput', (event) => {
  // Block free-text typing — only allow operators, brackets, whitespace, and numbers.
  // Tokens (like "P: Close Price") must be inserted via the prefix/line-panel buttons.
  if (event.inputType === 'insertText' && event.data) {
    if (!/^[+\-*/()\s\d.]+$/.test(event.data)) {
      event.preventDefault();
    }
  }
});

ratioNameInput.addEventListener('input', syncRatioPreview);
ratioNotesInput.addEventListener('input', syncRatioPreview);
ratioRowInput.addEventListener('input', syncRatioPreview);

ratioSearchInput.addEventListener('input', () => {
  state.ratioSearch = ratioSearchInput.value.trim();
  renderRatios();
});

ratioResetButton.addEventListener('click', () => {
  setRatioForm();
  closeRatioLinePanel();
  closeRatioFieldPicker();
  closeRatioModePanel();
});

ratioCancelButton.addEventListener('click', () => {
  cancelRatioEdit();
  closeRatioLinePanel();
  closeRatioFieldPicker();
  closeRatioModePanel();
});

if (ratioRefreshButton) {
  ratioRefreshButton.addEventListener('click', async () => {
    try {
      if (!window.finforge || typeof window.finforge.refreshRatiosSheet !== 'function') {
        throw new Error('Ratios refresh action is unavailable');
      }

      setStatus('Refreshing ratios sheet...', 'warning');
      const result = await window.finforge.refreshRatiosSheet();
      if (!result || result.ok !== true) {
        throw new Error(result && result.error ? result.error : 'Unknown refresh error');
      }

      setStatus('Ratios sheet refreshed', 'success');
    } catch (error) {
      const message = String(error && error.message ? error.message : error);
      if (message.includes('No handler registered for') || message.includes('Error invoking remote method')) {
        setStatus('Ratios refresh unavailable. Close and relaunch FinForge Home.', 'error');
        return;
      }

      setStatus(`Ratio refresh failed: ${message}`, 'error');
    }
  });
}
ratioCreateButton.addEventListener('click', () => setRatioForm());
ratioListBackButton.addEventListener('click', () => {
  setRatioWorkspaceView('list');
  closeRatioFieldPicker();
  closeRatioLinePanel();
  closeRatioModePanel();
});

ratioSaveButton.addEventListener('click', async () => {
  const result = syncRatiosStateFromForm();
  if (!result.ok) {
    setStatus(result.error, 'error');
    return;
  }

  const saved = await saveRatiosToDisk();
  if (saved) {
    setRatioForm(state.selectedRatioName, state.ratios[state.selectedRatioName]);
  }
});

ratioFieldPickerSearch.addEventListener('input', () => {
  state.ratioFieldPicker.search = ratioFieldPickerSearch.value;
  renderRatioFieldPicker();
});

ratioFieldPickerClose.addEventListener('click', closeRatioFieldPicker);
ratioLinePanelClose.addEventListener('click', closeRatioLinePanel);
ratioModePanelClose.addEventListener('click', closeRatioModePanel);

if (ratioLinePanelSearch) {
  ratioLinePanelSearch.addEventListener('input', () => {
    state.ratioLinePanel.search = ratioLinePanelSearch.value;
    renderRatioLinePanel();
  });

  ratioLinePanelSearch.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeRatioLinePanel();
      closeRatioModePanel();
      ratioFormulaInput.focus();
    }
  });
}

ratioFieldPickerSearch.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeRatioFieldPicker();
    ratioFormulaInput.focus();
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    const firstChoice = ratioFieldPickerList.querySelector('[data-picker-item]');
    if (firstChoice) {
      insertPickedField(firstChoice.dataset.pickerItem || '');
    }
  }
});

function deleteAtomicToken(direction) {
  // direction: 'backward' (Backspace) or 'forward' (Delete)
  const rawValue = ratioFormulaInput.value;
  const pos = ratioFormulaInput.selectionStart ?? 0;
  const end = ratioFormulaInput.selectionEnd ?? 0;
  const text = normalizeFormulaText(rawValue);
  const prefixLen = rawValue.length - text.length;

  // If there's a selection, let the browser handle it normally
  if (pos !== end) {
    return false;
  }

  // Adjust cursor position into normalized-text space
  const normPos = pos - prefixLen;
  if (normPos < 0) return false;

  if (direction === 'backward') {
    if (normPos <= 0) return false;

    // Check if cursor is inside a token or right after one
    let token = findTokenAtPosition(text, normPos) || findTokenAtPosition(text, normPos - 1);
    if (token) {
      const newText = text.slice(0, token.start) + text.slice(token.end);
      setFormulaText(newText);
      // Recalculate prefix offset after value change
      const newPrefixLen = ratioFormulaInput.value.length - normalizeFormulaText(ratioFormulaInput.value).length;
      ratioFormulaInput.setSelectionRange(token.start + newPrefixLen, token.start + newPrefixLen);
      renderFormulaHighlight();
      syncRatioPreview();
      syncDirtyState();
      return true;
    }
  } else if (direction === 'forward') {
    if (normPos >= text.length) return false;

    // Check if cursor is inside a token
    const token = findTokenAtPosition(text, normPos);
    if (token) {
      const newText = text.slice(0, token.start) + text.slice(token.end);
      setFormulaText(newText);
      const newPrefixLen = ratioFormulaInput.value.length - normalizeFormulaText(ratioFormulaInput.value).length;
      ratioFormulaInput.setSelectionRange(token.start + newPrefixLen, token.start + newPrefixLen);
      renderFormulaHighlight();
      syncRatioPreview();
      syncDirtyState();
      return true;
    }
  }

  return false;
}

ratioFormulaInput.addEventListener('keydown', (event) => {
  if (event.key === 'Backspace') {
    const selectionStart = ratioFormulaInput.selectionStart ?? 0;
    const selectionEnd = ratioFormulaInput.selectionEnd ?? 0;
    if (selectionStart === 0 && selectionEnd === 0) {
      event.preventDefault();
      return;
    }
    if (deleteAtomicToken('backward')) {
      event.preventDefault();
      return;
    }
  }

  if (event.key === 'Delete') {
    if (deleteAtomicToken('forward')) {
      event.preventDefault();
      return;
    }
  }

  if (event.key === 'Home') {
    event.preventDefault();
    ratioFormulaInput.setSelectionRange(0, 0);
    return;
  }

  if (event.key === 'ArrowLeft') {
    const selectionStart = ratioFormulaInput.selectionStart ?? 0;
    if (selectionStart <= 0) {
      event.preventDefault();
      ratioFormulaInput.setSelectionRange(0, 0);
      return;
    }
  }

  if (event.key === 'Escape' && state.ratioFieldPicker.open) {
    closeRatioFieldPicker();
  }
});

// --- Font Size Control ---
const FONT_SCALE_KEY = 'finforge_font_scale';
const FONT_SCALES = ['0.85', '1', '1.15', '1.3', '1.5', '1.75', '2'];
const FONT_SCALE_LABELS = { '0.85': '0.85', '1': '1.0', '1.15': '1.15', '1.3': '1.3', '1.5': '1.5', '1.75': '1.75', '2': '2.0' };

function getFontScaleIndex(scale) {
  const idx = FONT_SCALES.indexOf(scale);
  return idx >= 0 ? idx : 1;
}

function applyFontScale(scale) {
  document.body.setAttribute('data-font-scale', scale);
  const labels = document.querySelectorAll('.font-size-label');
  const display = FONT_SCALE_LABELS[scale] || scale;
  labels.forEach(function(el) { el.textContent = display; });
  try {
    localStorage.setItem(FONT_SCALE_KEY, scale);
  } catch (e) {
    // localStorage unavailable
  }
}

function decreaseFontScale() {
  const current = document.body.getAttribute('data-font-scale') || '1';
  const idx = getFontScaleIndex(current);
  const prev = idx > 0 ? FONT_SCALES[idx - 1] : FONT_SCALES[0];
  applyFontScale(prev);
}

function increaseFontScale() {
  const current = document.body.getAttribute('data-font-scale') || '1';
  const idx = getFontScaleIndex(current);
  const next = idx < FONT_SCALES.length - 1 ? FONT_SCALES[idx + 1] : FONT_SCALES[FONT_SCALES.length - 1];
  applyFontScale(next);
}

// Initialize font scale from localStorage
(function initFontScale() {
  let savedScale = '1';
  try {
    savedScale = localStorage.getItem(FONT_SCALE_KEY) || '1';
  } catch (e) {
    // localStorage unavailable
  }
  if (!FONT_SCALES.includes(savedScale)) {
    savedScale = '1';
  }
  applyFontScale(savedScale);
})();

// ── Format Settings (Number, Date, Time) ──
const NUM_SEP_KEY = 'finforge_num_sep';
const DATE_FMT_KEY = 'finforge_date_fmt';
const TIME_FMT_KEY = 'finforge_time_fmt';

var formatState = {
  numSep: ',',
  dateFmt: 'eu',
  timeFmt: '24h',
};

function getThousandsSeparator() {
  return formatState.numSep;
}

function formatNumberWithSep(value, decimals) {
  var num = Number(value);
  if (!Number.isFinite(num)) return String(value);
  var maxDec = typeof decimals === 'number' ? decimals : 2;
  var formatted = num.toFixed(maxDec);
  // Strip trailing zeros after decimal, but keep at least one decimal if there's a fraction
  if (maxDec > 0) {
    formatted = String(Number(formatted));
  }
  var parts = formatted.split('.');
  var intPart = parts[0];
  var sep = getThousandsSeparator();
  var result = '';
  for (var i = intPart.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) result = sep + result;
    result = intPart[i] + result;
  }
  return parts.length > 1 ? result + '.' + parts[1] : result;
}

function refreshFormattedContent() {
  // Re-render the company page if it's currently visible so new formats apply
  if (state.page === 'company' && !state.companyProfileLoading && state.companyProfile) {
    renderCompanyPage();
  }
}

function applyNumSep(sep) {
  formatState.numSep = sep;
  try { localStorage.setItem(NUM_SEP_KEY, sep); } catch (e) {}
  updateFormatPreviews();
  refreshFormattedContent();
}

function applyDateFormat(fmt) {
  formatState.dateFmt = fmt === 'us' ? 'us' : 'eu';
  try { localStorage.setItem(DATE_FMT_KEY, formatState.dateFmt); } catch (e) {}
  updateFormatPreviews();
  refreshFormattedContent();
}

function applyTimeFormat(fmt) {
  formatState.timeFmt = fmt === '12h' ? '12h' : '24h';
  try { localStorage.setItem(TIME_FMT_KEY, formatState.timeFmt); } catch (e) {}
  updateFormatPreviews();
  refreshFormattedContent();
}

function updateFormatPreviews() {
  // Number preview
  var numPreview = document.getElementById('settings-num-preview');
  if (numPreview) {
    numPreview.textContent = formatNumberWithSep(1234567.89, 2);
  }
  // Date preview
  var datePreview = document.getElementById('settings-date-preview');
  if (datePreview) {
    var d = new Date(2026, 6, 13); // July 13, 2026
    datePreview.textContent = formatDateValue(d.getTime());
  }
  // Time preview
  var timePreview = document.getElementById('settings-time-preview');
  if (timePreview) {
    var t = new Date(2026, 0, 1, 14, 30, 0); // 14:30
    timePreview.textContent = formatTimeValue(t.getTime());
  }
}

// Load format settings from localStorage
(function initFormatSettings() {
  try {
    var saved = localStorage.getItem(NUM_SEP_KEY);
    if (saved) formatState.numSep = saved;
  } catch (e) {}
  try {
    var saved = localStorage.getItem(DATE_FMT_KEY);
    if (saved === 'us' || saved === 'eu') formatState.dateFmt = saved;
  } catch (e) {}
  try {
    var saved = localStorage.getItem(TIME_FMT_KEY);
    if (saved === '12h' || saved === '24h') formatState.timeFmt = saved;
  } catch (e) {}
})();

// Font size button handlers
document.querySelectorAll('#font-size-minus, #launcher-font-size-minus, #settings-font-minus').forEach(function(btn) {
  if (btn) { btn.addEventListener('click', decreaseFontScale); }
});
document.querySelectorAll('#font-size-plus, #launcher-font-size-plus, #settings-font-plus').forEach(function(btn) {
  if (btn) { btn.addEventListener('click', increaseFontScale); }
});

// ── Template System (Workspace) ──

var templateState = {
  templates: [],
  selectedTemplateId: '',
  editorMode: 'create', // 'create' | 'edit'
  capturedSettings: null,
  capturedRatios: null,
  capturedTickers: null,
  excelTemplateFile: null,
};

var templateListEl = document.getElementById('template-list');
var templateListCountEl = document.getElementById('template-list-count');
var templateNameInput = document.getElementById('template-name-input');
var templateNotesInput = document.getElementById('template-notes-input');
var templateSaveButton = document.getElementById('template-save-button');
var templateCancelButton = document.getElementById('template-cancel-button');
var templateDeleteButton = document.getElementById('template-delete-button');
var templateLoadButton = document.getElementById('template-load-button');
var templateCreateButton = document.getElementById('template-create-button');
var templateCaptureSettingsBtn = document.getElementById('template-capture-settings');
var templateContentsSummaryEl = document.getElementById('template-contents-summary');
var templateEditorTitleEl = document.getElementById('template-editor-title');
var templateEditorModeLabelEl = document.getElementById('template-editor-mode-label');
var templateEditorStatusEl = document.getElementById('template-editor-status');
var templateExcelStatusEl = document.getElementById('template-excel-status');
var templateSaveExcelBtn = document.getElementById('template-save-excel');
var templateOpenExcelBtn = document.getElementById('template-open-excel');
var templateReplaceWorkbookBtn = document.getElementById('template-replace-workbook');
var templateRemoveExcelBtn = document.getElementById('template-remove-excel');
var templateExcelFolderBtn = document.getElementById('template-excel-folder-button');

function generateTemplateId() {
  return 'tpl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

function resetTemplateEditor() {
  templateState.selectedTemplateId = '';
  templateState.editorMode = 'create';
  templateState.capturedSettings = null;
  templateState.capturedRatios = null;
  templateState.capturedTickers = null;
  templateState.excelTemplateFile = null;

  if (templateNameInput) templateNameInput.value = '';
  if (templateNotesInput) templateNotesInput.value = '';
  if (templateEditorTitleEl) templateEditorTitleEl.textContent = 'Create template';
  if (templateEditorModeLabelEl) templateEditorModeLabelEl.textContent = 'New template';
  if (templateEditorStatusEl) templateEditorStatusEl.classList.add('hidden');
  if (templateCancelButton) templateCancelButton.classList.add('hidden');
  if (templateDeleteButton) templateDeleteButton.classList.add('hidden');
  if (templateLoadButton) templateLoadButton.classList.add('hidden');
  if (templateExcelStatusEl) templateExcelStatusEl.textContent = 'None';
  if (templateOpenExcelBtn) templateOpenExcelBtn.classList.add('hidden');
  if (templateReplaceWorkbookBtn) templateReplaceWorkbookBtn.classList.add('hidden');
  if (templateRemoveExcelBtn) templateRemoveExcelBtn.classList.add('hidden');

  renderTemplateContentsSummary();
}

function selectTemplate(templateId) {
  var template = null;
  for (var i = 0; i < templateState.templates.length; i++) {
    if (templateState.templates[i].id === templateId) {
      template = templateState.templates[i];
      break;
    }
  }

  if (!template) {
    resetTemplateEditor();
    return;
  }

  templateState.selectedTemplateId = template.id;
  templateState.editorMode = template.isDefault ? 'view' : 'edit';
  templateState.capturedSettings = template.settings || null;
  templateState.capturedRatios = template.ratios || null;
  templateState.capturedTickers = template.tickers || null;
  templateState.excelTemplateFile = template.excelTemplate || null;

  if (templateNameInput) templateNameInput.value = template.name || '';
  if (templateNotesInput) templateNotesInput.value = template.notes || '';

  var isDefault = template.isDefault;
  var isViewOnly = isDefault;

  if (templateEditorTitleEl) {
    templateEditorTitleEl.textContent = isDefault ? 'Beginning Template (read-only)' : (template.name || 'Edit template');
  }
  if (templateEditorModeLabelEl) {
    templateEditorModeLabelEl.textContent = isDefault ? 'Default template' : 'Edit template';
  }
  if (templateEditorStatusEl) {
    templateEditorStatusEl.textContent = 'Updated: ' + formatDateValue(new Date(template.updatedAt).getTime());
    templateEditorStatusEl.classList.remove('hidden');
  }
  if (templateCancelButton) {
    templateCancelButton.classList.toggle('hidden', isViewOnly);
  }
  if (templateDeleteButton) {
    templateDeleteButton.classList.toggle('hidden', isDefault);
  }
  if (templateLoadButton) {
    templateLoadButton.classList.toggle('hidden', false);
  }
  if (templateSaveButton) {
    templateSaveButton.classList.toggle('hidden', isDefault);
  }
  if (templateNameInput) templateNameInput.disabled = isViewOnly;
  if (templateNotesInput) templateNotesInput.disabled = isViewOnly;
  if (templateCaptureSettingsBtn) templateCaptureSettingsBtn.disabled = isViewOnly;

  if (templateExcelStatusEl) {
    templateExcelStatusEl.textContent = template.excelTemplate || 'None';
  }
  if (templateOpenExcelBtn) {
    templateOpenExcelBtn.classList.toggle('hidden', !template.excelTemplate);
    templateOpenExcelBtn.disabled = isViewOnly && !template.excelTemplate;
  }
  if (templateReplaceWorkbookBtn) {
    templateReplaceWorkbookBtn.classList.toggle('hidden', !template.excelTemplate);
  }
  if (templateRemoveExcelBtn) {
    templateRemoveExcelBtn.classList.toggle('hidden', !template.excelTemplate || isDefault);
  }
  if (templateSaveExcelBtn) {
    templateSaveExcelBtn.disabled = isViewOnly;
  }

  renderTemplateContentsSummary();
  renderTemplateList();
}

function renderTemplateContentsSummary() {
  if (!templateContentsSummaryEl) return;

  var lines = [];
  var settings = templateState.capturedSettings;
  var ratios = templateState.capturedRatios;
  var tickers = templateState.capturedTickers;

  if (settings) {
    var mode = settings.mode === 'incomeStatement' ? 'Income Statement' : 'Balance Sheet';
    var bsCount = (settings.balanceSheet && Array.isArray(settings.balanceSheet.selected)) ? settings.balanceSheet.selected.length : 0;
    var isCount = (settings.incomeStatement && Array.isArray(settings.incomeStatement.selected)) ? settings.incomeStatement.selected.length : 0;
    var displayMode = settings.display ? settings.display.mode : 'unknown';
    lines.push('Statement: ' + mode);
    lines.push('BS lines: ' + bsCount + ', IS lines: ' + isCount);
    lines.push('Display: ' + displayMode);
  }

  if (ratios && typeof ratios === 'object') {
    var ratioKeys = Object.keys(ratios);
    if (ratioKeys.length > 0) {
      lines.push('Ratios: ' + ratioKeys.length);
    }
  }

  if (Array.isArray(tickers) && tickers.length > 0) {
    lines.push('Tickers: ' + tickers.length + ' (' + tickers.slice(0, 5).join(', ') + (tickers.length > 5 ? '...' : '') + ')');
  }

  if (templateState.excelTemplateFile) {
    lines.push('Excel: ' + templateState.excelTemplateFile);
  }

  if (!lines.length) {
    lines.push('No current settings captured.');
  }

  templateContentsSummaryEl.innerHTML = lines.map(function (l) {
    return '<div class="text-[10px] text-on-surface-variant mono">' + escapeHtml(l) + '</div>';
  }).join('');
}

async function captureCurrentSettings() {
  try {
    // Capture current statement settings
    templateState.capturedSettings = {
      mode: state.scope,
      display: {
        mode: String(displayMode.value || 'millions'),
        divisor: Number(displayDivisor.value) || 1000000,
      },
      balanceSheet: { selected: [...state.settings.balanceSheet.selected] },
      incomeStatement: { selected: [...state.settings.incomeStatement.selected] },
    };

    // Capture current ratios
    templateState.capturedRatios = JSON.parse(JSON.stringify(state.ratios));

    // Capture current tickers
    templateState.capturedTickers = [...state.importList];

    renderTemplateContentsSummary();

    if (templateEditorStatusEl) {
      templateEditorStatusEl.textContent = 'Settings captured from current state';
      templateEditorStatusEl.classList.remove('hidden');
    }
  } catch (error) {
    setStatus('Failed to capture settings: ' + (error.message || error), 'error');
  }
}

function renderTemplateList() {
  if (!templateListEl || !templateListCountEl) return;

  templateListCountEl.textContent = templateState.templates.length + ' template' + (templateState.templates.length !== 1 ? 's' : '');

  if (!templateState.templates.length) {
    templateListEl.innerHTML = '<div class="px-md py-3 text-[10px] text-outline mono uppercase">No templates saved yet</div>';
    return;
  }

  templateListEl.innerHTML = templateState.templates.map(function (t) {
    var isSelected = templateState.selectedTemplateId === t.id;
    var isDefault = t.isDefault;
    var borderClass = isSelected ? 'border-secondary' : 'border-outline-variant/25';

    return [
      '<div class="px-md py-2 flex items-center justify-between gap-sm hover:bg-surface-container-high/40 transition-colors cursor-pointer ' + borderClass + '" data-template-select="' + escapeHtml(t.id) + '">',
      '  <div class="min-w-0 flex-1">',
      '    <div class="font-label-md text-label-md text-on-surface mono truncate">' + escapeHtml(t.name || t.id) + (isDefault ? ' <span class="text-[9px] text-outline">(default)</span>' : '') + '</div>',
      '    <div class="text-[9px] text-outline mono truncate">' + escapeHtml((t.notes || '').slice(0, 60)) + '</div>',
      '    <div class="text-[8px] text-outline-variant mono">' + formatDateValue(new Date(t.updatedAt).getTime()) + '</div>',
      '  </div>',
      isDefault ? '' : '<button class="px-2 py-[2px] border border-outline-variant bg-surface-container-high font-label-md text-label-md hover:border-error hover:text-error transition-colors text-[9px]" data-template-delete-list="' + escapeHtml(t.id) + '">Del</button>',
      '</div>',
    ].join('');
  }).join('');

  // Bind select events
  templateListEl.querySelectorAll('[data-template-select]').forEach(function (el) {
    el.addEventListener('click', function () {
      selectTemplate(el.dataset.templateSelect || '');
    });
  });

  // Bind delete events
  templateListEl.querySelectorAll('[data-template-delete-list]').forEach(function (btn) {
    btn.addEventListener('click', async function (e) {
      e.stopPropagation();
      var templateId = btn.dataset.templateDeleteList || '';
      var template = null;
      for (var i = 0; i < templateState.templates.length; i++) {
        if (templateState.templates[i].id === templateId) {
          template = templateState.templates[i];
          break;
        }
      }
      if (!template || template.isDefault) return;
      if (!window.confirm('Delete template "' + template.name + '"?')) return;

      if (!window.finforge || typeof window.finforge.deleteTemplate !== 'function') return;
      var result = await window.finforge.deleteTemplate(templateId);
      if (result && result.ok) {
        templateState.templates = Array.isArray(result.templates) ? result.templates : [];
        if (templateState.selectedTemplateId === templateId) {
          resetTemplateEditor();
        }
        renderTemplateList();
        setStatus('Template deleted', 'success');
      } else {
        setStatus('Delete failed: ' + (result && result.error ? result.error : 'Unknown error'), 'error');
      }
    });
  });
}

async function saveTemplate() {
  var name = (templateNameInput ? templateNameInput.value : '').trim();
  if (!name) {
    setStatus('Template name is required', 'error');
    return;
  }

  if (!window.finforge || typeof window.finforge.saveTemplate !== 'function') {
    setStatus('Template save unavailable', 'error');
    return;
  }

  var isNew = templateState.editorMode === 'create';
  var templateId = isNew ? generateTemplateId() : templateState.selectedTemplateId;
  var now = new Date().toISOString();

  var template = {
    id: templateId,
    name: name,
    notes: templateNotesInput ? templateNotesInput.value.trim() : '',
    isDefault: false,
    createdAt: isNew ? now : undefined,
    updatedAt: now,
    settings: templateState.capturedSettings,
    ratios: templateState.capturedRatios,
    tickers: templateState.capturedTickers,
    excelTemplate: templateState.excelTemplateFile,
  };

  try {
    var result = await window.finforge.saveTemplate(template);
    if (result && result.ok) {
      templateState.templates = Array.isArray(result.templates) ? result.templates : [];
      templateState.selectedTemplateId = templateId;
      templateState.editorMode = 'edit';
      if (templateEditorModeLabelEl) templateEditorModeLabelEl.textContent = 'Edit template';
      if (templateCancelButton) templateCancelButton.classList.remove('hidden');
      if (templateDeleteButton) templateDeleteButton.classList.remove('hidden');
      if (templateEditorStatusEl) {
        templateEditorStatusEl.textContent = 'Saved at ' + formatTimeValue(Date.now());
        templateEditorStatusEl.classList.remove('hidden');
      }
      renderTemplateList();
      setStatus('Template saved', 'success');
    } else {
      setStatus('Save failed: ' + (result && result.error ? result.error : 'Unknown error'), 'error');
    }
  } catch (error) {
    setStatus('Save failed: ' + (error.message || error), 'error');
  }
}

async function loadTemplateToWorkspace(templateId) {
  if (!window.finforge || typeof window.finforge.loadTemplate !== 'function') return;

  try {
    var result = await window.finforge.loadTemplate(templateId);
    if (result && result.ok) {
      setStatus('Template loaded! Reloading workspace...', 'success');
      // Reload all data from disk
      await loadFromDisk();
      await loadSheetRatiosFromDisk();
      renderTemplateList();
    } else {
      setStatus('Load failed: ' + (result && result.error ? result.error : 'Unknown error'), 'error');
    }
  } catch (error) {
    setStatus('Load failed: ' + (error.message || error), 'error');
  }
}

async function loadTemplatesFromDisk() {
  if (!window.finforge || typeof window.finforge.loadTemplates !== 'function') return;

  try {
    var result = await window.finforge.loadTemplates();
    if (result && result.ok) {
      templateState.templates = Array.isArray(result.templates) ? result.templates : [];
      renderTemplateList();
    }
  } catch (_) {}
}

async function saveExcelTemplate() {
  if (!templateState.selectedTemplateId) {
    setStatus('Save the template first before linking an Excel file', 'warning');
    return;
  }

  if (!window.finforge || typeof window.finforge.saveExcelTemplate !== 'function') {
    setStatus('Excel template save unavailable', 'error');
    return;
  }

  try {
    var result = await window.finforge.saveExcelTemplate(templateState.selectedTemplateId);
    if (result && result.ok) {
      templateState.templates = Array.isArray(result.templates) ? result.templates : [];
      templateState.excelTemplateFile = result.excelFile || (templateState.selectedTemplateId + '.xlsm');
      if (templateExcelStatusEl) templateExcelStatusEl.textContent = templateState.excelTemplateFile;
      if (templateOpenExcelBtn) templateOpenExcelBtn.classList.remove('hidden');
      if (templateReplaceWorkbookBtn) templateReplaceWorkbookBtn.classList.remove('hidden');
      if (templateRemoveExcelBtn) templateRemoveExcelBtn.classList.remove('hidden');
      renderTemplateList();
      setStatus('Excel template saved', 'success');
    } else {
      setStatus('Excel save failed: ' + (result && result.error ? result.error : 'Unknown error'), 'error');
    }
  } catch (error) {
    setStatus('Excel save failed: ' + (error.message || error), 'error');
  }
}

async function openExcelTemplate() {
  if (!templateState.excelTemplateFile) return;
  if (!window.finforge || typeof window.finforge.openTemplateExcelFile !== 'function') return;

  try {
    var result = await window.finforge.openTemplateExcelFile(templateState.excelTemplateFile);
    if (result && result.ok) {
      setStatus('Excel template opened', 'success');
    } else {
      setStatus('Failed to open: ' + (result && result.error ? result.error : 'Unknown error'), 'error');
    }
  } catch (error) {
    setStatus('Failed to open: ' + (error.message || error), 'error');
  }
}

async function replaceWorkbookWithTemplate() {
  var templateId = templateState.selectedTemplateId;
  if (!templateId) return;

  var template = null;
  for (var i = 0; i < templateState.templates.length; i++) {
    if (templateState.templates[i].id === templateId) {
      template = templateState.templates[i];
      break;
    }
  }
  if (!template || !template.excelTemplate) {
    setStatus('No Excel template file linked to this template', 'warning');
    return;
  }

  if (!window.confirm('This will replace FinForge.xlsm with a copy of "' + template.excelTemplate + '" and overwrite all current settings (statement lines, tickers, ratios).\n\nAre you sure?')) return;

  if (!window.finforge || typeof window.finforge.replaceWorkbookWithTemplate !== 'function') {
    setStatus('Replace workbook unavailable', 'error');
    return;
  }

  try {
    var result = await window.finforge.replaceWorkbookWithTemplate(templateId);
    if (result && result.ok) {
      setStatus('Workbook replaced with template! You may need to reopen the workbook.', 'success');
    } else {
      setStatus('Replace failed: ' + (result && result.error ? result.error : 'Unknown error'), 'error');
    }
  } catch (error) {
    setStatus('Replace failed: ' + (error.message || error), 'error');
  }
}

async function removeExcelTemplate() {
  var templateId = templateState.selectedTemplateId;
  if (!templateId) return;

  if (!window.confirm('Remove the linked Excel template file from this template? The template metadata will be preserved.')) return;

  if (!window.finforge || typeof window.finforge.deleteExcelTemplate !== 'function') {
    setStatus('Remove Excel template unavailable', 'error');
    return;
  }

  try {
    var result = await window.finforge.deleteExcelTemplate(templateId);
    if (result && result.ok) {
      templateState.templates = Array.isArray(result.templates) ? result.templates : [];
      templateState.excelTemplateFile = null;
      if (templateExcelStatusEl) templateExcelStatusEl.textContent = 'None';
      if (templateOpenExcelBtn) templateOpenExcelBtn.classList.add('hidden');
      if (templateReplaceWorkbookBtn) templateReplaceWorkbookBtn.classList.add('hidden');
      if (templateRemoveExcelBtn) templateRemoveExcelBtn.classList.add('hidden');
      renderTemplateList();
      setStatus('Excel template file removed', 'success');
    } else {
      setStatus('Remove failed: ' + (result && result.error ? result.error : 'Unknown error'), 'error');
    }
  } catch (error) {
    setStatus('Remove failed: ' + (error.message || error), 'error');
  }
}

// ── Template event bindings ──

if (templateCreateButton) {
  templateCreateButton.addEventListener('click', function () {
    resetTemplateEditor();
    renderTemplateList();
  });
}

if (templateSaveButton) {
  templateSaveButton.addEventListener('click', saveTemplate);
}

if (templateCancelButton) {
  templateCancelButton.addEventListener('click', function () {
    resetTemplateEditor();
    renderTemplateList();
  });
}

if (templateDeleteButton) {
  templateDeleteButton.addEventListener('click', async function () {
    var templateId = templateState.selectedTemplateId;
    if (!templateId) return;

    var template = null;
    for (var i = 0; i < templateState.templates.length; i++) {
      if (templateState.templates[i].id === templateId) {
        template = templateState.templates[i];
        break;
      }
    }
    if (!template || template.isDefault) return;
    if (!window.confirm('Delete template "' + template.name + '"?')) return;

    if (!window.finforge || typeof window.finforge.deleteTemplate !== 'function') return;
    var result = await window.finforge.deleteTemplate(templateId);
    if (result && result.ok) {
      templateState.templates = Array.isArray(result.templates) ? result.templates : [];
      resetTemplateEditor();
      renderTemplateList();
      setStatus('Template deleted', 'success');
    } else {
      setStatus('Delete failed: ' + (result && result.error ? result.error : 'Unknown error'), 'error');
    }
  });
}

if (templateCaptureSettingsBtn) {
  templateCaptureSettingsBtn.addEventListener('click', captureCurrentSettings);
}

if (templateLoadButton) {
  templateLoadButton.addEventListener('click', function () {
    if (templateState.selectedTemplateId) {
      loadTemplateToWorkspace(templateState.selectedTemplateId);
    }
  });
}

if (templateSaveExcelBtn) {
  templateSaveExcelBtn.addEventListener('click', saveExcelTemplate);
}

if (templateOpenExcelBtn) {
  templateOpenExcelBtn.addEventListener('click', openExcelTemplate);
}

if (templateReplaceWorkbookBtn) {
  templateReplaceWorkbookBtn.addEventListener('click', replaceWorkbookWithTemplate);
}

if (templateRemoveExcelBtn) {
  templateRemoveExcelBtn.addEventListener('click', removeExcelTemplate);
}

if (templateExcelFolderBtn) {
  templateExcelFolderBtn.addEventListener('click', async function () {
    if (!window.finforge || typeof window.finforge.openTemplateFolder !== 'function') return;
    try {
      await window.finforge.openTemplateFolder();
    } catch (_) {}
  });
}

// ── Settings Page ──

var settingsDisplayMode = document.getElementById('settings-display-mode');
var settingsDisplayDivisor = document.getElementById('settings-display-divisor');
var settingsHealthResult = document.getElementById('settings-health-result');
var settingsNumSepCustomWrap = document.getElementById('settings-num-sep-custom-wrap');
var settingsNumSepCustom = document.getElementById('settings-num-sep-custom');

// Sync the settings display controls to the statement import page
if (settingsDisplayMode) {
  settingsDisplayMode.addEventListener('change', function () {
    if (displayMode) displayMode.value = settingsDisplayMode.value;
    if (displayDivisor) displayDivisor.value = settingsDisplayDivisor ? settingsDisplayDivisor.value : 1000000;
    displayMode.dispatchEvent(new Event('change'));
    setStatus('Display mode updated', 'success');
  });
}

if (settingsDisplayDivisor) {
  settingsDisplayDivisor.addEventListener('input', function () {
    if (displayDivisor) displayDivisor.value = settingsDisplayDivisor.value;
    if (displayMode) displayMode.value = settingsDisplayMode ? settingsDisplayMode.value : 'custom';
    displayDivisor.dispatchEvent(new Event('input'));
  });
}

// ── Number separator buttons ──
document.querySelectorAll('.settings-num-sep').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var sep = btn.dataset.sep || ',';
    // Update button visuals
    document.querySelectorAll('.settings-num-sep').forEach(function (b) {
      b.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
      b.classList.add('border-outline-variant', 'text-on-surface-variant');
    });
    btn.classList.add('bg-primary/10', 'text-primary', 'border-primary');
    btn.classList.remove('border-outline-variant', 'text-on-surface-variant');

    if (sep === '_custom_') {
      if (settingsNumSepCustomWrap) settingsNumSepCustomWrap.classList.remove('hidden');
      if (settingsNumSepCustom) settingsNumSepCustom.focus();
      return;
    }

    if (settingsNumSepCustomWrap) settingsNumSepCustomWrap.classList.add('hidden');
    applyNumSep(sep);
  });
});

if (settingsNumSepCustom) {
  settingsNumSepCustom.addEventListener('input', function () {
    var val = settingsNumSepCustom.value;
    if (val.length > 0) {
      applyNumSep(val);
    }
  });
  settingsNumSepCustom.addEventListener('blur', function () {
    if (!settingsNumSepCustom.value) {
      if (settingsNumSepCustomWrap) settingsNumSepCustomWrap.classList.add('hidden');
      // Reset to first button (comma)
      var first = document.querySelector('.settings-num-sep');
      if (first) {
        document.querySelectorAll('.settings-num-sep').forEach(function (b) {
          b.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
          b.classList.add('border-outline-variant', 'text-on-surface-variant');
        });
        first.classList.add('bg-primary/10', 'text-primary', 'border-primary');
        first.classList.remove('border-outline-variant', 'text-on-surface-variant');
      }
      applyNumSep(',');
    }
  });
}

// ── Date format buttons ──
document.querySelectorAll('.settings-date-fmt').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var fmt = btn.dataset.fmt || 'eu';
    document.querySelectorAll('.settings-date-fmt').forEach(function (b) {
      b.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
      b.classList.add('border-outline-variant', 'text-on-surface-variant');
    });
    btn.classList.add('bg-primary/10', 'text-primary', 'border-primary');
    btn.classList.remove('border-outline-variant', 'text-on-surface-variant');
    applyDateFormat(fmt);
  });
});

// ── Time format buttons ──
document.querySelectorAll('.settings-time-fmt').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var fmt = btn.dataset.fmt || '24h';
    document.querySelectorAll('.settings-time-fmt').forEach(function (b) {
      b.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
      b.classList.add('border-outline-variant', 'text-on-surface-variant');
    });
    btn.classList.add('bg-primary/10', 'text-primary', 'border-primary');
    btn.classList.remove('border-outline-variant', 'text-on-surface-variant');
    applyTimeFormat(fmt);
  });
});

// Initialize format button states from saved settings
(function initFormatButtons() {
  // Number separator
  var sepBtn;
  if (formatState.numSep === ',') sepBtn = document.querySelector('.settings-num-sep[data-sep=","]');
  else if (formatState.numSep === '.') sepBtn = document.querySelector('.settings-num-sep[data-sep="."]');
  else if (formatState.numSep === ' ') sepBtn = document.querySelector('.settings-num-sep[data-sep=" "]');
  else {
    // Custom separator
    sepBtn = document.querySelector('.settings-num-sep[data-sep="_custom_"]');
    if (settingsNumSepCustomWrap) settingsNumSepCustomWrap.classList.remove('hidden');
    if (settingsNumSepCustom) settingsNumSepCustom.value = formatState.numSep;
  }
  if (sepBtn) {
    document.querySelectorAll('.settings-num-sep').forEach(function (b) {
      b.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
      b.classList.add('border-outline-variant', 'text-on-surface-variant');
    });
    sepBtn.classList.add('bg-primary/10', 'text-primary', 'border-primary');
    sepBtn.classList.remove('border-outline-variant', 'text-on-surface-variant');
  }

  // Date format
  var dateBtn = document.querySelector('.settings-date-fmt[data-fmt="' + formatState.dateFmt + '"]');
  if (dateBtn) {
    document.querySelectorAll('.settings-date-fmt').forEach(function (b) {
      b.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
      b.classList.add('border-outline-variant', 'text-on-surface-variant');
    });
    dateBtn.classList.add('bg-primary/10', 'text-primary', 'border-primary');
    dateBtn.classList.remove('border-outline-variant', 'text-on-surface-variant');
  }

  // Time format
  var timeBtn = document.querySelector('.settings-time-fmt[data-fmt="' + formatState.timeFmt + '"]');
  if (timeBtn) {
    document.querySelectorAll('.settings-time-fmt').forEach(function (b) {
      b.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
      b.classList.add('border-outline-variant', 'text-on-surface-variant');
    });
    timeBtn.classList.add('bg-primary/10', 'text-primary', 'border-primary');
    timeBtn.classList.remove('border-outline-variant', 'text-on-surface-variant');
  }

  // Update previews
  updateFormatPreviews();
})();

// Data location buttons
var settingsOpenRoot = document.getElementById('settings-open-root');
var settingsOpenData = document.getElementById('settings-open-data');
var settingsOpenWorkbook = document.getElementById('settings-open-workbook');

if (settingsOpenRoot) {
  settingsOpenRoot.addEventListener('click', async function () {
    if (window.finforge && typeof window.finforge.openProjectRoot === 'function') {
      try { await window.finforge.openProjectRoot(); } catch (_) {}
    }
  });
}

if (settingsOpenData) {
  settingsOpenData.addEventListener('click', async function () {
    if (window.finforge && typeof window.finforge.openDataFolder === 'function') {
      try { await window.finforge.openDataFolder(); } catch (_) {}
    }
  });
}

if (settingsOpenWorkbook) {
  settingsOpenWorkbook.addEventListener('click', async function () {
    if (window.finforge && typeof window.finforge.openWorkbook === 'function') {
      try { await window.finforge.openWorkbook(); } catch (_) {}
    }
  });
}

// Health check
var settingsHealthCheck = document.getElementById('settings-health-check');
if (settingsHealthCheck) {
  settingsHealthCheck.addEventListener('click', async function () {
    if (settingsHealthResult) {
      settingsHealthResult.classList.remove('hidden');
      settingsHealthResult.textContent = 'Running health check...';
      settingsHealthResult.className = 'text-[9px] text-outline mono';
    }
    try {
      if (window.finforge && typeof window.finforge.checkSystemHealth === 'function') {
        var result = await window.finforge.checkSystemHealth();
        if (settingsHealthResult) {
          if (result && result.setupComplete === true) {
            settingsHealthResult.textContent = (result.message || 'All systems operational');
            settingsHealthResult.className = 'text-[9px] text-secondary mono';
          } else {
            settingsHealthResult.textContent = (result && result.error ? result.error : 'Health check failed');
            settingsHealthResult.className = 'text-[9px] text-error mono';
          }
        }
        setStatus(result && result.setupComplete === true ? 'Health check passed' : 'Health check failed', result && result.setupComplete === true ? 'success' : 'error');
      } else {
        if (settingsHealthResult) {
          settingsHealthResult.textContent = 'Health check unavailable';
          settingsHealthResult.className = 'text-[9px] text-outline mono';
        }
      }
    } catch (error) {
      if (settingsHealthResult) {
        settingsHealthResult.textContent = 'Error: ' + (error.message || error);
        settingsHealthResult.className = 'text-[9px] text-error mono';
      }
    }
  });
}

// Sync settings display values from main state when settings page is shown
// (handled by the shared displayMode/displayDivisor elements)

// Load templates on workspace init
loadTemplatesFromDisk();

loadFromDisk();
setActivePage('import');
setRatioWorkspaceView('list');
