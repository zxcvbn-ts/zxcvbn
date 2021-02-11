export interface RepeatOptions {
  baseGuesses: number
  repeatCount: number
}

export default ({ baseGuesses, repeatCount }: RepeatOptions) =>
  baseGuesses * repeatCount
