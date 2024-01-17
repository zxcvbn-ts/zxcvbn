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
        // @ts-ignore
        // eslint-disable-next-line no-new
        new Options({ translations: customTranslations })
      }).toThrow('Invalid translations object fallback to keys')
    })
  })
})
