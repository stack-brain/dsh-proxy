/**
 * The manual binding table and the one-shot tickets that authorize a binding
 * flow. Both are pure/in-memory and are the core of the "only bound accounts
 * can sign in" rule.
 */
import { describe, expect, it } from 'vitest'
import {
  BindingTicketStore,
  addBinding,
  findBinding,
  normalizeBindings,
  removeBinding,
  type OAuthBinding,
} from '../src/oauth/bindings.ts'

const binding = (overrides: Partial<OAuthBinding> = {}): OAuthBinding => ({
  id: 'b1',
  provider: 'github',
  subject: '42',
  localSubject: 'admin',
  boundAt: 1000,
  boundVia: 'settings',
  ...overrides,
})

describe('binding table', () => {
  it('matches only the exact provider + subject pair', () => {
    const rows = [binding(), binding({ id: 'b2', provider: 'google', subject: 'sub-1' })]
    expect(findBinding(rows, 'github', '42')?.id).toBe('b1')
    expect(findBinding(rows, 'github', 'sub-1')).toBeUndefined()
    expect(findBinding(rows, 'google', '42')).toBeUndefined()
  })

  it('refuses a duplicate binding and removes by id', () => {
    const first = addBinding([], { provider: 'github', subject: '42', localSubject: 'admin' })
    expect(first.ok).toBe(true)
    if (!first.ok) return
    expect(first.bindings).toHaveLength(1)
    expect(first.bindings[0].id).not.toBe('')
    const duplicate = addBinding(first.bindings, { provider: 'github', subject: '42', localSubject: 'admin' })
    expect(duplicate.ok).toBe(false)
    if (!duplicate.ok) expect(duplicate.message).toContain('已经绑定')
    expect(removeBinding(first.bindings, first.bindings[0].id)).toEqual([])
    expect(removeBinding(first.bindings, 'unknown')).toHaveLength(1)
    expect(addBinding([], { provider: 'github', subject: '  ', localSubject: 'admin' }).ok).toBe(false)
  })

  it('tolerates corrupt persisted rows and ignores email-only rows', () => {
    const rows = normalizeBindings([
      null,
      { provider: 'unknown', subject: '1' },
      { provider: 'github', subject: '' },
      { provider: 'github', subject: '42', email: 'a@b.c', boundVia: 'bootstrap' },
      { provider: 'feishu', subject: 'ou-1', localSubject: '' },
    ])
    expect(rows).toHaveLength(2)
    expect(rows[0].boundVia).toBe('bootstrap')
    expect(rows[0].email).toBe('a@b.c')
    expect(rows[1].localSubject).toBe('default')
  })
})

describe('BindingTicketStore', () => {
  it('peeks without consuming, then consumes exactly once', () => {
    const store = new BindingTicketStore({ now: () => 1000 })
    const ticket = store.issue({ provider: 'github', source: 'settings', localSubject: 'admin' })
    expect(ticket.length).toBeGreaterThan(10)
    expect(store.peek(ticket, 'github')?.localSubject).toBe('admin')
    expect(store.consume(ticket, 'github')?.localSubject).toBe('admin')
    expect(store.consume(ticket, 'github')).toBeNull()
  })

  it('rejects a mismatched provider, an unknown ticket and an expired ticket', () => {
    const store = new BindingTicketStore({ now: () => 1000 })
    const ticket = store.issue({ provider: 'github', source: 'settings', localSubject: 'admin' })
    expect(store.peek(ticket, 'google')).toBeNull()
    expect(store.peek('nope', 'github')).toBeNull()

    let now = 1000
    const expiring = new BindingTicketStore({ now: () => now, ttlMs: 100 })
    const expiringTicket = expiring.issue({ provider: 'feishu', source: 'settings', localSubject: 'default' })
    now = 1101
    expect(expiring.consume(expiringTicket, 'feishu')).toBeNull()
  })
})
