# Lazy loading

The dictionaries are huge, so it should be loaded with lazyLoading

## Webpack

Webpack supports lazyloading with some configuration check out the documentation of [webpack](https://webpack.js.org/guides/lazy-loading/)
for further information.

The core library can be imported normally

```js
import zxcvbn from '@zxcvbn-ts/core'
```

To lazyload the dictionaries you need to do something like this:
Create a function which imports the dictionaries and returns an options object

```js
const loadOptions = async () => {
  const zxcvbnCommonPackage = await import(
    /* webpackChunkName: "zxcvbnCommonPackage" */ '@zxcvbn-ts/language-common'
  )
  const zxcvbnEnPackage = await import(
    /* webpackChunkName: "zxcvbnEnPackage" */ '@zxcvbn-ts/language-en'
  )

  return {
    dictionary: {
      ...zxcvbnCommonPackage.default.dictionary,
      ...zxcvbnEnPackage.default.dictionary,
    },
    translations: zxcvbnEnPackage.default.translations,
  }
}
```

At some point in your application you can call the "loadOptions" function. Only then will the dictionaries be loaded

```js
//
// [your other code]
//
const run = async () => {
  const password = 'asdnlja978o'
  const options = await loadOptions()
  const results = zxcvbn(password, options)
  console.log(results)
}
```

## Fetch

If you don't use webpack or another bundler you could get the dictionaries with fetch from github or from some self hosted website:

```js
const packages = [
  'https://yourWebsite/zxcvbn-ts-language-common/passwords.json',
  'https://yourWebsite/zxcvbn-ts-language-en/commonWords.json',
  'https://yourWebsite/zxcvbn-ts-language-en/firstnames.json',
  'https://yourWebsite/zxcvbn-ts-language-en/lastnames.json',
]

const loadDictionaries = async () => {
  const promises = packages.map(async (url) => {
    const response = await fetch(url)

    return response.json()
  })

  return Promise.all(promises)
}
```
