# PipocaJS

#### Pipoca edit your package.json version every git commit that you do, and give the version based on all commits of the project, it work with tags, like "fix", "att" and "new", but it is customizable

#### Each tag adds one to the patch,minor or major value of version

#### Your commits should start with the tag, and in next a colon, and finaly your mensage... See the examples

## To install

```console
npm install -g kruceo/pipoca
```

## To start the watcher

```bash
pipoca --watch
```

With the Pipoca running, do any commit with the tag that you prefer.

Remember, by default:

* "fix" increments to patch (0.0.X)
* "att" increments to minor (0.X.0)
* "new" increments to major (X.0.0)

```console
git add .
git commit -m "fix: pipoca test"
```

If you have the current version in "0.0.0", now is "0.0.1"

## To customize

```bash
pipoca --create-config
```

This command create a "pipoca.config.json" file, that contains the property "keys" with "patch","minor" and "major", just replace the values with the word that you prefer, like this:

```json
{
    "keys": {
        "patch": ["fix","patch","style"],
        "minor": ["feature"],
        "major": ["new","release"],
    },
    "commands": {
        "before": [],
        "after": ["git add package.json", "git commit --amend --no-edit"]
    }
}
```

Now

```bash
pipoca --watch
```

```console
git add .
git commit "kruceo: testing custom tag"
```

This will disregard all your commits with "att", now it's just added on commits that have your new tag

## Github actions

This tool is really util with Github Actions.

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
        run: git config --global user.name 'username' && git config --global user.email 'email@mail.com'
      
      - name: Run pipoca
        run: |
          npx -y https://github.com/Kruceo/Pipoca.git

      - name: Push
        run: |
          git push origin HEAD
```

## Other

More options are disponible using `pipoca --help`.