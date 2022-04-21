# vfile-rename

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`vfile`][vfile] utility to rename a file.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`rename(file, renames)`](#renamefile-renames)
    *   [`convert(renames)`](#convertrenames)
    *   [`Spec`](#spec)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a utility to add different data-driven ways to rename files.

## When should I use this?

This package is mostly useful when creating higher level tools that include
support for renaming files to end users.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install vfile-rename
```

In Deno with [`esm.sh`][esmsh]:

```js
import {rename} from 'https://esm.sh/vfile-rename@2'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {rename} from 'https://esm.sh/vfile-rename@2?bundle'
</script>
```

## Use

```js
import {VFile} from 'vfile'
import {rename} from 'vfile-rename'

const file = new VFile({path: 'readme.md'})
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

This package exports the identifiers `rename` and `convert`.
There is no default export.

### `rename(file, renames)`

Rename a file.
Calls `convert` and then the resulting [`move`][move] internally.

###### Overview

*   `'.md'` (`string` starting w/ dot) — change extension
*   `'example.md'` (`string` not starting w/ dot) — change basename
*   `{stem: 'readme'}` (`Record<Field, string>`) — change a field (supports
    `'path'`, `'basename'`, `'stem'`, `'extname'`, and/or `'dirname'`)
*   `{basename: {suffix: '-2'}}` (`Record<Field, SpecAffix>`) — prepend
    (`prefix`) or append (`suffix`) to a field

###### Parameters

*   `file` (`VFile`) — any value accepted by `vfile()`
*   `renames` (`string`, `Function`, `Spec`, or `Array<Rename>`, optional)

###### Returns

The given `file` (`VFile`).

### `convert(renames)`

Create a function (the [`move`][move]) from `renames` that when given a file
changes its path properties.

###### Parameters

*   `renames` (`string`, `Function`, `Spec`, or `Array<Rename>`, optional)

###### Returns

A [`move`][move].

#### `move(file)`

When given something, returns a [vfile][] from that and changes its path
properties.

*   if there is no bound rename (it’s `null` or `undefined`), makes sure `file`
    is a `VFile`
*   otherwise, if the bound rename is a normal string starting with a dot (`.`),
    sets `file.extname`
*   otherwise, if the bound rename is a normal string, sets `file.basename`
*   otherwise, if the bound test is an array, all renames in it are performed
*   otherwise, if the bound rename is an object, renames according to the
    [`Spec`][spec]

### `Spec`

An object describing path properties to values.
For each property in `spec`, if its value is `string`, the value of the path
property on the given file is set.
If the value is `object`, it can have a `prefix` or `suffix` key, the value of
the path property on the given file is prefixed and/or suffixed.

Note that only [allowed][] path properties can be set, other properties are
thrown for.

## Types

This package is fully typed with [TypeScript][].
The extra types `SpecAffix`, `Spec`, `Move`, and `Renames` are exported.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Security

Use of `vfile-rename` is safe by default.

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

[build-badge]: https://github.com/vfile/vfile-rename/workflows/main/badge.svg

[build]: https://github.com/vfile/vfile-rename/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/vfile/vfile-rename.svg

[coverage]: https://codecov.io/github/vfile/vfile-rename

[downloads-badge]: https://img.shields.io/npm/dm/vfile-rename.svg

[downloads]: https://www.npmjs.com/package/vfile-rename

[size-badge]: https://img.shields.io/bundlephobia/minzip/vfile-rename.svg

[size]: https://bundlephobia.com/result?p=vfile-rename

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/vfile/vfile/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[contributing]: https://github.com/vfile/.github/blob/main/contributing.md

[support]: https://github.com/vfile/.github/blob/main/support.md

[health]: https://github.com/vfile/.github

[coc]: https://github.com/vfile/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[vfile]: https://github.com/vfile/vfile

[allowed]: https://github.com/vfile/vfile/blob/d88717d/core.js#L15

[move]: #movefile

[spec]: #spec
