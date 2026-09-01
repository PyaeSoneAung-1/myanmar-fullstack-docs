---
title: "Custom Hooks တွေနဲ့ Logic ပြန်လည်အသုံးပြုခြင်း (Reusing Logic with Custom Hooks)"
description: "Custom Hooks တွေဆိုတာ ဘာလဲ၊ ကိုယ်ပိုင်တစ်ခု ဘယ်လို ရေးမလဲ — component တွေကြား logic မျှဝေခြင်း၊ Hook နာမည်ပေးနည်း စည်းမျဉ်းတွေ၊ reactive values ပို့ခြင်း၊ event handlers ပို့ခြင်း၊ custom Hooks တွေကို ဘယ်အခါ ထုတ်ယူမလဲ"
order: 31
source: "https://react.dev/learn/reusing-logic-with-custom-hooks"
status: translated
updated: 2026-09-01
---

React မှာ `useState`၊ `useContext` နဲ့ `useEffect` လိုမျိုး built-in Hooks တွေ အများကြီး ပါဝင်ပါတယ်။ တစ်ခါတစ်ရံ — data fetch လုပ်ဖို့၊ user online ဖြစ်မဖြစ် ခြေရာခံဖို့၊ ဒါမှမဟုတ် chat room တစ်ခုဆီ ချိတ်ဆက်ဖို့လိုမျိုး — ပိုတိကျတဲ့ ရည်ရွယ်ချက်အတွက် Hook တစ်ခု ရှိစေချင်တာမျိုး ရှိပါလိမ့်မယ်။ ဒီလို Hooks တွေကို React ထဲမှာ ရှာမတွေ့နိုင်ပေမယ့် — သင့် application ရဲ့ လိုအပ်ချက်တွေအတွက် ကိုယ်ပိုင် Hooks တွေ ဖန်တီးနိုင်ပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- Custom Hooks ဆိုတာ ဘာလဲ — ကိုယ်ပိုင်တစ်ခုကို ဘယ်လို ရေးမလဲ
- Component တွေကြားမှာ logic တွေကို ဘယ်လို ပြန်သုံးမလဲ
- သင့် custom Hooks တွေကို ဘယ်လို နာမည်ပေး/ဖွဲ့စည်းမလဲ
- Custom Hooks တွေကို ဘယ်အချိန်/ဘာကြောင့် ထုတ်ယူမလဲ

## Custom Hooks — Component တွေကြားမှာ Logic မျှဝေခြင်း

သင်က network ပေါ်မှာ အရမ်း မှီခိုနေတဲ့ app တစ်ခု (app အများစုလိုပဲ) ဖန်တီးနေတယ်လို့ စိတ်ကူးကြည့်ပါ။ သုံးနေတုန်း — သင့် network connection က မတော်တဆ ပြတ်သွားရင် user ကို သတိပေးချင်ပါတယ်။ ဘယ်လို လုပ်မလဲ? သင့် component ထဲမှာ အရာနှစ်ခု လိုပုံရပါတယ်:

1. Network online ဖြစ်မဖြစ် ခြေရာခံတဲ့ state တစ်ခု။
2. Global [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) နဲ့ [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) events တွေကို subscribe လုပ်ပြီး — အဲဒီ state ကို update လုပ်တဲ့ Effect တစ်ခု။

ဒါက သင့် component ကို [network status နဲ့ ထပ်တူဖြစ်နေစေပါလိမ့်မယ်](/docs/react/synchronizing-with-effects)။ ဒီလိုမျိုး စတင်ရေးနိုင်ပါတယ်:

```jsx
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

သင့် network ကို ဖွင့်/ပိတ် လုပ်ကြည့်ပြီး — ဒီ `StatusBar` က သင့် action တွေကို တုံ့ပြန်ပြီး update ဖြစ်တာ သတိပြုပါ။

အခု — အဲဒီ logic ကိုပဲ တခြား component တစ်ခုမှာလည်း သုံးချင်တယ်ဆိုပါစို့။ Network ပြတ်နေချိန်မှာ — disabled ဖြစ်ပြီး "Save" အစား "Reconnecting..." ပြတဲ့ Save button တစ်ခု implement လုပ်ချင်ပါတယ်။

စဖို့ — `isOnline` state နဲ့ Effect ကို copy/paste ပြီး `SaveButton` ထဲ ထည့်နိုင်ပါတယ်:

```jsx
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

Network ပိတ်လိုက်ရင် — button ရဲ့ အသွင်အပြင် ပြောင်းသွားတာ စစ်ဆေးကြည့်ပါ။

Component နှစ်ခုလုံး ကောင်းကောင်း အလုပ်လုပ်ပေမယ့် — သူတို့ကြားက logic ထပ်နေတာကတော့ မကောင်းပါဘူး။ သူတို့က *visual appearance* ချင်း မတူပေမယ့် — သူတို့ကြားမှာ logic ကို ပြန်သုံးချင်ပုံရပါတယ်။

### Component တစ်ခုကနေ ကိုယ်ပိုင် Custom Hook တစ်ခု ထုတ်ယူခြင်း

[`useState`](/docs/react/useState) နဲ့ [`useEffect`](/docs/react/useEffect) လိုပဲ — built-in `useOnlineStatus` Hook တစ်ခု ရှိခဲ့ရင် ကောင်းမယ်လို့ ခဏ စိတ်ကူးကြည့်ပါ။ အဲဒါဆိုရင် — component နှစ်ခုလုံးကို ရိုးရှင်းအောင် လုပ်နိုင်ပြီး — သူတို့ကြားက ထပ်နေမှုကို ဖယ်ရှားနိုင်ပါလိမ့်မယ်:

```jsx
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

ဒီလို built-in Hook မရှိပေမယ့် — သင်ကိုယ်တိုင် ရေးလို့ရပါတယ်။ `useOnlineStatus` လို့ခေါ်တဲ့ function တစ်ခု ကြေညာပြီး — အရင်က ရေးထားတဲ့ component တွေထဲက ထပ်နေတဲ့ code အားလုံးကို အဲဒီထဲ ရွှေ့လိုက်ပါ:

```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

Function ရဲ့ အဆုံးမှာ `isOnline` ကို ပြန်ပေးပါ။ ဒါက သင့် component တွေကို အဲဒီတန်ဖိုး ဖတ်နိုင်စေပါတယ်:

