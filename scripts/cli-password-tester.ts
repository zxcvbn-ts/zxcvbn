// eslint-disable-next-line import/no-relative-packages
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common/src/index'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en/src/index'
import { ZxcvbnFactory } from '@zxcvbn-ts/core/src/index'

// eslint-disable-next-line
(async () => {
  const options = {
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
    translations: zxcvbnEnPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    useLevenshteinDistance: true,
  }
  const zxcvbn = new ZxcvbnFactory(options)
  return zxcvbn.checkAsync(process.argv[2], process.argv[3]?.split(';'))
})()
  .then((match) => {
    // eslint-disable-next-line no-console
    console.log(match)
    process.exit(0)
  })
  .catch((e: Error) => {
    console.error(e)
    process.exit(1)
  })
