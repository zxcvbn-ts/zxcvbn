# zxcvbn-ts

`zxcvbn` is a password strength estimator inspired by password crackers. Through pattern matching and conservative estimation, it recognizes and weighs 30k common passwords, common names and surnames according to US census data, popular English words from Wikipedia and US television and movies, and other common patterns like dates, repeats (`aaa`), sequences (`abcd`), keyboard patterns (`qwertyuiop`), and l33t speak.

Consider using zxcvbn as an algorithmic alternative to password composition policy — it is more secure, flexible, and usable when sites require a minimal complexity score in place of annoying rules like "passwords must contain three of {lower, upper, numbers, symbols}".

## Install

#### npm:

`npm install @zxcvbn-ts/core @zxcvbn-ts/language-common --save`

#### yarn:

`yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common`

## Setup

```js
import zxcvbn from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const userInput = []
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  translations: zxcvbnEnPackage.translations,
}

zxcvbn(password, userInputs, options)
```

## Migration guide

- The dictionary list is outsourced by default to decrease the bundle size and make i18n possible.
  We recommend to include at least one of the available language packages.
  If your language is not available at least include the english language package.
  If you won't include the dictionary list the password strength effectiveness is decrease rapidly

```js
import zxcvbn from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const userInput = []
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}

zxcvbn(password, userInputs, options)
```

- We implemented i18n support for all texts. By default the texts were changed to keys.
  This way you can use your own language translation setup or include one of the available language packages

```js
import zxcvbn from 'zxcvbn-ts'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const userInput = []
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
  },
  translations: zxcvbnEnPackage.translations,
}

zxcvbn(password, userInputs, options)
```
