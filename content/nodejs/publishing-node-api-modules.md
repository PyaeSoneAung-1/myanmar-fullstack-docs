---
title: "Node-API Package ထုတ်ဝေခြင်း (Publishing Node-API Modules)"
description: "Node-API version package ကို non-Node-API version နဲ့ တွဲပြီး ထုတ်ဝေခြင်း — npm publish --tag n-api, semver pre-release versioning, package.json ထဲမှာ tagged version ကို dependency အဖြစ် သုံးခြင်း"
order: 60
source: "https://nodejs.org/learn/modules/publishing-node-api-modules"
status: translated
updated: 2026-09-02
---

Native addon package တစ်ခုမှာ — Node-API version နဲ့ non-Node-API version နှစ်မျိုးလုံးကို တစ်ပြိုင်နက် ထောက်ပံ့ချင်တယ်ဆိုရင် — အောက်ပါ နည်းလမ်းအတိုင်း ထုတ်ဝေနိုင်ပါတယ်။ ဥပမာအနေနဲ့ `iotivity-node` package ကို သုံးပြီး ရှင်းပြပါမယ်။

## ထုတ်ဝေပုံ အဆင့်များ

ပထမဆုံး — **non-Node-API version** ကို ဦးစွာ ထုတ်ဝေပါ:

1. `package.json` ထဲက version ကို တိုးပါ။ `iotivity-node` အတွက်ဆိုရင် version က `1.2.0-2` ဖြစ်သွားပါမယ်။
2. Release checklist ကို ဖြတ်ကျော်ပါ (tests/demos/docs တွေ အဆင်ပြေကြောင်း သေချာစေခြင်း)။
3. `npm publish` run လုပ်ပါ။

ပြီးရင် — **Node-API version** ကို ထုတ်ဝေပါ:

1. `package.json` ထဲက version ကို တိုးပါ။ `iotivity-node` အတွက်ဆိုရင် version က `1.2.0-3` ဖြစ်သွားပါမယ်။ Versioning အတွက် [semver.org](https://semver.org) မှာ ဖော်ပြထားတဲ့ **pre-release version scheme** ကို လိုက်နာဖို့ အကြံပြုပါတယ် — ဥပမာ `1.2.0-napi` လိုမျိုးပါ။
2. Release checklist ကို ဖြတ်ကျော်ပါ (tests/demos/docs တွေ အဆင်ပြေကြောင်း သေချာစေခြင်း)။
3. `npm publish --tag n-api` run လုပ်ပါ။

ဒီဥပမာမှာ — version 1.2.0-3 က non-Node-API ဖြစ်တဲ့ ထုတ်ဝေပြီးသား version (1.2.0-2) ထက် နောက်ကျတဲ့ version ဖြစ်ပေမယ့် — release ကို `n-api` tag နဲ့ ထုတ်ဝေထားလို့ ဖြစ်ပါတယ်: တစ်စုံတစ်ယောက်က `npm install iotivity-node` လို့ ရိုးရိုး run လုပ်ရင် Node-API version (1.2.0-3) တက်မလာဘဲ — **non-Node-API version ကိုပဲ default အနေနဲ့ ရပါလိမ့်မယ်**။ Node-API version ကို လိုချင်တဲ့သူကတော့ —

```bash
npm install iotivity-node@n-api
```

လို့ run လုပ်ရပါမယ်။ npm မှာ tags အသုံးပြုပုံ အသေးစိတ်ကို [Using dist-tags](https://docs.npmjs.com/cli/v10/commands/npm-dist-tag) မှာ ကြည့်ရှုနိုင်ပါတယ်။

## Node-API version ကို dependency အဖြစ် ထည့်သွင်းခြင်း

Project တစ်ခုထဲမှာ `iotivity-node` ရဲ့ Node-API version ကို dependency အဖြစ် ထည့်ချင်ရင် `package.json` က ဒီလို ဖြစ်ပါမယ်:

```json
"dependencies": {
  "iotivity-node": "n-api"
}
```

[Using dist-tags](https://docs.npmjs.com/cli/v10/commands/npm-dist-tag) မှာ ရှင်းပြထားသလို — ပုံမှန် version တွေနဲ့ မတူဘဲ **tagged version တွေကို version ranges** (`"^2.0.0"` လိုမျိုး) **နဲ့ ညွှန်းလို့ မရပါဘူး**။ အကြောင်းရင်းက — tag က version တစ်ခုတည်းကိုပဲ ရည်ညွှန်းလို့ပါ။ ဒါကြောင့် — package maintainer က tag တစ်ခုတည်းကိုပဲ သုံးပြီး package ရဲ့ နောက်ပိုင်း version တစ်ခုကို ထုတ်ဝေခဲ့မယ်ဆိုရင် — `npm update` လုပ်တဲ့အခါ နောက်ကျတဲ့ version ကို ရပါလိမ့်မယ်။ ဒါက ကိစ္စအများစုမှာ လက်ခံနိုင်လောက်ပါတယ်။ Latest ထုတ်ဝေထားတဲ့ version မဟုတ်ဘဲ တခြား version တစ်ခုကို အတိအကျ လိုအပ်ရင်တော့ — `package.json` ထဲက dependency က version အတိအကျကို ညွှန်းရပါမယ်:

```json
"dependencies": {
  "iotivity-node": "1.2.0-3"
}
```
