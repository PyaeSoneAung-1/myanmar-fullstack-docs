---
title: "State Update တစ်တန်းကို Queue တင်ခြင်း (Queueing a Series of State Updates)"
description: "React က state updates တွေကို batching လုပ်ပုံ — event handler ထဲက setter တွေ အားလုံး ပြီးမှ re-render ဖြစ်တာ၊ updater function (n => n + 1) နဲ့ state တစ်ခုကို ဆက်တိုက် update လုပ်နည်း"
order: 24
source: "https://react.dev/learn/queueing-a-series-of-state-updates"
status: translated
updated: 2026-09-01
---

State variable တစ်ခုကို set လုပ်တာက render တစ်ခု ထပ်ပြီး queue တင်ပါတယ်။ ဒါပေမယ့် — တစ်ခါတစ်ရံ — နောက် render မဖြစ်ခင် — တန်ဖိုးပေါ်မှာ operation အများအပြား လုပ်ချင်တာမျိုး ရှိနိုင်ပါတယ်။ ဒါကို လုပ်ဖို့ — React က state updates တွေကို ဘယ်လို batch လုပ်လဲဆိုတာ နားလည်ထားတာ အထောက်အကူ ဖြစ်ပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- "Batching" ဆိုတာ ဘာလဲ — React က state updates အများအပြားကို ဘယ်လို လုပ်ဆောင်လဲ
- State variable တစ်ခုတည်းကို ဆက်တိုက် update အများအပြား ဘယ်လို သုံးမလဲ

## React က State Updates တွေကို Batch လုပ်ခြင်း

