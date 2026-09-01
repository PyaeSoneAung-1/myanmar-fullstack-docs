---
title: "Node.js မိတ်ဆက်"
description: "Node.js ဆိုတာ ဘာလဲ၊ installation နဲ့ version check၊ REPL၊ ပထမဆုံး script၊ process.argv နဲ့ http module နဲ့ web server"
order: 1
source: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs"
status: translated
updated: 2026-09-01
---

## Node.js ဆိုတာ ဘာလဲ

**Node.js** က open-source ဖြစ်ပြီး cross-platform ဖြစ်တဲ့ **JavaScript runtime environment** တစ်ခုပါ။ Node.js က **Chrome ရဲ့ V8 JavaScript engine** ကို အခြေခံပြီး — browser ထဲမှာမဟုတ်ဘဲ **browser အပြင်ဘက်မှာ JavaScript run လို့ရအောင်** လုပ်ပေးတာဖြစ်ပါတယ်။ ဒါကြောင့် JavaScript တစ်မျိုးတည်းနဲ့ server-side code, command line tool, desktop app စတာတွေကို ရေးလို့ရပါတယ်။

Node.js ရဲ့ ထူးခြားချက် နှစ်ခုကတော့:

- **Event-driven** — event (ဖြစ်ရပ်) တွေပေါ်မူတည်ပြီး code run တယ်
- **Non-blocking I/O** — file ဖတ်တာ၊ network request လုပ်တာလို အလုပ်တွေက blocking မလုပ်ဘဲ အပြိုင် ဆက်လုပ်လို့ရတယ်

ဒါကြောင့် Node.js က concurrent request တွေ အများကြီးကို ကိုင်တွယ်ရတဲ့ web server နဲ့ API တွေအတွက် သင့်တော်ပါတယ်။ Frontend မှာ သုံးနေကျ JavaScript ကိုပဲ backend မှာပါ သုံးရတာမို့ — language နှစ်မျိုး မသင်ရဘဲ fullstack developer ဖြစ်လို့ရတာ Node.js ရဲ့ အားသာချက်တစ်ခုပါ။

## Installation နဲ့ Version Check

Node.js ကို nodejs.org ကနေ download လုပ်ပြီး install လုပ်ပါ။ အသုံးအများဆုံးက **LTS version** ဖြစ်ပြီး — production အတွက် အကြံပြုထားတာပါ။ Install ပြီးရင် terminal ထဲမှာ version စစ်ကြည့်ပါ:

```bash
node -v
```

ဒီ command က ဥပမာ `v22.x.x` လိုမျိုး install ဖြစ်နေတဲ့ Node.js version ကို ပြန်ပြပါတယ်။ npm ပါ ပါလာလားဆိုတာလည်း စစ်ကြည့်နိုင်ပါတယ်:

```bash
npm -v
```

## REPL — Command Line ပေါ်မှာ စမ်းသပ်ခြင်း

Terminal ထဲမှာ `node` လို့ရိုက်လိုက်ရင် **REPL** (Read-Eval-Print Loop) ထဲ ရောက်သွားပါတယ် — JavaScript ကို တစ်ကြောင်းချင်း ရိုက်ပြီး ချက်ချင်း run ကြည့်လို့ရတဲ့ နေရာပါ:

```bash
$ node
> 1 + 1
2
> console.log('Hello, Node.js!')
Hello, Node.js!
> .exit
```

REPL က quick test လုပ်ဖို့ ကောင်းပါတယ် — `.exit` ရိုက်ရင် (သို့) `Ctrl+C` နှစ်ခါ နှိပ်ရင် ထွက်လို့ရပါတယ်။

## ပထမဆုံး Script

File ထဲမှာ JavaScript ရေးပြီး run လုပ်တာက ပုံမှန် အလုပ်လုပ်ပုံပါ။ `hello.js` ဆိုတဲ့ file တစ်ခု ဖန်တီးပြီး အောက်ပါအတိုင်း ရေးပါ:

```js
// hello.js
console.log('Hello, World!');
```

ပြီးရင် terminal ထဲမှာ:

```bash
node hello.js
```

`Hello, World!` ဆိုပြီး output ထွက်လာပါလိမ့်မယ်။

## Command Line Arguments

Script run လုပ်တဲ့အခါ command line ကနေ argument တွေ ပို့လို့ရပြီး — `process.argv` array ထဲမှာ ရပါတယ်:

```js
// args.js
const args = process.argv.slice(2);
console.log('Args:', args);
```

```bash
node args.js a b c
# Args: [ 'a', 'b', 'c' ]
```

`process.argv[0]` က node ရဲ့ path၊ `process.argv[1]` က script file ရဲ့ path ဖြစ်လို့ — ကိုယ့်ရဲ့ argument တွေကို `slice(2)` နဲ့ ယူရပါတယ်။

## HTTP Server ဆောက်ခြင်း

Node.js ရဲ့ built-in `http` module နဲ့ web server ကို ရိုးရိုးရှင်းရှင်း ဆောက်လို့ရပါတယ် — framework တစ်ခုခု မလိုပါဘူး:

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!\n');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
```

`http.createServer` က request တိုင်းအတွက် callback ကို run ပြီး — ဒီမှာတော့ `text/plain` response နဲ့ "Hello, World!" ပြန်ပို့ပါတယ်။ Run လုပ်ပြီး `http://127.0.0.1:3000/` ကို ဖွင့်ကြည့်ရင် မြင်ရပါမယ်:

```bash
node server.js
```

## နောက်တစ်ဆင့်တွေ

- [Express စတင်ခြင်း](/docs/express/getting-started) — Node.js ပေါ်မှာ web framework နဲ့ app တည်ဆောက်ခြင်း
- npm, modules, file system စတာတွေကို official docs (nodejs.org/en/learn) မှာ ဆက်လေ့လာပါ
