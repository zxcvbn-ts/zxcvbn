import * as zxcvbnCommonPackage from '../../../../../languages/common/src'
import * as zxcvbnEnPackage from '../../../../../languages/en/src'
import MatchDictionary from '../../../src/matcher/dictionary/matching'
import checkMatches from '../../helper/checkMatches'
import genpws from '../../helper/genpws'
import Options from '../../../src/Options'

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

    Object.keys(zxcvbnOptions.dictionary).forEach((name) => {
      const list = zxcvbnOptions.dictionary[name]
      list.forEach((wordOrNumber, index) => {
        const word = wordOrNumber.toString().toLowerCase()
        const rank = index + 1
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

  describe('duplicate words in a dictionary', () => {
    const zxcvbnOptions = new Options({
      dictionary: { commonWords: ['dupe', 'other', 'dupe'] },
      translations: zxcvbnEnPackage.translations,
    })
    const matchDictionary = new MatchDictionary(zxcvbnOptions)
    const matches = matchDictionary
      .match({ password: 'dupe' })
      .filter((match) => !match.reversed)

    it('should collapse a word listed twice in the same dictionary into a single match', () => {
      expect(matches).toHaveLength(1)
    })

    it('should keep the rank of the last occurrence', () => {
      expect(matches[0].rank).toBe(3)
    })
  })

  describe('levenshtein skip for an already-exact-matched dictionary', () => {
    const zxcvbnOptions = new Options({
      dictionary: { words: ['cat'] },
      translations: zxcvbnEnPackage.translations,
      useLevenshteinDistance: true,
    })
    const matchDictionary = new MatchDictionary(zxcvbnOptions)
    const matches = matchDictionary
      .match({ password: 'cat' })
      .filter((match) => !match.reversed)

    it('should not add a duplicate levenshtein match for a dictionary already matched exactly', () => {
      expect(matches).toHaveLength(1)
      expect(matches[0].matchedWord).toBe('cat')
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
})
