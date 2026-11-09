/**
 * OAuthRuntime: the single object shared by the controller (settings RPCs),
 * the proxy gate (login-page buttons + gate state) and the HTTP auth routes.
 *
 * It owns the effective config, the manual binding table, the one-shot flow
 * state and tickets. Everything is in memory or in one profile-private file;
 * no cordis dependency so the whole feature stays unit-testable.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { GateDecision } from '../netaccess.ts';
import type { AuthState } from '../auth.ts';
import type { AuditEntry } from '../auth.ts';
import type { LanProxyOAuthView } from '../contract.ts';
import { OAuthStateFile } from './config.ts';
import { type FetchImpl } from './flow.ts';
import { type OAuthConfig, type OAuthLoginButton } from './providers.ts';
/** The face the proxy gate needs (kept small so proxy.ts stays decoupled). */
export interface OAuthGateLike {
    /** Whether ANY authentication method is configured. */
    readonly authEnabled: boolean;
    /** Channel buttons for the current access mode (empty in Basic mode). */
    loginProviders(mode: GateDecision['mode']): OAuthLoginButton[];
    /** Answer one OAuth route; false when the pathname is not ours. */
    handle(req: IncomingMessage, res: ServerResponse, pathname: string, gate: GateDecision, source: string): Promise<boolean>;
}
export interface OAuthRuntimeOptions {
    /** Fully resolved cordis configuration (schema defaults applied). */
    base: OAuthConfig;
    /** Profile-private overlay + binding table. */
    stateFile: OAuthStateFile;
    /** The proxy's session store; external sign-ins reuse it. */
    auth: AuthState;
    /** Current local account name (or 'default' when no password is set). */
    getLocalSubject: () => string;
    /** Whether the local username/password pair is complete. */
    hasPassword: () => boolean;
    /** Active cleartext mode, used to hide channel buttons in Basic mode. */
    cleartextAuth: () => 'login' | 'basic';
    /**
     * Externally reachable proxy origin for binding links and displayed callback
     * hints. Takes the settings RPC's request origin so the hint follows the
     * page the operator is actually on; the live login flow uses `gate.origin`.
     */
    publicOrigin: (requestOrigin?: string) => string;
    audit: (entry: AuditEntry) => void;
    log: (level: 'info' | 'warn' | 'error', message: string) => void;
    now?: () => number;
    fetchImpl?: FetchImpl;
}
/** Result shapes returned to the settings RPC dispatcher. */
export type OAuthViewResult = {
    ok: true;
    view: LanProxyOAuthView;
} | {
    ok: false;
    message: string;
};
export declare class OAuthRuntime implements OAuthGateLike {
    private config;
    private bindings;
    private readonly flows;
    private readonly tickets;
    private readonly now;
    private readonly opts;
    constructor(options: OAuthRuntimeOptions);
    /** Effective config (used by the controller for status/log decisions). */
    get effective(): OAuthConfig;
    /** Providers that are enabled, fully configured and have valid endpoints. */
    private ready;
    /** D2: password login OR at least one usable OAuth provider. */
    get authEnabled(): boolean;
    /** D7: only enabled channels appear; D5: never in Basic mode; D2′: none with no auth. */
    loginProviders(mode: GateDecision['mode']): OAuthLoginButton[];
    /** A one-time bootstrap: deployment-declared bindings are written only once. */
    private applyBootstrap;
    /** Write the overlay + binding table atomically. */
    private persist;
    /** The redirect URI registered at the IdP (explicit override wins). */
    private redirectUri;
    /** The settings-page view: masked-in-UI secrets, resolved endpoints, bindings. */
    statusView(requestOrigin?: string): LanProxyOAuthView;
    /** Validate and persist a settings patch; the running proxy sees it at once. */
    updateConfig(payload: unknown, requestOrigin?: string): OAuthViewResult;
    /** Issue a one-shot binding ticket from the settings page. */
    startBinding(payload: unknown, requestOrigin?: string): {
        ok: true;
        startUrl: string;
    } | {
        ok: false;
        message: string;
    };
    /** Remove one binding; the account loses access immediately. */
    removeBindingById(payload: unknown, requestOrigin?: string): OAuthViewResult;
    /**
     * Send the popup result page. The opener never navigates: it listens on a
     * same-origin BroadcastChannel (see `finish.ts`) and reloads on success.
     * `headers` carries the session cookie for a successful login.
     */
    private finish;
    /** Audit helper: never record codes, tokens, secrets or state values. */
    private audit;
    /**
     * Answer every `/__dsh-proxy/oauth/...` route.
     *
     * D2′: with no authentication method configured (or a disabled channel) all
     * of them answer 403 and audit `oauth-unavailable`; the rest of the proxy
     * keeps its open-access, warning-only posture.
     */
    handle(req: IncomingMessage, res: ServerResponse, pathname: string, gate: GateDecision, source: string): Promise<boolean>;
}
