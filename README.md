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

## Language packages
If your language is missing as a language pack checkout the [guide](https://zxcvbn-ts.github.io/zxcvbn/guide/Languages/#add-a-new-language-package) to add your own.
