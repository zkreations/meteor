import { getIconSvgFromContainer } from '../utils/iconRegistry'
import { copyIconSvg, downloadIconPng, downloadIconSvg } from './clipboardActions'

// Initialize icon action buttons (copy/download) in icon cards
// @param root Root element to attach listeners to (e.g. document.body)
export function initIconActions(root: HTMLElement) {
  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement

    const btnCopy = target.closest('[data-action-copy-svg]')
    const btnPng = target.closest('[data-action-download-png]')
    const btnSvg = target.closest('[data-action-download-svg]')

    if (!btnCopy && !btnPng && !btnSvg)
      return

    const container = target.closest<HTMLElement>('[data-name]')
    const name = container?.getAttribute('data-name') || 'icon'
    const svg = getIconSvgFromContainer(container)

    if (!svg)
      return

    if (btnCopy)
      copyIconSvg(svg)

    if (btnSvg)
      downloadIconSvg(svg, name)

    if (btnPng)
      downloadIconPng(svg, name, 24)
  })
}
