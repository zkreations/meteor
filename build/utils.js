import fs from 'fs/promises'
import path from 'path'

// @param {string} dir - Icons directory
// @param {Object} [options]
// @param {(a: string, b: string) => number} [options.sort]
// @returns {Promise<string[]>}
export async function readIcons (dir, options = {}) {
  const {
    sort = defaultSort
  } = options

  const entries = await fs.readdir(dir, { withFileTypes: true })

  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.svg'))
    .map(entry => path.join(dir, entry.name))
    .sort(sort)
}

// Default alphabetical sort (case-insensitive)
// @param {string} a - File path A
// @param {string} b - File path B
// @returns {number}
function defaultSort (a, b) {
  return path
    .basename(a)
    .localeCompare(path.basename(b), undefined, { sensitivity: 'base' })
}
