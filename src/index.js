import { createServer } from 'livereload'
import { resolve } from 'path'

let server

export default function livereload(options = { watch: '' }) {
  if (typeof options === 'string') {
    options = {
      watch: options
    }
  } else {
    options.watch = options.watch || ''
  }

  // release previous server instance if rollup is reloading configuration
  // in watch mode
  if (server) {
    server.close()
    server = null
  }

  let enabled = options.verbose === false
  const port = options.port || 35729
  const snippetSrc = options.clientUrl ? JSON.stringify(options.clientUrl) : `'//' + (window.location.host || 'localhost').split(':')[0] + ':${port}/livereload.js?snipver=1'`

  server = createServer(options)

  // Start watching
  if (Array.isArray(options.watch)) {
    server.watch(options.watch.map(w => resolve(process.cwd(), w)))
  } else {
    server.watch(resolve(process.cwd(), options.watch))
  }

  return {
    name: 'livereload',
    banner() {
      return `(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = ${snippetSrc}; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);`
    },
    generateBundle () {
      if (!enabled) {
        enabled = true
        console.log(green('LiveReload enabled'))
      }
    }
  }
}

function green (text) {
  return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m'
}
