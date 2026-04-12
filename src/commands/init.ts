import { defineCommand } from "cheloni";
import z from "zod";
import { createConfigFile, TEMPLATES } from "../config";

const templateNames = Object.keys(TEMPLATES)

const initCmd = defineCommand({
    name: "init",
    description: "Create a default pipoca.config.json file",
    paths: ["init", "i"],
    options: z.object({
        template: z.enum(templateNames as [string, ...string[]]).optional().meta({
            description: 'Config template to use',
            aliases: ['t'],
            examples: [
                'pipoca init',
                'pipoca init -t conventional',
                'pipoca init --template simple',
            ],
        }),
    }),
    handler: async ({ options }) => {
        createConfigFile(options.template)
        console.log(`pipoca.config.json created${options.template ? ` with template "${options.template}"` : ''}`)
    },
});

export { initCmd }
