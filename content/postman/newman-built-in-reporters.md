---
title: "Newman ရဲ့ built-in reporters တွေနဲ့ collection run reports တွေ ထုတ်လုပ်ခြင်း (Generate collection run reports with Newman built-in reporters)"
description: "Newman ရဲ့ built-in reporters (CLI, JSON, JUnit, Progress, Emoji train) တွေနဲ့ collection run reports တွေ ထုတ်လုပ်ခြင်းနဲ့ configure လုပ်နည်း"
order: 152
source: "https://learning.postman.com/docs/reference/newman-cli/newman-built-in-reporters/"
status: translated
updated: 2026-09-03
---

Newman မှာ သင့် collection runs တွေအတွက် reports တွေ ထုတ်ပေးဖို့ built-in reporters တွေ ပါပါတယ်။ အောက်ပါ reporters တွေ ရနိုင်ပါတယ်:

* CLI
* JSON
* JUnit
* Progress
* Emoji train

Run တစ်ခုအတွက် reporter တစ်ခုထက်ပိုပြီးလည်း သုံးနိုင်သလို — report output ကို ကိုယ့်လိုအပ်ချက်တွေနဲ့ ကိုက်ညီအောင်လည်း customize လုပ်နိုင်ပါတယ်။

## Built-in reporters တွေ သုံးခြင်း

လက်ရှိ collection run ရဲ့ reports တွေကို ထုတ်ပေးဖို့ — `-r` ဒါမှမဟုတ် `--reporters` options တွေနဲ့ reporters တွေကို configure လုပ်နိုင်ပါတယ်။ ပြီးရင် reports ထုတ်ချင်တဲ့ reporters တွေကို သတ်မှတ်ပါ: `cli`, `json`, `junit`, `progress` ဒါမှမဟုတ် `emojitrain`။

