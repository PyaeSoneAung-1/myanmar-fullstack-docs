---
title: "Bit String Functions and Operators (bit string လုပ်ဆောင်ချက်များနှင့် operator များ)"
description: "PostgreSQL ၏ bit string functions များနှင့် operators များ — bit နှင့် bit varying type တန်ဖိုးများကို စစ်ဆေးခြင်းနှင့် ပြုပြင်ခြင်း၊ bit string operator နှင့် function ဇယားများ၊ integer များကို bit type သို့ cast ပြုလုပ်ခြင်း အသေးစိတ်"
order: 73
source: "https://www.postgresql.org/docs/current/functions-bitstring.html"
status: translated
updated: 2026-09-04
---

## 9.6. Bit String Functions and Operators (bit string လုပ်ဆောင်ချက်များနှင့် operator များ)

ဒီ section မှာ — bit strings (bit string ဆိုတာ `bit` နဲ့ `bit varying` type တွေရဲ့ တန်ဖိုးတွေပါ) ကို စစ်ဆေးခြင်း (examining) နဲ့ ပြုပြင်ခြင်း (manipulating) အတွက် — functions တွေနဲ့ operator တွေကို ဖော်ပြထားပါတယ်။ (ဒီဇယားတွေထဲမှာ `bit` type ကိုပဲ ဖော်ပြထားပေမယ့် — `bit varying` type ရဲ့ တန်ဖိုးတွေကိုလည်း အပြန်အလှန် (interchangeably) သုံးလို့ ရပါတယ်။)

Bit strings တွေက [ဇယား 9.1](/docs/postgresql/functions-comparison) မှာ ပြထားတဲ့ ပုံမှန် comparison operators (နှိုင်းယှဉ် operator များ) တွေကို လည်းကောင်း — ဇယား 9.14 မှာ ပြထားတဲ့ operator တွေကို လည်းကောင်း — ထောက်ပံ့ပါတယ်။

**ဇယား 9.14. Bit String Operators (bit string operator များ)**

| Operator ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| bit \|\| bit → bit bit string နှစ်ခုကို ဆက်စပ်ပေးပါတယ် (concatenation)။ B'10001' \|\| B'011' → 10001011 |
| bit & bit → bit bitwise AND လုပ်ဆောင်ပေးပါတယ် (inputs နှစ်ခုလုံး အလျားတူညီ (equal length) ရှိရပါမယ်)။ B'10001' & B'01101' → 00001 |
| bit \| bit → bit bitwise OR လုပ်ဆောင်ပေးပါတယ် (inputs နှစ်ခုလုံး အလျားတူညီ ရှိရပါမယ်)။ B'10001' \| B'01101' → 11101 |
| bit # bit → bit bitwise exclusive OR (XOR) လုပ်ဆောင်ပေးပါတယ် (inputs နှစ်ခုလုံး အလျားတူညီ ရှိရပါမယ်)။ B'10001' # B'01101' → 11100 |
| ~ bit → bit bitwise NOT လုပ်ဆောင်ပေးပါတယ် (bit တစ်ခုချင်းစီကို ပြောင်းပြန် လှန်ပေးခြင်း)။ ~ B'10001' → 01110 |
| bit << integer → bit bitwise shift left လုပ်ဆောင်ပေးပါတယ် (string ရဲ့ အလျားကို ထိန်းသိမ်းထားပါတယ်)။ B'10001' << 3 → 01000 |
| bit >> integer → bit bitwise shift right လုပ်ဆောင်ပေးပါတယ် (string ရဲ့ အလျားကို ထိန်းသိမ်းထားပါတယ်)။ B'10001' >> 2 → 00100 |

binary strings တွေအတွက် ရနိုင်တဲ့ functions တချို့ကို — bit strings တွေအတွက်လည်း သုံးလို့ ရပါတယ် — ဇယား 9.15 မှာ ပြထားပါတယ်။

