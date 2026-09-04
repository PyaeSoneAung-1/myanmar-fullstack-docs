---
title: "ALTER EVENT TRIGGER (event trigger တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Event trigger တစ်ခုရဲ့ properties များကို ပြောင်းလဲပေးသော command — trigger ကို disable/enable လုပ်ခြင်း (ENABLE REPLICA/ALWAYS ပုံစံများ အပါအဝင်)၊ owner ပြောင်းလဲခြင်း (OWNER TO) နှင့် နာမည်ပြောင်းလဲခြင်း (RENAME TO) — event trigger တစ်ခုကို ပြောင်းလဲရန် superuser ဖြစ်ရန် လိုအပ်ကြောင်း ဖော်ပြထားသည်"
order: 231
source: "https://www.postgresql.org/docs/current/sql-altereventtrigger.html"
status: translated
updated: 2026-09-04
---

## ALTER EVENT TRIGGER (event trigger တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER EVENT TRIGGER — event trigger တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER EVENT TRIGGER name DISABLE
ALTER EVENT TRIGGER name ENABLE [ REPLICA | ALWAYS ]
ALTER EVENT TRIGGER name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER EVENT TRIGGER name RENAME TO new_name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER EVENT TRIGGER` က ရှိပြီးသား event trigger တစ်ခုရဲ့ properties (ဂုဏ်သတ္တိများ) တွေကို ပြောင်းလဲပေးပါတယ်။

Event trigger တစ်ခုကို ပြောင်းလဲဖို့ — superuser ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **name** — ပြောင်းလဲရမယ့် ရှိပြီးသား trigger တစ်ခုရဲ့ နာမည်။
- **new_owner** — Event trigger ရဲ့ owner အသစ် ဖြစ်လာမယ့် user ရဲ့ နာမည်။
- **new_name** — Event trigger ရဲ့ နာမည် အသစ်။
- **DISABLE/ENABLE [ REPLICA | ALWAYS ]** — ဒီ ပုံစံတွေက event triggers တွေရဲ့ firing (fire လုပ်ခြင်း) ကို configure (ပြင်ဆင် သတ်မှတ်) လုပ်ပါတယ်။ Disable လုပ်ထားတဲ့ trigger တစ်ခုကို system က သိထားဆဲ ဖြစ်ပေမယ့် — ၎င်းရဲ့ triggering event (trigger ကို fire စေမယ့် event) ဖြစ်ပေါ်တဲ့အခါ — execute လုပ်မှာ မဟုတ်ပါဘူး။ session_replication_role ကိုလည်း ကြည့်ပါ။

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER EVENT TRIGGER` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE EVENT TRIGGER](/docs/postgresql/sql-createeventtrigger), [DROP EVENT TRIGGER](/docs/postgresql/sql-dropeventtrigger)
