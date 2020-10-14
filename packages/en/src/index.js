import commonWords from './commonWords.json'
import firstnames from './firstnames.json'
import lastnames from './lastnames.json'
import translations from './translations.json'
import common from '../../../data/common/index'

export default {
  dictionary: {
    commonWords,
    firstnames,
    lastnames,
    ...common,
    userInputs: [],
  },
  translations,
}
