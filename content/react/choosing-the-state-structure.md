---
title: "State Structure ရွေးချယ်ခြင်း"
description: "State ကို ဖွဲ့စည်းတည်ဆောက်ပုံ ကောင်းအောင်လုပ်နည်း — ဆက်စပ် state တွေကို စုစည်းခြင်း၊ contradiction/redundancy/duplication တွေကို ရှောင်ခြင်း၊ deeply nested state ကို ရှောင်ခြင်း စတဲ့ မူ ၅ ချက်"
order: 8
source: "https://react.dev/learn/choosing-the-state-structure"
status: translated
updated: 2026-09-01
---

State ကို ကောင်းကောင်း ဖွဲ့စည်းတည်ဆောက်နိုင်ရင် — ပြင်ဆင်ရတာ လွယ်ပြီး debug လုပ်ရတာ လွယ်တဲ့ component တစ်ခုနဲ့ — အမြဲတမ်း bug တွေရဲ့ အရင်းအမြစ် ဖြစ်နေတဲ့ component တစ်ခုကြားမှာ ခြားနားချက် ကြီးကြီးမားမား ရှိပါတယ်။ State ကို ဖွဲ့စည်းတဲ့အခါ ထည့်သွင်းစဉ်းစားသင့်တဲ့ အကြံပြုချက်တချို့ ဒီမှာပါ။

## သင်ယူရမည့်အကြောင်းအရာများ

- State variable တစ်ခုတည်း သုံးရမလား၊ အများကြီး သုံးရမလား
- State ကို စီစဉ်တဲ့အခါ ဘာတွေကို ရှောင်ရမလဲ
- State structure ရဲ့ အဖြစ်များတဲ့ ပြဿနာတွေကို ဘယ်လို ဖြေရှင်းမလဲ

## State ဖွဲ့စည်းတည်ဆောက်ခြင်းအတွက် မူများ

State တစ်ခုခု ကိုင်ထားတဲ့ component တစ်ခုကို ရေးတဲ့အခါ — state variable ဘယ်နှစ်ခု သုံးမလဲ၊ သူတို့ရဲ့ data ပုံစံက ဘယ်လိုဖြစ်သင့်လဲဆိုတာတွေကို ရွေးချယ်ရပါတယ်။ State structure က အကောင်းဆုံး မဟုတ်ရင်တောင် မှန်ကန်တဲ့ program တွေ ရေးလို့ ရပါတယ် — ဒါပေမယ့် ပိုကောင်းတဲ့ ရွေးချယ်မှုတွေ လုပ်နိုင်ဖို့ လမ်းညွှန်ပေးနိုင်တဲ့ မူအနည်းငယ် ရှိပါတယ်:

1. **ဆက်စပ်တဲ့ state တွေကို စုစည်းပါ။** State variable နှစ်ခု ဒါမှမဟုတ် နှစ်ခုထက်ပိုတာကို အမြဲတမ်း တစ်ပြိုင်နက် update လုပ်နေရရင် — သူတို့ကို state variable တစ်ခုတည်းအဖြစ် ပေါင်းစည်းဖို့ စဉ်းစားပါ။
2. **State ထဲမှာ contradiction (ဆန့်ကျင်ကွဲလွဲမှု) တွေ ရှောင်ပါ။** State ကို ဖွဲ့စည်းထားပုံက state အပိုင်းများစွာ တစ်ခုနဲ့တစ်ခု ဆန့်ကျင် "သဘောမတူ" နိုင်တဲ့ပုံ ဖြစ်နေရင် — အမှားတွေ ဖြစ်ဖို့ နေရာလွတ် ပေးထားသလို ဖြစ်နေပါတယ်။ ဒါမျိုး ရှောင်ဖို့ ကြိုးစားပါ။
3. **Redundant state (အပိုနေတဲ့ state) တွေ ရှောင်ပါ။** Component ရဲ့ props ဒါမှမဟုတ် ရှိပြီးသား state variable တွေကနေ rendering အတွင်း တွက်ချက်လို့ရတဲ့ အချက်အလက်ဆိုရင် — အဲဒီအချက်အလက်ကို အဲဒီ component ရဲ့ state ထဲ မထည့်သင့်ပါဘူး။
4. **State ထဲမှာ duplication (ထပ်နေခြင်း) တွေ ရှောင်ပါ။** ဒေတာတစ်ခုတည်းကို state variable အများကြီးကြားမှာ ဒါမှမဟုတ် nested object တွေထဲမှာ ထပ်ထည့်ထားရင် — သူတို့ကို ကိုက်ညီနေအောင် ထိန်းသိမ်းဖို့ ခက်ခဲပါတယ်။ တတ်နိုင်ရင် duplication ကို လျှော့ချပါ။
5. **အလွန်နက်ရှိုင်းတဲ့ (deeply nested) state တွေ ရှောင်ပါ။** အဆင့်ဆင့် နက်နက်ရှိုင်းရှိုင်း ဖွဲ့စည်းထားတဲ့ state က update လုပ်ဖို့ သိပ်အဆင်မပြေပါဘူး။ တတ်နိုင်ရင် state ကို flat (အပြားလိုက်) ပုံစံနဲ့ ဖွဲ့စည်းတာ ပိုကောင်းပါတယ်။

