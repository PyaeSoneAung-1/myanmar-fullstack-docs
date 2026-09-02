---
title: "revalidateTag function (cache tag အလိုက် ပြန်လည်စစ်ဆေးခြင်း)"
description: "revalidateTag() — Server Functions/Route Handlers တွေကနေ cache tag တစ်ခုရဲ့ cached data ကို on-demand invalidate လုပ်ခြင်း; stale-while-revalidate နဲ့ profile parameter အကြောင်း"
order: 39
source: "https://nextjs.org/docs/app/api-reference/functions/revalidateTag"
status: translated
updated: 2026-09-02
---

`revalidateTag` က သတ်မှတ်ထားတဲ့ cache tag တစ်ခုအတွက် cached data တွေကို on-demand (လိုအပ်တဲ့အခါမှ) invalidate လုပ်နိုင်စေပါတယ်။

ဒီ function က update တွေမှာ နည်းနည်းလေး နှောင့်နှေးတာ လက်ခံနိုင်တဲ့ content တွေအတွက် အကောင်းဆုံးပါ — blog posts, product catalogs (သို့) documentation လိုမျိုးပေါ့။ အကြံပြုထားတဲ့ `max` profile နဲ့ဆို — fresh data တွေ နောက်ခံမှာ load လုပ်နေချိန်မှာ user တွေက stale content ကို ရရှိနေပါတယ်။

## အသုံးပြုပုံ (Usage)

`revalidateTag` ကို [Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data) နဲ့ [Route Handlers](/docs/nextjs/route-handlers) တွေမှာ ခေါ်နိုင်ပါတယ်။

`revalidateTag` က server environments တွေမှာပဲ အလုပ်လုပ်လို့ — Client Components (သို့) Proxy တွေထဲမှာတော့ ခေါ်လို့ မရပါဘူး။

### Revalidation အပြုအမူ

`revalidateTag` ကို ခေါ်လိုက်တာက tag လုပ်ထားတဲ့ data ကို stale အဖြစ် အမှတ်အသား လုပ်ပါတယ်။ အဲဒီ data အတွက် နောက် request တစ်ခု ဝင်လာတာနဲ့ — revalidation တစ်ခု စတင်ပြီး stale-while-revalidate semantics အရ — revalidation လုပ်နေချိန်မှာ stale content ကို ပေးနေပါတယ်။ ဒုတိယ argument က stale content ကို ဘယ်လောက်ကြာကြာ ဆက်ပေးနိုင်မလဲ သတ်မှတ်ပါတယ်။ အဲဒီကြာချိန် ကျော်လွန်သွားရင် — request တစ်ခုက revalidation ပြီးတဲ့အထိ block ဖြစ်နေပါတယ်။

- **`profile="max"` (အကြံပြုထား)**: တစ်နှစ်စာ window တစ်ခုပါ — revalidation လုပ်နေချိန်မှာ requests တွေက stale content ကို အမြဲ ရနေလောက်အောင် ရှည်လျားပါတယ်။
- **အခြား profile တစ်ခု (သို့) object တစ်ခု**: [`cacheLife`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheLife) ထဲမှာ သတ်မှတ်ထားတဲ့ အခြား default (သို့) custom profile တစ်ခုခု — ဒါမှမဟုတ် အခြား window တစ်ခု လိုချင်တဲ့အခါ `expire` property ပါတဲ့ object တစ်ခု။
- **`{ expire: 0 }`**: Stale content ကို ဘယ်တော့မှ မပေးပါဘူး — ဒါကြောင့် နောက် request က blocking revalidate/cache miss ဖြစ်ပါတယ်။ Caller က data ကို ချက်ချင်း ပျောက်သွားစေချင်ပြီး — [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag) ကို မသုံးနိုင်တဲ့အခါ သုံးပါ။
- **ဒုတိယ argument မပါဘဲ (deprecated)**: `{ expire: 0 }` လိုပဲ အပြုအမူ ရှိပါတယ်။ Server Actions တွေမှာ [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag) ဆီ (သို့) `profile="max"` ဆီ ပြောင်းရွှေ့ပါ။

Profile က ဘယ်နေရာကစပြီး — မြန်ဆန်မှုထက် data တိကျမှု (data correctness) က ပိုအရေးကြီးလာလဲ အဲဒီအချက်ကို သတ်မှတ်ပေးပါတယ်။

> **သိထားသင့်သည်:** Revalidation တစ်ခုကို `revalidateTag` ခေါ်တာက မဟုတ်ဘဲ — **request တစ်ခုက** အစပျိုးပေးတာပါ။ ဒါကြောင့် tag ကို သုံးထားတဲ့ pages တွေက တစ်ပြိုင်နက် အားလုံး revalidate မဖြစ်ဘဲ — သူတို့ကို လည်ပတ်တိုင်း တစ်ခုချင်းစီ revalidate ဖြစ်ပါတယ်။

## Parameters

```ts
revalidateTag(tag: string, profile: string | { expire?: number }): void;
```

