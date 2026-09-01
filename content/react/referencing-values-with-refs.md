---
title: "Refs နဲ့ Value များကို ကိုးကားခြင်း"
description: "useRef Hook ကို သုံးပြီး render ပြန်မလုပ်ဘဲ component ရဲ့ အချက်အလက်တွေကို မှတ်သားထားခြင်း — ref vs state ကွာခြားချက်များ၊ refs သုံးနည်းနဲ့ သတိထားရမည့်အချက်များ"
order: 13
source: "https://react.dev/learn/referencing-values-with-refs"
status: translated
updated: 2026-09-01
---

Component တစ်ခုက အချက်အလက်တချို့ကို "မှတ်သား" (remember) ထားစေချင်ပေမယ့် — အဲဒီအချက်အလက်က [render အသစ်တွေကို မစတင်စေချင်ဘူး](/docs/react/state-snapshot)ဆိုရင် — *ref* ကို သုံးနိုင်ပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- Component တစ်ခုဆီ ref တစ်ခုကို ဘယ်လို ထည့်မလဲ
- Ref တစ်ခုရဲ့ တန်ဖိုးကို ဘယ်လို update လုပ်မလဲ
- Refs တွေက state နဲ့ ဘယ်လို ကွာခြားလဲ
- Refs တွေကို ဘယ်လို ဘေးကင်းစွာ သုံးမလဲ

## Component ဆီ Ref တစ်ခု ထည့်ခြင်း

React ကနေ `useRef` Hook ကို import လုပ်ခြင်းဖြင့် သင့် component ဆီ ref တစ်ခု ထည့်နိုင်ပါတယ်:

```js
import { useRef } from 'react';
```

Component ရဲ့ အတွင်းမှာ — `useRef` Hook ကို ခေါ်ပြီး — သင်ကိုးကားချင်တဲ့ ကနဦးတန်ဖိုး (initial value) ကို argument တစ်ခုတည်းအဖြစ် ပေးပါ။ ဥပမာ — ဒီမှာ `0` တန်ဖိုးဆီ ညွှန်တဲ့ ref တစ်ခုပါ:

```js
const ref = useRef(0);
```

`useRef` က ဒီလိုပုံစံ object တစ်ခုကို ပြန်ပေးပါတယ်:

```js
{
  current: 0 // The value you passed to useRef
}
```

> _Diagram:_ `ref` လို့ ရေးထားတဲ့ အိတ်ကပ်တစ်ခုထဲမှာ — `current` လို့ ရေးထားတဲ့ မြှားတစ်ချောင်း ထည့်ထားသလို ပုံဖော်ထားပါတယ်။

အဲဒီ ref ရဲ့ လက်ရှိတန်ဖိုးကို `ref.current` property ကနေ ဝင်ရောက်ကြည့်ရှုနိုင်ပါတယ်။ ဒီတန်ဖိုးက ရည်ရွယ်ချက်ရှိရှိ ပြောင်းလဲနိုင်တဲ့ (mutable) ဖြစ်ပြီး — ဆိုလိုတာက ဖတ်လည်း ရတယ်၊ ရေးလည်း ရပါတယ်။ ဒါက React က ခြေရာခံမထားတဲ့ — သင့် component ရဲ့ လျှို့ဝှက်အိတ်ကပ်လိုမျိုးပါ။ (ဒါကြောင့်လည်း ဒါက React ရဲ့ one-way data flow ကနေ "escape hatch" (လွတ်မြောက်ရာပေါက်) ဖြစ်တာပါ — အဲဒီအကြောင်း အောက်မှာ ဆက်ပြောပါမယ်!)

ဒီမှာ — button တစ်ခုက click တိုင်း `ref.current` ကို တိုးပေးပါတယ်:

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

Ref က number တစ်ခုဆီ ညွှန်နိုင်ပေမယ့် — [state](/docs/react/state-snapshot) လိုပဲ — string တစ်ခု၊ object တစ်ခု၊ function တစ်ခုတောင် ဘာကိုမဆို ညွှန်နိုင်ပါတယ်။ State နဲ့ မတူတာက — ref က ဖတ်လို့ရပြီး ပြုပြင်လို့ရတဲ့ `current` property ပါတဲ့ သာမန် JavaScript object တစ်ခုပါ။

