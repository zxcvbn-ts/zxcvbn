import { TimeEstimates } from '../src/TimeEstimates'
import Options from '../src/Options'
import translationKeys from '../src/data/translationKeys'

describe('TimeEstimates Pluralization Function', () => {
  it('should use pluralization function when provided', () => {
    const customTranslations: any = {
      warnings: {},
      suggestions: {},
      timeEstimation: {
        ltSecond: 'less than a second',
        second: '{base} second',
        seconds: (value: number) => {
          if (value === 2) return 'exactly two seconds'
          return `${value} seconds`
        },
        minute: '{base} minute',
        minutes: '{base} minutes',
        hour: '{base} hour',
        hours: '{base} hours',
        day: '{base} day',
        days: '{base} days',
        month: '{base} month',
        months: '{base} months',
        year: '{base} year',
        years: '{base} years',
        centuries: 'centuries',
      },
    }

    // Fill in missing warnings and suggestions to pass validation
    Object.keys(translationKeys.warnings).forEach((key) => {
      customTranslations.warnings[key] = key
    })
    Object.keys(translationKeys.suggestions).forEach((key) => {
      customTranslations.suggestions[key] = key
    })

    const options = new Options({
      translations: customTranslations,
    })
    const timeEstimates = new TimeEstimates(options)

    // 20 guesses / 10 guesses per second = 2 seconds
    const attackTimes = timeEstimates.estimateAttackTimes(20)
    expect(attackTimes.crackTimes.onlineNoThrottlingXPerSecond.display).toBe(
      'exactly two seconds',
    )

    // 30 guesses / 10 guesses per second = 3 seconds
    const attackTimes3 = timeEstimates.estimateAttackTimes(30)
    expect(attackTimes3.crackTimes.onlineNoThrottlingXPerSecond.display).toBe(
      '3 seconds',
    )
  })
})
