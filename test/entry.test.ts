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
    // since livereload is watching the entire folder, it will send two reload
    // commands, one for the entry file and one for the bundle.
    expect(ctx.reload).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('entry.js')
    )
    expect(ctx.reload).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('dest.js')
    )
    // Update the entry file and check if it reloads
    appendFileSync('test/entry/entry.js', '\nconsole.log("append")')
    await new Promise(resolve => setTimeout(resolve, DELAY))
    expect(ctx.reload).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('entry.js')
    )
    expect(ctx.reload).toHaveBeenNthCalledWith(
      4,
      expect.stringContaining('dest.js')
    )
    expect(ctx.reload).toHaveBeenCalledTimes(4)
  })
})
