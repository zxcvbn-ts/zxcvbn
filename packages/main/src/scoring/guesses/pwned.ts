import {
  PWNED_HIGHEST_HASH_COUNT,
  PWNED_PASSWORD_AMOUNT,
} from '../../data/const'

export interface PwnedOptions {
  pwnedAmount: number
}

// TODO make some more appropriated guesses logic?
// To calculate a appropriate guess count this will get the percentage
// of the amount of password usages in the list
// and the percentage of the password usages vs the highest used password
// This will result in `198` for the highest used password and 39594 for the lowest used passwords
export default ({ pwnedAmount }: PwnedOptions) => {
  const passwordPercent = pwnedAmount / PWNED_PASSWORD_AMOUNT
  const countPercent = pwnedAmount / PWNED_HIGHEST_HASH_COUNT
  return countPercent / passwordPercent
}
