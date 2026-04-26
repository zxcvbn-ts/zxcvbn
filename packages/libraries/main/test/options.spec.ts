import Options from '../src/Options'
import translationKeys from '../src/data/translationKeys'

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
})
