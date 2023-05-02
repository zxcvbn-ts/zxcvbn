# @zxcvbn-ts/language-cs

The Czech dictionary and language package for zxcvbn-ts


## Install

#### npm:

`npm install @zxcvbn-ts/language-cs --save`

#### yarn:

`yarn add @zxcvbn-ts/language-cs`

## Setup

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnCsPackage from '@zxcvbn-ts/language-cs'

const password = 'somePassword'
const options = {
  translations: zxcvbnCsPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnCsPackage.dictionary,
  },
}

zxcvbnOptions.setOptions(options)

zxcvbn(password)
```
