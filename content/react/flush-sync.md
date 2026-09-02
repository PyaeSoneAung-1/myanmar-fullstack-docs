---
title: "flushSync"
description: "Callback အတွင်းက updates တွေကို synchronously ချက်ချင်း flush လုပ်ဖို့ React ကို အတင်းခိုင်းတဲ့ react-dom API — third-party integrations တွေမှာ DOM ကို spot ချင်း update ဖြစ်စေရန် သုံးခြင်း (performance ထိခိုက်မှု သတိပြုစရာ)"
order: 72
source: "https://react.dev/reference/react-dom/flushSync"
status: translated
updated: 2026-09-02
---

> **သတိပြုရန်** — `flushSync` သုံးတာက ရှားပါးပြီး — သင့် app ရဲ့ performance ကို ထိခိုက်စေနိုင်ပါတယ်။

`flushSync` ဆိုတာ — ပေးလိုက်တဲ့ callback အတွင်းက updates တွေ အားလုံးကို synchronously flush လုပ်ဖို့ React ကို အတင်းခိုင်းတဲ့ function ပါ။ ဒါက DOM ကို ချက်ချင်း update ဖြစ်စေပါတယ်။

```js
flushSync(callback)
```

## ရည်ညွှန်းချက် (Reference)

### `flushSync(callback)`

ဆိုင်းငံ့ထားတဲ့ (pending) အလုပ်တွေကို flush လုပ်ပြီး DOM ကို synchronously update လုပ်ဖို့ `flushSync` ကို ခေါ်ပါတယ်:

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

အများစုမှာ `flushSync` ကို ရှောင်နိုင်ပါတယ်။ နောက်ဆုံးနည်းလမ်း (last resort) အနေနဲ့ပဲ သုံးပါ။

#### Parameters (ပါရာမီတာများ)

- `callback` — function တစ်ခု။ React က ဒီ callback ကို ချက်ချင်း ခေါ်ပြီး — သူ့အတွင်းက updates တွေကို synchronously flush လုပ်ပါတယ်။ Pending updates တွေ၊ Effects တွေ ဒါမှမဟုတ် Effects တွေရဲ့ အတွင်းက updates တွေကိုလည်း flush လုပ်နိုင်ပါတယ်။ ဒီ `flushSync` call ကြောင့် update တစ်ခု suspend ဖြစ်ခဲ့ရင် — fallbacks တွေ ပြန်ပြခံရနိုင်ပါတယ်။

#### Returns (ပြန်ပေးသည့်တန်ဖိုး)

`flushSync` က `undefined` ကို ပြန်ပေးပါတယ်။

#### Caveats (သတိပြုရမည့်အချက်များ)

- `flushSync` က performance ကို သိသိသာသာ ထိခိုက်စေနိုင်ပါတယ်။ ချွေတာပြီးမှ သုံးပါ။
- `flushSync` က pending Suspense boundaries တွေကို သူတို့ရဲ့ `fallback` state ပြဖို့ အတင်း ခိုင်းနိုင်ပါတယ်။
- `flushSync` က pending Effects တွေကို run စေပြီး — ပြန်မလာခင် သူတို့အတွင်းက updates တွေကိုပါ synchronously လုပ်ဆောင်နိုင်ပါတယ်။
- Callback အတွင်းက updates တွေကို flush ဖို့ လိုအပ်ရင် — callback ရဲ့ အပြင်ဘက်က updates တွေကိုပါ flush လုပ်နိုင်ပါတယ်။ ဥပမာ — click တစ်ခုကနေ pending updates တွေ ရှိနေရင် — React က callback အတွင်းက updates တွေကို flush မလုပ်ခင် — အဲဒါတွေကို အရင် flush လုပ်ပါလိမ့်မယ်။

## အသုံးပြုပုံ (Usage)

### Third-party ပေါင်းစည်းမှုတွေအတွက် Updates တွေကို Flush လုပ်ခြင်း (Flushing updates for third-party integrations)

Browser APIs ဒါမှမဟုတ် UI libraries လို third-party code တွေနဲ့ ပေါင်းစည်းတဲ့အခါ — updates တွေကို flush လုပ်ဖို့ React ကို အတင်း ခိုင်းဖို့ လိုအပ်လာနိုင်ပါတယ်။ Callback အတွင်းက state updates တွေကို synchronously flush လုပ်ဖို့ `flushSync` ကို သုံးပါ:

```js
flushSync(() => {
  setSomething(123);
});
// By this line, the DOM is updated.
```

ဒါက နောက် code line တစ်ကြောင်း run လာတဲ့အချိန်မှာ — React က DOM ကို update လုပ်ပြီးသား ဖြစ်စေပါတယ်။

**`flushSync` သုံးတာက ရှားပြီး — မကြာခဏ သုံးရင် သင့် app ရဲ့ performance ကို သိသိသာသာ ထိခိုက်စေနိုင်ပါတယ်။** သင့် app က React APIs တွေပဲ သုံးပြီး — third-party libraries တွေနဲ့ မပေါင်းစည်းဘူးဆိုရင် — `flushSync` မလိုပါဘူး။

