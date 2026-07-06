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

describe('solid package consumer smoke', () => {
  it('installs and builds in a real Solid consumer app', { timeout: 180000 }, () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'meteoricons-solid-consumer-'))
    const srcDir = join(tempRoot, 'src')

    try {
      mkdirSync(srcDir, { recursive: true })

      const meteorSolidPath = toPosixPath(resolve(workspaceRoot, 'packages/solid'))
      const installedSolidVersion = getInstalledPackageVersion(workspaceRoot, 'solid-js')
      const installedSolidPluginVersion = getInstalledPackageVersion(workspaceRoot, 'vite-plugin-solid')

      const packageJson = {
        name: 'meteoricons-solid-consumer-smoke',
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          build: 'vite build',
        },
        dependencies: {
          '@meteor-icons/solid': `file:${meteorSolidPath}`,
          'solid-js': installedSolidVersion,
        },
        devDependencies: {
          'vite': '^8.0.0',
          'vite-plugin-solid': installedSolidPluginVersion,
        },
      }

      writeFileSync(join(tempRoot, 'package.json'), JSON.stringify(packageJson, null, 2))

      writeFileSync(
        join(tempRoot, 'index.html'),
        '<!doctype html><html><body><div id="app"></div><script type="module" src="/src/main.jsx"></script></body></html>',
      )

      writeFileSync(
        join(tempRoot, 'vite.config.js'),
        'import { defineConfig } from \'vite\'\nimport solid from \'vite-plugin-solid\'\n\nexport default defineConfig({ plugins: [solid()] })\n',
      )

      writeFileSync(
        join(srcDir, 'App.jsx'),
        'import { AlarmClock, ArrowRight } from \'@meteor-icons/solid\'\nimport AlarmClockByPath from \'@meteor-icons/solid/icons/alarm-clock\'\n\nexport default function App () {\n  return (\n    <main>\n      <AlarmClock size={32} strokeWidth={1.25} data-testid="named-export" />\n      <ArrowRight size={28} color="tomato" data-testid="second-icon" />\n      <AlarmClockByPath size={24} data-testid="subpath-export" />\n    </main>\n  )\n}\n',
      )

      writeFileSync(
        join(srcDir, 'main.jsx'),
        'import { render } from \'solid-js/web\'\nimport App from \'./App\'\n\nrender(() => <App />, document.getElementById(\'app\'))\n',
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
