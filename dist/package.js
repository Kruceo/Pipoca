"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVersion = exports.getPackageVersion = exports.getPackage = void 0;
const fs_1 = __importDefault(require("fs"));
function getPackage() {
    const packageObj = JSON.parse(fs_1.default.readFileSync('package.json', 'utf-8'));
    return packageObj;
}
exports.getPackage = getPackage;
function getPackageVersion() {
    const packageObj = getPackage();
    return packageObj.version;
}
exports.getPackageVersion = getPackageVersion;
function updateVersion(version) {
    let packageObj = getPackage();
    packageObj.version = version;
    fs_1.default.writeFileSync('./package.json', JSON.stringify(packageObj, null, 2));
}
exports.updateVersion = updateVersion;
