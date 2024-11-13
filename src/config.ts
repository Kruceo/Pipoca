import fs, { existsSync } from 'fs'

export interface PipocaConfig {
    keys: {
        patch: string[]
        minor: string[]
        major: string[]
    },
    commands:{
        before: string[],
        after: string[]
    }
}

const defaultConfig: PipocaConfig = {
    keys: {
        "patch": ["fix"],
        "minor": ["att"],
        "major": ["new"],
    },
    commands:{
        before:[],
        after:["git add package.json","git commit --amend --no-edit"]
    }
}
const configPath = './pipoca.config.json'

export function getConfig(): PipocaConfig {
    if (existsSync(configPath)) {
        const loadedConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        return { ...defaultConfig, ...loadedConfig }

    }
    return defaultConfig
}

export function createConfigFile() {
    if (!existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2))
    }
}