# @zxcvbn-ts/language-common

The common dictionary and language package for zxcvbn-ts

## Install

#### npm:

`npm install @zxcvbn-ts/language-common --save`

#### yarn:

`yarn add @zxcvbn-ts/language-common`

## Setup

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'

const password = 'somePassword'
const options = {
  ...zxcvbnCommonPackage,
}

const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```
