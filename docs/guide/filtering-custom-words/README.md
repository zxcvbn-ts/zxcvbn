# Filtering custom words
Zxcvbn-ts comes with pre-built dictionaries for various languages. However, it’s often beneficial to extend these dictionaries with custom entries specific to your application. Custom dictionaries can help improve password strength by identifying unique terms relevant to your user base.

The dictionary is provided as a Record<string, string[]>, which allows you to add key-value pairs, where the key is a custom label, and the value is an array of strings. You can extend this object as needed.

## UserInput

In many cases, you may want to check if a password matches any user-specific content, such as their username or email address. For this purpose, you can add a userInputs dictionary along with its own sanitizer.

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

If you need to dynamically add user inputs (e.g., during user registration when they enter their name, email, etc.), you can pass the user inputs as the second argument to the check method.
```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'

const password = 'somePassword'

const zxcvbn = new ZxcvbnFactory()
zxcvbn.check(password, ['someEmail@email.de', 'someUsername'])
```
This is especially useful during registration when the user provides personal information that should not be included in their password.

## Handling Duplicate Entries in Dictionaries
If you have large dictionaries and are unsure whether some entries overlap, don't worry. The algorithm will automatically prioritize the first match it finds for any word present in multiple dictionaries, ensuring efficient processing.

## Performance of large dictionaries
The recommended dictionaries in Zxcvbn-ts already contain over 100,000 words, and even with these large dictionaries, the algorithm performs efficiently, processing results in under 100ms.

While using large dictionaries can seem like it may slow down the process, the library is optimized to handle these dictionaries quickly, making it suitable for real-world applications without compromising performance.
