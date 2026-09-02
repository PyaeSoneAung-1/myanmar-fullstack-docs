---
title: "Comparison (နှိုင်းယှဉ်ဇယား) — React Query vs SWR vs Apollo vs RTK Query vs React Router"
description: "React Query, SWR, Apollo Client, RTK Query နဲ့ React Router တို့ကို features/capabilities အလိုက် နှိုင်းယှဉ်ထားသော ဇယား — caching, mutations, devtools စသည့် ကဏ္ဍပေါင်းစုံ ပါဝင်ပြီး ရှင်းလင်းချက် မှတ်ချက်များနှင့်တကွ"
order: 64
source: "https://tanstack.com/query/latest/docs/framework/react/comparison"
status: translated
updated: 2026-09-02
---

> ဒီ နှိုင်းယှဉ်ဇယားက တတ်နိုင်သမျှ တိကျပြီး ဘက်မလိုက်အောင် ကြိုးစားထားပါတယ်။ ဒီ libraries တွေထဲက တစ်ခုခုကို သုံးနေပြီး အချက်အလက်တွေ ပိုကောင်းအောင် ပြင်ဆင်လို့ရမယ်လို့ ထင်ရင် — ဒီ page ရဲ့ အောက်ခြေက "Edit this page on Github" link ကနေတစ်ဆင့် (မှတ်စု ဒါမှမဟုတ် အထောက်အထားတွေနဲ့အတူ) ပြောင်းလဲမှု အကြံပြုချက်တွေ ပေးပို့နိုင်ပါတယ်။

**Feature / Capability အမှတ်အသားများ (Key):**

- ✅ 1st-class အဆင့် — built-in ဖြစ်ပြီး configuration ဒါမှမဟုတ် code ထပ်ထည့်စရာ မလိုဘဲ ချက်ချင်း သုံးလို့ရတယ်
- 🟡 ပံ့ပိုးထားတယ် — ဒါပေမယ့် unofficial 3rd party (သို့) community library/contribution အနေနဲ့
- 🔶 ပံ့ပိုးပြီး documentation ပါရှိတယ် — ဒါပေမယ့် အကောင်အထည်ဖော်ဖို့ user-code ထပ်ရေးဖို့ လိုတယ်
- 🛑 Official အနေနဲ့ ပံ့ပိုးမှု/documentation မရှိဘူး

