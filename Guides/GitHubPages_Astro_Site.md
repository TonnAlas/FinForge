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
| `.github/public-workflows/deploy.yml` | Template for the public repository Pages deploy workflow. |
| `.github/workflows/publish-public.yml` | Mirror workflow; publishes only the Pages workflow to the public repo. |

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
2. `publish-public.yml` syncs `main` to `TonnAlas/FinForge` and copies `.github/public-workflows/deploy.yml` into the public repository as `.github/workflows/deploy.yml`.
3. The push to the public repository `main` branch triggers the public `deploy.yml` workflow.
4. `withastro/action` builds the site and uploads a Pages artifact; `actions/deploy-pages` publishes it.

The public repository Pages settings must use **Build and deployment > Source: GitHub Actions**.

## Notes and constraints

- The mirror workflow deletes `.github/workflows` in the public repository and republishes only `deploy.yml`. Private workflows never leak to the public repository.
- Astro 7 requires Node.js >= 22.12. The deploy workflow pins `node-version: 22`.
- `node_modules/`, `dist/`, and `.astro/` are gitignored and never mirrored.
- The site has no backend; all content is static and does not require secrets or environment variables.
