# @zxcvbn-ts/language-de

The German dictionary and language package for **zxcvbn-ts**

## Installation

#### npm:

`npm install @zxcvbn-ts/language-de --save`

#### yarn:

`yarn add @zxcvbn-ts/language-de`

## Setup

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnDePackage from '@zxcvbn-ts/language-de'

const password = 'somePassword'
const options = {
  translations: zxcvbnDePackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnDePackage.dictionary,
  },
}
zxcvbnOptions.setOptions(options)

zxcvbn(password)
```
