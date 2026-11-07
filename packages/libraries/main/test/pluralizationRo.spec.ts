import translations from '../../../languages/ro/src/translations'
import { TimeEstimates } from '../src/TimeEstimates'
import Options from '../src/Options'

describe('TimeEstimates Romanian pluralization', () => {
  const options = new Options({
    translations,
  })
  const timeEstimates = new TimeEstimates(options)

  // onlineNoThrottlingXPerSecond guesses 10 times per second
  const display = (seconds: number) =>
    timeEstimates.estimateAttackTimes(seconds * 10).crackTimes
      .onlineNoThrottlingXPerSecond.display

  it('should use the singular form for 1', () => {
    expect(display(1)).toBe('1 secundă')
  })

  it('should not add "de" for numbers ending in 2 to 19', () => {
    expect(display(15)).toBe('15 secunde')
    expect(display(19 * 24 * 3600)).toBe('19 zile')
  })

  it('should add "de" for numbers ending in 20 to 99', () => {
    expect(display(25)).toBe('25 de secunde')
    expect(display(20 * 24 * 3600)).toBe('20 de zile')
  })

  it('should follow the last two digits for larger numbers', () => {
    const { years } = translations.timeEstimation
    expect(years(100)).toBe('100 de ani')
    expect(years(101)).toBe('101 ani')
    expect(years(119)).toBe('119 ani')
    expect(years(120)).toBe('120 de ani')
  })
})
