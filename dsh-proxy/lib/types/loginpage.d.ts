/**
 * The proxy's own login page.
 *
 * Deliberately a server-rendered, self-contained HTML document with no
 * dependency on DSH's asset pipeline: the visitor is unauthenticated, so the app
 * bundle is exactly what must NOT be reachable yet. One document, one inline
 * stylesheet, one form, and — only when third-party channels exist — one small
 * inline script. A password-only deployment stays 100% script-free.
 *
 * Security properties, all enforced elsewhere but relied on here:
 * - the form posts to the proxy's own path with `autocomplete` off for the
 *   username and `current-password` for the password, so a password manager can
 *   fill it without the page ever reading the value;
 * - the response is marked `no-store` and `no-referrer` by the caller, so a
 *   credential-bearing POST is not cached or leaked through a Referer;
 * - the page states the transport it is on: served over cleartext HTTP (no TLS
 *   in front) the caller refuses to accept the submission at all, because a
 *   password posted in the clear is not worth collecting.
 *
 * Third-party login buttons are `<a>` links with INLINE SVG icons and no
 * external asset; only the channels enabled in the config are rendered. With
 * no password configured the local form is omitted entirely.
 *
 * The STATIC popup script (only when third-party channels exist) opens the
 * authorization flow in a script-owned popup, reports the outcome over a
 * same-origin BroadcastChannel, and lets the visitor cancel. Both cancellation
 * and a three-minute timeout close the popup; on success the opener navigates
 * to `/` (reloading the login path would just re-serve the form). It contains
 * no operator input, no network call and no reference to the app bundle.
 * Without JavaScript the link's `target="_blank"` still opens a separate
 * window, so the current page is never taken over.
 */
import type { OAuthLoginButton } from './oauth/providers.ts';
/** Everything the page needs to render; no state is read from the request. */
export interface LoginPageOptions {
    /** Overrides the `<title>`/heading when the deployment names its proxy. */
    title?: string;
    /** Human-readable error shown above the form (already localized by the caller). */
    error?: string;
    /** Path the form posts to (the login endpoint). */
    action: string;
    /** Whether the visitor arrived over TLS (a trusted proxy reported https). */
    secure: boolean;
    /** Enabled third-party channels; omitted/empty keeps the original form only. */
    providers?: OAuthLoginButton[];
    /** False hides the local password form when only third-party login is on. */
    passwordForm?: boolean;
}
/**
 * Render the login document.
 * @param options - title, error, form target, and the enabled OAuth channels.
 * @returns a complete HTML document as a string.
 */
export declare function renderLoginPage(options: LoginPageOptions): string;
/** Localized failure copy for the login page, keyed by the auth core's reason. */
export declare function loginFailureMessage(reason: 'invalid' | 'locked' | 'disabled', retryAfterMs: number): string;
