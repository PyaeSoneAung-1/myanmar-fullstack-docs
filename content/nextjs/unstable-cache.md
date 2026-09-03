---
title: "unstable_cache function (ဈေးကြီးသော operations များ၏ ရလဒ်များကို cache လုပ်ခြင်း)"
description: "unstable_cache — database queries လို ကုန်ကျစရိတ်မြင့် (expensive) operations တွေရဲ့ ရလဒ်တွေကို cache လုပ်ပြီး requests နဲ့ deployments အများအပြားကြားမှာ ပြန်သုံးနိုင်ရန်; Next.js 16 တွင် use cache directive ဖြင့် အစားထိုးထားသော API — Parameters (fetchData, keyParts, options), Returns, ဥပမာ နှင့် Version History"
order: 139
source: "https://nextjs.org/docs/app/api-reference/functions/unstable_cache"
status: translated
updated: 2026-09-03
---

> **မှတ်ချက်:**
> ဒီ API ကို Next.js 16 မှာ [`use cache`](/docs/nextjs/use-cache) နဲ့ အစားထိုးထားပါတယ်။
> [Cache Components](/docs/nextjs/caching) ကို opt-in လုပ်ပြီး `unstable_cache` အစား `use cache` directive ကို သုံးဖို့ အကြံပြုပါတယ်။

`unstable_cache` က database queries လို ကုန်ကျစရိတ်မြင့်တဲ့ (expensive) operations တွေရဲ့ ရလဒ်တွေကို cache လုပ်ပြီး — requests အများအပြားကြားမှာ ပြန်သုံးနိုင်အောင် ခွင့်ပြုပေးပါတယ်။

```jsx
import { getUser } from './data';
import { unstable_cache } from 'next/cache';

const getCachedUser = unstable_cache(
  async (id) => getUser(id),
  ['my-app-user']
);

export default async function Component({ userID }) {
  const user = await getCachedUser(userID);
  ...
}
```

> **သိထားသင့်သည်**:
>
> - Cache scope တစ်ခုအတွင်းမှာ `headers` (သို့) `cookies` လို uncached data sources တွေကို ဝင်ရောက်သုံးတာကို ထောက်ပံ့မထားပါဘူး။ Cached function တစ်ခုအတွင်းမှာ ဒီ data လိုအပ်ရင် — cached function ရဲ့ အပြင်ဘက်မှာ `headers` ကို သုံးပြီး လိုအပ်တဲ့ uncached data ကို argument အနေနဲ့ ထည့်ပို့ပါ။
> - ဒီ API က result ကို requests နဲ့ deployments အလိုက် ထိန်းသိမ်းဖို့ Next.js ရဲ့ built-in cache ကို သုံးပါတယ်။ [Caching and Revalidating](/docs/nextjs/caching) ကို ကြည့်ပါ။

## Parameters

```jsx
const data = unstable_cache(fetchData, keyParts, options)()
```

- `fetchData`: Cache လုပ်ချင်တဲ့ data ကို ယူပေးတဲ့ asynchronous function တစ်ခုပါ။ `Promise` တစ်ခုကို ပြန်ပေးတဲ့ function တစ်ခု ဖြစ်ရပါမယ်။
- `keyParts`: ဒါက cache ကို ထပ်ဆောင်း ခွဲခြားသတ်မှတ်မှု (identification) ထည့်ပေးတဲ့ keys တွေရဲ့ အပို array တစ်ခုပါ။ Default အနေနဲ့ — `unstable_cache` က arguments တွေနဲ့ သင့် function ရဲ့ stringify လုပ်ထားတဲ့ ပုံစံကို cache key အဖြစ် သုံးပြီးသား ဖြစ်ပါတယ်။ အများစုမှာ optional ဖြစ်ပြီး — external variables တွေကို parameters အဖြစ် မပို့ဘဲ သုံးတဲ့အခါမှပဲ ဒါကို သုံးဖို့ လိုပါတယ်။ ဒါပေမယ့် — function အတွင်းမှာ သုံးထားတဲ့ closures တွေကို parameters အဖြစ် မပို့ဘူးဆိုရင် ၎င်းတို့ကို ထည့်ပေးဖို့ အရေးကြီးပါတယ်။
- `options`: ဒါက cache ရဲ့ အပြုအမူကို ထိန်းချုပ်တဲ့ object တစ်ခုပါ။ အောက်ပါ properties တွေ ပါဝင်နိုင်ပါတယ်:
  - `tags`: Cache invalidation (cache ပျက်ပြယ်စေခြင်း) ကို ထိန်းချုပ်ဖို့ သုံးနိုင်တဲ့ tags တွေရဲ့ array တစ်ခုပါ။ Next.js က ဒါကို function ကို သီးခြား ခွဲခြားသတ်မှတ်ဖို့ မသုံးပါဘူး။
  - `revalidate`: ဒီစက္ကန့် အရေအတွက် ပြည့်ပြီးနောက်မှာ cache ကို revalidate လုပ်သင့်ပါတယ်။ ဒါကို ချန်လှပ်ထားခဲ့ (omit) (သို့) `false` ပို့ထားမယ်ဆိုရင် — ကိုက်ညီတဲ့ `revalidateTag()` (သို့) `revalidatePath()` methods တွေ ခေါ်တဲ့အထိ (သို့) အကန့်အသတ်မရှိ cache လုပ်ထားပါလိမ့်မယ်။

## Returns

`unstable_cache` က function တစ်ခုကို ပြန်ပေးပြီး — ၎င်းကို ခေါ်လိုက်တဲ့အခါ cache လုပ်ထားတဲ့ data ဆီ resolve လုပ်တဲ့ Promise တစ်ခုကို ပြန်ပေးပါတယ်။ Data က cache ထဲမှာ မရှိဘူးဆိုရင် — ပေးထားတဲ့ function ကို ခေါ်ပြီး ၎င်းရဲ့ ရလဒ်ကို cache လုပ်ကာ ပြန်ပေးပါလိမ့်မယ်။

## ဥပမာ

```tsx filename="app/page.tsx" switcher
import { unstable_cache } from 'next/cache'

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const getCachedUser = unstable_cache(
    async () => {
      return { id: userId }
    },
    [userId], // add the user ID to the cache key
    {
      tags: ['users'],
      revalidate: 60,
    }
  )

  //...
}
```

```jsx filename="app/page.jsx" switcher
import { unstable_cache } from 'next/cache'

export default async function Page({ params }) {
  const { userId } = await params
  const getCachedUser = unstable_cache(
    async () => {
      return { id: userId }
    },
    [userId], // add the user ID to the cache key
    {
      tags: ['users'],
      revalidate: 60,
    }
  )

  //...
}
```

## Version History

| Version   | အပြောင်းအလဲ                     |
| --------- | -------------------------------- |
| `v14.0.0` | `unstable_cache` ကို စတင် မိတ်ဆက်။ |
