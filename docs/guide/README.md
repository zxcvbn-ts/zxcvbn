# Introduction

**zxcvbn** is a password strength estimator inspired by password crackers.
It recognizes and analyzes over 40 thousand common passwords using pattern matching and conservative estimation and
filters out common first names, last names, popular words from Wikipedia and common words in many cultures,
and recognizes common patterns like dates, repetitions (e.g. 'aaa'), sequences (e.g. 'abcd'), keyboard smashes (e.g. 'qwertyuiop'), and l33t speak.

Consider using **zxcvbn** as an algorithmic alternative to password composition policy — it is more secure,
flexible, and convenient in websites that require a minimal complexity score.

- More secure: policies often fail, allowing weak passwords (P@ssword1) and blocking strong passwords.
- More flexible: **zxcvbn** allows many password styles to flourish as long as sufficient complexity is provided, i.e.
  passphrases are rated highly given enough uncommon words, keyboard patterns are ranked based on length and number of repetitions,
  and capitalization adds more complexity when it's _unpredictaBle_.
- More convenient: **zxcvbn** is designed to power simple, rule-free interfaces that give instant feedback.
  Additionally, **zxcvbn** includes minimal, targeted, verbose feedback that can help guide users towards more complex passwords.
  For more details, please refer to the USENIX Security '16 [paper and presentation](https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/wheeler).

This is a complete rewrite of [zxcvbn](https://github.com/dropbox/zxcvbn) in TypeScript
which is licensed under the [MIT](https://github.com/dropbox/zxcvbn/blob/master/LICENSE.txt) license.
Thanks to the original creators [dropbox](https://github.com/dropbox) for their great work.

## Other implementation

- [`zxcvbn`](https://github.com/dropbox/zxcvbn) (Original JS)
- [`zxcvbn-python`](https://github.com/dwolfhub/zxcvbn-python) (Python)
- [`zxcvbn-cpp`](https://github.com/rianhunter/zxcvbn-cpp) (C/C++/Python/JS)
- [`zxcvbn-c`](https://github.com/tsyrogit/zxcvbn-c) (C/C++)
- [`zxcvbn-rs`](https://github.com/shssoichiro/zxcvbn-rs) (Rust)
- [`zxcvbn-go`](https://github.com/nbutton23/zxcvbn-go) (Go)
- [`zxcvbn4j`](https://github.com/nulab/zxcvbn4j) (Java)
- [`nbvcxz`](https://github.com/GoSimpleLLC/nbvcxz) (Java)
- [`zxcvbn-ruby`](https://github.com/envato/zxcvbn-ruby) (Ruby)
- [`zxcvbn-js`](https://github.com/bitzesty/zxcvbn-js) (Ruby [via ExecJS])
- [`zxcvbn-ios`](https://github.com/dropbox/zxcvbn-ios) (Objective-C)
- [`zxcvbn-cs`](https://github.com/mickford/zxcvbn-cs) (C#/.NET)
- [`szxcvbn`](https://github.com/tekul/szxcvbn) (Scala)
- [`zxcvbn-php`](https://github.com/bjeavons/zxcvbn-php) (PHP)
- [`zxcvbn-api`](https://github.com/wcjr/zxcvbn-api) (REST)
- [`ocaml-zxcvbn`](https://github.com/cryptosense/ocaml-zxcvbn) (OCaml bindings for `zxcvbn-c`)

## Performance

**zxcvbn** operates below human perception of delay for most input: ~5-20ms for ~25 character passwords on modern browsers/CPUs, ~100ms for passwords around 100 characters.
To curb runtime latency for really long passwords, consider sending `zxcvbn()` only the first 100 characters or so of user input. 
For security reasons a limit was implemented for 256 characters by default but can be customized it with `maxLength`.
