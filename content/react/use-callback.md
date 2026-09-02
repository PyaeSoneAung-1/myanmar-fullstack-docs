---
title: "useCallback"
description: "Re-renders တွေကြားမှာ function တစ်ခုကို cache လုပ်ထားနိုင်တဲ့ React Hook — dependencies တွေ မပြောင်းမချင်း function တစ်ခုတည်းကို ပြန်သုံးစေခြင်း၊ memoized child components တွေ re-render မဖြစ်အောင် ကူညီခြင်း"
order: 52
source: "https://react.dev/reference/react/useCallback"
status: translated
updated: 2026-09-02
---

`useCallback` ဆိုတာ — re-renders တွေကြားမှာ function တစ်ခုရဲ့ အဓိပ္ပါယ်ဖွင့်ဆိုချက် (function definition) ကို cache လုပ်ထားနိုင်တဲ့ React Hook တစ်ခုပါ။

```js
const cachedFn = useCallback(fn, dependencies)
```

> **မှတ်ချက်:** [React Compiler](https://react.dev/learn/react-compiler) က values တွေနဲ့ functions တွေကို အလိုအလျောက် memoize လုပ်ပေးတာမို့ — manual `useCallback` calls တွေ လိုအပ်မှုကို လျှော့ချပေးပါတယ်။ Memoization ကို အလိုအလျောက် ကိုင်တွယ်ဖို့ compiler ကို သုံးနိုင်ပါတယ်။

## ရည်ညွှန်းချက် (Reference)

### `useCallback(fn, dependencies)`

Re-renders တွေကြားမှာ function တစ်ခုကို cache လုပ်ဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useCallback` ကို ခေါ်ပါတယ်:

```js
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

**Parameters (ပါရာမီတာများ)**

- `fn`: သင်က cache လုပ်ချင်တဲ့ function value တစ်ခု။ ဒီ function က argument တွေ မရွေး ယူနိုင်ပြီး — values တွေ မရွေး ပြန်ပေးနိုင်ပါတယ်။ ကနဦး render မှာ — React က သင့် function ကို (ခေါ်တာ မဟုတ်ဘဲ!) ပြန်ပေးပါလိမ့်မယ်။ နောက် render တွေမှာ — နောက်ဆုံး render နောက်ပိုင်း `dependencies` တွေ မပြောင်းလဲဘူးဆိုရင် — React က function တစ်ခုတည်းကိုပဲ ပြန်ပေးပြီး — ပြောင်းလဲခဲ့ရင်တော့ — လက်ရှိ render အတွင်းမှာ သင်ပေးလိုက်တဲ့ function ကို ပြန်ပေးကာ — နောက်မှာ ပြန်သုံးနိုင်အောင် သိမ်းထားပါတယ်။ React က သင့် function ကို ခေါ်မှာ မဟုတ်ပါဘူး — ဘယ်အချိန်၊ ခေါ်မခေါ် သင်ဆုံးဖြတ်နိုင်အောင် — function ကို သင့်ဆီ ပြန်ပေးလိုက်တာပါ။

- `dependencies`: `fn` code ရဲ့ အတွင်းမှာ ကိုးကားထားတဲ့ reactive values တွေအားလုံးရဲ့ စာရင်း။ Reactive values တွေထဲမှာ props၊ state နဲ့ သင့် component body ထဲမှာ တိုက်ရိုက် ကြေညာထားတဲ့ variables နဲ့ functions တွေ အားလုံး ပါဝင်ပါတယ်။ သင့် linter ကို [React အတွက် သတ်မှတ်ပြီးသား ဖြစ်ရင်](https://react.dev/learn/editor-setup#linting) — reactive value တိုင်းကို dependency အဖြစ် မှန်မှန်ကန်ကန် သတ်မှတ်ထားကြောင်း စစ်ဆေးပေးပါလိမ့်မယ်။ Dependency list က item အရေအတွက် မပြောင်းလဲဘဲ — `[dep1, dep2, dep3]` လို inline ရေးရပါတယ်။ React က dependency တစ်ခုချင်းစီကို ယခင် တန်ဖိုးနဲ့ [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နှိုင်းယှဉ်မှု algorithm သုံးပြီး နှိုင်းယှဉ်ပါတယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

- ကနဦး render မှာ — `useCallback` က သင်ပေးလိုက်တဲ့ `fn` function ကိုပဲ ပြန်ပေးပါတယ်။
- နောက် render တွေမှာတော့ — dependencies တွေ မပြောင်းခဲ့ရင် နောက်ဆုံး render ကနေ သိမ်းထားပြီးသား `fn` function ကို ပြန်ပေးပြီး — ပြောင်းခဲ့ရင်တော့ — ဒီ render အတွင်းမှာ သင်ပေးလိုက်တဲ့ `fn` function ကို ပြန်ပေးပါတယ်။

**Caveats (သတိပြုရမည့်အချက်များ)**

- `useCallback` က Hook တစ်ခုမို့ — သင့် component ရဲ့ **အပေါ်ဆုံးအဆင့်** ဒါမှမဟုတ် ကိုယ်ပိုင် Hooks တွေထဲမှာပဲ ခေါ်ရပါတယ်။ Loops ဒါမှမဟုတ် conditions တွေထဲမှာ ခေါ်လို့ မရပါဘူး။ လိုအပ်ရင် — component အသစ်တစ်ခု ခွဲထုတ်ပြီး state ကို အဲဒီထဲ ရွှေ့ပါ။
- React က cache လုပ်ထားတဲ့ function ကို — ဒီလိုလုပ်ဖို့ **တိကျတဲ့ အကြောင်းပြချက် ရှိမှသာ ပစ်ပယ်ပါတယ်**။ ဥပမာ — development မှာ သင်က component ရဲ့ file ကို edit လုပ်လိုက်တဲ့အခါ React က cache ကို ပစ်ပယ်ပါတယ်။ Development ရော production ရော နှစ်ခုလုံးမှာ — သင့် component က ကနဦး mount အတွင်းမှာ suspend ဖြစ်ခဲ့ရင်လည်း React က cache ကို ပစ်ပယ်ပါတယ်။ နောင်နောင်မှာ React က cache ပစ်ပယ်ခြင်းကို အခွင့်ကောင်းယူတဲ့ feature တွေ ထပ်ထည့်လာနိုင်ပါတယ် — ဥပမာ — နောင်နောင်မှာ React က virtualized lists တွေအတွက် built-in support ထည့်လိုက်ရင် — virtualized table viewport ကနေ scroll ထွက်သွားတဲ့ items တွေရဲ့ cache ကို ပစ်ပယ်လိုက်တာ အဓိပ္ပာယ်ရှိပါလိမ့်မယ်။ `useCallback` ကို performance optimization တစ်ခုအနေနဲ့ပဲ မှီခိုသုံးစွဲနေတယ်ဆိုရင် — ဒါတွေက သင့် မျှော်လင့်ချက်တွေနဲ့ ကိုက်ညီပါလိမ့်မယ်။ ဒါမှမဟုတ်ရင်တော့ — [state variable](/docs/react/use-state) တစ်ခု ဒါမှမဟုတ် [ref](/docs/react/use-ref) တစ်ခုက ပိုသင့်လျော်နိုင်ပါတယ်။

---

## အသုံးပြုပုံ (Usage)

### Component တွေ Re-render လုပ်ခြင်းကို ရှောင်ခြင်း (Skipping re-rendering of components)

Rendering performance ကို optimize လုပ်တဲ့အခါ — child components တွေဆီ ပို့တဲ့ functions တွေကို cache လုပ်ဖို့ တစ်ခါတရံ လိုအပ်ပါတယ်။ ဒါကို ဘယ်လို လုပ်ရလဲဆိုတဲ့ syntax ကို အရင်ကြည့်ပြီး — ဘယ်ကိစ္စတွေမှာ အသုံးဝင်လဲ နောက်မှ ကြည့်ကြရအောင်။

သင့် component ရဲ့ re-renders တွေကြားမှာ function တစ်ခုကို cache လုပ်ဖို့ — သူ့ရဲ့ အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကို `useCallback` Hook ထဲမှာ ထုပ်လိုက်ပါ:

```js
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

`useCallback` ကို ပစ္စည်း နှစ်ခု ပေးရပါတယ်:

1. Re-renders တွေကြားမှာ သင်က cache လုပ်ချင်တဲ့ function definition တစ်ခု။
2. သင့် function ထဲမှာ သုံးထားတဲ့ — သင့် component အတွင်းက value တိုင်း ပါဝင်တဲ့ **dependencies စာရင်း** တစ်ခု။

ကနဦး render မှာ — `useCallback` ကနေ ရမယ့် **ပြန်ပေးတဲ့ function** က သင်ပေးလိုက်တဲ့ function ပဲ ဖြစ်ပါတယ်။

နောက် render တွေမှာ — React က **dependencies** တွေကို ယခင် render က ပေးခဲ့တဲ့ dependencies တွေနဲ့ နှိုင်းယှဉ်ပါတယ်။ Dependency တစ်ခုမှ မပြောင်းခဲ့ရင် ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နဲ့ နှိုင်းယှဉ်လို့) — `useCallback` က အရင်ကအတိုင်း function တစ်ခုတည်းကိုပဲ ပြန်ပေးပါတယ်။ မဟုတ်ရင် — `useCallback` က *ဒီ* render မှာ သင်ပေးလိုက်တဲ့ function ကို ပြန်ပေးပါလိမ့်မယ်။

တစ်နည်းပြောရရင် — `useCallback` က dependencies တွေ မပြောင်းမချင်း — re-renders တွေကြားမှာ function တစ်ခုကို cache လုပ်ထားပါတယ်။

**ဒါက ဘယ်အချိန်မှာ အသုံးဝင်လဲ ဥပမာတစ်ခုနဲ့ ကြည့်ကြည့်ရအောင်။**

`ProductPage` ကနေ `ShippingForm` component ဆီ `handleSubmit` function တစ်ခုကို ပို့နေတယ်ဆိုပါစို့:

```js
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

`theme` prop ကို toggle လုပ်တိုင်း app က တစ်ခဏ ရပ်သွားတာ သတိထားမိပေမယ့် — JSX ကနေ `<ShippingForm />` ကို ဖယ်လိုက်ရင် မြန်သွားတာကို တွေ့ရပါတယ်။ ဒါက — `ShippingForm` component ကို optimize လုပ်ဖို့ ကြိုးစားကြည့်ရကျိုး နပ်ကြောင်း ပြောနေတာပါ။

**ပုံမှန်အားဖြင့် — component တစ်ခု re-render ဖြစ်တဲ့အခါ — React က သူ့ရဲ့ children အားလုံးကို recursive ပြန် re-render လုပ်ပါတယ်။** ဒါကြောင့်ပဲ — `ProductPage` က `theme` မတူတာနဲ့ re-render ဖြစ်တဲ့အခါ — `ShippingForm` component ပါ *re-render ဖြစ်တာ* ဖြစ်ပါတယ်။ Re-render လုပ်ဖို့ တွက်ချက်မှု သိပ်မလိုတဲ့ components တွေအတွက်တော့ ဒါက ပြဿနာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — re-render တစ်ခုက နှေးတယ်လို့ စစ်ဆေးပြီးပြီဆိုရင် — props တွေ နောက်ဆုံး render ကအတိုင်း အတူတူဆိုရင် re-render ကို ရှောင်ဖို့ — `ShippingForm` ကို [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်ပြီး ပြောပြနိုင်ပါတယ်:

```js
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**ဒီပြောင်းလဲမှုနဲ့ဆို — `ShippingForm` ရဲ့ props တွေ အားလုံး နောက်ဆုံး render ကနဲ့ *အတူတူ* ဆိုရင် — `ShippingForm` က re-render ကို ရှောင်ပါလိမ့်မယ်။** ဒီနေရာမှာပဲ function ကို cache လုပ်တာ အရေးကြီးလာပါတယ်! `useCallback` မပါဘဲ `handleSubmit` ကို သတ်မှတ်ခဲ့တယ်ဆိုပါစို့:

```js
function ProductPage({ productId, referrer, theme }) {
  // Every time the theme changes, this will be a different function...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* ... so ShippingForm's props will never be the same, and it will re-render every time */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**JavaScript မှာ — `function () {}` ဒါမှမဟုတ် `() => {}` က _ကွဲပြားတဲ့_ function တစ်ခုကို အမြဲ ဖန်တီးပါတယ်** — `{}` object literal က object အသစ် အမြဲ ဖန်တီးသလိုပါပဲ။ ပုံမှန်အားဖြင့် ဒါက ပြဿနာ မဟုတ်ပေမယ့် — `ShippingForm` ရဲ့ props တွေ ဘယ်တော့မှ အတူတူ မဖြစ်တော့ဘူးဆိုတော့ — သင့်ရဲ့ [`memo`](https://react.dev/reference/react/memo) optimization က အလုပ်မလုပ်တော့ပါဘူး။ ဒီနေရာမှာ `useCallback` က အသုံးဝင်လာပါတယ်:

```js
function ProductPage({ productId, referrer, theme }) {
  // Tell React to cache your function between re-renders...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...so as long as these dependencies don't change...

  return (
    <div className={theme}>
      {/* ...ShippingForm will receive the same props and can skip re-rendering */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**`handleSubmit` ကို `useCallback` နဲ့ ထုပ်လိုက်ခြင်းဖြင့် — re-renders တွေကြားမှာ *တူညီတဲ့* function ဖြစ်နေတာ သေချာစေပါတယ်** (dependencies မပြောင်းမချင်း)။ တိကျတဲ့ အကြောင်းပြချက်တစ်ခုခု ရှိမှသာလွဲလို့ — function တစ်ခုကို `useCallback` နဲ့ ထုပ်စရာ *မလိုပါဘူး*။ ဒီဥပမာမှာ အကြောင်းပြချက်က — အဲဒါကို [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်ထားတဲ့ component တစ်ခုဆီ ပို့နေလို့ ဖြစ်ပြီး — ဒါက re-render ကို ရှောင်စေတာပါ။ `useCallback` လိုအပ်နိုင်တဲ့ တခြား အကြောင်းပြချက်တွေလည်း ရှိပါသေးတယ် — ဒီစာမျက်နှာမှာ ဆက်ဖတ်ရပါမယ်။

> **မှတ်ချက်:** **`useCallback` ကို performance optimization တစ်ခုအနေနဲ့ပဲ မှီခိုသင့်ပါတယ်။** မပါဘဲ သင့် code အလုပ်မလုပ်ဘူးဆိုရင် — မူရင်းပြဿနာကို ရှာပြီး အရင်ဆုံး ပြုပြင်ပါ။ ပြီးမှ performance တိုးတက်စေဖို့ `useCallback` ကို ပြန်ထည့်နိုင်ပါတယ်။

#### useCallback က useMemo နဲ့ ဘယ်လို ဆက်စပ်သလဲ

[`useMemo`](https://react.dev/reference/react/useMemo) ကို `useCallback` နဲ့ တွဲပြီး မကြာခဏ တွေ့ရပါတယ်။ Child component တစ်ခုကို optimize လုပ်ဖို့ ကြိုးစားတဲ့အခါ — နှစ်ခုလုံး အသုံးဝင်ပါတယ်။ သူတို့က သင်အောက်ကို ပို့နေတဲ့ အရာတစ်ခုခုကို [memoize](https://en.wikipedia.org/wiki/Memoization) (တစ်နည်း cache) လုပ်ခွင့်ပေးပါတယ်:

```js
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Calls your function and caches its result
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Caches your function itself
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

ကွာခြားချက်က သူတို့ **ဘာကို** cache လုပ်ပေးလဲဆိုတဲ့ အပေါ်မှာ ရှိပါတယ်:

- **[`useMemo`](https://react.dev/reference/react/useMemo) က သင့် function ကို ခေါ်လို့ ရလာတဲ့ *ရလဒ်* ကို cache လုပ်ပါတယ်။** ဒီဥပမာမှာ — `computeRequirements(product)` ကို ခေါ်လို့ ရလာတဲ့ ရလဒ်ကို cache လုပ်တာမို့ — `product` မပြောင်းရင် ရလဒ်က မပြောင်းပါဘူး။ ဒါက `requirements` object ကို — `ShippingForm` ကို မလိုအပ်ဘဲ re-render မဖြစ်စေဘဲ — အောက်ကို ပို့နိုင်စေပါတယ်။ လိုအပ်တဲ့အခါ — React က ရလဒ်ကို တွက်ချက်ဖို့ သင်ပေးလိုက်တဲ့ function ကို rendering အတွင်းမှာ ခေါ်ပါလိမ့်မယ်။
- **`useCallback` က *function ကိုယ်တိုင်* ကို cache လုပ်ပါတယ်။** `useMemo` နဲ့ မတူဘဲ — သင်ပေးလိုက်တဲ့ function ကို မခေါ်ပါဘူး။ ဒီအစား — သင်ပေးလိုက်တဲ့ function ကိုပဲ cache လုပ်ထားတာမို့ — `productId` ဒါမှမဟုတ် `referrer` မပြောင်းရင် — `handleSubmit` *ကိုယ်တိုင်* မပြောင်းပါဘူး။ ဒါက `handleSubmit` function ကို — `ShippingForm` ကို မလိုအပ်ဘဲ re-render မဖြစ်စေဘဲ — အောက်ကို ပို့နိုင်စေပါတယ်။ User က form ကို submit လုပ်တဲ့အထိ — သင့် code က run မှာ မဟုတ်ပါဘူး။

[`useMemo`](https://react.dev/reference/react/useMemo) ကို သိပြီးသားဆိုရင် — `useCallback` ကို ဒီလိုမျိုး စဉ်းစားကြည့်တာ အထောက်အကူ ဖြစ်နိုင်ပါတယ်:

```js
// Simplified implementation (inside React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[`useMemo` နဲ့ `useCallback` ကြားက ကွာခြားချက် အကြောင်း ပိုဖတ်ပါ](https://react.dev/reference/react/useMemo#memoizing-a-function)။

#### useCallback ကို နေရာတိုင်းမှာ ထည့်သင့်လား

သင့် app က ဒီ site လိုမျိုး — interaction အများစုက coarse (page တစ်ခုလုံး ဒါမှမဟုတ် section တစ်ခုလုံး အစားထိုးတာမျိုး) ဆိုရင် — memoization က ပုံမှန်အားဖြင့် မလိုအပ်ပါဘူး။ တစ်ဖက်မှာ — သင့် app က drawing editor လိုမျိုး — interaction အများစုက granular (shape တွေ ရွှေ့တာမျိုး) ဆိုရင်တော့ — memoization က အရမ်း အသုံးဝင်တာကို တွေ့ရပါလိမ့်မယ်။

`useCallback` နဲ့ function တစ်ခုကို cache လုပ်တာက ကိစ္စအနည်းငယ်မှာပဲ တန်ဖိုးရှိပါတယ်:

- အဲဒီ function ကို [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်ထားတဲ့ component တစ်ခုဆီ prop အဖြစ် ပို့တယ်။ Value မပြောင်းရင် re-render ကို ရှောင်ချင်တာပါ။ Memoization က သင့် component ကို dependencies တွေ ပြောင်းမှသာ re-render ဖြစ်စေပါတယ်။
- ပို့နေတဲ့ function ကို နောက်ပိုင်းမှာ Hook တစ်ခုခုရဲ့ dependency အဖြစ် သုံးတယ်။ ဥပမာ — `useCallback` နဲ့ ထုပ်ထားတဲ့ တခြား function တစ်ခုက ဒါပေါ်မှာ မူတည်နေတာမျိုး၊ ဒါမှမဟုတ် ဒီ function ကို [`useEffect`](/docs/react/use-effect) ကနေ dependency လုပ်ထားတာမျိုးပါ။

တခြားကိစ္စတွေမှာ — function တစ်ခုကို `useCallback` နဲ့ ထုပ်တာက အကျိုးကျေးဇူး မရှိပါဘူး။ ဒီလိုလုပ်တာက သိသာတဲ့ ထိခိုက်မှုလည်း မရှိတာမို့ — အသင်းတချို့က ကိစ္စတစ်ခုချင်းစီကို မစဉ်းစားတော့ဘဲ — တတ်နိုင်သမျှ အကုန် memoize လုပ်တာကို ရွေးချယ်ကြပါတယ်။ အားနည်းချက်က — code က ဖတ်ရခက်လာတာပါ။ ပြီးတော့ — memoization တိုင်း အကျိုးရှိတာ မဟုတ်ဘူး: "အမြဲ အသစ်" ဖြစ်နေတဲ့ value တစ်ခုတည်းက — component တစ်ခုလုံးရဲ့ memoization ကို ပျက်ပြယ်စေဖို့ လုံလောက်ပါတယ်။

`useCallback` က function *ဖန်တီးတာ* ကို တားဆီးမပေးတာ သတိပြုပါ — function တစ်ခုကို သင်က အမြဲ ဖန်တီးနေတာပါ (ဒါက ကောင်းတဲ့ အချက်ပါ!) — ဒါပေမယ့် — ဘာမှ မပြောင်းလဲရင် — React က အဲဒါကို လျစ်လျူရှုပြီး — cache လုပ်ထားတဲ့ function ကို ပြန်ပေးပါတယ်။

**လက်တွေ့မှာ — အောက်က principle အနည်းငယ်ကို လိုက်နာရင် — memoization အများကြီး မလိုအပ်တော့အောင် လုပ်နိုင်ပါတယ်:**

1. Component တစ်ခုက တခြား components တွေကို visually ထုပ်ပေးနေတယ်ဆိုရင် — [JSX တွေကို children အဖြစ် လက်ခံပါစေ](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)။ ဒီလိုဆို — wrapper component က သူ့ရဲ့ state ကို update လုပ်တဲ့အခါ — သူ့ရဲ့ children တွေ re-render လုပ်စရာ မလိုကြောင်း React က သိပါတယ်။
2. Local state ကို ဦးစားပေးသုံးပြီး — [state ကို လိုအပ်တာထက် ပိုမြှင့် (lift up)](/docs/react/sharing-state-between-components) မလုပ်ပါနဲ့။ Forms နဲ့ item တစ်ခုကို hover လုပ်နေလားဆိုတာလို ခဏတပ်မျှ state တွေကို — tree ရဲ့ ထိပ်မှာ ဒါမှမဟုတ် global state library တစ်ခုထဲမှာ မသိမ်းပါနဲ့။
3. သင့် [rendering logic ကို pure ဖြစ်အောင် ထားပါ](/docs/react/keeping-components-pure)။ Component တစ်ခုကို re-render လုပ်တာက ပြဿနာတစ်ခုခု ဖြစ်စေတာ ဒါမှမဟုတ် သိသာတဲ့ visual artifact တစ်ခုခု ထုတ်ပေးနေတယ်ဆိုရင် — အဲဒါ သင့် component ထဲက bug တစ်ခုပါ! Memoization ထည့်တာထက် — bug ကို ပြုပြင်ပါ။
4. [state တွေကို update လုပ်တဲ့ မလိုအပ်တဲ့ Effects တွေ](https://react.dev/learn/you-might-not-need-an-effect)ကို ရှောင်ပါ။ React app တွေမှာ performance ပြဿနာ အများစုက — Effects တွေကနေ စတင်တဲ့ update ကွင်းဆက်တွေကြောင့် ဖြစ်ပြီး — အဲဒါတွေက သင့် components တွေကို ထပ်ခါထပ်ခါ render ဖြစ်စေပါတယ်။
5. သင့် [Effects တွေဆီက မလိုအပ်တဲ့ dependencies တွေကို ဖယ်ရှားဖို့ ကြိုးစားပါ](https://react.dev/learn/removing-effect-dependencies)။ ဥပမာ — memoization အစား — object ဒါမှမဟုတ် function တစ်ခုကို Effect ရဲ့ အတွင်း ဒါမှမဟုတ် component ရဲ့ အပြင်ဘက်ကို ရွှေ့လိုက်တာ မကြာခဏ ပိုရိုးရှင်းပါတယ်။

သီးခြား interaction တစ်ခုခု ကြန့်ကြာနေသေးတယ်ဆိုရင် — [React Developer Tools profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) ကို သုံးပြီး — ဘယ် components တွေက memoization ကနေ အကျိုးအများဆုံး ရမလဲ ကြည့်ကာ — လိုတဲ့နေရာမှာ memoization ထည့်ပါ။ ဒီ principles တွေက သင့် components တွေကို debug လုပ်ရတာ နားလည်ရတာ ပိုလွယ်ကူစေတာမို့ — ဘယ်အခြေအနေမှာမဆို လိုက်နာတာ ကောင်းပါတယ်။ ရေရှည်မှာ — ဒီပြဿနာကို တစ်ကြိမ်တည်းနဲ့ ဖြေရှင်းဖို့ [memoization တွေကို အလိုအလျောက် လုပ်တာ](https://www.youtube.com/watch?v=lGEMwh32soc)ကို ကျွန်တော်တို့ သုတေသန လုပ်နေပါတယ်။

#### ဥပမာ — `useCallback` နဲ့ `memo` ကို သုံးပြီး Re-render ကို ရှောင်ခြင်း

ဒီဥပမာမှာ — `ShippingForm` component ကို **တမင် နှေးအောင် လုပ်ထား**ပြီး — သင် render လုပ်နေတဲ့ React component တစ်ခုက တကယ်နှေးရင် ဘာဖြစ်လဲ မြင်ရမှာပါ။ Counter ကို တိုးကြည့်ပြီး theme ကိုလည်း toggle လုပ်ကြည့်ပါ။

Counter တိုးတာ နှေးနေတာက — နှေးအောင်လုပ်ထားတဲ့ `ShippingForm` ကို re-render စေလို့ပါ။ ဒါက မျှော်လင့်ထားတဲ့အတိုင်းပါ — counter ပြောင်းသွားတာမို့ — user ရဲ့ ရွေးချယ်မှုအသစ်ကို screen ပေါ်မှာ ထင်ဟပ်စေဖို့ လိုအပ်လို့ပါ။

ဒီနောက် — theme ကို toggle လုပ်ကြည့်ပါ။ **`useCallback` ကို [`memo`](https://react.dev/reference/react/memo) နဲ့ တွဲသုံးထားတာမို့ — တမင်နှေးအောင်လုပ်ထားပေမယ့် မြန်နေပါတယ်!** `handleSubmit` function က မပြောင်းတာမို့ — `ShippingForm` က re-render ကို ရှောင်လိုက်တာပါ။ `handleSubmit` function မပြောင်းတာကလည်း — `productId` ရော `referrer` ရော (သင့် `useCallback` ရဲ့ dependencies တွေ) နှစ်ခုလုံး နောက်ဆုံး render ကနောက်ပိုင်း မပြောင်းလို့ပါ။

ဒီဥပမာမှာ — `App.js` က dark mode checkbox ကို ပြပြီး `ProductPage` ကို render လုပ်ပါတယ်။ `ShippingForm.js` ကတော့ — `memo` နဲ့ ထုပ်ထားပြီး — render ဖြစ်တိုင်း 500ms လောက် တမင်နှေးအောင်လုပ်ထားတဲ့ form component ပါ။ အဓိက ကွာခြားချက်ကို ဒီ `ProductPage.js` မှာ မြင်ရပါတယ် — `handleSubmit` ကို `useCallback` နဲ့ ထုပ်ထားတာပါ:

```js
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

#### ဥပမာ — Component တစ်ခုကို အမြဲ Re-render လုပ်နေခြင်း

ဒီဥပမာမှာလည်း — `ShippingForm` ကို **တမင် နှေးအောင် လုပ်ထား**ပြီး — React component တစ်ခု တကယ်နှေးရင် ဘာဖြစ်လဲ မြင်ရမှာပါ။ Counter ကို တိုးကြည့်ပြီး theme ကိုလည်း toggle လုပ်ကြည့်ပါ။

ယခင် ဥပမာနဲ့ မတူဘဲ — အခု theme toggle လုပ်တာပါ နှေးနေပါတယ်! ဘာလို့လဲဆိုတော့ — **ဒီ version မှာ `useCallback` call မရှိလို့ပါ** — `handleSubmit` က function အသစ် အမြဲ ဖြစ်နေတာမို့ — နှေးအောင်လုပ်ထားတဲ့ `ShippingForm` component က re-render ကို မရှောင်နိုင်လို့ပါ။

ဒီမှာ ကွာခြားချက်ကို မြင်ရအောင် — `ProductPage.js` ရဲ့ ဒီ version ကို ကြည့်ပါ (`App.js` နဲ့ `ShippingForm.js` တို့က အထက်ကအတိုင်းပါ):

```js
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

ဒါပေမယ့် — ဒီတစ်ခါ **artificial slowdown ဖယ်လိုက်တဲ့** တူညီတဲ့ code ကို ကြည့်ကြရအောင်။ `useCallback` မရှိတာကို သိသာလား မသိသာဘူးလား?

မကြာခဏဆိုသလို — memoization မပါတဲ့ code က ကောင်းကောင်း အလုပ်လုပ်ပါတယ်။ သင့် interactions တွေ လုံလောက်အောင် မြန်နေရင် — memoization မလိုပါဘူး။

သင့် app ကို တကယ်ဘာတွေက နှေးစေလဲ လက်တွေ့ကျကျ သိဖို့ — React ကို production mode နဲ့ run ပြီး — [React Developer Tools](https://react.dev/learn/react-developer-tools) ကို ပိတ်ထားကာ — သင့် app ရဲ့ user တွေမှာရှိတဲ့ device နဲ့ ဆင်တူတဲ့ devices တွေကို သုံးဖို့ လိုအပ်တာ သတိပြုပါ။

---

### Memoized Callback တစ်ခုကနေ State Update လုပ်ခြင်း

တစ်ခါတရံ — memoized callback တစ်ခုကနေ — ယခင် state ကို အခြေခံပြီး state ကို update လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။

ဒီ `handleAddTodo` function က — နောက် todos တွေကို သူ့ကနေ တွက်တာမို့ — `todos` ကို dependency အဖြစ် သတ်မှတ်ထားပါတယ်:

```js
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

Memoized functions တွေမှာ dependencies အနည်းဆုံး ထားချင်လေ့ ရှိပါတယ် — နောက် state ကို တွက်ဖို့ပဲ state တစ်ခုခုကို ဖတ်နေတယ်ဆိုရင် — [updater function](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state) တစ်ခုကို ပေးလိုက်ခြင်းဖြင့် အဲဒီ dependency ကို ဖယ်ရှားနိုင်ပါတယ်:

```js
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ No need for the todos dependency
  // ...
```

ဒီနေရာမှာ — `todos` ကို dependency လုပ်ပြီး အတွင်းမှာ ဖတ်မယ့်အစား — state ကို *ဘယ်လို* update လုပ်ရမယ်ဆိုတဲ့ ညွှန်ကြားချက်တစ်ခု (`todos => [...todos, newTodo]`) ကို React ဆီ ပေးလိုက်တာပါ။ [Updater functions အကြောင်း ပိုဖတ်ပါ](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state)။

### Effect တစ်ခု မကြာခဏ run မဖြစ်အောင် ကာကွယ်ခြင်း (Preventing an Effect from firing too often)

တစ်ခါတရံ — [Effect](/docs/react/use-effect) တစ်ခုရဲ့ အတွင်းကနေ function တစ်ခုကို ခေါ်ချင်နိုင်ပါတယ်:

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    // ...
```

ဒါက ပြဿနာတစ်ခု ဖန်တီးပါတယ် — [reactive value တိုင်းကို သင့် Effect ရဲ့ dependency အဖြစ် ကြေညာရပါတယ်](https://react.dev/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)။ ဒါပေမယ့် — `createOptions` ကို dependency အဖြစ် ကြေညာလိုက်ရင် — သင့် Effect က chat room ဆီ ထပ်ခါထပ်ခါ ပြန်ချိတ်ဆက်နေစေပါလိမ့်မယ်:

```js
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Problem: This dependency changes on every render
  // ...
```

ဒါကို ဖြေရှင်းဖို့ — Effect တစ်ခုကနေ ခေါ်ဖို့ လိုအပ်တဲ့ function ကို `useCallback` ထဲမှာ ထုပ်နိုင်ပါတယ်:

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Only changes when roomId changes

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Only changes when createOptions changes
  // ...
```

ဒါက — `roomId` အတူတူဆိုရင် — re-renders တွေကြားမှာ `createOptions` function က အတူတူပဲ ဖြစ်နေတာ သေချာစေပါတယ်။ **ဒါပေမယ့် — function dependency တစ်ခုရဲ့ လိုအပ်ချက်ကိုယ်တိုင် ဖယ်ရှားလိုက်တာ ပိုတောင် ကောင်းပါတယ်။** သင့် function ကို Effect ရဲ့ *အတွင်းဘက်* ရွှေ့လိုက်ပါ:

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ No need for useCallback or function dependencies!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

အခုဆို သင့် code က ပိုရိုးရှင်းပြီး `useCallback` မလိုတော့ပါဘူး။ [Effect dependencies တွေကို ဖယ်ရှားခြင်း အကြောင်း ပိုလေ့လာပါ](https://react.dev/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)။

### Custom Hook တစ်ခုကို Optimize လုပ်ခြင်း

[custom Hook](https://react.dev/learn/reusing-logic-with-custom-hooks) တစ်ခု ရေးနေတယ်ဆိုရင် — သူက ပြန်ပေးတဲ့ functions တွေကို `useCallback` နဲ့ ထုပ်ထားဖို့ အကြံပြုပါတယ်:

```js
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

ဒါက — သင့် Hook ရဲ့ အသုံးပြုသူတွေ (consumers) က — လိုအပ်တဲ့အခါ သူတို့ရဲ့ ကိုယ်ပိုင် code တွေကို optimize လုပ်နိုင်တာ သေချာစေပါတယ်။

---

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### Component render တိုင်း — `useCallback` က function အသစ်တစ်ခု ပြန်ပေးနေတယ်

Dependency array ကို ဒုတိယ argument အနေနဲ့ သေချာ သတ်မှတ်ထားကြောင်း စစ်ဆေးပါ!

Dependency array ကို မေ့သွားရင် — `useCallback` က function အသစ်တစ်ခုကို အခါတိုင်း ပြန်ပေးပါလိမ့်မယ်:

```js
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Returns a new function every time: no dependency array
  // ...
```

ဒါက dependency array ကို ဒုတိယ argument အဖြစ် ပေးထားတဲ့ မှန်ကန်တဲ့ version ပါ:

```js
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Does not return a new function unnecessarily
  // ...
```

ဒါနဲ့ မပြေလည်ရင် — ပြဿနာက သင့် dependencies တစ်ခုခုက ယခင် render ကနဲ့ မတူနေလို့ပါ။ ဒီပြဿနာကို debug လုပ်ဖို့ — သင့် dependencies တွေကို console မှာ ကိုယ်တိုင် log လုပ်ကြည့်နိုင်ပါတယ်:

```js
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

ပြီးရင် — console ထဲက re-render အမျိုးမျိုးရဲ့ arrays တွေပေါ်မှာ right-click လုပ်ပြီး — နှစ်ခုလုံးကို "Store as a global variable" လို့ ရွေးနိုင်ပါတယ်။ ပထမတစ်ခုကို `temp1` အနေနဲ့၊ ဒုတိယတစ်ခုကို `temp2` အနေနဲ့ သိမ်းပြီးပြီဆိုရင် — array နှစ်ခုထဲက dependency တစ်ခုချင်းစီ တူမတူကို browser console နဲ့ စစ်နိုင်ပါတယ်:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

ဘယ် dependency က memoization ကို ပျက်စေလဲ တွေ့ပြီဆိုရင် — အဲဒါကို ဖယ်ရှားဖို့ နည်းလမ်းရှာပါ — ဒါမှမဟုတ် [အဲဒါကိုပါ memoize လုပ်ပါ](https://react.dev/reference/react/useMemo#memoizing-a-dependency-of-another-hook)။

### List item တစ်ခုချင်းစီအတွက် loop ထဲမှာ `useCallback` ခေါ်ချင်တယ် — ခွင့်မပြုဘူး

`Chart` component ကို [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်ထားတယ်ဆိုပါစို့။ `ReportList` component re-render ဖြစ်တဲ့အခါ — list ထဲက `Chart` တစ်ခုချင်းစီ re-render မဖြစ်အောင် ရှောင်ချင်ပါတယ်။ ဒါပေမယ့် — loop တစ်ခုထဲမှာ `useCallback` ခေါ်လို့ မရပါဘူး:

```js
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useCallback in a loop like this:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

ဒီအစား — item တစ်ခုချင်းစီအတွက် component တစ်ခု ခွဲထုတ်ပြီး — `useCallback` ကို အဲဒီနေရာမှာ ထားပါ:

```js
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Call useCallback at the top level:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

တစ်နည်းအားဖြင့် — နောက်ဆုံး snippet ထဲက `useCallback` ကို ဖယ်ပြီး — `Report` ကိုယ်တိုင်ကို [`memo`](https://react.dev/reference/react/memo) နဲ့ ထုပ်နိုင်ပါတယ်။ `item` prop မပြောင်းရင် — `Report` က re-render ကို ရှောင်ပြီး — `Chart` ပါ re-render ရှောင်သွားပါလိမ့်မယ်:

```js
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```