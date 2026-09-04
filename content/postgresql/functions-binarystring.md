---
title: "Binary String Functions and Operators (binary string လုပ်ဆောင်ချက်များနှင့် operator များ)"
description: "PostgreSQL ၏ binary string functions များနှင့် operators များ — bytea type တန်ဖိုးများကို စစ်ဆေးခြင်းနှင့် ပြုပြင်ခြင်း၊ SQL binary string functions နှင့် အခြား binary string/conversion functions ဇယားများ၊ encode/decode နှင့် textual formats (base64, escape, hex) အသေးစိတ်"
order: 72
source: "https://www.postgresql.org/docs/current/functions-binarystring.html"
status: translated
updated: 2026-09-04
---

## 9.5. Binary String Functions and Operators (binary string လုပ်ဆောင်ချက်များနှင့် operator များ)

ဒီ section မှာ — binary strings (ဆိုလိုတာက `bytea` type ရဲ့ တန်ဖိုးတွေ) ကို စစ်ဆေးခြင်း (examining) နဲ့ ပြုပြင်ခြင်း (manipulating) အတွက် — functions တွေနဲ့ operator တွေကို ဖော်ပြထားပါတယ်။ ဒီထဲက အများစုဟာ — ရည်ရွယ်ချက် (purpose) ရော syntax ရော — အရင် section မှာ ဖော်ပြထားတဲ့ text-string functions တွေနဲ့ ညီမျှပါတယ်။

SQL မှာ — arguments တွေကို ကော်မာတွေနဲ့ မဟုတ်ဘဲ key words တွေနဲ့ ခွဲခြားတဲ့ string functions တချို့ကို သတ်မှတ်ထားပါတယ်။ အသေးစိတ်ကို ဇယား 9.11 မှာ ကြည့်နိုင်ပါတယ်။ PostgreSQL က ဒီ functions တွေရဲ့ — ပုံမှန် function ခေါ်ဆိုမှု syntax (regular function invocation syntax) သုံးတဲ့ — ဗားရှင်းတွေကိုလည်း ပေးထားပါတယ် (ဇယား 9.12 ကို ကြည့်ပါ)။

**ဇယား 9.11. SQL Binary String Functions and Operators (SQL binary string လုပ်ဆောင်ချက်များနှင့် operator များ)**

