# @zxcvbn-ts/language-ro

The Romanian dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-ro --save`

#### yarn:

`yarn add @zxcvbn-ts/language-ro`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnRoPackage from '@zxcvbn-ts/language-ro'

const password = 'somePassword'
const options = {
  translations: zxcvbnRoPackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnRoPackage.dictionary,
  },
}

const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```
