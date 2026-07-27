# @zxcvbn-ts/language-ko

The Korean language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-ko --save`

#### yarn:

`yarn add @zxcvbn-ts/language-ko`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnKoPackage from '@zxcvbn-ts/language-ko'

const password = 'somePassword'
const options = {
  translations: zxcvbnKoPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnKoPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```

## Sources

This package currently only provides `translations` for the warning and
suggestion messages. It does not yet ship a Korean dictionary
(`firstnames`/`lastnames`/`commonWords`); contributions adding reliable
sources for those lists are welcome per the
[language guide](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/#add-a-new-language-package).
