---
title: "Reactive Effects တွေရဲ့ သက်တမ်းစက်ဝိုင်း (Lifecycle of Reactive Effects)"
description: "Effect တစ်ခုရဲ့ သက်တမ်းစက်ဝိုင်းက component ရဲ့ သက်တမ်းစက်ဝိုင်းနဲ့ ဘယ်လို ကွာခြားလဲ — Effect တစ်ခုချင်းစီကို သီးခြား စဉ်းစားနည်း၊ re-synchronize လုပ်ချိန်၊ reactive values ဆိုတာ ဘာလဲ၊ ဗလာ dependency array ရဲ့ အဓိပ္ပာယ်နဲ့ linter က dependencies မှန်ကန်ကြောင်း စစ်ဆေးပုံ"
order: 17
source: "https://react.dev/learn/lifecycle-of-reactive-effects"
status: translated
updated: 2026-09-01
---

Effects တွေမှာ components တွေနဲ့ မတူတဲ့ သက်တမ်းစက်ဝိုင်း (lifecycle) တစ်ခု ရှိပါတယ်။ Components တွေက mount ဖြစ်နိုင်၊ update ဖြစ်နိုင်၊ ဒါမှမဟုတ် unmount ဖြစ်နိုင်ပါတယ်။ Effect တစ်ခုကတော့ အရာနှစ်ခုပဲ လုပ်နိုင်ပါတယ်: တစ်ခုခုကို ထပ်တူပြုခြင်း စတင်ဖို့ — ပြီးတော့ နောက်ပိုင်းမှာ ထပ်တူပြုခြင်းကို ရပ်တန့်ဖို့ပါ။ သင့် Effect က အချိန်နဲ့အမျှ ပြောင်းလဲနေတဲ့ props နဲ့ state တွေပေါ်မှာ မှီခိုနေရင် — ဒီစက်ဝိုင်းက အကြိမ်များစွာ ဖြစ်နိုင်ပါတယ်။ React က သင့် Effect ရဲ့ dependencies တွေကို မှန်ကန်စွာ သတ်မှတ်ထားကြောင်း စစ်ဆေးပေးဖို့ linter rule တစ်ခု ပေးထားပါတယ်။ ဒါက သင့် Effect ကို နောက်ဆုံး props နဲ့ state တွေနဲ့ ထပ်တူကျနေစေပါတယ်။

## သင်ယူရမည့်အကြောင်းအရာများ

- Effect တစ်ခုရဲ့ သက်တမ်းစက်ဝိုင်းက component တစ်ခုရဲ့ သက်တမ်းစက်ဝိုင်းနဲ့ ဘယ်လို ကွာခြားလဲ
- Effect တစ်ခုချင်းစီကို သီးခြားစီ ဘယ်လို စဉ်းစားမလဲ
- သင့် Effect က ဘယ်အချိန် re-synchronize လုပ်ဖို့ လိုလဲ — ပြီးတော့ ဘာကြောင့်လဲ
- သင့် Effect ရဲ့ dependencies တွေကို ဘယ်လို ဆုံးဖြတ်လဲ
- တန်ဖိုးတစ်ခု reactive ဖြစ်တယ်ဆိုတာ ဘာကို ဆိုလိုလဲ
- ဗလာ dependency array က ဘာကို ဆိုလိုလဲ
- React က linter တစ်ခုနဲ့ သင့် dependencies တွေ မှန်ကန်ကြောင်း ဘယ်လို စစ်ဆေးလဲ
- Linter နဲ့ သဘောမတူတဲ့အခါ ဘာလုပ်ရမလဲ

## Effect တစ်ခုရဲ့ သက်တမ်းစက်ဝိုင်း

React component တိုင်းက သက်တမ်းစက်ဝိုင်း တစ်ခုတည်းကို ဖြတ်သန်းပါတယ်:

- Component တစ်ခုက screen ဆီ ထည့်ခံရတဲ့အခါ _mounts_ ဖြစ်ပါတယ်။
- Component တစ်ခုက props ဒါမှမဟုတ် state အသစ်တွေ လက်ခံရရှိတဲ့အခါ — ပုံမှန်အားဖြင့် interaction တစ်ခုကို တုံ့ပြန်တဲ့အနေနဲ့ — _updates_ ဖြစ်ပါတယ်။
- Component တစ်ခုက screen ကနေ ဖယ်ရှားခံရတဲ့အခါ _unmounts_ ဖြစ်ပါတယ်။

**ဒါက components တွေကို စဉ်းစားဖို့ ကောင်းတဲ့ နည်းလမ်းတစ်ခုပါ — ဒါပေမယ့် Effects တွေအတွက်တော့ *မဟုတ်ပါဘူး*။** အဲဒီအစား — Effect တစ်ခုချင်းစီကို သင့် component ရဲ့ သက်တမ်းစက်ဝိုင်းကနေ သီးခြားစီ စဉ်းစားကြည့်ပါ။ Effect တစ်ခုက [external system တစ်ခုကို](/docs/react/synchronizing-with-effects) လက်ရှိ props နဲ့ state တွေနဲ့ ဘယ်လို ထပ်တူပြုရမယ်ဆိုတာကို ဖော်ပြပါတယ်။ သင့် code ပြောင်းလဲတာနဲ့အမျှ — ထပ်တူပြုခြင်းက ပိုများ/ပိုနည်း ဖြစ်ဖို့ လိုပါလိမ့်မယ်။

ဒီအချက်ကို သရုပ်ဖော်ဖို့ — သင့် component ကို chat server တစ်ခုဆီ ချိတ်ဆက်ပေးတဲ့ ဒီ Effect ကို စဉ်းစားကြည့်ပါ:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

သင့် Effect ရဲ့ body က **ထပ်တူပြုခြင်းကို စတင်နည်း** ကို သတ်မှတ်ပါတယ်:

```js
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

သင့် Effect က ပြန်ပေးတဲ့ cleanup function က **ထပ်တူပြုခြင်းကို ရပ်တန့်နည်း** ကို သတ်မှတ်ပါတယ်:

```js
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

အလိုလိုသိနိုင်တဲ့အတိုင်း — React က သင့် component **mount** ဖြစ်တဲ့အခါ **ထပ်တူပြုခြင်းကို စတင်** ပြီး — သင့် component **unmount** ဖြစ်တဲ့အခါ **ထပ်တူပြုခြင်းကို ရပ်** လိမ့်မယ်လို့ သင်ထင်နိုင်ပါတယ်။ ဒါပေမယ့် — ဒါက ဇာတ်လမ်းရဲ့ အဆုံး မဟုတ်ပါဘူး! တခါတရံ — component က mount ဖြစ်နေတုန်းမှာကို — **ထပ်တူပြုခြင်းကို စတင်ခြင်းနဲ့ ရပ်တန့်ခြင်း အကြိမ်များစွာ** လုပ်ဖို့လည်း လိုအပ်နိုင်ပါတယ်။

ဒါက ဘာကြောင့် လိုအပ်လဲ၊ ဘယ်အချိန် ဖြစ်လဲ၊ ပြီးတော့ ဒီအပြုအမူကို သင်ဘယ်လို ထိန်းချုပ်နိုင်လဲ — ကြည့်ရအောင်။

> **မှတ်ချက်:** Effects တချို့က cleanup function လုံးဝ မပြန်ပါဘူး။ [အများစုမှာတော့](/docs/react/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) — တစ်ခု ပြန်ပေးချင်ပါလိမ့်မယ် — ဒါပေမယ့် — မပေးဘူးဆိုရင်တောင် — React က သင်ဗလာ cleanup function တစ်ခု ပြန်ပေးသလိုပဲ ပြုမူပါလိမ့်မယ်။

### ထပ်တူပြုခြင်းက ဘာကြောင့် တစ်ကြိမ်ထက် ပိုပြီး ဖြစ်ဖို့ လိုနိုင်လဲ

ဒီ `ChatRoom` component က အသုံးပြုသူက dropdown ထဲမှာ ရွေးတဲ့ `roomId` prop တစ်ခုကို လက်ခံရရှိတယ်လို့ စိတ်ကူးကြည့်ပါ။ အစပိုင်းမှာ အသုံးပြုသူက `roomId` အဖြစ် `"general"` room ကို ရွေးတယ်ဆိုပါစို့။ သင့် app က `"general"` chat room ကို ပြပါတယ်:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

UI ကို ပြသပြီးတဲ့နောက်မှာ — React က သင့် Effect ကို run ပြီး **ထပ်တူပြုခြင်းကို စတင်** ပါလိမ့်မယ်။ အဲဒါက `"general"` room ဆီ ချိတ်ဆက်ပါတယ်:

```js
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
  }, [roomId]);
  // ...
```

ဒီထိတော့ အားလုံး အဆင်ပြေပါတယ်။

နောက်ပိုင်းမှာ — အသုံးပြုသူက dropdown ထဲမှာ တခြား room တစ်ခု (ဥပမာ — `"travel"`) ကို ရွေးပါတယ်။ ပထမဆုံး — React က UI ကို update လုပ်ပါလိမ့်မယ်:

