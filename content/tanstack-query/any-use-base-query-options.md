---
title: "AnyUseBaseQueryOptions (type parameters အားလုံး any ဖြစ်သော base query options)"
description: "`UseBaseQueryOptions` ၏ type parameters အားလုံးကို `any` အဖြစ် သတ်မှတ်ထားသော type alias — helper function များတွင် query တစ်ခုခုအတွက် options လက်ခံရန် အသုံးဝင်သည်"
order: 81
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/AnyUseBaseQueryOptions"
status: translated
updated: 2026-09-05
---

`AnyUseBaseQueryOptions` ဆိုတာ [`UseBaseQueryOptions`](/docs/tanstack-query/use-base-query-options) ရဲ့ type parameters အားလုံးကို `any` အဖြစ် သတ်မှတ်ထားတဲ့ type alias ဖြစ်ပါတယ်။ ဒီ type က တိကျတဲ့ type တွေ အရေးမကြီးတဲ့ နေရာမှာ အသုံးဝင်ပါတယ် — ဥပမာ helper function တစ်ခုထဲမှာ query တစ်ခုခုရဲ့ options တွေကို လက်ခံလိုတဲ့အခါမျိုးပါ။

```ts
type AnyUseBaseQueryOptions = UseBaseQueryOptions<any, any, any, any, any>;
```
