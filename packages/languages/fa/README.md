# @zxcvbn-ts/language-fa

The Persian dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-fa --save`

#### yarn:

`yarn add @zxcvbn-ts/language-fa`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnFaPackage from '@zxcvbn-ts/language-fa'

const password = 'somePassword'
const options = {
  translations: zxcvbnFaPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnFAPackage.dictionary,
  },
}

const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```
