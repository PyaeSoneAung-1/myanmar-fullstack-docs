---
title: "HydrationBoundaryProps (HydrationBoundary ၏ props များအတွက် interface)"
description: "HydrationBoundary က လက်ခံသော props များ — state, children, queryClient, options တို့ကို ဖော်ပြထားသည့် interface"
order: 73
source: "https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/HydrationBoundaryProps"
status: translated
updated: 2026-09-05
---

`HydrationBoundary` က လက်ခံတဲ့ props တွေ ဖြစ်ပါတယ်။

## Properties

### children?

```ts
optional children: ReactNode;
```

Render လုပ်ရမယ့် components တွေ — hydration ပြီးမှ မဟုတ်ဘဲ ဘယ်အခြေအနေမှာမဆို အမြဲ unconditional အနေနဲ့ render လုပ်ပါတယ်။ Query အသစ်တွေကို render လုပ်နေစဉ်အတွင်းမှာ cache ထဲကို hydrate လုပ်ပါတယ်; cache ထဲမှာ ရှိပြီးသား queries တွေအတွက်တော့ — ပိုသစ်တဲ့ dehydrated data ကိုသာ commit ပြီးနောက် effect ထဲမှာ hydrate လုပ်တာမို့ — ဒီ data မရောက်ခင် `children` က ခဏလေး အရင်ပဲ render ဖြစ်နေနိုင်ပါတယ်။

***

### options?

```ts
optional options: OmitKeyof<HydrateOptions, "defaultOptions"> & object;
```

Optional ဖြစ်ပါတယ်။ သတိပြုစရာ — `hydrate` နဲ့ မတူတာက ဒီမှာ `mutations` ကို သတ်မှတ်လို့ မရပါဘူး။

#### Type Declaration

##### defaultOptions?

```ts
optional defaultOptions: OmitKeyof<{
}, "mutations">;
```

***

### queryClient?

```ts
optional queryClient: QueryClient;
```

custom `QueryClient` တစ်ခု သုံးချင်ရင် ဒါကို သုံးပါ။ မသုံးရင် အနီးဆုံး context က instance ကို အသုံးပြုမှာ ဖြစ်ပါတယ်။

***

### state

```ts
state: DehydratedState | null | undefined;
```

hydrate လုပ်ရမယ့် state ဖြစ်ပါတယ်။
