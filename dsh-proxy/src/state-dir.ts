/**
 * Where the LAN proxy keeps its three persisted runtime state files.
 *
 * `dshHomePath()` only knows the harness home (`$DSH_HOME` / `~/.dsh`), so
 * writing straight into it makes every installed profile share ONE settings
 * file, ONE audit trail, and ONE transport policy: changing the port or the
 * password from one profile silently changes it for all the others.
 *
 * The DSH loader anchors `ctx.baseUrl` at the profile root's `cordis.yml`
 * (`file://.../profiles/<name>/cordis.yml`), which is all this module needs to
 * derive a private directory per profile. Parsing is deliberately strict:
 * anything unexpected falls back to the legacy shared home instead of ever
 * breaking the plugin's load.
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** The three on-disk state files, named once so every caller agrees. */
export const PROXY_STATE_FILES = {
  /** Runtime overlay: listen port, username, password. */
  settings: 'dsh-proxy.json',
  /** Append-only login audit trail. */
  audit: 'dsh-proxy-audit.jsonl',
  /** Transport policy: requireTls / cleartextAuth. */
  security: 'dsh-proxy-security.json',
} as const

/** Subdirectory inside the profile root, keeping state away from cordis files. */
export const PROXY_STATE_DIR_NAME = 'dsh-proxy'

/** `profile` isolates per profile; `home` keeps the legacy shared behaviour. */
export type StateScope = 'profile' | 'home'

export interface ResolveStateDirOptions {
  /** `ctx.baseUrl` (a `file:` URL of the profile's root config). */
  baseUrl?: string
  /** Resolved harness home, e.g. `dshHomePath()`. */
  dshHome: string
  /** Requested storage scope. */
  scope: StateScope
}

export interface StateDirResolution {
  /** Directory the three state files live in. */
  dir: string
  /** Scope actually in effect (`home` when a fallback happened). */
  scope: StateScope
  /** Profile name when isolated. */
  profile?: string
  /** Why the isolation was abandoned, for the startup log. */
  fallbackReason?: string
}

/** Only simple directory names: no separators, no `..`, no leading dot. */
const SAFE_PROFILE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/

/**
 * Turn a cordis `baseUrl` into the profile directory it anchors.
 * A `file:` URL pointing at a file (the documented `cordis.yml` form) is
 * resolved to its parent; a URL already ending in `/` is a directory.
 * @param baseUrl - `ctx.baseUrl`, possibly absent or non-file.
 * @returns the absolute profile directory, or undefined when unusable.
 */
export function profileDirFromBaseUrl(baseUrl: string | undefined): string | undefined {
  if (typeof baseUrl !== 'string' || !baseUrl.startsWith('file:')) return undefined
  try {
    const url = new URL(baseUrl)
    const path = fileURLToPath(url)
    const dir = url.pathname.endsWith('/') ? path : dirname(path)
    return resolve(dir)
  } catch {
    return undefined
  }
}

/**
 * Resolve the state directory for this plugin instance.
 *
 * Isolation requires a well-formed profile directory directly under
 * `$DSH_HOME/profiles/`; every other case (shared scope, missing/odd baseUrl,
 * unsafe name) returns the harness home so the plugin keeps working exactly
 * as before, with a reason the caller can log.
 */
export function resolveStateDir(options: ResolveStateDirOptions): StateDirResolution {
  const home = resolve(options.dshHome)
  if (options.scope === 'home') return { dir: home, scope: 'home' }

  const profileDir = profileDirFromBaseUrl(options.baseUrl)
  if (profileDir === undefined) {
    return { dir: home, scope: 'home', fallbackReason: 'ctx.baseUrl is missing or not a file: URL' }
  }
  const name = basename(profileDir)
  if (!SAFE_PROFILE_NAME.test(name)) {
    return { dir: home, scope: 'home', fallbackReason: `unsafe profile name ${JSON.stringify(name)}` }
  }
  const profilesRoot = join(home, 'profiles')
  if (resolve(dirname(profileDir)) !== profilesRoot) {
    return { dir: home, scope: 'home', fallbackReason: `baseUrl is not under ${profilesRoot}` }
  }
  return { dir: join(profileDir, PROXY_STATE_DIR_NAME), scope: 'profile', profile: name }
}

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
export function seedLegacyState(dir: string, dshHome: string): string[] {
  const target = resolve(dir)
  const home = resolve(dshHome)
  if (target === home) return []
  const names = Object.values(PROXY_STATE_FILES)
  if (names.some(name => existsSync(join(target, name)))) return []

  const copied: string[] = []
  for (const name of names) {
    if (!existsSync(join(home, name))) continue
    try {
      mkdirSync(target, { recursive: true })
      copyFileSync(join(home, name), join(target, name))
      copied.push(name)
    } catch {
      /* best effort: never let a failed migration break the plugin's boot */
    }
  }
  return copied
}
