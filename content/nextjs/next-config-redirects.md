---
title: "redirects (URL ပြောင်းရွှေ့ခြင်း)"
description: "redirects option — incoming request path ကို အခြား destination path သို့ ပြောင်းရွှေ့ရန်; source/destination/permanent, path matching, has/missing, basePath/i18n ပံ့ပိုးမှု"
order: 90
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects"
status: translated
updated: 2026-09-02
---

Redirects တွေက incoming request path တစ်ခုကို မတူညီတဲ့ destination path တစ်ခုဆီ ပြောင်းရွှေ့ (redirect) လုပ်နိုင်စေပါတယ်။

Redirects တွေကို သုံးဖို့ — `next.config.js` ထဲမှာ `redirects` key ကို သုံးနိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
    ]
  },
}
```

`redirects` ကို synchronous (သို့) async function အဖြစ် သတ်မှတ်နိုင်ပါတယ်။ ၎င်းက `source`, `destination`, နဲ့ `permanent` properties တွေ ပါတဲ့ objects array တစ်ခုကို ပြန်ပို့ရပါမယ် (resolve လုပ်ရပါမယ်):

- `source` က incoming request path pattern ဖြစ်ပါတယ်။
- `destination` က သင်ပြောင်းရွှေ့ချင်တဲ့ path ဖြစ်ပါတယ်။
- `permanent` က `true` (သို့) `false` — `true` ဆိုရင် clients/search engines တွေကို redirect ကို အမြဲတမ်း cache လုပ်ဖို့ ညွှန်ကြားတဲ့ 308 status code ကို သုံးပြီး၊ `false` ဆိုရင် ယာယီဖြစ်ပြီး cache မလုပ်တဲ့ 307 status code ကို သုံးပါတယ်။

> **Next.js က ဘာလို့ 307 နဲ့ 308 တွေကို သုံးတာလဲ?** အစဉ်အလာအရ — ယာယီ redirect အတွက် 302 ကို သုံးပြီး အမြဲတမ်း redirect အတွက် 301 ကို သုံးပါတယ်။ ဒါပေမယ့် browsers အများအပြားက redirect ရဲ့ request method ကို မူရင်း method ဘာပဲဖြစ်ဖြစ် `GET` အဖြစ် ပြောင်းလိုက်တတ်ပါတယ်။ ဥပမာ — browser က `POST /v1/users` ဆီ request လုပ်ပြီး အဲဒီကနေ location `/v2/users` ပါတဲ့ status code `302` ပြန်လာရင် — နောက် request က မျှော်လင့်ထားတဲ့ `POST /v2/users` အစား `GET /v2/users` ဖြစ်သွားနိုင်ပါတယ်။ ဒါကြောင့် Next.js က သုံးနေတဲ့ request method ကို ထိန်းသိမ်းပေးဖို့ — 307 ယာယီ redirect နဲ့ 308 အမြဲတမ်း redirect status codes တွေကို သုံးပါတယ်။

- `basePath`: `false` (သို့) `undefined` — `false` ဆိုရင် matching လုပ်တဲ့အခါ `basePath` ကို ထည့်မတွက်ပါဘူး — external redirects တွေအတွက်ပဲ သုံးနိုင်ပါတယ်။
- `locale`: `false` (သို့) `undefined` — matching လုပ်တဲ့အခါ locale ကို ထည့်မတွက်သင့်ဘူးလား ဆိုတာပါ။
- `has` က `type`, `key`, `value` properties တွေ ပါတဲ့ [has objects](#header-cookie-and-query-matching) array တစ်ခုပါ။
- `missing` က `type`, `key`, `value` properties တွေ ပါတဲ့ [missing objects](#header-cookie-and-query-matching) array တစ်ခုပါ။

Redirects တွေကို pages နဲ့ `/public` files တွေ အပါအဝင် filesystem ကို မစစ်ခင် အရင်ဆုံး စစ်ဆေးပါတယ်။

Redirect တစ်ခု သက်ရောက်တဲ့အခါ — request ထဲမှာ ပါလာတဲ့ query values တွေကို redirect destination ဆီ ဆက်ပို့ပေးပါတယ်။ ဥပမာ — အောက်ပါ redirect configuration ကို ကြည့်ပါ:

```js
{
  source: '/old-blog/:path*',
  destination: '/blog/:path*',
  permanent: false
}
```

> **သိထားသင့်သည်:** `source` နဲ့ `destination` paths တွေရဲ့ path parameters တွေထဲမှာ colon `:` ရဲ့ ရှေ့မှာ forward slash `/` ထည့်ဖို့ မမေ့ပါနဲ့ — မထည့်ရင် path ကို literal string အနေနဲ့ သဘောထားပြီး infinite redirects တွေ ဖြစ်စေနိုင်ပါတယ်။

`/old-blog/post-1?hello=world` ကို request လုပ်တဲ့အခါ — client က `/blog/post-1?hello=world` ဆီ redirect လုပ်ခံရပါလိမ့်မယ်။

## Path matching (လမ်းကြောင်း ကိုက်ညီမှု)

Path matches တွေကို ခွင့်ပြုပါတယ် — ဥပမာ `/old-blog/:slug` က `/old-blog/first-post` ကို match လုပ်ပါတယ် (nested paths တွေ မပါ):

```js filename="next.config.js"
module.exports = {
  redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/news/:slug', // Matched parameters can be used in the destination
        permanent: true,
      },
    ]
  },
}
```

`/old-blog/:slug` pattern က `/old-blog/first-post` နဲ့ `/old-blog/post-1` တို့ကို match လုပ်ပေမယ့် — `/old-blog/a/b` (nested paths မပါ) ကို match မလုပ်ပါဘူး။ Patterns တွေက အစပိုင်းမှာ ကျောက်ချထားပြီး — `/old-blog/:slug` က `/archive/old-blog/first-post` ကို match မလုပ်ပါဘူး။

Parameters တွေပေါ်မှာ modifiers တွေ သုံးနိုင်ပါတယ်: `*` (zero or more), `+` (one or more), `?` (zero or one)။ ဥပမာ — `/blog/:slug*` က `/blog`, `/blog/a`, နဲ့ `/blog/a/b/c` တို့ကို match လုပ်ပါတယ်။

[path-to-regexp](https://github.com/pillarjs/path-to-regexp) documentation အကြောင်း နောက်ထပ် အသေးစိတ် ဖတ်ရှုပါ။

### Wildcard path matching

Wildcard path တစ်ခုကို match လုပ်ဖို့ — parameter တစ်ခုရဲ့ နောက်မှာ `*` ကို သုံးနိုင်ပါတယ်။ ဥပမာ `/blog/:slug*` က `/blog/a/b/c/d/hello-world` ကို match လုပ်ပါလိမ့်မယ်:

```js filename="next.config.js"
module.exports = {
  redirects() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/news/:slug*', // Matched parameters can be used in the destination
        permanent: true,
      },
    ]
  },
}
```

### Regex path matching

Regex path တစ်ခုကို match လုပ်ဖို့ — parameter တစ်ခုရဲ့ နောက်မှာ regex ကို parentheses ထဲ ထည့်နိုင်ပါတယ်။ ဥပမာ `/post/:slug(\\d{1,})` က `/post/123` ကို match လုပ်ပြီး `/post/abc` ကို match မလုပ်ပါဘူး:

```js filename="next.config.js"
module.exports = {
  redirects() {
    return [
      {
        source: '/post/:slug(\\d{1,})',
        destination: '/news/:slug', // Matched parameters can be used in the destination
        permanent: false,
      },
    ]
  },
}
```

အောက်ပါ character တွေ `(`, `)`, `{`, `}`, `:`, `*`, `+`, `?` ကို regex path matching အတွက် သုံးပါတယ် — ဒါကြောင့် `source` ထဲမှာ သာမန် (non-special) တန်ဖိုးတွေအဖြစ် သုံးချင်ရင် ရှေ့မှာ `\\` ထည့်ပြီး escape လုပ်ရပါမယ်:

```js filename="next.config.js"
module.exports = {
  redirects() {
    return [
      {
        // this will match `/english(default)/something` being requested
        source: '/english\\(default\\)/:slug',
        destination: '/en-us/:slug',
        permanent: false,
      },
    ]
  },
}
```

## Header, Cookie, and Query Matching

Header, cookie (သို့) query values တွေပါ `has` field နဲ့ ကိုက်ညီမှ (သို့) `missing` field နဲ့ မကိုက်ညီမှသာ redirect တစ်ခုကို သက်ရောက်စေချင်တဲ့အခါ ဒါတွေကို သုံးနိုင်ပါတယ်။ Redirect ကို သက်ရောက်စေဖို့ — `source` ရော `has` items အားလုံးပါ match လုပ်ရပြီး `missing` items အားလုံးက match မလုပ်ရပါဘူး။

`has` နဲ့ `missing` items တွေမှာ အောက်ပါ fields တွေ ရှိနိုင်ပါတယ်:

- `type`: `String` — `header`, `cookie`, `host`, (သို့) `query` ဖြစ်ရပါမယ်။
- `key`: `String` — ရွေးထားတဲ့ type ကနေ ဘယ် key ကို match လုပ်မလဲ ဆိုတာပါ။
- `value`: `String` (သို့) `undefined` — စစ်ဆေးရမယ့် တန်ဖိုးပါ၊ `undefined` ဆိုရင် ဘယ် value မဆို match လုပ်ပါတယ်။ Value ရဲ့ သီးခြား အစိတ်အပိုင်းတစ်ခုကို ဖမ်းယူဖို့ regex ပုံစံ string ကို သုံးနိုင်ပါတယ် — ဥပမာ `first-second` အတွက် `first-(?<paramName>.*)` ကို သုံးထားရင် `second` ကို destination ထဲမှာ `:paramName` နဲ့ သုံးနိုင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  redirects() {
    return [
      // if the header `x-redirect-me` is present,
      // this redirect will be applied
      {
        source: '/:path((?!another-page$).*)',
        has: [
          {
            type: 'header',
            key: 'x-redirect-me',
          },
        ],
        permanent: false,
        destination: '/another-page',
      },
      // if the header `x-do-not-redirect` is present,
      // this redirect will NOT be applied
      {
        source: '/:path((?!another-page$).*)',
        missing: [
          {
            type: 'header',
            key: 'x-do-not-redirect',
          },
        ],
        permanent: false,
        destination: '/another-page',
      },
      // if the source, query, and cookie are matched,
      // this redirect will be applied
      {
        source: '/specific/:path*',
        has: [
          {
            type: 'query',
            key: 'page',
            // the page value will not be available in the
            // destination since value is provided and doesn't
            // use a named capture group e.g. (?<page>home)
            value: 'home',
          },
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        permanent: false,
        destination: '/another/:path*',
      },
      // if the header `x-authorized` is present and
      // contains a matching value, this redirect will be applied
      {
        source: '/',
        has: [
          {
            type: 'header',
            key: 'x-authorized',
            value: '(?<authorized>yes|true)',
          },
        ],
        permanent: false,
        destination: '/home?authorized=:authorized',
      },
      // if the host is `example.com`,
      // this redirect will be applied
      {
        source: '/:path((?!another-page$).*)',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },
        ],
        permanent: false,
        destination: '/another-page',
      },
    ]
  },
}
```

