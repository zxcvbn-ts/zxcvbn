# Third-party data and licenses

## OpenSubtitles via OPUS

`src/commonWords.json` is derived from OpenSubtitles 2024 frequency data
provided via [OPUS](https://opus.nlpl.eu/datasets/OpenSubtitles). The source
dataset is licensed under the [Open Data Commons Attribution License (ODC-BY)
1.0](https://opendatacommons.org/licenses/by/1-0/). See [NOTICE.md](./NOTICE.md)
for attribution and details about the processed derivative.

## FakerJS

`src/firstnames.json` and `src/lastnames.json` contain transliterated data from
the Russian locale files in [FakerJS revision
3b184d6e52a721c227c6e9c58731bdf008f43532](https://github.com/faker-js/faker/tree/3b184d6e52a721c227c6e9c58731bdf008f43532).
The upstream project is licensed under the MIT License:

```text
Faker - Copyright (c) 2022-2025

This software consists of voluntary contributions made by many individuals.
For exact contribution history, see the revision history
available at https://github.com/faker-js/faker

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

===

From: https://github.com/faker-js/faker/commit/a9f98046c7d5eeaabe12fc587024c06d683800b8
To: https://github.com/faker-js/faker/commit/29234378807c4141588861f69421bf20b5ac635e

Based on faker.js, copyright Marak Squires and contributor, what follows below is the original license.

===

faker.js - Copyright (c) 2011-2020
Marak Squires
http://github.com/marak/faker.js/

faker.js was inspired by and has used data definitions from:

 * https://github.com/stympy/faker/ - Copyright (c) 2007-2010 Benjamin Curtis
 * http://search.cpan.org/~jasonk/Data-Faker-0.07/ - Copyright 2004-2005 by Jason Kohles

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## Scope of this notice update

This file documents the OpenSubtitles-derived common-word list and the FakerJS-derived name lists. The package also contains a `wikipedia.json` token list; its source revision and applicable attribution should be audited separately. This document does not relicense that list.
