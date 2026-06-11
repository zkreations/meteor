import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function getWorkspaceRoot(importMetaUrl) {
  const thisFile = fileURLToPath(importMetaUrl)
  const thisDir = dirname(thisFile)
  return resolve(thisDir, '../..')
}

export function toPosixPath(value) {
  return value.replace(/\\/g, '/')
}

export function getInstalledPackageVersion(workspaceRoot, packageName) {
  const packageJsonPath = resolve(workspaceRoot, 'node_modules', packageName, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

  if (!packageJson.version) {
    throw new Error(`No version found for installed package: ${packageName}`)
  }

  return packageJson.version
}

export function npmInstall(cwd) {
  execSync('npm install --no-audit --no-fund', {
    cwd,
    stdio: 'pipe',
  })
}

export function npmBuild(cwd) {
  execSync('npm run build', {
    cwd,
    stdio: 'pipe',
  })
}