### basePath နဲ့တွဲသုံးတဲ့ redirects

Redirects တွေနဲ့အတူ [`basePath` support](/docs/nextjs/next-config-base-path) ကို အသုံးချတဲ့အခါ — redirect တစ်ခုမှာ `basePath: false` မထည့်ထားဘူးဆိုရင် `source` ရော `destination` ပါ `basePath` နဲ့ အလိုအလျောက် prefix လုပ်ပေးပါတယ်:

```js filename="next.config.js"
module.exports = {
  basePath: '/docs',

  redirects() {
    return [
      {
        source: '/with-basePath', // automatically becomes /docs/with-basePath
        destination: '/another', // automatically becomes /docs/another
        permanent: false,
      },
      {
        // does not add /docs since basePath: false is set
        source: '/without-basePath',
        destination: 'https://example.com',
        basePath: false,
        permanent: false,
      },
    ]
  },
}
```

### i18n နဲ့တွဲသုံးတဲ့ redirects

App Router မှာ internationalization နဲ့အတူ redirects တွေ အကောင်အထည်ဖော်တဲ့အခါ — `next.config.js` redirects တွေထဲမှာ locales တွေကို hardcoded paths တွေအနေနဲ့ပဲ ထည့်သွင်းနိုင်ပါတယ်။

