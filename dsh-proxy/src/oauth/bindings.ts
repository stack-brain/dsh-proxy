/**
 * The manual-binding table: the ONLY authorization source for third-party
 * login. Passing the IdP is not enough — `(provider, subject)` must have been
 * bound from the settings page first.
 */
import { randomBytes } from 'node:crypto'
import { bindingId, isOAuthProviderId, type OAuthProviderId } from './providers.ts'

/** One manually bound third-party account. */
export interface OAuthBinding {
  /** Short non-secret id used to address the binding for removal. */
  id: string
  provider: OAuthProviderId
  /** Stable IdP-side subject (never an email / display name). */
  subject: string
  email?: string
  displayName?: string
  /** Local account the binding belongs to (the configured username, or 'default'). */
  localSubject: string
  boundAt: number
  boundVia: 'settings' | 'bootstrap'
}

/** Input for a new binding. */
export interface NewBinding {
  provider: OAuthProviderId
  subject: string
  email?: string
  displayName?: string
  localSubject: string
  boundVia?: 'settings' | 'bootstrap'
}

/** Tolerant read of an unknown JSON value into a binding list. */
export function normalizeBindings(raw: unknown): OAuthBinding[] {
  if (!Array.isArray(raw)) return []
  const out: OAuthBinding[] = []
  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) continue
    const record = entry as Record<string, unknown>
    if (!isOAuthProviderId(record.provider)) continue
    const subject = typeof record.subject === 'string' ? record.subject.trim() : ''
    if (subject === '') continue
    const email = typeof record.email === 'string' ? record.email.slice(0, 120) : undefined
    const displayName = typeof record.displayName === 'string' ? record.displayName.slice(0, 120) : undefined
    const localSubject = typeof record.localSubject === 'string' && record.localSubject !== ''
      ? record.localSubject.slice(0, 120)
      : 'default'
    const boundAt = typeof record.boundAt === 'number' && Number.isFinite(record.boundAt) ? record.boundAt : Date.now()
    const id = typeof record.id === 'string' && record.id !== '' ? record.id.slice(0, 64) : bindingId()
    out.push({
      id,
      provider: record.provider,
      subject,
      localSubject,
      boundAt,
      boundVia: record.boundVia === 'bootstrap' ? 'bootstrap' : 'settings',
      ...(email === undefined ? {} : { email }),
      ...(displayName === undefined ? {} : { displayName }),
    })
  }
  return out
}

/** Look up one bound account; only an exact provider + subject pair matches. */
export function findBinding(
  bindings: readonly OAuthBinding[],
  provider: OAuthProviderId,
  subject: string,
): OAuthBinding | undefined {
  return bindings.find(entry => entry.provider === provider && entry.subject === subject)
}

/** Add a binding, refusing a duplicate provider + subject pair. */
export function addBinding(
  bindings: readonly OAuthBinding[],
  input: NewBinding,
): { ok: true; bindings: OAuthBinding[] } | { ok: false; message: string } {
  if (input.subject.trim() === '') return { ok: false, message: '三方账号标识为空，无法完成绑定' }
  if (findBinding(bindings, input.provider, input.subject) !== undefined) {
    return { ok: false, message: '该三方账号已经绑定，无需重复绑定' }
  }
  const entry: OAuthBinding = {
    id: bindingId(),
    provider: input.provider,
    subject: input.subject,
    localSubject: input.localSubject,
    boundAt: Date.now(),
    boundVia: input.boundVia ?? 'settings',
    ...(input.email === undefined ? {} : { email: input.email }),
    ...(input.displayName === undefined ? {} : { displayName: input.displayName }),
  }
  return { ok: true, bindings: [...bindings, entry] }
}

/** Remove a binding by its public id (an unknown id is a no-op). */
export function removeBinding(bindings: readonly OAuthBinding[], id: string): OAuthBinding[] {
  return bindings.filter(entry => entry.id !== id)
}

/** One-time authorization for a binding flow, held in memory only. */
export interface BindingTicket {
  provider: OAuthProviderId
  source: string
  localSubject: string
  createdAt: number
}

/**
 * In-memory one-shot tickets. A binding flow cannot be started from the login
 * page or from an unauthenticated request: the settings RPC issues the ticket,
 * `bind/start` only inspects it, and the callback consumes it exactly once.
 */
export class BindingTicketStore {
  private readonly tickets = new Map<string, BindingTicket>()
  private readonly now: () => number
  private readonly ttlMs: number

  constructor(options: { now?: () => number; ttlMs?: number } = {}) {
    this.now = options.now ?? (() => Date.now())
    this.ttlMs = options.ttlMs ?? 600000
  }

  /** Issue a fresh ticket bound to one provider and one local subject. */
  issue(input: Omit<BindingTicket, 'createdAt'>): string {
    const ticket = randomBytes(24).toString('base64url')
    this.tickets.set(ticket, { ...input, createdAt: this.now() })
    return ticket
  }

  /** Read a live ticket without consuming it. */
  peek(ticket: string | undefined, provider: OAuthProviderId): BindingTicket | null {
    if (ticket === undefined || ticket === '') return null
    const record = this.tickets.get(ticket)
    if (record === undefined) return null
    if (this.now() - record.createdAt >= this.ttlMs || record.provider !== provider) {
      this.tickets.delete(ticket)
      return null
    }
    return record
  }

  /** Consume a live ticket exactly once. */
  consume(ticket: string | undefined, provider: OAuthProviderId): BindingTicket | null {
    const record = this.peek(ticket, provider)
    if (record !== null && ticket !== undefined) this.tickets.delete(ticket)
    return record
  }
}
