---
title: "Updating Data (ဒေတာ ပြင်ဆင်ခြင်း)"
description: "UPDATE command နဲ့ ရှိပြီးသား row တွေ ပြင်ဆင်နည်း — WHERE နဲ့ row ရွေးချယ်ခြင်း, SET clause ထဲက expression, column အများကြီး တစ်ပြိုင်နက် update လုပ်ခြင်း"
order: 35
source: "https://www.postgresql.org/docs/current/dml-update.html"
status: translated
updated: 2026-09-03
---

## 6.2. Updating Data (ဒေတာ ပြင်ဆင်ခြင်း)

Database ထဲမှာ ရှိပြီးသား data တွေကို ပြင်ဆင်တာကို updating (data ပြင်ဆင်ခြင်း) လို့ ခေါ်ပါတယ်။ Row တစ်ခုချင်းစီကိုလည်း ဖြစ်စေ၊ table တစ်ခုလုံးရဲ့ row အားလုံးကိုလည်း ဖြစ်စေ၊ row တွေရဲ့ အစိတ်အပိုင်း တစ်ချို့ကိုလည်း ဖြစ်စေ update လုပ်လို့ရပါတယ်။ Column တစ်ခုချင်းစီကို သပ်သပ်စီ update လုပ်လို့ရပြီး — ကျန်တဲ့ column တွေကို ထိခိုက်မှု မရှိပါဘူး။

ရှိပြီးသား row တွေကို update လုပ်ဖို့ [UPDATE](https://www.postgresql.org/docs/current/sql-update.html) command ကို သုံးပါတယ်။ ဒီအတွက် အချက်အလက် သုံးမျိုး လိုအပ်ပါတယ်:

1. Update လုပ်မယ့် table နဲ့ column ရဲ့ နာမည်
2. Column ရဲ့ တန်ဖိုး အသစ်
3. ဘယ် row (row တွေ) ကို update လုပ်မလဲ

[အခန်း 5](https://www.postgresql.org/docs/current/ddl.html) မှာ ပြောခဲ့သလို — SQL က ယေဘုယျအားဖြင့် row တွေအတွက် သီးခြား unique identifier (ထူးခြားတဲ့ သတ်မှတ်ချက်) တစ်ခု မပေးပါဘူး။ ဒါကြောင့် ဘယ် row ကို update လုပ်မယ်ဆိုတာ တိုက်ရိုက် သတ်မှတ်ဖို့ အမြဲတမ်း မဖြစ်နိုင်ပါဘူး။ အဲဒီအစား — row တစ်ခုကို update လုပ်ဖို့ ဘယ်လို အခြေအနေ (condition) တွေ ပြည့်မှီရမယ်ဆိုတာကို သင်က သတ်မှတ်ပေးရပါတယ်။ Table ထဲမှာ primary key ရှိမှသာ (ကိုယ်တိုင် ကြေညာထားသည်ဖြစ်စေ၊ မကြေညာထားသည်ဖြစ်စေ) — primary key နဲ့ ကိုက်ညီတဲ့ condition ကို ရွေးချယ်ပြီး row တစ်ခုချင်းစီကို စိတ်ချရစွာ ညွှန်းနိုင်ပါတယ်။ Graphical database access tool တွေက row တွေကို တစ်ခုချင်းစီ update လုပ်ခွင့်ပေးဖို့ ဒီအချက်ကို မှီခိုထားပါတယ်။

ဥပမာ — အောက်က command က price 5 ရှိတဲ့ product တွေ အားလုံးကို price 10 အဖြစ် update လုပ်ပါတယ်:

```sql
UPDATE products SET price = 10 WHERE price = 5;
```

ဒါက row သုည၊ row တစ်ခု ဒါမှမဟုတ် row အများကြီးကို update ဖြစ်စေနိုင်ပါတယ်။ ဘယ် row နဲ့မှ မကိုက်ညီတဲ့ update ကို ကြိုးစားတာက error မဟုတ်ပါဘူး။

အဲဒီ command ကို အသေးစိတ် ကြည့်ရအောင်။ ပထမဆုံးက key word `UPDATE` ဖြစ်ပြီး — နောက်မှာ table name လိုက်ပါတယ်။ ပုံမှန်အတိုင်းပဲ table name ကို schema-qualified (schema name နဲ့ ရှေ့ဆွဲ) လုပ်လို့ရပြီး — မလုပ်ထားရင် path ထဲမှာ ရှာဖွေပါတယ်။ နောက်တစ်ခုက key word `SET` ဖြစ်ပြီး — နောက်မှာ column name၊ equal sign နဲ့ column တန်ဖိုး အသစ် လိုက်ပါတယ်။ Column တန်ဖိုး အသစ်က constant တစ်ခုပဲ မဟုတ်ဘဲ — ဘယ် scalar expression မဆို ဖြစ်နိုင်ပါတယ်။ ဥပမာ — product အားလုံးရဲ့ price ကို 10% မြှင့်ချင်ရင် ဒီလို သုံးနိုင်ပါတယ်:

```sql
UPDATE products SET price = price * 1.10;
```

မြင်တဲ့အတိုင်းပဲ — တန်ဖိုး အသစ်အတွက် expression က row ထဲက ရှိပြီးသား တန်ဖိုး (တွေ) ကို ရည်ညွှန်းလို့ရပါတယ်။ ဒီဥပမာမှာ `WHERE` clause ကိုလည်း ချန်ထားလိုက်ပါတယ်။ ဒါကို ချန်လိုက်ရင် — table ထဲက row တွေ အားလုံးကို update လုပ်တယ်လို့ ဆိုလိုပါတယ်။ ပါရင်တော့ — `WHERE` condition နဲ့ ကိုက်ညီတဲ့ row တွေကိုပဲ update လုပ်ပါတယ်။ `SET` clause ထဲက equal sign က assignment (တန်ဖိုး သတ်မှတ်ခြင်း) ဖြစ်ပြီး — `WHERE` clause ထဲက equal sign ကတော့ comparison (နှိုင်းယှဉ်ခြင်း) ဖြစ်ပါတယ် — ဒါပေမယ့် ဒါက ဘာ ambiguity (မရှင်းလင်းမှု) မှ မဖြစ်စေပါဘူး။ ဒါပေါ့ — `WHERE` condition က equality test ဖြစ်ဖို့တော့ မလိုပါဘူး။ Operator တွေ အများကြီး ရှိပါသေးတယ် ([အခန်း 9](https://www.postgresql.org/docs/current/functions.html) မှာ ကြည့်ပါ)။ ဒါပေမယ့် expression က Boolean result (မှန်/မမှန် ရလဒ်) အဖြစ် တွက်ထုတ်နိုင်ဖို့တော့ လိုပါတယ်။

`SET` clause ထဲမှာ assignment တွေ တစ်ခုထက်ပိုပြီး စာရင်းထည့်ခြင်းအားဖြင့် — `UPDATE` command တစ်ခုထဲမှာ column တစ်ခုထက်ပိုပြီး update လုပ်လို့ရပါတယ်။ ဥပမာ:

```sql
UPDATE mytable SET a = 5, b = 3, c = 1 WHERE a > 0;
```
