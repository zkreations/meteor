import { describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const thisFile = fileURLToPath(import.meta.url)
const thisDir = dirname(thisFile)
const workspaceRoot = resolve(thisDir, '../..')

function toPosixPath (value) {
  return value.replace(/\\/g, '/')
}

function npmInstall (cwd) {
  execSync('npm install --no-audit --no-fund', {
    cwd,
    stdio: 'pipe'
  })
}

function npmBuild (cwd) {
  execSync('npm run build', {
    cwd,
    stdio: 'pipe'
  })
}

describe('preact package consumer smoke', () => {
  it('installs and builds in a real Preact consumer app', { timeout: 180000 }, () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'meteoricons-preact-consumer-'))
    const srcDir = join(tempRoot, 'src')

    try {
      mkdirSync(srcDir, { recursive: true })

      const vitePath = toPosixPath(resolve(workspaceRoot, 'node_modules/vite'))
      const meteorPreactPath = toPosixPath(resolve(workspaceRoot, 'packages/preact'))

      const packageJson = {
        name: 'meteoricons-preact-consumer-smoke',
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          build: 'vite build'
        },
        dependencies: {
          '@meteor-icons/preact': `file:${meteorPreactPath}`,
          preact: '^10.27.2'
        },
        devDependencies: {
          vite: `file:${vitePath}`
        }
      }

      writeFileSync(join(tempRoot, 'package.json'), JSON.stringify(packageJson, null, 2))

      writeFileSync(
        join(tempRoot, 'index.html'),
        '<!doctype html><html><body><div id="app"></div><script type="module" src="/src/main.js"></script></body></html>'
      )

      writeFileSync(
        join(tempRoot, 'vite.config.js'),
        "import { defineConfig } from 'vite'\n\nexport default defineConfig({})\n"
      )

      writeFileSync(
        join(srcDir, 'App.js'),
        "import { h } from 'preact'\nimport { AlarmClock, ArrowRight } from '@meteor-icons/preact'\nimport AlarmClockByPath from '@meteor-icons/preact/icons/alarm-clock'\n\nexport default function App () {\n  return h('main', {}, [\n    h(AlarmClock, { size: 32, strokeWidth: 1.25, 'data-testid': 'named-export', key: 'a' }),\n    h(ArrowRight, { size: 28, color: 'tomato', 'data-testid': 'second-icon', key: 'b' }),\n    h(AlarmClockByPath, { size: 24, 'data-testid': 'subpath-export', key: 'c' })\n  ])\n}\n"
      )

      writeFileSync(
        join(srcDir, 'main.js'),
        "import { h, render } from 'preact'\nimport App from './App'\n\nrender(h(App, {}), document.getElementById('app'))\n"
      )

      npmInstall(tempRoot)
      npmBuild(tempRoot)

      const distIndex = join(tempRoot, 'dist/index.html')
      expect(existsSync(distIndex)).toBe(true)

      const indexContent = readFileSync(distIndex, 'utf8')
      expect(indexContent.includes('/assets/')).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
