import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  getInstalledPackageVersion,
  getWorkspaceRoot,
  npmBuild,
  npmInstall,
  toPosixPath,
} from '../smoke-utils.js'

const workspaceRoot = getWorkspaceRoot(import.meta.url)

describe('astro package consumer smoke', () => {
  it('installs and builds in a real Astro consumer app', { timeout: 180000 }, () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'meteoricons-astro-consumer-'))
    const pagesDir = join(tempRoot, 'src', 'pages')

    try {
      mkdirSync(pagesDir, { recursive: true })

      const meteorAstroPath = toPosixPath(resolve(workspaceRoot, 'packages/astro'))
      const installedAstroVersion = getInstalledPackageVersion(workspaceRoot, 'astro')

      const packageJson = {
        name: 'meteoricons-astro-consumer-smoke',
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          build: 'astro build',
        },
        dependencies: {
          '@meteor-icons/astro': `file:${meteorAstroPath}`,
          'astro': installedAstroVersion,
        },
      }

      writeFileSync(join(tempRoot, 'package.json'), JSON.stringify(packageJson, null, 2))

      writeFileSync(
        join(tempRoot, 'astro.config.mjs'),
        'import { defineConfig } from \'astro/config\'\n\nexport default defineConfig({})\n',
      )

      writeFileSync(
        join(pagesDir, 'index.astro'),
        '---\nimport { AlarmClock, ArrowRight } from \'@meteor-icons/astro\'\nimport AlarmClockByPath from \'@meteor-icons/astro/icons/alarm-clock\'\n---\n\n<main>\n  <AlarmClock size={32} strokeWidth={1.25} data-testid=\'named-export\' />\n  <ArrowRight size={28} color=\'tomato\' data-testid=\'second-icon\' />\n  <AlarmClockByPath size={24} data-testid=\'subpath-export\' />\n</main>\n',
      )

      npmInstall(tempRoot)
      npmBuild(tempRoot)

      const distIndex = join(tempRoot, 'dist/index.html')
      expect(existsSync(distIndex)).toBe(true)

      const indexContent = readFileSync(distIndex, 'utf8')
      expect(indexContent).toContain('i i-alarm-clock')
      expect(indexContent).toContain('i i-arrow-right')
    }
    finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
