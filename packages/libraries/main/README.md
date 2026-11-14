# @zxcvbn-ts/core

[![npm](https://badgen.net/npm/v/@zxcvbn-ts/core)](https://www.npmjs.com/package/@zxcvbn-ts/core)
[![bundle size](https://badgen.net/bundlephobia/minzip/@zxcvbn-ts/core)](https://bundlephobia.com/package/@zxcvbn-ts/core)
[![license](https://badgen.net/npm/license/@zxcvbn-ts/core)](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt)
[![build](https://img.shields.io/github/actions/workflow/status/zxcvbn-ts/zxcvbn/build.yml?branch=master)](https://github.com/zxcvbn-ts/zxcvbn/actions/workflows/build.yml)

Realistic password strength estimation, written in TypeScript. This is the estimator of [zxcvbn-ts](https://github.com/zxcvbn-ts/zxcvbn), a rewrite of Dropbox's [zxcvbn](https://github.com/dropbox/zxcvbn).

📖 **[Documentation](https://zxcvbn-ts.github.io/zxcvbn/)** · [Getting started](https://zxcvbn-ts.github.io/zxcvbn/guide/getting-started/) · [Options](https://zxcvbn-ts.github.io/zxcvbn/guide/options/) · [Demo](https://zxcvbn-ts.github.io/zxcvbn/demo/) · [Migration](https://zxcvbn-ts.github.io/zxcvbn/guide/migration/)

zxcvbn is a password strength estimator inspired by password crackers. Instead of rules like "must contain a digit and a symbol", it estimates how many guesses an attacker would need. It recognizes common passwords, names, popular words and common words in many languages, as well as patterns like dates, repetitions (`aaa`), sequences (`abcd`), keyboard patterns (`qwertyuiop`) and l33t speak.

## Installation

The core is usually installed together with [`@zxcvbn-ts/language-common`](https://www.npmjs.com/package/@zxcvbn-ts/language-common) and at least one [language package](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/). Without dictionaries the estimation gets much less accurate.

```sh
# npm
npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en
# yarn
yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en
# pnpm
pnpm add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en
```

## Usage

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)

const result = zxcvbn.check('somePassword')
// with async matchers like @zxcvbn-ts/matcher-pwned
const asyncResult = await zxcvbn.checkAsync('somePassword')
```

Both methods take an optional second argument, `userInputs`: a list of strings such as the user's name or email, which are treated as a dictionary for this check only.

## Result

| Property                  | Description                                                                                 |
|---------------------------|---------------------------------------------------------------------------------------------|
| `score`                   | `0` (too guessable) to `4` (very unguessable), useful for a strength bar                    |
| `feedback.warning`        | What is wrong with the password, or `null`                                                  |
| `feedback.suggestions`    | A list of hints to choose a less guessable password                                         |
| `guesses`, `guessesLog10` | Estimated number of guesses needed to crack the password                                    |
| `crackTimes`              | Estimated crack times for online and offline attack scenarios, in seconds and display text |
| `sequence`                | The matched patterns the estimation is based on                                             |
| `calcTime`                | How long the calculation took, in milliseconds                                              |

See [getting started](https://zxcvbn-ts.github.io/zxcvbn/guide/getting-started/#output) for the full output.

## Features

- Dictionaries and feedback translations for [many languages](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/)
- Add your own words, e.g. your product or company name ([filtering custom words](https://zxcvbn-ts.github.io/zxcvbn/guide/filtering-custom-words/))
- [Custom matchers](https://zxcvbn-ts.github.io/zxcvbn/guide/matcher/), including async ones such as [`@zxcvbn-ts/matcher-pwned`](https://www.npmjs.com/package/@zxcvbn-ts/matcher-pwned)
- Optional Levenshtein distance matching against the dictionaries
- A `debounce` helper for checking as the user types
- [Lazy loading](https://zxcvbn-ts.github.io/zxcvbn/guide/lazy-loading/) of the dictionaries to keep your bundle small
- TypeScript types included

## License

[MIT](https://github.com/zxcvbn-ts/zxcvbn/blob/master/LICENSE.txt). Based on [zxcvbn](https://github.com/dropbox/zxcvbn) by Dropbox, also MIT licensed.
