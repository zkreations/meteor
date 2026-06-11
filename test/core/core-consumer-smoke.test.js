import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getWorkspaceRoot, npmBuild, npmInstall, toPosixPath } from '../smoke-utils.js'

describe('core consumer smoke', () => {
  it('installs meteor-icons and can consume exported files', () => {
    const workspaceRoot = getWorkspaceRoot(import.meta.url)
    const corePackagePath = resolve(workspaceRoot, 'packages/core')
    const tempDir = mkdtempSync(resolve(tmpdir(), 'meteoricons-core-consumer-'))

    try {
      writeFileSync(
        resolve(tempDir, 'package.json'),
        JSON.stringify({
          name: 'core-consumer-smoke',
          private: true,
          type: 'module',
          scripts: {
            build: 'node build.mjs',
          },
          dependencies: {
            'meteor-icons': `file:${toPosixPath(corePackagePath)}`,
          },
        }, null, 2),
      )

      writeFileSync(
        resolve(tempDir, 'build.mjs'),
        `import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const pkgRoot = resolve(process.cwd(), 'node_modules/meteor-icons')
const exportsRoot = resolve(pkgRoot, 'exports')
const iconsRoot = resolve(pkgRoot, 'icons')

for (const file of ['icons.json', 'icons.svg', 'icons.xml']) {
  const filePath = resolve(exportsRoot, file)
  if (!existsSync(filePath)) {
    throw new Error('Missing export file: ' + file)
  }
}

for (const icon of ['alarm-clock.svg', 'arrow-right.svg', 'github.svg']) {
  const filePath = resolve(iconsRoot, icon)
  if (!existsSync(filePath)) {
    throw new Error('Missing icon file: ' + icon)
  }
}

const iconsJson = JSON.parse(readFileSync(resolve(exportsRoot, 'icons.json'), 'utf8'))
if (!iconsJson['alarm-clock'] || !iconsJson['github']) {
  throw new Error('icons.json missing expected keys')
}

const sprite = readFileSync(resolve(exportsRoot, 'icons.svg'), 'utf8')
if (!sprite.includes('id="alarm-clock"') || !sprite.includes('id="github"')) {
  throw new Error('icons.svg missing expected symbols')
}

const includable = readFileSync(resolve(exportsRoot, 'icons.xml'), 'utf8')
if (!includable.includes("<b:includable id='@meteor'>")) {
  throw new Error('icons.xml missing includable root')
}
`,
      )

      npmInstall(tempDir)
      npmBuild(tempDir)
    }
    finally {
      rmSync(tempDir, { recursive: true, force: true })
    }

    expect(true).toBe(true)
  })
})
