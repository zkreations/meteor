const ACTIVE_CLASS = 'is-active'

export function initDropdown(
  button: HTMLElement | null,
  activeClass: string = ACTIVE_CLASS
): void {
  if (!button) return

  const targetKey = button.dataset.outside
  if (!targetKey) return

  const root = button.closest('[data-icon-grid]')
  if (!root) return

  const target = root.querySelector<HTMLElement>(`[data-dropdown="${targetKey}"]`)
  if (!target) return

  let isOpen = false

  const handleClickOutside = (event: MouseEvent): void => {
    const node = event.target as Node | null
    if (!node) return

    if (!target.contains(node) && !button.contains(node)) {
      close()
    }
  }

  const handleDropdownAction = (event: MouseEvent): void => {
    const node = event.target as Element | null
    if (!node) return

    if (node.closest('[data-dropdown-close]')) {
      close()
    }
  }

  const handleEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      close()
    }
  }

  const open = () => {
    if (isOpen) return

    isOpen = true
    button.classList.add(activeClass)
    target.classList.add(activeClass)
    button.setAttribute('aria-expanded', 'true')

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    target.addEventListener('click', handleDropdownAction)
  }

  const close = () => {
    if (!isOpen) return

    isOpen = false
    button.classList.remove(activeClass)
    target.classList.remove(activeClass)
    button.setAttribute('aria-expanded', 'false')

    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscape)
    target.removeEventListener('click', handleDropdownAction)
  }

  const toggle = () => {
    isOpen ? close() : open()
  }

  button.setAttribute('aria-expanded', 'false')
  button.setAttribute('aria-haspopup', 'menu')

  button.addEventListener('click', toggle)
}
