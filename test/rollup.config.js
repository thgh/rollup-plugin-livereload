import serve from 'rollup-plugin-serve'
import live from '..'

export default {
  input: 'entry.js',
  output: {
    file: 'dest.js',
    format: 'cjs'
  },
  plugins: [
    serve(),
    live(),
  ],
  watch: {
    clearScreen: false
  },
}
