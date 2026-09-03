---
title: "Binary Data Types (binary data type)"
description: "PostgreSQL ရဲ့ bytea type — binary data သိမ်းဆည်းခြင်း နှင့် hex/escape input/output format များ"
order: 51
source: "https://www.postgresql.org/docs/current/datatype-binary.html"
status: translated
updated: 2026-09-03
---

## 8.4. Binary Data Types (binary data type)

- **8.4.1. bytea Hex Format (bytea hex ပုံစံ)**
- **8.4.2. bytea Escape Format (bytea escape ပုံစံ)**

`bytea` data type က binary string (ဘိုင်နရီ string) တွေကို သိမ်းဆည်းနိုင်စေပါတယ်; [ဇယား 8.6](/docs/postgresql/datatype-binary) ကို ကြည့်ပါ။

**ဇယား 8.6. Binary Data Types (binary data type)**

| နာမည် | သိမ်းဆည်းမှု အရွယ်အစား | ဖော်ပြချက် |
| --- | --- | --- |
| `bytea` | actual binary string အပြင် 1 သို့မဟုတ် 4 bytes | variable-length (အလျား ပြောင်းလဲနိုင်သော) binary string |

Binary string ဆိုတာ octets (သို့မဟုတ် bytes) တွေရဲ့ အစီအစဉ် (sequence) တစ်ခုပါ။ Binary strings တွေကို character strings တွေကနေ ခွဲခြားပေးတဲ့ အချက် နှစ်ခု ရှိပါတယ်။ ပထမ — binary strings တွေက တန်ဖိုး သုည ရှိတဲ့ octets တွေနဲ့ တခြား “non-printable” (ပုံနှိပ်၍ မရသော) octets (ပုံမှန်အားဖြင့် decimal 32 ကနေ 126 အကွာအဝေး အပြင်ဘက်က octets) တွေကို သိမ်းဆည်းခွင့် ပြုပါတယ်။ Character strings တွေက zero octets တွေကို တားမြစ်ပြီး — database ရဲ့ ရွေးချယ်ထားတဲ့ character set encoding (စာလုံး ကုဒ်ပြောင်း စနစ်) အရ မမှန်ကန်တဲ့ တခြား octet တန်ဖိုးတွေနဲ့ octet တန်ဖိုး အစီအစဉ်တွေကိုလည်း တားမြစ်ပါတယ်။ ဒုတိယ — binary strings တွေအပေါ်မှာ လုပ်ဆောင်မှုတွေက နဂို bytes တွေကို process (လုပ်ဆောင်) ပြီး — character strings တွေရဲ့ processing ကတော့ locale settings (ဒေသဆိုင်ရာ သတ်မှတ်ချက်များ) ပေါ်မှာ မူတည်ပါတယ်။ အတိုချုပ်ပြောရရင် — programmer က “raw bytes” (ပုံစံ မပြောင်းလဲရသေးသော bytes) လို့ ယူဆတဲ့ data တွေကို သိမ်းဆည်းဖို့ binary strings တွေက သင့်တော်ပြီး — text တွေကို သိမ်းဆည်းဖို့ကတော့ character strings တွေက သင့်တော်ပါတယ်။

`bytea` type က input ရော output အတွက်ပါ format နှစ်မျိုး ထောက်ပံ့ပါတယ်: “hex” format နဲ့ PostgreSQL ရဲ့ သမိုင်းဝင် “escape” format တို့ပါ။ Input မှာတော့ နှစ်မျိုးလုံးကို အမြဲ လက်ခံပါတယ်။ Output format ကတော့ configuration parameter [bytea_output](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-BYTEA-OUTPUT) အပေါ်မှာ မူတည်ပြီး — default ကတော့ hex ပါ။ (hex format ကို PostgreSQL 9.0 မှာ စတင် မိတ်ဆက်ခဲ့တာမို့ — အရင်ဗားရှင်းတွေနဲ့ tool တချို့က ဒါကို နားမလည်နိုင်တာ သတိပြုပါ။)

SQL standard က `BLOB` သို့မဟုတ် `BINARY LARGE OBJECT` လို့ ခေါ်တဲ့ မတူညီတဲ့ binary string type တစ်မျိုးကို သတ်မှတ်ပါတယ်။ Input format က `bytea` နဲ့ မတူပေမယ့် — ပေးထားတဲ့ functions နဲ့ operators တွေကတော့ အများစု အတူတူပါပဲ။

### 8.4.1. `bytea` Hex Format (`bytea` hex ပုံစံ)

