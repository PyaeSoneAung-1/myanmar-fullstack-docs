---
title: "SWR ကို နားလည်ခြင်း (Understanding SWR)"
description: "SWR ရဲ့ အတွင်းပိုင်း အလုပ်လုပ်ပုံ — state machine ပုံစံများ၊ isLoading နဲ့ isValidating ပေါင်းစပ်သုံးခြင်း၊ keepPreviousData နဲ့ dependency collection"
order: 19
source: "https://swr.vercel.app/docs/advanced/understanding"
status: translated
updated: 2026-09-01
---

## State Machine

`useSWR` က `fetcher` function ရဲ့ state ပေါ် မူတည်ပြီး — `data`, `error`, `isLoading`, `isValidating` တွေကို ပြန်ပေးပါတယ်။ အောက်က ပုံတွေက SWR က အခြေအနေအမျိုးမျိုးမှာ values တွေကို ဘယ်လို ပြန်ပေးလဲ ဆိုတာကို ဖော်ပြပါတယ်။

### Fetch လုပ်ပြီး Revalidate လုပ်ခြင်း

ဒီပုံစံက data ကို fetch လုပ်ပြီး — နောက်ပိုင်းမှာ ပြန် revalidate လုပ်တာပါ။

![Fetch နဲ့ revalidate ပုံစံ](https://swr.vercel.app/img/understanding/fetch-and-revalidate.svg)

### Key ပြောင်းခြင်း

ဒီပုံစံက data ကို fetch လုပ်ပြီး — key ပြောင်းကာ နောက်ပိုင်းမှာ ပြန် revalidate လုပ်တာပါ။

![Key ပြောင်းတဲ့ ပုံစံ](https://swr.vercel.app/img/understanding/key-change.svg)

### Key ပြောင်းခြင်း + ယခင် Data

ဒီပုံစံက data ကို fetch လုပ်ပြီး — `keepPreviousData` option နဲ့ key ပြောင်းကာ နောက်ပိုင်းမှာ ပြန် revalidate လုပ်တာပါ။

![Key ပြောင်းခြင်း + ယခင် data ပုံစံ](https://swr.vercel.app/img/understanding/key-change-previous-data.svg)

### Fallback

ဒီပုံစံက fallback data နဲ့ data ကို fetch လုပ်ပြီး — နောက်ပိုင်းမှာ ပြန် revalidate လုပ်တာပါ။

![Fallback ပုံစံ](https://swr.vercel.app/img/understanding/fallback.svg)

### Key ပြောင်းခြင်း + Fallback

ဒီပုံစံက fallback data နဲ့ data ကို fetch လုပ်ပြီး — key ပြောင်းကာ နောက်ပိုင်းမှာ ပြန် revalidate လုပ်တာပါ။

![Key ပြောင်းခြင်း + fallback ပုံစံ](https://swr.vercel.app/img/understanding/key-change-fallback.svg)

### Key ပြောင်းခြင်း + ယခင် Data + Fallback

ဒီပုံစံက `keepPreviousData` option နဲ့ fallback data ကို သုံးပြီး — data ကို fetch လုပ်ကာ key ပြောင်းပြီး နောက်ပိုင်းမှာ ပြန် revalidate လုပ်တာပါ။

![Key ပြောင်းခြင်း + ယခင် data + fallback ပုံစံ](https://swr.vercel.app/img/understanding/key-change-previous-data-fallback.svg)

## isLoading နဲ့ isValidating ကို ပေါင်းစပ်ပြီး UX ကောင်းအောင် လုပ်ခြင်း

ရှိပြီးသား `isValidating` value နဲ့ ယှဉ်ရင် — `isLoading` က property အသစ်တစ်ခုဖြစ်ပြီး — ပိုပြီး ယေဘုယျကျတဲ့ loading အခြေအနေတွေမှာ UX အတွက် အထောက်အကူ ပြုပါတယ်။

- `isValidating` က request တစ်ခု လုပ်ဆောင်နေချိန် **data ရှိရှိ မရှိရှိ** `true` ဖြစ်ပါတယ်
- `isLoading` က request တစ်ခု လုပ်ဆောင်နေပြီး **data မရသေးတဲ့အခါ** `true` ဖြစ်ပါတယ်

ရိုးရိုးရှင်းရှင်း ပြောရရင် — `isValidating` က revalidation တစ်ခုခု လုပ်ဆောင်နေတိုင်း ညွှန်ပြဖို့ သုံးလို့ရပြီး — `isLoading` က SWR က revalidate လုပ်နေပေမယ့် ပြသဖို့ data မရှိသေးတဲ့ အခြေအနေကို ညွှန်ပြဖို့ သုံးနိုင်ပါတယ်။

> 📝 Fallback data နဲ့ ယခင် data (previous data) တွေကို "loaded data" အဖြစ် မသတ်မှတ်ပါဘူး — ဒါကြောင့် fallback data သုံးတဲ့အခါ ဒါမှမဟုတ် keepPreviousData option ဖွင့်ထားတဲ့အခါ — ပြသဖို့ data ရှိနေနိုင်ပါတယ်။

```jsx
function Stock() {
  const { data, isLoading, isValidating } = useSWR(STOCK_API, fetcher, {
    refreshInterval: 3000
  });

  // Initial data တွေ load ဖြစ်နေသေးရင် ပြသဖို့ ဘာမှ မရှိပါဘူး
  // ဒါကြောင့် skeleton ကို ပြန်ပေးပါတယ်
  if (isLoading) return <div className="skeleton" />;

  // မဟုတ်ရင် data ကို ပြပြီး background revalidation ကို ညွှန်ပြတဲ့
  // spinner လေးကို ပြပါမယ်
  return (
    <>
      <div>${data}</div>
      {isValidating ? <div className="spinner" /> : null}
    </>
  );
}
```

![isLoading state သုံးတဲ့ ဥပမာ](https://swr.vercel.app/img/understanding/isloading.gif)

Code ဥပမာ အပြည့်အစုံကို [ဒီမှာ](https://codesandbox.io/s/swr-isloading-jtopow) တွေ့နိုင်ပါတယ်။

## ယခင် Data ကို ပြန်ပေးပြီး UX ကောင်းအောင် လုပ်ခြင်း

User ရဲ့ ဆက်တိုက် လုပ်ဆောင်ချက်တွေပေါ် မူတည်ပြီး data fetching လုပ်တဲ့အခါ — ဥပမာ စာရိုက်တာနဲ့အမျှ real-time search လုပ်တာမျိုး — ယခင် fetched data တွေကို ဆက်ထားထားရင် UX ကို အများကြီး ကောင်းစေနိုင်ပါတယ်။ `keepPreviousData` က အဲဒီအပြုအမူကို ဖွင့်ပေးတဲ့ option ပါ။ ရိုးရှင်းတဲ့ search UI ဥပမာ:

```jsx
function Search() {
  const [search, setSearch] = React.useState('');

  const { data, isLoading } = useSWR(`/search?q=${search}`, fetcher, {
    keepPreviousData: true
  });

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />

      <div className={isLoading ? "loading" : ""}>
        {data?.products.map(item => <Product key={item.id} name={item.name} />)
      </div>
    </div>
  );
}
```

`keepPreviousData` ဖွင့်ထားရင် — SWR key ကို ပြောင်းလိုက်ပြီး key အသစ်အတွက် data ပြန် load စတင်နေတုန်းမှာတောင် — ယခင် data ကို ဆက်ပြီး ရနေပါသေးတယ်။

[keepPreviousData ဖွင့်ထားချိန်မှာ ယခင် search results တွေကို ဆက်ထားပုံ (video)](https://user-images.githubusercontent.com/3676859/163695903-a3eb1259-180e-41e0-821e-21c320201194.mp4)

ဒီဥပမာအတွက် code အပြည့်အစုံ: https://codesandbox.io/s/swr-keeppreviousdata-fsjz3m

## Performance အတွက် Dependency Collection

SWR က component ထဲမှာ သုံးထားတဲ့ state တွေကို update လုပ်တဲ့အခါမှသာ — re-render ကို စတင်ပါတယ်။ Component ထဲမှာ `data` တစ်ခုတည်းပဲ သုံးတယ်ဆိုရင် — SWR က `isValidating`, `isLoading` လို တခြား property တွေရဲ့ update ကို လျစ်လျူရှုပါတယ်။ ဒါက rendering အကြိမ်အရေအတွက်ကို အများကြီး လျှော့ချပေးပါတယ်။ အသေးစိတ်ကို [ဒီမှာ](/docs/swr/performance#dependency-collection) ဖတ်နိုင်ပါတယ်။
