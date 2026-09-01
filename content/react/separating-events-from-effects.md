---
title: "Events တွေကို Effects တွေကနေ ခွဲခြားခြင်း"
description: "Event handlers နဲ့ Effects တွေကို ဘယ်အချိန် သုံးရမလဲ — Effects တွေ reactive ဖြစ်ပြီး event handlers တွေ မဖြစ်တဲ့ အကြောင်းရင်း၊ Effect Event တွေဆိုတာ ဘာလဲ၊ Effects တွေကနေ non-reactive logic တွေကို ဘယ်လို ထုတ်ယူမလဲ၊ Effect Events တွေနဲ့ နောက်ဆုံး props/state တွေကို ဘယ်လို ဖတ်မလဲ"
order: 18
source: "https://react.dev/learn/separating-events-from-effects"
status: translated
updated: 2026-09-01
---

Event handlers တွေက သင်က interaction တစ်ခုတည်းကို ထပ်လုပ်ဆောင်တဲ့အခါမှပဲ ပြန် run ပါတယ်။ Event handlers တွေနဲ့ မတူဘဲ — Effects တွေက သူတို့ဖတ်တဲ့ တန်ဖိုးတစ်ခုခု (prop ဒါမှမဟုတ် state variable လိုမျိုး) က နောက်ဆုံး render တုန်းကနဲ့ မတူညီတဲ့အခါ — re-synchronize လုပ်ပါတယ်။ တခါတရံ — အပြုအမူ နှစ်မျိုးလုံးရဲ့ ရောနှောမှုတစ်ခုလည်း လိုချင်နိုင်ပါတယ်: တန်ဖိုးတချို့ကို တုံ့ပြန်ပြီး တချို့ကို မတုံ့ပြန်တဲ့ — re-run ဖြစ်တဲ့ Effect တစ်ခုပေါ့။ ဒီ page က အဲဒါကို ဘယ်လို လုပ်ရမလဲ သင်ပေးပါလိမ့်မယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- Event handler တစ်ခုနဲ့ Effect တစ်ခုကြား ဘယ်လို ရွေးချယ်မလဲ
- Effects တွေ ဘာကြောင့် reactive ဖြစ်ပြီး — event handlers တွေ ဘာကြောင့် မဖြစ်တာလဲ
- သင့် Effect ရဲ့ code ရဲ့ အပိုင်းတစ်ပိုင်းကို reactive မဖြစ်စေချင်တဲ့အခါ ဘာလုပ်ရမလဲ
- Effect Events တွေဆိုတာ ဘာလဲ — ပြီးတော့ သင့် Effects တွေကနေ ဘယ်လို ထုတ်ယူမလဲ
- Effect Events တွေကို သုံးပြီး Effects တွေကနေ နောက်ဆုံး props နဲ့ state တွေကို ဘယ်လို ဖတ်မလဲ

## Event Handlers တွေနဲ့ Effects တွေကြား ရွေးချယ်ခြင်း

ပထမဆုံး — event handlers တွေနဲ့ Effects တွေရဲ့ ကွာခြားချက်ကို ပြန်လည်သုံးသပ်ကြည့်ရအောင်။

Chat room component တစ်ခုကို implement လုပ်နေတယ်လို့ စိတ်ကူးကြည့်ပါ။ သင့် လိုအပ်ချက်တွေက ဒီလိုပါ:

1. သင့် component က ရွေးထားတဲ့ chat room ဆီ အလိုအလျောက် ချိတ်ဆက်သင့်ပါတယ်။
2. "Send" button ကို နှိပ်တဲ့အခါ — chat ဆီ message တစ်ခု ပို့သင့်ပါတယ်။

သူတို့အတွက် code တွေကို implement လုပ်ပြီးပြီလို့ ဆိုပါစို့ — ဒါပေမယ့် — ဘယ်မှာ ထားရမလဲဆိုတာ မသေချာပါဘူး။ Event handlers တွေကို သုံးသင့်လား Effects တွေကို သုံးသင့်လား? ဒီမေးခွန်းကို ဖြေဖို့ လိုတိုင်း — code က [*ဘာကြောင့်* run ဖို့ လိုလဲ](/docs/react/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)ဆိုတာကို စဉ်းစားပါ။

### Event Handlers တွေက တိကျတဲ့ Interactions တွေကို တုံ့ပြန်ပြီး Run ပါတယ်

အသုံးပြုသူရဲ့ ရှုထောင့်ကကြည့်ရင် — message ပို့တာက တိကျတဲ့ "Send" button ကို နှိပ်လို့ *ဖြစ်သင့်* ပါတယ်။ တခြားအချိန် ဒါမှမဟုတ် တခြားအကြောင်းပြချက်တစ်ခုခုနဲ့ သူတို့ရဲ့ message ကို သင်ပို့လိုက်ရင် — အသုံးပြုသူက အတော်လေး စိတ်ဆိုးပါလိမ့်မယ်။ ဒါကြောင့် — message ပို့တာက event handler တစ်ခု ဖြစ်သင့်ပါတယ်။ Event handlers တွေက သင့်ကို တိကျတဲ့ interactions တွေကို ကိုင်တွယ်နိုင်စေပါတယ်:

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

Event handler တစ်ခုနဲ့ဆိုရင် — `sendMessage(message)` က အသုံးပြုသူက button ကို နှိပ်မှပဲ *လုံးဝ* run မယ်ဆိုတာ သေချာနိုင်ပါတယ်။

### Effects တွေက Synchronization လိုအပ်တိုင်း Run ပါတယ်

Component ကို chat room ဆီ ချိတ်ဆက်ထားဖို့လည်း လိုတာ သတိရပါ။ အဲဒီ code က ဘယ်မှာ သွားလဲ?

ဒီ code ကို run ဖို့ *အကြောင်းပြချက်* က တိကျတဲ့ interaction တစ်ခု မဟုတ်ပါဘူး။ အသုံးပြုသူက chat room screen ဆီ ဘာကြောင့် ဒါမှမဟုတ် ဘယ်လို သွားရောက်ခဲ့လဲဆိုတာ အရေးမကြီးပါဘူး။ အခု သူတို့က အဲဒါကို ကြည့်နေပြီး — interaction လုပ်နိုင်တာမို့ — component က ရွေးထားတဲ့ chat server ဆီ ချိတ်ဆက်ထားဖို့ လိုပါတယ်။ Chat room component က သင့် app ရဲ့ ကနဦး screen ဖြစ်ပြီး — အသုံးပြုသူက interaction တစ်ခုမှ မလုပ်ရသေးရင်တောင် — သင်က *ဆက်ပြီး* ချိတ်ဆက်ဖို့ လိုပါလိမ့်မယ်။ ဒါကြောင့် — ဒါက Effect တစ်ခုပါ:

