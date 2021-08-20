import { MatchExtended } from '../../types'

// This is the current highest count of a password in the hash list
export const PWNED_HIGHEST_HASH_COUNT = 2877689
export const PWNED_PASSWORD_AMOUNT = 572611621

// TODO make some more appropriated guesses logic?
// To calculate a appropriate guess count this will get the percentage
// of the amount of password usages in the list
// and the percentage of the password usages vs the highest used password
// This will result in `198` for the highest used password and 39594 for the lowest used passwords
export default ({ pwnedAmount }: MatchExtended) => {
  const passwordPercent = pwnedAmount / PWNED_PASSWORD_AMOUNT
  const countPercent = pwnedAmount / PWNED_HIGHEST_HASH_COUNT

  console.log('asd', pwnedAmount, countPercent, passwordPercent)
  return countPercent / passwordPercent
}
