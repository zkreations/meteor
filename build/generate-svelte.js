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
const SVELTE_DIR = new URL('../packages/svelte/src/', import.meta.url)
const SVELTE_ICONS_DIR = new URL('../packages/svelte/src/icons/', import.meta.url)

function buildIconSvelteSource (iconName, nodes) {
  const markup = nodes.map(nodeToMarkup).join('\n  ')

  return `<script>
  export let size = 24
  export let strokeWidth = 2
  export let color = 'currentColor'
  let className = ''

  export { className as class }
</script>

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
  class={('i i-${iconName} ' + className).trim()}
  {...$$restProps}
>
  ${markup}
</svg>
`
}

function buildIconTypesSource (iconName) {
  const componentName = toPascalCase(iconName)

  return `import { SvelteComponentTyped } from 'svelte'

export interface MeteorSvelteIconProps {
  size?: string | number
  strokeWidth?: string | number
  color?: string
  class?: string
  [key: string]: unknown
}

export default class ${componentName} extends SvelteComponentTyped<MeteorSvelteIconProps> {}
`
}

async function generateSveltePackage () {
  const icons = await readIconMap()
  const iconNames = getSortedIconNames(icons)

  await writePackageManifest('svelte', config.packages)

  await resetDir(SVELTE_ICONS_DIR)
  await fs.mkdir(SVELTE_DIR, { recursive: true })

  for (const iconName of iconNames) {
    const nodes = icons[iconName].nodes || []

    await fs.writeFile(
      new URL(`./${iconName}.svelte`, SVELTE_ICONS_DIR),
      buildIconSvelteSource(iconName, nodes),
      'utf8'
    )

    await fs.writeFile(
      new URL(`./${iconName}.d.ts`, SVELTE_ICONS_DIR),
      buildIconTypesSource(iconName),
      'utf8'
    )
  }

  const indexSource = buildNamedExportsIndex(iconNames, 'svelte')
  await fs.writeFile(new URL('./index.js', SVELTE_DIR), indexSource, 'utf8')
  await fs.writeFile(new URL('./index.d.ts', SVELTE_DIR), indexSource, 'utf8')

  const rootPath = path.normalize(ROOT_DIR.pathname)
  console.log(`Svelte package generated (${iconNames.length} icons) at ${rootPath}`)
}

generateSveltePackage().catch((error) => {
  console.error('Error generating Svelte package:', error.message)
  process.exit(1)
})
