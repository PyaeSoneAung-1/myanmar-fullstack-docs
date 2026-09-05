---
title: "QueryErrorIsResetFunction (reset ဖြစ်မဖြစ် စစ်ရန် function type)"
description: "`QueryErrorResetBoundary` နှင့် ဆက်စပ်၍ query errors များ reset ဖြစ်ခဲ့လားကို စစ်ပေးသည့် function ၏ type — argument မလို၊ `boolean` ပြန်သည်"
order: 95
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/QueryErrorIsResetFunction"
status: translated
updated: 2026-09-05
---

`QueryErrorResetBoundary` ရဲ့ error-reset mechanism နဲ့ ဆက်စပ်တဲ့ function type ဖြစ်ပြီး — query errors တွေ reset ဖြစ်ခဲ့လားဆိုတာကို စစ်ဆေးပေးတဲ့ function တွေရဲ့ ပုံစံကို သတ်မှတ်ပါတယ်။

```ts
type QueryErrorIsResetFunction = () => boolean;
```

## Returns

`boolean`
