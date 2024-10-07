# Matcher

The @zxcvbn-ts/core library provides built-in matchers to evaluate the strength of a password. 
Custom matchers can also be created, including asynchronous matchers such as the pwned-matcher which can be found in the [@zxcvbn-ts/matcher-pwned](https://www.npmjs.com/package/@zxcvbn-ts/matcher-pwned) library. 
When using an asynchronous custom matcher, the zxcvbnAsync function should be used.

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

## Custom Matcher

Custom matchers can be created if needed, including asynchronous matchers. If creating an asynchronous matcher, the function should be debounced using the included debounce function.

### Creating a Custom Matcher

Here is an example of how to create a custom matcher to check for minimum password length. Please note that we do not recommend using a minimum length matcher.

```ts
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import {
  MatchEstimated,
  ExtendedMatch,
  Matcher,
  Match,
} from '@zxcvbn-ts/core/dist/types'

const minLengthMatcher: Matcher = {
  Matching: class MatchMinLength {
    minLength = 10

    match({ password }: { password: string }) {
      const matches: Match[] = []
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
  },
  feedback(match: MatchEstimated, isSoleMatch: boolean) {
    return {
      warning: 'Your password is not long enough',
      suggestions: [],
    }
  },
  scoring(match: ExtendedMatch) {
    // The length of the password is multiplied by 10 to create a higher score the more characters are added.
    return match.token.length * 10
  },
}

new ZxcvbnFactory(options, {
  'minLength': minLengthMatcher
})
```

The Matching function needs to return an array of matched tokens. The four default properties (pattern, token, i, and j) are mandatory but the object can be extended as needed.
`pattern` is the name of the matcher that found the token
`token` is the part of the password was found with the matcher
`i` is the start index of the token inside the password
`j` is the end index of the token inside the password

For example, if the repeat matcher found the following string: suchARandomRandomPassword, the result would be:
```
i = 5
j = 16
token = RandomRandom
```
The found token starts at character 5 and ends at character 16.

The scoring function takes the array of matches that you returned in the matching function as input and should return a guess count, which represents how many guesses an attacker would need to make to correctly guess the password. The guess count should be based on the strength of the password and the matches found.
If you need any additional data to calculate your scoring, feel free to add it to the Match object in the matching function.

The feedback function takes a single Match object as input and should return a Feedback object that provides feedback to the user about the match. The Feedback object can have a warning and multiple suggestions.


## Matcher libraries

There are different matcher libraries that can extend the core matchers. One such library is:

### @zxcvbn-ts/matcher-pwned
The pwned matcher is an async matcher that makes a k-anonymity password request to the [have i been pwned](https://haveibeenpwned.com/) API to check if the password has been exposed in a data breach.

If you bind zxcvbn-ts to your input field and execute the function on every new character typed, be sure to use the provided debounce function to avoid making too many API requests.
