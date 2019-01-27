import buble from 'rollup-plugin-buble'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/index.es.js',
      format: 'es'
    }
  ],
  external: ['livereload', 'path'],
  plugins: [buble()]
}
