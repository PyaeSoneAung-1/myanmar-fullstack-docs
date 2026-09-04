---
title: "LOCK (table တစ်ခုကို lock လုပ်ခြင်း)"
description: "Table တစ်ခုကို table-level lock ပြုလုပ်ခြင်း — LOCK TABLE ၏ syntax နှင့် parameters (lock modes, NOWAIT)၊ lock mode ရွေးချယ်ပုံ၊ deadlock ရှောင်ရှားနည်း၊ လိုအပ်သော privilege များနှင့် ဥပမာများ"
order: 163
source: "https://www.postgresql.org/docs/current/sql-lock.html"
status: translated
updated: 2026-09-04
---

## LOCK (table တစ်ခုကို lock လုပ်ခြင်း)

LOCK — table တစ်ခုကို lock လုပ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
LOCK [ TABLE ] [ ONLY ] name [ * ] [, ...] [ IN lockmode MODE ] [ NOWAIT ]

where lockmode is one of:

    ACCESS SHARE | ROW SHARE | ROW EXCLUSIVE | SHARE UPDATE EXCLUSIVE
    | SHARE | SHARE ROW EXCLUSIVE | EXCLUSIVE | ACCESS EXCLUSIVE
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`LOCK TABLE` က table-level lock တစ်ခုကို ရယူပါတယ် — လိုအပ်ရင် — conflict ဖြစ်နေတဲ့ lock တွေ လွှတ်ပေးခံရတာကို စောင့်ဆိုင်းပါတယ်။ `NOWAIT` ကို သတ်မှတ်ထားရင် — `LOCK TABLE` က လိုချင်တဲ့ lock ကို ရယူဖို့ မစောင့်ပါဘူး: ချက်ချင်း ရယူလို့ မရနိုင်ရင် — command ကို ပယ်ဖျက်လိုက်ပြီး error တစ်ခု ထုတ်လွှတ်ပါတယ်။ တစ်ခါ ရယူပြီးတာနဲ့ — lock ကို လက်ရှိ transaction ရဲ့ ကျန်ရှိတဲ့ ကာလတစ်လျှောက်လုံး ကိုင်ထားပါတယ်။ (`UNLOCK TABLE` command ဆိုတာ မရှိပါဘူး; locks တွေကို transaction အဆုံးမှာ အမြဲတမ်း လွှတ်ပေးပါတယ်။)

View တစ်ခုကို lock လုပ်တဲ့အခါ — view definition query ထဲမှာ ပါဝင်တဲ့ relations (ဆက်စပ် table များ) အားလုံးကိုလည်း — တူညီတဲ့ lock mode နဲ့ပဲ — recursively (ထပ်ခါထပ်ခါ) lock လုပ်ပါတယ်။

Tables တွေကို ရည်ညွှန်းတဲ့ command တွေအတွက် locks တွေကို အလိုအလျောက် ရယူတဲ့အခါ — PostgreSQL က ဖြစ်နိုင်သမျှ ကန့်သတ်မှု အနည်းဆုံး (least restrictive) lock mode ကိုပဲ အမြဲတမ်း သုံးပါတယ်။ ပိုပြီး ကန့်သတ်မှု ရှိတဲ့ locking လိုအပ်နိုင်တဲ့ အခြေအနေတွေအတွက် `LOCK TABLE` က ဖြည့်ဆည်းပေးပါတယ်။ ဥပမာ — application တစ်ခုက `READ COMMITTED` isolation level မှာ transaction တစ်ခုကို run ပြီး — transaction ကြာချိန် တစ်လျှောက်လုံး table တစ်ခုထဲက data က တည်ငြိမ် (stable) နေဖို့ လိုအပ်တယ်ဆိုပါစို့။ ဒါကို အောင်မြင်ဖို့ — query မလုပ်ခင် table ပေါ်မှာ `SHARE` lock mode ကို ရယူထားနိုင်ပါတယ်။ ဒါက တစ်ပြိုင်နက် ဖြစ်ပေါ်လာတဲ့ data ပြောင်းလဲမှုတွေကို တားဆီးပေးပြီး — table ရဲ့ နောက်ပိုင်း reads တွေက commit လုပ်ပြီးသား data ရဲ့ တည်ငြိမ်တဲ့ မြင်ကွင်း (stable view) တစ်ခုကို မြင်ရတယ်ဆိုတာ အာမခံပေးပါတယ် — အကြောင်းကတော့ `SHARE` lock mode က writers တွေ ရယူတဲ့ `ROW EXCLUSIVE` lock နဲ့ conflict ဖြစ်ပြီး — သင့်ရဲ့ `LOCK TABLE name IN SHARE MODE` statement က — `ROW EXCLUSIVE` mode locks တွေကို ကိုင်ထားတဲ့ တစ်ပြိုင်နက် holders တွေ commit ဒါမှမဟုတ် roll back လုပ်တဲ့အထိ — စောင့်ဆိုင်းမှာ ဖြစ်လို့ပါ။ ဒါကြောင့် — lock ကို တစ်ခါ ရယူပြီးတာနဲ့ — မပြီးပြတ်သေးတဲ့ (uncommitted) writes တွေ ကျန်ရှိမနေတော့ပါဘူး; ဒါ့အပြင် — သင်က lock ကို လွှတ်ပေးတဲ့အထိ — အသစ် ဘာမှ စတင်လို့လည်း မရပါဘူး။

