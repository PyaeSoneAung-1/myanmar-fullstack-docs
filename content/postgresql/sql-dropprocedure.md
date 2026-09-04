---
title: "DROP PROCEDURE (procedure တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "ရှိပြီးသား procedure တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုသော procedures များ၏ definition ကို ဖယ်ရှားပေးသည့် command — IF EXISTS, argument list ဖြင့် procedure ရှာဖွေပုံ (input arguments များသာ ဖော်ပြခြင်း လုံလောက်ခြင်း၊ argmode မပါသော list များတွင် ambiguity ဖြစ်နိုင်ခြေ)၊ CASCADE/RESTRICT များအပြင် SQL standard ၏ extensions များအကြောင်း ဖော်ပြထားသည်"
order: 224
source: "https://www.postgresql.org/docs/current/sql-dropprocedure.html"
status: translated
updated: 2026-09-04
---

## DROP PROCEDURE (procedure တစ်ခုကို ဖယ်ရှားခြင်း)

DROP PROCEDURE — procedure တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP PROCEDURE [ IF EXISTS ] name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ] [, ...]
    [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP PROCEDURE` က ရှိပြီးသား procedure တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုသော procedures တွေရဲ့ definition ကို ဖယ်ရှားပေးပါတယ်။ ဒီ command ကို execute လုပ်ဖို့ — procedure(s) တွေရဲ့ owner ဖြစ်ရပါမယ်။ Procedure(s) တွေရဲ့ argument types တွေကို ပုံမှန်အားဖြင့် သတ်မှတ်ပေးရပါတယ် — နာမည်တူပြီး argument lists တွေ မတူညီတဲ့ procedures အများအပြား တည်ရှိနိုင်လို့ပါ။

## Parameters (parameter များ)

- **IF EXISTS** — Procedure မရှိဘူးဆိုရင် — error တစ်ခု ပစ်မချပါဘူး။ ဒီလို အခြေအနေမှာ notice (အသိပေး မှတ်ချက်) တစ်ခုကို ထုတ်ပေးပါတယ်။
- **name** — ရှိပြီးသား procedure တစ်ခုရဲ့ နာမည် (option အရ schema-qualified လုပ်ထားနိုင်သည်)။
- **argmode** — Argument တစ်ခုရဲ့ mode: IN, OUT, INOUT သို့မဟုတ် VARIADIC။ ချန်လိုက်ခဲ့ရင် — default ကတော့ IN ဖြစ်ပါတယ် (ဒါပေမယ့် — အောက်မှာ ကြည့်ပါ)။
- **argname** — Argument တစ်ခုရဲ့ နာမည်။ `DROP PROCEDURE` က argument names တွေကို တကယ်တော့ ဂရုမစိုက်ဘူးဆိုတာ သတိပြုပါ — procedure ရဲ့ identity ကို ဆုံးဖြတ်ရာမှာ argument data types တွေကိုပဲ သုံးလို့ပါ။
- **argtype** — Procedure ရဲ့ arguments တွေရဲ့ data type(s) (option အရ schema-qualified လုပ်ထားနိုင်သည်) — ရှိရင် ဖြစ်ပါတယ်။ အသေးစိတ်အတွက် အောက်မှာ ကြည့်ပါ။
- **CASCADE** — Procedure အပေါ် dependent ဖြစ်နေတဲ့ objects တွေကို အလိုအလျောက် drop လုပ်ပြီး — ၎င်းတို့အပေါ် dependent ဖြစ်နေတဲ့ objects တွေ အားလုံးကိုပါ — အလှည့်ကျ ဆက်ပြီး drop လုပ်ပါတယ် (အပိုင်း 5.15 ကို ကြည့်ပါ)။
- **RESTRICT** — Procedure အပေါ် dependent ဖြစ်နေတဲ့ objects တစ်စုံတစ်ရာ ရှိနေရင် — procedure ကို drop လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါကတော့ default ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

ပေးထားတဲ့ နာမည်နဲ့ procedure တစ်ခုတည်းသာ ရှိနေရင် — argument list ကို ချန်လိုက်လို့ ရပါတယ်။ ဒီကိစ္စမှာ parentheses တွေကိုပါ ချန်လိုက်ပါ။

PostgreSQL မှာ — နာမည်တူ routines နှစ်ခုက input-argument list တူညီခွင့် မရှိတာကြောင့် — input arguments (INOUT အပါအဝင်) တွေကိုပဲ စာရင်းပြုစုရင် လုံလောက်ပါတယ်။ ဒါ့အပြင် — `DROP` command က — `OUT` arguments တွေရဲ့ types တွေကို မှန်ကန်စွာ ရေးထားလား ဆိုတာကို တကယ်တော့ စစ်ဆေးမှာ မဟုတ်ပါဘူး; ဒါကြောင့် — `OUT` အဖြစ် အတိအကျ အမှတ်အသား လုပ်ထားတဲ့ arguments တွေဟာ အဓိပ္ပာယ် မရှိတဲ့ ဖြည့်စွက်ချက် (noise) သက်သက်ပဲ ဖြစ်ပါတယ်။ ဒါပေမယ့် — ကိုက်ညီတဲ့ `CREATE` command နဲ့ တစ်ပြေးညီ ဖြစ်စေဖို့ဆိုရင် — အဲဒါတွေကို ရေးသားတာက အကြံပြုထိုက်ပါတယ်။

SQL standard နဲ့ လိုက်ဖက်ညီမှုအတွက် — argument data types တွေ အားလုံးကို (OUT arguments တွေရဲ့ types တွေ အပါအဝင်) — argmode markers တစ်ခုမှ မပါဘဲ ရေးခွင့်လည်း ရှိပါတယ်။ ဒီလို လုပ်တဲ့အခါ — procedure ရဲ့ `OUT` argument(s) တွေရဲ့ types တွေကို command နဲ့ စိစစ် (verify) လုပ်ပါလိမ့်မယ်။ ဒီ ပြဋ္ဌာန်းချက်က — argument list ထဲမှာ argmode markers တွေ မပါဝင်တဲ့အခါ — ဘယ် rule ကို ရည်ရွယ်ထားလဲဆိုတာ မရှင်းလင်းတာကြောင့် — ambiguity (မရှင်းလင်းမှု) တစ်ခုကို ဖန်တီးပေးပါတယ်။ `DROP` command က lookup ကို နည်းလမ်း နှစ်မျိုးလုံးနဲ့ ကြိုးစားပြီး — procedure မတူညီတဲ့ နှစ်ခုကို တွေ့ရှိရင် — error တစ်ခု ပစ်ချပါလိမ့်မယ်။ ဒီလို ambiguity ဖြစ်နိုင်ခြေ အန္တရာယ်ကို ရှောင်ဖို့ — `IN` markers တွေကို default အတိုင်း ချန်မထားဘဲ — အတိအကျ ရေးသားပြီး — ဒါအားဖြင့် — ရိုးရာ (traditional) PostgreSQL interpretation ကိုပဲ သုံးစေဖို့ အကြံပြုပါတယ်။

အခုလေး ရှင်းပြခဲ့တဲ့ lookup rules တွေကို — ရှိပြီးသား procedures တွေအပေါ် လုပ်ဆောင်တဲ့ — `ALTER PROCEDURE` နဲ့ `COMMENT ON PROCEDURE` လို — တခြား commands တွေမှာလည်း သုံးပါတယ်။

## Examples (ဥပမာများ)

`do_db_maintenance` ဆိုတဲ့ procedure တစ်ခုတည်းသာ ရှိနေရင် — ဒီ command က ၎င်းကို drop လုပ်ဖို့ လုံလောက်ပါတယ်:

```sql
DROP PROCEDURE do_db_maintenance;
```

ဒီ procedure definition ကို ပေးထားတယ်ဆိုပါစို့:

```sql
CREATE PROCEDURE do_db_maintenance(IN target_schema text, OUT results text) ...
```

ဒီ commands တွေထဲက ဘယ်ဟာမဆို — ၎င်းကို drop လုပ်ဖို့ အလုပ်လုပ်ပါလိမ့်မယ်:

```sql
DROP PROCEDURE do_db_maintenance(IN target_schema text, OUT results text);
DROP PROCEDURE do_db_maintenance(IN text, OUT text);
DROP PROCEDURE do_db_maintenance(IN text);
DROP PROCEDURE do_db_maintenance(text);
DROP PROCEDURE do_db_maintenance(text, text);  -- potentially ambiguous
```

ဒါပေမယ့် — ဥပမာအားဖြင့် — ဒီလိုဟာလည်း တည်ရှိနေရင်တော့ နောက်ဆုံး ဥပမာက ambiguous (မရှင်းလင်း) ဖြစ်ပါလိမ့်မယ်:

```sql
CREATE PROCEDURE do_db_maintenance(IN target_schema text, IN options text) ...
```

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ command က SQL standard နဲ့ ကိုက်ညီပါတယ် — အောက်ပါ PostgreSQL extensions တွေနဲ့အတူ:

- Standard က command တစ်ခုမှာ procedure တစ်ခုတည်းကိုပဲ drop လုပ်ခွင့် ပြုပါတယ်။
- IF EXISTS option က extension တစ်ခု ဖြစ်ပါတယ်။
- Argument modes နဲ့ names တွေကို သတ်မှတ်နိုင်တာက extension တစ်ခု ဖြစ်ပြီး — modes တွေ ပေးထားတဲ့အခါ — lookup rules တွေ ကွဲပြားပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE PROCEDURE](/docs/postgresql/sql-createprocedure), [ALTER PROCEDURE](/docs/postgresql/sql-alterprocedure), [DROP FUNCTION](/docs/postgresql/sql-dropfunction), [DROP ROUTINE](/docs/postgresql/sql-droproutine)
