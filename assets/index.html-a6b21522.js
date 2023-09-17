import{_ as i,r as t,o as l,c as r,b as n,d as e,a as o,e as s}from"./app-482771be.js";const c={},d=s(`<h1 id="getting-started" tabindex="-1"><a class="header-anchor" href="#getting-started" aria-hidden="true">#</a> Getting started</h1><h2 id="installation" tabindex="-1"><a class="header-anchor" href="#installation" aria-hidden="true">#</a> Installation</h2><h3 id="npm" tabindex="-1"><a class="header-anchor" href="#npm" aria-hidden="true">#</a> npm:</h3><p><code>npm install @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en --save</code></p><h3 id="yarn" tabindex="-1"><a class="header-anchor" href="#yarn" aria-hidden="true">#</a> yarn:</h3><p><code>yarn add @zxcvbn-ts/core @zxcvbn-ts/language-common @zxcvbn-ts/language-en</code></p><h2 id="usage" tabindex="-1"><a class="header-anchor" href="#usage" aria-hidden="true">#</a> Usage</h2><h3 id="bundler-like-webpack" tabindex="-1"><a class="header-anchor" href="#bundler-like-webpack" aria-hidden="true">#</a> Bundler like webpack</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> zxcvbn<span class="token punctuation">,</span> zxcvbnOptions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@zxcvbn-ts/core&#39;</span>
<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> zxcvbnCommonPackage <span class="token keyword">from</span> <span class="token string">&#39;@zxcvbn-ts/language-common&#39;</span>
<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> zxcvbnEnPackage <span class="token keyword">from</span> <span class="token string">&#39;@zxcvbn-ts/language-en&#39;</span>

<span class="token keyword">const</span> password <span class="token operator">=</span> <span class="token string">&#39;somePassword&#39;</span>
<span class="token keyword">const</span> options <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">translations</span><span class="token operator">:</span> zxcvbnEnPackage<span class="token punctuation">.</span>translations<span class="token punctuation">,</span>
  <span class="token literal-property property">graphs</span><span class="token operator">:</span> zxcvbnCommonPackage<span class="token punctuation">.</span>adjacencyGraphs<span class="token punctuation">,</span>
  <span class="token literal-property property">dictionary</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token operator">...</span>zxcvbnCommonPackage<span class="token punctuation">.</span>dictionary<span class="token punctuation">,</span>
    <span class="token operator">...</span>zxcvbnEnPackage<span class="token punctuation">.</span>dictionary<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

zxcvbnOptions<span class="token punctuation">.</span><span class="token function">setOptions</span><span class="token punctuation">(</span>options<span class="token punctuation">)</span>

<span class="token function">zxcvbn</span><span class="token punctuation">(</span>password<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="as-script-tag" tabindex="-1"><a class="header-anchor" href="#as-script-tag" aria-hidden="true">#</a> As script tag</h3><p>Example using jsdelivr (a CDN)</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;html&gt;
  &lt;head&gt;
    &lt;script src=&quot;https://cdn.jsdelivr.net/npm/@zxcvbn-ts/core@2.0.0/dist/zxcvbn-ts.js&quot;&gt;&lt;/script&gt;
    &lt;script src=&quot;https://cdn.jsdelivr.net/npm/@zxcvbn-ts/language-common@2.0.0/dist/zxcvbn-ts.js&quot;&gt;&lt;/script&gt;
    &lt;script src=&quot;https://cdn.jsdelivr.net/npm/@zxcvbn-ts/language-en@2.0.0/dist/zxcvbn-ts.js&quot;&gt;&lt;/script&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;script&gt;
      ;(function () {
        // all package will be available under zxcvbnts
        const options = {
          translations: zxcvbnts[&#39;language-en&#39;].translations,
          graphs: zxcvbnts[&#39;language-common&#39;].adjacencyGraphs,
          dictionary: {
            ...zxcvbnts[&#39;language-common&#39;].dictionary,
            ...zxcvbnts[&#39;language-en&#39;].dictionary,
          },
        }
        zxcvbnts.core.zxcvbnOptions.setOptions(options)
        console.log(zxcvbnts.core.zxcvbn(&#39;somePassword&#39;))
      })()
    &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="output" tabindex="-1"><a class="header-anchor" href="#output" aria-hidden="true">#</a> Output</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>result.guesses            # estimated guesses needed to crack password
result.guessesLog10      # order of magnitude of result.guesses

result.crackTimesSeconds # dictionary of back-of-the-envelope crack time
                          # estimations, in seconds, based on a few scenarios:
{
  # online attack on a service that ratelimits password auth attempts.
  onlineThrottling100PerHour

  # online attack on a service that doesn&#39;t ratelimit,
  # or where an attacker has outsmarted ratelimiting.
  onlineNoThrottling10PerSecond

  # offline attack. assumes multiple attackers,
  # proper user-unique salting, and a slow hash function
  # w/ moderate work factor, such as bcrypt, scrypt, PBKDF2.
  offlineSlowHashing1e4PerSecond

  # offline attack with user-unique salting but a fast hash
  # function like SHA-1, SHA-256 or MD5. A wide range of
  # reasonable numbers anywhere from one billion - one trillion
  # guesses per second, depending on number of cores and machines.
  # ballparking at 10B/sec.
  offlineFastHashing1e10PerSecond
}

result.crackTimesDisplay # same keys as result.crackTimesSeconds,
                           # with friendlier display string values:
                           # &quot;less than a second&quot;, &quot;3 hours&quot;, &quot;centuries&quot;, etc.

result.score      # Integer from 0-4 (useful for implementing a strength bar)

  0 # too guessable: risky password. (guesses &lt; 10^3)

  1 # very guessable: protection from throttled online attacks. (guesses &lt; 10^6)

  2 # somewhat guessable: protection from unthrottled online attacks. (guesses &lt; 10^8)

  3 # safely unguessable: moderate protection from offline slow-hash scenario. (guesses &lt; 10^10)

  4 # very unguessable: strong protection from offline slow-hash scenario. (guesses &gt;= 10^10)

result.feedback   # verbal feedback to help choose better passwords. set when score &lt;= 2.

  result.feedback.warning     # explains what&#39;s wrong, eg. &#39;this is a top-10 common password&#39;.
                              # not always set -- sometimes an empty string

  result.feedback.suggestions # a possibly-empty list of suggestions to help choose a less
                              # guessable password. eg. &#39;Add another word or two&#39;

result.sequence   # the list of patterns that zxcvbn based the
                  # guess calculation on.

result.calcTime  # how long it took zxcvbn to calculate an answer,
                  # in milliseconds.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>We highly recommend always using the common and English language packages for the optimal scoring result. If your language is available as a package, you should import it as well. If your language is missing, feel free to open a PR. For the time being, you could extend the default set.</p><p>The <code>esm</code> build is for modern browsers and includes ES5 or higher. If you want to use it and want to include your own polyfills, you need to transpile it within your build process.</p><h2 id="change-prior-to-original-library" tabindex="-1"><a class="header-anchor" href="#change-prior-to-original-library" aria-hidden="true">#</a> Change prior to original library</h2>`,17),u=s("<li>I18n support for feedback, dictionaries and keyboard patterns. By default, the feedback are keys now</li><li>All dictionaries are optional, but the <code>en</code> dictionary is highly recommend (wished feature in some issues)</li><li>Dictionaries are separate from the core library. This means zxcvbn-ts is relatively small without its dictionaries</li><li>The project is a monorepo with a core library <code>@zxcvbn-ts/core</code> and language packages <code>@txcvbn-ts/language-en</code>. Initially, there are only German and English language packages.</li><li>Keyboard layouts can be customised. This means you can overwrite the default set of layouts with your own or extend it. E.g., if you are developing a Russian website, you need to include a Cyrillic keyboard set. Create a PR so that others can benefit from it.</li><li>You can use multiple keyboard layouts, which means that the library will check against them by default.</li><li>the tests are Jest based, so we get a coverage score</li><li>eslint/prettier for consistent code style</li><li>Added static page docs https://zxcvbn-ts.github.io/zxcvbn/</li><li>esm, commonJS and browser build</li><li>Custom matcher can be added which means you can create your own matcher</li><li>Async matcher can be added which means you can create a matcher that makes an API call</li>",12),p={href:"https://haveibeenpwned.com/Passwords",target:"_blank",rel:"noopener noreferrer"},v=n("li",null,"included debounce helper",-1),m=n("li",null,"levenshtein check for the dictionaries",-1),b=n("li",null,"diceware dictionary",-1),h=n("li",null,[e("extended l33t matcher for substitutions like "),n("code",null,"|_| => u")],-1);function g(k,y){const a=t("ExternalLinkIcon");return l(),r("div",null,[d,n("ul",null,[u,n("li",null,[n("a",p,[e("haveibeenpwned"),o(a)]),e(" matcher")]),v,m,b,h])])}const w=i(c,[["render",g],["__file","index.html.vue"]]);export{w as default};
