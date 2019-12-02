'use strict'

var vfile = require('vfile')
var convert = require('./convert.js')

module.exports = rename

function rename(value, specs) {
  var file = vfile(value)
  convert(specs)(value)
  return file
}
