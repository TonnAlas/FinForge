const launcherOpenWorkbookButton = document.getElementById('launcher-open-workbook');
const launcherOpenImportButton = document.getElementById('launcher-open-import');
const launcherOpenDataFolderButton = document.getElementById('launcher-open-data-folder');
const launcherOpenProjectFolderButton = document.getElementById('launcher-open-project-folder');
const launcherRunSetupButton = document.getElementById('launcher-run-setup');
const launcherRunUninstallButton = document.getElementById('launcher-run-uninstall');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function runLauncherAction(actionLabel, actionFn) {
  try {
    const result = await actionFn();

    if (result && result.ok === false) {
      throw new Error(result.error || `${actionLabel} failed`);
    }

  } catch (error) {
    void error;
  }
}

if (launcherOpenWorkbookButton) {
  launcherOpenWorkbookButton.addEventListener('click', () => runLauncherAction('Launch workbook', () => {
    if (!window.finforge || typeof window.finforge.openWorkbook !== 'function') {
      throw new Error('Workbook action is unavailable');
    }

    return window.finforge.openWorkbook();
  }));
}

if (launcherOpenImportButton) {
  launcherOpenImportButton.addEventListener('click', () => runLauncherAction('Open terminal', async () => {
    if (!window.finforge || typeof window.finforge.openImportWindow !== 'function') {
      throw new Error('Terminal action is unavailable');
    }

    return window.finforge.openImportWindow({ closeLauncher: false });
  }));
}

if (launcherOpenDataFolderButton) {
  launcherOpenDataFolderButton.addEventListener('click', () => runLauncherAction('Open data folder', () => {
    if (!window.finforge || typeof window.finforge.openDataFolder !== 'function') {
      throw new Error('Data folder action is unavailable');
    }

    return window.finforge.openDataFolder();
  }));
}

if (launcherOpenProjectFolderButton) {
  launcherOpenProjectFolderButton.addEventListener('click', () => runLauncherAction('Open project folder', () => {
    if (!window.finforge || typeof window.finforge.openProjectRoot !== 'function') {
      throw new Error('Project folder action is unavailable');
    }

    return window.finforge.openProjectRoot();
  }));
}

if (launcherRunSetupButton) {
  launcherRunSetupButton.addEventListener('click', () => runLauncherAction('Run setup.bat', () => {
    if (!window.finforge || typeof window.finforge.runSetupScript !== 'function') {
      throw new Error('Setup action is unavailable');
    }

    return window.finforge.runSetupScript();
  }));
}

if (launcherRunUninstallButton) {
  launcherRunUninstallButton.addEventListener('click', () => runLauncherAction('Run uninstall.bat', () => {
    if (!window.finforge || typeof window.finforge.runUninstallScript !== 'function') {
      throw new Error('Uninstall action is unavailable');
    }

    return window.finforge.runUninstallScript();
  }));
}

// --- System Health Check ---
// Immediately show "Checking system..." with a pulsing indicator, then
// switch to "Setup Completed" (green/disabled) or back to "Run setup".
// When checks fail, render a collapsible report panel with details.

var launcherHealthReportContainer = document.getElementById('launcher-health-report');

