/**
 * The small self-contained page shown INSIDE the OAuth popup after the
 * provider redirects back to the proxy.
 *
 * The opener page must never navigate: the login page (or the settings page)
 * stays where it is while the popup does the third-party confirmation. This
 * page reports the result over a SAME-ORIGIN `BroadcastChannel`, with a
 * `postMessage` fallback for browsers that still keep an opener reference,
 * and then closes itself. A successful login has already had its session
 * cookie set on this origin by the runtime's response headers.
 *
 * No external asset, no dependency on the app bundle: the popup visitor is
 * unauthenticated until the cookie is set, exactly like the login page.
 */
/** All outcomes the popup can report. */
export type OAuthFinishStatus = 'ok' | 'bound' | 'unbound' | 'denied' | 'invalid' | 'failed' | 'rejected' | 'unavailable';
/** Options for {@link renderOAuthFinishPage}. */
export interface OAuthFinishOptions {
    status: OAuthFinishStatus;
    intent: 'login' | 'bind';
    /** Overrides the default detail copy (already localized by the caller). */
    message?: string;
}
/**
 * Render the popup result document.
 * @param options - outcome, intent and optional detail copy.
 * @returns a complete HTML document as a string.
 */
export declare function renderOAuthFinishPage(options: OAuthFinishOptions): string;
