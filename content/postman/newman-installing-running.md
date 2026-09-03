---
title: "Newman ကို install လုပ်ပြီး run လုပ်ခြင်း (Install and run Newman)"
description: "Newman ကို install လုပ်ပြီး command line ကနေ Postman Collections တွေ run လုပ်နည်း — collection file, URL ဒါမှမဟုတ် environment နဲ့ run ခြင်း, exit codes သုံးပြီး CI/CD နဲ့ ပေါင်းစပ်ခြင်း, Newman ကို Node.js library အဖြစ် သုံးခြင်း"
order: 149
source: "https://learning.postman.com/docs/reference/newman-cli/installing-running-newman/"
status: translated
updated: 2026-09-03
---

Newman ကို [Node.js](https://nodejs.org/en/about) ပေါ်မှာ တည်ဆောက်ထားပါတယ်။ စတင်ဖို့ — အရင်ဆုံး Node.js ကို install လုပ်ပါ၊ ပြီးရင် Newman ကို install လုပ်ပါ။ Newman ကို install လုပ်ပြီးတာနဲ့ — သင့် Postman Collections တွေကို command line ကနေ run လုပ်နိုင်ပါတယ်။ Collections တွေကို export လုပ်ထားတဲ့ JSON file တစ်ခုအနေနဲ့ဖြစ်စေ၊ Newman ဆီ collection ရဲ့ URL ကို ပေးပြီးဖြစ်စေ run လို့ရပါတယ်။

## Newman ကို install လုပ်ခြင်း

Newman ကို install မလုပ်ခင် — Node.js v16 ဒါမှမဟုတ် နောက်ပိုင်း version ကို install လုပ်ထားကြောင်း သေချာပါစေ။ သင့် continuous integration (CI) system အတွက် [Node.js ကို download လုပ်ရန် steps တွေ](https://nodejs.org/en/download/package-manager/) ကို လိုက်နာပါ။ (CI system တချို့မှာ Node.js ကို ကြိုတင် install လုပ်ပေးတဲ့ configurations တွေ ရှိပါတယ်။)

အစောပိုင်း Newman version တစ်ခုကို သုံးနေတယ်ဆိုရင် — [Node.js version နဲ့ Newman ရဲ့ compatibility](https://github.com/postmanlabs/newman#nodejs) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

Newman ကို သင့် system ရဲ့ ဘယ်နေရာကမဆို run လို့ရအောင် global အနေနဲ့ install လုပ်ပါ။ အောက်ပါ command ကို သုံးပါ:

```bash
npm install -g newman
```

### Newman ကို update လုပ်ခြင်း

Newman ကို install လုပ်ပြီးသားဆိုရင် — နောက်ပိုင်း version တစ်ခုဆီ upgrade လုပ်နိုင်ပါတယ်။ [Newman ရဲ့ နောက်ပိုင်း version တစ်ခုဆီ upgrade လုပ်ခြင်း](https://github.com/postmanlabs/newman/blob/develop/MIGRATION.md) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Newman နဲ့ collection တစ်ခုကို run လုပ်ခြင်း

Newman နဲ့ collection တစ်ခုကို run လုပ်ဖို့ — အရင်ဆုံး collection ကို JSON file တစ်ခုအနေနဲ့ [export လုပ်ပါ](https://learning.postman.com/docs/getting-started/importing-and-exporting/exporting-data/#export-collections)။ ပြီးရင် သင့် file system ကနေ အောက်ပါ command နဲ့ collection ကို run လုပ်ပါ:

```bash
newman run my-collection.json
```

သင့် team ရဲ့ [Postman Package Library](/docs/postman/package-library) ထဲက packages တွေမှာ ရှိတဲ့ scripts နဲ့ tests တွေကို Newman နဲ့ run လို့မရပါဘူး။ Packages တွေရဲ့ ပါဝင်တဲ့အရာတွေကို command line ကနေ run ဖို့ — [Postman CLI](/docs/postman/postman-cli-overview) ကို သုံးပါ။

### Collection တစ်ခုကို URL နဲ့ run လုပ်ခြင်း

Collection ရဲ့ URL ကို Newman ဆီ ပေးပြီးလည်း collection တစ်ခုကို run လို့ရပါတယ်။ အောက်ပါ ဥပမာမှာ — `<collection-id>` နေရာမှာ ကိုယ် run ချင်တဲ့ collection ရဲ့ ID ကို အစားထိုးပါ:

```bash
newman run https://www.postman.com/collections/<collection-id>
```

Collection ID ကို Postman ထဲမှာ ရှာနိုင်ပါတယ်။ အရင်ဆုံး sidebar ထဲက **Collections** ကို ချဲ့ပြီး collection တစ်ခုကို ရွေးပါ။ ပြီးရင် right sidebar ထဲက **Info** ကို နှိပ်ပြီး collection ID ကို ကြည့်ရှုပြီး ကူးယူနိုင်ပါတယ်။

Collection URL က အများသုံး (public) မဟုတ်ဘူးဆိုရင် — Newman နဲ့ collection ကို run ဖို့ [Postman API ကို သုံးနိုင်ပါတယ်](https://github.com/postmanlabs/newman?tab=readme-ov-file#using-newman-with-the-postman-api)။

### Collection တစ်ခုကို environment နဲ့ run လုပ်ခြင်း

Collection က environment variables တွေ သုံးထားတယ်ဆိုရင် — collection ထဲမှာ သုံးထားတဲ့ [environment](/docs/postman/managing-environments) ကို ပေးရပါမယ်။ Environment ကို Postman ကနေ [export လုပ်](https://learning.postman.com/docs/getting-started/importing-and-exporting/exporting-data/#export-environments)ပြီး `-e` flag နဲ့အတူ ထည့်ပါ။ ဥပမာ:

```bash
newman run my-collection.json -e dev-environment.json
```

Newman က OAuth 2.0 authentication ကို support မလုပ်ပါဘူး။ Newman နဲ့အတူ OAuth 2.0 token တစ်ခု ဘယ်လို သုံးမလဲ လေ့လာဖို့ — [OAuth 2.0 overview](/docs/postman/oauth-20) ကို ကြည့်ပါ။

### Failing tests တွေပါတဲ့ collection run ဥပမာ

အောက်ပါ ဥပမာက failing tests တွေပါတဲ့ Newman collection run တစ်ခုရဲ့ ရလဒ်တွေကို ပြသပါတယ်။

*(Newman test ဥပမာ — failing tests ပါတဲ့ collection run တစ်ခုရဲ့ output screenshot)*

Output ထဲက `test-scripts` ဆိုတာ [post-response scripts](/docs/postman/test-scripts) တွေကို ရည်ညွှန်းပါတယ်။ Newman က pre-request နဲ့ post-response scripts တွေအတွက် Postman နဲ့အတူတူပဲ [libraries နဲ့ objects](/docs/postman/sandbox-overview) တွေကို support လုပ်ပါတယ်။

Run ရလဒ်တွေကို requests နဲ့ tests အားလုံး အပါအဝင် file တစ်ခုဆီ export လုပ်ဖို့ [Newman ရဲ့ built-in reporters](/docs/postman/newman-built-in-reporters) တွေကို သုံးနိုင်ပါတယ်။

## Collection run တစ်ခုကို customize လုပ်ခြင်း

Newman မှာ collection run တစ်ခုကို customize လုပ်ဖို့ options အစုံအလင် ပါပါတယ်။ ပိုလေ့လာချင်ရင် — [Newman command reference](/docs/postman/newman-options) ကို ကြည့်ပါ။

## Newman ကို CI/CD နဲ့ သုံးခြင်း

ပုံမှန်အားဖြင့် Newman က — exception တစ်ခုမှ မရှိဘဲ အရာအားလုံး မျှော်လင့်ထားတဲ့အတိုင်း run ပြီးသွားရင် `0` ဆိုတဲ့ status code နဲ့ ထွက်ပါတယ်။ Newman ရဲ့ exit codes တွေပေါ် မူတည်ပြီး — build တစ်ခုကို pass ဒါမှမဟုတ် fail ဖြစ်စေဖို့ သင့် continuous integration (CI) tool ကို configure လုပ်နိုင်ပါတယ်။

Test case error တစ်ခု ကြုံရတဲ့အခါ `1` ဆိုတဲ့ status code နဲ့ run တစ်ခုကို ရပ်စေဖို့ [`--bail` option](/docs/postman/newman-options) ကို သုံးပါ။ ဒီ status code ကို သင့် CI tool ဒါမှမဟုတ် build system က သုံးနိုင်ပါတယ်။

## Newman ကို Node.js library အဖြစ် သုံးခြင်း

Newman ကို သင့် JavaScript projects တွေထဲမှာ Node.js module တစ်ခုအနေနဲ့ သုံးနိုင်ပါတယ်။ Newman CLI ရဲ့ လုပ်ဆောင်ချက် အစုံအလင်ကို programmatically ရနိုင်ပါတယ်။ အောက်ပါ ဥပမာက သင့် file system ထဲမှာ သိမ်းထားတဲ့ JSON collection တစ်ခုကို ဖတ်ပြီး run လုပ်ပါတယ်:

```javascript
const newman = require('newman'); // require Newman in your project

// call newman.run to pass the `options` object and wait for callback
newman.run({
    collection: require('./sample-collection.json'),
    reporters: 'cli'
}, function (err) {
    if (err) { throw err; }
    console.log('collection run complete!');
});
```

`newman.run` options တွေရဲ့ စာရင်း အပြည့်အစုံအတွက် — GitHub ပေါ်က [API Reference](https://github.com/postmanlabs/newman#api-reference) ကို ကြည့်ပါ။
