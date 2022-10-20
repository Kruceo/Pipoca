let config = null;
const { exec, execSync } = require("child_process");
const fs = require("fs");
const { coloral: c } = require("coloral");
const { setToVersion } = require("./lib/managePkg.js");
const { argv, stdout, stderr } = require("process");
const { parse } = require("path");
let isSaving = false;
let minorKey = "att", majorKey = "new", patchKey = "fix";
function start(path, args) {
  let parsedPath = path;
  if (!path.endsWith('/')) {
    parsedPath += '/'
  }
  try {
    if (fs.existsSync(parsedPath + ".pipoca.config.json")) {
      config = JSON.parse(fs.readFileSync(parsedPath + ".pipoca.config.json"));
      minorKey = config.keys.minor ?? "att";
      patchKey = config.keys.patch ?? "fix";
      majorKey = config.keys.major ?? "new";
    }
  }catch(e)
  {
    console.log(c.markred(' ERR. ') + " Pipoca error reading pipoca.config.json")
  }
  console.log(c.markpurple(' CFG. ') + ' Tags: ' + majorKey + ' ' + minorKey + ' ' + patchKey);
  if (argv.at(2) == "--init") {
    fs.writeFileSync(parsedPath + '.pipoca.config.json', `
    {
      "keys":
      {
        "patch": "fix",
        "minor": "att",
        "major": "new"
      }
    }`)
    return;
  }
  if (argv.at(2) == "--test") {
    doRead(true);
    return;
  }

  if (!fs.existsSync(parsedPath + ".git"))
    console.log(c.markred(" ERR. ") + " .git not exist!");
  console.log(c.markocean(" INF. ") + " Watching...");
  try {
    fs.watch(parsedPath + ".git/logs/HEAD", () => {
      doRead();
    });
  } catch (error) {
    console.log(c.markred(" ERR. ") + "No commits");
  }
}

function doRead(testing) {
  exec("git log --all --oneline", (err, stdout, stderr) => {
    if (isSaving) {
      console.log("\n");
      isSaving = false;
      return;
    }
    let lines = stdout.split("\n");
    let major = 0,
      minor = 0,
      patch = 0;
    let commits = [];

    lines.forEach((line, index) => {
      commits[index] = line.slice(8, line.length);
    });

    commits.reverse().forEach((commit, index) => {
      let i = "" + commit.split(":")[0];
      commits[index] = i;
      if (i.trim() == patchKey) {
        patch++;
      }
      if (i.trim() == minorKey) {
        minor++;
        patch = 0;
      }
      if (i.trim() == majorKey) {
        major++;
        minor = 0;
        patch = 0;
      }
      if(testing)
      {
        console.log(i.trim().padEnd(10,' ') + '  '+major+"."+minor+"."+patch)
      }
    });
    console.log(c.markocean(" INF. ") + " Commits & Amends: " + commits.length);
    let setVersion = setToVersion(major, minor, patch);
    if (setVersion.error) {
      console.log(c.markred(" ERR. ") + " Replacing version");
    } else {
      console.log(c.markgreen(" PKG. ") + " " + setVersion.message);
    }
    isSaving = true;
    if (argv.at(2) == "--test") {
      return;
    }
    exec("git add package.json");
    let commitProc = exec("git commit --amend --no-edit");

    commitProc.stdout.on("data", (data) => {
      console.log(c.markocean(" INF. ") + " Pipoca commited!");
    });
    commitProc.stdout.on("error", (data) => {
      console.log(c.markred(" ERR. ") + " Pipoca commit fails");
      console.log(data);
    });
    commitProc.addListener("exit", (data) => {
      console.log(c.markocean(" INF. ") + " Commit process closed");
    });
  });
}

module.exports = { start }
