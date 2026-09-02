---
title: "redirect function (URL တစ်ခုဆီ ပြောင်းရွှေ့ပို့ခြင်း)"
description: "redirect() — Server/Client Components, Route Handlers, Server Functions တွေကနေ user ကို တခြား URL ဆီ ရွှေ့ပြောင်းပေးတဲ့ function; 307/303 responses နဲ့ RedirectType အကြောင်း"
order: 36
source: "https://nextjs.org/docs/app/api-reference/functions/redirect"
status: translated
updated: 2026-09-02
---

`redirect` function က user ကို တခြား URL တစ်ခုဆီ ပြောင်းရွှေ့ပို့ဆောင် (redirect) လုပ်နိုင်စေပါတယ်။ `redirect` ကို [Server နဲ့ Client Components](/docs/nextjs/server-client-components) တွေမှာ render လုပ်နေချိန်၊ [Route Handlers](/docs/nextjs/route-handlers) တွေနဲ့ [Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data) တွေမှာ သုံးနိုင်ပါတယ်။

[Streaming](/docs/nextjs/streaming) context တစ်ခုထဲမှာ သုံးလိုက်ရင် — redirect ကို client ဘက်မှာ ထုတ်လွှတ်ဖို့ meta tag တစ်ခုကို ထည့်ပေးပါတယ်။ Server Action တစ်ခုထဲမှာဆိုရင် — JavaScript ရနိုင်တဲ့အခါ `redirect` က client-side navigation ကို လုပ်ဆောင်ပြီး၊ progressive enhancement form submissions (JavaScript မလိုဘဲ အလုပ်လုပ်တဲ့ form တင်သွင်းမှု) တွေအတွက်တော့ 303 HTTP redirect response ကို ပေးပါတယ်။ ကျန်တဲ့ အခြေအနေတွေမှာတော့ 307 HTTP redirect response ကို ပေးပါတယ်။

Resource တစ်ခု မတည်ရှိဘူးဆိုရင် — [`notFound`](/docs/nextjs/not-found) function ကို သုံးနိုင်ပါတယ်။

## Reference

### Parameters

`redirect` function က arguments နှစ်ခု လက်ခံပါတယ်:

```js
redirect(path, type)
```

| Parameter | Type                                                          | ဖော်ပြချက်                                                    |
| --------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| `path`    | `string`                                                      | Redirect လုပ်မယ့် URL။ Relative (သို့) absolute path ဖြစ်နိုင်ပါတယ်။ |
| `type`    | `'replace'` (default) (သို့) `'push'` (Server Actions မှာ default) | လုပ်ဆောင်မယ့် redirect အမျိုးအစား။                            |

