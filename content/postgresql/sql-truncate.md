---
title: "TRUNCATE (table တစ်ခု သို့မဟုတ် အများအပြားကို အမြန် ရှင်းလင်းခြင်း)"
description: "Table တစ်ခု သို့မဟုတ် အများအပြားထဲက rows အားလုံးကို အမြန် ရှင်းလင်းပေးတဲ့ TRUNCATE command အကြောင်း — syntax နှင့် parameters (RESTART IDENTITY, CONTINUE IDENTITY, CASCADE, RESTRICT စသည်)၊ triggers / MVCC / transaction ဆိုင်ရာ မှတ်စုများ နှင့် ဥပမာများ"
order: 155
source: "https://www.postgresql.org/docs/current/sql-truncate.html"
status: translated
updated: 2026-09-04
---

## TRUNCATE (table တစ်ခု သို့မဟုတ် အများအပြားကို အမြန် ရှင်းလင်းခြင်း)

TRUNCATE — table တစ်ခု သို့မဟုတ် table အစုတစ်စုကို ဗလာ ဖြစ်စေပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
TRUNCATE [ TABLE ] [ ONLY ] name [ * ] [, ... ]
    [ RESTART IDENTITY | CONTINUE IDENTITY ] [ CASCADE | RESTRICT ]
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`TRUNCATE` က table အစုတစ်စုထဲက rows တွေ အားလုံးကို အမြန် ဖယ်ရှားပေးပါတယ်။ Table တစ်ခုချင်းစီပေါ်မှာ qualify မလုပ်တဲ့ (unqualified) `DELETE` တစ်ခုနဲ့ ရလဒ် အတူတူပဲ ဖြစ်ပေမယ့် — tables တွေကို တကယ် scan မလုပ်တာကြောင့် — ပိုမြန်ပါတယ်။ ထို့အပြင် — နောက်ပိုင်းမှာ `VACUUM` operation တစ်ခု လိုအပ်စေမယ့်အစား — disk space ကို ချက်ချင်း ပြန်လည် ရယူပေးပါတယ်။ ဒါက table ကြီးတွေမှာ အသုံးဝင်ဆုံး ဖြစ်ပါတယ်။

## Parameters (parameter များ)

- **name** — Truncate လုပ်ရမယ့် table ရဲ့ နာမည် (optional အနေနဲ့ schema-qualified လုပ်ထားနိုင်ပါတယ်)။ `ONLY` ကို table နာမည် ရှေ့မှာ သတ်မှတ်ထားရင် — အဲဒီ table ကိုပဲ truncate လုပ်ပါတယ်။ `ONLY` ကို မသတ်မှတ်ရင် — table နဲ့ ၎င်းရဲ့ descendant tables တွေ အားလုံး (ရှိရင်) ကို truncate လုပ်ပါတယ်။ Optional အနေနဲ့ — table နာမည် နောက်မှာ `*` ကို သတ်မှတ်ပြီး — descendant tables တွေလည်း ပါဝင်တယ်ဆိုတာကို ရှင်းရှင်းလင်းလင်း ဖော်ပြနိုင်ပါတယ်။
- **RESTART IDENTITY** — Truncate လုပ်လိုက်တဲ့ table(s) တွေရဲ့ columns တွေက ပိုင်ဆိုင်တဲ့ sequences တွေကို အလိုအလျောက် ပြန်စ (restart) စေပါတယ်။
- **CONTINUE IDENTITY** — Sequences တွေရဲ့ တန်ဖိုးတွေကို မပြောင်းလဲစေပါဘူး။ ဒါက default ဖြစ်ပါတယ်။
- **CASCADE** — ဖော်ပြထားတဲ့ tables တွေထဲက တစ်ခုခုကို ဒါမှမဟုတ် CASCADE ကြောင့် group ထဲကို ထည့်လိုက်တဲ့ tables တွေကို — foreign-key references တွေနဲ့ ရည်ညွှန်းထားတဲ့ tables တွေ အားလုံးကို အလိုအလျောက် truncate လုပ်ပါတယ်။
- **RESTRICT** — သတ်မှတ်ထားတဲ့ tables တွေထဲက တစ်ခုခုကို — command ထဲမှာ စာရင်းမပါတဲ့ tables တွေဆီကနေ foreign-key references တွေ ရှိနေရင် — truncate လုပ်ဖို့ ငြင်းပယ်ပါတယ်။ ဒါက default ဖြစ်ပါတယ်။

## Notes (မှတ်စုများ)

