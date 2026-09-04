---
title: "UUID Type (UUID type)"
description: "UUID type — 128-bit UUID များ သိုလှောင်ခြင်း, standard ဖော်မက်နှင့် input/output ပုံစံများ, PostgreSQL တွင် UUID ထုတ်လုပ်ခြင်း"
order: 59
source: "https://www.postgresql.org/docs/current/datatype-uuid.html"
status: translated
updated: 2026-09-03
---

## 8.12. UUID Type (UUID type)

`uuid` data type က — [RFC 9562](https://datatracker.ietf.org/doc/html/rfc9562), ISO/IEC 9834-8:2005 နဲ့ ဆက်စပ်တဲ့ standards တွေမှာ သတ်မှတ်ထားတဲ့အတိုင်း — Universally Unique Identifiers (UUID) တွေကို သိုလှောင်ပေးပါတယ်။ (System တချို့က ဒီ data type ကို globally unique identifier သို့မဟုတ် GUID လို့ ခေါ်ဆိုကြပါတယ်။) ဒီ identifier က — တူညီတဲ့ identifier တစ်ခုကို တူညီတဲ့ algorithm နဲ့ပဲ သုံးတဲ့ ဘယ်သူကမဆို ပြန်လည် ထုတ်လုပ်မိဖို့ မဖြစ်နိုင်လောက်အောင် ရွေးချယ်ထားတဲ့ algorithm တစ်ခုနဲ့ generate (ထုတ်လုပ်) လုပ်ထားတဲ့ 128-bit ပမာဏ တစ်ခု ဖြစ်ပါတယ်။ ဒါကြောင့် — distributed systems (ဖြန့်ကျက် စနစ်များ) တွေအတွက် — ဒီ identifier တွေက database တစ်ခုတည်းအတွင်းမှာပဲ unique (ထူးခြား) တဲ့ sequence generators တွေထက် ပိုကောင်းတဲ့ uniqueness (တမူထူးခြားမှု) အာမခံချက် တစ်ခုကို ပေးပါတယ်။

RFC 9562 က မတူညီတဲ့ UUID version 8 မျိုးကို သတ်မှတ်ပါတယ်။ Version တစ်ခုစီမှာ UUID value အသစ်တွေ ထုတ်လုပ်ခြင်းအတွက် သီးခြား လိုအပ်ချက်တွေ ရှိပြီး — version တစ်ခုစီကလည်း ထူးခြားတဲ့ အားသာချက်တွေနဲ့ အားနည်းချက်တွေကို ပေးပါတယ်။ PostgreSQL က UUIDv4 နဲ့ UUIDv7 algorithms တွေကို သုံးပြီး UUID တွေ ထုတ်လုပ်ခြင်းအတွက် native (ဇာတိ) ပံ့ပိုးမှု ပေးထားပါတယ်။ တနည်းအားဖြင့် — UUID value တွေကို ဘယ် algorithm နဲ့မဆို — database ရဲ့ အပြင်ဘက်မှာလည်း ထုတ်လုပ်နိုင်ပါတယ်။ `uuid` data type ကို — ဘယ်ကနေ လာတာပဲ ဖြစ်ဖြစ်၊ ဘယ် UUID version ပဲ ဖြစ်ဖြစ် — ဘယ် UUID ကိုမဆို သိုလှောင်ဖို့ သုံးနိုင်ပါတယ်။

UUID တစ်ခုကို — hyphen (မျဉ်းတို) တွေနဲ့ ပိုင်းခြားထားတဲ့ group အများအပြား ပါဝင်တဲ့ — lower-case hexadecimal (စာလုံးအသေး ဆယ့်ခြောက်လုံးကိန်း) ဂဏန်းတွေရဲ့ အစဉ်တစ်ခုအနေနဲ့ ရေးသားပါတယ်; အတိအကျ ဆိုရရင် — ဂဏန်း 8 လုံးပါ group တစ်ခု၊ ဂဏန်း 4 လုံးပါ group သုံးခု၊ ဂဏန်း 12 လုံးပါ group တစ်ခု — 128 bits ကို ကိုယ်စားပြုတဲ့ စုစုပေါင်း ဂဏန်း 32 လုံး ဖြစ်ပါတယ်။ ဒီ standard ပုံစံနဲ့ UUID တစ်ခုရဲ့ ဥပမာကတော့:

```sql
a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11
```

PostgreSQL က input (ထည့်သွင်းမှု) အတွက် အောက်ပါ အခြားရွေးချယ်စရာ (alternative) ပုံစံတွေကိုလည်း လက်ခံပါတယ်: upper-case (စာလုံးကြီး) ဂဏန်းတွေ သုံးခြင်း၊ braces ({} ကွင်းခတ်) တွေနဲ့ ဝန်းရံထားတဲ့ standard ပုံစံ၊ hyphen တချို့ သို့မဟုတ် အားလုံး ချန်လိုက်ခြင်း၊ ဂဏန်း 4 လုံး group တိုင်းရဲ့ နောက်မှာ hyphen တစ်ခု ထည့်ခြင်း တို့ ဖြစ်ပါတယ်။ ဥပမာတွေကတော့:

```sql
A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11
{a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11}
a0eebc999c0b4ef8bb6d6bb9bd380a11
a0ee-bc99-9c0b-4ef8-bb6d-6bb9-bd38-0a11
{a0eebc99-9c0b4ef8-bb6d6bb9-bd380a11}
```

Output (ထွက်ပေါ်လာသော ရလဒ်) ကတော့ အမြဲတမ်း standard ပုံစံနဲ့ပဲ ဖြစ်ပါတယ်။

PostgreSQL မှာ UUID တစ်ခုကို ဘယ်လို ထုတ်လုပ်မလဲဆိုတာအတွက် — [အပိုင်း 9.14](/docs/postgresql/functions-uuid) ကို ကြည့်ပါ။
