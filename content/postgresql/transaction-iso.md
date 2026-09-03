---
title: "Transaction Isolation (transaction သီးခြားသတ်မှတ်ခြင်း)"
description: "Transaction isolation level (transaction သီးခြားသတ်မှတ်မှု အဆင့်) လေးမျိုး — Read Committed, Repeatable Read နဲ့ Serializable — တို့ ဘယ်လို အလုပ်လုပ်လဲ၊ dirty read / nonrepeatable read / phantom read စတဲ့ phenomena တွေကို ဘယ်လို ကာကွယ်ပေးလဲ"
order: 98
source: "https://www.postgresql.org/docs/current/transaction-iso.html"
status: translated
updated: 2026-09-03
---

## 13.2. Transaction Isolation (transaction သီးခြားသတ်မှတ်ခြင်း)

- **13.2.1. Read Committed Isolation Level (commit လုပ်ပြီးသား အချက်အလက်များကိုသာ ဖတ်ရသည့် isolation level)**
- **13.2.2. Repeatable Read Isolation Level (တစ်ကြိမ် ဖတ်ပြီးသည့်အတိုင်း ထပ်ခါထပ်ခါ ဖတ်နိုင်သည့် isolation level)**
- **13.2.3. Serializable Isolation Level (serial ဖြစ်စဉ်ကဲ့သို့ အစဉ်လိုက် ညီညွတ်မှု ရှိသည့် isolation level)**

SQL standard က transaction isolation level (transaction သီးခြားသတ်မှတ်မှု အဆင့်) လေးမျိုး သတ်မှတ်ပါတယ်။ အကြပ်ဆုံး (most strict) က Serializable ဖြစ်ပြီး — standard ရဲ့ အဓိပ္ပာယ် ဖွင့်ဆိုချက်အရ — Serializable transaction အစုတစ်စုကို တစ်ပြိုင်နက် (concurrently) run လုပ်တိုင်း — ၎င်းတို့ကို အစီအစဉ် တစ်ခုခုနဲ့ တစ်ခုပြီးတစ်ခု run လုပ်ခဲ့တာနဲ့ တူညီတဲ့ ရလဒ်ကို ထုတ်ပေးဖို့ အာမခံပါတယ်။ ကျန် level သုံးခုကိုတော့ — တစ်ပြိုင်နက် လုပ်ဆောင်နေတဲ့ transaction တွေကြားက အပြန်အလှန် သက်ရောက်မှုကြောင့် ဖြစ်ပေါ်ပြီး — level တစ်ခုချင်းစီမှာ မဖြစ်စေရတဲ့ — phenomena (မဖြစ်သင့်သော ဖြစ်စဉ်များ) တွေနဲ့ သတ်မှတ်ထားပါတယ်။ Standard က မှတ်ချက်ပြုထားတာက — Serializable ရဲ့ အဓိပ္ပာယ် ဖွင့်ဆိုချက်အရ — ဒီ phenomena တွေ ဘယ်ဟာမှ အဲဒီ level မှာ မဖြစ်နိုင်ဘူးဆိုတာပါ။ (ဒါက မထူးဆန်းပါဘူး — transaction တွေရဲ့ ရလဒ်က တစ်ခုပြီးတစ်ခု run ခဲ့တာနဲ့ ညီညွတ်ရမယ်ဆိုရင် — အပြန်အလှန် သက်ရောက်မှုကြောင့် ဖြစ်တဲ့ phenomena တွေကို ဘယ်လိုလုပ်ပြီး မြင်နိုင်မှာလဲ?)

Level အမျိုးမျိုးမှာ တားမြစ်ထားတဲ့ phenomena တွေကတော့:

- **dirty read** — transaction တစ်ခုက commit မဖြစ်သေးတဲ့ တစ်ပြိုင်နက် transaction တစ်ခု ရေးသားထားတဲ့ data ကို ဖတ်မိတာ ဖြစ်ပါတယ်။
- **nonrepeatable read** — transaction တစ်ခုက အရင်က ဖတ်ခဲ့ဖူးတဲ့ data ကို ပြန်ဖတ်ကြည့်တဲ့အခါ — (ပထမအကြိမ် ဖတ်ပြီးနောက်ပိုင်း commit လုပ်ခဲ့တဲ့) တခြား transaction တစ်ခုက အဲဒီ data ကို ပြုပြင်မွမ်းမံထားတာ တွေ့ရတာ ဖြစ်ပါတယ်။
- **phantom read** — transaction တစ်ခုက search condition (ရှာဖွေမှု အခြေအနေ) တစ်ခုနဲ့ ကိုက်ညီတဲ့ row အစုကို ပြန်ပေးတဲ့ query တစ်ခုကို ပြန် run တဲ့အခါ — အဲဒီ condition နဲ့ ကိုက်ညီတဲ့ row အစုက မကြာသေးမီက commit လုပ်ခဲ့တဲ့ transaction တစ်ခုကြောင့် ပြောင်းလဲသွားတာ တွေ့ရတာ ဖြစ်ပါတယ်။
- **serialization anomaly** — transaction အစုတစ်စု အောင်မြင်စွာ commit ဖြစ်သွားတဲ့ ရလဒ်က — အဲဒီ transaction တွေကို တစ်ခုပြီးတစ်ခု run လုပ်မယ့် ဖြစ်နိုင်တဲ့ အစီအစဉ် အားလုံးနဲ့မဆို မညီညွတ်တာ ဖြစ်ပါတယ်။

SQL standard ရော PostgreSQL မှာ implement လုပ်ထားတဲ့ transaction isolation level တွေကို ဇယား 13.1 မှာ ဖော်ပြထားပါတယ်။

**ဇယား 13.1. Transaction Isolation Levels (transaction သီးခြားသတ်မှတ်မှု အဆင့်များ)**

| Isolation Level | Dirty Read | Nonrepeatable Read | Phantom Read | Serialization Anomaly |
| --- | --- | --- | --- | --- |
| Read uncommitted | ခွင့်ပြုသော်လည်း PG တွင် မရှိ | ဖြစ်နိုင် | ဖြစ်နိုင် | ဖြစ်နိုင် |
| Read committed | မဖြစ်နိုင် | ဖြစ်နိုင် | ဖြစ်နိုင် | ဖြစ်နိုင် |
| Repeatable read | မဖြစ်နိုင် | မဖြစ်နိုင် | ခွင့်ပြုသော်လည်း PG တွင် မရှိ | ဖြစ်နိုင် |
| Serializable | မဖြစ်နိုင် | မဖြစ်နိုင် | မဖြစ်နိုင် | မဖြစ်နိုင် |

PostgreSQL မှာ standard isolation level လေးမျိုးထဲက ဘယ်ဟာကိုမဆို တောင်းဆိုလို့ ရပါတယ် — ဒါပေမယ့် — အတွင်းပိုင်းမှာတော့ သီးခြား isolation level သုံးမျိုးပဲ implement လုပ်ထားပါတယ် — ဆိုလိုတာက PostgreSQL ရဲ့ Read Uncommitted mode က Read Committed လိုပဲ ပြုမူတာပါ။ အကြောင်းကတော့ — standard isolation level တွေကို PostgreSQL ရဲ့ multiversion concurrency control (MVCC — row တွေရဲ့ version အမျိုးမျိုးကို ထိန်းသိမ်းထားပြီး တစ်ပြိုင်နက် ဝင်ရောက်မှုကို ထိန်းချုပ်သော နည်းပညာ) architecture ပေါ်ကို map လုပ်ဖို့ — အဓိပ္ပာယ် ရှိတဲ့ တစ်ခုတည်းသော နည်းလမ်း ဖြစ်လို့ပါ။

