import { Plugin } from 'rollup'

export interface RollupLivereloadOptions {
  /** Defaults to current directory */
  watch?: string

  /** Defaults to true */
  verbose?: boolean

  /** Livereload options, improvements welcome */
  [key: livereloadOption]: any
}

/**
 * 🔄 A Rollup plugin for including livereload in your web app.
 */
export default function livereload(
  options?: RollupLivereloadOptions | string
): Plugin
