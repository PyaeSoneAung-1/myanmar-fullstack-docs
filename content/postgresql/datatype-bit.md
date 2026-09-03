---
title: "Bit String Types (bit string type များ)"
description: "PostgreSQL ရဲ့ bit string type များ — bit(n)/bit varying(n), input/output နှင့် bit string operator/function များ"
order: 57
source: "https://www.postgresql.org/docs/current/datatype-bit.html"
status: translated
updated: 2026-09-03
---

## 8.10. Bit String Types (bit string type များ)

Bit strings ဆိုတာ 1 တွေနဲ့ 0 တွေ ပါဝင်တဲ့ string တွေပါ။ Bit mask (bit မျက်နှာဖုံး) တွေကို သိမ်းဆည်းဖို့ ဒါမှမဟုတ် မြင်သာအောင် ပြသဖို့ သုံးလို့ ရပါတယ်။ SQL bit type နှစ်မျိုး ရှိပါတယ်: `bit(n)` နဲ့ `bit varying(n)` — ဒီမှာ `n` က positive integer (အပေါင်း ကိန်းပြည့်) ပါ။

`bit` type ရဲ့ data က အလျား `n` နဲ့ အတိအကျ ကိုက်ညီရပါမယ်; ပိုတိုတဲ့ သို့မဟုတ် ပိုရှည်တဲ့ bit string တွေကို သိမ်းဖို့ ကြိုးစားရင် error ဖြစ်ပါတယ်။ `bit varying` ရဲ့ data ကတော့ — အများဆုံး အလျား `n` အထိ — အလျား ပြောင်းလဲနိုင်ပြီး — `n` ထက် ပိုရှည်တဲ့ string တွေကို ငြင်းပယ်ပါတယ်။ အလျား မပါဘဲ ရေးထားတဲ့ `bit` က `bit(1)` နဲ့ ညီမျှပြီး — အလျား သတ်မှတ်ချက် မပါတဲ့ `bit varying` ကတော့ အလျား အကန့်အသတ် မရှိ ဆိုလိုပါတယ်။

> **မှတ်ချက်:** bit-string တန်ဖိုး တစ်ခုကို `bit(n)` အဖြစ် အတိအကျ (explicitly) cast လုပ်ရင် — error မတက်စေဘဲ — အတိအကျ `n` bits ဖြစ်အောင် ညာဘက်မှာ ဖြတ်တောက် (truncate) ခြင်း သို့မဟုတ် သုည ဖြည့်စွက် (zero-pad) လုပ်ခြင်း ခံရပါတယ်။ အလားတူပဲ — bit-string တန်ဖိုး တစ်ခုကို `bit varying(n)` အဖြစ် အတိအကျ cast လုပ်ရင် — `n` bits ထက် ပိုနေရင် ညာဘက်မှာ ဖြတ်တောက်ပါတယ်။

Bit string constants တွေရဲ့ syntax (ရေးသားပုံ) အကြောင်း အချက်အလက်အတွက် [အပိုင်း 4.1.2.5](/docs/postgresql/sql-syntax-lexical) ကို ကြည့်ပါ။ Bit-logical operators (bit ယုတ္တိ operator များ) နဲ့ string manipulation (string ကိုင်တွယ်ခြင်း) function တွေလည်း ရနိုင်ပါတယ်; [အပိုင်း 9.6](https://www.postgresql.org/docs/current/functions-bitstring.html) ကို ကြည့်ပါ။

**ဥပမာ 8.3. Using the Bit String Types (bit string type များ အသုံးပြုခြင်း)**

```sql
CREATE TABLE test (a BIT(3), b BIT VARYING(5));
INSERT INTO test VALUES (B'101', B'00');
INSERT INTO test VALUES (B'10', B'101');

ERROR:  bit string length 2 does not match type bit(3)

INSERT INTO test VALUES (B'10'::bit(3), B'101');
SELECT * FROM test;

  a  |  b
-----+-----
 101 | 00
 100 | 101
```

Bit string တန်ဖိုး တစ်ခုအတွက် — bits 8 လုံး ပါတဲ့ group (အုပ်စု) တစ်ခုစီတိုင်းအတွက် 1 byte လိုအပ်ပြီး — string ရဲ့ အလျားပေါ် မူတည်ပြီး overhead (ထပ်ဆောင်း စရိတ်) 5 သို့မဟုတ် 8 bytes ထပ်ပေါင်းပါတယ် (ရှည်လျားတဲ့ တန်ဖိုးတွေကတော့ — character string တွေအတွက် [အပိုင်း 8.3](/docs/postgresql/datatype-character) မှာ ရှင်းပြထားသလို — compress (ချုံ့) လုပ်ခံရနိုင်သလို — out-of-line (သီးခြား နေရာ) မှာလည်း သိမ်းခံရနိုင်ပါတယ်)။