ပုံမှန်အားဖြင့် `redirect` က [Server Actions](https://nextjs.org/docs/app/getting-started/mutating-data) တွေမှာ `push` (browser history stack ထဲကို entry အသစ်တစ်ခု ထည့်ခြင်း) ကို သုံးပြီး — အခြားနေရာတွေမှာတော့ `replace` (browser history stack ထဲက လက်ရှိ URL ကို အစားထိုးခြင်း) ကို သုံးပါတယ်။ `type` parameter ကို သတ်မှတ်ပြီး ဒီအပြုအမူကို ကျော်လွန်နိုင်ပါတယ်။

`RedirectType` object ထဲမှာ `type` parameter အတွက် ရနိုင်တဲ့ options တွေ ပါဝင်ပါတယ်။

```ts
import { redirect, RedirectType } from 'next/navigation'

redirect('/redirect-to', RedirectType.replace)
// (သို့)
redirect('/redirect-to', RedirectType.push)
```

Server Components တွေမှာ သုံးတဲ့အခါ `type` parameter က သက်ရောက်မှု မရှိပါဘူး။

### Returns

`redirect` က တန်ဖိုး ဘာမှ ပြန်မပေးပါဘူး။

## အပြုအမူ (Behavior)

- Server Actions နဲ့ Route Handlers တွေမှာ — `try/catch` သုံးနေရင် `redirect` ကို `try` block ရဲ့ **အပြင်မှာ** ခေါ်သင့်ပါတယ်။
- 307 (Temporary) အစား 308 (Permanent) HTTP redirect ကို လိုချင်ရင် — [`permanentRedirect`](/docs/nextjs/permanent-redirect) function ကို သုံးနိုင်ပါတယ်။
- `redirect` က error တစ်ခုကို throw လုပ်ပါတယ် — ဒါကြောင့် `try/catch` သုံးနေရင် `try` block ရဲ့ **အပြင်မှာ** ခေါ်ရပါမယ်။
- Client Components တွေမှာ `redirect` ကို rendering လုပ်ငန်းစဉ်အတွင်းမှာ ခေါ်လို့ရပါတယ် — ဒါပေမယ့် event handlers တွေထဲမှာတော့ မရပါဘူး။ အဲဒီအစား [`useRouter`](https://nextjs.org/docs/app/api-reference/functions/use-router) hook ကို သုံးပါ။
- `redirect` က absolute URLs တွေကိုလည်း လက်ခံပြီး — external links တွေဆီ redirect လုပ်ဖို့ သုံးနိုင်ပါတယ်။
- Render လုပ်ငန်းစဉ် မစတင်ခင် redirect လုပ်ချင်ရင် — [next.config.js ထဲက redirects](/docs/nextjs/redirecting) (သို့) [Proxy](https://nextjs.org/docs/app/guides/redirecting#nextresponseredirect-in-proxy) ကို သုံးပါ။

## ဥပမာများ

### Server Component

`redirect()` ကို ခေါ်လိုက်တာက `NEXT_REDIRECT` error တစ်ခုကို throw လုပ်ပြီး — အဲဒီ error ဖြစ်ခဲ့တဲ့ route segment ရဲ့ rendering ကို ရပ်တန့်စေပါတယ်။

```tsx
// app/team/[id]/page.tsx
import { redirect } from 'next/navigation'

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
    redirect('/login')
  }

  // ...
}
```

> **သိထားသင့်သည်:** `redirect` က TypeScript ရဲ့ [`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never) type ကို သုံးထားလို့ — `return redirect()` လို့ ရေးစရာ မလိုပါဘူး။

### Client Component

`redirect` ကို Client Component တစ်ခုထဲမှာ တိုက်ရိုက် သုံးနိုင်ပါတယ်။

```tsx
// components/client-redirect.tsx
'use client'

import { redirect, usePathname } from 'next/navigation'

export function ClientRedirect() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin') && !pathname.includes('/login')) {
    redirect('/admin/login')
  }

  return <div>Login Page</div>
}
```

> **သိထားသင့်သည်:** Server-Side Rendering (SSR) အတွင်း ကနဦး page load မှာ Client Component တစ်ခုထဲက `redirect` ကို သုံးရင် — server-side redirect တစ်ခုကို လုပ်ဆောင်ပေးပါတယ်။

`redirect` ကို Client Component တစ်ခုကနေ Server Action တစ်ခုကတစ်ဆင့် သုံးနိုင်ပါတယ်။ User ကို redirect လုပ်ဖို့ event handler တစ်ခု လိုအပ်ရင်တော့ — [`useRouter`](https://nextjs.org/docs/app/api-reference/functions/use-router) hook ကို သုံးနိုင်ပါတယ်။

```tsx
// app/client-redirect.tsx
'use client'

import { navigate } from './actions'

export function ClientRedirect() {
  return (
    <form action={navigate}>
      <input type="text" name="id" />
      <button>Submit</button>
    </form>
  )
}
```

```ts
// app/actions.ts
'use server'

import { redirect } from 'next/navigation'

export async function navigate(data: FormData) {
  redirect(`/posts/${data.get('id')}`)
}
```

## FAQ

### `redirect` က ဘာကြောင့် 307 နဲ့ 308 ကို သုံးတာလဲ

`redirect()` ကို သုံးတဲ့အခါ — temporary redirect အတွက် `307`, permanent redirect အတွက် `308` status codes တွေကို သုံးတာ သတိထားမိပါလိမ့်မယ်။ အစဉ်အလာအရ temporary redirect အတွက် `302`, permanent redirect အတွက် `301` ကို သုံးကြပေမယ့် — browsers အများအပြားက `302` သုံးတဲ့အခါ redirect ရဲ့ request method ကို မူရင်း request method ဘယ်လိုပဲ ဖြစ်နေပါစေ `POST` ကနေ `GET` အဖြစ် ပြောင်းလိုက်ကြပါတယ်။

ဥပမာ `/users` ကနေ `/people` ဆီ redirect လုပ်တဲ့ အခြေအနေမှာ — user အသစ်တစ်ယောက် ဖန်တီးဖို့ `/users` ဆီ `POST` request တစ်ခု ပို့ပြီး `302` temporary redirect ကို လိုက်နာမယ်ဆိုရင် — request method က `POST` ကနေ `GET` အဖြစ် ပြောင်းသွားပါလိမ့်မယ်။ User အသစ် ဖန်တီးဖို့ဆိုရင် `/people` ဆီ `GET` မဟုတ်ဘဲ `POST` request ပို့သင့်တာမို့ — ဒါက အဓိပ္ပာယ် မရှိပါဘူး။

`307` status code ရောက်လာတာနဲ့ — request method က `POST` အတိုင်း ထိန်းသိမ်းခံရပါတယ်။

- `302` — Temporary redirect, request method ကို `POST` ကနေ `GET` အဖြစ် ပြောင်းလဲစေပါတယ်
- `307` — Temporary redirect, request method ကို `POST` အတိုင်း ထိန်းသိမ်းပါတယ်

`redirect()` က `302` အစား `307` ကို ပုံမှန် သုံးတာမို့ — request method ကို ထိန်းသိမ်းပေးပါတယ်။ Server Action form submissions တွေကတော့ ခြွင်းချက်ပါ — သူတို့က `303` response ကို သုံးလို့ browser က redirect ကို `GET` request နဲ့ လိုက်ပါသွားပါတယ်။ JavaScript ရနိုင်တဲ့အခါ — Server Actions တွေက HTTP redirect အစား client-side navigation ကို လုပ်ဆောင်ပါတယ်။

HTTP Redirects အကြောင်း [ပိုမို လေ့လာရန်](https://developer.mozilla.org/docs/Web/HTTP/Redirections)။

## Version History

| Version   | အပြောင်းအလဲ        |
| --------- | ----------------- |
| `v13.0.0` | `redirect` စတင် မိတ်ဆက်။ |
