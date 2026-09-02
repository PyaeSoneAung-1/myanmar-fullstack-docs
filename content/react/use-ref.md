---
title: "useRef"
description: "Rendering အတွက် မလိုတဲ့ value တွေကို ကိုးကားနိုင်တဲ့ React Hook — mutable ref object နဲ့ current property များ၊ re-render မဖြစ်စေခြင်း၊ DOM node တွေကို ကိုင်တွယ်ခြင်း၊ state နဲ့ ကွာခြားချက်များ"
order: 46
source: "https://react.dev/reference/react/useRef"
status: translated
updated: 2026-09-02
---

`useRef` ဆိုတာ — rendering အတွက် မလိုအပ်တဲ့ value တစ်ခုကို ကိုးကားနိုင်စေတဲ့ React Hook တစ်ခုပါ။

```js
const ref = useRef(initialValue)
```

## ရည်ညွှန်းချက် (Reference)

### `useRef(initialValue)`

[ref](/docs/react/referencing-values-with-refs) တစ်ခုကို ကြေညာဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useRef` ကို ခေါ်ပါတယ်:

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

**Parameters (ပါရာမီတာများ)**

- `initialValue`: ref object ရဲ့ `current` property ကို ကနဦးမှာ ထားချင်တဲ့ တန်ဖိုး။ Type မရွေး ဖြစ်နိုင်ပြီး — ကနဦး render ပြီးတဲ့နောက်မှာတော့ ဒီ argument ကို လျစ်လျူရှုပါတယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

`useRef` က property တစ်ခုတည်း ပါတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်:

- `current`: ကနဦးမှာ သင်ပေးလိုက်တဲ့ `initialValue` လို့ သတ်မှတ်ထားပြီး — နောက်ပိုင်း တခြားတန်ဖိုးတစ်ခုခုကို ပြောင်းသတ်မှတ်လို့ရပါတယ်။ ဒီ ref object ကို JSX node တစ်ခုရဲ့ `ref` attribute အဖြစ် React ဆီ ပေးလိုက်ရင် — React က သူ့ရဲ့ `current` property ကို set လုပ်ပေးပါတယ်။

နောက် render တွေမှာ — `useRef` က object တစ်ခုတည်းကိုပဲ ပြန်ပေးပါတယ်။ ဆိုလိုတာက — render တိုင်းမှာ ref object အသစ် ဖန်တီးမခံရဘဲ — component ရဲ့ lifetime တစ်လျှောက်လုံး `current` property ကို ဖတ်/ပြင်လို့ရတဲ့ တည်မြဲတဲ့ container တစ်ခုကို ရရှိတာပါ။ ဒါကြောင့်ပဲ — event handler တစ်ခုထဲမှာ ref တစ်ခုထဲ သိမ်းထားခဲ့တဲ့ တန်ဖိုးကို — re-render အကြိမ်ပေါင်းများစွာ ဖြတ်ပြီးမှတောင် — ပြန်ဖတ်လို့ရတာပါ။

**Caveats (သတိပြုရမည့်အချက်များ)**

- `ref.current` property ကို mutate လုပ်လို့ရပါတယ် — state နဲ့ မတူဘဲ ဒါက mutable ပါ။ ဒါပေမယ့် — သူ့မှာ rendering အတွက် သုံးနေတဲ့ object တစ်ခု (ဥပမာ — သင့် state ရဲ့ အပိုင်းတစ်ပိုင်း) ရှိနေရင် — အဲဒီ object ကိုတော့ mutate မလုပ်သင့်ပါဘူး။
- `ref.current` property ကို ပြောင်းလိုက်ရင် — React က သင့် component ကို re-render မလုပ်ပါဘူး။ Ref က သာမန် JavaScript object တစ်ခုမို့ — ဘယ်အချိန် ပြောင်းလဲသွားလဲ React က မသိပါဘူး။
- Rendering အတွင်းမှာ `ref.current` ကို ရေး*တာ* ရော ဖတ်*တာ* ရော — initialization မှလွဲလို့ မလုပ်ရပါဘူး။ ဒါက သင့် component ရဲ့ အပြုအမူကို ခန့်မှန်းရခက်စေပါတယ်။
- Strict Mode မှာ — React က မရည်ရွယ်ဘဲ ဖြစ်တဲ့ impurities တွေ ရှာတွေ့စေဖို့ component function ကို **နှစ်ကြိမ် ခေါ်ပါတယ်** (development မှာပဲ ဖြစ်ပြီး production ကို မထိခိုက်ပါဘူး)။ Ref object တစ်ခုချင်းစီကို နှစ်ကြိမ် ဖန်တီးပေမယ့် — version တစ်ခုက ပစ်ပယ်ခံရပါတယ်။ Component function က pure ဖြစ်ရင် — အပြုအမူကို မထိခိုက်ပါဘူး။

## အသုံးပြုပုံ (Usage)

### Value တစ်ခုကို Ref နဲ့ ကိုးကားခြင်း

`useRef` က `current` property တစ်ခုတည်း ပါတဲ့ ref object တစ်ခုကို ပြန်ပေးပြီး — `current` က သင်ပေးလိုက်တဲ့ initial value လို့ စသတ်မှတ်ပါတယ်။ နောက် render တွေမှာ — `useRef` က object တစ်ခုတည်းကိုပဲ ပြန်ပေးပြီး — သူ့ရဲ့ `current` property ကို ပြောင်းပြီး အချက်အလက် သိမ်းဆည်း၊ နောက်မှ ပြန်ဖတ်နိုင်ပါတယ်။ ဒါက [state](/docs/react/state-snapshot) နဲ့ တူတယ်လို့ ထင်ရပေမယ့် — အရေးကြီးတဲ့ ကွာခြားချက် တစ်ခု ရှိပါတယ်:

**Ref တစ်ခုကို ပြောင်းလဲတာက re-render တစ်ခုကို မဖြစ်စေပါဘူး။** ဒါကြောင့် — component ရဲ့ visual output ကို မထိခိုက်စေတဲ့ အချက်အလက်တွေ သိမ်းဖို့ refs တွေက အကောင်းဆုံးပါ။ ဥပမာ — [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) တစ်ခုကို သိမ်းပြီး နောက်မှ ပြန်ယူဖို့ ref တစ်ခုထဲမှာ ထားနိုင်ပါတယ်:

```js
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