```jsx
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js
// useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

Network ဖွင့်/ပိတ် လုပ်လိုက်တာနဲ့ — component နှစ်ခုလုံး update ဖြစ်တာ စစ်ဆေးကြည့်ပါ။

အခု သင့် component တွေမှာ ထပ်နေတဲ့ logic တွေ သိပ်မရှိတော့ပါဘူး။ **ပိုအရေးကြီးတာက — သူတို့ထဲက code က *ဘယ်လို လုပ်ရမယ်* (browser events တွေကို subscribe လုပ်တာ) ထက် — *ဘာလုပ်ချင်လဲ* (online status ကို သုံးချင်တာ!) ဆိုတာကို ဖော်ပြတာပါ။**

Logic တွေကို custom Hooks အဖြစ် ထုတ်ယူတဲ့အခါ — external system တစ်ခုခု ဒါမှမဟုတ် browser API တစ်ခုကို ကိုင်တွယ်တဲ့ ရှုပ်ထွေးတဲ့ အသေးစိတ်တွေကို ဖုံးကွယ်ထားနိုင်ပါတယ်။ သင့် component တွေရဲ့ code က — implementation မဟုတ်ဘဲ — သင့် ရည်ရွယ်ချက်ကို ဖော်ပြပါတယ်။

### Hook နာမည်တွေက `use` နဲ့ အမြဲ စတင်ရမယ်

React application တွေက component တွေနဲ့ တည်ဆောက်ပါတယ်။ Component တွေက — built-in ဖြစ်ဖြစ် custom ဖြစ်ဖြစ် — Hooks တွေနဲ့ တည်ဆောက်ပါတယ်။ တခြားသူတွေ ရေးထားတဲ့ custom Hooks တွေကို မကြာခဏ သုံးဖြစ်ပေမယ့် — တစ်ခါတစ်ရံ — ကိုယ်တိုင်လည်း တစ်ခု ရေးဖြစ်နိုင်ပါတယ်!

ဒီ naming conventions တွေကို လိုက်နာရပါမယ်:

1. **React component နာမည်တွေက capital letter နဲ့ စရမယ်** — `StatusBar` နဲ့ `SaveButton` လိုမျိုးပါ။ React component တွေက JSX အပိုင်းတစ်ပိုင်းလိုမျိုး — React က ဘယ်လို ပြသရမယ်ဆိုတာ သိတဲ့ အရာတစ်ခုခုကိုလည်း ပြန်ပေးဖို့ လိုပါတယ်။
2. **Hook နာမည်တွေက `use` နဲ့ စပြီး — capital letter တစ်လုံး လိုက်ရမယ်** — [`useState`](/docs/react/useState) (built-in) ဒါမှမဟုတ် `useOnlineStatus` (ဒီစာမျက်နှာ အစောပိုင်းက custom တစ်ခု) လိုမျိုးပါ။ Hooks တွေက ကြိုက်တဲ့ တန်ဖိုး ဘာမဆို ပြန်ပေးနိုင်ပါတယ်။

ဒီ convention က — component တစ်ခုကို ကြည့်လိုက်ရင် — သူ့ရဲ့ state၊ Effects နဲ့ တခြား React features တွေ ဘယ်မှာ "ပုန်းနေမယ်"ဆိုတာ အမြဲ သိနိုင်စေဖို့ အာမခံပါတယ်။ ဥပမာ — သင့် component ထဲမှာ `getColor()` function call တစ်ခု တွေ့ရင် — သူ့နာမည်က `use` နဲ့ မစတင်လို့ — အတွင်းမှာ React state ပါနိုင်စရာ မရှိဘူးဆိုတာ သေချာနိုင်ပါတယ်။ ဒါပေမယ့် — `useOnlineStatus()` လိုမျိုး function call တစ်ခုကတော့ — အတွင်းမှာ တခြား Hooks တွေကို ခေါ်နေဖို့ အလားအလာ အရမ်းများပါတယ်!

> **မှတ်ချက်:** သင့် linter က [React အတွက် configure လုပ်ထားရင်](/docs/react/editor-setup#linting) — ဒီ naming convention ကို ပြဋ္ဌာန်းပါလိမ့်မယ်။ အထက်က sandbox ဆီ scroll တက်ပြီး — `useOnlineStatus` ကို `getOnlineStatus` လို့ ပြန်မှည့်ကြည့်ပါ။ Linter က အဲဒီအတွင်းမှာ `useState` ဒါမှမဟုတ် `useEffect` ခေါ်တော့ ခွင့်မပြုတော့တာ သတိပြုပါ။ Hooks တွေနဲ့ components တွေကပဲ တခြား Hooks တွေကို ခေါ်လို့ရပါတယ်!

#### Rendering အတွင်း ခေါ်တဲ့ Function အားလုံး use Prefix နဲ့ စသင့်လား

မသင့်ပါ။ Hooks တွေကို *မခေါ်*တဲ့ Functions တွေက Hooks *ဖြစ်စရာ* မလိုပါဘူး။

သင့် function က Hook တစ်ခုခုကို မခေါ်ဘူးဆိုရင် — `use` prefix ကို ရှောင်ပါ။ အဲဒီအစား — `use` prefix *မပါတဲ့* ပုံမှန် function တစ်ခုအနေနဲ့ ရေးပါ။ ဥပမာ — အောက်က `useSorted` က Hooks တွေ မခေါ်လို့ — အဲဒါကို `getSorted` လို့ ခေါ်ပါ:

```js
// 🔴 Avoid: A Hook that doesn't use Hooks → ရှောင်ပါ: Hooks မသုံးတဲ့ Hook
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Good: A regular function that doesn't use Hooks → ကောင်းပါတယ်: Hooks မသုံးတဲ့ ပုံမှန် function
function getSorted(items) {
  return items.slice().sort();
}
```

ဒါက သင့် code ကို — conditions တွေ အပါအဝင် — ဘယ်နေရာမှာမဆို — ဒီ ပုံမှန် function ကို ခေါ်နိုင်စေပါတယ်:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ It's ok to call getSorted() conditionally because it's not a Hook → Hook မဟုတ်လို့ getSorted() ကို conditionally ခေါ်တာ အဆင်ပြေပါတယ်
    displayedItems = getSorted(items);
  }
  // ...
}
```

Function တစ်ခုက အတွင်းမှာ Hook အနည်းဆုံး တစ်ခု သုံးရင် — အဲဒါကို `use` prefix ပေးသင့်ပါတယ် (ဒါကြောင့် Hook တစ်ခု ဖြစ်လာပါတယ်):

```js
// ✅ Good: A Hook that uses other Hooks → ကောင်းပါတယ်: တခြား Hooks တွေ သုံးတဲ့ Hook
function useAuth() {
  return useContext(Auth);
}
```

ဒါကို React က နည်းပညာအရ ပြဋ္ဌာန်းမထားပါဘူး။ သီအိုရီအရ — တခြား Hooks တွေ မခေါ်တဲ့ Hook တစ်ခု ဖန်တီးနိုင်ပါတယ်။ ဒါက မကြာခဏ ရှုပ်ထွေးစေပြီး ကန့်သတ်မှုလည်း ဖြစ်စေလို့ — အဲဒီ pattern ကို ရှောင်တာ အကောင်းဆုံးပါ။ ဒါပေမယ့် — အသုံးဝင်နိုင်တဲ့ ရှားပါးကိစ္စတွေ ရှိနိုင်ပါတယ်။ ဥပမာ — သင့် function က အခု Hooks ဘာမှ မသုံးသေးပေမယ့် — နောက်ပိုင်းမှာ Hook calls တချို့ ထည့်ဖို့ စီစဉ်ထားတာမျိုးပါ။ အဲဒီအခါ — `use` prefix နဲ့ နာမည်ပေးတာ အဓိပ္ပာယ်ရှိပါတယ်:

```js
// ✅ Good: A Hook that will likely use some other Hooks later → ကောင်းပါတယ်: နောက်ပိုင်းမှာ တခြား Hooks တွေ သုံးနိုင်ဖွယ်ရှိတဲ့ Hook
function useAuth() {
  // TODO: Replace with this line when authentication is implemented:
  // return useContext(Auth);
  return TEST_USER;
}
```

အဲဒီအခါ — component တွေက အဲဒါကို conditionally ခေါ်လို့ မရတော့ပါဘူး။ အတွင်းမှာ တကယ် Hook calls တွေ ထည့်တဲ့အခါ — ဒါက အရေးကြီးလာပါလိမ့်မယ်။ အတွင်းမှာ Hooks တွေ (အခုရော နောက်ရော) သုံးဖို့ မစီစဉ်ဘူးဆိုရင် — Hook တစ်ခု မလုပ်ပါနဲ့။

### Custom Hooks တွေက Stateful Logic ကို မျှဝေတာ — State ကိုယ်တိုင် မဟုတ်ဘူး

