---
title: "Node.js environment variables (ပတ်ဝန်းကျင် ကိန်းရှင်များ)"
description: "process.env နဲ့ environment variables ဖတ်နည်း၊ --env-file / --env-file-if-exists flags နဲ့ .env file သုံးနည်း၊ process.loadEnvFile() API"
order: 9
source: "https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs"
status: translated
updated: 2026-09-01
---

## Node.js ကနေ environment variables တွေကို ဘယ်လို ဖတ်မလဲ

Node.js ရဲ့ `process` core module မှာ `env` property ပါဝင်ပြီး — process စတင်ခဲ့တဲ့အချိန်မှာ သတ်မှတ်ထားခဲ့တဲ့ environment variables အားလုံးကို ထားရှိပါတယ်။

အောက်က code က `app.js` ကို run ပြီး `USER_ID` နဲ့ `USER_KEY` တွေကို သတ်မှတ်ပေးပါတယ်:

```bash
USER_ID=239482 USER_KEY=foobar node app.js
```

ဒါဆိုရင် `USER_ID` ကို **239482** အနေနဲ့၊ `USER_KEY` ကို **foobar** အနေနဲ့ user ဆီ ရောက်သွားပါတယ်။ Testing အတွက် ဒါက သင့်တော်ပေမယ့် — production မှာတော့ variables တွေကို export လုပ်ဖို့ bash scripts တချို့ သတ်မှတ်ထားဖို့ ဖြစ်နိုင်ပါတယ်။

> Note: `process` ကို import လုပ်စရာ မလိုပါဘူး — သူက Node.js ထဲက global object တစ်ခုပါ။

ဒီမှာ အထက်က code မှာ သတ်မှတ်ခဲ့တဲ့ `USER_ID` နဲ့ `USER_KEY` environment variables တွေကို ဝင်ရောက်ကြည့်တဲ့ ဥပမာပါ:

```js
console.log(process.env.USER_ID); // "239482"
console.log(process.env.USER_KEY); // "foobar"
```

ဒီနည်းအတိုင်းပဲ သင်သတ်မှတ်ထားတဲ့ custom environment variable ဘယ်ခုကိုမဆို ဝင်ရောက်နိုင်ပါတယ်။

Node.js 20 က [.env files အတွက် support](https://nodejs.org/docs/v24.5.0/api/environment_variables.html#env-files) ကို **experimental** အနေနဲ့ မိတ်ဆက်ပေးခဲ့ပါတယ်။

အခုတော့ Node.js application run လုပ်တဲ့အခါ environment file တစ်ခု သတ်မှတ်ဖို့ `--env-file` flag ကို သုံးနိုင်ပါတယ်။ ဒီမှာ `.env` file ဥပမာတစ်ခုနဲ့ — `process.env` သုံးပြီး သူ့ရဲ့ variables တွေကို ဘယ်လို ဝင်ရောက်ကြည့်ရမလဲဆိုတာ ပြထားပါတယ်:

```bash
# .env file
PORT=3000
```

သင့် js file ထဲမှာ:

```js
console.log(process.env.PORT); // "3000"
```

`.env` file ထဲမှာ သတ်မှတ်ထားတဲ့ environment variables တွေနဲ့ `app.js` file ကို run ပါ:

```bash
node --env-file=.env app.js
```

ဒီ command က `.env` file ထဲက environment variables အားလုံးကို load လုပ်ပြီး — application အတွက် `process.env` ပေါ်မှာ ရနိုင်အောင် လုပ်ပေးပါတယ်။

ဒါ့အပြင် `--env-file` arguments အများကြီးကိုလည်း ပေးနိုင်ပါတယ်။ နောက်က file တွေက အရင် file တွေထဲက ရှိပြီးသား variables တွေကို override လုပ်ပါတယ်:

```bash
node --env-file=.env --env-file=.development.env app.js
```

> Note: variable တစ်ခုက environment မှာရော file ထဲမှာရော သတ်မှတ်ထားရင် — environment ကနေ ရလာတဲ့ value က ဦးစားပေး ရပါတယ်။

`.env` file ကို မဖြစ်မနေ မဟုတ်ဘဲ — ရှိရင် ဖတ်ချင်တဲ့ အခြေအနေမှာ file မရှိရင် error မတက်အောင် `--env-file-if-exists` flag ကို သုံးနိုင်ပါတယ်:

```bash
node --env-file-if-exists=.env app.js
```

## `process.loadEnvFile(path)` နဲ့ `.env` files တွေကို programmatically load လုပ်ခြင်း

Node.js မှာ `.env` files တွေကို သင့် code ကနေ တိုက်ရိုက် load လုပ်ဖို့ built-in API ပါဝင်ပါတယ်: [`process.loadEnvFile(path)`](https://nodejs.org/api/process.html#processloadenvfilepath).

ဒီ method က `.env` file ထဲက variables တွေကို `process.env` ထဲ load လုပ်ပေးပါတယ် — `--env-file` flag လိုပါပဲ၊ ဒါပေမယ့် programmatically ခေါ်လို့ရတာပါ။

ဒီ method က initialization ပြီးမှ ခေါ်တာမို့ — startup-related environment variables (ဥပမာ `NODE_OPTIONS`) တွေ သတ်မှတ်တာက process ပေါ်မှာ အကျိုးသက်ရောက်မှု မရှိပါဘူး (ဒါပေမယ့် အဲဒီ variables တွေကို `process.env` ကနေ ဆက်ပြီး ဝင်ရောက်ကြည့်လို့တော့ ရပါတယ်)။

### ဥပမာ

```txt
# .env file
PORT=1234
```

Custom path တစ်ခုလည်း သတ်မှတ်နိုင်ပါတယ်:

```cjs
const { loadEnvFile } = require('node:process');
loadEnvFile('./config/.env');
```

## ဆက်ဖတ်ရန်

- [Command line ကနေ scripts run ခြင်း](/docs/nodejs/run-nodejs-scripts) — `node` command နဲ့ script run နည်း
- [Node.js မိတ်ဆက်](/docs/nodejs/getting-started) — installation နဲ့ ပထမဆုံး script
