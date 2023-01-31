# Matcher

There are multiple build in matchers to identify the strength of a password. All build in matchers are sync but custom matcher have the possibility to be async.
Therefor if you are using an async custom matcher you need to use the `zxcvbnAsync` function.

## bruteforce

The bruteforce is the matcher that needs to be used last, in order to check if the password can be guessed by brute force

## date

The date matcher tries to find dates inside a password for example 2020-05-05 or dates without separators.

## dictionary

The dictionary matcher tries to find a word inside one of the dictionaries that you provided from the language packages or by yourself.
There are three variants of it.

1. Plain: It will just search for the exact word in the dictionaries
2. Reverse: It will reverse the password and search the dictionaries
3. L33t: It will transform l33t speak to normal characters and search the dictionaries for example `P4$$w0rd` will be transformed to `Password`

## regex

The regex matcher tries to find a string by a regex. Currently, it is only one regex with the recent years

## repeat

The repeat matcher tries to find repeated patterns like `aaaaaaa` or `byebyebye`

## sequence

The sequence matcher tries to identify sequences by looking for repeated differences in unicode codepoint for example `abcdef` or `1234567`

## spatial

The spatial matcher tries to find patterns from keyboard layout for example `qwertz`

## custom

You can create matcher if you need which can be async. If you create an async matcher you should debounce the function. For this you can use the included debounce function

### create a custom matcher

This is an example to create a custom matcher to check for the minLength. The scoring is just for showing purpose and should be adjusted to your needs.
Be aware that we don't recommend using a minLength matcher.

```ts
import { zxcvbnOptions } from '@zxcvbn-ts/core'
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
      warning: 'You password is not long enough',
      suggestions: [],
    }
  },
  scoring(match: ExtendedMatch) {
    // this will take the length of the password and multiple it by 10
    // to create a higher scoring the more characters are added
    return match.token.length * 10
  },
}

zxcvbnOptions.addMatcher('minLength', minLengthMatcher)
```

The Matching function needs to return an array with matched tokens. The four default properties are mandatory but the object can be extended as pleased.
`pattern` is the name of the matcher that found the token
`token` is the part of the password was found with the matcher
`i` is the start index of the token inside the password
`j` is the end index of the token inside the password

For example for the repeat matcher we have this string: `suchARandomRandomPassword`.
This would result in:
```
i = 5
j = 16
token = RandomRandom
```
The found token starts at character 5 and ends at character 16.

The scoring function will get the array of matches that you returned in the matching function so if you need any additional data to calculate your scoring feel free to add it to the matching object.
The scoring function should return a guess count which seems appropriate for you. The guess count means how often an attacker would need to get the password.

The feedback function is used to give the user feedback about the found token of your matcher. It can have a warning and multiple suggestions.


## Matcher libraries

There are different matcher libraries that can extend the core matchers

### @zxcvbn-ts/matcher-pwned 
The pwned matcher is an async matcher that will make a k-anonymity password request to the [have i been pwned](https://haveibeenpwned.com/) api. 
If you bind zxcvbn-ts to your input field and execute the function on every new character typed, be sure to use the provided debounce function.
