const PROP = {
  size: { name: '`size`', type: '*string \\| number*', default: '24', description: 'Sets width and height' },
  color: { name: '`color`', type: '*string*', default: 'currentColor', description: 'Defines the stroke color' },
  strokeWidth: { name: '`strokeWidth`', type: '*string \\| number*', default: '2', description: 'Controls stroke thickness' },
  className: { name: '`className`', type: '*string*', default: '-', description: 'Additional CSS classes' },
  class: { name: '`class`', type: '*string*', default: '-', description: 'Additional CSS classes' },
  classEmpty: { name: '`class`', type: '*string*', default: '\'\'', description: 'Additional CSS classes' },
}

const REST = {
  react: { name: '`...rest`', type: '*React.SVGProps\\<SVGSVGElement\\>*', default: '-', description: 'Any valid SVG attribute' },
  preact: { name: '`...rest`', type: '*JSX.SVGAttributes\\<SVGSVGElement\\>*', default: '-', description: 'Any valid SVG attribute' },
  vue: { name: '`...attrs`', type: '*HTML/SVG attrs*', default: '-', description: 'Forwarded to the root SVG' },
  solid: { name: '`...rest`', type: '*SVG attrs*', default: '-', description: 'Any valid SVG attribute' },
  svelte: { name: '`...$$restProps`', type: '*SVG attrs*', default: '-', description: 'Any valid SVG attribute' },
  astro: { name: '`...rest`', type: '*SVG attrs*', default: '-', description: 'Any valid SVG attribute' },
}

function frameworkProps(classKey, restKey) {
  return [PROP.size, PROP.color, PROP.strokeWidth, PROP[classKey], REST[restKey]]
}

