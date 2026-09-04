---
title: "Default Values (ပုံမှန်တန်ဖိုးများ)"
description: "Column တွေအတွက် default value သတ်မှတ်နည်း — null default, default value expression (CURRENT_TIMESTAMP, nextval) နဲ့ SERIAL shorthand အကြောင်း"
order: 23
source: "https://www.postgresql.org/docs/current/ddl-default.html"
status: translated
updated: 2026-09-03
---

## 5.2. Default Values (ပုံမှန်တန်ဖိုးများ)

Column တစ်ခုကို default value (ပုံမှန် တန်ဖိုး) သတ်မှတ်ပေးထားနိုင်ပါတယ်။ Row အသစ် တစ်ခု ဖန်တီးတဲ့အခါ column တချို့အတွက် တန်ဖိုး သတ်မှတ်မပေးထားရင် — အဲဒီ column တွေကို သူတို့နဲ့ သက်ဆိုင်တဲ့ default value တွေနဲ့ ဖြည့်ပေးပါတယ်။ Data manipulation command တစ်ခုကလည်း — အဲဒီ တန်ဖိုးက ဘာလဲဆိုတာ သိစရာ မလိုဘဲ — column တစ်ခုကို သူ့ရဲ့ default value နဲ့ သတ်မှတ်ပေးဖို့ အတိအကျ တောင်းဆိုနိုင်ပါတယ်။ (Data manipulation command တွေရဲ့ အသေးစိတ်ကို [အခန်း 6](https://www.postgresql.org/docs/current/dml.html) မှာ ကြည့်ပါ။)

Default value တစ်ခုကို အတိအကျ ကြေညာမထားရင် — default value က null value ပဲ ဖြစ်ပါတယ်။ ဒါက များသောအားဖြင့် အဓိပ္ပာယ် ရှိပါတယ် — null value ကို မသိရသေးတဲ့ (unknown) ဒေတာကို ကိုယ်စားပြုတယ်လို့ ယူဆလို့ရလို့ပါ။

Table definition တစ်ခုထဲမှာ default value တွေကို column ရဲ့ data type နောက်မှာ ရေးပါတယ်။ ဥပမာ:

```sql
CREATE TABLE products (
    product_no integer,
    name text,
    price numeric DEFAULT 9.99
);
```

Default value က expression တစ်ခုလည်း ဖြစ်နိုင်ပြီး — default value ကို insert လုပ်တဲ့အခါတိုင်း (table ဖန်တီးတုန်းက မဟုတ်ဘဲ) အဲဒီ expression ကို evaluate (တန်ဖိုး တွက်ချက်) လုပ်ပါတယ်။ သာမန် ဥပမာ တစ်ခုက — `timestamp` column တစ်ခုရဲ့ default ကို `CURRENT_TIMESTAMP` ထားတာပါ — row ကို insert လုပ်လိုက်တဲ့ အချိန်ကို အလိုအလျောက် ရရှိစေပါတယ်။ နောက်ထပ် ဥပမာ တစ်ခုကတော့ row တစ်ခုချင်းစီအတွက် "serial number" (စဉ်ဆက် နံပါတ်) ထုတ်ပေးတာပါ။ PostgreSQL မှာ ဒါကို ပုံမှန်အားဖြင့် ဒီလိုမျိုး လုပ်ပါတယ်:

```sql
CREATE TABLE products (
    product_no integer DEFAULT nextval('products_product_no_seq'),
    ...
);
```

ဒီမှာ `nextval()` function က *sequence object* (နောက်ဆက်တွဲ တန်ဖိုးများကို ထောက်ပံ့ပေးသော object) ကနေ ဆက်တိုက် တန်ဖိုးတွေ ထုတ်ပေးပါတယ် ([အပိုင်း 9.17](/docs/postgresql/functions-sequence) ကို ကြည့်ပါ)။ ဒီစနစ်က အတော်လေး အသုံးများလို့ — သူ့အတွက် သီးခြား အတိုကောက် (shorthand) တစ်ခု ရှိပါတယ်:

```sql
CREATE TABLE products (
    product_no SERIAL,
    ...
);
```

`SERIAL` အတိုကောက်နဲ့ ပတ်သက်တာကို [အပိုင်း 8.1.4](https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-SERIAL) မှာ ထပ်ပြီး ဆွေးနွေးထားပါတယ်။
