---
title: "Query Keys"
description: "query key ရေးနည်း — serializable array, hierarchical key, deterministic hashing, exact invalidation, key factory pattern"
order: 3
source: "https://tanstack.com/query/latest/docs/framework/react/guides/query-keys"
status: translated
updated: 2026-09-01
---

## Query key ဆိုတာ ဘာလဲ

TanStack Query က cache စီမံခန့်ခွဲမှု အကုန်လုံးကို **query key** ပေါ်မူတည်ပြီး လုပ်ပါတယ်။ Query key က **top-level မှာ array ဖြစ်ရမယ်** — string တစ်လုံးတည်းပါတဲ့ ရိုးရိုး array ကနေ string တွေ၊ nested object တွေ အများကြီးပါတဲ့ array အထိ ဖြစ်လို့ရပါတယ်။ `JSON.stringify` နဲ့ serialize လုပ်လို့ရပြီး **query ရဲ့ data နဲ့ ထပ်တူကျတဲ့ unique key** ဖြစ်နေသရွေ့ — ဘာကိုမဆို သုံးလို့ရပါတယ်။

## Key ပုံစံတွေ — ရိုးရိုး array ကနေ hierarchical အထိ

List/index လို generic resource တွေအတွက် constant တွေပဲ ပါတဲ့ ရိုးရိုး key ကို သုံးပါတယ်။ ဒါပေမယ့် query ရဲ့ data ကို ပိုတိတိကျကျ ခွဲခြားဖို့လိုရင် — item တစ်ခုကို id နဲ့ ခွဲတာ၊ filter ပါတဲ့ list တွေလို — string နဲ့ serializable object တွေကို ပေါင်းထည့်နိုင်ပါတယ်:

```tsx
// todos list တစ်ခုလုံး (generic list)
useQuery({ queryKey: ["todos"], ... });

// todo တစ်ခုချင်း (id နဲ့ ခွဲခြား)
useQuery({ queryKey: ["todo", 5], ... });

// "preview" format နဲ့ todo
useQuery({ queryKey: ["todo", 5, { preview: true }], ... });

// "done" type ရှိတဲ့ todos list (filter ပါတဲ့ list)
useQuery({ queryKey: ["todos", { type: "done" }], ... });
```

ဒီမှာ key တွေက hierarchy (အဆင့်ဆင့်) သဘောရှိပါတယ် — `["todos"]` က todos နဲ့ဆိုင်တဲ့ query အုပ်စုတစ်ခုလုံးရဲ့ အပေါ်ဆုံးအဆင့်၊ `["todos", { type: "done" }]` က အဲဒီထဲက subset တစ်ခုပါ။ ဒါက cache invalidation မှာ အရမ်းအသုံးဝင်ပါတယ် — အောက်ကို ကြည့်ပါ။

## Cache invalidation နဲ့ exact match

`invalidateQueries({ queryKey: ["todos"] })` လုပ်ရင် prefix ကိုက်ညီတဲ့ `["todos"]`, `["todos", { type: "done" }]` အစရှိတဲ့ query တွေ အကုန် invalidate ဖြစ်သွားပါတယ် (**fuzzy match** — ရှေ့ဆုံးကနေ စတင်ကိုက်ညီမှု)။ **တိတိကျကျ တစ်ခုပဲ လိုချင်ရင်** `exact: true` ထည့်ပါ:

```tsx
// todos နဲ့ဆိုင်တဲ့ query အကုန် (fuzzy/prefix match)
queryClient.invalidateQueries({ queryKey: ["todos"] });

// ["todos"] အတိအကျ တစ်ခုပဲ
queryClient.invalidateQueries({ queryKey: ["todos"], exact: true });
```

## Deterministic hashing — key တူတူ ဖြစ်စေမယ့် စည်းမျဉ်း

TanStack Query က query key တွေကို **deterministic** (တူညီတဲ့ input မှာ တူညီတဲ့ output ရတဲ့) အနေနဲ့ hash လုပ်ပါတယ်။ ဆိုလိုတာက — object ထဲက property တွေရဲ့ ရေးစဉ် အစဉ်လိုက် မဟုတ်ပါဘူး။ အောက်ပါ query တွေကို **တူညီတယ်လို့ သတ်မှတ်ပါတယ်** — ဒါပေမယ့် **array ထဲက item တွေရဲ့ အစဉ်လိုက်ကတော့ အရေးကြီးပါတယ်**:

