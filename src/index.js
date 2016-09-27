import lr from 'livereload'
import { resolve } from 'path'

export default function livereload (options = { watch: '' }) {
  if (typeof options === 'string') {
    options = {
      watch: options
    }
  }

  const port = options.port || 35729
  const server = lr.createServer(options)
  server.watch(resolve(process.cwd(), options.watch))

  return {
    name: 'livereload',
    transformBundle (code) {
      return code + `;document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + 
':${port}/livereload.js?snipver=1"></' + 'script>')`
    }
  }
}
