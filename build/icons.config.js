import path from 'node:path'
import { fileURLToPath } from 'node:url'
import rootPkg from '../package.json' with { type: 'json' }
import { makeFrameworkEntry } from './core/create-packages.js'

const { version } = rootPkg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  iconsDir: path.join(__dirname, '../icons/'),
  outputDir: path.join(__dirname, '../packages/core/exports/'),
  coreIconsDir: path.join(__dirname, '../packages/core/icons/'),

  spriteFilename: 'icons.svg',
  includableFilename: 'icons.xml',
  jsonFilename: 'icons.json',
  jsFilename: 'icons.js',

  defaultSvgAttributes: {
    'class': '',
    'viewBox': '0 0 24 24',
    'xmlns': 'http://www.w3.org/2000/svg',
    'fill': 'none',
    'stroke': 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  },

  packages: {
    defaults: {
      name: 'meteor-icons',
      type: 'module',
      version,
      private: false,
      description: 'Meteor is an open-source icon set with ultra-lightweight, performance-focused code, crafted through human reasoning.',
      author: 'Abel Moreira <daniel@zkreations.com>',
      license: 'MIT',
      homepage: 'https://meteoricons.com',
      repository: {
        type: 'git',
        url: 'git+https://github.com/zkreations/meteor.git',
      },
      bugs: { url: 'https://github.com/zkreations/meteor/issues' },
      keywords: [
        'icons',
        'svg',
        'icon-library',
        'meteor-icons',
      ],
      sideEffects: false,
      exports: {},
      main: '',
      module: '',
      types: '',
      files: ['src'],
      engines: {
        node: '>=18',
      },
      peerDependencies: {},
    },

    entries: {
      core: {
        name: 'meteor-icons',
        exports: {
          '.': {
            default: './src/esm/index.js',
          },
          './icons': {
            default: './src/esm/icons.js',
          },
          './icons/*': {
            default: './src/esm/icons/*.js',
          },
          './browser': {
            default: './exports/icons.js',
          },
          './exports/*': './exports/*',
        },
        main: 'src/esm/index.js',
        module: 'src/esm/index.js',
        files: [
          'exports',
          'icons',
          'src',
        ],
      },

      astro: makeFrameworkEntry({
        name: '@meteor-icons/astro',
        ext: 'astro',
        indexExt: 'js',
        peer: 'astro',
        peerVersion: '>=4',
        overrides: {
          exports: {
            '.': {
              import: undefined,
              default: './src/index.js',
            },
            './icons/*': {
              import: undefined,
              default: './src/icons/*.astro',
            },
          },
        },
      }),

      preact: makeFrameworkEntry({
        name: '@meteor-icons/preact',
        ext: 'js',
        peer: 'preact',
        peerVersion: '>=10',
      }),

      react: makeFrameworkEntry({
        name: '@meteor-icons/react',
        ext: 'js',
        peer: 'react',
        peerVersion: '>=17',
      }),

      vue: makeFrameworkEntry({
        name: '@meteor-icons/vue',
        ext: 'js',
        peer: 'vue',
        peerVersion: '>=3',
      }),

      solid: makeFrameworkEntry({
        name: '@meteor-icons/solid',
        ext: 'jsx',
        peer: 'solid-js',
        peerVersion: '>=1.8',
      }),

      svelte: makeFrameworkEntry({
        name: '@meteor-icons/svelte',
        ext: 'svelte',
        indexExt: 'js',
        peer: 'svelte',
        peerVersion: '>=4',
        extraConditions: {
          svelte: './src/index.js',
        },
        overrides: {
          svelte: 'src/index.js',
          exports: {
            './icons/*': {
              svelte: './src/icons/*.svelte',
            },
          },
        },
      }),

      hamlet: {
        name: '@meteor-icons/hamlet',
        exports: {
          '.': {
            default: './index.js',
          },
        },
        main: 'index.js',
        module: 'index.js',
        files: ['index.js', 'lib'],
      },
    },
  },
}