|                                                    | React Query                              | SWR [_(Website)_][swr]                   | Apollo Client [_(Website)_][apollo]        | RTK-Query [_(Website)_][rtk-query]   | React Router [_(Website)_][react-router]                                  |
| -------------------------------------------------- | ---------------------------------------- | ---------------------------------------- | ------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------- |
| Github Repo / Stars                                | [![][stars-react-query]][gh-react-query] | [![][stars-swr]][gh-swr]                 | [![][stars-apollo]][gh-apollo]             | [![][stars-rtk-query]][gh-rtk-query] | [![][stars-react-router]][gh-react-router]                                |
| Platform Requirements                              | React                                    | React                                    | React, GraphQL                             | Redux                                | React                                                                     |
| Their Comparison                                   |                                          | (none)                                   | (none)                                     | [Comparison][rtk-query-comparison]   | (none)                                                                    |
| Supported Query Syntax                             | Promise, REST, GraphQL                   | Promise, REST, GraphQL                   | GraphQL, Any (Reactive Variables)          | Promise, REST, GraphQL               | Promise, REST, GraphQL                                                    |
| Supported Frameworks                               | React                                    | React                                    | React + Others                             | Any                                  | React                                                                     |
| Caching Strategy                                   | Hierarchical Key -> Value                | Unique Key -> Value                      | Normalized Schema                          | Unique Key -> Value                  | Nested Route -> value                                                     |
| Cache Key Strategy                                 | JSON                                     | JSON                                     | GraphQL Query                              | JSON                                 | Route Path                                                                |
| Cache Change Detection                             | Deep Compare Keys (Stable Serialization) | Deep Compare Keys (Stable Serialization) | Deep Compare Keys (Unstable Serialization) | Key Referential Equality (===)       | Route Change                                                              |
| Data Change Detection                              | Deep Comparison + Structural Sharing     | Deep Compare (via `stable-hash`)         | Deep Compare (Unstable Serialization)      | Key Referential Equality (===)       | Loader Run                                                                |
| Data Memoization                                   | Full Structural Sharing                  | Identity (===)                           | Normalized Identity                        | Identity (===)                       | Identity (===)                                                            |
| Bundle Size                                        | [![][bp-react-query]][bpl-react-query]   | [![][bp-swr]][bpl-swr]                   | [![][bp-apollo]][bpl-apollo]               | [![][bp-rtk-query]][bpl-rtk-query]   | [![][bp-react-router]][bpl-react-router] + [![][bp-history]][bpl-history] |
| API Definition Location                            | Component, External Config               | Component                                | GraphQL Schema                             | External Config                      | Route Tree Configuration                                                  |
| Queries                                            | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Cache Persistence                                  | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑 Active Routes Only ⁸                                                   |
| Devtools                                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| Polling/Intervals                                  | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| Parallel Queries                                   | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Dependent Queries                                  | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Paginated Queries                                  | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Infinite Queries                                   | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| Bi-directional Infinite Queries                    | ✅                                       | 🔶                                       | 🔶                                         | ✅                                   | 🛑                                                                        |
| Infinite Query Refetching                          | ✅                                       | ✅                                       | 🛑                                         | ✅                                   | 🛑                                                                        |
| Lagged Query Data¹                                | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Selectors                                          | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | N/A                                                                       |
| Initial Data                                       | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Scroll Recovery                                    | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Cache Manipulation                                 | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| Outdated Query Dismissal                           | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Render Batching & Optimization²                    | ✅                                       | ✅                                       | 🛑                                         | ✅                                   | ✅                                                                        |
| Auto Garbage Collection                            | ✅                                       | 🛑                                       | 🛑                                         | ✅                                   | N/A                                                                       |
| Mutation Hooks                                     | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Offline Mutation Support                           | ✅                                       | 🛑                                       | 🟡                                         | 🛑                                   | 🛑                                                                        |
| Prefetching APIs                                   | ✅                                       | ✅                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Query Cancellation                                 | ✅                                       | 🛑                                       | 🛑                                         | 🛑                                   | ✅                                                                        |
| Partial Query Matching³                           | ✅                                       | 🔶                                       | ✅                                         | ✅                                   | N/A                                                                       |
| Stale While Revalidate                             | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| Stale Time Configuration                           | ✅                                       | 🛑⁷                                      | 🛑                                         | ✅                                   | 🛑                                                                        |
| Pre-usage Query/Mutation Configuration⁴            | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Window Focus Refetching                            | ✅                                       | ✅                                       | 🛑                                         | ✅                                   | 🛑                                                                        |
| Network Status Refetching                          | ✅                                       | ✅                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| General Cache Dehydration/Rehydration              | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Offline Caching                                    | ✅                                       | 🛑                                       | ✅                                         | 🔶                                   | 🛑                                                                        |
| React Suspense                                     | ✅                                       | ✅                                       | ✅                                         | 🛑                                   | ✅                                                                        |
| Abstracted/Agnostic Core                           | ✅                                       | 🛑                                       | ✅                                         | ✅                                   | 🛑                                                                        |
| Automatic Refetch after Mutation⁵                 | 🔶                                       | 🔶                                       | ✅                                         | ✅                                   | ✅                                                                        |
| Normalized Caching⁶                               | 🛑                                       | 🛑                                       | ✅                                         | 🛑                                   | 🛑                                                                        |

### မှတ်ချက်များ (Notes)

> **¹ Lagged Query Data** — React Query က နောက် query တစ်ခု load ဖြစ်နေချိန်မှာ ရှိပြီးသား query ရဲ့ data ကို ဆက်ပြခွင့်ပြုတဲ့ နည်းလမ်းတစ်ခု ပေးပါတယ် (suspense က မကြာမီမှာ native အနေနဲ့ ပေးမယ့် UX နဲ့ ဆင်တူပါတယ်)။ Pagination UI တွေ ဒါမှမဟုတ် infinite loading UI တွေ ရေးတဲ့အခါ — query အသစ် တစ်ခု တောင်းဆိုတိုင်း hard loading state မပြချင်တဲ့အတွက် — ဒါက အလွန် အရေးကြီးပါတယ်။ အခြား libraries တွေမှာ ဒီစွမ်းရည် မရှိဘဲ — query အသစ် load ဖြစ်နေစဉ် (prefetch လုပ်ထားခြင်း မရှိရင်) hard loading state တစ်ခုကို render လုပ်ကြပါတယ်။

