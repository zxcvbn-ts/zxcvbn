<template>
  <div class="example">
    <label>
      <b>Options</b>
    </label>
    <hr style="width: 100%" />
    <label>
      userInputs separated by a comma like John,Smith
      <input v-model="userInputs" type="text" />
    </label>
    <ul class="demo-options">
      <li>
        <label>
          <input v-model="useDictionaries" type="checkbox" />
          Use recommended dictionary
        </label>
      </li>

      <li>
        <label>
          <input v-model="useGraphs" type="checkbox" />
          Use recommended graphs
        </label>
      </li>

      <li>
        <label>
          <input v-model="useTranslations" type="checkbox" />
          Use english translations
        </label>
      </li>

      <li>
        <label>
          <input v-model="useDebounce" type="checkbox" />
          Use debounce helper
        </label>
      </li>

      <li>
        <label>
          <input v-model="useLevenshteinDistance" type="checkbox" />
          Use levenstein distance
        </label>
      </li>

      <li>
        <label>
          <input v-model="usePwned" type="checkbox" />
          Use pwned matcher
        </label>
      </li>
    </ul>
    <hr style="width: 100%" />
    <label>
      <b>Password</b>
      <input v-model="password" type="text" />
    </label>
    <template v-if="result">
      <Result :result="result" />
      <Sequence :result="result" />
    </template>
  </div>
</template>

<script>
import crossFetch from 'cross-fetch'
import {
  ZxcvbnFactory,
  debounce,
} from '../../../packages/libraries/main/dist/index.esm'
import * as zxcvbnCommonPackage from '../../../packages/languages/common/dist/index.esm'
import * as zxcvbnEnPackage from '../../../packages/languages/en/dist/index.esm'
import translationKeys from '../../../packages/libraries/main/dist/data/translationKeys.esm'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

const matcherPwned = matcherPwnedFactory(crossFetch)
export default {
  name: 'ZxcvbnInteractive',
  data() {
    return {
      password: '',
      result: null,
      useTranslations: true,
      useGraphs: true,
      useDictionaries: true,
      useDebounce: true,
      usePwned: true,
      useLevenshteinDistance: true,
      debounce: debounce(this.useZxcvbn, 200),
      userInputs: '',
      zxcvbn: null,
    }
  },
  mounted() {
    this.setOptions(true)
  },
  methods: {
    setResult(result) {
      this.result = result
    },
    setOptions(hasPwnedMatcher = false) {
      const options = {
        dictionary: {},
        translations: translationKeys,
        graphs: {},
        useLevenshteinDistance: this.useLevenshteinDistance,
      }
      if (this.useDictionaries) {
        options.dictionary = {
          ...zxcvbnCommonPackage.dictionary,
          ...zxcvbnEnPackage.dictionary,
        }
      }
      if (this.useTranslations) {
        options.translations = zxcvbnEnPackage.translations
      }
      if (this.useGraphs) {
        options.graphs = zxcvbnCommonPackage.adjacencyGraphs
      }
      const customMatcher = {}
      if (hasPwnedMatcher) {
        customMatcher.pwned = matcherPwned
      }

      this.zxcvbn = new ZxcvbnFactory(options, customMatcher)
    },
    async useZxcvbn() {
      if (this.password) {
        const userInputs = this.userInputs.split(',')
        this.result = await this.zxcvbn.checkAsync(this.password, userInputs)
      } else {
        this.result = null
      }
      console.log(this.result)
    },
  },
  watch: {
    password() {
      if (this.useDebounce) {
        this.debounce()
      } else {
        this.useZxcvbn()
      }
    },
    useTranslations() {
      this.password = ''
      this.setOptions()
    },
    useDictionaries() {
      this.password = ''
      this.setOptions()
    },
    useGraphs() {
      this.password = ''
      this.setOptions()
    },
    useLevenshteinDistance() {
      this.password = ''
      this.setOptions()
    },
    usePwned(newValue) {
      this.password = ''
      if (newValue) {
        this.setOptions(true)
      } else {
        this.setOptions()
      }
    },
  },
}
</script>

<style>
.example input[type='text'] {
  padding: 0.75em 0.5em;
  font-size: 100%;
  border: 1px solid #cccccc;
  width: 100%;
  box-sizing: border-box;
}

.demo-options {
  width: 100%;
  list-style: none;
  float: left;
  padding-left: 0;
  margin: 15px 0;
}

.example {
  padding: 1em 0 1em;
  margin-bottom: 2em;
}
</style>
