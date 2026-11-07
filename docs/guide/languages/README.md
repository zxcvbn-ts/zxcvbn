# Languages

`zxcvbn-ts` is available for multiple languages. If your language is not supported you can set the options by yourself.

Current supported languages:

- Arabic
- Chinese
- Croatian
- Czech
- Danish (Denmark)
- Dutch (Belgium)
- English
- Farsi (Persian)
- Finnish
- French
- German
- Indonesia
- Italian
- Japanese
- Korean
- Kurmanjî (Kurdish)
- Polish
- Portuguese (Brazil)
- Romanian
- Russian
- Spanish (Spain)
- Thai
- Turkish

## Feedback

By default, `zxcvbn-ts` uses `keys` as feedback. This way you can integrate `zxcvbn-ts` into your own translation system.
If you don't have an own translation system or want to use predefined translation you can use one of the language packs.
Each language pack has its own translation file that you can use like this:
```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import { translations } from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  translations,
}

const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```

### Translation keys

Without translations, `feedback.warning` and `feedback.suggestions` contain these keys (without the group prefix) and `crackTimes.*.display` contains the `timeEstimation` key. Use `crackTimes.*.base` for the number in your own translation.
If you pass your own `translations`, every key has to be there, as a string or a function, otherwise `ZxcvbnFactory` throws `Invalid translations object, missing or invalid keys: <keys>`, listing the keys to fix. This includes the `pwned` keys, even if you don't use the [pwned matcher](../pwned-matcher/).
A [custom matcher](../matcher/#custom-matcher) can return its own feedback and doesn't need a key here.

| Key | English translation |
|-----|---------------------|
| `warnings.straightRow` | Straight rows of keys on your keyboard are easy to guess. |
| `warnings.keyPattern` | Short keyboard patterns are easy to guess. |
| `warnings.simpleRepeat` | Repeated characters like "aaa" are easy to guess. |
| `warnings.extendedRepeat` | Repeated character patterns like "abcabcabc" are easy to guess. |
| `warnings.sequences` | Common character sequences like "abc" are easy to guess. |
| `warnings.recentYears` | Recent years are easy to guess. |
| `warnings.dates` | Dates are easy to guess. |
| `warnings.topTen` | This is a heavily used password. |
| `warnings.topHundred` | This is a frequently used password. |
| `warnings.common` | This is a commonly used password. |
| `warnings.similarToCommon` | This is similar to a commonly used password. |
| `warnings.wordByItself` | Single words are easy to guess. |
| `warnings.namesByThemselves` | Single names or surnames are easy to guess. |
| `warnings.commonNames` | Common names and surnames are easy to guess. |
| `warnings.userInputs` | There should not be any personal or page related data. |
| `warnings.pwned` | Your password was exposed by a data breach on the Internet. |
| `suggestions.l33t` | Avoid predictable letter substitutions like '@' for 'a'. |
| `suggestions.reverseWords` | Avoid reversed spellings of common words. |
| `suggestions.allUppercase` | Capitalize some, but not all letters. |
| `suggestions.capitalization` | Capitalize more than the first letter. |
| `suggestions.dates` | Avoid dates and years that are associated with you. |
| `suggestions.recentYears` | Avoid recent years. |
| `suggestions.associatedYears` | Avoid years that are associated with you. |
| `suggestions.sequences` | Avoid common character sequences. |
| `suggestions.repeated` | Avoid repeated words and characters. |
| `suggestions.longerKeyboardPattern` | Use longer keyboard patterns and change typing direction multiple times. |
| `suggestions.anotherWord` | Add more words that are less common. |
| `suggestions.useWords` | Use multiple words, but avoid common phrases. |
| `suggestions.noNeed` | You can create strong passwords without using symbols, numbers, or uppercase letters. |
| `suggestions.pwned` | If you use this password elsewhere, you should change it. |
| `timeEstimation.ltSecond` | less than a second |
| `timeEstimation.second` | {base} second |
| `timeEstimation.seconds` | {base} seconds |
| `timeEstimation.minute` | {base} minute |
| `timeEstimation.minutes` | {base} minutes |
| `timeEstimation.hour` | {base} hour |
| `timeEstimation.hours` | {base} hours |
| `timeEstimation.day` | {base} day |
| `timeEstimation.days` | {base} days |
| `timeEstimation.month` | {base} month |
| `timeEstimation.months` | {base} months |
| `timeEstimation.year` | {base} year |
| `timeEstimation.years` | {base} years |
| `timeEstimation.centuries` | centuries |

### Pluralization

For the `timeEstimation` translations, you can use a string with a `{base}` placeholder or a function for more complex pluralization rules.

```js
const translations = {
  warnings: {
    // ...
  },
  suggestions: {
    // ...
  },
  timeEstimation: {
    ltSecond: 'less than a second',
    second: '{base} second',
    seconds: (value) => {
      if (value === 2) return 'exactly two seconds'
      return `${value} seconds`
    },
    // ...
  },
}
```

## Dictionary

By default, `zxcvbn-ts` doesn't use any dictionaries to let the developer decide how much of the library will be used.
This makes the library tiny but inefficient compared to the original library.
It is recommended to use at least the common and English language package.

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}

