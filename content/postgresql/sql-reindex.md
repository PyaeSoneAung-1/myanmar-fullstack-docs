---
title: "REINDEX (index များကို ပြန်လည်တည်ဆောက်ခြင်း)"
description: "Index တစ်ခုကို index ၏ table ထဲတွင် သိမ်းဆည်းထားသော data များကို သုံးပြီး ပြန်လည်တည်ဆောက်ပေးသော REINDEX command — INDEX/TABLE/SCHEMA/DATABASE/SYSTEM ပုံစံများ၊ CONCURRENTLY ဖြင့် တစ်ပြိုင်နက် ပြန်လည်တည်ဆောက်ခြင်း လုပ်ငန်းစဉ်နှင့် အဆင့်များ၊ TABLESPACE နှင့် VERBOSE option များအကြောင်း ရှင်းလင်းချက်"
order: 179
source: "https://www.postgresql.org/docs/current/sql-reindex.html"
status: translated
updated: 2026-09-04
---

## REINDEX (index များကို ပြန်လည်တည်ဆောက်ခြင်း)

REINDEX — indexes (အညွှန်းများ) တွေကို ပြန်လည် တည်ဆောက်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
REINDEX [ ( option [, ...] ) ] { INDEX | TABLE | SCHEMA } [ CONCURRENTLY ] name
REINDEX [ ( option [, ...] ) ] { DATABASE | SYSTEM } [ CONCURRENTLY ] [ name ]