**ဇယား 9.15. Bit String Functions (bit string လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| bit_count ( bit ) → bigint bit string ထဲမှာ set ဖြစ်နေတဲ့ bits အရေအတွက်ကို ပြန်ပေးပါတယ် (popcount လို့လည်း ခေါ်ပါတယ်)။ bit_count(B'10111') → 4 |
| bit_length ( bit ) → integer bit string ထဲက bits အရေအတွက်ကို ပြန်ပေးပါတယ်။ bit_length(B'10111') → 5 |
| length ( bit ) → integer bit string ထဲက bits အရေအတွက်ကို ပြန်ပေးပါတယ်။ length(B'10111') → 5 |
| octet_length ( bit ) → integer bit string ထဲက bytes အရေအတွက်ကို ပြန်ပေးပါတယ်။ octet_length(B'1011111011') → 2 |
| overlay ( bits bit PLACING newsubstring bit FROM start integer [ FOR count integer ] ) → bit bits ထဲမှာ — start'th bit ကနေ စပြီး count bits အထိ ရှိတဲ့ substring ကို — newsubstring နဲ့ အစားထိုးပေးပါတယ်။ count ကို ချန်လိုက်ရင် — newsubstring ရဲ့ အလျားကို မူရင်း (default) အဖြစ် သုံးပါတယ်။ overlay(B'01010101010101010' placing B'11111' from 2 for 3) → 0111110101010101010 |
| position ( substring bit IN bits bit ) → integer bits ထဲမှာ သတ်မှတ်ထားတဲ့ substring ရဲ့ ပထမဆုံး စတင်သည့် index ကို ပြန်ပေးပါတယ် — မတွေ့ရရင် သုည ဖြစ်ပါတယ်။ position(B'010' in B'000001101011') → 8 |
| substring ( bits bit [ FROM start integer ] [ FOR count integer ] ) → bit bits ထဲက — သတ်မှတ်ထားရင် start'th bit ကနေ စပြီး — သတ်မှတ်ထားရင် count bits အထိ ရှိတဲ့ substring ကို ထုတ်ယူပေးပါတယ်။ start နဲ့ count ထဲက အနည်းဆုံး တစ်ခုကို ပေးပါ။ substring(B'110010111111' from 3 for 2) → 00 |
| get_bit ( bits bit, n integer ) → integer bit string ထဲက n'th bit ကို ထုတ်ယူပေးပါတယ်; ပထမဆုံး (ဘယ်ဘက်ဆုံး) bit က bit 0 ဖြစ်ပါတယ်။ get_bit(B'101010101010101010', 6) → 1 |
| set_bit ( bits bit, n integer, newvalue integer ) → bit bit string ထဲက n'th bit ကို newvalue အဖြစ် သတ်မှတ်ပေးပါတယ်; ပထမဆုံး (ဘယ်ဘက်ဆုံး) bit က bit 0 ဖြစ်ပါတယ်။ set_bit(B'101010101010101010', 6, 0) → 101010001010101010 |

ဒါ့အပြင် — integral (ကိန်းပြည့်) တန်ဖိုးတွေကို `bit` type ဆီ ရော — `bit` type ကနေ ပါ — cast လုပ်လို့ ရပါတယ်။ Integer တစ်ခုကို `bit(n)` အဖြစ် cast လုပ်တဲ့အခါ — ညာဘက်ဆုံး `n` bits တွေကို ကူးယူပါတယ်။ Integer တစ်ခုကို — integer ကိုယ်တိုင်ထက် ပိုကျယ်တဲ့ width ရှိတဲ့ bit string တစ်ခုဆီ cast လုပ်ရင် — ဘယ်ဘက်မှာ sign-extend (နိမိတ် ဆန့်ထုတ်ခြင်း) လုပ်ပေးပါတယ်။ ဥပမာအချို့:

```sql
44::bit(10)                    0000101100
44::bit(3)                     100
cast(-44 as bit(12))           111111010100
'1110'::bit(4)::integer        14
```

`bit` ဆိုပြီး သက်သက် cast လုပ်တာက — `bit(1)` အဖြစ် cast လုပ်တာကို ဆိုလိုတာမို့ — integer ရဲ့ least significant bit (အနည်းဆုံး အရေးပါသော bit) တစ်ခုတည်းကိုပဲ ထုတ်ပေးမယ်ဆိုတာ သတိပြုပါ။
