import type { IconCustomizeConfig } from '../utils/iconCustomizeStyle'

export const ICON_SETTINGS_CHANGE = 'icon-settings-change' as const

export type IconSettingsChangeDetail = IconCustomizeConfig

declare global {
  interface DocumentEventMap {
    [ICON_SETTINGS_CHANGE]: CustomEvent<IconSettingsChangeDetail>
  }
}
