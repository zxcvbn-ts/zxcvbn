# Best Practices
For optimal scoring results, we recommend always including both the common and English language packages. If a language package is available for your specific language, import that as well. If your language is missing, feel free to contribute by opening a pull request (PR). In the meantime, you can extend the default set.

## Language Dictionaries
To achieve robust password strength scoring, we suggest using the dictionaries for English, common words, and the user’s language (if available). These dictionaries ensure that passwords are compared against a comprehensive set of words for more accurate scoring.

## Levenshtein Distance
Enable the Levenshtein distance calculation to better identify variations of words within dictionaries. This helps catch slight modifications to common words that might otherwise go undetected (e.g., `password` vs. `passwrod`). Substitutions like `p@ssw0rd` are already handled by the l33t matcher.

## Pwned Password Matcher
The [pwned matcher](../pwned-matcher/) should be used to check passwords against databases of leaked or compromised passwords. This informs users if their password has already been exposed in previous data breaches.

## User Input Context
Incorporate a user inputs dictionary to check passwords against personal information, such as the user's name, email address, or other relevant data. Additionally, include application-specific context where the password is being used. For instance, if the application relates to animals, you can add relevant keywords (e.g., "dog," "cat," "pet") to the dictionary for more effective matching. Custom dictionaries can be as large as needed; for instance, the password dictionary alone can reach nearly 400 KB in size.

## Lazy Loading
Since language dictionaries can be large, they should only be loaded when necessary—specifically, when a user navigates to a page with a password input field. Use [lazy loading](../lazy-loading/) to minimize unnecessary data usage and improve performance.

## Example Implementation
The [recommended setup](../getting-started/#recommended-setup) follows all of these practices: the common, English and user language dictionaries, the keyboard layouts, the Levenshtein distance check, the pwned matcher and user inputs passed with every check.
To lazy load its dictionaries, build the options as shown in [lazy loading](../lazy-loading/).
