---
title: "Escape Hatches (လွတ်မြောက်ရေး ပေါက်ပေါက်များ)"
description: "React ရဲ့ အပြင်ဘက် system တွေနဲ့ ချိတ်ဆက်ဖို့ escape hatches — refs နဲ့ value ကိုးကားခြင်း၊ DOM ကို ပြုပြင်ခြင်း၊ Effects နဲ့ ထပ်တူပြုခြင်း၊ Effect မလိုအပ်တဲ့နေရာတွေ၊ reactive effects သက်တမ်း၊ events/effects ခွဲခြားခြင်း၊ dependencies ဖယ်ရှားခြင်း၊ custom Hooks နဲ့ logic မျှဝေခြင်း"
order: 30
source: "https://react.dev/learn/escape-hatches"
status: translated
updated: 2026-09-01
---

သင့် component တချို့က React ရဲ့ အပြင်ဘက်က system တွေကို ထိန်းချုပ်ပြီး — သူတို့နဲ့ ထပ်တူပြုဖို့ လိုအပ်ပါတယ်။ ဥပမာ — browser API သုံးပြီး input တစ်ခုကို focus လုပ်ချင်တာ၊ React နဲ့ မရေးထားတဲ့ video player တစ်ခုကို play/pause လုပ်ချင်တာ၊ ဒါမှမဟုတ် remote server တစ်ခုဆီ ချိတ်ဆက်ပြီး — message တွေ နားထောင်ချင်တာမျိုးပေါ့။ ဒီ chapter မှာ — React ရဲ့ "အပြင်ကို ထွက်" ပြီး external systems တွေနဲ့ ချိတ်ဆက်နိုင်စေတဲ့ escape hatches တွေကို သင်ယူရမှာ ဖြစ်ပါတယ်။ သင့် application ရဲ့ logic နဲ့ data flow အများစုက ဒီ features တွေကို အားမကိုးသင့်ပါဘူး။

## သင်ယူရမည့်အကြောင်းအရာများ

- [Refs နဲ့ Value များကို ကိုးကားခြင်း](/docs/react/referencing-values-with-refs) — re-render မလုပ်ဘဲ အချက်အလက်တွေကို ဘယ်လို "မှတ်မိ" မလဲ
- [Refs နဲ့ DOM ကို ပြုလုပ်ခြင်း](/docs/react/manipulating-the-dom-with-refs) — React က စီမံတဲ့ DOM elements တွေကို ဘယ်လို သုံးမလဲ
- [Effects နဲ့ ထပ်တူပြုခြင်း](/docs/react/synchronizing-with-effects) — component တွေကို external systems တွေနဲ့ ဘယ်လို ထပ်တူပြုမလဲ
- [Effect တစ်ခု မလိုအပ်နိုင်ပါ (You Might Not Need an Effect)](/docs/react/you-might-not-need-an-effect) — သင့် component တွေကနေ မလိုအပ်တဲ့ Effects တွေကို ဘယ်လို ဖယ်ရှားမလဲ
- [Reactive Effects တွေရဲ့ သက်တမ်းစက်ဝိုင်း](/docs/react/lifecycle-of-reactive-effects) — Effect တစ်ခုရဲ့ သက်တမ်းက component တစ်ခုရဲ့သက်တမ်းနဲ့ ဘယ်လို ကွာခြားလဲ
- [Events တွေကို Effects တွေကနေ ခွဲခြားခြင်း](/docs/react/separating-events-from-effects) — တန်ဖိုးတချို့က Effects တွေကို ပြန်လည် trigger မလုပ်စေအောင် ဘယ်လို တားဆီးမလဲ
- [Effect Dependencies တွေကို ဖယ်ရှားခြင်း](/docs/react/removing-effect-dependencies) — သင့် Effect ကို မကြာခဏ ပြန် run လုပ်တာ နည်းအောင် ဘယ်လို လုပ်မလဲ
- [Custom Hooks တွေနဲ့ Logic ပြန်လည်အသုံးပြုခြင်း](/docs/react/reusing-logic-with-custom-hooks) — component တွေကြားမှာ logic တွေကို ဘယ်လို မျှဝေမလဲ

## Refs နဲ့ Value များကို ကိုးကားခြင်း

Component တစ်ခုက အချက်အလက်တချို့ကို "မှတ်မိ" စေချင်ပေမယ့် — အဲဒီအချက်အလက်က [render အသစ်တွေကို trigger မလုပ်စေချင်ဘူး](/docs/react/render-and-commit)ဆိုရင် — *ref* တစ်ခုကို သုံးနိုင်ပါတယ်:

```js
const ref = useRef(0);
```

