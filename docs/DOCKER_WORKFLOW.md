# Docker Workflow

Use Pipoca to tag Docker images with the calculated version and push them to a registry via `after` commands.

---

## How it works

Pipoca replaces `$version$` in `after` commands before executing them. This lets you build and tag Docker images with the semantic version calculated from your commit history.

---

## Config example

**`pipoca.config.json`**:

```json
{
  "keys": {
    "patch": ["fix", "style", "docs"],
    "minor": ["feature", "update"],
    "major": ["release"]
  },
  "commands": {
    "after": [
      "docker build -t myuser/myapp:$version$ .",
      "docker push myuser/myapp:$version$"
    ]
  }
}
```

Run with `pipoca update` (no file argument needed — the `after` commands handle everything):

```bash
pipoca update
```

---

## Push to GitHub Container Registry (GHCR)

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
      "docker build -t ghcr.io/myorg/myapp:$version$ .",
      "docker push ghcr.io/myorg/myapp:$version$"
    ]
  }
}
```

---

## GitHub Actions workflow

**`.github/workflows/docker-release.yml`**:

```yaml
name: Docker Release

on: [push]

permissions:
  contents: write
  packages: write

jobs:
  docker:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Configure git
        run: |
          git config user.name 'bot'
          git config user.email 'bot@example.com'

      - name: Log in to GitHub Container Registry
        run: echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin

      - name: Run pipoca
        run: npx -y kruceo/pipoca update

      - name: Push version change
        run: |
          git add pipoca.config.json
          git diff --cached --quiet || git commit -m "chore: update version"
          git push
```

### With Docker Hub

Replace the login step:

```yaml
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
```

And update the `after` commands in your config to use `myuser/myapp:$version$`.

---

## Multi-tag strategy

Tag images with both the semantic version and `latest` for the latest release:

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
      "docker build -t myuser/myapp:$version$ -t myuser/myapp:latest .",
      "docker push myuser/myapp:$version$",
      "docker push myuser/myapp:latest"
    ]
  }
}
```
