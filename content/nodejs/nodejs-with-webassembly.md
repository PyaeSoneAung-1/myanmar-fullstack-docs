---
title: "Node.js နဲ့ WebAssembly"
description: "WebAssembly (.wasm) module တွေကို Node.js မှာ instantiate လုပ်ပြီး အသုံးပြုနည်း — key concepts, module ဖန်တီးနည်းများ နဲ့ OS နဲ့ အပြန်အလှန် ဆက်သွယ်ခြင်း"
order: 45
source: "https://nodejs.org/learn/getting-started/nodejs-with-webassembly"
status: translated
updated: 2026-09-02
---

## Node.js နဲ့ WebAssembly

**WebAssembly** ဆိုတာ assembly language နဲ့ ဆင်တူပြီး — performance (စွမ်းဆောင်ရည်) မြင့်မားတဲ့ language တစ်ခုပါ။ C/C++, Rust နဲ့ AssemblyScript အပါအဝင် ဘာသာစကား အမျိုးမျိုးကနေ compile လုပ်လို့ရပါတယ်။ လောလောဆယ်မှာ Chrome, Firefox, Safari, Edge နဲ့ Node.js တို့မှာ support လုပ်ထားပါတယ်။

WebAssembly specification က file format နှစ်မျိုးကို သတ်မှတ်ပေးထားပါတယ် — `.wasm` extension နဲ့ **WebAssembly Module** လို့ခေါ်တဲ့ binary format တစ်မျိုး၊ ပြီးတော့ `.wat` extension နဲ့ **WebAssembly Text format** လို့ခေါ်တဲ့ သက်ဆိုင်ရာ text representation တစ်မျိုးပါ။

## Key Concepts (အဓိက သဘောတရားများ)

- **Module** — compile လုပ်ပြီးသား WebAssembly binary တစ်ခု၊ ဆိုလိုတာက `.wasm` file ပါ။
- **Memory** — resizable (အရွယ်အစား ပြောင်းလဲနိုင်တဲ့) ArrayBuffer တစ်ခု။
- **Table** — Memory ထဲမှာ မသိမ်းထားတဲ့ references တွေရဲ့ resizable typed array တစ်ခု။
- **Instance** — Module တစ်ခုကို သူ့ရဲ့ Memory, Table နဲ့ variables တွေနဲ့အတူ instantiation (အသက်သွင်း) လုပ်ထားတဲ့ ပုံစံတစ်ခု။

WebAssembly ကို သုံးဖို့ဆိုရင် — `.wasm` binary file တစ်ခုနဲ့ WebAssembly နဲ့ ဆက်သွယ်ပြောဆိုဖို့ APIs တစ်စုံ လိုအပ်ပါတယ်။ Node.js က ဒီ APIs တွေကို global `WebAssembly` object ကနေတစ်ဆင့် ပေးထားပါတယ်။

```js
console.log(WebAssembly);
/*
Object [WebAssembly] {
  compile: [Function: compile],
  validate: [Function: validate],
  instantiate: [Function: instantiate]
}
*/
```

## WebAssembly Modules ဖန်တီးခြင်း

WebAssembly binary files တွေကို ထုတ်လုပ်ဖို့ နည်းလမ်း အမျိုးမျိုး ရှိပါတယ်:

- WebAssembly (`.wat`) ကို ကိုယ်တိုင် ရေးပြီး [wabt](https://github.com/webassembly/wabt) လိုမျိုး tools တွေနဲ့ binary format အဖြစ် ပြောင်းခြင်း
- C/C++ application တစ်ခုကို [emscripten](https://emscripten.org/) နဲ့ သုံးခြင်း
- Rust application တစ်ခုကို [wasm-pack](https://rustwasm.github.io/wasm-pack/book/) နဲ့ သုံးခြင်း
- TypeScript နဲ့ ဆင်တူတဲ့ အတွေ့အကြုံကို ကြိုက်ရင် [AssemblyScript](https://www.assemblyscript.org/) ကို သုံးခြင်း

ဒီ tools တချို့က binary file ကိုသာမက — browser မှာ run ဖို့ JavaScript "glue" code တွေနဲ့ သက်ဆိုင်ရာ HTML files တွေကိုပါ ထုတ်ပေးပါတယ်။

## ဘယ်လို အသုံးပြုမလဲ

WebAssembly module တစ်ခု ရပြီဆိုတာနဲ့ — Node.js ရဲ့ `WebAssembly` object ကို သုံးပြီး အဲဒီ module ကို instantiate လုပ်နိုင်ပါတယ်။

```js
// add.wasm file မှာ argument ၂ ခု ပေါင်းပေးတဲ့ function တစ်ခု ပါတယ်လို့ ယူဆပါ
const fs = require('node:fs');

// "add.wasm" file ရဲ့ contents တွေကို ဖတ်ဖို့ readFileSync function ကို သုံးပါ
const wasmBuffer = fs.readFileSync('/path/to/add.wasm');

// WebAssembly module ကို instantiate လုပ်ဖို့ WebAssembly.instantiate method ကို သုံးပါ
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // Exported function တွေက instance.exports object အောက်မှာ ရှိပါတယ်
  const { add } = wasmModule.instance.exports;
  const sum = add(5, 6);
  console.log(sum); // Outputs: 11
});
```

## OS နဲ့ အပြန်အလှန် ဆက်သွယ်ခြင်း

WebAssembly modules တွေက OS ရဲ့ functionality တွေကို သူ့ဘာသာသူ တိုက်ရိုက် ဝင်ရောက်လို့ မရပါဘူး။ ဒီလို လုပ်ဆောင်နိုင်ဖို့ [Wasmtime](https://docs.wasmtime.dev/) ဆိုတဲ့ third-party tool တစ်ခုကို သုံးနိုင်ပါတယ်။ `Wasmtime` က OS functionality တွေဆီ ဝင်ရောက်ဖို့ [WASI](https://wasi.dev/) API ကို အသုံးပြုပါတယ်။

## ဆက်ဖတ်ရန် (Resources)

- [WebAssembly အကြောင်း ယေဘုယျ အချက်အလက်](https://webassembly.org/)
- [MDN Docs](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [WebAssembly ကို ကိုယ်တိုင် ရေးသားခြင်း](https://webassembly.github.io/spec/core/text/index.html)
