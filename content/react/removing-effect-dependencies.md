---
title: "Effect Dependencies တွေကို ဖယ်ရှားခြင်း"
description: "Effect တွေထဲက မလိုအပ်တဲ့ dependencies တွေကို ပြန်လည်သုံးသပ်ပြီး ဖယ်ရှားနည်း — infinite loop ပြုပြင်ခြင်း၊ reactive value တွေကို 'react' မလုပ်ဘဲ ဖတ်ခြင်း၊ object/function dependencies တွေကို ရှောင်ခြင်း၊ linter ကို ဖိနှိပ်တာ ဘာကြောင့် အန္တရာယ်ရှိလဲ"
order: 16
source: "https://react.dev/learn/removing-effect-dependencies"
status: translated
updated: 2026-09-01
---

Effect တစ်ခု ရေးတဲ့အခါ — linter က သင့် Effect ရဲ့ dependencies စာရင်းထဲမှာ — Effect က ဖတ်တဲ့ reactive value တိုင်း (props နဲ့ state လိုမျိုး) ပါဝင်ကြောင်း စစ်ဆေးပါလိမ့်မယ်။ ဒါက သင့် Effect က သင့် component ရဲ့ နောက်ဆုံး props နဲ့ state တွေနဲ့ ထပ်တူကျနေကြောင်း သေချာစေပါတယ်။ မလိုအပ်တဲ့ dependencies တွေက သင့် Effect ကို မကြာခဏ run လွန်းစေနိုင်သလို — infinite loop တစ်ခုတောင် ဖန်တီးစေနိုင်ပါတယ်။ ဒီလမ်းညွှန်ကို လိုက်နာပြီး — သင့် Effects တွေထဲက မလိုအပ်တဲ့ dependencies တွေကို ပြန်လည်သုံးသပ်ပြီး ဖယ်ရှားပါ။

## သင်ယူရမည့်အကြောင်းအရာများ

- Infinite Effect dependency loops တွေကို ဘယ်လို ပြုပြင်မလဲ
- Dependency တစ်ခုကို ဖယ်ရှားချင်တဲ့အခါ ဘာလုပ်ရမလဲ
- သင့် Effect ကနေ တန်ဖိုးတစ်ခုကို "react" မလုပ်ဘဲ ဘယ်လို ဖတ်မလဲ
- Object နဲ့ function dependencies တွေကို ဘယ်လို/ဘာကြောင့် ရှောင်ရမလဲ
- Dependency linter ကို ဖိနှိပ်တာ (suppress) ဘာကြောင့် အန္တရာယ်ရှိလဲ — အဲဒီအစား ဘာလုပ်ရမလဲ

## Dependencies တွေက Code နဲ့ ကိုက်ညီရမယ်

Effect တစ်ခု ရေးတဲ့အခါ — ပထမဆုံး သင့် Effect ကို လုပ်စေချင်တာတွေကို [စတင်ခြင်းနဲ့ ရပ်တန့်ခြင်း](/docs/react/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) ကို သတ်မှတ်ပါ:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

ပြီးရင် — Effect dependencies တွေကို ဗလာ (`[]`) ထားခဲ့ရင် — linter က မှန်ကန်တဲ့ dependencies တွေကို အကြံပြုပါလိမ့်မယ်:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Fix the mistake here!
  return <h1>Welcome to the {roomId} room!</h1>;
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```
```js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```
```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

Linter ပြောတဲ့အတိုင်း ဖြည့်ပါ:

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

[Effects တွေက reactive values တွေကို "react" လုပ်ပါတယ်](/docs/react/lifecycle-of-reactive-effects#effects-react-to-reactive-values)။ `roomId` က reactive value တစ်ခုဖြစ်တာမို့ (re-render ကြောင့် ပြောင်းလဲနိုင်လို့) — linter က အဲဒါကို dependency အဖြစ် သတ်မှတ်ထားကြောင်း စစ်ဆေးပါတယ်။ `roomId` က တန်ဖိုးမတူတာတစ်ခု ရရှိရင် — React က သင့် Effect ကို ပြန်လည် ထပ်တူပြု (re-synchronize) လုပ်ပါလိမ့်မယ်။ ဒါက chat က ရွေးထားတဲ့ room ဆီ ချိတ်ဆက်ထားပြီး — dropdown ကို "react" လုပ်ကြောင်း သေချာစေပါတယ်:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>Welcome to the {roomId} room!</h1>;
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```
```js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```
```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

### Dependency တစ်ခုကို ဖယ်ရှားဖို့ — အဲဒါ dependency မဟုတ်ကြောင်း သက်သေပြပါ

သင်က သင့် Effect ရဲ့ dependencies တွေကို "ရွေးချယ်" လို့ မရဘူးဆိုတာ သတိပြုပါ။ သင့် Effect ရဲ့ code က သုံးတဲ့ reactive value တိုင်းကို သင့် dependency list ထဲမှာ ကြေညာရပါမယ်။ Dependency list ကို ဝန်းရံနေတဲ့ code ကနေ ဆုံးဖြတ်ပါတယ်:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // This is a reactive value
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads that reactive value
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ So you must specify that reactive value as a dependency of your Effect
  // ...
}
```

[Reactive values](/docs/react/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) တွေထဲမှာ props တွေနဲ့ — သင့် component ရဲ့ အတွင်းမှာ တိုက်ရိုက် ကြေညာထားတဲ့ variable နဲ့ function တွေ အားလုံး ပါဝင်ပါတယ်။ `roomId` က reactive value တစ်ခုဖြစ်တာမို့ — အဲဒါကို dependency list ကနေ ဖယ်ရှားလို့ မရပါဘူး။ Linter က ခွင့်မပြုပါဘူး:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
}
```

ပြီးတော့ linter က မှန်ပါတယ်! `roomId` က အချိန်နဲ့အမျှ ပြောင်းလဲနိုင်တာမို့ — ဒါက သင့် code ထဲမှာ bug တစ်ခုကို ဖြစ်ပေါ်စေပါလိမ့်မယ်။

**Dependency တစ်ခုကို ဖယ်ရှားဖို့ — အဲဒါ dependency တစ်ခု *မလိုအပ်ဘူး* ဆိုတာကို linter ဆီ "သက်သေပြ" ပါ။** ဥပမာ — `roomId` ကို သင့် component ရဲ့ အပြင်ဘက်ကို ရွှေ့ပြီး — အဲဒါ reactive မဟုတ်ဘဲ — re-render တွေမှာ မပြောင်းလဲကြောင်း သက်သေပြနိုင်ပါတယ်:

```js
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Not a reactive value anymore

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
}
```

အခု `roomId` က reactive value မဟုတ်တော့တာမို့ (ပြီးတော့ re-render တစ်ခုမှာ ပြောင်းလဲလို့ မရတော့ပါဘူး) — dependency တစ်ခု ဖြစ်ဖို့ မလိုပါဘူး:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```
```js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```
```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

ဒါကြောင့် — အခု [ဗလာ (`[]`) dependency list](/docs/react/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) တစ်ခုကို သတ်မှတ်နိုင်တာပါ။ သင့် Effect က reactive value တစ်ခုခုကို *တကယ်* မမှီခိုတော့တာမို့ — component ရဲ့ props ဒါမှမဟုတ် state တစ်ခုခု ပြောင်းတဲ့အခါ *တကယ်* ပြန် run ဖို့ မလိုတော့ပါဘူး။

### Dependencies တွေကို ပြောင်းဖို့ — Code ကို ပြောင်းပါ

သင့်အလုပ်လုပ်ပုံထဲမှာ pattern တစ်ခုကို သတိထားမိလောက်ပါပြီ:

1. ပထမဆုံး — သင့် Effect ရဲ့ code ဒါမှမဟုတ် သင့် reactive values တွေကို ကြေညာပုံကို **ပြောင်းပါ။**
2. ပြီးရင် — linter ကို လိုက်နာပြီး — dependencies တွေကို **သင်ပြောင်းထားတဲ့ code နဲ့ ကိုက်ညီအောင်** ချိန်ညှိပါ။
3. Dependency စာရင်းကို မကျေနပ်ရင် — **ပထမအဆင့်ဆီ ပြန်သွားပါ** (ပြီးတော့ code ကို ထပ်ပြောင်းပါ)။

