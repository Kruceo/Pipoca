#!/usr/bin/env node
const { exec } = require("child_process");
const fs = require("fs");
const { coloral: c } = require("coloral");
const { setToVersion } = require("./lib/managePkg.js");
let isSaving = false;
if (!fs.existsSync(".git"))
  console.log(c.markred(" ERROR ") + " .git not exist!");

console.log(c.markocean(" INFO ") + " Watching...");
fs.watchFile(".git/logs/HEAD", () => {
  if (isSaving) return;
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
    let i = commit.split("commit")[1].split(":")[1].trim();
    commits[index] = i;

    if (i == "fix" || i == "init") {
      patch++;
    }
    if (i == "att") {
      minor++;
      patch = 0;
    }
    if (i == "new") {
      major++;
      minor = 0;
      patch = 0;
    }
  });
  let setVersion = setToVersion(major, minor, patch);
  if(setVersion.error)
  {
    console.log(c.markred(' ERROR ')+' replacing version');
  }
  else
  {
    console.log(c.markgreen(' PKG. ') + ' '+setVersion.message);
  }
  isSaving = true;
  exec("git add package.json");
  let commitProc = exec('git commit -m "pipoca:fix: version"');
  commitProc.stdout.on("data", (data) => {
    console.log(c.markocean(" INFO ") + " Pipoca commited!");
  });
  commitProc.stdout.on("error", (data) => {
    console.log(c.markred(" ERROR ") + " Pipoca commit fails");
    console.log(data);
  });
  setTimeout(() => isSaving = false, 2000);
});
