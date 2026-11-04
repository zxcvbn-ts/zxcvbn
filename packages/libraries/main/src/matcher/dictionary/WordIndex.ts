import { LevenshteinDictionary } from '../../utils/levenshtein'

export interface WordList {
  name: string
  words: readonly unknown[]
  // rank of each word, defaults to its position in words, starting at 1
  ranks?: ArrayLike<number>
}

// buckets smaller than this are sorted by insertion instead of by character
const INSERTION_SORT_SIZE = 24

interface Entries {
  words: string[]
  dictionaries: Uint16Array
  ranks: Int32Array
}

const flatten = (lists: readonly WordList[]): Entries => {
  let count = 0
  lists.forEach(({ words }) => {
    count += words.length
  })
  const entries: Entries = {
    words: new Array<string>(count),
    dictionaries: new Uint16Array(count),
    ranks: new Int32Array(count),
  }
  let entry = 0
  lists.forEach(({ words, ranks }, dictionary) => {
    for (let index = 0; index < words.length; index += 1) {
      // numbers are listed too, they match as their string
      entries.words[entry] = String(words[index])
      entries.dictionaries[entry] = dictionary
      entries.ranks[entry] = ranks ? ranks[index] : index + 1
      entry += 1
    }
  })
  return entries
}

// The character codes that occur, numbered from 1 in code unit order. 0 is
// for a word that ends before the position that is sorted on. Every code unit
// can occur, so the last id can be 65536.
const getCharacterIds = (words: string[]) => {
  const ids = new Uint32Array(65536)
  words.forEach((word) => {
    for (let index = 0; index < word.length; index += 1) {
      ids[word.charCodeAt(index)] = 1
    }
  })
  let count = 0
  for (let code = 0; code < ids.length; code += 1) {
    if (ids[code] !== 0) {
      count += 1
      ids[code] = count
    }
  }
  return { ids, count }
}

// Sorts the entries by word in UTF-16 code unit order, the order of
// Array.prototype.sort, and keeps entries with the same word in list order.
// A radix sort by character code, the native sort with a comparator is
// about three times slower for a few hundred thousand words.
class EntrySorter {
  readonly order: Int32Array

  private readonly buffer: Int32Array

  // the id of order[index] at the depth being sorted, read once per pass
  private keys: Uint16Array | Uint32Array = new Uint16Array(0)

  private ids = new Uint32Array(0)

  private idCount = 0

  // per depth, so a bucket being sorted deeper keeps the state of its parent
  private readonly countsByDepth: Int32Array[] = []

  private readonly idsByDepth: Int32Array[] = []

  constructor(private readonly words: string[]) {
    this.order = new Int32Array(words.length)
    for (let index = 0; index < words.length; index += 1) {
      this.order[index] = index
    }
    this.buffer = new Int32Array(words.length)
  }

  sort() {
    // only needed to sort by character, a few words are sorted by insertion
    if (this.words.length >= INSERTION_SORT_SIZE) {
      const { ids, count } = getCharacterIds(this.words)
      this.ids = ids
      this.idCount = count
      this.keys =
        count < 65536
          ? new Uint16Array(this.words.length)
          : new Uint32Array(this.words.length)
    }
    this.sortRange(0, this.words.length, 0)
    return this.order
  }

  private getId(word: string, depth: number) {
    return depth < word.length ? this.ids[word.charCodeAt(depth)] : 0
  }

  private getState(depth: number) {
    if (!this.countsByDepth[depth]) {
      this.countsByDepth[depth] = new Int32Array(this.idCount + 1)
      this.idsByDepth[depth] = new Int32Array(this.idCount + 1)
    }
    return {
      counts: this.countsByDepth[depth],
      idsInRange: this.idsByDepth[depth],
    }
  }

  // All words in [start, end) share their first depth characters. Only the
  // ids that occur in the range are visited, the alphabet of all languages
  // has thousands of characters but a range has few of them.
  // eslint-disable-next-line max-statements
  private sortRange(start: number, end: number, depth: number) {
    if (end - start < INSERTION_SORT_SIZE) {
      this.insertionSort(start, end, depth)
      return
    }
    const { order, buffer, keys, words } = this
    const { counts, idsInRange } = this.getState(depth)
    let idCount = 0
    for (let index = start; index < end; index += 1) {
      const id = this.getId(words[order[index]], depth)
      keys[index] = id
      if (counts[id] === 0) {
        idsInRange[idCount] = id
        idCount += 1
      }
      counts[id] += 1
    }
    const sortedIds = idsInRange.subarray(0, idCount).sort()
    // counts[id] becomes the start of the bucket of id
    let bucketStart = start
    sortedIds.forEach((id) => {
      const count = counts[id]
      counts[id] = bucketStart
      bucketStart += count
    })
    // stable, an entry keeps its place among the entries of its bucket
    for (let index = start; index < end; index += 1) {
      const id = keys[index]
      buffer[counts[id]] = order[index]
      counts[id] += 1
    }
    order.set(buffer.subarray(start, end), start)
    // counts[id] is now the end of the bucket of id. Id 0 holds the words
    // that end here, they are all the same.
    bucketStart = start
    sortedIds.forEach((id) => {
      const bucketEnd = counts[id]
      if (id !== 0 && bucketEnd - bucketStart > 1) {
        this.sortRange(bucketStart, bucketEnd, depth + 1)
      }
      bucketStart = bucketEnd
      counts[id] = 0
    })
  }

  // compares from depth on, the characters before it are the same
  private compare(first: string, second: string, depth: number) {
    let index = depth
    while (
      index < first.length &&
      index < second.length &&
      first.charCodeAt(index) === second.charCodeAt(index)
    ) {
      index += 1
    }
    // a word that ends sorts first
    const firstCode = index < first.length ? first.charCodeAt(index) : -1
    const secondCode = index < second.length ? second.charCodeAt(index) : -1
    return firstCode - secondCode
  }

