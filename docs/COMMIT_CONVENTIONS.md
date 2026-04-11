# Commit Conventions

Pipoca reads your Git commit history and extracts **tags** from commit messages to calculate semantic versions.

---

## How Pipoca parses commits

1. Runs `git log --oneline` to get commit lines in the format `<hash> <message>`
2. Skips the first 8 characters (the commit hash prefix)
3. Tests the remaining message against the regex `^.+?(:|\/).+?`
4. If matched, extracts the tag using `^.+?(?=(:|\/))` — everything before the first `:` or `/`

---

## Supported formats

Both `:` and `/` separators are recognized:

| Format | Example | Extracted tag |
|--------|---------|---------------|
| `tag: message` | `fix: resolve crash` | `fix` |
| `tag/message` | `feature/add login page` | `feature` |

---

## Valid vs invalid commits

**Valid** — matched by Pipoca:

```
a1b2c3d4 fix: resolve crash
a1b2c3d4 feature: add login page
a1b2c3d4 release/v2
a1b2c3d4 docs/update readme
```

**Invalid** — ignored by Pipoca (no `:` or `/` separator):

```
a1b2c3d4 resolve crash
a1b2c3d4 updated dependencies
a1b2c3d4 wip
```

---

## Version calculation

Pipoca walks commits from oldest to newest. Each recognized tag increments the version based on its configured level:

| Tag level | Effect | Example |
|-----------|--------|---------|
| `patch` | `x.y.z` → `x.y.(z+1)` | `0.0.0` → `0.0.1` |
| `minor` | `x.y.z` → `x.(y+1).0` | `0.1.3` → `0.2.0` |
| `major` | `x.y.z` → `(x+1).0.0` | `1.3.7` → `2.0.0` |

Higher-level bumps reset lower segments (e.g., a minor bump resets patch to `0`).

### Example walk

```
a1b2c3d4 fix: resolve crash          → 0.0.1
b2c3d4e5 feature: add login page     → 0.1.0
c3d4e5f6 fix: typo in header         → 0.1.1
d4e5f6g7 release: v2                 → 1.0.0
```

---

## The `history` command

Run `pipoca history` to see the tag-to-version mapping for every recognized commit:

```bash
$ pipoca history
TAG       | VERSION
--------------------
fix       | 0.0.1
feature   | 0.1.0
fix       | 0.1.1
release   | 1.0.0
```

This uses the same tag configuration from `pipoca.config.json`. Only tags listed in `keys.patch`, `keys.minor`, or `keys.major` appear in the output.

---

## `ignoreBeforeThisCommit`

By default, Pipoca reads the entire commit history. To start from a specific commit (ignoring all older commits), set `ignoreBeforeThisCommit` in your config:

```json
{
  "keys": {
    "patch": ["fix"],
    "minor": ["feature"],
    "major": ["release"]
  },
  "ignoreBeforeThisCommit": "a1b2c3d4"
}
```

- Pipoca will run `git log a1b2c3d4~1..HEAD` instead of `git log HEAD`
- All commits at and after `a1b2c3d4` are included
- Use `git log --oneline` to find the commit hash you want to start from
- Useful for resetting the version baseline without rewriting Git history
