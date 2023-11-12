import { afterAll, beforeAll, describe, expect, vi } from 'vitest'
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'
import { DELAY, createContext } from './shared'

const FILE_TO_MODIFY = 'test/entry/entry.js'

describe('entry update', test => {
  let ctx = createContext('entry')
  let originalFile: string
  beforeAll(() => {
    originalFile = readFileSync(FILE_TO_MODIFY, 'utf-8')
  })
  test('should trigger a reload', async t => {
    expect(ctx.reload).toHaveBeenCalledTimes(0)

    // Update the entry file and check if it reloads
    appendFileSync(FILE_TO_MODIFY, '\nconsole.log("append")')
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
    appendFileSync(FILE_TO_MODIFY, '\nconsole.log("append")')
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

  afterAll(() => {
    writeFileSync(FILE_TO_MODIFY, originalFile, 'utf-8')
  })
})