**Component က တိုးလာတိုင်း ပြန်မရှင်း (re-render) မဖြစ်ဘူး** ဆိုတာ သတိပြုပါ။ State လိုပဲ — refs တွေကို re-render တွေကြားမှာ React က ထိန်းသိမ်းပေးပါတယ်။ ဒါပေမယ့် — state ကို set လုပ်တာက component ကို re-render ဖြစ်စေပြီး — ref ကို ပြောင်းလဲတာက re-render ကို မဖြစ်စေပါဘူး!

## ဥပမာ — Stopwatch တစ်ခု တည်ဆောက်ခြင်း

Refs နဲ့ state ကို component တစ်ခုတည်းထဲမှာ ပေါင်းသုံးနိုင်ပါတယ်။ ဥပမာ — အသုံးပြုသူက button နှိပ်ပြီး စတင်နိုင်/ရပ်နိုင်တဲ့ stopwatch တစ်ခု လုပ်ကြည့်ရအောင်။ "Start" ကို နှိပ်ပြီးကတည်းက အချိန် ဘယ်လောက် ကုန်လွန်သွားလဲ ပြသဖို့ — Start button ကို ဘယ်အချိန်မှာ နှိပ်ခဲ့လဲဆိုတာနဲ့ လက်ရှိအချိန်ကို ခြေရာခံထားဖို့ လိုပါတယ်။ **ဒီအချက်အလက်က rendering အတွက် သုံးတာမို့ — state ထဲမှာ ထားပါမယ်:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

အသုံးပြုသူက "Start" ကို နှိပ်တဲ့အခါ — 10 milliseconds တိုင်း အချိန်ကို update လုပ်ဖို့ [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) ကို သုံးပါမယ်:

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Start counting.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Update the current time every 10ms.
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
    </>
  );
}
```

"Stop" button ကို နှိပ်လိုက်တဲ့အခါ — `now` state variable ကို update လုပ်နေတာ ရပ်သွားအောင် — လက်ရှိ interval ကို ပယ်ဖျက်ဖို့ လိုပါတယ်။ [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) ကို ခေါ်ခြင်းဖြင့် ဒါကို လုပ်နိုင်ပါတယ် — ဒါပေမယ့် — Start နှိပ်တုန်းက `setInterval` ခေါ်မှု ပြန်ပေးခဲ့တဲ့ interval ID ကို ပေးဖို့ လိုပါတယ်။ Interval ID ကို တစ်နေရာရာမှာ သိမ်းထားဖို့ လိုပါတယ်။ **Interval ID က rendering အတွက် မသုံးတာမို့ — ref ထဲမှာ သိမ်းထားလို့ ရပါတယ်:**

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

အချက်အလက်တစ်ခုကို rendering အတွက် သုံးတယ်ဆိုရင် — state ထဲမှာ သိမ်းပါ။ အချက်အလက်တစ်ခုကို event handler တွေကပဲ လိုအပ်ပြီး — အဲဒါ ပြောင်းတာက re-render မလိုအပ်ဘူးဆိုရင် — ref သုံးတာက ပိုပြီး ထိရောက်ပါတယ်။

## Refs နဲ့ State ရဲ့ ကွာခြားချက်များ

Refs တွေက state ထက် "တင်းကျပ်မှု" နည်းတယ်လို့ သင်ထင်နေလိမ့်မယ် — ဥပမာ — state setter function ကို အမြဲ သုံးရမယ့်အစား သူတို့ကို mutate လုပ်လို့ ရတာမျိုးပေါ့။ ဒါပေမယ့် — အများစုမှာတော့ သင်က state ကိုပဲ သုံးချင်ပါလိမ့်မယ်။ Refs တွေက မကြာခဏ မလိုအပ်တဲ့ "escape hatch" တစ်ခုပါ။ State နဲ့ refs တွေ ဘယ်လို ကွာခြားလဲဆိုတာ ဒီမှာ ကြည့်ပါ:

| refs | state |
| --- | --- |
| `useRef(initialValue)` က `{ current: initialValue }` ကို ပြန်ပေးတယ် | `useState(initialValue)` က state variable ရဲ့ လက်ရှိတန်ဖိုးနဲ့ state setter function (`[value, setValue]`) ကို ပြန်ပေးတယ် |
| ပြောင်းလိုက်တာက re-render ကို မဖြစ်စေဘူး | ပြောင်းလိုက်တာက re-render ကို ဖြစ်စေတယ် |
| Mutable — rendering လုပ်ငန်းစဉ် ပြင်ပမှာ `current` ရဲ့ တန်ဖိုးကို ပြုပြင်/update လုပ်လို့ ရတယ် | "Immutable" — re-render တစ်ခုကို queue တင်ဖို့ state variable တွေကို ပြုပြင်ရာမှာ state setting function ကိုပဲ သုံးရမယ် |
| Rendering အတွင်း `current` တန်ဖိုးကို ဖတ်လည်း မရဘူး၊ ရေးလည်း မရဘူး | State ကို ဘယ်အချိန်မဆို ဖတ်လို့ ရတယ်။ ဒါပေမယ့် — render တစ်ခုချင်းစီမှာ ပြောင်းလဲမသွားတဲ့ state ရဲ့ [snapshot](/docs/react/state-snapshot) တစ်ခုစီ ရှိတယ် |

ဒီမှာ state နဲ့ implement လုပ်ထားတဲ့ counter button တစ်ခုပါ:

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

`count` တန်ဖိုးကို screen ပေါ်မှာ ပြတာမို့ — အဲဒါအတွက် state တန်ဖိုး သုံးတာ အဓိပ္ပာယ်ရှိပါတယ်။ `setCount()` နဲ့ counter ရဲ့ တန်ဖိုးကို set လုပ်တဲ့အခါ — React က component ကို re-render လုပ်ပြီး — screen က count အသစ်ကို ထင်ဟပ်အောင် update ဖြစ်ပါတယ်။

ဒါကို ref နဲ့ implement လုပ်ကြည့်ရင် — React က component ကို ဘယ်တော့မှ re-render လုပ်မှာ မဟုတ်လို့ — count ပြောင်းတာကို ဘယ်တော့မှ မမြင်ရပါဘူး! ဒီ button ကို နှိပ်တာက **သူ့ရဲ့ text ကို update မလုပ်ဘူး** ဆိုတာ ကြည့်ပါ:

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // This doesn't re-render the component!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

ဒါကြောင့်ပဲ — rendering အတွင်း `ref.current` ကို ဖတ်တာက မယုံကြည်ရလောက်တဲ့ code တွေ ဖြစ်စေတာပါ။ အဲဒါ လိုအပ်ရင် state ကိုပဲ သုံးပါ။

#### useRef က အတွင်းမှာ ဘယ်လို အလုပ်လုပ်လဲ

`useState` ရော `useRef` ရော နှစ်ခုလုံးက React က ပေးတာဆိုပေမယ့် — အခြေခံအားဖြင့် — `useRef` ကို `useState` ရဲ့ *အပေါ်မှာ* implement လုပ်လို့ ရပါတယ်။ React ရဲ့ အတွင်းမှာ — `useRef` ကို ဒီလို implement လုပ်ထားတယ်လို့ စိတ်ကူးကြည့်ပါ:

```js
// Inside of React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

