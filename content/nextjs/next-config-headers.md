---
title: "headers (custom HTTP headers)"
description: "headers option — `next.config.js` မှ route path အလိုက် incoming request များ၏ response တွင် custom HTTP headers များ သတ်မှတ်ရန်; path matching, has/missing, basePath/i18n ပံ့ပိုးမှု"
order: 89
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/headers"
status: translated
updated: 2026-09-02
---

Headers တွေက သတ်မှတ်ထားတဲ့ path တစ်ခုဆီ incoming request တစ်ခုရဲ့ response ပေါ်မှာ custom HTTP headers တွေ သတ်မှတ်နိုင်စေပါတယ်။

Custom HTTP headers တွေ သတ်မှတ်ဖို့ — `next.config.js` ထဲမှာ `headers` key ကို သုံးနိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  headers() {
    return [
      {
        source: '/about',
        headers: [
          {
            key: 'x-custom-header',
            value: 'my custom header value',
          },
          {
            key: 'x-another-custom-header',
            value: 'my other custom header value',
          },
        ],
      },
    ]
  },
}
```

`headers` ကို synchronous (သို့) async function အဖြစ် သတ်မှတ်နိုင်ပါတယ်။ ၎င်းက `source` နဲ့ `headers` properties တွေ ပါတဲ့ objects array တစ်ခုကို ပြန်ပို့ရပါမယ် (resolve လုပ်ရပါမယ်):

- `source` က incoming request path pattern ဖြစ်ပါတယ်။
- `headers` က `key` နဲ့ `value` properties တွေ ပါတဲ့ response header objects array တစ်ခုပါ။
- `basePath`: `false` (သို့) `undefined` — `false` ဆိုရင် matching လုပ်တဲ့အခါ basePath ကို ထည့်မတွက်ပါဘူး — external rewrites တွေအတွက်ပဲ သုံးနိုင်ပါတယ်။
- `locale`: `false` (သို့) `undefined` — matching လုပ်တဲ့အခါ locale ကို ထည့်မတွက်သင့်ဘူးလား ဆိုတာပါ။
- `has` က `type`, `key`, `value` properties တွေ ပါတဲ့ [has objects](#header-cookie-and-query-matching) array တစ်ခုပါ။
- `missing` က `type`, `key`, `value` properties တွေ ပါတဲ့ [missing objects](#header-cookie-and-query-matching) array တစ်ခုပါ။

Headers တွေကို pages နဲ့ `/public` files တွေ အပါအဝင် filesystem ကို မစစ်ခင် အရင်ဆုံး စစ်ဆေးပါတယ်။

## Header overriding အပြုအမူ

Header နှစ်ခုက path တစ်ခုတည်းကို match လုပ်ပြီး header key တစ်ခုတည်းကို သတ်မှတ်မိရင် — နောက်ဆုံး header key က ပထမတစ်ခုကို override လုပ်ပါတယ်။ အောက်ပါ headers တွေကို သုံးထားရင် `/hello` path အတွက် `x-hello` header က `world` ဖြစ်ပါလိမ့်မယ် — ဘာလို့လဲဆိုတော့ နောက်ဆုံး သတ်မှတ်ထားတဲ့ header value က `world` ဖြစ်နေလို့ပါ။

```js filename="next.config.js"
module.exports = {
  headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-hello',
            value: 'there',
          },
        ],
      },
      {
        source: '/hello',
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
    ]
  },
}
```

## Path matching (လမ်းကြောင်း ကိုက်ညီမှု)

Path matches တွေကို ခွင့်ပြုပါတယ် — ဥပမာ `/blog/:slug` က `/blog/first-post` ကို match လုပ်ပါတယ် (nested paths တွေ မပါ):

```js filename="next.config.js"
module.exports = {
  headers() {
    return [
      {
        source: '/blog/:slug',
        headers: [
          {
            key: 'x-slug',
            value: ':slug', // Matched parameters can be used in the value
          },
          {
            key: 'x-slug-:slug', // Matched parameters can be used in the key
            value: 'my other custom header value',
          },
        ],
      },
    ]
  },
}
```

`/blog/:slug` pattern က `/blog/first-post` နဲ့ `/blog/post-1` တို့ကို match လုပ်ပေမယ့် — `/blog/a/b` လိုမျိုး nested path တစ်ခုကို match မလုပ်ပါဘူး။ Patterns တွေက အစပိုင်းမှာ ကျောက်ချထားပြီး (anchored) — `/blog/:slug` က `/archive/blog/first-post` ကို match မလုပ်ပါဘူး။

Parameters တွေပေါ်မှာ modifiers တွေ သုံးနိုင်ပါတယ်: `*` (zero or more), `+` (one or more), `?` (zero or one)။ ဥပမာ — `/blog/:slug*` က `/blog`, `/blog/a`, နဲ့ `/blog/a/b/c` တို့ကို match လုပ်ပါတယ်။

[path-to-regexp](https://github.com/pillarjs/path-to-regexp) documentation အကြောင်း နောက်ထပ် အသေးစိတ် ဖတ်ရှုပါ။

### Wildcard path matching

Wildcard path တစ်ခုကို match လုပ်ဖို့ — parameter တစ်ခုရဲ့ နောက်မှာ `*` ကို သုံးနိုင်ပါတယ်။ ဥပမာ `/blog/:slug*` က `/blog/a/b/c/d/hello-world` ကို match လုပ်ပါလိမ့်မယ်:

```js filename="next.config.js"
module.exports = {
  headers() {
    return [
      {
        source: '/blog/:slug*',
        headers: [
          {
            key: 'x-slug',
            value: ':slug*', // Matched parameters can be used in the value
          },
          {
            key: 'x-slug-:slug*', // Matched parameters can be used in the key
            value: 'my other custom header value',
          },
        ],
      },
    ]
  },
}
```

### Regex path matching

Regex path တစ်ခုကို match လုပ်ဖို့ — parameter တစ်ခုရဲ့ နောက်မှာ regex ကို parenthesis ထဲ ထည့်နိုင်ပါတယ်။ ဥပမာ `/blog/:slug(\\d{1,})` က `/blog/123` ကို match လုပ်ပြီး `/blog/abc` ကို match မလုပ်ပါဘူး:

```js filename="next.config.js"
module.exports = {
  headers() {
    return [
      {
        source: '/blog/:post(\\d{1,})',
        headers: [
          {
            key: 'x-post',
            value: ':post',
          },
        ],
      },
    ]
  },
}
```

အောက်ပါ character တွေ `(`, `)`, `{`, `}`, `:`, `*`, `+`, `?` ကို regex path matching အတွက် သုံးပါတယ် — ဒါကြောင့် `source` ထဲမှာ သာမန် (non-special) တန်ဖိုးတွေအဖြစ် သုံးချင်ရင် ရှေ့မှာ `\\` ထည့်ပြီး escape လုပ်ရပါမယ်:

```js filename="next.config.js"
module.exports = {
  headers() {
    return [
      {
        // this will match `/english(default)/something` being requested
        source: '/english\\(default\\)/:slug',
        headers: [
          {
            key: 'x-header',
            value: 'value',
          },
        ],
      },
    ]
  },
}
```

## Header, Cookie, and Query Matching

Header, cookie (သို့) query values တွေပါ `has` field နဲ့ ကိုက်ညီမှ (သို့) `missing` field နဲ့ မကိုက်ညီမှသာ header တစ်ခုကို သက်ရောက်စေချင်တဲ့အခါ ဒါတွေကို သုံးနိုင်ပါတယ်။ Header ကို သက်ရောက်စေဖို့ — `source` ရော `has` items အားလုံးပါ match လုပ်ရပြီး `missing` items အားလုံးက match မလုပ်ရပါဘူး။

`has` နဲ့ `missing` items တွေမှာ အောက်ပါ fields တွေ ရှိနိုင်ပါတယ်:

- `type`: `String` — `header`, `cookie`, `host`, (သို့) `query` ဖြစ်ရပါမယ်။
- `key`: `String` — ရွေးထားတဲ့ type ကနေ ဘယ် key ကို match လုပ်မလဲ ဆိုတာပါ။
- `value`: `String` (သို့) `undefined` — စစ်ဆေးရမယ့် တန်ဖိုးပါ၊ `undefined` ဆိုရင် ဘယ် value မဆို match လုပ်ပါတယ်။ Value ရဲ့ သီးခြား အစိတ်အပိုင်းတစ်ခုကို ဖမ်းယူဖို့ regex ပုံစံ string ကို သုံးနိုင်ပါတယ် — ဥပမာ `first-second` အတွက် `first-(?<paramName>.*)` ကို သုံးထားရင် `second` ကို destination ထဲမှာ `:paramName` နဲ့ သုံးနိုင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  headers() {
    return [
      // if the header `x-add-header` is present,
      // the `x-another-header` header will be applied
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-add-header',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: 'hello',
          },
        ],
      },
      // if the header `x-no-header` is not present,
      // the `x-another-header` header will be applied
      {
        source: '/:path*',
        missing: [
          {
            type: 'header',
            key: 'x-no-header',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: 'hello',
          },
        ],
      },
      // if the source, query, and cookie are matched,
      // the `x-authorized` header will be applied
      {
        source: '/specific/:path*',
        has: [
          {
            type: 'query',
            key: 'page',
            // the page value will not be available in the
            // header key/values since value is provided and
            // doesn't use a named capture group e.g. (?<page>home)
            value: 'home',
          },
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        headers: [
          {
            key: 'x-authorized',
            value: ':authorized',
          },
        ],
      },
      // if the header `x-authorized` is present and
      // contains a matching value, the `x-another-header` will be applied
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-authorized',
            value: '(?<authorized>yes|true)',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: ':authorized',
          },
        ],
      },
      // if the host is `example.com`,
      // this header will be applied
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: ':authorized',
          },
        ],
      },
    ]
  },
}
```