Table တစ်ခုကို truncate လုပ်ဖို့ — အဲဒီ table ပေါ်မှာ `TRUNCATE` privilege ရှိရပါမယ်။

`TRUNCATE` က ၎င်း လုပ်ဆောင်တဲ့ table တစ်ခုချင်းစီပေါ်မှာ `ACCESS EXCLUSIVE` lock တစ်ခုကို ရယူပြီး — table ပေါ်က တစ်ပြိုင်နက် (concurrent) operation တွေ အားလုံးကို ပိတ်ဆို့လိုက်ပါတယ်။ `RESTART IDENTITY` ကို သတ်မှတ်ထားတဲ့အခါ — restart လုပ်ရမယ့် sequences တွေကိုလည်း အလားတူ exclusive ပုံစံနဲ့ lock လုပ်ပါတယ်။ Table တစ်ခုကို တစ်ပြိုင်နက် ဝင်ရောက်မှု (concurrent access) လိုအပ်ရင် — `DELETE` command ကို အဲဒီအစား သုံးသင့်ပါတယ်။

`TRUNCATE` ကို — တခြား tables တွေဆီက foreign-key references တွေ ရှိနေတဲ့ table တစ်ခုပေါ်မှာ — အဲဒီ tables တွေ အားလုံးကိုပါ command တစ်ခုထဲမှာ truncate လုပ်မှသာ လွဲပြီး — သုံးလို့ မရပါဘူး။ ဒီလို ကိစ္စမျိုးမှာ တရားဝင်မှု စစ်ဆေးဖို့ဆိုရင် table scans တွေ လိုအပ်မှာ ဖြစ်ပြီး — ဒီ command ရဲ့ ရည်ရွယ်ချက် တစ်ခုလုံးကပဲ scan တစ်ခု မလုပ်ရဖို့ ဖြစ်ပါတယ်။ `CASCADE` option ကို သုံးပြီး — dependent tables တွေ အားလုံးကို အလိုအလျောက် ထည့်သွင်းနိုင်ပါတယ် — ဒါပေမယ့် — ဒီ option ကို သုံးတဲ့အခါ အရမ်း သတိထားပါ — မဟုတ်ရင် သင်ရည်ရွယ်ထားတာ မဟုတ်တဲ့ data တွေ ဆုံးရှုံးသွားနိုင်ပါတယ်! အထူးသဖြင့် သတိပြုရမှာက — truncate လုပ်ရမယ့် table က partition တစ်ခု ဆိုရင် — sibling (မောင်နှမ) partitions တွေကို မထိဘဲ ထားပေမယ့် — cascading ကတော့ — referencing tables တွေ အားလုံးနဲ့ သူတို့ရဲ့ partitions တွေ အားလုံးဆီကို ခွဲခြားမှု မရှိဘဲ သက်ရောက်သွားပါတယ်။

`TRUNCATE` က tables တွေအတွက် ရှိနေနိုင်တဲ့ `ON DELETE` triggers တွေကို fire လုပ်မှာ မဟုတ်ပါဘူး။ ဒါပေမယ့် `ON TRUNCATE` triggers တွေကိုတော့ fire လုပ်ပါလိမ့်မယ်။ Tables တစ်ခုခုအတွက် `ON TRUNCATE` triggers တွေ သတ်မှတ်ထားရင် — truncation တစ်ခုခု မဖြစ်ခင် `BEFORE TRUNCATE` triggers တွေ အားလုံး fire လုပ်ပြီး — နောက်ဆုံး truncation ကို လုပ်ဆောင်ပြီး sequences တွေ ပြန်စ (reset) ပြီးတဲ့ နောက်မှာ `AFTER TRUNCATE` triggers တွေ အားလုံး fire လုပ်ပါတယ်။ Triggers တွေက tables တွေကို လုပ်ဆောင်မယ့် အစဉ်အတိုင်း fire လုပ်ပါတယ် (ပထမ command ထဲမှာ စာရင်းပါတဲ့ဟာတွေ — ပြီးတော့မှ cascading ကြောင့် ထည့်လိုက်ရတဲ့ဟာတွေ)။

`TRUNCATE` က MVCC-safe မဟုတ်ပါဘူး။ Truncation ဖြစ်ပြီးနောက် — truncation မဖြစ်ခင် ရိုက်ထားတဲ့ snapshot တစ်ခုကို သုံးနေတဲ့ တစ်ပြိုင်နက် transactions တွေအတွက်တော့ — table က ဗလာ (empty) အနေနဲ့ ပေါ်နေပါလိမ့်မယ်။ အသေးစိတ်အတွက် [အပိုင်း 13.6](/docs/postgresql/mvcc-caveats) ကို ကြည့်ပါ။

