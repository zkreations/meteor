import { copyIconSvg, downloadIconPng, downloadIconSvg } from './clipboardActions'

export interface IconActionTarget {
  svg: SVGElement | null
  name: string
}

export type IconActionTargetResolver = (trigger: HTMLElement) => IconActionTarget

export interface IconActionButtonsOptions {
  pngFallbackSize?: number
}

// Binds click event listeners to icon action buttons (copy SVG, download PNG/SVG) within a root element.
// @param root - The root element containing the action buttons
// @param resolveTarget - A function that resolves the target SVG element and its name based on the clicked button
// @param options - Optional configuration for the action buttons (e.g., PNG fallback size)
export function bindIconActionButtons(
  root: HTMLElement,
  resolveTarget: IconActionTargetResolver,
  options: IconActionButtonsOptions = {},
): void {
  const { pngFallbackSize = 24 } = options

  root.addEventListener('click', (e) => {
    const trigger = e.target as HTMLElement

    const isCopy = trigger.closest('[data-action-copy-svg]')
    const isDownloadPng = trigger.closest('[data-action-download-png]')
    const isDownloadSvg = trigger.closest('[data-action-download-svg]')

    if (!isCopy && !isDownloadPng && !isDownloadSvg)
      return

    const { svg, name } = resolveTarget(trigger)
    if (!svg)
      return

    if (isCopy)
      copyIconSvg(svg)

    if (isDownloadSvg)
      downloadIconSvg(svg, name)

    if (isDownloadPng)
      downloadIconPng(svg, name, pngFallbackSize)
  })
}
