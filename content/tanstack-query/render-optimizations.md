---
title: "Render Optimizations (Render ပိုင်း ပိုမိုကောင်းမွန်အောင် ပြုလုပ်ခြင်း)"
description: "React Query က components တွေကို လိုအပ်မှသာ re-render ဖြစ်စေတဲ့ နည်းလမ်းများ — structural sharing, referential identity, tracked properties, select option နဲ့ memoization"
order: 30
source: "https://tanstack.com/query/latest/docs/framework/react/guides/render-optimizations"
status: translated
updated: 2026-09-01
---

React Query က သင့် components တွေကို တကယ်လိုအပ်မှသာ re-render ဖြစ်စေဖို့ optimization အချို့ကို အလိုအလျောက် ပြုလုပ်ပေးပါတယ်။ ဒါကို အောက်ပါ နည်းလမ်းတွေနဲ့ ဆောင်ရွက်ပါတယ်:

## structural sharing (ဖွဲ့စည်းပုံ မျှဝေခြင်း)

React Query က re-renders တွေကြားမှာ references တွေကို တတ်နိုင်သမျှ များများ မပြောင်းလဲဘဲ ထိန်းသိမ်းထားဖို့ "structural sharing" လို့ ခေါ်တဲ့ နည်းစနစ်တစ်ခုကို သုံးပါတယ်။ Network ကနေ data ကို fetch လုပ်တဲ့အခါ — ပုံမှန်အားဖြင့် response ကို json parsing လုပ်တဲ့အခါ reference အသစ် တစ်ခုလုံး ရမှာပါ။ ဒါပေမယ့် React Query ကတော့ data ထဲမှာ ဘာမှ **မပြောင်းလဲ**ဘူးဆိုရင် မူရင်း reference ကို ထိန်းသိမ်းထားပါတယ်။ Subset တစ်ခုခု ပြောင်းလဲခဲ့ရင် — React Query က မပြောင်းလဲတဲ့ အပိုင်းတွေကို ထိန်းထားပြီး ပြောင်းလဲတဲ့ အပိုင်းတွေကိုသာ အစားထိုးပါတယ်။

> Note: ဒီ optimization က `queryFn` က JSON-compatible data ကို return လုပ်မှသာ အလုပ်လုပ်ပါတယ်။ ဒါကို `structuralSharing: false` လို့ global ဒါမှမဟုတ် query တစ်ခုချင်းစီမှာ သတ်မှတ်ပြီး ပိတ်လို့ ရသလို — function တစ်ခုကို ထည့်ပေးပြီး ကိုယ်ပိုင် structural sharing ကိုလည်း အကောင်အထည်ဖော်လို့ ရပါတယ်။

### referential identity (ရည်ညွှန်းချက် တူညီမှု)

`useQuery`၊ `useInfiniteQuery`၊ `useMutation` တို့ကနေ return လုပ်တဲ့ အပေါ်ဆုံးအဆင့် object နဲ့ `useQueries` ကနေ return လုပ်တဲ့ Array က **referentially stable မဟုတ်ပါဘူး**။ Render တိုင်းမှာ reference အသစ် ဖြစ်ပါတယ်။ ဒါပေမယ့် — ဒီ hooks တွေကနေ return လုပ်တဲ့ `data` properties တွေကတော့ တတ်နိုင်သမျှ stable ဖြစ်နေပါလိမ့်မယ်။

## tracked properties (ခြေရာခံထားတဲ့ properties)

React Query က `useQuery` ကနေ return လုပ်တဲ့ properties တွေထဲက တစ်ခုကို တကယ် "အသုံးပြုနေမှ"သာ re-render ကို trigger လုပ်ပါတယ်။ ဒါကို [Proxy object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) ကို သုံးပြီး လုပ်ဆောင်ပါတယ်။ ဒါက မလိုအပ်တဲ့ re-renders တွေ အများကြီးကို ရှောင်ရှားပေးပါတယ် — ဥပမာ `isFetching` ဒါမှမဟုတ် `isStale` လို properties တွေက မကြာခဏ ပြောင်းလဲနိုင်ပေမယ့် component ထဲမှာ သုံးမထားတာမျိုးပါ။

ဒီ feature ကို `notifyOnChangeProps` ကို global ဒါမှမဟုတ် query တစ်ခုချင်းစီမှာ ကိုယ်တိုင် သတ်မှတ်ပြီး customize လုပ်နိုင်ပါတယ်။ ဒီ feature ကို ပိတ်ချင်တယ်ဆိုရင် — `notifyOnChangeProps: 'all'` လို့ သတ်မှတ်နိုင်ပါတယ်။

