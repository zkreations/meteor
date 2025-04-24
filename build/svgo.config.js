export default {
  path: true,
  multipass: true,
  js2svg: {
    pretty: true,
    indent: 2
  },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          collapseGroups: true,
          convertPathData: {
            noSpaceAfterFlags: true
          }
        }
      }
    }
  ]
}
