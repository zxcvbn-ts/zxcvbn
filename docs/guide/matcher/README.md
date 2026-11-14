# Matcher

The @zxcvbn-ts/core library provides built-in matchers to evaluate the strength of a password. 
Custom matchers can also be created, including asynchronous matchers such as the pwned-matcher which can be found in the [@zxcvbn-ts/matcher-pwned](https://www.npmjs.com/package/@zxcvbn-ts/matcher-pwned) library. 
When using an asynchronous custom matcher, the `checkAsync` method should be used.

## Built-in Matchers
There are several built-in matchers available:

### Bruteforce

The bruteforce matcher is used to determine if a password can be guessed by brute force. This will be the last matcher used when evaluating password strength.

### Date

The date matcher searches for dates in the format YYYY-MM-DD or dates without separators.

### Dictionary

The dictionary matcher attempts to find a word inside one of the provided dictionaries. 
There are multiple variants of this matcher:

1. Plain: searches for the exact word in the dictionaries
2. Reverse: reverses the password and searches the dictionaries
3. L33t: transforms l33t speak to normal characters and searches the dictionaries. This includes transforming extended l33t speak like |_| => u.
4. Diceware: If the password is found in the diceware dictionary, a fixed score is assigned to this finding.

### Regex

The regex matcher searches for a string using a regex pattern. Currently, it only searches for recent years.

### Repeat

The repeat matcher searches for repeated patterns like aaaaaaa or byebyebye.

### Sequence

The sequence matcher identifies sequences by looking for repeated differences in Unicode codepoints, for example, abcdef or 1234567.

### Spatial

The spatial matcher searches for patterns based on keyboard layout, for example, qwertz.

### Separator

The separator matcher searches for common separators like a space or a hyphen

### Word sequence matcher

The word sequence matcher is a combination of the sequence matcher and the dictionary matcher. It searches for sequences of words in a specific topic like months. User inputs are treated as such a topic as well, so a password like `HansFlorianZimmer` or `hans.zimmer` for a user named Hans Florian Zimmer is matched as a single sequence, as long as `hans`, `florian` and `zimmer` are passed as separate user inputs.

## Custom Matcher

Custom matchers can be created if needed, including asynchronous matchers. An asynchronous matcher requires `checkAsync`, and if it runs while the user types, the check should be [debounced](../examples/#debounce).
The types used below are described on the [TypeScript page](../typescript/).

### Creating a Custom Matcher

Here is an example of how to create a custom matcher to check for minimum password length. Please note that we do not recommend using a minimum length matcher.

```ts
import {
  ZxcvbnFactory,
  Matcher,
  MatcherBaseClass,
  MatchEstimated,
  MatchExtended,
  MatchOptions,
  Options,
} from '@zxcvbn-ts/core'

class MatchMinLength extends MatcherBaseClass {
  minLength = 10

  match({ password }: MatchOptions) {
    const matches: MatchExtended[] = []
    if (password.length <= this.minLength) {
      matches.push({
        pattern: 'minLength',
        token: password,
        i: 0,
        j: password.length - 1,
      })
    }
    return matches
  }
}

const minLengthMatcher: Matcher = {
  Matching: MatchMinLength,
  feedback(options: Options, match: MatchEstimated, isSoleMatch?: boolean) {
    return {
      warning: 'Your password is not long enough',
      suggestions: [],
    }
  },
  scoring(match: MatchExtended | MatchEstimated, options: Options) {
    // The length of the password is multiplied by 10 to create a higher score the more characters are added.
    return match.token.length * 10
  },
}

const options = {
  // your options
}

new ZxcvbnFactory(options, {
  minLength: minLengthMatcher,
})
```

The `Matching` class must extend `MatcherBaseClass`. It is instantiated with the factory's `Options`, which are available as `this.options`.
Its `match` method receives a `MatchOptions` object (`password`, `omniMatch`, `userInputsOptions`) and returns an array of matched tokens, or a promise of one for an async matcher.
`userInputsOptions.wordIndex` holds the user inputs, and `this.options.wordIndex` holds the words of all dictionaries. The old `userInputsOptions.rankedDictionary`, `rankedDictionaryMaxWordSize`, `options.rankedDictionaries` and `options.rankedDictionariesMaxWordSize` are deprecated. They are only built when read and will be removed in the next major version.
The four default properties (pattern, token, i, and j) are mandatory but the object can be extended as needed.
`pattern` is the name of the matcher that found the token
`token` is the part of the password that was found by the matcher
`i` is the start index of the token inside the password
`j` is the end index of the token inside the password

For example, if the repeat matcher found the following string: suchARandomRandomPassword, the result would be:
```
i = 5
j = 16
token = RandomRandom
```
The found token starts at character 5 and ends at character 16.

The scoring function is called once for each match you returned in the matching function, with the match and the factory's `Options`. It should return a guess count for that token, which represents how many guesses an attacker would need to make to correctly guess it.
If you need any additional data to calculate your scoring, feel free to add it to the Match object in the matching function.

The feedback function is only called when the score is 2 or lower and your match is the longest one in the password. It receives the factory's `Options`, the match and whether it is the only match of the password. It should return a Feedback object (`{ warning: string | null, suggestions: string[] }`) or `null`. Use `options.translations` if your feedback should be translated.


## Matcher libraries

There are different matcher libraries that can extend the core matchers. One such library is:

### @zxcvbn-ts/matcher-pwned
The pwned matcher is an async matcher that makes a k-anonymity password request to the [Have I Been Pwned](https://haveibeenpwned.com/) API to check if the password has been exposed in a data breach.
See the [pwned matcher page](../pwned-matcher/) for its options, its error handling and why it should not run on every keystroke.
