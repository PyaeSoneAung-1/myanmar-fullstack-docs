---
title: "Queries အသေးစိတ်"
description: "query ရဲ့ mechanism — queryKey နဲ့ queryFn, enabled, retry, staleTime vs gcTime, refetchOnWindowFocus, status နဲ့ fetchStatus"
order: 2
source: "https://tanstack.com/query/latest/docs/framework/react/guides/queries"
status: translated
updated: 2026-09-01
---

## Query ရဲ့ အခြေခံ

[TanStack Query မိတ်ဆက်](/docs/tanstack-query/getting-started) မှာ `useQuery` ကို မိတ်ဆက်ပြီးသားပါ — ဒီ guide မှာတော့ query ရဲ့ အသေးစိတ် mechanism တွေကို ကြည့်ကြရအောင်။

**Query** ဆိုတာ async data source တစ်ခုအပေါ် မှီခိုနေတဲ့ declarative dependency (ကြေညာချက်ပုံစံ မှီခိုမှု) ပါ — သူ့မှာ **unique key** တစ်ခုစီ ရှိပါတယ်။ Component တစ်ခုထဲမှာ query သုံးဖို့ `useQuery` hook ကို အနည်းဆုံး ဒါနှစ်ခုနဲ့ ခေါ်ရပါတယ်:

- Query ကို ခွဲခြားဖို့ **unique key**
- Promise ပြန်ပေးတဲ့ function — data ရအောင် resolve လုပ်တာ ဒါမှမဟုတ် error throw လုပ်တာ

```tsx
import { useQuery } from "@tanstack/react-query";

function App() {
  const info = useQuery({ queryKey: ["todos"], queryFn: fetchTodoList });
}
```

ပေးလိုက်တဲ့ unique key ကို TanStack Query က **refetching, caching, sharing** — query တွေကို app တစ်လျှောက် ပြန်သုံးနိုင်အောင် — အတွင်းပိုင်းမှာ သုံးပါတယ်။

## queryKey နဲ့ queryFn — တွဲဖက်သုံးရတဲ့ အတွဲ

`queryKey` က **ဘယ် data လဲ** ဆိုတာကို ဖော်ပြပြီး `queryFn` က **အဲဒီ data ကို ဘယ်လိုယူမလဲ** ဆိုတာကို ဖော်ပြပါတယ်။ Query function ထဲမှာ သုံးထားတဲ့ variable တွေကို query key ထဲမှာလည်း ထည့်ထားရပါမယ် — ဒါမှ query တွေကို သီးခြားစီ cache လုပ်နိုင်ပြီး variable ပြောင်းတိုင်း refetch ဖြစ်မှာပါ။ ဥပမာ — `queryFn` က `todoId` ကို သုံးတယ်ဆိုရင် key က `["todos", todoId]` လို ဖြစ်ရပါမယ်။ အသေးစိတ်ကို [Query Keys](/docs/tanstack-query/query-keys) မှာ ဖတ်နိုင်ပါတယ်။

## enabled option — fetch ကို ခဏရပ်ထားခြင်း

`enabled` ကို `false` ထားရင် query က အလိုအလျောက် fetch လုပ်မှာ မဟုတ်ပါဘူး။ ဥပမာ — user ရွေးထားတဲ့ id မရှိသေးခင်မှာ fetch မလုပ်စေချင်တဲ့အခါမျိုး:

```tsx
const { isPending, error, data, isFetching } = useQuery({
  queryKey: ["todos", todoId],
  queryFn: () => fetchTodoById(todoId),
  enabled: !!todoId, // todoId ရှိမှသာ fetch လုပ်မယ်
});
```

`enabled: false` ဖြစ်နေချိန်မှာ cache ထဲမှာ data မရှိရင် query က `pending` status နဲ့ ရပ်နေပြီး — `refetch()` ကို ကိုယ်တိုင်ခေါ်မှသာ fetch လုပ်ပါတယ်။ ဒီ option ကို **dependent query** (query A ပြီးမှ query B ကို run စေချင်ရင် B ရဲ့ `enabled` ကို A ရဲ့ data ပေါ်မူတည်ပြီး သတ်မှတ်တာမျိုး) ဆောက်ဖို့လည်း သုံးလေ့ရှိပါတယ်။

## retry, staleTime နဲ့ gcTime — အသုံးများတဲ့ options

**retry** — failed query တွေကို default အနေနဲ့ **3 ကြိမ်** အလိုအလျောက် ပြန်ကြိုးစားပေးပြီး၊ ကြိုးစားချက်တစ်ခုနဲ့တစ်ခုကြားမှာ exponential backoff delay (အချိန် ဆတိုးဆတိုး စောင့်တာ) ရှိပါတယ်။ `retry: false` ထားရင် ပထမအကြိမ် မအောင်မြင်တာနဲ့ error state ကို ချက်ချင်း ပြောင်းသွားပါတယ်။ Network ပြတ်နေလို့ ဖြစ်တဲ့ failure တွေကတော့ network ပြန်ရတဲ့အခါမှ ပြန်ကြိုးစားပါတယ်။