ပထမဆုံး render အတွင်း — `useRef` က `{ current: initialValue }` ကို ပြန်ပေးပါတယ်။ ဒီ object ကို React က သိမ်းထားလို့ — နောက် render တွေမှာလည်း object တစ်ခုတည်း ပြန်ပေးပါလိမ့်မယ်။ ဒီဥပမာထဲမှာ state setter ကို မသုံးတာ သတိပြုပါ။ အဲဒါ မလိုအပ်ပါဘူး — ဘာလို့လဲဆိုတော့ `useRef` က အမြဲတမ်း object တစ်ခုတည်းကိုပဲ ပြန်ပေးဖို့ လိုလို့ပါ!

React က `useRef` ရဲ့ built-in version တစ်ခုကို ပေးထားပါတယ် — ဘာလို့လဲဆိုတော့ လက်တွေ့မှာ မကြာခဏ သုံးရလို့ပါ။ ဒါပေမယ့် — setter မပါတဲ့ သာမန် state variable တစ်ခုလို့ သင် မှတ်ယူနိုင်ပါတယ်။ Object-oriented programming နဲ့ ရင်းနှီးရင် — refs တွေက instance fields တွေကို သတိရစေနိုင်ပါတယ် — ဒါပေမယ့် `this.something` အစား `somethingRef.current` လို့ ရေးရပါတယ်။

## Refs တွေကို ဘယ်အချိန် သုံးမလဲ

