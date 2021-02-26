# Introduction

zxcvbn is a password strength estimator inspired by password crackers.
Through pattern matching and conservative estimation,
it recognizes and weighs 40k common passwords,
common names surnames, popular words from Wikipedia and common word in different language from different countries,
and other common patterns like dates, repeats (aaa), sequences (abcd), keyboard patterns (qwertyuiop), and l33t speak.

Consider using zxcvbn as an algorithmic alternative to password composition policy — it is more secure,
flexible, and usable when sites require a minimal complexity score in place of annoying rules like "passwords must contain three of {lower, upper, numbers, symbols}".

- More secure: policies often fail both ways, allowing weak passwords (P@ssword1) and disallowing strong passwords.
- More flexible: zxcvbn allows many password styles to flourish so long as it detects sufficient complexity — passphrases are rated highly given enough uncommon words, keyboard patterns are ranked based on length and number of turns, and capitalization adds more complexity when it's unpredictaBle.
- More usable: zxcvbn is designed to power simple, rule-free interfaces that give instant feedback. In addition to strength estimation, zxcvbn includes minimal, targeted verbal feedback that can help guide users towards less guessable passwords.
For further detail and motivation, please refer to the USENIX Security '16 [paper and presentation](https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/wheeler).

This is a complete rewrite of [zxcvbn](https://github.com/dropbox/zxcvbn) into typescript
which is licensed under the [MIT](https://github.com/dropbox/zxcvbn/blob/master/LICENSE.txt) license.
Thanks to the original creators [dropbox](https://github.com/dropbox) for the great work.


## Other implementation

* [`zxcvbn`](https://github.com/dropbox/zxcvbn) (Original JS)
* [`zxcvbn-python`](https://github.com/dwolfhub/zxcvbn-python) (Python)
* [`zxcvbn-cpp`](https://github.com/rianhunter/zxcvbn-cpp) (C/C++/Python/JS)
* [`zxcvbn-c`](https://github.com/tsyrogit/zxcvbn-c) (C/C++)
* [`zxcvbn-rs`](https://github.com/shssoichiro/zxcvbn-rs) (Rust)
* [`zxcvbn-go`](https://github.com/nbutton23/zxcvbn-go) (Go)
* [`zxcvbn4j`](https://github.com/nulab/zxcvbn4j) (Java)
* [`nbvcxz`](https://github.com/GoSimpleLLC/nbvcxz) (Java)
* [`zxcvbn-ruby`](https://github.com/envato/zxcvbn-ruby) (Ruby)
* [`zxcvbn-js`](https://github.com/bitzesty/zxcvbn-js) (Ruby [via ExecJS])
* [`zxcvbn-ios`](https://github.com/dropbox/zxcvbn-ios) (Objective-C)
* [`zxcvbn-cs`](https://github.com/mickford/zxcvbn-cs) (C#/.NET)
* [`szxcvbn`](https://github.com/tekul/szxcvbn) (Scala)
* [`zxcvbn-php`](https://github.com/bjeavons/zxcvbn-php) (PHP)
* [`zxcvbn-api`](https://github.com/wcjr/zxcvbn-api) (REST)
* [`ocaml-zxcvbn`](https://github.com/cryptosense/ocaml-zxcvbn) (OCaml bindings for `zxcvbn-c`)


## Performance

zxcvbn operates below human perception of delay for most input: ~5-20ms for ~25 char passwords on modern browsers/CPUs, ~100ms for passwords around 100 characters. 
To bound runtime latency for really long passwords, consider sending `zxcvbn()` only the first 100 characters or so of user input.
