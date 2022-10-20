# PipocaJS

#### Pipoca edit your package.json version every git commit that you do, and give the version based on all commits of the project, it work with tags, like "fix", "att" and "new", but it is customizable

#### Each tag adds one to the patch,minor or major value of version

#### Your commits should start with the tag, and in next a colon, and finaly your mensage... See the examples


## To install

```console
npm i -g kruceo/pipocajs
```

## To start the watcher

```console
pipoca
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

```console
pipoca --init
```

This command create a "pipoca.config.json" file, that contains the property "keys" with "patch","minor" and "major", just replace the values with the word that you prefer, like this:

```json
{
    "keys":
    {
        "patch": "fix",
        "minor": "kruceo",
        "major": "new",
    }
}
```

Now

```console
pipoca
```

```console
git add .
git commit "kruceo: testing custom tag"
```

This will disregard all your commits with "att", now it's just added on commits that have your new tag

## To do a a single run

```console
pipoca --start
```

Print in log anything like this

```console
init        0.0.0
fix         0.0.1
fix         0.0.2
att         0.1.0
fix         0.1.1
pipoca      0.1.1
fix         0.1.2
```
