---
title: "connection function (dynamic rendering opt-in ပြုလုပ်ခြင်း)"
description: "connection() — Request-time APIs မသုံးဘဲ request တစ်ခုချင်းစီအတွက် output ကွဲပြားဖို့ လိုတဲ့အခါ (ဥပမာ Math.random(), new Date()) rendering ကို incoming user request အထိ စောင့်ဆိုင်းစေနည်း"
order: 55
source: "https://nextjs.org/docs/app/api-reference/functions/connection"
status: translated
updated: 2026-09-02
---

`connection()` function က rendering ကို — incoming user request တစ်ခု ရောက်ရှိလာတဲ့အထိ စောင့်ဆိုင်းစေပြီး ဆက်လုပ်ဆောင်သင့်ကြောင်း ညွှန်ပြနိုင်ပါတယ်။

ဒါက component တစ်ခုက `cookies` (သို့) `headers` လိုမျိုး [Request-time APIs](https://nextjs.org/docs/app/glossary#request-time-apis) တွေ မသုံးဘဲ — request တစ်ခုချင်းစီအလိုက် output ကွဲပြားဖို့ လိုအပ်တဲ့အခါ အသုံးဝင်ပါတယ်။ ဥပမာ `Math.random()` (သို့) `new Date()` လိုမျိုးပေါ့။

```ts
// app/page.tsx
import { connection } from 'next/server'

export default async function Page() {
  await connection() // prerendering stops here
  // the following code only runs at request time
  const rand = Math.random()
  return <span>{rand}</span>
}
```

JavaScript project တွေမှာလည်း type annotations မပါဘဲ အလားတူ code မျိုး ရေးနိုင်ပါတယ်။

## ဥပမာများ

### Synchronous database drivers

`better-sqlite3` လိုမျိုး synchronous database drivers တွေရဲ့ queries တွေက prerendering လုပ်ချိန်မှာ အပြီးသတ် လုပ်ဆောင်ပါတယ်။ Request-time APIs တွေ မသုံးထားဘူးဆိုရင် — သင့် query မတိုင်ခင် `connection()` ကို ခေါ်ပြီး သူတို့ကို prerendering ကနေ ဖယ်ထုတ်လိုက်ပါ:

```ts
// app/lib/data.ts
import { connection } from 'next/server'
import Database from 'better-sqlite3'

const db = new Database('app.db')

export async function getVisitorCount() {
  await connection()
  return db.prepare('SELECT value FROM counters WHERE name = ?').get('visitors')
}
```

အခုဆို `getVisitorCount()` ကို ခေါ်တဲ့ component ဘယ်ဟာမဆို — သူ့ရဲ့ output တစ်ခုလုံးနဲ့အတူ prerendering ကနေ ဖယ်ထုတ်ခံရပါမယ်။

## Reference

### Type

```jsx
function connection(): Promise<void>
```

### Parameters

- ဒီ function က parameter ဘာမှ လက်မခံပါဘူး။

### Returns

- `void` Promise တစ်ခု ပြန်ပေးပါတယ်။ ဒါကို consume လုပ်ဖို့ မရည်ရွယ်ပါဘူး။

## သိထားသင့်သည် (Good to know)

- `connection` က [`unstable_noStore`](https://nextjs.org/docs/app/api-reference/functions/unstable_noStore) နေရာကို အစားထိုးပါတယ် — Next.js ရဲ့ အနာဂတ်နဲ့ ပိုမိုလိုက်လျောညီထွေဖြစ်စေဖို့ပါ။
- Dynamic rendering လိုအပ်ပြီး — အသုံးများတဲ့ Request-time APIs တွေ မသုံးထားတဲ့အခါမှာပဲ ဒီ function က လိုအပ်ပါတယ်။
- [Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) တွေနဲ့ဆို — static shell ကနေ content ဖယ်ထုတ်ဖို့ [`io()`](https://nextjs.org/docs/app/api-reference/functions/io) ကို ဦးစားပေး သုံးပါ။ ဒါက ပုံစံတူ အလုပ်လုပ်ပေမယ့် — cache လုပ်လို့ရပြီး prefetch လုပ်လို့လည်း ရပါတယ်။ Rendering က တကယ့် user request တစ်ခုကို စောင့်ဆိုင်းသင့်တဲ့အခါမှာပဲ `connection()` ကို သုံးပါ။

## Version History

| Version      | အပြောင်းအလဲ                          |
| ------------ | ----------------------------------- |
| `v15.0.0`    | `connection` stabilized (တည်ငြိမ်) ဖြစ်လာ |
| `v15.0.0-RC` | `connection` စတင် မိတ်ဆက်            |