// ---------------------------------------------------------------------------
// Build a plain-text diagnostic report string from the health object.
// Every field is included so the user can copy-paste and send it for debugging.
// ---------------------------------------------------------------------------
function buildReportText(health) {
  var sections = [];
  function heading(title) { sections.push(''); sections.push('=== ' + title + ' ==='); }
  function kv(key, val)   { sections.push('  ' + key + ': ' + String(val)); }
  function passfail(label, ok) { sections.push('  ' + (ok ? '[PASS]' : '[FAIL]') + '  ' + label); }

  // --- Header ---
  sections.push('================================================================================');
  sections.push('  FinForge Health Check Report');
  sections.push('  Generated: ' + new Date().toISOString());
  sections.push('================================================================================');

  // --- Overall verdict ---
  heading('OVERALL');
  kv('Setup complete', health.setupComplete === true ? 'Yes' : 'No');
  kv('Python reachable', health.pythonReachable === true ? 'Yes' : 'No');

  // --- Environment ---
  heading('ENVIRONMENT');
  var env = health.environment || {};
  var osInfo = env.os || {};
  kv('OS', osInfo.platform + ' ' + osInfo.release + ' (' + osInfo.arch + ')');
  kv('Hostname', osInfo.hostname);
  kv('User', osInfo.user);
  kv('CPUs', osInfo.cpus);
  kv('Total memory (bytes)', osInfo.totalmem);
  kv('Free memory (bytes)', osInfo.freemem);
  kv('Node.js version', env.node);
  kv('Electron version', env.electron);
  kv('App version', env.appVersion);

  // --- Paths ---
  heading('PATHS');
  var pth = health.paths || {};
  kv('Project root', pth.projectRoot);
  kv('Python executable', pth.pythonExe);
  kv('Workbook', pth.workbookPath);
  kv('Data directory', pth.dataDir);
  kv('xlwings config', pth.xlwingsConf);
  kv('Setup script', pth.setupBatch);
  kv('Uninstall script', pth.uninstallBatch);

  // --- Checks ---
  heading('CHECKS');

  passfail('Virtual environment (.venv)', health.venv && health.venv.exists);
  if (health.venv) { kv('  venv path', pth.pythonExe); }

  passfail('FinForge.xlsm workbook', health.workbook && health.workbook.exists);
  if (health.workbook && health.workbook.sizeBytes != null) {
    kv('  workbook size', Math.round(health.workbook.sizeBytes / 1024) + ' KB');
  }

  passfail('Data folder with content', health.dataFolder && health.dataFolder.hasContent);
  if (health.dataFolder) {
    kv('  subfolders', (health.dataFolder.subfolders || []).join(', '));
    kv('  tickers with price data', health.dataFolder.tickerCount);
  }

  passfail('Parquet read/write round-trip', health.parquetRoundtrip && health.parquetRoundtrip.ok === true);
  if (health.parquetRoundtrip && health.parquetRoundtrip.error) {
    kv('  parquet error', health.parquetRoundtrip.error);
  }

  passfail('xlwings.conf points to this project', health.xlwingsConf && health.xlwingsConf.ok === true);
  if (health.xlwingsConf && health.xlwingsConf.detail) {
    kv('  xlwings.conf detail', health.xlwingsConf.detail);
  }

  passfail('Workbook contains VBA macros (xl/vbaProject.bin)', health.workbookMacros && health.workbookMacros.hasVba === true);
  if (health.workbookMacros && health.workbookMacros.error) {
    kv('  macro error', health.workbookMacros.error);
  }

  // --- Packages ---
  heading('PYTHON PACKAGES');
  var pkg = health.packages || {};
  var pkgNames = ['yfinance', 'pandas', 'xlwings', 'PySide6', 'requests', 'openpyxl'];
  pkgNames.forEach(function (name) {
    var info = pkg[name];
    if (!info) {
      passfail(name + ' (no data)', false);
      return;
    }
    var label = name;
    if (info.version) { label += ' v' + info.version; }
    passfail(label, info.importable === true);
    if (info.error) { sections.push('    error: ' + info.error); }
  });

  // --- xlwings add-in ---
  heading('XLWINGS ADD-IN');
  passfail('xlwings add-in installed', health.xlwingsAddin === true);
  if (health.xlwingsDetail) {
    if (health.xlwingsDetail.detail) { kv('  detail', health.xlwingsDetail.detail); }
    if (health.xlwingsDetail.error)  { kv('  error', health.xlwingsDetail.error); }
  }

  // --- Project modules ---
  heading('PROJECT MODULES');
  var proj = health.projectModules || {};
  passfail('Core module imports (TickerManager, StockDataManager)', proj.importable === true);
  if (proj.error) { kv('  import error', proj.error); }

  // --- Requirements check ---
  heading('REQUIREMENTS.TXT');
  var req = health.requirementsCheck || {};
  passfail('All requirements satisfied', req.allMet === true);
  if (req.missing && req.missing.length > 0) {
    kv('  missing packages', req.missing.join(', '));
  }
  if (req.details) {
    sections.push('');
    sections.push('  --- Per-package status ---');
    for (var rpkg in req.details) {
      if (req.details.hasOwnProperty(rpkg)) {
        var rpkgInfo = req.details[rpkg];
        var rpkgLabel = rpkg;
        if (rpkgInfo.version) { rpkgLabel += ' v' + rpkgInfo.version; }
        passfail(rpkgLabel, rpkgInfo.installed === true);
      }
    }
  }

  // --- Python info ---
  if (health.pythonInfo) {
    heading('PYTHON INTERPRETER');
    kv('Version', health.pythonInfo.version);
    kv('Executable', health.pythonInfo.path);
    kv('Platform', health.pythonInfo.platform);
    if (health.pythonInfo.stderr) {
      sections.push('');
      sections.push('  --- Python stderr ---');
      sections.push(health.pythonInfo.stderr);
    }
    if (health.pythonInfo.pipList) {
      sections.push('');
      sections.push('  --- pip list ---');
      sections.push(health.pythonInfo.pipList);
    }
  }

  sections.push('');
  sections.push('================================================================================');
  sections.push('  End of report');
  sections.push('================================================================================');

  return sections.join('\n');
}

