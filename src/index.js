import { createServer } from 'livereload'
import { resolve } from 'path'

export default function livereload (options = { watch: '' }) {
  if (typeof options === 'string') {
    options = {
      watch: options
    }
  }

  const port = options.port || 35729
  const server = createServer(options)
  server.watch(resolve(process.cwd(), options.watch))

  var enabled = false

  return {
    name: 'livereload',
    banner () {
      return `(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':${port}/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');`
    },
    ongenerate () {
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
