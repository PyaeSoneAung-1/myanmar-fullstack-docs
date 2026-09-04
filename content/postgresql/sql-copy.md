---
title: "COPY (file နှင့် table အကြား data ကူးပြောင်းခြင်း)"
description: "File တစ်ခုနဲ့ PostgreSQL table အကြား data တွေ ကူးပြောင်းပေးတဲ့ command — COPY FROM/COPY TO နဲ့ FORMAT (text, csv, binary), FREEZE, DELIMITER, NULL, DEFAULT, HEADER, FORCE_QUOTE, ON_ERROR, REJECT_LIMIT, ENCODING, WHERE စတဲ့ options များ — file formats (text, CSV, binary) အသေးစိတ် ရှင်းလင်းချက်တွေလည်း ပါဝင်"
order: 157
source: "https://www.postgresql.org/docs/current/sql-copy.html"
status: translated
updated: 2026-09-04
---

## COPY (file နှင့် table အကြား data ကူးပြောင်းခြင်း)

COPY — file တစ်ခုနဲ့ table တစ်ခုကြားမှာ data တွေကို ကူးပြောင်းပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
COPY table_name [ ( column_name [, ...] ) ]
    FROM { 'filename' | PROGRAM 'command' | STDIN }
    [ [ WITH ] ( option [, ...] ) ]
    [ WHERE condition ]

COPY { table_name [ ( column_name [, ...] ) ] | ( query ) }
    TO { 'filename' | PROGRAM 'command' | STDOUT }
    [ [ WITH ] ( option [, ...] ) ]

where option can be one of:

    FORMAT format_name
    FREEZE [ boolean ]
    DELIMITER 'delimiter_character'
    NULL 'null_string'
    DEFAULT 'default_string'
    HEADER [ boolean | MATCH ]
    QUOTE 'quote_character'
    ESCAPE 'escape_character'
    FORCE_QUOTE { ( column_name [, ...] ) | * }
    FORCE_NOT_NULL { ( column_name [, ...] ) | * }
    FORCE_NULL { ( column_name [, ...] ) | * }
    ON_ERROR error_action
    REJECT_LIMIT maxerror
    ENCODING 'encoding_name'
    LOG_VERBOSITY verbosity
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`COPY` က PostgreSQL tables တွေနဲ့ standard file-system files တွေကြားမှာ data တွေကို ရွှေ့ပြောင်းပေးပါတယ်။ `COPY TO` က table တစ်ခုရဲ့ အကြောင်းအရာတွေကို file တစ်ခုဆီ ကူးပေးပြီး — `COPY FROM` ကတော့ file တစ်ခုကနေ table တစ်ခုဆီ data တွေကို ကူးပေးပါတယ် (table ထဲမှာ ရှိပြီးသား data တွေရဲ့ နောက်မှာ ထပ်ဖြည့်ပေးတာပါ)။ `COPY TO` က `SELECT` query တစ်ခုရဲ့ ရလဒ်တွေကိုလည်း ကူးယူလို့ ရပါတယ်။

Column list တစ်ခု သတ်မှတ်ထားရင် — `COPY TO` က သတ်မှတ်ထားတဲ့ columns တွေထဲက data တွေကိုပဲ file ဆီ ကူးပေးပါတယ်။ `COPY FROM` အတွက်ကတော့ — file ထဲက field တစ်ခုချင်းစီကို သတ်မှတ်ထားတဲ့ column ထဲကို အစဉ်လိုက် insert လုပ်ပါတယ်။ `COPY FROM` ရဲ့ column list ထဲမှာ မပါဝင်တဲ့ table columns တွေကတော့ သူတို့ရဲ့ default values တွေကို ရရှိပါလိမ့်မယ်။

File နာမည် တစ်ခုနဲ့အတူ `COPY` ကို သုံးရင် — PostgreSQL server က file တစ်ခုကနေ တိုက်ရိုက် ဖတ်ဖို့ ဒါမှမဟုတ် file တစ်ခုဆီ တိုက်ရိုက် ရေးဖို့ ညွှန်ကြားချက် ရပါတယ်။ အဲဒီ file ကို PostgreSQL user (server က run နေတဲ့ user ID) က ဝင်ရောက်နိုင်ရပါမယ် — ပြီးတော့ နာမည်ကို server ရဲ့ ရှုထောင့်ကနေ သတ်မှတ်ရပါမယ်။ `PROGRAM` ကို သတ်မှတ်ထားရင် — server က ပေးထားတဲ့ command ကို execute လုပ်ပြီး — program ရဲ့ standard output ကနေ ဖတ်ပါတယ်၊ ဒါမှမဟုတ် program ရဲ့ standard input ဆီ ရေးပါတယ်။ Command ကို server ရဲ့ ရှုထောင့်ကနေ သတ်မှတ်ရပြီး — PostgreSQL user က execute လုပ်နိုင်ရပါမယ်။ `STDIN` ဒါမှမဟုတ် `STDOUT` ကို သတ်မှတ်ထားရင် — data တွေကို client နဲ့ server ကြားက connection ကနေ ပို့လွှတ်ပါတယ်။

