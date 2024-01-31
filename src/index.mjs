import path from "path";
import fs from 'fs'
import { history, versionHandler } from "./versionizer.mjs";
import { createConfigFile, getConfig } from "./config.mjs";
import * as logger from './logger.mjs'

const config = getConfig()
function run() {
    let parentFolder = './'
    let dotGitHead = '.git/logs/HEAD'
    let dotGitfullpath = ''
    for (let i = 0; i < 5; i++) {
        dotGitfullpath = path.resolve(parentFolder, dotGitHead)
        if (!fs.existsSync(dotGitfullpath)) parentFolder = path.resolve(parentFolder, '../')
    }
    console.log(parentFolder)
    // console.log('using ' + dotGitfullpath)

    if (!fs.existsSync(dotGitfullpath)) {
        logger.err('Git Head not exist')
        return
    };
    if (!fs.existsSync('./package.json')) {
        logger.err('package.json not exist')
        return
    };

    if (checkArgv('--create-config', '-c')) {
        createConfigFile()
        logger.ok('created config file!')
        process.exit()
    }
    if (checkArgv('--history', '-H')) {
        history()
        process.exit()
    }

    if (checkArgv('--single-run', '-s')) {
        versionHandler()
        process.exit()
    }

    if (checkArgv('--help')) {
        console.log("[Command]".padEnd(30, ' ') + ' [Description]')
        console.log("--create-config -c ".padEnd(30, '.') + " Create a config file with default values.")
        console.log("--show-history -H ".padEnd(30, '.') + " Show your versions history.")
        console.log("--single-run -s ".padEnd(30, '.') + " Don't watch, just run one time.")
        process.exit()
    }

    logger.info('watcher initiated...')
    const watcher = fs.watch(dotGitfullpath, (data) => {
        versionHandler()
    })
}

export { run }
// console.log('terminated')

function checkArgv(...args) {
    let include = false
    args.forEach(each => {
        if (include) return;
        if (process.argv.includes(each)) {
            include = true
        }
    })
    return include

}