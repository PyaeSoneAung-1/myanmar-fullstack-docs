---
title: "Next.js မှာ Debugging Tools တွေ သုံးခြင်း (Using Debugging Tools with Next.js)"
description: "Next.js frontend နဲ့ backend code တွေကို source maps အပြည့်အစုံနဲ့ debug လုပ်နည်း — VS Code debugger, Chrome DevTools, Firefox DevTools, JetBrains WebStorm နဲ့ browser DevTools တွေ သုံးပြီး client-side/server-side code တွေကို စစ်ဆေးခြင်း"
order: 118
source: "https://nextjs.org/docs/app/guides/debugging"
status: translated
updated: 2026-09-03
---

ဒီ documentation မှာ — [VS Code debugger](https://code.visualstudio.com/docs/editor/debugging), [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools), (သို့) [Firefox DevTools](https://firefox-source-docs.mozilla.org/devtools-user/) တွေကို သုံးပြီး သင့် Next.js frontend နဲ့ backend code တွေကို source maps support အပြည့်အစုံနဲ့ ဘယ်လို debug လုပ်ရမလဲ ရှင်းပြထားပါတယ်။

Node.js ကို attach လုပ်နိုင်တဲ့ debugger တိုင်းက Next.js application ကိုလည်း debug လုပ်ဖို့ သုံးလို့ရပါတယ်။ အသေးစိတ် နောက်ထပ်ကို Node.js ရဲ့ [Debugging Guide](/docs/nodejs/debugging) မှာ တွေ့နိုင်ပါတယ်။

## VS Code နဲ့ Debugging လုပ်ခြင်း

သင့် project ရဲ့ root မှာ `.vscode/launch.json` လို့ခေါ်တဲ့ file တစ်ခုကို အောက်ပါ content တွေနဲ့ ဖန်တီးပါ:

```json filename="launch.json"
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev -- --inspect"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug client-side (Firefox)",
      "type": "firefox",
      "request": "launch",
      "url": "http://localhost:3000",
      "reAttach": true,
      "pathMappings": [
        {
          "url": "webpack://_N_E",
          "path": "${workspaceFolder}"
        }
      ]
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "runtimeArgs": ["--inspect"],
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "action": "debugWithEdge",
        "killOnServerStop": true,
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "webRoot": "${workspaceFolder}"
      }
    }
  ]
}
```

> **Note**: VS Code မှာ Firefox debugging သုံးဖို့ဆိုရင် — [Firefox Debugger extension](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug) ကို install လုပ်ဖို့ လိုပါတယ်။

`npm run dev` ကို — Yarn သုံးရင် `yarn dev` (သို့) pnpm သုံးရင် `pnpm dev` နဲ့ အစားထိုးနိုင်ပါတယ်။

"Next.js: debug full stack" configuration ထဲမှာ — `serverReadyAction.action` က server အဆင်သင့်ဖြစ်တဲ့အခါ ဘယ် browser ကို ဖွင့်ရမယ်ဆိုတာ သတ်မှတ်ပါတယ်။ `debugWithEdge` ဆိုတာ Edge browser ကို launch လုပ်ဖို့ ဖြစ်ပြီး — Chrome သုံးရင် ဒီ value ကို `debugWithChrome` အဖြစ် ပြောင်းပါ။

သင့် application ကို [port နံပါတ် ပြောင်းပြီး](/docs/nextjs/next-cli#next-dev-options) စတင်နေတယ်ဆိုရင် — `http://localhost:3000` ထဲက `3000` ကို သင်သုံးနေတဲ့ port နဲ့ အစားထိုးပါ။

Next.js ကို root ကလွဲပြီး တခြား directory တစ်ခုကနေ run နေတယ်ဆိုရင် (ဥပမာ Turborepo သုံးနေရင်) — server-side နဲ့ full stack debugging tasks တွေမှာ `cwd` ကို ထည့်ပေးဖို့ လိုပါတယ်။ ဥပမာ — `"cwd": "${workspaceFolder}/apps/web"`။

အခု Debug panel ကို သွားပြီး (Windows/Linux မှာ `Ctrl+Shift+D`၊ macOS မှာ `⇧+⌘+D`) — launch configuration တစ်ခုကို ရွေးပြီး — `F5` နှိပ်ပါ (သို့) Command Palette ကနေ **Debug: Start Debugging** ကို ရွေးပြီး debugging session ကို စတင်ပါ။

## Jetbrains WebStorm မှာ Debugger သုံးခြင်း

Runtime configuration တွေ စာရင်းပြတဲ့ drop down menu ကို နှိပ်ပြီး — `Edit Configurations...` ကို နှိပ်ပါ။ `http://localhost:3000` ကို URL အဖြစ်ထားတဲ့ `JavaScript Debug` debug configuration တစ်ခု ဖန်တီးပါ။ ကိုယ်ကြိုက်တဲ့အတိုင်း customize လုပ်ပြီး (ဥပမာ — debugging အတွက် Browser၊ project file အဖြစ် သိမ်းခြင်း) — `OK` ကို နှိပ်ပါ။ ဒီ debug configuration ကို run လိုက်ရင် — ရွေးထားတဲ့ browser က အလိုအလျောက် ပွင့်လာပါမယ်။ ဒီအချိန်မှာ debug mode ထဲမှာ application နှစ်ခု ရှိနေပါလိမ့်မယ်: Next.js node application နဲ့ client/browser application။

## Browser DevTools တွေနဲ့ Debugging လုပ်ခြင်း

### Client-side code

`next dev`, `npm run dev`, (သို့) `yarn dev` run လုပ်ပြီး development server ကို ပုံမှန်အတိုင်း စတင်ပါ။ Server စတင်ပြီးတာနဲ့ — သင်နှစ်သက်တဲ့ browser မှာ `http://localhost:3000` (သို့) သင့်ရဲ့ အခြား URL ကို ဖွင့်ပါ။

Chrome အတွက်:

- Chrome ရဲ့ Developer Tools ကို ဖွင့်ပါ (Windows/Linux မှာ `Ctrl+Shift+J`၊ macOS မှာ `⌥+⌘+I`)
- **Sources** tab ကို သွားပါ

Firefox အတွက်:

- Firefox ရဲ့ Developer Tools ကို ဖွင့်ပါ (Windows/Linux မှာ `Ctrl+Shift+I`၊ macOS မှာ `⌥+⌘+I`)
- **Debugger** tab ကို သွားပါ

Browser နှစ်ခုလုံးမှာ — သင့် client-side code က [`debugger`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/debugger) statement တစ်ခုကို ရောက်တိုင်း — code execution က ရပ်သွားပြီး အဲဒီ file က debug area ထဲမှာ ပေါ်လာပါမယ်။ Breakpoints တွေကို ကိုယ်တိုင် သတ်မှတ်ဖို့ files တွေကို ရှာဖွေနိုင်ပါတယ်:

- Chrome မှာ: Windows/Linux မှာ `Ctrl+P` (သို့) macOS မှာ `⌘+P` နှိပ်ပါ
- Firefox မှာ: Windows/Linux မှာ `Ctrl+P` (သို့) macOS မှာ `⌘+P` နှိပ်ပါ — (သို့) ဘယ်ဘက် panel ထဲက file tree ကို သုံးပါ

ရှာဖွေတဲ့အခါ — သင့် source files တွေရဲ့ paths တွေက `webpack://_N_E/./` နဲ့ စတင်နေတာ သတိပြုပါ။

### React Developer Tools

React အတွက် သီးသန့် debugging လုပ်ဖို့ — [React Developer Tools](https://react.dev/learn/react-developer-tools) browser extension ကို install လုပ်ပါ။ ဒီမရှိမဖြစ် tool က သင့်ကို ကူညီပေးပါတယ်:

- React components တွေကို စစ်ဆေးခြင်း
- Props နဲ့ state တွေကို တည်းဖြတ်ခြင်း
- Performance ပြဿနာတွေကို ဖော်ထုတ်ခြင်း

### Server-side code

Browser DevTools တွေနဲ့ server-side Next.js code ကို debug လုပ်ဖို့ — `--inspect` flag ကို ပေးရပါတယ်:

```bash package="pnpm"
pnpm dev --inspect
```

```bash package="npm"
npm run dev -- --inspect
```

```bash package="yarn"
yarn dev --inspect
```

```bash package="bun"
bun run dev --inspect
```

`--inspect` ရဲ့ value ကို အောက်ခံ Node.js process ဆီ ပေးပို့ပါတယ်။ [အဆင့်မြင့် use cases တွေအတွက် `--inspect` docs](https://nodejs.org/api/cli.html#--inspecthostport) ကို ကြည့်ပါ။

> **Good to know**: Docker container တစ်ခုထဲမှာ app run နေတာလိုမျိုး — localhost အပြင်ဘက်ကနေ remote debugging access ရချင်ရင် `--inspect=0.0.0.0` ကို သုံးပါ။

Next.js server ကို `--inspect` flag နဲ့ launch လုပ်တာက ဒီလိုမျိုး ပုံပေါ်ပါလိမ့်မယ်:

```bash filename="Terminal"
Debugger listening on ws://127.0.0.1:9229/0cf90313-350d-4466-a748-cd60f4e47c95
For help, see: https://nodejs.org/learn/getting-started/debugging
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Chrome အတွက်:

1. Tab အသစ်တစ်ခုဖွင့်ပြီး `chrome://inspect` ကို သွားပါ
1. **Remote Target** section ထဲမှာ သင့် Next.js application ကို ရှာပါ
1. DevTools window သီးခြားတစ်ခု ဖွင့်ဖို့ **inspect** ကို နှိပ်ပါ
1. **Sources** tab ကို သွားပါ

Firefox အတွက်:

1. Tab အသစ်တစ်ခုဖွင့်ပြီး `about:debugging` ကို သွားပါ
1. ဘယ်ဘက် sidebar မှာ **This Firefox** ကို နှိပ်ပါ
1. **Remote Targets** အောက်မှာ သင့် Next.js application ကို ရှာပါ
1. Debugger ဖွင့်ဖို့ **Inspect** ကို နှိပ်ပါ
1. **Debugger** tab ကို သွားပါ

Server-side code ကို debug လုပ်တာက client-side debugging နဲ့ ဆင်တူပါတယ်။ Files တွေကို ရှာတဲ့အခါ (`Ctrl+P`/`⌘+P`) — သင့် source files တွေရဲ့ paths တွေက `webpack://{application-name}/./` နဲ့ စတင်ပါလိမ့်မယ် (`{application-name}` နေရာမှာ သင့် `package.json` file အရ application ရဲ့ နာမည် အစားထိုးဝင်မှာ ဖြစ်ပါတယ်)။

`--inspect-brk` (သို့) `--inspect-wait` သုံးချင်ရင်တော့ — `NODE_OPTIONS` ကို သတ်မှတ်ပေးရပါမယ်။ ဥပမာ — `NODE_OPTIONS=--inspect-brk next dev`။

### Browser DevTools တွေနဲ့ Server Errors တွေကို စစ်ဆေးခြင်း

Error တစ်ခုကို ကြုံရတဲ့အခါ — source code ကို စစ်ဆေးကြည့်တာက error တွေရဲ့ မူလအကြောင်းရင်း (root cause) ကို ခြေရာခံဖို့ ကူညီနိုင်ပါတယ်။

Next.js က error overlay ပေါ်က Next.js version indicator ရဲ့ အောက်မှာ Node.js icon တစ်ခု ပြသပါတယ်။ ဒီ icon ကို နှိပ်လိုက်ရင် — DevTools URL ကို သင့် clipboard ထဲ ကူးယူပေးပါတယ်။ အဲဒီ URL နဲ့ browser tab အသစ်တစ်ခု ဖွင့်ပြီး Next.js server process ကို စစ်ဆေးနိုင်ပါတယ်။

### Windows ပေါ်မှာ Debugging လုပ်ခြင်း

သင့် machine ပေါ်မှာ Windows Defender ကို disable လုပ်ထားကြောင်း သေချာပါစေ။ ဒီ external service က _file read တိုင်း_ ကို စစ်ဆေးတာမို့ — `next dev` နဲ့ဆို Fast Refresh အချိန် သိသိသာသာ တိုးလာတယ်လို့ အစီရင်ခံထားပါတယ်။ ဒါက Next.js နဲ့ မဆိုင်တဲ့ သိထားပြီးသား issue တစ်ခု ဖြစ်ပေမယ့် — Next.js development ကို သက်ရောက်မှု ရှိပါတယ်။

## နောက်ထပ် အချက်အလက်များ

JavaScript debugger တစ်ခုကို ဘယ်လို သုံးရမလဲ ပိုလေ့လာချင်ရင် အောက်ပါ documentation တွေကို ကြည့်ပါ:

- [VS Code မှာ Node.js debugging: Breakpoints](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_breakpoints)
- [Chrome DevTools: Debug JavaScript](https://developers.google.com/web/tools/chrome-devtools/javascript)
- [Firefox DevTools: Debugger](https://firefox-source-docs.mozilla.org/devtools-user/debugger/)
