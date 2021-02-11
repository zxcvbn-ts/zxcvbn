<template>
  <div class="example">
    <label>
      Use recommended dictionary
      <input v-model="useDictionaries" type="checkbox" />
    </label>

    <label>
      Use english translations
      <input v-model="useTranslations" type="checkbox" />
    </label>
    <label>
      Password
      <input v-model="password" type="text" />
    </label>
    <template v-if="result">
      <Result :result="result" />
      <Sequence :result="result" />
    </template>
  </div>
</template>

<script>
import Result from './Result'
import Sequence from './Sequence'
import zxcvbn from '../../../packages/libraries/main/dist'
import zxcvbnCommonPackage from '../../../packages/languages/common/dist'
import zxcvbnEnPackage from '../../../packages/languages/en/dist'
import translationKeys from '../../../packages/libraries/main/dist/data/translationKeys'

export default {
  name: 'ZxcvbnInteractive',
  components: {
    Result,
    Sequence,
  },
  data() {
    return {
      password: '',
      result: null,
      useTranslations: true,
      useDictionaries: true,
    }
  },
  methods: {
    setResult(result) {
      this.result = result
    },
  },
  computed: {
    options() {
      const options = {
        dictionary: {},
        translations: translationKeys,
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
      return options
    },
  },
  watch: {
    password() {
      if (this.password) {
        this.result = zxcvbn(this.password, this.options)
      } else {
        this.result = null
      }
    },
    useTranslations() {
      this.password = ''
    },
    useDictionaries() {
      this.password = ''
    },
  },
}
</script>

<style>
.example input {
  padding: 0.75em 0.5em;
  font-size: 100%;
  border: 1px solid #cccccc;
  width: 100%;
  box-sizing: border-box;
}

.example {
  padding: 1em 0 1em;
  margin-bottom: 2em;
}
</style>
