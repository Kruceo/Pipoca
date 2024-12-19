import { writeFileSync, readFileSync } from "fs";

export function updateVersion(dst: string, version: string) {
    const file = readFileSync(dst, `utf-8`);
    const versionCode = parseInt(
        version.split(`.`)
            .reduce((a, n) => a + n.padStart(3, `0`))
        )
        console.log(version)
    writeFileSync(dst, file
        .replace(/(?<=versionCode \= )\d+/, versionCode.toString())
        .replace(/(?<=versionName \= ").+(?=")/, version)
    )
}

