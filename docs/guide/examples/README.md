# Examples

## Debounce

Checking a password takes a few milliseconds, more with the Levenshtein distance check or an async matcher like the [pwned matcher](../pwned-matcher/), which makes a network request.
If you check while the user types, use the included `debounce` helper so the check doesn't run for every keystroke.

```js
import { debounce } from '@zxcvbn-ts/core'
// the instance from the recommended setup
import { zxcvbn } from './zxcvbn'

let result
const checkPassword = async () => {
  // e.g. get the value from an input field
  const value = getInputValue()
  result = await zxcvbn.checkAsync(value)
}

const debouncedCheckPassword = debounce(checkPassword, 200)

// called four times within 200ms, checkPassword only runs once, 200ms after the last call
debouncedCheckPassword()
debouncedCheckPassword()
debouncedCheckPassword()
debouncedCheckPassword()
```

`debounce(fn, wait, isImmediate)` takes a third parameter. With `isImmediate` set to `true`, the first call runs right away and the calls that follow are ignored until there was no call for `wait` milliseconds:

```js
const debouncedCheckPassword = debounce(checkPassword, 200, true)
```

For a password field the default is usually what you want: with `isImmediate` the last characters typed aren't checked until the user types again.

You can find complete examples for Vue, Nuxt, React, Angular and Fastify in the [framework examples](../framework-examples/).
