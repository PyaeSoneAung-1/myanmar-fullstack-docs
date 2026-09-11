---
title: "Security (လုံခြုံရေး)"
description: "Logical replication ၏ လုံခြုံရေး စည်းမျဉ်းများ — replication connection role ၏ REPLICATION attribute၊ row security policy နှင့် row_security ချိန်ညှိမှု၊ output plugin library များ၊ publication/subscription ဖန်တီးရန် privilege များ၊ subscription owner နှင့် run_as_owner ဆိုင်ရာ အန္တရာယ်များ၊ privilege ပြန်လည် စစ်ဆေးခြင်း အကြောင်း"
order: 237
source: "https://www.postgresql.org/docs/current/logical-replication-security.html"
status: translated
updated: 2026-09-11
---

## 29.11. Security (လုံခြုံရေး)

Replication connection အတွက် သုံးတဲ့ role မှာ `REPLICATION` attribute ရှိရပါမယ် (ဒါမှမဟုတ် superuser ဖြစ်ရပါမယ်)။ Role မှာ `SUPERUSER` နဲ့ `BYPASSRLS` မရှိရင် — publisher ရဲ့ row security policy တွေ execute ဖြစ်နိုင်ပါတယ်။ Role က table owner အားလုံးကို မယုံကြည်ဘူးဆိုရင် — connection string မှာ `options=-crow_security=off` ကို ထည့်ပါ။ ပြီးရင် table owner တစ်ဦးက row security policy တစ်ခု ထည့်လိုက်ရင် — အဲဒီ setting က policy ကို execute လုပ်မယ့်အစား replication ကို ရပ်တန့်စေပါလိမ့်မယ်။ Role အတွက် access ကို `pg_hba.conf` မှာ configure လုပ်ရပြီး `LOGIN` attribute ရှိရပါမယ်။

Replication connection က သုံးတဲ့ output plugin ရဲ့ နာမည်ကို server ရဲ့ [`output_plugin_libraries`](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-OUTPUT-PLUGIN-LIBRARIES) မှာ ထည့်ထားရပါမယ်။ (Subscription တွေအတွက်တော့ သုံးတဲ့ plugin name က `pgoutput` ဖြစ်ပါတယ်။) Superuser တွေက — connection တစ်ခုချင်းစီအတွက် trusted list ကို — connection string မှာ `options=-coutput_plugin_libraries=...` ထည့်ခြင်းဖြင့် ပြင်ဆင်နိုင်ပါတယ်။

အစပိုင်း table data ကို copy လုပ်နိုင်ဖို့အတွက် — replication connection အတွက် သုံးတဲ့ role မှာ published table တစ်ခုပေါ်မှာ `SELECT` privilege ရှိရပါမယ် (ဒါမှမဟုတ် superuser ဖြစ်ရပါမယ်)။

Publication တစ်ခု ဖန်တီးဖို့ — user မှာ database ထဲမှာ `CREATE` privilege ရှိရပါမယ်။

Publication တစ်ခုဆီ table တွေ ထည့်ဖို့ — user မှာ table ပေါ်မှာ ownership အခွင့်အရေး ရှိရပါမယ်။ Schema ထဲက table အားလုံးကို publication တစ်ခုဆီ ထည့်ဖို့ — user က superuser ဖြစ်ရပါမယ်။ Table အားလုံး ဒါမှမဟုတ် schema ထဲက table အားလုံးကို အလိုအလျောက် publish လုပ်တဲ့ publication တစ်ခု ဖန်တီးဖို့ — user က superuser ဖြစ်ရပါမယ်။

လက်ရှိအချိန်မှာတော့ publication တွေပေါ်မှာ privilege တွေ မရှိပါဘူး။ (Connect လုပ်နိုင်တဲ့) subscription မည်သည့်အရာမဆို — publication မည်သည့်အရာကိုမဆို access လုပ်နိုင်ပါတယ်။ ဒါကြောင့် — row filter ဒါမှမဟုတ် column list သုံးခြင်းဖြင့် ဖြစ်စေ၊ table တစ်ခုလုံးကို publication မှာ မထည့်ခြင်းဖြင့် ဖြစ်စေ — subscriber တစ်ချို့ဆီကနေ information တချို့ကို ဖုံးကွယ်ဖို့ ရည်ရွယ်ထားတယ်ဆိုရင် — တူညီတဲ့ database ထဲက အခြား publication တွေက အဲဒီ information တွေကို ဖော်ထုတ်နိုင်တယ်ဆိုတာ သတိပြုပါ။ ပိုမို သေးငယ်တဲ့ (finer-grained) access control ကို ခွင့်ပြုနိုင်ဖို့ — publication privilege တွေကို PostgreSQL မှာ အနာဂတ်တွင် ထည့်သွင်းနိုင်ပါတယ်။

