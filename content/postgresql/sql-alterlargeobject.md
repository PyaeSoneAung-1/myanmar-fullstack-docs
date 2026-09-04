---
title: "ALTER LARGE OBJECT (large object တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)"
description: "Large object (ကြီးမားသော object) တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း — လက်ရှိတွင် ပိုင်ရှင်အသစ် သတ်မှတ်ခြင်း (OWNER TO) ကိုသာ ထောက်ပံ့ပေးသော command"
order: 256
source: "https://www.postgresql.org/docs/current/sql-alterlargeobject.html"
status: translated
updated: 2026-09-04
---

## ALTER LARGE OBJECT (large object တစ်ခုရဲ့ definition ကို ပြောင်းလဲခြင်း)

ALTER LARGE OBJECT — large object တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
ALTER LARGE OBJECT large_object_oid OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`ALTER LARGE OBJECT` က large object တစ်ခုရဲ့ definition ကို ပြောင်းလဲပေးပါတယ်။

`ALTER LARGE OBJECT` ကို သုံးဖို့ — large object ကို သင်ကိုယ်တိုင် ပိုင်ဆိုင်ရပါမယ်။ Owner ကို ပြောင်းလဲဖို့ — ပိုင်ရှင်အသစ် ဖြစ်မယ့် role ဆီ `SET ROLE` လုပ်နိုင်စွမ်းလည်း ရှိရပါမယ်။ (ဒါပေမယ့် — superuser တစ်ယောက်ကတော့ ဘယ် large object ကိုမဆို ပြောင်းလဲနိုင်ပါတယ်။) လက်ရှိမှာ လုပ်ဆောင်နိုင်တဲ့ လုပ်ဆောင်ချက်က — ပိုင်ရှင်အသစ် သတ်မှတ်ပေးခြင်းပဲ ဖြစ်လို့ — ကန့်သတ်ချက် နှစ်ခုစလုံးက အမြဲ သက်ရောက်ပါတယ်။

## Parameters (parameter များ)

- **large_object_oid** — ပြောင်းလဲရမယ့် large object ရဲ့ OID
- **new_owner** — Large object ရဲ့ ပိုင်ရှင် အသစ်

## Compatibility (လိုက်ဖက်ညီမှု)

SQL standard ထဲမှာ `ALTER LARGE OBJECT` statement ဆိုတာ မရှိပါဘူး။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[အခန်း 33](https://www.postgresql.org/docs/current/largeobjects.html)
