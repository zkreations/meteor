const searchInput = document.getElementById('icon-search') as HTMLInputElement | null
const categorySelect = document.getElementById('icon-category') as HTMLSelectElement | null
const counter = document.getElementById('icon-counter')
const emptyState = document.getElementById('icon-empty')
const cards = Array.from(document.querySelectorAll<HTMLElement>('#icon-grid [data-name]'))

const isMatch = (card: HTMLElement, query: string, category: string): boolean => {
  const name = card.dataset.name ?? ''
  const cardCategory = card.dataset.category ?? ''
  return name.includes(query) && (category === 'all' || cardCategory === category)
}

const updateVisibleIcons = (): void => {
  const query = (searchInput?.value ?? '').trim().toLowerCase()
  const category = categorySelect?.value ?? 'all'

  const visibleCount = cards.reduce((count, card) => {
    const visible = isMatch(card, query, category)
    card.classList.toggle('hidden', !visible)
    return visible ? count + 1 : count
  }, 0)

  if (counter) counter.textContent = `Showing ${visibleCount} icon${visibleCount === 1 ? '' : 's'}`
  emptyState?.classList.toggle('hidden', visibleCount !== 0)
}

searchInput?.addEventListener('input', updateVisibleIcons)
categorySelect?.addEventListener('change', updateVisibleIcons)
updateVisibleIcons()