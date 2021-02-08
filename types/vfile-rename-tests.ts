import vfile = require('vfile')
import rename = require('vfile-rename')

const convert = rename.convert
const move = convert('!')
const file = vfile('index.js')

rename() // $ExpectType VFile
rename('!') // $ExpectType VFile
rename({path: '/'}) // $ExpectType VFile
rename(file, 'main.js') // $ExpectType VFile
rename(file, move) // $ExpectType VFile
rename(file, {stem: 'main'}) // $ExpectType VFile
rename(file, {stem: 'readme', extname: '.md'}) // $ExpectType VFile
rename(file, {stem: {suffix: '-1'}, dirname: {prefix: 'an-'}}) // $ExpectType VFile
rename(file, ['readme.htm', {stem: 'index', extname: {suffix: 'l'}}]) // $ExpectType VFile
rename(vfile(), 1) // $ExpectError
rename(vfile(), {other: '!'}) // $ExpectError

convert('!') // $ExpectType Move
convert({path: '/'}) // $ExpectType Move
convert(move) // $ExpectType Move
convert({stem: 'main'}) // $ExpectType Move
convert({stem: 'readme', extname: '.md'}) // $ExpectType Move
convert({stem: {suffix: '-1'}, dirname: {prefix: 'an-'}}) // $ExpectType Move
convert(['readme.htm', {stem: 'index', extname: {suffix: 'l'}}]) // $ExpectType Move
convert(1) // $ExpectError
convert({other: '!'}) // $ExpectError
