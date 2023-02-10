<template>
  <div>
    <div v-if="loading">Currently comparing passwords...</div>
    <table class="result" v-else>
      <tr>
        <td></td>
        <td>zxcvbn</td>
        <td>zxcvbn-ts</td>
      </tr>
      <template v-for="entry in data">
        <tr>
          <td><strong>password:</strong></td>
          <td colspan="2">
            <strong>{{ entry.password }}</strong>
          </td>
        </tr>
        <tr>
          <td>guessesLog10:</td>
          <td>{{ entry.zxcvbn.guessesLog10 }}</td>
          <td>{{ entry.zxcvbnTs.guessesLog10 }}</td>
        </tr>
        <tr>
          <td>score:</td>
          <td>{{ entry.zxcvbn.score }}</td>
          <td>{{ entry.zxcvbnTs.score }}</td>
        </tr>
        <tr>
          <td colspan="3"></td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
import {
  zxcvbnAsync as zxcvbnTsAsync,
  zxcvbnOptions,
} from '../../../packages/libraries/main/dist/index.esm'
import * as zxcvbnCommonPackage from '../../../packages/languages/common/dist/index.esm'
import * as zxcvbnEnPackage from '../../../packages/languages/en/dist/index.esm'
import zxcvbn from 'zxcvbn'

export default {
  name: 'ZxcvbnComparison',
  props: {
    result: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      passwords: [
        '1q2w3e4r5t',
        '1Q2w3e4r5t',
        '1q2w3e4r5T',
        'abcdefg123',
        'TESTERINO',
        'aaaaaaa',
        'Daniel',
        '1234qwer',
        '1234qwe',
        '1234qwert',
        'password',
        '2010abc',
        'abcabcabcabc',
        'qwer',
        'P4$$w0rd',
        'aA!1',
        'dgo9dsghasdoghi8/!&IT/§(ihsdhf8o7o',
        'AZERTY',
        'zxcftzuio',
        'aoeuidh',
        'Tiger@0177',
      ],
      data: [],
      loading: true,
    }
  },
  async mounted() {
    this.setOptions()
    this.setData()
  },
  methods: {
    setOptions() {
      const options = {
        dictionary: {
          ...zxcvbnCommonPackage.dictionary,
          ...zxcvbnEnPackage.dictionary,
        },
        graphs: zxcvbnCommonPackage.adjacencyGraphs,
        useLevenshteinDistance: true,
      }
      zxcvbnOptions.setOptions(options)
    },

    async setData() {
      this.loading = true
      for (const password of this.passwords) {
        const zxcvbnResult = zxcvbn(password)
        const zxcvbnTsResult = await zxcvbnTsAsync(password)
        console.log(zxcvbnResult, zxcvbnTsResult)
        this.data.push({
          password: password,
          zxcvbn: {
            guessesLog10: zxcvbnResult.guesses_log10,
            score: zxcvbnResult.score,
          },
          zxcvbnTs: {
            guessesLog10: zxcvbnTsResult.guessesLog10,
            score: zxcvbnTsResult.score,
          },
        })
      }
      this.loading = false
    },
  },
}
</script>