နောက်ပိုင်း ဒီ interval ID ကို ref ကနေ ပြန်ဖတ်ပြီး [interval ကို ရပ်တန့်](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) နိုင်ပါတယ်:

```js
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

Ref တစ်ခုကို သုံးခြင်းဖြင့် သင်သေချာစေတာတွေက —

- Re-render တွေကြားမှာ **အချက်အလက်တွေကို သိမ်းထားနိုင်တယ်** (render တိုင်း ပြန်စနေတဲ့ သာမန် variables တွေနဲ့ မတူဘဲ)။
- ပြောင်းလဲတာက **re-render တစ်ခုကို မဖြစ်စေဘူး** (re-render ဖြစ်စေတဲ့ state variables တွေနဲ့ မတူဘဲ)။
- **အချက်အလက်က component copy တစ်ခုချင်းစီအတွက် သီးသန့်ပါ** (အပြင်မှာ ရှိတဲ့ variables တွေလို မျှဝေမခံရဘဲ)။

Ref ပြောင်းတာက re-render မဖြစ်စေတာမို့ — screen ပေါ်မှာ ပြချင်တဲ့ အချက်အလက်တွေအတွက်တော့ မသင့်တော်ပါဘူး — အဲဒါတွေအတွက် state ကို သုံးပါ။ ဥပမာ — interval ID လိုမျိုး ပြင်ပက system တစ်ခုကို ထိန်းချုပ်ဖို့ သုံးတဲ့ handle တွေ၊ animation frame IDs တွေ၊ timeout IDs တွေလိုမျိုး — rendering နဲ့ မဆိုင်တဲ့ အချက်အလက်တွေက refs အတွက် သင့်တော်ပါတယ်။ Ref ကို အသုံးပြုခြင်းက event handlers တွေကြားမှာ တန်ဖိုးတွေ မျှဝေဖို့လည်း ကူညီပေးပါတယ် — handler တစ်ခုက ref ထဲ သိမ်းလိုက်တဲ့ တန်ဖိုးကို — နောက် handler တစ်ခုက ဖတ်နိုင်ပြီး — render တွေကြားမှာ function တွေ ပြန်ဖန်တီးခံရတာနဲ့ ဆက်စပ်နေတဲ့ "stale closure" ပြဿနာမျိုး မရှိဘဲ — အမြဲတမ်း နောက်ဆုံးတန်ဖိုးကိုပဲ ဖတ်ရပါတယ်။ (Rendering ရဲ့ ရလဒ်အနေနဲ့ မဟုတ်ဘဲ — သိမ်းထားတဲ့ အချက်အလက်ကို ပြန်ဖတ်ချင်တဲ့အခါ refs က သုံးတဲ့နေရာပါ။)

#### ဥပမာ — Click Counter

ဒီ component က button ကို ဘယ်နှစ်ခါ နှိပ်ပြီးပြီဆိုတာ ခြေရာခံဖို့ ref တစ်ခုကို သုံးပါတယ်။ Click count ကို event handler ထဲမှာပဲ ဖတ်/ရေး နေတာမို့ — state အစား ref သုံးတာ ရပါတယ်:

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

`{ref.current}` ကို JSX ထဲမှာ ပြမယ်ဆိုရင် — click လုပ်တဲ့အခါ နံပါတ်က update မဖြစ်ပါဘူး — `ref.current` ကို set လုပ်တာက re-render ကို မဖြစ်စေလို့ပါ။ Rendering အတွက် သုံးတဲ့ အချက်အလက်ဆိုရင် state ဖြစ်သင့်ပါတယ်။

#### ဥပမာ — Stopwatch

ဒီဥပမာက state နဲ့ refs တွေကို ပေါင်းသုံးပါတယ်။ `startTime` နဲ့ `now` နှစ်ခုလုံးက rendering အတွက် သုံးတာမို့ state variables တွေပါ။ ဒါပေမယ့် — button နှိပ်တဲ့အခါ interval ရပ်နိုင်ဖို့ interval ID တစ်ခုကိုလည်း ကိုင်ထားဖို့ လိုပါတယ် — interval ID က rendering အတွက် မဟုတ်တာမို့ — ref တစ်ခုထဲမှာ ထားပြီး ကိုယ်တိုင် update လုပ်တာ သင့်လျော်ပါတယ်:

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

> **သတိပြုရန် — Rendering အတွင်းမှာ `ref.current` ကို ရေး*တာ* ရော ဖတ်*တာ* ရော မလုပ်ပါနဲ့:**
>
> React က component body ကို [pure function တစ်ခုလို](/docs/react/keeping-components-pure) ပြုမူစေချင်ပါတယ် — inputs (props, state, context) တွေ တူနေရင် JSX အတိအကျ တူတာကိုပဲ ပြန်ပေးရပြီး — ခေါ်တဲ့ အစီအစဉ်/argument တွေ ကွာတာက တခြားခေါ်မှုတွေရဲ့ ရလဒ်ကို မထိခိုက်စေရပါဘူး။ Rendering အတွင်းမှာ ref ကို ဖတ်/ရေး လုပ်တာက ဒီမျှော်လင့်ချက်တွေကို ချိုးဖောက်ပါတယ်:
>
> ```js
> function MyComponent() {
>   // ...
>   // 🚩 Don't write a ref during rendering
>   myRef.current = 123;
>   // ...
>   // 🚩 Don't read a ref during rendering
>   return <h1>{myOtherRef.current}</h1>;
> }
> ```
>
> Refs တွေကို **event handlers တွေ ဒါမှမဟုတ် effects တွေကနေပဲ** ဖတ်/ရေး လုပ်ပါ:
>
> ```js
> function MyComponent() {
>   // ...
>   useEffect(() => {
>     // ✅ You can read or write refs in effects
>     myRef.current = 123;
>   });
>   // ...
>   function handleClick() {
>     // ✅ You can read or write refs in event handlers
>     doSomething(myOtherRef.current);
>   }
>   // ...
> }
> ```
>
> Rendering အတွင်းမှာ တစ်ခုခုကို ဖတ်/ရေး လုပ်ဖို့ *လိုအပ်*ရင်တော့ — state ကို သုံးပါ။ ဒီစည်းမျဉ်းတွေကို ချိုးဖောက်ရင် component က အလုပ်လုပ်နေနိုင်ပေမယ့် — React ရဲ့ feature အသစ်တွေက ဒီမျှော်လင့်ချက်တွေပေါ်မှာ မှီခိုနေပါလိမ့်မယ်။

### Ref တစ်ခုနဲ့ DOM ကို ကိုင်တွယ်ခြင်း

Ref တစ်ခုကို [DOM](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) ကို ကိုင်တွယ်ဖို့ သုံးတာ အထူးသဖြင့် အသုံးများပါတယ် — React က ဒါကို built-in ထောက်ပံ့ပေးပါတယ်။ အရင်ဆုံး initial value `null` နဲ့ ref object တစ်ခု ကြေညာပါ:

```js
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

