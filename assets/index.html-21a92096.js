import{_ as n,o as s,c as a,e}from"./app-482771be.js";const t={},c=e(`<h1 id="examples" tabindex="-1"><a class="header-anchor" href="#examples" aria-hidden="true">#</a> Examples</h1><h2 id="debounce" tabindex="-1"><a class="header-anchor" href="#debounce" aria-hidden="true">#</a> Debounce</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
    zxcvbnAsync<span class="token punctuation">,</span>
    debounce<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@zxcvbn-ts/core&#39;</span>

<span class="token keyword">let</span> result
<span class="token keyword">const</span> <span class="token function-variable function">someCallableFunction</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
<span class="token comment">// ...do your magic for example get the value from an input field or somewhere else</span>
    <span class="token keyword">const</span> value <span class="token operator">=</span> <span class="token function">getInputValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    result <span class="token operator">=</span> <span class="token function">zxcvbnAsync</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> debouncedZxcvbn <span class="token operator">=</span> <span class="token function">debounce</span><span class="token punctuation">(</span>someCallableFunction<span class="token punctuation">,</span> <span class="token number">200</span><span class="token punctuation">)</span>


<span class="token comment">// than you can call debouncedZxcvbn and if it is in the timeframe of 200ms the someCallableFunction will only be called once by the last call</span>
<span class="token function">debouncedZxcvbn</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token function">debouncedZxcvbn</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token function">debouncedZxcvbn</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token function">debouncedZxcvbn</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If you want to execute the function on the first debounce and ignore the rest you can use the third parameter.</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
    zxcvbnAsync<span class="token punctuation">,</span>
    debounce<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@zxcvbn-ts/core&#39;</span>

<span class="token keyword">let</span> result
<span class="token keyword">const</span> <span class="token function-variable function">someCallableFunction</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
<span class="token comment">// ...do your magic for example get the value from an input field or somewhere else</span>
    <span class="token keyword">const</span> value <span class="token operator">=</span> <span class="token function">getInputValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    result <span class="token operator">=</span> <span class="token function">zxcvbnAsync</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> debouncedZxcvbn <span class="token operator">=</span> <span class="token function">debounce</span><span class="token punctuation">(</span>someCallableFunction<span class="token punctuation">,</span> <span class="token number">200</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>


<span class="token comment">// than you can call debouncedZxcvbn and if it is in the timeframe of 200ms the someCallableFunction will only be called once by the first call</span>
<span class="token function">debouncedZxcvbn</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token function">debouncedZxcvbn</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token function">debouncedZxcvbn</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token function">debouncedZxcvbn</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),o=[c];function p(l,i){return s(),a("div",null,o)}const d=n(t,[["render",p],["__file","index.html.vue"]]);export{d as default};
