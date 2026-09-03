---
title: "Modifying Tables (table များ ပြုပြင်ခြင်း)"
description: "ရှိပြီးသား table ကို ALTER TABLE နဲ့ ပြုပြင်နည်း — column/constraint ပေါင်းထည့်ခြင်းနဲ့ ဖယ်ရှားခြင်း၊ default value နဲ့ data type ပြောင်းခြင်း၊ column နဲ့ table နာမည်ပြောင်းခြင်း"
order: 28
source: "https://www.postgresql.org/docs/current/ddl-alter.html"
status: translated
updated: 2026-09-03
---

## 5.7. Modifying Tables (table များ ပြုပြင်ခြင်း)

- **5.7.1. Adding a Column (column တစ်ခု ပေါင်းထည့်ခြင်း)**
- **5.7.2. Removing a Column (column တစ်ခု ဖယ်ရှားခြင်း)**
- **5.7.3. Adding a Constraint (constraint တစ်ခု ပေါင်းထည့်ခြင်း)**
- **5.7.4. Removing a Constraint (constraint တစ်ခု ဖယ်ရှားခြင်း)**
- **5.7.5. Changing a Column's Default Value (column တစ်ခုရဲ့ default value ပြောင်းလဲခြင်း)**
- **5.7.6. Changing a Column's Data Type (column တစ်ခုရဲ့ data type ပြောင်းလဲခြင်း)**
- **5.7.7. Renaming a Column (column တစ်ခုကို နာမည်ပြောင်းခြင်း)**
- **5.7.8. Renaming a Table (table တစ်ခုကို နာမည်ပြောင်းခြင်း)**

Table တစ်ခုကို ဖန်တီးပြီးမှ အမှားတစ်ခုခု လုပ်မိမှန်း သိလိုက်ရတယ်၊ ဒါမှမဟုတ် application ရဲ့ လိုအပ်ချက်တွေ ပြောင်းသွားတယ်ဆိုရင် — table ကို drop လုပ်ပြီး ပြန်ဖန်တီးလို့ ရပါတယ်။ ဒါပေမယ့် table ထဲမှာ data တွေ ရှိနေပြီးသားဆိုရင်၊ ဒါမှမဟုတ် table ကို တခြား database object တွေက refer (ရည်ညွှန်း) လုပ်နေတယ်ဆိုရင် (ဥပမာ — foreign key constraint) — ဒီနည်းက အဆင်မပြေပါဘူး။ ဒါကြောင့် PostgreSQL မှာ ရှိပြီးသား table တွေကို ပြုပြင်မွမ်းမံဖို့ command အစုအဝေး တစ်ခု ပံ့ပိုးပေးထားပါတယ်။ ဒါက table ထဲမှာ ပါဝင်တဲ့ data ကို ပြောင်းလဲခြင်းနဲ့ သဘောတရားအရ ကွဲပြားတယ်ဆိုတာ သတိပြုပါ — ဒီမှာ စိတ်ဝင်စားတာက table ရဲ့ definition (သတ်မှတ်ချက်) သို့မဟုတ် structure (တည်ဆောက်ပုံ) ကို ပြောင်းလဲခြင်း ဖြစ်ပါတယ်။

သင်လုပ်နိုင်တာတွေကတော့ —

- Column တွေ ပေါင်းထည့်ခြင်း
- Column တွေ ဖယ်ရှားခြင်း
- Constraint တွေ ပေါင်းထည့်ခြင်း
- Constraint တွေ ဖယ်ရှားခြင်း
- Default value တွေ ပြောင်းလဲခြင်း
- Column ရဲ့ data type တွေ ပြောင်းလဲခြင်း
- Column တွေကို နာမည်ပြောင်းခြင်း
- Table တွေကို နာမည်ပြောင်းခြင်း

ဒီ action တွေ အားလုံးကို [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html) command နဲ့ လုပ်ဆောင်ပါတယ် — အဲဒီ command ရဲ့ reference page မှာ ဒီနေရာမှာ ဖော်ပြထားတာထက် ပိုပြီး အသေးစိတ် ပါဝင်ပါတယ်။

### 5.7.1. Adding a Column (column တစ်ခု ပေါင်းထည့်ခြင်း)

Column တစ်ခု ပေါင်းထည့်ဖို့ — ဒီလိုမျိုး command ကို သုံးပါ:

