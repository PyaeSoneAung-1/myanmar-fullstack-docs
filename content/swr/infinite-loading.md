---
title: "Infinite Loading"
description: "useSWRInfinite နဲ့ Load More / infinite scroll — getKey(pageIndex, previousPageData), page တွေ စုထားတဲ့ data array, setSize နဲ့ နောက် page ဆွဲခြင်း"
order: 8
source: "https://swr.vercel.app/docs/pagination#infinite-loading"
status: translated
updated: 2026-09-01
---

## useSWRInfinite မိတ်ဆက်

"Load More" button (သို့) scroll နဲ့ list ထဲ data တွေ ဆက်ထည့်သွားတဲ့ **infinite loading** UI အတွက် — SWR က `useSWRInfinite` hook ကို ပေးထားပါတယ်။ ဒီ hook က request အများကြီးကို hook တစ်ခုတည်းနဲ့ စတင်နိုင်စေပါတယ်:

```jsx
import useSWRInfinite from 'swr/infinite'

// ...
const { data, error, isLoading, isValidating, mutate, size, setSize } = useSWRInfinite(
  getKey, fetcher?, options?
)
```

`useSWR` နဲ့ ဆင်တူပြီး — `getKey` လို့ခေါ်တဲ့ function ကို ပထမ argument အနေနဲ့ လက်ခံပါတယ်။ ပြန်ရတဲ့တန်ဖိုးတွေထဲက `size` နဲ့ `setSize` က ထူးခြားပြီး — React state လိုမျိုး page အရေအတွက်ကို ထိန်းချုပ်ပါတယ်။ Infinite loading မှာ — page တစ်ခုဆိုတာ request တစ်ခုပါ၊ ပြီးတော့ page တွေကို ယူပြီး render လုပ်တာပါ။

React Hooks ရဲ့ rules အရ hook တွေကို loop ထဲမှာ သုံးလို့မရတာမို့ — `for` loop နဲ့ `useSWR` တွေ ဆက်ခေါ်တာမျိုး မလုပ်နိုင်ပါဘူး။ အဲဒီအစား `useSWRInfinite` က ဒီအလုပ်ကို ကိုင်တွယ်ပေးပါတယ်။

## getKey — page key ဖန်တီးခြင်း

`getKey(pageIndex, previousPageData)` က — page index နဲ့ အရင် page ရဲ့ data ကို လက်ခံပြီး page တစ်ခုချင်းစီအတွက် key ပြန်ပေးရပါတယ်။ `null` ပြန်ရင် အဲဒီ page ရဲ့ request က မစတင်ပါဘူး — ဒါနဲ့ "အဆုံးရောက်ပြီ" ဆိုတာကို သတ်မှတ်လို့ရပါတယ်:

```jsx
// page တစ်ခုချင်းစီရဲ့ SWR key ပြန်ပေးတဲ့ function — return တန်ဖိုးကို fetcher က လက်ခံမယ်။
// null ပြန်ရင် အဲဒီ page ရဲ့ request မစတင်ပါဘူး။
const getKey = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.length) return null // အဆုံးရောက်ပြီ
  return `/users?page=${pageIndex}&limit=10`                    // SWR key
}

function App () {
  const { data, size, setSize } = useSWRInfinite(getKey, fetcher)
  if (!data) return 'loading'

  // user အားလုံးရဲ့ အရေအတွက်ကို တွက်လို့ရတယ်
  let totalUsers = 0
  for (let i = 0; i < data.length; i++) {
    totalUsers += data[i].length
  }

  return <div>
    <p>{totalUsers} users listed</p>
    {data.map((users, index) => {
      // `data` က page တစ်ခုချင်းစီရဲ့ API response တွေ စုထားတဲ့ array ပါ။
      return users.map(user => <div key={user.id}>{user.name}</div>)
    })}
    <button onClick={() => setSize(size + 1)}>Load More</button>
  </div>
}
```

