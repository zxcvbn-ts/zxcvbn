# UserInput

Often you want to check if the password matches some user content like their username or email.
For this purpose, add a `userInputs` dictionary with its own sanitizer.

```js
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'

const password = 'somePassword'
const options = {
  dictionary: {
    userInputs: ['someEmail@email.de', 'someUsername'],
  },
}
zxcvbnOptions.setOptions(options)

zxcvbn(password)
```

If you need to add the userInputs more dynamically your can add them as the second argument of the normal zxcvbn function like this
```js
import { zxcvbn } from '@zxcvbn-ts/core'

const password = 'somePassword'

zxcvbn(password, ['someEmail@email.de', 'someUsername'])
```