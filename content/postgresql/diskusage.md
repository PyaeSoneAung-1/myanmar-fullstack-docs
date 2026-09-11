---
title: "Monitoring Disk Usage (disk သုံးစွဲမှု စောင့်ကြည့်ခြင်း)"
description: "PostgreSQL database system တစ်ခုရဲ့ disk သုံးစွဲမှုကို စောင့်ကြည့်ခြင်း — disk space စောင့်ကြည့်ရန် နည်းလမ်း သုံးမျိုး (SQL functions, oid2name module, system catalogs များကို ကိုယ်တိုင် စစ်ဆေးခြင်း), `pg_relation_filepath`/`relpages` စသည်တို့ကို သုံးပြီး table, TOAST tables နှင့် indexes တို့၏ disk အသုံးပြုမှု ဆုံးဖြတ်ခြင်း (psql query ဥပမာများ), အကြီးဆုံး tables/indexes များကို ရှာဖွေခြင်း, disk ပြည့်သွားခြင်း ကျရှုံးမှု (WAL files disk ပြည့်ခြင်းကြောင့် server panic/shutdown, tablespaces ဖြင့် ဖိုင်များ အခြား file systems ဆီ ရွှေ့ပြောင်းခြင်း, per-user disk quotas) အကြောင်း ရှင်းလင်းချက်"
order: 220
source: "https://www.postgresql.org/docs/current/diskusage.html"
status: translated
updated: 2026-09-06
---

## 27.6. Monitoring Disk Usage (disk သုံးစွဲမှု စောင့်ကြည့်ခြင်း)

- **27.6.1. Determining Disk Usage (disk သုံးစွဲမှု ဆုံးဖြတ်ခြင်း)**
- **27.6.2. Disk Full Failure (disk ပြည့်သွားခြင်း ကျရှုံးမှု)**

ဒီ section က PostgreSQL database system တစ်ခုရဲ့ disk သုံးစွဲမှု (disk usage) ကို ဘယ်လို စောင့်ကြည့်ရမလဲဆိုတာကို ဆွေးနွေးထားပါတယ်။

### 27.6.1. Determining Disk Usage (disk သုံးစွဲမှု ဆုံးဖြတ်ခြင်း)

