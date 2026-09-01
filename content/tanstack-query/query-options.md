---
title: "Query Options (Query Option များ)"
description: "`queryOptions` helper နဲ့ queryKey/queryFn တွေကို နေရာတစ်ခုတည်းမှာ ပေါင်းစပ်ထားနည်း — TypeScript type inference, component level override, select function"
order: 28
source: "https://tanstack.com/query/latest/docs/framework/react/guides/query-options"
status: translated
updated: 2026-09-01
---

`queryKey` နဲ့ `queryFn` တွေကို နေရာမျိုးစုံကြားမှာ မျှဝေသုံးဖို့ — တစ်ချိန်တည်းမှာပဲ တစ်နေရာတည်းမှာ co-located ဖြစ်အောင် ထားဖို့ — အကောင်းဆုံး နည်းလမ်းတွေထဲက တစ်ခုက `queryOptions` helper ကို သုံးတာပါ။ Runtime မှာတော့ — ဒီ helper က သင်ထည့်ပေးလိုက်တဲ့အရာကို ပြန်ပေးရုံပါပဲ — ဒါပေမယ့် [TypeScript နဲ့ သုံးတဲ့အခါ](https://tanstack.com/query/latest/docs/framework/react/typescript#typing-query-options) အကျိုးကျေးဇူး အများကြီး ရှိပါတယ်။ Query တစ်ခုအတွက် ဖြစ်နိုင်တဲ့ options တွေ အားလုံးကို နေရာတစ်ခုတည်းမှာ သတ်မှတ်နိုင်ပြီး — အားလုံးအတွက် type inference နဲ့ type safety ကိုပါ ရပါလိမ့်မယ်။

```ts
import { queryOptions } from '@tanstack/react-query'

function groupOptions(id: number) {
  return queryOptions({
    queryKey: ['groups', id],
    queryFn: () => fetchGroups(id),
    staleTime: 5 * 1000,
  })
}

// usage:

useQuery(groupOptions(1))
useSuspenseQuery(groupOptions(5))
useQueries({
  queries: [groupOptions(1), groupOptions(2)],
})
queryClient.query(groupOptions(23))
queryClient.setQueryData(groupOptions(42).queryKey, newGroups)
```

Infinite Queries အတွက်တော့ — သီးခြား [`infiniteQueryOptions`](https://tanstack.com/query/latest/docs/framework/react/reference/infiniteQueryOptions) helper တစ်ခု ရနိုင်ပါတယ်။

Component အဆင့်မှာ options တစ်ချို့ကို override လုပ်နိုင်ပါသေးတယ်။ အသုံးများပြီး အသုံးဝင်တဲ့ pattern တစ်ခုက — component တစ်ခုချင်းစီအတွက် [`select`](/docs/tanstack-query/render-optimizations#select) functions တွေ ဖန်တီးတာပါ:

```ts
// Type inference က ဆက်အလုပ်လုပ်ပါတယ် — ဒါကြောင့် query.data က
// queryFn ရဲ့ return type အစား select ရဲ့ return type ဖြစ်ပါလိမ့်မယ်

const query = useQuery({
  ...groupOptions(1),
  select: (data) => data.groupName,
})
```
