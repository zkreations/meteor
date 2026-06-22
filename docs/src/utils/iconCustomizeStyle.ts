import { clamp, safeParseInt } from './number'

export interface IconCustomizeConfig {
  color: string
  stroke: string
  size: string
}

// Apply the icon customization CSS variables (--icon-customize-*) to an element,
// @param target - element to set the CSS variables on
// @param config - the active color/stroke/size configuration
export function applyIconCustomizeVars(target: HTMLElement, config: IconCustomizeConfig): void {
  const visualSize = clamp(safeParseInt(config.size, 24), 16, 64)

  target.style.setProperty('--icon-customize-stroke-width', config.stroke)
  target.style.setProperty('--icon-customize-size', `${visualSize}px`)

  if (config.color === 'currentColor') {
    target.style.removeProperty('--icon-customize-color')
  }
  else {
    target.style.setProperty('--icon-customize-color', config.color)
  }
}
