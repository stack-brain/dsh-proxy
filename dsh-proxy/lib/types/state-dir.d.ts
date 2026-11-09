/** The three on-disk state files, named once so every caller agrees. */
export declare const PROXY_STATE_FILES: {
    /** Runtime overlay: listen port, username, password. */
    readonly settings: "dsh-proxy.json";
    /** Append-only login audit trail. */
    readonly audit: "dsh-proxy-audit.jsonl";
    /** Transport policy: requireTls / cleartextAuth. */
    readonly security: "dsh-proxy-security.json";
};
/** Subdirectory inside the profile root, keeping state away from cordis files. */
export declare const PROXY_STATE_DIR_NAME = "dsh-proxy";
/** `profile` isolates per profile; `home` keeps the legacy shared behaviour. */
export type StateScope = 'profile' | 'home';
export interface ResolveStateDirOptions {
    /** `ctx.baseUrl` (a `file:` URL of the profile's root config). */
    baseUrl?: string;
    /** Resolved harness home, e.g. `dshHomePath()`. */
    dshHome: string;
    /** Requested storage scope. */
    scope: StateScope;
}
export interface StateDirResolution {
    /** Directory the three state files live in. */
    dir: string;
    /** Scope actually in effect (`home` when a fallback happened). */
    scope: StateScope;
    /** Profile name when isolated. */
    profile?: string;
    /** Why the isolation was abandoned, for the startup log. */
    fallbackReason?: string;
}
/**
 * Turn a cordis `baseUrl` into the profile directory it anchors.
 * A `file:` URL pointing at a file (the documented `cordis.yml` form) is
 * resolved to its parent; a URL already ending in `/` is a directory.
 * @param baseUrl - `ctx.baseUrl`, possibly absent or non-file.
 * @returns the absolute profile directory, or undefined when unusable.
 */
export declare function profileDirFromBaseUrl(baseUrl: string | undefined): string | undefined;
/**
 * Resolve the state directory for this plugin instance.
 *
 * Isolation requires a well-formed profile directory directly under
 * `$DSH_HOME/profiles/`; every other case (shared scope, missing/odd baseUrl,
 * unsafe name) returns the harness home so the plugin keeps working exactly
 * as before, with a reason the caller can log.
 */
export declare function resolveStateDir(options: ResolveStateDirOptions): StateDirResolution;
/**
 * One-time migration: copy the legacy home-root state files into a profile's
 * private directory so an upgrade does not lose the saved port or credentials.
 *
 * The copy happens only while the private directory has NONE of the three
 * files; as soon as the settings page writes one, that profile is on its own
 * and the shared files are never read again. The legacy files are left in
 * place as a rollback path, and a read-only/unwritable home is not an error.
 *
 * @param dir - private state directory (as returned by {@link resolveStateDir}).
 * @param dshHome - resolved harness home holding the legacy files.
 * @returns the file names that were copied (empty when nothing was done).
 */
export declare function seedLegacyState(dir: string, dshHome: string): string[];
