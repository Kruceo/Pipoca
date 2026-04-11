import { defineCommand } from "cheloni";
import calcVersion from "../calcVersion";
import { getConfig } from "../config";
import cp from "child_process"
import path from "path"
import { existsSync } from "fs"
import { updateVersion as updateBuildGraddleKTS } from "../formats/build.gradle.kts"
import { updateVersion as updatePackageJson } from "../formats/package.json"
import { exit } from "process";
import z from "zod";

const updateCmd = defineCommand({
    name: "update",
    description: "Update project version based on semantic commit history",
    paths: ["update", "u"], // `d` is now considered a alias for the command
    positional: z.string().optional().meta({ description: 'Input file' }),
    handler: async ({ positional, options, ctx }) => {
        const config = getConfig()
        for (const cmd of config.commands.before) {
            cp.execSync(cmd, { stdio: "inherit" })
        }

        const calcV = calcVersion(config.keys.major, config.keys.minor, config.keys.patch, config.ignoreBeforeThisCommit)
       
        if (positional)
            updateVersionHandler(positional, calcV)

        for (const cmd of config.commands.after) {
            const parsedCmd = cmd.replace(/\$version\$/g, calcV)
            cp.execSync(parsedCmd, { stdio: "inherit" })
        }
    },
});

export { updateCmd }


function updateVersionHandler(dst: string, version: string) {
    const basename = path.basename(dst)
    switch (basename) {
        case "package.json":
            if (!existsSync(dst)) {
                console.error(`${basename} not exist`)
                exit(1)
            };
            updatePackageJson(dst, version)
            break;
        case "build.gradle.kts":
            if (!existsSync(dst)) {
                console.error(`${basename} not exist`)
                exit(1)
            };
            updateBuildGraddleKTS(dst, version)
            break;

        default:
            console.error("this destination is not suported")
            break;
    }
}