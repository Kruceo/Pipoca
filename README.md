# Pipoca: Simplified Semantic Versioning

Pipoca automates versioning in your `package.json` based on your Git commit history. It's highly customizable and integrates seamlessly with GitHub Actions for streamlined CI/CD workflows.

---

## 📦 Installation

Install Pipoca globally with npm:

```bash
npm install -g kruceo/pipoca
```

---

## 🔄 Basic Usage

### 1. **Single Command Update**
```bash
pipoca
```

This updates the `package.json` version if necessary and amends the change into your latest commit. For full control, you can customize Pipoca's configuration.

---

### 2. **Watch Mode**
```bash
pipoca --watch
```

This monitors your repository for commits and automatically updates `package.json` after each commit.

---

## 🔧 Customizing Pipoca

Generate a configuration file with:

```bash
pipoca --create-config
```

This creates a `pipoca.config.json` file where you can define your custom tags and actions:

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
  }
}
```

### Example:
- Tags **`fix`**, **`style`**, and **`docs`** increment the **patch** version (`0.0.x`).
- Tags **`feature`** and **`update`** increment the **minor** version (`0.x.0`).
- Tags **`new`** and **`release`** increment the **major** version (`x.0.0`).

---

## 🤖 GitHub Actions Integration

Pipoca is a perfect fit for CI/CD pipelines. Here's a sample GitHub Actions workflow for automated versioning:

```yaml
name: Version Updater

on: [push]

permissions:
  contents: write

jobs:
  versioning:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'

      - name: Configure Git
        run: |
          git config --global user.name 'Your Name'
          git config --global user.email 'your-email@example.com'

      - name: Run Pipoca
        run: |
          npx -y https://github.com/Kruceo/Pipoca.git

      - name: Push Changes
        run: git push origin HEAD
```

### What It Does:
1. Updates your `package.json` version based on commit tags.
2. Pushes the updated `package.json` back to the repository.

---

## 🛠 Additional Options

Discover more commands and features with:

```bash
pipoca --help
```

---

Streamline your versioning with Pipoca and let it handle the complexity for you!
