# TypeScript

All packages are written in TypeScript and ship their own type definitions, so there is nothing extra to install.
The types are exported from `@zxcvbn-ts/core`; import them with `import type` so they don't end up in your bundle.

```ts
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import type { OptionsType, ZxcvbnResult } from '@zxcvbn-ts/core'

const options: OptionsType = {
  // ...
}
const zxcvbn = new ZxcvbnFactory(options)

const result: ZxcvbnResult = zxcvbn.check(password)
```

## Options and result

| Type                   | Description                                                                                                         |
|------------------------|---------------------------------------------------------------------------------------------------------------------|
| `OptionsType`          | The first parameter of `ZxcvbnFactory`, see [options](../options/).                                                 |
| `TranslationKeys`      | The shape of the `translations` option, see [translation keys](../languages/#translation-keys).                    |
| `TimeEstimationValues` | The shape of the `timeEstimationValues` option.                                                                     |
| `OptionsDictionary`    | The shape of the `dictionary` option: `Record<string, (string \| number)[]>`.                                       |
| `OptionsGraph`         | The shape of the `graphs` option.                                                                                   |
| `OptionsL33tTable`     | The shape of the `l33tTable` option.                                                                                |
| `ZxcvbnResult`         | The return value of `check` and the resolved value of `checkAsync`, see [output](../getting-started/#output).       |
| `Score`                | `0 \| 1 \| 2 \| 3 \| 4`                                                                                             |
| `FeedbackType`         | `{ warning: string \| null, suggestions: string[] }`, the `feedback` of the result.                                 |
| `CrackTimes`           | The `crackTimes` of the result, one `CrackTime` (`{ base, seconds, display }`) per attack scenario.                 |

## Matches

`result.sequence` is an array of `MatchExtended`, a union of the match types of the built-in matchers.
Each has the base properties of `Match` (`pattern`, `token`, `i`, `j`) and properties of its own. Check `pattern` to narrow the type:

```ts
import type { DateMatch, MatchExtended } from '@zxcvbn-ts/core'

const isDateMatch = (match: MatchExtended): match is DateMatch =>
  match.pattern === 'date'

const dates = result.sequence.filter(isDateMatch).map((match) => match.year)
```

| Type                                                                                                                                                 | Description                                                                                       |
|------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `Match`                                                                                                                                              | The base properties every match has.                                                              |
| `DictionaryMatch`, `L33tMatch`, `SpatialMatch`, `RepeatMatch`, `SequenceMatch`, `WordSequenceMatch`, `RegexMatch`, `DateMatch`, `BruteForceMatch`, `SeparatorMatch` | The matches of the [built-in matchers](../matcher/#built-in-matchers).                      |
| `MatchExtended`                                                                                                                                      | The union of all of them; it also includes `Match`, so matches of custom matchers fit in.        |
| `MatchEstimated`                                                                                                                                     | A `MatchExtended` after scoring, with `guesses` and `guessesLog10`.                               |
| `Pattern`                                                                                                                                            | The `pattern` names of the built-in matchers, or any string for custom matchers.                  |

## Custom matchers

These are the types for writing your own [custom matcher](../matcher/#custom-matcher):

| Type                       | Description                                                                                                              |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------|
| `Matcher`                  | The object you pass in the second parameter of `ZxcvbnFactory`: `{ Matching, feedback, scoring }`.                      |
| `MatcherBaseClass`         | The abstract class the `Matching` class has to extend. It gets the `Options` instance as `this.options`.                |
| `MatchOptions`             | The parameter of `match`: `password`, `omniMatch` (to run the other matchers, like the repeat matcher does) and `userInputsOptions`. |
| `MatcherConstructor`       | The type of `Matching`.                                                                                                  |
| `DefaultFeedbackFunction`  | The type of `feedback`.                                                                                                  |
| `DefaultScoringFunction`   | The type of `scoring`.                                                                                                   |
| `Options`                  | The class holding the processed options (exported as a value, not only a type). `feedback` and `scoring` receive it.    |

```ts
import { MatcherBaseClass } from '@zxcvbn-ts/core'
import type { Matcher, MatchExtended, MatchOptions } from '@zxcvbn-ts/core'

class MatchCompanyName extends MatcherBaseClass {
  match({ password }: MatchOptions): MatchExtended[] {
    // ...
    return []
  }
}

const companyNameMatcher: Matcher = {
  Matching: MatchCompanyName,
  feedback: (options, match) => ({ warning: 'Avoid the company name', suggestions: [] }),
  scoring: (match) => match.token.length,
}
```
