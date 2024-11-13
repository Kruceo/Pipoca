export interface PipocaConfig {
    keys: {
        patch: string[];
        minor: string[];
        major: string[];
    };
    commands: {
        before: string[];
        after: string[];
    };
}
export declare function getConfig(): PipocaConfig;
export declare function createConfigFile(): void;
