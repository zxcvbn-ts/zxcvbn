import WordIndex from '../../../src/matcher/dictionary/WordIndex'

// the hits of a word as [dictionary name, rank]
const getHits = (wordIndex: WordIndex, word: string) => {
  const index = wordIndex.find(word)
  if (index === -1) {
    return undefined
  }
  const hits: [string, number][] = []
  for (
    let hit = wordIndex.hitStart[index];
    hit < wordIndex.hitStart[index + 1];
    hit += 1
  ) {
    hits.push([
      wordIndex.dictionaryNames[wordIndex.hitDictionary[hit]],
      wordIndex.hitRank[hit],
    ])
  }
  return hits
}

const getRange = (wordIndex: WordIndex, prefix: string) => {
  const range = Int32Array.of(0, wordIndex.words.length)
  for (let depth = 0; depth < prefix.length; depth += 1) {
    wordIndex.narrow(range, depth, prefix.charCodeAt(depth))
  }
  return wordIndex.words.slice(range[0], range[1])
}

describe('WordIndex', () => {
  it('is empty without lists', () => {
    const wordIndex = new WordIndex()
    expect(wordIndex.words).toEqual([])
    expect(wordIndex.dictionaryNames).toEqual([])
    expect(wordIndex.find('a')).toBe(-1)
    expect(getRange(wordIndex, 'a')).toEqual([])
  })

  it('has a single word', () => {
    const wordIndex = new WordIndex([{ name: 'd1', words: ['word'] }])
    expect(wordIndex.words).toEqual(['word'])
    expect(getHits(wordIndex, 'word')).toEqual([['d1', 1]])
    expect(wordIndex.find('wor')).toBe(-1)
    expect(wordIndex.find('words')).toBe(-1)
  })

  it('sorts the words like Array.prototype.sort', () => {
    // more words than are sorted by insertion, with emoji outside the BMP
    // and characters after the surrogates
    const words = Array.from(
      { length: 200 },
      (_, index) =>
        [
          `w${index}`,
          `${index}`,
          `ü${index % 7}`,
          `😀${index % 5}`,
          `Ａ${index % 3}`,
          `pass${index % 11}word`,
        ][index % 6],
    )
    const wordIndex = new WordIndex([
      { name: 'd1', words },
      { name: 'd2', words: [...words].reverse() },
    ])
    expect(wordIndex.words).toEqual([...new Set(words)].sort())
  })

  it('sorts words with every UTF-16 code unit', () => {
    // more character ids than fit in 16 bits
    const words = Array.from({ length: 65536 }, (_, code) =>
      String.fromCharCode(65535 - code).concat(code % 2 ? 'a' : ''),
    )
    words.push('\uffff\u0000', 'a\uffff', '\u0000')
    const wordIndex = new WordIndex([{ name: 'd1', words }])
    expect(wordIndex.words).toEqual([...new Set(words)].sort())
  })

  it('puts a prefix before the words that start with it', () => {
    const wordIndex = new WordIndex([
      { name: 'd1', words: ['password', 'pass', 'passwords', 'pa'] },
    ])
    expect(wordIndex.words).toEqual(['pa', 'pass', 'password', 'passwords'])
    expect(getRange(wordIndex, 'pass')).toEqual([
      'pass',
      'password',
      'passwords',
    ])
    expect(getRange(wordIndex, 'passw')).toEqual(['password', 'passwords'])
    expect(getRange(wordIndex, 'passx')).toEqual([])
    expect(getRange(wordIndex, 'q')).toEqual([])
  })

  it('lists the hits of a word in dictionary order', () => {
    const wordIndex = new WordIndex([
      { name: 'd1', words: ['a', 'b'] },
      { name: 'd2', words: ['b'] },
      { name: 'd3', words: ['c', 'b', 'a'] },
    ])
    expect(getHits(wordIndex, 'a')).toEqual([
      ['d1', 1],
      ['d3', 3],
    ])
    expect(getHits(wordIndex, 'b')).toEqual([
      ['d1', 2],
      ['d2', 1],
      ['d3', 2],
    ])
    expect(wordIndex.getRank(wordIndex.find('b'), 1)).toBe(1)
    expect(wordIndex.getRank(wordIndex.find('c'), 0)).toBeUndefined()
    expect(wordIndex.getRank(-1, 0)).toBeUndefined()
  })

  it('keeps the last rank of a word listed twice, like an object', () => {
    const wordIndex = new WordIndex([
      { name: 'd1', words: ['a', 'b', 'a'] },
      { name: 'd2', words: ['a'] },
    ])
    expect(getHits(wordIndex, 'a')).toEqual([
      ['d1', 3],
      ['d2', 1],
    ])
  })

  it('lists numbers as their string', () => {
    const wordIndex = new WordIndex([{ name: 'd1', words: [123, 'abc', 7] }])
    expect(getHits(wordIndex, '123')).toEqual([['d1', 1]])
    expect(getHits(wordIndex, '7')).toEqual([['d1', 3]])
  })

  it('has an empty word', () => {
    const wordIndex = new WordIndex([{ name: 'd1', words: ['a', ''] }])
    expect(wordIndex.words).toEqual(['', 'a'])
    expect(getHits(wordIndex, '')).toEqual([['d1', 2]])
  })

  it("doesn't find properties of Object.prototype", () => {
    const wordIndex = new WordIndex([{ name: 'd1', words: ['a'] }])
    expect(wordIndex.find('constructor')).toBe(-1)
    expect(wordIndex.find('__proto__')).toBe(-1)
  })

  it('finds a word with an emoji', () => {
    const wordIndex = new WordIndex([{ name: 'd1', words: ['a😀b', 'a😀'] }])
    expect(getHits(wordIndex, 'a😀b')).toEqual([['d1', 1]])
    expect(getRange(wordIndex, 'a\ud83d')).toEqual(['a😀', 'a😀b'])
  })

  describe('levenshtein dictionary', () => {
    const wordIndex = new WordIndex([
      { name: 'd1', words: ['b', 'a', 'b', 7] },
      { name: 'd2', words: ['a'] },
    ])

    it('has the entries of one dictionary once, with their last rank', () => {
      expect(wordIndex.getLevenshteinDictionary(0).getEntries()).toEqual({
        entries: ['a', 'b', '7'],
        ranks: [2, 3, 4],
      })
    })

    it('has the rank of an entry in its dictionary', () => {
      const dictionary = wordIndex.getLevenshteinDictionary(1)
      expect(dictionary.getRank('a')).toBe(1)
      expect(dictionary.getRank('b')).toBeUndefined()
    })

    it('keeps the words from when the index was created', () => {
      const words = ['b', 'a']
      const index = new WordIndex([{ name: 'd1', words }])
      words.length = 0
      words.push('c')
      expect(index.getLevenshteinDictionary(0).getEntries()).toEqual({
        entries: ['b', 'a'],
        ranks: [1, 2],
      })
    })

    it('is built once', () => {
      expect(wordIndex.getLevenshteinDictionary(0)).toBe(
        wordIndex.getLevenshteinDictionary(0),
      )
    })
  })
})
