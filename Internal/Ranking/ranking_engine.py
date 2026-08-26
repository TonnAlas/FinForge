"""
Ranking data layer.

Resolves the latest value of each requested metric for each requested ticker by
reusing the existing metric formula engine (``Internal.Ratios.metric_history``).

Scoring itself is intentionally kept OUT of this module and lives in the
ElectronHome renderer, so curve edits recompute instantly without a round-trip.
"""

from Internal.Ratios.metric_history import compute_metric_history_batch


def _last_value(history_entry):
    """Return the most recent non-null value from a history entry."""
    values = (history_entry or {}).get("values") or []
    for value in reversed(values):
        if value is not None:
            return value
    return None


def compute_latest_metric_values(tickers, metrics):
    """
    Compute the latest value of each metric for each ticker.

    Args:
        tickers: list[str] of ticker symbols (already normalized uppercase).
        metrics: list[dict] with keys ``name`` and ``formula``.

    Returns:
        dict of ``{ticker: {metric_name: float | None}}``.
    """
    requests = []
    for ticker in tickers:
        for metric in metrics:
            requests.append({
                "ticker": ticker,
                "metricName": metric.get("name", ""),
                "formula": metric.get("formula", ""),
            })

    history = compute_metric_history_batch(requests)  # {"TICKER|METRIC": {...}}

    result = {}
    for ticker in tickers:
        result[ticker] = {}
        for metric in metrics:
            key = f"{ticker}|{metric.get('name', '')}"
            result[ticker][metric.get("name", "")] = _last_value(history.get(key))

    return result
