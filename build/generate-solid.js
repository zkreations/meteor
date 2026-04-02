import fs from 'fs/promises'
import path from 'path'

const ROOT_DIR = new URL('..', import.meta.url)
const ICONS_JSON = new URL('../packages/core/exports/icons.json', import.meta.url)
const SOLID_DIR = new URL('../packages/solid/src/', import.meta.url)
const SOLID_ICONS_DIR = new URL('../packages/solid/src/icons/', import.meta.url)

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
  return `import { splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'

function renderNodes (nodes) {
  return nodes.map((node) => {
    const children = node.children ? renderNodes(node.children) : []

    return (
      <Dynamic component={node.tag} {...(node.attrs || {})}>
        {children}
      </Dynamic>
    )
  })
}

export function createIcon (iconName, iconNode) {
  return function MeteorIcon (props) {
    const [local, rest] = splitProps(props, ['size', 'strokeWidth', 'color', 'class'])
    const mergedClass = local.class ? 'i i-' + iconName + ' ' + local.class : 'i i-' + iconName

    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={local.size ?? 24}
        height={local.size ?? 24}
        viewBox='0 0 24 24'
        fill='none'
        stroke={local.color ?? 'currentColor'}
        stroke-width={local.strokeWidth ?? 2}
        stroke-linecap='round'
        stroke-linejoin='round'
        class={mergedClass}
        {...rest}
      >
        {renderNodes(iconNode)}
      </svg>
    )
  }
}
`
}

function buildCreateIconTypesSource () {
  return `import type { Component, JSX } from 'solid-js'

export type IconAttrs = Record<string, string | number | boolean>

export interface IconNode {
  tag: string
  attrs: IconAttrs
  children?: IconNode[]
}

export interface MeteorIconProps extends Omit<JSX.SvgSVGAttributes<SVGSVGElement>, 'color'> {
  size?: string | number
  strokeWidth?: string | number
  color?: string
}

export type MeteorIconComponent = Component<MeteorIconProps>

export declare function createIcon(iconName: string, iconNode: IconNode[]): MeteorIconComponent
`
}

function buildIconModuleSource (iconName, nodes) {
  const componentName = toPascalCase(iconName)
  const iconNodeLiteral = jsLiteral(nodes)

  return `import { createIcon } from '../create-icon.jsx'

const iconNode = ${iconNodeLiteral}

const ${componentName} = createIcon('${iconName}', iconNode)

export default ${componentName}
`
}

function buildIconTypesSource (iconName) {
  const componentName = toPascalCase(iconName)

  return `import type { MeteorIconComponent } from '../create-icon.jsx'

declare const ${componentName}: MeteorIconComponent

export default ${componentName}
`
}

function buildIndexSource (iconNames) {
  const exports = iconNames.map((name) => {
    const componentName = toPascalCase(name)
    return `export { default as ${componentName} } from './icons/${name}.jsx'`
  })

  return exports.join('\n') + '\n'
}

async function generateSolidPackage () {
  const icons = await readIconMap()
  const iconNames = Object.keys(icons).sort((a, b) => a.localeCompare(b))

  await resetDir(SOLID_ICONS_DIR)
  await fs.mkdir(SOLID_DIR, { recursive: true })

  await fs.writeFile(new URL('./create-icon.jsx', SOLID_DIR), buildCreateIconSource(), 'utf8')
  await fs.writeFile(new URL('./create-icon.d.ts', SOLID_DIR), buildCreateIconTypesSource(), 'utf8')

  for (const iconName of iconNames) {
    const nodes = icons[iconName].nodes || []
    await fs.writeFile(
      new URL(`./${iconName}.jsx`, SOLID_ICONS_DIR),
      buildIconModuleSource(iconName, nodes),
      'utf8'
    )

    await fs.writeFile(
      new URL(`./${iconName}.d.ts`, SOLID_ICONS_DIR),
      buildIconTypesSource(iconName),
      'utf8'
    )
  }

  await fs.writeFile(new URL('./index.jsx', SOLID_DIR), buildIndexSource(iconNames), 'utf8')
  await fs.writeFile(new URL('./index.d.ts', SOLID_DIR), buildIndexSource(iconNames), 'utf8')

  const rootPath = path.normalize(ROOT_DIR.pathname)
  console.log(`Solid package generated (${iconNames.length} icons) at ${rootPath}`)
}

generateSolidPackage().catch((error) => {
  console.error('Error generating Solid package:', error.message)
  process.exit(1)
})
