import { builtinModules } from 'module'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'default',
    },
    {
      file: 'dist/index.es.js',
      format: 'es',
    },
  ],
  external: ['livereload'].concat(builtinModules),
  plugins: [resolve()],
}
