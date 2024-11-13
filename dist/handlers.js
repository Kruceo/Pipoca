"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.history = exports.versionHandler = void 0;
const calcVersion_1 = __importDefault(require("./calcVersion"));
const package_1 = require("./package");
const child_process_1 = __importDefault(require("child_process"));
function versionHandler(config) {
    for (const cmd of config.commands.before) {
        child_process_1.default.execSync(cmd, { stdio: "inherit" });
    }
    const pkgV = (0, package_1.getPackageVersion)();
    const calcV = (0, calcVersion_1.default)(config.keys.major, config.keys.minor, config.keys.patch);
    if (pkgV == calcV)
        return;
    console.log(pkgV + ' ==> ' + calcV);
    (0, package_1.updateVersion)(calcV);
    for (const cmd of config.commands.after) {
        child_process_1.default.execSync(cmd.replace(/\$version\$/g, calcV), { stdio: "inherit" });
    }
}
exports.versionHandler = versionHandler;
function history(config) {
    console.log("TAG".padEnd(7, ' ') + '| VERSION');
    console.log("".padEnd(17, '='));
    (0, calcVersion_1.default)(config.keys.major, config.keys.minor, config.keys.patch, (t, v) => {
        console.log(t.padEnd(10, ' ') + '| ' + v);
    });
}
exports.history = history;