ဒါပေမယ့် — browser APIs လို third-party code တွေနဲ့ ပေါင်းစည်းတဲ့အခါမှာတော့ အသုံးဝင်နိုင်ပါတယ်။

Browser APIs တချို့က — callbacks တွေရဲ့ အတွင်းက ရလဒ်တွေကို callback ပြီးဆုံးတဲ့အချိန်မှာ DOM ထဲ synchronously ရေးပြီးသား ဖြစ်စေချင်ပါတယ် — ဒါမှ browser က render လုပ်ပြီးသား DOM နဲ့ တစ်ခုခု လုပ်နိုင်မှာမို့ပါ။ အများစုမှာ React က ဒါကို အလိုအလျောက် ကိုင်တွယ်ပေးပါတယ်။ ဒါပေမယ့် — တချို့ကိစ္စတွေမှာတော့ synchronous update တစ်ခုကို အတင်း ခိုင်းဖို့ လိုအပ်နိုင်ပါတယ်။

ဥပမာ — browser ရဲ့ `onbeforeprint` API က print dialog မဖွင့်ခင် ချက်ချင်း page ကို ပြောင်းလဲခွင့် ပေးပါတယ်။ ဒါက print အတွက် ပိုကောင်းအောင် ပြသဖို့ custom print styles တွေ သုံးတဲ့အခါ အသုံးဝင်ပါတယ်။ အောက်က ဥပမာမှာ — `onbeforeprint` callback ထဲမှာ `flushSync` ကို သုံးပြီး React state ကို DOM ထဲ ချက်ချင်း "flush" လုပ်လိုက်တာမို့ — print dialog ပွင့်လာတဲ့အချိန်မှာ `isPrinting` က "yes" ပြပါလိမ့်မယ်:

```js
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}
```

`flushSync` မရှိရင် — print dialog က `isPrinting` ကို "no" အနေနဲ့ ပြပါလိမ့်မယ်။ ဘာလို့လဲဆိုတော့ — React က updates တွေကို asynchronously batch လုပ်ပြီး — state update မဖြစ်ခင်မှာ print dialog က အရင် ပွင့်သွားလို့ပါ။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### "flushSync was called from inside a lifecycle method" ဆိုတဲ့ error ရနေတယ်

React က render ဖြစ်နေချိန် အလယ်မှာ `flushSync` ကို မလုပ်နိုင်ပါဘူး။ လုပ်မိရင် — noop (ဘာမှ မလုပ်ဘဲ) ဖြစ်ပြီး သတိပေးချက် ထုတ်ပါတယ်:

```
Warning: flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.
```

ဒီထဲမှာ အောက်ပါနေရာတွေအတွင်းမှာ `flushSync` ခေါ်တာတွေ ပါဝင်ပါတယ်:

- Component တစ်ခုကို render လုပ်နေချိန်။
- `useLayoutEffect` ဒါမှမဟုတ် `useEffect` hooks တွေရဲ့ အတွင်း။
- Class component တွေရဲ့ lifecycle methods တွေရဲ့ အတွင်း။

ဥပမာ — Effect တစ်ခုထဲမှာ `flushSync` ခေါ်ရင် noop ဖြစ်ပြီး သတိပေးပါလိမ့်မယ်:

```js
import { useEffect } from 'react';
import { flushSync } from 'react-dom';

function MyComponent() {
  useEffect(() => {
    // 🚩 Wrong: calling flushSync inside an effect
    flushSync(() => {
      setSomething(newValue);
    });
  }, []);

  return <div>{/* ... */}</div>;
}
```

ပြုပြင်ဖို့ — ပုံမှန်အားဖြင့် `flushSync` call ကို event တစ်ခုထဲကို ရွှေ့ချင်ပါလိမ့်မယ်:

```js
function handleClick() {
  // ✅ Correct: flushSync in event handlers is safe
  flushSync(() => {
    setSomething(newValue);
  });
}
```

Event တစ်ခုဆီ ရွှေ့ဖို့ ခက်ခဲရင် — `flushSync` ကို microtask တစ်ခုထဲမှာ defer (ရွှေ့ဆိုင်း) လုပ်နိုင်ပါတယ်:

```js
useEffect(() => {
  // ✅ Correct: defer flushSync to a microtask
  queueMicrotask(() => {
    flushSync(() => {
      setSomething(newValue);
    });
  });
}, []);
```

ဒါက လက်ရှိ render ကို အပြီးသတ်ခွင့် ပြုပြီး — updates တွေကို flush ဖို့ နောက်ထပ် synchronous render တစ်ခုကို စီစဉ်ပေးပါတယ်။

> **သတိပြုရန်** — `flushSync` က performance ကို သိသိသာသာ ထိခိုက်စေနိုင်ပေမယ့် — ဒီပုံစံက performance အတွက် ပိုဆိုးပါသေးတယ်။ Microtask တစ်ခုထဲမှာ `flushSync` ကို escape hatch အဖြစ် မခေါ်ခင် — တခြား ရွေးချယ်စရာ အကုန်လုံးကို ဦးစွာ စမ်းကြည့်ပါ။