Subscription တစ်ခု ဖန်တီးဖို့ — user မှာ `pg_create_subscription` role ရဲ့ privilege တွေအပြင် — database ပေါ်မှာ `CREATE` privilege တွေလည်း ရှိရပါမယ်။

Subscription apply process က session အဆင့်မှာ subscription owner ရဲ့ privilege တွေနဲ့ run ပါတယ်။ ဒါပေမယ့် — table တစ်ခုခုပေါ်မှာ insert, update, delete ဒါမှမဟုတ် truncate operation လုပ်တဲ့အခါ — table owner ဆီ role ပြောင်းပြီး table owner ရဲ့ privilege တွေနဲ့ operation ကို လုပ်ဆောင်ပါတယ်။ ဆိုလိုတာက — subscription owner က replicated table တစ်ခုကို ပိုင်ဆိုင်တဲ့ role တစ်ခုချင်းစီဆီ `SET ROLE` လုပ်နိုင်ရပါမယ်။

Subscription ကို `run_as_owner = true` နဲ့ configure လုပ်ထားတယ်ဆိုရင် — user switching ဖြစ်မှာ မဟုတ်ပါဘူး။ အဲဒီအစား — operation အားလုံးကို subscription owner ရဲ့ permission တွေနဲ့ လုပ်ဆောင်ပါလိမ့်မယ်။ ဒီအခြေအနေမှာ — subscription owner မှာ target table ကနေ `SELECT`, `INSERT`, `UPDATE` နဲ့ `DELETE` လုပ်ဖို့ privilege တွေသာ လိုအပ်ပြီး — table owner ဆီ `SET ROLE` လုပ်ဖို့ privilege မလိုပါဘူး။ ဒါပေမယ့် — ဒါက — replication ဖြစ်ပွားနေတဲ့ table တစ်ခုကို ပိုင်ဆိုင်တဲ့ user မည်သူမဆို — subscription owner ရဲ့ privilege တွေနဲ့ မည်သည့် code ကိုမဆို execute လုပ်နိုင်တယ်ဆိုတာကိုလည်း ဆိုလိုပါတယ်။ ဥပမာ — သူတို့ ပိုင်ဆိုင်တဲ့ table တစ်ခုခုမှာ trigger တစ်ခုကို attach လုပ်လိုက်ရုံနဲ့ ဒါကို လုပ်နိုင်ပါတယ်။ Role တစ်ခုက အခြား role တစ်ခုရဲ့ privilege တွေကို လွတ်လပ်စွာ ရယူနိုင်တာကို ခွင့်ပြုတာက များသောအားဖြင့် မလိုလားအပ်တာကြောင့် — database အတွင်းက user security က အရေးမကြီးဘူးဆိုရင်မှလွဲရင် — ဒီ option ကို ရှောင်ကြဉ်သင့်ပါတယ်။

Publisher ပေါ်မှာ — privilege တွေကို replication connection စတင်ချိန်မှာ တစ်ကြိမ်သာ စစ်ဆေးပြီး — change record တစ်ခုချင်းစီကို ဖတ်တဲ့အခါ ပြန်လည် စစ်ဆေးတာ မရှိပါဘူး။

Subscriber ပေါ်မှာ — subscription owner ရဲ့ privilege တွေကို — transaction တစ်ခုချင်းစီကို apply လုပ်တဲ့အခါ ပြန်လည် စစ်ဆေးပါတယ်။ Subscription ရဲ့ ownership ကို concurrent transaction တစ်ခုက ပြောင်းလဲလိုက်ချိန်မှာ worker တစ်ခုက transaction တစ်ခုကို apply လုပ်နေဆဲ ဖြစ်ရင် — လက်ရှိ transaction ရဲ့ application က owner အဟောင်းရဲ့ privilege တွေနဲ့ ဆက်လက် ဖြစ်ပွားပါလိမ့်မယ်။
