---
title: "permanentRedirect function (အမြဲတမ်း redirect — 308)"
description: "permanentRedirect() — Server/Client Components, Route Handlers, Server Functions တွေကနေ user ကို အမြဲတမ်း (308 Permanent) redirect လုပ်ပေးတဲ့ function"
order: 37
source: "https://nextjs.org/docs/app/api-reference/functions/permanentRedirect"
status: translated
updated: 2026-09-02
---

`permanentRedirect` function က user ကို တခြား URL တစ်ခုဆီ **အမြဲတမ်း (permanently)** redirect လုပ်နိုင်စေပါတယ်။ `permanentRedirect` ကို [Server Components](/docs/nextjs/server-client-components), Client Components, [Route Handlers](/docs/nextjs/route-handlers) နဲ့ [Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data) တွေမှာ သုံးနိုင်ပါတယ်။

[Streaming](/docs/nextjs/streaming) context တစ်ခုထဲမှာ သုံးလိုက်ရင် — redirect ကို client ဘက်မှာ ထုတ်လွှတ်ဖို့ meta tag တစ်ခုကို ထည့်ပေးပါတယ်။ Server Action တစ်ခုထဲမှာဆိုရင် — JavaScript ရနိုင်တဲ့အခါ `permanentRedirect` က client-side navigation ကို လုပ်ဆောင်ပြီး၊ progressive enhancement form submissions တွေအတွက်တော့ 303 HTTP redirect response ကို ပေးပါတယ်။ ကျန်တဲ့ အခြေအနေတွေမှာတော့ 308 (Permanent) HTTP redirect response ကို ပေးပါတယ်။

Resource တစ်ခု မတည်ရှိဘူးဆိုရင် — [`notFound`](/docs/nextjs/not-found) function ကို သုံးနိုင်ပါတယ်။

## Parameters

`permanentRedirect` function က arguments နှစ်ခု လက်ခံပါတယ်:

```js
permanentRedirect(path, type)
```

| Parameter | Type                                                          | ဖော်ပြချက်                                                    |
| --------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| `path`    | `string`                                                      | Redirect လုပ်မယ့် URL။ Relative (သို့) absolute path ဖြစ်နိုင်ပါတယ်။ |
| `type`    | `'replace'` (default) (သို့) `'push'` (Server Actions မှာ default) | လုပ်ဆောင်မယ့် redirect အမျိုးအစား။                            |

ပုံမှန်အားဖြင့် `permanentRedirect` က [Server Actions](https://nextjs.org/docs/app/getting-started/mutating-data) တွေမှာ `push` (browser history stack ထဲကို entry အသစ်တစ်ခု ထည့်ခြင်း) ကို သုံးပြီး — အခြားနေရာတွေမှာတော့ `replace` (browser history stack ထဲက လက်ရှိ URL ကို အစားထိုးခြင်း) ကို သုံးပါတယ်။ `type` parameter ကို သတ်မှတ်ပြီး ဒီအပြုအမူကို ကျော်လွန်နိုင်ပါတယ်။

`RedirectType` object ထဲမှာ `type` parameter အတွက် ရနိုင်တဲ့ options တွေ ပါဝင်ပါတယ်။

```ts
import { permanentRedirect, RedirectType } from 'next/navigation'

permanentRedirect('/redirect-to', RedirectType.replace)
// (သို့)
permanentRedirect('/redirect-to', RedirectType.push)
```

Server Components တွေမှာ သုံးတဲ့အခါ `type` parameter က သက်ရောက်မှု မရှိပါဘူး။

## Returns

`permanentRedirect` က တန်ဖိုး ဘာမှ ပြန်မပေးပါဘူး။

## အပြုအမူ (Behavior)

- Server Actions နဲ့ Route Handlers တွေမှာ — error တစ်ခုကို throw လုပ်လို့ `try/catch` သုံးနေရင် `permanentRedirect` ကို `try` block ရဲ့ **အပြင်မှာ** ခေါ်ရပါမယ်။
- 308 (Permanent) အစား 307 (Temporary) HTTP redirect ကို လိုချင်ရင် — [`redirect`](/docs/nextjs/redirect) function ကို သုံးနိုင်ပါတယ်။

## ဥပမာ

`permanentRedirect()` ကို ခေါ်လိုက်တာက `NEXT_REDIRECT` error တစ်ခုကို throw လုပ်ပြီး — အဲဒီ error ဖြစ်ခဲ့တဲ့ route segment ရဲ့ rendering ကို ရပ်တန့်စေပါတယ်။

```tsx
// app/team/[id]/page.tsx
import { permanentRedirect } from 'next/navigation'

async function fetchTeam(id: string) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const team = await fetchTeam(id)
  if (!team) {
    permanentRedirect('/login')
  }

  // ...
}
```

> **သိထားသင့်သည်:** `permanentRedirect` က TypeScript ရဲ့ [`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never) type ကို သုံးထားလို့ — `return permanentRedirect()` လို့ ရေးစရာ မလိုပါဘူး။

Redirect တွေ အသုံးပြုပုံနဲ့ ပတ်သက်ပြီး ပိုမို သိရှိရန် — [Redirecting guide](/docs/nextjs/redirecting) ကို ကြည့်ပါ။
