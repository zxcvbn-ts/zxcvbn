import Options from '../src/Options.ts'
import translationKeys from '../src/data/translationKeys.ts'
import { timeEstimationValuesDefaults } from '../src/TimeEstimates.ts'

describe('Options', () => {
  describe('translations', () => {
    it('should return default feedback for no sequence on custom translations', () => {
      const zxcvbnOptions = new Options({ translations: translationKeys })
      expect(zxcvbnOptions.translations).toEqual(translationKeys)
    })
    const customTranslations = {
      warnings: {
        straightRow: 'straightRow',
        keyPattern: 'keyPattern',
      },
    }

    it('should return error for wrong custom translations', () => {
      expect(() => {
        // @ts-expect-error for testing purposes

        new Options({ translations: customTranslations })
      }).toThrow('Invalid translations object fallback to keys')
    })
  })

  describe('setOptions coverage', () => {
    it('should cover remaining setOptions branches', () => {
      const options = new Options({
        maxLength: 128,
        useLevenshteinDistance: true,
        levenshteinThreshold: 3,
        l33tMaxSubstitutions: 50,
      })
      expect(options.maxLength).toBe(128)
      expect(options.useLevenshteinDistance).toBe(true)
      expect(options.levenshteinThreshold).toBe(3)
      expect(options.l33tMaxSubstitutions).toBe(50)
    })

    it('should handle empty dictionary max word size', () => {
      const options = new Options({
        dictionary: {
          empty: [],
        },
      })
      expect(options.rankedDictionariesMaxWordSize.empty).toBe(0)
    })

    it('should warn when adding an existing matcher', () => {
      const spy = jest.spyOn(console, 'info').mockImplementation()
      const matcher = {
        // eslint-disable-next-line @typescript-eslint/no-extraneous-class
        Matching: class {},
        feedback: () => ({ warning: null, suggestions: [] }),
        scoring: () => 0,
      } as any
      // Adding it twice will trigger the warning
      new Options({}, { date: matcher, another: matcher })
      // Actually, to trigger it, we need to call addMatcher on an instance that already has it.
      const options = new Options()
      // @ts-expect-error - accessing private method for coverage
      options.addMatcher('test', matcher)
      // @ts-expect-error for testing
      options.addMatcher('test', matcher)
      expect(spy).toHaveBeenCalledWith('Matcher test already exists')
      spy.mockRestore()
    })

    it('should handle custom time estimation values', () => {
      const timeEstimationValues = {
        scoring: {
          0: 2000,
          1: 2000000,
          2: 200000000,
          3: 20000000000,
        },
        attackTime: {
          onlineThrottlingXPerHour: 200,
          onlineNoThrottlingXPerSecond: 20,
          offlineSlowHashingXPerSecond: 20000,
          offlineFastHashingXPerSecond: 20000000000,
        },
      }
      const options = new Options({ timeEstimationValues })
      expect(options.timeEstimationValues.scoring[0]).toBe(2000)
    })
  })

  describe('Runtime Checks', () => {
    it('should throw error for invalid l33tTable', () => {
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ l33tTable: 'invalid' })
      }).toThrow('l33tTable must be an object')
    })

    it('should throw error for invalid dictionary', () => {
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ dictionary: 'invalid' })
      }).toThrow('dictionary must be an object')
    })

    it('should throw error for invalid graphs', () => {
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ graphs: 'invalid' })
      }).toThrow('graphs must be an object')
    })

    it('should throw error for invalid useLevenshteinDistance', () => {
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ useLevenshteinDistance: 'invalid' })
      }).toThrow('useLevenshteinDistance must be a boolean')
    })

    it('should throw error for invalid levenshteinThreshold', () => {
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ levenshteinThreshold: 'invalid' })
      }).toThrow('levenshteinThreshold must be a non-negative number')
      expect(() => {
        new Options({ levenshteinThreshold: -1 })
      }).toThrow('levenshteinThreshold must be a non-negative number')
    })

    it('should throw error for invalid l33tMaxSubstitutions', () => {
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ l33tMaxSubstitutions: 'invalid' })
      }).toThrow('l33tMaxSubstitutions must be a non-negative number')
      expect(() => {
        new Options({ l33tMaxSubstitutions: -1 })
      }).toThrow('l33tMaxSubstitutions must be a non-negative number')
    })

    it('should throw error for invalid maxLength', () => {
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ maxLength: 'invalid' })
      }).toThrow('maxLength must be a non-negative number')
      expect(() => {
        new Options({ maxLength: -1 })
      }).toThrow('maxLength must be a non-negative number')
    })

    it('should throw error for invalid l33tTable substitutions', () => {
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ l33tTable: { a: 'invalid' } })
      }).toThrow('l33tTable substitutions must be an array')
    })

    it('should throw error for invalid l33tTable substitutions content', () => {
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ l33tTable: { a: [1] } })
      }).toThrow('l33tTable substitutions must be strings')
    })

    it('should throw error for invalid dictionary list', () => {
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ dictionary: { userInputs: 'invalid' } })
      }).toThrow('dictionary list must be an array')
    })

    it('should throw error for invalid dictionary list content', () => {
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ dictionary: { userInputs: [true] } })
      }).toThrow('dictionary entries must be strings or numbers')
    })

    it('should throw error for invalid graph content', () => {
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ graphs: { qwerty: 'invalid' } })
      }).toThrow('graph must be an object')
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ graphs: { qwerty: { a: 'invalid' } } })
      }).toThrow('graph adjacencies must be an array')
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ graphs: { qwerty: { a: [1] } } })
      }).toThrow('graph adjacency must be a string or null')
    })

    it('should throw error for invalid timeEstimationValues', () => {
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ timeEstimationValues: 'invalid' })
      }).toThrow('timeEstimationValues must be an object')
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ timeEstimationValues: { scoring: 'invalid' } })
      }).toThrow('timeEstimationValues.scoring must be an object')
      expect(() => {
        new Options({
          // @ts-expect-error test runtime checks
          timeEstimationValues: {
            scoring: timeEstimationValuesDefaults.scoring,
          },
        })
      }).toThrow('timeEstimationValues.attackTime is required')
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({ timeEstimationValues: { scoring: {}, attackTime: {} } })
      }).toThrow('timeEstimationValues.scoring.0 is required')
      expect(() => {
        new Options({
          timeEstimationValues: {
            // @ts-expect-error test runtime checks
            scoring: { 0: 'invalid', 1: 1e6, 2: 1e8, 3: 1e10 },
            attackTime: {
              onlineThrottlingXPerHour: 100,
              onlineNoThrottlingXPerSecond: 10,
              offlineSlowHashingXPerSecond: 1e4,
              offlineFastHashingXPerSecond: 1e10,
            },
          },
        })
      }).toThrow('timeEstimationValues.scoring.0 must be a number')
      expect(() => {
        new Options({
          timeEstimationValues: {
            scoring: { 0: 0, 1: 1e6, 2: 1e8, 3: 1e10 },
            attackTime: {
              onlineThrottlingXPerHour: 100,
              onlineNoThrottlingXPerSecond: 10,
              offlineSlowHashingXPerSecond: 1e4,
              offlineFastHashingXPerSecond: 1e10,
            },
          },
        })
      }).toThrow(
        'Time estimation values are not to be allowed to be less than default',
      )
    })

    it('should throw error for invalid custom matchers', () => {
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({}, 'invalid')
      }).toThrow('customMatchers must be an object')
      expect(() => {
        // @ts-expect-error test runtime checks
        new Options({}, { test: 'invalid' })
      }).toThrow('matcher test must be an object')
      expect(() => {
        // @ts-expect-error test runtime checks
        // eslint-disable-next-line @typescript-eslint/no-extraneous-class
        new Options({}, { test: { scoring: () => 0, Matching: class {} } })
      }).toThrow('matcher test.feedback must be a function')
      expect(() => {
        // @ts-expect-error test runtime checks
        // eslint-disable-next-line @typescript-eslint/no-extraneous-class, @typescript-eslint/no-empty-function
        new Options({}, { test: { feedback: () => {}, Matching: class {} } })
      }).toThrow('matcher test.scoring must be a function')
      expect(() => {
        // @ts-expect-error test runtime checks
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        new Options({}, { test: { feedback: () => {}, scoring: () => 0 } })
      }).toThrow('matcher test.Matching must be a constructor')
    })
  })
})