where option can be one of:

    CONCURRENTLY [ boolean ]
    TABLESPACE new_tablespace
    VERBOSE [ boolean ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`REINDEX` က index တစ်ခုရဲ့ table ထဲမှာ သိမ်းဆည်းထားတဲ့ data တွေကို သုံးပြီး — index ရဲ့ မိတ္တူဟောင်းကို အစားထိုးကာ — index ကို ပြန်လည် တည်ဆောက်ပေးပါတယ်။ `REINDEX` ကို သုံးရတဲ့ အခြေအနေ ပုံစံများစွာ ရှိပါတယ်:

- Index တစ်ခု ပျက်စီး (corrupt) သွားပြီး — valid data တွေ မပါဝင်တော့တာ။ သီအိုရီအရ ဒါ ဘယ်တော့မှ မဖြစ်သင့်ပေမယ့် — လက်တွေ့မှာတော့ — software bugs ဒါမှမဟုတ် hardware failures တွေကြောင့် — indexes တွေ ပျက်စီးသွားနိုင်ပါတယ်။ REINDEX က ပြန်လည် ရယူနိုင်တဲ့ (recovery) နည်းလမ်းတစ်ခုကို ပေးပါတယ်။
- Index တစ်ခု "bloated" (ဖောင်းပွနေသော) ဖြစ်နေတာ — ဆိုလိုတာက — အလွတ် ဒါမှမဟုတ် အလွတ်နီးပါး pages တွေ အများအပြား ပါဝင်နေတာပါ။ PostgreSQL မှာ B-tree indexes တွေနဲ့ဆိုရင် — သာမန်မဟုတ်တဲ့ access patterns တချို့အောက်မှာ — ဒါ ဖြစ်ပေါ်နိုင်ပါတယ်။ REINDEX က dead pages တွေ မပါတဲ့ index ဗားရှင်းအသစ်တစ်ခုကို ရေးသားခြင်းအားဖြင့် — index ရဲ့ နေရာ သုံးစွဲမှုကို လျှော့ချဖို့ နည်းလမ်းတစ်ခု ပေးပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် အပိုင်း 24.2 ကို ကြည့်ပါ။
- Index တစ်ခုအတွက် storage parameter တစ်ခု (ဥပမာ — fillfactor) ကို ပြောင်းလဲလိုက်ပြီး — အဲဒီ ပြောင်းလဲမှုက အပြည့်အဝ အကျိုးသက်ရောက်မှု ရှိစေချင်တာ။
- Index build တစ်ခုက `CONCURRENTLY` option နဲ့ မအောင်မြင်ခဲ့ရင် — အဲဒီ index ကို "invalid" အဖြစ် ကျန်ရစ်ခဲ့ပါတယ်။ ဒီလို indexes တွေက အသုံးမဝင်ပေမယ့် — သူတို့ကို ပြန်လည် တည်ဆောက်ဖို့ `REINDEX` ကို သုံးတာက အဆင်ပြေနိုင်ပါတယ်။ Invalid index တစ်ခုပေါ်မှာ concurrent build လုပ်နိုင်တာ `REINDEX INDEX` တစ်ခုတည်းသာ ဆိုတာ သတိပြုပါ။

## Parameters (parameter များ)

- **INDEX** — သတ်မှတ်ထားတဲ့ index ကို ပြန်လည် ဖန်တီးပါတယ်။ ဒီ REINDEX ပုံစံကို partitioned index တစ်ခုနဲ့ သုံးတဲ့အခါ — transaction block အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။
- **TABLE** — သတ်မှတ်ထားတဲ့ table ရဲ့ indexes တွေ အားလုံးကို ပြန်လည် ဖန်တီးပါတယ်။ Table မှာ secondary "TOAST" table တစ်ခု ရှိရင် — အဲဒါကိုပါ reindex လုပ်ပါတယ်။ ဒီ REINDEX ပုံစံကို partitioned table တစ်ခုနဲ့ သုံးတဲ့အခါ — transaction block အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။
- **SCHEMA** — သတ်မှတ်ထားတဲ့ schema ရဲ့ indexes တွေ အားလုံးကို ပြန်လည် ဖန်တီးပါတယ်။ ဒီ schema ရဲ့ table တစ်ခုမှာ secondary "TOAST" table တစ်ခု ရှိရင် — အဲဒါကိုပါ reindex လုပ်ပါတယ်။ Shared system catalogs တွေပေါ်က indexes တွေကိုလည်း process လုပ်ပါတယ်။ ဒီ REINDEX ပုံစံကို transaction block အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။
- **DATABASE** — current database အတွင်းက indexes တွေ အားလုံးကို — system catalogs တွေ ကလွဲလို့ — ပြန်လည် ဖန်တီးပါတယ်။ System catalogs တွေပေါ်က indexes တွေကိုတော့ process မလုပ်ပါဘူး။ ဒီ REINDEX ပုံစံကို transaction block အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။
- **SYSTEM** — current database အတွင်းက system catalogs တွေပေါ်က indexes တွေ အားလုံးကို ပြန်လည် ဖန်တီးပါတယ်။ Shared system catalogs တွေပေါ်က indexes တွေလည်း ပါဝင်ပါတယ်။ User tables တွေပေါ်က indexes တွေကိုတော့ process မလုပ်ပါဘူး။ ဒီ REINDEX ပုံစံကို transaction block အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။
- **name** — Reindex လုပ်ရမယ့် တိကျတဲ့ index, table ဒါမှမဟုတ် database ရဲ့ နာမည်။ Index နဲ့ table နာမည်တွေကို schema-qualified လုပ်နိုင်ပါတယ်။ လောလောဆယ် — `REINDEX DATABASE` နဲ့ `REINDEX SYSTEM` တို့က current database ကိုပဲ reindex လုပ်နိုင်ပါတယ်။ သူတို့ရဲ့ parameter က optional ဖြစ်ပြီး — current database ရဲ့ နာမည်နဲ့ ကိုက်ညီရပါမယ်။
- **CONCURRENTLY** — ဒီ option ကို သုံးတဲ့အခါ — PostgreSQL က table ပေါ်မှာ တစ်ပြိုင်နက် inserts, updates ဒါမှမဟုတ် deletes တွေကို တားဆီးမယ့် locks တွေ ဘာမှ မယူဘဲ — index ကို ပြန်လည် တည်ဆောက်ပေးပါတယ်; သာမန် index rebuild တစ်ခုကတော့ ပြီးဆုံးတဲ့အထိ table ပေါ်မှာ writes တွေကို (reads တွေကိုတော့ မဟုတ်ဘဲ) lock ပိတ်ထားပါတယ်။ ဒီ option ကို သုံးတဲ့အခါ သတိထားရမယ့် caveats (ကြိုတင် သတိပြုရန် အချက်များ) တွေ အများအပြား ရှိပါတယ် — အောက်က Rebuilding Indexes Concurrently (index များကို တစ်ပြိုင်နက် ပြန်လည်တည်ဆောက်ခြင်း) ကို ကြည့်ပါ။

Temporary tables တွေအတွက် — REINDEX က အမြဲတမ်း non-concurrent ဖြစ်ပါတယ် — အကြောင်းကတော့ တခြား session တစ်ခုကမှ သူတို့ကို access လုပ်လို့ မရလို့ပါ — ပြီးတော့ non-concurrent reindex က ပိုသက်သာပါတယ်။
- **TABLESPACE** — indexes တွေကို tablespace အသစ်တစ်ခုပေါ်မှာ ပြန်လည် တည်ဆောက်မယ်လို့ သတ်မှတ်ပေးပါတယ်။
- **VERBOSE** — index တစ်ခုချင်းစီကို reindex လုပ်တဲ့အခါ — INFO level မှာ progress report (လုပ်ဆောင်မှု အခြေအနေ အစီရင်ခံစာ) တစ်ခု ရိုက်နှိပ်ပေးပါတယ်။
- **boolean** — ရွေးချယ်ထားတဲ့ option ကို ဖွင့်မလား ပိတ်မလားဆိုတာ သတ်မှတ်ပေးပါတယ်။ Option ကို ဖွင့်ဖို့ TRUE, ON ဒါမှမဟုတ် 1 ကို ရေးနိုင်ပြီး — ပိတ်ဖို့ FALSE, OFF ဒါမှမဟုတ် 0 ကို ရေးနိုင်ပါတယ်။ Boolean တန်ဖိုးကို ချန်လိုက်လို့လည်း ရပြီး — အဲဒီလိုဆိုရင် TRUE လို့ ယူဆပါတယ်။
- **new_tablespace** — indexes တွေကို ပြန်လည် တည်ဆောက်မယ့် tablespace။

## Notes (မှတ်စုများ)

User table တစ်ခုပေါ်က index တစ်ခု ပျက်စီးနေတယ်လို့ သံသယ ရှိရင် — `REINDEX INDEX` ဒါမှမဟုတ် `REINDEX TABLE` ကို သုံးပြီး — အဲဒီ index တစ်ခုတည်း ဒါမှမဟုတ် table ပေါ်က indexes အားလုံးကို ရိုးရိုး ပြန်လည် တည်ဆောက်လိုက်ရုံပါပဲ။

System table တစ်ခုပေါ်က index တစ်ခု ပျက်စီးမှုကနေ ပြန်လည် ရယူဖို့ လိုအပ်ရင်တော့ — အခြေအနေတွေက ပိုခက်ခဲပါတယ်။ ဒီကိစ္စမှာ — system ကိုယ်တိုင်က သံသယဖြစ်စရာ indexes တွေထဲက ဘယ်ဟာကိုမှ မသုံးထားမိဖို့ အရေးကြီးပါတယ်။ (တကယ်တော့ — ဒီလို အခြေအနေမျိုးမှာ — ပျက်စီးနေတဲ့ indexes တွေပေါ်မှာ မှီခိုနေလို့ — server processes တွေ start-up မှာ ချက်ချင်း crash ဖြစ်နေတာကို တွေ့ရနိုင်ပါတယ်။) လုံခြုံစွာ ပြန်လည် ရယူဖို့ — server ကို `-P` option နဲ့ စတင်ရပါမယ် — ဒီ option က system catalog lookups တွေအတွက် indexes တွေကို အသုံးပြုခြင်းကနေ တားဆီးပေးပါတယ်။

ဒါလုပ်ဖို့ နည်းလမ်းတစ်ခုက — server ကို ပိတ်ပြီး — command line မှာ `-P` option ပါတဲ့ single-user PostgreSQL server (တစ်ဦးတည်း အသုံးပြုသူ PostgreSQL server) တစ်ခုကို စတင်တာပါ။ ပြီးရင် — ဘယ်လောက်အထိ ပြန်လည် တည်ဆောက်ချင်လဲပေါ် မူတည်ပြီး — `REINDEX DATABASE`, `REINDEX SYSTEM`, `REINDEX TABLE` ဒါမှမဟုတ် `REINDEX INDEX` ကို ထုတ်ပြန်နိုင်ပါတယ်။ မသေချာရင် — database ထဲက system indexes တွေ အားလုံးကို ပြန်လည် တည်ဆောက်ဖို့ — `REINDEX SYSTEM` ကို သုံးပါ။ ပြီးရင် — single-user server session ကနေ ထွက်ပြီး — သာမန် server ကို ပြန်လည် စတင်ပါ။ Single-user server interface (တစ်ဦးတည်း အသုံးပြုသူ server မျက်နှာပြင်) နဲ့ ဘယ်လို အပြန်အလှန် ဆက်သွယ်ရမလဲဆိုတဲ့ နောက်ထပ် အချက်အလက်အတွက် — [postgres](https://www.postgresql.org/docs/current/app-postgres.html) reference page ကို ကြည့်ပါ။

တနည်းအားဖြင့် — သာမန် server session တစ်ခုကို — command line options တွေထဲမှာ `-P` ပါဝင်တဲ့အနေနဲ့ စတင်နိုင်ပါတယ်။ ဒါလုပ်ဖို့ နည်းလမ်းက client တွေပေါ် မူတည်ပြီး ကွဲပြားပေမယ့် — libpq-based clients တွေ အားလုံးမှာတော့ — client ကို မစတင်ခင် `PGOPTIONS` environment variable ကို `-P` အဖြစ် သတ်မှတ်နိုင်ပါတယ်။ ဒီနည်းလမ်းက တခြား clients တွေကို lock ပိတ်ဖို့ မလိုအပ်ပေမယ့် — ပြုပြင်မှုတွေ ပြီးစီးတဲ့အထိ — တခြား users တွေ ပျက်စီးနေတဲ့ database ဆီ ချိတ်ဆက်ခြင်းကနေ တားဆီးထားဖို့ — ပညာရှိရာကျပါသေးတယ်။

`REINDEX` က — index ရဲ့ အကြောင်းအရာတွေကို အစမှ ပြန်လည် တည်ဆောက်တယ်ဆိုတဲ့ အနေနဲ့ — index ကို drop ပြီး ပြန်ဖန်တီးတာနဲ့ ဆင်တူပါတယ်။ ဒါပေမယ့် — locking ဆိုင်ရာ ထည့်သွင်း စဉ်းစားစရာတွေကတော့ အတော်ကို ကွဲပြားပါတယ်။ `REINDEX` က index ရဲ့ parent table ပေါ်မှာ — writes တွေကို lock ပိတ်ပေမယ့် — reads တွေကိုတော့ ပိတ်မထားပါဘူး။ ဒါ့အပြင် — process လုပ်နေတဲ့ တိကျတဲ့ index ပေါ်မှာ `ACCESS EXCLUSIVE` lock တစ်ခုကိုလည်း ယူပြီး — အဲဒီ index ကို သုံးဖို့ ကြိုးစားတဲ့ reads တွေကို ပိတ်ဆို့ပါလိမ့်မယ်။ အထူးသဖြင့် — query planner က query ဘယ်လိုပဲ ရှိရှိ — table ရဲ့ index တိုင်းပေါ်မှာ `ACCESS SHARE` lock တစ်ခု ယူဖို့ ကြိုးစားတာမို့ — plan ကို cache လုပ်ထားပြီး ဒီ index ကိုယ်တိုင် မသုံးတဲ့ prepared queries (ကြိုတင် ပြင်ဆင်ထားသော queries) တချို့ ကလွဲလို့ — `REINDEX` က queries တွေ အားလုံးနီးပါးကို ပိတ်ဆို့ပါတယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — `DROP INDEX` က parent table ပေါ်မှာ `ACCESS EXCLUSIVE` lock တစ်ခုကို ခဏတာ ယူပြီး — writes ရော reads ရော နှစ်ခုလုံးကို ပိတ်ဆို့ပါတယ်။ နောက်က လိုက်တဲ့ `CREATE INDEX` က writes တွေကို lock ပိတ်ပေမယ့် — reads တွေကိုတော့ မပိတ်ပါဘူး; index က မရှိတော့တာမို့ — read တစ်ခုကမှ အဲဒါကို သုံးဖို့ ကြိုးစားမှာ မဟုတ်တဲ့အတွက် — ပိတ်ဆို့မှု ရှိမှာ မဟုတ်ပေမယ့် — reads တွေက စျေးကြီးတဲ့ sequential scans (စဉ်ဆက်တိုက် scan များ) တွေဆီ အတင်း ရောက်သွားနိုင်ပါတယ်။

`REINDEX` run နေတုန်းမှာ — [search_path](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SEARCH-PATH) ကို `pg_catalog, pg_temp` အဖြစ် ယာယီ ပြောင်းလဲထားပါတယ်။

Index တစ်ခုတည်း ဒါမှမဟုတ် table တစ်ခုကို reindex လုပ်ဖို့ — table ပေါ်မှာ `MAINTAIN` privilege ရှိရပါမယ်။ Partitioned index ဒါမှမဟုတ် partitioned table ပေါ်မှာ `REINDEX` လုပ်တာက partitioned table ပေါ်မှာ `MAINTAIN` privilege ရှိဖို့ လိုအပ်ပေမယ့် — ဒီလို commands တွေက partition တစ်ခုချင်းစီကို process လုပ်တဲ့အခါ privilege checks တွေကို ကျော်လိုက်တယ်ဆိုတာ သတိပြုပါ။ Schema တစ်ခု ဒါမှမဟုတ် database တစ်ခုကို reindex လုပ်ဖို့ — အဲဒီ schema ဒါမှမဟုတ် database ရဲ့ owner ဖြစ်ရပါမယ် ဒါမှမဟုတ် [pg_maintain](https://www.postgresql.org/docs/current/predefined-roles.html#PREDEFINED-ROLE-PG-MAINTAIN) role ရဲ့ privileges တွေ ရှိရပါမယ်။ အထူးသဖြင့် — ဒါကြောင့် — non-superusers တွေက — တခြား users တွေ ပိုင်ဆိုင်တဲ့ tables တွေရဲ့ indexes တွေကို ပြန်လည် တည်ဆောက်နိုင်တယ်ဆိုတာ သတိပြုပါ။ ဒါပေမယ့် — ချွင်းချက် တစ်ခုအနေနဲ့ — user က catalog ပေါ်မှာ `MAINTAIN` privilege မရှိရင် — `REINDEX DATABASE`, `REINDEX SCHEMA` နဲ့ `REINDEX SYSTEM` တို့က shared catalogs တွေပေါ်က indexes တွေကို ကျော်လိုက်ပါလိမ့်မယ်။

Partitioned indexes ဒါမှမဟုတ် partitioned tables တွေကို reindex လုပ်တာကို — အသီးသီး — `REINDEX INDEX` ဒါမှမဟုတ် `REINDEX TABLE` နဲ့ ထောက်ပံ့ပါတယ်။ သတ်မှတ်ထားတဲ့ partitioned relation ရဲ့ partition တစ်ခုချင်းစီကို သီးခြား transaction တစ်ခုစီထဲမှာ reindex လုပ်ပါတယ်။ Partitioned table ဒါမှမဟုတ် index တစ်ခုပေါ်မှာ အလုပ်လုပ်တဲ့အခါ — ဒီ commands တွေကို transaction block အတွင်းမှာ သုံးလို့ မရပါဘူး။

Partitioned index ဒါမှမဟုတ် partitioned table တစ်ခုပေါ်မှာ `REINDEX` နဲ့အတူ `TABLESPACE` clause ကို သုံးတဲ့အခါ — leaf partitions (အရွက် partition များ) တွေရဲ့ tablespace references တွေကိုပဲ update လုပ်ပါတယ်။ Partitioned indexes တွေကို update မလုပ်တာမို့ — partitions အသစ်တွေ ဘယ်ဟာမဆို attach ဖြစ်လာရင် tablespace အသစ်ကို အမွေရစေဖို့ — သူတို့ပေါ်မှာ `ALTER TABLE ONLY` ကို သီးခြားစီ အသုံးပြုဖို့ အကြံပြုပါတယ်။ မအောင်မြင်ခဲ့ရင် — indexes တွေ အားလုံးကို tablespace အသစ်ဆီ ရွှေ့ပြီးသား မဖြစ်နိုင်ပါဘူး။ Command ကို ပြန် run လိုက်ရင် — leaf partitions တွေ အားလုံးကို ပြန်လည် တည်ဆောက်ပြီး — အရင် process မလုပ်ရသေးတဲ့ indexes တွေကို tablespace အသစ်ဆီ ရွှေ့ပေးပါလိမ့်မယ်။

`TABLESPACE` နဲ့အတူ `SCHEMA`, `DATABASE` ဒါမှမဟုတ် `SYSTEM` ကို သုံးရင် — system relations တွေကို ကျော်လိုက်ပြီး — `WARNING` တစ်ခုတည်း ထုတ်ပေးပါလိမ့်မယ်။ TOAST tables တွေပေါ်က indexes တွေကို ပြန်လည် တည်ဆောက်ပေမယ့် — tablespace အသစ်ဆီ ရွှေ့ပြောင်းတော့ မလုပ်ပါဘူး။

### Rebuilding Indexes Concurrently (index များကို တစ်ပြိုင်နက် ပြန်လည်တည်ဆောက်ခြင်း)

Index တစ်ခုကို ပြန်လည် တည်ဆောက်တာက database တစ်ခုရဲ့ ပုံမှန် လည်ပတ်မှုကို အနှောင့်အယှက် ဖြစ်စေနိုင်ပါတယ်။ ပုံမှန်အားဖြင့် — PostgreSQL က — index ကို ပြန်လည် တည်ဆောက်နေတဲ့ table ကို writes တွေရန် lock ပိတ်ပြီး — index build တစ်ခုလုံးကို table ရဲ့ scan တစ်ခုတည်းနဲ့ လုပ်ဆောင်ပါတယ်။ တခြား transactions တွေက table ကို ဆက် ဖတ်နိုင်ပါသေးတယ် — ဒါပေမယ့် — သူတို့က table ထဲကို rows တွေ insert, update ဒါမှမဟုတ် delete လုပ်ဖို့ ကြိုးစားရင် — index rebuild ပြီးဆုံးတဲ့အထိ ပိတ်ဆို့ခံရပါလိမ့်မယ်။ System က live production database တစ်ခု ဆိုရင် — ဒါက ပြင်းထန်တဲ့ သက်ရောက်မှု ရှိနိုင်ပါတယ်။ အလွန် ကြီးမားတဲ့ tables တွေကို index လုပ်ဖို့ နာရီပေါင်းများစွာ ကြာနိုင်ပြီး — သေးငယ်တဲ့ tables တွေအတွက်တောင် — index rebuild တစ်ခုက production system တစ်ခုအတွက် လက်မခံနိုင်လောက်အောင် ကြာမြင့်တဲ့ ကာလတွေအတွက် writers တွေကို lock ပိတ်ထားနိုင်ပါတယ်။

PostgreSQL က — writes တွေကို အနည်းဆုံး lock လုပ်ရုံနဲ့ indexes တွေကို ပြန်လည် တည်ဆောက်တာကို ထောက်ပံ့ပါတယ်။ ဒီနည်းလမ်းကို — `REINDEX` ရဲ့ `CONCURRENTLY` option ကို သတ်မှတ်ခြင်းအားဖြင့် ခေါ်ယူပါတယ်။ ဒီ option ကို သုံးတဲ့အခါ — PostgreSQL က — ပြန်လည် တည်ဆောက်ရမယ့် index တစ်ခုချင်းစီအတွက် — table ကို scan နှစ်ကြိမ် လုပ်ဆောင်ပြီး — index ကို အသုံးပြုနိုင်ခြေ ရှိတဲ့ — ရှိပြီးသား transactions တွေ အားလုံး ပြီးဆုံးတာကို စောင့်ဆိုင်းရပါတယ်။ ဒီနည်းလမ်းက သာမန် index rebuild တစ်ခုထက် စုစုပေါင်း အလုပ် ပိုလိုအပ်ပြီး — index ကို ပြုပြင်နိုင်တဲ့ မပြီးပြတ်သေးတဲ့ transactions တွေကို စောင့်ရတာမို့ — ပြီးဆုံးဖို့ သိသိသာသာ ပိုကြာပါတယ်။ ဒါပေမယ့် — index ကို ပြန်လည် တည်ဆောက်နေစဉ် ပုံမှန် operations တွေ ဆက်လုပ်ခွင့် ရှိတာမို့ — production environment တစ်ခုမှာ indexes တွေကို ပြန်လည် တည်ဆောက်ဖို့ ဒီနည်းလမ်းက အသုံးဝင်ပါတယ်။ သေချာတာကတော့ — index rebuild က ဖြစ်ပေါ်စေတဲ့ အပို CPU, memory နဲ့ I/O ဝန်ထုတ်ဝန်ပိုးတွေက တခြား operations တွေကို နှေးကွေးစေနိုင်ပါတယ်။

Concurrent reindex တစ်ခုမှာ အောက်ပါ အဆင့်တွေ ဖြစ်ပေါ်ပါတယ်။ အဆင့်တစ်ခုချင်းစီကို သီးခြား transaction တစ်ခုထဲမှာ run ပါတယ်။ ပြန်လည် တည်ဆောက်ရမယ့် indexes အများအပြား ရှိရင် — အဆင့်တစ်ခုချင်းစီက နောက် အဆင့်တစ်ခုဆီ မရွှေ့ခင် — indexes တွေ အားလုံးကို ဖြတ်ပြီး loop လုပ်ပါတယ်။

1. `pg_index` catalog ထဲကို transient index definition အသစ်တစ်ခု ထည့်သွင်းပါတယ်။ ဒီ definition ကို index အဟောင်းကို အစားထိုးဖို့ သုံးပါလိမ့်မယ်။ Process လုပ်နေစဉ် schema modification မဖြစ်အောင် တားဆီးဖို့ — reindex လုပ်နေတဲ့ indexes တွေနဲ့ သူတို့နဲ့ ဆက်စပ်တဲ့ tables တွေပေါ်မှာ — session level မှာ `SHARE UPDATE EXCLUSIVE` lock တစ်ခု ရယူပါတယ်။
2. Index အသစ်တစ်ခုချင်းစီအတွက် — index ကို တည်ဆောက်ဖို့ ပထမ pass (အကြိမ်) တစ်ခု လုပ်ဆောင်ပါတယ်။ Index တည်ဆောက်ပြီးတာနဲ့ — inserts တွေ လက်ခံနိုင်ဖို့ သူ့ရဲ့ `pg_index.indisready` flag ကို "true" အဖြစ် ပြောင်းလိုက်ပြီး — index ကို တည်ဆောက်ခဲ့တဲ့ transaction ပြီးဆုံးတာနဲ့ — တခြား sessions တွေကို မြင်နိုင်စေပါတယ်။ ဒီအဆင့်ကို index တစ်ခုချင်းစီအတွက် သီးခြား transaction တစ်ခုထဲမှာ လုပ်ဆောင်ပါတယ်။
3. ပြီးတော့ — ပထမ pass run နေစဉ် ထပ်ဖြည့်ခဲ့တဲ့ tuples တွေကို ထည့်သွင်းဖို့ ဒုတိယ pass တစ်ခု လုပ်ဆောင်ပါတယ်။ ဒီအဆင့်ကိုလည်း index တစ်ခုချင်းစီအတွက် သီးခြား transaction တစ်ခုထဲမှာ လုပ်ဆောင်ပါတယ်။
4. Index ကို ရည်ညွှန်းနေတဲ့ constraints တွေ အားလုံးကို — index definition အသစ်ကို ရည်ညွှန်းအောင် ပြောင်းလဲပြီး — indexes တွေရဲ့ နာမည်တွေကိုလည်း ပြောင်းလဲပါတယ်။ ဒီအချိန်မှာ — `pg_index.indisvalid` ကို index အသစ်အတွက် "true" အဖြစ်၊ index အဟောင်းအတွက် "false" အဖြစ် ပြောင်းပြီး — index အဟောင်းကို ရည်ညွှန်းခဲ့တဲ့ sessions တွေ အားလုံး invalid ဖြစ်အောင် — cache invalidation (cache ပြန်လည် မှန်ကန်စေခြင်း) တစ်ခု လုပ်ဆောင်ပါတယ်။
5. Index အဟောင်းကို ရည်ညွှန်းနိုင်တဲ့ run နေတဲ့ queries တွေ ပြီးဆုံးတာကို စောင့်ပြီးမှ — tuple insertions အသစ်တွေ မဖြစ်အောင် တားဆီးဖို့ — indexes အဟောင်းတွေရဲ့ `pg_index.indisready` ကို "false" အဖြစ် ပြောင်းလဲပါတယ်။
6. Indexes အဟောင်းတွေကို drop လုပ်ပါတယ်။ Indexes တွေနဲ့ table အတွက် `SHARE UPDATE EXCLUSIVE` session locks တွေကို လွှတ်ပေးပါတယ်။

Indexes တွေကို ပြန်လည် တည်ဆောက်နေစဉ် — unique index တစ်ခုမှာ uniqueness violation (ထူးခြားမှု ချိုးဖောက်မှု) တစ်ခုလို — ပြဿနာ တစ်ခုခု ဖြစ်ပေါ်လာရင် — `REINDEX` command က မအောင်မြင်ဘဲ — အရင် ရှိပြီးသား index အပြင် "invalid" index အသစ်တစ်ခုကိုပါ ချန်ရစ်ခဲ့ပါလိမ့်မယ်။ ဒီ index က မပြည့်စုံ (incomplete) ဖြစ်နိုင်တာမို့ — query လုပ်ဖို့ ရည်ရွယ်ချက်တွေအတွက် လျစ်လျူရှုခံရပါလိမ့်မယ်; ဒါပေမယ့် — update overhead ကိုတော့ ဆက်ပြီး သုံးစွဲနေဦးမှာ ဖြစ်ပါတယ်။ psql ရဲ့ `\d` command က ဒီလို index တစ်ခုကို `INVALID` အဖြစ် အစီရင်ခံပါလိမ့်မယ်:

```
postgres=# \d tab
       Table "public.tab"
 Column |  Type   | Modifiers
--------+---------+-----------
 col    | integer |
Indexes:
    "idx" btree (col)
    "idx_ccnew" btree (col) INVALID
```

`INVALID` လို့ မှတ်သားထားတဲ့ index ရဲ့ နောက်ဆက်တွဲ (suffix) က `_ccnew` ဆိုရင် — အဲဒါက concurrent operation အတွင်း ဖန်တီးခဲ့တဲ့ transient index နဲ့ ကိုက်ညီပြီး — အကြံပြုထားတဲ့ ပြန်လည် ရယူနည်းကတော့ — `DROP INDEX` နဲ့ အဲဒါကို drop လုပ်ပြီး — `REINDEX CONCURRENTLY` ကို ထပ်ကြိုးစားဖို့ ဖြစ်ပါတယ်။ Invalid index ရဲ့ နောက်ဆက်တွဲက `_ccold` ဆိုရင်တော့ — အဲဒါက drop လုပ်လို့ မရခဲ့တဲ့ မူရင်း index နဲ့ ကိုက်ညီပြီး — rebuild ကိုယ်တိုင်က အောင်မြင်ခဲ့လို့ — အကြံပြုထားတဲ့ ပြန်လည် ရယူနည်းက အဲဒီ index ကို ရိုးရိုး drop လုပ်ဖို့ပဲ ဖြစ်ပါတယ်။ Invalid index နာမည်တွေရဲ့ နောက်ဆက်တွဲတွေမှာ — `_ccnew1`, `_ccold2` စသဖြင့် — သူတို့ကို ထူးခြားအောင် ထားဖို့ — သုည မဟုတ်တဲ့ ဂဏန်း တစ်ခုကို ထပ်ထည့်နိုင်ပါတယ်။

သာမန် index builds တွေက — တူညီတဲ့ table ပေါ်မှာ တခြား သာမန် index builds တွေကို တစ်ပြိုင်နက် ဖြစ်ပေါ်ခွင့် ပြုပေမယ့် — table တစ်ခုပေါ်မှာ concurrent index build တစ်ခုတည်းကိုပဲ တစ်ကြိမ်မှာ လုပ်နိုင်ပါတယ်။ အခြေအနေ နှစ်ခုစလုံးမှာ — table ပေါ်မှာ တခြား schema modification အမျိုးအစားတွေ တစ်ပြိုင်နက် ဖြစ်ခွင့် မရှိပါဘူး။ နောက်ထပ် ကွာခြားချက် တစ်ခုက — သာမန် `REINDEX TABLE` ဒါမှမဟုတ် `REINDEX INDEX` command ကို transaction block တစ်ခုအတွင်းမှာ လုပ်ဆောင်နိုင်ပေမယ့် — `REINDEX CONCURRENTLY` ကတော့ မလုပ်နိုင်ပါဘူး။

ကြာမြင့်တဲ့ transaction တစ်ခုခုလိုပဲ — table တစ်ခုပေါ်က `REINDEX` က — တခြား table ဘယ်ခုပေါ်မှာမဆို — concurrent `VACUUM` တစ်ခုက ဘယ် tuples တွေကို ဖယ်ရှားလို့ ရမလဲဆိုတာကို သက်ရောက်မှု ရှိနိုင်ပါတယ်။

`REINDEX SYSTEM` က `CONCURRENTLY` ကို မထောက်ပံ့ပါဘူး — အကြောင်းကတော့ system catalogs တွေကို concurrently reindex လုပ်လို့ မရလို့ပါ။

ထို့ပြင် — exclusion constraints (ဖယ်ကြဉ်မှု ကန့်သတ်ချက်များ) တွေအတွက် indexes တွေကို concurrently reindex လုပ်လို့ မရပါဘူး။ ဒီလို index တစ်ခုကို ဒီ command ထဲမှာ တိုက်ရိုက် နာမည်ပေးပြီး သတ်မှတ်ရင် — error တစ်ခု ထုတ်ပေးပါတယ်။ Exclusion constraint indexes တွေ ပါဝင်တဲ့ table တစ်ခု ဒါမှမဟုတ် database တစ်ခုကို concurrently reindex လုပ်ရင် — အဲဒီ indexes တွေကို ကျော်လိုက်ပါလိမ့်မယ်။ (`CONCURRENTLY` option မပါဘဲ ဒီလို indexes တွေကို reindex လုပ်လို့တော့ ရပါတယ်။)

`REINDEX` run နေတဲ့ backend တစ်ခုချင်းစီက — `pg_stat_progress_create_index` view ထဲမှာ သူ့ရဲ့ progress ကို အစီရင်ခံပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 27.4.4](https://www.postgresql.org/docs/current/progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING) ကို ကြည့်ပါ။

## Examples (ဥပမာများ)

Index တစ်ခုတည်းကို ပြန်လည် တည်ဆောက်ခြင်း:

```sql
REINDEX INDEX my_index;
```

`my_table` table ပေါ်က indexes တွေ အားလုံးကို ပြန်လည် တည်ဆောက်ခြင်း:

```sql
REINDEX TABLE my_table;
```

System indexes တွေ valid ဖြစ်နှင့်ပြီးသားလို့ မယူဆဘဲ — database တစ်ခုထဲက indexes တွေ အားလုံးကို ပြန်လည် တည်ဆောက်ခြင်း:

```
$ export PGOPTIONS="-P"
$ psql broken_db
...
broken_db=> REINDEX DATABASE broken_db;
broken_db=> \q
```

Reindexing လုပ်နေစဉ် ပါဝင်ပတ်သက်နေတဲ့ relations တွေပေါ်က read နဲ့ write operations တွေကို မပိတ်ဆို့ဘဲ — table တစ်ခုအတွက် indexes တွေကို ပြန်လည် တည်ဆောက်ခြင်း:

```sql
REINDEX TABLE CONCURRENTLY my_broken_table;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard မှာ `REINDEX` command ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE INDEX](/docs/postgresql/sql-createindex), [DROP INDEX](/docs/postgresql/sql-dropindex), [reindexdb](https://www.postgresql.org/docs/current/app-reindexdb.html), [အပိုင်း 27.4.4](https://www.postgresql.org/docs/current/progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING)
