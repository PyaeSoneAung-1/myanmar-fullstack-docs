---
title: "Postman မှာ datasets တွေ ဖန်တီးခြင်း (Create datasets in Postman)"
description: "Postman မှာ datasets တွေ ဘယ်လို ဖန်တီးလဲ — data sources နဲ့ views ဆိုတာ ဘာလဲ၊ data file တွေ (local နဲ့ Postman Cloud Store), MySQL/Postgres/SQL Server လို external data sources တွေ, JDBC driver သုံး custom data sources တွေ, AI နဲ့ data ထည့်ခြင်း"
order: 125
source: "https://learning.postman.com/docs/tests-and-scripts/datasets/create-datasets/"
status: translated
updated: 2026-09-03
---

Datasets တွေကို Postman Solo, Team နဲ့ Enterprise plans တွေမှာ ရနိုင်ပါတယ်။ ပိုမိုသိရှိရန် [pricing page](https://www.postman.com/pricing/) ကို ကြည့်ပါ။

Datasets တွေကို သုံးပြီး — Postman ထဲက ကိုယ့် API workflows တွေအနှံ့မှာ data တွေကို စီမံခန့်ခွဲပြီး သုံးနိုင်ပါတယ်။ Data-driven collection tests တွေ run လုပ်နိုင်ပြီး — dynamic mock responses တွေကို အားဖြည့်နိုင်ကာ scripts တွေအနှံ့မှာ data တစ်ခုတည်းကို ပြန်သုံးနိုင်ပါတယ်။ Datasets တွေက data files တွေနဲ့ external systems တွေကန့် live data တွေ နှစ်မျိုးလုံးနဲ့ အလုပ်လုပ်နိုင်စေတာကြောင့် — data တွေကို နေရာမျိုးစုံမှာ duplicate လုပ်ခြင်း ဒါမှမဟုတ် စီမံခြင်း မရှိဘဲ အခြေအနေ (scenario) အမျိုးမျိုးကို test လုပ်နိုင်ပါတယ်။

## Datasets အကြောင်း (About datasets)

*dataset* ဆိုတာ — ကိုယ့် API workflows တွေအနှံ့မှာ သုံးလို့ရတဲ့ data အစုတစ်ခု ဖြစ်ပါတယ်။ Dataset တစ်ခုစီကို YAML file တစ်ခုထဲမှာ သိမ်းဆည်းပြီး — data sources နဲ့ views ဆိုပြီး စုစည်းထားပါတယ်:

* *Data sources* တွေက data တွေ ဘယ်ကနေ လာလဲ သတ်မှတ်ပါတယ် — CSV, JSON ဒါမှမဟုတ် spreadsheet data files တွေ (local မှာ ဒါမှမဟုတ် Postman Cloud ထဲမှာ), MySQL, Postgres ဒါမှမဟုတ် SQL Server လိုမျိုး external connections တွေ၊ ဒါမှမဟုတ် JDBC driver တစ်ခုကို သုံးတဲ့ custom database connections တွေ ပါဝင်ပါတယ်။
* *Views* တွေက data sources တွေကနေ data တွေကို ဘယ်လို ပြန်ယူလဲ သတ်မှတ်တဲ့ SQL queries တွေ ဖြစ်ပါတယ်။ ဒါတွေက ကိုယ့် tests, scripts နဲ့ mocks တွေနဲ့ အလုပ်ဖြစ်အောင် — data တွေကို ရွေးချယ်၊ စစ်ထုတ်ပြီး ပေါင်းစပ်နိုင်စေပါတယ်။ Views တွေက SQLite-compatible SQL syntax နဲ့ functions တွေကို ပံ့ပိုးပါတယ်။

## Dataset တစ်ခု ဖန်တီးခြင်း (Create a dataset)

Collection runs, code mocks နဲ့ scripts တွေအနှံ့မှာ သုံးဖို့ dataset တစ်ခုကို ဖန်တီးပါ။ Dataset တစ်ခုမှာ — data files (static) ဒါမှမဟုတ် MySQL, Postgres, SQL Server ဒါမှမဟုတ် JDBC driver ရှိတဲ့ database တစ်ခုခုလို live data (dynamic) ကနေ — data sources အများအပြား ပါဝင်နိုင်ပါတယ်။

Dataset တစ်ခု ဖန်တီးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Left sidebar ထဲမှာ ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-add-stroke.svg#icon) ကို နှိပ်ပြီး **Dataset** ကို ရွေးပါ။
2. (ချန်လှပ်ထားလို့ ရတယ်) ကိုယ့် dataset အတွက် နာမည်နဲ့ ဖော်ပြချက် (description) တစ်ခု ထည့်ပါ။
3. ထည့်ချင်တဲ့ data source type ကို ရွေးပါ။ Data source တစ်ခုကို ဖန်တီးပြီးနောက်မှာ — သူ့ရဲ့ type ကို ပြောင်းလို့ မရပါဘူး။
4. Data source ကို configure လုပ်ပြီး ကိုယ့် dataset ထဲကို ထည့်ပါ။ လုပ်ရမယ့် အဆင့်တွေက data source type ပေါ်မှာ မူတည်ပါတယ်။
5. (ချန်လှပ်ထားလို့ ရတယ်) ကိုယ့် workflows တွေမှာ data အမျိုးအစား အမျိုးမျိုးကို ပေါင်းစပ်ဖို့ data sources တွေ ထပ်ထည့်ပါ။

Data source တစ်ခုစီအတွက် — data အားလုံးကို ရွေးယူတဲ့ view တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။ ကိုယ့် workflows တွေ ပြောင်းလဲလာတာနဲ့အမျှ — data sources နဲ့ views တွေကို စီမံနိုင်ပါတယ်။ ဒါက scenario အသစ်တွေကို ပံ့ပိုးနိုင်စေပြီး — အရင်းအမြစ် အမျိုးမျိုးကနေ data တွေကို ပေါင်းစပ်ကာ tests, scripts နဲ့ mocks တွေအနှံ့မှာ data တွေကို ဘယ်လို သုံးလဲ ထိန်းချုပ်နိုင်စေပါတယ်။ [Datasets တွေကို စီမံခြင်း](/docs/postman/manage-datasets) အကြောင်း ပိုလေ့လာပါ။

### Dataset file အကြောင်း (About the dataset file)

Local View ထဲက Postman desktop app မှာ — Postman က သူ့ရဲ့ data sources နဲ့ views တွေကို သတ်မှတ်တဲ့ YAML file တစ်ခုကို ထုတ်ပေးပါတယ်။ အဲဒီ file ထဲမှာ — dataset ရဲ့ နာမည်နဲ့ ID လိုမျိုး metadata တွေလည်း ပါဝင်ပါတယ်။ ဒီ file ကို ကိုယ့် local Git repository ထဲမှာ သိမ်းဆည်းပြီး — ကိုယ့် dataset configuration ရဲ့ source of truth (မူရင်း အရင်းအမြစ်) အဖြစ် ဆောင်ရွက်ပါတယ်။

Postman ထဲမှာ dataset ကို ပြောင်းလဲမှု တစ်ခုခု လုပ်ရင် အဲဒီ file ထဲမှာ ထင်ဟပ်ပြီး — file ထဲကို update လုပ်ရင်လည်း Postman ထဲမှာ ထင်ဟပ်ပါတယ်။ ဒါကို သုံးပြီး အပြောင်းအလဲတွေကို ပြန်လည် စစ်ဆေးနိုင်ပြီး — version control ထဲမှာ ကိုယ့် dataset ကို စီမံနိုင်ပါတယ်။

Dataset file က `/postman/datasets/<dataset-name>/<dataset-name>.dataset.yaml` မှာ တည်ရှိပါတယ်။

## Data source အမျိုးအစားများ (Data source types)

Dataset တစ်ခုထဲကို data sources အများအပြား ထည့်နိုင်ပါတယ်။ ရနိုင်တဲ့ data source types တွေကတော့ — Postman Cloud Store, Local File, MySQL, Postgres, SQL Server, JDBC driver သုံးတဲ့ custom data sources နဲ့ AI က ထုတ်ပေးတဲ့ data files တွေ ဖြစ်ပါတယ်။

ထည့်လို့ရတဲ့ data source types တွေက — Postman desktop app ကို သုံးနေလား Postman web app ကို သုံးနေလဲဆိုတာပေါ်မှာ မူတည်ပါတယ်:

* **Postman desktop app** — Data source types အားလုံး ထည့်နိုင်ပါတယ်: Postman Cloud Store, Local File, MySQL, Postgres, SQL Server နဲ့ custom JDBC data sources တွေ။
* **Postman web app** — Postman Cloud Store, MySQL နဲ့ Postgres တွေ ထည့်နိုင်ပါတယ်။ Local files, SQL Server ဒါမှမဟုတ် custom JDBC data sources တွေကိုတော့ ထည့်လို့ မရပါဘူး။

### Data file (ဒေတာဖိုင်)

Data source တစ်ခုအနေနဲ့ data file တစ်ခုကို ထည့်နိုင်ပါတယ်။ Postman က CSV, JSON နဲ့ spreadsheet (`.xlsx`, `.xls` နဲ့ `.ods`) files တွေကို ပံ့ပိုးပါတယ်။ Spreadsheet တစ်ခုမှာ sheets အများကြီး ရှိနေရင် — Postman က sheet တစ်ခုစီကို data source တစ်ခုစီအနေနဲ့ ထည့်ပါတယ်။ File တစ်ခုကို နည်းလမ်း နှစ်မျိုးနဲ့ ထည့်နိုင်ပါတယ်:

* **Local File** — ကိုယ့် local machine ကနေ file တစ်ခု ထည့်ပါ။ Local View မှာ — file ကို ကိုယ့် local Git repository ထဲကို ကူးဖို့ **Copy file to repository** checkbox (default အနေနဲ့ ရွေးထားပြီးသား) ကို ရွေးပါ။ ဒါဆိုရင် file က ကိုယ့် workspace ထဲမှာ ပါဝင်ပြီး — တခြားသူတွေနဲ့ မျှဝေနိုင်ကာ Agent Mode က sample data တွေနဲ့ ပြုပြင်မွမ်းမံနိုင်ပါတယ်။ File အကြီးကြီးတွေအတွက်တော့ ဒီ option ကို ပိတ်ထားဖို့ စဉ်းစားပါ။ Cloud View မှာတော့ file က ကိုယ့် machine ပေါ်မှာပဲ ကျန်နေတာကြောင့် — devices, users နဲ့ cloud runs တွေအနှံ့မှာ ဝင်ရောက်ဖို့ လိုရင် Postman Cloud Store ကို သုံးပါ။
* **Postman Cloud Store** — ကိုယ့် local machine ကနေ file တစ်ခု ရွေးပြီး Postman Cloud Store ထဲကို upload လုပ်ပါ။ ဒါဆိုရင် devices, users နဲ့ cloud runs တွေအနှံ့မှာ ရနိုင်ပါတယ်။

Data file တစ်ခု ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. **Local File** ဒါမှမဟုတ် **Postman Cloud Store** ကို ရွေးပါ။
2. ကိုယ့် local machine ကနေ file တစ်ခုကို ရွေးပါ၊ ဒါမှမဟုတ် workbench ထဲကို ဆွဲချပါ။
3. Data ကို ကြိုကြည့် (preview) ပြီး — **Save** ကို နှိပ်ပါ။ Spreadsheet files တွေကိုတော့ preview လုပ်လို့ မရပါဘူး၊ ဒါပေမယ့် source တစ်ခုအနေနဲ့ ထည့်လို့တော့ ရပါတယ်။

### External data source (ပြင်ပ data source)

Live database source တစ်ခုနဲ့ ချိတ်ဆက်ဖို့ Postman Team ဒါမှမဟုတ် Enterprise plan တစ်ခု လိုအပ်ပါတယ်။ ပိုမိုသိရှိရန် [pricing page](https://www.postman.com/pricing/) ကို ကြည့်ပါ။

MySQL, Postgres ဒါမှမဟုတ် SQL Server ကို external data source တစ်ခုအနေနဲ့ ချိတ်ဆက်နိုင်ပါတယ်။ ကိုယ့် data source က firewall တစ်ခုရဲ့ နောက်မှာ ဒါမှမဟုတ် အများပြည်သူကနေ ဝင်ရောက်လို့ မရတဲ့ နေရာမှာ ရှိနေရင် — SSH tunnel တစ်ခုကနေ ချိတ်ဆက်နိုင်ပါတယ်။ SSH tunnel သုံးတဲ့အခါ — data source က SSH server ရဲ့ network ကနေ ဝင်ရောက်လို့ ရနိုင်ရပါမယ်။

MySQL နဲ့ Postgres တွေကို Postman desktop app ရော Postman web app ရော နှစ်ခုလုံးမှာ ချိတ်ဆက်နိုင်ပါတယ်။ SQL Server ကိုတော့ Postman desktop app မှာပဲ ပံ့ပိုးပါတယ်။

1. **MySQL**, **Postgres** ဒါမှမဟုတ် **SQL Server** ကို ရွေးပါ။

2. အောက်ပါ connection အသေးစိတ်တွေကို ထည့်ပါ:

   * **Host** — Database server ရဲ့ hostname ဒါမှမဟုတ် IP address။
   * **Port** — Database server အတွက် port နံပါတ်။
   * **Database** — ချိတ်ဆက်ရမယ့် database ရဲ့ နာမည်။
   * **Username** — Database နဲ့ authenticate လုပ်ဖို့ username။
   * **Password** — Database နဲ့ authenticate လုပ်ဖို့ password။
   * **Table** — ချိတ်ဆက်ရမယ့် table ရဲ့ နာမည်။
   * **Schema** — ချိတ်ဆက်ရမယ့် schema ရဲ့ နာမည်။ Postgres နဲ့ SQL Server အတွက်သာ။

3. (ချန်လှပ်ထားလို့ ရတယ်) **Connect through an SSH tunnel** ကို ရွေးပြီး အောက်ပါတို့ကို ထည့်ပါ:

   * **SSH host** — SSH server ရဲ့ hostname ဒါမှမဟုတ် IP address။
   * **SSH port** — SSH server အတွက် port နံပါတ်။
   * **SSH username** — SSH server နဲ့ ချိတ်ဆက်ဖို့ username။
   * **SSH private key** — SSH server နဲ့ authenticate လုပ်ဖို့ private key။ **Choose a file** ကို နှိပ်ပြီး file တစ်ခု ရွေးပါ၊ ဒါမှမဟုတ် key ကို တိုက်ရိုက် paste လုပ်ပါ။
   * **SSH host key** — SSH server ရဲ့ host key။ **Choose a file** ကို နှိပ်ပြီး file တစ်ခု ရွေးပါ၊ ဒါမှမဟုတ် key ကို တိုက်ရိုက် paste လုပ်ပါ။
   * (ချန်လှပ်ထားလို့ ရတယ်) **Skip SSH host key verification** ကို ရွေးပါ — SSH server ရဲ့ host key ကို စစ်ဆေးခြင်း ကျော်သွားပါတယ်။ ဒါက connection ကို man-in-the-middle attacks တွေရဲ့ အန္တရာယ်နဲ့ ထိတွေ့စေနိုင်ပါတယ်။ Non-production testing အတွက်သာ သုံးပါ။

4. Connection အသေးစိတ်တွေ မှန်ကန်ပြီး Postman က ချိတ်ဆက်နိုင်လားဆိုတာ စစ်ဆေးဖို့ **Test connection** ကို နှိပ်ပါ။ Connection မအောင်မြင်ရင် — ကိုယ့် connection အသေးစိတ်တွေ မှန်ကန်ပြီး ကိုယ့် network က data source ဆီ connection တွေ ခွင့်ပြုထားလားဆိုတာ စစ်ဆေးပါ။

Host နဲ့ password လိုမျိုး ထိခိုက်လွယ်တဲ့ data တွေကို [Postman Vault](https://learning.postman.com/docs/use/postman-vault/postman-vault-secrets) ထဲက vault secrets တွေအနေနဲ့ သိမ်းဆည်းပါ။ ထိခိုက်လွယ်တဲ့ data ကို လက်ခံတဲ့ field တစ်ခုရဲ့ ဘေးမှာ ![Unlock icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-unlock-stroke.svg#icon) **Link to vault secret** ကို နှိပ်ပြီး သုံးချင်တဲ့ vault secret တစ်ခုကို ရွေးပါ။ Vault secret တစ်ခုကို update လုပ်ဖို့ — field တစ်ခုရဲ့ ဘေးမှာ ![Vault icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-vault-stroke.svg#icon) **Unlink vault secret** ကို နှိပ်ပြီး vault secret ကို ဖယ်ရှားနိုင်ပါတယ်။

### Custom data source (စိတ်ကြိုက် data source)

Custom data sources တွေကို Enterprise plans တွေမှာသာ ရနိုင်ပါတယ်။ ပိုမိုသိရှိရန် [pricing page](https://www.postman.com/pricing/) ကို ကြည့်ပါ။

JDBC (Java Database Connectivity) driver တစ်ခု ရှိတဲ့ database system တစ်ခုခုကိုမဆို — custom data source တစ်ခု ထည့်ပြီး ချိတ်ဆက်နိုင်ပါတယ်။ ကိုယ့် database က built-in source type တစ်ခုအနေနဲ့ မရှိတဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။ Custom data source တစ်ခု ထည့်တဲ့အခါ — Postman က driver configuration ကို ပြန်သုံးလို့ရတဲ့ type တစ်ခုအနေနဲ့ သိမ်းပေးပါတယ်။ Postman က JDBC ကနေ ပံ့ပိုးတဲ့ databases တွေအတွက် — JDBC ကနေ ပံ့ပိုးထားတဲ့ Databases ကို ကြည့်ပါ။

Custom data source တစ်ခု ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. **JDBC Source** ကို ရွေးပါ။
2. Driver — JDBC driver JAR တစ်ခုကို upload လုပ်ပြီး — driver configuration ကို နာမည်ပေးကာ driver class ကို ရွေးပါ။
3. Connection URL — URL pattern တစ်ခုကို ရွေးပြီး connection template ကို သတ်မှတ်ပါ။
4. Data source — Source ကို နာမည်ပေးပြီး connection values တွေ ဖြည့်ကာ ကိုယ့် dataset ထဲကို ထည့်ပါ။

#### အဆင့် 1: Driver (Step 1: Driver)

JDBC driver JAR file တစ်ခုကို upload လုပ်ပြီး — Postman က ကိုယ့် database နဲ့ ချိတ်ဆက်ဖို့ သုံးမယ့် driver type ကို configure လုပ်ပါ။

1. **Driver JAR** အောက်မှာ **Browse** ကို နှိပ်ပြီး ကိုယ့် local machine ကနေ JDBC driver JAR file တစ်ခုကို ရွေးပါ။ File တစ်ခု ရွေးပြီးနောက် — တခြား file တစ်ခု ရွေးချင်ရင် **Change** ကို နှိပ်ပါ။

   Postman က JAR ကို ဖတ်ပြီး တွေ့ရှိရတဲ့ driver classes အရေအတွက်ကို ပြသပါတယ်။ ကိုယ့် PATH ပေါ်မှာ ရှိတဲ့ compatible Java runtime တစ်ခုကိုလည်း အလိုအလျောက် ရှာဖွေပေးပါတယ်။

   တခြား runtime တစ်ခု လိုအပ်ရင် — **Use a different runtime** ကို နှိပ်ပြီး Java binary ရဲ့ path ကို ပေးပါ။

2. **Type name** field ထဲမှာ — ဒီ driver configuration ကို ကိုယ့် dataset ထဲမှာ ခွဲခြားသိမယ့် နာမည်တစ်ခု ထည့်ပါ။ Database system ကို ထင်ဟပ်စေမယ့် နာမည်တစ်ခု ရွေးပါ — ဥပမာ "MySQL JDBC"။

3. **Driver class** အောက်မှာ — JAR ထဲမှာ တွေ့ရှိရတဲ့ classes စာရင်းကနေ driver class ကို ရွေးပါ။ Driver class ဆိုတာ ကိုယ့် database နဲ့ ဆက်သွယ်မှုကို ကိုင်တွယ်ပေးတဲ့ implementation class ဖြစ်ပါတယ်။ JAR ထဲမှာ driver classes အများကြီး ပါနေရင် — ကိုယ့် database system နဲ့ ကိုက်ညီတဲ့ တစ်ခုကို ရွေးပါ — ဥပမာ `com.mysql.cj.jdbc.Driver`။

4. **Next** ကို နှိပ်ပါ။

File တစ်ခု ရွေးပြီးနောက်မှာ error တစ်ခု တွေ့ရရင် အောက်ပါတို့ကို စစ်ဆေးပါ:

* **Nothing runnable at the configured runtime path** — **Override path** ကို နှိပ်ပါ။ **Browse** ကို နှိပ်ပြီး မှန်ကန်တဲ့ Java runtime path ကို ညွှန်ပြကာ **Verify** ကို နှိပ်ပါ။
* **Couldn't read this JAR** — File က ပျက်စီးနေတာ ဒါမှမဟုတ် invalid JDBC driver တစ်ခု ဖြစ်နိုင်ပါတယ်။ တခြား file တစ်ခုကို ရွေးပါ။

#### အဆင့် 2: Connection URL (Step 2: Connection URL)

URL pattern တစ်ခုကို ရွေးပြီး — Postman က ကိုယ့် database နဲ့ ချိတ်ဆက်ဖို့ သုံးမယ့် JDBC connection string template ကို သတ်မှတ်ပါ။

1. **URL pattern** တစ်ခုကို ရွေးပါ။ Postman က driver ကနေ pattern ကို အလိုအလျောက် ရှာဖွေပြီး ကြိုရွေးပေးပါတယ်။ တစ်ခုမှ ရှာမတွေ့ရင် — **Generic** ကို ရွေးပေးပါတယ်။ ပံ့ပိုးထားတဲ့ patterns နဲ့ သူတို့ရဲ့ URL formats တွေရဲ့ စာရင်း အပြည့်အစုံအတွက် — ပံ့ပိုးထားတဲ့ URL patterns ကို ကြည့်ပါ။

2. **JDBC URL template** ကို ပြန်သုံးသပ်ပါ ဒါမှမဟုတ် update လုပ်ပါ။ ဒါက ကိုယ် ရွေးထားတဲ့ URL pattern ပေါ်မှာ မူတည်ပြီး update ဖြစ်ပါတယ်။ ဥပမာ:

   ```
   jdbc:mysql://{{host}}:{{port}}/{{database}}
   ```

   Template ကို စိတ်ကြိုက် ပြောင်းလဲနိုင်ပါတယ်။ Connection တစ်ခုနဲ့တစ်ခု ကွဲပြားနိုင်တဲ့ တန်ဖိုးတွေအတွက် `{{variable}}` syntax ကို သုံးပါ။ Template field ထဲမှာ suggestions တွေ ကြည့်ဖို့ `{{` ကို ရိုက်ထည့်ပါ၊ ဒါမှမဟုတ် field အောက်က suggestion တစ်ခုကို နှိပ်ပြီး ထည့်ပါ။ Suggestions တွေက JAR ကနေ ရှာဖွေတွေ့ရှိရတဲ့ configuration properties တွေကို အခြေခံပါတယ်။

3. **Next** ကို နှိပ်ပါ။ Postman က ကိုယ့် template ကနေ variables တွေကို ထုတ်ယူပြီး — နောက်အဆင့်မှာ field တစ်ခုစီအနေနဲ့ ပြသပါတယ်။

#### အဆင့် 3: Data source (Step 3: Data source)

Data source ကို နာမည်ပေးပြီး — ကိုယ့် URL template ကနေ connection variable values တွေကို ဖြည့်ကာ dataset ထဲကို ထည့်ပါ။

1. **Source name** field ထဲမှာ ဒီ data source အတွက် နာမည်တစ်ခု ထည့်ပါ။

2. **Connection** အောက်မှာ — ကိုယ့် URL template ထဲမှာ သတ်မှတ်ထားတဲ့ variable တစ်ခုစီအတွက် တန်ဖိုး ထည့်ပါ — host, port နဲ့ database နာမည် စတာတွေ။ တန်ဖိုးအဖြစ် vault secret တစ်ခုကို သုံးချင်ရင် — dropdown ကနေ ရှိပြီးသား secret တစ်ခုကို ရွေးပါ။ တန်ဖိုးတစ်ခု ထည့်ပြီးနောက် — သူ့ကို vault secret တစ်ခုအနေနဲ့ သိမ်းဖို့ ![Add icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-add-stroke.svg#icon) **New secret** ကို နှိပ်ပြီး သိမ်းမယ့် vault type ကို ရွေးပါ။

3. (ချန်လှပ်ထားလို့ ရတယ်) **Connect through an SSH tunnel** ကို ရွေးပြီး အောက်ပါတို့ကို ထည့်ပါ:

   * **SSH host** — SSH server ရဲ့ hostname ဒါမှမဟုတ် IP address။
   * **SSH port** — SSH server အတွက် port နံပါတ်။
   * **SSH username** — SSH server နဲ့ ချိတ်ဆက်ဖို့ username။
   * **SSH private key** — SSH server နဲ့ authenticate လုပ်ဖို့ private key။ **Choose a file** ကို နှိပ်ပြီး file တစ်ခု ရွေးပါ၊ ဒါမှမဟုတ် key ကို တိုက်ရိုက် paste လုပ်ပါ။
   * **SSH host key** — SSH server ရဲ့ host key။ **Choose a file** ကို နှိပ်ပြီး file တစ်ခု ရွေးပါ၊ ဒါမှမဟုတ် key ကို တိုက်ရိုက် paste လုပ်ပါ။
   * (ချန်လှပ်ထားလို့ ရတယ်) **Skip SSH host key verification** ကို ရွေးပါ — SSH server ရဲ့ host key ကို စစ်ဆေးခြင်း ကျော်သွားပါတယ်။ ဒါက connection ကို man-in-the-middle attacks တွေရဲ့ အန္တရာယ်နဲ့ ထိတွေ့စေနိုင်ပါတယ်။ Non-production testing အတွက်သာ သုံးပါ။

4. Connection အသေးစိတ်တွေ မှန်ကန်ပြီး Postman က ချိတ်ဆက်နိုင်လားဆိုတာ စစ်ဆေးဖို့ **Test connection** ကို နှိပ်ပါ။ Connection မအောင်မြင်ရင် — ကိုယ့် connection အသေးစိတ်တွေ မှန်ကန်ပြီး ကိုယ့် network က data source ဆီ connection တွေ ခွင့်ပြုထားလားဆိုတာ စစ်ဆေးပါ။

5. **Add source** ကို နှိပ်ပါ။

Host နဲ့ password လိုမျိုး ထိခိုက်လွယ်တဲ့ data တွေကို [Postman Vault](https://learning.postman.com/docs/use/postman-vault/postman-vault-secrets) ထဲက vault secrets တွေအနေနဲ့ သိမ်းဆည်းပါ။ ထိခိုက်လွယ်တဲ့ data ကို လက်ခံတဲ့ field တစ်ခုရဲ့ ဘေးမှာ ![Unlock icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-unlock-stroke.svg#icon) **Link to vault secret** ကို နှိပ်ပြီး သုံးချင်တဲ့ vault secret တစ်ခုကို ရွေးပါ။ Vault secret တစ်ခုကို update လုပ်ဖို့ — field တစ်ခုရဲ့ ဘေးမှာ ![Vault icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-vault-stroke.svg#icon) **Unlink vault secret** ကို နှိပ်ပြီး vault secret ကို ဖယ်ရှားနိုင်ပါတယ်။

Custom JDBC data sources တွေပေါ်က Views တွေက — SQLite-compatible syntax မဟုတ်ဘဲ ချိတ်ဆက်ထားတဲ့ database ရဲ့ native SQL dialect ကို သုံးပါတယ်။ View တစ်ခုစီက JDBC data source တစ်ခုတည်းကိုသာ ပစ်မှတ်ထားရပြီး — တခြား source types တွေကန့် data တွေကို ပေါင်းစပ်လို့ မရပါဘူး။

#### ပံ့ပိုးထားတဲ့ URL patterns (Supported URL patterns)

JDBC connection တစ်ခုကို configure လုပ်တဲ့အခါ အောက်ပါ URL patterns တွေ ရနိုင်ပါတယ်။ Postman က ဖြစ်နိုင်ရင် driver ကနေ pattern ကို အလိုအလျောက် ရှာဖွေပေးပါတယ်။

* **MySQL** — `jdbc:mysql://{{host}}:{{port}}/{{database}}`
* **Postgres** — `jdbc:postgresql://{{host}}:{{port}}/{{database}}`
* **SQL Server** — `jdbc:sqlserver://{{host}}:{{port}};databaseName={{database}}`
* **Oracle** — `jdbc:oracle:thin:@{{host}}:{{port}}:{{database}}`
* **Generic** — Default template မရှိပါဘူး။ ကိုယ့် database system နဲ့ ကိုက်ညီတဲ့ JDBC URL template တစ်ခု ထည့်ပါ။

#### JDBC ကနေ ပံ့ပိုးထားတဲ့ Databases (Databases supported through JDBC)

Postman က အောက်ပါ databases တွေကို JDBC ကနေ ပံ့ပိုးပါတယ်။ ဒီစာရင်းက အကုန်အစင် မဟုတ်ပါဘူး။ JDBC driver တစ်ခု ပေးတဲ့ database တစ်ခုခုကိုမဆို ချိတ်ဆက်နိုင်ပါတယ်။

* Amazon DynamoDB
* Apache Cassandra
* Apache Derby
* Apache Doris
* Apache Ignite
* Apache IoTDB
* Apache Pinot
* Apache Solr
* ClickHouse
* CockroachDB
* CrateDB
* CUBRID
* DuckDB
* Elasticsearch
* Firebird
* Google Cloud Spanner
* H2
* HSQLDB
* MariaDB
* Materialize
* Microsoft Access
* Microsoft SQL Server
* MonetDB
* MongoDB
* MySQL
* Neo4j
* OpenLink Virtuoso
* OpenSearch
* Oracle Database
* PostgreSQL
* Presto
* QuestDB
* Redis
* SQLite
* StarRocks
* TDengine
* Trino
* YugabyteDB

### AI နဲ့ ထည့်ခြင်း (Add with AI)

Data တွေ ထုတ်လုပ်ပြီး data source အသစ်တစ်ခုအနေနဲ့ ထည့်ဖို့ [Agent Mode](https://learning.postman.com/docs/use/agent-mode/overview) ကို သုံးနိုင်ပါတယ်။ လိုအပ်တဲ့ data အကြောင်း ဖော်ပြပါ — ဥပမာ sample users, order records ဒါမှမဟုတ် API test fixtures တွေ။ Agent Mode က schema ကို သတ်မှတ်ပြီး rows တွေ ထုတ်လုပ်တဲ့ နေရာအထိ လမ်းညွှန်ပေးပါတယ်။

AI နဲ့ data source တစ်ခု ထည့်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ![Magic icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-magic-stroke.svg#icon) **Add with AI** ကို ရွေးပါ။ Agent Mode က ကိုယ့် data ကို သတ်မှတ်ဖို့ ကူညီပေးမယ့် prompt တစ်ခုနဲ့ ဖွင့်လာပါတယ်။
2. ထုတ်လုပ်ချင်တဲ့ data အကြောင်း ဖော်ပြပါ။
3. အဆိုပြုထားတဲ့ schema ကို ပြန်သုံးသပ်ပြီး အတည်ပြုပါ။ Agent Mode က rows တွေ မထုတ်ခင် — field တစ်ခုစီကို ဘယ်လို ထုတ်လုပ်မလဲဆိုတာ တင်ပြပေးပါတယ်။
4. အတည်ပြုပြီးနောက် — Agent Mode က rows တွေ ထုတ်လုပ်ပြီး sample rows အထိ ငါးခုရဲ့ preview ကို ပြသပါတယ်။
5. Sample ကို ပြန်သုံးသပ်ပါ။ Agent Mode က ထုတ်လုပ်ထားတဲ့ data ကို CSV file တစ်ခုအနေနဲ့ သိမ်းပြီး — ကိုယ့် dataset ထဲမှာ data source အသစ်တစ်ခုအနေနဲ့ ထည့်ပေးပါတယ်။