```js
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

နောက်တစ်ဆင့် ဘာဖြစ်သင့်လဲ စဉ်းစားကြည့်ပါ။ UI ထဲမှာ `"travel"` က ရွေးထားတဲ့ chat room ဖြစ်တာကို အသုံးပြုသူက မြင်ပါတယ်။ ဒါပေမယ့် — နောက်ဆုံး run ခဲ့တဲ့ Effect က `"general"` room ဆီ ချိတ်ဆက်နေဆဲပါ။ **`roomId` prop က ပြောင်းသွားလို့ — သင်အဲဒီတုန်းက Effect နဲ့ လုပ်ခဲ့တာ (`"general"` room ဆီ ချိတ်ဆက်တာ) က UI နဲ့ မကိုက်ညီတော့ပါဘူး။**

ဒီအချိန်မှာ — သင်က React ကို အရာနှစ်ခု လုပ်စေချင်ပါတယ်:

1. `roomId` အဟောင်းနဲ့ ထပ်တူပြုခြင်းကို ရပ်လိုက်ပါ (`"general"` room ကနေ ချိတ်ဆက်ဖြုတ်ပါ)
2. `roomId` အသစ်နဲ့ ထပ်တူပြုခြင်းကို စတင်လိုက်ပါ (`"travel"` room ဆီ ချိတ်ဆက်ပါ)

**ကံကောင်းချင်တော့ — ဒီနှစ်ခုလုံးကို ဘယ်လို လုပ်ရမလဲဆိုတာ React ကို သင်သင်ပေးပြီးသားပါ!** သင့် Effect ရဲ့ body က ထပ်တူပြုခြင်းကို ဘယ်လို စတင်ရမယ်ဆိုတာ သတ်မှတ်ပြီး — သင့် cleanup function က ဘယ်လို ရပ်တန့်ရမယ်ဆိုတာ သတ်မှတ်ပါတယ်။ React က လုပ်ရမှာက — သူတို့ကို မှန်ကန်တဲ့ အစီအစဉ်နဲ့ — မှန်ကန်တဲ့ props နဲ့ state တွေနဲ့ — ခေါ်ဖို့ပဲ လိုပါတယ်။ အတိအကျ ဘယ်လို ဖြစ်လဲ ကြည့်ရအောင်။

### React က သင့် Effect ကို ဘယ်လို Re-Synchronize လုပ်လဲ

သင့် `ChatRoom` component က သူ့ရဲ့ `roomId` prop အတွက် တန်ဖိုးအသစ်တစ်ခု လက်ခံရရှိခဲ့တာ သတိရပါ။ အရင်က `"general"` ဖြစ်ခဲ့ပြီး — အခု `"travel"` ဖြစ်နေပါတယ်။ React က သင့်ကို မတူတဲ့ room တစ်ခုဆီ ပြန်ချိတ်ဆက်ဖို့ — သင့် Effect ကို re-synchronize လုပ်ဖို့ လိုပါတယ်။

**ထပ်တူပြုခြင်းကို ရပ်တန့်ဖို့** — React က သင့် Effect က `"general"` room ဆီ ချိတ်ဆက်ပြီးနောက်မှာ ပြန်ပေးခဲ့တဲ့ cleanup function ကို ခေါ်ပါလိမ့်မယ်။ `roomId` က `"general"` ဖြစ်ခဲ့တာမို့ — cleanup function က `"general"` room ကနေ ချိတ်ဆက်ဖြုတ်ပါတယ်:

```js
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
    // ...
```

ပြီးရင် React က ဒီ render အတွင်း သင်ပေးထားတဲ့ Effect ကို run ပါလိမ့်မယ်။ ဒီတစ်ခါ — `roomId` က `"travel"` ဖြစ်လို့ — အဲဒါက `"travel"` chat room ဆီ **ထပ်တူပြုခြင်းကို စတင်** ပါလိမ့်မယ် (သူ့ရဲ့ cleanup function ကို နောက်ဆုံးမှာ ခေါ်လိုက်တဲ့အထိပါ):

```js
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "travel" room
    connection.connect();
    // ...
```

ဒါကြောင့် — သင်က အခု UI ထဲမှာ အသုံးပြုသူ ရွေးချယ်ထားတဲ့ room တစ်ခုတည်းဆီ ချိတ်ဆက်နေပါပြီ။ ဘေးဥပဒ် ရှောင်နိုင်ခဲ့ပါပြီ!

သင့် component က `roomId` မတူတာတစ်ခုနဲ့ re-render ဖြစ်ပြီးတိုင်း — သင့် Effect က re-synchronize ဖြစ်ပါလိမ့်မယ်။ ဥပမာ — အသုံးပြုသူက `roomId` ကို `"travel"` ကနေ `"music"` ကို ပြောင်းတယ်ဆိုပါစို့။ React က နောက်တစ်ခါလည်း — သင့် Effect ရဲ့ cleanup function ကို ခေါ်ခြင်းဖြင့် (သင့်ကို `"travel"` room ကနေ ချိတ်ဆက်ဖြုတ်ခြင်းဖြင့်) ထပ်တူပြုခြင်းကို **ရပ်တန့်** ပါလိမ့်မယ်။ ပြီးရင် — `roomId` prop အသစ်နဲ့ သူ့ရဲ့ body ကို run လုပ်ခြင်းဖြင့် (သင့်ကို `"music"` room ဆီ ချိတ်ဆက်ခြင်းဖြင့်) ထပ်တူပြုခြင်းကို ပြန် **စတင်** ပါလိမ့်မယ်။

နောက်ဆုံးမှာ — အသုံးပြုသူက တခြား screen တစ်ခုဆီ သွားတဲ့အခါ — `ChatRoom` က unmount ဖြစ်ပါတယ်။ အခု — ချိတ်ဆက်ထားဖို့ လုံးဝ မလိုတော့ပါဘူး။ React က သင့် Effect ရဲ့ ထပ်တူပြုခြင်းကို နောက်ဆုံးတစ်ကြိမ် **ရပ်တန့်** ပြီး — သင့်ကို `"music"` chat room ကနေ ချိတ်ဆက်ဖြုတ်ပါလိမ့်မယ်။

### Effect ရဲ့ ရှုထောင့်ကနေ စဉ်းစားခြင်း

`ChatRoom` component ရဲ့ ရှုထောင့်ကနေ ဖြစ်ခဲ့သမျှ အားလုံးကို ပြန်လည်သုံးသပ်ကြည့်ရအောင်:

1. `ChatRoom` က `roomId` ကို `"general"` လို့ set လုပ်ပြီး mount ဖြစ်ခဲ့တယ်
2. `ChatRoom` က `roomId` ကို `"travel"` လို့ set လုပ်ပြီး update ဖြစ်ခဲ့တယ်
3. `ChatRoom` က `roomId` ကို `"music"` လို့ set လုပ်ပြီး update ဖြစ်ခဲ့တယ်
4. `ChatRoom` က unmount ဖြစ်ခဲ့တယ်

Component ရဲ့ သက်တမ်းစက်ဝိုင်းရဲ့ ဒီအချက်တစ်ခုချင်းစီအတွင်း — သင့် Effect က မတူတဲ့အရာတွေ လုပ်ခဲ့ပါတယ်:

1. သင့် Effect က `"general"` room ဆီ ချိတ်ဆက်ခဲ့တယ်
2. သင့် Effect က `"general"` room ကနေ ချိတ်ဆက်ဖြုတ်ပြီး — `"travel"` room ဆီ ချိတ်ဆက်ခဲ့တယ်
3. သင့် Effect က `"travel"` room ကနေ ချိတ်ဆက်ဖြုတ်ပြီး — `"music"` room ဆီ ချိတ်ဆက်ခဲ့တယ်
4. သင့် Effect က `"music"` room ကနေ ချိတ်ဆက်ဖြုတ်ခဲ့တယ်

အခု — Effect ကိုယ်တိုင်ရဲ့ ရှုထောင့်ကနေ ဘာတွေ ဖြစ်ခဲ့လဲ စဉ်းစားကြည့်ရအောင်:

```js
  useEffect(() => {
    // Your Effect connected to the room specified with roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...until it disconnected
      connection.disconnect();
    };
  }, [roomId]);
```

ဒီ code ရဲ့ ဖွဲ့စည်းပုံက — ဖြစ်ခဲ့တာတွေကို — တစ်ခုနဲ့တစ်ခု ထပ်မနေတဲ့ (non-overlapping) အချိန်ကာလတွေရဲ့ sequence တစ်ခုအနေနဲ့ မြင်စေနိုင်ပါတယ်:

1. သင့် Effect က `"general"` room ဆီ ချိတ်ဆက်ခဲ့တယ် (ချိတ်ဆက်ဖြုတ်လိုက်တဲ့အထိ)
2. သင့် Effect က `"travel"` room ဆီ ချိတ်ဆက်ခဲ့တယ် (ချိတ်ဆက်ဖြုတ်လိုက်တဲ့အထိ)
3. သင့် Effect က `"music"` room ဆီ ချိတ်ဆက်ခဲ့တယ် (ချိတ်ဆက်ဖြုတ်လိုက်တဲ့အထိ)

အရင်က — သင်က component ရဲ့ ရှုထောင့်ကနေ စဉ်းစားနေခဲ့ပါတယ်။ Component ရဲ့ ရှုထောင့်ကနေ ကြည့်တဲ့အခါ — Effects တွေကို "render ပြီးနောက်" ဒါမှမဟုတ် "unmount မလုပ်ခင်" လိုမျိုး — တိကျတဲ့ အချိန်တစ်ခုမှာ fire ဖြစ်တဲ့ — "callbacks" ဒါမှမဟုတ် "lifecycle events" တွေလို့ စဉ်းစားဖို့ ဆွဲဆောင်မှု ရှိပါတယ်။ ဒီလိုစဉ်းစားနည်းက အရမ်းမြန်မြန် ရှုပ်ထွေးသွားတာမို့ — ရှောင်တာ အကောင်းဆုံးပါ။

**အဲဒီအစား — တစ်ကြိမ်မှာ start/stop cycle တစ်ခုတည်းကိုပဲ အမြဲတမ်း အာရုံစိုက်ပါ။ Component တစ်ခုက mounting လား၊ updating လား၊ unmounting လားဆိုတာ အရေးမကြီးပါဘူး။ သင်လုပ်ရမှာက — ထပ်တူပြုခြင်းကို ဘယ်လို စတင်ရမယ်၊ ဘယ်လို ရပ်တန့်ရမယ်ဆိုတာကို ဖော်ပြဖို့ပဲ။ ကောင်းကောင်း လုပ်နိုင်ရင် — သင့် Effect က လိုအပ်သလောက် အကြိမ်များများ စတင်ခြင်းနဲ့ ရပ်တန့်ခြင်းကို ခံနိုင်ရည်ရှိပါလိမ့်မယ်။**

ဒါက JSX ဖန်တီးတဲ့ rendering logic ရေးတဲ့အခါ — component တစ်ခုက mounting လား updating လားဆိုတာ သင်မစဉ်းစားတာကို သတိရစေနိုင်ပါတယ်။ Screen ပေါ်မှာ ဘာတွေ ရှိသင့်လဲဆိုတာကို သင်ဖော်ပြပြီး — [ကျန်တာတွေကို React က ရှာဖွေဖြေရှင်း](/docs/react/reacting-to-input-with-state) ပါတယ်။

### React က သင့် Effect က Re-Synchronize လုပ်နိုင်ကြောင်း ဘယ်လို စစ်ဆေးလဲ

ဒီမှာ သင်ကစားလို့ရတဲ့ live ဥပမာတစ်ခုပါ။ `ChatRoom` component ကို mount လုပ်ဖို့ "Open chat" ကို နှိပ်ပါ:

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

Component က ပထမဆုံးအကြိမ် mount ဖြစ်တဲ့အခါ — log သုံးခု မြင်ရတာ သတိပြုပါ:

1. `✅ Connecting to "general" room at https://localhost:1234...` *(development-only)*
2. `❌ Disconnected from "general" room at https://localhost:1234.` *(development-only)*
3. `✅ Connecting to "general" room at https://localhost:1234...`

