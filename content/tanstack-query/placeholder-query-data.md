---
title: "Placeholder Query Data (နေရာယူ Query ဒေတာ)"
description: "`placeholderData` option နဲ့ query ကို data ရှိပြီးသားလို ပြုမူစေနည်း — value/function အနေနဲ့ သုံးပုံ, memoization, cache ကနေ placeholder data ယူနည်း"
order: 23
source: "https://tanstack.com/query/latest/docs/framework/react/guides/placeholder-query-data"
status: translated
updated: 2026-09-01
---

## Placeholder data ဆိုတာ ဘာလဲ

Placeholder data က — query တစ်ခုကို data ရှိပြီးသားလို ပြုမူစေပါတယ် — `initialData` option နဲ့ ဆင်ပေမယ့် — **data ကို cache ထဲမှာ မထိန်းသိမ်းပါဘူး**။ ဒါက — တကယ့် data ကို နောက်ခံမှာ fetch လုပ်နေတုန်း — query ကို အောင်မြင်စွာ render ဖို့ လုံလောက်တဲ့ partial (တစ်စိတ်တစ်ပိုင်း) (ဒါမှမဟုတ် fake) data ရှိနေတဲ့ အခြေအနေမျိုးမှာ အသုံးဝင်ပါတယ်။

> ဥပမာ: Blog post တစ်ခုချင်းစီရဲ့ query က — ခေါင်းစဉ်နဲ့ post body ရဲ့ အပိုင်းအစလေး ပဲ ပါတဲ့ blog posts list ကနေ "preview" data ကို ဆွဲယူနိုင်ပါတယ်။ ဒီ partial data ကို individual query ရဲ့ query result ထဲမှာ ထိန်းသိမ်းထားချင်မှာ မဟုတ်ပေမယ့် — တကယ့် query က object တစ်ခုလုံးကို fetch ပြီးအောင် လုပ်နေတုန်း — content layout ကို တတ်နိုင်သမျှ မြန်မြန် ပြသဖို့အတွက်တော့ အသုံးဝင်ပါတယ်။

Query တစ်ခုအတွက် placeholder data ကို လိုအပ်ချိန်မတိုင်ခင် cache ထဲကို ထည့်သွင်းဖို့ နည်းလမ်းတစ်ချို့ ရှိပါတယ်:

- Declaratively (ကြေညာနည်းအရ):
  - Query တစ်ခုကို `placeholderData` ပေးပြီး — cache ဗလာ ဖြစ်နေရင် ကြိုဖြည့်ထားပါ
- Imperatively (လုပ်ဆောင်နည်းအရ):
  - [`queryClient` နဲ့ `placeholderData` option ကို သုံးပြီး data ကို prefetch ဒါမှမဟုတ် fetch လုပ်ပါ](/docs/tanstack-query/prefetching)

`placeholderData` သုံးတဲ့အခါ — ကျွန်တော်တို့ရဲ့ Query က `pending` state ထဲ ရောက်မှာ မဟုတ်ပါဘူး — `success` state နဲ့ စတင်ပါလိမ့်မယ် — ဘာကြောင့်လဲဆိုတော့ ပြသဖို့ `data` ရှိလို့ပါ — အဲဒီ data က "placeholder" data သက်သက် ဖြစ်နေရင်တောင် ဖြစ်ပါတယ်။ "တကယ့်" data နဲ့ ခွဲခြားသိဖို့ — Query result ပေါ်မှာ `isPlaceholderData` flag ကို `true` အဖြစ် သတ်မှတ်ထားပေးပါတယ်။

## Placeholder Data ကို Value အနေနဲ့

```tsx
function Todos() {
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/todos'),
    placeholderData: placeholderTodos,
  })
}
```

### Placeholder Data Memoization

Query တစ်ခုရဲ့ placeholder data ကို ရယူတဲ့ လုပ်ငန်းစဉ်က လေးလံတယ်ဆိုရင် — ဒါမှမဟုတ် render တိုင်း မလုပ်ချင်ဘူးဆိုရင် — value ကို memoize လုပ်နိုင်ပါတယ်:

```tsx
function Todos() {
  const placeholderData = useMemo(() => generateFakeTodos(), [])
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/todos'),
    placeholderData,
  })
}
```

## Placeholder Data ကို Function အနေနဲ့

`placeholderData` က function တစ်ခုလည်း ဖြစ်နိုင်ပါတယ် — အဲဒီအခါ "ယခင်" အောင်မြင်ခဲ့တဲ့ Query တစ်ခုရဲ့ data နဲ့ Query meta အချက်အလက်တွေကို ရယူနိုင်ပါတယ်။ ဒါက — query တစ်ခုရဲ့ data ကို တခြား query တစ်ခုရဲ့ placeholder data အဖြစ် သုံးချင်တဲ့ အခြေအနေမျိုးတွေမှာ အသုံးဝင်ပါတယ်။ QueryKey ပြောင်းတဲ့အခါ — ဥပမာ `['todos', 1]` ကနေ `['todos', 2]` ကို — data တွေ query တစ်ခုကနေ နောက်တစ်ခုဆီ _ကူးပြောင်းနေတုန်း_ loading spinner ပြစရာ အစား — "ဟောင်း" data ကို ဆက်ပြသထားနိုင်ပါတယ်။ အသေးစိတ်အတွက် [Paginated Queries](/docs/tanstack-query/paginated-queries) ကို ကြည့်ပါ။

```tsx
const result = useQuery({
  queryKey: ['todos', id],
  queryFn: () => fetch(`/todos/${id}`),
  placeholderData: (previousData, previousQuery) => previousData,
})
```

### Cache ကနေ Placeholder Data

အခြေအနေတစ်ချို့မှာ — တခြား query တစ်ခုရဲ့ cached result ကနေ placeholder data ကို ထောက်ပံ့ပေးနိုင်ပါတယ်။ ကောင်းတဲ့ ဥပမာတစ်ခုက — blog post list query ရဲ့ cached data ထဲမှာ ရှာပြီး post ရဲ့ preview ဗားရှင်းတစ်ခုကို ရယူကာ — အဲဒါကို individual post query ရဲ့ placeholder data အဖြစ် သုံးတာပါ:

```tsx
function BlogPost({ blogPostId }) {
  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: ['blogPost', blogPostId],
    queryFn: () => fetch(`/blogPosts/${blogPostId}`),
    placeholderData: () => {
      // 'blogPosts' query ကနေ blogPost ရဲ့ သေးငယ်/preview ဗားရှင်းကို
      // ဒီ blogPost query ရဲ့ placeholder data အဖြစ် သုံးပါမယ်
      return queryClient
        .getQueryData(['blogPosts'])
        ?.find((d) => d.id === blogPostId)
    },
  })
}
```

## ဆက်လက်ဖတ်ရှုရန်

`Placeholder Data` နဲ့ `Initial Data` ကြား နှိုင်းယှဉ်မှုအတွက် — [TkDodo ရဲ့ ဆောင်းပါး](https://tkdodo.eu/blog/placeholder-and-initial-data-in-react-query) ကို ကြည့်ပါ။
