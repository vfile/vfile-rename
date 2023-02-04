/**
 * @typedef {import('vfile').VFileCompatible} VFileCompatible
 * @typedef {import('vfile').VFileOptions} VFileOptions
 *
 * @typedef SpecAffix
 * @property {string} [prefix]
 *   Substring to prepend in front of the field.
 * @property {string} [suffix]
 *   Substring to append after the field.
 *
 * @typedef Spec
 *   An object describing path properties to values.
 *   For each property in spec, if its value is string, the value of the path
 *   property on the given file is set.
 *   If the value is object, it can have a prefix or suffix key, the value of
 *   the path property on the given file is prefixed and/or suffixed.
 * @property {VFileOptions['path']|SpecAffix} [path]
 * @property {VFileOptions['basename']|SpecAffix} [basename]
 * @property {VFileOptions['stem']|SpecAffix} [stem]
 * @property {VFileOptions['extname']|SpecAffix} [extname]
 * @property {VFileOptions['dirname']|SpecAffix} [dirname]
 *
 * @typedef {'path' | 'basename' | 'stem' | 'extname' | 'dirname'} SpecKey
 *
 * @typedef {(file: VFile) => VFile} Move
 *   When given something, returns a vfile from that, and changes its path
 *   properties.
 *
 *   *   if there is no bound rename (it’s `null` or `undefined`), makes sure
 *       `file` is a `VFile`
 *   *   otherwise, if the bound rename is a normal string starting with a dot
 *       (`.`), sets `file.extname`
 *   *   otherwise, if the bound rename is a normal string, sets `file.basename`
 *   *   otherwise, if the bound test is an array, all renames in it are
 *       performed
 *   *   otherwise, if the bound rename is an object, renames according to the
 *       `Spec`
 * @typedef {(file: VFile) => any} AnyMove
 * @typedef {string|AnyMove|Spec|Array<string|AnyMove|Spec>} Renames
 */

import {VFile} from 'vfile'

const own = {}.hasOwnProperty

// Order of renaming properties.
// See <https://github.com/vfile/vfile/blob/7339f82/lib/index.js#L58>
// Other properties are invalid.
const order = ['path', 'basename', 'stem', 'extname', 'dirname']

/**
 * Rename a file.
 *
 * @param {VFileCompatible} [value]
 *   File to rename.
 * @param {Renames} [renames]
 *   Rename instructions.
 * @returns {VFile}
 *   The renamed `file`.
 */
export function rename(value, renames) {
  const file = value instanceof VFile ? value : new VFile(value)
  convert(renames)(file)
  return file
}

/**
 * Create a function (the move) from `renames`, that when given a file changes
 * its path properties.
 *
 * @param {Renames} [renames]
 *   Rename instructions.
 * @returns {Move}
 *   A move.
 */
export function convert(renames) {
  if (renames === null || renames === undefined) {
    return identity
  }

  if (typeof renames === 'function') {
    return renames
  }

  if (typeof renames === 'string') {
    return setter(renames.charAt(0) === '.' ? 'extname' : 'basename', renames)
  }

  if (typeof renames === 'object') {
    return Array.isArray(renames)
      ? allFactory(convertAll(renames))
      : specFactory(renames)
  }

  throw new Error('Expected function, string, array, or object as renames')
}

/**
 * @param {Spec} spec
 * @returns {Move}
 */
function specFactory(spec) {
  /** @type {Array<SpecKey>} */
  const props = []
  /** @type {Array<Move>} */
  const moves = []
  /** @type {SpecKey} */
  let prop

  // Fail on non-path props.
  for (prop in spec) {
    if (own.call(spec, prop)) {
      if (!order.includes(prop)) {
        throw new Error(
          'Cannot rename `' + prop + '`: it’s not a path property'
        )
      }

      props.push(prop)
    }
  }

  // Create moves for all specs.
  props.sort(sort)
  let index = -1

  while (++index < props.length) {
    const prop = props[index]
    const value = spec[prop]

    if (typeof value === 'string') {
      moves.push(setter(prop, value))
    } else if (value) {
      if ('prefix' in value && value.prefix) {
        moves.push(prefix(prop, value.prefix))
      }

      if ('suffix' in value && value.suffix) {
        moves.push(suffix(prop, value.suffix))
      }
    }
  }

  return allFactory(moves)
}

/**
 * @param {Array<string|Move|Spec>} renames
 * @returns {Array<Move>}
 */
function convertAll(renames) {
  /** @type {Array<Move>} */
  const moves = []
  let index = -1

  while (++index < renames.length) {
    moves[index] = convert(renames[index])
  }

  return moves
}

/**
 * @param {Array<Move>} changes
 * @returns {Move}
 */
function allFactory(changes) {
  return all

  /** @type {Move} */
  function all(file) {
    const history = file.history.concat()
    let index = -1

    while (++index < changes.length) {
      changes[index](file)
    }

    // Clean history to only include one changed path.
    file.history = history.concat(file.path)

    return file
  }
}

/**
 * @param {SpecKey} a
 * @param {SpecKey} b
 * @returns {number}
 */
function sort(a, b) {
  return order.indexOf(a) - order.indexOf(b)
}

/**
 * @param {SpecKey} key
 * @param {string} value
 * @returns {Move}
 */
function setter(key, value) {
  return set
  /** @type {Move} */
  function set(file) {
    file[key] = value
    return file
  }
}

/**
 * @param {SpecKey} key
 * @param {string} prefix
 * @returns {Move}
 */
function prefix(key, prefix) {
  return add
  /** @type {Move} */
  function add(file) {
    file[key] = prefix + file[key]
    return file
  }
}

/**
 * @param {SpecKey} key
 * @param {string} suffix
 * @returns {Move}
 */
function suffix(key, suffix) {
  return add
  /** @type {Move} */
  function add(file) {
    file[key] += suffix
    return file
  }
}

/** @type {Move} */
function identity(file) {
  return file
}
