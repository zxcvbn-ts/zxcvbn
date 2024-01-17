# @zxcvbn-ts/language-es-es

The European Spanish dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-es-es --save`

#### yarn:

`yarn add @zxcvbn-ts/language-es-es`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEsEsPackage from '@zxcvbn-ts/language-es-es'

const password = 'somePassword'
const options = {
  translations: zxcvbnEsEsPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEsEsPackage.dictionary,
  },
}

const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```
