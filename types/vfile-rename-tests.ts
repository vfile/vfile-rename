import vfile = require('vfile')
import rename = require('vfile-rename')

const file = vfile('index.js')

function move(file: vfile.VFile) {
  file.stem = 'main'
  return file
}

rename() // $ExpectType VFile
rename('!') // $ExpectType VFile
rename({path: '/'}) // $ExpectType VFile
rename(file, 'main.js') // $ExpectType VFile
rename(file, '.ts') // $ExpectType VFile
rename(file, move) // $ExpectType VFile
rename(file, {stem: 'main'}) // $ExpectType VFile
rename(file, {stem: 'readme', extname: '.md'}) // $ExpectType VFile
rename(file, {stem: {suffix: '-1'}, dirname: {prefix: 'an-'}}) // $ExpectType VFile
rename(file, ['readme.htm', {stem: 'index', extname: {suffix: 'l'}}]) // $ExpectType VFile

