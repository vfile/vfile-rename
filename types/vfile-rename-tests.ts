import vfile = require('vfile')
import rename = require('vfile-rename')

const file = vfile('index.js')

function move(file: vfile.VFile) {
  file.stem = 'main'
  return file
}

rename()
rename('!')
rename({path: '/'})
rename(file, 'main.js')
rename(file, '.ts')
rename(file, move)
rename(file, {stem: 'main'})
rename(file, {stem: 'readme', extname: '.md'})
rename(file, {stem: {suffix: '-1'}, dirname: {prefix: 'an-'}})
rename(file, ['readme.htm', {stem: 'index', extname: {suffix: 'l'}}])
