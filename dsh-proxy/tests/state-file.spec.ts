/**
 * Unified YAML state IO: readable output, atomic writes, tolerant reads and the
 * one-time migration from the legacy JSON config files.
 */
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  legacyJsonPath,
  migrateLegacyStateFile,
  parseStateYaml,
  readStateYaml,
  stringifyStateYaml,
  writeStateYaml,
} from '../src/state-file.ts'
import { PROXY_STATE_FILES, LEGACY_JSON_STATE_FILES } from '../src/state-dir.ts'

const dirs: string[] = []
const tempDir = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-yaml-state-'))
  dirs.push(dir)
  return dir
}
afterEach(() => {
  while (dirs.length > 0) rmSync(dirs.pop() as string, { recursive: true, force: true })
})

type Doc = { enabled?: boolean; username?: string; nested?: { a?: string } }

const normalize = (raw: unknown): Doc => {
  if (typeof raw !== 'object' || raw === null) return {}
  const record = raw as Record<string, unknown>
  const out: Doc = {}
  if (typeof record.enabled === 'boolean') out.enabled = record.enabled
  if (typeof record.username === 'string') out.username = record.username
  if (typeof record.nested === 'object' && record.nested !== null) {
    const inner = record.nested as Record<string, unknown>
    out.nested = { a: typeof inner.a === 'string' ? inner.a : undefined }
  }
  return out
}

describe('YAML serialization', () => {
  it('writes readable, unquoted keys instead of JSON punctuation', () => {
    const text = stringifyStateYaml({ enabled: true, username: 'alice', nested: { a: '中文' } })
    expect(text).toContain('enabled: true')
    expect(text).toContain('username: alice')
    expect(text).toContain('中文')
    expect(text).not.toContain('"username"')
    expect(text).not.toContain('{')
  })

  it('keeps a long URL on one line and escapes values safely', () => {
    const url = 'https://door.example.com/login/oauth/authorize?client_id=abc&scope=openid+profile+email'
    const text = stringifyStateYaml({ url, password: 'a: b # c' })
    expect(text).toContain(url)
    expect(parseStateYaml(text)).toEqual({ url, password: 'a: b # c' })
  })
})

describe('readStateYaml / writeStateYaml', () => {
  it('round-trips a document and creates parent directories', () => {
    const path = join(tempDir(), 'nested', 'dir', 'state.yaml')
    writeStateYaml(path, { enabled: true, username: 'bob' })
    expect(existsSync(path)).toBe(true)
    expect(existsSync(`${path}.tmp`)).toBe(false)
    expect(readStateYaml(path, normalize, () => ({}))).toEqual({ enabled: true, username: 'bob' })
  })

  it('uses the fallback for a missing file', () => {
    const path = join(tempDir(), 'absent.yaml')
    expect(readStateYaml(path, normalize, () => ({ enabled: false }))).toEqual({ enabled: false })
  })

  it('uses the fallback for a corrupt YAML file', () => {
    const path = join(tempDir(), 'broken.yaml')
    writeFileSync(path, 'key: [unterminated\n', 'utf8')
    expect(readStateYaml(path, normalize, () => ({}))).toEqual({})
  })

  it('normalizes partial documents rather than trusting unknown fields', () => {
    const path = join(tempDir(), 'partial.yaml')
    writeFileSync(path, 'username: carol\nunknownField: 42\n', 'utf8')
    expect(readStateYaml(path, normalize, () => ({}))).toEqual({ username: 'carol' })
  })

  it('prefers the YAML file when both formats exist', () => {
    const path = join(tempDir(), 'both.yaml')
    writeFileSync(path, 'username: from-yaml\n', 'utf8')
    writeFileSync(legacyJsonPath(path), '{"username":"from-json"}', 'utf8')
    expect(readStateYaml(path, normalize, () => ({}))).toEqual({ username: 'from-yaml' })
  })
})

describe('legacy JSON migration', () => {
  it('reads the old JSON, writes YAML once, and keeps the old file', () => {
    const path = join(tempDir(), 'dsh-proxy-oauth.yaml')
    const legacy = legacyJsonPath(path)
    writeFileSync(legacy, JSON.stringify({ enabled: true, username: 'legacy', nested: { a: 'x' } }), 'utf8')

    const value = readStateYaml(path, normalize, () => ({}))
    expect(value).toEqual({ enabled: true, username: 'legacy', nested: { a: 'x' } })
    expect(existsSync(path)).toBe(true)
    expect(existsSync(legacy)).toBe(true)
    expect(readFileSync(path, 'utf8')).toContain('username: legacy')

    // A second read uses the YAML file, so editing it wins over the stale JSON.
    writeFileSync(path, 'username: edited\n', 'utf8')
    expect(readStateYaml(path, normalize, () => ({}))).toEqual({ username: 'edited' })
  })

  it('ignores a corrupt legacy JSON and returns the fallback', () => {
    const path = join(tempDir(), 'dsh-proxy.yaml')
    writeFileSync(legacyJsonPath(path), '{not json', 'utf8')
    expect(readStateYaml(path, normalize, () => ({ enabled: false }))).toEqual({ enabled: false })
    expect(existsSync(path)).toBe(false)
  })

  it('maps the declared state file names to their legacy counterparts', () => {
    expect(legacyJsonPath(PROXY_STATE_FILES.settings)).toBe(LEGACY_JSON_STATE_FILES.settings)
    expect(legacyJsonPath(PROXY_STATE_FILES.security)).toBe(LEGACY_JSON_STATE_FILES.security)
    expect(legacyJsonPath(PROXY_STATE_FILES.oauth)).toBe(LEGACY_JSON_STATE_FILES.oauth)
    expect(PROXY_STATE_FILES.audit).toBe('dsh-proxy-audit.jsonl')
  })

  it('migrateLegacyStateFile converts and reports failure for bad input', () => {
    const dir = tempDir()
    const src = join(dir, 'old.json')
    const dest = join(dir, 'new.yaml')
    writeFileSync(src, '{"username":"moved"}', 'utf8')
    expect(migrateLegacyStateFile(src, dest)).toBe(true)
    expect(parseStateYaml(readFileSync(dest, 'utf8'))).toEqual({ username: 'moved' })
    expect(migrateLegacyStateFile(join(dir, 'missing.json'), dest)).toBe(false)
  })
})
