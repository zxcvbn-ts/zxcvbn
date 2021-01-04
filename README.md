[![@zxcvbn-ts/core](https://badgen.net/bundlephobia/min/@zxcvbn-ts/core)](https://bundlephobia.com/result?p=@zxcvbn-ts/core)
[![@zxcvbn-ts/core](https://badgen.net/npm/v/@zxcvbn-ts/core)](https://www.npmjs.com/package/@zxcvbn-ts/core)

# zxcvbn-ts

This is a complete rewrite of [zxcvbn](https://github.com/dropbox/zxcvbn) into typescript
which is licensed under the [MIT](https://github.com/dropbox/zxcvbn/blob/master/LICENSE.txt) license.
Thanks to the original creators [dropbox](https://github.com/dropbox) for the great work.

>zxcvbn attempts to give sound password advice through pattern matching and conservative entropy calculations. It finds 10k common passwords, common American names and surnames, common English words, and common patterns like dates, repeats (aaa), sequences (abcd), and QWERTY patterns.

The reason of this project is to modernize zxcvbn and make it maintainable with new features.

- [Features](#features)
- [Documentation](#Documentation)
- [Contribution](#Contribution)

## Features

- estimate strength of a password
- get a score for the password
- i18n support, for dictionaries and feedback translations
- extend existing dictionaries with your own
- usable without dictionaries at all, which reduce the scoring efficiency rapidly. This is not recommended
- types

## Documentation

Checkout the [Documentation](https://zxcvbn-ts.github.io/zxcvbn/).
There you will also find the [Demo](https://zxcvbn-ts.github.io/zxcvbn/demo/) pages
and the [Migration](https://zxcvbn-ts.github.io/zxcvbn/guide/Migration) guide.

## Contribution

Please feel free to [open up an issue](https://github.com/zxcvbn-ts/zxcvbn/issues/new) or provide a pull request.

New Features:

- add i18n support warning, suggestions and times are now translateable with a english default translation
- every match type can be deactivated. For example you can deactivate the `dictionary` to stop using the really big frequency list
- you can customize everything. Use your own l33t table, your own adjacency graphs or your complete self made dictonary
- rewritten in es6
- tests and coverage with jest
- esm build for treeshaking
- use prettier and eslint for clean code
- use custom adjacency_graphs in guesses/spatial.js
- remove more references
- fix rewarding of capitalize first letter https://github.com/dropbox/zxcvbn/issues/232
- typescript support
- multi frequency and multi adjacency_graphs lists
- use typescript for data-scripts
