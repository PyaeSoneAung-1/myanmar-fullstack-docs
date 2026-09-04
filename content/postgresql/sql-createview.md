---
title: "CREATE VIEW (view အသစ်တစ်ခု ဖန်တီးခြင်း)"
description: "query တစ်ခုကို view အဖြစ် သတ်မှတ် ဖန်တီးပေးတဲ့ command — CREATE OR REPLACE VIEW၊ TEMPORARY/TEMP နဲ့ RECURSIVE view များ၊ column name list၊ view options (check_option, security_barrier, security_invoker)၊ WITH [CASCADED | LOCAL] CHECK OPTION နဲ့ automatically updatable view အကြောင်း အသေးစိတ်"
order: 145
source: "https://www.postgresql.org/docs/current/sql-createview.html"
status: translated
updated: 2026-09-04
---

## CREATE VIEW (view အသစ်တစ်ခု ဖန်တီးခြင်း)

CREATE VIEW — view အသစ်တစ်ခုကို သတ်မှတ်ပေးတဲ့ command ဖြစ်ပါတယ်။

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CREATE [ OR REPLACE ] [ TEMP | TEMPORARY ] [ RECURSIVE ] VIEW name [ ( column_name [, ...] ) ]
    [ WITH ( view_option_name [= view_option_value] [, ... ] ) ]
    AS query
    [ WITH [ CASCADED | LOCAL ] CHECK OPTION ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CREATE VIEW` က query တစ်ခုရဲ့ view ကို သတ်မှတ်ပေးပါတယ်။ အဲဒီ view ကို physically (ရုပ်ပိုင်းအရ) materialize လုပ်ထားတာ မဟုတ်ပါဘူး။ အဲဒီအစား — query တစ်ခုထဲမှာ view ကို ရည်ညွှန်းသုံးတိုင်း — အဲဒီ query ကို run လုပ်ပါတယ်။

`CREATE OR REPLACE VIEW` ကလည်း အလားတူပါပဲ — ဒါပေမယ့် နာမည်တူ view တစ်ခု ရှိပြီးသားဆိုရင် — အဲဒါကို အစားထိုးပါတယ်။ Query အသစ်က — ရှိပြီးသား view query က ထုတ်ပေးခဲ့တဲ့ column တွေနဲ့ အတူတူ column တွေကို ထုတ်ပေးရပါမယ် (ဆိုလိုတာက — column နာမည်တွေ အတူတူ၊ အစဉ်လိုက် အတူတူ၊ data type တွေ အတူတူ ဖြစ်ရမယ်) — ဒါပေမယ့် စာရင်းရဲ့ အဆုံးမှာ column အပိုတွေ ထပ်ထည့်လို့တော့ ရပါတယ်။ Output column တွေကို ဖြစ်ပေါ်စေတဲ့ တွက်ချက်မှုတွေကတော့ လုံးဝ ကွဲပြားနေလို့ ရပါတယ်။

Schema နာမည် ပေးထားရင် (ဥပမာ — `CREATE VIEW myschema.myview ...`) — view ကို သတ်မှတ်ထားတဲ့ schema ထဲမှာ ဖန်တီးပါတယ်။ မပေးထားရင်တော့ — လက်ရှိ schema ထဲမှာ ဖန်တီးပါတယ်။ Temporary view တွေက အထူး schema တစ်ခုထဲမှာ တည်ရှိလို့ — temporary view ဖန်တီးတဲ့အခါ schema နာမည် ပေးလို့ မရပါဘူး။ View ရဲ့ နာမည်က — schema တစ်ခုတည်းထဲက တခြား relation (table, sequence, index, view, materialized view ဒါမှမဟုတ် foreign table) တစ်ခုခုရဲ့ နာမည်နဲ့ မတူညီရပါဘူး။

## Parameters (parameter များ)

- **TEMPORARY or TEMP** — သတ်မှတ်ထားရင် — view ကို temporary view အဖြစ် ဖန်တီးပါတယ်။ Temporary view တွေကို လက်ရှိ session ပြီးဆုံးချိန်မှာ အလိုအလျောက် ဖျက်ပစ်ပါတယ်။ Temporary view တည်ရှိနေတုန်း — နာမည်တူ ရှိပြီးသား permanent relation တွေကို — schema-qualified နာမည်တွေနဲ့ ရည်ညွှန်းထားရင်ကလွဲလို့ — လက်ရှိ session မှာ မမြင်ရပါဘူး။

View က ရည်ညွှန်းထားတဲ့ table တွေထဲက တစ်ခုခု temporary ဖြစ်နေရင် — (TEMPORARY သတ်မှတ်ထားလား မသတ်မှတ်ထားလား မဆို) — view ကို temporary view အဖြစ် ဖန်တီးပါတယ်။

- **RECURSIVE** — Recursive view တစ်ခုကို ဖန်တီးပါတယ်။ Syntax ကတော့:

  ```sql
  CREATE RECURSIVE VIEW [ schema . ] view_name (column_names) AS SELECT ...;
  ```

  ဆိုတာ အောက်ပါနဲ့ ညီမျှပါတယ်:

  ```sql
  CREATE VIEW [ schema . ] view_name AS WITH RECURSIVE view_name (column_names) AS (SELECT ...) SELECT column_names FROM view_name;
  ```

Recursive view တစ်ခုအတွက် — view column နာမည် စာရင်း တစ်ခုကို သတ်မှတ်ပေးရပါမယ်။

- **name** — ဖန်တီးရမယ့် view ရဲ့ နာမည် (schema-qualified ဖြစ်လည်း ရပါတယ်)။
- **column_name** — View ရဲ့ column တွေအတွက် သုံးမယ့် နာမည် စာရင်း — optional ဖြစ်ပါတယ်။ မပေးထားရင် — column နာမည်တွေကို query ကနေ ဆင်းသက်ယူပါတယ်။
- **WITH ( view_option_name [= view_option_value] [, ... ] )** — ဒီ clause က view တစ်ခုအတွက် optional parameters တွေကို သတ်မှတ်ပေးပါတယ်; အောက်ပါ parameters တွေကို ထောက်ပံ့ထားပါတယ်:

check_option (enum)

ဒီ parameter က local ဒါမှမဟုတ် cascaded ဖြစ်နိုင်ပြီး — WITH [ CASCADED | LOCAL ] CHECK OPTION လို့ သတ်မှတ်ခြင်းနဲ့ ညီမျှပါတယ် (အောက်မှာ ကြည့်ပါ)။

security_barrier (boolean)

View က row-level security ပေးဖို့ ရည်ရွယ်ထားတယ်ဆိုရင် — ဒါကို သုံးသင့်ပါတယ်။ အပြည့်အစုံ အသေးစိတ်အတွက် [အပိုင်း 39.5](https://www.postgresql.org/docs/current/rules-privileges.html) ကို ကြည့်ပါ။

security_invoker (boolean)

ဒီ option က — အောက်ခံ base relations တွေကို — view ပိုင်ရှင်ရဲ့ မဟုတ်ဘဲ — view ကို သုံးနေတဲ့ user ရဲ့ ထူးခွင့် (privilege) တွေနဲ့ စစ်ဆေးခံစေပါတယ်။ အပြည့်အစုံ အသေးစိတ်အတွက် အောက်က Notes တွေကို ကြည့်ပါ။

အပေါ်က option တွေ အားလုံးကို — ALTER VIEW သုံးပြီး — ရှိပြီးသား view တွေပေါ်မှာ ပြောင်းလဲလို့ ရပါတယ်။

- **query** — View ရဲ့ column တွေနဲ့ row တွေကို ထောက်ပံ့ပေးမယ့် SELECT ဒါမှမဟုတ် VALUES command တစ်ခု ဖြစ်ပါတယ်။
- **WITH [ CASCADED | LOCAL ] CHECK OPTION** — ဒီ option က automatically updatable view တွေရဲ့ အပြုအမူကို ထိန်းချုပ်ပါတယ်။ ဒီ option ကို သတ်မှတ်ထားတဲ့အခါ — view ပေါ်မှာရှိတဲ့ INSERT, UPDATE, နဲ့ MERGE command တွေကို — row အသစ်တွေက view ကို သတ်မှတ်တဲ့ အခြေအနေ (view-defining condition) ကို ဖြည့်ဆည်းကြောင်း သေချာစေဖို့ စစ်ဆေးပါတယ် (ဆိုလိုတာက — row အသစ်တွေ view ကနေ မြင်နိုင်ရဲ့လားဆိုတာ စစ်ဆေးပါတယ်)။ မဖြည့်ဆည်းဘူးဆိုရင် — update ကို ပယ်ချပါတယ်။ CHECK OPTION ကို မသတ်မှတ်ထားဘူးဆိုရင် — view ပေါ်မှာရှိတဲ့ INSERT, UPDATE, နဲ့ MERGE command တွေက — view ကနေ မမြင်ရတဲ့ row တွေကို ဖန်တီးခွင့် ရှိပါတယ်။ အောက်ပါ check option တွေကို ထောက်ပံ့ထားပါတယ်:

LOCAL

Row အသစ်တွေကို — view ထဲမှာတင် တိုက်ရိုက် သတ်မှတ်ထားတဲ့ အခြေအနေတွေနဲ့ပဲ စစ်ဆေးပါတယ်။ အောက်ခံ base view တွေပေါ်မှာ သတ်မှတ်ထားတဲ့ အခြေအနေ တစ်ခုခုကိုတော့ မစစ်ဆေးပါဘူး (သူတို့ကလည်း CHECK OPTION သတ်မှတ်ထားရင်ကလွဲလို့)။

CASCADED

Row အသစ်တွေကို — view ရဲ့ အခြေအနေတွေရော — အောက်ခံ base view တွေ အားလုံးရဲ့ အခြေအနေတွေနဲ့ပါ စစ်ဆေးပါတယ်။ CHECK OPTION ကို သတ်မှတ်ထားပြီး — LOCAL ရော CASCADED ရော ဘယ်ဟာမှ မသတ်မှတ်ထားရင် — CASCADED လို့ ယူဆပါတယ်။

CHECK OPTION ကို RECURSIVE view တွေနဲ့တွဲ သုံးလို့ မရပါဘူး။ CHECK OPTION ကို — automatically updatable ဖြစ်ပြီး — INSTEAD OF trigger တွေရော INSTEAD rule တွေပါ မရှိတဲ့ — view တွေပေါ်မှာပဲ ထောက်ပံ့တယ်ဆိုတာ သတိပြုပါ။ Automatically updatable view တစ်ခုကို — INSTEAD OF trigger တွေ ရှိတဲ့ base view တစ်ခုရဲ့ အပေါ်မှာ သတ်မှတ်ထားရင် — automatically updatable view ပေါ်က အခြေအနေတွေကို စစ်ဆေးဖို့ LOCAL CHECK OPTION ကို သုံးလို့ ရပေမယ့် — INSTEAD OF trigger ရှိတဲ့ base view ပေါ်က အခြေအနေတွေကိုတော့ မစစ်ဆေးပါဘူး (cascaded check option က trigger-updatable view တစ်ခုဆီ အောက်ကို ဆင်းသွားမှာ မဟုတ်သလို — trigger-updatable view ပေါ်မှာ တိုက်ရိုက် သတ်မှတ်ထားတဲ့ check option တွေကလည်း လျစ်လျူရှုခံရပါမယ်)။ View ဒါမှမဟုတ် သူ့ရဲ့ base relations တစ်ခုခုမှာ — INSERT ဒါမှမဟုတ် UPDATE command ကို ပြန်ရေးသားစေတဲ့ INSTEAD rule တစ်ခု ရှိနေရင် — rewritten ဖြစ်သွားတဲ့ query ထဲမှာ check option တွေ အားလုံးကို လျစ်လျူရှုပါတယ် — အဲဒီထဲမှာ INSTEAD rule ရှိတဲ့ relation ရဲ့ အပေါ်မှာ သတ်မှတ်ထားတဲ့ automatically updatable view တွေကနေ လာတဲ့ check တွေပါ အပါအဝင် ဖြစ်ပါတယ်။ View ဒါမှမဟုတ် သူ့ရဲ့ base relations တစ်ခုခုမှာ rules တွေ ရှိနေရင် — MERGE ကို ထောက်ပံ့မှာ မဟုတ်ပါဘူး။

## Notes (မှတ်စုများ)

View တွေကို ဖျက်ပစ်ဖို့ — [`DROP VIEW`](/docs/postgresql/sql-dropview) statement ကို သုံးပါ။

View ရဲ့ column တွေရဲ့ နာမည်နဲ့ type တွေကို — သင်လိုချင်တဲ့အတိုင်း သတ်မှတ်ခံရအောင် သတိထားပါ။ ဥပမာ:

```sql
CREATE VIEW vista AS SELECT 'Hello World';
```

ဒီဥပမာက ပုံစံ မကောင်းပါဘူး — ဘာလို့လဲဆိုတော့ column နာမည်က `?column?` လို့ default ဖြစ်ပြီး — column data type ကလည်း သင်လိုချင်တာနဲ့ မတူနိုင်တဲ့ `text` လို့ default ဖြစ်လို့ပါ။ View ရဲ့ result ထဲမှာ string literal တစ်ခုအတွက် ပိုကောင်းတဲ့ ပုံစံကတော့ ဒီလိုမျိုးပါ:

```sql
CREATE VIEW vista AS SELECT text 'Hello World' AS hello;
```

Default အရ — view ထဲမှာ ရည်ညွှန်းထားတဲ့ အောက်ခံ base relations တွေဆီ ဝင်ရောက်ခွင့်ကို — view ပိုင်ရှင်ရဲ့ ခွင့်ပြုချက်တွေ (permissions) နဲ့ ဆုံးဖြတ်ပါတယ်။ ကိစ္စအချို့မှာ — ဒါကို အောက်ခံ table တွေဆီ — လုံခြုံပြီး ကန့်သတ်ထားတဲ့ — ဝင်ရောက်ခွင့် ပေးဖို့ သုံးလို့ ရပါတယ်။ ဒါပေမယ့် — view တိုင်း tampering (ပြင်ဆင် ဖောက်ဖျက်မှု) ကို ခံနိုင်ရည် မရှိပါဘူး; အသေးစိတ်အတွက် [အပိုင်း 39.5](https://www.postgresql.org/docs/current/rules-privileges.html) ကို ကြည့်ပါ။

View မှာ `security_invoker` property ကို `true` လို့ သတ်မှတ်ထားရင် — အောက်ခံ base relations တွေဆီ ဝင်ရောက်ခွင့်ကို — view ပိုင်ရှင် မဟုတ်ဘဲ — query ကို execute လုပ်နေတဲ့ user ရဲ့ ခွင့်ပြုချက်တွေနဲ့ ဆုံးဖြတ်ပါတယ်။ ဒါကြောင့် — security invoker view တစ်ခုရဲ့ user က — view ပေါ်မှာရော သူ့ရဲ့ အောက်ခံ base relations တွေပေါ်မှာပါ သက်ဆိုင်ရာ ခွင့်ပြုချက်တွေ ရှိရပါမယ်။

အောက်ခံ base relations တွေထဲက တစ်ခုခုက security invoker view ဖြစ်နေရင် — အဲဒါကို မူရင်း query ကနေ တိုက်ရိုက် ဝင်ရောက်ထားသလိုပဲ သဘောထားပါတယ်။ ဒါကြောင့် — security invoker view တစ်ခုက — `security_invoker` property မရှိတဲ့ view တစ်ခုကနေ ဝင်ရောက်ခံရရင်တောင် — သူ့ရဲ့ အောက်ခံ base relations တွေကို လက်ရှိ user ရဲ့ ခွင့်ပြုချက်တွေနဲ့ အမြဲ စစ်ဆေးပါတယ်။

အောက်ခံ base relations တွေထဲက တစ်ခုခုမှာ [row-level security](/docs/postgresql/ddl-rowsecurity) ဖွင့်ထားရင် — default အရ — view ပိုင်ရှင်ရဲ့ row-level security policies တွေကို သက်ရောက်စေပြီး — အဲဒီ policies တွေက ရည်ညွှန်းတဲ့ နောက်ထပ် relations တွေဆီ ဝင်ရောက်ခွင့်ကို — view ပိုင်ရှင်ရဲ့ ခွင့်ပြုချက်တွေနဲ့ ဆုံးဖြတ်ပါတယ်။ ဒါပေမယ့် — view မှာ `security_invoker` ကို `true` လို့ သတ်မှတ်ထားရင် — base relations တွေကို view သုံးထားတဲ့ query ကနေ တိုက်ရိုက် ရည်ညွှန်းထားသလိုပဲ — invoking user ရဲ့ policies နဲ့ permissions တွေကို အဲဒီအစား သုံးပါတယ်။

View ထဲမှာ ခေါ်ထားတဲ့ functions တွေကို — view သုံးထားတဲ့ query ကနေ တိုက်ရိုက် ခေါ်ထားသလိုပဲ သဘောထားပါတယ်။ ဒါကြောင့် — view တစ်ခုရဲ့ user က — view က သုံးထားတဲ့ functions တွေ အားလုံးကို ခေါ်ဆိုဖို့ ခွင့်ပြုချက် ရှိရပါမယ်။ View ထဲက functions တွေကို — functions တွေကို `SECURITY INVOKER` ဒါမှမဟုတ် `SECURITY DEFINER` အနေနဲ့ သတ်မှတ်ထားလားဆိုတာပေါ် မူတည်ပြီး — query ကို execute လုပ်နေတဲ့ user ရဲ့ ဒါမှမဟုတ် function ပိုင်ရှင်ရဲ့ ထူးခွင့်တွေနဲ့ execute လုပ်ပါတယ်။ ဒါကြောင့် — ဥပမာ — view တစ်ခုထဲမှာ `CURRENT_USER` ကို တိုက်ရိုက် ခေါ်ရင် — view ပိုင်ရှင် မဟုတ်ဘဲ — invoking user ကို အမြဲ ပြန်ပေးပါတယ်။ ဒါက view ရဲ့ `security_invoker` setting ကြောင့် သက်ရောက်မှု မရှိပါဘူး — ဒါကြောင့် — `security_invoker` ကို `false` လို့ သတ်မှတ်ထားတဲ့ view က `SECURITY DEFINER` function တစ်ခုနဲ့ ညီမျှတာ မဟုတ်ဘဲ — အဲဒီ သဘောတရား နှစ်ခုကို ရောထွေး မထားသင့်ပါဘူး။

View တစ်ခုကို ဖန်တီး ဒါမှမဟုတ် အစားထိုးနေတဲ့ user က — view query ထဲမှာ ရည်ညွှန်းထားတဲ့ objects တွေကို အဲဒီ schemas တွေထဲမှာ ရှာဖွေနိုင်ဖို့ — view query ထဲမှာ ရည်ညွှန်းထားတဲ့ schemas တစ်ခုခုပေါ်မှာ `USAGE` ထူးခွင့် ရှိရပါမယ်။ ဒါပေမယ့် — ဒီရှာဖွေမှုက view ကို ဖန်တီးတဲ့အခါ ဒါမှမဟုတ် အစားထိုးတဲ့အခါမှပဲ ဖြစ်တယ်ဆိုတာ သတိပြုပါ။ ဒါကြောင့် — view ရဲ့ user က — security invoker view အတွက်တောင် — view query ထဲမှာ ရည်ညွှန်းထားတဲ့ schemas တွေပေါ်မှာ မဟုတ်ဘဲ — view ပါဝင်နေတဲ့ schema ပေါ်မှာပဲ `USAGE` ထူးခွင့် လိုအပ်ပါတယ်။

`CREATE OR REPLACE VIEW` ကို ရှိပြီးသား view တစ်ခုပေါ်မှာ သုံးတဲ့အခါ — view ရဲ့ defining SELECT rule နဲ့ — `WITH ( ... )` parameters တစ်ခုခုရော သူ့ရဲ့ `CHECK OPTION` ပါ — အဲဒါတွေပဲ ပြောင်းလဲပါတယ်။ Ownership (ပိုင်ဆိုင်မှု)၊ permissions (ခွင့်ပြုချက်များ) နဲ့ non-SELECT rules တွေ အပါအဝင် — တခြား view properties တွေကတော့ မပြောင်းလဲဘဲ ရှိနေပါတယ်။ View ကို အစားထိုးဖို့ — သင်က view ကို ပိုင်ဆိုင်ရပါမယ် (ဒီထဲမှာ view ကို ပိုင်ဆိုင်ထားတဲ့ role ရဲ့ member တစ်ယောက် ဖြစ်နေတာလည်း ပါဝင်ပါတယ်)။

### Updatable Views (update လုပ်နိုင်သော view များ)

Simple view တွေက automatically updatable (အလိုအလျောက် update လုပ်လို့ ရနိုင်) ပါတယ်: system က view ပေါ်မှာ — သာမန် table တစ်ခုပေါ်မှာ သုံးသလိုပဲ — `INSERT`, `UPDATE`, `DELETE`, နဲ့ `MERGE` statements တွေကို သုံးခွင့် ပြုပါတယ်။ View တစ်ခုက အောက်ပါ အခြေအနေတွေ အားလုံးကို ဖြည့်ဆည်းရင် automatically updatable ဖြစ်ပါတယ်:

- View ရဲ့ FROM list ထဲမှာ entry တစ်ခုတည်း ရှိရပါမယ် — အဲဒါက table တစ်ခု ဒါမှမဟုတ် တခြား updatable view တစ်ခု ဖြစ်ရပါမယ်။
- View definition ထဲမှာ top level မှာ WITH, DISTINCT, GROUP BY, HAVING, LIMIT ဒါမှမဟုတ် OFFSET clauses တွေ မပါရပါဘူး။
- View definition ထဲမှာ top level မှာ set operations (UNION, INTERSECT ဒါမှမဟုတ် EXCEPT) တွေ မပါရပါဘူး။
- View ရဲ့ select list ထဲမှာ aggregates တွေ၊ window functions တွေ ဒါမှမဟုတ် set-returning functions တွေ မပါရပါဘူး။

Automatically updatable view တစ်ခုမှာ — updatable ဖြစ်တဲ့ column တွေရော မဖြစ်တဲ့ column တွေပါ ရောနှော ပါဝင်နိုင်ပါတယ်။ Column တစ်ခုက — အောက်ခံ base relation ရဲ့ updatable column တစ်ခုကို ရိုးရိုး ရည်ညွှန်းထားတာဆိုရင် updatable ဖြစ်ပြီး — မဟုတ်ရင် column က read-only ဖြစ်ပြီး — `INSERT`, `UPDATE`, ဒါမှမဟုတ် `MERGE` statement တစ်ခုက အဲဒီ column ကို တန်ဖိုး သတ်မှတ်ဖို့ ကြိုးစားရင် error တစ်ခု ထွက်ပါလိမ့်မယ်။

View က automatically updatable ဖြစ်ရင် — system က view ပေါ်မှာရှိတဲ့ `INSERT`, `UPDATE`, `DELETE`, ဒါမှမဟုတ် `MERGE` statement တစ်ခုခုကို — အောက်ခံ base relation ပေါ်မှာရှိတဲ့ သက်ဆိုင်ရာ statement အဖြစ် ပြောင်းလဲပေးပါတယ်။ `ON CONFLICT UPDATE` clause ပါတဲ့ `INSERT` statements တွေကို အပြည့်အဝ ထောက်ပံ့ပါတယ်။

Automatically updatable view တစ်ခုမှာ `WHERE` အခြေအနေ ပါဝင်နေရင် — အဲဒီ အခြေအနေက — view ပေါ်မှာရှိတဲ့ `UPDATE`, `DELETE`, နဲ့ `MERGE` statements တွေနဲ့ ပြုပြင်မွမ်းမံလို့ ရတဲ့ — base relation ရဲ့ row တွေကို ကန့်သတ်ပါတယ်။ ဒါပေမယ့် — `UPDATE` ဒါမှမဟုတ် `MERGE` တစ်ခုက — row တစ်ခုကို — သူ `WHERE` အခြေအနေကို မဖြည့်ဆည်းတော့ဘဲ — view ကနေ မမြင်ရတော့အောင် — ပြောင်းလဲပစ်တာကိုတော့ ခွင့်ပြုပါတယ်။ အလားတူပဲ — `INSERT` ဒါမှမဟုတ် `MERGE` command တစ်ခုက — `WHERE` အခြေအနေကို မဖြည့်ဆည်းလို့ view ကနေ မမြင်ရတဲ့ — base-relation row တွေကို ထည့်သွင်းနိုင်ပါတယ် (`ON CONFLICT UPDATE` ကလည်း view ကနေ မမြင်ရတဲ့ ရှိပြီးသား row တစ်ခုကို အလားတူ သက်ရောက်နိုင်ပါတယ်)။ `CHECK OPTION` ကို — `INSERT`, `UPDATE`, နဲ့ `MERGE` commands တွေက view ကနေ မမြင်ရတဲ့ အဲဒီလို row တွေ ဖန်တီးတာကို တားဆီးဖို့ သုံးလို့ ရပါတယ်။

Automatically updatable view တစ်ခုကို `security_barrier` property နဲ့ အမှတ်အသား လုပ်ထားရင် — view ရဲ့ `WHERE` အခြေအနေတွေ အားလုံး (နဲ့ `LEAKPROOF` လို့ အမှတ်အသား လုပ်ထားတဲ့ operator တွေ သုံးထားတဲ့ အခြေအနေတွေပါ) ကို — view ရဲ့ user တစ်ယောက် ထပ်ဖြည့်ထားတဲ့ အခြေအနေ တစ်ခုခုထက် — အမြဲ အရင်ဆုံး အကဲဖြတ်ပါတယ်။ အပြည့်အစုံ အသေးစိတ်အတွက် [အပိုင်း 39.5](https://www.postgresql.org/docs/current/rules-privileges.html) ကို ကြည့်ပါ။ ဒါကြောင့် — နောက်ဆုံးမှာ ပြန်မပေးတဲ့ row တွေ (user ရဲ့ `WHERE` အခြေအနေတွေကို မဖြတ်သန်းလို့) တောင် — lock ဖြစ်သွားနိုင်တယ်ဆိုတာ သတိပြုပါ။ `EXPLAIN` ကို သုံးပြီး — ဘယ် အခြေအနေတွေကို relation level မှာ သက်ရောက်စေလို့ row တွေကို lock မလုပ်ဘူး — ဆိုတာရော — ဘယ်ဟာတွေက မလုပ်ဘူးဆိုတာရော ကြည့်လို့ ရပါတယ်။

ဒီ အခြေအနေတွေ အားလုံးကို မဖြည့်ဆည်းတဲ့ — ပိုရှုပ်ထွေးတဲ့ view တစ်ခုက — default အရ read-only ဖြစ်ပါတယ်: system က view ပေါ်မှာ `INSERT`, `UPDATE`, `DELETE`, ဒါမှမဟုတ် `MERGE` ကို ခွင့်ပြုမှာ မဟုတ်ပါဘူး။ View ပေါ်မှာ `INSTEAD OF` triggers တွေ ဖန်တီးပြီး — view ပေါ်က insert စတဲ့ ကြိုးစားမှုတွေကို တခြား table တွေပေါ်မှာ သင့်လျော်တဲ့ လုပ်ဆောင်ချက်တွေအဖြစ် ပြောင်းပေးရင် — updatable view တစ်ခုရဲ့ အာနိသင် (effect) ကို ရနိုင်ပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် [CREATE TRIGGER](https://www.postgresql.org/docs/current/sql-createtrigger.html) ကို ကြည့်ပါ။ နောက်ထပ် ဖြစ်နိုင်ခြေ တစ်ခုကတော့ rules တွေ ဖန်တီးတာပါ ([CREATE RULE](https://www.postgresql.org/docs/current/sql-createrule.html) ကို ကြည့်ပါ) — ဒါပေမယ့် လက်တွေ့မှာတော့ triggers တွေက နားလည်ဖို့ရော မှန်မှန် သုံးဖို့ပါ ပိုလွယ်ပါတယ်။ ဒါ့အပြင် — `MERGE` က rules ရှိတဲ့ relations တွေပေါ်မှာ ထောက်ပံ့မထားဘူးဆိုတာလည်း သတိပြုပါ။

View ပေါ်မှာ insert, update ဒါမှမဟုတ် delete လုပ်နေတဲ့ user က — view ပေါ်မှာ သက်ဆိုင်ရာ insert, update ဒါမှမဟုတ် delete ထူးခွင့် ရှိရမယ်ဆိုတာ သတိပြုပါ။ ဒါ့အပြင် — default အရ — view ရဲ့ ပိုင်ရှင်က အောက်ခံ base relations တွေပေါ်မှာ သက်ဆိုင်ရာ ထူးခွင့်တွေ ရှိရပြီး — update လုပ်နေတဲ့ user ကတော့ အောက်ခံ base relations တွေပေါ်မှာ ဘာ ခွင့်ပြုချက်မှ မလိုအပ်ပါဘူး ([အပိုင်း 39.5](https://www.postgresql.org/docs/current/rules-privileges.html) ကို ကြည့်ပါ)။ ဒါပေမယ့် — view မှာ `security_invoker` ကို `true` လို့ သတ်မှတ်ထားရင် — view ပိုင်ရှင် မဟုတ်ဘဲ — update လုပ်နေတဲ့ user က — အောက်ခံ base relations တွေပေါ်မှာ သက်ဆိုင်ရာ ထူးခွင့်တွေ ရှိရပါမယ်။

## Examples (ဥပမာများ)

Comedy ဇာတ်ကားတွေ အားလုံး ပါဝင်တဲ့ view တစ်ခု ဖန်တီးခြင်း:

```sql
CREATE VIEW comedies AS
    SELECT *
    FROM films
    WHERE kind = 'Comedy';
```

ဒါက — view ဖန်တီးချိန်မှာ `film` table ထဲမှာ ရှိနေတဲ့ column တွေ ပါဝင်တဲ့ view တစ်ခုကို ဖန်တီးပေးပါတယ်။ View ဖန်တီးဖို့ `*` ကို သုံးခဲ့ပေမယ့် — နောက်ပိုင်းမှာ table ထဲကို ထည့်လိုက်တဲ့ column တွေကတော့ view ထဲမှာ ပါဝင်မှာ မဟုတ်ပါဘူး။

`LOCAL CHECK OPTION` နဲ့ view တစ်ခု ဖန်တီးခြင်း:

```sql
CREATE VIEW universal_comedies AS
    SELECT *
    FROM comedies
    WHERE classification = 'U'
    WITH LOCAL CHECK OPTION;
```

ဒါက `comedies` view ကို အခြေခံပြီး — `kind = 'Comedy'` ရော `classification = 'U'` ပါ ရှိတဲ့ ဇာတ်ကားတွေကိုပဲ ပြတဲ့ view တစ်ခုကို ဖန်တီးပါတယ်။ Row အသစ်တစ်ခုမှာ `classification = 'U'` မရှိဘူးဆိုရင် — view ထဲကို `INSERT` ဒါမှမဟုတ် `UPDATE` လုပ်ဖို့ ကြိုးစားမှု တိုင်းကို ပယ်ချပါလိမ့်မယ် — ဒါပေမယ့် ဇာတ်ကားရဲ့ `kind` ကိုတော့ မစစ်ဆေးပါဘူး။

`CASCADED CHECK OPTION` နဲ့ view တစ်ခု ဖန်တီးခြင်း:

```sql
CREATE VIEW pg_comedies AS
    SELECT *
    FROM comedies
    WHERE classification = 'PG'
    WITH CASCADED CHECK OPTION;
```

ဒါက — row အသစ်တွေရဲ့ `kind` ရော `classification` ရော နှစ်ခုလုံးကို စစ်ဆေးတဲ့ view တစ်ခုကို ဖန်တီးပါတယ်။

Updatable နဲ့ non-updatable column တွေ ရောနှောပါတဲ့ view တစ်ခု ဖန်တီးခြင်း:

```sql
CREATE VIEW comedies AS
    SELECT f.*,
           country_code_to_name(f.country_code) AS country,
           (SELECT avg(r.rating)
            FROM user_ratings r
            WHERE r.film_id = f.id) AS avg_rating
    FROM films f
    WHERE f.kind = 'Comedy';
```

ဒီ view က `INSERT`, `UPDATE` နဲ့ `DELETE` တွေကို ထောက်ပံ့ပါလိမ့်မယ်။ `films` table ကနေ လာတဲ့ column တွေ အားလုံး updatable ဖြစ်ပြီး — တွက်ချက်ထားတဲ့ `country` နဲ့ `avg_rating` column တွေကတော့ read-only ဖြစ်ပါလိမ့်မယ်။

1 ကနေ 100 အထိ ဂဏန်းတွေ ပါဝင်တဲ့ recursive view တစ်ခု ဖန်တီးခြင်း:

```sql
CREATE RECURSIVE VIEW public.nums_1_100 (n) AS
    VALUES (1)
UNION ALL
    SELECT n+1 FROM nums_1_100 WHERE n < 100;
```

ဒီ `CREATE` ထဲမှာ recursive view ရဲ့ နာမည်က schema-qualified ဖြစ်ပေမယ့် — သူ့ရဲ့ အတွင်းပိုင်း self-reference ကတော့ schema-qualified မဟုတ်ဘူးဆိုတာ သတိပြုပါ။ ဒါက — implicitly ဖန်တီးလိုက်တဲ့ CTE ရဲ့ နာမည်ကို schema-qualified လုပ်လို့ မရလို့ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

`CREATE OR REPLACE VIEW` က PostgreSQL language extension တစ်ခု ဖြစ်ပါတယ်။ Temporary view ဆိုတဲ့ သဘောတရားလည်း အဲဒီလိုပဲ ဖြစ်ပါတယ်။ `WITH ( ... )` clause ရော — security barrier views တွေရော security invoker views တွေရောပါ — extension တွေပဲ ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER VIEW](/docs/postgresql/sql-alterview), [DROP VIEW](/docs/postgresql/sql-dropview), [CREATE MATERIALIZED VIEW](https://www.postgresql.org/docs/current/sql-creatematerializedview.html)