State လိုပဲ — refs တွေကို re-renders တွေကြားမှာ React က ထိန်းသိမ်းပေးပါတယ်။ ဒါပေမယ့် — state ကို set လုပ်တာက component ကို re-render လုပ်စေပြီး — ref ကို ပြောင်းတာကတော့ မလုပ်စေပါဘူး! Ref ရဲ့ လက်ရှိ တန်ဖိုးကို `ref.current` property ကနေ ဝင်ရောက်နိုင်ပါတယ်:

```jsx
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

Ref က သင့် component ရဲ့ — React က ခြေရာမခံတဲ့ — လျှို့ဝှက် အိတ်ကပ်လေးတစ်ခုလိုပါပဲ။ ဥပမာ — [timeout IDs](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value)၊ [DOM elements](https://developer.mozilla.org/en-US/docs/Web/API/Element) နဲ့ — component ရဲ့ rendering output ကို မထိခိုက်စေတဲ့ တခြား object တွေကို သိမ်းဖို့ refs တွေကို သုံးနိုင်ပါတယ်။

အချက်အလက်တွေကို မှတ်မိဖို့ refs တွေ ဘယ်လို သုံးမလဲ — [Refs နဲ့ Value များကို ကိုးကားခြင်း](/docs/react/referencing-values-with-refs) မှာ ဆက်လေ့လာပါ။

## Refs နဲ့ DOM ကို ပြုလုပ်ခြင်း

React က သင့် render output နဲ့ ကိုက်ညီအောင် DOM ကို အလိုအလျောက် update လုပ်တာမို့ — သင့် component တွေက DOM ကို ကိုယ်တိုင် ပြုပြင်စရာ မလိုတော့ပါဘူး။ ဒါပေမယ့် — တစ်ခါတစ်ရံ — React က စီမံတဲ့ DOM elements တွေကို ဝင်ရောက်ဖို့ လိုနိုင်ပါတယ် — ဥပမာ — node တစ်ခုကို focus လုပ်ဖို့၊ အဲဒီဆီ scroll လုပ်ဖို့၊ ဒါမှမဟုတ် သူ့ရဲ့ အရွယ်အစားနဲ့ နေရာကို တိုင်းတာဖို့ပေါ့။ React မှာ ဒီအရာတွေ လုပ်ဖို့ built-in နည်းလမ်း မရှိလို့ — DOM node ဆီ ref တစ်ခု လိုပါလိမ့်မယ်။ ဥပမာ — button ကို နှိပ်လိုက်ရင် ref သုံးပြီး input ကို focus လုပ်တာမျိုးပါ:

```jsx
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

React က စီမံတဲ့ DOM elements တွေကို ဘယ်လို ဝင်ရောက်မလဲ — [Refs နဲ့ DOM ကို ပြုလုပ်ခြင်း](/docs/react/manipulating-the-dom-with-refs) မှာ ဆက်လေ့လာပါ။

## Effects နဲ့ ထပ်တူပြုခြင်း

Component တချို့က external systems တွေနဲ့ ထပ်တူပြုဖို့ လိုပါတယ်။ ဥပမာ — React state ပေါ် အခြေခံပြီး React မဟုတ်တဲ့ component တစ်ခုကို ထိန်းချုပ်ချင်တာ၊ server connection တစ်ခု တည်ဆောက်ချင်တာ၊ ဒါမှမဟုတ် component တစ်ခု screen ပေါ် ပေါ်လာတဲ့အခါ analytics log တစ်ခု ပို့ချင်တာမျိုးပါ။ တိကျတဲ့ events တွေကို ကိုင်တွယ်ခွင့် ပေးတဲ့ event handlers တွေနဲ့ မတူဘဲ — *Effects* တွေက rendering ပြီးတဲ့နောက်မှာ code တချို့ run လုပ်ခွင့် ပေးပါတယ်။ React ရဲ့ အပြင်ဘက်က system တစ်ခုခုနဲ့ သင့် component ကို ထပ်တူပြုဖို့ သုံးပါတယ်။

Play/Pause ကို နှစ်ခါလောက် နှိပ်ပြီး — video player က `isPlaying` prop တန်ဖိုးနဲ့ ထပ်တူဖြစ်နေတာ ကြည့်ပါ:

```jsx
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

Effects အများစုက သူတို့ နောက်ကိုလည်း "cleanup" လုပ်ပါတယ်။ ဥပမာ — chat server တစ်ခုဆီ connection တစ်ခု တည်ဆောက်တဲ့ Effect တစ်ခုက — သင့် component ကို အဲဒီ server ကနေ ဘယ်လို ချိတ်ဆက်ဖြုတ်ရမယ်ဆိုတာ React ကို ပြောတဲ့ *cleanup function* တစ်ခုကို ပြန်ပေးသင့်ပါတယ်:

```jsx
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

