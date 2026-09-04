---
title: "FETCH (cursor ဖြင့် query မှ rows များ ပြန်လည်ရယူခြင်း)"
description: "Cursor ကို သုံးပြီး query တစ်ခုမှ rows များ ပြန်လည်ရယူခြင်း — FETCH ၏ direction ပုံစံများ အားလုံး (NEXT, PRIOR, FIRST, LAST, ABSOLUTE, RELATIVE, ALL, FORWARD, BACKWARD စသည်)၊ cursor position ၏ အပြုအမူ၊ command tag output (FETCH count) နှင့် cursor သုံးပြီး table တစ်ခုကို ဖြတ်သန်းလည်ပတ်ပုံ ဥပမာ"
order: 189
source: "https://www.postgresql.org/docs/current/sql-fetch.html"
status: translated
updated: 2026-09-04
---

## FETCH (cursor ဖြင့် query မှ rows များ ပြန်လည်ရယူခြင်း)

FETCH — အရင်က ဖန်တီးထားတဲ့ cursor တစ်ခုကို သုံးပြီး query တစ်ခုကနေ rows တွေကို ပြန်ယူပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
FETCH [ direction ] [ FROM | IN ] cursor_name

where direction can be one of:

    NEXT
    PRIOR
    FIRST
    LAST
    ABSOLUTE count
    RELATIVE count
    count
    ALL
    FORWARD
    FORWARD count
    FORWARD ALL
    BACKWARD
    BACKWARD count
    BACKWARD ALL
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`FETCH` က အရင်က ဖန်တီးထားတဲ့ cursor တစ်ခုကို သုံးပြီး rows တွေကို ပြန်ယူပါတယ်။

Cursor တစ်ခုမှာ — `FETCH` က သုံးတဲ့ — ဆက်စပ်နေတဲ့ cursor position (cursor ၏ အနေအထား) တစ်ခု ရှိပါတယ်။ Cursor position က — query result ရဲ့ ပထမ row ရဲ့ ရှေ့မှာ ဖြစ်စေ၊ result ရဲ့ ဘယ် row တစ်ခုခုပေါ်မှာ ဖြစ်စေ၊ result ရဲ့ နောက်ဆုံး row ရဲ့ နောက်မှာ ဖြစ်စေ ရှိနိုင်ပါတယ်။ Cursor တစ်ခုကို ဖန်တီးလိုက်တဲ့အခါ — ပထမ row ရဲ့ ရှေ့မှာ နေရာချထားပါတယ်။ Rows တချို့ကို fetch လုပ်ပြီးနောက် — cursor က နောက်ဆုံး ပြန်ယူလိုက်တဲ့ row ပေါ်မှာ နေရာချထားပါတယ်။ `FETCH` က ရရှိနိုင်တဲ့ rows တွေရဲ့ အဆုံးကို ကျော်လွန်သွားရင် — cursor ကို နောက်ဆုံး row ရဲ့ နောက်မှာ ဒါမှမဟုတ် — နောက်ပြန် fetch လုပ်နေတယ်ဆိုရင် — ပထမ row ရဲ့ ရှေ့မှာ နေရာချထားခဲ့ပါတယ်။ `FETCH ALL` ဒါမှမဟုတ် `FETCH BACKWARD ALL` ကတော့ — cursor ကို နောက်ဆုံး row ရဲ့ နောက်မှာ ဒါမှမဟုတ် ပထမ row ရဲ့ ရှေ့မှာ အမြဲတမ်း နေရာချထားခဲ့ပါတယ်။

`NEXT`, `PRIOR`, `FIRST`, `LAST`, `ABSOLUTE`, `RELATIVE` ပုံစံတွေက — cursor ကို သင့်လျော်စွာ ရွှေ့ပြီးနောက် — row တစ်ခုတည်းကို fetch လုပ်ပါတယ်။ အဲဒီလို row မရှိဘူးဆိုရင် — empty result တစ်ခုကို ပြန်ပို့ပြီး — cursor ကို သင့်လျော်သလို — ပထမ row ရဲ့ ရှေ့ ဒါမှမဟုတ် နောက်ဆုံး row ရဲ့ နောက်မှာ နေရာချထားခဲ့ပါတယ်။

