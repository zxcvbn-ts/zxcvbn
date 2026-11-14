import { readdirSync } from 'fs'
import path from 'path'
import translationKeys from '../src/data/translationKeys.ts'

const languagePath = path.join(import.meta.dirname, '../../../languages')

const getLanguages = () => {
  return readdirSync(languagePath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
}

describe('translations', async () => {
  const withoutTranslations = ['common']
  const languages = getLanguages().filter(
    (language) => !withoutTranslations.includes(language),
  )
  const translationsByLanguage = await Promise.all(
    languages.map(async (language) => {
      const translationPath = `${languagePath}/${language}/src/translations.ts`
      const { default: translations } = await import(translationPath)
      return [language, translations] as const
    }),
  )
  translationsByLanguage.forEach(([language, translations]) => {
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
