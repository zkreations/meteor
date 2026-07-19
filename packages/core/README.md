![cover](https://raw.githubusercontent.com/zkreations/meteor/main/packages/core/assets/cover.png)

<p align="center">
  <a href="https://www.npmjs.com/package/meteor-icons"><img src="https://img.shields.io/npm/v/meteor-icons" alt="Version"></a>
  <a href="https://www.npmjs.com/package/meteor-icons"><img src="https://img.shields.io/npm/dt/meteor-icons" alt="Total Downloads"></a>
  <a href="https://github.com/zkreations/meteor/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/meteor-icons" alt="License"></a>
  <a href="https://www.npmjs.com/package/meteor-icons"><img src="https://img.shields.io/github/release-date/zkreations/meteor" alt="Last Release"></a>
</p>

<p align="center">
  <a href="https://meteoricons.com/"><strong>Browse at meteoricons.com →</strong></a>
</p>

## About

A lightweight, source-first icon package that contains the base Meteor Icons assets and generated exports. Unlike the framework wrappers, this package gives you direct access to the raw SVGs, the canonical icon map, and a vanilla JS runtime — making it suitable for custom build pipelines, CDN usage, and non-framework environments.

## Features

- Tree-shakeable: import only what you use
- Vanilla JS runtime with no dependencies
- Raw SVG files and canonical icon map included
- Browser bundle ready for CDN usage
- SVG sprite and Blogger includable outputs

## Installation

```sh
npm install meteor-icons
```

## Usage

### Generated Files

This package is not a framework wrapper. Instead, it provides base assets and generated files:

- `icons/*.svg`: individual raw icon files
- `exports/icons.json`: canonical icon map
- `exports/icons.svg`: sprite output
- `exports/icons.xml`: Blogger inclusion output
- `exports/icons.js`: browser-ready vanilla runtime (minified)
- `src/esm/*`: ESM runtime and per-icon modules

### Vanilla JS (Browser)

Load the browser bundle from a CDN and call `createIcons()` to replace all `data-i` elements with their matching SVGs.

```html
<i data-i="star"></i>
<i data-i="code"></i>

<script src="https://unpkg.com/meteor-icons@latest/browser"></script>
<script>
  meteorIcons.createIcons()
</script>
```

### Vanilla JS (ESM)

Import all icons at once, or only the ones you need (recommended to reduce bundle size).

```js
import { createIcons, icons } from 'meteor-icons'

createIcons({ icons })
```

```js
import { Code, createIcons, Star } from 'meteor-icons'

createIcons({
  icons: { Star, Code }
})
```

### Inline SVG

Browse any icon at [meteoricons.com](https://meteoricons.com/) and paste its SVG markup directly into your project.

### SVG Sprite

Use the generated sprite file and reference symbols by icon name:

```xml
<svg class="i i-github">
  <use href="svg-sprite.svg#github"/>
</svg>
```

### Blogger

Add `exports/icons.xml` to your Blogger template and consume icons via include:

```xml
<b:include name='@meteor' data='{ icon: "github" }'/>
```

| Parameter | Description |
| --- | --- |
| `icon` | Icon name |
| `class` | Additional classes |
| `color` | Stroke color |
| `size` | Width and height |
| `strokeWidth` | Stroke thickness |

### CSS Base

Use this helper class for consistent rendering when using inline SVG or sprite:

```css
.i {
  stroke-width: var(--i-stroke, 2);
  width: var(--i-size, 24px);
  height: var(--i-size, 24px);
  stroke: var(--i-color, currentColor);
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
```

| Variable | Default |
| --- | --- |
| `--i-stroke` | `2` |
| `--i-size` | `24px` |

## Package contents

| Path | Description |
| --- | --- |
| `icons/*.svg` | Raw SVG source files |
| `exports/icons.json` | Canonical icon map |
| `exports/icons.svg` | SVG sprite |
| `exports/icons.xml` | Blogger includable |
| `exports/icons.js` | Browser-ready vanilla runtime |
| `src/esm/` | ESM runtime and per-icon modules |

## Best Practices

- Import only the icons you need
- Use currentColor to inherit color from parent elements
- Keep icon names as kebab-case when mapping from file names

## Contributing

All icons are created by [Daniel Abel](https://twitter.com/danieI_abel), but contributions are welcome.

### Guidelines

- Ensure visual consistency across icons
- Keep SVG code clean and optimized
- Provide clear references when requesting new icons
- Contributions must be original work

## Support

For more information, see [CONTRIBUTING.md](https://github.com/zkreations/meteor/blob/main/CONTRIBUTING.md). You can also support the project by [buying a coffee](https://ko-fi.com/zkreations).

## License

Meteor Icons is licensed under the MIT License.