Development မှာ — React က သင့် Effect ကို cleanup နဲ့အတူ နောက်ထပ် တစ်ကြိမ် ချက်ချင်း run လုပ်ပါလိမ့်မယ်။ ဒါကြောင့် `"✅ Connecting..."` ကို နှစ်ကြိမ် ပုံနှိပ်တာ မြင်ရတာပါ။ ဒါက cleanup function ကို implement လုပ်ဖို့ မမေ့အောင် သေချာစေပါတယ်။

Component တွေကို external systems တွေနဲ့ ဘယ်လို ထပ်တူပြုမလဲ — [Effects နဲ့ ထပ်တူပြုခြင်း](/docs/react/synchronizing-with-effects) မှာ ဆက်လေ့လာပါ။

## Effect တစ်ခု မလိုအပ်နိုင်ပါ (You Might Not Need an Effect)

Effects တွေက React paradigm ကနေ လွတ်မြောက်ဖို့ escape hatch တစ်ခုပါ။ React ရဲ့ "အပြင်ကို ထွက်" ပြီး — သင့် component တွေကို external system တစ်ခုခုနဲ့ ထပ်တူပြုဖို့ သူတို့ကို သုံးပါတယ်။ External system တစ်ခုခု ပါဝင်မနေဘူးဆိုရင် (ဥပမာ — props ဒါမှမဟုတ် state တချို့ ပြောင်းတဲ့အခါ component ရဲ့ state ကို update လုပ်ချင်ရုံပဲဆိုရင်) — Effect တစ်ခု မလိုသင့်ပါဘူး။ မလိုအပ်တဲ့ Effects တွေကို ဖယ်ရှားခြင်းက — သင့် code ကို နားလည်ရလွယ်စေ၊ ပိုမြန်စေပြီး — အမှားဖြစ်နိုင်ခြေ နည်းစေပါတယ်။

Effect မလိုတဲ့ အဖြစ်များတဲ့ ကိစ္စနှစ်ခု ရှိပါတယ်:

- **Rendering အတွက် data ကို transform လုပ်ဖို့ Effects တွေ မလိုပါဘူး။**
- **User events တွေကို ကိုင်တွယ်ဖို့ Effects တွေ မလိုပါဘူး။**

ဥပမာ — state တစ်ခုကို တခြား state ပေါ် အခြေခံပြီး ချိန်ညှိဖို့ Effect တစ်ခု မလိုပါဘူး:

```js
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect → ရှောင်ပါ: redundant state နဲ့ မလိုအပ်တဲ့ Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

အဲဒီအစား — rendering လုပ်နေတုန်း တတ်နိုင်သမျှ တွက်ချက်ပါ:

```js
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering → ကောင်းပါတယ်: rendering အတွင်း တွက်ချက်ထားတာ
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

ဒါပေမယ့် — external systems တွေနဲ့ ထပ်တူပြုဖို့ကတော့ — Effects တွေ *လို* ပါတယ်။

မလိုအပ်တဲ့ Effects တွေကို ဘယ်လို ဖယ်ရှားမလဲ — [Effect တစ်ခု မလိုအပ်နိုင်ပါ](/docs/react/you-might-not-need-an-effect) မှာ ဆက်လေ့လာပါ။

## Reactive Effects တွေရဲ့ သက်တမ်းစက်ဝိုင်း

Effects တွေမှာ — component တွေနဲ့ မတူတဲ့ သက်တမ်းစက်ဝိုင်း တစ်ခု ရှိပါတယ်။ Component တွေက mount ဖြစ်နိုင်၊ update ဖြစ်နိုင်၊ unmount ဖြစ်နိုင်ပါတယ်။ Effect တစ်ခုက အရာနှစ်ခုပဲ လုပ်နိုင်ပါတယ် — တစ်ခုခုကို ထပ်တူပြုဖို့ စတင်တာ၊ ပြီးတော့ အဲဒါကို ရပ်တန့်ဖို့ပါ။ သင့် Effect က အချိန်နဲ့အမျှ ပြောင်းလဲတဲ့ props နဲ့ state တွေပေါ် မှီခိုနေရင် — ဒီစက်ဝိုင်းက အကြိမ်များစွာ ဖြစ်နိုင်ပါတယ်။

