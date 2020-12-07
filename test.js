'use strict'

var path = require('path')
var test = require('tape')
var vfile = require('to-vfile')
var rename = require('.')

test('vfile-rename', function (t) {
  var file = vfile('index.js')
  t.equal(rename(file, 'main.js'), file, 'should return the file')

  file = vfile('index.js')
  t.equal(rename(file, 'main.js').path, 'main.js', 'should rename the file')

  file = vfile('index.js')
  t.equal(rename(file).path, 'index.js', 'should ignore a missing rename')

  t.equal(String(rename()), '', 'should create a vfile (#1)')
  t.equal(String(rename('!')), '!', 'should create a vfile (#2)')
  t.equal(rename({path: '/'}).path, '/', 'should create a vfile (#3)')

  file = vfile('index.js')
  t.equal(rename(file, '.ts').path, 'index.ts', 'should set extname')

  file = vfile('.dot')
  t.equal(rename(file, '.js').path, '.dot.js', 'should support dotfiles')

  file = vfile('index.js')
  t.equal(rename(file, move).path, 'main.js', 'should support a function (#1)')

  file = vfile()
  t.equal(rename(file, move).path, 'main', 'should support a function (#2)')

  file = vfile('index.js')
  t.equal(
    rename(file, {stem: 'main'}).path,
    'main.js',
    'should support a spec (#1)'
  )

  file = vfile('index.js')
  t.equal(
    rename(file, {stem: 'readme', extname: '.md'}).path,
    'readme.md',
    'should support a spec (#2)'
  )

  file = vfile({basename: 'index.js', dirname: 'example'})
  t.equal(
    rename(file, {stem: {suffix: '-1'}, dirname: {prefix: 'an-'}}).path,
    path.join('an-example', 'index-1.js'),
    'should support a spec (#3)'
  )

  file = vfile('main.md')
  t.equal(
    rename(file, ['readme.htm', {stem: 'index', extname: {suffix: 'l'}}]).path,
    'index.html',
    'should support multiple renames'
  )

  t.throws(
    function () {
      rename(vfile(), 1)
    },
    /Expected function, string, array, or object as renames/,
    'should fail when renaming non-path properties'
  )

  t.throws(
    function () {
      rename(vfile(), {other: '!'})
    },
    /Cannot rename `other`: it’s not a path property/,
    'should fail when renaming non-path properties'
  )

  t.throws(
    function () {
      rename(vfile(), {extname: '.js'})
    },
    /Setting `extname` requires `path` to be set too/,
    'should fail when partially renaming pathless files'
  )

  t.end()

  function move(file) {
    file.stem = 'main'
  }
})
