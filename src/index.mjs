import path from "path";
import fs from 'fs'
import { history, versionHandler } from "./versionizer.mjs";
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

    if(checkArgv('--create-config','-c')){
        createConfigFile()
        logger.ok('created config file!')
        process.exit()
    }
    if(checkArgv('--history','-H')){
        history()
        process.exit()
    }

    if(checkArgv('--single-run','-s')){
        versionHandler()
        process.exit()
    }

    if(checkArgv('--help')){
        console.log("[Command]".padEnd(30,' ') + ' [Description]')
        console.log("--create-config -c ".padEnd(30,'.') + " Create a config file with default values.")
        console.log("--show-history -H ".padEnd(30,'.') + " Show your versions history.")
        console.log("--single-run -s ".padEnd(30,'.') + " Don't watch, just run one time.")
        process.exit()
    }

   logger.info('watcher initiated...')
    const watcher = fs.watch(dotGitHead,(data)=>{
       
        versionHandler()
    })
}

export {run}
// console.log('terminated')

function checkArgv(...args){
    let include = false
    args.forEach(each=>{
        if(include)return;
        if(process.argv.includes(each)){
            include = true
        }
    })
    return include
  
}