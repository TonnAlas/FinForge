"""
IPC entry point for the ElectronHome Ranking tab.

Payload: ``{ tickers: [str], metrics: [{ name, formula }] }``
Prints ``{ ok: true, values: {ticker: {metric: value}} }`` to stdout as JSON.
"""

import json

from Internal.Ranking.ranking_engine import compute_latest_metric_values


def ranking_entry(json_payload):
    try:
        payload = json.loads(json_payload)
    except json.JSONDecodeError as error:
        print(json.dumps({"ok": False, "error": f"Invalid JSON: {error}"}))
        return

    tickers = [str(t).strip().upper() for t in (payload.get("tickers") or []) if str(t).strip()]
    metrics = []
    for metric in payload.get("metrics") or []:
        if not isinstance(metric, dict):
            continue
        name = str(metric.get("name") or "").strip()
        if not name:
            continue
        metrics.append({"name": name, "formula": str(metric.get("formula") or "")})

    try:
        values = compute_latest_metric_values(tickers, metrics)
    except Exception as error:  # noqa: BLE001 - report any failure to the UI
        print(json.dumps({"ok": False, "error": str(error)}))
        return

    print(json.dumps({"ok": True, "values": values}, ensure_ascii=True))
