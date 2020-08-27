import serve from 'rollup-plugin-serve'
import live from '../src/index.js'

export default {
  input: 'entry.js',
  output: {
    file: 'dest.js',
    format: 'cjs',
  },
  plugins: [
    serve({ contentBase: '', port: Math.round(Math.random() * 10000) + 40000 }),
    live(),
  ],
}
