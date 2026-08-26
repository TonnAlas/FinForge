# Vendored UI Assets Guide

## Purpose

The Electron UI previously loaded Plotly and the Tailwind CSS runtime from
third-party CDNs. A fresh download with no internet connection, or an
environment that blocks CDN traffic, lost all charting and most styling.

This guide documents the local (vendored) copies that now ship with the
project so the UI works without an internet connection.

## Files

- ElectronHome/src/vendor/plotly-3.0.1.min.js - Plotly.js v3.0.1 charting
  library, downloaded from https://cdn.plot.ly/plotly-3.0.1.min.js (4,653,932
  bytes).
- ElectronHome/src/vendor/tailwind.min.js - Tailwind CSS runtime (Play CDN
  build) with the forms and container-queries plugins enabled, downloaded from
  https://cdn.tailwindcss.com?plugins=forms,container-queries (418,973 bytes).
  Used by ElectronHome/src/index.html.
- ElectronHome/src/vendor/tailwind.launcher.min.js - Tailwind CSS runtime
  (Play CDN build) without extra plugins, downloaded from
  https://cdn.tailwindcss.com (407,279 bytes). Used by
  ElectronHome/src/launcher.html.

## How it works

1. ElectronHome/src/index.html loads ./vendor/tailwind.min.js and
   ./vendor/plotly-3.0.1.min.js instead of the CDN equivalents.
2. ElectronHome/src/launcher.html loads ./vendor/tailwind.launcher.min.js
   instead of the CDN equivalent.
3. The inline tailwind.config block in each HTML file is unchanged; the
   vendored Tailwind runtime reads it exactly like the CDN version does.
4. Google Fonts and Material Symbols remain loaded from fonts.googleapis.com
   as progressive enhancement. Each page already declares a system font
   fallback (sans-serif / monospace), so an offline start still renders with
   local fonts.

## Configuration and environment requirements

- No build step or internet connection is required at runtime.
- If the vendor files are replaced, keep the same file names or update the
  script src attributes in the two HTML files.
- The two Tailwind builds are intentionally separate because index.html
  enables the forms and container-queries plugins while launcher.html does
  not.

## Updating a vendored asset

To upgrade, re-download the matching URL into the same file name:

- Plotly: download https://cdn.plot.ly/plotly-X.Y.Z.min.js and rename it to
  plotly-X.Y.Z.min.js, then update the script src in index.html.
- Tailwind (index): download
  https://cdn.tailwindcss.com?plugins=forms,container-queries and save as
  tailwind.min.js.
- Tailwind (launcher): download https://cdn.tailwindcss.com and save as
  tailwind.launcher.min.js.

## Limitations

- The vendored Tailwind runtime still prints a console warning that the Play
  CDN build is not intended for production. It is functionally equivalent to
  the CDN version and safe for this offline-first desktop use case.
- The Plotly bundle includes a default topojson URL pointing at cdn.plot.ly,
  which is only used by advanced map traces that FinForge does not render.
