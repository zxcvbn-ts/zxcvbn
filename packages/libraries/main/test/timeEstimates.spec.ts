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
      crackTimesDisplay: {
        offlineFastHashingXPerSecond: 'less than a second',
        offlineSlowHashingXPerSecond: 'less than a second',
        onlineNoThrottlingXPerSecond: '1 second',
        onlineThrottlingXPerHour: '6 minutes',
      },
      crackTimesSeconds: {
        offlineFastHashingXPerSecond: 1e-9,
        offlineSlowHashingXPerSecond: 0.001,
        onlineNoThrottlingXPerSecond: 1,
        onlineThrottlingXPerHour: 360,
      },
      score: 0,
    })
  })

  it('should be weak', () => {
    const attackTimes = timeEstimates.estimateAttackTimes(100000)
    expect(attackTimes).toEqual({
      crackTimesDisplay: {
        offlineFastHashingXPerSecond: 'less than a second',
        offlineSlowHashingXPerSecond: '10 seconds',
        onlineNoThrottlingXPerSecond: '3 hours',
        onlineThrottlingXPerHour: '1 month',
      },
      crackTimesSeconds: {
        offlineFastHashingXPerSecond: 0.00001,
        offlineSlowHashingXPerSecond: 10,
        onlineNoThrottlingXPerSecond: 10000,
        onlineThrottlingXPerHour: 3600000,
      },
      score: 1,
    })
  })

  it('should be good', () => {
    const attackTimes = timeEstimates.estimateAttackTimes(10000000)
    expect(attackTimes).toEqual({
      crackTimesDisplay: {
        offlineFastHashingXPerSecond: 'less than a second',
        offlineSlowHashingXPerSecond: '17 minutes',
        onlineNoThrottlingXPerSecond: '12 days',
        onlineThrottlingXPerHour: '11 years',
      },
      crackTimesSeconds: {
        offlineFastHashingXPerSecond: 0.001,
        offlineSlowHashingXPerSecond: 1000,
        onlineNoThrottlingXPerSecond: 1000000,
        onlineThrottlingXPerHour: 360000000,
      },
      score: 2,
    })
  })
  it('should be very good', () => {
    const attackTimes = timeEstimates.estimateAttackTimes(1000000000)
    expect(attackTimes).toEqual({
      crackTimesDisplay: {
        offlineFastHashingXPerSecond: 'less than a second',
        offlineSlowHashingXPerSecond: '1 day',
        onlineNoThrottlingXPerSecond: '3 years',
        onlineThrottlingXPerHour: 'centuries',
      },
      crackTimesSeconds: {
        offlineFastHashingXPerSecond: 0.1,
        offlineSlowHashingXPerSecond: 100000,
        onlineNoThrottlingXPerSecond: 100000000,
        onlineThrottlingXPerHour: 36000000000,
      },
      score: 3,
    })
  })

  it('should be excellent', () => {
    const attackTimes = timeEstimates.estimateAttackTimes(100000000000)
    expect(attackTimes).toEqual({
      crackTimesDisplay: {
        offlineFastHashingXPerSecond: '10 seconds',
        offlineSlowHashingXPerSecond: '4 months',
        onlineNoThrottlingXPerSecond: 'centuries',
        onlineThrottlingXPerHour: 'centuries',
      },
      crackTimesSeconds: {
        offlineFastHashingXPerSecond: 10,
        offlineSlowHashingXPerSecond: 10000000,
        onlineNoThrottlingXPerSecond: 10000000000,
        onlineThrottlingXPerHour: 3600000000000,
      },
      score: 4,
    })
  })
})
