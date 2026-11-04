# Framework examples

All examples import the `zxcvbn` instance from the `zxcvbn.ts` module of the [recommended setup](../getting-started/#recommended-setup), so the options are only created once.
To keep the dictionaries out of your main bundle, build the options as shown in [lazy loading](../lazy-loading/).

## Vue

Use a plugin to provide the instance to all components

```ts
import { zxcvbn } from './zxcvbn'

const myPlugin = {
  install(app) {
    app.config.globalProperties.$zxcvbn = zxcvbn
  },
}

// main.js
// createApp(App).use(myPlugin).mount('#app')
```

```vue
<template>
  <div class="example">
    <label>
      Password
      <input v-model="password" type="password" />
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
    }
  },
  created() {
    // recommended
    this.debouncedZxcvbn = debounce(this.useZxcvbn, 200)
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
      this.debouncedZxcvbn()
    },
  },
}
</script>
```

## Nuxt

Use a module to define the options on the server side or/and a client only plugin for the client.
Most of the time you don't need to add the module because the user works only on the client and doesn't type passwords for the server renderer.

/plugins/zxcvbn.ts

```ts
// the zxcvbn.ts module of the recommended setup, e.g. in /utils
import { zxcvbn } from '~/utils/zxcvbn'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      zxcvbn,
    },
  }
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
      <input v-model="password" type="password" />
    </label>
    <template v-if="result">
      <div>The password score is {{ result.score }}/4</div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { debounce } from '@zxcvbn-ts/core'
import type { ZxcvbnResult } from '@zxcvbn-ts/core'

const { $zxcvbn } = useNuxtApp()

const password = ref('')
const result = ref<ZxcvbnResult | null>(null)

const useZxcvbn = async () => {
  if (password.value) {
    result.value = await $zxcvbn.checkAsync(password.value)
  } else {
    result.value = null
  }
}

const zxcvbnDebounce = debounce(useZxcvbn, 200, false)

watch(password, zxcvbnDebounce)
</script>
```

## React

```tsx
import { useState, useEffect, useDeferredValue } from 'react'
import type { ZxcvbnResult } from '@zxcvbn-ts/core'
import { zxcvbn } from './zxcvbn'

const usePasswordStrength = (password: string) => {
  const [result, setResult] = useState<ZxcvbnResult | null>(null)
  // NOTE: useDeferredValue is React v18 only, for v17 or lower use debouncing
  const deferredPassword = useDeferredValue(password)

  useEffect(() => {
    if (!deferredPassword) {
      setResult(null)
      return
    }
    // ignore responses of outdated passwords, the async matchers can resolve out of order
    let isCurrent = true
    zxcvbn.checkAsync(deferredPassword).then((response) => {
      if (isCurrent) {
        setResult(response)
      }
    })
    return () => {
      isCurrent = false
    }
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
          type="password"
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

Install the packages of the [recommended setup](../getting-started/#recommended-setup) and add its `zxcvbn.ts` module to `src`.

---

### 2. Configure zxcvbn

Create a service that wraps the instance.

`src/password-strength.service.ts`

```typescript
import { Injectable } from '@angular/core';

import type { ZxcvbnResult } from '@zxcvbn-ts/core';

import { zxcvbn } from './zxcvbn';

@Injectable({
  providedIn: 'root',
})
export class PasswordStrengthService {
  // checkAsync, because the recommended setup uses the async pwned matcher
  checkAsync(password: string): Promise<ZxcvbnResult> {
    return zxcvbn.checkAsync(password);
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

When checking passwords on the server, only accept them over HTTPS and make sure neither the request body nor the result (which contains the password) ends up in your logs.
Pass the user's own data like username or email as user inputs, otherwise a password built from it is overestimated.

```ts
import Fastify from 'fastify'
import { zxcvbn } from './zxcvbn'

const fastify = Fastify()

fastify.post<{ Body: { password?: string; userInputs?: string[] } }>(
  '/password-strength',
  async (request, reply) => {
    const { password, userInputs } = request.body ?? {}
    if (password) {
      const { score, feedback } = await zxcvbn.checkAsync(password, userInputs)
      return { score, feedback }
    }
    return reply.status(400).send({ error: 'Password is required' })
  },
)

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
