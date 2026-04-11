# Config Examples

This document shows practical examples of how to configure Pipoca's `after` commands using the `$version$` placeholder.

---

## Basic: Update package.json

The simplest use case is to update `package.json` with the new version after calculations.

```json
{
  "keys": {
    "patch": ["fix", "style", "docs"],
    "minor": ["feature", "update"],
    "major": ["release"]
  },
  "commands": {
    "after": [
      "npm version $version$ --no-git-tag-version"
    ]
  }
}
```

---

## Update multiple files

Update `package.json` and `README.md` (or any other file) with the same version.

```json
{
  "keys": {
    "patch": ["fix", "style", "docs"],
    "minor": ["feature", "update"],
    "major": ["release"]
  },
  "commands": {
    "after": [
      "sed -i '' \"s/v[0-9.]*/$version$/\" README.md"
    ]
  }
}
```

---

## Create Git tag and push

After bumping the version, create a Git tag and push it.

```json
{
  "keys": {
    "patch": ["fix", "style", "docs"],
    "minor": ["feature", "update"],
    "major": ["release"]
  },
  "commands": {
    "after": [
      "git tag v$version$",
      "git push origin --tags"
    ]
  }
}
```

---

## Build and publish to npm

Automatically build the project and publish to npm with the new version.

```json
{
  "keys": {
    "patch": ["fix", "style", "docs"],
    "minor": ["feature", "update"],
    "major": ["release"]
  },
  "commands": {
    "after": [
      "npm ci",
      "npm run build",
      "npm publish"
    ]
  }
}
```

---

## GitHub Actions workflow example

Combine Pipoca with GitHub Actions to automate the full release process.

**`.github/workflows/release.yml`**:

```yaml
name: Release

on:
  workflow_run:
    workflows: ["Version Updater"]
    types: [completed]
    branches: [main]

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Get version
        id: version
        run: echo "version=$(jq -r .version package.json)" >> $GITHUB_OUTPUT

      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: v${{ steps.version.outputs.version }}
          name: v${{ steps.version.outputs.version }}
          body: "## What's new\n\n- "
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Upload assets
        uses: actions/upload-release-asset@v1
        with:
          upload_url: ${{ steps.create-release.outputs.upload_url }}
          asset_path: ./dist/my-app-linux-amd64
          asset_name: my-app-linux-amd64
          asset_content_type: application/octet-stream
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**`pipoca.config.json`**:

```json
{
  "keys": {
    "patch": ["fix", "style", "docs"],
    "minor": ["feature", "update"],
    "major": ["release"]
  },
  "commands": {
    "before": [],
    "after": [
      "npm ci",
      "npm run build"
    ]
  }
}
```

---

## Using `--update-version` flag

When running the command manually, you can pass the file directly:

```bash
# Update package.json
pipoca update package.json

# Update build.gradle.kts
pipoca update build.gradle.kts
```

The `$version$` placeholder only works in the `pipoca.config.json` file within the `after` commands.

---

## Real-world example: Full CI/CD pipeline

This is a complete setup combining Pipoca with GitHub Actions and a multi-platform build.

**`pipoca.config.json`**:

```json
{
  "keys": {
    "patch": ["fix", "style", "docs"],
    "minor": ["feat", "feature"],
    "major": ["release"]
  },
  "commands": {
    "after": [
      "npm ci",
      "npm run build"
    ]
  }
}
```

**`.github/workflows/version-updater.yml`**:

```yaml
name: Version Updater

on:
  push:
    branches:
      - main
      - chore/*

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

**`.github/workflows/release.yml`**:

```yaml
name: Release

on:
  workflow_run:
    workflows: ["Version Updater"]
    types: [completed]
    branches: [main]

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

      - name: Get version
        id: version
        run: echo "version=$(jq -r .version package.json)" >> $GITHUB_OUTPUT

      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: v${{ steps.version.outputs.version }}
          name: v${{ steps.version.outputs.version }}
          body: "## What's new\n\n- "
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Build Linux
        run: |
          mkdir -p dist
          npm run build-linux

      - name: Build Windows
        run: |
          mkdir -p dist
          npm run build-windows

      - name: Upload assets
        uses: actions/upload-release-asset@v1
        with:
          upload_url: ${{ steps.create-release.outputs.upload_url }}
          asset_path: ./dist/my-app-linux-amd64
          asset_name: my-app-linux-amd64
          asset_content_type: application/octet-stream
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Upload Windows asset
        uses: actions/upload-release-asset@v1
        with:
          upload_url: ${{ steps.create-release.outputs.upload_url }}
          asset_path: ./dist/my-app-windows-amd64.exe
          asset_name: my-app-windows-amd64.exe
          asset_content_type: application/vnd.microsoft.portable-executable
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Pattern reference

| Placeholder | Description |
|-------------|-------------|
| `$version$` | The calculated semantic version (e.g., `1.2.3`) |

The `$version$` placeholder is only replaced in the `after` commands array of `pipoca.config.json`.
