import { debounce } from '../utils/debounce'
import { buildCounterLabel, isIconMatch } from '../utils/iconGrid'
import { cloneSvg } from '../utils/iconUtils'
import { ICON_CATEGORY_CHANGE } from './iconCategoryChange'

interface SearchAPIResponse {
  icons: { name: string, searchIndex: string }[]
  categories: { name: string, icon: string }[]
}

export function initIconSearch(root: HTMLElement) {
  const searchInput = root.querySelector<HTMLInputElement>('[data-icon-search]')
  const counter = root.querySelector('[data-icon-counter]')
  const emptyState = root.querySelector('[data-icon-empty]')
  const categoryButtons = [...root.querySelectorAll<HTMLElement>('[data-category]')]
  const categoryLabel = root.querySelector('[data-category-label]')
  const categoryIconSlot = root.querySelector<HTMLElement>('[data-category-icon]')
  const sections = [...root.querySelectorAll<HTMLElement>('section[data-section]')]

  const defaultCategoryIcon = categoryIconSlot?.querySelector('svg')?.cloneNode(true) as
    | SVGElement
    | undefined

  const searchIndexByName = new Map<string, string>()
  const categoryIconMap = new Map<string, string>()

  let activeCategory = 'all'

  const getCategoryIconName = () =>
    activeCategory === 'all'
      ? undefined
      : categoryIconMap.get(activeCategory)

  const getCategorySvg = (iconName?: string) => {
    if (!iconName)
      return null

    return root.querySelector<SVGElement>(
      `[data-name="${iconName}"] .icon-preview svg`,
    )
  }

  const updateCategoryIcon = () => {
    if (!categoryIconSlot)
      return

    const sourceSvg = getCategorySvg(getCategoryIconName())

    if (sourceSvg) {
      categoryIconSlot.replaceChildren(cloneSvg(sourceSvg))
      return
    }

    if (defaultCategoryIcon) {
      categoryIconSlot.replaceChildren(cloneSvg(defaultCategoryIcon))
    }
  }

  const updateActiveCategoryUI = (selectedButton: HTMLElement) => {
    categoryButtons.forEach((button) => {
      const selected = button === selectedButton

      button.classList.toggle('dropdown-item-active', selected)
      button.setAttribute('aria-current', String(selected))

      button
        .querySelector<HTMLElement>('span[aria-hidden="true"]')
        ?.classList
        .toggle('opacity-0', !selected)
    })
  }

  const updateVisibleIcons = () => {
    const query = searchInput?.value ?? ''
    let totalVisible = 0

    sections.forEach((section) => {
      const category = section.dataset.section ?? ''
      const sectionCount = section.querySelector<HTMLElement>('[data-section-count]')

      if (activeCategory !== 'all' && category !== activeCategory) {
        section.classList.add('hidden')
        return
      }

      let visibleCount = 0

      section.querySelectorAll<HTMLElement>('[data-name]').forEach((card) => {
        const name = card.dataset.name ?? ''
        const searchIndex = searchIndexByName.get(name) ?? name
        const visible = isIconMatch(searchIndex, query)

        card.classList.toggle('hidden!', !visible)

        if (visible)
          visibleCount++
      })

      sectionCount && (sectionCount.textContent = `[${visibleCount}]`)
      section.classList.toggle('hidden', visibleCount === 0)

      totalVisible += visibleCount
    })

    counter && (counter.textContent = buildCounterLabel(totalVisible))
    emptyState?.classList.toggle('hidden', totalVisible !== 0)
  }

  const loadSearchIndex = async () => {
    try {
      const response = await fetch('/api/icons-search.json')

      if (!response.ok)
        return

      const payload = await response.json() as SearchAPIResponse

      payload.icons.forEach(({ name, searchIndex }) => {
        searchIndexByName.set(name, searchIndex)
      })

      payload.categories.forEach(({ name, icon }) => {
        categoryIconMap.set(name, icon)
      })

      updateCategoryIcon()
      updateVisibleIcons()
    }
    catch (error) {
      console.error('Failed to load icons search index', error)
    }
  }

  const handleCategoryChange = (button: HTMLElement) => {
    activeCategory = button.dataset.category ?? 'all'

    updateActiveCategoryUI(button)

    categoryLabel!.textContent
      = button.querySelector('span.truncate')?.textContent || 'Categories'

    updateCategoryIcon()
    updateVisibleIcons()

    document.dispatchEvent(new CustomEvent(ICON_CATEGORY_CHANGE, {
      detail: {
        svg: getCategorySvg(getCategoryIconName()),
      },
    }))
  }

  categoryButtons.forEach(button =>
    button.addEventListener('click', () => handleCategoryChange(button)),
  )

  searchInput?.addEventListener(
    'input',
    debounce(updateVisibleIcons, 300),
  )

  updateVisibleIcons()
  void loadSearchIndex()
}
