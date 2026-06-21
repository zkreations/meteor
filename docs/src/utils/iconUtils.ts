import type { AstroComponentFactory } from 'astro/runtime/server/index.js'
import { toKebabCase } from './stringCase'
import { cloneSvg } from './svg'

// Get a list of icons from a module, converting their names to kebab-case
// @param module - The module containing the icons
export function getIconList(module: Record<string, AstroComponentFactory>) {
  return Object.entries(module)
    .map(([name, IconComponent]) => ({ name: toKebabCase(name), IconComponent }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

// Get the current icon configuration from the UI controls
// @param root - The root element to query for controls (defaults to document.body)
export function getActiveConfig(root: HTMLElement = document.body) {
  const sizeInput = root.querySelector<HTMLInputElement>('[data-setting-size]')
  const size = sizeInput?.dataset.sizeActual || '24'
  const stroke = root.querySelector<HTMLInputElement>('[data-setting-stroke]')?.value || '2'
  const colorInput = root.querySelector<HTMLInputElement>('[data-setting-color]')

  return {
    size,
    stroke,
    color: colorInput?.dataset.colorActual || 'currentColor',
  }
}

// Get a processed SVG string with the current configuration applied
// @param svg - The SVG element to process
// @param config - The configuration to apply (size, stroke, color)
export function getProcessedSvgString(svg: SVGElement, config: ReturnType<typeof getActiveConfig>): string {
  const clone = cloneSvg(svg)
  clone.setAttribute('width', config.size)
  clone.setAttribute('height', config.size)
  clone.setAttribute('stroke-width', config.stroke)

  let str = clone.outerHTML

  if (config.color !== 'currentColor') {
    str = str.replace(/currentColor/g, config.color)
  }

  return str
}
