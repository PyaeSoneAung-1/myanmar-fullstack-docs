---
title: "unstable_noStore function (prerendering နှင့် caching မှ ရှောင်ထွက်ခြင်း)"
description: "unstable_noStore — component တစ်ခုကို declaratively prerendering နဲ့ caching ကနေ ရှောင်ထွက် (opt out) စေရန်; version 15 တွင် connection() ကို အသုံးပြုရန် အကြံပြုထားသော legacy API — fetch ပေါ်က cache: 'no-store' နှင့် ညီမျှခြင်း၊ version history"
order: 137
source: "https://nextjs.org/docs/app/api-reference/functions/unstable_noStore"
status: translated
updated: 2026-09-03
---

**Version 15 မှာ — `unstable_noStore` အစား [`connection`](/docs/nextjs/connection) ကို သုံးဖို့ အကြံပြုပါတယ်။**

`unstable_noStore` ကို declaratively (ကြေညာချက်ပုံစံနဲ့) prerendering ကနေ ရှောင်ထွက် (opt out) လုပ်ဖို့နဲ့ — သီးခြား component တစ်ခုကို cache မလုပ်သင့်ဘူးလို့ ညွှန်ပြဖို့ သုံးနိုင်ပါတယ်။

```jsx
import { unstable_noStore as noStore } from 'next/cache';

export default async function ServerComponent() {
  noStore();
  const result = await db.query(...);
  ...
}
```

> **သိထားသင့်သည်**:
>
> - `unstable_noStore` က `fetch` တစ်ခုပေါ်မှာ `cache: 'no-store'` သတ်မှတ်တာနဲ့ ညီမျှပါတယ်
> - `unstable_noStore` က `export const dynamic = 'force-dynamic'` ထက် ပိုနှစ်သက်ဖွယ် ကောင်းပါတယ် — ပိုပြီး granular (အသေးစိတ်ကျ) ပြီး component တစ်ခုချင်းစီ အလိုက် သုံးနိုင်လို့ပါ

- [`unstable_cache`](/docs/nextjs/unstable-cache) အတွင်းမှာ `unstable_noStore` ကို သုံးလိုက်ရင် static generation ကနေ ရှောင်ထွက်သွားမှာ မဟုတ်ပါဘူး။ အဲဒီအစား — result ကို cache လုပ်မလား မလုပ်ဘူးလား ဆုံးဖြတ်ဖို့ cache configuration ကို လိုက်နာပါလိမ့်မယ်။

## Usage (အသုံးပြုပုံ)

`fetch` ဆီ `cache: 'no-store'`, `next: { revalidate: 0 }` လို ထပ်ဆောင်း options တွေ ပို့မပေးချင်ဘူး (သို့) `fetch` ကို မရနိုင်တဲ့ အခြေအနေတွေမှာ — ဒီ use cases တွေအားလုံးအတွက် `noStore()` ကို အစားထိုးအနေနဲ့ သုံးနိုင်ပါတယ်။

```jsx
import { unstable_noStore as noStore } from 'next/cache';

export default async function ServerComponent() {
  noStore();
  const result = await db.query(...);
  ...
}
```

## Version History

| Version   | အပြောင်းအလဲ                                |
| --------- | ------------------------------------------- |
| `v15.0.0` | `unstable_noStore` ကို `connection` အတွက် deprecate လုပ်ခဲ့။ |
| `v14.0.0` | `unstable_noStore` ကို စတင် မိတ်ဆက်။        |
