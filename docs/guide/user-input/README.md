# UserInput

Often you want to check if the password matches some user content like his username or e-mail.
For this reason you can add a `userInputs` dictionary which has simple sanitizer.


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
