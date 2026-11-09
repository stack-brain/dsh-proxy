/**
 * Inline SVG channel marks for the settings page. Like the login page icons
 * these are self-contained: no external image, font or network request, so the
 * settings UI works even when the auth center itself is unreachable.
 */
import type { ReactNode } from 'react'
import type { LanProxyOAuthProviderId } from '../contract.ts'

/** Marker colors matching the host-side login-page icons. */
const COLORS: Record<LanProxyOAuthProviderId, string> = {
  github: '#6e7681',
  google: '#4285f4',
  feishu: '#3370ff',
  casdoor: '#7c6bf3',
}

/** Short glyph per channel. */
const LETTERS: Record<LanProxyOAuthProviderId, string> = {
  github: 'G',
  google: 'G',
  feishu: '飞',
  casdoor: 'C',
}

/** One channel mark. */
export function OAuthIcon(props: { id: LanProxyOAuthProviderId }): ReactNode {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill={COLORS[props.id]} />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="12"
        fontFamily="sans-serif"
        fontWeight="600"
        fill="#ffffff"
      >
        {LETTERS[props.id]}
      </text>
    </svg>
  )
}
