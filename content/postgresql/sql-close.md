---
title: "CLOSE (cursor တစ်ခုကို ပိတ်ခြင်း)"
description: "Open ဖြစ်နေသော cursor တစ်ခုနှင့် ဆက်စပ်နေသော resources များကို လွှတ်ပေးခြင်း — CLOSE ၏ syntax နှင့် parameters (name, ALL)၊ transaction ကို COMMIT/ROLLBACK ဖြင့် အဆုံးသတ်သည့်အခါ cursor များ အလိုအလျောက် ပိတ်ခြင်း၊ savepoint နှင့် ပတ်သက်သော အပြုအမူနှင့် SQL standard လိုက်ဖက်ညီမှု"
order: 191
source: "https://www.postgresql.org/docs/current/sql-close.html"
status: translated
updated: 2026-09-04
---

## CLOSE (cursor တစ်ခုကို ပိတ်ခြင်း)

CLOSE — cursor တစ်ခုကို ပိတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
CLOSE { name | ALL }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`CLOSE` က open ဖြစ်နေတဲ့ cursor တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ resources တွေကို လွှတ်ပေးပါတယ်။ Cursor ကို ပိတ်လိုက်ပြီးနောက် — အဲဒါပေါ်မှာ နောက်ထပ် ဘာ operations တွေမှ ခွင့်မပြုတော့ပါဘူး။ Cursor တစ်ခုကို — မလိုအပ်တော့တဲ့အခါ — ပိတ်သင့်ပါတယ်။

Hold လုပ်လို့မရတဲ့ (non-holdable) open cursor တိုင်းကို — transaction တစ်ခုကို `COMMIT` ဒါမှမဟုတ် `ROLLBACK` နဲ့ အဆုံးသတ်တဲ့အခါ — သွယ်ဝိုက်၍ (implicitly) ပိတ်လိုက်ပါတယ်။ Holdable cursor တစ်ခုကိုတော့ — သူ့ကို ဖန်တီးခဲ့တဲ့ transaction က `ROLLBACK` နဲ့ abort ဖြစ်ခဲ့ရင် — သွယ်ဝိုက်၍ ပိတ်လိုက်ပါတယ်။ ဖန်တီးခဲ့တဲ့ transaction က အောင်မြင်စွာ commit ဖြစ်ခဲ့ရင်တော့ — holdable cursor က — explicit `CLOSE` တစ်ခုကို execute လုပ်တဲ့အထိ ဒါမှမဟုတ် — client က disconnect လုပ်တဲ့အထိ — open ဖြစ်နေဆဲပါ။

## Parameters (parameter များ)

- **name** — ပိတ်ရမယ့် open cursor တစ်ခုရဲ့ နာမည်။
- **ALL** — Open ဖြစ်နေတဲ့ cursors တွေ အားလုံးကို ပိတ်ပါတယ်။

## Notes (မှတ်စုများ)

PostgreSQL မှာ explicit `OPEN` cursor statement ဆိုတာ မရှိပါဘူး; cursor တစ်ခုကို declare လုပ်လိုက်တာနဲ့ open ဖြစ်ပြီလို့ ယူဆပါတယ်။ Cursor တစ်ခုကို declare လုပ်ဖို့ [`DECLARE`](/docs/postgresql/sql-declare) statement ကို သုံးပါ။

ရရှိနိုင်တဲ့ cursors တွေ အားလုံးကို [`pg_cursors`](https://www.postgresql.org/docs/current/view-pg-cursors.html) system view ကို query လုပ်ပြီး ကြည့်ရှုနိုင်ပါတယ်။

Cursor တစ်ခုကို — နောက်ပိုင်းမှာ roll back လုပ်ခံရတဲ့ savepoint တစ်ခုပြီးနောက် — ပိတ်လိုက်ရင် — `CLOSE` ကို roll back လုပ်မှာ မဟုတ်ပါဘူး; ဆိုလိုတာက — cursor က ပိတ်ထားတဲ့အတိုင်း ကျန်ရှိနေပါတယ်။

## Examples (ဥပမာများ)

`liahona` cursor ကို ပိတ်ရန်:

```sql
CLOSE liahona;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`CLOSE` က SQL standard နဲ့ အပြည့်အဝ ကိုက်ညီပါတယ်။ `CLOSE ALL` ကတော့ PostgreSQL extension တစ်ခုပါ။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[DECLARE](/docs/postgresql/sql-declare), [FETCH](/docs/postgresql/sql-fetch), [MOVE](/docs/postgresql/sql-move)
