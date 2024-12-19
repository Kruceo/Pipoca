"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVersion = void 0;
const fs_1 = require("fs");
function updateVersion(dst, version) {
    const file = (0, fs_1.readFileSync)(dst, `utf-8`);
    const versionCode = parseInt(version.split(`.`)
        .reduce((a, n) => a + n.padStart(3, `0`)));
    console.log(version);
    (0, fs_1.writeFileSync)(dst, file
        .replace(/(?<=versionCode \= )\d+/, versionCode.toString())
        .replace(/(?<=versionName \= ").+(?=")/, version));
}
exports.updateVersion = updateVersion;
