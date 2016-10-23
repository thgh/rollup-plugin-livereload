import { createServer } from 'livereload'
import { resolve } from 'path'

let opts = { consoleLogMsg: true }

export default function livereload (options = { watch: '' }) {
  if (typeof options === 'string') {
    options = Object.assign(opts, { watch: options });
  }

  const port = options.port || 35729
  const server = createServer(options)
  server.watch(resolve(process.cwd(), options.watch))

  opts = Object.assign(opts, options)

  return {
    name: 'livereload',
    banner: `document.write('<script src="http${options.https?'s':''}://' + (location.host || 'localhost').split(':')[0] + ':${port}/livereload.js?snipver=1"></' + 'script>');`,
    ongenerate () {
      if (opts.consoleLogMsg) {
        console.log(green('LiveReload enabled'))
      }
    }
  }
}

function green (text) {
  return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m'
}
