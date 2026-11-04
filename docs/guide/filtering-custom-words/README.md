# Filtering custom words
zxcvbn-ts comes with pre-built dictionaries for various languages. However, it’s often beneficial to extend these dictionaries with custom entries specific to your application. Custom dictionaries can help improve password strength by identifying unique terms relevant to your user base.

The dictionary is provided as a `Record<string, (string | number)[]>`, which allows you to add key-value pairs, where the key is a custom label, and the value is an array of strings. You can extend this object as needed.

## UserInput

In many cases, you may want to check if a password matches any user-specific content, such as their username or email address. For this purpose, you can add a `userInputs` dictionary. Its entries are lowercased, and the matching is case-insensitive like for every other dictionary.

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

// use the same options with dictionaries, graphs and translations as in getting started
const zxcvbn = new ZxcvbnFactory(options)
zxcvbn.check(password, ['someEmail@email.de', 'someUsername'])
```
These are used in addition to the `userInputs` of the options. This is especially useful during registration when the user provides personal information that should not be included in their password.

Every entry is matched as a whole word. An email address like `hans.zimmer@email.de` is not split, so a password like `hanszimmer2024` is not found through it. Add the parts you want to be matched as separate entries, e.g. `['hans.zimmer@email.de', 'hans', 'zimmer']`, or a password built from them is rated stronger than it is.

## Handling Duplicate Entries in Dictionaries
If you have large dictionaries and are unsure whether some entries overlap, don't worry. Every dictionary is searched, and the scoring uses the match that needs the fewest guesses, so a word present in multiple dictionaries is rated by its most common occurrence.

## Performance of large dictionaries
The recommended dictionaries in zxcvbn-ts already contain over 100,000 words, and even with these large dictionaries, the algorithm performs efficiently, processing results in under 100ms.

While using large dictionaries can seem like it may slow down the process, the library is optimized to handle these dictionaries quickly, making it suitable for real-world applications without compromising performance.
