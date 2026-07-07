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

describe('vue package consumer smoke', () => {
  it('installs and builds in a real Vue consumer app', { timeout: 180000 }, () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'meteoricons-vue-consumer-'))
    const srcDir = join(tempRoot, 'src')

    try {
      mkdirSync(srcDir, { recursive: true })

      const meteorVuePath = toPosixPath(resolve(workspaceRoot, 'packages/vue'))
      const installedVueVersion = getInstalledPackageVersion(workspaceRoot, 'vue')

      const packageJson = {
        name: 'meteoricons-vue-consumer-smoke',
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          build: 'vite build',
        },
        dependencies: {
          '@meteor-icons/vue': `file:${meteorVuePath}`,
          'vue': installedVueVersion,
        },
        devDependencies: {
          vite: '^8.0.0',
        },
      }

      writeFileSync(join(tempRoot, 'package.json'), JSON.stringify(packageJson, null, 2))

      writeFileSync(
        join(tempRoot, 'index.html'),
        '<!doctype html><html><body><div id="app"></div><script type="module" src="/src/main.js"></script></body></html>',
      )

      writeFileSync(
        join(tempRoot, 'vite.config.js'),
        'import { defineConfig } from \'vite\'\n\nexport default defineConfig({})\n',
      )

      writeFileSync(
        join(srcDir, 'App.js'),
        'import { h } from \'vue\'\nimport { AlarmClock, ArrowRight } from \'@meteor-icons/vue\'\nimport AlarmClockByPath from \'@meteor-icons/vue/icons/alarm-clock\'\n\nexport default {\n  name: \'App\',\n  render () {\n    return h(\'main\', {}, [\n      h(AlarmClock, { size: 32, strokeWidth: 1.25, \'data-testid\': \'named-export\' }),\n      h(ArrowRight, { size: 28, color: \'tomato\', \'data-testid\': \'second-icon\' }),\n      h(AlarmClockByPath, { size: 24, \'data-testid\': \'subpath-export\' })\n    ])\n  }\n}\n',
      )

      writeFileSync(
        join(srcDir, 'main.js'),
        'import { createApp } from \'vue\'\nimport App from \'./App\'\n\ncreateApp(App).mount(\'#app\')\n',
      )

      npmInstall(tempRoot)
      npmBuild(tempRoot)

      const distIndex = join(tempRoot, 'dist/index.html')
      expect(existsSync(distIndex)).toBe(true)

      const indexContent = readFileSync(distIndex, 'utf8')
      expect(indexContent.includes('/assets/')).toBe(true)
    }
    finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
