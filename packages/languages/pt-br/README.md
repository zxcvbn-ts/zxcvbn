# @zxcvbn-ts/language-pt-br

The Brazilian portuguese dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-pt-br --save`

#### yarn:

`yarn add @zxcvbn-ts/language-pt-br`

## Setup

```js
import zxcvbn from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnPtBrPackage from '@zxcvbn-ts/language-pt-br'

const password = 'somePassword'
const options = {
  translations: zxcvbnPtBrPackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnPtBrPackage.dictionary,
  },
}

zxcvbn(password, options)
```
