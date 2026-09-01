---
title: "Query Retries (query ပြန်လည်ကြိုးစားခြင်း)"
description: "query တစ်ခု မအောင်မြင်တဲ့အခါ TanStack Query က retry လုပ်ပုံ — retry option (false/true/နံပါတ်/function), retryDelay, background retry behavior"
order: 17
source: "https://tanstack.com/query/latest/docs/framework/react/guides/query-retries"
status: translated
updated: 2026-09-01
---

`useQuery` query တစ်ခု မအောင်မြင်တဲ့အခါ (query function က error ကို throw လုပ်တဲ့အခါ) — အဲဒီ query ရဲ့ request က ဆက်တိုက် retry အများဆုံး အကြိမ်ရေ (default က `3`) မရောက်သေးရင် ဒါမှမဟုတ် retry ခွင့်ပြုလား/မပြုဘူးလား ဆုံးဖြတ်ဖို့ function တစ်ခု ပေးထားရင် — TanStack Query က query ကို အလိုအလျောက် retry လုပ်ပါလိမ့်မယ်။

Retry တွေကို global level ရော individual query level မှာပါ configure လုပ်နိုင်ပါတယ်။

- `retry = false` ဆိုရင် retries တွေကို disable လုပ်ပါမယ်။
- `retry = 6` ဆိုရင် — function က throw လုပ်တဲ့ နောက်ဆုံး error ကို မပြခင် မအောင်မြင်တဲ့ request တွေကို ၆ ကြိမ် retry လုပ်ပါမယ်။
- `retry = true` ဆိုရင် — မအောင်မြင်တဲ့ request တွေကို အကန့်အသတ်မရှိ retry လုပ်ပါမယ်။
- `retry = (failureCount, error) => ...` ဆိုရင် — request ဘာကြောင့် မအောင်မြင်ခဲ့လဲဆိုတာကို အခြေခံတဲ့ custom logic ကို ရေးနိုင်ပါတယ်။ ပထမဆုံး retry ကြိုးစားမှုအတွက် `failureCount` က `0` ကနေ စတာကို သတိပြုပါ။

> ဆာဗာပေါ်မှာတော့ server rendering ကို တတ်နိုင်သမျှ မြန်မြန် ဖြစ်စေဖို့ retries တွေက default `0` ပါ။

```tsx
import { useQuery } from '@tanstack/react-query'

// Query တစ်ခုကို သတ်မှတ်ထားတဲ့ အကြိမ်ရေ အတိုင်း retry လုပ်ဖို့
const result = useQuery({
  queryKey: ['todos', 1],
  queryFn: fetchTodoListPage,
  retry: 10, // Error မပြခင် မအောင်မြင်တဲ့ request တွေကို 10 ကြိမ် retry လုပ်မယ်
})
```

> အချက်အလက်: `error` property ရဲ့ အကြောင်းအရာတွေက — နောက်ဆုံး retry ကြိုးစားမှု အထိ `useQuery` ရဲ့ `failureReason` response property ထဲမှာ ပါဝင်ပါလိမ့်မယ်။ ဒါကြောင့် အပေါ်က ဥပမာမှာ — error အကြောင်းအရာတွေက ပထမ retry ကြိုးစားမှု ၉ ခု (စုစုပေါင်း 10 ကြိမ်) အတွက် `failureReason` property ထဲမှာ ပါဝင်ပြီး — retry အားလုံး ပြီးသွားလို့ error က ဆက်ရှိနေရင် နောက်ဆုံးမှာတော့ `error` property ထဲမှာ ပါဝင်ပါလိမ့်မယ်။

## Retry Delay (retry ကြားကာလ)

Default အနေနဲ့ TanStack Query မှာ retry တွေက request မအောင်မြင်ပြီးချင်း ချက်ချင်း မဖြစ်ပါဘူး။ ပုံမှန်အတိုင်းပဲ — back-off delay တစ်ခုက retry ကြိုးစားမှု တစ်ကြိမ်ချင်းစီမှာ တဖြည်းဖြည်း သက်ရောက်ပါတယ်။

Default `retryDelay` က ကြိုးစားမှုတိုင်းမှာ နှစ်ဆ ဖြစ်သွားပြီး (`1000`ms ကနေ စတင်) — 30 စက္ကန့်ထက်တော့ မကျော်ပါဘူး:

```tsx
// Query အားလုံးအတွက် configure လုပ်မယ်
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
}
```

အကြံမပြုပေမယ့် — `retryDelay` function/integer ကို Provider ရော individual query options တွေမှာပါ override လုပ်နိုင်ပါတယ်။ Function အစား integer တစ်ခု သတ်မှတ်လိုက်ရင် — delay က retry အကြိမ်ရေ ဘယ်လောက်ပဲ ရှိရှိ အမြဲတမ်း တူညီတဲ့ အချိန်ပမာဏ ဖြစ်ပါလိမ့်မယ်:

```tsx
const result = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodoList,
  retryDelay: 1000, // Retry ဘယ်နှစ်ကြိမ် ဖြစ်ဖြစ် — 1000ms စောင့်ပြီးမှ retry လုပ်မယ်
})
```

## Background Retry Behavior (Background မှာ retry လုပ်ပုံ)

`refetchIntervalInBackground: true` နဲ့ `refetchInterval` ကို သုံးနေတဲ့အခါ — browser tab က inactive ဖြစ်နေရင် retries တွေ pause ဖြစ်ပါလိမ့်မယ်။ ဒါက — retries တွေက ပုံမှန် refetches တွေလိုပဲ focus behavior ကို လိုက်နာလို့ပါ။

Background မှာ ဆက်တိုက် retry လုပ်ဖို့ လိုတယ်ဆိုရင် — retries တွေကို disable လုပ်ပြီး custom refetch strategy တစ်ခု အကောင်အထည်ဖော်ဖို့ စဉ်းစားပါ:

```tsx
const result = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  refetchInterval: (query) => {
    // Error state မှာ ပိုမကြာခဏ refetch လုပ်မယ်
    return query.state.status === 'error' ? 5000 : 30000
  },
  refetchIntervalInBackground: true,
  retry: false, // Built-in retries တွေကို disable လုပ်မယ်
})
```

ဒီနည်းလမ်းက retry timing တွေကို manual အနေနဲ့ ထိန်းချုပ်နိုင်ပြီး — background မှာ refetches တွေ ဆက်အလုပ်လုပ်နေစေပါတယ်။
