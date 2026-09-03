---
title: "System Columns (system မှ သတ်မှတ်ပေးသော column များ)"
description: "Table တိုင်းမှာ ပါဝင်တဲ့ system columns (tableoid, xmin, cmin, xmax, cmax, ctid) တွေရဲ့ အဓိပ္ပာယ်နဲ့ အသုံးဝင်ပုံ — user column name အဖြစ် မသုံးနိုင်ခြင်း၊ transaction/command identifier များ"
order: 27
source: "https://www.postgresql.org/docs/current/ddl-system-columns.html"
status: translated
updated: 2026-09-03
---

## 5.6. System Columns (system မှ သတ်မှတ်ပေးသော column များ)

Table တိုင်းမှာ system က သွယ်ဝိုက် (implicitly) သတ်မှတ်ပေးထားတဲ့ *system columns* အများအပြား ပါဝင်ပါတယ်။ ဒါကြောင့် ဒီနာမည်တွေကို user-defined column တွေရဲ့ နာမည်အဖြစ် သုံးလို့ မရပါဘူး။ (ဒီကန့်သတ်ချက်တွေက နာမည်က key word ဟုတ်မဟုတ်ဆိုတာနဲ့ သီးခြား ဖြစ်တယ်ဆိုတာ သတိပြုပါ — နာမည်ကို quote လုပ်လိုက်ရုံနဲ့ ဒီကန့်သတ်ချက်တွေကနေ ရှောင်လွှဲလို့ မရပါဘူး။) ဒီ column တွေအတွက် သင်တကယ် စိတ်ပူနေစရာ မလိုပါဘူး — သူတို့ ရှိနေတယ်ဆိုတာကိုပဲ သိထားရင် ရပါတယ်။

- **`tableoid`** — ဒီ row ပါဝင်တဲ့ table ရဲ့ OID ဖြစ်ပါတယ်။ ဒီ column က partitioned table တွေကနေ
  select လုပ်တဲ့ query တွေ (အပိုင်း 5.12 ကို ကြည့်ပါ) ဒါမှမဟုတ် inheritance hierarchy တွေကနေ
  select လုပ်တဲ့ query တွေ (အပိုင်း 5.11 ကို ကြည့်ပါ) မှာ အထူး အသုံးဝင်ပါတယ် — ဘာကြောင့်လဲဆိုတော့
  ဒီ column မရှိရင် row တစ်ခုက ဘယ် table တစ်ခုချင်းစီကနေ လာတယ်ဆိုတာ ပြောရခက်လို့ပါ။ `tableoid` ကို
  `pg_class` ရဲ့ `oid` column နဲ့ join လုပ်ပြီး table ရဲ့ နာမည်ကို ရယူနိုင်ပါတယ်။
- **`xmin`** — ဒီ row version အတွက် ထည့်သွင်းခဲ့တဲ့ (inserting) transaction ရဲ့ identity
  (transaction ID) ဖြစ်ပါတယ်။ (Row version ဆိုတာ row တစ်ခုရဲ့ state တစ်ခုချင်းစီ ဖြစ်ပြီး — row တစ်ခုကို
  update လုပ်တိုင်း logical row တစ်ခုတည်းအတွက် row version အသစ် တစ်ခု ဖန်တီးပါတယ်။)
- **`cmin`** — ထည့်သွင်းတဲ့ transaction အတွင်းက command identifier (zero ကနေ စတင်သည်) ဖြစ်ပါတယ်။
- **`xmax`** — ဖျက်လိုက်တဲ့ (deleting) transaction ရဲ့ identity (transaction ID) ဖြစ်ပြီး —
  မဖျက်ရသေးတဲ့ row version အတွက်တော့ zero ဖြစ်ပါတယ်။ Visible row version တစ်ခုမှာ ဒီ column က
  zero မဟုတ်ဘဲ ရှိနေတာလည်း ဖြစ်နိုင်ပါတယ်။ အဲဒါက များသောအားဖြင့် — ဖျက်တဲ့ transaction က commit
  မဖြစ်သေးဘူး ဒါမှမဟုတ် ဖျက်ဖို့ ကြိုးစားမှုကို roll back လုပ်လိုက်ပြီ ဆိုတာကို ညွှန်ပြပါတယ်။
- **`cmax`** — ဖျက်တဲ့ transaction အတွင်းက command identifier (သို့မဟုတ် zero) ဖြစ်ပါတယ်။
- **`ctid`** — row version က သူ့ရဲ့ table ထဲမှာ တည်ရှိတဲ့ physical location ဖြစ်ပါတယ်။ `ctid` ကို
  သုံးပြီး row version ကို အလွန် မြန်မြန် ရှာတွေ့နိုင်ပေမယ့် — row တစ်ခုကို update လုပ်တဲ့အခါ ဒါမှမဟုတ်
  `VACUUM FULL` က ရွှေ့လိုက်တဲ့အခါ — row ရဲ့ `ctid` က ပြောင်းသွားမယ်ဆိုတာ သတိပြုပါ။ ဒါကြောင့် `ctid`
  ကို row identifier အဖြစ် မသုံးသင့်ပါဘူး — logical row တွေကို ခွဲခြားသိဖို့ primary key ကို
  သုံးသင့်ပါတယ်။

Transaction identifier တွေကလည်း 32-bit ပမာဏတွေ ဖြစ်ပါတယ်။ သက်တမ်း ကြာရှည်တဲ့ database တစ်ခုမှာ
transaction ID တွေ wrap around ဖြစ်တတ်ပါတယ်။ သင့်လျော်တဲ့ maintenance လုပ်ထုံးလုပ်နည်းတွေ ရှိမယ်ဆိုရင်
ဒါက ကြီးလေးတဲ့ ပြဿနာ (fatal problem) မဟုတ်ပါဘူး — အသေးစိတ်ကို
[အခန်း 24](https://www.postgresql.org/docs/current/maintenance.html) မှာ ကြည့်ပါ။ ဒါပေမဲ့ —
ရေရှည်မှာ (transaction ပေါင်း တစ်ဘီလီယံကျော်) transaction ID တွေရဲ့ ထူးခြားမှု (uniqueness) ကို
အားကိုးတာကတော့ မလိမ္မာပါဘူး။

Command identifier တွေကလည်း 32-bit ပမာဏတွေ ဖြစ်ပါတယ်။ ဒါက transaction တစ်ခုတည်းအတွင်းမှာ SQL command
ပေါင်း 2^32 (4 billion) အထိ ဆိုတဲ့ တင်းကျပ်တဲ့ ကန့်သတ်ချက် (hard limit) တစ်ခုကို ဖန်တီးပါတယ်။
လက်တွေ့မှာတော့ ဒီကန့်သတ်ချက်က ပြဿနာ မဟုတ်ပါဘူး — ဒီကန့်သတ်ချက်က SQL command တွေရဲ့ အရေအတွက်ကို
ဆိုလိုတာ ဖြစ်ပြီး process လုပ်လိုက်တဲ့ row တွေရဲ့ အရေအတွက်ကို ဆိုလိုတာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ။
ဒါ့အပြင် — database ရဲ့ contents တွေကို တကယ် ပြုပြင်မွမ်းမံတဲ့ command တွေကပဲ command identifier
တစ်ခုကို သုံးစွဲမှာ ဖြစ်ပါတယ်။
