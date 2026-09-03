---
title: "Postman CLI သုံးပြီး collection run reports တွေ ထုတ်လုပ်ခြင်း"
description: "Postman CLI ရဲ့ built-in reporters (CLI, JSON, JUnit, HTML) တွေနဲ့ collection run reports တွေ ထုတ်လုပ်နည်း — reporters တစ်ခု/အများအပြား သုံးခြင်း, reporter options တွေ configure လုပ်ခြင်း"
order: 162
source: "https://learning.postman.com/docs/postman-cli/postman-cli-reporters/"
status: translated
updated: 2026-09-03
---

Postman CLI မှာ — ကိုယ့် [collection runs](https://learning.postman.com/docs/postman-cli/postman-cli-collections/) တွေအတွက် reports တွေ ထုတ်ပေးဖို့ သုံးလို့ရတဲ့ built-in reporters တွေ ပါဝင်ပါတယ်။ ရနိုင်တဲ့ reporters တွေကတော့: CLI, JSON, JUnit နဲ့ HTML တို့ပါ။ Run တစ်ခုအတွက် reporter တစ်ခုထက်ပိုပြီး သုံးနိုင်သလို — report output ကိုလည်း ကိုယ့်လိုအပ်ချက်နဲ့ ကိုက်ညီအောင် customize လုပ်နိုင်ပါတယ်။ Built-in reporters အားလုံးက v2 format (JSON) နဲ့ HTTP collections တွေအတွက် ရပြီး — v3 format (YAML) နဲ့ HTTP, gRPC နဲ့ GraphQL collections တွေအတွက်တော့ CLI reporter တစ်ခုတည်းပဲ ရပါတယ်။

## Built-in reporters တွေအကြောင်း

Postman CLI reporter တစ်ခုချင်းစီက — collection run တစ်ခုအကြောင်း အသေးစိတ်တွေ ပါတဲ့ local report တစ်ခုကို ထုတ်ပေးပါတယ်။ ဒီထဲမှာ ပို့လိုက်တဲ့ requests တွေ, response codes နဲ့ times တွေ, pass ဖြစ်ပြီး fail ဖြစ်တဲ့ tests အရေအတွက်တွေ ပါဝင်ပါတယ်။ JSON နဲ့ HTML reports တွေမှာ — collection နဲ့ folder အဆင့်တွေက scripts တွေကနေ run ခဲ့တဲ့ failed requests တွေရဲ့ အသေးစိတ်တွေလည်း ပါဝင်ပါတယ်။ ရနိုင်တဲ့ reporters တွေကတော့:

* **CLI** — Report တစ်ခုကို terminal ထဲမှာ ပြသပါတယ်။ Reporter options တွေ သတ်မှတ်မထားရင် CLI report ကို ပုံမှန်အားဖြင့် ပြသပါတယ်။ gRPC နဲ့ GraphQL collection runs တွေက CLI report ကိုပဲ ထောက်ပံ့တာကို သတိပြုပါ။
* **JSON** — Report ပါဝင်တဲ့ JSON file တစ်ခုကို ဖန်တီးပါတယ်။ ပုံမှန်အားဖြင့် report structure က Postman CLI JSON reporter schema အတိုင်း ဖြစ်ပါတယ်။
* **JUnit** — Report ပါဝင်တဲ့ XML file တစ်ခုကို ဖန်တီးပါတယ်။ JUnit reporting အကြောင်း ပိုသိချင်ရင် — [JUnit documentation](https://junit.org/junit5/docs/current/user-guide/#junit-platform-reporting) ကို ကြည့်ပါ။
* **HTML** — Report ပါဝင်တဲ့ HTML file တစ်ခုကို ဖန်တီးပါတယ်။ Collection run iterations တွေကို test failures ဒါမှမဟုတ် errors အလိုက်၊ ဒါမှမဟုတ် test failures တွေတည်းနဲ့ filter လုပ်နိုင်ပါတယ်။ ပြီးရင် filtered results တွေထဲကနေ ကြည့်ချင်တဲ့ iteration တစ်ခုကို ရွေးနိုင်ပါတယ်။ Iteration တစ်ခုချင်းစီထဲက requests တွေကိုလည်း — test failures ဒါမှမဟုတ် errors ကြုံခဲ့တဲ့ requests တွေ ဒါမှမဟုတ် errors တွေတည်းပဲ ပြဖို့ filter လုပ်နိုင်ပါတယ်။

## အသုံးပြုပုံ (Usage)

`postman collection run` command နဲ့ collection တစ်ခုကို run တဲ့အခါ — reporter တစ်ခု ဒါမှမဟုတ် အများအပြားအတွက် report တစ်ခု ထုတ်နိုင်ပါတယ်။

### Built-in reporter တစ်ခုတည်း သုံးခြင်း

Collection run တစ်ခုအတွက် report ထုတ်ဖို့ — `-r` ဒါမှမဟုတ် `--reporters` option ကို သုံးပြီး report ထုတ်ချင်တဲ့ reporter ကို သတ်မှတ်ပါ: `cli`, `json`, `junit` ဒါမှမဟုတ် `html`။ အောက်ပါ syntax ကို သုံးပါ:

```bash
postman collection run <collection> -r <reporter> [options]
```

Collection ID ကို Postman ထဲမှာ ရှာတွေ့နိုင်ပါတယ်။ Sidebar ထဲက **Items** tab ကို နှိပ်ပြီး **Collections** ကို နှိပ်ကာ collection တစ်ခုကို ရွေးပါ။ ပြီးရင် ညာဘက် sidebar ထဲက **Info** tab ကို နှိပ်ပြီး collection ID ကို ကြည့်ရှု ဒါမှမဟုတ် ကူးယူနိုင်ပါတယ်။

JSON, JUnit နဲ့ HTML reports တွေကို ပုံမှန်အားဖြင့် လက်ရှိ working directory ထဲက `/postman-cli-reports` directory ထဲမှာ ဖန်တီးပါတယ်။ `/postman-cli-reports` directory မရှိသေးရင် အလိုအလျောက် ဖန်တီးပေးပါတယ်။ Output directory တစ်ခုကိုလည်း သင်ကိုယ်တိုင် သတ်မှတ်နိုင်ပါတယ်။ Filename ထဲမှာ collection ရဲ့ နာမည်နဲ့ 24-hour format နဲ့ system timestamp ပါဝင်ပါတယ်: `collection-name-yyyy-mm-dd-hh-mm-ss`။

### Built-in reporters အများအပြား သုံးခြင်း

Collection run တစ်ခုအတွက် reporters အများအပြားကို သတ်မှတ်နိုင်ပါတယ်။ Reporter တစ်ခုထက်ပိုပြီး သတ်မှတ်ရင် — reporter နာမည်တွေကို comma နဲ့ ခွဲထားတဲ့ စာရင်းအဖြစ် သတ်မှတ်ပါ။ ဥပမာ — `-r json,junit`။

ပုံမှန်အားဖြင့် — collection တစ်ခုကို run တဲ့အခါ CLI reporter ရဲ့ output ကို terminal ထဲမှာ ပြသပါတယ်။ Reporter တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး သတ်မှတ်ရင် (ဥပမာ — `-r json`) — CLI reporter ရဲ့ output ကို ပြသတော့မှာ မဟုတ်ပါဘူး။ ဒီလိုအခြေအနေမှာ CLI reporter ကို ပြချင်ရင် — တခြား reporters တွေနဲ့အတူ ထည့်သွင်းပြီး အတိအကျ သတ်မှတ်ရပါမယ်။ ဥပမာ: `-r cli,json`။

အောက်ပါ ဥပမာက `cli` နဲ့ `json` reporters တွေကို run လုပ်ပါတယ်:

```bash
postman collection run <collection> -r cli,json [options]
```

## Options

CLI reporter အတွက် options တွေ၊ JSON, JUnit နဲ့ HTML reporters တွေအတွက် options တွေကို configure လုပ်နိုင်ပါတယ်။ Collection run တစ်ခုထဲမှာ သုံးနေတဲ့ reporters အားလုံးနဲ့ သက်ဆိုင်တဲ့ options တွေကိုလည်း သတ်မှတ်နိုင်ပါတယ်။

### CLI reporter အတွက် options များ configure လုပ်ခြင်း

CLI reporter က Postman CLI နဲ့ collection တစ်ခုကို run တဲ့အခါ ပုံမှန်အားဖြင့် ဖွင့်ထားပြီးသား ဖြစ်ပြီး report ကို terminal ထဲမှာ ပုံနှိပ်ပေးပါတယ်။ CLI reporter ကို configure လုပ်ဖို့ အောက်ပါ options တွေကို သုံးပါ။

**`--reporter-cli-silent`**

CLI reporter ကို ပိတ်ပြီး terminal ထဲမှာ output ဘာမှ ပြသမှာ မဟုတ်ပါဘူး။

---

**`--reporter-cli-show-timestamps`**

Request တစ်ခုချင်းစီ ပြုလုပ်ခဲ့တဲ့ local time ကို ပုံနှိပ်ပါတယ်။

---

**`--reporter-cli-no-summary`**

စာရင်းအင်း (statistical) summary table ကို မပုံနှိပ်ပါဘူး။

---

**`--reporter-cli-no-failures`**

Run failures တွေရဲ့ အသေးစိတ်တွေကို မပုံနှိပ်ပါဘူး။

---

**`--reporter-cli-no-assertions`**

Assertions တွေ ဖြစ်ပျက်လာတာနဲ့အမျှ ၎င်းတို့ရဲ့ output ကို ပိတ်ထားပါတယ်။

---

**`--reporter-cli-no-success-assertions`**

အောင်မြင်တဲ့ assertions တွေ ဖြစ်ပျက်လာတာနဲ့အမျှ ၎င်းတို့ရဲ့ output ကို ပိတ်ထားပါတယ်။

---

**`--reporter-cli-no-console`**

Pre-request နဲ့ post-response scripts တွေကနေ `console.log()` output (နဲ့ တခြား console methods တွေ) ကို ပိတ်ထားပါတယ်။

---

**`--reporter-cli-no-banner`**

Collection run တစ်ခုချင်းစီရဲ့ အစမှာ ပြသတဲ့ banner ကို ပိတ်ထားပါတယ်။

---

### JSON, JUnit နဲ့ HTML reporters တွေအတွက် options များ configure လုပ်ခြင်း

JSON, JUnit နဲ့ HTML reporters တွေက သတ်မှတ်ထားတဲ့ format နဲ့ report file တစ်ခုကို ကိုယ့် working directory ထဲမှာ ဖန်တီးပါတယ်။ Reporters တွေကို configure လုပ်ဖို့ အောက်ပါ options တွေကို သုံးပါ။ `<reporter>` နေရာမှာ ကိုယ်သုံးနေတဲ့ reporter ကို အစားထိုးပါ: `json`, `junit` ဒါမှမဟုတ် `html`။

**`--reporter-<reporter>-export <path>`**

Report ကို သိမ်းမယ့် path တစ်ခု သတ်မှတ်ပါ။ ပုံမှန်အားဖြင့် reports တွေကို ကိုယ့် လက်ရှိ working directory ထဲက `/postman-cli-reports` directory ထဲမှာ သိမ်းပါတယ်။ Directory မရှိသေးရင် အလိုအလျောက် ဖန်တီးပေးပါတယ်။ သတ်မှတ်ထားတဲ့ path က ရှိပြီးသား directory တစ်ခုဆိုရင် — report file ကို ၎င်းထဲမှာ သိမ်းပေးပါတယ်။

---

**`--reporter-<reporter>-omitRequestBodies`**

(JSON နဲ့ HTML reporters တွေမှာပဲ) Request bodies အားလုံးကို report ထဲကနေ ဖယ်ရှားပါတယ်။

---

**`--reporter-<reporter>-omitResponseBodies`**

(JSON နဲ့ HTML reporters တွေမှာပဲ) Response bodies အားလုံးကို report ထဲကနေ ဖယ်ရှားပါတယ်။

---

**`--reporter-<reporter>-omitHeaders`**

(JSON နဲ့ HTML reporters တွေမှာပဲ) Request နဲ့ response headers အားလုံးကို report ထဲကနေ ဖယ်ရှားပါတယ်။

---

**`--reporter-<reporter>-omitAllHeadersAndBody`**

(JSON နဲ့ HTML reporters တွေမှာပဲ) Request နဲ့ response headers အားလုံး၊ request နဲ့ response bodies အားလုံးကို report ထဲကနေ ဖယ်ရှားပါတယ်။

---

**`--reporter-json-structure newman`**

(JSON reporter မှာပဲ) Newman schema သုံးပြီး JSON report တစ်ခု ထုတ်ပေးပါတယ်။ ပုံမှန်အားဖြင့် JSON reports တွေက Postman CLI ရဲ့ native structure ကို သုံးပါတယ်။

---

### Reporter တစ်ခုထက်ပိုပြီးအတွက် options များ configure လုပ်ခြင်း

Reporter တစ်ခုထက်ပိုပြီး သုံးနေရင် — reporter တစ်ခုတည်းအတွက် option တစ်ခုကို `--reporter-<reporter>-<option>` ဆိုတဲ့ syntax နဲ့ သတ်မှတ်နိုင်ပါတယ်။ `<reporter>` နေရာမှာ ကိုယ်သုံးနေတဲ့ reporter ကို ထည့်ပါ: `cli`, `json`, `junit` ဒါမှမဟုတ် `html`။ `<option>` နေရာမှာ reporter ကို သက်ရောက်စေချင်တဲ့ reporter option ကို ထည့်ပါ။

```bash
postman collection run <collection> -r json,html --reporter-json-omitHeaders
```

JSON, JUnit နဲ့ HTML reporters တွေအားလုံးက တူညီတဲ့ option တစ်ခုကို လက်ခံစေချင်ရင် — reporters အားလုံးအတွက် `--reporter-<option>` ဆိုတဲ့ syntax နဲ့ reporter option တစ်ခုကို သတ်မှတ်ပါ။

```bash
postman collection run <collection> -r json,html --reporter-omitHeaders
```

Reporter တစ်ခုထက်ပိုပြီး သုံးတဲ့အခါ — reporter တစ်ခုတည်းအတွက် သတ်မှတ်ထားတဲ့ options တွေက reporters အားလုံးအတွက် သတ်မှတ်ထားတဲ့ options တွေထက် ဦးစားပေး (precedence) ယူပါတယ်။

## ဥပမာများ (Examples)

```bash
postman collection run 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12 -r json\
--reporter-json-omitHeaders

postman collection run 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12 -r cli,junit,html\
--reporter-cli-show-timestamps\
--reporter-junit-export path/to/junit-report-file\
--reporter-html-export path/to/html-report-file
```
