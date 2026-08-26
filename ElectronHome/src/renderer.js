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
const openWorkbookButton = document.getElementById('open-workbook-button');
const settingsStatus = document.getElementById('settings-status');
const catalogCount = document.getElementById('catalog-count');
const selectedCount = document.getElementById('selected-count');
const selectedTitle = document.getElementById('selected-title');
const displayMode = document.getElementById('display-mode');
const displayDivisor = document.getElementById('display-divisor');
const selectedSearchInput = document.getElementById('selected-search-input');
const frequencyButtons = Array.from(document.querySelectorAll('.frequency-button'));
const periodPicker = document.getElementById('period-picker');
const periodPickerStatus = document.getElementById('period-picker-status');
const periodRefreshButton = document.getElementById('period-refresh-button');
const importTabFields = document.getElementById('import-tab-fields');
const importTabPeriods = document.getElementById('import-tab-periods');
const importFieldsView = document.getElementById('import-fields-view');
const importPeriodsView = document.getElementById('import-periods-view');
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
const ratioFolderFilterWrap = document.getElementById('ratio-folder-filter-wrap');
const ratioFolderFilterButton = document.getElementById('ratio-folder-filter-button');
const ratioFolderFilterLabel = document.getElementById('ratio-folder-filter-label');
const ratioFolderFilterMenu = document.getElementById('ratio-folder-filter-menu');
const ratioFolderFilterSearch = document.getElementById('ratio-folder-filter-search');
const ratioFolderFilterList = document.getElementById('ratio-folder-filter-list');
const sheetRatioList = document.getElementById('sheet-ratio-list');
const ratioResultsCount = document.getElementById('ratio-results-count');
const ratioRefreshButton = document.getElementById('ratio-refresh-button');
const ratioCreateButton = document.getElementById('ratio-create-button');
const ratioListBackButton = document.getElementById('ratio-list-back-button');
const ratioListView = document.getElementById('ratio-list-view');
const ratioMakerView = document.getElementById('ratio-maker-view');
const ratioCountMaker = document.getElementById('ratio-count-maker');
const ratioTabMetrics = document.getElementById('ratio-tab-metrics');
const ratioTabFolder = document.getElementById('ratio-tab-folder');
const ratioTabAssignments = document.getElementById('ratio-tab-assignments');
const ratioMetricsContent = document.getElementById('ratio-metrics-content');
const ratioAssignmentsContent = document.getElementById('ratio-assignments-content');
const ratioFolderContent = document.getElementById('ratio-folder-content');
const ratioFolderList = document.getElementById('ratio-folder-list');
const ratioNewFolderButton = document.getElementById('ratio-new-folder-button');
const ratioActionsSeparator = document.getElementById('ratio-actions-separator');
const ratioSelectionActions = document.getElementById('ratio-selection-actions');
const ratioUncheckAllButton = document.getElementById('ratio-uncheck-all-button');
const ratioExportTimeseriesButton = document.getElementById('ratio-export-timeseries-button');
const exportTickersModal = document.getElementById('export-tickers-modal');
const exportTickersList = document.getElementById('export-tickers-list');
const exportTickersSelectAllButton = document.getElementById('export-tickers-select-all');
const exportTickersDeselectAllButton = document.getElementById('export-tickers-deselect-all');
const exportTickersError = document.getElementById('export-tickers-error');
const exportTickersCancelButton = document.getElementById('export-tickers-cancel');
const exportTickersCloseButton = document.getElementById('export-tickers-close');
const exportTickersExportButton = document.getElementById('export-tickers-export');
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
const ratioFolderPicker = document.getElementById('ratio-folder-picker');
const ratioFolderPickerSubtitle = document.getElementById('ratio-folder-picker-subtitle');
const ratioFolderPickerCurrent = document.getElementById('ratio-folder-picker-current');
const ratioFolderPickerList = document.getElementById('ratio-folder-picker-list');
const ratioFolderPickerClear = document.getElementById('ratio-folder-picker-clear');
const ratioFolderTrigger = document.getElementById('ratio-folder-trigger');
const ratioFolderTriggerText = document.getElementById('ratio-folder-trigger-text');
const folderModal = document.getElementById('folder-modal');
const folderModalTitle = document.getElementById('folder-modal-title');
const folderModalInput = document.getElementById('folder-modal-input');
const folderModalError = document.getElementById('folder-modal-error');
const folderModalClose = document.getElementById('folder-modal-close');
const folderModalCancel = document.getElementById('folder-modal-cancel');
const folderModalSave = document.getElementById('folder-modal-save');
const folderConfirmModal = document.getElementById('folder-confirm-modal');
const folderConfirmMessage = document.getElementById('folder-confirm-message');
const folderConfirmClose = document.getElementById('folder-confirm-close');
const folderConfirmCancel = document.getElementById('folder-confirm-cancel');
const folderConfirmDelete = document.getElementById('folder-confirm-delete');
const scopeButtons = Array.from(document.querySelectorAll('.scope-button'));
const navButtons = Array.from(document.querySelectorAll('.nav-link'));
const pageSections = Array.from(document.querySelectorAll('.page-section'));

// ── Sidebar Toggle ──
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarToggleIcon = document.getElementById('sidebar-toggle-icon');
const mainContent = document.getElementById('main-content');

// ── Home Tab Elements ──
const homeLinksList = document.getElementById('home-links-list');
const homeLastFetchedEl = document.getElementById('home-last-fetched');
const homeFetchAllButton = document.getElementById('home-fetch-all-button');
const homeFetchStatus = document.getElementById('home-fetch-status');
const homeTemplateName = document.getElementById('home-template-name');
const homeOpenTemplatesButton = document.getElementById('home-open-templates-button');

// ── Visualize Tab Elements ──
const vizChartTitle = document.getElementById('viz-chart-title');
const vizChartStatus = document.getElementById('viz-chart-status');
const vizEmptyState = document.getElementById('viz-empty-state');
const vizChartWrapper = document.getElementById('viz-chart-wrapper');
const vizPlotlyContainer = document.getElementById('viz-plotly-container');
const vizTickersView = document.getElementById('viz-tickers-view');
const vizMetricsView = document.getElementById('viz-metrics-view');
const vizTickerSearch = document.getElementById('viz-ticker-search');
const vizTickersList = document.getElementById('viz-tickers-list');
const vizMetricSearch = document.getElementById('viz-metric-search');
const vizMetricsList = document.getElementById('viz-metrics-list');
const vizTickersShowSelected = document.getElementById('viz-tickers-show-selected');
const vizTickersRemoveAll = document.getElementById('viz-tickers-remove-all');
const vizMetricsShowSelected = document.getElementById('viz-metrics-show-selected');
const vizMetricsRemoveAll = document.getElementById('viz-metrics-remove-all');
const vizGraphSettingsView = document.getElementById('viz-graph-settings-view');
const vizBottomContainer = document.getElementById('viz-bottom-container');
const vizBottomContent = document.getElementById('viz-bottom-content');
const vizBottomScrollToggle = document.getElementById('viz-bottom-scroll-toggle');

// ── Ranking Tab Elements ──
const rankingTickerCount = document.getElementById('ranking-ticker-count');
const rankingTickerList = document.getElementById('ranking-ticker-list');
const rankingTickerListSearch = document.getElementById('ranking-ticker-list-search');
const rankingTickerAll = document.getElementById('ranking-ticker-all');
const rankingTickerRemoveAll = document.getElementById('ranking-ticker-remove-all');
const rankingTickersView = document.getElementById('ranking-tickers-view');
const rankingMetricsView = document.getElementById('ranking-metrics-view');
const rankingPresetsView = document.getElementById('ranking-presets-view');
const rankingMetricList = document.getElementById('ranking-metric-list');
const rankingMetricListSearch = document.getElementById('ranking-metric-list-search');
const rankingMetricShowSelected = document.getElementById('ranking-metric-show-selected');
const rankingMetricRemoveAll = document.getElementById('ranking-metric-remove-all');
const rankingPresetName = document.getElementById('ranking-preset-name');
const rankingPresetSave = document.getElementById('ranking-preset-save');
const rankingPresetSelect = document.getElementById('ranking-preset-select');
const rankingPresetDelete = document.getElementById('ranking-preset-delete');
const rankingPresetNew = document.getElementById('ranking-preset-new');
const rankingPresetStatusEl = document.getElementById('ranking-preset-status');
const rankingRun = document.getElementById('ranking-run');
const rankingCollapseAll = document.getElementById('ranking-collapse-all');
const rankingStatus = document.getElementById('ranking-status');
const rankingCards = document.getElementById('ranking-cards');
const rankingAdvanced = document.getElementById('ranking-advanced');
const rankingAdvancedHeader = document.getElementById('ranking-advanced-header');
const rankingAdvancedBack = document.getElementById('ranking-advanced-back');
const rankingAdvancedDropdownBtn = document.getElementById('ranking-advanced-dropdown-btn');
const rankingAdvancedDropdownLabel = document.getElementById('ranking-advanced-dropdown-label');
const rankingAdvancedDropdownMenu = document.getElementById('ranking-advanced-dropdown-menu');
const rankingAdvancedMetricSearch = document.getElementById('ranking-advanced-metric-search');
const rankingAdvancedMetricList = document.getElementById('ranking-advanced-metric-list');
const rankingAdvancedCreate = document.getElementById('ranking-advanced-create');
const rankingAdvancedStatus = document.getElementById('ranking-advanced-status');
const rankingMainGrid = document.getElementById('ranking-main-grid');
const rankingLeftPanel = document.getElementById('ranking-left-panel');
const rankingToolbar = document.getElementById('ranking-toolbar');
const rankingTickerPanel = document.getElementById('ranking-ticker-panel');
const rankingTickerPanelSearch = document.getElementById('ranking-ticker-panel-search');
const rankingTickerPanelList = document.getElementById('ranking-ticker-panel-list');
const rankingTickerPanelHeader = document.getElementById('ranking-ticker-panel-header');
const rankingResultsBtn = document.getElementById('ranking-results-btn');
const rankingResultsView = document.getElementById('ranking-results-view');
const rankingResultsBack = document.getElementById('ranking-results-back');
const rankingResultsHead = document.getElementById('ranking-results-head');
const rankingResultsBody = document.getElementById('ranking-results-body');
const rankingResultsStatus = document.getElementById('ranking-results-status');

var rankingState = {
  tickers: new Set(),   // selected tickers
  metrics: [],          // [{ name, formula, curveType, direction, maxPoints, params }]
  values: {},           // { ticker: { metricName: value } } from the backend
  loading: false,
  error: '',
  lastRequestId: 0,
  presets: [],
  activePresetId: null,
  seeded: false,
  view: 'tickers',      // 'tickers' | 'metrics' | 'presets'
  tickerSearch: '',
  metricSearch: '',
  metricShowSelected: false,
  expandedMetric: null,   // name of the single expanded scoring card
  advancedOpen: false,    // whether the single-metric advanced view is open
  advancedMetricName: null, // metric shown in the advanced view
  advancedSearch: '',     // search term inside the advanced metrics dropdown
  tickerPanelSearch: '',  // search term inside the bottom ticker values panel
  focusedTicker: null,    // ticker currently focused on the curve (null = none)
  resultsOpen: false,     // whether the full-screen Results table is open
  resultsSort: { key: 'totalPoints', dir: 'desc' }, // active Results table sort
};

var rankingHandles = {};   // idx -> [{ id, param, index, axis, x, y, label }]
var rankingDrag = null;    // { idx, handle, chartEl }
var rankingDragFrame = null;
var rankingPendingClick = null; // { idx, x, y } deferred empty-area click (custom/step curves)
var rankingPan = null;          // { idx, chartEl, startClientX, range, bounds } manual x-pan drag

var RANKING_CURVE_TYPES = [
  { value: 'percentile', label: 'Percentile' },
  { value: 'gaussian', label: 'Bell' },
  { value: 'sigmoid', label: 'S-Curve' },
  { value: 'linear', label: 'Linear' },
  { value: 'step', label: 'Steps' },
  { value: 'custom', label: 'Custom' },
];

// ── Viz Color Palette (cycles for each metric) ──
var VIZ_COLORS = [
  '#4FC3F7', '#FF8A65', '#81C784', '#BA68C8', '#FFD54F',
  '#4DD0E1', '#F06292', '#AED581', '#7986CB', '#FFB74D',
  '#90A4AE', '#A1887F', '#E57373', '#64B5F6', '#FFF176'
];

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

// ── Home Tab Links ──
// Feedback and bug URLs are placeholders until the links are provided.
const HOME_LINKS = {
  website: { label: 'Website', url: 'https://fin-forge.eu/' },
  feedback: { label: 'Feedback form', url: '' },
  bugs: { label: 'Report a bug', url: '' },
  disclaimer: { label: 'Financial disclaimer', url: 'https://fin-forge.eu/disclaimer/' },
};

const state = {
  page: 'home',
  selectedCompany: { ticker: '', companyName: '' },
  companyProfile: null,
  companyProfileLoading: false,
  companyProfileError: '',
  companyProfileRequestId: 0,
  companyView: 'overview',
  scope: 'balanceSheet',
  search: '',
  selectedSearch: '',
  importView: 'fields',
  importList: [],
  tickerDataStatus: {},   // ticker -> 'checking' | 'fetching' | 'ready' | 'error'
  tickerDataTimestamps: {}, // ticker -> ISO timestamp of last fetch
  homeLastDataFetch: null,   // ISO timestamp of the most recent completed fetch
  activeTemplateName: '',    // name of the currently active template
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
  ratioSelection: new Set(),
  exportTickerSelection: new Set(),
  ratioEditorMode: 'create',
  ratioEditorOriginalName: '',
  ratioWorkspaceView: 'list',
  ratioMiddleView: 'metrics',
  ratioFolderEditMode: { active: false, metricName: '' },
  ratioFolderFilter: '',        // '' = all folders, otherwise folder name to filter metrics view
  folderModalMode: 'create',     // 'create' | 'rename'
  folderModalOriginalName: '',
  folderPendingDelete: '',       // folder awaiting delete confirmation
  folders: [],                   // persisted folder names (independent of ratios)
  _pendingFolderSelection: '',
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
  companyReports: null,
  companyReportsLoading: false,
  companyReportsError: '',
  companyReportsRequestId: 0,
  companyReportsLoaded: false,
  settings: {
    mode: 'balanceSheet',
    frequency: 'annual',
    periods: { annual: {}, quarterly: {} },
    display: { mode: 'millions', divisor: 1000000 },
    balanceSheet: { selected: [] },
    incomeStatement: { selected: [] },
    cashFlow: { selected: [] },
  },
  availablePeriods: {},       // ticker -> [date, ...] fetched from parquet
  periodsLoading: false,
  periodsError: '',
  periodExpanded: {},         // ticker -> bool (dropdown open state)
  lastSavedSnapshot: '',
  isDirty: false,
  // ── Visualize Tab State ──
  vizActiveTickers: new Set(),       // global active tickers
  vizMetrics: [],                    // [{ name, formula, color }] ordered
  vizTickerSearch: '',               // filter text for the Tickers view list
  vizMetricSearch: '',               // filter text for the Metrics view list
  vizShowSelected: { tickers: false, metrics: false },  // 'show only selected' filter per side view
  vizWorkspaceView: 'tickers',       // 'metrics' | 'tickers'
  vizChartLoading: false,            // loading overlay flag
  vizDataCache: {},                  // "TICKER|METRIC" → { dates, values }
  vizAxisStretchEnabled: true,       // master toggle for axis drag-to-stretch
  vizAxisStretchActive: null,        // 'x' | 'y' | null while dragging
  vizAxisStretchAnchor: null,        // { pageX, pageY, range: [low, high] }
  vizDynamicYAxisEnabled: true,      // Finviz-style: Y-axis auto-scales to visible X-range
  vizDynamicYAxisPending: false,     // guard against re-entrant relayout loops
  vizAdaptiveXTickPending: false,    // guard against re-entrant adaptive-tick relayout loops
  vizYAxisDecimals: 4,               // Y-axis tick label decimal places
  vizChartType: 'auto',              // 'auto' | 'line' | 'area' | 'bar' (kept as documented fallback; legend overrides per item)
  vizShowMarkers: true,              // show dot markers on line/area traces
  vizXDateFormat: 'system',          // graph-local X-axis date format override ('system' = follow Settings tab)
  vizXTickMode: 'auto',              // 'auto' | 'year' | 'quarter' | 'month'
  vizXTickAngle: 0,                  // X-axis tick label rotation in degrees
  vizXGridDensity: 'match',          // X gridline density vs labels: 'match' | 'more' | 'dense'
  vizYLogScale: false,               // Y-axis logarithmic scale
  vizGridX: true,                    // show X gridlines
  vizGridY: true,                    // show Y gridlines
  vizSmoothLines: false,             // spline-smooth line/area traces
  vizGraphBg: '#0b1422',             // graph/paper background color
  vizAxisColor: '#424754',           // axis line + zero-line color
  vizGridColor: '#1c2638',           // gridline color
  vizTickerStyles: {},               // ticker      -> { color, chartType }  (per-item legend overrides)
  vizMetricStyles: {},               // metric name -> { color, chartType }  (per-item legend overrides)
  vizLegendCollapsed: { tickers: false, metrics: false },  // collapsible legend sections
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
    : state.page === 'visualize'
      ? [
          { label: 'General', page: 'visualize', active: false },
          { label: 'Visualize', page: 'visualize', active: true },
        ]
    : state.page === 'ranking'
      ? rankingState.resultsOpen
        ? [
            { label: 'Data', page: 'import', active: false },
            { label: 'Ranking', page: 'ranking', active: false },
            { label: 'Results', page: 'ranking', active: true },
          ]
        : rankingState.advancedOpen
          ? [
              { label: 'Data', page: 'import', active: false },
              { label: 'Ranking', page: 'ranking', active: false },
              { label: 'Advanced', page: 'ranking', active: true },
            ]
          : [
              { label: 'Data', page: 'import', active: false },
              { label: 'Ranking', page: 'ranking', active: true },
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
          { label: 'Metrics', page: 'ratios', active: false },
          { label: 'Create a metric', page: 'ratios', active: true },
        ]
      : [
          { label: 'Data', page: 'import', active: false },
          { label: 'Metrics', page: 'ratios', active: true },
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
  state.page = pageName === 'import-list' ? 'search' : pageName === 'import' ? 'import' : pageName === 'templates' ? 'templates' : pageName === 'settings' ? 'settings' : pageName === 'visualize' ? 'visualize' : pageName;

  // Navigating back to Ranking (via breadcrumb or sidebar) should leave the
  // full-screen Results / Advanced sub-views and return to the grid.
  if (state.page === 'ranking') {
    if (rankingState.resultsOpen) closeRankingResults();
    if (rankingState.advancedOpen) closeRankingAdvanced();
  }

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
    setRatioMiddleView('metrics');
  }

  if (state.page === 'templates') {
    renderTemplateList();
  }

  if (state.page === 'visualize') {
    setVizWorkspaceView('tickers');
    renderVizTickerList();
    renderVizMetricsList();
    setVizBottomTab('legend');
    updateVizChart();
    // Re-apply scroll mode in case it was reset
    setVizScrollMode(vizScrollMode);
    // Trigger Plotly resize after DOM becomes visible
    setTimeout(function () {
      if (vizPlotlyContainer && typeof Plotly !== 'undefined') {
        Plotly.Plots.resize(vizPlotlyContainer);
      }
      window.dispatchEvent(new Event('resize'));
    }, 50);
  }

  if (state.page === 'import') {
    renderFrequency();
    renderPeriodPicker();
    void loadAvailablePeriods();
  }

  if (state.page === 'home') {
    void loadHomeState();
  }

  if (state.page === 'ranking') {
    initRankingTab();
  }

  renderBreadcrumbs();
}

// ── Home Tab ──

function renderHomeLinks() {
  if (!homeLinksList) return;

  const links = [
    { icon: 'language', label: HOME_LINKS.website.label, url: HOME_LINKS.website.url },
    { icon: 'forum', label: HOME_LINKS.feedback.label, url: HOME_LINKS.feedback.url },
    { icon: 'bug_report', label: HOME_LINKS.bugs.label, url: HOME_LINKS.bugs.url },
    { icon: 'description', label: HOME_LINKS.disclaimer.label, url: HOME_LINKS.disclaimer.url },
  ];

  homeLinksList.innerHTML = links.map((link) => {
    const url = String(link.url || '').trim();
    if (!url) {
      return `
        <div class="px-md py-2 flex items-center justify-between gap-sm opacity-60">
          <div class="flex items-center gap-sm min-w-0">
            <span class="material-symbols-outlined text-[16px] text-outline">${escapeHtml(link.icon)}</span>
            <span class="text-body-sm text-on-surface-variant mono">${escapeHtml(link.label)}</span>
          </div>
          <span class="text-[9px] text-outline mono uppercase">Pending</span>
        </div>
      `;
    }
    return `
      <button class="w-full px-md py-2 flex items-center justify-between gap-sm text-left hover:bg-surface-container-high/40 transition-colors" data-home-link="${escapeHtml(url)}">
        <div class="flex items-center gap-sm min-w-0">
          <span class="material-symbols-outlined text-[16px] text-primary">${escapeHtml(link.icon)}</span>
          <span class="text-body-sm text-on-surface mono">${escapeHtml(link.label)}</span>
        </div>
        <span class="material-symbols-outlined text-[14px] text-outline">open_in_new</span>
      </button>
    `;
  }).join('');

  homeLinksList.querySelectorAll('[data-home-link]').forEach((button) => {
    button.addEventListener('click', () => {
      openHomeLink(button.dataset.homeLink || '');
    });
  });
}

function formatLastFetched(value) {
  if (!value) return 'Never';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Never';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getOldestTickerTimestamp() {
  const list = Array.isArray(state.importList) ? state.importList : [];
  let oldest = null;
  for (const ticker of list) {
    const ts = state.tickerDataTimestamps[ticker];
    if (!ts) continue;
    const time = new Date(ts).getTime();
    if (Number.isNaN(time)) continue;
    if (oldest === null || time < oldest) {
      oldest = time;
    }
  }
  return oldest === null ? null : new Date(oldest).toISOString();
}

function renderHomePage() {
  renderHomeLinks();

  if (homeLastFetchedEl) {
    homeLastFetchedEl.textContent = formatLastFetched(getOldestTickerTimestamp());
  }
  if (homeTemplateName) {
    homeTemplateName.textContent = state.activeTemplateName || '—';
  }
  if (homeFetchAllButton) {
    const hasTickers = Array.isArray(state.importList) && state.importList.length > 0;
    homeFetchAllButton.disabled = !hasTickers;
    homeFetchAllButton.style.opacity = hasTickers ? '' : '0.5';
    homeFetchAllButton.title = hasTickers ? '' : 'Add tickers in the Search tab first';
  }
}

async function loadHomeState() {
  if (!window.finforge || typeof window.finforge.loadHomeState !== 'function') return;
  try {
    const result = await window.finforge.loadHomeState();
    if (result && result.ok) {
      state.homeLastDataFetch = result.lastDataFetch || null;
      state.activeTemplateName = result.activeTemplateName || '';
    }
  } catch (_) {}
  renderHomePage();
}

function openHomeLink(url) {
  const target = String(url || '').trim();
  if (!target) return;
  if (window.finforge && typeof window.finforge.openExternalUrl === 'function') {
    window.finforge.openExternalUrl(target);
  } else {
    window.open(target, '_blank');
  }
}

async function updateHomeLastFetched(timestamp) {
  state.homeLastDataFetch = timestamp;
  renderHomePage();
  if (window.finforge && typeof window.finforge.setLastDataFetch === 'function') {
    try { await window.finforge.setLastDataFetch(timestamp); } catch (_) {}
  }
}

function maybeMarkAllDataFetched() {
  const list = Array.isArray(state.importList) ? state.importList : [];
  if (!list.length) return;
  const stillFetching = list.some((ticker) => {
    const status = state.tickerDataStatus[ticker];
    return status === 'fetching' || status === 'checking';
  });
  if (!stillFetching) {
    void updateHomeLastFetched(new Date().toISOString());
  }
}

if (homeFetchAllButton) {
  homeFetchAllButton.addEventListener('click', () => {
    if (!state.importList.length) return;
    if (homeFetchStatus) {
      homeFetchStatus.textContent = 'Fetching…';
      homeFetchStatus.classList.remove('hidden');
    }
    fetchAllTickerData();
  });
}

if (homeOpenTemplatesButton) {
  homeOpenTemplatesButton.addEventListener('click', () => {
    setActivePage('templates');
  });
}

function setRatioWorkspaceView(viewName) {
  state.ratioWorkspaceView = viewName === 'maker' ? 'maker' : 'list';
  ratioListView.classList.toggle('hidden', state.ratioWorkspaceView !== 'list');
  ratioMakerView.classList.toggle('hidden', state.ratioWorkspaceView !== 'maker');
  renderBreadcrumbs();
}

function setRatioMiddleView(viewName) {
  state.ratioMiddleView = viewName;
  const isMetrics = viewName === 'metrics';
  const isAssignments = viewName === 'assignments';
  const isFolder = viewName === 'folder';
  ratioMetricsContent.classList.toggle('hidden', !isMetrics);
  ratioAssignmentsContent.classList.toggle('hidden', !isAssignments);
  ratioFolderContent.classList.toggle('hidden', !isFolder);

  // Show folder filter dropdown only in the Metrics subtab
  if (ratioFolderFilterWrap) {
    ratioFolderFilterWrap.classList.toggle('hidden', !isMetrics);
  }
  if (ratioFolderFilterMenu) {
    ratioFolderFilterMenu.classList.add('hidden');
  }

  // Show/hide new folder button (only in folder view)
  if (ratioNewFolderButton) {
    ratioNewFolderButton.classList.toggle('hidden', !isFolder);
  }
  updateRatioSelectionActions();

  // Update tab button styles
  [ratioTabMetrics, ratioTabFolder, ratioTabAssignments].forEach((btn) => {
    const active = (btn === ratioTabMetrics && isMetrics) ||
                   (btn === ratioTabFolder && isFolder) ||
                   (btn === ratioTabAssignments && isAssignments);
    if (active) {
      btn.className = 'ratio-tab-button px-2 py-[2px] bg-primary/10 text-primary border border-primary font-label-md text-label-md';
    } else {
      btn.className = 'ratio-tab-button px-2 py-[2px] border border-hairline text-on-surface-variant font-label-md text-label-md';
    }
  });

  if (isMetrics) {
    renderRatios();
  } else if (isAssignments) {
    renderSheetAssignments();
  } else if (isFolder) {
    state.ratioFolderEditMode = { active: false, metricName: '' };
    renderFolders();
  }
}

function snapshotSettings() {
  return JSON.stringify({
    mode: state.scope,
    frequency: state.settings.frequency,
    periods: state.settings.periods,
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
  const rawPeriods = nextSettings.periods && typeof nextSettings.periods === 'object' ? nextSettings.periods : {};
  return {
    mode: nextSettings.mode === 'incomeStatement' ? 'incomeStatement' : nextSettings.mode === 'cashFlow' ? 'cashFlow' : 'balanceSheet',
    frequency: nextSettings.frequency === 'quarterly' ? 'quarterly' : 'annual',
    periods: {
      annual: normalizePeriodMap(rawPeriods.annual),
      quarterly: normalizePeriodMap(rawPeriods.quarterly),
    },
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

function normalizePeriodMap(periodMap) {
  if (!periodMap || typeof periodMap !== 'object') {
    return {};
  }
  const result = {};
  Object.keys(periodMap).forEach((ticker) => {
    const dates = periodMap[ticker];
    if (Array.isArray(dates)) {
      result[String(ticker).toUpperCase()] = dates.map((date) => String(date).trim()).filter(Boolean);
    }
  });
  return result;
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
            <button class="px-2 py-[2px] border border-hairline bg-surface-container-high font-label-md text-label-md hover:border-primary transition-colors ${alreadySaved ? 'opacity-50 cursor-not-allowed' : ''}" data-import-add="${escapeHtml(result.ticker)}" ${alreadySaved ? 'disabled' : ''}>${alreadySaved ? 'Added' : 'Add'}</button>
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
        <div class="px-md py-1.5 flex items-center justify-between gap-sm hover:bg-surface-container-high/40 transition-colors cursor-pointer border-b border-hairline" data-company-open="${escapeHtml(ticker)}" data-company-name="${escapeHtml(ticker)}">
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="font-label-md text-label-md text-on-surface mono">${escapeHtml(ticker)}</span>
              ${statusHtml}
            </div>
            ${lastFetchedHtml}
          </div>
          <div class="flex items-center gap-1 shrink-0">
            ${needsRetry ? `<button class="px-2 py-[2px] border border-hairline bg-surface-container-high font-label-md text-label-md hover:border-primary transition-colors text-[10px]" data-import-fetch="${escapeHtml(ticker)}">Fetch data</button>` : `<button class="px-2 py-[2px] border border-hairline bg-surface-container-high font-label-md text-label-md hover:border-secondary transition-colors text-[10px]" data-import-refetch="${escapeHtml(ticker)}">Refetch</button>`}
            <button class="px-2 py-[2px] border border-hairline bg-surface-container-high font-label-md text-label-md hover:border-error transition-colors" data-import-remove="${escapeHtml(ticker)}">Remove</button>
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
  void loadAvailablePeriods();
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

  maybeMarkAllDataFetched();
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
  renderHomePage();
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
      renderHomePage();
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

// Plotly/d3 strftime format for the chart X-axis, matching the Settings tab date format
function getPlotlyDateFormat() {
  return formatState.dateFmt === 'us' ? '%m/%d/%Y' : '%d/%m/%Y';
}

// ── Graph X-Axis Date Format + Tick Frequency + Viewing Settings ──

var VIZ_MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var VIZ_GRAPH_SETTINGS_KEY = 'finforge_viz_graph_settings';
var VIZ_GRAPH_SETTINGS_DEFAULTS = {
  xDateFormat: 'system',
  xTickMode: 'auto',
  xTickAngle: 0,
  yLogScale: false,
  gridX: true,
  gridY: true,
  xGridDensity: 'match',
  smoothLines: false,
  graphBg: '#0b1422',
  axisColor: '#424754',
  gridColor: '#1c2638',
};

function loadVizGraphSettings() {
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(VIZ_GRAPH_SETTINGS_KEY) || 'null'); } catch (e) { saved = null; }
  var s = saved || {};
  state.vizXDateFormat = s.xDateFormat || VIZ_GRAPH_SETTINGS_DEFAULTS.xDateFormat;
  state.vizXTickMode = s.xTickMode || VIZ_GRAPH_SETTINGS_DEFAULTS.xTickMode;
  state.vizXTickAngle = (typeof s.xTickAngle === 'number') ? s.xTickAngle : VIZ_GRAPH_SETTINGS_DEFAULTS.xTickAngle;
  state.vizYLogScale = (typeof s.yLogScale === 'boolean') ? s.yLogScale : VIZ_GRAPH_SETTINGS_DEFAULTS.yLogScale;
  state.vizGridX = (typeof s.gridX === 'boolean') ? s.gridX : VIZ_GRAPH_SETTINGS_DEFAULTS.gridX;
  state.vizGridY = (typeof s.gridY === 'boolean') ? s.gridY : VIZ_GRAPH_SETTINGS_DEFAULTS.gridY;
  state.vizXGridDensity = s.xGridDensity || VIZ_GRAPH_SETTINGS_DEFAULTS.xGridDensity;
  state.vizSmoothLines = (typeof s.smoothLines === 'boolean') ? s.smoothLines : VIZ_GRAPH_SETTINGS_DEFAULTS.smoothLines;
  state.vizGraphBg = s.graphBg || VIZ_GRAPH_SETTINGS_DEFAULTS.graphBg;
  state.vizAxisColor = s.axisColor || VIZ_GRAPH_SETTINGS_DEFAULTS.axisColor;
  state.vizGridColor = s.gridColor || VIZ_GRAPH_SETTINGS_DEFAULTS.gridColor;
}

function saveVizGraphSettings() {
  try {
    localStorage.setItem(VIZ_GRAPH_SETTINGS_KEY, JSON.stringify({
      xDateFormat: state.vizXDateFormat,
      xTickMode: state.vizXTickMode,
      xTickAngle: state.vizXTickAngle,
      yLogScale: state.vizYLogScale,
      gridX: state.vizGridX,
      gridY: state.vizGridY,
      xGridDensity: state.vizXGridDensity,
      smoothLines: state.vizSmoothLines,
      graphBg: state.vizGraphBg,
      axisColor: state.vizAxisColor,
      gridColor: state.vizGridColor,
    }));
  } catch (e) {}
}

loadVizGraphSettings();

// d3 strftime string used for the X-axis hover label (and tickformat in Auto mode)
function getVizXAxisDateFormat() {
  switch (state.vizXDateFormat) {
    case 'dd.mm.yyyy': return '%d.%m.%Y';
    case 'mm.dd.yy': return '%m.%d.%y';
    case 'mm.dd.yyyy': return '%m.%d.%Y';
    case 'dd.mm.yy': return '%d.%m.%y';
    case 'mm.yy': return '%m/%y';
    case 'mon yyyy': return '%b %Y';
    case 'mon': return '%b';
    case 'yyyy': return '%Y';
    case 'dd mon yyyy': return '%d %b %Y';
    default: return getPlotlyDateFormat(); // 'system'
  }
}

function parseVizDate(value) {
  var d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function formatVizTickDate(d, mode) {
  var y = d.getFullYear();
  if (mode === 'year') return String(y);
  if (mode === 'quarter') return 'Q' + (Math.floor(d.getMonth() / 3) + 1) + ' ' + y;
  if (mode === 'month') return VIZ_MONTHS_SHORT[d.getMonth()] + ' ' + y;
  if (mode === 'week' || mode === 'day') {
    return String(d.getDate()).padStart(2, '0') + ' ' + VIZ_MONTHS_SHORT[d.getMonth()];
  }
  return VIZ_MONTHS_SHORT[d.getMonth()] + ' ' + y; // fallback
}

// Group plotted dates and keep the FIRST date (first trading day) of each period
function computeVizXAxisTicks(allDates, mode) {
  var tickvals = [];
  var ticktext = [];
  if (!allDates || !allDates.length) return { tickvals: tickvals, ticktext: ticktext };

  var unique = [];
  var seen = {};
  for (var i = 0; i < allDates.length; i++) {
    var d = parseVizDate(allDates[i]);
    if (!d) continue;
    var ts = d.getTime();
    if (!seen[ts]) {
      seen[ts] = true;
      unique.push({ ts: ts, str: String(allDates[i]), d: d });
    }
  }
  unique.sort(function (a, b) { return a.ts - b.ts; });

  var lastKey = null;
  for (var j = 0; j < unique.length; j++) {
    var dObj = unique[j].d;
    var key;
    var labelDate = dObj;
    if (mode === 'year') {
      key = dObj.getFullYear();
    } else if (mode === 'quarter') {
      key = dObj.getFullYear() + '-Q' + Math.floor(dObj.getMonth() / 3);
    } else if (mode === 'month') {
      key = dObj.getFullYear() + '-' + dObj.getMonth();
    } else if (mode === 'week') {
      var wd = dObj.getDay();
      var shift = (wd === 0) ? -6 : (1 - wd); // shift to Monday of the same ISO week
      labelDate = new Date(dObj.getFullYear(), dObj.getMonth(), dObj.getDate() + shift);
      key = labelDate.getTime();
    } else {
      key = unique[j].ts; // day (and fallback)
    }
    if (key === lastKey) continue;
    lastKey = key;
    tickvals.push(unique[j].str);
    ticktext.push(formatVizTickDate(labelDate, mode));
  }

  return { tickvals: tickvals, ticktext: ticktext };
}

// Granularity ladder from coarsest to finest (used for adaptive ticks + gridline density)
var VIZ_TICK_LADDER = ['year', 'quarter', 'month', 'week', 'day'];

// Adaptive label granularity thresholds (visible X span in days)
var VIZ_ADAPTIVE_YEAR_DAYS = 730;
var VIZ_ADAPTIVE_MONTH_DAYS = 75;

// Minimum horizontal space reserved per X-axis label when thinning day labels
var VIZ_MIN_PX_PER_X_LABEL = 48;

function pickVizAdaptiveTickMode(spanDays) {
  if (spanDays > VIZ_ADAPTIVE_YEAR_DAYS) return 'year';
  if (spanDays > VIZ_ADAPTIVE_MONTH_DAYS) return 'month';
  return 'day';
}

// Current visible X range as [minTs, maxTs]; falls back to the plotted data range
function getVizVisibleDateRange(allDates) {
  if (vizPlotlyContainer && vizPlotlyContainer._fullLayout && vizPlotlyContainer._fullLayout.xaxis) {
    var xr = vizPlotlyContainer._fullLayout.xaxis.range;
    if (xr && xr.length === 2) {
      var lo = parseVizDate(xr[0]);
      var hi = parseVizDate(xr[1]);
      if (lo && hi && lo.getTime() < hi.getTime()) {
        return [lo.getTime(), hi.getTime()];
      }
    }
  }
  var minTs = null;
  var maxTs = null;
  if (allDates) {
    for (var i = 0; i < allDates.length; i++) {
      var d = parseVizDate(allDates[i]);
      if (!d) continue;
      var ts = d.getTime();
      if (minTs === null || ts < minTs) minTs = ts;
      if (maxTs === null || ts > maxTs) maxTs = ts;
    }
  }
  return [minTs, maxTs];
}

function filterVizDatesToRange(allDates, lowTs, highTs) {
  var out = [];
  if (!allDates) return out;
  for (var i = 0; i < allDates.length; i++) {
    var d = parseVizDate(allDates[i]);
    if (!d) continue;
    var ts = d.getTime();
    if (ts >= lowTs && ts <= highTs) out.push(allDates[i]);
  }
  return out;
}

// Finviz-style hierarchical labels: show the parent unit only at its first tick.
//   month mode: year change -> "2024", following months -> "Feb", "Mar", ...
//   day mode:   year change -> "2024", month change -> "Feb", following days -> "02", "03", ...
function applyVizHierarchicalLabels(ticks, mode) {
  if (mode !== 'month' && mode !== 'day') return ticks;
  var lastYear = null;
  var lastMonth = null;
  for (var i = 0; i < ticks.tickvals.length; i++) {
    var d = parseVizDate(ticks.tickvals[i]);
    if (!d) continue;
    var y = d.getFullYear();
    var m = d.getMonth();
    if (mode === 'month') {
      ticks.ticktext[i] = (lastYear !== y) ? String(y) : VIZ_MONTHS_SHORT[m];
    } else { // day
      if (lastYear !== y) {
        ticks.ticktext[i] = String(y);
      } else if (lastMonth !== m) {
        ticks.ticktext[i] = VIZ_MONTHS_SHORT[m];
      } else {
        ticks.ticktext[i] = String(d.getDate()).padStart(2, '0');
      }
    }
    lastYear = y;
    lastMonth = m;
  }
  return ticks;
}

// Estimate how many X-axis labels can fit in the current plot width
function getVizMaxXAxisLabels() {
  var width = 0;
  if (vizPlotlyContainer && vizPlotlyContainer._fullLayout && vizPlotlyContainer._fullLayout._size) {
    width = vizPlotlyContainer._fullLayout._size.w || 0;
  }
  if (!width && vizPlotlyContainer) {
    width = vizPlotlyContainer.clientWidth || 0;
  }
  if (!width) width = 600;
  return Math.max(2, Math.floor(width / VIZ_MIN_PX_PER_X_LABEL));
}

// Thin day-number labels so they never overlap. Year/month context labels are always kept,
// and the remaining day labels are distributed evenly across the visible range.
function thinVizTickLabels(ticks, labelMode) {
  if (labelMode !== 'day') return ticks;
  var n = ticks.tickvals.length;
  if (!n) return ticks;

  var contextCount = 0;
  var childIndexes = [];
  for (var i = 0; i < n; i++) {
    var t = String(ticks.ticktext[i] == null ? '' : ticks.ticktext[i]).trim();
    if (!t) continue;
    var isYear = /^\d{4}$/.test(t);
    var isMonth = VIZ_MONTHS_SHORT.indexOf(t) !== -1;
    if (isYear || isMonth) contextCount++;
    else childIndexes.push(i);
  }

  if (!childIndexes.length) return ticks;

  var maxLabels = getVizMaxXAxisLabels();
  var maxChild = Math.max(1, maxLabels - contextCount);
  if (childIndexes.length <= maxChild) return ticks;

  var keepStep = Math.ceil(childIndexes.length / maxChild);
  var drop = {};
  for (var j = 0; j < childIndexes.length; j++) {
    var keep = (j % keepStep === 0) || (j === childIndexes.length - 1);
    if (!keep) drop[childIndexes[j]] = true;
  }

  var out = { tickvals: [], ticktext: [] };
  for (var k = 0; k < n; k++) {
    if (drop[k]) continue;
    out.tickvals.push(ticks.tickvals[k]);
    out.ticktext.push(ticks.ticktext[k]);
  }
  return out;
}

// Merge sparse label ticks with denser gridline ticks. Gridline-only positions get a blank
// label so Plotly still draws the vertical gridline without cluttering the axis text.
function buildVizXTicksWithDensity(allDates, labelMode, density) {
  var labelTicks = computeVizXAxisTicks(allDates || [], labelMode);
  if (!labelTicks.tickvals.length) return labelTicks;
  labelTicks = applyVizHierarchicalLabels(labelTicks, labelMode);
  labelTicks = thinVizTickLabels(labelTicks, labelMode);

  var step = density === 'more' ? 1 : (density === 'dense' ? 2 : 0);
  if (step === 0) return labelTicks;

  var labelIdx = VIZ_TICK_LADDER.indexOf(labelMode);
  if (labelIdx < 0) labelIdx = VIZ_TICK_LADDER.length - 1;
  var gridMode = VIZ_TICK_LADDER[Math.min(labelIdx + step, VIZ_TICK_LADDER.length - 1)];
  if (gridMode === labelMode) return labelTicks;

  var gridTicks = computeVizXAxisTicks(allDates || [], gridMode);
  if (!gridTicks.tickvals.length) return labelTicks;

  var labelByTs = {};
  for (var i = 0; i < labelTicks.tickvals.length; i++) {
    var d = parseVizDate(labelTicks.tickvals[i]);
    if (!d) continue;
    labelByTs[d.getTime()] = labelTicks.ticktext[i];
  }

  var merged = [];
  var seenTs = {};
  var pushPos = function (tickval, ts, text) {
    if (seenTs[ts]) return;
    seenTs[ts] = true;
    merged.push({ ts: ts, str: tickval, text: text });
  };

  for (var g = 0; g < gridTicks.tickvals.length; g++) {
    var gd = parseVizDate(gridTicks.tickvals[g]);
    if (!gd) continue;
    pushPos(gridTicks.tickvals[g], gd.getTime(), labelByTs[gd.getTime()] || ' ');
  }
  for (var l = 0; l < labelTicks.tickvals.length; l++) {
    var ld = parseVizDate(labelTicks.tickvals[l]);
    if (!ld) continue;
    pushPos(labelTicks.tickvals[l], ld.getTime(), labelTicks.ticktext[l]);
  }

  merged.sort(function (a, b) { return a.ts - b.ts; });

  var out = { tickvals: [], ticktext: [] };
  for (var m = 0; m < merged.length; m++) {
    out.tickvals.push(merged[m].str);
    out.ticktext.push(merged[m].text);
  }
  return out;
}

// Union of all dates currently plotted (used for live tick updates without a full re-render)
function collectVizChartDates() {
  var dates = [];
  if (vizPlotlyContainer && vizPlotlyContainer.data) {
    for (var i = 0; i < vizPlotlyContainer.data.length; i++) {
      var t = vizPlotlyContainer.data[i];
      if (t && t.x && Array.isArray(t.x)) dates = dates.concat(t.x);
    }
    return dates;
  }
  Object.keys(state.vizDataCache).forEach(function (key) {
    var c = state.vizDataCache[key];
    if (c && c.dates && Array.isArray(c.dates)) dates = dates.concat(c.dates);
  });
  return dates;
}

// Readable text color for the chosen background (light bg → dark text, dark bg → light text)
function pickContrastingTextColor(hex) {
  var r = 0, g = 0, b = 0;
  var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  if (m) {
    r = parseInt(m[1], 16);
    g = parseInt(m[2], 16);
    b = parseInt(m[3], 16);
  }
  var lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.5 ? '#1b2436' : '#d8dce8';
}

function buildVizXAxisConfig(allDates) {
  var cfg = {
    type: 'date',
    showgrid: state.vizGridX,
    gridcolor: state.vizGridColor,
    zerolinecolor: state.vizAxisColor,
    linecolor: state.vizAxisColor,
    showline: true,
    tickangle: state.vizXTickAngle,
    hoverformat: getVizXAxisDateFormat(),
    showspikes: true,
    spikemode: 'across',
    spikethickness: 1,
    spikecolor: state.vizAxisColor,
  };
  var range = getVizVisibleDateRange(allDates);
  var spanDays = (range[0] !== null && range[1] !== null) ? (range[1] - range[0]) / 86400000 : 0;

  var labelMode = state.vizXTickMode;
  if (labelMode === 'auto') {
    labelMode = pickVizAdaptiveTickMode(spanDays);
  }

  var visibleDates = allDates || [];
  if (range[0] !== null && range[1] !== null) {
    visibleDates = filterVizDatesToRange(visibleDates, range[0], range[1]);
  }

  var ticks = buildVizXTicksWithDensity(visibleDates, labelMode, state.vizXGridDensity);
  if (ticks.tickvals.length > 0) {
    cfg.tickmode = 'array';
    cfg.tickvals = ticks.tickvals;
    cfg.ticktext = ticks.ticktext;
  } else {
    cfg.tickformat = getVizXAxisDateFormat();
  }
  return cfg;
}

function buildVizGraphLayoutExtras(allDates) {
  return {
    paper_bgcolor: state.vizGraphBg,
    plot_bgcolor: state.vizGraphBg,
    font: { color: pickContrastingTextColor(state.vizGraphBg), family: 'JetBrains Mono, Consolas, monospace', size: 10 },
    xaxis: buildVizXAxisConfig(allDates),
    yaxis: {
      type: state.vizYLogScale ? 'log' : 'linear',
      showgrid: state.vizGridY,
      gridcolor: state.vizGridColor,
      zerolinecolor: state.vizAxisColor,
      linecolor: state.vizAxisColor,
      showline: true,
      tickformat: '.' + state.vizYAxisDecimals + 'f',
      showspikes: true,
      spikemode: 'across',
      spikethickness: 1,
      spikecolor: state.vizAxisColor,
    },
  };
}

// Apply non-structural graph settings to the live chart without losing zoom/pan
function applyVizGraphSettingLive() {
  if (!vizPlotlyContainer || typeof Plotly === 'undefined') return;
  if (!vizPlotlyContainer._fullLayout) return;

  var extras = buildVizGraphLayoutExtras(collectVizChartDates());
  var relayout = {
    'paper_bgcolor': extras.paper_bgcolor,
    'plot_bgcolor': extras.plot_bgcolor,
    'font.color': extras.font.color,
    'xaxis.showgrid': extras.xaxis.showgrid,
    'xaxis.gridcolor': extras.xaxis.gridcolor,
    'xaxis.zerolinecolor': extras.xaxis.zerolinecolor,
    'xaxis.linecolor': extras.xaxis.linecolor,
    'xaxis.tickangle': extras.xaxis.tickangle,
    'xaxis.hoverformat': extras.xaxis.hoverformat,
    'xaxis.spikecolor': extras.xaxis.spikecolor,
    'yaxis.showgrid': extras.yaxis.showgrid,
    'yaxis.gridcolor': extras.yaxis.gridcolor,
    'yaxis.zerolinecolor': extras.yaxis.zerolinecolor,
    'yaxis.linecolor': extras.yaxis.linecolor,
    'yaxis.spikecolor': extras.yaxis.spikecolor,
  };
  if (extras.xaxis.tickmode === 'array') {
    relayout['xaxis.tickmode'] = 'array';
    relayout['xaxis.tickvals'] = extras.xaxis.tickvals;
    relayout['xaxis.ticktext'] = extras.xaxis.ticktext;
  } else {
    relayout['xaxis.tickmode'] = 'auto';
    relayout['xaxis.tickformat'] = extras.xaxis.tickformat;
  }
  try {
    Plotly.relayout(vizPlotlyContainer, relayout);
  } catch (e) {
    console.log('[GraphSettings] Plotly.relayout error:', e);
  }
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
      <div class="border border-hairline bg-surface-container-lowest px-2 py-2 space-y-1">
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
    <div class="border border-hairline bg-surface-container-lowest px-2 py-2 space-y-1">
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
            ${columns.map((column) => `<th class="text-left border-b border-hairline px-2 py-1 font-normal">${escapeHtml(column.label)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr class="align-top border-b border-hairline last:border-b-0">
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
      <div class="border border-hairline bg-surface-container-low p-md space-y-sm">
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
        <button id="company-retry-button" class="px-2 py-[2px] bg-surface-container-high border border-hairline font-label-md text-label-md hover:border-primary transition-colors">Retry</button>
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
      : 'px-2 py-[2px] bg-surface-container-high border border-hairline font-label-md text-label-md hover:border-primary transition-colors';
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
        <section class="border border-hairline bg-surface-container-low p-md space-y-sm">
          <div class="text-[9px] uppercase mono text-outline">Metadata &amp; company info</div>
          ${renderFieldGrid(metaFields)}
        </section>
        <section class="border border-hairline bg-surface-container-low p-md space-y-sm">
          <div class="text-[9px] uppercase mono text-outline">Location &amp; business</div>
          ${renderFieldGrid(locationFields)}
        </section>
      </div>

      ${info.longBusinessSummary ? `
      <section class="border border-hairline bg-surface-container-low p-md space-y-sm">
        <div class="text-[9px] uppercase mono text-outline">Business summary</div>
        <p class="text-[11px] text-on-surface-variant leading-relaxed">${escapeHtml(info.longBusinessSummary)}</p>
      </section>
      ` : ''}

      <section class="border border-hairline bg-surface-container-low p-md space-y-sm">
        <div class="text-[9px] uppercase mono text-outline">Corporate officers</div>
        ${officersHtml}
      </section>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-sm">
        <section class="border border-hairline bg-surface-container-low p-md space-y-sm">
          <div class="text-[9px] uppercase mono text-outline">Shares &amp; capital structure</div>
          ${renderFieldGrid(shareFields)}
        </section>
        <section class="border border-hairline bg-surface-container-low p-md space-y-sm">
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
        <section class="border border-hairline bg-surface-container-low p-md space-y-sm">
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
        <section class="border border-hairline bg-surface-container-low p-md space-y-sm">
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
        return '<div class="border-b border-hairline last:border-b-0 px-md py-sm space-y-1">' +
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
      '  <section class="border border-hairline bg-surface-container-low p-md space-y-sm">',
      '    <div class="text-[9px] uppercase mono text-outline">Research papers</div>',
      '    <p class="text-[11px] text-on-surface-variant mono">Search for research papers about ' + companyName + ':</p>',
      '    <div class="grid grid-cols-2 sm:grid-cols-4 gap-xs">',
      researchTypes.map(function (type) {
        var isActive = state.researchActiveTopic === type.query;
        var btnClass = isActive
          ? 'research-paper-btn px-2 py-2 bg-primary text-on-primary font-bold border border-primary font-label-md text-label-md text-left transition-colors'
          : 'research-paper-btn px-2 py-2 bg-surface-container-high border border-hairline font-label-md text-label-md text-left hover:border-primary transition-colors';
        return '<button class="' + btnClass + '" ' +
          'data-search="' + escapeHtml(type.query + ' ' + ticker) + '">' +
          escapeHtml(type.label) + '</button>';
      }).join(''),
      '    </div>',
      '  </section>',
      '  <section class="border border-hairline bg-surface-container-low p-md space-y-sm" id="research-results-section">',
      '    <div class="flex items-center justify-between">',
      '      <div class="text-[9px] uppercase mono text-outline">Results</div>',
      state.researchResults.length > 0
        ? '<div class="text-[9px] text-outline mono">' + state.researchResults.length + ' papers found</div>'
        : '',
      '    </div>',
      '    <div id="research-results-list" class="border border-hairline bg-surface-container-high max-h-[400px] overflow-y-auto">',
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
        <section class="border border-hairline bg-surface-container-low p-md space-y-sm">
          <div class="text-[9px] uppercase mono text-outline">Major shareholders</div>
          ${renderMajorHoldersSummary(majorRows)}
        </section>
        <section class="border border-hairline bg-surface-container-low p-md space-y-sm">
          <div class="text-[9px] uppercase mono text-outline">Institutional holders</div>
          ${renderTable(instRows.map(normalizeHolderRow), holderTableColumns)}
        </section>
        <section class="border border-hairline bg-surface-container-low p-md space-y-sm">
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
      <section class="border border-hairline bg-surface-container-low p-md space-y-sm">
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
            <div class="border border-hairline bg-surface-container-lowest p-md space-y-sm">
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
      case 'reports': return renderReportsContent();
      default: return renderOverviewContent();
    }
  }

  companyPage.innerHTML = `
    <div class="space-y-sm min-h-0">
      <div class="border border-hairline bg-surface-container-low p-md space-y-sm">
        <div class="flex items-start justify-between gap-sm">
          <div class="min-w-0 space-y-1">
            <div class="text-[9px] uppercase mono text-outline">Company overview</div>
            <div class="text-headline-lg mono text-on-surface break-words">${escapeHtml(profile.ticker || ticker || 'Company')}</div>
            <div class="text-body-sm text-on-surface-variant break-words">${escapeHtml(profile.companyName || info.longName || info.shortName || 'No company name available')}</div>
          </div>
          <div class="flex items-center gap-xs shrink-0">
            <button id="company-refresh-button" class="px-2 py-[2px] bg-surface-container-high border border-hairline font-label-md text-label-md hover:border-primary transition-colors">Refresh</button>
            <button id="company-overview-button" class="${viewBtnClass('overview')}">Overview</button>
            <button id="company-insiders-button" class="${viewBtnClass('insiders')}">Insiders</button>
            <button id="company-research-button" class="${viewBtnClass('research')}">Research</button>
            <button id="company-ownership-button" class="${viewBtnClass('ownership')}">Ownership</button>
            <button id="company-estimates-button" class="${viewBtnClass('estimates')}">Estimates</button>
            <button id="company-reports-button" class="${viewBtnClass('reports')}">Reports</button>
          </div>
        </div>
        <div class="flex justify-end gap-xs">
          <button id="company-list-toggle-button" class="px-2 py-[2px] bg-surface-container-high border border-hairline font-label-md text-label-md hover:border-primary transition-colors">${isImportedTicker(ticker || profile.ticker) ? 'Remove from List' : 'Add to List'}</button>
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
    // Lazy-load reports on first open of the Reports tab
    if (viewName === 'reports' && !state.companyReportsLoaded) {
      void loadSelectedCompanyReports(false);
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
    const viewBtns = ['overview', 'insiders', 'research', 'ownership', 'estimates', 'reports'];
    for (const v of viewBtns) {
      const btn = document.getElementById('company-' + v + '-button');
      if (btn) {
        const isActive = state.companyView === v;
        btn.className = isActive
          ? 'px-2 py-[2px] bg-primary text-on-primary font-bold font-label-md text-label-md hover:opacity-90 transition-opacity'
          : 'px-2 py-[2px] bg-surface-container-high border border-hairline font-label-md text-label-md hover:border-primary transition-colors';
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

  const reportsButton = document.getElementById('company-reports-button');
  if (reportsButton) {
    reportsButton.addEventListener('click', () => switchView('reports'));
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

  // Reports tab actions (open report links, refresh, retry) bound via delegation
  const reportsContentEl = document.getElementById('company-view-content');
  if (reportsContentEl) {
    reportsContentEl.addEventListener('click', function (e) {
      const openBtn = e.target.closest('.report-open-btn');
      if (openBtn) {
        const url = openBtn.getAttribute('data-url');
        if (url) {
          if (window.finforge && typeof window.finforge.openExternalUrl === 'function') {
            window.finforge.openExternalUrl(url);
          } else {
            window.open(url, '_blank');
          }
        }
        return;
      }

      if (e.target.closest('.reports-refresh-btn')) {
        void loadSelectedCompanyReports(true);
        return;
      }

      if (e.target.closest('.reports-retry-btn')) {
        void loadSelectedCompanyReports(false);
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
    return '<div class="border-b border-hairline last:border-b-0 px-md py-sm space-y-1">' +
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

function renderIrLinks(links) {
  const list = Array.isArray(links) ? links : [];
  if (!list.length) {
    return '<div class="text-[11px] text-outline-variant mono">No Investor Relations links available.</div>';
  }
  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-xs">
      ${list.map(function (link) {
        const url = link && link.url ? link.url : '';
        const label = link && link.label ? link.label : 'Link';
        return `
          <button class="report-open-btn text-left px-md py-sm bg-surface-container-high border border-hairline font-label-md text-label-md hover:border-primary transition-colors" data-url="${escapeHtml(url)}">
            <span class="block">${escapeHtml(label)}</span>
            <span class="block text-[9px] text-outline mono truncate">${escapeHtml(url)}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;
}

function renderReportRow(record) {
  const form = record && record.form ? record.form : '';
  const description = record && record.description ? record.description : '';
  const filingDate = record && record.filingDate ? record.filingDate : '';
  const reportDate = record && record.reportDate ? record.reportDate : '';
  const url = (record && record.documentUrl) || (record && record.filingIndexUrl) || '';
  return `
    <div class="flex items-center justify-between gap-sm px-md py-sm border-b border-hairline last:border-b-0">
      <div class="min-w-0 space-y-1">
        <div class="flex items-center gap-xs min-w-0">
          <span class="shrink-0 text-[9px] uppercase mono px-1 py-[1px] border border-hairline text-outline">${escapeHtml(form)}</span>
          ${description ? `<span class="text-[10px] text-on-surface-variant mono truncate">${escapeHtml(description)}</span>` : ''}
        </div>
        <div class="text-[9px] text-outline mono">
          Filed ${escapeHtml(filingDate || '—')}${reportDate ? ' · Period ' + escapeHtml(reportDate) : ''}
        </div>
      </div>
      ${url ? `<button class="report-open-btn shrink-0 px-2 py-[2px] bg-surface-container-high border border-hairline font-label-md text-label-md hover:border-primary transition-colors" data-url="${escapeHtml(url)}">Open</button>` : ''}
    </div>
  `;
}

function renderReportRows(records) {
  const list = Array.isArray(records) ? records : [];
  if (!list.length) {
    return '<div class="text-[11px] text-outline-variant mono">No reports available.</div>';
  }
  return `
    <div class="border border-hairline bg-surface-container-high max-h-[420px] overflow-y-auto custom-scrollbar">
      ${list.map(renderReportRow).join('')}
    </div>
  `;
}

function renderReportsContent() {
  const reports = state.companyReports;
  const data = reports && reports.reports ? reports.reports : null;

  if (state.companyReportsLoading) {
    return `
      <div class="border border-hairline bg-surface-container-low p-md space-y-sm">
        <div class="text-[9px] uppercase mono text-outline">Reports</div>
        <div class="w-full h-[3px] bg-outline-variant rounded overflow-hidden">
          <div class="h-full bg-primary rounded progress-bar-animate" style="width:60%"></div>
        </div>
        <div class="text-[11px] mono text-outline">Fetching reports from SEC EDGAR and Investor Relations...</div>
      </div>
    `;
  }

  if (state.companyReportsError) {
    return `
      <div class="border border-error bg-surface-container-low p-md space-y-sm">
        <div class="text-[9px] uppercase mono text-error">Reports</div>
        <div class="text-[11px] text-error mono break-words">${escapeHtml(state.companyReportsError)}</div>
        <button class="reports-retry-btn px-2 py-[2px] bg-surface-container-high border border-hairline font-label-md text-label-md hover:border-primary transition-colors">Retry</button>
      </div>
    `;
  }

  if (!data) {
    return `
      <div class="border border-hairline bg-surface-container-low p-md space-y-sm">
        <div class="text-[9px] uppercase mono text-outline">Reports</div>
        <div class="text-[11px] text-outline-variant mono">No reports data available.</div>
      </div>
    `;
  }

  const ir = Array.isArray(data.ir) ? data.ir : [];
  const hasSecFilings = Boolean(reports && reports.hasSecFilings);
  const source = reports && reports.source;
  const sourceLabel =
    source === 'local_cache' ? 'Cached local filings'
    : source === 'sec_edgar' ? 'SEC EDGAR'
    : 'Investor Relations links only';
  const region = reports && reports.region ? ' · ' + escapeHtml(reports.region) : '';

  const sections = [
    { key: 'annual', title: 'Annual reports' },
    { key: 'quarterly', title: 'Quarterly reports' },
    { key: 'events', title: 'Current events & press releases' },
    { key: 'governance', title: 'Governance & registrations' },
    { key: 'other', title: 'Other filings' },
  ];

  const secNotice = hasSecFilings
    ? ''
    : '<div class="text-[11px] text-tertiary mono">No SEC filings found for this company. It may be a foreign issuer not registered with the SEC.</div>';

  const sectionHtml = hasSecFilings
    ? sections.map(function (section) {
        const rows = Array.isArray(data[section.key]) ? data[section.key] : [];
        return `
          <section class="border border-hairline bg-surface-container-low p-md space-y-sm">
            <div class="text-[9px] uppercase mono text-outline">${section.title} (${rows.length})</div>
            ${renderReportRows(rows)}
          </section>
        `;
      }).join('')
    : '';

  return `
    <div class="space-y-sm">
      <section class="border border-hairline bg-surface-container-low p-md space-y-sm">
        <div class="flex items-center justify-between">
          <div class="text-[9px] uppercase mono text-outline">Investor relations</div>
          <button class="reports-refresh-btn px-2 py-[2px] bg-surface-container-high border border-hairline font-label-md text-label-md hover:border-primary transition-colors">Refresh</button>
        </div>
        ${renderIrLinks(ir)}
        ${secNotice}
      </section>
      ${sectionHtml}
      <div class="text-[9px] text-outline mono">Source: ${sourceLabel}${region}${reports && reports.fetchedAt ? ' · Fetched ' + escapeHtml(reports.fetchedAt) : ''}</div>
    </div>
  `;
}

async function loadSelectedCompanyReports(refresh = false) {
  const ticker = state.selectedCompany.ticker || (state.companyProfile && state.companyProfile.ticker) || '';
  if (!ticker) {
    return;
  }

  const requestId = state.companyReportsRequestId + 1;
  state.companyReportsRequestId = requestId;
  state.companyReportsLoading = true;
  state.companyReportsError = '';
  if (!state.companyReportsLoaded) {
    state.companyReports = null;
  }
  updateCompanyReportsContent();

  try {
    if (!window.finforge || typeof window.finforge.loadCompanyReports !== 'function') {
      throw new Error('Company reports action is unavailable');
    }

    const result = await window.finforge.loadCompanyReports(ticker, refresh);
    if (requestId !== state.companyReportsRequestId) {
      return;
    }

    if (!result || result.ok !== true) {
      throw new Error(result && result.error ? result.error : 'Unknown company reports error');
    }

    state.companyReports = result.reports || null;
    state.companyReportsError = '';
    state.companyReportsLoaded = true;
  } catch (error) {
    if (requestId !== state.companyReportsRequestId) {
      return;
    }
    state.companyReportsError = error.message || String(error);
    state.companyReportsLoaded = true;
  } finally {
    if (requestId === state.companyReportsRequestId) {
      state.companyReportsLoading = false;
      updateCompanyReportsContent();
    }
  }
}

function updateCompanyReportsContent() {
  if ((state.companyView || 'overview') !== 'reports') {
    return;
  }
  const contentEl = document.getElementById('company-view-content');
  if (contentEl) {
    contentEl.innerHTML = renderReportsContent();
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
  state.companyReports = null;
  state.companyReportsLoaded = false;
  state.companyReportsError = '';
  state.companyReportsLoading = false;
  state.companyReportsRequestId += 1;
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
      accumulator[name] = { formula: ratio, notes: '', row: '', folder: '' };
      return accumulator;
    }

    accumulator[name] = {
      formula: ratio && typeof ratio === 'object' ? String(ratio.formula || '') : '',
      notes: ratio && typeof ratio === 'object' ? String(ratio.notes || '') : '',
      row: ratio && typeof ratio === 'object' ? String(ratio.row || '') : '',
      folder: ratio && typeof ratio === 'object' ? String(ratio.folder || '') : '',
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
    ...Object.keys(state.ratios).map((name) => `METRIC: ${name}`),
    ...Object.keys(state.ratios).map((name) => `RATIO: ${name}`), // legacy alias so previously saved formulas still highlight
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
  if (kind === 'METRIC') {
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
  if (kind === 'METRIC') { return 'Saved metrics'; }
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

  if (kind === 'METRIC' || kind === 'M' || kind === 'H') {
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
  if (kind === 'METRIC') { return Object.keys(state.ratios).sort((left, right) => left.localeCompare(right)); }
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
  ratioLinePanelSubtitle.textContent = state.ratioLinePanel.kind ? 'Choose the exact line or metric to insert. Click again to deselect.' : 'Choose the financial statement line first';
  ratioLinePanelList.innerHTML = filtered.length
    ? filtered.map((item) => `
      <button class="w-full text-left px-2 py-1.5 text-[10px] mono border border-hairline transition-colors ${item === state.ratioModePanel.token ? 'bg-secondary/10 text-secondary border-secondary' : 'text-on-surface hover:bg-surface-container border-hairline'}" data-line-item="${escapeHtml(item)}">
        ${escapeHtml(item)}
      </button>
    `).join('')
    : '<div class="px-2 py-2 text-[10px] text-on-surface-variant">No lines match the filter.</div>';

  ratioLinePanelList.querySelectorAll('[data-line-item]').forEach((button) => {
    button.addEventListener('click', () => {
      const selectedLine = button.dataset.lineItem || '';
      const selectedKind = state.ratioLinePanel.kind || 'METRIC';
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
      <button class="w-full text-left px-2 py-1.5 text-[10px] mono border border-hairline transition-colors ${isSelected ? 'bg-secondary/10 text-secondary border-secondary' : 'text-on-surface hover:bg-surface-container border-hairline'}" data-mode-value="${escapeHtml(modeOption.value)}">
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
            <input data-mode-param="value" type="number" min="1" max="9999" value="${escapeHtml(String(value))}" class="w-16 h-7 bg-surface-container-lowest border border-hairline px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none"/>
          </label>
          <label class="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span>Unit</span>
            <select data-mode-param="unit" class="h-7 bg-surface-container-lowest border border-hairline px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none">
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
            <input data-mode-param="periods" type="number" min="1" max="999" value="${escapeHtml(String(periods))}" class="w-16 h-7 bg-surface-container-lowest border border-hairline px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none"/>
          </label>
          <label class="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span>Aggregation</span>
            <select data-mode-param="aggregation" class="h-7 bg-surface-container-lowest border border-hairline px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none">
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
            <input data-mode-param="periods" type="number" min="1" max="20" value="${escapeHtml(String(periods))}" class="w-16 h-7 bg-surface-container-lowest border border-hairline px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none"/>
          </label>
          <label class="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span>Unit</span>
            <select data-mode-param="unit" class="h-7 bg-surface-container-lowest border border-hairline px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none">${unitOptions}
            </select>
          </label>
          <label class="flex items-center gap-1 text-[10px] text-on-surface-variant">
            <span>Agg.</span>
            <select data-mode-param="aggregation" class="h-7 bg-surface-container-lowest border border-hairline px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none">${aggOptions}
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
  const currentRatio = state.ratios[state.selectedRatioName] || state.ratios[state.ratioEditorOriginalName] || {};
  const folder = (currentRatio.folder || '') || (state._pendingFolderSelection || '');

  ratioPreview.innerHTML = `
    <div class="space-y-1">
      <div class="text-on-surface mono text-body-sm">${name ? escapeHtml(name) : 'Untitled metric'}</div>
      <div class="flex items-center gap-2 text-[10px] uppercase mono">
        <span class="text-outline">Row</span>
        <span class="px-1.5 py-[1px] border border-hairline text-on-surface-variant bg-surface-container-high">${row ? escapeHtml(row) : 'Auto'}</span>
      </div>
      ${folder ? `<div class="flex items-center gap-1 text-[10px] mono"><span class="material-symbols-outlined text-[12px] text-outline">folder</span><span class="text-outline">${escapeHtml(folder)}</span></div>` : ''}
      <div class="text-outline mono text-[10px] break-words">${formula ? escapeHtml(formula) : 'Enter a formula to preview the metric.'}</div>
      <div class="text-outline text-[10px]">${notes ? escapeHtml(notes) : 'Add notes for interpretation, sources, or thresholds.'}</div>
    </div>
  `;
}

function setRatioForm(name = '', ratio = { formula: '', notes: '', row: '', folder: '' }) {
  state.selectedRatioName = name;
  state.ratioEditorMode = name ? 'edit' : 'create';
  state.ratioEditorOriginalName = name;
  setRatioWorkspaceView('maker');
  ratioNameInput.value = name;
  setFormulaText(ratio.formula || '');
  ratioNotesInput.value = ratio.notes || '';
  ratioRowInput.value = String(ratio.row || '');
  ratioEditorState.textContent = name ? `Editing ${name}` : 'Creating new metric';
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
  renderRatioFolderPicker();
  if (ratioFolderPicker) {
    ratioFolderPicker.classList.add('hidden');
  }
}

function cancelRatioEdit() {
  const originalName = state.ratioEditorOriginalName;

  if (originalName && state.ratios[originalName]) {
    setRatioForm(originalName, state.ratios[originalName]);
    return;
  }

  setRatioForm();
}

// ── Folder Management ──

async function loadFoldersFromDisk() {
  try {
    if (!window.finforge || typeof window.finforge.loadFolders !== 'function') {
      state.folders = [];
      return;
    }
    const result = await window.finforge.loadFolders();
    state.folders = Array.isArray(result)
      ? result.map((f) => String(f).trim()).filter(Boolean)
      : [];
  } catch {
    state.folders = [];
  }
}

async function saveFoldersToDisk() {
  try {
    if (!window.finforge || typeof window.finforge.saveFolders !== 'function') {
      // No Electron bridge (e.g. opened as plain HTML) - nothing to persist
      return true;
    }
    const result = await window.finforge.saveFolders(state.folders);
    if (!result || result.ok !== true) {
      throw new Error(result && result.error ? result.error : 'Unknown folder save error');
    }
    return true;
  } catch (error) {
    const message = String(error && error.message ? error.message : error);
    // Stale main process: handler not registered yet (app not restarted).
    // Folders still work in-memory for this session; no need for a scary banner.
    if (/no handler registered/i.test(message)) {
      console.warn('Folder persistence unavailable until the app is restarted:', message);
      return false;
    }
    setStatus(`Folder save failed: ${message}`, 'error');
    return false;
  }
}

// Union of persisted folders and folders referenced by metrics
function getAllFolders() {
  const folderSet = new Set(state.folders.map((f) => String(f).trim()).filter(Boolean));
  for (const ratio of Object.values(state.ratios)) {
    if (ratio && typeof ratio === 'object' && ratio.folder) {
      folderSet.add(String(ratio.folder).trim());
    }
  }
  return Array.from(folderSet).sort((a, b) => a.localeCompare(b));
}

function getMetricsInFolder(folderName) {
  const normalized = String(folderName || '').trim();
  if (!normalized) return [];
  return Object.entries(state.ratios)
    .filter(([, ratio]) => ratio && typeof ratio === 'object' && String(ratio.folder || '').trim() === normalized)
    .map(([name]) => name)
    .sort((a, b) => a.localeCompare(b));
}

function getUnassignedMetrics() {
  return Object.entries(state.ratios)
    .filter(([, ratio]) => !ratio || typeof ratio !== 'object' || !String(ratio.folder || '').trim())
    .map(([name]) => name)
    .sort((a, b) => a.localeCompare(b));
}

async function setMetricFolder(metricName, folderName) {
  if (!state.ratios[metricName]) return;
  const normalizedFolder = String(folderName || '').trim();
  state.ratios[metricName] = { ...state.ratios[metricName], folder: normalizedFolder };
  // Ensure the folder is registered in the persisted folder list
  if (normalizedFolder && !state.folders.includes(normalizedFolder)) {
    state.folders = [...state.folders, normalizedFolder].sort((a, b) => a.localeCompare(b));
  }
  await saveRatiosToDisk();
  await saveFoldersToDisk();
  renderFolders();
}

async function removeMetricFromFolder(metricName) {
  await setMetricFolder(metricName, '');
}

async function createNewFolder() {
  state.folderModalMode = 'create';
  state.folderModalOriginalName = '';
  openFolderModal();
}

function openFolderModal() {
  if (!folderModal) return;
  const isRename = state.folderModalMode === 'rename';
  folderModalTitle.textContent = isRename ? 'Rename folder' : 'New folder';
  folderModalInput.value = isRename ? state.folderModalOriginalName : '';
  folderModalError.classList.add('hidden');
  folderModal.classList.remove('hidden');
  folderModalInput.focus();
  folderModalInput.select();
}

function closeFolderModal() {
  if (!folderModal) return;
  folderModal.classList.add('hidden');
  folderModalInput.value = '';
  folderModalError.classList.add('hidden');
}

function submitFolderModal() {
  const name = String(folderModalInput.value || '').trim();
  if (!name) {
    folderModalError.textContent = 'Folder name is required';
    folderModalError.classList.remove('hidden');
    return;
  }

  if (state.folderModalMode === 'create') {
    if (state.folders.includes(name) || getMetricsInFolder(name).length) {
      folderModalError.textContent = `Folder "${name}" already exists`;
      folderModalError.classList.remove('hidden');
      return;
    }
    state.folders = [...state.folders, name].sort((a, b) => a.localeCompare(b));
    setStatus(`Folder "${name}" created`, 'success');
  } else {
    const oldName = state.folderModalOriginalName;
    if (oldName === name) {
      closeFolderModal();
      return;
    }
    if (state.folders.includes(name) || getMetricsInFolder(name).length) {
      folderModalError.textContent = `Folder "${name}" already exists`;
      folderModalError.classList.remove('hidden');
      return;
    }
    renameFolder(oldName, name);
    setStatus(`Folder "${oldName}" renamed to "${name}"`, 'success');
  }

  void saveFoldersToDisk();
  closeFolderModal();
  renderFolders();
}

async function renameFolder(oldName, newName) {
  const oldFolder = String(oldName || '').trim();
  const newFolder = String(newName || '').trim();
  if (!oldFolder || !newFolder || oldFolder === newFolder) return;

  // Rename in persisted folder list
  state.folders = state.folders
    .map((f) => (f === oldFolder ? newFolder : f))
    .sort((a, b) => a.localeCompare(b));

  // Rename on all assigned metrics
  for (const [name, ratio] of Object.entries(state.ratios)) {
    if (ratio && typeof ratio === 'object' && String(ratio.folder || '').trim() === oldFolder) {
      state.ratios[name] = { ...ratio, folder: newFolder };
    }
  }
  // Keep active filter in sync if it targeted the renamed folder
  if (state.ratioFolderFilter === oldFolder) {
    state.ratioFolderFilter = newFolder;
    syncRatioFolderFilterLabel();
  }
  await saveRatiosToDisk();
}

async function deleteFolder(folderName) {
  if (!folderName) return;
  state.folderPendingDelete = folderName;
  // Always confirm before deleting a folder
  const metricsInFolder = getMetricsInFolder(folderName);
  folderConfirmMessage.textContent = metricsInFolder.length
    ? `Delete folder "${folderName}"? This will unassign ${metricsInFolder.length} metric(s).`
    : `Delete folder "${folderName}"?`;
  folderConfirmModal.classList.remove('hidden');
}

async function confirmDeleteFolder() {
  const folderName = state.folderPendingDelete;
  state.folderPendingDelete = '';
  closeFolderConfirmModal();
  if (!folderName) return;

  const metricsInFolder = getMetricsInFolder(folderName);
  for (const name of metricsInFolder) {
    state.ratios[name] = { ...state.ratios[name], folder: '' };
  }
  if (metricsInFolder.length) {
    await saveRatiosToDisk();
  }
  state.folders = state.folders.filter((f) => f !== folderName);
  await saveFoldersToDisk();
  // If the active folder filter no longer exists, reset it
  if (state.ratioFolderFilter === folderName) {
    state.ratioFolderFilter = '';
    syncRatioFolderFilterLabel();
  }
  renderFolders();
  renderRatios();
  setStatus(`Folder "${folderName}" deleted`, 'success');
}

function closeFolderConfirmModal() {
  if (!folderConfirmModal) return;
  folderConfirmModal.classList.add('hidden');
}

function startMoveMetricMode(metricName) {
  state.ratioFolderEditMode = { active: true, metricName: metricName };
  renderFolders();
}

function cancelMoveMetricMode() {
  state.ratioFolderEditMode = { active: false, metricName: '' };
  renderFolders();
}

function renderFolders() {
  if (!ratioFolderList) return;

  const folders = getAllFolders();
  const editMode = state.ratioFolderEditMode;
  const searchTerm = String(state.ratioSearch || '').trim().toLowerCase();
  const searching = searchTerm.length > 0;
  const matchesSearch = (name) => !searchTerm || String(name).toLowerCase().includes(searchTerm);
  const bodyHiddenClass = searching ? '' : ' hidden';
  const chevronStyle = searching ? ' style="transform:rotate(90deg)"' : '';
  const unassigned = getUnassignedMetrics().filter(matchesSearch);

  let html = '';

  // Unassigned metrics section
  if (unassigned.length > 0) {
    html += `
      <div class="folder-group border border-hairline bg-surface-container">
        <div class="folder-header px-md py-1 bg-surface-container-high flex items-center justify-between cursor-pointer" data-folder-toggle="unassigned">
          <div class="flex items-center gap-sm">
            <span class="material-symbols-outlined text-[14px] text-outline transition-transform folder-chevron"${chevronStyle}>chevron_right</span>
            <span class="font-label-sm text-label-sm text-on-surface uppercase mono">Unassigned</span>
            <span class="text-[9px] text-outline mono">${unassigned.length} metric(s)</span>
          </div>
        </div>
        <div class="folder-body${bodyHiddenClass} divide-y divide-hairline" data-folder-body="unassigned">
          ${unassigned.map((name) => renderFolderMetricRow(name, '')).join('')}
        </div>
      </div>
    `;
  }

  // Folder groups
  for (const folder of folders) {
    const metrics = getMetricsInFolder(folder).filter(matchesSearch);
    if (searching && metrics.length === 0) continue; // hide empty groups while searching
    html += `
      <div class="folder-group border border-hairline bg-surface-container">
        <div class="folder-header px-md py-1 bg-surface-container-high flex items-center justify-between cursor-pointer" data-folder-toggle="${escapeHtml(folder)}">
          <div class="flex items-center gap-sm">
            <span class="material-symbols-outlined text-[14px] text-outline transition-transform folder-chevron"${chevronStyle}>chevron_right</span>
            <span class="material-symbols-outlined text-[14px] text-secondary">folder</span>
            <span class="font-label-sm text-label-sm text-on-surface uppercase mono">${escapeHtml(folder)}</span>
            <span class="text-[9px] text-outline mono">${metrics.length} metric(s)</span>
          </div>
          <div class="flex items-center gap-xs">
            ${editMode.active && editMode.metricName && !metrics.includes(editMode.metricName)
              ? `<button class="folder-move-into px-2 py-[2px] bg-secondary/10 text-secondary border border-secondary font-label-md text-label-md hover:opacity-90 transition-opacity" data-folder-move="${escapeHtml(folder)}">Select folder</button>`
              : ''}
            <button class="folder-rename-btn p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors" data-folder-rename="${escapeHtml(folder)}" title="Rename folder" aria-label="Rename folder"><span class="material-symbols-outlined text-[16px]">edit</span></button>
            <button class="folder-delete p-1 text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors" data-folder-delete="${escapeHtml(folder)}" title="Delete" aria-label="Delete"><span class="material-symbols-outlined text-[16px]">delete</span></button>
          </div>
        </div>
        <div class="folder-body${bodyHiddenClass} divide-y divide-hairline" data-folder-body="${escapeHtml(folder)}">
          ${metrics.map((name) => renderFolderMetricRow(name, folder)).join('')}
        </div>
      </div>
    `;
  }

  // Edit mode banner (always on top)
  const editBanner = editMode.active && editMode.metricName
    ? `
      <div class="border border-secondary bg-secondary/5 p-sm mb-sm flex items-center justify-between gap-sm">
        <div class="text-body-sm text-on-surface mono">
          Select folder to move <span class="text-secondary font-bold">${escapeHtml(editMode.metricName)}</span> to a new folder
        </div>
        <button id="folder-cancel-move" class="px-2 py-[2px] bg-surface-container-high border border-hairline font-label-md text-label-md hover:border-primary transition-colors">Cancel</button>
      </div>
    `
    : '';

  if (!html) {
    html = searching
      ? `<div class="border border-hairline bg-surface-container p-md text-body-sm text-on-surface-variant">No metrics match "${escapeHtml(String(state.ratioSearch || '').trim())}".</div>`
      : '<div class="border border-hairline bg-surface-container p-md text-body-sm text-on-surface-variant">No metrics to organize. Create metrics first.</div>';
  }

  html = editBanner + html;

  ratioFolderList.innerHTML = html;

  // Attach toggle listeners
  ratioFolderList.querySelectorAll('[data-folder-toggle]').forEach((header) => {
    header.addEventListener('click', () => {
      const folderKey = header.dataset.folderToggle;
      const body = ratioFolderList.querySelector(`[data-folder-body="${CSS.escape(folderKey)}"]`);
      const chevron = header.querySelector('.folder-chevron');
      if (body) {
        const isHidden = body.classList.contains('hidden');
        body.classList.toggle('hidden');
        if (chevron) {
          chevron.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
        }
      }
    });
  });

  // Attach edit folder listeners
  ratioFolderList.querySelectorAll('[data-folder-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const metricName = btn.dataset.folderEdit;
      startMoveMetricMode(metricName);
    });
  });

  // Attach remove from folder listeners
  ratioFolderList.querySelectorAll('[data-folder-remove]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const metricName = btn.dataset.folderRemove;
      await removeMetricFromFolder(metricName);
    });
  });

  // Attach move into folder listeners (in edit mode)
  ratioFolderList.querySelectorAll('[data-folder-move]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetFolder = btn.dataset.folderMove;
      if (editMode.metricName) {
        await setMetricFolder(editMode.metricName, targetFolder);
        cancelMoveMetricMode();
      }
    });
  });

  // Attach delete folder listeners
  ratioFolderList.querySelectorAll('[data-folder-delete]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const folderName = btn.dataset.folderDelete;
      await deleteFolder(folderName);
    });
  });

  // Attach rename folder listeners
  ratioFolderList.querySelectorAll('[data-folder-rename]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const folderName = btn.dataset.folderRename;
      state.folderModalMode = 'rename';
      state.folderModalOriginalName = folderName;
      openFolderModal();
    });
  });

  // Attach cancel move listener
  const cancelMoveBtn = document.getElementById('folder-cancel-move');
  if (cancelMoveBtn) {
    cancelMoveBtn.addEventListener('click', cancelMoveMetricMode);
  }
}

function renderFolderMetricRow(name, currentFolder) {
  const editMode = state.ratioFolderEditMode;

  return `
    <div class="folder-metric-row px-md py-1 flex items-center justify-between gap-sm hover:bg-surface-container-high transition-colors">
      <div class="min-w-0 flex-1">
        <div class="text-body-sm text-on-surface mono truncate">${escapeHtml(name)}</div>
      </div>
      <div class="flex items-center gap-xs shrink-0">
        <button class="folder-edit-btn p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors" data-folder-edit="${escapeHtml(name)}" title="Move" aria-label="Move"><span class="material-symbols-outlined text-[16px]">drive_file_move</span></button>
        ${currentFolder ? `<button class="folder-remove-btn p-1 text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors" data-folder-remove="${escapeHtml(name)}" title="Remove from folder" aria-label="Remove from folder"><span class="material-symbols-outlined text-[16px]">playlist_remove</span></button>` : ''}
      </div>
    </div>
  `;
}

function renderRatioFolderPicker() {
  if (!ratioFolderPicker || !ratioFolderPickerList) return;

  const currentName = state.selectedRatioName || state.ratioEditorOriginalName;
  const currentRatio = currentName ? state.ratios[currentName] : null;
  const currentFolder = (currentRatio && currentRatio.folder ? String(currentRatio.folder).trim() : '')
    || (state._pendingFolderSelection || '');

  // Update right panel current selection display
  ratioFolderPickerCurrent.textContent = currentFolder || 'No folder selected';
  ratioFolderPickerCurrent.classList.toggle('text-outline-variant', !currentFolder);
  ratioFolderPickerCurrent.classList.toggle('text-secondary', !!currentFolder);

  if (currentFolder) {
    ratioFolderPickerCurrent.innerHTML = `<span class="material-symbols-outlined text-[12px] text-secondary">folder</span> ${escapeHtml(currentFolder)}`;
  }

  // Update left panel trigger button
  if (ratioFolderTrigger && ratioFolderTriggerText) {
    ratioFolderTriggerText.textContent = currentFolder || 'Choose folder...';
    ratioFolderTriggerText.classList.toggle('text-on-surface-variant', !currentFolder);
    ratioFolderTriggerText.classList.toggle('text-secondary', !!currentFolder);
    if (currentFolder) {
      ratioFolderTrigger.querySelector('.material-symbols-outlined').classList.add('text-secondary');
      ratioFolderTrigger.querySelector('.material-symbols-outlined').classList.remove('text-outline');
    } else {
      ratioFolderTrigger.querySelector('.material-symbols-outlined').classList.add('text-outline');
      ratioFolderTrigger.querySelector('.material-symbols-outlined').classList.remove('text-secondary');
    }
  }

  const folders = getAllFolders();

  ratioFolderPickerList.innerHTML = folders.length
    ? folders.map((folder) => {
        const isSelected = folder === currentFolder;
        return `
          <div class="folder-picker-row px-md py-1 flex items-center justify-between gap-sm hover:bg-surface-container-high transition-colors cursor-pointer ${isSelected ? 'bg-primary/5 border-l-2 border-primary' : ''}" data-folder-select="${escapeHtml(folder)}">
            <div class="flex items-center gap-sm">
              <span class="material-symbols-outlined text-[14px] ${isSelected ? 'text-primary' : 'text-outline'}">folder</span>
              <span class="text-body-sm text-on-surface mono">${escapeHtml(folder)}</span>
            </div>
            ${isSelected ? '<span class="text-[9px] text-primary mono uppercase">Selected</span>' : ''}
          </div>
        `;
      }).join('')
    : '<div class="px-md py-1 text-[10px] text-outline mono">No folders created yet. Use the Folders tab to create folders.</div>';

  // Attach click listeners
  ratioFolderPickerList.querySelectorAll('[data-folder-select]').forEach((row) => {
    row.addEventListener('click', () => {
      const folderName = row.dataset.folderSelect;
      // Register folder in persisted list
      if (folderName && !state.folders.includes(folderName)) {
        state.folders = [...state.folders, folderName].sort((a, b) => a.localeCompare(b));
        void saveFoldersToDisk();
      }
      const metricName = state.selectedRatioName || state.ratioEditorOriginalName;
      if (metricName && state.ratios[metricName]) {
        state.ratios[metricName] = { ...state.ratios[metricName], folder: folderName };
      } else {
        state._pendingFolderSelection = folderName;
      }
      renderRatioFolderPicker();
      syncRatioPreview();
      // Close the folder picker after selection
      if (ratioFolderPicker) {
        ratioFolderPicker.classList.add('hidden');
      }
    });
  });
}

// Left panel "Choose folder" button: toggle folder picker in right panel
if (ratioFolderTrigger) {
  ratioFolderTrigger.addEventListener('click', () => {
    if (ratioFolderPicker) {
      const isHidden = ratioFolderPicker.classList.contains('hidden');
      if (isHidden) {
        ratioFolderPicker.classList.remove('hidden');
        ratioFolderPicker.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Brief highlight pulse
        ratioFolderPicker.style.transition = 'border-color 0.15s ease';
        ratioFolderPicker.style.borderColor = '#adc6ff';
        setTimeout(() => {
          ratioFolderPicker.style.borderColor = '';
        }, 800);
      } else {
        ratioFolderPicker.classList.add('hidden');
      }
    }
  });
}

// Clear folder picker
if (ratioFolderPickerClear) {
  ratioFolderPickerClear.addEventListener('click', () => {
    const metricName = state.selectedRatioName || state.ratioEditorOriginalName;
    if (metricName && state.ratios[metricName]) {
      state.ratios[metricName] = { ...state.ratios[metricName], folder: '' };
    } else {
      state._pendingFolderSelection = '';
    }
    renderRatioFolderPicker();
    syncRatioPreview();
    if (ratioFolderPicker) {
      ratioFolderPicker.classList.add('hidden');
    }
  });
}

// ── Metrics folder filter dropdown ──

function toggleRatioFolderFilterMenu() {
  if (!ratioFolderFilterMenu) return;
  if (ratioFolderFilterMenu.classList.contains('hidden')) {
    ratioFolderFilterMenu.classList.remove('hidden');
    ratioFolderFilterSearch.value = '';
    renderRatioFolderFilter();
    ratioFolderFilterSearch.focus();
  } else {
    ratioFolderFilterMenu.classList.add('hidden');
  }
}

function renderRatioFolderFilter() {
  if (!ratioFolderFilterList) return;
  const searchTerm = ratioFolderFilterSearch.value.trim().toLowerCase();
  const folders = getAllFolders();
  const visibleFolders = searchTerm
    ? folders.filter((f) => f.toLowerCase().includes(searchTerm))
    : folders;

  const rows = [
    `<div class="folder-filter-row px-md py-1 flex items-center justify-between gap-sm hover:bg-surface-container-high transition-colors cursor-pointer ${!state.ratioFolderFilter ? 'bg-primary/5 border-l-2 border-primary' : ''}" data-folder-filter="">
      <div class="flex items-center gap-sm">
        <span class="material-symbols-outlined text-[14px] ${!state.ratioFolderFilter ? 'text-primary' : 'text-outline'}">apps</span>
        <span class="text-body-sm text-on-surface mono">All folders</span>
      </div>
      ${!state.ratioFolderFilter ? '<span class="text-[9px] text-primary mono uppercase">Active</span>' : ''}
    </div>`,
  ];

  for (const folder of visibleFolders) {
    const isSelected = state.ratioFolderFilter === folder;
    rows.push(`
      <div class="folder-filter-row px-md py-1 flex items-center justify-between gap-sm hover:bg-surface-container-high transition-colors cursor-pointer ${isSelected ? 'bg-primary/5 border-l-2 border-primary' : ''}" data-folder-filter="${escapeHtml(folder)}">
        <div class="flex items-center gap-sm">
          <span class="material-symbols-outlined text-[14px] ${isSelected ? 'text-primary' : 'text-outline'}">folder</span>
          <span class="text-body-sm text-on-surface mono truncate">${escapeHtml(folder)}</span>
        </div>
        ${isSelected ? '<span class="text-[9px] text-primary mono uppercase">Active</span>' : ''}
      </div>
    `);
  }

  ratioFolderFilterList.innerHTML = visibleFolders.length || rows.length > 1
    ? rows.join('')
    : '<div class="px-md py-1 text-[10px] text-outline mono">No folders found.</div>';

  ratioFolderFilterList.querySelectorAll('[data-folder-filter]').forEach((row) => {
    row.addEventListener('click', () => {
      const folderName = row.dataset.folderFilter;
      state.ratioFolderFilter = folderName;
      ratioFolderFilterLabel.textContent = folderName || 'All folders';
      if (ratioFolderFilterMenu) ratioFolderFilterMenu.classList.add('hidden');
      renderRatios();
    });
  });
}

function syncRatioFolderFilterLabel() {
  if (ratioFolderFilterLabel) {
    ratioFolderFilterLabel.textContent = state.ratioFolderFilter || 'All folders';
  }
}

if (ratioFolderFilterButton) {
  ratioFolderFilterButton.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleRatioFolderFilterMenu();
  });
}
if (ratioFolderFilterSearch) {
  ratioFolderFilterSearch.addEventListener('input', renderRatioFolderFilter);
  ratioFolderFilterSearch.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      ratioFolderFilterMenu.classList.add('hidden');
    }
  });
}
document.addEventListener('click', (event) => {
  if (ratioFolderFilterMenu && !ratioFolderFilterMenu.classList.contains('hidden') &&
      ratioFolderFilterWrap && !ratioFolderFilterWrap.contains(event.target)) {
    ratioFolderFilterMenu.classList.add('hidden');
  }
});

function updateRatioSelectionActions() {
  const isMetrics = state.ratioMiddleView === 'metrics';
  const isFolder = state.ratioMiddleView === 'folder';
  const hasSelection = state.ratioSelection.size > 0;
  if (ratioSelectionActions) {
    ratioSelectionActions.classList.toggle('hidden', !(isMetrics && hasSelection));
  }
  if (ratioActionsSeparator) {
    ratioActionsSeparator.classList.toggle('hidden', !((isMetrics && hasSelection) || isFolder));
  }
}

function openExportTickersModal() {
  if (!exportTickersModal) return;
  state.exportTickerSelection.clear();
  if (exportTickersError) exportTickersError.classList.add('hidden');
  renderExportTickersList();
  exportTickersModal.classList.remove('hidden');
}

function closeExportTickersModal() {
  if (!exportTickersModal) return;
  exportTickersModal.classList.add('hidden');
}

function renderExportTickersList() {
  if (!exportTickersList) return;
  const tickers = Array.isArray(state.importList) ? state.importList.slice().sort() : [];
  exportTickersList.innerHTML = tickers.length
    ? tickers.map((ticker) => `
        <label class="flex items-center gap-sm px-2 py-1 hover:bg-surface-container-high cursor-pointer">
          <input class="export-ticker-select accent-outline h-3 w-3 opacity-60 hover:opacity-100" type="checkbox" data-export-ticker="${escapeHtml(ticker)}" ${state.exportTickerSelection.has(ticker) ? 'checked' : ''}/>
          <span class="text-body-sm mono text-on-surface">${escapeHtml(ticker)}</span>
        </label>
      `).join('')
    : '<div class="px-2 py-1 text-body-sm text-on-surface-variant mono">No tickers imported.</div>';

  exportTickersList.querySelectorAll('[data-export-ticker]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const ticker = checkbox.dataset.exportTicker || '';
      if (checkbox.checked) {
        state.exportTickerSelection.add(ticker);
      } else {
        state.exportTickerSelection.delete(ticker);
      }
    });
  });
}

function setExportTickersAll(checked) {
  const tickers = Array.isArray(state.importList) ? state.importList : [];
  if (checked) {
    tickers.forEach((ticker) => state.exportTickerSelection.add(ticker));
  } else {
    state.exportTickerSelection.clear();
  }
  renderExportTickersList();
}

async function submitExportTimeseries() {
  if (!exportTickersError) return;

  if (state.exportTickerSelection.size === 0) {
    exportTickersError.textContent = 'Select at least one ticker to export.';
    exportTickersError.classList.remove('hidden');
    return;
  }

  const metrics = Array.from(state.ratioSelection).map((name) => ({
    name,
    formula: (state.ratios[name] && state.ratios[name].formula) || '',
  }));
  if (metrics.length === 0) {
    exportTickersError.textContent = 'Select at least one metric to export.';
    exportTickersError.classList.remove('hidden');
    return;
  }

  const tickers = Array.from(state.exportTickerSelection).sort();
  exportTickersError.classList.add('hidden');
  if (exportTickersExportButton) exportTickersExportButton.disabled = true;

  try {
    const result = await window.finforge.exportRatiosTimeseries({ tickers, metrics });
    if (result && result.ok) {
      setStatus('Ratios exported to the Export Ratios sheet', 'success');
      closeExportTickersModal();
    } else {
      const message = (result && result.error) || 'Export failed.';
      exportTickersError.textContent = message;
      exportTickersError.classList.remove('hidden');
      setStatus(`Export failed: ${message}`, 'error');
    }
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    exportTickersError.textContent = message;
    exportTickersError.classList.remove('hidden');
    setStatus(`Export failed: ${message}`, 'error');
  } finally {
    if (exportTickersExportButton) exportTickersExportButton.disabled = false;
  }
}

function renderRatios() {
  syncRatioFolderFilterLabel();
  updateRatioSelectionActions();
  const entries = Object.entries(state.ratios).sort(([leftName], [rightName]) => leftName.localeCompare(rightName));
  const searchTerm = state.ratioSearch.trim().toLowerCase();
  const folderFilter = state.ratioFolderFilter ? String(state.ratioFolderFilter).trim() : '';
  const folderFiltered = folderFilter
    ? entries.filter(([, ratio]) => ratio && typeof ratio === 'object' && String(ratio.folder || '').trim() === folderFilter)
    : entries;
  const filtered = searchTerm
    ? folderFiltered.filter(([name]) => name.toLowerCase().includes(searchTerm))
    : folderFiltered;
  if (ratioCount) ratioCount.textContent = `${entries.length} metrics`;
  if (ratioCountMaker) {
    ratioCountMaker.textContent = `${entries.length} metrics`;
  }
  const dupMap = getDuplicateRowMap();

  if (ratioResultsCount) ratioResultsCount.textContent = `${filtered.length} shown`;
  ratioList.innerHTML = filtered.length
    ? filtered.map(([name, ratio]) => {
        const notes = ratio && typeof ratio === 'object' ? String(ratio.notes || '') : '';
        const ratioRow = ratio && typeof ratio === 'object' ? String(ratio.row || '') : '';
        const ratioFolder = ratio && typeof ratio === 'object' ? String(ratio.folder || '') : '';
        const isActive = state.selectedRatioName === name || state.ratioEditorOriginalName === name;
        const isSelected = state.ratioSelection.has(name);
        const renderedNotes = isActive ? String(ratioNotesInput.value.trim() || '') : notes;
        const renderedRow = isActive ? String(ratioRowInput.value.trim() || '') : ratioRow;
        const renderedFolder = isActive ? (state.ratios[name] ? String(state.ratios[name].folder || '') : ratioFolder) : ratioFolder;
        const rowDups = renderedRow && dupMap[renderedRow] ? dupMap[renderedRow].filter((n) => n !== name) : [];
        const isDup = rowDups.length > 0;
        const dupTitle = isDup ? `Duplicate row: ${rowDups.join(', ')}` : '';

        return `
          <article class="ratio-card px-sm py-1.5 hover:bg-surface-container-high transition-colors ${isActive ? 'bg-surface-container-high' : ''}" data-ratio-card data-ratio-name="${escapeHtml(name)}">
            <div class="flex flex-row items-center gap-sm min-w-0">
              <label class="shrink-0 flex items-center justify-center cursor-pointer">
                <input class="ratio-select appearance-auto accent-outline h-3 w-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer" type="checkbox" data-ratio-select="${escapeHtml(name)}" ${isSelected ? 'checked' : ''} aria-label="Select ${escapeHtml(name)}"/>
              </label>
              <div class="min-w-0 flex items-center gap-sm lg:w-[26%]">
                <div class="min-w-0 flex-1">
                  <div class="text-on-surface mono text-body-sm font-semibold leading-tight truncate">${escapeHtml(isActive ? ratioNameInput.value.trim() || name : name)}</div>
                  <div class="flex items-center gap-1 text-[10px] mono text-outline h-3.5">
                    ${renderedFolder ? `<span class="material-symbols-outlined text-[12px]">folder</span><span class="truncate">${escapeHtml(renderedFolder)}</span>` : '<span class="truncate">&nbsp;</span>'}
                  </div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <span class="text-[9px] text-outline uppercase mono">Row</span>
                  <input class="ratio-row-input w-12 h-5 bg-surface-container-lowest px-1 text-[10px] font-label-md text-label-md text-on-surface placeholder:text-outline-variant outline-none mono text-center ${isDup ? 'border-error text-error' : 'border-hairline focus:border-secondary'}" type="number" min="7" placeholder="N/A" value="${escapeHtml(renderedRow)}" data-ratio-row="${escapeHtml(name)}" title="${escapeHtml(dupTitle)}"/>
                </div>
              </div>
              <div class="min-w-0 flex-1 border border-hairline bg-surface-container-lowest px-sm py-0.5 hidden lg:block">
                <div class="text-[10px] text-outline break-words truncate">${escapeHtml(renderedNotes || 'No notes.')}</div>
              </div>
              <div class="shrink-0 flex flex-row items-center gap-xs">
                <button class="ratio-edit p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors" data-ratio-edit="${escapeHtml(name)}" title="Edit" aria-label="Edit"><span class="material-symbols-outlined text-[16px]">edit</span></button>
                <button class="ratio-duplicate p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors" data-ratio-duplicate="${escapeHtml(name)}" title="Duplicate" aria-label="Duplicate"><span class="material-symbols-outlined text-[16px]">content_copy</span></button>
                <button class="ratio-delete p-1 text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors" data-ratio-delete="${escapeHtml(name)}" title="Delete" aria-label="Delete"><span class="material-symbols-outlined text-[16px]">delete</span></button>
              </div>
            </div>
          </article>
        `;
      }).join('')
    : '<div class="border border-hairline bg-surface-container p-md text-body-sm text-on-surface-variant">No metrics match the filter.</div>';

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

  ratioList.querySelectorAll('[data-ratio-select]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const name = checkbox.dataset.ratioSelect || '';
      if (checkbox.checked) {
        state.ratioSelection.add(name);
      } else {
        state.ratioSelection.delete(name);
      }
      updateRatioSelectionActions();
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
      if (!name || !window.confirm(`Delete metric "${name}"?`)) {
        return;
      }

      delete state.ratios[name];
      state.ratioSelection.delete(name);
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
    folder: String(sourceRatio.folder || ''),
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
    return { ok: false, error: 'Metric name is required' };
  }

  const originalName = state.ratioEditorOriginalName || name;
  if (originalName && originalName !== name) {
    delete state.ratios[originalName];
  }

  const rawRow = ratioRowInput.value.trim();
  const parsedRow = rawRow ? String(parseInt(rawRow, 10) || '') : '';

  // Preserve existing folder or use pending folder selection for new metrics
  const existingFolder = (state.ratios[name] && state.ratios[name].folder) ? String(state.ratios[name].folder) : '';
  const pendingFolder = state._pendingFolderSelection || '';
  const resolvedFolder = existingFolder || pendingFolder;

  state.ratios[name] = {
    formula: getFormulaText().trim(),
    notes: ratioNotesInput.value.trim(),
    row: parsedRow,
    folder: resolvedFolder,
  };

  state._pendingFolderSelection = '';

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
    setStatus('Metrics saved', 'success');
    renderRatios();
    return true;
  } catch (error) {
    setStatus(`Metric save failed: ${error.message || error}`, 'error');
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
    setStatus(Object.keys(state.ratios).length ? 'Metrics loaded' : 'Metric store empty', Object.keys(state.ratios).length ? 'success' : 'warning');
    state.lastSavedRatiosSnapshot = snapshotRatios();
  } catch (error) {
    setStatus('Metrics loaded with fallback', 'warning');
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
    sheetRatioList.innerHTML = '<div class="text-[10px] text-on-surface-variant px-1 py-2">No metrics exist yet. Create a metric in the Metrics tab.</div>';
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
      <div class="border border-hairline bg-surface-container px-2 py-1.5 flex items-center justify-between gap-2" data-sheet-ratio="${escapeHtml(name)}">
        <span class="text-[10px] text-on-surface mono truncate min-w-0">${escapeHtml(name)}</span>
        <input class="sheet-row-input w-14 h-5 bg-surface-container-lowest px-1 text-[9px] font-label-md text-label-md text-on-surface placeholder:text-outline-variant outline-none mono text-center shrink-0 ${isDup ? 'border-error text-error' : 'border-hairline focus:border-secondary'}" type="number" min="7" placeholder="N/A" value="${escapeHtml(rowStr)}" data-sheet-ratio-row="${escapeHtml(name)}" title="${escapeHtml(dupTitle)}"/>
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
      button.className = 'scope-button px-2 py-[2px] border border-hairline text-on-surface-variant font-label-md text-label-md';
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
            <div class="catalog-state text-[9px] uppercase mono px-1 py-[1px] border ${isSelected ? 'border-secondary text-secondary' : 'border-hairline text-outline'}">${isSelected ? 'Selected' : 'Add'}</div>
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
          stateLabel.style.borderColor = '#2f3a4d';
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
              <button class="selected-move-btn w-5 h-5 flex items-center justify-center border border-hairline text-outline text-[10px] mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed" data-move="up" data-item="${item.replaceAll('"', '&quot;')}" aria-label="Move ${item} up" ${moveUpDisabled ? 'disabled' : ''}>&uarr;</button>
              <button class="selected-move-btn w-5 h-5 flex items-center justify-center border border-hairline text-outline text-[10px] mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed" data-move="down" data-item="${item.replaceAll('"', '&quot;')}" aria-label="Move ${item} down" ${moveDownDisabled ? 'disabled' : ''}>&darr;</button>
              <button class="selected-remove-btn text-[9px] uppercase mono px-1 py-[1px] border border-hairline text-outline" data-remove="${item.replaceAll('"', '&quot;')}">Remove</button>
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
      button.style.borderColor = '#2f3a4d';
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

function renderFrequency() {
  frequencyButtons.forEach((button) => {
    const isActive = button.dataset.frequency === state.settings.frequency;
    if (isActive) {
      button.className = 'frequency-button px-2 py-[2px] bg-primary/10 text-primary border border-primary font-label-md text-label-md';
    } else {
      button.className = 'frequency-button px-2 py-[2px] border border-hairline text-on-surface-variant font-label-md text-label-md';
    }
  });
}

function setFrequency(frequency) {
  const nextFrequency = frequency === 'quarterly' ? 'quarterly' : 'annual';
  if (state.settings.frequency === nextFrequency) {
    return;
  }
  state.settings.frequency = nextFrequency;
  renderFrequency();
  renderPeriodPicker();
  syncDirtyState();
  void loadAvailablePeriods();
}

function setImportView(viewName) {
  state.importView = viewName === 'periods' ? 'periods' : 'fields';
  const isFields = state.importView === 'fields';

  if (importFieldsView) {
    importFieldsView.classList.toggle('hidden', !isFields);
  }
  if (importPeriodsView) {
    importPeriodsView.classList.toggle('hidden', isFields);
  }

  [importTabFields, importTabPeriods].forEach((btn) => {
    if (!btn) {
      return;
    }
    const active = (btn === importTabFields && isFields) || (btn === importTabPeriods && !isFields);
    if (active) {
      btn.className = 'import-tab-button px-2 py-[2px] bg-primary/10 text-primary border border-primary font-label-md text-label-md';
    } else {
      btn.className = 'import-tab-button px-2 py-[2px] border border-hairline text-on-surface-variant font-label-md text-label-md';
    }
  });

  if (!isFields) {
    renderFrequency();
    renderPeriodPicker();
    void loadAvailablePeriods();
  }
}

function getPickedPeriods(frequency) {
  const periods = state.settings.periods && state.settings.periods[frequency];
  return periods && typeof periods === 'object' ? periods : {};
}

function togglePeriod(ticker, date) {
  const frequency = state.settings.frequency;
  const periods = state.settings.periods || {};
  if (!periods[frequency] || typeof periods[frequency] !== 'object') {
    periods[frequency] = {};
  }
  const picked = Array.isArray(periods[frequency][ticker]) ? periods[frequency][ticker] : [];
  const dateStr = String(date);
  const idx = picked.indexOf(dateStr);
  if (idx >= 0) {
    picked.splice(idx, 1);
  } else {
    picked.push(dateStr);
    picked.sort((a, b) => {
      const ta = Date.parse(a);
      const tb = Date.parse(b);
      if (!isNaN(ta) && !isNaN(tb)) {
        return tb - ta;
      }
      return String(b).localeCompare(String(a));
    });
  }
  periods[frequency][ticker] = picked;
  renderPeriodPicker();
  syncDirtyState();
}

function togglePeriodDropdown(ticker) {
  state.periodExpanded[ticker] = !state.periodExpanded[ticker];
  renderPeriodPicker();
}

function renderPeriodPicker() {
  if (!periodPicker) {
    return;
  }

  const frequency = state.settings.frequency;
  const tickers = state.importList;

  if (!tickers.length) {
    periodPicker.innerHTML = '<div class="p-md text-body-sm text-on-surface-variant">Add tickers in the Search tab to pick periods.</div>';
    return;
  }

  if (state.periodsLoading) {
    periodPicker.innerHTML = '<div class="p-md text-body-sm text-on-surface-variant">Loading available periods…</div>';
    return;
  }

  const pickedMap = getPickedPeriods(frequency);

  periodPicker.innerHTML = tickers.map((ticker) => {
    const available = Array.isArray(state.availablePeriods[ticker]) ? state.availablePeriods[ticker] : [];
    const picked = pickedMap[ticker] || [];
    const isOpen = !!state.periodExpanded[ticker];
    const countLabel = picked.length ? `${picked.length} picked` : 'auto (latest)';

    const dateRows = available.length
      ? available.map((date) => {
          const dateStr = String(date);
          const checked = picked.includes(dateStr);
          return `
            <button class="period-option w-full text-left px-md py-1 flex items-center justify-between gap-md" data-period-ticker="${ticker}" data-period-date="${dateStr}">
              <span class="text-body-sm text-on-surface mono">${dateStr}</span>
              <span class="period-state text-[9px] uppercase mono px-1 py-[1px] border ${checked ? 'border-secondary text-secondary' : 'border-hairline text-outline'}">${checked ? 'Selected' : 'Add'}</span>
            </button>
          `;
        }).join('')
      : '<div class="px-md py-1 text-body-sm text-on-surface-variant">No dates found</div>';

    return `
      <div class="period-ticker border-b border-hairline">
        <button class="period-trigger w-full text-left px-md py-1 flex items-center justify-between gap-md" data-period-trigger="${ticker}">
          <span class="text-[10px] font-bold text-on-surface mono uppercase">${ticker}</span>
          <span class="flex items-center gap-xs shrink-0">
            <span class="text-[9px] text-outline mono uppercase">${countLabel}</span>
            <span class="material-symbols-outlined text-[12px] text-outline transition-transform ${isOpen ? 'rotate-180' : ''}">expand_more</span>
          </span>
        </button>
        <div class="period-dropdown divide-y divide-hairline ${isOpen ? '' : 'hidden'}">
          ${dateRows}
        </div>
      </div>
    `;
  }).join('');

  periodPicker.querySelectorAll('[data-period-trigger]').forEach((button) => {
    button.addEventListener('click', () => togglePeriodDropdown(button.dataset.periodTrigger || ''));
  });

  periodPicker.querySelectorAll('[data-period-ticker]').forEach((button) => {
    const ticker = button.dataset.periodTicker || '';
    const date = button.dataset.periodDate || '';
    const stateLabel = button.querySelector('.period-state');
    const checked = (getPickedPeriods(frequency)[ticker] || []).includes(date);

    const applyDefault = () => {
      if (stateLabel) {
        if (checked) {
          stateLabel.textContent = 'Selected';
          stateLabel.style.borderColor = '#4edea3';
          stateLabel.style.color = '#4edea3';
        } else {
          stateLabel.textContent = 'Add';
          stateLabel.style.borderColor = '#2f3a4d';
          stateLabel.style.color = '#8c909f';
        }
      }
    };
    const applyHover = () => {
      if (stateLabel) {
        if (checked) {
          stateLabel.textContent = 'Remove';
          stateLabel.style.borderColor = '#ffb4ab';
          stateLabel.style.color = '#ffb4ab';
        } else {
          stateLabel.textContent = 'Add';
          stateLabel.style.borderColor = '#4edea3';
          stateLabel.style.color = '#4edea3';
        }
      }
    };

    applyDefault();
    button.addEventListener('mouseenter', applyHover);
    button.addEventListener('mouseleave', applyDefault);
    button.addEventListener('click', () => togglePeriod(ticker, date));
  });
}

async function loadAvailablePeriods() {
  if (!window.finforge || !state.importList.length) {
    state.availablePeriods = {};
    state.periodsLoading = false;
    renderPeriodPicker();
    return;
  }

  state.periodsLoading = true;
  state.periodsError = '';
  if (periodPickerStatus) {
    periodPickerStatus.textContent = 'Loading…';
  }
  renderPeriodPicker();

  try {
    const result = await window.finforge.getStatementPeriods(state.settings.frequency, state.importList);
    if (!result || result.ok !== true) {
      throw new Error(result && result.error ? result.error : 'Unknown period listing error');
    }
    state.availablePeriods = result.data && typeof result.data === 'object' ? result.data : {};
    if (periodPickerStatus) {
      periodPickerStatus.textContent = '';
    }
  } catch (error) {
    state.availablePeriods = {};
    state.periodsError = error.message || String(error);
    if (periodPickerStatus) {
      periodPickerStatus.textContent = 'Failed to load periods';
    }
  }

  state.periodsLoading = false;
  renderPeriodPicker();
}

function renderAll() {
  renderBreadcrumbs();
  renderScopeButtons();
  renderFrequency();
  renderDisplay();
  renderImportListPage();
  renderCompanyPage();
  renderCatalog();
  renderSelected();
  renderPeriodPicker();
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
    await loadFoldersFromDisk();
    await loadRankingPresetsFromDisk();
    // Check data status for all saved tickers
    void refreshAllTickerStatuses();
    // Fetch available statement periods for the advanced period picker
    void loadAvailablePeriods();
    void loadHomeState();
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
    await loadFoldersFromDisk();
    await loadRankingPresetsFromDisk();
    // Check data status for all saved tickers
    void refreshAllTickerStatuses();
    void loadHomeState();
  }
}

async function saveToDisk() {
  try {
    if (!window.finforge) {
      throw new Error('Electron bridge unavailable');
    }

    const nextSettings = {
      mode: state.scope,
      frequency: state.settings.frequency,
      periods: state.settings.periods,
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

frequencyButtons.forEach((button) => {
  button.addEventListener('click', () => setFrequency(button.dataset.frequency || 'annual'));
});

if (periodRefreshButton) {
  periodRefreshButton.addEventListener('click', () => void loadAvailablePeriods());
}

if (importTabFields) {
  importTabFields.addEventListener('click', () => setImportView('fields'));
}
if (importTabPeriods) {
  importTabPeriods.addEventListener('click', () => setImportView('periods'));
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => setActivePage(button.dataset.page || 'home'));
});

if (breadcrumbBar) {
  breadcrumbBar.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-page]');
    if (!button) {
      return;
    }

    setActivePage(button.dataset.page || 'home');
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
if (openWorkbookButton) {
  openWorkbookButton.addEventListener('click', async () => {
    if (!window.finforge || typeof window.finforge.openWorkbook !== 'function') {
      setStatus('Excel launch unavailable', 'error');
      return;
    }

    setStatus('Opening Excel…');
    const result = await window.finforge.openWorkbook();
    if (result && result.ok) {
      setStatus('Excel launched');
    } else {
      setStatus(`Excel launch failed: ${(result && result.error) || 'Unknown error'}`, 'error');
    }
  });
}
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
    if (/^(BS|IS|P|RATIO|METRIC)$/.test(normalizedToken)) {
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
  if (state.ratioMiddleView === 'folder') {
    renderFolders();
  }
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
        throw new Error('Metrics refresh action is unavailable');
      }

      setStatus('Refreshing metrics sheet...', 'warning');
      const result = await window.finforge.refreshRatiosSheet();
      if (!result || result.ok !== true) {
        throw new Error(result && result.error ? result.error : 'Unknown refresh error');
      }

      setStatus('Metrics sheet refreshed', 'success');
    } catch (error) {
      const message = String(error && error.message ? error.message : error);
      if (message.includes('No handler registered for') || message.includes('Error invoking remote method')) {
        setStatus('Metrics refresh unavailable. Close and relaunch FinForge Home.', 'error');
        return;
      }

      setStatus(`Metric refresh failed: ${message}`, 'error');
    }
  });
}
ratioCreateButton.addEventListener('click', () => setRatioForm());

if (ratioNewFolderButton) {
  ratioNewFolderButton.addEventListener('click', () => createNewFolder());
}

if (ratioUncheckAllButton) {
  ratioUncheckAllButton.addEventListener('click', () => {
    state.ratioSelection.clear();
    ratioList.querySelectorAll('[data-ratio-select]').forEach((checkbox) => {
      checkbox.checked = false;
    });
    updateRatioSelectionActions();
  });
}

if (ratioExportTimeseriesButton) {
  ratioExportTimeseriesButton.addEventListener('click', () => {
    if (state.ratioSelection.size === 0) return;
    openExportTickersModal();
  });
}

if (exportTickersSelectAllButton) {
  exportTickersSelectAllButton.addEventListener('click', () => setExportTickersAll(true));
}
if (exportTickersDeselectAllButton) {
  exportTickersDeselectAllButton.addEventListener('click', () => setExportTickersAll(false));
}
if (exportTickersCancelButton) {
  exportTickersCancelButton.addEventListener('click', closeExportTickersModal);
}
if (exportTickersCloseButton) {
  exportTickersCloseButton.addEventListener('click', closeExportTickersModal);
}
if (exportTickersExportButton) {
  exportTickersExportButton.addEventListener('click', submitExportTimeseries);
}

if (folderModalSave) {
  folderModalSave.addEventListener('click', submitFolderModal);
}
if (folderModalCancel) {
  folderModalCancel.addEventListener('click', closeFolderModal);
}
if (folderModalClose) {
  folderModalClose.addEventListener('click', closeFolderModal);
}
if (folderModalInput) {
  folderModalInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitFolderModal();
    } else if (event.key === 'Escape') {
      closeFolderModal();
    }
  });
}

if (folderConfirmDelete) {
  folderConfirmDelete.addEventListener('click', () => confirmDeleteFolder());
}
if (folderConfirmCancel) {
  folderConfirmCancel.addEventListener('click', closeFolderConfirmModal);
}
if (folderConfirmClose) {
  folderConfirmClose.addEventListener('click', closeFolderConfirmModal);
}

ratioTabMetrics.addEventListener('click', () => setRatioMiddleView('metrics'));
ratioTabFolder.addEventListener('click', () => setRatioMiddleView('folder'));
ratioTabAssignments.addEventListener('click', () => {
  setRatioMiddleView('assignments');
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
  resizePlotlyChartsForZoom();
}

// Re-measure all Plotly charts after the font scale (CSS zoom) changes. Chart
// containers cancel the ancestor zoom so Plotly's coordinate math stays correct,
// which changes their layout size; this keeps the rendered chart in sync.
function resizePlotlyChartsForZoom() {
  if (typeof Plotly === 'undefined' || !Plotly.Plots) return;
  var charts = document.querySelectorAll('#viz-plotly-container, [data-ranking-chart]');
  Array.prototype.forEach.call(charts, function (el) {
    if (el && el._fullLayout) {
      try { Plotly.Plots.resize(el); } catch (e) { /* ignore */ }
    }
  });
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
  // Re-render the visualize chart if it's mounted so X-axis dates follow the new format
  if (vizPlotlyContainer && state.vizActiveTickers && state.vizActiveTickers.size > 0 &&
      state.vizMetrics && state.vizMetrics.length > 0) {
    updateVizChart();
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
      lines.push('Metrics: ' + ratioKeys.length);
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
    var borderClass = isSelected ? 'border-secondary' : 'border-hairline';

    return [
      '<div class="px-md py-2 flex items-center justify-between gap-sm hover:bg-surface-container-high/40 transition-colors cursor-pointer ' + borderClass + '" data-template-select="' + escapeHtml(t.id) + '">',
      '  <div class="min-w-0 flex-1">',
      '    <div class="font-label-md text-label-md text-on-surface mono truncate">' + escapeHtml(t.name || t.id) + (isDefault ? ' <span class="text-[9px] text-outline">(default)</span>' : '') + '</div>',
      '    <div class="text-[9px] text-outline mono truncate">' + escapeHtml((t.notes || '').slice(0, 60)) + '</div>',
      '    <div class="text-[8px] text-outline-variant mono">' + formatDateValue(new Date(t.updatedAt).getTime()) + '</div>',
      '  </div>',
      isDefault ? '' : '<button class="px-2 py-[2px] border border-hairline bg-surface-container-high font-label-md text-label-md hover:border-error hover:text-error transition-colors text-[9px]" data-template-delete-list="' + escapeHtml(t.id) + '">Del</button>',
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

  if (!window.confirm('This will replace FinForge.xlsm with a copy of "' + template.excelTemplate + '" and overwrite all current settings (statement lines, tickers, metrics).\n\nAre you sure?')) return;

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
      b.classList.add('border-hairline', 'text-on-surface-variant');
    });
    btn.classList.add('bg-primary/10', 'text-primary', 'border-primary');
    btn.classList.remove('border-hairline', 'text-on-surface-variant');

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
          b.classList.add('border-hairline', 'text-on-surface-variant');
        });
        first.classList.add('bg-primary/10', 'text-primary', 'border-primary');
        first.classList.remove('border-hairline', 'text-on-surface-variant');
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
      b.classList.add('border-hairline', 'text-on-surface-variant');
    });
    btn.classList.add('bg-primary/10', 'text-primary', 'border-primary');
    btn.classList.remove('border-hairline', 'text-on-surface-variant');
    applyDateFormat(fmt);
  });
});

// ── Time format buttons ──
document.querySelectorAll('.settings-time-fmt').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var fmt = btn.dataset.fmt || '24h';
    document.querySelectorAll('.settings-time-fmt').forEach(function (b) {
      b.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
      b.classList.add('border-hairline', 'text-on-surface-variant');
    });
    btn.classList.add('bg-primary/10', 'text-primary', 'border-primary');
    btn.classList.remove('border-hairline', 'text-on-surface-variant');
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
      b.classList.add('border-hairline', 'text-on-surface-variant');
    });
    sepBtn.classList.add('bg-primary/10', 'text-primary', 'border-primary');
    sepBtn.classList.remove('border-hairline', 'text-on-surface-variant');
  }

  // Date format
  var dateBtn = document.querySelector('.settings-date-fmt[data-fmt="' + formatState.dateFmt + '"]');
  if (dateBtn) {
    document.querySelectorAll('.settings-date-fmt').forEach(function (b) {
      b.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
      b.classList.add('border-hairline', 'text-on-surface-variant');
    });
    dateBtn.classList.add('bg-primary/10', 'text-primary', 'border-primary');
    dateBtn.classList.remove('border-hairline', 'text-on-surface-variant');
  }

  // Time format
  var timeBtn = document.querySelector('.settings-time-fmt[data-fmt="' + formatState.timeFmt + '"]');
  if (timeBtn) {
    document.querySelectorAll('.settings-time-fmt').forEach(function (b) {
      b.classList.remove('bg-primary/10', 'text-primary', 'border-primary');
      b.classList.add('border-hairline', 'text-on-surface-variant');
    });
    timeBtn.classList.add('bg-primary/10', 'text-primary', 'border-primary');
    timeBtn.classList.remove('border-hairline', 'text-on-surface-variant');
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

// ── Visualize Tab ──

// ── View Switcher (icon buttons) ──

function setVizWorkspaceView(viewName) {
  if (viewName !== 'metrics' && viewName !== 'tickers') {
    viewName = 'tickers';
  }
  state.vizWorkspaceView = viewName;

  if (vizTickersView) vizTickersView.classList.toggle('hidden', state.vizWorkspaceView !== 'tickers');
  if (vizMetricsView) vizMetricsView.classList.toggle('hidden', state.vizWorkspaceView !== 'metrics');

  document.querySelectorAll('.viz-view-switch[data-viz-view]').forEach(function (btn) {
    var isActive = btn.dataset.vizView === state.vizWorkspaceView;
    btn.classList.toggle('text-primary', isActive);
    btn.classList.toggle('bg-primary/10', isActive);
    btn.classList.toggle('text-on-surface-variant', !isActive);
  });

  if (viewName === 'metrics') {
    renderVizMetricsList();
  } else if (viewName === 'tickers') {
    renderVizTickerList();
  }
}

// ── Graph Settings View ──

// Custom dropdowns for graph settings (button + arrow_drop_down chevron + absolute menu),
// following the app's folder-filter / legend chart-type dropdown pattern. Native <select>
// popups get clipped inside the scrollable #viz-graph-settings-view and show no arrow
// (appearance:none), so we render menus as absolutely-positioned elements instead.

var VIZ_SETTING_OPTIONS = {
  yAxisDecimals: [0, 1, 2, 3, 4, 5, 6].map(function (n) { return { value: String(n), label: String(n) }; }),
  xDateFormat: [
    { value: 'system', label: 'System' },
    { value: 'dd.mm.yyyy', label: 'DD.MM.YYYY' },
    { value: 'mm.dd.yy', label: 'MM.DD.YY' },
    { value: 'mm.dd.yyyy', label: 'MM.DD.YYYY' },
    { value: 'dd.mm.yy', label: 'DD.MM.YY' },
    { value: 'mm.yy', label: 'MM/YY' },
    { value: 'mon yyyy', label: 'Mon YYYY' },
    { value: 'mon', label: 'Mon' },
    { value: 'yyyy', label: 'YYYY' },
    { value: 'dd mon yyyy', label: 'DD Mon YYYY' },
  ],
  xTickMode: [
    { value: 'auto', label: 'Auto' },
    { value: 'year', label: 'Yearly' },
    { value: 'quarter', label: 'Quarterly' },
    { value: 'month', label: 'Monthly' },
    { value: 'week', label: 'Weekly' },
    { value: 'day', label: 'Daily' },
  ],
  xGridDensity: [
    { value: 'match', label: 'Match Labels' },
    { value: 'more', label: 'More' },
    { value: 'dense', label: 'Dense' },
  ],
  xTickAngle: [
    { value: '0', label: '0°' },
    { value: '-45', label: '-45°' },
    { value: '-90', label: '-90°' },
  ],
};

function getVizSettingCurrent(setting) {
  switch (setting) {
    case 'yAxisDecimals': return String(state.vizYAxisDecimals);
    case 'xDateFormat': return state.vizXDateFormat;
    case 'xTickMode': return state.vizXTickMode;
    case 'xTickAngle': return String(state.vizXTickAngle);
    case 'xGridDensity': return state.vizXGridDensity;
  }
  return '';
}

function getVizSettingLabel(setting) {
  var opts = VIZ_SETTING_OPTIONS[setting] || [];
  var current = getVizSettingCurrent(setting);
  for (var i = 0; i < opts.length; i++) {
    if (opts[i].value === current) return opts[i].label;
  }
  return current;
}

function vizSettingDropdownHtml(setting) {
  return '<div class="relative" data-viz-dropdown="' + setting + '">' +
    '<button type="button" data-viz-dropdown-btn="' + setting + '" class="h-6 px-2 bg-surface-container-high border border-hairline font-label-md text-label-md text-on-surface-variant hover:border-primary transition-colors flex items-center gap-1" title="Open options" aria-haspopup="listbox">' +
      '<span data-viz-dropdown-label="' + setting + '">' + escapeHtml(getVizSettingLabel(setting)) + '</span>' +
      '<span class="material-symbols-outlined text-[12px] text-outline">arrow_drop_down</span>' +
    '</button>' +
    '<div data-viz-dropdown-menu="' + setting + '" class="hidden absolute top-full right-0 mt-xs z-30 min-w-28 border border-hairline bg-surface-container-high shadow-xl"></div>' +
  '</div>';
}

function closeVizSettingDropdowns() {
  if (!vizGraphSettingsView) return;
  vizGraphSettingsView.querySelectorAll('[data-viz-dropdown-menu]').forEach(function (menu) {
    menu.classList.add('hidden');
  });
}

function positionVizSettingMenu(wrap, menu) {
  var menuH = menu.offsetHeight;
  var wrapRect = wrap.getBoundingClientRect();
  var containerRect = vizGraphSettingsView.getBoundingClientRect();
  var spaceBelow = containerRect.bottom - wrapRect.bottom;
  var spaceAbove = wrapRect.top - containerRect.top;
  if (spaceBelow >= menuH || spaceBelow >= spaceAbove) {
    menu.style.top = '100%';
    menu.style.bottom = 'auto';
  } else {
    menu.style.top = 'auto';
    menu.style.bottom = '100%';
  }
}

function setupVizSettingDropdown(setting, onSelect) {
  var wrap = vizGraphSettingsView.querySelector('[data-viz-dropdown="' + setting + '"]');
  if (!wrap) return;
  var btn = wrap.querySelector('[data-viz-dropdown-btn="' + setting + '"]');
  var labelEl = wrap.querySelector('[data-viz-dropdown-label="' + setting + '"]');
  var menu = wrap.querySelector('[data-viz-dropdown-menu="' + setting + '"]');
  if (!btn || !menu) return;

  function renderOptions() {
    var current = getVizSettingCurrent(setting);
    menu.innerHTML = (VIZ_SETTING_OPTIONS[setting] || []).map(function (opt) {
      var isActive = opt.value === current;
      return '<button type="button" data-viz-dropdown-opt="' + escapeHtml(opt.value) + '" data-viz-dropdown-opt-label="' + escapeHtml(opt.label) + '" class="w-full text-left px-2 py-1 font-label-md text-label-md text-on-surface hover:bg-primary/10 transition-colors flex items-center justify-between gap-2' + (isActive ? ' text-primary bg-primary/5' : '') + '">' +
        '<span>' + escapeHtml(opt.label) + '</span>' +
        (isActive ? '<span class="material-symbols-outlined text-[12px] text-primary shrink-0">check</span>' : '') +
      '</button>';
    }).join('');
    menu.querySelectorAll('[data-viz-dropdown-opt]').forEach(function (optBtn) {
      optBtn.addEventListener('click', function () {
        closeVizSettingDropdowns();
        if (labelEl) labelEl.textContent = optBtn.dataset.vizDropdownOptLabel || optBtn.dataset.vizDropdownOpt;
        onSelect(optBtn.dataset.vizDropdownOpt);
      });
    });
  }

  btn.addEventListener('click', function (event) {
    event.stopPropagation();
    var wasOpen = !menu.classList.contains('hidden');
    closeVizSettingDropdowns();
    if (!wasOpen) {
      menu.classList.remove('hidden');
      renderOptions();
      positionVizSettingMenu(wrap, menu);
    }
  });
}

document.addEventListener('mousedown', function (event) {
  if (!vizGraphSettingsView) return;
  vizGraphSettingsView.querySelectorAll('[data-viz-dropdown-menu]').forEach(function (menu) {
    if (menu.classList.contains('hidden')) return;
    var wrap = menu.closest('[data-viz-dropdown]');
    if (!wrap || !wrap.contains(event.target)) {
      menu.classList.add('hidden');
    }
  });
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') closeVizSettingDropdowns();
});

function renderVizGraphSettings() {
  if (!vizGraphSettingsView) return;

  var enabled = state.vizAxisStretchEnabled;
  vizGraphSettingsView.innerHTML =
    '<div class="viz-settings-grid">' +

    // ── Chart card ──
    '<div class="viz-settings-card border border-hairline bg-surface-container-low">' +
      '<div class="px-md py-[2px] bg-surface-container-high flex items-center gap-sm">' +
        '<span class="text-[9px] text-outline uppercase mono flex-1">Chart</span>' +
      '</div>' +

      // Show Markers: ON/OFF toggle (applies to line/area traces)
      '<div class="px-md py-[2px] flex items-center justify-between gap-sm hover:bg-surface-container-low transition-colors">' +
        '<span class="text-body-sm text-on-surface mono">Show Markers</span>' +
        '<button class="px-2 py-[2px] bg-surface-container-high border font-label-md text-label-md hover:border-primary transition-colors' + (state.vizShowMarkers ? ' border-primary text-primary' : ' border-hairline') + '" type="button" data-viz-setting="showMarkers">' +
          (state.vizShowMarkers ? 'ON' : 'OFF') +
        '</button>' +
      '</div>' +
    '</div>' +

    // ── Axis Settings card ──
    '<div class="viz-settings-card border border-hairline bg-surface-container-low">' +
      '<div class="px-md py-[2px] bg-surface-container-high flex items-center gap-sm">' +
        '<span class="text-[9px] text-outline uppercase mono flex-1">Axis Settings</span>' +
      '</div>' +

      // Axis Stretch: label + ON/OFF button + info icon
      '<div class="px-md py-[2px] flex items-center justify-between gap-sm hover:bg-surface-container-low transition-colors">' +
        '<div class="flex items-center gap-xs">' +
          '<p class="text-body-sm text-on-surface mono">Axis Stretch</p>' +
          '<button class="viz-info-btn flex items-center justify-center" type="button" data-viz-info="axisStretch" title="How it works" aria-label="How axis stretch works">' +
            '<span class="material-symbols-outlined text-[16px] text-outline-variant hover:text-on-surface transition-colors">info</span>' +
          '</button>' +
        '</div>' +
        '<button class="px-2 py-[2px] bg-surface-container-high border font-label-md text-label-md hover:border-primary transition-colors' + (enabled ? ' border-primary text-primary' : ' border-hairline') + '" type="button" data-viz-setting="axisStretch">' +
          (enabled ? 'ON' : 'OFF') +
        '</button>' +
      '</div>' +

      // Dynamic Y-Axis: label + ON/OFF button + info icon
      '<div class="px-md py-[2px] flex items-center justify-between gap-sm hover:bg-surface-container-low transition-colors">' +
        '<div class="flex items-center gap-xs">' +
          '<p class="text-body-sm text-on-surface mono">Dynamic Y-Axis</p>' +
          '<button class="viz-info-btn flex items-center justify-center" type="button" data-viz-info="dynamicYAxis" title="How it works" aria-label="How dynamic Y-axis works">' +
            '<span class="material-symbols-outlined text-[16px] text-outline-variant hover:text-on-surface transition-colors">info</span>' +
          '</button>' +
        '</div>' +
        '<button class="px-2 py-[2px] bg-surface-container-high border font-label-md text-label-md hover:border-primary transition-colors' + (state.vizDynamicYAxisEnabled ? ' border-primary text-primary' : ' border-hairline') + '" type="button" data-viz-setting="dynamicYAxis">' +
          (state.vizDynamicYAxisEnabled ? 'ON' : 'OFF') +
        '</button>' +
      '</div>' +

      // Y-Axis Decimals
      '<div class="px-md py-[2px] flex items-center justify-between gap-sm hover:bg-surface-container-low transition-colors">' +
        '<span class="text-body-sm text-on-surface mono">Y-Axis Decimals</span>' +
        vizSettingDropdownHtml('yAxisDecimals') +
      '</div>' +
    '</div>' +

    // ── Info panels (full-width grid banners, hidden by default) ──
    '<div id="viz-axis-stretch-info" class="viz-info-panel hidden pl-md pr-md py-xs border-l-2 border-hairline space-y-xs bg-surface-container-low">' +
      '<p class="text-[9px] text-outline uppercase mono">How it works</p>' +
      '<ul class="text-[10px] text-outline space-y-0.5" style="list-style:disc; padding-left:14px;">' +
        '<li>Click &amp; drag <b>up/down</b> on Y-axis labels &rarr; stretch/compress Y scale</li>' +
        '<li>Click &amp; drag <b>left/right</b> on X-axis labels &rarr; stretch/compress X scale</li>' +
        '<li>Drag away from axis center &rarr; zoom in (smaller increments)</li>' +
        '<li>Drag toward axis center &rarr; zoom out (larger increments)</li>' +
      '</ul>' +
    '</div>' +
    '<div id="viz-dynamic-yaxis-info" class="viz-info-panel hidden pl-md pr-md py-xs border-l-2 border-hairline space-y-xs bg-surface-container-low">' +
      '<p class="text-[9px] text-outline uppercase mono">How it works</p>' +
      '<ul class="text-[10px] text-outline space-y-0.5" style="list-style:disc; padding-left:14px;">' +
        '<li>When <b>ON</b>, the Y-axis automatically scales to fit the <b>visible X-range</b></li>' +
        '<li>Pan or zoom horizontally &rarr; Y-axis min/max updates to the data in view</li>' +
        '<li>Inspired by Finviz — gives maximum vertical resolution for the data shown</li>' +
        '<li>When <b>OFF</b>, the Y-axis stays fixed at the last manual or auto range</li>' +
      '</ul>' +
    '</div>' +

    // ── X-Axis card ──
    '<div class="viz-settings-card border border-hairline bg-surface-container-low">' +
      '<div class="px-md py-[2px] bg-surface-container-high flex items-center gap-sm">' +
        '<span class="text-[9px] text-outline uppercase mono flex-1">X-Axis</span>' +
      '</div>' +
      '<div class="px-md py-[2px] flex items-center justify-between gap-sm hover:bg-surface-container-low transition-colors">' +
        '<span class="text-body-sm text-on-surface mono">Date Format</span>' +
        vizSettingDropdownHtml('xDateFormat') +
      '</div>' +
      '<div class="px-md py-[2px] flex items-center justify-between gap-sm hover:bg-surface-container-low transition-colors">' +
        '<span class="text-body-sm text-on-surface mono">Tick Frequency</span>' +
        vizSettingDropdownHtml('xTickMode') +
      '</div>' +
      '<div class="px-md py-[2px] flex items-center justify-between gap-sm hover:bg-surface-container-low transition-colors">' +
        '<span class="text-body-sm text-on-surface mono">Tick Angle</span>' +
        vizSettingDropdownHtml('xTickAngle') +
      '</div>' +
    '</div>' +

    // ── Y-Axis card ──
    '<div class="viz-settings-card border border-hairline bg-surface-container-low">' +
      '<div class="px-md py-[2px] bg-surface-container-high flex items-center gap-sm">' +
        '<span class="text-[9px] text-outline uppercase mono flex-1">Y-Axis</span>' +
      '</div>' +
      '<div class="px-md py-[2px] flex items-center justify-between gap-sm hover:bg-surface-container-low transition-colors">' +
        '<span class="text-body-sm text-on-surface mono">Log Scale</span>' +
        '<button class="px-2 py-[2px] bg-surface-container-high border font-label-md text-label-md hover:border-primary transition-colors' + (state.vizYLogScale ? ' border-primary text-primary' : ' border-hairline') + '" type="button" data-viz-setting="yLogScale">' +
          (state.vizYLogScale ? 'ON' : 'OFF') +
        '</button>' +
      '</div>' +
    '</div>' +

    // ── Lines & Grid card ──
    '<div class="viz-settings-card border border-hairline bg-surface-container-low">' +
      '<div class="px-md py-[2px] bg-surface-container-high flex items-center gap-sm">' +
        '<span class="text-[9px] text-outline uppercase mono flex-1">Lines &amp; Grid</span>' +
      '</div>' +
      '<div class="px-md py-[2px] flex items-center justify-between gap-sm hover:bg-surface-container-low transition-colors">' +
        '<span class="text-body-sm text-on-surface mono">Smooth Lines</span>' +
        '<button class="px-2 py-[2px] bg-surface-container-high border font-label-md text-label-md hover:border-primary transition-colors' + (state.vizSmoothLines ? ' border-primary text-primary' : ' border-hairline') + '" type="button" data-viz-setting="smoothLines">' +
          (state.vizSmoothLines ? 'ON' : 'OFF') +
        '</button>' +
      '</div>' +
      '<div class="px-md py-[2px] flex items-center justify-between gap-sm hover:bg-surface-container-low transition-colors">' +
        '<span class="text-body-sm text-on-surface mono">X Gridlines</span>' +
        '<button class="px-2 py-[2px] bg-surface-container-high border font-label-md text-label-md hover:border-primary transition-colors' + (state.vizGridX ? ' border-primary text-primary' : ' border-hairline') + '" type="button" data-viz-setting="gridX">' +
          (state.vizGridX ? 'ON' : 'OFF') +
        '</button>' +
      '</div>' +
      '<div class="px-md py-[2px] flex items-center justify-between gap-sm hover:bg-surface-container-low transition-colors">' +
        '<span class="text-body-sm text-on-surface mono">X Gridline Density</span>' +
        vizSettingDropdownHtml('xGridDensity') +
      '</div>' +
      '<div class="px-md py-[2px] flex items-center justify-between gap-sm hover:bg-surface-container-low transition-colors">' +
        '<span class="text-body-sm text-on-surface mono">Y Gridlines</span>' +
        '<button class="px-2 py-[2px] bg-surface-container-high border font-label-md text-label-md hover:border-primary transition-colors' + (state.vizGridY ? ' border-primary text-primary' : ' border-hairline') + '" type="button" data-viz-setting="gridY">' +
          (state.vizGridY ? 'ON' : 'OFF') +
        '</button>' +
      '</div>' +
    '</div>' +

    // ── Colors card ──
    '<div class="viz-settings-card border border-hairline bg-surface-container-low">' +
      '<div class="px-md py-[2px] bg-surface-container-high flex items-center gap-sm">' +
        '<span class="text-[9px] text-outline uppercase mono flex-1">Colors</span>' +
      '</div>' +
      '<div class="px-md py-[2px] grid grid-cols-3 gap-sm">' +
        '<div class="flex flex-col items-center gap-1">' +
          '<span class="text-[9px] text-outline uppercase mono">Background</span>' +
          '<input type="color" data-viz-setting="graphBg" value="' + state.vizGraphBg + '" class="h-6 w-12 bg-surface-container border border-hairline px-0.5 cursor-pointer" />' +
        '</div>' +
        '<div class="flex flex-col items-center gap-1">' +
          '<span class="text-[9px] text-outline uppercase mono">Axis</span>' +
          '<input type="color" data-viz-setting="axisColor" value="' + state.vizAxisColor + '" class="h-6 w-12 bg-surface-container border border-hairline px-0.5 cursor-pointer" />' +
        '</div>' +
        '<div class="flex flex-col items-center gap-1">' +
          '<span class="text-[9px] text-outline uppercase mono">Grid</span>' +
          '<input type="color" data-viz-setting="gridColor" value="' + state.vizGridColor + '" class="h-6 w-12 bg-surface-container border border-hairline px-0.5 cursor-pointer" />' +
        '</div>' +
      '</div>' +
    '</div>' +

    '</div>';

  // ON/OFF button handler
  var onoffBtn = vizGraphSettingsView.querySelector('[data-viz-setting="axisStretch"]');
  if (onoffBtn) {
    onoffBtn.addEventListener('click', function () {
      state.vizAxisStretchEnabled = !state.vizAxisStretchEnabled;
      renderVizGraphSettings();
      attachVizAxisStretchListeners();
      // Re-show info panel if it was open
      var infoPanel = vizGraphSettingsView.querySelector('#viz-axis-stretch-info');
      if (infoPanel && _vizInfoPanelOpen) {
        infoPanel.classList.remove('hidden');
      }
    });
  }

  // Info icon handler (axisStretch)
  var infoBtn = vizGraphSettingsView.querySelector('[data-viz-info="axisStretch"]');
  if (infoBtn) {
    infoBtn.addEventListener('click', function () {
      var infoPanel = vizGraphSettingsView.querySelector('#viz-axis-stretch-info');
      if (!infoPanel) return;
      infoPanel.classList.toggle('hidden');
      _vizInfoPanelOpen = !infoPanel.classList.contains('hidden');
    });
  }

  // Dynamic Y-Axis ON/OFF button handler
  var dynYBtn = vizGraphSettingsView.querySelector('[data-viz-setting="dynamicYAxis"]');
  if (dynYBtn) {
    dynYBtn.addEventListener('click', function () {
      state.vizDynamicYAxisEnabled = !state.vizDynamicYAxisEnabled;
      renderVizGraphSettings();
      // If turning ON, immediately rescale Y-axis to current visible X-range
      if (state.vizDynamicYAxisEnabled) {
        applyDynamicYAxis();
      }
      // Re-show info panel if it was open
      var dynInfoPanel = vizGraphSettingsView.querySelector('#viz-dynamic-yaxis-info');
      if (dynInfoPanel && _vizDynYInfoPanelOpen) {
        dynInfoPanel.classList.remove('hidden');
      }
    });
  }

  // Dynamic Y-Axis info icon handler
  var dynYInfoBtn = vizGraphSettingsView.querySelector('[data-viz-info="dynamicYAxis"]');
  if (dynYInfoBtn) {
    dynYInfoBtn.addEventListener('click', function () {
      var dynInfoPanel = vizGraphSettingsView.querySelector('#viz-dynamic-yaxis-info');
      if (!dynInfoPanel) return;
      dynInfoPanel.classList.toggle('hidden');
      _vizDynYInfoPanelOpen = !dynInfoPanel.classList.contains('hidden');
    });
  }

  // Show Markers
  var smBtn = vizGraphSettingsView.querySelector('[data-viz-setting="showMarkers"]');
  if (smBtn) {
    smBtn.addEventListener('click', function () {
      state.vizShowMarkers = !state.vizShowMarkers;
      renderVizGraphSettings();
      updateVizChart();
    });
  }

  // Y-Axis Decimals
  setupVizSettingDropdown('yAxisDecimals', function (raw) {
    var n = parseInt(raw, 10);
    if (isNaN(n) || n < 0) return;
    state.vizYAxisDecimals = n;
    if (vizPlotlyContainer && typeof Plotly !== 'undefined') {
      try {
        var gd = vizPlotlyContainer._fullLayout || vizPlotlyContainer.layout || {};
        var yRange = gd.yaxis ? gd.yaxis.range : null;
        var yMaxAbs = 0;
        if (yRange && yRange.length === 2) {
          yMaxAbs = Math.max(Math.abs(yRange[0]), Math.abs(yRange[1]));
        }
        var yIntDigits = (yMaxAbs >= 1 && yMaxAbs > 0) ? Math.floor(Math.log10(yMaxAbs)) + 1 : 1;
        var yLabelChars = yIntDigits + 1 + n; // intDigits + decimalPoint + decimals
        var yLabelPx = yLabelChars * 6.5;
        var leftMargin = Math.max(30, Math.round(yLabelPx + 10));
        Plotly.relayout(vizPlotlyContainer, {
          'yaxis.tickformat': '.' + n + 'f',
          'margin.l': leftMargin
        });
      } catch (_) {}
    }
  });

  // X-Axis Date Format
  setupVizSettingDropdown('xDateFormat', function (value) {
    state.vizXDateFormat = value;
    saveVizGraphSettings();
    applyVizGraphSettingLive();
  });

  // X-Axis Tick Frequency
  setupVizSettingDropdown('xTickMode', function (value) {
    state.vizXTickMode = value;
    saveVizGraphSettings();
    applyVizGraphSettingLive();
  });

  // X Gridline Density (extra vertical gridlines between date labels)
  setupVizSettingDropdown('xGridDensity', function (value) {
    state.vizXGridDensity = value;
    saveVizGraphSettings();
    applyVizGraphSettingLive();
  });

  // X-Axis Tick Angle
  setupVizSettingDropdown('xTickAngle', function (value) {
    state.vizXTickAngle = parseInt(value, 10) || 0;
    saveVizGraphSettings();
    applyVizGraphSettingLive();
  });

  // Y-Axis Log Scale (structural change → full re-render)
  var logBtn = vizGraphSettingsView.querySelector('[data-viz-setting="yLogScale"]');
  if (logBtn) {
    logBtn.addEventListener('click', function () {
      state.vizYLogScale = !state.vizYLogScale;
      saveVizGraphSettings();
      renderVizGraphSettings();
      updateVizChart();
    });
  }

  // Smooth Lines (structural change → full re-render)
  var smoothBtn = vizGraphSettingsView.querySelector('[data-viz-setting="smoothLines"]');
  if (smoothBtn) {
    smoothBtn.addEventListener('click', function () {
      state.vizSmoothLines = !state.vizSmoothLines;
      saveVizGraphSettings();
      renderVizGraphSettings();
      updateVizChart();
    });
  }

  // X Gridlines (non-structural → live relayout)
  var gridXBtn = vizGraphSettingsView.querySelector('[data-viz-setting="gridX"]');
  if (gridXBtn) {
    gridXBtn.addEventListener('click', function () {
      state.vizGridX = !state.vizGridX;
      saveVizGraphSettings();
      renderVizGraphSettings();
      applyVizGraphSettingLive();
    });
  }

  // Y Gridlines (non-structural → live relayout)
  var gridYBtn = vizGraphSettingsView.querySelector('[data-viz-setting="gridY"]');
  if (gridYBtn) {
    gridYBtn.addEventListener('click', function () {
      state.vizGridY = !state.vizGridY;
      saveVizGraphSettings();
      renderVizGraphSettings();
      applyVizGraphSettingLive();
    });
  }

  // Color pickers (non-structural → live relayout)
  var bgInput = vizGraphSettingsView.querySelector('[data-viz-setting="graphBg"]');
  if (bgInput) {
    bgInput.addEventListener('input', function () {
      state.vizGraphBg = bgInput.value;
      saveVizGraphSettings();
      applyVizGraphSettingLive();
    });
  }
  var axisInput = vizGraphSettingsView.querySelector('[data-viz-setting="axisColor"]');
  if (axisInput) {
    axisInput.addEventListener('input', function () {
      state.vizAxisColor = axisInput.value;
      saveVizGraphSettings();
      applyVizGraphSettingLive();
    });
  }
  var gridInput = vizGraphSettingsView.querySelector('[data-viz-setting="gridColor"]');
  if (gridInput) {
    gridInput.addEventListener('input', function () {
      state.vizGridColor = gridInput.value;
      saveVizGraphSettings();
      applyVizGraphSettingLive();
    });
  }

  // Preserve info panel state across re-renders (dynamic Y-axis)
  if (_vizDynYInfoPanelOpen) {
    var dynInfoPanel = vizGraphSettingsView.querySelector('#viz-dynamic-yaxis-info');
    if (dynInfoPanel) dynInfoPanel.classList.remove('hidden');
  }

  // Preserve info panel state across re-renders
  if (_vizInfoPanelOpen) {
    var infoPanel = vizGraphSettingsView.querySelector('#viz-axis-stretch-info');
    if (infoPanel) infoPanel.classList.remove('hidden');
  }
}

// ── Axis Stretch Interaction (Finviz-style axis drag-to-scale) ──

var _vizAxisStretchBound = false;
var _vizInfoPanelOpen = false;
var _vizDynYInfoPanelOpen = false;

function attachVizAxisStretchListeners() {
  var container = vizPlotlyContainer;
  if (!container) {
    console.log('[AxisStretch] attachVizAxisStretchListeners called but vizPlotlyContainer is null');
    return;
  }
  console.log('[AxisStretch] attachVizAxisStretchListeners called — enabled:', state.vizAxisStretchEnabled);

  // Remove previous listeners. NOTE: mousedown was added with capture:true,
  // so removal must also specify capture:true.  We also null the stored refs
  // so a stale closure doesn't block re-attach.
  if (container._vizAxisMouseDown) {
    container.removeEventListener('mousedown', container._vizAxisMouseDown, true);
    container._vizAxisMouseDown = null;
  }
  if (container._vizAxisMouseMove) {
    window.removeEventListener('mousemove', container._vizAxisMouseMove);
    container._vizAxisMouseMove = null;
  }
  if (container._vizAxisMouseUp) {
    window.removeEventListener('mouseup', container._vizAxisMouseUp);
    container._vizAxisMouseUp = null;
  }

  if (!state.vizAxisStretchEnabled) {
    console.log('[AxisStretch] axis stretch disabled — listeners not attached');
    container.style.cursor = '';
    return;
  }

  var activeAxis = null;
  var anchor = null;
  // Throttling state: relayout is expensive, so we coalesce updates to at most
  // one per animation frame instead of firing on every mousemove event.
  var rafScheduled = false;
  var pendingLayoutUpdate = null;

  function getAxisFromEvent(e) {
    // Detect the axis purely from the DOM element clicked. This is immune to
    // any coordinate misalignment between the cursor and the chart.
    var target = e.target;
    if (target && target.closest) {
      // 1) Actual axis tick labels (Plotly renders them in .ytick/.xtick groups
      //    inside the yaxislayer/xaxislayer).
      if (target.closest('.ytick') || target.closest('.yaxislayer-above') || target.closest('.yaxislayer-below')) return 'y';
      if (target.closest('.xtick') || target.closest('.xaxislayer-above') || target.closest('.xaxislayer-below')) return 'x';

      // 2) Plotly's own drag-layer affordance rects:
      //    .nsdrag  = north-south (vertical) drag zone  -> Y axis stretch
      //    .ewdrag  = east-west (horizontal) drag zone  -> X axis stretch
      //    These are exactly the "grab near the axis" strips the user clicks.
      if (target.closest('.nsdrag')) return 'y';
      if (target.closest('.ewdrag')) return 'x';
    }
    return null;
  }

  function getCurrentRange(axis) {
    // Try multiple ways to get the Plotly graph div reference
    var plotEl = container.querySelector('.js-plotly-plot');
    var gd = null;

    // Method 1: Plotly stores _fullLayout directly on the DOM element passed to react/newPlot
    if (container._fullLayout) {
      gd = container;
    }
    // Method 2: the inner .js-plotly-plot div might have it
    else if (plotEl && plotEl._fullLayout) {
      gd = plotEl;
    }
    // Method 3: Plotly's internal registry (gd is keyed by DOM element id or reference)
    if (!gd && typeof Plotly !== 'undefined') {
      try {
        // Plotly stores gd references keyed by the container's _plotlyId or similar
        var allGDs = Object.values(Plotly.Plots || {}).filter(Boolean);
        // Fallback: try the container directly as Plotly graph div
        if (container._plotlyId !== undefined || container._fullData !== undefined) {
          gd = container;
        }
      } catch (_) { /* ignore */ }
    }

    if (!gd || !gd._fullLayout) {
      console.log('[AxisStretch] getCurrentRange FAILED — no _fullLayout found on container or plotEl');
      return null;
    }

    var fullLayout = gd._fullLayout;
    var axKey = (axis === 'y') ? 'yaxis' : 'xaxis';
    var ax = fullLayout[axKey];

    if (!ax || !ax.range) {
      console.log('[AxisStretch] getCurrentRange FAILED — axis "' + axKey + '" not found or missing .range. Available keys:', Object.keys(fullLayout).filter(function(k) { return k.indexOf('axis') >= 0; }));
      return null;
    }

    var r0 = ax.range[0], r1 = ax.range[1];

    // For date axes (X-axis), convert date strings to numeric timestamps
    if (axis === 'x' && ax.type === 'date') {
      var t0 = (r0 instanceof Date) ? r0.getTime() : new Date(r0).getTime();
      var t1 = (r1 instanceof Date) ? r1.getTime() : new Date(r1).getTime();
      if (isNaN(t0) || isNaN(t1)) {
        console.log('[AxisStretch] getCurrentRange FAILED — invalid date range:', r0, r1);
        return null;
      }
      return { numeric: [t0, t1], original: [r0, r1], isDate: true };
    }
    // Numeric axis (Y-axis) — ensure values are numbers
    var n0 = Number(r0), n1 = Number(r1);
    if (isNaN(n0) || isNaN(n1)) {
      console.log('[AxisStretch] getCurrentRange FAILED — non-numeric Y range:', r0, r1);
      return null;
    }
    return { numeric: [n0, n1], isDate: false };
  }

  container._vizAxisMouseDown = function (e) {
    if (!state.vizAxisStretchEnabled) return;
    // Diagnostic: report click position in SVG coords + the detected plot geometry
    var svgDiag = container.querySelector('.main-svg');
    var rectDiag = svgDiag ? svgDiag.getBoundingClientRect() : container.getBoundingClientRect();
    var diagX = Math.round(e.clientX - rectDiag.left);
    var diagY = Math.round(e.clientY - rectDiag.top);
    var axis = getAxisFromEvent(e);
    var geoDiag = '';
    var gdDiag = container._fullLayout ? container : (container.querySelector('.js-plotly-plot') || {})._fullLayout ? container.querySelector('.js-plotly-plot') : null;
    if (gdDiag && gdDiag._fullLayout && gdDiag._fullLayout.xaxis) {
      geoDiag = ' | plot area x:' + Math.round(gdDiag._fullLayout.yaxis._offset) + '-' +
        Math.round(gdDiag._fullLayout.yaxis._offset + gdDiag._fullLayout.xaxis._length) +
        ' y:' + Math.round(gdDiag._fullLayout.xaxis._offset) + '-' +
        Math.round(gdDiag._fullLayout.xaxis._offset + gdDiag._fullLayout.yaxis._length);
    }
    console.log('[AxisStretch] mousedown at relX=' + diagX + ' relY=' + diagY +
      ' (svg ' + Math.round(rectDiag.width) + 'x' + Math.round(rectDiag.height) + ')' +
      geoDiag + ' → detected axis: ' + axis +
      ' | target: ' + (e.target ? (e.target.tagName + '.' + ((e.target.getAttribute && e.target.getAttribute('class')) || '')) : 'none'));
    if (!axis) return;

    // Don't interfere with Plotly's own drag handlers on the plot area
    e.preventDefault();
    e.stopPropagation();
    activeAxis = axis;

    var rangeInfo = getCurrentRange(axis);
    if (!rangeInfo) {
      console.log('[AxisStretch] mousedown on', axis, 'axis but getCurrentRange returned null — aborting');
      activeAxis = null;
      return;
    }

    console.log('[AxisStretch] mousedown on', axis, 'axis — range:', rangeInfo.numeric, 'isDate:', rangeInfo.isDate);

    anchor = {
      clientX: e.clientX,
      clientY: e.clientY,
      rangeInfo: rangeInfo,
    };
    container.style.cursor = axis === 'y' ? 'ns-resize' : 'ew-resize';
    // Also set cursor on the Plotly SVG to ensure it overrides
    var svg = container.querySelector('.main-svg');
    if (svg) svg.style.cursor = axis === 'y' ? 'ns-resize' : 'ew-resize';
  };

  container._vizAxisMouseMove = function (e) {
    if (!activeAxis || !anchor) {
      // Update cursor hint when hovering axis area (not dragging)
      if (state.vizAxisStretchEnabled && !activeAxis) {
        var hintAxis = getAxisFromEvent(e);
        var newCursor = hintAxis === 'y' ? 'ns-resize'
          : hintAxis === 'x' ? 'ew-resize' : '';
        container.style.cursor = newCursor;
        var svgHint = container.querySelector('.main-svg');
        if (svgHint) svgHint.style.cursor = newCursor;
      }
      return;
    }

    var ri = anchor.rangeInfo;
    var range = ri.numeric;
    var rangeSpan = range[1] - range[0];
    if (rangeSpan === 0) rangeSpan = 1;

    // Compute the target range from the drag delta (relative to the anchor).
    if (activeAxis === 'y') {
      // Drag up → zoom in (smaller range), drag down → zoom out
      var dy = (anchor.clientY - e.clientY) / 150;
      var scaleFactor = Math.exp(dy * 0.6);
      var mid = (range[0] + range[1]) / 2;
      var newHalfSpan = (rangeSpan / 2) * scaleFactor;
      pendingLayoutUpdate = {
        'yaxis.range': [mid - newHalfSpan, mid + newHalfSpan],
        'yaxis.autorange': false
      };
    } else {
      // Drag right → zoom in, drag left → zoom out
      var dx = (e.clientX - anchor.clientX) / 150;
      var xScaleFactor = Math.exp(dx * 0.6);
      var xMid = (range[0] + range[1]) / 2;
      var xNewHalfSpan = (rangeSpan / 2) * xScaleFactor;
      var newLow = xMid - xNewHalfSpan;
      var newHigh = xMid + xNewHalfSpan;
      // Convert numeric timestamps back to date strings for Plotly
      if (ri.isDate) {
        newLow = new Date(newLow).toISOString();
        newHigh = new Date(newHigh).toISOString();
      }
      pendingLayoutUpdate = {
        'xaxis.range': [newLow, newHigh],
        'xaxis.autorange': false
      };
    }

    // Coalesce: issue at most one relayout per animation frame.
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(function () {
        rafScheduled = false;
        var upd = pendingLayoutUpdate;
        pendingLayoutUpdate = null;
        if (upd) {
          try {
            Plotly.relayout(container, upd);
          } catch (relayoutErr) {
            console.log('[AxisStretch] Plotly.relayout error:', relayoutErr);
          }
        }
      });
    }
  };

  container._vizAxisMouseUp = function () {
    if (activeAxis) {
      console.log('[AxisStretch] mouseup — ending', activeAxis, 'axis stretch');
      activeAxis = null;
      anchor = null;
      // Apply any final pending update so the last drag position isn't lost.
      if (pendingLayoutUpdate) {
        try {
          Plotly.relayout(container, pendingLayoutUpdate);
        } catch (relayoutErr) {
          console.log('[AxisStretch] Plotly.relayout error on mouseup:', relayoutErr);
        }
        pendingLayoutUpdate = null;
      }
      rafScheduled = false;
      container.style.cursor = '';
      var svgUp = container.querySelector('.main-svg');
      if (svgUp) svgUp.style.cursor = '';
    }
  };

  container.addEventListener('mousedown', container._vizAxisMouseDown, true);
  window.addEventListener('mousemove', container._vizAxisMouseMove);
  window.addEventListener('mouseup', container._vizAxisMouseUp);

  // Log the container size and Plotly state once so we can verify the detection
  try {
    var rc = container.getBoundingClientRect();
    var hasFullLayout = Boolean(container._fullLayout) || Boolean(container.querySelector('.js-plotly-plot'));
    console.log('[AxisStretch] listeners attached. Container rect:', rc.width + 'x' + rc.height,
      '| detection: element-based (.ytick/.xtick/.nsdrag/.ewdrag) | plotly present:', hasFullLayout);
  } catch (_) { /* ignore */ }
}

// ── Dynamic Y-Axis (Finviz-style: auto-scale Y to visible X-range) ──

var _vizDynamicYAxisRelayoutBound = false;

function applyDynamicYAxis() {
  if (!state.vizDynamicYAxisEnabled) return;
  if (state.vizYLogScale) return; // log scale uses Plotly autorange; a manual linear range would be invalid
  var container = vizPlotlyContainer;
  if (!container) return;

  var gd = container._fullLayout ? container
    : (container.querySelector('.js-plotly-plot') || {});

  if (!gd._fullLayout) return;

  var xaxis = gd._fullLayout.xaxis;
  var yaxis = gd._fullLayout.yaxis;

  if (!xaxis || !xaxis.range || !yaxis) return;

  var xRange = xaxis.range;
  var xLow, xHigh;

  // X-axis is date-based — convert to numeric timestamps for comparison
  if (xaxis.type === 'date') {
    xLow = new Date(xRange[0]).getTime();
    xHigh = new Date(xRange[1]).getTime();
  } else {
    xLow = Number(xRange[0]);
    xHigh = Number(xRange[1]);
  }

  if (isNaN(xLow) || isNaN(xHigh)) return;

  // Collect all visible y-values within the current X-range
  var allY = [];
  var traces = gd._fullData || gd.data || [];

  for (var i = 0; i < traces.length; i++) {
    var trace = traces[i];
    // Skip hidden/legend-only traces
    if (trace.visible === false || trace.visible === 'legendonly') continue;
    if (!trace.x || !trace.y) continue;

    var tx = trace.x;
    var ty = trace.y;
    for (var j = 0; j < tx.length; j++) {
      var xVal;
      if (typeof tx[j] === 'string') {
        xVal = new Date(tx[j]).getTime();
      } else {
        xVal = Number(tx[j]);
      }
      if (isNaN(xVal)) continue;
      if (xVal >= xLow && xVal <= xHigh) {
        var yVal = Number(ty[j]);
        if (!isNaN(yVal) && yVal !== null && yVal !== undefined) {
          allY.push(yVal);
        }
      }
    }
  }

  if (allY.length === 0) return;

  var yMin = allY[0];
  var yMax = allY[0];
  for (var k = 1; k < allY.length; k++) {
    if (allY[k] < yMin) yMin = allY[k];
    if (allY[k] > yMax) yMax = allY[k];
  }

  // Add 5% padding so data doesn't touch the edges
  var ySpan = yMax - yMin;
  if (ySpan === 0) ySpan = Math.abs(yMax) * 0.1 || 1;

  var padding = ySpan * 0.05;
  var newLow = yMin - padding;
  var newHigh = yMax + padding;

  // Guard against re-entrant loops: only update if range actually changed meaningfully
  var currentRange = yaxis.range;
  if (currentRange && currentRange.length === 2) {
    var eps = Math.abs(currentRange[1] - currentRange[0]) * 0.001;
    if (Math.abs(currentRange[0] - newLow) < eps && Math.abs(currentRange[1] - newHigh) < eps) {
      return; // No meaningful change — skip relayout
    }
  }

  state.vizDynamicYAxisPending = true;
  try {
    Plotly.relayout(container, {
      'yaxis.range': [newLow, newHigh],
      'yaxis.autorange': false,
    });
  } catch (e) {
    console.log('[DynamicYAxis] Plotly.relayout error:', e);
  }
  // Reset the guard after a short delay so the relayout event doesn't trigger a loop
  setTimeout(function () {
    state.vizDynamicYAxisPending = false;
  }, 100);
}

function attachVizDynamicYAxisRelayoutListener() {
  if (_vizDynamicYAxisRelayoutBound) return;
  if (!vizPlotlyContainer) return;

  _vizDynamicYAxisRelayoutBound = true;

  vizPlotlyContainer.on('plotly_relayout', function (eventData) {
    if (!state.vizDynamicYAxisEnabled) return;
    if (state.vizDynamicYAxisPending) return;

    // Only respond to xaxis.range changes (pan/zoom along X)
    if (!eventData) return;
    var hasXChange = false;
    for (var key in eventData) {
      if (eventData.hasOwnProperty(key) && key.indexOf('xaxis.range') !== -1) {
        hasXChange = true;
        break;
      }
    }
    if (!hasXChange) return;

    // Debounce: wait for pan/zoom to settle before recalculating
    clearTimeout(_vizDynamicYAxisDebounce);
    _vizDynamicYAxisDebounce = setTimeout(function () {
      applyDynamicYAxis();
    }, 80);
  });

  // Also handle plotly_afterplot to rebind after new chart renders
  vizPlotlyContainer.on('plotly_afterplot', function () {
    // Apply dynamic Y-axis on initial render if enabled
    if (state.vizDynamicYAxisEnabled) {
      applyDynamicYAxis();
    }
  });
}

var _vizDynamicYAxisDebounce = null;

// ── Adaptive X-Axis Ticks (auto label granularity: year -> month -> day while zooming) ──

var _vizAdaptiveXTickRelayoutBound = false;
var _vizAdaptiveXTickDebounce = null;

function applyVizAdaptiveXTicks() {
  if (!vizPlotlyContainer || typeof Plotly === 'undefined') return;
  if (!vizPlotlyContainer._fullLayout) return;

  var extras = buildVizGraphLayoutExtras(collectVizChartDates());
  var relayout = {};
  if (extras.xaxis.tickmode === 'array') {
    relayout['xaxis.tickmode'] = 'array';
    relayout['xaxis.tickvals'] = extras.xaxis.tickvals;
    relayout['xaxis.ticktext'] = extras.xaxis.ticktext;
  } else {
    relayout['xaxis.tickmode'] = 'auto';
    relayout['xaxis.tickformat'] = extras.xaxis.tickformat;
  }

  state.vizAdaptiveXTickPending = true;
  try {
    Plotly.relayout(vizPlotlyContainer, relayout);
  } catch (e) {
    console.log('[AdaptiveXTicks] Plotly.relayout error:', e);
  }
  setTimeout(function () {
    state.vizAdaptiveXTickPending = false;
  }, 100);
}

function attachVizAdaptiveXTickRelayoutListener() {
  if (_vizAdaptiveXTickRelayoutBound) return;
  if (!vizPlotlyContainer) return;

  _vizAdaptiveXTickRelayoutBound = true;

  vizPlotlyContainer.on('plotly_relayout', function (eventData) {
    if (state.vizXTickMode !== 'auto') return;
    if (state.vizAdaptiveXTickPending) return;
    if (!eventData) return;

    var hasXChange = false;
    for (var key in eventData) {
      if (eventData.hasOwnProperty(key) && key.indexOf('xaxis.range') !== -1) {
        hasXChange = true;
        break;
      }
    }
    if (!hasXChange) return;

    clearTimeout(_vizAdaptiveXTickDebounce);
    _vizAdaptiveXTickDebounce = setTimeout(function () {
      applyVizAdaptiveXTicks();
    }, 120);
  });
}

// ── Ticker List (import list, toggles with state labels like Statement Lines) ──

// ── Side Container Actions: Show Selected / Remove All ──

function syncVizShowSelectedButtons() {
  var pairs = [
    { btn: vizTickersShowSelected, active: !!state.vizShowSelected.tickers },
    { btn: vizMetricsShowSelected, active: !!state.vizShowSelected.metrics }
  ];
  pairs.forEach(function (pair) {
    var btn = pair.btn;
    if (!btn) return;
    var active = pair.active;
    btn.classList.toggle('bg-primary/10', active);
    btn.classList.toggle('border-primary', active);
    btn.classList.toggle('text-primary', active);
    btn.classList.toggle('bg-surface-container-high', !active);
    btn.classList.toggle('border-hairline', !active);
    btn.classList.toggle('text-on-surface-variant', !active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    btn.title = active ? 'Show all items' : 'Show only selected items';
  });
}

function toggleVizShowSelected(kind) {
  if (kind !== 'tickers' && kind !== 'metrics') return;
  state.vizShowSelected[kind] = !state.vizShowSelected[kind];
  if (kind === 'tickers') {
    renderVizTickerList();
  } else {
    renderVizMetricsList();
  }
  syncVizShowSelectedButtons();
}

function removeAllViz(kind) {
  if (kind === 'tickers') {
    if (state.vizActiveTickers.size === 0) return;
    state.vizActiveTickers.clear();
    state.vizTickerStyles = {};
    renderVizTickerList();
  } else if (kind === 'metrics') {
    if (state.vizMetrics.length === 0) return;
    state.vizMetrics = [];
    state.vizMetricStyles = {};
    state.vizDataCache = {};
    renderVizMetricsList();
  } else {
    return;
  }
  renderVizLegend();
  updateVizChart();
}

// ── Tickers List (imported tickers, searchable, toggles with state labels) ──

function renderVizTickerList() {
  if (!vizTickersList) return;
  syncVizShowSelectedButtons();

  var tickers = state.importList.slice();
  var searchTerm = state.vizTickerSearch.trim().toLowerCase();

  if (!tickers.length) {
    vizTickersList.innerHTML = '<div class="px-md py-3 text-[10px] text-outline mono uppercase">No tickers imported yet. Go to Search tab to import tickers.</div>';
    return;
  }

  var filtered = searchTerm
    ? tickers.filter(function (t) { return String(t).toLowerCase().indexOf(searchTerm) !== -1; })
    : tickers;

  // "Show selected" filter: only keep tickers currently added to the chart
  if (state.vizShowSelected.tickers) {
    filtered = filtered.filter(function (t) { return state.vizActiveTickers.has(t); });
  }

  if (!filtered.length) {
    var emptyMsg = state.vizShowSelected.tickers
      ? (searchTerm
          ? 'No selected tickers match "' + escapeHtml(state.vizTickerSearch.trim()) + '".'
          : 'No selected tickers yet.')
      : 'No tickers match "' + escapeHtml(state.vizTickerSearch.trim()) + '".';
    vizTickersList.innerHTML = '<div class="px-md py-3 text-[10px] text-outline mono uppercase">' + emptyMsg + '</div>';
    return;
  }

  vizTickersList.innerHTML = filtered.map(function (ticker) {
    var isActive = state.vizActiveTickers.has(ticker);
    var cls = 'w-full text-left px-md py-1 transition-colors flex items-center justify-between gap-md viz-item-row';
    if (isActive) cls += ' selected';
    return '<div class="' + cls + '" data-viz-ticker="' + escapeHtml(ticker) + '">' +
      '<div class="min-w-0">' +
        '<div class="text-body-sm text-on-surface mono truncate">' + escapeHtml(ticker) + '</div>' +
      '</div>' +
      '<span class="row-state-icon material-symbols-outlined text-[16px] shrink-0" style="color:' + (isActive ? '#4edea3' : '#8a90a0') + ';">' + (isActive ? 'check' : 'add') + '</span>' +
    '</div>';
  }).join('');

  // Attach icon hover behavior matching the ranking rows
  vizTickersList.querySelectorAll('[data-viz-ticker]').forEach(function (row) {
    attachRowIconHover(row, state.vizActiveTickers.has(row.dataset.vizTicker));
    attachRowHoverHighlight(row);
  });
}

// ── Metrics List (all metrics from ratio_config.json, folder-grouped + searchable) ──

function renderVizMetricsList() {
  if (!vizMetricsList) return;
  syncVizShowSelectedButtons();

  var metrics = state.ratios; // { name: { formula, notes, folder } }

  var names = Object.keys(metrics);
  if (!names.length) {
    vizMetricsList.innerHTML = '<div class="px-md py-3 text-[10px] text-outline mono uppercase">No metrics defined. Create one in the Metrics tab.</div>';
    return;
  }

  var searchTerm = state.vizMetricSearch.trim().toLowerCase();
  var searching = searchTerm.length > 0;
  var matchesSearch = function (name) {
    if (!searchTerm) return true;
    return String(name).toLowerCase().indexOf(searchTerm) !== -1;
  };

  // Build set of active metric names for quick lookup
  var activeNames = new Set();
  state.vizMetrics.forEach(function (m) { activeNames.add(m.name); });

  // "Show selected" filter: only keep metrics currently added to the chart
  var showOnlySelected = state.vizShowSelected.metrics;
  var isVisible = function (name) {
    return matchesSearch(name) && (!showOnlySelected || activeNames.has(name));
  };

  // Auto-expand folder groups while searching OR while "Show selected" is on
  // (so users can see which metrics are selected without expanding each folder)
  var autoExpand = searching || showOnlySelected;

  var metricRow = function (name) {
    var isActive = activeNames.has(name);
    var cls = 'w-full text-left px-md py-1 transition-colors flex items-center justify-between gap-md viz-item-row';
    if (isActive) cls += ' selected';
    return '<div class="' + cls + '" data-viz-metric="' + escapeHtml(name) + '">' +
      '<div class="min-w-0">' +
        '<div class="text-body-sm text-on-surface mono truncate">' + escapeHtml(name) + '</div>' +
      '</div>' +
      '<span class="row-state-icon material-symbols-outlined text-[16px] shrink-0" style="color:' + (isActive ? '#4edea3' : '#8a90a0') + ';">' + (isActive ? 'check' : 'add') + '</span>' +
    '</div>';
  };

  var folderGroup = function (folderKey, folderLabel, rowsHtml, count) {
    return '<div class="folder-group border border-hairline bg-surface-container">' +
      '<div class="folder-header px-md py-1 bg-surface-container-high flex items-center justify-between cursor-pointer select-none" data-folder-toggle="' + escapeHtml(folderKey) + '">' +
        '<div class="flex items-center gap-sm min-w-0">' +
          '<span class="material-symbols-outlined text-[14px] text-outline transition-transform folder-chevron" style="transform:' + (autoExpand ? 'rotate(90deg)' : 'rotate(0deg)') + ';">chevron_right</span>' +
          (folderKey === 'unassigned'
            ? ''
            : '<span class="material-symbols-outlined text-[14px] text-secondary shrink-0">folder</span>') +
          '<span class="font-label-sm text-label-sm text-on-surface uppercase mono truncate">' + escapeHtml(folderLabel) + '</span>' +
          '<span class="text-[9px] text-outline mono">' + count + ' metric(s)</span>' +
        '</div>' +
      '</div>' +
      '<div class="folder-body' + (autoExpand ? '' : ' hidden') + ' divide-y divide-hairline" data-folder-body="' + escapeHtml(folderKey) + '">' +
        rowsHtml +
      '</div>' +
    '</div>';
  };

  var html = '';

  // Unassigned metrics section (same layout as the Metrics > Folders subtab)
  var unassigned = getUnassignedMetrics().filter(isVisible);
  if (unassigned.length) {
    html += folderGroup('unassigned', 'Unassigned', unassigned.map(metricRow).join(''), unassigned.length);
  }

  // Folder groups
  getAllFolders().forEach(function (folder) {
    var folderMetrics = getMetricsInFolder(folder).filter(isVisible);
    if (!folderMetrics.length) return; // hide empty groups while filtering
    html += folderGroup(folder, folder, folderMetrics.map(metricRow).join(''), folderMetrics.length);
  });

  if (!html) {
    var emptyMsg = showOnlySelected
      ? (searchTerm
          ? 'No selected metrics match "' + escapeHtml(state.vizMetricSearch.trim()) + '".'
          : 'No selected metrics yet.')
      : 'No metrics match "' + escapeHtml(state.vizMetricSearch.trim()) + '".';
    vizMetricsList.innerHTML = '<div class="px-md py-3 text-[10px] text-outline mono uppercase">' + emptyMsg + '</div>';
    return;
  }

  vizMetricsList.innerHTML = html;

  // Attach folder collapse toggles (same behavior as the Folders subtab)
  vizMetricsList.querySelectorAll('[data-folder-toggle]').forEach(function (header) {
    header.addEventListener('click', function () {
      var folderKey = header.dataset.folderToggle;
      var body = vizMetricsList.querySelector('[data-folder-body="' + CSS.escape(folderKey) + '"]');
      var chevron = header.querySelector('.folder-chevron');
      if (!body) return;
      var isHidden = body.classList.contains('hidden');
      body.classList.toggle('hidden');
      if (chevron) chevron.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
    });
  });

  // Attach hover behavior matching Statement Lines catalog items
  vizMetricsList.querySelectorAll('[data-viz-metric]').forEach(function (row) {
    attachRowIconHover(row, activeNames.has(row.dataset.vizMetric));
    attachRowHoverHighlight(row);
  });
}

// ── Chart Legend (bottom container) ──

var VIZ_CHART_TYPE_OPTIONS = ['auto', 'line', 'area', 'bar'];

function renderVizLegendRow(kind, name, color, chartType, colorEnabled) {
  var typeLabel = chartType.charAt(0).toUpperCase() + chartType.slice(1);

  var controlTitle = colorEnabled
    ? 'Change color'
    : 'Color is set by ' + (kind === 'ticker' ? 'metric' : 'ticker') + ' in this mode';
  var labelCls = colorEnabled
    ? 'relative shrink-0 cursor-pointer'
    : 'relative shrink-0 opacity-40 cursor-not-allowed';
  var disabledAttr = colorEnabled ? '' : ' disabled';

  return '<div class="w-full px-md py-[2px] flex items-center gap-xs viz-legend-row hover:bg-surface-container-low transition-colors" data-viz-legend-kind="' + kind + '" data-viz-legend-name="' + escapeHtml(name) + '">' +
    // Color swatch + native color picker (enabled only when this dimension controls the colour scheme)
    '<label class="' + labelCls + '" title="' + controlTitle + '">' +
      '<span class="block w-3 h-3 rounded-sm border border-hairline" data-viz-legend-swatch style="background:' + color + ';"></span>' +
      '<input type="color" class="absolute inset-0 opacity-0 w-3 h-3 cursor-pointer" data-viz-legend-color value="' + color + '"' + disabledAttr + ' aria-label="Color for ' + escapeHtml(name) + '"/>' +
    '</label>' +
    '<span class="flex-1 min-w-0 text-body-sm text-on-surface mono truncate">' + escapeHtml(name) + '</span>' +
    // Custom chart-type dropdown (absolute menu anchored to the button — immune to zoom/transform)
    '<div class="relative shrink-0" data-viz-legend-type-wrap>' +
      '<button type="button" data-viz-legend-type class="h-5 w-24 flex items-center justify-between gap-0.5 bg-surface-container border border-hairline pl-1 pr-1 font-label-md text-label-md text-on-surface cursor-pointer hover:border-primary transition-colors" title="Chart type">' +
        '<span class="truncate" data-viz-legend-type-label>' + typeLabel + '</span>' +
        '<span class="material-symbols-outlined text-[12px] text-outline-variant shrink-0">arrow_drop_down</span>' +
      '</button>' +
    '</div>' +
    '<button type="button" data-viz-legend-remove class="shrink-0 flex items-center justify-center p-0.5 text-outline-variant hover:text-error transition-colors" title="Remove ' + escapeHtml(name) + '" aria-label="Remove ' + escapeHtml(name) + '">' +
      '<span class="material-symbols-outlined text-[14px]">close</span>' +
    '</button>' +
  '</div>';
}

function renderVizLegend() {
  if (!vizBottomContent) return;
  closeVizChartTypeMenu();
  var tickers = Array.from(state.vizActiveTickers);
  var metrics = state.vizMetrics;

  if (tickers.length === 0 && metrics.length === 0) {
    vizBottomContent.innerHTML =
      '<div class="px-md py-3 text-[10px] text-outline mono uppercase text-center">' +
        'No active tickers or metrics. Add them from the right panel.</div>';
    return;
  }

  var colorMode = getVizColorMode();
  var collapsed = state.vizLegendCollapsed || (state.vizLegendCollapsed = { tickers: false, metrics: false });

  var html = '';

  // Tickers section (collapsible, Metrics-folder pattern)
  html += '<div class="border-b border-hairline">' +
    '<div class="legend-section-header px-md py-[2px] bg-surface-container-high flex items-center gap-sm cursor-pointer select-none" data-legend-toggle="tickers" title="Toggle Tickers section">' +
      '<span class="material-symbols-outlined text-[14px] text-outline transition-transform legend-chevron" style="transform:' + (collapsed.tickers ? 'rotate(0deg)' : 'rotate(90deg)') + ';">chevron_right</span>' +
      '<span class="text-[9px] text-outline uppercase mono flex-1">Tickers (' + tickers.length + ')</span>' +
    '</div>' +
    '<div class="legend-section-body' + (collapsed.tickers ? ' hidden' : '') + '" data-legend-body="tickers">' +
      (tickers.length === 0
        ? '<div class="px-md py-1 text-[10px] text-outline mono">No active tickers.</div>'
        : tickers.map(function (ticker) {
            var style = getVizTickerStyle(ticker);
            var enabled = colorMode !== 'metric'; // ticker colouring active outside metric mode
            var color = enabled ? (style.color || '#8a90a0') : '#8a90a0';
            return renderVizLegendRow('ticker', ticker, color, style.chartType, enabled);
          }).join('')) +
    '</div>' +
  '</div>';

  // Metrics section (collapsible, Metrics-folder pattern)
  html += '<div>' +
    '<div class="legend-section-header px-md py-[2px] bg-surface-container-high flex items-center gap-sm cursor-pointer select-none" data-legend-toggle="metrics" title="Toggle Metrics section">' +
      '<span class="material-symbols-outlined text-[14px] text-outline transition-transform legend-chevron" style="transform:' + (collapsed.metrics ? 'rotate(0deg)' : 'rotate(90deg)') + ';">chevron_right</span>' +
      '<span class="text-[9px] text-outline uppercase mono flex-1">Metrics (' + metrics.length + ')</span>' +
    '</div>' +
    '<div class="legend-section-body' + (collapsed.metrics ? ' hidden' : '') + '" data-legend-body="metrics">' +
      (metrics.length === 0
        ? '<div class="px-md py-1 text-[10px] text-outline mono">No active metrics.</div>'
        : metrics.map(function (metric) {
            var style = getVizMetricStyle(metric.name);
            var enabled = colorMode === 'metric'; // metric colouring active in metric mode
            var color = enabled ? (style.color || metric.color || '#8a90a0') : '#8a90a0';
            return renderVizLegendRow('metric', metric.name, color, style.chartType, enabled);
          }).join('')) +
    '</div>' +
  '</div>';

  vizBottomContent.innerHTML = html;

  // Collapsible section toggles (matches Metrics folder system behaviour)
  vizBottomContent.querySelectorAll('[data-legend-toggle]').forEach(function (header) {
    header.addEventListener('click', function () {
      var key = header.dataset.legendToggle;
      var body = vizBottomContent.querySelector('[data-legend-body="' + key + '"]');
      var chevron = header.querySelector('.legend-chevron');
      if (!body) return;
      var isHidden = body.classList.contains('hidden');
      body.classList.toggle('hidden');
      if (state.vizLegendCollapsed) state.vizLegendCollapsed[key] = !isHidden;
      if (chevron) chevron.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
    });
  });
}

// ── Custom Chart-Type Dropdown (portal menu, never clipped by the scroll container) ──

var _vizTypeMenuOutside = null;
var _vizTypeMenuKey = null;
var _vizTypeMenuScroll = null;
var _vizTypeMenuResize = null;

function closeVizChartTypeMenu() {
  var menu = document.getElementById('viz-chart-type-menu');
  if (menu) menu.remove();
  if (_vizTypeMenuOutside) { document.removeEventListener('mousedown', _vizTypeMenuOutside); _vizTypeMenuOutside = null; }
  if (_vizTypeMenuKey) { document.removeEventListener('keydown', _vizTypeMenuKey); _vizTypeMenuKey = null; }
  if (_vizTypeMenuScroll) { window.removeEventListener('scroll', _vizTypeMenuScroll, true); _vizTypeMenuScroll = null; }
  if (_vizTypeMenuResize) { window.removeEventListener('resize', _vizTypeMenuResize); _vizTypeMenuResize = null; }
}

function openVizChartTypeMenu(btn, row) {
  closeVizChartTypeMenu();
  var kind = row.dataset.vizLegendKind;
  var name = row.dataset.vizLegendName;
  var style = (kind === 'ticker') ? getVizTickerStyle(name) : getVizMetricStyle(name);
  var current = style.chartType;

  var wrapper = btn.parentElement; // .relative dropdown wrapper in the row
  var container = btn.closest('#viz-bottom-content');

  var menu = document.createElement('div');
  menu.id = 'viz-chart-type-menu';
  menu.className = 'absolute z-50 bg-surface-container border border-hairline shadow-lg py-0.5';
  menu.style.minWidth = '104px';
  menu.style.right = '0';

  VIZ_CHART_TYPE_OPTIONS.forEach(function (t) {
    var label = t.charAt(0).toUpperCase() + t.slice(1);
    var opt = document.createElement('button');
    opt.type = 'button';
    opt.dataset.vizLegendTypeOpt = t;
    opt.className = 'w-full text-left px-2 py-0.5 font-label-md text-label-md text-on-surface hover:bg-primary/10 transition-colors flex items-center justify-between gap-2' + (current === t ? ' text-primary bg-primary/5' : '');
    var span = document.createElement('span');
    span.textContent = label;
    opt.appendChild(span);
    if (current === t) {
      var check = document.createElement('span');
      check.className = 'material-symbols-outlined text-[12px] text-primary shrink-0';
      check.textContent = 'check';
      opt.appendChild(check);
    }
    menu.appendChild(opt);
  });

  wrapper.appendChild(menu);

  // Open below the button; flip above when there is not enough room inside the container.
  var menuH = menu.offsetHeight;
  var wRect = wrapper.getBoundingClientRect();
  var cRect = container ? container.getBoundingClientRect() : null;
  if (cRect) {
    var spaceBelow = cRect.bottom - wRect.bottom;
    var spaceAbove = wRect.top - cRect.top;
    if (spaceBelow >= menuH || spaceBelow >= spaceAbove) {
      menu.style.top = '100%';
      menu.style.bottom = 'auto';
    } else {
      menu.style.top = 'auto';
      menu.style.bottom = '100%';
    }
  } else {
    menu.style.top = '100%';
    menu.style.bottom = 'auto';
  }

  menu.addEventListener('click', function (e) {
    var optBtn = e.target.closest('[data-viz-legend-type-opt]');
    if (!optBtn) return;
    if (kind === 'ticker') {
      getVizTickerStyle(name).chartType = optBtn.dataset.vizLegendTypeOpt;
    } else {
      getVizMetricStyle(name).chartType = optBtn.dataset.vizLegendTypeOpt;
    }
    // Update the button label in place (no full legend re-render, keeps context)
    var labelEl = row.querySelector('[data-viz-legend-type-label]');
    if (labelEl) {
      var lbl = optBtn.dataset.vizLegendTypeOpt;
      labelEl.textContent = lbl.charAt(0).toUpperCase() + lbl.slice(1);
    }
    // Close the menu first so it never dangles, then refresh the chart
    closeVizChartTypeMenu();
    updateVizChart();
  });

  // Close on outside click, Escape, scroll, or resize
  setTimeout(function () {
    _vizTypeMenuOutside = function (e) {
      if (!menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        closeVizChartTypeMenu();
      }
    };
    document.addEventListener('mousedown', _vizTypeMenuOutside);
  }, 0);

  _vizTypeMenuKey = function (e) {
    if (e.key === 'Escape') closeVizChartTypeMenu();
  };
  document.addEventListener('keydown', _vizTypeMenuKey);

  _vizTypeMenuScroll = function () { closeVizChartTypeMenu(); };
  window.addEventListener('scroll', _vizTypeMenuScroll, true);

  _vizTypeMenuResize = function () { closeVizChartTypeMenu(); };
  window.addEventListener('resize', _vizTypeMenuResize);
}

// ── Ticker / Metric Toggle ──

var _vizColorIndex = 0;
var _vizTickerColorIndex = 0;

// ── Chart Legend: per-item style resolution ──

function getVizTickerStyle(ticker) {
  if (!state.vizTickerStyles[ticker]) {
    state.vizTickerStyles[ticker] = { color: null, chartType: 'auto' };
  }
  return state.vizTickerStyles[ticker];
}

function getVizMetricStyle(metricName) {
  if (!state.vizMetricStyles[metricName]) {
    state.vizMetricStyles[metricName] = { color: null, chartType: 'auto' };
  }
  return state.vizMetricStyles[metricName];
}

// Colour mode: metric colouring wins except when many tickers are compared on a single metric (ticker colouring).
// This applies to 1x1, 1xN and Nx1; in the 1 ticker x 1 metric case the single metric drives the colour.
function getVizColorMode() {
  return (state.vizActiveTickers.size > 1 && state.vizMetrics.length === 1) ? 'ticker' : 'metric';
}

function resolveVizTraceColor(ticker, metric) {
  if (state.vizActiveTickers.size > 1 && state.vizMetrics.length === 1) {
    // many tickers x 1 metric: ticker colouring wins
    return getVizTickerStyle(ticker).color || VIZ_COLORS[0];
  }
  // 1 ticker x 1 metric, or 1 ticker x many metrics: metric colouring wins
  return getVizMetricStyle(metric.name).color || metric.color || VIZ_COLORS[0];
}

// Per-combination chart type: ticker override, then metric override, else line.
function resolveVizTraceChartType(ticker, metric) {
  var tickerType = getVizTickerStyle(ticker).chartType;
  if (tickerType && tickerType !== 'auto') return tickerType;
  var metricType = getVizMetricStyle(metric.name).chartType;
  if (metricType && metricType !== 'auto') return metricType;
  return 'line';
}

function toggleVizTicker(ticker) {
  if (!ticker) return;
  if (state.vizActiveTickers.has(ticker)) {
    // Remove: no mode enforcement needed for removals
    state.vizActiveTickers.delete(ticker);
    delete state.vizTickerStyles[ticker];
  } else {
    // Adding a ticker.
    // MODE A (1 stock, many ratios): clicking a different stock replaces the single stock.
    if (state.vizActiveTickers.size === 1 && state.vizMetrics.length > 1) {
      state.vizActiveTickers.clear();
    }
    state.vizActiveTickers.add(ticker);
    // Seed a default palette color for the new ticker (legend color; ticker wins)
    if (!state.vizTickerStyles[ticker]) {
      var tickerColor = VIZ_COLORS[_vizTickerColorIndex % VIZ_COLORS.length];
      _vizTickerColorIndex++;
      state.vizTickerStyles[ticker] = { color: tickerColor, chartType: 'auto' };
    }
  }
  renderVizTickerList();
  renderVizLegend();
  updateVizChart();
}

function toggleVizMetric(metricName) {
  if (!metricName) return;
  var metricData = state.ratios[metricName] || {};
  var formula = metricData.formula || '';

  // Check if already active — remove it
  for (var i = 0; i < state.vizMetrics.length; i++) {
    if (state.vizMetrics[i].name === metricName) {
      // Remove: no mode enforcement needed for removals
      state.vizMetrics.splice(i, 1);
      delete state.vizMetricStyles[metricName];
      Object.keys(state.vizDataCache).forEach(function (key) {
        if (key.indexOf('|' + metricName) !== -1) delete state.vizDataCache[key];
      });
      renderVizMetricsList();
      renderVizLegend();
      updateVizChart();
      return;
    }
  }

  // Adding a metric.
  // MODE B (many stocks, 1 ratio): clicking a different ratio replaces the single ratio.
  if (state.vizActiveTickers.size > 1 && state.vizMetrics.length === 1) {
    var oldMetric = state.vizMetrics[0];
    Object.keys(state.vizDataCache).forEach(function (key) {
      if (key.indexOf('|' + oldMetric.name) !== -1) delete state.vizDataCache[key];
    });
    state.vizMetrics = [];
  }

  // Add it
  var color = VIZ_COLORS[_vizColorIndex % VIZ_COLORS.length];
  _vizColorIndex++;
  state.vizMetrics.push({ name: metricName, formula: formula, color: color });
  if (!state.vizMetricStyles[metricName]) {
    state.vizMetricStyles[metricName] = { color: null, chartType: 'auto' };
  }
  renderVizMetricsList();
  renderVizLegend();
  updateVizChart();
}


// ── Chart ──

function updateVizChartStatus() {
  if (!vizChartStatus) return;
  var tickerCount = state.vizActiveTickers.size;
  var metricCount = state.vizMetrics.length;
  var traceCount = tickerCount * metricCount;

  if (state.vizChartLoading) {
    vizChartStatus.textContent = 'Loading...';
    return;
  }
  if (traceCount === 0) {
    vizChartStatus.textContent = 'Ready';
  } else {
    vizChartStatus.textContent = traceCount + ' trace' + (traceCount !== 1 ? 's' : '') +
      ' · ' + tickerCount + ' ticker' + (tickerCount !== 1 ? 's' : '') +
      ' · ' + metricCount + ' metric' + (metricCount !== 1 ? 's' : '');
  }
}

function updateVizChart() {
  if (!vizPlotlyContainer || !vizEmptyState) return;

  var tickers = Array.from(state.vizActiveTickers);
  var metrics = state.vizMetrics;

  updateVizChartStatus();

  if (tickers.length === 0 || metrics.length === 0) {
    vizEmptyState.style.display = 'flex';
    vizPlotlyContainer.querySelectorAll('.js-plotly-plot, .plot-container').forEach(function (el) { el.remove(); });
    var existingOverlay = document.getElementById('viz-loading-overlay');
    if (existingOverlay) existingOverlay.remove();
    return;
  }

  vizEmptyState.style.display = 'none';

  var neededCombos = [];
  tickers.forEach(function (ticker) {
    metrics.forEach(function (metric) {
      var key = ticker + '|' + metric.name;
      if (!state.vizDataCache[key]) {
        neededCombos.push({ ticker: ticker, metricName: metric.name, formula: metric.formula });
      }
    });
  });

  if (neededCombos.length === 0) {
    renderVizChartTraces(tickers, metrics);
    return;
  }

  state.vizChartLoading = true;
  updateVizChartStatus();
  showVizLoadingOverlay();

  window.finforge.computeMetricHistory({
    mode: 'batch',
    requests: neededCombos,
  }).then(function (result) {
    state.vizChartLoading = false;
    hideVizLoadingOverlay();

    if (result && result.ok && result.data) {
      var data = result.data;
      if (data.metricName && data.ticker && !data[data.ticker + '|' + data.metricName]) {
        var singleKey = data.ticker + '|' + data.metricName;
        var wrapped = {};
        wrapped[singleKey] = data;
        data = wrapped;
      }
      Object.keys(data).forEach(function (key) {
        if (data[key] && data[key].dates && data[key].values) {
          state.vizDataCache[key] = {
            dates: data[key].dates,
            values: data[key].values,
          };
        }
      });
    }

    renderVizChartTraces(tickers, metrics);
    updateVizChartStatus();
  }).catch(function (err) {
    state.vizChartLoading = false;
    hideVizLoadingOverlay();
    updateVizChartStatus();
    console.error('Failed to compute metric history:', err);
    renderVizChartTraces(tickers, metrics);
  });
}

function showVizLoadingOverlay() {
  hideVizLoadingOverlay();
  if (!vizChartWrapper) return;
  var overlay = document.createElement('div');
  overlay.id = 'viz-loading-overlay';
  overlay.innerHTML = '<div class="viz-spinner"></div>';
  vizChartWrapper.appendChild(overlay);
}

function hideVizLoadingOverlay() {
  var overlay = document.getElementById('viz-loading-overlay');
  if (overlay) overlay.remove();
}

var VIZ_DASH_PATTERNS = ['solid', 'dash', 'dot', 'dashdot', 'longdash', 'longdashdot'];

function renderVizChartTraces(tickers, metrics) {
  if (!vizPlotlyContainer) return;

  var traces = [];
  var allDates = [];

  metrics.forEach(function (metric, metricIdx) {
    tickers.forEach(function (ticker, tickerIdx) {
      var key = ticker + '|' + metric.name;
      var cached = state.vizDataCache[key];

      if (!cached || !cached.dates || !cached.values) return;

      var xVals = [];
      var yVals = [];
      for (var i = 0; i < cached.dates.length; i++) {
        if (cached.values[i] !== null && cached.values[i] !== undefined) {
          xVals.push(cached.dates[i]);
          yVals.push(cached.values[i]);
        }
      }

      allDates = allDates.concat(xVals);

      if (xVals.length === 0) return;

      var dash = VIZ_DASH_PATTERNS[tickerIdx % VIZ_DASH_PATTERNS.length];
      var chartType = resolveVizTraceChartType(ticker, metric);
      var color = resolveVizTraceColor(ticker, metric);

      var trace = {
        x: xVals,
        y: yVals,
        name: ticker,
        legendgroup: metric.name,
        legendgrouptitle: { text: metric.name },
        hovertemplate: '%{y:.4f}<extra>' + ticker + ' · ' + metric.name + '</extra>',
      };

      if (chartType === 'bar') {
        trace.type = 'bar';
        trace.marker = { color: color };
      } else if (chartType === 'area') {
        trace.type = 'scatter';
        trace.mode = state.vizShowMarkers ? 'lines+markers' : 'lines';
        trace.fill = 'tozeroy';
        trace.line = { color: color, width: 1.5, dash: dash, shape: state.vizSmoothLines ? 'spline' : 'linear' };
        if (state.vizShowMarkers) trace.marker = { size: 3, color: color };
      } else {
        // line (default)
        trace.type = 'scatter';
        trace.mode = state.vizShowMarkers ? 'lines+markers' : 'lines';
        trace.line = { color: color, width: 1.5, dash: dash, shape: state.vizSmoothLines ? 'spline' : 'linear' };
        if (state.vizShowMarkers) trace.marker = { size: 3, color: color };
      }

      traces.push(trace);
    });
  });

  if (traces.length === 0) {
    vizEmptyState.style.display = 'flex';
    vizPlotlyContainer.querySelectorAll('.js-plotly-plot, .plot-container').forEach(function (el) { el.remove(); });
    return;
  }

  vizEmptyState.style.display = 'none';

  // Dynamically calculate left margin based on y-axis label width
  var yMaxAbs = 0;
  traces.forEach(function (t) {
    if (t.y) {
      for (var yi = 0; yi < t.y.length; yi++) {
        var absVal = Math.abs(Number(t.y[yi]));
        if (!isNaN(absVal) && absVal > yMaxAbs) yMaxAbs = absVal;
      }
    }
  });
  var yIntDigits = yMaxAbs >= 1 ? Math.floor(Math.log10(yMaxAbs)) + 1 : 1;
  if (yMaxAbs === 0) yIntDigits = 1;
  var yLabelChars = yIntDigits + 1 + state.vizYAxisDecimals; // intDigits + decimalPoint + decimals
  var yLabelPx = yLabelChars * 6.5; // monospace at 10px ≈ 6.5px per char
  var leftMargin = Math.max(30, Math.round(yLabelPx + 10)); // minimum 30, plus 10px padding

  var extras = buildVizGraphLayoutExtras(allDates);

  var layout = {
    paper_bgcolor: extras.paper_bgcolor,
    plot_bgcolor: extras.plot_bgcolor,
    font: extras.font,
    margin: { l: leftMargin, r: 20, t: 30, b: 25 },
    xaxis: extras.xaxis,
    yaxis: extras.yaxis,
    legend: {
      orientation: 'h',
      yanchor: 'top',
      y: -0.22,
      xanchor: 'center',
      x: 0.5,
      font: { size: 9, color: '#d8dce8' },
      groupclick: 'toggleitem',
    },
    hovermode: 'x unified',
    hoverdistance: -1,
    dragmode: 'pan',
    showlegend: false,
  };

  var config = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d', 'toggleSpikelines'],
    displaylogo: false,
    responsive: false,
    scrollZoom: true,
  };

  if (typeof Plotly === 'undefined') {
    console.error('Plotly not loaded — chart cannot render');
    updateVizChartStatus();
    return;
  }

  Plotly.react(vizPlotlyContainer, traces, layout, config).then(function () {
    updateVizChartStatus();
    // Force resize after render to sync Plotly's internal coordinates with the actual DOM layout
    if (vizPlotlyContainer) {
      Plotly.Plots.resize(vizPlotlyContainer);
    }
    attachVizAxisStretchListeners();
    attachVizDynamicYAxisRelayoutListener();
    attachVizAdaptiveXTickRelayoutListener();
  });
}


// ── Event Listeners ──

document.querySelectorAll('.viz-view-switch[data-viz-view]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    setVizWorkspaceView(btn.dataset.vizView);
  });
});

if (vizTickersView) {
  vizTickersView.addEventListener('click', function (e) {
    var row = e.target.closest('[data-viz-ticker]');
    if (!row) return;
    toggleVizTicker(row.dataset.vizTicker);
  });
}

if (vizMetricsView) {
  vizMetricsView.addEventListener('click', function (e) {
    var row = e.target.closest('[data-viz-metric]');
    if (!row) return;
    toggleVizMetric(row.dataset.vizMetric);
  });
}

// ── Tickers / Metrics search bars (filter the picker lists) ──

if (vizTickerSearch) {
  vizTickerSearch.addEventListener('input', function () {
    state.vizTickerSearch = vizTickerSearch.value.trim();
    renderVizTickerList();
  });
}

if (vizMetricSearch) {
  vizMetricSearch.addEventListener('input', function () {
    state.vizMetricSearch = vizMetricSearch.value.trim();
    renderVizMetricsList();
  });
}

// ── Side container actions: Show Selected (toggle) / Remove All ──

[vizTickersShowSelected, vizMetricsShowSelected].forEach(function (btn) {
  if (!btn) return;
  btn.addEventListener('click', function () {
    toggleVizShowSelected(btn.dataset.kind);
  });
});

[vizTickersRemoveAll, vizMetricsRemoveAll].forEach(function (btn) {
  if (!btn) return;
  btn.addEventListener('click', function () {
    removeAllViz(btn.dataset.kind);
  });
});

// ── Chart Legend (bottom container) Event Delegation ──

if (vizBottomContent) {
  vizBottomContent.addEventListener('change', function (e) {
    // Color picker (chart type is now a custom dropdown opened via click)
    var colorInput = e.target.closest('[data-viz-legend-color]');
    if (colorInput) {
      var cRow = colorInput.closest('[data-viz-legend-kind]');
      if (!cRow) return;
      var cKind = cRow.dataset.vizLegendKind;
      var cName = cRow.dataset.vizLegendName;
      var cVal = colorInput.value;
      if (cKind === 'ticker') {
        getVizTickerStyle(cName).color = cVal;
      } else {
        getVizMetricStyle(cName).color = cVal;
      }
      // Update swatch in place (avoids re-render and keeps the color picker focused)
      var swatch = cRow.querySelector('[data-viz-legend-swatch]');
      if (swatch) swatch.style.background = cVal;
      updateVizChart();
    }
  });

  vizBottomContent.addEventListener('click', function (e) {
    // Chart type button -> open the custom dropdown menu
    var typeBtn = e.target.closest('[data-viz-legend-type]');
    if (typeBtn) {
      var tRow = typeBtn.closest('[data-viz-legend-kind]');
      if (tRow) openVizChartTypeMenu(typeBtn, tRow);
      return;
    }
    var removeBtn = e.target.closest('[data-viz-legend-remove]');
    if (!removeBtn) return;
    var row = removeBtn.closest('[data-viz-legend-kind]');
    if (!row) return;
    var kind = row.dataset.vizLegendKind;
    var name = row.dataset.vizLegendName;
    if (kind === 'ticker') {
      toggleVizTicker(name);
    } else {
      toggleVizMetric(name);
    }
  });
}

// ── Bottom Container Scroll Mode Toggle ──
var vizScrollMode = 'internal'; // 'internal' | 'page'

function setVizScrollMode(mode) {
  vizScrollMode = mode;
  var section = document.querySelector('.page-section[data-page="visualize"]');
  var toggle = vizBottomScrollToggle;
  var content = vizBottomContent;
  var grid = document.getElementById('viz-grid');
  var splitterH = grid ? grid.querySelector('.viz-splitter-h') : null;

  if (!section || !toggle || !content) return;

  // Snapshot current top-section height from the DOM so it never changes on mode switch
  var currentRows = grid ? grid.style.gridTemplateRows : '';
  var rowParts = currentRows.split(' ').filter(Boolean);
  var topPx = (rowParts.length > 0 && rowParts[0].endsWith('px')) ? rowParts[0] : '400px';

  // Update toggle button UI
  var internalSpan = toggle.querySelector('[data-mode="internal"]');
  var pageSpan = toggle.querySelector('[data-mode="page"]');
  toggle.setAttribute('data-scroll-mode', mode);

  if (mode === 'internal') {
    internalSpan.classList.remove('hidden');
    pageSpan.classList.add('hidden');
    toggle.classList.add('active');
    toggle.title = 'Internal scrolling (locked)';
    section.classList.remove('viz-page-scroll');
    content.style.overflowY = 'auto';
    content.style.maxHeight = '';
    // Restore grid to fill viewport, preserving top height
    if (grid) {
      grid.style.height = '100%';
      grid.style.minHeight = '0';
      grid.style.gridTemplateRows = topPx + ' 6px 1fr';
    }
    // Re-enable splitter H cursor
    if (splitterH) {
      splitterH.style.cursor = 'row-resize';
      splitterH.title = 'Drag to resize panels';
    }
  } else {
    // page mode
    internalSpan.classList.add('hidden');
    pageSpan.classList.remove('hidden');
    toggle.classList.remove('active');
    toggle.title = 'Page scrolling (unlocked)';
    section.classList.add('viz-page-scroll');
    content.style.overflowY = 'visible';
    content.style.maxHeight = 'none';
    // Let grid expand with content, preserving top height
    if (grid) {
      grid.style.height = 'auto';
      grid.style.minHeight = '100%';
      grid.style.gridTemplateRows = topPx + ' 6px 1fr';
    }
    // Disable splitter H cursor
    if (splitterH) {
      splitterH.style.cursor = 'default';
      splitterH.title = 'Splitter disabled in Page scroll mode';
    }
  }

  // Resize Plotly chart after mode switch
  setTimeout(function () {
    if (typeof Plotly !== 'undefined' && vizPlotlyContainer) {
      Plotly.Plots.resize(vizPlotlyContainer);
    }
    window.dispatchEvent(new Event('resize'));
  }, 100);
}

if (vizBottomScrollToggle) {
  vizBottomScrollToggle.addEventListener('click', function () {
    var nextMode = vizScrollMode === 'internal' ? 'page' : 'internal';
    setVizScrollMode(nextMode);
  });
}

// ── Bottom Container Tabs (Legend / Graph Settings) ──

var vizBottomTab = 'legend'; // 'legend' | 'graph'

function setVizBottomTab(tabName) {
  if (tabName !== 'legend' && tabName !== 'graph') tabName = 'legend';
  vizBottomTab = tabName;

  if (vizBottomContent) vizBottomContent.classList.toggle('hidden', tabName !== 'legend');
  if (vizGraphSettingsView) vizGraphSettingsView.classList.toggle('hidden', tabName !== 'graph');

  document.querySelectorAll('.viz-bottom-tab[data-viz-bottom-tab]').forEach(function (btn) {
    var active = btn.dataset.vizBottomTab === tabName;
    btn.classList.toggle('text-primary', active);
    btn.classList.toggle('text-on-surface-variant', !active);
  });

  if (tabName === 'graph') {
    renderVizGraphSettings();
  } else {
    renderVizLegend();
  }
}

document.querySelectorAll('.viz-bottom-tab[data-viz-bottom-tab]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    setVizBottomTab(btn.dataset.vizBottomTab);
  });
});

// ── Resizable Panel Splitters ──
(function initVizSplitters() {
  var grid = document.getElementById('viz-grid');
  if (!grid) return;
  var splitterV = grid.querySelector('.viz-splitter-v');
  var splitterH = grid.querySelector('.viz-splitter-h');

  var dragging = null; // 'v' | 'h' | null
  var startX, startY;
  var startLeftRatio, startTotalW;
  var startTopHeight;

  // Stored ratios / sizes so panels scale with window resize
  var leftRatio = 0.5;     // chart / total width
  var topHeight = 400;     // top panels height in px
  var minTop = 150;        // minimum top panels height
  var minBottom = 80;      // minimum bottom panel height
  var minCol = 200;        // minimum column width

  // Columns use fr units so they stay responsive in both scroll modes
  function applyColumns() {
    if (!grid) return;
    grid.style.gridTemplateColumns = leftRatio + 'fr 6px ' + (1 - leftRatio) + 'fr';
  }

  function applySizes() {
    if (!grid) return;
    applyColumns();
    // In page-scroll mode, rows are content-driven; leave them untouched
    if (vizScrollMode === 'page') return;
    var rect = grid.getBoundingClientRect();
    if (rect.height <= 6) return; // grid not yet laid out
    var totalH = rect.height - 6; // subtract splitter height
    var maxTop = totalH - minBottom;
    topHeight = Math.max(minTop, Math.min(topHeight, maxTop));
    grid.style.gridTemplateRows = topHeight + 'px 6px 1fr';
  }

  function onMouseDownV(e) {
    e.preventDefault();
    dragging = 'v';
    if (splitterV) splitterV.classList.add('dragging');
    startX = e.clientX;
    var rect = grid.getBoundingClientRect();
    startTotalW = Math.max(1, rect.width - 6);
    startLeftRatio = leftRatio;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  function onMouseDownH(e) {
    // Disable horizontal splitter drag in page scroll mode
    if (vizScrollMode === 'page') return;
    e.preventDefault();
    dragging = 'h';
    if (splitterH) splitterH.classList.add('dragging');
    startY = e.clientY;
    applySizes();
    startTopHeight = topHeight;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }

  function onMouseMove(e) {
    if (!dragging || !grid) return;
    if (dragging === 'v') {
      var dx = e.clientX - startX;
      var totalW = startTotalW;
      var newLeft = startLeftRatio * totalW + dx;
      if (totalW > 2 * minCol) {
        if (newLeft < minCol) newLeft = minCol;
        if (newLeft > totalW - minCol) newLeft = totalW - minCol;
      } else {
        newLeft = totalW / 2;
      }
      leftRatio = newLeft / totalW;
      applyColumns();
    } else {
      // h: drag DOWN → top grows, drag UP → top shrinks
      var dy = e.clientY - startY;
      var newTop = startTopHeight + dy;
      var rect = grid.getBoundingClientRect();
      var totalH = rect.height - 6;
      var maxTop = totalH - minBottom;
      if (newTop < minTop) newTop = minTop;
      if (newTop > maxTop) newTop = maxTop;
      topHeight = newTop;
      grid.style.gridTemplateRows = newTop + 'px 6px 1fr';
    }
    if (typeof Plotly !== 'undefined' && vizPlotlyContainer) {
      Plotly.Plots.resize(vizPlotlyContainer);
    }
  }

  function onMouseUp() {
    if (!dragging) return;
    var splitter = dragging === 'v' ? splitterV : splitterH;
    if (splitter) splitter.classList.remove('dragging');
    dragging = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  // Apply ratios on window resize so panels always fill the window
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (!dragging) applySizes();
      if (typeof Plotly !== 'undefined' && vizPlotlyContainer) {
        Plotly.Plots.resize(vizPlotlyContainer);
      }
    }, 50);
  });

  if (splitterV) splitterV.addEventListener('mousedown', onMouseDownV);
  if (splitterH) splitterH.addEventListener('mousedown', onMouseDownH);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
})();

loadFromDisk();
setActivePage('home');
setRatioWorkspaceView('list');

// ── Sidebar Collapse / Expand Toggle ──
(function initSidebarToggle() {
  var SIDEBAR_STORAGE_KEY = 'finforge_sidebar_collapsed';

  function applySidebarState(collapsed) {
    if (collapsed) {
      sidebar.classList.add('collapsed');
      mainContent.classList.add('collapsed');
      sidebarToggle.setAttribute('title', 'Expand sidebar');
      sidebarToggle.setAttribute('aria-label', 'Expand sidebar');
    } else {
      sidebar.classList.remove('collapsed');
      mainContent.classList.remove('collapsed');
      sidebarToggle.setAttribute('title', 'Collapse sidebar');
      sidebarToggle.setAttribute('aria-label', 'Collapse sidebar');
    }
  }

  function toggleSidebar() {
    var isCollapsed = sidebar.classList.contains('collapsed');
    var newState = !isCollapsed;
    applySidebarState(newState);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, newState ? '1' : '0');

    // Trigger Plotly resize after transition completes
    setTimeout(function () {
      if (typeof Plotly !== 'undefined' && vizPlotlyContainer) {
        Plotly.Plots.resize(vizPlotlyContainer);
      }
      window.dispatchEvent(new Event('resize'));
    }, 350);
  }

  // Restore saved state
  var savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);
  if (savedState === '1') {
    applySidebarState(true);
  }

  sidebarToggle.addEventListener('click', toggleSidebar);
})();

// ════════════════════════════════════════════════════════════════
// ── Ranking Tab ──
// Weighted multi-criteria scoring. Metric values come from the backend
// (Internal/Ranking), while scoring math lives here so curve edits
// recompute instantly without a round-trip.
// ════════════════════════════════════════════════════════════════

function rankingDefaultMetric(name) {
  var ratio = state.ratios && state.ratios[name] ? state.ratios[name] : {};
  var formula = ratio && typeof ratio === 'object' ? String(ratio.formula || '') : '';
  return {
    name: String(name || ''),
    formula: formula,
    curveType: 'percentile',
    direction: 'higher',
    maxPoints: 10,
    params: { mu: null, sigma: null, x0: null, k: null, low: null, high: null, thresholds: [], points: [], customPoints: [], smoothness: 0.5 },
  };
}

function rankingNormalizeMetric(metric) {
  var base = rankingDefaultMetric(metric && metric.name ? metric.name : '');
  if (!metric || typeof metric !== 'object') return base;
  var params = {};
  for (var key in base.params) {
    params[key] = (metric.params && metric.params[key] !== undefined) ? metric.params[key] : base.params[key];
  }
  var normSmooth = parseFloat(params.smoothness);
  params.smoothness = isFinite(normSmooth) ? Math.max(0, Math.min(1, normSmooth)) : 0.5;
  params.customPoints = rankingCustomSortedPoints(params.customPoints);
  return {
    name: String(metric.name || base.name),
    formula: String(metric.formula || base.formula),
    curveType: RANKING_CURVE_TYPES.some(function (c) { return c.value === metric.curveType; }) ? metric.curveType : base.curveType,
    direction: metric.direction === 'lower' || metric.direction === 'target' ? metric.direction : 'higher',
    maxPoints: Number(metric.maxPoints) > 0 ? Number(metric.maxPoints) : base.maxPoints,
    params: params,
  };
}

// ── Universe helpers ──

function rankingSortedUniverse(metricName) {
  var values = [];
  rankingState.tickers.forEach(function (ticker) {
    var value = rankingState.values[ticker] ? rankingState.values[ticker][metricName] : null;
    if (value !== null && value !== undefined && !isNaN(Number(value))) values.push(Number(value));
  });
  values.sort(function (a, b) { return a - b; });
  return values;
}

function rankingQuantile(sorted, q) {
  if (!sorted.length) return null;
  if (sorted.length === 1) return sorted[0];
  var position = q * (sorted.length - 1);
  var low = Math.floor(position);
  var high = Math.ceil(position);
  if (low === high) return sorted[low];
  var t = position - low;
  return sorted[low] * (1 - t) + sorted[high] * t;
}

// Discretionary scoring defaults, documented so the ranking math is auditable.
// Each value is chosen to be sensible for a small ticker universe and can be
// overridden per metric in the UI:
//   mu / x0   -> universe median (center of the Bell / S-Curve)
//   sigma     -> IQR / 1.349, a robust approximation of the standard deviation
//                for a normal distribution
//   k         -> 4 / IQR, which stretches the S-Curve across the interquartile
//                range of the universe
//   low/high  -> 1st / 99th percentile of the universe (linear-curve bounds)
function rankingEffectiveParams(metric, universe) {
  var p = metric.params || {};
  var out = {
    mu: parseFloat(p.mu),
    sigma: parseFloat(p.sigma),
    x0: parseFloat(p.x0),
    k: parseFloat(p.k),
    low: parseFloat(p.low),
    high: parseFloat(p.high),
    thresholds: Array.isArray(p.thresholds) ? p.thresholds.map(Number) : [],
    points: Array.isArray(p.points) ? p.points.map(Number) : [],
    customPoints: [],
    smoothness: 0.5,
  };

  var median = rankingQuantile(universe, 0.5);
  var q25 = rankingQuantile(universe, 0.25);
  var q75 = rankingQuantile(universe, 0.75);
  var iqr = (q75 !== null && q25 !== null) ? (q75 - q25) : null;
  var p1 = rankingQuantile(universe, 0.01);
  var p99 = rankingQuantile(universe, 0.99);

  if (!isFinite(out.mu)) out.mu = median !== null ? median : 0;
  if (!isFinite(out.sigma)) out.sigma = (iqr && iqr > 0) ? (iqr / 1.349) : 1;
  if (!isFinite(out.x0)) out.x0 = median !== null ? median : 0;
  if (!isFinite(out.k)) out.k = (iqr && iqr > 0) ? (4 / iqr) : 1;
  if (!isFinite(out.low)) out.low = p1 !== null ? p1 : (universe.length ? Math.min.apply(null, universe) : 0);
  if (!isFinite(out.high)) out.high = p99 !== null ? p99 : (universe.length ? Math.max.apply(null, universe) : 1);
  if (out.high <= out.low) out.high = out.low + 1;

  out.customPoints = rankingCustomSortedPoints(p.customPoints);
  var smoothRaw = parseFloat(p.smoothness);
  out.smoothness = isFinite(smoothRaw) ? Math.max(0, Math.min(1, smoothRaw)) : 0.5;

  return out;
}

// ── Step curve helpers ──

// Normalize step thresholds + points into ascending bins: bin j is
// [t_{j-1}, t_j) and scores points[j] (t_{-1} = -Inf, t_n = +Inf). This keeps
// the drawn curve, the draggable handles, and the score lookup all in sync even
// when thresholds are typed out of order.
function rankingStepBins(metric) {
  var thresholds = Array.isArray(metric.params && metric.params.thresholds) ? metric.params.thresholds.map(Number).filter(function (n) { return isFinite(n); }) : [];
  var points = Array.isArray(metric.params && metric.params.points) ? metric.params.points.map(Number) : [];
  var order = thresholds.map(function (t, i) { return i; }).sort(function (a, b) { return thresholds[a] - thresholds[b]; });
  var n = thresholds.length;
  var sorted = order.map(function (i) { return thresholds[i]; });
  var aligned = [];
  for (var j = 0; j < n; j++) aligned.push(points[order[j]]);
  aligned.push(n ? points[order[n - 1] + 1] : points[0]);
  // Default a missing bin point to the previous bin's point so the highest
  // value bin never silently collapses to 0.
  for (var k = 0; k <= n; k++) {
    if (!isFinite(aligned[k])) aligned[k] = k > 0 ? aligned[k - 1] : 0;
  }
  return { thresholds: sorted, points: aligned };
}

function rankingNormalizeStepParams(metric) {
  var bins = rankingStepBins(metric);
  // Clamp thresholds to the data range so bins never invert when a threshold
  // is dragged/typed beyond the last (or before the first) ticker value. This
  // keeps the drawn step curve and the yellow handles/typed values aligned.
  var domain = rankingCurveDomain(metric);
  if (domain) {
    bins.thresholds = bins.thresholds.map(function (t) {
      return Math.max(domain.dataLow, Math.min(domain.dataHigh, t));
    });
    for (var i = 1; i < bins.thresholds.length; i++) {
      if (bins.thresholds[i] <= bins.thresholds[i - 1]) bins.thresholds[i] = bins.thresholds[i - 1] + 1e-9;
    }
  }
  metric.params.thresholds = bins.thresholds;
  metric.params.points = bins.points;
}

// ── Custom curve helpers ──

function rankingCustomSortedPoints(points) {
  var valid = [];
  (Array.isArray(points) ? points : []).forEach(function (p) {
    if (!p || typeof p !== 'object') return;
    var x = Number(p.x);
    var y = Number(p.y);
    if (!isFinite(x) || !isFinite(y)) return;
    valid.push({ x: x, y: y });
  });
  valid.sort(function (a, b) { return a.x - b.x; });
  var dedup = [];
  valid.forEach(function (p) {
    if (!dedup.length || Math.abs(dedup[dedup.length - 1].x - p.x) > 1e-12) dedup.push(p);
  });
  return dedup;
}

function rankingCustomScore(value, points, smoothness, maxPoints) {
  var pts = rankingCustomSortedPoints(points);
  var clamp = function (y) { return Math.max(0, Math.min(maxPoints, y)); };
  if (!pts.length) return 0;
  if (pts.length === 1) return clamp(pts[0].y);

  var x = Number(value);
  if (x <= pts[0].x) return clamp(pts[0].y);
  if (x >= pts[pts.length - 1].x) return clamp(pts[pts.length - 1].y);

  var i = 0;
  while (i < pts.length - 2 && x > pts[i + 1].x) i++;
  var x0 = pts[i].x, y0 = pts[i].y;
  var x1 = pts[i + 1].x, y1 = pts[i + 1].y;
  var span = x1 - x0;
  var t = span > 1e-12 ? (x - x0) / span : 0;
  var linear = y0 + t * (y1 - y0);

  var sm = Number(smoothness);
  if (!isFinite(sm) || sm <= 0) return clamp(linear);

  var p0 = i > 0 ? pts[i - 1] : pts[0];
  var p3 = i < pts.length - 2 ? pts[i + 2] : pts[pts.length - 1];
  var cr = 0.5 * (
    (2 * y0) +
    (-p0.y + y1) * t +
    (2 * p0.y - 5 * y0 + 4 * y1 - p3.y) * t * t +
    (-p0.y + 3 * y0 - 3 * y1 + p3.y) * t * t * t
  );
  return clamp(linear + sm * (cr - linear));
}

// ── Scoring: value function per curve family ──

// Each curve family maps a raw metric value to [0, maxPoints]:
//   percentile -> midrank percentile of the ticker within the universe
//   gaussian   -> normal-density decay from mu (full points at mu for "target")
//   sigmoid    -> logistic curve centered at x0 with steepness k
//   linear     -> clamped linear scale between low and high
//   step       -> piecewise-constant bins defined by thresholds/points
//   custom     -> user-drawn points blended with a Catmull-Rom spline
// "direction" flips the score for metrics where lower is better.
function rankingScore(value, metric, universe) {
  if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) return null;
  value = Number(value);
  var maxPoints = Number(metric.maxPoints) || 10;
  var direction = metric.direction || 'higher';
  var p = rankingEffectiveParams(metric, universe);

  switch (metric.curveType) {
    case 'percentile': {
      if (!universe.length) return null;
      var n = universe.length;
      var below = 0;
      var equal = 0;
      for (var i = 0; i < n; i++) {
        var v = universe[i];
        if (v === value) equal++;
        else if (v < value) below++;
      }
      var pct = n === 1 ? 0.5 : (below + equal / 2) / n;
      return (direction === 'lower' ? 1 - pct : pct) * maxPoints;
    }
    case 'gaussian': {
      var d = (value - p.mu) / Math.max(p.sigma, 1e-9);
      var g = Math.exp(-(d * d) / 2);
      if (direction === 'target') return g * maxPoints;
      if (direction === 'lower') return value <= p.mu ? maxPoints : g * maxPoints;
      return value >= p.mu ? maxPoints : g * maxPoints;
    }
    case 'sigmoid': {
      var z = p.k * (value - p.x0);
      var s = 1 / (1 + Math.exp(-z));
      return (direction === 'lower' ? 1 - s : s) * maxPoints;
    }
    case 'linear': {
      var t = (value - p.low) / (p.high - p.low);
      t = Math.max(0, Math.min(1, t));
      return (direction === 'lower' ? 1 - t : t) * maxPoints;
    }
    case 'step': {
      var bins = rankingStepBins(metric);
      var bucket = bins.thresholds.length;
      for (var j = 0; j < bins.thresholds.length; j++) {
        if (value < bins.thresholds[j]) { bucket = j; break; }
      }
      var points = bins.points.length > bucket ? bins.points[bucket] : 0;
      return Math.max(0, Math.min(maxPoints, Number(points) || 0));
    }
    case 'custom':
      return rankingCustomScore(value, p.customPoints, p.smoothness, maxPoints);
    default:
      return null;
  }
}

function rankingComputeResults() {
  var metrics = rankingState.metrics;
  var tickers = Array.from(rankingState.tickers);
  var universes = {};
  metrics.forEach(function (m) { universes[m.name] = rankingSortedUniverse(m.name); });

  var rows = tickers.map(function (ticker) {
    // Score is 100 * (points earned) / (max points of metrics that have data).
    // Metrics with missing data are excluded from the denominator, so partial
    // data is treated as "average of available metrics" and is NOT penalized.
    // `present` and `metricCount` are surfaced in the table to show coverage.
    var total = 0;
    var denominator = 0;
    var present = 0;
    var perMetric = {};
    metrics.forEach(function (m) {
      var raw = rankingState.values[ticker] ? rankingState.values[ticker][m.name] : null;
      var points = rankingScore(raw, m, universes[m.name]);
      var maxPoints = Number(m.maxPoints) || 10;
      if (points === null) {
        perMetric[m.name] = { raw: raw, points: null, maxPoints: maxPoints, missing: true };
      } else {
        present++;
        denominator += maxPoints;
        total += points;
        perMetric[m.name] = { raw: raw, points: points, maxPoints: maxPoints, missing: false };
      }
    });
    return {
      ticker: ticker,
      score: denominator > 0 ? (100 * total / denominator) : 0,
      totalPoints: total,
      totalMax: denominator,
      present: present,
      metricCount: metrics.length,
      perMetric: perMetric,
    };
  });

  rows.sort(function (a, b) {
    if (b.score !== a.score) return b.score - a.score;
    return a.ticker.localeCompare(b.ticker);
  });
  return rows;
}

// ── Rendering: chips, metric list, cards, curve charts, table ──

function renderRankingTickerList() {
  if (!rankingTickerList) return;
  if (rankingTickerCount) rankingTickerCount.textContent = rankingState.tickers.size + ' selected';

  var tickers = state.importList.slice();
  var searchTerm = rankingState.tickerSearch.trim().toLowerCase();

  if (!tickers.length) {
    rankingTickerList.innerHTML = '<div class="px-md py-3 text-[10px] text-outline mono uppercase">No tickers imported yet. Go to Search tab to import tickers.</div>';
    return;
  }

  var filtered = searchTerm
    ? tickers.filter(function (t) { return String(t).toLowerCase().indexOf(searchTerm) !== -1; })
    : tickers;

  if (!filtered.length) {
    rankingTickerList.innerHTML = '<div class="px-md py-3 text-[10px] text-outline mono uppercase">No tickers match "' + escapeHtml(rankingState.tickerSearch.trim()) + '".</div>';
    return;
  }

  rankingTickerList.innerHTML = filtered.map(function (ticker) {
    var isActive = rankingState.tickers.has(ticker);
    var cls = 'w-full text-left px-md py-1 transition-colors flex items-center justify-between gap-md cursor-pointer viz-item-row';
    if (isActive) cls += ' selected';
    return '<div class="' + cls + '" data-ranking-ticker="' + escapeHtml(ticker) + '">' +
      '<div class="min-w-0">' +
        '<div class="text-body-sm text-on-surface mono truncate">' + escapeHtml(ticker) + '</div>' +
      '</div>' +
      '<span class="row-state-icon material-symbols-outlined text-[16px] shrink-0" style="color:' + (isActive ? '#4edea3' : '#8a90a0') + ';">' + (isActive ? 'check' : 'add') + '</span>' +
    '</div>';
  }).join('');

  rankingTickerList.querySelectorAll('[data-ranking-ticker]').forEach(function (row) {
    attachRowIconHover(row, rankingState.tickers.has(row.dataset.rankingTicker));
    attachRowHoverHighlight(row);
  });
}

function attachRowIconHover(row, isActive) {
  var icon = row.querySelector('.row-state-icon');
  if (!icon) return;

  var applyDefault = function () {
    if (isActive) {
      icon.textContent = 'check';
      icon.style.color = '#4edea3';
    } else {
      icon.textContent = 'add';
      icon.style.color = '#8a90a0';
    }
  };

  var applyHover = function () {
    if (isActive) {
      icon.textContent = 'close';
      icon.style.color = '#ffb4ab';
    } else {
      icon.textContent = 'add';
      icon.style.color = '#4edea3';
    }
  };

  applyDefault();
  row.addEventListener('mouseenter', applyHover);
  row.addEventListener('mouseleave', applyDefault);
}

var ROW_HOVER_BG = '#0f1828'; // surface-container-high (app theme token)

function attachRowHoverHighlight(row) {
  if (!row) return;
  row.addEventListener('mouseenter', function () {
    row.style.backgroundColor = ROW_HOVER_BG;
  });
  row.addEventListener('mouseleave', function () {
    row.style.backgroundColor = '';
  });
}

function attachRankingMetricRowHover(row) {
  var viewIcon = row.querySelector('.row-view-icon');
  var removeIcon = row.querySelector('.row-remove-icon');

  if (viewIcon) {
    viewIcon.addEventListener('mouseenter', function () {
      viewIcon.style.color = '#adc6ff';
    });
    viewIcon.addEventListener('mouseleave', function () {
      var expanded = row.dataset.rankingMetric === rankingState.expandedMetric;
      viewIcon.style.color = expanded ? '#adc6ff' : '#8a90a0';
    });
  }

  if (removeIcon) {
    removeIcon.addEventListener('mouseenter', function () {
      removeIcon.style.color = '#ffb4ab';
    });
    removeIcon.addEventListener('mouseleave', function () {
      removeIcon.style.color = '#8a90a0';
    });
  }
}

function renderRankingMetricList() {
  if (!rankingMetricList) return;
  syncRankingMetricFooterButtons();

  var metrics = state.ratios;
  var names = Object.keys(metrics);
  if (!names.length) {
    rankingMetricList.innerHTML = '<div class="px-md py-3 text-[10px] text-outline mono uppercase">No metrics defined. Create one in the Metrics tab.</div>';
    return;
  }

  var searchTerm = rankingState.metricSearch.trim().toLowerCase();
  var searching = searchTerm.length > 0;
  var matchesSearch = function (name) {
    if (!searchTerm) return true;
    return String(name).toLowerCase().indexOf(searchTerm) !== -1;
  };

  var activeNames = new Set(rankingState.metrics.map(function (m) { return m.name; }));
  var showOnlySelected = rankingState.metricShowSelected;
  var isVisible = function (name) {
    return matchesSearch(name) && (!showOnlySelected || activeNames.has(name));
  };

  var autoExpand = searching || showOnlySelected;

  var metricRow = function (name) {
    var isActive = activeNames.has(name);
    var isExpanded = rankingState.expandedMetric === name;
    var cls = 'w-full text-left px-md py-1 transition-colors flex items-center justify-between gap-md viz-item-row cursor-pointer';
    if (isActive) cls += ' selected';
    return '<div class="' + cls + '" data-ranking-metric="' + escapeHtml(name) + '">' +
      '<div class="min-w-0">' +
        '<div class="text-body-sm text-on-surface mono truncate">' + escapeHtml(name) + '</div>' +
      '</div>' +
      '<div class="flex items-center gap-xs shrink-0">' +
        '<span class="material-symbols-outlined text-[16px] shrink-0 row-view-icon" style="color:' + (isExpanded ? '#adc6ff' : '#8a90a0') + ';" title="' + (isExpanded ? 'Collapse metric' : 'Show metric ranking') + '">' + (isExpanded ? 'unfold_less' : 'open_in_full') + '</span>' +
        (isActive
          ? '<span class="material-symbols-outlined text-[16px] shrink-0 row-remove-icon" data-ranking-remove="' + escapeHtml(name) + '" style="color:#8a90a0;" title="Remove metric" role="button" aria-label="Remove metric">close</span>'
          : '') +
      '</div>' +
    '</div>';
  };

  var folderGroup = function (folderKey, folderLabel, rowsHtml, count) {
    return '<div class="folder-group bg-surface-container">' +
      '<div class="folder-header border border-hairline px-md py-1 bg-surface-container-high flex items-center justify-between cursor-pointer select-none" data-folder-toggle="' + escapeHtml(folderKey) + '">' +
        '<div class="flex items-center gap-sm min-w-0">' +
          '<span class="material-symbols-outlined text-[14px] text-outline transition-transform folder-chevron" style="transform:' + (autoExpand ? 'rotate(90deg)' : 'rotate(0deg)') + ';">chevron_right</span>' +
          (folderKey === 'unassigned'
            ? ''
            : '<span class="material-symbols-outlined text-[14px] text-secondary shrink-0">folder</span>') +
          '<span class="font-label-sm text-label-sm text-on-surface uppercase mono truncate">' + escapeHtml(folderLabel) + '</span>' +
          '<span class="text-[9px] text-outline mono">' + count + ' metric(s)</span>' +
        '</div>' +
      '</div>' +
      '<div class="folder-body' + (autoExpand ? '' : ' hidden') + ' divide-y divide-hairline" data-folder-body="' + escapeHtml(folderKey) + '">' +
        rowsHtml +
      '</div>' +
    '</div>';
  };

  var html = '';

  var unassigned = getUnassignedMetrics().filter(isVisible);
  if (unassigned.length) {
    html += folderGroup('unassigned', 'Unassigned', unassigned.map(metricRow).join(''), unassigned.length);
  }

  getAllFolders().forEach(function (folder) {
    var folderMetrics = getMetricsInFolder(folder).filter(isVisible);
    if (!folderMetrics.length) return;
    html += folderGroup(folder, folder, folderMetrics.map(metricRow).join(''), folderMetrics.length);
  });

  if (!html) {
    var emptyMsg = showOnlySelected
      ? (searchTerm
          ? 'No selected metrics match "' + escapeHtml(rankingState.metricSearch.trim()) + '".'
          : 'No selected metrics yet.')
      : 'No metrics match "' + escapeHtml(rankingState.metricSearch.trim()) + '".';
    rankingMetricList.innerHTML = '<div class="px-md py-3 text-[10px] text-outline mono uppercase">' + emptyMsg + '</div>';
    return;
  }

  rankingMetricList.innerHTML = html;

  rankingMetricList.querySelectorAll('[data-folder-toggle]').forEach(function (header) {
    header.addEventListener('click', function () {
      var folderKey = header.dataset.folderToggle;
      var body = rankingMetricList.querySelector('[data-folder-body="' + CSS.escape(folderKey) + '"]');
      var chevron = header.querySelector('.folder-chevron');
      if (!body) return;
      var isHidden = body.classList.contains('hidden');
      body.classList.toggle('hidden');
      if (chevron) chevron.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
    });
  });

  rankingMetricList.querySelectorAll('[data-ranking-metric]').forEach(function (row) {
    attachRankingMetricRowHover(row);
    attachRowHoverHighlight(row);
  });
}

function syncRankingMetricFooterButtons() {
  var btn = rankingMetricShowSelected;
  if (!btn) return;
  var active = !!rankingState.metricShowSelected;
  btn.classList.toggle('bg-primary/10', active);
  btn.classList.toggle('border-primary', active);
  btn.classList.toggle('text-primary', active);
  btn.classList.toggle('bg-surface-container-high', !active);
  btn.classList.toggle('border-hairline', !active);
  btn.classList.toggle('text-on-surface-variant', !active);
  btn.setAttribute('aria-pressed', active ? 'true' : 'false');
}

function rankingParamInput(label, key, value) {
  var shown = (value === null || value === undefined || isNaN(Number(value))) ? '' : String(value);
  return '<label class="space-y-0.5">' +
    '<span class="text-[8px] text-outline uppercase mono">' + escapeHtml(label) + '</span>' +
    '<input type="number" step="any" data-ranking-param="' + key + '" value="' + escapeHtml(shown) + '" class="w-full h-6 bg-surface-container-lowest border border-hairline px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none" placeholder="auto"/>' +
  '</label>';
}

// Step curve: two editable columns (thresholds as x cells, points as y cells).
function rankingStepEditorHtml(m) {
  var thresholds = (m.params.thresholds || []).map(Number);
  var points = (m.params.points || []).map(Number);
  var thrCells = thresholds.map(function (v, j) {
    return '<div class="flex items-center gap-0.5">' +
      '<span class="w-3 text-right text-[8px] text-outline mono shrink-0">' + (j + 1) + '</span>' +
      '<input type="number" step="any" data-step-threshold-idx="' + j + '" value="' + Number(v) + '" class="flex-1 min-w-0 h-5 bg-surface-container-lowest border border-hairline px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none"/>' +
      '<button type="button" data-step-threshold-delete="' + j + '" class="w-5 h-5 shrink-0 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors" title="Delete threshold" aria-label="Delete threshold ' + (j + 1) + '"><span class="material-symbols-outlined text-[13px]">close</span></button>' +
    '</div>';
  }).join('');
  var ptCells = points.map(function (v, j) {
    return '<div class="flex items-center gap-0.5">' +
      '<span class="w-3 text-right text-[8px] text-outline mono shrink-0">' + (j + 1) + '</span>' +
      '<input type="number" step="any" data-step-point-idx="' + j + '" value="' + Number(v) + '" class="flex-1 min-w-0 h-5 bg-surface-container-lowest border border-hairline px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none"/>' +
    '</div>';
  }).join('');
  return '<div class="px-md py-0.5 grid grid-cols-2 gap-xs">' +
    '<div class="space-y-0.5 min-w-0">' +
      '<span class="text-[8px] text-outline uppercase mono">Thresholds (x)</span>' +
      '<div class="space-y-0.5 max-h-20 overflow-y-auto custom-scrollbar">' + (thrCells || '<div class="text-[9px] text-outline mono">-</div>') + '</div>' +
    '</div>' +
    '<div class="space-y-0.5 min-w-0">' +
      '<span class="text-[8px] text-outline uppercase mono">Points (one per bin)</span>' +
      '<div class="space-y-0.5 max-h-20 overflow-y-auto custom-scrollbar">' + (ptCells || '<div class="text-[9px] text-outline mono">-</div>') + '</div>' +
    '</div>' +
  '</div>';
}

// Custom curve: one row per point with editable x/y and a delete button.
function rankingCustomPointsHtml(m) {
  var pts = rankingCustomSortedPoints(m.params.customPoints || []);
  var rows = pts.map(function (p, j) {
    return '<div class="flex items-center gap-0.5 py-0.5" data-custom-point-row="' + j + '">' +
      '<span class="w-4 text-right text-[8px] text-outline mono shrink-0">' + (j + 1) + '</span>' +
      '<input type="number" step="any" data-custom-point-x="' + j + '" value="' + Number(p.x) + '" class="flex-1 min-w-0 h-5 bg-surface-container-lowest border border-hairline px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none" title="x" aria-label="Point ' + (j + 1) + ' x"/>' +
      '<input type="number" step="any" data-custom-point-y="' + j + '" value="' + Number(p.y) + '" class="flex-1 min-w-0 h-5 bg-surface-container-lowest border border-hairline px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none" title="y" aria-label="Point ' + (j + 1) + ' y"/>' +
      '<button type="button" data-custom-point-delete="' + j + '" class="w-5 h-5 shrink-0 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors" title="Delete point" aria-label="Delete point ' + (j + 1) + '"><span class="material-symbols-outlined text-[13px]">close</span></button>' +
    '</div>';
  }).join('');
  return '<div class="px-md py-0.5 border-t border-hairline">' +
    '<div class="text-[8px] text-outline uppercase mono mb-0.5">Points</div>' +
    '<div data-ranking-custom-points>' + (rows || '<div class="text-[9px] text-outline mono">No points yet</div>') + '</div>' +
  '</div>';
}

function rankingCardHtml(m, idx) {
  var advancedMode = !!rankingState.advancedOpen;
  var expanded = advancedMode || rankingState.expandedMetric === m.name;

  var activeCurve = RANKING_CURVE_TYPES.find(function (c) { return c.value === m.curveType; });
  var curveButtons;
  if (expanded) {
    curveButtons = RANKING_CURVE_TYPES.map(function (c) {
      var active = m.curveType === c.value;
      return '<button type="button" data-ranking-curve="' + c.value + '" class="h-6 inline-flex items-center px-2 font-label-md text-label-md border transition-colors' + (active ? ' bg-primary/10 text-primary border-primary' : ' bg-surface-container-high border-hairline text-on-surface-variant hover:border-primary') + '">' + c.label + '</button>';
    }).join('');
  } else {
    curveButtons = '<span class="h-6 inline-flex items-center px-2 font-label-md text-label-md border bg-primary/10 text-primary border-primary select-none cursor-default" title="Expand to change curve type">' + (activeCurve ? activeCurve.label : '') + '</span>';
  }

  var dirOptions = m.curveType === 'gaussian' ? ['higher', 'lower', 'target'] : ((m.curveType === 'step' || m.curveType === 'custom') ? [] : ['higher', 'lower']);
  var dirButtons = dirOptions.map(function (d) {
    var active = m.direction === d;
    var label = d.charAt(0).toUpperCase() + d.slice(1);
    return '<button type="button" data-ranking-dir="' + d + '" class="h-6 inline-flex items-center px-2 font-label-md text-label-md border transition-colors' + (active ? ' bg-primary/10 text-primary border-primary' : ' bg-surface-container-high border-hairline text-on-surface-variant hover:border-primary') + '">' + label + '</button>';
  }).join('');

  var paramsHtml = '';
  if (m.curveType === 'gaussian') {
    paramsHtml = rankingParamInput('Center', 'mu', m.params.mu) + rankingParamInput('Steepness', 'sigma', m.params.sigma);
  } else if (m.curveType === 'sigmoid') {
    paramsHtml = rankingParamInput('Midpoint', 'x0', m.params.x0) + rankingParamInput('Slope', 'k', m.params.k);
  } else if (m.curveType === 'linear') {
    paramsHtml = rankingParamInput('Low anchor', 'low', m.params.low) + rankingParamInput('High anchor', 'high', m.params.high);
  } else if (m.curveType === 'custom') {
    var smoothVal = (m.params.smoothness === null || m.params.smoothness === undefined || isNaN(Number(m.params.smoothness))) ? 0.5 : Number(m.params.smoothness);
    var smoothPct = Math.max(0, Math.min(100, Math.round(smoothVal * 100)));
    paramsHtml =
      '<label class="flex items-center gap-2 min-w-0">' +
        '<span class="text-[8px] text-outline uppercase mono whitespace-nowrap">Smoothness</span>' +
        '<input type="range" min="0" max="100" step="1" data-ranking-smoothness value="' + smoothPct + '" class="w-24 h-5 accent-primary"/>' +
        '<input type="number" min="0" max="100" step="1" data-ranking-smoothness-num value="' + smoothPct + '" class="w-14 h-6 bg-surface-container-lowest border border-hairline px-1 font-label-md text-label-md text-on-surface focus:border-primary outline-none"/>' +
      '</label>';
  }

  var maxPtsHtml = '<label class="flex items-center gap-xs">' +
    '<span class="text-[8px] text-outline uppercase mono">Max pts</span>' +
    '<input type="number" step="1" min="0.1" data-ranking-max value="' + escapeHtml(String(m.maxPoints)) + '" class="w-16 h-6 bg-surface-container-lowest border border-hairline px-2 font-label-md text-label-md text-on-surface focus:border-primary outline-none"/>' +
  '</label>';

  var bodyHtml = '';
  if (expanded) {
    var paramsGrid = '';
    if (m.curveType === 'step') {
      paramsGrid = rankingStepEditorHtml(m);
    } else if (paramsHtml) {
      paramsGrid = (m.curveType === 'custom')
        ? '<div class="px-md py-1 flex items-center gap-2 flex-wrap">' + paramsHtml + '</div>'
        : '<div class="px-md py-1 grid grid-cols-4 gap-xs">' + paramsHtml + '</div>';
    }
    var pointList = (m.curveType === 'custom') ? rankingCustomPointsHtml(m) : '';
    var hint = (m.curveType === 'custom')
      ? '<div class="px-md py-0.5 text-[9px] text-outline mono">Click to add a point, drag to move, right-click a point to delete</div>'
      : (m.curveType === 'percentile' ? '' : '<div class="px-md py-0.5 text-[9px] text-outline mono">Drag the yellow handles on the curve, or type values above</div>');

    // Advanced single-metric view: every curve type shares the Custom layout — a
    // "points location" card on the left and the docked TICKERS card on the right,
    // with the chart below. Percentile has no editable points, so it shows only the
    // docked TICKERS card (justify-end, no left column). For the other types the
    // ticker panel is absolutely positioned so the row height is set by the left
    // points column alone and the ticker list scrolls internally when taller.
    var sideBySide = advancedMode && m.curveType !== 'percentile';
    // Left "points location" card content per curve type (advanced view only).
    var leftCard = '';
    if (advancedMode) {
      if (m.curveType === 'custom') {
        leftCard = rankingCustomPointsHtml(m);
      } else if (m.curveType === 'step') {
        leftCard = rankingStepEditorHtml(m);
      } else if (m.curveType === 'gaussian' || m.curveType === 'sigmoid' || m.curveType === 'linear') {
        leftCard = '<div class="px-md py-0.5 border-t border-hairline">' +
          '<div class="text-[8px] text-outline uppercase mono mb-0.5">Points</div>' +
          '<div class="grid grid-cols-2 gap-xs">' + paramsHtml + '</div>' +
        '</div>';
      }
      // percentile → no left card
    }
    var tickersWrapCls = sideBySide
      ? 'absolute inset-y-0 left-[22rem] w-80 min-w-0 flex flex-col border-t border-hairline'
      : (advancedMode ? 'w-80 shrink-0 min-w-0 flex flex-col border-t border-hairline' : 'border-t border-hairline');
    var tickersListCls = sideBySide
      ? 'flex-1 min-h-0 overflow-y-auto custom-scrollbar'
      : (advancedMode ? 'max-h-40 overflow-y-auto custom-scrollbar' : 'max-h-24 overflow-y-auto custom-scrollbar');
    // Column header aligned with the ticker row columns (ticker | value | pts).
    // In the advanced view the docked card is w-80, so rows use fixed-width columns.
    var tickerColHeader = (advancedMode)
      ? '<div class="px-sm py-0.5 flex items-center gap-sm border-b border-hairline shrink-0">' +
          '<span class="w-14 shrink-0"></span>' +
          '<span class="w-20 shrink-0 text-right text-[8px] text-outline uppercase mono">Value</span>' +
          '<span class="w-32 shrink-0 text-right text-[8px] text-outline uppercase mono">Pts</span>' +
        '</div>'
      : '<div class="px-sm py-0.5 flex items-center gap-sm border-b border-hairline shrink-0">' +
          '<span class="w-14 shrink-0"></span>' +
          '<span class="flex-1 min-w-0 text-right text-[8px] text-outline uppercase mono">Value</span>' +
          '<span class="shrink-0 text-[8px] text-outline uppercase mono">Pts</span>' +
        '</div>';
    var tickersPanel = advancedMode
      ? '<div class="' + tickersWrapCls + '" data-ranking-advanced-tickers>' +
          '<div class="px-sm py-0.5 flex items-center gap-xs border-b border-hairline bg-surface-container-high shrink-0">' +
            '<span class="text-[8px] text-outline uppercase mono whitespace-nowrap">Tickers</span>' +
            '<input data-ranking-advanced-ticker-search class="flex-1 min-w-0 h-5 bg-surface-container-lowest border border-hairline px-1 font-label-md text-label-md text-on-surface placeholder:text-outline-variant focus:border-primary outline-none" placeholder="Search" type="text" value="' + escapeHtml(rankingState.tickerPanelSearch) + '"/>' +
          '</div>' +
          tickerColHeader +
          '<div data-ranking-advanced-ticker-list class="' + tickersListCls + '"></div>' +
        '</div>'
      : '';

    var dirRow;
    if (advancedMode) {
      // Custom keeps its shape params (smoothness) in the top row; the other types
      // show their direction buttons here. A top border matches the Custom card.
      var dirContent = (m.curveType === 'custom')
        ? paramsHtml
        : (dirButtons ? '<span class="flex items-center gap-xs flex-wrap">' + dirButtons + '</span>' : '');
      dirRow = '<div class="px-md py-1 border-t border-hairline flex items-center gap-sm flex-wrap">' + dirContent + maxPtsHtml + '</div>';
    } else {
      dirRow = '<div class="px-md py-1 flex items-center gap-sm flex-wrap">' +
        (dirButtons ? '<span class="flex items-center gap-xs flex-wrap">' + dirButtons + '</span>' : '') +
      '</div>';
    }
    var chartHtml = '<div id="ranking-curve-' + idx + '" class="border-t border-hairline" data-ranking-chart="' + idx + '"></div>';

    if (advancedMode) {
      if (sideBySide) {
        bodyHtml = dirRow +
          '<div class="relative">' +
            '<div class="flex items-stretch">' +
              '<div class="w-[22rem] shrink-0 min-w-0">' + leftCard + '</div>' +
            '</div>' +
            tickersPanel +
          '</div>' +
          hint + chartHtml;
      } else {
        // Percentile: no left card, TICKERS card docked to the right.
        bodyHtml = dirRow +
          '<div class="flex items-stretch justify-end">' + tickersPanel + '</div>' +
          hint + chartHtml;
      }
    } else {
      bodyHtml = dirRow + paramsGrid + pointList + hint + chartHtml;
    }
  }

  var toggleHtml;
  if (advancedMode) {
    toggleHtml = '<span class="font-label-sm text-label-sm font-bold text-on-surface uppercase mono truncate select-none" style="max-width:240px;">' + escapeHtml(m.name) + '</span>';
  } else {
    toggleHtml = '<div class="flex items-center gap-xs min-w-0 cursor-pointer select-none" data-ranking-toggle="' + idx + '" title="' + (expanded ? 'Collapse' : 'Expand') + ' metric">' +
      '<span class="material-symbols-outlined text-[14px] text-outline transition-transform" style="transform:' + (expanded ? 'rotate(90deg)' : 'rotate(0deg)') + ';">chevron_right</span>' +
      '<span class="font-label-sm text-label-sm font-bold text-on-surface uppercase mono truncate" style="max-width:160px;">' + escapeHtml(m.name) + '</span>' +
    '</div>';
  }

  return '<div class="border border-hairline bg-surface-container-low" data-ranking-card="' + idx + '">' +
    '<div class="px-md py-1 bg-surface-container-high flex items-center gap-sm flex-wrap">' +
      toggleHtml +
      '<span class="flex items-center gap-xs flex-wrap">' + curveButtons + '</span>' +
      (advancedMode ? '' : '<div class="ml-auto">' + maxPtsHtml + '</div>') +
    '</div>' +
    bodyHtml +
  '</div>';
}

function renderRankingCards() {
  if (!rankingCards) return;
  var metrics = rankingState.metrics;

  var entries = metrics.map(function (m, idx) { return { m: m, idx: idx }; });
  if (rankingState.advancedOpen) {
    entries = entries.filter(function (e) { return e.m.name === rankingState.advancedMetricName; });
  }

  if (!entries.length) {
    rankingCards.innerHTML = '<div class="h-full flex flex-col items-center justify-center gap-sm text-outline-variant">' +
      '<span class="material-symbols-outlined text-[40px] opacity-30">leaderboard</span>' +
      '<p class="text-[11px] mono uppercase">' + (rankingState.advancedOpen ? 'Select a metric from the dropdown' : 'Add metrics to configure scoring curves') + '</p>' +
    '</div>';
    return;
  }

  rankingCards.innerHTML = entries.map(function (e) {
    return rankingCardHtml(e.m, e.idx);
  }).join('');

  entries.forEach(function (e) {
    if (rankingState.advancedOpen || rankingState.expandedMetric === e.m.name) drawRankingCurve(e.idx);
  });
}

function rankingCurveBounds(metric) {
  var universe = rankingSortedUniverse(metric.name);
  if (!universe.length) return null;
  var low = Math.min.apply(null, universe);
  var high = Math.max.apply(null, universe);
  if (high <= low) high = low + 1;
  var span = high - low;
  return [low - span, high + span];
}

// Shared domain for curve drawing and step-bin geometry: data range padded by
// one full span on each side (same math used by drawRankingCurve). Keeping one
// source of truth prevents the drawn curve and the point handles from drifting
// apart when thresholds move near/beyond the data edges.
function rankingCurveDomain(metric) {
  var universe = rankingSortedUniverse(metric.name);
  if (!universe.length) return null;
  var dataLow = Math.min.apply(null, universe);
  var dataHigh = Math.max.apply(null, universe);
  if (dataHigh <= dataLow) dataHigh = dataLow + 1;
  var span = dataHigh - dataLow;
  return { dataLow: dataLow, dataHigh: dataHigh, span: span, curveMin: dataLow - span, curveMax: dataHigh + span };
}

// Sample the scoring curve over [curveMin, curveMax]. Step curves are drawn as
// exact bins; custom curves are sampled per-segment so closely spaced points
// stay smooth; all other families use a dense uniform grid.
function rankingSampleCurve(metric, universe, curveMin, curveMax, maxPoints) {
  var x = [];
  var y = [];
  var stepShape = false;

  if (metric.curveType === 'step') {
    var stepBins = rankingStepBins(metric);
    var stepLevel = function (v) { return Math.max(0, Math.min(maxPoints, Number(v) || 0)); };
    x.push(curveMin);
    y.push(stepLevel(stepBins.points[0]));
    stepBins.thresholds.forEach(function (t, j) {
      x.push(t);
      y.push(stepLevel(stepBins.points[j + 1]));
    });
    x.push(curveMax);
    y.push(stepLevel(stepBins.points[stepBins.thresholds.length]));
    stepShape = true;
    return { x: x, y: y, stepShape: stepShape };
  }

  if (metric.curveType === 'custom') {
    var pts = rankingCustomSortedPoints(metric.params ? metric.params.customPoints : []);
    var range = curveMax - curveMin;
    // Sample every inter-point segment independently so narrow segments keep
    // enough density even when the whole curve spans a very wide x range.
    var segSamples = range > 1e-12 ? Math.max(24, Math.min(120, Math.ceil(720 / Math.max(1, pts.length + 1)))) : 24;
    var seg = function (x0, x1) {
      for (var s = 1; s <= segSamples; s++) x.push(x0 + (x1 - x0) * (s / segSamples));
    };
    x.push(curveMin);
    if (!pts.length) {
      for (var a = 1; a < 720; a++) x.push(curveMin + range * (a / 720));
    } else {
      if (pts[0].x > curveMin) seg(curveMin, pts[0].x);
      for (var i = 0; i < pts.length - 1; i++) seg(pts[i].x, pts[i + 1].x);
      if (pts[pts.length - 1].x < curveMax) seg(pts[pts.length - 1].x, curveMax);
    }
    x.push(curveMax);
    var dedup = [];
    for (var k = 0; k < x.length; k++) {
      if (!dedup.length || Math.abs(dedup[dedup.length - 1] - x[k]) > 1e-12) dedup.push(x[k]);
    }
    x = dedup;
    for (var m = 0; m < x.length; m++) {
      var cVal = rankingScore(x[m], metric, universe);
      y.push(cVal === null ? null : cVal);
    }
    return { x: x, y: y, stepShape: false };
  }

  var samples = 720;
  for (var i = 0; i <= samples; i++) {
    var vx = curveMin + (curveMax - curveMin) * (i / samples);
    var vy = rankingScore(vx, metric, universe);
    x.push(vx);
    y.push(vy === null ? null : vy);
  }
  return { x: x, y: y, stepShape: false };
}

function drawRankingCurve(idx, viewRange) {
  var container = document.getElementById('ranking-curve-' + idx);
  var metric = rankingState.metrics[idx];
  if (!container || !metric) return;

  var universe = rankingSortedUniverse(metric.name);
  if (!universe.length) {
    container.innerHTML = '<div class="h-full flex items-center justify-center text-[10px] text-outline mono uppercase">No data for this metric</div>';
    delete rankingHandles[idx];
    return;
  }

  if (typeof Plotly === 'undefined') {
    container.innerHTML = '<div class="h-full flex items-center justify-center text-[10px] text-outline mono uppercase">Plotly unavailable</div>';
    delete rankingHandles[idx];
    return;
  }

  var maxPoints = Number(metric.maxPoints) || 10;
  var p = rankingEffectiveParams(metric, universe);
  var domain = rankingCurveDomain(metric);
  var dataLow = domain.dataLow;
  var dataHigh = domain.dataHigh;
  var span = domain.span;

  // Sample the scoring curve across a padded range wider than the data so the
  // line stays visible while panning; the axis view is clamped inside that range.
  var curveMin = domain.curveMin;
  var curveMax = domain.curveMax;
  var viewMin, viewMax;
  var useView = (viewRange && viewRange.length === 2) ? viewRange : metric._viewRange;
  if (useView && useView.length === 2 && isFinite(useView[0]) && isFinite(useView[1]) && useView[1] > useView[0]) {
    viewMin = useView[0];
    viewMax = useView[1];
  } else {
    viewMin = dataLow - span * 0.08;
    viewMax = dataHigh + span * 0.08;
  }
  var viewSpan = viewMax - viewMin;
  if (viewSpan > curveMax - curveMin) {
    viewMin = curveMin;
    viewMax = curveMax;
  } else {
    if (viewMin < curveMin) { viewMin = curveMin; viewMax = viewMin + viewSpan; }
    if (viewMax > curveMax) { viewMax = curveMax; viewMin = viewMax - viewSpan; }
  }
  metric._viewRange = [viewMin, viewMax];

  var sampled = rankingSampleCurve(metric, universe, curveMin, curveMax, maxPoints);
  var curveX = sampled.x;
  var curveY = sampled.y;
  var stepShape = sampled.stepShape;

  var dotX = [];
  var dotY = [];
  var dotText = [];
  rankingState.tickers.forEach(function (ticker) {
    var raw = rankingState.values[ticker] ? rankingState.values[ticker][metric.name] : null;
    if (raw === null || raw === undefined || isNaN(Number(raw))) return;
    var pts = rankingScore(Number(raw), metric, universe);
    dotX.push(Number(raw));
    dotY.push(pts === null ? null : pts);
    dotText.push(ticker);
  });

  var curveTrace = {
    x: curveX,
    y: curveY,
    type: 'scatter',
    mode: 'lines',
    name: 'curve',
    line: stepShape ? { color: '#4FC3F7', width: 1.5, shape: 'hv' } : { color: '#4FC3F7', width: 1.5 },
    hoverinfo: 'skip',
  };
  var dotTrace = {
    x: dotX,
    y: dotY,
    type: 'scatter',
    mode: 'markers',
    name: 'stocks',
    text: dotText,
    hovertemplate: '%{text}<br>value %{x:.3f}<br>%{y:.2f} pts<extra></extra>',
    marker: { color: '#FF8A65', size: 6 },
  };

  var handles = rankingHandleDefs(metric, p, universe);
  rankingHandles[idx] = handles;
  var traces = [curveTrace, dotTrace];
  if (handles.length) {
    traces.push({
      x: handles.map(function (h) { return h.x; }),
      y: handles.map(function (h) { return h.y; }),
      type: 'scatter',
      mode: 'markers',
      name: 'handles',
      text: handles.map(function (h) { return h.label; }),
      hovertemplate: '%{text}<br>x %{x:.4f}<br>y %{y:.2f}<extra></extra>',
      marker: { color: '#FFD54F', size: 9, line: { color: '#0b1422', width: 1 } },
    });
  }

  var focusTicker = rankingState.focusedTicker;
  var focusRaw = focusTicker ? (rankingState.values[focusTicker] ? rankingState.values[focusTicker][metric.name] : null) : null;
  var focusX = (focusRaw !== null && focusRaw !== undefined && !isNaN(Number(focusRaw))) ? Number(focusRaw) : null;
  var focusY = focusX === null ? null : rankingScore(focusX, metric, universe);
  var layoutShapes = [];
  var layoutAnnotations = [];
  if (focusX !== null && focusY !== null) {
    layoutShapes.push({ type: 'line', x0: focusX, x1: focusX, y0: 0, y1: maxPoints * 1.05, xref: 'x', yref: 'y', line: { color: '#FFD54F', width: 1, dash: 'dot' } });
    layoutAnnotations.push({ x: focusX, y: maxPoints * 1.05, xref: 'x', yref: 'y', text: focusTicker + '  ' + focusX.toFixed(3) + ' -> ' + focusY.toFixed(2), showarrow: false, font: { size: 9, color: '#FFD54F' }, xanchor: 'center', yanchor: 'bottom' });
    traces.push({
      x: [focusX],
      y: [focusY],
      type: 'scatter',
      mode: 'markers',
      name: 'focus',
      hoverinfo: 'skip',
      marker: { color: '#FFD54F', size: 12, line: { color: '#0b1422', width: 1.5 } },
    });
  }

  var layout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { size: 9, color: '#d8dce8' },
    margin: { l: 34, r: 8, t: 22, b: 22 },
    xaxis: { color: '#424754', gridcolor: '#1c2638', zeroline: false, range: [viewMin, viewMax], title: { text: metric.name, font: { size: 9 } } },
    yaxis: { color: '#424754', gridcolor: '#1c2638', zeroline: false, range: [0, maxPoints * 1.05] },
    showlegend: false,
    hovermode: 'closest',
    dragmode: false,
    shapes: layoutShapes,
    annotations: layoutAnnotations,
  };
  var config = { displayModeBar: false, displaylogo: false, responsive: false, scrollZoom: false, doubleClick: false, showTips: false };

  Plotly.react(container, traces, layout, config);
}

function rankingStepBinBounds(thresholds, universe) {
  var lo = universe.length ? Math.min.apply(null, universe) : 0;
  var hi = universe.length ? Math.max.apply(null, universe) : 1;
  var bounds = [];
  var lower = lo;
  for (var j = 0; j < thresholds.length; j++) {
    bounds.push([lower, thresholds[j]]);
    lower = thresholds[j];
  }
  bounds.push([lower, hi]);
  return bounds;
}

function rankingHandleDefs(metric, p, universe) {
  var maxPoints = Number(metric.maxPoints) || 10;
  var handles = [];
  switch (metric.curveType) {
    case 'gaussian':
      handles.push({ id: 'mu', param: 'mu', index: -1, axis: 'x', x: p.mu, y: maxPoints, label: 'center' });
      if (metric.direction === 'target') {
        handles.push({ id: 'sigma', param: 'sigma', index: -1, axis: 'x', x: p.mu + p.sigma, y: maxPoints * Math.exp(-0.5), label: 'width' });
      } else if (metric.direction === 'higher') {
        handles.push({ id: 'sigma', param: 'sigma', index: -1, axis: 'x', x: p.mu - p.sigma, y: maxPoints * Math.exp(-0.5), label: 'width' });
      } else {
        handles.push({ id: 'sigma', param: 'sigma', index: -1, axis: 'x', x: p.mu + p.sigma, y: maxPoints * Math.exp(-0.5), label: 'width' });
      }
      break;
    case 'sigmoid':
      handles.push({ id: 'x0', param: 'x0', index: -1, axis: 'x', x: p.x0, y: maxPoints / 2, label: 'midpoint' });
      handles.push({ id: 'k', param: 'k', index: -1, axis: 'x', x: p.x0 + 1 / p.k, y: maxPoints / (1 + Math.exp(-1)), label: 'slope' });
      break;
    case 'linear':
      handles.push({ id: 'low', param: 'low', index: -1, axis: 'x', x: p.low, y: metric.direction === 'lower' ? maxPoints : 0, label: 'low' });
      handles.push({ id: 'high', param: 'high', index: -1, axis: 'x', x: p.high, y: metric.direction === 'lower' ? 0 : maxPoints, label: 'high' });
      break;
    case 'step': {
      var stepBins = rankingStepBins(metric);
      stepBins.thresholds.forEach(function (threshold, j) {
        // Sit the threshold handle on the curve at the level of the bin to its
        // right, so it visually connects to the step it controls.
        var level = Math.max(0, Math.min(maxPoints, Number(stepBins.points[j + 1]) || 0));
        handles.push({ id: 'threshold-' + j, param: 'thresholds', index: j, axis: 'x', x: threshold, y: level, label: 'threshold ' + (j + 1) });
      });
      var bounds = rankingStepBinBounds(stepBins.thresholds, universe);
      stepBins.points.forEach(function (points, j) {
        if (!bounds[j]) return;
        var center = (bounds[j][0] + bounds[j][1]) / 2;
        handles.push({ id: 'point-' + j, param: 'points', index: j, axis: 'y', x: center, y: Math.max(0, Math.min(maxPoints, Number(points) || 0)), label: 'score ' + (j + 1) });
      });
      break;
    }
    case 'custom':
      p.customPoints.forEach(function (point, j) {
        handles.push({ id: 'custom-' + j, param: 'customPoints', index: j, axis: 'both', x: point.x, y: Math.max(0, Math.min(maxPoints, Number(point.y) || 0)), label: 'point ' + (j + 1) });
      });
      break;
  }
  return handles;
}

function rankingHandlePixel(container, handle) {
  var layout = container._fullLayout;
  if (!layout || !layout.xaxis || !layout.yaxis) return null;
  var rect = container.getBoundingClientRect();
  var xaxis = layout.xaxis;
  var yaxis = layout.yaxis;
  var xRange = xaxis.range[1] - xaxis.range[0];
  var yRange = yaxis.range[1] - yaxis.range[0];
  var px = rect.left + layout.margin.l + ((handle.x - xaxis.range[0]) / xRange) * xaxis._length;
  var py = rect.top + layout.margin.t + ((yaxis.range[1] - handle.y) / yRange) * yaxis._length;
  return { x: px, y: py };
}

function rankingPixelToData(container, clientX, clientY) {
  var layout = container._fullLayout;
  var rect = container.getBoundingClientRect();
  var xaxis = layout.xaxis;
  var yaxis = layout.yaxis;
  var xPx = clientX - rect.left - layout.margin.l;
  var yPx = clientY - rect.top - layout.margin.t;
  var x = xaxis.range[0] + (xPx / xaxis._length) * (xaxis.range[1] - xaxis.range[0]);
  var y = yaxis.range[1] - (yPx / yaxis._length) * (yaxis.range[1] - yaxis.range[0]);
  return { x: x, y: y };
}

function rankingFindHandle(container, clientX, clientY) {
  var idx = Number(container.dataset.rankingChart);
  var handles = rankingHandles[idx] || [];
  var hitRadius = 16;
  var best = null;
  var bestDist = Infinity;
  for (var i = 0; i < handles.length; i++) {
    var px = rankingHandlePixel(container, handles[i]);
    if (!px) continue;
    var dx = clientX - px.x;
    var dy = clientY - px.y;
    var dist = dx * dx + dy * dy;
    if (dist <= hitRadius * hitRadius && dist < bestDist) {
      bestDist = dist;
      best = { handle: handles[i], idx: idx };
    }
  }
  return best;
}

function rankingApplyDrag(container, handle, clientX, clientY) {
  var idx = Number(container.dataset.rankingChart);
  var metric = rankingState.metrics[idx];
  if (!metric) return;
  var universe = rankingSortedUniverse(metric.name);
  var maxPoints = Number(metric.maxPoints) || 10;
  var data = rankingPixelToData(container, clientX, clientY);

  if (handle.axis === 'both') {
    var customPoints = (metric.params.customPoints || []).slice();
    if (handle.index < 0 || handle.index >= customPoints.length) return;
    var minGap = 1e-9;
    var newX = data.x;
    var newY = Math.max(0, Math.min(maxPoints, data.y));
    if (handle.index > 0 && customPoints[handle.index - 1]) newX = Math.max(newX, Number(customPoints[handle.index - 1].x) + minGap);
    if (handle.index < customPoints.length - 1 && customPoints[handle.index + 1]) newX = Math.min(newX, Number(customPoints[handle.index + 1].x) - minGap);
    customPoints[handle.index] = { x: newX, y: newY };
    metric.params.customPoints = customPoints;
    return;
  }

  if (handle.axis === 'y') {
    var y = Math.max(0, Math.min(maxPoints, data.y));
    if (handle.param === 'points') {
      var points = (metric.params.points || []).slice();
      points[handle.index] = y;
      metric.params.points = points;
    }
    return;
  }

  var x = data.x;
  var p = rankingEffectiveParams(metric, universe);

  if (handle.param === 'mu') {
    metric.params.mu = x;
  } else if (handle.param === 'sigma') {
    metric.params.sigma = Math.max(0.001, Math.abs(x - p.mu));
  } else if (handle.param === 'x0') {
    metric.params.x0 = x;
  } else if (handle.param === 'k') {
    var dist = Math.abs(x - p.x0);
    metric.params.k = dist > 1e-6 ? 1 / dist : p.k;
  } else if (handle.param === 'low' || handle.param === 'high') {
    var gap = Math.max(1e-6, (p.high - p.low) * 0.01);
    if (handle.param === 'low') {
      metric.params.low = Math.min(x, p.high - gap);
    } else {
      metric.params.high = Math.max(x, p.low + gap);
    }
  } else if (handle.param === 'thresholds') {
    var thresholds = (metric.params.thresholds || []).slice();
    var domain = rankingCurveDomain(metric);
    var dLow = domain ? domain.dataLow : -Infinity;
    var dHigh = domain ? domain.dataHigh : Infinity;
    var lower = handle.index > 0 ? thresholds[handle.index - 1] : dLow;
    var upper = handle.index < thresholds.length - 1 ? thresholds[handle.index + 1] : dHigh;
    thresholds[handle.index] = Math.max(lower, Math.min(upper, x));
    metric.params.thresholds = thresholds;
  }
}

function rankingInitCustomPoints(metric, prevType) {
  var universe = rankingSortedUniverse(metric.name);
  var maxPoints = Number(metric.maxPoints) || 10;
  if (!universe.length) {
    metric.params.customPoints = [];
    return;
  }
  var low = Math.min.apply(null, universe);
  var high = Math.max.apply(null, universe);
  if (high <= low) high = low + 1;
  var count = 4;
  var pts = [];
  var tmp = null;
  if (prevType && prevType !== 'custom') {
    tmp = { name: metric.name, formula: metric.formula, curveType: prevType, direction: metric.direction, maxPoints: maxPoints, params: metric.params };
  }
  for (var i = 0; i < count; i++) {
    var t = i / (count - 1);
    var x = low + (high - low) * t;
    var y = tmp ? rankingScore(x, tmp, universe) : (maxPoints * t);
    pts.push({ x: x, y: Math.max(0, Math.min(maxPoints, Number(y) || 0)) });
  }
  metric.params.customPoints = pts;
}

function rankingAddCustomPoint(metric, chartEl, clientX, clientY) {
  var maxPoints = Number(metric.maxPoints) || 10;
  var data = rankingPixelToData(chartEl, clientX, clientY);
  var y = Math.max(0, Math.min(maxPoints, data.y));
  var points = rankingCustomSortedPoints(metric.params.customPoints || []);
  points.push({ x: data.x, y: y });
  points.sort(function (a, b) { return a.x - b.x; });
  metric.params.customPoints = points;
  var index = points.findIndex(function (p) { return Math.abs(p.x - data.x) < 1e-9; });
  if (index < 0) index = points.length - 1;
  return { id: 'custom-' + index, param: 'customPoints', index: index, axis: 'both', x: data.x, y: y, label: 'point ' + (index + 1) };
}

function rankingAddStepThreshold(metric, chartEl, clientX, clientY) {
  var maxPoints = Number(metric.maxPoints) || 10;
  var data = rankingPixelToData(chartEl, clientX, clientY);
  var insertX = data.x;
  var addDomain = rankingCurveDomain(metric);
  if (addDomain) insertX = Math.max(addDomain.dataLow, Math.min(addDomain.dataHigh, insertX));
  var thresholds = (metric.params.thresholds || []).slice();
  var points = (metric.params.points || []).slice();
  while (points.length < thresholds.length + 1) points.push(0);
  if (points.length > thresholds.length + 1) points.length = thresholds.length + 1;

  var insertAt = thresholds.length;
  for (var j = 0; j < thresholds.length; j++) {
    if (insertX < thresholds[j]) { insertAt = j; break; }
  }
  var leftY = insertAt > 0 ? points[insertAt - 1] : points[0];
  var rightY = points[insertAt];
  var newY = (Number(leftY) + Number(rightY)) / 2;
  thresholds.splice(insertAt, 0, insertX);
  points.splice(insertAt, 0, newY);
  metric.params.thresholds = thresholds;
  metric.params.points = points;
  return { id: 'threshold-' + insertAt, param: 'thresholds', index: insertAt, axis: 'x', x: insertX, y: maxPoints / 2, label: 'threshold ' + (insertAt + 1) };
}

function rankingPanToX(chartEl, metric, x, alwaysCenter) {
  var layout = chartEl && chartEl._fullLayout;
  if (!layout || !layout.xaxis || !metric) return;
  var range = layout.xaxis.range;
  var span = range[1] - range[0];
  if (!alwaysCenter) {
    var pad = span * 0.05;
    if (x >= range[0] + pad && x <= range[1] - pad) return;
  }
  var domain = rankingCurveDomain(metric);
  var min = domain ? domain.curveMin : range[0];
  var max = domain ? domain.curveMax : range[1];
  var new0 = x - span / 2;
  var new1 = x + span / 2;
  if (span > max - min) {
    new0 = min;
    new1 = max;
  } else {
    if (new0 < min) { new0 = min; new1 = new0 + span; }
    if (new1 > max) { new1 = max; new0 = new1 - span; }
  }
  metric._viewRange = [new0, new1];
  Plotly.relayout(chartEl, { 'xaxis.range': [new0, new1] });
}

function rankingCenterFocusedCharts() {
  var ticker = rankingState.focusedTicker;
  if (!ticker) return;
  rankingState.metrics.forEach(function (metric, idx) {
    var chartEl = document.getElementById('ranking-curve-' + idx);
    if (!chartEl || !chartEl._fullLayout) return;
    var raw = rankingState.values[ticker] ? rankingState.values[ticker][metric.name] : null;
    if (raw === null || raw === undefined || isNaN(Number(raw))) return;
    rankingPanToX(chartEl, metric, Number(raw), true);
  });
}

function rankingFocusTicker(ticker) {
  if (!ticker) return;
  rankingState.focusedTicker = (rankingState.focusedTicker === ticker) ? null : ticker;
  renderRankingCards();
  renderRankingResults();
  rankingCenterFocusedCharts();
}

// Single-line column header for the regular-view Ticker cards panel: one
// "Metric · max pts" label per selected metric plus a trailing Total column.
// Raw metric values and the per-cell "/ max pts" are not shown.
function renderRankingTickerPanelHeader() {
  var headerEl = rankingTickerPanelHeader;
  if (!headerEl) return;
  var metrics = rankingState.metrics;
  if (!metrics.length) {
    headerEl.classList.add('hidden');
    headerEl.innerHTML = '';
    return;
  }
  headerEl.classList.remove('hidden');
  var groups = metrics.map(function (mm) {
    var maxPts = Number(mm.maxPoints) || 10;
    return '<span class="w-32 shrink-0 text-right text-[8px] text-outline uppercase mono truncate">' +
      escapeHtml(mm.name) + ' <span class="text-outline-variant">· ' + maxPts + ' pts</span></span>';
  }).join('');
  var totalHeader = '<span class="w-32 shrink-0 text-right text-[8px] text-outline uppercase mono">Total</span>';
  headerEl.innerHTML = '<span class="w-14 shrink-0"></span>' + groups + totalHeader;
}

function renderRankingTickerCards(rows) {
  var advanced = !!rankingState.advancedOpen;
  if (!advanced) renderRankingTickerPanelHeader();
  var listEl = advanced
    ? document.querySelector('[data-ranking-advanced-ticker-list]')
    : rankingTickerPanelList;
  if (!listEl) return;
  var metrics = rankingState.metrics;
  var tickers = Array.from(rankingState.tickers);
  var searchTerm = (rankingState.tickerPanelSearch || '').trim().toLowerCase();

  if (!tickers.length || !metrics.length) {
    listEl.innerHTML = '<div class="px-md py-2 text-[9px] text-outline mono uppercase">No tickers selected</div>';
    return;
  }

  if (!rows) rows = rankingComputeResults();
  var filtered = rows.filter(function (r) {
    return !searchTerm || String(r.ticker).toLowerCase().indexOf(searchTerm) !== -1;
  });

  if (!filtered.length) {
    listEl.innerHTML = '<div class="px-md py-2 text-[9px] text-outline mono uppercase">No tickers match "' + escapeHtml(rankingState.tickerPanelSearch) + '".</div>';
    return;
  }

  var focused = rankingState.focusedTicker;

  listEl.innerHTML = filtered.map(function (row) {
    var isFocused = row.ticker === focused;
    var cls = 'w-full text-left px-sm py-0.5 border-t border-hairline first:border-t-0 transition-colors cursor-pointer flex items-center gap-sm' +
      (isFocused ? ' bg-primary/10' : ' hover:bg-surface-container-high');
    var inner = '';
    if (advanced) {
      var advName = rankingState.advancedMetricName;
      var m = metrics.find(function (x) { return x.name === advName; }) || metrics[0];
      var entry = row.perMetric[m.name];
      var raw = entry && !entry.missing ? Number(entry.raw) : null;
      var pts = entry && !entry.missing ? entry.points : null;
      var max = entry ? entry.maxPoints : 0;
      var tickerSpan = '<span class="w-14 shrink-0 font-label-sm text-label-sm font-bold text-on-surface mono truncate">' + escapeHtml(row.ticker) + '</span>';
      // Advanced view: the docked TICKERS card is w-80, so rows use fixed-width
      // columns aligned with the Value/Pts header for every curve type.
      inner = tickerSpan +
        '<span class="w-20 shrink-0 text-right text-body-sm mono text-on-surface-variant truncate">' + (raw === null ? 'n/a' : String(raw)) + '</span>' +
        '<span class="w-32 shrink-0 text-right text-body-sm mono text-primary">' + (pts === null ? 'n/a' : Number(pts).toFixed(2) + ' / ' + max + ' pts') + '</span>';
    } else {
      // Regular view: points only per selected metric, then the total points
      // earned out of the total max at the end. Raw metric values are hidden.
      var tickerSpan = '<span class="w-14 shrink-0 font-label-sm text-label-sm font-bold text-on-surface mono truncate">' + escapeHtml(row.ticker) + '</span>';
      var groups = metrics.map(function (mm) {
        var e = row.perMetric[mm.name];
        var pts = e && !e.missing ? Number(e.points) : null;
        return '<span class="w-32 shrink-0 text-right text-body-sm mono text-primary">' + (pts === null ? 'n/a' : Number(pts).toFixed(2)) + '</span>';
      }).join('');
      var totalPts = Number(row.totalPoints) || 0;
      var totalMax = Number(row.totalMax) || 0;
      var totalSpan = '<span class="w-32 shrink-0 text-right text-body-sm mono text-on-surface font-bold">' + (totalMax > 0 ? totalPts.toFixed(2) + ' / ' + totalMax + ' pts' : 'n/a') + '</span>';
      inner = tickerSpan + groups + totalSpan;
    }
    return '<div class="' + cls + '" data-ranking-ticker-card="' + escapeHtml(row.ticker) + '">' + inner + '</div>';
  }).join('');
}

function renderRankingResults() {
  // The ranked results table was removed from the grid view (the bottom Ticker
  // cards panel already shows per-ticker points/max per metric + a trailing total
  // points out of max). The name is kept so the existing call sites (analyze,
  // data load, preset load, advanced back) still refresh the ranking output —
  // here it re-renders the Ticker cards, and the full-screen Results table when
  // that view is open.
  renderRankingTickerCards();
  if (rankingState.resultsOpen) renderRankingResultsTable();
}

// ── Full-screen Results table ──

function rankingResultsSortKey() {
  return rankingState.resultsSort && rankingState.resultsSort.key
    ? rankingState.resultsSort.key
    : 'totalPoints';
}

function rankingResultsSortDir() {
  return rankingState.resultsSort && rankingState.resultsSort.dir === 'asc' ? 1 : -1;
}

function rankingResultsSortArrow(dir) {
  return dir === 'asc' ? 'arrow_upward' : 'arrow_downward';
}

function rankingResultsCompare(a, b, key) {
  if (key === 'ticker') {
    return a.ticker.localeCompare(b.ticker);
  }

  var av;
  var bv;
  if (key === 'totalPoints') {
    av = Number(a.totalPoints) || 0;
    bv = Number(b.totalPoints) || 0;
  } else if (key === 'score') {
    av = Number(a.score) || 0;
    bv = Number(b.score) || 0;
  } else {
    // Metric column: missing values sort last.
    var ae = a.perMetric[key];
    var be = b.perMetric[key];
    av = ae && !ae.missing ? Number(ae.points) : -Infinity;
    bv = be && !be.missing ? Number(be.points) : -Infinity;
  }
  if (av === bv) return a.ticker.localeCompare(b.ticker);
  return av < bv ? -1 : 1;
}

function renderRankingResultsTable() {
  if (!rankingResultsHead || !rankingResultsBody) return;
  var metrics = rankingState.metrics;
  var tickers = Array.from(rankingState.tickers);

  if (rankingResultsStatus) {
    rankingResultsStatus.textContent = tickers.length + ' stocks / ' + metrics.length + ' metrics';
  }

  if (!tickers.length || !metrics.length) {
    rankingResultsHead.innerHTML = '';
    rankingResultsBody.innerHTML = '<tr><td colspan="2" class="px-md py-3 text-[10px] text-outline mono uppercase">' +
      (tickers.length ? 'No metrics selected' : 'No tickers selected') + '</td></tr>';
    return;
  }

  var key = rankingResultsSortKey();
  var dir = rankingResultsSortDir();

  var headHtml = '';
  var tickerActive = key === 'ticker';
  headHtml += '<th class="sticky top-0 z-10 bg-surface-container-high px-sm py-1 border-b border-hairline text-left">' +
    '<button type="button" data-ranking-sort="ticker" class="inline-flex items-center gap-1 font-label-md text-label-md uppercase mono ' +
    (tickerActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary') + '">Ticker ' +
    (tickerActive ? '<span class="material-symbols-outlined text-[12px]">' + rankingResultsSortArrow(rankingState.resultsSort.dir) + '</span>' : '') +
    '</button></th>';

  metrics.forEach(function (mm) {
    var maxPts = Number(mm.maxPoints) || 10;
    var active = key === mm.name;
    headHtml += '<th class="sticky top-0 z-10 bg-surface-container-high px-sm py-1 border-b border-hairline text-right">' +
      '<button type="button" data-ranking-sort="' + escapeHtml(mm.name) + '" class="inline-flex items-center gap-1 font-label-md text-label-md uppercase mono ' +
      (active ? 'text-primary' : 'text-on-surface-variant hover:text-primary') + '">' +
      escapeHtml(mm.name) + ' <span class="text-outline-variant">· ' + maxPts + ' pts</span>' +
      (active ? ' <span class="material-symbols-outlined text-[12px]">' + rankingResultsSortArrow(rankingState.resultsSort.dir) + '</span>' : '') +
      '</button></th>';
  });

  var totalActive = key === 'totalPoints' || key === 'score';
  var totalModeLabel = key === 'score' ? 'Score' : 'Pts';
  headHtml += '<th class="sticky top-0 z-10 bg-surface-container-high px-sm py-1 border-b border-hairline text-right">' +
    '<button type="button" data-ranking-sort="total" class="inline-flex items-center gap-1 font-label-md text-label-md uppercase mono ' +
    (totalActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary') + '">' +
    'Total <span class="text-outline-variant">· ' + totalModeLabel + '</span>' +
    (totalActive ? ' <span class="material-symbols-outlined text-[12px]">' + rankingResultsSortArrow(rankingState.resultsSort.dir) + '</span>' : '') +
    '</button></th>';

  rankingResultsHead.innerHTML = '<tr>' + headHtml + '</tr>';

  var rows = rankingComputeResults();
  rows.sort(function (a, b) {
    return rankingResultsCompare(a, b, key) * dir;
  });

  rankingResultsBody.innerHTML = rows.map(function (row) {
    var cells = '<td class="px-sm py-1 border-b border-hairline text-left font-label-sm text-label-sm font-bold text-on-surface mono">' + escapeHtml(row.ticker) + '</td>';
    metrics.forEach(function (mm) {
      var e = row.perMetric[mm.name];
      var pts = e && !e.missing ? Number(e.points) : null;
      cells += '<td class="px-sm py-1 border-b border-hairline text-right text-body-sm mono ' +
        (pts === null ? 'text-outline-variant' : 'text-primary') + '">' +
        (pts === null ? 'n/a' : Number(pts).toFixed(2)) + '</td>';
    });
    var totalPts = Number(row.totalPoints) || 0;
    var totalMax = Number(row.totalMax) || 0;
    cells += '<td class="px-sm py-1 border-b border-hairline text-right text-body-sm mono text-on-surface font-bold">' +
      (totalMax > 0 ? totalPts.toFixed(2) + ' / ' + totalMax + ' pts' : 'n/a') + '</td>';
    return '<tr>' + cells + '</tr>';
  }).join('');
}

function setRankingResultsSort(key) {
  var sort = rankingState.resultsSort;
  if (sort.key === key) {
    sort.dir = sort.dir === 'asc' ? 'desc' : 'asc';
  } else {
    sort.key = key;
    sort.dir = key === 'ticker' ? 'asc' : 'desc';
  }
  renderRankingResultsTable();
}

function cycleRankingResultsTotalSort() {
  // "By max point" offers both orderings: total points earned and normalized
  // score (0-100). Clicking the Total header cycles through all four states.
  var sort = rankingState.resultsSort;
  if (sort.key === 'totalPoints') {
    if (sort.dir === 'desc') { sort.key = 'totalPoints'; sort.dir = 'asc'; }
    else { sort.key = 'score'; sort.dir = 'desc'; }
  } else if (sort.key === 'score') {
    if (sort.dir === 'desc') { sort.key = 'score'; sort.dir = 'asc'; }
    else { sort.key = 'totalPoints'; sort.dir = 'desc'; }
  } else {
    sort.key = 'totalPoints';
    sort.dir = 'desc';
  }
  renderRankingResultsTable();
}

function openRankingResults() {
  // Results replaces the whole ranking grid, so close the advanced view first.
  if (rankingState.advancedOpen) closeRankingAdvanced();
  rankingState.resultsOpen = true;

  if (rankingMainGrid) rankingMainGrid.classList.add('hidden');
  if (rankingResultsView) rankingResultsView.classList.remove('hidden');

  renderBreadcrumbs();
  renderRankingResultsTable();
  if (!Object.keys(rankingState.values).length && rankingState.tickers.size && rankingState.metrics.length) {
    loadRankingData();
  }
}

function closeRankingResults() {
  rankingState.resultsOpen = false;
  if (rankingResultsView) rankingResultsView.classList.add('hidden');
  if (rankingMainGrid) rankingMainGrid.classList.remove('hidden');
  renderBreadcrumbs();
  renderRankingTab();
}

// ── Data loading + presets ──

function setRankingView(view) {
  if (view !== 'tickers' && view !== 'metrics' && view !== 'presets') view = 'tickers';
  rankingState.view = view;

  if (rankingTickersView) rankingTickersView.classList.toggle('hidden', view !== 'tickers');
  if (rankingMetricsView) rankingMetricsView.classList.toggle('hidden', view !== 'metrics');
  if (rankingPresetsView) rankingPresetsView.classList.toggle('hidden', view !== 'presets');

  document.querySelectorAll('.ranking-view-switch[data-ranking-view]').forEach(function (btn) {
    var active = btn.dataset.rankingView === view;
    btn.classList.toggle('text-primary', active);
    btn.classList.toggle('bg-primary/10', active);
    btn.classList.toggle('text-on-surface-variant', !active);
  });

  if (view === 'tickers') {
    renderRankingTickerList();
  } else if (view === 'metrics') {
    renderRankingMetricList();
  } else if (view === 'presets') {
    renderRankingPresetSelect();
  }
}

function collapseAllRankingCards() {
  rankingState.expandedMetric = null;
  renderRankingCards();
  renderRankingMetricList();
}

function renderRankingTab() {
  setRankingView(rankingState.view);
  renderRankingCards();
  renderRankingResults();
}

function initRankingTab() {
  if (!rankingState.seeded) {
    rankingState.seeded = true;
    state.importList.forEach(function (ticker) { rankingState.tickers.add(ticker); });
  }
  renderRankingTab();
  if (rankingState.tickers.size && rankingState.metrics.length && Object.keys(rankingState.values).length === 0) {
    loadRankingData();
  }
}

async function loadRankingData() {
  var tickers = Array.from(rankingState.tickers);
  var metrics = rankingState.metrics.map(function (m) { return { name: m.name, formula: m.formula }; });
  if (!tickers.length || !metrics.length) {
    rankingState.values = {};
    rankingState.metrics.forEach(function (m) { m._viewRange = null; });
    renderRankingCards();
    renderRankingResults();
    return;
  }

  rankingState.loading = true;
  var requestId = ++rankingState.lastRequestId;
  if (rankingStatus) rankingStatus.textContent = 'Analyzing...';

  try {
    if (!window.finforge) throw new Error('Electron bridge unavailable');
    var result = await window.finforge.computeRanking({ tickers: tickers, metrics: metrics });
    if (requestId !== rankingState.lastRequestId) return;
    if (!result || result.ok !== true) {
      throw new Error((result && result.error) || 'Ranking computation failed');
    }
    rankingState.values = result.values || {};
    rankingState.error = '';
  } catch (error) {
    rankingState.values = {};
    rankingState.error = error && error.message ? error.message : String(error);
  }

  rankingState.loading = false;
  if (rankingStatus) {
    rankingStatus.textContent = rankingState.error
      ? 'Error: ' + rankingState.error
      : rankingState.tickers.size + ' stocks / ' + rankingState.metrics.length + ' metrics';
  }
  rankingState.metrics.forEach(function (m) { m._viewRange = null; });
  renderRankingCards();
  renderRankingResults();
}

async function loadRankingPresetsFromDisk() {
  try {
    if (!window.finforge) return;
    var result = await window.finforge.loadRankingPresets();
    rankingState.presets = (result && result.ok && Array.isArray(result.presets)) ? result.presets : [];
  } catch (error) {
    rankingState.presets = [];
  }
  renderRankingPresetSelect();
}

async function saveRankingPresetsToDisk() {
  try {
    if (!window.finforge) return;
    await window.finforge.saveRankingPresets(rankingState.presets);
  } catch (error) {
    setRankingPresetStatus('Preset save failed: ' + (error.message || error), true);
  }
}

function renderRankingPresetSelect() {
  if (!rankingPresetSelect) return;
  rankingPresetSelect.innerHTML = '<option value="">Select a preset…</option>' + rankingState.presets.map(function (preset) {
    return '<option value="' + escapeHtml(preset.id) + '">' + escapeHtml(preset.name || preset.id) + '</option>';
  }).join('');
  if (rankingState.activePresetId) rankingPresetSelect.value = rankingState.activePresetId;
}

function setRankingPresetStatus(message, isError) {
  if (rankingPresetStatusEl) {
    rankingPresetStatusEl.textContent = message || '';
    rankingPresetStatusEl.classList.toggle('text-error', !!isError);
    rankingPresetStatusEl.classList.toggle('text-outline', !isError);
  }
  if (rankingStatus) rankingStatus.textContent = message || '';
}

function rankingPresetFromCurrent() {
  return {
    id: rankingState.activePresetId || ('preset_' + Date.now()),
    name: (rankingPresetName && rankingPresetName.value.trim()) ? rankingPresetName.value.trim() : 'Untitled',
    tickers: Array.from(rankingState.tickers),
    metrics: rankingState.metrics,
    updatedAt: new Date().toISOString(),
  };
}

function rankingApplyPreset(preset) {
  if (!preset) return;
  rankingState.tickers = new Set(Array.isArray(preset.tickers) ? preset.tickers : []);
  rankingState.metrics = (Array.isArray(preset.metrics) ? preset.metrics : []).map(rankingNormalizeMetric);
  rankingState.activePresetId = preset.id || null;
  rankingState.values = {};
  rankingState.expandedMetric = null;
  if (rankingPresetName) rankingPresetName.value = preset.name || '';
  renderRankingTab();
  loadRankingData();
  setRankingPresetStatus('Loaded preset "' + (preset.name || 'Untitled') + '".');
}

function rankingNewPreset() {
  rankingState.activePresetId = null;
  if (rankingPresetName) {
    rankingPresetName.value = '';
    rankingPresetName.focus();
  }
  renderRankingPresetSelect();
  setRankingPresetStatus('New preset started — configure tickers and metrics, then save.');
}

async function rankingSavePreset() {
  var name = rankingPresetName ? rankingPresetName.value.trim() : '';
  if (!name) {
    setRankingPresetStatus('Enter a preset name before saving.', true);
    if (rankingPresetName) rankingPresetName.focus();
    return;
  }

  var current = rankingPresetFromCurrent();

  // When creating a new preset, guard against accidental name duplicates.
  if (!rankingState.activePresetId) {
    var duplicate = rankingState.presets.find(function (p) {
      return String(p.name || '').trim().toLowerCase() === name.toLowerCase();
    });
    if (duplicate) {
      var overwrite = window.confirm('A preset named "' + name + '" already exists. Overwrite it?');
      if (!overwrite) return;
      current.id = duplicate.id;
    }
  }

  var index = rankingState.presets.findIndex(function (p) { return p.id === current.id; });
  if (index >= 0) rankingState.presets[index] = current;
  else rankingState.presets.push(current);

  rankingState.activePresetId = current.id;
  if (rankingPresetName) rankingPresetName.value = current.name;
  await saveRankingPresetsToDisk();
  renderRankingPresetSelect();
  setRankingPresetStatus('Preset "' + current.name + '" saved.');
}

async function rankingDeletePreset() {
  var id = rankingState.activePresetId || (rankingPresetSelect ? rankingPresetSelect.value : '');
  var preset = rankingState.presets.find(function (p) { return p.id === id; });
  if (!id || !preset) {
    setRankingPresetStatus('Select a preset to delete.', true);
    return;
  }
  if (!window.confirm('Delete preset "' + (preset.name || 'Untitled') + '"?')) return;

  rankingState.presets = rankingState.presets.filter(function (p) { return p.id !== id; });
  if (rankingState.activePresetId === id) rankingState.activePresetId = null;
  if (rankingPresetName) rankingPresetName.value = '';
  await saveRankingPresetsToDisk();
  renderRankingPresetSelect();
  setRankingPresetStatus('Preset "' + (preset.name || 'Untitled') + '" deleted.');
}

function viewRankingMetric(name) {
  if (!name) return;
  var index = rankingState.metrics.findIndex(function (m) { return m.name === name; });
  if (index < 0) {
    rankingState.metrics.push(rankingNormalizeMetric({ name: name }));
    rankingState.expandedMetric = name;
  } else {
    rankingState.expandedMetric = (rankingState.expandedMetric === name) ? null : name;
  }
  renderRankingMetricList();
  renderRankingCards();
  loadRankingData();
}

function removeRankingMetric(name) {
  if (!name) return;
  var index = rankingState.metrics.findIndex(function (m) { return m.name === name; });
  if (index >= 0) {
    if (rankingState.expandedMetric === name) rankingState.expandedMetric = null;
    rankingState.metrics.splice(index, 1);
  }
  renderRankingMetricList();
  renderRankingCards();
  loadRankingData();
}

function removeAllRankingMetrics() {
  rankingState.metrics = [];
  rankingState.expandedMetric = null;
  renderRankingMetricList();
  renderRankingCards();
  loadRankingData();
}

// ── Ranking Advanced single-metric view ──

function closeRankingAdvancedDropdown() {
  rankingState.advancedSearch = '';
  if (rankingAdvancedMetricSearch) rankingAdvancedMetricSearch.value = '';
  if (rankingAdvancedDropdownMenu) rankingAdvancedDropdownMenu.classList.add('hidden');
}

function renderRankingAdvancedMetricList() {
  if (!rankingAdvancedMetricList) return;
  var searchTerm = rankingState.advancedSearch.trim().toLowerCase();
  var matchesSearch = function (name) {
    if (!searchTerm) return true;
    return String(name).toLowerCase().indexOf(searchTerm) !== -1;
  };

  var activeNames = new Set(rankingState.metrics.map(function (m) { return m.name; }));
  var current = rankingState.advancedMetricName;

  var metricRow = function (name) {
    var isCurrent = name === current;
    var isAdded = activeNames.has(name);
    return '<div class="w-full text-left px-md py-1 transition-colors flex items-center justify-between gap-md cursor-pointer hover:bg-primary/10" data-advanced-metric="' + escapeHtml(name) + '">' +
      '<div class="min-w-0">' +
        '<div class="text-body-sm text-on-surface mono truncate">' + escapeHtml(name) + '</div>' +
        (isAdded ? '<div class="text-[9px] text-outline mono uppercase">added</div>' : '') +
      '</div>' +
      (isCurrent ? '<span class="material-symbols-outlined text-[14px] text-primary shrink-0">check</span>' : '') +
    '</div>';
  };

  var folderGroup = function (folderKey, folderLabel, rowsHtml, count) {
    return '<div class="border-b border-hairline">' +
      '<div class="px-md py-1 bg-surface-container-low flex items-center gap-sm select-none">' +
        (folderKey === 'unassigned'
          ? ''
          : '<span class="material-symbols-outlined text-[14px] text-secondary shrink-0">folder</span>') +
        '<span class="font-label-sm text-label-sm text-on-surface uppercase mono truncate">' + escapeHtml(folderLabel) + '</span>' +
        '<span class="text-[9px] text-outline mono">' + count + '</span>' +
      '</div>' +
      '<div class="divide-y divide-hairline">' + rowsHtml + '</div>' +
    '</div>';
  };

  var html = '';
  var unassigned = getUnassignedMetrics().filter(matchesSearch);
  if (unassigned.length) {
    html += folderGroup('unassigned', 'Unassigned', unassigned.map(metricRow).join(''), unassigned.length);
  }
  getAllFolders().forEach(function (folder) {
    var folderMetrics = getMetricsInFolder(folder).filter(matchesSearch);
    if (!folderMetrics.length) return;
    html += folderGroup(folder, folder, folderMetrics.map(metricRow).join(''), folderMetrics.length);
  });

  if (!html) {
    html = '<div class="px-md py-3 text-[10px] text-outline mono uppercase">No metrics match "' + escapeHtml(rankingState.advancedSearch.trim()) + '".</div>';
  }
  rankingAdvancedMetricList.innerHTML = html;
}

function renderRankingAdvancedDropdown() {
  var name = rankingState.advancedMetricName;
  if (rankingAdvancedDropdownLabel) rankingAdvancedDropdownLabel.textContent = name || 'Select metric';
  if (rankingAdvancedStatus) {
    rankingAdvancedStatus.textContent = name
      ? rankingState.tickers.size + ' stocks / 1 metric'
      : 'Select a metric';
  }
  renderRankingAdvancedMetricList();
}

function toggleRankingAdvancedDropdown() {
  if (!rankingAdvancedDropdownMenu) return;
  var wasOpen = !rankingAdvancedDropdownMenu.classList.contains('hidden');
  closeRankingAdvancedDropdown();
  if (!wasOpen) {
    renderRankingAdvancedMetricList();
    rankingAdvancedDropdownMenu.classList.remove('hidden');
  }
}

function selectRankingAdvancedMetric(name) {
  if (!name) return;
  rankingState.advancedMetricName = name;
  if (!rankingState.metrics.some(function (m) { return m.name === name; })) {
    rankingState.metrics.push(rankingNormalizeMetric({ name: name }));
  }
  rankingState.expandedMetric = name;
  closeRankingAdvancedDropdown();
  renderRankingAdvancedDropdown();
  renderRankingCards();
  if (!Object.keys(rankingState.values).length) loadRankingData();
}

function openRankingAdvanced() {
  if (rankingState.resultsOpen) closeRankingResults();

  if (!rankingState.advancedMetricName || !rankingState.metrics.some(function (m) { return m.name === rankingState.advancedMetricName; })) {
    rankingState.advancedMetricName =
      rankingState.expandedMetric ||
      (rankingState.metrics[0] && rankingState.metrics[0].name) ||
      (state.ratios && Object.keys(state.ratios)[0]) ||
      null;
  }

  if (rankingState.advancedMetricName && !rankingState.metrics.some(function (m) { return m.name === rankingState.advancedMetricName; })) {
    rankingState.metrics.push(rankingNormalizeMetric({ name: rankingState.advancedMetricName }));
  }

  rankingState.advancedOpen = true;
  if (rankingState.advancedMetricName) rankingState.expandedMetric = rankingState.advancedMetricName;

  renderBreadcrumbs();
  if (rankingMainGrid) rankingMainGrid.classList.add('ranking-advanced');
  if (rankingLeftPanel) rankingLeftPanel.classList.add('hidden');
  if (rankingToolbar) rankingToolbar.classList.add('hidden');
  if (rankingTickerPanel) rankingTickerPanel.classList.add('hidden');
  if (rankingAdvancedHeader) rankingAdvancedHeader.classList.remove('hidden');

  closeRankingAdvancedDropdown();
  renderRankingAdvancedDropdown();
  renderRankingCards();
  renderRankingTickerCards();

  if (!Object.keys(rankingState.values).length && rankingState.tickers.size && rankingState.metrics.length) {
    loadRankingData();
  }
}

function closeRankingAdvanced() {
  rankingState.advancedOpen = false;
  renderBreadcrumbs();
  if (rankingMainGrid) rankingMainGrid.classList.remove('ranking-advanced');
  if (rankingLeftPanel) rankingLeftPanel.classList.remove('hidden');
  if (rankingToolbar) rankingToolbar.classList.remove('hidden');
  if (rankingTickerPanel) rankingTickerPanel.classList.remove('hidden');
  if (rankingAdvancedHeader) rankingAdvancedHeader.classList.add('hidden');
  closeRankingAdvancedDropdown();
  renderRankingCards();
  renderRankingResults();
  renderRankingMetricList();
}

// ── Ranking event listeners ──

document.querySelectorAll('.ranking-view-switch[data-ranking-view]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    setRankingView(btn.dataset.rankingView);
  });
});

if (rankingTickerList) {
  rankingTickerList.addEventListener('click', function (event) {
    var row = event.target.closest('[data-ranking-ticker]');
    if (!row) return;
    var ticker = row.dataset.rankingTicker;
    if (rankingState.tickers.has(ticker)) {
      rankingState.tickers.delete(ticker);
    } else {
      rankingState.tickers.add(ticker);
    }
    renderRankingTickerList();
    loadRankingData();
  });
}

if (rankingTickerListSearch) {
  rankingTickerListSearch.addEventListener('input', function () {
    rankingState.tickerSearch = rankingTickerListSearch.value.trim();
    renderRankingTickerList();
  });
}

if (rankingTickerAll) {
  rankingTickerAll.addEventListener('click', function () {
    state.importList.forEach(function (ticker) { rankingState.tickers.add(ticker); });
    renderRankingTickerList();
    loadRankingData();
  });
}

if (rankingTickerRemoveAll) {
  rankingTickerRemoveAll.addEventListener('click', function () {
    rankingState.tickers.clear();
    renderRankingTickerList();
    loadRankingData();
  });
}

if (rankingMetricList) {
  rankingMetricList.addEventListener('click', function (event) {
    var removeIcon = event.target.closest('[data-ranking-remove]');
    if (removeIcon) {
      removeRankingMetric(removeIcon.dataset.rankingRemove);
      return;
    }
    var row = event.target.closest('[data-ranking-metric]');
    if (!row) return;
    viewRankingMetric(row.dataset.rankingMetric);
  });
}

if (rankingMetricListSearch) {
  rankingMetricListSearch.addEventListener('input', function () {
    rankingState.metricSearch = rankingMetricListSearch.value.trim();
    renderRankingMetricList();
  });
}

if (rankingMetricShowSelected) {
  rankingMetricShowSelected.addEventListener('click', function () {
    rankingState.metricShowSelected = !rankingState.metricShowSelected;
    renderRankingMetricList();
  });
}

if (rankingMetricRemoveAll) {
  rankingMetricRemoveAll.addEventListener('click', removeAllRankingMetrics);
}

if (rankingCards) {
  rankingCards.addEventListener('click', function (event) {
    var card = event.target.closest('[data-ranking-card]');
    if (!card) return;
    var index = Number(card.dataset.rankingCard);
    var metric = rankingState.metrics[index];
    if (!metric) return;

    var toggleBtn = event.target.closest('[data-ranking-toggle]');
    if (toggleBtn) {
      var toggleIndex = Number(toggleBtn.dataset.rankingToggle);
      var toggleMetric = rankingState.metrics[toggleIndex];
      if (toggleMetric) {
        rankingState.expandedMetric = (rankingState.expandedMetric === toggleMetric.name) ? null : toggleMetric.name;
        renderRankingCards();
      }
      return;
    }

    var curveButton = event.target.closest('[data-ranking-curve]');
    if (curveButton) {
      var prevCurveType = metric.curveType;
      metric.curveType = curveButton.dataset.rankingCurve;
      if (metric.curveType !== 'gaussian' && metric.direction === 'target') metric.direction = 'higher';
      if (metric.curveType === 'step' && (!metric.params.thresholds || !metric.params.thresholds.length)) {
        var stepUniverse = rankingSortedUniverse(metric.name);
        var stepLow = rankingQuantile(stepUniverse, 0.333);
        var stepHigh = rankingQuantile(stepUniverse, 0.667);
        var stepMax = Number(metric.maxPoints) || 10;
        if (stepLow !== null && stepHigh !== null && stepHigh > stepLow) {
          metric.params.thresholds = [stepLow, stepHigh];
          metric.params.points = [0, stepMax / 2, stepMax];
        }
      }
      if (metric.curveType === 'custom' && !rankingCustomSortedPoints(metric.params.customPoints).length) {
        rankingInitCustomPoints(metric, prevCurveType);
      }
      renderRankingCards();
      renderRankingResults();
      return;
    }

    var dirButton = event.target.closest('[data-ranking-dir]');
    if (dirButton) {
      metric.direction = dirButton.dataset.rankingDir;
      renderRankingCards();
      renderRankingResults();
      return;
    }

    var deletePointBtn = event.target.closest('[data-custom-point-delete]');
    if (deletePointBtn) {
      var delIndex = Number(deletePointBtn.dataset.customPointDelete);
      var delPoints = rankingCustomSortedPoints(metric.params.customPoints || []);
      if (delPoints.length > 2 && delIndex >= 0 && delIndex < delPoints.length) {
        delPoints.splice(delIndex, 1);
        metric.params.customPoints = delPoints;
        renderRankingCards();
        renderRankingResults();
      }
      return;
    }

    var deleteStepThresholdBtn = event.target.closest('[data-step-threshold-delete]');
    if (deleteStepThresholdBtn) {
      var delTIdx = Number(deleteStepThresholdBtn.dataset.stepThresholdDelete);
      var delThr = (metric.params.thresholds || []).slice();
      var delPts = (metric.params.points || []).slice();
      if (delTIdx >= 0 && delTIdx < delThr.length) {
        delThr.splice(delTIdx, 1);
        if (delPts.length > 1) delPts.splice(delTIdx, 1);
        metric.params.thresholds = delThr;
        metric.params.points = delPts;
        rankingNormalizeStepParams(metric);
        renderRankingCards();
        renderRankingResults();
      }
      return;
    }

    var tickerCard = event.target.closest('[data-ranking-ticker-card]');
    if (tickerCard) {
      rankingFocusTicker(tickerCard.dataset.rankingTickerCard);
      return;
    }
  });

  rankingCards.addEventListener('input', function (event) {
    var card = event.target.closest('[data-ranking-card]');
    if (!card) return;
    var index = Number(card.dataset.rankingCard);
    var metric = rankingState.metrics[index];
    if (!metric) return;

    if (event.target.matches('[data-ranking-advanced-ticker-search]')) {
      rankingState.tickerPanelSearch = event.target.value.trim();
      renderRankingTickerCards();
      return;
    }

    if (event.target.matches('[data-ranking-max]')) {
      var maxValue = parseFloat(event.target.value);
      if (isFinite(maxValue) && maxValue > 0) metric.maxPoints = maxValue;
    } else if (event.target.matches('[data-ranking-param]')) {
      var key = event.target.dataset.rankingParam;
      metric.params[key] = event.target.value === '' ? null : parseFloat(event.target.value);
    } else if (event.target.matches('[data-custom-point-x]')) {
      var cXIdx = Number(event.target.dataset.customPointX);
      var cX = parseFloat(event.target.value);
      var cPts = metric.params.customPoints || [];
      if (cPts[cXIdx] && isFinite(cX)) cPts[cXIdx].x = cX;
    } else if (event.target.matches('[data-custom-point-y]')) {
      var cYIdx = Number(event.target.dataset.customPointY);
      var cY = parseFloat(event.target.value);
      var cMax = Number(metric.maxPoints) || 10;
      var cPtsY = metric.params.customPoints || [];
      if (cPtsY[cYIdx] && isFinite(cY)) cPtsY[cYIdx].y = Math.max(0, Math.min(cMax, cY));
    } else if (event.target.matches('[data-step-threshold-idx]')) {
      var tIdx = Number(event.target.dataset.stepThresholdIdx);
      var tVal = parseFloat(event.target.value);
      var thr = (metric.params.thresholds || []).slice();
      if (tIdx >= 0 && tIdx < thr.length && isFinite(tVal)) thr[tIdx] = tVal;
      metric.params.thresholds = thr;
    } else if (event.target.matches('[data-step-point-idx]')) {
      var pIdx = Number(event.target.dataset.stepPointIdx);
      var pVal = parseFloat(event.target.value);
      var pMax = Number(metric.maxPoints) || 10;
      var ptsArr = (metric.params.points || []).slice();
      if (pIdx >= 0 && pIdx < ptsArr.length && isFinite(pVal)) ptsArr[pIdx] = Math.max(0, Math.min(pMax, pVal));
      metric.params.points = ptsArr;
    } else if (event.target.matches('[data-ranking-smoothness]') || event.target.matches('[data-ranking-smoothness-num]')) {
      var pct = parseInt(event.target.value, 10);
      if (!isFinite(pct)) pct = 50;
      pct = Math.max(0, Math.min(100, pct));
      metric.params.smoothness = pct / 100;
      card.querySelectorAll('[data-ranking-smoothness]').forEach(function (el) {
        if (el !== event.target) el.value = pct;
      });
      card.querySelectorAll('[data-ranking-smoothness-num]').forEach(function (el) {
        if (el !== event.target) el.value = pct;
      });
    } else {
      return;
    }

    drawRankingCurve(index);
    renderRankingResults();
  });

  // Re-sort/normalize + re-render editors on commit so the row order stays in
  // sync without stealing focus while the user is typing.
  rankingCards.addEventListener('change', function (event) {
    var card = event.target.closest('[data-ranking-card]');
    if (!card) return;
    var index = Number(card.dataset.rankingCard);
    var metric = rankingState.metrics[index];
    if (!metric) return;

    if (event.target.matches('[data-custom-point-x]') || event.target.matches('[data-custom-point-y]')) {
      metric.params.customPoints = rankingCustomSortedPoints(metric.params.customPoints || []);
      renderRankingCards();
      renderRankingResults();
    } else if (event.target.matches('[data-step-threshold-idx]') || event.target.matches('[data-step-point-idx]')) {
      rankingNormalizeStepParams(metric);
      renderRankingCards();
      renderRankingResults();
    }
  });

  // Hovering an editor row/cell triggers the matching hover box on the chart.
  rankingCards.addEventListener('mouseover', function (event) {
    var row = event.target.closest('[data-custom-point-row], [data-step-threshold-idx], [data-step-point-idx]');
    if (!row || row.contains(event.relatedTarget)) return;
    var card = event.target.closest('[data-ranking-card]');
    if (!card) return;
    var index = Number(card.dataset.rankingCard);
    var chartEl = document.getElementById('ranking-curve-' + index);
    if (!chartEl || !chartEl._fullLayout) return;
    var handles = rankingHandles[index] || [];
    var handleIndex = -1;
    if (row.hasAttribute('data-custom-point-row')) {
      var rIdx = Number(row.getAttribute('data-custom-point-row'));
      handleIndex = handles.findIndex(function (h) { return h.param === 'customPoints' && h.index === rIdx; });
    } else if (row.hasAttribute('data-step-threshold-idx')) {
      var tRowIdx = Number(row.getAttribute('data-step-threshold-idx'));
      handleIndex = handles.findIndex(function (h) { return h.param === 'thresholds' && h.index === tRowIdx; });
    } else if (row.hasAttribute('data-step-point-idx')) {
      var pRowIdx = Number(row.getAttribute('data-step-point-idx'));
      handleIndex = handles.findIndex(function (h) { return h.param === 'points' && h.index === pRowIdx; });
    }
    if (handleIndex >= 0 && typeof Plotly !== 'undefined' && Plotly.Fx) {
      var hoverMetric = rankingState.metrics[index];
      var hoverHandle = handles[handleIndex];
      if (hoverMetric && hoverHandle) rankingPanToX(chartEl, hoverMetric, hoverHandle.x, true);
      Plotly.Fx.hover(chartEl, [{ curveNumber: 2, pointNumber: handleIndex }]);
    }
  });

  rankingCards.addEventListener('mouseout', function (event) {
    var row = event.target.closest('[data-custom-point-row], [data-step-threshold-idx], [data-step-point-idx]');
    if (!row || row.contains(event.relatedTarget)) return;
    var card = event.target.closest('[data-ranking-card]');
    if (!card) return;
    var index = Number(card.dataset.rankingCard);
    var chartEl = document.getElementById('ranking-curve-' + index);
    if (chartEl && chartEl._fullLayout && typeof Plotly !== 'undefined' && Plotly.Fx) {
      Plotly.Fx.hover(chartEl, []);
    }
  });
}

if (rankingTickerPanelSearch) {
  rankingTickerPanelSearch.addEventListener('input', function () {
    rankingState.tickerPanelSearch = rankingTickerPanelSearch.value.trim();
    renderRankingTickerCards();
  });
}

if (rankingTickerPanelList) {
  rankingTickerPanelList.addEventListener('click', function (event) {
    var row = event.target.closest('[data-ranking-ticker-card]');
    if (!row) return;
    rankingFocusTicker(row.dataset.rankingTickerCard);
  });
}

if (rankingRun) rankingRun.addEventListener('click', function () { loadRankingData(); });
if (rankingCollapseAll) rankingCollapseAll.addEventListener('click', function () { collapseAllRankingCards(); });
if (rankingPresetNew) rankingPresetNew.addEventListener('click', function () { rankingNewPreset(); });
if (rankingPresetSave) rankingPresetSave.addEventListener('click', function () { rankingSavePreset(); });
if (rankingPresetDelete) rankingPresetDelete.addEventListener('click', function () { rankingDeletePreset(); });
if (rankingPresetName) {
  rankingPresetName.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') { event.preventDefault(); rankingSavePreset(); }
  });
}

if (rankingPresetSelect) {
  rankingPresetSelect.addEventListener('change', function () {
    var id = rankingPresetSelect.value;
    if (!id) return;
    var preset = rankingState.presets.find(function (p) { return p.id === id; });
    if (preset) rankingApplyPreset(preset);
  });
}

// ── Ranking Advanced view listeners ──

if (rankingAdvanced) {
  rankingAdvanced.addEventListener('click', function () { openRankingAdvanced(); });
}

if (rankingAdvancedBack) {
  rankingAdvancedBack.addEventListener('click', function () { closeRankingAdvanced(); });
}

if (rankingResultsBtn) {
  rankingResultsBtn.addEventListener('click', function () { openRankingResults(); });
}

if (rankingResultsBack) {
  rankingResultsBack.addEventListener('click', function () { closeRankingResults(); });
}

if (rankingResultsHead) {
  rankingResultsHead.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-ranking-sort]');
    if (!btn) return;
    var key = btn.dataset.rankingSort;
    if (key === 'total') {
      cycleRankingResultsTotalSort();
    } else {
      setRankingResultsSort(key);
    }
  });
}

if (rankingAdvancedDropdownBtn) {
  rankingAdvancedDropdownBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    toggleRankingAdvancedDropdown();
  });
}

if (rankingAdvancedMetricSearch) {
  rankingAdvancedMetricSearch.addEventListener('input', function () {
    rankingState.advancedSearch = rankingAdvancedMetricSearch.value.trim();
    renderRankingAdvancedMetricList();
  });
}

if (rankingAdvancedMetricList) {
  rankingAdvancedMetricList.addEventListener('click', function (event) {
    var row = event.target.closest('[data-advanced-metric]');
    if (!row) return;
    selectRankingAdvancedMetric(row.dataset.advancedMetric);
  });
}

if (rankingAdvancedCreate) {
  rankingAdvancedCreate.addEventListener('click', function () {
    closeRankingAdvanced();
    setActivePage('ratios');
    setRatioForm();
  });
}

document.addEventListener('mousedown', function (event) {
  if (!rankingAdvancedDropdownMenu || rankingAdvancedDropdownMenu.classList.contains('hidden')) return;
  if (rankingAdvancedDropdownMenu.contains(event.target)) return;
  if (rankingAdvancedDropdownBtn && rankingAdvancedDropdownBtn.contains(event.target)) return;
  closeRankingAdvancedDropdown();
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') closeRankingAdvancedDropdown();
});

// ── Draggable curve handles: mouse interaction ──

if (rankingCards) {
  rankingCards.addEventListener('mousedown', function (event) {
    if (event.button !== 0) return;
    rankingPendingClick = null;
    var chartEl = event.target.closest('[data-ranking-chart]');
    if (!chartEl || !chartEl._fullLayout) return;
    var hit = rankingFindHandle(chartEl, event.clientX, event.clientY);
    if (hit) {
      event.preventDefault();
      event.stopPropagation();
      rankingDrag = { idx: hit.idx, handle: hit.handle, chartEl: chartEl };
      document.body.style.cursor = hit.handle.axis === 'x' ? 'ew-resize' : (hit.handle.axis === 'y' ? 'ns-resize' : 'move');
      document.body.style.userSelect = 'none';
      return;
    }
    var idx = Number(chartEl.dataset.rankingChart);
    var metric = rankingState.metrics[idx];
    if (!metric) return;
    var layout = chartEl._fullLayout;
    var range = (layout && layout.xaxis && layout.xaxis.range) ? [layout.xaxis.range[0], layout.xaxis.range[1]] : null;

    // For click-to-add curve types, defer point insertion until mouseup so a
    // click adds a point while a drag pans the x-axis.
    if (metric.curveType === 'custom' || metric.curveType === 'step') {
      rankingPendingClick = { idx: idx, x: event.clientX, y: event.clientY };
    }

    // Start a manual x-pan (Plotly's native drag is disabled to avoid conflicts).
    event.preventDefault();
    event.stopPropagation();
    rankingPan = { idx: idx, chartEl: chartEl, startClientX: event.clientX, range: range, bounds: rankingCurveBounds(metric) };
    chartEl.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, true);

  rankingCards.addEventListener('contextmenu', function (event) {
    var chartEl = event.target.closest('[data-ranking-chart]');
    if (!chartEl || !chartEl._fullLayout) return;
    var hit = rankingFindHandle(chartEl, event.clientX, event.clientY);
    if (!hit) return;
    var metric = rankingState.metrics[hit.idx];
    if (!metric) return;

    if (hit.handle.param === 'customPoints') {
      var customPoints = rankingCustomSortedPoints(metric.params.customPoints || []);
      if (customPoints.length <= 2) return;
      customPoints.splice(hit.handle.index, 1);
      metric.params.customPoints = customPoints;
    } else if (hit.handle.param === 'thresholds') {
      var thresholds = (metric.params.thresholds || []).slice();
      var points = (metric.params.points || []).slice();
      if (hit.handle.index < 0 || hit.handle.index >= thresholds.length) return;
      thresholds.splice(hit.handle.index, 1);
      if (points.length > 1) points.splice(hit.handle.index, 1);
      metric.params.thresholds = thresholds;
      metric.params.points = points;
    } else {
      return;
    }
    event.preventDefault();
    renderRankingCards();
    renderRankingResults();
  });
}

document.addEventListener('mousemove', function (event) {
  if (rankingPendingClick) {
    var pendingDx = event.clientX - rankingPendingClick.x;
    var pendingDy = event.clientY - rankingPendingClick.y;
    if (pendingDx * pendingDx + pendingDy * pendingDy > 16) rankingPendingClick = null;
  }

  if (rankingPan) {
    var pan = rankingPan;
    var panMetric = rankingState.metrics[pan.idx];
    var panLayout = pan.chartEl._fullLayout;
    if (panMetric && pan.range && pan.bounds && panLayout && panLayout.xaxis && panLayout.xaxis._length) {
      var pxPerData = panLayout.xaxis._length / (pan.range[1] - pan.range[0]);
      var dData = -(event.clientX - pan.startClientX) / pxPerData;
      var new0 = pan.range[0] + dData;
      var new1 = pan.range[1] + dData;
      var viewSpan = new1 - new0;
      if (viewSpan > pan.bounds[1] - pan.bounds[0]) {
        new0 = pan.bounds[0];
        new1 = pan.bounds[1];
      } else {
        if (new0 < pan.bounds[0]) { new0 = pan.bounds[0]; new1 = new0 + viewSpan; }
        if (new1 > pan.bounds[1]) { new1 = pan.bounds[1]; new0 = new1 - viewSpan; }
      }
      panMetric._viewRange = [new0, new1];
      Plotly.relayout(pan.chartEl, { 'xaxis.range': [new0, new1] });
    }
  }

  if (!rankingDrag) return;
  rankingApplyDrag(rankingDrag.chartEl, rankingDrag.handle, event.clientX, event.clientY);
  if (!rankingDragFrame) {
    rankingDragFrame = window.requestAnimationFrame(function () {
      rankingDragFrame = null;
      if (!rankingDrag) return;
      var idx = rankingDrag.idx;
      if (rankingState.metrics[idx]) {
        drawRankingCurve(idx);
        renderRankingResults();
      }
    });
  }
});

document.addEventListener('mouseup', function () {
  if (rankingPendingClick) {
    var pending = rankingPendingClick;
    rankingPendingClick = null;
    // Defer so Plotly internals settle before we mutate/re-render the chart.
    window.setTimeout(function () {
      var pendingMetric = rankingState.metrics[pending.idx];
      if (!pendingMetric) return;
      var pendingChart = document.getElementById('ranking-curve-' + pending.idx);
      var pendingAdded = null;
      if (pendingChart && pendingChart._fullLayout) {
        if (pendingMetric.curveType === 'custom') {
          pendingAdded = rankingAddCustomPoint(pendingMetric, pendingChart, pending.x, pending.y);
        } else if (pendingMetric.curveType === 'step') {
          pendingAdded = rankingAddStepThreshold(pendingMetric, pendingChart, pending.x, pending.y);
        }
      }
      if (pendingAdded) {
        renderRankingCards();
        renderRankingResults();
      }
    }, 0);
  }

  if (rankingPan) {
    if (rankingPan.chartEl) rankingPan.chartEl.style.cursor = '';
    rankingPan = null;
    document.body.style.userSelect = '';
    return;
  }

  if (!rankingDrag) return;
  var idx = rankingDrag.idx;
  rankingDrag = null;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
  if (rankingState.metrics[idx]) {
    renderRankingCards();
    renderRankingResults();
  }
});
