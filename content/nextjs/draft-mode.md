---
title: "draftMode function (Draft Mode ဖွင့်/ပိတ် စီမံခြင်း)"
description: "draftMode() — async function တစ်ခုအနေနဲ့ Draft Mode ကို enable/disable လုပ်နည်းနဲ့ Server Component ထဲမှာ Draft Mode ဖွင့်ထားလား ဆိုတာ isEnabled နဲ့ စစ်ဆေးနည်း; caching directive scopes နဲ့ Route Handlers အကြောင်း"
order: 62
source: "https://nextjs.org/docs/app/api-reference/functions/draft-mode"
status: translated
updated: 2026-09-02
---

`draftMode` က **async** function တစ်ခုဖြစ်ပြီး — [Draft Mode](https://nextjs.org/docs/app/guides/draft-mode) ကို enable/disable လုပ်နိုင်စေကာ — [Server Component](/docs/nextjs/server-client-components) တစ်ခုထဲမှာ Draft Mode ဖွင့်ထားလား ဆိုတာကိုလည်း စစ်ဆေးနိုင်စေပါတယ်။

```tsx filename="app/page.ts" switcher
import { draftMode } from 'next/headers'

export default async function Page() {
  const { isEnabled } = await draftMode()
}
```

```jsx filename="app/page.js" switcher
import { draftMode } from 'next/headers'

export default async function Page() {
  const { isEnabled } = await draftMode()
}
```

## Reference

ရနိုင်တဲ့ methods နဲ့ properties တွေကတော့:

| Method      | ဖော်ပြချက်                                                                   |
| ----------- | --------------------------------------------------------------------------- |
| `isEnabled` | Draft Mode ဖွင့်ထားလား ဆိုတာကို ဖော်ပြတဲ့ boolean တန်ဖိုး။                   |
| `enable()`  | `__prerender_bypass` cookie တစ်ခု သတ်မှတ်ခြင်းဖြင့် Route Handler တစ်ခုထဲမှာ Draft Mode ကို ဖွင့်ပေးပါတယ်။ |
| `disable()` | Cookie ကို ဖျက်ခြင်းဖြင့် Route Handler တစ်ခုထဲမှာ Draft Mode ကို ပိတ်ပေးပါတယ်။ |

## သိထားသင့်သည် (Good to know)

- `draftMode` က promise တစ်ခု ပြန်ပေးတဲ့ **asynchronous** function တစ်ခုပါ။ `async/await` (သို့) React ရဲ့ [`use`](https://react.dev/reference/react/use) function ကို သုံးရပါမယ်။
  - Version 14 နဲ့ အစောပိုင်းတွေမှာ `draftMode` က synchronous function တစ်ခုဖြစ်ခဲ့ပါတယ်။ Backwards compatibility အတွက် Next.js 15 မှာ synchronous အနေနဲ့လည်း ဆက်သုံးလို့ရသေးပေမယ့် — ဒီအပြုအမူက အနာဂတ်မှာ deprecated ဖြစ်သွားပါမယ်။
- `next build` run လုပ်တိုင်း bypass cookie တန်ဖိုးအသစ်တစ်ခု ထုတ်ပေးပါတယ်။ ဒါက bypass cookie ကို မှန်းဆလို့မရအောင် သေချာစေပါတယ်။
- Draft Mode ကို HTTP ကနေတစ်ဆင့် local မှာ စမ်းသပ်ဖို့ဆိုရင် — သင့် browser က third-party cookies တွေနဲ့ local storage access ကို ခွင့်ပြုထားဖို့ လိုပါလိမ့်မယ်။
- [`isEnabled`](#checking-if-draft-mode-is-enabled) က [caching directive](https://nextjs.org/docs/app/api-reference/directives/use-cache) scope တစ်ခုအတွင်းမှာ ဖတ်လို့ရပါတယ်။ `cookies()` နဲ့ `headers()` လိုမျိုး အခြား runtime APIs တွေကတော့ — Draft Mode ဖွင့်ထားချိန်မှာတောင် caching directive scopes တွေအတွင်းမှာ ခွင့်မပြုပါဘူး။
- Caching directive scope တစ်ခုအတွင်းမှာ `enable()` (သို့) `disable()` ခေါ်လိုက်ရင် error တစ်ခု throw ဖြစ်ပါလိမ့်မယ်။
- Draft Mode ဖွင့်ထားတဲ့အခါ caching directive scope တစ်ခုအောက်က functions နဲ့ components တွေ အားလုံးက request တိုင်းမှာ ပြန် execute ဖြစ်ပြီး — ရလဒ်တွေကို cache ထဲ မသိမ်းပါဘူး။ ဒါက draft content က အမြဲတမ်း fresh ဖြစ်နေစေဖို့ သေချာစေပါတယ်။

## ဥပမာများ

### Draft Mode ဖွင့်ခြင်း

Draft Mode ဖွင့်ဖို့ — [Route Handler](/docs/nextjs/route-handlers) အသစ်တစ်ခု ဖန်တီးပြီး `enable()` method ကို ခေါ်ပါ:

```tsx filename="app/draft/route.ts" switcher
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  const draft = await draftMode()
  draft.enable()
  return new Response('Draft mode is enabled')
}
```

```js filename="app/draft/route.js" switcher
import { draftMode } from 'next/headers'

export async function GET(request) {
  const draft = await draftMode()
  draft.enable()
  return new Response('Draft mode is enabled')
}
```

### Draft Mode ပိတ်ခြင်း

ပုံမှန်အားဖြင့် Draft Mode session က browser ကို ပိတ်လိုက်တာနဲ့ အဆုံးသတ်ပါတယ်။

Draft Mode ကို ကိုယ်တိုင် ပိတ်ချင်တယ်ဆိုရင် — သင့် [Route Handler](/docs/nextjs/route-handlers) ထဲမှာ `disable()` method ကို ခေါ်ပါ:

```tsx filename="app/draft/route.ts" switcher
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  const draft = await draftMode()
  draft.disable()
  return new Response('Draft mode is disabled')
}
```

```js filename="app/draft/route.js" switcher
import { draftMode } from 'next/headers'

export async function GET(request) {
  const draft = await draftMode()
  draft.disable()
  return new Response('Draft mode is disabled')
}
```

ပြီးရင် Route Handler ကို ခေါ်ဖို့ request တစ်ခု ပို့ပါ။ Route ကို [`<Link>` component](https://nextjs.org/docs/app/api-reference/components/link) သုံးပြီး ခေါ်မယ်ဆိုရင် — prefetch လုပ်တဲ့အခါ cookie ကို မတော်တဆ ဖျက်မခံရအောင် `prefetch={false}` ကို ထည့်ပေးရပါမယ်။

### Draft Mode ဖွင့်ထားလား စစ်ဆေးခြင်း

Server Component တစ်ခုထဲမှာ `isEnabled` property သုံးပြီး Draft Mode ဖွင့်ထားလား ဆိုတာ စစ်ဆေးနိုင်ပါတယ်:

```tsx filename="app/page.ts" switcher
import { draftMode } from 'next/headers'

export default async function Page() {
  const { isEnabled } = await draftMode()
  return (
    <main>
      <h1>My Blog Post</h1>
      <p>Draft Mode is currently {isEnabled ? 'Enabled' : 'Disabled'}</p>
    </main>
  )
}
```

```jsx filename="app/page.js" switcher
import { draftMode } from 'next/headers'

export default async function Page() {
  const { isEnabled } = await draftMode()
  return (
    <main>
      <h1>My Blog Post</h1>
      <p>Draft Mode is currently {isEnabled ? 'Enabled' : 'Disabled'}</p>
    </main>
  )
}
```

## Version History

| Version      | အပြောင်းအလဲ                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| `v15.0.0-RC` | `draftMode` က အခု async function တစ်ခု ဖြစ်လာပါပြီ။ [codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#150) တစ်ခု ရနိုင်ပါတယ်။ |
| `v13.4.0`    | `draftMode` ကို စတင် မိတ်ဆက်။                                                                                  |