// @type {Record<string, ReadmeConfig>}
export const PACKAGE_README_CONFIGS = {
  core: {
    type: 'core',
    packageName: 'meteor-icons',
    installPkg: 'meteor-icons',
    about: 'A lightweight, source-first icon package that contains the base Meteor Icons assets and generated exports. Unlike the framework wrappers, this package gives you direct access to the raw SVGs, the canonical icon map, and a vanilla JS runtime — making it suitable for custom build pipelines, CDN usage, and non-framework environments.',
    features: [
      'Tree-shakeable: import only what you use',
      'Vanilla JS runtime with no dependencies',
      'Raw SVG files and canonical icon map included',
      'Browser bundle ready for CDN usage',
      'SVG sprite and Blogger includable outputs',
    ],
    contents: [
      { path: '`icons/*.svg`', description: 'Raw SVG source files' },
      { path: '`exports/icons.json`', description: 'Canonical icon map' },
      { path: '`exports/icons.svg`', description: 'SVG sprite' },
      { path: '`exports/icons.xml`', description: 'Blogger includable' },
      { path: '`exports/icons.js`', description: 'Browser-ready vanilla runtime' },
      { path: '`src/esm/`', description: 'ESM runtime and per-icon modules' },
    ],
    usageSections: [
      {
        title: 'Generated Files',
        description: 'This package is not a framework wrapper. Instead, it provides base assets and generated files:',
        snippet: `- \`icons/*.svg\`: individual raw icon files
- \`exports/icons.json\`: canonical icon map
- \`exports/icons.svg\`: sprite output
- \`exports/icons.xml\`: Blogger inclusion output
- \`exports/icons.js\`: browser-ready vanilla runtime (minified)
- \`src/esm/*\`: ESM runtime and per-icon modules`,
      },
      {
        title: 'Vanilla JS (Browser)',
        description: 'Load the browser bundle from a CDN and call `createIcons()` to replace all `data-i` elements with their matching SVGs.',
        snippet: `\`\`\`html
<i data-i="star"></i>
<i data-i="code"></i>

<script src="https://unpkg.com/meteor-icons@latest/browser"></script>
<script>
  meteorIcons.createIcons()
</script>
\`\`\``,
      },
      {
        title: 'Vanilla JS (ESM)',
        description: 'Import all icons at once, or only the ones you need (recommended to reduce bundle size).',
        snippet: `\`\`\`js
import { createIcons, icons } from 'meteor-icons'

createIcons({ icons })
\`\`\`

\`\`\`js
import { Code, createIcons, Star } from 'meteor-icons'

createIcons({
  icons: { Star, Code }
})
\`\`\``,
      },
      {
        title: 'Inline SVG',
        description: 'Browse any icon at [meteoricons.com](https://meteoricons.com/) and paste its SVG markup directly into your project.',
        snippet: null,
      },
      {
        title: 'SVG Sprite',
        description: 'Use the generated sprite file and reference symbols by icon name:',
        snippet: `\`\`\`xml
<svg class="i i-github">
  <use href="svg-sprite.svg#github"/>
</svg>
\`\`\``,
      },
      {
        title: 'Blogger',
        description: 'Add `exports/icons.xml` to your Blogger template and consume icons via include:',
        snippet: `\`\`\`xml
<b:include name='@meteor' data='{ icon: "github" }'/>
\`\`\``,
        table: {
          headers: ['Parameter', 'Description'],
          rows: [
            ['`icon`', 'Icon name'],
            ['`class`', 'Additional classes'],
            ['`viewbox`', '`viewBox` attribute'],
            ['`fill`', '`fill` attribute'],
            ['`width`', '`width` attribute'],
            ['`height`', '`height` attribute'],
          ],
        },
      },
      {
        title: 'CSS Base',
        description: 'Use this helper class for consistent rendering when using inline SVG or sprite:',
        snippet: `\`\`\`css
.i {
  stroke-width: var(--i-stroke, 2);
  width: var(--i-size, 24px);
  height: var(--i-size, 24px);
  stroke: var(--i-color, currentColor);
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
\`\`\``,
        table: {
          headers: ['Variable', 'Default'],
          rows: [
            ['`--i-stroke`', '`2`'],
            ['`--i-size`', '`24px`'],
          ],
        },
      },
    ],
    bestPractices: [
      'Import only the icons you need',
      'Use currentColor to inherit color from parent elements',
      'Keep icon names as kebab-case when mapping from file names',
    ],
  },

  react: {
    packageName: '@meteor-icons/react',
    peerLabel: 'React',
    installPkg: '@meteor-icons/react',
    usageSnippet: `\`\`\`jsx
import { Code, Star } from '@meteor-icons/react'

export default function App() {
  return <Code />
}
\`\`\``,
    subpathSnippet: `\`\`\`jsx
import Code from '@meteor-icons/react/icons/code'
\`\`\``,
    props: frameworkProps('className', 'react'),
    exampleSnippet: `\`\`\`jsx
import { Code } from '@meteor-icons/react'

export default function App() {
  return (
    <Code
      size={48}
      color="red"
      strokeWidth={1}
      aria-label="code icon"
    />
  )
}
\`\`\``,
  },

  preact: {
    packageName: '@meteor-icons/preact',
    peerLabel: 'Preact',
    installPkg: '@meteor-icons/preact',
    usageSnippet: `\`\`\`jsx
import { Code, Star } from '@meteor-icons/preact'

export default function App() {
  return <Code />
}
\`\`\``,
    subpathSnippet: `\`\`\`jsx
import Code from '@meteor-icons/preact/icons/code'
\`\`\``,
    props: frameworkProps('className', 'preact'),
    exampleSnippet: `\`\`\`jsx
import { Code } from '@meteor-icons/preact'

export default function App() {
  return (
    <Code
      size={48}
      color="red"
      strokeWidth={1}
      aria-label="code icon"
    />
  )
}
\`\`\``,
  },

  vue: {
    packageName: '@meteor-icons/vue',
    peerLabel: 'Vue',
    installPkg: '@meteor-icons/vue',
    usageSnippet: `\`\`\`vue
<script setup>
import { Code, Star } from '@meteor-icons/vue'
</script>

<template>
  <Code />
</template>
\`\`\``,
    subpathSnippet: `\`\`\`js
import Code from '@meteor-icons/vue/icons/code'
\`\`\``,
    props: frameworkProps('class', 'vue'),
    exampleSnippet: `\`\`\`vue
<script setup>
import { Code } from '@meteor-icons/vue'
</script>

<template>
  <Code size="48" color="red" :stroke-width="1" aria-label="code icon" />
</template>
\`\`\``,
  },

  solid: {
    packageName: '@meteor-icons/solid',
    peerLabel: 'SolidJS',
    installPkg: '@meteor-icons/solid',
    usageSnippet: `\`\`\`jsx
import { Code, Star } from '@meteor-icons/solid'

export default function App() {
  return <Code />
}
\`\`\``,
    subpathSnippet: `\`\`\`jsx
import Code from '@meteor-icons/solid/icons/code'
\`\`\``,
    props: frameworkProps('class', 'solid'),
    exampleSnippet: `\`\`\`jsx
import { Code } from '@meteor-icons/solid'

export default function App() {
  return <Code size={48} color="red" strokeWidth={1} aria-label="code icon" />
}
\`\`\``,
  },

  svelte: {
    packageName: '@meteor-icons/svelte',
    peerLabel: 'Svelte',
    installPkg: '@meteor-icons/svelte',
    usageSnippet: `\`\`\`svelte
<script>
  import { Code, Star } from '@meteor-icons/svelte'
</script>

<Code />
\`\`\``,
    subpathSnippet: `\`\`\`svelte
<script>
  import Code from '@meteor-icons/svelte/icons/code'
</script>
\`\`\``,
    props: frameworkProps('classEmpty', 'svelte'),
    exampleSnippet: `\`\`\`svelte
<script>
  import { Code } from '@meteor-icons/svelte'
</script>

<Code size={48} color='red' strokeWidth={1} class='icon-large' aria-label='code icon' />
\`\`\``,
  },

  astro: {
    packageName: '@meteor-icons/astro',
    peerLabel: 'Astro',
    installPkg: '@meteor-icons/astro',
    usageSnippet: `\`\`\`astro
---
import { Code, Star } from '@meteor-icons/astro'
---

<Code />
\`\`\``,
    subpathSnippet: `\`\`\`astro
---
import Code from '@meteor-icons/astro/icons/code'
---
\`\`\``,
    props: frameworkProps('classEmpty', 'astro'),
    exampleSnippet: `\`\`\`astro
---
import { Code } from '@meteor-icons/astro'
---

<Code size={48} color='red' strokeWidth={1} class='icon-large' aria-label='code icon' />
\`\`\``,
  },
}