```js
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

ဒီ code နဲ့ဆိုရင် — လက်ရှိ ရွေးထားတဲ့ chat server ဆီ — အသုံးပြုသူ လုပ်ဆောင်တဲ့ တိကျတဲ့ interactions တွေ *ဘယ်လိုပဲ ရှိရှိ* — active connection တစ်ခု အမြဲတမ်း ရှိနေမယ်ဆိုတာ သေချာနိုင်ပါတယ်။ အသုံးပြုသူက သင့် app ကို ဖွင့်ထားတာပဲဖြစ်ဖြစ်၊ တခြား room တစ်ခု ရွေးထားတာပဲဖြစ်ဖြစ်၊ တခြား screen တစ်ခုဆီ သွားပြီး ပြန်လာတာပဲဖြစ်ဖြစ် — သင့် Effect က component က လက်ရှိ ရွေးထားတဲ့ room နဲ့ *ထပ်တူကျနေအောင်* ပြုလုပ်ပေးပြီး — [လိုအပ်တိုင်း ပြန်ချိတ်ဆက်](/docs/react/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once) ပါလိမ့်မယ်။

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
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
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```
```js
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

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
input, select { margin-right: 20px; }
```

## Reactive Values နဲ့ Reactive Logic

အလိုလိုသိနိုင်တဲ့အတိုင်း — event handlers တွေက အမြဲတမ်း "ကိုယ်တိုင်" စတင်ခံရတယ်လို့ ပြောနိုင်ပါတယ် — ဥပမာ — button တစ်ခုကို နှိပ်ခြင်းဖြင့်ပေါ့။ Effects တွေကတော့ — "အလိုအလျောက်" ပါ: သူတို့က ထပ်တူကျနေဖို့ လိုသလောက် အကြိမ်များများ run ပြီး ပြန် run ပါတယ်။

ဒါကို စဉ်းစားဖို့ ပိုတိကျတဲ့ နည်းလမ်းတစ်ခု ရှိပါတယ်။

သင့် component ရဲ့ body ထဲမှာ ကြေညာထားတဲ့ props၊ state နဲ့ variables တွေကို reactive values လို့ ခေါ်ပါတယ်။ ဒီဥပမာမှာ — `serverUrl` က reactive value မဟုတ်ပေမယ့် — `roomId` နဲ့ `message` တွေကတော့ reactive ပါ။ သူတို့က rendering data flow ထဲမှာ ပါဝင်ပါတယ်:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

ဒီလိုမျိုး reactive values တွေက re-render တစ်ခုကြောင့် ပြောင်းလဲနိုင်ပါတယ်။ ဥပမာ — အသုံးပြုသူက `message` ကို တည်းဖြတ်နိုင် ဒါမှမဟုတ် dropdown ထဲမှာ `roomId` မတူတာတစ်ခု ရွေးနိုင်ပါတယ်။ Event handlers နဲ့ Effects တွေက အပြောင်းအလဲတွေကို မတူညီတဲ့နည်းနဲ့ တုံ့ပြန်ပါတယ်:

