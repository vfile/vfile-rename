/**
 * @typedef {import('./index.js').Move} Move
 */

import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import {toVFile} from 'to-vfile'
import {rename} from 'vfile-rename'

test('rename', async function () {
  assert.deepEqual(
    Object.keys(await import('vfile-rename')).sort(),
    ['convert', 'rename'],
    'should expose the public api'
  )

  let file = toVFile('index.js')
  assert.equal(rename(file, 'main.js'), undefined, 'should return nothing')

  file = toVFile('index.js')
  rename(file, 'main.js')
  assert.equal(file.path, 'main.js', 'should rename the file')

  file = toVFile('index.js')
  rename(file)
  assert.equal(file.path, 'index.js', 'should ignore a missing rename')

  // .
  // assert.equal(String(rename()), '', 'should create a toVFile (#1)')
  // assert.equal(String(rename('!')), '!', 'should create a toVFile (#2)')
  // assert.equal(rename({path: '/'}).path, '/', 'should create a toVFile (#3)')

  file = toVFile('index.js')
  rename(file, '.ts')
  assert.equal(file.path, 'index.ts', 'should set extname')

  file = toVFile('.dot')
  rename(file, '.js')
  assert.equal(file.path, '.dot.js', 'should support dotfiles')

  file = toVFile('index.js')
  rename(file, move)
  assert.equal(file.path, 'main.js', 'should support a function (#1)')

  file = toVFile()
  rename(file, move)
  assert.equal(file.path, 'main', 'should support a function (#2)')

  file = toVFile('index.js')
  rename(file, {stem: 'main'})
  assert.equal(file.path, 'main.js', 'should support a spec (#1)')

  file = toVFile('index.js')
  rename(file, {stem: 'readme', extname: '.md'})
  assert.equal(file.path, 'readme.md', 'should support a spec (#2)')

  file = toVFile({basename: 'index.js', dirname: 'example'})
  rename(file, {stem: {suffix: '-1'}, dirname: {prefix: 'an-'}})
  assert.equal(
    file.path,
    path.join('an-example', 'index-1.js'),
    'should support a spec (#3)'
  )

  file = toVFile('main.md')
  rename(file, ['readme.htm', {stem: 'index', extname: {suffix: 'l'}}])
  assert.equal(file.path, 'index.html', 'should support multiple renames')

  assert.throws(
    function () {
      // @ts-expect-error check that a runtime error is thrown.
      rename(toVFile(), 1)
    },
    /Expected function, string, array, or object as renames/,
    'should fail when renaming non-path properties'
  )

  assert.throws(
    function () {
      // @ts-expect-error check that a runtime error is thrown.
      rename(toVFile(), {other: '!'})
    },
    /Cannot rename `other`: it’s not a path property/,
    'should fail when renaming non-path properties'
  )

  assert.throws(
    function () {
      rename(toVFile(), {extname: '.js'})
    },
    /Setting `extname` requires `path` to be set too/,
    'should fail when partially renaming pathless files'
  )

  /** @type {Move} */
  function move(file) {
    file.stem = 'main'
  }
})
