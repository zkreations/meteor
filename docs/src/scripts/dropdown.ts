const ACTIVE_CLASS = 'is-active'

export function initDropdown(
  button: HTMLElement | null,
  activeClass: string = ACTIVE_CLASS,
): void {
  if (!button)
    return

  const targetKey = button.dataset.outside
  if (!targetKey)
    return

  const root = button.closest('[data-icon-grid]')
  if (!root)
    return

  const target = root.querySelector<HTMLElement>(`[data-dropdown="${targetKey}"]`)
  if (!target)
    return

  const buttonEl = button
  const targetEl = target

  let isOpen = false

  function close(): void {
    if (!isOpen)
      return

    isOpen = false
    buttonEl.classList.remove(activeClass)
    targetEl.classList.remove(activeClass)
    buttonEl.setAttribute('aria-expanded', 'false')

    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscape)
    targetEl.removeEventListener('click', handleDropdownAction)
  }

  function handleClickOutside(event: MouseEvent): void {
    const node = event.target as Node | null
    if (!node)
      return

    if (!targetEl.contains(node) && !buttonEl.contains(node)) {
      close()
    }
  }

  function handleDropdownAction(event: MouseEvent): void {
    const node = event.target as Element | null
    if (!node)
      return

    if (node.closest('[data-dropdown-close]')) {
      close()
    }
  }

  function handleEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      close()
    }
  }

  function open(): void {
    if (isOpen)
      return

    isOpen = true
    buttonEl.classList.add(activeClass)
    targetEl.classList.add(activeClass)
    buttonEl.setAttribute('aria-expanded', 'true')

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    targetEl.addEventListener('click', handleDropdownAction)
  }

  function toggle(): void {
    isOpen ? close() : open()
  }

  buttonEl.setAttribute('aria-expanded', 'false')
  buttonEl.setAttribute('aria-haspopup', 'menu')

  buttonEl.addEventListener('click', toggle)
}
