import { SEPERATOR_CHARS } from '../../data/const'
import {
  MatchOptions,
  MatcherBaseClass,
  UserInputSequenceMatch,
  UserInputsOptions,
} from '../../types'
import mergeUserInputDictionary from '../../utils/mergeUserInputDictionary'

// a single user input is already covered by the dictionary matcher
const MIN_WORD_COUNT = 2
const MIN_WORD_LENGTH = 2

interface UserInputToken {
  word: string
  i: number
  j: number
}

/*
 *-------------------------------------------------------------------------------
 * user input sequences (HansFlorianZimmer, hans.zimmer) ------------------------
 *-------------------------------------------------------------------------------
 */
class MatchUserInputSequence extends MatcherBaseClass {
  match({
    password,
    userInputsOptions,
  }: MatchOptions): UserInputSequenceMatch[] {
    const userInputs = this.getUserInputs(userInputsOptions)

    if (userInputs.length === 0) {
      return []
    }

    const passwordLower = password.toLowerCase()
    const longestWordAt = MatchUserInputSequence.indexLongestWords(
      passwordLower,
      userInputs,
    )

    const matches: UserInputSequenceMatch[] = []
    for (let i = 0; i < password.length; i += 1) {
      const tokens = MatchUserInputSequence.buildSequence(
        passwordLower,
        longestWordAt,
        i,
      )

      if (tokens.length >= MIN_WORD_COUNT) {
        matches.push(
          MatchUserInputSequence.createMatch(
            password,
            tokens,
            userInputs.length,
          ),
        )
      }
    }

    return matches
  }

  private getUserInputs(userInputsOptions?: UserInputsOptions): string[] {
    const { rankedDictionaries } = mergeUserInputDictionary(
      this.options.rankedDictionaries,
      this.options.rankedDictionariesMaxWordSize,
      userInputsOptions,
    )

    return Object.keys(rankedDictionaries.userInputs ?? {})
      .map((word) => word.toLowerCase())
      .filter((word) => word.length >= MIN_WORD_LENGTH)
  }

  // the longest user input starting at every index, to keep the walk below linear
  private static indexLongestWords(
    passwordLower: string,
    userInputs: string[],
  ): (string | null)[] {
    return Array.from(passwordLower, (_char, index) =>
      userInputs.reduce<string | null>((longest, word) => {
        if (
          word.length > (longest?.length ?? 0) &&
          passwordLower.startsWith(word, index)
        ) {
          return word
        }
        return longest
      }, null),
    )
  }

  // walks from startIndex as long as user inputs follow each other
  private static buildSequence(
    passwordLower: string,
    longestWordAt: (string | null)[],
    startIndex: number,
  ): UserInputToken[] {
    const tokens: UserInputToken[] = []
    let index = startIndex

    while (longestWordAt[index]) {
      const word = longestWordAt[index] as string
      tokens.push({ word, i: index, j: index + word.length - 1 })
      index += word.length
      index += MatchUserInputSequence.getSeparatorLength(
        passwordLower,
        longestWordAt,
        index,
      )
    }

    return tokens
  }

  // length of the shortest separator run at index that is followed by a user input
  private static getSeparatorLength(
    passwordLower: string,
    longestWordAt: (string | null)[],
    index: number,
  ): number {
    let length = 0

    while (SEPERATOR_CHARS.includes(passwordLower[index + length])) {
      length += 1

      if (longestWordAt[index + length]) {
        return length
      }
    }

    return 0
  }

  private static createMatch(
    password: string,
    tokens: UserInputToken[],
    userInputCount: number,
  ): UserInputSequenceMatch {
    const first = tokens[0]
    const last = tokens[tokens.length - 1]
    const separators = tokens
      .slice(1)
      .map((token, tokenIndex) =>
        password.slice(tokens[tokenIndex].j + 1, token.i),
      )
      .filter((separator) => separator !== '')

    return {
      pattern: 'userInputSequence',
      i: first.i,
      j: last.j,
      token: password.slice(first.i, last.j + 1),
      words: tokens.map((token) => password.slice(token.i, token.j + 1)),
      wordCount: tokens.length,
      separators,
      userInputCount,
    }
  }
}

export default MatchUserInputSequence