**staleTime** နဲ့ **gcTime** က TanStack Query မှာ အများဆုံး ရောထွေးတတ်တဲ့ option နှစ်ခုပါ — staleTime က data ကို "fresh" (အသစ်) လို့ သတ်မှတ်ထားတဲ့ ကြာချိန်ဖြစ်ပြီး (ဒီအတွင်း refetch မလုပ်တော့ဘဲ cache ကို ပြန်သုံးတယ်၊ default `0` — fetch ပြီးတာနဲ့ ချက်ချင်း stale ဖြစ်တယ်)။ gcTime ကတော့ inactive ဖြစ်နေတဲ့ query (component တွေ အကုန် unmount ဖြစ်သွားတဲ့ query) ကို garbage collection (မှတ်ဉာဏ်ကနေ ဖျက်ပစ်တာ) မလုပ်ခင် ထားပေးတဲ့ ကြာချိန်ပါ — default က **5 မိနစ်**။ အတူတူ သတ်မှတ်ပုံ:

```tsx
useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
  retry: 5,           // အမှားဖြစ်ရင် 5 ကြိမ် ပြန်ကြိုးစားမယ်
  staleTime: 60 * 1000, // 1 မိနစ်အတွင်း fresh လို့ သတ်မှတ်မယ်
  gcTime: 5 * 60 * 1000, // 5 မိနစ် အသုံးမပြုရရင် cache ကနေ ဖျက်မယ်
});
```

ဒီနှစ်ခုရဲ့ lifecycle အပြည့်အစုံကို [Caching အခြေခံ](/docs/tanstack-query/cache) မှာ ကြည့်နိုင်ပါတယ်။

## refetchOnWindowFocus

Default အနေနဲ့ TanStack Query က window ကို user ပြန် focus လုပ်တိုင်း — tab ပြန်ပြောင်းတာ၊ app ပြန်ဖွင့်တာ — **stale ဖြစ်နေတဲ့ query တွေကို အလိုအလျောက် refetch** လုပ်ပေးပါတယ်။ ဒါက background မှာ ဖြစ်တာမို့ UI က မလှုပ်ဘဲ နေပါတယ်။ မလိုချင်ရင် `refetchOnWindowFocus: false` ထားနိုင်ပြီး — default ကတော့ `true` ပါ။

## status နဲ့ fetchStatus — state နှစ်မျိုး

`useQuery` ရဲ့ result ထဲမှာ state အမျိုးအစား နှစ်မျိုး ရှိပါတယ် — **status** နဲ့ **fetchStatus**။ Status က **data ရှိလား မရှိဘူးလား** ဆိုတာကို ပြောပြီး fetchStatus က **queryFn အလုပ်လုပ်နေလား** ဆိုတာကို ပြောပါတယ်။

| status | အဓိပ္ပာယ် |
|---|---|
| `pending` | data မရှိသေးဘူး (isPending) |
| `error` | အမှားတစ်ခုခု ဖြစ်သွားတယ် (isError) |
| `success` | အောင်မြင်ပြီး data ရနေပြီ (isSuccess) |

| fetchStatus | အဓိပ္ပာယ် |
|---|---|
| `fetching` | လက်ရှိ fetch လုပ်နေတယ် |
| `paused` | fetch လုပ်ချင်ပေမယ့် network မရှိလို့ ရပ်ထားတယ် |
| `idle` | ဘာမှ မလုပ်နေဘူး |

State နှစ်မျိုး ဘာကြောင့် လိုသလဲဆိုရင် — background refetch နဲ့ stale-while-revalidate logic ကြောင့် ပေါင်းစပ်မှု အကုန်လုံး ဖြစ်နိုင်လို့ပါ။ ဥပမာ — `success` status ရှိတဲ့ query က ပုံမှန်ဆို `idle` fetchStatus ဖြစ်ပေမယ့် background refetch ဖြစ်နေရင် `fetching` ဖြစ်နေနိုင်ပါတယ်။ အဲဒါကြောင့် "data ရှိပြီးသား" နဲ့ "fetch လုပ်နေတုန်း" ဆိုတဲ့ အခြေအနေ နှစ်မျိုးကို သီးခြားစီ သိနေဖို့ လိုပါတယ်။ မှတ်ထားစရာ စည်းမျဉ်း — status က data အကြောင်း၊ fetchStatus က queryFn အကြောင်းပါ။

UI မှာ ပုံမှန် စစ်တဲ့ပုံက — `pending` ရှိမရှိ ကြည့်၊ ပြီးရင် `error` ရှိမရှိ ကြည့်၊ ကျန်ရင် data ရှိတယ်လို့ ယူဆပြီး render လုပ်ပါတယ်:

```tsx
function Todos() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodoList,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  // ဒီနေရာရောက်ရင် isSuccess === true လို့ ယူဆလို့ရပြီ
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

`isFetching` ကတော့ background refetch အပါအဝင် — ဘယ်အချိန် fetch လုပ်နေလဲ သိချင်ရင် သုံးတဲ့ flag ပါ။ Data ကို update လုပ်ချင်တဲ့အခါ [Mutations အသေးစိတ်](/docs/tanstack-query/mutations) ကို ကြည့်ပါ။