## basePath နဲ့တွဲသုံးတဲ့ headers

Headers တွေနဲ့အတူ [`basePath` support](/docs/nextjs/next-config-base-path) ကို အသုံးချတဲ့အခါ — header တစ်ခုမှာ `basePath: false` မထည့်ထားဘူးဆိုရင် `source` တစ်ခုစီကို `basePath` နဲ့ အလိုအလျောက် prefix လုပ်ပေးပါတယ်:

```js filename="next.config.js"
module.exports = {
  basePath: '/docs',

  headers() {
    return [
      {
        source: '/with-basePath', // becomes /docs/with-basePath
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        source: '/without-basePath', // is not modified since basePath: false is set
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
        basePath: false,
      },
    ]
  },
}
```

## i18n နဲ့တွဲသုံးတဲ့ headers

Headers တွေနဲ့အတူ [`i18n` support](/docs/nextjs/internationalization) ကို အသုံးချတဲ့အခါ — header တစ်ခုမှာ `locale: false` မထည့်ထားဘူးဆိုရင် `source` တစ်ခုစီကို သတ်မှတ်ထားတဲ့ `locales` တွေကို ကိုင်တွယ်ဖို့ အလိုအလျောက် prefix လုပ်ပေးပါတယ်။ `locale: false` ကို သုံးထားရင် — မှန်ကန်စွာ match လုပ်နိုင်ဖို့ `source` ကို locale တစ်ခုနဲ့ ကိုယ်တိုင် prefix လုပ်ပေးရပါမယ်။

