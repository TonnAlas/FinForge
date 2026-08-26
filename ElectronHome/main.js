const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const statementSettingsPath = path.join(dataDir, 'statement_settings.json');
const statementCatalogPath = path.join(dataDir, 'statement_catalog.json');
const importListPath = path.join(dataDir, 'tickers.json');
const ratioConfigPath = path.join(rootDir, 'Importing', 'ratio_config.json');
const folderConfigPath = path.join(dataDir, 'folders.json');
const templatesPath = path.join(dataDir, 'templates.json');
const templatesExcelDir = path.join(dataDir, 'templates_excel');
const homeStatePath = path.join(dataDir, 'home_state.json');
const rankingPresetsPath = path.join(dataDir, 'ranking_presets.json');
const pythonExecutablePath = path.join(rootDir, '.venv', 'Scripts', 'python.exe');
const workbookPath = path.join(rootDir, 'FinForge.xlsm');
const setupBatchPath = path.join(rootDir, 'setup.bat');
const uninstallBatchPath = path.join(rootDir, 'uninstall.bat');
const xlwingsConfPath = path.join(os.homedir(), '.xlwings', 'xlwings.conf');
const requirementsTxtPath = path.join(rootDir, 'requirements.txt');

let mainWindow = null;
let launcherWindow = null;

function getInitialWindowMode() {
  return String(process.env.FINFORGE_START_WINDOW || '').toLowerCase() === 'workspace'
    ? 'workspace'
    : 'launcher';
}

function readJson(filePath, fallbackValue) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallbackValue;
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    return fallbackValue;
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');
}

function normalizeTickerSymbol(value) {
  return String(value || '').trim().toUpperCase();
}

function normalizeTickerList(value) {
  const tickers = Array.isArray(value) ? value : [];
  return Array.from(new Set(tickers.map(normalizeTickerSymbol).filter(Boolean)));
}

async function searchTickerUniverse(query) {
  const cleanedQuery = String(query || '').trim();
  if (!cleanedQuery) {
    return [];
  }

  const url = new URL('https://query1.finance.yahoo.com/v1/finance/search');
  url.searchParams.set('q', cleanedQuery);
  url.searchParams.set('quotesCount', '12');
  url.searchParams.set('newsCount', '0');
  url.searchParams.set('listsCount', '0');

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  if (!response.ok) {
    throw new Error(`Ticker search failed with status ${response.status}`);
  }

  const data = await response.json();
  const quotes = Array.isArray(data.quotes) ? data.quotes : [];
  const seen = new Set();
  const normalizedQuery = cleanedQuery.toUpperCase();

  return quotes
    .filter((quote) => {
      const qt = String((quote && quote.quoteType) || '');
      return qt === 'EQUITY';
    })
    .map((quote) => {
      const ticker = normalizeTickerSymbol(quote && quote.symbol);
      if (!ticker || seen.has(ticker)) {
        return null;
      }

      seen.add(ticker);
      return {
        ticker,
        companyName: String((quote && (quote.longname || quote.shortname)) || ticker),
        exchange: String((quote && quote.exchDisp) || ''),
        quoteType: String((quote && quote.quoteType) || ''),
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const leftExact = left.ticker === normalizedQuery ? 0 : 1;
      const rightExact = right.ticker === normalizedQuery ? 0 : 1;
      if (leftExact !== rightExact) {
        return leftExact - rightExact;
      }

      const leftPrefix = left.ticker.startsWith(normalizedQuery) ? 0 : 1;
      const rightPrefix = right.ticker.startsWith(normalizedQuery) ? 0 : 1;
      if (leftPrefix !== rightPrefix) {
        return leftPrefix - rightPrefix;
      }

      return left.companyName.localeCompare(right.companyName);
    });
}

function buildCompanyProfileCommand(ticker) {
  return [
    'import json',
    'from pathlib import Path',
    'import pandas as pd',
    'import yfinance as yf',
    'from data_management.stock_data_manager import StockDataManager',
    '',
    'def clean_value(value):',
    '    if value is None:',
    '        return None',
    '    try:',
    '        if pd.isna(value):',
    '            return None',
    '    except Exception:',
    '        pass',
    '    if isinstance(value, dict):',
    '        return {str(key): clean_value(item) for key, item in value.items()}',
    '    if isinstance(value, (list, tuple, set)):',
    '        return [clean_value(item) for item in value]',
    '    if hasattr(value, "item"):',
    '        try:',
    '            value = value.item()',
    '        except Exception:',
    '            pass',
    '    if hasattr(value, "isoformat"):',
    '        try:',
    '            return value.isoformat()',
    '        except Exception:',
    '            pass',
    '    return value',
    '',
    'def normalize_dict(data):',
    '    if not isinstance(data, dict):',
    '        return {}',
    '    return {str(key): clean_value(item) for key, item in data.items()}',
    '',
    'def df_to_records(data_frame):',
    '    if data_frame is None:',
    '        return []',
    '    if isinstance(data_frame, pd.Series):',
    '        data_frame = data_frame.to_frame()',
    '    if getattr(data_frame, "empty", True):',
    '        return []',
    '    frame = data_frame.copy().reset_index()',
    '    frame = frame.where(pd.notna(frame), None)',
    '    return json.loads(frame.to_json(orient="records", date_format="iso"))',
    '',
    'def load_frame(stock, manager, ticker_value, data_type, getter_name, holder=False):',
    '    if holder:',
    '        cached = manager.get_holders_data(ticker_value, data_type)',
    '    else:',
    '        cached = manager.get_fundamental_data(ticker_value, data_type)',
    '    if cached is not None and not cached.empty:',
    '        return df_to_records(cached)',
    '    try:',
    '        fetched = getattr(stock, getter_name)',
    '        if isinstance(fetched, dict):',
    '            fetched = pd.DataFrame([fetched])',
    '        if fetched is None or getattr(fetched, "empty", False):',
    '            return []',
    '        if holder:',
    '            manager.save_holders_data(ticker_value, data_type, fetched)',
    '        else:',
    '            manager.save_fundamental_data(ticker_value, data_type, fetched)',
    '        return df_to_records(fetched)',
    '    except Exception:',
    '        return []',
    '',
    'root_dir = Path(' + JSON.stringify(rootDir) + ')',
    'ticker = ' + JSON.stringify(ticker) + '',
    'manager = StockDataManager(root_dir / "data")',
    'stock = yf.Ticker(ticker)',
    '',
    'info = {}',
    'try:',
    '    info = normalize_dict(manager.get_metadata(ticker))',
    'except Exception:',
    '    info = {}',
    '',
    'try:',
    '    live_info = stock.info or {}',
    '    if isinstance(live_info, dict):',
    '        info.update(normalize_dict(live_info))',
    '        manager.save_metadata(ticker, info)',
    'except Exception:',
    '    pass',
    '',
    '# Download historical price data (used by ratio calculator for P: tokens)',
    'try:',
    '    cached_prices = manager.get_stock_prices(ticker)',
    '    if cached_prices is None or cached_prices.empty:',
    '        hist = stock.history(period="2y")',
    '        if hist is not None and not hist.empty:',
    '            manager.save_stock_prices(ticker, hist)',
    'except Exception:',
    '    pass',
    '',
    'profile = {',
    '    "ticker": ticker,',
    '    "companyName": info.get("longName") or info.get("shortName") or ticker,',
    '    "info": info,',
    '    "majorHolders": load_frame(stock, manager, ticker, "major_holders", "major_holders", holder=True),',
    '    "institutionalHolders": load_frame(stock, manager, ticker, "institutional_holders", "institutional_holders", holder=True),',
    '    "mutualFundHolders": load_frame(stock, manager, ticker, "mutualfund_holders", "mutualfund_holders", holder=True),',
    '    "insiderRosterHolders": load_frame(stock, manager, ticker, "insider_roster_holders", "insider_roster_holders", holder=True),',
    '    "insiderTransactions": load_frame(stock, manager, ticker, "insider_transactions", "insider_transactions"),',
    '    "earningsEstimate": load_frame(stock, manager, ticker, "earnings_estimate", "earnings_estimate"),',
    '    "revenueEstimate": load_frame(stock, manager, ticker, "revenue_estimate", "revenue_estimate"),',
    '    "epsTrend": load_frame(stock, manager, ticker, "eps_trend", "eps_trend"),',
    '    "growthEstimates": load_frame(stock, manager, ticker, "growth_estimates", "growth_estimates"),',
    '    "analystPriceTargets": load_frame(stock, manager, ticker, "analyst_price_targets", "analyst_price_targets"),',
    '    "recommendationsSummary": load_frame(stock, manager, ticker, "recommendations_summary", "recommendations_summary"),',
    '    "fetchedAt": __import__("datetime").datetime.now().isoformat(),',
    '}',
    '',
    'print(json.dumps(profile, ensure_ascii=True))',
  ].join('\n');
}

function buildCompanyReportsCommand(ticker, refresh) {
  return [
    'import json',
    'from Internal.Reports.company_reports import get_company_reports',
    '',
    'ticker = ' + JSON.stringify(ticker),
    'refresh = ' + (refresh ? 'True' : 'False'),
    'result = get_company_reports(ticker, refresh=refresh)',
    'print(json.dumps(result, ensure_ascii=True))',
  ].join('\n');
}

function loadCompanyProfile(ticker) {
  return new Promise((resolve, reject) => {
    let child = null;
    const timeout = setTimeout(() => {
      if (child) { child.kill(); }
      reject(new Error('Company profile fetch timed out. Yahoo Finance may be unreachable or rate-limited. Please try again.'));
    }, 60000);

    child = spawn(getPythonCommand(), ['-c', buildCompanyProfileCommand(ticker)], {
      cwd: rootDir,
      windowsHide: true,
      env: {
        ...process.env,
        PYTHONUTF8: '1',
      },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        reject(new Error((stderr || stdout || `Company profile fetch exited with code ${code}`).trim()));
        return;
      }

      try {
        resolve(JSON.parse(stdout || '{}'));
      } catch (error) {
        reject(new Error(`Company profile parse error: ${error.message || error}`));
      }
    });
  });
}

