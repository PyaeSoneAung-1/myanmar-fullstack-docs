---
title: "SET TRANSACTION (transaction အတွက် သတ်မှတ်ချက်များ ပြောင်းလဲခြင်း)"
description: "လက်ရှိ transaction ၏ သတ်မှတ်ချက်များ (transaction isolation level, access mode, deferrable mode) ကို ပြောင်းလဲခြင်း — SET TRANSACTION နှင့် SET SESSION CHARACTERISTICS syntax၊ READ COMMITTED / REPEATABLE READ / SERIALIZABLE isolation levels များ၊ read-only transaction အကန့်အသတ်များနှင့် SET TRANSACTION SNAPSHOT အသုံးပြုပုံ"
order: 162
source: "https://www.postgresql.org/docs/current/sql-set-transaction.html"
status: translated
updated: 2026-09-04
---

## SET TRANSACTION (transaction အတွက် သတ်မှတ်ချက်များ ပြောင်းလဲခြင်း)

SET TRANSACTION — လက်ရှိ transaction ၏ သတ်မှတ်ချက်များကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
SET TRANSACTION transaction_mode [, ...]
SET TRANSACTION SNAPSHOT snapshot_id
SET SESSION CHARACTERISTICS AS TRANSACTION transaction_mode [, ...]

where transaction_mode is one of:

    ISOLATION LEVEL { SERIALIZABLE | REPEATABLE READ | READ COMMITTED | READ UNCOMMITTED }
    READ WRITE | READ ONLY
    [ NOT ] DEFERRABLE
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`SET TRANSACTION` command က လက်ရှိ transaction ရဲ့ သတ်မှတ်ချက်တွေကို ပြောင်းလဲပေးပါတယ်။ နောက်ထပ် transaction တွေအပေါ် ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။ `SET SESSION CHARACTERISTICS` ကတော့ — session တစ်ခုရဲ့ နောက်ပိုင်း transaction တွေအတွက် — default transaction သတ်မှတ်ချက်တွေကို သတ်မှတ်ပေးပါတယ်။ ဒီ defaults တွေကို — transaction တစ်ခုချင်းစီအတွက် — `SET TRANSACTION` က override (ပြောင်းလဲ လွှမ်းမိုး) လုပ်နိုင်ပါတယ်။

ရနိုင်တဲ့ transaction သတ်မှတ်ချက်တွေကတော့ — transaction isolation level၊ transaction access mode (read/write သို့မဟုတ် read-only) နဲ့ deferrable mode တို့ ဖြစ်ပါတယ်။ ဒါ့အပြင် — snapshot တစ်ခုကိုလည်း ရွေးချယ်နိုင်ပါတယ် — ဒါပေမယ့် session default အနေနဲ့ မဟုတ်ဘဲ — လက်ရှိ transaction အတွက်သာ ဖြစ်ပါတယ်။

Transaction တစ်ခုရဲ့ isolation level က — တခြား transaction တွေ တစ်ပြိုင်နက် (concurrently) run နေချိန်မှာ — အဲဒီ transaction က ဘယ် data တွေကို မြင်ရလဲဆိုတာကို ဆုံးဖြတ်ပေးပါတယ်:

- **READ COMMITTED** — Statement တစ်ခုက — သူ မစတင်ခင် commit လုပ်ပြီးသွားတဲ့ rows တွေကိုပဲ မြင်နိုင်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။
- **REPEATABLE READ** — လက်ရှိ transaction ရဲ့ statement တွေ အားလုံးက — ဒီ transaction ထဲမှာ ပထမဆုံး query ဒါမှမဟုတ် data-modification statement ကို execute မလုပ်ခင် — commit လုပ်ပြီးသွားတဲ့ rows တွေကိုပဲ မြင်နိုင်ပါတယ်။
- **SERIALIZABLE** — လက်ရှိ transaction ရဲ့ statement တွေ အားလုံးက — ဒီ transaction ထဲမှာ ပထမဆုံး query ဒါမှမဟုတ် data-modification statement ကို execute မလုပ်ခင် — commit လုပ်ပြီးသွားတဲ့ rows တွေကိုပဲ မြင်နိုင်ပါတယ်။ တစ်ပြိုင်နက် run နေတဲ့ serializable transaction တွေကြားက reads နဲ့ writes တွေရဲ့ ပုံစံတစ်ခုက — အဲဒီ transaction တွေကို serial (တစ်ခုပြီးတစ်ခု) အနေနဲ့ လုပ်ဆောင်ခဲ့မယ်ဆိုရင် — ဘယ်တော့မှ မဖြစ်နိုင်တဲ့ အခြေအနေတစ်ခုကို ဖန်တီးမိမယ်ဆိုရင် — အဲဒီထဲက transaction တစ်ခုက serialization_failure error နဲ့အတူ roll back လုပ်ခံရပါလိမ့်မယ်။

