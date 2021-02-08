// TypeScript Version: 3.7

import {VFile, VFileCompatible, VFileOptions} from 'vfile'

export = rename

/**
 * When given something, returns a vfile from that, and changes its path properties.
 * - If there is no bound rename (it’s null or undefined), makes sure file is a VFile
 * - If the bound rename is a normal string starting with a dot (.), sets file.extname
 * - Otherwise, if the bound rename is a normal string, sets file.basename
 * - If the bound test is an array, all renames in it are performed
 * - Otherwise, if the bound rename is an object, renames according to the Spec
 * @param file VFile to rename
 * @returns The renamed `file`
 */
declare function move(file: VFile): VFile

/**
 * Renames the given `file` with `renames`
 * @param file VFile to rename
 * @param renames Rename instructions
 * @returns The renamed `file`
 */
declare function rename(file?: VFileCompatible, renames?: rename.Renames): VFile

declare namespace rename {
  interface SpecAffix {
    prefix?: string
    suffix?: string
  }

  /**
   * A spec is an object describing path properties to values. For each property in spec, if its value is string, the value of the path property on the given file is set. If the value is object, it can have a prefix or suffix key, the value of the path property on the given file is prefixed and/or suffixed.
   */
  interface Spec {
    path?: VFileOptions['path'] | SpecAffix
    basename?: VFileOptions['basename'] | SpecAffix
    stem?: VFileOptions['stem'] | SpecAffix
    extname?: VFileOptions['extname'] | SpecAffix
    dirname?: VFileOptions['dirname'] | SpecAffix
  }

  type Renames = string | typeof move | Spec | Renames[]

  /**
   * Create a function (the [move](https://github.com/vfile/vfile-rename#movefile)) from `renames`, that when given a file changes its path properties.
   * @param renames Rename instructions
   * @returns A [move](https://github.com/vfile/vfile-rename#movefile)
   */
  function convert(renames: Renames): typeof move
}
