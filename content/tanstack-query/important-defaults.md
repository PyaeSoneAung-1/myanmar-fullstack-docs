---
title: "အရေးကြီးသော Default များ (Important Defaults)"
description: "TanStack Query ရဲ့ default configuration တွေ — stale data သတ်မှတ်ချက်, staleTime, refetch အချိန်များ, gcTime, retry, structural sharing"
order: 14
source: "https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults"
status: translated
updated: 2026-09-01
---

TanStack Query က box ထဲက ထုတ်ပြီး သုံးလိုက်တာနဲ့ — **ပြင်းထန်ပေမယ့် သင့်တင့်တဲ့** defaults တွေနဲ့ configure လုပ်ပြီးသား ဖြစ်ပါတယ်။ **ဒီ defaults တွေက user အသစ်တွေကို မမျှော်လင့်ဘဲ ကြောက်လန့်စေနိုင်သလို — user က သူတို့ကို မသိဘူးဆိုရင် learning/debugging လုပ်တာ ခက်ခဲစေနိုင်ပါတယ်။** TanStack Query ကို ဆက်လေ့လာပြီး သုံးနေတုန်း ဒီအချက်တွေကို သတိထားပါ:

- `useQuery` ဒါမှမဟုတ် `useInfiniteQuery` ကနေ ဖန်တီးတဲ့ Query instance တွေက default အနေနဲ့ **cached data ကို stale လို့ သတ်မှတ်ပါတယ်**။

> ဒီအပြုအမူကို ပြောင်းချင်ရင် — `staleTime` option သုံးပြီး query တွေကို globally ရော per-query ပါ configure လုပ်နိုင်ပါတယ်။ `staleTime` ကို ပိုကြာအောင် သတ်မှတ်လေလေ — query တွေက သူတို့ရဲ့ data ကို မကြာခဏ refetch လုပ်လေလေ နည်းလေလေပါ။

- `staleTime` သတ်မှတ်ထားတဲ့ Query က အဲဒီ `staleTime` ကုန်ဆုံးချိန်အထိ **fresh** (အသစ်) လို့ သတ်မှတ်ပါတယ်။
  - `staleTime` ကို ဥပမာ `2 * 60 * 1000` လို သတ်မှတ်ထားရင် — refetch ဘယ်မျိုးမှ မဖြစ်စေဘဲ 2 မိနစ်ကြာ cache ကနေ data ကို ဖတ်ပါတယ်၊ ဒါမှမဟုတ် Query ကို [manually invalidate](/docs/tanstack-query/query-invalidation) လုပ်တဲ့အထိပါ။
  - `staleTime` ကို `Infinity` လို သတ်မှတ်ထားရင် — Query ကို [manually invalidate](/docs/tanstack-query/query-invalidation) မလုပ်မချင်း refetch ဘယ်တော့မှ မဖြစ်စေပါဘူး။
  - `staleTime` ကို `'static'` လို သတ်မှတ်ထားရင် — Query ကို [manually invalidate](/docs/tanstack-query/query-invalidation) လုပ်ရင်တောင် refetch ကို **ဘယ်တော့မှ** မဖြစ်စေပါဘူး။

> `'static'` ရော `Infinity` ရော နှစ်ခုလုံးက staleness-based refetch တွေကို တားဆီးပေမယ့် — `'static'` က ပိုတင်းကြပ်ပါတယ်: `queryClient.invalidateQueries()` က `staleTime: Infinity` ရှိတဲ့ query ကို invalidate လုပ်နိုင်ပေမယ့် `staleTime: 'static'` ကိုတော့ ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။ `refetchOnMount`, `refetchOnWindowFocus`, `refetchOnReconnect` တွေကို `"always"` လို သတ်မှတ်ထားရင်လည်း `'static'` က ပိတ်ပင်ပါတယ်။ App run နေချိန်မှာ မပြောင်းနိုင်တဲ့ data တွေအတွက် `'static'` ကို သုံးပါ: boot လုပ်ချိန်မှာ fetch လုပ်တဲ့ feature flags တွေ, login လုပ်ချိန်မှာ load လုပ်တဲ့ user permissions တွေ, static reference tables တွေပါ။ Manual invalidation အလုပ်လုပ်စေချင်သေးရင် `Infinity` ကို သုံးပါ။

- Stale query တွေက ဒီအချိန်တွေမှာ background မှာ အလိုအလျောက် refetch လုပ်ပါတယ်:
  - Query ရဲ့ instance အသစ်တွေ mount လုပ်တဲ့အခါ
  - Window ကို refocus လုပ်တဲ့အခါ
  - Network ကို reconnect လုပ်တဲ့အခါ