```sql
ALTER TABLE products ADD COLUMN description text;
```

Column အသစ်ကို စတင်ချိန်မှာ သတ်မှတ်ထားတဲ့ default value နဲ့ ဖြည့်ပေးပါတယ် (`DEFAULT` clause မသတ်မှတ်ရင် null value ဖြစ်ပါတယ်)။

> **အကြံပြုချက်:** constant default value (ပုံသေ တန်ဖိုး) တစ်ခုနဲ့ column ပေါင်းထည့်တဲ့အခါ — `ALTER TABLE` statement ကို execute လုပ်တဲ့အချိန်မှာ table ရဲ့ row တိုင်းကို update လုပ်ဖို့ မလိုအပ်ပါဘူး။ အဲဒီအစား — default value ကို row ကို နောက်တစ်ကြိမ် access လုပ်တဲ့အခါ ပြန်ပေးပြီး — table ကို rewrite (ပြန်ရေးသား) လုပ်တဲ့အခါမှာ အသုံးပြုလိုက်တာကြောင့် — table ကြီးတွေမှာတောင် `ALTER TABLE` က အလွန် မြန်ဆန်ပါတယ်။
> 
> Default value က volatile (အချိန်အလိုက် ပြောင်းလဲနေတဲ့) ဖြစ်နေရင် (ဥပမာ — `clock_timestamp()`) — `ALTER TABLE` ကို execute လုပ်တဲ့အချိန်မှာ တွက်ချက်ထားတဲ့ တန်ဖိုးနဲ့ row တစ်ခုချင်းစီကို update လုပ်ဖို့ လိုအပ်ပါတယ်။ အထူးသဖြင့် column ထဲကို default မဟုတ်တဲ့ တန်ဖိုးတွေနဲ့ပဲ အများစု ဖြည့်ဖို့ ရည်ရွယ်ထားရင် — update operation က အချိန်အတော်ကြာနိုင်တာကြောင့် — column ကို default မပါဘဲ ပေါင်းထည့်ပြီး — `UPDATE` နဲ့ အမှန်ကန်တဲ့ တန်ဖိုးတွေကို ထည့်သွင်းကာ — လိုချင်တဲ့ default ကို အောက်မှာ ဖော်ပြထားတဲ့အတိုင်း နောက်မှ ထပ်ပေါင်းထည့်တာက ပိုကောင်းပါတယ်။

Column ပေါ်မှာ constraint တွေကိုလည်း — ပုံမှန် syntax သုံးပြီး — တစ်ချိန်တည်းမှာ သတ်မှတ်လို့ရပါတယ်:

```sql
ALTER TABLE products ADD COLUMN description text CHECK (description <> '');
```

တကယ်တော့ — `CREATE TABLE` ထဲမှာ column description တစ်ခုကို သက်ရောက်စေနိုင်တဲ့ option အားလုံးကို ဒီနေရာမှာလည်း သုံးလို့ရပါတယ်။ ဒါပေမယ့် — default value က သတ်မှတ်ထားတဲ့ constraint တွေကို ကျေနပ်စေရမယ်ဆိုတာ သတိရပါ — မဟုတ်ရင် `ADD` က မအောင်မြင်ပါဘူး။ တနည်းအားဖြင့် — column အသစ်ထဲကို အမှန်ကန်တဲ့ တန်ဖိုးတွေ ဖြည့်ပြီးတဲ့နောက် — constraint တွေကို နောက်မှ ထပ်ပေါင်းထည့်လို့လည်း ရပါတယ် (အောက်မှာ ကြည့်ပါ)။

### 5.7.2. Removing a Column (column တစ်ခု ဖယ်ရှားခြင်း)

Column တစ်ခုကို ဖယ်ရှားဖို့ — ဒီလိုမျိုး command ကို သုံးပါ:

```sql
ALTER TABLE products DROP COLUMN description;
```

Column ထဲမှာ ရှိခဲ့တဲ့ data တွေ အားလုံး ပျောက်ကွယ်သွားပါတယ်။ Column ပါဝင်ပတ်သက်နေတဲ့ table constraint တွေလည်း အတူ drop (ဖျက်) ခံရပါတယ်။ ဒါပေမယ့် — column ကို တခြား table တစ်ခုရဲ့ foreign key constraint က refer (ရည်ညွှန်း) လုပ်နေရင်တော့ — PostgreSQL က အဲဒီ constraint ကို တိတ်တဆိတ် (silently) drop လုပ်ပေးမှာ မဟုတ်ပါဘူး။ Column ပေါ်မှာ မှီခိုနေတဲ့ အရာအားလုံးကို drop လုပ်ခွင့် ပေးချင်ရင် — `CASCADE` ကို ထည့်သွင်းနိုင်ပါတယ်:

