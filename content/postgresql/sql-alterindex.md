---
title: "ALTER INDEX (index တစ်ခုကို ပြောင်းလဲခြင်း)"
description: "Index တစ်ခုရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက် (definition) ကို ပြောင်းလဲပေးတဲ့ command — RENAME, SET TABLESPACE, ATTACH PARTITION, DEPENDS ON EXTENSION, storage parameters များ သတ်မှတ်/ပြန်လည်သတ်မှတ်ခြင်း နှင့် per-column statistics target သတ်မှတ်ခြင်း အပါအဝင် subforms (ပုံစံကွဲများ) အများအပြား ပါဝင်ပြီး — ALTER TABLE ၏ index များနှင့် သက်ဆိုင်သည့် ပုံစံများအတွက် alias တစ်ခုလည်း ဖြစ်သည်"
order: 177
source: "https://www.postgresql.org/docs/current/sql-alterindex.html"
status: translated
updated: 2026-09-04
---

## ALTER INDEX (index တစ်ခုကို ပြောင်းလဲခြင်း)

ALTER INDEX — index တစ်ခုရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက် (definition) ကို ပြောင်းလဲပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER INDEX [ IF EXISTS ] name RENAME TO new_name
ALTER INDEX [ IF EXISTS ] name SET TABLESPACE tablespace_name
ALTER INDEX name ATTACH PARTITION index_name
ALTER INDEX name [ NO ] DEPENDS ON EXTENSION extension_name
ALTER INDEX [ IF EXISTS ] name SET ( storage_parameter [= value] [, ... ] )
ALTER INDEX [ IF EXISTS ] name RESET ( storage_parameter [, ... ] )
ALTER INDEX [ IF EXISTS ] name ALTER [ COLUMN ] column_number
    SET STATISTICS integer
