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

describe('hamlet package consumer smoke', () => {
  it('installs and builds in a real hamlet-builder project', { timeout: 180000 }, () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'meteoricons-hamlet-consumer-'))
    const srcDir = join(tempRoot, 'src')

    try {
      mkdirSync(srcDir, { recursive: true })

      const hamletPackagePath = resolve(workspaceRoot, 'packages/hamlet')
      const installedHamletVersion = getInstalledPackageVersion(workspaceRoot, 'hamlet-builder')

      const packageJson = {
        name: 'meteoricons-hamlet-consumer-smoke',
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          build: 'hamlet --mode production',
        },
        dependencies: {
          '@meteor-icons/hamlet': `file:${toPosixPath(hamletPackagePath)}`,
          'hamlet-builder': installedHamletVersion,
        },
      }

      writeFileSync(join(tempRoot, 'package.json'), JSON.stringify(packageJson, null, 2))

      writeFileSync(
        join(tempRoot, 'hamlet.config.js'),
        `import Meteor from '@meteor-icons/hamlet'\n\nexport default {\n  plugins: [\n    Meteor()\n  ]\n}\n`,
      )

      writeFileSync(
        join(srcDir, 'meteor.hbs'),
        [
          '<?xml version="1.0" encoding="UTF-8" ?>',
          '<!DOCTYPE html>',
          '<html>',
          '  <body>',
          '    {{> Meteor.includable}}',
          '    {{> Meteor.include icon="home"}}',
          '    {{> Meteor.svg icon="circle"}}',
          '    {{> Meteor.include icon="home" class="my-class" size="20" color="red" strokeWidth="2"}}',
          '    {{> Meteor.svg icon="circle" class="my-class" size="20" color="red" strokeWidth="2"}}',
          '  </body>',
          '</html>',
        ].join('\n'),
      )

      npmInstall(tempRoot)
      npmBuild(tempRoot)

      const distXml = join(tempRoot, 'dist', 'meteor.xml')
      expect(existsSync(distXml)).toBe(true)

      const output = readFileSync(distXml, 'utf8')

      expect(output).toContain('<b:includable id=\'@meteor\'>')
      expect(output).toContain('<b:switch var=\'data:icon\'>')
      expect(output).toContain('<b:case value=\'home\'/>')
      expect(output).toContain('<b:case value=\'circle\'/>')
      expect(output).toContain('<b:case value=\'alarm-clock\'/>')
      expect(output).toContain('<b:default/>')

      expect(output).toContain('<b:include name=\'@meteor\' data=\'{ icon: "home" }\'/>')

      expect(output).toContain('icon: "home", class: "my-class", size: "20", strokeWidth: "2", color: "red"')

      expect(output).toContain('class="i i-circle"')
      expect(output).toContain('stroke="currentColor"')
      expect(output).toContain('stroke-width="2"')
      expect(output).toContain('viewBox="0 0 24 24"')

      expect(output).toContain('stroke="red"')
      expect(output).toContain('width="20"')
      expect(output).toContain('height="20"')
      expect(output).toContain('class="i i-circle my-class"')
    }
    finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
