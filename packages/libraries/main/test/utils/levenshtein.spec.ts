import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common/src'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en/src'
import { ZxcvbnFactory } from '../../src'
import findLevenshteinDistance from '../../src/utils/levenshtein'
import Options from '../../src/Options'
import MatchDictionary from '../../src/matcher/dictionary/matching'
import MatchL33t from '../../src/matcher/dictionary/variants/matching/l33t'
import MatchReverse from '../../src/matcher/dictionary/variants/matching/reverse'
import { DictionaryMatch, RankedDictionary } from '../../src/types'

describe('levenshtein', () => {
  const zxcvbn = new ZxcvbnFactory({
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    translations: zxcvbnEnPackage.translations,
    useLevenshteinDistance: true,
  })

  it('should find levensteindistance', () => {
    const result = zxcvbn.check('ishduehlduod83h4mfs8', [
      'ishduehgldueod83h4mfs8',
    ])
    expect(result.calcTime).toBeDefined()
    result.calcTime = 0
    expect(result).toEqual({
      calcTime: 0,
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
          levenshteinDistance: 2,
          levenshteinDistanceEntry: 'ishduehgldueod83h4mfs8',
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

  it('should recognize a mistyped common English word', () => {
    const result = zxcvbn.check('alaphant')
    expect(result.calcTime).toBeDefined()
    result.calcTime = 0
    expect(
      result.sequence.find(
        (sequenceItem) => sequenceItem.levenshteinDistance !== undefined,
      ),
    ).toBeDefined()
    expect(result).toEqual({
      calcTime: 0,
      crackTimes: {
        offlineFastHashingXPerSecond: {
          base: null,
          display: 'less than a second',
          seconds: 3.45e-8,
        },
        offlineSlowHashingXPerSecond: {
          base: null,
          display: 'less than a second',
          seconds: 0.0345,
        },
        onlineNoThrottlingXPerSecond: {
          base: 35,
          display: '35 seconds',
          seconds: 34.5,
        },
        onlineThrottlingXPerHour: {
          base: 3,
          display: '3 hours',
          seconds: 12420,
        },
      },
      feedback: {
        suggestions: ['Add more words that are less common.'],
        warning: 'This is a commonly used password.',
      },
      guesses: 345,
      guessesLog10: 2.537819095073274,
      password: 'alaphant',
      score: 0,
      sequence: [
        {
          baseGuesses: 344,
          dictionaryName: 'passwords-common',
          guesses: 344,
          guessesLog10: 2.53655844257153,
          i: 0,
          j: 7,
          l33t: false,
          l33tVariations: 1,
          levenshteinDistance: 2,
          levenshteinDistanceEntry: 'elephant',
          matchedWord: 'alaphant',
          pattern: 'dictionary',
          rank: 344,
          reversed: false,
          token: 'alaphant',
          uppercaseVariations: 1,
        },
      ],
    })
  })

  it('should respect threshold which is lower than the default 2', () => {
    const customZxcvbn = new ZxcvbnFactory({
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      translations: zxcvbnEnPackage.translations,
      useLevenshteinDistance: true,
      levenshteinThreshold: 1,
    })
    const result = customZxcvbn.check('eeleephaant')
    expect(
      result.sequence.find(
        (sequenceItem) => sequenceItem.levenshteinDistance !== undefined,
      ),
    ).toBeUndefined()
  })

  it('should respect threshold which is higher than the default 2', () => {
    const customZxcvbn = new ZxcvbnFactory({
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      translations: zxcvbnEnPackage.translations,
      useLevenshteinDistance: true,
      levenshteinThreshold: 3,
    })
    const result = customZxcvbn.check('eeleephaant')
    expect(result.sequence.length).toStrictEqual(1)
    expect(result.sequence[0].levenshteinDistance).toBeDefined()
  })

  // the l33t matcher runs this once per substituted password against the same
  // dictionaries, and listing the keys of a large dictionary is slow in V8
  it('should list the keys of a dictionary only once', () => {
    const rankedDictionary = { elephant: 1, giraffe: 2 }
    const objectKeysSpy = jest.spyOn(Object, 'keys')
    try {
      expect(findLevenshteinDistance('alaphant', rankedDictionary, 2)).toEqual({
        levenshteinDistance: 2,
        levenshteinDistanceEntry: 'elephant',
      })
      expect(findLevenshteinDistance('girafe', rankedDictionary, 2)).toEqual({
        levenshteinDistance: 1,
        levenshteinDistanceEntry: 'giraffe',
      })
      const dictionaryCalls = objectKeysSpy.mock.calls.filter(
        ([object]) => object === rankedDictionary,
      )
      expect(dictionaryCalls).toHaveLength(1)
    } finally {
      objectKeysSpy.mockRestore()
    }
  })

  it('should return the first entry within the threshold in dictionary order', () => {
    // 'elephants' is one longer and 'elephan' one shorter, both are 1 edit away
    expect(
      findLevenshteinDistance('elephant', { elephants: 1, elephan: 2 }, 2),
    ).toEqual({
      levenshteinDistance: 1,
      levenshteinDistanceEntry: 'elephants',
    })
    expect(
      findLevenshteinDistance('elephant', { elephan: 1, elephants: 2 }, 2),
    ).toEqual({
      levenshteinDistance: 1,
      levenshteinDistanceEntry: 'elephan',
    })
  })

  describe('findLevenshteinDistance', () => {
    describe('edit operations', () => {
      it.each([
        { edit: 'an exact match', password: 'password', edits: 0 },
        { edit: 'a substituted character', password: 'passwerd', edits: 1 },
        { edit: 'an inserted character', password: 'passwoord', edits: 1 },
        { edit: 'a deleted character', password: 'pasword', edits: 1 },
        { edit: 'a changed first character', password: 'bassword', edits: 1 },
        { edit: 'a changed last character', password: 'passwort', edits: 1 },
        {
          edit: 'a deletion and a substitution',
          password: 'paswerd',
          edits: 2,
        },
        // levenshtein has no transposition, a swap is two substitutions
        { edit: 'two swapped characters', password: 'passwrod', edits: 2 },
      ])('counts $edit as $edits edit(s)', ({ password, edits }) => {
        expect(findLevenshteinDistance(password, { password: 1 }, 2)).toEqual({
          levenshteinDistance: edits,
          levenshteinDistanceEntry: 'password',
        })
      })
    })

    describe('threshold', () => {
      // the text with its last characters replaced by a letter not in it
      const withSubstitutions = (text: string, count: number) =>
        `${text.slice(0, text.length - count)}${'z'.repeat(count)}`

      const password = 'abcdefghijklmnop'
      // a shorter, a same length and a longer entry, each count edits away
      const entriesWithEdits = (count: number) => [
        password.slice(0, password.length - count),
        withSubstitutions(password, count),
        `${password}${'z'.repeat(count)}`,
      ]

      it.each([0, 1, 2, 3, 4, 5])(
        'allows as many edits as a threshold of %i, whatever the length of the entry',
        (threshold) => {
          entriesWithEdits(threshold).forEach((entry) => {
            expect(
              findLevenshteinDistance(password, { [entry]: 1 }, threshold),
            ).toEqual({
              levenshteinDistance: threshold,
              levenshteinDistanceEntry: entry,
            })
          })
          entriesWithEdits(threshold + 1).forEach((entry) => {
            expect(
              findLevenshteinDistance(password, { [entry]: 1 }, threshold),
            ).toEqual({})
          })
        },
      )

      it.each([1, 2, 3, 4, 5, 8, 9, 12, 16, 20])(
        'allows a threshold of 2 for a password of %i character(s)',
        (length) => {
          const passwordOfLength = 'abcdefghijklmnopqrst'.slice(0, length)
          const entry = withSubstitutions(passwordOfLength, 2)
          expect(
            findLevenshteinDistance(passwordOfLength, { [entry]: 1 }, 2),
          ).toEqual({
            levenshteinDistance: 2,
            levenshteinDistanceEntry: entry,
          })
          const tooFarEntry = withSubstitutions(passwordOfLength, 3)
          expect(
            findLevenshteinDistance(passwordOfLength, { [tooFarEntry]: 1 }, 2),
          ).toEqual({})
        },
      )

      it('allows the threshold for a password shorter than the entry', () => {
        // 2 missing letters are 2 edits, 3 are too many
        expect(findLevenshteinDistance('passwo', { password: 1 }, 2)).toEqual({
          levenshteinDistance: 2,
          levenshteinDistanceEntry: 'password',
        })
        expect(findLevenshteinDistance('passw', { password: 1 }, 2)).toEqual({})
      })

      it('rounds a threshold that is not a whole number down', () => {
        expect(
          findLevenshteinDistance(
            password,
            { [withSubstitutions(password, 2)]: 1 },
            2.5,
          ),
        ).toEqual({
          levenshteinDistance: 2,
          levenshteinDistanceEntry: withSubstitutions(password, 2),
        })
        expect(
          findLevenshteinDistance(
            password,
            { [withSubstitutions(password, 3)]: 1 },
            2.5,
          ),
        ).toEqual({})
        expect(findLevenshteinDistance('pass', { past: 1 }, 1.5)).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'past',
        })
      })

      it('matches the most common entry with an infinite threshold', () => {
        expect(
          findLevenshteinDistance(
            password,
            { xyz: 1, [withSubstitutions(password, 1)]: 2 },
            Infinity,
          ),
        ).toEqual({
          levenshteinDistance: 16,
          levenshteinDistanceEntry: 'xyz',
        })
      })
    })

    describe('short passwords', () => {
      it.each([
        ['a', 'b', 1],
        ['ab', 'abc', 1],
        ['ab', 'cd', 2],
        ['abc', 'a', 2],
        ['cat', 'coats', 2],
      ])('matches %s with %s, %i edit(s) away', (password, entry, edits) => {
        expect(findLevenshteinDistance(password, { [entry]: 1 }, 2)).toEqual({
          levenshteinDistance: edits,
          levenshteinDistanceEntry: entry,
        })
      })

      it.each([
        ['a', 'bcd'],
        ['cat', 'dog'],
      ])("doesn't match %s with %s, 3 edits away", (password, entry) => {
        expect(findLevenshteinDistance(password, { [entry]: 1 }, 2)).toEqual({})
      })
    })

    describe('rank', () => {
      it('prefers a more common entry over a closer one', () => {
        // 'house' is 2 edits away and 'mouse' only 1, but 'house' ranks first
        expect(
          findLevenshteinDistance('mause', { house: 1, mouse: 2 }, 2),
        ).toEqual({
          levenshteinDistance: 2,
          levenshteinDistanceEntry: 'house',
        })
      })

      it('returns the most common of equally close entries of the same length', () => {
        expect(
          findLevenshteinDistance('passward', { passwerd: 1, password: 2 }, 2),
        ).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'passwerd',
        })
        expect(
          findLevenshteinDistance('passward', { password: 1, passwerd: 2 }, 2),
        ).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'password',
        })
      })

      // one entry shorter, one of the same length and one longer, all 1 edit away
      it.each([
        ['abcdefg', 'abcdefgz', 'abcdefghi'],
        ['abcdefg', 'abcdefghi', 'abcdefgz'],
        ['abcdefgz', 'abcdefg', 'abcdefghi'],
        ['abcdefgz', 'abcdefghi', 'abcdefg'],
        ['abcdefghi', 'abcdefg', 'abcdefgz'],
        ['abcdefghi', 'abcdefgz', 'abcdefg'],
      ])(
        'returns the most common of %s, %s and %s, whatever their length',
        (...entries) => {
          const rankedDictionary = Object.fromEntries(
            entries.map((entry, index) => [entry, index + 1]),
          )
          expect(
            findLevenshteinDistance('abcdefgh', rankedDictionary, 2),
          ).toEqual({
            levenshteinDistance: 1,
            levenshteinDistanceEntry: entries[0],
          })
        },
      )

      it('goes by rank, not by the order of the keys', () => {
        // Object.keys lists integer-like keys first, in numeric order
        expect(
          findLevenshteinDistance('1234568', { 1234567: 1, 123456: 2 }, 2),
        ).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: '1234567',
        })
        expect(
          findLevenshteinDistance('passward', { passwerd: 2, password: 1 }, 2),
        ).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'password',
        })
      })

      it('returns the password itself unless a more common entry is close', () => {
        expect(
          findLevenshteinDistance('passwerd', { password: 1, passwerd: 2 }, 2),
        ).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'password',
        })
        expect(
          findLevenshteinDistance('passwerd', { passwerd: 1, password: 2 }, 2),
        ).toEqual({
          levenshteinDistance: 0,
          levenshteinDistanceEntry: 'passwerd',
        })
      })

      it('skips entries that are too far away', () => {
        expect(
          findLevenshteinDistance(
            'passwurd',
            { pass: 1, dragon: 2, password: 3 },
            2,
          ),
        ).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'password',
        })
      })
    })

    describe('without a match', () => {
      it('returns nothing for an empty dictionary', () => {
        expect(findLevenshteinDistance('password', {}, 2)).toEqual({})
      })

      it('returns nothing when no entry is close enough', () => {
        expect(
          findLevenshteinDistance(
            'password',
            { dragon: 1, monkey: 2, sunshine: 3 },
            2,
          ),
        ).toEqual({})
      })

      it('never returns an empty entry', () => {
        // an empty user input ends up as an empty entry
        expect(findLevenshteinDistance('a', { '': 1 }, 2)).toEqual({})
      })

      it('skips an empty entry to find the next one', () => {
        expect(findLevenshteinDistance('a', { '': 1, 'b': 2 }, 2)).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'b',
        })
      })

      it('compares case-sensitively, the caller lowercases the password', () => {
        expect(findLevenshteinDistance('PASSWORD', { password: 1 }, 2)).toEqual(
          {},
        )
      })
    })

    describe('characters', () => {
      it.each([
        ['straße', 'strasse', 2],
        ['cafe', 'café', 1],
        ['пороль', 'пароль', 1],
        ['密吗', '密码', 1],
      ])(
        'counts the edits between %s and %s by letter: %i',
        (password, entry, edits) => {
          expect(findLevenshteinDistance(password, { [entry]: 1 }, 2)).toEqual({
            levenshteinDistance: edits,
            levenshteinDistanceEntry: entry,
          })
        },
      )

      it.each([
        ['p😀ssword', 'password', 1],
        ['password😀', 'password', 1],
        ['password😀😀', 'password', 2],
        ['😀smile', '😁smile', 1],
        ['smile', 'smile😀', 1],
      ])(
        'counts an emoji as one character: %s and %s are %i edit(s) apart',
        (password, entry, edits) => {
          expect(findLevenshteinDistance(password, { [entry]: 1 }, 2)).toEqual({
            levenshteinDistance: edits,
            levenshteinDistanceEntry: entry,
          })
        },
      )

      it('fits an added emoji within a threshold of 1', () => {
        expect(
          findLevenshteinDistance('password😀', { password: 1 }, 1),
        ).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'password',
        })
      })

      it("doesn't take an emoji for the noncharacter U+FFFF", () => {
        expect(
          findLevenshteinDistance('pass😀', { 'pass\uffff': 1 }, 2),
        ).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'pass\uffff',
        })
      })

      it('counts a digit or symbol in place of a letter as an edit', () => {
        // levenshtein knows nothing about l33t, these are two substitutions
        expect(findLevenshteinDistance('p@ssw0rd', { password: 1 }, 2)).toEqual(
          {
            levenshteinDistance: 2,
            levenshteinDistanceEntry: 'password',
          },
        )
      })
    })

    describe('dictionaries', () => {
      it('keeps the entries of different dictionaries apart', () => {
        const passwords = { password: 1 }
        const animals = { dragon: 1, monkey: 2 }
        expect(findLevenshteinDistance('passwerd', passwords, 2)).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'password',
        })
        expect(findLevenshteinDistance('passwerd', animals, 2)).toEqual({})
        expect(findLevenshteinDistance('dragan', passwords, 2)).toEqual({})
        expect(findLevenshteinDistance('dragan', animals, 2)).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'dragon',
        })
      })

      it('finds entries of any length in a dictionary it has seen before', () => {
        const rankedDictionary = { ab: 1, abcde: 2, abcdefghij: 3 }
        expect(findLevenshteinDistance('ac', rankedDictionary, 2)).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'ab',
        })
        expect(findLevenshteinDistance('abcdx', rankedDictionary, 2)).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'abcde',
        })
        expect(
          findLevenshteinDistance('abcdefghix', rankedDictionary, 2),
        ).toEqual({
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'abcdefghij',
        })
      })
    })

    // only entries of a length close to the password's are compared, which has
    // to find the same entry as comparing every entry, most common first
    describe('compared with checking every entry', () => {
      // the textbook Levenshtein distance, by character
      const characterDistance = (first: string, second: string) => {
        const secondCharacters = Array.from(second)
        let previousRow = Array.from(
          { length: secondCharacters.length + 1 },
          (_, index) => index,
        )
        Array.from(first).forEach((firstCharacter, firstIndex) => {
          const row = [firstIndex + 1]
          secondCharacters.forEach((secondCharacter, secondIndex) => {
            row.push(
              Math.min(
                previousRow[secondIndex + 1] + 1,
                row[secondIndex] + 1,
                previousRow[secondIndex] +
                  (firstCharacter === secondCharacter ? 0 : 1),
              ),
            )
          })
          previousRow = row
        })
        return previousRow[secondCharacters.length]
      }

      const checkEveryEntry = (
        password: string,
        rankedDictionary: RankedDictionary,
        threshold: number,
      ) => {
        const found = Object.keys(rankedDictionary)
          .filter((entry) => entry !== '')
          .sort(
            (first, second) =>
              rankedDictionary[first] - rankedDictionary[second],
          )
          .find((entry) => characterDistance(password, entry) <= threshold)
        return found === undefined
          ? {}
          : {
              levenshteinDistance: characterDistance(password, found),
              levenshteinDistanceEntry: found,
            }
      }

      it('finds the same entry for random passwords and dictionaries', () => {
        // seeded, so a failure can be reproduced
        let seed = 20261029
        const randomInt = (min: number, max: number) => {
          seed = (seed * 16807) % 2147483647
          return min + (seed % (max - min + 1))
        }
        // few characters, so many words are close to each other
        const characters = ['a', 'b', 'c', '😀']
        const randomCharacter = () =>
          characters[randomInt(0, characters.length - 1)]
        const randomWord = (length: number) =>
          Array.from({ length }, randomCharacter).join('')
        const withRandomEdits = (word: string, edits: number) => {
          const result = Array.from(word)
          for (let edit = 0; edit < edits; edit += 1) {
            const position = randomInt(0, result.length - 1)
            const operation = randomInt(0, 2)
            if (operation === 0) {
              result.splice(position, 0, randomCharacter())
            } else if (operation === 1 && result.length > 1) {
              result.splice(position, 1)
            } else {
              result[position] = randomCharacter()
            }
          }
          return result.join('')
        }
        const thresholds = [0, 1, 1.5, 2, 2.5, 3, 4, Infinity]

        let checks = 0
        let found = 0
        const differences = []
        for (let dictionary = 0; dictionary < 20; dictionary += 1) {
          // with the occasional empty entry
          const words = Array.from({ length: 30 }, () =>
            randomWord(randomInt(0, 12)),
          )
          // shuffled ranks, so they aren't in the order of the keys
          const ranks = words.map((_, index) => index + 1)
          for (let index = ranks.length - 1; index > 0; index -= 1) {
            const other = randomInt(0, index)
            const rank = ranks[index]
            ranks[index] = ranks[other]
            ranks[other] = rank
          }
          const rankedDictionary = Object.fromEntries(
            words.map((word, index) => [word, ranks[index]]),
          )
          const nonEmptyWords = words.filter((word) => word !== '')
          for (let check = 0; check < 50; check += 1) {
            // every other password is a dictionary word with 0 to 4 edits
            const password =
              check % 2 === 0
                ? randomWord(randomInt(1, 14))
                : withRandomEdits(
                    nonEmptyWords[randomInt(0, nonEmptyWords.length - 1)],
                    randomInt(0, 4),
                  )
            const threshold = thresholds[randomInt(0, thresholds.length - 1)]
            const expected = checkEveryEntry(
              password,
              rankedDictionary,
              threshold,
            )
            const result = findLevenshteinDistance(
              password,
              rankedDictionary,
              threshold,
            )
            checks += 1
            if (result.levenshteinDistanceEntry !== undefined) {
              found += 1
            }
            if (
              result.levenshteinDistanceEntry !==
                expected.levenshteinDistanceEntry ||
              result.levenshteinDistance !== expected.levenshteinDistance
            ) {
              differences.push({ password, words, threshold, expected, result })
            }
          }
        }
        expect(differences).toEqual([])
        // make sure plenty of checks found an entry and plenty didn't
        expect(found).toBeGreaterThan(checks / 4)
        expect(found).toBeLessThan((checks * 3) / 4)
      })
    })
  })

  describe('dictionary matcher', () => {
    const options = new Options({
      dictionary: { words: ['password', 'dragon', 'monkey'] },
      useLevenshteinDistance: true,
    })
    const matchDictionary = new MatchDictionary(options)
    const levenshteinMatches = (matches: DictionaryMatch[]) =>
      matches.filter((match) => match.levenshteinDistance !== undefined)

    it('matches a mistyped password with the entry it is close to', () => {
      expect(matchDictionary.match({ password: 'passwerd' })).toEqual([
        {
          pattern: 'dictionary',
          i: 0,
          j: 7,
          token: 'passwerd',
          matchedWord: 'passwerd',
          rank: 1,
          dictionaryName: 'words',
          reversed: false,
          l33t: false,
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'password',
        },
      ])
    })

    it('takes the rank of the entry it matched', () => {
      expect(
        levenshteinMatches(matchDictionary.match({ password: 'monkee' })),
      ).toMatchObject([
        {
          rank: 3,
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'monkey',
        },
      ])
    })

    it('lowercases the password but keeps the original token', () => {
      expect(
        levenshteinMatches(matchDictionary.match({ password: 'PassWerd' })),
      ).toMatchObject([
        {
          token: 'PassWerd',
          matchedWord: 'passwerd',
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'password',
        },
      ])
    })

    it("doesn't add a distance to an exact match", () => {
      const matches = matchDictionary.match({ password: 'password' })
      expect(matches).toHaveLength(1)
      expect(matches[0]).not.toHaveProperty('levenshteinDistance')
      expect(matches[0]).not.toHaveProperty('levenshteinDistanceEntry')
    })

    it('only compares the full password, not the words in it', () => {
      // 'dragon' is found as it is, 'passwerd' isn't compared on its own
      const matches = matchDictionary.match({ password: 'dragonpasswerd' })
      expect(matches.map((match) => match.token)).toEqual(['dragon'])
      expect(levenshteinMatches(matches)).toEqual([])
    })

    it('is off unless useLevenshteinDistance is set', () => {
      const withoutLevenshtein = new MatchDictionary(
        new Options({ dictionary: { words: ['password'] } }),
      )
      expect(withoutLevenshtein.match({ password: 'passwerd' })).toEqual([])
    })

    it('is skipped when the caller passes useLevenshtein: false', () => {
      // the l33t matcher does this for passwords with only some substitutions
      expect(
        matchDictionary.match({ password: 'passwerd', useLevenshtein: false }),
      ).toEqual([])
    })

    const withThreshold = (levenshteinThreshold: number) =>
      new MatchDictionary(
        new Options({
          dictionary: { words: ['password'] },
          useLevenshteinDistance: true,
          levenshteinThreshold,
        }),
      )

    it('uses the levenshteinThreshold option', () => {
      // 'password123' is 3 edits away from 'password'
      expect(
        levenshteinMatches(withThreshold(2).match({ password: 'password123' })),
      ).toEqual([])
      expect(
        levenshteinMatches(withThreshold(3).match({ password: 'password123' })),
      ).toMatchObject([
        { levenshteinDistance: 3, levenshteinDistanceEntry: 'password' },
      ])
    })

    it('matches nothing with a levenshteinThreshold of 0', () => {
      expect(withThreshold(0).match({ password: 'passwerd' })).toEqual([])
    })

    it.each([2.5, Infinity])(
      'matches with a levenshteinThreshold of %d',
      (levenshteinThreshold) => {
        expect(
          withThreshold(levenshteinThreshold).match({ password: 'passwerd' }),
        ).toMatchObject([
          { levenshteinDistance: 1, levenshteinDistanceEntry: 'password' },
        ])
      },
    )

    it('counts an emoji as one character when the password is longer than every entry', () => {
      // 12 code units, but 10 characters: 2 more than 'password'
      expect(
        levenshteinMatches(matchDictionary.match({ password: 'password😀😀' })),
      ).toMatchObject([
        { levenshteinDistance: 2, levenshteinDistanceEntry: 'password' },
      ])
    })

    it('prefers a more common close entry over the exact password', () => {
      const matcher = new MatchDictionary(
        new Options({
          dictionary: { words: ['password', 'dragon', 'passwerd'] },
          useLevenshteinDistance: true,
        }),
      )
      expect(matcher.match({ password: 'passwerd' })).toEqual([
        {
          pattern: 'dictionary',
          i: 0,
          j: 7,
          token: 'passwerd',
          matchedWord: 'passwerd',
          rank: 1,
          dictionaryName: 'words',
          reversed: false,
          l33t: false,
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'password',
        },
      ])
    })

    it('keeps the exact match when no more common entry is close', () => {
      const matcher = new MatchDictionary(
        new Options({
          dictionary: { words: ['passwerd', 'password'] },
          useLevenshteinDistance: true,
        }),
      )
      expect(matcher.match({ password: 'passwerd' })).toEqual([
        {
          pattern: 'dictionary',
          i: 0,
          j: 7,
          token: 'passwerd',
          matchedWord: 'passwerd',
          rank: 1,
          dictionaryName: 'words',
          reversed: false,
          l33t: false,
        },
      ])
    })

    it('compares the password with each dictionary', () => {
      const matcher = new MatchDictionary(
        new Options({
          dictionary: { d1: ['password'], d2: ['passwork'] },
          useLevenshteinDistance: true,
        }),
      )
      expect(matcher.match({ password: 'passwerk' })).toMatchObject([
        {
          dictionaryName: 'd1',
          levenshteinDistance: 2,
          levenshteinDistanceEntry: 'password',
        },
        {
          dictionaryName: 'd2',
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'passwork',
        },
      ])
    })

    it('looks for a close entry in a dictionary without the exact password', () => {
      const matcher = new MatchDictionary(
        new Options({
          dictionary: { d1: ['password'], d2: ['passwerd'] },
          useLevenshteinDistance: true,
        }),
      )
      const matches = matcher.match({ password: 'passwerd' })
      expect(matches).toHaveLength(2)
      expect(matches[0]).toMatchObject({
        dictionaryName: 'd1',
        levenshteinDistance: 1,
        levenshteinDistanceEntry: 'password',
      })
      expect(matches[1]).toMatchObject({ dictionaryName: 'd2', rank: 1 })
      expect(matches[1]).not.toHaveProperty('levenshteinDistance')
    })

    it('matches a mistyped user input', () => {
      const userInputsOptions = options.getUserInputsOptions([
        'JohnSmith',
        19850412,
      ])
      expect(
        levenshteinMatches(
          matchDictionary.match({ password: 'jonsmith', userInputsOptions }),
        ),
      ).toMatchObject([
        {
          dictionaryName: 'userInputs',
          rank: 1,
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'johnsmith',
        },
      ])
      expect(
        levenshteinMatches(
          matchDictionary.match({ password: '19850413', userInputsOptions }),
        ),
      ).toMatchObject([
        {
          dictionaryName: 'userInputs',
          rank: 2,
          levenshteinDistance: 1,
          levenshteinDistanceEntry: '19850412',
        },
      ])
    })

    it('matches a mistyped password written backwards', () => {
      expect(
        levenshteinMatches(
          new MatchReverse(options).match({ password: 'drewssap' }),
        ),
      ).toEqual([
        {
          pattern: 'dictionary',
          i: 0,
          j: 7,
          token: 'drewssap',
          matchedWord: 'passwerd',
          rank: 1,
          dictionaryName: 'words',
          reversed: true,
          l33t: false,
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'password',
        },
      ])
    })

    it('matches a mistyped password with l33t substitutions', () => {
      expect(
        levenshteinMatches(
          new MatchL33t(options).match({ password: 'p4sswerd' }),
        ),
      ).toEqual([
        {
          pattern: 'dictionary',
          i: 0,
          j: 7,
          token: 'p4sswerd',
          matchedWord: 'passwerd',
          rank: 1,
          dictionaryName: 'words',
          reversed: false,
          l33t: true,
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'password',
          subs: [{ letter: 'a', substitution: '4' }],
          subDisplay: '4 -> a',
        },
      ])
    })

    it('matches a l33t password only once all substitutions are made', () => {
      // 'p4ssworf' and 'passw0rf' are only partly substituted
      expect(
        levenshteinMatches(
          new MatchL33t(options).match({ password: 'p4ssw0rf' }),
        ),
      ).toMatchObject([
        {
          token: 'p4ssw0rf',
          matchedWord: 'passworf',
          levenshteinDistance: 1,
          levenshteinDistanceEntry: 'password',
          subs: [
            { letter: 'a', substitution: '4' },
            { letter: 'o', substitution: '0' },
          ],
        },
      ])
    })
  })

  describe('password strength', () => {
    const zxcvbnWithoutLevenshtein = new ZxcvbnFactory({
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      translations: zxcvbnEnPackage.translations,
    })

    it.each([
      // 'passwerd' is in the password list too, but far less common
      ['passwerd', 'password'],
      ['sunshien', 'sunshine'],
      ['baseabll', 'baseball'],
      ['iloveyuo', 'iloveyou'],
      ['shadwo', 'shadow'],
      ['qwertyiop', 'qwertyuiop'],
      ['dargon', 'dragon'],
      ['monkye', 'monkey'],
    ])('rates %s as a mistyped %s', (password, entry) => {
      const result = zxcvbn.check(password)
      expect(result.sequence).toHaveLength(1)
      expect(result.sequence[0].levenshteinDistanceEntry).toBe(entry)
      expect(result.guesses).toBeLessThan(
        zxcvbnWithoutLevenshtein.check(password).guesses,
      )
    })

    it("doesn't change the rating of a password in a dictionary", () => {
      expect(zxcvbn.check('password').guesses).toBe(
        zxcvbnWithoutLevenshtein.check('password').guesses,
      )
    })
  })
})
