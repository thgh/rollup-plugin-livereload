import { afterAll, beforeAll, describe, expect, vi } from 'vitest'
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'
import { DELAY, createContext } from './shared'

const FILE_TO_MODIFY = 'test/config/rollup.config.js'

describe('config update', test => {
  let ctx = createContext('config')
  let originalFile: string
  beforeAll(() => {
    originalFile = readFileSync(FILE_TO_MODIFY, 'utf-8')
  })

  test('should trigger a reload', async t => {
    expect(ctx.reload).toHaveBeenCalledTimes(0)

    // Update the config file and check if it reloads
    appendFileSync(FILE_TO_MODIFY, '\nconsole.log("append")')
    await new Promise(resolve => setTimeout(resolve, 1000 + DELAY))
    expect(ctx.reload).toHaveBeenCalledTimes(1)
    expect(ctx.reload).toHaveBeenCalledWith(
      expect.stringContaining('rollup.config.js')
    )
  })

  afterAll(() => {
    writeFileSync(FILE_TO_MODIFY, originalFile, 'utf-8')
  })
})