`FORWARD` နဲ့ `BACKWARD` ကို သုံးတဲ့ ပုံစံတွေက — ညွှန်ပြထားတဲ့ rows အရေအတွက်ကို — ရှေ့ ဒါမှမဟုတ် နောက် ဦးတည်ချက်နဲ့ ရွှေ့ပြီး ပြန်ယူကာ — cursor ကို နောက်ဆုံး ပြန်ပို့လိုက်တဲ့ row ပေါ်မှာ (ဒါမှမဟုတ် — `count` က ရရှိနိုင်တဲ့ rows အရေအတွက်ထက် ကျော်လွန်နေရင် — rows အားလုံးရဲ့ နောက်မှာ ဒါမှမဟုတ် ရှေ့မှာ) နေရာချထားခဲ့ပါတယ်။

`RELATIVE 0`, `FORWARD 0` နဲ့ `BACKWARD 0` တွေက — cursor ကို မရွှေ့ဘဲ — လက်ရှိ row ကို fetch လုပ်ဖို့ တောင်းဆိုတာပါ; ဆိုလိုတာက — နောက်ဆုံး fetch လုပ်ခဲ့တဲ့ row ကို ပြန် fetch လုပ်တာပါ။ Cursor က ပထမ row ရဲ့ ရှေ့ ဒါမှမဟုတ် နောက်ဆုံး row ရဲ့ နောက်မှာ နေရာချထားတာ မဟုတ်ဘူးဆိုရင် — ဒါက အောင်မြင်ပါတယ်; အဲဒီလို အခြေအနေတွေမှာတော့ — row ဘာမှ ပြန်မပို့ပါဘူး။

