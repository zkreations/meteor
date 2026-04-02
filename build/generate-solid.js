import fs from 'fs/promises'
import path from 'path'
import {
  buildNamedExportsIndex,
  getSortedIconNames,
  jsLiteral,
  readIconMap,
  resetDir,
  toPascalCase
} from './core/framework-utils.js'

const ROOT_DIR = new URL('..', import.meta.url)
const SOLID_DIR = new URL('../packages/solid/src/', import.meta.url)
const SOLID_ICONS_DIR = new URL('../packages/solid/src/icons/', import.meta.url)

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

async function generateSolidPackage () {
  const icons = await readIconMap()
  const iconNames = getSortedIconNames(icons)

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

  const indexSource = buildNamedExportsIndex(iconNames, 'jsx')
  await fs.writeFile(new URL('./index.jsx', SOLID_DIR), indexSource, 'utf8')
  await fs.writeFile(new URL('./index.d.ts', SOLID_DIR), indexSource, 'utf8')

  const rootPath = path.normalize(ROOT_DIR.pathname)
  console.log(`Solid package generated (${iconNames.length} icons) at ${rootPath}`)
}

generateSolidPackage().catch((error) => {
  console.error('Error generating Solid package:', error.message)
  process.exit(1)
})
