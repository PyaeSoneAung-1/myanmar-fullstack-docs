---
title: "Directives (directives များ နေရာချထားပုံနဲ့ စည်းမျဉ်းများ)"
description: "React နဲ့ Next.js directives — 'use client', 'use server', 'use cache' — က compiler/bundler ကို ညွှန်ကြားပုံ; directive တစ်ခုကို ဘယ်နေရာမှာ ထားရမလဲ (file-level vs function-level), တစ်ခုချင်းစီရဲ့ လိုအပ်ချက်များ (async, serializable) နဲ့ နေရာချထားမှုအလိုက် cache scope"
order: 264
source: "https://nextjs.org/docs/app/api-reference/directives"
status: translated
updated: 2026-09-05
---

Directives တွေက compiler နဲ့ bundler ကို — သူတို့ ဝန်းရံထားတဲ့ code တွေကို ဘယ်လို သဘောထားရမလဲ ပြောပြတဲ့ string literals (စာသား တန်ဖိုးများ) တွေ ဖြစ်ပါတယ်။ သူတို့ချည်းသက်သက် ကြည့်ရင် directives တွေက သာမန် strings တွေလို ထင်ရပေမယ့် — Next.js နဲ့ React က သူတို့ လွှမ်းခြုံထားတဲ့ code တွေကို ပြောင်းလဲပေးတဲ့ ညွှန်ကြားချက်တွေအဖြစ် ဖတ်ပါတယ်။ Directive တစ်ခုက client entry point (သို့) Server Function တစ်ခုကို ဖန်တီးနိုင်သလို — function တစ်ခု (သို့) component တစ်ခုရဲ့ output ကိုလည်း cache လုပ်နိုင်ပါတယ်။

| Directive | သတ်မှတ်သူ (Defined by) | အကျိုးသက်ရောက်မှု |
| --------- | ----------------------- | ------------------- |
| [`'use client'`](/docs/nextjs/use-client) | React | Server Components တွေကနေ client entry point တစ်ခုကို ဖန်တီးပေးသည် |
| [`'use server'`](/docs/nextjs/use-server) | React | Server-side functions တွေကို Server Functions အဖြစ် ထုတ်ဖော်ပေးသည် |
| [`'use cache'`](/docs/nextjs/use-cache) | Next.js | Code ရဲ့ inputs တွေကို အခြေခံပြီး output တွေကို cache လုပ်ကာ ပြန်လည် အသုံးပြုပေးသည် |

`'use cache'` directive မှာ [`'use cache: remote'`](/docs/nextjs/use-cache-remote) နဲ့ [`'use cache: private'`](/docs/nextjs/use-cache-private) ဆိုတဲ့ variants (မူကွဲများ) တွေလည်း ရှိပါတယ်။ Cache လုပ်ထားတဲ့ entries တွေကို ဘယ်မှာ သိမ်းမလဲ ထိန်းချုပ်ဖို့ — custom [cache handlers](/docs/nextjs/next-config-cache-handlers) တွေကို configure လုပ်နိုင်ပါတယ်။

> **သိထားသင့်သည်:** Next.js က directives တွေကို development ရော production ရော — compilation (compile လုပ်ချိန်) အတွင်း နှစ်ခုလုံးမှာ အသုံးချပါတယ်။
>
> Error overlay, indicators နဲ့ stack traces တွေက — ထုတ်လုပ်လိုက်တဲ့ output အစား သင့် source file နဲ့ line ကိုပဲ ညွှန်ပြပါတယ်။

## Directive တစ်ခုကို ဘယ်နေရာမှာ ထားရမလဲ

`'use client'` directive က imports တွေ မတိုင်ခင် — file ရဲ့ ထိပ်ဆုံးမှာ ရှိရပါမယ်။ ၎င်းက module တစ်ခုလုံးကို သက်ရောက်ပြီး — module ကို bundle လုပ်ကာ browser ဆီ ပို့ပေးလို့ — file တစ်ခုလုံးအတွက် boundary (နယ်နိမိတ်) တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ `'use client'` ကို inline သုံးလို့ မရပါဘူး။

`'use server'` (သို့) `'use cache'` ကို file ရဲ့ ထိပ်မှာ ထားရင် — exports တိုင်းကို သက်ရောက်စေပြီး — function တစ်ခုရဲ့ ထိပ်မှာ ထားရင်တော့ — အဲဒီ function တစ်ခုတည်းကိုပဲ သက်ရောက်ပါတယ်။

```ts filename="app/data.ts" switcher
// File-level: exports တိုင်းကို သက်ရောက်သည်
'use cache'

export async function getUser(id: string) {
  return { id }
}
```

```js filename="app/data.js" switcher
// File-level: exports တိုင်းကို သက်ရောက်သည်
'use cache'

export async function getUser(id) {
  return { id }
}
```

```tsx filename="app/user.tsx" switcher
// Function-level: ဒီ function တစ်ခုကိုပဲ သက်ရောက်သည်
export async function User() {
  'use cache'
  return <p>User</p>
}
```

```jsx filename="app/user.js" switcher
// Function-level: ဒီ function တစ်ခုကိုပဲ သက်ရောက်သည်
export async function User() {
  'use cache'
  return <p>User</p>
}
```

`'use server'` နဲ့ `'use cache'` တွေကို server modules တွေထဲမှာပဲ ကြေညာပါ — `'use client'` module တစ်ခုထဲမှာ မဟုတ်ပါဘူး။

