import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

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
  plugins: [
    resolve(),
    commonjs(),
    buble()
  ]
};
