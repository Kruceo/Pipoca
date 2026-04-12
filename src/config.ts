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

export const TEMPLATES: Record<string, PipocaConfig> = {
    default: DEFAULT_CONFIG,
    conventional: {
        keys: {
            patch: ["fix", "style", "refactor", "improvement"],
            minor: ["feat","feature"],
            major: ["breaking", "release"],
        },
        commands: { before: [], after: [] },
    },
    simple: {
        keys: {
            patch: ["fix"],
            minor: ["feature"],
            major: ["release"],
        },
        commands: { before: [], after: [] },
    },
}

const configPath = './pipoca.config.json'

export function getConfig(): PipocaConfig {
    if (existsSync(configPath)) {
        const loadedConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        return { ...DEFAULT_CONFIG, ...loadedConfig }

    }
    return DEFAULT_CONFIG
}

export function createConfigFile(template: string = 'default') {
    if (!existsSync(configPath)) {
        const config = TEMPLATES[template] ?? DEFAULT_CONFIG
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    }
}