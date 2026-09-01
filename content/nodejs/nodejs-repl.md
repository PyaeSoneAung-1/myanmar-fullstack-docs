---
title: "Node.js REPL"
description: "Node.js REPL ဆိုတာ ဘာလဲ၊ REPL session စတင်သုံးနည်း၊ `_` special variable နဲ့ dot commands၊ JavaScript file ထဲကနေ REPL သုံးနည်း"
order: 8
source: "https://nodejs.org/en/learn/command-line/how-to-use-the-nodejs-repl"
status: translated
updated: 2026-09-01
---

## Node.js REPL ဆိုတာ ဘာလဲ

Node.js မှာ built-in REPL (Read-Eval-Print Loop) environment ပါဝင်ပြီး — JavaScript code တွေကို interactive အနေနဲ့ execute လုပ်နိုင်ပါတယ်။ REPL ကို terminal ကနေ သုံးလို့ရပြီး code အပိုင်းအစငယ်လေးတွေကို စမ်းသပ်ဖို့ အလွန် ကောင်းပါတယ်။

## Node.js REPL ကို ဘယ်လို သုံးမလဲ

`node` command က ကျွန်တော်တို့ Node.js scripts တွေကို run ဖို့ သုံးတဲ့ command ပါ:

```bash
node script.js
```

`node` command ကို — run လို့ရမယ့် script မရှိဘဲ၊ argument မပါဘဲ — run လိုက်ရင် REPL session တစ်ခု စတင်ပါတယ်:

```bash
node
```

> **Note:** `REPL` ဆိုတာ Read Evaluate Print Loop ရဲ့ အတိုကောက်ဖြစ်ပြီး — programming language environment (အခြေခံအားဖြင့် console window တစ်ခု) ပါ။ User input အနေနဲ့ expression တစ်ခုချင်းစီကို ယူပြီး execute လုပ်ပြီးတဲ့အခါ ရလဒ်ကို console ဆီ ပြန်ပို့ပေးပါတယ်။ REPL session က ရိုးရှင်းတဲ့ JavaScript code တွေကို မြန်မြန်ဆန်ဆန် စမ်းသပ်ဖို့ အဆင်ပြေတဲ့ နည်းလမ်းတစ်ခုပါ။

အခု သင့် terminal မှာ စမ်းကြည့်ရင် — ဒီလို ဖြစ်ပါလိမ့်မယ်:

```bash
❯ node
>
```

Command က idle mode မှာ ရပ်နေပြီး ကျွန်တော်တို့ တစ်ခုခု ရိုက်ထည့်ဖို့ စောင့်နေပါတယ်။

> **Tip:** terminal ဘယ်လို ဖွင့်ရမလဲ မသေချာရင် "How to open terminal on your-operating-system" လို့ google လုပ်ကြည့်ပါ။

ပိုတိကျပြောရရင် REPL က JavaScript code တချို့ ရိုက်ထည့်ဖို့ စောင့်နေတာပါ။

ရိုးရိုးကလေး စပြီး ဒီလို ရိုက်ထည့်ကြည့်ပါ:

```console
> console.log('test')
test
undefined
>
```

ပထမဆုံး value ဖြစ်တဲ့ `test` က console ပေါ် print လုပ်ဖို့ ကျွန်တော်တို့ ပြောထားတဲ့ output ဖြစ်ပြီး — နောက်မှ ရလာတဲ့ `undefined` ကတော့ `console.log()` run လိုက်လို့ ပြန်ရတဲ့ return value ပါ။ Node က ဒီ code line ကို ဖတ်တယ် (Read), evaluate လုပ်တယ် (Evaluate), ရလဒ်ကို print လုပ်တယ် (Print) — ပြီးတော့ နောက် code lines တွေ အတွက် ပြန်စောင့်နေတယ် (Loop)။ REPL session ကနေ မထွက်မချင်း Node က ဒီအဆင့် သုံးခုကို ကျွန်တော်တို့ execute လုပ်တဲ့ code တိုင်းအတွက် loop လုပ်သွားပါတယ်။ REPL ဆိုတဲ့ နာမည် ဒီကနေ ရလာတာပါ။

Node က JavaScript code line တိုင်းရဲ့ ရလဒ်ကို — ပြောစရာမလိုဘဲ — အလိုအလျောက် print ပေးပါတယ်။ ဥပမာ — ဒီ line ကို ရိုက်ပြီး enter နှိပ်ကြည့်ပါ:

```console
> 5 === '5'
false
>
```

အထက်က နှစ်ကြောင်းရဲ့ outputs တွေ ကွာတာကို သတိပြုပါ။ `console.log()` execute လုပ်ပြီးနောက် Node REPL က `undefined` ကို print လုပ်ခဲ့ပြီး — `5 === '5'` ကတော့ ရလဒ်ကိုပဲ print လုပ်ပါတယ်။ ရှေ့က တစ်ခုက JavaScript ထဲက statement ဖြစ်ပြီး နောက်တစ်ခုက expression ဖြစ်တယ်ဆိုတာ မှတ်ထားဖို့ လိုပါတယ်။

