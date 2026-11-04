import * as zxcvbnCommonPackage from '../../../../../languages/common/src'
import * as zxcvbnEnPackage from '../../../../../languages/en/src'
import MatchDictionary from '../../../src/matcher/dictionary/matching'
import checkMatches from '../../helper/checkMatches'
import genpws from '../../helper/genpws'
import Options from '../../../src/Options'
import { RankedDictionary, UserInputsOptions } from '../../../src/types'

describe('dictionary matching', () => {
  describe('Default dictionary', () => {
    const zxcvbnOptions = new Options({
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
      translations: zxcvbnEnPackage.translations,
    })
    const matchDictionary = new MatchDictionary(zxcvbnOptions)
    const matches = matchDictionary.match({ password: 'we' })
    const patterns = ['we']
    const msg = 'default dictionaries'
    const ijs: number[][] = [[0, 1]]
    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'dictionary',
      patterns,
      ijs,
      propsToCheck: {
        matchedWord: patterns,
        rank: [19],
        dictionaryName: ['commonWords-en'],
      },
    })
  })
  describe('without user input', () => {
    const testDicts = {
      d1: ['motherboard', 'mother', 'board', 'abcd', 'cdef'],
      d2: ['z', '8', '99', '$', 'asdf1234&*'],
    }
    const zxcvbnOptions = new Options({
      dictionary: testDicts,
      translations: zxcvbnEnPackage.translations,
    })
    const matchDictionary = new MatchDictionary(zxcvbnOptions)
    const dm = (pw: string) =>
      matchDictionary.match({ password: pw }).filter((match) => !match.reversed)
    let matches = dm('motherboard')
    let patterns = ['mother', 'motherboard', 'board']
    let msg = 'matches words that contain other words'

    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'dictionary',
      patterns,
      ijs: [
        [0, 5],
        [0, 10],
        [6, 10],
      ],
      propsToCheck: {
        matchedWord: ['mother', 'motherboard', 'board'],
        rank: [2, 1, 3],
        dictionaryName: ['d1', 'd1', 'd1'],
      },
    })
    matches = dm('abcdef')
    patterns = ['abcd', 'cdef']
    msg = 'matches multiple words when they overlap'

    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'dictionary',
      patterns,
      ijs: [
        [0, 3],
        [2, 5],
      ],
      propsToCheck: {
        matchedWord: ['abcd', 'cdef'],
        rank: [4, 5],
        dictionaryName: ['d1', 'd1'],
      },
    })
    matches = dm('BoaRdZ')
    patterns = ['BoaRd', 'Z']
    msg = 'ignores uppercasing'

    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'dictionary',
      patterns,
      ijs: [
        [0, 4],
        [5, 5],
      ],
      propsToCheck: {
        matchedWord: ['board', 'z'],
        rank: [3, 1],
        dictionaryName: ['d1', 'd2'],
      },
    })

    const prefixes = ['q', '%%']
    const suffixes = ['%', 'qq']
    const testWord = 'asdf1234&*'
    const generatedGenPws = genpws(testWord, prefixes, suffixes)
    generatedGenPws.forEach(([password, i, j]) => {
      matches = dm(password)
      msg = 'identifies words surrounded by non-words'
      checkMatches({
        messagePrefix: msg,
        matches,
        patternNames: 'dictionary',
        patterns: [testWord],
        ijs: [[i, j]],
        propsToCheck: {
          matchedWord: [testWord],
          rank: [5],
          dictionaryName: ['d2'],
        },
      })
    })

    // eslint-disable-next-line @typescript-eslint/no-deprecated -- also checks the getter
    const { rankedDictionaries } = zxcvbnOptions
    Object.keys(rankedDictionaries).forEach((name) => {
      const dict = rankedDictionaries[name]
      Object.keys(dict).forEach((word) => {
        const rank = dict[word]
        if (word !== 'motherboard') {
          matches = dm(word)
          msg = 'matches against all words in provided dictionaries'
          checkMatches({
            messagePrefix: msg,
            matches,
            patternNames: 'dictionary',
            patterns: [word],
            ijs: [[0, word.length - 1]],
            propsToCheck: {
              matchedWord: [word],
              rank: [rank],
              dictionaryName: [name],
            },
          })
        }
      })
    })
  })

  describe('with user input', () => {
    const zxcvbnOptions = new Options({
      dictionary: {
        userInputs: ['foo', 'bar'],
      },
      translations: zxcvbnEnPackage.translations,
    })
    const matchDictionary = new MatchDictionary(zxcvbnOptions)
    const matches = matchDictionary
      .match({ password: 'foobar' })
      .filter((match) => match.dictionaryName === 'userInputs')

    const msg = 'matches with provided user input dictionary'
    checkMatches({
      messagePrefix: msg,
      matches,
      patternNames: 'dictionary',
      patterns: ['foo', 'bar'],
      ijs: [
        [0, 2],
        [3, 5],
      ],
      propsToCheck: {
        matchedWord: ['foo', 'bar'],
        rank: [1, 2],
      },
    })
  })

  describe('with user inputs and a userInputs dictionary', () => {
    const zxcvbnOptions = new Options({
      dictionary: {
        d1: ['foo', 'bar'],
        userInputs: ['bar', 'foo'],
        d2: ['foo'],
      },
      translations: zxcvbnEnPackage.translations,
    })
    const matchDictionary = new MatchDictionary(zxcvbnOptions)
    const getHits = (password: string, userInputs: (string | number)[]) =>
      matchDictionary
        .match({
          password,
          userInputsOptions: zxcvbnOptions.getUserInputsOptions(userInputs),
        })
        .map(({ matchedWord, dictionaryName, rank }) => [
          matchedWord,
          dictionaryName,
          rank,
        ])

    it('replaces the rank of the dictionary with the one of the user input', () => {
      expect(getHits('foo', ['x', 'foo'])).toEqual([
        ['foo', 'd1', 1],
        ['foo', 'userInputs', 2],
        ['foo', 'd2', 1],
      ])
    })

    it('keeps the rank of the dictionary without the user input', () => {
      expect(getHits('bar', ['foo'])).toEqual([
        ['bar', 'd1', 2],
        ['bar', 'userInputs', 1],
      ])
    })

    it('matches a user input that no dictionary has', () => {
      expect(getHits('Q😀z7', ['q😀z', 7])).toEqual([
        ['q😀z', 'userInputs', 1],
        ['7', 'userInputs', 2],
      ])
    })
  })

  describe('with user inputs and no userInputs dictionary', () => {
    const zxcvbnOptions = new Options({
      dictionary: { d1: ['foo'], d2: ['foo'] },
      translations: zxcvbnEnPackage.translations,
    })

    it('lists the user input after every dictionary', () => {
      expect(
        new MatchDictionary(zxcvbnOptions)
          .match({
            password: 'foo',
            userInputsOptions: zxcvbnOptions.getUserInputsOptions(['foo']),
          })
          .map(({ dictionaryName }) => dictionaryName),
      ).toEqual(['d1', 'd2', 'userInputs'])
    })

    it('matches user inputs options without a word index', () => {
      // eslint-disable-next-line @typescript-eslint/no-deprecated -- a hand-built UserInputsOptions
      const { rankedDictionary, rankedDictionaryMaxWordSize } =
        zxcvbnOptions.getUserInputsOptions(['bar', 'foo'])
      expect(
        new MatchDictionary(zxcvbnOptions)
          .match({
            password: 'foo',
            userInputsOptions: {
              rankedDictionary,
              rankedDictionaryMaxWordSize,
            },
          })
          .map(({ dictionaryName, rank }) => [dictionaryName, rank]),
      ).toEqual([
        ['d1', 1],
        ['d2', 1],
        ['userInputs', 2],
      ])
    })
  })

  describe('without levenshtein distance', () => {
    it('stops extending a window once no word starts with it', () => {
      const zxcvbnOptions = new Options({
        dictionary: { d1: ['password'] },
        translations: zxcvbnEnPackage.translations,
      })
      const narrow = vi.spyOn(zxcvbnOptions.wordIndex, 'narrow')
      new MatchDictionary(zxcvbnOptions).match({ password: 'passsword1' })

      // 'p', 'pa', 'pas', 'pass' and 'passs' from 0, then one character
      // from each of the other 9 starts
      expect(narrow).toHaveBeenCalledTimes(14)
    })
  })

  describe('with levenshtein distance', () => {
    const zxcvbnOptions = new Options({
      dictionary: { d1: ['password'] },
      translations: zxcvbnEnPackage.translations,
      useLevenshteinDistance: true,
    })
    const matchDictionary = new MatchDictionary(zxcvbnOptions)

    // 10 characters, 2 more than the longest dictionary word: the search for
    // substrings stops at 8, but the full password must still be compared
    checkMatches({
      messagePrefix:
        'checks a full password longer than every dictionary word by 2',
      matches: matchDictionary.match({ password: 'passsword1' }),
      patternNames: 'dictionary',
      patterns: ['passsword1'],
      ijs: [[0, 9]],
      propsToCheck: {
        levenshteinDistance: [2],
        levenshteinDistanceEntry: ['password'],
        rank: [1],
      },
    })
  })

  describe('with levenshtein distance and user inputs', () => {
    const zxcvbnOptions = new Options({
      dictionary: { userInputs: ['johnsmith', 'maryjones'] },
      translations: zxcvbnEnPackage.translations,
      useLevenshteinDistance: true,
    })
    const getHits = (password: string, userInputsOptions: UserInputsOptions) =>
      new MatchDictionary(zxcvbnOptions)
        .match({ password, userInputsOptions })
        .map(({ dictionaryName, rank, levenshteinDistanceEntry }) => [
          dictionaryName,
          rank,
          levenshteinDistanceEntry,
        ])

    it('replaces the rank of the dictionary with the one of the user input', () => {
      expect(
        getHits(
          'maryjonez',
          zxcvbnOptions.getUserInputsOptions(['x', 'maryjones']),
        ),
      ).toEqual([['userInputs', 2, 'maryjones']])
    })

    it('keeps the entries of the dictionary without the user input', () => {
      expect(
        getHits('johnsmlth', zxcvbnOptions.getUserInputsOptions(['x'])),
      ).toEqual([['userInputs', 1, 'johnsmith']])
    })

    it('only reads the word index of the user inputs', () => {
      const { wordIndex, rankedDictionaryMaxWordSize } =
        zxcvbnOptions.getUserInputsOptions(['peterpan'])
      const userInputsOptions = {
        get rankedDictionary(): RankedDictionary {
          throw new Error('rankedDictionary is deprecated')
        },
        rankedDictionaryMaxWordSize,
        wordIndex,
      }
      expect(getHits('peterpam', userInputsOptions)).toEqual([
        ['userInputs', 1, 'peterpan'],
      ])
    })
  })

  describe('with a hand-built UserInputsOptions', () => {
    const zxcvbnOptions = new Options({
      translations: zxcvbnEnPackage.translations,
      useLevenshteinDistance: true,
    })
    const getHits = (password: string, userInputsOptions: UserInputsOptions) =>
      new MatchDictionary(zxcvbnOptions)
        .match({ password, userInputsOptions })
        .filter(({ i, j }) => i === 0 && j === password.length - 1)
        .map(({ dictionaryName, rank, levenshteinDistanceEntry }) => [
          dictionaryName,
          rank,
          levenshteinDistanceEntry,
        ])

    it('finds the user inputs added to its rankedDictionary', () => {
      const rankedDictionary: RankedDictionary = { peterpan: 1 }
      const userInputsOptions = {
        rankedDictionary,
        rankedDictionaryMaxWordSize: 8,
      }
      expect(getHits('peterpan', userInputsOptions)).toEqual([
        ['userInputs', 1, undefined],
      ])
      rankedDictionary.wendydarling = 2
      expect(getHits('wendydarling', userInputsOptions)).toEqual([
        ['userInputs', 2, undefined],
      ])
      // with a stale rankedDictionaryMaxWordSize
      expect(getHits('wendydarlinx', userInputsOptions)).toEqual([
        ['userInputs', 2, 'wendydarling'],
      ])
      rankedDictionary.peterpan = 3
      expect(getHits('peterpan', userInputsOptions)).toEqual([
        ['userInputs', 3, undefined],
      ])
    })
  })

  describe('with a character whose lowercase form is longer', () => {
    // 'İ' (U+0130) lowercases to 'i' + U+0307, two code units instead of one
    const zxcvbnOptions = new Options({
      dictionary: { d1: ['mother', 'board', 'motherboard', 'istanbul'] },
      translations: zxcvbnEnPackage.translations,
    })
    const matchDictionary = new MatchDictionary(zxcvbnOptions)
    const dm = (pw: string) =>
      matchDictionary.match({ password: pw }).filter((match) => !match.reversed)

    checkMatches({
      messagePrefix: 'keeps matches after it aligned with the password',
      matches: dm('İmotherboard'),
      patternNames: 'dictionary',
      patterns: ['mother', 'motherboard', 'board'],
      ijs: [
        [1, 6],
        [1, 11],
        [7, 11],
      ],
      propsToCheck: {
        matchedWord: ['mother', 'motherboard', 'board'],
      },
    })

    checkMatches({
      messagePrefix: "matches 'İ' as an uppercase 'i'",
      matches: dm('İstanbul'),
      patternNames: 'dictionary',
      patterns: ['İstanbul'],
      ijs: [[0, 7]],
      propsToCheck: {
        matchedWord: ['istanbul'],
      },
    })

    checkMatches({
      messagePrefix: "matches a user input containing 'İ'",
      matches: matchDictionary
        .match({
          password: 'İxqzvbnw',
          userInputsOptions: zxcvbnOptions.getUserInputsOptions(['İxqzvbnw']),
        })
        .filter((match) => match.dictionaryName === 'userInputs'),
      patternNames: 'dictionary',
      patterns: ['İxqzvbnw'],
      ijs: [[0, 7]],
      propsToCheck: {
        matchedWord: ['ixqzvbnw'],
      },
    })
  })
})
