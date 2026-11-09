import type { ReactNode } from 'react';
import type { SettingsSectionProps } from './SettingsSection.tsx';
import type { LanProxyCall } from './transport.ts';
/** The `t` seat, reusing the exact type the section receives. */
type Translate = SettingsSectionProps['t'];
/** Props injected by the settings section. */
export interface OAuthCardProps {
    call: LanProxyCall;
    t: Translate;
}
/** Render the third-party login card. */
export declare function OAuthCard({ call, t }: OAuthCardProps): ReactNode;
export {};