ဒီမှာ `data` က တစ်ခုတည်းသော response မဟုတ်တော့ဘဲ — **page တွေရဲ့ response တွေ စုထားတဲ့ array** ပါ: `data[0]` က page ၁၊ `data[1]` က page ၂ စသဖြင့်။ ဒါကြောင့် page တွေအားလုံးရဲ့ data ကို top-level UI ကနေ တိုက်ရိုက် လှမ်းသုံးလို့ရပါတယ် — ဥပမာ total items အရေအတွက် ပြတာမျိုး။ "Load More" button က `setSize(size + 1)` နဲ့ page အရေအတွက် တိုးလိုက်တာပါ — SWR က နောက် page ကို ချက်ချင်း fetch လုပ်ပါတယ်။

## Cursor-based API

API က cursor လိုအပ်ပြီး response ထဲမှာ `nextCursor` ပါ ပြန်ပေးတဲ့ပုံစံဆိုရင် — `getKey` ထဲမှာ `previousPageData` ကနေ cursor ကို ဆွဲထုတ်သုံးလို့ရပါတယ်:

```js
const getKey = (pageIndex, previousPageData) => {
  // အဆုံးရောက်ပြီ
  if (previousPageData && !previousPageData.data) return null

  // ပထမ page — previousPageData မရှိသေးဘူး
  if (pageIndex === 0) return `/users?limit=10`

  // API endpoint ထဲ cursor ထည့်မယ်
  return `/users?cursor=${previousPageData.nextCursor}&limit=10`
}
```

ဒါက [Pagination](/docs/swr/pagination) မှာ ပြောထားတဲ့အတိုင်း — cursor-based က page တစ်ခုနဲ့တစ်ခု ဆက်စပ်နေလို့ `useSWR` တစ်ခုတည်းနဲ့ မရတဲ့နေရာမှာ `useSWRInfinite` က ဖြေရှင်းပေးပါတယ်။

## Loading states

`isLoading` က ပထမဆုံး data မရသေးတဲ့အချိန် — `isValidating` က ဘယ် request (သို့) revalidation မဆို လုပ်နေချိန်မှာ `true` ပါ။ ဒါကြောင့် "နောက် page တွေ loading ဖြစ်နေတာ" ကို — `isValidating` true ဖြစ်ပြီး `data` ရှိပြီးသား ဆိုတဲ့ ပုံစံနဲ့ ခွဲသိလို့ရပြီး — Load More button ကို disable လုပ်တာ၊ spinner ပြတာမျိုး UI လုပ်လို့ရပါတယ်။ (အစောပိုင်း SWR ဗားရှင်းတွေမှာ `isLoadingMore` ဆိုတဲ့ state ရှိခဲ့ပေမယ့် — လက်ရှိဗားရှင်းမှာတော့ `isLoading`/`isValidating` ကို သုံးပါတယ်။)

## Infinite scroll — IntersectionObserver (conceptual)

Button အစား scroll ရောက်တာနဲ့ အလိုအလျောက် နောက် page ဆွဲချင်ရင် — list ရဲ့အဆုံးမှာ sentinel element လေးတစ်ခု ထားပြီး `IntersectionObserver` နဲ့ အဲဒီ element မြင်ရတာနဲ့ `setSize(size + 1)` ခေါ်တဲ့ ပုံစံမျိုး သုံးပါတယ် (concept သဘောအားဖြင့်):

```jsx
const sentinelRef = useRef(null)

useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    // sentinel မြင်ရပြီး loading မဖြစ်နေရင် — နောက် page ဆွဲမယ်
    if (entries[0].isIntersecting && !isValidating) {
      setSize(size + 1)
    }
  })
  if (sentinelRef.current) observer.observe(sentinelRef.current)
  return () => observer.disconnect()
}, [size, isValidating, setSize])

return <div>
  {/* page တွေ render လုပ်ပါ */}
  <div ref={sentinelRef} /> {/* ဒီ sentinel မြင်ရတာနဲ့ နောက် page ဆွဲမယ် */}
</div>
```

## ဆက်ဖတ်ရန်

- [Pagination](/docs/swr/pagination) — ရိုးရိုး page-based pagination နဲ့ preload
- [Error & Loading အခြေအနေများ](/docs/swr/error-handling) — isLoading/isValidating ကွာခြားချက်
