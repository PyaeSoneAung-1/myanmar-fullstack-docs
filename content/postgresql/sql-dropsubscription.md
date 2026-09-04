---
title: "DROP SUBSCRIPTION (subscription တစ်ခုကို ဖယ်ရှားခြင်း)"
description: "Database cluster မှ subscription (စာရင်းသွင်းမှု) တစ်ခုကို ဖယ်ရှားပေးသည့် command — subscription ၏ owner ဖြစ်ရန် လိုအပ်ပြီး replication slot နှင့် ဆက်စပ်နေသော subscription ကို transaction block အတွင်းမှ မဖျက်နိုင်ခြင်း၊ remote replication slot drop လုပ်ရာတွင် ပျက်ကွက်မှု အခြေအနေများနှင့် ဖြေရှင်းနည်း — PostgreSQL extension တစ်ခုဖြစ်သည်"
order: 302
source: "https://www.postgresql.org/docs/current/sql-dropsubscription.html"
status: translated
updated: 2026-09-04
---

## DROP SUBSCRIPTION (subscription တစ်ခုကို ဖယ်ရှားခြင်း)

DROP SUBSCRIPTION — subscription တစ်ခုကို ဖယ်ရှားပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
DROP SUBSCRIPTION [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`DROP SUBSCRIPTION` က database cluster (database အစုအဝေး) တစ်ခုကနေ subscription (စာရင်းသွင်းမှု) တစ်ခုကို ဖယ်ရှားပေးပါတယ်။

ဒီ command ကို execute လုပ်ဖို့ — user ဟာ subscription ရဲ့ owner (ပိုင်ရှင်) ဖြစ်ရပါမယ်။

`DROP SUBSCRIPTION` ကို — subscription တစ်ခုက replication slot (replication လုပ်ငန်းအတွက် နေရာသတ်မှတ်ချက်) တစ်ခုနဲ့ ဆက်စပ်နေရင် — transaction block တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။ (Slot ကို ဖယ်ရှားဖို့ [`ALTER SUBSCRIPTION`](https://www.postgresql.org/docs/current/sql-altersubscription.html) ကို သုံးနိုင်ပါတယ်။)

## Parameters (parameter များ)

- **IF EXISTS** — Subscription မရှိဘူးဆိုရင် — error တစ်ခု ထုတ်ပစ်မယ့်အစား — ဒီကိစ္စမှာ notice (အသိပေးချက်) တစ်ခုကို ထုတ်ပြန်ပေးပါတယ်။
- **name** — ဖယ်ရှားရမယ့် subscription တစ်ခုရဲ့ နာမည် ဖြစ်ပါတယ်။
- **CASCADE** / **RESTRICT** — Subscriptions တွေပေါ်မှာ မှီခိုနေတဲ့ (dependent) objects တွေ မရှိတာမို့ — ဒီ key words တွေက ဘာ အကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

## Notes (မှတ်စုများ)

Remote host (အဝေး host) ပေါ်မှာ replication slot တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ subscription တစ်ခုကို drop လုပ်တဲ့အခါ (ပုံမှန် အခြေအနေပါ) — `DROP SUBSCRIPTION` က remote host ဆီ ချိတ်ဆက်ပြီး — သူ့ရဲ့ လုပ်ဆောင်မှု တစ်စိတ်တစ်ပိုင်းအနေနဲ့ — replication slot (နဲ့ ကျန်နေသေးတဲ့ table synchronization slots တွေ) ကို drop လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ ဒါက — remote host ပေါ်မှာ subscription အတွက် ခွဲဝေထားတဲ့ resources (အရင်းအမြစ်များ) တွေ လွှတ်ပေးနိုင်ဖို့ လိုအပ်ပါတယ်။ ဒါက မအောင်မြင်ရင် — remote host ဆီ ဆက်သွယ်လို့ မရလို့ဖြစ်ဖြစ်၊ remote replication slot ကို drop လို့ မရလို့ဖြစ်ဖြစ်၊ slot က မရှိတော့လို့ဖြစ်ဖြစ်၊ ဒါမှမဟုတ် တစ်ခါမှ မရှိခဲ့လို့ဖြစ်ဖြစ် — `DROP SUBSCRIPTION` command က မအောင်မြင်ပါဘူး။ ဒီလို အခြေအနေမှာ ဆက်လုပ်ဖို့ဆိုရင် — အရင်ဆုံး [`ALTER SUBSCRIPTION ... DISABLE`](https://www.postgresql.org/docs/current/sql-altersubscription.html#SQL-ALTERSUBSCRIPTION-PARAMS-DISABLE) ကို execute လုပ်ပြီး subscription ကို disable လုပ်ပါ — ပြီးတော့ [`ALTER SUBSCRIPTION ... SET (slot_name = NONE)`](https://www.postgresql.org/docs/current/sql-altersubscription.html#SQL-ALTERSUBSCRIPTION-PARAMS-SET) ကို execute လုပ်ပြီး replication slot ကနေ သီးခြား ခွဲထုတ်လိုက်ပါ။ အဲဒီနောက်မှာ — `DROP SUBSCRIPTION` က subscription ရဲ့ ကိုယ်ပိုင် replication slot ကို drop လုပ်ဖို့ ကြိုးစားတော့ မှာ မဟုတ်ပါဘူး။ Table synchronization တချို့ မပြီးပြတ်သေးဘူးဆိုရင် — သူက အတွင်းပိုင်းမှာ ဖန်တီးထားတဲ့ table synchronization slots တွေကို drop ဖို့ publisher (ထုတ်ဝေသူ) ဆီ ဆက်လက် ချိတ်ဆက်နိုင်ပါသေးတယ်; publisher ဆီ ဆက်သွယ်လို့ မရဘူးဆိုရင် — အဲဒီ slots တွေ (နဲ့ main slot — ရှိနေသေးရင်) ကို လက်နဲ့ ကိုယ်တိုင် drop လုပ်ရပါမယ်။ မဟုတ်ရင် — အဲဒါ(တွေ) က WAL ကို ဆက်လက် reserve (သီးသန့်ခွဲထား) လုပ်နေမှာ ဖြစ်ပြီး — နောက်ဆုံးမှာ disk ပြည့်သွားအောင် ဖြစ်စေနိုင်ပါတယ်။ ဒါ့အပြင် [အပိုင်း 29.2.1](https://www.postgresql.org/docs/current/logical-replication-subscription.html#LOGICAL-REPLICATION-SUBSCRIPTION-SLOT) ကိုလည်း ကြည့်ပါ။

Subscription တစ်ခုက replication slot တစ်ခုနဲ့ ဆက်စပ်နေရင် — `DROP SUBSCRIPTION` ကို transaction block တစ်ခုရဲ့ အတွင်းမှာ execute လုပ်လို့ မရပါဘူး။

## Examples (ဥပမာများ)

Subscription တစ်ခုကို ဖယ်ရှားခြင်း:

```sql
DROP SUBSCRIPTION mysub;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`DROP SUBSCRIPTION` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE SUBSCRIPTION](https://www.postgresql.org/docs/current/sql-createsubscription.html), [ALTER SUBSCRIPTION](https://www.postgresql.org/docs/current/sql-altersubscription.html)
