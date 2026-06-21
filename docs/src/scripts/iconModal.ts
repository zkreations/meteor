import { lockScroll, unlockScroll } from '../utils/helpers'
import { cloneSvg, toPascalCase } from '../utils/iconUtils'
import { bindCopyTextOnClick, copyIconSvg, downloadIconPng, downloadIconSvg } from './clipboardActions'
import { initTabsFramework } from './tabsFramework'

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

  const copySvgBtn = modal.querySelector<HTMLButtonElement>('[data-action-copy-svg]')
  const dlSvgBtn = modal.querySelector<HTMLButtonElement>('[data-action-download-svg]')
  const dlPngBtn = modal.querySelector<HTMLButtonElement>('[data-action-download-png]')

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

  bindCopyTextOnClick(copyNameBtn, 'Name copied!')
  bindCopyTextOnClick(copyComponentBtn, 'Component name copied!')
  bindCopyTextOnClick(copyHtmlBtn, 'HTML snippet copied!')

  copySvgBtn?.addEventListener('click', () => {
    const svg = source?.querySelector<SVGElement>('svg')
    if (svg)
      copyIconSvg(svg)
  })

  dlSvgBtn?.addEventListener('click', () => {
    const svg = source?.querySelector<SVGElement>('svg')
    if (svg)
      downloadIconSvg(svg, name)
  })

  dlPngBtn?.addEventListener('click', () => {
    const svg = source?.querySelector<SVGElement>('svg')
    if (svg)
      downloadIconPng(svg, name, 120)
  })
}