တစ်ခါတလေ စမ်းချင်တဲ့ code က line များစွာ လိုအပ်နိုင်ပါတယ်။ ဥပမာ — random number တစ်ခု ထုတ်ပေးတဲ့ function တစ်ခု သတ်မှတ်ချင်တယ်ဆိုပါစို့၊ REPL session ထဲမှာ ဒီ line ကို ရိုက်ပြီး enter နှိပ်ပါ:

```console
function generateRandom() {
...
```

Node REPL က သင့် code မပြီးသေးဘူးဆိုတာ သိလောက်အောင် လိမ္မာပါတယ် — နောက်ထပ် code တွေ ရိုက်ဖို့ multi-line mode ထဲ ဝင်သွားပါတယ်။ အခု function definition ကို ပြီးအောင် ရေးပြီး enter နှိပ်ပါ:

```console
function generateRandom() {
...return Math.random()
}
undefined
```

### `_` special variable

Code တချို့ ပြီးတဲ့နောက် `_` လို့ ရိုက်လိုက်ရင် — နောက်ဆုံး operation ရဲ့ ရလဒ်ကို print ပေးပါတယ်။

### Up arrow key

`up` arrow key ကို နှိပ်လိုက်ရင် — လက်ရှိ session နဲ့ အရင် REPL sessions တွေထဲမှာ run ခဲ့ဖူးတဲ့ code lines တွေရဲ့ history ကို ပြန်ကြည့်လို့ရပါတယ်။

### Dot commands

REPL မှာ special commands တွေ ရှိပြီး — အားလုံးက dot `.` နဲ့ စပါတယ်။ သူတို့ကတော့:

- `.help`: dot commands တွေရဲ့ help ကို ပြပေးပါတယ်။
- `.editor`: multiline JavaScript code ရေးဖို့ editor mode ထဲ ဝင်ပါတယ်။
- `.break` / `.clear`: functions လိုမျိုး multi-line code တွေကနေ ထွက်ပါတယ်။ CTRL-C နှိပ်တာနဲ့ အတူတူပါ။
- `.load`: JavaScript file တစ်ခုကို — လက်ရှိ working directory နဲ့ ဆက်စပ်ပြီး — load လုပ်ပါတယ်။
- `.save`: session ထဲမှာ ရိုက်ထည့်ခဲ့သမျှ commands တွေကို file တစ်ခုထဲ သိမ်းပါတယ်။
- `.exit`: REPL ကနေ ထွက်ပါတယ် (CTRL-C နှစ်ခါ နှိပ်တာနဲ့ အတူတူပါ)။

`.editor` ကို မခေါ်ဘဲနဲ့တောင် REPL က သင် multi-line statement တစ်ခု ရိုက်နေတယ်ဆိုတာ သိပါတယ်။

ဥပမာ — ဒီလို iteration တစ်ခု စရိုက်ရင်:

```console
[1, 2, 3].forEach(num => {
```

ပြီးတော့ `enter` နှိပ်လိုက်ရင် REPL က dots ၃ လုံးနဲ့ စတဲ့ line အသစ်တစ်ခုကို သွားပါတယ် — အဲဒီ block ပေါ်မှာ ဆက်အလုပ်လုပ်လို့ရပြီဆိုတဲ့ အဓိပ္ပါယ်ပါ။

```console
... console.log(num)
... })
```

Line တစ်ကြောင်းရဲ့ အဆုံးမှာ `.break` လို့ ရိုက်လိုက်ရင် — multiline mode ရပ်သွားပြီး statement က execute မဖြစ်တော့ပါဘူး။

### JavaScript file ကနေ REPL run ခြင်း

`repl` module ကို သုံးပြီး JavaScript file တစ်ခုထဲမှာ REPL ကို import လုပ်နိုင်ပါတယ်:

```cjs
const repl = require('node:repl');
```

repl variable ကို သုံးပြီး လုပ်ဆောင်ချက် အမျိုးမျိုး လုပ်နိုင်ပါတယ်။ REPL command prompt စတင်ဖို့ ဒီ line ကို ရိုက်ပါ:

```js
repl.start();
```

File ကို command line မှာ run ပါ:

```bash
node repl.js
```

REPL စတင်တဲ့အခါ ပြမယ့် string တစ်ခုကို ပေးနိုင်ပါတယ်။ Default က `'> '` (နောက်မှာ space ပါ) ဖြစ်ပေမယ့် custom prompt သတ်မှတ်လို့ရပါတယ်:

```js
// Unix style prompt တစ်ခု
const local = repl.start('$ ');
```

REPL ကနေ ထွက်တဲ့အခါ message တစ်ခု ပြဖို့လည်း ရပါတယ်:

```js
local.on('exit', () => {
  console.log('exiting repl');
  process.exit();
});
```

REPL module အကြောင်း အသေးစိတ်ကို [repl documentation](https://nodejs.org/api/repl.html) မှာ ဖတ်နိုင်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Command line ကနေ scripts run ခြင်း](/docs/nodejs/run-nodejs-scripts) — `node` command နဲ့ script run နည်း
- [Node.js မိတ်ဆက်](/docs/nodejs/getting-started) — installation နဲ့ ပထမဆုံး script
