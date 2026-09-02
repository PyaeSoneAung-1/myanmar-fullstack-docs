---
title: "headers function (HTTP request headers ဖတ်ခြင်း)"
description: "headers() — Server Components တွေမှာ HTTP incoming request headers တွေကို ဖတ်နိုင်တဲ့ async function; read-only Web Headers object ပြန်ပေး"
order: 35
source: "https://nextjs.org/docs/app/api-reference/functions/headers"
status: translated
updated: 2026-09-02
---

`headers` က **async** function တစ်ခုပါ — [Server Component](/docs/nextjs/server-client-components) တစ်ခုထဲကနေ HTTP incoming request headers တွေကို **ဖတ်ဖို့** ခွင့်ပြုပါတယ်။

```tsx
// app/page.tsx
import { headers } from 'next/headers'

export default async function Page() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
}
```

## Reference

### Parameters

`headers` က parameter ဘာမှ လက်ခံပါဘူး။

### Returns

`headers` က **read-only** [Web Headers](https://developer.mozilla.org/docs/Web/API/Headers) object တစ်ခုကို ပြန်ပေးပါတယ်။

- [`Headers.entries()`](https://developer.mozilla.org/docs/Web/API/Headers/entries): ဒီ object ထဲက key/value pairs အားလုံးကို ဖြတ်သွားလို့ရတဲ့ [`iterator`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols) တစ်ခုကို ပြန်ပေးပါတယ်။
- [`Headers.forEach()`](https://developer.mozilla.org/docs/Web/API/Headers/forEach): ဒီ `Headers` object ထဲက key/value pair တစ်ခုချင်းစီအတွက် ပေးထားတဲ့ function တစ်ခုကို တစ်ကြိမ်စီ execute လုပ်ပါတယ်။
- [`Headers.get()`](https://developer.mozilla.org/docs/Web/API/Headers/get): နာမည်ပေးထားတဲ့ header တစ်ခုရဲ့ တန်ဖိုးအားလုံးပါဝင်တဲ့ [`String`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) sequence တစ်ခုကို ပြန်ပေးပါတယ်။
- [`Headers.has()`](https://developer.mozilla.org/docs/Web/API/Headers/has): `Headers` object တစ်ခုထဲမှာ header တစ်ခု ပါဝင်မဝင် ဖော်ပြတဲ့ boolean တစ်ခု ပြန်ပေးပါတယ်။
- [`Headers.keys()`](https://developer.mozilla.org/docs/Web/API/Headers/keys): ဒီ object ထဲက key/value pairs တွေရဲ့ keys အားလုံးကို ဖြတ်သွားလို့ရတဲ့ [`iterator`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols) တစ်ခုကို ပြန်ပေးပါတယ်။
- [`Headers.values()`](https://developer.mozilla.org/docs/Web/API/Headers/values): ဒီ object ထဲက key/value pairs တွေရဲ့ values အားလုံးကို ဖြတ်သွားလို့ရတဲ့ [`iterator`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols) တစ်ခုကို ပြန်ပေးပါတယ်။

## သိထားသင့်သည် (Good to know)

- `headers` က **asynchronous** function တစ်ခုဖြစ်ပြီး promise တစ်ခုကို ပြန်ပေးပါတယ်။ `async/await` (သို့) React ရဲ့ [`use`](https://react.dev/reference/react/use) function ကို သုံးရပါမယ်။
  - Version 14 နဲ့ အောက်ပိုင်းတွေမှာ `headers` က synchronous function တစ်ခုပါ။ Backwards compatibility အတွက် Next.js 15 မှာ synchronous အဖြစ် ဆက်သုံးလို့ရပါသေးတယ် — ဒါပေမယ့် ဒီအပြုအမူက နောင်မှာ deprecated ဖြစ်ပါမယ်။
- `headers` က read-only ဖြစ်လို့ — outgoing request headers တွေကို `set` (သို့) `delete` လုပ်လို့ မရပါဘူး။
- `headers` က [Request-time API](https://nextjs.org/docs/app/glossary#request-time-apis) တစ်ခုပါ — ပြန်ပေးတဲ့ တန်ဖိုးတွေကို ကြိုတင် မသိနိုင်ပါဘူး။ သုံးလိုက်ရင် route ကို **[dynamic rendering](https://nextjs.org/docs/app/glossary#dynamic-rendering)** အဖြစ် ရွေးချယ်လိုက်သလို ဖြစ်သွားပါတယ်။
- [Cache Components](/docs/nextjs/caching) နဲ့ဆို — [`<Suspense>`](https://react.dev/reference/react/Suspense) boundary ရဲ့ အပြင်မှာ `headers()` ကို ခေါ်လိုက်ရင် route ကို prerender လုပ်လို့ မရတော့ပါဘူး။ ဖြေရှင်းနည်းတွေအတွက် [Next.js encountered runtime data during prerendering](https://nextjs.org/docs/messages/blocking-prerender-runtime) ကို ကြည့်ပါ။

## ဥပမာများ

### Authorization header ကို အသုံးပြုခြင်း

```tsx
// app/page.tsx
import { headers } from 'next/headers'

export default async function Page() {
  const authorization = (await headers()).get('authorization')
  const res = await fetch('...', {
    headers: { authorization }, // Authorization header ကို forward လုပ်ပါ
  })
  const user = await res.json()

  return <h1>{user.name}</h1>
}
```

## Version History

| Version      | အပြောင်းအလဲ                                                                      |
| ------------ | ------------------------------------------------------------------------------- |
| `v15.0.0-RC` | `headers` က async function ဖြစ်လာပါတယ်။ [codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#150) တစ်ခု ရနိုင်ပါတယ်။ |
| `v13.0.0`    | `headers` စတင် မိတ်ဆက်။                                                       |
