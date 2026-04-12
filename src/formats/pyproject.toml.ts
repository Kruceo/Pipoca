import { writeFileSync, readFileSync } from "fs";

export function updateVersion(dst: string, version: string) {
    const file = readFileSync(dst, `utf-8`);
    writeFileSync(dst, file.replace(
        /^version\s*=\s*"[^"]*"/m,
        `version = "${version}"`
    ))
}
