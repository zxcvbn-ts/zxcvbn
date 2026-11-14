import * as zxcvbnCommonPackage from '../packages/languages/common/src/index.ts'
import * as zxcvbnEnPackage from '../packages/languages/en/src/index.ts'
import { ZxcvbnFactory } from '../packages/libraries/main/src/index.ts'
;(async () => {
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
  return await zxcvbn.checkAsync(process.argv[2], process.argv[3]?.split(';'))
})()
  .then((match) => {
    // eslint-disable-next-line no-console
    console.log(match)
    process.exit(0)
  })
  .catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
