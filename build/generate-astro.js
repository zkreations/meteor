import fs from 'fs/promises'
import path from 'path'
import config from './icons.config.js'
import {
  buildNamedExportsIndex,
  getSortedIconNames,
  nodeToMarkup,
  readIconMap,
  resetDir,
  toPascalCase
} from './core/framework-utils.js'
import { writePackageManifest } from './core/create-packages.js'

const ROOT_DIR = new URL('..', import.meta.url)
const ASTRO_DIR = new URL('../packages/astro/src/', import.meta.url)
const ASTRO_ICONS_DIR = new URL('../packages/astro/src/icons/', import.meta.url)

function buildIconAstroSource (iconName, nodes) {
  const markup = nodes.map(nodeToMarkup).join('\n  ')

  return `---
export interface Props {
  size?: string | number
  strokeWidth?: string | number
  color?: string
  class?: string
  [key: string]: unknown
}

const {
  size = 24,
  strokeWidth = 2,
  color = 'currentColor',
  class: className = '',
  ...rest
} = Astro.props

const mergedClass = ('i i-${iconName} ' + className).trim()
---

<svg
  xmlns='http://www.w3.org/2000/svg'
  width={size}
  height={size}
  viewBox='0 0 24 24'
  fill='none'
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap='round'
  stroke-linejoin='round'
  class={mergedClass}
  {...rest}
>
  ${markup}
</svg>
`
}

function buildIconTypesSource (iconName) {
  const componentName = toPascalCase(iconName)

  return `export interface MeteorAstroIconProps {
  size?: string | number
  strokeWidth?: string | number
  color?: string
  class?: string
  [key: string]: unknown
}

declare const ${componentName}: (props: MeteorAstroIconProps) => any

export default ${componentName}
`
}

async function generateAstroPackage () {
  const icons = await readIconMap()
  const iconNames = getSortedIconNames(icons)

  await writePackageManifest('astro', config.packages)

  await resetDir(ASTRO_ICONS_DIR)
  await fs.mkdir(ASTRO_DIR, { recursive: true })

  for (const iconName of iconNames) {
    const nodes = icons[iconName].nodes || []

    await fs.writeFile(
      new URL(`./${iconName}.astro`, ASTRO_ICONS_DIR),
      buildIconAstroSource(iconName, nodes),
      'utf8'
    )

    await fs.writeFile(
      new URL(`./${iconName}.d.ts`, ASTRO_ICONS_DIR),
      buildIconTypesSource(iconName),
      'utf8'
    )
  }

  const indexSource = buildNamedExportsIndex(iconNames, 'astro')
  await fs.writeFile(new URL('./index.js', ASTRO_DIR), indexSource, 'utf8')
  await fs.writeFile(new URL('./index.d.ts', ASTRO_DIR), indexSource, 'utf8')

  const rootPath = path.normalize(ROOT_DIR.pathname)
  console.log(`Astro package generated (${iconNames.length} icons) at ${rootPath}`)
}

generateAstroPackage().catch((error) => {
  console.error('Error generating Astro package:', error.message)
  process.exit(1)
})
