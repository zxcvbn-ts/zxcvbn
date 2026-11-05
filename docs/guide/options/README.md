# Options

The options can be passed to the `ZxcvbnFactory` constructor.

```js
const options = {
  // your options
}
const zxcvbn = new ZxcvbnFactory(options)
```

## Available Options

| Prop                   | Type    | Default           | Description                                                          |
|------------------------| ------- |-------------------|----------------------------------------------------------------------|
| dictionary             | Object  | {}                | Dictionaries for password comparison with common words/names etc.    |
| graphs                 | Object  | {}                | Keyboard layout to check for patterns on different kind of keyboards |
| l33tTable              | Object  | L33tTable         | Table with matching alphabetical chars into numbers and special chars|
| translations           | Object  | Translations keys | Translations for the feedback                                        |
| useLevenshteinDistance | boolean | false             | Activate levenshtein                                                 |
| levenshteinThreshold   | number  | 2                 | Threshold for levenshtein                                            |
| l33tMaxSubstitutions   | number  | 100               | Max fully substituted passwords checked with levenshtein             |
| maxLength              | number  | 256               | Defines how many characters of the password are checked              |
| timeEstimationValues   | Object  | see below         | Define the values to calculate the scoring and attack times          |

### dictionary

By default, there are no dictionaries, they are in the language packages.
There is an exceptional language package `common` which includes dictionaries that transcend languages like a password dictionary.
We highly recommend using at least the common and English language packages to get a good result, see the [recommended setup](../getting-started/#recommended-setup).

### graphs

By default, there are no keyboard layouts used. It is recommended to add the keyboard layouts from the common language package.
Currently these keyboard layouts are supported:

- azerty
- dvorak
- keypad
- qwerty
- qwertz

### l33tTable

This is a table with matches for letters from numbers and special characters in the context of [Leet speak](https://en.wikipedia.org/wiki/Leet).
E.g. an `a` can be written with `4` or `@`.
Normally you don't need to adjust this option.
If you find something missing in this table, feel free to open an issue or a PR.

### translations

By default, every feedback is a key. If you want to get real translated feedback you can use one of the [language](../languages) packages.

### useLevenshteinDistance

This variable is to activate the levenshtein distance check on the dictionary matcher. It is only applied to the complete password, not to parts of it. This will decrease the performance, so it is recommended to use the [debounce helper](../examples/#debounce).

### levenshteinThreshold

This variable defines how many characters (insertions, deletions or substitutions) the full password can differ from a dictionary word to still match it, whatever the length of the password.
An emoji counts as one character. If several dictionary words are close enough, the most common one is matched, even if the password itself is a less common word of the same dictionary.

### l33tMaxSubstitutions

Only used together with `useLevenshteinDistance`: the l33t matcher checks the password with every possible substitution made for a close dictionary entry, and this caps how many of those fully substituted passwords are checked, as each costs a levenshtein search. The l33t matches without levenshtein are found by walking the dictionaries and don't depend on it.

### maxLength

Defines how many characters of the password are checked. A password longer than the default is considered strong anyway, but it can be increased as pleased. Be aware that this could open some attack vectors.

The length is counted in UTF-16 code units, like JavaScript's `string.length`, so an emoji or another character outside the Basic Multilingual Plane counts as two. A character is never cut in half: if the limit falls inside one, the whole character is left out.


### timeEstimationValues

Define the values to calculate the scoring and attack times. DO NOT CHANGE unless you know what you are doing. The default values are just fine as long as you are using a strong, slow hash function. Can be adjusted to account for increasingly powerful attacker hardware.

`scoring` defines the guess thresholds for the scores: a password gets the score of the first threshold it is below, and 4 if it is above all of them.
`attackTime` defines the guesses per hour (`onlineThrottlingXPerHour`) or per second (the others) of each attack scenario, which are used for `result.crackTimes`.
The values are not merged with the defaults, so you always need to pass the complete object, otherwise an error is thrown.

A value can only be raised: lowering a `scoring` threshold or an `attackTime` value would make passwords look stronger than they are, so a value below its default throws an error.

```js
// default values
const timeEstimationValues = {
  scoring: {
    0: 1e3,
    1: 1e6,
    2: 1e8,
    3: 1e10,
  },
  attackTime: {
    onlineThrottlingXPerHour: 100,
    onlineNoThrottlingXPerSecond: 10,
    offlineSlowHashingXPerSecond: 1e4,
    offlineFastHashingXPerSecond: 1e10,
  },
}
```

## Validation

The options are validated when the `ZxcvbnFactory` is created. An invalid value throws an error instead of being ignored, so a mistake can't silently weaken the estimation:

| Option                                                         | Error                                                                                                                                                                                     |
|----------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dictionary                                                     | `dictionary must be an object`, `dictionary list must be an array`, `dictionary entries must be strings or numbers`                                                                       |
| graphs                                                         | `graphs must be an object`, `graph must be an object`, `graph adjacencies must be an array`, `graph adjacency must be a string or null`                                                   |
| l33tTable                                                      | `l33tTable must be an object`, `l33tTable substitutions must be an array`, `l33tTable substitutions must be strings`                                                                      |
| translations                                                   | `Invalid translations object, missing or invalid keys: <keys>`, if a [translation key](../languages/#translation-keys) is missing or isn't a string or a function |
| useLevenshteinDistance                                         | `useLevenshteinDistance must be a boolean`                                                                                                                                                |
| levenshteinThreshold, l33tMaxSubstitutions, maxLength          | `<option> must be a non-negative number`                                                                                                                                                  |
| timeEstimationValues                                           | `timeEstimationValues must be an object`, `timeEstimationValues.<key> is required`, `timeEstimationValues.<key>.<subKey> must be a number`, `Time estimation values are not to be allowed to be less than default` |
| custom matchers                                                | `customMatchers must be an object`, `matcher <name> must be an object`, `matcher <name>.feedback must be a function`, `matcher <name>.scoring must be a function`, `matcher <name>.Matching must be a constructor` |

The name of a custom matcher isn't checked against the built-in ones: a custom matcher named e.g. `dictionary` replaces the built-in dictionary matcher, which makes passwords look much stronger than they are. Always give your matchers a name of their own.

## Custom Matchers

With the second parameter of `ZxcvbnFactory` you can add your own matchers. For more information check out the [matcher documentation](../matcher)
