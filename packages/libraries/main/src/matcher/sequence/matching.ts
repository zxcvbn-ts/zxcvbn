import { ALL_UPPER, ALL_LOWER, ALL_DIGIT } from '../../data/const'
import { MatcherBaseClass, MatchOptions, SequenceMatch } from '../../types'

interface UpdateParams {
  i: number
  j: number
  delta: number
  password: string
  result: any[]
}

type SequenceMatchOptions = Pick<MatchOptions, 'password'>
/*
 *-------------------------------------------------------------------------------
 * sequences (abcdef) ------------------------------
 *-------------------------------------------------------------------------------
 */
class MatchSequence extends MatcherBaseClass {
  MAX_DELTA = 5

  // eslint-disable-next-line max-statements
  match({ password }: SequenceMatchOptions) {
    /*
     * Identifies sequences by looking for repeated differences in unicode codepoint.
     * this allows skipping, such as 9753, and also matches some extended unicode sequences
     * such as Greek and Cyrillic alphabets.
     *
     * for example, consider the input 'abcdb975zy'
     *
     * password: a   b   c   d   b    9   7   5   z   y
     * index:    0   1   2   3   4    5   6   7   8   9
     * delta:      1   1   1  -2  -41  -2  -2  69   1
     *
     * expected result:
     * [(i, j, delta), ...] = [(0, 3, 1), (5, 7, -2), (8, 9, 1)]
     */
    const result: SequenceMatch[] = []
    // split by Unicode code point rather than UTF-16 code unit, so a
    // surrogate pair (eg. an astral-plane character) is treated as one
    // character with one codepoint delta instead of two meaningless ones
    const characters = Array.from(password)
    if (characters.length <= 1) {
      return []
    }
    // [i, j] are reported in UTF-16 code units (like every other matcher), so
    // track the code-unit offset each character starts at
    const unitOffsets: number[] = []
    let unitOffset = 0
    characters.forEach((character) => {
      unitOffsets.push(unitOffset)
      unitOffset += character.length
    })
    const lastUnitIndex = (charIndex: number) =>
      unitOffsets[charIndex] + characters[charIndex].length - 1

    let i = 0
    let lastDelta: number | null = null
    const charactersLength = characters.length
    for (let k = 1; k < charactersLength; k += 1) {
      const delta =
        characters[k].codePointAt(0)! - characters[k - 1].codePointAt(0)!
      if (lastDelta === null) {
        lastDelta = delta
      }
      if (delta !== lastDelta) {
        const j = k - 1
        this.update({
          i: unitOffsets[i],
          j: lastUnitIndex(j),
          delta: lastDelta,
          password,
          result,
        })
        i = j
        lastDelta = delta
      }
    }
    this.update({
      i: unitOffsets[i],
      j: lastUnitIndex(charactersLength - 1),
      delta: lastDelta!,
      password,
      result,
    })
    return result
  }

  update({ i, j, delta, password, result }: UpdateParams) {
    if (j - i > 1 || Math.abs(delta) === 1) {
      const absoluteDelta = Math.abs(delta)
      if (absoluteDelta > 0 && absoluteDelta <= this.MAX_DELTA) {
        const token = password.slice(i, j + 1)
        const { sequenceName, sequenceSpace } = this.getSequence(token)
        return result.push({
          pattern: 'sequence',
          i,
          j,
          token: password.slice(i, j + 1),
          sequenceName,
          sequenceSpace,
          ascending: delta > 0,
        })
      }
    }
    return null
  }

  getSequence(token: string) {
    // TODO conservatively stick with roman alphabet size.
    //  (this could be improved)
    let sequenceName = 'unicode'
    let sequenceSpace = 26

    if (ALL_LOWER.test(token)) {
      sequenceName = 'lower'
      sequenceSpace = 26
    } else if (ALL_UPPER.test(token)) {
      sequenceName = 'upper'
      sequenceSpace = 26
    } else if (ALL_DIGIT.test(token)) {
      sequenceName = 'digits'
      sequenceSpace = 10
    }
    return {
      sequenceName,
      sequenceSpace,
    }
  }
}

export default MatchSequence