နောက်ဆုံးအပိုင်းက အရေးကြီးပါတယ်။ **Dependencies တွေကို ပြောင်းချင်ရင် — ဝန်းရံနေတဲ့ code ကို အရင်ပြောင်းပါ။** Dependency list ကို [သင့် Effect ရဲ့ code က သုံးတဲ့ reactive values တွေအားလုံးရဲ့ စာရင်း](/docs/react/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) တစ်ခုလို့ သင်ယူဆနိုင်ပါတယ်။ အဲဒီစာရင်းထဲမှာ ဘာတွေ ထည့်ရမယ်ဆိုတာ သင်က *ရွေးချယ်* လို့ မရပါဘူး။ စာရင်းက သင့် code ကို *ဖော်ပြ* ပါတယ်။ Dependency list ကို ပြောင်းဖို့ — code ကို ပြောင်းပါ။

ဒါက ညီမျှခြင်းတစ်ခုကို ဖြေရှင်းရသလို ခံစားရနိုင်ပါတယ်။ ရည်မှန်းချက်တစ်ခုနဲ့ စတင်နိုင်ပြီး (ဥပမာ — dependency တစ်ခုကို ဖယ်ရှားခြင်း) — အဲဒီရည်မှန်းချက်နဲ့ ကိုက်ညီတဲ့ code ကို "ရှာဖွေ" ဖို့ လိုပါတယ်။ လူတိုင်းက ညီမျှခြင်း ဖြေရှင်းတာ ပျော်စရာလို့ မထင်ကြပါဘူး — Effects ရေးတာနဲ့လည်း ဒီအတိုင်းပဲ ပြောလို့ ရပါတယ်! ကံကောင်းချင်တော့ — အောက်မှာ စမ်းသုံးလို့ရတဲ့ သာမန် recipe တွေရဲ့ စာရင်းတစ်ခု ရှိပါတယ်။

> **သတိပြုရန်:** ရှိပြီးသား codebase တစ်ခု ရှိရင် — linter ကို ဖိနှိပ်ထားတဲ့ Effects တချို့ ရှိနိုင်ပါတယ်:
>
> ```js
> useEffect(() => {
>   // ...
>   // 🔴 Avoid suppressing the linter like this:
>   // eslint-ignore-next-line react-hooks/exhaustive-deps
> }, []);
> ```
>
> **Dependencies တွေက code နဲ့ မကိုက်ညီတဲ့အခါ — bug တွေ ဖြစ်ပေါ်လာနိုင်တဲ့ အန္တရာယ် အရမ်းမြင့်ပါတယ်။** Linter ကို ဖိနှိပ်ခြင်းဖြင့် — သင့် Effect က ဘာတွေပေါ်မှာ မှီခိုလဲဆိုတာနဲ့ ပတ်သက်ပြီး React ကို သင်က "လိမ်ညာ" နေတာပါ။
>
> အဲဒီအစား — အောက်က နည်းစနစ်တွေကို သုံးပါ။

#### Dependency Linter ကို ဖိနှိပ်တာ ဘာကြောင့် ဒီလောက် အန္တရာယ်များလဲ

Linter ကို ဖိနှိပ်တာက — ရှာဖွေရတာ ပြုပြင်ရတာ ခက်ခဲတဲ့ — အလွန် ထိုးထွင်းသိမြင်နိုင်စွမ်း မရှိတဲ့ bug တွေဆီ ဦးတည်စေပါတယ်။ ဥပမာတစ်ခု ဒီမှာပါ:

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
```css
button { margin: 10px; }
```

သင်က Effect ကို "mount ပေါ်မှာပဲ" run ချင်တယ်ဆိုပါစို့။ [ဗလာ (`[]`) dependencies](/docs/react/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) တွေက အဲဒါကို လုပ်ပေးတယ်လို့ ဖတ်ထားလို့ — linter ကို လျစ်လျူရှုပြီး — dependencies အဖြစ် `[]` ကို အတင်းသတ်မှတ်ဖို့ ဆုံးဖြတ်လိုက်တယ်ဆိုပါစို့။

ဒီ counter က button နှစ်ခုနဲ့ configure လုပ်လို့ရတဲ့ ပမာဏအတိုင်း စက္ကန့်တိုင်း တိုးသင့်ပါတယ်။ ဒါပေမယ့် — ဒီ Effect က ဘာပေါ်မှာမှ မမှီခိုဘူးလို့ React ကို သင်က "လိမ်ညာ" ထားတာမို့ — React က ကနဦး render ကနေ `onTick` function ကိုပဲ အမြဲတမ်း သုံးနေပါတော့တယ်။ [အဲဒီ render အတွင်း](/docs/react/state-snapshot#rendering-takes-a-snapshot-in-time) — `count` က `0` ဖြစ်ပြီး `increment` က `1` ဖြစ်ပါတယ်။ ဒါကြောင့် — အဲဒီ render ကနေ လာတဲ့ `onTick` က စက္ကန့်တိုင်း `setCount(0 + 1)` ကိုပဲ ခေါ်ပြီး — `1` ကိုပဲ အမြဲ မြင်ရပါတော့တယ်။ ဒီလိုမျိုး bug တွေက — components အများကြီးပေါ်မှာ ပြန့်ကျဲနေရင် — ပြုပြင်ဖို့ ပိုခက်ပါတယ်။

Linter ကို လျစ်လျူရှုတာထက် ပိုကောင်းတဲ့ ဖြေရှင်းနည်း အမြဲ ရှိပါတယ်! ဒီ code ကို ပြုပြင်ဖို့ — `onTick` ကို dependency list ထဲ ထည့်ဖို့ လိုပါတယ်။ (Interval ကို တစ်ခါပဲ setup လုပ်ဖို့ — [`onTick` ကို Effect Event တစ်ခု ဖြစ်အောင် လုပ်ပါ](/docs/react/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)။)

**Dependency lint error ကို compilation error တစ်ခုလို သဘောထားဖို့ အကြံပြုပါတယ်။ သင်က အဲဒါကို မဖိနှိပ်ရင် — ဒီလိုမျိုး bug တွေကို ဘယ်တော့မှ မမြင်ရပါဘူး။** ဒီ page ရဲ့ ကျန်အပိုင်းတွေက ဒီကိစ္စနဲ့ တခြားကိစ္စတွေအတွက် အခြားရွေးချယ်စရာတွေကို မှတ်တမ်းတင်ထားပါတယ်။

## မလိုအပ်တဲ့ Dependencies တွေကို ဖယ်ရှားခြင်း

Effect ရဲ့ dependencies တွေကို code ကို ထင်ဟပ်အောင် ချိန်ညှိလိုက်တိုင်း — dependency list ကို ကြည့်ပါ။ ဒီ dependencies တွေထဲက တစ်ခုခု ပြောင်းတဲ့အခါ — Effect က ပြန် run လုပ်တာ အဓိပ္ပာယ်ရှိလား? တခါတရံ — အဖြေက "မရှိဘူး" ပါ:

* သင့် Effect ရဲ့ *အပိုင်းအစမတူတဲ့* တွေကို အခြေအနေမတူတာတွေအောက်မှာ ပြန်လည်လုပ်ဆောင်စေချင်နိုင်ပါတယ်။
* Dependency တစ်ခုရဲ့ *နောက်ဆုံးတန်ဖိုး* ကိုပဲ — သူ့ရဲ့ အပြောင်းအလဲတွေကို "react" လုပ်မယ့်အစား — ဖတ်ချင်နိုင်ပါတယ်။
* Dependency တစ်ခုက object ဒါမှမဟုတ် function တစ်ခုဖြစ်လို့ — *မရည်ရွယ်ဘဲ* မကြာခဏ ပြောင်းနိုင်ပါတယ်။

မှန်ကန်တဲ့ ဖြေရှင်းနည်းကို ရှာဖို့ — သင့် Effect အကြောင်း မေးခွန်းအနည်းငယ်ကို ဖြေဖို့ လိုပါလိမ့်မယ်။ အတူတူ လျှောက်ကြည့်ရအောင်။

### ဒီ Code က Event Handler တစ်ခုဆီ ရွှေ့သင့်လား

ပထမဆုံး စဉ်းစားသင့်တာက — ဒီ code က Effect တစ်ခုလုံး ဖြစ်သင့်လားဆိုတာပါ။

Form တစ်ခုကို စိတ်ကူးကြည့်ပါ။ Submit လုပ်တဲ့အခါ — `submitted` state variable ကို `true` လို့ set လုပ်ပါတယ်။ POST request တစ်ခု ပို့ပြီး — notification တစ်ခု ပြသဖို့ လိုပါတယ်။ ဒီ logic ကို `submitted` က `true` ဖြစ်တာကို "react" လုပ်တဲ့ Effect တစ်ခုရဲ့ အတွင်းမှာ ထည့်ထားပါတယ်:

```js
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

နောက်ပိုင်းမှာ — notification message ကို လက်ရှိ theme နဲ့အညီ စတိုင်လ်လုပ်ချင်တာမို့ — လက်ရှိ theme ကို ဖတ်ပါတယ်။ `theme` က component body ထဲမှာ ကြေညာထားတာမို့ — reactive value တစ်ခုပါ — ဒါကြောင့် dependency တစ်ခုအဖြစ် ထည့်လိုက်ပါတယ်:

```js
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ All dependencies declared

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

ဒီလို လုပ်ခြင်းဖြင့် — bug တစ်ခုကို ဖြစ်ပေါ်စေခဲ့ပါပြီ။ သင်က form ကို အရင် submit လုပ်ပြီး — Dark နဲ့ Light themes တွေကြား ပြောင်းတယ်ဆိုပါစို့။ `theme` က ပြောင်းလဲမယ် — Effect က ပြန် run လိမ့်မယ် — ဒါကြောင့် — notification တစ်ခုတည်းကို ထပ်ပြပါလိမ့်မယ်!

**ဒီမှာ ပြဿနာက — ဒါက ပထမနေရာမှာ Effect တစ်ခု မဖြစ်သင့်ဘူးဆိုတာပါ။** သင်က *form ကို submit လုပ်ခြင်း* ဆိုတဲ့ တိကျတဲ့ interaction တစ်ခုကို တုံ့ပြန်တဲ့အနေနဲ့ — ဒီ POST request ပို့ပြီး notification ပြသချင်တာပါ။ တိကျတဲ့ interaction တစ်ခုကို တုံ့ပြန်ဖို့ code တချို့ run လုပ်ချင်ရင် — အဲဒီ logic ကို သက်ဆိုင်ရာ event handler ထဲ တိုက်ရိုက် ထည့်ပါ:

```js
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Good: Event-specific logic is called from event handlers
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }

  // ...
}
```

အခု code က event handler တစ်ခုထဲမှာ ရှိတာမို့ — reactive မဟုတ်တော့ပါဘူး — ဒါကြောင့် — အသုံးပြုသူက form ကို submit လုပ်တဲ့အခါမှပဲ run ပါလိမ့်မယ်။ [event handlers နဲ့ Effects တွေကြား ရွေးချယ်ခြင်း](/docs/react/separating-events-from-effects#reactive-values-and-reactive-logic) နဲ့ [မလိုအပ်တဲ့ Effects တွေကို ဖျက်နည်း](/docs/react/you-might-not-need-an-effect) အကြောင်း ပိုဖတ်ပါ။

### သင့် Effect က ဆက်စပ်မှုမရှိတဲ့ အရာများစွာကို လုပ်နေလား

နောက်တစ်ခု ကိုယ့်ကိုယ်ကို မေးသင့်တာက — သင့် Effect က ဆက်စပ်မှုမရှိတဲ့ အရာများစွာကို လုပ်နေလားဆိုတာပါ။

အသုံးပြုသူက သူတို့ရဲ့ မြို့နဲ့ နယ်မြေကို ရွေးချယ်ဖို့ လိုတဲ့ shipping form တစ်ခုကို ဖန်တီးနေတယ်ဆိုပါစို့။ ရွေးထားတဲ့ `country` အလိုက် server ကနေ `cities` စာရင်းကို fetch လုပ်ပြီး — dropdown တစ်ခုထဲမှာ ပြပါတယ်:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

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
  }, [country]); // ✅ All dependencies declared

  // ...
