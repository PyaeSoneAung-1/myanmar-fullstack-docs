---
title: "Dependency Tracking (မှီခိုမှု ခြေရာခံခြင်း)"
description: "Object တွေကြားက dependency တွေကို ခြေရာခံခြင်း — DROP ... CASCADE/RESTRICT အပြုအမူ၊ dependent object တွေရှိနေချိန် drop ကြိုးစားရင် ရတဲ့ error message နဲ့ SQL function body ရဲ့ dependency စည်းမျဉ်းများ"
order: 36
source: "https://www.postgresql.org/docs/current/ddl-depend.html"
status: translated
updated: 2026-09-03
---

## 5.15. Dependency Tracking (မှီခိုမှု ခြေရာခံခြင်း)

Foreign key constraints, views, triggers, functions စတာတွေ ပါဝင်တဲ့ table များစွာ ပါတဲ့ ရှုပ်ထွေးတဲ့ database တည်ဆောက်ပုံတွေကို ဖန်တီးတဲ့အခါ — object တွေကြားမှာ dependency (မှီခိုမှု) ကွန်ရက် တစ်ခုကို သွယ်ဝိုက် (implicitly) ဖန်တီးမိပါတယ်။ ဥပမာ — foreign key constraint ပါတဲ့ table တစ်ခုက သူ refer (ရည်ညွှန်း) လုပ်တဲ့ table ပေါ်မှာ မှီခိုနေပါတယ်။

Database တည်ဆောက်ပုံ တစ်ခုလုံးရဲ့ ခိုင်မာမှု (integrity) ကို သေချာစေဖို့ — PostgreSQL က တခြား object တွေ မှီခိုနေတုန်း object တစ်ခုကို drop လုပ်လို့ မရအောင် သေချာစေပါတယ်။ ဥပမာ — [အပိုင်း 5.5.5](/docs/postgresql/ddl-constraints) မှာ ကြည့်ခဲ့တဲ့ products table ကို — orders table က သူ့ပေါ်မှာ မှီခိုနေတဲ့ အခြေအနေမျိုးမှာ — drop လုပ်ဖို့ ကြိုးစားရင် ဒီလို error message မျိုး ရပါလိမ့်မယ်:

```sql
DROP TABLE products;

ERROR:  cannot drop table products because other objects depend on it
DETAIL:  constraint orders_product_no_fkey on table orders depends on table products
HINT:  Use DROP ... CASCADE to drop the dependent objects too.
```

Error message ထဲမှာ အသုံးဝင်တဲ့ hint (အရိပ်အမြွက်) တစ်ခု ပါဝင်ပါတယ်: မှီခိုနေတဲ့ object တွေ အားလုံးကို တစ်ခုချင်းစီ ဖျက်ဖို့ မငြီးငွေ့ချင်ဘူးဆိုရင် — ဒီလို run လုပ်နိုင်ပါတယ်:

```sql
DROP TABLE products CASCADE;
```

ဒါဆိုရင် — မှီခိုနေတဲ့ object တွေ အားလုံး ဖယ်ရှားခံရမှာ ဖြစ်ပြီး — သူတို့အပေါ်မှာ ထပ်မှီခိုနေတဲ့ object တွေကိုပါ recursively (အဆင့်ဆင့်) ဖယ်ရှားသွားမှာ ဖြစ်ပါတယ်။ ဒီအခြေအနေမှာတော့ — orders table ကို မဖယ်ရှားဘဲ — foreign key constraint ကိုပဲ ဖယ်ရှားလိုက်တာ ဖြစ်ပါတယ်။ Foreign key constraint ပေါ်မှာ ဘာမှ မမှီခိုတော့လို့ အဲဒီမှာပဲ ရပ်သွားတာပါ။ (`DROP ... CASCADE` က ဘာတွေ လုပ်မယ်ဆိုတာ စစ်ဆေးကြည့်ချင်ရင် — `CASCADE` မပါဘဲ `DROP` ကို run ပြီး `DETAIL` output ကို ဖတ်ကြည့်ပါ။)

PostgreSQL မှာ `DROP` command တွေ အားလုံးနီးပါးက `CASCADE` သတ်မှတ်ခြင်းကို ထောက်ပံ့ပါတယ်။ တကယ်တော့ — ဖြစ်နိုင်ခြေရှိတဲ့ dependency တွေရဲ့ သဘောသဘာဝက object ရဲ့ အမျိုးအစားပေါ် မူတည်ပြီး ကွဲပြားပါတယ်။ `CASCADE` အစား `RESTRICT` လို့လည်း ရေးလို့ရပါတယ် — ဒါက တခြား object တွေ မှီခိုနေတဲ့ object တွေကို drop လုပ်ခြင်းကနေ တားဆီးပေးတဲ့ ပုံမှန် (default) အပြုအမူကို ရစေပါတယ်။

