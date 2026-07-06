import process from 'node:process'
import { writePackageManifest } from './core/create-packages.js'
import config from './icons.config.js'

const PACKAGE_KEYS = ['core', 'astro', 'react', 'preact', 'vue', 'solid', 'svelte']

async function generatePackageManifests() {
  await Promise.all(
    PACKAGE_KEYS.map(async (key) => {
      await writePackageManifest(key, config.packages)
      console.warn(`package.json written: packages/${key}/package.json`)
    }),
  )

  console.warn(`Done — ${PACKAGE_KEYS.length} package.json files generated.`)
}

generatePackageManifests().catch((error) => {
  console.error('Error generating package manifests:', error.message)
  process.exit(1)
})
