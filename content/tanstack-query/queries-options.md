---
title: "QueriesOptions (useQueries ၏ queries array type)"
description: "`useQueries` က လက်ခံသည့် `queries` array ၏ type — tuple element တစ်ခုချင်းစီ၏ options type ကို element ၂၀ အထိ တစ်ခုချင်း infer လုပ်ရန် recursion သုံးသည်"
order: 91
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/QueriesOptions"
status: translated
updated: 2026-09-05
---

`useQueries` hook က လက်ခံတဲ့ `queries` array ရဲ့ type ဖြစ်ပါတယ်။ ဒီ type က tuple element တစ်ခုချင်းစီကို recursion နဲ့ ဖြေဖျောက် (unwrap) လုပ်ပြီး — element ၂၀ အထိ entry တစ်ခုချင်းစီရဲ့ `queryFn`/`select`/`throwOnError` တွေကို တစ်ခုချင်းစီ infer လုပ်ပေးပါတယ်။ Opaque array (ဖွဲ့စည်းပုံ မသိတဲ့ array — ဥပမာ `unknown[]`) ဆိုရင် မူလအတိုင်း ပြန်ပေးပြီး — element type သိထားတဲ့ non-tuple array ဒါမှမဟုတ် element ၂၀ ကျော်တဲ့ tuple ဆိုရင်တော့ options type တစ်မျိုးတည်း (homogeneous) ဆီ ပြန်ကျသွားပါတယ်။

```ts
type QueriesOptions<T, TResults, TDepth> = TDepth["length"] extends MAXIMUM_DEPTH ? UseQueryOptionsForUseQueries[] : T extends [] ? [] : T extends [infer Head] ? [...TResults, GetUseQueryOptionsForUseQueries<Head>] : T extends [infer Head, ...(infer Tails)] ? QueriesOptions<[...Tails], [...TResults, GetUseQueryOptionsForUseQueries<Head>], [...TDepth, 1]> : ReadonlyArray<unknown> extends T ? T : T extends UseQueryOptionsForUseQueries<infer TQueryFnData, infer TError, infer TData, infer TQueryKey>[] ? UseQueryOptionsForUseQueries<TQueryFnData, TError, TData, TQueryKey>[] : UseQueryOptionsForUseQueries[];
```

## Type Parameters

### T

`T` *extends* `any`[]

Call site မှာ ရေးသားထားတဲ့ `queries` array ရဲ့ type ဖြစ်ပါတယ်။

### TResults

`TResults` *extends* `any`[] = \[\]

Recursion လုပ်ဆောင်နေစဉ်အတွင်း ဒီ type က တည်ဆောက်သွားတဲ့ internal accumulator ဖြစ်ပါတယ်။ ဒါကို ကိုယ်တိုင် explicitly သတ်မှတ်ဖို့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။

### TDepth

`TDepth` *extends* `ReadonlyArray`\<`number`\> = \[\]

Element ၂၀ ကန့်သတ်ချက်နဲ့ ယှဉ်စစ်ဆေးတဲ့ internal recursion-depth counter ဖြစ်ပါတယ်။ ဒါကို ကိုယ်တိုင် explicitly သတ်မှတ်ဖို့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။
