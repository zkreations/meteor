import fs from 'fs/promises'
import path from 'path'

export async function readIconFiles (dir, options = {}) {
  const {
    sort = defaultSort
  } = options

  const entries = await fs.readdir(dir, { withFileTypes: true })

  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.svg'))
    .map(entry => path.join(dir, entry.name))
    .sort(sort)
}

function defaultSort (a, b) {
  return path
    .basename(a)
    .localeCompare(path.basename(b), undefined, { sensitivity: 'base' })
}