> **သတိပြုရန်:** ဒီ page က SQL command အဆင့်မှာ cursors အသုံးပြုမှုကို ဖော်ပြပါတယ်။ PL/pgSQL function တစ်ခုရဲ့ အတွင်းမှာ cursors တွေကို သုံးချင်တယ်ဆိုရင် — စည်းမျဉ်းတွေ ကွဲပြားပါတယ် — [အပိုင်း 41.7.3](https://www.postgresql.org/docs/current/plpgsql-cursors.html#PLPGSQL-CURSOR-USING) ကို ကြည့်ပါ။

## Parameters (parameter များ)

- **direction** — direction က fetch လုပ်ရမယ့် ဦးတည်ချက်နဲ့ rows အရေအတွက်ကို သတ်မှတ်ပါတယ်။ အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:
  - **NEXT** — နောက် row တစ်ခုကို fetch လုပ်ပါတယ်။ direction ကို ချန်လိုက်ရင် ဒါကပဲ default ဖြစ်ပါတယ်။
  - **PRIOR** — အရင် row ကို fetch လုပ်ပါတယ်။
  - **FIRST** — Query ရဲ့ ပထမဆုံး row ကို fetch လုပ်ပါတယ် (ABSOLUTE 1 နဲ့ တူညီပါတယ်)။
  - **LAST** — Query ရဲ့ နောက်ဆုံး row ကို fetch လုပ်ပါတယ် (ABSOLUTE -1 နဲ့ တူညီပါတယ်)။
  - **ABSOLUTE count** — Query ရဲ့ count မြောက် row ကို fetch လုပ်ပါတယ် — count က negative ဆိုရင်တော့ — အဆုံးကနေ abs(count) မြောက် row ကို ဖြစ်ပါတယ်။ count က range အပြင်ဘက် ကျော်လွန်နေရင် — ပထမ row ရဲ့ ရှေ့ ဒါမှမဟုတ် နောက်ဆုံး row ရဲ့ နောက်မှာ နေရာချပေးပါတယ်; အထူးသဖြင့် — ABSOLUTE 0 က ပထမ row ရဲ့ ရှေ့မှာ နေရာချပေးပါတယ်။
  - **RELATIVE count** — နောက် ဆက်တိုက် count မြောက် row ကို fetch လုပ်ပါတယ် — count က negative ဆိုရင်တော့ — အရင် abs(count) မြောက် row ကို ဖြစ်ပါတယ်။ RELATIVE 0 က လက်ရှိ row ကို ပြန် fetch လုပ်ပါတယ် (row ရှိရင်)။
  - **count** — နောက် rows count ခုကို fetch လုပ်ပါတယ် (FORWARD count နဲ့ တူညီပါတယ်)။
  - **ALL** — ကျန်နေတဲ့ rows တွေ အားလုံးကို fetch လုပ်ပါတယ် (FORWARD ALL နဲ့ တူညီပါတယ်)။
  - **FORWARD** — နောက် row တစ်ခုကို fetch လုပ်ပါတယ် (NEXT နဲ့ တူညီပါတယ်)။
  - **FORWARD count** — နောက် rows count ခုကို fetch လုပ်ပါတယ်။ FORWARD 0 က လက်ရှိ row ကို ပြန် fetch လုပ်ပါတယ်။
  - **FORWARD ALL** — ကျန်နေတဲ့ rows တွေ အားလုံးကို fetch လုပ်ပါတယ်။
  - **BACKWARD** — အရင် row ကို fetch လုပ်ပါတယ် (PRIOR နဲ့ တူညီပါတယ်)။
  - **BACKWARD count** — အရင် rows count ခုကို fetch လုပ်ပါတယ် (နောက်ပြန် scan လုပ်ပြီး)။ BACKWARD 0 က လက်ရှိ row ကို ပြန် fetch လုပ်ပါတယ်။
  - **BACKWARD ALL** — အရင် rows တွေ အားလုံးကို fetch လုပ်ပါတယ် (နောက်ပြန် scan လုပ်ပြီး)။
- **count** — count က sign ပါနိုင်တဲ့ (possibly-signed) integer constant တစ်ခု ဖြစ်ပြီး — fetch လုပ်ရမယ့် rows တွေရဲ့ တည်နေရာ ဒါမှမဟုတ် အရေအတွက်ကို ဆုံးဖြတ်ပါတယ်။ FORWARD နဲ့ BACKWARD အခြေအနေတွေမှာ — negative count တစ်ခုကို သတ်မှတ်တာက — FORWARD နဲ့ BACKWARD ရဲ့ ဦးတည်ချက် အဓိပ္ပာယ်ကို ပြောင်းပြန် လှည့်လိုက်တာနဲ့ ညီမျှပါတယ်။
- **cursor_name** — Open ဖြစ်နေတဲ့ cursor တစ်ခုရဲ့ နာမည်။

## Outputs (output များ)

အောင်မြင်စွာ ပြီးဆုံးတဲ့အခါ — `FETCH` command တစ်ခုက အောက်ပါပုံစံ ရှိတဲ့ command tag တစ်ခုကို ပြန်ပို့ပါတယ်

```sql
FETCH count
```

`count` ဆိုတာ fetch လုပ်လိုက်တဲ့ rows အရေအတွက်ပါ (zero လည်း ဖြစ်နိုင်ပါတယ်)။ psql မှာတော့ — psql က fetch လုပ်ထားတဲ့ rows တွေကို ပြသပေးတာမို့ — command tag ကို တကယ်တော့ ပြသမှာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ။

## Notes (မှတ်စုများ)

`FETCH NEXT` ဒါမှမဟုတ် — positive count တစ်ခုနဲ့ — `FETCH FORWARD` ကလွဲလို့ — `FETCH` ရဲ့ ဘယ် variants တွေကိုမဆို သုံးဖို့ ရည်ရွယ်ထားရင် — cursor ကို `SCROLL` option နဲ့ declare လုပ်ထားသင့်ပါတယ်။ ရိုးရှင်းတဲ့ queries တွေအတွက်တော့ — PostgreSQL က `SCROLL` နဲ့ declare မလုပ်ထားတဲ့ cursors တွေကနေ နောက်ပြန် fetch တွေကို ခွင့်ပြုပါလိမ့်မယ် — ဒါပေမယ့် — ဒီအပြုအမူကို အားကိုးမနေတာ အကောင်းဆုံးပါ။ Cursor ကို `NO SCROLL` နဲ့ declare လုပ်ထားရင် — နောက်ပြန် fetches တွေ ဘာမှ ခွင့်မပြုပါဘူး။

`ABSOLUTE` fetches တွေက — relative move တစ်ခုနဲ့ လိုချင်တဲ့ row ဆီ သွားတာထက် — ဘာမှ ပိုမြန်မနေပါဘူး: အောက်ခံ implementation က ကြားက rows တွေ အားလုံးကို ဘယ်လိုပဲဖြစ်ဖြစ် ဖြတ်သန်း သွားလာရပါတယ်။ Negative absolute fetches တွေကတော့ ပိုဆိုးပါတယ်: နောက်ဆုံး row ကို ရှာဖို့ query ကို အဆုံးအထိ ဖတ်ပြီး — အဲဒီကနေ နောက်ပြန် ဖြတ်သန်းရပါတယ်။ ဒါပေမယ့် — query ရဲ့ အစကို ပြန်လှည့်တာကတော့ (`FETCH ABSOLUTE 0` နဲ့ လိုမျိုး) မြန်ဆန်ပါတယ်။

[`DECLARE`](/docs/postgresql/sql-declare) ကို cursor တစ်ခုကို သတ်မှတ်ဖို့ သုံးပါတယ်။ Data တွေ ပြန်မယူဘဲ cursor ရဲ့ အနေအထားကို ပြောင်းလဲဖို့ [`MOVE`](/docs/postgresql/sql-move) ကို သုံးပါ။

## Examples (ဥပမာများ)

အောက်ပါ ဥပမာက cursor တစ်ခုကို သုံးပြီး table တစ်ခုကို ဖြတ်သန်း လည်ပတ်ပြသတာပါ:

```sql
BEGIN WORK;

-- Set up a cursor:
DECLARE liahona SCROLL CURSOR FOR SELECT * FROM films;

-- Fetch the first 5 rows in the cursor liahona:
FETCH FORWARD 5 FROM liahona;

 code  |          title          | did | date_prod  |   kind   |  len
-------+-------------------------+-----+------------+----------+-------
 BL101 | The Third Man           | 101 | 1949-12-23 | Drama    | 01:44
 BL102 | The African Queen       | 101 | 1951-08-11 | Romantic | 01:43
 JL201 | Une Femme est une Femme | 102 | 1961-03-12 | Romantic | 01:25
 P_301 | Vertigo                 | 103 | 1958-11-14 | Action   | 02:08
 P_302 | Becket                  | 103 | 1964-02-03 | Drama    | 02:28

-- Fetch the previous row:
FETCH PRIOR FROM liahona;

 code  |  title  | did | date_prod  |  kind  |  len
-------+---------+-----+------------+--------+-------
 P_301 | Vertigo | 103 | 1958-11-14 | Action | 02:08

-- Close the cursor and end the transaction:
CLOSE liahona;
COMMIT WORK;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard က `FETCH` ကို embedded SQL အတွင်းမှာသာ သုံးဖို့ သတ်မှတ်ပါတယ်။ ဒီမှာ ဖော်ပြထားတဲ့ `FETCH` ရဲ့ မူကွဲ (variant) က — data တွေကို host variables တွေထဲမှာ ထည့်ပေးမယ့်အစား — `SELECT` result တစ်ခုလိုမျိုး ပြန်ပို့ပါတယ်။ ဒီအချက်ကလွဲလို့ — `FETCH` က SQL standard နဲ့ အပြည့်အဝ အပေါ်သို့ လိုက်ဖက်ညီပါတယ် (fully upward-compatible)။

`FORWARD` နဲ့ `BACKWARD` ပါဝင်တဲ့ `FETCH` ပုံစံတွေ — `FORWARD` က သွယ်ဝိုက်ပါဝင်နေတဲ့ `FETCH count` နဲ့ `FETCH ALL` ပုံစံတွေလိုပဲ — PostgreSQL extensions တွေ ဖြစ်ပါတယ်။

SQL standard က cursor နာမည်ရဲ့ ရှေ့မှာ `FROM` ကိုပဲ ခွင့်ပြုပါတယ်; `IN` ကို သုံးလို့ရတာရော — သူတို့ကို လုံးဝ ချန်လိုက်လို့ရတာရော — extension တစ်ခုပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CLOSE](/docs/postgresql/sql-close), [DECLARE](/docs/postgresql/sql-declare), [MOVE](/docs/postgresql/sql-move)
