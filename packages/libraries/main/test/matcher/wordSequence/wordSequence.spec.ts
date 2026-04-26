import { ZxcvbnFactory } from '../../../src'
import wordSequences from '../../../../../languages/en/src/wordSequences.json'
import scoring from '../../../src/matcher/wordSequence/scoring'
import feedback from '../../../src/matcher/wordSequence/feedback'
import Options from '../../../src/Options'

describe('WordSequence Matcher', () => {
  let zxcvbn: ZxcvbnFactory

  beforeEach(() => {
    // Create a custom dictionary with all word sequences
    const customDictionary = {
      ...wordSequences,
    }

    zxcvbn = new ZxcvbnFactory({
      dictionary: customDictionary,
    })
  })

  describe('Cardinal Numbers', () => {
    it('should detect camelCase cardinal number sequences', () => {
      const result = zxcvbn.check('oneTwoThree')
      // console.log(result)
      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['one', 'two', 'three'])
        expect(wordSequenceMatch.wordCount).toBe(3)
        expect(wordSequenceMatch.dictionaryName).toBe('cardinalNumbers')
      }
    })

    it('should detect snake_case cardinal number sequences', () => {
      const result = zxcvbn.check('four_five_six')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['four', 'five', 'six'])
        expect(wordSequenceMatch.wordCount).toBe(3)
      }
    })

    it('should detect reverse camelCase cardinal number sequences', () => {
      const result = zxcvbn.check('ThreeTwoOne')
      // console.log(result)
      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['three', 'two', 'one'])
        expect(wordSequenceMatch.wordCount).toBe(3)
        expect(wordSequenceMatch.dictionaryName).toBe('cardinalNumbers')
      }
    })

    it('should detect l33t camelCase cardinal number sequences', () => {
      const result = zxcvbn.check('Thr33Tw0One')
      // console.log(result)
      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['three', 'two', 'one'])
        expect(wordSequenceMatch.wordCount).toBe(3)
        expect(wordSequenceMatch.dictionaryName).toBe('cardinalNumbers')
      }
    })

    it('should detect dot-separated cardinal number sequences', () => {
      const result = zxcvbn.check('seven.eight.nine')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['seven', 'eight', 'nine'])
        expect(wordSequenceMatch.wordCount).toBe(3)
      }
    })

    it('should detect space-separated cardinal number sequences', () => {
      const result = zxcvbn.check('ten eleven twelve')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['ten', 'eleven', 'twelve'])
        expect(wordSequenceMatch.wordCount).toBe(3)
      }
    })
  })

  describe('Days of Week', () => {
    it('should detect days of week sequences', () => {
      const result = zxcvbn.check('mondayTuesdayWednesday')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual([
          'monday',
          'tuesday',
          'wednesday',
        ])
        expect(wordSequenceMatch.wordCount).toBe(3)
      }
    })
  })

  describe('Months', () => {
    it('should detect month sequences', () => {
      const result = zxcvbn.check('january-february-march')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual([
          'january',
          'february',
          'march',
        ])
        expect(wordSequenceMatch.wordCount).toBe(3)
      }
    })
  })

  describe('Rainbow Colors', () => {
    it('should detect rainbow color sequences', () => {
      const result = zxcvbn.check('redOrangeYellow')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['red', 'orange', 'yellow'])
        expect(wordSequenceMatch.wordCount).toBe(3)
      }
    })
  })

  describe('Military Alphabet', () => {
    it('should detect military alphabet sequences', () => {
      const result = zxcvbn.check('alpha_bravo_charlie')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['alpha', 'bravo', 'charlie'])
        expect(wordSequenceMatch.wordCount).toBe(3)
      }
    })
  })

  describe('Planets', () => {
    it('should detect planet sequences', () => {
      const result = zxcvbn.check('mercuryVenusEarth')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['mercury', 'venus', 'earth'])
        expect(wordSequenceMatch.wordCount).toBe(3)
      }
    })
  })

  describe('Zodiac Signs', () => {
    it('should detect zodiac sign sequences', () => {
      const result = zxcvbn.check('aries-taurus-gemini')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['aries', 'taurus', 'gemini'])
        expect(wordSequenceMatch.wordCount).toBe(3)
      }
    })
  })

  describe('Chinese Zodiac', () => {
    it('should detect Chinese zodiac sequences', () => {
      const result = zxcvbn.check('ratOxTiger')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['rat', 'ox', 'tiger'])
        expect(wordSequenceMatch.wordCount).toBe(3)
      }
    })
  })

  describe('Mixed Sequences', () => {
    it('should detect mixed category sequences', () => {
      const result = zxcvbn.check('oneMondayRed')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['one', 'monday', 'red'])
        expect(wordSequenceMatch.wordCount).toBe(3)
      }
    })
  })

  describe('Edge Cases', () => {
    it('should detect sequences with one-character uppercase separators (isCamelCase logic)', () => {
      // "oneTwo" -> textBetween.length === 1 and it is 'T' (uppercase)
      const result = zxcvbn.check('oneTwo')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['one', 'two'])
      }
    })

    it('should detect ascending sequences based on dictionary rank', () => {
      // Assuming words in wordSequences.json are in order of frequency/rank
      const result = zxcvbn.check('oneTwoThree')
      const match = result.sequence.find(
        (m) => m.pattern === 'wordSequence',
      ) as any
      expect(match.ascending).toBe(true)
    })

    it('should detect non-ascending sequences based on dictionary rank', () => {
      const result = zxcvbn.check('threeTwoOne')
      const match = result.sequence.find(
        (m) => m.pattern === 'wordSequence',
      ) as any
      expect(match.ascending).toBe(false)
    })

    it('should use the most common dictionary name for mixed sequences', () => {
      // 'one', 'two' are cardinalNumbers. 'monday' is daysOfWeek.
      const result = zxcvbn.check('oneTwoMonday')
      const match = result.sequence.find(
        (m) => m.pattern === 'wordSequence',
      ) as any
      expect(match.dictionaryName).toBe('cardinalNumbers')
    })

    it('should handle tie in dictionary names by using the first one', () => {
      // 'one' (cardinalNumbers), 'monday' (daysOfWeek)
      const result = zxcvbn.check('oneMonday')
      const match = result.sequence.find(
        (m) => m.pattern === 'wordSequence',
      ) as any
      expect(match.dictionaryName).toBe('cardinalNumbers')
    })

    it('should detect sequences with custom separators', () => {
      // Dots and spaces are allowed as per separators array in matching.ts
      const result = zxcvbn.check('one.two three')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['one', 'two', 'three'])
      }
    })

    it('should not detect sequences with invalid separators', () => {
      // '+' is not in the separators list
      const result = zxcvbn.check('one+two+three')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeUndefined()
    })

    it('should handle gaps by creating multiple sequences', () => {
      const result = zxcvbn.check('oneTwo XXX threeFour')
      const matches = result.sequence.filter(
        (m) => m.pattern === 'wordSequence',
      )

      expect(matches.length).toBe(2)
      expect((matches[0] as any).words).toEqual(['one', 'two'])
      expect((matches[1] as any).words).toEqual(['three', 'four'])
    })

    it('should detect very long sequences', () => {
      const result = zxcvbn.check(
        'one_two_three_four_five_six_seven_eight_nine_ten',
      )
      const match = result.sequence.find(
        (m) => m.pattern === 'wordSequence',
      ) as any

      expect(match).toBeDefined()
      expect(match.wordCount).toBe(10)
    })

    it('should not detect single words as sequences', () => {
      const result = zxcvbn.check('one')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeUndefined()
    })

    it('should not detect non-consecutive words as sequences', () => {
      const result = zxcvbn.check('oneXctwoYcthree')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeUndefined()
    })

    it('should handle mixed case sequences', () => {
      const result = zxcvbn.check('OneTwoThree')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch?.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['one', 'two', 'three'])
        expect(wordSequenceMatch.wordCount).toBe(3)
      }
    })
  })

  describe('Scoring and Feedback', () => {
    it('should provide appropriate scoring for word sequences', () => {
      const result = zxcvbn.check('oneTwoThree')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch) {
        // Word sequences should have higher guesses than individual words
        expect(wordSequenceMatch.guesses).toBeGreaterThan(1)
      }
    })

    it('should provide feedback for word sequences', () => {
      const result = zxcvbn.check('oneTwoThree')

      // Should have suggestions about word sequences
      expect(result.feedback.suggestions.length).toBeGreaterThan(0)
    })
  })

  describe('Multiple Sequences', () => {
    it('should handle multiple sequences in the same password', () => {
      const result = zxcvbn.check('oneTwoThree_fourFiveSix')

      const wordSequenceMatches = result.sequence.filter(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatches.length).toBeGreaterThan(0)

      // Should find both sequences
      const hasFirstSequence = wordSequenceMatches.some(
        (match) =>
          match.words?.includes('one') &&
          match.words.includes('two') &&
          match.words.includes('three'),
      )
      const hasSecondSequence = wordSequenceMatches.some(
        (match) =>
          match.words?.includes('four') &&
          match.words.includes('five') &&
          match.words.includes('six'),
      )

      expect(hasFirstSequence).toBe(true)
      expect(hasSecondSequence).toBe(true)
    })
  })

  describe('Scoring and Feedback unit tests', () => {
    it('scoring should return 0 if pattern is not wordSequence', () => {
      expect(scoring({ pattern: 'dictionary' } as any)).toBe(0)
    })

    it('feedback should return null if pattern is not wordSequence', () => {
      const options = new Options()
      expect(feedback(options, { pattern: 'dictionary' } as any)).toBeNull()
    })

    it('feedback should provide different suggestions for non-ascending sequences', () => {
      const options = new Options()
      const match = {
        pattern: 'wordSequence',
        wordCount: 2,
        ascending: false,
      } as any
      const result = feedback(options, match)
      expect(result?.suggestions).toContain(
        options.translations.suggestions.anotherWord,
      )
    })
  })
})
