---
title: "Newman CLI နဲ့ command line ကနေ collections တွေ run လုပ်ပြီး test လုပ်ခြင်း (Run and test collections from the command line using Newman CLI)"
description: "Newman CLI နဲ့ command line ကနေ Postman Collections တွေ run လုပ်ပြီး test လုပ်နည်း — Newman ရဲ့ အင်္ဂါရပ်တွေ, options, reporters, CI/CD ပေါင်းစပ်ခြင်းနဲ့ Postman CLI ဆီ migration အကြောင်း ခြုံငုံသုံးသပ်ချက်"
order: 150
source: "https://learning.postman.com/docs/reference/newman-cli/command-line-integration-with-newman/"
status: translated
updated: 2026-09-03
---

Newman က Postman v12 နဲ့ နောက်ပိုင်းတွေမှာ သုံးတဲ့ collection v3 format နဲ့ compatible မဖြစ်ပါဘူး — Native Git workflows တွေမှာ support လုပ်တဲ့ တစ်ခုတည်းသော collection format ကလည်း ဒါပါပဲ။ Collections တွေ ဆက်ပြီး run နိုင်ဖို့ — [Postman CLI ဆီ migrate လုပ်ပါ](/docs/postman/migrate-to-postman-cli)။

Newman က Postman Collections တွေကို run လုပ်ဖို့အတွက် command-line tool တစ်ခုပါ။ Postman app ထဲမှာ run လုပ်မယ့်အစား — Newman ကို သုံးပြီး command line ကနေ collections တွေကို run လုပ်ပြီး test လုပ်နိုင်ပါတယ်။ Newman ကို extensibility ကို ဦးစားပေးပြီး တည်ဆောက်ထားတာဖြစ်လို့ — သင့် continuous integration (CI) pipelines တွေနဲ့ build systems တွေထဲမှာ ထည့်သွင်း သုံးနိုင်ပါတယ်။

ဒီ section ထဲက topic တွေက Newman နဲ့ စတင်နိုင်ဖို့ ကူညီပေးပါတယ်။ အသုံးပြုပုံ အပြည့်အစုံအတွက် — [npm registry](https://www.npmjs.com/package/newman) ဒါမှမဟုတ် [GitHub](https://github.com/postmanlabs/newman) ပေါ်မှာ Newman ကို ကြည့်ပါ။

Collections တွေကို [Postman CLI](/docs/postman/postman-cli-overview) နဲ့လည်း command line ကနေ run လုပ်နိုင်ပါတယ်။

## Newman မှာ စတင်ခြင်း

စတင်ဖို့ — Node.js နဲ့ Newman ကို install လုပ်ပြီး သင့် collections တွေကို run လုပ်ပါ။ [Newman ကို install လုပ်ပြီး run လုပ်ခြင်း](/docs/postman/newman-installing-running) အကြောင်း ပိုလေ့လာပါ။

Docker ကို သုံးပြီးလည်း Newman ကို run လုပ်နိုင်ပါတယ်။ [macOS, Ubuntu နဲ့ Windows တွေမှာ Newman ကို Docker နဲ့ run လုပ်ခြင်း](/docs/postman/newman-with-docker) အကြောင်း ပိုလေ့လာပါ။

## Newman options များ

Collection run တစ်ခုကို customize လုပ်ဖို့ Newman မှာ options အစုံအလင် ရှိပါတယ်။ [Newman options](/docs/postman/newman-options) အကြောင်း ပိုလေ့လာပါ။

## Newman မှာ files တွေ upload လုပ်ခြင်း

Newman က file uploads တွေကို support လုပ်ပါတယ် — ဒါကြောင့် form data fields တွေကို ဖြည့်ဖို့ data file (စာသားပါတဲ့ text file စသဖြင့်) တစ်ခုကို သုံးနိုင်ပါတယ်။ [Newman မှာ files တွေ upload လုပ်ခြင်း](https://learning.postman.com/docs/reference/newman-cli/newman-file-uploads/) အကြောင်း ပိုလေ့လာပါ။

## Newman reporters များ

Reporters တွေက သတ်သတ်မှတ်မှတ် use cases တွေအတွက် collection run reports တွေကို ထုတ်ပေးနိုင်ပါတယ် — ဥပမာ — request တစ်ခု (ဒါမှမဟုတ် ၎င်းရဲ့ tests တွေ) fail ဖြစ်တဲ့အခါ response body ကို log လုပ်တာမျိုးပါ။ [Newman ရဲ့ built-in reporters](/docs/postman/newman-built-in-reporters) နဲ့ [Newman ရဲ့ external နဲ့ custom reporters](/docs/postman/newman-custom-reporters) တွေ သုံးခြင်းအကြောင်း ပိုလေ့လာပါ။

## Newman နဲ့ continuous integration (CI)

Newman ကို သင့် continuous integration (CI) environment ထဲမှာ ထည့်သွင်း ပေါင်းစပ်နိုင်ပါတယ်။ Code push တိုင်း — သင့် collections တွေနဲ့ tests တွေကို အလိုအလျောက် run လုပ်ပါ။ [Newman ကို CI နဲ့ သုံးခြင်း](https://learning.postman.com/docs/reference/newman-cli/continuous-integration/), [Newman ကို Travis CI နဲ့ သုံးခြင်း](https://learning.postman.com/docs/reference/newman-cli/integration-with-travis/) ဒါမှမဟုတ် [Newman ကို Jenkins နဲ့ သုံးခြင်း](https://learning.postman.com/docs/reference/newman-cli/integration-with-jenkins/) အကြောင်း ပိုလေ့လာပါ။

## Newman ကနေ Postman CLI ဆီ migrate လုပ်ခြင်း

Postman CLI ဆီ ပြောင်းနေတယ်ဆိုရင် — သင့်ရှိပြီးသား Newman workflows တွေကို ညီမျှတဲ့ commands တွေနဲ့ update လုပ်နိုင်သလို — သင့် collections တွေကိုလည်း v3 YAML format ဆီ migrate လုပ်နိုင်ပါတယ်။ [Newman ကနေ Postman CLI ဆီ migrate လုပ်ခြင်း](/docs/postman/migrate-to-postman-cli) အကြောင်း ပိုလေ့လာပါ။
