---
title: "useIsFetching (Fetch ဖြစ်နေသော query အရေအတွက်)"
description: "useIsFetching hook — app တစ်ခုလုံးမှာ loading ဒါမှမဟုတ် background fetching ဖြစ်နေတဲ့ query တွေရဲ့ အရေအတွက်ကို ရယူခြင်း"
order: 42
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/useIsFetching"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function useIsFetching(filters?, queryClient?): number;
```

`useIsFetching` က optional hook တစ်ခုဖြစ်ပြီး — သင့် application မှာ လောလောဆယ် **loading ဖြစ်နေတဲ့ ဒါမှမဟုတ် background မှာ fetching ဖြစ်နေတဲ့ query တွေရဲ့ အရေအတွက်** (`number`) ကို ပြန်ပေးပါတယ်။ Screen ပေါ်မှာ မြင်နေရတဲ့ query တွေသာမက — app တစ်ခုလုံးကို ခြုံပြီး သိချင်တာမို့ app-wide loading indicator (ဥပမာ top progress bar) တွေအတွက် အသုံးဝင်ပါတယ်။ ဒီ hook က query cache ကို subscribe လုပ်ထားလို့ — အရေအတွက် ပြောင်းလဲတိုင်း component က ပြန် render ဖြစ်ပါတယ်။ အသေးစိတ်နဲ့ နမူနာတွေကို [Background Fetching Indicators](/docs/tanstack-query/background-fetching-indicators) မှာ ကြည့်နိုင်ပါတယ်။

## Parameters

**`filters?`** — [`QueryFilters`](https://tanstack.com/query/latest/docs/reference/QueryFilters) — အရေအတွက် ရေတွက်မယ့် query တွေကို သတ်မှတ်ပေးဖို့ပါ။ ဥပမာ `{ queryKey: ['posts'] }` ဆိုရင် posts prefix နဲ့ ကိုက်ညီတဲ့ query တွေကိုပဲ ရေတွက်ပါတယ်။ `queryKey`, `type` (`all`/`active`/`inactive`), `status`, `fetchStatus`, `exact` စတာတွေနဲ့ သေချာကျဉ်းမြောင်းအောင် filter လုပ်လို့ရပါတယ် — [Filters](/docs/tanstack-query/filters) မှာ ဖတ်ပါ။

**`queryClient?`** — custom `QueryClient` instance ကို သုံးချင်ရင် ပို့ပါ; မပို့ရင် အနီးဆုံး `QueryClientProvider` context ကနေ ယူပါတယ် — [useQueryClient](/docs/tanstack-query/use-query-client) ကို ကြည့်ပါ။

## Returns

`number` — application မှာ လောလောဆယ် loading ဖြစ်နေတဲ့ ဒါမှမဟုတ် background မှာ fetching ဖြစ်နေတဲ့ query တွေရဲ့ အရေအတွက်။ (Filters ပေးထားရင် — filter နဲ့ ကိုက်ညီတဲ့ query တွေထဲကသာ။)

## ဥပမာများ

Posts prefix နဲ့ ကိုက်ညီတဲ့ query တွေ fetching ဖြစ်နေလားဆိုတာ စစ်ပြီး indicator ပြခြင်း:

```tsx
import { useIsFetching } from '@tanstack/react-query'

function PostsFetchingIndicator() {
  // posts prefix နဲ့ ကိုက်ညီတဲ့ query ဘယ်နှစ်ခု fetching ဖြစ်နေလဲ?
  const isFetchingPosts = useIsFetching({ queryKey: ['posts'] })

  return isFetchingPosts ? <span>Refreshing posts...</span> : null
}
```

Screen ပေါ်က query တွေသာမက — background မှာ fetch ဖြစ်နေတဲ့ query တစ်ခုခုအတွက် app တစ်ခုလုံး loading indicator ပြခြင်း:

```tsx
import { useIsFetching } from '@tanstack/react-query'

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching()

  return isFetching ? (
    <div>Queries are fetching in the background...</div>
  ) : null
}
```

Mutation တွေကို ရေတွက်ချင်ရင် — `useIsMutating` hook ကို ကြည့်နိုင်ပါတယ်။
