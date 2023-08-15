import { describe, expect, vi } from 'vitest'
import { appendFileSync } from 'node:fs'
import { DELAY, createContext } from './shared'

describe('config update', test => {
  let ctx = createContext('config')
  test('should trigger a reload', async t => {
    expect(ctx.reload).toHaveBeenCalledTimes(0)

    // Update the entry file and check if it reloads
    appendFileSync('test/config/rollup.config.js', '\nconsole.log("append")')
    await new Promise(resolve => setTimeout(resolve, 1000 + DELAY))
    expect(ctx.reload).toHaveBeenCalledTimes(0)
  })
})
