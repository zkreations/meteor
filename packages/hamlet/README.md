![cover](https://raw.githubusercontent.com/zkreations/meteor/main/packages/hamlet/assets/cover.png)

<p align="center">
  <a href="https://www.npmjs.com/package/@meteor-icons/hamlet"><img src="https://img.shields.io/npm/v/@meteor-icons/hamlet" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@meteor-icons/hamlet"><img src="https://img.shields.io/npm/dt/@meteor-icons/hamlet" alt="Total Downloads"></a>
  <a href="https://github.com/zkreations/meteor/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@meteor-icons/hamlet" alt="License"></a>
  <a href="https://www.npmjs.com/package/@meteor-icons/hamlet"><img src="https://img.shields.io/github/release-date/zkreations/meteor" alt="Last Release"></a>
</p>

<p align="center">
  <a href="https://meteoricons.com/"><strong>Browse at meteoricons.com →</strong></a>
</p>

## About

A Hamlet plugin that exposes Meteor Icons partials for inline SVG output and Blogger includes.

## Features

- Registers the Meteor namespace
- Provides svg, include, and includable partials
- Reuses the same generated icon map as the rest of the project
- Keeps Blogger and SVG output aligned with the core package

## Installation

```sh
npm install @meteor-icons/hamlet
```

## Usage

Add the plugin to your `hamlet.config.js` configuration file:

```js
import Meteor from '@meteor-icons/hamlet'

export default {
  plugins: [
    Meteor()
  ]
}
```

## Partials

| Partial | Description |
| --- | --- |
| `Meteor.svg` | SVG partial for inline icon markup |
| `Meteor.include` | Blogger <b:include> helper partial |
| `Meteor.includable` | Blogger includable XML partial |

## Parameters

| Parameter | Description |
| --- | --- |
| `icon` | Icon name |
| `class` | Additional classes |
| `color` | Stroke color |
| `size` | Width and height |
| `strokeWidth` | Stroke thickness |

### Example

```handlebars
{{> Meteor.includable}}

{{> Meteor.include icon="github"}}

{{> Meteor.svg icon="github"}}
```

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