```

ဒါက [Effect တစ်ခုထဲမှာ data fetching လုပ်ခြင်း](/docs/react/you-might-not-need-an-effect#fetching-data) ရဲ့ ကောင်းတဲ့ ဥပမာတစ်ခုပါ။ `cities` state ကို `country` prop အလိုက် network နဲ့ ထပ်တူပြုနေပါတယ်။ ဒါကို event handler တစ်ခုထဲမှာ လုပ်လို့ မရပါဘူး — ဘာလို့လဲဆိုတော့ — `ShippingForm` ကို ပြသလိုက်တာနဲ့ — ပြီးတော့ `country` ပြောင်းတိုင်း (ဘယ် interaction ကြောင့် ဖြစ်ဖြစ်) — fetch လုပ်ဖို့ လိုလို့ပါ။

အခု — မြို့နယ်မြေတွေအတွက် ဒုတိယ select box တစ်ခု ထည့်နေတယ်ဆိုပါစို့ — အဲဒါက လက်ရှိရွေးထားတဲ့ `city` အတွက် `areas` တွေကို fetch လုပ်သင့်ပါတယ်။ ဒီလိုမျိုး — areas စာရင်းအတွက် ဒုတိယ `fetch` ခေါ်မှုတစ်ခုကို Effect တစ်ခုတည်းရဲ့ အတွင်းမှာ ထည့်ပြီး စတင်နိုင်ပါတယ်:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Avoid: A single Effect synchronizes two independent processes
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ All dependencies declared

  // ...
```

ဒါပေမယ့် — Effect က အခု `city` state variable ကို သုံးနေတာမို့ — dependency စာရင်းထဲ `city` ကို ထည့်ရပါတယ်။ အဲဒါက ပြဿနာတစ်ခုကို ဖြစ်ပေါ်စေပါတယ်: အသုံးပြုသူက မတူတဲ့ မြို့တစ်မြို့ကို ရွေးတဲ့အခါ — Effect က ပြန် run ပြီး `fetchCities(country)` ကို ခေါ်ပါလိမ့်မယ်။ ရလဒ်အနေနဲ့ — cities စာရင်းကို အကြိမ်များစွာ မလိုအပ်ဘဲ ပြန် refetch လုပ်နေပါလိမ့်မယ်။

**ဒီ code ရဲ့ ပြဿနာက — ဆက်စပ်မှုမရှိတဲ့ အရာနှစ်ခုကို သင်က ထပ်တူပြုနေလို့ပါ:**

1. `cities` state ကို `country` prop ပေါ် အခြေခံပြီး network နဲ့ ထပ်တူပြုချင်ပါတယ်။
2. `areas` state ကို `city` state ပေါ် အခြေခံပြီး network နဲ့ ထပ်တူပြုချင်ပါတယ်။

Logic ကို Effect နှစ်ခုအဖြစ် ခွဲပါ — တစ်ခုချင်းစီက သူထပ်တူပြုဖို့ လိုတဲ့ prop ကို react လုပ်ပါလိမ့်မယ်:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
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
  }, [country]); // ✅ All dependencies declared

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
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
  }, [city]); // ✅ All dependencies declared

  // ...
```

အခု — ပထမ Effect က `country` ပြောင်းမှပဲ ပြန် run ပြီး — ဒုတိယ Effect က `city` ပြောင်းတဲ့အခါ ပြန် run ပါတယ်။ ရည်ရွယ်ချက်အလိုက် ခွဲထားပါပြီ: မတူတဲ့ အရာနှစ်ခုကို Effect သီးခြားနှစ်ခုနဲ့ ထပ်တူပြုပါတယ်။ Effect နှစ်ခုက dependency lists သီးခြားနှစ်ခု ရှိတာမို့ — တစ်ခုနဲ့တစ်ခု မရည်ရွယ်ဘဲ မနှိုးဆော်နိုင်ပါဘူး။

နောက်ဆုံး code က မူရင်းထက် ပိုရှည်ပေမယ့် — ဒီ Effects တွေကို ခွဲလိုက်တာက မှန်ကန်နေဆဲပါ။ [Effect တစ်ခုချင်းစီက သီးခြားလွတ်လပ်တဲ့ synchronization process တစ်ခုကို ကိုယ်စားပြုသင့်ပါတယ်](/docs/react/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process)။ ဒီဥပမာမှာ — Effect တစ်ခုကို ဖျက်လိုက်တာက တစ်ခြား Effect ရဲ့ logic ကို မချိုးဖျက်ပါဘူး။ ဒါက သူတို့ *မတူတဲ့အရာတွေကို ထပ်တူပြုတယ်* ဆိုတာကို ဆိုလိုပြီး — သူတို့ကို ခွဲလိုက်တာ ကောင်းပါတယ်။ Duplication အတွက် စိုးရိမ်ရင် — [ထပ်ခါထပ်ခါ ဖြစ်နေတဲ့ logic ကို custom Hook တစ်ခုအဖြစ် ထုတ်ယူခြင်း](/docs/react/reusing-logic-with-custom-hooks) ဖြင့် ဒီ code ကို တိုးတက်စေနိုင်ပါတယ်။

### နောက် State ကို တွက်ချက်ဖို့ State တချို့ ဖတ်နေလား

ဒီ Effect က message အသစ်တစ်ခု ရောက်လာတိုင်း — `messages` state variable ကို အသစ်ဖန်တီးထားတဲ့ array တစ်ခုနဲ့ update လုပ်ပါတယ်:

```js
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

