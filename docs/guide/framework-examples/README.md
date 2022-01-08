# Framework examples
Those examples are using the full feature set of zxcvbn, and are marked with `recommanded` and `optional`


## Vue
```vue
<template>
  <div class="example">
    <label>
      Password
      <input v-model="password" type="text" />
    </label>
    <template v-if="result">
      <div>
        The password score is {{result.score}}/4
      </div>
    </template>
  </div>
</template>

<script>
import { zxcvbn, ZxcvbnOptions, debounce } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import matcherPwnedFactory from '@zxcvbn-ts/matcher-pwned'

// optional
const matcherPwned = matcherPwnedFactory(fetch)
ZxcvbnOptions.addMatcher('pwned', matcherPwned)

const options = {
  // recommended
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  // recommended
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  // optional
  translations: zxcvbnEnPackage.translations,
}
ZxcvbnOptions.setOptions(options)

export default {
  name: 'ZxcvbnInput',
  data() {
    return {
      password: '',
      result: null,
      // recommended
      debounce: debounce(this.useZxcvbn, 200)
    }
  },
  methods: {
    setResult(result) {
      this.result = result
    },
    async useZxcvbn(){
      if (this.password) {
        this.result = await zxcvbn(this.password)
      } else {
        this.result = null
      }
    }
  },
  watch: {
    password() {
      this.debounce()
    },
  },
}
</script>

```


## React
tbd.



## Angular 
tbd.
