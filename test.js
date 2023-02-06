/**
 * @typedef {import('./index.js').Move} Move
 */

import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import {toVFile as vfile} from 'to-vfile'
import {rename} from './index.js'

test('vfile-rename', function () {
  let file = vfile('index.js')
  assert.equal(rename(file, 'main.js'), file, 'should return the file')

  file = vfile('index.js')
  assert.equal(
    rename(file, 'main.js').path,
    'main.js',
    'should rename the file'
  )

  file = vfile('index.js')
  assert.equal(rename(file).path, 'index.js', 'should ignore a missing rename')

  assert.equal(String(rename()), '', 'should create a vfile (#1)')
  assert.equal(String(rename('!')), '!', 'should create a vfile (#2)')
  assert.equal(rename({path: '/'}).path, '/', 'should create a vfile (#3)')

  file = vfile('index.js')
  assert.equal(rename(file, '.ts').path, 'index.ts', 'should set extname')

  file = vfile('.dot')
  assert.equal(rename(file, '.js').path, '.dot.js', 'should support dotfiles')

  file = vfile('index.js')
  assert.equal(
    rename(file, move).path,
    'main.js',
    'should support a function (#1)'
  )

  file = vfile()
  assert.equal(
    rename(file, move).path,
    'main',
    'should support a function (#2)'
  )

  file = vfile('index.js')
  assert.equal(
    rename(file, {stem: 'main'}).path,
    'main.js',
    'should support a spec (#1)'
  )

  file = vfile('index.js')
  assert.equal(
    rename(file, {stem: 'readme', extname: '.md'}).path,
    'readme.md',
    'should support a spec (#2)'
  )

  file = vfile({basename: 'index.js', dirname: 'example'})
  assert.equal(
    rename(file, {stem: {suffix: '-1'}, dirname: {prefix: 'an-'}}).path,
    path.join('an-example', 'index-1.js'),
    'should support a spec (#3)'
  )

  file = vfile('main.md')
  assert.equal(
    rename(file, ['readme.htm', {stem: 'index', extname: {suffix: 'l'}}]).path,
    'index.html',
    'should support multiple renames'
  )

  assert.throws(
    function () {
      // @ts-expect-error runtime.
      rename(vfile(), 1)
    },
    /Expected function, string, array, or object as renames/,
    'should fail when renaming non-path properties'
  )

  assert.throws(
    function () {
      // @ts-expect-error runtime.
      rename(vfile(), {other: '!'})
    },
    /Cannot rename `other`: it’s not a path property/,
    'should fail when renaming non-path properties'
  )

  assert.throws(
    function () {
      rename(vfile(), {extname: '.js'})
    },
    /Setting `extname` requires `path` to be set too/,
    'should fail when partially renaming pathless files'
  )

  /** @type {Move} */
  function move(file) {
    file.stem = 'main'
  }
})
