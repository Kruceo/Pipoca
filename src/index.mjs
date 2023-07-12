import path from "path";
import fs from 'fs'
import { versionHandler } from "./versionizer.mjs";
import { createConfigFile, getConfig } from "./config.mjs";
import * as logger from './logger.mjs'
const dotGitHead = path.resolve('.git/logs/HEAD')
const config = getConfig()
function run(){
    if (!fs.existsSync(dotGitHead)){
        logger.err('Git Head not exist')
        return
    };
    if (!fs.existsSync('./package.json')){
        logger.err('package.json not exist')
        return
    };

    if(process.argv.includes('--create-config')){
        createConfigFile()
        logger.ok('created config file!')
        process.exit()
    }

   logger.info('watcher initiated...')
    const watcher = fs.watch(dotGitHead,(data)=>{
       
        versionHandler()
    })
}

export {run}
// console.log('terminated')