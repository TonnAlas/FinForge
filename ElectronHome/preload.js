const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('finforge', {
  version: '0.1.0',
  loadStatementCatalog() {
    return ipcRenderer.invoke('finforge:loadStatementCatalog');
  },
  loadImportList() {
    return ipcRenderer.invoke('finforge:loadImportList');
  },
  saveImportList(importList) {
    return ipcRenderer.invoke('finforge:saveImportList', importList);
  },
  searchTickerUniverse(query) {
    return ipcRenderer.invoke('finforge:searchTickerUniverse', query);
  },
  loadCompanyProfile(ticker) {
    return ipcRenderer.invoke('finforge:loadCompanyProfile', ticker);
  },
  loadStatementSettings() {
    return ipcRenderer.invoke('finforge:loadStatementSettings');
  },
  saveStatementSettings(settings) {
    return ipcRenderer.invoke('finforge:saveStatementSettings', settings);
  },
  importStatement(scope) {
    return ipcRenderer.invoke('finforge:importStatement', scope);
  },
  refreshRatiosSheet() {
    return ipcRenderer.invoke('finforge:refreshRatiosSheet');
  },
  loadRatios() {
    return ipcRenderer.invoke('finforge:loadRatios');
  },
  saveRatios(ratios) {
    return ipcRenderer.invoke('finforge:saveRatios', ratios);
  },
  loadSheetRatios() {
    return ipcRenderer.invoke('finforge:loadSheetRatios');
  },
  syncAssignedRatios(ratioNames) {
    return ipcRenderer.invoke('finforge:syncAssignedRatios', ratioNames);
  },
  getLauncherStatus() {
    return ipcRenderer.invoke('finforge:getLauncherStatus');
  },
  checkSystemHealth() {
    return ipcRenderer.invoke('finforge:checkSystemHealth');
  },
  openWorkbook() {
    return ipcRenderer.invoke('finforge:openWorkbook');
  },
  openProjectRoot() {
    return ipcRenderer.invoke('finforge:openProjectRoot');
  },
  openDataFolder() {
    return ipcRenderer.invoke('finforge:openDataFolder');
  },
  runSetupScript() {
    return ipcRenderer.invoke('finforge:runSetupScript');
  },
  runUninstallScript() {
    return ipcRenderer.invoke('finforge:runUninstallScript');
  },
  openImportWindow(options = {}) {
    return ipcRenderer.invoke('finforge:openImportWindow', options);
  },

  // ── Template System ──
  loadTemplates() {
    return ipcRenderer.invoke('finforge:loadTemplates');
  },
  saveTemplate(template) {
    return ipcRenderer.invoke('finforge:saveTemplate', template);
  },
  deleteTemplate(templateId) {
    return ipcRenderer.invoke('finforge:deleteTemplate', templateId);
  },
  loadTemplate(templateId) {
    return ipcRenderer.invoke('finforge:loadTemplate', templateId);
  },
  replaceWorkbookWithTemplate(templateId) {
    return ipcRenderer.invoke('finforge:replaceWorkbookWithTemplate', templateId);
  },
  saveExcelTemplate(templateId) {
    return ipcRenderer.invoke('finforge:saveExcelTemplate', templateId);
  },
  openTemplateExcelFile(excelFile) {
    return ipcRenderer.invoke('finforge:openTemplateExcelFile', excelFile);
  },
  openTemplateFolder() {
    return ipcRenderer.invoke('finforge:openTemplateFolder');
  },
  openExternalUrl(url) {
    return ipcRenderer.invoke('finforge:openExternalUrl', url);
  },

  // ── Research Paper Search ──
  searchResearchPapers(query, source) {
    return ipcRenderer.invoke('finforge:searchResearchPapers', query, source);
  },

  // ── Ticker Data Fetching & Status ──
  fetchTickerData(ticker) {
    return ipcRenderer.invoke('finforge:fetchTickerData', ticker);
  },
  checkTickerDataStatus(ticker) {
    return ipcRenderer.invoke('finforge:checkTickerDataStatus', ticker);
  },
  checkAllTickersDataStatus(tickers) {
    return ipcRenderer.invoke('finforge:checkAllTickersDataStatus', tickers);
  },
});
