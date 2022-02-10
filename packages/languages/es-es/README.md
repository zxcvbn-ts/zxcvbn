# @zxcvbn-ts/language-es-es

The European Spanish dictionary and language package for zxcvbn-ts


## Install

#### npm:

`npm install @zxcvbn-ts/language-es-es --save`

#### yarn:

`yarn add @zxcvbn-ts/language-es-es`

## Setup

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEsEsPackage from '@zxcvbn-ts/language-es-es'

const password = 'somePassword'
const options = {
  translations: zxcvbnEsEsPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEsEsPackage.dictionary,
  },
}

zxcvbnOptions.setOptions(options)

zxcvbn(password)
```
