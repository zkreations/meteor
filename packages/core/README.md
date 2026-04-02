# Meteor Icons Core

A lightweight, source-first icon package that contains the base Meteor Icons assets and generated exports.

## Features

- Historical base package published as `meteor-icons`
- Includes all raw SVG files in `icons/`
- Includes generated exports for integrations
- Works well for custom build pipelines and static usage

## Installation

```sh
npm install meteor-icons
```

## Usage

This package is not a framework wrapper. Instead, it provides base assets and generated files:

- `icons/*.svg`: individual raw icon files
- `exports/icons.json`: canonical icon map
- `exports/icons.svg`: sprite output
- `exports/icons.xml`: Blogger inclusion output

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

You can set the size and thickness with CSS variables:

| Variable | Default |
| --- | --- |
| `--i-stroke` | `2` |
| `--i-size` | `20px` |

### Inline SVG

Choose any icon from [meteoricons.com](https://meteoricons.com/) and paste its SVG markup directly into your project.

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

Available Blogger params:

| Parameter | Description |
| --- | --- |
| `icon` | Icon name |
| `class` | Additional classes |
| `viewbox` | `viewbox` attribute |
| `fill` | `fill` attribute |
| `width` | `width` attribute |
| `height` | `height` attribute |

## Best Practices

- Consume only the files you need from `icons/` or `exports/`
- Prefer `currentColor` for easier theming
- Keep icon names as kebab-case when mapping from file names

## Contributing

All icons are designed by [Daniel Abel](https://twitter.com/danieI_abel), but contributions are welcome.

### Guidelines

- Ensure visual consistency across icons
- Keep SVG code clean and optimized
- Provide clear references when requesting new icons
- Contributions must be original work

## Support

If you want, you can also help me maintain this and more projects by [buying me a coffee](https://ko-fi.com/zkreations).

## License

Meteor Icons is licensed under the MIT License.