`REPEATABLE READ` ဒါမှမဟုတ် `SERIALIZABLE` isolation level မှာ transaction တစ်ခု run တဲ့အခါ အလားတူ အကျိုးသက်ရောက်မှု ရဖို့ — `SELECT` ဒါမှမဟုတ် data modification statement တစ်ခုခုကို execute မလုပ်ခင် — `LOCK TABLE` statement ကို ဦးစွာ execute လုပ်ရပါတယ်။ `REPEATABLE READ` ဒါမှမဟုတ် `SERIALIZABLE` transaction တစ်ခုရဲ့ data ပေါ်က မြင်ကွင်းက — သူ့ရဲ့ ပထမဆုံး `SELECT` ဒါမှမဟုတ် data modification statement စတင်တဲ့အခါ — အေးခဲသွားပါတယ် (frozen)။ Transaction ထဲမှာ နောက်ပိုင်း `LOCK TABLE` တစ်ခုက — တစ်ပြိုင်နက် writes တွေကိုတော့ ဆက်လက် တားဆီးဦးမှာပါ — ဒါပေမယ့် — transaction က ဖတ်တဲ့အရာက နောက်ဆုံး commit လုပ်ထားတဲ့ တန်ဖိုးတွေနဲ့ ကိုက်ညီတယ်ဆိုတာကိုတော့ အာမခံပေးမှာ မဟုတ်ပါဘူး။

ဒီလိုမျိုး transaction တစ်ခုက table ထဲက data ကို ပြောင်းလဲတော့မယ်ဆိုရင် — `SHARE` mode အစား `SHARE ROW EXCLUSIVE` lock mode ကို သုံးသင့်ပါတယ်။ ဒါက ဒီလိုမျိုး transaction တစ်ခုတည်းသာ တစ်ချိန်တည်းမှာ run မယ်ဆိုတာ အာမခံပေးပါတယ်။ ဒါမရှိရင် — deadlock (အပြန်အလှန် ပိတ်ဆို့မှု) ဖြစ်နိုင်ပါတယ်: transaction နှစ်ခုက `SHARE` mode ကို နှစ်ခုလုံး ရယူလိုက်ပြီး — သူတို့ရဲ့ updates တွေကို တကယ် လုပ်ဆောင်ဖို့ `ROW EXCLUSIVE` mode ကို နောက်ထပ် ရယူလို့ မရတော့တာမျိုးပါ။ (Transaction တစ်ခုရဲ့ ကိုယ်ပိုင် locks တွေက ဘယ်တော့မှ conflict မဖြစ်တာကို သတိပြုပါ — ဒါကြောင့် transaction တစ်ခုက `SHARE` mode ကို ကိုင်ထားချိန်မှာ `ROW EXCLUSIVE` mode ကို ရယူနိုင်ပေမယ့် — တခြားတစ်ယောက်ယောက်က `SHARE` mode ကိုင်ထားရင်တော့ မရယူနိုင်ပါဘူး။) Deadlocks တွေကို ရှောင်ရှားဖို့ — transaction တွေ အားလုံးက တူညီတဲ့ objects တွေပေါ်မှာ locks တွေကို တူညီတဲ့ အစဉ်လိုက်ပဲ ရယူတာကို သေချာစေပြီး — object တစ်ခုတည်းအတွက် lock mode အများကြီး ပါဝင်နေရင် — transaction တွေက အမြဲတမ်း ကန့်သတ်မှု အများဆုံး (most restrictive) mode ကို အရင်ဆုံး ရယူသင့်ပါတယ်။

Lock modes တွေနဲ့ locking strategies (lock လုပ်မှု နည်းဗျူဟာများ) အကြောင်း နောက်ထပ် အချက်အလက်တွေကို [အပိုင်း 13.3](/docs/postgresql/explicit-locking) မှာ တွေ့နိုင်ပါတယ်။