ပုံမှန်အားဖြင့် — သင့် component က React ရဲ့ "အပြင်ဘက်ကို ထွက်" ပြီး external API တွေနဲ့ ဆက်သွယ်ဖို့ လိုတဲ့အခါ — များသောအားဖြင့် component ရဲ့ အသွင်အပြင်ကို မထိခိုက်စေတဲ့ browser API တစ်ခုနဲ့ ဆက်သွယ်ဖို့ လိုတဲ့အခါ — ref ကို သုံးပါလိမ့်မယ်။ ဒီလို ရှားပါးတဲ့ အခြေအနေ အနည်းငယ် ရှိပါတယ်:

- [Timeout IDs](https://developer.mozilla.org/docs/Web/API/setTimeout) တွေကို သိမ်းဆည်းခြင်း
- [DOM elements](https://developer.mozilla.org/docs/Web/API/Element) တွေကို သိမ်းဆည်းခြင်းနဲ့ ပြုလုပ်ခြင်း — [နောက်စာမျက်နှာ](/docs/react/manipulating-the-dom-with-refs)မှာ ဆက်လေ့လာပါမယ်
- JSX တွက်ချက်ဖို့ မလိုအပ်တဲ့ တခြား object တွေကို သိမ်းဆည်းခြင်း

သင့် component က တန်ဖိုးတစ်ခုကို သိမ်းထားဖို့ လိုပေမယ့် — အဲဒါက rendering logic ကို မထိခိုက်စေဘူးဆိုရင် — refs ကို ရွေးပါ။

## Refs အတွက် အကောင်းဆုံး အလေ့အကျင့်များ

ဒီမူတွေကို လိုက်နာခြင်းက သင့် component တွေကို ပိုမို ခန့်မှန်းနိုင်စေပါလိမ့်မယ်:

- **Refs တွေကို escape hatch အဖြစ်ပဲ သဘောထားပါ။** External systems တွေ ဒါမှမဟုတ် browser APIs တွေနဲ့ အလုပ်လုပ်တဲ့အခါ refs တွေက အသုံးဝင်ပါတယ်။ သင့် application ရဲ့ logic နဲ့ data flow အများစုက refs တွေပေါ် မှီခိုနေရင် — သင့်နည်းလမ်းကို ပြန်စဉ်းစားကြည့်သင့်ပါတယ်။
- **Rendering အတွင်း `ref.current` ကို ဖတ်တာ/ရေးတာ မလုပ်ပါနဲ့။** တချို့အချက်အလက်တွေ rendering အတွင်း လိုအပ်ရင် — [state](/docs/react/state-snapshot) ကိုပဲ သုံးပါ။ React က `ref.current` ဘယ်အချိန် ပြောင်းလဲလဲ မသိတာမို့ — rendering အတွင်း ဖတ်ရုံနဲ့တောင် သင့် component ရဲ့ အပြုအမူကို ခန့်မှန်းရခက်စေပါတယ်။ (ဒီလိုမျိုး `if (!ref.current) ref.current = new Thing()` code ကပဲ ချွင်းချက်ပါ — ပထမဆုံး render အတွင်းမှာ ref ကို တစ်ခါတည်း set လုပ်တာမျိုးပါ။)

React state ရဲ့ ကန့်သတ်ချက်တွေက refs တွေကို သက်ရောက်မှု မရှိပါဘူး။ ဥပမာ — state က [render တိုင်း snapshot](/docs/react/state-snapshot) လိုမျိုး ပြုမူပြီး — [synchronously update မဖြစ်ဘူး](/docs/react/queueing-a-series-of-state-updates)ပေါ့။ ဒါပေမယ့် — ref တစ်ခုရဲ့ current တန်ဖိုးကို mutate လုပ်တဲ့အခါ — အဲဒါ ချက်ချင်း ပြောင်းသွားပါတယ်:

```js
ref.current = 5;
console.log(ref.current); // 5
```

ဒါက **ref ကိုယ်တိုင်က သာမန် JavaScript object တစ်ခု** ဖြစ်လို့ပါ — ဒါကြောင့် သာမန် object တစ်ခုလိုပဲ ပြုမူပါတယ်။

Ref တစ်ခုနဲ့ အလုပ်လုပ်တဲ့အခါ — [mutation ရှောင်ခြင်း](/docs/react/updating-objects-in-state)အတွက်လည်း စိုးရိမ်စရာ မလိုပါဘူး။ သင်ပြုပြင်နေတဲ့ object က rendering အတွက် မသုံးသရွေ့ — React က ref ဒါမှမဟုတ် သူ့ရဲ့ အကြောင်းအရာတွေနဲ့ သင်ဘာလုပ်လုပ်ဂရုမစိုက်ပါဘူး။

## Refs နဲ့ DOM

Ref တစ်ခုကို ဘယ်တန်ဖိုးမဆိုဆီ ညွှန်နိုင်ပါတယ်။ ဒါပေမယ့် — ref အတွက် အသုံးအများဆုံးက — DOM element တစ်ခုကို ဝင်ရောက်ဖို့ပါ။ ဥပမာ — input တစ်ခုကို programmatically focus လုပ်ချင်တဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။ JSX ထဲက `ref` attribute တစ်ခုဆီ `<div ref={myRef}>` လိုမျိုး ref တစ်ခုကို ပေးလိုက်တဲ့အခါ — React က သက်ဆိုင်ရာ DOM element ကို `myRef.current` ထဲ ထည့်ပေးပါလိမ့်မယ်။ Element က DOM ကနေ ဖယ်ရှားလိုက်တာနဲ့ — React က `myRef.current` ကို `null` ဖြစ်အောင် update လုပ်ပါလိမ့်မယ်။ ဒီအကြောင်း အသေးစိတ်ကို [Manipulating the DOM with Refs](/docs/react/manipulating-the-dom-with-refs) မှာ ဆက်ဖတ်နိုင်ပါတယ်။

## အကျဉ်းချုပ်

- Refs တွေက rendering အတွက် မသုံးတဲ့ တန်ဖိုးတွေကို ကိုင်ထားဖို့ escape hatch တစ်ခုပါ။ မကြာခဏတော့ မလိုအပ်ပါဘူး။
- Ref တစ်ခုက `current` လို့ ခေါ်တဲ့ property တစ်ခုတည်း ပါတဲ့ သာမန် JavaScript object တစ်ခုပါ — ဖတ်လည်း ရတယ်၊ set လည်း လုပ်လို့ ရတယ်။
- `useRef` Hook ကို ခေါ်ခြင်းဖြင့် React ကို ref တစ်ခု ပေးဖို့ တောင်းဆိုနိုင်ပါတယ်။
- State လိုပဲ — refs တွေက component တစ်ခုရဲ့ re-render တွေကြားမှာ အချက်အလက်တွေကို ထိန်းသိမ်းနိုင်စေပါတယ်။
- State နဲ့ မတူတာက — ref ရဲ့ `current` တန်ဖိုးကို set လုပ်တာက re-render ကို မဖြစ်စေပါဘူး။
- Rendering အတွင်း `ref.current` ကို ဖတ်တာ/ရေးတာ မလုပ်ပါနဲ့ — ဒါက သင့် component ကို ခန့်မှန်းရခက်စေပါတယ်။

## စိန်ခေါ်မှုများ (Challenges)

### ပျက်နေတဲ့ Chat Input တစ်ခုကို ပြုပြင်ခြင်း

Message တစ်ခု ရိုက်ပြီး "Send" ကို နှိပ်ပါ။ "Sent!" alert ကို မမြင်ရခင် သုံးစက္ကန့် နှောင့်နှေးနေတာ သတိထားမိပါလိမ့်မယ်။ ဒီနှောင့်နှေးချိန်အတွင်း — "Undo" button တစ်ခု တွေ့ရပါမယ်။ အဲဒါကို နှိပ်ကြည့်ပါ။ ဒီ "Undo" button က "Sent!" message ပေါ်မလာအောင် တားဆီးဖို့ ရည်ရွယ်ထားပါတယ်။ `handleSend` အတွင်း သိမ်းထားတဲ့ timeout ID အတွက် [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) ကို ခေါ်ခြင်းဖြင့် ဒါကို လုပ်ပါတယ်။ ဒါပေမယ့် — "Undo" နှိပ်ပြီးတာတောင် — "Sent!" message က ပေါ်နေဆဲပါ။ ဘာကြောင့် အလုပ်မလုပ်တာလဲ ရှာပြီး — ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** `let timeoutID` လိုမျိုး သာမန် variable တွေက re-render တွေကြားမှာ "မရှင်သန်" ပါဘူး — ဘာလို့လဲဆိုတော့ render တိုင်းက သင့် component (နဲ့ သူ့ရဲ့ variable တွေ) ကို အစကနေ ပြန်စတင်လို့ပါ။ Timeout ID ကို တစ်ခြားနေရာမှာ သိမ်းထားသင့်လား?

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

#### အဖြေ

သင့် component က re-render ဖြစ်တိုင်း (ဥပမာ — state set လုပ်တဲ့အခါ) — local variable တွေအားလုံး အစကနေ ပြန်စတင်ပါတယ်။ ဒါကြောင့် — timeout ID ကို `timeoutID` လိုမျိုး local variable တစ်ခုထဲ သိမ်းထားပြီး — နောက်ထပ် event handler တစ်ခုက အဲဒါကို နောင်မှာ "မြင်" မယ်လို့ မျှော်လင့်လို့ မရပါဘူး။ အဲဒီအစား — React က render တွေကြားမှာ ထိန်းသိမ်းပေးမယ့် ref တစ်ခုထဲမှာ သိမ်းပါ။

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

### Re-render မဖြစ်တဲ့ Component တစ်ခုကို ပြုပြင်ခြင်း

ဒီ button က "On" နဲ့ "Off" ကြား ပြသမှု ပြောင်းဖို့ ရည်ရွယ်ထားပါတယ်။ ဒါပေမယ့် — အမြဲတမ်း "Off" ပဲ ပြနေပါတယ်။ ဒီ code မှာ ဘာမှားနေလဲ? ပြုပြင်ပါ။

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

#### အဖြေ

ဒီဥပမာမှာ — rendering output ကို တွက်ချက်ဖို့ ref တစ်ခုရဲ့ လက်ရှိတန်ဖိုးကို သုံးထားပါတယ်: `{isOnRef.current ? 'On' : 'Off'}` ။ ဒါက ဒီအချက်အလက်က ref ထဲမှာ မထားသင့်ဘဲ — state ထဲမှာပဲ ထားသင့်တယ်ဆိုတဲ့ အရိပ်အယောင်ပါ။ ပြုပြင်ဖို့ — ref ကို ဖယ်ရှားပြီး state ကိုပဲ သုံးပါ:

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

### Debouncing ကို ပြုပြင်ခြင်း

ဒီဥပမာမှာ — button click handler တွေအားလုံးက ["debounced"](https://kettanaito.com/blog/debounce-vs-throttle) လုပ်ထားပါတယ်။ ဒါက ဘာကို ဆိုလိုလဲ ကြည့်ဖို့ — button တစ်ခုကို နှိပ်ကြည့်ပါ။ Message က တစ်စက္ကန့် နောက်ကျမှ ပေါ်လာတာ သတိထားမိပါလိမ့်မယ်။ Message ကို စောင့်နေတုန်း button ကို ထပ်နှိပ်ရင် — timer က ပြန်စပါတယ်။ ဒါကြောင့် — button တစ်ခုတည်းကို အမြန်အများကြီး နှိပ်နေရင် — သင်နှိပ်တာ ရပ်ပြီး တစ်စက္ကန့် *ကြာမှ* message ပေါ်ပါလိမ့်မယ်။ Debouncing က အသုံးပြုသူက "လုပ်ဆောင်ချက်တွေ ရပ်တည့်သွားတဲ့အထိ" လုပ်ဆောင်ချက်တစ်ခုကို နှောင့်နှေးစေနိုင်ပါတယ်။

ဒီဥပမာက အလုပ်လုပ်ပေမယ့် — ရည်ရွယ်ထားတဲ့အတိုင်း လုံးဝ မဟုတ်ပါဘူး။ Button တွေက တစ်ခုနဲ့တစ်ခု အမှီအခိုကင်းမနေပါဘူး။ ပြဿနာကို ကြည့်ဖို့ — button တစ်ခုကို နှိပ်ပြီး — ချက်ချင်း နောက် button တစ်ခုကို နှိပ်ပါ။ နှောင့်နှေးပြီးတဲ့နောက်မှာ — button နှစ်ခုလုံးရဲ့ message တွေ ပေါ်လာမယ်လို့ သင်မျှော်လင့်ပါတယ်။ ဒါပေမယ့် — နောက်ဆုံး button ရဲ့ message ပဲ ပေါ်ပါတယ်။ ပထမ button ရဲ့ message က ပျောက်သွားပါတယ်။

Button တွေ ဘာကြောင့် တစ်ခုနဲ့တစ်ခု အနှောင့်အယှက် ဖြစ်နေတာလဲ? ပြဿနာကို ရှာပြီး ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** နောက်ဆုံး timeout ID variable ကို `DebouncedButton` component တွေအားလုံးကြားမှာ မျှဝေသုံးနေပါတယ်။ ဒါကြောင့် — button တစ်ခုကို နှိပ်တာက တစ်ခြား button ရဲ့ timeout ကို ပြန်စေတာပါ။ Button တစ်ခုချင်းစီအတွက် timeout ID သီးခြားစီ သိမ်းထားလို့ ရမလား?

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```
```css
button { display: block; margin: 10px; }
```

#### အဖြေ

`timeoutID` လိုမျိုး variable တစ်ခုကို component တွေအားလုံးကြားမှာ မျှဝေသုံးနေပါတယ်။ ဒါကြောင့် — ဒုတိယ button ကို နှိပ်တာက ပထမ button ရဲ့ ဆိုင်းငံ့ထားတဲ့ timeout ကို ပြန်စေတာပါ။ ပြုပြင်ဖို့ — timeout ကို ref တစ်ခုထဲမှာ သိမ်းနိုင်ပါတယ်။ Button တစ်ခုချင်းစီက ကိုယ်ပိုင် ref ရပါလိမ့်မယ် — ဒါကြောင့် သူတို့ တစ်ခုနဲ့တစ်ခု မတိုက်မိတော့ပါဘူး။ Button နှစ်ခုကို အမြန်နှိပ်ရင် — message နှစ်ခုလုံး ပေါ်လာတာ သတိပြုပါ။

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```
```css
button { display: block; margin: 10px; }
```

### နောက်ဆုံး State ကို ဖတ်ခြင်း

ဒီဥပမာမှာ — "Send" ကို နှိပ်ပြီးတဲ့အခါ — message ပြသမခင် နှောင့်နှေးမှု အနည်းငယ် ရှိပါတယ်။ "hello" လို့ ရိုက်ပြီး — Send နှိပ်ပြီး — input ကို ချက်ချင်း ပြန်ပြင်ကြည့်ပါ။ သင့် ပြင်ဆင်မှုတွေ ရှိပေမယ့် — alert က "hello" (button နှိပ်လိုက်တဲ့ [အချိန်က](/docs/react/state-snapshot) state ရဲ့ တန်ဖိုး) ကိုပဲ ပြနေပါလိမ့်မယ်။

ပုံမှန်အားဖြင့် — ဒီအပြုအမူက app တစ်ခုမှာ သင်လိုချင်တဲ့အတိုင်းပါ။ ဒါပေမယ့် — asynchronous code တစ်ခုက state တချို့ရဲ့ *နောက်ဆုံး* version ကို ဖတ်စေချင်တဲ့ ရံဖန်ရံခါ အခြေအနေတွေ ရှိနိုင်ပါတယ်။ Alert က click လုပ်ချိန်က တန်ဖိုး မဟုတ်ဘဲ — *လက်ရှိ* input text ကို ပြစေဖို့ နည်းလမ်းတစ်ခု စဉ်းစားနိုင်မလား?

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

#### အဖြေ

State က [snapshot တစ်ခုလို](/docs/react/state-snapshot) အလုပ်လုပ်တာမို့ — timeout လိုမျိုး asynchronous operation တစ်ခုကနေ နောက်ဆုံး state ကို ဖတ်လို့ မရပါဘူး။ ဒါပေမယ့် — input text ရဲ့ နောက်ဆုံးဗားရှင်းကို ref တစ်ခုထဲမှာ သိမ်းထားနိုင်ပါတယ်။ Ref တစ်ခုက mutable ဖြစ်လို့ — `current` property ကို ဘယ်အချိန်မဆို ဖတ်နိုင်ပါတယ်။ လက်ရှိ text ကို rendering အတွက်လည်း သုံးတာမို့ — ဒီဥပမာမှာ သင်က state variable တစ်ခု (rendering အတွက်) *ရော* — ref တစ်ခု (timeout ထဲမှာ ဖတ်ဖို့) *ပါ* နှစ်ခုလုံး လိုပါလိမ့်မယ်။ Ref ရဲ့ current တန်ဖိုးကို ကိုယ်တိုင် update လုပ်ဖို့ လိုပါလိမ့်မယ်။

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```