ဒီ Effect က `roomId` prop ရဲ့ တန်ဖိုးပေါ် မှီခိုနေပါတယ်။ Props တွေက *reactive values* တွေပါ — ဆိုလိုတာက — re-render တစ်ခုမှာ သူတို့ ပြောင်းလဲနိုင်ပါတယ်။ `roomId` ပြောင်းရင် — Effect က *re-synchronize* (ပြီးတော့ server ဆီ ပြန်ချိတ်ဆက်) လုပ်တာ သတိပြုပါ:

```jsx
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

React က သင့် Effect ရဲ့ dependencies တွေကို မှန်ကန်စွာ သတ်မှတ်ထားကြောင်း စစ်ဆေးဖို့ linter rule တစ်ခု ထောက်ပံ့ပေးပါတယ်။ အထက်က ဥပမာမှာ dependencies စာရင်းထဲက `roomId` ကို မေ့ထားခဲ့ရင် — linter က အဲဒီ bug ကို အလိုအလျောက် ရှာတွေ့ပါလိမ့်မယ်။

Effect တစ်ခုရဲ့ သက်တမ်းက component တစ်ခုရဲ့ သက်တမ်းနဲ့ ဘယ်လို ကွာခြားလဲ — [Reactive Effects တွေရဲ့ သက်တမ်းစက်ဝိုင်း](/docs/react/lifecycle-of-reactive-effects) မှာ ဆက်လေ့လာပါ။

## Events တွေကို Effects တွေကနေ ခွဲခြားခြင်း

Event handlers တွေက — တူညီတဲ့ interaction ကို ထပ်လုပ်မှပဲ ပြန် run ပါတယ်။ Event handlers တွေနဲ့ မတူဘဲ — Effects တွေက သူတို့ ဖတ်တဲ့ တန်ဖိုးတွေ (props ဒါမှမဟုတ် state လိုမျိုး) — နောက်ဆုံး render တုန်းကနဲ့ မတူရင် — re-synchronize လုပ်ပါတယ်။ တစ်ခါတစ်ရံ — အပြုအမူ နှစ်မျိုးလုံးရဲ့ ရောစပ်မှုတစ်ခု လိုချင်ပါတယ်: တန်ဖိုးတချို့ကို တုံ့ပြန်ပြီး re-run လုပ်ပေမယ့် — တချို့ကိုတော့ မလုပ်တဲ့ Effect တစ်ခုမျိုးပါ။

Effect တွေထဲက code အားလုံးက *reactive* ဖြစ်ပါတယ် — သူ ဖတ်တဲ့ reactive value တစ်ခုခု re-render ကြောင့် ပြောင်းသွားရင် — ပြန် run ပါလိမ့်မယ်။ ဥပမာ — `roomId` ဒါမှမဟုတ် `theme` တစ်ခုခု ပြောင်းရင် — ဒီ Effect က chat ဆီ ပြန်ချိတ်ဆက်ပါလိမ့်မယ်။ ဒါက အကောင်းဆုံး မဟုတ်ပါဘူး — `roomId` ပဲ ပြောင်းတဲ့အခါမှသာ chat ဆီ ပြန်ချိတ်ဆက်စေချင်တယ်ဆိုရင် — `theme` ကို ဖတ်တဲ့ code ကို Effect ကနေ *Effect Event* တစ်ခုထဲ ရွှေ့နိုင်ပါတယ်။ Effect Events ထဲက code က reactive မဟုတ်တာမို့ — `theme` ပြောင်းတာက သင့် Effect ကို ပြန်ချိတ်ဆက်စေတော့မှာ မဟုတ်ပါဘူး။

တန်ဖိုးတချို့က Effects တွေကို ပြန်လည် trigger မလုပ်စေအောင် ဘယ်လို တားဆီးမလဲ — [Events တွေကို Effects တွေကနေ ခွဲခြားခြင်း](/docs/react/separating-events-from-effects) မှာ ဆက်လေ့လာပါ။

## Effect Dependencies တွေကို ဖယ်ရှားခြင်း

Effect တစ်ခု ရေးတဲ့အခါ — linter က Effect ဖတ်တဲ့ reactive value တိုင်း (props နဲ့ state လိုမျိုး) — သင့် Effect ရဲ့ dependencies စာရင်းထဲမှာ ပါဝင်ကြောင်း စစ်ဆေးပါလိမ့်မယ်။ ဒါက သင့် Effect က သင့် component ရဲ့ နောက်ဆုံး props နဲ့ state တွေနဲ့ ထပ်တူကျနေကြောင်း သေချာစေပါတယ်။ မလိုအပ်တဲ့ dependencies တွေက သင့် Effect ကို မကြာခဏ run လွန်းစေနိုင်သလို — infinite loop တစ်ခုတောင် ဖန်တီးစေနိုင်ပါတယ်။ သူတို့ကို ဖယ်ရှားတဲ့ နည်းလမ်းက ကိစ္စအလိုက် မူတည်ပါတယ်။

ဥပမာ — ဒီ Effect က — input ကို တည်းဖြတ်တိုင်း ပြန်ဖန်တီးခံရတဲ့ `options` object ပေါ်မှာ မှီခိုနေပါတယ်:

```jsx
const options = {
  serverUrl: serverUrl,
  roomId: roomId
};

