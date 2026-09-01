---
title: "Network Mode (ကွန်ရက် မုဒ်)"
description: "network မရှိတဲ့အခါ query/mutation တွေ ဘယ်လို ပြုမူမလဲ — online, always, offlineFirst ဆိုတဲ့ network mode သုံးမျိုး, paused state, Devtools"
order: 13
source: "https://tanstack.com/query/latest/docs/framework/react/guides/network-mode"
status: translated
updated: 2026-09-01
---

TanStack Query က network ချိတ်ဆက်မှု မရှိတဲ့အခါ [Queries](/docs/tanstack-query/queries) နဲ့ [Mutations](/docs/tanstack-query/mutations) တွေ ဘယ်လို ပြုမူသင့်လဲ ခွဲခြားဖို့ network mode သုံးမျိုး ထောက်ပံ့ပေးပါတယ်။ ဒီ mode ကို Query/Mutation တစ်ခုချင်းစီအတွက် သီးခြား သတ်မှတ်နိုင်သလို — query/mutation defaults တွေကနေတစ်ဆင့် ကမ္ဘာလုံးဆိုင်ရာ (globally) အနေနဲ့လည်း သတ်မှတ်နိုင်ပါတယ်။

TanStack Query ကို data fetching အတွက် data fetching library တွေနဲ့ တွဲပြီး အသုံးအများဆုံး ဖြစ်တာကြောင့် — default network mode က [online](#network-mode-online) ဖြစ်ပါတယ်။

## Network Mode: online

ဒီ mode မှာ Queries နဲ့ Mutations တွေက network ချိတ်ဆက်မှု မရှိရင် fire (လုပ်ဆောင်) မှာ မဟုတ်ပါဘူး။ ဒါက default mode ပါ။ Query တစ်ခုအတွက် fetch စတင်ခဲ့ပြီး network မရှိလို့ fetch မလုပ်နိုင်ဘူးဆိုရင် — query က သူရှိနေတဲ့ `state` (`pending`, `error`, `success`) အတိုင်း အမြဲ ရပ်နေပါတယ်။ ဒါပေမယ့် [fetchStatus](/docs/tanstack-query/queries#fetchstatus) ကို အပိုအနေနဲ့ ထုတ်ပြပါတယ်။ အဲဒါက ဒီလိုတွေ ဖြစ်နိုင်ပါတယ်:

- `fetching`: `queryFn` က တကယ် execute ဖြစ်နေတယ် — request တစ်ခု in-flight (သွားနေဆဲ) ဖြစ်တယ်။
- `paused`: Query က execute မဖြစ်ဘူး — network ပြန်ရတဲ့အထိ `paused` (ရပ်ထားခံရ) ဖြစ်နေတယ်
- `idle`: Query က fetch မလုပ်နေဘူး၊ paused လည်း မဟုတ်ဘူး

`isFetching` နဲ့ `isPaused` ဆိုတဲ့ flags တွေက ဒီ state ကနေ ဆင်းသက်လာပြီး အဆင်ပြေအောင် ထုတ်ပေးထားပါတယ်။

> မှတ်ထားပါ — loading spinner ပြဖို့ `pending` state ကို စစ်ရုံနဲ့ မလုံလောက်နိုင်ပါဘူး။ Query တွေက ပထမဆုံးအကြိမ် mount လုပ်နေပြီး network မရှိရင် `state: 'pending'` ဖြစ်နေပေမယ့် `fetchStatus: 'paused'` ဖြစ်နေနိုင်လို့ပါ။

Query တစ်ခု online ဖြစ်လို့ run နေတာဖြစ်ပေမယ့် fetch ဖြစ်နေတုန်း offline ပြုတ်သွားရင် — TanStack Query က retry mechanism ကိုလည်း pause လုပ်ပါလိမ့်မယ်။ Paused ဖြစ်နေတဲ့ query တွေက network ပြန်ရတာနဲ့ ဆက်လုပ်ပါလိမ့်မယ်။ ဒါက `refetchOnReconnect` (ဒီ mode မှာလည်း default `true`) နဲ့ မသက်ဆိုင်ပါဘူး — ဘာကြောင့်လဲဆိုတော့ ဒါက `refetch` မဟုတ်ဘဲ `continue` (ဆက်လုပ်ခြင်း) ဖြစ်လို့ပါ။ အဲဒီကြားမှာ query ကို [cancelled](/docs/tanstack-query/query-cancellation) လုပ်လိုက်ရင်တော့ ဆက်လုပ်မှာ မဟုတ်ပါဘူး။

## Network Mode: always

ဒီ mode မှာ TanStack Query က online/offline state ကို လျစ်လျူရှုပြီး အမြဲတမ်း fetch လုပ်ပါတယ်။ သင့် Queries တွေ အလုပ်လုပ်ဖို့ active network connection မလိုတဲ့ environment မှာ TanStack Query ကို သုံးနေရင် ဒီ mode ကို ရွေးချယ်ဖို့ ဖြစ်နိုင်ခြေ များပါတယ် — ဥပမာ `AsyncStorage` ကနေ ဖတ်ရုံပဲ ဆိုရင်၊ ဒါမှမဟုတ် သင့် `queryFn` ကနေ `Promise.resolve(5)` ကို ပြန်ပေးရုံပဲ ဆိုရင်မျိုးမှာပါ။

- Queries တွေက network မရှိလို့ ဘယ်တော့မှ `paused` ဖြစ်မှာ မဟုတ်ပါဘူး။
- Retries တွေကလည်း pause မဖြစ်ပါဘူး — Query က မအောင်မြင်ရင် `error` state ကို သွားပါမယ်။
- `refetchOnReconnect` က ဒီ mode မှာ default `false` ဖြစ်ပါတယ် — ဘာကြောင့်လဲဆိုတော့ network ပြန်ချိတ်မိတာက stale ဖြစ်နေတဲ့ query တွေကို refetch လုပ်သင့်တဲ့ အချက်ပြမှုကောင်း (indicator) မဟုတ်တော့လို့ပါ။ လိုချင်ရင်တော့ ပြန်ဖွင့်လို့ ရပါတယ်။

## Network Mode: offlineFirst

ဒီ mode က ပထမနှစ်ခုရဲ့ အလယ်အလတ်ပါ — TanStack Query က `queryFn` ကို တစ်ခါ run ပြီးတော့ retries တွေကို pause လုပ်ပါတယ်။ ဒါက [offline-first PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers) တွေလို request တစ်ခုကို caching အတွက် intercept လုပ်တဲ့ serviceWorker ရှိတဲ့အခါ၊ ဒါမှမဟုတ် [Cache-Control header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#the_cache-control_header) ကနေတစ်ဆင့် HTTP caching သုံးနေတဲ့အခါမျိုးမှာ အလွန်အသုံးဝင်ပါတယ်။

အဲဒီလို အခြေအနေတွေမှာ ပထမ fetch က offline storage/cache ကနေ လာတာမို့ အောင်မြင်သွားနိုင်ပါတယ်။ ဒါပေမယ့် cache miss ဖြစ်ရင်တော့ network request က ထွက်သွားပြီး မအောင်မြင်ဘဲ ဖြစ်သွားပါမယ် — အဲဒီအခါ ဒီ mode က retries တွေကို pause လုပ်တဲ့ `online` query တစ်ခုလို ပြုမူပါတယ်။

## Devtools

[TanStack Query Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools) မှာ Queries တွေက fetch လုပ်ချင်ပေမယ့် network မရှိရင် `paused` state နဲ့ ပြသပါမယ်။ _Mock offline behavior_ ဆိုတဲ့ toggle button လည်း ရှိပါတယ်။ သတိပြုပါ — ဒီ button က သင့် network connection ကို တကယ်တော့ မထိခိုက်စေပါဘူး (ဒါကို browser devtools မှာ လုပ်နိုင်ပါတယ်)၊ ဒါပေမယ့် [OnlineManager](https://tanstack.com/query/latest/docs/reference/onlineManager) ကို offline state မှာ ထားပေးပါတယ်။

## Signature (ရေးသားပုံ)

- `networkMode: 'online' | 'always' | 'offlineFirst'`
  - optional
  - default က `'online'`
