# @zxcvbn-ts/language-fi

The Finnish dictionary and language package for zxcvbn-ts

Data sources for first and last names:

    https://www.avoindata.fi/data/fi/dataset/none

## Install

#### npm:

`npm install @zxcvbn-ts/language-fi --save`

#### yarn:

`yarn add @zxcvbn-ts/language-fi`

## Setup

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnFiPackage from '@zxcvbn-ts/language-fi'

const password = 'somePassword'
const options = {
  translations: zxcvbnFiPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnFiPackage.dictionary,
  },
}

zxcvbnOptions.setOptions(options)

zxcvbn(password)
```
