---
title: "QueryClientProviderProps (QueryClientProvider ၏ props type)"
description: "`QueryClientProvider` က လက်ခံသည့် props — required `client` နှင့် optional `children` — ကို သတ်မှတ်ပေးသော type"
order: 93
source: "https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/QueryClientProviderProps"
status: translated
updated: 2026-09-05
---

`QueryClientProvider` component က လက်ခံတဲ့ props တွေရဲ့ type ဖြစ်ပါတယ်။

```ts
type QueryClientProviderProps = object;
```

## Properties

### children?

```ts
optional children: React.ReactNode;
```

ပံ့ပိုးပေးထားတဲ့ `QueryClient` ကို သုံးစွဲခွင့်ရရှိမယ့် components တွေ ဖြစ်ပါတယ်။

***

### client

```ts
client: QueryClient;
```

**လိုအပ်သည် (Required)** — ပံ့ပိုးပေးရမယ့် `QueryClient` instance ဖြစ်ပါတယ်။
