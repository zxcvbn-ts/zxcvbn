# Options

## setOptions

| Prop                   | Type    | Default           | Description                                                          |
|------------------------| ------- |-------------------|----------------------------------------------------------------------|
| dictionary             | Object  | {}                | Dictionaries for password comparison with common words/names etc.    |
| graphs                 | Object  | {}                | Keyboard layout to check for patterns on different kind of keyboards |
| l33tTable              | Object  | L33tTable         | Table with matching alphabetical chars into numbers and special chars|
| translations           | Object  | Translations keys | Translations for the feedback                                        |
| useLevenshteinDistance | boolean | false             | Activate levenshtein                                                 |
| levenshteinThreshold   | number  | 2                 | Threshold for levenshtein                                            |
| l33tMaxSubstitutions   | number  | 100               | Indicated the max substituions for the l33t matcher to prevent DOS   |
| maxLength              | number  | 256               | Defines how many characters of the password are checked              |
| timeEstimationValues   | Object  | {}                | Define the values to calculate the scoring and attack times          |

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

### l33tMaxSubstitutions

The l33t matcher will check how many characters can be exchanged with the l33t table. If they are to many it will decrease the calcTime significantly. So we cap it at a reasonable value by default which will probably already seems like a strong password anyway.

### maxLength

Defines how many character of the password are checked. A password longer than the default are considered strong anyway, but it can be increased as pleased. Be aware that this could open some attack vectors.


## timeEstimationValues

Define the values to calculate the scoring and attack times. DO NOT CHANGE unless you know what you are doing. The default values are just fine as long as you are using a strong, slow hash function. Can be adjusted to account for increasingly powerful attacker hardware.

## addMatcher

With this function you can add your own matcher for more information checkout the [matcher documentation](../matcher)