“hex” format က binary data ကို byte တစ်ခုလျှင် hexadecimal digit (ဆယ့်ခြောက်လွန်း ဂဏန်း) နှစ်လုံးနဲ့ — most significant nibble (တန်ဖိုး အကြီးဆုံး နေရာမှ nibble) က ရှေ့ဆုံး ထားပြီး — encode (ကုဒ်ပြောင်း) လုပ်ပါတယ်။ String တစ်ခုလုံးရဲ့ ရှေ့မှာ `\x` sequence ကို ထည့်ပေးပါတယ် (escape format နဲ့ ခွဲခြားဖို့ပါ)။ Context တချို့မှာ — ရှေ့ဆုံး backslash ကို နှစ်ထပ် (doubling) လုပ်ပြီး escape လုပ်ဖို့ လိုနိုင်ပါတယ် ([အပိုင်း 4.1.2.1](/docs/postgresql/sql-syntax-lexical) ကို ကြည့်ပါ)။ Input အတွက် — hexadecimal digits တွေက upper case ဖြစ်စေ lower case ဖြစ်စေ ရပြီး — digit အတွဲတွေကြားမှာ whitespace (နေရာလပ်) ကို ခွင့်ပြုပါတယ် (ဒါပေမယ့် digit အတွဲ တစ်အတွဲအတွင်းမှာရော စတဲ့ `\x` sequence ထဲမှာပါ ခွင့်မပြုပါဘူး)။ Hex format က ကျယ်ပြန့်တဲ့ external application တွေနဲ့ protocols တွေနဲ့ compatible (လိုက်ဖက်ညီ) ဖြစ်ပြီး — escape format ထက် ပြောင်းဖို့ (convert) ပိုမြန်တတ်လို့ — အသုံးပြုဖို့ ပိုနှစ်သက်ပါတယ်။

ဥပမာ:

```sql
SET bytea_output = 'hex';

SELECT '\xDEADBEEF'::bytea;
   bytea
------------
 \xdeadbeef
```

### 8.4.2. `bytea` Escape Format (`bytea` escape ပုံစံ)

“escape” format က `bytea` type အတွက် PostgreSQL ရဲ့ ရိုးရာ (traditional) format ပါ။ ၎င်းက binary string တစ်ခုကို ASCII characters တွေရဲ့ အစီအစဉ်အဖြစ် ကိုယ်စားပြုတဲ့ ချဉ်းကပ်နည်းကို သုံးပြီး — ASCII character အဖြစ် ကိုယ်စားပြုလို့ မရတဲ့ bytes တွေကိုတော့ special escape sequences တွေအဖြစ် ပြောင်းပေးပါတယ်။ Application ရဲ့ ရှုထောင့်ကကြည့်ရင် bytes တွေကို characters အဖြစ် ကိုယ်စားပြုတာ အဓိပ္ပာယ် ရှိတယ်ဆိုရင် — ဒီ representation (ကိုယ်စားပြုပုံ) က အဆင်ပြေနိုင်ပါတယ်။ ဒါပေမယ့် လက်တွေ့မှာတော့ — binary strings နဲ့ character strings ကြားက ခြားနားချက်ကို ဝေဝါးသွားစေပြီး — ရွေးချယ်ထားတဲ့ escape mechanism ကလည်း အတော်လေး မလွယ်ကူ (unwieldy) တာမို့ — များသောအားဖြင့် ရှုပ်ထွေးစေပါတယ်။ ဒါကြောင့် — application အသစ် အများစုအတွက်တော့ ဒီ format ကို ရှောင်သင့်ပါတယ်။

Escape format နဲ့ `bytea` values တွေ ထည့်သွင်းတဲ့အခါ — တန်ဖိုး တချို့ရှိတဲ့ octets တွေကို escape လုပ်ရမှာ ဖြစ်ပြီး — octet တန်ဖိုး အားလုံးကိုတော့ escape လုပ်လို့ ရပါတယ်။ ယေဘုယျအားဖြင့် — octet တစ်ခုကို escape လုပ်ဖို့ — ၎င်းကို ဂဏန်း သုံးလုံး ပါတဲ့ octal value (ရှစ်လွန်း တန်ဖိုး) အဖြစ် ပြောင်းပြီး backslash တစ်ခုနဲ့ ရှေ့ဆွဲပါ။ Backslash ကိုယ်တိုင် (octet decimal value 92) ကိုတော့ backslash နှစ်ခု (double backslash) နဲ့လည်း ကိုယ်စားပြုလို့ ရပါတယ်။ [ဇယား 8.7](/docs/postgresql/datatype-binary) က escape လုပ်ရမယ့် character တွေကို ပြပြီး — သင့်တော်တဲ့ နေရာတွေမှာ ရွေးစရာ escape sequences တွေကိုပါ ပေးထားပါတယ်။

**ဇယား 8.7. bytea Literal Escaped Octets (bytea literal escape လုပ်ထားသော octets များ)**

| Decimal Octet Value (decimal octet တန်ဖိုး) | ဖော်ပြချက် | Escaped Input Representation (escape လုပ်ထားသော input ကိုယ်စားပြုပုံ) | ဥပမာ | Hex Representation (hex ကိုယ်စားပြုပုံ) |
| --- | --- | --- | --- | --- |
| 0 | zero octet (တန်ဖိုး သုည ရှိသော octet) | `'\000'` | `'\000'::bytea` | `\x00` |
| 39 | single quote (တစ်ခုတည်းသော quote သင်္ကေတ) | `''''` or `'\047'` | `''''::bytea` | `\x27` |
| 92 | backslash | `'\\'` or `'\134'` | `'\\'::bytea` | `\x5c` |
| 0 to 31 and 127 to 255 | “non-printable” (ပုံနှိပ်၍ မရသော) octets | `'\xxx'` (octal တန်ဖိုး) | `'\001'::bytea` | `\x01` |

