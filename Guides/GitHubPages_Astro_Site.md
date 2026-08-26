# GitHub Pages Astro Site Guide

This guide documents the FinForge marketing and documentation website, built with Astro and deployed to GitHub Pages from the public repository `TonnAlas/FinForge`.

## Purpose

The site provides a landing page and documentation for FinForge, served at:

`https://tonnalas.github.io/FinForge/`

## Directory structure

| Path | Purpose |
| --- | --- |
| `website/astro.config.mjs` | Astro configuration (site URL, base path, static output). |
| `website/package.json` | Project manifest and npm scripts. |
| `website/src/styles/global.css` | Design tokens and component styles (Institutional Terminal system). |
| `website/src/layouts/Layout.astro` | Shared page shell: head, header, navigation, footer. |
| `website/src/pages/index.astro` | Landing page. |
| `website/src/pages/docs/index.astro` | Documentation overview. |
| `website/src/pages/docs/installation.astro` | Installation guide. |
| `website/src/pages/docs/features.astro` | Feature reference. |
| `website/public/favicon.svg` | Site icon. |
| `.github/workflows/deploy-website.yml` | Private workflow that builds the site and publishes only the compiled output to the public repo's `gh-pages` branch. |
| `.github/workflows/publish-public.yml` | Mirror workflow; syncs the app to the public repo and strips `website/` (no website source or workflows ship). |

## Configuration

### astro.config.mjs

- `site`: `https://tonnalas.github.io`
- `base`: `/FinForge/` (required because GitHub Pages serves the site under the repository name)
- `output`: `static` (default; produces a fully static `dist/`)

If the repository is renamed or a custom domain is added, update `base` (and optionally `site`) accordingly.

## Local development

```powershell
cd website
npm install
npm run dev
```

- `npm run build` builds the static site into `website/dist/`.
- `npm run preview` serves the build output locally.
- `npm run astro check` type-checks the project when `@astrojs/check` is installed.

## Design system

The site implements the "Institutional Terminal" design system defined in `.github/Design_guidlines/stitch_finforge/institutional_terminal/DESIGN.md`:

- Background: near-black deep blue (`#040b18`).
- Primary: `#adc6ff` (blue), secondary: `#4edea3` (green), tertiary: `#ffb95f` (amber).
- Headings, labels, and data use `JetBrains Mono`; body copy uses `Inter`.
- Sharp corners (0px radius), 4px baseline grid, 1px borders instead of shadows.

## Deployment flow

1. Changes under `website/**` are pushed to the private repository `main` branch.
2. `deploy-website.yml` (private) builds the Astro site with Node 22 and publishes only `website/dist/` to the public repository's `gh-pages` branch via `peaceiris/actions-gh-pages`.
3. GitHub Pages on `TonnAlas/FinForge` serves the compiled `gh-pages` branch.

The public repository Pages settings must use **Build and deployment > Source: Deploy from a branch** with branch `gh-pages` and directory `/ (root)`.

## Notes and constraints

- The mirror workflow deletes `.github/workflows` and `.github/public-workflows` in the public repository and strips `website/`, so no website source or workflows ever ship to the public `main` branch. Only the compiled static site on the `gh-pages` branch is public.
- The compiled `gh-pages` branch is public (required to serve the site); Astro source, content markdown, and config remain private.
- `FINFORGE_TOKEN` must be a classic PAT with the `repo` scope; the `workflow` scope is no longer required since no workflow files are pushed to the public repo.
- Astro 7 requires Node.js >= 22.12. The deploy workflow pins `node-version: 22`.
- `node_modules/`, `dist/`, and `.astro/` are gitignored and never mirrored.
- The site has no backend; all content is static and does not require secrets or environment variables.
