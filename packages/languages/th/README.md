# @zxcvbn-ts/language-th

The Thai dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-th --save`

#### yarn:

`yarn add @zxcvbn-ts/language-th`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnItPackage from '@zxcvbn-ts/language-th'

const password = 'somePassword'
const options = {
  translations: zxcvbnItPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnItPackage.dictionary,
  },
}

const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```
s