အဲဒါက `messages` variable ကို သုံးပြီး — [array အသစ်တစ်ခု ဖန်တီးကာ](/docs/react/updating-arrays-in-state) — ရှိပြီးသား messages တွေအားလုံးနဲ့ စတင်ပြီး — နောက်ဆုံးမှာ message အသစ်ကို ထည့်ပါတယ်။ ဒါပေမယ့် — `messages` က Effect တစ်ခုက ဖတ်တဲ့ reactive value တစ်ခုဖြစ်တာမို့ — dependency တစ်ခု ဖြစ်ရပါမယ်:

```js
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ All dependencies declared
  // ...
```

ပြီးတော့ `messages` ကို dependency တစ်ခု လုပ်လိုက်တာက ပြဿနာတစ်ခုကို ဖြစ်ပေါ်စေပါတယ်။

Message တစ်ခု လက်ခံရရှိတိုင်း — `setMessages()` က component ကို — message အသစ်ပါဝင်တဲ့ `messages` array အသစ်တစ်ခုနဲ့ re-render ဖြစ်စေပါတယ်။ ဒါပေမယ့် — ဒီ Effect က အခု `messages` ကို မှီခိုနေတာမို့ — Effect ကိုလည်း *ပြန်* re-synchronize လုပ်ပါလိမ့်မယ်။ ဒါကြောင့် — message အသစ်တိုင်းက chat ကို ပြန်ချိတ်ဆက်စေပါလိမ့်မယ်။ အသုံးပြုသူက အဲဒါကို မကြိုက်ပါဘူး!

ပြဿနာကို ဖြေရှင်းဖို့ — Effect ရဲ့ အတွင်းမှာ `messages` ကို မဖတ်ပါနဲ့။ အဲဒီအစား — `setMessages` ဆီ [updater function](/docs/react/useState) တစ်ခုကို ပေးပါ:

```js
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

**သင့် Effect က အခု `messages` variable ကို လုံးဝ မဖတ်တော့တာ သတိပြုပါ။** `msgs => [...msgs, receivedMessage]` လိုမျိုး updater function တစ်ခုကိုပဲ ပေးဖို့ လိုပါတယ်။ React က [သင့် updater function ကို queue တစ်ခုထဲ ထည့်ပြီး](/docs/react/queueing-a-series-of-state-updates) — နောက် render အတွင်းမှာ `msgs` argument ကို ပေးပါလိမ့်မယ်။ ဒါကြောင့် — Effect ကိုယ်တိုင်က `messages` ကို မမှီခိုတော့တာပါ။ ဒီပြုပြင်မှုရဲ့ ရလဒ်အနေနဲ့ — chat message တစ်ခု လက်ခံရရှိတာက chat ကို ပြန်ချိတ်ဆက်စေတော့မှာ မဟုတ်ပါဘူး။

### တန်ဖိုးတစ်ခုကို သူ့ရဲ့ အပြောင်းအလဲတွေကို "react" မလုပ်ဘဲ ဖတ်ချင်လား

အသုံးပြုသူက message အသစ်တစ်ခု လက်ခံရရှိတဲ့အခါ — `isMuted` က `true` မဟုတ်ဘူးဆိုရင် — အသံတစ်ခု ဖွင့်ချင်တယ်ဆိုပါစို့:

```js
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

သင့် Effect က အခု သူ့ရဲ့ code ထဲမှာ `isMuted` ကို သုံးနေတာမို့ — dependencies တွေထဲ ထည့်ရပါတယ်:

```js
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ All dependencies declared
  // ...
```

ပြဿနာက — `isMuted` ပြောင်းတိုင်း (ဥပမာ — အသုံးပြုသူက "Muted" toggle ကို နှိပ်တဲ့အခါ) — Effect က re-synchronize ဖြစ်ပြီး — chat ဆီ ပြန်ချိတ်ဆက်ပါလိမ့်မယ်။ ဒါက လိုချင်တဲ့ user experience မဟုတ်ပါဘူး! (ဒီဥပမာမှာ — linter ကို ပိတ်ထားရင်တောင် အလုပ်မဖြစ်ပါဘူး — ဒီလိုလုပ်ရင် — `isMuted` က သူ့ရဲ့ အဟောင်းတန်ဖိုးနဲ့ "ကပ်နေ" ပါလိမ့်မယ်။)