ပြီးရင် သင့် ref object ကို ကိုင်တွယ်ချင်တဲ့ DOM node ရဲ့ JSX ဆီ `ref` attribute အဖြစ် ပေးပါ:

```js
  // ...
  return <input ref={inputRef} />;
```

React က DOM node ကို ဖန်တီးပြီး screen ပေါ် တင်လိုက်တာနဲ့ — ref object ရဲ့ `current` property ကို အဲဒီ DOM node လို့ set လုပ်ပေးပါတယ်။ အခု `<input>` ရဲ့ DOM node ကို ဝင်ရောက်ပြီး [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) လို methods တွေ ခေါ်နိုင်ပါတယ်:

```js
  function handleClick() {
    inputRef.current.focus();
  }
```

Node ကို screen ကနေ ဖယ်ရှားလိုက်တဲ့အခါ — React က `current` property ကို `null` အဖြစ် ပြန်သတ်မှတ်ပေးပါတယ်။ ဒါကြောင့် — `ref.current` ကို node ချိတ်ထားတဲ့အချိန်မှပဲ ဝင်ရောက်သုံးသင့်ပါတယ်: React က DOM node ကို screen ပေါ် တင်ပြီးမှသာ ref ကို ဖြည့်ပေးတာမို့ — rendering ရဲ့ ကနဦးအဆင့်တွေမှာ `ref.current` က `null` ဖြစ်နေတတ်ပါတယ်။ DOM node ကို ဝင်ရောက်ကြည့်ရှုရမယ့် ပုံမှန် အချိန်တွေက — [commit](/docs/react/render-and-commit) ပြီးနောက် run တဲ့ [Effects](/docs/react/use-effect) တွေအတွင်း ဒါမှမဟုတ် — user က node ကို နှိပ်ပြီးမှ run တဲ့ event handlers တွေအတွင်းမှာပါ။ React က node ကို ဖယ်ရှားလိုက်တာနဲ့ `current` ကို `null` ပြန်လုပ်တာမို့ — conditional rendering နဲ့ node ပေါ်/ပျောက်ဖြစ်နေတဲ့ UI တွေမှာလည်း — ref က လက်ရှိ state ကိုပဲ အမြဲ ထင်ဟပ်နေပါတယ်။ အသေးစိတ်ကို [DOM ကို refs နဲ့ ကိုင်တွယ်ခြင်း](/docs/react/manipulating-the-dom-with-refs) မှာ ကြည့်ပါ။

