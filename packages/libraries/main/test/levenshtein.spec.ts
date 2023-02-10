import * as zxcvbnCommonPackage from '../../../languages/common/src'
import * as zxcvbnEnPackage from '../../../languages/en/src'
import { zxcvbn, zxcvbnOptions } from '../src'

describe('levenshtein', () => {
  zxcvbnOptions.setOptions({
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    translations: zxcvbnEnPackage.translations,
    useLevenshteinDistance: true,
  })

  it('should find levensteindistance', () => {
    const result = zxcvbn('ishduehlduod83h4mfs8', ['ishduehgldueod83h4mfis8'])
    expect(result.calcTime).toBeDefined()
    result.calcTime = 0
    expect(result).toEqual({
      calcTime: 0,
      crackTimesDisplay: {
        offlineFastHashing1e10PerSecond: 'less than a second',
        offlineSlowHashing1e4PerSecond: 'less than a second',
        onlineNoThrottling10PerSecond: 'less than a second',
        onlineThrottling100PerHour: '1 minute',
      },
      crackTimesSeconds: {
        offlineFastHashing1e10PerSecond: 2e-10,
        offlineSlowHashing1e4PerSecond: 0.0002,
        onlineNoThrottling10PerSecond: 0.2,
        onlineThrottling100PerHour: 72,
      },
      feedback: {
        suggestions: ['Add more words that are less common.'],
        warning: 'There should not be any personal or page related data.',
      },
      guesses: 2,
      guessesLog10: 0.30102999566398114,
      password: 'ishduehlduod83h4mfs8',
      score: 0,
      sequence: [
        {
          baseGuesses: 1,
          dictionaryName: 'userInputs',
          guesses: 1,
          guessesLog10: 0,
          i: 0,
          j: 19,
          l33t: false,
          l33tVariations: 1,
          levenshteinDistance: 3,
          levenshteinDistanceEntry: 'ishduehgldueod83h4mfis8',
          matchedWord: 'ishduehlduod83h4mfs8',
          pattern: 'dictionary',
          rank: 1,
          reversed: false,
          token: 'ishduehlduod83h4mfs8',
          uppercaseVariations: 1,
        },
      ],
    })
  })
})