ဒီပြဿနာကို ဖြေရှင်းဖို့ — reactive မဖြစ်သင့်တဲ့ logic ကို Effect ရဲ့ အပြင်ကို ထုတ်ယူဖို့ လိုပါတယ်။ ဒီ Effect က `isMuted` ရဲ့ အပြောင်းအလဲတွေကို "react" လုပ်စေချင်တာ မဟုတ်ပါဘူး။ [ဒီ non-reactive logic အပိုင်းကို Effect Event တစ်ခုဆီ ရွှေ့ပါ:](/docs/react/separating-events-from-effects#declaring-an-effect-event)

```js
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Effect Events တွေက သင့် Effect ကို — reactive အပိုင်းတွေ (reactive values ဖြစ်တဲ့ `roomId` နဲ့ သူတို့ရဲ့ အပြောင်းအလဲတွေကို "react" သင့်တာ) နဲ့ — non-reactive အပိုင်းတွေ (သူတို့ရဲ့ နောက်ဆုံးတန်ဖိုးတွေကိုပဲ ဖတ်တာ — `onMessage` က `isMuted` ဖတ်သလိုမျိုး) အဖြစ် ခွဲနိုင်စေပါတယ်။ **အခု သင်က `isMuted` ကို Effect Event တစ်ခုရဲ့ အတွင်းမှာ ဖတ်တာမို့ — အဲဒါက သင့် Effect ရဲ့ dependency တစ်ခု ဖြစ်ဖို့ မလိုတော့ပါဘူး။** ရလဒ်အနေနဲ့ — "Muted" setting ကို ဖွင့်/ပိတ်လုပ်တဲ့အခါ — chat က ပြန်ချိတ်ဆက်မှာ မဟုတ်တော့ပါဘူး — မူလပြဿနာကို ဖြေရှင်းပြီးပါပြီ!

#### Props ကနေ လာတဲ့ Event Handler တစ်ခုကို ထုပ်ပေးခြင်း

သင့် component က event handler တစ်ခုကို prop တစ်ခုအနေနဲ့ လက်ခံရရှိတဲ့အခါ — အလားတူ ပြဿနာတစ်ခုကို ကြုံရနိုင်ပါတယ်:

```js
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ All dependencies declared
  // ...
```

Parent component က render တိုင်း — *မတူတဲ့* `onReceiveMessage` function တစ်ခုကို ပို့ပေးတယ်ဆိုပါစို့:

```js
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

`onReceiveMessage` က dependency တစ်ခုဖြစ်တာမို့ — parent re-render တိုင်းပြီးနောက်မှာ — Effect က re-synchronize ဖြစ်စေပါလိမ့်မယ်။ ဒါက chat ကို ပြန်ချိတ်ဆက်စေပါလိမ့်မယ်။ ဒါကို ဖြေရှင်းဖို့ — ခေါ်မှုကို Effect Event တစ်ခုထဲမှာ ထုပ်ပါ:

```js
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Effect Events တွေက reactive မဟုတ်တာမို့ — သူတို့ကို dependencies အဖြစ် သတ်မှတ်ဖို့ မလိုပါဘူး။ ရလဒ်အနေနဲ့ — parent component က re-render တိုင်း မတူတဲ့ function တစ်ခု ပို့ပေးရင်တောင် — chat က ပြန်ချိတ်ဆက်တော့မှာ မဟုတ်ပါဘူး။

#### Reactive နဲ့ Non-Reactive Code တွေကို ခွဲခြားခြင်း

ဒီဥပမာမှာ — `roomId` ပြောင်းတိုင်း visit တစ်ခုကို log လုပ်ချင်ပါတယ်။ Log တိုင်းမှာ လက်ရှိ `notificationCount` ကို ထည့်ချင်ပေမယ့် — `notificationCount` ရဲ့ အပြောင်းအလဲတစ်ခုက log event တစ်ခုကို စတင်စေတာ *မလိုချင်ပါဘူး*။

ဖြေရှင်းနည်းက — နောက်တစ်ခါလည်း — non-reactive code ကို Effect Event တစ်ခုအဖြစ် ခွဲထုတ်ခြင်းပါ:

```js
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

သင့် logic က `roomId` နဲ့ ပတ်သက်ပြီး reactive ဖြစ်စေချင်တာမို့ — `roomId` ကို သင့် Effect ရဲ့ အတွင်းမှာ ဖတ်ပါတယ်။ ဒါပေမယ့် — `notificationCount` ရဲ့ အပြောင်းအလဲတစ်ခုက visit အပိုတစ်ခုကို log မလုပ်စေချင်တာမို့ — `notificationCount` ကို Effect Event ရဲ့ အတွင်းမှာ ဖတ်ပါတယ်။ [Effect Events တွေကို သုံးပြီး Effects တွေကနေ နောက်ဆုံး props နဲ့ state တွေကို ဖတ်ခြင်း](/docs/react/separating-events-from-effects#reading-latest-props-and-state-with-effect-events) အကြောင်း ပိုလေ့လာပါ။

### Reactive Value တစ်ခုက မရည်ရွယ်ဘဲ ပြောင်းလဲနေလား

တခါတရံ — သင်က သင့် Effect ကို တန်ဖိုးတစ်ခုကို "react" လုပ်စေချင်ပေမယ့် — အဲဒီတန်ဖိုးက သင်လိုချင်တာထက် ပိုပြီး မကြာခဏ ပြောင်းလဲနေပြီး — အသုံးပြုသူရဲ့ ရှုထောင့်ကနေ တကယ့် ပြောင်းလဲမှုတစ်ခုကို မထင်ဟပ်နိုင်တာမျိုး ရှိပါတယ်။ ဥပမာ — သင့် component ရဲ့ body ထဲမှာ `options` object တစ်ခု ဖန်တီးပြီး — အဲဒီ object ကို သင့် Effect ရဲ့ အတွင်းကနေ ဖတ်တယ်ဆိုပါစို့:

```js
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

ဒီ object က component body ထဲမှာ ကြေညာထားတာမို့ — [reactive value](/docs/react/lifecycle-of-reactive-effects#effects-react-to-reactive-values) တစ်ခုပါ။ ဒီလိုမျိုး reactive value တစ်ခုကို Effect တစ်ခုရဲ့ အတွင်းမှာ ဖတ်တဲ့အခါ — dependency တစ်ခုအဖြစ် ကြေညာပါတယ်။ ဒါက သင့် Effect က သူ့ရဲ့ အပြောင်းအလဲတွေကို "react" လုပ်ကြောင်း သေချာစေပါတယ်:

```js
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

Dependency တစ်ခုအဖြစ် ကြေညာတာ အရေးကြီးပါတယ်! ဒါက — ဥပမာ — `roomId` ပြောင်းရင် — သင့် Effect က `options` အသစ်တွေနဲ့ chat ဆီ ပြန်ချိတ်ဆက်ကြောင်း သေချာစေပါတယ်။ ဒါပေမယ့် — အထက်က code မှာ ပြဿနာတစ်ခုလည်း ရှိပါတယ်။ အဲဒါကို မြင်ဖို့ — အောက်က sandbox ထဲက input ထဲ စာရိုက်ကြည့်ပြီး — console ထဲမှာ ဘာဖြစ်လဲ ကြည့်ပါ:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Temporarily disable the linter to demonstrate the problem
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```
```js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```
```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

အထက်က sandbox ထဲမှာ — input က `message` state variable ကိုပဲ update လုပ်ပါတယ်။ အသုံးပြုသူရဲ့ ရှုထောင့်ကကြည့်ရင် — ဒါက chat connection ကို မထိခိုက်စေသင့်ပါဘူး။ ဒါပေမယ့် — `message` ကို update လုပ်တိုင်း — သင့် component က re-render ဖြစ်ပါတယ်။ Component re-render ဖြစ်တဲ့အခါ — သူ့ရဲ့ အတွင်းက code က အစကနေ ပြန် run ပါတယ်။

`ChatRoom` component ရဲ့ re-render တိုင်းမှာ — `options` object အသစ်တစ်ခု အစကနေ ဖန်တီးပါတယ်။ React က `options` object က နောက်ဆုံး render အတွင်း ဖန်တီးထားတဲ့ `options` object နဲ့ *object မတူဘူး* ဆိုတာ မြင်ပါတယ်။ ဒါကြောင့် — သင့် Effect ကို (ဒါက `options` ကို မှီခိုနေလို့) re-synchronize လုပ်ပြီး — သင်စာရိုက်နေတုန်း chat က ပြန်ချိတ်ဆက်နေတာပါ။

**ဒီပြဿနာက objects နဲ့ functions တွေကိုပဲ သက်ရောက်ပါတယ်။ JavaScript မှာ — အသစ်ဖန်တီးလိုက်တဲ့ object နဲ့ function တစ်ခုချင်းစီကို တခြားအားလုံးနဲ့ မတူညီတဲ့အရာလို့ သတ်မှတ်ပါတယ်။ သူတို့ရဲ့ အတွင်းက အကြောင်းအရာတွေ အတူတူဖြစ်နေရင်တောင် အရေးမကြီးပါဘူး!**

```js
// During the first render
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// During the next render
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// These are two different objects!
console.log(Object.is(options1, options2)); // false
```

**Object နဲ့ function dependencies တွေက သင့် Effect ကို သင်လိုအပ်တာထက် ပိုပြီး မကြာခဏ re-synchronize ဖြစ်စေနိုင်ပါတယ်။**

ဒါကြောင့် — တတ်နိုင်သမျှ — objects နဲ့ functions တွေကို သင့် Effect ရဲ့ dependencies အဖြစ် ရှောင်ဖို့ ကြိုးစားသင့်ပါတယ်။ အဲဒီအစား — သူတို့ကို component ရဲ့ အပြင်ဘက်၊ Effect ရဲ့ အတွင်းဘက် ရွှေ့ဖို့ ဒါမှမဟုတ် — သူတို့ထဲက primitive values တွေကို ထုတ်ယူဖို့ ကြိုးစားပါ။

#### Static Objects နဲ့ Functions တွေကို သင့် Component ရဲ့ အပြင်ဘက်ကို ရွှေ့ပါ

Object က props နဲ့ state ဘယ်အပေါ်မှာမှ မမှီခိုဘူးဆိုရင် — အဲဒီ object ကို သင့် component ရဲ့ အပြင်ဘက်ကို ရွှေ့နိုင်ပါတယ်:

```js
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

ဒီနည်းနဲ့ — reactive မဟုတ်ဘူးဆိုတာ linter ဆီ *သက်သေပြ* လိုက်ပါတယ်။ Re-render တစ်ခုရဲ့ ရလဒ်အနေနဲ့ ပြောင်းလဲလို့ မရတာမို့ — dependency တစ်ခု ဖြစ်ဖို့ မလိုပါဘူး။ အခု `ChatRoom` ကို re-render လုပ်တာက သင့် Effect ကို re-synchronize မဖြစ်စေတော့ပါဘူး။

ဒါက functions တွေအတွက်လည်း အလုပ်လုပ်ပါတယ်:

```js
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

`createOptions` က သင့် component ရဲ့ အပြင်မှာ ကြေညာထားတာမို့ — reactive value မဟုတ်ပါဘူး။ ဒါကြောင့် — သင့် Effect ရဲ့ dependencies တွေထဲမှာ သတ်မှတ်ဖို့ မလိုဘဲ — သင့် Effect ကို re-synchronize ဖြစ်စေတာ ဘယ်တော့မှ မရှိပါဘူး။

#### Dynamic Objects နဲ့ Functions တွေကို သင့် Effect ရဲ့ အတွင်းဘက်ကို ရွှေ့ပါ

သင့် object က re-render တစ်ခုရဲ့ ရလဒ်အနေနဲ့ ပြောင်းလဲနိုင်တဲ့ reactive value တစ်ခုခုကို မှီခိုနေရင် — `roomId` prop လိုမျိုးပေါ့ — အဲဒါကို သင့် component ရဲ့ *အပြင်ဘက်ကို* ဆွဲထုတ်လို့ မရပါဘူး။ ဒါပေမယ့် — သူ့ရဲ့ ဖန်တီးမှုကို သင့် Effect ရဲ့ code ရဲ့ *အတွင်းဘက်* ကို ရွှေ့နိုင်ပါတယ်:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

အခု `options` က သင့် Effect ရဲ့ အတွင်းမှာ ကြေညာထားတာမို့ — သင့် Effect ရဲ့ dependency တစ်ခု မဟုတ်တော့ပါဘူး။ အဲဒီအစား — သင့် Effect က သုံးတဲ့ reactive value တစ်ခုတည်းက `roomId` ပါ။ `roomId` က object ဒါမှမဟုတ် function မဟုတ်တာမို့ — အဲဒါ *မရည်ရွယ်ဘဲ* မတူဘူးဆိုတာ သေချာနိုင်ပါတယ်။ JavaScript မှာ — numbers နဲ့ strings တွေကို သူတို့ရဲ့ အကြောင်းအရာအလိုက် နှိုင်းယှဉ်ပါတယ်:

```js
// During the first render
const roomId1 = 'music';

// During the next render
const roomId2 = 'music';

// These two strings are the same!
console.log(Object.is(roomId1, roomId2)); // true
```

ဒီပြုပြင်မှုကြောင့် — input ကို တည်းဖြတ်ရင် — chat က ပြန်ချိတ်ဆက်တော့မှာ မဟုတ်ပါဘူး:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```
```js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```
```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

ဒါပေမယ့် — `roomId` dropdown ကို ပြောင်းတဲ့အခါတော့ — သင်မျှော်လင့်ထားသလိုပဲ — *ပြန်* ချိတ်ဆက်ပါတယ်။

ဒါက functions တွေအတွက်လည်း အလုပ်လုပ်ပါတယ်:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

သင့် Effect ရဲ့ အတွင်းမှာ logic အပိုင်းတွေကို စုစည်းဖို့ — ကိုယ်ပိုင် functions တွေ ရေးနိုင်ပါတယ်။ သူတို့ကို သင့် Effect ရဲ့ *အတွင်းမှာပဲ* ကြေညာထားသရွေ့ — သူတို့က reactive values မဟုတ်တာမို့ — သင့် Effect ရဲ့ dependencies တွေ ဖြစ်ဖို့ မလိုပါဘူး။

#### Objects တွေကနေ Primitive Values တွေကို ဖတ်ပါ

တခါတရံ — props တွေကနေ object တစ်ခု လက်ခံရရှိနိုင်ပါတယ်:

```js
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

ဒီမှာ အန္တရာယ်က — parent component က rendering အတွင်းမှာ object ကို ဖန်တီးပါလိမ့်မယ်:

```js
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

ဒါက သင့် Effect ကို — parent component re-render တိုင်း — ပြန်ချိတ်ဆက်စေပါလိမ့်မယ်။ ဒါကို ပြုပြင်ဖို့ — object ကနေ အချက်အလက်တွေကို Effect ရဲ့ *အပြင်ဘက်* မှာ ဖတ်ပြီး — object နဲ့ function dependencies တွေ ရှိခြင်းကို ရှောင်ပါ:

```js
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

Logic က နည်းနည်း ထပ်ခါထပ်ခါ ဖြစ်လာပါတယ် (Effect တစ်ခုရဲ့ အပြင်ဘက်မှာ object တစ်ခုကနေ တန်ဖိုးတချို့ ဖတ်ပြီး — Effect ရဲ့ အတွင်းမှာ တန်ဖိုးတွေ အတူတူနဲ့ object တစ်ခု ဖန်တီးရတာမျိုး)။ ဒါပေမယ့် — ဒါက သင့် Effect က *တကယ်* ဘာတွေပေါ်မှာ မှီခိုလဲဆိုတာ အရမ်း ရှင်းလင်းစေပါတယ်။ Object တစ်ခုကို parent component က မရည်ရွယ်ဘဲ ပြန်ဖန်တီးရင် — chat က ပြန်ချိတ်ဆက်မှာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — `options.roomId` ဒါမှမဟုတ် `options.serverUrl` တွေက တကယ် မတူညီတာတွေဆိုရင်တော့ — chat က ပြန်ချိတ်ဆက်ပါလိမ့်မယ်။

#### Functions တွေကနေ Primitive Values တွေကို တွက်ချက်ပါ

ဒီနည်းလမ်းက functions တွေအတွက်လည်း အလုပ်လုပ်နိုင်ပါတယ်။ ဥပမာ — parent component က function တစ်ခုကို ပို့ပေးတယ်ဆိုပါစို့:

```js
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

ဒါကို dependency တစ်ခု ဖြစ်စေတာ (ပြီးတော့ re-renders တွေမှာ ပြန်ချိတ်ဆက်စေတာ) ရှောင်ဖို့ — Effect ရဲ့ အပြင်ဘက်မှာ ခေါ်ပါ။ ဒါက သင့်ကို — object တွေမဟုတ်တဲ့ — သင့် Effect ရဲ့ အတွင်းကနေ ဖတ်နိုင်တဲ့ — `roomId` နဲ့ `serverUrl` တန်ဖိုးတွေကို ပေးပါလိမ့်မယ်:

```js
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

ဒါက [pure](/docs/react/keeping-components-pure) functions တွေအတွက်ပဲ အလုပ်လုပ်ပါတယ် — ဘာလို့လဲဆိုတော့ သူတို့က rendering အတွင်းမှာ ခေါ်ဖို့ အန္တရာယ်ကင်းလို့ပါ။ သင့် function က event handler တစ်ခုဆိုရင် — ဒါပေမယ့် သူ့ရဲ့ အပြောင်းအလဲတွေက သင့် Effect ကို re-synchronize မလုပ်စေချင်ဘူးဆိုရင် — [အဲဒါကို Effect Event တစ်ခုထဲမှာ ထုပ်လိုက်ပါ](/docs/react/removing-effect-dependencies#do-you-want-to-read-a-value-without-reacting-to-its-changes)။

## အကျဉ်းချုပ်

- Dependencies တွေက code နဲ့ အမြဲ ကိုက်ညီရမယ်။
- Dependencies တွေကို မကျေနပ်တဲ့အခါ — သင်ပြင်ဆင်ရမှာက code ပါ။
- Linter ကို ဖိနှိပ်တာက အလွန်ရှုပ်ထွေးတဲ့ bug တွေဆီ ဦးတည်စေပြီး — အမြဲတမ်း ရှောင်သင့်ပါတယ်။
- Dependency တစ်ခုကို ဖယ်ရှားဖို့ — အဲဒါ မလိုအပ်ကြောင်း linter ဆီ "သက်သေပြ" ဖို့ လိုပါတယ်။
- Code တချို့က တိကျတဲ့ interaction တစ်ခုကို တုံ့ပြန်ဖို့ run သင့်တယ်ဆိုရင် — အဲဒီ code ကို event handler တစ်ခုဆီ ရွှေ့ပါ။
- သင့် Effect ရဲ့ အပိုင်းမတူတဲ့တွေက အကြောင်းပြချက်မတူတာတွေနဲ့ ပြန် run သင့်တယ်ဆိုရင် — Effect အများကြီးအဖြစ် ခွဲပါ။
- အရင် state ပေါ် အခြေခံပြီး state တချို့ update လုပ်ချင်ရင် — updater function တစ်ခု ပေးပါ။
- နောက်ဆုံးတန်ဖိုးကို "react" မလုပ်ဘဲ ဖတ်ချင်ရင် — သင့် Effect ကနေ Effect Event တစ်ခုကို ထုတ်ယူပါ။
- JavaScript မှာ — objects နဲ့ functions တွေက မတူတဲ့အချိန်တွေမှာ ဖန်တီးခဲ့ရင် — မတူညီတယ်လို့ သတ်မှတ်ပါတယ်။
- Object နဲ့ function dependencies တွေကို ရှောင်ဖို့ ကြိုးစားပါ။ သူတို့ကို component ရဲ့ အပြင်ဘက် ဒါမှမဟုတ် Effect ရဲ့ အတွင်းဘက်ကို ရွှေ့ပါ။

## စိန်ခေါ်မှုများ (Challenges)

### ပြန်လည်စတင်နေတဲ့ Interval တစ်ခုကို ပြုပြင်ခြင်း

ဒီ Effect က စက္ကန့်တိုင်း tick လုပ်တဲ့ interval တစ်ခုကို တည်ဆောက်ပါတယ်။ ထူးဆန်းတဲ့အရာတစ်ခု ဖြစ်နေတာ သတိထားမိပါတယ်: interval က tick တိုင်းမှာ ဖျက်ဆီးခံရပြီး — ပြန်ဖန်တီးခံရသလို ဖြစ်နေပါတယ်။ Interval က အဆက်မပြတ် ပြန်မဖန်တီးခံရအောင် — code ကို ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** ဒီ Effect ရဲ့ code က `count` ပေါ်မှာ မှီခိုနေပုံရပါတယ်။ ဒီ dependency မလိုအပ်အောင် လုပ်ဖို့ နည်းလမ်းတစ်ခုခု ရှိလား? အဲဒီတန်ဖိုးပေါ်မှာ dependency တစ်ခု မထည့်ဘဲ — သူ့ရဲ့ အရင်တန်ဖိုးပေါ် အခြေခံပြီး `count` state ကို update လုပ်ဖို့ နည်းလမ်းတစ်ခု ရှိသင့်ပါတယ်။

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

#### အဖြေ

Effect ရဲ့ အတွင်းကနေ `count` state ကို `count + 1` ဖြစ်အောင် update လုပ်ချင်ပါတယ်။ ဒါပေမယ့် — ဒါက သင့် Effect ကို `count` ပေါ်မှာ မှီခိုစေပြီး — tick တိုင်း ပြောင်းလဲတာမို့ — ဒါကြောင့် — tick တိုင်းမှာ သင့် interval က ပြန်ဖန်တီးခံရတာပါ။

ဒါကို ဖြေရှင်းဖို့ — [updater function](/docs/react/useState) ကို သုံးပြီး — `setCount(count + 1)` အစား `setCount(c => c + 1)` လို့ ရေးပါ:

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

Effect ရဲ့ အတွင်းမှာ `count` ကို ဖတ်မယ့်အစား — `c => c + 1` ဆိုတဲ့ ညွှန်ကြားချက်တစ်ခု ("ဒီနံပါတ်ကို တိုးပါ!") ကို React ဆီ ပေးလိုက်ပါတယ်။ React က နောက် render မှာ အဲဒါကို သက်ရောက်စေပါလိမ့်မယ်။ ပြီးတော့ — သင့် Effect ရဲ့ အတွင်းမှာ `count` ရဲ့ တန်ဖိုးကို ဖတ်ဖို့ မလိုတော့တာမို့ — သင့် Effect ရဲ့ dependencies တွေကို ဗလာ (`[]`) ထားနိုင်ပါတယ်။ ဒါက သင့် Effect က tick တိုင်း interval ကို ပြန်ဖန်တီးခြင်းကနေ တားဆီးပါတယ်။

### ပြန်လည်စတင်နေတဲ့ Animation တစ်ခုကို ပြုပြင်ခြင်း

ဒီဥပမာမှာ — "Show" ကို နှိပ်လိုက်တဲ့အခါ — ကြိုဆိုရေး message တစ်ခု fade in ဖြစ်ပါတယ်။ Animation က တစ်စက္ကန့် ကြာပါတယ်။ "Remove" ကို နှိပ်လိုက်တဲ့အခါ — ကြိုဆိုရေး message က ချက်ချင်း ပျောက်သွားပါတယ်။ Fade-in animation ရဲ့ logic ကို `animation.js` file ထဲမှာ — သာမန် JavaScript [animation loop](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) အဖြစ် implement လုပ်ထားပါတယ်။ အဲဒီ logic ကို ပြောင်းစရာ မလိုပါဘူး။ အဲဒါကို third-party library တစ်ခုလို သဘောထားနိုင်ပါတယ်။ သင့် Effect က DOM node အတွက် `FadeInAnimation` instance တစ်ခု ဖန်တီးပြီး — animation ကို ထိန်းချုပ်ဖို့ `start(duration)` ဒါမှမဟုတ် `stop()` ကို ခေါ်ပါတယ်။ `duration` ကို slider တစ်ခုနဲ့ ထိန်းချုပ်ပါတယ်။ Slider ကို ချိန်ညှိပြီး animation ဘယ်လို ပြောင်းလဲလဲ ကြည့်ပါ။

ဒီ code က အလုပ်လုပ်ပြီးသားပါ — ဒါပေမယ့် — သင်ပြောင်းချင်တာတစ်ခု ရှိပါတယ်။ လက်ရှိမှာ — `duration` state variable ကို ထိန်းချုပ်တဲ့ slider ကို ရွှေ့တဲ့အခါ — animation ကို ပြန်လည်စတင်စေပါတယ်။ Effect က `duration` variable ကို "react" မလုပ်အောင် — အပြုအမူကို ပြောင်းပါ။ "Show" ကို နှိပ်တဲ့အခါ — Effect က slider ပေါ်က လက်ရှိ `duration` ကို သုံးသင့်ပါတယ်။ ဒါပေမယ့် — slider ကို ရွှေ့တာကိုယ်တိုင်က — animation ကို ပြန်လည်စတင်စေတာ မဖြစ်သင့်ပါဘူး။

> **အရိပ်အမြွက်:** Effect ရဲ့ အတွင်းမှာ reactive မဖြစ်သင့်တဲ့ code line တစ်ခု ရှိလား? Non-reactive code ကို Effect ရဲ့ အပြင်ကို ဘယ်လို ရွှေ့နိုင်လဲ?

```js
import { useState, useEffect, useRef } from 'react';
import { useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```
```js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
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
```

#### အဖြေ

သင့် Effect က `duration` ရဲ့ နောက်ဆုံးတန်ဖိုးကို ဖတ်ဖို့ လိုပေမယ့် — `duration` ရဲ့ အပြောင်းအလဲတွေကို "react" လုပ်စေချင်တာ မဟုတ်ပါဘူး။ Animation ကို စတင်ဖို့ `duration` ကို သုံးပေမယ့် — animation စတင်တာက reactive မဟုတ်ပါဘူး။ Non-reactive code line ကို Effect Event တစ်ခုအဖြစ် ထုတ်ယူပြီး — အဲဒီ function ကို သင့် Effect ကနေ ခေါ်ပါ။

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```
```js
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
    if (progress < 1) {
      // We still have more frames to paint
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
```

`onAppear` လိုမျိုး Effect Events တွေက reactive မဟုတ်တာမို့ — animation ကို ပြန်လည်မစတင်စေဘဲ — အတွင်းမှာ `duration` ကို ဖတ်နိုင်ပါတယ်။

### ပြန်ချိတ်ဆက်နေတဲ့ Chat တစ်ခုကို ပြုပြင်ခြင်း

ဒီဥပမာမှာ — "Toggle theme" ကို နှိပ်လိုက်တိုင်း — chat က ပြန်ချိတ်ဆက်ပါတယ်။ ဘာကြောင့် ဒီလိုဖြစ်တာလဲ? Server URL ကို တည်းဖြတ်တဲ့အခါ ဒါမှမဟုတ် တစ်ခြား chat room တစ်ခု ရွေးတဲ့အခါမှပဲ — chat က ပြန်ချိတ်ဆက်အောင် — အမှားကို ပြုပြင်ပါ။

`chat.js` ကို external third-party library တစ်ခုလို သဘောထားပါ: သူ့ရဲ့ API ကို စစ်ဆေးဖို့ ကြည့်လို့ ရပါတယ် — ဒါပေမယ့် — တည်းဖြတ်လို့ မရပါဘူး။

> **အရိပ်အမြွက်:** ဒါကို ပြုပြင်ဖို့ နည်းလမ်းတစ်ခုထက် ပိုရှိပါတယ် — ဒါပေမယ့် — အဆုံးမှာတော့ သင့် dependency အဖြစ် object တစ်ခု ရှိခြင်းကို ရှောင်ချင်ပါတယ်။

```js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```
```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
}
```
```js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```
```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

#### အဖြေ

သင့် Effect က `options` object ကို မှီခိုနေလို့ — ပြန်လည် run နေတာပါ။ Objects တွေက မရည်ရွယ်ဘဲ ပြန်ဖန်တီးခံရနိုင်ပါတယ် — တတ်နိုင်သမျှ — သူတို့ကို သင့် Effects တွေရဲ့ dependencies အဖြစ် ရှောင်ဖို့ ကြိုးစားသင့်ပါတယ်။

အနည်းဆုံး ထိုးဖောက်မှုရှိတဲ့ (least invasive) ပြုပြင်မှုက — Effect ရဲ့ အပြင်ဘက်မှာပဲ `roomId` နဲ့ `serverUrl` တွေကို ဖတ်ပြီး — Effect ကို အဲဒီ primitive values တွေ (မရည်ရွယ်ဘဲ မပြောင်းနိုင်တဲ့) ပေါ်မှာ မှီခိုစေခြင်းပါ။ Effect ရဲ့ အတွင်းမှာ — object တစ်ခု ဖန်တီးပြီး `createConnection` ဆီ ပေးပါ:

```js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```
```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
}
```
```js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```
```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

`options` object prop အစား — ပိုတိကျတဲ့ `roomId` နဲ့ `serverUrl` props တွေကို သုံးမယ်ဆိုရင် — ပိုကောင်းပါလိမ့်မယ်:

```js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
        serverUrl={serverUrl}
      />
    </div>
  );
}
```
```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```
```js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```
```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

တတ်နိုင်သမျှ — primitive props တွေကိုပဲ သုံးတာက နောက်ပိုင်းမှာ သင့် components တွေကို optimize လုပ်ရတာ ပိုလွယ်ကူစေပါတယ်။

### ပြန်ချိတ်ဆက်နေတဲ့ Chat တစ်ခုကို ထပ်ပြီး ပြုပြင်ခြင်း

ဒီဥပမာက chat ကို encryption နဲ့ ဒါမှမဟုတ် မပါဘဲ ချိတ်ဆက်ပါတယ်။ Checkbox ကို toggle လုပ်ပြီး — encryption ဖွင့်ထားချိန်နဲ့ ပိတ်ထားချိန်မှာ console ထဲက message တွေ မတူတာကို သတိပြုပါ။ Room ကို ပြောင်းကြည့်ပါ။ ပြီးရင် — theme ကို toggle လုပ်ကြည့်ပါ။ Chat room တစ်ခုဆီ ချိတ်ဆက်ထားတဲ့အခါ — စက္ကန့်အနည်းငယ်တိုင်း message အသစ်တွေ လက်ခံရရှိပါလိမ့်မယ်။ သူတို့ရဲ့ အရောင်က သင်ရွေးထားတဲ့ theme နဲ့ ကိုက်ညီကြောင်း စစ်ဆေးပါ။

ဒီဥပမာမှာ — theme ကို ပြောင်းဖို့ ကြိုးစားတိုင်း — chat က ပြန်ချိတ်ဆက်ပါတယ်။ ဒါကို ပြုပြင်ပါ။ ပြုပြင်ပြီးတဲ့နောက် — theme ပြောင်းတာက chat ကို ပြန်ချိတ်ဆက်မစေသင့်ဘဲ — encryption settings တွေ toggle လုပ်တာ ဒါမှမဟုတ် room ပြောင်းတာကတော့ ပြန်ချိတ်ဆက်စေသင့်ပါတယ်။

`chat.js` ထဲက code တစ်ခုခုကို မပြောင်းပါနဲ့။ အဲဒါကလွဲရင် — အပြုအမူတွေ အတူတူ ဖြစ်စေသရွေ့ — ဘယ် code ကိုမဆို ပြောင်းနိုင်ပါတယ်။ ဥပမာ — အောက်ကို ပို့ပေးနေတဲ့ props တွေကို ပြောင်းတာ အသုံးဝင်နိုင်ပါတယ်။

> **အရိပ်အမြွက်:** သင်က function နှစ်ခုကို အောက်ကို ပို့ပေးနေပါတယ်: `onMessage` နဲ့ `createConnection`။ သူတို့ နှစ်ခုလုံးကို `App` re-render တိုင်း အစကနေ ဖန်တီးပါတယ်။ အကြိမ်တိုင်း သူတို့ကို တန်ဖိုးအသစ်တွေလို့ သတ်မှတ်တာမို့ — ဒါကြောင့် သင့် Effect ကို ပြန်လည်စတင်စေတာပါ။
>
> ဒီ function တွေထဲက တစ်ခုက event handler တစ်ခုပါ။ Event handler function ရဲ့ တန်ဖိုးအသစ်တွေကို "react" မလုပ်ဘဲ — Effect တစ်ခုထဲကနေ event handler တစ်ခုကို ခေါ်ဖို့ နည်းလမ်းတစ်ခုခု သင်သိလား? အဲဒါ အသုံးဝင်ပါလိမ့်မယ်!
>
> ဒီ function တွေထဲက နောက်တစ်ခုက imported API method တစ်ခုဆီ state တချို့ ပို့ပေးဖို့ပဲ တည်ရှိနေတာပါ။ ဒီ function က တကယ် လိုအပ်လား? အောက်ကို ပို့ပေးနေတဲ့ မရှိမဖြစ် အချက်အလက်က ဘာလဲ? သင့်က `App.js` ကနေ `ChatRoom.js` ဆီ import တချို့ ရွှေ့ဖို့ လိုနိုင်ပါတယ်။

```json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```
```js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```
```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```
```js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
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
```css
label, button { display: block; margin-bottom: 5px; }
```

#### အဖြေ

ဒါကို ဖြေရှင်းဖို့ မှန်ကန်တဲ့ နည်းလမ်းတစ်ခုထက် ပိုရှိပါတယ် — ဒါပေမယ့် — ဒီမှာ ဖြစ်နိုင်တဲ့ ဖြေရှင်းနည်းတစ်ခုပါ။

မူရင်းဥပမာမှာ — theme ကို toggle လုပ်တာက — `onMessage` နဲ့ `createConnection` functions မတူညီတာတွေ ဖန်တီးပြီး အောက်ကို ပို့ပေးစေခဲ့ပါတယ်။ Effect က ဒီ functions တွေကို မှီခိုနေတာမို့ — theme ကို toggle လုပ်တိုင်း — chat က ပြန်ချိတ်ဆက်ပါလိမ့်မယ်။

`onMessage` နဲ့ ပတ်သက်တဲ့ ပြဿနာကို ပြုပြင်ဖို့ — အဲဒါကို Effect Event တစ်ခုထဲမှာ ထုပ်ဖို့ လိုပါတယ်:

```js
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

`onMessage` prop နဲ့ မတူဘဲ — `onReceiveMessage` Effect Event က reactive မဟုတ်ပါဘူး။ ဒါကြောင့် — သင့် Effect ရဲ့ dependency တစ်ခု ဖြစ်ဖို့ မလိုပါဘူး။ ရလဒ်အနေနဲ့ — `onMessage` ရဲ့ အပြောင်းအလဲတွေက chat ကို ပြန်ချိတ်ဆက်စေမှာ မဟုတ်ပါဘူး။

`createConnection` နဲ့တော့ ဒီလိုပဲ လုပ်လို့ မရပါဘူး — ဘာလို့လဲဆိုတော့ အဲဒါက reactive *ဖြစ်သင့်လို့ပါ*။ အသုံးပြုသူက encrypted နဲ့ unencrypted connection ကြား ပြောင်းရင် ဒါမှမဟုတ် လက်ရှိ room ကို ပြောင်းရင် — Effect က ပြန်လည်စတင်စေတာ *လိုချင်* ပါတယ်။ ဒါပေမယ့် — `createConnection` က function တစ်ခုဖြစ်တာမို့ — အဲဒါ ဖတ်တဲ့ အချက်အလက်တွေ *တကယ်* ပြောင်းလဲခဲ့လားဆိုတာ စစ်ဆေးလို့ မရပါဘူး။ ဒါကို ဖြေရှင်းဖို့ — `App` component ကနေ `createConnection` ကို အောက်ကို ပို့ပေးမယ့်အစား — raw `roomId` နဲ့ `isEncrypted` တန်ဖိုးတွေကို ပို့ပေးပါ:

```js
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

အခု — `App` ကနေ အောက်ကို ပို့ပေးမယ့်အစား — `createConnection` function ကို Effect ရဲ့ *အတွင်းဘက်* ကို ရွှေ့နိုင်ပါတယ်:

```js
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

ဒီပြောင်းလဲမှု နှစ်ခုပြီးတဲ့နောက် — သင့် Effect က function တန်ဖိုးတွေကို မမှီခိုတော့ပါဘူး:

```js
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reactive values
  const onReceiveMessage = useEffectEvent(onMessage); // Not reactive

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Reading a reactive value
      };
      if (isEncrypted) { // Reading a reactive value
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ All dependencies declared
```

ရလဒ်အနေနဲ့ — အဓိပ္ပာယ်ရှိတဲ့အရာ (`roomId` ဒါမှမဟုတ် `isEncrypted`) ပြောင်းတဲ့အခါမှပဲ — chat က ပြန်ချိတ်ဆက်ပါတယ်:

```json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```
```js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```
```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```
```js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
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
```css
label, button { display: block; margin-bottom: 5px; }
```
