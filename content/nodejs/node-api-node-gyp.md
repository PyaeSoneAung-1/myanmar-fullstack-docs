---
title: "node-gyp (Native Addon များအတွက် Standard Build Tool)"
description: "Native Node.js addon တွေအတွက် standard build tool — npm နဲ့အတူ ပါလာပုံ, GYP format အပေါ် အခြေခံမှု, gypfile, Python လိုအပ်ချက်, အားသာချက် အားနည်းချက်များ"
order: 80
source: "https://nodejs.org/learn/node-api/build-tools/node-gyp"
status: translated
updated: 2026-09-02
---

[node-gyp](https://github.com/nodejs/node-gyp) က native Node.js addon တွေအတွက် standard build tool ဖြစ်ပြီး — npm ecosystem ထဲက package အများစုက ၎င်းကို သုံးပါတယ်။ Node.js team က တက်ကြွစွာ ထိန်းသိမ်း နေပါတယ်။ ဒီ site ပေါ်က ဥပမာ အများစုကလည်း binaries တွေကို တည်ဆောက်ဖို့ node-gyp ကိုပဲ သုံးထားပါတယ်။

node-gyp က Google ရဲ့ [GYP](https://gyp.gsrc.io/) build tool ပေါ်မှာ အခြေခံပါတယ်။ GYP က C/C++ builds တွေအတွက် platform အားလုံးမှာ အလုပ်လုပ်တဲ့ configuration format တစ်ခုတည်းကို ပေးပါတယ်။ Google က upstream GYP repository ကို archive လုပ်ထားပေမယ့် — node-gyp ကတော့ [gyp-next](https://github.com/nodejs/gyp-next) ကနေတစ်ဆင့် တက်ကြွစွာ ဆက်လက် ဖွံ့ဖြိုးတိုးတက် ထိန်းသိမ်းနေဆဲ ဖြစ်ပါတယ်။

> node-gyp က **Python 3.6 (သို့) နောက်ပိုင်း** လိုအပ်ပါတယ်။ Python 2 ကို ထောက်ပံ့မထားပါ။ Platform တစ်ခုချင်းစီအတွက် လိုအပ်ချက် အပြည့်အစုံကို [node-gyp installation docs](https://github.com/nodejs/node-gyp#installation) မှာ ကြည့်နိုင်ပါတယ်။

node-gyp က npm နဲ့အတူ ပါဝင်ပါတယ် — `package.json` ထဲမှာ `"gypfile": true` ကို npm က တွေ့တဲ့အခါ — `npm install` လုပ်ချိန်မှာ node-gyp ကို အလိုအလျောက် ခေါ်ယူပါတယ်။ တစ်နည်းအားဖြင့် — node-gyp ကို သီးခြား install လုပ်ပြီးလည်း တိုက်ရိုက် သုံးနိုင်ပါတယ်:

```bash
npm install -g node-gyp
```

node-gyp က သင့်အတွက် အကန့်အသတ် များလွန်းတယ်လို့ ထင်ရတဲ့ developer တွေအတွက် — [CMake.js](/docs/nodejs/node-api-cmake-js) က ကောင်းတဲ့ အခြားရွေးချယ်စရာ တစ်ခုပါ။

### အားသာချက်များ (Pros)

- npm နဲ့အတူ ပါဝင်တယ် — သုံးစွဲသူ (consumer) တွေအတွက် သီးခြား global install မလိုဘူး။
- Node.js ecosystem မှာ နီးပါး အားလုံးက သုံးတယ် — documentation နဲ့ community အသိပညာ ကျယ်ပြန့်စွာ ရှိတယ်။
- `binding.gyp` configuration file တစ်ခုတည်းကနေ Windows, macOS နဲ့ Linux သုံးခုလုံးကို ထောက်ပံ့တယ်။

### အားနည်းချက်များ (Cons)

- အောက်ခံ GYP format ကို Google က တက်ကြွစွာ ဆက်လက် ဖွံ့ဖြိုးမှု မရှိတော့ဘူး။
- GYP ရဲ့ configuration syntax က ရှည်လျားလွန်း (verbose) တယ် (သို့) debug လုပ်ရခက်တယ်လို့ developer တချို့က ထင်ကြတယ်။
