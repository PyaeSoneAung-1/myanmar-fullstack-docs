---
title: "Pseudo-Types (pseudo-type များ)"
description: "Pseudo-type များ — anyelement/anyarray/void/record စသည့် pseudo-type တို့ကို function ၏ argument/return type အဖြစ် သုံးခြင်း"
order: 67
source: "https://www.postgresql.org/docs/current/datatype-pseudo.html"
status: translated
updated: 2026-09-03
---

## 8.21. Pseudo-Types (pseudo-type များ)

PostgreSQL ရဲ့ type system ထဲမှာ — စုပေါင်းပြီး *pseudo-types* လို့ ခေါ်တဲ့ — အထူးရည်ရွယ်ချက် (special-purpose) entry တွေ အများအပြား ပါဝင်ပါတယ်။ Pseudo-type တစ်ခုကို column data type အဖြစ်တော့ သုံးလို့ မရပေမယ့် — function တစ်ခုရဲ့ argument သို့မဟုတ် result type ကို ကြေညာရာမှာတော့ သုံးနိုင်ပါတယ်။ ရနိုင်တဲ့ pseudo-type တစ်ခုချင်းစီက — function တစ်ခုရဲ့ အပြုအမူ (behavior) က သီးခြား SQL data type တစ်ခုရဲ့ တန်ဖိုးကို ရိုးရိုး လက်ခံခြင်း သို့မဟုတ် ပြန်ပေးခြင်းနဲ့ မကိုက်ညီတဲ့ အခြေအနေတွေမှာ — အသုံးဝင်ပါတယ်။ ရှိပြီးသား pseudo-type တွေကို [ဇယား 8.27](/docs/postgresql/datatype-pseudo) မှာ စာရင်းပြထားပါတယ်။

**ဇယား 8.27. Pseudo-Types (pseudo-type များ)**