"+3" button ကို နှိပ်လိုက်ရင် — `setNumber(number + 1)` ကို သုံးကြိမ် ခေါ်ထားလို့ — counter က သုံးကြိမ် increment ဖြစ်မယ်လို့ သင်ထင်ကောင်း ထင်နိုင်ပါတယ်:

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```
```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```
ဒါပေမယ့် — ယခင် section ကနေ သင်မှတ်မိနိုင်တဲ့အတိုင်း — [render တစ်ခုချင်းစီရဲ့ state တန်ဖိုးတွေက ပုံသေဖြစ်ပါတယ်](/docs/react/state-snapshot#rendering-takes-a-snapshot-in-time) — ဒါကြောင့် — ပထမ render ရဲ့ event handler အတွင်းက `number` တန်ဖိုးက — `setNumber(1)` ကို ဘယ်နှစ်ကြိမ်ပဲ ခေါ်ခေါ် — အမြဲတမ်း `0` ပါ:

```jsx
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```
ဒါပေမယ့် — ဒီမှာ ပါဝင်နေတဲ့ နောက်ထပ် အချက်တစ်ချက် ရှိပါသေးတယ်။ **React က သင့် state updates တွေကို လုပ်ဆောင်ချိန်မှာ — event handlers ထဲက code *အားလုံး* run ပြီးတဲ့အထိ စောင့်ပါတယ်။** ဒါကြောင့် — re-render က ဒီ `setNumber()` ခေါ်တွေ အားလုံး *ပြီးမှသာ* ဖြစ်တာပါ။

ဒါက စားသောက်ဆိုင်က စားပွဲထိုး တစ်ယောက် မှာစာ လက်ခံနေတာကို သတိရစေနိုင်ပါတယ်။ စားပွဲထိုးက သင့် ပထမဆုံး ဟင်းကို ပြောလိုက်တာနဲ့ မီးဖိုချောင်ဆီ ပြေးမသွားပါဘူး! အဲဒီအစား — သင့် မှာစာ ပြီးအောင် မှာခိုင်းပြီး — ပြင်ဆင်ချင်တာတွေ ပြင်ခိုင်းကာ — စားပွဲပေါ်က တခြားသူတွေရဲ့ မှာစာတွေကိုပါ လက်ခံပါတယ်။

> _Diagram:_ စားသောက်ဆိုင်က cursor တစ်ခုက React (စားပွဲထိုး) ကို မှာစာ အကြိမ်များစွာ မှာနေပြီး — React က setState() ကို အကြိမ်များစွာ ခေါ်ပြီးတဲ့အခါ — စားပွဲထိုးက သူမ တောင်းဆိုခဲ့တဲ့ နောက်ဆုံးတစ်ခုကိုပဲ သူမ ရဲ့ နောက်ဆုံး မှာစာအဖြစ် ရေးမှတ်ပါတယ်။

ဒါက — [re-renders](/docs/react/render-and-commit#re-renders-when-state-updates) တွေ အရမ်းမများအောင် — state variables အများအပြားကို — component အမျိုးမျိုးကနေတောင်မှ — update လုပ်နိုင်စေပါတယ်။ ဒါပေမယ့် — ဒါက UI က သင့် event handler — နဲ့ အထဲက code တွေ ပြီးတဲ့ *နောက်မှသာ* update ဖြစ်မယ်လို့လည်း ဆိုလိုပါတယ်။ ဒီအပြုအမူကို **batching** လို့လည်း ခေါ်ပြီး — သင့် React app ကို ပိုမြန်အောင် လုပ်ပေးပါတယ်။ Variable တချို့ပဲ update ဖြစ်ပြီး — ကျန်တာတွေ မဖြစ်သေးတဲ့ — ရှုပ်ထွေးတဲ့ "half-finished" renders တွေနဲ့လည်း ဆက်ဆံစရာ မလိုတော့ပါဘူး။

**React က *မတော်တဆ ဖြစ်တဲ့* events အမျိုးမျိုး (clicks တွေလိုမျိုး) ကို ဖြတ်ပြီး batch မလုပ်ပါဘူး** — click တစ်ခုချင်းစီကို သီးခြား ကိုင်တွယ်ပါတယ်။ React က batch လုပ်တာက ယေဘုယျအားဖြင့် လုံခြုံတဲ့အခါမှသာ လုပ်တာဆိုတာ စိတ်ချပါ။ ဒါက ဥပမာ — ပထမ button click က form တစ်ခုကို disable လုပ်လိုက်ရင် — ဒုတိယ click က သူ့ကို နောက်တစ်ကြိမ် submit မလုပ်စေဘူးဆိုတာ သေချာစေပါတယ်။

## နောက် Render မဖြစ်ခင် State တစ်ခုတည်းကို အကြိမ်များစွာ Update လုပ်ခြင်း

ဒါက အသုံးနည်းတဲ့ ကိစ္စတစ်ခုပါ — ဒါပေမယ့် — နောက် render မဖြစ်ခင် — state variable တစ်ခုတည်းကို အကြိမ်များစွာ update လုပ်ချင်ရင် — `setNumber(number + 1)` လိုမျိုး *နောက် state တန်ဖိုး* ပို့မယ့်အစား — queue ထဲက ယခင် state ကို အခြေခံပြီး နောက် state ကို တွက်ပေးတဲ့ *function* တစ်ခုကို ပို့နိုင်ပါတယ် — `setNumber(n => n + 1)` လိုမျိုးပါ။ ဒါက React ကို "state တန်ဖိုးကို ဘာတစ်ခုခု လုပ်ပါ" လို့ ပြောတဲ့ နည်းလမ်းတစ်ခုပါ — သူ့ကို အစားထိုးရုံသက်သက် မဟုတ်ပါဘူး။

အခု counter ကို increment လုပ်ကြည့်ပါ:

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```
```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```
ဒီမှာ — `n => n + 1` ကို **updater function** လို့ ခေါ်ပါတယ်။ ဒါကို state setter တစ်ခုဆီ ပို့လိုက်တဲ့အခါ:

1. React က ဒီ function ကို — event handler ထဲက တခြား code တွေ အားလုံး run ပြီးတဲ့နောက်မှာ — လုပ်ဆောင်ဖို့ queue တင်ပါတယ်။
2. နောက် render အတွင်း — React က queue တစ်ခုလုံးကို ဖြတ်သွားပြီး — နောက်ဆုံး update ဖြစ်ပြီးသား state ကို ပေးပါတယ်။

```jsx
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```
Event handler ကို execute လုပ်နေတုန်း React က ဒီ code တွေကို ဘယ်လို လုပ်ဆောင်လဲဆိုတာ ဒီမှာ ကြည့်ပါ:

1. `setNumber(n => n + 1)`: `n => n + 1` က function တစ်ခုပါ။ React က queue တစ်ခုထဲ ထည့်ပါတယ်။
2. `setNumber(n => n + 1)`: `n => n + 1` က function တစ်ခုပါ။ React က queue တစ်ခုထဲ ထည့်ပါတယ်။
3. `setNumber(n => n + 1)`: `n => n + 1` က function တစ်ခုပါ။ React က queue တစ်ခုထဲ ထည့်ပါတယ်။

