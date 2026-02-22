# @zxcvbn-ts/language-zh

The Chinese dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-zh --save`

#### yarn:

`yarn add @zxcvbn-ts/language-zh`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnZhPackage from '@zxcvbn-ts/language-zh'

const password = 'somePassword'
const options = {
  translations: zxcvbnZhPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnZhPackage.dictionary,
  },
}

const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```