function buildTable(headers, rows) {
  const header = `| ${headers.join(' | ')} |`
  const divider = `| ${headers.map(() => '---').join(' | ')} |`
  const body = rows.map(row => `| ${row.join(' | ')} |`).join('\n')
  return `${header}\n${divider}\n${body}`
}

function buildPropsTable(props) {
  return buildTable(
    ['Prop', 'Type', 'Default', 'Description'],
    props.map(p => [p.name, p.type, p.default, p.description]),
  )
}

function buildBadges(installPkg) {
  const npm = `https://www.npmjs.com/package/${installPkg}`
  const gh = 'https://github.com/zkreations/meteor/blob/main/LICENSE'
  return `<p align="center">
  <a href="${npm}"><img src="https://img.shields.io/npm/v/${installPkg}" alt="Version"></a>
  <a href="${npm}"><img src="https://img.shields.io/npm/dt/${installPkg}" alt="Total Downloads"></a>
  <a href="${gh}"><img src="https://img.shields.io/npm/l/${installPkg}" alt="License"></a>
  <a href="${npm}"><img src="https://img.shields.io/github/release-date/zkreations/meteor" alt="Last Release"></a>
</p>`
}

function buildSharedFooter() {
  return `## Contributing

All icons are created by [Daniel Abel](https://twitter.com/danieI_abel), but contributions are welcome.

### Guidelines

- Ensure visual consistency across icons
- Keep SVG code clean and optimized
- Provide clear references when requesting new icons
- Contributions must be original work

## Support

For more information, see [CONTRIBUTING.md](https://github.com/zkreations/meteor/blob/main/CONTRIBUTING.md). You can also support the project by [buying a coffee](https://ko-fi.com/zkreations).

## License

Meteor Icons is licensed under the MIT License.`
}

function buildHeader(installPkg) {
  return `![cover](./assets/cover.png)

${buildBadges(installPkg)}

<p align="center">
  <a href="https://meteoricons.com/"><strong>Browse at meteoricons.com →</strong></a>
</p>`
}

function buildSection({ title, description, snippet, table }) {
  const parts = [`### ${title}`, '', description]
  if (snippet)
    parts.push('', snippet)
  if (table)
    parts.push('', buildTable(table.headers, table.rows))
  return parts.join('\n')
}

function buildCoreReadme({ installPkg, about, features, contents, usageSections, bestPractices }) {
  return `${buildHeader(installPkg)}

## About

${about}

## Features

${features.map(f => `- ${f}`).join('\n')}

## Installation

\`\`\`sh
npm install ${installPkg}
\`\`\`

## Usage

${usageSections.map(buildSection).join('\n\n')}

## Package contents

${buildTable(['Path', 'Description'], contents.map(c => [c.path, c.description]))}

## Best Practices

${bestPractices.map(p => `- ${p}`).join('\n')}

${buildSharedFooter()}
`
}

function buildFrameworkReadme({ peerLabel, installPkg, usageSnippet, subpathSnippet, props, exampleSnippet }) {
  return `${buildHeader(installPkg)}

## About

A lightweight, tree-shakeable icon library for ${peerLabel} applications based on Meteor Icons.

## Features

- Tree-shakeable: import only what you use
- Designed for ${peerLabel}
- Fully customizable through props
- Inline SVG rendering
- Optimized for performance

## Installation

\`\`\`sh
npm install ${installPkg}
\`\`\`

## Usage

Use named imports for a compact developer experience.

${usageSnippet}

You can also import by subpath if you prefer explicit per-file imports.

${subpathSnippet}

Both styles are tree-shakeable in modern production bundlers.

## Props

All icons share the same props:

${buildPropsTable(props)}

### Example

${exampleSnippet}

## Best Practices

- Import only the icons you need
- Use currentColor to inherit color from parent elements
- Prefer CSS classes over inline styles for consistency

${buildSharedFooter()}
`
}

export function buildReadme(config) {
  return config.type === 'core'
    ? buildCoreReadme(config)
    : buildFrameworkReadme(config)
}
