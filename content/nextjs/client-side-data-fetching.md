---
title: "Client-side Data Fetching (client ဘက်မှ data ယူခြင်း)"
description: "Client Components တွေထဲမှာ data-fetching library (SWR, TanStack Query, Apollo Client) နဲ့ data ယူနည်း; Server Component ကနေ initial data ထောက်ပံ့ခြင်း, fetching pattern ရွေးချယ်ခြင်း, cache layers များနှင့် mutations ညှိနှိုင်းခြင်း"
order: 120
source: "https://nextjs.org/docs/app/guides/client-side-data-fetching"
status: translated
updated: 2026-09-02
---

App အများအပြားက client data-fetching library တစ်ခု မလိုပဲလည်း responsive (ချက်ချင်း တုံ့ပြန်တဲ့) interactions တွေ ပေးနိုင်ပါတယ်။ Client Component တစ်ခုက server data ကို တစ်ခါပဲ ဖတ်ဖို့ လိုတယ်ဆိုရင် — [Promise တစ်ခုကို ပို့ပြီး React ရဲ့ `use()` နဲ့ ဖြေဖို့](https://nextjs.org/docs/app/getting-started/fetching-data#streaming-data-with-the-use-api) လုံလောက်ပါတယ်။

ဒါက client ဘက်မှာ ဘယ်တော့မှ revalidate မလုပ်တဲ့ data အတွက် library တစ်ခု ထပ်ထည့်စရာ မလိုအောင် ရှောင်ရှားပေးပါတယ်။ Server Functions, transitions, optimistic UI နဲ့ pending feedback တွေ သုံးတဲ့ patterns တွေအတွက် [Building interactive apps](https://nextjs.org/docs/app/guides/interactive-apps) ကို ကြည့်ပါ။

Client Components တွေမှာ shared browser cache တစ်ခု လိုအပ်ရင် — [SWR](https://swr.vercel.app), [TanStack Query](https://tanstack.com/query) (သို့) [Apollo Client](https://www.apollographql.com/docs/react) လို client data-fetching library တစ်ခုကို သုံးပါ။ ဒီ libraries တွေက focus revalidation, interval polling, request deduplication (ထပ်နေတဲ့ requests တွေ ဖယ်ရှားခြင်း) (သို့) components တွေအနှံ့ optimistic updates တွေကို ထည့်ပေးနိုင်ပါတယ်။

## Client fetching pattern တစ်ခု ရွေးချယ်ခြင်း

ပထမဆုံး — ကနဦး view က server ကနေ data လိုအပ်လား၊ ဒါမှမဟုတ် hydration ပြီးနောက် browser request တစ်ခုကို စောင့်နိုင်လား ဆုံးဖြတ်ပါ။ Client data-fetching libraries တွေက ပုံမှန် patterns သုံးမျိုးကို ထောက်ပံ့ပါတယ်:

| Pattern                             | SWR                            | TanStack Query        | Data ရနိုင်ချိန်                            |
| ----------------------------------- | ------------------------------ | --------------------- | ------------------------------------------ |
| Inline loading states               | `useSWR`                       | `useQuery`            | hydration ပြီးနောက် browser request        |
| Suspense loading states             | `useSWR` with `suspense: true` | `useSuspenseQuery`    | hydration ပြီးနောက် browser request        |
| Provided by the server              | `<SWRConfig fallback>`         | `<HydrationBoundary>` | Server ကနေ initial render (သို့) stream   |

Component တစ်ခုချင်းစီက ကိုယ်ပိုင် loading UI render လုပ်စေချင်ရင် — inline loading states တွေကို သုံးပါ။ [Suspense](https://nextjs.org/docs/app/getting-started/fetching-data#streaming) ကို သုံးပြီး — boundary တစ်ခုမှာ loading UI သတ်မှတ်ကာ interface ရဲ့ ဘယ်အပိုင်းတွေ တစ်ပြိုင်နက် (သို့) တစ်ဆင့်ချင်း ပေါ်လာမလဲ ညှိနှိုင်းနိုင်ပါတယ်။ Client-only fetching အတွက် — ကိုယ်လိုချင်တဲ့ loading အတွေ့အကြုံနဲ့ ကိုက်ညီတဲ့ pattern ကို ရွေးပါ။ Suspense က rendering ကို ညှိနှိုင်းပေးပြီး — requests တွေ ဘယ်အချိန် စတင်မလဲဆိုတာက data library နဲ့ component structure ပေါ်မှာ မူတည်ပါတယ်။

Autocomplete လို browser-driven interactions တွေအတွက်တော့ — client-only pattern နှစ်မျိုးလုံးထဲက ဘယ်ဟာကိုမဆို သုံးနိုင်ပါတယ်။ ကနဦး result က hydration နဲ့ browser request တစ်ခုကို စောင့်ပါတယ် — interaction တစ်ခုအထိ မလိုအပ်သေးတဲ့ data တွေအတွက်တော့ ဒါက မကြာခဏ မှန်ကန်တဲ့ အပေးအယူတစ်ခုပါ။

Server က ကနဦး render အတွက် ဘာတွေ လိုအပ်လဲ သိနေရင် — [Server Component](/docs/nextjs/server-client-components) တစ်ခုကနေ initial data ကို ပေးပါ။ ဒီတန်ဖိုးကို initial render ထဲမှာ ထည့်နိုင်သလို — Suspense ကနေ stream လုပ်ပြီးလည်း ပို့နိုင်ပါတယ်။ Library က ဒါကို React Server Component payload ထဲမှာ လက်ခံရရှိပြီး — browser ထဲမှာ ဆက်ပြီး စီမံခန့်ခွဲနိုင်ပါတယ်။

## Server data များကို Cache Components နဲ့ cache လုပ်ခြင်း (optional)

Initial data ပေးတာနဲ့ server ပေါ်မှာ cache လုပ်တာက သီးခြား ရွေးချယ်စရာ နှစ်ခုပါ။ Server read (သို့) rendered view ကို ပြန်သုံးသင့်တယ်ဆိုရင် — Cache Components တွေ ထည့်ပါ။ နှစ်ခုလုံး ဖွင့်ထားရင် — ဆက်စပ်နေတဲ့ data တွေကို cache layers သုံးခုက သိမ်းထားနိုင်ပါတယ်:

| Layer                             | သိမ်းဆည်းတဲ့အရာ                                                  | Freshness ထိန်းချုပ်မှု                                                       |
| --------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Next.js server cache              | Cached data နဲ့ Server Component output                          | [`cacheLife`](/docs/nextjs/cache-life) `revalidate` နဲ့ `expire`               |
| Next.js client cache              | လည်ပတ်ပြီး prefetch လုပ်ထားတဲ့ routes တွေအတွက် React Server Component payloads | [`cacheLife`](/docs/nextjs/cache-life) `stale`                                  |
| Client data-fetching library      | SWR key (သို့) TanStack query key အောက်မှာ သိမ်းထားတဲ့ browser data | Library ရဲ့ revalidation options နဲ့ mutations                                |

Next.js [prefetching](https://nextjs.org/docs/app/guides/prefetching) က navigation မတိုင်ခင် route တစ်ခုရဲ့ React Server Component payload ကို client cache ထဲ ထည့်နိုင်ပါတယ်။

Cache layers တွေက သီးခြား freshness policies တွေ ထားရှိပြီး — durations တွေ တိုက်ဆိုင်နေဖို့ မလိုပါဘူး။ Cache identities (cache အမှတ်သညာများ) နဲ့ mutation invalidation တွေကတော့ layers တွေအနှံ့ ညှိနှိုင်းထားရပါမယ်။

## Mutations များကို ညှိနှိုင်းခြင်း

Server Components, data-fetching libraries နဲ့ mutations တွေက data flow ရဲ့ မတူညီတဲ့ အစိတ်အပိုင်းတွေကို စီမံပါတယ်:

- **Server Components** တွေက initial data ကို — သက်ဆိုင်ရာ segment နဲ့ ချုပ်နှောင်ထားတဲ့ အတိုင်းအတာအထိ — ပေးပါတယ်။
- **Data-fetching library** က browser value ကို shared cache identity တစ်ခုအောက်မှာ သိမ်းပါတယ်။
- **Mutations** တွေက browser cache ကို ချက်ချင်း update လုပ်နိုင်ပြီး — cached server data တွေကို invalidate လုပ်နိုင်တာမို့ နောက် render က fresh value ကို ဖတ်နိုင်ပါတယ်။

Optimistic update တစ်ခုက write မအောင်မြင်ရင် အရင် browser value ကို ပြန်ထားသင့်ပါတယ်။ Server read ကို cache မလုပ်ထားဘူးဆိုရင် — invalidate လုပ်ဖို့ server tag လည်း မရှိပါဘူး။

Mutation တစ်ခု ပြီးနောက် — initial data ကို ပေးခဲ့တဲ့ cached server read တွေကို invalidate လုပ်ပါ:

| Method                                                                                 | ဘယ်အခါ သုံးမလဲ                                                               | နောက် server read                     |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------- |
| [`updateTag(tag)`](https://nextjs.org/docs/app/api-reference/functions/updateTag)      | Server Action တစ်ခုက သူ့ရဲ့ update ကို ချက်ချင်း မြင်သာအောင် လုပ်ရမယ်ဆိုရင် | Fresh data ကို စောင့်ပါတယ်            |
| [`revalidateTag(tag, 'max')`](/docs/nextjs/revalidate-tag)                             | Update က passive ဖြစ်ဖြစ်၊ stale data က လက်ခံနိုင်ဖွယ် ရှိရင်                | Revalidate လုပ်နေတုန်း stale data ကို serve လုပ်ပါတယ် |
| [`revalidateTag(tag, { expire: 0 })`](/docs/nextjs/revalidate-tag)                     | Webhook (သို့) external system တစ်ခုက ချက်ချင်း expiration လိုအပ်ရင်         | Fresh data ကို စောင့်ပါတယ်            |

## ဒီ patterns များကို SWR (သို့) TanStack Query နဲ့ အသုံးပြုခြင်း

- [Client-side data fetching with SWR](https://nextjs.org/docs/app/guides/client-side-data-fetching/swr)
- [Client-side data fetching with TanStack Query](https://nextjs.org/docs/app/guides/client-side-data-fetching/tanstack-query)

Patterns နှစ်ခုလုံးကို live [`next-spa-patterns` demo](https://next-spa-patterns.labs.vercel.dev) နဲ့ သူ့ရဲ့ [source code](https://github.com/vercel-labs/next-spa-patterns) မှာ ကြည့်နိုင်ပါတယ်။
