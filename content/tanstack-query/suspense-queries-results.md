---
title: "SuspenseQueriesResults (useSuspenseQueries ၏ result type)"
description: "combine မပေးထားတဲ့အခါ useSuspenseQueries က ပြန်ပေးတဲ့ result type — queries array ထဲက entry တစ်ခုစီရဲ့ result type ကို တစ်ခုချင်းသပ်သပ် infer လုပ်ပေးခြင်း"
order: 99
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/SuspenseQueriesResults"
status: translated
updated: 2026-09-05
---

```ts
type SuspenseQueriesResults<T, TResults, TDepth> = TDepth["length"] extends MAXIMUM_DEPTH ? UseSuspenseQueryResult[] : T extends [] ? [] : T extends [infer Head] ? [...TResults, GetUseSuspenseQueryResult<Head>] : T extends [infer Head, ...(infer Tails)] ? SuspenseQueriesResults<[...Tails], [...TResults, GetUseSuspenseQueryResult<Head>], [...TDepth, 1]> : { [K in keyof T]: GetUseSuspenseQueryResult<T[K]> };
```

`combine` မပေးထားတဲ့အခါ `useSuspenseQueries` က ပြန်ပေးတဲ့ result type ဖြစ်ပါတယ်။ [SuspenseQueriesOptions](/docs/tanstack-query/suspense-queries-options) နဲ့ အလားတူ ဖွဲ့စည်းထားပြီး — tuple element တစ်ခုချင်းစီရဲ့ result type ကို element ၂၀ အထိ တစ်ခုချင်းသပ်သပ် infer လုပ်ပါတယ်။ Non-tuple array ဆိုရင်တော့ element အလိုက် map လုပ်ပြီး entry တစ်ခုစီကို သပ်သပ် infer နေဆဲပါ; element ၂၀ ကျော်သွားမှသာ တစ်မျိုးတည်း တူညီနေတဲ့ [UseSuspenseQueryResult](/docs/tanstack-query/use-suspense-query-result) type တစ်ခုတည်းဆီကို ပြန်ကျပါတယ်။

## Type Parameters

### T

`T` *extends* `any`[]

[SuspenseQueriesOptions](/docs/tanstack-query/suspense-queries-options) က infer လုပ်ပေးတဲ့ အတိုင်း `queries` array ရဲ့ type ဖြစ်ပါတယ်။

### TResults

`TResults` *extends* `any`[] = \[\]

Recursion လုပ်နေစဉ်အတွင်း ဒီ type က တည်ဆောက်သွားတဲ့ internal accumulator ဖြစ်ပြီး — ကိုယ်တိုင် သတ်မှတ်ဖို့ မရည်ရွယ်ပါဘူး။

### TDepth

`TDepth` *extends* `ReadonlyArray`\<`number`\> = \[\]

Element ၂၀ ကန့်သတ်ချက်နဲ့ ယှဉ်စစ်တဲ့ internal recursion-depth counter ဖြစ်ပြီး — ကိုယ်တိုင် သတ်မှတ်ဖို့ မရည်ရွယ်ပါဘူး။
