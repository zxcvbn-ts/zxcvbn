import { readdirSync } from 'fs'
import path from 'path'
import translationKeys from '../src/data/translationKeys'

const languagePath = path.join(__dirname, '../../')

const getLanguages = () => {
  return readdirSync(languagePath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
}

describe('translations', () => {
  const notALanguage = ['main', 'common']
  const languages = getLanguages().filter(
    (language) => !notALanguage.includes(language),
  )
  languages.forEach((language) => {
    const translationPath = `../../${language}/src/translations.ts`
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const translations = require(translationPath).default
    it(`should have all translation keys for ${language}`, () => {
      Object.entries(translationKeys).forEach(([key, value]) => {
        expect(translations[key]).toBeDefined()
        expect(translations[key]).not.toBe('')
        Object.entries(value).forEach(([subKey]) => {
          expect(translations[key][subKey]).toBeDefined()
          expect(translations[key][subKey]).not.toBe('')
        })
      })
    })
  })
})
