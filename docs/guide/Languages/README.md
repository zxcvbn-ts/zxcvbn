# Languages

zxcvbn-ts is available for multiple languages. If your language is not supported you can set the options by yourself.

Current supported languages:
- german
- english

## Feedback
By default zxcvbn-ts uses `keys` as feedback. This way you can integrate zxcvbn-ts into your own translation system.
If you don't have a own translation system or want to use predefined translation you can use one of the language packs.
Each language pack has it's own translation file that you can use like this:

```js
import zxcvbn from '@zxcvbn-ts/core'
import { translations } from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  translations,
}

zxcvbn(password, options)
```

## Dictionary
By default zxcvbn-ts don't use any dictionaries to let the developer decided how much of the library will be used.
This makes the library tiny but inefficient compared to the original library.
It is recommended to use at least the common and english language package.

```js
import zxcvbn from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const password = 'somePassword'
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}

zxcvbn(password, options)
```
