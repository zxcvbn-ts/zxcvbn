# Options

## setOptions

| Prop                   | Type    | Default           | Description                                                           |
| ---------------------- | ------- | ----------------- | --------------------------------------------------------------------- |
| dictionary             | Object  | {}                | Dictionaries for password comparison with common words/names etc.     |
| graphs                 | Object  | {}                | Keyboard layout to check for patterns on different kind of keyboards  |
| l33tTable              | Object  | L33tTable         | Table with matching alphabetical chars into numbers and special chars |
| translations           | Object  | Translations keys | Translations for the feedback                                         |
| useLevenshteinDistance | boolean | false             | Activate levenshtein                                                  |
| levenshteinThreshold   | number  | 2                 | Threshold for levenshtein                                             |

### dictionary

By default, there are no dictionaries, they are in the language packages.
There is an exceptional language package `common` which includes dictionaries that transcend languages like a password dictionary.
It is highly recommended using at least the common and english language package to get a good result.

### graphs

By default, there are no keyboard layouts used. It is recommended to add the common keyboard layout from the common language package
Currently these keyboard layouts are supported:

- azerty
- dvorak
- keypads
- qwerty
- qwertz

### l33tTable

This is a table with matches for letters from numbers and special characters in the context of [Leet speak](https://en.wikipedia.org/wiki/Leet).
E.g. an `a` can be written with `4` or `@`.
Normally you don't need to adjust this options.
If you find something missing in this table, feel free to open an issue or a PR.

### translations

By default, every feedback is a key. If you want to get real translated feedback you can use one of the [language](../languages) packages.

### useLevenshteinDistance

This variable is to activate the levenshtein distance check on the dictionary matcher. This will decrease the performance, and it is recommended to use the debounce helper.

### levenshteinThreshold

This variable is to define the threshold of the levenshtein check

## addMatcher

With this function you can add your own matcher for more information checkout the [matcher documentation](../matcher)