// ---------------------------------------------------------------------------
// Build the collapsible health-report DOM panel.
// ---------------------------------------------------------------------------
function buildHealthReportHTML(health) {
  var fullReport = buildReportText(health);

  // Count failures from the report markers
  var failedCount = (fullReport.match(/\[FAIL\]/g) || []).length;

  var wrapper = document.createElement('div');
  wrapper.className = 'mt-4 border border-[#93000a] bg-surface-container-lowest';

  // --- Static header (always visible, just shows the count) ---
  var header = document.createElement('div');
  header.className =
    'flex items-center justify-between px-3 py-2 text-[11px] mono tracking-[0.1em] ' +
    'text-error bg-surface-container-lowest uppercase';
  header.textContent = failedCount + ' issue(s) detected — report below';
  wrapper.appendChild(header);

  // --- Always-visible body ---
  var body = document.createElement('div');
  body.style.borderTop = '1px solid #505868';

  // Copy row: textarea + Copy button (no duplicate pre element)
  var copyRow = document.createElement('div');
  copyRow.className = 'flex items-stretch';

  var copyTextarea = document.createElement('textarea');
  copyTextarea.className =
    'health-report flex-1 bg-surface-container-lowest text-on-surface text-[11px] mono px-3 py-2 border-0 outline-none';
  copyTextarea.rows = 8;
  copyTextarea.readOnly = true;
  copyTextarea.value = fullReport;
  copyRow.appendChild(copyTextarea);

  var copyBtn = document.createElement('button');
  copyBtn.className =
    'px-3 py-2 bg-surface-container-high text-on-surface hover:bg-surface-container-highest ' +
    'text-[11px] mono tracking-[0.1em] uppercase transition-colors border-l border-outline-variant';
  copyBtn.textContent = 'Copy all';
  copyBtn.type = 'button';
  copyRow.appendChild(copyBtn);

  body.appendChild(copyRow);
  wrapper.appendChild(body);

  // --- Copy logic ---
  copyBtn.addEventListener('click', function () {
    copyTextarea.select();
    try {
      document.execCommand('copy');
      copyBtn.textContent = 'Copied!';
      copyBtn.style.background = '#004d40';
      copyBtn.style.color = '#a7f3d0';
      setTimeout(function () {
        copyBtn.textContent = 'Copy all';
        copyBtn.style.background = '';
        copyBtn.style.color = '';
      }, 1800);
    } catch (_) {
      copyBtn.textContent = 'Failed';
    }
  });

  return wrapper;
}

var setupDot = document.getElementById('setup-dot');
var setupText = document.getElementById('setup-text');

function updateSetupStatusUI(state) {
  if (!setupDot || !setupText) return;
  if (state === 'checking') {
    setupDot.className = 'status-dot amber';
    setupText.textContent = 'Checking...';
  } else if (state === 'ok') {
    setupDot.className = 'status-dot green';
    setupText.textContent = 'All checks passed';
  } else {
    setupDot.className = 'status-dot amber';
    setupText.textContent = 'Issues found';
  }
}