```tsx
// object ရဲ့ key တွေ စီထားပုံ မတူပေမယ့် — ဒါတွေ အကုန် တူညီတယ်
useQuery({ queryKey: ["todos", { status, page }], ... });
useQuery({ queryKey: ["todos", { page, status }], ... });
useQuery({ queryKey: ["todos", { page, status, other: undefined }], ... });

// ဒါတွေကတော့ မတူညီဘူး — array item တွေရဲ့ အစဉ်လိုက်က အရေးကြီးတယ်
useQuery({ queryKey: ["todos", status, page], ... });
useQuery({ queryKey: ["todos", page, status], ... });
useQuery({ queryKey: ["todos", undefined, page, status], ... });
```

Object ထဲက `undefined` တန်ဖိုးတွေကို ignore လုပ်တာမို့ — တတိယ query မှာ `other: undefined` ပါပေမယ့် ပထမ နှစ်ခုနဲ့ တူညီပါတယ်။ Array ထဲကတော့ `undefined` က နေရာယူထားလို့ မတူညီတော့ပါဘူး။

## Query function ရဲ့ variable တွေကို key ထဲမှာ ထည့်ပါ

Query key က data ကို တစ်မူထူးခြားစွာ ဖော်ပြတာမို့ — query function ထဲမှာ သုံးတဲ့ **ပြောင်းလဲနိုင်တဲ့ variable အားလုံးကို key ထဲမှာ ထည့်ရပါမယ်**။ ဥပမာ — `queryFn` က `todoId` ကို သုံးတယ်ဆိုရင် key က `["todos", todoId]` ဖြစ်ရပါမယ်။ ဒါမှ query တွေ သီးခြားစီ cache ဖြစ်ပြီး variable ပြောင်းတိုင်း refetch ဖြစ်မှာပါ (staleTime ပေါ်မူတည်ပြီး) — ဒါကို [Queries အသေးစိတ်](/docs/tanstack-query/queries) မှာ ပြထားတဲ့ `queryKey`/`queryFn` တွဲဖက်သုံးပုံနဲ့ ချိတ်ဆက်ကြည့်နိုင်ပါတယ်။

## Key factory pattern — key တွေကို စနစ်တကျ စုစည်းခြင်း

App ကြီးလာတာနဲ့အမျှ key တွေ နေရာမျိုးစုံမှာ ရှိနေတတ်ပြီး — ရှေ့ဆက်ပြီး ပြောင်းရခက်အောင် ဖြစ်စေပါတယ်။ ဒါကို ရှောင်ဖို့ **key factory** ပုံစံကို သုံးပါတယ် — key တွေကို နေရာတစ်ခုတည်းမှာ define လုပ်ပြီး နေရာတိုင်းက ပြန်သုံးတာပါ:

```tsx
const todoKeys = {
  all: ["todos"] as const,
  detail: (id: number) => ["todos", "detail", id] as const,
  list: (filters: Filters) => ["todos", "list", filters] as const,
};

// သုံးတဲ့အခါ
useQuery({ queryKey: todoKeys.list({ type: "done" }) });
queryClient.invalidateQueries({ queryKey: todoKeys.all });
```

ဒီလိုဆိုရင် — key structure ကို ပြောင်းချင်ရင် factory တစ်နေရာပဲ ပြောင်းရပြီး၊ app တစ်ခုလုံးမှာ key ရေးပုံ တစ်ပုံစံတည်း ဖြစ်သွားပါတယ်။ ဒါက official docs ရဲ့ further reading မှာ ညွှန်းထားတဲ့ [Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys) ဆောင်းပါးက လူကြိုက်များတဲ့ pattern ပါ။ Cache invalidation ရဲ့ အပြုအမူအပြည့်အစုံကို [Caching အခြေခံ](/docs/tanstack-query/cache) မှာ ဖတ်နိုင်ပါတယ်။
