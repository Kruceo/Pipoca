# Pipoca: Simplified Semantic Versioning

Pipoca automates versioning in your `package.json` (or `build.gradle.kts`) based on your Git commit history. It's highly customizable and integrates seamlessly with GitHub Actions for streamlined CI/CD workflows.

---

## 📦 Installation

Install Pipoca globally with npm:

```bash
npm install -g pipoca
```

---

## 🔄 Commands

```
Usage: pipoca [options]

Commands:
  history (h)    Show tag history with calculated versions
  update  (u)    Update project version based on semantic commit history
  init    (i)    Create a default pipoca.config.json file
  help           Show help
  version        Show version

Options:
  --version, -v    Show version information
  --help,    -h    Show help
```

### `pipoca update <file>`

Updates the version in the specified file based on semantic commit history. Supports:

- `package.json`
- `build.gradle.kts`

```bash
pipoca update package.json
```

### `pipoca history`

Shows the tag history with the calculated version for each tag.

```bash
pipoca history
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
    "major": ["new", "release"]
  },
  "commands": {
    "before": [],
    "after": [
      "--update-version package.json $version$",
      "git add package.json",
      "git commit -m 'update version'"
    ]
  },
  "ignoreBeforeThisCommit": "a1b2c3d"
}
```

### Example:
- Tags **`fix`**, **`style`**, and **`docs`** increment the **patch** version (`0.0.x`).
- Tags **`feature`** and **`update`** increment the **minor** version (`0.x.0`).
- Tags **`new`** and **`release`** increment the **major** version (`x.0.0`).

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
  build:

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'

      - name: Configure git
        run: git config --global user.name 'kruceo' && git config --global user.email '${{secrets.OWNER_EMAIL}}'

      - name: Run pipoca
        run: |
          npx -y https://github.com/Kruceo/Pipoca.git update package.json
      - name: Push
        run: |
          git add package.json
          git commit -m "[Automated] Update version"
          git push origin HEAD
```

### What It Does:
1. Updates your `package.json` version based on commit tags.
2. Pushes the updated `package.json` back to the repository.

---

## 📚 Documentation

- **[Config Examples](docs/CONFIG_EXAMPLES.md)** — Examples using `$version$` placeholder and CI/CD workflows
- **[Versioning and Release](docs/VERSIONING_AND_RELEASE.md)** — Guide combining Pipoca with GitHub Actions and release automation
- **[Android Project](docs/ANDROID_PROJECT.md)** — `build.gradle.kts` support with `versionCode` and `versionName`
- **[Commit Conventions](docs/COMMIT_CONVENTIONS.md)** — How Pipoca parses commit messages and calculates versions
- **[Docker Workflow](docs/DOCKER_WORKFLOW.md)** — Build and push Docker images tagged with the calculated version
- **[Monorepo Setup](docs/MONOREPO.md)** — Multiple package updates, `before`/`after` commands, monorepo CI/CD

---

Streamline your versioning with Pipoca and let it handle the complexity for you!
