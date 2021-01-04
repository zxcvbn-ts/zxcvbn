# Options

| Prop         | Type   | Default           | Description                                                           |
| ------------ | ------ | ----------------- | --------------------------------------------------------------------- |
| dictionary   | Object | {}                | Dictionaries for password comparison with common words/names etc.     |
| graphs       | Object | Keyboard Layouts  | Keyboard layout to check for patterns on different kind of keyboards  |
| l33tTable    | Object | L33tTable         | Table with matching alphabetical chars into numbers and special chars |
| translations | Object | Translations keys | Translations for the feedback                                         |

## dictionary
By default there are no dictionaries, they are in the language packages.
There is an exceptional language package `common` which includes dictionaries that transcend languages like a password dictionary.
It is highly recommended to use at least the common and english language package to get a good result.

## graphs
By default all included Keyboard layout are used simultaneously. This means that pattern can be found for qwerty and qwertz keyboard.
Currently those keyboards are used:
- qwertz
- qwerty
- dvroak
- keypads

## l33tTable
This is a table which matches alphabetical chars with numbers and special characters for [Leet speak](https://en.wikipedia.org/wiki/Leet).
For example an `a` can be written with `4` or `@`.
Normally you don't need to adjust this options. If you think this table is not complete feel free to open an issue or a PR.

## translations
By default every feedback is a key. If you want to get real translated feedback you can use one of the [language](/Languages) packages.
