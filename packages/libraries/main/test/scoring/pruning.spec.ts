import * as zxcvbnCommonPackage from '../../../../languages/common/src'
import * as zxcvbnEnPackage from '../../../../languages/en/src'
import Scoring from '../../src/scoring'
import Matching from '../../src/Matching'
import Options from '../../src/Options'
import { MatchExtended } from '../../src/types'
import passwordTests from '../helper/passwordTests'

// The bruteforce pruning (startBounds) may only skip candidates that can't
// win. A wrongly skipped candidate changes the optimal sequence and with it
// the guesses, in either direction, so the pruned result has to equal the
// unpruned one exactly.
const disablePruning = (scoring: Scoring) => {
  const internals = scoring as any
  const boundStart = internals.boundStart.bind(scoring)
  internals.boundStart = (i: number) => {
    boundStart(i)
    internals.startBounds[i] = Number.NEGATIVE_INFINITY
  }
}

const countUpdates = (scoring: Scoring) => {
  const internals = scoring as any
  const update = internals.update.bind(scoring)
  const counter = { calls: 0 }
  internals.update = (...args: unknown[]) => {
    counter.calls += 1
    update(...args)
  }
  return counter
}

const simplify = (sequence: MatchExtended[]) =>
  sequence.map(({ pattern, i, j, token }) => ({ pattern, i, j, token }))

describe('scoring pruning', () => {
  const options = new Options({
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
  })
  const matching = new Matching(options)

  const passwords = [
    ...passwordTests.map(({ password }) => password),
    'correcthorsebatterystaple',
    'correct-horse-battery-staple',
    'Tr0ub4dor&3',
    'p4ssw0rd1990password',
    'qwertyasdfghzxcvbn123456',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'x7#Kq!2vLp@9zR$wM4&nB8^cT1*fG6',
    'ilovemydog19.05.1987andmycat',
    '😀password😀1234😀dragon😀',
    '2001-09-11🙂abcdefg🙂monkey',
    'İstanbulİstanbul1453',
    'thequickbrownfoxjumpsoverthelazydog',
    'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  ]

  const score = (
    password: string,
    excludeAdditive: boolean,
    prune: boolean,
  ) => {
    const scoring = new Scoring(options)
    if (!prune) {
      disablePruning(scoring)
    }
    const counter = countUpdates(scoring)
    const matches = matching.match(password) as MatchExtended[]
    const result = scoring.mostGuessableMatchSequence(
      password,
      matches,
      excludeAdditive,
    )
    return { result, updates: counter.calls }
  }

  ;[false, true].forEach((excludeAdditive) => {
    describe(`excludeAdditive: ${excludeAdditive}`, () => {
      passwords.forEach((password) => {
        it(`finds the same sequence with and without pruning for ${password}`, () => {
          const pruned = score(password, excludeAdditive, true)
          const unpruned = score(password, excludeAdditive, false)

          expect(pruned.result.guesses).toEqual(unpruned.result.guesses)
          expect(simplify(pruned.result.sequence)).toEqual(
            simplify(unpruned.result.sequence),
          )
          expect(pruned.updates).toBeLessThanOrEqual(unpruned.updates)
        })
      })
    })
  })

  it('skips candidates on a long password', () => {
    const password = 'thequickbrownfoxjumpsoverthelazydog'
    const pruned = score(password, false, true)
    const unpruned = score(password, false, false)
    expect(pruned.updates).toBeLessThan(unpruned.updates)
  })
})
