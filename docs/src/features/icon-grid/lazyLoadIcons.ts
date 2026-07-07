// This script implements lazy loading for icons in the icon grid.
// @param root - The root element containing the icon cards.
export function initLazyLoadIcons(root: HTMLElement) {
  const cards = root.querySelectorAll<HTMLElement>('[data-open-icon-modal][data-name]')

  if (!('IntersectionObserver' in window)) {
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = entry.target as HTMLElement
        const preview = card.querySelector('.icon-preview svg') as SVGElement

        if (!preview)
          return

        if (entry.isIntersecting) {
          preview.classList.remove('!hidden')
        }
        else {
          preview.classList.add('!hidden')
        }
      })
    },
    {
      root: null,
      rootMargin: '300px',
      threshold: 0,
    },
  )

  cards.forEach((card) => {
    observer.observe(card)
  })

  return () => observer.disconnect()
}