SQL standard က နောက်ထပ် level တစ်ခုဖြစ်တဲ့ `READ UNCOMMITTED` ကိုပါ သတ်မှတ်ထားပါတယ်။ PostgreSQL မှာတော့ `READ UNCOMMITTED` ကို `READ COMMITTED` အနေနဲ့ပဲ သဘောထားပါတယ်။

Transaction isolation level ကို — အဲဒီ transaction ရဲ့ ပထမဆုံး query ဒါမှမဟုတ် data-modification statement (`SELECT`, `INSERT`, `DELETE`, `UPDATE`, `MERGE`, `FETCH`, သို့မဟုတ် `COPY`) တစ်ခုခု execute လုပ်ပြီးတာနဲ့ — ပြောင်းလဲလို့ မရတော့ပါဘူး။ Transaction isolation နဲ့ concurrency control အကြောင်း နောက်ထပ် အချက်အလက်အတွက် [အခန်း 13](https://www.postgresql.org/docs/current/mvcc.html) ကို ကြည့်ပါ။

Transaction access mode က transaction က read/write လား read-only လားဆိုတာကို ဆုံးဖြတ်ပေးပါတယ်။ Read/write က default ဖြစ်ပါတယ်။ Transaction တစ်ခု read-only ဖြစ်နေချိန်မှာ — အောက်ပါ SQL command တွေကို ခွင့်မပြုပါဘူး: ရေးသားမယ့် table က temporary table မဟုတ်ရင် `INSERT`, `UPDATE`, `DELETE`, `MERGE` နဲ့ `COPY FROM`; `CREATE`, `ALTER`, နဲ့ `DROP` command တွေ အားလုံး; `COMMENT`, `GRANT`, `REVOKE`, `TRUNCATE`; ပြီးတော့ — လုပ်ဆောင်မယ့် command က အပေါ်မှာ စာရင်းပြထားတဲ့ command တွေထဲက တစ်ခုခု ဖြစ်နေရင် — `EXPLAIN ANALYZE` နဲ့ `EXECUTE` တို့လည်း ဖြစ်ပါတယ်။ ဒါက — disk ပေါ်ကို ရေးသားမှုတွေ အားလုံးကို တားဆီးပေးတာ မဟုတ်တဲ့ — high-level (အဆင့်မြင့်) read-only သဘောတရားတစ်ခုပါ။

`DEFERRABLE` transaction property က — transaction က `SERIALIZABLE` နဲ့ `READ ONLY` ပါ ဖြစ်နေမှသာ — အကျိုးသက်ရောက်မှု ရှိပါတယ်။ ဒီ property သုံးခုလုံးကို transaction တစ်ခုအတွက် ရွေးချယ်လိုက်တဲ့အခါ — transaction က သူ့ရဲ့ snapshot ကို ပထမဆုံး ရယူတဲ့အခါမှာ ပိတ်ဆို့ခံရနိုင်ပြီး — အဲဒီနောက်မှာတော့ — `SERIALIZABLE` transaction တစ်ခုရဲ့ ပုံမှန် overhead (အပိုကုန်ကျစရိတ်) မရှိဘဲ — serialization failure တစ်ခုဆီ ပံ့ပိုးခြင်း ဒါမှမဟုတ် အဲဒါကြောင့် ပယ်ဖျက်ခံရခြင်း စတဲ့ ဘယ်အန္တရာယ်မှ မရှိဘဲ — run လုပ်နိုင်ပါတယ်။ ဒီ mode က — ကြာမြင့်စွာ run ရတဲ့ reports တွေ ဒါမှမဟုတ် backups တွေအတွက် ကောင်းစွာ သင့်တော်ပါတယ်။

`SET TRANSACTION SNAPSHOT` command က — transaction အသစ်တစ်ခုကို — ရှိပြီးသား transaction တစ်ခုရဲ့ snapshot နဲ့ အတူတူ — run နိုင်စေပါတယ်။ ရှိပြီးသား transaction က သူ့ရဲ့ snapshot ကို `pg_export_snapshot` function နဲ့ export (ထုတ်ပေး) လုပ်ထားရပါမယ် (အပိုင်း 9.28.5 ကို ကြည့်ပါ)။ ဒီ function က snapshot identifier (snapshot မှတ်ပုံတင် နံပါတ်) တစ်ခုကို ပြန်ပေးပြီး — ဘယ် snapshot ကို import လုပ်ရမယ်ဆိုတာ သတ်မှတ်ဖို့ — အဲဒီ identifier ကို `SET TRANSACTION SNAPSHOT` ဆီ ပေးရပါတယ်။ Identifier ကို ဒီ command ထဲမှာ string literal အနေနဲ့ ရေးရပါမယ် — ဥပမာ `'00000003-0000001B-1'` လိုမျိုးပါ။ `SET TRANSACTION SNAPSHOT` ကို — transaction ရဲ့ ပထမဆုံး query ဒါမှမဟုတ် data-modification statement (`SELECT`, `INSERT`, `DELETE`, `UPDATE`, `MERGE`, `FETCH`, သို့မဟုတ် `COPY`) မတိုင်ခင် — transaction တစ်ခုရဲ့ အစမှာပဲ execute လုပ်လို့ ရပါတယ်။ ဒါ့အပြင် — transaction က `SERIALIZABLE` ဒါမှမဟုတ် `REPEATABLE READ` isolation level အဖြစ် သတ်မှတ်ပြီးသား ဖြစ်နေရပါမယ် (မဟုတ်ရင် — `READ COMMITTED` mode က command တစ်ခုချင်းစီအတွက် snapshot အသစ်တစ်ခု ယူတာမို့ — snapshot က ချက်ချင်း စွန့်ပစ်ခံရပါလိမ့်မယ်)။ Import လုပ်တဲ့ transaction က `SERIALIZABLE` isolation level သုံးမယ်ဆိုရင် — snapshot ကို export လုပ်တဲ့ transaction ကလည်း အဲဒီ isolation level ကိုပဲ သုံးနေရပါမယ်။ ဒါ့အပြင် — read-only မဟုတ်တဲ့ serializable transaction တစ်ခုက — read-only transaction တစ်ခုကနေ snapshot တစ်ခုကို import လုပ်လို့ မရပါဘူး။

## Notes (မှတ်စုများ)

`SET TRANSACTION` ကို — ကြိုတင်လုပ်ထားတဲ့ `START TRANSACTION` ဒါမှမဟုတ် `BEGIN` မရှိဘဲ execute လုပ်ရင် — warning တစ်ခု ထုတ်လွှတ်ပြီး — တခြား ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

`SET TRANSACTION` ကို ဖြုတ်ပစ်ဖို့ — လိုချင်တဲ့ `transaction_modes` တွေကို `BEGIN` ဒါမှမဟုတ် `START TRANSACTION` မှာ သတ်မှတ်ပြီး — အစားထိုး လုပ်လို့လည်း ရပါတယ်။ ဒါပေမယ့် အဲဒီ option က `SET TRANSACTION SNAPSHOT` အတွက်တော့ မရနိုင်ပါဘူး။

Session ရဲ့ default transaction modes တွေကို — configuration parameters တွေဖြစ်တဲ့ [default_transaction_isolation](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TRANSACTION-ISOLATION), [default_transaction_read_only](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TRANSACTION-READ-ONLY) နဲ့ [default_transaction_deferrable](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DEFAULT-TRANSACTION-DEFERRABLE) တို့ကနေလည်း — သတ်မှတ်ခြင်း ဒါမှမဟုတ် စစ်ဆေးခြင်း လုပ်နိုင်ပါတယ်။ (တကယ်တော့ `SET SESSION CHARACTERISTICS` က ဒီ variable တွေကို `SET` နဲ့ သတ်မှတ်ခြင်းရဲ့ — စကားလုံးရှည်ရှည်နဲ့ ရေးထားတဲ့ — ညီမျှပုံစံတစ်ခုပဲ ဖြစ်ပါတယ်။) ဒါက ဆိုလိုတာက — defaults တွေကို configuration file ထဲမှာ၊ `ALTER DATABASE` ကနေ စသည်ဖြင့် သတ်မှတ်လို့ ရပါတယ်။ နောက်ထပ် အချက်အလက်အတွက် [အခန်း 19](https://www.postgresql.org/docs/current/runtime-config.html) ကို တိုင်ပင်ကြည့်ပါ။

လက်ရှိ transaction ရဲ့ modes တွေကိုလည်း — configuration parameters တွေဖြစ်တဲ့ [transaction_isolation](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TRANSACTION-ISOLATION), [transaction_read_only](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TRANSACTION-READ-ONLY) နဲ့ [transaction_deferrable](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-TRANSACTION-DEFERRABLE) တို့ကနေ — အလားတူပဲ သတ်မှတ်ခြင်း ဒါမှမဟုတ် စစ်ဆေးခြင်း လုပ်နိုင်ပါတယ်။ ဒီ parameters တွေထဲက တစ်ခုကို သတ်မှတ်ခြင်းက — သက်ဆိုင်ရာ `SET TRANSACTION` option နဲ့ အတူတူပဲ ပြုမူပြီး — ဘယ်အချိန်မှာ လုပ်လို့ရလဲဆိုတဲ့ ကန့်သတ်ချက်တွေလည်း အတူတူပဲ ဖြစ်ပါတယ်။ ဒါပေမယ့် — ဒီ parameters တွေကို configuration file ထဲမှာ ဒါမှမဟုတ် live SQL ကလွဲလို့ တခြား ဘယ် source ကနေမှ — သတ်မှတ်လို့ မရပါဘူး။

## Examples (ဥပမာများ)

ရှိပြီးသား transaction တစ်ခုနဲ့ snapshot အတူတူရှိတဲ့ transaction အသစ်တစ်ခုကို စတင်ဖို့ — ပထမဆုံး ရှိပြီးသား transaction ကနေ snapshot ကို export လုပ်ပါ။ အဲဒါက snapshot identifier ကို ပြန်ပေးပါလိမ့်မယ် — ဥပမာ:

```sql
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT pg_export_snapshot();
 pg_export_snapshot
---------------------
 00000003-0000001B-1
(1 row)
```

ပြီးတော့ — အသစ် စတင်လိုက်တဲ့ transaction ရဲ့ အစမှာ — `SET TRANSACTION SNAPSHOT` command ထဲမှာ snapshot identifier ကို ပေးလိုက်ပါ:

```sql
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION SNAPSHOT '00000003-0000001B-1';
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DEFERRABLE` transaction mode နဲ့ `SET TRANSACTION SNAPSHOT` ပုံစံကလွဲလို့ — ဒီ command တွေက SQL standard မှာ သတ်မှတ်ထားတာတွေပါ — အဲဒီနှစ်ခုကတော့ PostgreSQL extensions တွေပါ။

SQL standard ထဲမှာတော့ `SERIALIZABLE` က default transaction isolation level ပါ။ PostgreSQL မှာတော့ — default က ပုံမှန်အားဖြင့် `READ COMMITTED` ဖြစ်ပြီး — အပေါ်မှာ ဖော်ပြခဲ့သလိုပဲ သင်က ပြောင်းလဲလို့ ရပါတယ်။

SQL standard မှာ — ဒီ command တွေနဲ့ သတ်မှတ်လို့ရတဲ့ နောက်ထပ် transaction သတ်မှတ်ချက် တစ်ခု ရှိပါသေးတယ်: diagnostics area ရဲ့ အရွယ်အစားပါ။ ဒီ concept က embedded SQL အတွက်သာ သီးသန့်ဖြစ်လို့ — PostgreSQL server မှာ implement (အကောင်အထည်ဖော်) မလုပ်ထားပါဘူး။

SQL standard က ဆက်တိုက်လာတဲ့ `transaction_modes` တွေကြားမှာ commas တွေ ထည့်ဖို့ လိုအပ်ပေမယ့် — သမိုင်းကြောင်းဆိုင်ရာ အကြောင်းပြချက်တွေကြောင့် — PostgreSQL က commas တွေကို ချန်လိုက်တာကိုပါ ခွင့်ပြုပါတယ်။