`TRUNCATE` က tables တွေထဲက data တွေနဲ့ ပတ်သက်လို့ transaction-safe ဖြစ်ပါတယ်: ဝန်းရံထားတဲ့ transaction က commit မဖြစ်ဘူးဆိုရင် — truncation ကို ဘေးကင်းစွာ roll back လုပ်ပေးပါလိမ့်မယ်။

`RESTART IDENTITY` ကို သတ်မှတ်ထားတဲ့အခါ — ပါဝင်ပြီးသား (implied) `ALTER SEQUENCE RESTART` operations တွေကိုလည်း transaction ပုံစံနဲ့ပဲ လုပ်ဆောင်ပါတယ်; ဆိုလိုတာက — ဝန်းရံထားတဲ့ transaction က commit မဖြစ်ဘူးဆိုရင် — သူတို့ကိုလည်း roll back လုပ်ပါလိမ့်မယ်။ Transaction က roll back မဖြစ်ခင် — restart လုပ်ထားတဲ့ sequences တွေပေါ်မှာ ထပ်ဆောင်း sequence operations တွေ လုပ်ခဲ့ရင် — အဲဒီ operations တွေရဲ့ sequences တွေပေါ်က သက်ရောက်မှုတွေကို roll back လုပ်မှာ ဖြစ်ပေမယ့် — `currval()` အပေါ်က သက်ရောက်မှုတွေကိုတော့ roll back လုပ်မပေးဘူးဆိုတာ သတိပြုပါ; ဆိုလိုတာက — transaction ပြီးနောက်မှာ `currval()` က — sequence ကိုယ်တိုင် အဲဒီနဲ့ မကိုက်ညီတော့တာတောင် — မအောင်မြင်ခဲ့တဲ့ transaction ထဲမှာ ရယူခဲ့တဲ့ နောက်ဆုံး sequence တန်ဖိုးကို ဆက်ပြီး ထင်ဟပ်နေဦးမှာ ဖြစ်ပါတယ်။ ဒါက — မအောင်မြင်တဲ့ transaction တစ်ခု ပြီးနောက်မှာ `currval()` ရဲ့ ပုံမှန် အပြုအမူနဲ့ ဆင်တူပါတယ်။

`TRUNCATE` ကို — foreign data wrapper က ထောက်ပံ့မယ်ဆိုရင် — foreign tables တွေအတွက်လည်း သုံးနိုင်ပါတယ်; ဥပမာ — [postgres_fdw](https://www.postgresql.org/docs/current/postgres-fdw.html) ကို ကြည့်ပါ။

## Examples (ဥပမာများ)

`bigtable` နဲ့ `fattable` tables တွေကို truncate လုပ်ရန်:

```sql
TRUNCATE bigtable, fattable;
```

အပေါ်အတိုင်းပဲ — ဆက်စပ်နေတဲ့ sequence generators တွေကိုပါ ပြန်စ (reset) လုပ်ရန်:

```sql
TRUNCATE bigtable, fattable RESTART IDENTITY;
```

`othertable` table ကို truncate လုပ်ပြီး — foreign-key constraints တွေကနေ `othertable` ကို ရည်ညွှန်းတဲ့ tables တွေဆီ cascade လုပ်ရန်:

```sql
TRUNCATE othertable CASCADE;
```

## Compatibility (လိုက်ဖက်ညီမှု)

SQL:2008 standard မှာ `TRUNCATE TABLE tablename` ဆိုတဲ့ syntax နဲ့ `TRUNCATE` command တစ်ခု ပါဝင်ပါတယ်။ `CONTINUE IDENTITY`/`RESTART IDENTITY` clauses တွေကလည်း အဲဒီ standard ထဲမှာ ပါဝင်ပေမယ့် — ဆက်စပ်နေပြီး အနည်းငယ် ကွဲပြားတဲ့ အဓိပ္ပာယ်တွေ ရှိပါတယ်။ ဒီ command ရဲ့ တစ်ပြိုင်နက် လုပ်ဆောင်မှု (concurrency) အပြုအမူ အချို့ကို standard က implementation-defined (အကောင်အထည်ဖော်မှုအလိုက် သတ်မှတ်) အဖြစ် ချန်ထားလို့ — အပေါ်က မှတ်စုတွေကို ထည့်သွင်း စဉ်းစားပြီး — လိုအပ်ရင် တခြား implementations တွေနဲ့ နှိုင်းယှဉ်သင့်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[DELETE](/docs/postgresql/sql-delete)
