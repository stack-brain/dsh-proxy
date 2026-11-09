/** The four built-in providers; there is no arbitrary provider registry. */
export type OAuthProviderId = 'github' | 'google' | 'feishu' | 'casdoor';
/** Stable iteration order (also the login-page button order). */
export declare const OAUTH_PROVIDER_IDS: readonly ["github", "google", "feishu", "casdoor"];
/** Reserved path for every OAuth route inside the proxied origin. */
export declare const OAUTH_BASE_PATH = "/__dsh-proxy/oauth";
/** One OAuth flow's endpoints; blank fields are filled by the resolver. */
export interface OAuthEndpoints {
    authorizationEndpoint: string;
    tokenEndpoint: string;
    userInfoEndpoint: string;
    /** OIDC signature verification is out of scope, but the field is configurable. */
    jwksEndpoint?: string;
    issuer?: string;
}
/** Per-provider deployment overrides. */
export interface OAuthProviderConfig {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    scopes?: string[];
    /** Replace this provider's endpoints with an auth-center template. */
    baseUrl?: string;
    /** Fine-grained override; wins over `baseUrl` and the shared auth center. */
    endpoints?: Partial<OAuthEndpoints>;
    /** Explicit redirect URI; omit to derive it from the browser's own origin. */
    redirectUri?: string;
    /** Login-page button text; omit for the built-in label. */
    label?: string;
    /**
     * Optional `provider_hint` query value sent with the authorize request.
     * A Casdoor-style auth center needs it to select the underlying provider
     * when a channel's endpoints are replaced by a custom/self-hosted center
     * (e.g. the github channel pointed at Casdoor usually sets `github`).
     * Blank or omitted = the parameter is NOT sent, so official endpoints keep
     * their exact existing behavior.
     */
    providerHint?: string;
}
/** Top-level unified auth center (e.g. a self-hosted Casdoor). */
export interface OAuthAuthCenter {
    baseUrl?: string;
    endpoints?: Partial<OAuthEndpoints>;
}
/** The deployment-layer shape of a bootstrap binding. */
export interface OAuthBootstrapBinding {
    provider: OAuthProviderId;
    subject: string;
    email?: string;
}
/** Full OAuth configuration (cordis base merged with the persisted overlay). */
export interface OAuthConfig {
    enabled: boolean;
    providers: Record<OAuthProviderId, OAuthProviderConfig>;
    authCenter?: OAuthAuthCenter;
    stateTtlMs?: number;
    /** Written once, only while the binding table is empty (bootstrap path). */
    bootstrapBindings?: OAuthBootstrapBinding[];
    /** Optional externally reachable proxy origin, used for binding links. */
    publicOrigin?: string;
}
/** Resolved endpoints and the reasons a provider cannot be used. */
export interface ResolvedProvider {
    endpoints: OAuthEndpoints;
    issues: string[];
    source: 'official' | 'auth-center' | 'provider-override';
}
/** Login-page button copy; `icon` is an inline SVG string (no external asset). */
export interface OAuthLoginButton {
    id: OAuthProviderId;
    label: string;
    startUrl: string;
    icon: string;
}
/** Default labels shown on the login page. */
export declare const DEFAULT_PROVIDER_LABELS: Readonly<Record<OAuthProviderId, string>>;
/** Default scopes per provider. */
export declare const DEFAULT_SCOPES: Readonly<Record<OAuthProviderId, string>>;
/** Casdoor-style paths used both by the built-in provider and by overrides. */
export declare const CASDOOR_ENDPOINT_TEMPLATES: Readonly<OAuthEndpoints>;
/** Official endpoints; the Casdoor entries are templates requiring `baseUrl`. */
export declare const OFFICIAL_ENDPOINTS: Readonly<Record<OAuthProviderId, OAuthEndpoints>>;
/** A fresh default configuration; a new object each time avoids shared mutation. */
export declare function defaultOAuthConfig(): OAuthConfig;
/** Whether an unknown value names one of the built-in providers. */
export declare function isOAuthProviderId(value: unknown): value is OAuthProviderId;
/** Route helpers; all of them live under the proxy's reserved prefix. */
export declare function oauthStartPath(id: OAuthProviderId): string;
export declare function oauthBindStartPath(id: OAuthProviderId): string;
export declare function oauthCallbackPath(id: OAuthProviderId): string;
/**
 * Validate one endpoint URL. Custom endpoints must be https; plain http is
 * tolerated only for loopback development so an operator cannot silently point
 * the login flow at a cleartext third party.
 */
export declare function validateEndpointUrl(value: string, label: string): string | null;
/**
 * Resolve the effective endpoints for one provider.
 *
 * Precedence: official table (or Casdoor template) → `authCenter.baseUrl`
 * template → `authCenter.endpoints` → `provider.baseUrl` template →
 * `provider.endpoints`. Blank values always fall back to the previous level.
 */
export declare function resolveProviderEndpoints(id: OAuthProviderId, provider: OAuthProviderConfig, center?: OAuthAuthCenter): ResolvedProvider;
/** Whether a provider may appear on the login page and serve an OAuth flow. */
export declare function isProviderReady(id: OAuthProviderId, config: OAuthConfig, center?: OAuthAuthCenter): boolean;
/** Every provider that is enabled, configured and has valid endpoints. */
export declare function readyProviders(config: OAuthConfig): OAuthProviderId[];
/** Trimmed `provider_hint` actually sent to a custom authorize endpoint. */
export declare function effectiveProviderHint(provider: OAuthProviderConfig): string;
/** Scope string actually sent to the provider. */
export declare function effectiveScopes(id: OAuthProviderId, provider: OAuthProviderConfig): string;
/**
 * Extract the STABLE subject id from a userinfo payload. Emails and display
 * names are deliberately refused as identifiers: they can change and be
 * reassigned, which would turn a binding into an account takeover.
 *
 * `source` decides which claims are trusted: official endpoints keep byte-for-
 * byte their existing behaviour, while auth-center / per-provider overrides are
 * read as the center's OIDC-shaped document.
 */
export declare function extractSubject(id: OAuthProviderId, userInfo: unknown, source?: ResolvedProvider['source']): string | null;
/** Display-only profile fields; never used for authorization. */
export declare function extractProfile(userInfo: unknown): {
    email?: string;
    displayName?: string;
};
/** An inline SVG mark for the zero-JavaScript login page (no external assets). */
export declare function providerIconSvg(id: OAuthProviderId): string;
/** A short, non-secret id for a binding row. */
export declare function bindingId(): string;
