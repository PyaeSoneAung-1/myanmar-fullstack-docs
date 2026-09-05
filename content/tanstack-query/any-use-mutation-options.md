---
title: "AnyUseMutationOptions (type parameters အားလုံး any ဖြစ်သော mutation options)"
description: "`UseMutationOptions` ၏ type parameters အားလုံးကို `any` အဖြစ် သတ်မှတ်ထားသော type alias — helper function များတွင် mutation တစ်ခုခုအတွက် options လက်ခံရန် အသုံးဝင်သည်"
order: 83
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/AnyUseMutationOptions"
status: translated
updated: 2026-09-05
---

`AnyUseMutationOptions` ဆိုတာ [`UseMutationOptions`](/docs/tanstack-query/use-mutation-options) ရဲ့ type parameters အားလုံးကို `any` အဖြစ် သတ်မှတ်ထားတဲ့ type alias ဖြစ်ပါတယ်။ ဒီ type က တိကျတဲ့ type တွေ အရေးမကြီးတဲ့ နေရာမှာ အသုံးဝင်ပါတယ် — ဥပမာ helper function တစ်ခုထဲမှာ mutation တစ်ခုခုရဲ့ options တွေကို လက်ခံလိုတဲ့အခါမျိုးပါ။

```ts
type AnyUseMutationOptions = UseMutationOptions<any, any, any, any>;
```