- `tag`: Revalidate လုပ်ချင်တဲ့ data နဲ့ ဆက်စပ်ထားတဲ့ cache tag ကို ကိုယ်စားပြုတဲ့ string တစ်ခု။ Tags တွေက case-sensitive ဖြစ်ပြီး စာလုံးရေ 256 ထက် မကျော်ရပါဘူး။ ကန့်သတ်ချက် ကျော်လွန်တဲ့ tag တစ်ခုက cached data တွေကို ဘယ်တော့မှ tag မခံရတာမို့ — အဲဒါကို revalidate လုပ်တာက ဘာမှ မလုပ်ဆောင်ပေးပါဘူး။
- `profile`: Stale content ကို ဘယ်လောက်ကြာကြာ ပေးနိုင်မလဲ — အပေါ်က Revalidation အပြုအမူ (Revalidation Behavior) ကဏ္ဍမှာ ကြည့်ပါ။ အကြံပြုတန်ဖိုးက `"max"` ပါ။ [`cacheLife`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheLife) ထဲမှာ သတ်မှတ်ထားတဲ့ အခြား default (သို့) custom profile တစ်ခုခုကိုလည်း လက်ခံပြီး — သူ့ရဲ့ `expire` တန်ဖိုးကိုပဲ ဖတ်ပါတယ်။ `expire` property ပါတဲ့ object တစ်ခုကိုလည်း စက္ကန့်ပိုင်းနဲ့ ပေးနိုင်ပါတယ်။

Tags တွေကို အရင်ဆုံး cached data တွေနဲ့ တွဲသတ်မှတ် (assign) ထားရပါမယ်။ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်:

- External API requests တွေကို cache လုပ်ဖို့ `fetch` နဲ့ [`next.tags`](https://nextjs.org/docs/app/api-reference/functions/fetch) option ကို သုံးခြင်း:

```tsx
fetch(url, { next: { tags: ['posts'] } })
```

- `'use cache'` directive ပါတဲ့ cached functions (သို့) components တွေထဲမှာ [`cacheTag`](https://nextjs.org/docs/app/api-reference/functions/cacheTag) ကို သုံးခြင်း:

```tsx
import { cacheTag } from 'next/cache'

async function getData() {
  'use cache'
  cacheTag('posts')
  // ...
}
```

> **သိထားသင့်သည်:** Argument တစ်ခုတည်း ပုံစံ `revalidateTag(tag)` က deprecated ပါ။ TypeScript errors တွေကို ဖိနှိပ်ထားရင် လက်ရှိမှာ အလုပ်လုပ်ပါသေးတယ် — ဒါပေမယ့် ဒီအပြုအမူက နောက် version တစ်ခုမှာ ဖယ်ရှားခံရနိုင်ပါတယ်။ Argument နှစ်ခု လက်မှတ် (signature) ဆီ update လုပ်ပါ။

## Returns

`revalidateTag` က တန်ဖိုး ဘာမှ ပြန်မပေးပါဘူး။

## `revalidatePath` နဲ့ ဆက်စပ်မှု

`revalidateTag` က သက်ဆိုင်ရာ tags တွေကို သုံးနေတဲ့ pages အားလုံးရဲ့ data တွေကို invalidate လုပ်ပြီး — [`revalidatePath`](/docs/nextjs/revalidate-path) ကတော့ သတ်မှတ်ထားတဲ့ page (သို့) layout paths တွေကို invalidate လုပ်ပါတယ်။

> **သိထားသင့်သည်:** ဒီ functions တွေက ရည်ရွယ်ချက် မတူညီတာမို့ — data consistency အပြည့်အဝ ရဖို့ အတူတကွ သုံးစရာ လိုနိုင်ပါတယ်။ အသေးစိတ် ဥပမာတွေနဲ့ ထည့်သွင်းစဉ်းစားစရာတွေအတွက် — [revalidateTag နဲ့ updateTag တို့နဲ့ ဆက်စပ်မှု](https://nextjs.org/docs/app/api-reference/functions/revalidatePath#relationship-with-revalidatetag-and-updatetag) ကို ကြည့်ပါ။

## ဥပမာများ

အောက်က ဥပမာတွေက `revalidateTag` ကို context အမျိုးမျိုးမှာ ဘယ်လို သုံးလဲ ဖော်ပြပါတယ်။ နှစ်ခုစလုံးမှာ — data တွေကို stale အဖြစ် အမှတ်အသားလုပ်ပြီး stale-while-revalidate semantics သုံးဖို့ `profile="max"` ကို သုံးထားပါတယ်။ ဒါက use cases အများစုအတွက် အကြံပြုထားတဲ့ နည်းလမ်းပါ။

### Server Action

```ts
// app/actions.ts
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('posts', 'max')
}
```

### Route Handler

```ts
// app/api/revalidate/route.ts
import type { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')

  if (tag) {
    revalidateTag(tag, 'max')
    return Response.json({ revalidated: true, now: Date.now() })
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing tag to revalidate',
  })
}
```

Invalidation က Server Action တစ်ခုရဲ့ အပြင်ကနေ လာတဲ့အခါ — ဥပမာ webhook တစ်ခု (သို့) Route Handler တစ်ခုကို ခေါ်နေတဲ့ အခြား service တစ်ခုဆိုရင် — [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag) က မရနိုင်ပါဘူး။ Data ကို ချက်ချင်း expire လုပ်ဖို့ `{ expire: 0 }` ကို ပေးလိုက်ပါ:

```ts
revalidateTag(tag, { expire: 0 })
```
