---
title: "Caching အခြေခံ"
description: "TanStack Query ရဲ့ cache သဘောတရား — staleTime, gcTime, refetch triggers, background refetch, invalidateQueries"
order: 5
source: "https://tanstack.com/query/latest/docs/framework/react/guides/caching"
status: translated
updated: 2026-09-01
---

## Cache ရဲ့ အလုပ်လုပ်ပုံ

TanStack Query က fetch လုပ်ပြီးသား data တွေကို **query key တစ်ခုစီအတွက် cache** ထဲမှာ သိမ်းထားပြီး — key တူတဲ့ query တစ်ခြား component မှာ ပေါ်လာရင် network မသွားဘဲ cache ထဲက data ကို ပြန်သုံးပါတယ်။ Cache ကို ထိန်းချုပ်တဲ့ option အဓိက နှစ်ခုက **staleTime** နဲ့ **gcTime** ပါ:

| option | ဘာကို ထိန်းချုပ်လဲ | default |
|---|---|---|
| `staleTime` | data ကို "fresh" (အသစ်) လို့ သတ်မှတ်ထားတဲ့ ကြာချိန် — ဒီအတွင်း refetch မလုပ်ဘူး | `0` (fetch ပြီးတာနဲ့ ချက်ချင်း stale) |
| `gcTime` | inactive query (component မရှိတော့တဲ့ query) ကို garbage collection မလုပ်ခင် ထားတဲ့ ကြာချိန် | 5 မိနစ် |

နှစ်ခုလုံးကို per-query ဖြစ်ဖြစ်၊ QueryClient default အနေနဲ့ဖြစ်ဖြစ် သတ်မှတ်လို့ရပါတယ်:

```tsx
// per-query သတ်မှတ်ခြင်း
useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  staleTime: 60 * 1000,   // 1 မိနစ်အတွင်း fresh လို့ သတ်မှတ်မယ်
  gcTime: 5 * 60 * 1000,  // 5 မိနစ် အသုံးမပြုရရင် ဖျက်မယ်
});

// QueryClient တစ်ခုလုံးအတွက် default
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});
```

အရေးကြီးတာက — `staleTime` က data "အသစ်ဖြစ်နေတုန်း" ဆိုတဲ့ ကြာချိန်ပါ၊ **cache ထဲက ဖျက်ပစ်တာ မဟုတ်ပါဘူး**။ Cache ကနေ ဖျက်ပစ်တာက `gcTime` ရဲ့ အလုပ်ပါ။

## Cache lifecycle — ဘယ်လို ဖြစ်ပျက်သလဲ

gcTime default (5 မိနစ်) နဲ့ staleTime default (0) ဆိုပြီး `["todos"]` query ရဲ့ ဘဝဖြစ်စဉ်ကို ကြည့်ရအောင်:

1. **ပထမဆုံး `useQuery({ queryKey: ["todos"] })` mount** — cache ထဲမှာ ဘာမှ မရှိသေးလို့ hard loading state ပြပြီး network request လုပ်ပါတယ်။ ပြီးရင် data ကို `["todos"]` key အောက်မှာ cache လုပ်ပြီး — staleTime `0` မို့ ချက်ချင်း stale ဖြစ်သွားပါတယ်။
2. **နောက် component တစ်ခုက တူညီတဲ့ key နဲ့ mount** — cache ထဲက data ကို ချက်ချင်း ပြန်ရပြီး (loading မပြ) — နောက်ခံမှာ network request အသစ် တစ်ခု ထပ်သွားပါတယ် (**background refetch**)။ အောင်မြင်ရင် cache ရော၊ component နှစ်ခုလုံးရဲ့ UI ရော data အသစ်နဲ့ update ဖြစ်ပါတယ်။
3. **Component တွေ အကုန် unmount** — query က inactive ဖြစ်ပြီး gcTime 5 မိနစ် countdown စပါတယ်။
4. **5 မိနစ်အတွင်း ပြန် mount** — cache ထဲက data ကို ချက်ချင်း ပြန်ရပြီး background မှာ ပြန် fetch ပါတယ်။
5. **5 မိနစ် အသုံးမပြုရ** — cache ထဲက data ကို garbage collect (ဖျက်ပစ်) ပါတယ်။ နောက်ထပ် mount ဖြစ်ရင် network ကနေ အစကနေ ပြန်ယူရပါတယ်။

