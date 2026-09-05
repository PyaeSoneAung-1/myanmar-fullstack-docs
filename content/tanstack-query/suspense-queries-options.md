---
title: "SuspenseQueriesOptions (useSuspenseQueries ၏ queries array type)"
description: "useSuspenseQueries က လက်ခံတဲ့ queries array ရဲ့ type — tuple element တစ်ခုချင်းစီကို recursion နဲ့ ဖြန့်ထုတ်ပြီး queryFn/select တွေကို တစ်ခုချင်း infer လုပ်ပေးခြင်း"
order: 98
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/SuspenseQueriesOptions"
status: translated
updated: 2026-09-05
---

```ts
type SuspenseQueriesOptions<T, TResults, TDepth> = TDepth["length"] extends MAXIMUM_DEPTH ? UseSuspenseQueryOptions[] : T extends [] ? [] : T extends [infer Head] ? [...TResults, GetUseSuspenseQueryOptions<Head>] : T extends [infer Head, ...(infer Tails)] ? SuspenseQueriesOptions<[...Tails], [...TResults, GetUseSuspenseQueryOptions<Head>], [...TDepth, 1]> : unknown[] extends T ? T : T extends UseSuspenseQueryOptions<infer TQueryFnData, infer TError, infer TData, infer TQueryKey>[] ? UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>[] : UseSuspenseQueryOptions[];
```

`useSuspenseQueries` က လက်ခံတဲ့ `queries` array ရဲ့ type ဖြစ်ပါတယ်။ Tuple element တစ်ခုချင်းစီကို recursion နဲ့ ဖြန့်ထုတ်ပြီး — entry တစ်ခုစီရဲ့ `queryFn`/`select` တွေကို element ၂၀ အထိ တစ်ခုချင်းသပ်သပ် type inference လုပ်လို့ရအောင် လုပ်ပေးပါတယ်။ Opaque array (ဥပမာ `unknown[]`) ဆိုရင်တော့ မူလအတိုင်း ပြန်ပေးပြီး — element type သိနိုင်တဲ့ non-tuple array ဒါမှမဟုတ် element ၂၀ ကျော်သွားတဲ့ tuple ဆိုရင်တော့ တစ်မျိုးတည်း တူညီနေတဲ့ (homogeneous) [UseSuspenseQueryOptions](/docs/tanstack-query/use-suspense-query-options) type တစ်ခုတည်းဆီကို ပြန်ကျသွားပါတယ်။

## Type Parameters

### T

`T` *extends* `any`[]

Call site မှာ ရေးသားထားတဲ့ `queries` array ရဲ့ type ဖြစ်ပါတယ်။

### TResults

`TResults` *extends* `any`[] = \[\]

Recursion လုပ်နေစဉ်အတွင်း ဒီ type က တည်ဆောက်သွားတဲ့ internal accumulator ဖြစ်ပြီး — ကိုယ်တိုင် သတ်မှတ်ဖို့ မရည်ရွယ်ပါဘူး။

### TDepth

`TDepth` *extends* `ReadonlyArray`\<`number`\> = \[\]

Element ၂၀ ကန့်သတ်ချက်နဲ့ ယှဉ်စစ်တဲ့ internal recursion-depth counter ဖြစ်ပြီး — ကိုယ်တိုင် သတ်မှတ်ဖို့ မရည်ရွယ်ပါဘူး။
