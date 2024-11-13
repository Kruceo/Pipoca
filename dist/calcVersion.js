"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
function calcVersion(majorTags, minorTags, patchTags, perCommitCallback) {
    const gitLog = (0, child_process_1.execSync)('git log --all --oneline').toString();
    const gitlogLines = gitLog.split('\n').reverse();
    let version = {
        patch: 0,
        minor: 0,
        major: 0,
        toString: () => {
            return version.major + '.' + version.minor + '.' + version.patch;
        }
    };
    gitlogLines.forEach(line => {
        if (!/^.+?(:|\/).+?/.test(line))
            return;
        const tagMatch = line.slice(8, line.length).match(/^.+?(?=(:|\/))/);
        if (!tagMatch)
            return;
        const tag = tagMatch[0];
        if ([...minorTags, ...majorTags, ...patchTags].includes(tag)) {
            if (patchTags.includes(tag)) {
                version.patch++;
            }
            if (minorTags.includes(tag)) {
                version.minor++;
                version.patch = 0;
            }
            if (majorTags.includes(tag)) {
                version.major++;
                version.patch = 0;
                version.minor = 0;
            }
            perCommitCallback ? perCommitCallback(tag, version.toString()) : null;
        }
    });
    return version.major + '.' + version.minor + '.' + version.patch;
}
exports.default = calcVersion;
