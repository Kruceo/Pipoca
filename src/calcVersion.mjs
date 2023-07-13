import { execSync } from 'child_process'

export default function calcVersion(major, minor, patch, callback) {
    const gitLog = execSync('git log --all --oneline').toString();

    const splited = gitLog.split('\n').reverse()
    let version = {
        patch: 0,
        minor: 0,
        major: 0,
        toString: () => {
            return version.major + '.' + version.minor + '.' + version.patch
        }
    }
    splited.forEach(line => {
        if (!/^.+:/.test(line)) return;
        const tag = line.slice(8, line.length).match(/^.+?(?=:)/)[0]
        if ([minor, major, patch].includes(tag)) {

            if (tag == patch) {
                version.patch++
            }
            if (tag == minor) {
                version.minor++
                version.patch = 0
            }
            if (tag == major) {
                version.major++
                version.patch = 0
                version.minor = 0
            }

            callback ? callback(tag, version) : null
        }
    })

    return version.major + '.' + version.minor + '.' + version.patch

}