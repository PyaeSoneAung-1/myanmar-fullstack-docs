---
title: "cookies function (HTTP cookies ဖတ်ခြင်းနှင့် သတ်မှတ်ခြင်း)"
description: "cookies() — Server Components တွေမှာ incoming request cookies ဖတ်ခြင်း၊ Server Functions/Route Handlers တွေမှာ outgoing cookies set/delete လုပ်ခြင်း (async API)"
order: 34
source: "https://nextjs.org/docs/app/api-reference/functions/cookies"
status: translated
updated: 2026-09-02
---

`cookies` က **async** function တစ်ခုပါ — [Server Components](/docs/nextjs/server-client-components) တွေမှာ HTTP incoming request cookies တွေကို ဖတ်ဖို့၊ [Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data) (သို့) [Route Handlers](/docs/nextjs/route-handlers) တွေမှာ outgoing request cookies တွေကို ဖတ်/ရေး လုပ်ဖို့ အသုံးပြုပါတယ်။

```tsx
// app/page.tsx
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  return '...'
}
```

## Reference

### Methods

အောက်ပါ methods တွေ ရနိုင်ပါတယ်:

| Method                      | Return Type      | ဖော်ပြချက်                                                            |
| --------------------------- | ---------------- | --------------------------------------------------------------------- |
| `get('name')`               | Object           | Cookie name တစ်ခုကို လက်ခံပြီး name နဲ့ value ပါတဲ့ object တစ်ခု ပြန်ပေးပါတယ်။ |
| `getAll()`                  | Array of objects | ကိုက်ညီတဲ့ name ရှိတဲ့ cookies အားလုံးရဲ့ list တစ်ခု ပြန်ပေးပါတယ်။           |
| `has('name')`               | Boolean          | Cookie name တစ်ခုကို လက်ခံပြီး cookie တည်ရှိမှုအပေါ် မူတည်ကာ boolean ပြန်ပေးပါတယ်။ |
| `set(name, value, options)` | -                | Cookie name, value နဲ့ options တွေကို လက်ခံပြီး outgoing request cookie ကို သတ်မှတ်ပါတယ်။ |
| `delete(name)`              | -                | Cookie name တစ်ခုကို လက်ခံပြီး cookie ကို ဖျက်ပါတယ်။                     |
| `toString()`                | String           | Cookies တွေရဲ့ string ကိုယ်စားပြုမှု (string representation) ကို ပြန်ပေးပါတယ်။ |

### Options

Cookie တစ်ခု သတ်မှတ်တဲ့အခါ — `options` object ထဲက အောက်ပါ properties တွေကို ထောက်ပံ့ပေးပါတယ်:

