import fs from 'fs'

export function updateVersion(pkgPath: string, version: string) {
    let packageObj = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
    packageObj.version = version
    fs.writeFileSync(pkgPath, JSON.stringify(packageObj, null, 2))
}