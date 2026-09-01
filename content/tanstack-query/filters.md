---
title: "Filters (filter လုပ်ခြင်း)"
description: "queryClient ရဲ့ method တွေမှာ သုံးတဲ့ QueryFilters နဲ့ MutationFilters — queryKey, exact, type, stale, fetchStatus, predicate option များ, matchQuery/matchMutation utilities"
order: 16
source: "https://tanstack.com/query/latest/docs/framework/react/guides/filters"
status: translated
updated: 2026-09-01
---

TanStack Query ထဲက method အချို့က `QueryFilters` ဒါမှမဟုတ် `MutationFilters` object တစ်ခုကို လက်ခံပါတယ်။

## Query Filters

Query filter ဆိုတာ — query တစ်ခုနဲ့ တွဲဖို့ (match) condition အချို့ ပါဝင်တဲ့ object တစ်ခုပါ:

```tsx
// Query အားလုံးကို cancel လုပ်မယ်
await queryClient.cancelQueries()

// key မှာ `posts` နဲ့ စတင်တဲ့ inactive query တွေ အားလုံးကို ဖယ်ရှားမယ်
queryClient.removeQueries({ queryKey: ['posts'], type: 'inactive' })

// Active query တွေ အားလုံးကို refetch လုပ်မယ်
await queryClient.refetchQueries({ type: 'active' })

// key မှာ `posts` နဲ့ စတင်တဲ့ active query တွေ အားလုံးကို refetch လုပ်မယ်
await queryClient.refetchQueries({ queryKey: ['posts'], type: 'active' })
```

Query filter object တစ်ခုက အောက်ပါ property တွေကို ထောက်ပံ့ပါတယ်:

- `queryKey?: QueryKey`
  - Match လုပ်ဖို့ query key တစ်ခုကို သတ်မှတ်ဖို့ ဒီ property ကို ထားပါ။
- `exact?: boolean`
  - Query key နဲ့ တိုက်ရိုက် (inclusively) ရှာချင်တာမဟုတ်ဘူးဆိုရင် — သင်ထည့်လိုက်တဲ့ query key နဲ့ အတိအကျ တူတဲ့ query ကိုသာ ပြန်ပေးဖို့ `exact: true` option ကို ထည့်နိုင်ပါတယ်။
- `type?: 'active' | 'inactive' | 'all'`
  - Default က `all`
  - `active` လို့ သတ်မှတ်ရင် active query တွေကို match လုပ်ပါမယ်။
  - `inactive` လို့ သတ်မှတ်ရင် inactive query တွေကို match လုပ်ပါမယ်။
- `stale?: boolean`
  - `true` လို့ သတ်မှတ်ရင် stale query တွေကို match လုပ်ပါမယ်။
  - `false` လို့ သတ်မှတ်ရင် fresh query တွေကို match လုပ်ပါမယ်။
- `fetchStatus?: FetchStatus`
  - `fetching` လို့ သတ်မှတ်ရင် လက်ရှိ fetch လုပ်နေတဲ့ query တွေကို match လုပ်ပါမယ်။
  - `paused` လို့ သတ်မှတ်ရင် fetch လုပ်ချင်ပေမယ့် `paused` (ရပ်ထားခံရ) ဖြစ်နေတဲ့ query တွေကို match လုပ်ပါမယ်။
  - `idle` လို့ သတ်မှတ်ရင် fetch မလုပ်နေတဲ့ query တွေကို match လုပ်ပါမယ်။
- `predicate?: (query: Query) => boolean`
  - ဒီ predicate function ကို match ဖြစ်တဲ့ query တွေ အားလုံးအပေါ် နောက်ဆုံး filter အဖြစ် သုံးပါလိမ့်မယ်။ တခြား filter တွေ သတ်မှတ်မထားရင် — ဒီ function ကို cache ထဲက query တိုင်းအပေါ် အကဲဖြတ်ပါလိမ့်မယ်။

## Mutation Filters

Mutation filter ဆိုတာ — mutation တစ်ခုနဲ့ တွဲဖို့ (match) condition အချို့ ပါဝင်တဲ့ object တစ်ခုပါ:

```tsx
// Fetch လုပ်နေတဲ့ mutation တွေရဲ့ အရေအတွက်ကို ရယူမယ်
await queryClient.isMutating()

// mutationKey နဲ့ mutation တွေကို filter လုပ်မယ်
await queryClient.isMutating({ mutationKey: ['post'] })

// Predicate function သုံးပြီး mutation တွေကို filter လုပ်မယ်
await queryClient.isMutating({
  predicate: (mutation) => mutation.state.variables?.id === 1,
})
```

Mutation filter object တစ်ခုက အောက်ပါ property တွေကို ထောက်ပံ့ပါတယ်:

- `mutationKey?: MutationKey`
  - Match လုပ်ဖို့ mutation key တစ်ခုကို သတ်မှတ်ဖို့ ဒီ property ကို ထားပါ။
- `exact?: boolean`
  - Mutation key နဲ့ တိုက်ရိုက် (inclusively) ရှာချင်တာမဟုတ်ဘူးဆိုရင် — သင်ထည့်လိုက်တဲ့ mutation key နဲ့ အတိအကျ တူတဲ့ mutation ကိုသာ ပြန်ပေးဖို့ `exact: true` option ကို ထည့်နိုင်ပါတယ်။
- `status?: MutationStatus`
  - Mutation တွေကို သူတို့ရဲ့ status အလိုက် filter လုပ်ခွင့်ပြုပါတယ်။
- `predicate?: (mutation: Mutation) => boolean`
  - ဒီ predicate function ကို match ဖြစ်တဲ့ mutation တွေ အားလုံးအပေါ် နောက်ဆုံး filter အဖြစ် သုံးပါလိမ့်မယ်။ တခြား filter တွေ သတ်မှတ်မထားရင် — ဒီ function ကို cache ထဲက mutation တိုင်းအပေါ် အကဲဖြတ်ပါလိမ့်မယ်။

## Utils (အသုံးဝင်သော utilities)

### `matchQuery`

```tsx
const isMatching = matchQuery(filters, query)
```

Query တစ်ခုက ပေးထားတဲ့ query filters set နဲ့ ကိုက်ညီမှု ရှိ/မရှိ ဖော်ပြတဲ့ boolean တစ်ခုကို ပြန်ပေးပါတယ်။

### `matchMutation`

```tsx
const isMatching = matchMutation(filters, mutation)
```

Mutation တစ်ခုက ပေးထားတဲ့ mutation filters set နဲ့ ကိုက်ညီမှု ရှိ/မရှိ ဖော်ပြတဲ့ boolean တစ်ခုကို ပြန်ပေးပါတယ်။
