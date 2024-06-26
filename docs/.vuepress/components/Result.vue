<template>
  <table class="result">
    <tr>
      <td>password:</td>
      <td colspan="2">
        <strong>{{ result.password }}</strong>
      </td>
    </tr>
    <tr>
      <td>guessesLog10:</td>
      <td colspan="2">{{ result.guessesLog10 }}</td>
    </tr>
    <tr>
      <td>score:</td>
      <td>{{ result.score }} / 4</td>
    </tr>

    <tr>
      <td>function runtime (ms):</td>
      <td colspan="2">{{ result.calcTime }}</td>
    </tr>
    <tr>
      <td colspan="3">guess times:</td>
    </tr>
    <tr>
      <td>100 / hour:</td>
      <td>{{ result.crackTimes.onlineThrottlingXPerHour.display }}</td>
      <td>(throttled online attack)</td>
    </tr>
    <tr>
      <td>10&nbsp; / second:</td>
      <td>{{ result.crackTimes.onlineNoThrottlingXPerSecond.display }}</td>
      <td>(unthrottled online attack)</td>
    </tr>
    <tr>
      <td>10k / second:</td>
      <td>{{ result.crackTimes.offlineSlowHashingXPerSecond.display }}</td>
      <td>(offline attack, slow hash, many cores)</td>
    </tr>

    <tr>
      <td>10B / second:</td>
      <td>{{ result.crackTimes.offlineFastHashingXPerSecond.display }}</td>
      <td>(offline attack, fast hash, many cores)</td>
    </tr>
    <tr v-if="result.feedback.warning">
      <td>warning:</td>
      <td colspan="2">{{ result.feedback.warning }}</td>
    </tr>
    <tr v-if="hasSuggestions">
      <td style="vertical-align: top">suggestions:</td>
      <td colspan="2" v-if="result.feedback.suggestions">
        <template v-for="suggestion in result.feedback.suggestions">
          - {{ suggestion }}
        </template>
      </td>
    </tr>
  </table>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['result'])

const hasSuggestions = computed(() => {
  return props.result.feedback.suggestions.length > 0
})
</script>
