# Monorepo Setup

Use Pipoca in a monorepo to update multiple `package.json` files or run per-package commands.

---

## How it works

Pipoca's `after` commands run sequentially with `stdio: "inherit"`. The `$version$` placeholder is replaced before each command executes. This means you can chain multiple file updates in a single `pipoca update` run.

---

## Updating multiple package.json files

The built-in `update <file>` only supports one file at a time. For multiple files, use `after` commands with `npm version`:

**`pipoca.config.json`**:

```json
{
  "keys": {
    "patch": ["fix"],
    "minor": ["feature"],
    "major": ["release"]
  },
  "commands": {
    "after": [
      "npm version $version$ --no-git-tag-version --workspace=packages/web",
      "npm version $version$ --no-git-tag-version --workspace=packages/api",
      "npm version $version$ --no-git-tag-version --workspace=packages/shared"
    ]
  }
}
```

Run with:

```bash
pipoca update
```

> **Note:** No file argument is passed — the `after` commands handle all file updates.

---

## Using `sed` for non-package.json files

For files that aren't `package.json` or `build.gradle.kts`, use `sed` in `after` commands:

**`pipoca.config.json`**:

```json
{
  "keys": {
    "patch": ["fix"],
    "minor": ["feature"],
    "major": ["release"]
  },
  "commands": {
    "after": [
      "npm version $version$ --no-git-tag-version --workspace=packages/web",
      "sed -i '' \"s/version: \\\".*\\\"/version: \\\"$version$\\\"/\" packages/api/Chart.yaml"
    ]
  }
}
```

---

## `before` commands

The `before` array runs **before** version calculation. Use it for setup tasks like installing dependencies or generating code:

**`pipoca.config.json`**:

```json
{
  "keys": {
    "patch": ["fix"],
    "minor": ["feature"],
    "major": ["release"]
  },
  "commands": {
    "before": [
      "npm ci"
    ],
    "after": [
      "npm run generate:version-file",
      "npm version $version$ --no-git-tag-version --workspace=packages/web",
      "npm version $version$ --no-git-tag-version --workspace=packages/api"
    ]
  }
}
```

---

## Execution order

1. `before` commands run sequentially (no `$version$` replacement)
2. Version is calculated from commit history
3. `after` commands run sequentially with `$version$` replaced
4. If a positional file was provided (e.g., `pipoca update package.json`), it is updated between steps 2 and 3

---

## GitHub Actions workflow for monorepo

**`.github/workflows/version-updater.yml`**:

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
        run: npx -y kruceo/pipoca update

      - name: Push version change
        run: |
          git add .
          git diff --cached --quiet || git commit -m "chore: update versions"
          git push
```

### With per-package releases

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
    strategy:
      matrix:
        package: [web, api, shared]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Get version
        id: version
        run: echo "version=$(jq -r .version packages/${{ matrix.package }}/package.json)" >> $GITHUB_OUTPUT

      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ matrix.package }}-v${{ steps.version.outputs.version }}
          name: ${{ matrix.package }} v${{ steps.version.outputs.version }}
          body: "## ${{ matrix.package }}\n\n- "
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
