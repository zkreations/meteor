import { lockScroll, unlockScroll } from '../utils/helpers'
import { cloneSvg, downloadBlob, getActiveConfig, getProcessedSvgString, svgToPng, toPascalCase } from '../utils/iconUtils'
import { initTabsFramework } from './tabsFramework'
import { showToast } from './toast'

export function initIconModal(root: HTMLElement) {
  let isOpen = false
  const modal = root.querySelector<HTMLElement>('[data-icon-modal]')
  if (!modal)
    return

  const modalDialog = modal.querySelector<HTMLElement>('.modal-dialog')
  if (!modalDialog)
    return

  const tabsWrapper = modal.querySelector<HTMLElement>('[data-modal-tabs-wrapper]')
  const tabsController = tabsWrapper ? initTabsFramework(tabsWrapper) : null

  const preview = modal.querySelector<HTMLElement>('[data-modal-icon-preview]')
  const source = modal.querySelector<HTMLElement>('[data-modal-source-svg]')
  const viewFullInfoLink = modal.querySelector<HTMLAnchorElement>('[data-modal-view-full-info]')
  const copyNameBtn = modal.querySelector<HTMLButtonElement>('[data-copy-name]')
  const copyComponentBtn = modal.querySelector<HTMLButtonElement>('[data-copy-component-name]')
  const copyHtmlBtn = modal.querySelector<HTMLButtonElement>('[data-copy-html]')
  const copySvgBtn = modal.querySelector<HTMLButtonElement>('[data-modal-copy-svg]')
  const dlSvgBtn = modal.querySelector<HTMLButtonElement>('[data-modal-download-svg]')
  const dlPngBtn = modal.querySelector<HTMLButtonElement>('[data-modal-download-png]')

  let name = ''

  const open = (card: HTMLElement) => {
    if (isOpen)
      return

    isOpen = true

    requestAnimationFrame(() => {
      copyNameBtn?.focus()
    })

    const cardName = card.dataset.name || ''
    const svg = card.querySelector<SVGElement>('.icon-preview svg')
    if (!cardName || !svg)
      return

    name = cardName
    if (copyNameBtn)
      copyNameBtn.textContent = name
    if (copyComponentBtn)
      copyComponentBtn.textContent = toPascalCase(name)
    if (copyHtmlBtn)
      copyHtmlBtn.textContent = `<i data-i="${name}"></i>`
    if (viewFullInfoLink)
      viewFullInfoLink.href = `/icons/${name}`

    preview?.replaceChildren(cloneSvg(svg, 24))
    source?.replaceChildren(cloneSvg(svg, 24))

    if (tabsController) {
      tabsController.updateIconName(name)
    }

    lockScroll()
    modal.setAttribute('aria-hidden', 'false')
    modal.classList.add('modal-open')
    modalDialog.classList.add('modal-dialog-open')
    document.body.classList.add('overflow-hidden')
  }

  const close = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    modal.setAttribute('aria-hidden', 'true')
    modal.classList.remove('modal-open')
    modalDialog.classList.remove('modal-dialog-open')
    unlockScroll(modal)
      .then(() => {
        document.body.classList.remove('overflow-hidden')
        isOpen = false
      })
  }

  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement
    const card = t.closest<HTMLElement>('article[data-open-icon-modal][data-name]')
    if (card && !t.closest('button') && !t.closest('a'))
      open(card)
  })

  root.addEventListener('keydown', (e) => {
    if (!(e.target instanceof HTMLElement))
      return
    const card = e.target.closest<HTMLElement>('article[data-open-icon-modal][data-name]')
    if (card && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      open(card)
    }
  })

  modal.querySelector('[data-modal-backdrop]')?.addEventListener('click', close)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape')
      close()
  })

  const bindCopy = (
    button: HTMLButtonElement | null,
    getText: () => string,
    message = 'Copied to clipboard!',
  ) => {
    button?.addEventListener('click', () => {
      navigator.clipboard.writeText(getText())
        .then(() => showToast(message))
        .catch(() => showToast('Failed to copy to clipboard.'))
    })
  }

  bindCopy(copyNameBtn, () => name, 'Name copied!')
  bindCopy(copyComponentBtn, () => toPascalCase(name), 'Component name copied!')
  bindCopy(copyHtmlBtn, () => `<i data-i="${name}"></i>`, 'HTML snippet copied!')

  copySvgBtn?.addEventListener('click', () => {
    const svg = source?.querySelector<SVGElement>('svg')
    if (svg) {
      const config = getActiveConfig()
      const svgStr = getProcessedSvgString(svg, config)

      navigator.clipboard.writeText(svgStr)
        .then(() => showToast('SVG copied!'))
        .catch(() => showToast('Failed to copy SVG'))
    }
  })

  dlSvgBtn?.addEventListener('click', () => {
    const svg = source?.querySelector<SVGElement>('svg')
    if (svg) {
      const config = getActiveConfig()
      const svgStr = getProcessedSvgString(svg, config)
      downloadBlob(svgStr, `${name}.svg`, 'image/svg+xml')
      showToast('SVG downloaded!')
    }
  })

  dlPngBtn?.addEventListener('click', async () => {
    const svg = source?.querySelector<SVGElement>('svg')
    if (!svg)
      return

    const config = getActiveConfig()
    const svgStr = getProcessedSvgString(svg, config)
    const size = Number.parseInt(config.size, 10) || 120

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
  })
}
