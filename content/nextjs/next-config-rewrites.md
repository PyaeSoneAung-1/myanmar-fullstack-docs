---
title: "rewrites (URL ပြန်ရေးခြင်း)"
description: "rewrites option — incoming request path ကို အခြား destination path သို့ မြေပုံဆွဲ (map) ခြင်း; beforeFiles/afterFiles/fallback, rewrite parameters, path matching, external URL သို့ rewriting"
order: 91
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites"
status: translated
updated: 2026-09-02
---

Rewrites တွေက incoming request path တစ်ခုကို မတူညီတဲ့ destination path တစ်ခုဆီ map လုပ်နိုင်စေပါတယ်။

Rewrites တွေက URL proxy တစ်ခုလို ဆောင်ရွက်ပြီး — destination path ကို ဖုံးကွယ်ထားလို့ user က site ပေါ်မှာ နေရာ မပြောင်းဘူးလို့ ထင်ရပါတယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — [redirects](/docs/nextjs/next-config-redirects) ကတော့ page အသစ်တစ်ခုဆီ ပြောင်းရွှေ့ပြီး URL ပြောင်းသွားတာကို ပြသပါတယ်။

Rewrites တွေကို သုံးဖို့ — `next.config.js` ထဲမှာ `rewrites` key ကို သုံးနိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  rewrites() {
    return [
      {
        source: '/about',
        destination: '/',
      },
    ]
  },
}
```

Rewrites တွေက client-side routing ပေါ်မှာ သက်ရောက်ပါတယ်။ အထက်ပါ ဥပမာမှာ — `<Link href="/about">` ဆီ သွားလာတာက URL ကို `/about` အတိုင်း ထားပြီး `/` ကနေ content ကို serve လုပ်ပေးပါလိမ့်မယ်။

`rewrites` ကို synchronous (သို့) async function အဖြစ် သတ်မှတ်နိုင်ပါတယ်။ ၎င်းက `source` နဲ့ `destination` properties တွေ ပါတဲ့ objects တွေကို ကိုင်ထားတဲ့ array တစ်ခု (သို့) arrays တွေရဲ့ object တစ်ခု (အောက်တွင် ကြည့်ပါ) ကို ပြန်ပို့ရပါမယ် (resolve လုပ်ရပါမယ်):

- `source`: `String` — incoming request path pattern ဖြစ်ပါတယ်။
- `destination`: `String` — သင်ပြောင်းရွှေ့ချင်တဲ့ path ဖြစ်ပါတယ်။
- `basePath`: `false` (သို့) `undefined` — `false` ဆိုရင် matching လုပ်တဲ့အခါ basePath ကို ထည့်မတွက်ပါဘူး — external rewrites တွေအတွက်ပဲ သုံးနိုင်ပါတယ်။
- `locale`: `false` (သို့) `undefined` — matching လုပ်တဲ့အခါ locale ကို ထည့်မတွက်သင့်ဘူးလား ဆိုတာပါ။
- `has` က `type`, `key`, `value` properties တွေ ပါတဲ့ [has objects](#header-cookie-and-query-matching) array တစ်ခုပါ။
- `missing` က `type`, `key`, `value` properties တွေ ပါတဲ့ [missing objects](#header-cookie-and-query-matching) array တစ်ခုပါ။

`rewrites` function က array တစ်ခုကို ပြန်ပို့တဲ့အခါ — rewrites တွေကို filesystem (pages နဲ့ `/public` files) ကို စစ်ပြီးမှ၊ dynamic routes တွေ မစစ်ခင် သက်ရောက်ပါတယ်။ `rewrites` function က သတ်မှတ်ထားတဲ့ ပုံစံနဲ့ arrays တွေရဲ့ object တစ်ခုကို ပြန်ပို့တဲ့အခါ — ဒီအပြုအမူကို ပြောင်းလဲပြီး ပိုမို ကောင်းမွန်စွာ ထိန်းချုပ်နိုင်ပါတယ် (Next.js `v10.1` ကစပြီး):

```js filename="next.config.js"
module.exports = {
  rewrites() {
    return {
      beforeFiles: [
        // These rewrites are checked after headers/redirects
        // and before all files including _next/public files which
        // allows overriding page files
        {
          source: '/some-page',
          destination: '/somewhere-else',
          has: [{ type: 'query', key: 'overrideMe' }],
        },
      ],
      afterFiles: [
        // These rewrites are checked after pages/public files
        // are checked but before dynamic routes
        {
          source: '/non-existent',
          destination: '/somewhere-else',
        },
      ],
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
        {
          source: '/:path*',
          destination: `https://my-old-site.com/:path*`,
        },
      ],
    }
  },
}
```

> **သိထားသင့်သည်:** `beforeFiles` ထဲက rewrites တွေက source တစ်ခုကို match လုပ်ပြီးချင်း filesystem/dynamic routes တွေကို ချက်ချင်း မစစ်ပါဘူး — `beforeFiles` အားလုံးကို စစ်ပြီးတဲ့အထိ ဆက်လုပ်သွားပါတယ်။

Next.js က routes တွေကို စစ်ဆေးတဲ့ အစီအစဉ်က:

1. [headers](/docs/nextjs/next-config-headers) တွေကို စစ်ဆေး/သက်ရောက်စေပါတယ်
2. [redirects](/docs/nextjs/next-config-redirects) တွေကို စစ်ဆေး/သက်ရောက်စေပါတယ်
3. [proxy](/docs/nextjs/file-conventions-proxy)
4. `beforeFiles` rewrites တွေ — entry တစ်ခုစီအတွက် `source`, `has`, နဲ့ `missing` တွေ request နဲ့ ကိုက်ညီရင် `destination` ဆီ rewrite လုပ်ပါတယ်။
5. [public directory](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder) ကနေ static files တွေ၊ `_next/static` files တွေ၊ နဲ့ non-dynamic pages တွေကို စစ်ဆေး/serve လုပ်ပါတယ်
6. `afterFiles` rewrites တွေကို အစီအစဉ်အတိုင်း စမ်းကြည့်ပါတယ် — `source`, `has`, နဲ့ `missing` က request နဲ့ ကိုက်ညီရင် `destination` ဆီ rewrite လုပ်ပြီး — static file, page, (သို့) dynamic route တစ်ခုဆီ resolve ဖြစ်တဲ့ ပထမဆုံး rewrite ကို serve လုပ်ပါတယ်။
7. Dynamic routes တွေ (ဥပမာ — `app/blog/[slug]/page.tsx`) ကို လက်ရှိ path နဲ့ match လုပ်ပါတယ်
8. `fallback` rewrites တွေကို စစ်ဆေး/သက်ရောက်စေပါတယ် — dynamic routes/static assets အားလုံးကို စစ်ပြီးမှ၊ 404 page ကို render မလုပ်ခင် သက်ရောက်ပါတယ်။ `getStaticPaths` ထဲမှာ [fallback: true/'blocking'](https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-true) ကို သုံးထားရင် — အဲဒီ dynamic routes တွေက သင့် `next.config.js` ထဲက fallback `rewrites` တွေထက် ဦးစားပေး ခံရပါတယ်။

## Rewrite parameters

Rewrite တစ်ခုထဲမှာ parameters တွေ သုံးတဲ့အခါ — `destination` ထဲမှာ parameter ဘယ်တစ်ခုမှ မသုံးထားဘူးဆိုရင် parameters တွေကို query ထဲမှာ default အနေနဲ့ ထည့်ပေးပါတယ်။

```js filename="next.config.js"
module.exports = {
  rewrites() {
    return [
      {
        source: '/old-about/:path*',
        destination: '/about', // The :path parameter isn't used here so will be automatically passed in the query
      },
    ]
  },
}
```

Destination ထဲမှာ parameter တစ်ခု သုံးထားရင် — ဘယ် parameter ကိုမှ query ထဲမှာ အလိုအလျောက် ထည့်ပေးမှာ မဟုတ်ပါဘူး။

```js filename="next.config.js"
module.exports = {
  rewrites() {
    return [
      {
        source: '/docs/:path*',
        destination: '/:path*', // The :path parameter is used here so will not be automatically passed in the query
      },
    ]
  },
}
```

Destination ထဲမှာ parameter တစ်ခု သုံးထားပြီးသား ဖြစ်ရင်တောင် — `destination` ထဲမှာ query ကို သတ်မှတ်ပြီး parameters တွေကို ကိုယ်တိုင် ထည့်ပေးနိုင်ပါသေးတယ်။

```js filename="next.config.js"
module.exports = {
  rewrites() {
    return [
      {
        source: '/:first/:second',
        destination: '/:first?second=:second',
        // Since the :first parameter is used in the destination the :second parameter
        // will not automatically be added in the query although we can manually add it
        // as shown above
      },
    ]
  },
}
```

## Path matching (လမ်းကြောင်း ကိုက်ညီမှု)

Path matches တွေကို ခွင့်ပြုပါတယ် — ဥပမာ `/blog/:slug` က `/blog/first-post` ကို match လုပ်ပါတယ် (nested paths တွေ မပါ):

```js filename="next.config.js"
module.exports = {
  rewrites() {
    return [
      {
        source: '/blog/:slug',
        destination: '/news/:slug', // Matched parameters can be used in the destination
      },
    ]
  },
}
```

`/blog/:slug` pattern က `/blog/first-post` နဲ့ `/blog/post-1` တို့ကို match လုပ်ပေမယ့် — `/blog/a/b` (nested paths မပါ) ကို match မလုပ်ပါဘူး။ Patterns တွေက အစပိုင်းမှာ ကျောက်ချထားပြီး — `/blog/:slug` က `/archive/blog/first-post` ကို match မလုပ်ပါဘူး။

Parameters တွေပေါ်မှာ modifiers တွေ သုံးနိုင်ပါတယ်: `*` (zero or more), `+` (one or more), `?` (zero or one)။ ဥပမာ — `/blog/:slug*` က `/blog`, `/blog/a`, နဲ့ `/blog/a/b/c` တို့ကို match လုပ်ပါတယ်။

[path-to-regexp](https://github.com/pillarjs/path-to-regexp) documentation အကြောင်း နောက်ထပ် အသေးစိတ် ဖတ်ရှုပါ။

### Wildcard path matching

Wildcard path တစ်ခုကို match လုပ်ဖို့ — parameter တစ်ခုရဲ့ နောက်မှာ `*` ကို သုံးနိုင်ပါတယ်။ ဥပမာ `/blog/:slug*` က `/blog/a/b/c/d/hello-world` ကို match လုပ်ပါလိမ့်မယ်:

```js filename="next.config.js"
module.exports = {
  rewrites() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/news/:slug*', // Matched parameters can be used in the destination
      },
    ]
  },
}
```

### Regex path matching

Regex path တစ်ခုကို match လုပ်ဖို့ — parameter တစ်ခုရဲ့ နောက်မှာ regex ကို parenthesis ထဲ ထည့်နိုင်ပါတယ်။ ဥပမာ `/blog/:slug(\\d{1,})` က `/blog/123` ကို match လုပ်ပြီး `/blog/abc` ကို match မလုပ်ပါဘူး:

```js filename="next.config.js"
module.exports = {
  rewrites() {
    return [
      {
        source: '/old-blog/:post(\\d{1,})',
        destination: '/blog/:post', // Matched parameters can be used in the destination
      },
    ]
  },
}
```

အောက်ပါ character တွေ `(`, `)`, `{`, `}`, `[`, `]`, `|`, `\`, `^`, `.`, `:`, `*`, `+`, `-`, `?`, `$` ကို regex path matching အတွက် သုံးပါတယ် — ဒါကြောင့် `source` ထဲမှာ သာမန် (non-special) တန်ဖိုးတွေအဖြစ် သုံးချင်ရင် ရှေ့မှာ `\\` ထည့်ပြီး escape လုပ်ရပါမယ်:

```js filename="next.config.js"
module.exports = {
  rewrites() {
    return [
      {
        // this will match `/english(default)/something` being requested
        source: '/english\\(default\\)/:slug',
        destination: '/en-us/:slug',
      },
    ]
  },
}
```

## Header, Cookie, and Query Matching

Header, cookie (သို့) query values တွေပါ `has` field နဲ့ ကိုက်ညီမှ (သို့) `missing` field နဲ့ မကိုက်ညီမှသာ rewrite တစ်ခုကို သက်ရောက်စေချင်တဲ့အခါ ဒါတွေကို သုံးနိုင်ပါတယ်။ Rewrite ကို သက်ရောက်စေဖို့ — `source` ရော `has` items အားလုံးပါ match လုပ်ရပြီး `missing` items အားလုံးက match မလုပ်ရပါဘူး။

`has` နဲ့ `missing` items တွေမှာ အောက်ပါ fields တွေ ရှိနိုင်ပါတယ်:

- `type`: `String` — `header`, `cookie`, `host`, (သို့) `query` ဖြစ်ရပါမယ်။
- `key`: `String` — ရွေးထားတဲ့ type ကနေ ဘယ် key ကို match လုပ်မလဲ ဆိုတာပါ။
- `value`: `String` (သို့) `undefined` — စစ်ဆေးရမယ့် တန်ဖိုးပါ၊ `undefined` ဆိုရင် ဘယ် value မဆို match လုပ်ပါတယ်။ Value ရဲ့ သီးခြား အစိတ်အပိုင်းတစ်ခုကို ဖမ်းယူဖို့ regex ပုံစံ string ကို သုံးနိုင်ပါတယ် — ဥပမာ `first-second` အတွက် `first-(?<paramName>.*)` ကို သုံးထားရင် `second` ကို destination ထဲမှာ `:paramName` နဲ့ သုံးနိုင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  rewrites() {
    return [
      // if the header `x-rewrite-me` is present,
      // this rewrite will be applied
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-rewrite-me',
          },
        ],
        destination: '/another-page',
      },
      // if the header `x-rewrite-me` is not present,
      // this rewrite will be applied
      {
        source: '/:path*',
        missing: [
          {
            type: 'header',
            key: 'x-rewrite-me',
          },
        ],
        destination: '/another-page',
      },
      // if the source, query, and cookie are matched,
      // this rewrite will be applied
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
        destination: '/:path*/home',
      },
      // if the header `x-authorized` is present and
      // contains a matching value, this rewrite will be applied
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-authorized',
            value: '(?<authorized>yes|true)',
          },
        ],
        destination: '/home?authorized=:authorized',
      },
      // if the host is `example.com`,
      // this rewrite will be applied
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },
        ],
        destination: '/another-page',
      },
    ]
  },
}
```

