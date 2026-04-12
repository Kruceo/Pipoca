import { execSync } from 'child_process'

export interface VersionEntry {
    tag: string
    version: string
    hash: string
    message: string
}

export default function calcVersion(majorTags: string[], minorTags: string[], patchTags: string[], ignoreBeforeThisCommit?: string, perCommitCallback?: (entry: VersionEntry) => void) {
    const gitLogRange = ignoreBeforeThisCommit ? `${ignoreBeforeThisCommit}~1..HEAD` : 'HEAD'
    const gitLog = execSync(`git log --oneline ${gitLogRange}`).toString();
    const gitlogLines = gitLog.split('\n').reverse()

    let version = {
        patch: 0,
        minor: 0,
        major: 0,
        toString: () => {
            return version.major + '.' + version.minor + '.' + version.patch
        }
    }
    gitlogLines.forEach(line => {
        if (!/^.+?(:|\/).+?/.test(line)) return;

        const tagMatch = line.slice(8, line.length).match(/^.+?(?=(:|\/))/)
        if (!tagMatch) return;

        const tag = tagMatch[0].toLowerCase()
        const hash = line.slice(0, 7)
        const message = line.slice(8).trim()

        if ([...minorTags, ...majorTags, ...patchTags].map(f => f.toLowerCase()).includes(tag)) {

            if (patchTags.includes(tag)) {
                version.patch++
            }
            if (minorTags.includes(tag)) {
                version.minor++
                version.patch = 0
            }
            if (majorTags.includes(tag)) {
                version.major++
                version.patch = 0
                version.minor = 0
            }

            perCommitCallback ? perCommitCallback({ tag, version: version.toString(), hash, message }) : null
        }
    })

    return version.major + '.' + version.minor + '.' + version.patch

}