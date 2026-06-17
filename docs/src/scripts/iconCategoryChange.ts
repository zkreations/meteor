export const ICON_CATEGORY_CHANGE = 'icon-category-change' as const

export interface IconCategoryChangeDetail {
  svg: SVGElement | null
}

declare global {
  interface DocumentEventMap {
    [ICON_CATEGORY_CHANGE]: CustomEvent<IconCategoryChangeDetail>
  }
}
