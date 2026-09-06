---
title: "Template Databases (template database များ)"
description: "CREATE DATABASE သည် ရှိပြီးသား database တစ်ခုကို copy လုပ်ပြီး database အသစ် ဖန်တီးပုံ — template1 နှင့် template0 ၏ အခန်းကဏ္ဍ၊ encoding/locale အသစ် သတ်မှတ်ခြင်း၊ pg_database ၏ datistemplate/datallowconn flags များ"
order: 164
source: "https://www.postgresql.org/docs/current/manage-ag-templatedbs.html"
status: translated
updated: 2026-09-06
---

## 22.3. Template Databases (template database များ)

`CREATE DATABASE` က တကယ်တော့ — ရှိပြီးသား database တစ်ခုကို copy (ကူးယူ) လုပ်ခြင်းအားဖြင့် အလုပ်လုပ်ပါတယ်။ Default အနေနဲ့ — `template1` လို့ နာမည်ပေးထားတဲ့ — standard system database ကို copy လုပ်ပါတယ်။ ဒါကြောင့် အဲဒီ database က — database အသစ်တွေ ဖန်တီးရာမှာ အခြေခံတဲ့ “template” (ပုံစံပြား) ဖြစ်ပါတယ်။ သင်က `template1` ထဲမှာ object တွေ ထပ်ထည့်လိုက်ရင် — အဲဒီ object တွေကို နောက်ပိုင်း ဖန်တီးတဲ့ user database တွေထဲကိုပါ copy လုပ်သွားပါလိမ့်မယ်။ ဒီအပြုအမူက database တွေထဲက standard object အစုထဲကို — site ဒေသအလိုက် ပြုပြင်မွမ်းမံမှုတွေ ထည့်နိုင်စေပါတယ်။ ဥပမာ — PL/Perl ဆိုတဲ့ procedural language (လုပ်ထုံးလုပ်နည်း ဆိုင်ရာ ဘာသာစကား) ကို `template1` ထဲမှာ တပ်ဆင်လိုက်ရင် — အဲဒီ database တွေ ဖန်တီးတဲ့အခါ နောက်ထပ် ဘာ action မှ မလုပ်ရဘဲ — user database တွေမှာ အလိုအလျောက် ရရှိနိုင်ပါလိမ့်မယ်။

ဒါပေမယ့် — `CREATE DATABASE` က source database မှာ ပူးတွဲထားတဲ့ — database-level `GRANT` permissions (database အဆင့် ခွင့်ပြုချက်များ) တွေကိုတော့ copy မလုပ်ပါဘူး။ Database အသစ်မှာ database-level permissions ပုံမှန် (default) အတိုင်းပဲ ရှိပါတယ်။

`template0` လို့ နာမည်ပေးထားတဲ့ — ဒုတိယ standard system database တစ်ခုလည်း ရှိပါတယ်။ ဒီ database မှာ `template1` ရဲ့ ကနဦး ပါဝင်မှုတွေနဲ့ တူညီတဲ့ data — ဆိုလိုတာက — သင့် PostgreSQL version က ကြိုသတ်မှတ်ထားတဲ့ standard object တွေပဲ — ပါဝင်ပါတယ်။ `template0` ကို — database cluster ကို initialize လုပ်ပြီးနောက်ပိုင်း — ဘယ်တော့မှ ပြောင်းလဲလို့ မရပါဘူး။ `CREATE DATABASE` ကို `template1` အစား `template0` ကို copy လုပ်ဖို့ ညွှန်ကြားခြင်းအားဖြင့် — `template1` ထဲက site ဒေသအလိုက် ထပ်ဖြည့်ချက်တွေ ဘာမှ မပါတဲ့ — “pristine” (မူလအတိုင်း စင်ကြယ်သော) user database တစ်ခု (user-defined object တွေ မရှိဘဲ — system object တွေလည်း ပြုပြင်ထားခြင်း မရှိတဲ့ database) ကို ဖန်တီးနိုင်ပါတယ်။ `pg_dump` dump (data backup) တစ်ခုကို restore (ပြန်သွင်း) လုပ်တဲ့အခါ ဒါက အထူး အဆင်ပြေပါတယ်: dump script ကို — dump လုပ်ထားတဲ့ database ရဲ့ မှန်ကန်တဲ့ ပါဝင်မှုတွေကို — `template1` ထဲကို နောက်ပိုင်း ထပ်ထည့်လိုက်နိုင်တဲ့ object တွေနဲ့ မဆန့်ကျင်ဘဲ — ပြန်လည် ဖန်တီးနိုင်ကြောင်း သေချာစေဖို့ — pristine database တစ်ခုထဲမှာ restore လုပ်သင့်ပါတယ်။

`template1` အစား `template0` ကို copy လုပ်လေ့ရှိတဲ့ နောက်ထပ် အကြောင်းရင်း တစ်ခုကတော့ — `template0` ကို copy လုပ်တဲ့အခါ encoding (စာလုံး ကုဒ်ပြောင်းစနစ်) နဲ့ locale (ဒေသသတ်မှတ်ချက်) settings အသစ်တွေကို သတ်မှတ်လို့ ရနိုင်ပေမယ့် — `template1` ရဲ့ copy ကတော့ — သူ့မှာ ရှိတဲ့ settings တွေအတိုင်းပဲ သုံးရလို့ပါ။ အကြောင်းကတော့ — `template1` မှာ encoding-specific ဒါမှမဟုတ် locale-specific data တွေ ပါဝင်နိုင်ပြီး — `template0` မှာတော့ မပါဝင်ဘူးလို့ သိထားလို့ပါ။