နောက် render အတွင်း `useState` ကို ခေါ်လိုက်တဲ့အခါ — React က queue ကို ဖြတ်သွားပါတယ်။ ယခင် `number` state က `0` ဖြစ်ခဲ့လို့ — ဒါကို React က ပထမ updater function ဆီ `n` argument အဖြစ် ပေးပါတယ်။ ပြီးတော့ — React က သင့် ယခင် updater function ရဲ့ return value ကို ယူပြီး — နောက် updater ဆီ `n` အဖြစ် ပေးပါတယ် — ဆက်ပြီး ဒီလိုပဲ:

|  queued update | `n` | returns |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React က `3` ကို နောက်ဆုံး ရလဒ်အဖြစ် သိမ်းပြီး — `useState` ကနေ ပြန်ပေးပါတယ်။

ဒါကြောင့် — အထက်က ဥပမာမှာ "+3" ကို နှိပ်လိုက်ရင် — တန်ဖိုးကို 3 နဲ့ မှန်ကန်စွာ increment ဖြစ်တာပါ။

### State ကို အစားထိုးပြီးမှ Update လုပ်ရင် ဘာဖြစ်မလဲ

ဒီ event handler ကောရော? နောက် render မှာ `number` က ဘာဖြစ်မယ်လို့ ထင်ပါသလဲ?

```jsx
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```
```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```
```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```
ဒီ event handler က React ကို ဒီလို လုပ်ခိုင်းတာပါ:

1. `setNumber(number + 5)`: `number` က `0` ဖြစ်လို့ — `setNumber(0 + 5)` ဖြစ်ပါတယ်။ React က *"`5` နဲ့ အစားထိုး"* ဆိုတာကို queue ထဲ ထည့်ပါတယ်။
2. `setNumber(n => n + 1)`: `n => n + 1` က updater function တစ်ခုပါ။ React က *အဲဒီ function* ကို queue ထဲ ထည့်ပါတယ်။

နောက် render အတွင်း — React က state queue ကို ဖြတ်သွားပါတယ်:

|   queued update       | `n` | returns |
|--------------|---------|-----|
| "replace with `5`" | `0` (အသုံးမပြု) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React က `6` ကို နောက်ဆုံး ရလဒ်အဖြစ် သိမ်းပြီး — `useState` ကနေ ပြန်ပေးပါတယ်။

> **မှတ်ချက်:** `setState(5)` က တကယ်တော့ `setState(n => 5)` လိုပဲ အလုပ်လုပ်တာကို သတိပြုမိပါလိမ့်မယ် — ဒါပေမယ့် `n` က အသုံးမပြုပါဘူး!

### Update လုပ်ပြီးမှ State ကို အစားထိုးရင် ဘာဖြစ်မလဲ

နောက်ထပ် ဥပမာ တစ်ခု စမ်းကြည့်ရအောင်။ နောက် render မှာ `number` က ဘာဖြစ်မယ်လို့ ထင်ပါသလဲ?

```jsx
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```
```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```
```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```
ဒီ event handler ကို execute လုပ်နေတုန်း React က ဒီ code တွေကို ဘယ်လို လုပ်ဆောင်လဲဆိုတာ ဒီမှာ ကြည့်ပါ:

1. `setNumber(number + 5)`: `number` က `0` ဖြစ်လို့ — `setNumber(0 + 5)` ဖြစ်ပါတယ်။ React က *"`5` နဲ့ အစားထိုး"* ဆိုတာကို queue ထဲ ထည့်ပါတယ်။
2. `setNumber(n => n + 1)`: `n => n + 1` က updater function တစ်ခုပါ။ React က *အဲဒီ function* ကို queue ထဲ ထည့်ပါတယ်။
3. `setNumber(42)`: React က *"`42` နဲ့ အစားထိုး"* ဆိုတာကို queue ထဲ ထည့်ပါတယ်။

နောက် render အတွင်း — React က state queue ကို ဖြတ်သွားပါတယ်:

|   queued update       | `n` | returns |
|--------------|---------|-----|
| "replace with `5`" | `0` (အသုံးမပြု) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "replace with `42`" | `6` (အသုံးမပြု) | `42` |

ပြီးတော့ React က `42` ကို နောက်ဆုံး ရလဒ်အဖြစ် သိမ်းပြီး — `useState` ကနေ ပြန်ပေးပါတယ်။

အကျဉ်းချုပ်ပြောရရင် — `setNumber` state setter ဆီ ဘာတွေ ပို့နေလဲဆိုတာကို ဒီလိုမျိုး တွေးနိုင်ပါတယ်:

