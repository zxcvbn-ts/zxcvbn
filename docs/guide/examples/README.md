# Examples

## Debounce
```js
import {
    zxcvbnAsync,
    debounce,
} from '@zxcvbn-ts/core'

let result
const someCallableFunction = () => {
// ...do your magic for example get the value from an input field or somewhere else
    const value = getInputValue()
    result = zxcvbnAsync(value)
}

const debouncedZxcvbn = debounce(someCallableFunction, 200)


// than you can call debouncedZxcvbn and if it is in the timeframe of 200ms the someCallableFunction will only be called once
debouncedZxcvbn()
debouncedZxcvbn()
debouncedZxcvbn()
debouncedZxcvbn()
```
