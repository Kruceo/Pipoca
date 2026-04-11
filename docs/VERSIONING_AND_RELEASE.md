# Versioning and Release

This guide shows how to combine **Pipoca** with a release workflow so every push automatically bumps the version **and** creates a GitHub Release with build artifacts.

## How it works

```
push → Version Updater (bumps version) → Build & Release (creates release + artifacts)
```

1. **Version Updater** — runs on every push, calculates the new version from commit history, updates `package.json`, and pushes back.
2. **Build & Release** — triggered after the version bump, reads the new version from `package.json`, creates a GitHub Release, builds for multiple platforms, and uploads the binaries.

---

## Step 1: Version Updater

This workflow runs on every push, bumps the version in `package.json`, and pushes the change back.

```yaml
name: Version Updater

on: [push]

permissions:
  contents: write

jobs:
  version:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Configure git
        run: |
          git config user.name 'bot'
          git config user.email 'bot@example.com'

      - name: Run pipoca
        run: npx -y kruceo/pipoca update package.json

      - name: Push version change
        run: |
          git add package.json
          git diff --cached --quiet || git commit -m "chore: update version"
          git push
```

> **Note:** `fetch-depth: 0` is required so Pipoca can read the full commit history.

---

## Step 2: Build and Release

This workflow triggers right after the version bump finishes. It reads the new version, creates a GitHub Release, and uploads build artifacts.

```yaml
name: Build and Release

on:
  workflow_run:
    workflows: ["Version Updater"]
    types: [completed]
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Get version
        id: version
        run: echo "version=$(jq -r .version package.json)" >> $GITHUB_OUTPUT

      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ steps.version.outputs.version }}
          name: ${{ steps.version.outputs.version }}
          body: "## What's new\n\n- "
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Upload artifact
        uses: actions/upload-release-asset@v1
        with:
          upload_url: ${{ steps.create-release.outputs.upload_url }}
          asset_path: ./dist/my-app
          asset_name: my-app-linux-amd64
          asset_content_type: application/octet-stream
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Commit conventions

Pipoca calculates versions based on commit message prefixes. Configure them in `pipoca.config.json`:

```json
{
  "keys": {
    "patch": ["fix", "style", "docs"],
    "minor": ["feature", "update"],
    "major": ["release"]
  }
}
```

| Commit message              | Bump    |
|-----------------------------|---------|
| `fix: resolve crash`        | `0.0.x` |
| `feature: add login page`   | `0.x.0` |
| `release: v2`               | `x.0.0` |

---

## Optional: `ignoreBeforeThisCommit`

If you want to reset the version baseline without rewriting history, add this to your `pipoca.config.json`:

```json
{
  "ignoreBeforeThisCommit": "a1b2c3d"
}
```

All commits before (and including) this hash will be ignored during version calculation.
