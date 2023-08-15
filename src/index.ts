import {
  createServer,
  type LiveReloadServer,
  type CreateServerConfig,
} from 'livereload'
import { resolve } from 'path'
import { find } from 'port-authority'
import { type Plugin } from 'rollup'

declare global {
  var PLUGIN_LIVERELOAD: { server: LiveReloadServer | null }
}

const state = (global.PLUGIN_LIVERELOAD = global.PLUGIN_LIVERELOAD || {
  server: null,
})

export interface RollupLivereloadOptions extends CreateServerConfig {
  /**
   * A directory or a set of directories to watch for changes.
   * @default the current directory
   */
  watch?: string | string[]

  /**
   * Whether or not to inject the `livereload` snippet into the bundle which
   * will enable `livereload` in your web app.
   * @default true
   */
  inject?: boolean

  /**
   * Log a message to console when `livereload` is ready.
   * @default true
   */
  verbose?: boolean

  ///
  /// Find all `livereload` options here:
  /// https://www.npmjs.com/package/livereload#user-content-server-api
  ///

  /** @private */
  clientUrl?: string
}

/**
 * 🔄 A Rollup plugin for including `livereload` in your web app.
 */
export default function livereload(
  options?: RollupLivereloadOptions | string
): Plugin {
  const parsedOptions = options ? parseOptions(options) : {}

  // release previous server instance if rollup is reloading configuration
  // in watch mode
  if (state.server) {
    state.server.close()
  }

  let enabled = parsedOptions.verbose === false
  const portPromise = find(parsedOptions.port || 35729)

  portPromise.then(port => {
    state.server = createServer({ ...parsedOptions, port })

    // Start watching
    if (Array.isArray(parsedOptions.watch)) {
      state.server.watch(
        parsedOptions.watch.map(w => resolve(process.cwd(), w))
      )
    } else {
      state.server.watch(resolve(process.cwd(), parsedOptions.watch || ''))
    }
  })

  return {
    name: 'livereload',
    async banner() {
      if (parsedOptions.inject === false) {
        return ''
      }
      const port = await portPromise
      const snippetSrc = parsedOptions.clientUrl
        ? JSON.stringify(parsedOptions.clientUrl)
        : parsedOptions.clientHostname
        ? `'//${parsedOptions.clientHostname}:${port}/livereload.js?snipver=1'`
        : process.env.CODESANDBOX_SSE
        ? `'//' + (self.location.hostname.replace(/^([^.]+)-\\d+/,"$1").replace(/^([^.]+)/, "$1-${port}")) + '/livereload.js?snipver=1&port=443'`
        : `(self.location.protocol.startsWith('http') ? '' : 'http:') + '//' + (self.location.hostname || 'localhost') + ':${port}/livereload.js?snipver=1'`
      return `(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = ${snippetSrc}; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);`
    },
    async generateBundle() {
      if (!enabled) {
        enabled = true
        const port = await portPromise
        const customPort = port !== 35729 ? ' on port ' + port : ''
        console.log(green('LiveReload enabled' + customPort))
      }
    },
  }
}

function parseOptions(
  options: RollupLivereloadOptions | string
): RollupLivereloadOptions {
  if (typeof options === 'string') {
    return {
      watch: options,
    }
  }

  return options
}

function green(text: string) {
  return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m'
}
