/*
 * The npm didn't work so i copied the necessary part
 * src: https://www.npmjs.com/package/iso-8859-2
 */
/*! https://mths.be/iso-8859-2 v3.0.4 by @mathias | MIT license */
const stringFromCharCode = String.fromCharCode

const INDEX_BY_POINTER = new Map([
  [0, '\x80'],
  [1, '\x81'],
  [2, '\x82'],
  [3, '\x83'],
  [4, '\x84'],
  [5, '\x85'],
  [6, '\x86'],
  [7, '\x87'],
  [8, '\x88'],
  [9, '\x89'],
  [10, '\x8A'],
  [11, '\x8B'],
  [12, '\x8C'],
  [13, '\x8D'],
  [14, '\x8E'],
  [15, '\x8F'],
  [16, '\x90'],
  [17, '\x91'],
  [18, '\x92'],
  [19, '\x93'],
  [20, '\x94'],
  [21, '\x95'],
  [22, '\x96'],
  [23, '\x97'],
  [24, '\x98'],
  [25, '\x99'],
  [26, '\x9A'],
  [27, '\x9B'],
  [28, '\x9C'],
  [29, '\x9D'],
  [30, '\x9E'],
  [31, '\x9F'],
  [32, '\xA0'],
  [33, '\u0104'],
  [34, '\u02D8'],
  [35, '\u0141'],
  [36, '\xA4'],
  [37, '\u013D'],
  [38, '\u015A'],
  [39, '\xA7'],
  [40, '\xA8'],
  [41, '\u0160'],
  [42, '\u015E'],
  [43, '\u0164'],
  [44, '\u0179'],
  [45, '\xAD'],
  [46, '\u017D'],
  [47, '\u017B'],
  [48, '\xB0'],
  [49, '\u0105'],
  [50, '\u02DB'],
  [51, '\u0142'],
  [52, '\xB4'],
  [53, '\u013E'],
  [54, '\u015B'],
  [55, '\u02C7'],
  [56, '\xB8'],
  [57, '\u0161'],
  [58, '\u015F'],
  [59, '\u0165'],
  [60, '\u017A'],
  [61, '\u02DD'],
  [62, '\u017E'],
  [63, '\u017C'],
  [64, '\u0154'],
  [65, '\xC1'],
  [66, '\xC2'],
  [67, '\u0102'],
  [68, '\xC4'],
  [69, '\u0139'],
  [70, '\u0106'],
  [71, '\xC7'],
  [72, '\u010C'],
  [73, '\xC9'],
  [74, '\u0118'],
  [75, '\xCB'],
  [76, '\u011A'],
  [77, '\xCD'],
  [78, '\xCE'],
  [79, '\u010E'],
  [80, '\u0110'],
  [81, '\u0143'],
  [82, '\u0147'],
  [83, '\xD3'],
  [84, '\xD4'],
  [85, '\u0150'],
  [86, '\xD6'],
  [87, '\xD7'],
  [88, '\u0158'],
  [89, '\u016E'],
  [90, '\xDA'],
  [91, '\u0170'],
  [92, '\xDC'],
  [93, '\xDD'],
  [94, '\u0162'],
  [95, '\xDF'],
  [96, '\u0155'],
  [97, '\xE1'],
  [98, '\xE2'],
  [99, '\u0103'],
  [100, '\xE4'],
  [101, '\u013A'],
  [102, '\u0107'],
  [103, '\xE7'],
  [104, '\u010D'],
  [105, '\xE9'],
  [106, '\u0119'],
  [107, '\xEB'],
  [108, '\u011B'],
  [109, '\xED'],
  [110, '\xEE'],
  [111, '\u010F'],
  [112, '\u0111'],
  [113, '\u0144'],
  [114, '\u0148'],
  [115, '\xF3'],
  [116, '\xF4'],
  [117, '\u0151'],
  [118, '\xF6'],
  [119, '\xF7'],
  [120, '\u0159'],
  [121, '\u016F'],
  [122, '\xFA'],
  [123, '\u0171'],
  [124, '\xFC'],
  [125, '\xFD'],
  [126, '\u0163'],
  [127, '\u02D9'],
])

// https://encoding.spec.whatwg.org/#error-mode
const decodingError = (mode: string) => {
  if (mode === 'replacement') {
    return '\uFFFD'
  }
  // Else, `mode == 'fatal'`.
  throw new Error()
}

// https://encoding.spec.whatwg.org/#single-byte-decoder
// eslint-disable-next-line max-statements
export default (
  input: string | Buffer,
  mode: 'replacement' | 'fatal' = 'replacement',
) => {
  const { length } = input

  // Support byte strings as input.
  if (typeof input === 'string') {
    const bytes = new Uint16Array(length)
    for (let index = 0; index < length; index += 1) {
      bytes[index] = input.charCodeAt(index)
    }
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    input = bytes
  }

  const buffer = []
  for (let index = 0; index < length; index += 1) {
    const byteValue = input[index]
    // “If `byte` is an ASCII byte, return a code point whose value is
    // `byte`.”
    if (byteValue >= 0x00 && byteValue <= 0x7f) {
      // @ts-ignore
      buffer.push(stringFromCharCode(byteValue))
      // eslint-disable-next-line no-continue
      continue
    }
    // “Let `code point` be the index code point for `byte − 0x80` in index
    // single-byte.”
    // @ts-ignore
    const pointer = byteValue - 0x80
    if (INDEX_BY_POINTER.has(pointer)) {
      // “Return a code point whose value is `code point`.”
      buffer.push(INDEX_BY_POINTER.get(pointer))
    } else {
      // “If `code point` is `null`, return `error`.”
      buffer.push(decodingError(mode))
    }
  }
  const result = buffer.join('')

  return result
}
