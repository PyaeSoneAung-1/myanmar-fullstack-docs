---
title: "Postman မှာ datasets တွေကို စီမံခြင်း (Manage datasets in Postman)"
description: "Dataset တစ်ခုကို စီမံခြင်း — နာမည်ပြောင်းခြင်း၊ data sources နဲ့ views တွေ ထည့်/update/ဖျက်ခြင်း၊ Agent Mode နဲ့ sample data ထည့်ခြင်း၊ dataset တစ်ခုကို team နဲ့ မျှဝေခြင်း၊ Postman Cloud နဲ့ push/pull လုပ်ခြင်း၊ troubleshooting"
order: 127
source: "https://learning.postman.com/docs/tests-and-scripts/datasets/manage-datasets/"
status: translated
updated: 2026-09-03
---

Datasets တွေကို Postman Solo, Team နဲ့ Enterprise plans တွေမှာ ရနိုင်ပါတယ်။ ပိုမိုသိရှိရန် [pricing page](https://www.postman.com/pricing/) ကို ကြည့်ပါ။

ကိုယ့် datasets တွေရဲ့ data sources နဲ့ views တွေ လက်ရှိ အခြေအနေနဲ့ ကိုက်ညီနေအောင် စီမံနိုင်ပါတယ်။ ကိုယ့် workflows တွေ တိုးတက်ပြောင်းလဲလာတာနဲ့အမျှ — data sources အသစ်တွေ ထည့်နိုင်ပြီး၊ ရှိပြီးသား တွေကို update လုပ်နိုင်ကာ tests, scripts နဲ့ mock servers တွေမှာ data တွေကို ဘယ်လို ပြန်ယူပြီး သုံးလဲ ထိန်းချုပ်ဖို့ views တွေကို ပြုပြင်နိုင်ပါတယ်။

## Datasets တွေကို စီမံခြင်း (Manage datasets)

Dataset တစ်ခုကို စီမံပြီး — သူ့ရဲ့ အသေးစိတ်တွေကို update လုပ်နိုင်သလို ကိုယ့် workspace ထဲမှာ သိမ်းဆည်းထားတဲ့ ပုံစံကိုလည်း ပြောင်းလဲနိုင်ပါတယ်။ Local View မှာ — dataset တစ်ခုစီကို သူ့ရဲ့ data sources နဲ့ views တွေ ပါဝင်တဲ့ [ကိုယ့် local Git repository ထဲက YAML file](/docs/postman/create-datasets) တစ်ခုက သတ်မှတ်ပါတယ်။

Dataset တစ်ခုကို စီမံဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပါ။
2. **Datasets** ကို နှိပ်ပါ။
3. Dataset တစ်ခုရဲ့ ဘေးမှာ ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions** ကို နှိပ်ပါ။

အောက်ပါ လုပ်ဆောင်ချက်တွေကို လုပ်နိုင်ပါတယ်:

* **Rename** — Dataset ရဲ့ နာမည်ကို ပြောင်းပါ။
* **Add source** — Data source အသစ်တစ်ခု ထည့်ဖို့ ဒါမှမဟုတ် ရှိပြီးသား တစ်ခုကို update လုပ်ဖို့ dataset ရဲ့ overview ကို ဖွင့်ပါ။ Data sources တွေကို စီမံခြင်း အကြောင်း ပိုလေ့လာပါ။
* **Edit YAML** — (Local View မှာသာ) Dataset ရဲ့ YAML file ကို တိုက်ရိုက် ဖွင့်ပြီး တည်းဖြတ်ပါ။ ဒီ file က dataset ရဲ့ data sources နဲ့ views တွေကို သတ်မှတ်ပြီး — ကိုယ့် local Git repository ထဲမှာ သိမ်းဆည်းပါတယ်။ File ထဲမှာ dataset ရဲ့ နာမည်နဲ့ ID လိုမျိုး metadata တွေလည်း ပါဝင်ပါတယ်။
* **Delete** — Dataset ကို ကိုယ့် workspace ကနေ ဖယ်ရှားပါ။

## Data sources တွေကို စီမံခြင်း (Manage data sources)

Data source အသစ်တစ်ခု ထည့်ပြီး ရှိပြီးသား dataset တစ်ခုကို ချဲ့နိုင်ပါတယ်။ Data source တစ်ခုကို ကြည့်ပြီး သူ့ရဲ့ အသေးစိတ်တွေကို မြင်နိုင်သလို — MySQL, Postgres ဒါမှမဟုတ် SQL Server data source တစ်ခုဆိုရင် သူ့ရဲ့ configuration ကိုလည်း update လုပ်နိုင်ပါတယ်။ Dataset တစ်ခုကနေ data source တစ်ခုကိုလည်း ဖယ်ရှားနိုင်ပါတယ်။

### Data source အသစ်တစ်ခု ထည့်ခြင်း (Add a new data source)

Data source အသစ်တစ်ခု ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပါ။
2. **Datasets** ကို နှိပ်ပါ။
3. Dataset တစ်ခုကို ရွေးပြီး သူ့ရဲ့ overview ကို ဖွင့်ပါ။ Dataset တစ်ခုရဲ့ ဘေးက ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions** ကို နှိပ်ပြီး **Add source** ကို ရွေးလည်း ရပါတယ်။
4. **Add source** ကို နှိပ်ပြီး ထည့်ချင်တဲ့ [data source type](/docs/postman/create-datasets) ကို ရွေးပါ။
5. Data source ကို configure လုပ်ပြီး ကိုယ့် dataset ထဲကို ထည့်ပါ။
6. (ချန်လှပ်ထားလို့ ရတယ်) ကိုယ့် workflows တွေမှာ data အမျိုးအစား အမျိုးမျိုးကို ပေါင်းစပ်ဖို့ data sources တွေ ထပ်ထည့်ပါ။

Dataset တစ်ခုကနေ data source တစ်ခုကို ဖယ်ရှားဖို့ — data source ပေါ်မှာ hover လုပ်ပြီး ![Delete icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-delete-stroke.svg#icon) ကို နှိပ်ကာ အတည်ပြုဖို့ **Delete** ကို နှိပ်ပါ။ အဲဒီ data source ကို သုံးထားတဲ့ views တွေကို update လုပ်ဖို့ သေချာပါစေ — ဘာလို့လဲဆိုတော့ သူ့ကို ဖျက်လိုက်ရင် အဲဒီ views တွေ ပျက်သွားလို့ ဖြစ်ပါတယ်။

### ရှိပြီးသား data source တစ်ခုကို ကြည့်ခြင်းနဲ့ update လုပ်ခြင်း (View and update an existing data source)

ရှိပြီးသား data source တစ်ခုကို ကြည့်နိုင်ပါတယ်။ External ဒါမှမဟုတ် custom data source တစ်ခုဆိုရင် — သူ့ရဲ့ configuration ကိုလည်း update လုပ်နိုင်ပါတယ်။

Data source တစ်ခုကို ကြည့်ပြီး update လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပါ။
2. **Datasets** ကို နှိပ်ပါ။
3. Dataset တစ်ခုကို ရွေးပြီး သူ့ရဲ့ overview ကို ဖွင့်ပါ။
4. Data source တစ်ခုကို နှိပ်ပြီး tab အသစ်တစ်ခုထဲမှာ ဖွင့်ပါ။
5. Data source ကို update လုပ်ပါ:
   * Data source က [external data source](/docs/postman/create-datasets) တစ်ခုဆိုရင် — သူ့ရဲ့ connection အသေးစိတ်တွေကို update လုပ်နိုင်ပါတယ်။ **Settings** tab ကို နှိပ်ပြီး connection အသေးစိတ်တွေကို update ကာ preview ကို update လုပ်ဖို့ **Refresh** ကို နှိပ်ပါ။ Preview ကို **Data** tab ကနေ ကြည့်နိုင်ပါတယ်။
   * Data source က local file တစ်ခုဆိုရင် — တခြား file တစ်ခု ရွေးဖို့ **Change** ကို နှိပ်ပြီး data ကို preview ကာ **Save** ကို နှိပ်ပါ။ Postman က CSV, JSON နဲ့ spreadsheet files တွေကို ပံ့ပိုးပါတယ်။ Upload လုပ်ထားတဲ့ Postman cloud files တွေက read-only ဖြစ်လို့ — data တွေကို ကြည့်နိုင်ပေမယ့် file ကို ပြောင်းလို့ မရပါဘူး။

### Agent Mode နဲ့ data source တစ်ခုကို update လုပ်ခြင်း (Update a data source with Agent Mode)

Data sources အသစ်တွေ ထည့်ဖို့ ဒါမှမဟုတ် ရှိပြီးသား တွေကို sample data တွေနဲ့ update လုပ်ဖို့ [Agent Mode](https://learning.postman.com/docs/use/agent-mode/overview) ကို သုံးနိုင်ပါတယ်။ Files တွေ ဒါမှမဟုတ် database records တွေကို ကိုယ်တိုင် တည်းဖြတ်စရာ မလိုဘဲ — test data တွေကို မြန်မြန် ပြန်လန်းဆန်းစေချင်တဲ့အခါ ဒါမှမဟုတ် dataset တစ်ခုကို ချဲ့ချင်တဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။

Agent Mode က CSV ဒါမှမဟုတ် JSON data files တွေကို — data အသစ်တွေ ဒါမှမဟုတ် ပြုပြင်ထားတဲ့ data တွေနဲ့ ဖန်တီးနိုင်သလို update လည်း လုပ်နိုင်ပါတယ်။ ဥပမာ — Agent Mode ကို အောက်ပါအတိုင်း တောင်းဆိုနိုင်ပါတယ်:

#### CSV ဒါမှမဟုတ် JSON file တစ်ခုကို sample data တွေနဲ့ update လုပ်ခြင်း (Update a CSV or JSON file with sample data)

userId, name နဲ့ email fields တွေ ပါဝင်တဲ့ လက်တွေ့ကျတဲ့ data တွေနဲ့ user အသစ် ၅ ယောက်ကို ကိုယ့် dataset ထဲကို ထည့်ပေးဖို့ Agent Mode ကို တောင်းဆိုနိုင်ပါတယ်။

ချိတ်ဆက်ထားတဲ့ database တစ်ခု ရှိနေရင် — ရှိပြီးသား tables တွေထဲကို sample data တွေ ထုတ်လုပ်ပြီး ထည့်သွင်းဖို့လည်း Agent Mode ကို သုံးနိုင်ပါတယ်။ ဥပမာ — အောက်ပါအတိုင်း တောင်းဆိုနိုင်ပါတယ်:

#### External data source တစ်ခုကို sample data တွေနဲ့ update လုပ်ခြင်း (Update an external data source with sample data)

ကိုယ့် ချိတ်ဆက်ထားတဲ့ MySQL data source ထဲက orders table ထဲကို လက်တွေ့ကျတဲ့ data တွေနဲ့ sample orders ၁၀ ခု ထုတ်လုပ်ပြီး ထည့်သွင်းပေးဖို့ Agent Mode ကို တောင်းဆိုနိုင်ပါတယ်။

Data source ကို update လုပ်ပြီးနောက် — data source ကို refresh လုပ်ပြီး အပြောင်းအလဲတွေ ထင်ဟပ်စေဖို့ လိုအပ်သလို ကိုယ့် views တွေကိုလည်း update လုပ်နိုင်ပါတယ်။

## Views တွေကို စီမံခြင်း (Manage views)

View အသစ်တစ်ခု ထည့်နိုင်သလို — ရှိပြီးသား တစ်ခုကို update လုပ်ပြီး ကိုယ့် dataset ကနေ data တွေကို ပြန်ယူတဲ့ ပုံစံကို ပြောင်းလဲနိုင်ပါတယ်။ View တစ်ခုက data တွေကို ကိုယ့် workflows အတွက် ဘယ်လို စစ်ထုတ်၊ ပေါင်းစပ် ဒါမှမဟုတ် ပြောင်းလဲလဲ သတ်မှတ်ပါတယ်။ ဥပမာ — data source ကနေ data အစိတ်အပိုင်းတစ်ခုကိုသာ ပြန်ပေးဖို့ ဒါမှမဟုတ် ရှိပြီးသား data တွေကို အခြေခံပြီး column အသစ်တွေ ဖန်တီးဖို့ view တစ်ခုရဲ့ query ကို update လုပ်နိုင်ပါတယ်။

Views တွေက data sources အများအပြားကနေ data တွေကို ပြန်ယူနိုင်ပါတယ်။ ဒါပေမယ့် — views တွေက local data sources နဲ့ cloud data sources တွေကန့် data တွေကို ပေါင်းစပ်လို့ မရပါဘူး။

View တစ်ခု ထည့်ဖို့ ဒါမှမဟုတ် update လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပါ။

2. **Datasets** ကို နှိပ်ပါ။

3. Dataset တစ်ခုကို ရွေးပြီး သူ့ရဲ့ overview ကို ဖွင့်ပါ။

4. အောက်ပါတို့ထဲက ရွေးပါ:

   * View အသစ်တစ်ခု ထည့်ဖို့ — **Create view** ကို နှိပ်ပါ။ Dialog ထဲမှာ နာမည်တစ်ခု ထည့်ပြီး — view က query လုပ်မယ့် sources တွေကို ရွေးကာ **Create view** ကို နှိပ်ပါ။
   * ရှိပြီးသား view တစ်ခုကို update လုပ်ဖို့ — view ကို နှိပ်ပါ။

5. Data source ကနေ data တွေကို ဘယ်လို ပြန်ယူလဲ သတ်မှတ်တဲ့ SQLite-compatible query ကို ထည့်ပါ ဒါမှမဟုတ် တည်းဖြတ်ပါ။ Queries တွေ ဘယ်လို ရေးလဲ ပိုသိချင်ရင် — [ဥပမာ dataset views](/docs/postman/example-dataset-views) ကို ကြည့်ပါ။

6. Query ကို run ပြီး table pane ထဲမှာ ရလဒ်တွေကို ကြိုကြည့်ဖို့ **Run** ကို နှိပ်ပါ။ ရလဒ်တွေကို ရှာဖွေလည်း လုပ်နိုင်ပါတယ်။

7. ကိုယ့် အပြောင်းအလဲတွေကို သိမ်းပါ:

   * လက်ရှိ view ထဲကို ကိုယ့် အပြောင်းအလဲတွေ သိမ်းဖို့ — **Update** ကို နှိပ်ပါ။
   * လက်ရှိ view ကို မပြောင်းဘဲ — သီးခြား view တစ်ခုအနေနဲ့ သိမ်းဖို့ — **Save as new view** ကို နှိပ်ပါ။
   * ကိုယ့် အပြောင်းအလဲတွေကို ပယ်ပြီး နောက်ဆုံး သိမ်းထားတဲ့ query ဆီ ပြန်သွားဖို့ — **Reset** ကို နှိပ်ပါ။

View တစ်ခုရဲ့ ဘေးမှာ ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions** ကို နှိပ်ပြီး အောက်ပါတို့ကို လုပ်နိုင်ပါတယ်:

* **Rename** — View ရဲ့ နာမည်ကို ပြောင်းပါ။
* **Ask AI** — View အကြောင်း နားလည်ဖို့ ဒါမှမဟုတ် debug လုပ်ဖို့ — view အကြောင်း context ပါတဲ့ [Agent Mode](https://learning.postman.com/docs/use/agent-mode/overview) ကို ဖွင့်ပါ။
* **Preview** — View ရဲ့ query က ပြန်ပေးတဲ့ data ရဲ့ အစိတ်အပိုင်းတစ်ခုကို ကြိုကြည့်ပါ။
* **Delete** — View ကို dataset ကနေ ဖယ်ရှားပါ။ ဒါက အရင်းခံ data source ကို ဖျက်တာ မဟုတ်ပါဘူး — ဒါပေမယ့် view ရဲ့ query နဲ့ data တွေပေါ်မှာ သူ သက်ရောက်စေတဲ့ အသွင်ပြောင်းမှုတွေကိုတော့ ဖယ်ရှားပါတယ်။

## Dataset တစ်ခုကို မျှဝေခြင်း (Share a dataset)

Cloud View မှာ — ကိုယ့် team က သူတို့ရဲ့ tests, scripts နဲ့ mock servers တွေမှာ သုံးနိုင်အောင် dataset တစ်ခုကို မျှဝေနိုင်ပါတယ်။ Dataset, data source ဒါမှမဟုတ် view တစ်ခုဆီကို တိုက်ရိုက် link တစ်ခု မျှဝေနိုင်ပါတယ်။

Dataset တစ်ခုကို မျှဝေဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲမှာ ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပါ။
2. **Datasets** ကို နှိပ်ပါ။
3. Dataset တစ်ခုကို ရွေးပြီး သူ့ရဲ့ overview ကို ဖွင့်ပါ။
4. အပေါ်ညာဘက်မှာ ![Link icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-link-stroke.svg#icon) **Copy link to this dataset** ကို နှိပ်ပါ။

Data source ဒါမှမဟုတ် view တစ်ခုကို မျှဝေဖို့ — သူ့ကို နှိပ်ပြီး tab အသစ်တစ်ခုထဲမှာ ဖွင့်ကာ ![Link icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-link-stroke.svg#icon) **Copy link to this source/view** ကို နှိပ်ပါ။

## Datasets တွေကို push နဲ့ pull လုပ်ခြင်း (Push and pull datasets)

Datasets တွေကို Postman Cloud ဆီ push လုပ်ပြီး Postman Cloud ကနေ pull လုပ်ကာ — ကိုယ့် team နဲ့ မျှဝေနိုင်သလို devices အမျိုးမျိုးကနေ ဝင်ရောက်နိုင်ပါတယ်။

Dataset တစ်ခုကို push လုပ်တဲ့အခါ — Postman က dataset ရဲ့ နောက်ဆုံး ဗားရှင်းကို ကိုယ့် local workspace ကနေ Postman Cloud ဆီ sync လုပ်ပေးပါတယ်။ Postman Cloud ဆီ push လုပ်လိုက်တဲ့ local files တွေက [cloud files](/docs/postman/create-datasets) တွေ ဖြစ်သွားပါတယ်။

Dataset တစ်ခုကို pull လုပ်တဲ့အခါ — Postman က dataset ရဲ့ နောက်ဆုံး ဗားရှင်းကို Postman Cloud ကနေ ကိုယ့် local workspace ဆီ sync လုပ်ပေးပါတယ်။ ကိုယ့် local workspace ဆီ pull လုပ်လိုက်တဲ့ cloud files တွေက — ကိုယ့် Git repository ထဲက [local files](/docs/postman/create-datasets) တွေ ဖြစ်သွားပါတယ်။

[Postman မှာ changes တွေကို push ခြင်းနဲ့ pull လုပ်ခြင်း](https://learning.postman.com/docs/use/native-git/collaborate) အကြောင်း ပိုလေ့လာပါ။

## Datasets တွေကို troubleshoot လုပ်ခြင်း (Troubleshoot datasets)

Datasets တွေနဲ့ အလုပ်လုပ်ရာမှာ ပြဿနာတွေ ကြုံရရင် — အဖြစ်များတဲ့ ပြဿနာတွေကို ရှာဖွေဖော်ထုတ်ပြီး ဖြေရှင်းဖို့ အောက်ပါ troubleshooting အဆင့်တွေကို သုံးပါ။

Error icon `(!)` က left sidebar ထဲက dataset တစ်ခုရဲ့ ဘေးမှာ အောက်ပါ အခြေအနေတွေမှာ ပေါ်နိုင်ပါတယ်:

* **Dataset က out of sync ဖြစ်နေတယ်** — Postman ရဲ့ အပြင်ဘက်မှာ dataset files တွေကို တည်းဖြတ်မိတာ ဒါမှမဟုတ် မဖြေရှင်းရသေးတဲ့ merge conflicts တွေ ရှိနေတာကြောင့် ဖြစ်နိုင်ပါတယ်။ Dataset ကို ကိုယ့် local files တွေနဲ့ ပြန် sync လုပ်ဖို့ Postman ကို ပြန်စပါ။

* **Dataset files တွေ invalid ဒါမှမဟုတ် ပျက်စီးနေတယ်** — Dataset files တွေမှာ invalid formatting ဒါမှမဟုတ် content တွေ ရှိနေလို့ ဖြစ်နိုင်ပါတယ်။ Formatting ပြဿနာတွေအတွက် ကိုယ့် local Git repository ထဲက files တွေကို စစ်ဆေးပါ၊ ဒါမှမဟုတ် မကြာသေးခင်က အပြောင်းအလဲတွေကြောင့် ပြဿနာ ဖြစ်ရင် — အရင် commit တစ်ခုကနေ ပြန်ယူပါ။

ကိုယ့် datasets တွေမှာ ပြဿနာ တစ်ခုခု ရှိနေရင် — [Postman support ကို ဆက်သွယ်ပါ](https://www.postman.com/support/)။
