import type { OAuthEndpoints, OAuthProviderId } from './providers.ts';
/** Why a flow was started: sign in, or bind an account from the settings page. */
export type OAuthIntent = 'login' | 'bind';
/** One in-flight authorization-code flow. */
export interface OAuthFlowState {
    provider: OAuthProviderId;
    intent: OAuthIntent;
    codeVerifier: string;
    /** The origin used in `redirect_uri`; reused verbatim at the token exchange. */
    publicOrigin: string;
    source: string;
    /** Present only for bind flows; consumed by the callback. */
    ticket?: string;
    createdAt: number;
}
/** In-memory one-shot state store with a TTL. */
export declare class OAuthStateStore {
    private readonly flows;
    private readonly now;
    private readonly ttlMs;
    constructor(options?: {
        now?: () => number;
        ttlMs?: number;
    });
    /** Register one flow and return its opaque `state` value. */
    issue(input: Omit<OAuthFlowState, 'createdAt'>): string;
    /** Consume a flow exactly once, checking its TTL and provider binding. */
    consume(state: string | undefined, provider: OAuthProviderId): OAuthFlowState | null;
}
/** PKCE S256 verifier + challenge pair. */
export declare function pkcePair(): {
    verifier: string;
    challenge: string;
};
/** Build the IdP authorize URL with all required query parameters. */
export declare function buildAuthorizeUrl(input: {
    endpoint: string;
    clientId: string;
    redirectUri: string;
    scopes: string;
    state: string;
    challenge: string;
    /** Optional Casdoor-style hint; only sent when non-blank. */
    providerHint?: string;
}): string;
/** The subset of fetch used by the two upstream calls (injectable in tests). */
export type FetchImpl = typeof globalThis.fetch;
/** A successful token exchange carries only the access token, never credentials. */
export type TokenResult = {
    ok: true;
    accessToken: string;
} | {
    ok: false;
    message: string;
};
/** Exchange an authorization code for an access token. */
export declare function exchangeCode(input: {
    endpoint: string;
    clientId: string;
    clientSecret: string;
    code: string;
    redirectUri: string;
    codeVerifier: string;
    fetchImpl?: FetchImpl;
}): Promise<TokenResult>;
/** Fetch the userinfo document with the access token as a Bearer credential. */
export declare function fetchUserInfo(input: {
    endpoint: string;
    accessToken: string;
    fetchImpl?: FetchImpl;
}): Promise<{
    ok: true;
    info: unknown;
} | {
    ok: false;
    message: string;
}>;
/** The three endpoints a flow needs, already resolved by providers.ts. */
export type FlowEndpoints = Pick<OAuthEndpoints, 'authorizationEndpoint' | 'tokenEndpoint' | 'userInfoEndpoint'>;