အစောပိုင်း ဥပမာမှာ — network ဖွင့်/ပိတ် လုပ်တဲ့အခါ — component နှစ်ခုလုံး အတူတူ update ဖြစ်ပါတယ်။ ဒါပေမယ့် — `isOnline` state variable တစ်ခုတည်းကို သူတို့ကြားမှာ မျှဝေထားတယ်လို့ တွေးတာက မှားပါတယ်။ ဒီ code ကို ကြည့်ပါ:

```jsx
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

ဒါက — ထပ်နေမှုကို မထုတ်ယူခင် အတိုင်း — ပုံစံတူ အလုပ်လုပ်ပါတယ်:

```jsx
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

ဒါတွေက — လုံးဝ သီးခြားဖြစ်တဲ့ state variables နဲ့ Effects နှစ်ခုပါ! သူတို့က တူညီတဲ့ external တန်ဖိုး (network ဖွင့်ထားလား) နဲ့ ထပ်တူပြုထားလို့ — တစ်ချိန်တည်းမှာ တန်ဖိုးအတူတူ ရှိနေတာပါ။

ဒါကို ပိုရှင်းအောင် သရုပ်ပြဖို့ — ဥပမာ ခြားတစ်ခု လိုပါတယ်။ ဒီ `Form` component ကို စဉ်းစားကြည့်ပါ:

```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

Form field တစ်ခုချင်းစီအတွက် ထပ်နေတဲ့ logic အနည်းငယ် ရှိပါတယ်:

1. State အပိုင်းတစ်ပိုင်း (`firstName` နဲ့ `lastName`)။
2. Change handler တစ်ခု (`handleFirstNameChange` နဲ့ `handleLastNameChange`)။
3. အဲဒီ input အတွက် `value` နဲ့ `onChange` attributes တွေကို သတ်မှတ်ပေးတဲ့ JSX အပိုင်းတစ်ပိုင်း။

ထပ်နေတဲ့ logic ကို — ဒီ `useFormInput` custom Hook ထဲ ထုတ်ယူနိုင်ပါတယ်:

```jsx
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js
// useFormInput.js
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

ဒါက state variable *တစ်ခုတည်း* — `value` လို့ခေါ်တာကိုပဲ ကြေညာတာ သတိပြုပါ။

ဒါပေမယ့် — `Form` component က `useFormInput` ကို *နှစ်ကြိမ်* ခေါ်ပါတယ်:

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

ဒါကြောင့်ပဲ — state variables သီးခြားနှစ်ခု ကြေညာသလို အလုပ်လုပ်တာပါ!

**Custom Hooks တွေက *stateful logic* ကို မျှဝေနိုင်တာ — *state ကိုယ်တိုင်* မဟုတ်ပါဘူး။ Hook တစ်ခုရဲ့ ခေါ်မှုတစ်ခုစီက — အဲဒီ Hook ရဲ့ တခြား ခေါ်မှုတွေနဲ့ လုံးဝ သီးခြားပါ။** ဒါကြောင့် — အထက်က sandbox နှစ်ခုက လုံးဝ တူညီတာပါ။ လိုချင်ရင် — အပေါ်ကို scroll တက်ပြီး နှိုင်းယှဉ်ကြည့်နိုင်ပါတယ်။ Custom Hook ထုတ်ယူခင်/ပြီးနောက် အပြုအမူက တူညီပါတယ်။

State ကိုယ်တိုင်ကို component အများအပြားကြားမှာ မျှဝေဖို့ လိုအပ်ရင် — [state ကို lift လုပ်ပြီး အောက်ကို ပို့ပါ](/docs/react/sharing-state-between-components)။

## Hooks တွေကြားမှာ Reactive Values တွေ ပို့ခြင်း

သင့် custom Hooks တွေထဲက code က — သင့် component ရဲ့ re-render တိုင်းမှာ ပြန်လည် run ပါလိမ့်မယ်။ ဒါကြောင့် — component တွေလိုပဲ — custom Hooks တွေ [pure ဖြစ်ဖို့ လိုပါတယ်](/docs/react/keeping-components-pure)။ Custom Hook တစ်ခုရဲ့ code ကို သင့် component ရဲ့ body အစိတ်အပိုင်းတစ်ခုလို တွေးပါ!

Custom Hooks တွေက သင့် component နဲ့အတူ re-render ဖြစ်တာမို့ — သူတို့က နောက်ဆုံး props နဲ့ state တွေကို အမြဲ လက်ခံရရှိပါတယ်။ ဒါက ဘာကို ဆိုလိုလဲဆိုတာ မြင်ဖို့ — ဒီ chat room ဥပမာကို စဉ်းစားပါ။ Server URL ဒါမှမဟုတ် chat room ကို ပြောင်းကြည့်ပါ:

```jsx
// App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```jsx
// ChatRoom.js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js
// chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server → တကယ့် implementation က server ဆီ တကယ် ချိတ်ဆက်ပါလိမ့်မယ်
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js
// notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

