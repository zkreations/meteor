import fs from 'fs/promises'
import path from 'path'
import {
  buildNamedExportsIndex,
  getSortedIconNames,
  jsLiteral,
  readIconMap,
  resetDir,
  toPascalCase
} from './core/framework-utils.js'

const ROOT_DIR = new URL('..', import.meta.url)
const CORE_ESM_DIR = new URL('../packages/core/src/esm/', import.meta.url)
const CORE_ESM_ICONS_DIR = new URL('../packages/core/src/esm/icons/', import.meta.url)
const CORE_EXPORTS_DIR = new URL('../packages/core/exports/', import.meta.url)

function buildIconModuleSource (nodes) {
  const iconNodeLiteral = jsLiteral(nodes)

  return `const iconNode = ${iconNodeLiteral}\n\nexport default iconNode\n`
}

function buildIconsMapModuleSource (iconNames) {
  const imports = iconNames.map((iconName) => {
    const exportName = `${toPascalCase(iconName)}IconNode`
    return `import ${exportName} from './icons/${iconName}.js'`
  })

  const mapEntries = iconNames.map((iconName) => {
    const exportName = `${toPascalCase(iconName)}IconNode`
    return `  '${iconName}': ${exportName}`
  })

  return `${imports.join('\n')}\n\nexport const icons = {\n${mapEntries.join(',\n')}\n}\n`
}

function buildEsmIndexSource (iconNames) {
  const namedExports = buildNamedExportsIndex(iconNames, 'js').trimEnd()

  return `import { icons } from './icons.js'\n\nconst SVG_NS = 'http://www.w3.org/2000/svg'\n\nconst DEFAULT_ATTRS = {\n  width: 24,\n  height: 24,\n  viewBox: '0 0 24 24',\n  fill: 'none',\n  stroke: 'currentColor',\n  'stroke-width': 2,\n  'stroke-linecap': 'round',\n  'stroke-linejoin': 'round'\n}\n\nfunction toKebabCase (value) {\n  return String(value)\n    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')\n    .replace(/_/g, '-')\n    .toLowerCase()\n}\n\nfunction getIconNodes (value) {\n  if (Array.isArray(value)) {\n    return value\n  }\n\n  if (value && Array.isArray(value.nodes)) {\n    return value.nodes\n  }\n\n  return null\n}\n\nfunction normalizeIcons (input) {\n  const normalized = {}\n\n  for (const [name, iconData] of Object.entries(input || {})) {\n    const nodes = getIconNodes(iconData)\n\n    if (!nodes) {\n      continue\n    }\n\n    const normalizedName = name.includes('-') ? name : toKebabCase(name)\n    normalized[normalizedName] = nodes\n  }\n\n  return normalized\n}\n\nfunction createNode (node) {\n  const element = document.createElementNS(SVG_NS, node.tag)\n\n  for (const [attr, value] of Object.entries(node.attrs || {})) {\n    element.setAttribute(attr, String(value))\n  }\n\n  for (const childNode of node.children || []) {\n    element.appendChild(createNode(childNode))\n  }\n\n  return element\n}\n\nfunction createSvgElement (iconName, nodes, attrs, elementAttrs) {\n  const svg = document.createElementNS(SVG_NS, 'svg')\n  const merged = { ...DEFAULT_ATTRS, ...(attrs || {}), ...elementAttrs }\n  const extraClassName = [attrs?.class, elementAttrs.class].filter(Boolean).join(' ')\n  const className = extraClassName ? 'i i-' + iconName + ' ' + extraClassName : 'i i-' + iconName\n\n  delete merged.class\n\n  for (const [attr, value] of Object.entries(merged)) {\n    svg.setAttribute(attr, String(value))\n  }\n\n  svg.setAttribute('class', className)\n\n  for (const node of nodes) {\n    svg.appendChild(createNode(node))\n  }\n\n  return svg\n}\n\nexport function createIcons (options = {}) {\n  const {\n    icons: iconSet,\n    nameAttr = 'data-i',\n    attrs = {},\n    root = document\n  } = options\n\n  const iconMap = normalizeIcons(iconSet || icons)\n  const nodes = root.querySelectorAll('[' + nameAttr + ']')\n\n  for (const node of nodes) {\n    const iconName = node.getAttribute(nameAttr)\n    const iconNodes = iconMap[iconName]\n\n    if (!iconNodes) {\n      continue\n    }\n\n    const inheritedAttrs = {}\n\n    for (const attr of Array.from(node.attributes)) {\n      if (attr.name !== nameAttr) {\n        inheritedAttrs[attr.name] = attr.value\n      }\n    }\n\n    const svg = createSvgElement(iconName, iconNodes, attrs, inheritedAttrs)\n    node.replaceWith(svg)\n  }\n}\n\n${namedExports}\n\nexport { icons }\n`
}

