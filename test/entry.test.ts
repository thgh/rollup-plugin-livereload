import { describe, expect, vi } from 'vitest'
import { appendFileSync } from 'node:fs'
import { DELAY, createContext } from './shared'

describe('entry update', test => {
  let ctx = createContext('entry')
  test('should trigger a reload', async t => {
    expect(ctx.reload).toHaveBeenCalledTimes(0)

    // Update the entry file and check if it reloads
    appendFileSync('test/entry/entry.js', '\nconsole.log("append")')
    await new Promise(resolve => setTimeout(resolve, DELAY))
    expect(ctx.reload).toHaveBeenCalledTimes(1)

    // Update the entry file and check if it reloads
    appendFileSync('test/entry/entry.js', '\nconsole.log("append")')
    await new Promise(resolve => setTimeout(resolve, DELAY))
    expect(ctx.reload).toHaveBeenCalledTimes(2)
  })
})