ဒီမူတွေရဲ့ နောက်ကွယ်က ရည်မှန်းချက်က — *အမှားတွေ မဖြစ်အောင် ထိန်းထားရင်း state ကို update လုပ်ရလွယ်ကူစေဖို့* ဖြစ်ပါတယ်။ State ထဲက redundant နဲ့ duplicate ဒေတာတွေကို ဖယ်ရှားတာက — အပိုင်းအားလုံး ကိုက်ညီနေဖို့ သေချာစေပါတယ်။ ဒါက database engineer တစ်ယောက်က bug ဖြစ်နိုင်ခြေကို လျှော့ချဖို့ [database structure ကို "normalize" လုပ်ချင်တာ](https://docs.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description) နဲ့ ဆင်တူပါတယ်။ Albert Einstein ရဲ့ စကားကို ပြန်ဆိုရရင် — **"State ကို တတ်နိုင်သမျှ ရိုးရှင်းအောင် လုပ်ပါ — ဒါပေမယ့် ပိုရိုးရှင်းအောင် မလုပ်နဲ့။"**

ဒီမူတွေ လက်တွေ့မှာ ဘယ်လို အသုံးချလဲ ဆက်ကြည့်ရအောင်။

## ဆက်စပ်တဲ့ State တွေကို စုစည်းခြင်း

State variable တစ်ခုတည်း သုံးရမလား၊ အများကြီး သုံးရမလားဆိုတာကို တခါတရံ မသေချာဖြစ်တတ်ပါတယ်။

ဒီလိုမျိုး လုပ်သင့်လား?

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```
ဒါမှမဟုတ် ဒီလိုမျိုးလား?

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```
နည်းပညာအရတော့ ဒီနည်းလမ်း နှစ်ခုလုံး သုံးလို့ရပါတယ်။ ဒါပေမယ့် — **state variable နှစ်ခုက အမြဲတမ်း အတူတကွ ပြောင်းလဲနေရင် — သူတို့ကို state variable တစ်ခုတည်းအဖြစ် ပေါင်းစည်းတာ ကောင်းပါတယ်။** ဒါဆိုရင် သူတို့ကို အမြဲ ကိုက်ညီနေအောင် ထားဖို့ မမေ့တော့ဘူး — ဥပမာ အောက်က ဥပမာမှာ cursor ရွေ့တာနဲ့ အနီရောင် dot ရဲ့ coordinate နှစ်ခုလုံး update ဖြစ်တာမျိုးပါ:

```jsx
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```
```css
body { margin: 0; padding: 0; height: 250px; }
```
ဒေတာတွေကို object ဒါမှမဟုတ် array တစ်ခုထဲ စုစည်းရတဲ့ နောက်ထပ် အခြေအနေတစ်ခုက — state ဘယ်နှစ်ပိုင်း လိုမယ်ဆိုတာ မသိတဲ့အခါမျိုးပါ။ ဥပမာ — user က custom field တွေ ထည့်လို့ရတဲ့ form တစ်ခုရှိတဲ့အခါ အသုံးဝင်ပါတယ်။

> **သတိပြုရန်:** သင့် state variable က object ဖြစ်နေရင် — တခြား field တွေကို ရှင်းလင်းစွာ copy မလုပ်ဘဲ [အဲဒီထဲက field တစ်ခုတည်းကိုပဲ update လုပ်လို့ မရဘူး](/docs/react/updating-objects-in-state) ဆိုတာ သတိရပါ။ ဥပမာ — အထက်ပါ ဥပမာမှာ `setPosition({ x: 100 })` ဆိုပြီး လုပ်လို့ မရပါဘူး — ဘာလို့လဲဆိုတော့ အဲဒီမှာ `y` property လုံးဝ ပါမှာ မဟုတ်လို့ပါ! `x` တစ်ခုတည်းကို set ချင်ရင် — `setPosition({ ...position, x: 100 })` လုပ်ရမယ်၊ ဒါမှမဟုတ် state variable နှစ်ခု ခွဲပြီး `setX(100)` လုပ်ရပါတယ်။

## State ထဲမှာ Contradiction တွေကို ရှောင်ခြင်း

ဒီမှာ `isSending` နဲ့ `isSent` state variable တွေပါတဲ့ ဟိုတယ် feedback form တစ်ခု ရှိပါတယ်:

```jsx
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>Thanks for feedback!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```
ဒီ code က အလုပ်လုပ်ပေမယ့် — "မဖြစ်နိုင်တဲ့" state တွေ ဖြစ်ဖို့ တံခါးဖွင့်ထားပေးသလို ဖြစ်နေပါတယ်။ ဥပမာ — `setIsSent` နဲ့ `setIsSending` တွေကို အတူတကွ ခေါ်ဖို့ မေ့သွားရင် — `isSending` ရော `isSent` ပါ တစ်ပြိုင်နက် `true` ဖြစ်နေတဲ့ အခြေအနေမျိုး ရောက်သွားနိုင်ပါတယ်။ သင့် component ပိုရှုပ်ထွေးလေ — ဘာဖြစ်သွားလဲဆိုတာ နားလည်ဖို့ ပိုခက်လေပါပဲ။

**`isSending` နဲ့ `isSent` က ဘယ်တော့မှ တစ်ပြိုင်နက် `true` မဖြစ်သင့်တာမို့ — သူတို့ နှစ်ခုကို *တရားဝင်* state *သုံးမျိုး* ထဲက တစ်မျိုး ယူနိုင်တဲ့ `status` state variable တစ်ခုတည်းနဲ့ အစားထိုးတာ ပိုကောင်းပါတယ်:** `'typing'` (ကနဦး)၊ `'sending'` နဲ့ `'sent'`:

```jsx
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await sendMessage(text);
    setStatus('sent');
  }

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  if (isSent) {
    return <h1>Thanks for feedback!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```
ဖတ်ရလွယ်အောင် constant တချို့ကို ကြေညာထားလို့ ရပါသေးတယ်:

```js
const isSending = status === 'sending';
const isSent = status === 'sent';
```
ဒါပေမယ့် သူတို့က state variable တွေ မဟုတ်တာမို့ — တစ်ခုနဲ့တစ်ခု ကိုက်ညီမှု ပျက်သွားမှာကို စိတ်ပူစရာ မလိုပါဘူး။

## Redundant State တွေကို ရှောင်ခြင်း

Rendering အတွင်း component ရဲ့ props ဒါမှမဟုတ် ရှိပြီးသား state variable တွေကနေ အချက်အလက်တစ်ခုကို တွက်ချက်လို့ရနေရင် — အဲဒီအချက်အလက်ကို အဲဒီ component ရဲ့ state ထဲ **မထည့်သင့်ပါဘူး**။

ဥပမာ — ဒီ form ကို ကြည့်ပါ။ အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် အဲဒီထဲမှာ redundant state ရှိတာကို ရှာတွေ့လား?

```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```
```css
label { display: block; margin-bottom: 5px; }
```
ဒီ form မှာ state variable သုံးခု ရှိပါတယ် — `firstName`၊ `lastName` နဲ့ `fullName` ပါ။ ဒါပေမယ့် — `fullName` က redundant ပါ။ **`fullName` ကို `firstName` နဲ့ `lastName` ကနေ render အတွင်း အမြဲတမ်း တွက်လို့ရတာမို့ — state ထဲကနေ ဖယ်လိုက်ပါ။**

ဒီလို လုပ်လို့ရပါတယ်:

```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```
```css
label { display: block; margin-bottom: 5px; }
```
ဒီမှာ `fullName` က state variable *မဟုတ်ပါဘူး*။ အဲဒီအစား render အတွင်းမှာ တွက်ချက်တာပါ:

```js
const fullName = firstName + ' ' + lastName;
```
ရလဒ်အနေနဲ့ — change handler တွေက `fullName` ကို update လုပ်ဖို့ ဘာမှ အထူးလုပ်စရာ မလိုတော့ပါဘူး။ `setFirstName` ဒါမှမဟုတ် `setLastName` ကို ခေါ်လိုက်ရင် — re-render ဖြစ်ပြီး နောက် `fullName` ကို ဒေတာအသစ်ကနေ တွက်ချက်ပါလိမ့်မယ်။

#### Props တွေကို State ထဲ Mirror မလုပ်ပါနဲ့

Redundant state ရဲ့ ဖြစ်လေ့ဖြစ်ထရှိတဲ့ ဥပမာတစ်ခုက ဒီလိုမျိုး code ပါ:

```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```
ဒီမှာ — `color` state variable ကို `messageColor` prop ရဲ့ တန်ဖိုးနဲ့ စတင်သတ်မှတ်ထားပါတယ်။ ပြဿနာက — **parent component က နောက်မှ `messageColor` တန်ဖိုး မတူတာတစ်ခု ပေးလိုက်ရင် (ဥပမာ `'blue'` အစား `'red'`) — `color` *state variable* က update မဖြစ်ပါဘူး!** State က ပထမဆုံး render မှာပဲ စတင်သတ်မှတ်ခံရတာမို့ပါ။

ဒါကြောင့် prop တစ်ခုကို state variable ထဲ "mirror" လုပ်တာက ရှုပ်ထွေးမှုတွေ ဖြစ်စေနိုင်ပါတယ်။ အဲဒီအစား — `messageColor` prop ကို သင့် code ထဲမှာ တိုက်ရိုက် သုံးပါ။ နာမည် ပိုတိုချင်ရင် constant တစ်ခု သုံးပါ:

```js
function Message({ messageColor }) {
  const color = messageColor;
```
ဒီလိုဆိုရင် parent component ကနေ ပို့တဲ့ prop နဲ့ ကိုက်ညီမှု ပျက်သွားမှာ မဟုတ်ပါဘူး။

Props တွေကို state ထဲ "mirror" လုပ်တာက — prop တစ်ခုရဲ့ update တွေ အားလုံးကို လျစ်လျူရှုချင်တဲ့အခါမှသာ အဓိပ္ပါယ် ရှိပါတယ်။ စည်းမျဉ်းအရ — prop နာမည်ကို `initial` ဒါမှမဟုတ် `default` နဲ့ စပြီး — တန်ဖိုးအသစ်တွေကို လျစ်လျူရှုတယ်ဆိုတာ ရှင်းလင်းအောင် လုပ်ပါ:

```js
function Message({ initialColor }) {
  // The `color` state variable holds the *first* value of `initialColor`.
  // Further changes to the `initialColor` prop are ignored.
  const [color, setColor] = useState(initialColor);
```
## State ထဲမှာ Duplication တွေကို ရှောင်ခြင်း

ဒီ menu list component က ခရီးသွား snack အများကြီးထဲက တစ်ခုကို ရွေးချယ်ခွင့် ပေးပါတယ်:

```jsx
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```
```css
button { margin-top: 10px; }
```
လက်ရှိမှာ — ရွေးထားတဲ့ item ကို `selectedItem` state variable ထဲမှာ object တစ်ခုအနေနဲ့ သိမ်းထားပါတယ်။ ဒါပေမယ့် ဒါက သိပ်မကောင်းပါဘူး — **`selectedItem` ရဲ့ အကြောင်းအရာက `items` list ထဲက item တစ်ခုနဲ့ object တစ်ခုတည်း ဖြစ်နေပါတယ်။** ဆိုလိုတာက item ကိုယ်တိုင်ရဲ့ အချက်အလက်က နေရာနှစ်နေရာမှာ ထပ်နေပါတယ်။

ဒါက ဘာကြောင့် ပြဿနာလဲ? Item တစ်ခုချင်းစီကို edit လုပ်လို့ရအောင် လုပ်ကြည့်ရအောင်:

```jsx
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```
```css
button { margin-top: 10px; }
```
item တစ်ခုပေါ်မှာ "Choose" ကို အရင်နှိပ်ပြီး *ပြီးမှ* edit လုပ်ကြည့်ရင် — **input က update ဖြစ်ပေမယ့် အောက်ဆုံးက label က edit ဖြစ်တာကို ထင်ဟပ်မပြဘူး** ဆိုတာ သတိပြုပါ။ ဒါက state ထပ်နေလို့ဖြစ်ပြီး — `selectedItem` ကို update လုပ်ဖို့ မေ့နေလို့ပါ။

`selectedItem` ကိုပါ update လုပ်လို့ ရနိုင်ပေမယ့် — ပိုလွယ်တဲ့ ဖြေရှင်းနည်းက duplication ကို ဖယ်ရှားတာပါ။ ဒီဥပမာမှာ — `selectedItem` object (ဒါက `items` ထဲက objects တွေနဲ့ duplication ဖြစ်စေတယ်) အစား — state ထဲမှာ `selectedId` ကို သိမ်းပြီး — အဲဒီ ID နဲ့ ကိုက်ညီတဲ့ item ကို `items` array ထဲမှာ ရှာပြီး `selectedItem` ကို *ပြီးမှ* ရယူပါ:

```jsx
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```
```css
button { margin-top: 10px; }
```
အရင်က state က ဒီလို ထပ်နေခဲ့ပါတယ်:

- `items = [{ id: 0, title: 'pretzels'}, ...]`
- `selectedItem = {id: 0, title: 'pretzels'}`

ဒါပေမယ့် ပြောင်းလိုက်ပြီးနောက်မှာတော့:

- `items = [{ id: 0, title: 'pretzels'}, ...]`
- `selectedId = 0`

Duplication ပျောက်သွားပြီး — မရှိမဖြစ် state ကိုပဲ သိမ်းထားပါတယ်!

အခု — *ရွေးထားတဲ့* item ကို edit လုပ်ရင် အောက်က message က ချက်ချင်း update ဖြစ်ပါလိမ့်မယ်။ ဘာလို့လဲဆိုတော့ — `setItems` က re-render ကို trigger လုပ်ပြီး `items.find(...)` က title အသစ်နဲ့ item ကို ရှာတွေ့လို့ပါ။ *ရွေးထားတဲ့ item* ကိုယ်တိုင်ကို state ထဲ ထားစရာ မလိုပါဘူး — ဘာလို့လဲဆိုတော့ *selected ID* ပဲ မရှိမဖြစ်လို့ပါ။ ကျန်တာတွေက render အတွင်း တွက်ချက်လို့ရပါတယ်။

## နက်ရှိုင်းလွန်းတဲ့ (Deeply Nested) State တွေကို ရှောင်ခြင်း

ဂြိုဟ်တွေ၊ တိုက်ကြီးတွေနဲ့ နိုင်ငံတွေ ပါဝင်တဲ့ ခရီးသွားအစီအစဉ်တစ်ခုကို စိတ်ကူးကြည့်ပါ။ သူ့ရဲ့ state ကို nested objects နဲ့ arrays တွေနဲ့ ဖွဲ့စည်းချင်စိတ် ဖြစ်နိုင်ပါတယ် — အောက်က ဥပမာလိုမျိုးပါ:

```jsx
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ place }) {
  const childPlaces = place.childPlaces;
  return (
    <li>
      {place.title}
      {childPlaces.length > 0 && (
        <ol>
          {childPlaces.map(place => (
            <PlaceTree key={place.id} place={place} />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const planets = plan.childPlaces;
  return (
    <>
      <h2>Places to visit</h2>
      <ol>
        {planets.map(place => (
          <PlaceTree key={place.id} place={place} />
        ))}
      </ol>
    </>
  );
}
```
```js
export const initialTravelPlan = {
  id: 0,
  title: '(Root)',
  childPlaces: [{
    id: 1,
    title: 'Earth',
    childPlaces: [{
      id: 2,
      title: 'Africa',
      childPlaces: [{
        id: 3,
        title: 'Botswana',
        childPlaces: []
      }, {
        id: 4,
        title: 'Egypt',
        childPlaces: []
      }, {
        id: 5,
        title: 'Kenya',
        childPlaces: []
      }, {
        id: 6,
        title: 'Madagascar',
        childPlaces: []
      }, {
        id: 7,
        title: 'Morocco',
        childPlaces: []
      }, {
        id: 8,
        title: 'Nigeria',
        childPlaces: []
      }, {
        id: 9,
        title: 'South Africa',
        childPlaces: []
      }]
    }, {
      id: 10,
      title: 'Americas',
      childPlaces: [{
        id: 11,
        title: 'Argentina',
        childPlaces: []
      }, {
        id: 12,
        title: 'Brazil',
        childPlaces: []
      }, {
        id: 13,
        title: 'Barbados',
        childPlaces: []
      }, {
        id: 14,
        title: 'Canada',
        childPlaces: []
      }, {
        id: 15,
        title: 'Jamaica',
        childPlaces: []
      }, {
        id: 16,
        title: 'Mexico',
        childPlaces: []
      }, {
        id: 17,
        title: 'Trinidad and Tobago',
        childPlaces: []
      }, {
        id: 18,
        title: 'Venezuela',
        childPlaces: []
      }]
    }, {
      id: 19,
      title: 'Asia',
      childPlaces: [{
        id: 20,
        title: 'China',
        childPlaces: []
      }, {
        id: 21,
        title: 'India',
        childPlaces: []
      }, {
        id: 22,
        title: 'Singapore',
        childPlaces: []
      }, {
        id: 23,
        title: 'South Korea',
        childPlaces: []
      }, {
        id: 24,
        title: 'Thailand',
        childPlaces: []
      }, {
        id: 25,
        title: 'Vietnam',
        childPlaces: []
      }]
    }, {
      id: 26,
      title: 'Europe',
      childPlaces: [{
        id: 27,
        title: 'Croatia',
        childPlaces: [],
      }, {
        id: 28,
        title: 'France',
        childPlaces: [],
      }, {
        id: 29,
        title: 'Germany',
        childPlaces: [],
      }, {
        id: 30,
        title: 'Italy',
        childPlaces: [],
      }, {
        id: 31,
        title: 'Portugal',
        childPlaces: [],
      }, {
        id: 32,
        title: 'Spain',
        childPlaces: [],
      }, {
        id: 33,
        title: 'Turkey',
        childPlaces: [],
      }]
    }, {
      id: 34,
      title: 'Oceania',
      childPlaces: [{
        id: 35,
        title: 'Australia',
        childPlaces: [],
      }, {
        id: 36,
        title: 'Bora Bora (French Polynesia)',
        childPlaces: [],
      }, {
        id: 37,
        title: 'Easter Island (Chile)',
        childPlaces: [],
      }, {
        id: 38,
        title: 'Fiji',
        childPlaces: [],
      }, {
        id: 39,
        title: 'Hawaii (the USA)',
        childPlaces: [],
      }, {
        id: 40,
        title: 'New Zealand',
        childPlaces: [],
      }, {
        id: 41,
        title: 'Vanuatu',
        childPlaces: [],
      }]
    }]
  }, {
    id: 42,
    title: 'Moon',
    childPlaces: [{
      id: 43,
      title: 'Rheita',
      childPlaces: []
    }, {
      id: 44,
      title: 'Piccolomini',
      childPlaces: []
    }, {
      id: 45,
      title: 'Tycho',
      childPlaces: []
    }]
  }, {
    id: 46,
    title: 'Mars',
    childPlaces: [{
      id: 47,
      title: 'Corn Town',
      childPlaces: []
    }, {
      id: 48,
      title: 'Green Hill',
      childPlaces: []
    }]
  }]
};
```
အခု — သွားပြီးသား နေရာတစ်ခုကို ဖျက်ဖို့ button တစ်ခု ထည့်ချင်တယ်ဆိုပါစို့။ ဘယ်လို လုပ်မလဲ? [Nested state ကို update လုပ်တာ](/docs/react/updating-objects-in-state#updating-a-nested-object) က — ပြောင်းလဲတဲ့ အစိတ်အပိုင်းကနေ အပေါ်ဆုံးအထိ object တွေကို copy လုပ်ရပါတယ်။ နက်ရှိုင်းစွာ nested ဖြစ်နေတဲ့ နေရာတစ်ခုကို ဖျက်တာက — သူ့ရဲ့ parent နေရာ ကွင်းဆက်တစ်ခုလုံးကို copy လုပ်ရပါတယ်။ ဒီလို code က အရမ်း ရှည်လျားနိုင်ပါတယ်။

**State က update လုပ်ရ ခက်လောက်အောင် nested ဖြစ်နေရင် — "flat" (အပြားလိုက်) ဖြစ်အောင် လုပ်ဖို့ စဉ်းစားပါ။** ဒီဒေတာကို ပြန်ဖွဲ့စည်းနိုင်တဲ့ နည်းလမ်းတစ်ခု ဒီမှာပါ။ `place` တစ်ခုစီမှာ *သူ့ရဲ့ child places* array ပါတဲ့ tree ပုံစံအစား — place တစ်ခုစီမှာ *သူ့ရဲ့ child place IDs* array ကို ထားနိုင်ပါတယ်။ ပြီးတော့ place ID တစ်ခုစီကနေ သက်ဆိုင်ရာ place ဆီကို mapping သိမ်းထားပါ။

ဒီဒေတာ ပြန်ဖွဲ့စည်းမှုက database table တစ်ခုကို မြင်ရသလို ခံစားရနိုင်ပါတယ်:

```jsx
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ id, placesById }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      {childIds.length > 0 && (
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              placesById={placesById}
            />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Places to visit</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            placesById={plan}
          />
        ))}
      </ol>
    </>
  );
}
```
```js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Earth',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Africa',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  },
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  },
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'South Africa',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Americas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  },
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
    childIds: [20, 21, 22, 23, 24, 25],
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapore',
    childIds: []
  },
  23: {
    id: 23,
    title: 'South Korea',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thailand',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Vietnam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europe',
    childIds: [27, 28, 29, 30, 31, 32, 33],
  },
  27: {
    id: 27,
    title: 'Croatia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'France',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Germany',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italy',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turkey',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Oceania',
    childIds: [35, 36, 37, 38, 39, 40, 41],
  },
  35: {
    id: 35,
    title: 'Australia',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 40,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'New Zealand',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Moon',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```
**အခု state က "flat" (နောက်ထပ် နာမည်တစ်ခုကတော့ "normalized") ဖြစ်သွားတာမို့ — nested item တွေကို update လုပ်တာ ပိုလွယ်လာပါတယ်။**

အခု နေရာတစ်ခုကို ဖယ်ရှားဖို့ — state အဆင့် နှစ်ဆင့်ကိုပဲ update လုပ်ဖို့ လိုပါတယ်:

- သူ့ရဲ့ *parent* နေရာရဲ့ update ဗားရှင်းက — ဖယ်လိုက်တဲ့ ID ကို သူ့ရဲ့ `childIds` array ထဲကနေ ဖယ်ထုတ်ထားရပါမယ်။
- Root "table" object ရဲ့ update ဗားရှင်းမှာ — parent နေရာရဲ့ update ဗားရှင်း ပါဝင်ရပါမယ်။

ဒီလို လုပ်နိုင်တဲ့ ဥပမာတစ်ခု ဒီမှာပါ:

```jsx
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
    // Create a new version of the parent place
    // that doesn't include this child ID.
    const nextParent = {
      ...parent,
      childIds: parent.childIds
        .filter(id => id !== childId)
    };
    // Update the root state object...
    setPlan({
      ...plan,
      // ...so that it has the updated parent.
      [parentId]: nextParent
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Places to visit</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        Complete
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```
```js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Earth',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Africa',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  },
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  },
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'South Africa',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Americas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  },
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
    childIds: [20, 21, 22, 23, 24, 25],
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapore',
    childIds: []
  },
  23: {
    id: 23,
    title: 'South Korea',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thailand',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Vietnam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europe',
    childIds: [27, 28, 29, 30, 31, 32, 33],
  },
  27: {
    id: 27,
    title: 'Croatia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'France',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Germany',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italy',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turkey',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Oceania',
    childIds: [35, 36, 37, 38, 39, 40, 41],
  },
  35: {
    id: 35,
    title: 'Australia',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'New Zealand',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Moon',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```
```css
button { margin: 10px; }
```
State ကို ကြိုက်သလောက် nested လုပ်လို့ရပါတယ် — ဒါပေမယ့် "flat" လုပ်တာက ပြဿနာ အများကြီးကို ဖြေရှင်းပေးနိုင်ပါတယ်။ State update လုပ်ရတာ ပိုလွယ်စေပြီး — nested object ရဲ့ နေရာအမျိုးမျိုးမှာ duplication မဖြစ်အောင် သေချာစေပါတယ်။

#### Memory အသုံးပြုမှု ပိုမိုကောင်းမွန်အောင် လုပ်ခြင်း

စံပြအနေနဲ့ဆိုရင် — ဖျက်လိုက်တဲ့ item တွေ (သူတို့ရဲ့ children တွေပါ!) ကို "table" object ထဲကနေ ဖယ်ရှားပြီး memory အသုံးပြုမှု ကောင်းအောင် လုပ်သင့်ပါတယ်။ ဒီ version က အဲဒါကို လုပ်ပါတယ်။ Update logic ပိုတိုအောင် [Immer ကိုလည်း သုံးထား](/docs/react/updating-objects-in-state#write-concise-update-logic-with-immer) ပါတယ်။

```jsx
import { useImmer } from 'use-immer';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, updatePlan] = useImmer(initialTravelPlan);

  function handleComplete(parentId, childId) {
    updatePlan(draft => {
      // Remove from the parent place's child IDs.
      const parent = draft[parentId];
      parent.childIds = parent.childIds
        .filter(id => id !== childId);

      // Forget this place and all its subtree.
      deleteAllChildren(childId);
      function deleteAllChildren(id) {
        const place = draft[id];
        place.childIds.forEach(deleteAllChildren);
        delete draft[id];
      }
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Places to visit</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        Complete
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```
```js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Earth',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Africa',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  },
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  },
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'South Africa',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Americas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  },
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
    childIds: [20, 21, 22, 23, 24, 25,],
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapore',
    childIds: []
  },
  23: {
    id: 23,
    title: 'South Korea',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thailand',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Vietnam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europe',
    childIds: [27, 28, 29, 30, 31, 32, 33],
  },
  27: {
    id: 27,
    title: 'Croatia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'France',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Germany',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italy',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turkey',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Oceania',
    childIds: [35, 36, 37, 38, 39, 40, 41],
  },
  35: {
    id: 35,
    title: 'Australia',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'New Zealand',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Moon',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```
```css
button { margin: 10px; }
```
```json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```
တခါတရံ — nested state တချို့ကို child components တွေဆီ ရွှေ့ပြီး state nesting ကို လျှော့ချနိုင်ပါတယ်။ ဒါက item တစ်ခု hover ဖြစ်နေလားဆိုတာလိုမျိုး — သိမ်းစရာ မလိုတဲ့ ခဏတာ UI state တွေအတွက် ကောင်းစွာ အလုပ်လုပ်ပါတယ်။

## အကျဉ်းချုပ်

- State variable နှစ်ခုက အမြဲတမ်း အတူတကွ update ဖြစ်နေရင် — တစ်ခုတည်းအဖြစ် ပေါင်းစည်းဖို့ စဉ်းစားပါ။
- "မဖြစ်နိုင်တဲ့" state တွေ မဖြစ်အောင် state variable တွေကို သေချာ ရွေးချယ်ပါ။
- Update လုပ်တဲ့အခါ အမှားဖြစ်နိုင်ခြေ နည်းစေမယ့်ပုံ သင့် state ကို ဖွဲ့စည်းပါ။
- Redundant နဲ့ duplicate state တွေကို ရှောင်ပါ — ဒါဆိုရင် ကိုက်ညီနေအောင် ထိန်းသိမ်းစရာ မလိုတော့ဘူး။
- Update တွေကို တားဆီးချင်တာ မဟုတ်ရင် props တွေကို state ထဲ *မထည့်ပါနဲ့*။
- Selection လိုမျိုး UI pattern တွေအတွက် — object ကိုယ်တိုင် မဟုတ်ဘဲ ID ဒါမှမဟုတ် index ကို state ထဲ သိမ်းပါ။
- နက်ရှိုင်းစွာ nested ဖြစ်နေတဲ့ state ကို update လုပ်ရတာ ရှုပ်ထွေးနေရင် — flat ဖြစ်အောင် လုပ်ကြည့်ပါ။

## စိန်ခေါ်မှုများ (Challenges)

### Update မဖြစ်နေတဲ့ Component တစ်ခုကို ပြုပြင်ခြင်း

ဒီ `Clock` component က prop နှစ်ခုကို လက်ခံပါတယ် — `color` နဲ့ `time` ပါ။ Select box ထဲမှာ အရောင်တစ်မျိုး ရွေးလိုက်တဲ့အခါ — `Clock` component က သူ့ရဲ့ parent component ကနေ `color` prop အမျိုးမျိုး လက်ခံရပါတယ်။ ဒါပေမယ့် — တစ်စုံတစ်ခုကြောင့် ပြသနေတဲ့ အရောင်က update မဖြစ်ပါဘူး။ ဘာကြောင့်လဲ? ပြဿနာကို ဖြေရှင်းပါ။

```jsx
import { useState } from 'react';

export default function Clock(props) {
  const [color, setColor] = useState(props.color);
  return (
    <h1 style={{ color: color }}>
      {props.time}
    </h1>
  );
}
```
```jsx
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```
#### အဖြေ

ပြဿနာက — ဒီ component မှာ `color` state ကို `color` prop ရဲ့ ကနဦးတန်ဖိုးနဲ့ စတင်သတ်မှတ်ထားလို့ပါ။ ဒါပေမယ့် `color` prop ပြောင်းသွားတဲ့အခါ — state variable ကို ထိခိုက်စေမှာ မဟုတ်ပါဘူး! ဒါကြောင့် သူတို့ ကိုက်ညီမှု ပျက်သွားပါတယ်။ ဖြေရှင်းဖို့ — state variable ကို လုံးဝ ဖယ်ရှားပြီး `color` prop ကို တိုက်ရိုက် သုံးပါ။

```jsx
import { useState } from 'react';

export default function Clock(props) {
  return (
    <h1 style={{ color: props.color }}>
      {props.time}
    </h1>
  );
}
```
```jsx
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```
ဒါမှမဟုတ် — destructuring syntax သုံးပြီး:

```jsx
import { useState } from 'react';

export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```
```jsx
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```
### ပျက်နေတဲ့ Packing List တစ်ခုကို ပြုပြင်ခြင်း

ဒီ packing list မှာ — ဘယ်နှစ်ခု ထုပ်ပိုးပြီးပြီ၊ စုစုပေါင်း ဘယ်နှစ်ခု ရှိတယ်ဆိုတာကို ပြတဲ့ footer တစ်ခု ရှိပါတယ်။ အစပိုင်းမှာတော့ အလုပ်လုပ်ပုံရပါတယ် — ဒါပေမယ့် bug တွေ ရှိပါတယ်။ ဥပမာ — item တစ်ခုကို packed အဖြစ် မှတ်ပြီး ဖျက်လိုက်ရင် — counter က မှန်မှန်ကန်ကန် update မဖြစ်တော့ပါဘူး။ Counter က အမြဲတမ်း မှန်နေအောင် ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** ဒီဥပမာထဲမှာ redundant state တစ်ခုခု ရှိနေလား?

```jsx
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Warm socks', packed: true },
  { id: 1, title: 'Travel journal', packed: false },
  { id: 2, title: 'Watercolors', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(3);
  const [packed, setPacked] = useState(1);

  function handleAddItem(title) {
    setTotal(total + 1);
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    if (nextItem.packed) {
      setPacked(packed + 1);
    } else {
      setPacked(packed - 1);
    }
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setTotal(total - 1);
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{packed} out of {total} packed!</b>
    </>
  );
}
```
```jsx
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add item"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>Add</button>
    </>
  )
}
```
```jsx
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```
```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```
#### အဖြေ

`total` နဲ့ `packed` counter တွေ မှန်အောင် event handler တစ်ခုချင်းစီကို သေချာ ပြောင်းလို့ ရနိုင်ပေမယ့် — အရင်းခံ ပြဿနာက ဒီ state variable တွေ ရှိနေတာကိုယ်တိုင်ပါပဲ။ သူတို့က redundant ပါ — ဘာလို့လဲဆိုတော့ item အရေအတွက် (packed ဖြစ်စေ၊ total ဖြစ်စေ) ကို `items` array ကိုယ်တိုင်ကနေ အမြဲတမ်း တွက်လို့ရလို့ပါ။ Bug ကို ဖြေရှင်းဖို့ redundant state ကို ဖယ်ရှားပါ:

```jsx
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Warm socks', packed: true },
  { id: 1, title: 'Travel journal', packed: false },
  { id: 2, title: 'Watercolors', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);

  const total = items.length;
  const packed = items
    .filter(item => item.packed)
    .length;

  function handleAddItem(title) {
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{packed} out of {total} packed!</b>
    </>
  );
}
```
```jsx
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add item"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>Add</button>
    </>
  )
}
```
```jsx
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```
```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```
ဒီပြောင်းလဲမှုပြီးနောက် — event handler တွေက `setItems` ကိုပဲ ခေါ်နေတာကို သတိပြုပါ။ Item အရေအတွက်တွေကို နောက် render မှာ `items` ကနေ တွက်ချက်တာမို့ — အမြဲတမ်း နောက်ဆုံးပေါ် ဖြစ်နေပါတယ်။

### ပျောက်ကွယ်နေတဲ့ Selection ကို ပြုပြင်ခြင်း

State ထဲမှာ `letters` list တစ်ခု ရှိပါတယ်။ letter တစ်ခုကို hover လုပ်တဲ့အခါ ဒါမှမဟုတ် focus လုပ်တဲ့အခါ — အဲဒီ letter က highlight ဖြစ်ပါတယ်။ လက်ရှိ highlight ဖြစ်နေတဲ့ letter ကို `highlightedLetter` state variable ထဲမှာ သိမ်းထားပါတယ်။ Letter တစ်ခုချင်းစီကို "star" နဲ့ "unstar" လုပ်လို့ရပြီး — state ထဲက `letters` array ကို update လုပ်ပါတယ်။

ဒီ code က အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် UI glitch အသေးလေးတစ်ခု ရှိပါတယ်။ "Star" ဒါမှမဟုတ် "Unstar" ကို နှိပ်လိုက်တဲ့အခါ — highlight က ခဏ ပျောက်သွားပါတယ်။ ဒါပေမယ့် pointer ရွေ့လိုက်တာနဲ့ ဒါမှမဟုတ် keyboard နဲ့ တခြား letter ကို ပြောင်းလိုက်တာနဲ့ ပြန်ပေါ်လာပါတယ်။ ဘာကြောင့် ဒီလိုဖြစ်တာလဲ? Button နှိပ်ပြီးတဲ့အခါ highlight မပျောက်အောင် ပြုပြင်ပါ။

```jsx
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedLetter, setHighlightedLetter] = useState(null);

  function handleHover(letter) {
    setHighlightedLetter(letter);
  }

  function handleStar(starred) {
    setLetters(letters.map(letter => {
      if (letter.id === starred.id) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter === highlightedLetter
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```
```jsx
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter);
      }}
      onPointerMove={() => {
        onHover(letter);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter);
      }}>
        {letter.isStarred ? 'Unstar' : 'Star'}
      </button>
      {letter.subject}
    </li>
  )
}
```
```js
export const initialLetters = [{
  id: 0,
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
  isStarred: false,
}];
```
```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```
#### အဖြေ

ပြဿနာက — letter object ကို `highlightedLetter` ထဲမှာ သိမ်းထားလို့ပါ။ ဒါပေမယ့် အဲဒီအချက်အလက်ကိုပဲ `letters` array ထဲမှာလည်း သိမ်းထားပါတယ်။ ဒါကြောင့် သင့် state မှာ duplication ရှိနေပါတယ်! Button နှိပ်ပြီး `letters` array ကို update လုပ်တဲ့အခါ — `highlightedLetter` နဲ့ မတူတဲ့ letter object အသစ်တစ်ခု ဖန်တီးမိပါတယ်။ ဒါကြောင့် `highlightedLetter === letter` ဆိုတဲ့ check က `false` ဖြစ်ပြီး highlight ပျောက်သွားတာပါ။ Pointer ရွေ့တဲ့အခါ `setHighlightedLetter` ကို နောက်တစ်ကြိမ် ခေါ်တဲ့အခါမှ ပြန်ပေါ်လာတာပါ။

ဖြေရှင်းဖို့ — state ထဲက duplication ကို ဖယ်ရှားပါ။ *letter ကိုယ်တိုင်* ကို နေရာနှစ်နေရာမှာ သိမ်းမယ့်အစား — `highlightedId` ကို သိမ်းပါ။ ပြီးရင် letter တစ်ခုချင်းစီအတွက် `letter.id === highlightedId` ဆိုပြီး `isHighlighted` ကို စစ်နိုင်ပါတယ် — ဒါက နောက်ဆုံး render ကတည်းက `letter` object ပြောင်းသွားရင်တောင် အလုပ်လုပ်ပါတယ်။

```jsx
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedId, setHighlightedId ] = useState(null);

  function handleHover(letterId) {
    setHighlightedId(letterId);
  }

  function handleStar(starredId) {
    setLetters(letters.map(letter => {
      if (letter.id === starredId) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter.id === highlightedId
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```
```jsx
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter.id);
      }}
      onPointerMove={() => {
        onHover(letter.id);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter.id);
      }}>
        {letter.isStarred ? 'Unstar' : 'Star'}
      </button>
      {letter.subject}
    </li>
  )
}
```
```js
export const initialLetters = [{
  id: 0,
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
  isStarred: false,
}];
```
```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```
### Multiple Selection ကို Implement လုပ်ခြင်း

ဒီဥပမာမှာ — `Letter` တစ်ခုစီမှာ `isSelected` prop နဲ့ selected အဖြစ် မှတ်ပေးတဲ့ `onToggle` handler တစ်ခု ရှိပါတယ်။ ဒါက အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် state ကို `selectedId` (တစ်ခုခုဖြစ်ဖြစ် `null` ဖြစ်ဖြစ်) အနေနဲ့ သိမ်းထားတာမို့ — တစ်ချိန်မှာ letter တစ်ခုတည်းပဲ selected ဖြစ်နိုင်ပါတယ်။

State structure ကို ပြောင်းပြီး multiple selection ကို ထောက်ပံ့အောင် လုပ်ပါ။ (ဘယ်လို ဖွဲ့စည်းမလဲ? Code မရေးခင် အရင်စဉ်းစားပါ။) Checkbox တစ်ခုချင်းစီက တခြားဟာတွေနဲ့ အမှီအခိုကင်း ဖြစ်သင့်ပါတယ်။ Selected ဖြစ်နေတဲ့ letter ကို နှိပ်ရင် uncheck ဖြစ်သင့်ပါတယ်။ နောက်ဆုံးမှာ footer က selected item အရေအတွက် မှန်ကန်အောင် ပြသင့်ပါတယ်။

> **အရိပ်အမြွက်:** Selected ID တစ်ခုတည်း အစား — selected IDs တွေရဲ့ array တစ်ခု ဒါမှမဟုတ် [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) တစ်ခုကို state ထဲ ထားချင်လိမ့်မယ်။

```jsx
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedId, setSelectedId] = useState(null);

  // TODO: allow multiple selection
  const selectedCount = 1;

  function handleToggle(toggledId) {
    // TODO: allow multiple selection
    setSelectedId(toggledId);
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              // TODO: allow multiple selection
              letter.id === selectedId
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            You selected {selectedCount} letters
          </b>
        </p>
      </ul>
    </>
  );
}
```
```jsx
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```
```js
export const letters = [{
  id: 0,
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
  isStarred: false,
}];
```
```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```
#### အဖြေ

`selectedId` တစ်ခုတည်း အစား — state ထဲမှာ `selectedIds` *array* တစ်ခုကို သိမ်းပါ။ ဥပမာ — ပထမ letter နဲ့ နောက်ဆုံး letter ကို ရွေးလိုက်ရင် — `[0, 2]` ဆိုပြီး ပါဝင်ပါမယ်။ ဘာမှ မရွေးထားရင် — အလွတ် `[]` array ဖြစ်ပါမယ်:

```jsx
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedCount = selectedIds.length;

  function handleToggle(toggledId) {
    // Was it previously selected?
    if (selectedIds.includes(toggledId)) {
      // Then remove this ID from the array.
      setSelectedIds(selectedIds.filter(id =>
        id !== toggledId
      ));
    } else {
      // Otherwise, add this ID to the array.
      setSelectedIds([
        ...selectedIds,
        toggledId
      ]);
    }
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.includes(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            You selected {selectedCount} letters
          </b>
        </p>
      </ul>
    </>
  );
}
```
```jsx
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```
```js
export const letters = [{
  id: 0,
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
  isStarred: false,
}];
```
```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```
Array သုံးခြင်းရဲ့ အားနည်းချက်အသေးတစ်ခုက — item တစ်ခုချင်းစီအတွက် selected ဖြစ်မဖြစ် စစ်ဖို့ `selectedIds.includes(letter.id)` ကို ခေါ်နေရတာပါ။ Array က အရမ်းကြီးနေရင် — ဒါက performance ပြဿနာ ဖြစ်လာနိုင်ပါတယ်။ ဘာလို့လဲဆိုတော့ array ထဲ ရှာတဲ့ [`includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) က linear time ယူပြီး — item တစ်ခုချင်းစီအတွက် ဒီရှာဖွေမှုကို လုပ်နေရလို့ပါ။

ဖြေရှင်းဖို့ — state ထဲမှာ [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) တစ်ခုကို သိမ်းနိုင်ပါတယ် — ဒါက မြန်ဆန်တဲ့ [`has()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has) operation ကို ပေးပါတယ်:

```jsx
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState(
    new Set()
  );

  const selectedCount = selectedIds.size;

  function handleToggle(toggledId) {
    // Create a copy (to avoid mutation).
    const nextIds = new Set(selectedIds);
    if (nextIds.has(toggledId)) {
      nextIds.delete(toggledId);
    } else {
      nextIds.add(toggledId);
    }
    setSelectedIds(nextIds);
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.has(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            You selected {selectedCount} letters
          </b>
        </p>
      </ul>
    </>
  );
}
```
```jsx
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```
```js
export const letters = [{
  id: 0,
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
  isStarred: false,
}];
```
```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```
အခုဆိုရင် item တစ်ခုစီက `selectedIds.has(letter.id)` check ကို လုပ်တာမို့ — အရမ်း မြန်ပါတယ်။

State ထဲမှာ [object တွေကို mutate မလုပ်သင့်ဘူး](/docs/react/updating-objects-in-state) ဆိုတာ သတိရပါ — Set တွေလည်း အပါအဝင်ပါ။ ဒါကြောင့် `handleToggle` function က Set ရဲ့ *copy* တစ်ခုကို အရင်ဖန်တီးပြီး — အဲဒီ copy ကိုမှ update လုပ်တာပါ။

## နောက်တစ်ဆင့်တွေ

- [Component များကြား State မျှဝေခြင်း](/docs/react/sharing-state-between-components) — state lifting ဖြင့် component နှစ်ခုကို ညှိနှိုင်းခြင်း
- [State နဲ့ Rendering](/docs/react/state-snapshot) — state update တွေ ဘယ်လို အလုပ်လုပ်သလဲ
