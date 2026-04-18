import { buildCounterLabel, isIconMatch } from '../utils/iconGrid'

const searchInput = document.getElementById('icon-search') as HTMLInputElement | null
const categorySelect = document.getElementById('icon-category') as HTMLSelectElement | null
const counter = document.getElementById('icon-counter')
const emptyState = document.getElementById('icon-empty')
const cards = Array.from(document.querySelectorAll<HTMLElement>('#icon-grid [data-name]'))

const updateVisibleIcons = (): void => {
  const query = (searchInput?.value ?? '').trim().toLowerCase()
  const category = categorySelect?.value ?? 'all'

  const visibleCount = cards.reduce((count, card) => {
    const visible = isIconMatch({
      name: card.dataset.name,
      category: card.dataset.category,
    }, query, category)
    card.classList.toggle('hidden', !visible)
    return visible ? count + 1 : count
  }, 0)

  if (counter) counter.textContent = buildCounterLabel(visibleCount)
  emptyState?.classList.toggle('hidden', visibleCount !== 0)
}

searchInput?.addEventListener('input', updateVisibleIcons)
categorySelect?.addEventListener('change', updateVisibleIcons)
updateVisibleIcons()