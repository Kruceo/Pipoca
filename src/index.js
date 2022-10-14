let config = null;
const { exec, execSync } = require("child_process");
const fs = require("fs");
const { coloral: c } = require("coloral");
const { setToVersion } = require("./lib/managePkg.js");
const { argv, stdout, stderr } = require("process");
const path = require("path");
let isSaving = false;
let minorKey, majorKey, patchKey;
function start(path, args) {
  if (fs.existsSync(path+".pipoca.json")) {
    config = JSON.parse(fs.readFileSync(path+".pipoca.json"));}
    minorKey = config.keys?.minor ?? "att";
    patchKey = config.keys?.patch ?? "fix";
    majorKey = config.keys?.major ?? "new";
  

  if (argv.at(2) == "--test") {
    doRead();
    return;
  }

  if (!fs.existsSync(path+".git"))
    console.log(c.markred(" ERR. ") + " .git not exist!");
  console.log(c.markocean(" INF. ") + " Watching...");
  try {
    fs.watch(path+".git/logs/HEAD", () => {
      doRead();
    });
  } catch (error) {
    console.log(c.markred(" ERR. ") + "No commits");
  }
}

function doRead() {
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
      fs.appendFileSync(
        path+"history",
        i + " ==> " + major + "." + minor + "." + patch + "\n"
      );
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

module.exports = {start}