const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```

## Keyboard patterns

By default, `zxcvbn-ts` doesn't use any keyboard patterns to let the developer decide how much of the library will be used.
It is recommended to use at least the common keyboard patterns.

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'

const password = 'somePassword'
const options = {
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
}

const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```

## Add a new language package

To add a missing language package you need to do the following things:

- Clone the repo.
- Install dependencies with `yarn install`.
- Create a new language package inside the `packages/languages` directory. You need following file structure:

```yaml
- src
  - translations.ts
- package.json
- README.md
- tsconfig.json
```

- Fill `src/translations.ts` with translations for your language. You can use strings with `{base}` or functions for `timeEstimation` if your language has complex pluralization rules.
- Adjust `README.md` file as appropriate.
- Find some reliable sources for some dictionaries. As a minimum, you need to have a source for `firstname`, `lastname` and `commonWords`.
  For common words you can use the [OpenSubtitles](https://opus.nlpl.eu/datasets/OpenSubtitles) frequency lists like the other languages (`https://object.pouta.csc.fi/OPUS-OpenSubtitles/v2024/freq/XX.freq.gz` with the `CommonWordsGenerator`) - there are a lot of languages available.
- Add your language and sources to the generator list in `./data-scripts/lists.ts`.

  There is a default generator that takes simple lists that have only single words per line and can have occurrences of that word with a space separator.
  For example something like this:

  ```txt
  John
  Debra
  Billy
  ```

  or:

  ```txt
  you 23123
  i 12345
  the 234
  ```

  If your list is more complex you need to write your own generator like the [password generator](https://github.com/zxcvbn-ts/zxcvbn/blob/master/data-scripts/_generators/PasswordGenerator.ts) or the [keyboard generator](https://github.com/zxcvbn-ts/zxcvbn/blob/master/data-scripts/_generators/KeyboardAdjacencyGraph.ts)

- Run `yarn generate:languageData`. This will generate the JSON files and `index.ts`. The dictionary keys in `index.ts` get your language code as suffix, e.g. `commonWords-de`.
- During debugging, it might be easy to only generate the language files for one
  language, use `yarn generate:languageData nl-be` for example.
- Create a pull request to the master branch.
- _(Optional)_ Use the Wikipedia extractor; one of the maintainers can do this but this will increase the time until it is merged.

  - Get the wikipedia dump for your language from <https://dumps.wikimedia.org/XXwiki/latest/XXwiki-latest-pages-articles.xml.bz2> where `XX` is your language like `en` or `de`.
  - Install [`wikiextractor`](https://github.com/attardi/wikiextractor): `pip
install wikiextractor`. Currently, with v3.0.4 it only works correctly on Linux.
  - Run `wikiextractor`:

    ```sh
    wikiextractor --no-templates -o data-scripts/wikiExtractor/extracts XXwiki-latest-pages-articles.xml.bz2
    ```

  - Run `yarn run wikipediaExtractor` to generate `wikipedia.json` from all the files inside the `extracts` folder.
  - Move `wikipedia.json` into your language package.
