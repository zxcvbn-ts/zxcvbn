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
      <li v-if="useDictionaries">
        <Multiselect
          v-model="activeLanguages"
          :options="languages"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Pick some"
        />
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
import Multiselect from 'vue-multiselect/dist/vue-multiselect.common.js'
import {
  ZxcvbnFactory,
  debounce,
} from '../../../packages/libraries/main/dist/index'
import translationKeys from '../../../packages/libraries/main/dist/data/translationKeys'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

const matcherPwned = matcherPwnedFactory(crossFetch)
export default {
  name: 'ZxcvbnInteractive',
  components: {
    Multiselect,
  },
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
      activeLanguages: ['en', 'common'],
      languages: [
        'ar',
        'common',
        'cs',
        'da-dk',
        'de',
        'en',
        'es-es',
        'fi',
        'fr',
        'id',
        'it',
        'ja',
        'nl-be',
        'pl',
        'pl-br',
      ],
      loadedLanguagePackages: {},
    }
  },
  async mounted() {
    await this.fillLoadedLanguages(this.activeLanguages)
    this.setOptions(true)
  },
  methods: {
    async loadLanguagePack(language) {
      return await import(
        `../../../packages/languages/${language}/dist/index.mjs`
      )
    },
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
        options.dictionary = Object.entries(this.loadedLanguagePackages)
          .filter(([language]) => {
            return this.activeLanguages.includes(language)
          })
          .reduce((acc, [language, languagePackage]) => {
            return {
              ...acc,
              ...languagePackage.dictionary,
            }
          }, {})
      }
      if (this.useTranslations && this.loadedLanguagePackages.en) {
        options.translations = this.loadedLanguagePackages.en.translations
      }
      if (this.useGraphs && this.loadedLanguagePackages.common) {
        options.graphs = this.loadedLanguagePackages.common.adjacencyGraphs
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
    async fillLoadedLanguages(newValue) {
      const promises = newValue.map(async (language) => {
        if (!this.loadedLanguagePackages[language]) {
          this.loadedLanguagePackages[language] =
            await this.loadLanguagePack(language)
        }
      })
      await Promise.all(promises)
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
    async activeLanguages(newValue) {
      if (newValue) {
        await this.fillLoadedLanguages(newValue)
      }
      this.password = ''
      this.setOptions()
    },
  },
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

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

/* in your app.scss of laravel */
.multiselect .multiselect__tags {
  background-color: var(--vp-c-gutter);
  border-color: var(--vp-c-border);
  color: var(--vp-c-text);
}

.multiselect__tags .multiselect__single {
  color: var(--vp-c-text);
}

.multiselect .multiselect__input {
  background-color: var(--vp-c-gutter);
  border-color: var(--vp-c-border);
  color: var(--vp-c-text);
}

.multiselect .multiselect__content-wrapper {
  background-color: var(--vp-c-gutter);
  border-color: var(--vp-c-border);
  color: var(--vp-c-text);
}

.multiselect .multiselect__option--selected {
  background-color: var(--vp-c-bg-elv);
}
</style>
