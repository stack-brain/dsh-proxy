/**
 * Inline SVG channel marks for the settings page. Like the login page icons
 * these are self-contained: no external image, font or network request, so the
 * settings UI works even when the auth center itself is unreachable.
 */
import type { ReactNode } from 'react';
import type { LanProxyOAuthProviderId } from '../contract.ts';
/** One channel mark. */
export declare function OAuthIcon(props: {
    id: LanProxyOAuthProviderId;
}): ReactNode;
