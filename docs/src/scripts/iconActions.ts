import { cloneSvg, downloadBlob, svgToPng } from '../utils/iconUtils'

export function initIconActions(root: HTMLElement) {
  const getConfig = () => {
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

  const getSvgString = (svg: SVGElement) => {
    const config = getConfig()
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

    const svgStr = getSvgString(svg)

    if (btnCopy) {
      navigator.clipboard.writeText(svgStr)
    }

    if (btnSvg) {
      downloadBlob(svgStr, `${name}.svg`, 'image/svg+xml')
    }

    if (btnPng) {
      const size = Number.parseInt(getConfig().size, 10) || 24
      const tmp = new DOMParser()
        .parseFromString(svgStr, 'image/svg+xml')
        .querySelector('svg') as SVGElement | null
      if (!tmp)
        return

      const blob = await svgToPng(tmp, size)
      if (!blob)
        return

      downloadBlob(blob, `${name}.png`, 'image/png')
    }
  })
}
