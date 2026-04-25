# Pipoca: Simplified Semantic Versioning

Pipoca automates versioning in your `package.json`, `build.gradle.kts`, or `pyproject.toml` based on your Git commit history. It's highly customizable and integrates seamlessly with GitHub Actions for streamlined CI/CD workflows.

---

## 📦 Installation

Install Pipoca globally with npm:

```bash
npm install -g pipoca
```

Or use it directly with npx (no install required):

```bash
npx pipoca update package.json
```

---


### `pipoca update [file]`

Updates the version in the specified file based on semantic commit history. Supports:

- `package.json`
- `build.gradle.kts`
- `pyproject.toml`

```bash
pipoca update package.json
```

Omit the file to rely solely on `after` commands (useful for monorepos or custom workflows):

```bash
pipoca update
```

### `pipoca history`

Shows the tag history with the calculated version for each tag.

```bash
pipoca history

# Simplified output
pipoca history --simple
```

### `pipoca init`

Creates a default `pipoca.config.json` file in the current directory.

```bash
pipoca init
```

---

## 🔧 Customizing Pipoca

Edit the `pipoca.config.json` file to define your custom tags and actions:

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
      "npm version $version$ --no-git-tag-version",
      "git tag v$version$",
      "git push origin --tags"
    ]
  },
  "ignoreBeforeThisCommit": "a1b2c3d"
}
```

### Example:
- Tags **`fix`**, **`style`**, and **`docs`** increment the **patch** version (`0.0.x`).
- Tags **`feature`** and **`update`** increment the **minor** version (`0.x.0`).
- Tags **`release`** increments the **major** version (`x.0.0`).

### Execution order
1. `before` commands run sequentially
2. Version is calculated from commit history
3. If a file was provided (e.g., `pipoca update package.json`), it is updated
4. `after` commands run sequentially with `$version$` replaced

### `ignoreBeforeThisCommit`
Optional. Set a commit hash to start the version calculation from that commit (inclusive), ignoring all older commits. Useful for resetting your version baseline without rewriting history. Use `git log --oneline` to find commit hashes.

---

## 🤖 GitHub Actions Integration

Pipoca is a perfect fit for CI/CD pipelines. Here's a sample GitHub Actions workflow for automated versioning:

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
        run: npx -y pipoca update package.json

      - name: Push version change
        run: |
          git add package.json
          git diff --cached --quiet || git commit -m "chore: update version"
          git push
```

> **Note:** `fetch-depth: 0` is required so Pipoca can read the full commit history.

---

## 📚 Documentation

- **[Config Examples](docs/CONFIG_EXAMPLES.md)** — Examples using `$version$` placeholder and CI/CD workflows
- **[Versioning and Release](docs/VERSIONING_AND_RELEASE.md)** — Guide combining Pipoca with GitHub Actions and release automation
- **[Android Project](docs/ANDROID_PROJECT.md)** — `build.gradle.kts` support with `versionCode` and `versionName`
- **[Commit Conventions](docs/COMMIT_CONVENTIONS.md)** — How Pipoca parses commit messages and calculates versions
- **[Docker Workflow](docs/DOCKER_WORKFLOW.md)** — Build and push Docker images tagged with the calculated version
- **[Monorepo Setup](docs/MONOREPO.md)** — Multiple package updates, `before`/`after` commands, monorepo CI/CD
