---
title: "PREPARE TRANSACTION (two-phase commit အတွက် လက်ရှိ transaction ကို ပြင်ဆင်ခြင်း)"
description: "လက်ရှိ transaction ကို two-phase commit အတွက် ပြင်ဆင်ပေးသည့် command — transaction ၏ state ကို disk ပေါ်တွင် အပြည့်အဝ သိမ်းဆည်းပြီး session နှင့် ခွဲထုတ်ခြင်း၊ COMMIT PREPARED / ROLLBACK PREPARED ဖြင့် နောက်ပိုင်း ပြီးစီးစေခြင်း၊ transaction block လိုအပ်ချက်နှင့် ကန့်သတ်ချက်များ၊ external transaction manager အတွက် ရည်ရွယ်ထားသော PostgreSQL extension အကြောင်း"
order: 239
source: "https://www.postgresql.org/docs/current/sql-prepare-transaction.html"
status: translated
updated: 2026-09-04
---

## PREPARE TRANSACTION (two-phase commit အတွက် လက်ရှိ transaction ကို ပြင်ဆင်ခြင်း)

PREPARE TRANSACTION — လက်ရှိ transaction ကို two-phase commit အတွက် ပြင်ဆင်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
PREPARE TRANSACTION transaction_id
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`PREPARE TRANSACTION` က လက်ရှိ transaction ကို two-phase commit အတွက် ပြင်ဆင်ပေးပါတယ်။ ဒီ command ပြီးနောက်မှာ — transaction က လက်ရှိ session နဲ့ ဆက်စပ်မှု မရှိတော့ပါဘူး; အဲဒီအစား — သူ့ရဲ့ state (အခြေအနေ) တစ်ခုလုံးကို disk ပေါ်မှာ အပြည့်အဝ သိမ်းဆည်းထားပြီး — commit လုပ်ဖို့ မတောင်းဆိုခင် database crash ဖြစ်သွားရင်တောင် — အောင်မြင်စွာ commit လုပ်နိုင်ဖို့ ဖြစ်နိုင်ခြေ အလွန် မြင့်မားပါတယ်။

Prepared ဖြစ်သွားပြီးတာနဲ့ — transaction ကို နောက်ပိုင်းမှာ [`COMMIT PREPARED`](/docs/postgresql/sql-commit-prepared) ဒါမှမဟုတ် [`ROLLBACK PREPARED`](/docs/postgresql/sql-rollback-prepared) တွေနဲ့ အသီးသီး commit ဒါမှမဟုတ် roll back လုပ်လို့ ရပါတယ်။ အဲဒီ command တွေကို — မူရင်း transaction ကို execute လုပ်ခဲ့တဲ့ session တစ်ခုတည်းမကဘဲ — session ဘယ်ကနေမဆို ထုတ်ပေးလို့ ရပါတယ်။

ထုတ်ပေးလိုက်တဲ့ session ရဲ့ ရှုထောင့်ကနေ ကြည့်ရင် — `PREPARE TRANSACTION` က `ROLLBACK` command တစ်ခုနဲ့ သိပ်မကွာလှပါဘူး: ၎င်းကို execute လုပ်ပြီးနောက်မှာ — လက်ရှိ transaction ဆိုပြီး တက်ကြွနေတာ မရှိတော့ဘဲ — prepared transaction ရဲ့ အကျိုးသက်ရောက်မှုတွေလည်း မမြင်ရတော့ပါဘူး။ (Transaction ကို commit လုပ်လိုက်ရင် — အဲဒီ အကျိုးသက်ရောက်မှုတွေက နောက်တစ်ကြိမ် မြင်ရလာပါလိမ့်မယ်။)

`PREPARE TRANSACTION` command က တစ်စုံတစ်ရာသော အကြောင်းကြောင့် မအောင်မြင်ခဲ့ရင် — ၎င်းက `ROLLBACK` တစ်ခု ဖြစ်သွားပါတယ်: လက်ရှိ transaction ကို ဖျက်သိမ်းလိုက်ပါတယ်။

