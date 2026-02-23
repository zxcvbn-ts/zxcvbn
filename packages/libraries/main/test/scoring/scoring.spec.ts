import Scoring from '../../src/scoring'
import Options from '../../src/Options'

const getMatch = (
  i: number,
  j: number,
  guesses: number,
  pattern = 'dictionary',
) => ({
  i,
  j,
  token: 'x'.repeat(j - i + 1),
  pattern,
  guesses,
})
describe('scoring', () => {
  const zxcvbnOptions = new Options()
  const scoring = new Scoring(zxcvbnOptions)
  const excludeAdditive = true
  const password = '0123456789'

  describe('returns one bruteforce match given an empty match sequence:', () => {
    const result = scoring.mostGuessableMatchSequence(password, [])
    const firstSequence = result.sequence[0]

    it('result.length == 1', () => {
      expect(result.sequence.length).toEqual(1)
    })

    it("match.pattern == 'bruteforce'", () => {
      expect(firstSequence.pattern).toEqual('bruteforce')
    })

    it(`match.token == ${password}`, () => {
      expect(firstSequence.token).toEqual(password)
    })

    it(`[i, j] == [${firstSequence.i}, ${firstSequence.j}]`, () => {
      expect([firstSequence.i, firstSequence.j]).toEqual([0, 9])
    })
  })

  describe('returns match + bruteforce when match covers a prefix of password:', () => {
    const matches = [getMatch(0, 5, 1)]
    const firstMatch = matches[0]
    const result = scoring.mostGuessableMatchSequence(
      password,
      matches,
      excludeAdditive,
    )
    const secondSequence = result.sequence[1]

    it('result.match.sequence.length == 2', () => {
      expect(result.sequence.length).toEqual(2)
    })

    it('first match is the provided match object', () => {
      expect(result.sequence[0]).toEqual(firstMatch)
    })

    it('second match is bruteforce', () => {
      expect(secondSequence.pattern).toEqual('bruteforce')
    })

    it('second match covers full suffix after first match', () => {
      expect([secondSequence.i, secondSequence.j]).toEqual([6, 9])
    })
  })

  describe('returns bruteforce + match when match covers a suffix:', () => {
    const matches = [getMatch(3, 9, 1)]
    const firstMatch = matches[0]
    const result = scoring.mostGuessableMatchSequence(
      password,
      matches,
      excludeAdditive,
    )
    const firstSequence = result.sequence[0]

    it('result.match.sequence.length == 2', () => {
      expect(result.sequence.length).toEqual(2)
    })

    it('first match is bruteforce', () => {
      expect(firstSequence.pattern).toEqual('bruteforce')
    })

    it('first match covers full prefix before second match', () => {
      expect([firstSequence.i, firstSequence.j]).toEqual([0, 2])
    })

    it('second match is the provided match object', () => {
      expect(result.sequence[1]).toEqual(firstMatch)
    })
  })

  describe('returns bruteforce + match + bruteforce when match covers an infix:', () => {
    const matches = [getMatch(1, 8, 1)]
    const result = scoring.mostGuessableMatchSequence(
      password,
      matches,
      excludeAdditive,
    )
    const firstSequence = result.sequence[0]
    const thirdSequence = result.sequence[2]

    it('irst match is bruteforce', () => {
      expect(firstSequence.pattern).toEqual('bruteforce')
    })

    it('third match is bruteforce', () => {
      expect(thirdSequence.pattern).toEqual('bruteforce')
    })

    it('first match covers full prefix before second match', () => {
      expect([firstSequence.i, firstSequence.j]).toEqual([0, 0])
    })

    it('third match covers full suffix after second match', () => {
      expect([thirdSequence.i, thirdSequence.j]).toEqual([9, 9])
    })
  })

  describe('chooses lower-guesses match given two matches of the same span:', () => {
    const matches = [getMatch(0, 9, 1), getMatch(0, 9, 2)]
    const firstMatch = matches[0]
    const secondMatch = matches[1]
    let result = scoring.mostGuessableMatchSequence(
      password,
      matches,
      excludeAdditive,
    )

    it('result.length == 1', () => {
      expect(result.sequence.length).toEqual(1)
    })

    // TODO make this better `it` will be triggered after
    //  `firstMatch.guesses = 3` and will fail because of it
    const backupFirstMatch = JSON.parse(JSON.stringify(firstMatch))
    const backupSequence = JSON.parse(JSON.stringify(result.sequence[0]))
    it('result.sequence[0] == m0', () => {
      expect(backupSequence).toEqual(backupFirstMatch)
    })

    firstMatch.guesses = 3
    result = scoring.mostGuessableMatchSequence(
      password,
      matches,
      excludeAdditive,
    )

    it('result.sequence[0] == m1', () => {
      expect(result.sequence[0]).toEqual(secondMatch)
    })
  })

  describe('covers correctly', () => {
    const matches = [getMatch(0, 9, 3), getMatch(0, 3, 2), getMatch(4, 9, 1)]
    const firstMatch = matches[0]
    const secondMatch = matches[1]
    const thirdMatch = matches[2]

    describe('when m0 covers m1 and m2, choose [m0] when m0 < m1 * m2 * fact(2):', () => {
      const result = scoring.mostGuessableMatchSequence(
        password,
        matches,
        excludeAdditive,
      )
      it('total guesses == 3', () => {
        expect(result.guesses).toEqual(3)
      })

      it('sequence is [m0]', () => {
        expect(result.sequence).toEqual([firstMatch])
      })
    })

    describe('when m0 covers m1 and m2, choose [m1, m2] when m0 > m1 * m2 * fact(2):', () => {
      firstMatch.guesses = 5
      const result = scoring.mostGuessableMatchSequence(
        password,
        matches,
        excludeAdditive,
      )
      it('total guesses == 4', () => {
        expect(result.guesses).toEqual(4)
      })

      it('sequence is [m1, m2]', () => {
        expect(result.sequence).toEqual([secondMatch, thirdMatch])
      })
    })
  })

  describe('extended tests:', () => {
    it('handles empty password', () => {
      const result = scoring.mostGuessableMatchSequence('', [])
      expect(result.guesses).toEqual(1)
      expect(result.sequence).toEqual([])
    })

    it('applies additive penalty when excludeAdditive is false (default)', () => {
      const passwordLocal = 'password'
      // Single match covering everything
      const matches = [getMatch(0, 7, 100)]
      const result = scoring.mostGuessableMatchSequence(passwordLocal, matches)
      // g = sequenceLength! * Product(guesses) + D^(sequenceLength - 1)
      // for sequenceLength 1: 1! * 100 + 10000^0 = 100 + 1 = 101
      expect(result.guesses).toEqual(101)
    })

    it('does not apply additive penalty when excludeAdditive is true', () => {
      const passwordLocal = 'password'
      const matches = [getMatch(0, 7, 100)]
      const result = scoring.mostGuessableMatchSequence(
        passwordLocal,
        matches,
        true,
      )
      // g = sequenceLength! * Product(guesses) = 1! * 100 = 100
      expect(result.guesses).toEqual(100)
    })

    it('handles multiple matches in a sequence with additive penalty', () => {
      const passwordLocal = 'password'
      // Two matches: [0,3] and [4,7]
      const matches = [getMatch(0, 3, 10), getMatch(4, 7, 10)]
      const result = scoring.mostGuessableMatchSequence(passwordLocal, matches)
      // sequenceLength = 2
      // pi = 10 * 10 = 100
      // g = 2! * 100 + 10000^(2-1) = 2 * 100 + 10000 = 10200
      expect(result.guesses).toEqual(10200)
    })

    it('sorts matches by starting index i for deterministic output', () => {
      const passwordLocal = 'abc'
      // Matches with same j but different i.
      // If we provide them out of order, they should be sorted.
      const m1 = getMatch(1, 2, 10)
      const m2 = getMatch(0, 2, 100)
      const result = scoring.mostGuessableMatchSequence(passwordLocal, [m1, m2])
      const resultReverse = scoring.mostGuessableMatchSequence(passwordLocal, [
        m2,
        m1,
      ])
      expect(result).toEqual(resultReverse)
    })

    it('avoids adjacent bruteforce matches', () => {
      const passwordLocal = 'abc'
      // We want to see if it ever produces [bruteforce(0,0), bruteforce(1,2)]
      // It should always prefer [bruteforce(0,2)]
      const result = scoring.mostGuessableMatchSequence(passwordLocal, [])
      expect(result.sequence.length).toEqual(1)
      expect(result.sequence[0].pattern).toEqual('bruteforce')
      expect(result.sequence[0].i).toEqual(0)
      expect(result.sequence[0].j).toEqual(2)
    })

    it('includes guessesLog10 in the result', () => {
      const passwordLocal = 'p'
      const result = scoring.mostGuessableMatchSequence(passwordLocal, [])
      expect(result.guessesLog10).toBeDefined()
      expect(result.guessesLog10).toBeCloseTo(Math.log10(result.guesses), 10)
    })

    it('chooses the best sequence length when multiple are possible', () => {
      // This tests the logic in unwind where it finds the sequenceLength with minimum g
      const passwordLocal = 'abcd'
      // Suppose we have matches such that a sequence of length 1 and length 2 both cover the password.
      // m1: [0,3], guesses=1000
      // m2: [0,1], guesses=10
      // m3: [2,3], guesses=10
      // excludeAdditive = true to simplify math
      const m1 = getMatch(0, 3, 1000)
      const m2 = getMatch(0, 1, 10)
      const m3 = getMatch(2, 3, 10)

      const result = scoring.mostGuessableMatchSequence(
        passwordLocal,
        [m1, m2, m3],
        true,
      )

      // sequence length 1: g = 1! * 1000 = 1000
      // sequence length 2: g = 2! * (10 * 10) = 2 * 100 = 200
      // should choose length 2
      expect(result.sequence.length).toEqual(2)
      expect(result.guesses).toEqual(200)
      expect(result.sequence).toEqual([m2, m3])
    })
  })
})