useEffect(() => {
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, [options]);
```

`options` object ဖန်တီးမှုကို Effect ရဲ့ အတွင်းကို ရွှေ့ခြင်းဖြင့် — Effect က `roomId` string ပေါ်မှာပဲ မှီခိုအောင် လုပ်နိုင်ပါတယ်။ Dependency list ကို ဖျက်ဖို့ စတင် တည်းဖြတ်တာ မဟုတ်ဘဲ — dependency ကို *မလိုအပ်အောင်* ပြုလုပ်ဖို့ — ပတ်ဝန်းကျင် code ကို ပြောင်းလဲရတာကို သတိပြုပါ။ Dependency list ကို သင့် Effect ရဲ့ code သုံးတဲ့ reactive values တွေရဲ့ စာရင်းတစ်ခုလို တွေးပါ — list က သင့် code ကို ဖော်ပြတာပါ။ Dependency list ကို ပြောင်းဖို့ — code ကို ပြောင်းပါ။

သင့် Effect ကို မကြာခဏ ပြန် run လုပ်တာ နည်းအောင် ဘယ်လို လုပ်မလဲ — [Effect Dependencies တွေကို ဖယ်ရှားခြင်း](/docs/react/removing-effect-dependencies) မှာ ဆက်လေ့လာပါ။

## Custom Hooks တွေနဲ့ Logic ပြန်လည်အသုံးပြုခြင်း

React မှာ `useState`၊ `useContext` နဲ့ `useEffect` လိုမျိုး built-in Hooks တွေ ပါဝင်ပါတယ်။ တစ်ခါတစ်ရံ — data fetch လုပ်ဖို့၊ user online ဖြစ်မဖြစ် ခြေရာခံဖို့၊ ဒါမှမဟုတ် chat room တစ်ခုဆီ ချိတ်ဆက်ဖို့လိုမျိုး — ပိုတိကျတဲ့ ရည်ရွယ်ချက်အတွက် Hook တစ်ခု ရှိစေချင်တာမျိုး ရှိပါလိမ့်မယ်။ အဲဒါလုပ်ဖို့ — သင့် application ရဲ့ လိုအပ်ချက်တွေအတွက် ကိုယ်ပိုင် Hooks တွေ ဖန်တီးနိုင်ပါတယ်။

ဥပမာ — ဒီ `useOnlineStatus` custom Hook က network online ဖြစ်မဖြစ်ကို ခြေရာခံပြီး — `useDelayedValue` custom Hook က သင်ပေးလိုက်တဲ့ တန်ဖိုးထက် milliseconds အနည်းငယ် "နောက်ကျနေတဲ့" တန်ဖိုးတစ်ခုကို ပြန်ပေးပါတယ်:

```js
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

Custom Hooks တွေ ဖန်တီးနိုင်၊ ပေါင်းစပ်နိုင်၊ သူတို့ကြားမှာ data ပို့နိုင်ပြီး — component တွေကြားမှာ ပြန်သုံးနိုင်ပါတယ်။ သင့် app ကြီးလာတာနဲ့အမျှ — ကိုယ်တိုင် ရေးထားပြီးသား custom Hooks တွေကို ပြန်သုံးနိုင်လို့ — Effects တွေကို လက်နဲ့ ရေးရတာ နည်းလာပါလိမ့်မယ်။ React community က ထိန်းသိမ်းထားတဲ့ ကောင်းမွန်တဲ့ custom Hooks တွေလည်း အများကြီး ရှိပါတယ်။

Component တွေကြားမှာ logic တွေကို ဘယ်လို မျှဝေမလဲ — [Custom Hooks တွေနဲ့ Logic ပြန်လည်အသုံးပြုခြင်း](/docs/react/reusing-logic-with-custom-hooks) မှာ ဆက်လေ့လာပါ။

## နောက်တစ်ဆင့်တွေ

- [Refs နဲ့ Value များကို ကိုးကားခြင်း](/docs/react/referencing-values-with-refs) ကနေ စပြီး — ဒီ chapter ကို page တစ်ခုချင်းစီ ဖတ်သွားနိုင်ပါတယ်။