`COPY` ကို run နေတဲ့ backend တစ်ခုချင်းစီက သူ့ရဲ့ တိုးတက်မှု (progress) ကို `pg_stat_progress_copy` view ထဲမှာ အစီရင်ခံပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 27.4.3](https://www.postgresql.org/docs/current/progress-reporting.html#COPY-PROGRESS-REPORTING) ကို ကြည့်ပါ။

Default အနေနဲ့ — process လုပ်နေစဉ်မှာ error တစ်ခု ကြုံရင် `COPY` က မအောင်မြင်ပါဘူး။ File တစ်ခုလုံးကို အကောင်းဆုံး ကြိုးစား (best-effort) load လုပ်ချင်တဲ့ use case တွေအတွက် — တခြား အပြုအမူတစ်ခုခုကို သတ်မှတ်ဖို့ `ON_ERROR` clause ကို သုံးနိုင်ပါတယ်။

## Parameters (parameter များ)

- **table_name** — ရှိပြီးသား table တစ်ခုရဲ့ နာမည် (schema-qualified ဖြစ်နိုင်သည်)။
- **column_name** — ကူးယူရမယ့် columns တွေရဲ့ optional စာရင်း။ Column list မသတ်မှတ်ထားရင် — generated columns တွေကလွဲလို့ — table ရဲ့ column အားလုံးကို ကူးယူပါလိမ့်မယ်။
- **query** — ရလဒ်တွေကို ကူးယူရမယ့် SELECT, VALUES, INSERT, UPDATE, DELETE ဒါမှမဟုတ် MERGE command တစ်ခု။ Query ပတ်လည်မှာ parentheses တွေ လိုအပ်တယ်ဆိုတာ သတိပြုပါ။
INSERT, UPDATE, DELETE နဲ့ MERGE queries တွေအတွက် — RETURNING clause တစ်ခု ပေးရပါမယ် — ပြီးတော့ target relation မှာ conditional rule တစ်ခုခု၊ ALSO rule တစ်ခုခု ဒါမှမဟုတ် statement အများအပြားအထိ ချဲ့ထွင်နိုင်တဲ့ INSTEAD rule တစ်ခုခု မရှိရပါဘူး။
- **filename** — Input ဒါမှမဟုတ် output file ရဲ့ path name။ Input file name က absolute ဒါမှမဟုတ် relative path ဖြစ်နိုင်ပေမယ့် — output file name ကတော့ absolute path ဖြစ်ရပါမယ်။ Windows user တွေအနေနဲ့ — path name ထဲမှာ သုံးထားတဲ့ backslash တွေကို နှစ်ဆ လုပ်ဖို့ — E'' string တစ်ခုကို သုံးဖို့ လိုနိုင်ပါတယ်။
- **PROGRAM** — Execute လုပ်ရမယ့် command တစ်ခု။ `COPY FROM` မှာ — input ကို command ရဲ့ standard output ကနေ ဖတ်ပြီး — `COPY TO` မှာ — output ကို command ရဲ့ standard input ဆီ ရေးပါတယ်။
Command ကို shell က ခေါ်ယူတာမို့ — မယုံကြည်ရတဲ့ (untrusted) source တစ်ခုကနေ လာတဲ့ arguments တွေကို ပေးပို့ရမယ်ဆိုရင် — shell အတွက် အထူး အဓိပ္ပါယ် ရှိနိုင်တဲ့ special characters တွေကို ဖယ်ရှား (strip) ဒါမှမဟုတ် escape လုပ်ဖို့ သတိထားရပါမယ်။ လုံခြုံရေး အကြောင်းပြချက်တွေကြောင့် — ပုံသေ (fixed) command string တစ်ခုကို သုံးတာ အကောင်းဆုံးဖြစ်ပြီး — အနည်းဆုံးတော့ command ထဲမှာ user input ဘာမှ မပါအောင် ရှောင်သင့်ပါတယ်။
- **STDIN** — Input က client application ကနေ လာတယ်လို့ သတ်မှတ်ပေးပါတယ်။
- **STDOUT** — Output က client application ဆီ သွားတယ်လို့ သတ်မှတ်ပေးပါတယ်။
- **boolean** — ရွေးထားတဲ့ option ကို ဖွင့်မလား ပိတ်မလား သတ်မှတ်ပေးပါတယ်။ Option ကို enable လုပ်ဖို့ TRUE, ON ဒါမှမဟုတ် 1 လို့ ရေးနိုင်ပြီး — disable လုပ်ဖို့ FALSE, OFF ဒါမှမဟုတ် 0 လို့ ရေးနိုင်ပါတယ်။ Boolean value ကို ချန်လိုက်လည်း ရပြီး — အဲဒီအခါ TRUE လို့ ယူဆပါတယ်။
- **FORMAT** — ဖတ်ရှုမယ် ဒါမှမဟုတ် ရေးသားမယ့် data format ကို ရွေးချယ်ပေးပါတယ်: `text`, `csv` (Comma Separated Values — ကော်မာ ခြားထားတဲ့ တန်ဖိုးများ) ဒါမှမဟုတ် `binary`။ Default ကတော့ `text` ဖြစ်ပါတယ်။ အသေးစိတ်အတွက် အောက်က File Formats (file format များ) ကို ကြည့်ပါ။
- **FREEZE** — `VACUUM FREEZE` command ကို run ပြီးသား အတိုင်း — rows တွေကို ကြိုပြီး frozen ဖြစ်နေတဲ့ အနေအထားနဲ့ ကူးယူဖို့ တောင်းဆိုပါတယ်။ ဒါက ကနဦး data loading (data စတင် ထည့်သွင်းခြင်း) အတွက် performance option အနေနဲ့ ရည်ရွယ်ထားပါတယ်။ Rows တွေကို frozen လုပ်မှာက — load လုပ်နေတဲ့ table ကို လက်ရှိ subtransaction ထဲမှာ ဖန်တီးထားတာ ဒါမှမဟုတ် truncated လုပ်ထားတာဖြစ်ပြီး — cursors တွေ ဖွင့်ထားတာ မရှိဘူး၊ ဒီ transaction က ကိုင်ထားတဲ့ ပိုအသက်ကြီးတဲ့ (အရင်) snapshots တွေလည်း မရှိဘူးဆိုတဲ့ အခြေအနေမျိုးမှာပဲ ဖြစ်ပါတယ်။ Partitioned table ဒါမှမဟုတ် foreign table တစ်ခုပေါ်မှာ COPY FREEZE လုပ်တာကတော့ လောလောဆယ် မဖြစ်နိုင်ပါဘူး။ ဒီ option ကို `COPY FROM` မှာပဲ ခွင့်ပြုပါတယ်။

သတိပြုရမှာက — data တွေကို အောင်မြင်စွာ load လုပ်လိုက်တာနဲ့ — တခြား session တွေ အားလုံးက အဲဒီ data တွေကို ချက်ချင်း မြင်နိုင်သွားပါလိမ့်မယ်။ ဒါက MVCC visibility ရဲ့ သာမန် စည်းမျဉ်းတွေကို ချိုးဖောက်တာမျိုး ဖြစ်လို့ — ဒီကြောင့် ဖြစ်ပေါ်လာနိုင်တဲ့ ပြဿနာတွေကို user တွေ သတိပြုသင့်ပါတယ်။
- **DELIMITER** — File ထဲက row (line) တစ်ခုချင်းစီအတွင်းမှာ columns တွေကို ပိုင်းခြားပေးတဲ့ character ကို သတ်မှတ်ပေးပါတယ်။ Default ကတော့ — text format မှာ tab character ဖြစ်ပြီး — CSV format မှာ comma ဖြစ်ပါတယ်။ ဒါက byte တစ်လုံးတည်းပဲ ပါတဲ့ (single one-byte) character ဖြစ်ရပါမယ်။ Binary format သုံးတဲ့အခါ ဒီ option ကို ခွင့်မပြုပါဘူး။
- **NULL** — Null value တစ်ခုကို ကိုယ်စားပြုတဲ့ string ကို သတ်မှတ်ပေးပါတယ်။ Default ကတော့ — text format မှာ `\N` (backslash-N) ဖြစ်ပြီး — CSV format မှာ quote မလုပ်ထားတဲ့ empty string ဖြစ်ပါတယ်။ Null တွေနဲ့ empty strings တွေကို ခွဲခြားစရာ မလိုတဲ့ အခြေအနေတွေမှာ — text format မှာတောင် empty string ကို သုံးချင်စိတ် ဖြစ်နိုင်ပါတယ်။ Binary format သုံးတဲ့အခါ ဒီ option ကို ခွင့်မပြုပါဘူး။

  > **မှတ်ချက်:** `COPY FROM` သုံးတဲ့အခါ — ဒီ string နဲ့ ကိုက်ညီတဲ့ data item တိုင်းကို null value အဖြစ် သိမ်းဆည်းပါတယ် — ဒါကြောင့် `COPY TO` မှာ သုံးခဲ့တဲ့ string နဲ့ အတူတူ string ကိုပဲ သုံးဖို့ သေချာစေသင့်ပါတယ်။
- **DEFAULT** — Default value တစ်ခုကို ကိုယ်စားပြုတဲ့ string ကို သတ်မှတ်ပေးပါတယ်။ Input file ထဲမှာ အဲဒီ string ကို တွေ့ရတိုင်း — သက်ဆိုင်ရာ column ရဲ့ default value ကို သုံးပါလိမ့်မယ်။ ဒီ option ကို `COPY FROM` မှာပဲ — ပြီးတော့ binary format မသုံးတဲ့အခါမှပဲ ခွင့်ပြုပါတယ်။
- **HEADER** — File ထဲမှာ column တစ်ခုချင်းစီရဲ့ နာမည်တွေ ပါဝင်တဲ့ header line တစ်ကြောင်း ပါတယ်လို့ သတ်မှတ်ပေးပါတယ်။ Output မှာ — ပထမဆုံး line က table ထဲက column နာမည်တွေ ပါဝင်ပါတယ်။ Input မှာ — ဒီ option ကို true (ဒါမှမဟုတ် ညီမျှတဲ့ Boolean value) လို့ သတ်မှတ်ထားရင် — ပထမဆုံး line ကို ပစ်ပယ်ပါတယ်။ ဒီ option ကို MATCH လို့ သတ်မှတ်ထားရင် — header line ထဲက columns တွေရဲ့ အရေအတွက်နဲ့ နာမည်တွေက table ရဲ့ တကယ့် column နာမည်တွေနဲ့ အစဉ်လိုက် ကိုက်ညီရပါမယ်; မကိုက်ညီရင် error တစ်ခု ထုတ်ပါတယ်။ Binary format သုံးတဲ့အခါ ဒီ option ကို ခွင့်မပြုပါဘူး။ MATCH option က `COPY FROM` commands တွေအတွက်ပဲ အကျုံးဝင်ပါတယ်။
- **QUOTE** — Data value တစ်ခုကို quote လုပ်တဲ့အခါ သုံးမယ့် quoting character ကို သတ်မှတ်ပေးပါတယ်။ Default ကတော့ double-quote (`"`) ဖြစ်ပါတယ်။ ဒါက byte တစ်လုံးတည်းပဲ ပါတဲ့ character ဖြစ်ရပါမယ်။ CSV format သုံးတဲ့အခါမှပဲ ဒီ option ကို ခွင့်ပြုပါတယ်။
- **ESCAPE** — QUOTE value နဲ့ ကိုက်ညီတဲ့ data character တစ်ခုရဲ့ ရှေ့မှာ ပေါ်လာသင့်တဲ့ character ကို သတ်မှတ်ပေးပါတယ်။ Default ကတော့ QUOTE value နဲ့ အတူတူပဲ ဖြစ်ပါတယ် (ဒါကြောင့် data ထဲမှာ quoting character ပေါ်လာရင် — အဲဒါကို နှစ်ဆ လုပ်ပါတယ်)။ ဒါက byte တစ်လုံးတည်းပဲ ပါတဲ့ character ဖြစ်ရပါမယ်။ CSV format သုံးတဲ့အခါမှပဲ ဒီ option ကို ခွင့်ပြုပါတယ်။
- **FORCE_QUOTE** — သတ်မှတ်ထားတဲ့ column တစ်ခုချင်းစီထဲက non-NULL values တွေ အားလုံးအတွက် quoting ကို အတင်းအကျပ် သုံးစေပါတယ်။ NULL output ကိုတော့ ဘယ်တော့မှ quote မလုပ်ပါဘူး။ `*` ကို သတ်မှတ်ထားရင် — column တွေ အားလုံးမှာ non-NULL values တွေကို quote လုပ်ပါလိမ့်မယ်။ `COPY TO` မှာပဲ — ပြီးတော့ CSV format သုံးတဲ့အခါမှပဲ ဒီ option ကို ခွင့်ပြုပါတယ်။
- **FORCE_NOT_NULL** — သတ်မှတ်ထားတဲ့ columns တွေရဲ့ values တွေကို null string နဲ့ မနှိုင်းယှဉ်ပါနဲ့။ Null string က empty ဖြစ်နေတဲ့ default အခြေအနေမှာ — ဒါက empty values တွေကို — quote မလုပ်ထားရင်တောင် — nulls တွေ အနေနဲ့ မဟုတ်ဘဲ — zero-length strings တွေ အနေနဲ့ ဖတ်မယ်လို့ ဆိုလိုပါတယ်။ `*` ကို သတ်မှတ်ထားရင် — ဒီ option ကို column အားလုံးမှာ သက်ရောက်စေပါလိမ့်မယ်။ `COPY FROM` မှာပဲ — ပြီးတော့ CSV format သုံးတဲ့အခါမှပဲ ဒီ option ကို ခွင့်ပြုပါတယ်။
- **FORCE_NULL** — သတ်မှတ်ထားတဲ့ columns တွေရဲ့ values တွေကို — quote လုပ်ထားရင်တောင် — null string နဲ့ နှိုင်းယှဉ်ပြီး — ကိုက်ညီမှု တွေ့ရင် value ကို NULL အဖြစ် သတ်မှတ်ပါတယ်။ Null string က empty ဖြစ်နေတဲ့ default အခြေအနေမှာ — ဒါက quote လုပ်ထားတဲ့ empty string တစ်ခုကို NULL အဖြစ် ပြောင်းလဲပေးပါတယ်။ `*` ကို သတ်မှတ်ထားရင် — ဒီ option ကို column အားလုံးမှာ သက်ရောက်စေပါလိမ့်မယ်။ `COPY FROM` မှာပဲ — ပြီးတော့ CSV format သုံးတဲ့အခါမှပဲ ဒီ option ကို ခွင့်ပြုပါတယ်။
- **ON_ERROR** — Column တစ်ခုရဲ့ input value ကို သူ့ရဲ့ data type အဖြစ် ပြောင်းလဲတဲ့အခါ error တစ်ခု ကြုံရင် ဘယ်လို ပြုမူရမလဲ သတ်မှတ်ပေးပါတယ်။ error_action တန်ဖိုး stop ဆိုရင် command ကို မအောင်မြင်စေပြီး — ignore ဆိုရင် input row ကို ပစ်ပယ်ပြီး နောက် row တစ်ခုနဲ့ ဆက်လုပ်ပါတယ်။ Default ကတော့ stop ဖြစ်ပါတယ်။
ignore option က `FORMAT` က text ဒါမှမဟုတ် csv ဖြစ်တဲ့ `COPY FROM` အတွက်ပဲ အကျုံးဝင်ပါတယ်။
Row တစ်ခုခု ပစ်ပယ်ခံခဲ့ရရင် — `COPY FROM` ရဲ့ အဆုံးမှာ ပစ်ပယ်လိုက်တဲ့ row အရေအတွက် ပါဝင်တဲ့ NOTICE message တစ်ခု ထုတ်ပေးပါတယ်။ `LOG_VERBOSITY` option ကို verbose လို့ သတ်မှတ်ထားရင် — ပစ်ပယ်လိုက်တဲ့ row တစ်ခုချင်းစီအတွက် — input file ရဲ့ line နဲ့ input conversion မအောင်မြင်တဲ့ column နာမည် ပါဝင်တဲ့ NOTICE message တစ်ခု ထုတ်ပေးပါတယ်။ silent လို့ သတ်မှတ်ထားရင်တော့ — လျစ်လျူရှုလိုက်တဲ့ rows တွေအကြောင်း message ဘာမှ မထုတ်ပေးပါဘူး။
- **REJECT_LIMIT** — `ON_ERROR` ကို ignore လို့ သတ်မှတ်ထားတဲ့အခါ — column တစ်ခုရဲ့ input value ကို သူ့ရဲ့ data type အဖြစ် ပြောင်းလဲနေစဉ်မှာ ခံနိုင်ရည် ရှိမယ့် (tolerate လုပ်မယ့်) error အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Input က သတ်မှတ်ထားတဲ့ တန်ဖိုးထက် errors တွေ ပိုများလာရင် — `ON_ERROR` ကို ignore လို့ သတ်မှတ်ထားရင်တောင် — COPY command က မအောင်မြင်ပါဘူး။ ဒီ clause ကို `ON_ERROR=ignore` နဲ့အတူ သုံးရပြီး — maxerror က positive bigint ဖြစ်ရပါမယ်။ သတ်မှတ်မထားရင် — `ON_ERROR=ignore` က error အရေအတွက် အကန့်အသတ်မရှိ ခွင့်ပြုပါတယ် — ဆိုလိုတာက COPY က မှားနေတဲ့ data တွေ အားလုံးကို ကျော်သွားပါလိမ့်မယ်။
- **ENCODING** — File ကို encoding_name နဲ့ encode လုပ်ထားတယ်လို့ သတ်မှတ်ပေးပါတယ်။ ဒီ option ကို ချန်လိုက်ရင် — လက်ရှိ client encoding ကို သုံးပါတယ်။ နောက်ထပ် အသေးစိတ်အတွက် အောက်က Notes (မှတ်စုများ) ကို ကြည့်ပါ။
- **LOG_VERBOSITY** — COPY command တစ်ခုက ထုတ်ပေးမယ့် message ပမာဏကို သတ်မှတ်ပေးပါတယ်: default, verbose ဒါမှမဟုတ် silent။ verbose လို့ သတ်မှတ်ထားရင် — process လုပ်နေစဉ်မှာ နောက်ထပ် messages တွေ ထုတ်ပေးပါတယ်။ silent ကတော့ verbose ရော default messages တွေပါ နှိမ်နင်းပေးပါတယ်။
လောလောဆယ် ဒါကို `ON_ERROR` option ကို ignore လို့ သတ်မှတ်ထားတဲ့ `COPY FROM` command မှာ သုံးပါတယ်။
- **WHERE** — Optional ဖြစ်တဲ့ WHERE clause ရဲ့ ယေဘုယျ ပုံစံက အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

  `WHERE condition`

  ဒီမှာ condition ဆိုတာ — boolean type ရလဒ် တစ်ခုကို အကဲဖြတ်ပေးတဲ့ expression တစ်ခုခု ဖြစ်ပါတယ်။ ဒီ condition ကို မဖြည့်ဆည်းတဲ့ row တစ်ခုခုကို table ထဲကို ထည့်သွင်းမှာ မဟုတ်ပါဘူး။ Row တစ်ခုရဲ့ တကယ့် values တွေကို variable references တွေ နေရာမှာ အစားထိုး ထည့်လိုက်တဲ့အခါ true ပြန်ပေးရင် — အဲဒီ row က condition ကို ဖြည့်ဆည်းတယ်လို့ ဆိုပါတယ်။
လောလောဆယ် — WHERE expressions တွေထဲမှာ subqueries တွေနဲ့ generated columns တွေကို ခွင့်မပြုပါဘူး — ပြီးတော့ အကဲဖြတ်မှုက COPY ကိုယ်တိုင် လုပ်လိုက်တဲ့ ပြောင်းလဲမှုတွေကို မမြင်ရပါဘူး (expression ထဲမှာ VOLATILE functions တွေဆီ ခေါ်ဆိုမှုတွေ ပါနေရင် ဒါက အရေးကြီးပါတယ်)။

## Outputs (ရလဒ်များ)

အောင်မြင်စွာ ပြီးဆုံးတဲ့အခါ — `COPY` command က အောက်ပါ ပုံစံရှိတဲ့ command tag တစ်ခုကို ပြန်ပေးပါတယ်:

```sql
COPY count
```

`count` ဆိုတာ ကူးယူလိုက်တဲ့ rows အရေအတွက် ဖြစ်ပါတယ်။

> **မှတ်ချက်:** psql က ဒီ command tag ကို — command က `COPY ... TO STDOUT` မဟုတ်ဘဲ ဖြစ်နေမှသာ — ဒါမှမဟုတ် ညီမျှတဲ့ psql meta-command ဖြစ်တဲ့ `\copy ... to stdout` မဟုတ်ဘဲ ဖြစ်နေမှသာ — ပုံနှိပ်ပြပါလိမ့်မယ်။ ဒါက command tag ကို — ခုနက ပုံနှိပ်လိုက်တဲ့ data နဲ့ ရောထွေးသွားတာ မဖြစ်အောင် ကာကွယ်ဖို့ ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

`COPY TO` ကို plain tables တွေနဲ့ data ဖြည့်ပြီးသား (populated) materialized views တွေမှာ သုံးနိုင်ပါတယ်။ ဥပမာ — `COPY table TO` က `SELECT * FROM ONLY table` နဲ့ အတူတူ rows တွေကို ကူးယူပါတယ်။ ဒါပေမယ့် partitioned tables တွေ၊ inheritance child tables တွေ ဒါမှမဟုတ် views တွေလို တခြား relation types တွေကိုတော့ တိုက်ရိုက် ထောက်ပံ့မထားပါဘူး။ အဲဒီလို relations တွေကနေ rows အားလုံး ကူးယူဖို့ဆိုရင် — `COPY (SELECT * FROM table) TO` ကို သုံးပါ။

`COPY FROM` ကို plain, foreign ဒါမှမဟုတ် partitioned tables တွေမှာ — ဒါမှမဟုတ် `INSTEAD OF INSERT` triggers တွေ ရှိတဲ့ views တွေမှာ သုံးနိုင်ပါတယ်။

`COPY TO` က values တွေကို ဖတ်ရှုတဲ့ table ပေါ်မှာ select privilege ရှိရပြီး — `COPY FROM` က values တွေကို ထည့်သွင်းတဲ့ table ပေါ်မှာ insert privilege ရှိရပါမယ်။ Command ထဲမှာ စာရင်းပြုထားတဲ့ column(s) တွေပေါ်မှာ column privileges တွေ ရှိရုံနဲ့လည်း လုံလောက်ပါတယ်။

Table အတွက် row-level security ကို enable လုပ်ထားရင် — သက်ဆိုင်ရာ `SELECT` policies တွေက `COPY table TO` statements တွေအပေါ်မှာ သက်ရောက်ပါလိမ့်မယ်။ လောလောဆယ် — row-level security ရှိတဲ့ tables တွေအတွက် `COPY FROM` ကို ထောက်ပံ့မထားပါဘူး။ အဲဒီအစား ညီမျှတဲ့ `INSERT` statements တွေကို သုံးပါ။

`COPY` command တစ်ခုထဲမှာ နာမည် ပေးထားတဲ့ files တွေကို client application က မဟုတ်ဘဲ — server က တိုက်ရိုက် ဖတ်ရှု ဒါမှမဟုတ် ရေးသားပါတယ်။ ဒါကြောင့် — အဲဒါတွေက client မှာ မဟုတ်ဘဲ — database server machine ပေါ်မှာ တည်ရှိရပါမယ် ဒါမှမဟုတ် အဲဒီ machine က ဝင်ရောက်နိုင်ရပါမယ်။ အဲဒါတွေကို client က မဟုတ်ဘဲ — PostgreSQL user (server က run နေတဲ့ user ID) က ဝင်ရောက်နိုင်ပြီး ဖတ်လို့ ဒါမှမဟုတ် ရေးလို့ ရနိုင်ရပါမယ်။ အလားတူပဲ — `PROGRAM` နဲ့ သတ်မှတ်ထားတဲ့ command ကို client application က မဟုတ်ဘဲ — server က တိုက်ရိုက် execute လုပ်ပြီး — PostgreSQL user က execute လုပ်နိုင်ရပါမယ်။ File ဒါမှမဟုတ် command တစ်ခုကို နာမည် ပေးတဲ့ `COPY` က — server က ဝင်ရောက်ခွင့် ရှိတဲ့ file တစ်ခုခုကို ဖတ်ရှု ဒါမှမဟုတ် ရေးသားနိုင်တာ၊ program တစ်ခုခုကို run လုပ်နိုင်တာမို့ — database superusers တွေ ဒါမှမဟုတ် `pg_read_server_files`, `pg_write_server_files`, `pg_execute_server_program` roles တွေထဲက တစ်ခုခုကို ပေးအပ်ခံထားရတဲ့ user တွေကိုပဲ ခွင့်ပြုပါတယ်။

`COPY` ကို psql ရဲ့ instruction ဖြစ်တဲ့ `\copy` နဲ့ မရောထွေးပါနဲ့။ `\copy` က `COPY FROM STDIN` ဒါမှမဟုတ် `COPY TO STDOUT` ကို ခေါ်ပြီး — ပြီးတော့ psql client က ဝင်ရောက်နိုင်တဲ့ file တစ်ခုထဲကို data တွေကို ဆွဲယူ/သိမ်းဆည်း လုပ်ပါတယ်။ ဒါကြောင့် — `\copy` သုံးတဲ့အခါ file ဝင်ရောက်နိုင်မှုနဲ့ access rights တွေက server ပေါ်မှာ မဟုတ်ဘဲ — client ပေါ်မှာ မူတည်ပါတယ်။

`COPY` ထဲမှာ သုံးတဲ့ file နာမည်ကို absolute path အဖြစ် အမြဲ သတ်မှတ်ဖို့ အကြံပြုပါတယ်။ `COPY TO` ရဲ့ ကိစ္စမှာ server က ဒါကို အတင်းအကျပ် ကျင့်သုံးပြီး — `COPY FROM` အတွက်ကတော့ relative path တစ်ခုနဲ့ သတ်မှတ်ထားတဲ့ file တစ်ခုကနေ ဖတ်တဲ့ option ရှိပါတယ်။ Path ကို client ရဲ့ working directory နဲ့ မဟုတ်ဘဲ — server process ရဲ့ working directory (ပုံမှန်အားဖြင့် cluster ရဲ့ data directory) နဲ့ ဆက်စပ်ပြီး အဓိပ္ပာယ် ကောက်ယူပါလိမ့်မယ်။

`PROGRAM` နဲ့ command တစ်ခုကို execute လုပ်တာက — SELinux လိုမျိုး — operating system ရဲ့ access control mechanisms တွေရဲ့ ကန့်သတ်ချက်တွေကို ခံရနိုင်ပါတယ်။

`COPY FROM` က destination table ပေါ်က triggers တွေနဲ့ check constraints တွေကို ခေါ်ယူပါလိမ့်မယ်။ ဒါပေမယ့် rules တွေကိုတော့ ခေါ်ယူမှာ မဟုတ်ပါဘူး။

Identity columns တွေအတွက် — `COPY FROM` command က input data ထဲမှာ ပေးထားတဲ့ column values တွေကို — `INSERT` ရဲ့ `OVERRIDING SYSTEM VALUE` option လိုပဲ — အမြဲ ရေးသားပါလိမ့်မယ်။

`COPY` ရဲ့ input နဲ့ output ကို `DateStyle` က သက်ရောက်ပါတယ်။ Non-default `DateStyle` settings တွေ သုံးနေနိုင်တဲ့ တခြား PostgreSQL installations တွေဆီ portability (သယ်ယူ သုံးစွဲနိုင်မှု) ရှိအောင် သေချာစေဖို့ — `COPY TO` မသုံးခင် `DateStyle` ကို `ISO` လို့ သတ်မှတ်ထားသင့်ပါတယ်။ ဒါ့အပြင် — `IntervalStyle` ကို `sql_standard` လို့ သတ်မှတ်ပြီး data တွေကို dump လုပ်တာ ရှောင်သင့်ပါတယ် — ဘာလို့လဲဆိုတော့ negative interval values တွေကို `IntervalStyle` အတွက် မတူညီတဲ့ setting ရှိတဲ့ server တစ်ခုက လွဲမှားစွာ အဓိပ္ပာယ် ကောက်ယူမိနိုင်လို့ပါ။

Input data ကို `ENCODING` option ဒါမှမဟုတ် လက်ရှိ client encoding အရ အဓိပ္ပာယ် ကောက်ယူပြီး — output data ကို `ENCODING` ဒါမှမဟုတ် လက်ရှိ client encoding နဲ့ encode လုပ်ပါတယ် — data တွေက client ကို ဖြတ်သန်းမသွားဘဲ server က file တစ်ခုကနေ တိုက်ရိုက် ဖတ်ရှု ဒါမှမဟုတ် file တစ်ခုဆီ တိုက်ရိုက် ရေးသားနေရင်တောင် ဒီအတိုင်းပါပဲ။

`COPY FROM` command က input rows တွေကို တိုးတက်နေသလို table ထဲကို physically (ရုပ်ပိုင်းအရ) insert လုပ်ပါတယ်။ Command က မအောင်မြင်ခဲ့ရင် — ဒီ rows တွေက deleted state ထဲမှာ ကျန်ခဲ့ပါတယ်; ဒီ rows တွေက မြင်ရမှာ မဟုတ်ပေမယ့် — disk space တွေကိုတော့ ဆက်ပြီး နေရာယူထားပါတယ်။ ကြီးမားတဲ့ copy operation တစ်ခုရဲ့ အတော်လေး ဝေးဝေးကို ရောက်မှ မအောင်မြင်မှု ဖြစ်ခဲ့ရင် — ဒါက အတော် များပြားတဲ့ disk space အလဟသ ဖြုန်းတီးမှု ဖြစ်သွားနိုင်ပါတယ်။ ဖြုန်းတီးသွားတဲ့ space တွေကို ပြန်လည် ရယူဖို့ `VACUUM` ကို သုံးသင့်ပါတယ်။

`FORCE_NULL` နဲ့ `FORCE_NOT_NULL` တို့ကို column တစ်ခုတည်းပေါ်မှာ တစ်ပြိုင်နက် သုံးနိုင်ပါတယ်။ ဒါက — quote လုပ်ထားတဲ့ null strings တွေကို null values တွေ အဖြစ်လည်း — quote မလုပ်ထားတဲ့ null strings တွေကို empty strings တွေ အဖြစ်လည်း — ပြောင်းလဲပေးတဲ့ ရလဒ်ကို ဖြစ်စေပါတယ်။

## File Formats (file format များ)

### Text Format (text ပုံစံ)

`text` format ကို သုံးတဲ့အခါ — ဖတ်ရှု ဒါမှမဟုတ် ရေးသားတဲ့ data က — table row တစ်ခုအတွက် line တစ်ကြောင်းစီ ပါတဲ့ text file တစ်ခု ဖြစ်ပါတယ်။ Row တစ်ခုထဲက columns တွေကို delimiter character နဲ့ ပိုင်းခြားပါတယ်။ Column values တွေကိုယ်တိုင်က — attribute တစ်ခုချင်းစီရဲ့ data type ရဲ့ output function က ထုတ်လုပ်တဲ့ ဒါမှမဟုတ် input function က လက်ခံနိုင်တဲ့ strings တွေ ဖြစ်ပါတယ်။ Null ဖြစ်နေတဲ့ columns တွေရဲ့ နေရာမှာ သတ်မှတ်ထားတဲ့ null string ကို သုံးပါတယ်။ Input file ရဲ့ line တစ်ကြောင်းခုမှာ မျှော်လင့်ထားတာထက် columns တွေ ပိုနေရင် ဒါမှမဟုတ် နည်းနေရင် — `COPY FROM` က error တစ်ခု ထုတ်ပါလိမ့်မယ်။

Data ရဲ့ အဆုံးကို — backslash-period (`\.`) တစ်ခုတည်း ပါဝင်တဲ့ line တစ်ကြောင်းနဲ့ ကိုယ်စားပြုနိုင်ပါတယ်။ File တစ်ခုကနေ ဖတ်တဲ့အခါ — file ရဲ့ အဆုံးကိုယ်တိုင်က ကောင်းကောင်း အလုပ်လုပ်ပေးလို့ — end-of-data marker (data အဆုံးသတ် အမှတ်အသား) မလိုအပ်ပါဘူး; အဲဒီ အခြေအနေမှာ ဒီပြဋ္ဌာန်းချက်က နောက်ပြန် လိုက်ဖက်ညီမှု (backward compatibility) အတွက်ပဲ ရှိနေတာပါ။ ဒါပေမယ့် — SQL script တစ်ခုထဲမှာ in-line `COPY` data တွေကို ဖတ်နေတာဖြစ်တဲ့ — `COPY FROM STDIN` operation တစ်ခုကို အဆုံးသတ်ဖို့ psql က `\.` ကို သုံးပါတယ်။ အဲဒီ အခြေအနေမှာ — script ရဲ့ အဆုံးမတိုင်ခင် operation ကို အဆုံးသတ်နိုင်ဖို့ ဒီစည်းမျဉ်း လိုအပ်ပါတယ်။

Backslash characters (`\`) တွေကို `COPY` data ထဲမှာ — row ဒါမှမဟုတ် column delimiters တွေ အနေနဲ့ ယူဆခံရနိုင်မယ့် data characters တွေကို quote လုပ်ဖို့ သုံးနိုင်ပါတယ်။ အထူးသဖြင့် — အောက်ပါ characters တွေက column value တစ်ခုရဲ့ အစိတ်အပိုင်း အနေနဲ့ ပေါ်လာရင် backslash တစ်ခုနဲ့ ရှေ့ဆွဲရပါမယ်: backslash ကိုယ်တိုင်၊ newline၊ carriage return နဲ့ လက်ရှိ delimiter character တို့ ဖြစ်ပါတယ်။

သတ်မှတ်ထားတဲ့ null string ကို `COPY TO` က backslash တွေ ဘာမှ မထည့်ဘဲ ပို့ပေးပြီး — အပြန်အလှန်အားဖြင့် — `COPY FROM` က backslashes တွေကို မဖယ်ရှားခင် input ကို null string နဲ့ နှိုင်းယှဉ်ပါတယ်။ ဒါကြောင့် — `\N` လို null string တစ်ခုက — တကယ့် data value `\N` (ဒါကို `\\N` အဖြစ် ကိုယ်စားပြုမှာ ဖြစ်တယ်) နဲ့ ရောထွေးမသွားနိုင်ပါဘူး။

အောက်ပါ special backslash sequences တွေကို `COPY FROM` က အသိအမှတ်ပြုပါတယ်:

| Sequence | Represents (ကိုယ်စားပြုမှု) |
| --- | --- |
| `\b` | Backspace (ASCII 8) |
| `\f` | Form feed (ASCII 12) |
| `\n` | Newline (ASCII 10) |
| `\r` | Carriage return (ASCII 13) |
| `\t` | Tab (ASCII 9) |
| `\v` | Vertical tab (ASCII 11) |
| `\``digits` | Backslash နောက်မှာ octal digits 1 လုံးကနေ 3 လုံးအထိ လိုက်ပြီး — အဲဒီ ကိန်းဂဏန်း code နဲ့ ညီတဲ့ byte ကို သတ်မှတ်ပေးပါတယ် |
| `\x``digits` | Backslash `x` နောက်မှာ hex digits 1 လုံး ဒါမှမဟုတ် 2 လုံး လိုက်ပြီး — အဲဒီ ကိန်းဂဏန်း code နဲ့ ညီတဲ့ byte ကို သတ်မှတ်ပေးပါတယ် |

လောလောဆယ် — `COPY TO` က octal ဒါမှမဟုတ် hex-digits backslash sequence တစ်ခုကို ဘယ်တော့မှ ထုတ်လွှတ်မှာ မဟုတ်ပေမယ့် — အထက်က ဇယားထဲက အခြား sequences တွေကိုတော့ အဲဒီ control characters တွေအတွက် သုံးပါတယ်။

အထက်က ဇယားထဲမှာ ဖော်ပြမထားတဲ့ တခြား backslashed character တစ်ခုခုကိုတော့ — သူ့ကိုယ်သူ ကိုယ်စားပြုတယ်လို့ ယူဆပါလိမ့်မယ်။ ဒါပေမယ့် — backslashes တွေကို မလိုအပ်ဘဲ ထည့်တာကို သတိထားပါ — ဘာလို့လဲဆိုတော့ မတော်တဆ — end-of-data marker (`\.`) ဒါမှမဟုတ် null string (`\N` — default အနေနဲ့) နဲ့ ကိုက်ညီနေတဲ့ string တစ်ခုကို ထုတ်လုပ်မိနိုင်လို့ပါ။ ဒီ strings တွေကို တခြား backslash processing တွေ မလုပ်ခင် ကြိုပြီး အသိအမှတ်ပြုပါလိမ့်မယ်။

`COPY` data တွေကို ထုတ်လုပ်နေတဲ့ applications တွေအနေနဲ့ — data ထဲက newlines တွေနဲ့ carriage returns တွေကို `\n` နဲ့ `\r` sequences တွေအဖြစ် အသီးသီး ပြောင်းလဲဖို့ အခိုင်အမာ အကြံပြုပါတယ်။ လောလောဆယ်မှာ — data carriage return တစ်ခုကို backslash နဲ့ carriage return တစ်ခုနဲ့ ကိုယ်စားပြုနိုင်သလို — data newline တစ်ခုကိုလည်း backslash နဲ့ newline တစ်ခုနဲ့ ကိုယ်စားပြုနိုင်ပါတယ်။ ဒါပေမယ့် — ဒီ representations တွေကို အနာဂတ် releases တွေမှာ လက်ခံမှာ မဟုတ်နိုင်ပါဘူး။ ပြီးတော့ — `COPY` file တစ်ခုကို machine အမျိုးမျိုးကြား (ဥပမာ Unix ကနေ Windows ဒါမှမဟုတ် အပြန်အလှန်) ကူးပြောင်းရင် — ပျက်စီးမှု (corruption) ဖြစ်နိုင်ခြေ အလွန် မြင့်မားပါတယ်။

Backslash sequences တွေ အားလုံးကို encoding conversion ပြီးမှ အဓိပ္ပာယ် ကောက်ယူပါတယ်။ Octal နဲ့ hex-digit backslash sequences တွေနဲ့ သတ်မှတ်ထားတဲ့ bytes တွေက database encoding ထဲမှာ valid characters တွေ ဖြစ်ရပါမယ်။

`COPY TO` က row တစ်ခုချင်းစီကို Unix-style newline (“\n”) တစ်ခုနဲ့ အဆုံးသတ်ပါလိမ့်မယ်။ Microsoft Windows ပေါ်မှာ run နေတဲ့ servers တွေကတော့ — carriage return/newline (“\r\n”) တွေကို output လုပ်ပေမယ့် — server file တစ်ခုဆီ `COPY` လုပ်တဲ့အခါမှပဲ ဖြစ်ပါတယ်; platform တွေကြား ညီညွတ်မှုအတွက် — `COPY TO STDOUT` က server platform ဘယ်လိုပဲ ဖြစ်ဖြစ် “\n” ကိုပဲ အမြဲ ပို့ပါတယ်။ `COPY FROM` က newlines တွေ၊ carriage returns တွေ ဒါမှမဟုတ် carriage return/newlines တွေနဲ့ အဆုံးသတ်တဲ့ lines တွေကို ကိုင်တွယ်နိုင်ပါတယ်။ Data အနေနဲ့ ရည်ရွယ်ထားတဲ့ backslash မပါတဲ့ newlines ဒါမှမဟုတ် carriage returns တွေကြောင့် error ဖြစ်နိုင်ခြေကို လျှော့ချဖို့ — input ထဲက line endings တွေ အားလုံး တစ်ပုံစံတည်း မဟုတ်ရင် `COPY FROM` က မကျေမနပ် ပြောလာပါလိမ့်မယ်။

### CSV Format (CSV ပုံစံ)

ဒီ format option ကို — spreadsheets လို တခြား program တွေ အများကြီးက သုံးတဲ့ Comma-Separated Value (`CSV`) file format တွေကို import/export လုပ်ဖို့ သုံးပါတယ်။ PostgreSQL ရဲ့ standard text format က သုံးတဲ့ escaping rules တွေ အစား — ဒါက သာမန် `CSV` escaping mechanism ကို ထုတ်လုပ်ပြီး အသိအမှတ်ပြုပါတယ်။

Record တစ်ခုချင်းစီထဲက values တွေကို `DELIMITER` character နဲ့ ပိုင်းခြားပါတယ်။ Value တစ်ခုထဲမှာ delimiter character, `QUOTE` character, `NULL` string, carriage return ဒါမှမဟုတ် line feed character ပါဝင်နေရင် — value တစ်ခုလုံးကို `QUOTE` character တွေနဲ့ ရှေ့နောက် ပတ်ပြီး — value အတွင်းမှာ `QUOTE` character ဒါမှမဟုတ် `ESCAPE` character တစ်ခုခု ပါဝင်နေတိုင်းရဲ့ ရှေ့မှာ escape character ကို ထည့်ပါတယ်။ Column တချို့မှာ non-`NULL` values တွေကို output လုပ်တဲ့အခါ quotes တွေကို အတင်းအကျပ် သုံးဖို့ `FORCE_QUOTE` ကိုလည်း သုံးနိုင်ပါတယ်။

`CSV` format မှာ `NULL` value တစ်ခုကို empty string ကနေ ခွဲခြားဖို့ standard နည်းလမ်း မရှိပါဘူး။ PostgreSQL ရဲ့ `COPY` က ဒါကို quoting နဲ့ ကိုင်တွယ်ပါတယ်။ `NULL` တစ်ခုကို `NULL` parameter string အဖြစ် output လုပ်ပြီး — quote မလုပ်ပါဘူး — ဒါပေမယ့် `NULL` parameter string နဲ့ ကိုက်ညီတဲ့ non-`NULL` value တစ်ခုကတော့ quote လုပ်ပါတယ်။ ဥပမာ — default settings တွေနဲ့ဆိုရင် — `NULL` တစ်ခုကို quote မလုပ်ထားတဲ့ empty string အဖြစ် ရေးပြီး — empty string data value တစ်ခုကိုတော့ double quotes (`""`) တွေနဲ့ ရေးပါတယ်။ Values တွေကို ဖတ်တဲ့အခါမှာလည်း အလားတူ စည်းမျဉ်းတွေနဲ့ လိုက်နာပါတယ်။ Column တချို့အတွက် `NULL` input နှိုင်းယှဉ်မှုတွေကို တားဆီးဖို့ `FORCE_NOT_NULL` ကို သုံးနိုင်ပါတယ်။ Quote လုပ်ထားတဲ့ null string data values တွေကို `NULL` အဖြစ် ပြောင်းဖို့ `FORCE_NULL` ကိုလည်း သုံးနိုင်ပါတယ်။

Backslash က `CSV` format ထဲမှာ special character မဟုတ်တာမို့ — text mode မှာ သုံးတဲ့ end-of-data marker (`\.`) ကို `CSV` data တွေ ဖတ်တဲ့အခါ သာမန်အားဖြင့် special အဖြစ် သဘောမထားပါဘူး။ ခြွင်းချက်ကတော့ — psql က `COPY FROM STDIN` operation တစ်ခုကို (SQL script တစ်ခုထဲမှာ in-line `COPY` data တွေ ဖတ်နေတာကို) `\.` တစ်ခုတည်း ပါဝင်တဲ့ line တစ်ကြောင်းမှာ — text mode လား `CSV` mode လား မသက်ဆိုင်ဘဲ — အဆုံးသတ်ပေးပါလိမ့်မယ်။

> **မှတ်ချက်:** PostgreSQL v18 မတိုင်ခင် version တွေက — သီးခြား file တစ်ခုကနေ ဖတ်နေတဲ့အခါတောင် — quote မလုပ်ထားတဲ့ `\.` ကို end-of-data marker အဖြစ် အမြဲ အသိအမှတ်ပြုခဲ့ပါတယ်။ အဟောင်း version တွေနဲ့ လိုက်ဖက်ညီအောင် — `COPY TO` က `\.` ကို line တစ်ကြောင်းတည်းမှာ တစ်ခုတည်း ရှိနေရင် quote လုပ်ပေးပါတယ် — ဒါ နောက်ထပ် မလိုအပ်တော့ပေမယ့်ပါ။

> **မှတ်ချက်:** `CSV` format မှာ — character တိုင်း အဓိပ္ပါယ် ရှိပါတယ်။ White space တွေနဲ့ ဝိုင်းရံထားတဲ့ quoted value တစ်ခု ဒါမှမဟုတ် `DELIMITER` ကလွဲလို့ တခြား characters တွေ ဘာမဆို ပါဝင်နေတဲ့ quoted value တစ်ခုက — အဲဒီ characters တွေ အားလုံးကို ပါဝင်စေပါလိမ့်မယ်။ `CSV` lines တွေကို သတ်မှတ်ထားတဲ့ width တစ်ခုအထိ white space တွေနဲ့ ဖြည့်ပေးတတ်တဲ့ system တစ်ခုကနေ data တွေ import လုပ်ရင် — ဒါက errors တွေ ဖြစ်စေနိုင်ပါတယ်။ အဲဒီလို အခြေအနေမျိုး ပေါ်လာရင် — PostgreSQL ထဲကို data တွေ import မလုပ်ခင် `CSV` file ကို ကြိုပြီး process လုပ်ပြီး — နောက်ဆုံးက trailing white space တွေကို ဖယ်ရှားဖို့ လိုနိုင်ပါတယ်။

> **မှတ်ချက်:** `CSV` format က — embedded carriage returns တွေနဲ့ line feeds တွေ ပါဝင်တဲ့ quoted values တွေပါတဲ့ `CSV` files တွေကို အသိအမှတ်ပြုရော ထုတ်လုပ်ပါရော နှစ်မျိုးလုံး လုပ်ပါတယ်။ ဒါကြောင့် — text-format files တွေလိုမျိုး — ဒီ files တွေက table row တစ်ခုအတွက် line တစ်ကြောင်းစီ ဆိုတာမျိုး တိတိကျကျ မဟုတ်ပါဘူး။

> **မှတ်ချက်:** Program တွေ အများကြီးက ထူးဆန်းပြီး ရံဖန်ရံခါ ဆိုးရွားတဲ့ `CSV` files တွေကို ထုတ်လုပ်တတ်လို့ — ဒီ file format က standard တစ်ခုထက် convention (သဘောတူ လိုက်နာမှု) တစ်ခု ပိုပါတယ်။ ဒါကြောင့် — ဒီ mechanism ကို သုံးပြီး import လို့ မရတဲ့ files တချို့ကို ကြုံရနိုင်သလို — တခြား programs တွေ process မလုပ်နိုင်တဲ့ files တွေကိုလည်း `COPY` က ထုတ်လုပ်မိနိုင်ပါတယ်။

### Binary Format (binary ပုံစံ)

`binary` format option က — data တွေ အားလုံးကို text အဖြစ် မဟုတ်ဘဲ — binary format အဖြစ် သိမ်းဆည်း/ဖတ်ရှုစေပါတယ်။ ဒါက text နဲ့ `CSV` formats တွေထက် နည်းနည်း ပိုမြန်ပေမယ့် — binary-format file တစ်ခုက machine architectures တွေနဲ့ PostgreSQL versions တွေကြားမှာ portability (သယ်ယူ သုံးစွဲနိုင်မှု) ပိုနည်းပါတယ်။ ဒါ့အပြင် — binary format က data type တစ်ခုချင်းစီနဲ့ အလွန် သက်ဆိုင်နေပါတယ်; ဥပမာ — `smallint` column တစ်ခုကနေ binary data တွေကို output လုပ်ပြီး `integer` column တစ်ခုထဲကို ဖတ်တာမျိုး — text format မှာ ကောင်းကောင်း အလုပ်လုပ်နိုင်ပေမယ့် — binary မှာတော့ အလုပ်လုပ်မှာ မဟုတ်ပါဘူး။

`binary` file format မှာ — file header တစ်ခု၊ row data တွေ ပါဝင်တဲ့ tuples သုည ဒါမှမဟုတ် ထို့ထက်ပို၊ ပြီးတော့ file trailer တစ်ခု ပါဝင်ပါတယ်။ Headers တွေနဲ့ data တွေက network byte order (network byte order — ကြီးမားဆုံး byte အရင်ဆုံး အစီအစဉ်) နဲ့ ဖြစ်ပါတယ်။

> **မှတ်ချက်:** PostgreSQL 7.4 မတိုင်ခင် release တွေက မတူညီတဲ့ binary file format တစ်ခုကို သုံးခဲ့ပါတယ်။

#### File Header (file ရဲ့ header အပိုင်း)

File header မှာ — fixed fields တွေရဲ့ 15 bytes ပါဝင်ပြီး — နောက်မှာ variable-length ဖြစ်တဲ့ header extension area တစ်ခု လိုက်ပါတယ်။ Fixed fields တွေကတော့:

- **Signature** — 11-byte အစီအစဉ် `PGCOPY\n\377\r\n\0` — သတိပြုရမှာက — zero byte က signature ရဲ့ မဖြစ်မနေ လိုအပ်တဲ့ အစိတ်အပိုင်း တစ်ခု ဖြစ်ပါတယ်။ (Signature ကို — 8-bit-clean မဟုတ်တဲ့ transfer တစ်ခုကြောင့် ပျက်စီးသွားခဲ့တဲ့ files တွေကို လွယ်လွယ်ကူကူ ခွဲခြားသိရှိနိုင်ဖို့ ဒီဇိုင်း လုပ်ထားပါတယ်။ ဒီ signature ကို end-of-line-translation filters တွေ၊ ပြုတ်ကျသွားတဲ့ zero bytes တွေ၊ ပြုတ်ကျသွားတဲ့ high bits တွေ ဒါမှမဟုတ် parity ပြောင်းလဲမှုတွေက ပြောင်းလဲပစ်နိုင်ပါတယ်။)
- **Flags field** — File format ရဲ့ အရေးကြီးတဲ့ သွင်ပြင်လက္ခဏာတွေကို ဖော်ပြဖို့ 32-bit integer bit mask တစ်ခု။ Bits တွေကို 0 (LSB) ကနေ 31 (MSB) အထိ ရေတွက်ပါတယ်။ သတိပြုရမှာက — ဒီ field ကို file format ထဲမှာ သုံးတဲ့ integer fields တွေ အားလုံးလိုပဲ — network byte order (အရေးအကြီးဆုံး byte က ရှေ့ဆုံး) နဲ့ သိမ်းဆည်းပါတယ်။ Bits 16–31 တွေကို critical (အရေးကြီး) file format ကိစ္စတွေကို ဖော်ပြဖို့ သီးသန့် ထားထားပြီး — reader တစ်ခုက ဒီအကွာအဝေးထဲမှာ မမျှော်လင့်ထားတဲ့ bit တစ်ခု set ဖြစ်နေတာ တွေ့ရင် — abort လုပ်သင့်ပါတယ်။ Bits 0–15 တွေကိုတော့ backwards-compatible (နောက်ပြန် လိုက်ဖက်ညီ) format ကိစ္စတွေကို အချက်ပြဖို့ သီးသန့် ထားထားပြီး — reader တစ်ခုက ဒီအကွာအဝေးထဲမှာ set ဖြစ်နေတဲ့ မမျှော်လင့်ထားတဲ့ bits တွေကို ရိုးရိုးလေး လျစ်လျူရှုသင့်ပါတယ်။ လောလောဆယ် flag bit တစ်ခုတည်းကိုပဲ သတ်မှတ်ထားပြီး — ကျန် bits တွေကတော့ သုည ဖြစ်ရပါမယ်:

  **Bit 16** — 1 ဖြစ်ရင် OIDs တွေကို data ထဲမှာ ထည့်သွင်းပြီး — 0 ဖြစ်ရင် မထည့်သွင်းပါဘူး။ Oid system columns တွေကို PostgreSQL မှာ ထောက်ပံ့တော့ မဟုတ်တော့ပေမယ့် — format ထဲမှာတော့ အဲဒီ indicator (ညွှန်ပြချက်) ကို ဆက်ပြီး ထည့်ထားပါတယ်။
- **Header extension area length** — 32-bit integer တစ်ခု ဖြစ်ပြီး — header ရဲ့ ကျန် အစိတ်အပိုင်းရဲ့ အလျားကို bytes နဲ့ ဖော်ပြပါတယ် (ကိုယ်တိုင် မပါဝင်ပါဘူး)။ လောလောဆယ် ဒါက သုည ဖြစ်ပြီး — ပထမဆုံး tuple က ချက်ချင်း နောက်ကနေ လိုက်ပါတယ်။ Format ရဲ့ အနာဂတ် ပြောင်းလဲမှုတွေက header ထဲမှာ နောက်ထပ် data တွေ ရှိနေခွင့် ပြုနိုင်ပါတယ်။ Reader တစ်ခုက — ဘာလုပ်ရမှန်း မသိတဲ့ header extension data တစ်ခုခုကို — တိတ်တဆိတ် ကျော်သွားသင့်ပါတယ်။

Header extension area က — ကိုယ့်ကိုယ်ကိုယ် ခွဲခြားသိမြင်နိုင်တဲ့ (self-identifying) chunks တွေရဲ့ အစီအစဉ် တစ်ခု ပါဝင်ဖို့ မျှော်မှန်းထားပါတယ်။ Flags field က reader တွေကို extension area ထဲမှာ ဘာတွေ ရှိတယ်ဆိုတာ ပြောပြဖို့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။ Header extension ရဲ့ အကြောင်းအရာတွေရဲ့ တိကျတဲ့ ဒီဇိုင်းကို နောက်ပိုင်း release တစ်ခုအတွက် ချန်ထားပါတယ်။

ဒီဒီဇိုင်းက — backwards-compatible header ထပ်ဖြည့်မှုတွေ (header extension chunks တွေ ထည့်တာ၊ ဒါမှမဟုတ် low-order flag bits တွေ set လုပ်တာ) ရော — non-backwards-compatible ပြောင်းလဲမှုတွေ (အဲဒီလို ပြောင်းလဲမှုတွေကို အချက်ပြဖို့ high-order flag bits တွေ set လုပ်ပြီး — လိုအပ်ရင် extension area ထဲကို ထောက်ပံ့ပေးတဲ့ data တွေ ထည့်တာ) ရော — နှစ်မျိုးလုံးကို ခွင့်ပြုပါတယ်။

#### Tuples (tuple များ)

Tuple တစ်ခုချင်းစီက — tuple ထဲမှာ ပါဝင်တဲ့ fields အရေအတွက်ရဲ့ 16-bit integer count တစ်ခုနဲ့ စတင်ပါတယ်။ (လောလောဆယ် — table တစ်ခုထဲက tuples တွေ အားလုံးမှာ count အတူတူ ရှိပါလိမ့်မယ် — ဒါပေမယ့် အမြဲတော့ ဒီလို ဖြစ်ချင်မှ ဖြစ်ပါလိမ့်မယ်။) ပြီးရင် — tuple ထဲက field တစ်ခုချင်းစီအတွက် — 32-bit length word တစ်ခု ပြီးတော့ အဲဒီမျှလောက် bytes ပါတဲ့ field data တစ်ခု ထပ်ခါထပ်ခါ ပါဝင်ပါတယ်။ (Length word က ကိုယ်တိုင် မပါဝင်ဘဲ — သုည ဖြစ်နိုင်ပါတယ်။) အထူး ကိစ္စတစ်ခုအနေနဲ့ — -1 က NULL field value တစ်ခုကို ညွှန်ပြပါတယ်။ NULL ကိစ္စမှာ value bytes တွေ မပါဝင်ပါဘူး။

Fields တွေကြားမှာ alignment padding ဒါမှမဟုတ် တခြား အပို data ဘာမှ မရှိပါဘူး။

လောလောဆယ် — binary-format file တစ်ခုထဲက data values တွေ အားလုံးကို binary format (format code တစ်) နဲ့ ရှိတယ်လို့ ယူဆပါတယ်။ အနာဂတ် extension တစ်ခုက — per-column format codes တွေကို သတ်မှတ်ခွင့် ပြုတဲ့ header field တစ်ခုကို ထည့်နိုင်လိမ့်မယ်လို့ မျှော်မှန်းထားပါတယ်။

တကယ့် tuple data တွေအတွက် သင့်တော်တဲ့ binary format ကို ဆုံးဖြတ်ဖို့ — PostgreSQL source ကို တိုင်ပင်သင့်ပါတယ် — အထူးသဖြင့် column တစ်ခုချင်းစီရဲ့ data type အတွက် `*send` နဲ့ `*recv` functions တွေကို ကြည့်ပါ (ပုံမှန်အားဖြင့် ဒီ functions တွေကို source distribution ရဲ့ `src/backend/utils/adt/` directory ထဲမှာ တွေ့ရပါတယ်)။

OIDs တွေကို file ထဲမှာ ထည့်သွင်းထားရင် — OID field က field-count word ရဲ့ နောက်မှာ ချက်ချင်း လိုက်ပါတယ်။ ဒါက ပုံမှန် field တစ်ခုပါပဲ — ဒါပေမယ့် field-count ထဲမှာတော့ မပါဝင်ပါဘူး။ Oid system columns တွေကို PostgreSQL ရဲ့ လက်ရှိ version တွေမှာ ထောက်ပံ့မထားတော့ဘူးဆိုတာ သတိပြုပါ။

#### File Trailer (file ရဲ့ trailer အပိုင်း)

File trailer မှာ — -1 ပါဝင်တဲ့ 16-bit integer word တစ်ခု ပါဝင်ပါတယ်။ ဒါက tuple တစ်ခုရဲ့ field-count word ကနေ လွယ်ကူစွာ ခွဲခြားလို့ ရပါတယ်။

Field-count word တစ်ခုက -1 လည်း မဟုတ်၊ မျှော်လင့်ထားတဲ့ columns အရေအတွက်လည်း မဟုတ်ဘူးဆိုရင် — reader တစ်ခုက error တစ်ခု အစီရင်ခံသင့်ပါတယ်။ ဒါက — data နဲ့ တစ်နည်းနည်းနဲ့ လွဲချော်သွားတာ (out of sync) မဖြစ်အောင် နောက်ထပ် စစ်ဆေးမှု တစ်ခု ပေးပါတယ်။

## Examples (ဥပမာများ)

အောက်ပါ ဥပမာက — field delimiter အဖြစ် vertical bar (`|`) ကို သုံးပြီး — table တစ်ခုကို client ဆီ ကူးယူပါတယ်:

```sql
COPY country TO STDOUT (DELIMITER '|');
```

`country` table ထဲကို file တစ်ခုကနေ data တွေ ကူးယူဖို့:

```sql
COPY country FROM '/usr1/proj/bray/sql/country_data';
```

နာမည်တွေက 'A' နဲ့ စတင်တဲ့ countries တွေကိုပဲ file တစ်ခုထဲကို ကူးယူဖို့:

```sql
COPY (SELECT * FROM country WHERE country_name LIKE 'A%') TO '/usr1/proj/bray/sql/a_list_countries.copy';
```

Compressed file တစ်ခုထဲကို ကူးယူဖို့ — output ကို အပြင်ဘက် compression program တစ်ခုကနေ pipe လုပ်နိုင်ပါတယ်:

```sql
COPY country TO PROGRAM 'gzip > /usr1/proj/bray/sql/country_data.gz';
```

ဒီကတော့ `STDIN` ကနေ table တစ်ခုထဲကို ကူးယူဖို့ သင့်တော်တဲ့ data နမူနာ တစ်ခု ဖြစ်ပါတယ်:

```sql
AF      AFGHANISTAN
AL      ALBANIA
DZ      ALGERIA
ZM      ZAMBIA
ZW      ZIMBABWE
```

Line တစ်ကြောင်းချင်းစီပေါ်က white space က တကယ်တော့ tab character တစ်ခု ဖြစ်တယ်ဆိုတာ သတိပြုပါ။

အောက်ပါကတော့ — အဲဒီ data အတိုင်းပဲ — binary format နဲ့ output လုပ်ထားတာ ဖြစ်ပါတယ်။ Data ကို Unix utility ဖြစ်တဲ့ `od -c` ကနေ filter လုပ်ပြီးမှ ပြထားတာပါ။ Table မှာ column သုံးခု ရှိပြီး — ပထမတစ်ခုက `char(2)` type၊ ဒုတိယတစ်ခုက `text` type၊ တတိယတစ်ခုက `integer` type ဖြစ်ပါတယ်။ Rows တွေ အားလုံးမှာ တတိယ column က null value ဖြစ်ပါတယ်။

```sql
0000000   P   G   C   O   P   Y  \n 377  \r  \n  \0  \0  \0  \0  \0  \0
0000020  \0  \0  \0  \0 003  \0  \0  \0 002   A   F  \0  \0  \0 013   A
0000040   F   G   H   A   N   I   S   T   A   N 377 377 377 377  \0 003
0000060  \0  \0  \0 002   A   L  \0  \0  \0 007   A   L   B   A   N   I
0000100   A 377 377 377 377  \0 003  \0  \0  \0 002   D   Z  \0  \0  \0
0000120 007   A   L   G   E   R   I   A 377 377 377 377  \0 003  \0  \0
0000140  \0 002   Z   M  \0  \0  \0 006   Z   A   M   B   I   A 377 377
0000160 377 377  \0 003  \0  \0  \0 002   Z   W  \0  \0  \0  \b   Z   I
0000200   M   B   A   B   W   E 377 377 377 377 377 377
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard မှာ `COPY` statement ဆိုတာ မရှိပါဘူး။

အောက်ပါ syntax ကို PostgreSQL version 9.0 မတိုင်ခင်က သုံးခဲ့ပြီး — အခုထိ ထောက်ပံ့နေဆဲ ဖြစ်ပါတယ်:

```sql
COPY table_name [ ( column_name [, ...] ) ]
    FROM { 'filename' | STDIN }
    [ [ WITH ]
          [ BINARY ]
          [ DELIMITER [ AS ] 'delimiter_character' ]
          [ NULL [ AS ] 'null_string' ]
          [ CSV [ HEADER ]
                [ QUOTE [ AS ] 'quote_character' ]
                [ ESCAPE [ AS ] 'escape_character' ]
                [ FORCE NOT NULL column_name [, ...] ] ] ]

COPY { table_name [ ( column_name [, ...] ) ] | ( query ) }
    TO { 'filename' | STDOUT }
    [ [ WITH ]
          [ BINARY ]
          [ DELIMITER [ AS ] 'delimiter_character' ]
          [ NULL [ AS ] 'null_string' ]
          [ CSV [ HEADER ]
                [ QUOTE [ AS ] 'quote_character' ]
                [ ESCAPE [ AS ] 'escape_character' ]
                [ FORCE QUOTE { column_name [, ...] | * } ] ] ]
```

ဒီ syntax မှာ `BINARY` နဲ့ `CSV` တွေကို — `FORMAT` option ရဲ့ arguments တွေ အနေနဲ့ မဟုတ်ဘဲ — သီးခြားစီ ရပ်တည်တဲ့ (independent) keywords တွေ အနေနဲ့ သဘောထားတယ်ဆိုတာ သတိပြုပါ။

အောက်ပါ syntax ကို PostgreSQL version 7.3 မတိုင်ခင်က သုံးခဲ့ပြီး — အခုထိ ထောက်ပံ့နေဆဲ ဖြစ်ပါတယ်:

```sql
COPY [ BINARY ] table_name
    FROM { 'filename' | STDIN }
    [ [USING] DELIMITERS 'delimiter_character' ]
    [ WITH NULL AS 'null_string' ]

COPY [ BINARY ] table_name
    TO { 'filename' | STDOUT }
    [ [USING] DELIMITERS 'delimiter_character' ]
    [ WITH NULL AS 'null_string' ]
```

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[အပိုင်း 27.4.3](https://www.postgresql.org/docs/current/progress-reporting.html#COPY-PROGRESS-REPORTING)
