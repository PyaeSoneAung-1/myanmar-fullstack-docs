---
title: "Arguments (Key တွေ)"
description: "useSWR ရဲ့ key ပုံစံမျိုးစုံ — string key, array key (multiple arguments), object key — fetcher ဆီ argument ပို့နည်းနဲ့ serialization သတိထားစရာများ"
order: 4
source: "https://swr.vercel.app/docs/arguments"
status: translated
updated: 2026-09-01
---

## Key ကို fetcher ဆီ ပို့ခြင်း

`useSWR` မှာ default အနေနဲ့ — `key` ကို `fetcher` ဆီ argument အနေနဲ့ ပေးလိုက်ပါတယ်။ ဒါကြောင့် အောက်က သုံးပုံစံလုံးက အတူတူပါပဲ:

```js
useSWR('/api/user', () => fetcher('/api/user'))
useSWR('/api/user', url => fetcher(url))
useSWR('/api/user', fetcher)
```

ဒါကြောင့် `fetcher` က သူ့ရဲ့ parameter ထဲမှာ key ရဲ့တန်ဖိုးကို တိုက်ရိုက် လက်ခံနိုင်ပါတယ် — `url => ...` လို ကိုယ်တိုင် လက်ခံပြီး သုံးတာဖြစ်ဖြစ်၊ `fetcher` ကို တိုက်ရိုက် ထည့်လိုက်တာဖြစ်ဖြစ် ရပါတယ်။

## Multiple Arguments — array key

တစ်ခါတလေ `fetcher` ဆီ argument တစ်ခုထက်ပို ပို့ချင်ပါတယ် — ဥပမာ authentication token ပါတဲ့ authorized request မျိုး။ ဒါကို လူတွေ မကြာခဏ ရေးမိတတ်တဲ့ မှားတဲ့ပုံစံက:

```js
// ❌ မှားတယ် — cache key က '/api/user' တစ်ခုတည်းမို့ — token ပြောင်းရင်တောင်
// SWR က key တူနေလို့ data ဟောင်း (မှားနေတဲ့ data) ပြန်ရနိုင်တယ်
useSWR('/api/user', url => fetchWithToken(url, token))
```

ဒါ ဘာလို့ မှားလဲဆိုရင် — data ရဲ့ identifier (cache key) က `'/api/user'` တစ်ခုတည်း ဖြစ်နေလို့ပါ။ Token ပြောင်းလဲပေမယ့် SWR က key အတူတူ သုံးနေဦးမှာမို့ — မှားနေတဲ့ data ပြန်ရနိုင်ပါတယ်။ အဲဒီအစား **array ကို key အနေနဲ့ သုံးပြီး** fetcher ရဲ့ arguments တွေကို အထဲမှာ ထည့်လိုက်ပါ:

```js
const { data: user } = useSWR(['/api/user', token], ([url, token]) => fetchWithToken(url, token))
```

ဒီနေရာမှာ `fetcher` က key ကို မူရင်းအတိုင်း — array တစ်ခုလုံး — လက်ခံပြီး destructure လုပ်ပြီး သုံးပါတယ်။ Cache key တစ်ခုလုံးက `['/api/user', token]` နဲ့ ချိတ်ဆက်သွားလို့ — `token` ပြောင်းတိုင်း key အသစ် ဖြစ်ပြီး data အသစ် ပြန်ယူပါတယ်။

သတိထားစရာ — အရင်ဗားရှင်းတွေမှာ (< 2.0.0) key က array ဖြစ်ရင် `fetcher` ဆီ argument တွေကို spread ပြီး တစ်ခုချင်း ရောက်သွားလို့ `fetcher(url, token)` လို့ ရေးရပါတယ်။ လက်ရှိဗားရှင်းမှာတော့ array တစ်ခုလုံးကို argument တစ်ခုတည်း အနေနဲ့ လက်ခံပြီး — `([url, token]) => ...` လို destructure ဖြစ်ဖြစ်၊ `args => fetchWithToken(...args)` လို spread ဖြစ်ဖြစ် သုံးလို့ရပါတယ်။

## Object key

SWR 1.1.0 ကစပြီး — object ပုံစံ key တွေကို အောက်ခံမှာ **serialize** (string အဖြစ် ပြောင်း) လုပ်ပြီး အလိုအလျောက် သုံးပါတယ်။ Object ကို key အဖြစ် တိုက်ရိုက် ပေးလို့ရပြီး — `fetcher` ကလည်း အဲဒီ object ကိုပဲ လက်ခံပါတယ်:

```js
const { data: orders } = useSWR({ url: '/api/orders', args: user }, fetcher)
```

သတိထားစရာ (serialization caveat) — key တွေကို cache key အနေနဲ့ string အဖြစ် serialize လုပ်သုံးတာမို့ **stable (တည်ငြိမ်) ဖြစ်တဲ့ ပုံစံနဲ့ပဲ သုံးသင့်ပါတယ်**။ Render တိုင်း object အသစ် ဆောက်ပေးပေမယ့် — ထဲက တန်ဖိုးတွေ အတူတူဆိုရင် serialize ရလဒ် အတူတူမို့ cache key မပြောင်းပါဘူး။ ဒါပေမယ့် function လို serialize မလုပ်နိုင်တဲ့ (သို့) အကြိမ်တိုင်း မတူညီတဲ့ တန်ဖိုး ထွက်တတ်တဲ့ အရာတွေကို key ထဲ ထည့်ရင် — cache ခွဲထွက်ပြီး data မှား ရနိုင်တာမို့ ရှောင်သင့်ပါတယ်။

အရင်ဗားရှင်းတွေမှာ (< 1.1.0) — SWR က render တိုင်း arguments တွေကို **shallow** နှိုင်းယှဉ်ပြီး — တစ်ခုခု ပြောင်းရင် revalidation လုပ်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Conditional Fetching](/docs/swr/conditional-fetching) — null key နဲ့ conditional/dependent fetching
- [Data Fetching](/docs/swr/data-fetching) — request key နဲ့ fetcher အခြေခံ
