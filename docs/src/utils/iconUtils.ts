import type { AstroComponentFactory } from 'astro/runtime/server/index.js'

// Create kebab-case from PascalCase or camelCase
// @param str - The string to convert to kebab-case
export function toKebabCase(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

// Create PascalCase from kebab-case (e.g. "my-icon" → "MyIcon")
// @param str - The kebab-case string to convert
export function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

// Get a list of icons from a module, converting their names to kebab-case
// @param module - The module containing the icons
export function getIconList(module: Record<string, AstroComponentFactory>) {
  return Object.entries(module)
    .map(([name, IconComponent]) => ({ name: toKebabCase(name), IconComponent }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

// Clamp a number between a minimum and maximum value
// @param value - The number to clamp
// @param min - The minimum value
// @param max - The maximum value
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// Safely parse an integer from a string
// @param value - The string to parse
// @param fallback - The fallback value if parsing fails
export function safeParseInt(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

// Clone an SVG element, stripping presentation attributes and applying a fixed size.
// This is the single source of truth used by the modal, icon actions, and search.
// @param svg - The SVG element to clone
// @param size - Optional width/height to set on the clone (omit to keep original)
export function cloneSvg(svg: SVGElement, size?: number): SVGElement {
  const clone = svg.cloneNode(true) as SVGElement
  clone.removeAttribute('style')
  clone.removeAttribute('class')
  clone.querySelectorAll('*').forEach(el => el.removeAttribute('style'))
  if (size !== undefined) {
    clone.setAttribute('width', String(size))
    clone.setAttribute('height', String(size))
  }
  return clone
}

// Trigger a file download from an in-memory blob.
// @param content - The content to include in the blob
// @param fileName - The suggested download filename
// @param mimeType - MIME type of the blob
export function downloadBlob(content: BlobPart, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

// Render an SVG element to a PNG blob at the given size via a canvas.
// @param svg - The SVG element to rasterize
// @param size - The output canvas dimension (square)
// @returns A Promise resolving to the PNG Blob, or null on failure
export function svgToPng(svg: SVGElement, size: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    const markup = new XMLSerializer().serializeToString(svg)
    const svgUrl = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }))
    const image = new Image()

    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(svgUrl)
        resolve(null)
        return
      }
      ctx.drawImage(image, 0, 0, size, size)
      URL.revokeObjectURL(svgUrl)
      canvas.toBlob(resolve, 'image/png')
    }

    image.onerror = () => {
      URL.revokeObjectURL(svgUrl)
      resolve(null)
    }

    image.src = svgUrl
  })
}

// Create an SVG path string for a grid pattern of the specified length
// @param length - The number of grid lines in each direction
export function createGridPath(length: number): string {
  return Array.from({ length }, (_, i) => {
    const pos = (i + 1) * 10
    return `M0 ${pos}H240 M${pos} 0V240`
  }).join(' ')
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
