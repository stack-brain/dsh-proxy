import { type OAuthProviderId } from './providers.ts';
/** One manually bound third-party account. */
export interface OAuthBinding {
    /** Short non-secret id used to address the binding for removal. */
    id: string;
    provider: OAuthProviderId;
    /** Stable IdP-side subject (never an email / display name). */
    subject: string;
    email?: string;
    displayName?: string;
    /** Local account the binding belongs to (the configured username, or 'default'). */
    localSubject: string;
    boundAt: number;
    boundVia: 'settings' | 'bootstrap';
}
/** Input for a new binding. */
export interface NewBinding {
    provider: OAuthProviderId;
    subject: string;
    email?: string;
    displayName?: string;
    localSubject: string;
    boundVia?: 'settings' | 'bootstrap';
}
/** Tolerant read of an unknown JSON value into a binding list. */
export declare function normalizeBindings(raw: unknown): OAuthBinding[];
/** Look up one bound account; only an exact provider + subject pair matches. */
export declare function findBinding(bindings: readonly OAuthBinding[], provider: OAuthProviderId, subject: string): OAuthBinding | undefined;
/** Add a binding, refusing a duplicate provider + subject pair. */
export declare function addBinding(bindings: readonly OAuthBinding[], input: NewBinding): {
    ok: true;
    bindings: OAuthBinding[];
} | {
    ok: false;
    message: string;
};
/** Remove a binding by its public id (an unknown id is a no-op). */
export declare function removeBinding(bindings: readonly OAuthBinding[], id: string): OAuthBinding[];
/** One-time authorization for a binding flow, held in memory only. */
export interface BindingTicket {
    provider: OAuthProviderId;
    source: string;
    localSubject: string;
    createdAt: number;
}
/**
 * In-memory one-shot tickets. A binding flow cannot be started from the login
 * page or from an unauthenticated request: the settings RPC issues the ticket,
 * `bind/start` only inspects it, and the callback consumes it exactly once.
 */
export declare class BindingTicketStore {
    private readonly tickets;
    private readonly now;
    private readonly ttlMs;
    constructor(options?: {
        now?: () => number;
        ttlMs?: number;
    });
    /** Issue a fresh ticket bound to one provider and one local subject. */
    issue(input: Omit<BindingTicket, 'createdAt'>): string;
    /** Read a live ticket without consuming it. */
    peek(ticket: string | undefined, provider: OAuthProviderId): BindingTicket | null;
    /** Consume a live ticket exactly once. */
    consume(ticket: string | undefined, provider: OAuthProviderId): BindingTicket | null;
}
