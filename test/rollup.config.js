import serve from 'rollup-plugin-serve'
import livereload from '../src/index.js'

export default {
  input: 'entry.js',
  output: {
    file: 'dest.js',
    format: 'cjs',
  },
  plugins: [
    serve({
      contentBase: '',
      port: Math.round(Math.random() * 10000) + 40000,
      open: true, // Launch in browser (default: false)
      verbose: true, // Show server address in console (default: true)
      historyApiFallback: false, // Set to true to return index.html (200) instead of error page (404)
      historyApiFallback: '/200.html', // Path to fallback page
      host: 'localhost', // Options used in setting up server
      mimeTypes: {
        // set custom mime types, usage https://github.com/broofa/mime#mimedefinetypemap-force--false
        'application/javascript': ['js'],
      },
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Access-Control-Allow-Origin': '*',
      },
    }),
    livereload({
      headers: {
        // 'Cross-Origin-Opener-Policy': 'same-origin',
        // 'Cross-Origin-Embedder-Policy': 'require-corp',
        // 'Cross-Origin-Resource-Policy': 'cross-origin',
        'Access-Control-Allow-Origin': '*',
      },
    }),
  ],
}
