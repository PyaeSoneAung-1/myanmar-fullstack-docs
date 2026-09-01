---
title: "process.nextTick() ကို နားလည်ခြင်း"
description: "process.nextTick() ဆိုတာ ဘာလဲ၊ tick ဆိုတာ ဘာလဲ၊ လက်ရှိ call stack ပြီးတာနဲ့ ချက်ချင်း callback စီစဉ်ပုံ၊ setTimeout(() => {}, 0) နဲ့ ကွာခြားချက်"
order: 21
source: "https://nodejs.org/en/learn/asynchronous-work/understanding-processnexttick"
status: translated
updated: 2026-09-01
---

## process.nextTick() ကို နားလည်ခြင်း

Node.js event loop ကို နားလည်ဖို့ ကြိုးစားတဲ့အခါ — အဲဒီထဲက အရေးကြီးတဲ့ အစိတ်အပိုင်းတစ်ခုက `process.nextTick()` ပါ။ Runtime က event တစ်ခုအတွက် JavaScript ဆီ ပြန်ခေါ်တိုင်း (call back into) — အဲဒါကို **tick** တစ်ခုလို့ ခေါ်ပါတယ်။

`process.nextTick()` ဆီ function တစ်ခုကို ပေးလိုက်တဲ့အခါ — လက်ရှိ call stack ပြီးစီးပြီးချင်း၊ event loop မဆက်ခင် နဲ့ တခြား queue လုပ်ထားတဲ့ tasks တွေ ဒါမှမဟုတ် phases တွေကို မလုပ်ဆောင်ခင် — ချက်ချင်း run ဖို့ စီစဉ်ပေးလိုက်တာ ဖြစ်ပါတယ်:

```js
process.nextTick(() => {
  // do something
});
```

Event loop က လက်ရှိ function code တွေကို လုပ်ဆောင်နေပါတယ်။ ဒီ operation ပြီးဆုံးတဲ့အခါ — JS engine က အဲဒီ operation အတွင်းမှာ `nextTick` calls တွေကနေ ပေးထားခဲ့တဲ့ functions အားလုံးကို run ပေးပါတယ်။

ဒါက JS engine ကို function တစ်ခုကို asynchronously (လက်ရှိ function ပြီးမှ) လုပ်ဆောင်ဖို့ — ဒါပေမယ့် တတ်နိုင်သမျှ အမြန်ဆုံး လုပ်ဆောင်ဖို့ ပြောတဲ့ နည်းလမ်းတစ်ခုပါ။ Queue ထဲ ထည့်ထားတာမျိုး မဟုတ်ပါဘူး။

`setTimeout(() => {}, 0)` ကိုခေါ်တာက callback ကို အနာဂတ် event loop iteration တစ်ခုအတွက် စီစဉ်ပေးတာပါ — `process.nextTick()` သုံးရင် event loop မဆက်ခင် execute ဖြစ်တာနဲ့ ယှဉ်ရင် အများကြီး နောက်ကျပါတယ်။

နောက် event loop iteration မှာ အဲဒီ code ကို သေချာပေါက် execute ဖြစ်ပြီးသား ဖြစ်စေချင်တဲ့အခါ `nextTick()` ကို သုံးပါ။

Execution order နဲ့ event loop အလုပ်လုပ်ပုံအကြောင်း ပိုပြီး လေ့လာချင်ရင် — [Event Loop](/docs/nodejs/event-loop) အကြောင်း ဆောင်းပါးကို ကြည့်ပါ။
