import calcVersion from "./calcVersion";
import { PipocaConfig } from "./config";
import { getPackageVersion, updateVersion } from "./package";
import cp from 'child_process'

export function versionHandler(config: PipocaConfig) {
    for (const cmd of config.commands.before) {
        cp.execSync(cmd, { stdio: "inherit" })
    }

    const pkgV = getPackageVersion();
    const calcV = calcVersion(config.keys.major, config.keys.minor, config.keys.patch)

    if (pkgV == calcV) return;
    console.log(pkgV + ' ==> ' + calcV)
    updateVersion(calcV);

    for (const cmd of config.commands.after) {
        cp.execSync(cmd.replace(/\$version\$/g, calcV), { stdio: "inherit" })
    }
}

export function history(config: PipocaConfig) {
    console.log("TAG".padEnd(7, ' ') + '| VERSION')
    console.log("".padEnd(17, '='))
    calcVersion(config.keys.major, config.keys.minor, config.keys.patch, (t, v) => {
        console.log(t.padEnd(10, ' ') + '| ' + v)
    })
}