```sql
ALTER TABLE products DROP COLUMN description CASCADE;
```

ဒီနောက်ကွယ်က ယေဘုယျ ယန္တရား (mechanism) ရဲ့ ဖော်ပြချက်အတွက် [အပိုင်း 5.15](/docs/postgresql/ddl-depend) ကို ကြည့်ပါ။

### 5.7.3. Adding a Constraint (constraint တစ်ခု ပေါင်းထည့်ခြင်း)

Constraint တစ်ခု ပေါင်းထည့်ဖို့ — table constraint syntax ကို သုံးပါတယ်။ ဥပမာ:

```sql
ALTER TABLE products ADD CHECK (name <> '');
ALTER TABLE products ADD CONSTRAINT some_name UNIQUE (product_no);
ALTER TABLE products ADD FOREIGN KEY (product_group_id) REFERENCES product_groups;
```

ပုံမှန်အားဖြင့် table constraint အနေနဲ့ မရေးလေ့ရှိတဲ့ not-null constraint ကို ပေါင်းထည့်ဖို့ — ဒီအထူး syntax ကို ရနိုင်ပါတယ်:

```sql
ALTER TABLE products ALTER COLUMN product_no SET NOT NULL;
```

Column မှာ not-null constraint ရှိပြီးသားဆိုရင် — ဒီ command က ဘာမှ မလုပ်ဘဲ တိတ်တဆိတ် ကျော်သွားပါတယ်။

Constraint ကို ချက်ချင်း check (စစ်ဆေး) လုပ်မှာ ဖြစ်လို့ — table ထဲက data တွေက constraint ကို ကျေနပ်မှသာ ၎င်းကို ပေါင်းထည့်နိုင်မှာ ဖြစ်ပါတယ်။

### 5.7.4. Removing a Constraint (constraint တစ်ခု ဖယ်ရှားခြင်း)

Constraint တစ်ခုကို ဖယ်ရှားဖို့ — သူ့ရဲ့ နာမည်ကို သိထားဖို့ လိုပါတယ်။ နာမည်ကို သင်ကိုယ်တိုင် ပေးထားရင် လွယ်ပါတယ်။ မပေးထားရင်တော့ — system က generate လုပ်ထားတဲ့ နာမည်တစ်ခု ရှိမှာ ဖြစ်ပြီး — အဲဒါကို ရှာဖွေဖို့ လိုပါတယ်။ ဒီနေရာမှာ psql ရဲ့ `\d tablename` command က အသုံးဝင်နိုင်ပါတယ်; တခြား interface တွေမှာလည်း table ရဲ့ အသေးစိတ်တွေကို စစ်ဆေးကြည့်ရှုဖို့ နည်းလမ်း ရှိနိုင်ပါတယ်။ ပြီးရင် command က ဒီလိုပါ:

```sql
ALTER TABLE products DROP CONSTRAINT some_name;
```

Column drop လုပ်တာနဲ့ ဆင်တူပြီး — တခြား အရာတစ်ခုခုက မှီခိုနေတဲ့ constraint ကို drop ချင်ရင် `CASCADE` ကို ထည့်ဖို့ လိုပါတယ်။ ဥပမာ — foreign key constraint က refer (ရည်ညွှန်း) ခံရတဲ့ column (များ) ပေါ်က unique သို့မဟုတ် primary key constraint ကို မှီခိုနေတတ်ပါတယ်။

Not-null constraint ကို ဖယ်ရှားဖို့ — ရိုးရှင်းတဲ့ syntax ကို ရနိုင်ပါတယ်:

```sql
ALTER TABLE products ALTER COLUMN product_no DROP NOT NULL;
```

