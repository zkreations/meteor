import { buildCounterLabel, isIconMatch } from '../utils/iconGrid';
import { debounce } from '../utils/debounce';

type SearchAPIResponse = {
  icons: { name: string; searchIndex: string }[];
  categories: { name: string; icon: string }[];
};

export const initIconSearch = (root: HTMLElement) => {
  const searchInput = root.querySelector<HTMLInputElement>('[data-icon-search]');
  const counter = root.querySelector('[data-icon-counter]');
  const emptyState = root.querySelector('[data-icon-empty]');
  const categoryButtons = root.querySelectorAll<HTMLElement>('[data-category]');
  const categoryLabel = root.querySelector('[data-category-label]');
  const categoryIconSlot = root.querySelector<HTMLElement>('[data-category-icon]');
  const svgSkeleton = document.querySelector('svg-skeleton');
  const defaultCategoryIcon = categoryIconSlot?.querySelector('svg')?.cloneNode(true) as
    | SVGElement
    | undefined;

  const updateActiveCategoryUI = (selectedButton: HTMLElement) => {
    categoryButtons.forEach(button => {
      const isSelected = button === selectedButton;
      button.classList.toggle('dropdown-item-active', isSelected);
      button.setAttribute('aria-current', isSelected ? 'true' : 'false');

      const marker = button.querySelector<HTMLElement>('span[aria-hidden="true"]');
      if (marker) {
        marker.classList.toggle('opacity-0', !isSelected);
      }
    });
  };

  const searchIndexByName = new Map<string, string>();
  const categoryIconMap = new Map<string, string>();

  const sanitizeSvgClone = (svg: SVGElement) => {
    svg.removeAttribute('style');
    svg.removeAttribute('class');
    svg.querySelectorAll('*').forEach(el => el.removeAttribute('style'));
    return svg;
  };

  const updateCategoryButtonIcon = (iconName?: string) => {
    if (!categoryIconSlot) return;

    if (!iconName) {
      if (defaultCategoryIcon) {
        const clone = defaultCategoryIcon.cloneNode(true) as SVGElement;
        sanitizeSvgClone(clone);
        categoryIconSlot.replaceChildren(clone);
      }
      return;
    }

    const sourceSvg = root.querySelector<SVGElement>(`[data-name="${iconName}"] .icon-preview svg`);
    if (!sourceSvg) return;

    const buttonSvg = sourceSvg.cloneNode(true) as SVGElement;
    sanitizeSvgClone(buttonSvg);

    categoryIconSlot.replaceChildren(buttonSvg);
  };

  let activeCategory = 'all';

  const updateVisibleIcons = () => {
    const query = searchInput?.value ?? '';
    let globalVisibleCount = 0;

    const sections = root.querySelectorAll<HTMLElement>('section[data-section]');

    sections.forEach(section => {
      const sectionCategory = section.dataset.section ?? '';
      const sectionCount = section.querySelector<HTMLElement>('[data-section-count]');

      if (activeCategory !== 'all' && sectionCategory !== activeCategory) {
        section.classList.add('hidden');
        return;
      }

      const cards = section.querySelectorAll<HTMLElement>('[data-name]');
      let visibleInSection = 0;

      cards.forEach(card => {
        const name = card.dataset.name ?? '';
        const searchIndex = searchIndexByName.get(name) ?? name;

        const visible = isIconMatch(searchIndex, query);
        card.classList.toggle('hidden!', !visible);

        if (visible) visibleInSection++;
      });

      if (sectionCount) {
        sectionCount.textContent = `[${visibleInSection}]`;
      }

      section.classList.toggle('hidden', visibleInSection === 0);
      globalVisibleCount += visibleInSection;
    });

    if (counter) counter.textContent = buildCounterLabel(globalVisibleCount);
    emptyState?.classList.toggle('hidden', globalVisibleCount !== 0);
  };

  const loadSearchIndex = async () => {
    try {
      const res = await fetch('/api/icons-search.json');
      if (!res.ok) return;

      const payload = (await res.json()) as SearchAPIResponse;

      payload.icons.forEach(i => searchIndexByName.set(i.name, i.searchIndex));
      payload.categories.forEach(c => categoryIconMap.set(c.name, c.icon));

      if (activeCategory === 'all') {
        updateCategoryButtonIcon();
      } else {
        updateCategoryButtonIcon(categoryIconMap.get(activeCategory));
      }

      updateVisibleIcons();
    } catch {}
  };

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category ?? 'all';
      updateActiveCategoryUI(button);

      if (categoryLabel) {
        categoryLabel.textContent =
          button.querySelector('span.truncate')?.textContent || 'Categories';
      }

      if (activeCategory === 'all') {
        updateCategoryButtonIcon();
      } else {
        updateCategoryButtonIcon(categoryIconMap.get(activeCategory));
      }

      if (svgSkeleton) {
        if (activeCategory === 'all') {
          svgSkeleton.setAttribute('data-random-selector', '.icon-preview svg');
        } else {
          const icon = categoryIconMap.get(activeCategory);
          if (icon) {
            svgSkeleton.setAttribute(
              'data-random-selector',
              `[data-name="${icon}"] .icon-preview svg`
            );
          }
        }
      }

      updateVisibleIcons();
    });
  });

  searchInput?.addEventListener('input', debounce(updateVisibleIcons, 300));

  updateVisibleIcons();
  void loadSearchIndex();
};
