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

describe('svelte package consumer smoke', () => {
  it('installs and builds in a real Svelte consumer app', { timeout: 180000 }, () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'meteoricons-svelte-consumer-'))
    const srcDir = join(tempRoot, 'src')

    try {
      mkdirSync(srcDir, { recursive: true })

      const vitePath = toPosixPath(resolve(workspaceRoot, 'node_modules/vite'))
      const meteorSveltePath = toPosixPath(resolve(workspaceRoot, 'packages/svelte'))
      const installedSvelteVersion = getInstalledPackageVersion(workspaceRoot, 'svelte')
      const installedSveltePluginVersion = getInstalledPackageVersion(workspaceRoot, '@sveltejs/vite-plugin-svelte')

      const packageJson = {
        name: 'meteoricons-svelte-consumer-smoke',
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          build: 'vite build',
        },
        dependencies: {
          '@meteor-icons/svelte': `file:${meteorSveltePath}`,
          'svelte': installedSvelteVersion,
        },
        devDependencies: {
          'vite': `file:${vitePath}`,
          '@sveltejs/vite-plugin-svelte': installedSveltePluginVersion,
        },
      }

      writeFileSync(join(tempRoot, 'package.json'), JSON.stringify(packageJson, null, 2))

      writeFileSync(
        join(tempRoot, 'index.html'),
        '<!doctype html><html><body><div id="app"></div><script type="module" src="/src/main.js"></script></body></html>',
      )

      writeFileSync(
        join(tempRoot, 'vite.config.js'),
        'import { defineConfig } from \'vite\'\nimport { svelte } from \'@sveltejs/vite-plugin-svelte\'\n\nexport default defineConfig({ plugins: [svelte()] })\n',
      )

      writeFileSync(
        join(srcDir, 'App.svelte'),
        '<script>\n  import { AlarmClock, ArrowRight } from \'@meteor-icons/svelte\'\n  import AlarmClockByPath from \'@meteor-icons/svelte/icons/alarm-clock\'\n</script>\n\n<main>\n  <AlarmClock size={32} strokeWidth={1.25} data-testid=\'named-export\' />\n  <ArrowRight size={28} color=\'tomato\' data-testid=\'second-icon\' />\n  <AlarmClockByPath size={24} data-testid=\'subpath-export\' />\n</main>\n',
      )

      writeFileSync(
        join(srcDir, 'main.js'),
        'import * as Svelte from \'svelte\'\nimport App from \'./App.svelte\'\n\nconst target = document.getElementById(\'app\')\n\nif (typeof Svelte.mount === \'function\') {\n  Svelte.mount(App, { target })\n} else {\n  new App({ target })\n}\n',
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