| နာမည် | ဖော်ပြချက် |
| --- | --- |
| `any` | Function တစ်ခုက မည်သည့် input data type ကိုမဆို လက်ခံကြောင်း ဖော်ပြပါတယ်။ |
| `anyelement` | Function တစ်ခုက မည်သည့် data type ကိုမဆို လက်ခံကြောင်း ဖော်ပြပါတယ် ([အပိုင်း 36.2.5](https://www.postgresql.org/docs/current/extend-type-system.html#EXTEND-TYPES-POLYMORPHIC) ကို ကြည့်ပါ)။ |
| `anyarray` | Function တစ်ခုက မည်သည့် array data type ကိုမဆို လက်ခံကြောင်း ဖော်ပြပါတယ် ([အပိုင်း 36.2.5](https://www.postgresql.org/docs/current/extend-type-system.html#EXTEND-TYPES-POLYMORPHIC) ကို ကြည့်ပါ)။ |
| `anynonarray` | Function တစ်ခုက array မဟုတ်သော မည်သည့် data type ကိုမဆို လက်ခံကြောင်း ဖော်ပြပါတယ် ([အပိုင်း 36.2.5](https://www.postgresql.org/docs/current/extend-type-system.html#EXTEND-TYPES-POLYMORPHIC) ကို ကြည့်ပါ)။ |
| `anyenum` | Function တစ်ခုက မည်သည့် enum data type ကိုမဆို လက်ခံကြောင်း ဖော်ပြပါတယ် ([အပိုင်း 36.2.5](https://www.postgresql.org/docs/current/extend-type-system.html#EXTEND-TYPES-POLYMORPHIC) နဲ့ [အပိုင်း 8.7](/docs/postgresql/datatype-enum) တို့ကို ကြည့်ပါ)။ |
| `anyrange` | Function တစ်ခုက မည်သည့် range data type ကိုမဆို လက်ခံကြောင်း ဖော်ပြပါတယ် ([အပိုင်း 36.2.5](https://www.postgresql.org/docs/current/extend-type-system.html#EXTEND-TYPES-POLYMORPHIC) နဲ့ [အပိုင်း 8.17](/docs/postgresql/rangetypes) တို့ကို ကြည့်ပါ)။ |
| `anymultirange` | Function တစ်ခုက မည်သည့် multirange data type ကိုမဆို လက်ခံကြောင်း ဖော်ပြပါတယ် ([အပိုင်း 36.2.5](https://www.postgresql.org/docs/current/extend-type-system.html#EXTEND-TYPES-POLYMORPHIC) နဲ့ [အပိုင်း 8.17](/docs/postgresql/rangetypes) တို့ကို ကြည့်ပါ)။ |
| `anycompatible` | Function တစ်ခုက မည်သည့် data type ကိုမဆို လက်ခံကြောင်း — argument အများအပြားကို common data type (တူညီသော data type) တစ်ခုအဖြစ် အလိုအလျောက် မြှင့်တင်ပေးခြင်း (automatic promotion) နဲ့အတူ — ဖော်ပြပါတယ် ([အပိုင်း 36.2.5](https://www.postgresql.org/docs/current/extend-type-system.html#EXTEND-TYPES-POLYMORPHIC) ကို ကြည့်ပါ)။ |
| `anycompatiblearray` | Function တစ်ခုက မည်သည့် array data type ကိုမဆို လက်ခံကြောင်း — argument အများအပြားကို common data type (တူညီသော data type) တစ်ခုအဖြစ် အလိုအလျောက် မြှင့်တင်ပေးခြင်း (automatic promotion) နဲ့အတူ — ဖော်ပြပါတယ် ([အပိုင်း 36.2.5](https://www.postgresql.org/docs/current/extend-type-system.html#EXTEND-TYPES-POLYMORPHIC) ကို ကြည့်ပါ)။ |
| `anycompatiblenonarray` | Function တစ်ခုက array မဟုတ်သော မည်သည့် data type ကိုမဆို လက်ခံကြောင်း — argument အများအပြားကို common data type (တူညီသော data type) တစ်ခုအဖြစ် အလိုအလျောက် မြှင့်တင်ပေးခြင်း (automatic promotion) နဲ့အတူ — ဖော်ပြပါတယ် ([အပိုင်း 36.2.5](https://www.postgresql.org/docs/current/extend-type-system.html#EXTEND-TYPES-POLYMORPHIC) ကို ကြည့်ပါ)။ |
| `anycompatiblerange` | Function တစ်ခုက မည်သည့် range data type ကိုမဆို လက်ခံကြောင်း — argument အများအပြားကို common data type (တူညီသော data type) တစ်ခုအဖြစ် အလိုအလျောက် မြှင့်တင်ပေးခြင်း (automatic promotion) နဲ့အတူ — ဖော်ပြပါတယ် ([အပိုင်း 36.2.5](https://www.postgresql.org/docs/current/extend-type-system.html#EXTEND-TYPES-POLYMORPHIC) နဲ့ [အပိုင်း 8.17](/docs/postgresql/rangetypes) တို့ကို ကြည့်ပါ)။ |
| `anycompatiblemultirange` | Function တစ်ခုက မည်သည့် multirange data type ကိုမဆို လက်ခံကြောင်း — argument အများအပြားကို common data type (တူညီသော data type) တစ်ခုအဖြစ် အလိုအလျောက် မြှင့်တင်ပေးခြင်း (automatic promotion) နဲ့အတူ — ဖော်ပြပါတယ် ([အပိုင်း 36.2.5](https://www.postgresql.org/docs/current/extend-type-system.html#EXTEND-TYPES-POLYMORPHIC) နဲ့ [အပိုင်း 8.17](/docs/postgresql/rangetypes) တို့ကို ကြည့်ပါ)။ |
| `cstring` | Function တစ်ခုက null-terminated C string တစ်ခုကို လက်ခံခြင်း သို့မဟုတ် ပြန်ပေးခြင်း ဖြစ်ကြောင်း ဖော်ပြပါတယ်။ |
| `internal` | Function တစ်ခုက server-internal (server အတွင်းပိုင်း) data type တစ်ခုကို လက်ခံခြင်း သို့မဟုတ် ပြန်ပေးခြင်း ဖြစ်ကြောင်း ဖော်ပြပါတယ်။ |
| `language_handler` | Procedural language call handler (ခေါ်ယူမှု ကိုင်တွယ်သူ) တစ်ခုကို `language_handler` ပြန်ပို့ရန် ကြေညာပါတယ်။ |
| `fdw_handler` | Foreign-data wrapper handler တစ်ခုကို `fdw_handler` ပြန်ပို့ရန် ကြေညာပါတယ်။ |
| `table_am_handler` | Table access method handler တစ်ခုကို `table_am_handler` ပြန်ပို့ရန် ကြေညာပါတယ်။ |
| `index_am_handler` | Index access method handler တစ်ခုကို `index_am_handler` ပြန်ပို့ရန် ကြေညာပါတယ်။ |
| `tsm_handler` | Tablesample method handler တစ်ခုကို `tsm_handler` ပြန်ပို့ရန် ကြေညာပါတယ်။ |
| `record` | Function တစ်ခုက သတ်မှတ်မထားသော (unspecified) row type တစ်ခုကို လက်ခံခြင်း သို့မဟုတ် ပြန်ပေးခြင်း ဖြစ်ကြောင်း ခွဲခြား ဖော်ပြပါတယ်။ |
| `trigger` | Trigger function တစ်ခုကို `trigger.` ပြန်ပို့ရန် ကြေညာပါတယ်။ |
| `event_trigger` | Event trigger function တစ်ခုကို `event_trigger.` ပြန်ပို့ရန် ကြေညာပါတယ်။ |
| `pg_ddl_command` | Event trigger တွေ သုံးနိုင်တဲ့ DDL command တွေရဲ့ ကိုယ်စားပြုမှု (representation) တစ်ခုကို ခွဲခြား ဖော်ပြပါတယ်။ |
| `void` | Function တစ်ခုက တန်ဖိုး တစ်ခုမျှ ပြန်မပို့ကြောင်း ဖော်ပြပါတယ်။ |
| `unknown` | ဖြေရှင်းပြီးသား မဟုတ်သေးတဲ့ (not-yet-resolved) type တစ်ခုကို ခွဲခြား ဖော်ပြပါတယ် — ဥပမာ type မဖော်ပြထားတဲ့ (undecorated) string literal တစ်ခုရဲ့ type မျိုး။ |

C နဲ့ ရေးထားတဲ့ function တွေ (built-in ဖြစ်စေ၊ dynamically loaded (လိုအပ်မှ ထည့်သွင်း တင်ဆောင်) ဖြစ်စေ) ကို ဒီ pseudo-type တွေထဲက ဘယ်ဟာကိုမဆို လက်ခံရန် သို့မဟုတ် ပြန်ပို့ရန် ကြေညာလို့ ရပါတယ်။ Pseudo-type တစ်ခုကို argument type အဖြစ် သုံးတဲ့အခါ function က ဘေးကင်းစွာ (safely) အလုပ်လုပ်နိုင်ဖို့ကတော့ function ရေးသားသူ (author) ရဲ့ တာဝန်ပဲ ဖြစ်ပါတယ်။

Procedural language တွေနဲ့ ရေးထားတဲ့ function တွေကတော့ — သူတို့ရဲ့ implementation language တွေက ခွင့်ပြုသလောက်ပဲ pseudo-type တွေကို သုံးနိုင်ပါတယ်။ လောလောဆယ် procedural language အများစုက pseudo-type တစ်ခုကို argument type အဖြစ် သုံးတာကို တားမြစ်ပြီး — result type အဖြစ်တော့ `void` နဲ့ `record` ကိုပဲ ခွင့်ပြုပါတယ် (function ကို trigger သို့မဟုတ် event trigger အဖြစ် သုံးတဲ့အခါမှာတော့ `trigger` သို့မဟုတ် `event_trigger` ကိုလည်း ထပ်ဆင့် ခွင့်ပြုပါတယ်)။ တချို့ language တွေကတော့ — အပေါ်မှာ ပြထားပြီး [အပိုင်း 36.2.5](https://www.postgresql.org/docs/current/extend-type-system.html#EXTEND-TYPES-POLYMORPHIC) မှာ အသေးစိတ် ဆွေးနွေးထားတဲ့ — polymorphic pseudo-type တွေကို သုံးတဲ့ polymorphic function တွေကိုလည်း ထောက်ပံ့ပါတယ်။

`internal` pseudo-type ကို — database system က အတွင်းပိုင်းကပဲ ခေါ်ယူဖို့ ရည်ရွယ်ပြီး — SQL query တစ်ခုထဲမှာ တိုက်ရိုက် ခေါ်ယူဖို့ မဟုတ်တဲ့ — function တွေကို ကြေညာရာမှာ သုံးပါတယ်။ Function တစ်ခုမှာ `internal` type argument အနည်းဆုံး တစ်ခု ပါနေရင် — အဲဒီ function ကို SQL ကနေ ခေါ်ယူလို့ မရပါဘူး။ ဒီကန့်သတ်ချက်ရဲ့ type safety (type ဘေးကင်းမှု) ကို ထိန်းသိမ်းဖို့ — ဒီ coding စည်းမျဉ်းကို လိုက်နာဖို့ အရေးကြီးပါတယ်: `internal` argument အနည်းဆုံး တစ်ခု မပါဝင်ဘဲ — `internal` ပြန်ပို့ရန် ကြေညာထားတဲ့ function တစ်ခုခုကို ဘယ်တော့မှ မဖန်တီးပါနဲ့။
