# UserInput

Often you want to check if the password matches some user content like their username or email.
For this purpose, add a `userInputs` dictionary with its own sanitizer.


```js
import { zxcvbn, ZxcvbnOptions } from '@zxcvbn-ts/core'

const password = 'somePassword'
const options = {
  dictionary: {
    userInputs: ['someEmail@email.de', 'someUsername'],
  },
}
ZxcvbnOptions.setOptions(options)

zxcvbn(password)
```
