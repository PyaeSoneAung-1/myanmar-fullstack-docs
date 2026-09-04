---
title: "ALTER TRIGGER (trigger တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Trigger တစ်ခုရဲ့ properties များကို ပြောင်းလဲပေးသော command — RENAME clause ဖြင့် trigger နာမည် ပြောင်းလဲခြင်း နှင့် DEPENDS ON EXTENSION clause ဖြင့် extension တစ်ခုအပေါ် မှီခိုမှု သတ်မှတ်ခြင်း/ဖယ်ရှားခြင်း အကြောင်း အသေးစိတ် ရှင်းလင်းချက်"
order: 228
source: "https://www.postgresql.org/docs/current/sql-altertrigger.html"
status: translated
updated: 2026-09-04
---

## ALTER TRIGGER (trigger တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER TRIGGER — trigger တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER TRIGGER name ON table_name RENAME TO new_name
ALTER TRIGGER name ON table_name [ NO ] DEPENDS ON EXTENSION extension_name
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER TRIGGER` က ရှိပြီးသား trigger တစ်ခုရဲ့ properties (ဂုဏ်သတ္တိများ) တွေကို ပြောင်းလဲပေးပါတယ်။

`RENAME` clause က — trigger definition ကို တခြား နည်းနဲ့ မပြောင်းလဲဘဲ — ပေးထားတဲ့ trigger ရဲ့ နာမည်ကိုပဲ ပြောင်းလဲပေးပါတယ်။ Trigger တည်ရှိနေတဲ့ table က partitioned table တစ်ခု ဆိုရင် — partitions တွေထဲက သက်ဆိုင်ရာ clone triggers (trigger ပုံတူပွားများ) တွေကိုပါ အတူတူ နာမည်ပြောင်းပေးပါတယ်။

`DEPENDS ON EXTENSION` clause က trigger ကို extension တစ်ခုအပေါ် မှီခိုတယ်လို့ အမှတ်အသား လုပ်ပေးပါတယ် — ဒါကြောင့် — extension ကို drop လုပ်လိုက်ရင် — trigger ကိုပါ အလိုအလျောက် drop လုပ်ပါလိမ့်မယ်။

Trigger ရဲ့ properties တွေကို ပြောင်းလဲခွင့် ရဖို့အတွက် — trigger က သက်ရောက်နေတဲ့ table ရဲ့ owner (ပိုင်ရှင်) ဖြစ်ရပါမယ်။

## Parameters (parameter များ)

- **name** — ပြောင်းလဲရမယ့် ရှိပြီးသား trigger တစ်ခုရဲ့ နာမည်။
- **table_name** — ဒီ trigger က သက်ရောက်နေတဲ့ table ရဲ့ နာမည်။
- **new_name** — Trigger အတွက် နာမည်အသစ်။
- **extension_name** — Trigger က မှီခိုရမယ့် extension ရဲ့ နာမည် (NO ကို သတ်မှတ်ထားရင် — နောက်ထပ် မှီခိုမှု မရှိတော့အောင် လုပ်တာ ဖြစ်ပါတယ်)။ Extension တစ်ခုအပေါ် မှီခိုတယ်လို့ အမှတ်အသား လုပ်ထားတဲ့ trigger တစ်ခုကို — extension ကို drop လုပ်လိုက်တဲ့အခါ — အလိုအလျောက် drop လုပ်ပါတယ်။

## Notes (မှတ်စုများ)

Trigger တစ်ခုကို ယာယီ enable ဒါမှမဟုတ် disable လုပ်နိုင်စွမ်းကို — `ALTER TRIGGER` ကနေ မဟုတ်ဘဲ — [`ALTER TABLE`](https://www.postgresql.org/docs/current/sql-altertable.html) ကနေပဲ ပေးပါတယ် — ဘာလို့လဲဆိုတော့ — table တစ်ခုရဲ့ triggers တွေ အားလုံးကို တစ်ပြိုင်နက် enable ဒါမှမဟုတ် disable လုပ်တဲ့ option ကို ဖော်ပြဖို့ `ALTER TRIGGER` မှာ အဆင်ပြေတဲ့ နည်းလမ်း မရှိလို့ပါ။

## Examples (ဥပမာများ)

ရှိပြီးသား trigger တစ်ခုကို နာမည်ပြောင်းဖို့:

```sql
ALTER TRIGGER emp_stamp ON emp RENAME TO emp_track_chgs;
```

Trigger တစ်ခုကို extension တစ်ခုအပေါ် မှီခိုတယ်လို့ အမှတ်အသား လုပ်ဖို့:

```sql
ALTER TRIGGER emp_stamp ON emp DEPENDS ON EXTENSION emplib;
```

## Compatibility (လိုက်ဖက်ညီမှု)

`ALTER TRIGGER` က SQL standard ရဲ့ PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
