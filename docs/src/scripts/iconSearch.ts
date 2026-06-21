import { debounce } from '../utils/debounce'
import { buildCounterLabel, isIconMatch } from '../utils/iconGrid'
import { getIconSvgByName } from '../utils/iconRegistry'
import { cloneSvg } from '../utils/svg'
import { ICON_CATEGORY_CHANGE } from './iconCategoryChange'

interface SearchAPIResponse {
  icons: { name: string, searchIndex: string }[]
  categories: { name: string, icon: string }[]
}

async function fetchSearchIndex(): Promise<SearchAPIResponse | null> {
  try {
    const response = await fetch('/api/icons-search.json')
    return response.ok ? await response.json() : null
  }
  catch (error) {
    console.error('Failed to load icons search index', error)
    return null
  }
}

export function initIconSearch(root: HTMLElement) {
  const searchInput = root.querySelector<HTMLInputElement>('[data-icon-search]')
  const counter = root.querySelector('[data-icon-counter]')
  const emptyState = root.querySelector('[data-icon-empty]')
  const categoryLabel = root.querySelector('[data-category-label]')
  const categoryIconSlot = root.querySelector<HTMLElement>('[data-category-icon]')
  const sections = [...root.querySelectorAll<HTMLElement>('section[data-section]')]
  const categoryButtons = [...root.querySelectorAll<HTMLElement>('[data-category]')]

  const defaultCategoryIcon = categoryIconSlot?.querySelector('svg')?.cloneNode(true) as SVGElement | undefined
  const searchIndexByName = new Map<string, string>()
  const categoryIconMap = new Map<string, string>()

  let activeCategory = 'all'

  const getCategorySvg = (name?: string) =>
    name ? getIconSvgByName(name, root) : null

  const getActiveIconSvg = () => getCategorySvg(categoryIconMap.get(activeCategory))

  const updateCategoryIcon = () => {
    if (!categoryIconSlot)
      return
    const source = getActiveIconSvg() || defaultCategoryIcon
    categoryIconSlot.replaceChildren(source ? cloneSvg(source) : '')
  }

  const updateActiveCategoryUI = (selectedButton: HTMLElement) => {
    categoryButtons.forEach((btn) => {
      const isSelected = btn === selectedButton
      btn.classList.toggle('dropdown-item-active', isSelected)
      btn.setAttribute('aria-current', String(isSelected))
      btn.querySelector('[aria-hidden="true"]')?.classList.toggle('opacity-0', !isSelected)
    })
  }

  const updateVisibleIcons = () => {
    const query = searchInput?.value ?? ''
    let totalVisible = 0

    sections.forEach((section) => {
      const sectionCategory = section.dataset.section ?? ''
      const isCategoryMatch = activeCategory === 'all' || sectionCategory === activeCategory

      if (!isCategoryMatch) {
        section.classList.add('hidden')
        return
      }

      let visibleCount = 0
      section.querySelectorAll<HTMLElement>('[data-name]').forEach((card) => {
        const name = card.dataset.name ?? ''
        const visible = isIconMatch(searchIndexByName.get(name) ?? name, query)

        card.classList.toggle('hidden!', !visible)
        if (visible)
          visibleCount++
      })

      const sectionCount = section.querySelector('[data-section-count]')
      if (sectionCount)
        sectionCount.textContent = `[${visibleCount}]`

      section.classList.toggle('hidden', visibleCount === 0)
      totalVisible += visibleCount
    })

    if (counter)
      counter.textContent = buildCounterLabel(totalVisible)
    emptyState?.classList.toggle('hidden', totalVisible !== 0)
  }

  const handleCategoryChange = (button: HTMLElement) => {
    activeCategory = button.dataset.category ?? 'all'

    updateActiveCategoryUI(button)
    if (categoryLabel) {
      categoryLabel.textContent = button.querySelector('span.truncate')?.textContent || 'Categories'
    }

    updateCategoryIcon()
    updateVisibleIcons()

    document.dispatchEvent(new CustomEvent(ICON_CATEGORY_CHANGE, {
      detail: { svg: getActiveIconSvg() },
    }))
  }

  root.addEventListener('click', (e) => {
    const button = (e.target as HTMLElement).closest<HTMLElement>('[data-category]')
    if (button)
      handleCategoryChange(button)
  })

  searchInput?.addEventListener('input', debounce(updateVisibleIcons, 300))

  updateVisibleIcons()

  void fetchSearchIndex().then((payload) => {
    if (!payload)
      return
    payload.icons.forEach(({ name, searchIndex }) => searchIndexByName.set(name, searchIndex))
    payload.categories.forEach(({ name, icon }) => categoryIconMap.set(name, icon))

    updateCategoryIcon()
    updateVisibleIcons()
  })
}
