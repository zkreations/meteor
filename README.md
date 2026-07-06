![cover](https://raw.githubusercontent.com/zkreations/icons/main/.github/cover.png)

<p align="center">
  <a href="https://meteoricons.com/"><strong>Browse at meteoricons.com →</strong></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/meteor-icons"><img src="https://img.shields.io/npm/v/meteor-icons" alt="Release"></a>
  <a href="https://github.com/zkreations/meteoricons/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/meteor-icons" alt="License"></a>
</p>

## About

Meteor Icons is an open-source icon set designed at code level through intelligent reasoning that surpasses automated optimization, ensuring clean and lightweight SVG code. Every icon is manually crafted to make smart decisions about path structure, keeping file sizes as small as possible.

## Packages

| Package | npm |
| --- | --- |
| [`packages/core`](./packages/core) | [`meteor-icons`](https://www.npmjs.com/package/meteor-icons) |
| [`packages/astro`](./packages/astro) | [`@meteor-icons/astro`](https://www.npmjs.com/package/@meteor-icons/astro) |
| [`packages/react`](./packages/react) | [`@meteor-icons/react`](https://www.npmjs.com/package/@meteor-icons/react) |
| [`packages/preact`](./packages/preact) | [`@meteor-icons/preact`](https://www.npmjs.com/package/@meteor-icons/preact) |
| [`packages/vue`](./packages/vue) | [`@meteor-icons/vue`](https://www.npmjs.com/package/@meteor-icons/vue) |
| [`packages/solid`](./packages/solid) | [`@meteor-icons/solid`](https://www.npmjs.com/package/@meteor-icons/solid) |
| [`packages/svelte`](./packages/svelte) | [`@meteor-icons/svelte`](https://www.npmjs.com/package/@meteor-icons/svelte) |

## Repository structure

```
icons/          SVG source files (one file per icon)
packages/       Published npm packages
  core/         Vanilla JS, browser bundle, sprite, and raw SVGs
  astro/        Astro components
  react/        React components
  preact/       Preact components
  vue/          Vue 3 components
  solid/        SolidJS components
  svelte/       Svelte components
build/          Code generation scripts
  core/         Shared utilities used by the generators
  generate-*.js One generator per package
docs/           Documentation site (meteoricons.com)
```

## Development

This repository uses [pnpm workspaces](https://pnpm.io/workspaces). Node.js >= 22.12.0 is required.

Install dependencies:

```sh
pnpm install
```

Build all packages from the SVG sources:

```sh
pnpm build
```

Run the documentation site locally:

```sh
pnpm docs:dev
```

Run the test suite:

```sh
pnpm test
```

## How the build works

1. `generate-svg.js` reads every `.svg` file in `icons/`, normalizes and optimizes it with SVGO, and writes `packages/core/exports/icons.json` — the canonical icon map that all other generators consume.
2. `generate-core.js` produces the vanilla JS package: ESM modules, browser bundle, SVG sprite, and Blogger includable.
3. Each `generate-<framework>.js` reads `icons.json` and emits the framework-specific component files under `packages/<framework>/src/`.
4. `generate-readme.js` writes a consistent `README.md` to each framework package from a single shared template.

## Contributing

All icons are designed by [Daniel Abel](https://twitter.com/danieI_abel). Contributions are welcome — please keep the following in mind:

- Maintain visual consistency across icons
- Keep SVG code as small as possible
- When requesting a new icon, include a clear visual reference
- When contributing an icon, you must be its original author

You can also support the project by [buying a coffee](https://ko-fi.com/zkreations) ☕.

## License

MIT — see [LICENSE](./LICENSE) for details.