| Option        | Type                                   | ဖော်ပြချက်                                                                        |
| ------------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| `name`        | String                                 | Cookie ရဲ့ name ကို သတ်မှတ်ပါတယ်။                                                 |
| `value`       | String                                 | Cookie ထဲမှာ သိမ်းဆည်းရမယ့် value ကို သတ်မှတ်ပါတယ်။                               |
| `expires`     | Date                                   | Cookie သက်တမ်းကုန်ဆုံးမယ့် ရက်အတိအကျကို သတ်မှတ်ပါတယ်။                                 |
| `maxAge`      | Number                                 | Cookie ရဲ့ သက်တမ်းကို စက္ကန့်ပိုင်းနဲ့ သတ်မှတ်ပါတယ်။                                 |
| `domain`      | String                                 | Cookie ရရှိနိုင်တဲ့ domain ကို သတ်မှတ်ပါတယ်။                                      |
| `path`        | String, default: `'/'`                 | Cookie ရဲ့ နယ်ပယ်ကို domain အတွင်းက path တစ်ခုဆီ ကန့်သတ်ပါတယ်။                      |
| `secure`      | Boolean                                | Cookie ကို HTTPS connections ပေါ်မှာပဲ ပို့စေပြီး — လုံခြုံရေး ပိုကောင်းစေပါတယ်။        |
| `httpOnly`    | Boolean                                | Cookie ကို HTTP requests တွေမှာပဲ ကန့်သတ်ပြီး client-side access ကို တားဆီးပါတယ်။ |
| `sameSite`    | Boolean, `'lax'`, `'strict'`, `'none'` | Cookie ရဲ့ cross-site request အပြုအမူကို ထိန်းချုပ်ပါတယ်။                            |
| `priority`    | String (`"low"`, `"medium"`, `"high"`) | Cookie ရဲ့ priority ကို သတ်မှတ်ပါတယ်။                                              |
| `partitioned` | Boolean                               | Cookie က [partitioned](https://github.com/privacycg/CHIPS) ဖြစ်မဖြစ် ဖော်ပြပါတယ်။ |

Default value ရှိတဲ့ တစ်ခုတည်းသော option က `path` ပဲ ဖြစ်ပါတယ်။

ဒီ options တွေအကြောင်း ပိုသိချင်ရင် [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) ကို ကြည့်ပါ။

## သိထားသင့်သည် (Good to know)

- `cookies` က **asynchronous** function တစ်ခုဖြစ်ပြီး promise တစ်ခုကို ပြန်ပေးပါတယ်။ Cookies တွေကို ဝင်ရောက်ဖို့ `async/await` (သို့) React ရဲ့ [`use`](https://react.dev/reference/react/use) function ကို သုံးရပါမယ်။
  - Version 14 နဲ့ အောက်ပိုင်းတွေမှာ `cookies` က synchronous function တစ်ခုပါ။ Backwards compatibility (နောက်ကြောင်း လိုက်ဖက်မှု) အတွက် Next.js 15 မှာ synchronous အဖြစ် ဆက်သုံးလို့ရပါသေးတယ် — ဒါပေမယ့် ဒီအပြုအမူက နောင်မှာ deprecated ဖြစ်ပါမယ်။
- `cookies` က [Request-time API](https://nextjs.org/docs/app/glossary#request-time-apis) တစ်ခုပါ — ပြန်ပေးတဲ့ တန်ဖိုးတွေကို ကြိုတင် မသိနိုင်ပါဘူး။ Layout (သို့) page တစ်ခုမှာ သုံးလိုက်ရင် route ကို [dynamic rendering](https://nextjs.org/docs/app/glossary#dynamic-rendering) အဖြစ် ရွေးချယ်လိုက်သလို ဖြစ်သွားပါတယ်။
- [Cache Components](/docs/nextjs/caching) နဲ့ဆို — [`<Suspense>`](https://react.dev/reference/react/Suspense) boundary ရဲ့ အပြင်မှာ `cookies()` ကို ခေါ်လိုက်ရင် route ကို prerender လုပ်လို့ မရတော့ပါဘူး။ ဖြေရှင်းနည်းတွေအတွက် [Next.js encountered runtime data during prerendering](https://nextjs.org/docs/messages/blocking-prerender-runtime) ကို ကြည့်ပါ။
- `.delete` method ကို အောက်ပါနေရာတွေမှာပဲ ခေါ်လို့ရပါတယ်:
  - [Server Function](https://nextjs.org/docs/app/getting-started/mutating-data) (သို့) [Route Handler](/docs/nextjs/route-handlers) အတွင်းမှာ။
  - `.set` ခေါ်ထားတဲ့ domain နဲ့ တူညီတဲ့ domain ဖြစ်ရပါမယ်။ Wildcard domains တွေအတွက် — တိကျတဲ့ subdomain က အတိအကျ ကိုက်ညီရပါမယ်။ ဒါ့အပြင် code က ဖျက်ချင်တဲ့ cookie နဲ့ protocol (HTTP (သို့) HTTPS) တူညီတဲ့နေရာမှာ run ရပါမယ်။
- HTTP က streaming စတင်ပြီးတဲ့ နောက်မှာ cookies တွေ သတ်မှတ်တာကို ခွင့်မပြုပါဘူး — ဒါကြောင့် `.set` ကို [Server Function](https://nextjs.org/docs/app/getting-started/mutating-data) (သို့) [Route Handler](/docs/nextjs/route-handlers) အတွင်းမှာပဲ သုံးရပါမယ်။

## Server Components တွေမှာ Cookie အပြုအမူ

Server Components တွေမှာ cookies တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — cookies တွေက အခြေခံအားဖြင့် client-side storage ယန္တရားတစ်ခုဆိုတာ နားလည်ထားဖို့ အရေးကြီးပါတယ်:

- **Cookies ဖတ်ခြင်း** က Server Components တွေမှာ အလုပ်လုပ်ပါတယ် — ဘာလို့ဆို client ရဲ့ browser က HTTP request headers ထဲမှာ ပို့လိုက်တဲ့ cookie data ကို ဝင်ရောက်နေလို့ပါ။
- **Cookies သတ်မှတ်ခြင်း** က Server Component rendering အတွင်းမှာ မထောက်ပံ့ပါဘူး။ Cookies တွေကို ပြောင်းလဲဖို့ — client ကနေ Server Function တစ်ခုကို ခေါ်ပါ (သို့) Route Handler တစ်ခုကို သုံးပါ။

Server က browser ကို cookies သိမ်းဖို့ ညွှန်ကြားချက်တွေပဲ (`Set-Cookie` headers ကတစ်ဆင့်) ပို့နိုင်ပါတယ် — တကယ့် storage ကတော့ client ဘက်မှာ ဖြစ်ပါတယ်။ ဒါကြောင့်မို့ state ကို ပြောင်းလဲတဲ့ cookie operations တွေ (`.set`, `.delete`) ကို response headers တွေ စနစ်တကျ သတ်မှတ်နိုင်တဲ့ Server Function (သို့) Route Handler ထဲမှာပဲ လုပ်ဆောင်ရပါတယ်။

## Server Functions တွေမှာ Cookie အပြုအမူ

Server Function တစ်ခုထဲမှာ cookie တစ်ခုကို set (သို့) delete လုပ်ပြီးတဲ့အခါ — အဲဒီ function ကို [Server Action](https://nextjs.org/docs/app/getting-started/mutating-data#what-are-server-functions) အနေနဲ့ သုံးထားရင် (ဥပမာ form ရဲ့ `action` prop ဆီ ပို့ထားရင်) — Next.js က server roundtrip တစ်ကြိမ်တည်းနဲ့ UI အသစ်ရော data အသစ်ပါ ပြန်ပို့နိုင်ပါတယ်။ [Caching and Revalidating](/docs/nextjs/caching) ကို ကြည့်ပါ။

UI က unmount မဖြစ်ပါဘူး — ဒါပေမယ့် server ကနေ လာတဲ့ data ပေါ်မှာ မှီခိုနေတဲ့ effects တွေက ပြန် run ပါလိမ့်မယ်။

Cache လုပ်ထားတဲ့ data တွေကိုပါ refresh လုပ်ချင်ရင် — function အတွင်းမှာ [`revalidatePath`](/docs/nextjs/revalidate-path) (သို့) [`revalidateTag`](/docs/nextjs/revalidate-tag) ကို ခေါ်ပါ။

## ဥပမာများ

### Cookie တစ်ခု ဖတ်ခြင်း

Cookie တစ်ခုတည်း ရယူဖို့ `(await cookies()).get('name')` method ကို သုံးပါ:

```tsx
// app/page.tsx
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  return '...'
}
```

### Cookies အားလုံး ဖတ်ခြင်း

နာမည်ကိုက်ညီတဲ့ cookies အားလုံး ရယူဖို့ `(await cookies()).getAll()` ကို သုံးပါ။ `name` ကို မသတ်မှတ်ထားဘူးဆိုရင် — ရနိုင်တဲ့ cookies အားလုံးကို ပြန်ပေးပါတယ်။

```tsx
// app/page.tsx
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  return cookieStore.getAll().map((cookie) => (
    <div key={cookie.name}>
      <p>Name: {cookie.name}</p>
      <p>Value: {cookie.value}</p>
    </div>
  ))
}
```

### Cookie သတ်မှတ်ခြင်း

[Server Function](https://nextjs.org/docs/app/getting-started/mutating-data) (သို့) [Route Handler](/docs/nextjs/route-handlers) အတွင်းမှာ cookie တစ်ခု သတ်မှတ်ဖို့ `(await cookies()).set(name, value, options)` ကို သုံးပါ။ အပေါ်က [Options](#options) ထဲက `options` object က optional ပါ။

```ts
// app/actions.ts
'use server'

import { cookies } from 'next/headers'

export async function create(data) {
  const cookieStore = await cookies()

  cookieStore.set('name', 'lee')
  // (သို့)
  cookieStore.set('name', 'lee', { secure: true })
  // (သို့)
  cookieStore.set({
    name: 'name',
    value: 'lee',
    httpOnly: true,
    path: '/',
  })
}
```

### Cookie တည်ရှိမှု စစ်ဆေးခြင်း

Cookie တစ်ခု တည်ရှိမရှိ စစ်ဆေးဖို့ `(await cookies()).has(name)` ကို သုံးပါ:

```tsx
// app/page.ts
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const hasCookie = cookieStore.has('theme')
  return '...'
}
```

### Cookies ဖျက်ခြင်း

Cookie တစ်ခုကို ဖျက်ဖို့ နည်းလမ်း သုံးမျိုး ရှိပါတယ်။

`delete()` method ကို သုံးခြင်း:

```ts
// app/actions.ts
'use server'

import { cookies } from 'next/headers'

export async function deleteCookie(data) {
  const cookieStore = await cookies()
  cookieStore.delete('name')
}
```

နာမည်တူ cookie အသစ်တစ်ခုကို value အလွတ်နဲ့ သတ်မှတ်ခြင်း:

```ts
// app/actions.ts
'use server'

import { cookies } from 'next/headers'

export async function deleteCookie(data) {
  const cookieStore = await cookies()
  cookieStore.set('name', '')
}
```

`maxAge` ကို 0 သတ်မှတ်ခြင်းက cookie ကို ချက်ချင်း သက်တမ်းကုန်စေပါတယ်။ `maxAge` က စက္ကန့်ပိုင်းနဲ့ တန်ဖိုးတစ်ခု လက်ခံပါတယ်။

```ts
// app/actions.ts
'use server'

import { cookies } from 'next/headers'

export async function deleteCookie(data) {
  const cookieStore = await cookies()
  cookieStore.set('name', 'value', { maxAge: 0 })
}
```

## Version History

| Version      | အပြောင်းအလဲ                                                                      |
| ------------ | ------------------------------------------------------------------------------- |
| `v15.0.0-RC` | `cookies` က async function ဖြစ်လာပါတယ်။ [codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#150) တစ်ခု ရနိုင်ပါတယ်။ |
| `v13.0.0`    | `cookies` စတင် မိတ်ဆက်။                                                       |