## Parameters (parameter များ)

- **transaction_id** — နောက်ပိုင်းမှာ COMMIT PREPARED ဒါမှမဟုတ် ROLLBACK PREPARED အတွက် ဒီ transaction ကို သတ်မှတ် ဖော်ပြပေးမယ့် စိတ်ကြိုက် identifier (သတ်မှတ်ကိန်း) တစ်ခုပါ။ Identifier ကို string literal (စာသား ကိန်းသေ) အဖြစ် ရေးရမှာ ဖြစ်ပြီး — bytes 200 ထက် ပိုတိုရပါမယ်။ လက်ရှိ prepared ဖြစ်နေတဲ့ transaction တစ်ခုခုအတွက် သုံးထားတဲ့ identifier နဲ့လည်း တူလို့ မရပါဘူး။

## Notes (မှတ်စုများ)

`PREPARE TRANSACTION` က applications တွေ ဒါမှမဟုတ် interactive sessions တွေထဲမှာ သုံးဖို့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။ ၎င်းရဲ့ ရည်ရွယ်ချက်က — external transaction manager (ပြင်ပ transaction စီမံခန့်ခွဲမှု စနစ်) တစ်ခုကို — databases အများအပြား ဒါမှမဟုတ် အခြား transactional resources တွေ တစ်လျှောက်မှာ — atomic global transactions တွေကို လုပ်ဆောင်နိုင်ဖို့ ခွင့်ပြုဖို့ ဖြစ်ပါတယ်။ သင်က transaction manager တစ်ခု ရေးသားနေတာ မဟုတ်ဘူးဆိုရင် — `PREPARE TRANSACTION` ကို သုံးနေဖို့ မလိုအပ်ပါဘူး။

ဒီ command ကို transaction block တစ်ခုရဲ့ အတွင်းမှာ သုံးရပါမယ်။ Transaction block တစ်ခု စတင်ဖို့ [`BEGIN`](/docs/postgresql/sql-begin) ကို သုံးပါ။

လောလောဆယ်မှာ — temporary tables တွေ ဒါမှမဟုတ် session ရဲ့ temporary namespace (ယာယီ အမည်နေရာ) ပါဝင်တဲ့ operations တစ်ခုခုကို execute လုပ်ခဲ့တဲ့ — `WITH HOLD` ပါတဲ့ cursors တစ်ခုခု ဖန်တီးခဲ့တဲ့ — ဒါမှမဟုတ် `LISTEN`, `UNLISTEN`, `NOTIFY` တွေကို execute လုပ်ခဲ့တဲ့ — transaction တစ်ခုကို `PREPARE` လုပ်တာကို ခွင့်မပြုပါဘူး။ အဲဒီ features တွေက လက်ရှိ session နဲ့ အလွန် တင်းတင်းကြပ်ကြပ် ချိတ်ဆက်နေလို့ — prepared လုပ်ဖို့ ရည်ရွယ်ထားတဲ့ transaction တစ်ခုအတွက်မှာ အသုံးမဝင်ပါဘူး။

Transaction က run-time parameters တစ်ခုခုကို `SET` (with `LOCAL` option မပါဘဲ) နဲ့ ပြုပြင်မွမ်းမံခဲ့ရင် — အဲဒီ အကျိုးသက်ရောက်မှုတွေက `PREPARE TRANSACTION` ပြီးနောက်မှာလည်း ဆက်တည်ရှိနေပြီး — နောက်ပိုင်း `COMMIT PREPARED` ဒါမှမဟုတ် `ROLLBACK PREPARED` တွေရဲ့ သက်ရောက်မှုကို ခံရမှာ မဟုတ်ပါဘူး။ ဒါကြောင့် — ဒီအချက် တစ်ချက်မှာတော့ `PREPARE TRANSACTION` က `ROLLBACK` ထက် `COMMIT` နဲ့ ပိုပြီး တူညီတဲ့ အပြုအမူ ရှိပါတယ်။

