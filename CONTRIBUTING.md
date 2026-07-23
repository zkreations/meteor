# Contributing to Meteor Icons

Thanks for your interest in contributing! This document explains how to get involved, whether you want to submit a new icon, report a problem, or improve the codebase.

## Table of contents

- [Icon requests](#icon-requests)
- [Contributing icons](#contributing-icons)
- [Contributing code](#contributing-code)
- [Pull request guidelines](#pull-request-guidelines)

---

## Icon requests

Before opening a request, search the existing issues to see if someone has already asked for the same icon. If so, leave a 👍 on it instead of opening a duplicate.

When creating a new request, include:

- A clear description of what the icon represents
- Visual references (screenshots, links, or similar icons from other sets)
- Context on where or how it would be used

---

## Contributing icons

All icons in this project are designed at code level with a focus on producing the smallest possible SVG output. This is not just aesthetic — it is the core philosophy of the project. Please read this section carefully before submitting.

### Design principles

- **Minimal path data.** Every curve, line, and anchor point must justify its existence. Redundant commands, unnecessary precision, and bloated coordinates are not acceptable.
- **24×24 viewBox.** All icons use `viewBox="0 0 24 24"` with a default stroke width of `2`.
- **Stroke-based.** Icons use `stroke="currentColor"` with `fill="none"`. Avoid filled shapes unless the concept truly requires it.
- **Visual consistency.** Study the existing icons before drawing a new one. Rounded linecaps, rounded linejoins, and consistent weight are expected.
- **Original work only.** Do not submit icons copied from other icon sets, commercial assets, or any copyrighted material.

### Recommended tool

The [SVG Path Editor](https://yqnn.github.io/svg-path-editor/) is the primary tool used to design and refine the path data in this project. It gives you direct control over the SVG commands, which is essential for keeping the output clean.

### Submitting icons

- One pull request per icon or per closely related group (e.g. `arrow-up` and `arrow-down` belong together; `arrow-up` and `shopping-cart` do not).
- Include a screenshot of the icon in your PR description.
- The SVG file goes in the `icons/` directory, named in kebab-case (e.g. `my-icon.svg`).
- Run `pnpm build` after adding the file to generate the metadata and all package outputs.

---

## Contributing code

### Setup

Node.js >= 22.12.0 and pnpm are required.

```sh
git clone https://github.com/zkreations/meteor.git
cd meteor
pnpm install
```

### Build

Generates all packages from the SVG sources:

```sh
pnpm build
```

### Development server

Runs the documentation site locally:

```sh
pnpm docs:dev
```

### Tests

```sh
pnpm test
```

### How the generators work

The build pipeline is fully code-generated. Do not modify the files in `packages/` directly. Instead, edit the SVG sources in `icons/` and run the build to regenerate all outputs.

```
build/generate-svg.js      Normalizes SVGs, syncs metadata, writes icons.json
build/generate-core.js     Vanilla JS package, browser bundle, sprite, Blogger includable
build/generate-astro.js    Astro components
build/generate-react.js    React components
build/generate-preact.js   Preact components
build/generate-vue.js      Vue components
build/generate-solid.js    SolidJS components
build/generate-svelte.js   Svelte components
build/generate-hamlet.js    Hamlet components
build/generate-readme.js   README.md for each framework package
build/generate-packages.js  Generates package.json for each framework package
```

Shared utilities live in `build/core/`.

---

## Pull request guidelines

- **Scope your PR.** One concern per pull request. Mixed unrelated changes will be asked to be split.
- **Write descriptive commit messages.** Explain the intent, not just what changed.
- **Link the related issue** if one exists.
- **Target the `main` branch** unless told otherwise.
- **Do not include generated files selectively.** Either run the full build or omit generated files entirely and note it in the PR description.

---

If you have questions, open a [GitHub issue](https://github.com/zkreations/meteor/issues).
