import { defineCommand } from "cheloni";
import z from "zod";
import calcVersion, { VersionEntry } from "../calcVersion";
import { getConfig, type PipocaConfig } from "../config";

type BumpType = 'major' | 'minor' | 'patch'

function getBumpType(tag: string, config: PipocaConfig): BumpType {
    if (config.keys.major.map(t => t.toLowerCase()).includes(tag)) return 'major'
    if (config.keys.minor.map(t => t.toLowerCase()).includes(tag)) return 'minor'
    return 'patch'
}

function getBumpColor(bump: BumpType): string {
    switch (bump) {
        case 'major': return '\x1b[31m'
        case 'minor': return '\x1b[33m'
        case 'patch': return '\x1b[32m'
    }
}

function formatVersionColored(version: string, bump: BumpType): string {
    const parts = version.split('.')
    const color = getBumpColor(bump)
    const bumpIndex = bump === 'major' ? 0 : bump === 'minor' ? 1 : 2
    return parts.map((p, i) => i === bumpIndex ? `${color}${p}\x1b[0m` : p).join('.')
}

function prettyPrint(entries: VersionEntry[], config: PipocaConfig) {
    const reset = '\x1b[0m'
    const dim = '\x1b[2m'
    const bold = '\x1b[1m'

    console.log(`\n${bold}  Version History${reset}\n`)
    console.log(`  ${dim}${'─'.repeat(60)}${reset}`)

    entries.forEach((entry, i) => {
        const bump = getBumpType(entry.tag, config)
        const bumpColor = getBumpColor(bump)
        const bumpLabel = bump.padEnd(6)
        const versionColored = formatVersionColored(entry.version, bump)

        const connector = i === entries.length - 1 ? '└──' : '├──'
        const tagLabel = `${bumpColor}${bumpLabel}${reset}`

        console.log(`  ${connector} ${tagLabel} ${bold}${versionColored}${reset}  ${dim}${entry.hash}${reset}  ${entry.message}`)
    })

    console.log(`  ${dim}${'─'.repeat(60)}${reset}`)

    if (entries.length > 0) {
        const last = entries[entries.length - 1]
        console.log(`\n  ${bold}Current version: ${last.version}${reset}\n`)
    } else {
        console.log(`\n  ${dim}No version entries found.${reset}\n`)
    }
}

function simplePrint(entries: VersionEntry[]) {
    console.log("TAG".padEnd(10, ' ') + '| VERSION')
    console.log("".padEnd(20, '-'))
    entries.forEach(entry => {
        console.log(entry.tag.padEnd(10, ' ') + '| ' + entry.version)
    })
}

const historyCmd = defineCommand({
    name: "history",
    description: "Show tag history with calculated versions",
    paths: ["history", "h"],
    options: z.object({
        simple: z.boolean().optional().meta({
            aliases: ["s"],
            description: 'Show simplified output',
        }),
    }),
    handler: async ({ options }) => {
        const config = getConfig()
        const entries: VersionEntry[] = []
        calcVersion(config.keys.major, config.keys.minor, config.keys.patch, config.ignoreBeforeThisCommit, (entry) => {
            entries.push(entry)
        })

        if (options.simple) {
            simplePrint(entries)
        } else {
            prettyPrint(entries, config)
        }
    },
});

export { historyCmd }
