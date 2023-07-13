import calcVersion from "./calcVersion.mjs";
import { getConfig } from "./config.mjs";
import { getPackageVersion, updateVersion } from "./package.mjs";
import cp from 'child_process'
import * as logger from './logger.mjs'
const config = getConfig()

export function versionHandler(){
    const pkgV = getPackageVersion();
    const calcV = calcVersion(config.keys.major, config.keys.minor, config.keys.patch)
    
    if (pkgV == calcV) return;
    logger.info(pkgV + ' ==> ' + calcV)
    updateVersion(calcV);
    
    config.commands.forEach((cmd,index) => {
        logger.info('running command ' + index)
        cp.execSync(cmd)
    })
    
    cp.execSync('git add package.json')
    cp.execSync('git commit --amend --no-edit')
    logger.ok('commited!')
}

export function history(){
    logger.info("TAG".padEnd(7,' ') + '| VERSION')
    logger.info("".padEnd(17,'='))
    const pkgV = getPackageVersion();
    const calcV = calcVersion(config.keys.major, config.keys.minor, config.keys.patch,(t,v)=>{
        logger.info(t.padEnd(7,' ') + '| ' + v )
    })
}