> **² Render Optimization** — React Query မှာ render စွမ်းဆောင်ရည် ကောင်းမွန်ပါတယ်။ Default အနေနဲ့ — ဘယ် fields တွေကို access လုပ်ထားလဲ အလိုအလျောက် track လုပ်ပြီး — အဲဒီထဲက တစ်ခုခု ပြောင်းလဲမှသာ re-render လုပ်ပါတယ်။ ဒီ optimization ကနေ ထွက်ချင်ရင် `notifyOnChangeProps` ကို `'all'` လို့ သတ်မှတ်လိုက်ရင် — query ကို update လုပ်တိုင်း (ဥပမာ data အသစ် ရလို့ ဒါမှမဟုတ် fetching ဖြစ်နေတာ ညွှန်ပြဖို့) component တွေ re-render ဖြစ်ပါလိမ့်မယ်။ React Query က updates တွေကိုလည်း batch လုပ်ပေးလို့ — component အများကြီးက query တစ်ခုတည်းကို သုံးနေရင်တောင် သင့် application က တစ်ခါပဲ re-render ဖြစ်ပါတယ်။ `data` ဒါမှမဟုတ် `error` properties တွေကိုပဲ စိတ်ဝင်စားတယ်ဆိုရင် — `notifyOnChangeProps` ကို `['data', 'error']` လို့ သတ်မှတ်ပြီး render အရေအတွက်ကို ပိုပြီးတောင် လျှော့ချနိုင်ပါတယ်။

> **³ Partial query matching** — React Query က deterministic ဖြစ်တဲ့ query key serialization ကို သုံးတာမို့ — match လုပ်ချင်တဲ့ query-key တစ်ခုချင်းစီကို မသိရဘဲ — query အုပ်စုတွေကို ကိုင်တွယ်နိုင်ပါတယ်။ ဥပမာ — variables မရွေး key ထဲမှာ `todos` နဲ့ စတင်တဲ့ query တိုင်းကို refetch လုပ်နိုင်သလို — variables (ဒါမှမဟုတ်) nested properties ပါတဲ့/မပါတဲ့ တိကျတဲ့ queries တွေကိုလည်း ပစ်မှတ်ထားနိုင်ပြီး — သင့်ရဲ့ သတ်မှတ်ချက်တွေနဲ့ ကိုက်ညီတဲ့ queries တွေကိုပဲ match လုပ်ဖို့ filter function တစ်ခုကိုတောင် သုံးနိုင်ပါတယ်။

> **⁴ Pre-usage Query Configuration** — ဒါက သုံးခြင်းမပြုမီ queries နဲ့ mutations တွေ ဘယ်လို ပြုမူမလဲဆိုတာ ကြိုတင် configure လုပ်နိုင်တာကို ဖော်ပြတဲ့ နာမည်ကြီး ဝေါဟာရတစ်ခုပါ။ ဥပမာ — query တစ်ခုကို defaults တွေနဲ့ ကြိုတင် အပြည့်အဝ configure လုပ်ထားနိုင်ပြီး — သုံးချိန်ကျရင် `useQuery({ queryKey })` လောက်ပဲ လိုတော့တယ် — fetcher ဒါမှမဟုတ် options တွေကို အသုံးပြုမှုတိုင်းမှာ ပို့စရာ မလိုတော့ပါဘူး။ SWR မှာ ဒီ feature ရဲ့ တစိတ်တပိုင်း ပုံစံ ရှိပါတယ် — default fetcher တစ်ခုကို ကြိုတင် configure လုပ်ခွင့်ရှိပေမယ့် — global fetcher အနေနဲ့ပဲ ရပြီး — query တစ်ခုချင်းစီအတွက် မဟုတ်သလို mutations တွေအတွက်လည်း လုံးဝ မဟုတ်ပါဘူး။

