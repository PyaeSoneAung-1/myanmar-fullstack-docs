---
title: "Routing with @next/routing (@next/routing ဖြင့် routing)"
description: "@next/routing ကို သုံးပြီး adapter ထဲ Next.js route matching အပြုအမူ ထည့်သွင်းခြင်း"
order: 251
source: "https://nextjs.org/docs/app/api-reference/adapters/routing-with-next-routing"
status: translated
updated: 2026-09-03
---

`onBuildComplete` ကနေ ရတဲ့ data တွေနဲ့ Next.js ရဲ့ route matching အပြုအမူကို ပြန်လည် ဖော်ထုတ်ဖို့ — [`@next/routing`](https://www.npmjs.com/package/@next/routing) ကို သုံးနိုင်ပါတယ်။

```typescript
import { resolveRoutes } from '@next/routing'

const pathnames = [
  ...outputs.pages,
  ...outputs.pagesApi,
  ...outputs.appPages,
  ...outputs.appRoutes,
  ...outputs.staticFiles,
].map((output) => output.pathname)

const result = await resolveRoutes({
  url: new URL(requestUrl),
  buildId,
  basePath: config.basePath || '',
  i18n: config.i18n,
  headers: new Headers(requestHeaders),
  requestBody, // ReadableStream
  pathnames,
  routes: routing,
  invokeMiddleware: async (ctx) => {
    // platform-specific middleware invocation
    return {}
  },
})

if (result.resolvedPathname) {
  console.log('Resolved pathname:', result.resolvedPathname)
  console.log('Resolved query:', result.resolvedQuery)
  console.log('Invocation target:', result.invocationTarget)
}
```

`resolveRoutes()` က အောက်ပါတို့ကို ပြန်ပေးပါတယ်:

- `middlewareResponded`: middleware က response တစ်ခု ပို့ပြီးသားဖြစ်ရင် `true` ဖြစ်ပါတယ် (ဒီအခါ adapter က entrypoint တစ်ခုကို invoke မလုပ်သင့်ပါဘူး)။
- `externalRewrite`: Routing က external rewrite destination တစ်ခုဆီ resolve ဖြစ်သွားတဲ့အခါ `URL` တစ်ခုပါ။
- `redirect`: Request ကို redirect လုပ်သင့်တဲ့အခါ `url` (`URL`) နဲ့ `status` ပါဝင်တဲ့ object တစ်ခုပါ။
- `resolvedPathname`: Next.js routing က ရွေးချယ်လိုက်တဲ့ route ရဲ့ pathname ပါ။ Dynamic routes တွေအတွက် — ဒါက `/blog/[slug]` လိုမျိုး ကိုက်ညီသွားတဲ့ route template ဖြစ်ပါတယ်။
- `resolvedQuery`: Rewrites (သို့) middleware တွေက search params တွေကို ပေါင်းထည့် (သို့) အစားထိုးပြီးနောက်က နောက်ဆုံး query ပါ။
- `invocationTarget`: ကိုက်ညီသွားတဲ့ route အတွက် invoke လုပ်ရမယ့် တိကျတဲ့ pathname နဲ့ query ပါ။
- `resolvedHeaders`: Routing အတွင်း ပေါင်းထည့် (သို့) ပြုပြင်လိုက်တဲ့ headers တွေ ပါဝင်တဲ့ `Headers` object တစ်ခုပါ။
- `status`: Routing က သတ်မှတ်ပေးလိုက်တဲ့ HTTP status code တစ်ခုပါ (ဥပမာ — redirect (သို့) rewrite rule တစ်ခုကနေ ဖြစ်လာတာမျိုး)။
- `routeMatches`: Dynamic route segments တွေကနေ ထုတ်ယူထားတဲ့ named matches တွေရဲ့ record တစ်ခုပါ။

ဥပမာ — `/blog/post-1?draft=1` က `/blog/[slug]?slug=post-1` နဲ့ ကိုက်ညီတယ်ဆိုရင် — `resolvedPathname` က `/blog/[slug]` ဖြစ်ပြီး — `invocationTarget.pathname` ကတော့ `/blog/post-1` ဖြစ်ပါတယ်။
