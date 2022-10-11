#!/usr/bin/env node
const { exec, execSync } = require("child_process");
const fs = require("fs");
const { coloral: c } = require("coloral");
const { setToVersion } = require("./lib/managePkg.js");
const { argv, stdout, stderr } = require("process");
let isSaving = false;

if (argv.at(2) == "--test") {
  doRead();
  return;
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
  exec("git log --all --oneline", (err, stdout, stderr) => {
    fs.writeFileSync('test',stdout)
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

    lines.forEach((line,index)=>
    {
      commits[index] = line.slice(8,line.length);
     // console.log(line.slice(8,line.length+1));
    })

    commits.forEach((commit, index) => {
      let i =''+ commit.split(":")[0];
      commits[index] = i;
        if (i.trim() == "fix") {
          patch++;
        }
        if (i.trim() == "att") {
          minor++;
          patch = 0;
        }
        if (i.trim() == "new") {
          major++;
          minor = 0;
          patch = 0;
        }
        //console.log(i.replaceAll(' ',''));
      
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
//setTimeout(() => {isSaving = false;console.log('termited');}, 10000);
// setInterval(()=>{console.log(isSaving);},100