function loadCompanyReports(ticker, refresh) {
  return new Promise((resolve, reject) => {
    let child = null;
    const timeout = setTimeout(() => {
      if (child) { child.kill(); }
      reject(new Error('Company reports fetch timed out. SEC EDGAR may be unreachable or rate-limited. Please try again.'));
    }, 45000);

    child = spawn(getPythonCommand(), ['-c', buildCompanyReportsCommand(ticker, refresh)], {
      cwd: rootDir,
      windowsHide: true,
      env: {
        ...process.env,
        PYTHONUTF8: '1',
      },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        reject(new Error((stderr || stdout || `Company reports fetch exited with code ${code}`).trim()));
        return;
      }

      try {
        resolve(JSON.parse(stdout || '{}'));
      } catch (error) {
        reject(new Error(`Company reports parse error: ${error.message || error}`));
      }
    });
  });
}

function getPythonCommand() {
  return fs.existsSync(pythonExecutablePath) ? pythonExecutablePath : 'python';
}

function buildImportCommand(scope) {
  // Escape backslashes and single quotes for embedding in Python string
  // Each \ must become \\ so Python doesn't interpret \U or \u as unicode escapes
  var escapedPath = workbookPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  if (scope === 'incomeStatement') {
    return "from Importing.import_income_statements import import_income_statements; import_income_statements('" + escapedPath + "')";
  }

  if (scope === 'cashFlow') {
    return "from Importing.import_cash_flow import import_cash_flow; import_cash_flow('" + escapedPath + "')";
  }

  return "from Importing.import_balance_sheets import import_balance_sheets; import_balance_sheets('" + escapedPath + "')";
}

function buildRatioRefreshCommand() {
  return 'from Internal.Ratios.ratio_calculator import refresh_ratios_from_terminal; refresh_ratios_from_terminal()';
}

function buildSyncAssignedRatiosCommand(ratioNamesJson) {
  const escaped = ratioNamesJson.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
  return `from Internal.Ratios.ratio_calculator import sync_assigned_ratios; sync_assigned_ratios('${escaped}')`;
}

function runPythonImport(scope) {
  return new Promise((resolve, reject) => {
    const child = spawn(getPythonCommand(), ['-c', buildImportCommand(scope)], {
      cwd: rootDir,
      windowsHide: true,
      env: {
        ...process.env,
        PYTHONUTF8: '1',
      },
    });

    const importTimeout = setTimeout(() => {
      if (child) { child.kill(); }
      reject(new Error('Python import timed out after 120 seconds.'));
    }, 120000);

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (error) => {
      clearTimeout(importTimeout);
      reject(error);
    });

    child.on('close', (code) => {
      clearTimeout(importTimeout);
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(new Error((stderr || stdout || `Python import exited with code ${code}`).trim()));
    });
  });
}

function runExcelMacro(workbookPathValue, macroName) {
  const normalizedWorkbookPath = String(workbookPathValue || '').replaceAll("'", "''");
  const normalizedWorkbookName = path.basename(String(workbookPathValue || '')).replaceAll("'", "''");
  const normalizedMacroName = String(macroName || '').replaceAll("'", "''");

  const script = [
    '$ErrorActionPreference = "Stop"',
    `$workbookPath = '${normalizedWorkbookPath}'`,
    `$workbookName = '${normalizedWorkbookName}'`,
    `$macroName = '${normalizedMacroName}'`,
    '$excel = $null',
    '$workbook = $null',
    '$excelWasRunning = $true',
    'try {',
    '  try {',
    "    $excel = [Runtime.InteropServices.Marshal]::GetActiveObject('Excel.Application')",
    '  } catch {',
    '    $excelWasRunning = $false',
    '    $excel = New-Object -ComObject Excel.Application',
    '  }',
    '  $excel.DisplayAlerts = $false',
    '  $excel.Visible = $true',
    '  foreach ($candidate in $excel.Workbooks) {',
    '    if ($candidate.FullName -eq $workbookPath) {',
    '      $workbook = $candidate',
    '      break',
    '    }',
    '  }',
    '  if ($null -eq $workbook) {',
    '    $workbook = $excel.Workbooks.Open($workbookPath)',
    '  }',
    "  $excel.Run(\"'$workbookName'!$macroName\")",
    '  $workbook.Save()',
    '} finally {',
    '  if ($workbook -ne $null) {',
    '    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($workbook)',
    '  }',
    '  if ($excel -ne $null) {',
    '    if (-not $excelWasRunning) {',
    '      $excel.Quit()',
    '    }',
    '    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($excel)',
    '  }',
    '}',
  ].join('\n');

  return new Promise((resolve, reject) => {
    const child = spawn('powershell.exe', ['-NoLogo', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script], {
      cwd: rootDir,
      windowsHide: true,
      env: {
        ...process.env,
        PYTHONUTF8: '1',
      },
    });

    const macroTimeout = setTimeout(() => {
      if (child) { child.kill(); }
      reject(new Error('Excel macro timed out after 120 seconds.'));
    }, 120000);

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (error) => {
      clearTimeout(macroTimeout);
      reject(error);
    });

    child.on('close', (code) => {
      clearTimeout(macroTimeout);
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(new Error((stderr || stdout || `Excel macro exited with code ${code}`).trim()));
    });
  });
}

function existsAtPath(targetPath) {
  return fs.existsSync(targetPath);
}

async function openPath(targetPath) {
  const openError = await shell.openPath(targetPath);
  if (openError) {
    throw new Error(openError);
  }
}

function getLauncherStatus() {
  return {
    projectRoot: rootDir,
    workbook: {
      path: workbookPath,
      exists: existsAtPath(workbookPath),
    },
    virtualEnvironment: {
      pythonPath: pythonExecutablePath,
      exists: existsAtPath(pythonExecutablePath),
    },
    setupScript: {
      path: setupBatchPath,
      exists: existsAtPath(setupBatchPath),
    },
    uninstallScript: {
      path: uninstallBatchPath,
      exists: existsAtPath(uninstallBatchPath),
    },
    dataFolder: {
      path: dataDir,
      exists: existsAtPath(dataDir),
    },
  };
}

/**
 * Run a Python snippet inside the project virtual environment and return
 * parsed JSON from stdout.  Resolves to null if the venv is missing or
 * the script fails.
 */