`template0` ကို copy လုပ်ပြီး database တစ်ခု ဖန်တီးဖို့ဆိုရင် — အောက်ပါတို့ကို သုံးပါ:

```sql
CREATE DATABASE dbname TEMPLATE template0;
```

အဲဒါက SQL environment ကနေ သုံးတဲ့ ပုံစံ ဖြစ်ပါတယ်။ ဒါမှမဟုတ်:

```sql
createdb -T template0 dbname
```

ဒါကတော့ shell ကနေ သုံးတဲ့ ပုံစံ ဖြစ်ပါတယ်။

Template database အပိုတွေကိုလည်း ဖန်တီးလို့ ရနိုင်ပြီး — တကယ်တော့ — database တစ်ခုရဲ့ နာမည်ကို `CREATE DATABASE` ရဲ့ template အဖြစ် သတ်မှတ်ပေးရုံနဲ့ — cluster ထဲက database ဘယ်ခုကိုမဆို copy လုပ်နိုင်ပါတယ်။ ဒါပေမယ့် — ဒါက (လောလောဆယ်) — အထွေထွေ ရည်ရွယ်ချက်သုံး “COPY DATABASE” facility (ကိရိယာ) တစ်ခုအနေနဲ့ ရည်ရွယ်ထားတာ မဟုတ်ဘူးဆိုတာကို နားလည်ထားဖို့ အရေးကြီးပါတယ်။ အဓိက ကန့်သတ်ချက်ကတော့ — source database ကို copy လုပ်နေတဲ့ အတောအတွင်း — တခြား session ဘယ်တစ်ခုမှ အဲဒီ database ဆီ connect လုပ်ထားလို့ မရပါဘူး။ `CREATE DATABASE` စတင်တဲ့အခါ တခြား connection တစ်ခုခု ရှိနေရင် — ၎င်း မအောင်မြင်ပါဘူး; copy လုပ်ဆောင်နေစဉ်အတွင်း — source database ဆီ connection အသစ်တွေကို တားမြစ်ပါတယ်။

`pg_database` ထဲမှာ database တစ်ခုချင်းစီအတွက် အသုံးဝင်တဲ့ flag နှစ်ခု ရှိပါတယ်: `datistemplate` နဲ့ `datallowconn` ဆိုတဲ့ columns တွေ ဖြစ်ပါတယ်။ `datistemplate` ကို — database တစ်ခုက `CREATE DATABASE` အတွက် template အဖြစ် ရည်ရွယ်ထားကြောင်း ညွှန်ပြဖို့ သတ်မှတ်နိုင်ပါတယ်။ ဒီ flag ကို သတ်မှတ်ထားရင် — `CREATEDB` privileges ရှိတဲ့ user ဘယ်သူမဆို အဲဒီ database ကို clone လုပ်နိုင်ပြီး — မသတ်မှတ်ထားရင်တော့ — superusers တွေနဲ့ database ရဲ့ owner တစ်ယောက်တည်းပဲ clone လုပ်နိုင်ပါတယ်။ `datallowconn` က false ဖြစ်နေရင် — အဲဒီ database ဆီ connection အသစ်တွေ ဘယ်တော့မှ ခွင့်မပြုပါဘူး (ဒါပေမယ့် — flag ကို false လို့ သတ်မှတ်လိုက်ရုံနဲ့ ရှိပြီးသား session တွေကို အဆုံးသတ်လိုက်တာ မဟုတ်ပါဘူး)။ `template0` database ကို — ပြုပြင်မွမ်းမံမှု မဖြစ်အောင် ကာကွယ်ဖို့ — ပုံမှန်အားဖြင့် `datallowconn = false` လို့ မှတ်သားထားပါတယ်။ `template0` ရော `template1` ပါ — `datistemplate = true` လို့ အမြဲ မှတ်သားထားသင့်ပါတယ်။

> **မှတ်ချက်:** `template1` နဲ့ `template0` တို့မှာ — `template1` ဆိုတဲ့ နာမည်က `CREATE DATABASE` အတွက် default source database နာမည် ဖြစ်တယ်ဆိုတဲ့ အချက်ကလွဲလို့ — အထူး အဆင့်အတန်း (special status) ဘာမှ မရှိပါဘူး။ ဥပမာ — `template1` ကို drop လုပ်ပြီး `template0` ကနေ ပြန်လည် ဖန်တီးလိုက်ရင်လည်း — ဆိုးကျိုး ဘာမှ မရှိပါဘူး။ `template1` ထဲမှာ ဂရုမစိုက်ဘဲ အမှိုက်တွေ အများကြီး ထည့်မိထားရင် — ဒီလို လုပ်ဆောင်ချက်မျိုးက အကြံပြုလောက်စရာ ဖြစ်နိုင်ပါတယ်။ (`template1` ကို ဖျက်ဖို့ဆိုရင် — ၎င်းမှာ `pg_database.datistemplate = false` ဖြစ်နေဖို့ လိုပါတယ်။)
>
> `postgres` database ကိုလည်း — database cluster တစ်ခုကို initialize လုပ်တဲ့အခါ ဖန်တီးပါတယ်။ ဒီ database က users နဲ့ applications တွေ connect လုပ်ဖို့အတွက် default database တစ်ခု ဖြစ်ဖို့ ရည်ရွယ်ထားပါတယ်။ ၎င်းက `template1` ရဲ့ copy သက်သက် ဖြစ်ပြီး — လိုအပ်ရင် drop လုပ်ပြီး ပြန်လည် ဖန်တီးလို့ ရပါတယ်။
