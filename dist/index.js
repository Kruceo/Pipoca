"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlers_1 = require("./handlers");
const config_1 = require("./config");
const process_1 = require("process");
run();
function run() {
    const config = (0, config_1.getConfig)();
    let parentFolder = './';
    let dotGitHead = '.git/logs/HEAD';
    for (let i = 0; i < 5; i++) {
        const dotGitfullpath = path_1.default.resolve(parentFolder, dotGitHead);
        if (!fs_1.default.existsSync(dotGitfullpath))
            parentFolder = path_1.default.resolve(parentFolder, '../');
    }
    if (!fs_1.default.existsSync(path_1.default.resolve(parentFolder, dotGitHead))) {
        console.error('Git Head not exist');
        (0, process_1.exit)(1);
    }
    ;
    if (!fs_1.default.existsSync(path_1.default.resolve(parentFolder, "package.json"))) {
        console.error('package.json not exist');
        (0, process_1.exit)(1);
    }
    ;
    // commands
    if (checkArgv('--create-config', '-c')) {
        (0, config_1.createConfigFile)();
        console.log('created config file!');
        process.exit();
    }
    if (checkArgv('--history', '-H')) {
        (0, handlers_1.history)(config);
        process.exit();
    }
    if (checkArgv('--watch')) {
        console.info('watcher initiated...');
        fs_1.default.watch(path_1.default.resolve(parentFolder, dotGitHead), () => {
            (0, handlers_1.versionHandler)(config);
        });
    }
    if (checkArgv('--help')) {
        console.log("[Command]".padEnd(30, ' ') + ' [Description]');
        console.log("--create-config -c ".padEnd(30, '.') + " Create a config file with default values.");
        console.log("--show-history -H ".padEnd(30, '.') + " Show your versions history.");
        console.log("--watch".padEnd(30, '.') + " Watch .git and updates package.json on change.");
        process.exit();
    }
    (0, handlers_1.versionHandler)(config);
}
exports.run = run;
function checkArgv(...args) {
    let include = false;
    args.forEach(each => {
        if (include)
            return;
        if (process.argv.includes(each)) {
            include = true;
        }
    });
    return include;
}
