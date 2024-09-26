# UserInput

Often you want to check if the password matches some user content like their username or email.
For this purpose, add a `userInputs` dictionary with its own sanitizer.

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'

const password = 'somePassword'
const options = {
  dictionary: {
    userInputs: ['someEmail@email.de', 'someUsername'],
  },
}
const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password)
```

If you need to add the userInputs more dynamically your can add them as the second argument of the normal zxcvbn function like this
```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'

const password = 'somePassword'

const zxcvbn = new ZxcvbnFactory()
zxcvbn.check(password, ['someEmail@email.de', 'someUsername'])
```