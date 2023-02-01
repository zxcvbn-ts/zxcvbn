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


// than you can call debouncedZxcvbn and if it is in the timeframe of 200ms the someCallableFunction will only be called once by the last call
debouncedZxcvbn()
debouncedZxcvbn()
debouncedZxcvbn()
debouncedZxcvbn()
```


If you want to execute the function on the first debounce and ignore the rest you can use the third parameter.

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

const debouncedZxcvbn = debounce(someCallableFunction, 200, true)


// than you can call debouncedZxcvbn and if it is in the timeframe of 200ms the someCallableFunction will only be called once by the first call
debouncedZxcvbn()
debouncedZxcvbn()
debouncedZxcvbn()
debouncedZxcvbn()
```
