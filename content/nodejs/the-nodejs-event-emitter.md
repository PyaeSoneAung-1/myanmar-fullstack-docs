---
title: "Node.js Event Emitter"
description: "events module နဲ့ EventEmitter class — on/emit နဲ့ event တွေကို ကိုင်တွယ်နည်း၊ event handler ဆီ argument တွေ ပို့နည်း၊ once/removeListener/off/removeAllListeners အကြောင်း"
order: 20
source: "https://nodejs.org/en/learn/asynchronous-work/the-nodejs-event-emitter"
status: translated
updated: 2026-09-01
---

## Node.js Event Emitter

သင် browser မှာ JavaScript နဲ့ အလုပ်လုပ်ဖူးရင် — user ရဲ့ အပြန်အလှန် ဆက်သွယ်မှုတွေ ဘယ်လောက်များပြားတဲ့ events တွေကနေ ကိုင်တွယ်ခံရလဲဆိုတာ သိပါလိမ့်မယ်: mouse clicks၊ keyboard button presses၊ mouse movements တွေကို တုံ့ပြန်တာတွေ စသဖြင့်ပေါ့။

Backend ဘက်မှာတော့ Node.js က — `events` module ကို သုံးပြီး အလားတူ system တစ်ခု တည်ဆောက်ဖို့ ရွေးချယ်ခွင့် ပေးထားပါတယ်။

ဒီ module က ကျွန်တော်တို့ရဲ့ events တွေကို ကိုင်တွယ်ဖို့ သုံးမယ့် `EventEmitter` class ကို ပေးပါတယ်။

အဲဒါကို ဒီလို စတင်သတ်မှတ်ပါတယ်:

```js
const EventEmitter = require('node:events');

const eventEmitter = new EventEmitter();
```

ဒီ object က တခြားအရာတွေထဲမှာ `on` နဲ့ `emit` methods တွေကို ဖော်ထုတ်ပေးပါတယ်။

- `emit` က event တစ်ခုကို စတင်ဖို့ (trigger) သုံးပါတယ်

- `on` က event စတင်တဲ့အခါ execute လုပ်မယ့် callback function တစ်ခုကို ထည့်ဖို့ သုံးပါတယ်

ဥပမာ — `start` event တစ်ခု ဖန်တီးပြီး — နမူနာပြချင်လို့ console မှာ log ရုံလေး တုံ့ပြန်ကြည့်ရအောင်:

```js
eventEmitter.on('start', () => {
  console.log('started');
});
```

ဒီလို run လိုက်တဲ့အခါ

```js
eventEmitter.emit('start');
```

event handler function က trigger ဖြစ်ပြီး — console log ကို ရပါတယ်။

`emit()` ဆီ နောက်ထပ် arguments တွေအနေနဲ့ ပို့ခြင်းအားဖြင့် — event handler ဆီ arguments တွေ ပို့နိုင်ပါတယ်:

```js
eventEmitter.on('start', number => {
  console.log(`started ${number}`);
});

eventEmitter.emit('start', 23);
```

Arguments အများကြီးဆိုရင်:

```js
eventEmitter.on('start', (start, end) => {
  console.log(`started from ${start} to ${end}`);
});

eventEmitter.emit('start', 1, 100);
```

EventEmitter object က events တွေနဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့ တခြား methods တွေလည်း အများကြီး ဖော်ထုတ်ပေးပါသေးတယ်၊ ဥပမာ:

- `once()`: တစ်ကြိမ်သာ run မယ့် one-time listener တစ်ခုကို ထည့်ခြင်း

- `removeListener()` / `off()`: event တစ်ခုကနေ event listener တစ်ခုကို ဖယ်ရှားခြင်း

- `removeAllListeners()`: event တစ်ခုအတွက် listeners အားလုံးကို ဖယ်ရှားခြင်း

ဒီ methods တွေအကြောင်း ပိုပြီး သိချင်ရင် [တရားဝင် documentation](https://nodejs.org/api/events.html) မှာ ဖတ်နိုင်ပါတယ်။
