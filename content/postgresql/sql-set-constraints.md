---
title: "SET CONSTRAINTS (constraint check ပြုလုပ်မည့် အချိန်ကို သတ်မှတ်ခြင်း)"
description: "လက်ရှိ transaction အတွင်း constraint checking (constraint စစ်ဆေးခြင်း) ပြုလုပ်သည့် အချိန်ကို သတ်မှတ်ပေးတဲ့ command — IMMEDIATE နဲ့ DEFERRED modes ၊ DEFERRABLE INITIALLY DEFERRED/INITIALLY IMMEDIATE နဲ့ NOT DEFERRABLE စတဲ့ constraint လက္ခဏာများ နဲ့ UNIQUE/PRIMARY KEY/REFERENCES/EXCLUDE constraints တွေအပေါ် သက်ရောက်ပုံ အကြောင်း"
order: 209
source: "https://www.postgresql.org/docs/current/sql-set-constraints.html"
status: translated
updated: 2026-09-04
---

## SET CONSTRAINTS (constraint check ပြုလုပ်မည့် အချိန်ကို သတ်မှတ်ခြင်း)

SET CONSTRAINTS — လက်ရှိ transaction အတွက် constraint check ပြုလုပ်သည့် အချိန်ကို သတ်မှတ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
SET CONSTRAINTS { ALL | name [, ...] } { DEFERRED | IMMEDIATE }
```

## Description (အသေးစိတ် ဖော်ပြချက်)

`SET CONSTRAINTS` က လက်ရှိ transaction အတွင်းက constraint checking (constraint စစ်ဆေးခြင်း) ရဲ့ အပြုအမူကို သတ်မှတ်ပေးပါတယ်။ `IMMEDIATE` constraints တွေကို statement တစ်ခုစီရဲ့ အဆုံးမှာ စစ်ဆေးပါတယ်။ `DEFERRED` constraints တွေကိုတော့ transaction commit လုပ်တဲ့အထိ မစစ်ဆေးပါဘူး။ Constraint တစ်ခုချင်းစီမှာ ကိုယ်ပိုင် `IMMEDIATE` ဒါမှမဟုတ် `DEFERRED` mode တစ်ခု ရှိပါတယ်။

ဖန်တီးလိုက်တဲ့အခါ — constraint တစ်ခုကို လက္ခဏာ သုံးမျိုးထဲက တစ်မျိုးနဲ့ ပေးအပ်ပါတယ်: `DEFERRABLE INITIALLY DEFERRED` ၊ `DEFERRABLE INITIALLY IMMEDIATE` ဒါမှမဟုတ် `NOT DEFERRABLE` ဆိုပြီးပါ။ တတိယ အမျိုးအစားက အမြဲတမ်း `IMMEDIATE` ဖြစ်ပြီး — `SET CONSTRAINTS` command ရဲ့ သက်ရောက်မှု မခံရပါဘူး။ ပထမ အမျိုးအစား နှစ်ခုကတော့ — transaction တိုင်းကို ညွှန်ပြထားတဲ့ mode နဲ့ စတင်စေပေမယ့် — သူတို့ရဲ့ အပြုအမူကို transaction တစ်ခုအတွင်းမှာ `SET CONSTRAINTS` နဲ့ ပြောင်းလဲလို့ ရပါတယ်။

Constraint names တွေရဲ့ စာရင်းတစ်ခုနဲ့အတူ `SET CONSTRAINTS` က — အဲဒီ constraints တွေရဲ့ mode ကိုပဲ ပြောင်းလဲပေးပါတယ် (အဲဒီ constraints တွေ အားလုံး deferrable ဖြစ်ရပါမယ်)။ Constraint name တစ်ခုချင်းစီကို schema-qualified (schema name နဲ့ ရှေ့ဆွဲထားတဲ့ ပုံစံ) အနေနဲ့ ရေးလို့ ရပါတယ်။ Schema name ကို မသတ်မှတ်ထားရင် — လက်ရှိ schema search path ကို သုံးပြီး — ပထမဆုံး ကိုက်ညီတဲ့ name ကို ရှာဖွေပါတယ်။ `SET CONSTRAINTS ALL` ကတော့ deferrable constraints တွေ အားလုံးရဲ့ mode ကို ပြောင်းလဲပေးပါတယ်။

`SET CONSTRAINTS` က constraint တစ်ခုရဲ့ mode ကို `DEFERRED` ကနေ `IMMEDIATE` ဆီ ပြောင်းလဲတဲ့အခါ — mode အသစ်က နောက်ကြောင်းပြန် အကျိုးသက်ရောက်ပါတယ်: transaction ရဲ့ အဆုံးမှာ စစ်ဆေးရမယ့် ကျန်ရှိနေတဲ့ (outstanding) data modifications တွေကို — အဲဒီအစား — `SET CONSTRAINTS` command ကို execute လုပ်နေစဉ်အတွင်းမှာ စစ်ဆေးပါတယ်။ အဲဒီလို constraint တစ်ခုခုကို ချိုးဖောက်နေရင် — `SET CONSTRAINTS` က မအောင်မြင်ပါဘူး (ပြီးတော့ constraint ရဲ့ mode ကိုလည်း မပြောင်းပါဘူး)။ ဒါကြောင့် — `SET CONSTRAINTS` ကို — transaction တစ်ခုရဲ့ သတ်မှတ်ထားတဲ့ နေရာတစ်ခုမှာ constraints တွေကို အတင်းအကျပ် စစ်ဆေးစေဖို့ သုံးနိုင်ပါတယ်။

လက်ရှိမှာတော့ — `UNIQUE`, `PRIMARY KEY`, `REFERENCES` (foreign key) နဲ့ `EXCLUDE` constraints တွေကိုပဲ ဒီ setting က သက်ရောက်မှု ရှိပါတယ်။ `NOT NULL` နဲ့ `CHECK` constraints တွေကိုတော့ — row တစ်ခုကို insert ဒါမှမဟုတ် modify လုပ်လိုက်တဲ့အခါ — (statement ရဲ့ အဆုံးမှာ မဟုတ်ဘဲ) အမြဲတမ်း ချက်ချင်း စစ်ဆေးပါတယ်။ `DEFERRABLE` အဖြစ် ကြေညာမထားတဲ့ uniqueness နဲ့ exclusion constraints တွေကိုလည်း ချက်ချင်း စစ်ဆေးပါတယ်။

“Constraint triggers” အဖြစ် ကြေညာထားတဲ့ triggers တွေ fire (ပစ်ခတ်) လုပ်တာကိုလည်း ဒီ setting က ထိန်းချုပ်ပါတယ် — ဆက်စပ်နေတဲ့ constraint ကို စစ်ဆေးရမယ့် အချိန်မှာပဲ သူတို့က fire လုပ်ပါတယ်။

## Notes (မှတ်စုများ)

PostgreSQL က constraint names တွေကို schema တစ်ခုအတွင်းမှာ unique (ထူးခြား) ဖြစ်ဖို့ မလိုအပ်ဘဲ (table တစ်ခုချင်းစီအတွက်သာ လိုအပ်) ခွင့်ပြုထားတာမို့ — သတ်မှတ်ထားတဲ့ constraint name တစ်ခုအတွက် — ကိုက်ညီမှု တစ်ခုထက်ပို ရှိနိုင်ပါတယ်။ ဒီလိုအခြေအနေမျိုးမှာ `SET CONSTRAINTS` က ကိုက်ညီမှုတွေ အားလုံးအပေါ် သက်ရောက်ပါလိမ့်မယ်။ Schema-qualified မဟုတ်တဲ့ name တစ်ခုအတွက် — search path ထဲက schema တစ်ခုခုမှာ ကိုက်ညီမှု တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပို တွေ့ပြီးတာနဲ့ — path ထဲမှာ နောက်ပိုင်းမှ ပါလာတဲ့ schemas တွေကို ဆက်ပြီး ရှာဖွေတော့မှာ မဟုတ်ပါဘူး။

ဒီ command က လက်ရှိ transaction အတွင်းက constraints တွေရဲ့ အပြုအမူကိုပဲ ပြောင်းလဲပေးပါတယ်။ Transaction block အပြင်မှာ ဒါကို ထုတ်ပေးရင် — warning တစ်ခု ထုတ်လွှတ်ပြီး — တခြား ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

## Compatibility (လိုက်ဖက်ညီမှု)

ဒီ command က — PostgreSQL မှာ `NOT NULL` နဲ့ `CHECK` constraints တွေကို သက်ရောက်မှု မရှိတဲ့ ကန့်သတ်ချက်ကလွဲလို့ — SQL standard မှာ သတ်မှတ်ထားတဲ့ အပြုအမူနဲ့ ကိုက်ညီပါတယ်။ ဒါ့အပြင် — PostgreSQL က non-deferrable uniqueness constraints တွေကို — standard က အကြံပြုထားသလို statement ရဲ့ အဆုံးမှာ မဟုတ်ဘဲ — ချက်ချင်း စစ်ဆေးပါတယ်။
