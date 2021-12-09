# @zxcvbn-ts/language-es

The Spanish dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-es --save`

#### yarn:

`yarn add @zxcvbn-ts/language-es`

## Setup

```js
import { zxcvbn, ZxcvbnOptions } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-es'

const password = 'somePassword'
const options = {
  translations: zxcvbnEsPackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEsPackage.dictionary,
  },
}

ZxcvbnOptions.setOptions(options)

zxcvbn(password)
```
