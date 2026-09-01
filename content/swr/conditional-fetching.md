---
title: "Conditional Fetching"
description: "null key နဲ့ fetch ပိတ်ခြင်း၊ boolean condition နဲ့ conditional fetch၊ function key နဲ့ dependent fetching — waterfall ရှောင်ခြင်း"
order: 5
source: "https://swr.vercel.app/docs/conditional-fetching"
status: translated
updated: 2026-09-01
---

## Conditional — null key

Fetch လုပ်ဖို့ အခြေအနေ တစ်ခုခု ပြည့်မှသာ လိုချင်ရင် — `key` နေရာမှာ `null` (သို့) function ကို သုံးပါတယ်။ Function က falsy တန်ဖိုး ပြန်ရင် (သို့) throw လုပ်ရင် — SWR က request ကို မစပါဘူး:

```js
// condition ပေါ်မူတည်ပြီး fetch လုပ်မယ်
const { data } = useSWR(shouldFetch ? '/api/data' : null, fetcher)

// ...ဒါမှမဟုတ် falsy ပြန်တဲ့ function သုံးမယ်
const { data } = useSWR(() => shouldFetch ? '/api/data' : null, fetcher)

// ...ဒါမှမဟုတ် user.id မရှိသေးရင် error throw လုပ်မယ်
const { data } = useSWR(() => '/api/data?uid=' + user.id, fetcher)
```

ဒါကြောင့် — "အသုံးပြုသူ login ဝင်ထားမှသာ profile ယူမယ်" ဆိုတာမျိုးကို `cond ? key : null` ပုံစံနဲ့ ရိုးရိုးရှင်းရှင်း ရေးလို့ရပါတယ်။ Key က `null` (သို့) falsy ဖြစ်နေသရွေ့ hook က request မလုပ်ဘဲ — `data` ရော `error` ရော undefined အနေနဲ့ နေပါတယ်။

ဒီပုံစံက — "admin ဆိုရင်ပဲ admin data ယူမယ်" လို permission-based fetching တွေ၊ "search box ထဲ စာရိုက်မှသာ ရလဒ်ရှာမယ်" လို user input ပေါ်မူတည်တဲ့ fetching တွေမှာ အသုံးဝင်ပါတယ် — input ဗလာ ဖြစ်နေတုန်း request လွှတ်နေစရာ မလိုတော့ပါဘူး။

## Dependent — function key

နောက်ထပ် အားသာချက်တစ်ခုက — **data တစ်ခုပေါ်မူတည်ပြီး နောက်တစ်ခုကို ယူတာ** (dependent fetching) ပါ။ Function key ပေးလိုက်ရင် SWR က function ရဲ့ return တန်ဖိုးကို key အဖြစ် ယူပြီး — function က throw လုပ်ရင် (သို့) falsy ပြန်ရင် dependencies အဆင်သင့် မဖြစ်သေးဘူးလို့ နားလည်ပါတယ်:

```jsx
function MyProjects () {
  const { data: user } = useSWR('/api/user')
  const { data: projects } = useSWR(() => '/api/projects?uid=' + user.id)
  // function key သုံးရင် SWR က return တန်ဖိုးကို key အဖြစ် သုံးမယ်။
  // function က throw ဖြစ်ရင် (သို့) falsy ပြန်ရင် — dependencies အဆင်သင့်မဖြစ်သေးဘူးလို့ သိတယ်။
  // ဒီမှာ user.id က user မရသေးချိန်မှာ throw ဖြစ်ပါတယ်။

  if (!projects) return 'loading...'
  return 'You have ' + projects.length + ' projects'
}
```

ဒီနမူနာမှာ — `user` မရသေးသရွေ့ `projects` ရဲ့ request က မစတင်ဘဲ — `user` ရမှသာ `projects` ကို fetch လုပ်ပါတယ်။ ဒီ function key ပုံစံကို [Arguments (Key တွေ)](/docs/swr/arguments) မှာ ပြထားတဲ့ array/object key တွေနဲ့ တွဲသုံးလို့လည်း ရပါတယ်။

## Waterfall ရှောင်ခြင်း

SWR က ဒီလို dependent fetching တွေမှာ **maximum parallelism** ရအောင် စီစဉ်ပေးပါတယ် — မလိုအပ်ဘဲ request တစ်ခုပြီးမှ တစ်ခု ဆင့်စောင့်ရတဲ့ waterfall တွေကို ရှောင်ပြီး — တကယ် dynamic data လိုအပ်တဲ့နေရာမှာပဲ ဆက်တိုက် (serial) fetch လုပ်ပေးပါတယ်။

ဥပမာ — page တစ်ခုထဲမှာ မှီခိုမှု မရှိတဲ့ request ၃ ခု ရှိရင် — SWR က သုံးခုလုံးကို တစ်ပြိုင်နက် လွှတ်လိုက်ပြီး — တစ်ခုပြီးမှ တစ်ခု စောင့်ရတဲ့ နှေးကွေးမှုကို ရှောင်ပါတယ်။ Waterfall က network round-trip တွေ ဆက်တိုက် ဖြစ်စေလို့ — latency (ကြန့်ကြာချိန်) တွေ ပေါင်းသွားပြီး page နှေးစေပါတယ်။ ဒါကြောင့် "ဘယ် request က ဘယ် data ပေါ်မှာ မူတည်လဲ" ကိုသာ ကြေညာထားရင် — ကျန်တဲ့ စီစဉ်မှုကို SWR က လုပ်ပေးပါတယ်။

ဒါနဲ့ ဆက်စပ်ပြီး — [Arguments (Key တွေ)](/docs/swr/arguments) မှာ key ပုံစံအမျိုးမျိုး၊ [Data Fetching](/docs/swr/data-fetching) မှာ request key နဲ့ fetcher အခြေခံတွေကို ပြန်ကြည့်နိုင်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Arguments (Key တွေ)](/docs/swr/arguments) — array key, object key နဲ့ serialization
- [Data Fetching](/docs/swr/data-fetching) — request key နဲ့ fetcher အခြေခံ
