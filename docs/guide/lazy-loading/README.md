# Lazy loading

The dictionaries are sizable, so it is recommended to use lazy loading.

## Webpack

Webpack supports lazy-loading with some configuration; check out the [documentation](https://webpack.js.org/guides/lazy-loading/).

Here's how you import it:

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
```

This is how you lazy load dictionaries:

```js
const loadOptions = async () => {
  const { dictionary: commonDict, adjacencyGraphs } = await import(
    /* webpackChunkName: "zxcvbnCommonPackage" */ '@zxcvbn-ts/language-common'
  )
  const { dictionary: enDict, translations } = await import(
    /* webpackChunkName: "zxcvbnEnPackage" */ '@zxcvbn-ts/language-en'
  )

  return {
    dictionary: {
      ...commonDict,
      ...enDict,
    },
    graphs: adjacencyGraphs,
    translations,
    // the remaining options of the recommended setup
    useLevenshteinDistance: true,
  }
}
```

These are the options of the [recommended setup](../getting-started/#recommended-setup); add the package of your users' language the same way.
Somewhere in your application you can call the "loadOptions" function, then the dictionary load is executed.

```js
//
// [your other code]
//
const run = async () => {
  const password = 'asdnlja978o'
  const options = await loadOptions()

  // customMatchers, e.g. the pwned matcher, as in the recommended setup
  const zxcvbn = new ZxcvbnFactory(options, customMatchers)
  const results = await zxcvbn.checkAsync(password)
  console.log(results)
}
```

## Fetch

If you don't use a bundler like webpack, you could host the plain JSON files from the `src` folder of the language packages and fetch them yourself.
The keys of the dictionary have to be the same as in the language packages (see their `src/index.ts`), because the scoring and the feedback depend on them. For example a `diceware-*` dictionary gets its own scoring.

```js
import { ZxcvbnFactory } from '@zxcvbn-ts/core'

const dictionaryUrls = {
  'passwords-common': 'https://yourWebsite/zxcvbn-ts-language-common/passwords.json',
  'diceware-common': 'https://yourWebsite/zxcvbn-ts-language-common/diceware.json',
  'commonWords-en': 'https://yourWebsite/zxcvbn-ts-language-en/commonWords.json',
  'firstnames-en': 'https://yourWebsite/zxcvbn-ts-language-en/firstnames.json',
  'lastnames-en': 'https://yourWebsite/zxcvbn-ts-language-en/lastnames.json',
  'wikipedia-en': 'https://yourWebsite/zxcvbn-ts-language-en/wikipedia.json',
}

const fetchJson = async (url) => {
  const response = await fetch(url)
  return response.json()
}

const loadOptions = async () => {
  const entries = await Promise.all(
    Object.entries(dictionaryUrls).map(async ([name, url]) => [
      name,
      await fetchJson(url),
    ]),
  )
  // wordSequences.json is already an object of dictionaries and gets spread in directly
  const wordSequences = await fetchJson(
    'https://yourWebsite/zxcvbn-ts-language-en/wordSequences.json',
  )

  return {
    dictionary: {
      ...Object.fromEntries(entries),
      ...wordSequences,
    },
    graphs: await fetchJson(
      'https://yourWebsite/zxcvbn-ts-language-common/adjacencyGraphs.json',
    ),
  }
}

const zxcvbn = new ZxcvbnFactory(await loadOptions())
```

The translations are TypeScript files, so you need to either copy them or keep the feedback keys and translate them with your own i18n system.