Reporter တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး သတ်မှတ်နိုင်ပါတယ်။ Reporter တစ်ခုထက်ပိုပြီး သတ်မှတ်ရင် — reporter names တွေကို comma နဲ့ ခွဲထားတဲ့ စာရင်းအနေနဲ့ ပိုင်းခြားပါ — ဥပမာ `-r cli,json`။ Reporter တစ်ခုချင်းစီအကြောင်း ပိုလေ့လာချင်ရင် — [Built-in reporters တွေအကြောင်း](#built-in-reporters-တွေအကြောင်း) ကို ကြည့်ပါ။

CLI reporter (`cli`) က Newman ကို terminal ထဲမှာ သုံးတဲ့အခါ ပုံမှန်အားဖြင့် ဖွင့်ထားပါတယ်။ Reporter တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ဖွင့်လိုက်ရင် — ဥပမာ `-r json` — CLI reporter က ပိတ်သွားပါတယ်။ CLI reporter ကို ပြန်ဖွင့်ချင်ရင် — CLI reporter ကိုပါ သတ်မှတ်ပေးရပါမယ် — ဥပမာ `-r cli,json`။

အောက်ပါ ဥပမာက `cli` နဲ့ `json` reporters တွေကို run ပါတယ်:

```bash
newman run my-collection.json -r cli,json
```

Built-in reporters တွေက ကိုယ့် use case နဲ့ မကိုက်ညီဘူးဆိုရင် — [external reporter တစ်ခုကို သုံးနိုင်သလို custom reporter တစ်ခုကိုလည်း တည်ဆောက်နိုင်ပါတယ်](/docs/postman/newman-custom-reporters)။

### Built-in reporters တွေအကြောင်း

Reporter တစ်ခုချင်းစီက သင့် collection run အကြောင်း report တစ်ခုကို ပုံစံတစ်မျိုးစီနဲ့ ထုတ်ပေးပါတယ်။

* **CLI** — Report ကို terminal ထဲမှာ ပြသပါတယ်။
* **JSON** — Report ပါဝင်တဲ့ JSON file တစ်ခုကို ဖန်တီးပါတယ်။
* **JUnit** — Report ပါဝင်တဲ့ XML file တစ်ခုကို ဖန်တီးပါတယ်။
* **Progress** — Collection run ရဲ့ တိုးတက်မှု (progress) ကို ပြသပေးတဲ့ progress bar တစ်ခုကို terminal ထဲမှာ ပြပါတယ်။
* **Emoji train** — Report ရဲ့ အသေးစိတ်တွေကို ကိုယ်စားပြုတဲ့ emojis တွေကို terminal ထဲမှာ ပြသပါတယ်။

## Built-in reporters တွေကို configure လုပ်ခြင်း

Reporter တစ်ခုထက်ပိုပြီး သတ်မှတ်ထားရင် — reporter တစ်ခုအတွက် option တစ်ခုကို `--reporter-[reporter-name]-[reporter-option]` option နဲ့ သတ်မှတ်နိုင်ပါတယ်။ အောက်ပါ ဥပမာက CLI reporter ကိုပဲ silent ဖြစ်စေပါတယ်:

```bash
newman run my-collection.json -r cli,json --reporter-cli-silent
```

Reporter တစ်ခုထက်ပိုပြီး သတ်မှတ်ထားပြီး — reporters အားလုံးက option တစ်ခုတည်းကို လက်ခံစေချင်တယ်ဆိုရင် — reporters အားလုံးအတွက် option တစ်ခုကို `--reporter-[reporter-option]` option နဲ့ သတ်မှတ်နိုင်ပါတယ်။ အောက်ပါ ဥပမာက CLI နဲ့ JSON reporters နှစ်ခုလုံးဆီ `silent: true` ကို ပေးပါတယ်:

```bash
newman run my-collection.json -r cli,json --reporter-silent
```

### CLI reporter

CLI reporter က Newman ကို CLI အဖြစ် သုံးတဲ့အခါ ပုံမှန်အားဖြင့် ဖွင့်ထားပြီး — report ကို terminal ထဲမှာ print လုပ်ပါတယ်။ CLI reporter ကို configure လုပ်ဖို့ အောက်ပါ options တွေကို သုံးနိုင်ပါတယ်:

**`--reporter-cli-silent`**

CLI reporter ကို ပိတ်ပြီး terminal မှာ output ကို မမြင်ရအောင် လုပ်ပါတယ်။

---

**`--reporter-cli-show-timestamps`**

Request တစ်ခုချင်းစီ လုပ်ခဲ့တဲ့ local time ကို print လုပ်ပါတယ်။

---

**`--reporter-cli-no-summary`**

Statistical summary table ကို print မလုပ်ပါဘူး။

---

**`--reporter-cli-no-failures`**

Run failures တွေရဲ့ အသေးစိတ်တွေကို print မလုပ်ပါဘူး။

---

**`--reporter-cli-no-assertions`**

Assertions တွေ ဖြစ်ပေါ်လာတာနဲ့ ၎င်းတို့ရဲ့ output ကို ပိတ်ထားပါတယ်။

---

**`--reporter-cli-no-success-assertions`**

Assertions တွေ အောင်မြင်လာတာနဲ့ ၎င်းတို့ရဲ့ output ကို ပိတ်ထားပါတယ်။

---

**`--reporter-cli-no-console`**

Pre-request နဲ့ post-response scripts တွေကနေ `console.log()` (နဲ့ တခြား console methods တွေ) ရဲ့ output ကို ပိတ်ထားပါတယ်။

---

**`--reporter-cli-no-banner`**

Collection run တစ်ခုစီ စတင်တဲ့အခါ အစမှာ ပြသလေ့ရှိတဲ့ Newman banner ကို ပိတ်ထားပါတယ်။

---

အောက်ပါ ဥပမာက request တစ်ခုချင်းစီ လုပ်ခဲ့တဲ့ အချိန်ကို print လုပ်ပါတယ်:

```bash
newman run my-collection.json -r cli,json --reporter-cli-show-timestamps
```

### JSON reporter

JSON reporter က report ပါဝင်တဲ့ JSON file တစ်ခုကို သင့် working directory ထဲမှာ ဖန်တီးပါတယ်။ JSON reporter ကို configure လုပ်ဖို့ အောက်ပါ option ကို သုံးနိုင်ပါတယ်:

**`--reporter-json-export [path]`**

Output JSON file ကို သင့် file system ထဲမှာ ဖန်တီးမယ့် path တစ်ခုကို သတ်မှတ်ပါ။ ပုံမှန်အားဖြင့် JSON file ကို သင့် working directory ထဲက `/newman` မှာ ဖန်တီးပါတယ်။ `/newman` directory မရှိဘူးဆိုရင် အလိုအလျောက် ဖန်တီးပေးပါတယ်။ သတ်မှတ်ထားတဲ့ path က directory အဟောင်းတစ်ခုဆိုရင် — file ကို အဲဒီ directory ထဲမှာ ဖန်တီးပါတယ်။

Optional — file အတွက် နာမည်တစ်ခုလည်း သတ်မှတ်နိုင်ပါတယ် — ဥပမာ `... --reporter-json-export collection-run-1.json`။

---

အောက်ပါ ဥပမာက JSON reporter အတွက် output JSON file ကို `/json-file-reports` directory ထဲမှာ ထုတ်ပေးပါတယ်:

```bash wordWrap
newman run my-collection.json -r cli,json --reporter-json-export json-file-reports
```

### JUnit reporter

JUnit reporter က report ပါဝင်တဲ့ XML file တစ်ခုကို သင့် working directory ထဲမှာ ဖန်တီးပါတယ်။ JUnit reporter ကို configure လုပ်ဖို့ အောက်ပါ option ကို သုံးနိုင်ပါတယ်:

**`--reporter-junit-export [path]`**

Output XML file ကို သင့် file system ထဲမှာ ဖန်တီးမယ့် path တစ်ခုကို သတ်မှတ်ပါ။ ပုံမှန်အားဖြင့် XML file ကို သင့် working directory ထဲက `/newman` မှာ ဖန်တီးပါတယ်။ `/newman` directory မရှိဘူးဆိုရင် အလိုအလျောက် ဖန်တီးပေးပါတယ်။ သတ်မှတ်ထားတဲ့ path က directory အဟောင်းတစ်ခုဆိုရင် — file ကို အဲဒီ directory ထဲမှာ ဖန်တီးပါတယ်။

Optional — file အတွက် နာမည်တစ်ခုလည်း သတ်မှတ်နိုင်ပါတယ် — ဥပမာ `... --reporter-junit-export collection-run-1.xml`။

---

အောက်ပါ ဥပမာက JUnit reporter အတွက် output XML file ကို `/xml-file-reports` directory ထဲမှာ ထုတ်ပေးပါတယ်:

```bash wordWrap
newman run my-collection.json -r cli,junit --reporter-junit-export xml-file-reports
```