ပထမ log နှစ်ခုက development မှာပဲ ဖြစ်ပါတယ်။ Development မှာ — React က component တိုင်းကို တစ်ကြိမ် အမြဲ ပြန်လည် mount လုပ်ပါတယ်။

**React က သင့် Effect က re-synchronize လုပ်နိုင်ကြောင်း — development မှာ ချက်ချင်း အတင်းလုပ်ခိုင်းခြင်းဖြင့် — စစ်ဆေးပါတယ်။** ဒါက သော့အလုပ်လုပ်လား စစ်ဆေးဖို့ — တံခါးကို ဖွင့်ပြီး နောက်ထပ် တစ်ခါထပ် ပိတ်ကြည့်တာကို သတိရစေနိုင်ပါတယ်။ React က သင့် Effect ကို development မှာ [cleanup ကို ကောင်းကောင်း implement လုပ်ထားကြောင်း စစ်ဆေးဖို့](/docs/react/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) — တစ်ကြိမ် အပိုစတင်ပြီး ရပ်တန့်ပါတယ်။

လက်တွေ့မှာ သင့် Effect က re-synchronize ဖြစ်တဲ့ အဓိကအကြောင်းရင်းက — သူသုံးတဲ့ data တချို့ ပြောင်းလဲလို့ပါ။ အထက်က sandbox ထဲမှာ — ရွေးထားတဲ့ chat room ကို ပြောင်းကြည့်ပါ။ `roomId` ပြောင်းတဲ့အခါ — သင့် Effect က re-synchronize ဖြစ်တာ သတိပြုပါ။

ဒါပေမယ့် — re-synchronization လိုအပ်တဲ့ ပိုထူးဆန်းတဲ့ ကိစ္စတွေလည်း ရှိပါတယ်။ ဥပမာ — chat ဖွင့်ထားတုန်း အထက်က sandbox ထဲက `serverUrl` ကို တည်းဖြတ်ကြည့်ပါ။ သင်က code ကို တည်းဖြတ်တာကို တုံ့ပြန်တဲ့အနေနဲ့ — Effect က re-synchronize ဖြစ်တာ သတိပြုပါ။ အနာဂတ်မှာ — React က re-synchronization ကို အားကိုးတဲ့ features တွေ ထပ်ထည့်နိုင်ပါတယ်။

### React က Effect ကို Re-Synchronize လုပ်ဖို့ လိုတယ်ဆိုတာ ဘယ်လို သိလဲ

`roomId` ပြောင်းပြီးနောက်မှာ — သင့် Effect က re-synchronize လုပ်ဖို့ လိုတယ်ဆိုတာ React က ဘယ်လို သိခဲ့လဲလို့ သင်တွေးမိနိုင်ပါတယ်။ ဒါက [dependencies ရဲ့ list](/docs/react/synchronizing-with-effects#step-2-specify-the-effect-dependencies) ထဲမှာ `roomId` ကို ထည့်သွင်းခြင်းဖြင့် — သူ့ရဲ့ code က `roomId` ပေါ်မှာ မှီခိုတယ်ဆိုတာ *React ကို သင်ပြောထားလို့ပါ*:

```js
function ChatRoom({ roomId }) { // The roomId prop may change over time
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads roomId
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // So you tell React that this Effect "depends on" roomId
  // ...
```

ဒါက ဒီလို အလုပ်လုပ်ပါတယ်:

1. `roomId` က prop တစ်ခုဆိုတာ သင်သိပါတယ် — ဆိုလိုတာက အချိန်နဲ့အမျှ ပြောင်းလဲနိုင်ပါတယ်။
2. သင့် Effect က `roomId` ကို ဖတ်တယ်ဆိုတာ သင်သိပါတယ် (ဒါကြောင့် သူ့ရဲ့ logic က နောက်ပိုင်းမှာ ပြောင်းလဲနိုင်တဲ့ တန်ဖိုးတစ်ခုပေါ်မှာ မှီခိုနေတယ်)။
3. ဒါကြောင့် — သင့် Effect ရဲ့ dependency အဖြစ် သတ်မှတ်ခဲ့တာပါ (`roomId` ပြောင်းတဲ့အခါ re-synchronize ဖြစ်အောင်ပါ)။

သင့် component က re-render ဖြစ်ပြီးတိုင်း — React က သင်ပေးထားတဲ့ dependencies array ကို ကြည့်ပါလိမ့်မယ်။ Array ထဲက တန်ဖိုးတစ်ခုခုက အရင် render အတွင်း သင်ပေးခဲ့တဲ့ နေရာတစ်ခုတည်းက တန်ဖိုးနဲ့ မတူဘူးဆိုရင် — React က သင့် Effect ကို re-synchronize လုပ်ပါလိမ့်မယ်။

ဥပမာ — ကနဦး render အတွင်း `["general"]` ကို ပေးခဲ့ပြီး — နောက် render အတွင်း `["travel"]` ကို ပေးခဲ့ရင် — React က `"general"` နဲ့ `"travel"` ကို နှိုင်းယှဉ်ပါလိမ့်မယ်။ ဒါတွေက တန်ဖိုး မတူညီတာတွေပါ ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နဲ့ နှိုင်းယှဉ်ရင်) — ဒါကြောင့် React က သင့် Effect ကို re-synchronize လုပ်ပါလိမ့်မယ်။ တစ်ဖက်မှာတော့ — သင့် component က re-render ဖြစ်ပေမယ့် `roomId` မပြောင်းဘူးဆိုရင် — သင့် Effect က room တစ်ခုတည်းဆီ ချိတ်ဆက်ထားတာ ဆက်ဖြစ်နေပါလိမ့်မယ်။

### Effect တစ်ခုချင်းစီက သီးခြားလွတ်လပ်တဲ့ Synchronization Process တစ်ခုကို ကိုယ်စားပြုတယ်

ဆက်စပ်မှုမရှိတဲ့ logic တစ်ခုကို — သင်ရေးပြီးသား Effect တစ်ခုနဲ့ တစ်ချိန်တည်း run ဖို့ လိုလို့ဆိုပြီး — သင့် Effect ထဲ ထည့်တာကို ရှောင်ပါ။ ဥပမာ — အသုံးပြုသူက room ကို လည်ပတ်တဲ့အခါ analytics event တစ်ခု ပို့ချင်တယ်ဆိုပါစို့။ `roomId` ကို မှီခိုတဲ့ Effect တစ်ခု ရှိပြီးသားမို့ — analytics ခေါ်မှုကို အဲဒီနေရာမှာ ထည့်ချင်စိတ် ပေါ်နိုင်ပါတယ်:

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

ဒါပေမယ့် — နောက်ပိုင်းမှာ ဒီ Effect ဆီ — connection ကို ပြန်လည်တည်ဆောက်ဖို့ လိုတဲ့ — dependency တစ်ခု ထပ်ထည့်တယ်ဆိုပါစို့။ ဒီ Effect က re-synchronize ဖြစ်ရင် — room တစ်ခုတည်းအတွက် `logVisit(roomId)` ကိုလည်း ခေါ်မိပါလိမ့်မယ် — အဲဒါ သင်ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။ Visit log လုပ်တာက — ချိတ်ဆက်တာနဲ့ **process သီးခြားတစ်ခု** ပါ။ သူတို့ကို Effect သီးခြားနှစ်ခုအဖြစ် ရေးပါ:

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**သင့် code ထဲက Effect တစ်ခုချင်းစီက သီးခြားလွတ်လပ်တဲ့ — synchronization process တစ်ခုကို ကိုယ်စားပြုသင့်ပါတယ်။**