> **⁵ Automatic Refetch after Mutation** — Mutation တစ်ခု ဖြစ်ပွားပြီးနောက် တကယ့် automatic refetch ဖြစ်ဖို့ဆိုရင် — schema တစ်ခု (graphQL က ပေးတဲ့ ပုံစံမျိုး) နဲ့အတူ — အဲဒီ schema ထဲက entity တစ်ခုချင်းစီနဲ့ entity types တွေကို ခွဲခြားသိဖို့ library ကို ကူညီတဲ့ heuristics တွေ လိုအပ်ပါတယ်။

> **⁶ Normalized Caching** — React Query, SWR နဲ့ RTK-Query တို့က လက်ရှိမှာ automatic-normalized caching ကို မပံ့ပိုးသေးပါဘူး။ ဒါက high-level data duplication တချို့ ရှောင်ရှားဖို့ — entities တွေကို flat architecture နဲ့ သိမ်းဆည်းတဲ့ နည်းစနစ်ကို ဖော်ပြပါတယ်။

> **⁷ SWR ရဲ့ Immutable Mode** — SWR မှာ "immutable" mode တစ်ခု ပါဝင်ပြီး — query တစ်ခုကို cache ရဲ့ သက်တမ်းတစ်လျှောက် တစ်ခါပဲ fetch လုပ်စေနိုင်ပါတယ် — ဒါပေမယ့် stale-time (ဒါမှမဟုတ်) conditional auto-revalidation ဆိုတဲ့ concept တွေတော့ မရှိသေးပါဘူး။

> **⁸ React Router cache persistence** — React Router က လက်ရှိ match ဖြစ်နေတဲ့ routes တွေထက်ကို ကျော်ပြီး data ကို cache မလုပ်ပါဘူး။ Route တစ်ခုကနေ ထွက်သွားခဲ့ရင် — အဲဒီ route ရဲ့ data ဟာ ပျောက်ဆုံးသွားပါတယ်။

[bpl-react-query]: https://bundlephobia.com/result?p=@tanstack/react-query
[bp-react-query]: https://badgen.net/bundlephobia/minzip/@tanstack/react-query?label=💾
[gh-react-query]: https://github.com/TanStack/query
[stars-react-query]: https://img.shields.io/github/stars/TanStack/query?label=%F0%9F%8C%9F
[swr]: https://github.com/vercel/swr
[bp-swr]: https://badgen.net/bundlephobia/minzip/swr?label=💾
[gh-swr]: https://github.com/vercel/swr
[stars-swr]: https://img.shields.io/github/stars/vercel/swr?label=%F0%9F%8C%9F
[bpl-swr]: https://bundlephobia.com/result?p=swr
[apollo]: https://github.com/apollographql/apollo-client
[bp-apollo]: https://badgen.net/bundlephobia/minzip/@apollo/client?label=💾
[gh-apollo]: https://github.com/apollographql/apollo-client
[stars-apollo]: https://img.shields.io/github/stars/apollographql/apollo-client?label=%F0%9F%8C%9F
[bpl-apollo]: https://bundlephobia.com/result?p=@apollo/client
[rtk-query]: https://redux-toolkit.js.org/rtk-query/overview
[rtk-query-comparison]: https://redux-toolkit.js.org/rtk-query/comparison
[rtk-query-bundle-size]: https://redux-toolkit.js.org/rtk-query/comparison#bundle-size
[bp-rtk]: https://badgen.net/bundlephobia/minzip/@reduxjs/toolkit?label=💾
[bp-rtk-query]: https://badgen.net/bundlephobia/minzip/@reduxjs/toolkit?label=💾
[gh-rtk-query]: https://github.com/reduxjs/redux-toolkit
[stars-rtk-query]: https://img.shields.io/github/stars/reduxjs/redux-toolkit?label=🌟
[bpl-rtk]: https://bundlephobia.com/result?p=@reduxjs/toolkit
[bpl-rtk-query]: https://bundlephobia.com/package/@reduxjs/toolkit
[react-router]: https://github.com/remix-run/react-router
[bp-react-router]: https://badgen.net/bundlephobia/minzip/react-router-dom?label=💾
[gh-react-router]: https://github.com/remix-run/react-router
[stars-react-router]: https://img.shields.io/github/stars/remix-run/react-router?label=%F0%9F%8C%9F
[bpl-react-router]: https://bundlephobia.com/result?p=react-router-dom
[bp-history]: https://badgen.net/bundlephobia/minzip/history?label=💾
[bpl-history]: https://bundlephobia.com/result?p=history