> Note: Proxy ရဲ့ get trap က property တစ်ခုကို — destructuring ကနေဖြစ်စေ၊ တိုက်ရိုက် access လုပ်ခြင်းကနေဖြစ်စေ — access လုပ်တဲ့အခါ invoke ဖြစ်ပါတယ်။ Object rest destructuring သုံးမယ်ဆိုရင် — ဒီ optimization ကို disable ဖြစ်စေမှာပါ။ ဒီအန္တရာယ်ကို ကာကွယ်ဖို့ [lint rule](https://tanstack.com/query/latest/docs/eslint/no-rest-destructuring) တစ်ခု ရှိပါတယ်။

## select

သင့် component က subscribe လုပ်သင့်တဲ့ data ရဲ့ subset တစ်ခုကို ရွေးချယ်ဖို့ `select` option ကို သုံးနိုင်ပါတယ်။ ဒါက data transformations တွေကို အလွန် optimized ဖြစ်အောင် လုပ်ဖို့ ဒါမှမဟုတ် မလိုအပ်တဲ့ re-renders တွေကို ရှောင်ဖို့ အသုံးဝင်ပါတယ်။

```js
export const useTodos = (select) => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    select,
  })
}

export const useTodoCount = () => {
  return useTodos((data) => data.length)
}
```

`useTodoCount` custom hook ကို သုံးတဲ့ component တစ်ခုက todos တွေရဲ့ length ပြောင်းမှသာ re-render ဖြစ်ပါမယ်။ ဥပမာ — todo တစ်ခုရဲ့ name ပြောင်းရင် re-render ဖြစ်**မှာ မဟုတ်ပါဘူး**။

> Note: `select` က အောင်မြင်စွာ cached ဖြစ်ထားတဲ့ data ပေါ်မှာ အလုပ်လုပ်ပြီး — errors တွေကို throw လုပ်ဖို့ နေရာ မဟုတ်ပါဘူး။ Errors တွေရဲ့ အရင်းအမြစ် (source of truth) က `queryFn` ဖြစ်ပြီး — error တစ်ခုကို return လုပ်တဲ့ `select` function က `data` ကို `undefined` ဖြစ်စေပြီး `isSuccess` က `true` ဖြစ်စေပါတယ်။ Data မမှန်ရင် query ကို fail ဖြစ်စေချင်တယ်ဆိုရင် errors တွေကို `queryFn` ထဲမှာ ကိုင်တွယ်ဖို့ ဒါမှမဟုတ် caching နဲ့ မဆိုင်တဲ့ error case ဆိုရင် query hook ရဲ့ အပြင်မှာ ကိုင်တွယ်ဖို့ အကြံပြုပါတယ်။

### memoization

`select` function က အောက်ပါ အခြေအနေတွေမှာသာ ပြန်ပြီး run ပါလိမ့်မယ်:

- `select` function ကိုယ်တိုင် referentially ပြောင်းလဲခဲ့ရင်
- `data` ပြောင်းလဲခဲ့ရင်

ဆိုလိုတာက — အပေါ်မှာ ပြထားသလို inline `select` function က render တိုင်းမှာ run ပါလိမ့်မယ်။ ဒါကို ရှောင်ဖို့ — `select` function ကို `useCallback` နဲ့ ထုပ်လို့ ရသလို — dependencies မရှိဘူးဆိုရင် stable function reference တစ်ခုအဖြစ် ထုတ်ယူထားလို့လည်း ရပါတယ်:

```js
// useCallback နဲ့ ထုပ်ထားသည်
export const useTodoCount = () => {
  return useTodos(useCallback((data) => data.length, []))
}
```

```js
// stable function reference အဖြစ် ထုတ်ယူထားသည်
const selectTodoCount = (data) => data.length

export const useTodoCount = () => {
  return useTodos(selectTodoCount)
}
```

## ထပ်ဆင့် ဖတ်ရှုရန်

ဒီအကြောင်းအရာတွေအကြောင်း ပိုမိုနက်ရှိုင်းတဲ့ guide အတွက် — TkDodo ရဲ့ [React Query Render Optimizations](https://tkdodo.eu/blog/react-query-render-optimizations) ကို ဖတ်ပါ။ `select` option ကို အကောင်းဆုံး သုံးနည်း လေ့လာဖို့ — [React Query Selectors, Supercharged](https://tkdodo.eu/blog/react-query-selectors-supercharged) ကို ဖတ်ပါ။