  private insertionSort(start: number, end: number, depth: number) {
    const { order, words } = this
    for (let index = start + 1; index < end; index += 1) {
      const entry = order[index]
      let target = index
      // stops at an equal word, so entries with the same word keep their order
      while (
        target > start &&
        this.compare(words[order[target - 1]], words[entry], depth) > 0
      ) {
        order[target] = order[target - 1]
        target -= 1
      }
      order[target] = entry
    }
  }
}

// Every word of all dictionaries once, sorted, with the dictionaries and
// ranks it has. The words that start with a prefix are next to each other,
// so dictionary matching can extend a prefix one character at a time and stop
// as soon as no word starts with it.
export default class WordIndex {
  // sorted by UTF-16 code unit
  readonly words: string[]

  // the hits of words[index] are at [hitStart[index], hitStart[index + 1])
  readonly hitStart: Int32Array

  // index into dictionaryNames, ascending within the hits of a word
  readonly hitDictionary: Uint8Array | Uint16Array

  readonly hitRank: Int32Array

  readonly dictionaryNames: string[]

  // the lists aren't copied, they are only read again for levenshtein
  private readonly lists: readonly WordList[]

  private readonly findRange = new Int32Array(2)

  private readonly levenshteinDictionaries: LevenshteinDictionary[] = []

  // eslint-disable-next-line max-statements
  constructor(lists: readonly WordList[] = []) {
    this.lists = lists
    this.dictionaryNames = lists.map(({ name }) => name)
    const entries = flatten(lists)
    const order = new EntrySorter(entries.words).sort()

    const words: string[] = []
    const hitStart = new Int32Array(order.length + 1)
    const hitDictionary =
      lists.length <= 256
        ? new Uint8Array(order.length)
        : new Uint16Array(order.length)
    const hitRank = new Int32Array(order.length)
    let hitCount = 0
    let previousWord: string | undefined
    order.forEach((entry) => {
      const word = entries.words[entry]
      const dictionary = entries.dictionaries[entry]
      if (word !== previousWord) {
        hitStart[words.length] = hitCount
        words.push(word)
        previousWord = word
      } else if (hitDictionary[hitCount - 1] === dictionary) {
        // listed twice in one dictionary, the last rank wins
        hitRank[hitCount - 1] = entries.ranks[entry]
        return
      }
      hitDictionary[hitCount] = dictionary
      hitRank[hitCount] = entries.ranks[entry]
      hitCount += 1
    })
    hitStart[words.length] = hitCount

    this.words = words
    this.hitStart = hitStart.slice(0, words.length + 1)
    this.hitDictionary = hitDictionary.slice(0, hitCount)
    this.hitRank = hitRank.slice(0, hitCount)
  }

  // the first index in [start, end) whose word has at least code at depth,
  // the words in [start, end) share their first depth characters
  // eslint-disable-next-line max-params
  private findFirst(start: number, end: number, depth: number, code: number) {
    let low = start
    let high = end
    while (low < high) {
      const middle = (low + high) >>> 1
      const word = this.words[middle]
      // a word that ends at depth sorts first
      const middleCode = depth < word.length ? word.charCodeAt(depth) : -1
      if (middleCode < code) {
        low = middle + 1
      } else {
        high = middle
      }
    }
    return low
  }

  // The range of [start, end) whose words have code at depth, as
  // [first, end) in range[0] and range[1]. The words in [start, end) share
  // their first depth characters.
  narrow(range: Int32Array, depth: number, code: number) {
    const first = this.findFirst(range[0], range[1], depth, code)
    range[1] = this.findFirst(first, range[1], depth, code + 1)
    range[0] = first
  }

  // the index of word, or -1
  find(word: string) {
    const range = this.findRange
    range[0] = 0
    range[1] = this.words.length
    for (
      let depth = 0;
      depth < word.length && range[0] < range[1];
      depth += 1
    ) {
      this.narrow(range, depth, word.charCodeAt(depth))
    }
    return range[0] < range[1] && this.words[range[0]].length === word.length
      ? range[0]
      : -1
  }

  // the words of a dictionary for levenshtein, built on first use
  getLevenshteinDictionary(dictionary: number) {
    let levenshteinDictionary = this.levenshteinDictionaries[dictionary]
    if (!levenshteinDictionary) {
      const { words, ranks } = this.lists[dictionary]
      levenshteinDictionary = {
        getEntries: () => {
          const entries: string[] = []
          const entryRanks: number[] = []
          const seen = new Set<string>()
          // from the end, a word listed twice has its last rank
          for (let index = words.length - 1; index >= 0; index -= 1) {
            const word = String(words[index])
            if (!seen.has(word)) {
              seen.add(word)
              entries.push(word)
              entryRanks.push(ranks ? ranks[index] : index + 1)
            }
          }
          return { entries: entries.reverse(), ranks: entryRanks.reverse() }
        },
        getRank: (entry) => this.getRank(this.find(entry), dictionary),
      }
      this.levenshteinDictionaries[dictionary] = levenshteinDictionary
    }
    return levenshteinDictionary
  }

  // the rank of words[wordIndex] in a dictionary, or undefined
  getRank(wordIndex: number, dictionary: number) {
    if (wordIndex < 0) {
      return undefined
    }
    for (
      let hit = this.hitStart[wordIndex];
      hit < this.hitStart[wordIndex + 1];
      hit += 1
    ) {
      if (this.hitDictionary[hit] === dictionary) {
        return this.hitRank[hit]
      }
    }
    return undefined
  }
}
