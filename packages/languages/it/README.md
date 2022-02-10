# @zxcvbn-ts/language-it

The Italian dictionary and language package for zxcvbn-ts


## Install

#### npm:

`npm install @zxcvbn-ts/language-it --save`

#### yarn:

`yarn add @zxcvbn-ts/language-it`

## Setup

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnItPackage from '@zxcvbn-ts/language-it'

const password = 'somePassword'
const options = {
  translations: zxcvbnItPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnItPackage.dictionary,
  },
}

zxcvbnOptions.setOptions(options)

zxcvbn(password)
```
