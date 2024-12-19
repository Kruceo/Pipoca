import { existsSync } from "fs";
import calcVersion from "./calcVersion";
import { PipocaConfig } from "./config";
import { updateVersion as updatePkgJsonVersion } from "./formats/package.json";
import { updateVersion as updateGradleKTJsonVersion } from "./formats/build.gradle.kts";
import cp from 'child_process'
import path from "path";
import { exit } from "process";

export function versionHandler(config: PipocaConfig) {
    for (const cmd of config.commands.before) {
        cp.execSync(cmd, { stdio: "inherit" })
    }

    const calcV = calcVersion(config.keys.major, config.keys.minor, config.keys.patch)

    for (const cmd of config.commands.after) {
        const parsedCmd = cmd.replace(/\$version\$/g, calcV)
        if (cmd.startsWith("--update-version")) {
            const args = parsedCmd.split(" ")
            if (args.length > 2)
                updateVersionHandler(args[1], args[2])
            else console.error("Syntax error: " + cmd)
        }
        else
            cp.execSync(parsedCmd, { stdio: "inherit" })
    }
}

export function history(config: PipocaConfig) {
    console.log("TAG".padEnd(7, ' ') + '| VERSION')
    console.log("".padEnd(17, '='))
    calcVersion(config.keys.major, config.keys.minor, config.keys.patch, (t, v) => {
        console.log(t.padEnd(10, ' ') + '| ' + v)
    })
}

export function updateVersionHandler(dst: string, version: string) {
    const basename = path.basename(dst)
    switch (basename) {
        case "package.json":
            if (!existsSync(dst)) {
                console.error(`${basename} not exist`)
                exit(1)
            };
            updatePkgJsonVersion(dst, version)
            break;
        case "build.gradle.kts":
            if (!existsSync(dst)) {
                console.error(`${basename} not exist`)
                exit(1)
            };
            updateGradleKTJsonVersion(dst, version)
            break;

        default:
            console.error("this destination is not suported")
            break;
    }
}