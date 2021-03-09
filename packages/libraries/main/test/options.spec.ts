import Options from '../src/Options'
import translationKeys from '../src/data/translationKeys'

describe('Options', () => {
  describe('translations', () => {
    it('should return default feedback for no sequence on custom translations', () => {
      Options.setOptions({ translations: translationKeys })
      expect(Options.translations).toEqual(translationKeys)
    })
    const customTranslations = {
      warnings: {
        straightRow: 'straightRow',
        keyPattern: 'keyPattern',
      },
    }

    it('should return error for wrong custom translations', () => {
      expect(() => {
        // @ts-ignore
        Options.setOptions({ translations: customTranslations })
      }).toThrow('Invalid translations object fallback to keys')
    })
  })
})
