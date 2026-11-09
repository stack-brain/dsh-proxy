import { type AuthPolicy } from './auth.ts';
import { type CleartextAuthMode } from './security.ts';
import { type OAuthViewResult } from './oauth/runtime.ts';
import { type OAuthConfig } from './oauth/providers.ts';
import { type LanProxyAuditView, type LanProxyAuthView, type LanProxyOAuthView, type LanProxyStatus, type LanProxyUpdateResult } from './contract.ts';
/** The fully-resolved runtime options of one proxy instance. */
export interface EffectiveProxyOptions {
    listenHost: string;
    listenPort: number;
    upstreamHost: string;
    upstreamPort: number;
    username: string;
    password: string;
}
export interface ProxyControllerOptions {
    /** Options from the cordis config (schema defaults applied, upstream port resolved). */
    base: EffectiveProxyOptions;
    /** Path of the persisted runtime-settings JSON. */
    settingsFile: string;
    /**
     * Host hook building DSH's launch-token URL for a public origin, so a LAN
     * visitor's first index request can log itself in (see
     * {@link LanProxyOptions.authenticatedUrl}). Absent when the host has none.
     */
    authenticatedUrl?: (publicOrigin: string) => string | undefined;
    /**
     * Path of the persisted audit trail. The login gate records failures and
     * session lifecycle there; omit it to keep the trail in memory only.
     */
    auditFile?: string;
    /** Session/throttle policy for the login gate (defaults to {@link DEFAULT_AUTH_POLICY}). */
    authPolicy?: Partial<AuthPolicy>;
    /** Addresses whose forwarded headers are believed (the TLS proxy in front). */
    trustedProxyAddresses?: readonly string[];
    /** Refuse cleartext instead of falling back to Basic Auth (default false = LAN-over-HTTP supported). */
    requireTls?: boolean;
    /** Path of the persisted transport policy (`requireTls`), so the switch survives a restart. */
    securityFile?: string;
    /** Resolved cordis `oauth` config (schema defaults applied). */
    oauthBase?: OAuthConfig;
    /** Path of the profile-private OAuth overlay + binding table. */
    oauthFile?: string;
    /** Login page title/heading. */
    loginTitle?: string;
    /** Log sink (the plugin passes ctx.logger-based printer). */
    log: (level: 'info' | 'warn' | 'error', message: string) => void;
}
export type UpdateOutcome = {
    ok: true;
    result: LanProxyUpdateResult;
} | {
    ok: false;
    message: string;
};
/** Result of one start attempt: a failed bind reports the reason instead of passing silently. */
export type StartOutcome = {
    ok: true;
} | {
    ok: false;
    message: string;
};
export declare class ProxyController {
    private readonly opts;
    private handle;
    private boundPort;
    private probeCache;
    private readonly settings;
    private readonly log;
    private options;
    /** Login-gate sessions; deliberately in-memory so a restart drops them. */
    private readonly auth;
    /** Durable audit trail (absent when no path was configured). */
    private readonly audit;
    /** Persisted transport policy (`requireTls`); absent when no path was configured. */
    private readonly security;
    /** Effective transport policy, kept in sync with the file. */
    private securitySettings;
    /** Third-party login runtime; null only when no state file was wired in. */
    private readonly oauth;
    constructor(opts: ProxyControllerOptions);
    /** Whether a persisted runtime override exists (drives the status flag). */
    private persisted;
    /**
     * Start the proxy (idempotent). Listen errors — the port is already taken by
     * another dsh-proxy instance, say — are logged loudly and reported through
     * the outcome (never thrown), so a failed forwarder can never take down the
     * web app boot while callers still learn why the listener is down.
     */
    start(): Promise<StartOutcome>;
    /**
     * Effective transport policy: the persisted override wins, then the cordis
     * config, then the compatible default (cleartext allowed).
     */
    private requireTls;
    /** Authentication mode currently in force for allowed cleartext traffic. */
    private cleartextAuth;
    /** The authentication surface for the settings page. */
    authView(currentToken?: string): LanProxyAuthView;
    /** Recent audit entries, newest first (what an operator would want on screen). */
    auditView(): LanProxyAuditView[];
    /**
     * Revoke one session, or every session except the caller's.
     * @param payload - `{ id }` from the settings page; `all` keeps the caller.
     * @param currentToken - the caller's own session token, so it is never dropped by `all`.
     * @returns how many sessions were revoked.
     */
    revokeSessions(payload: unknown, currentToken?: string): {
        revoked: number;
    };
    /**
     * Persist the transport policy. A change takes effect on the next restart, so
     * this reports whether a restart is needed instead of silently not applying it.
     * @param payload - the requested `requireTls`.
     */
    updateSecurity(payload: unknown): {
        ok: true;
        requireTls: boolean;
        cleartextAuth: CleartextAuthMode;
        restartRequired: boolean;
    } | {
        ok: false;
        message: string;
    };
    /** Stop the proxy and every upgraded socket. */
    stop(): Promise<void>;
    /** Stop and start again with the current effective options (the "restart the forwarding service" verb). */
    restart(): Promise<StartOutcome>;
    /**
     * Stop the proxy AFTER the caller's response has flushed back. The stop RPC
     * answer travels through the proxy itself when the settings page is reached
     * via the LAN URL, so closing the listener before the response is written
     * would drop it; the listener is torn down shortly afterwards instead.
     * @param delayMs - grace before the listener closes (defaults to 300ms).
     * @returns the status as it will be once stopped.
     */
    stopDeferred(delayMs?: number): LanProxyStatus;
    /**
     * Current read-only status for the settings page. `upstreamReachable`
     * reflects the most recent probe (false until the first probe runs).
     */
    status(): LanProxyStatus;
    /**
     * Status with a fresh upstream reachability probe (cached for a few
     * seconds so repeated settings-page loads do not hammer the target).
     */
    refreshStatus(): Promise<LanProxyStatus>;
    /**
     * Probe whether the target upstream service answers HTTP. Any response —
     * even an error status — counts as reachable; only connection failures and
     * timeouts turn the light red.
     */
    private probeUpstream;
    /**
     * Apply an update payload: validate, persist, then restart the forwarding
     * service with the new effective options.
     * @param payload - raw RPC payload from the settings page.
     * @returns the new status, or a user-facing rejection message.
     */
    update(payload: unknown): Promise<UpdateOutcome>;
    /** Whether the local username/password pair is complete. */
    private hasPassword;
    /**
     * D2: either configured authentication method turns the gate on. With
     * NEITHER method configured the long-standing open/warning posture stays
     * unchanged (D2′, see the spec).
     */
    private authEnabled;
    /**
     * Externally reachable proxy origin for the settings page's displayed
     * callback URIs and binding links.
     *
     * Precedence: explicit `publicOrigin` override > the domain actually used by
     * the settings page (with the proxy's real port substituted when the settings
     * page runs on the DSH app's own port) > the legacy LAN-IP guess. The live
     * login flow never uses this: it builds `redirect_uri` from `gate.origin`.
     */
    private publicOrigin;
    /** Settings view of the third-party login surface; null when not wired in. */
    oauthStatus(requestOrigin?: string): LanProxyOAuthView | null;
    /** Validate + persist an OAuth config patch (effective on the next request). */
    updateOAuth(payload: unknown, requestOrigin?: string): OAuthViewResult;
    /** Start a manual binding flow from the settings page. */
    startOAuthBinding(payload: unknown, requestOrigin?: string): {
        ok: true;
        startUrl: string;
    } | {
        ok: false;
        message: string;
    };
    /** Remove one manual binding; the account loses access immediately. */
    removeOAuthBinding(payload: unknown, requestOrigin?: string): OAuthViewResult;
}
