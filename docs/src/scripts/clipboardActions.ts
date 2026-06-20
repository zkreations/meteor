import { downloadBlob, getActiveConfig, getProcessedSvgString, svgToPng } from '../utils/iconUtils'
import { showToast } from './toast'

// Copy SVG string to clipboard
// @param svg SVG element to copy
export async function copyIconSvg(svg: SVGElement) {
  const config = getActiveConfig()
  const svgStr = getProcessedSvgString(svg, config)

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
  const svgStr = getProcessedSvgString(svg, config)
  downloadBlob(svgStr, `${name}.svg`, 'image/svg+xml')
  showToast('SVG downloaded!')
}

// Download PNG file generated from SVG
// @param svg SVG element to convert and download
// @param name Base name for the downloaded file (without extension)
// @param fallbackSize Size to use if the config size is invalid
export async function downloadIconPng(svg: SVGElement, name: string, fallbackSize: number) {
  const config = getActiveConfig()
  const svgStr = getProcessedSvgString(svg, config)
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

// Copy the text content of an element to the clipboard
// @param el Element whose text content to copy
// @param message Optional message to show on successful copy
export async function copyElementText(el: HTMLElement, message = 'Copied to clipboard!') {
  const text = el.textContent?.trim() ?? ''
  if (!text)
    return

  try {
    await navigator.clipboard.writeText(text)
    showToast(message)
  }
  catch {
    showToast('Failed to copy to clipboard.')
  }
}

// Bind a click event to a button that copies the text content of the button to the clipboard
// @param button Button element to bind the click event to
// @param message Optional message to show on successful copy
export function bindCopyTextOnClick(button: HTMLButtonElement | null, message?: string) {
  if (!button)
    return

  button.addEventListener('click', () => copyElementText(button, message))
}