- **Updater function တစ်ခု** (ဥပမာ `n => n + 1`) ကို queue ထဲ ထည့်ပါတယ်။
- **တခြား တန်ဖိုး ဘာမဆို** (ဥပမာ number `5`) က — queue ထဲမှာ ရှိပြီးသားတွေကို လျစ်လျူရှုပြီး — "`5` နဲ့ အစားထိုး" ဆိုတာကို ထည့်ပါတယ်။

Event handler ပြီးသွားတာနဲ့ — React က re-render တစ်ခု trigger လုပ်ပါလိမ့်မယ်။ Re-render အတွင်း — React က queue ကို လုပ်ဆောင်ပါလိမ့်မယ်။ Updater functions တွေက rendering အတွင်း run ပါတယ် — ဒါကြောင့် — **updater functions တွေက [pure](/docs/react/keeping-components-pure) ဖြစ်ရပြီး** — ရလဒ်ကိုပဲ *ပြန်ပေး* ရပါမယ်။ သူတို့အတွင်းကနေ state set လုပ်ဖို့ ဒါမှမဟုတ် တခြား side effects တွေ run လုပ်ဖို့ မကြိုးစားပါနဲ့။ Strict Mode မှာ — React က updater function တစ်ခုချင်းစီကို နှစ်ကြိမ် run လုပ်ပြီး — (ဒုတိယ ရလဒ်ကို စွန့်ပစ်ပါတယ်) — ဒါက အမှားတွေကို ရှာတွေ့အောင် ကူညီပေးပါတယ်။

### နာမည်ပေးနည်း စည်းမျဉ်းများ (Naming Conventions)

Updater function ရဲ့ argument ကို — သက်ဆိုင်ရာ state variable ရဲ့ ပထမဆုံး စာလုံးတွေနဲ့ နာမည်ပေးတာ အသုံးများပါတယ်:

```jsx
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```
ပိုပြီး အသေးစိတ်ကျတဲ့ code ကို ကြိုက်ရင် — နောက်ထပ် အသုံးများတဲ့ စည်းမျဉ်းတစ်ခုက — state variable နာမည် အပြည့်အစုံကို ထပ်ရေးတာပါ — `setEnabled(enabled => !enabled)` လိုမျိုး — ဒါမှမဟုတ် — prefix တစ်ခု သုံးတာမျိုး — `setEnabled(prevEnabled => !prevEnabled)` လိုမျိုးပါ။

## အကျဉ်းချုပ်

- State set လုပ်တာက — ရှိပြီးသား render ထဲက variable ကို မပြောင်းပါဘူး — ဒါပေမယ့် render အသစ်တစ်ခုကို တောင်းဆိုပါတယ်။
- React က state updates တွေကို event handlers တွေ run ပြီးမှသာ လုပ်ဆောင်ပါတယ်။ ဒါကို batching လို့ ခေါ်ပါတယ်။
- Event တစ်ခုအတွင်းမှာ state တစ်ခုကို အကြိမ်များစွာ update လုပ်ဖို့ — `setNumber(n => n + 1)` updater function ကို သုံးနိုင်ပါတယ်။

## စိန်ခေါ်မှုများ (Challenges)

### Request Counter တစ်ခုကို ပြုပြင်ခြင်း

သင်က art marketplace app တစ်ခုမှာ အလုပ်လုပ်နေပြီး — user တစ်ယောက်က art item တစ်ခုအတွက် order အများအပြားကို တစ်ပြိုင်နက် submit လုပ်ခွင့် ပြုထားပါတယ်။ User က "Buy" button ကို နှိပ်တိုင်း — "Pending" counter က တစ်ခု တက်သင့်ပါတယ်။ သုံးစက္ကန့်ပြီးတဲ့အခါ — "Pending" counter က ကျသင့်ပြီး — "Completed" counter က တက်သင့်ပါတယ်။

ဒါပေမယ့် — "Pending" counter က လိုချင်တဲ့အတိုင်း မပြုမူပါဘူး။ "Buy" နှိပ်လိုက်တဲ့အခါ — `-1` ထိ ကျသွားပါတယ် (ဒါက မဖြစ်သင့်တာပါ!)။ ပြီးတော့ — မြန်မြန် နှစ်ခါ နှိပ်လိုက်ရင် — counter နှစ်ခုလုံးက ခန့်မှန်းလို့ မရတဲ့ပုံ ပြုမူပါတယ်။

ဘာကြောင့် ဒီလို ဖြစ်တာလဲ? Counter နှစ်ခုလုံးကို ပြုပြင်ပါ။

```jsx
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```
#### အဖြေ

