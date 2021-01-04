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
      <td>{{ result.crackTimesDisplay.onlineThrottling100PerHour }}</td>
      <td>(throttled online attack)</td>
    </tr>
    <tr>
      <td>10&nbsp; / second:</td>
      <td>{{ result.crackTimesDisplay.onlineNoThrottling10PerSecond }}</td>
      <td>(unthrottled online attack)</td>
    </tr>
    <tr>
      <td>10k / second:</td>
      <td>{{ result.crackTimesDisplay.offlineSlowHashing1e4PerSecond }}</td>
      <td>(offline attack, slow hash, many cores)</td>
    </tr>

    <tr>
      <td>10B / second:</td>
      <td>{{ result.crackTimesDisplay.offlineFastHashing1e10PerSecond }}</td>
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

<script>
export default {
  name: 'ZxcvbnResult',
  props: {
    result: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    hasSuggestions() {
      return this.result.feedback.suggestions.length > 0
    },
  },
}
</script>
