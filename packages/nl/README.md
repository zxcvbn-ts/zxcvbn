
# @zxcvbn-ts/language-nl

The Dutch dictionary and language package for zxcvbn-ts. Since first and last names differ between Belgium and the Netherlands, these are not included in this package. You can get those from the @zxcvbn-ts/language-nl-be package (Dutch not added yet).

## Install

#### npm:

`npm install @zxcvbn-ts/language-nl --save`

#### yarn:

`yarn add @zxcvbn-ts/language-nl`

## Setup

```js
import zxcvbn from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnNlPackage from '@zxcvbn-ts/language-nl'

const password = 'somePassword'
const options = {
  translations: zxcvbnNlPackage.translations,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnNlPackage.dictionary,
  },
}

zxcvbn(password, options)
```

## License

The common words are licensed under Attribution-ShareAlike 3.0 Unported 
https://creativecommons.org/licenses/by-sa/3.0/

## Sources

Common words: https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/Dutch_wordlist