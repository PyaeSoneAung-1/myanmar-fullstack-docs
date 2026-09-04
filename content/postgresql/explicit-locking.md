---
title: "Explicit Locking (explicit lock ပြုလုပ်ခြင်း)"
description: "Explicit locking (ကိုယ်တိုင် အတိအကျ ပြုလုပ်သော locking) — table-level, row-level နှင့် page-level lock modes များ၊ lock compatibility ဇယားများ၊ deadlock နှင့် advisory lock များအကြောင်း"
order: 130
source: "https://www.postgresql.org/docs/current/explicit-locking.html"
status: translated
updated: 2026-09-03
---

## 13.3. Explicit Locking (explicit lock ပြုလုပ်ခြင်း)

- **13.3.1. Table-Level Locks (table အဆင့် lock များ)**
- **13.3.2. Row-Level Locks (row အဆင့် lock များ)**
- **13.3.3. Page-Level Locks (page အဆင့် lock များ)**
- **13.3.4. Deadlocks (deadlock — အပြန်အလှန် ပိတ်ဆို့မှုများ)**
- **13.3.5. Advisory Locks (advisory lock များ)**

PostgreSQL က table တွေထဲက data တွေဆီ တစ်ပြိုင်နက် ဝင်ရောက် လုပ်ဆောင်မှု (concurrent access) ကို ထိန်းချုပ်ဖို့ — lock mode (သော့ခတ်မှု ပုံစံ) အမျိုးမျိုးကို ပံ့ပိုးပေးပါတယ်။ MVCC က လိုချင်တဲ့ အပြုအမူ (behavior) ကို မပေးနိုင်တဲ့ အခြေအနေတွေမှာ — ဒီ mode တွေကို application ကြီးကြပ် ထိန်းချုပ်တဲ့ locking (application-controlled locking) အတွက် သုံးနိုင်ပါတယ်။ ဒါ့အပြင် — PostgreSQL command အများစုက — command လုပ်ဆောင်နေချိန်အတွင်း ရည်ညွှန်းထားတဲ့ table တွေ drop လုပ်ခံရခြင်း သို့မဟုတ် မကိုက်ညီတဲ့ (incompatible) နည်းလမ်းတွေနဲ့ ပြုပြင်မွမ်းမံခံရခြင်းကနေ ကင်းဝေးစေဖို့ — သင့်တော်တဲ့ mode တွေရဲ့ lock တွေကို အလိုအလျောက် ရယူပါတယ်။ (ဥပမာ — `TRUNCATE` က တူညီတဲ့ table ပေါ်မှာ တခြား operation တွေနဲ့ တစ်ပြိုင်နက် လုံခြုံစွာ လုပ်ဆောင်လို့ မရတဲ့အတွက် — အဲဒါကို သေချာစေဖို့ table ပေါ်မှာ `ACCESS EXCLUSIVE` lock တစ်ခုကို ရယူပါတယ်။)

