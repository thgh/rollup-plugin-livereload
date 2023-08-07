import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process'
import WebSocket from 'ws'
import { afterAll, beforeAll, vi } from 'vitest'

export const DELAY = 400

export function createContext(folder = 'entry') {
  const start = performance.now()
  const ctx = {
    url: '',
    server: null as unknown as ChildProcessWithoutNullStreams,
    client: null as unknown as WebSocket,
    reload: (path: string) => {},
  }

  beforeAll(async () => {
    ctx.server = spawn('rollup', ['-cw'], { cwd: 'test/' + folder })
    const serving = await new Promise(resolve => {
      let created = false
      let live = false
      ctx.server.stdout.on('data', data => {
        const line = data.toString().trim()
        if (line.split(' -> ').length > 1 && line.startsWith('http')) {
          ctx.url = line.split(' -> ')[0]
        }
        if (line.includes('LiveReload enabled')) {
          live = true
          if (created && live) resolve(true)
        }
      })
      ctx.server.stderr.on('data', data => {
        if (data.toString().trim().includes('created')) created = true
        if (created && live) resolve(true)
      })
    })

    await new Promise(resolve => {
      const client = (ctx.client = new WebSocket('ws://localhost:35729'))
      client.addEventListener('open', () => {
        client.send(
          '{"command":"hello","protocols":["http://livereload.com/protocols/official-6","http://livereload.com/protocols/official-7"],"ver":"3.3.2","snipver":1}'
        )
        resolve(true)
      })
      client.addEventListener('message', evt => {
        const data = JSON.parse(evt.data.toString())
        if (data.command === 'hello') {
          client.send(JSON.stringify({ command: 'info', url: ctx.url + '/' }))
          resolve(client)
        }
        if (
          data.command === 'reload' &&
          data.path.endsWith(folder + '/dest.js')
        ) {
          ctx.reload(data.path)
        }
      })
    })

    // Ignore reloads in the first second
    await new Promise(resolve => setTimeout(resolve, 1000))

    ctx.reload = vi.fn((path: string) => {})
  })

  afterAll(() => {
    ctx.client?.close()
    ctx.server.kill()
  })

  return ctx
}
