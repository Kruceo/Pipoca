"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVersionHandler = exports.history = exports.versionHandler = void 0;
const fs_1 = require("fs");
const calcVersion_1 = __importDefault(require("./calcVersion"));
const package_json_1 = require("./formats/package.json");
const build_gradle_kts_1 = require("./formats/build.gradle.kts");
const child_process_1 = __importDefault(require("child_process"));
const path_1 = __importDefault(require("path"));
const process_1 = require("process");
function versionHandler(config) {
    for (const cmd of config.commands.before) {
        child_process_1.default.execSync(cmd, { stdio: "inherit" });
    }
    const calcV = (0, calcVersion_1.default)(config.keys.major, config.keys.minor, config.keys.patch);
    for (const cmd of config.commands.after) {
        const parsedCmd = cmd.replace(/\$version\$/g, calcV);
        if (cmd.startsWith("--update-version")) {
            const args = parsedCmd.split(" ");
            if (args.length > 2)
                updateVersionHandler(args[1], args[2]);
            else
                console.error("Syntax error: " + cmd);
        }
        else
            child_process_1.default.execSync(parsedCmd, { stdio: "inherit" });
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
function updateVersionHandler(dst, version) {
    const basename = path_1.default.basename(dst);
    switch (basename) {
        case "package.json":
            if (!(0, fs_1.existsSync)(dst)) {
                console.error(`${basename} not exist`);
                (0, process_1.exit)(1);
            }
            ;
            (0, package_json_1.updateVersion)(dst, version);
            break;
        case "build.gradle.kts":
            if (!(0, fs_1.existsSync)(dst)) {
                console.error(`${basename} not exist`);
                (0, process_1.exit)(1);
            }
            ;
            (0, build_gradle_kts_1.updateVersion)(dst, version);
            break;
        default:
            console.error("this destination is not suported");
            break;
    }
}
exports.updateVersionHandler = updateVersionHandler;
