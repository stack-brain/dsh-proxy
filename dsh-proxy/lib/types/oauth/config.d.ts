import { type OAuthConfig } from './providers.ts';
import { type OAuthBinding } from './bindings.ts';
/** The on-disk shape. `overlay` is absent until the settings page saves once. */
export interface OAuthState {
    overlay?: OAuthConfig;
    bindings: OAuthBinding[];
}
/** Empty state used when the file is missing or unreadable. */
export declare function emptyOAuthState(): OAuthState;
/** Tolerant read of an unknown YAML/JSON value into the state shape. */
export declare function normalizeOAuthState(raw: unknown): OAuthState;
/** Read/write access to the OAuth state file (atomic temp + rename writes). */
export declare class OAuthStateFile {
    private readonly filePath;
    constructor(filePath: string);
    read(): OAuthState;
    write(state: OAuthState): void;
}
/**
 * Turn an unknown JSON value (cordis config or a settings patch) into a
 * COMPLETE OAuthConfig. `base` supplies every field the value omits, so a
 * partial patch never drops a configured client secret.
 */
export declare function normalizeOAuthConfig(raw: unknown, base?: OAuthConfig): OAuthConfig;
/**
 * Effective config = cordis base + persisted overlay. The overlay stores a
 * COMPLETE config (the settings page always submits every field), so it wins
 * wholesale — exactly like the existing runtime-settings overlay.
 */
export declare function mergeOAuthConfig(base: OAuthConfig, state: OAuthState): OAuthConfig;
/** Validation outcome for a settings-page patch. */
export type OAuthPatchValidation = {
    ok: true;
    config: OAuthConfig;
} | {
    ok: false;
    message: string;
};
/**
 * Validate a settings patch, returning the complete next config.
 *
 * An ENABLED provider must have credentials and usable endpoints; otherwise the
 * save is rejected with a Chinese reason instead of leaving a half-configured
 * channel that cannot serve its callback.
 */
export declare function validateOAuthPatch(payload: unknown, current: OAuthConfig): OAuthPatchValidation;
