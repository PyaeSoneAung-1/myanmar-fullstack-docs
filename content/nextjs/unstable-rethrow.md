---
title: "unstable_rethrow function (Next.js ၏ internal errors များကို ပြန်လည် re-throw လုပ်ခြင်း)"
description: "unstable_rethrow — application code ထဲက errors တွေကို ကိုင်တွယ်ရာမှာ Next.js ကိုယ်တိုင် throw လုပ်တဲ့ internal errors (notFound, redirect, permanentRedirect နှင့် request-time API calls များ) ကို မတော်တဆ catch မိခြင်းမှ ကာကွယ်ရန် — catch block ၏ ထိပ်ဆုံးတွင် error object ကို ထည့်၍ ခေါ်ရသော unstable API"
order: 138
source: "https://nextjs.org/docs/app/api-reference/functions/unstable_rethrow"
status: translated
updated: 2026-09-03
---

`unstable_rethrow` ကို — သင့် application code ထဲက errors တွေကို ကိုင်တွယ်ဖို့ ကြိုးစားရာမှာ Next.js ကိုယ်တိုင် throw လုပ်တဲ့ internal errors တွေကို (မတော်တဆ) catch မိခြင်းကနေ ရှောင်ရှားဖို့ သုံးနိုင်ပါတယ်။

ဥပမာ — `notFound` function ကို ခေါ်လိုက်ရင် Next.js ရဲ့ internal error တစ်ခု throw ဖြစ်ပြီး [`not-found.js`](/docs/nextjs/not-found) component ကို render လုပ်ပါတယ်။ ဒါပေမယ့် — try/catch statement တစ်ခုရဲ့ `try` block အတွင်းမှာ သုံးထားရင် error ကို catch လိုက်လို့ `not-found.js` render မဖြစ်တော့ပါဘူး:

```tsx filename="@/app/ui/component.tsx"
import { notFound } from 'next/navigation'

export default async function Page() {
  try {
    const post = await fetch('https://.../posts/1').then((res) => {
      if (res.status === 404) notFound()
      if (!res.ok) throw new Error(res.statusText)
      return res.json()
    })
  } catch (err) {
    console.error(err)
  }
}
```

`unstable_rethrow` API ကို သုံးပြီး internal error ကို ပြန် re-throw လုပ်ကာ မျှော်လင့်ထားတဲ့ အပြုအမူအတိုင်း ဆက်လုပ်နိုင်ပါတယ်:

```tsx filename="@/app/ui/component.tsx"
import { notFound, unstable_rethrow } from 'next/navigation'

export default async function Page() {
  try {
    const post = await fetch('https://.../posts/1').then((res) => {
      if (res.status === 404) notFound()
      if (!res.ok) throw new Error(res.statusText)
      return res.json()
    })
  } catch (err) {
    unstable_rethrow(err)
    console.error(err)
  }
}
```

အောက်က Next.js APIs တွေက error တစ်ခု throw လုပ်တာကို အားကိုးထားပြီး — အဲဒီ errors တွေကို Next.js ကိုယ်တိုင် ပြန် rethrow လုပ်ပြီး ကိုင်တွယ်သင့်ပါတယ်:

- [`notFound()`](/docs/nextjs/not-found)
- [`redirect()`](/docs/nextjs/redirecting)
- [`permanentRedirect()`](/docs/nextjs/redirecting)

Route segment တစ်ခုက static မဟုတ်ရင် error throw လုပ်ဖို့ မှတ်သားထားတယ်ဆိုရင် — Request-time API call တစ်ခုကလည်း developer က မဖမ်းသင့်တဲ့ error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ Partial Prerendering (PPR) ကလည်း ဒီအပြုအမူကို သက်ရောက်မှု ရှိတာ သတိပြုပါ။ ဒီ APIs တွေကတော့:

- [`cookies`](/docs/nextjs/cookies)
- [`headers`](/docs/nextjs/headers)
- [`searchParams`](/docs/nextjs/file-conventions-page)
- `fetch(..., { cache: 'no-store' })`
- `fetch(..., { next: { revalidate: 0 } })`

> **သိထားသင့်သည်**:
>
> - ဒီ method ကို catch block ရဲ့ ထိပ်ဆုံးမှာ ခေါ်ပြီး — error object ကို တစ်ခုတည်းသော argument အနေနဲ့ ထည့်ပေးရပါမယ်။ Promise တစ်ခုရဲ့ `.catch` handler အတွင်းမှာလည်း သုံးနိုင်ပါတယ်။
> - Throw ဖြစ်နိုင်တဲ့ သင့် API calls တွေကို တစ်နေရာတည်းမှာ စုထား (encapsulate) ပြီး exception ကို **caller** ဘက်က ကိုင်တွယ်စေမယ်ဆိုရင် — `unstable_rethrow` ကို မသုံးပဲ နေနိုင်ပါတယ်။
> - ဖမ်းမိတဲ့ exceptions တွေထဲမှာ application errors တွေရော framework-controlled exceptions တွေ (`redirect()` (သို့) `notFound()` လိုမျိုး) ရော ပါနိုင်တယ်ဆိုမှသာ `unstable_rethrow` ကို သုံးပါ။
> - Resource cleanup တွေ (intervals, timers စတာတွေ ရှင်းလင်းခြင်းလို) က `unstable_rethrow` ခေါ်တာထက် အရင်ဖြစ်စေ — `finally` block တစ်ခုအတွင်းမှာဖြစ်စေ လုပ်ဆောင်ထားရပါမယ်။