(function initSetupButtonStatus() {
  if (!launcherRunSetupButton) {
    return;
  }

  if (!window.finforge || typeof window.finforge.checkSystemHealth !== 'function') {
    return;
  }

  // Cache the original classes so we can restore them when checks fail
  var defaultClasses = launcherRunSetupButton.className;

  // Enter loading state immediately
  launcherRunSetupButton.textContent = 'Checking system...';
  launcherRunSetupButton.disabled = true;
  launcherRunSetupButton.className = 'term-btn checking-in-progress';
  updateSetupStatusUI('checking');

  window.finforge.checkSystemHealth().then(function (health) {
    if (health && health.setupComplete === true) {
      // All checks passed — green / disabled
      launcherRunSetupButton.textContent = 'Setup Completed';
      launcherRunSetupButton.disabled = true;
      launcherRunSetupButton.className = 'term-btn success';
      updateSetupStatusUI('ok');

      // Clear any previous report
      if (launcherHealthReportContainer) {
        launcherHealthReportContainer.classList.add('hidden');
        launcherHealthReportContainer.innerHTML = '';
      }
    } else {
      // Something missing — restore default "Run setup" state
      launcherRunSetupButton.textContent = 'Run setup';
      launcherRunSetupButton.disabled = false;
      launcherRunSetupButton.className = defaultClasses;
      updateSetupStatusUI('fail');

      // Render health report below the buttons
      if (launcherHealthReportContainer) {
        launcherHealthReportContainer.classList.remove('hidden');
        launcherHealthReportContainer.innerHTML = '';
        launcherHealthReportContainer.appendChild(buildHealthReportHTML(health || {}));
      }
    }
  });
})();

// --- Font Size Control ---
(function initLauncherFontScale() {
  var FONT_SCALE_KEY = 'finforge_font_scale';
  var FONT_SCALES = ['0.85', '1', '1.15', '1.3', '1.5', '1.75', '2'];
  var FONT_SCALE_LABELS = { '0.85': '0.85', '1': '1.0', '1.15': '1.15', '1.3': '1.3', '1.5': '1.5', '1.75': '1.75', '2': '2.0' };

  function getFontScaleIndex(scale) {
    var idx = FONT_SCALES.indexOf(scale);
    return idx >= 0 ? idx : 1;
  }

  function applyFontScale(scale) {
    document.body.setAttribute('data-font-scale', scale);
    var labels = document.querySelectorAll('.font-size-label');
    var display = FONT_SCALE_LABELS[scale] || scale;
    for (var i = 0; i < labels.length; i++) { labels[i].textContent = display; }
    try { localStorage.setItem(FONT_SCALE_KEY, scale); } catch (e) {}
  }

  function decreaseFontScale() {
    var current = document.body.getAttribute('data-font-scale') || '1';
    var idx = getFontScaleIndex(current);
    var prev = idx > 0 ? FONT_SCALES[idx - 1] : FONT_SCALES[0];
    applyFontScale(prev);
  }

  function increaseFontScale() {
    var current = document.body.getAttribute('data-font-scale') || '1';
    var idx = getFontScaleIndex(current);
    var next = idx < FONT_SCALES.length - 1 ? FONT_SCALES[idx + 1] : FONT_SCALES[FONT_SCALES.length - 1];
    applyFontScale(next);
  }

  // Initialize
  var savedScale = '1';
  try { savedScale = localStorage.getItem(FONT_SCALE_KEY) || '1'; } catch (e) {}
  if (FONT_SCALES.indexOf(savedScale) === -1) { savedScale = '1'; }
  applyFontScale(savedScale);

  // Button handlers
  var minusBtn = document.getElementById('launcher-font-size-minus');
  var plusBtn = document.getElementById('launcher-font-size-plus');
  if (minusBtn) { minusBtn.addEventListener('click', decreaseFontScale); }
  if (plusBtn) { plusBtn.addEventListener('click', increaseFontScale); }
})();