ALTER INDEX ALL IN TABLESPACE name [ OWNED BY role_name [, ... ] ]
    SET TABLESPACE new_tablespace [ NOWAIT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER INDEX` က တည်ရှိပြီးသား index တစ်ခုရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်ကို ပြောင်းလဲပေးပါတယ်။ အောက်မှာ ဖော်ပြထားတဲ့ subforms (ပုံစံကွဲများ) အများအပြား ရှိပါတယ်။ Subform တစ်ခုချင်းစီအတွက် လိုအပ်တဲ့ lock အဆင့် (lock level) က ကွဲပြားနိုင်တယ်ဆိုတာ သတိပြုပါ။ သီးခြား ဖော်ပြထားခြင်း မရှိရင် `ACCESS EXCLUSIVE` lock တစ်ခုကို ကိုင်ထားပါတယ်။ Subcommands အများအပြား စာရင်းပြုလုပ်ထားတဲ့အခါ — ကိုင်ထားတဲ့ lock က — subcommand တစ်ခုခုကနေ လိုအပ်တဲ့ lock တွေထဲက — အကြပ်ဆုံး (strictest) တစ်ခု ဖြစ်ပါလိမ့်မယ်။

- **RENAME** — RENAME ပုံစံက index ရဲ့ နာမည်ကို ပြောင်းလဲပေးပါတယ်။ Index က table constraint တစ်ခု (UNIQUE, PRIMARY KEY သို့မဟုတ် EXCLUDE ဖြစ်စေ) နဲ့ ဆက်စပ်နေရင် — အဲဒီ constraint ကိုပါ တစ်ပါတည်း နာမည်ပြောင်းပေးပါတယ်။ သိမ်းဆည်းထားတဲ့ ဒေတာပေါ်မှာတော့ သက်ရောက်မှု မရှိပါဘူး။
  Index တစ်ခုကို နာမည်ပြောင်းခြင်းက SHARE UPDATE EXCLUSIVE lock တစ်ခုကို ရယူပါတယ်။
- **SET TABLESPACE** — ဒီပုံစံက index ရဲ့ tablespace ကို သတ်မှတ်ထားတဲ့ tablespace အဖြစ် ပြောင်းလဲပြီး — index နဲ့ ဆက်စပ်နေတဲ့ data file(s) တွေကို tablespace အသစ်ဆီ ရွှေ့ပြောင်းပေးပါတယ်။ Index တစ်ခုရဲ့ tablespace ကို ပြောင်းလဲဖို့အတွက် — သင်ဟာ index ကို ပိုင်ဆိုင်ရပြီး — tablespace အသစ်ပေါ်မှာ CREATE privilege ရှိရပါမယ်။ Current database ထဲက tablespace တစ်ခုအတွင်းရှိ index တွေ အားလုံးကို — ALL IN TABLESPACE ပုံစံကို သုံးပြီး ရွှေ့ပြောင်းနိုင်ပါတယ်; ဒီပုံစံက ရွှေ့ပြောင်းရမယ့် index တွေ အားလုံးကို lock လုပ်ပြီးမှ — တစ်ခုချင်းစီကို ရွှေ့ပြောင်းပေးပါတယ်။ ဒီပုံစံမှာ OWNED BY ကိုလည်း ထောက်ပံ့ပေးပြီး — သတ်မှတ်ထားတဲ့ roles တွေ ပိုင်ဆိုင်တဲ့ index တွေကိုပဲ ရွှေ့ပြောင်းပေးမှာ ဖြစ်ပါတယ်။ NOWAIT option ကို သတ်မှတ်ထားရင် — လိုအပ်တဲ့ locks တွေ အားလုံးကို ချက်ချင်း ရယူနိုင်ခြင်း မရှိရင် — command က မအောင်မြင်ဘဲ ရှုံးနိမ့်သွားပါလိမ့်မယ်။ System catalogs တွေကိုတော့ ဒီ command နဲ့ ရွှေ့ပြောင်းပေးမှာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ; လိုအပ်ရင် ဒီအစား ALTER DATABASE သို့မဟုတ် တိုက်ရိုက် ALTER INDEX ခေါ်ဆိုမှုတွေကို သုံးပါ။ CREATE TABLESPACE ကိုလည်း ကြည့်ရှုပါ။
- **ATTACH PARTITION index_name** — နာမည်ပေးထားတဲ့ index (schema-qualified ဖြစ်နိုင်) ကို — ပြောင်းလဲနေတဲ့ index ဆီ ပူးတွဲ (attach) ဖြစ်သွားစေပါတယ်။ နာမည်ပေးထားတဲ့ index က — ပြောင်းလဲနေတဲ့ index ပါဝင်တဲ့ table ရဲ့ partition တစ်ခုပေါ်မှာ တည်ရှိရပြီး — ညီမျှတဲ့ (equivalent) အဓိပ္ပာယ်ဖွင့်ဆိုချက် ရှိရပါမယ်။ Attach လုပ်ထားတဲ့ index ကို သူ့ဘာသာ သီးခြား drop လုပ်လို့ မရပါဘူး; သူ့ရဲ့ parent index ကို drop လုပ်လိုက်ရင် — အလိုအလျောက် drop လုပ်ခံရမှာ ဖြစ်ပါတယ်။
  နာမည်ပေးထားတဲ့ index က — ပြောင်းလဲနေတဲ့ index ဆီ ကြိုပြီး attach ဖြစ်နေပြီးသားဆိုရင် — parent က လောလောဆယ် invalid ဖြစ်နေတယ်ဆိုရင် — command က parent index ကို validate (စိစစ်) လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။
- **DEPENDS ON EXTENSION extension_name / NO DEPENDS ON EXTENSION extension_name** — ဒီပုံစံက index ကို extension ပေါ်မှာ မှီခိုသည်ဟု မှတ်သားပေးပါတယ် — NO ကို သတ်မှတ်ထားရင်တော့ — အဲဒီ extension ပေါ်မှာ မှီခိုနေတော့တာ မဟုတ်တော့ဘူးလို့ မှတ်သားပေးပါတယ်။ Extension ပေါ်မှာ မှီခိုသည်ဟု မှတ်သားထားတဲ့ index တစ်ခုက — အဲဒီ extension ကို drop လုပ်လိုက်တဲ့အခါ — အလိုအလျောက် drop လုပ်ခံရပါတယ်။
- **SET ( storage_parameter [= value] [, ... ] )** — ဒီပုံစံက index အတွက် index-method-specific ဖြစ်တဲ့ storage parameters တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုကို ပြောင်းလဲပေးပါတယ်။ ရရှိနိုင်တဲ့ parameters တွေရဲ့ အသေးစိတ်အတွက် CREATE INDEX ကို ကြည့်ပါ။ Index ရဲ့ ပါဝင်မှုတွေ (contents) ကို ဒီ command နဲ့ ချက်ချင်း ပြုပြင်မွမ်းမံမှာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ; parameter ပေါ် မူတည်ပြီး — လိုချင်တဲ့ သက်ရောက်မှုတွေ ရရှိဖို့ — index ကို REINDEX နဲ့ ပြန်လည်တည်ဆောက် (rebuild) လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။
- **RESET ( storage_parameter [, ... ] )** — ဒီပုံစံက index-method-specific ဖြစ်တဲ့ storage parameters တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုကို သူတို့ရဲ့ default တန်ဖိုးတွေဆီ ပြန်လည်သတ်မှတ်ပေးပါတယ်။ `SET` မှာ ရှိသလိုပဲ — index တစ်ခုလုံးကို update လုပ်ဖို့ REINDEX တစ်ခု လိုအပ်နိုင်ပါတယ်။
- **ALTER [ COLUMN ] column_number SET STATISTICS integer** — ဒီပုံစံက — နောက်ပိုင်း `ANALYZE` operations တွေအတွက် — per-column statistics-gathering target (ကော်လံအလိုက် စာရင်းအင်း စုဆောင်းမှု ပစ်မှတ်) ကို သတ်မှတ်ပေးပါတယ်; ဒါပေမယ့် expression တစ်ခုအနေနဲ့ သတ်မှတ်ထားတဲ့ index columns တွေပေါ်မှာပဲ သုံးနိုင်ပါတယ်။ Expressions တွေမှာ ထူးခြားတဲ့ (unique) နာမည် မရှိတာမို့ — သူတို့ကို index column ရဲ့ ordinal number (စဉ်ဆက်နံပါတ်) ကို သုံးပြီး ရည်ညွှန်းပါတယ်။ Target ကို 0 ကနေ 10000 အကွာအဝေးအတွင်း သတ်မှတ်နိုင်ပါတယ်; တစ်နည်းအားဖြင့် — system ရဲ့ default statistics target (`default_statistics_target`) ကို ပြန်လည် အသုံးပြုဖို့ — -1 လို့ သတ်မှတ်နိုင်ပါတယ်။ PostgreSQL query planner က statistics တွေကို အသုံးပြုပုံနဲ့ ပတ်သက်တဲ့ နောက်ထပ် အချက်အလက်တွေအတွက် — အပိုင်း 14.2 ကို ကြည့်ပါ။

## Parameters (parameter များ)

- **IF EXISTS** — Index မရှိဘူးဆိုရင် error တစ်ခု ထုတ်မပေးပါဘူး။ ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **column_number** — Ordinal number က index column ရဲ့ ordinal (ဘယ်ကနေ ညာသို့) နေရာကို ရည်ညွှန်းပါတယ်။
- **name** — ပြောင်းလဲရမယ့် တည်ရှိပြီးသား index တစ်ခုရဲ့ နာမည် (schema-qualified ဖြစ်နိုင်)။
- **new_name** — Index အတွက် နာမည်အသစ်။
- **tablespace_name** — Index ကို ရွှေ့ပြောင်းမယ့် tablespace။
- **extension_name** — Index က မှီခိုရမယ့် extension ရဲ့ နာမည်။
- **storage_parameter** — Index-method-specific ဖြစ်တဲ့ storage parameter တစ်ခုရဲ့ နာမည်။
- **value** — Index-method-specific ဖြစ်တဲ့ storage parameter တစ်ခုအတွက် တန်ဖိုးအသစ်။ Parameter ပေါ် မူတည်ပြီး — နံပါတ် သို့မဟုတ် စကားလုံး (word) တစ်ခု ဖြစ်နိုင်ပါတယ်။

## Notes (မှတ်စုများ)

ဒီ operations တွေကို [`ALTER TABLE`](https://www.postgresql.org/docs/current/sql-altertable.html) သုံးပြီးလည်း လုပ်ဆောင်နိုင်ပါတယ်။ `ALTER INDEX` ဆိုတာ တကယ်တော့ — indexes တွေနဲ့ သက်ဆိုင်တဲ့ `ALTER TABLE` ပုံစံတွေအတွက် alias တစ်ခုသာ ဖြစ်ပါတယ်။

အရင်က `ALTER INDEX OWNER` variant တစ်ခု ရှိခဲ့ပေမယ့် — အခုတော့ ဒါကို လျစ်လျူရှုထားပါတယ် (warning တစ်ခုနဲ့အတူ)။ Index တစ်ခုက — သူ့ရဲ့ table ရဲ့ owner နဲ့ မတူညီတဲ့ owner တစ်ယောက် မရှိနိုင်ပါဘူး။ Table ရဲ့ owner ကို ပြောင်းလဲခြင်းက index ကိုပါ အလိုအလျောက် ပြောင်းလဲစေပါတယ်။

System catalog index တစ်ခုရဲ့ ဘယ်အစိတ်အပိုင်းကိုမဆို ပြောင်းလဲခြင်းကို ခွင့်မပြုပါဘူး။

## Examples (ဥပမာများ)

တည်ရှိပြီးသား index တစ်ခုကို နာမည်ပြောင်းဖို့:

```sql
ALTER INDEX distributors RENAME TO suppliers;
```

Index တစ်ခုကို တခြား tablespace တစ်ခုဆီ ရွှေ့ပြောင်းဖို့:

```sql
ALTER INDEX distributors SET TABLESPACE fasttablespace;
```

Index တစ်ခုရဲ့ fill factor ကို ပြောင်းလဲဖို့ (index method က ၎င်းကို ထောက်ပံ့တယ်လို့ ယူဆပြီး):

```sql
ALTER INDEX distributors SET (fillfactor = 75);
REINDEX INDEX distributors;
```

Expression index တစ်ခုအတွက် statistics-gathering target ကို သတ်မှတ်ဖို့:

```sql
CREATE INDEX coord_idx ON measured (x, y, (z + t));
ALTER INDEX coord_idx ALTER COLUMN 3 SET STATISTICS 1000;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER INDEX` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE INDEX](/docs/postgresql/sql-createindex), [REINDEX](/docs/postgresql/sql-reindex)
