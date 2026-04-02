import fs from 'fs/promises'
import path from 'path'

const ROOT_DIR = new URL('..', import.meta.url)
const ICONS_JSON = new URL('../packages/core/exports/icons.json', import.meta.url)
const VUE_DIR = new URL('../packages/vue/src/', import.meta.url)
const VUE_ICONS_DIR = new URL('../packages/vue/src/icons/', import.meta.url)

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
  return `import { defineComponent, h } from 'vue'

function renderNodes (nodes) {
  return nodes.map((node) => {
    const children = node.children ? renderNodes(node.children) : []
    return h(node.tag, node.attrs || {}, children)
  })
}

export function createIcon (iconName, iconNode) {
  return defineComponent({
    name: iconName,
    inheritAttrs: false,
    props: {
      size: {
        type: [String, Number],
        default: 24
      },
      strokeWidth: {
        type: [String, Number],
        default: 2
      },
      color: {
        type: String,
        default: 'currentColor'
      }
    },
    setup (props, { attrs }) {
      return () => {
        const { class: attrsClass, ...restAttrs } = attrs

        return h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: props.size,
            height: props.size,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: props.color,
            'stroke-width': props.strokeWidth,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            class: attrsClass ? ['i i-' + iconName, attrsClass] : 'i i-' + iconName,
            ...restAttrs
          },
          renderNodes(iconNode)
        )
      }
    }
  })
}
`
}

function buildCreateIconTypesSource () {
  return `import type { DefineComponent } from 'vue'

export type IconAttrs = Record<string, string | number | boolean>

export interface IconNode {
  tag: string
  attrs: IconAttrs
  children?: IconNode[]
}

export interface MeteorIconProps {
  size?: string | number
  strokeWidth?: string | number
  color?: string
}

export type MeteorIconComponent = DefineComponent<MeteorIconProps>

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
  const exports = iconNames.map((name) => {
    const componentName = toPascalCase(name)
    return `export { default as ${componentName} } from './icons/${name}.js'`
  })

  return exports.join('\n') + '\n'
}

async function generateVuePackage () {
  const icons = await readIconMap()
  const iconNames = Object.keys(icons).sort((a, b) => a.localeCompare(b))

  await resetDir(VUE_ICONS_DIR)
  await fs.mkdir(VUE_DIR, { recursive: true })

  await fs.writeFile(new URL('./create-icon.js', VUE_DIR), buildCreateIconSource(), 'utf8')
  await fs.writeFile(new URL('./create-icon.d.ts', VUE_DIR), buildCreateIconTypesSource(), 'utf8')

  for (const iconName of iconNames) {
    const nodes = icons[iconName].nodes || []
    await fs.writeFile(
      new URL(`./${iconName}.js`, VUE_ICONS_DIR),
      buildIconModuleSource(iconName, nodes),
      'utf8'
    )

    await fs.writeFile(
      new URL(`./${iconName}.d.ts`, VUE_ICONS_DIR),
      buildIconTypesSource(iconName),
      'utf8'
    )
  }

  await fs.writeFile(new URL('./index.js', VUE_DIR), buildIndexSource(iconNames), 'utf8')
  await fs.writeFile(new URL('./index.d.ts', VUE_DIR), buildIndexSource(iconNames), 'utf8')

  const rootPath = path.normalize(ROOT_DIR.pathname)
  console.log(`Vue package generated (${iconNames.length} icons) at ${rootPath}`)
}

generateVuePackage().catch((error) => {
  console.error('Error generating Vue package:', error.message)
  process.exit(1)
})
