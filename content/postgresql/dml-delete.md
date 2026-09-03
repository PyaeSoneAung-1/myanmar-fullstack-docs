---
title: "Deleting Data (ဒေတာ ဖျက်ခြင်း)"
description: "DELETE command နဲ့ မလိုတော့တဲ့ row တွေ ဖယ်ရှားနည်း — condition နဲ့ row ရွေးဖျက်ခြင်း, table ထဲက row အားလုံး ဖျက်ခြင်း"
order: 36
source: "https://www.postgresql.org/docs/current/dml-delete.html"
status: translated
updated: 2026-09-03
---

## 6.3. Deleting Data (ဒေတာ ဖျက်ခြင်း)

အခုထိ table တွေထဲ data တွေ ဘယ်လို ထည့်မလဲ၊ data တွေကို ဘယ်လို ပြင်မလဲဆိုတာ ရှင်းပြခဲ့ပါပြီ။ ကျန်နေတဲ့အကြောင်းက — မလိုတော့တဲ့ data တွေကို ဘယ်လို ဖယ်ရှားမလဲဆိုတာပါ။ Data ထည့်တာက row တစ်ခုလုံး အနေနဲ့ပဲ ဖြစ်နိုင်သလို — row တွေကို ဖယ်ရှားတာကလည်း row တစ်ခုလုံး အနေနဲ့ပဲ ဖြစ်နိုင်ပါတယ်။ အရင် section မှာ SQL က row တစ်ခုချင်းစီကို တိုက်ရိုက် ညွှန်းဖို့ နည်းလမ်း မပေးဘူးဆိုတာ ရှင်းပြခဲ့ပါတယ်။ ဒါကြောင့် row တွေကို ဖယ်ရှားတာက — ဖယ်ရှားရမယ့် row တွေ ကိုက်ညီရမယ့် condition တွေကို သတ်မှတ်ခြင်းအားဖြင့်ပဲ လုပ်နိုင်ပါတယ်။ Table ထဲမှာ primary key ရှိရင် — တိကျတဲ့ row ကို သတ်မှတ်လို့ရပါတယ်။ ဒါပေမယ့် condition တစ်ခုနဲ့ ကိုက်ညီတဲ့ row အစုအဝေး တွေကိုလည်း ဖယ်လို့ရသလို — table ထဲက row တွေ အားလုံးကိုလည်း တစ်ပြိုင်နက် ဖယ်လို့ရပါတယ်။

Row တွေကို ဖယ်ရှားဖို့ [DELETE](https://www.postgresql.org/docs/current/sql-delete.html) command ကို သုံးပါတယ် — syntax က [UPDATE](https://www.postgresql.org/docs/current/sql-update.html) command နဲ့ အရမ်း ဆင်ပါတယ်။ ဥပမာ — products table ထဲက price 10 ရှိတဲ့ row တွေ အားလုံးကို ဖယ်ရှားချင်ရင် ဒီလို သုံးပါ:

```sql
DELETE FROM products WHERE price = 10;
```

ဒီလို ရိုးရိုးလေး ရေးလိုက်ရင်:

```sql
DELETE FROM products;
```

table ထဲက row တွေ အားလုံး ဖျက်ခံရမှာပါ! Caveat programmer (programmer ကိုယ်တိုင် သတိထားရန်)။
