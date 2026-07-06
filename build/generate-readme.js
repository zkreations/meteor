import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { buildReadme, PACKAGE_README_CONFIGS } from './core/create-readme.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PACKAGES_DIR = path.resolve(__dirname, '../packages')

async function generateReadmes() {
  const entries = Object.entries(PACKAGE_README_CONFIGS)

  await Promise.all(
    entries.map(async ([key, config]) => {
      const content = buildReadme({ ...config, packageName: key })
      const outputPath = path.join(PACKAGES_DIR, key, 'README.md')
      await fs.writeFile(outputPath, content, 'utf8')
      console.warn(`README written: packages/${key}/README.md`)
    }),
  )

  console.warn(`Done — ${entries.length} READMEs generated.`)
}

generateReadmes().catch((error) => {
  console.error('Error generating READMEs:', error.message)
  process.exit(1)
})
