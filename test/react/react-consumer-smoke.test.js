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

describe('react package consumer smoke', () => {
  it('installs and builds in a real React consumer app', { timeout: 180000 }, () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'meteoricons-react-consumer-'))
    const srcDir = join(tempRoot, 'src')

    try {
      mkdirSync(srcDir, { recursive: true })

      const meteorReactPath = toPosixPath(resolve(workspaceRoot, 'packages/react'))
      const installedReactVersion = getInstalledPackageVersion(workspaceRoot, 'react')
      const installedReactDomVersion = getInstalledPackageVersion(workspaceRoot, 'react-dom')

      const packageJson = {
        name: 'meteoricons-react-consumer-smoke',
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          build: 'vite build',
        },
        dependencies: {
          '@meteor-icons/react': `file:${meteorReactPath}`,
          'react': installedReactVersion,
          'react-dom': installedReactDomVersion,
        },
        devDependencies: {
          vite: '^8.0.0',
        },
      }

      writeFileSync(join(tempRoot, 'package.json'), JSON.stringify(packageJson, null, 2))

      writeFileSync(
        join(tempRoot, 'index.html'),
        '<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>',
      )

      writeFileSync(
        join(tempRoot, 'vite.config.js'),
        'import { defineConfig } from \'vite\'\n\nexport default defineConfig({})\n',
      )

      writeFileSync(
        join(srcDir, 'App.jsx'),
        'import React from \'react\'\nimport { AlarmClock, ArrowRight } from \'@meteor-icons/react\'\nimport AlarmClockByPath from \'@meteor-icons/react/icons/alarm-clock\'\n\nexport default function App () {\n  return (\n    <main>\n      <AlarmClock size={32} stroke={1.25} data-testid="named-export" />\n      <ArrowRight size={28} color="tomato" data-testid="second-icon" />\n      <AlarmClockByPath size={24} data-testid="subpath-export" />\n    </main>\n  )\n}\n',
      )

      writeFileSync(
        join(srcDir, 'main.jsx'),
        'import React from \'react\'\nimport ReactDOM from \'react-dom/client\'\nimport App from \'./App\'\n\nReactDOM.createRoot(document.getElementById(\'root\')).render(<App />)\n',
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
