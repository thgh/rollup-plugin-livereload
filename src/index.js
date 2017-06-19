import { createServer } from 'livereload'
import { resolve } from 'path'

export default function livereload (options = { watch: '' }) {
  if (typeof options === 'string') {
    options = {
      watch: options
    }
  }

  var enabled = options.verbose === false
  const port = options.port || 35729
  const server = createServer(options)

  // Start watching
  if (Array.isArray(options.watch)) {
    server.watch(options.watch.map(w => resolve(process.cwd(), w)))
  } else {
    server.watch(resolve(process.cwd(), options.watch))
  }

  var script = `
    (function() {
    var src = 'http${options.https?'s':''}://' + (location.host || 'localhost').split(':')[0] + ':${port}/livereload.js?snipver=1';
    var script    = document.createElement('script');
    script.type   = 'text/javascript';
    script.src    = src;
    document.getElementsByTagName('head')[0].appendChild(script);
    }());
  `;

  return {
    name: 'livereload',
    banner: script,
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