```js filename="next.config.js"
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },

  headers() {
    return [
      {
        source: '/with-locale', // automatically handles all locales
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        // does not handle locales automatically since locale: false is set
        source: '/nl/with-locale-manual',
        locale: false,
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        // this matches '/' since `en` is the defaultLocale
        source: '/en',
        locale: false,
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
      {
        // this gets converted to /(en|fr|de)/(.*) so will not match the top-level
        // `/` or `/fr` routes like /:path* would
        source: '/(.*)',
        headers: [
          {
            key: 'x-hello',
            value: 'world',
          },
        ],
      },
    ]
  },
}
```

## Cache-Control

Next.js က တကယ့်ကို immutable ဖြစ်တဲ့ assets တွေအတွက် `Cache-Control` header ကို `public, max-age=31536000, immutable` အဖြစ် သတ်မှတ်ပေးပါတယ် — ဒါကို override လုပ်လို့ မရပါဘူး။ ဒီ immutable files တွေရဲ့ file name ထဲမှာ SHA-hash ပါဝင်လို့ — ကြာရှည် ဘေးကင်းစွာ cache လုပ်ထားနိုင်ပါတယ်။ ဥပမာ — [Static Image Imports](https://nextjs.org/docs/app/getting-started/images#local-images)။ ဒီ assets တွေအတွက် `next.config.js` ထဲမှာ `Cache-Control` headers တွေ သတ်မှတ်လို့ မရပါဘူး။

သို့ပေမယ့် — အခြား responses (သို့) data တွေအတွက်တော့ `Cache-Control` headers တွေ သတ်မှတ်နိုင်ပါတယ်။

App Router နဲ့ [caching](/docs/nextjs/caching) အကြောင်း ပိုလေ့လာပါ။

## Options (အသုံးများသော headers များ)

### CORS

[Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/docs/Web/HTTP/CORS) က ဘယ် sites တွေက သင့် resources တွေကို ဝင်ရောက်နိုင်လဲ ထိန်းချုပ်ပေးတဲ့ security feature တစ်ခုပါ။ `Access-Control-Allow-Origin` header ကို သတ်မှတ်ပြီး — သတ်မှတ်ထားတဲ့ origin တစ်ခုကို သင့် Route Handlers တွေဆီ ဝင်ရောက်ခွင့် ပေးနိုင်ပါတယ်။

```js
headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Set your origin
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
```

### X-DNS-Prefetch-Control

[ဒီ header](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control) က DNS prefetching ကို ထိန်းချုပ်ပါတယ် — external links, images, CSS, JavaScript စတာတွေအတွက် browsers တွေက domain name resolution ကို ကြိုတင် (proactively) လုပ်နိုင်စေပါတယ်။ ဒီ prefetching ကို background မှာ လုပ်ဆောင်လို့ — လိုအပ်တဲ့ အရာတွေကို သုံးချိန်မှာ [DNS](https://developer.mozilla.org/docs/Glossary/DNS) က resolve လုပ်ပြီးသား ဖြစ်နိုင်ခြေ ပိုများပါတယ်။ ဒါက user က link တစ်ခုကို နှိပ်တဲ့အခါ latency ကို လျှော့ချပေးပါတယ်။

```js
{
  key: 'X-DNS-Prefetch-Control',
  value: 'on'
}
```

### Strict-Transport-Security

[ဒီ header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security) က browsers တွေကို HTTP အစား HTTPS နဲ့ပဲ ဝင်ရောက်သင့်ကြောင်း အသိပေးပါတယ်။ အောက်ပါ configuration ကို သုံးထားရင် — လက်ရှိနဲ့ အနာဂတ် subdomains အားလုံးက `max-age` 2 နှစ်ကြာ HTTPS ကို သုံးပါလိမ့်မယ်။ ဒါက HTTP နဲ့ပဲ serve လို့ရတဲ့ pages (သို့) subdomains တွေဆီ ဝင်ရောက်မှုကို ပိတ်ဆို့ပေးပါတယ်။

```js
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
}
```

### X-Frame-Options

[ဒီ header](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options) က site တစ်ခုကို `iframe` တစ်ခုထဲမှာ ပြသခွင့် ရှိမရှိ သတ်မှတ်ပေးပါတယ်။ ဒါက clickjacking တိုက်ခိုက်မှုတွေကို ကာကွယ်ပေးနိုင်ပါတယ်။

**ဒီ header ကို CSP ရဲ့ `frame-ancestors` option က အစားထိုးလိုက်ပြီ** — modern browsers တွေမှာ ပိုကောင်းတဲ့ support ရှိလို့ပါ (configuration အသေးစိတ်အတွက် [Content Security Policy](https://nextjs.org/docs/app/guides/content-security-policy) ကို ကြည့်ပါ)။

```js
{
  key: 'X-Frame-Options',
  value: 'SAMEORIGIN'
}
```

### Permissions-Policy

[ဒီ header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Permissions-Policy) က browser ထဲမှာ ဘယ် features နဲ့ APIs တွေကို သုံးခွင့်ပြုမလဲ ထိန်းချုပ်ပေးပါတယ်။ အရင်က ဒါကို `Feature-Policy` လို့ ခေါ်ပါတယ်။

```js
{
  key: 'Permissions-Policy',
  value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
}
```

### X-Content-Type-Options

[ဒီ header](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Content-Type-Options) က `Content-Type` header ကို အတိအကျ သတ်မှတ်မထားရင် — browser က content ရဲ့ type ကို ခန့်မှန်းဖို့ မကြိုးစားအောင် တားဆီးပေးပါတယ်။ ဒါက users တွေ files တွေ upload/share လုပ်လို့ရတဲ့ websites တွေမှာ XSS exploits တွေကို ကာကွယ်ပေးနိုင်ပါတယ်။

ဥပမာ — user တစ်ယောက်က image တစ်ခုကို download လုပ်ဖို့ ကြိုးစားပေမယ့် executable လိုမျိုး မတူညီတဲ့ `Content-Type` အနေနဲ့ သဘောထားခံရတာမျိုး — ဒါက အန္တရာယ် ဖြစ်စေနိုင်ပါတယ်။ ဒီ header က browser extensions တွေ download လုပ်တာကိုလည်း သက်ရောက်ပါတယ်။ ဒီ header ရဲ့ တစ်ခုတည်းသော valid value က `nosniff` ပါ။

```js
{
  key: 'X-Content-Type-Options',
  value: 'nosniff'
}
```

### Referrer-Policy

[ဒီ header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy) က လက်ရှိ website (origin) ကနေ အခြားတစ်ခုဆီ သွားလာတဲ့အခါ — browser က ဘယ်လောက် အချက်အလက် ပါဝင်စေမလဲ ထိန်းချုပ်ပေးပါတယ်။

```js
{
  key: 'Referrer-Policy',
  value: 'origin-when-cross-origin'
}
```

### Content-Security-Policy

သင့် application မှာ [Content Security Policy](https://nextjs.org/docs/app/guides/content-security-policy) တစ်ခု ထည့်သွင်းခြင်းအကြောင်း ပိုလေ့လာပါ။

## Version History

| Version   | အပြောင်းအလဲ          |
| --------- | ------------------ |
| `v13.3.0` | `missing` ထည့်သွင်း။ |
| `v10.2.0` | `has` ထည့်သွင်း။     |
| `v9.5.0`  | Headers စတင် မိတ်ဆက်။ |
