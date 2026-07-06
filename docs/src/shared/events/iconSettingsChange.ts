import type { IconCustomizeConfig } from '@shared/dom/iconCustomizeVars'

export const ICON_SETTINGS_CHANGE = 'icon-settings-change' as const

export type IconSettingsChangeDetail = IconCustomizeConfig

declare global {
  interface DocumentEventMap {
    [ICON_SETTINGS_CHANGE]: CustomEvent<IconSettingsChangeDetail>
  }
}
