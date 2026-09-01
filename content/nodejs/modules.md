---
title: "Modules အခြေခံ"
description: "CommonJS နဲ့ ES modules ကွာခြားပုံ၊ require()/module.exports နဲ့ import/export သုံးနည်း၊ module caching နဲ့ module type တွေ"
order: 2
source: "https://nodejs.org/api/modules.html"
status: translated
updated: 2026-09-01
---

## Module ဆိုတာ ဘာလဲ

**Module** ဆိုတာ — သီးခြား ဖိုင်တစ်ဖိုင်ထဲ ရေးထားတဲ့ JavaScript code အပိုင်းအစ တစ်ခုပါ။ Node.js မှာ **file တိုင်းက module တစ်ခု** ဖြစ်ပါတယ်။ Module က code ကို နှစ်မျိုး အကျိုးပြုပါတယ်:

- **Encapsulation (ဖုံးအုပ်ထားခြင်း)** — module ထဲက variable တွေက သူ့အတွင်းမှာပဲ ရှိနေပြီး ကိုယ် export လုပ်ထားတာတွေကိုပဲ အပြင်က သုံးလို့ရပါတယ်။ ဒါကြောင့် global scope ကို ညစ်ပတ်အောင် မလုပ်ဘဲ code တွေ ပဋိပက္ခ မဖြစ်အောင် ကာကွယ်ပေးပါတယ်။
- **Reuse (ပြန်သုံးခြင်း)** — ရေးထားပြီးသား module ကို နေရာမျိုးစုံမှာ ပြန်သုံးလို့ရပြီး code duplicate လုပ်စရာ မလိုတော့ပါဘူး။

Node.js မှာ module system နှစ်မျိုး ရှိပါတယ် — Node.js ရဲ့ မူရင်းစနစ်ဖြစ်တဲ့ **CommonJS** နဲ့ browser တွေမှာ standard ဖြစ်တဲ့ **ES modules (ESM)** တို့ပါ။

## CommonJS — require() နဲ့ module.exports

CommonJS မှာ **`require()`** နဲ့ module ကို ယူပြီး **`module.exports`** (အတိုကောက် `exports`) နဲ့ အပြင်ကို ထုတ်ပေးပါတယ်။ ဥပမာ — စက်ဝိုင်းရဲ့ area နဲ့ circumference တွက်တဲ့ module တစ်ခု ဆောက်ကြည့်ရအောင်:

```js
// circle.js
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```

`exports.area` လို့ ရေးတာက `module.exports.area` ရဲ့ အတိုကောက်ပါ။ `PI` variable ကတော့ module ထဲမှာပဲ ရှိနေပြီး အပြင်ကနေ မမြင်ရပါဘူး။ အခု ဒီ module ကို တခြား file ကနေ သုံးကြည့်ရအောင်:

```js
// foo.js
const circle = require('./circle.js');
console.log(`The area of a circle of radius 4 is ${circle.area(4)}`);
```

`require('./circle.js')` က circle.js ထဲက export လုပ်ထားတဲ့ အရာတွေကို ပြန်ပေးပါတယ်။ သတိထားစရာ — class လိုမျိုး export ကို တစ်ခုလုံး အစားထိုးချင်ရင် `exports` ကို တိုက်ရိုက် assign မလုပ်ဘဲ **`module.exports`** ကို assign လုပ်ရပါတယ် — `exports` က reference သက်သက်မို့ `exports = ...` ရေးရင် အလုပ်မဖြစ်ပါဘူး။

## ES Modules — import နဲ့ export

ES modules မှာတော့ **`import`** နဲ့ **`export`** syntax ကို သုံးပါတယ်။ Named export (`export function`) နဲ့ default export (`export default`) နှစ်မျိုးစလုံး ရှိပါတယ် — ဒီ code block မှာ file နှစ်ခု ပါပါတယ်။ `utils.mjs` က export ဘက်၊ `app.mjs` က import လုပ်ပြီး သုံးတဲ့ ဘက်ပါ:

```js
// utils.mjs — export ဘက်
export function add(a, b) {
  return a + b;
}

export default function greet(name) {
  return `Hello, ${name}`;
}

// app.mjs — import လုပ်ပြီး သုံးတဲ့ ဘက်
import greet, { add } from './utils.mjs';

console.log(add(2, 3)); // 5
console.log(greet('Node.js'));
```

Default export ကို နာမည်ဘာပဲပေးပြီး import လုပ်လို့ရပြီး — named export တွေကိုတော့ `{ add }` လိုမျိုး curly braces နဲ့ ယူရပါတယ်။

## Module Caching

Module တွေကို **ပထမဆုံး အကြိမ် load ပြီးတာနဲ့ cache လုပ်ထားပါတယ်**။ ဆိုလိုတာက — တူညီတဲ့ file ကို `require('foo')` နဲ့ အကြိမ်များစွာ ခေါ်ရင် module code က ထပ်ခါထပ်ခါ run မဖြစ်တော့ဘဲ **တူညီတဲ့ object ကိုပဲ ပြန်ရပါတယ်**။ Cache ကို module ရဲ့ resolved filename နဲ့ ခွဲထားလို့ — ခေါ်တဲ့နေရာ အလိုက် resolve ရတဲ့ file ကွဲရင် object လည်း ကွဲနိုင်ပါတယ်။ Module code ကို ထပ်ခါထပ်ခါ run စေချင်ရင် function တစ်ခုကို export လုပ်ပြီး အဲဒီ function ကို ခေါ်ရပါတယ်။

## Module Types — .js, .mjs, .cjs

File extension ပေါ်မူတည်ပြီး module system ကို Node.js က ဆုံးဖြတ်ပါတယ်:

- **`.cjs`** — အမြဲတမ်း CommonJS
- **`.mjs`** — အမြဲတမ်း ES module
- **`.js`** — ပုံမှန်အားဖြင့် CommonJS; ဒါပေမယ့် အနီးဆုံး `package.json` မှာ `"type": "module"` ရှိရင် ES module အနေနဲ့ ကိုင်တွယ်ပါတယ်

```json
{
  "name": "my-app",
  "type": "module"
}
```

ဒီလို `package.json` ရှိတဲ့ project ထဲက `.js` file တွေကို ES module အဖြစ် သုံးနိုင်ပါတယ်။ `"type": "commonjs"` (သို့) `"type"` လုံးဝ မပါရင်တော့ CommonJS ဖြစ်နေမှာပါ။

## ဆက်ဖတ်ရန်

- [Event Loop](/docs/nodejs/event-loop) — module ရဲ့ code ကို Node.js က ဘယ်လို run ပေးသလဲ
- [Async Programming](/docs/nodejs/async-programming) — callback နဲ့ promise ကို module တွေနဲ့ တွဲသုံးခြင်း
- [npm အခြေခံ](/docs/nodejs/npm-basics) — package တွေကို install လုပ်ပြီး module အနေနဲ့ သုံးခြင်း
