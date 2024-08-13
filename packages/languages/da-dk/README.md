# @zxcvbn-ts/language-en

The Danish dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-da-dk --save`

#### yarn:

`yarn add @zxcvbn-ts/language-da-dk`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnDaDkPackage from '@zxcvbn-ts/language-da-dk'

const password = 'nogleAdgangskode'
const options = {
  translations: zxcvbnDaDkPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnDaDkPackage.dictionary,
  },
}

const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```