`serverUrl` ဒါမှမဟုတ် `roomId` ကို ပြောင်းလိုက်ရင် — Effect က သင့် ပြောင်းလဲမှုတွေကို ["react" လုပ်ပြီး](/docs/react/lifecycle-of-reactive-effects#effects-react-to-reactive-values) — re-synchronize လုပ်ပါတယ်။ သင့် Effect ရဲ့ dependencies တွေ ပြောင်းတိုင်း — chat က ပြန်ချိတ်ဆက်တာကို console messages တွေကနေ သိနိုင်ပါတယ်။

အခု Effect ရဲ့ code ကို custom Hook တစ်ခုထဲ ရွှေ့လိုက်ပါ:

```js
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

ဒါက သင့် `ChatRoom` component ကို — အတွင်းမှာ ဘယ်လို အလုပ်လုပ်လဲဆိုတာ စိတ်ပူစရာမလိုဘဲ — သင့် custom Hook ကို ခေါ်နိုင်စေပါတယ်:

```jsx
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

ဒါက အများကြီး ပိုရိုးရှင်းပါတယ်! (ဒါပေမယ့် — တူတူပဲ လုပ်ပါတယ်။)

Logic က props နဲ့ state ပြောင်းလဲမှုတွေကို *ဆက်ပြီး တုံ့ပြန်နေဆဲ* ဆိုတာ သတိပြုပါ။ Server URL ဒါမှမဟုတ် ရွေးထားတဲ့ room ကို တည်းဖြတ်ကြည့်ပါ:

```jsx
// App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```jsx
// ChatRoom.js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js
// useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js
// chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server → တကယ့် implementation က server ဆီ တကယ် ချိတ်ဆက်ပါလိမ့်မယ်
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js
// notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

သင်က Hook တစ်ခုရဲ့ return value ကို ယူပြီး:

```jsx
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

နောက် Hook တစ်ခုရဲ့ input အဖြစ် ပို့ပေးနေတာ သတိပြုပါ:

```jsx
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

သင့် `ChatRoom` component re-render ဖြစ်တိုင်း — သင့် Hook ဆီ နောက်ဆုံး `roomId` နဲ့ `serverUrl` တွေကို ပို့ပေးပါတယ်။ ဒါကြောင့် — re-render ပြီးနောက်မှာ သူတို့ရဲ့ တန်ဖိုးတွေ မတူတော့ဘူးဆိုရင် — သင့် Effect က chat ဆီ ပြန်ချိတ်ဆက်တာပါ။ (Audio ဒါမှမဟုတ် video processing software တွေ သုံးဖူးရင် — ဒီလို Hooks တွေ ဆက်တိုက် chain လုပ်တာက — visual ဒါမှမဟုတ် audio effects တွေ chain လုပ်တာကို သတိရစေနိုင်ပါတယ်။ `useState` ရဲ့ output က `useChatRoom` ရဲ့ input ထဲ "စီးဝင်သွား"သလိုပါပဲ။)

### Custom Hooks တွေဆီ Event Handlers တွေ ပို့ခြင်း

`useChatRoom` ကို component အများအပြားမှာ စသုံးလာတာနဲ့အမျှ — component တွေကို သူ့ရဲ့ အပြုအမူ စိတ်ကြိုက်ပြင်ဆင်ခွင့် ပေးချင်လာနိုင်ပါတယ်။ ဥပမာ — လက်ရှိမှာ — message တစ်ခု ရောက်လာရင် ဘာလုပ်ရမယ်ဆိုတဲ့ logic က Hook အတွင်းမှာ hardcode လုပ်ထားပါတယ်:

```js
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

ဒီ logic ကို သင့် component ထဲ ပြန်ရွှေ့ချင်တယ်ဆိုပါစို့:

```jsx
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

ဒါ အလုပ်ဖြစ်ဖို့ — သင့် custom Hook ကို — သူ့ရဲ့ named options တွေထဲက တစ်ခုအနေနဲ့ `onReceiveMessage` ကို လက်ခံအောင် ပြောင်းပါ:

```js
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ All dependencies declared → dependencies အားလုံး ကြေညာပြီးပါပြီ
}
```

ဒါက အလုပ်လုပ်ပါလိမ့်မယ် — ဒါပေမယ့် — သင့် custom Hook က event handlers တွေ လက်ခံတဲ့အခါ — နောက်ထပ် တိုးတက်မှု တစ်ခု လုပ်နိုင်ပါသေးတယ်။

`onReceiveMessage` ပေါ်မှာ dependency တစ်ခု ထည့်တာက အကောင်းဆုံး မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ ဒါက component re-render ဖြစ်တိုင်း — chat ကို ပြန်ချိတ်ဆက်စေလို့ပါ။ [ဒီ event handler ကို Effect Event တစ်ခုထဲ ထုပ်ပြီး — dependencies တွေကနေ ဖယ်ရှားပါ:](/docs/react/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared → dependencies အားလုံး ကြေညာပြီးပါပြီ
}
```

အခု `ChatRoom` component re-render ဖြစ်တိုင်း — chat က ပြန်ချိတ်ဆက်တော့မှာ မဟုတ်ပါဘူး။ ဒီမှာ — custom Hook တစ်ခုဆီ event handler တစ်ခု ပို့ပြီး — လက်တွေ့ ကစားလို့ရတဲ့ — အပြည့်အဝ အလုပ်လုပ်တဲ့ demo တစ်ခုပါ:

```jsx
// App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```jsx
// ChatRoom.js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js
// useChatRoom.js
import { useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js
// chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server → တကယ့် implementation က server ဆီ တကယ် ချိတ်ဆက်ပါလိမ့်မယ်
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js
// notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

`useChatRoom` *ဘယ်လို* အလုပ်လုပ်လဲဆိုတာ သိစရာမလိုဘဲ သုံးနိုင်တော့တာ သတိပြုပါ။ အဲဒါကို တခြား component ဘယ်မှာမဆို ထည့်နိုင်၊ တခြား options တွေ ပို့နိုင်ပြီး — ပုံစံတူ အလုပ်လုပ်ပါလိမ့်မယ်။ ဒါက custom Hooks ရဲ့ စွမ်းအားပါ။

## Custom Hooks တွေကို ဘယ်အခါ သုံးမလဲ

ထပ်နေတဲ့ code အပိုင်းလေးတိုင်းအတွက် — custom Hook တစ်ခု ထုတ်ယူဖို့ မလိုပါဘူး။ ထပ်နေမှု တချို့က ရပါတယ်။ ဥပမာ — `useState` call တစ်ခုတည်းကို ထုပ်ဖို့ အစောပိုင်းကလို `useFormInput` Hook တစ်ခု ထုတ်ယူတာက — ဖြစ်နိုင်ခြေ မရှိတော့လောက်အောင် မလိုအပ်ပါဘူး။

ဒါပေမယ့် — Effect တစ်ခု ရေးတိုင်း — အဲဒါကို custom Hook တစ်ခုထဲမှာလည်း ထုပ်ရင် ပိုရှင်းမလားဆိုတာ စဉ်းစားပါ။ [Effects တွေကို မကြာခဏ မလိုအပ်သင့်ပါဘူး](/docs/react/you-might-not-need-an-effect) — ဒါကြောင့် — တစ်ခု ရေးနေတယ်ဆိုရင် — external system တစ်ခုခုနဲ့ ထပ်တူပြုဖို့ ဒါမှမဟုတ် React မှာ built-in API မရှိတဲ့ တစ်ခုခု လုပ်ဖို့ — React ရဲ့ "အပြင်ကို ထွက်" ဖို့ လိုနေတာ ဆိုလိုပါတယ်။ အဲဒါကို custom Hook တစ်ခုထဲ ထုပ်လိုက်ခြင်းက — သင့် ရည်ရွယ်ချက်နဲ့ data သူ့ကနေ ဘယ်လို စီးဆင်းလဲဆိုတာကို — တိကျစွာ ဆက်သွယ်ပြောပြနိုင်စေပါတယ်။

ဥပမာ — dropdown နှစ်ခု ပြတဲ့ `ShippingForm` component တစ်ခုကို စဉ်းစားကြည့်ပါ: တစ်ခုက မြို့တွေရဲ့ စာရင်းပြပြီး — နောက်တစ်ခုက ရွေးထားတဲ့ မြို့ထဲက နယ်မြေတွေရဲ့ စာရင်းပြပါတယ်။ ဒီလိုမျိုး code နဲ့ စတင်နိုင်ပါတယ်:

```jsx
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // This Effect fetches cities for a country → ဒီ Effect က နိုင်ငံတစ်ခုအတွက် မြို့တွေကို fetch လုပ်ပါတယ်
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // This Effect fetches areas for the selected city → ဒီ Effect က ရွေးထားတဲ့ မြို့အတွက် နယ်မြေတွေကို fetch လုပ်ပါတယ်
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

ဒီ code က အတော်လေး ထပ်နေပေမယ့် — [ဒီ Effects တွေကို တစ်ခုနဲ့တစ်ခု သီးခြားထားတာ မှန်ပါတယ်](/docs/react/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things)။ သူတို့က မတူတဲ့ အရာနှစ်ခုကို ထပ်တူပြုတာမို့ — Effect တစ်ခုထဲ ပေါင်းလို့ မရပါဘူး။ အဲဒီအစား — သူတို့ကြားက common logic ကို ကိုယ်ပိုင် `useData` Hook တစ်ခုထဲ ထုတ်ယူခြင်းဖြင့် — အထက်က `ShippingForm` component ကို ရိုးရှင်းအောင် လုပ်နိုင်ပါတယ်:

```jsx
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

အခု `ShippingForm` component ထဲက Effects နှစ်ခုလုံးကို — `useData` ခေါ်မှုတွေနဲ့ အစားထိုးနိုင်ပါတယ်:

```jsx
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

Custom Hook တစ်ခု ထုတ်ယူခြင်းက data flow ကို ရှင်းလင်းစေပါတယ်။ `url` ကို ထည့်လိုက်ပြီး — `data` ကို ပြန်ရပါတယ်။ Effect ကို `useData` အတွင်းမှာ "ဖုံးထား"ခြင်းဖြင့် — `ShippingForm` component မှာ အလုပ်လုပ်နေသူတစ်ယောက်က [မလိုအပ်တဲ့ dependencies တွေ](/docs/react/removing-effect-dependencies) ထည့်တာကိုလည်း တားဆီးပေးပါတယ်။ အချိန်ကြာလာတာနဲ့အမျှ — သင့် app ရဲ့ Effects အများစုက custom Hooks တွေထဲမှာ ရှိသွားပါလိမ့်မယ်။

#### သင့် Custom Hooks တွေကို Concrete High-Level Use Cases တွေမှာ အာရုံစိုက်ထားပါ

သင့် custom Hook ရဲ့ နာမည်ကို ရွေးချယ်ခြင်းဖြင့် စတင်ပါ။ ရှင်းလင်းတဲ့ နာမည်တစ်ခု ရွေးဖို့ ရုန်းကန်နေရရင် — သင့် Effect က သင့် component ရဲ့ ကျန် logic တွေနဲ့ အရမ်း ဆက်စပ်နေပြီး — ထုတ်ယူဖို့ အသင့်မဖြစ်သေးဘူးလို့ ဆိုလိုနိုင်ပါတယ်။

စံပြအနေနဲ့ — သင့် custom Hook ရဲ့ နာမည်က — code မရေးတတ်တဲ့သူတစ်ယောက်တောင် — သင့် custom Hook က ဘာလုပ်တယ်၊ ဘာတွေ ယူတယ်၊ ဘာတွေ ပြန်ပေးတယ်ဆိုတာ ခန့်မှန်းနိုင်လောက်အောင် ရှင်းနေသင့်ပါတယ်:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

External system တစ်ခုနဲ့ ထပ်တူပြုတဲ့အခါ — သင့် custom Hook နာမည်က ပိုနည်းပညာပိုင်း ဖြစ်နိုင်ပြီး — အဲဒီ system အတွက် သီးသန့် jargon တွေ သုံးနိုင်ပါတယ်။ အဲဒီ system နဲ့ ရင်းနှီးတဲ့သူတစ်ယောက်အတွက် ရှင်းသရွေ့ ကောင်းပါတယ်:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**Custom Hooks တွေကို concrete high-level use cases တွေမှာ အာရုံစိုက်ထားပါ။** `useEffect` API ကိုယ်တိုင်အတွက် — အခြားရွေးချယ်စရာနဲ့ convenience wrapper တွေအနေနဲ့ ပြုမူတဲ့ custom "lifecycle" Hooks တွေကို ဖန်တီး/သုံးတာ ရှောင်ပါ:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

ဥပမာ — ဒီ `useMount` Hook က code တချို့ "mount ပေါ်မှာ"ပဲ run ကြောင်း သေချာဖို့ ကြိုးစားပါတယ်:

```jsx
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Avoid: using custom "lifecycle" Hooks → ရှောင်ပါ: custom "lifecycle" Hooks တွေ သုံးတာ
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Avoid: creating custom "lifecycle" Hooks → ရှောင်ပါ: custom "lifecycle" Hooks တွေ ဖန်တီးတာ
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'fn'
}
```

**`useMount` လိုမျိုး custom "lifecycle" Hooks တွေက React paradigm နဲ့ ကောင်းကောင်း မလိုက်ဖက်ပါဘူး။** ဥပမာ — ဒီ code ဥပမာမှာ အမှားတစ်ခု ရှိပါတယ် (`roomId` ဒါမှမဟုတ် `serverUrl` ပြောင်းလဲမှုတွေကို "react" မလုပ်ပါဘူး) — ဒါပေမယ့် — linter က အဲဒါကို သတိပေးမှာ မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ linter က တိုက်ရိုက် `useEffect` calls တွေကိုပဲ စစ်ဆေးလို့ပါ။ သင့် Hook အကြောင်း သူ မသိပါဘူး။

Effect တစ်ခု ရေးနေတယ်ဆိုရင် — React API ကို တိုက်ရိုက် သုံးပြီး စတင်ပါ:

```jsx
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Good: two raw Effects separated by purpose → ကောင်းပါတယ်: ရည်ရွယ်ချက်အလိုက် ခွဲထားတဲ့ raw Effects နှစ်ခု

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

ပြီးရင် — high-level use cases အမျိုးမျိုးအတွက် — custom Hooks တွေ ထုတ်ယူနိုင်ပါတယ် (မလုပ်လည်း ရပါတယ်):

```jsx
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Great: custom Hooks named after their purpose → ကောင်းပါတယ်: သူတို့ရဲ့ ရည်ရွယ်ချက်အလိုက် နာမည်ပေးထားတဲ့ custom Hooks
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**Custom Hook ကောင်းတစ်ခုက — သူလုပ်နိုင်တာတွေကို ကန့်သတ်ခြင်းဖြင့် — calling code ကို ပိုပြီး declarative ဖြစ်စေပါတယ်။** ဥပမာ — `useChatRoom(options)` က chat room တစ်ခုဆီပဲ ချိတ်ဆက်နိုင်ပြီး — `useImpressionLog(eventName, extraData)` က analytics ဆီ impression log တစ်ခုပဲ ပို့နိုင်ပါတယ်။ သင့် custom Hook API က use cases တွေကို မကန့်သတ်ဘဲ အရမ်း abstract ဖြစ်နေရင် — ရေရှည်မှာ — ဖြေရှင်းတာထက် ပြဿနာ ပိုများလာနိုင်ပါတယ်။

### Custom Hooks တွေက ပိုကောင်းတဲ့ Patterns တွေဆီ ပြောင်းရွှေ့ဖို့ ကူညီပေးပါတယ်

Effects တွေက ["escape hatch"](/docs/react/escape-hatches) တစ်ခုပါ — React ရဲ့ "အပြင်ကို ထွက်" ဖို့ လိုတဲ့အခါ၊ သင့် use case အတွက် ပိုကောင်းတဲ့ built-in solution မရှိတဲ့အခါ — သူတို့ကို သုံးပါတယ်။ အချိန်ကြာလာတာနဲ့အမျှ — React team ရဲ့ ပန်းတိုင်က — ပိုတိကျတဲ့ ပြဿနာတွေအတွက် ပိုတိကျတဲ့ solutions တွေ ပေးခြင်းဖြင့် — သင့် app ထဲက Effects အရေအတွက်ကို အနည်းဆုံးအထိ လျှော့ချဖို့ပါ။ သင့် Effects တွေကို custom Hooks တွေထဲ ထုပ်ထားခြင်းက — ဒီ solutions တွေ ရနိုင်လာတဲ့အခါ — သင့် code ကို upgrade လုပ်ဖို့ ပိုလွယ်ကူစေပါတယ်။

ဒီဥပမာကို ပြန်ကြည့်ရအောင်:

```jsx
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js
// useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

အထက်က ဥပမာမှာ — `useOnlineStatus` ကို [`useState`](/docs/react/useState) နဲ့ [`useEffect`](/docs/react/useEffect) အတွဲတစ်တွဲနဲ့ implement လုပ်ထားပါတယ်။ ဒါပေမယ့် — ဒါက အကောင်းဆုံး ဖြေရှင်းနည်း မဟုတ်ပါဘူး။ သူ မစဉ်းစားမိတဲ့ edge cases တွေ အများကြီး ရှိပါတယ်။ ဥပမာ — component mount ဖြစ်တဲ့အခါ — `isOnline` က `true` ပြီးသားလို့ ယူဆထားပေမယ့် — network က ကြိုပြီး ပြတ်နေပြီးသားဆိုရင် — ဒါ မှားနိုင်ပါတယ်။ အဲဒါကို စစ်ဖို့ browser ရဲ့ [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) API ကို သုံးနိုင်ပေမယ့် — ကနဦး HTML ထုတ်လုပ်ဖို့ server ပေါ်မှာတော့ — တိုက်ရိုက် သုံးတာ အလုပ်မလုပ်ပါဘူး။ တိုတိုပြောရရင် — ဒီ code ကို တိုးတက်အောင် လုပ်နိုင်ပါတယ်။

React မှာ ဒီပြဿနာတွေ အားလုံးကို သင့်အတွက် ရှင်းပေးတဲ့ [`useSyncExternalStore`](/docs/react/useSyncExternalStore) လို့ခေါ်တဲ့ သီးသန့် API တစ်ခု ပါဝင်ပါတယ်။ ဒီ API အသစ်ရဲ့ အားသာချက်ကို ယူဖို့ ပြန်ရေးထားတဲ့ သင့် `useOnlineStatus` Hook က ဒီမှာပါ:

```jsx
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js
// useOnlineStatus.js
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // How to get the value on the client → client ပေါ်မှာ တန်ဖိုး ဘယ်လို ရမလဲ
    () => true // How to get the value on the server → server ပေါ်မှာ တန်ဖိုး ဘယ်လို ရမလဲ
  );
}
```

ဒီ migration လုပ်ဖို့ — **component တွေထဲက ဘာတစ်ခုမှ ပြောင်းစရာ မလိုခဲ့တာ** သတိပြုပါ:

```jsx
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

ဒါက — Effects တွေကို custom Hooks တွေထဲ ထုပ်တာက မကြာခဏ အကျိုးရှိတဲ့ နောက်ထပ် အကြောင်းရင်းတစ်ခုပါ:

1. သင့် Effects တွေဆီ/ကနေ စီးဆင်းတဲ့ data ကို အရမ်း ရှင်းလင်းအောင် လုပ်နိုင်တယ်။
2. သင့် component တွေက — Effects တွေရဲ့ တိကျတဲ့ implementation အပေါ်မှာ မဟုတ်ဘဲ — ရည်ရွယ်ချက်ပေါ်မှာ အာရုံစိုက်နိုင်စေတယ်။
3. React က features အသစ်တွေ ထည့်တဲ့အခါ — component တစ်ခုခုကို မပြောင်းဘဲ — အဲဒီ Effects တွေကို ဖယ်ရှားနိုင်တယ်။

[Design system](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) တစ်ခုလိုပဲ — သင့် app ရဲ့ component တွေကနေ common idioms တွေကို custom Hooks အဖြစ် ထုတ်ယူဖို့ စတင်တာ အသုံးဝင်တာ တွေ့ရနိုင်ပါတယ်။ ဒါက သင့် component တွေရဲ့ code ကို ရည်ရွယ်ချက်ပေါ်မှာ အာရုံစိုက်နေစေပြီး — raw Effects တွေ မကြာခဏ ရေးရတာ ရှောင်နိုင်စေပါတယ်။ React community က ထိန်းသိမ်းထားတဲ့ ကောင်းမွန်တဲ့ custom Hooks တွေ အများကြီး ရှိပါတယ်။

#### React က Data Fetching အတွက် Built-In Solution တစ်ခု ပေးမှာလား

ဒီနေ့ — [`use`](/docs/react/use#streaming-data-from-server-to-client) API နဲ့ — [`use`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ဆီ [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) တစ်ခု ပို့ခြင်းဖြင့် — data ကို render ထဲမှာ ဖတ်နိုင်ပါတယ်:

```jsx
import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

အသေးစိတ်တွေကို ကျွန်တော်တို့ ဆက်လုပ်နေဆဲပါ — ဒါပေမယ့် — အနာဂတ်မှာ — data fetching တွေကို ဒီလိုမျိုး ရေးမယ်လို့ မျှော်လင့်ပါတယ်:

```jsx
import { use } from 'react';

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

သင့် app ထဲမှာ အထက်က `useData` လိုမျိုး custom Hooks တွေ သုံးထားရင် — component တိုင်းထဲမှာ raw Effects တွေကို လက်နဲ့ ရေးထားတာထက် — နောက်ဆုံး အကြံပြုမယ့် နည်းလမ်းဆီ migrate လုပ်ဖို့ — ပြောင်းလဲမှု ပိုနည်းပါလိမ့်မယ်။ ဒါပေမယ့် — နည်းလမ်းဟောင်းက ဆက်ပြီး ကောင်းကောင်း အလုပ်လုပ်နေဦးမှာမို့ — raw Effects တွေ ရေးရတာ ပျော်ရင် — ဆက်ရေးနိုင်ပါတယ်။

### လုပ်နည်းက တစ်ခုထက်မက ရှိပါတယ်

Browser ရဲ့ [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API ကို သုံးပြီး — fade-in animation တစ်ခုကို *သုညကနေ* implement လုပ်ချင်တယ်ဆိုပါစို့။ Animation loop တစ်ခု တည်ဆောက်တဲ့ Effect တစ်ခုနဲ့ စတင်နိုင်ပါတယ်။ Animation ရဲ့ frame တစ်ခုချင်းစီမှာ — [ref တစ်ခုထဲ ကိုင်ထားတဲ့](/docs/react/manipulating-the-dom-with-refs) DOM node ရဲ့ opacity ကို — `1` ရောက်တဲ့အထိ — ပြောင်းလဲနိုင်ပါတယ်။ သင့် code က ဒီလိုမျိုး စတင်နိုင်ပါတယ်:

```jsx
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint → ဆွဲရမယ့် frame တွေ ကျန်သေးပါတယ်
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

Component ကို ပိုဖတ်ရလွယ်အောင် — logic ကို `useFadeIn` custom Hook တစ်ခုထဲ ထုတ်ယူနိုင်ပါတယ်:

```jsx
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js
// useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint → ဆွဲရမယ့် frame တွေ ကျန်သေးပါတယ်
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

`useFadeIn` code ကို ဒီအတိုင်း ထားနိုင်သလို — ပိုပြီးလည်း refactor လုပ်နိုင်ပါတယ်။ ဥပမာ — animation loop တည်ဆောက်တဲ့ logic ကို `useFadeIn` ကနေ — custom `useAnimationLoop` Hook တစ်ခုထဲ ထုတ်ယူနိုင်ပါတယ်:

```jsx
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js
// useFadeIn.js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

ဒါပေမယ့် — အဲဒါ လုပ်ဖို့ *မလိုအပ်ပါဘူး*။ ပုံမှန် functions တွေလိုပဲ — နောက်ဆုံးမှာ — သင့် code ရဲ့ အစိတ်အပိုင်း အမျိုးမျိုးကြားမှာ နယ်နိမိတ်တွေကို ဘယ်မှာ ဆွဲမလဲဆိုတာ သင်ကိုယ်တိုင် ဆုံးဖြတ်ရပါတယ်။ လုံးဝ ကွဲပြားတဲ့ ချဉ်းကပ်မှုတစ်ခုလည်း ယူနိုင်ပါတယ် — logic ကို Effect ထဲမှာ ထားမယ့်အစား — imperative logic အများစုကို JavaScript [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) တစ်ခုထဲ ရွှေ့နိုင်ပါတယ်:

```jsx
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js
// useFadeIn.js
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js
// animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // We still have more frames to paint → ဆွဲရမယ့် frame တွေ ကျန်သေးပါတယ်
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

Effects တွေက React ကို external systems တွေနဲ့ ချိတ်ဆက်နိုင်စေပါတယ်။ Effects တွေကြားမှာ coordination ပိုလိုလေလေ (ဥပမာ — animations အများအပြားကို chain လုပ်ဖို့) — အထက်က sandbox ထဲမှာလိုပဲ — အဲဒီ logic ကို Effects နဲ့ Hooks တွေကနေ *လုံးဝ* ထုတ်ယူတာ ပိုအဓိပ္ပာယ်ရှိလေလေပါ။ အဲဒီအခါ — သင်ထုတ်ယူလိုက်တဲ့ code က "external system" *ဖြစ်သွားပါတယ်*။ ဒါက သင့် Effects တွေကို ရိုးရှင်းနေစေပါတယ် — ဘာလို့လဲဆိုတော့ သူတို့က React ရဲ့ အပြင်ဘက်ကို ရွှေ့ထားတဲ့ system ဆီ messages တွေ ပို့ဖို့ပဲ လိုလို့ပါ။

အထက်က ဥပမာတွေက — fade-in logic ကို JavaScript နဲ့ ရေးဖို့ လိုတယ်လို့ ယူဆထားပါတယ်။ ဒါပေမယ့် — ဒီ fade-in animation ကို — ရိုးရှင်းတဲ့ [CSS Animation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) တစ်ခုနဲ့ implement လုပ်ရင် — ပိုရိုးရှင်းပြီး — အများကြီး ပိုထိရောက်ပါတယ်:

```jsx
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
/* styles.css */
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css
/* welcome.css */
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
```

တစ်ခါတစ်ရံ — Hook တစ်ခုတောင် မလိုပါဘူး!

## အကျဉ်းချုပ်

- Custom Hooks တွေက component တွေကြားမှာ logic မျှဝေနိုင်စေပါတယ်။
- Custom Hooks တွေကို `use` နဲ့ စပြီး — capital letter တစ်လုံး လိုက်တဲ့ နာမည် ပေးရပါမယ်။
- Custom Hooks တွေက stateful logic ကိုပဲ မျှဝေတာ — state ကိုယ်တိုင် မဟုတ်ပါဘူး။
- Hook တစ်ခုကနေ နောက်တစ်ခုဆီ reactive values တွေ ပို့နိုင်ပြီး — သူတို့က up-to-date ဖြစ်နေပါတယ်။
- သင့် component re-render ဖြစ်တိုင်း — Hooks အားလုံး ပြန်လည် run ပါတယ်။
- သင့် custom Hooks တွေရဲ့ code က — သင့် component ရဲ့ code လိုပဲ — pure ဖြစ်သင့်ပါတယ်။
- Custom Hooks တွေ လက်ခံရရှိတဲ့ event handlers တွေကို Effect Events တွေထဲ ထုပ်ပါ။
- `useMount` လိုမျိုး custom Hooks တွေ မဖန်တီးပါနဲ့။ သူတို့ရဲ့ ရည်ရွယ်ချက်ကို တိကျအောင် ထားပါ။
- သင့် code ရဲ့ နယ်နိမိတ်တွေကို ဘယ်မှာ/ဘယ်လို ရွေးမလဲဆိုတာ သင့်အပေါ်မှာ မူတည်ပါတယ်။

## စိန်ခေါ်မှုများ (Challenges)

### `useCounter` Hook တစ်ခု ထုတ်ယူခြင်း

ဒီ component က — စက္ကန့်တိုင်း တိုးနေတဲ့ နံပါတ်တစ်ခုကို ပြသဖို့ — state variable တစ်ခုနဲ့ Effect တစ်ခုကို သုံးပါတယ်။ ဒီ logic ကို `useCounter` လို့ခေါ်တဲ့ custom Hook တစ်ခုထဲ ထုတ်ယူပါ။ သင့် ပန်းတိုင်က — `Counter` component ရဲ့ implementation ကို ဒီအတိုင်း အတိအကျ ဖြစ်အောင် လုပ်ဖို့ပါ:

```jsx
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

သင့် custom Hook ကို `useCounter.js` ထဲမှာ ရေးပြီး — `App.js` file ထဲ import လုပ်ဖို့ လိုပါလိမ့်မယ်။

```jsx
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js
// useCounter.js — ဒီ file ထဲမှာ သင့် custom Hook ကို ရေးပါ!
```

#### အဖြေ

သင့် code က ဒီလိုမျိုး ဖြစ်သင့်ပါတယ်:

```jsx
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js
// useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

`App.js` က `useState` ဒါမှမဟုတ် `useEffect` ကို ထပ်ပြီး import လုပ်စရာ မလိုတော့တာ သတိပြုပါ။

### Counter Delay ကို ပြောင်းလဲနိုင်အောင် လုပ်ခြင်း

ဒီဥပမာမှာ — slider တစ်ခုနဲ့ ထိန်းချုပ်ထားတဲ့ `delay` state variable တစ်ခု ရှိပေမယ့် — သူ့ရဲ့ တန်ဖိုးကို သုံးမထားပါဘူး။ `delay` တန်ဖိုးကို သင့် `useCounter` custom Hook ဆီ ပို့ပြီး — `useCounter` Hook ကို — `1000` ms hardcode လုပ်ထားမယ့်အစား — ပို့လိုက်တဲ့ `delay` ကို သုံးအောင် ပြောင်းပါ။

```jsx
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js
// useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

#### အဖြေ

`useCounter` ကို `delay` argument တစ်ခု လက်ခံအောင် ပြောင်းပြီး — `setInterval` ထဲမှာ hardcode `1000` မဟုတ်ဘဲ — အဲဒီ `delay` ကို သုံးပါ။ `useCounter` ရဲ့ code ထဲမှာ `delay` ကို သုံးနေတာမို့ — Effect ရဲ့ dependencies ထဲမှာလည်း ထည့်ဖို့ လိုပါလိမ့်မယ်။

```jsx
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js
// useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

### `useInterval` ကို `useCounter` ကနေ ထုတ်ယူခြင်း

လက်ရှိ — သင့် `useCounter` Hook က အရာနှစ်ခု လုပ်ပါတယ် — interval တစ်ခု တည်ဆောက်တာ၊ ပြီးတော့ interval tick တိုင်းမှာ state variable တစ်ခုကို increment လုပ်တာပါ။ Interval တည်ဆောက်တဲ့ logic ကို — `useInterval` လို့ခေါ်တဲ့ Hook တစ်ခုသီးခြားထဲ ခွဲထုတ်ပါ။ သူက argument နှစ်ခု လက်ခံသင့်ပါတယ်: `onTick` callback နဲ့ `delay`။ ဒီပြောင်းလဲမှုပြီးရင် — သင့် `useCounter` implementation က ဒီလိုမျိုး ဖြစ်သင့်ပါတယ်:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

`useInterval` ကို `useInterval.js` file ထဲမှာ ရေးပြီး — `useCounter.js` file ထဲ import လုပ်ပါ။

```jsx
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js
// useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js
// useInterval.js — ဒီမှာ သင့် Hook ကို ရေးပါ!
```

#### အဖြေ

`useInterval` ထဲက logic က interval ကို တည်ဆောက်ပြီး ရှင်းလင်းရမှာပါ — တခြားဘာမှ လုပ်စရာ မလိုပါဘူး။

```jsx
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js
// useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js
// useInterval.js
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

ဒီဖြေရှင်းချက်မှာ ပြဿနာလေးတစ်ခု ရှိတာ သတိပြုပါ — အဲဒါကို နောက် challenge မှာ ဖြေရှင်းရပါလိမ့်မယ်။

### Reset ဖြစ်နေတဲ့ Interval တစ်ခုကို ပြုပြင်ခြင်း

ဒီဥပမာမှာ — interval *နှစ်ခု* သီးခြား ရှိပါတယ်။

`App` component က `useCounter` ကို ခေါ်ပြီး — အဲဒါက counter ကို စက္ကန့်တိုင်း update လုပ်ဖို့ `useInterval` ကို ခေါ်ပါတယ်။ ဒါပေမယ့် — `App` component က page background color ကို စက္ကန့်နှစ်ခုတိုင်း ကျပန်း update လုပ်ဖို့ — `useInterval` ကိုလည်း *ခေါ်ပါသေးတယ်*။

တစ်နည်းနည်းနဲ့ — page background ကို update လုပ်တဲ့ callback က ဘယ်တော့မှ run မဖြစ်ပါဘူး။ `useInterval` ထဲမှာ log တချို့ ထည့်ကြည့်ပါ:

```js
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

Log တွေက သင်မျှော်လင့်တဲ့အတိုင်း ဖြစ်သလား? သင့် Effects တချို့က မလိုအပ်ဘဲ re-synchronize ဖြစ်နေပုံရရင် — ဘယ် dependency က အဲဒါကို ဖြစ်စေတာလဲ ခန့်မှန်းနိုင်မလား? အဲဒီ [dependency ကို သင့် Effect ကနေ ဖယ်ရှား](/docs/react/removing-effect-dependencies)ဖို့ နည်းလမ်းတစ်ခုခု ရှိလား?

ပြဿနာကို ပြုပြင်ပြီးရင် — page background က စက္ကန့်နှစ်ခုတိုင်း update ဖြစ်တာ မျှော်လင့်သင့်ပါတယ်။

> **အရိပ်အမြွက်:** သင့် `useInterval` Hook က event listener တစ်ခုကို argument အဖြစ် လက်ခံပုံရပါတယ်။ အဲဒီ event listener ကို — သင့် Effect ရဲ့ dependency တစ်ခု မဖြစ်အောင် — ထုပ်နိုင်တဲ့ နည်းလမ်းတစ်ခုခု တွေးလို့ ရလား?

```jsx
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js
// useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js
// useInterval.js
import { useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

#### အဖြေ

`useInterval` အတွင်းမှာ — [ဒီစာမျက်နှာ အစောပိုင်းမှာ လုပ်ခဲ့သလိုပဲ](/docs/react/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks) — tick callback ကို Effect Event တစ်ခုထဲ ထုပ်ပါ။

ဒါက သင့် Effect ရဲ့ dependencies ထဲကနေ `onTick` ကို ချန်လှပ်နိုင်စေပါလိမ့်မယ်။ Effect က component re-render တိုင်း re-synchronize မဖြစ်တော့တာမို့ — page background color ပြောင်းတဲ့ interval က — fire ဖြစ်ဖို့ အခွင့်အရေး မရခင် — စက္ကန့်တိုင်း reset မဖြစ်တော့ပါဘူး။

ဒီပြောင်းလဲမှုနဲ့ဆိုရင် — interval နှစ်ခုလုံး မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်ပြီး — တစ်ခုကိုတစ်ခု အနှောင့်အယှက် မဖြစ်တော့ပါဘူး:

```jsx
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js
// useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js
// useInterval.js
import { useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

### Staggering Movement တစ်ခု Implement လုပ်ခြင်း

ဒီဥပမာမှာ — `usePointerPosition()` Hook က လက်ရှိ pointer position ကို ခြေရာခံပါတယ်။ Preview area အပေါ်မှာ သင့် cursor ဒါမှမဟုတ် လက်ချောင်းကို ရွှေ့ကြည့်ပြီး — red dot က သင့် လှုပ်ရှားမှုနောက်ကို လိုက်တာ ကြည့်ပါ။ သူ့ရဲ့ position ကို `pos1` variable ထဲမှာ သိမ်းထားပါတယ်။

တကယ်တော့ — red dot *ငါးခု* (!!) ကို render လုပ်ထားပါတယ်။ လက်ရှိမှာ သူတို့ အားလုံး တစ်နေရာတည်းမှာ ပေါ်နေလို့ — သူတို့ကို မမြင်ရတာပါ။ ဒါက သင်ပြုပြင်ရမယ့်အရာပါ။ သင်အစား implement လုပ်ချင်တာက "staggered" (တစ်ခုပြီးတစ်ခု နောက်ကျနေတဲ့) လှုပ်ရှားမှုတစ်ခုပါ: dot တစ်ခုချင်းစီက အရင် dot ရဲ့ လမ်းကြောင်းကို "လိုက်"သင့်ပါတယ်။ ဥပမာ — cursor ကို မြန်မြန် ရွှေ့လိုက်ရင် — ပထမ dot က ချက်ချင်း လိုက်သင့်ပြီး — ဒုတိယ dot က ပထမ dot ကို နှောင့်နှေးမှုအနည်းငယ်နဲ့ လိုက်သင့်တယ် — တတိယ dot က ဒုတိယ dot ကို လိုက်သင့်တယ် — ဒီလိုနဲ့ ဆက်သွားပါတယ်။

သင် `useDelayedValue` custom Hook ကို implement လုပ်ဖို့ လိုပါတယ်။ သူ့ရဲ့ လက်ရှိ implementation က သူ့ဆီ ပေးထားတဲ့ `value` ကိုပဲ ပြန်ပေးပါတယ်။ အဲဒီအစား — သင်က `delay` milliseconds မတိုင်ခင်က တန်ဖိုးကို ပြန်ပေးချင်ပါတယ်။ ဒါလုပ်ဖို့ state နဲ့ Effect တစ်ခုခု လိုနိုင်ပါတယ်။

`useDelayedValue` ကို implement လုပ်ပြီးရင် — dots တွေ တစ်ခုပြီးတစ်ခု လိုက်ပြီး ရွေ့နေတာ မြင်ရပါလိမ့်မယ်။

> **အရိပ်အမြွက်:** `delayedValue` ကို သင့် custom Hook အတွင်းမှာ state variable တစ်ခုအနေနဲ့ သိမ်းဖို့ လိုပါလိမ့်မယ်။ `value` ပြောင်းတဲ့အခါ — Effect တစ်ခု run ချင်ပါလိမ့်မယ်။ ဒီ Effect က `delay` ပြီးနောက်မှာ `delayedValue` ကို update သင့်ပါတယ်။ `setTimeout` ခေါ်တာ အသုံးဝင်တာ တွေ့ရနိုင်ပါတယ်။
>
> ဒီ Effect က cleanup လိုသလား? ဘာကြောင့် လို/မလို?

```jsx
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Implement this Hook → ဒီ Hook ကို implement လုပ်ပါ
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js
// usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

#### အဖြေ

ဒီမှာ အလုပ်လုပ်တဲ့ version တစ်ခုပါ။ `delayedValue` ကို state variable တစ်ခုအနေနဲ့ ထားပါတယ်။ `value` update ဖြစ်တဲ့အခါ — သင့် Effect က `delayedValue` ကို update လုပ်ဖို့ timeout တစ်ခု စီစဉ်ပေးပါတယ်။ ဒါကြောင့် — `delayedValue` က တကယ့် `value` ထက် အမြဲ "နောက်ကျနေပါတယ်"။

```jsx
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js
// usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

ဒီ Effect က cleanup *မလို*တာ သတိပြုပါ။ Cleanup function ထဲမှာ `clearTimeout` ခေါ်ရင် — `value` ပြောင်းတိုင်း — စီစဉ်ပြီးသား timeout ကို reset လုပ်မိမှာမို့ — movement က ဆက်တိုက် ဖြစ်မနေတော့ပါဘူး။ Movement ကို ဆက်တိုက် ထားချင်ရင် — timeout တွေ အားလုံး fire ဖြစ်ဖို့ လိုပါတယ်။
