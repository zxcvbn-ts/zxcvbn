import {
  OptionsL33tTable,
  OptionsDictionary,
  OptionsGraph,
  Matcher,
  TranslationKeys,
  TimeEstimationValues,
} from './types'
import translationKeys from './data/translationKeys'
import { timeEstimationValuesDefaults } from './TimeEstimates'

export const checkL33tTable = (l33tTable: OptionsL33tTable) => {
  if (typeof l33tTable !== 'object' || l33tTable === null) {
    throw new Error('l33tTable must be an object')
  }
  Object.values(l33tTable).forEach((substitutions) => {
    if (!Array.isArray(substitutions)) {
      throw new Error('l33tTable substitutions must be an array')
    }
    substitutions.forEach((substitution) => {
      if (typeof substitution !== 'string') {
        throw new Error('l33tTable substitutions must be strings')
      }
    })
  })
}

export const checkDictionary = (dictionary: OptionsDictionary) => {
  if (typeof dictionary !== 'object' || dictionary === null) {
    throw new Error('dictionary must be an object')
  }
  Object.values(dictionary).forEach((list) => {
    if (!Array.isArray(list)) {
      throw new Error('dictionary list must be an array')
    }
    list.forEach((el) => {
      if (typeof el !== 'string' && typeof el !== 'number') {
        throw new Error('dictionary entries must be strings or numbers')
      }
    })
  })
}

export const checkGraphs = (graphs: OptionsGraph) => {
  if (typeof graphs !== 'object' || graphs === null) {
    throw new Error('graphs must be an object')
  }
  Object.values(graphs).forEach((graph) => {
    if (typeof graph !== 'object' || graph === null) {
      throw new Error('graph must be an object')
    }
    Object.values(graph).forEach((adjacencies) => {
      if (!Array.isArray(adjacencies)) {
        throw new Error('graph adjacencies must be an array')
      }
      adjacencies.forEach((adjacency) => {
        if (typeof adjacency !== 'string' && adjacency !== null) {
          throw new Error('graph adjacency must be a string or null')
        }
      })
    })
  })
}

export const checkUseLevenshteinDistance = (useLevenshteinDistance: any) => {
  if (typeof useLevenshteinDistance !== 'boolean') {
    throw new Error('useLevenshteinDistance must be a boolean')
  }
}

export const checkLevenshteinThreshold = (levenshteinThreshold: any) => {
  if (typeof levenshteinThreshold !== 'number' || levenshteinThreshold < 0) {
    throw new Error('levenshteinThreshold must be a non-negative number')
  }
}

export const checkL33tMaxSubstitutions = (l33tMaxSubstitutions: any) => {
  if (typeof l33tMaxSubstitutions !== 'number' || l33tMaxSubstitutions < 0) {
    throw new Error('l33tMaxSubstitutions must be a non-negative number')
  }
}

export const checkMaxLength = (maxLength: any) => {
  if (typeof maxLength !== 'number' || maxLength < 0) {
    throw new Error('maxLength must be a non-negative number')
  }
}

export const checkMatcher = (name: string, matcher: Matcher) => {
  if (typeof name !== 'string') {
    throw new Error('matcher name must be a string')
  }
  if (typeof matcher !== 'object' || matcher === null) {
    throw new Error(`matcher ${name} must be an object`)
  }
  if (typeof matcher.feedback !== 'function') {
    throw new Error(`matcher ${name}.feedback must be a function`)
  }
  if (typeof matcher.scoring !== 'function') {
    throw new Error(`matcher ${name}.scoring must be a function`)
  }
  if (typeof matcher.Matching !== 'function') {
    throw new Error(`matcher ${name}.Matching must be a constructor`)
  }
}

export const checkCustomMatchers = (customMatchers: any) => {
  if (typeof customMatchers !== 'object' || customMatchers === null) {
    throw new Error('customMatchers must be an object')
  }
}

export const checkCustomTranslations = (translations: TranslationKeys) => {
  let valid = true
  Object.keys(translationKeys).forEach((type) => {
    if (type in translations) {
      const translationType = type as keyof typeof translationKeys
      Object.keys(translationKeys[translationType]).forEach((key) => {
        if (!(key in translations[translationType])) {
          valid = false
        }
        const translation = (translations[translationType] as any)[key]
        if (
          typeof translation !== 'string' &&
          typeof translation !== 'function'
        ) {
          valid = false
        }
      })
    } else {
      valid = false
    }
  })
  return valid
}

export const checkTimeEstimationValues = (
  timeEstimationValues: TimeEstimationValues,
) => {
  if (
    typeof timeEstimationValues !== 'object' ||
    timeEstimationValues === null
  ) {
    throw new Error('timeEstimationValues must be an object')
  }
  Object.keys(timeEstimationValuesDefaults).forEach((key) => {
    if (!(key in timeEstimationValues)) {
      throw new Error(`timeEstimationValues.${key} is required`)
    }
    const data = timeEstimationValues[key as keyof TimeEstimationValues]
    if (typeof data !== 'object' || data === null) {
      throw new Error(`timeEstimationValues.${key} must be an object`)
    }
    Object.keys(
      timeEstimationValuesDefaults[key as keyof TimeEstimationValues],
    ).forEach((subKey) => {
      if (!(subKey in data)) {
        throw new Error(`timeEstimationValues.${key}.${subKey} is required`)
      }
      const value = (data as any)[subKey]
      if (typeof value !== 'number') {
        throw new Error(
          `timeEstimationValues.${key}.${subKey} must be a number`,
        )
      }
      if (
        value <
        (
          timeEstimationValuesDefaults[key as keyof TimeEstimationValues] as any
        )[subKey]
      ) {
        throw new Error(
          'Time estimation values are not to be allowed to be less than default',
        )
      }
    })
  })
}
