---
title: "DO (anonymous code block တစ်ခု လုပ်ဆောင်ခြင်း)"
description: "Procedural language နဲ့ ရေးသားထားတဲ့ anonymous code block (အမည်မဖော်ပြသော code block) တစ်ခုကို execute လုပ်ပေးတဲ့ command — parameters မရှိတဲ့ function တစ်ခုရဲ့ body လိုမျိုး တစ်ကြိမ်တည်း parse လုပ်ပြီး execute လုပ်ကာ — code block ကို string literal အဖြစ် သတ်မှတ်ပုံ၊ LANGUAGE clause နေရာချမှုနှင့် လိုအပ်သော privileges များအကြောင်း ဖော်ပြထားသည်"
order: 198
source: "https://www.postgresql.org/docs/current/sql-do.html"
status: translated
updated: 2026-09-04
---

## DO (anonymous code block တစ်ခု လုပ်ဆောင်ခြင်း)

DO — anonymous code block တစ်ခုကို execute လုပ်ပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DO [ LANGUAGE lang_name ] code
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DO` က — procedural language တစ်ခုနဲ့ ရေးထားတဲ့ anonymous code block တစ်ခုကို execute လုပ်ပါတယ် — တနည်းအားဖြင့် — procedural language ထဲက transient (ယာယီ) anonymous function တစ်ခုကို execute လုပ်တာလို့ ဆိုနိုင်ပါတယ်။

Code block ကို — parameters မရှိတဲ့ — `void` ပြန်ပေးတဲ့ function တစ်ခုရဲ့ body လိုမျိုး သဘောထားပါတယ်။ ၎င်းကို တစ်ကြိမ်တည်းပဲ parse လုပ်ပြီး execute လုပ်ပါတယ်။

Optional ဖြစ်တဲ့ `LANGUAGE` clause ကို — code block ရဲ့ ရှေ့မှာ ဒါမှမဟုတ် နောက်မှာ — ရေးလို့ ရပါတယ်။

## Parameters (parameter များ)

- **code** — execute လုပ်ရမယ့် procedural language code။ ဒါကို `CREATE FUNCTION` မှာလိုပဲ — string literal အဖြစ် သေချာပေါက် သတ်မှတ်ပေးရပါမယ်။ Dollar-quoted literal (dollar sign နဲ့ ကာရံထားတဲ့ literal) ကို သုံးဖို့ အကြံပြုပါတယ်။
- **lang_name** — code ကို ရေးထားတဲ့ procedural language ရဲ့ နာမည်။ ချန်လိုက်ခဲ့ရင် — default ကတော့ plpgsql ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

သုံးစွဲရမယ့် procedural language က — `CREATE EXTENSION` ကနေတစ်ဆင့် — current database ထဲကို ကြိုတင် install လုပ်ပြီးသား ဖြစ်နေရပါမယ်။ `plpgsql` က default အနေနဲ့ install လုပ်ပြီးသား ဖြစ်ပေမယ့် — တခြား language တွေကတော့ မဟုတ်ပါဘူး။

User က — procedural language အပေါ်မှာ `USAGE` privilege ရှိရပါမယ် — ဒါမှမဟုတ် — language က untrusted (ယုံကြည်စိတ်ချရမှု မရှိ) ဖြစ်နေရင် — user က superuser ဖြစ်ရပါမယ်။ ဒါက — အဲဒီ language နဲ့ function တစ်ခုကို ဖန်တီးတဲ့အခါ လိုအပ်တဲ့ privilege သတ်မှတ်ချက်နဲ့ အတူတူပဲ ဖြစ်ပါတယ်။

`DO` ကို transaction block တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်ရင် — procedure code ထဲမှာ transaction control statements တွေကို execute လုပ်လို့ မရပါဘူး။ `DO` ကို ကိုယ်ပိုင် transaction တစ်ခုအနေနဲ့ execute လုပ်မှသာ — transaction control statements တွေကို ခွင့်ပြုပါတယ်။

## Examples (ဥပမာများ)

Schema `public` ထဲက views တွေ အားလုံးပေါ်မှာ privileges တွေ အားလုံးကို role `webuser` ဆီ grant လုပ်ဖို့:

```sql
DO $$DECLARE r record;
BEGIN
    FOR r IN SELECT table_schema, table_name FROM information_schema.tables
             WHERE table_type = 'VIEW' AND table_schema = 'public'
    LOOP
        EXECUTE 'GRANT ALL ON ' || quote_ident(r.table_schema) || '.' || quote_ident(r.table_name) || ' TO webuser';
    END LOOP;
END$$;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard မှာ `DO` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE LANGUAGE](https://www.postgresql.org/docs/current/sql-createlanguage.html)