`handleClick` event handler အတွင်းမှာ — `pending` နဲ့ `completed` တန်ဖိုးတွေက — click event ဖြစ်ချိန်က တန်ဖိုးတွေနဲ့ ကိုက်ညီပါတယ်။ ပထမ render အတွက် — `pending` က `0` ဖြစ်လို့ — `setPending(pending - 1)` က `setPending(-1)` ဖြစ်သွားပြီး — အဲဒါ မှားပါတယ်။ Counter တွေကို — click ဖြစ်ချိန်မှာ သတ်မှတ်ထားတဲ့ concrete တန်ဖိုးတစ်ခု သတ်မှတ်တာမဟုတ်ဘဲ — *increment* ဒါမှမဟုတ် *decrement* လုပ်ချင်တာဖြစ်လို့ — updater functions တွေကို ပို့နိုင်ပါတယ်:

```jsx
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```
ဒါက — counter တစ်ခုကို increment ဒါမှမဟုတ် decrement လုပ်တဲ့အခါ — click ဖြစ်ချိန်က state အစား — သူ့ရဲ့ *နောက်ဆုံး* state နဲ့ ဆက်စပ်ပြီး လုပ်တာ သေချာစေပါတယ်။

### State Queue ကို ကိုယ်တိုင် Implement လုပ်ခြင်း

ဒီစိန်ခေါ်မှုမှာ — React ရဲ့ အသေးစိတ် အပိုင်းလေးတစ်ခုကို — သင်ကိုယ်တိုင် reimplement လုပ်ပါမယ်! ဒါက ထင်သလောက် မခက်ပါဘူး။

Sandbox preview ကို အောက်ကို လှိမ့်ကြည့်ပါ။ **test cases လေးခု** ပြထားတာကို သတိပြုပါ။ သူတို့က ဒီစာမျက်နှာမှာ အရင်က မြင်ခဲ့တဲ့ ဥပမာတွေနဲ့ ကိုက်ညီပါတယ်။ သင့် တာဝန်က — `getFinalState` function ကို implement လုပ်ပြီး — ကိစ္စတစ်ခုချင်းစီအတွက် မှန်ကန်တဲ့ ရလဒ် ပြန်ပေးအောင် လုပ်ဖို့ပါ။ မှန်ကန်စွာ implement လုပ်ရင် — test လေးခုလုံး pass ဖြစ်သင့်ပါတယ်။

Argument နှစ်ခု လက်ခံရပါမယ်: `baseState` က ကနဦး state (ဥပမာ `0`) ဖြစ်ပြီး — `queue` က — numbers တွေ (ဥပမာ `5`) နဲ့ updater functions တွေ (ဥပမာ `n => n + 1`) ရောထွေးပါဝင်တဲ့ array တစ်ခုပါ — သူတို့ ထည့်ခဲ့တဲ့ အစဉ်လိုက်ပါ။

ဒီစာမျက်နှာပေါ်က tables တွေ ပြထားသလိုပဲ — နောက်ဆုံး state ကို ပြန်ပေးဖို့က သင့် တာဝန်ပါ!

> **အရိပ်အမြွက်:** ပိတ်မိနေသလို ခံစားရရင် — ဒီ code structure နဲ့ စတင်ပါ:
>
> ```jsx
> export function getFinalState(baseState, queue) {
>   let finalState = baseState;
>
>   for (let update of queue) {
>     if (typeof update === 'function') {
>       // TODO: apply the updater function → updater function ကို အသုံးပြုပါ
>     } else {
>       // TODO: replace the state → state ကို အစားထိုးပါ
>     }
>   }
>
>   return finalState;
> }
> ```
>
> ပျောက်နေတဲ့ line တွေကို ဖြည့်ပါ!

```jsx
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue... → queue နဲ့ တစ်ခုခု လုပ်ပါ...

  return finalState;
}
```
```jsx
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```
#### အဖြေ

ဒါက ဒီစာမျက်နှာမှာ ဖော်ပြထားတဲ့ — React က နောက်ဆုံး state ကို တွက်ဖို့ သုံးတဲ့ — algorithm အတိအကျပဲ ဖြစ်ပါတယ်:

```jsx
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function. → updater function ကို အသုံးပြုပါ။
      finalState = update(finalState);
    } else {
      // Replace the next state. → နောက် state ကို အစားထိုးပါ။
      finalState = update;
    }
  }

  return finalState;
}
```
```jsx
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```
အခု React ရဲ့ ဒီအပိုင်း ဘယ်လို အလုပ်လုပ်လဲဆိုတာ သင်သိပါပြီ!
