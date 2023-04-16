import * as zxcvbnCommonPackage from '../../../languages/common/src'
import * as zxcvbnEnPackage from '../../../languages/en/src'
import { zxcvbn, zxcvbnOptions } from '../src'
import passwordTests from './helper/passwordTests'

describe('main', () => {
  beforeEach(() => {
    zxcvbnOptions.setOptions({
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      translations: zxcvbnEnPackage.translations,
    })
  })

  it('should check without userInputs', () => {
    const result = zxcvbn('test')
    expect(result.calcTime).toBeDefined()
    result.calcTime = 0
    expect(result).toEqual({
      password: 'test',
      calcTime: 0,
      guesses: 116,
      guessesLog10: 2.064457989226918,
      sequence: [
        {
          pattern: 'dictionary',
          i: 0,
          j: 3,
          token: 'test',
          matchedWord: 'test',
          rank: 115,
          dictionaryName: 'passwords',
          reversed: false,
          l33t: false,
          baseGuesses: 115,
          uppercaseVariations: 1,
          l33tVariations: 1,
          guesses: 115,
          guessesLog10: 2.0606978403536114,
        },
      ],
      crackTimesSeconds: {
        onlineThrottling100PerHour: 4176,
        onlineNoThrottling10PerSecond: 11.6,
        offlineSlowHashing1e4PerSecond: 0.0116,
        offlineFastHashing1e10PerSecond: 1.16e-8,
      },
      crackTimesDisplay: {
        onlineThrottling100PerHour: '1 hour',
        onlineNoThrottling10PerSecond: '12 seconds',
        offlineSlowHashing1e4PerSecond: 'less than a second',
        offlineFastHashing1e10PerSecond: 'less than a second',
      },
      score: 0,
      feedback: {
        warning: 'This is a commonly used password.',
        suggestions: ['Add more words that are less common.'],
      },
    })
  })

  it('should check with userInputs', () => {
    zxcvbnOptions.setOptions({
      // @ts-ignore
      dictionary: { userInputs: ['test', 12, true, []] },
    })
    const result = zxcvbn('test')
    result.calcTime = 0
    expect(result).toEqual({
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
        suggestions: [zxcvbnEnPackage.translations.suggestions.anotherWord],
        warning: zxcvbnEnPackage.translations.warnings.userInputs,
      },
      guesses: 2,
      guessesLog10: 0.30102999566398114,
      calcTime: 0,
      password: 'test',
      score: 0,
      sequence: [
        {
          baseGuesses: 1,
          dictionaryName: 'userInputs',
          guesses: 1,
          guessesLog10: 0,
          i: 0,
          j: 3,
          l33t: false,
          l33tVariations: 1,
          matchedWord: 'test',
          pattern: 'dictionary',
          rank: 1,
          reversed: false,
          token: 'test',
          uppercaseVariations: 1,
        },
      ],
    })
  })

  it('should check with userInputs on the fly', () => {
    const result = zxcvbn('onTheFly', ['onTheFly'])
    result.calcTime = 0
    expect(result).toEqual({
      calcTime: 0,
      crackTimesDisplay: {
        offlineFastHashing1e10PerSecond: 'less than a second',
        offlineSlowHashing1e4PerSecond: 'less than a second',
        onlineNoThrottling10PerSecond: '4 seconds',
        onlineThrottling100PerHour: '22 minutes',
      },
      crackTimesSeconds: {
        offlineFastHashing1e10PerSecond: 3.7e-9,
        offlineSlowHashing1e4PerSecond: 0.0037,
        onlineNoThrottling10PerSecond: 3.7,
        onlineThrottling100PerHour: 1332,
      },
      feedback: {
        suggestions: ['Add more words that are less common.'],
        warning: 'There should not be any personal or page related data.',
      },
      guesses: 37,
      guessesLog10: 1.5682017240669948,
      password: 'onTheFly',
      score: 0,
      sequence: [
        {
          baseGuesses: 1,
          dictionaryName: 'userInputs',
          guesses: 36,
          guessesLog10: 1.556302500767287,
          i: 0,
          j: 7,
          l33t: false,
          l33tVariations: 1,
          matchedWord: 'onthefly',
          pattern: 'dictionary',
          rank: 1,
          reversed: false,
          token: 'onTheFly',
          uppercaseVariations: 36,
        },
      ],
    })
  })

  describe('attack vectors', () => {
    it('should not die while processing and have a appropriate calcTime for l33t attack', () => {
      const result = zxcvbn(
        '4@8({[</369&#!1/|0$5+7%2/4@8({[</369&#!1/|0$5+7%2/"',
      )
      expect(result.calcTime).toBeLessThan(3000)
    })

    it('should not die while processing and have a appropriate calcTime for regex attacks', () => {
      const result = zxcvbn(`\x00\x00${'\x00'.repeat(100)}\n`)
      expect(result.calcTime).toBeLessThan(2000)
    })
  })

  describe('password tests', () => {
    passwordTests.forEach((data) => {
      it(`should resolve ${data.password}`, () => {
        zxcvbnOptions.setOptions({
          dictionary: {
            ...zxcvbnCommonPackage.dictionary,
            ...zxcvbnEnPackage.dictionary,
          },
        })
        const result = zxcvbn(data.password)
        result.calcTime = 0
        expect(JSON.stringify(result)).toEqual(JSON.stringify(data))
      })
    })
  })
})
