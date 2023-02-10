import fs from 'fs'
import byline from 'byline'
import sprintfClass from 'sprintf-js'
import { MatchExtended } from '@zxcvbn-ts/core/src/types'
import Matching from '../../packages/libraries/main/src/Matching'
import estimateGuesses from '../../packages/libraries/main/src/scoring/estimate'
import { zxcvbnOptions } from '../../packages/libraries/main/src/Options'

const CUTOFF = 10
const BATCH_SIZE = 1000000

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { sprintf } = sprintfClass

zxcvbnOptions.setOptions()
const matching = new Matching()

interface Counts {
  [key: string]: number
}

const normalize = (token: string) => {
  return token.toLowerCase()
}

// GET file from https://xato.net/today-i-am-releasing-ten-million-passwords-b6278bbe7495
export default class PasswordGenerator {
  public data: any = []

  private shouldInclude(password: string, xatoRank: number) {
    for (let i = 0; i < password.length; i += 1) {
      if (password.charCodeAt(i) > 127) {
        console.info(
          `SKIPPING non-ascii password=${password}, rank=${xatoRank}`,
        )
        return false
      }
    }

    const foundMatches = matching.match(password) as MatchExtended[]

    const matches = foundMatches.filter((match) => {
      // only keep matches that span full password
      const isFullPassword = match.i === 0 && match.j === password.length - 1
      // ignore dictionaries
      const isDictionary = match.pattern === 'dictionary'
      return isFullPassword && !isDictionary
    })

    // eslint-disable-next-line no-restricted-syntax
    for (const match of matches) {
      if (estimateGuesses(match, password).guesses < xatoRank) {
        return false
      }
    }
    return true
  }

  private static prune(counts: Counts) {
    const results: (boolean | undefined)[] = []
    Object.keys(counts).forEach((pw) => {
      const count = counts[pw]
      if (count === 1) {
        // eslint-disable-next-line no-param-reassign
        results.push(delete counts[pw])
      } else {
        results.push(undefined)
      }
    })
    return results
  }

  public async run(output: string) {
    // eslint-disable-next-line compat/compat
    return new Promise<void>((resolve) => {
      const counts: Counts = {}
      let skippedLines = 0
      let lineCount = 0
      const xatoFileName = 'xato_file.txt'

      const input = `${__dirname}/${xatoFileName}`
      const stream = byline.createStream(
        fs.createReadStream(input, {
          encoding: 'utf8',
        }),
      )
      // eslint-disable-next-line max-statements
      stream.on('readable', () => {
        let line
        const results: number[] = []
        // eslint-disable-next-line no-cond-assign
        while ((line = stream.read()) !== null) {
          lineCount += 1
          if (lineCount % BATCH_SIZE === 0) {
            console.info('counting tokens:', lineCount)
            PasswordGenerator.prune(counts)
          }
          const tokens = line.trim().split(/\s+/)
          if (tokens.length !== 2) {
            skippedLines += 1
            // eslint-disable-next-line no-continue
            continue
          }
          const combo = tokens.slice(0, 2)
          const password = normalize(combo[1])

          if (password in counts) {
            counts[password] += 1
            results.push()
          } else {
            counts[password] = 1
          }
          results.push(counts[password])
        }
        return results
      })
      // eslint-disable-next-line max-statements
      stream.on('end', () => {
        console.info('skipped lines:', skippedLines)
        let pairs: [string, number][] = []
        console.info('copying to tuples')
        Object.keys(counts).forEach((pw) => {
          const count = counts[pw]
          if (count > CUTOFF) {
            pairs.push([pw, count])
          }
          delete counts[pw]
        })
        console.info('sorting')
        pairs.sort((p1, p2) => {
          return p2[1] - p1[1]
        })
        console.info('filtering')
        pairs = pairs.filter((pair, i) => {
          const [password] = pair
          const rank = i + 1
          return this.shouldInclude(password, rank)
        })
        // const outputStreamTxt = fs.createWriteStream(`${output}.txt`, {
        //   encoding: 'utf8',
        // })
        // pairs.forEach((pair) => {
        //   const [pw, count] = pair
        //   outputStreamTxt.write(sprintf('%-15s %d\n', pw, count))
        // })
        // outputStreamTxt.end()

        if (pairs.length > 0) {
          const outputStreamJson = fs.createWriteStream(`${output}.json`, {
            encoding: 'utf8',
          })
          outputStreamJson.write('[')
          const pairLength = pairs.length
          pairs.forEach((pair, index) => {
            const [pw] = pair
            const isLast = pairLength === index + 1
            const comma = isLast ? '' : ','
            outputStreamJson.write(`"${pw.replace('\\', '')}"${comma}`)
          })

          outputStreamJson.write(']')
          outputStreamJson.end()
        }

        // @ts-ignore
        resolve()
      })
    })
  }
}
