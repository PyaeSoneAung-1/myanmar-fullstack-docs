---
title: "UNLISTEN (notification နားထောင်ခြင်း ရပ်စဲခြင်း)"
description: "လက်ရှိ PostgreSQL session ၏ NOTIFY events အတွက် listener registration များကို ဖယ်ရှားပေးသည့် command — channel တစ်ခုအတွက် ဖြစ်စေ * wildcard ဖြင့် registration အားလုံးအတွက် ဖြစ်စေ ရပ်စဲနိုင်ပြီး session တိုင်း၏ အဆုံးတွင် UNLISTEN * ကို အလိုအလျောက် လုပ်ဆောင်သည်"
order: 197
source: "https://www.postgresql.org/docs/current/sql-unlisten.html"
status: translated
updated: 2026-09-04
---

## UNLISTEN (notification နားထောင်ခြင်း ရပ်စဲခြင်း)

UNLISTEN — notification တစ်ခုအတွက် နားထောင်ခြင်းကို ရပ်စဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
UNLISTEN { channel | * }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`UNLISTEN` ကို — `NOTIFY` events တွေအတွက် တည်ရှိပြီးသား registration တစ်ခုကို ဖယ်ရှားဖို့ သုံးပါတယ်။ `UNLISTEN` က — `channel` လို့ နာမည်ပေးထားတဲ့ notification channel ပေါ်က listener တစ်ခုအနေနဲ့ — လက်ရှိ PostgreSQL session ရဲ့ တည်ရှိနေတဲ့ registration တစ်ခုခုကို ပယ်ဖျက်ပေးပါတယ်။ အထူး wildcard (ရွေးချယ်စရာ အားလုံးကို ကိုယ်စားပြုသည့် သင်္ကေတ) `*` ကတော့ — လက်ရှိ session အတွက် listener registrations တွေ အားလုံးကို ပယ်ဖျက်ပေးပါတယ်။

[NOTIFY](/docs/postgresql/sql-notify) မှာ `LISTEN` နဲ့ `NOTIFY` အသုံးပြုမှုအကြောင်း ပိုပြီး အကျယ်တဝင့် ဆွေးနွေးထားပါတယ်။

## Parameters (parameter များ)

- **channel** — notification channel တစ်ခုရဲ့ နာမည် (identifier မည်သည်မဆို)။
- **\*** — ဒီ session အတွက် လက်ရှိ listen registrations တွေ အားလုံးကို ရှင်းလင်းပေးပါတယ်။

## Notes (မှတ်စုများ)

ကိုယ် နားမထောင်ထားခဲ့တဲ့အရာကိုလည်း unlisten လုပ်လို့ ရပါတယ်; warning ရော error ရော ဘာမှ ပေါ်လာမှာ မဟုတ်ပါဘူး။

Session တစ်ခုစီရဲ့ အဆုံးမှာ — `UNLISTEN *` ကို အလိုအလျောက် execute လုပ်ပါတယ်။

`UNLISTEN` ကို execute လုပ်ခဲ့တဲ့ transaction တစ်ခုကို two-phase commit အတွက် prepare လုပ်လို့ မရပါဘူး။

## Examples (ဥပမာများ)

Registration တစ်ခု ပြုလုပ်ဖို့:

```sql
LISTEN virtual;
NOTIFY virtual;
Asynchronous notification "virtual" received from server process with PID 8448.
```

`UNLISTEN` ကို execute လုပ်ပြီးတာနဲ့ — နောက်ထပ် `NOTIFY` messages တွေကို လျစ်လျူရှုသွားပါလိမ့်မယ်:

```sql
UNLISTEN virtual;
NOTIFY virtual;
-- no NOTIFY event is received
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `UNLISTEN` command ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[LISTEN](/docs/postgresql/sql-listen), [NOTIFY](/docs/postgresql/sql-notify)
