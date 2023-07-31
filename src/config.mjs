import fs, { existsSync } from 'fs'

const defaultConfig = {
    keys: {

        "patch":"fix",
        "minor":"att",
        "major":"new",
    },
    commands:{
        pre:[],
        pos:[]
    }
}
const configPath = './pipoca.config.json'
/**
 * 
 * @returns {defaultConfig}
 */
export function getConfig() {
   

    if (existsSync(configPath)) {
        const loadedConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        return { ...defaultConfig, ...loadedConfig }

    }
    return defaultConfig
}

export function createConfigFile() {
    
    if (!existsSync(configPath)) {
        fs.writeFileSync(configPath,JSON.stringify(defaultConfig,' ',2))
    }
}