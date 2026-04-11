import { createCli, defineRootCommand } from "cheloni";
import { configPlugin } from "cheloni/std/config";
import { helpPlugin, versionPlugin } from "cheloni/std/core";
import { historyCmd } from "./history";
import { updateCmd } from "./update";
import { initCmd } from "./init";
import pkg from "./../../package.json"

const cli = await createCli({
    name: "pipoca",
    version: pkg.version,
    command: defineRootCommand({
        commands: [historyCmd, updateCmd, initCmd],
        // middleware: [loggerMiddleware], // Runs for all commands
        bequeathOptions: [], // Options inherited by subcommands
    }),
    plugins: [
        configPlugin,
        helpPlugin,
        versionPlugin
        // ...basicPluginKit, // Adds deprecation warnings, help/version support, and default error handling
    ],
});

export { cli }
