---
title: "Newman ရဲ့ scripts တွေကို Postman CLI ဆီ migrate လုပ်ခြင်း (Migrate scripts from Newman to the Postman CLI)"
description: "Newman scripts တွေကို Postman CLI ဆီ migrate လုပ်နည်း — Newman ရဲ့ ကန့်သတ်ချက်များ, collections တွေကို v3 format ပြောင်းခြင်း, Newman နဲ့ Postman CLI ကြားက command mapping ဇယား"
order: 155
source: "https://learning.postman.com/docs/reference/newman-cli/migrate-to-postman-cli/"
status: translated
updated: 2026-09-03
---

သင့် Newman scripts တွေကို [Postman CLI](/docs/postman/postman-cli-overview) commands တွေ သုံးအောင် migrate လုပ်နိုင်ပါတယ်။ Postman CLI က collections တွေ run လုပ်ဖို့နဲ့ Postman ရဲ့ features တွေနဲ့ local မှာရော CI/CD pipelines တွေထဲမှာပါ အပြန်အလှန် ဆက်သွယ်ဖို့အတွက် အကြံပြုထားတဲ့ command-line tool ပါ။

Newman က Postman v12 မှာ စတင်မိတ်ဆက်ခဲ့တဲ့ capabilities တွေနဲ့ compatible မဖြစ်ပါဘူး — [Native Git](https://learning.postman.com/docs/use/native-git/overview) workflows တွေနဲ့ collection v3 format အပါအဝင်ပါ။ Local View ထဲက Postman v12 collections တွေက v3 format ကို သုံးတာကြောင့် — Postman ရဲ့ နောက်ပိုင်း version တွေမှာ ဖန်တီးထားတဲ့ ဒါမှမဟုတ် update လုပ်ထားတဲ့ collections တွေကို Newman က run လို့မရပါဘူး။ Collections တွေ ဆက်ပြီး run နိုင်ဖို့နဲ့ ဒီ capabilities တွေကို သုံးနိုင်ဖို့ — Newman ကနေ Postman CLI ဆီ migrate လုပ်ပါ။

အောက်ပါ section တွေမှာ သင့် Newman scripts တွေကို Postman CLI ဆီ migrate လုပ်ဖို့ ကူညီပေးမယ့် အဓိက ကွဲပြားချက်တွေ, migration steps တွေနဲ့ command mappings တွေကို ဖော်ပြထားပါတယ်။

## Newman ရဲ့ ကန့်သတ်ချက်များ

အောက်ပါ capabilities တွေက Postman CLI လိုအပ်ပြီး — Newman မှာ support မလုပ်ပါဘူး:

* **Feature support** — Postman CLI က collections, monitors, mock servers, flows စတဲ့ Postman features တွေ အများအပြားကို support လုပ်ပါတယ်။ Newman ကတော့ collections တွေ run လုပ်တာကိုပဲ support လုပ်ပါတယ်။
* **Native Git workflows** — Postman CLI က Native Git workflows တွေကို support လုပ်ပြီး — ကိုယ့် APIs တွေကို local မှာ iterate လုပ်ကာ Postman cloud ဆီ changes တွေ push လုပ်နိုင်ပါတယ်။ Newman က local changes တွေကို Postman cloud ဆီ push လုပ်တာကို support မလုပ်ပါဘူး။
* **Collection format** — Postman CLI က collection formats တွေ အားလုံးကို support လုပ်ပါတယ်။ ဒီထဲမှာ Postman v12 နဲ့ နောက်ပိုင်း Native Git workflows တွေအတွက် လိုအပ်တဲ့ v3 YAML format အသစ်လည်း ပါဝင်ပါတယ်။ Newman ကတော့ v2.1 JSON format ကိုပဲ support လုပ်ပါတယ်။

## Newman ကနေ Postman CLI ဆီ migrate လုပ်ခြင်း

Scripts တွေကို migrate လုပ်ဖို့ — ရှိပြီးသား Newman commands တွေနေရာမှာ ညီမျှတဲ့ Postman CLI commands တွေကို အစားထိုး သုံးပါ။ Collections တွေ run ဖို့ — Postman CLI နဲ့အတူ options တွေနဲ့ syntax ဆင်တူတဲ့ [`postman collection run` command](https://learning.postman.com/docs/postman-cli/postman-cli-collections#postman-collection-run) ကို သုံးပါ။ [Newman နဲ့ Postman CLI ကြားက command mapping](#newman-နဲ့-postman-cli-ကြားက-command-mapping) အကြောင်း လေ့လာပါ။

Repository ထဲက ရှိပြီးသား collections တွေအတွက် — ၎င်းတို့ကို v3 format အသစ်ဆီ ပြောင်းပြီး Native Git workflows တွေနဲ့ compatible ဖြစ်စေဖို့ [`postman collection migrate` command](https://learning.postman.com/docs/postman-cli/postman-cli-collections#postman-collection-migrate) ကို သုံးပါ။

ကိုယ့် [Git project ကို ကိုယ့် workspace နဲ့ ချိတ်ဆက်ပြီးတာနဲ့](https://learning.postman.com/docs/use/native-git/setup#connect-your-git-project-to-your-workspace) — Local View ထဲမှာ ဖန်တီးတဲ့ collections တွေက v3 format နဲ့ အလိုအလျောက် သိမ်းဆည်းပါတယ်။

### Newman နဲ့ Postman CLI ကြားက command mapping

အောက်ပါ ဇယားက အသုံးများတဲ့ [Newman commands](/docs/postman/newman-options) တွေကို ၎င်းတို့နဲ့ ညီမျှတဲ့ [Postman CLI commands](https://learning.postman.com/docs/postman-cli/postman-cli-collections#postman-collection-run) တွေနဲ့ map လုပ်ပြထားပါတယ်:

| Action (လုပ်ဆောင်ချက်)            | Newman command                             | Postman CLI command                                    |
| ----------------------- | ------------------------------------------ | ------------------------------------------------------ |
| Collection တစ်ခု run လုပ်ခြင်း  | `newman run <collection>`                  | `postman collection run <collection>`                  |
| Environment နဲ့ run လုပ်ခြင်း    | `newman run <collection> -e <environment>` | `postman collection run <collection> -e <environment>` |
| Globals တွေနဲ့ run လုပ်ခြင်း     | `newman run <collection> -g <globals>`     | `postman collection run <collection> -g <globals>`     |
| Reporters တွေ သတ်မှတ်ခြင်း       | `newman run <collection> -r cli,json`      | `postman collection run <collection> -r cli,json`      |
