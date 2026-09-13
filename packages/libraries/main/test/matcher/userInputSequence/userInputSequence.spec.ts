import { ZxcvbnFactory } from '../../../src'
import { UserInputSequenceMatch } from '../../../src/types'

const getSequenceMatch = (
  password: string,
  userInputs?: (string | number)[],
  zxcvbn = new ZxcvbnFactory(),
) =>
  zxcvbn
    .check(password, userInputs)
    .sequence.find((match) => match.pattern === 'userInputSequence') as
    UserInputSequenceMatch | undefined

describe('UserInputSequence Matcher', () => {
  const userInputs = ['Hans', 'Florian', 'Zimmer']

  describe('matching', () => {
    it('should match concatenated user inputs', () => {
      const match = getSequenceMatch('HansFlorianZimmer', userInputs)

      expect(match).toBeDefined()
      expect(match?.words).toEqual(['Hans', 'Florian', 'Zimmer'])
      expect(match?.wordCount).toBe(3)
      expect(match?.separators).toEqual([])
      expect(match?.i).toBe(0)
      expect(match?.j).toBe(16)
    })

    it('should match user inputs in any order', () => {
      const match = getSequenceMatch('ZimmerHansFlorian', userInputs)

      expect(match?.words).toEqual(['Zimmer', 'Hans', 'Florian'])
    })

    it('should match user inputs glued together by separators', () => {
      const match = getSequenceMatch('hans.florian.zimmer', userInputs)

      expect(match?.words).toEqual(['hans', 'florian', 'zimmer'])
      expect(match?.separators).toEqual(['.', '.'])
    })

    it('should match repeated separators', () => {
      const match = getSequenceMatch('Hans--Florian--Zimmer', userInputs)

      expect(match?.words).toEqual(['Hans', 'Florian', 'Zimmer'])
      expect(match?.separators).toEqual(['--', '--'])
    })

    it('should not treat a non separator gap as a separator', () => {
      expect(
        getSequenceMatch('Hans42Florian42Zimmer', userInputs),
      ).toBeUndefined()
    })

    it('should only match the user input part of the password', () => {
      const match = getSequenceMatch('xkcdHansZimmer#9Qz', userInputs)

      expect(match?.token).toBe('HansZimmer')
      expect(match?.i).toBe(4)
      expect(match?.j).toBe(13)
    })

    it('should leave the rest of the password to the other matchers', () => {
      const zxcvbn = new ZxcvbnFactory()
      const { sequence } = zxcvbn.check('HansZimmer2024', userInputs)

      expect(sequence.map((match) => match.pattern)).toEqual([
        'userInputSequence',
        'regex',
      ])
    })

    it('should not match a single user input', () => {
      expect(getSequenceMatch('Zimmer', userInputs)).toBeUndefined()
    })

    it('should not match without user inputs', () => {
      expect(getSequenceMatch('HansFlorianZimmer')).toBeUndefined()
    })

    it('should also use user inputs given on construction', () => {
      const zxcvbn = new ZxcvbnFactory({ dictionary: { userInputs } })

      expect(getSequenceMatch('hansflorian', undefined, zxcvbn)).toBeDefined()
    })
  })

  describe('scoring', () => {
    it('should rate a passphrase made of user inputs as very weak', () => {
      const zxcvbn = new ZxcvbnFactory()

      expect(zxcvbn.check('HansFlorianZimmer', userInputs).score).toBe(0)
      expect(zxcvbn.check('ZimmerHansFlorian', userInputs).score).toBe(0)
      expect(zxcvbn.check('Hans--Florian--Zimmer', userInputs).score).toBe(0)
    })

    it('should charge more guesses for a longer separator', () => {
      const zxcvbn = new ZxcvbnFactory()

      expect(zxcvbn.check('hans--zimmer', userInputs).guesses).toBeGreaterThan(
        zxcvbn.check('hans-zimmer', userInputs).guesses,
      )
      expect(
        zxcvbn.check('hans----------zimmer', userInputs).guesses,
      ).toBeGreaterThan(zxcvbn.check('hans--zimmer', userInputs).guesses)
    })

    it('should not weaken a password without user inputs', () => {
      const zxcvbn = new ZxcvbnFactory()

      expect(zxcvbn.check('HansFlorianZimmer').score).toBe(4)
    })

    it('should charge more guesses for a bigger user input pool', () => {
      const zxcvbn = new ZxcvbnFactory()
      const small = zxcvbn.check('hansflorian', ['hans', 'florian'])
      const big = zxcvbn.check('hansflorian', [
        'hans',
        'florian',
        'zimmer',
        'berlin',
        'gmail',
      ])

      expect(big.guesses).toBeGreaterThan(small.guesses)
    })
  })

  describe('feedback', () => {
    it('should warn about personal data', () => {
      const zxcvbn = new ZxcvbnFactory()
      const { feedback } = zxcvbn.check('HansFlorianZimmer', userInputs)

      expect(feedback.warning).toBe('userInputs')
    })
  })
})
