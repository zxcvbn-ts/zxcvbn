import { ZxcvbnFactory } from '../../../src'
import wordSequences from '../../../../../languages/en/src/wordSequences.json'

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

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch && wordSequenceMatch.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['one', 'two', 'three'])
        expect(wordSequenceMatch.wordCount).toBe(3)
        expect(wordSequenceMatch.dictionaryName).toBe('wordSequences')
      }
    })

    it('should detect snake_case cardinal number sequences', () => {
      const result = zxcvbn.check('four_five_six')

      const wordSequenceMatch = result.sequence.find(
        (match) => match.pattern === 'wordSequence',
      )

      expect(wordSequenceMatch).toBeDefined()
      if (wordSequenceMatch && wordSequenceMatch.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['four', 'five', 'six'])
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
      if (wordSequenceMatch && wordSequenceMatch.pattern === 'wordSequence') {
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
      if (wordSequenceMatch && wordSequenceMatch.pattern === 'wordSequence') {
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
      if (wordSequenceMatch && wordSequenceMatch.pattern === 'wordSequence') {
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
      if (wordSequenceMatch && wordSequenceMatch.pattern === 'wordSequence') {
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
      if (wordSequenceMatch && wordSequenceMatch.pattern === 'wordSequence') {
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
      if (wordSequenceMatch && wordSequenceMatch.pattern === 'wordSequence') {
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
      if (wordSequenceMatch && wordSequenceMatch.pattern === 'wordSequence') {
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
      if (wordSequenceMatch && wordSequenceMatch.pattern === 'wordSequence') {
        expect(wordSequenceMatch.words).toEqual(['one', 'monday', 'red'])
        expect(wordSequenceMatch.wordCount).toBe(3)
      }
    })
  })

  describe('Edge Cases', () => {
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
      if (wordSequenceMatch && wordSequenceMatch.pattern === 'wordSequence') {
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
})