> **မှတ်ချက်:** SQL standard အရ — `DROP` command တစ်ခုမှာ `RESTRICT` ဒါမှမဟုတ် `CASCADE` ထဲက တစ်ခုကို သတ်မှတ်ပေးဖို့ လိုအပ်ပါတယ်။ ဘယ် database system မှ တကယ်တော့ ဒီစည်းမျဉ်းကို မကျင့်သုံးပါဘူး — ဒါပေမယ့် default အပြုအမူက `RESTRICT` လား `CASCADE` လားဆိုတာကတော့ system အလိုက် ကွဲပြားပါတယ်။

`DROP` command တစ်ခုမှာ object အများအပြား စာရင်းပြုလုပ်ထားရင် — `CASCADE` က သတ်မှတ်ထားတဲ့ group ရဲ့ အပြင်ဘက်မှာ dependency တွေ ရှိနေမှသာ လိုအပ်ပါတယ်။ ဥပမာ — `DROP TABLE tab1, tab2` လို့ ပြောတဲ့အခါ — `tab2` ကနေ `tab1` ကို refer လုပ်တဲ့ foreign key တစ်ခု ရှိနေတာက — အောင်မြင်ဖို့ `CASCADE` လိုအပ်တယ်လို့ မဆိုလိုပါဘူး။

Body ကို string literal အနေနဲ့ သတ်မှတ်ထားတဲ့ user-defined function ဒါမှမဟုတ် procedure တစ်ခုအတွက် — PostgreSQL က function ရဲ့ အပြင်ဘက်ကနေ မြင်နိုင်တဲ့ (externally-visible) properties တွေနဲ့ ဆက်စပ်တဲ့ dependency တွေကို ခြေရာခံပါတယ် — ဥပမာ — သူ့ရဲ့ argument နဲ့ result types တွေပေါ့။ ဒါပေမယ့် — function body ကို စစ်ဆေးကြည့်မှသာ သိနိုင်မယ့် dependency တွေကိုတော့ ခြေရာခံမှာ မဟုတ်ပါဘူး။ ဥပမာအနေနဲ့ — ဒီအခြေအနေကို ကြည့်ပါ:

```sql
CREATE TYPE rainbow AS ENUM ('red', 'orange', 'yellow',
                             'green', 'blue', 'purple');

CREATE TABLE my_colors (color rainbow, note text);

CREATE FUNCTION get_color_note (rainbow) RETURNS text AS
  'SELECT note FROM my_colors WHERE color = $1'
  LANGUAGE SQL;
```

(SQL-language function တွေရဲ့ ရှင်းလင်းချက်အတွက် [အပိုင်း 36.5](https://www.postgresql.org/docs/current/xfunc-sql.html) ကို ကြည့်ပါ။) PostgreSQL က `get_color_note` function ဟာ `rainbow` type ပေါ်မှာ မှီခိုနေတာကို သိရှိပါလိမ့်မယ်: type ကို drop လုပ်လိုက်ရင် — function ကိုပါ drop လုပ်ဖို့ အတင်းဖြစ်လာမှာ ဖြစ်ပါတယ် — အကြောင်းကတော့ သူ့ရဲ့ argument type က နောက်တော့ သတ်မှတ်ချက် မရှိတော့လို့ပါ။ ဒါပေမယ့် — PostgreSQL က `get_color_note` ကို `my_colors` table ပေါ်မှာ မှီခိုတယ်လို့တော့ မယူဆပါဘူး — ဒါကြောင့် table ကို drop လုပ်လိုက်ရင်လည်း function ကို drop လုပ်မှာ မဟုတ်ပါဘူး။ ဒီနည်းလမ်းမှာ အားနည်းချက်တွေ ရှိသလို — အကျိုးကျေးဇူးတွေလည်း ရှိပါတယ်။ Table မရှိတော့ရင်တောင် — function က တစ်နည်းနည်းနဲ့တော့ valid (တရားဝင်) ဖြစ်နေဦးမှာ ဖြစ်ပါတယ် — သူ့ကို execute လုပ်ရင်တော့ error ဖြစ်မယ် ဆိုပေမယ့် — နာမည်တူ table အသစ်တစ်ခု ဖန်တီးလိုက်ရင် function က ပြန်ပြီး အလုပ်လုပ်နိုင်မှာ ဖြစ်ပါတယ်။

တစ်ဖက်မှာလည်း — body ကို SQL-standard ပုံစံနဲ့ ရေးထားတဲ့ SQL-language function ဒါမှမဟုတ် procedure အတွက်ဆိုရင် — body ကို function သတ်မှတ်ချိန် (definition time) မှာ parse လုပ်ပြီး — parser က မှတ်မိတဲ့ dependency တွေ အားလုံးကို သိမ်းဆည်းပါတယ်။ ဒါကြောင့် — အထက်က function ကို ဒီလိုရေးလိုက်ရင်:

```sql
CREATE FUNCTION get_color_note (rainbow) RETURNS text
BEGIN ATOMIC
  SELECT note FROM my_colors WHERE color = $1;
END;
```

`my_colors` table ပေါ်မှာ function ရဲ့ မှီခိုမှုကို `DROP` က သိရှိပြီး ကျင့်သုံး (enforce) လုပ်မှာ ဖြစ်ပါတယ်။
