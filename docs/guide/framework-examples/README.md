# Framework examples
Those examples are using the full feature set of zxcvbn, and are marked with `recommended` and `optional`


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
import { zxcvbn, zxcvbnOptions, debounce } from '@zxcvbn-ts/core'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import zxcvbnDePackage from '@zxcvbn-ts/language-de'
import matcherPwnedFactory from '@zxcvbn-ts/matcher-pwned'

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
```jsx
import { useState, useEffect, useDeferredValue } from "react";
import { zxcvbnOptions, zxcvbnAsync, ZxcvbnResult } from "@zxcvbn-ts/core";
import zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import zxcvbnDePackage from "@zxcvbn-ts/language-de";
import matcherPwnedFactory from "@zxcvbn-ts/matcher-pwned";

// optional
const matcherPwned = matcherPwnedFactory(fetch, zxcvbnOptions);
zxcvbnOptions.addMatcher("pwned", matcherPwned);

const options = {
  // recommended
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
    // recommended the language of the country that the user will be in
    ...zxcvbnDePackage.dictionary
  },
  // recommended
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  // recommended
  useLevenshteinDistance: true,
  // optional
  translations: zxcvbnEnPackage.translations
};
zxcvbnOptions.setOptions(options);

const usePasswordStrength = (password: string) => {
  const [result, setResult] = useState<ZxcvbnResult | null>(null);
  // NOTE: useDeferredValue is React v18 only, for v17 or lower use debouncing
  const deferredPassword = useDeferredValue(password);

  useEffect(() => {
    zxcvbnAsync(deferredPassword).then((response) => setResult(response));
  }, [deferredPassword]);

  return result;
};

export default function PasswordStrength() {
  const [password, setPassword] = useState<string>("");
  const result = usePasswordStrength(password);
  return (
    <div>
      <label>
        Password:
        <input
          value={password}
          type="text"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </label>
      {result && <div>The password score is {result.score}/4</div>}
    </div>
  );
}


```



## Angular 
tbd.
