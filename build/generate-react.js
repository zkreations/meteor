import fs from 'fs/promises'
import path from 'path'

const ROOT_DIR = new URL('..', import.meta.url)
const ICONS_JSON = new URL('../packages/core/exports/icons.json', import.meta.url)
const REACT_DIR = new URL('../packages/react/src/', import.meta.url)
const REACT_ICONS_DIR = new URL('../packages/react/src/icons/', import.meta.url)

function toPascalCase (value) {
  return value
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

async function resetDir (dirUrl) {
  await fs.rm(dirUrl, { recursive: true, force: true })
  await fs.mkdir(dirUrl, { recursive: true })
}

async function readIconMap () {
  const raw = await fs.readFile(ICONS_JSON, 'utf8')
  return JSON.parse(raw)
}

function jsLiteral (value) {
  if (typeof value === 'string') {
    return JSON.stringify(value)
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map(jsLiteral).join(', ')}]`
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([key, nested]) => `${JSON.stringify(key)}: ${jsLiteral(nested)}`)
      .join(', ')

    return `{ ${entries} }`
  }

  return 'null'
}

function buildCreateIconSource () {
  return `import * as React from 'react'

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
    return React.createElement(node.tag, props, ...children)
  })
}

export function createIcon (iconName, iconNode) {
  const component = React.forwardRef(function MeteorIcon (props, ref) {
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

    return React.createElement(
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

function buildCreateIconTypesSource () {
  return `import type * as React from 'react'

export type IconAttrs = Record<string, string | number | boolean>

export interface IconNode {
  tag: string
  attrs: IconAttrs
  children?: IconNode[]
}

export interface MeteorIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'color'> {
  size?: string | number
  strokeWidth?: string | number
  color?: string
}

export type MeteorIconComponent = React.ForwardRefExoticComponent<
  MeteorIconProps & React.RefAttributes<SVGSVGElement>
>

export declare function createIcon(iconName: string, iconNode: IconNode[]): MeteorIconComponent
`
}

function buildIconModuleSource (iconName, nodes) {
  const componentName = toPascalCase(iconName)
  const iconNodeLiteral = jsLiteral(nodes)

  return `import { createIcon } from '../create-icon.js'

const iconNode = ${iconNodeLiteral}

const ${componentName} = createIcon('${iconName}', iconNode)

export default ${componentName}
`
}

function buildIconTypesSource (iconName) {
  const componentName = toPascalCase(iconName)

  return `import type { MeteorIconComponent } from '../create-icon.js'

declare const ${componentName}: MeteorIconComponent

export default ${componentName}
`
}

function buildIndexSource (iconNames) {
  const imports = iconNames.map((name) => {
    const componentName = toPascalCase(name)
    return `export { default as ${componentName} } from './icons/${name}.js'`
  })

  return imports.join('\n') + '\n'
}

function buildIndexTypesSource (iconNames) {
  const exports = iconNames.map((name) => {
    const componentName = toPascalCase(name)
    return `export { default as ${componentName} } from './icons/${name}.js'`
  })

  return exports.join('\n') + '\n'
}

async function generateReactPackage () {
  const icons = await readIconMap()
  const iconNames = Object.keys(icons).sort((a, b) => a.localeCompare(b))

  await resetDir(REACT_ICONS_DIR)
  await fs.mkdir(REACT_DIR, { recursive: true })

  await fs.writeFile(new URL('./create-icon.js', REACT_DIR), buildCreateIconSource(), 'utf8')
  await fs.writeFile(new URL('./create-icon.d.ts', REACT_DIR), buildCreateIconTypesSource(), 'utf8')

  for (const iconName of iconNames) {
    const nodes = icons[iconName].nodes || []
    await fs.writeFile(
      new URL(`./${iconName}.js`, REACT_ICONS_DIR),
      buildIconModuleSource(iconName, nodes),
      'utf8'
    )

    await fs.writeFile(
      new URL(`./${iconName}.d.ts`, REACT_ICONS_DIR),
      buildIconTypesSource(iconName),
      'utf8'
    )
  }

  await fs.writeFile(new URL('./index.js', REACT_DIR), buildIndexSource(iconNames), 'utf8')
  await fs.writeFile(new URL('./index.d.ts', REACT_DIR), buildIndexTypesSource(iconNames), 'utf8')

  const rootPath = path.normalize(ROOT_DIR.pathname)
  console.log(`React package generated (${iconNames.length} icons) at ${rootPath}`)
}

generateReactPackage().catch((error) => {
  console.error('Error generating React package:', error.message)
  process.exit(1)
})
