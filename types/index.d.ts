import {VFile} from 'vfile'

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
 * @see https://github.com/vfile/vfile-rename#movefile
 */
declare function move(file: VFile): VFile

/**
 * Renames the given `file` with `renames`
 * @param file VFile to rename
 * @param renames Rename instructions
 * @returns The renamed `file`
 * @see https://github.com/vfile/vfile-rename#renamefile-renames
 */
declare function rename(file: VFile, renames: rename.Renames): VFile

declare namespace rename {
  /**
   * @see https://github.com/vfile/vfile-rename#spec
   */
  type Spec = {
    path?: string
    basename?: string
    stem?: string
    extname?: string
    dirname?: string
  }
  type Renames = string | typeof move | Spec | Array<Renames>

  /**
   * Create a function (the [move](https://github.com/vfile/vfile-rename#movefile)) from `renames`, that when given a file changes its path properties.
   * @param renames Rename instructions
   * @returns A [move](https://github.com/vfile/vfile-rename#movefile)
   * @see https://github.com/vfile/vfile-rename#convertrenames
   */
  function convert(renames: Renames): typeof move
}
