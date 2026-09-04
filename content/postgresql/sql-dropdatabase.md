---
title: "DROP DATABASE (database တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Database တစ်ခုကို ဖယ်ရှားခြင်း — DROP DATABASE ၏ syntax နှင့် parameters (IF EXISTS, FORCE) များ၊ connection များကို အဆုံးသတ်ခြင်း အပါအဝင် သတိပြုရန် အချက်များ"
order: 142
source: "https://www.postgresql.org/docs/current/sql-dropdatabase.html"
status: translated
updated: 2026-09-04
---

## DROP DATABASE (database တစ်ခုကို ဖယ်ရှားခြင်း)

DROP DATABASE — database တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP DATABASE [ IF EXISTS ] name [ [ WITH ] ( option [, ...] ) ]

where option can be:

    FORCE
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP DATABASE` က database တစ်ခုကို drop (ဖျက်) ပါတယ်။ ၎င်းက database အတွက် catalog entries တွေကို ဖယ်ရှားပြီး — data တွေ ပါဝင်တဲ့ directory ကို ဖျက်ပါတယ်။ ၎င်းကို database ရဲ့ owner ကပဲ execute လုပ်နိုင်ပါတယ်။ သင်ကိုယ်တိုင် target database ဆီ ချိတ်ဆက်ထားစဉ်မှာ execute လုပ်လို့ မရပါဘူး။ (ဒီ command ကို ထုတ်ပြန်ဖို့ `postgres` ဒါမှမဟုတ် တခြား database တစ်ခုခုဆီ ချိတ်ဆက်ပါ။) ဒါ့အပြင် — တခြားတစ်ယောက်ယောက်က target database ဆီ ချိတ်ဆက်ထားရင်လည်း — အောက်မှာ ဖော်ပြထားတဲ့ `FORCE` option ကို သင်မသုံးရင် ဒီ command က မအောင်မြင်ပါဘူး။

`DROP DATABASE` ကို ပြန်လည် ပယ်ဖျက် (undo) လုပ်လို့ မရပါဘူး။ သတိထားပြီးမှ သုံးပါ!

## Parameters (parameter များ)

- **IF EXISTS** — Database မရှိရင် error တစ်ခု မထုတ်ပါဘူး။ အဲဒီအစား ဒီကိစ္စမှာ notice တစ်ခု ထုတ်ပေးပါတယ်။
- **name** — ဖယ်ရှားရမယ့် database ရဲ့ နာမည်။
- **FORCE** — Target database ဆီက connection တွေ အားလုံးကို အဆုံးသတ်ဖို့ ကြိုးစားပါတယ်။ Target database ထဲမှာ prepared transactions, active logical replication slots ဒါမှမဟုတ် subscriptions တွေ ရှိနေရင်တော့ အဆုံးသတ်ပေးမှာ မဟုတ်ပါဘူး။
ဒါက background worker connections တွေနဲ့ — လက်ရှိ user က pg_terminate_backend နဲ့ အဆုံးသတ်ဖို့ ခွင့်ပြုချက် ရှိတဲ့ connections တွေကို အဆုံးသတ်ပေးပါတယ် — အပိုင်း 9.28.2 မှာ ဖော်ပြထားပါတယ်။ Connections တွေ ကျန်နေသေးရင် — ဒီ command က မအောင်မြင်ပါဘူး။

## Notes (မှတ်စုများ)

`DROP DATABASE` ကို transaction block ထဲမှာ execute လုပ်လို့ မရပါဘူး။

ဒီ command ကို target database ဆီ ချိတ်ဆက်ထားစဉ်မှာ execute လုပ်လို့ မရပါဘူး။ ဒါကြောင့် — ဒီ command ကို ပတ်ပြီး ထောက်ပံ့ထားတဲ့ wrapper တစ်ခုဖြစ်တဲ့ [dropdb](https://www.postgresql.org/docs/current/app-dropdb.html) program ကို သုံးတာက ပိုပြီး အဆင်ပြေနိုင်ပါတယ်။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard မှာ `DROP DATABASE` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE DATABASE](/docs/postgresql/sql-createdatabase)
