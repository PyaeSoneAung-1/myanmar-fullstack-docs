---
title: "Invalidations from Mutations (Mutation တွေကနေ Query Invalidate လုပ်ခြင်း)"
description: "Mutation တစ်ခု အောင်မြင်တဲ့အခါ သက်ဆိုင်ရာ queries တွေကို ဘယ်အချိန်/ဘယ်လို invalidate လုပ်ရမလဲ — useMutation ရဲ့ onSuccess callback နဲ့ queryClient.invalidateQueries သုံးနည်း"
order: 66
source: "https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations"
status: translated
updated: 2026-09-02
---

Query တွေကို invalidate လုပ်တတ်ဖို့ ဆိုတာ တိုက်ပွဲ တစ်ဝက်ပဲ ရှိပါသေးတယ်။ ကျန်တဲ့ တစ်ဝက်က — သူတို့ကို **ဘယ်အချိန်မှာ** invalidate လုပ်ရမလဲဆိုတာ သိဖို့ပါ။ ပုံမှန်အားဖြင့် — သင့် application ထဲက mutation တစ်ခု အောင်မြင်တဲ့အခါ — mutation ရဲ့ အပြောင်းအလဲအသစ်တွေကို ထည့်သွင်းစဉ်းစားဖို့ — invalidate လုပ်ရမယ့် (ပြီးတော့ ဖြစ်နိုင်ရင် refetch ပါ လုပ်ရမယ့်) ဆက်စပ် queries တွေ ရှိနေနိုင်ခြေ အလွန် များပါတယ်။

ဥပမာ — todo အသစ်တစ်ခုကို post လုပ်ဖို့ mutation တစ်ခု ရှိတယ် ဆိုပါစို့:

```tsx
const mutation = useMutation({ mutationFn: postTodo })
```

`postTodo` mutation တစ်ခု အောင်မြင်တဲ့အခါ — todo အသစ် item ကို ပြသဖို့ `todos` queries အားလုံးကို invalidate ပြီး ဖြစ်နိုင်ရင် refetch ပါ လုပ်စေချင်မှာ ဖြစ်ပါတယ်။ ဒါလုပ်ဖို့ — `useMutation` ရဲ့ `onSuccess` option နဲ့ `client` ရဲ့ `invalidateQueries` function ကို သုံးနိုင်ပါတယ်:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

// When this mutation succeeds, invalidate any queries with the `todos` or `reminders` query key
const mutation = useMutation({
  mutationFn: addTodo,
  onSuccess: async () => {
    // If you're invalidating a single query
    await queryClient.invalidateQueries({ queryKey: ['todos'] })

    // If you're invalidating multiple queries
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['todos'] }),
      queryClient.invalidateQueries({ queryKey: ['reminders'] }),
    ])
  },
})
```

`onSuccess` မှာ Promise တစ်ခု ပြန်ပို့ထားရင် — mutation လုံးဝ ပြီးဆုံးခင် data ကို update ဖြစ်ပြီးသား ဖြစ်အောင် သေချာစေပါတယ် (ဆိုလိုတာက — `onSuccess` ပြည့်စုံသည်အထိ `isPending` က `true` ဖြစ်နေမှာ ဖြစ်ပါတယ်)

[`useMutation` hook](/docs/tanstack-query/mutations) ထဲမှာ ရနိုင်တဲ့ callback တွေထဲက ဘယ်ဟာကိုမဆို သုံးပြီး — သင့် invalidations တွေ ဖြစ်ပေါ်လာအောင် ချိတ်ဆက်နိုင်ပါတယ်

## ထပ်ဆင့် ဖတ်ရှုရန်

Mutations ပြီးနောက် Queries တွေကို အလိုအလျောက် invalidate လုပ်တဲ့ နည်းစနစ်တစ်ခုအတွက် — [TkDodo ရဲ့ Automatic Query Invalidation after Mutations ဆောင်းပါး](https://tkdodo.eu/blog/automatic-query-invalidation-after-mutations) ကို ကြည့်ပါ။
