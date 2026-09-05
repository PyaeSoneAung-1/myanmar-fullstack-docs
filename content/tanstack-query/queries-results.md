---
title: "QueriesResults (useQueries ၏ result type)"
description: "`combine` မပါဘဲ သုံးသည့် `useQueries` ၏ result type — element တစ်ခုချင်းစီ၏ result type ကို element ၂၀ အထိ တစ်ခုချင်း infer လုပ်သည်"
order: 92
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/QueriesResults"
status: translated
updated: 2026-09-05
---

`combine` မပံ့ပိုးထားတဲ့အခါ [`useQueries`](/docs/tanstack-query/use-queries) က ပြန်ပေးတဲ့ result type ဖြစ်ပါတယ်။ [`QueriesOptions`](/docs/tanstack-query/queries-options) ကို မှန်မှန် (mirror) လုပ်ထားတာပါ — tuple element တစ်ခုချင်းစီရဲ့ result type ကို element ၂၀ အထိ တစ်ခုချင်းစီ infer လုပ်ပါတယ်။ Non-tuple array ဆိုရင်တော့ element အလိုက် map လုပ်ပြီး entry တစ်ခုချင်းစီကို တစ်ခုချင်းစီ infer လုပ်ဆဲပါ — element ၂၀ ကျော်မှသာ result type တစ်မျိုးတည်း (homogeneous) [`UseQueryResult`](/docs/tanstack-query/use-query-result) ဆီ ပြန်ကျသွားပါတယ်။

```ts
type QueriesResults<T, TResults, TDepth> = TDepth["length"] extends MAXIMUM_DEPTH ? UseQueryResult[] : T extends [] ? [] : T extends [infer Head] ? [...TResults, GetUseQueryResult<Head>] : T extends [infer Head, ...(infer Tails)] ? QueriesResults<[...Tails], [...TResults, GetUseQueryResult<Head>], [...TDepth, 1]> : { [K in keyof T]: GetUseQueryResult<T[K]> };
```

## Type Parameters

### T

`T` *extends* `any`[]

`queries` array ရဲ့ type — [`QueriesOptions`](/docs/tanstack-query/queries-options) က infer လုပ်ပေးလိုက်တဲ့ ပုံစံပါ။

### TResults

`TResults` *extends* `any`[] = \[\]

Recursion လုပ်ဆောင်နေစဉ်အတွင်း ဒီ type က တည်ဆောက်သွားတဲ့ internal accumulator ဖြစ်ပါတယ်။ ဒါကို ကိုယ်တိုင် explicitly သတ်မှတ်ဖို့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။

### TDepth

`TDepth` *extends* `ReadonlyArray`\<`number`\> = \[\]

Element ၂၀ ကန့်သတ်ချက်နဲ့ ယှဉ်စစ်ဆေးတဲ့ internal recursion-depth counter ဖြစ်ပါတယ်။ ဒါကို ကိုယ်တိုင် explicitly သတ်မှတ်ဖို့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။
