---
title: "Node.js မှာ Command Line Input လက်ခံခြင်း"
description: "readline module နဲ့ command line ကနေ user input လက်ခံနည်း — readline.createInterface(), rl.question(), process.stdin အသုံးပြုပုံ"
order: 17
source: "https://nodejs.org/en/learn/command-line/accept-input-from-the-command-line-in-nodejs"
status: translated
updated: 2026-09-01
---

Node.js CLI program တစ်ခုကို interactive ဖြစ်အောင် ဘယ်လို လုပ်မလဲ?

Node.js က version 7 ကစပြီး — ဒီအတွက် အတိအကျ `readline` module ကို ပေးထားပါတယ်: `process.stdin` stream လိုမျိုး readable stream တစ်ခုကနေ — Node.js program တစ်ခု run နေစဉ်မှာ terminal input ဖြစ်တဲ့ stream ကနေ — line တစ်ကြောင်းချင်းစီ ရယူပေးပါတယ်။

```cjs
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`What's your name?`, name => {
  console.log(`Hi ${name}!`);
  rl.close();
});
```

ဒီ code က user ရဲ့ *နာမည်* ကို မေးပြီး — text ရိုက်ထည့်ပြီး enter နှိပ်လိုက်တာနဲ့ — နှုတ်ခွန်းဆက်စကား တစ်ခု ပို့ပေးပါတယ်။

`question()` method က ပထမ parameter (မေးခွန်း) ကို ပြပြီး user input ကို စောင့်ပါတယ်။ Enter နှိပ်လိုက်တာနဲ့ callback function ကို ခေါ်ပေးပါတယ်။

ဒီ callback function ထဲမှာ — ကျွန်တော်တို့က readline interface ကို ပိတ်လိုက်ပါတယ်။

`readline` မှာ တခြား methods တွေ အများကြီး ရှိပါသေးတယ် — အထက်မှာ link လုပ်ထားတဲ့ [package documentation](https://nodejs.org/api/readline.html) မှာ ကြည့်နိုင်ပါတယ်။

Password တစ်ခု လိုအပ်ရင် — သူ့ကို ပြန်ပြသမယ့်အစား `*` symbol ပြဖို့ အကောင်းဆုံးပါ။

## ဆက်ဖတ်ရန်

- [Output to the Command Line](/docs/nodejs/output-to-command-line) — console module နဲ့ output ထုတ်ခြင်း
- [Run Node.js Scripts](/docs/nodejs/run-nodejs-scripts) — command line ကနေ Node.js scripts run လုပ်ခြင်း
