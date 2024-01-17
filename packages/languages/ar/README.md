# @zxcvbn-ts/language-ar

The Arabic dictionary and language package for **zxcvbn-ts**

## Installation

#### npm:

`npm install @zxcvbn-ts/language-ar --save`

#### yarn:

`yarn add @zxcvbn-ts/language-ar`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnArPackage from '@zxcvbn-ts/language-ar'

const password = 'somePassword'
const options = {
  translations: zxcvbnArPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnArPackage.dictionary,
  },
}
const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```
