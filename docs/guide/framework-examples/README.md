# Framework examples

Those examples are using the full feature set of zxcvbn, and are marked with `recommended` and `optional`

## Vue

Use a plugin to only update the options once

```ts
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import * as zxcvbnDePackage from '@zxcvbn-ts/language-de'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

const myPlugin = {
  install(Vue) {
    // optional
    const matcherPwned = matcherPwnedFactory(fetch)
    const customMatcher = {
      pwned: matcherPwned
    }

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

    Vue.prototype.$zxcvbn = new ZxcvbnFactory(options, customMatcher)
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
import { debounce } from '@zxcvbn-ts/core'

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
    async useZxcvbn() {
      if (this.password) {
        this.result = await this.$zxcvbn.checkAsync(this.password)
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

## nuxt

Use a module to define the options on the server side or/and a client only plugin for the client.
Most of the time you don't need to add the module because the user works only on the client and doesn't type passwords for the server renderer.

/plugins/zxcvbn.ts

```ts
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import { OptionsType } from '@zxcvbn-ts/core/dist/types'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import { ModuleOptions, Nuxt } from '@nuxt/schema'

export default defineNuxtPlugin(({app}, inject) => {
  const matcherPwned = matcherPwnedFactory(fetch)
  const customMatcher = {
    pwned: matcherPwned
  }

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

  inject('zxcvbn', new ZxcvbnFactory(options, customMatcher))
})
```

nuxt.config.ts

```ts
export default defineNuxtConfig({
  // add plugin for client only to load the options on the client side
  plugins: [{ src: '~/plugins/zxcvbn.ts', mode: 'client' }],
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
import { debounce, ZxcvbnResult } from '@zxcvbn-ts/core'
import { Ref, watch } from '@vue/runtime-core'

let password = ref()
let result: Ref<ZxcvbnResult | null> = ref(null)

const useZxcvbn = async () => {
  if (password) {
    result.value = await this.$zxcvbn.checkAsync(password.value)
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
import { ZxcvbnFactory, ZxcvbnResult } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'
import * as zxcvbnDePackage from '@zxcvbn-ts/language-de'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

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

// optional
const matcherPwned = matcherPwnedFactory(fetch)
const customMatcher = {
  pwned: matcherPwned
}
const zxcvbn = new ZxcvbnFactory(options, customMatcher)

const usePasswordStrength = (password: string) => {
  const [result, setResult] = useState<ZxcvbnResult | null>(null)
  // NOTE: useDeferredValue is React v18 only, for v17 or lower use debouncing
  const deferredPassword = useDeferredValue(password)

  useEffect(() => {
    zxcvbn.checkAsync(deferredPassword).then((response) => setResult(response))
  }, [deferredPassword])

  return result
}

export default function PasswordStrength() {
  const [password, setPassword] = useState<string>('')
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

We are using reactive forms in this example.

### 1. Install the packages

```bash
npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en
```

---

### 2. Configure zxcvbn

Create a service that initializes the library once.

`src/password-strength.service.ts`

```typescript
import { Injectable } from '@angular/core';

import { ZxcvbnFactory } from '@zxcvbn-ts/core';
import type { ZxcvbnResult } from '@zxcvbn-ts/core';

import * as common from '@zxcvbn-ts/language-common';
import * as en from '@zxcvbn-ts/language-en';

@Injectable({
  providedIn: 'root',
})
export class PasswordStrengthService {
  private readonly zxcvbn = new ZxcvbnFactory({
    dictionary: {
      ...common.dictionary,
      ...en.dictionary,
    },
    graphs: common.adjacencyGraphs,
    translations: en.translations,
    useLevenshteinDistance: true,
  });

  check(password: string): ZxcvbnResult {
    return this.zxcvbn.check(password);
  }

  checkAsync(password: string): Promise<ZxcvbnResult> {
    return this.zxcvbn.checkAsync(password);
  }
}
```

---

### 3. Create a reactive form

`src/register.component.ts`

```typescript
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  from,
} from 'rxjs';

import { PasswordStrengthService } from './password-strength.service';
import type { ZxcvbnResult } from '@zxcvbn-ts/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class RegisterComponent {
  passwordResult?: ZxcvbnResult;

  form = this.fb.group({
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private passwordStrength: PasswordStrengthService
  ) {
    this.form.controls.password.valueChanges
      .pipe(
        filter((value): value is string => value != null),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((password) =>
          from(this.passwordStrength.checkAsync(password))
        ),
        takeUntilDestroyed()
      )
      .subscribe((result) => {
        this.passwordResult = result;
      });
  }

  get strengthLabel(): string {
    switch (this.passwordResult?.score) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  }
}
```

---

### 4. Component template

> This example uses Angular's new control flow syntax (`@if` and
> `@for`) available in Angular 17+.

`src/register.component.html`

```html
<form [formGroup]="form">
  <label for="password">Password</label>

  <input
    id="password"
    type="password"
    formControlName="password"
    placeholder="Enter password"
  />

  @if (passwordResult) {
  <div class="strength">
    <div
      class="strength-bar"
      [style.width.%]="(passwordResult.score + 1) * 20"
      [class.score0]="passwordResult.score === 0"
      [class.score1]="passwordResult.score === 1"
      [class.score2]="passwordResult.score === 2"
      [class.score3]="passwordResult.score === 3"
      [class.score4]="passwordResult.score === 4"
    ></div>

    <p>
      Strength:
      <strong>{{ strengthLabel }}</strong>
    </p>

    <p>
      Score:
      <strong>{{ passwordResult.score }}/4</strong>
    </p>

    <p>
      Estimated guesses:
      <strong>{{ passwordResult.guesses }}</strong>
    </p>

    <p>
      Calculation time:
      <strong>{{ passwordResult.calcTime }} ms</strong>
    </p>

    @if (passwordResult.feedback.warning) {
    <p class="warning">
      {{ passwordResult.feedback.warning }}
    </p>
    } @if (passwordResult.feedback.suggestions.length) {
    <ul>
      @for (suggestion of passwordResult.feedback.suggestions; track suggestion)
      {
      <li>{{ suggestion }}</li>
      }
    </ul>
    }
  </div>
  }
</form>
```

---

### 5. Styles

`src/styles.css`

```css
.strength {
  margin-top: 1rem;
}

.strength-bar {
  height: 8px;
  border-radius: 4px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.score0 {
  background: #d32f2f;
}

.score1 {
  background: #f57c00;
}

.score2 {
  background: #fbc02d;
}

.score3 {
  background: #7cb342;
}

.score4 {
  background: #2e7d32;
}

.warning {
  color: #d32f2f;
}
```

## Fastify

```ts
import Fastify from 'fastify'
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

const fastify = Fastify()

const options = {
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

const zxcvbn = new ZxcvbnFactory(options)

fastify.post<{Body: string}>('/password-strength', async (request, reply) => {
  if (request.body) {
    return zxcvbn.check(request.body)
  }
  return reply.status(400).send({ error: 'Password is required' })
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
```