| Function/Operator ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| bytea \|\| bytea → bytea binary string နှစ်ခုကို ဆက်စပ်ပေးပါတယ်။ '\x123456'::bytea \|\| '\x789a00bcde'::bytea → \x123456789a00bcde |
| bit_length ( bytea ) → integer binary string ထဲက bits အရေအတွက်ကို ပြန်ပေးပါတယ် (octet_length ရဲ့ 8 ဆ)။ bit_length('\x123456'::bytea) → 24 |
| btrim ( bytes bytea, bytesremoved bytea ) → bytea bytes ရဲ့ အစနဲ့ အဆုံးကနေ — bytesremoved ထဲမှာပဲ ပါဝင်တဲ့ bytes တွေပဲ ပါတဲ့ အရှည်ဆုံး string ကို ဖယ်ရှားပေးပါတယ်။ btrim('\x1234567890'::bytea, '\x9012'::bytea) → \x345678 |
| ltrim ( bytes bytea, bytesremoved bytea ) → bytea bytes ရဲ့ အစကနေ — bytesremoved ထဲမှာပဲ ပါဝင်တဲ့ bytes တွေပဲ ပါတဲ့ အရှည်ဆုံး string ကို ဖယ်ရှားပေးပါတယ်။ ltrim('\x1234567890'::bytea, '\x9012'::bytea) → \x34567890 |
| octet_length ( bytea ) → integer binary string ထဲက bytes အရေအတွက်ကို ပြန်ပေးပါတယ်။ octet_length('\x123456'::bytea) → 3 |
| overlay ( bytes bytea PLACING newsubstring bytea FROM start integer [ FOR count integer ] ) → bytea bytes ထဲမှာ — start'th byte ကနေ စပြီး count bytes အထိ ရှိတဲ့ substring ကို — newsubstring နဲ့ အစားထိုးပေးပါတယ်။ count ကို ချန်လိုက်ရင် — newsubstring ရဲ့ အလျားကို မူရင်း (default) အဖြစ် သုံးပါတယ်။ overlay('\x1234567890'::bytea placing '\002\003'::bytea from 2 for 3) → \x12020390 |
| position ( substring bytea IN bytes bytea ) → integer bytes ထဲမှာ သတ်မှတ်ထားတဲ့ substring ရဲ့ ပထမဆုံး စတင်သည့် index ကို ပြန်ပေးပါတယ် — မတွေ့ရရင် သုည ဖြစ်ပါတယ်။ position('\x5678'::bytea in '\x1234567890'::bytea) → 3 |
| rtrim ( bytes bytea, bytesremoved bytea ) → bytea bytes ရဲ့ အဆုံးကနေ — bytesremoved ထဲမှာပဲ ပါဝင်တဲ့ bytes တွေပဲ ပါတဲ့ အရှည်ဆုံး string ကို ဖယ်ရှားပေးပါတယ်။ rtrim('\x1234567890'::bytea, '\x9012'::bytea) → \x12345678 |
| substring ( bytes bytea [ FROM start integer ] [ FOR count integer ] ) → bytea bytes ထဲက — သတ်မှတ်ထားရင် start'th byte ကနေ စပြီး — သတ်မှတ်ထားရင် count bytes အထိ ရှိတဲ့ substring ကို ထုတ်ယူပေးပါတယ်။ start နဲ့ count ထဲက အနည်းဆုံး တစ်ခုကို ပေးပါ။ substring('\x1234567890'::bytea from 3 for 2) → \x5678 |
| trim ( [ LEADING \| TRAILING \| BOTH ] bytesremoved bytea FROM bytes bytea ) → bytea bytes ရဲ့ — အစ၊ အဆုံး ဒါမှမဟုတ် နှစ်ဖက်စလုံး (BOTH က မူရင်း default) ကနေ — bytesremoved ထဲမှာပဲ ပါဝင်တဲ့ bytes တွေပဲ ပါတဲ့ အရှည်ဆုံး string ကို ဖယ်ရှားပေးပါတယ်။ trim('\x9012'::bytea from '\x1234567890'::bytea) → \x345678 |
| trim ( [ LEADING \| TRAILING \| BOTH ] [ FROM ] bytes bytea, bytesremoved bytea ) → bytea ဒါက trim() ရဲ့ standard မဟုတ်တဲ့ syntax တစ်ခုပါ။ trim(both from '\x1234567890'::bytea, '\x9012'::bytea) → \x345678 |

binary string ပြုပြင်ခြင်း (manipulation) အတွက် နောက်ထပ် functions တွေ ရှိပြီး — ဇယား 9.12 မှာ စာရင်းပြထားပါတယ်။ ဒီထဲက တချို့ကို — ဇယား 9.11 မှာ စာရင်းပြုထားတဲ့ SQL-standard string functions တွေကို implement လုပ်ဖို့ — အတွင်းပိုင်းမှာ သုံးပါတယ်။