Dynamic (သို့) request တစ်ခုချင်းစီအလိုက် locale ကိုင်တွယ်မှုအတွက်တော့ — user ရဲ့ ဦးစားပေး language ပေါ် မူတည်ပြီး redirect လုပ်ပေးနိုင်တဲ့ [dynamic route segments နဲ့ proxy](/docs/nextjs/internationalization) တွေကို သုံးပါ။

```js filename="next.config.js"
module.exports = {
  redirects() {
    return [
      {
        // Manually handle locale prefixes for App Router
        source: '/en/old-path',
        destination: '/en/new-path',
        permanent: false,
      },
      {
        // Redirect for all locales using a parameter
        source: '/:locale/old-path',
        destination: '/:locale/new-path',
        permanent: false,
      },
      {
        // Redirect from one locale to another
        source: '/de/old-path',
        destination: '/en/new-path',
        permanent: false,
      },
      {
        // Catch-all redirect for multiple locales
        source: '/:locale(en|fr|de)/:path*',
        destination: '/:locale/new-section/:path*',
        permanent: false,
      },
    ]
  },
}
```

ရှားပါးတဲ့ အခြေအနေတချို့မှာ — ခေတ်ဟောင်း HTTP clients တွေ မှန်ကန်စွာ redirect လုပ်နိုင်ဖို့ custom status code တစ်ခု သတ်မှတ်ပေးဖို့ လိုအပ်နိုင်ပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ `permanent` property အစား `statusCode` property ကို သုံးနိုင်ပါတယ် — နှစ်ခုလုံးကို အတူတူတော့ သုံးလို့ မရပါဘူး။ IE11 နဲ့ လိုက်ဖက်မှု ရှိစေဖို့ — 308 status code အတွက် `Refresh` header တစ်ခုကို အလိုအလျောက် ထည့်ပေးပါတယ်။

## အခြား redirects များ

- [Route Handlers](/docs/nextjs/file-conventions-route) တွေ (ပြီးတော့ Pages Router ရဲ့ [API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)) တွေထဲမှာ — incoming request ပေါ် မူတည်ပြီး redirect လုပ်နိုင်ပါတယ်။
- [`redirect()`](/docs/nextjs/redirect) function ကို Server Components, Server Actions, Route Handlers (သို့) Server Actions တွေထဲမှာ သုံးပြီး — request-time မှာ redirect လုပ်နိုင်ပါတယ်။

## Version History

| Version   | အပြောင်းအလဲ            |
| --------- | ------------------ |
| `v13.3.0` | `missing` ထည့်သွင်း။   |
| `v10.2.0` | `has` ထည့်သွင်း။       |
| `v9.5.0`  | `redirects` စတင် မိတ်ဆက်။ |
