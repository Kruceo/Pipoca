interface ProjectPackageJson {
    name?: string;
    version?: string;
}
export declare function getPackage(): ProjectPackageJson;
export declare function getPackageVersion(): string | undefined;
export declare function updateVersion(version: string): void;
export {};
