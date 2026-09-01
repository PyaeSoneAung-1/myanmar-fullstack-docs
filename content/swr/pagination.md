---
title: "Pagination"
description: "useSWR နဲ့ page-based pagination — key ထဲ page index ထည့်ခြင်း၊ နောက် page ကို ကြိုတင်ယူခြင်း (preload)၊ loading state နဲ့ offset vs cursor API"
order: 7
source: "https://swr.vercel.app/docs/pagination"
status: translated
updated: 2026-09-01
---

## Page-based pagination

ရိုးရိုး pagination UI (Previous / Next button နဲ့ page တစ်ခုချင်း ပြတာမျိုး) ဆိုရင် — `useSWRInfinite` မလိုဘဲ `useSWR` တစ်ခုတည်းနဲ့ လုံလောက်ပါတယ်။ Page index ကို React state အနေနဲ့ ထားပြီး — API URL ထဲ ထည့်ကာ key အဖြစ် သုံးလိုက်ရုံပါပဲ:

```jsx
function App () {
  const [pageIndex, setPageIndex] = useState(0);

  // API URL ထဲမှာ page index ပါတယ် — ဒါက React state ဖြစ်ပါတယ်။
  const { data } = useSWR(`/api/data?page=${pageIndex}`, fetcher);

  // ... loading နဲ့ error state တွေကို စီမံပါ

  return <div>
    {data.map(item => <div key={item.id}>{item.name}</div>)}
    <button onClick={() => setPageIndex(pageIndex - 1)}>Previous</button>
    <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>
  </div>
}
```

Page index ပြောင်းလိုက်တာနဲ့ key ပြောင်းသွားလို့ — SWR က page အသစ်အတွက် request အသစ် လုပ်ပါတယ်။ ဒီအပိုင်းကို "page component" အနေနဲ့ ခွဲထုတ်လိုက်ရင် — နေရာမျိုးစုံမှာ ပြန်သုံးလို့ရပါတယ်:

```jsx
function Page ({ index }) {
  const { data } = useSWR(`/api/data?page=${index}`, fetcher);

  // ... loading နဲ့ error state တွေကို စီမံပါ

  return data.map(item => <div key={item.id}>{item.name}</div>)
}

function App () {
  const [pageIndex, setPageIndex] = useState(0);

  return <div>
    <Page index={pageIndex}/>
    <button onClick={() => setPageIndex(pageIndex - 1)}>Previous</button>
    <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>
  </div>
}
```

## နောက် page ကို ကြိုတင်ယူခြင်း (Preload)

SWR ရဲ့ cache ကြောင့် — နောက် page ကို ကြိုတင်ယူထားလို့ရပါတယ်။ နည်းလမ်းက — နောက် page ရဲ့ `<Page />` ကို hidden div ထဲမှာ render လုပ်ထားလိုက်ရုံပါပဲ။ SWR က နောက် page ရဲ့ data ကို fetch လုပ်ပြီး cache ထဲ သိမ်းထားလို့ — user က Next နှိပ်လိုက်တာနဲ့ data က အဆင်သင့် ရှိနေပြီး ချက်ချင်း render ဖြစ်ပါတယ်:

```jsx
function App () {
  const [pageIndex, setPageIndex] = useState(0);

  return <div>
    <Page index={pageIndex}/>
    <div style={{ display: 'none' }}><Page index={pageIndex + 1}/></div>
    <button onClick={() => setPageIndex(pageIndex - 1)}>Previous</button>
    <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>
  </div>
}
```

တစ်ကြောင်းတည်း ထည့်လိုက်ရုံနဲ့ UX အများကြီး တိုးတက်သွားပါတယ် — hidden div ကြောင့် UI ပေါ်မှာ ဘာမှ မပေါ်ဘဲ — SWR ရဲ့ cache နဲ့ request deduplication ကို အသုံးချပြီး နောက် page data ကို ကြိုယူထားတာပါ။ နောက်ထပ် နည်းတစ်ခုက — နောက် page ရဲ့ key အတွက် `fallbackData` option နဲ့ data ကို cache ထဲ ကြိုထည့်ထားရင် — user က Next နှိပ်လိုက်တာနဲ့ fetch မစောင့်ဘဲ ချက်ချင်း render ဖြစ်ပါတယ်။ [Prefetching](/docs/swr/prefetching) မှာ အသေးစိတ် ဖတ်နိုင်ပါတယ်။

## Loading state — stale data

သွားဖူးပြီးသား page (key) ကို ပြန်သွားရင် — cache ထဲက data ရှိလို့ instant render ဖြစ်ပါတယ်။ မရောက်ဖူးသေးတဲ့ page ကို သွားရင်တော့ loading state ပြရပါမယ် — ဒါပေမယ့် အပေါ်က preload လုပ်ထားရင် အဲဒီ loading ကို ရှောင်လို့ရပါတယ်။ ဒါပြင် SWR ရဲ့ stale-while-revalidate သဘောအရ — key တစ်ခုအတွက် data အဟောင်း ရှိနေတုန်း background မှာ data အသစ် ပြန်ယူပြီး — ရတာနဲ့ UI ကို အလိုအလျောက် မွမ်းမံပေးပါတယ်။

Loading ပြနေစဉ်မှာ — `isLoading` (data မရသေးတာ) နဲ့ `isValidating` (data ရှိပြီးသား၊ နောက်ကွယ်မှာ ပြန်စစ်နေတာ) ကို ခွဲပြီး — loading UI အသစ် ပြမယ့်အစား ရှိပြီးသား data ကို ဆက်ပြနိုင်ပါတယ်။ အသေးစိတ်ကို [Error & Loading အခြေအနေများ](/docs/swr/error-handling) မှာ ကြည့်ပါ။

## Offset vs Cursor

အပေါ်က page-based (index) API ပုံစံမှာ — page တစ်ခုချင်းစီက တစ်ခုနဲ့တစ်ခု သီးခြားမို့ (offset-style) — `useSWR` တစ်ခုတည်းနဲ့ ရပါတယ်။ ဒါပေမယ့် **cursor-based** API — နောက် page ရဲ့ request က အရင် page ရဲ့ response ထဲက cursor ပေါ်မူတည်နေတာမျိုး — ဆိုရင်တော့ page တွေ သီးခြားမဟုတ်တော့ဘဲ — `useSWRInfinite` လိုအပ်ပါတယ်။ အသေးစိတ်ကို [Infinite Loading](/docs/swr/infinite-loading) မှာ ကြည့်ပါ။

## ဆက်ဖတ်ရန်

- [Infinite Loading](/docs/swr/infinite-loading) — useSWRInfinite နဲ့ Load More / infinite scroll
- [Prefetching](/docs/swr/prefetching) — data ကြိုတင်ယူခြင်း (preload, fallbackData)
