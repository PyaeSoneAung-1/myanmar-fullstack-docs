---
title: "AnyUseInfiniteQueryOptions (type parameters အားလုံး any ဖြစ်သော infinite query options)"
description: "`UseInfiniteQueryOptions` ၏ type parameters အားလုံးကို `any` အဖြစ် သတ်မှတ်ထားသော type alias — helper function များတွင် query တစ်ခုခုအတွက် options လက်ခံရန် အသုံးဝင်သည်"
order: 82
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/AnyUseInfiniteQueryOptions"
status: translated
updated: 2026-09-05
---

`AnyUseInfiniteQueryOptions` ဆိုတာ [`UseInfiniteQueryOptions`](/docs/tanstack-query/use-infinite-query-options) ရဲ့ type parameters အားလုံးကို `any` အဖြစ် သတ်မှတ်ထားတဲ့ type alias ဖြစ်ပါတယ်။ ဒီ type က တိကျတဲ့ type တွေ အရေးမကြီးတဲ့ နေရာမှာ အသုံးဝင်ပါတယ် — ဥပမာ helper function တစ်ခုထဲမှာ query တစ်ခုခုရဲ့ options တွေကို လက်ခံလိုတဲ့အခါမျိုးပါ။

```ts
type AnyUseInfiniteQueryOptions = UseInfiniteQueryOptions<any, any, any, any, any>;
```
