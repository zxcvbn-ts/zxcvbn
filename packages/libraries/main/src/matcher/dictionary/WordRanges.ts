import WordIndex from './WordIndex'

// The words that start with a prefix, in the word index and in the user
// inputs. Plain and l33t dictionary matching extend a prefix with it one
// character at a time.
export default class WordRanges {
  private readonly range = new Int32Array(2)

  private readonly userInputsRange = new Int32Array(2)

  constructor(
    private readonly wordIndex: WordIndex,
    private readonly userInputsWordIndex: WordIndex | undefined,
  ) {}

  // all words, the empty prefix
  reset() {
    this.range[0] = 0
    this.range[1] = this.wordIndex.words.length
    this.userInputsRange[0] = 0
    this.userInputsRange[1] = this.userInputsWordIndex
      ? this.userInputsWordIndex.words.length
      : 0
  }

  copy({ range, userInputsRange }: WordRanges) {
    this.range[0] = range[0]
    this.range[1] = range[1]
    this.userInputsRange[0] = userInputsRange[0]
    this.userInputsRange[1] = userInputsRange[1]
  }

  // extends the prefix of depth characters by code, returns the searches it took
  narrow(depth: number, code: number) {
    let searches = 0
    if (this.range[0] < this.range[1]) {
      this.wordIndex.narrow(this.range, depth, code)
      searches += 1
    }
    if (
      this.userInputsWordIndex &&
      this.userInputsRange[0] < this.userInputsRange[1]
    ) {
      this.userInputsWordIndex.narrow(this.userInputsRange, depth, code)
      searches += 1
    }
    return searches
  }

  // no word starts with the prefix
  isEmpty() {
    return (
      this.range[0] >= this.range[1] &&
      this.userInputsRange[0] >= this.userInputsRange[1]
    )
  }

  // The index in the word index of the word that is the prefix of length
  // characters, or -1. The shortest word of a range comes first.
  getWord(length: number) {
    return this.range[0] < this.range[1] &&
      this.wordIndex.words[this.range[0]].length === length
      ? this.range[0]
      : -1
  }

  // the rank among the user inputs of the word that is the prefix of length
  // characters, if one
  getUserInputsRank(length: number) {
    return this.userInputsWordIndex &&
      this.userInputsRange[0] < this.userInputsRange[1] &&
      this.userInputsWordIndex.words[this.userInputsRange[0]].length === length
      ? this.userInputsWordIndex.getRank(this.userInputsRange[0], 0)
      : undefined
  }

  // the word getUserInputsRank found a rank for
  getUserInput() {
    return this.userInputsWordIndex!.words[this.userInputsRange[0]]
  }
}
