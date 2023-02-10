import { zxcvbnOptions } from './Options'
import { CrackTimesDisplay, CrackTimesSeconds, Score } from './types'

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

/*
 * -------------------------------------------------------------------------------
 *  Estimates time for an attacker ---------------------------------------------------------------
 * -------------------------------------------------------------------------------
 */
class TimeEstimates {
  translate(displayStr: string, value: number | undefined) {
    let key = displayStr
    if (value !== undefined && value !== 1) {
      key += 's'
    }
    const { timeEstimation } = zxcvbnOptions.translations
    return timeEstimation[key as keyof typeof timeEstimation].replace(
      '{base}',
      `${value}`,
    )
  }

  estimateAttackTimes(guesses: number) {
    const crackTimesSeconds: CrackTimesSeconds = {
      onlineThrottling100PerHour: guesses / (100 / 3600),
      onlineNoThrottling10PerSecond: guesses / 10,
      offlineSlowHashing1e4PerSecond: guesses / 1e4,
      offlineFastHashing1e10PerSecond: guesses / 1e10,
    }
    const crackTimesDisplay: CrackTimesDisplay = {
      onlineThrottling100PerHour: '',
      onlineNoThrottling10PerSecond: '',
      offlineSlowHashing1e4PerSecond: '',
      offlineFastHashing1e10PerSecond: '',
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

  guessesToScore(guesses: number): Score {
    const DELTA = 5
    if (guesses < 1e3 + DELTA) {
      // risky password: "too guessable"
      return 0
    }
    if (guesses < 1e6 + DELTA) {
      // modest protection from throttled online attacks: "very guessable"
      return 1
    }
    if (guesses < 1e8 + DELTA) {
      // modest protection from unthrottled online attacks: "somewhat guessable"
      return 2
    }
    if (guesses < 1e10 + DELTA) {
      // modest protection from offline attacks: "safely unguessable"
      // assuming a salted, slow hash function like bcrypt, scrypt, PBKDF2, argon, etc
      return 3
    }
    // strong protection from offline attacks under same scenario: "very unguessable"
    return 4
  }

  displayTime(seconds: number) {
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
}

export default TimeEstimates
