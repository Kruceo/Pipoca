import fs from 'fs'

export function getPackage(){
    const packageObj = JSON.parse(fs.readFileSync('package.json','utf-8'))
    return packageObj
}

export function getPackageVersion(){
    const packageObj = getPackage()
    return packageObj.version
}

export function updateVersion(version){
    let packageObj = getPackage()
    packageObj.version = version
    fs.writeFileSync('./package.json',JSON.stringify(packageObj,' ',2))
}