ဒီဇယားက နောက်ထပ် ပြသတာက — PostgreSQL ရဲ့ Repeatable Read implementation က phantom read တွေကို ခွင့်မပြုဘူးဆိုတာပါ။ ဒါက SQL standard အောက်မှာ လက်ခံနိုင်ပါတယ် — အကြောင်းကတော့ standard က isolation level တစ်ခုချင်းစီမှာ ဘယ် anomaly တွေ မဖြစ်စေရဘူးဆိုတာကိုပဲ သတ်မှတ်ပြီး — ပိုမြင့်တဲ့ အာမခံချက် (higher guarantee) တွေကတော့ လက်ခံနိုင်လို့ပါ။ ရနိုင်တဲ့ isolation level တွေရဲ့ အပြုအမူကို အောက်က subsection တွေမှာ အသေးစိတ် ဖော်ပြထားပါတယ်။

Transaction တစ်ခုရဲ့ isolation level ကို သတ်မှတ်ဖို့ဆိုရင် — [SET TRANSACTION](https://www.postgresql.org/docs/current/sql-set-transaction.html) command ကို သုံးပါ။

> **အရေးကြီး:** PostgreSQL ရဲ့ data type နဲ့ function တချို့မှာ transaction ဆိုင်ရာ အပြုအမူအတွက် အထူး စည်းမျဉ်းတွေ ရှိပါတယ်။ အထူးသဖြင့် — sequence တစ်ခုကို ပြောင်းလဲမှုတွေ (ဒါကြောင့် `serial` သုံးပြီး declare လုပ်ထားတဲ့ column ရဲ့ counter) က တခြား transaction တွေ အားလုံးကို ချက်ချင်း မြင်နိုင်ပြီး — အဲဒီ အပြောင်းအလဲတွေ လုပ်တဲ့ transaction က abort (ဖျက်သိမ်း) ဖြစ်သွားရင်တောင် roll back လုပ်မပေးပါဘူး။ [အပိုင်း 9.17](https://www.postgresql.org/docs/current/functions-sequence.html) နဲ့ [အပိုင်း 8.1.4](/docs/postgresql/datatype-numeric) ကို ကြည့်ပါ။

### 13.2.1. Read Committed Isolation Level (commit လုပ်ပြီးသား အချက်အလက်များကိုသာ ဖတ်ရသည့် isolation level)

*Read Committed* က PostgreSQL မှာ default isolation level ပါ။ ဒီ isolation level ကို သုံးတဲ့ transaction တစ်ခုမှာ `SELECT` query တစ်ခု (`FOR UPDATE/SHARE` clause မပါတဲ့) က — query မစတင်ခင် commit လုပ်ပြီးသား data တွေကိုပဲ မြင်ပြီး — uncommitted data ရော query run နေတဲ့ အတောအတွင်း တစ်ပြိုင်နက် transaction တွေ commit လုပ်လိုက်တဲ့ အပြောင်းအလဲတွေကိုပါ ဘယ်တော့မှ မမြင်ပါဘူး။ လက်တွေ့မှာ — `SELECT` query တစ်ခုက — query စ run တဲ့ ခဏတည်းမှာ database ရဲ့ snapshot (ထိုအခိုက် မြင်ရသော ပုံရိပ်) တစ်ခုကို မြင်ရပါတယ်။ ဒါပေမယ့် — `SELECT` က — ၎င်းရဲ့ ကိုယ်ပိုင် transaction ထဲမှာ မကြာခင်က run ခဲ့တဲ့ update တွေရဲ့ အကျိုးသက်ရောက်မှုကိုတော့ — commit မဖြစ်ရသေးဘဲ ရှိနေတာတောင် — မြင်ရပါတယ်။ ဒါ့အပြင် — `SELECT` command နှစ်ခု ဆက်တိုက် run တာက — transaction တစ်ခုတည်းထဲမှာ ဖြစ်နေရင်တောင် — ပထမ `SELECT` စပြီးနောက်၊ ဒုတိယ `SELECT` မစခင်ကြားမှာ တခြား transaction တွေက အပြောင်းအလဲတွေ commit လုပ်လိုက်ရင် — data မတူညီတာတွေ မြင်ရနိုင်တာကိုလည်း သတိပြုပါ။

`UPDATE`, `DELETE`, `SELECT FOR UPDATE`, နဲ့ `SELECT FOR SHARE` command တွေက — target row တွေ ရှာဖွေတဲ့ ကိစ္စမှာ `SELECT` နဲ့ အတူတူပဲ ပြုမူပါတယ်: command စတဲ့ အချိန်အထိ commit ပြီးသား target row တွေကိုပဲ ရှာတွေ့ပါလိမ့်မယ်။ ဒါပေမယ့် — ဒီလို target row တစ်ခုက — ရှာတွေ့တဲ့ အချိန်မှာတော့ တခြား တစ်ပြိုင်နက် transaction တစ်ခုက update (သို့မဟုတ် delete ဒါမှမဟုတ် lock) လုပ်ပြီးသား ဖြစ်နေနိုင်ပါတယ်။ ဒီအခါမျိုးမှာ — update လုပ်ဖို့ ကြံရွယ်ထားသူ (would-be updater) က — ပထမ updating transaction က commit ဒါမှမဟုတ် roll back လုပ်တဲ့အထိ စောင့်ပါလိမ့်မယ် (သူ ဆက်လုပ်နေသေးရင်)။ ပထမ updater က roll back လုပ်ရင် — သူ့ရဲ့ အကျိုးသက်ရောက်မှုတွေ ပျက်ပြယ်ပြီး — ဒုတိယ updater က မူလ တွေ့ခဲ့တဲ့ row ကို update လုပ်ဖို့ ဆက်လုပ်လို့ ရပါတယ်။ ပထမ updater က commit လုပ်ရင် — သူ delete လုပ်ခဲ့တယ်ဆိုရင် ဒုတိယ updater က အဲဒီ row ကို လျစ်လျူရှုလိုက်ပြီး — မဟုတ်ရင်တော့ row ရဲ့ update လုပ်ထားတဲ့ version အပေါ်မှာ သူ့ရဲ့ operation ကို သက်ရောက်စေဖို့ ကြိုးစားပါလိမ့်မယ်။ Command ရဲ့ search condition (`WHERE` clause) ကို — row ရဲ့ update လုပ်ထားတဲ့ version က search condition နဲ့ ကိုက်ညီသေးလားဆိုတာ ကြည့်ဖို့ — ပြန်အကဲဖြတ် (re-evaluate) ပါတယ်။ ကိုက်ညီရင် — ဒုတိယ updater က row ရဲ့ update ထားတဲ့ version ကို သုံးပြီး သူ့ရဲ့ operation ကို ဆက်လုပ်ပါတယ်။ `SELECT FOR UPDATE` နဲ့ `SELECT FOR SHARE` ရဲ့ ကိစ္စမှာဆိုရင် — ဒါက row ရဲ့ update လုပ်ထားတဲ့ version ကိုပဲ lock လုပ်ပြီး client ဆီ ပြန်ပေးတာ ဖြစ်ပါတယ်။

`ON CONFLICT DO UPDATE` clause ပါတဲ့ `INSERT` ကလည်း အလားတူပဲ ပြုမူပါတယ်။ Read Committed mode မှာ — insert လုပ်ဖို့ လျာထားတဲ့ row တစ်ခုချင်းစီအတွက် insert ဖြစ်မယ် ဒါမှမဟုတ် update ဖြစ်ပါလိမ့်မယ်။ မဆက်စပ်တဲ့ error တွေ မရှိရင် — ဒီနှစ်မျိုးထဲက တစ်မျိုး ဖြစ်တာကို အာမခံပါတယ်။ Conflict တစ်ခုက — `INSERT` ကို မမြင်ရသေးတဲ့ အကျိုးသက်ရောက်မှုတွေ ရှိတဲ့ တခြား transaction တစ်ခုဆီက ဖြစ်လာရင် — row ရဲ့ version ဘယ်တစ်ခုကိုမှ command က ပုံမှန်အားဖြင့် (conventionally) မမြင်ရဘူး ဖြစ်နေရင်တောင် — `UPDATE` clause က အဲဒီ row အပေါ် သက်ရောက်ပါလိမ့်မယ်။

`ON CONFLICT DO NOTHING` clause ပါတဲ့ `INSERT` ကတော့ — `INSERT` ရဲ့ snapshot မှာ မမြင်ရတဲ့ အကျိုးသက်ရောက်မှုတွေ ရှိတဲ့ တခြား transaction တစ်ခုရဲ့ ရလဒ်ကြောင့် — row တစ်ခုအတွက် insertion မလုပ်ဖြစ်ဘဲ နေနိုင်ပါတယ်။ ဒါလည်း Read Committed mode မှာပဲ ဖြစ်တတ်တာပါ။

`MERGE` က user ကို `INSERT`, `UPDATE` နဲ့ `DELETE` subcommand တွေရဲ့ ပေါင်းစပ်မှု အမျိုးမျိုး သတ်မှတ်ခွင့် ပြုပါတယ်။ `INSERT` ရော `UPDATE` subcommand ပါ ပါတဲ့ `MERGE` command က — `ON CONFLICT DO UPDATE` clause ပါတဲ့ `INSERT` နဲ့ ဆင်ပေမယ့် — `INSERT` ဒါမှမဟုတ် `UPDATE` တစ်ခုခု ဖြစ်လိမ့်မယ်လို့တော့ အာမခံမပေးပါဘူး။ `MERGE` က `UPDATE` သို့မဟုတ် `DELETE` ကို ကြိုးစားပြီး — row က တစ်ပြိုင်နက် update လုပ်ခံရပေမယ့် — လက်ရှိ target နဲ့ လက်ရှိ source tuple အတွက် join condition က အောင်နေသေးရင် — `MERGE` က `UPDATE` သို့မဟုတ် `DELETE` command တွေလိုပဲ — row ရဲ့ update ထားတဲ့ version အပေါ် လုပ်ဆောင်ချက်ကို လုပ်ပါတယ်။ ဒါပေမယ့် — `MERGE` က လုပ်ဆောင်ချက် အများကြီး သတ်မှတ်နိုင်ပြီး — ၎င်းတို့က conditional (အခြေအနေအပေါ် မူတည်သော) ဖြစ်နိုင်လို့ — လုပ်ဆောင်ချက် တစ်ခုချင်းစီရဲ့ condition တွေကို row ရဲ့ update ထားတဲ့ version အပေါ်မှာ — ပထမ လုပ်ဆောင်ချက်ကနေ စပြီး — ပြန်အကဲဖြတ်ပါတယ် — မူလက ကိုက်ညီခဲ့တဲ့ လုပ်ဆောင်ချက်က လုပ်ဆောင်ချက် စာရင်းရဲ့ နောက်ပိုင်းမှာ ရှိနေရင်တောင် ဖြစ်ပါတယ်။ တစ်ဖက်မှာလည်း — row က တစ်ပြိုင်နက် update လုပ်ခံရလို့ join condition မအောင်တော့ဘူးဆိုရင် — `MERGE` က command ရဲ့ `NOT MATCHED BY SOURCE` နဲ့ `NOT MATCHED [BY TARGET]` လုပ်ဆောင်ချက်တွေကို နောက်တစ်ဆင့်အနေနဲ့ အကဲဖြတ်ပြီး — အမျိုးအစား တစ်ခုစီထဲက အောင်မြင်တဲ့ ပထမ လုပ်ဆောင်ချက်ကို လုပ်ဆောင်ပါတယ်။ Row က တစ်ပြိုင်နက် delete လုပ်ခံရရင် — `MERGE` က command ရဲ့ `NOT MATCHED [BY TARGET]` လုပ်ဆောင်ချက်တွေကို အကဲဖြတ်ပြီး — အောင်မြင်တဲ့ ပထမ လုပ်ဆောင်ချက်ကို လုပ်ဆောင်ပါတယ်။ `MERGE` က `INSERT` တစ်ခုကို ကြိုးစားပြီး — unique index တစ်ခု ရှိနေပြီး — duplicate row တစ်ခု တစ်ပြိုင်နက် insert လုပ်ခံရရင် — uniqueness violation error တစ်ခု တက်ပါတယ်; `MERGE` က `MATCHED` condition တွေရဲ့ အကဲဖြတ်မှုကို ပြန်စပြီး ဒီလို error တွေကို ရှောင်ဖို့ မကြိုးစားပါဘူး။

အပေါ်က စည်းမျဉ်းတွေကြောင့် — updating command တစ်ခုက မညီညွတ်တဲ့ snapshot (inconsistent snapshot) တစ်ခုကို မြင်ရတာ ဖြစ်နိုင်ပါတယ်: သူ update လုပ်ဖို့ ကြိုးစားနေတဲ့ row တွေအပေါ် တစ်ပြိုင်နက် updating command တွေရဲ့ အကျိုးသက်ရောက်မှုတွေကို မြင်ရပေမယ့် — database ထဲက တခြား row တွေအပေါ် အဲဒီ command တွေရဲ့ အကျိုးသက်ရောက်မှုတွေကိုတော့ မမြင်ရပါဘူး။ ဒီအပြုအမူက — ရှုပ်ထွေးတဲ့ search condition တွေ ပါတဲ့ command တွေအတွက် Read Committed mode ကို မသင့်လျော်စေပါဘူး; ဒါပေမယ့် — ရိုးရှင်းတဲ့ ကိစ္စတွေအတွက်တော့ အတော် သင့်လျော်ပါတယ်။ ဥပမာ — ငွေစာရင်း (account) တစ်ခုကနေ တစ်ခုဆီ ဒေါ်လာ ၁၀၀ လွှဲပြောင်းတာကို စဉ်းစားကြည့်ပါ:

```sql
BEGIN;
UPDATE accounts SET balance = balance + 100.00 WHERE acctnum = 12345;
UPDATE accounts SET balance = balance - 100.00 WHERE acctnum = 7534;
COMMIT;
```

တခြား transaction တစ်ခုက တစ်ပြိုင်နက် account 7534 ရဲ့ balance ကို ပြောင်းဖို့ ကြိုးစားနေရင် — ဒုတိယ statement က account row ရဲ့ update ထားတဲ့ version နဲ့ စတင်တာ ကျွန်ုပ်တို့ ရှင်းရှင်းလင်းလင်း လိုချင်ပါတယ်။ Command တစ်ခုချင်းစီက ကြိုသတ်မှတ်ထားတဲ့ row တစ်ခုကိုပဲ သက်ရောက်နေလို့ — row ရဲ့ update ထားတဲ့ version ကို မြင်စေတာက ဒုက္ခရောက်စေတဲ့ inconsistency ကို မဖန်တီးပါဘူး။

ပိုရှုပ်ထွေးတဲ့ အသုံးပြုမှုတွေကတော့ Read Committed mode မှာ မလိုလားအပ်တဲ့ ရလဒ်တွေ ထုတ်ပေးနိုင်ပါတယ်။ ဥပမာ — တခြား command တစ်ခုက သူ့ရဲ့ ကန့်သတ်ချက် (restriction criteria) ထဲကနေ ထည့်လည်း ထည့်၊ ဖယ်လည်း ဖယ်နေတဲ့ data အပေါ် လုပ်ဆောင်နေတဲ့ `DELETE` command တစ်ခုကို စဉ်းစားကြည့်ပါ — ဥပမာ `website` က row နှစ်ခု ပါတဲ့ table တစ်ခုဖြစ်ပြီး — `website.hits` တန်ဖိုးတွေက `9` နဲ့ `10` လို့ ယူဆပါ:

```sql
BEGIN;
UPDATE website SET hits = hits + 1;
-- run from another session:  DELETE FROM website WHERE hits = 10;
COMMIT;
```

ဒီ `DELETE` က — `UPDATE` မတိုင်ခင် ရော နောက်မှာပါ `website.hits = 10` ရှိတဲ့ row ရှိနေပေမယ့် — ဘာအကျိုးသက်ရောက်မှုမှ မရှိဘဲ ဖြစ်နေပါလိမ့်မယ်။ ဘာကြောင့်လဲဆိုတော့ — update မလုပ်ရသေးတဲ့ row တန်ဖိုး `9` ကို ကျော်လိုက်ပြီး — `UPDATE` ပြီးသွားတဲ့အခါ `DELETE` က lock ရတဲ့အခါ — row တန်ဖိုးအသစ်က `10` မဟုတ်တော့ဘဲ `11` ဖြစ်နေလို့ — criteria နဲ့ မကိုက်ညီတော့တာပါ။

Read Committed mode က command တစ်ခုစီကို — အဲဒီ အခိုက်အတန့်အထိ commit လုပ်ပြီးသား transaction တွေ အားလုံး ပါဝင်တဲ့ — snapshot အသစ်တစ်ခုနဲ့ စတင်လို့ — transaction တစ်ခုတည်းထဲက နောက် command တွေက — commit ဖြစ်သွားတဲ့ တစ်ပြိုင်နက် transaction ရဲ့ အကျိုးသက်ရောက်မှုတွေကို ဘယ်အခြေအနေမှာမဆို မြင်ရပါလိမ့်မယ်။ အထက်မှာ ပြဿနာ ဖြစ်နေတာက — command တစ်ခုတည်းက database ကို လုံးဝ ညီညွတ်တဲ့ (absolutely consistent) ရှုထောင့်ကနေ မြင်လား မမြင်ဘူးလားဆိုတဲ့ အချက်ပါ။

Read Committed mode က ပေးတဲ့ တစိတ်တပိုင်း transaction isolation က application အများအပြားအတွက် လုံလောက်ပြီး — ဒီ mode က မြန်ပြီး သုံးရလည်း ရိုးရှင်းပါတယ်; ဒါပေမယ့် — ကိစ္စ အားလုံးအတွက်တော့ မလုံလောက်ပါဘူး။ ရှုပ်ထွေးတဲ့ query နဲ့ update တွေ လုပ်တဲ့ application တွေက Read Committed mode ပေးတာထက် — ပိုတိကျပြီး ညီညွတ်တဲ့ database ရှုထောင့် လိုအပ်နိုင်ပါတယ်။

### 13.2.2. Repeatable Read Isolation Level (တစ်ကြိမ် ဖတ်ပြီးသည့်အတိုင်း ထပ်ခါထပ်ခါ ဖတ်နိုင်သည့် isolation level)

*Repeatable Read* isolation level က transaction မစတင်ခင် commit လုပ်ပြီးသား data တွေကိုပဲ မြင်ပြီး — uncommitted data ရော transaction run နေတဲ့ အတောအတွင်း တစ်ပြိုင်နက် transaction တွေ commit လုပ်တဲ့ အပြောင်းအလဲတွေကိုပါ ဘယ်တော့မှ မမြင်ပါဘူး။ (ဒါပေမယ့် — query တစ်ခုချင်းစီက — ၎င်းရဲ့ ကိုယ်ပိုင် transaction ထဲမှာ မကြာခင်က run ခဲ့တဲ့ update တွေရဲ့ အကျိုးသက်ရောက်မှုကိုတော့ — commit မဖြစ်ရသေးဘဲ ရှိနေတာတောင် — မြင်ရပါတယ်။) ဒါက ဒီ isolation level အတွက် SQL standard က လိုအပ်တာထက် ပိုခိုင်မာတဲ့ အာမခံချက်တစ်ခု ဖြစ်ပြီး — ဇယား 13.1 မှာ ဖော်ပြထားတဲ့ phenomena တွေထဲက serialization anomaly တွေကလွဲရင် ကျန်တာ အားလုံးကို တားဆီးပါတယ်။ အထက်မှာ ဖော်ပြခဲ့သလို — standard က isolation level တစ်ခုချင်းစီ ပေးရမယ့် အနည်းဆုံး အကာအကွယ်တွေကိုပဲ ဖော်ပြတာမို့ — ဒါကို standard က အတိအလင်း ခွင့်ပြုထားပါတယ်။

ဒီ level က Read Committed နဲ့ မတူတာက — repeatable read transaction တစ်ခုထဲက query တစ်ခုက — transaction ထဲက လက်ရှိ statement စတဲ့ အချိန်မှာ ရှိတဲ့ snapshot မဟုတ်ဘဲ — transaction ထဲက ပထမဆုံး non-transaction-control statement (transaction ထိန်းချုပ်မှု မဟုတ်တဲ့ statement) စတဲ့ အချိန်မှာ ရှိတဲ့ snapshot ကို မြင်ရတာပါ။ ဒါကြောင့် — transaction တစ်ခုတည်းထဲမှာ ဆက်တိုက် run တဲ့ `SELECT` command တွေက data အတူတူပဲ မြင်ရပါတယ် — ဆိုလိုတာက — သူတို့ရဲ့ transaction စပြီးနောက်ပိုင်း commit လုပ်ခဲ့တဲ့ တခြား transaction တွေရဲ့ အပြောင်းအလဲတွေကို မမြင်ရပါဘူး။

ဒီ level ကို သုံးတဲ့ application တွေက — serialization failure (serial လုပ်ဆောင်မှု မအောင်မြင်မှု) တွေကြောင့် transaction တွေကို ပြန်စ (retry) ဖို့ အသင့် ဖြစ်နေရပါမယ်။

`UPDATE`, `DELETE`, `MERGE`, `SELECT FOR UPDATE`, နဲ့ `SELECT FOR SHARE` command တွေက — target row တွေ ရှာဖွေတဲ့ ကိစ္စမှာ `SELECT` နဲ့ အတူတူပဲ ပြုမူပါတယ်: transaction စတဲ့ အချိန်အထိ commit ပြီးသား target row တွေကိုပဲ ရှာတွေ့ပါလိမ့်မယ်။ ဒါပေမယ့် — ဒီလို target row တစ်ခုက — ရှာတွေ့တဲ့ အချိန်မှာတော့ တခြား တစ်ပြိုင်နက် transaction တစ်ခုက update (သို့မဟုတ် delete ဒါမှမဟုတ် lock) လုပ်ပြီးသား ဖြစ်နေနိုင်ပါတယ်။ ဒီအခါမျိုးမှာ — repeatable read transaction က — ပထမ updating transaction က commit ဒါမှမဟုတ် roll back လုပ်တဲ့အထိ စောင့်ပါလိမ့်မယ် (သူ ဆက်လုပ်နေသေးရင်)။ ပထမ updater က roll back လုပ်ရင် — သူ့ရဲ့ အကျိုးသက်ရောက်မှုတွေ ပျက်ပြယ်ပြီး — repeatable read transaction က မူလ တွေ့ခဲ့တဲ့ row ကို update လုပ်ဖို့ ဆက်လုပ်လို့ ရပါတယ်။ ဒါပေမယ့် ပထမ updater က commit လုပ်ရင် (တကယ် row ကို update ဒါမှမဟုတ် delete လုပ်ခဲ့တယ်ဆိုရင် — lock ပဲ လုပ်ခဲ့တာ မဟုတ်ဘူးဆိုရင်) — repeatable read transaction က ဒီ message နဲ့ roll back ဖြစ်ပါလိမ့်မယ်:

```sql
ERROR:  could not serialize access due to concurrent update
```

ဘာကြောင့်လဲဆိုတော့ — repeatable read transaction တစ်ခုက — repeatable read transaction စပြီးနောက်ပိုင်း တခြား transaction တွေ ပြောင်းလဲလိုက်တဲ့ row တွေကို modify သို့မဟုတ် lock လုပ်လို့ မရလို့ပါ။

Application တစ်ခုက ဒီ error message ရတဲ့အခါ — လက်ရှိ transaction ကို abort လုပ်ပြီး — transaction တစ်ခုလုံးကို အစကနေ ပြန်စသင့်ပါတယ်။ ဒုတိယအကြိမ် လုပ်တဲ့အခါ — transaction က အရင်က commit လုပ်ထားတဲ့ အပြောင်းအလဲကို သူ့ရဲ့ ကနဦး database ရှုထောင့်ရဲ့ အစိတ်အပိုင်းအဖြစ် မြင်ရမှာ ဖြစ်လို့ — row ရဲ့ version အသစ်ကို transaction အသစ်ရဲ့ update အတွက် စမှတ်အဖြစ် သုံးတာမှာ ယုတ္တိ ပဋိပက္ခ (logical conflict) မရှိပါဘူး။

သတိပြုရမှာက — updating transaction တွေပဲ ပြန်စဖို့ လိုနိုင်တာပါ; read-only transaction တွေမှာ serialization conflict တွေ ဘယ်တော့မှ မဖြစ်ပါဘူး။

Repeatable Read mode က — transaction တစ်ခုချင်းစီက database ကို လုံးဝ တည်ငြိမ်တဲ့ (completely stable) ရှုထောင့်ကနေ မြင်ရတယ်ဆိုတဲ့ တိကျတဲ့ အာမခံချက် ပေးပါတယ်။ ဒါပေမယ့် — ဒီရှုထောင့်က — level တူညီတဲ့ တစ်ပြိုင်နက် transaction တွေရဲ့ serial (တစ်ခုပြီးတစ်ခု) run လုပ်မှု တစ်ချို့နဲ့တော့ မလိုမဖြစ် ညီညွတ်နေမှာ မဟုတ်ပါဘူး။ ဥပမာ — ဒီ level မှာ read-only transaction တစ်ခုတောင် — batch တစ်ခု ပြီးစီးကြောင်း ပြသဖို့ update လုပ်ထားတဲ့ control record တစ်ခုကို မြင်ရပေမယ့် — control record ရဲ့ အစောပိုင်း revision တစ်ခုကို ဖတ်ခဲ့လို့ — batch ရဲ့ အစိတ်အပိုင်း ယုတ္တိအရ ဖြစ်တဲ့ detail record တစ်ခုကိုတော့ မမြင်ရဘဲ ဖြစ်နိုင်ပါတယ်။ ဒီ isolation level နဲ့ run တဲ့ transaction တွေက business rule တွေကို ကျင့်သုံးဖို့ ကြိုးစားတာက — conflict ဖြစ်နေတဲ့ transaction တွေကို ပိတ်ဆို့ဖို့ explicit lock တွေကို ဂရုတစိုက် သုံးမှသာ မှန်ကန်စွာ အလုပ်ဖြစ်နိုင်မှာ ဖြစ်ပါတယ်။

Repeatable Read isolation level ကို — academic database စာပေတွေနဲ့ database product တချို့မှာ *Snapshot Isolation* လို့ သိကြတဲ့ technique တစ်ခုနဲ့ implement လုပ်ထားပါတယ်။ Concurrency ကို လျှော့ချတတ်တဲ့ ရိုးရာ locking technique သုံးတဲ့ system တွေနဲ့ ယှဉ်ရင် — အပြုအမူနဲ့ performance ကွာခြားမှုတွေ တွေ့ရနိုင်ပါတယ်။ တခြား system တချို့က Repeatable Read နဲ့ Snapshot Isolation ကို — အပြုအမူ မတူညီတဲ့ — isolation level သီးခြား နှစ်ခုအနေနဲ့တောင် ကမ်းလှမ်းနိုင်ပါတယ်။ Technique နှစ်ခုကို ခွဲခြားပေးတဲ့ ခွင့်ပြုထားတဲ့ phenomena တွေကို — SQL standard တီထွင်ပြီးမှသာ database သုတေသီတွေက formalize (စည်းမျဉ်း သတ်မှတ်) လုပ်ခဲ့ကြတာ ဖြစ်ပြီး — ဒီ manual ရဲ့ အတိုင်းအတာ ပြင်ပမှာ ရှိပါတယ်။ အပြည့်အစုံ ဖတ်ချင်ရင် [berenson95](https://www.postgresql.org/docs/current/biblio.html#BERENSON95) ကို ကြည့်ပါ။

> **မှတ်ချက်:** PostgreSQL version 9.1 မတိုင်ခင် — Serializable transaction isolation level အတွက် တောင်းဆိုချက်က ဒီမှာ ဖော်ပြထားတဲ့ အပြုအမူ အတိအကျပဲ ပေးခဲ့ပါတယ်။ အရင်က (legacy) Serializable အပြုအမူကို ထိန်းထားချင်ရင် — အခုတော့ Repeatable Read ကို တောင်းဆိုသင့်ပါတယ်။

### 13.2.3. Serializable Isolation Level (serial ဖြစ်စဉ်ကဲ့သို့ အစဉ်လိုက် ညီညွတ်မှု ရှိသည့် isolation level)

*Serializable* isolation level က အကြပ်ဆုံး transaction isolation ကို ပေးပါတယ်။ ဒီ level က — commit လုပ်တဲ့ transaction တွေ အားလုံးအတွက် — transaction တွေကို တစ်ပြိုင်နက် မဟုတ်ဘဲ — တစ်ခုပြီးတစ်ခု နောက်ဆက်တိုက် (serially) run လုပ်ခဲ့သလိုမျိုး — serial transaction execution ကို emulate (အတုယူ ပုံဖော်) လုပ်ပါတယ်။ ဒါပေမယ့် — Repeatable Read level လိုပဲ — ဒီ level သုံးတဲ့ application တွေက serialization failure တွေကြောင့် transaction တွေကို ပြန်စဖို့ အသင့် ဖြစ်နေရပါမယ်။ တကယ်တော့ — ဒီ isolation level က Repeatable Read နဲ့ အတိအကျ တူညီစွာ အလုပ်လုပ်ပြီး — တစ်ပြိုင်နက် serializable transaction အစုတစ်စုရဲ့ လုပ်ဆောင်မှုကို — အဲဒီ transaction တွေရဲ့ ဖြစ်နိုင်တဲ့ serial (တစ်ခုပြီးတစ်ခု) run လုပ်မှု အားလုံးနဲ့ မကိုက်ညီတဲ့ ပုံစံမျိုး ဖြစ်စေနိုင်တဲ့ အခြေအနေတွေကိုပါ စောင့်ကြည့် (monitor) လုပ်တာ ကလွဲပြီး ပါ။ ဒီ စောင့်ကြည့်မှုက repeatable read မှာ ရှိတာထက် ပိုတဲ့ blocking ကို မိတ်ဆက် မပေးပါဘူး — ဒါပေမယ့် — စောင့်ကြည့်မှုအတွက် overhead (ထပ်ဆောင်း စရိတ်) တချို့တော့ ရှိပြီး — *serialization anomaly* တစ်ခုကို ဖြစ်စေနိုင်တဲ့ အခြေအနေတွေကို တွေ့ရှိမှုက *serialization failure* တစ်ခုကို ဖြစ်ပေါ်စေပါလိမ့်မယ်။

ဥပမာအနေနဲ့ — ကနဦးမှာ အောက်ပါအတိုင်း ပါဝင်တဲ့ `mytab` ဆိုတဲ့ table တစ်ခုကို စဉ်းစားကြည့်ပါ:

```sql
 class | value
-------+-------
     1 |    10
     1 |    20
     2 |   100
     2 |   200
```

serializable transaction A က ဒီလို တွက်ချက်တယ် ဆိုပါစို့:

```sql
SELECT SUM(value) FROM mytab WHERE class = 1;
```

ပြီးတော့ ရလဒ် (30) ကို `class` `= 2` ရှိတဲ့ row အသစ်တစ်ခုရဲ့ `value` အဖြစ် insert လုပ်ပါတယ်။ တစ်ပြိုင်နက် — serializable transaction B က ဒီလို တွက်ချက်ပြီး:

```sql
SELECT SUM(value) FROM mytab WHERE class = 2;
```

ရလဒ် 300 ကို ရယူပြီး — `class` `= 1` ရှိတဲ့ row အသစ်တစ်ခုထဲကို insert လုပ်ပါတယ်။ ပြီးတော့ transaction နှစ်ခုလုံး commit လုပ်ဖို့ ကြိုးစားပါတယ်။ Transaction တစ်ခုခုက Repeatable Read isolation level နဲ့ run နေတယ်ဆိုရင် — နှစ်ခုလုံး commit လုပ်ခွင့် ရမှာ ဖြစ်ပါတယ်; ဒါပေမယ့် — ရလဒ်နဲ့ ကိုက်ညီတဲ့ serial execution အစီအစဉ် မရှိတာကြောင့် — Serializable transaction တွေ သုံးရင် — transaction တစ်ခုကို commit လုပ်ခွင့် ပေးပြီး — ကျန်တစ်ခုကို ဒီ message နဲ့ roll back လုပ်ပါလိမ့်မယ်:

```sql
ERROR:  could not serialize access due to read/write dependencies among transactions
```

ဘာကြောင့်လဲဆိုတော့ — A က B ရဲ့ ရှေ့မှာ run ခဲ့မယ်ဆိုရင် — B က ပေါင်းလဒ် 330 ကို တွက်မိမှာ ဖြစ်ပြီး 300 မဟုတ်ပါဘူး — အလားတူပဲ — နောက်ပြောင်းပြန် အစီအစဉ်ဆိုရင်လည်း A တွက်တဲ့ ပေါင်းလဒ် မတူညီတာ ဖြစ်စေမှာမို့ပါ။

Serializable transaction တွေကို အားကိုးပြီး anomaly တွေကို ကာကွယ်တဲ့အခါ — permanent user table တစ်ခုကနေ ဖတ်လိုက်တဲ့ data က — အဲဒါကို ဖတ်ခဲ့တဲ့ transaction က အောင်မြင်စွာ commit ဖြစ်ပြီးမှသာ valid အဖြစ် မှတ်ယူသင့်တာ အရေးကြီးပါတယ်။ Read-only transaction တွေအတွက်တောင် မှန်ပါတယ် — *deferrable* read-only transaction တစ်ခုထဲမှာ ဖတ်တဲ့ data ကလွဲရင် — အဲဒီလို transaction မျိုးက ဒီလို ပြဿနာတွေကနေ ကင်းစင်ဖို့ အာမခံထားတဲ့ snapshot တစ်ခုကို မရမချင်း — data တွေ မဖတ်ခင် စောင့်ဆိုင်းထားလို့ — ဖတ်လိုက်တာနဲ့ valid ဖြစ်တယ်လို့ သိရလို့ပါ။ ကျန် အခြေအနေတွေ အားလုံးမှာ — application တွေက နောက်မှ abort ဖြစ်သွားတဲ့ transaction အတွင်း ဖတ်ခဲ့တဲ့ ရလဒ်တွေကို အားမကိုးရဘဲ — transaction အောင်မြင်တဲ့အထိ ပြန်စ (retry) လုပ်သင့်ပါတယ်။

စစ်မှန်တဲ့ serializability (true serializability) ကို အာမခံဖို့ PostgreSQL က *predicate locking* ကို သုံးပါတယ် — ဆိုလိုတာက — write တစ်ခုက — အရင်ဆုံး run ခဲ့မယ်ဆိုရင် — တစ်ပြိုင်နက် transaction တစ်ခုရဲ့ အရင်က read ရဲ့ ရလဒ်အပေါ် သက်ရောက်မှု ရှိမယ် မရှိမယ်ကို ဆုံးဖြတ်နိုင်စေတဲ့ lock တွေကို ထိန်းသိမ်းထားတာပါ။ PostgreSQL မှာ ဒီ lock တွေက blocking ကို ဘာမှ မဖြစ်စေလို့ — deadlock (သေကြောင်းကန်း ပိတ်ဆို့မှု) ဖြစ်စေတဲ့ အခန်းကဏ္ဍကနေ ပါဝင်လို့ မရပါဘူး။ ၎င်းတို့ကို — တစ်ပြိုင်နက် Serializable transaction တွေကြားက dependencies တွေကို ဖော်ထုတ်၊ အမှတ်အသား လုပ်ဖို့ သုံးပြီး — ပေါင်းစပ်မှု တချို့က serialization anomaly တွေဆီ ဦးတည်သွားနိုင်ပါတယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — data consistency သေချာစေချင်တဲ့ Read Committed သို့မဟုတ် Repeatable Read transaction တစ်ခုက — table တစ်ခုလုံးကို lock လုပ်ဖို့ လိုနိုင်ပြီး — အဲဒါက အဲဒီ table ကို သုံးဖို့ ကြိုးစားနေတဲ့ တခြား user တွေကို ပိတ်ဆို့နိုင်ပါတယ် — ဒါမှမဟုတ် — တခြား transaction တွေကို ပိတ်ဆို့ရုံမက disk access ပါ ဖြစ်စေနိုင်တဲ့ `SELECT FOR UPDATE` သို့မဟုတ် `SELECT FOR SHARE` ကို သုံးရနိုင်ပါတယ်။

PostgreSQL မှာ predicate lock တွေက — database system အများစုမှာလိုပဲ — transaction တစ်ခု တကယ် access လုပ်ခဲ့တဲ့ data ကို အခြေခံပါတယ်။ ဒါတွေက [`pg_locks`](https://www.postgresql.org/docs/current/view-pg-locks.html) system view ထဲမှာ `mode` က `SIReadLock` ဖြစ်တဲ့အနေနဲ့ ပေါ်လာပါလိမ့်မယ်။ Query တစ်ခု run တုန်းက ရယူလိုက်တဲ့ သီးခြား lock တွေက query သုံးတဲ့ plan အပေါ် မူတည်ပြီး — transaction ရဲ့ လမ်းကြောင်း အတောအတွင်းမှာ — lock တွေကို ခြေရာခံဖို့ သုံးတဲ့ memory ကုန်ဆုံးမှု မဖြစ်အောင် — finer-grained (အသေးစိတ် ခွဲခြမ်းထားသော) lock အများအပြား (ဥပမာ tuple lock) တွေကို coarser-grained (အကြမ်း စုစည်းထားသော) lock အနည်းငယ် (ဥပမာ page lock) အဖြစ် ပေါင်းစပ်နိုင်ပါတယ်။ `READ ONLY` transaction တစ်ခုက — serialization anomaly ဆီ ဦးတည်နိုင်တဲ့ conflict တွေ နောက်ထပ် မဖြစ်နိုင်တော့ဘူးဆိုတာ သိလိုက်ရရင် — သူ့ရဲ့ SIRead lock တွေကို မပြီးခင် လွှတ်ပေးနိုင်ပါတယ်။ တကယ်တော့ — `READ ONLY` transaction တွေက အဲဒီအချက်ကို စတင်ချိန်မှာတင် သေချာအောင် လုပ်နိုင်ပြီး — predicate lock တွေ ဘာမှ မယူဘဲ ရှောင်နိုင်လေ့ ရှိပါတယ်။ `SERIALIZABLE READ ONLY DEFERRABLE` transaction တစ်ခုကို အတိအကျ တောင်းဆိုရင် — ဒီအချက်ကို သေချာအောင် မလုပ်နိုင်မချင်း block ဖြစ်နေပါလိမ့်မယ်။ (ဒါက Serializable transaction တွေ block ဖြစ်ပြီး Repeatable Read transaction တွေ မဖြစ်တဲ့ တစ်ခုတည်းသော အခြေအနေပါ။) တစ်ဖက်မှာလည်း — SIRead lock တွေကို — ထပ်နေတဲ့ (overlapping) read-write transaction တွေ ပြီးမြောက်တဲ့အထိ — transaction commit ပြီးချိန် ကျော်လွန်ပြီး ထိန်းသိမ်းထားဖို့ မကြာခဏ လိုပါတယ်။

Serializable transaction တွေကို တသမတ်တည်း သုံးတာက development ကို ရိုးရှင်းစေနိုင်ပါတယ်။ အောင်မြင်စွာ commit ဖြစ်တဲ့ တစ်ပြိုင်နက် Serializable transaction အစုတစ်စုရဲ့ ရလဒ်က — တစ်ခုပြီးတစ်ခု run ခဲ့တာနဲ့ အတူတူပဲ ဖြစ်မယ်ဆိုတဲ့ အာမခံချက်က — transaction တစ်ခုကို ရေးထားတဲ့အတိုင်း ကိုယ်တိုင်တည်း run ရင် မှန်ကန်တယ်လို့ သက်သေပြနိုင်ရင် — တခြား transaction တွေ ဘာတွေ လုပ်နိုင်မယ်ဆိုတဲ့ အချက်အလက် ဘာမှ မရှိဘဲနဲ့တောင် — Serializable transaction တွေရဲ့ ဘယ်လို ရောနှောမှု (mix) ထဲမှာမဆို မှန်ကန်စွာ လုပ်မယ် — ဒါမှမဟုတ် အောင်မြင်စွာ commit မဖြစ်ဘူး — ဆိုတာကို ယုံကြည်စိတ်ချနိုင်တယ်လို့ ဆိုလိုပါတယ်။ ဒီ technique ကို သုံးတဲ့ environment တစ်ခုမှာ — serialization failure တွေကို ကိုင်တွယ်တဲ့ ယေဘုယျ နည်းလမ်း (ဒါတွေက SQLSTATE တန်ဖိုး '40001' နဲ့ အမြဲ ပြန်လာတယ်) တစ်ခု ရှိဖို့ အရေးကြီးပါတယ် — ဘာကြောင့်လဲဆိုတော့ — ဘယ် transaction တွေက read/write dependencies တွေထဲ ပါဝင်နိုင်ပြီး — serialization anomaly တွေ ကာကွယ်ဖို့ roll back လုပ်ဖို့ လိုနိုင်လဲဆိုတာ အတိအကျ ခန့်မှန်းဖို့ အရမ်း ခက်မှာ မို့ပါ။ Read/write dependencies တွေရဲ့ စောင့်ကြည့်မှုက စရိတ် ရှိသလို — serialization failure နဲ့ အဆုံးသတ်ခံရတဲ့ transaction တွေ ပြန်စရတာလည်း စရိတ် ရှိပါတယ် — ဒါပေမယ့် — explicit lock တွေနဲ့ `SELECT FOR UPDATE` သို့မဟုတ် `SELECT FOR SHARE` သုံးတာနဲ့ ပါလာတဲ့ စရိတ်နဲ့ blocking တွေနဲ့ ချိန်ဆကြည့်ရင် — Serializable transaction တွေက environment တချို့အတွက် အကောင်းဆုံး performance ရွေးချယ်မှု ဖြစ်ပါတယ်။

PostgreSQL ရဲ့ Serializable transaction isolation level က — တူညီတဲ့ အကျိုးသက်ရောက်မှု ထုတ်ပေးမယ့် serial execution အစီအစဉ် ရှိတယ်လို့ သက်သေပြနိုင်မှသာ တစ်ပြိုင်နက် transaction တွေကို commit လုပ်ခွင့် ပေးပေမယ့် — တကယ့် serial execution မှာ မဖြစ်စေတဲ့ error တွေ တက်လာတာကိုတော့ အမြဲတမ်း မကာကွယ်နိုင်ပါဘူး။ အထူးသဖြင့် — key ကို insert မလုပ်ခင် မရှိကြောင်း အတိအကျ (explicitly) စစ်ပြီးမှတောင် — ထပ်နေတဲ့ Serializable transaction တွေနဲ့ conflict ဖြစ်လို့ unique constraint violation (ထူးခြားမှု ကန့်သတ်ချက် ချိုးဖောက်မှု) တွေ တွေ့ရတာ ဖြစ်နိုင်ပါတယ်။ Conflict ဖြစ်နိုင်တဲ့ key တွေကို insert လုပ်တဲ့ Serializable transaction တွေ အားလုံးက — အရင်ဆုံး အဲဒါ လုပ်နိုင်လားဆိုတာ အတိအကျ စစ်ကြောင်း သေချာအောင် လုပ်ခြင်းဖြင့် ဒါကို ရှောင်နိုင်ပါတယ်။ ဥပမာ — application တစ်ခုက user ဆီကနေ key အသစ်တစ်ခု တောင်းပြီး — အရင်ဆုံး select လုပ်ကြည့်ပြီး မရှိဘူးဆိုတာ စစ်တယ် — ဒါမှမဟုတ် — ရှိနေတဲ့ key တွေထဲက အကြီးဆုံးကို select လုပ်ပြီး တစ်ခု ပေါင်းပြီး key အသစ် ထုတ်တယ်ဆိုပါစို့။ Serializable transaction တချို့က ဒီ protocol ကို မလိုက်နာဘဲ key အသစ်တွေကို တိုက်ရိုက် insert လုပ်ရင် — တစ်ပြိုင်နက် transaction တွေရဲ့ serial execution မှာ မဖြစ်နိုင်တဲ့ အခြေအနေမှာတောင် unique constraint violation တွေ အစီရင်ခံခံရနိုင်ပါတယ်။

Concurrency control အတွက် Serializable transaction တွေကို အားကိုးတဲ့အခါ အကောင်းဆုံး performance ရဖို့ — ဒီအချက်တွေကို ထည့်သွင်း စဉ်းစားသင့်ပါတယ်:

- ဖြစ်နိုင်ရင် transaction တွေကို READ ONLY အဖြစ် ကြေညာပါ။
- Active connection အရေအတွက်ကို ထိန်းချုပ်ပါ — လိုအပ်ရင် connection pool သုံးပါ။ ဒါက အမြဲတမ်း အရေးကြီးတဲ့ performance ထည့်သွင်း စဉ်းစားမှု တစ်ခုပါ — ဒါပေမယ့် — Serializable transaction တွေ သုံးနေတဲ့ busy system တစ်ခုမှာ အထူး အရေးကြီးနိုင်ပါတယ်။
- Integrity (ဒေတာ မှန်ကန်ခိုင်မာမှု) အတွက် လိုအပ်တာထက် transaction တစ်ခုထဲမှာ ပိုပြီး မထည့်ပါနဲ့။
- Connection တွေကို လိုအပ်တာထက် ကြာကြာ “idle in transaction” အနေနဲ့ ချိတ်ဆွဲ မထားပါနဲ့။ idle_in_transaction_session_timeout ဆိုတဲ့ configuration parameter ကို သုံးပြီး — အချိန်ဆွဲနေတဲ့ (lingering) session တွေကို အလိုအလျောက် ချိတ်ဆက်မှု ဖြတ်ဖို့ လုပ်နိုင်ပါတယ်။
- Serializable transaction တွေက အလိုအလျောက် ပေးတဲ့ အကာအကွယ်တွေကြောင့် မလိုတော့တဲ့ explicit lock, `SELECT FOR UPDATE` နဲ့ `SELECT FOR SHARE` တွေကို ဖယ်ရှားပါ။
- Predicate lock table က memory ရှားပါးနေလို့ system က page-level predicate lock အများအပြားကို relation-level predicate lock တစ်ခုတည်းအဖြစ် ပေါင်းစပ်ဖို့ အတင်းအကျပ် ဖြစ်ရတဲ့အခါ — serialization failure နှုန်း တိုးလာတာ ဖြစ်နိုင်ပါတယ်။ max_pred_locks_per_transaction, max_pred_locks_per_relation နဲ့/သို့မဟုတ် max_pred_locks_per_page တွေကို တိုးပေးခြင်းဖြင့် ဒါကို ရှောင်နိုင်ပါတယ်။
- Sequential scan တစ်ခုက relation-level predicate lock တစ်ခုကို အမြဲတမ်း လိုအပ်ပါလိမ့်မယ်။ ဒါက serialization failure နှုန်း တိုးလာစေနိုင်ပါတယ်။ random_page_cost ကို လျှော့ပြီး နဲ့/သို့မဟုတ် cpu_tuple_cost ကို တိုးပေးခြင်းဖြင့် index scan တွေ သုံးဖို့ အားပေးတာ အထောက်အကူ ဖြစ်နိုင်ပါတယ်။ Transaction rollback နဲ့ restart တွေ ကျဆင်းလာတာကို query execution အချိန် တစ်ခုလုံးရဲ့ ပြောင်းလဲမှုနဲ့ ချိန်ဆ ကြည့်ဖို့ သေချာပါစေ။

Serializable isolation level ကို — academic database စာပေတွေမှာ Serializable Snapshot Isolation လို့ သိကြတဲ့ technique တစ်ခုနဲ့ implement လုပ်ထားပြီး — ၎င်းက Snapshot Isolation အပေါ်မှာ serialization anomaly တွေအတွက် စစ်ဆေးမှုတွေ ထပ်ဖြည့်ပြီး တည်ဆောက်ထားတာပါ။ ရိုးရာ locking technique သုံးတဲ့ တခြား system တွေနဲ့ ယှဉ်ရင် — အပြုအမူနဲ့ performance ကွာခြားချက်တချို့ တွေ့ရနိုင်ပါတယ်။ အသေးစိတ် အချက်အလက်အတွက် [ports12](https://www.postgresql.org/docs/current/biblio.html#PORTS12) ကို ကြည့်ပါ။