function buildBrowserBundleSource (icons) {
  const iconsLiteral = JSON.stringify(icons)

  return `(function(){const SVG_NS='http://www.w3.org/2000/svg';const DEFAULT_ATTRS={width:24,height:24,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'};const icons=${iconsLiteral};function toKebabCase(value){return String(value).replace(/([a-z0-9])([A-Z])/g,'$1-$2').replace(/_/g,'-').toLowerCase()}function getIconNodes(value){if(Array.isArray(value))return value;if(value&&Array.isArray(value.nodes))return value.nodes;return null}function normalizeIcons(input){const normalized={};for(const[name,iconData]of Object.entries(input||{})){const nodes=getIconNodes(iconData);if(!nodes)continue;const normalizedName=name.includes('-')?name:toKebabCase(name);normalized[normalizedName]=nodes}return normalized}function createNode(node){const element=document.createElementNS(SVG_NS,node.tag);for(const[attr,value]of Object.entries(node.attrs||{})){element.setAttribute(attr,String(value))}for(const childNode of node.children||[]){element.appendChild(createNode(childNode))}return element}function createSvgElement(iconName,nodes,attrs,elementAttrs){const svg=document.createElementNS(SVG_NS,'svg');const merged={...DEFAULT_ATTRS,...(attrs||{}),...elementAttrs};const extraClassName=[attrs&&attrs.class,elementAttrs.class].filter(Boolean).join(' ');const className=extraClassName?'i i-'+iconName+' '+extraClassName:'i i-'+iconName;delete merged.class;for(const[attr,value]of Object.entries(merged)){svg.setAttribute(attr,String(value))}svg.setAttribute('class',className);for(const node of nodes){svg.appendChild(createNode(node))}return svg}function createIcons(options){const opts=options||{};const iconSource=opts.icons||icons;const iconMap=normalizeIcons(iconSource);const nameAttr=opts.nameAttr||'data-i';const attrs=opts.attrs||{};const root=opts.root||document;const nodes=root.querySelectorAll('['+nameAttr+']');for(const node of nodes){const iconName=node.getAttribute(nameAttr);const iconNodes=iconMap[iconName];if(!iconNodes)continue;const inheritedAttrs={};for(const attr of Array.from(node.attributes)){if(attr.name!==nameAttr){inheritedAttrs[attr.name]=attr.value}}const svg=createSvgElement(iconName,iconNodes,attrs,inheritedAttrs);node.replaceWith(svg)}}const api={createIcons,icons};if(typeof globalThis!=='undefined'){globalThis.meteorIcons=api}})();`
}

async function generateVanillaPackage () {
  const iconMap = await readIconMap()
  const iconNames = getSortedIconNames(iconMap)

  await fs.mkdir(CORE_ESM_DIR, { recursive: true })
  await resetDir(CORE_ESM_ICONS_DIR)

  for (const iconName of iconNames) {
    const nodes = iconMap[iconName]?.nodes || []

    await fs.writeFile(
      new URL(`./${iconName}.js`, CORE_ESM_ICONS_DIR),
      buildIconModuleSource(nodes),
      'utf8'
    )
  }

  await fs.writeFile(new URL('./icons.js', CORE_ESM_DIR), buildIconsMapModuleSource(iconNames), 'utf8')
  await fs.writeFile(new URL('./index.js', CORE_ESM_DIR), buildEsmIndexSource(iconNames), 'utf8')
  await fs.writeFile(new URL('./icons.js', CORE_EXPORTS_DIR), buildBrowserBundleSource(iconMap), 'utf8')

  const rootPath = path.normalize(ROOT_DIR.pathname)
  console.log(`Vanilla core package generated (${iconNames.length} icons) at ${rootPath}`)
}

generateVanillaPackage().catch((error) => {
  console.error('Error generating vanilla core package:', error.message)
  process.exit(1)
})
