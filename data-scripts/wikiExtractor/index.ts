import fs from 'fs'
import readline from 'readline'
import path from 'path'
// @ts-ignore
import globAll from 'glob-all'
import natural from 'natural'
import { LooseObject } from '../../packages/libraries/main/src/types'

const SENTENCES_PER_BATCH = 500000 // after each batch, delete all counts with count == 1 (hapax legomena)
const PRE_SORT_CUTOFF = 500 // before sorting, discard all words with less than this count

const ALL_NON_ALPHA = /^[\W\d]*$/
const SOME_NON_ALPHA = /[\W\d]/
const EXCLUDED = /^(__)(.*)(__)$/

class TopTokenCounter {
  count: LooseObject = {}

  legomena = new Set()

  discarded = new Set()

  addTokens(tokens: string[], splitHyphens: boolean = true) {
    tokens.forEach((token) => {
      const hyphenArray = token.split('-')
      if (splitHyphens && [1, 2].includes(hyphenArray.length)) {
        hyphenArray.forEach((subToken) => {
          this.addToken(subToken)
        })
      } else {
        this.addToken(token)
      }
    })
  }

  addToken(token: string) {
    if (!this.shouldInclude(token)) {
      this.discarded.add(token)
      return
    }
    const cleanedToken = this.normalize(token)

    if (cleanedToken in this.count) {
      this.legomena.delete(cleanedToken)
      this.count[cleanedToken] += 1
    } else {
      this.legomena.add(cleanedToken)
      this.count[cleanedToken] = 1
    }
  }

  shouldInclude(token: string) {
    const isTooShort = token.length < 2
    const isTooShortAndABitSpecial =
      token.length <= 2 && SOME_NON_ALPHA.test(token)
    const isSpecialChar = ALL_NON_ALPHA.test(token)
    const isExcluded = EXCLUDED.test(token)
    const startWithSlash = token.startsWith('/')
    const endsWithEqual = token.endsWith('=')

    return !(
      isTooShort ||
      isTooShortAndABitSpecial ||
      isSpecialChar ||
      isExcluded ||
      startWithSlash ||
      endsWithEqual
    )
  }

  normalize(token: string) {
    return token.toLowerCase()
  }

  batchPrune() {
    this.legomena.forEach((token) => {
      if (this.count[token as string]) {
        delete this.count[token as string]
      }
    })
    this.legomena = new Set()
  }

  preSortPrune() {
    const underCutoff = new Set()
    Object.entries(this.count).forEach(([token, count]) => {
      if (count < PRE_SORT_CUTOFF) {
        underCutoff.add(token)
      }
    })
    underCutoff.forEach((token) => {
      delete this.count[token as string]
    })
    this.legomena = new Set()
  }

  getSortedPairs() {
    return Object.entries(this.count)
      .sort((a, b) => {
        const first = a[1]
        const second = b[1]

        if (first < second) {
          return 1
        }

        if (first > second) {
          return -1
        }

        return 0
      })
      .reduce((obj: LooseObject, entry) => {
        const key = entry[0]
        // eslint-disable-next-line no-param-reassign
        obj[key] = this.count[key]
        return obj
      }, {})
  }

  getTimestamp() {
    return new Date().toISOString().split('.')[0]
  }

  getStats() {
    const timestamp = this.getTimestamp()
    const { length } = Object.keys(this.count)
    return `${timestamp} keys(count): ${length}`
  }
}

const readLinePromise = (readInterface: any, callback: Function) => {
  // eslint-disable-next-line compat/compat
  return new Promise((resolve) => {
    readInterface.on('line', callback)
    readInterface.on('close', () => {
      resolve(true)
    })
  })
}

const getTokens = async (inputDir: string, counter: TopTokenCounter) => {
  const files: string[] = globAll.sync([`${inputDir}/**/wiki_*`])
  // const tokenizer = new natural.TokenizerJa()
  const tokenizer = new natural.RegexpTokenizer({
    pattern: /[^A-Za-z\xbf-\xdf\xdf-\xff]/,
  })
  let lines = 0
  const promises = files.map(async (filePath) => {
    const readInterface = readline.createInterface({
      input: fs.createReadStream(filePath),
      terminal: false,
    })
    await readLinePromise(readInterface, async (line: string) => {
      const tokens = tokenizer.tokenize(line)
      counter.addTokens(tokens)
      lines += 1
      if (lines % SENTENCES_PER_BATCH === 0) {
        counter.batchPrune()
        console.info(counter.getStats())
        console.info(`processing: ${filePath}`)
      }
    })
  })

  // eslint-disable-next-line compat/compat
  await Promise.all(promises)
}

const write = (output: string, pairs: LooseObject) => {
  const outputStreamJson = fs.createWriteStream(`${output}`, {
    encoding: 'utf8',
  })
  const outputStreamTxt = fs.createWriteStream(`${output}.txt`, {
    encoding: 'utf8',
  })
  outputStreamJson.write('[')
  const pairLength = Object.keys(pairs).length
  Object.keys(pairs).forEach((word, index) => {
    const isLast = pairLength === index + 1
    const comma = isLast ? '' : ','
    outputStreamJson.write(`"${word.replace('\\', '')}"${comma}`)
    outputStreamTxt.write(`${word}: ${pairs[word]} \n`)
  })

  outputStreamJson.write(']')
  outputStreamJson.end()
}

// eslint-disable-next-line max-statements
const main = async (inputDir: string, _outputFile: string) => {
  const counter = new TopTokenCounter()
  await getTokens(inputDir, counter)

  console.info(counter.getStats())
  console.info('deleting tokens under cutoff of', PRE_SORT_CUTOFF)
  counter.preSortPrune()
  console.info('done')
  console.info(counter.getStats())
  console.info(counter.getTimestamp(), 'sorting...')
  const sortedPairs = counter.getSortedPairs()
  console.info(counter.getTimestamp(), 'done')
  console.info('writing...')
  write(_outputFile, sortedPairs)
}

const inputDir = path.join(__dirname, 'extracts')
const outputFile = path.join(__dirname, 'wikipedia.json')
main(inputDir, outputFile)
