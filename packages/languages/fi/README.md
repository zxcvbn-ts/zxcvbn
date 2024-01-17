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
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnFiPackage from '@zxcvbn-ts/language-fi'

const password = 'somePassword'
const options = {
  translations: zxcvbnFiPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnFiPackage.dictionary,
  },
}

const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```

## source:

The date is fetch from:
https://www.avoindata.fi/data/dataset/57282ad6-3ab1-48fb-983a-8aba5ff8d29a/resource/957d19a5-b87a-4c4d-8595-49c22d9d3c58
https://www.avoindata.fi/data/dataset/57282ad6-3ab1-48fb-983a-8aba5ff8d29a/resource/08c89936-a230-42e9-a9fc-288632e234f5

This data is updated regularly and the download link will change because the date of the change is inside the link
