import fs from 'fs'

interface ProjectPackageJson {
    name?: string
    version?: string
}

export function getPackage(): ProjectPackageJson {
    const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
    return packageObj
}

export function getPackageVersion() {
    const packageObj = getPackage()
    return packageObj.version
}

export function updateVersion(version: string) {
    let packageObj = getPackage()
    packageObj.version = version
    fs.writeFileSync('./package.json', JSON.stringify(packageObj, null, 2))
}