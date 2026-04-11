# Android Project Setup

Pipoca supports Android/Kotlin projects using Gradle Kotlin DSL (`build.gradle.kts`). It updates both `versionCode` and `versionName` in a single command.

---

## How it works

When you run `pipoca update build.gradle.kts`, Pipoca:

1. Calculates the version from commit history (e.g., `1.2.3`)
2. Converts it to an integer `versionCode` by zero-padding each segment to 3 digits and concatenating:
   - `1.2.3` → `001002003` → `1002003`
   - `0.15.7` → `000015007` → `15007`
3. Updates both fields in `build.gradle.kts` using lookbehind regex

---

## `build.gradle.kts` requirements

Your file must contain both fields in this exact format:

```kotlin
android {
    defaultConfig {
        versionCode = 1002003
        versionName = "1.2.3"
    }
}
```

Pipoca matches:
- `(?<=versionCode \= )\d+` — the integer after `versionCode = `
- `(?<=versionName \= ").+(?=")` — the string between quotes after `versionName = "`

---

## Config example

**`pipoca.config.json`**:

```json
{
  "keys": {
    "patch": ["fix", "style", "docs"],
    "minor": ["feature", "update"],
    "major": ["release"]
  }
}
```

## Usage

```bash
pipoca update build.gradle.kts
```

---

## GitHub Actions workflow

**`.github/workflows/android-release.yml`**:

```yaml
name: Android Release

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
        run: npx -y kruceo/pipoca update build.gradle.kts

      - name: Push version change
        run: |
          git add build.gradle.kts
          git diff --cached --quiet || git commit -m "chore: update version"
          git push
```

### With a release and signed APK upload

**`.github/workflows/android-release.yml`**:

```yaml
name: Android Release

on:
  workflow_run:
    workflows: ["Android Release"]
    types: [completed]
    branches: [main]

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Get version
        id: version
        run: echo "version=$(grep -oP '(?<=versionName = ")[^"]+' build.gradle.kts)" >> $GITHUB_OUTPUT

      - name: Build APK
        run: ./gradlew assembleRelease

      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: v${{ steps.version.outputs.version }}
          name: v${{ steps.version.outputs.version }}
          files: app/build/outputs/apk/release/*.apk
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
