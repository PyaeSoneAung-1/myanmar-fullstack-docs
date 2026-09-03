---
title: "Newman ရဲ့ external နဲ့ custom reporters တွေ သုံးခြင်း (Use Newman external and custom reporters)"
description: "Newman မှာ collection run reports တွေ ထုတ်ဖို့ custom reporters တွေ တည်ဆောက်ခြင်းနဲ့ external/custom reporters တွေကို install လုပ်ပြီး သုံးနည်း"
order: 153
source: "https://learning.postman.com/docs/reference/newman-cli/newman-custom-reporters/"
status: translated
updated: 2026-09-03
---

Newman မှာ သင့် collection runs တွေအတွက် reports တွေကို custom နဲ့ external reporters တွေနဲ့ ထုတ်နိုင်ပါတယ်။ သတ်သတ်မှတ်မှတ် use cases တွေအတွက် reports တွေ ထုတ်နိုင်ပါတယ် — ဥပမာ — request တစ်ခု ဒါမှမဟုတ် test တစ်ခု fail ဖြစ်တဲ့အခါ response body ကို log လုပ်တာမျိုးပါ။ Reports တွေ ထုတ်ဖို့ ရှိပြီးသား external reporters တွေကို သုံးနိုင်သလို — ကိုယ်ပိုင် custom reporters တွေကိုလည်း တည်ဆောက်နိုင်ပါတယ်။

## Custom reporters တွေ တည်ဆောက်ခြင်း

Custom reporter တစ်ခုဆိုတာ `newman-reporter-<name>` ပုံစံနဲ့ နာမည်ရှိတဲ့ Node.js module တစ်ခုပါ။

Custom reporter တစ်ခု ဖန်တီးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ကိုယ်ရွေးချယ်တဲ့ directory တစ်ခုထဲမှာ — `npm init` နဲ့ npm package အလွတ်တစ်ခု ဖန်တီးပါ။

2. အောက်ပါ ပုံစံအတိုင်း function တစ်ခုကို export လုပ်တဲ့ `index.js` file တစ်ခု ထည့်ပါ:

   ```javascript wordWrap
   function CustomNewmanReporter (emitter, reporterOptions, collectionRunOptions) {
     // emitter is is an event emitter that triggers the following events: https://github.com/postmanlabs/newman#newmanrunevents
     // reporterOptions is an object of the reporter specific options. The usage examples below have more details.
     // collectionRunOptions is an object of all the collection run options: https://github.com/postmanlabs/newman#newmanrunoptions-object--callback-function--run-eventemitter
   }
   module.exports = CustomNewmanReporter
   ```

3. Reporter ကို local မှာ သုံးဖို့ — `npm pack` ကို သုံးပြီး TGZ file တစ်ခု ဖန်တီးပါ။ ဒါကို `npm i -g newman-reporter-<name>.<version>.tgz` နဲ့ install လုပ်နိုင်ပါတယ်။ [External နဲ့ custom reporters တွေ သုံးခြင်း](#external-နဲ့-custom-reporters-တွေ-သုံးခြင်း) အကြောင်း ပိုလေ့လာပါ။

   `@myorg/newman-reporter-<name>` လိုမျိုး scoped reporter package names တွေကိုလည်း support လုပ်ပါတယ်။

4. (Optional) `npm publish` ကို သုံးပြီး ကိုယ့် reporter ကို npm ပေါ် publish လုပ်နိုင်ပါတယ်။

## External နဲ့ custom reporters တွေ သုံးခြင်း

External ဒါမှမဟုတ် custom reporter တစ်ခုကို သုံးဖို့ — အရင်ဆုံး install လုပ်ရပါမယ်။ ဥပမာ — [Newman HTML reporter](https://github.com/postmanlabs/newman-reporter-html) ကို သုံးဖို့ — reporter package ကို install လုပ်ပါ:

```bash
npm install newman-reporter-html
```

Reporter က Newman ရဲ့ event sequence နဲ့ အလုပ်လုပ်နိုင်မယ်ဆိုရင် — Newman နဲ့အတူ external reporters တွေကို သုံးနိုင်ပါတယ်။ [Newman reporters တွေ ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ ဥပမာတွေ](https://github.com/postmanlabs/newman/tree/develop/lib/reporters) ကို ကြည့်ပါ။

Package ရဲ့ နာမည်က `newman-reporter-<name>` ပုံစံအတိုင်း ဖြစ်ပြီး — `<name>` က reporter ရဲ့ နာမည်ပါ။ Newman ကို global အနေနဲ့ install လုပ်ထားရင် installation က global ဖြစ်ပြီး — တခြားအခြေအနေတွေမှာတော့ local ဖြစ်ပါတယ်။ Global installation အတွက် — `npm install ...` ကို `-g` flag နဲ့ run ပါ။

Local (မထုတ်ဝေရသေးတဲ့) reporters တွေကို သုံးဖို့ အောက်ပါ command ကို run ပါ:

```bash
npm install <path/to/local-reporter-directory>
```

Install လုပ်ထားတဲ့ reporter ကို command-line tool နဲ့ဖြစ်စေ programmatically ဖြစ်စေ သုံးနိုင်ပါတယ်။ ဘယ်လိုပဲ သုံးသုံး — options တွေထဲမှာ reporter name ကို သတ်မှတ်တဲ့အခါ `newman-reporter` prefix က မလိုအပ်ပါဘူး။

Command line ပေါ်မှာ:

```bash wordWrap
newman run /path/to/collection.json -r myreporter --reporter-myreporter-<option-name> <option-value> # The option is optional
```

Programmatically အနေနဲ့:

```js
var newman = require('newman');

newman.run({
  collection: '/path/to/collection.json',
  reporters: 'myreporter',
  reporter: {
    myreporter: {
      'option-name': 'option-value' // this is optional
    }
  }
}, function (err, summary) {
  if (err) { throw err; }
  console.info('collection run complete!');
});
```

Scoped reporter packages တွေကို scope prefix နဲ့တကွ သတ်မှတ်ရပါမယ်။ ဥပမာ — package နာမည်က `@myorg/newman-reporter-name` ဆိုရင် — reporter ကို `@myorg/name` နဲ့ သတ်မှတ်ရပါမယ်။

ဒီဥပမာတွေထဲမှာ သုံးထားတဲ့ reporter options တွေက optional ပါ။
