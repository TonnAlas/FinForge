# Publish Public Workflow Guide

## Purpose
Mirror source `main` branch content into a separate target repository branch.

## Workflow File
- `.github/workflows/publish-public.yml`

## Current Configuration
- `TARGET_REPO`: `TonnAlas/FinForge`
- `TARGET_BRANCH`: `main`
- `INCLUDE_WORKFLOWS`: `false`

## Why Your Push Failed
GitHub rejected the push because your token tried to create/update `.github/workflows/publish-public.yml` in the target repository, but the Personal Access Token does not have `workflow` scope.

## What The Workflow Does Now
1. Creates a snapshot from source branch.
2. Clones target repository.
3. Replaces target content with snapshot.
4. Removes `.github/workflows` when `INCLUDE_WORKFLOWS` is not `true`.
5. Commits and force-pushes target branch.

## How To Include Workflow Files In Target
If you want `.github/workflows/*` copied too, do both:
1. Use a token that can update workflow files in target repo.
2. Set `INCLUDE_WORKFLOWS: "true"` in workflow env.

## Token Requirements
- Must have write access to target repository.
- If publishing `.github/workflows/*`, token must include permission to modify workflow files.

## Notes
- Only tracked files from source git history are published.
- Branch protection on target may still block force-pushes.