ဒါက not-null constraint ပေါင်းထည့်တဲ့ `SET NOT NULL` syntax ကို ထပ်တူပြုထားတာပါ။ Column မှာ not-null constraint မရှိရင် — ဒီ command က ဘာမှ မလုပ်ဘဲ တိတ်တဆိတ် ကျော်သွားပါတယ်။ (Column တစ်ခုမှာ not-null constraint အများဆုံး တစ်ခုပဲ ရှိနိုင်လို့ — ဒီ command က ဘယ် constraint ကို သက်ရောက်တာလဲဆိုတာ ဘယ်တော့မှ မရှင်းလင်းမှု (ambiguous) မဖြစ်နိုင်တာကို သတိရပါ။)

### 5.7.5. Changing a Column's Default Value (column တစ်ခုရဲ့ default value ပြောင်းလဲခြင်း)

Column တစ်ခုအတွက် default အသစ် သတ်မှတ်ဖို့ — ဒီလိုမျိုး command ကို သုံးပါ:

```sql
ALTER TABLE products ALTER COLUMN price SET DEFAULT 7.77;
```

ဒါက table ထဲက ရှိပြီးသား row တွေကို သက်ရောက်မှု မရှိဘူးဆိုတာ သတိပြုပါ — နောင်လာမယ့် `INSERT` command တွေအတွက် default ကိုပဲ ပြောင်းလဲပေးတာပါ။

Default value တစ်ခုခုကို ဖယ်ရှားချင်ရင်:

```sql
ALTER TABLE products ALTER COLUMN price DROP DEFAULT;
```

ဒါက default ကို null သတ်မှတ်လိုက်တာနဲ့ ထိရောက်စွာ အတူတူပဲ ဖြစ်ပါတယ်။ အကျိုးဆက်အနေနဲ့ — default သတ်မှတ်မထားခဲ့တဲ့ default တစ်ခုကို drop လုပ်တာက error မဟုတ်ပါဘူး — အကြောင်းကတော့ default က သွယ်ဝိုက်အားဖြင့် (implicitly) null value ပဲ ဖြစ်လို့ပါ။

### 5.7.6. Changing a Column's Data Type (column တစ်ခုရဲ့ data type ပြောင်းလဲခြင်း)

Column တစ်ခုကို တခြား data type တစ်ခုအဖြစ် ပြောင်းဖို့ — ဒီလိုမျိုး command ကို သုံးပါ:

```sql
ALTER TABLE products ALTER COLUMN price TYPE numeric(10,2);
```

Column ထဲက ရှိပြီးသား entry (တန်ဖိုး) တစ်ခုချင်းစီကို implicit cast နဲ့ type အသစ်အဖြစ် ပြောင်းလဲနိုင်မှသာ ဒီ command က အောင်မြင်ပါတယ်။ ပိုရှုပ်ထွေးတဲ့ conversion လိုအပ်ရင် — တန်ဖိုးဟောင်းတွေကနေ တန်ဖိုးအသစ်တွေကို ဘယ်လို တွက်ချက်ရမလဲဆိုတာ သတ်မှတ်ပေးတဲ့ `USING` clause ကို ထည့်သွင်းနိုင်ပါတယ်။

PostgreSQL က column ရဲ့ default value (ရှိရင်) ကိုရော — column ပါဝင်ပတ်သက်နေတဲ့ constraint တွေကိုပါ type အသစ်အဖြစ် ပြောင်းဖို့ ကြိုးစားပါလိမ့်မယ်။ ဒါပေမယ့် — ဒီ conversion တွေက မအောင်မြင်နိုင်သလို — မမျှော်လင့်ထားတဲ့ ရလဒ်တွေကိုလည်း ဖြစ်စေနိုင်ပါတယ်။ Type ပြောင်းလဲခြင်း မတိုင်ခင် column ပေါ်က constraint တွေကို အရင်ဆုံး drop လုပ်ပြီး — နောက်မှ သင့်လျော်စွာ ပြုပြင်ထားတဲ့ constraint တွေကို ပြန်ပေါင်းထည့်တာက မကြာခဏဆိုသလို အကောင်းဆုံး ဖြစ်ပါတယ်။

### 5.7.7. Renaming a Column (column တစ်ခုကို နာမည်ပြောင်းခြင်း)

Column တစ်ခုကို နာမည်ပြောင်းဖို့:

```sql
ALTER TABLE products RENAME COLUMN product_no TO product_number;
```

### 5.7.8. Renaming a Table (table တစ်ခုကို နာမည်ပြောင်းခြင်း)

Table တစ်ခုကို နာမည်ပြောင်းဖို့:

```sql
ALTER TABLE products RENAME TO items;
```
