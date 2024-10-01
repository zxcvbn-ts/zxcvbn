<template>
  <div>
    <div v-if="isLoading"><b>Currently comparing passwords...</b></div>
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

<script setup>
import { ZxcvbnFactory } from '../../../packages/libraries/main/dist/index'
import * as zxcvbnCommonPackage from '../../../packages/languages/common/dist/index'
import * as zxcvbnEnPackage from '../../../packages/languages/en/dist/index'
import zxcvbn from 'zxcvbn'
import { ref, onMounted } from 'vue'

defineProps(['result'])

const passwords = [
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
]

const data = ref([])
const isLoading = ref(true)
const zxcvbnTs = ref(null)

onMounted(() => {
  setOptions()
  setTimeout(() => {
    setData()
  }, 1000)
})

const setOptions = () => {
  const options = {
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    useLevenshteinDistance: true,
  }
  zxcvbnTs.value = new ZxcvbnFactory(options)
}

const setData = async () => {
  isLoading.value = true
  for (const password of passwords) {
    const zxcvbnResult = zxcvbn(password)
    const zxcvbnTsResult = await zxcvbnTs.value.checkAsync(password)
    console.log(zxcvbnResult, zxcvbnTsResult)
    data.value.push({
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
  isLoading.value = false
}
</script>
