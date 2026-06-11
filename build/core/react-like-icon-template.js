export function buildReactLikeCreateIconSource(runtimeImport) {
  return `import * as IconRuntime from '${runtimeImport}'

const ATTR_MAP = {
  class: 'className',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule'
}

function normalizeAttrName (name) {
  if (ATTR_MAP[name]) {
    return ATTR_MAP[name]
  }

  if (name.includes('-')) {
    return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  }

  return name
}

function normalizeAttrs (attrs = {}) {
  return Object.fromEntries(
    Object.entries(attrs).map(([key, value]) => [normalizeAttrName(key), value])
  )
}

function renderNodes (nodes) {
  return nodes.map((node, index) => {
    const props = {
      key: node.tag + '-' + index,
      ...normalizeAttrs(node.attrs)
    }

    const children = node.children ? renderNodes(node.children) : []
    return IconRuntime.createElement(node.tag, props, ...children)
  })
}

export function createIcon (iconName, iconNode) {
  const component = IconRuntime.forwardRef(function MeteorIcon (props, ref) {
    const {
      size = 24,
      strokeWidth = 2,
      color = 'currentColor',
      className,
      ...rest
    } = props

    const mergedClassName = className
      ? 'i i-' + iconName + ' ' + className
      : 'i i-' + iconName

    return IconRuntime.createElement(
      'svg',
      {
        ref,
        xmlns: 'http://www.w3.org/2000/svg',
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: color,
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className: mergedClassName,
        ...rest
      },
      ...renderNodes(iconNode)
    )
  })

  component.displayName = iconName
  return component
}
`
}
