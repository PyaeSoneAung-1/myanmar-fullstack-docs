---
title: "useIsMutating (Fetching ဖြစ်နေသော mutation အရေအတွက် ရယူရန် hook)"
description: "useIsMutating ရဲ့ call signature, filters နဲ့ Returns — လက်ရှိ fetching ဖြစ်နေတဲ့ mutation အရေအတွက်ကို ပြန်ပေးတဲ့ hook (app-wide loading indicator အတွက်)"
order: 43
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/useIsMutating"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function useIsMutating(filters?, queryClient?): number;
```

`useIsMutating` က optional hook တစ်ခုဖြစ်ပြီး — သင့် app ထဲမှာ လက်ရှိ fetching (run) ဖြစ်နေတဲ့ mutation တွေရဲ့ အရေအတွက် `number` ကို ပြန်ပေးပါတယ်။ Query တွေအတွက် [useIsFetching](/docs/tanstack-query/use-is-fetching) ရှိသလိုပဲ — ဒီ hook က mutation တွေအတွက် app တစ်ခုလုံးဆိုင်ရာ loading indicator (ဥပမာ "Saving..." bar) ပြချင်တဲ့အခါ အသုံးဝင်ပါတယ်။

## Parameters

**`filters?`** — [`MutationFilters`](https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/MutationFilters) type — ရေတွက်မယ့် mutation တွေကို ကျဉ်းမြောင်း (narrow down) လုပ်ဖို့ filter တွေပါ။ ဥပမာ — `mutationKey` သတ်မှတ်ထားရင် အဲဒီ key နဲ့ ကိုက်ညီတဲ့ mutation တွေပဲ ရေတွက်ပါတယ်။ Filter concept အကြောင်း အသေးစိတ်ကို [Filters](/docs/tanstack-query/filters) မှာ ဖတ်နိုင်ပါတယ်။

**`queryClient?`** — custom `QueryClient` instance တစ်ခုကို သုံးချင်ရင် ဒီနေရာမှာ ပို့ပါ။ မပို့ရင် component tree ထဲက အနီးဆုံး `QueryClientProvider` context ကနေ အလိုအလျောက် ယူပါတယ် — [useQueryClient](/docs/tanstack-query/use-query-client) ကို ကြည့်ပါ။

## Returns

`number` — သင့် app ထဲမှာ လက်ရှိ fetching ဖြစ်နေတဲ့ mutation တွေရဲ့ အရေအတွက်။ Mutation တစ်ခုမှ run မနေရင် `0` ပြန်ပါတယ်။

## ဥပမာများ

`posts` mutation key နဲ့ ကိုက်ညီတဲ့ mutation တွေ run နေသမျှ "Saving posts..." indicator ပြခြင်း:

```tsx
import { useIsMutating } from '@tanstack/react-query'

function PostsMutatingIndicator() {
  // posts prefix နဲ့ ကိုက်ညီတဲ့ mutation ဘယ်နှစ်ခု လက်ရှိ run နေလဲ?
  const isMutatingPosts = useIsMutating({ mutationKey: ['posts'] })

  return isMutatingPosts ? <span>Saving posts...</span> : null
}
```

ဒီ hook က mutation တစ်ခုချင်းစီရဲ့ status ထက် — "run နေတဲ့ mutation ရှိ/မရှိ" ကိုပဲ သိချင်တဲ့နေရာတွေအတွက် သင့်တော်ပါတယ်။ Mutation တွေကို စတင် run လုပ်ခြင်းနဲ့ callbacks အကြောင်း အသေးစိတ်ကို [Mutations](/docs/tanstack-query/mutations) နဲ့ [useMutation](/docs/tanstack-query/use-mutation) တို့မှာ ကြည့်နိုင်ပါတယ်။
