import getL33tSubstitutions from '../../../../../src/matcher/dictionary/variants/matching/l33tSubstitutions'

describe('l33tSubstitutions', () => {
  it('lists a letter once if the l33t table repeats its substitution', () => {
    expect(getL33tSubstitutions({ a: ['4', '4'], b: ['4'] }).get('4')).toEqual([
      { substitution: '4', letters: ['a', 'b'], lettersLower: ['a', 'b'] },
    ])
  })
})