#### ဥပမာ — Text Input တစ်ခုကို Focus လုပ်ခြင်း

ဒီဥပမာမှာ — button ကို နှိပ်လိုက်ရင် input ကို focus လုပ်ပါတယ်:

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

Refs နဲ့ DOM ကိုင်တွယ်ခြင်းရဲ့ တခြား ဥပမာတွေလည်း ရှိပါသေးတယ် — list node တစ်ခုကို ref လုပ်ပြီး DOM ရဲ့ `querySelectorAll` API နဲ့ ပုံတစ်ပုံကို scroll လုပ်တဲ့ ဥပမာ၊ `<video>` DOM node ပေါ်မှာ [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play)/[`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) ခေါ်တဲ့ ဥပမာ၊ ပြီးတော့ parent က child ရဲ့ DOM ကို ကိုင်တွယ်နိုင်အောင် ref ကို child component ဆီ prop အဖြစ် ပို့တဲ့ ဥပမာတွေပါ။

### Ref ရဲ့ Contents တွေ ပြန်လည် ဖန်တီးခံရတာကို ရှောင်ခြင်း

React က ref ရဲ့ initial value ကို တစ်ခါပဲ သိမ်းပြီး — နောက် render တွေမှာ လျစ်လျူရှုပါတယ်။

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

`new VideoPlayer()` ရဲ့ ရလဒ်ကို initial render အတွက်ပဲ သုံးပေမယ့် — ဒီ function ကို render တိုင်း ခေါ်နေပါတယ်။ Expensive objects တွေ ဖန်တီးနေတယ်ဆိုရင် ဒါက အလဟသ ကုန်ကျမှုပါ။ ဒါဆိုရင် ref ကို ဒီလို initialize လုပ်နိုင်ပါတယ်:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

ပုံမှန်အားဖြင့် rendering အတွင်းမှာ `ref.current` ကို ဖတ်/ရေး လုပ်တာ ခွင့်မပြုပေမယ့် — ဒီကိစ္စမှာတော့ ရလဒ်က အမြဲ တူနေပြီး — condition က initialization အတွင်းမှာပဲ run လို့ လုံးဝ predictable ဖြစ်တာမို့ — ရပါတယ်။ Type checker သုံးပြီး `null` checks တွေ ရှောင်ချင်ရင် — `getPlayer()` လို helper function တစ်ခုထဲမှာ null-check လုပ်ပြီး — event handlers တွေထဲမှာ အဲဒီ function ကိုပဲ သုံးတဲ့ pattern ကို သုံးနိုင်ပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### Custom Component တစ်ခုဆီ Ref တစ်ခု မရနိုင်ဘူး

ကိုယ်ပိုင် component တစ်ခုဆီ `ref` ကို ပို့ကြည့်ရင် —

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

console မှာ `TypeError: Cannot read properties of null` လိုမျိုး error တစ်ခု ရနိုင်ပါတယ် — ဘာလို့လဲဆိုတော့ ပုံမှန်အားဖြင့် — ကိုယ်ပိုင် components တွေက သူတို့ရဲ့ အတွင်းက DOM nodes တွေကို refs တွေအနေနဲ့ ထုတ်မပေးလို့ပါ။ ဖြေရှင်းဖို့ — ref ရချင်တဲ့ component ထဲမှာ — `ref` ကို လက်ခံတဲ့ props စာရင်းထဲ ထည့်ပြီး — သက်ဆိုင်တဲ့ child [built-in component](/docs/react/built-in-components) ဆီ `ref` ကို prop အဖြစ် ဆက်ပို့ပါ:

```js
function MyInput({ value, onChange, ref }) {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
};

export default MyInput;
```

ဒါဆိုရင် parent component က သူ့ဆီ ref တစ်ခု ရနိုင်ပါပြီ။ တခြား component တစ်ခုရဲ့ DOM nodes တွေကို ဝင်ရောက်ခြင်း အကြောင်းကို [DOM ကို refs နဲ့ ကိုင်တွယ်ခြင်း](/docs/react/manipulating-the-dom-with-refs) မှာ ဆက်ဖတ်ပါ။