> `staleTime` သတ်မှတ်တာက refetch တွေ အလွန်အကျွံ မဖြစ်အောင် ရှောင်ဖို့ အကြံပြုထားတဲ့ နည်းလမ်းပါ — ဒါပေမယ့် `refetchOnMount`, `refetchOnWindowFocus`, `refetchOnReconnect` စတဲ့ options တွေကို သတ်မှတ်ပြီး refetch ဖြစ်တဲ့ အချိန်တွေကိုလည်း စိတ်ကြိုက်ပြင်နိုင်ပါတယ်။

- Queries တွေကို `refetchInterval` နဲ့ configure လုပ်ပြီး — `staleTime` သတ်မှတ်ချက်နဲ့ မသက်ဆိုင်ဘဲ အခါအားလျော်စွာ refetch ဖြစ်အောင် လုပ်နိုင်ပါတယ်။ အသေးစိတ်ကို [Polling](/docs/tanstack-query/polling) မှာ ကြည့်ပါ။

- `useQuery`, `useInfiniteQuery` ဒါမှမဟုတ် query observers တွေရဲ့ active instance တွေ မရှိတော့တဲ့ Query results တွေကို "inactive" လို့ သတ်မှတ်ပြီး — နောက်ပိုင်းမှာ ပြန်သုံးကောင်းသုံးရလို့ cache ထဲမှာ ဆက်ထားပါတယ်။
- Default အနေနဲ့ "inactive" query တွေက **5 မိနစ်** ကြာပြီးမှ garbage collected (မှတ်ဉာဏ်ကနေ ဖျက်ပစ်) ခံရပါတယ်။

  > ဒါကို ပြောင်းချင်ရင် — query တွေအတွက် default `gcTime` ကို `1000 * 60 * 5` milliseconds ကနေ တစ်ခြားတန်ဖိုးတစ်ခုခုကို ပြောင်းနိုင်ပါတယ်။

- မအောင်မြင်တဲ့ Queries တွေက error ကို ဖမ်းယူပြီး UI မှာ မပြခင် — **exponential backoff delay နဲ့အတူ အသံတိတ် 3 ကြိမ် ပြန်ကြိုးစားပါတယ်**။

  > ဒါကို ပြောင်းချင်ရင် — query တွေအတွက် default `retry` နဲ့ `retryDelay` options တွေကို `3` နဲ့ default exponential backoff function ကနေ တစ်ခြားတန်ဖိုးတွေကို ပြောင်းနိုင်ပါတယ်။

- Query results တွေက default အနေနဲ့ **data တကယ် ပြောင်းလဲခဲ့လားဆိုတာ သိဖို့ structurally shared (ဖွဲ့စည်းပုံအရ မျှဝေ)** လုပ်ပြီး — မပြောင်းရင် **data reference က မပြောင်းဘဲ ရှိနေပါတယ်**။ ဒါက useMemo နဲ့ useCallback တို့နဲ့ ပတ်သက်တဲ့ value stabilization ကို ပိုကောင်းအောင် ကူညီပေးပါတယ်။ ဒီ concept က ထူးဆန်းနေတယ်လို့ ထင်ရင်တော့ စိတ်ပူစရာ မလိုပါဘူး! 99.9% အချိန်တွေမှာ ဒါကို disable လုပ်ဖို့ မလိုပါဘူး — ဒါက သင့် app ကို ကုန်ကျစရိတ် သုညနဲ့ ပိုပြီး performant ဖြစ်စေပါတယ်။

> Structural sharing က JSON-compatible values တွေနဲ့သာ အလုပ်လုပ်ပြီး — တစ်ခြား value type တွေက အမြဲတမ်း "ပြောင်းလဲသွားတယ်" လို့ သတ်မှတ်ခံရပါတယ်။ ဥပမာ response တွေ ကြီးနေလို့ performance ပြဿနာ တွေ့နေရရင် `config.structuralSharing` flag နဲ့ ဒီ feature ကို disable လုပ်နိုင်ပါတယ်။ Query responses တွေမှာ non-JSON compatible values တွေ ကိုင်တွယ်နေရပြီး data ပြောင်းမပြောင်း သိချင်သေးရင် — `config.structuralSharing` အနေနဲ့ ကိုယ်ပိုင် custom function တစ်ခု ပေးပြီး old/new responses နှစ်ခုလုံးကနေ တန်ဖိုးတစ်ခု တွက်ထုတ်ကာ references တွေကို လိုအပ်သလို ထိန်းသိမ်းနိုင်ပါတယ်။

## ဆက်လက်ဖတ်ရှုရန်

Defaults တွေအကြောင်း ပိုပြီး ရှင်းပြထားတဲ့ [Community Resources](https://tanstack.com/query/latest/docs/framework/react/community-resources) ကနေ အောက်ပါ ဆောင်းပါးတွေကို ကြည့်ပါ:

- [Practical React Query](https://tkdodo.eu/blog/practical-react-query)
- [React Query as a State Manager](https://tkdodo.eu/blog/react-query-as-a-state-manager)
- [Thinking in React Query](https://tkdodo.eu/blog/thinking-in-react-query)
