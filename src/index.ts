import path from "path";
import fs from 'fs'
import { history, updateVersionHandler, versionHandler } from "./handlers";
import { createConfigFile, getConfig } from "./config";
import { exit } from "process";

run()

function run() {
    const config = getConfig()
    let parentFolder = './'
    let dotGitHead = '.git/logs/HEAD'

    for (let i = 0; i < 5; i++) {
        const dotGitfullpath = path.resolve(parentFolder, dotGitHead)
        if (!fs.existsSync(dotGitfullpath)) parentFolder = path.resolve(parentFolder, '../')
    }

    if (!fs.existsSync(path.resolve(parentFolder, dotGitHead))) {
        console.error('Git Head not exist')
        exit(1)
    };

    // commands

    if (checkArgv('--create-config', '-c')) {
        createConfigFile()
        console.log('created config file!')
        process.exit()
    }
    if (checkArgv('--history', '-H')) {
        history(config)
        process.exit()
    }

    if (checkArgv('--watch')) {
        console.info('watcher initiated...')
        fs.watch(path.resolve(parentFolder, dotGitHead), () => {
            versionHandler(config)
        })
    }

    if (checkArgv('--help')) {
        console.log("[Command]".padEnd(30, ' ') + ' [Description]')
        console.log("--create-config -c ".padEnd(30, '.') + " Create a config file with default values.")
        console.log("--show-history -H ".padEnd(30, '.') + " Show your versions history.")
        console.log("--watch".padEnd(30, '.') + " Watch .git and updates version on change.")
        process.exit()
    }

    if (checkArgv('--update-version')) {
        const argIndex = process.argv.indexOf("--update-version")

        const dst = process.argv.at(argIndex + 1)
        const version = process.argv.at(argIndex + 2)
        if (!dst || !version) {
            console.error('wrong format:\nuse --update-version [package.json|other] [version|1.2.3]')
            exit(1)
        };

        updateVersionHandler(dst, version)

        process.exit()
    }

    versionHandler(config)
}

export { run }

function checkArgv(...args: string[]) {
    let include = false
    args.forEach(each => {
        if (include) return;
        if (process.argv.includes(each)) {
            include = true
        }
    })
    return include

}