ဒါကြောင့် — **staleTime ကို တိုးထားရင် network request တွေ နည်းသွားပြီး၊ gcTime ကို တိုးထားရင် user ပြန်လာတဲ့အခါ cache ထဲက data ကို ပြန်သုံးလို့ရတယ်** ဆိုတဲ့ နှစ်ခုရဲ့ အခန်းကဏ္ဍ ကွဲပြားပါတယ်။

## Refetch triggers — ဘယ်အချိန်တွေ ပြန် fetch ဖြစ်လဲ

Active ဖြစ်နေတဲ့ (mount ဖြစ်နေတဲ့) query တွေက stale ဖြစ်နေရင် အောက်ပါအချိန်တွေမှာ refetch ပါတယ်:

- **Query instance အသစ် mount** တဲ့အခါ (refetchOnMount — default `true`)
- **Window ကို ပြန် focus** လုပ်တဲ့အခါ (refetchOnWindowFocus — default `true`)
- **Network ပြန် reconnect** ဖြစ်တဲ့အခါ (refetchOnReconnect — default `true`)
- **refetchInterval** သတ်မှတ်ထားရင် အချိန်ပိုင်းအလိုက် (polling)

```tsx
useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  refetchInterval: 5000, // 5 စက္ကန့်တိုင်း အလိုအလျောက် refetch (polling)
});
```

`refetchInterval` ကို မသတ်မှတ်ထားရင် (default `false`) interval refetch မရှိပါဘူး။ Window focus refetch အကြောင်း နောက်ထပ်အသေးစိတ်ကို [Queries အသေးစိတ်](/docs/tanstack-query/queries) မှာ ဖတ်နိုင်ပါတယ်။

## Background refetch — UI မလှုပ်ဘဲ ပြန် fetch

TanStack Query ရဲ့ ထူးခြားချက်က refetch တွေကို **background မှာ** လုပ်တာပါ — cache ထဲက ဟောင်းနေတဲ့ data ကို ဆက်ပြသနေပြီး (stale-while-revalidate) နောက်ခံမှာ data အသစ် ရောက်လာတာနဲ့ ချောမွေ့စွာ ပြောင်းပါတယ်။ Loading spinner ပြန်ပေါ်မလာပါဘူး။ Background fetch ဖြစ်နေလားသိဖို့ `isFetching` ကို ကြည့်နိုင်ပြီး — ဒါက "data မရှိသေးလို့" ဆိုတဲ့ `isPending` နဲ့ မတူပါဘူး။

## Cache invalidation — invalidateQueries

Data တွေ ပြောင်းလဲသွားတဲ့အခါ (mutation ပြီးနောက်မျိုး) cache က ဟောင်းသွားပြီဆိုတာ TanStack Query ကို အသိပေးဖို့ `invalidateQueries` ကို သုံးပါတယ်:

```tsx
// todos နဲ့ဆိုင်တဲ့ query တွေကို stale လုပ်ပြီး — active ဆိုရင် ချက်ချင်း refetch
queryClient.invalidateQueries({ queryKey: ["todos"] });

// key အတိအကျ တစ်ခုပဲ လိုချင်ရင် exact: true
queryClient.invalidateQueries({ queryKey: ["todos"], exact: true });
```

Invalidate လုပ်လိုက်တဲ့ query တွေက stale ဖြစ်သွားပြီး — **active** (mount ဖြစ်နေတဲ့) query တွေက ချက်ချင်း refetch ဖြစ်ပြီး inactive တွေက နောက် mount ဖြစ်တဲ့အခါမှ refetch ပါတယ်။ Key တွေရဲ့ prefix matching အကြောင်း [Query Keys](/docs/tanstack-query/query-keys) မှာ ရှိပြီး — mutation ပြီးနောက် invalidate လုပ်နည်းက [Mutations အသေးစိတ်](/docs/tanstack-query/mutations) မှာ ပါပါတယ်။
