import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import {
  PROXY_STATE_DIR_NAME,
  PROXY_STATE_FILES,
  profileDirFromBaseUrl,
  resolveStateDir,
  seedLegacyState,
} from '../src/state-dir.ts'
import { RuntimeSettingsFile } from '../src/settings.ts'

const dirs: string[] = []

function tempHome(): string {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-proxy-state-'))
  dirs.push(dir)
  return dir
}

/** The file URL the DSH loader anchors at a profile root. */
function profileBaseUrl(home: string, name: string): string {
  return pathToFileURL(join(home, 'profiles', name, 'cordis.yml')).href
}

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true })
})

describe('profileDirFromBaseUrl', () => {
  it('anchors a cordis.yml file URL at the profile directory', () => {
    const home = tempHome()
    expect(profileDirFromBaseUrl(profileBaseUrl(home, 'web')))
      .toBe(join(home, 'profiles', 'web'))
  })

  it('accepts a directory URL ending in a slash', () => {
    const home = tempHome()
    const dir = join(home, 'profiles', 'desktop')
    expect(profileDirFromBaseUrl(`${pathToFileURL(dir).href}/`)).toBe(dir)
  })

  it('rejects non-file, malformed, and absent URLs', () => {
    expect(profileDirFromBaseUrl(undefined)).toBeUndefined()
    expect(profileDirFromBaseUrl('https://example.com/cordis.yml')).toBeUndefined()
    expect(profileDirFromBaseUrl('file:%%%')).toBeUndefined()
  })
})

describe('resolveStateDir', () => {
  it('isolates into the profile private directory by default', () => {
    const home = tempHome()
    const state = resolveStateDir({
      baseUrl: profileBaseUrl(home, 'web'),
      dshHome: home,
      scope: 'profile',
    })
    expect(state.scope).toBe('profile')
    expect(state.profile).toBe('web')
    expect(state.dir).toBe(join(home, 'profiles', 'web', PROXY_STATE_DIR_NAME))
    expect(state.fallbackReason).toBeUndefined()
  })

  it('keeps the legacy shared home when scope is home', () => {
    const home = tempHome()
    const state = resolveStateDir({
      baseUrl: profileBaseUrl(home, 'web'),
      dshHome: home,
      scope: 'home',
    })
    expect(state).toEqual({ dir: home, scope: 'home' })
  })

  it('falls back with a reason when baseUrl is missing or not a profile root', () => {
    const home = tempHome()
    const cases: Array<[string, string | undefined]> = [
      ['missing', undefined],
      ['non-file', 'https://example.com/cordis.yml'],
      ['outside profiles', pathToFileURL(join(home, 'elsewhere', 'cordis.yml')).href],
      ['nested under a profile', pathToFileURL(join(home, 'profiles', 'web', 'nested', 'cordis.yml')).href],
      ['unsafe dot name', profileBaseUrl(home, '.hidden')],
      ['parent traversal', `${pathToFileURL(join(home, 'profiles')).href}/%2e%2e/cordis.yml`],
    ]
    for (const [label, baseUrl] of cases) {
      const state = resolveStateDir({ baseUrl, dshHome: home, scope: 'profile' })
      expect(state.scope, label).toBe('home')
      expect(state.dir, label).toBe(home)
      expect(state.fallbackReason, label).toBeTruthy()
    }
  })
})

describe('seedLegacyState', () => {
  it('copies the legacy files once into a private directory', () => {
    const home = tempHome()
    const settings = { username: 'legacy-user', password: 'legacy-pass' }
    writeFileSync(join(home, PROXY_STATE_FILES.settings), JSON.stringify(settings))
    writeFileSync(join(home, PROXY_STATE_FILES.security), '{"requireTls":true}')

    const dir = join(home, 'profiles', 'web', PROXY_STATE_DIR_NAME)
    expect(seedLegacyState(dir, home)).toEqual([
      PROXY_STATE_FILES.settings,
      PROXY_STATE_FILES.security,
    ])
    expect(JSON.parse(readFileSync(join(dir, PROXY_STATE_FILES.settings), 'utf8'))).toEqual(settings)
    expect(readFileSync(join(dir, PROXY_STATE_FILES.security), 'utf8')).toBe('{"requireTls":true}')
    // The legacy files stay in place as a rollback path.
    expect(existsSync(join(home, PROXY_STATE_FILES.settings))).toBe(true)
    // A second call is a no-op: never overwrite the profile's own state.
    expect(seedLegacyState(dir, home)).toEqual([])
  })

  it('does not seed when any private file already exists', () => {
    const home = tempHome()
    writeFileSync(join(home, PROXY_STATE_FILES.settings), '{"username":"legacy"}')
    const dir = join(home, 'profiles', 'web', PROXY_STATE_DIR_NAME)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, PROXY_STATE_FILES.security), '{"requireTls":false}')

    expect(seedLegacyState(dir, home)).toEqual([])
    expect(existsSync(join(dir, PROXY_STATE_FILES.settings))).toBe(false)
  })

  it('is a no-op for the shared home scope and with no legacy files', () => {
    const home = tempHome()
    expect(seedLegacyState(home, home)).toEqual([])
    expect(seedLegacyState(join(home, 'profiles', 'web', PROXY_STATE_DIR_NAME), home)).toEqual([])
  })
})

describe('per-profile isolation', () => {
  it('writes to one profile without touching the other or the legacy root', () => {
    const home = tempHome()
    const legacy = { listenPort: 3081, username: 'shared', password: 'shared' }
    writeFileSync(join(home, PROXY_STATE_FILES.settings), JSON.stringify(legacy))

    const stateFor = (name: string) => resolveStateDir({
      baseUrl: profileBaseUrl(home, name),
      dshHome: home,
      scope: 'profile',
    }).dir
    const webDir = stateFor('web')
    const desktopDir = stateFor('desktop')
    expect(webDir).not.toBe(desktopDir)
    seedLegacyState(webDir, home)
    seedLegacyState(desktopDir, home)

    const webFile = new RuntimeSettingsFile(join(webDir, PROXY_STATE_FILES.settings))
    const desktopFile = new RuntimeSettingsFile(join(desktopDir, PROXY_STATE_FILES.settings))
    expect(webFile.read().username).toBe('shared')
    expect(desktopFile.read().username).toBe('shared')

    webFile.write({ listenPort: 3091, username: 'web-only', password: 'web-pass' })
    expect(desktopFile.read()).toEqual(legacy)
    expect(JSON.parse(readFileSync(join(home, PROXY_STATE_FILES.settings), 'utf8'))).toEqual(legacy)

    desktopFile.write({ listenPort: 3092, username: 'desktop-only', password: 'desktop-pass' })
    expect(webFile.read().username).toBe('web-only')
    expect(desktopFile.read().username).toBe('desktop-only')
  })
})
