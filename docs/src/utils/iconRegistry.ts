const ICON_SVG_SELECTOR = '.icon-preview svg, .source-slot svg'

// Resolve the icon SVG nested inside an already-located container
// @param container - element expected to contain an icon preview/source SVG
export function getIconSvgFromContainer(container: ParentNode | null): SVGElement | null {
  return container?.querySelector<SVGElement>(ICON_SVG_SELECTOR) ?? null
}

// Resolve an icon's SVG by its kebab-case `data-name`, optionally scoped to `root`.
// @param name - kebab-case icon name (matches the `data-name` attribute)
// @param root - optional scope to search within (defaults to the whole document)
export function getIconSvgByName(name: string, root: ParentNode = document): SVGElement | null {
  if (!name)
    return null

  return getIconSvgFromContainer(root.querySelector<HTMLElement>(`[data-name="${name}"]`))
}
