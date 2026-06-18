import { downloadBlob, getActiveConfig, getProcessedSvgString, svgToPng } from '../utils/iconUtils'
import { showToast } from './toast'

export function initIconActions(root: HTMLElement) {
  root.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement

    const btnCopy = target.closest('.action-copy-svg')
    const btnPng = target.closest('.action-download-png')
    const btnSvg = target.closest('.action-download-svg')

    if (!btnCopy && !btnPng && !btnSvg)
      return

    const article = target.closest('article[data-name]')
    const name = article?.getAttribute('data-name') || 'icon'
    const svg = article?.querySelector('.icon-preview svg') as SVGElement

    if (!svg)
      return

    const config = getActiveConfig()
    const svgStr = getProcessedSvgString(svg, config)

    if (btnCopy) {
      navigator.clipboard.writeText(svgStr)
        .then(() => showToast('SVG copied!'))
        .catch(() => showToast('Failed to copy SVG'))
    }

    if (btnSvg) {
      downloadBlob(svgStr, `${name}.svg`, 'image/svg+xml')
      showToast('SVG downloaded!')
    }

    if (btnPng) {
      const size = Number.parseInt(config.size, 10) || 24
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
  })
}
