---
title: "DECLARE (cursor တစ်ခု သတ်မှတ်ခြင်း)"
description: "Cursor များကို သတ်မှတ်ခြင်း (declare လုပ်ခြင်း) — ကြီးမားသော query တစ်ခုမှ rows အနည်းငယ်စီ အချိန်အလိုက် ပြန်လည်ရယူနိုင်ရန် cursor ဖန်တီးပေးသော DECLARE ၏ syntax နှင့် parameters များ (BINARY, ASENSITIVE/INSENSITIVE, SCROLL/NO SCROLL, WITH HOLD/WITHOUT HOLD)၊ binary cursor များအကြောင်း မှတ်စုများ၊ FOR UPDATE နှင့် WHERE CURRENT OF အသုံးပြုမှုဆိုင်ရာ သတိထားရန် အချက်များနှင့် ဥပမာများ"
order: 188
source: "https://www.postgresql.org/docs/current/sql-declare.html"
status: translated
updated: 2026-09-04
---

## DECLARE (cursor တစ်ခု သတ်မှတ်ခြင်း)

DECLARE — cursor တစ်ခုကို သတ်မှတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DECLARE name [ BINARY ] [ ASENSITIVE | INSENSITIVE ] [ [ NO ] SCROLL ]
    CURSOR [ { WITH | WITHOUT } HOLD ] FOR query
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DECLARE` က user တွေကို cursors (ကြီးမားတဲ့ query တစ်ခုထဲကနေ တစ်ချိန်မှာ rows အနည်းငယ်စီ ပြန်ယူဖို့ သုံးနိုင်တဲ့ အရာများ) ဖန်တီးနိုင်အောင် ခွင့်ပြုပေးပါတယ်။ Cursor ကို ဖန်တီးပြီးတာနဲ့ — အဲဒီကနေ rows တွေကို [`FETCH`](/docs/postgresql/sql-fetch) ကို သုံးပြီး ပြန်ယူပါတယ်။

> **သတိပြုရန်:** ဒီ page က SQL command အဆင့်မှာ cursors အသုံးပြုမှုကို ဖော်ပြပါတယ်။ PL/pgSQL function တစ်ခုရဲ့ အတွင်းမှာ cursors တွေကို သုံးချင်တယ်ဆိုရင် — စည်းမျဉ်းတွေ ကွဲပြားပါတယ် — [အပိုင်း 41.7](https://www.postgresql.org/docs/current/plpgsql-cursors.html) ကို ကြည့်ပါ။

## Parameters (parameter များ)

- **name** — ဖန်တီးရမယ့် cursor ရဲ့ နာမည်။ ဒါက session ထဲမှာ ရှိတဲ့ တခြား active cursor နာမည်တွေ အားလုံးနဲ့ မတူညီရပါဘူး။
- **BINARY** — Cursor က data တွေကို text format အစား binary format နဲ့ ပြန်ပို့စေပါတယ်။
- **ASENSITIVE / INSENSITIVE** — Cursor sensitivity က — cursor ကို declare လုပ်ပြီးနောက် — တူညီတဲ့ transaction ထဲမှာ — cursor ရဲ့ အောက်ခံ (underlying) data တွေကို ပြုလုပ်တဲ့ ပြောင်းလဲမှုတွေက cursor ထဲမှာ မြင်ရမြင်ရခြင်း ရှိမရှိကို ဆုံးဖြတ်ပါတယ်။ INSENSITIVE ဆိုတာ အဲဒီလို ပြောင်းလဲမှုတွေ မမြင်ရဘူးလို့ ဆိုလိုပြီး — ASENSITIVE ကတော့ အပြုအမူက implementation ပေါ်မှာ မူတည်တယ်လို့ ဆိုလိုပါတယ်။ တတိယ အပြုအမူတစ်ခုဖြစ်တဲ့ SENSITIVE — အဲဒီလို ပြောင်းလဲမှုတွေက cursor ထဲမှာ မြင်ရတယ်လို့ ဆိုလိုတာပါ — ကတော့ PostgreSQL မှာ မရနိုင်ပါဘူး။ PostgreSQL မှာ cursors တွေ အားလုံးက insensitive ဖြစ်ပါတယ်; ဒါကြောင့် ဒီ key words တွေက ဘာအကျိုးသက်ရောက်မှုမှ မရှိဘဲ — SQL standard နဲ့ လိုက်ဖက်ညီမှု အတွက်သာ လက်ခံထားတာ ဖြစ်ပါတယ်။
INSENSITIVE ကို `FOR UPDATE` ဒါမှမဟုတ် `FOR SHARE` နဲ့ တွဲပြီး သတ်မှတ်တာက error တစ်ခုပါ။
- **SCROLL / NO SCROLL** — SCROLL က cursor ကို sequential (အစဉ်လိုက်) မဟုတ်တဲ့ ပုံစံနဲ့ (ဥပမာ — နောက်ပြန်) rows တွေ ပြန်ယူဖို့ သုံးနိုင်တယ်လို့ သတ်မှတ်ပေးပါတယ်။ Query ရဲ့ execution plan ရဲ့ ရှုပ်ထွေးမှုပေါ် မူတည်ပြီး — SCROLL ကို သတ်မှတ်တာက query ရဲ့ execution time အပေါ်မှာ စွမ်းဆောင်ရည် ထိခိုက်မှု (performance penalty) တစ်ခုကို သက်ရောက်စေနိုင်ပါတယ်။ NO SCROLL ကတော့ cursor ကို sequential မဟုတ်တဲ့ ပုံစံနဲ့ rows တွေ ပြန်ယူဖို့ မသုံးနိုင်ဘူးလို့ သတ်မှတ်ပေးပါတယ်။ Default ကတော့ အချို့ အခြေအနေတွေမှာ scrolling ကို ခွင့်ပြုပါတယ်; ဒါက SCROLL ကို သတ်မှတ်တာနဲ့တော့ မတူပါဘူး။ အသေးစိတ်အတွက် အောက်က Notes ကို ကြည့်ပါ။
- **WITH HOLD / WITHOUT HOLD** — WITH HOLD က — cursor ကို ဖန်တီးခဲ့တဲ့ transaction က အောင်မြင်စွာ commit ဖြစ်ပြီးနောက်မှာလည်း — cursor ကို ဆက်ပြီး သုံးနိုင်တယ်လို့ သတ်မှတ်ပေးပါတယ်။ WITHOUT HOLD ကတော့ — cursor ကို ဖန်တီးခဲ့တဲ့ transaction ရဲ့ အပြင်မှာ သုံးလို့ မရဘူးလို့ သတ်မှတ်ပေးပါတယ်။ WITHOUT HOLD ရော WITH HOLD ရော ဘာမှ သတ်မှတ်မထားရင် — WITHOUT HOLD က default ဖြစ်ပါတယ်။
- **query** — Cursor က ပြန်ပို့မယ့် rows တွေကို ထောက်ပံ့ပေးမယ့် `SELECT` ဒါမှမဟုတ် `VALUES` command တစ်ခု။

`ASENSITIVE`, `BINARY`, `INSENSITIVE` နဲ့ `SCROLL` ဆိုတဲ့ key words တွေက ဘယ်လို အစဉ်လိုက်မဆို ပေါ်လာနိုင်ပါတယ်။

## Notes (မှတ်စုများ)

သာမန် cursors တွေက — `SELECT` တစ်ခု ထုတ်ပေးမယ့်ပုံစံအတိုင်းပဲ — data တွေကို text format နဲ့ ပြန်ပို့ပါတယ်။ `BINARY` option က cursor က data တွေကို binary format နဲ့ ပြန်ပို့သင့်တယ်လို့ သတ်မှတ်ပေးပါတယ်။ ဒါက server ရော client ရော အတွက် conversion လုပ်ရတဲ့ အားထုတ်မှုကို လျှော့ချပေးပေမယ့် — platform ပေါ် မူတည်တဲ့ binary data formats တွေကို ကိုင်တွယ်ဖို့ programmer အတွက် အားထုတ်မှု ပိုလိုအပ်စေပါတယ်။ ဥပမာတစ်ခုအနေနဲ့ — query တစ်ခုက integer column တစ်ခုကနေ တန်ဖိုး တစ်ခုကို ပြန်ပို့တယ်ဆိုရင် — default cursor တစ်ခုနဲ့ဆိုရင် `1` ဆိုတဲ့ string တစ်ခုကို ရမှာ ဖြစ်ပြီး — binary cursor တစ်ခုနဲ့ဆိုရင်တော့ — တန်ဖိုးရဲ့ internal representation (big-endian byte order နဲ့) ပါဝင်တဲ့ 4-byte field တစ်ခုကို ရမှာ ဖြစ်ပါတယ်။

Binary cursors တွေကို သတိထားပြီး သုံးသင့်ပါတယ်။ psql အပါအဝင် application တွေ အများကြီးက binary cursors တွေကို ကိုင်တွယ်ဖို့ ပြင်ဆင်ထားတာ မဟုတ်ဘဲ — data တွေကို text format နဲ့ ပြန်လာမယ်လို့ မျှော်လင့်ထားပါတယ်။

> **သတိပြုရန်:** Client application တစ်ခုက “extended query” protocol ကို သုံးပြီး `FETCH` command တစ်ခုကို ထုတ်ပေးတဲ့အခါ — Bind protocol message က data တွေကို text ဒါမှမဟုတ် binary format နဲ့ ပြန်ယူမလဲဆိုတာကို သတ်မှတ်ပေးပါတယ်။ ဒီရွေးချယ်မှုက cursor ကို သတ်မှတ်ထားတဲ့ ပုံစံကို ကျော်လွန်၍ အစားထိုးပါတယ်။ ဒါကြောင့် — extended query protocol ကို သုံးတဲ့အခါ — binary cursor ဆိုတဲ့ အယူအဆဟာ သူ့ဘာသာ ခေတ်ကုန်သွားပါတယ် — cursor တိုင်းကို text ဒါမှမဟုတ် binary အနေနဲ့ ဆက်ဆံလို့ ရပါတယ်။

`WITH HOLD` ကို သတ်မှတ်မထားရင် — ဒီ command က ဖန်တီးတဲ့ cursor ကို လက်ရှိ transaction အတွင်းမှာပဲ သုံးနိုင်ပါတယ်။ ဒါကြောင့် — `WITH HOLD` မပါတဲ့ `DECLARE` က transaction block ရဲ့ အပြင်မှာ အသုံးမဝင်ပါဘူး: cursor က statement ပြီးဆုံးတဲ့အထိပဲ ရှင်သန်နေမှာ ဖြစ်လို့ပါ။ ဒါကြောင့် — transaction block အပြင်မှာ ဒီလို command တစ်ခုကို သုံးရင် — PostgreSQL က error တစ်ခုကို အစီရင်ခံပါတယ်။ Transaction block တစ်ခုကို သတ်မှတ်ဖို့ [`BEGIN`](/docs/postgresql/sql-begin) နဲ့ [`COMMIT`](/docs/postgresql/sql-commit) (ဒါမှမဟုတ် [`ROLLBACK`](/docs/postgresql/sql-rollback)) ကို သုံးပါ။

`WITH HOLD` ကို သတ်မှတ်ပြီး — cursor ကို ဖန်တီးခဲ့တဲ့ transaction က အောင်မြင်စွာ commit ဖြစ်ခဲ့ရင် — cursor ကို တူညီတဲ့ session ထဲက နောက်ဆက်တွဲ transactions တွေကနေ ဆက်လက် ဝင်ရောက် အသုံးပြုနိုင်ပါတယ်။ (ဒါပေမယ့် — ဖန်တီးခဲ့တဲ့ transaction က abort ဖြစ်ခဲ့ရင်တော့ — cursor ကို ဖယ်ရှားလိုက်ပါတယ်။) `WITH HOLD` နဲ့ ဖန်တီးထားတဲ့ cursor တစ်ခုကို — အဲဒါပေါ်မှာ explicit `CLOSE` command တစ်ခု ထုတ်ပေးတဲ့အခါ ဒါမှမဟုတ် — session အဆုံးသတ်တဲ့အခါ — ပိတ်လိုက်ပါတယ်။ လက်ရှိ implementation မှာ — hold လုပ်ထားတဲ့ cursor တစ်ခုက ကိုယ်စားပြုတဲ့ rows တွေကို temporary file ဒါမှမဟုတ် memory area တစ်ခုထဲကို copy လုပ်ထားလို့ — နောက်ဆက်တွဲ transactions တွေအတွက် ရရှိနိုင်ဆဲ ဖြစ်ပါတယ်။

Query မှာ `FOR UPDATE` ဒါမှမဟုတ် `FOR SHARE` ပါဝင်နေရင် — `WITH HOLD` ကို သတ်မှတ်လို့ မရပါဘူး။

နောက်ပြန် fetch လုပ်ဖို့ သုံးမယ့် cursor တစ်ခုကို သတ်မှတ်တဲ့အခါ `SCROLL` option ကို သတ်မှတ်သင့်ပါတယ်။ ဒါက SQL standard က လိုအပ်တာပါ။ ဒါပေမယ့် — အရင် versions တွေနဲ့ လိုက်ဖက်ညီမှု အတွက် — cursor ရဲ့ query plan က ဒါကို ထောက်ပံ့ဖို့ ထပ်ဆောင်း overhead မလိုအပ်လောက်အောင် ရိုးရှင်းတယ်ဆိုရင် — PostgreSQL က `SCROLL` မပါဘဲ နောက်ပြန် fetches တွေကို ခွင့်ပြုပါလိမ့်မယ်။ ဒါပေမယ့် — application developer တွေက `SCROLL` နဲ့ မဖန်တီးထားတဲ့ cursor တစ်ခုကနေ နောက်ပြန် fetches တွေ သုံးတာကို အားကိုးမနေဖို့ အကြံပြုထားပါတယ်။ `NO SCROLL` ကို သတ်မှတ်ထားရင်တော့ — ဘယ်အခြေအနေမှာမဆို နောက်ပြန် fetches တွေကို ခွင့်မပြုပါဘူး။

Query မှာ `FOR UPDATE` ဒါမှမဟုတ် `FOR SHARE` ပါဝင်နေရင်လည်း နောက်ပြန် fetches တွေကို ခွင့်မပြုပါဘူး; ဒါကြောင့် — ဒီကိစ္စမှာ `SCROLL` ကိုလည်း သတ်မှတ်လို့ မရပါဘူး။

> **သတိထားရန်:** Scrollable cursors တွေက volatile functions တစ်ခုခုကို ခေါ်ယူသုံးစွဲနေရင် ([အပိုင်း 36.7](https://www.postgresql.org/docs/current/xfunc-volatility.html) ကို ကြည့်ပါ) — မမျှော်လင့်ထားတဲ့ ရလဒ်တွေကို ပေးနိုင်ပါတယ်။ အရင်က fetch လုပ်ထားတဲ့ row တစ်ခုကို ပြန် fetch လုပ်တဲ့အခါ — functions တွေ ထပ်ခါထပ်ခါ execute ဖြစ်နိုင်ပြီး — ပထမအကြိမ်ကနဲ့ မတူတဲ့ ရလဒ်တွေကို ဖြစ်ပေါ်စေနိုင်ပါတယ်။ Volatile functions တွေ ပါဝင်တဲ့ query တစ်ခုအတွက် `NO SCROLL` ကို သတ်မှတ်တာ အကောင်းဆုံးပါ။ အဲဒါ လက်တွေ့ မဖြစ်နိုင်ဘူးဆိုရင် — cursor ကို `SCROLL WITH HOLD` နဲ့ declare လုပ်ပြီး — rows တွေ မဖတ်ခင် transaction ကို commit လုပ်တာက နည်းလမ်းတစ်ခုပါ။ ဒါက cursor ရဲ့ output တစ်ခုလုံးကို temporary storage ထဲမှာ materialize (ပုံစံချ သိမ်းဆည်း) လုပ်ဖို့ အတင်းအကျပ် ဖြစ်စေမှာ ဖြစ်လို့ — volatile functions တွေက row တစ်ခုစီအတွက် အတိအကျ တစ်ကြိမ်ပဲ execute ဖြစ်ပါတယ်။

Cursor ရဲ့ query မှာ `FOR UPDATE` ဒါမှမဟုတ် `FOR SHARE` ပါဝင်ရင် — ပြန်ပို့လိုက်တဲ့ rows တွေကို — ဒီ options တွေပါတဲ့ သာမန် [`SELECT`](https://www.postgresql.org/docs/current/sql-select.html) command တစ်ခုမှာလိုပဲ — ပထမဆုံး fetch လုပ်တဲ့အချိန်မှာ lock လုပ်ပါတယ်။ ဒါ့အပြင် — ပြန်ပို့လိုက်တဲ့ rows တွေက နောက်ဆုံး အသစ်ဆုံး (most up-to-date) versions တွေ ဖြစ်ပါလိမ့်မယ်။

> **သတိထားရန်:** Cursor ကို `UPDATE ... WHERE CURRENT OF` ဒါမှမဟုတ် `DELETE ... WHERE CURRENT OF` တွေနဲ့ သုံးဖို့ ရည်ရွယ်ထားရင် — ယေဘုယျအားဖြင့် `FOR UPDATE` ကို သုံးဖို့ အကြံပြုထားပါတယ်။ `FOR UPDATE` ကို သုံးတာက — တခြား sessions တွေက rows တွေကို — သူတို့ fetch လုပ်ခံရတဲ့ အချိန်နဲ့ update လုပ်ခံရတဲ့ အချိန်ကြားမှာ — ပြောင်းလဲပစ်တာကို တားဆီးပေးပါတယ်။ `FOR UPDATE` မပါဘဲ — cursor ကို ဖန်တီးပြီးကတည်းက row ကို ပြောင်းလဲခဲ့ရင် — နောက်ပိုင်း `WHERE CURRENT OF` command တစ်ခုက ဘာအကျိုးသက်ရောက်မှုမှ ရှိမှာ မဟုတ်ပါဘူး။
> 
> `FOR UPDATE` ကို သုံးရတဲ့ နောက်တစ်ကြောင်းရင်းက — cursor query က SQL standard ရဲ့ “simply updatable” (ရိုးရိုး update လုပ်နိုင်သော) ဖြစ်ဖို့ စည်းမျဉ်းတွေနဲ့ မကိုက်ညီရင် (အထူးသဖြင့် — cursor က table တစ်ခုတည်းကိုပဲ ရည်ညွှန်းပြီး — grouping ဒါမှမဟုတ် `ORDER BY` တွေကို မသုံးရပါဘူး) — မရှိရင် — နောက်ပိုင်း `WHERE CURRENT OF` တစ်ခုက မအောင်မြင်နိုင်လို့ပါ။ Simply updatable မဟုတ်တဲ့ cursors တွေက — plan ရွေးချယ်မှုရဲ့ အသေးစိတ်တွေပေါ် မူတည်ပြီး — အလုပ်လုပ်လည်း လုပ်နိုင်၊ မလုပ်လည်း မလုပ်နိုင်ပါဘူး; ဒါကြောင့် — အဆိုးဆုံး အခြေအနေမှာ — application တစ်ခုက testing မှာ အလုပ်လုပ်ပြီး — production မှာ ကျရှုံးသွားနိုင်ပါတယ်။ `FOR UPDATE` ကို သတ်မှတ်ထားရင် — cursor က updatable ဖြစ်တာ အာမခံပါတယ်။
> 
> `WHERE CURRENT OF` နဲ့တွဲပြီး `FOR UPDATE` ကို မသုံးသင့်တဲ့ အဓိက အကြောင်းရင်းကတော့ — cursor ကို scrollable ဖြစ်စေချင်တာ၊ ဒါမှမဟုတ် — concurrent updates တွေကနေ သီးခြား ခွဲထားချင်တာ (ဆိုလိုတာက — data အဟောင်းကို ဆက်ပြီး ပြသနေစေချင်တာ) ဖြစ်ရပါမယ်။ ဒါက လိုအပ်ချက်တစ်ခု ဖြစ်နေရင် — အပေါ်မှာ ပြထားတဲ့ သတိပေးချက်တွေကို အထူး ဂရုစိုက်ပါ။

SQL standard က cursors တွေအတွက် embedded SQL ထဲမှာသာ ပြဋ္ဌာန်းချက်တွေ ပေးထားပါတယ်။ PostgreSQL server က cursors တွေအတွက် `OPEN` statement တစ်ခုကို မလုပ်ဆောင်ပါဘူး; cursor တစ်ခုကို declare လုပ်လိုက်တာနဲ့ — open ဖြစ်ပြီလို့ ယူဆပါတယ်။ ဒါပေမယ့် — PostgreSQL အတွက် embedded SQL preprocessor ဖြစ်တဲ့ ECPG ကတော့ — `DECLARE` နဲ့ `OPEN` statements တွေ ပါဝင်တဲ့ အပါအဝင် — standard SQL cursor conventions တွေကို ထောက်ပံ့ပေးပါတယ်။

Open ဖြစ်နေတဲ့ cursor တစ်ခုရဲ့ အောက်ခံ server data structure ကို *portal* လို့ ခေါ်ပါတယ်။ Portal နာမည်တွေကို client protocol ထဲမှာ ဖော်ပြထားပါတယ်: client တစ်ခုက portal ရဲ့ နာမည်ကို သိရင် — open ဖြစ်နေတဲ့ portal တစ်ခုကနေ rows တွေကို တိုက်ရိုက် fetch လုပ်နိုင်ပါတယ်။ `DECLARE` နဲ့ cursor တစ်ခုကို ဖန်တီးတဲ့အခါ — portal ရဲ့ နာမည်က cursor ရဲ့ နာမည်နဲ့ပဲ တူညီပါတယ်။

ရရှိနိုင်တဲ့ cursors တွေ အားလုံးကို [`pg_cursors`](https://www.postgresql.org/docs/current/view-pg-cursors.html) system view ကို query လုပ်ပြီး ကြည့်ရှုနိုင်ပါတယ်။

## Examples (ဥပမာများ)

Cursor တစ်ခုကို declare လုပ်ဖို့:

```sql
DECLARE liahona CURSOR FOR SELECT * FROM films;
```

Cursor အသုံးပြုမှု နောက်ထပ် ဥပမာတွေအတွက် [FETCH](/docs/postgresql/sql-fetch) ကို ကြည့်ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard က cursors တွေကို embedded SQL နဲ့ modules တွေထဲမှာသာ ခွင့်ပြုပါတယ်။ PostgreSQL ကတော့ cursors တွေကို interactively (အပြန်အလှန် တုံ့ပြန် ဆက်သွယ်မှုပုံစံနဲ့) အသုံးပြုဖို့ ခွင့်ပြုပါတယ်။

SQL standard အရ — insensitive cursors တွေကို `UPDATE ... WHERE CURRENT OF` နဲ့ `DELETE ... WHERE CURRENT OF` statements တွေက ပြုလုပ်တဲ့ ပြောင်းလဲမှုတွေက — အဲဒီ cursor ထဲမှာပဲ မြင်ရပါတယ်။ PostgreSQL ကတော့ ဒီ statements တွေကို — တခြား data ပြောင်းလဲတဲ့ statements တွေလိုပဲ — insensitive cursors တွေထဲမှာ မမြင်ရဘူးလို့ ဆက်ဆံပါတယ်။

Binary cursors တွေက PostgreSQL extension တစ်ခုပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CLOSE](/docs/postgresql/sql-close), [FETCH](/docs/postgresql/sql-fetch), [MOVE](/docs/postgresql/sql-move)