အထက်က ဥပမာမှာ — Effect တစ်ခုကို ဖျက်လိုက်တာက တစ်ခြား Effect ရဲ့ logic ကို မချိုးဖျက်ပါဘူး။ ဒါက သူတို့က မတူတဲ့အရာတွေကို ထပ်တူပြုတယ်ဆိုတဲ့ ကောင်းတဲ့ အရိပ်အယောင်ဖြစ်ပြီး — သူတို့ကို ခွဲလိုက်တာ အဓိပ္ပာယ်ရှိပါတယ်။ တစ်ဖက်မှာ — သင့်တင့်လျောက်ပတ်တဲ့ logic အပိုင်းတစ်ပိုင်းကို Effect သီးခြားတွေအဖြစ် ခွဲလိုက်ရင် — code က "ပိုသပ်ရပ်တယ်" လို့ ထင်ရပေမယ့် — [ထိန်းသိမ်းရ ပိုခက်ပါလိမ့်မယ်](/docs/react/you-might-not-need-an-effect#chains-of-computations)။ ဒါကြောင့် — code က ပိုသပ်ရပ်လားဆိုတာထက် — process တွေက အတူတူလား သီးခြားလားဆိုတာကို စဉ်းစားသင့်ပါတယ်။

## Effects တွေက Reactive Values တွေကို "React" လုပ်တယ်

သင့် Effect က variable နှစ်ခု (`serverUrl` နဲ့ `roomId`) ကို ဖတ်ပေမယ့် — `roomId` တစ်ခုကိုပဲ dependency အဖြစ် သတ်မှတ်ခဲ့ပါတယ်:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

`serverUrl` က ဘာကြောင့် dependency တစ်ခု ဖြစ်ဖို့ မလိုတာလဲ?

ဒါက `serverUrl` က re-render တစ်ခုကြောင့် ဘယ်တော့မှ မပြောင်းလို့ပါ။ Component က ဘယ်နှစ်ခါ၊ ဘာကြောင့် re-render ဖြစ်ပါစေ — အဲဒါက အမြဲတမ်း အတူတူပါ။ `serverUrl` က ဘယ်တော့မှ မပြောင်းတာမို့ — dependency အဖြစ် သတ်မှတ်တာ အဓိပ္ပာယ်မရှိပါဘူး။ နောက်ဆုံးမှာတော့ — dependencies တွေက အချိန်နဲ့အမျှ ပြောင်းလဲတဲ့အခါမှပဲ တစ်ခုခု လုပ်တာပါ!

တစ်ဖက်မှာ — `roomId` က re-render တစ်ခုမှာ မတူညီနိုင်ပါတယ်။ **Component ရဲ့ အတွင်းမှာ ကြေညာထားတဲ့ props၊ state နဲ့ တခြားတန်ဖိုးတွေက _reactive_ ပါ — ဘာလို့လဲဆိုတော့ သူတို့က rendering အတွင်းမှာ တွက်ချက်ပြီး — React data flow ထဲမှာ ပါဝင်လို့ပါ။**

`serverUrl` က state variable တစ်ခုဆိုရင် — reactive ဖြစ်ပါလိမ့်မယ်။ Reactive values တွေကို dependencies တွေထဲမှာ ထည့်သွင်းရပါမယ်:

```js
function ChatRoom({ roomId }) { // Props change over time
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State may change over time

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Your Effect reads props and state
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So you tell React that this Effect "depends on" on props and state
  // ...
}
```

`serverUrl` ကို dependency တစ်ခုအဖြစ် ထည့်သွင်းခြင်းဖြင့် — အဲဒါ ပြောင်းလဲပြီးနောက်မှာ Effect က re-synchronize ဖြစ်ကြောင်း သေချာစေပါတယ်။

ဒီ sandbox ထဲမှာ ရွေးထားတဲ့ chat room ကို ပြောင်းကြည့်ပါ ဒါမှမဟုတ် server URL ကို တည်းဖြတ်ကြည့်ပါ:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

`roomId` ဒါမှမဟုတ် `serverUrl` လိုမျိုး reactive value တစ်ခုကို ပြောင်းလိုက်တိုင်း — Effect က chat server ဆီ ပြန်ချိတ်ဆက်ပါတယ်။

### ဗလာ Dependencies ရှိတဲ့ Effect တစ်ခုရဲ့ အဓိပ္ပာယ်

`serverUrl` ရော `roomId` ရော နှစ်ခုလုံးကို component ရဲ့ အပြင်ဘက်ကို ရွှေ့လိုက်ရင် ဘာဖြစ်မလဲ?

```js
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

အခု သင့် Effect ရဲ့ code က reactive value *တစ်ခုမှ* မသုံးတော့တာမို့ — သူ့ရဲ့ dependencies တွေက ဗလာ (`[]`) ဖြစ်နိုင်ပါတယ်။

Component ရဲ့ ရှုထောင့်ကနေ စဉ်းစားရင် — ဗလာ `[]` dependency array က ဒီ Effect က component mount ဖြစ်တဲ့အခါမှပဲ chat room ဆီ ချိတ်ဆက်ပြီး — component unmount ဖြစ်တဲ့အခါမှပဲ ချိတ်ဆက်ဖြုတ်တယ်လို့ ဆိုလိုပါတယ်။ (Development မှာ React က သင့် logic ကို stress-test လုပ်ဖို့ [နောက်ထပ်တစ်ကြိမ် re-synchronize](/docs/react/lifecycle-of-reactive-effects#how-react-verifies-that-your-effect-can-re-synchronize) လုပ်နေဦးမယ်ဆိုတာ သတိရပါ။)

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
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

ဒါပေမယ့် — [Effect ရဲ့ ရှုထောင့်ကနေ စဉ်းစားရင်](#thinking-from-the-effects-perspective) — mounting နဲ့ unmounting အကြောင်း လုံးဝ စဉ်းစားဖို့ မလိုပါဘူး။ အရေးကြီးတာက — ထပ်တူပြုခြင်းကို စတင်ဖို့နဲ့ ရပ်တန့်ဖို့ — သင့် Effect က ဘာလုပ်မယ်ဆိုတာ သင်သတ်မှတ်ပြီးသားပါ။ ဒီနေ့တော့ — သူ့မှာ reactive dependencies တွေ မရှိပါဘူး။ ဒါပေမယ့် — တစ်နေ့ကျရင် အသုံးပြုသူက `roomId` ဒါမှမဟုတ် `serverUrl` ကို အချိန်နဲ့အမျှ ပြောင်းစေချင်ရင် (ပြီးတော့ သူတို့က reactive ဖြစ်လာရင်) — သင့် Effect ရဲ့ code က မပြောင်းပါဘူး။ သူတို့ကို dependencies တွေထဲ ထည့်ရုံပဲ လိုပါလိမ့်မယ်။

### Component Body ထဲမှာ ကြေညာထားတဲ့ Variable တွေအားလုံး Reactive ပါ

Props နဲ့ state တွေပဲ reactive values တွေ မဟုတ်ပါဘူး။ သူတို့ကနေ သင်တွက်ချက်တဲ့ တန်ဖိုးတွေလည်း reactive ပါ။ Props ဒါမှမဟုတ် state ပြောင်းရင် — သင့် component က re-render ဖြစ်ပြီး — သူတို့ကနေ တွက်ချက်ထားတဲ့ တန်ဖိုးတွေလည်း ပြောင်းပါလိမ့်မယ်။ ဒါကြောင့် — Effect က သုံးတဲ့ component body ကနေ လာတဲ့ variable တွေအားလုံး — Effect dependency list ထဲမှာ ရှိသင့်ပါတယ်။

အသုံးပြုသူက dropdown ထဲမှာ chat server တစ်ခု ရွေးနိုင်သလို — settings ထဲမှာ default server တစ်ခုကိုလည်း configure လုပ်နိုင်တယ်ဆိုပါစို့။ Settings state ကို [context](/docs/react/scaling-up-with-reducer-and-context) တစ်ခုထဲမှာ ထားပြီးသားမို့ — အဲဒီ context ကနေ `settings` ကို ဖတ်တယ်ဆိုပါစို့။ အခု — props ကနေ ရွေးထားတဲ့ server နဲ့ default server ပေါ် အခြေခံပြီး `serverUrl` ကို တွက်ချက်ပါတယ်:

```js
function ChatRoom({ roomId, selectedServerUrl }) { // roomId is reactive
  const settings = useContext(SettingsContext); // settings is reactive
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Your Effect reads roomId and serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So it needs to re-synchronize when either of them changes!
  // ...
}
```

ဒီဥပမာမှာ — `serverUrl` က prop ဒါမှမဟုတ် state variable မဟုတ်ပါဘူး။ သင်က rendering အတွင်းမှာ တွက်ချက်တဲ့ သာမန် variable တစ်ခုပါ။ ဒါပေမယ့် — rendering အတွင်းမှာ တွက်ချက်တာမို့ — re-render တစ်ခုကြောင့် ပြောင်းလဲနိုင်ပါတယ်။ ဒါကြောင့် — reactive ပါ။

**Component ရဲ့ အတွင်းမှာရှိတဲ့ တန်ဖိုးအားလုံး (props၊ state နဲ့ သင့် component body ထဲက variables တွေ အပါအဝင်) က reactive ပါ။ Reactive value တစ်ခုခုက re-render တစ်ခုမှာ ပြောင်းလဲနိုင်တာမို့ — reactive values တွေကို Effect ရဲ့ dependencies အဖြစ် ထည့်သွင်းဖို့ လိုပါတယ်။**

တစ်နည်းပြောရရင် — Effects တွေက component body ကနေ လာတဲ့ တန်ဖိုးအားလုံးကို "react" လုပ်ပါတယ်။

#### Global ဒါမှမဟုတ် Mutable Values တွေက Dependencies ဖြစ်နိုင်လား

Mutable values တွေ (global variables တွေ အပါအဝင်) က reactive မဟုတ်ပါဘူး။

**[`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) လိုမျိုး mutable value တစ်ခုက dependency တစ်ခု မဖြစ်နိုင်ပါဘူး။** အဲဒါက mutable ဖြစ်လို့ — React rendering data flow ရဲ့ လုံးဝအပြင်ဘက်မှာ — ဘယ်အချိန်မဆို ပြောင်းလဲနိုင်ပါတယ်။ အဲဒါကို ပြောင်းတာက သင့် component ရဲ့ re-render တစ်ခုကို မဖြစ်ပေါ်စေပါဘူး။ ဒါကြောင့် — dependencies တွေထဲမှာ သတ်မှတ်ထားရင်တောင် — အဲဒါ ပြောင်းတဲ့အခါ React က Effect ကို re-synchronize လုပ်ဖို့ *မသိ* ပါဘူး။ ဒါက React ရဲ့ စည်းမျဉ်းတွေကိုလည်း ချိုးဖောက်ပါတယ် — ဘာလို့လဲဆိုတော့ rendering အတွင်း (dependencies တွေကို တွက်ချက်တဲ့အချိန်) mutable data ဖတ်တာက [rendering ရဲ့ purity](/docs/react/keeping-components-pure) ကို ချိုးဖောက်လို့ပါ။ အဲဒီအစား — external mutable value တစ်ခုကို [`useSyncExternalStore`](/docs/react/you-might-not-need-an-effect#subscribing-to-an-external-store) နဲ့ ဖတ်ပြီး subscribe လုပ်သင့်ပါတယ်။

**[`ref.current`](/docs/react/use-ref) လိုမျိုး mutable value တစ်ခု ဒါမှမဟုတ် အဲဒီကနေ ဖတ်တဲ့အရာတွေလည်း dependency တစ်ခု မဖြစ်နိုင်ပါဘူး။** `useRef` က ပြန်ပေးတဲ့ ref object ကိုယ်တိုင်က dependency တစ်ခု ဖြစ်နိုင်ပေမယ့် — သူ့ရဲ့ `current` property ကတော့ ရည်ရွယ်ချက်ရှိရှိ mutable ပါ။ အဲဒါက [re-render တစ်ခုကို မဖြစ်ပေါ်စေဘဲ တစ်ခုခုကို ခြေရာခံနိုင်စေပါတယ်](/docs/react/referencing-values-with-refs)။ ဒါပေမယ့် — အဲဒါကို ပြောင်းတာက re-render ကို မဖြစ်ပေါ်စေတာမို့ — reactive value မဟုတ်ဘဲ — အဲဒါ ပြောင်းတဲ့အခါ React က သင့် Effect ကို ပြန် run လုပ်ဖို့ မသိပါဘူး။

ဒီ page ရဲ့ အောက်မှာ သင်လေ့လာရမယ့်အတိုင်း — linter တစ်ခုက ဒီပြဿနာတွေကို အလိုအလျောက် စစ်ဆေးပေးပါလိမ့်မယ်။

### React က Reactive Value တိုင်းကို Dependency အဖြစ် သတ်မှတ်ထားကြောင်း စစ်ဆေးတယ်

သင့် linter က [React အတွက် configure လုပ်ထားရင်](/docs/react/editor-setup) — သင့် Effect ရဲ့ code က သုံးတဲ့ reactive value တိုင်းကို သူ့ရဲ့ dependency အဖြစ် ကြေညာထားကြောင်း စစ်ဆေးပါလိမ့်မယ်။ ဥပမာ — ဒါက `roomId` ရော `serverUrl` ရော နှစ်ခုလုံး reactive ဖြစ်တာမို့ — lint error တစ်ခုပါ:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Something's wrong here!

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

ဒါက React error တစ်ခုလို ထင်ရပေမယ့် — တကယ်တော့ React က သင့် code ထဲက bug တစ်ခုကို ထောက်ပြနေတာပါ။ `roomId` ရော `serverUrl` ရော နှစ်ခုလုံး အချိန်နဲ့အမျှ ပြောင်းလဲနိုင်ပေမယ့် — သင်က သူတို့ ပြောင်းတဲ့အခါ သင့် Effect ကို re-synchronize လုပ်ဖို့ မေ့နေပါတယ်။ အသုံးပြုသူက UI ထဲမှာ တန်ဖိုးမတူတာတွေ ရွေးပြီးတဲ့နောက်မှာတောင် — သင်က ကနဦး `roomId` နဲ့ `serverUrl` ဆီ ချိတ်ဆက်ထားတာ ဆက်ဖြစ်နေပါလိမ့်မယ်။

Bug ကို ပြုပြင်ဖို့ — linter ရဲ့ အကြံပြုချက်အတိုင်း — `roomId` နဲ့ `serverUrl` တွေကို သင့် Effect ရဲ့ dependencies အဖြစ် သတ်မှတ်ပါ:

```js
function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ All dependencies declared
  // ...
}
```

အထက်က sandbox ထဲမှာ ဒီပြုပြင်မှုကို စမ်းကြည့်ပါ။ Linter error ပျောက်သွားပြီး — လိုအပ်တဲ့အခါ chat က ပြန်ချိတ်ဆက်ကြောင်း စစ်ဆေးပါ။

> **မှတ်ချက်:** တချို့ကိစ္စတွေမှာ — component ရဲ့ အတွင်းမှာ ကြေညာထားပေမယ့် — React က တန်ဖိုးတစ်ခုက ဘယ်တော့မှ မပြောင်းဘူးဆိုတာ *သိ* ပါတယ်။ ဥပမာ — `useState` က ပြန်ပေးတဲ့ [`set` function](/docs/react/use-state) နဲ့ [`useRef`](/docs/react/use-ref) က ပြန်ပေးတဲ့ ref object တွေက *stable* ပါ — re-render တစ်ခုမှာ မပြောင်းဘူးလို့ အာမခံထားပါတယ်။ Stable values တွေက reactive မဟုတ်တာမို့ — သူတို့ကို စာရင်းကနေ ချန်လှပ်နိုင်ပါတယ်။ ထည့်သွင်းတာလည်း ခွင့်ပြုပါတယ်: သူတို့က မပြောင်းတာမို့ — အရေးမကြီးပါဘူး။

### Re-Synchronize မလုပ်စေချင်တဲ့အခါ ဘာလုပ်မလဲ

အရင် ဥပမာမှာ — `roomId` နဲ့ `serverUrl` တွေကို dependencies အဖြစ် စာရင်းပြုလုပ်ခြင်းဖြင့် — lint error ကို ပြုပြင်ခဲ့ပါတယ်။

**ဒါပေမယ့် — သင်က ဒီတန်ဖိုးတွေက reactive values တွေ မဟုတ်ဘူးလို့ linter ဆီ "သက်သေပြ" နိုင်ပါတယ်** — ဆိုလိုတာက — re-render တစ်ခုရဲ့ ရလဒ်အနေနဲ့ သူတို့ *မပြောင်းနိုင်* ဘူးဆိုတာပါ။ ဥပမာ — `serverUrl` နဲ့ `roomId` တွေက rendering ပေါ်မှာ မမှီခိုဘဲ — အမြဲတမ်း တန်ဖိုးတွေ အတူတူဆိုရင် — သူတို့ကို component ရဲ့ အပြင်ဘက်ကို ရွှေ့နိုင်ပါတယ်။ အခု သူတို့က dependencies တွေ ဖြစ်ဖို့ မလိုတော့ပါဘူး:

```js
const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
const roomId = 'general'; // roomId is not reactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

သူတို့ကို *Effect ရဲ့ အတွင်းဘက်* ကိုလည်း ရွှေ့နိုင်ပါတယ်။ သူတို့က rendering အတွင်းမှာ တွက်ချက်တာ မဟုတ်တာမို့ — reactive မဟုတ်ပါဘူး:

```js
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
    const roomId = 'general'; // roomId is not reactive
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

**Effects တွေက reactive code blocks တွေပါ။** သူတို့ရဲ့ အတွင်းမှာ သင်ဖတ်တဲ့ တန်ဖိုးတွေ ပြောင်းတဲ့အခါ — သူတို့က re-synchronize ဖြစ်ပါတယ်။ Interaction တစ်ခုမှာ တစ်ခါပဲ run တဲ့ event handlers တွေနဲ့ မတူဘဲ — Effects တွေက synchronization လိုအပ်တိုင်း run ပါတယ်။

**သင်က သင့် dependencies တွေကို "ရွေးချယ်" လို့ မရပါဘူး။** သင့် dependencies တွေမှာ — Effect ထဲမှာ သင်ဖတ်တဲ့ [reactive value](#all-variables-declared-in-the-component-body-are-reactive) တိုင်း ပါဝင်ရပါမယ်။ Linter က ဒါကို အတင်းအကျပ် လုပ်ဆောင်ပါတယ်။ တခါတရံ ဒါက infinite loops တွေနဲ့ သင့် Effect က မကြာခဏ re-synchronize ဖြစ်တာလိုမျိုး ပြဿနာတွေဆီ ဦးတည်နိုင်ပါတယ်။ Linter ကို ဖိနှိပ်ခြင်းဖြင့် ဒီပြဿနာတွေကို မပြုပြင်ပါနဲ့! ဒီအစား ဒါတွေကို စမ်းကြည့်ပါ:

* **သင့် Effect က သီးခြားလွတ်လပ်တဲ့ synchronization process တစ်ခုကို ကိုယ်စားပြုကြောင်း စစ်ဆေးပါ။** သင့် Effect က ဘာကိုမှ ထပ်တူမပြုဘူးဆိုရင် — [အဲဒါ မလိုအပ်နိုင်ပါဘူး](/docs/react/you-might-not-need-an-effect)။ သူက သီးခြားလွတ်လပ်တဲ့အရာများစွာကို ထပ်တူပြုနေရင် — [ခွဲလိုက်ပါ](#each-effect-represents-a-separate-synchronization-process)။

* **"react" မလုပ်ဘဲ — Effect ကို re-synchronize မလုပ်ဘဲ — props ဒါမှမဟုတ် state ရဲ့ နောက်ဆုံးတန်ဖိုးကို ဖတ်ချင်ရင်** — သင့် Effect ကို reactive အပိုင်း (Effect ထဲမှာ ထားမယ့်) နဲ့ non-reactive အပိုင်း (_Effect Event_ လို့ ခေါ်တဲ့အရာထဲ ထုတ်ယူမယ့်) အဖြစ် ခွဲနိုင်ပါတယ်။ [Events တွေကို Effects တွေကနေ ခွဲခြားခြင်း](/docs/react/separating-events-from-effects) အကြောင်း ဖတ်ပါ။

* **Objects နဲ့ functions တွေကို dependencies အဖြစ် အားကိုးတာ ရှောင်ပါ။** Rendering အတွင်းမှာ objects နဲ့ functions တွေ ဖန်တီးပြီး — Effect တစ်ခုကနေ ဖတ်ရင် — သူတို့က render တိုင်းမှာ မတူညီပါလိမ့်မယ်။ ဒါက သင့် Effect ကို အကြိမ်တိုင်း re-synchronize ဖြစ်စေပါလိမ့်မယ်။ [Effects တွေကနေ မလိုအပ်တဲ့ dependencies တွေကို ဖယ်ရှားခြင်း](/docs/react/removing-effect-dependencies) အကြောင်း ပိုဖတ်ပါ။

> **သတိပြုရန်:** Linter က သင့်သူငယ်ချင်းပါ — ဒါပေမယ့် — သူ့ရဲ့ စွမ်းအားတွေက အကန့်အသတ်ရှိပါတယ်။ Linter က dependencies တွေ *မှားနေတဲ့အချိန်* ကိုပဲ သိပါတယ်။ ကိစ္စတစ်ခုချင်းစီအတွက် *အကောင်းဆုံး* ဖြေရှင်းနည်းကိုတော့ မသိပါဘူး။ Linter က dependency တစ်ခုကို အကြံပြုပေမယ့် — အဲဒါ ထည့်လိုက်တာက loop တစ်ခု ဖြစ်စေရင် — linter ကို လျစ်လျူရှုသင့်တယ်လို့ မဆိုလိုပါဘူး။ အဲဒီတန်ဖိုးက reactive မဖြစ်တော့အောင် — dependency တစ်ခု *မလိုအပ်တော့အောင်* — Effect ရဲ့ အတွင်း (ဒါမှမဟုတ် အပြင်) က code ကို ပြောင်းဖို့ လိုပါတယ်။
>
> ရှိပြီးသား codebase တစ်ခု ရှိရင် — linter ကို ဒီလိုမျိုး ဖိနှိပ်ထားတဲ့ Effects တချို့ ရှိနိုင်ပါတယ်:
>
> ```js
> useEffect(() => {
>   // ...
>   // 🔴 Avoid suppressing the linter like this:
>   // eslint-ignore-next-line react-hooks/exhaustive-deps
> }, []);
> ```
>
> [Separating Events from Effects](/docs/react/separating-events-from-effects) နဲ့ [Removing Effect Dependencies](/docs/react/removing-effect-dependencies) စာမျက်နှာတွေမှာ — စည်းမျဉ်းတွေကို မချိုးဖောက်ဘဲ ဒီ code ကို ဘယ်လို ပြုပြင်ရမလဲ သင်ယူရပါလိမ့်မယ်။ ပြုပြင်တာက အမြဲတမ်း တန်ဖိုးရှိပါတယ်!

## အကျဉ်းချုပ်

- Components တွေက mount ဖြစ်နိုင်၊ update ဖြစ်နိုင်၊ unmount ဖြစ်နိုင်ပါတယ်။
- Effect တစ်ခုချင်းစီမှာ ဝန်းရံနေတဲ့ component နဲ့ သီးခြားတဲ့ သက်တမ်းစက်ဝိုင်း တစ်ခု ရှိပါတယ်။
- Effect တစ်ခုချင်းစီက *စတင်* နိုင်ပြီး *ရပ်တန့်* နိုင်တဲ့ — သီးခြား synchronization process တစ်ခုကို ဖော်ပြပါတယ်။
- Effects တွေ ရေးတဲ့အခါ ဖတ်တဲ့အခါ — component ရဲ့ ရှုထောင့်ကနေ (ဘယ်လို mount/update/unmount လုပ်လဲ) မဟုတ်ဘဲ — Effect တစ်ခုချင်းစီရဲ့ ရှုထောင့်ကနေ (synchronization ကို ဘယ်လို စတင်/ရပ်တန့်မလဲ) စဉ်းစားပါ။
- Component body ရဲ့ အတွင်းမှာ ကြေညာထားတဲ့ တန်ဖိုးတွေက "reactive" ပါ။
- Reactive values တွေက Effect ကို re-synchronize လုပ်စေသင့်ပါတယ် — ဘာလို့လဲဆိုတော့ သူတို့က အချိန်နဲ့အမျှ ပြောင်းလဲနိုင်လို့ပါ။
- Linter က Effect ရဲ့ အတွင်းမှာ သုံးထားတဲ့ reactive value တိုင်းကို dependencies အဖြစ် သတ်မှတ်ထားကြောင်း စစ်ဆေးပါတယ်။
- Linter က flag လုပ်တဲ့ error တွေအားလုံး တရားဝင်ပါတယ်။ စည်းမျဉ်းတွေကို မချိုးဖောက်ဘဲ code ကို ပြုပြင်ဖို့ နည်းလမ်းတစ်ခု အမြဲ ရှိပါတယ်။

## စိန်ခေါ်မှုများ (Challenges)

### Key တိုင်း နှိပ်တိုင်း ပြန်ချိတ်ဆက်တာကို ပြုပြင်ခြင်း

ဒီဥပမာမှာ — `ChatRoom` component က component mount ဖြစ်တဲ့အခါ chat room ဆီ ချိတ်ဆက်ပြီး — unmount ဖြစ်တဲ့အခါ ချိတ်ဆက်ဖြုတ်ပြီး — တစ်ခြား chat room တစ်ခု ရွေးတဲ့အခါ ပြန်ချိတ်ဆက်ပါတယ်။ ဒီအပြုအမူက မှန်ကန်တာမို့ — အလုပ်လုပ်နေအောင် ထားဖို့ လိုပါတယ်။

ဒါပေမယ့် — ပြဿနာတစ်ခု ရှိပါတယ်။ အောက်က message box input ထဲမှာ စာရိုက်တိုင်း — `ChatRoom` က chat ဆီ *လည်း* ပြန်ချိတ်ဆက်ပါတယ်။ (Console ကို ရှင်းလင်းပြီး input ထဲ စာရိုက်ခြင်းဖြင့် ဒါကို သတိပြုမိနိုင်ပါတယ်။) ဒီလိုမဖြစ်အောင် — ပြဿနာကို ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** ဒီ Effect အတွက် dependency array တစ်ခု ထည့်ဖို့ လိုနိုင်ပါတယ်။ အဲဒီမှာ ဘယ် dependencies တွေ ရှိသင့်လဲ?

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

#### အဖြေ

ဒီ Effect မှာ dependency array လုံးဝ မရှိခဲ့တာမို့ — re-render တိုင်းပြီးနောက်မှာ re-synchronize ဖြစ်ခဲ့ပါတယ်။ ပထမဆုံး — dependency array တစ်ခု ထည့်ပါ။ ပြီးရင် — Effect က သုံးတဲ့ reactive value တိုင်းကို array ထဲမှာ သတ်မှတ်ထားကြောင်း သေချာလုပ်ပါ။ ဥပမာ — `roomId` က reactive ပါ (prop တစ်ခုဖြစ်လို့) — ဒါကြောင့် array ထဲမှာ ထည့်သွင်းသင့်ပါတယ်။ ဒါက — အသုံးပြုသူက မတူတဲ့ room တစ်ခု ရွေးတဲ့အခါ — chat က ပြန်ချိတ်ဆက်ကြောင်း သေချာစေပါတယ်။ တစ်ဖက်မှာ — `serverUrl` က component ရဲ့ အပြင်မှာ သတ်မှတ်ထားပါတယ်။ ဒါကြောင့် — array ထဲမှာ ရှိဖို့ မလိုပါဘူး။

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

### Synchronization ကို ဖွင့်/ပိတ်လုပ်ခြင်း

ဒီဥပမာမှာ — Effect တစ်ခုက screen ပေါ်မှာ ပန်းရောင်အစက် (pink dot) တစ်ခုကို ရွှေ့ဖို့ window ရဲ့ [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) event ကို subscribe လုပ်ပါတယ်။ Preview area ပေါ်မှာ hover လုပ်ကြည့်ပါ (ဒါမှမဟုတ် mobile device ပေါ်မှာဆိုရင် screen ကို ထိကြည့်ပါ) — ပန်းရောင်အစက်က သင့်ရွေ့လျားမှုနောက်ကို လိုက်တာ ကြည့်ပါ။

Checkbox တစ်ခုလည်း ရှိပါတယ်။ Checkbox ကို tick လုပ်တာက `canMove` state variable ကို toggle လုပ်ပေမယ့် — ဒီ state variable ကို code ထဲမှာ ဘယ်နေရာမှာမှ မသုံးပါဘူး။ `canMove` က `false` ဖြစ်တဲ့အခါ (checkbox က tick ဖြုတ်ထားတဲ့အခါ) — အစက်က ရွှေ့လျားမှု ရပ်တန့်သွားအောင် — code ကို ပြောင်းဖို့က သင့်တာဝန်ပါ။ Checkbox ကို ပြန် tick ဖွင့်ပြီးတဲ့နောက် (`canMove` ကို `true` လို့ set လုပ်ပြီး) — box က ရွေ့လျားမှုကို ပြန်လိုက်သင့်ပါတယ်။ တစ်နည်းပြောရရင် — အစက် ရွှေ့နိုင်/မရွှေ့နိုင်ဆိုတာက checkbox က tick ထားသလား/မထားဘူးလားဆိုတာနဲ့ ထပ်တူကျနေသင့်ပါတယ်။

> **အရိပ်အမြွက်:** Effect တစ်ခုကို conditionally ကြေညာလို့ မရပါဘူး။ ဒါပေမယ့် — Effect ရဲ့ အတွင်းက code က conditions တွေကို သုံးနိုင်ပါတယ်!

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
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

#### အဖြေ

ဖြေရှင်းနည်းတစ်ခုက — `setPosition` ခေါ်မှုကို `if (canMove) { ... }` condition တစ်ခုထဲမှာ ထုပ်ခြင်းပါ:

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

တစ်နည်းအားဖြင့် — *event subscription* logic ကို `if (canMove) { ... }` condition တစ်ခုထဲမှာ ထုပ်နိုင်ပါတယ်:

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

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

ဒီကိစ္စ နှစ်ခုစလုံးမှာ — `canMove` က သင်က Effect ရဲ့ အတွင်းမှာ ဖတ်တဲ့ reactive variable တစ်ခုပါ။ ဒါကြောင့် — Effect dependencies ရဲ့ စာရင်းထဲမှာ သတ်မှတ်ရပါမယ်။ ဒါက — သူ့ရဲ့ တန်ဖိုး ပြောင်းလဲမှုတိုင်းပြီးနောက်မှာ Effect က re-synchronize ဖြစ်ကြောင်း သေချာစေပါတယ်။

### Stale Value Bug တစ်ခုကို စုံစမ်းခြင်း

ဒီဥပမာမှာ — checkbox ဖွင့်ထားရင် ပန်းရောင်အစက်က ရွှေ့သင့်ပြီး — checkbox ပိတ်ထားရင် ရွှေ့လျားမှု ရပ်သင့်ပါတယ်။ ဒီအတွက် logic က implement လုပ်ပြီးသားပါ: `handleMove` event handler က `canMove` state variable ကို စစ်ဆေးပါတယ်။

ဒါပေမယ့် — တစ်ချို့အကြောင်းပြချက်တွေကြောင့် — `handleMove` ရဲ့ အတွင်းက `canMove` state variable က "stale" (ခေတ်နောက်ကျနေတဲ့) ပုံပေါက်နေပါတယ်: checkbox ကို tick ဖြုတ်ပြီးတဲ့နောက်မှာတောင် — အမြဲတမ်း `true` ပဲ ဖြစ်နေပါတယ်။ ဒါ ဘယ်လို ဖြစ်နိုင်လဲ? Code ထဲက အမှားကို ရှာပြီး ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** Linter rule တစ်ခု ဖိနှိပ်ထားတာ မြင်ရရင် — အဲဒီ suppression ကို ဖယ်လိုက်ပါ! အမှားတွေက အဲဒီမှာ များသောအားဖြင့် ရှိတတ်ပါတယ်။

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

#### အဖြေ

မူရင်း code ရဲ့ ပြဿနာက — dependency linter ကို ဖိနှိပ်ထားတာပါ။ Suppression ကို ဖယ်လိုက်ရင် — ဒီ Effect က `handleMove` function ပေါ်မှာ မှီခိုနေတာ တွေ့ရပါလိမ့်မယ်။ ဒါက အဓိပ္ပာယ်ရှိပါတယ်: `handleMove` က component body ရဲ့ အတွင်းမှာ ကြေညာထားတာမို့ — reactive value တစ်ခု ဖြစ်စေပါတယ်။ Reactive value တိုင်းကို dependency အဖြစ် သတ်မှတ်ရပါမယ် — မဟုတ်ရင် — အချိန်ကြာလာတာနဲ့အမျှ stale ဖြစ်သွားနိုင်ပါတယ်!

မူရင်း code ရဲ့ ရေးသားသူက — Effect က reactive value တစ်ခုခုကို (`[]`) မမှီခိုဘူးလို့ ပြောခြင်းဖြင့် — React ကို "လိမ်ညာ" ထားပါတယ်။ ဒါကြောင့် — `canMove` ပြောင်းသွားပြီးနောက်မှာ (`handleMove` နဲ့အတူ) — React က Effect ကို re-synchronize မလုပ်ခဲ့ပါဘူး။ React က Effect ကို re-synchronize မလုပ်တာမို့ — listener အဖြစ် တွဲထားတဲ့ `handleMove` က ကနဦး render အတွင်း ဖန်တီးထားတဲ့ `handleMove` function ပါ။ ကနဦး render အတွင်းမှာ — `canMove` က `true` ဖြစ်ခဲ့တာမို့ — ကနဦး render ကနေ လာတဲ့ `handleMove` က အဲဒီတန်ဖိုးကိုပဲ ထာဝရ မြင်နေမှာပါ။

**Linter ကို ဘယ်တော့မှ မဖိနှိပ်ရင် — stale values နဲ့ ပတ်သက်တဲ့ ပြဿနာတွေကို ဘယ်တော့မှ မမြင်ရပါဘူး။** ဒီ bug ကို ဖြေရှင်းဖို့ နည်းလမ်းမတူညီတာ အနည်းငယ် ရှိပါတယ် — ဒါပေမယ့် — သင်က linter suppression ကို ဖယ်ရှားခြင်းဖြင့် အမြဲတမ်း စသင့်ပါတယ်။ ပြီးရင် lint error ကို ပြုပြင်ဖို့ code ကို ပြောင်းပါ။

Effect dependencies တွေကို `[handleMove]` အဖြစ် ပြောင်းနိုင်ပါတယ် — ဒါပေမယ့် — အဲဒါက render တိုင်းအတွက် function အသစ်တစ်ခု သတ်မှတ်ခံရမှာမို့ — dependency array ကို လုံးဝ ဖယ်ရှားလိုက်တာလည်း ရပါတယ်။ ဒါဆိုရင် Effect က re-render တိုင်းပြီးနောက်မှာ *ပြန်* re-synchronize ဖြစ်ပါလိမ့်မယ်:

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
  });

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

ဒီဖြေရှင်းနည်းက အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် — အကောင်းဆုံး မဟုတ်ပါဘူး။ Effect ရဲ့ အတွင်းမှာ `console.log('Resubscribing')` ထည့်ကြည့်ရင် — re-render တိုင်းပြီးနောက်မှာ resubscribe ဖြစ်တာ သတိပြုမိပါလိမ့်မယ်။ Resubscribing က မြန်ပေမယ့် — ဒီလောက် မကြာခဏ လုပ်တာကို ရှောင်နိုင်ရင် ပိုကောင်းပါတယ်။

ပိုကောင်းတဲ့ ပြုပြင်မှုက — `handleMove` function ကို Effect ရဲ့ *အတွင်းဘက်* ကို ရွှေ့ခြင်းပါ။ ဒါဆိုရင် `handleMove` က reactive value မဟုတ်တော့ဘဲ — သင့် Effect က function တစ်ခုကို မမှီခိုတော့ပါဘူး။ အဲဒီအစား — သင့် code က အခု Effect ရဲ့ အတွင်းကနေ ဖတ်တဲ့ `canMove` ကိုပဲ မှီခိုဖို့ လိုပါလိမ့်မယ်။ ဒါက သင်လိုချင်တဲ့ အပြုအမူနဲ့ ကိုက်ညီပါတယ် — သင့် Effect က အခု `canMove` ရဲ့ တန်ဖိုးနဲ့ ထပ်တူကျနေမှာမို့ပါ:

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Effect body ရဲ့ အတွင်းမှာ `console.log('Resubscribing')` ထည့်ကြည့်ပြီး — အခု checkbox ကို toggle လုပ်တဲ့အခါ (`canMove` ပြောင်းတဲ့အခါ) ဒါမှမဟုတ် code ကို တည်းဖြတ်တဲ့အခါမှပဲ resubscribe ဖြစ်တာ သတိပြုပါ။ ဒါက အမြဲတမ်း resubscribe လုပ်တဲ့ အရင်နည်းလမ်းထက် ပိုကောင်းစေပါတယ်။

ဒီလိုမျိုး ပြဿနာအတွက် ပိုယေဘုယျကျတဲ့ နည်းလမ်းတစ်ခုကို [Separating Events from Effects](/docs/react/separating-events-from-effects) မှာ သင်ယူရပါလိမ့်မယ်။

### Connection Switch တစ်ခုကို ပြုပြင်ခြင်း

ဒီဥပမာမှာ — `chat.js` ထဲက chat service က API မတူညီတာ နှစ်ခုကို ထုတ်ဖော်ပါတယ်: `createEncryptedConnection` နဲ့ `createUnencryptedConnection`။ Root `App` component က အသုံးပြုသူကို encryption သုံးမသုံး ရွေးချယ်ခွင့် ပေးပြီး — သက်ဆိုင်ရာ API method ကို child `ChatRoom` component ဆီ `createConnection` prop အဖြစ် အောက်ကို ပို့ပေးပါတယ်။

အစပိုင်းမှာ — console logs တွေက connection က encrypted မဟုတ်ဘူးလို့ ပြောတာ သတိပြုပါ။ Checkbox ကို toggle ဖွင့်ကြည့်ပါ: ဘာမှ ဖြစ်မလာပါဘူး။ ဒါပေမယ့် — အဲဒီနောက်မှာ ရွေးထားတဲ့ room ကို ပြောင်းလိုက်ရင် — chat က ပြန်ချိတ်ဆက်ပြီး *encryption ကိုပါ ဖွင့်* ပါလိမ့်မယ် (console messages တွေကနေ မြင်ရပါလိမ့်မယ်)။ ဒါက bug တစ်ခုပါ။ Checkbox ကို toggle လုပ်တာက chat ကို *လည်း* ပြန်ချိတ်ဆက်စေအောင် — bug ကို ပြုပြင်ပါ။

> **အရိပ်အမြွက်:** Linter ကို ဖိနှိပ်တာက အမြဲတမ်း သံသယဖြစ်စရာပါ။ ဒါက bug တစ်ခု ဖြစ်နိုင်လား?

```js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```
```js
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```
```js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```
```css
label { display: block; margin-bottom: 10px; }
```

#### အဖြေ

Linter suppression ကို ဖယ်လိုက်ရင် — lint error တစ်ခု မြင်ရပါလိမ့်မယ်။ ပြဿနာက — `createConnection` က prop တစ်ခုဖြစ်တာမို့ — reactive value တစ်ခုပါ။ အချိန်နဲ့အမျှ ပြောင်းလဲနိုင်ပါတယ်! (ပြီးတော့ — သူ *ပြောင်းသင့်တယ်* — အသုံးပြုသူက checkbox ကို tick လုပ်တဲ့အခါ — parent component က `createConnection` prop ရဲ့ တန်ဖိုးမတူတာတစ်ခုကို ပို့ပေးပါတယ်။) ဒါကြောင့် — dependency တစ်ခု ဖြစ်သင့်ပါတယ်။ Bug ကို ပြုပြင်ဖို့ — အဲဒါကို စာရင်းထဲ ထည့်ပါ:

```js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```
```js
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```
```js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```
```css
label { display: block; margin-bottom: 10px; }
```

`createConnection` က dependency တစ်ခုဖြစ်တာ မှန်ပါတယ်။ ဒါပေမယ့် — တစ်စုံတစ်ယောက်က `App` component ကို ပြင်ပြီး — ဒီ prop ရဲ့ တန်ဖိုးအဖြစ် inline function တစ်ခု ပို့လိုက်ရင် — ဒီ code က နည်းနည်း ပျက်စီးလွယ်ပါတယ်။ အဲဒီကိစ္စမှာ — `App` component re-render တိုင်း — သူ့ရဲ့ တန်ဖိုးက မတူညီပါလိမ့်မယ် — ဒါကြောင့် Effect က မကြာခဏ re-synchronize ဖြစ်နိုင်ပါတယ်။ ဒါကို ရှောင်ဖို့ — `isEncrypted` ကို အောက်ကို ပို့ပေးနိုင်ပါတယ်:

```js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```
```js
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```
```js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```
```css
label { display: block; margin-bottom: 10px; }
```

ဒီဗားရှင်းမှာ — `App` component က function တစ်ခုအစား boolean prop တစ်ခုကို ပို့ပေးပါတယ်။ Effect ရဲ့ အတွင်းမှာ — ဘယ် function ကို သုံးရမလဲဆိုတာ သင်ဆုံးဖြတ်ပါတယ်။ `createEncryptedConnection` ရော `createUnencryptedConnection` ရော နှစ်ခုလုံး component ရဲ့ အပြင်မှာ ကြေညာထားတာမို့ — reactive မဟုတ်ဘဲ — dependencies တွေ ဖြစ်ဖို့ မလိုပါဘူး။ ဒီအကြောင်း [Removing Effect Dependencies](/docs/react/removing-effect-dependencies) မှာ ပိုလေ့လာရပါမယ်။

### Select Boxes တစ်ကွင်းဆက် ဖြည့်သွင်းခြင်း

ဒီဥပမာမှာ — select box နှစ်ခု ရှိပါတယ်။ Select box တစ်ခုက အသုံးပြုသူကို ဂြိုဟ်တစ်စင်း ရွေးခွင့် ပေးပါတယ်။ နောက် select box တစ်ခုက အသုံးပြုသူကို *အဲဒီဂြိုဟ်ပေါ်မှာ* နေရာတစ်ခု ရွေးခွင့် ပေးပါတယ်။ ဒုတိယ box က မအလုပ်လုပ်သေးပါဘူး။ ရွေးထားတဲ့ ဂြိုဟ်ပေါ်က နေရာတွေကို ပြစေဖို့က သင့်တာဝန်ပါ။

ပထမ select box ဘယ်လို အလုပ်လုပ်လဲ ကြည့်ပါ။ အဲဒါက `"/planets"` API ခေါ်မှုရဲ့ ရလဒ်နဲ့ `planetList` state ကို ဖြည့်ပေးပါတယ်။ လက်ရှိ ရွေးထားတဲ့ ဂြိုဟ်ရဲ့ ID ကို `planetId` state variable ထဲမှာ သိမ်းထားပါတယ်။ `"/planets/" + planetId + "/places"` API ခေါ်မှုရဲ့ ရလဒ်နဲ့ `placeList` state variable ကို ဖြည့်ပေးဖို့ — code အပိုတစ်ချို့ ဘယ်မှာ ထည့်ရမလဲ ရှာဖို့ လိုပါတယ်။

ဒါကို မှန်မှန်ကန်ကန် implement လုပ်ရင် — ဂြိုဟ်တစ်စင်း ရွေးတာက place list ကို ဖြည့်ပေးသင့်ပါတယ်။ ဂြိုဟ်ပြောင်းတာက place list ကို ပြောင်းသင့်ပါတယ်။

> **အရိပ်အမြွက်:** သီးခြားလွတ်လပ်တဲ့ synchronization process နှစ်ခု ရှိရင် — Effect သီးခြားနှစ်ခု ရေးဖို့ လိုပါတယ်။

```js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```
```js
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```
```css
label { display: block; margin-bottom: 10px; }
```

#### အဖြေ

သီးခြားလွတ်လပ်တဲ့ synchronization process နှစ်ခု ရှိပါတယ်:

- ပထမ select box က ဂြိုဟ်တွေရဲ့ remote list နဲ့ ထပ်တူပြုထားပါတယ်။
- ဒုတိယ select box က လက်ရှိ `planetId` အတွက် နေရာတွေရဲ့ remote list နဲ့ ထပ်တူပြုထားပါတယ်။

ဒါကြောင့် — သူတို့ကို Effect သီးခြားနှစ်ခုအဖြစ် ဖော်ပြတာ အဓိပ္ပာယ်ရှိပါတယ်။ ဒီလိုလုပ်နိုင်တဲ့ ဥပမာတစ်ခုပါ:

```js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Nothing is selected in the first box yet
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // Select the first place
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```
```js
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```
```css
label { display: block; margin-bottom: 10px; }
```

ဒီ code က နည်းနည်း ထပ်ခါထပ်ခါ ဖြစ်နေပါတယ်။ ဒါပေမယ့် — ဒါက ဒါတွေကို Effect တစ်ခုတည်းထဲ ပေါင်းစပ်ဖို့ ကောင်းတဲ့ အကြောင်းပြချက် မဟုတ်ပါဘူး! ဒီလိုလုပ်ရင် — Effect နှစ်ခုရဲ့ dependencies တွေကို စာရင်းတစ်ခုတည်းထဲ ပေါင်းရပြီး — ဂြိုဟ်တစ်စင်း ပြောင်းတာက ဂြိုဟ်တွေရဲ့ စာရင်းတစ်ခုလုံးကို ပြန် refetch ဖြစ်စေပါလိမ့်မယ်။ Effects တွေက code reuse အတွက် tool တစ်ခု မဟုတ်ပါဘူး။

အဲဒီအစား — repetition ကို လျှော့ချဖို့ — အောက်က `useSelectOptions` လိုမျိုး custom Hook တစ်ခုထဲ logic တချို့ကို ထုတ်ယူနိုင်ပါတယ်:

```js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
    </>
  );
}
```
```js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```
```js
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```
```css
label { display: block; margin-bottom: 10px; }
```

Sandbox ထဲက `useSelectOptions.js` tab ကို စစ်ဆေးပြီး ဘယ်လို အလုပ်လုပ်လဲ ကြည့်ပါ။ အကောင်းဆုံးကတော့ — သင့် application ထဲက Effects အများစုကို နောက်ဆုံးမှာ custom Hooks တွေနဲ့ အစားထိုးသင့်ပါတယ် — သင်ကိုယ်တိုင် ရေးတာပဲဖြစ်ဖြစ် community က ရေးတာပဲ ဖြစ်ဖြစ်ပေါ့။ Custom Hooks တွေက synchronization logic ကို ဝှက်ထားတာမို့ — ခေါ်တဲ့ component က Effect အကြောင်း မသိပါဘူး။ သင့် app ပေါ်မှာ ဆက်အလုပ်လုပ်နေတာနဲ့အမျှ — ရွေးချယ်စရာ Hooks တွေရဲ့ palette တစ်ခုကို တည်ဆောက်မိပါလိမ့်မယ် — နောက်ဆုံးမှာ သင့် components တွေထဲမှာ Effects တွေ ရေးဖို့ မကြာခဏ မလိုတော့ပါဘူး။
