![cover](https://raw.githubusercontent.com/zkreations/meteor/main/packages/react/assets/cover.png)

<p align="center">
  <a href="https://www.npmjs.com/package/@meteor-icons/react"><img src="https://img.shields.io/npm/v/@meteor-icons/react" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@meteor-icons/react"><img src="https://img.shields.io/npm/dt/@meteor-icons/react" alt="Total Downloads"></a>
  <a href="https://github.com/zkreations/meteor/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@meteor-icons/react" alt="License"></a>
  <a href="https://www.npmjs.com/package/@meteor-icons/react"><img src="https://img.shields.io/github/release-date/zkreations/meteor" alt="Last Release"></a>
</p>

<p align="center">
  <a href="https://meteoricons.com/"><strong>Browse at meteoricons.com →</strong></a>
</p>

## About

A lightweight, tree-shakeable icon library for React applications based on Meteor Icons.

## Features

- Tree-shakeable: import only what you use
- Designed for React
- Fully customizable through props
- Inline SVG rendering
- Optional minimal SVG attributes mode
- Optimized for performance

## Installation

```sh
npm install @meteor-icons/react
```

## Usage

Use named imports for a compact developer experience.

```jsx
import { Code, Star } from '@meteor-icons/react'

export default function App() {
  return <Code />
}
```

You can also import by subpath if you prefer explicit per-file imports.

```jsx
import Code from '@meteor-icons/react/icons/code'
```

Both styles are tree-shakeable in modern production bundlers.

## Props

All icons share the same props:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | *string \| number* | 24 | Sets width and height |
| `color` | *string* | currentColor | Defines the stroke color |
| `strokeWidth` | *string \| number* | 2 | Controls stroke thickness |
| `minimal` | *boolean* | false | Renders only essential SVG attributes (class and viewBox) |
| `className` | *string* | - | Additional CSS classes |
| `...rest` | *React.SVGProps\<SVGSVGElement\>* | - | Any valid SVG attribute |

### Minimal mode

Use the `minimal` prop to keep only essential attributes in the generated SVG root (`class` and `viewBox`).

```jsx
import { Star } from '@meteor-icons/react'

export default function App() {
  return (
    <>
      <Star minimal />
      <Star minimal className="icon-lg text-blue-500" />
    </>
  )
}
```

If you use minimal mode, you should add the following CSS to your styles for proper icon rendering:

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

### Example

```jsx
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
```

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

For more information, see [CONTRIBUTING.md](https://github.com/zkreations/meteor/blob/main/CONTRIBUTING.md). You can also support the project by [buying a coffee](https://ko-fi.com/zkreations).

## License

Meteor Icons is licensed under the MIT License.
