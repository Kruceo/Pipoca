import { defineCommand } from "cheloni";
import { createConfigFile } from "../config";

const initCmd = defineCommand({
    name: "init",
    description: "Create a default pipoca.config.json file",
    paths: ["init", "i"],
    handler: async () => {
        createConfigFile()
        console.log("pipoca.config.json created")
    },
});

export { initCmd }
