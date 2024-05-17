<template>
  <div class="match-sequence">
    <strong>match sequence:</strong>
    <template v-if="result.sequence">
      <table v-for="sequence in result.sequence">
        <tr>
          <td colspan="2">'{{ sequence.token }}'</td>
        </tr>
        <tr>
          <td>pattern:</td>
          <td>{{ sequence.pattern }}</td>
        </tr>
        <tr>
          <td>guessesLog10:</td>
          <td>{{ sequence.guessesLog10 }}</td>
        </tr>
        <template v-if="sequence.cardinality">
          <tr>
            <td>cardinality:</td>
            <td>{{ sequence.cardinality }}</td>
          </tr>
          <tr>
            <td>length:</td>
            <td>{{ sequence.length }}</td>
          </tr>
        </template>
        <template v-if="sequence.rank">
          <tr>
            <td>dictionaryName:</td>
            <td>{{ sequence.dictionaryName }}</td>
          </tr>
          <tr>
            <td>rank:</td>
            <td>{{ sequence.rank }}</td>
          </tr>
          <tr>
            <td>reversed:</td>
            <td>{{ sequence.reversed }}</td>
          </tr>

          <template v-if="sequence.l33t">
            <tr>
              <td>l33t subs:</td>
              <td>{{ sequence.subDisplay }}</td>
            </tr>
            <tr>
              <td>un-l33ted:</td>
              <td>{{ sequence.matchedWord }}</td>
            </tr>
          </template>
          <tr>
            <td>base-guesses:</td>
            <td>{{ sequence.baseGuesses }}</td>
          </tr>
          <tr>
            <td>uppercase-variations:</td>
            <td>{{ sequence.uppercaseVariations }}</td>
          </tr>
          <tr>
            <td>l33t-variations:</td>
            <td>{{ sequence.l33tVariations }}</td>
          </tr>
        </template>

        <template v-if="sequence.graph">
          <tr>
            <td>graph:</td>
            <td>{{ sequence.graph }}</td>
          </tr>
          <tr>
            <td>turns:</td>
            <td>{{ sequence.turns }}</td>
          </tr>
          <tr>
            <td>shifted count:</td>
            <td>{{ sequence.shiftedCount }}</td>
          </tr>
        </template>
        <template v-if="sequence.baseToken">
          <tr v-if="sequence.baseToken">
            <td>baseToken:</td>
            <td>'{{ sequence.baseToken }}'</td>
          </tr>
          <tr>
            <td>guesses:</td>
            <td>{{ sequence.guesses }}</td>
          </tr>
          <tr>
            <td>numRepeats:</td>
            <td>{{ sequence.repeatCount }}</td>
          </tr>
        </template>
        <template v-if="sequence.sequenceName">
          <tr v-if="sequence.sequenceName">
            <td>sequence-name:</td>
            <td>{{ sequence.sequenceName }}</td>
          </tr>
          <tr>
            <td>sequence-size</td>
            <td>{{ sequence.sequenceSpace }}</td>
          </tr>
          <tr>
            <td>ascending:</td>
            <td>{{ sequence.ascending }}</td>
          </tr>
        </template>
        <tr v-if="sequence.regexName">
          <td>regexName:</td>
          <td>{{ sequence.regexName }}</td>
        </tr>
        <template v-if="sequence.day">
          <tr>
            <td>day:</td>
            <td>{{ sequence.day }}</td>
          </tr>
          <tr>
            <td>month:</td>
            <td>{{ sequence.month }}</td>
          </tr>
          <tr>
            <td>year:</td>
            <td>{{ sequence.year }}</td>
          </tr>
          <tr>
            <td>separator:</td>
            <td>'{{ sequence.separator }}'</td>
          </tr>
        </template>
      </table>
    </template>
  </div>
</template>

<script setup>
defineProps(['result'])
</script>
