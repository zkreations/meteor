import path from 'path'
import { fileURLToPath } from 'url'

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
  }
}
