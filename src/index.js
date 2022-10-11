#!/usr/bin/env node
const { exec } = require("child_process");
const fs = require("fs");
const { coloral: c } = require("coloral");
const { setToVersion } = require("./lib/managePkg.js");
const { argv } = require("process");
let isSaving = false;

if (argv.at(2) == "--test") {
  doRead();
}

if (!fs.existsSync(".git"))
  console.log(c.markred(" ERR. ") + " .git not exist!");
console.log(c.markocean(" INF. ") + " Watching...");
try {
  fs.watchFile(".git/logs/HEAD", () => {
    doRead();
  });
} catch (error) {
  console.log(c.markred(" ERR. ") + "No commits");
}

function doRead() {
  if (isSaving) {
    console.log(c.markblack("".padEnd(40,' ')));
    isSaving = false;
    return;
  }
  let lines = fs.readFileSync(".git/logs/HEAD", "utf-8").split("\n");
  let major = 0,
    minor = 0,
    patch = 0;
  let commits = lines.filter((line) => {
    if (line.includes("commit")) {
      return line;
    }
  });

  commits.forEach((commit, index) => {
    let i = commit.split("commit")[1].split(":");
    commits[index] = i;
    if (i[0].trim() != "(amend)") {
      if (i[1].trim() == "fix") {
        patch++;
      }
      if (i[1].trim() == "att") {
        minor++;
        patch = 0;
      }
      if (i[1].trim() == "new") {
        major++;
        minor = 0;
        patch = 0;
      }
    }
  });
  console.log(c.markocean(" INF. ") + " Commits & Amends: " + commits.length);
  if (commits[commits.length - 1] == "pipoca") {
    return;
  }

  let setVersion = setToVersion(major, minor, patch);
  if (setVersion.error) {
    console.log(c.markred(" ERR. ") + " replacing version");
  } else {
    console.log(c.markgreen(" PKG. ") + " " + setVersion.message);
  }
  isSaving = true;
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
}
//setTimeout(() => {isSaving = false;console.log('termited');}, 10000);
// setInterval(()=>{console.log(isSaving);},100