Non-printable octets တွေကို escape လုပ်ဖို့ လိုအပ်မှုက locale settings အပေါ်မှာ မူတည်ပါတယ်။ ကိစ္စ တချို့မှာ သူတို့ကို escape မလုပ်ဘဲ ထားလိုက်ရင်လည်း ရပါတယ်။

[ဇယား 8.7](/docs/postgresql/datatype-binary) မှာ ပြထားသလို single quotes တွေကို နှစ်ထပ် လုပ်ရတဲ့ အကြောင်းရင်းက — SQL command တစ်ခုထဲက string literal တိုင်းအတွက် ဒါက မှန်လို့ပါ။ Generic string-literal parser (ယေဘုယျ string-literal ခွဲခြမ်းစိတ်ဖြာစက်) က အပြင်ဘက် single quotes တွေကို စားသုံးပြီး — single quote အတွဲ တိုင်းကို data character တစ်လုံးအဖြစ် လျှော့ချပေးပါတယ်။ `bytea` input function က မြင်ရတာက single quote တစ်လုံးတည်း ဖြစ်ပြီး — ၎င်းကို သာမန် data character တစ်ခုအနေနဲ့ သဘောထားပါတယ်။ ဒါပေမယ့် — `bytea` input function က backslashes တွေကို special (အထူး) အဖြစ် သဘောထားပြီး — [ဇယား 8.7](/docs/postgresql/datatype-binary) မှာ ပြထားတဲ့ တခြား အပြုအမူတွေကိုလည်း အဲဒီ function က အကောင်အထည်ဖော်ပါတယ်။

Context တချို့မှာ — generic string-literal parser က backslash အတွဲတွေကိုလည်း data character တစ်လုံးအဖြစ် လျှော့ချပေးလို့ — အပေါ်မှာ ပြထားတာထက် backslashes တွေကို နှစ်ဆ လုပ်ရပါတယ်; [အပိုင်း 4.1.2.1](/docs/postgresql/sql-syntax-lexical) ကို ကြည့်ပါ။

`bytea` octets တွေကို default အနေနဲ့ `hex` format နဲ့ output လုပ်ပါတယ်။ [bytea_output](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-BYTEA-OUTPUT) ကို `escape` လို့ ပြောင်းလိုက်ရင် — “non-printable” octets တွေကို သူတို့နဲ့ ညီမျှတဲ့ ဂဏန်း သုံးလုံး octal value အဖြစ် ပြောင်းပြီး backslash တစ်ခုနဲ့ ရှေ့ဆွဲပါတယ်။ “printable” octets အများစုကိုတော့ client character set ထဲမှာ သူတို့ရဲ့ standard representation (ပုံမှန် ကိုယ်စားပြုပုံ) နဲ့ output လုပ်ပါတယ်၊ ဥပမာ:

```sql
SET bytea_output = 'escape';

SELECT 'abc \153\154\155 \052\251\124'::bytea;
     bytea
----------------
 abc klm *\251T
```

Decimal value 92 (backslash) ရှိတဲ့ octet ကို output ထဲမှာ နှစ်ထပ် လုပ်ပါတယ်။ အသေးစိတ်တွေကို [ဇယား 8.8](/docs/postgresql/datatype-binary) မှာ ကြည့်ပါ။

**ဇယား 8.8. bytea Output Escaped Octets (bytea output escape လုပ်ထားသော octets များ)**

| Decimal Octet Value (decimal octet တန်ဖိုး) | ဖော်ပြချက် | Escaped Output Representation (escape လုပ်ထားသော output ကိုယ်စားပြုပုံ) | ဥပမာ | Output Result (output ရလဒ်) |
| --- | --- | --- | --- | --- |
| 92 | backslash | `\\` | `'\134'::bytea` | `\\` |
| 0 to 31 and 127 to 255 | “non-printable” (ပုံနှိပ်၍ မရသော) octets | `\xxx` (octal တန်ဖိုး) | `'\001'::bytea` | `\001` |
| 32 to 126 | “printable” (ပုံနှိပ်၍ ရသော) octets | client character set ရဲ့ representation (ကိုယ်စားပြုပုံ) | `'\176'::bytea` | `~` |

PostgreSQL ရဲ့ front end ဘယ်ဟာကို သုံးလဲပေါ် မူတည်ပြီး — `bytea` strings တွေကို escaping နဲ့ unescaping (escape ပြန်ဖြေခြင်း) လုပ်ရာမှာ ထပ်ဆောင်း အလုပ် ရှိနိုင်ပါတယ်။ ဥပမာ — သင့် interface က line feeds နဲ့ carriage returns တွေကို အလိုအလျောက် ဘာသာပြောင်းပေးတယ်ဆိုရင် — အဲဒါတွေကိုပါ escape လုပ်ဖို့ လိုနိုင်ပါတယ်။