**ဇယား 9.12. Other Binary String Functions (အခြား binary string လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| bit_count ( bytes bytea ) → bigint binary string ထဲမှာ set ဖြစ်နေတဲ့ bits အရေအတွက်ကို ပြန်ပေးပါတယ် (popcount လို့လည်း ခေါ်ပါတယ်)။ bit_count('\x1234567890'::bytea) → 15 |
| crc32 ( bytea ) → bigint binary string ရဲ့ CRC-32 တန်ဖိုးကို တွက်ချက်ပေးပါတယ်။ crc32('abc'::bytea) → 891568578 |
| crc32c ( bytea ) → bigint binary string ရဲ့ CRC-32C တန်ဖိုးကို တွက်ချက်ပေးပါတယ်။ crc32c('abc'::bytea) → 910901175 |
| get_bit ( bytes bytea, n bigint ) → integer binary string ထဲက n'th bit ကို ထုတ်ယူပေးပါတယ်။ get_bit('\x1234567890'::bytea, 30) → 1 |
| get_byte ( bytes bytea, n integer ) → integer binary string ထဲက n'th byte ကို ထုတ်ယူပေးပါတယ်။ get_byte('\x1234567890'::bytea, 4) → 144 |
| length ( bytea ) → integer binary string ထဲက bytes အရေအတွက်ကို ပြန်ပေးပါတယ်။ length('\x1234567890'::bytea) → 5 |
| length ( bytes bytea, encoding name ) → integer binary string ကို ပေးထားတဲ့ encoding ထဲက text တစ်ခုအနေနဲ့ ယူဆပြီး — characters အရေအတွက်ကို ပြန်ပေးပါတယ်။ length('jose'::bytea, 'UTF8') → 4 |
| md5 ( bytea ) → text binary string ရဲ့ MD5 hash ကို တွက်ချက်ပြီး — ရလဒ်ကို hexadecimal နဲ့ ရေးပါတယ်။ md5('Th\000omas'::bytea) → 8ab2d3c9689aaf18​b4958c334c82d8b1 |
| reverse ( bytea ) → bytea binary string ထဲက bytes တွေရဲ့ အစီအစဉ်ကို ပြောင်းပြန် လှန်ပေးပါတယ်။ reverse('\xabcd'::bytea) → \xcdab |
| set_bit ( bytes bytea, n bigint, newvalue integer ) → bytea binary string ထဲက n'th bit ကို newvalue အဖြစ် သတ်မှတ်ပေးပါတယ်။ set_bit('\x1234567890'::bytea, 30, 0) → \x1234563890 |
| set_byte ( bytes bytea, n integer, newvalue integer ) → bytea binary string ထဲက n'th byte ကို newvalue အဖြစ် သတ်မှတ်ပေးပါတယ်။ set_byte('\x1234567890'::bytea, 4, 64) → \x1234567840 |
| sha224 ( bytea ) → bytea binary string ရဲ့ SHA-224 hash ကို တွက်ချက်ပေးပါတယ်။ sha224('abc'::bytea) → \x23097d223405d8228642a477bda2​55b32aadbce4bda0b3f7e36c9da7 |
| sha256 ( bytea ) → bytea binary string ရဲ့ SHA-256 hash ကို တွက်ချက်ပေးပါတယ်။ sha256('abc'::bytea) → \xba7816bf8f01cfea414140de5dae2223​b00361a396177a9cb410ff61f20015ad |
| sha384 ( bytea ) → bytea binary string ရဲ့ SHA-384 hash ကို တွက်ချက်ပေးပါတယ်။ sha384('abc'::bytea) → \xcb00753f45a35e8bb5a03d699ac65007​272c32ab0eded1631a8b605a43ff5bed​8086072ba1e7cc2358baeca134c825a7 |
| sha512 ( bytea ) → bytea binary string ရဲ့ SHA-512 hash ကို တွက်ချက်ပေးပါတယ်။ sha512('abc'::bytea) → \xddaf35a193617abacc417349ae204131​12e6fa4e89a97ea20a9eeee64b55d39a​2192992a274fc1a836ba3c23a3feebbd​454d4423643ce80e2a9ac94fa54ca49f |
| substr ( bytes bytea, start integer [, count integer ] ) → bytea bytes ထဲက — start'th byte ကနေ စပြီး — သတ်မှတ်ထားရင် count bytes အထိ ရှိတဲ့ substring ကို ထုတ်ယူပေးပါတယ်။ (substring(bytes from start for count) နဲ့ တူညီပါတယ်။) substr('\x1234567890'::bytea, 3, 2) → \x5678 |

`get_byte` နဲ့ `set_byte` functions တွေမှာ — binary string တစ်ခုရဲ့ ပထမ byte ကို byte 0 အဖြစ် ရေတွက်ပါတယ်။ `get_bit` နဲ့ `set_bit` functions တွေမှာတော့ — byte တစ်ခုစီအတွင်းမှာ bits တွေကို ညာဘက်ကနေ ရေတွက်ပါတယ်; ဥပမာ — bit 0 က ပထမ byte ရဲ့ least significant bit (အနည်းဆုံး အရေးပါသော bit) ဖြစ်ပြီး — bit 15 က ဒုတိယ byte ရဲ့ most significant bit (အမြင့်ဆုံး အရေးပါသော bit) ဖြစ်ပါတယ်။

သမိုင်းကြောင်း အရ — `md5` function က hex-encoded (hexadecimal နဲ့ encode လုပ်ထားတဲ့) `text` type တန်ဖိုး တစ်ခုကို ပြန်ပေးပြီး — SHA-2 functions တွေကတော့ `bytea` type ကို ပြန်ပေးပါတယ်။ နှစ်ခုကြား ပြောင်းလဲဖို့ `encode` နဲ့ `decode` functions တွေကို သုံးပါ။ ဥပမာ — hex-encoded text ကိုယ်စားပြုမှု တစ်ခု ရဖို့ `encode(sha256('abc'), 'hex')` လို့ ရေးနိုင်သလို — `bytea` တန်ဖိုး တစ်ခု ရဖို့ `decode(md5('abc'), 'hex')` လို့လည်း ရေးနိုင်ပါတယ်။

character sets (encodings) အမျိုးမျိုးကြားမှာ strings တွေကို ပြောင်းလဲပေးဖို့ — နဲ့ မည်သည့် (arbitrary) binary data ကိုမဆို textual ပုံစံနဲ့ ကိုယ်စားပြုဖို့ — သုံးတဲ့ functions တွေကို ဇယား 9.13 မှာ ပြထားပါတယ်။ ဒီ functions တွေမှာ — `text` type ရဲ့ argument ဒါမှမဟုတ် ရလဒ်ကို database ရဲ့ default encoding နဲ့ ဖော်ပြပြီး — `bytea` type ရဲ့ argument ဒါမှမဟုတ် ရလဒ်တွေကတော့ — တခြား argument တစ်ခုက သတ်မှတ်ပေးတဲ့ encoding နဲ့ ဖြစ်ပါတယ်။

**ဇယား 9.13. Text/Binary String Conversion Functions (Text/Binary string ပြောင်းလဲခြင်း လုပ်ဆောင်ချက်များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| convert ( bytes bytea, src_encoding name, dest_encoding name ) → bytea encoding src_encoding ထဲမှာ text ကို ကိုယ်စားပြုတဲ့ binary string တစ်ခုကို — encoding dest_encoding ထဲမှာ ရှိတဲ့ binary string တစ်ခုအဖြစ် ပြောင်းပေးပါတယ် (ရနိုင်တဲ့ conversions တွေအတွက် အပိုင်း 23.3.4 ကို ကြည့်ပါ)။ convert('text_in_utf8', 'UTF8', 'LATIN1') → \x746578745f696e5f75746638 |
| convert_from ( bytes bytea, src_encoding name ) → text encoding src_encoding ထဲမှာ text ကို ကိုယ်စားပြုတဲ့ binary string တစ်ခုကို — database encoding ထဲက text အဖြစ် ပြောင်းပေးပါတယ် (ရနိုင်တဲ့ conversions တွေအတွက် အပိုင်း 23.3.4 ကို ကြည့်ပါ)။ convert_from('text_in_utf8', 'UTF8') → text_in_utf8 |
| convert_to ( string text, dest_encoding name ) → bytea text string တစ်ခု (database encoding ထဲမှာ ရှိတဲ့) ကို — encoding dest_encoding နဲ့ encode လုပ်ထားတဲ့ binary string တစ်ခုအဖြစ် ပြောင်းပေးပါတယ် (ရနိုင်တဲ့ conversions တွေအတွက် အပိုင်း 23.3.4 ကို ကြည့်ပါ)။ convert_to('some_text', 'UTF8') → \x736f6d655f74657874 |
| encode ( bytes bytea, format text ) → text binary data ကို textual ကိုယ်စားပြုမှု (textual representation) တစ်ခုအဖြစ် encode လုပ်ပေးပါတယ်; ထောက်ပံ့ထားတဲ့ format values တွေကတော့: base64, escape, hex။ encode('123\000\001', 'base64') → MTIzAAE= |
| decode ( string text, format text ) → bytea textual ကိုယ်စားပြုမှု တစ်ခုကနေ binary data ကို decode လုပ်ပေးပါတယ်; ထောက်ပံ့ထားတဲ့ format values တွေက encode အတွက် ရှိတာတွေနဲ့ အတူတူပါပဲ။ decode('MTIzAAE=', 'base64') → \x3132330001 |

`encode` နဲ့ `decode` functions တွေက အောက်ပါ textual formats တွေကို ထောက်ပံ့ပါတယ်:

- **base64** — base64 format က RFC 2045 ရဲ့ Section 6.8 ပုံစံ ဖြစ်ပါတယ်။ RFC အတိုင်း — encode လုပ်ထားတဲ့ lines တွေကို characters 76 မှာ ချိုးဖြတ်ပါတယ်။ ဒါပေမယ့် — MIME ရဲ့ CRLF end-of-line အမှတ်အသား အစား — end-of-line အတွက် newline တစ်ခုကိုပဲ သုံးပါတယ်။ decode function က carriage-return၊ newline၊ space နဲ့ tab characters တွေကို လျစ်လျူရှုပါတယ်။ အဲဒီ characters တွေကလွဲပြီး — decode ကို မမှန်ကန်တဲ့ base64 data နဲ့ ပေးလိုက်ရင် — နောက်ဆုံးက padding မှားယွင်းနေတဲ့ အခြေအနေ အပါအဝင် — error တစ်ခု တက်ပါတယ်။
- **escape** — escape format က zero bytes တွေနဲ့ high bit set ဖြစ်နေတဲ့ bytes တွေကို — octal escape sequences (\nnn) တွေအဖြစ် ပြောင်းပေးပြီး — backslashes တွေကို နှစ်ဆ လုပ်ပေးပါတယ်။ တခြား byte values တွေကိုတော့ literal အတိုင်း ကိုယ်စားပြုပါတယ်။ backslash တစ်ခုနောက်မှာ — နောက်ထပ် backslash တစ်ခု ဒါမှမဟုတ် octal ဂဏန်း သုံးလုံး မလိုက်ရင် — decode function က error တစ်ခု တက်စေပါတယ်; ကျန်တဲ့ byte values တွေကိုတော့ မပြောင်းလဲဘဲ လက်ခံပါတယ်။
- **hex** — hex format က data ရဲ့ 4 bits တိုင်းကို — hexadecimal ဂဏန်း တစ်လုံး (0 ကနေ f အထိ) အနေနဲ့ ကိုယ်စားပြုပြီး — byte တစ်ခုစီရဲ့ မြင့်မားတဲ့ digit (higher-order digit) ကို အရင်ရေးပါတယ်။ encode function က a-f hex digits တွေကို စာလုံးငယ် (lower case) နဲ့ ထုတ်ပေးပါတယ်။ Data ရဲ့ အသေးဆုံး ယူနစ်က 8 bits ဖြစ်လို့ — encode က ပြန်ပေးတဲ့ characters အရေအတွက်က အမြဲတမ်း စုံကိန်း (even) ဖြစ်ပါတယ်။ decode function က a-f characters တွေကို စာလုံးကြီး (upper case) ဒါမှမဟုတ် စာလုံးငယ် နှစ်မျိုးလုံးနဲ့ လက်ခံပါတယ်။ decode ကို မမှန်ကန်တဲ့ hex data ပေးလိုက်ရင် — characters အရေအတွက် မကိန်း (odd) ဖြစ်နေတဲ့ အခြေအနေ အပါအဝင် — error တစ်ခု တက်ပါတယ်။

ဒါ့အပြင် — integral (ကိန်းပြည့်) တန်ဖိုးတွေကို `bytea` type ဆီ ရော `bytea` ကနေ ပါ cast လုပ်လို့ ရပါတယ်။ integer တစ်ခုကို `bytea` အဖြစ် cast လုပ်တဲ့အခါ — integer type ရဲ့ width ပေါ် မူတည်ပြီး — bytes 2၊ 4 ဒါမှမဟုတ် 8 ထွက်လာပါတယ်။ ရလဒ်က integer ရဲ့ two's complement ကိုယ်စားပြုမှု ဖြစ်ပြီး — most significant byte (အမြင့်ဆုံး အရေးပါသော byte) က ရှေ့ဆုံးမှာ ပါပါတယ်။ ဥပမာအချို့:

```sql
1234::smallint::bytea          \x04d2
cast(1234 as bytea)            \x000004d2
cast(-1234 as bytea)           \xfffffb2e
'\x8000'::bytea::smallint      -32768
'\x8000'::bytea::integer       32768
```

`bytea` တစ်ခုကို integer အဖြစ် cast လုပ်တဲ့အခါ — `bytea` ရဲ့ အလျားက integer type ရဲ့ width ထက် ကျော်လွန်နေရင် — error တစ်ခု တက်ပါတယ်။

Aggregate function `string_agg` ကိုတော့ [အပိုင်း 9.21](/docs/postgresql/functions-aggregate) မှာ လည်းကောင်း — large object functions တွေကို [အပိုင်း 33.4](https://www.postgresql.org/docs/current/lo-funcs.html) မှာ လည်းကောင်း — ကြည့်နိုင်ပါတယ်။