// --- Template System (Launcher) ---
(function initLauncherTemplateSystem() {
  var templateSelect = document.getElementById('launcher-template-select');
  var templateLoadBtn = document.getElementById('launcher-template-load');
  var templateNotes = document.getElementById('launcher-template-notes');
  var templateCount = document.getElementById('launcher-template-count');
  var templateStatus = document.getElementById('launcher-template-status');
  var launcherReplaceWorkbookBtn = document.getElementById('launcher-template-replace-workbook');

  if (!templateSelect || !templateLoadBtn) {
    return;
  }

  var allTemplates = [];

  function renderTemplateOptions() {
    if (!templateSelect) return;

    templateSelect.innerHTML = '<option value="">-- Choose template --</option>';

    for (var i = 0; i < allTemplates.length; i++) {
      var t = allTemplates[i];
      var label = t.name || t.id;
      if (t.isDefault) {
        label += ' (default)';
      }
      var option = document.createElement('option');
      option.value = t.id;
      option.textContent = label;
      templateSelect.appendChild(option);
    }

    if (templateCount) {
      templateCount.textContent = allTemplates.length + ' template' + (allTemplates.length !== 1 ? 's' : '');
    }
  }

  function showNotes(templateId) {
    var template = null;
    for (var i = 0; i < allTemplates.length; i++) {
      if (allTemplates[i].id === templateId) {
        template = allTemplates[i];
        break;
      }
    }

    if (template && template.notes) {
      templateNotes.textContent = template.notes;
      templateNotes.classList.remove('hidden');
    } else {
      templateNotes.classList.add('hidden');
    }

    if (template && templateStatus) {
      var parts = [];
      if (template.excelTemplate) {
        parts.push('Excel template: ' + template.excelTemplate);
      }
      if (template.tickers && template.tickers.length > 0) {
        parts.push(template.tickers.length + ' tickers');
      }
      if (template.settings) {
        var mode = template.settings.mode === 'incomeStatement' ? 'IS' : 'BS';
        var selCount = 0;
        if (template.settings.balanceSheet && Array.isArray(template.settings.balanceSheet.selected)) {
          selCount += template.settings.balanceSheet.selected.length;
        }
        if (template.settings.incomeStatement && Array.isArray(template.settings.incomeStatement.selected)) {
          selCount += template.settings.incomeStatement.selected.length;
        }
        parts.push(mode + ', ' + selCount + ' lines');
      }
      if (template.ratios && typeof template.ratios === 'object') {
        var ratioKeys = Object.keys(template.ratios);
        if (ratioKeys.length > 0) {
          parts.push(ratioKeys.length + ' metrics');
        }
      }
      templateStatus.textContent = parts.join(' | ');
      templateStatus.classList.remove('hidden');
    } else if (templateStatus) {
      templateStatus.classList.add('hidden');
    }
  }

  // Load templates on init
  if (window.finforge && typeof window.finforge.loadTemplates === 'function') {
    window.finforge.loadTemplates().then(function (result) {
      if (result && result.ok && Array.isArray(result.templates)) {
        allTemplates = result.templates;
        renderTemplateOptions();
      }
    }).catch(function () {});
  }

  // Template select change -> show notes and replace button
  if (templateSelect) {
    templateSelect.addEventListener('change', function () {
      var selectedId = templateSelect.value;
      if (selectedId) {
        showNotes(selectedId);
        templateLoadBtn.disabled = false;
        // Show replace button only if template has an Excel file
        var template = null;
        for (var i = 0; i < allTemplates.length; i++) {
          if (allTemplates[i].id === selectedId) {
            template = allTemplates[i];
            break;
          }
        }
        if (template && template.excelTemplate) {
          launcherReplaceWorkbookBtn.classList.remove('hidden');
        } else {
          launcherReplaceWorkbookBtn.classList.add('hidden');
        }
      } else {
        templateNotes.classList.add('hidden');
        if (templateStatus) templateStatus.classList.add('hidden');
        templateLoadBtn.disabled = true;
        launcherReplaceWorkbookBtn.classList.add('hidden');
      }
    });
  }

  // Load template button
  if (templateLoadBtn) {
    templateLoadBtn.addEventListener('click', function () {
      var selectedId = templateSelect.value;
      if (!selectedId) return;

      if (!window.finforge || typeof window.finforge.loadTemplate !== 'function') {
        return;
      }

      templateLoadBtn.textContent = 'Loading...';
      templateLoadBtn.disabled = true;

      window.finforge.loadTemplate(selectedId).then(function (result) {
        if (result && result.ok) {
          templateLoadBtn.textContent = 'Loaded!';
          templateLoadBtn.style.background = '#004d40';
          templateLoadBtn.style.color = '#a7f3d0';
          templateLoadBtn.style.borderColor = '#4edea3';
          setTimeout(function () {
            templateLoadBtn.textContent = 'Load';
            templateLoadBtn.disabled = false;
            templateLoadBtn.style.background = '';
            templateLoadBtn.style.color = '';
            templateLoadBtn.style.borderColor = '';
          }, 2000);
        } else {
          templateLoadBtn.textContent = 'Error';
          templateLoadBtn.style.background = '#93000a';
          templateLoadBtn.style.color = '#ffb4ab';
          setTimeout(function () {
            templateLoadBtn.textContent = 'Load';
            templateLoadBtn.disabled = false;
            templateLoadBtn.style.background = '';
            templateLoadBtn.style.color = '';
          }, 2000);
        }
      }).catch(function () {
        templateLoadBtn.textContent = 'Error';
        setTimeout(function () {
          templateLoadBtn.textContent = 'Load';
          templateLoadBtn.disabled = false;
        }, 2000);
      });
    });
  }

  // Replace workbook with template button
  if (launcherReplaceWorkbookBtn) {
    launcherReplaceWorkbookBtn.addEventListener('click', function () {
      var selectedId = templateSelect.value;
      if (!selectedId) return;

      var template = null;
      for (var i = 0; i < allTemplates.length; i++) {
        if (allTemplates[i].id === selectedId) {
          template = allTemplates[i];
          break;
        }
      }
      if (!template || !template.excelTemplate) return;

      if (!window.confirm('Replace FinForge.xlsm with a copy of "' + template.excelTemplate + '" from template "' + template.name + '"?\n\nThis will overwrite the current workbook and all settings (statement lines, tickers, metrics).')) return;

      if (!window.finforge || typeof window.finforge.replaceWorkbookWithTemplate !== 'function') return;

      launcherReplaceWorkbookBtn.textContent = 'Replacing...';
      launcherReplaceWorkbookBtn.disabled = true;

      window.finforge.replaceWorkbookWithTemplate(selectedId).then(function (result) {
        if (result && result.ok) {
          launcherReplaceWorkbookBtn.textContent = 'Replaced!';
          launcherReplaceWorkbookBtn.style.background = '#004d40';
          launcherReplaceWorkbookBtn.style.color = '#a7f3d0';
          launcherReplaceWorkbookBtn.style.borderColor = '#4edea3';
          setTimeout(function () {
            launcherReplaceWorkbookBtn.textContent = 'Replace workbook with template';
            launcherReplaceWorkbookBtn.disabled = false;
            launcherReplaceWorkbookBtn.style.background = '';
            launcherReplaceWorkbookBtn.style.color = '';
            launcherReplaceWorkbookBtn.style.borderColor = '';
          }, 3000);
        } else {
          launcherReplaceWorkbookBtn.textContent = 'Failed';
          launcherReplaceWorkbookBtn.style.background = '#93000a';
          launcherReplaceWorkbookBtn.style.color = '#ffb4ab';
          setTimeout(function () {
            launcherReplaceWorkbookBtn.textContent = 'Replace workbook with template';
            launcherReplaceWorkbookBtn.disabled = false;
            launcherReplaceWorkbookBtn.style.background = '';
            launcherReplaceWorkbookBtn.style.color = '';
          }, 2000);
        }
      }).catch(function () {
        launcherReplaceWorkbookBtn.textContent = 'Error';
        setTimeout(function () {
          launcherReplaceWorkbookBtn.textContent = 'Replace workbook with template';
          launcherReplaceWorkbookBtn.disabled = false;
        }, 2000);
      });
    });
  }

})();
