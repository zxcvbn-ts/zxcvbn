# Framework examples

Those examples are using the full feature set of zxcvbn, and are marked with `recommended` and `optional`

## Vue

Use a plugin to only update the options once

```ts
import { zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import * as zxcvbnDePackage from '@zxcvbn-ts/language-de'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

const myPlugin = {
  install() {
    // optional
    const matcherPwned = matcherPwnedFactory(fetch, zxcvbnOptions)
    zxcvbnOptions.addMatcher('pwned', matcherPwned)

    const options = {
      // recommended
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
        // recommended the language of the country that the user will be in
        ...zxcvbnDePackage.dictionary,
      },
      // recommended
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      // recommended
      useLevenshteinDistance: true,
      // optional
      translations: zxcvbnEnPackage.translations,
    }
    zxcvbnOptions.setOptions(options)
  },
}
```

```vue
<template>
  <div class="example">
    <label>
      Password
      <input v-model="password" type="text" />
    </label>
    <template v-if="result">
      <div>The password score is {{ result.score }}/4</div>
    </template>
  </div>
</template>

<script>
import { zxcvbn, debounce } from '@zxcvbn-ts/core'

export default {
  name: 'ZxcvbnInput',
  data() {
    return {
      password: '',
      result: null,
      // recommended
      debounce: debounce(this.useZxcvbn, 200),
    }
  },
  methods: {
    setResult(result) {
      this.result = result
    },
    async useZxcvbn() {
      if (this.password) {
        this.result = await zxcvbn(this.password)
      } else {
        this.result = null
      }
    },
  },
  watch: {
    password() {
      this.debounce()
    },
  },
}
</script>
```

# nuxt

Use a module to define the options on the server side or/and a client only plugin for the client.
Most of the time you don't need to add the module because the user works only on the client and doesn't type passwords for the server renderer.

/modules/zxcvbn.ts

```ts
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'
import { zxcvbnOptions } from '@zxcvbn-ts/core'
import { OptionsType } from '@zxcvbn-ts/core/dist/types'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import { ModuleOptions, Nuxt } from '@nuxt/schema'

export default function zxcvbnModule(moduleOptions: ModuleOptions, nuxt: Nuxt) {
  nuxt.hook('ready', async () => {
    const matcherPwned = matcherPwnedFactory(fetch, zxcvbnOptions)
    zxcvbnOptions.addMatcher('pwned', matcherPwned)

    const options: OptionsType = {
      // recommended
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
      // recommended
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      // recommended
      useLevenshteinDistance: true,
      // optional
      translations: zxcvbnEnPackage.translations,
    }
    zxcvbnOptions.setOptions(options)
  })
}
```

/plugins/zxcvbn.ts

```ts
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'
import { zxcvbnOptions } from '@zxcvbn-ts/core'
import { OptionsType } from '@zxcvbn-ts/core/dist/types'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import { ModuleOptions, Nuxt } from '@nuxt/schema'

export default defineNuxtPlugin(() => {
  const matcherPwned = matcherPwnedFactory(fetch, zxcvbnOptions)
  zxcvbnOptions.addMatcher('pwned', matcherPwned)

  const options: OptionsType = {
    // recommended
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
    // recommended
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    // recommended
    useLevenshteinDistance: true,
    // optional
    translations: zxcvbnEnPackage.translations,
  }
  zxcvbnOptions.setOptions(options)
})
```

nuxt.config.ts

```ts
export default defineNuxtConfig({
  // add plugin for client only to load the options on the client side
  plugins: [{ src: '~/plugins/zxcvbn.ts', mode: 'client' }],
  // add module to load the options once for server side
  modules: ['~/modules/zxcvbn.ts'],
  build: {
    // add if needed for your setup
    transpile: ['@zxcvbn-ts/matcher-pwned'],
  },
})
```

ZxcvbnInput.vue

```vue
<template>
  <div class="example">
    <label>
      Password
      <input v-model="password" type="text" />
    </label>
    <template v-if="result">
      <div>The password score is {{ result.score }}/4</div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { zxcvbnAsync, debounce, ZxcvbnResult } from '@zxcvbn-ts/core'
import { Ref, watch } from '@vue/runtime-core'

let password = ref()
let result: Ref<ZxcvbnResult | null> = ref(null)

const useZxcvbn = async () => {
  if (password) {
    result.value = await zxcvbnAsync(password.value)
  } else {
    result.value = null
  }
}

const zxcvbnDebounce = debounce(useZxcvbn, 200, false)

watch(password, zxcvbnDebounce)
</script>
```

## React

```jsx
import { useState, useEffect, useDeferredValue } from 'react'
import { zxcvbnOptions, zxcvbnAsync, ZxcvbnResult } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import * as zxcvbnDePackage from '@zxcvbn-ts/language-de'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

// optional
const matcherPwned = matcherPwnedFactory(fetch, zxcvbnOptions)
zxcvbnOptions.addMatcher('pwned', matcherPwned)

const options = {
  // recommended
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
    // recommended the language of the country that the user will be in
    ...zxcvbnDePackage.dictionary,
  },
  // recommended
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  // recommended
  useLevenshteinDistance: true,
  // optional
  translations: zxcvbnEnPackage.translations,
}
zxcvbnOptions.setOptions(options)

const usePasswordStrength = (password: string) => {
  const [result, setResult] = (useState < ZxcvbnResult) | (null > null)
  // NOTE: useDeferredValue is React v18 only, for v17 or lower use debouncing
  const deferredPassword = useDeferredValue(password)

  useEffect(() => {
    zxcvbnAsync(deferredPassword).then((response) => setResult(response))
  }, [deferredPassword])

  return result
}

export default function PasswordStrength() {
  const [password, setPassword] = useState < string > ''
  const result = usePasswordStrength(password)
  return (
    <div>
      <label>
        Password:
        <input
          value={password}
          type="text"
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
      </label>
      {result && <div>The password score is {result.score}/4</div>}
    </div>
  )
}
```

## Angular

tbd.