`'use server'` (သို့) `'use cache'` function တစ်ခုကို Client Component တစ်ခုထဲမှာ import လုပ်ဖို့ဆိုရင် — directive ကို server module ရဲ့ ထိပ်မှာ ထားပါ။ Client Component က — server ပေါ်မှာ function ကို invoke (ခေါ်ယူ) လုပ်ပေးတဲ့ reference (ရည်ညွှန်းချက်) တစ်ခုကို လက်ခံရရှိပါတယ်။

Directive က function တစ်ခု (သို့) component တစ်ခုကိုပဲ သက်ရောက်စေချင်တယ်ဆိုရင် — function ရဲ့ အတွင်းမှာ ထားပါ။ Export လုပ်ထားတဲ့ functions အများအပြားကို သက်ရောက်စေချင်တယ်ဆိုရင် — တစ်ခုချင်းစီမှာ ထပ်ခါထပ်ခါ ရေးနေစရာ မလိုအောင် — file ရဲ့ ထိပ်မှာ ထားပါ။

File-level `'use server'` (သို့) `'use cache'` directive တစ်ခုရဲ့ လွှမ်းခြုံမှုအောက်က export လုပ်ထားတဲ့ function တိုင်းက `async` ဖြစ်ရပါမယ်။

## Directive တစ်ခုချင်းစီရဲ့ လိုအပ်ချက်များ (What each directive requires)

Directive တစ်ခုက ၎င်း လွှမ်းခြုံထားတဲ့ code အပေါ် စည်းမျဉ်းတွေ ချမှတ်ပါတယ်:

- **`'use client'`** က ၎င်းရဲ့ exports တွေကို server နဲ့ client ကြား boundary အဖြစ် မှတ်သားပါတယ်။ Boundary ကို ဖြတ်သွားတဲ့ Client Component props တွေက [serializable](https://react.dev/reference/rsc/use-client#serializable-types) (အသွင်ပြောင်း၍ ရနိုင်သော) ဖြစ်ရပါမယ်။ Event handlers လိုမျိုး သာမန် functions တွေက ဖြတ်သွားလို့ မရပေမယ့် — Server Functions တွေကတော့ references အဖြစ် ဖြတ်သွားနိုင်ပါတယ်။
- **`'use server'`** က ၎င်း လွှမ်းခြုံထားတဲ့ functions တွေကို [Server Functions](/docs/nextjs/glossary#server-function) အဖြစ် မှတ်သားပါတယ်။ Server Functions တွေက `async` ဖြစ်ရပါမယ်။ Client Component တစ်ခုကနေ invoke လုပ်တဲ့အခါ — သူတို့ရဲ့ arguments တွေနဲ့ return values တွေကို network ပေါ်မှာ serialize လုပ်ပြီး ပို့ပေးပါတယ်။ Client Component က — server ပေါ်မှာ function ကို invoke လုပ်ပေးတဲ့ reference တစ်ခုကို လက်ခံရရှိပြီး — function ရဲ့ code ကိုတော့ မဟုတ်ပါဘူး။
- **`'use cache'`** က ၎င်း လွှမ်းခြုံထားတဲ့ functions (သို့) components တွေရဲ့ output တွေကို — သူတို့ရဲ့ inputs တွေကို အခြေခံပြီး cache လုပ်ပါတယ်။ Cache လုပ်ထားတဲ့ functions နဲ့ components တွေက `async` ဖြစ်ရပြီး — သူတို့ရဲ့ arguments တွေနဲ့ return values တွေက serializable ဖြစ်ရပါမယ်။ Cached code က စစ်ဆေးခြင်းမရှိဘဲ ဖြတ်သန်းပေးလိုက်တဲ့ non-serializable values တွေကတော့ ချွင်းချက်ပါ။ Cache လုပ်ထားတဲ့ code က `cookies()`, `headers()` (သို့) `searchParams` လိုမျိုး request-time APIs တွေကို တိုက်ရိုက် ဖတ်လို့ မရပါဘူး။

Page (သို့) layout file တစ်ခုရဲ့ ထိပ်မှာ `'use cache'` ထားတဲ့အခါ — `generateMetadata` နဲ့ `generateStaticParams` လိုမျိုး export လုပ်ထားတဲ့ functions တွေက `async` ဖြစ်ရပါမယ်။

## နေရာချထားမှုက ဘာကို cache လုပ်မလဲ ဆုံးဖြတ်ပေး

`'use cache'` နဲ့ဆိုရင် — နေရာချထားမှုက cache entry တစ်ခုရဲ့ အတိုင်းအတာ (scope) ကို ဆုံးဖြတ်ပေးပါတယ်။ Page တစ်ခုရဲ့ ထိပ်မှာ ထားတဲ့ directive တစ်ခုက — page ရဲ့ output နဲ့ ၎င်း import လုပ်ထားတဲ့ components တွေကို cache လုပ်ပါတယ်။ Data function တစ်ခုရဲ့ အတွင်းမှာ ထားတဲ့ directive အလားတူကတော့ — အဲဒီ function ရဲ့ ရလဒ်ကိုပဲ cache လုပ်ပါတယ်။ Data request တစ်ခုတည်းက အလုပ်ရှုပ်ထွေးတဲ့ (ဈေးကြီးတဲ့) အလုပ်ကို လုပ်နေတယ်ဆိုရင် — page ကို မဟုတ်ဘဲ အဲဒီ function ကိုပဲ cache လုပ်ပါ။

[`'use cache: remote'`](/docs/nextjs/use-cache-remote) နဲ့ဆိုရင် — remote cache handler တစ်ခုက entries တွေကို သိမ်းဆည်းပေးပါတယ်။ Entries တွေ ပိုကြီးလာတာနဲ့အမျှ — storage နဲ့ network စရိတ်တွေလည်း ပိုများလာနိုင်ပါတယ်။
