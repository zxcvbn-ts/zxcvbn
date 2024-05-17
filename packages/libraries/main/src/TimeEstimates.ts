import Options from './Options'
import {
  CrackTimesDisplay,
  CrackTimesSeconds,
  Score,
  TimeEstimationValues,
} from './types'

const SECOND = 1
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const MONTH = DAY * 31
const YEAR = MONTH * 12
const CENTURY = YEAR * 100

const times = {
  second: SECOND,
  minute: MINUTE,
  hour: HOUR,
  day: DAY,
  month: MONTH,
  year: YEAR,
  century: CENTURY,
}

export const timeEstimationValuesDefaults: TimeEstimationValues = {
  scoring: {
    0: 1e3,
    1: 1e6,
    2: 1e8,
    3: 1e10,
  },
  attackTime: {
    onlineThrottlingXPerHour: 100,
    onlineNoThrottlingXPerSecond: 10,
    offlineSlowHashingXPerSecond: 1e4,
    offlineFastHashingXPerSecond: 1e10,
  },
}

export const checkTimeEstimationValues = (
  timeEstimationValues: TimeEstimationValues,
) => {
  Object.entries(timeEstimationValues).forEach(([key, data]) => {
    Object.entries(data).forEach(([subKey, value]) => {
      // @ts-ignore
      if (value < timeEstimationValuesDefaults[key][subKey]) {
        throw new Error(
          'Time estimation values are not to be allowed to be less than default',
        )
      }
    })
  })
}

/*
 * -------------------------------------------------------------------------------
 *  Estimates time for an attacker ---------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */
export class TimeEstimates {
  constructor(private options: Options) {}

  public estimateAttackTimes(guesses: number) {
    const attackTimesOptions = this.options.timeEstimationValues.attackTime
    const crackTimesSeconds: CrackTimesSeconds = {
      onlineThrottlingXPerHour:
        guesses / (attackTimesOptions.onlineThrottlingXPerHour / 3600),
      onlineNoThrottlingXPerSecond:
        guesses / attackTimesOptions.onlineNoThrottlingXPerSecond,
      offlineSlowHashingXPerSecond:
        guesses / attackTimesOptions.offlineSlowHashingXPerSecond,
      offlineFastHashingXPerSecond:
        guesses / attackTimesOptions.offlineFastHashingXPerSecond,
    }
    const crackTimesDisplay: CrackTimesDisplay = {
      onlineThrottlingXPerHour: '',
      onlineNoThrottlingXPerSecond: '',
      offlineSlowHashingXPerSecond: '',
      offlineFastHashingXPerSecond: '',
    }
    Object.keys(crackTimesSeconds).forEach((scenario) => {
      const seconds = crackTimesSeconds[scenario as keyof CrackTimesSeconds]
      crackTimesDisplay[scenario as keyof CrackTimesDisplay] =
        this.displayTime(seconds)
    })
    return {
      crackTimesSeconds,
      crackTimesDisplay,
      score: this.guessesToScore(guesses),
    }
  }

  private guessesToScore(guesses: number): Score {
    const scoringOptions = this.options.timeEstimationValues.scoring
    const DELTA = 5
    if (guesses < scoringOptions[0] + DELTA) {
      // risky password: "too guessable"
      return 0
    }
    if (guesses < scoringOptions[1] + DELTA) {
      // modest protection from throttled online attacks: "very guessable"
      return 1
    }
    if (guesses < scoringOptions[2] + DELTA) {
      // modest protection from unthrottled online attacks: "somewhat guessable"
      return 2
    }
    if (guesses < scoringOptions[3] + DELTA) {
      // modest protection from offline attacks: "safely unguessable"
      // assuming a salted, slow hash function like bcrypt, scrypt, PBKDF2, argon, etc
      return 3
    }
    // strong protection from offline attacks under same scenario: "very unguessable"
    return 4
  }

  private displayTime(seconds: number) {
    let displayStr = 'centuries'
    let base
    const timeKeys = Object.keys(times)
    const foundIndex = timeKeys.findIndex(
      (time) => seconds < times[time as keyof typeof times],
    )
    if (foundIndex > -1) {
      displayStr = timeKeys[foundIndex - 1]
      if (foundIndex !== 0) {
        base = Math.round(seconds / times[displayStr as keyof typeof times])
      } else {
        displayStr = 'ltSecond'
      }
    }
    return this.translate(displayStr, base)
  }

  private translate(displayStr: string, value: number | undefined) {
    let key = displayStr
    if (value !== undefined && value !== 1) {
      key += 's'
    }
    const { timeEstimation } = this.options.translations
    return timeEstimation[key as keyof typeof timeEstimation].replace(
      '{base}',
      `${value}`,
    )
  }
}