လက်ရှိ ရရှိနိုင်တဲ့ prepared transactions တွေ အားလုံးကို — [`pg_prepared_xacts`](https://www.postgresql.org/docs/current/view-pg-prepared-xacts.html) system view ထဲမှာ စာရင်းပြုထားပါတယ်။

> **သတိထားရန်:** Prepared state (ပြင်ဆင်ပြီး အခြေအနေ) မှာ transaction တွေကို အချိန် အကြာကြီး ထားခဲ့တာ မပညာရှိပါဘူး။ ဒါက `VACUUM` ရဲ့ storage ပြန်လည် ရယူနိုင်စွမ်းကို နှောင့်ယှက်ပြီး — အစွန်းရောက် အခြေအနေတွေမှာ — transaction ID wraparound မဖြစ်အောင် ကာကွယ်ဖို့ — database ကို ပိတ်ပစ်ရတဲ့အထိ ဖြစ်စေနိုင်ပါတယ် ([အပိုင်း 24.1.5](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND) ကို ကြည့်ပါ)။ Transaction က သူ ကိုင်ထားခဲ့တဲ့ locks တွေကို ဆက်ပြီး ကိုင်ထားဆဲ ဆိုတာကိုလည်း သတိပြုပါ။ ဒီ feature ရဲ့ ရည်ရွယ်ထားတဲ့ အသုံးပြုပုံက — prepared transaction တစ်ခုကို — external transaction manager က အခြား databases တွေလည်း commit လုပ်ဖို့ အဆင်သင့် ဖြစ်နေကြောင်း အတည်ပြုပြီးတာနဲ့ — ပုံမှန်အားဖြင့် ချက်ချင်း commit ဒါမှမဟုတ် roll back လုပ်ဖို့ ဖြစ်ပါတယ်။
> 
> Prepared transactions တွေကို ခြေရာခံပြီး — ၎င်းတို့ကို အချိန်မီ ပိတ်သိမ်းကြောင်း သေချာစေမယ့် external transaction manager တစ်ခုကို သင် သတ်မှတ်မထားရင် — [max_prepared_transactions](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-PREPARED-TRANSACTIONS) ကို သုည အဖြစ် သတ်မှတ်ပြီး — prepared-transaction feature ကို disabled ဖြစ်အောင် ထားတာ အကောင်းဆုံးပါ။ ဒါက — မေ့ပျောက်ခံထားရပြီး နောက်ဆုံးမှာ ပြဿနာတွေ ဖြစ်စေနိုင်တဲ့ — prepared transactions တွေ မတော်တဆ ဖန်တီးခံရခြင်းကို ကာကွယ်ပေးပါလိမ့်မယ်။

## Examples (ဥပမာများ)

လက်ရှိ transaction ကို — `foobar` ကို transaction identifier အဖြစ် သုံးပြီး — two-phase commit အတွက် ပြင်ဆင်ဖို့:

```sql
PREPARE TRANSACTION 'foobar';
```

## Compatibility (လိုက်ဖက်ညီမှု)

`PREPARE TRANSACTION` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။ ၎င်းကို external transaction management systems တွေမှာ သုံးဖို့ ရည်ရွယ်ထားပါတယ် — အဲဒီ system တွေထဲက တချို့ကို standards တွေ (ဥပမာ X/Open XA) နဲ့ လွှမ်းခြုံထားပေမယ့် — အဲဒီ system တွေရဲ့ SQL ဘက်ခြမ်းကတော့ standard သတ်မှတ်ခြင်း မခံရပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[COMMIT PREPARED](/docs/postgresql/sql-commit-prepared), [ROLLBACK PREPARED](/docs/postgresql/sql-rollback-prepared)
