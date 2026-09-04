---
title: "LOAD (shared library file အား load လုပ်ခြင်း)"
description: "Shared library file (မျှဝေသုံးစွဲသည့် library file) တစ်ခုကို PostgreSQL server ၏ address space ထဲသို့ load လုပ်ပေးသည့် command — library search path ဖြင့် file ရှာဖွေပုံနှင့် superuser မဟုတ်သူများအတွက် $libdir/plugins/ ကန့်သတ်ချက်များ ပါဝင်သည်"
order: 187
source: "https://www.postgresql.org/docs/current/sql-load.html"
status: translated
updated: 2026-09-04
---

## LOAD (shared library file အား load လုပ်ခြင်း)

LOAD — shared library file (မျှဝေသုံးစွဲသည့် library file) တစ်ခုကို server ရဲ့ address space ထဲကို load လုပ်ပေးပါတယ်

## Synopsis (syntax အကျဉ်းချုပ်)

```sql
LOAD 'filename'
```

## Description (အသေးစိတ် ဖော်ပြချက်)

ဒီ command က shared library file (မျှဝေသုံးစွဲသည့် library file) တစ်ခုကို PostgreSQL server ရဲ့ address space (လိပ်စာ နေရာလပ်) ထဲကို load လုပ်ပေးပါတယ်။ File ကို အရင်ကတည်းက load လုပ်ပြီးသား ဖြစ်နေရင်တော့ — ဒီ command က ဘာမှ လုပ်ဆောင်ပေးမှာ မဟုတ်ပါဘူး။ C functions တွေ ပါဝင်တဲ့ shared library files တွေကို — အဲဒီ functions တွေထဲက တစ်ခုခုကို ခေါ်လိုက်တိုင်း — အလိုအလျောက် load လုပ်ပါတယ်။ ဒါကြောင့် — functions အစုတစ်စုကို ပေးအပ်တာမျိုးထက် — “hooks” (ကြားဖြတ် ချိတ်ဆက်မှုများ) တွေကတစ်ဆင့် server ရဲ့ အပြုအမူကို ပြောင်းလဲပေးတဲ့ library တစ်ခုကို load လုပ်ဖို့အတွက်သာ — explicit `LOAD` (တိုက်ရိုက် LOAD) တစ်ခုကို ပုံမှန်အားဖြင့် လိုအပ်ပါတယ်။

Library file ရဲ့ နာမည်ကို ပုံမှန်အားဖြင့် — server ရဲ့ library search path (library ရှာဖွေရေး လမ်းကြောင်း) ထဲမှာ ရှာဖွေပေးမယ့် — bare file name (ရိုးရိုး file နာမည်) တစ်ခုအနေနဲ့သာ ပေးလေ့ ရှိပါတယ် ([dynamic_library_path](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-DYNAMIC-LIBRARY-PATH) က အဲဒီ search path ကို သတ်မှတ်ပေးပါတယ်)။ တနည်းအားဖြင့် — full path name (လမ်းကြောင်း အပြည့်အစုံ နာမည်) တစ်ခုအနေနဲ့လည်း ပေးနိုင်ပါတယ်။ ကိစ္စ နှစ်မျိုးလုံးမှာ — platform ရဲ့ standard shared library file name extension (ဖိုင် extension) ကို ချန်လှပ်ထားလို့ ရပါတယ်။ ဒီအကြောင်းအရာအပေါ် နောက်ထပ် အချက်အလက်တွေအတွက် [အပိုင်း 36.10.1](https://www.postgresql.org/docs/current/xfunc-c.html#XFUNC-C-DYNLOAD) ကို ကြည့်ပါ။

Superuser မဟုတ်တဲ့သူတွေက `LOAD` ကို — `$libdir/plugins/` ထဲမှာ တည်ရှိတဲ့ library files တွေအတွက်သာ အသုံးပြုနိုင်ပါတယ် — သတ်မှတ်လိုက်တဲ့ `filename` က အဲဒီ string (စာသားစု) နဲ့ပဲ အတိအကျ စတင်နေရပါမယ်။ (အဲဒီနေရာမှာ “safe” (လုံခြုံသော) libraries တွေကိုသာ တပ်ဆင်ထားဖို့ သေချာစေရတာက — database administrator ရဲ့ တာဝန် ဖြစ်ပါတယ်။)

## Compatibility (လိုက်ဖက်ညီမှု)

`LOAD` က PostgreSQL extension တစ်ခု ဖြစ်ပါတယ်။

## See Also (ဆက်စပ်ကြည့်ရှုရန်)

[CREATE FUNCTION](https://www.postgresql.org/docs/current/sql-createfunction.html)
