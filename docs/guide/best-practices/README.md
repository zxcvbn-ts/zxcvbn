# Best Practices
For optimal scoring results, we recommend always including both the common and English language packages. If a language package is available for your specific language, import that as well. If your language is missing, feel free to contribute by opening a pull request (PR). In the meantime, you can extend the default set.

## Language Dictionaries
To achieve robust password strength scoring, we suggest using the dictionaries for English, common words, and the user’s language (if available). These dictionaries ensure that passwords are compared against a comprehensive set of words for more accurate scoring.

## Levenshtein Distance
Enable the Levenshtein distance calculation to better identify variations of words within dictionaries. This helps catch slight modifications to common words that might otherwise go undetected (e.g., password vs. p@ssw0rd).

## Pwned Password Matcher
The Pwned Matcher should be used to check passwords against databases of leaked or compromised passwords. This informs users if their password has already been exposed in previous data breaches.

## User Input Context
Incorporate a user inputs dictionary to check passwords against personal information, such as the user's name, email address, or other relevant data. Additionally, include application-specific context where the password is being used. For instance, if the application relates to animals, you can add relevant keywords (e.g., "dog," "cat," "pet") to the dictionary for more effective matching. Custom dictionaries can be as large as needed; for instance, the password dictionary alone can reach nearly 400 KB in size.

## Lazy Loading
Since language dictionaries can be large, they should only be loaded when necessary—specifically, when a user navigates to a page with a password input field. Use lazy loading techniques to minimize unnecessary data usage and improve performance.

## Example Implementation
When following all the best practices, your implementation might look something like this:

```typescript
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import { matcherPwnedFactory } from '@zxcvbn-ts/matcher-pwned'

const loadOptions = async () => {
  // common has some dictionaries which are not bound the any real language like a password list
  const zxcvbnCommonPackage = await import(
    /* webpackChunkName: "zxcvbnCommonPackage" */ '@zxcvbn-ts/language-common'
    )
  // As english is the language of the world it should always be included
  const zxcvbnEnPackage = await import(
    /* webpackChunkName: "zxcvbnEnPackage" */ '@zxcvbn-ts/language-en'
    )
  // The primary language of your website should align with the language predominantly used by your user base.
  const zxcvbnDePackage = await import(
    /* webpackChunkName: "zxcvbnDePackage" */ '@zxcvbn-ts/language-de'
    )

  return {
    translations: zxcvbnePackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
      ...zxcvbnDePackage.dictionary
      // Enhance the dictionary search by adding custom-defined keywords to a personalized dictionary, enabling seamless and consistent searches for application-wide terms.
      userInputs: ['MrWook', 'zxcvbn-ts', 'vuepress', 'npm', 'github', 'typescript']
    },
    useLevenshtein: true,
  }
}

const customMatcher = {
  pwned: matcherPwnedFactory(fetch)
}
const options = await loadOptions()
const zxcvbn = new ZxcvbnFactory(options, customMatcher)

zxcvbn.checkAsync('thePasswordInUse', ['username', 'user email', 'other dynamic user content'])
```

