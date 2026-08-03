# @zxcvbn-ts/language-ru

The Russian language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-ru --save`

#### yarn:

`yarn add @zxcvbn-ts/language-ru`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnRuPackage from '@zxcvbn-ts/language-ru'

const password = 'somePassword'
const options = {
  translations: zxcvbnRuPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnRuPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```

## Sources

This package currently only provides `translations` for the warning and
suggestion messages. It does not yet ship a Russian dictionary
(`firstnames`/`lastnames`/`commonWords`); contributions adding reliable
sources for those lists are welcome per the
[language guide](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/#add-a-new-language-package).
