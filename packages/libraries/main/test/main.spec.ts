import zxcvbn from '../src'
import passwordTests from './helper/passwordTests'
import Options from '../src/Options'
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import zxcvbnEnPackage from '@zxcvbn-ts/language-en'

Options.setOptions({
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  translations: zxcvbnEnPackage.translations,
})

describe('main', () => {
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
    const result = zxcvbn('test', {
      // @ts-ignore
      dictionary: { userInputs: ['test', 12, true, []] },
    })
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
        warning: '',
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

  describe('password tests', () => {
    passwordTests.forEach((data) => {
      it(`should resolve ${data.password}`, () => {
        const result = zxcvbn(data.password, {
          dictionary: {
            ...zxcvbnCommonPackage.dictionary,
            ...zxcvbnEnPackage.dictionary,
          },
        })
        result.calcTime = 0
        expect(JSON.stringify(result)).toEqual(JSON.stringify(data))
      })
    })
  })
})
