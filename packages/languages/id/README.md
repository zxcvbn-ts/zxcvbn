# @zxcvbn-ts/language-id

The Indonesia dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-id --save`

#### yarn:

`yarn add @zxcvbn-ts/language-id`

## Setup

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnIdPackage from '@zxcvbn-ts/language-id'

const password = 'somePassword'
const options = {
  translations: zxcvbnIdPackage.translations,
  graphs: zxcvbnCommonPackage.adjacidcyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnIdPackage.dictionary,
  },
}

zxcvbnOptions.setOptions(options)

zxcvbn(password)
```
