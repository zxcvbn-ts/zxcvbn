# @zxcvbn-ts/language-es

The European Spanish dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-es-es --save`

#### yarn:

`yarn add @zxcvbn-ts/language-es-es`

## Setup

```js
import { zxcvbn, ZxcvbnOptions } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEsEsPackage from '@zxcvbn-ts/language-es-es'

const password = 'somePassword'
const options = {
  translations: zxcvbnEsEsPackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEsEsPackage.dictionary,
  },
}

ZxcvbnOptions.setOptions(options)

zxcvbn(password)
```
