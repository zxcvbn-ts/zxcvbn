import mergeUserInputDictionary from '../../src/utils/mergeUserInputDictionary'

describe('mergeUserInputDictionary', () => {
  it('merges per-check user inputs with the static userInputs dictionary instead of overwriting it', () => {
    const optionsDictionaries = {
      commonWords: ['foo'],
      userInputs: ['staticword'],
    }

    const merged = mergeUserInputDictionary(
      optionsDictionaries,
      { commonWords: 3, userInputs: 10 },
      { commonWords: 3, userInputs: 10 },
      {
        dictionary: ['runtimeword'],
        dictionaryMaxWordSize: 11,
        dictionaryMinWordSize: 11,
      },
    )

    expect(merged.dictionaries.userInputs).toEqual(
      expect.arrayContaining(['staticword', 'runtimeword']),
    )
  })
})