Table တစ်ခုချင်းစီမှာ — data အများစု သိမ်းဆည်းထားတဲ့ — primary heap disk file (heap disk file — ပင်မ ဒေတာ သိုလှောင်သည့် disk ဖိုင်) တစ်ခု ရှိပါတယ်။ Table မှာ ကျယ်ပြန့်တဲ့ (potentially-wide) တန်ဖိုးတွေ ရှိနိုင်တဲ့ columns တစ်ခုခု ပါဝင်နေရင် — အဲဒီ table နဲ့ ဆက်စပ်တဲ့ TOAST file တစ်ခုလည်း ရှိနိုင်ပြီး — main table (ပင်မ table) ထဲမှာ အဆင်ပြေပြေ ဝင်ဆံ့ဖို့ မဖြစ်နိုင်လောက်အောင် ကျယ်ပြန့်လွန်းတဲ့ တန်ဖိုးတွေကို သိမ်းဆည်းဖို့ အသုံးပြုပါတယ် ([အပိုင်း 66.2](https://www.postgresql.org/docs/current/storage-toast.html) ကို ကြည့်ပါ)။ TOAST table ရှိရင် — အဲဒီ table ပေါ်မှာ valid index (မှန်ကန်သော index) တစ်ခု ရှိပါလိမ့်မယ်။ ထို့ပြင် — base table (အခြေခံ table) နဲ့ ဆက်စပ်တဲ့ indexes တွေလည်း ရှိနိုင်ပါတယ်။ Table နဲ့ index တစ်ခုချင်းစီကို သီးခြား disk file တစ်ခုစီမှာ သိမ်းဆည်းပါတယ် — ဖိုင်က one gigabyte (တစ် ဂစ်ဂါဘိုက်) ကျော်လွန်သွားနိုင်ရင် ဖိုင်တစ်ခုထက် ပိုပြီးလည်း ဖြစ်နိုင်ပါတယ်။ ဒီ ဖိုင်တွေရဲ့ နာမည်ပေးစနစ် (naming conventions) တွေကို [အပိုင်း 66.1](https://www.postgresql.org/docs/current/storage-file-layout.html) မှာ ဖော်ပြထားပါတယ်။

Disk space (disk နေရာလွတ်) ကို နည်းလမ်း သုံးမျိုးနဲ့ စောင့်ကြည့်နိုင်ပါတယ်: [ဇယား 9.102](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADMIN-DBSIZE) မှာ စာရင်းပြုထားတဲ့ SQL functions တွေကို သုံးပြီး ဖြစ်စေ — [oid2name](https://www.postgresql.org/docs/current/oid2name.html) module ကို သုံးပြီး ဖြစ်စေ — ဒါမှမဟုတ် system catalogs (system ၏ မှတ်တမ်း ကက်တလောက်များ) တွေကို ကိုယ်တိုင် စစ်ဆေးပြီး ဖြစ်စေ စောင့်ကြည့်နိုင်ပါတယ်။ SQL functions တွေက သုံးရ အလွယ်ဆုံး ဖြစ်ပြီး — ယေဘုယျအားဖြင့် အကြံပြုလေ့ ရှိပါတယ်။ ဒီ section ရဲ့ ကျန် အပိုင်းကတော့ system catalogs တွေကို စစ်ဆေးခြင်းအားဖြင့် ဘယ်လို လုပ်ရမလဲဆိုတာကို ပြသထားပါတယ်။

မကြာသေးမီက vacuumed ဒါမှမဟုတ် analyzed လုပ်ထားတဲ့ database တစ်ခုပေါ်မှာ psql ကို သုံးပြီး — table တစ်ခုခုရဲ့ disk သုံးစွဲမှုကို ကြည့်ရှုဖို့ queries တွေ ထုတ်ပေးနိုင်ပါတယ်:

```sql
SELECT pg_relation_filepath(oid), relpages FROM pg_class WHERE relname = 'customer';

 pg_relation_filepath | relpages
----------------------+----------
 base/16384/16806     |       60
(1 row)
```

Page တစ်ခုချင်းစီကတော့ ပုံမှန်အားဖြင့် 8 kilobytes (ကီလိုဘိုက်) အရွယ် ဖြစ်ပါတယ်။ (`relpages` ကို `VACUUM`, `ANALYZE` နဲ့ `CREATE INDEX` လို DDL commands အနည်းငယ်ကပဲ update (ပြင်ဆင် မွမ်းမံ) လုပ်တယ်ဆိုတာ သတိရပါ။) Table ရဲ့ disk file ကို တိုက်ရိုက် စစ်ဆေးကြည့်ချင်ရင် file path name (ဖိုင် လမ်းကြောင်း နာမည်) က စိတ်ဝင်စားစရာ ဖြစ်ပါတယ်။

TOAST tables တွေ သုံးထားတဲ့ နေရာကို ပြသဖို့ဆိုရင် အောက်ပါအတိုင်း query တစ်ခုကို သုံးပါ:

```sql
SELECT relname, relpages
FROM pg_class,
     (SELECT reltoastrelid
      FROM pg_class
      WHERE relname = 'customer') AS ss
WHERE oid = ss.reltoastrelid OR
      oid = (SELECT indexrelid
             FROM pg_index
             WHERE indrelid = ss.reltoastrelid)
ORDER BY relname;

       relname        | relpages
----------------------+----------
 pg_toast_16806       |        0
 pg_toast_16806_index |        1
```

Index တွေရဲ့ အရွယ်အစားတွေကိုလည်း လွယ်ကူစွာ ပြသနိုင်ပါတယ်:

```sql
SELECT c2.relname, c2.relpages
FROM pg_class c, pg_class c2, pg_index i
WHERE c.relname = 'customer' AND
      c.oid = i.indrelid AND
      c2.oid = i.indexrelid
ORDER BY c2.relname;

      relname      | relpages
-------------------+----------
 customer_id_index |       26
```

ဒီ အချက်အလက်တွေကို သုံးပြီး — သင့်ရဲ့ အကြီးဆုံး tables နဲ့ indexes တွေကို ရှာတွေ့ဖို့လည်း လွယ်ကူပါတယ်:

```sql
SELECT relname, relpages
FROM pg_class
ORDER BY relpages DESC;

       relname        | relpages
----------------------+----------
 bigtable             |     3290
 customer             |     3144
```

### 27.6.2. Disk Full Failure (disk ပြည့်သွားခြင်း ကျရှုံးမှု)

Database administrator (database စီမံအုပ်ချုပ်သူ) တစ်ယောက်ရဲ့ အရေးအကြီးဆုံး disk စောင့်ကြည့်မှု တာဝန်ကတော့ — disk က ပြည့်မသွားအောင် သေချာ ဆောင်ရွက်တာပဲ ဖြစ်ပါတယ်။ Data disk တစ်ခု ပြည့်သွားတာက data corruption (data ပျက်စီးမှု) ကို ဖြစ်စေမှာ မဟုတ်ပေမယ့် — အသုံးဝင်တဲ့ လုပ်ဆောင်ချက်တွေ ဖြစ်ပေါ်ခြင်းကိုတော့ တားဆီးနိုင်ပါတယ်။ WAL files တွေ သိမ်းဆည်းထားတဲ့ disk က ပြည့်သွားရင်တော့ — database server panic (ထိတ်လန့် ရပ်တန့်မှု) နဲ့ ၎င်းနဲ့ ဆက်စပ်တဲ့ shutdown (ပိတ်သိမ်းမှု) တွေ ဖြစ်ပေါ်နိုင်ပါတယ်။

တခြား အရာတွေကို ဖျက်ပစ်ခြင်းအားဖြင့် disk ပေါ်မှာ နေရာ ထပ်မံ လွတ်အောင် မလုပ်နိုင်ဘူးဆိုရင် — tablespaces (tablespace — ဒေတာ သိမ်းဆည်းရန် နေရာ သတ်မှတ်ပေးသော container) တွေကို အသုံးပြုပြီး — database ဖိုင်တချို့ကို တခြား file systems (ဖိုင် စနစ်များ) တွေဆီ ရွှေ့ပြောင်းနိုင်ပါတယ်။ အဲဒါနဲ့ ပတ်သက်တဲ့ နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 22.6](https://www.postgresql.org/docs/current/manage-ag-tablespaces.html) ကို ကြည့်ပါ။

> **အကြံပြုချက်:** File systems တချို့က သူတို့ နီးပါး ပြည့်နေတဲ့အခါ စွမ်းဆောင်ရည် ဆိုးရွားတတ်လို့ — ဆောင်ရွက်ဖို့အတွက် disk လုံးဝ ပြည့်သွားတဲ့အထိ စောင့်မနေပါနဲ့။

သင့် system က per-user disk quotas (user တစ်ဦးချင်းစီအတွက် disk ခွဲတမ်း ကန့်သတ်ချက်များ) တွေကို ထောက်ပံ့တယ်ဆိုရင် — database က server run လုပ်နေတဲ့ user အပေါ် သတ်မှတ်ထားတဲ့ quota ဘယ်လိုပဲ ရှိရှိ အလိုအလျောက် အဲဒါရဲ့ ဘာသာရပ် (subject) ဖြစ်ပါလိမ့်မယ်။ Quota ကို ကျော်လွန်လိုက်တာက — disk space တစ်ခုလုံး ကုန်သွားတာနဲ့ တူညီတဲ့ ဆိုးကျိုးတွေကို ဖြစ်စေပါလိမ့်မယ်။
