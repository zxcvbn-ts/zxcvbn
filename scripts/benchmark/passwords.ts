// Deterministic password sets, so every target and every run checks the same inputs.

// mulberry32, a tiny seeded PRNG
const createRandom = (seed: number) => {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

const lowercase = 'abcdefghijklmnopqrstuvwxyz'
const allCharacters = `${lowercase}${lowercase.toUpperCase()}0123456789!@#$%^&*()-_=+[]{};:,.<>/?`

const words = [
  'correct',
  'horse',
  'battery',
  'staple',
  'purple',
  'monkey',
  'dishwasher',
  'river',
  'mountain',
  'coffee',
  'window',
  'garden',
  'yellow',
  'thunder',
  'pencil',
  'rocket',
  'silver',
  'forest',
  'ocean',
  'castle',
  'dragon',
  'pirate',
  'summer',
  'winter',
  'banana',
  'orange',
  'guitar',
  'piano',
  'tiger',
  'eagle',
  'shadow',
  'crystal',
  'planet',
  'rabbit',
  'marble',
  'velvet',
  'harbor',
  'lantern',
  'meadow',
  'canyon',
  'falcon',
  'pepper',
  'island',
  'bridge',
  'blanket',
  'compass',
  'feather',
  'journey',
  'kitchen',
  'library',
]

const common = [
  'password',
  '123456',
  '12345678',
  'qwerty',
  'abc123',
  'monkey',
  'letmein',
  'dragon',
  '111111',
  'baseball',
  'iloveyou',
  'trustno1',
  'sunshine',
  'master',
  'welcome',
  'shadow',
  'ashley',
  'football',
  'jesus',
  'michael',
  'ninja',
  'mustang',
  'password1',
  'P@ssw0rd',
  'Passw0rd!',
  'Tr0ub4dor&3',
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm',
  '1q2w3e4r',
  '!QAZ2wsx',
  'qazwsxedc',
  '1qaz2wsx3edc',
  'aaaaaa',
  'abcdefg',
  '987654321',
  'Summer2024',
  'Winter2019!',
  'michael1987',
  'jessica01',
  '11/11/1999',
  '1984-05-23',
  'john.smith',
  'j0hnsm1th',
  'L0nd0n!',
  'b4s3b4ll',
  'p4ssw0rd123',
  'iloveyou2',
  'princess1',
  'superman!',
]

const pick = <T>(random: () => number, items: T[]) =>
  items[Math.floor(random() * items.length)]

const randomString = (random: () => number, length: number) =>
  Array.from({ length }, () =>
    allCharacters.charAt(Math.floor(random() * allCharacters.length)),
  ).join('')

const randomPasswords = (random: () => number) =>
  Array.from({ length: 100 }, () =>
    randomString(random, 8 + Math.floor(random() * 13)),
  )

const passphrases = (random: () => number) =>
  Array.from({ length: 100 }, () => {
    const count = 3 + Math.floor(random() * 4)
    const separator = pick(random, [' ', '-', '', '.'])
    return Array.from({ length: count }, () => pick(random, words)).join(
      separator,
    )
  })

const repeatTo = (pattern: string, length: number) =>
  pattern.repeat(Math.ceil(length / pattern.length)).slice(0, length)

// stays at or below 256 characters, the default maxLength of @zxcvbn-ts/core 4.x,
// so no version gets to skip work by truncating
const longPasswords = (random: () => number) =>
  [64, 128, 256].flatMap((length) => [
    randomString(random, length),
    repeatTo('abc', length),
    repeatTo('qwertyuiop', length),
    repeatTo('password123', length),
    repeatTo(
      Array.from({ length: 12 }, () => pick(random, words)).join(''),
      length,
    ),
    repeatTo('19840523', length),
  ])

export interface Scenario {
  name: string
  description: string
  passwords: string[]
}

export const createScenarios = (): Scenario[] => {
  const random = createRandom(42)
  return [
    {
      name: 'common',
      description:
        'common and leaked passwords with l33t, dates and keyboard patterns',
      passwords: common,
    },
    {
      name: 'random',
      description: 'random 8-20 character strings',
      passwords: randomPasswords(random),
    },
    {
      name: 'passphrase',
      description: '3-6 english words with different separators',
      passwords: passphrases(random),
    },
    {
      name: 'long',
      description: '64, 128 and 256 character inputs, random and repetitive',
      passwords: longPasswords(random),
    },
  ]
}
