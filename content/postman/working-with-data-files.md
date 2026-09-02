---
title: "Import လုပ်ထားတဲ့ data တွေကို သုံးပြီး collections တွေ run လုပ်ခြင်း (Run Collections Using Imported Data)"
description: "Collection runs တွေမှာ data files တွေ ဘယ်လို သုံးမလဲ — local data files, uploaded data files (cloud), CSV နဲ့ JSON file format လုပ်နည်း, variable တွေနဲ့ တွဲသုံးခြင်း"
order: 47
source: "https://learning.postman.com/docs/tests-and-scripts/running-collections/working-with-data-files/"
status: translated
updated: 2026-09-02
---

Custom data files တွေကို Postman ရဲ့ paid plans တွေမှာ ရနိုင်ပါတယ်။ ပိုသိချင်ရင် — [pricing page](https://www.postman.com/pricing/) ကို ကြည့်ပါ။

[Manual](/docs/postman/intro-to-collection-runs) ဒါမှမဟုတ် [scheduled](/docs/postman/scheduling-collection-runs) collection run တစ်ခုကို configure လုပ်တဲ့အခါ — iteration တစ်ခုချင်းစီအတွက် custom data တွေကို သုံးဖို့ ရွေးနိုင်ပါတယ်။ သုံးချင်တဲ့ data တွေပါတဲ့ CSV ဒါမှမဟုတ် JSON file တစ်ခုကို ရွေးပါ။ Collection ကို run လုပ်တဲ့အခါ — Postman က file ထဲက data တွေကို သုံးပြီး collection ထဲက requests တွေမှာပါတဲ့ [variables](/docs/postman/variables) တွေကို ဖြည့်ပေးပါတယ်။

Collection run တစ်ခုကို configure လုပ်တဲ့အခါ — [local data file](#local-data-file-တစ်ခု-သုံးခြင်း) တစ်ခုကို ထည့်နိုင်ပါတယ်။ ဒါ့အပြင် ကိုယ့် workspace ထဲကို [data file တစ်ခုကို upload](#uploaded-data-file-တစ်ခု-သုံးခြင်း) လုပ်ပြီး — manual collection run တစ်ခုကို configure လုပ်တဲ့အခါ အဲဒီ file ကို ထည့်နိုင်ပါတယ်။ Uploaded data files တွေက Postman cloud နဲ့ sync လုပ်ထားပြီး — ကိုယ့် workspace ထဲက နောက်ပိုင်း manual collection runs တွေမှာ ပြန်သုံးနိုင်ပါတယ်။ Scheduled runs, monitors, Postman CLI နဲ့ Newman တွေက uploaded data files တွေကို ပံ့ပိုးမပေးပါဘူး။

ကိုယ့် data file က [data file formatting guidelines](#data-file-တစ်ခု-format-လုပ်ခြင်း) တွေနဲ့ ကိုက်ညီအောင် သေချာပါစေ။ မဟုတ်ရင် — Postman က ကိုယ့် data file ကို ဖတ်ဖို့ ကြိုးစားတဲ့အခါ errors တွေ ကြုံရနိုင်ပါတယ်။ ပြဿနာတစ်ခုခု ကြုံရရင် — [Postman support](https://www.postman.com/support/) ကို ဆက်သွယ်ပါ။

ဒါ့အပြင် data sources အများကြီးကို သုံးပြီး data တွေကို စီမံခန့်ခွဲကာ query လုပ်ဖို့ — [datasets](https://learning.postman.com/docs/tests-and-scripts/datasets/overview) တွေကိုလည်း သုံးနိုင်ပါတယ်။ ဒါက workflows တွေတစ်လျှောက် data တစ်ခုတည်းကို ပြန်သုံးနိုင်စေပြီး — ပိုပြီး လိုက်လျောညီထွေကျတဲ့ လက်တွေ့ကျတဲ့ tests တွေ run နိုင်ကာ — values တွေကို ထပ်ခါထပ်ခါ ရေးစရာ ဒါမှမဟုတ် hardcode လုပ်စရာ မလိုဘဲ data ကို ဘယ်လို ပြန်ယူမလဲ ထိန်းချုပ်နိုင်စေပါတယ်။

## Local data file တစ်ခု သုံးခြင်း

[Manual collection run](#manual-run-တစ်ခုမှာ-local-data-file-သုံးခြင်း) ဒါမှမဟုတ် [scheduled collection run](#scheduled-run-တစ်ခုမှာ-local-data-file-သုံးခြင်း) တစ်ခုထဲကို local data file တစ်ခု ထည့်နိုင်ပါတယ်။ Local data file က အဲဒီ collection run ထဲမှာပဲ ရနိုင်ပြီး — နောက်ပိုင်း run တစ်ခုမှာ အဲဒီ data file ကို ပြန်သုံးလို့ မရပါဘူး။

Local data file တစ်ခုကို manual collection run တစ်ခုထဲကို ထည့်ပြီးတာနဲ့ — file ကို ကိုယ့် workspace ထဲကို upload လုပ်ဖို့ ရွေးနိုင်ပါတယ်။ ဒါက workspace ကို ဝင်လို့ရတဲ့ ကိုယ်နဲ့ ကိုယ့် team members တွေ နောက်ပိုင်း manual collection runs တွေမှာ file ကို ပြန်သုံးနိုင်စေပါတယ်။

### Manual run တစ်ခုမှာ local data file သုံးခြင်း

Manual collection run တစ်ခုမှာ local data file သုံးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး **Collections** ကို ချဲ့ပါ။ Run လုပ်ချင်တဲ့ collection ဒါမှမဟုတ် folder ကို ရွေးပါ။

2. ![Run icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-run-stroke.svg#icon) **Run** ကို နှိပ်ပါ။

3. **Functional** ကို ရွေးပြီး — **Local** ကို ရွေးပါ။

4. **Iteration data** dropdown list ကို နှိပ်ပြီး **Datafiles** tab ကို ရွေးပါ။

5. ကိုယ့် computer ထဲက data file တစ်ခု ရွေးဖို့ ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) **Select from computer** ကို နှိပ်ပါ။

6. Data file ကို preview လုပ်ပါ။

   Data file ကို မထည့်ချင်ဘူးဆိုရင် — **Iteration data** dropdown list ထဲက ![Close icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-close-stroke.svg#icon) **Clear selection** ကို နှိပ်ပြီး အခြား file တစ်ခု ရွေးပါ။

7. [Manual collection run ကို configure လုပ်ခြင်း](/docs/postman/intro-to-collection-runs) ကို ဆက်ပြီး လုပ်ပါ။

Data file ကို collection run ထဲကို ထည့်ပြီးတာနဲ့ — **Save to Workspace** ကို နှိပ်ပြီး [file ကို Postman cloud ထဲ upload](#uploaded-data-file-တစ်ခု-သုံးခြင်း) လုပ်ကာ — workspace ကို ဝင်လို့ရတဲ့ team members တွေနဲ့ မျှဝေနိုင်ပါတယ်။ Collection run configuration ကနေလည်း — data file ရဲ့ ဘေးက ![Upload to cloud icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-uploadToCloud-stroke.svg#icon) **Upload to Workspace** ကို နှိပ်ပြီး file ကို upload လုပ်နိုင်ပါတယ်။

### Scheduled run တစ်ခုမှာ local data file သုံးခြင်း

Scheduled collection run တစ်ခုမှာ local data file သုံးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး **Collections** ကို ချဲ့ပါ။ Run လုပ်ချင်တဲ့ collection ဒါမှမဟုတ် folder ကို ရွေးပါ။

2. ![Run icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-run-stroke.svg#icon) **Run** ကို နှိပ်ပါ။

3. **Functional** ကို ရွေးပြီး — **Schedule** ကို ရွေးပါ။

4. **Data file** အောက်မှာ — ကိုယ့် computer ထဲက data file တစ်ခု ရွေးဖို့ **Select file** ကို နှိပ်ပါ။

5. Data file ကို preview လုပ်ဖို့ **Preview** ကို နှိပ်ပါ။

   Data file ကို မထည့်ချင်ဘူးဆိုရင် — **Iteration data** dropdown list ထဲက ![Close icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-close-stroke.svg#icon) **Clear selection** ကို နှိပ်ပြီး အခြား file တစ်ခု ရွေးပါ။

6. [Manual collection run ကို configure လုပ်ခြင်း](/docs/postman/intro-to-collection-runs) ကို ဆက်ပြီး လုပ်ပါ။

Data file ကို scheduled collection run ထဲကို ထည့်ပြီးတာနဲ့ — လိုအပ်ရင် **Data file type** dropdown list ကို နှိပ်ပြီး type ကို ပြောင်းနိုင်ပါတယ်။ ပြီးရင် collection ကို run မလုပ်ခင် file ထဲက data တွေကို ကြည့်ဖို့ **Preview** ကို နှိပ်နိုင်ပါတယ်။

Scheduled collection run ထဲကနေ data file တစ်ခုကို ဖယ်ရှားချင်ရင် — data file ရဲ့ ဘေးက ![Close icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-close-stroke.svg#icon) ကို နှိပ်ပါ။

## Uploaded data file တစ်ခု သုံးခြင်း

ကိုယ့် workspace ထဲက manual collection run တစ်ခုထဲကို data file တစ်ခု upload လုပ်ပြီး — file ကို Postman cloud နဲ့ sync လုပ်နိုင်ပါတယ်။ Workspace တစ်ခုထဲကို data file upload လုပ်ဖို့ — Editor permissions ရှိရပါမယ်။ Workspace ကို ဝင်လို့ရတဲ့ ကိုယ်နဲ့ ကိုယ့် team members တွေက — workspace ထဲက နောက်ပိုင်း manual collection runs တွေမှာ uploaded data file ကို ပြန်သုံးနိုင်ပါတယ်။ Scheduled runs, monitors, Postman CLI နဲ့ Newman တွေက uploaded data files တွေကို ပံ့ပိုးမပေးတာ သတိပြုပါ။

Data files တွေက သူတို့ upload လုပ်ထားတဲ့ workspace ထဲမှာပဲ ရနိုင်ပါတယ်။ အခြား workspace တစ်ခုမှာ data file တစ်ခုတည်းကို သုံးချင်ရင် — အဲဒီ workspace ထဲကိုလည်း data file ကို ပြန် upload လုပ်ရပါမယ်။

Workspace ထဲကို upload လုပ်ဖို့ data files တွေက 5 MB ထက် သေးရပါမယ်။

Data file တစ်ခုကို upload လုပ်ပြီး manual collection run တစ်ခုထဲကို ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး **Collections** ကို ချဲ့ပါ။ Run လုပ်ချင်တဲ့ collection ဒါမှမဟုတ် folder ကို ရွေးပါ။

2. ![Run icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-run-stroke.svg#icon) **Run** ကို နှိပ်ပါ။

3. **Functional** ကို ရွေးပြီး — **Local** ကို ရွေးပါ။

4. **Iteration data** dropdown list ကို နှိပ်ပြီး **Datafiles** tab ကို ရွေးပါ။

5. အောက်ပါတွေထဲက တစ်ခုကို ရွေးပါ:

   * Data file အသစ်တစ်ခု upload လုပ်ဖို့ — ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/action-add-stroke.svg#icon) **Select from computer** ကို နှိပ်ပြီး ကိုယ့် computer ထဲက data file တစ်ခုကို ရွေးပါ။ ကိုယ့် file ရဲ့ နာမည်က upload လုပ်ပြီးသား file တစ်ခုရဲ့ နာမည်နဲ့ တူနေရင် — Postman က file ကို နာမည်ပြောင်းပေးတာ သတိပြုပါ။
   * ကိုယ် ဒါမှမဟုတ် team member တစ်ယောက်က workspace ထဲကို upload လုပ်ထားတဲ့ data file တစ်ခုကို ရွေးပါ။

6. Data file ကို preview လုပ်ပါ။

   Data file ကို upload လုပ်စရာ ဒါမှမဟုတ် ထည့်စရာ မလိုတော့ဘူးဆိုရင် — **Remove file from run** ကို နှိပ်ပြီး အခြား file တစ်ခု ရွေးပါ။

7. **Save to Workspace** ကို နှိပ်ပါ။ Data file အသစ်က Postman cloud ထဲကို upload လုပ်ပြီး — data file က manual collection run ထဲကို ထည့်လိုက်ပါတယ်။

8. [Manual collection run ကို configure လုပ်ခြင်း](/docs/postman/intro-to-collection-runs) ကို ဆက်ပြီး လုပ်ပါ။

Data file upload မအောင်မြင်ရင် — file က [local data file](#local-data-file-တစ်ခု-သုံးခြင်း) တစ်ခုအနေနဲ့ manual collection run ထဲကို ထည့်လိုက်ပါတယ်။ နောက်ထပ် options တွေအတွက် — data file ရဲ့ ဘေးက ![Connection error icon](https://assets.postman.com/postman-docs/aether-icons/v12/state-connectionError-stroke.svg#icon) ပေါ်မှာ hover လုပ်ပါ။ Data file ကို ထပ်ကြိုးစား upload လုပ်ဖို့ **Retry** ကို နှိပ်နိုင်သလို — warning ကို ဂရုမစိုက်ဖို့ **Ignore** ကိုလည်း နှိပ်နိုင်ပါတယ်။

ကိုယ့်ရဲ့ [Postman plan](https://www.postman.com/pricing/) က uploaded data files တွေအတွက် သုံးလို့ရတဲ့ ကန့်သတ်ထားတဲ့ storage နေရာတစ်ခုကို ပေးပါတယ်။ Plan က uploaded files တွေကို ပြန်ယူလို့ရတဲ့ (retrieval) အကြိမ်အရေအတွက် ကန့်သတ်ချက်တစ်ခုကိုလည်း ပေးပါတယ်။ [Test data usage](https://learning.postman.com/docs/billing/resource-usage/#test-data-usage) အကြောင်း ပိုလေ့လာပါ။

## Data file တစ်ခု format လုပ်ခြင်း

Collection run တစ်ခုနဲ့ CSV ဒါမှမဟုတ် JSON file တစ်ခုကို upload လုပ်တာ ဒါမှမဟုတ် သုံးတာမပြုခင် — file က formatting guidelines တွေနဲ့ ကိုက်ညီကြောင်း သေချာပါစေ။ [CSV file တစ်ခုကို format လုပ်နည်း](#csv-ဖိုင်တစ်ခုကို-format-လုပ်နည်း) နဲ့ [JSON file တစ်ခုကို format လုပ်နည်း](#json-ဖိုင်တစ်ခုကို-format-လုပ်နည်း) တွေကို လေ့လာပါ။

ဥပမာ — query parameters တွေအနေနဲ့ serial number တစ်ခုရော contact number တစ်ခုရော နှစ်ခုလုံး လက်ခံတဲ့ requests တွေပါတဲ့ collection တစ်ခု ရှိနိုင်ပါတယ်။ သက်ဆိုင်ရာ values တွေက ကိုယ့် request ထဲမှာ `{{serial}}` နဲ့ `{{contact_no}}` လိုမျိုး [variables](/docs/postman/variables) တွေ ဖြစ်ရပါမယ်။ ပြီးရင် — file တစ်ခုချင်းစီရဲ့ သက်ဆိုင်ရာ guidelines တွေအတိုင်း variable names တွေကိုပဲ သုံးပြီး ကိုယ့် file ကို format လုပ်နိုင်ပါတယ်။ Variable names တွေက case sensitive ဖြစ်လို့ — Postman နဲ့ ကိုယ့် data file ကြားမှာ နာမည်ရော case ရော တိုက်ဆိုင်နေရမယ်ဆိုတာ သတိပြုပါ။

Data files တွေထဲက variables တွေက [local variables](/docs/postman/variables) တွေအနေနဲ့ resolve လုပ်ပါတယ်။ Value တစ်ခုချင်းစီကို စစ်ဆေးတာမျိုး — ဥပမာ values တွေ တရားဝင်ကြောင်း အတည်ပြုတာမျိုး လုပ်တဲ့ [test script တစ်ခု ရေးနိုင်ပါတယ်](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/)။ Scripts တွေထဲမှာ [iteration data တွေကို ဘယ်လို သုံးမလဲ](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/overview/) အကြောင်း ပိုလေ့လာပါ။

### CSV ဖိုင်တစ်ခုကို format လုပ်နည်း

CSV file တစ်ခုအတွက် — ပထမဆုံး row ထဲမှာ requests တွေထဲမှာ သုံးချင်တဲ့ variable names တွေ ပါရပါမယ်။ အဲဒီနောက် နောက် row တိုင်းကို data row တစ်ခုအနေနဲ့ သုံးပါတယ်။ Line ending တိုင်းက Unix format နဲ့ ဖြစ်ရပြီး — row တိုင်းမှာ column အရေအတွက် တူညီရပါမယ်။

CSV file တစ်ခုကို format လုပ်တဲ့အခါ အောက်ပါ အချက်တွေကို သတိပြုပါ:

* ကိုယ့် data file ထဲက ဂဏန်းတွေက ဂဏန်း 15 လုံးထက် ရှည်နေရင် — CSV format နဲ့ export လုပ်တဲ့အခါ ဖြတ်တောက်မခံရအောင် — ကိုယ့် spreadsheet program ထဲမှာ သူတို့ကို text အဖြစ် format လုပ်ထားဖို့ လိုပါတယ်။
* ကိုယ့် CSV file ထဲမှာ ဂဏန်း 16 လုံးထက် ရှည်တဲ့ ဂဏန်းတွေ, ရှေ့မှာ သုညတွေ ပါတဲ့ ဂဏန်းတွေ (ဥပမာ `000000345`), ဒါမှမဟုတ် ဖုန်းနံပါတ်တွေ (ဥပမာ `+12125556709`) ရှိနေရင် — file ကို preview လုပ်ပြီး Postman ထဲမှာ column အတွက် data type ကို သတ်မှတ်ဖို့ လိုပါတယ်။

အောက်မှာ CSV data file တစ်ခုရဲ့ ဥပမာပါ:

```csv
City,Ramen
Vancouver,100
San Francisco,84
Singapore,79
Austin,66
Los Angeles,65
```

### JSON ဖိုင်တစ်ခုကို format လုပ်နည်း

JSON file တစ်ခုအတွက် — data ကို key-value pairs တွေရဲ့ array တစ်ခုအနေနဲ့ format လုပ်ရပါမယ်။ Key တစ်ခုချင်းစီက variable name ဖြစ်ပြီး — value တစ်ခုချင်းစီက request ထဲမှာ သုံးမယ့် data ပါ။

အောက်မှာ JSON data file တစ်ခုရဲ့ ဥပမာပါ:

```json
[
  {
    "City": "Vancouver",
    "Ramen": 100
  },
  {
    "City": "San Francisco",
    "Ramen": 84
  },
  {
    "City": "Singapore",
    "Ramen": 79
  },
  {
    "City": "Austin",
    "Ramen": 66
  },
  {
    "City": "Los Angeles",
    "Ramen": 65
  }
]
```