## External URL တစ်ခုဆီ rewriting လုပ်ခြင်း

[Multiple Zones အသုံးပြုခြင်း](https://github.com/vercel/next.js/tree/canary/examples/with-zones) ဥပမာကို ကြည့်နိုင်ပါတယ်။

Rewrites တွေက external URL တစ်ခုဆီ rewrite လုပ်နိုင်စေပါတယ် — ဒါက Next.js ကို တဖြည်းဖြည်း (incrementally) စတင် အသုံးပြုဖို့ အထူး အသုံးဝင်ပါတယ်။ အောက်ပါဥပမာက သင့် main app ရဲ့ `/blog` route ကို external site တစ်ခုဆီ redirect လုပ်တဲ့ rewrite တစ်ခုပါ:

```js filename="next.config.js"
module.exports = {
  rewrites() {
    return [
      {
        source: '/blog',
        destination: 'https://example.com/blog',
      },
      {
        source: '/blog/:slug',
        destination: 'https://example.com/blog/:slug', // Matched parameters can be used in the destination
      },
    ]
  },
}
```

`trailingSlash: true` ကို သုံးနေရင် — `source` parameter ထဲမှာလည်း trailing slash တစ်ခု ထည့်ဖို့ လိုအပ်ပါတယ်။ Destination server ကလည်း trailing slash မျှော်လင့်ထားရင် — `destination` parameter ထဲမှာလည်း ထည့်ပေးသင့်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  trailingSlash: true,
  rewrites() {
    return [
      {
        source: '/blog/',
        destination: 'https://example.com/blog/',
      },
      {
        source: '/blog/:path*/',
        destination: 'https://example.com/blog/:path*/',
      },
    ]
  },
}
```

### Next.js ကို တဖြည်းဖြည်း စတင် အသုံးပြုခြင်း (Incremental adoption)

Next.js routes အားလုံးကို စစ်ပြီးတဲ့အခါ — ရှိပြီးသား website တစ်ခုဆီ proxying လုပ်ဖို့ Next.js ကို fall back လုပ်ခိုင်းနိုင်ပါတယ်။

ဒါကြောင့် pages တွေကို Next.js ဆီ တဖြည်းဖြည်း migrate လုပ်တဲ့အခါ — rewrites configuration ကို ပြောင်းစရာ မလိုပါဘူး:

```js filename="next.config.js"
module.exports = {
  rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: `https://custom-routes-proxying-endpoint.vercel.app/:path*`,
        },
      ],
    }
  },
}
```

### basePath နဲ့တွဲသုံးတဲ့ rewrites

Rewrites တွေနဲ့အတူ [`basePath` support](/docs/nextjs/next-config-base-path) ကို အသုံးချတဲ့အခါ — rewrite တစ်ခုမှာ `basePath: false` မထည့်ထားဘူးဆိုရင် `source` ရော `destination` ပါ `basePath` နဲ့ အလိုအလျောက် prefix လုပ်ပေးပါတယ်:

```js filename="next.config.js"
module.exports = {
  basePath: '/docs',

  rewrites() {
    return [
      {
        source: '/with-basePath', // automatically becomes /docs/with-basePath
        destination: '/another', // automatically becomes /docs/another
      },
      {
        // does not add /docs to /without-basePath since basePath: false is set
        // Note: this cannot be used for internal rewrites e.g. `destination: '/another'`
        source: '/without-basePath',
        destination: 'https://example.com',
        basePath: false,
      },
    ]
  },
}
```

## Version History

| Version   | အပြောင်းအလဲ          |
| --------- | ------------------ |
| `v13.3.0` | `missing` ထည့်သွင်း။ |
| `v10.2.0` | `has` ထည့်သွင်း။     |
| `v9.5.0`  | Rewrites စတင် မိတ်ဆက်။ |
