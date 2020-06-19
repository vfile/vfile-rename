# vfile-rename

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Rename a [`vfile`][vfile].

## Install

[npm][]:

```sh
npm install vfile-rename
```

## Use

```js
var vfile = require('to-vfile')
var rename = require('vfile-rename')

var file = vfile('readme.md')
file.path // => readme.md

// Set extname:
rename(file, '.html')
file.path // => readme.html

// Set basename:
rename(file, 'main.md')
file.path // => main.md

// Set path properties:
rename(file, {stem: 'index'})
file.path // => index.md

// Change path properties:
rename(file, {stem: {suffix: '.bak'}})
file.path // => index.bak.md

// All together:
rename(file, ['readme.md', '.htm', {stem: 'index', extname: {suffix: 'l'}}])
file.path // => index.html
```

## API

### `rename(file, renames)`

Renames the given `file` with `renames`.

Converts `renames` to a [move][], and calls that move with `file`.
If you’re doing a lot of renames, use `convert` (`rename.convert` or
`require('vfile-rename/convert')` directly).

###### Parameters

*   `renames` (`string`, `Function`, `Spec`, or `Array.<rename>`, optional)

###### Returns

The given `file`.

### `convert(renames)`

Create a function (the [move][]) from `renames`, that when given a file changes
its path properties.

###### Parameters

*   `renames` (`string`, `Function`, `Spec`, or `Array.<rename>`, optional)

###### Returns

A [move][].

#### `move(file)`

When given something, returns a [vfile][] from that, and changes its path
properties.

*   If there is no bound rename (it’s null or undefined), makes sure `file` is a
    [`VFile`][vfile]
*   If the bound rename is a normal string starting with a dot (`.`), sets
    `file.extname`
*   Otherwise, if the bound rename is a normal string, sets `file.basename`
*   If the bound test is an array, all renames in it are performed
*   Otherwise, if the bound rename is an object, renames according to the
    [`Spec`][spec]

### `Spec`

A spec is an object describing path properties to values.
For each property in `spec`, if its value is `string`, the value of the path
property on the given file is set.
If the value is `object`, it can have a `prefix` or `suffix` key, the value of
the path property on the given file is prefixed and/or suffixed.

Note that only [allowed][] path properties can be set, other properties are
thrown for.

## Contribute

See [`contributing.md`][contributing] in [`vfile/.github`][health] for ways to
get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/vfile/vfile-rename.svg

[build]: https://travis-ci.org/vfile/vfile-rename

[coverage-badge]: https://img.shields.io/codecov/c/github/vfile/vfile-rename.svg

[coverage]: https://codecov.io/github/vfile/vfile-rename

[downloads-badge]: https://img.shields.io/npm/dm/vfile-rename.svg

[downloads]: https://www.npmjs.com/package/vfile-rename

[size-badge]: https://img.shields.io/bundlephobia/minzip/vfile-rename.svg

[size]: https://bundlephobia.com/result?p=vfile-rename

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/vfile

[npm]: https://docs.npmjs.com/cli/install

[contributing]: https://github.com/vfile/.github/blob/HEAD/contributing.md

[support]: https://github.com/vfile/.github/blob/HEAD/support.md

[health]: https://github.com/vfile/.github

[coc]: https://github.com/vfile/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[vfile]: https://github.com/vfile/vfile

[allowed]: https://github.com/vfile/vfile/blob/d88717d/core.js#L15

[move]: #movefile

[spec]: #spec
