# @zxcvbn-ts/language-fr

The French dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-fr --save`

#### yarn:

`yarn add @zxcvbn-ts/language-fr`

## Setup

```js
import zxcvbn from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnFrPackage from '@zxcvbn-ts/language-fr'

const password = 'somePassword'
const options = {
  translations: zxcvbnFrPackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnFrPackage.dictionary,
  },
}

zxcvbn(password, options)
```