## Parameters (parameter များ)

- **name** — Lock လုပ်ရမယ့် ရှိပြီးသား table တစ်ခုရဲ့ နာမည် (schema-qualified လည်း ဖြစ်နိုင်သည်)။ Table နာမည် မတိုင်ခင် `ONLY` ကို သတ်မှတ်ထားရင် — အဲဒီ table တစ်ခုကိုပဲ lock လုပ်ပါတယ်။ `ONLY` ကို မသတ်မှတ်ရင် — table နဲ့ သူ့ရဲ့ descendant tables (မျိုးဆက်စဉ် table များ၊ ရှိရင်) အားလုံးကို lock လုပ်ပါတယ်။ Optional အနေနဲ့ — descendant tables တွေ ပါဝင်တယ်ဆိုတာကို အတိအကျ ညွှန်ပြဖို့ — table နာမည်ရဲ့ နောက်မှာ * ကို သတ်မှတ်နိုင်ပါတယ်။
`LOCK TABLE a, b;` command က `LOCK TABLE a;` နဲ့ `LOCK TABLE b;` လုပ်တာနဲ့ ညီမျှပါတယ်။ Tables တွေကို `LOCK TABLE` command ထဲမှာ သတ်မှတ်ထားတဲ့ အစဉ်အတိုင်း — တစ်ခုပြီးတစ်ခု — lock လုပ်ပါတယ်။
- **lockmode** — Lock mode က ဒီ lock က ဘယ် locks တွေနဲ့ conflict ဖြစ်လဲဆိုတာကို သတ်မှတ်ပေးပါတယ်။ Lock modes တွေကို အပိုင်း 13.3 မှာ ဖော်ပြထားပါတယ်။
Lock mode ဘာမှ သတ်မှတ်မထားရင် — ကန့်သတ်မှု အများဆုံး mode ဖြစ်တဲ့ `ACCESS EXCLUSIVE` ကို သုံးပါတယ်။
- **NOWAIT** — `LOCK TABLE` က conflict ဖြစ်နေတဲ့ lock တွေ လွှတ်ပေးခံရတာကို မစောင့်သင့်ဘူးဆိုတာ သတ်မှတ်ပေးပါတယ်: သတ်မှတ်ထားတဲ့ lock(s) တွေကို — မစောင့်ဘဲ ချက်ချင်း ရယူလို့ မရနိုင်ရင် — transaction ကို ပယ်ဖျက်လိုက်ပါတယ်။

## Notes (မှတ်စုများ)

Table တစ်ခုကို lock လုပ်ဖို့ — user က သတ်မှတ်ထားတဲ့ `lockmode` အတွက် သင့်တော်တဲ့ privilege ရှိရပါမယ်။ User က table ပေါ်မှာ `MAINTAIN`, `UPDATE`, `DELETE` ဒါမှမဟုတ် `TRUNCATE` privileges တွေ ရှိရင် — `lockmode` ဘယ်ဟာမဆို ခွင့်ပြုပါတယ်။ User က table ပေါ်မှာ `INSERT` privilege ရှိရင် — `ROW EXCLUSIVE MODE` (ဒါမှမဟုတ် [အပိုင်း 13.3](/docs/postgresql/explicit-locking) မှာ ဖော်ပြထားသလို — conflict နည်းတဲ့ mode တစ်ခုခု) ကို ခွင့်ပြုပါတယ်။ User တစ်ယောက်က table ပေါ်မှာ `SELECT` privilege ရှိရင် — `ACCESS SHARE MODE` ကို ခွင့်ပြုပါတယ်။

View ပေါ်မှာ lock လုပ်တဲ့ user က view ပေါ်မှာ သက်ဆိုင်ရာ privilege ရှိရပါမယ်။ ဒါ့အပြင် — default အနေနဲ့ — view ရဲ့ owner က အောက်ခံ (underlying) base relations တွေပေါ်မှာ သက်ဆိုင်ရာ privileges တွေ ရှိရပါမယ် — ဒါပေမယ့် lock လုပ်နေတဲ့ user ကတော့ အောက်ခံ base relations တွေပေါ်မှာ ဘယ် permissions မှ မလိုအပ်ပါဘူး။ ဒါပေမယ့် — view မှာ `security_invoker` ကို `true` အဖြစ် သတ်မှတ်ထားရင် ([`CREATE VIEW`](/docs/postgresql/sql-createview) ကို ကြည့်ပါ) — view owner အစား — lock လုပ်နေတဲ့ user က အောက်ခံ base relations တွေပေါ်မှာ သက်ဆိုင်ရာ privileges တွေ ရှိရပါမယ်။

