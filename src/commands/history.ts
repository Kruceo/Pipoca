import { defineCommand } from "cheloni";
import z from "zod";
import calcVersion from "../calcVersion";
import { getConfig } from "../config";

const historyCmd = defineCommand({
    name: "history",
    description: "Show tag history with calculated versions",
    paths: ["history", "h"], // `d` is now considered a alias for the command
    // options: z.object({
    //     force: z
    //         .boolean()
    //         .optional()
    //         .meta({ aliases: ["f"] }),
    // }),
    // examples: ["deploy staging", "deploy production --force"],
    // details: "Deploys your application to the specified environment.",
    //   middleware: [authMiddleware],
    handler: async ({ positional, options, ctx }) => {
        const config = getConfig()
        console.log("TAG".padEnd(10, ' ') + '| VERSION')
        console.log("".padEnd(20, '-'))
        calcVersion(config.keys.major, config.keys.minor, config.keys.patch, config.ignoreBeforeThisCommit, (t, v) => {
            console.log(t.padEnd(10, ' ') + '| ' + v)
        })

    },
});

export { historyCmd }