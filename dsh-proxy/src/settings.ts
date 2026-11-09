/**
 * Persisted runtime settings for the LAN proxy: a small YAML file under the
 * DSH home that overlays the cordis config. The settings page writes here so
 * changes survive `dsh web` restarts; the file is the single source of truth
 * for the runtime overrides (proxy listen port, username, password).
 */
import type { LanProxyUpdatePayload } from './contract.ts'
import { readStateYaml, writeStateYaml } from './state-file.ts'

/** The on-disk shape (a subset of the update payload; no derived fields). */
export interface PersistedRuntimeSettings {
  /** Proxy listen port override. */
  listenPort?: number
  /** Deprecated forward-target override, kept for legacy persisted files. */
  upstreamPort?: number
  username?: string
  password?: string
}

/** Tolerant read of an unknown YAML/JSON value into the persisted shape. */
export function normalizeRuntimeSettings(raw: unknown): PersistedRuntimeSettings {
  if (typeof raw !== 'object' || raw === null) return {}
  const source = raw as Record<string, unknown>
  const out: PersistedRuntimeSettings = {}
  if (typeof source.listenPort === 'number' && Number.isInteger(source.listenPort)) {
    out.listenPort = source.listenPort
  }
  if (typeof source.upstreamPort === 'number' && Number.isInteger(source.upstreamPort)) {
    out.upstreamPort = source.upstreamPort
  }
  if (typeof source.username === 'string') out.username = source.username
  if (typeof source.password === 'string') out.password = source.password
  return out
}

/**
 * Read/write access to the persisted settings file. Writes are atomic
 * (temp file + rename) so a crash never leaves a truncated file behind.
 */
export class RuntimeSettingsFile {
  constructor(private readonly filePath: string) {}

  read(): PersistedRuntimeSettings {
    return readStateYaml(this.filePath, normalizeRuntimeSettings, () => ({}))
  }

  write(settings: PersistedRuntimeSettings): void {
    writeStateYaml(this.filePath, settings)
  }
}

export type UpdateValidation =
  | { ok: true; patch: Required<Pick<LanProxyUpdatePayload, 'listenPort' | 'upstreamPort' | 'username' | 'password'>> & LanProxyUpdatePayload }
  | { ok: false; message: string }

const MAX_USERNAME_LENGTH = 64
const MAX_PASSWORD_LENGTH = 128

/**
 * Validate an update payload from the settings page.
 * @param payload - the raw RPC payload.
 * @param currentListenPort - the proxy's current listen port.
 * @param currentUpstreamPort - the current forward-target (default service) port.
 * @returns the normalized patch, or a user-facing rejection message.
 */
export function validateUpdate(
  payload: unknown,
  currentListenPort: number,
  currentUpstreamPort: number,
): UpdateValidation {
  if (typeof payload !== 'object' || payload === null) {
    return { ok: false, message: '请求体必须是对象' }
  }
  const input = payload as Record<string, unknown>
  const patch: LanProxyUpdatePayload = {}

  if (input.listenPort !== undefined) {
    const port = input.listenPort
    if (typeof port !== 'number' || !Number.isInteger(port) || port < 1 || port > 65535) {
      return { ok: false, message: `代理服务端口无效：${String(port)}（需要 1–65535 的整数）` }
    }
    if (port === currentUpstreamPort) {
      return { ok: false, message: `代理服务端口不能与默认服务端口相同（都是 ${port}）` }
    }
    patch.listenPort = port
  }

  // Deprecated forward-target patch, accepted for legacy persisted configs
  // and scripts; the settings page no longer edits this port.
  if (input.upstreamPort !== undefined) {
    const port = input.upstreamPort
    if (typeof port !== 'number' || !Number.isInteger(port) || port < 1 || port > 65535) {
      return { ok: false, message: `转发目标端口无效：${String(port)}（需要 1–65535 的整数）` }
    }
    if (port === currentListenPort) {
      return { ok: false, message: `转发目标端口不能与代理服务端口相同（都是 ${port}）` }
    }
    patch.upstreamPort = port
  }

  if (input.username !== undefined) {
    if (typeof input.username !== 'string') return { ok: false, message: '用户名必须是字符串' }
    if (input.username.length > MAX_USERNAME_LENGTH) {
      return { ok: false, message: `用户名过长（最多 ${MAX_USERNAME_LENGTH} 个字符）` }
    }
    patch.username = input.username
  }

  if (input.password !== undefined) {
    if (typeof input.password !== 'string') return { ok: false, message: '密码必须是字符串' }
    if (input.password.length > MAX_PASSWORD_LENGTH) {
      return { ok: false, message: `密码过长（最多 ${MAX_PASSWORD_LENGTH} 个字符）` }
    }
    patch.password = input.password
  }

  if (patch.listenPort === undefined && patch.upstreamPort === undefined && patch.username === undefined && patch.password === undefined) {
    return { ok: false, message: '没有可保存的修改' }
  }
  return {
    ok: true,
    patch: patch as Required<Pick<LanProxyUpdatePayload, 'listenPort' | 'upstreamPort' | 'username' | 'password'>> & LanProxyUpdatePayload,
  }
}