`LOCK TABLE` က transaction block အပြင်မှာဆိုရင် အသုံးမဝင်ပါဘူး: lock က statement ပြီးဆုံးတဲ့အထိပဲ ကိုင်ထားခံရမှာ ဖြစ်လို့ပါ။ ဒါကြောင့် — `LOCK` ကို transaction block အပြင်မှာ သုံးရင် — PostgreSQL က error တစ်ခု အစီရင်ခံပါတယ်။ Transaction block တစ်ခုကို သတ်မှတ်ဖို့ [`BEGIN`](/docs/postgresql/sql-begin) နဲ့ [`COMMIT`](/docs/postgresql/sql-commit) (ဒါမှမဟုတ် [`ROLLBACK`](/docs/postgresql/sql-rollback)) ကို သုံးပါ။

`LOCK TABLE` က table-level locks တွေကိုပဲ သက်ဆိုင်တာမို့ — `ROW` ပါဝင်တဲ့ mode နာမည်တွေက အားလုံး နာမည်လွဲ (misnomer) တွေပါ။ ဒီ mode နာမည်တွေကို ယေဘုယျအားဖြင့် — user က lock လုပ်ထားတဲ့ table အတွင်းမှာ row-level locks တွေကို ရယူဖို့ ရည်ရွယ်ချက်ကို ညွှန်ပြတာလို့ ဖတ်သင့်ပါတယ်။ ဒါ့အပြင် — `ROW EXCLUSIVE` mode က share လုပ်လို့ရတဲ့ (shareable) table lock တစ်ခုပါ။ `LOCK TABLE` နဲ့ ပတ်သက်သလောက် — lock mode တွေ အားလုံးက တူညီတဲ့ semantics (အဓိပ္ပာယ်) တွေ ရှိတယ်ဆိုတာ သတိရပါ — ဘယ် mode က ဘယ် mode နဲ့ conflict ဖြစ်လဲဆိုတဲ့ စည်းမျဉ်းတွေမှာပဲ ကွာခြားပါတယ်။ တကယ့် row-level lock တစ်ခုကို ဘယ်လို ရယူရမလဲဆိုတဲ့ အချက်အလက်အတွက် — [အပိုင်း 13.3.2](/docs/postgresql/explicit-locking) နဲ့ — [SELECT](https://www.postgresql.org/docs/current/sql-select.html) documentation ထဲက [The Locking Clause](https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE) ကို ကြည့်ပါ။

## Examples (ဥပမာများ)

Foreign key table တစ်ခုထဲကို inserts တွေ လုပ်ဆောင်တော့မယ့်အခါ — primary key table ပေါ်မှာ `SHARE` lock တစ်ခု ရယူခြင်း:

```sql
BEGIN WORK;
LOCK TABLE films IN SHARE MODE;
SELECT id FROM films
    WHERE name = 'Star Wars: Episode I - The Phantom Menace';
-- Do ROLLBACK if record was not returned
INSERT INTO films_user_comments VALUES
    (_id_, 'GREAT! I was waiting for it for so long!');
COMMIT WORK;
```

Delete operation တစ်ခု လုပ်ဆောင်တော့မယ့်အခါ — primary key table ပေါ်မှာ `SHARE ROW EXCLUSIVE` lock တစ်ခု ယူခြင်း:

```sql
BEGIN WORK;
LOCK TABLE films IN SHARE ROW EXCLUSIVE MODE;
DELETE FROM films_user_comments WHERE id IN
    (SELECT id FROM films WHERE rating < 5);
DELETE FROM films WHERE rating < 5;
COMMIT WORK;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard မှာ `LOCK TABLE` ဆိုတာ မရှိပါဘူး — အဲဒီအစား transactions တွေပေါ်မှာ concurrency levels တွေကို သတ်မှတ်ဖို့ `SET TRANSACTION` ကို သုံးပါတယ်။ PostgreSQL က အဲဒါကိုလည်း ထောက်ပံ့ပါတယ်; အသေးစိတ်အတွက် [SET TRANSACTION](/docs/postgresql/sql-set-transaction) ကို ကြည့်ပါ။

`ACCESS SHARE`, `ACCESS EXCLUSIVE` နဲ့ `SHARE UPDATE EXCLUSIVE` lock modes တွေကလွဲလို့ — PostgreSQL ရဲ့ lock modes တွေနဲ့ `LOCK TABLE` syntax က Oracle မှာ ရှိတဲ့ဟာတွေနဲ့ လိုက်ဖက်ညီပါတယ်။