Database server တစ်ခုအတွင်းမှာ လက်ရှိ ထွက်ပေါ်နေဆဲ (outstanding) lock တွေရဲ့ စာရင်းကို စစ်ဆေးဖို့ — [`pg_locks`](https://www.postgresql.org/docs/current/view-pg-locks.html) system view ကို သုံးပါ။ Lock manager subsystem ရဲ့ အခြေအနေ စောင့်ကြည့်ခြင်းဆိုင်ရာ နောက်ထပ် အချက်အလက်တွေအတွက် — [အခန်း 27](https://www.postgresql.org/docs/current/monitoring.html) ကို ရည်ညွှန်းပါ။

### 13.3.1. Table-Level Locks (table အဆင့် lock များ)

အောက်က စာရင်းက — PostgreSQL က အလိုအလျောက် အသုံးပြုတဲ့ — ရနိုင်တဲ့ lock mode တွေနဲ့ ၎င်းတို့ သုံးစွဲခံရတဲ့ အခြေအနေ (context) တွေကို ပြပါတယ်။ ဒီ lock တွေထဲက ဘယ်ဟာကိုမဆို — [LOCK](https://www.postgresql.org/docs/current/sql-lock.html) command နဲ့ — အတိအကျ (explicitly) လည်း ရယူလို့ ရပါတယ်။ ဒီ lock mode တွေ အားလုံးက table-level lock တွေပဲ ဖြစ်တယ်ဆိုတာ သတိရပါ — နာမည်ထဲမှာ “row” ဆိုတဲ့ စာလုံး ပါနေရင်တောင် ဖြစ်ပါတယ်; lock mode တွေရဲ့ နာမည်တွေက သမိုင်းကြောင်းအရ ကျန်ရစ်ခဲ့တာတွေပါ။ အတိုင်းအတာ တစ်ခုအထိတော့ — နာမည်တွေက lock mode တစ်ခုချင်းစီရဲ့ ပုံမှန် အသုံးပြုမှုကို ထင်ဟပ်ပေမယ့် — semantics (အဓိပ္ပာယ်) တွေကတော့ အားလုံး အတူတူပါပဲ။ Lock mode တစ်ခုနဲ့ တစ်ခုကြားက တကယ့် ကွာခြားချက် တစ်ခုတည်းကတော့ — တစ်ခုချင်းစီနဲ့ conflict (ထိပ်တိုက်မှု) ဖြစ်တဲ့ lock mode အစုအဝေး ဖြစ်ပါတယ် (ဇယား 13.2 ကို ကြည့်ပါ)။ Transaction နှစ်ခုက — တူညီတဲ့ table ပေါ်မှာ — conflict ဖြစ်တဲ့ mode တွေရဲ့ lock တွေကို တစ်ချိန်တည်းမှာ ကိုင်ထားလို့ မရပါဘူး။ (ဒါပေမယ့် — transaction တစ်ခုက ကိုယ့်နဲ့ ကိုယ် ဘယ်တော့မှ conflict မဖြစ်ပါဘူး။ ဥပမာ — တူညီတဲ့ table ပေါ်မှာ `ACCESS EXCLUSIVE` lock ကို ရယူပြီးနောက် `ACCESS SHARE` lock ကို နောက်မှ ထပ်ရယူတာမျိုး ဖြစ်နိုင်ပါတယ်။) Conflict မဖြစ်တဲ့ lock mode တွေကိုတော့ — transaction အများအပြားက တစ်ပြိုင်နက် ကိုင်ထားနိုင်ပါတယ်။ အထူးသဖြင့် — lock mode တချို့က ကိုယ့်နဲ့ ကိုယ် conflict ဖြစ်တယ် (ဥပမာ — `ACCESS EXCLUSIVE` lock ကို transaction တစ်ခုထက်ပိုပြီး တစ်ချိန်တည်း ကိုင်ထားလို့ မရပါဘူး) — တချို့ကတော့ ကိုယ့်နဲ့ ကိုယ် conflict မဖြစ်ဘူးဆိုတာ သတိပြုပါ (ဥပမာ — `ACCESS SHARE` lock ကို transaction အများအပြားက တစ်ပြိုင်နက် ကိုင်ထားနိုင်ပါတယ်)။

**Table-Level Lock Modes (table အဆင့် lock mode များ)**

- **ACCESS SHARE (AccessShareLock)** — ACCESS EXCLUSIVE lock mode နဲ့သာ conflict ဖြစ်ပါတယ်။ SELECT command က ရည်ညွှန်းထားတဲ့ (referenced) table တွေပေါ်မှာ ဒီ mode ရဲ့ lock ကို ရယူပါတယ်။ ယေဘုယျအားဖြင့် — table တစ်ခုကို ဖတ်ရုံသက်သက် (read only) လုပ်ပြီး ပြုပြင်မွမ်းမံမှု မပြုတဲ့ query တိုင်းက ဒီ lock mode ကို ရယူပါလိမ့်မယ်။
- **ROW SHARE (RowShareLock)** — EXCLUSIVE နဲ့ ACCESS EXCLUSIVE lock mode တွေနဲ့ conflict ဖြစ်ပါတယ်။ SELECT command က — FOR UPDATE, FOR NO KEY UPDATE, FOR SHARE ဒါမှမဟုတ် FOR KEY SHARE option တွေထဲက တစ်ခုခုကို သတ်မှတ်ထားတဲ့ table တွေ အားလုံးပေါ်မှာ ဒီ mode ရဲ့ lock ကို ရယူပါတယ် (တိကျတဲ့ FOR ... locking option တစ်ခုခုနဲ့ မရည်ညွှန်းဘဲ ပါဝင်တဲ့ တခြား table တွေပေါ်က ACCESS SHARE lock တွေအပြင်)။
- **ROW EXCLUSIVE (RowExclusiveLock)** — SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE နဲ့ ACCESS EXCLUSIVE lock mode တွေနဲ့ conflict ဖြစ်ပါတယ်။ UPDATE, DELETE, INSERT နဲ့ MERGE command တွေက target table ပေါ်မှာ ဒီ lock mode ကို ရယူပါတယ် (တခြား ရည်ညွှန်းထားတဲ့ table တွေပေါ်က ACCESS SHARE lock တွေအပြင်)။ ယေဘုယျအားဖြင့် — table တစ်ခုထဲက data ကို ပြုပြင်မွမ်းမံတဲ့ command တိုင်းက ဒီ lock mode ကို ရယူပါလိမ့်မယ်။
- **SHARE UPDATE EXCLUSIVE (ShareUpdateExclusiveLock)** — SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE နဲ့ ACCESS EXCLUSIVE lock mode တွေနဲ့ conflict ဖြစ်ပါတယ်။ ဒီ mode က table တစ်ခုကို တစ်ပြိုင်နက် ဖြစ်ပေါ်လာတဲ့ schema ပြောင်းလဲမှုတွေနဲ့ VACUUM run တွေကနေ ကာကွယ်ပေးပါတယ်။ VACUUM (FULL မပါဘဲ), ANALYZE, CREATE INDEX CONCURRENTLY, CREATE STATISTICS, COMMENT ON, REINDEX CONCURRENTLY နဲ့ ALTER INDEX, ALTER TABLE ရဲ့ ပုံစံကွဲ (variant) တချို့က ဒီ mode ကို ရယူပါတယ် (အပြည့်အစုံ အသေးစိတ်အတွက် ဒီ command တွေရဲ့ documentation ကို ကြည့်ပါ)။
- **SHARE (ShareLock)** — ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE ROW EXCLUSIVE, EXCLUSIVE နဲ့ ACCESS EXCLUSIVE lock mode တွေနဲ့ conflict ဖြစ်ပါတယ်။ ဒီ mode က table တစ်ခုကို တစ်ပြိုင်နက် ဖြစ်ပေါ်လာတဲ့ data ပြောင်းလဲမှုတွေကနေ ကာကွယ်ပေးပါတယ်။ CREATE INDEX (CONCURRENTLY မပါဘဲ) က ဒီ mode ကို ရယူပါတယ်။
- **SHARE ROW EXCLUSIVE (ShareRowExclusiveLock)** — ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE နဲ့ ACCESS EXCLUSIVE lock mode တွေနဲ့ conflict ဖြစ်ပါတယ်။ ဒီ mode က table တစ်ခုကို တစ်ပြိုင်နက် ဖြစ်ပေါ်လာတဲ့ data ပြောင်းလဲမှုတွေကနေ ကာကွယ်ပေးပြီး — session တစ်ခုတည်းကသာ တစ်ချိန်တည်းမှာ ကိုင်ထားနိုင်အောင် — self-exclusive (ကိုယ့်နဲ့ ကိုယ် သီးသန့်ခွဲ) လည်း ဖြစ်ပါတယ်။ CREATE TRIGGER နဲ့ ALTER TABLE ရဲ့ ပုံစံတချို့က ဒီ mode ကို ရယူပါတယ်။
- **EXCLUSIVE (ExclusiveLock)** — ROW SHARE, ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE နဲ့ ACCESS EXCLUSIVE lock mode တွေနဲ့ conflict ဖြစ်ပါတယ်။ ဒီ mode က ACCESS SHARE lock တွေကိုပဲ တစ်ပြိုင်နက် ခွင့်ပြုပါတယ် — ဆိုလိုတာက ဒီ lock mode ကို ကိုင်ထားတဲ့ transaction တစ်ခုနဲ့ အပြိုင်မှာ table ကနေ ဖတ်ခြင်း (read) တွေကသာ ရှေ့ဆက် လုပ်ဆောင်နိုင်ပါတယ်။ REFRESH MATERIALIZED VIEW CONCURRENTLY က ဒီ mode ကို ရယူပါတယ်။
- **ACCESS EXCLUSIVE (AccessExclusiveLock)** — lock mode အားလုံး (ACCESS SHARE, ROW SHARE, ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE နဲ့ ACCESS EXCLUSIVE) ရဲ့ lock တွေနဲ့ conflict ဖြစ်ပါတယ်။ ဒီ mode က ကိုင်ထားသူ (holder) ကသာ — table တစ်ခုကို နည်းလမ်းတစ်ခုခုနဲ့ ဝင်ရောက် လုပ်ဆောင်နေတဲ့ တစ်ခုတည်းသော transaction ဖြစ်စေတယ်လို့ အာမခံပါတယ်။ DROP TABLE, TRUNCATE, REINDEX, CLUSTER, VACUUM FULL နဲ့ REFRESH MATERIALIZED VIEW (CONCURRENTLY မပါဘဲ) command တွေက ဒီ mode ကို ရယူပါတယ်။ ALTER INDEX နဲ့ ALTER TABLE ရဲ့ ပုံစံ အများအပြားကလည်း ဒီအဆင့်မှာ lock တစ်ခုကို ရယူပါတယ်။ Mode ကို အတိအကျ သတ်မှတ်မထားတဲ့ LOCK TABLE statement တွေအတွက် default lock mode လည်း ဒါပဲ ဖြစ်ပါတယ်။

> **အကြံပြုချက်:** `ACCESS EXCLUSIVE` lock တစ်ခုကသာ `SELECT` (`FOR UPDATE/SHARE` မပါတဲ့) statement တစ်ခုကို ပိတ်ဆို့နိုင်ပါတယ်။

Lock တစ်ခုကို ရယူလိုက်တာနဲ့ — ပုံမှန်အားဖြင့် — transaction ပြီးဆုံးတဲ့အထိ ကိုင်ထားပါတယ်။ ဒါပေမယ့် — savepoint တစ်ခု ထူထောင်ပြီးမှ lock ကို ရယူခဲ့တယ်ဆိုရင် — savepoint ဆီကို rollback လုပ်လိုက်တာနဲ့ — lock ကို ချက်ချင်း လွှတ်ပေးလိုက်ပါတယ်။ ဒါက `ROLLBACK` က savepoint နောက်ပိုင်း command တွေရဲ့ အကျိုးသက်ရောက်မှုတွေ အားလုံးကို ပျက်ပြယ်စေတယ်ဆိုတဲ့ နိယာမနဲ့ ကိုက်ညီပါတယ်။ PL/pgSQL exception block တစ်ခုအတွင်းမှာ ရယူခဲ့တဲ့ lock တွေအတွက်လည်း အလားတူပဲ — block ကနေ error နဲ့ ထွက်သွားရင် (error escape) — block အတွင်းမှာ ရယူထားတဲ့ lock တွေကို လွှတ်ပေးလိုက်ပါတယ်။

**ဇယား 13.2. Conflicting Lock Modes (conflict ဖြစ်သော lock mode များ)**

| Requested Lock Mode | `ACCESS SHARE` | `ROW SHARE` | `ROW EXCL.` | `SHARE UPDATE EXCL.` | `SHARE` | `SHARE ROW EXCL.` | `EXCL.` | `ACCESS EXCL.` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ACCESS SHARE` |  |  |  |  |  |  |  | X |
| `ROW SHARE` |  |  |  |  |  |  | X | X |
| `ROW EXCL.` |  |  |  |  | X | X | X | X |
| `SHARE UPDATE EXCL.` |  |  |  | X | X | X | X | X |
| `SHARE` |  |  | X | X |  | X | X | X |
| `SHARE ROW EXCL.` |  |  | X | X | X | X | X | X |
| `EXCL.` |  | X | X | X | X | X | X | X |
| `ACCESS EXCL.` | X | X | X | X | X | X | X | X |

### 13.3.2. Row-Level Locks (row အဆင့် lock များ)

Table-level lock တွေအပြင် — row-level lock တွေလည်း ရှိပါတယ် — အောက်မှာ PostgreSQL က ၎င်းတို့ကို အလိုအလျောက် အသုံးပြုတဲ့ အခြေအနေတွေနဲ့အတူ စာရင်းပြထားပါတယ်။ Row-level lock conflict တွေရဲ့ အပြည့်အစုံ ဇယားအတွက် ဇယား 13.3 ကို ကြည့်ပါ။ Transaction တစ်ခုက — subtransaction (ခွဲ transaction) အမျိုးမျိုးထဲမှာတောင် — တူညီတဲ့ row တစ်ခုပေါ်မှာ conflict ဖြစ်တဲ့ lock တွေကို ကိုင်ထားနိုင်တာ သတိပြုပါ; ဒါပေမယ့် — အဲဒါကလွဲလို့ — transaction နှစ်ခုက တူညီတဲ့ row တစ်ခုပေါ်မှာ conflict ဖြစ်တဲ့ lock တွေကို ဘယ်တော့မှ ကိုင်ထားလို့ မရပါဘူး။ Row-level lock တွေက data မေးမြန်းခြင်း (querying) အပေါ် သက်ရောက်မှု မရှိပါဘူး — သူတို့က တူညီတဲ့ row ကို ရေးသားသူတွေ (writers) နဲ့ lock လုပ်သူတွေ (lockers) ကိုပဲ ပိတ်ဆို့ပါတယ်။ Row-level lock တွေကို table-level lock တွေလိုပဲ — transaction အဆုံးမှာ ဒါမှမဟုတ် savepoint rollback အတွင်းမှာ — လွှတ်ပေးပါတယ်။

**Row-Level Lock Modes (row အဆင့် lock mode များ)**

- **FOR UPDATE** — FOR UPDATE က SELECT statement က ထုတ်ယူလိုက်တဲ့ row တွေကို — update လုပ်ဖို့ ရည်ရွယ်သလိုမျိုး — lock လုပ်ပေးပါတယ်။ ဒါက လက်ရှိ transaction မပြီးဆုံးမချင်း — အဲဒီ row တွေကို တခြား transaction တွေက lock လုပ်ခြင်း၊ ပြုပြင်မွမ်းမံခြင်း (modify) ဒါမှမဟုတ် ဖျက်ပစ်ခြင်း (delete) ကနေ ကာကွယ်ပေးပါတယ်။ ဆိုလိုတာက — ဒီ row တွေကို UPDATE, DELETE, SELECT FOR UPDATE, SELECT FOR NO KEY UPDATE, SELECT FOR SHARE ဒါမှမဟုတ် SELECT FOR KEY SHARE လုပ်ဖို့ ကြိုးစားတဲ့ တခြား transaction တွေက — လက်ရှိ transaction ပြီးဆုံးတဲ့အထိ ပိတ်ဆို့ခံရမှာ ဖြစ်ပါတယ်; အပြန်အလှန်အားဖြင့် — SELECT FOR UPDATE က — အဲဒီ row တစ်ခုတည်းပေါ်မှာ အဲဒီ command တွေထဲက တစ်ခုခုကို လုပ်ဆောင်ခဲ့တဲ့ တစ်ပြိုင်နက် transaction တစ်ခုကို စောင့်ဆိုင်းပြီး — နောက်ဆုံးမှာ update လုပ်ပြီးသား row ကို lock လုပ်ပြီး ပြန်ပေးမှာ ဖြစ်ပါတယ် (row ကို ဖျက်လိုက်ရင်တော့ row ဘာမှ မရတော့ပါဘူး)။ ဒါပေမယ့် — REPEATABLE READ ဒါမှမဟုတ် SERIALIZABLE transaction တစ်ခုအတွင်းမှာတော့ — lock လုပ်ရမယ့် row တစ်ခုက transaction စတင်ပြီးကတည်းက ပြောင်းလဲသွားခဲ့ရင် — error တစ်ခု ထွက်လာပါလိမ့်မယ်။ နောက်ထပ် ဆွေးနွေးချက်အတွက် အပိုင်း 13.4 ကို ကြည့်ပါ။
FOR UPDATE lock mode ကို — row တစ်ခုပေါ်က DELETE တိုင်းကရော — column တချို့ရဲ့ တန်ဖိုးတွေကို ပြုပြင်မွမ်းမံတဲ့ UPDATE တွေကပါ ရယူပါတယ်။ လက်ရှိမှာ — UPDATE ကိစ္စအတွက် ထည့်တွက်တဲ့ column အစုကတော့ — foreign key တစ်ခုမှာ သုံးလို့ရတဲ့ unique index ရှိတဲ့ column တွေပဲ ဖြစ်ပါတယ် (ဒါကြောင့် partial index တွေနဲ့ expressional index တွေကို ထည့်တွက်မှာ မဟုတ်ပါဘူး) — ဒါပေမယ့် နောက်ပိုင်းမှာ ဒါ ပြောင်းလဲသွားနိုင်ပါတယ်။
- **FOR NO KEY UPDATE** — FOR UPDATE နဲ့ ဆင်တူယိုးမှား အလုပ်လုပ်ပါတယ် — ရယူလိုက်တဲ့ lock က ပိုအားနည်းတာကလွဲလို့ပါ: ဒီ lock က — တူညီတဲ့ row တွေပေါ်မှာ lock ရယူဖို့ ကြိုးစားတဲ့ SELECT FOR KEY SHARE command တွေကို ပိတ်ဆို့မှာ မဟုတ်ပါဘူး။ FOR UPDATE lock ကို မရယူတဲ့ UPDATE တိုင်းကလည်း ဒီ lock mode ကို ရယူပါတယ်။
- **FOR SHARE** — FOR NO KEY UPDATE နဲ့ ဆင်တူယိုးမှား အလုပ်လုပ်ပါတယ် — ထုတ်ယူလိုက်တဲ့ row တစ်ခုချင်းစီပေါ်မှာ exclusive lock အစား shared lock တစ်ခုကို ရယူတာကလွဲလို့ပါ။ Shared lock တစ်ခုက တခြား transaction တွေကို — ဒီ row တွေပေါ်မှာ UPDATE, DELETE, SELECT FOR UPDATE ဒါမှမဟုတ် SELECT FOR NO KEY UPDATE လုပ်ဆောင်ခြင်းကနေ ပိတ်ဆို့ပေမယ့် — SELECT FOR SHARE ဒါမှမဟုတ် SELECT FOR KEY SHARE လုပ်ဆောင်ခြင်းကတော့ မတားဆီးပါဘူး။
- **FOR KEY SHARE** — FOR SHARE နဲ့ ဆင်တူယိုးမှား အလုပ်လုပ်ပါတယ် — lock က ပိုအားနည်းတာကလွဲလို့ပါ: SELECT FOR UPDATE က ပိတ်ဆို့ခံရပေမယ့် — SELECT FOR NO KEY UPDATE ကတော့ မပိတ်ဆို့ပါဘူး။ Key-shared lock တစ်ခုက တခြား transaction တွေကို — DELETE ဒါမှမဟုတ် key တန်ဖိုးတွေကို ပြောင်းလဲစေတဲ့ UPDATE တစ်ခုခု လုပ်ဆောင်ခြင်းကနေ ပိတ်ဆို့ပေမယ့် — တခြား UPDATE တွေကိုတော့ မပိတ်ဆို့ပါဘူး — ပြီးတော့ SELECT FOR NO KEY UPDATE, SELECT FOR SHARE ဒါမှမဟုတ် SELECT FOR KEY SHARE တွေကိုလည်း မတားဆီးပါဘူး။

PostgreSQL က ပြုပြင်မွမ်းမံထားတဲ့ row တွေအကြောင်း အချက်အလက်ကို memory ထဲမှာ မှတ်သားထားခြင်း မရှိတဲ့အတွက် — တစ်ချိန်တည်းမှာ lock လုပ်ထားနိုင်တဲ့ row အရေအတွက်ကို ကန့်သတ်ချက် မရှိပါဘူး။ ဒါပေမယ့် — row တစ်ခုကို lock လုပ်တာက disk write တစ်ခုကို ဖြစ်စေနိုင်ပါတယ် — ဥပမာ `SELECT FOR UPDATE` က ရွေးချယ်ထားတဲ့ row တွေကို lock ဖြစ်ကြောင်း အမှတ်အသား လုပ်ဖို့ ပြုပြင်မွမ်းမံလို့ — ရလဒ်အနေနဲ့ disk writes တွေ ဖြစ်ပေါ်ပါတယ်။

**ဇယား 13.3. Conflicting Row-Level Locks (conflict ဖြစ်သော row-level lock များ)**

| Requested Lock Mode | `FOR KEY SHARE` | `FOR SHARE` | `FOR NO KEY UPDATE` | `FOR UPDATE` |
| --- | --- | --- | --- | --- |
| `FOR KEY SHARE` |  |  |  | X |
| `FOR SHARE` |  |  | X | X |
| `FOR NO KEY UPDATE` |  | X | X | X |
| `FOR UPDATE` | X | X | X | X |

### 13.3.3. Page-Level Locks (page အဆင့် lock များ)

Table နဲ့ row lock တွေအပြင် — shared buffer pool ထဲက table pages တွေဆီ read/write access ကို ထိန်းချုပ်ဖို့ — page-level share/exclusive lock တွေကိုလည်း သုံးပါတယ်။ ဒီ lock တွေကို — row တစ်ခုကို fetch (ထုတ်ယူ) ဒါမှမဟုတ် update လုပ်ပြီးတာနဲ့ — ချက်ချင်း လွှတ်ပေးလိုက်ပါတယ်။ Application developer တွေက ပုံမှန်အားဖြင့် page-level lock တွေအတွက် စိုးရိမ်စရာ မလိုပေမယ့် — ပြည့်စုံမှု (completeness) အတွက် ဒီမှာ ဖော်ပြထားတာပါ။

### 13.3.4. Deadlocks (deadlock — အပြန်အလှန် ပိတ်ဆို့မှုများ)

Explicit locking သုံးခြင်းက *deadlock* (အပြန်အလှန် ပိတ်ဆို့မှု) ဖြစ်နိုင်ခြေကို မြင့်တက်စေနိုင်ပါတယ် — ဆိုလိုတာက — transaction နှစ်ခု (သို့မဟုတ် ထို့ထက်ပို) က — တစ်ဖက်က ကိုင်ထားတဲ့ lock တွေကို တစ်ဖက်က လိုချင်နေတဲ့ အခြေအနေမျိုးပါ။ ဥပမာ — transaction 1 က table A ပေါ်မှာ exclusive lock တစ်ခုကို ရယူပြီး table B ပေါ်မှာ exclusive lock ရယူဖို့ ကြိုးစားနေတုန်း — transaction 2 က table B ကို exclusive lock လုပ်ပြီးသား ဖြစ်ပြီး — အခု table A ပေါ်မှာ exclusive lock လိုချင်နေတယ်ဆိုရင် — ဘယ်တစ်ခုမှ ရှေ့ဆက် လုပ်ဆောင်လို့ မရတော့ပါဘူး။ PostgreSQL က deadlock အခြေအနေတွေကို အလိုအလျောက် ထောက်လှမ်းပြီး — ပါဝင်ပတ်သက်နေတဲ့ transaction တွေထဲက တစ်ခုကို abort (ဖျက်သိမ်း) လုပ်ခြင်းအားဖြင့် — ကျန်တဲ့ transaction (များ) ပြီးမြောက်အောင် ခွင့်ပြုပါတယ်။ (ဘယ် transaction ကို abort လုပ်မလဲဆိုတာ ကြိုတင် ခန့်မှန်းဖို့ ခက်ပြီး — အဲဒါကို အားကိုးမထားသင့်ပါဘူး။)

Deadlock တွေက row-level lock တွေရဲ့ ရလဒ်အနေနဲ့လည်း ဖြစ်ပေါ်နိုင်တာ သတိပြုပါ (ဒါကြောင့် — explicit locking မသုံးရင်တောင် ဖြစ်ပေါ်နိုင်ပါတယ်)။ တစ်ပြိုင်နက် လုပ်ဆောင်နေတဲ့ transaction နှစ်ခုက table တစ်ခုကို ပြုပြင်မွမ်းမံနေတဲ့ အခြေအနေကို စဉ်းစားကြည့်ပါ။ ပထမ transaction က ဒီလို လုပ်ဆောင်ပါတယ်:

```sql
UPDATE accounts SET balance = balance + 100.00 WHERE acctnum = 11111;
```

ဒါက သတ်မှတ်ထားတဲ့ account number ရှိတဲ့ row ပေါ်မှာ row-level lock တစ်ခုကို ရယူပါတယ်။ ပြီးတော့ — ဒုတိယ transaction က ဒီလို လုပ်ဆောင်ပါတယ်:

```sql
UPDATE accounts SET balance = balance + 100.00 WHERE acctnum = 22222;
UPDATE accounts SET balance = balance - 100.00 WHERE acctnum = 11111;
```

ပထမ `UPDATE` statement က သတ်မှတ်ထားတဲ့ row ပေါ်မှာ row-level lock ကို အောင်မြင်စွာ ရယူလို့ — အဲဒီ row ကို update လုပ်ရာမှာ အောင်မြင်ပါတယ်။ ဒါပေမယ့် — ဒုတိယ `UPDATE` statement က — သူ update လုပ်ဖို့ ကြိုးစားနေတဲ့ row ကို lock လုပ်ပြီးသား ဖြစ်နေတာ တွေ့လို့ — lock ရယူထားတဲ့ transaction ပြီးဆုံးဖို့ စောင့်ဆိုင်းပါတယ်။ ဒီလိုနဲ့ — transaction 2 က — ဆက်လက် မလုပ်ဆောင်ခင် — transaction 1 ပြီးဆုံးဖို့ စောင့်ဆိုင်းနေပါပြီ။ အခုအချိန်မှာ — transaction တစ်ခုက ဒီလို လုပ်ဆောင်ပါတယ်:

```sql
UPDATE accounts SET balance = balance - 100.00 WHERE acctnum = 22222;
```

Transaction 1 က သတ်မှတ်ထားတဲ့ row ပေါ်မှာ row-level lock ရယူဖို့ ကြိုးစားပေမယ့် — မရယူနိုင်ပါဘူး: transaction 2 က အဲဒီလို lock တစ်ခုကို ကိုင်ထားပြီးသား ဖြစ်နေလို့ပါ။ ဒါကြောင့် သူက transaction 2 ပြီးဆုံးဖို့ စောင့်ဆိုင်းပါတယ်။ ဒီလိုနဲ့ — transaction 1 က transaction 2 ပေါ်မှာ ပိတ်ဆို့ခံနေပြီး — transaction 2 က transaction 1 ပေါ်မှာ ပိတ်ဆို့နေတဲ့ — deadlock အခြေအနေတစ်ခု ဖြစ်ပေါ်လာပါတယ်။ PostgreSQL က ဒီအခြေအနေကို ထောက်လှမ်းပြီး — transaction တွေထဲက တစ်ခုကို abort လုပ်ပါလိမ့်မယ်။

Deadlock တွေရဲ့ အကောင်းဆုံး ကာကွယ်ရေး နည်းလမ်းကတော့ — ယေဘုယျအားဖြင့် — database တစ်ခုကို သုံးတဲ့ application တွေ အားလုံးက object အများအပြားပေါ်မှာ lock တွေကို တစ်သမတ်တည်း အစီအစဉ် (consistent order) နဲ့ ရယူတာ သေချာစေခြင်းအားဖြင့် — deadlock တွေ မဖြစ်အောင် ရှောင်ခြင်းပဲ ဖြစ်ပါတယ်။ အပေါ်က ဥပမာမှာ — transaction နှစ်ခုလုံးက row တွေကို တူညီတဲ့ အစီအစဉ်နဲ့ update လုပ်ခဲ့မယ်ဆိုရင် — deadlock ဘာမှ မဖြစ်ခဲ့ပါဘူး။ ဒါ့အပြင် — transaction တစ်ခုထဲမှာ object တစ်ခုပေါ်က ပထမဆုံး ရယူတဲ့ lock က — အဲဒီ object အတွက် နောက်ပိုင်း လိုအပ်မယ့် အကြပ်ဆုံး (most restrictive) mode ဖြစ်အောင်လည်း သေချာစေသင့်ပါတယ်။ ဒါကို ကြိုတင် စစ်ဆေးအတည်ပြုဖို့ မဖြစ်နိုင်ဘူးဆိုရင် — deadlock ကြောင့် abort ဖြစ်တဲ့ transaction တွေကို ပြန်ကြိုးစား (retry) လုပ်ခြင်းအားဖြင့် — deadlock တွေကို အချိန်နှင့်တပြေးညီ (on-the-fly) ကိုင်တွယ်နိုင်ပါတယ်။

Deadlock အခြေအနေ တစ်ခုကို ထောက်လှမ်းမိခြင်း မရှိသရွေ့ — table-level ဖြစ်စေ row-level ဖြစ်စေ lock တစ်ခု ရှာနေတဲ့ transaction တစ်ခုက — conflict ဖြစ်တဲ့ lock တွေ လွှတ်ပေးခံရတဲ့အထိ — အကန့်အသတ် မရှိ စောင့်ဆိုင်းနေမှာ ဖြစ်ပါတယ်။ ဒါက — application တွေက transaction တွေကို အချိန် အကြာကြီး ဖွင့်ထားတာက (ဥပမာ — user ရဲ့ input ကို စောင့်ဆိုင်းနေချိန်မျိုး) — မကောင်းတဲ့ အကြံတစ်ခု ဖြစ်စေပါတယ်။

### 13.3.5. Advisory Locks (advisory lock များ)

PostgreSQL က application တွေ ကိုယ်ပိုင် အဓိပ္ပာယ် သတ်မှတ်နိုင်တဲ့ lock တွေ ဖန်တီးဖို့ နည်းလမ်းတစ်ခုကို ပံ့ပိုးပေးပါတယ်။ ဒါတွေကို *advisory lock* လို့ ခေါ်ပါတယ် — system က ၎င်းတို့ရဲ့ အသုံးပြုမှုကို အတင်းအကျပ် လိုက်နာစေခြင်း မရှိဘဲ — application က မှန်မှန်ကန်ကန် အသုံးပြုဖို့သာ တာဝန် ရှိလို့ပါ။ Advisory lock တွေက — MVCC model နဲ့ ကိုက်ညီမှု မကောင်းတဲ့ locking strategy တွေအတွက် အသုံးဝင်နိုင်ပါတယ်။ ဥပမာ — advisory lock တွေရဲ့ သာမန် အသုံးပြုမှုတစ်ခုက — “flat file” data management system တွေမှာ ပုံမှန် တွေ့ရတတ်တဲ့ — pessimistic locking (အဆိုးမြင်စွာ lock လုပ်ခြင်း) strategy တွေကို အတုယူ (emulate) လုပ်ဖို့ ဖြစ်ပါတယ်။ Table တစ်ခုထဲမှာ သိမ်းထားတဲ့ flag တစ်ခုကိုလည်း အလားတူ ရည်ရွယ်ချက်အတွက် သုံးလို့ ရနိုင်ပေမယ့် — advisory lock တွေက ပိုမြန်ပြီး — table bloat (table ဖောင်းပွမှု) ကို ရှောင်ရှားပေးကာ — session ပြီးဆုံးချိန်မှာ server က အလိုအလျောက် ရှင်းလင်းပေးပါတယ်။

PostgreSQL မှာ advisory lock တစ်ခုကို ရယူဖို့ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်: session အဆင့်မှာ ရယူတာ ဒါမှမဟုတ် transaction အဆင့်မှာ ရယူတာပါ။ Session အဆင့်မှာ ရယူပြီးတာနဲ့ — advisory lock တစ်ခုကို — အတိအကျ လွှတ်ပေးလိုက်တဲ့အထိ ဒါမှမဟုတ် session ပြီးဆုံးတဲ့အထိ — ကိုင်ထားပါတယ်။ ပုံမှန် lock request တွေနဲ့ မတူဘဲ — session-level advisory lock request တွေက transaction semantics ကို လေးစား လိုက်နာခြင်း မရှိပါဘူး: နောက်ပိုင်းမှာ rollback ဖြစ်တဲ့ transaction တစ်ခုအတွင်းမှာ ရယူထားတဲ့ lock တစ်ခုက — rollback အပြီးမှာလည်း ဆက်ပြီး ကိုင်ထားဆဲ ဖြစ်မှာ ဖြစ်ပြီး — အလားတူပဲ — unlock (lock လွှတ်ခြင်း) တစ်ခုက — ခေါ်ယူလိုက်တဲ့ transaction က နောက်မှာ မအောင်မြင်သွားရင်တောင် — အကျိုးသက်ရောက်မှု ရှိနေမှာ ဖြစ်ပါတယ်။ Lock တစ်ခုကို — ပိုင်ဆိုင်တဲ့ process က အကြိမ် အများအပြား ရယူနိုင်ပါတယ်; lock request တစ်ခုချင်းစီ ပြီးမြောက်တိုင်းအတွက် — lock တကယ် မလွှတ်မချင်း — သက်ဆိုင်တဲ့ unlock request တစ်ခု ရှိရပါမယ်။ တစ်ဖက်မှာတော့ — transaction-level lock request တွေက သာမန် lock request တွေနဲ့ ပိုတူပါတယ်: သူတို့ကို transaction ပြီးဆုံးချိန်မှာ အလိုအလျောက် လွှတ်ပေးပြီး — သီးခြား unlock operation ဆိုတာ မရှိပါဘူး။ ဒီအပြုအမူက — advisory lock တစ်ခုကို ကာလတို (short-term) အသုံးပြုမှုအတွက် — session-level အပြုအမူထက် မကြာခဏဆိုသလို ပိုအဆင်ပြေပါတယ်။ Advisory lock identifier တစ်ခုတည်းအတွက် session-level နဲ့ transaction-level lock request တွေက — မျှော်လင့်ထားတဲ့ နည်းအတိုင်းပဲ — တစ်ခုကို တစ်ခု ပိတ်ဆို့ပါတယ်။ Session တစ်ခုက ပေးထားတဲ့ advisory lock တစ်ခုကို ကိုင်ထားပြီးသား ဖြစ်နေရင် — တခြား session တွေက lock ကို စောင့်ဆိုင်းနေရင်တောင် — အဲဒီ session ရဲ့ နောက်ထပ် request တွေက အမြဲတမ်း အောင်မြင်ပါတယ်; ဒီထုတ်ပြန်ချက်က — ရှိပြီးသား lock ကိုင်ထားမှုရော request အသစ်ရော — session အဆင့်မှာ ဖြစ်စေ transaction အဆင့်မှာ ဖြစ်စေ — နှစ်မျိုးလုံးအတွက် မှန်ပါတယ်။

PostgreSQL ထဲက lock တွေ အားလုံးလိုပဲ — session တစ်ခုခုက လက်ရှိ ကိုင်ထားတဲ့ advisory lock တွေရဲ့ အပြည့်အစုံ စာရင်းကို — [`pg_locks`](https://www.postgresql.org/docs/current/view-pg-locks.html) system view ထဲမှာ တွေ့နိုင်ပါတယ်။

Advisory lock တွေရော ပုံမှန် lock တွေရော — [max_locks_per_transaction](https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-MAX-LOCKS-PER-TRANSACTION) နဲ့ [max_connections](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-MAX-CONNECTIONS) ဆိုတဲ့ configuration variable တွေက အရွယ်အစား သတ်မှတ်ပေးထားတဲ့ — shared memory pool တစ်ခုထဲမှာ သိမ်းဆည်းပါတယ်။ ဒီ memory ကို ကုန်ဆုံးမသွားအောင် ဂရုစိုက်ရပါမယ် — ကုန်သွားရင် server က ဘယ် lock ကိုမှ ပေးအပ်နိုင်တော့မှာ မဟုတ်ပါဘူး။ ဒါက server က ပေးအပ်နိုင်တဲ့ advisory lock အရေအတွက်အပေါ် အပေါ်ကန့်သတ်ချက် (upper limit) တစ်ခု သက်ရောက်စေပြီး — server ကို configure လုပ်ပုံပေါ် မူတည်ပြီး — ပုံမှန်အားဖြင့် သောင်းဂဏန်းကနေ သိန်းဂဏန်း အနည်းငယ်အထိ ဖြစ်ပါတယ်။

အချို့ အခြေအနေတွေမှာ — အထူးသဖြင့် explicit ordering နဲ့ `LIMIT` clause တွေ ပါတဲ့ query တွေမှာ — advisory locking နည်းလမ်းတွေကို သုံးတဲ့အခါ — SQL expressions တွေကို အကဲဖြတ်တဲ့ အစီအစဉ်ကြောင့် — ရယူလိုက်တဲ့ lock တွေကို ထိန်းချုပ်ဖို့ ဂရုစိုက်ရပါတယ်။ ဥပမာ:

```sql
SELECT pg_advisory_lock(id) FROM foo WHERE id = 12345; -- ok
SELECT pg_advisory_lock(id) FROM foo WHERE id > 12345 LIMIT 100; -- danger!
SELECT pg_advisory_lock(q.id) FROM
(
  SELECT id FROM foo WHERE id > 12345 LIMIT 100
) q; -- ok
```

အပေါ်က query တွေထဲမှာ — ဒုတိယ ပုံစံက အန္တရာယ် ရှိပါတယ် — `LIMIT` က locking function ကို execute (လုပ်ဆောင်) လုပ်တာထက် အရင် သက်ရောက်မယ်လို့ အာမခံချက် မရှိလို့ပါ။ ဒါက — application က မျှော်လင့်မထားတဲ့ lock တချို့ ရယူခံရပြီး — ရလဒ်အနေနဲ့ — (session ပြီးဆုံးတဲ့အထိ) — လွှတ်ပေးဖို့ ပျက်ကွက်စေနိုင်ပါတယ်။ Application ရဲ့ ရှုထောင့်ကနေ ကြည့်ရင် — အဲဒီလို lock တွေက dangling (အချည်းနှီး ကျန်နေ) ဖြစ်နေပေမယ့် — `pg_locks` ထဲမှာတော့ ဆက်ပြီး မြင်ရဆဲ ဖြစ်ပါတယ်။

Advisory lock တွေကို ကိုင်တွယ်ဖို့ ပေးထားတဲ့ function တွေကို [အပိုင်း 9.28.10](/docs/postgresql/functions-admin) မှာ ဖော်ပြထားပါတယ်။
