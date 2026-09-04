---
title: "Trigger Functions (trigger လုပ်ဆောင်ချက်များ)"
description: "PostgreSQL ၏ built-in trigger functions များ — suppress_redundant_updates_trigger (redundant update များကို ဖိနှိပ်ခြင်း)၊ tsvector_update_trigger နှင့် tsvector_update_trigger_column (tsvector column များကို အလိုအလျောက် update လုပ်ခြင်း)"
order: 96
source: "https://www.postgresql.org/docs/current/functions-trigger.html"
status: translated
updated: 2026-09-04
---

## 9.29. Trigger Functions (trigger လုပ်ဆောင်ချက်များ)

Triggers တွေရဲ့ အသုံးပြုမှု အများစုက user ကိုယ်တိုင် ရေးထားတဲ့ trigger functions တွေ ပါဝင်ပေမယ့် — PostgreSQL က user-defined triggers တွေထဲမှာ တိုက်ရိုက် သုံးလို့ရတဲ့ built-in trigger functions အနည်းငယ်ကိုလည်း ထောက်ပံ့ပေးပါတယ်။ ဒါတွေကို ဇယား 9.110 မှာ အကျဉ်းချုပ် ဖော်ပြထားပါတယ်။ (Foreign key constraints နဲ့ deferred index constraints တွေကို အကောင်အထည်ဖော်ပေးတဲ့ နောက်ထပ် built-in trigger functions တွေလည်း ရှိပါသေးတယ်။ ဒါတွေကို user တွေက တိုက်ရိုက် သုံးစရာ မလိုလို့ — ဒီနေရာမှာ မှတ်တမ်းတင်မထားပါဘူး။)

