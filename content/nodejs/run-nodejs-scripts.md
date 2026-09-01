---
title: "Command line ကနေ Node.js scripts များကို run ခြင်း"
description: "node command နဲ့ script run နည်း၊ shebang line သုံးနည်း၊ -e flag နဲ့ code string run ခြင်း၊ --watch နဲ့ auto-restart နဲ့ --run task runner"
order: 7
source: "https://nodejs.org/en/learn/command-line/run-nodejs-scripts-from-the-command-line"
status: translated
updated: 2026-09-01
---

## Command line ကနေ Node.js scripts များကို run ခြင်း

Node.js program တစ်ခုကို run ဖို့ အသုံးအများဆုံး နည်းကတော့ — (Node.js install လုပ်ပြီးတာနဲ့) global အနေနဲ့ ရနိုင်တဲ့ `node` command ကို သုံးပြီး execute လုပ်ချင်တဲ့ file ရဲ့ အမည်ကို ပေးလိုက်တာပါ။

သင့်ရဲ့ အဓိက Node.js application file က `app.js` ဆိုရင် — ဒီလို ရိုက်ပြီး ခေါ်နိုင်ပါတယ်:

```bash
node app.js
```

အထက်မှာ သင့် script ကို `node` နဲ့ run ဖို့ shell ကို ရှင်းရှင်းလင်းလင်း ပြောနေတာပါ။ ဒီအချက်အလက်ကို JavaScript file ထဲကို ["shebang"](https://en.wikipedia.org/wiki/Shebang_(Unix)) line အနေနဲ့လည်း ထည့်သွင်းနိုင်ပါတယ်။ "shebang" ဆိုတာ file ရဲ့ ပထမဆုံး line ဖြစ်ပြီး — script ကို run ဖို့ OS က ဘယ် interpreter ကို သုံးရမလဲဆိုတာ ပြောပြပါတယ်။ အောက်က JavaScript ရဲ့ ပထမဆုံး line ပါ:

```js
#!/usr/bin/node
```

အထက်မှာ interpreter ရဲ့ absolute path ကို ရှင်းရှင်းလင်းလင်း ပေးထားပါတယ်။ Operating system တိုင်းမှာ `node` က bin folder ထဲ ရှိချင်မှ ရှိမှာပါ — ဒါပေမယ့် `env` ကတော့ အားလုံးမှာ ရှိပါတယ်။ `env` ကို node ကို parameter အနေနဲ့ ထည့်ပြီး run ဖို့ OS ကို ပြောနိုင်ပါတယ်:

```js
#!/usr/bin/env node

// သင့် javascript code
```

Shebang သုံးဖို့ သင့် file မှာ executable permission ရှိရပါမယ်။ `app.js` ကို ဒီလို run ပြီး executable permission ပေးနိုင်ပါတယ်:

```bash
chmod u+x app.js
```

Command run နေတုန်း `app.js` file ပါတဲ့ directory ထဲမှာပဲ ရှိနေဖို့ သေချာပါစေ။

## File path အစား `node` ကို string argument အနေနဲ့ ပေးခြင်း

String တစ်ခုကို argument အနေနဲ့ execute လုပ်ဖို့ `-e`, `--eval "script"` ကို သုံးနိုင်ပါတယ်။ နောက်က argument ကို JavaScript အနေနဲ့ evaluate လုပ်ပါတယ်။ [REPL](/docs/nodejs/nodejs-repl) မှာ ကြိုသတ်မှတ်ထားတဲ့ modules တွေကိုလည်း script ထဲမှာ သုံးလို့ရပါတယ်။

Windows မှာ cmd.exe သုံးရင် single quote က မှန်မှန်ကန်ကန် အလုပ်မလုပ်ပါဘူး — ဘာလို့လဲဆိုတော့ သူက quoting အတွက် double `"` ကိုပဲ အသိအမှတ်ပြုလို့ပါ။ Powershell ဒါမှမဟုတ် Git bash မှာတော့ `'` ရော `"` ရော နှစ်မျိုးလုံး သုံးလို့ရပါတယ်။

```bash
node -e "console.log(123)"
```

## Application ကို အလိုအလျောက် restart လုပ်ခြင်း

Node.js v16 ကစပြီး file တစ်ခု ပြောင်းလဲတဲ့အခါ application ကို အလိုအလျောက် restart လုပ်ပေးတဲ့ built-in option တစ်ခု ရှိပါတယ်။ Development အတွက် အသုံးဝင်ပါတယ်။ ဒီ feature သုံးဖို့ Node.js ကို `--watch` flag ပေးရပါမယ်။

```bash
node --watch app.js
```

ဒါဆိုရင် file ကို ပြောင်းလိုက်တာနဲ့ application က အလိုအလျောက် restart ဖြစ်သွားပါတယ်။ [`--watch` flag documentation](https://nodejs.org/docs/latest-v22.x/api/cli.html#--watch) မှာ အသေးစိတ် ဖတ်နိုင်ပါတယ်။

## Node.js နဲ့ task တစ်ခု run ခြင်း

Node.js မှာ built-in task runner ပါဝင်ပြီး — သင့် `package.json` file ထဲမှာ သတ်မှတ်ထားတဲ့ specific commands တွေကို execute လုပ်နိုင်ပါတယ်။ Test run လုပ်တာ၊ project build လုပ်တာ၊ code lint လုပ်တာလိုမျိုး ထပ်ခါထပ်ခါ လုပ်နေရတဲ့ အလုပ်တွေကို အလိုအလျောက် လုပ်ဖို့ အထူးသဖြင့် အသုံးဝင်ပါတယ်။

### `--run` flag သုံးခြင်း

[`--run`](https://nodejs.org/docs/latest-v22.x/api/cli.html#--run) flag က သင့် `package.json` file ရဲ့ `scripts` section ထဲက သတ်မှတ်ထားတဲ့ command တစ်ခုကို run ပေးနိုင်ပါတယ်။ ဥပမာ — ဒီလို `package.json` ရှိတယ်ဆိုပါစို့:

```json
{
  "type": "module",
  "scripts": {
    "start": "node app.js",
    "test": "node --test"
  }
}
```

`test` script ကို `--run` flag သုံးပြီး ဒီလို run နိုင်ပါတယ်:

```bash
node --run test
```

### Command ကို argument တွေ ထပ်ပို့ခြင်း

`-- --another-argument` ဆိုတဲ့ syntax သုံးပြီး အောက်ခံ script ဆီကို arguments တွေ ပို့နိုင်ပါတယ်။ ဥပမာ — `start` script ဆီ `--port` argument ပို့ချင်ရင်:

```bash
node --run start -- --port 8080
```

ဒါဆိုရင် `start` script ကို run ပြီး `--port 8080` ကို command ရဲ့ အဆုံးမှာ ထပ်ဖြည့်ပေးမှာမို့ — `node app.js --port 8080` run လုပ်တာနဲ့ တူညီပါတယ်။

> Note: `--` နောက်မှာ ပို့လိုက်တဲ့ arguments တွေက script ဆီကို ရောက်သွားပြီး — Node.js CLI flags အနေနဲ့ အနက်ဖွင့်ခံရတာ မဟုတ်ပါဘူး။ ဥပမာ ဒီနည်းနဲ့ ပို့လိုက်တဲ့ `--watch` က `node --watch app.js` လိုမျိုး အလုပ်လုပ်မှာ မဟုတ်ပါဘူး။

### Environment variables

`--run` flag က သင့် scripts တွေအတွက် အသုံးဝင်နိုင်တဲ့ environment variables အချို့ကို သတ်မှတ်ပေးပါတယ်:

- `NODE_RUN_SCRIPT_NAME`: run လုပ်နေတဲ့ script ရဲ့ အမည်။
- `NODE_RUN_PACKAGE_JSON_PATH`: process လုပ်နေတဲ့ `package.json` file ရဲ့ path။

### Intentional limitations (ရည်ရွယ်ချက်ရှိရှိ ကန့်သတ်ချက်များ)

Node.js task runner က `npm run` ဒါမှမဟုတ် `yarn run` လိုမျိုး တခြား task runners တွေနဲ့ ယှဉ်ရင် ရည်ရွယ်ချက်ရှိရှိပဲ ပိုကန့်သတ်ထားပါတယ်။ Performance နဲ့ ရိုးရှင်းမှုကို ဦးစားပေးပြီး — `pre` ဒါမှမဟုတ် `post` scripts တွေ run လုပ်တာလိုမျိုး feature တွေကို ချန်လှပ်ထားပါတယ်။ ဒါကြောင့် ရိုးရှင်းတဲ့ အလုပ်တွေအတွက် သင့်တော်ပေမယ့် use case အားလုံးကိုတော့ မဖုံးလွှမ်းနိုင်ပါဘူး။

## ဆက်ဖတ်ရန်

- [Node.js REPL](/docs/nodejs/nodejs-repl) — terminal ထဲမှာ JavaScript code တွေကို interactive အနေနဲ့ စမ်းသုံးခြင်း
- [Node.js မိတ်ဆက်](/docs/nodejs/getting-started) — installation နဲ့ ပထမဆုံး script
