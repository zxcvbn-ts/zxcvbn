import translations from '../../../languages/en/src/translations'
import { TimeEstimates } from '../src/TimeEstimates'
import Options from '../src/Options'

const zxcvbnOptions = new Options({
  translations,
})

// TODO add tests
describe('timeEstimates', () => {
  const timeEstimates = new TimeEstimates(zxcvbnOptions)

  it('should be very weak', () => {
    const attackTimes = timeEstimates.estimateAttackTimes(10)
    expect(attackTimes).toEqual({
      crackTimes: {
        offlineFastHashingXPerSecond: {
          base: null,
          seconds: 1e-9,
          display: 'less than a second',
        },
        offlineSlowHashingXPerSecond: {
          base: null,
          seconds: 0.001,
          display: 'less than a second',
        },
        onlineNoThrottlingXPerSecond: {
          base: 1,
          seconds: 1,
          display: '1 second',
        },
        onlineThrottlingXPerHour: {
          base: 6,
          seconds: 360,
          display: '6 minutes',
        },
      },
      score: 0,
    })
  })

  it('should be weak', () => {
    const attackTimes = timeEstimates.estimateAttackTimes(100000)
    expect(attackTimes).toEqual({
      crackTimes: {
        offlineFastHashingXPerSecond: {
          base: null,
          display: 'less than a second',
          seconds: 0.00001,
        },
        offlineSlowHashingXPerSecond: {
          base: 10,
          display: '10 seconds',
          seconds: 10,
        },
        onlineNoThrottlingXPerSecond: {
          base: 3,
          display: '3 hours',
          seconds: 10000,
        },
        onlineThrottlingXPerHour: {
          base: 1,
          display: '1 month',
          seconds: 3600000,
        },
      },
      score: 1,
    })
  })

  it('should be good', () => {
    const attackTimes = timeEstimates.estimateAttackTimes(10000000)
    expect(attackTimes).toEqual({
      crackTimes: {
        offlineFastHashingXPerSecond: {
          base: null,
          display: 'less than a second',
          seconds: 0.001,
        },
        offlineSlowHashingXPerSecond: {
          base: 17,
          display: '17 minutes',
          seconds: 1000,
        },
        onlineNoThrottlingXPerSecond: {
          base: 12,
          display: '12 days',
          seconds: 1000000,
        },
        onlineThrottlingXPerHour: {
          base: 11,
          display: '11 years',
          seconds: 360000000,
        },
      },
      score: 2,
    })
  })
  it('should be very good', () => {
    const attackTimes = timeEstimates.estimateAttackTimes(1000000000)
    expect(attackTimes).toEqual({
      crackTimes: {
        offlineFastHashingXPerSecond: {
          base: null,
          display: 'less than a second',
          seconds: 0.1,
        },
        offlineSlowHashingXPerSecond: {
          base: 1,
          display: '1 day',
          seconds: 100000,
        },
        onlineNoThrottlingXPerSecond: {
          base: 3,
          display: '3 years',
          seconds: 100000000,
        },
        onlineThrottlingXPerHour: {
          base: null,
          display: 'centuries',
          seconds: 36000000000,
        },
      },
      score: 3,
    })
  })

  it('should be excellent', () => {
    const attackTimes = timeEstimates.estimateAttackTimes(100000000000)
    expect(attackTimes).toEqual({
      crackTimes: {
        offlineFastHashingXPerSecond: {
          base: 10,
          display: '10 seconds',
          seconds: 10,
        },
        offlineSlowHashingXPerSecond: {
          base: 4,
          display: '4 months',
          seconds: 10000000,
        },
        onlineNoThrottlingXPerSecond: {
          base: null,
          display: 'centuries',
          seconds: 10000000000,
        },
        onlineThrottlingXPerHour: {
          base: null,
          display: 'centuries',
          seconds: 3600000000000,
        },
      },
      score: 4,
    })
  })
})
