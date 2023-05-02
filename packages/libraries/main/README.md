# zxcvbn-ts

**zxcvbn** is a password strength estimator inspired by password crackers.
It recognizes and analyzes over 40 thousand common passwords using pattern matching and conservative estimation and
filters out common first names, last names, popular words from Wikipedia and common words in many cultures,
and recognizes common patterns like dates, repetitions (e.g. 'aaa'), sequences (e.g. 'abcd'), keyboard smashes (e.g. 'qwertyuiop'), and l33t speak.

## Installation

#### npm:

`npm install @zxcvbn-ts/core @zxcvbn-ts/language-common --save`

#### yarn:

`yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common`

## Setup

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  translations: zxcvbnEnPackage.translations,
}
zxcvbnOptions.setOptions(options)

zxcvbn(password)
```
