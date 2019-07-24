import { createServer } from 'livereload'
import { resolve } from 'path'

export default function livereload (options = { watch: '' }) {
  if (typeof options === 'string') {
    options = {
      watch: options
    }
  } else {
    options.watch = options.watch || ''
  }

  let enabled = options.verbose === false
  const port = options.port || 35729
  const clientUrl = options.clientUrl || ''
  const server = createServer(options)

  // Start watching
  if (Array.isArray(options.watch)) {
    server.watch(options.watch.map(w => resolve(process.cwd(), w)))
  } else {
    server.watch(resolve(process.cwd(), options.watch))
  }

  closeServerOnTermination(server)

  return {
    name: 'livereload',
    banner () {
      function inject (port, clientUrl) {
        if (!document.getElementById('livereload')) {
          const url = clientUrl || '//' + (window.location.host || 'localhost').split(':')[0] + ':' + port + '/livereload.js?snipver=1';
          const el = document.createElement('script')
          el.id = 'livereload'
          el.async = 1
          el.src = url
          document.head.appendChild(el)
        }
      }
      return (`(${inject.toString()})(${port}, '${clientUrl}');`)
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

function closeServerOnTermination (server) {
  const terminationSignals = ['SIGINT', 'SIGTERM']
  terminationSignals.forEach(signal => {
    process.on(signal, () => {
      server.close()
      process.exit()
    })
  })
}
