import { downloadBlob } from '@shared/svg/download'
import { cloneSvg, svgToPng } from '@shared/svg/svg'
import { showToast } from '@shared/ui/toast'

// Get the current icon configuration from the UI controls
// @param root - The root element to query for controls (defaults to document.body)
function getActiveConfig(root: HTMLElement = document.body) {
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

// Remove all attributes from an element
// @param element - The element to clear attributes from
function clearAttributes(element: Element): void {
  Array.from(element.attributes).forEach(attr => {
    element.removeAttribute(attr.name)
  })
}

// Get a processed SVG string with the current configuration applied
// @param svg - The SVG element to process
// @param config - The configuration to apply (size, stroke, color)
function getProcessedSvgString(
  svg: SVGElement,
  name: string,
  config: ReturnType<typeof getActiveConfig>,
): string {
  const clone = cloneSvg(svg)

  clearAttributes(clone)
  const color = config.color === 'currentColor' ? 'currentColor' : config.color

  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', config.size)
  clone.setAttribute('height', config.size)
  clone.setAttribute('viewBox', '0 0 24 24')
  clone.setAttribute('fill', 'none')
  clone.setAttribute('stroke', color)
  clone.setAttribute('stroke-width', config.stroke)
  clone.setAttribute('stroke-linecap', 'round')
  clone.setAttribute('stroke-linejoin', 'round')
  clone.setAttribute('class', `i i-${name}`)

  return clone.outerHTML
}

// Copy SVG string to clipboard
// @param svg SVG element to copy
export async function copyIconSvg(svg: SVGElement, name: string) {
  const config = getActiveConfig()
  const svgStr = getProcessedSvgString(svg, name, config)

  try {
    await navigator.clipboard.writeText(svgStr)
    showToast('SVG copied!')
  }
  catch {
    showToast('Failed to copy SVG')
  }
}

// Download SVG file
// @param svg SVG element to download
// @param name Base name for the downloaded file (without extension)
export function downloadIconSvg(svg: SVGElement, name: string) {
  const config = getActiveConfig()
  const svgStr = getProcessedSvgString(svg, name, config)
  downloadBlob(svgStr, `${name}.svg`, 'image/svg+xml')
  showToast('SVG downloaded!')
}

// Download PNG file generated from SVG
// @param svg SVG element to convert and download
// @param name Base name for the downloaded file (without extension)
// @param fallbackSize Size to use if the config size is invalid
export async function downloadIconPng(svg: SVGElement, name: string, fallbackSize: number) {
  const config = getActiveConfig()
  const svgStr = getProcessedSvgString(svg, name, config)
  const size = Number.parseInt(config.size, 10) || fallbackSize

  const tmp = new DOMParser()
    .parseFromString(svgStr, 'image/svg+xml')
    .querySelector('svg') as SVGElement | null

  if (!tmp)
    return

  const blob = await svgToPng(tmp, size)
  if (!blob)
    return

  downloadBlob(blob, `${name}.png`, 'image/png')
  showToast('PNG downloaded!')
}
