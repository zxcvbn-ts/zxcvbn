# @zxcvbn-ts/language-fa

The Persian dictionary and language package for zxcvbn-ts


## Install

#### npm:

`npm install @zxcvbn-ts/language-fa --save`

#### yarn:

`yarn add @zxcvbn-ts/language-fa`

## Setup

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnFaPackage from '@zxcvbn-ts/language-fa'

const password = 'یک رمز عبور'
const options = {
  translations: zxcvbnFaPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnFaPackage.dictionary,
  },
}

zxcvbnOptions.setOptions(options)

zxcvbn(password)
```
