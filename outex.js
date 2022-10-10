//#!/usr/bin/env node
const fs = require("fs");
const { coloral: c } = require("coloral");
const { exec } = require("child_process");
const { addToVersion, setToPatch } = require("./managePkg");
const { argv } = require("process");

let pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
let actualVersion = pkg.version.split(".");
let lastCommit = fs.readFileSync("./.git/logs/HEAD", "utf-8");
console.log(actualVersion);
let postFun = [],
  postVariables = [];
let fun = [],
  variables = [];
let found = "";

function readFile() {
  let save = fs.readFileSync(argv.at(2), "utf-8");
  let cachedSave = save;
  let allBrackets = [];
  let closedBrackets = [];
  fun = [];
  try {
    while (cachedSave.includes("{") || cachedSave.includes("}")) {
      allBrackets.push({ pos: cachedSave.indexOf("{"), type: 0 });
      cachedSave = cachedSave.replace("{", "$");
      allBrackets.push({ pos: cachedSave.indexOf("}"), type: 1 });
      cachedSave = cachedSave.replace("}", "$");
    }

    allBrackets = allBrackets.sort((a, b) => a.pos - b.pos);
    console.log(allBrackets);
    let act = 0;
    let jump = 0;
    while (act + 1 < allBrackets.length) {
      if (allBrackets[act].type == allBrackets[act + 1].type) {
        jump++;
      } else {
        closedBrackets.push({
          pos1: allBrackets[act - jump].pos,
          pos2: allBrackets[act + 1 + jump].pos,
        });
        act++;
      }
      act++;
    }
    while (cachedSave.includes("function")) {
      let x = cachedSave.indexOf("function");
      let z = cachedSave.indexOf("(", x);
      let w = save.indexOf("{", z + 1);

      found = cachedSave.slice(x, z);

      if (found.length == 0) {
        break;
      }
      for (var i of closedBrackets) {
        if (i.pos1 == w) {
          fun.push({
            function: found,
            value: cachedSave.slice(i.pos1, i.pos2),
          });
          break;
        }
      }

      cachedSave = cachedSave.replace(found, "$FUNC".padEnd(found.length));
    }

    while (cachedSave.includes(")=>")) {
      let x = cachedSave.indexOf(")=>");
      let z = x + 2;
      let w = save.indexOf("{", z + 1);
      found = cachedSave.slice(x, z + 1);
      if (found.length == 0) {
        break;
      }
      for (var i of closedBrackets) {
        if (i.pos1 == w) {
          fun.push({
            function: found,
            value: cachedSave.slice(i.pos1, i.pos2),
          });
          break;
        }
      }

      cachedSave = cachedSave.replace(found, "$Arrow".padEnd(found.length,'%'));
    }

    while (
      cachedSave.includes("let ") ||
      cachedSave.includes("var ") ||
      cachedSave.includes("const ")
    ) {
      let x = cachedSave.indexOf("let");
      if (x < 1) {
        x = cachedSave.indexOf("var");
      }
      if (x < 1) {
        x = cachedSave.indexOf("const");
      }
      let z = cachedSave.indexOf("=", x);
      found = cachedSave.slice(x, z);

      if (found.length == 0) {
        break;
      }
      variables.push(found);
      cachedSave = cachedSave.replace(found, "$VAR");
    }
  } catch (e) {
    console.error("error");
  }
}

readFile();

fs.watch("./.git/logs/HEAD", () => {
  readFile();
  let points = 0;
  let i = 0;

  if (postFun.length < fun.length) {
    points += (fun.length - postFun.length) * 3;
    while (i < postFun.length) {
      if (fun[i].function != postFun[i].function) {
        points += 2;
      }
      if (fun[i].value != postFun[i].value) {
        points += 1;
      }
      console.log(i);
      i++;
    }
    
  } else {
    while (i > postFun.length) {
      if (fun[i].function != postFun[i].function) {
        points += 2;
      }
      if (fun[i].value != postFun[i].value) {
        points += 1;
      }
      console.log(i);
      i++;
    }
    points += (postFun.length - fun.length) * 3;
  }
  if (variables != postVariables) {
    points += 1;
  }
  console.log("points: " + points);
  if (points < 3) {
    addToVersion(0, 0, 1);
  } else {
    addToVersion(0, 1, 0);
    setToPatch(0);
  }

  postFun = fun;

  postVariables = variables;
});
