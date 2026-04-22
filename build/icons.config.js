import path from 'path'
import { fileURLToPath } from 'url'
import { makeFrameworkEntry } from './core/create-packages.js'

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
    class: '',
    viewBox: '0 0 24 24',
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  },

  packages: {
    defaults: {
      name: 'meteor-icons',
      version: '4.0.0',
      description: 'Meteor is an open-source icon set with ultra-lightweight, performance-focused code, crafted through human reasoning.',
      private: false,
      type: 'module',
      homepage: 'https://meteoricons.com',
      repository: {
        type: 'git',
        url: 'git+https://github.com/zkreations/icons.git'
      },
      keywords: [
        'icons',
        'svg',
        'icon-library',
        'meteor-icons'
      ],
      author: 'Abel Moreira <daniel@zkreations.com>',
      license: 'MIT',
      bugs: { url: 'https://github.com/zkreations/icons/issues' },
      files: ['src'],
      scripts: { prepack: 'npm --prefix ../.. run build' },
      engines: { node: '>=18' },
      sideEffects: false
    },

    entries: {
      core: {
        name: 'meteor-icons',
        files: [
          'icons',
          'exports',
          'src'
        ],
        main: 'src/esm/index.js',
        module: 'src/esm/index.js',
        exports: {
          '.': {
            default: './src/esm/index.js'
          },
          './icons': {
            default: './src/esm/icons.js'
          },
          './icons/*': {
            default: './src/esm/icons/*.js'
          },
          './browser': {
            default: './exports/icons.js'
          },
          './exports/*': './exports/*'
        }
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
              default: './src/index.js'
            },
            './icons/*': {
              import: undefined,
              default: './src/icons/*.astro'
            }
          }
        }
      }),

      preact: makeFrameworkEntry({
        name: '@meteor-icons/preact',
        ext: 'js',
        peer: 'preact',
        peerVersion: '>=10'
      }),

      react: makeFrameworkEntry({
        name: '@meteor-icons/react',
        ext: 'js',
        peer: 'react',
        peerVersion: '>=17'
      }),

      vue: makeFrameworkEntry({
        name: '@meteor-icons/vue',
        ext: 'js',
        peer: 'vue',
        peerVersion: '>=3'
      }),

      solid: makeFrameworkEntry({
        name: '@meteor-icons/solid',
        ext: 'jsx',
        peer: 'solid-js',
        peerVersion: '>=1.8'
      }),

      svelte: makeFrameworkEntry({
        name: '@meteor-icons/svelte',
        ext: 'svelte',
        indexExt: 'js',
        peer: 'svelte',
        peerVersion: '>=4',
        extraConditions: {
          svelte: './src/index.js'
        },
        overrides: {
          svelte: 'src/index.js',
          exports: {
            './icons/*': {
              svelte: './src/icons/*.svelte'
            }
          }
        }
      })
    }
  }
}
