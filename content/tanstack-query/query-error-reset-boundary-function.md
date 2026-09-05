---
title: "QueryErrorResetBoundaryFunction (QueryErrorResetBoundary ၏ children function type)"
description: "`QueryErrorResetBoundary` ၏ `children` အဖြစ် သုံးရသည့် render-prop function type — `QueryErrorResetBoundaryValue` ကို လက်ခံပြီး `ReactNode` ပြန်ပေးသည်"
order: 96
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/QueryErrorResetBoundaryFunction"
status: translated
updated: 2026-09-05
---

`QueryErrorResetBoundary` မှာ `children` အနေနဲ့ သုံးလို့ရတဲ့ render-prop function type ဖြစ်ပါတယ်။

```ts
type QueryErrorResetBoundaryFunction = (value) => React.ReactNode;
```

## Parameters

### value

`QueryErrorResetBoundaryValue`

နယ်နိမိတ် (boundary) ရဲ့ `QueryErrorResetBoundaryValue` ဖြစ်ပါတယ်။

## Returns

`React.ReactNode`

Render လုပ်ရမယ့် children ဖြစ်ပါတယ်။
