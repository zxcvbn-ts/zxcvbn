# Matcher

There are multiple build in matchers to identify the strength of a password.

## bruteforce
The bruteforce matcher is the last matcher to check if parts of the password can be guessed by brute force

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
You can create/edit/remove matcher as you need needs.

### create a custom matcher
This is an example to create a custom matcher to check for the minLength. The scoring is just for showing purpose and should be adjusted to your need. 
We don't recommend using a minLength matcher

```ts
import { ZxcvbnOptions } from '@zxcvbn-ts/core'
import { MatchEstimated, ExtendedMatch } from '@zxcvbn-ts/core/dist/types'

ZxcvbnOptions.matchers.minLength = {
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
      return sorted(matches)
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
    return match.password.length * 10
  },
}
```

### edit
If you don't like how a current matcher works you could theoretically edit it which is not recommended. It would be better to raise an issue in the repository.

```ts
import { ZxcvbnOptions } from '@zxcvbn-ts/core'
import { ExtendedMatch } from '@zxcvbn-ts/core/dist/types'

ZxcvbnOptions.matchers.repeat.scoring = (match: ExtendedMatch) => {
  return baseGuesses * repeatCount + 5
}

```


### remove
If you don't like one of the matchers you could theoretically remove it which is not recommended.

```ts
import { ZxcvbnOptions } from '@zxcvbn-ts/core'

delete ZxcvbnOptions.matchers.repeat

```
