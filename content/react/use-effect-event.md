---
title: "useEffectEvent"
description: "Effect တွေနဲ့ events တွေကို ခွဲထုတ်နိုင်တဲ့ React Hook — Effect Event ဖန်တီးခြင်း၊ Effect ထဲကနေပဲ ခေါ်ရခြင်း၊ latest values တွေနဲ့ timer/event listener သုံးခြင်း၊ custom Hooks ထဲမှာ သုံးခြင်း"
order: 44
source: "https://react.dev/reference/react/useEffectEvent"
status: translated
updated: 2026-09-02
---

`useEffectEvent` ဆိုတာ — Effect တွေကနေ events တွေကို ခွဲထုတ်နိုင်စေတဲ့ React Hook တစ်ခုပါ။

```js
const onEvent = useEffectEvent(callback)
```

## ရည်ညွှန်းချက် (Reference)

### `useEffectEvent(callback)`

Effect Event တစ်ခုကို ဖန်တီးဖို့ — သင့် component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useEffectEvent` ကို ခေါ်ပါတယ်:

```js
import { useEffectEvent, useEffect } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
}
```

Effect Events တွေက သင့် Effect logic ရဲ့ အစိတ်အပိုင်းတစ်ခုပါ — ဒါပေမယ့် event handler တစ်ခုလိုပဲ ပြုမူပါတယ်။ သူတို့က သင့် Effect ကို ပြန် re-synchronize မလုပ်ဘဲ render ကနေ (props နဲ့ state လို) **တန်ဖိုးအသစ်ဆုံးတွေကို အမြဲ "မြင်"** နေတာမို့ — Effect dependencies တွေထဲကနေ ချန်လှပ်ထားပါတယ်။

**Parameters (ပါရာမီတာများ)**

- `callback`: သင့် Effect Event ရဲ့ logic ပါတဲ့ function တစ်ခု။ Argument ဘယ်နှစ်ခုမဆို လက်ခံပြီး ဘာ value မဆို ပြန်ပေးနိုင်ပါတယ်။ ပြန်ရလာတဲ့ Effect Event function ကို ခေါ်တဲ့အခါ — `callback` က ခေါ်ချိန်မှာ render ကနေ commit ဖြစ်ပြီးသား (latest committed) တန်ဖိုးတွေကိုပဲ အမြဲ ဝင်ရောက်ကြည့်ရှုပါတယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

- `useEffectEvent` က သင့် `callback` ရဲ့ type signature အတိုင်း ဖြစ်တဲ့ Effect Event function တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ function ကို `useEffect`၊ `useLayoutEffect`၊ `useInsertionEffect` — ဒါမှမဟုတ် component တစ်ခုတည်းထဲက တခြား Effect Events တွေရဲ့ အတွင်းကနေ ခေါ်နိုင်ပါတယ်။

**Caveats (သတိပြုရမည့်အချက်များ)**

- `useEffectEvent` က Hook တစ်ခုမို့ — component ရဲ့ **အပေါ်ဆုံးအဆင့်** ဒါမှမဟုတ် ကိုယ်ပိုင် Hooks တွေထဲမှာပဲ ခေါ်ရပါတယ်။ Loops/conditions တွေထဲမှာ မခေါ်ရပါဘူး။
- Effect Events တွေကို Effects တွေ ဒါမှမဟုတ် တခြား Effect Events တွေရဲ့ အတွင်းကနေပဲ ခေါ်ရပါတယ်။ Rendering အတွင်းမှာ မခေါ်ရသလို — တခြား components ဒါမှမဟုတ် Hooks တွေဆီလည်း မပို့ရပါဘူး။ `eslint-plugin-react-hooks` linter က ဒီကန့်သတ်ချက်ကို စစ်ဆေးပါတယ်။
- `useEffectEvent` ကို Effect ရဲ့ dependency array ထဲမှာ dependencies တွေ မရေးရအောင် ရှောင်ဖို့ **မသုံးပါနဲ့** — ဒါက bug တွေကို ဝှက်ပြီး code ကို နားလည်ရခက်စေပါတယ်။ Effect တွေကနေ ပစ်ခတ်တဲ့ တကယ့် event logic အတွက်ပဲ သုံးပါ။
- Effect Event functions တွေက stable identity မရှိပါဘူး — သူတို့ရဲ့ identity က render တိုင်းမှာ ရည်ရွယ်ချက်ရှိရှိ ပြောင်းပါတယ်။

ဒီဇိုင်းပိုင်းမှာ — Effect Events တွေက component တစ်ခုတည်းထဲက Effects တွေကနေပဲ ခေါ်လို့ရဖို့ ရည်ရွယ်ထားပါတယ်။ သူတို့ကို local မှာပဲ ခေါ်လို့ရပြီး တခြား components တွေဆီ မပို့နိုင်၊ dependency arrays တွေထဲမှာ မထည့်နိုင်တာမို့ — stable identity က အသုံးမဝင်တဲ့အပြင် bug တွေကို ဖုံးကွယ်စေနိုင်လို့ပါ။ မတည်မြဲတဲ့ identity က runtime assertion တစ်ခုလို အလုပ်လုပ်ပါတယ် — မှားပြီး function identity ပေါ် မှီခိုရင် — Effect က render တိုင်း ပြန် run နေတာကို မြင်ရလို့ bug က ထင်ရှားလာပါတယ်။ တစ်နည်းပြောရရင် — Effect Events တွေက သဘောတရားအရ သတ်မှတ်ထားတဲ့ Effect တစ်ခုနဲ့ပဲ သက်ဆိုင်ပြီး — reactivity ကနေ ရှောင်ထွက်ဖို့ သုံးလို့ရတဲ့ general-purpose API တစ်ခု မဟုတ်ပါဘူး။

## အသုံးပြုပုံ (Usage)

### Effect တစ်ခုထဲမှာ Event တစ်ခုကို အသုံးပြုခြင်း

Component ရဲ့ အပေါ်ဆုံးအဆင့်မှာ `useEffectEvent` ကို ခေါ်ပြီး *Effect Event* တစ်ခု ဖန်တီးပါတယ်:

```js
const onConnected = useEffectEvent(() => {
  if (!muted) {
    showNotification('Connected!');
  }
});
```

`useEffectEvent` က event callback တစ်ခုကို လက်ခံပြီး Effect Event တစ်ခုကို ပြန်ပေးပါတယ်။ Effect Event ဆိုတာ — Effect ကို ပြန် ချိတ်ဆက်/ချိတ်ဖြုတ် (re-connect) မလုပ်စေဘဲ Effects တွေရဲ့ အတွင်းကနေ ခေါ်လို့ရတဲ့ function တစ်ခုပါ။ Effect Event တွေက Effect logic ရဲ့ အစိတ်အပိုင်းတစ်ခု ဖြစ်ပေမယ့် — event handler တစ်ခုလိုပဲ ပြုမူပါတယ်: သူတို့က နောက်ဆုံးပေါ် props/state တန်ဖိုးတွေကို အမြဲ မြင်နေပြီး — "reactive" မဟုတ်လို့ Effect dependencies တွေထဲမှာ ထည့်စရာ မလိုပါဘူး။ အောက်မှာ ဒီ Effect Event ကို Effect တစ်ခုရဲ့ အတွင်းကနေ ဘယ်လို ခေါ်လဲ ကြည့်ရအောင်:

```js
useEffect(() => {
  const connection = createConnection(roomId);
  connection.on('connected', onConnected);
  connection.connect();
  return () => {
    connection.disconnect();
  }
}, [roomId]);
```

အပေါ်က code မှာ — `onConnected` က Effect Event ဖြစ်လို့ — `roomId` ပြောင်းတဲ့အခါမှပဲ Effect က ပြန် run ပြီး — `muted` (နဲ့ `onConnect`) လို တခြား state/values တွေ ပြောင်းရင်တော့ connection ကို ပြန်မချိတ်တော့ပါဘူး။

> **သတိပြုရန် — Dependencies တွေကို ကျော်ဖို့ Effect Events တွေကို မသုံးပါနဲ့:**
>
> မလိုအပ်ဘူးလို့ သင်ထင်တဲ့ dependencies တွေ မရေးရအောင် `useEffectEvent` ကို သုံးချင်စိတ် ပေါက်နိုင်ပါတယ် — ဒါပေမယ့် ဒါက bug တွေကို ဝှက်ပြီး code ကို နားလည်ရခက်စေပါတယ်:
>
> ```js
> // 🔴 Wrong: Using Effect Events to hide dependencies
> const logVisit = useEffectEvent(() => {
>   log(pageUrl);
> });
>
> useEffect(() => {
>   logVisit()
> }, []); // Missing pageUrl means you miss logs
> ```
>
> Value တစ်ခုက သင့် Effect ကို ပြန် run စေသင့်ရင် — အဲဒါကို dependency အဖြစ် ထားပါ။ တကယ်ကို Effect ကို ပြန် trigger မလုပ်စေချင်တဲ့ logic အတွက်ပဲ Effect Events တွေကို သုံးပါ။

### Timer တစ်ခုနဲ့ Latest Values တွေကို အသုံးပြုခြင်း

Effect တစ်ခုထဲမှာ `setInterval` ဒါမှမဟုတ် `setTimeout` သုံးတဲ့အခါ — တန်ဖိုးတွေ ပြောင်းတိုင်း timer ကို ပြန်မစဘဲ render ကနေ latest values တွေကို ဖတ်ချင်တာ မကြာခဏ ရှိပါတယ်။ ဒီ counter က စက္ကန့်တိုင်း `count` ကို လက်ရှိ `increment` တန်ဖိုးနဲ့ တိုးပါတယ်။ `onTick` Effect Event က interval ကို ပြန်မစဘဲ latest `count` နဲ့ `increment` တွေကို ဖတ်ပါတယ်:

```js
import { useState, useEffect, useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(count + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

Timer ပြေးနေတုန်း increment တန်ဖိုးကို ပြောင်းကြည့်ပါ — counter က increment အသစ်ကို ချက်ချင်း သုံးပေမယ့် — timer ကတော့ ပြန်မစဘဲ ချောမွေ့စွာ ဆက်ပြေးနေပါတယ်။ ဒီ pattern မရှိရင် — `onTick` ထဲမှာ ဖတ်နေတဲ့ `count` နဲ့ `increment` တွေက Effect ဖွဲ့စည်းခဲ့တဲ့ render ရဲ့ တန်ဖိုးတွေကိုပဲ "ဖမ်းထား" (capture) လို့ — timer က stale values တွေနဲ့ပဲ အလုပ်လုပ်နေမှာပါ။ တန်ဖိုးတွေ ပြောင်းတိုင်း interval ကို cleanup/setup ပြန်လုပ်တဲ့ နည်းနဲ့ ဖြေရှင်းရင် — interval က မလိုအပ်ဘဲ ထပ်ခါထပ်ခါ restart ဖြစ်နေမှာပါ။ Effect Event က ဒီပြဿနာ နှစ်ခုလုံးကို ရှောင်ပေးပါတယ် — interval ကို တစ်ခါတည်း setup လုပ်ထားပြီး — tick ကြားတိုင်း latest values တွေကို ဖတ်တာပါ။

### Event Listener တစ်ခုနဲ့ Latest Values တွေကို အသုံးပြုခြင်း

ဒီဥပမာမှာ — "Can move" checkbox အမှန်ခြစ်ထားမှပဲ cursor နောက်ကို လိုက်တဲ့ dot တစ်ခု ရှိပါတယ်။ `onMove` Effect Event က Effect ကို ပြန် run မလုပ်စေဘဲ latest `canMove` တန်ဖိုးကို အမြဲ ဖတ်ပါတယ်:

```js
  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
```

Checkbox ကို ဖွင့်/ပိတ်လုပ်ပြီး cursor ရွှေ့ကြည့်ရင် — dot က checkbox state ကို ချက်ချင်း တုံ့ပြန်ပေမယ့် — event listener ကို component mount ဖြစ်တဲ့အခါ တစ်ခါပဲ တပ်ဆင်ပါတယ်။ `useEffectEvent` မရှိရင် — callback ထဲမှာ ဖတ်နေတဲ့ `canMove` ကို dependencies ထဲ ထည့်ရလို့ — `canMove` ပြောင်းတိုင်း listener ကို ဖယ်ပြီး ပြန်တပ်နေရမှာ ဖြစ်ပါတယ်။ ဒါက functional အားဖြင့် မှားတာ မဟုတ်ပေမယ့် — မလိုအပ်တဲ့ အလုပ် ဖြစ်ပြီး — callback ကို component ကနေ ခဏလေးပဲ ပြတ်တောက်စေလို့ — (subscription တွေအတွက်) တခြား bugs တွေရဲ့ အရင်းအမြစ်လည်း ဖြစ်နိုင်ပါတယ်။ Effect Event က listener တစ်ခုတည်းကို တစ်ခါတည်း ထားပြီး — fire တိုင်း latest values တွေကို ဖတ်နိုင်အောင် လုပ်ပေးပါတယ်။

### External Systems တွေဆီ ပြန်ချိတ်ဆက်တာကို ရှောင်ခြင်း

`useEffectEvent` ရဲ့ အသုံးများတဲ့ case တစ်ခုက — Effect တစ်ခုကို တုံ့ပြန်တဲ့အနေနဲ့ တစ်ခုခု လုပ်ချင်ပေမယ့် — အဲဒီ "တစ်ခုခု" က သင်က react မလုပ်စေချင်တဲ့ တန်ဖိုးတစ်ခုပေါ် မူတည်နေတဲ့အခါမျိုးပါ။ ဒီဥပမာမှာ — chat component တစ်ခုက room တစ်ခုဆီ ချိတ်ဆက်ပြီး ချိတ်ဆက်တဲ့အခါ notification ပြပါတယ်။ အသုံးပြုသူက checkbox နဲ့ notification ကို mute လုပ်နိုင်ပါတယ် — ဒါပေမယ့် settings ပြောင်းတိုင်း chat room ဆီ ပြန်ချိတ်ဆက်တာမျိုး မလိုချင်ပါဘူး:

```js
function ChatRoom({ roomId, muted }) {
  const onConnected = useEffectEvent((roomId) => {
    console.log('✅ Connected to ' + roomId + ' (muted: ' + muted + ')');
    if (!muted) {
      showNotification('Connected to ' + roomId);
    }
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    console.log('⏳ Connecting to ' + roomId + '...');
    connection.on('connected', () => {
      onConnected(roomId);
    });
    connection.connect();
    return () => {
      console.log('❌ Disconnected from ' + roomId);
      connection.disconnect();
    }
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

Room တွေ ပြောင်းကြည့်ရင် — chat က ပြန်ချိတ်ပြီး notification ပြပါတယ်။ Notification တွေကို mute လုပ်လိုက်ရင် — `muted` ကို Effect ထဲမှာ မဟုတ်ဘဲ Effect Event ရဲ့ အတွင်းမှာ ဖတ်ထားလို့ — chat က ချိတ်ဆက်ထားတာ ဆက်ရှိနေပါတယ်။ `muted` ကို Effect ရဲ့ dependencies ထဲ ထည့်ထားရင် — checkbox နှိပ်တိုင်း Effect က cleanup/setup ပြန်လုပ်ပြီး — room ဆီ ပြန်ချိတ်ဆက်နေရမှာမို့ — connection က ခဏတိုင်း ပြတ်တောက်နေမှာပါ။ Effect Event ထဲမှာ ထားခြင်းဖြင့် — Effect ရဲ့ synchronization process ကို မထိခိုက်ဘဲ — နောက်ဆုံးပေါ် state နဲ့ပဲ တုံ့ပြန်နိုင်ပါတယ်။

### Custom Hooks တွေထဲမှာ Effect Events တွေကို အသုံးပြုခြင်း

ကိုယ်ပိုင် custom Hooks တွေထဲမှာလည်း `useEffectEvent` ကို သုံးနိုင်ပါတယ် — Effects တွေကို ထုပ်ပြီး တန်ဖိုးတချို့ကို non-reactive ဖြစ်အောင် ထားနိုင်တဲ့ reusable Hooks တွေ ဖန်တီးနိုင်ပါတယ်:

```js
function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);

  useEffect(() => {
    if (delay === null) {
      return;
    }
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

ဒီမှာ `useInterval` က interval တစ်ခု တပ်ဆင်ပေးတဲ့ custom Hook တစ်ခုပါ။ သူ့ဆီ ပေးလိုက်တဲ့ `callback` ကို Effect Event တစ်ခုထဲမှာ ထုပ်ထားတာမို့ — render တိုင်း callback အသစ် ပေးလဲနေရင်တောင် — interval က ပြန်ပြီး reset မဖြစ်ပါဘူး။ ဒါက custom Hooks တွေရဲ့ သိမ်မွေ့တဲ့ ပြဿနာတစ်ခုကို ဖြေရှင်းပေးပါတယ်: Effects တွေက reactive value တွေ အားလုံးကို dependencies အဖြစ် ထည့်ရတာမို့ — Hook ကို ခေါ်တဲ့နေရာကနေ callback function အသစ်တွေ ဆက်တိုက် ပေးနေရင် — Effect က မလိုအပ်ဘဲ ပြန် run နေတတ်ပါတယ်။ `useEffectEvent` က callback ကို non-reactive ဖြစ်အောင် လုပ်လိုက်လို့ — Effect က `delay` ပေါ်မှာပဲ မှီခိုတော့ပါတယ်။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### "A function wrapped in useEffectEvent can't be called during rendering" error ရနေတယ်

ဒီ error က — သင့် component ရဲ့ render phase အတွင်းမှာ Effect Event function တစ်ခုကို ခေါ်နေလို့ပါ။ Effect Events တွေကို Effects တွေ ဒါမှမဟုတ် တခြား Effect Events တွေရဲ့ အတွင်းကနေပဲ ခေါ်လို့ရပါတယ်:

```js
function MyComponent({ data }) {
  const onLog = useEffectEvent(() => {
    console.log(data);
  });

  // 🔴 Wrong: calling during render
  onLog();

  // ✅ Correct: call from an Effect
  useEffect(() => {
    onLog();
  }, []);

  return <div>{data}</div>;
}
```

Render အတွင်းမှာ run ရမယ့် logic ဆိုရင် — `useEffectEvent` နဲ့ မထုပ်ပါနဲ့ — logic ကို တိုက်ရိုက် ခေါ်ပါ ဒါမှမဟုတ် Effect တစ်ခုထဲကို ရွှေ့ပါ။

### "Functions returned from useEffectEvent must not be included in the dependency array" lint error ရနေတယ်

ဒီလိုမျိုး warning တစ်ခု မြင်ရရင် — Effect Event ကို dependencies ထဲကနေ ဖယ်လိုက်ပါ:

```js
const onSomething = useEffectEvent(() => {
  // ...
});

// 🔴 Wrong: Effect Event in dependencies
useEffect(() => {
  onSomething();
}, [onSomething]);

// ✅ Correct: no Effect Event in dependencies
useEffect(() => {
  onSomething();
}, []);
```

Effect Events တွေက dependencies အဖြစ် မစာရင်းသွင်းဘဲ Effects တွေကနေ ခေါ်လို့ရအောင် ဒီဇိုင်းလုပ်ထားတာပါ။ Function identity က ရည်ရွယ်ချက်ရှိရှိ မတည်မြဲတာမို့ — dependencies ထဲ ထည့်လိုက်ရင် Effect က render တိုင်း ပြန် run မှာမို့ — linter က ဒါကို တားမြစ်တာပါ။

### "... is a function created with useEffectEvent, and can only be called from Effects" lint error ရနေတယ်

ဒီ warning က — function ကို မှားတဲ့နေရာကနေ ခေါ်နေလို့ပါ:

```js
const onSomething = useEffectEvent(() => {
  console.log(value);
});

// 🔴 Wrong: calling from event handler
function handleClick() {
  onSomething();
}

// 🔴 Wrong: passing to child component
return <Child onSomething={onSomething} />;

// ✅ Correct: calling from Effect
useEffect(() => {
  onSomething();
}, []);
```

Effect Events တွေကို သတ်မှတ်ထားတဲ့ component ထဲက Effects တွေမှာပဲ သုံးဖို့ ဒီဇိုင်းလုပ်ထားပါတယ်။ Event handlers တွေအတွက် ဒါမှမဟုတ် children တွေဆီ ပို့ဖို့ callback လိုအပ်ရင် — သာမန် function တစ်ခု ဒါမှမဟုတ် `useCallback` ကို သုံးပါ။
