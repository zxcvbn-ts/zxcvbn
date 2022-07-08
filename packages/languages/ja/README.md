# @zxcvbn-ts/language-ja

The Japanese dictionary and language package for zxcvbn-ts


## Install

#### npm:

`npm install @zxcvbn-ts/language-ja --save`

#### yarn:

`yarn add @zxcvbn-ts/language-ja`

## Setup

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnJaPackage from '@zxcvbn-ts/language-ja'

const password = 'somePassword'
const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnJaPackage.dictionary,
  },
}

zxcvbnOptions.setOptions(options)

zxcvbn(password)
```
