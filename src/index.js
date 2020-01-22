import { createServer } from 'livereload'
import { resolve } from 'path'

// 0 Initial state
// 1 Starting server
// 2 Server is listening
// 3 Latest start was logged in console
let server
let state = 0

export default function livereload(options = { watch: '' }) {
  if (typeof options === 'string') {
    options = {
      watch: options
    }
  } else {
    options.watch = options.watch || ''
  }

  const verbose = options.verbose !== false
  const port = options.port || 35729
  const snippetSrc = options.clientUrl
    ? JSON.stringify(options.clientUrl)
    : `'//' + (window.location.host || 'localhost').split(':')[0] + ':${port}/livereload.js?snipver=1'`

  if (state === 0) {
    start()
  } else if (state === 1) {
    // Starting, just ignore
  } else if (state > 1) {
    server.close()
    start()
  }

  return {
    name: 'livereload',
    banner() {
      return `(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = ${snippetSrc}; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);`
    },
    generateBundle() {
      if (verbose && state === 2) {
        state = 3
        console.log(green('LiveReload enabled'))
      }
    }
  }

  function start() {
    state = 1
    server = createServer(options, () => {
      state = 2
    })

    // Start watching
    if (Array.isArray(options.watch)) {
      server.watch(options.watch.map(w => resolve(process.cwd(), w)))
    } else {
      server.watch(resolve(process.cwd(), options.watch))
    }
  }
}

function green(text) {
  return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m'
}

// Close server on termination
const terminationSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP']
terminationSignals.forEach(signal => {
  process.on(signal, () => {
    if (server) {
      server.close()
    }
  })
})