function runPythonHealthCheck() {
  return new Promise(function (resolve) {
    if (!existsAtPath(pythonExecutablePath)) {
      resolve(null);
      return;
    }

    var script =
      'import json, sys, platform, subprocess as sp, os, zipfile, tempfile\n' +
      'import pandas as pd\n' +
      'results = {}\n' +
      '\n' +
      'ROOT = ' + JSON.stringify(rootDir) + '\n' +
      'WORKBOOK = ' + JSON.stringify(workbookPath) + '\n' +
      'REQ_TXT = ' + JSON.stringify(requirementsTxtPath) + '\n' +
      '\n' +
      '# --- Python version info ---\n' +
      'results["python_version"] = platform.python_version()\n' +
      'results["python_path"] = sys.executable\n' +
      'results["platform"] = platform.platform()\n' +
      '\n' +
      '# --- Package import check with versions ---\n' +
      'results["packages"] = {}\n' +
      'for mod_name in ("yfinance", "pandas", "xlwings", "PySide6", "requests", "openpyxl"):\n' +
      '  entry = {"importable": False, "version": None, "error": None}\n' +
      '  try:\n' +
      '    mod = __import__(mod_name)\n' +
      '    entry["importable"] = True\n' +
      '    entry["version"] = getattr(mod, "__version__", None) or getattr(mod, "version", None) or "unknown"\n' +
      '  except Exception as exc:\n' +
      '    entry["error"] = str(exc)[:200]\n' +
      '  results["packages"][mod_name] = entry\n' +
      '\n' +
      '# --- xlwings addin status (file-based, avoids Excel COM hang) ---\n' +
      'results["xlwings_addin"] = {"installed": False, "detail": None, "error": None}\n' +
      'try:\n' +
      '  xlwings_xlam = os.path.join(os.environ.get("APPDATA", ""), "Microsoft", "Excel", "XLSTART", "xlwings.xlam")\n' +
      '  results["xlwings_addin"]["installed"] = os.path.isfile(xlwings_xlam)\n' +
      '  results["xlwings_addin"]["detail"] = xlwings_xlam + (" (found)" if results["xlwings_addin"]["installed"] else " (not found)")\n' +
      'except Exception as exc:\n' +
      '  results["xlwings_addin"]["error"] = str(exc)[:300]\n' +
      '\n' +
      '# --- Core project module imports ---\n' +
      'results["project_modules"] = {"importable": False, "error": None}\n' +
      'try:\n' +
      '  sys.path.insert(0, ROOT)\n' +
      '  from Ticker_management.ticker_manager import TickerManager\n' +
      '  from data_management.stock_data_manager import StockDataManager\n' +
      '  results["project_modules"]["importable"] = True\n' +
      'except Exception as exc:\n' +
      '  results["project_modules"]["error"] = str(exc)[:500]\n' +
      '\n' +
      '# --- Parquet read/write round-trip test ---\n' +
      'results["parquet_roundtrip"] = {"ok": False, "error": None}\n' +
      'try:\n' +
      '  test_dir = os.path.join(ROOT, "data", "prices")\n' +
      '  if not os.path.isdir(test_dir):\n' +
      '    os.makedirs(test_dir, exist_ok=True)\n' +
      '  test_path = os.path.join(test_dir, "_health_check_test.parquet")\n' +
      '  df_orig = pd.DataFrame({"ticker": ["TEST"], "value": [42.0]})\n' +
      '  df_orig.to_parquet(test_path, index=False)\n' +
      '  df_read = pd.read_parquet(test_path)\n' +
      '  ok = df_orig.equals(df_read)\n' +
      '  os.remove(test_path)\n' +
      '  results["parquet_roundtrip"]["ok"] = bool(ok)\n' +
      '  if not ok:\n' +
      '    results["parquet_roundtrip"]["error"] = "Data mismatch after round-trip"\n' +
      'except Exception as exc:\n' +
      '  results["parquet_roundtrip"]["error"] = str(exc)[:300]\n' +
      '\n' +
      '# --- Requirements.txt comparison ---\n' +
      'results["requirements_check"] = {"all_met": False, "missing": [], "details": {}}\n' +
      'try:\n' +
      '  with open(REQ_TXT, "r") as fh:\n' +
      '    raw_lines = fh.readlines()\n' +
      '  req_packages = []\n' +
      '  for line in raw_lines:\n' +
      '    line = line.strip()\n' +
      '    if not line or line.startswith("#") or line.startswith("-r"):\n' +
      '      continue\n' +
      '    # Strip version specifiers\n' +
      '    for sep in (">=", "==", "<=", "!=", ">", "<", "~="):\n' +
      '      idx = line.find(sep)\n' +
      '      if idx > 0:\n' +
      '        line = line[:idx]\n' +
      '        break\n' +
      '    line = line.strip()\n' +
      '    if not line:\n' +
      '      continue\n' +
      '    # Keep original casing; store as-is for display\n' +
      '    req_packages.append(line)\n' +
      '  missing = []\n' +
      '  details = {}\n' +
      '  for pkg in req_packages:\n' +
      '    # Try original name, then lowercase, underscored, and lower+underscore variants\n' +
      '    candidates = [pkg, pkg.lower(), pkg.replace("-", "_"), pkg.lower().replace("-", "_")]\n' +
      '    found = False\n' +
      '    for candidate in candidates:\n' +
      '      try:\n' +
      '        mod = __import__(candidate)\n' +
      '        details[pkg] = {"installed": True, "version": getattr(mod, "__version__", None) or getattr(mod, "version", None)}\n' +
      '        found = True\n' +
      '        break\n' +
      '      except Exception:\n' +
      '        continue\n' +
      '    if not found:\n' +
      '      # Fallback: use importlib.metadata to check pip installation\n' +
      '      # (handles packages whose module name differs from package name,\n' +
      '      #  e.g. whoogle-search installs as the \"app\" module)\n' +
      '      try:\n' +
      '        import importlib.metadata as _ilm\n' +
      '        _dist = _ilm.distribution(pkg)\n' +
      '        details[pkg] = {"installed": True, "version": _dist.version or "unknown"}\n' +
      '        found = True\n' +
      '      except Exception:\n' +
      '        pass\n' +
      '    if not found:\n' +
      '      details[pkg] = {"installed": False, "version": None}\n' +
      '      missing.append(pkg)\n' +
      '  results["requirements_check"]["all_met"] = len(missing) == 0\n' +
      '  results["requirements_check"]["missing"] = missing\n' +
      '  results["requirements_check"]["details"] = details\n' +
      'except Exception as exc:\n' +
      '  results["requirements_check"]["error"] = str(exc)[:300]\n' +
      '\n' +
      '# --- Workbook macro validation ---\n' +
      'results["workbook_macros"] = {"has_vba": False, "error": None}\n' +
      'try:\n' +
      '  if os.path.isfile(WORKBOOK):\n' +
      '    with zipfile.ZipFile(WORKBOOK, "r") as zf:\n' +
      '      names = zf.namelist()\n' +
      '    results["workbook_macros"]["has_vba"] = "xl/vbaProject.bin" in names\n' +
      '    if not results["workbook_macros"]["has_vba"]:\n' +
      '      results["workbook_macros"]["error"] = "xl/vbaProject.bin not found inside .xlsm"\n' +
      '  else:\n' +
      '    results["workbook_macros"]["error"] = "Workbook file does not exist"\n' +
      'except Exception as exc:\n' +
      '  results["workbook_macros"]["error"] = str(exc)[:300]\n' +
      '\n' +
      '# --- pip list ---\n' +
      'results["pip_list"] = None\n' +
      'try:\n' +
      '  r = sp.run([sys.executable, "-m", "pip", "list", "--format=columns"], capture_output=True, text=True, timeout=15)\n' +
      '  if r.returncode == 0:\n' +
      '    results["pip_list"] = r.stdout.strip()[:2000]\n' +
      'except Exception:\n' +
      '  pass\n' +
      '\n' +
      'print(json.dumps(results))';

    var child = spawn(pythonExecutablePath, ['-c', script], {
      cwd: rootDir,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    // Proper timeout using setTimeout + child.kill (spawn ignores the timeout option)
    var healthCheckTimeout = setTimeout(function () {
      if (child) { child.kill(); }
      resolve(null);
    }, 60000);

    var stdout = '';
    var stderr = '';

    child.stdout.on('data', function (chunk) { stdout += chunk; });
    child.stderr.on('data', function (chunk) { stderr += chunk; });

    child.on('close', function (code) {
      clearTimeout(healthCheckTimeout);
      if (code !== 0 || !stdout) {
        resolve(null);
        return;
      }
      try {
        var parsed = JSON.parse(stdout);
        if (stderr) { parsed._stderr = stderr.slice(0, 1000); }
        resolve(parsed);
      } catch (_) {
        resolve(null);
      }
    });

    child.on('error', function () {
      clearTimeout(healthCheckTimeout);
      resolve(null);
    });
  });
}

/**
 * Perform a comprehensive health check and return whether the system is
 * fully set up and operational.
 */
async function checkSystemHealth() {
  var pythonCheck = await runPythonHealthCheck();

  var venvExists = existsAtPath(pythonExecutablePath);
  var workbookExists = existsAtPath(workbookPath);

  // Data folder details
  var dataFolderExists = existsAtPath(dataDir);
  var dataFolderContent = [];
  var dataTickerCount = 0;
  if (dataFolderExists) {
    try {
      dataFolderContent = fs.readdirSync(dataDir).filter(function (f) {
        return fs.statSync(path.join(dataDir, f)).isDirectory();
      });
      // Count ticker parquet files in prices subfolder
      var pricesDir = path.join(dataDir, 'prices');
      if (existsAtPath(pricesDir)) {
        dataTickerCount = fs.readdirSync(pricesDir).filter(function (f) { return f.endsWith('.parquet'); }).length;
      }
    } catch (_) {}
  }
  var dataFolderHasContent = dataFolderContent.length > 0;

  // Workbook file size
  var workbookSize = null;
  if (workbookExists) {
    try { workbookSize = fs.statSync(workbookPath).size; } catch (_) {}
  }

  // --- xlwings.conf check ---
  var xlwingsConfOk = false;
  var xlwingsConfDetail = null;
  try {
    if (existsAtPath(xlwingsConfPath)) {
      var confContent = fs.readFileSync(xlwingsConfPath, 'utf-8');
      xlwingsConfDetail = confContent.slice(0, 500);
      // Check if INTERPRETER_WIN / INTERPRETER line points to this project's venv.
      // Use case-insensitive comparison because drive letters may differ in case.
      var confLower = confContent.toLowerCase();
      var expectedLower = pythonExecutablePath.toLowerCase();
      xlwingsConfOk = confLower.indexOf('interpreter') !== -1 &&
                       confLower.indexOf(expectedLower) !== -1;
    } else {
      xlwingsConfDetail = 'File not found at ' + xlwingsConfPath;
    }
  } catch (err) {
    xlwingsConfDetail = err.message;
  }

  // --- Derive check results from Python ---
  var allPackagesInstalled = false;
  var xlwingsAddinInstalled = false;
  var projectModulesOk = false;
  var packageDetails = null;
  var xlwingsDetail = null;
  var parquetOk = false;
  var parquetError = null;
  var requirementsMet = false;
  var requirementsMissing = [];
  var workbookHasVba = false;
  var workbookVbaError = null;

  if (pythonCheck) {
    if (pythonCheck.packages) {
      packageDetails = pythonCheck.packages;
      allPackagesInstalled =
        pythonCheck.packages.yfinance &&
        pythonCheck.packages.yfinance.importable === true &&
        pythonCheck.packages.pandas &&
        pythonCheck.packages.pandas.importable === true &&
        pythonCheck.packages.xlwings &&
        pythonCheck.packages.xlwings.importable === true &&
        pythonCheck.packages.PySide6 &&
        pythonCheck.packages.PySide6.importable === true &&
        pythonCheck.packages.requests &&
        pythonCheck.packages.requests.importable === true;
    }
    if (pythonCheck.xlwings_addin) {
      xlwingsAddinInstalled = pythonCheck.xlwings_addin.installed === true;
      xlwingsDetail = pythonCheck.xlwings_addin;
    }
    if (pythonCheck.project_modules) {
      projectModulesOk = pythonCheck.project_modules.importable === true;
    }
    if (pythonCheck.parquet_roundtrip) {
      parquetOk = pythonCheck.parquet_roundtrip.ok === true;
      parquetError = pythonCheck.parquet_roundtrip.error;
    }
    if (pythonCheck.requirements_check) {
      requirementsMet = pythonCheck.requirements_check.all_met === true;
      requirementsMissing = pythonCheck.requirements_check.missing || [];
    }
    if (pythonCheck.workbook_macros) {
      workbookHasVba = pythonCheck.workbook_macros.has_vba === true;
      workbookVbaError = pythonCheck.workbook_macros.error;
    }
  }

  var setupComplete =
    venvExists &&
    workbookExists &&
    dataFolderHasContent &&
    allPackagesInstalled &&
    projectModulesOk &&
    xlwingsAddinInstalled &&
    xlwingsConfOk &&
    parquetOk &&
    requirementsMet &&
    workbookHasVba;

  // Gather OS / Node / environment info
  var cpus = os.cpus();
  var diskSpace = null;
  try { diskSpace = require('child_process').execSync('wmic logicaldisk where DeviceID="' + path.parse(rootDir).root.replace(/\\/g, '\\\\') + '" get FreeSpace,Size /format:csv', { timeout: 3000, encoding: 'utf8' }).trim(); } catch (_) {}

  return {
    setupComplete: setupComplete,

    // Environment
    environment: {
      os: { platform: os.platform(), release: os.release(), arch: os.arch(), hostname: os.hostname(), cpus: cpus ? cpus.length : 0, totalmem: os.totalmem(), freemem: os.freemem() },
      node: process.version,
      electron: process.versions.electron,
      appVersion: app.getVersion(),
      user: os.userInfo().username,
    },

    // Paths
    paths: {
      projectRoot: rootDir,
      pythonExe: pythonExecutablePath,
      workbookPath: workbookPath,
      dataDir: dataDir,
      xlwingsConf: xlwingsConfPath,
      setupBatch: setupBatchPath,
      uninstallBatch: uninstallBatchPath,
    },

    // Checks
    venv: { exists: venvExists },
    workbook: { exists: workbookExists, sizeBytes: workbookSize },
    dataFolder: { exists: dataFolderExists, hasContent: dataFolderHasContent, subfolders: dataFolderContent, tickerCount: dataTickerCount },
    packages: pythonCheck ? pythonCheck.packages : null,
    xlwingsAddin: xlwingsAddinInstalled,
    xlwingsDetail: xlwingsDetail,
    xlwingsConf: { ok: xlwingsConfOk, detail: xlwingsConfDetail },
    projectModules: pythonCheck ? pythonCheck.project_modules : { importable: false, error: 'Python not reachable' },
    parquetRoundtrip: { ok: parquetOk, error: parquetError },
    requirementsCheck: { allMet: requirementsMet, missing: requirementsMissing, details: pythonCheck ? pythonCheck.requirements_check && pythonCheck.requirements_check.details : null },
    workbookMacros: { hasVba: workbookHasVba, error: workbookVbaError },
    pythonInfo: pythonCheck ? { version: pythonCheck.python_version, path: pythonCheck.python_path, platform: pythonCheck.platform, pipList: pythonCheck.pip_list, stderr: pythonCheck._stderr } : null,
    pythonReachable: pythonCheck !== null,
  };
}

ipcMain.handle('finforge:loadStatementCatalog', () => {
  return readJson(statementCatalogPath, { balanceSheet: [], incomeStatement: [], cashFlow: [] });
});

// ── Template System ──

function getDefaultTemplate() {
  return {
    id: 'default',
    name: 'Beginning Template',
    notes: 'Default template that ships with FinForge. Contains basic settings for getting started with stock analysis.',
    isDefault: true,
    createdAt: new Date('2026-01-01').toISOString(),
    updatedAt: new Date('2026-01-01').toISOString(),
    settings: {
      mode: 'balanceSheet',
      display: { mode: 'millions', divisor: 1000000 },
      balanceSheet: {
        selected: ['Total Assets', 'Current Assets', 'Cash And Cash Equivalents', 'Total Liabilities Net Minority Interest', 'Stockholders Equity', 'Total Debt', 'Current Liabilities']
      },
      incomeStatement: {
        selected: ['Total Revenue', 'Cost Of Revenue', 'Gross Profit', 'Operating Income', 'Net Income', 'EBITDA', 'Basic EPS', 'Diluted EPS']
      },
      cashFlow: {
        selected: ['Operating Cash Flow', 'Free Cash Flow', 'Capital Expenditure', 'Cash Dividends Paid']
      },
    },
    ratios: {
      'Current Ratio': { formula: 'BS: Current Assets / BS: Current Liabilities', notes: 'Measures short-term liquidity' },
      'Debt to Equity': { formula: 'BS: Total Debt / BS: Stockholders Equity', notes: 'Measures financial leverage' },
      'Gross Margin': { formula: '(IS: Total Revenue - IS: Cost Of Revenue) / IS: Total Revenue', notes: 'Measures profitability after direct costs' },
      'Net Profit Margin': { formula: 'IS: Net Income / IS: Total Revenue', notes: 'Measures overall profitability' },
      'Return on Equity': { formula: 'IS: Net Income / BS: Stockholders Equity', notes: 'Measures return on shareholder investment' },
    },
    tickers: ['AAPL', 'MSFT', 'GOOG'],
    excelTemplate: 'default.xlsm',
  };
}

function loadTemplates() {
  const data = readJson(templatesPath, { templates: [] });
  const templates = Array.isArray(data.templates) ? data.templates : [];

  // Ensure default template always exists
  const hasDefault = templates.some(function (t) { return t && t.id === 'default'; });
  if (!hasDefault) {
    templates.unshift(getDefaultTemplate());
    writeJson(templatesPath, { templates: templates });
  }

  return templates;
}

function saveTemplates(templates) {
  const cleaned = Array.isArray(templates) ? templates.filter(function (t) {
    return t && typeof t === 'object' && t.id;
  }) : [];

  // Always keep the default template
  const hasDefault = cleaned.some(function (t) { return t.id === 'default'; });
  if (!hasDefault) {
    cleaned.unshift(getDefaultTemplate());
  }

  writeJson(templatesPath, { templates: cleaned });
  return cleaned;
}

function loadHomeState() {
  const saved = readJson(homeStatePath, { activeTemplateId: 'default', lastDataFetch: null });
  const activeTemplateId = String(saved && saved.activeTemplateId ? saved.activeTemplateId : 'default');
  const templates = loadTemplates();

  let activeTemplate = null;
  for (const template of templates) {
    if (template && template.id === activeTemplateId) {
      activeTemplate = template;
      break;
    }
  }
  if (!activeTemplate && templates.length) {
    activeTemplate = templates[0];
  }

  return {
    activeTemplateId: activeTemplate ? activeTemplate.id : activeTemplateId,
    activeTemplateName: activeTemplate ? (activeTemplate.name || activeTemplate.id) : activeTemplateId,
    lastDataFetch: saved && saved.lastDataFetch ? saved.lastDataFetch : null,
  };
}

function saveHomeState(partial) {
  const current = readJson(homeStatePath, { activeTemplateId: 'default', lastDataFetch: null });
  const next = Object.assign({}, current, partial || {});
  writeJson(homeStatePath, next);
  return next;
}

ipcMain.handle('finforge:loadTemplates', function () {
  try {
    return { ok: true, templates: loadTemplates() };
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
});

ipcMain.handle('finforge:saveTemplate', function (_event, template) {
  try {
    if (!template || !template.id) {
      return { ok: false, error: 'Template must have an id.' };
    }

    if (template.id === 'default') {
      return { ok: false, error: 'The default template cannot be overwritten.' };
    }

    var templates = loadTemplates();

    // Ensure timestamps
    var now = new Date().toISOString();
    template.updatedAt = now;
    if (!template.createdAt) {
      template.createdAt = now;
    }
    template.isDefault = false;

    var existingIndex = -1;
    for (var i = 0; i < templates.length; i++) {
      if (templates[i].id === template.id) {
        existingIndex = i;
        break;
      }
    }

    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }

    saveTemplates(templates);
    return { ok: true, templates: templates };
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
});

ipcMain.handle('finforge:deleteTemplate', function (_event, templateId) {
  try {
    if (templateId === 'default') {
      return { ok: false, error: 'The default template cannot be deleted.' };
    }

    var templates = loadTemplates();
    templates = templates.filter(function (t) { return t.id !== templateId; });
    saveTemplates(templates);

    // Also delete associated Excel template file if it exists
    var excelPath = path.join(templatesExcelDir, templateId + '.xlsm');
    if (fs.existsSync(excelPath)) {
      try { fs.unlinkSync(excelPath); } catch (_) {}
    }

    return { ok: true, templates: templates };
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
});

ipcMain.handle('finforge:loadTemplate', async function (_event, templateId) {
  try {
    var templates = loadTemplates();
    var template = null;
    for (var i = 0; i < templates.length; i++) {
      if (templates[i].id === templateId) {
        template = templates[i];
        break;
      }
    }

    if (!template) {
      return { ok: false, error: 'Template not found: ' + templateId };
    }

    // Apply template settings to the active files
    if (template.settings) {
      writeJson(statementSettingsPath, template.settings);
    }
    if (template.ratios && typeof template.ratios === 'object') {
      writeJson(ratioConfigPath, template.ratios);
    }
    if (Array.isArray(template.tickers)) {
      writeJson(importListPath, {
        tickers: normalizeTickerList(template.tickers),
        last_updated: new Date().toISOString(),
      });
    }

    // Open Excel template if one is linked
    var excelOpened = false;
    if (template.excelTemplate) {
      var excelPath = path.join(templatesExcelDir, template.excelTemplate);
      if (fs.existsSync(excelPath)) {
        try {
          await openPath(excelPath);
          excelOpened = true;
        } catch (_) {}
      }
    }

    saveHomeState({ activeTemplateId: template.id });

    return {
      ok: true,
      template: template,
      excelOpened: excelOpened,
    };
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
});

ipcMain.handle('finforge:saveExcelTemplate', async function (_event, templateId) {
  try {
    // Copy FinForge.xlsm to templates_excel/{templateId}.xlsm
    if (!fs.existsSync(workbookPath)) {
      return { ok: false, error: 'FinForge.xlsm not found. Run setup first.' };
    }

    fs.mkdirSync(templatesExcelDir, { recursive: true });
    var destPath = path.join(templatesExcelDir, templateId + '.xlsm');
    fs.copyFileSync(workbookPath, destPath);

    // Update template record
    var templates = loadTemplates();
    var template = null;
    for (var i = 0; i < templates.length; i++) {
      if (templates[i].id === templateId) {
        template = templates[i];
        break;
      }
    }

    if (template) {
      template.excelTemplate = templateId + '.xlsm';
      template.updatedAt = new Date().toISOString();
    }

    saveTemplates(templates);
    return { ok: true, templates: templates, excelFile: templateId + '.xlsm' };
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
});

ipcMain.handle('finforge:deleteExcelTemplate', async function (_event, templateId) {
  try {
    var templates = loadTemplates();
    var template = null;
    for (var i = 0; i < templates.length; i++) {
      if (templates[i].id === templateId) {
        template = templates[i];
        break;
      }
    }

    if (!template) {
      return { ok: false, error: 'Template not found: ' + templateId };
    }

    // Delete the associated Excel template file if it exists
    var excelPath = path.join(templatesExcelDir, templateId + '.xlsm');
    if (fs.existsSync(excelPath)) {
      try { fs.unlinkSync(excelPath); } catch (_) {}
    }

    // Remove the excelTemplate reference from the template record
    template.excelTemplate = null;
    template.updatedAt = new Date().toISOString();
    saveTemplates(templates);

    return { ok: true, templates: templates, template: template };
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
});

ipcMain.handle('finforge:replaceWorkbookWithTemplate', async function (_event, templateId) {
  try {
    var templates = loadTemplates();
    var template = null;
    for (var i = 0; i < templates.length; i++) {
      if (templates[i].id === templateId) {
        template = templates[i];
        break;
      }
    }

    if (!template) {
      return { ok: false, error: 'Template not found: ' + templateId };
    }

    // 1. Replace FinForge.xlsm with the template Excel file
    if (template.excelTemplate) {
      var srcPath = path.join(templatesExcelDir, template.excelTemplate);
      if (!fs.existsSync(srcPath)) {
        return { ok: false, error: 'Template Excel file not found: ' + template.excelTemplate };
      }
      fs.mkdirSync(path.dirname(workbookPath), { recursive: true });
      fs.copyFileSync(srcPath, workbookPath);
    }

    // 2. Override all settings files
    if (template.settings) {
      writeJson(statementSettingsPath, template.settings);
    }
    if (template.ratios && typeof template.ratios === 'object') {
      writeJson(ratioConfigPath, template.ratios);
    }
    if (Array.isArray(template.tickers)) {
      writeJson(importListPath, {
        tickers: normalizeTickerList(template.tickers),
        last_updated: new Date().toISOString(),
      });
    }

    saveHomeState({ activeTemplateId: template.id });

    return { ok: true, template: template };
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
});

ipcMain.handle('finforge:openTemplateExcelFile', async function (_event, excelFile) {
  try {
    var excelPath = path.join(templatesExcelDir, excelFile);
    if (!fs.existsSync(excelPath)) {
      return { ok: false, error: 'Excel template file not found: ' + excelFile };
    }

    await openPath(excelPath);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
});

ipcMain.handle('finforge:openTemplateFolder', async function () {
  try {
    fs.mkdirSync(templatesExcelDir, { recursive: true });
    await openPath(templatesExcelDir);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
});

ipcMain.handle('finforge:loadHomeState', function () {
  try {
    return Object.assign({ ok: true }, loadHomeState());
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
});

ipcMain.handle('finforge:setLastDataFetch', function (_event, timestamp) {
  try {
    if (!timestamp || typeof timestamp !== 'string') {
      return { ok: false, error: 'A valid ISO timestamp string is required.' };
    }
    saveHomeState({ lastDataFetch: timestamp });
    return { ok: true, lastDataFetch: timestamp };
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
});

ipcMain.handle('finforge:loadImportList', () => {
  const savedImportList = readJson(importListPath, { tickers: [] });
  return {
    tickers: normalizeTickerList(savedImportList && savedImportList.tickers),
    last_updated: savedImportList && savedImportList.last_updated ? savedImportList.last_updated : '',
    exchanges: savedImportList && savedImportList.exchanges && typeof savedImportList.exchanges === 'object'
      ? savedImportList.exchanges
      : {},
  };
});

ipcMain.handle('finforge:saveImportList', (_event, importList) => {
  try {
    const nextTickers = normalizeTickerList(
      Array.isArray(importList)
        ? importList
        : importList && typeof importList === 'object' && Array.isArray(importList.tickers)
          ? importList.tickers
          : []
    );
    const nextImportList = {
      tickers: nextTickers,
      last_updated: new Date().toISOString(),
    };

    // Preserve exchange/region metadata (populated by the Python fetcher) when
    // the user edits the import list from the terminal.
    const existing = readJson(importListPath, { tickers: [] });
    if (existing && existing.exchanges && typeof existing.exchanges === 'object') {
      nextImportList.exchanges = existing.exchanges;
    }

    writeJson(importListPath, nextImportList);
    return { ok: true, importList: nextImportList };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:fetchTickerData', async (_event, ticker) => {
  try {
    const normalizedTicker = normalizeTickerSymbol(ticker);
    if (!normalizedTicker) {
      return { ok: false, error: 'Invalid ticker symbol' };
    }

    const result = await new Promise((resolve, reject) => {
      const command = [
        'from Internal.ticker_management.fetch_stocks import fetch_ticker_data',
        'from data_management.stock_data_manager import StockDataManager',
        'from datetime import datetime, timedelta',
        `dm = StockDataManager()`,
        `fetch_ticker_data('${normalizedTicker.replaceAll("'", "\\'")}', dm, datetime.now() - timedelta(days=365*5), datetime.now())`,
        `print('OK')`,
      ].join('; ');

      const child = spawn(getPythonCommand(), ['-c', command], {
        cwd: rootDir,
        windowsHide: true,
        env: { ...process.env, PYTHONUTF8: '1' },
      });

      const fetchTimeout = setTimeout(() => {
        if (child) child.kill();
        reject(new Error('Ticker data fetch timed out after 120 seconds.'));
      }, 120000);

      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', (d) => { stderr += d.toString(); });
      child.on('error', (error) => { clearTimeout(fetchTimeout); reject(error); });
      child.on('close', (code) => {
        clearTimeout(fetchTimeout);
        if (code === 0) return resolve({ stdout, stderr });
        reject(new Error((stderr || stdout || `Fetch exited with code ${code}`).trim()));
      });
    });

    return { ok: true, ticker: normalizedTicker, stdout: result.stdout };
  } catch (error) {
    return { ok: false, ticker, error: error && error.message ? error.message : String(error) };
  }
});

ipcMain.handle('finforge:checkTickerDataStatus', async (_event, ticker) => {
  try {
    const normalizedTicker = normalizeTickerSymbol(ticker);
    if (!normalizedTicker) {
      return { ok: false, error: 'Invalid ticker symbol' };
    }

    const result = await new Promise((resolve, reject) => {
      const command = [
        'from pathlib import Path',
        'import json',
        'from datetime import datetime',
        `p = Path('data/prices/${normalizedTicker}.parquet')`,
        `m = Path('data/metadata/${normalizedTicker}.json')`,
        `bs = Path('data/fundamentals/balance_sheet/${normalizedTicker}.parquet')`,
        `is_ = Path('data/fundamentals/income_statement/${normalizedTicker}.parquet')`,
        `cf = Path('data/fundamentals/cash_flow/${normalizedTicker}.parquet')`,
        `p_time = datetime.fromtimestamp(p.stat().st_mtime).isoformat() if p.exists() else None`,
        `m_time = datetime.fromtimestamp(m.stat().st_mtime).isoformat() if m.exists() else None`,
        `print(json.dumps({'hasPrices': p.exists(), 'hasMetadata': m.exists(), 'hasBalanceSheet': bs.exists(), 'hasIncomeStatement': is_.exists(), 'hasCashFlow': cf.exists(), 'pricesUpdatedAt': p_time, 'metadataUpdatedAt': m_time}))`,
      ].join('\n');

      const child = spawn(getPythonCommand(), ['-c', command], {
        cwd: rootDir,
        windowsHide: true,
        env: { ...process.env, PYTHONUTF8: '1' },
      });

      const statusTimeout = setTimeout(() => {
        if (child) child.kill();
        reject(new Error('Status check timed out after 30 seconds.'));
      }, 30000);

      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', (d) => { /* ignore */ });
      child.on('error', (error) => { clearTimeout(statusTimeout); reject(error); });
      child.on('close', (code) => {
        clearTimeout(statusTimeout);
        if (code === 0) {
          try { return resolve(JSON.parse(stdout.trim())); }
          catch { return resolve({}); }
        }
        reject(new Error(`Status check exited with code ${code}`));
      });
    });

    const isReady = !!(result.hasPrices && result.hasMetadata);
    return {
      ok: true,
      ticker: normalizedTicker,
      status: isReady ? 'ready' : 'pending',
      lastFetched: result.pricesUpdatedAt || result.metadataUpdatedAt || null,
      details: result,
    };
  } catch (error) {
    return { ok: false, ticker, error: error && error.message ? error.message : String(error) };
  }
});

ipcMain.handle('finforge:checkAllTickersDataStatus', async (_event, tickers) => {
  try {
    const list = Array.isArray(tickers) ? tickers : [];
    if (!list.length) return { ok: true, statuses: {} };

    const result = await new Promise((resolve, reject) => {
      const command = [
        'from pathlib import Path',
        'import json',
        'from datetime import datetime',
        `tickers = ${JSON.stringify(list)}`,
        `result = {}`,
        `for t in tickers:`,
        `    p = Path('data/prices/' + t + '.parquet')`,
        `    m = Path('data/metadata/' + t + '.json')`,
        `    p_time = datetime.fromtimestamp(p.stat().st_mtime).isoformat() if p.exists() else None`,
        `    m_time = datetime.fromtimestamp(m.stat().st_mtime).isoformat() if m.exists() else None`,
        `    result[t] = { 'hasPrices': p.exists(), 'hasMetadata': m.exists(), 'pricesUpdatedAt': p_time, 'metadataUpdatedAt': m_time }`,
        `print(json.dumps(result))`,
      ].join('\n');

      const child = spawn(getPythonCommand(), ['-c', command], {
        cwd: rootDir,
        windowsHide: true,
        env: { ...process.env, PYTHONUTF8: '1' },
      });

      const bulkTimeout = setTimeout(() => {
        if (child) child.kill();
        reject(new Error('Bulk status check timed out after 30 seconds.'));
      }, 30000);

      let stdout = '';
      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', () => { /* drain stderr pipe to prevent blocking */ });
      child.on('error', (error) => { clearTimeout(bulkTimeout); reject(error); });
      child.on('close', (code) => {
        clearTimeout(bulkTimeout);
        if (code === 0) {
          try { return resolve(JSON.parse(stdout.trim())); }
          catch { return resolve({}); }
        }
        reject(new Error(`Bulk status check exited with code ${code}`));
      });
    });

    const statuses = {};
    const timestamps = {};
    for (const ticker of list) {
      const d = result[ticker] || {};
      statuses[ticker] = !!(d.hasPrices && d.hasMetadata) ? 'ready' : 'pending';
      timestamps[ticker] = d.pricesUpdatedAt || d.metadataUpdatedAt || null;
    }

    return { ok: true, statuses, timestamps };
  } catch (error) {
    return { ok: false, error: error && error.message ? error.message : String(error) };
  }
});

ipcMain.handle('finforge:searchTickerUniverse', async (_event, query) => {
  try {
    return {
      ok: true,
      results: await searchTickerUniverse(query),
    };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:loadCompanyProfile', async (_event, ticker) => {
  try {
    const normalizedTicker = normalizeTickerSymbol(ticker);
    if (!normalizedTicker) {
      return {
        ok: false,
        error: 'Ticker symbol is required',
      };
    }

    return {
      ok: true,
      profile: await loadCompanyProfile(normalizedTicker),
    };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:loadCompanyReports', async (_event, ticker, refresh) => {
  try {
    const normalizedTicker = normalizeTickerSymbol(ticker);
    if (!normalizedTicker) {
      return {
        ok: false,
        error: 'Ticker symbol is required',
      };
    }

    return {
      ok: true,
      reports: await loadCompanyReports(normalizedTicker, Boolean(refresh)),
    };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:loadStatementSettings', () => {
  return readJson(statementSettingsPath, {
    mode: 'balanceSheet',
    frequency: 'annual',
    periods: { annual: {}, quarterly: {} },
    display: { mode: 'millions', divisor: 1000000 },
    balanceSheet: { selected: [] },
    incomeStatement: { selected: [] },
    cashFlow: { selected: [] },
  });
});

ipcMain.handle('finforge:saveStatementSettings', (_event, settings) => {
  try {
    writeJson(statementSettingsPath, settings);
    return { ok: true, settings };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:importStatement', async (_event, scope) => {
  try {
    const normalizedScope = scope === 'incomeStatement' ? 'incomeStatement' : scope === 'cashFlow' ? 'cashFlow' : 'balanceSheet';
    const result = await runPythonImport(normalizedScope);
    return {
      ok: true,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:refreshRatiosSheet', async () => {
  try {
    if (!existsAtPath(workbookPath)) {
      return {
        ok: false,
        error: 'FinForge workbook was not found. Run setup.bat to create it.',
      };
    }

    const result = await new Promise((resolve, reject) => {
      const child = spawn(getPythonCommand(), ['-c', buildRatioRefreshCommand()], {
        cwd: rootDir,
        windowsHide: true,
        env: {
          ...process.env,
          PYTHONUTF8: '1',
        },
      });

      const ratioTimeout = setTimeout(() => {
        if (child) { child.kill(); }
        reject(new Error('Ratio refresh timed out after 120 seconds.'));
      }, 120000);

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('error', (error) => {
        clearTimeout(ratioTimeout);
        reject(error);
      });

      child.on('close', (code) => {
        clearTimeout(ratioTimeout);
        if (code === 0) {
          resolve({ stdout, stderr });
          return;
        }

        reject(new Error((stderr || stdout || `Ratio refresh exited with code ${code}`).trim()));
      });
    });
    return {
      ok: true,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:loadRatios', () => {
  return readJson(ratioConfigPath, {});
});

ipcMain.handle('finforge:saveRatios', (_event, ratios) => {
  try {
    writeJson(ratioConfigPath, ratios);
    return { ok: true, ratios };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:loadFolders', () => {
  return readJson(folderConfigPath, []);
});

ipcMain.handle('finforge:saveFolders', (_event, folders) => {
  try {
    writeJson(folderConfigPath, folders);
    return { ok: true, folders };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:loadSheetRatios', async () => {
  try {
    const result = await new Promise((resolve, reject) => {
      const child = spawn(getPythonCommand(), ['-c',
        'from Internal.Ratios.ratio_calculator import get_sheet_ratio_names; import json; print(json.dumps(get_sheet_ratio_names()))'
      ], {
        cwd: rootDir,
        windowsHide: true,
        env: { ...process.env, PYTHONUTF8: '1' },
      });
      const sheetTimeout = setTimeout(() => {
        if (child) { child.kill(); }
        reject(new Error('Load sheet ratios timed out after 60 seconds.'));
      }, 60000);
      let stdout = '';
      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', (d) => { /* ignore */ });
      child.on('error', (error) => {
        clearTimeout(sheetTimeout);
        reject(error);
      });
      child.on('close', (code) => {
        clearTimeout(sheetTimeout);
        if (code === 0) return resolve(stdout.trim());
        reject(new Error(`Exited with code ${code}`));
      });
    });
    const names = JSON.parse(result);
    return { ok: true, names: Array.isArray(names) ? names : [] };
  } catch (error) {
    return { ok: true, names: [] };
  }
});

ipcMain.handle('finforge:syncAssignedRatios', async (_event, ratioNames) => {
  try {
    const namesJson = JSON.stringify(Array.isArray(ratioNames) ? ratioNames : []);
    const result = await new Promise((resolve, reject) => {
      const child = spawn(getPythonCommand(), ['-c', buildSyncAssignedRatiosCommand(namesJson)], {
        cwd: rootDir,
        windowsHide: true,
        env: { ...process.env, PYTHONUTF8: '1' },
      });
      const syncTimeout = setTimeout(() => {
        if (child) { child.kill(); }
        reject(new Error('Sync assigned ratios timed out after 60 seconds.'));
      }, 60000);
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', (d) => { stderr += d.toString(); });
      child.on('error', (error) => {
        clearTimeout(syncTimeout);
        reject(error);
      });
      child.on('close', (code) => {
        clearTimeout(syncTimeout);
        if (code === 0) return resolve({ stdout, stderr });
        reject(new Error((stderr || stdout || `Sync exited with code ${code}`).trim()));
      });
    });
    return { ok: true, stdout: result.stdout };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

// ── Visualize: Compute Historical Metric Values ──

function buildMetricHistoryCommand(payloadJson) {
  const escaped = payloadJson.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
  return `from Internal.Ratios.metric_history import compute_metric_history_entry; compute_metric_history_entry('${escaped}')`;
}

ipcMain.handle('finforge:computeMetricHistory', async (_event, payload) => {
  // payload: { mode: "batch", requests: [{ticker, metricName, formula}, ...] }
  //   or: { mode: "single", ticker, metricName, formula }
  try {
    const payloadJson = JSON.stringify(payload);
    const result = await new Promise((resolve, reject) => {
      const child = spawn(getPythonCommand(), ['-c', buildMetricHistoryCommand(payloadJson)], {
        cwd: rootDir,
        windowsHide: true,
        env: { ...process.env, PYTHONUTF8: '1' },
      });
      const computeTimeout = setTimeout(() => {
        if (child) { child.kill(); }
        reject(new Error('Metric history computation timed out after 120 seconds.'));
      }, 120000);
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', (d) => { stderr += d.toString(); });
      child.on('error', (error) => {
        clearTimeout(computeTimeout);
        reject(error);
      });
      child.on('close', (code) => {
        clearTimeout(computeTimeout);
        if (code === 0) {
          try {
            const parsed = JSON.parse(stdout.trim());
            return resolve(parsed);
          } catch (parseErr) {
            return reject(new Error('Failed to parse metric history output: ' + parseErr.message));
          }
        }
        reject(new Error((stderr || stdout || `Metric history exited with code ${code}`).trim()));
      });
    });
    return { ok: true, data: result };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

// ── Ranking: Latest Metric Values for the Ranking Tab ──

function buildRankingCommand(payloadJson) {
  const escaped = payloadJson.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
  return `from Internal.Ranking.ranking_entry import ranking_entry; ranking_entry('${escaped}')`;
}

ipcMain.handle('finforge:computeRanking', async (_event, payload) => {
  // payload: { tickers: [...], metrics: [{ name, formula }, ...] }
  try {
    const payloadJson = JSON.stringify(payload || {});
    const result = await new Promise((resolve, reject) => {
      const child = spawn(getPythonCommand(), ['-c', buildRankingCommand(payloadJson)], {
        cwd: rootDir,
        windowsHide: true,
        env: { ...process.env, PYTHONUTF8: '1' },
      });
      const rankingTimeout = setTimeout(() => {
        if (child) { child.kill(); }
        reject(new Error('Ranking computation timed out after 120 seconds.'));
      }, 120000);
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', (d) => { stderr += d.toString(); });
      child.on('error', (error) => {
        clearTimeout(rankingTimeout);
        reject(error);
      });
      child.on('close', (code) => {
        clearTimeout(rankingTimeout);
        if (code === 0) {
          try {
            return resolve(JSON.parse(stdout.trim()));
          } catch (parseErr) {
            return reject(new Error('Failed to parse ranking output: ' + parseErr.message));
          }
        }
        reject(new Error((stderr || stdout || `Ranking exited with code ${code}`).trim()));
      });
    });
    // The Python entry already returns { ok, ... }; normalize for the renderer.
    return result && typeof result === 'object' ? result : { ok: false, error: 'Empty ranking response' };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:loadRankingPresets', () => {
  const data = readJson(rankingPresetsPath, { presets: [] });
  return { ok: true, presets: Array.isArray(data && data.presets) ? data.presets : [] };
});

ipcMain.handle('finforge:saveRankingPresets', (_event, presets) => {
  writeJson(rankingPresetsPath, { presets: Array.isArray(presets) ? presets : [] });
  return { ok: true };
});

// ── Export Ratios Time Series ──

function buildExportRatiosTimeseriesCommand(payloadJson) {
  const escaped = payloadJson.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
  return `from Internal.Ratios.export_ratios_timeseries import export_ratios_timeseries_entry; export_ratios_timeseries_entry('${escaped}')`;
}

ipcMain.handle('finforge:exportRatiosTimeseries', async (_event, payload) => {
  // payload: { tickers: [...], metrics: [{ name, formula }, ...] }
  try {
    if (!existsAtPath(workbookPath)) {
      return {
        ok: false,
        error: 'FinForge workbook was not found. Run setup.bat to create it.',
      };
    }

    const payloadJson = JSON.stringify(payload || {});
    const result = await new Promise((resolve, reject) => {
      const child = spawn(getPythonCommand(), ['-c', buildExportRatiosTimeseriesCommand(payloadJson)], {
        cwd: rootDir,
        windowsHide: true,
        env: { ...process.env, PYTHONUTF8: '1' },
      });
      const exportTimeout = setTimeout(() => {
        if (child) { child.kill(); }
        reject(new Error('Ratios export timed out after 120 seconds.'));
      }, 120000);
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', (d) => { stderr += d.toString(); });
      child.on('error', (error) => {
        clearTimeout(exportTimeout);
        reject(error);
      });
      child.on('close', (code) => {
        clearTimeout(exportTimeout);
        if (code === 0) {
          try {
            const parsed = JSON.parse(stdout.trim());
            return resolve(parsed);
          } catch (parseErr) {
            return reject(new Error('Failed to parse ratios export output: ' + parseErr.message));
          }
        }
        reject(new Error((stderr || stdout || `Ratios export exited with code ${code}`).trim()));
      });
    });

    if (result && result.ok) {
      return { ok: true, data: result };
    }
    return { ok: false, error: (result && result.error) || 'Ratios export failed.' };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

// ── Statement Periods: List available reporting dates ──

function buildStatementPeriodsCommand(frequency, tickersJson) {
  const escapedFrequency = String(frequency || 'annual').replaceAll('\\', '\\\\').replaceAll("'", "\\'");
  const escapedTickers = String(tickersJson || '[]').replaceAll('\\', '\\\\').replaceAll("'", "\\'");
  return `from Importing.statement_periods import list_statement_periods_entry; list_statement_periods_entry('${escapedFrequency}', '${escapedTickers}')`;
}

ipcMain.handle('finforge:getStatementPeriods', async (_event, frequency, tickers) => {
  try {
    const tickersJson = JSON.stringify(Array.isArray(tickers) ? tickers : []);
    const result = await new Promise((resolve, reject) => {
      const child = spawn(getPythonCommand(), ['-c', buildStatementPeriodsCommand(frequency, tickersJson)], {
        cwd: rootDir,
        windowsHide: true,
        env: { ...process.env, PYTHONUTF8: '1' },
      });
      const periodTimeout = setTimeout(() => {
        if (child) { child.kill(); }
        reject(new Error('Statement period listing timed out after 60 seconds.'));
      }, 60000);
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', (d) => { stderr += d.toString(); });
      child.on('error', (error) => {
        clearTimeout(periodTimeout);
        reject(error);
      });
      child.on('close', (code) => {
        clearTimeout(periodTimeout);
        if (code === 0) {
          try {
            return resolve(JSON.parse(stdout.trim()));
          } catch (parseErr) {
            return reject(new Error('Failed to parse statement periods output: ' + parseErr.message));
          }
        }
        reject(new Error((stderr || stdout || `Statement periods exited with code ${code}`).trim()));
      });
    });
    return { ok: true, data: result };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:getLauncherStatus', () => {
  return getLauncherStatus();
});

ipcMain.handle('finforge:checkSystemHealth', async () => {
  try {
    return await checkSystemHealth();
  } catch (error) {
    return {
      setupComplete: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:openWorkbook', async () => {
  try {
    if (!existsAtPath(workbookPath)) {
      return {
        ok: false,
        error: 'FinForge workbook was not found. Run setup.bat to create it.',
      };
    }

    await openPath(workbookPath);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:openProjectRoot', async () => {
  try {
    await openPath(rootDir);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:openDataFolder', async () => {
  try {
    if (!existsAtPath(dataDir)) {
      return {
        ok: false,
        error: 'Data folder was not found.',
      };
    }

    await openPath(dataDir);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:runSetupScript', async () => {
  try {
    if (!existsAtPath(setupBatchPath)) {
      return {
        ok: false,
        error: 'setup.bat was not found in the project root.',
      };
    }

    // Execute setup.bat in a new terminal window instead of opening in text editor
    const child = spawn('cmd.exe', ['/c', 'start', 'FinForge Setup', setupBatchPath], {
      cwd: rootDir,
      detached: true,
      stdio: 'ignore',
    });
    child.unref();

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

ipcMain.handle('finforge:runUninstallScript', async () => {
  try {
    if (!existsAtPath(uninstallBatchPath)) {
      return {
        ok: false,
        error: 'uninstall.bat was not found in the project root.',
      };
    }

    // Execute uninstall.bat in a new terminal window instead of opening in text editor
    const child = spawn('cmd.exe', ['/c', 'start', 'FinForge Uninstall', uninstallBatchPath], {
      cwd: rootDir,
      detached: true,
      stdio: 'ignore',
    });
    child.unref();

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

function createMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
    return mainWindow;
  }

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#040b18',
    title: 'FinForge Home',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

function createLauncherWindow() {
  if (launcherWindow && !launcherWindow.isDestroyed()) {
    launcherWindow.show();
    launcherWindow.focus();
    return launcherWindow;
  }

  launcherWindow = new BrowserWindow({
    width: 760,
    height: 760,
    minWidth: 520,
    minHeight: 520,
    resizable: true,
    backgroundColor: '#040b18',
    title: 'FinForge Launcher',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  launcherWindow.loadFile(path.join(__dirname, 'src', 'launcher.html'));
  launcherWindow.on('closed', () => {
    launcherWindow = null;
  });

  return launcherWindow;
}

ipcMain.handle('finforge:openImportWindow', (_event, options) => {
  const importWindow = createMainWindow();
  const shouldCloseLauncher = options && options.closeLauncher === true;

  if (shouldCloseLauncher && launcherWindow && !launcherWindow.isDestroyed()) {
    launcherWindow.close();
  }

  return {
    ok: true,
    opened: Boolean(importWindow),
  };
});

function buildResearchSearchCommand(query, source) {
  var escapedQuery = (query || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  var escapedGoogleQuery = ((query || '') + ' filetype:pdf').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return (
    'import sys\n' +
    'sys.path.insert(0, ' + JSON.stringify(rootDir) + ')\n' +
    'from Internal.Research.research_paper_search import search_papers, search_papers_google, is_whoogle_running, start_whoogle\n' +
    'import json\n' +
    '\n' +
    'ddg_failed = False\n' +
    "print('__STATUS__:Searching for research papers...', file=sys.stderr, flush=True)\n" +
    "try:\n" +
    "  r = search_papers('" + escapedQuery + "', max_results=15)\n" +
    "except Exception as ddg_err:\n" +
    "  ddg_failed = True\n" +
    "  print('__STATUS__:WARNING:DuckDuckGo unavailable (' + str(ddg_err) + '), trying Google...', file=sys.stderr, flush=True)\n" +
    "  r = []\n" +
    "\n" +
    '# Step 2: If DuckDuckGo returned few results or failed, try Google/Whoogle as fallback\n' +
    "if ddg_failed or len(r) < 3:\n" +
    "  if not is_whoogle_running():\n" +
    "    print('__STATUS__:Starting Whoogle search server for better results...', file=sys.stderr, flush=True)\n" +
    "    started = start_whoogle()\n" +
    "    if not started:\n" +
    "      print('__STATUS__:WARNING:Google search not available. Results may be limited.', file=sys.stderr, flush=True)\n" +
    "    else:\n" +
    "      print('__STATUS__:Google server ready, fetching additional papers...', file=sys.stderr, flush=True)\n" +
    "      try:\n" +
    "        google_results = search_papers_google('" + escapedGoogleQuery + "', max_results=20)\n" +
    "        existing_urls = set(item['url'] for item in r)\n" +
    "        for item in google_results:\n" +
    "          if item['url'] not in existing_urls:\n" +
    "            r.append(item)\n" +
    "            existing_urls.add(item['url'])\n" +
    "      except Exception as gg_err:\n" +
    "        print('__STATUS__:WARNING:Google search failed, using DuckDuckGo results.', file=sys.stderr, flush=True)\n" +
    "  else:\n" +
    "    print('__STATUS__:Fetching additional papers from Google...', file=sys.stderr, flush=True)\n" +
    "    try:\n" +
    "      google_results = search_papers_google('" + escapedGoogleQuery + "', max_results=20)\n" +
    "      existing_urls = set(item['url'] for item in r)\n" +
    "      for item in google_results:\n" +
    "        if item['url'] not in existing_urls:\n" +
    "          r.append(item)\n" +
    "          existing_urls.add(item['url'])\n" +
    "    except Exception as gg_err:\n" +
    "      print('__STATUS__:WARNING:Google search failed, using DuckDuckGo results.', file=sys.stderr, flush=True)\n" +
    "\n" +
    "print('__STATUS__:Found ' + str(len(r)) + ' research papers.', file=sys.stderr, flush=True)\n" +
    'print(json.dumps(r, ensure_ascii=True))'
  );
}

ipcMain.handle('finforge:searchResearchPapers', async (_event, query, source) => {
  try {
    if (!query || typeof query !== 'string' || !query.trim()) {
      return { ok: false, error: 'Search query is required.', results: [] };
    }

    var result = await new Promise(function (resolve, reject) {
      var child = spawn(getPythonCommand(), ['-c', buildResearchSearchCommand(query, source)], {
        cwd: rootDir,
        windowsHide: true,
        env: { ...process.env, PYTHONUTF8: '1' },
      });

      var searchTimeout = setTimeout(function () {
        if (child) { child.kill(); }
        reject(new Error('Research search timed out after 40 seconds.'));
      }, 40000);

      var stdout = '';
      var stderr = '';

      child.stdout.on('data', function (d) { stdout += d.toString(); });
      child.stderr.on('data', function (d) {
        var text = d.toString();
        stderr += text;
        // Forward progress status lines to the renderer (including WARNING and ERROR)
        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (line.indexOf('__STATUS__:') === 0) {
            var status = line.substring('__STATUS__:'.length);
            try {
              _event.sender.send('finforge:researchProgress', { status: status });
            } catch (_) {}
          }
        }
      });

      child.on('error', function (error) {
        clearTimeout(searchTimeout);
        reject(error);
      });

      child.on('close', function (code) {
        clearTimeout(searchTimeout);
        if (code === 0) {
          try {
            resolve(JSON.parse(stdout || '[]'));
          } catch (parseError) {
            reject(new Error('Failed to parse search results: ' + (parseError.message || parseError)));
          }
        } else {
          // Filter out __STATUS__ lines from stderr for a cleaner error message
          var cleanStderr = stderr.split('\n').filter(function (l) {
            return l.indexOf('__STATUS__:') !== 0;
          }).join('\n').trim();
          reject(new Error((cleanStderr || stdout || 'Research search exited with code ' + code).trim()));
        }
      });
    });

    return { ok: true, results: result };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
      results: [],
    };
  }
});

ipcMain.handle('finforge:openExternalUrl', async (_event, url) => {
  try {
    if (url && typeof url === 'string') {
      await shell.openExternal(url);
      return { ok: true };
    }
    return { ok: false, error: 'Invalid URL provided.' };
  } catch (error) {
    return {
      ok: false,
      error: error && error.message ? error.message : String(error),
    };
  }
});

app.whenReady().then(() => {
  if (getInitialWindowMode() === 'workspace') {
    createMainWindow();
  } else {
    createLauncherWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      if (getInitialWindowMode() === 'workspace') {
        createMainWindow();
      } else {
        createLauncherWindow();
      }
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
