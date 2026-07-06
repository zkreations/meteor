// @type {Record<string, ReadmeConfig>}
export const PACKAGE_README_CONFIGS = {
  react: {
    packageName: '@meteor-icons/react',
    peerLabel: 'React',
    importPkg: '@meteor-icons/react',
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
    props: [
      { name: '`size`', type: '*string \\| number*', default: '24', description: 'Sets width and height' },
      { name: '`color`', type: '*string*', default: 'currentColor', description: 'Defines the stroke color' },
      { name: '`strokeWidth`', type: '*string \\| number*', default: '2', description: 'Controls stroke thickness' },
      { name: '`className`', type: '*string*', default: '-', description: 'Additional CSS classes' },
      { name: '`...rest`', type: '*React.SVGProps\\<SVGSVGElement\\>*', default: '-', description: 'Any valid SVG attribute' },
    ],
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
    importPkg: '@meteor-icons/preact',
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
    props: [
      { name: '`size`', type: '*string \\| number*', default: '24', description: 'Sets width and height' },
      { name: '`color`', type: '*string*', default: 'currentColor', description: 'Defines the stroke color' },
      { name: '`strokeWidth`', type: '*string \\| number*', default: '2', description: 'Controls stroke thickness' },
      { name: '`className`', type: '*string*', default: '-', description: 'Additional CSS classes' },
      { name: '`...rest`', type: '*JSX.SVGAttributes\\<SVGSVGElement\\>*', default: '-', description: 'Any valid SVG attribute' },
    ],
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
    importPkg: '@meteor-icons/vue',
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
    props: [
      { name: '`size`', type: '*string \\| number*', default: '24', description: 'Sets width and height' },
      { name: '`color`', type: '*string*', default: 'currentColor', description: 'Defines the stroke color' },
      { name: '`strokeWidth`', type: '*string \\| number*', default: '2', description: 'Controls stroke thickness' },
      { name: '`class`', type: '*string*', default: '-', description: 'Additional CSS classes' },
      { name: '`...attrs`', type: '*HTML/SVG attrs*', default: '-', description: 'Forwarded to the root SVG' },
    ],
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
    importPkg: '@meteor-icons/solid',
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
    props: [
      { name: '`size`', type: '*string \\| number*', default: '24', description: 'Sets width and height' },
      { name: '`color`', type: '*string*', default: 'currentColor', description: 'Defines the stroke color' },
      { name: '`strokeWidth`', type: '*string \\| number*', default: '2', description: 'Controls stroke thickness' },
      { name: '`class`', type: '*string*', default: '-', description: 'Additional CSS classes' },
      { name: '`...rest`', type: '*SVG attrs*', default: '-', description: 'Any valid SVG attribute' },
    ],
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
    importPkg: '@meteor-icons/svelte',
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
    props: [
      { name: '`size`', type: '*string \\| number*', default: '24', description: 'Sets width and height' },
      { name: '`color`', type: '*string*', default: 'currentColor', description: 'Defines the stroke color' },
      { name: '`strokeWidth`', type: '*string \\| number*', default: '2', description: 'Controls stroke thickness' },
      { name: '`class`', type: '*string*', default: '\'\'', description: 'Additional CSS classes' },
      { name: '`...$$restProps`', type: '*SVG attrs*', default: '-', description: 'Any valid SVG attribute' },
    ],
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
    importPkg: '@meteor-icons/astro',
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
    props: [
      { name: '`size`', type: '*string \\| number*', default: '24', description: 'Sets width and height' },
      { name: '`color`', type: '*string*', default: 'currentColor', description: 'Defines the stroke color' },
      { name: '`strokeWidth`', type: '*string \\| number*', default: '2', description: 'Controls stroke thickness' },
      { name: '`class`', type: '*string*', default: '\'\'', description: 'Additional CSS classes' },
      { name: '`...rest`', type: '*SVG attrs*', default: '-', description: 'Any valid SVG attribute' },
    ],
    exampleSnippet: `\`\`\`astro
---
import { Code } from '@meteor-icons/astro'
---

<Code size={48} color='red' strokeWidth={1} class='icon-large' aria-label='code icon' />
\`\`\``,
  },
}

// Renders the props table from an array of PropRow objects.
// @param {PropRow[]} props
// @return {string}
function buildPropsTable(props) {
  const header = '| Prop | Type | Default | Description |\n| --- | --- | --- | --- |'
  const rows = props
    .map(p => `| ${p.name} | ${p.type} | ${p.default} | ${p.description} |`)
    .join('\n')
  return `${header}\n${rows}`
}

// Builds the complete README markdown for a framework package.
// @param {ReadmeConfig} config
// @return {string}
export function buildReadme(config) {
  const {
    peerLabel,
    installPkg,
    usageSnippet,
    subpathSnippet,
    props,
    exampleSnippet,
  } = config

  return `![cover](./assets/cover.png)

<p align="center">
  <a href="https://www.npmjs.com/package/${installPkg}"><img src="https://img.shields.io/npm/v/${installPkg}" alt="Version"></a>
  <a href="https://www.npmjs.com/package/${installPkg}"><img src="https://img.shields.io/npm/dt/${installPkg}" alt="Total Downloads"></a>
  <a href="https://github.com/zkreations/meteor/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/${installPkg}" alt="License"></a>
  <a href="https://www.npmjs.com/package/${installPkg}"><img src="https://img.shields.io/github/release-date/zkreations/meteor" alt="Last Release"></a>
</p>

<p align="center">
  <a href="https://meteoricons.com/"><strong>Browse at meteoricons.com →</strong></a>
</p>

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

## Contributing

All icons are created by [Daniel Abel](https://twitter.com/danieI_abel), but contributions are welcome.

### Guidelines

- Ensure visual consistency across icons
- Keep SVG code clean and optimized
- Provide clear references when requesting new icons
- Contributions must be original work

## Support

If you want, you can also help me maintain this and more projects by [buying me a coffee](https://ko-fi.com/zkreations).

## License

Meteor Icons is licensed under the MIT License.
`
}
