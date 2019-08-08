import { createServer } from 'livereload'
import { resolve } from 'path'
import { check as checkPort, find as findPort } from 'port-authority'

export default function livereload(options = { watch: '' }) {
  if (typeof options === 'string') {
    options = {
      watch: options
    }
  } else {
    options.watch = options.watch || ''
  }

  var enabled = options.verbose === false

  const availablePortPromise = getAvailablePort(options.port || 35729)

  availablePortPromise.then(
    availablePort => {
      const server = createServer({
        ...options,
        port: availablePort,
      })

      // Start watching
      if (Array.isArray(options.watch)) {
        server.watch(options.watch.map(w => resolve(process.cwd(), w)))
      } else {
        server.watch(resolve(process.cwd(), options.watch))
      }

      closeServerOnTermination(server)
    }
  )

  return {
    name: 'livereload',
    banner() {
      return availablePortPromise.then(
        availablePort => `(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':${ availablePort }/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');`
      )
    },
    generateBundle() {
      availablePortPromise.then(
        availablePort => {
          if (!enabled) {
            enabled = true

            let message = green(`LiveReload enabled on port ${ availablePort }.`)

            if (options.hasOwnProperty('port') && parseInt(options.port) !== availablePort) {
              message += yellow(`  (Port ${ options.port } was unavailable.)`)
            }

            console.log(message)
          }
        }
      )
    }
  }
}

function getConsoleColorWrapper(consoleColorCode) {
  return (text) => `\u001b[1m\u001b[${ consoleColorCode }m${ text }\u001b[39m\u001b[22m`
}

const green = getConsoleColorWrapper(32)
const yellow = getConsoleColorWrapper(33)

function getAvailablePort(preferredPort) {
  return checkPort(preferredPort).then(
    preferredPortIsAvailable => {
      if (preferredPortIsAvailable) {
        return preferredPort
      } else {
        // The IANA stops registering ports at 49152.
        // https://tools.ietf.org/html/rfc6335
        return findPort(50000)
      }
    }
  )
}

function closeServerOnTermination(server) {
  const terminationSignals = ['SIGINT', 'SIGTERM']
  terminationSignals.forEach(signal => {
    process.on(signal, () => {
      server.close()
      process.exit()
    })
  })
}
