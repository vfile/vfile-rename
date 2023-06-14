/**
 * @typedef {import('vfile').VFile} VFile
 * @typedef {import('vfile').VFileOptions} VFileOptions
 */

/**
 * @typedef {'basename' | 'dirname' | 'extname' | 'path' | 'stem'} Field
 *   Fields related to paths.
 *
 * @callback Move
 *   Move.
 * @param {VFile} file
 *   File to change.
 * @returns {undefined}
 *   Nothing.
 *
 * @typedef {Array<Move | Spec | string> | Move | Spec | string} Renames
 *   Rename instructions.
 *
 *   *   if the bound rename is a normal string starting with a dot (`.`), sets
 *       `file.extname`
 *   *   otherwise, if the bound rename is a normal string, sets `file.basename`
 *   *   otherwise, if the bound test is an array, all renames in it are
 *       performed
 *   *   otherwise, if the bound rename is an object, renames according to the
 *       `Spec`
 *
 * @typedef Spec
 *   An object describing path properties to values.
 *
 *   For each property in spec, if its value is string, the value of the path
 *   property on the given file is set.
 *   If the value is object, it can have a prefix or suffix key, the value of
 *   the path property on the given file is prefixed and/or suffixed.
 * @property {VFileOptions['basename'] | SpecAffix} [basename]
 *   Change basename (`'index.min.js'`).
 * @property {VFileOptions['dirname'] | SpecAffix} [dirname]
 *   Change dirname (`'~'`).
 * @property {VFileOptions['extname'] | SpecAffix} [extname]
 *   Change extname (`'.js'`).
 * @property {VFileOptions['path'] | SpecAffix} [path]
 *   Change file path (`'~/index.min.js'`).
 * @property {VFileOptions['stem'] | SpecAffix} [stem]
 *   Change stem (`'index.min'`).
 *
 * @typedef SpecAffix
 *   Define prepending and/or appending.
 * @property {string | null | undefined} [prefix]
 *   Substring to prepend in front of the field.
 * @property {string | null | undefined} [suffix]
 *   Substring to append after the field.
 */

// Order of renaming properties.
// See <https://github.com/vfile/vfile/blob/86677e2/lib/index.js#L89>
// Other properties are invalid.
const order = /** @type {const} */ ([
  'path',
  'basename',
  'stem',
  'extname',
  'dirname'
])

const own = {}.hasOwnProperty

/**
 * Create a function (the move) from `renames`, that when given a file changes
 * its path properties.
 *
 * @param {Renames | null | undefined} [renames]
 *   Rename instructions.
 * @returns {Move}
 *   A move.
 */
export function convert(renames) {
  if (renames === null || renames === undefined) {
    return nothing
  }

  if (typeof renames === 'function') {
    return renames
  }

  if (typeof renames === 'string') {
    return createSetterMove(
      renames.charAt(0) === '.' ? 'extname' : 'basename',
      renames
    )
  }

  if (typeof renames === 'object') {
    return Array.isArray(renames)
      ? createMoves(renames)
      : createSpecMove(renames)
  }

  throw new Error('Expected function, string, array, or object as renames')
}

/**
 * Rename a file.
 *
 * When given something, returns a vfile from that, and changes its path
 * properties.
 *
 * @param {VFile} file
 *   File to rename.
 * @param {Renames | null | undefined} [renames]
 *   Rename instructions.
 * @returns {undefined}
 *   Nothing.
 */
export function rename(file, renames) {
  convert(renames)(file)
}

/**
 * Create a move from multiples moves.
 *
 * @param {Array<Move>} moves
 *   Moves.
 * @returns {Move}
 *   Move.
 */
function combineMoves(moves) {
  return move

  /** @type {Move} */
  function move(file) {
    const history = [...file.history]
    let index = -1

    while (++index < moves.length) {
      moves[index](file)
    }

    // Clean history to only include one changed path.
    file.history = [...history, file.path]
  }
}

/**
 * Convert renames into a move.
 *
 * @param {Array<Move | Spec | string>} renames
 *   Renames.
 * @returns {Move}
 *   Move.
 */
function createMoves(renames) {
  /** @type {Array<Move>} */
  const moves = []
  let index = -1

  while (++index < renames.length) {
    moves[index] = convert(renames[index])
  }

  return combineMoves(moves)
}

/**
 * Create a move that prepends.
 *
 * @param {Field} key
 *   Field.
 * @param {string} prefix
 *   Value to add.
 * @returns {Move}
 *   Move.
 */
function createPrefixMove(key, prefix) {
  return add
  /** @type {Move} */
  function add(file) {
    file[key] = prefix + file[key]
  }
}

/**
 * Create a move that sets a field.
 *
 * @param {Field} key
 *   Field.
 * @param {string} value
 *   Value to set.
 * @returns {Move}
 *   Move.
 */
function createSetterMove(key, value) {
  return move

  /** @type {Move} */
  function move(file) {
    file[key] = value
  }
}

/**
 * Convert a spec into a move.
 *
 * @param {Spec} spec
 *   Spec.
 * @returns {Move}
 *   Move.
 */
function createSpecMove(spec) {
  /** @type {Array<Field>} */
  const props = []
  /** @type {Array<Move>} */
  const moves = []
  /** @type {Field} */
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
      moves.push(createSetterMove(prop, value))
    } else if (value) {
      if ('prefix' in value && value.prefix) {
        moves.push(createPrefixMove(prop, value.prefix))
      }

      if ('suffix' in value && value.suffix) {
        moves.push(createSuffixMove(prop, value.suffix))
      }
    }
  }

  return combineMoves(moves)
}

/**
 * Create a move that appends.
 *
 * @param {Field} key
 *   Field.
 * @param {string} suffix
 *   Value to add.
 * @returns {Move}
 *   Move.
 */
function createSuffixMove(key, suffix) {
  return add
  /** @type {Move} */
  function add(file) {
    file[key] += suffix
  }
}

/**
 * Move that doesn’t do anything.
 *
 * @type {Move}
 */
function nothing() {}

/**
 * Sort fields on which comes first in `order`.
 *
 * @param {Field} a
 *   Left.
 * @param {Field} b
 *   Right.
 * @returns {number}
 *   Sort.
 */
function sort(a, b) {
  return order.indexOf(a) - order.indexOf(b)
}
