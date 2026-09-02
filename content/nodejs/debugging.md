---
title: "Node.js Debugging (အမှားရှာပြင်ခြင်း)"
description: "Node.js app နဲ့ script တွေကို debugging လုပ်နည်း — --inspect flag နဲ့ Inspector ဖွင့်ခြင်း၊ security သတိပြုချက်များ၊ Inspector clients (Chrome DevTools, VS Code...)၊ command-line options နဲ့ remote debugging"
order: 40
source: "https://nodejs.org/learn/getting-started/debugging"
status: translated
updated: 2026-09-02
---

## Node.js Debugging (အမှားရှာပြင်ခြင်း)

ဒီ guide က Node.js application တွေနဲ့ script တွေကို debugging (အမှားရှာပြင်ခြင်း) စတင်လုပ်နိုင်အောင် ကူညီပေးပါလိမ့်မယ်။

## Inspector ကို ဖွင့်ခြင်း

`--inspect` switch နဲ့ စတင်လိုက်တဲ့အခါ — Node.js process တစ်ခုက debugging client တစ်ခုအတွက် နားထောင်ပေးပါတယ်။ Default အနေနဲ့တော့ 127.0.0.1:9229 ဆိုတဲ့ host နဲ့ port မှာ နားထောင်ပါတယ်။ Process တစ်ခုချင်းစီကိုလည်း ထူးခြားတဲ့ [UUID](https://tools.ietf.org/html/rfc4122) (Universally Unique Identifier) တစ်ခု သတ်မှတ်ပေးပါတယ်။

Inspector client တွေက ချိတ်ဆက်ဖို့ host address, port နဲ့ UUID ကို သိပြီး သတ်မှတ်ပေးရပါတယ်။ အပြည့်အစုံ URL တစ်ခုက ဒီလိုမျိုး ဖြစ်ပါလိမ့်မယ် — `ws://127.0.0.1:9229/0f2c936f-b1cd-4ac9-aab3-f63b0f33d55e`။

Node.js က `SIGUSR1` signal ကို လက်ခံရရှိရင်လည်း debugging messages တွေကို စတင် နားထောင်ပေးပါတယ်။ (`SIGUSR1` က Windows မှာ မရနိုင်ပါဘူး။) Node.js 7 နဲ့ အစောပိုင်းမှာ ဒါက legacy Debugger API ကို activate (သက်ဝင်) စေပါတယ်။ Node.js 8 နဲ့ နောက်ပိုင်းမှာတော့ Inspector API ကို activate လုပ်ပေးပါတယ်။

## Security သက်ရောက်မှုများ

Debugger က Node.js execution environment ကို အပြည့်အဝ ဝင်ရောက်ခွင့် ရှိတာမို့ — ဒီ port ကို ချိတ်ဆက်နိုင်တဲ့ မရည်ရွယ်ချက်ကောင်း မရှိသူ (malicious actor) က Node.js process ကိုယ်စား arbitrary code (စိတ်ကြိုက် code) တွေ run လုပ်နိုင်ပါတယ်။ Debugger port ကို public နဲ့ private network နှစ်ခုလုံးမှာ ဖွင့်ထားခြင်းရဲ့ security သက်ရောက်မှုတွေကို နားလည်ထားဖို့ အရေးကြီးပါတယ်။

### Debug port ကို အများပြည်သူဆိုင်ရာ နေရာမှာ ဖွင့်ထားခြင်းက မလုံခြုံပါ

Debugger ကို public IP address တစ်ခုမှာ (သို့) 0.0.0.0 မှာ bind လုပ်ထားရင် — ကိုယ့် IP address ကို ရောက်ရှိနိုင်တဲ့ client တိုင်း ကန့်သတ်ချက်မရှိ debugger ဆီ ချိတ်ဆက်ပြီး arbitrary code တွေ run လုပ်နိုင်သွားပါလိမ့်မယ်။

Default အနေနဲ့ `node --inspect` က 127.0.0.1 မှာ bind လုပ်ပါတယ်။ Debugger ဆီ ပြင်ပ (external) connection တွေ ခွင့်ပြုချင်မှသာ — public IP address (သို့) 0.0.0.0 စတာတွေကို ကိုယ်တိုင် သတ်မှတ်ပေးဖို့ လိုပါတယ်။ ဒီလိုလုပ်တာက ကိုယ့်ကို သိသာထင်ရှားတဲ့ security အန္တရာယ်တစ်ခုဆီ ထိတွေ့စေနိုင်ပါတယ်။ Security ပေါက်ကြားမှု မဖြစ်အောင် — သင့်လျော်တဲ့ firewall တွေနဲ့ access controls တွေ ရှိနေဖို့ သေချာစေဖို့ အကြံပြုပါတယ်။

အဝေးက (remote) debugger client တွေကို လုံခြုံစွာ ချိတ်ဆက်ခွင့်ပြုနည်း အကြံပြုချက်တွေအတွက် — အောက်က 'Remote debugging ဖွင့်ခြင်း' section ကို ကြည့်ပါ။

### Local application တွေက Inspector ကို အပြည့်အဝ သုံးနိုင်ပါတယ်

Inspector port ကို 127.0.0.1 (default) မှာပဲ bind လုပ်ထားရင်တောင် — ကိုယ့် machine ပေါ်မှာ local အနေနဲ့ run နေတဲ့ application တိုင်းက ကန့်သတ်ချက်မရှိ ဝင်ရောက်ခွင့် ရှိပါတယ်။ ဒါက local debugger တွေ အဆင်ပြေပြေ attach လုပ်နိုင်အောင် ရည်ရွယ်ချက်ရှိရှိ ဒီဇိုင်းလုပ်ထားတာပါ။

### Browsers, WebSockets နဲ့ same-origin policy

Web browser ထဲမှာ ဖွင့်ထားတဲ့ website တွေက browser ရဲ့ security model အောက်မှာ WebSocket နဲ့ HTTP requests တွေ လုပ်နိုင်ပါတယ်။ ထူးခြားတဲ့ debugger session id တစ်ခု ရယူဖို့ ကနဦး HTTP connection တစ်ခု လိုအပ်ပါတယ်။ Same-origin policy က website တွေ ဒီ HTTP connection ကို လုပ်နိုင်တာကို တားဆီးပေးပါတယ်။ [DNS rebinding attacks](https://en.wikipedia.org/wiki/DNS_rebinding) တွေကနေ ထပ်ဆင့် ကာကွယ်ဖို့ — Node.js က connection ရဲ့ 'Host' headers တွေဟာ IP address တစ်ခု (သို့) `localhost` ကို အတိအကျ သတ်မှတ်ထားကြောင်း စစ်ဆေးပါတယ်။

ဒီ security policies တွေက hostname သတ်မှတ်ပြီး အဝေးက debug server ဆီ ချိတ်ဆက်တာကို ခွင့်မပြုပါဘူး။ ဒီကန့်သတ်ချက်ကို — IP address သတ်မှတ်ခြင်း (သို့) အောက်မှာ ဖော်ပြထားတဲ့အတိုင်း ssh tunnel တွေ သုံးခြင်းဖြင့် ရှောင်လွှဲလို့ရပါတယ်။

## Inspector Client များ

`node inspect myscript.js` နဲ့ အနည်းငယ်မျှသော CLI debugger တစ်ခုကို ရနိုင်ပါတယ်။ Node.js Inspector ဆီ ချိတ်ဆက်လို့ရတဲ့ commercial နဲ့ open source tool တွေ အများကြီးလည်း ရှိပါတယ်။

### Chrome DevTools 55+, Microsoft Edge

#### နည်းလမ်း ၁ — Built-in DevTools UI သုံးခြင်း

- Browser မှာ `chrome://inspect` ကို ဖွင့်ပါ (Microsoft Edge မှာတော့ `edge://inspect`)။
- Configure ခလုတ်ကို နှိပ်ပြီး — ချိတ်ဆက်ချင်တဲ့ host နဲ့ port တွေ စာရင်းထဲ ပါဝင်နေကြောင်း သေချာအောင် လုပ်ပါ။
- ကိုယ့်ရဲ့ Node.js application က Remote Target list ထဲမှာ ပေါ်လာပါလိမ့်မယ်။

#### နည်းလမ်း ၂ — ကိုယ်တိုင် ချိတ်ဆက်ခြင်း

- `http://localhost:<inspect-port>/json/list` ကို သွားကြည့်ပါ။ `devtoolsFrontendUrl` တစ်ခု ပါဝင်တဲ့ JSON object တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။
- Response ထဲက `devtoolsFrontendUrl` တန်ဖိုးကို copy လုပ်ပြီး — browser ရဲ့ address bar ထဲမှာ paste လုပ်ပါ။

အသေးစိတ်အတွက် [Chrome DevTools Frontend](https://github.com/ChromeDevTools/devtools-frontend) နဲ့ [Microsoft Edge DevTools Guide](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/) ကို ကြည့်ပါ။

### Visual Studio Code 1.10+

- Debug panel ထဲမှာ settings icon ကို နှိပ်ပြီး `.vscode/launch.json` ကို ဖွင့်ပါ။ ကနဦး setup အတွက် "Node.js" ကို ရွေးပါ။

အသေးစိတ်အတွက် https://code.visualstudio.com/docs/nodejs/nodejs-debugging ကို ကြည့်ပါ။

### Visual Studio 2017+

- Menu ကနေ "Debug > Start Debugging" ကို ရွေးပါ (သို့) F5 နှိပ်ပါ။
- [အသေးစိတ် လမ်းညွှန်ချက်များ](https://github.com/Microsoft/nodejstools/wiki/Debugging)။

### JetBrains WebStorm နဲ့ တခြား JetBrains IDEs

- Node.js debug configuration အသစ်တစ်ခု ဖန်တီးပြီး Debug ကို နှိပ်ပါ။ Node.js 7+ မှာ `--inspect` ကို default အနေနဲ့ သုံးပါလိမ့်မယ်။ ပိတ်ချင်ရင် IDE Registry ထဲက `js.debugger.node.use.inspect` ကို အမှန်ခြစ် ဖြုတ်ပါ။ WebStorm နဲ့ တခြား JetBrains IDEs တွေမှာ Node.js ကို run ခြင်းနဲ့ debugging လုပ်ခြင်း အကြောင်း ပိုသိချင်ရင် [WebStorm online help](https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html) ကို ကြည့်ပါ။

### chrome-remote-interface

- [Inspector Protocol](https://chromedevtools.github.io/debugger-protocol-viewer/v8/) endpoints တွေဆီ ချိတ်ဆက်ရတာ လွယ်ကူစေတဲ့ library တစ်ခုပါ။

အသေးစိတ်အတွက် https://github.com/cyrus-and/chrome-remote-interface ကို ကြည့်ပါ။

### Eclipse IDE နဲ့ Eclipse Wild Web Developer extension

- `.js` file တစ်ခုကနေ "Debug As... > Node program" ကို ရွေးပါ — ဒါမှမဟုတ်
- Run နေပြီးသား Node.js application (`--inspect` နဲ့ စတင်ထားပြီးသား) ဆီ debugger ကို attach လုပ်ဖို့ Debug Configuration တစ်ခု ဖန်တီးပါ။

အသေးစိတ်အတွက် https://eclipseide.org/ ကို ကြည့်ပါ။

## Command Line Options

အောက်ပါ table က debugging အပေါ် runtime flag အမျိုးမျိုးရဲ့ သက်ရောက်မှုတွေကို ဖော်ပြထားပါတယ်:

| Flag | အဓိပ္ပာယ် |
| --- | --- |
| `--inspect` | Inspector agent ကို ဖွင့်ပါ; default address နဲ့ port (127.0.0.1:9229) မှာ နားထောင်ပါ |
| `--inspect=[host:port]` | Inspector agent ကို ဖွင့်ပါ; `host` address (သို့) hostname မှာ bind လုပ်ပါ (default: 127.0.0.1); `port` မှာ နားထောင်ပါ (default: 9229) |
| `--inspect-brk` | Inspector agent ကို ဖွင့်ပါ; default address နဲ့ port (127.0.0.1:9229) မှာ နားထောင်ပါ; user code မစတင်မီ break (ရပ်နား) လုပ်ပါ |
| `--inspect-brk=[host:port]` | Inspector agent ကို ဖွင့်ပါ; `host` address (သို့) hostname မှာ bind လုပ်ပါ (default: 127.0.0.1); `port` မှာ နားထောင်ပါ (default: 9229); user code မစတင်မီ break လုပ်ပါ |
| `--inspect-wait` | Inspector agent ကို ဖွင့်ပါ; default address နဲ့ port (127.0.0.1:9229) မှာ နားထောင်ပါ; debugger attach (ချိတ်ဆက်) လာသည်အထိ စောင့်ပါ |
| `--inspect-wait=[host:port]` | Inspector agent ကို ဖွင့်ပါ; `host` address (သို့) hostname မှာ bind လုပ်ပါ (default: 127.0.0.1); `port` မှာ နားထောင်ပါ (default: 9229); debugger attach လာသည်အထိ စောင့်ပါ |
| `--disable-sigusr1` | Process ဆီ SIGUSR1 signal ပို့ခြင်းဖြင့် debugging session တစ်ခု စတင်နိုင်စွမ်းကို ပိတ်ပါ |
| `node inspect script.js` | User ရဲ့ script ကို `--inspect` flag အောက်မှာ run ဖို့ child process တစ်ခု spawn လုပ်ပြီး — CLI debugger ကို run ဖို့ main process ကို သုံးပါ |
| `node inspect --port=xxxx script.js` | User ရဲ့ script ကို `--inspect` flag အောက်မှာ run ဖို့ child process တစ်ခု spawn လုပ်ပြီး — CLI debugger ကို run ဖို့ main process ကို သုံးပါ; `port` (default: 9229) မှာ နားထောင်ပါ |

## Remote Debugging ဖွင့်ခြင်း

Debugger ကို public IP address မှာ ဘယ်တော့မှ listen လုပ်စေဖို့ အကြံပြုပါတယ်။ အဝေးက debugging connection တွေ ခွင့်ပြုဖို့ လိုအပ်ရင် — အဲဒီအစား ssh tunnel တွေကို သုံးဖို့ အကြံပြုပါတယ်။ အောက်ပါ ဥပမာက သရုပ်ပြရန် (illustrative) အတွက်သာ ဖြစ်ပါတယ်။ မလုပ်ဆောင်မီ — privileged (အခွင့်ထူး) ရှိတဲ့ service တစ်ခုဆီ remote access ခွင့်ပြုခြင်းရဲ့ security အန္တရာယ်ကို နားလည်ထားပါ။

ဥပမာ — သင်က remote machine (remote.example.com) ပေါ်မှာ Node.js run နေပြီး အဲဒါကို debug လုပ်ချင်တယ် ဆိုပါစို့။ အဲဒီ machine ပေါ်မှာ node process ကို inspector က localhost (default) မှာပဲ နားထောင်အောင် စတင်သင့်ပါတယ်:

```bash
node --inspect server.js
```

အခု — debug client connection တစ်ခု စတင်ချင်တဲ့ ကိုယ့်ရဲ့ local machine ပေါ်မှာ ssh tunnel တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်:

```bash
ssh -L 9221:localhost:9229 user@remote.example.com
```

ဒါက ssh tunnel session တစ်ခုကို စတင်ပေးပြီး — ကိုယ့် local machine ပေါ်က port 9221 ဆီ ချိတ်ဆက်မှုတွေကို remote.example.com ပေါ်က port 9229 ဆီ ပို့ဆောင်ပေးပါတယ်။ အခု localhost:9221 ကို Chrome DevTools (သို့) Visual Studio Code လိုမျိုး debugger တစ်ခုနဲ့ attach လုပ်လို့ရပါပြီ — Node.js application က local မှာ run နေသလိုပဲ debug လုပ်နိုင်မှာ ဖြစ်ပါတယ်။

## Legacy Debugger (မျိုးဆက်ဟောင်း Debugger)

**Legacy debugger ကို Node.js 7.7.0 ကစပြီး deprecated (အသုံးပြုမှု ရပ်ဆိုင်းရန် သတ်မှတ်) လိုက်ပါပြီ။ ကျေးဇူးပြုပြီး `--inspect` နဲ့ Inspector ကိုပဲ သုံးပါ။**

Version 7 နဲ့ အစောပိုင်းတွေမှာ **--debug** (သို့) **--debug-brk** switch တွေနဲ့ စတင်လိုက်ရင် — Node.js က ရပ်ဆိုင်းလိုက်ပြီဖြစ်တဲ့ V8 Debugging Protocol က သတ်မှတ်ထားတဲ့ debugging commands တွေကို TCP port — default အနေနဲ့ `5858` — မှာ နားထောင်ပါတယ်။ ဒီ protocol ကို သုံးတဲ့ debugger client မှန်သမျှ ချိတ်ဆက်ပြီး run နေတဲ့ process ကို debug လုပ်နိုင်ပါတယ် — လူကြိုက်များတဲ့ နှစ်ခုကို အောက်မှာ ဖော်ပြထားပါတယ်။

V8 Debugging Protocol ကို နောက်ထပ် maintain လုပ်တာ မရှိတော့သလို — documentation လည်း မရှိတော့ပါဘူး။

### Built-in Debugger

`node debug script_name.js` လို့ စတင်လိုက်ရင် ကိုယ့် script ကို built-in command-line debugger အောက်မှာ run ပေးပါတယ်။ Script က `--debug-brk` option နဲ့ စတင်ထားတဲ့ တခြား Node.js process တစ်ခုထဲမှာ run ပြီး — ကနဦး Node.js process က `_debugger.js` script ကို run ပြီး ကိုယ့် target ဆီ ချိတ်ဆက်ပါတယ်။ အသေးစိတ်အတွက် [docs](https://nodejs.org/dist/latest/docs/api/debugger.html) ကို ကြည့်ပါ။

### node-inspector

Node.js app ကို Chrome DevTools နဲ့ debug လုပ်ဖို့ — Chromium မှာ သုံးတဲ့ [Inspector Protocol](https://chromedevtools.github.io/debugger-protocol-viewer/v8/) ကို Node.js မှာ သုံးတဲ့ V8 Debugger protocol အဖြစ် ပြောင်းပေးတဲ့ ကြားခံ process (intermediary process) တစ်ခုကို သုံးပါတယ်။ အသေးစိတ်အတွက် https://github.com/node-inspector/node-inspector ကို ကြည့်ပါ။

## ဆက်ဖတ်ရန်

- [Node.js မိတ်ဆက်](/docs/nodejs/getting-started) — Node.js runtime အကြောင်း နောက်ခံသမိုင်း
- [Command line ကနေ Node.js scripts များကို run ခြင်း](/docs/nodejs/run-nodejs-scripts) — node command နဲ့ script တွေ စတင်နည်း
- [Development နဲ့ Production ကွာခြားချက်](/docs/nodejs/nodejs-the-difference-between-development-and-production) — environment တွေကို ခွဲခြားသတ်မှတ်ခြင်း
