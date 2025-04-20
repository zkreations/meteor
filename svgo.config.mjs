export default {
  path: true,
  multipass: true,
  js2svg: {
    pretty: true,
    indent: 2
  },
  plugins: [
    'mergePaths',
    'cleanupListOfValues',
    'removeDimensions',
    'removeUnusedNS',
    'removeXMLNS'
  ]
}
