"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVersion = void 0;
const fs_1 = __importDefault(require("fs"));
function updateVersion(pkgPath, version) {
    let packageObj = JSON.parse(fs_1.default.readFileSync(pkgPath, "utf-8"));
    packageObj.version = version;
    fs_1.default.writeFileSync(pkgPath, JSON.stringify(packageObj, null, 2));
}
exports.updateVersion = updateVersion;
