'use strict'

// Order of renaming properties.
// See https://github.com/vfile/vfile/blob/d88717d/core.js#L15
// Other properties are invalid.
var order = ['path', 'basename', 'stem', 'extname', 'dirname']

module.exports = convert

function convert(rename) {
  if (rename === null || rename === undefined) {
    return noop
  }

  if (typeof rename === 'function') {
    return rename
  }

  if (typeof rename === 'string') {
    return setter(rename.charAt(0) === '.' ? 'extname' : 'basename', rename)
  }

  if (typeof rename === 'object') {
    return 'length' in rename
      ? allFactory(convertAll(rename))
      : specFactory(rename)
  }

  throw new Error('Expected function, string, array, or object as renames')
}

function specFactory(specs) {
  var props = []
  var changes = []
  var prop
  var length
  var index
  var spec

  // Fail on non-path props.
  for (prop in specs) {
    if (order.indexOf(prop) === -1) {
      throw new Error('Cannot rename `' + prop + '`: it’s not a path property')
    }

    props.push(prop)
  }

  // Create changes for all specs.
  length = props.length
  index = -1
  props.sort(sort)

  while (++index < length) {
    prop = props[index]
    spec = specs[prop]

    if (typeof spec === 'string') {
      changes.push(setter(prop, spec))
    } else {
      if (spec.prefix) {
        changes.push(prefix(prop, spec.prefix))
      }

      if (spec.suffix) {
        changes.push(suffix(prop, spec.suffix))
      }
    }
  }

  return allFactory(changes)
}

function convertAll(specs) {
  var changes = []
  var length = specs.length
  var index = -1

  while (++index < length) {
    changes[index] = convert(specs[index])
  }

  return changes
}

function allFactory(changes) {
  var length = changes.length

  return all

  function all(file) {
    var history = file.history.concat()
    var index = -1

    while (++index < length) {
      changes[index](file)
    }

    // Clean history to only include one changed path.
    file.history = history.concat(file.path)
  }
}

function sort(a, b) {
  return order.indexOf(b) - order.indexOf(b)
}

function setter(key, value) {
  return set
  function set(file) {
    file[key] = value
  }
}

function prefix(key, prefix) {
  return add
  function add(file) {
    file[key] = prefix + file[key]
  }
}

function suffix(key, suffix) {
  return add
  function add(file) {
    file[key] += suffix
  }
}

function noop() {}