- **Event handlers ရဲ့ အတွင်းက Logic က *reactive မဟုတ်ပါ။*** အသုံးပြုသူက interaction တစ်ခုတည်း (ဥပမာ — click တစ်ခု) ကို ထပ်လုပ်ဆောင်မှပဲ — အဲဒါ ပြန် run ပါလိမ့်မယ်။ Event handlers တွေက reactive values တွေကို သူတို့ရဲ့ အပြောင်းအလဲတွေကို "react" မလုပ်ဘဲ ဖတ်နိုင်ပါတယ်။
- **Effects တွေရဲ့ အတွင်းက Logic က *reactive* ပါ။** သင့် Effect က reactive value တစ်ခုကို ဖတ်ရင် — [အဲဒါကို dependency အဖြစ် သတ်မှတ်ရပါမယ်](/docs/react/lifecycle-of-reactive-effects#effects-react-to-reactive-values)။ ပြီးရင် — re-render တစ်ခုက အဲဒီတန်ဖိုးကို ပြောင်းစေရင် — React က သင့် Effect ရဲ့ logic ကို တန်ဖိုးအသစ်နဲ့ ပြန် run ပါလိမ့်မယ်။

ဒီကွာခြားချက်ကို သရုပ်ဖော်ဖို့ — အရင် ဥပမာကို ပြန်ကြည့်ရအောင်။

### Event Handlers ရဲ့ အတွင်းက Logic က Reactive မဟုတ်ပါ

ဒီ code line ကို ကြည့်ပါ။ ဒီ logic က reactive ဖြစ်သင့်လား မဖြစ်သင့်ဘူးလား?

```js
    // ...
    sendMessage(message);
    // ...
```

အသုံးပြုသူရဲ့ ရှုထောင့်ကကြည့်ရင် — **`message` ရဲ့ အပြောင်းအလဲတစ်ခုက သူတို့က message ပို့ချင်တယ်လို့ _မဆိုလို_ ပါဘူး။** အဲဒါက အသုံးပြုသူ စာရိုက်နေတယ်လို့ပဲ ဆိုလိုပါတယ်။ တစ်နည်းပြောရရင် — message ပို့တဲ့ logic က reactive မဖြစ်သင့်ပါဘူး။ reactive value ပြောင်းလို့ပဲ — အဲဒါ ပြန် run မဖြစ်သင့်ပါဘူး။ ဒါကြောင့် — အဲဒါက event handler ထဲမှာ ပိုင်ဆိုင်ပါတယ်:

```js
  function handleSendClick() {
    sendMessage(message);
  }
```

Event handlers တွေ reactive မဟုတ်တာမို့ — `sendMessage(message)` က အသုံးပြုသူက Send button ကို နှိပ်တဲ့အခါမှပဲ run ပါလိမ့်မယ်။

### Effects တွေရဲ့ အတွင်းက Logic က Reactive ပါ

အခု — ဒီ lines တွေဆီ ပြန်သွားရအောင်:

```js
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

အသုံးပြုသူရဲ့ ရှုထောင့်ကကြည့်ရင် — **`roomId` ရဲ့ အပြောင်းအလဲတစ်ခုက သူတို့က တခြား room တစ်ခုဆီ ချိတ်ဆက်ချင်တယ်လို့ _ဆိုလို_ ပါတယ်။** တစ်နည်းပြောရရင် — room ဆီ ချိတ်ဆက်တဲ့ logic က reactive ဖြစ်သင့်ပါတယ်။ ဒီ code lines တွေက reactive value နဲ့ "အမီလိုက်နေ" စေချင်ပြီး — အဲဒီတန်ဖိုး မတူညီတဲ့အခါ ပြန် run စေချင်ပါတယ်။ ဒါကြောင့် — အဲဒါက Effect တစ်ခုထဲမှာ ပိုင်ဆိုင်ပါတယ်:

```js
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Effects တွေ reactive ဖြစ်တာမို့ — `createConnection(serverUrl, roomId)` နဲ့ `connection.connect()` တွေက `roomId` ရဲ့ တန်ဖိုးတစ်ခုချင်းစီအတွက် run ပါလိမ့်မယ်။ သင့် Effect က chat connection ကို လက်ရှိ ရွေးထားတဲ့ room နဲ့ ထပ်တူကျနေစေပါတယ်။

## Non-Reactive Logic တွေကို Effects တွေကနေ ထုတ်ယူခြင်း

Reactive logic ကို non-reactive logic နဲ့ ရောနှောချင်တဲ့အခါ — အရာတွေက ပိုရှုပ်ထွေးလာပါတယ်။

ဥပမာ — အသုံးပြုသူက chat ဆီ ချိတ်ဆက်တဲ့အခါ notification တစ်ခု ပြသချင်တယ်ဆိုပါစို့။ Notification ကို အရောင်မှန်မှန် ပြသဖို့ props ကနေ လက်ရှိ theme (dark ဒါမှမဟုတ် light) ကို ဖတ်ပါတယ်:

```js
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

ဒါပေမယ့် — `theme` က reactive value တစ်ခုပါ (re-rendering ရဲ့ ရလဒ်အနေနဲ့ ပြောင်းလဲနိုင်လို့) — ပြီးတော့ — [Effect တစ်ခုက ဖတ်တဲ့ reactive value တိုင်းကို သူ့ရဲ့ dependency အဖြစ် ကြေညာရပါမယ်](/docs/react/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)။ အခု — `theme` ကို သင့် Effect ရဲ့ dependency တစ်ခုအဖြစ် သတ်မှတ်ရပါမယ်:

```js
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ All dependencies declared
  // ...
```

ဒီဥပမာနဲ့ ကစားကြည့်ပြီး — ဒီ user experience နဲ့ ပတ်သက်တဲ့ ပြဿနာကို ရှာတွေ့နိုင်မလား ကြည့်ပါ:

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
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```
```js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
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
label { display: block; margin-top: 10px; }
```

`roomId` ပြောင်းတဲ့အခါ — chat က သင်မျှော်လင့်ထားသလိုပဲ ပြန်ချိတ်ဆက်ပါတယ်။ ဒါပေမယ့် — `theme` ကလည်း dependency တစ်ခုဖြစ်တာမို့ — dark နဲ့ light theme ကြား ပြောင်းလိုက်တိုင်း — chat က *လည်း* ပြန်ချိတ်ဆက်ပါတယ်။ ဒါက မကောင်းပါဘူး!

တစ်နည်းပြောရရင် — ဒီ line က Effect တစ်ခု (reactive ဖြစ်တဲ့) ရဲ့ အတွင်းမှာ ရှိနေပေမယ့် — သင်က အဲဒါ reactive မဖြစ်စေချင်ပါဘူး:

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

ဒီ non-reactive logic ကို ဝန်းရံနေတဲ့ reactive Effect ကနေ ခွဲထုတ်ဖို့ — နည်းလမ်းတစ်ခု လိုပါတယ်။

### Effect Event တစ်ခုကို ကြေညာခြင်း

ဒီ non-reactive logic ကို သင့် Effect ကနေ ထုတ်ယူဖို့ — [`useEffectEvent`](/docs/react/use-effect-event) လို့ ခေါ်တဲ့ အထူး Hook တစ်ခုကို သုံးပါ:

```js
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

ဒီမှာ — `onConnected` ကို *Effect Event* လို့ ခေါ်ပါတယ်။ အဲဒါက သင့် Effect logic ရဲ့ အစိတ်အပိုင်းတစ်ခုပါ — ဒါပေမယ့် — event handler တစ်ခုနဲ့ ပိုတူတဲ့ အပြုအမူ ရှိပါတယ်။ အဲဒါရဲ့ အတွင်းက logic က reactive မဟုတ်ဘဲ — သင့် props နဲ့ state တွေရဲ့ နောက်ဆုံးတန်ဖိုးတွေကို အမြဲတမ်း "မြင်" ပါတယ်။

အခု — သင့် Effect ရဲ့ အတွင်းကနေ `onConnected` Effect Event ကို ခေါ်နိုင်ပါတယ်:

```js
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

ဒါက ပြဿနာကို ဖြေရှင်းပေးပါတယ်။ သင့် Effect ရဲ့ dependencies စာရင်းကနေ `theme` ကို *ဖယ်ရှား* ရတာ သတိပြုပါ — ဘာလို့လဲဆိုတော့ အဲဒါကို Effect ထဲမှာ မသုံးတော့လို့ပါ။ `onConnected` ကိုလည်း အဲဒါထဲ *ထည့်* ဖို့ မလိုပါဘူး — ဘာလို့လဲဆိုတော့ **Effect Events တွေက reactive မဟုတ်ဘဲ — dependencies တွေကနေ ချန်လှပ်ရပါမယ်။**

အပြုအမူအသစ်က သင်မျှော်လင့်ထားသလို အလုပ်လုပ်ကြောင်း စစ်ဆေးပါ:

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
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```
```js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
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
label { display: block; margin-top: 10px; }
```

Effect Events တွေကို event handlers တွေနဲ့ အရမ်းတူတယ်လို့ စဉ်းစားနိုင်ပါတယ်။ အဓိက ကွာခြားချက်က — event handlers တွေက user interactions တွေကို တုံ့ပြန်ပြီး run ပြီး — Effect Events တွေကတော့ Effects တွေကနေ သင်ကိုယ်တိုင် စတင်ပေးတာပါ။ Effect Events တွေက Effects တွေရဲ့ reactivity နဲ့ — reactive မဖြစ်သင့်တဲ့ code တွေကြားက "ကွင်းဆက်ကို ဖြတ်တောက်" နိုင်စေပါတယ်။

### Effect Events တွေနဲ့ နောက်ဆုံး Props နဲ့ State တွေကို ဖတ်ခြင်း

Effect Events တွေက — dependency linter ကို ဖိနှိပ်ချင်စိတ် ပေါ်စေနိုင်တဲ့ — pattern များစွာကို ပြုပြင်နိုင်စေပါတယ်။

ဥပမာ — page visits တွေကို log လုပ်ဖို့ Effect တစ်ခု ရှိတယ်ဆိုပါစို့:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

နောက်ပိုင်းမှာ — သင့် site ဆီ routes အများကြီး ထည့်ပါတယ်။ အခု သင့် `Page` component က လက်ရှိ path နဲ့ `url` prop တစ်ခုကို လက်ခံရရှိပါတယ်။ `logVisit` ခေါ်မှုရဲ့ အစိတ်အပိုင်းတစ်ခုအနေနဲ့ `url` ကို ပေးချင်ပေမယ့် — dependency linter က မကျေမနပ် ပြောနေပါတယ်:

```js
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

Code ကို ဘာလုပ်စေချင်လဲ စဉ်းစားကြည့်ပါ။ URL တစ်ခုချင်းစီက page မတူတာတစ်ခုကို ကိုယ်စားပြုတာမို့ — URL မတူညီတာတွေအတွက် visit သီးခြားစီ log လုပ်စေချင်ပါတယ်။ တစ်နည်းပြောရရင် — ဒီ `logVisit` ခေါ်မှုက `url` နဲ့ ပတ်သက်ပြီး reactive *ဖြစ်သင့်* ပါတယ်။ ဒါကြောင့် — ဒီကိစ္စမှာ — dependency linter ကို လိုက်နာပြီး — `url` ကို dependency တစ်ခုအဖြစ် ထည့်တာ အဓိပ္ပာယ်ရှိပါတယ်:

```js
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

အခု — page visit တိုင်းနဲ့အတူ — shopping cart ထဲက items အရေအတွက်ကိုပါ ထည့်ချင်တယ်ဆိုပါစို့:

```js
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

သင်က Effect ရဲ့ အတွင်းမှာ `numberOfItems` ကို သုံးတာမို့ — linter က အဲဒါကို dependency တစ်ခုအဖြစ် ထည့်ဖို့ တောင်းဆိုပါတယ်။ ဒါပေမယ့် — `logVisit` ခေါ်မှုက `numberOfItems` နဲ့ ပတ်သက်ပြီး reactive ဖြစ်စေချင်တာ *မဟုတ်ပါဘူး*။ အသုံးပြုသူက shopping cart ထဲ တစ်ခုခု ထည့်လိုက်လို့ — `numberOfItems` ပြောင်းသွားရင် — ဒါက အသုံးပြုသူက page ကို ပြန်လည်လည်ပတ်လိုက်တယ်လို့ *မဆိုလို* ပါဘူး။ တစ်နည်းပြောရရင် — *page ကို လည်ပတ်ခြင်း* က တစ်နည်းတစ်ဖုံအားဖြင့် "event" တစ်ခုပါ။ အဲဒါက အချိန်တိကျတဲ့ ကာလတစ်ခုမှာ ဖြစ်ပါတယ်။

Code ကို အပိုင်းနှစ်ပိုင်း ခွဲလိုက်ပါ:

```js
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

ဒီမှာ — `onVisit` က Effect Event တစ်ခုပါ။ အဲဒါရဲ့ အတွင်းက code က reactive မဟုတ်ပါဘူး။ ဒါကြောင့် — `numberOfItems` (ဒါမှမဟုတ် တခြား reactive value ဘယ်ဟာမဆို!) ကို — အဲဒါက ဝန်းရံနေတဲ့ code ကို အပြောင်းအလဲတွေမှာ ပြန် run စေမှာကို စိုးရိမ်စရာ မလိုဘဲ — သုံးနိုင်ပါတယ်။

တစ်ဖက်မှာ — Effect ကိုယ်တိုင်ကတော့ reactive ဖြစ်နေဆဲပါ။ Effect ရဲ့ အတွင်းက code က `url` prop ကို သုံးတာမို့ — `url` မတူတာနဲ့ re-render တိုင်းပြီးနောက်မှာ Effect က ပြန် run ပါလိမ့်မယ်။ အဲဒါက `onVisit` Effect Event ကို ခေါ်စေပါတယ်။

ရလဒ်အနေနဲ့ — `url` ပြောင်းလဲမှုတိုင်းအတွက် `logVisit` ကို ခေါ်ပြီး — `numberOfItems` ရဲ့ နောက်ဆုံးတန်ဖိုးကို အမြဲတမ်း ဖတ်ပါလိမ့်မယ်။ ဒါပေမယ့် — `numberOfItems` က သူ့ဘာသာသူ ပြောင်းလဲရင်တော့ — code တစ်ခုခုကို ပြန် run စေမှာ မဟုတ်ပါဘူး။

> **မှတ်ချက်:** `onVisit()` ကို argument မပါဘဲ ခေါ်ပြီး — အတွင်းမှာ `url` ကို ဖတ်လို့ရမလားလို့ သင်တွေးမိနိုင်ပါတယ်:
>
> ```js
>   const onVisit = useEffectEvent(() => {
>     logVisit(url, numberOfItems);
>   });
>
>   useEffect(() => {
>     onVisit();
>   }, [url]);
> ```
>
> ဒါက အလုပ်လုပ်ပါလိမ့်မယ် — ဒါပေမယ့် — ဒီ `url` ကို Effect Event ဆီ ရှင်းလင်းစွာ ပို့ပေးတာ ပိုကောင်းပါတယ်။ **`url` ကို သင့် Effect Event ဆီ argument တစ်ခုအနေနဲ့ ပို့ပေးခြင်းဖြင့် — သင်က `url` မတူညီတာနဲ့ page တစ်ခုကို လည်ပတ်တာက အသုံးပြုသူရဲ့ ရှုထောင့်ကနေ "event" သီးခြားတစ်ခု ဖြစ်တယ်လို့ ပြောနေတာပါ။** `visitedUrl` က ဖြစ်ပျက်ခဲ့တဲ့ "event" ရဲ့ *အစိတ်အပိုင်း* တစ်ခုပါ:
>
> ```js
>   const onVisit = useEffectEvent(visitedUrl => {
>     logVisit(visitedUrl, numberOfItems);
>   });
>
>   useEffect(() => {
>     onVisit(url);
>   }, [url]);
> ```
>
> သင့် Effect Event က `visitedUrl` အတွက် ရှင်းလင်းစွာ "တောင်းဆို" နေတာမို့ — Effect ရဲ့ dependencies တွေကနေ `url` ကို မတော်တဆ ဖယ်ရှားလို့ မရတော့ပါဘူး။ `url` dependency ကို ဖယ်ရှားလိုက်ရင် (page visits မတူညီတာတွေကို တစ်ခုတည်းအဖြစ် ရေတွက်စေမယ့်) — linter က သင့်ကို သတိပေးပါလိမ့်မယ်။ `onVisit` က `url` နဲ့ ပတ်သက်ပြီး reactive ဖြစ်စေချင်တာမို့ — အတွင်းမှာ `url` ကို ဖတ်မယ့်အစား (အဲဒီမှာ reactive မဖြစ်တော့ဘူး) — အဲဒါကို သင့် Effect ကနေ *ပို့ပေး* လိုက်ပါ။
>
> Effect ရဲ့ အတွင်းမှာ asynchronous logic တချို့ ရှိနေရင် — ဒါက အထူးသဖြင့် အရေးကြီးပါတယ်:
>
> ```js
>   const onVisit = useEffectEvent(visitedUrl => {
>     logVisit(visitedUrl, numberOfItems);
>   });
>
>   useEffect(() => {
>     setTimeout(() => {
>       onVisit(url);
>     }, 5000); // Delay logging visits
>   }, [url]);
> ```
>
> ဒီမှာ — `onVisit` ရဲ့ အတွင်းက `url` က *နောက်ဆုံး* `url` (ပြောင်းသွားပြီးသား ဖြစ်နိုင်တဲ့) နဲ့ ကိုက်ညီပေမယ့် — `visitedUrl` ကတော့ — ဒီ Effect (နဲ့ ဒီ `onVisit` ခေါ်မှု) ကို စတင်စေခဲ့တဲ့ မူရင်း `url` နဲ့ ကိုက်ညီပါတယ်။

#### အဲဒီအစား Dependency Linter ကို ဖိနှိပ်တာ အဆင်ပြေလား

ရှိပြီးသား codebases တွေထဲမှာ — lint rule ကို ဒီလိုမျိုး ဖိနှိပ်ထားတာကို တခါတရံ မြင်ရနိုင်ပါတယ်:

```js
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Avoid suppressing the linter like this:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

Linter ကို **ဘယ်တော့မှ မဖိနှိပ်ဖို့** အကြံပြုပါတယ်။

Rule ကို ဖိနှိပ်တာရဲ့ ပထမဆုံး အားနည်းချက်က — သင့် Effect က သင်သင့် code ထဲ ထည့်လိုက်တဲ့ reactive dependency အသစ်တစ်ခုကို "react" လုပ်ဖို့ လိုတဲ့အခါ — React က သင့်ကို သတိပေးတော့မှာ မဟုတ်ဘူးဆိုတာပါ။ အရင် ဥပမာမှာ — သင်က `url` ကို dependencies တွေထဲ ထည့်ခဲ့တာက *React က သတိပေးလို့ပါ*။ Linter ကို ပိတ်ထားရင် — အဲဒီ Effect ဆီ နောက်ပိုင်း တည်းဖြတ်မှုတွေအတွက် — ဒီလိုမျိုး သတိပေးချက်တွေ ထပ်မရတော့ပါဘူး။ ဒါက bug တွေဆီ ဦးတည်စေပါတယ်။

Linter ကို ဖိနှိပ်ခြင်းကြောင့် ဖြစ်ရတဲ့ ရှုပ်ထွေးတဲ့ bug တစ်ခုရဲ့ ဥပမာတစ်ခု ဒီမှာပါ။ ဒီဥပမာမှာ — `handleMove` function က — အစက်က cursor နောက်ကို လိုက်သင့်/မလိုက်သင့်ဆိုတာ ဆုံးဖြတ်ဖို့ — လက်ရှိ `canMove` state variable တန်ဖိုးကို ဖတ်ဖို့ ရည်ရွယ်ထားပါတယ်။ ဒါပေမယ့် — `handleMove` ရဲ့ အတွင်းမှာ — `canMove` က အမြဲတမ်း `true` ပဲ ဖြစ်နေပါတယ်။

ဘာကြောင့်လဲ မြင်နိုင်လား?

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```
```css
body {
  height: 200px;
}
```

ဒီ code ရဲ့ ပြဿနာက — dependency linter ကို ဖိနှိပ်ထားတာပါ။ Suppression ကို ဖယ်လိုက်ရင် — ဒီ Effect က `handleMove` function ပေါ်မှာ မှီခိုသင့်တာ တွေ့ရပါလိမ့်မယ်။ ဒါက အဓိပ္ပာယ်ရှိပါတယ်: `handleMove` က component body ရဲ့ အတွင်းမှာ ကြေညာထားတာမို့ — reactive value တစ်ခု ဖြစ်စေပါတယ်။ Reactive value တိုင်းကို dependency အဖြစ် သတ်မှတ်ရပါမယ် — မဟုတ်ရင် — အချိန်ကြာလာတာနဲ့အမျှ stale ဖြစ်သွားနိုင်ပါတယ်!

မူရင်း code ရဲ့ ရေးသားသူက — Effect က reactive value တစ်ခုခုကို (`[]`) မမှီခိုဘူးလို့ ပြောခြင်းဖြင့် — React ကို "လိမ်ညာ" ထားပါတယ်။ ဒါကြောင့် — `canMove` ပြောင်းသွားပြီးနောက်မှာ (`handleMove` နဲ့အတူ) — React က Effect ကို re-synchronize မလုပ်ခဲ့ပါဘူး။ React က Effect ကို re-synchronize မလုပ်တာမို့ — listener အဖြစ် တွဲထားတဲ့ `handleMove` က ကနဦး render အတွင်း ဖန်တီးထားတဲ့ `handleMove` function ပါ။ ကနဦး render အတွင်းမှာ — `canMove` က `true` ဖြစ်ခဲ့တာမို့ — ကနဦး render ကနေ လာတဲ့ `handleMove` က အဲဒီတန်ဖိုးကိုပဲ ထာဝရ မြင်နေမှာပါ။

**Linter ကို ဘယ်တော့မှ မဖိနှိပ်ရင် — stale values နဲ့ ပတ်သက်တဲ့ ပြဿနာတွေကို ဘယ်တော့မှ မမြင်ရပါဘူး။**

`useEffectEvent` နဲ့ဆိုရင် — linter ကို "လိမ်ညာ" ဖို့ မလိုတော့ဘဲ — code က သင်မျှော်လင့်ထားသလို အလုပ်လုပ်ပါတယ်:

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```
```css
body {
  height: 200px;
}
```

ဒါက `useEffectEvent` က *အမြဲတမ်း* မှန်ကန်တဲ့ ဖြေရှင်းနည်းလို့ ဆိုလိုတာ မဟုတ်ပါဘူး။ သင်က reactive မဖြစ်စေချင်တဲ့ code lines တွေကိုပဲ ဒါကို သက်ရောက်စေသင့်ပါတယ်။ အထက်က sandbox ထဲမှာ — Effect ရဲ့ code က `canMove` နဲ့ ပတ်သက်ပြီး reactive ဖြစ်စေချင်တာ မဟုတ်ပါဘူး။ ဒါကြောင့် — Effect Event တစ်ခုကို ထုတ်ယူတာ အဓိပ္ပာယ်ရှိခဲ့ပါတယ်။

Linter ကို ဖိနှိပ်တာအတွက် တခြား မှန်ကန်တဲ့ အခြားရွေးချယ်စရာတွေကို [Removing Effect Dependencies](/docs/react/removing-effect-dependencies) မှာ ဖတ်ပါ။

### Effect Events တွေရဲ့ ကန့်သတ်ချက်များ

Effect Events တွေက သုံးနိုင်တဲ့ နည်းလမ်းတွေမှာ အရမ်း အကန့်အသတ်ရှိပါတယ်:

* **သူတို့ကို Effects တွေရဲ့ အတွင်းကနေပဲ ခေါ်ပါ။**
* **သူတို့ကို တခြား components ဒါမှမဟုတ် Hooks တွေဆီ ဘယ်တော့မှ မပို့ပါနဲ့။**

ဥပမာ — Effect Event တစ်ခုကို ကြေညာပြီး ဒီလိုမျိုး မပို့ပါနဲ့:

```js
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Avoid: Passing Effect Events

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Need to specify "callback" in dependencies
}
```

အဲဒီအစား — Effect Events တွေကို သူတို့သုံးတဲ့ Effects တွေရဲ့ ဘေးမှာ တိုက်ရိုက် အမြဲတမ်း ကြေညာပါ:

```js
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Good: Only called locally inside an Effect
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // No need to specify "onTick" (an Effect Event) as a dependency
}
```

Effect Events တွေက သင့် Effect code ရဲ့ non-reactive "အပိုင်းအစ" တွေပါ။ သူတို့ကို သုံးတဲ့ Effect ရဲ့ ဘေးမှာ ရှိသင့်ပါတယ်။

## အကျဉ်းချုပ်

- Event handlers တွေက တိကျတဲ့ interactions တွေကို တုံ့ပြန်ပြီး run ပါတယ်။
- Effects တွေက synchronization လိုအပ်တိုင်း run ပါတယ်။
- Event handlers ရဲ့ အတွင်းက Logic က reactive မဟုတ်ပါဘူး။
- Effects တွေရဲ့ အတွင်းက Logic က reactive ပါ။
- Non-reactive logic တွေကို Effects တွေကနေ Effect Events တွေဆီ ရွှေ့နိုင်ပါတယ်။
- Effect Events တွေကို Effects တွေရဲ့ အတွင်းကနေပဲ ခေါ်ပါ။
- Effect Events တွေကို တခြား components ဒါမှမဟုတ် Hooks တွေဆီ မပို့ပါနဲ့။

## စိန်ခေါ်မှုများ (Challenges)

### Update မဖြစ်တဲ့ Variable တစ်ခုကို ပြုပြင်ခြင်း

ဒီ `Timer` component က စက္ကန့်တိုင်း တိုးလာတဲ့ `count` state variable တစ်ခုကို ထားရှိပါတယ်။ အဲဒါ တိုးသွားတဲ့ တန်ဖိုးကို `increment` state variable ထဲမှာ သိမ်းထားပါတယ်။ Plus နဲ့ minus buttons တွေနဲ့ `increment` variable ကို ထိန်းချုပ်နိုင်ပါတယ်။

ဒါပေမယ့် — plus button ကို ဘယ်လောက်ပဲ နှိပ်နှိပ် — counter က စက္ကန့်တိုင်း တစ်နဲ့ပဲ တိုးနေတုန်းပါ။ ဒီ code မှာ ဘာမှားနေလဲ? Effect ရဲ့ code ရဲ့ အတွင်းမှာ `increment` က ဘာကြောင့် `1` နဲ့ အမြဲတမ်း တူနေတာလဲ? အမှားကို ရှာပြီး ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** ဒီ code ကို ပြုပြင်ဖို့ — စည်းမျဉ်းတွေကို လိုက်နာရုံနဲ့ လုံလောက်ပါတယ်။

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
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

#### အဖြေ

ပုံမှန်အတိုင်း — Effects တွေထဲမှာ bug တွေ ရှာတဲ့အခါ — linter suppressions တွေကို ရှာဖွေခြင်းဖြင့် စပါ။

Suppression comment ကို ဖယ်လိုက်ရင် — ဒီ Effect ရဲ့ code က `increment` ပေါ်မှာ မှီခိုတယ်လို့ React က ပြောပါလိမ့်မယ် — ဒါပေမယ့် — သင်က ဒီ Effect က reactive value တစ်ခုခုကို (`[]`) မမှီခိုဘူးလို့ ပြောခြင်းဖြင့် React ကို "လိမ်ညာ" ထားပါတယ်။ Dependency array ထဲ `increment` ကို ထည့်ပါ:

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

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

အခု — `increment` ပြောင်းတဲ့အခါ — React က သင့် Effect ကို re-synchronize လုပ်ပြီး — interval ကို ပြန်စပါလိမ့်မယ်။

### ရပ်တန့်နေတဲ့ Counter တစ်ခုကို ပြုပြင်ခြင်း

ဒီ `Timer` component က စက္ကန့်တိုင်း တိုးလာတဲ့ `count` state variable တစ်ခုကို ထားရှိပါတယ်။ အဲဒါ တိုးသွားတဲ့ တန်ဖိုးကို `increment` state variable ထဲမှာ သိမ်းထားပြီး — plus နဲ့ minus buttons တွေနဲ့ ထိန်းချုပ်နိုင်ပါတယ်။ ဥပမာ — plus button ကို ကိုးခါ နှိပ်ကြည့်ပါ — `count` က အခု စက္ကန့်တိုင်း တစ်နဲ့မဟုတ်ဘဲ — ဆယ်နဲ့ တိုးတာ သတိပြုပါ။

ဒီ user interface မှာ ပြဿနာငယ်တစ်ခု ရှိပါတယ်။ Plus ဒါမှမဟုတ် minus buttons တွေကို စက္ကန့်တစ်ခါထက် ပိုမြန်မြန် ဆက်နှိပ်နေရင် — timer ကိုယ်တိုင် ရပ်တန့်သွားသလို ဖြစ်တာ သတိထားမိနိုင်ပါတယ်။ Button တစ်ခုခုကို နောက်ဆုံးနှိပ်ပြီး တစ်စက္ကန့် ကြာပြီးမှပဲ — အဲဒါ ပြန်စပါတယ်။ ဒါက ဘာကြောင့် ဖြစ်နေလဲ ရှာပြီး — timer က *စက္ကန့်တိုင်း* အနှောင့်အယှက်မရှိ tick ဖြစ်နေအောင် — ပြဿနာကို ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** Timer ကို တည်ဆောက်ပေးတဲ့ Effect က `increment` တန်ဖိုးကို "react" နေပုံရပါတယ်။ `setCount` ကို ခေါ်ဖို့ လက်ရှိ `increment` တန်ဖိုးကို သုံးတဲ့ line က တကယ်ပဲ reactive ဖြစ်ဖို့ လိုလား?

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

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

#### အဖြေ

ပြဿနာက — Effect ရဲ့ အတွင်းက code က `increment` state variable ကို သုံးနေလို့ပါ။ အဲဒါက သင့် Effect ရဲ့ dependency တစ်ခုဖြစ်တာမို့ — `increment` ပြောင်းလဲမှုတိုင်းက Effect ကို re-synchronize စေပြီး — interval ကို ရှင်းလင်းစေပါတယ်။ Interval က fire ဖြစ်ဖို့ အခွင့်အရေး မရခင်မှာ — အကြိမ်တိုင်း ရှင်းလင်းနေရင် — timer က ရပ်တန့်သွားသလို ပေါ်နေပါလိမ့်မယ်။

ပြဿနာကို ဖြေရှင်းဖို့ — Effect ကနေ `onTick` Effect Event တစ်ခုကို ထုတ်ယူပါ:

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
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
```css
button { margin: 10px; }
```

`onTick` က Effect Event တစ်ခုဖြစ်တာမို့ — အဲဒါရဲ့ အတွင်းက code က reactive မဟုတ်ပါဘူး။ `increment` ရဲ့ အပြောင်းအလဲက Effects တစ်ခုခုကို မစတင်စေပါဘူး။

### ချိန်ညှိလို့မရတဲ့ Delay တစ်ခုကို ပြုပြင်ခြင်း

ဒီဥပမာမှာ — interval delay ကို customize လုပ်နိုင်ပါတယ်။ အဲဒါကို button နှစ်ခုနဲ့ update လုပ်တဲ့ `delay` state variable ထဲမှာ သိမ်းထားပါတယ်။ ဒါပေမယ့် — `delay` က 1000 milliseconds (တစ်စက္ကန့်) ဖြစ်တဲ့အထိ "plus 100 ms" button ကို နှိပ်ထားရင်တောင် — timer က အရမ်းမြန်မြန် (100 ms တိုင်း) တိုးနေတုန်းပဲ သတိပြုမိပါလိမ့်မယ်။ သင့် `delay` ပြောင်းလဲမှုတွေကို လျစ်လျူရှုခံနေရသလိုပါပဲ။ Bug ကို ရှာပြီး ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** Effect Events တွေရဲ့ အတွင်းက Code က reactive မဟုတ်ပါဘူး။ `setInterval` ခေါ်မှုကို ပြန် run စေချင်မယ့် အခြေအနေတွေ ရှိလား?

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```
```css
button { margin: 10px; }
```

#### အဖြေ

အထက်က ဥပမာရဲ့ ပြဿနာက — code က တကယ် ဘာလုပ်သင့်လဲဆိုတာကို စဉ်းစားမထားဘဲ — `onMount` လို့ ခေါ်တဲ့ Effect Event တစ်ခုကို ထုတ်ယူထားလို့ပါ။ Effect Events တွေကို တိကျတဲ့ အကြောင်းပြချက်တစ်ခုအတွက်ပဲ ထုတ်ယူသင့်ပါတယ်: သင့် code ရဲ့ အပိုင်းတစ်ပိုင်းကို non-reactive ဖြစ်စေချင်တဲ့အခါမျိုးမှာပါ။ ဒါပေမယ့် — `setInterval` ခေါ်မှုက `delay` state variable နဲ့ ပတ်သက်ပြီး reactive *ဖြစ်သင့်* ပါတယ်။ `delay` ပြောင်းရင် — interval ကို အစကနေ ပြန်တည်ဆောက်စေချင်ပါတယ်! ဒီ code ကို ပြုပြင်ဖို့ — reactive code အားလုံးကို Effect ရဲ့ အတွင်းဘက်ကို ပြန်ဆွဲထည့်ပါ:

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```
```css
button { margin: 10px; }
```

ယေဘုယျအားဖြင့် — code တစ်ပိုင်းရဲ့ *ရည်ရွယ်ချက်* (purpose) ထက် — *အချိန်ကိုက်* (timing) ကိုပဲ အာရုံစိုက်တဲ့ — `onMount` လိုမျိုး function တွေကို သံသယဖြစ်သင့်ပါတယ်။ အစပိုင်းမှာ "ပိုဖော်ပြချက်ကောင်းတယ်" လို့ ခံစားရနိုင်ပေမယ့် — သင့်ရည်ရွယ်ချက်ကို မှုန်ဝါးစေပါတယ်။ အကြမ်းဖျင်း စည်းမျဉ်းတစ်ခုအနေနဲ့ — Effect Events တွေက *အသုံးပြုသူရဲ့* ရှုထောင့်ကနေ ဖြစ်ပျက်တဲ့အရာတစ်ခုနဲ့ ကိုက်ညီသင့်ပါတယ်။ ဥပမာ — `onMessage`၊ `onTick`၊ `onVisit` ဒါမှမဟုတ် `onConnected` တွေက ကောင်းတဲ့ Effect Event နာမည်တွေပါ။ သူတို့ရဲ့ အတွင်းက code တွေက reactive ဖြစ်ဖို့ မလိုနိုင်ပါဘူး။ တစ်ဖက်မှာ — `onMount`၊ `onUpdate`၊ `onUnmount` ဒါမှမဟုတ် `onAfterRender` တွေက အရမ်း generic ဖြစ်လို့ — *reactive ဖြစ်သင့်တဲ့* code တွေကို မတော်တဆ ထည့်မိလွယ်ပါတယ်။ ဒါကြောင့် — သင့် Effect Events တွေကို code တစ်ချို့ ပြေးဖို့ အချိန်ရောက်လို့ဆိုတာထက် — *အသုံးပြုသူက ဘာဖြစ်သွားပြီလို့ ထင်လဲ* ဆိုတာအလိုက် နာမည်ပေးသင့်ပါတယ်။

### နှောင့်နှေးနေတဲ့ Notification တစ်ခုကို ပြုပြင်ခြင်း

သင်က chat room တစ်ခုဆီ ဝင်ရောက်တဲ့အခါ — ဒီ component က notification တစ်ခု ပြပါတယ်။ ဒါပေမယ့် — notification က ချက်ချင်း မပြတာပါ။ အဲဒီအစား — notification ကို နှစ်စက္ကန့် အတုပြုလုပ်ထားတဲ့ (artificially) နှောင့်နှေးမှုတစ်ခုနဲ့ ပြပေးတာမို့ — အသုံးပြုသူက UI ကို လှည့်ပတ်ကြည့်ဖို့ အခွင့်အရေး ရှိပါတယ်။

ဒါက နီးပါး အလုပ်လုပ်ပေမယ့် — bug တစ်ခု ရှိပါတယ်။ Dropdown ကို "general" ကနေ "travel" — ပြီးတော့ "music" ကို အရမ်းမြန်မြန် ပြောင်းကြည့်ပါ။ လုံလောက်အောင် မြန်မြန် လုပ်ရင် — notification နှစ်ခု (မျှော်လင့်ထားသလိုပဲ!) မြင်ရပေမယ့် — နှစ်ခုလုံးက "Welcome to music" လို့ *ပြနေပါလိမ့်မယ်*။

"general" ကနေ "travel" — ပြီးတော့ "music" ကို အရမ်းမြန်မြန် ပြောင်းတဲ့အခါ — notification နှစ်ခု မြင်ရပြီး — ပထမတစ်ခုက "Welcome to travel" — ဒုတိယတစ်ခုက "Welcome to music" ဖြစ်အောင် ပြုပြင်ပါ။ (နောက်ထပ် စိန်ခေါ်မှုအနေနဲ့ — notifications တွေက မှန်ကန်တဲ့ rooms တွေကို ပြနေတယ်လို့ *ယူဆထားပြီး* — နောက်ဆုံး notification ကိုပဲ ပြသစေဖို့ — code ကို ပြောင်းပါ။)

> **အရိပ်အမြွက်:** သင့် Effect က သူဘယ် room ဆီ ချိတ်ဆက်ခဲ့လဲဆိုတာ သိပါတယ်။ သင့် Effect Event ဆီ ပို့ချင်စရာ အချက်အလက်တစ်ခုခု ရှိလား?

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
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```
```js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
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
label { display: block; margin-top: 10px; }
```

#### အဖြေ

သင့် Effect Event ရဲ့ အတွင်းမှာ — `roomId` က *Effect Event ကို ခေါ်လိုက်တဲ့ အချိန်မှာ* ရှိနေတဲ့ တန်ဖိုးပါ။

သင့် Effect Event ကို နှစ်စက္ကန့် နှောင့်နှေးမှုနဲ့ ခေါ်ပါတယ်။ သင်က travel ကနေ music room ဆီ မြန်မြန် ပြောင်းနေရင် — travel room ရဲ့ notification ပြတဲ့အချိန်မှာတော့ — `roomId` က `"music"` ဖြစ်နေပါပြီ။ ဒါကြောင့် — notification နှစ်ခုလုံးက "Welcome to music" လို့ ပြောနေတာပါ။

ပြဿနာကို ပြုပြင်ဖို့ — Effect Event ရဲ့ အတွင်းမှာ *နောက်ဆုံး* `roomId` ကို ဖတ်မယ့်အစား — အောက်က `connectedRoomId` လိုမျိုး — သင့် Effect Event ရဲ့ parameter တစ်ခု ဖြစ်အောင် လုပ်ပါ။ ပြီးရင် — `onConnected(roomId)` ကို ခေါ်ခြင်းဖြင့် — သင့် Effect ကနေ `roomId` ကို ပို့ပေးပါ:

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
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```
```js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
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
label { display: block; margin-top: 10px; }
```

`roomId` က `"travel"` လို့ set ထားတဲ့ Effect (ဒါကြောင့် `"travel"` room ဆီ ချိတ်ဆက်ထားတဲ့) က `"travel"` အတွက် notification ကို ပြပါလိမ့်မယ်။ `roomId` က `"music"` လို့ set ထားတဲ့ Effect (ဒါကြောင့် `"music"` room ဆီ ချိတ်ဆက်ထားတဲ့) က `"music"` အတွက် notification ကို ပြပါလိမ့်မယ်။ တစ်နည်းပြောရရင် — `connectedRoomId` က သင့် Effect (reactive ဖြစ်တဲ့) ကနေ လာပြီး — `theme` က နောက်ဆုံးတန်ဖိုးကိုပဲ အမြဲတမ်း သုံးပါတယ်။

နောက်ထပ် စိန်ခေါ်မှုကို ဖြေရှင်းဖို့ — notification timeout ID ကို သိမ်းပြီး — သင့် Effect ရဲ့ cleanup function ထဲမှာ ရှင်းလင်းပါ:

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
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```
```js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
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
label { display: block; margin-top: 10px; }
```

ဒါက — room တစ်ခု ပြောင်းတဲ့အခါ — စီစဉ်ပြီးသား (ဒါပေမယ့် မပြရသေးတဲ့) notifications တွေကို ပယ်ဖျက်ကြောင်း သေချာစေပါတယ်။
