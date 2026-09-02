---
title: "Security အကောင်းဆုံးအလေ့အကျင့်များ"
description: "Node.js application တွေ လုံခြုံအောင် — DoS, DNS rebinding, request smuggling, timing attack, supply chain attack, prototype pollution စတဲ့ threat များနဲ့ ကာကွယ်နည်းများ"
order: 32
source: "https://nodejs.org/en/learn/getting-started/security-best-practices"
status: translated
updated: 2026-09-02
---

## ရည်ရွယ်ချက်

ဒီစာတမ်းက လက်ရှိ [Node.js threat model](https://github.com/nodejs/node/security/policy#the-nodejs-threat-model) ကို ချဲ့ထွင်ပြီး — Node.js application တစ်ခုကို ဘယ်လို လုံခြုံအောင် လုပ်မလဲဆိုတဲ့ ကျယ်ပြန့်တဲ့ လမ်းညွှန်ချက်တွေ ပေးဖို့ ရည်ရွယ်ပါတယ်။

## ဤစာတမ်းပါ အကြောင်းအရာများ

- **Best practices** — အကောင်းဆုံး အလေ့အကျင့်တွေကို လွယ်လွယ်ကူကူ မြင်ရအောင် ချုံ့ပြီး တင်ပြထားပါတယ်။ ဒီစာတမ်းက Node.js အတွက် သီးသန့်ဖြစ်ပြီး — ပိုကျယ်ပြန့်တဲ့ အကြောင်းအရာ လိုချင်ရင် [OSSF Best Practices](https://github.com/ossf/wg-best-practices-os-developers) ကို ကြည့်ပါ။
- **Attacks explained** — threat model ထဲမှာ ဖော်ပြထားတဲ့ attack တွေကို ရိုးရိုးရှင်းရှင်း English နဲ့ — တတ်နိုင်ရင် code ဥပမာတွေနဲ့တကွ ဖော်ပြထားပါတယ်။
- **Third-Party Libraries** — node modules dependencies တွေနဲ့ ပတ်သက်တဲ့ threat တွေ (typosquatting attack, malicious packages စသည်) နဲ့ အကောင်းဆုံး အလေ့အကျင့်တွေကို သတ်မှတ်ပါတယ်။

## Threat စာရင်း

Node.js ရဲ့ [threat model](https://github.com/nodejs/node/security/policy#the-nodejs-threat-model) က _Node.js ကိုယ်တိုင်ထဲမှာ_ ဘာကို vulnerability လို့ သတ်မှတ်လဲ/မသတ်မှတ်ဘူးလဲ ဆိုတာ သတ်မှတ်ပါတယ်။ အောက်က အကြောင်းအရာတချို့က အဲဒီ model အရ Node.js core ထဲက vulnerability မဟုတ်ပေမယ့် — Node.js software တွေ တည်ဆောက်/လည်ပတ်တဲ့အခါ ထည့်သွင်းစဉ်းစားရမယ့် အရေးကြီးတဲ့ _application-level_ threats တွေပါ။

### HTTP server Denial of Service (CWE-400)

ဒီ attack မှာ application က incoming HTTP requests တွေကို ကိုင်တွယ်ပုံကြောင့် — သူ့ရဲ့ ရည်ရွယ်ချက်အတွက် သုံးလို့မရတော့အောင် ဖြစ်သွားပါတယ်။ ဒီ request တွေက malicious actor က တမင်ဖန်တီးတာ ဖြစ်ဖို့တောင် မလိုပါဘူး — misconfigured ဖြစ်နေတဲ့ (သို့) bug ရှိတဲ့ client ကလည်း denial of service ဖြစ်စေတဲ့ request pattern ပို့နိုင်ပါတယ်။

HTTP requests တွေကို Node.js HTTP server က လက်ခံပြီး — request handler ကနေတစ်ဆင့် application code ဆီ လွှဲပေးပါတယ်။ Server က request body ရဲ့ အကြောင်းအရာကို parse မလုပ်ပါဘူး — ဒါကြောင့် request handler ဆီ ရောက်ပြီးမှ body အကြောင်းအရာကြောင့် ဖြစ်တဲ့ DoS က Node.js ကိုယ်တိုင်ရဲ့ vulnerability မဟုတ်ပါဘူး — အဲဒါကို မှန်ကန်စွာ ကိုင်တွယ်ဖို့က application code ရဲ့ တာဝန်ပါ။

WebServer က socket errors တွေကို ကောင်းကောင်း ကိုင်တွယ်ဖို့ သေချာပါစေ — ဥပမာ error handler မပါဘဲ server ဖန်တီးထားရင် DoS ကို ခံနိုင်ရည် ရှိမှာပါ:

```cjs
const net = require('node:net');

const server = net.createServer(function (socket) {
  // socket.on('error', console.error) // this prevents the server to crash
  socket.write('Echo server\r\n');
  socket.pipe(socket);
});

server.listen(5000, '0.0.0.0');
```

```mjs
import net from 'node:net';

const server = net.createServer(function (socket) {
  // socket.on('error', console.error) // this prevents the server to crash
  socket.write('Echo server\r\n');
  socket.pipe(socket);
});

server.listen(5000, '0.0.0.0');
```

_bad request_ တစ်ခု လုပ်လိုက်ရင် server crash သွားနိုင်ပါတယ်။

Request ရဲ့ အကြောင်းအရာကြောင့် မဟုတ်တဲ့ DoS attack ဥပမာကတော့ [Slowloris](https://en.wikipedia.org/wiki/Slowloris_(computer_security)) ပါ — HTTP requests တွေကို တစ်ပိုင်းစီ ဖြည်းညှင်းစွာ ပို့တဲ့ attack ပါ။ Request တစ်ခုလုံး မပြည့်မချင်း server က ဒီ request အတွက် resource တွေ သိမ်းထားပါတယ် — request အလုံအလောက် တစ်ပြိုင်နက် ရောက်လာရင် concurrent connections တွေ maximum ကို ရောက်ပြီး denial of service ဖြစ်ပါတယ်။ ဒီ attack က request ရဲ့ အကြောင်းအရာပေါ် မမူတည်ဘဲ — request တွေရဲ့ timing နဲ့ pattern ပေါ်မှာပဲ မူတည်ပါတယ်။

**ကာကွယ်နည်းများ**

- Node.js application ဆီ request တွေကို လက်ခံ/ပို့ပေးဖို့ **reverse proxy** သုံးပါ — caching, load balancing, IP blacklisting စတာတွေ ရနိုင်လို့ DoS ထိရောက်နိုင်ခြေ လျော့ကျစေပါတယ်။
- Server timeouts တွေကို မှန်ကန်စွာ configure လုပ်ပါ — idle ဖြစ်နေတဲ့ (သို့) request နှေးလွန်းတဲ့ connection တွေကို ဖြတ်ပစ်နိုင်ဖို့ [`http.Server`](https://nodejs.org/api/http.html#class-httpserver) ရဲ့ `headersTimeout`, `requestTimeout`, `timeout`, `keepAliveTimeout` တွေကို ကြည့်ပါ။
- Host တစ်ခုချင်းစီနဲ့ စုစုပေါင်း open sockets အရေအတွက်ကို ကန့်သတ်ပါ — [http docs](https://nodejs.org/api/http.html) ထဲက `agent.maxSockets`, `agent.maxTotalSockets`, `agent.maxFreeSockets`, `server.maxRequestsPerSocket` တွေပါ။

### DNS Rebinding (CWE-346)

ဒီ attack က debugging inspector ဖွင့်ထားတဲ့ ([--inspect switch](https://nodejs.org/api/cli.html#--inspectport) နဲ့ run နေတဲ့) Node.js application တွေကို ပစ်မှတ်ထားနိုင်ပါတယ်။ Browser ထဲက website တွေက WebSocket နဲ့ HTTP requests တွေ လုပ်နိုင်တာမို့ — local မှာ run နေတဲ့ debugging inspector ကို ပစ်မှတ်ထားနိုင်ပါတယ်။ ဒါကို ပုံမှန်အားဖြင့် modern browsers တွေရဲ့ [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) က တားဆီးပေးပါတယ် — origin မတူတဲ့ resource တွေကို script တွေ ဝင်ရောက်ဖတ်ရှုတာ တားမြစ်ထားလို့ပါ။

ဒါပေမယ့် **DNS rebinding** ကနေတစ်ဆင့် attacker က သူ့ရဲ့ requests တွေ local IP address ကနေ လာသလို ထင်ရအောင် origin ကို ခေတ္တ ထိန်းချုပ်နိုင်ပါတယ် — website ရော သူ့ရဲ့ IP ကို resolve လုပ်တဲ့ DNS server ရော နှစ်ခုလုံးကို ထိန်းချုပ်ထားခြင်းအားဖြင့်ပါ ([DNS Rebinding wiki](https://en.wikipedia.org/wiki/DNS_rebinding) မှာ အသေးစိတ် ကြည့်ပါ)။

**ကာကွယ်နည်းများ**

- _SIGUSR1_ signal ပေါ်မှာ inspector ဖွင့်တာကို `process.on('SIGUSR1', ...)` listener ထည့်ပြီး disable လုပ်ပါ။
- Production မှာ inspector protocol ကို မသုံးပါနဲ့။

### Unauthorized Actor ဆီ Sensitive Information ပေါက်ကြားခြင်း (CWE-552)

Package publish လုပ်တဲ့အခါ — current directory ထဲက file/folder တွေ အားလုံးကို npm registry ဆီ တွန်းတင်ပါတယ်။ `.npmignore` နဲ့ `.gitignore` နဲ့ blocklist သတ်မှတ်တာ ဒါမှမဟုတ် `package.json` ထဲမှာ allowlist သတ်မှတ်တာနဲ့ ထိန်းချုပ်နိုင်ပါတယ်။

**ကာကွယ်နည်းများ**

- Publish မလုပ်ခင် `npm publish --dry-run` နဲ့ ဘယ် file တွေ publish ဖြစ်မယ်ဆိုတာ စာရင်းကြည့်ပြီး content တွေကို သေချာ ပြန်စစ်ပါ။
- `.gitignore`, `.npmignore` လိုမျိုး ignore files တွေ ဖန်တီး/ထိန်းသိမ်းပါ — ဘယ် file/folder တွေ မထုတ်သင့်ဘူးဆိုတာ သတ်မှတ်နိုင်ပါတယ်။ `package.json` ရဲ့ [files property](https://docs.npmjs.com/cli/configuring-npm/package-json#files) ကတော့ ပြောင်းပြန် — allowlist ပုံစံပါ။
- ပေါက်ကြားသွားခဲ့ရင် — package ကို [unpublish](https://docs.npmjs.com/unpublishing-packages-from-the-registry) လုပ်ဖို့ သေချာပါစေ။

### HTTP Request Smuggling (CWE-444)

ဒီ attack က HTTP server နှစ်ခု (ပုံမှန်အားဖြင့် proxy တစ်ခုနဲ့ Node.js application) ပါဝင်ပါတယ် — client က ပို့တဲ့ HTTP request က front-end server (proxy) ကို အရင်ဖြတ်ပြီး back-end server (application) ဆီ ရောက်ပါတယ်။ Front-end နဲ့ back-end က ambiguous HTTP requests တွေကို မတူညီစွာ interpret လုပ်တဲ့အခါ — attacker က front-end က မမြင်ရပေမယ့် back-end က မြင်ရမယ့် malicious message ပို့နိုင်ပြီး — proxy ကို ကျော်ပြီး "smuggle" လုပ်နိုင်ပါတယ် ([CWE-444](https://cwe.mitre.org/data/definitions/444.html) မှာ အသေးစိတ် ကြည့်ပါ)။

Node.js က request ကို HTTP specification ([RFC7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3)) နဲ့ ကိုက်ညီစွာ interpret လုပ်ရင် — အဲဒါက Node.js ထဲက vulnerability လို့ မသတ်မှတ်ပါဘူး။

**ကာကွယ်နည်းများ**

- HTTP Server ဖန်တီးတဲ့အခါ `insecureHTTPParser` option ကို မသုံးပါနဲ့။
- Front-end server ကို ambiguous requests တွေ normalize လုပ်အောင် configure လုပ်ပါ။
- Node.js ရော front-end server ရော — HTTP request smuggling vulnerability အသစ်တွေအတွက် အဆက်မပြတ် စောင့်ကြည့်ပါ။
- ဖြစ်နိုင်ရင် HTTP/2 ကို end-to-end သုံးပြီး HTTP downgrading ကို disable လုပ်ပါ။

### Timing Attacks ကနေတစ်ဆင့် Information Exposure (CWE-208)

ဒီ attack မှာ attacker က application က request တစ်ခုကို ဖြေကြားဖို့ ကြာတဲ့အချိန်ကို တိုင်းတာပြီး — sensitive information တွေ မှန်းဆသိရှိနိုင်ပါတယ်။ ဒီ attack က Node.js အတွက်ပဲ သီးသန့် မဟုတ်ဘဲ — runtime တိုင်းနီးပါးကို ပစ်မှတ်ထားနိုင်ပါတယ်။

ဥပမာ — application က secret ကို timing-sensitive operation ထဲ သုံးတဲ့အခါ (authentication လိုမျိုး) — built-in string comparison က တူညီတဲ့ length ရှိတဲ့ တန်ဖိုးတွေအတွက် အချိန်ပိုကြာပါတယ်။ Request response time တွေကို ယှဉ်ကြည့်ခြင်းအားဖြင့် attacker က password ရဲ့ length နဲ့ value ကို request အများကြီး ပို့ပြီး မှန်းဆနိုင်ပါတယ်။

**ကာကွယ်နည်းများ**

- Crypto API က ပေးတဲ့ `timingSafeEqual` function ကို သုံးပါ — actual နဲ့ expected sensitive values တွေကို constant-time algorithm နဲ့ ယှဉ်ပေးပါတယ်။
- Password ယှဉ်ဖို့ဆိုရင် native crypto module ထဲမှာပါတဲ့ [scrypt](https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback) ကို သုံးနိုင်ပါတယ်။
- ယေဘုယျအားဖြင့် — variable-time operations တွေထဲမှာ secrets တွေ သုံးတာ ရှောင်ပါ (secret ပေါ်မူတည်ပြီး branch ခွဲတာ၊ attacker နဲ့ infrastructure ချင်း အတူတူဆိုရင် secret ကို memory index အနေနဲ့ သုံးတာတွေပါ)။ Constant-time code ကို JavaScript နဲ့ ရေးတာ ခက်ပါတယ် (JIT ကြောင့်လည်း ပါတယ်) — crypto application တွေအတွက် built-in crypto APIs ဒါမှမဟုတ် WebAssembly သုံးပါ။

### Malicious Third-Party Modules (CWE-1357)

Node.js [threat model](https://github.com/nodejs/node/security/policy#the-nodejs-threat-model) အရ — malicious third-party module လိုအပ်တဲ့ အခြေအနေတွေက Node.js core ထဲက vulnerability လို့ **မသတ်မှတ်ပါဘူး** — Node.js က သူ့ကို run ခိုင်းတဲ့ code (dependencies အပါအဝင်) ကို trusted အဖြစ် သဘောထားလို့ပါ။ ဒါပေမယ့် malicious/compromised dependencies တွေက Node.js users တွေအတွက် အရေးကြီးဆုံး _application-level_ risks တွေထဲက တစ်ခုမို့ — အဲဒီလို သဘောထားပြီး ကိုင်တွယ်သင့်ပါတယ်။

Node.js မှာ package တိုင်းက network access လိုမျိုး အားကောင်းတဲ့ resource တွေကို ဝင်ရောက်သုံးနိုင်ပြီး — file system ကိုလည်း ဝင်လို့ရတာမို့ data ဘာကိုမဆို ဘယ်နေရာကိုမဆို ပို့နိုင်ပါတယ်။ Node process ထဲ run နေတဲ့ code တိုင်းက `eval()` (သို့ equivalent) သုံးပြီး နောက်ထပ် code တွေ load/run လုပ်နိုင်ပြီး — file system write access ရှိတဲ့ code တိုင်းလည်း file အသစ်/အဟောင်းတွေကို ရေးပြီး အဲဒီအတိုင်း အောင်မြင်နိုင်ပါတယ်။

**ဥပမာများ**

- Attacker က နာမည်ကြီး logging library တစ်ခုရဲ့ maintainer account ကို သိမ်းယူပြီး — logger initialize လုပ်တာနဲ့ environment variables တွေ (database passwords, access tokens စသည်) ကို remote server ဆီ ပို့တဲ့ version အသစ် ထုတ်လိုက်တာ မျိုး။
- နာမည်ကြီး framework တစ်ခုနဲ့ ဆင်တူတဲ့ နာမည်နဲ့ **typosquatting package** တစ်ခုကို npm registry မှာ publish လုပ်ပြီး — install လုပ်တာနဲ့ developer ရဲ့ machine ကနေ SSH keys တွေကို attacker ထိန်းချုပ်ထားတဲ့ endpoint ဆီ ပို့တဲ့ postinstall script run တာ မျိုး။

Dependency version တွေကို pin ထားပြီး — vulnerability တွေအတွက် common workflows ဒါမှမဟုတ် npm scripts တွေနဲ့ အလိုအလျောက် စစ်ဆေးမှု လုပ်ပါ။ Package install မလုပ်ခင် — ထိန်းသိမ်းမှု ရှိမရှိနဲ့ မျှော်လင့်ထားတဲ့ content တွေ ပါမပါ သေချာစစ်ပါ။ GitHub source code က publish ထားတဲ့ code နဲ့ အမြဲတမ်း အတူတူ မဟုတ်တာမို့ — _node_modules_ ထဲမှာ ပြန်စစ်ဆေးပါ။

#### Supply chain attacks

**Supply chain attack** ဆိုတာ Node.js application ရဲ့ dependency တစ်ခုခု (direct ဖြစ်ဖြစ် transitive ဖြစ်ဖြစ်) ကို compromise လုပ်ခံရတာပါ — dependency spec ပေါ်မှာ လျော့ရဲရဲ ထားလို့ (မလိုချင်တဲ့ update တွေ ဝင်လာတာ) နဲ့/ဒါမှမဟုတ် spec ထဲမှာ စာလုံးပေါင်း မှားလို့ ([typosquatting](https://en.wikipedia.org/wiki/Typosquatting) ခံရတာ) ဖြစ်တတ်ပါတယ်။ Upstream package တစ်ခုကို သိမ်းယူနိုင်တဲ့ attacker က malicious code ပါတဲ့ version အသစ် publish လုပ်နိုင်ပြီး — application က ဘယ် version လုံခြုံတယ်ဆိုတာ တင်းတင်းကျပ်ကျပ် မသတ်မှတ်ထားရင် — automatic update ကြောင့် malicious version အသစ် တက်သွားပြီး application ထိခိုက်နိုင်ပါတယ်။

`package.json` ထဲမှာ dependency ကို exact version ဒါမှမဟုတ် range နဲ့ သတ်မှတ်လို့ရပါတယ် — ဒါပေမယ့် exact version နဲ့ pin ထားရင်တောင် သူ့ရဲ့ transitive dependencies တွေက သူတို့ဘာသာ pin မဖြစ်ပါဘူး — ဒါကြောင့် မလိုချင်တဲ့/မမျှော်လင့်တဲ့ update တွေအတွက် အားနည်းချက် ကျန်နေပါသေးတယ်။

ဖြစ်နိုင်တဲ့ attack vectors တွေ:

- Typosquatting attacks
- Lockfile poisoning
- Compromised maintainers
- Malicious Packages
- Dependency Confusions

**ကာကွယ်နည်းများ**

- npm က arbitrary scripts run တာကို `--ignore-scripts` နဲ့ တားပါ — ကမ္ဘာလုံးဆိုင်ရာ disable လုပ်ချင်ရင် `npm config set ignore-scripts true` သုံးနိုင်ပါတယ်။
- Dependency version တွေကို range မဟုတ်ဘဲ — immutable version အတိအကျကို pin လုပ်ပါ။
- **Lockfiles** သုံးပါ — dependency အားလုံး (direct ရော transitive ရော) ကို pin ပေးတယ် ([lockfile poisoning ကာကွယ်နည်း](https://blog.ulisesgascon.com/lockfile-posioned) ကြည့်ပါ)။
- CI မှာ [`npm-audit`](https://docs.npmjs.com/cli/commands/npm-audit) လိုမျိုး tool တွေနဲ့ vulnerability အသစ်တွေကို အလိုအလျောက် စစ်ဆေးပါ — [Socket](https://socket.dev/) လို tool က static analysis နဲ့ network/filesystem access လိုမျိုး အန္တရာယ်ရှိတဲ့ behavior တွေကို ရှာဖွေပေးနိုင်ပါတယ်။
- `npm install` အစား [`npm ci`](https://docs.npmjs.com/cli/v8/commands/npm-ci) သုံးပါ — lockfile ကို တင်းတင်းကျပ်ကျပ် enforce လုပ်ပြီး — _package.json_ နဲ့ မကိုက်ညီရင် error ပြပါတယ်။
- _package.json_ ထဲက dependency နာမည်တွေမှာ error/typo ရှိမရှိ သေချာ စစ်ပါ။
- [`--min-release-age`](https://docs.npmjs.com/cli/v11/using-npm/config#min-release-age) (npm v11.10.0+) နဲ့ dependency cooldown သတ်မှတ်ပါ — မကြာသေးခင်က publish ထားတဲ့ packages တွေ install မဖြစ်အောင် လုပ်တာပါ။ တန်ဖိုးက ရက်နဲ့ သတ်မှတ်ပါတယ် (ဥပမာ `1` ဆို package က အနည်းဆုံး တစ်ရက် သက်တမ်းရှိရမယ်) — compromised packages အများစုက နာရီပိုင်းအတွင်း ရှာဖွေတွေ့ရှိပြီး ဖယ်ရှားခံရလို့ — တစ်ရက်လောက် cooldown ထားရုံနဲ့ short-lived supply chain attacks အများစုကနေ ကာကွယ်ပြီးသားပါ:
  ```ini
  min-release-age=1
  ```
  Security fix တွေ ချက်ချင်း လိုအပ်ရင်တော့ command အလိုက် override လုပ်နိုင်ပါတယ် — `npm install package-name --min-release-age=0`။ Known vulnerability ရှိတဲ့ packages တွေကို ဖော်ထုတ်ဖို့ `npm audit` သုံးပါ။

### Memory Access Violation (CWE-284)

Memory-based/heap-based attacks တွေက memory management errors နဲ့ exploitable memory allocator တွေကို ပေါင်းစပ်ပြီး မှီခိုပါတယ်။ Runtime တိုင်းလိုပဲ — project တွေ shared machine ပေါ်မှာ run နေရင် Node.js လည်း ဒီ attacks တွေ ခံနိုင်ပါတယ်။ **Secure heap** က pointer overruns/underruns တွေကြောင့် sensitive information တွေ ပေါက်ကြားတာကို တားဆီးဖို့ အသုံးဝင်ပါတယ် — ဒါပေမယ့် Windows မှာ secure heap မရနိုင်ပါဘူး ([secure-heap documentation](https://nodejs.org/dist/latest-v18.x/docs/api/cli.html#--secure-heapn) ကြည့်ပါ)။

**ကာကွယ်နည်းများ**

- Application အလိုက် `--secure-heap=n` သုံးပါ — `n` က ခွင့်ပြုထားတဲ့ အများဆုံး byte size ပါ။
- Production app ကို shared machine ပေါ်မှာ မလည်ပတ်ပါနဲ့။

### Monkey Patching (CWE-349)

**Monkey patching** ဆိုတာ runtime မှာ property တွေကို ပြုပြင်ပြီး — ရှိပြီးသား behavior ကို ပြောင်းလဲဖို့ ကြိုးစားတာပါ။ ဥပမာ:

```js
Array.prototype.push = function (item) {
  // overriding the global [].push
};
```

**ကာကွယ်နည်းများ**

`--frozen-intrinsics` flag က frozen intrinsics (experimental feature — production မှာ experimental features သုံးတာအကြောင်း အောက်မှာ ဖတ်ပါ) တွေကို ဖွင့်ပေးပါတယ် — built-in JavaScript objects/functions တွေ အားလုံးကို recursively freeze လုပ်လိုက်တာပါ။ ဒါကြောင့် အောက်က snippet က `Array.prototype.push` ရဲ့ default behavior ကို **override လုပ်နိုင်တော့မှာ မဟုတ်ပါဘူး**:

```js
Array.prototype.push = function (item) {
  // overriding the global [].push
};

// Uncaught:
// TypeError <Object <Object <[Object: null prototype] {}>>>:
// Cannot assign to read only property 'push' of object ''
```

ဒါပေမယ့် `globalThis` သုံးပြီး globals အသစ် သတ်မှတ်တာ၊ ရှိပြီးသား globals တွေကို အစားထိုးတာတော့ လုပ်နိုင်တုန်းပဲ ဆိုတာ သတိပြုပါ:

```console
> globalThis.foo = 3; foo; // you can still define new globals
3
> globalThis.Array = 4; Array; // However, you can also replace existing globals
4
```

ဒါကြောင့် globals တွေ ဘယ်တော့မှ အစားမခံရအောင် `Object.freeze(globalThis)` ကို သုံးနိုင်ပါတယ်။

### Prototype Pollution Attacks (CWE-1321)

Node.js [threat model](https://github.com/nodejs/node/security/policy#the-nodejs-threat-model) အရ — attacker က user input ကို ထိန်းချုပ်လို့ ဖြစ်တဲ့ prototype pollution က Node.js core ထဲက vulnerability လို့ မသတ်မှတ်ပါဘူး (application code က ပေးတဲ့ inputs တွေကို Node.js က trust လုပ်လို့)။ ဒါပေမယ့် prototype pollution က Node.js applications နဲ့ third-party libraries တွေအတွက် ဆိုးရွားတဲ့ vulnerability class တစ်ခုမို့ — application နဲ့ dependency အဆင့်မှာ ကာကွယ်ရေး အကောင်အထည်ဖော်သင့်ပါတယ်။

**Prototype pollution** ဆိုတာ built-in prototypes တွေကနေ အမွေဆက်ခံထားတဲ့ `__proto__`, `constructor`, `prototype` စတဲ့ property တွေကို အလွဲသုံးပြီး — JavaScript language items တွေထဲကို property အသစ်တွေ ပြုပြင်/ထည့်သွင်းနိုင်တာပါ:

```js
const a = { a: 1, b: 2 };
const data = JSON.parse('{"__proto__": { "polluted": true}}');

const c = Object.assign({}, a, data);
console.log(c.polluted); // true

// Potential DoS
const data2 = JSON.parse('{"__proto__": null}');
const d = Object.assign(a, data2);
d.hasOwnProperty('b'); // Uncaught TypeError: d.hasOwnProperty is not a function
```

ဒါက JavaScript language ကနေ အမွေရလာတဲ့ potential vulnerability ပါ။

**ဥပမာများ:**

- [CVE-2022-21824](https://www.cvedetails.com/cve/CVE-2022-21824/) (Node.js)
- [CVE-2018-3721](https://www.cvedetails.com/cve/CVE-2018-3721/) (3rd Party library: Lodash)

နောက်ထပ် ဖြစ်ရပ်တွေ ပါဝင်ပါတယ် — web API တစ်ခုက untrusted JSON request bodies တွေကို validation မလုပ်ဘဲ shared configuration object ထဲ merge လုပ်တာ (attacker က `__proto__` property ပါတဲ့ payload ပို့ပြီး process ထဲက object တွေ အများကြီးကို မမျှော်လင့်တဲ့ properties တွေ ထည့်လိုက်တာ)၊ template rendering service တစ်ခုက user-controlled options တွေကို deep merge utility ထဲ တိုက်ရိုက် ထည့်လိုက်လို့ `Object.prototype` ကို pollute လုပ်ခံရပြီး security checks တွေ ကျော်လွှားခံရတာမျိုး စသဖြင့်ပါ။

**ကာကွယ်နည်းများ**

- [Insecure recursive merges](https://gist.github.com/DaniAkash/b3d7159fddcff0a9ee035bd10e34b277#file-unsafe-merge-js) တွေကို ရှောင်ပါ ([CVE-2018-16487](https://www.cve.org/CVERecord?id=CVE-2018-16487) ကြည့်ပါ)။
- External/untrusted requests တွေအတွက် JSON Schema validations သုံးပါ။
- Prototype မပါတဲ့ objects တွေကို `Object.create(null)` နဲ့ ဖန်တီးပါ။
- Prototype ကို `Object.freeze(MyObject.prototype)` နဲ့ freeze လုပ်ပါ။
- `Object.prototype.__proto__` property ကို `--disable-proto` flag နဲ့ disable လုပ်ပါ။
- Property က prototype ကနေ မဟုတ်ဘဲ object ပေါ်မှာ တိုက်ရိုက် ရှိမရှိ `Object.hasOwn(obj, keyFromObj)` နဲ့ စစ်ပါ။
- `Object.prototype` ကနေ method တွေ သုံးတာ ရှောင်ပါ။

### Uncontrolled Search Path Element (CWE-427)

Node.js [threat model](https://github.com/nodejs/node/security/policy#the-nodejs-threat-model) က Node.js ဝင်ရောက်နိုင်တဲ့ environment ထဲက file system ကို trusted အဖြစ် သတ်မှတ်ပါတယ် — ဒါကြောင့် အဲဒီနေရာတွေမှာ file တွေကို ထိန်းချုပ်ရုံနဲ့ ရတဲ့ ပြဿနာတွေက Node.js core ထဲက vulnerabilities တွေ မဟုတ်ပါဘူး — ဒါပေမယ့် deployment နဲ့ supply chain တစ်ခုလုံးရဲ့ လုံခြုံရေးအတွက်တော့ သက်ဆိုင်လို့ environment ကို မာကြောအောင် (harden) လုပ်ပြီး အောက်က mechanism တွေ သုံးသင့်ပါတယ်။

Node.js က module တွေကို [Module Resolution Algorithm](https://nodejs.org/api/modules.html#modules_all_together) အတိုင်း load လုပ်တာမို့ — module တစ်ခုကို `require` လုပ်တဲ့ directory ကို trusted လို့ ယူဆပါတယ်။ ဥပမာ အောက်ပါ directory structure ရှိတယ် ဆိုပါစို့:

- _app/_
  - _server.js_
  - _auth.js_
  - _auth_

`server.js` ထဲမှာ `require('./auth')` သုံးရင် — module resolution algorithm အတိုင်း _auth.js_ အစား _auth_ ကို load ပါလိမ့်မယ် — ဒါက မျှော်လင့်ထားတဲ့ application behavior ပါ။

## Node.js Permission Model

Node.js က **permission model** တစ်ခု ထောက်ပံ့ပေးပါတယ် — process တစ်ခုကို runtime မှာ ဘာတွေ လုပ်ခွင့်ရှိလဲ ကန့်သတ်ဖို့ သုံးနိုင်ပါတယ် (Node.js [threat model](https://github.com/nodejs/node/security/policy#the-nodejs-threat-model) ကို ဖြည့်စွက်ပေးတဲ့ သဘောပါ)။

ဖွင့်ထားရင် (ဥပမာ `--permission` flag နဲ့) — permission model က sensitive capabilities တွေကို ရွေးချယ်ခွင့်ပြု/ငြင်းပယ် လုပ်နိုင်ပါတယ်:

- File system ဖတ်/ရေး လုပ်တာ
- Network access (inbound ရော outbound ရော)
- Child process ဖန်တီးတာ
- Native addons နဲ့ တခြား အားကောင်းတဲ့ APIs သုံးတာ

ဒါက malicious/compromised dependencies တွေ၊ untrusted configuration တွေ၊ ကိုယ့် code ထဲက မမျှော်လင့်တဲ့ behavior တွေရဲ့ ထိခိုက်မှုကို ထိန်းချုပ်ပေးနိုင်ပါတယ် — ဘာကြောင့်လဲဆိုတော့ trusted code တောင်မှ ကိုယ် ခွင့်ပြုထားတဲ့ permissions အပြင်က အလုပ်တွေ လုပ်ဖို့ တားဆီးခံရလို့ပါ။ Flag တွေနဲ့ options တွေ နောက်ဆုံးရအခြေအနေအတွက် [Node.js permissions documentation](https://nodejs.org/api/permissions.html#permission-model) ကို ကြည့်ပါ။

## Production မှာ Experimental Features

Production မှာ experimental features သုံးတာ အကြံမပြုပါဘူး — Experimental features တွေက လိုအပ်ရင် breaking changes ဖြစ်နိုင်ပြီး — သူတို့ရဲ့ functionality က လုံခြုံစွာ stable မဟုတ်သေးလို့ပါ။ Feedback တွေကတော့ လှိုက်လှိုက်လှဲလှဲ ကြိုဆိုပါတယ်။

## OpenSSF Tools

[OpenSSF](https://openssf.org/) က npm package publish ဖို့ စီစဉ်နေတာမျိုးဆိုရင် အသုံးဝင်မယ့် initiatives တွေ ဦးဆောင်နေပါတယ်:

- [OpenSSF Scorecard](https://securityscorecards.dev/) — open source project တွေကို automated security risk checks တွေနဲ့ အကဲဖြတ်ပေးပါတယ် — code base ထဲက vulnerabilities/dependencies တွေကို ကြိုတင် အကဲဖြတ်ဖို့ သုံးနိုင်ပါတယ်။
- [OpenSSF Best Practices Badge Program](https://bestpractices.coreinfrastructure.org/en) — project တွေက best practice တစ်ခုချင်းစီကို ဘယ်လို လိုက်နာထားလဲ ဖော်ပြပြီး self-certify လုပ်နိုင်ပြီး — project မှာ ထည့်လို့ရတဲ့ badge တစ်ခု ထုတ်ပေးပါတယ်။

[OpenJS Security Collaboration Space](https://github.com/openjs-foundation/security-collab-space) ကနေတစ်ဆင့် တခြား projects တွေနဲ့ security experts တွေနဲ့လည်း ပူးပေါင်းဆောင်ရွက်နိုင်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Development နဲ့ Production ကွာခြားချက်](/docs/nodejs/nodejs-the-difference-between-development-and-production) — production environment ပြင်ဆင်ခြင်း
- [Node.js environment variables](/docs/nodejs/nodejs-environment-variables) — config တွေကို environment ကနေ စီမံခြင်း
- [Event Loop ကို မပိတ်ဆို့ပါနဲ့](/docs/nodejs/dont-block-the-event-loop) — DoS ခံနိုင်ရည်နဲ့ ဆိုင်တဲ့ application design