Triggers တွေ ဖန်တီးခြင်းအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် — [CREATE TRIGGER](https://www.postgresql.org/docs/current/sql-createtrigger.html) ကို ကြည့်ပါ။

**ဇယား 9.110. Built-In Trigger Functions (built-in trigger လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် ဥပမာ အသုံးပြုပုံ |
| --- |
| suppress_redundant_updates_trigger ( ) → trigger ဘာမှ မပြောင်းလဲတဲ့ (do-nothing) update operations တွေကို ဖိနှိပ် (suppress) ပေးပါတယ်။ အသေးစိတ်ကို အောက်မှာ ကြည့်ပါ။ CREATE TRIGGER ... suppress_redundant_updates_trigger() |
| tsvector_update_trigger ( ) → trigger ဆက်စပ်နေတဲ့ plain-text document column(s) တွေကနေ tsvector column တစ်ခုကို အလိုအလျောက် update လုပ်ပေးပါတယ်။ သုံးရမယ့် text search configuration ကို trigger argument တစ်ခုအနေနဲ့ နာမည် (name) နဲ့ သတ်မှတ်ပေးပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 12.4.3](/docs/postgresql/textsearch-features) ကို ကြည့်ပါ။ CREATE TRIGGER ... tsvector_update_trigger(tsvcol, 'pg_catalog.swedish', title, body) |
| tsvector_update_trigger_column ( ) → trigger ဆက်စပ်နေတဲ့ plain-text document column(s) တွေကနေ tsvector column တစ်ခုကို အလိုအလျောက် update လုပ်ပေးပါတယ်။ သုံးရမယ့် text search configuration ကို table ထဲက regconfig column တစ်ခုကနေ ယူပါတယ်။ အသေးစိတ်အတွက် [အပိုင်း 12.4.3](/docs/postgresql/textsearch-features) ကို ကြည့်ပါ။ CREATE TRIGGER ... tsvector_update_trigger_column(tsvcol, tsconfigcol, title, body) |

`suppress_redundant_updates_trigger` function ကို row-level `BEFORE UPDATE` trigger တစ်ခုအနေနဲ့ အသုံးချတဲ့အခါ — row ထဲက data ကို တကယ် မပြောင်းလဲတဲ့ update တစ်ခုခု ဖြစ်ပွားတာကို တားဆီးပေးပါလိမ့်မယ်။ ဒါက — data ပြောင်းလဲသည်ဖြစ်စေ မပြောင်းလဲသည်ဖြစ်စေ — physical row update ကို အမြဲတမ်း လုပ်ဆောင်ပေးတဲ့ ပုံမှန် အပြုအမူကို ကျော်လွန် (override) လုပ်ပါတယ်။ (ဒီ ပုံမှန် အပြုအမူက — စစ်ဆေးမှု (checking) မလိုလို့ — updates တွေကို ပိုမြန်အောင် လုပ်ပေးပြီး — အချို့ ကိစ္စတွေမှာလည်း အသုံးဝင်ပါတယ်။)

အကောင်းဆုံးကတော့ — record ထဲက data ကို တကယ် မပြောင်းလဲတဲ့ updates တွေ run လုပ်တာကို ရှောင်သင့်ပါတယ်။ Redundant updates တွေက — အထူးသဖြင့် ပြုပြင်ရမယ့် indexes အများကြီး ရှိနေရင် — မလိုအပ်တဲ့ အချိန် အတော်များများ ကုန်ကျစေနိုင်ပြီး — နောက်ဆုံးမှာ vacuum လုပ်ရမယ့် dead rows တွေထဲမှာ နေရာ (space) တွေလည်း နေရာယူထားပါတယ်။ ဒါပေမယ့် — ဒီလို အခြေအနေတွေကို client code ထဲမှာ ထောက်လှမ်းတာက အမြဲတမ်း မလွယ်ကူပါဘူး — တစ်ခါတစ်ရံ မဖြစ်နိုင်တာတောင် ရှိပြီး — ထောက်လှမ်းဖို့ expressions တွေ ရေးတာကလည်း error ဖြစ်နိုင်ခြေ (error-prone) များပါတယ်။ အခြားရွေးချယ်စရာကတော့ — data မပြောင်းလဲတဲ့ updates တွေကို ကျော်သွားပေးမယ့် `suppress_redundant_updates_trigger` ကို သုံးတာပါ။ ဒါပေမယ့် ဒါကို သတိထားပြီးတော့ သုံးသင့်ပါတယ်။ Trigger က record တစ်ခုချင်းစီအတွက် သေးငယ်ပေမယ့် လုံးဝ မပေါ့ဆနိုင်တဲ့ အချိန် (small but non-trivial time) တစ်ခု ယူပါတယ် — ဒါကြောင့် updates တွေရဲ့ သက်ရောက်မှု ခံရတဲ့ records အများစုက တကယ် ပြောင်းလဲနေတယ်ဆိုရင် — ဒီ trigger ကို သုံးတာက updates တွေကို ပျမ်းမျှအားဖြင့် ပိုနှေးစေပါလိမ့်မယ်။

`suppress_redundant_updates_trigger` function ကို table တစ်ခုထဲ ဒီလိုမျိုး ထည့်နိုင်ပါတယ်:

```sql
CREATE TRIGGER z_min_update
BEFORE UPDATE ON tablename
FOR EACH ROW EXECUTE FUNCTION suppress_redundant_updates_trigger();
```

အများစုသော ကိစ္စတွေမှာ — ဒီ trigger က row ကို ပြုပြင်ချင်နိုင်တဲ့ (alter) တခြား triggers တွေရဲ့ အပေါ်မှာ override မလုပ်မိစေဖို့ — ဒီ trigger ကို row တစ်ခုချင်းစီအတွက် နောက်ဆုံး fire (အသက်ဝင်အောင် လှုံ့ဆော်ခြင်း) ဖြစ်အောင် လုပ်ထားဖို့ လိုအပ်ပါတယ်။ Triggers တွေက name order (နာမည် အစဉ်လိုက်) နဲ့ fire တာကို သတိပြုရင် — table ပေါ်မှာ ရှိနိုင်တဲ့ တခြား trigger တိုင်းရဲ့ နာမည်ထက် နောက်ကျတဲ့ trigger name တစ်ခုကို ရွေးချယ်ရပါလိမ့်မယ်။ (ဒါကြောင့်ပဲ ဥပမာထဲမှာ “z” prefix သုံးထားတာပါ။)
