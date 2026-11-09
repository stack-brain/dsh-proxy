/**
 * Resolve the origin used for DISPLAYED callback URIs and binding links.
 *
 * The actual OAuth `redirect_uri` never comes from here: `OAuthRuntime.handle()`
 * uses `gate.origin`, i.e. the Host header + real scheme of the browser request
 * that hit `/__dsh-proxy/oauth/*`. That is already "the current page's domain
 * and port", with no hardcoded host.
 *
 * The settings page, however, runs on the DSH web app (often a different port
 * than the proxy listener) and needs an absolute URL to display and to open the
 * binding popup. Instead of guessing a LAN IP, the host derives a hint from the
 * RPC request itself, which arrives from that very page. This is server-side
 * data, so an untrusted client cannot redirect a binding ticket to an arbitrary
 * origin.
 *
 * The operator's `publicOrigin` override still wins for unusual deployments.
 */
/** Where the resolved origin came from. */
export type OAuthOriginSource = 'configured' | 'request' | 'inferred';
export interface OAuthOriginInput {
    /** Operator override from the deployment YAML / settings page. */
    configured?: string;
    /** Origin of the settings RPC request (derived server-side). */
    requestOrigin?: string;
    /** Port the proxy actually listens on. */
    listenPort: number;
    /** Legacy fallback, e.g. the first LAN IPv4 address on `listenPort`. */
    inferred: string;
}
/**
 * Build the proxy origin from an RPC request origin.
 *
 * - No explicit port (80/443): a TLS/HTTP reverse-proxy front door that already
 *   fronts `/__dsh-proxy/oauth/*`; keep it verbatim.
 * - Explicit port equal to the proxy listener: keep it verbatim.
 * - Explicit port different from the listener (the common case: settings on the
 *   DSH app at :3080, proxy at :3081): keep scheme + hostname, swap in the
 *   proxy's REAL port. This is what makes the callback follow the current page
 *   instead of a guessed LAN IP.
 */
export declare function originFromRequest(requestOrigin: string | undefined, listenPort: number): string | undefined;
/**
 * Derive the settings page's origin from the RPC request, SERVER-SIDE.
 *
 * `Origin` / `Referer` are the browser's own view of the current page, so they
 * win over `request.url` (which an API gateway may rewrite to an internal
 * address). `Host` is the last resort. A bare `http(s)` origin is always
 * returned, so downstream validation in {@link originFromRequest} applies.
 */
export declare function requestOriginOf(input: {
    url?: string;
    originHeader?: string | null;
    referer?: string | null;
    host?: string | null;
}): string | undefined;
/** Select the origin for displayed callback URIs and binding links. */
export declare function resolveOAuthOrigin(input: OAuthOriginInput): {
    origin: string;
    source: OAuthOriginSource;
};
