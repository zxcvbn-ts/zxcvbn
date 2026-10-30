import * as zxcvbnCommonPackage from '../../../languages/common/src'
import * as zxcvbnEnPackage from '../../../languages/en/src'
import { ZxcvbnFactory } from '../src'
import passwordTests from './helper/passwordTests'

describe('main', () => {
  const zxcvbn = new ZxcvbnFactory({
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    translations: zxcvbnEnPackage.translations,
  })

  it('should allow creating factory with no arguments', () => {
    const factory = new ZxcvbnFactory()
    expect(factory.check('password')).toBeDefined()
  })

  it('should check without userInputs', () => {
    const result = zxcvbn.check('test')
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
          dictionaryName: 'passwords-common',
          reversed: false,
          l33t: false,
          baseGuesses: 115,
          uppercaseVariations: 1,
          l33tVariations: 1,
          guesses: 115,
          guessesLog10: 2.0606978403536114,
        },
      ],
      crackTimes: {
        offlineFastHashingXPerSecond: {
          base: null,
          display: 'less than a second',
          seconds: 1.16e-8,
        },
        offlineSlowHashingXPerSecond: {
          base: null,
          display: 'less than a second',
          seconds: 0.0116,
        },
        onlineNoThrottlingXPerSecond: {
          base: 12,
          display: '12 seconds',
          seconds: 11.6,
        },
        onlineThrottlingXPerHour: {
          base: 1,
          display: '1 hour',
          seconds: 4176,
        },
      },
      score: 0,
      feedback: {
        warning: 'This is a commonly used password.',
        suggestions: ['Add more words that are less common.'],
      },
    })
  })

  it('should check with userInputs', () => {
    const zxcvbnCustom = new ZxcvbnFactory({
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
        userInputs: ['test', 12],
      },
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      translations: zxcvbnEnPackage.translations,
    })
    const result = zxcvbnCustom.check('test')
    result.calcTime = 0
    expect(result).toEqual({
      crackTimes: {
        offlineFastHashingXPerSecond: {
          base: null,
          display: 'less than a second',
          seconds: 2e-10,
        },
        offlineSlowHashingXPerSecond: {
          base: null,
          display: 'less than a second',
          seconds: 0.0002,
        },
        onlineNoThrottlingXPerSecond: {
          base: null,
          display: 'less than a second',
          seconds: 0.2,
        },
        onlineThrottlingXPerHour: {
          base: 1,
          display: '1 minute',
          seconds: 72,
        },
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
    const result = zxcvbn.check('onTheFly', ['onTheFly'])
    result.calcTime = 0
    expect(result).toEqual({
      calcTime: 0,
      crackTimes: {
        offlineFastHashingXPerSecond: {
          base: null,
          display: 'less than a second',
          seconds: 3.7e-9,
        },
        offlineSlowHashingXPerSecond: {
          base: null,
          display: 'less than a second',
          seconds: 0.0037,
        },
        onlineNoThrottlingXPerSecond: {
          base: 4,
          display: '4 seconds',
          seconds: 3.7,
        },
        onlineThrottlingXPerHour: {
          base: 22,
          display: '22 minutes',
          seconds: 1332,
        },
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

  it('should not cut an emoji in half at maxLength', () => {
    // maxLength counts UTF-16 code units and '😀' is two of them, so a limit
    // of 3 lands inside the second emoji, which is dropped as a whole
    const factory = new ZxcvbnFactory({ maxLength: 3 })
    expect(factory.check('😀😀').password).toEqual('😀')
  })

  describe('attack vectors', () => {
    const maxCalcTime = 1000
    it('should not die while processing and have a appropriate calcTime for l33t attack', () => {
      const result = zxcvbn.check(
        '4@8({[</369&#!1/|0$5+7%2/4@8({[</369&#!1/|0$5+7%2/"'.repeat(2),
      )
      expect(result.calcTime).toBeLessThan(maxCalcTime)
    })

    it('should not die while processing and have a appropriate calcTime for l33t same value attack', () => {
      const result = zxcvbn.check('!'.repeat(1500))
      expect(result.calcTime).toBeLessThan(maxCalcTime)
    })

    it('should not die while processing and have a appropriate calcTime for regex attacks', () => {
      const result = zxcvbn.check(`\x00\x00${'\x00'.repeat(1500)}\n`)
      expect(result.calcTime).toBeLessThan(maxCalcTime)
    })

    it('should handle very long passwords by truncating them', () => {
      const longPassword = 'a'.repeat(1500)
      const result = zxcvbn.check(longPassword)
      expect(result.password.length).toBe(256)
    })

    it('should not throw when userInputs contains an empty string', () => {
      expect(() =>
        zxcvbn.check('anypassword', ['someuser', '', 'lastname']),
      ).not.toThrow()
    })

    describe('with levenshtein distance', () => {
      const createZxcvbnLevenshtein = () =>
        new ZxcvbnFactory({
          dictionary: {
            ...zxcvbnCommonPackage.dictionary,
            ...zxcvbnEnPackage.dictionary,
          },
          graphs: zxcvbnCommonPackage.adjacencyGraphs,
          translations: zxcvbnEnPackage.translations,
          useLevenshteinDistance: true,
        })
      const zxcvbnLevenshtein = createZxcvbnLevenshtein()

      it('should have a appropriate calcTime for the first check, which groups the dictionary entries by length', () => {
        const result = createZxcvbnLevenshtein().check('xkqzvbnw')
        expect(result.calcTime).toBeLessThan(maxCalcTime)
      })

      it.each([
        [
          'l33t attack',
          '4@8({[</369&#!1/|0$5+7%2/4@8({[</369&#!1/|0$5+7%2/"'.repeat(2),
        ],
        ['l33t same value attack', '!'.repeat(1500)],
        ['regex attacks', `\x00\x00${'\x00'.repeat(1500)}\n`],
      ])(
        'should not die while processing and have a appropriate calcTime for %s',
        (_, password) => {
          const result = zxcvbnLevenshtein.check(password)
          expect(result.calcTime).toBeLessThan(maxCalcTime)
        },
      )

      // every character can be substituted with several letters, so each of
      // the l33tMaxSubstitutions full substitutions is searched for a close
      // entry, and none is close enough to stop the search early
      it('should not die while processing and have a appropriate calcTime for ambiguous l33t substitutions', () => {
        const result = zxcvbnLevenshtein.check('<1x|<1q|<')
        expect(result.calcTime).toBeLessThan(maxCalcTime)
      })

      // the user input is as long as the password, so the full password is
      // searched for a close entry even at maxLength
      it('should not die while processing and have a appropriate calcTime for long userInputs', () => {
        const result = zxcvbnLevenshtein.check(
          'qzvbnwjpfyxk'.repeat(22).slice(0, 256),
          ['xkqzvbnwjpfy'.repeat(22).slice(0, 256)],
        )
        expect(result.calcTime).toBeLessThan(maxCalcTime)
      })

      // entries with characters outside the BMP are compared by code point
      it('should not die while processing and have a appropriate calcTime for emoji userInputs', () => {
        const result = zxcvbnLevenshtein.check('😀🎉🔥💯'.repeat(32), [
          '🎉🔥💯😀'.repeat(32),
        ])
        expect(result.calcTime).toBeLessThan(maxCalcTime)
      })
    })
  })

  describe('password tests', () => {
    const zxcvbnCustom = new ZxcvbnFactory({
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      translations: zxcvbnEnPackage.translations,
    })
    passwordTests.forEach((data) => {
      it(`should resolve ${data.password}`, () => {
        const result = zxcvbnCustom.check(data.password)
        result.calcTime = 0
        expect(JSON.stringify(result)).toEqual(JSON.stringify(data))
      })
    })
  })
})
