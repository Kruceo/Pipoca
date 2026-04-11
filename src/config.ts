import fs, { existsSync } from 'fs'

export interface PipocaConfig {
    keys: {
        patch: string[]
        minor: string[]
        major: string[]
    },
    commands: {
        before: string[],
        after: string[]
    },
    ignoreBeforeThisCommit?: string
}

export const DEFAULT_CONFIG: PipocaConfig = {
    keys: {
        "patch": ["fix"],
        "minor": ["att"],
        "major": ["new"],
    },
    commands: {
        before: [],
        after: []
    }
}
const configPath = './pipoca.config.json'

export function getConfig(): PipocaConfig {
    if (existsSync(configPath)) {
        const loadedConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        return { ...DEFAULT_CONFIG, ...loadedConfig }

    }
    return DEFAULT_CONFIG
}

export function createConfigFile() {
    if (!existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2))
    }
}