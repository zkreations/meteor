import fs from 'node:fs/promises'

// Deep merge for plain objects
// @param {any} value - The value to check
// @returns {boolean} - True if the value is a plain object, false otherwise
function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

// Recursively merges two objects, with source properties taking precedence over target properties
// @param {object} target - The target object to merge into
// @param {object} source - The source object to merge from
// @returns {object} - A new object resulting from the deep merge of target and source
function deepMerge(target, source) {
  const output = { ...target }

  for (const key of Object.keys(source)) {
    const targetValue = output[key]
    const sourceValue = source[key]

    if (isObject(targetValue) && isObject(sourceValue)) {
      output[key] = deepMerge(targetValue, sourceValue)
      continue
    }

    output[key] = sourceValue
  }

  return output
}

// Builds exports map used by most framework packages
// @param {string} ext - File extension for the exports (e.g., 'js', 'astro')
// @param {string} [indexExt] - Optional extension for the main index file (defaults to `ext`)
// @param {object} [extraConditions] - Additional export conditions to include in the exports map
function makeExports(ext, indexExt = ext, extraConditions = {}) {
  return {
    '.': {
      types: './src/index.d.ts',
      ...extraConditions,
      import: `./src/index.${indexExt}`,
    },

    './icons/*': {
      types: './src/icons/*.d.ts',
      ...extraConditions,
      import: `./src/icons/*.${ext}`,
    },
  }
}

// Builds a standard framework package entry
// @param {string} options.name - Package name (e.g., '@meteor-icons/react')
// @param {string} options.ext - File extension for the exports (e.g., 'js', 'astro')
// @param {string} [options.indexExt] - Optional extension for the main index file (defaults to `ext`)
// @param {string} [options.peer] - Optional peer dependency name (e.g., 'react')
// @param {string} [options.peerVersion] - Optional peer dependency version range (e.g., '>=17')
// @param {object} [options.extraConditions] - Additional export conditions to include in the exports map
// @param {object} [options.overrides] - Optional overrides to merge into the final package configuration
export function makeFrameworkEntry({
  name,
  ext,
  indexExt,
  peer,
  peerVersion,
  extraConditions,
  overrides = {},
}) {
  const resolvedIndexExt = indexExt ?? ext

  const base = {
    name,
    exports: makeExports(ext, resolvedIndexExt, extraConditions),
    ...(peer && {
      peerDependencies: {
        [peer]: peerVersion,
      },
    }),
    main: `src/index.${resolvedIndexExt}`,
    module: `src/index.${resolvedIndexExt}`,
    types: 'src/index.d.ts',
  }

  return deepMerge(base, overrides)
}

// Builds a package.json object by merging defaults and a package entry
// @param {string} packageKey - Key in `packages.entries` (e.g., 'react')
// @param {object} packagesConfig - Object with `defaults` and `entries`
export function buildPackageManifest(packageKey, packagesConfig) {
  const defaults = packagesConfig?.defaults || {}
  const entry = packagesConfig?.entries?.[packageKey]

  if (!entry) {
    throw new Error(`Missing packages.entries.${packageKey} in icons.config.js`)
  }

  return deepMerge(defaults, entry)
}

// Writes package.json for one package implementation
// @param {string} packageKey - Key in `packages.entries` (e.g., 'react')
// @param {object} packagesConfig - Object with `defaults` and `entries`
export async function writePackageManifest(packageKey, packagesConfig) {
  const manifest = buildPackageManifest(packageKey, packagesConfig)
  const packageDirUrl = new URL(`../../packages/${packageKey}/`, import.meta.url)
  const packageJsonUrl = new URL('./package.json', packageDirUrl)

  await fs.mkdir(packageDirUrl, { recursive: true })
  await fs.writeFile(packageJsonUrl, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
}
