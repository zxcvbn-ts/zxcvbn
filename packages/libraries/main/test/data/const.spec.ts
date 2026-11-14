import {
  SEPARATOR_CHARS,
  WORD_SEQUENCE_SEPARATOR_CHARS,
} from '../../src/data/const.ts'

describe('separator constants', () => {
  it('only joins words with separator characters', () => {
    WORD_SEQUENCE_SEPARATOR_CHARS.forEach((char) => {
      expect(SEPARATOR_CHARS).toContain(char)
    })
  })
})
