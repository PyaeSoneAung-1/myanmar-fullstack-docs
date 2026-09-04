---
title: "String Functions and Operators (string လုပ်ဆောင်ချက်များနှင့် operator များ)"
description: "PostgreSQL ၏ string functions များနှင့် operators များ — string တန်ဖိုးများကို စစ်ဆေးခြင်းနှင့် ပြုပြင်ခြင်း၊ SQL string functions နှင့် အခြား string functions/operators ဇယားများ၊ format() function နှင့် ၎င်း၏ format specifiers အသေးစိတ်"
order: 71
source: "https://www.postgresql.org/docs/current/functions-string.html"
status: translated
updated: 2026-09-04
---

## 9.4. String Functions and Operators (string လုပ်ဆောင်ချက်များနှင့် operator များ)

ဒီ section မှာ — string တန်ဖိုးတွေကို စစ်ဆေးခြင်း (examining) နဲ့ ပြုပြင်ခြင်း (manipulating) အတွက် — functions နဲ့ operator တွေကို ဖော်ပြထားပါတယ်။ ဒီနေရာမှာ string ဆိုတာ — `character`၊ `character varying` နဲ့ `text` type တွေရဲ့ တန်ဖိုးတွေကို ရည်ညွှန်းပါတယ်။ အထူး မှတ်သားထားတာများ မရှိရင် — ဒီ functions နဲ့ operator တွေက `text` type ကို လက်ခံပြီး ပြန်ထုတ်ပေးဖို့ ကြေညာထားပါတယ်။ ၎င်းတို့က `character varying` arguments တွေကိုလည်း အပြန်အလှန် လက်ခံပါတယ်။ `character` type တန်ဖိုးတွေကိုတော့ — function ဒါမှမဟုတ် operator ကို အသုံးမပြုခင် — `text` အဖြစ် ပြောင်းလဲပေးပြီး — `character` တန်ဖိုးထဲက နောက်ဆုံးက space တွေကို ဖယ်ရှားခံရပါတယ်။

SQL မှာ — arguments တွေကို ကော်မာတွေနဲ့ မဟုတ်ဘဲ key words တွေနဲ့ ခွဲခြားတဲ့ string functions တချို့ကို သတ်မှတ်ထားပါတယ်။ အသေးစိတ်ကို ဇယား 9.9 မှာ ကြည့်နိုင်ပါတယ်။ PostgreSQL က ဒီ functions တွေရဲ့ — ပုံမှန် function ခေါ်ဆိုမှု syntax (regular function invocation syntax) သုံးတဲ့ — ဗားရှင်းတွေကိုလည်း ပေးထားပါတယ် (ဇယား 9.10 ကို ကြည့်ပါ)။

> **မှတ်ချက်:** string concatenation operator (`||`) က — input နှစ်ခုထဲမှာ အနည်းဆုံး တစ်ခု string type ဖြစ်နေသမျှ — string မဟုတ်တဲ့ input တွေကိုပါ လက်ခံပါတယ် — ဇယား 9.9 မှာ ပြထားတဲ့အတိုင်းပါ။ တခြား ကိစ္စတွေမှာတော့ — `text` ဆီ ရှင်းလင်းတဲ့ coercion (ပြောင်းလဲခြင်း) တစ်ခု ထည့်သွင်းခြင်းဖြင့် — string မဟုတ်တဲ့ input ကို လက်ခံစေနိုင်ပါတယ်။

**ဇယား 9.9. SQL String Functions and Operators (SQL string လုပ်ဆောင်ချက်များနှင့် operator များ)**

| Function/Operator ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| text \|\| text → text string နှစ်ခုကို ဆက်စပ်ပေးပါတယ်။ 'Post' \|\| 'PostgreSQL' → PostgreSQL |
| text \|\| anynonarray → text anynonarray \|\| text → text string မဟုတ်တဲ့ input ကို text အဖြစ် ပြောင်းပြီးမှ — string နှစ်ခုကို ဆက်စပ်ပေးပါတယ်။ (string မဟုတ်တဲ့ input က array type မဖြစ်နိုင်ပါ — array \|\| operator တွေနဲ့ ရှုပ်ထွေးမှု (ambiguity) ဖြစ်စေနိုင်လို့ပါ။ Array တစ်ခုရဲ့ text နဲ့ ညီမျှတဲ့ ပုံစံကို ဆက်စပ်ချင်ရင် — အဲဒါကို text ဆီ တိုက်ရိုက် cast လုပ်ပါ။) 'Value: ' \|\| 42 → Value: 42 |
| btrim ( string text [, characters text ] ) → text string ရဲ့ အစနဲ့ အဆုံးကနေ — characters ထဲမှာပဲ ပါဝင်တဲ့ (မူရင်းအတိုင်းဆိုရင် space တစ်ခု) အရှည်ဆုံး string ကို ဖယ်ရှားပေးပါတယ်။ btrim('xyxtrimyyx', 'xyz') → trim |
| text IS [NOT] [form] NORMALIZED → boolean string က သတ်မှတ်ထားတဲ့ Unicode normalization form ထဲမှာ ရှိမရှိ စစ်ဆေးပါတယ်။ Optional ဖြစ်တဲ့ form key word က form ကို သတ်မှတ်ပေးပါတယ်: NFC (မူရင်း default)၊ NFD၊ NFKC ဒါမှမဟုတ် NFKD။ ဒီ expression ကို server encoding က UTF8 ဖြစ်တဲ့အခါမှပဲ သုံးလို့ရပါတယ်။ ဒီ expression နဲ့ normalization စစ်ဆေးတာက — ဖြစ်နိုင်ခြေရှိတဲ့ normalize လုပ်ပြီးသား strings တွေကို normalize လုပ်ဖို့ ကြိုးစားတာထက် — မကြာခဏ ပိုမြန်ပါတယ်ဆိုတာ သတိပြုပါ။ U&'\0061\0308bc' IS NFD NORMALIZED → t |
| bit_length ( text ) → integer string ထဲက bits အရေအတွက်ကို ပြန်ပေးပါတယ် (octet_length ရဲ့ 8 ဆ)။ bit_length('jose') → 32 |
| char_length ( text ) → integer character_length ( text ) → integer string ထဲက characters အရေအတွက်ကို ပြန်ပေးပါတယ်။ char_length('josé') → 4 |
| lower ( text ) → text database ရဲ့ locale စည်းမျဉ်းတွေအတိုင်း — string တစ်ခုလုံးကို စာလုံးငယ် (lower case) အဖြစ် ပြောင်းပေးပါတယ်။ lower('TOM') → tom |
| lpad ( string text, length integer [, fill text ] ) → text string ကို အလျား length အထိ — fill characters တွေကို ရှေ့ကနေ ထည့်သွင်းခြင်းဖြင့် (မူရင်းအတိုင်းဆိုရင် space) ချဲ့ပေးပါတယ်။ String က length ထက် ပိုရှည်နေပြီဆိုရင် — (ညာဘက်ကနေ) ဖြတ်တောက်ပစ်ပါတယ် (truncate လုပ်ပါတယ်)။ lpad('hi', 5, 'xy') → xyxhi |
| ltrim ( string text [, characters text ] ) → text string ရဲ့ အစကနေ — characters ထဲမှာပဲ ပါဝင်တဲ့ (မူရင်းအတိုင်းဆိုရင် space တစ်ခု) အရှည်ဆုံး string ကို ဖယ်ရှားပေးပါတယ်။ ltrim('zzzytest', 'xyz') → test |
| normalize ( text [, form ] ) → text string ကို သတ်မှတ်ထားတဲ့ Unicode normalization form အဖြစ် ပြောင်းပေးပါတယ်။ Optional ဖြစ်တဲ့ form key word က form ကို သတ်မှတ်ပေးပါတယ်: NFC (မူရင်း default)၊ NFD၊ NFKC ဒါမှမဟုတ် NFKD။ ဒီ function ကို server encoding က UTF8 ဖြစ်တဲ့အခါမှပဲ သုံးလို့ရပါတယ်။ normalize(U&'\0061\0308bc', NFC) → U&'\00E4bc' |
| octet_length ( text ) → integer string ထဲက bytes အရေအတွက်ကို ပြန်ပေးပါတယ်။ octet_length('josé') → 5 (if server encoding is UTF8) |
| octet_length ( character ) → integer string ထဲက bytes အရေအတွက်ကို ပြန်ပေးပါတယ်။ ဒီ function ဗားရှင်းက type character ကို တိုက်ရိုက် လက်ခံတာမို့ — နောက်ဆုံးက space တွေကို ဖယ်ရှားမှာ မဟုတ်ပါဘူး။ octet_length('abc '::character(4)) → 4 |
| overlay ( string text PLACING newsubstring text FROM start integer [ FOR count integer ] ) → text string ထဲမှာ — start'th character ကနေ စပြီး count characters အထိ ရှိတဲ့ substring ကို — newsubstring နဲ့ အစားထိုးပေးပါတယ်။ count ကို ချန်လိုက်ရင် — newsubstring ရဲ့ အလျားကို မူရင်း (default) အဖြစ် သုံးပါတယ်။ overlay('Txxxxas' placing 'hom' from 2 for 4) → Thomas |
| position ( substring text IN string text ) → integer string ထဲမှာ သတ်မှတ်ထားတဲ့ substring ရဲ့ ပထမဆုံး စတင်သည့် index ကို ပြန်ပေးပါတယ် — မတွေ့ရရင် သုည ဖြစ်ပါတယ်။ position('om' in 'Thomas') → 3 |
| rpad ( string text, length integer [, fill text ] ) → text string ကို အလျား length အထိ — fill characters တွေကို နောက်ကနေ ထည့်သွင်းခြင်းဖြင့် (မူရင်းအတိုင်းဆိုရင် space) ချဲ့ပေးပါတယ်။ String က length ထက် ပိုရှည်နေပြီဆိုရင် — ဖြတ်တောက်ပစ်ပါတယ်။ rpad('hi', 5, 'xy') → hixyx |
| rtrim ( string text [, characters text ] ) → text string ရဲ့ အဆုံးကနေ — characters ထဲမှာပဲ ပါဝင်တဲ့ (မူရင်းအတိုင်းဆိုရင် space တစ်ခု) အရှည်ဆုံး string ကို ဖယ်ရှားပေးပါတယ်။ rtrim('testxxzx', 'xyz') → test |
| substring ( string text [ FROM start integer ] [ FOR count integer ] ) → text string ထဲက — သတ်မှတ်ထားရင် start'th character ကနေ စပြီး — သတ်မှတ်ထားရင် count characters အထိ ရှိတဲ့ substring ကို ထုတ်ယူပေးပါတယ်။ start နဲ့ count ထဲက အနည်းဆုံး တစ်ခုကို ပေးပါ။ substring('Thomas' from 2 for 3) → hom substring('Thomas' from 3) → omas substring('Thomas' for 2) → Th |
| substring ( string text FROM pattern text ) → text POSIX regular expression နဲ့ ကိုက်ညီတဲ့ ပထမဆုံး substring ကို ထုတ်ယူပေးပါတယ်; အပိုင်း 9.7.3 ကို ကြည့်ပါ။ substring('Thomas' from '...$') → mas |
| substring ( string text SIMILAR pattern text ESCAPE escape text ) → text substring ( string text FROM pattern text FOR escape text ) → text SQL regular expression နဲ့ ကိုက်ညီတဲ့ ပထမဆုံး substring ကို ထုတ်ယူပေးပါတယ်; အပိုင်း 9.7.2 ကို ကြည့်ပါ။ ပထမ ပုံစံကို SQL:2003 ကတည်းက သတ်မှတ်ခဲ့ပြီး — ဒုတိယ ပုံစံကတော့ SQL:1999 မှာပဲ ရှိခဲ့တာဖြစ်လို့ — obsolete (ခေတ်ကုန်) အဖြစ် သတ်မှတ်သင့်ပါတယ်။ substring('Thomas' similar '%#"o_a#"_' escape '#') → oma |
| trim ( [ LEADING \| TRAILING \| BOTH ] [ characters text ] FROM string text ) → text string ရဲ့ — အစ၊ အဆုံး ဒါမှမဟုတ် နှစ်ဖက်စလုံး (BOTH က မူရင်း default) ကနေ — characters ထဲမှာပဲ ပါဝင်တဲ့ (မူရင်းအတိုင်းဆိုရင် space တစ်ခု) အရှည်ဆုံး string ကို ဖယ်ရှားပေးပါတယ်။ trim(both 'xyz' from 'yxTomxx') → Tom |
| trim ( [ LEADING \| TRAILING \| BOTH ] [ FROM ] string text [, characters text ] ) → text ဒါက trim() ရဲ့ standard မဟုတ်တဲ့ syntax တစ်ခုပါ။ trim(both from 'yxTomxx', 'xyz') → Tom |
| unicode_assigned ( text ) → boolean string ထဲက characters အားလုံး သတ်မှတ်ပြီးသား (assigned) Unicode codepoints တွေ ဖြစ်ရင် true ပြန်ပေးပြီး — မဟုတ်ရင် false ပြန်ပေးပါတယ်။ ဒီ function ကို server encoding က UTF8 ဖြစ်တဲ့အခါမှပဲ သုံးလို့ရပါတယ်။ |
| upper ( text ) → text database ရဲ့ locale စည်းမျဉ်းတွေအတိုင်း — string တစ်ခုလုံးကို စာလုံးကြီး (upper case) အဖြစ် ပြောင်းပေးပါတယ်။ upper('tom') → TOM |

string ပြုပြင်ခြင်း (manipulation) အတွက် နောက်ထပ် functions နဲ့ operator တွေ ရှိပြီး — ဇယား 9.10 မှာ စာရင်းပြထားပါတယ်။ (ဒီထဲက တချို့ကို — ဇယား 9.9 မှာ စာရင်းပြုထားတဲ့ SQL-standard string functions တွေကို implement လုပ်ဖို့ — အတွင်းပိုင်းမှာ သုံးပါတယ်။) ပြီးတော့ [အပိုင်း 9.7](/docs/postgresql/functions-matching) မှာ ဖော်ပြထားတဲ့ pattern-matching operator တွေနဲ့ — [အခန်း 12](https://www.postgresql.org/docs/current/textsearch.html) မှာ ဖော်ပြထားတဲ့ full-text search operator တွေလည်း ရှိပါတယ်။

**ဇယား 9.10. Other String Functions and Operators (အခြား string လုပ်ဆောင်ချက်များနှင့် operator များ)**

| Function/Operator ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| text ^@ text → boolean ပထမ string က ဒုတိယ string နဲ့ စတင်နေရင် true ပြန်ပေးပါတယ် (starts_with() function နဲ့ ညီမျှသည်)။ 'alphabet' ^@ 'alph' → t |
| ascii ( text ) → integer argument ရဲ့ ပထမဆုံး character ရဲ့ ဂဏန်း code ကို ပြန်ပေးပါတယ်။ UTF8 encoding မှာတော့ — character ရဲ့ Unicode code point ကို ပြန်ပေးပါတယ်။ တခြား multibyte encodings တွေမှာတော့ — argument က ASCII character တစ်ခု ဖြစ်ရပါမယ်။ ascii('x') → 120 |
| chr ( integer ) → text ပေးထားတဲ့ code နဲ့ ကိုက်ညီတဲ့ character ကို ပြန်ပေးပါတယ်။ UTF8 encoding မှာတော့ — argument ကို Unicode code point တစ်ခုအနေနဲ့ သဘောထားပါတယ်။ တခြား multibyte encodings တွေမှာတော့ — argument က ASCII character တစ်ခုကို သတ်မှတ်ရပါမယ်။ chr(0) ကို ခွင့်မပြုပါဘူး — text data types တွေမှာ အဲဒီ character ကို သိမ်းဆည်းလို့ မရလို့ပါ။ chr(65) → A |
| concat ( val1 "any" [, val2 "any" [, ...] ] ) → text argument တွေ အားလုံးရဲ့ text ကိုယ်စားပြုမှု (text representations) တွေကို ဆက်စပ်ပေးပါတယ်။ NULL arguments တွေကို လျစ်လျူရှုပါတယ်။ concat('abcde', 2, NULL, 22) → abcde222 |
| concat_ws ( sep text, val1 "any" [, val2 "any" [, ...] ] ) → text ပထမ argument ကလွဲပြီး ကျန်တာ အားလုံးကို — separators တွေနဲ့ — ဆက်စပ်ပေးပါတယ်။ ပထမ argument ကို separator string အဖြစ် သုံးပြီး — NULL မဖြစ်သင့်ပါဘူး။ တခြား NULL arguments တွေကိုတော့ လျစ်လျူရှုပါတယ်။ concat_ws(',', 'abcde', 2, NULL, 22) → abcde,2,22 |
| format ( formatstr text [, formatarg "any" [, ...] ] ) → text argument တွေကို format string တစ်ခုအတိုင်း format လုပ်ပေးပါတယ်; အပိုင်း 9.4.1 ကို ကြည့်ပါ။ ဒီ function က C function sprintf နဲ့ ဆင်တူပါတယ်။ format('Hello %s, %1$s', 'World') → Hello World, World |
| initcap ( text ) → text စကားလုံးတစ်လုံးစီရဲ့ ပထမစာလုံးကို စာလုံးကြီး အဖြစ်လည်းကောင်း — ကျန်တာတွေကို စာလုံးငယ် အဖြစ်လည်းကောင်း ပြောင်းပေးပါတယ်။ Words တွေဆိုတာ — alphanumeric မဟုတ်တဲ့ characters တွေနဲ့ ပိုင်းခြားထားတဲ့ — alphanumeric characters တွေရဲ့ အစီအရီတွေ ဖြစ်ပါတယ်။ initcap('hi THOMAS') → Hi Thomas |
| casefold ( text ) → text input string ကို collation အတိုင်း case folding လုပ်ပေးပါတယ်။ Case folding က case conversion နဲ့ ဆင်ပေမယ့် — case folding ရဲ့ ရည်ရွယ်ချက်က strings တွေကို case-insensitive (စာလုံးကြီး/ငယ် မခွဲခြားဘဲ) ကိုက်ညီမှု ရှိစေဖို့ ဖြစ်ပြီး — case conversion ရဲ့ ရည်ရွယ်ချက်ကတော့ တိကျတဲ့ cased form တစ်ခုဆီ ပြောင်းဖို့ ဖြစ်ပါတယ်။ ဒီ function ကို server encoding က UTF8 ဖြစ်တဲ့အခါမှပဲ သုံးလို့ရပါတယ်။ ပုံမှန်အားဖြင့် — case folding က ရိုးရိုး lowercase အဖြစ်ပဲ ပြောင်းပေးပေမယ့် — collation ပေါ် မူတည်ပြီး ခြွင်းချက်တွေ ရှိနိုင်ပါတယ်။ ဥပမာ — character တချို့မှာ lowercase မျိုးကွဲ နှစ်ခုထက် ပိုရှိတာ ဒါမှမဟုတ် uppercase အဖြစ် fold လုပ်တာမျိုး ဖြစ်နိုင်ပါတယ်။ Case folding က string ရဲ့ အလျားကိုလည်း ပြောင်းလဲစေနိုင်ပါတယ်။ ဥပမာ — PG_UNICODE_FAST collation မှာ ß (U+00DF) က ss အဖြစ် fold လုပ်ပါတယ်။ casefold ကို Unicode Default Caseless Matching အတွက် သုံးနိုင်ပါတယ်။ ဒါပေမယ့် — input string ရဲ့ normalized form ကို အမြဲတော့ ထိန်းသိမ်းပေးမှာ မဟုတ်ပါဘူး (normalize ကို ကြည့်ပါ)။ libc provider က case folding ကို မထောက်ပံ့ပါဘူး — ဒါကြောင့် casefold က lower နဲ့ တူညီပါတယ်။ |
| left ( string text, n integer ) → text string ထဲက ပထမ n characters တွေကို ပြန်ပေးပါတယ် — n က အနုတ် ဖြစ်ရင်တော့ နောက်ဆုံး \|n\| characters တွေကလွဲပြီး ကျန်တာကို ပြန်ပေးပါတယ်။ left('abcde', 2) → ab |
| length ( text ) → integer string ထဲက characters အရေအတွက်ကို ပြန်ပေးပါတယ်။ length('jose') → 4 |
| md5 ( text ) → text argument ရဲ့ MD5 hash ကို တွက်ချက်ပြီး — ရလဒ်ကို hexadecimal နဲ့ ရေးပါတယ်။ md5('abc') → 900150983cd24fb0​d6963f7d28e17f72 |
| parse_ident ( qualified_identifier text [, strict_mode boolean DEFAULT true ] ) → text[] qualified_identifier ကို identifiers တွေရဲ့ array တစ်ခုအဖြစ် ခွဲပေးပြီး — identifier တစ်ခုချင်းစီရဲ့ quoting တွေကို ဖယ်ရှားပေးပါတယ်။ မူရင်းအားဖြင့် — နောက်ဆုံး identifier ပြီးနောက်မှာ ရှိတဲ့ အပိုစာလုံးတွေကို error အဖြစ် သတ်မှတ်ပါတယ်; ဒါပေမယ့် ဒုတိယ parameter က false ဆိုရင် — အဲဒီလို အပိုစာလုံးတွေကို လျစ်လျူရှုပါတယ်။ (ဒီအပြုအမူက — functions လို objects တွေအတွက် နာမည်တွေကို parse လုပ်ရာမှာ အသုံးဝင်ပါတယ်။) ဒီ function က အလျားလွန်တဲ့ (over-length) identifiers တွေကို ဖြတ်တောက်မပေးဘူးဆိုတာ သတိပြုပါ။ ဖြတ်တောက်ချင်ရင်တော့ — ရလဒ်ကို name[] ဆီ cast လုပ်နိုင်ပါတယ်။ parse_ident('"SomeSchema".someTable') → {SomeSchema,sometable} |
| pg_client_encoding ( ) → name လက်ရှိ client encoding ရဲ့ နာမည်ကို ပြန်ပေးပါတယ်။ pg_client_encoding() → UTF8 |
| quote_ident ( text ) → text SQL statement string တစ်ခုထဲမှာ identifier တစ်ခုအနေနဲ့ သုံးဖို့ — ပေးထားတဲ့ string ကို သင့်လျော်စွာ quote လုပ်ပြီး ပြန်ပေးပါတယ်။ လိုအပ်မှသာ quotes တွေ ထည့်ပါတယ် (ဥပမာ — string ထဲမှာ identifier မဟုတ်တဲ့ characters တွေ ပါနေရင် ဒါမှမဟုတ် case-fold ဖြစ်နိုင်ရင်)။ Embedded quotes တွေကို စနစ်တကျ နှစ်ဆ (doubled) လုပ်ပေးပါတယ်။ ဥပမာ 41.1 ကိုလည်း ကြည့်ပါ။ quote_ident('Foo bar') → "Foo bar" |
| quote_literal ( text ) → text SQL statement string တစ်ခုထဲမှာ string literal တစ်ခုအနေနဲ့ သုံးဖို့ — ပေးထားတဲ့ string ကို သင့်လျော်စွာ quote လုပ်ပြီး ပြန်ပေးပါတယ်။ Embedded single-quotes နဲ့ backslashes တွေကို စနစ်တကျ နှစ်ဆ လုပ်ပေးပါတယ်။ quote_literal က null input မှာ null ပြန်ပေးတယ်ဆိုတာ သတိပြုပါ; argument က null ဖြစ်နိုင်ရင် — quote_nullable က မကြာခဏ ပိုသင့်လျော်ပါတယ်။ ဥပမာ 41.1 ကိုလည်း ကြည့်ပါ။ quote_literal(E'O\'Reilly') → 'O''Reilly' |
| quote_literal ( anyelement ) → text ပေးထားတဲ့ တန်ဖိုးကို text အဖြစ် ပြောင်းပြီး — literal တစ်ခုအနေနဲ့ quote လုပ်ပေးပါတယ်။ Embedded single-quotes နဲ့ backslashes တွေကို စနစ်တကျ နှစ်ဆ လုပ်ပေးပါတယ်။ quote_literal(42.5) → '42.5' |
| quote_nullable ( text ) → text SQL statement string တစ်ခုထဲမှာ string literal တစ်ခုအနေနဲ့ သုံးဖို့ — ပေးထားတဲ့ string ကို သင့်လျော်စွာ quote လုပ်ပြီး ပြန်ပေးပါတယ်; ဒါမှမဟုတ် argument က null ဆိုရင် — NULL ပြန်ပေးပါတယ်။ Embedded single-quotes နဲ့ backslashes တွေကို စနစ်တကျ နှစ်ဆ လုပ်ပေးပါတယ်။ ဥပမာ 41.1 ကိုလည်း ကြည့်ပါ။ quote_nullable(NULL) → NULL |
| quote_nullable ( anyelement ) → text ပေးထားတဲ့ တန်ဖိုးကို text အဖြစ် ပြောင်းပြီး — literal တစ်ခုအနေနဲ့ quote လုပ်ပေးပါတယ်; ဒါမှမဟုတ် argument က null ဆိုရင် — NULL ပြန်ပေးပါတယ်။ Embedded single-quotes နဲ့ backslashes တွေကို စနစ်တကျ နှစ်ဆ လုပ်ပေးပါတယ်။ quote_nullable(42.5) → '42.5' |
| regexp_count ( string text, pattern text [, start integer [, flags text ] ] ) → integer POSIX regular expression pattern က string ထဲမှာ ကိုက်ညီမှု ဘယ်နှစ်ကြိမ် ရှိလဲဆိုတာကို ပြန်ပေးပါတယ်; အပိုင်း 9.7.3 ကို ကြည့်ပါ။ regexp_count('123456789012', '\d\d\d', 2) → 3 |
| regexp_instr ( string text, pattern text [, start integer [, N integer [, endoption integer [, flags text [, subexpr integer ] ] ] ] ] ) → integer POSIX regular expression pattern ရဲ့ N'th ကိုက်ညီမှုက string ထဲမှာ ဖြစ်ပွားတဲ့ နေရာ (position) ကို ပြန်ပေးပါတယ် — အဲဒီလို ကိုက်ညီမှု မရှိရင် သုည ဖြစ်ပါတယ်; အပိုင်း 9.7.3 ကို ကြည့်ပါ။ regexp_instr('ABCDEF', 'c(.)(..)', 1, 1, 0, 'i') → 3 regexp_instr('ABCDEF', 'c(.)(..)', 1, 1, 0, 'i', 2) → 5 |
| regexp_like ( string text, pattern text [, flags text ] ) → boolean POSIX regular expression pattern ရဲ့ ကိုက်ညီမှုတစ်ခု string ထဲမှာ ဖြစ်ပွားမဖြစ်ပွား စစ်ဆေးပါတယ်; အပိုင်း 9.7.3 ကို ကြည့်ပါ။ regexp_like('Hello World', 'world$', 'i') → t |
| regexp_match ( string text, pattern text [, flags text ] ) → text[] string နဲ့ POSIX regular expression pattern ရဲ့ ပထမဆုံး ကိုက်ညီမှုထဲက substrings တွေကို ပြန်ပေးပါတယ်; အပိုင်း 9.7.3 ကို ကြည့်ပါ။ regexp_match('foobarbequebaz', '(bar)(beque)') → {bar,beque} |
| regexp_matches ( string text, pattern text [, flags text ] ) → setof text[] string နဲ့ POSIX regular expression pattern ရဲ့ ပထမဆုံး ကိုက်ညီမှုထဲက substrings တွေ — ဒါမှမဟုတ် g flag သုံးထားရင် အဲဒီလို ကိုက်ညီမှု အားလုံးထဲက substrings တွေကို ပြန်ပေးပါတယ်; အပိုင်း 9.7.3 ကို ကြည့်ပါ။ regexp_matches('foobarbequebaz', 'ba.', 'g') →   {bar}  {baz} |
| regexp_replace ( string text, pattern text, replacement text [, flags text ] ) → text POSIX regular expression pattern နဲ့ ပထမဆုံး ကိုက်ညီတဲ့ substring — ဒါမှမဟုတ် g flag သုံးထားရင် အဲဒီလို ကိုက်ညီမှု အားလုံးကို အစားထိုးပေးပါတယ်; အပိုင်း 9.7.3 ကို ကြည့်ပါ။ regexp_replace('Thomas', '.[mN]a.', 'M') → ThM |
| regexp_replace ( string text, pattern text, replacement text, start integer [, N integer [, flags text ] ] ) → text POSIX regular expression pattern ရဲ့ N'th ကိုက်ညီမှု ဖြစ်တဲ့ substring — N က သုည ဆိုရင် အဲဒီလို ကိုက်ညီမှု အားလုံးကို — search က string ရဲ့ start'th character ကနေ စတင်ပြီး အစားထိုးပေးပါတယ်။ N ကို ချန်လိုက်ရင် — 1 လို့ မူရင်း (default) အဖြစ် သတ်မှတ်ပါတယ်။ အပိုင်း 9.7.3 ကို ကြည့်ပါ။ regexp_replace('Thomas', '.', 'X', 3, 2) → ThoXas regexp_replace(string=>'hello world', pattern=>'l', replacement=>'XX', start=>1, "N"=>2) → helXXo world |
| regexp_split_to_array ( string text, pattern text [, flags text ] ) → text[] string ကို POSIX regular expression တစ်ခုကို delimiter အဖြစ် သုံးပြီး ခွဲကာ — ရလဒ်တွေရဲ့ array တစ်ခု ထုတ်ပေးပါတယ်; အပိုင်း 9.7.3 ကို ကြည့်ပါ။ regexp_split_to_array('hello world', '\s+') → {hello,world} |
| regexp_split_to_table ( string text, pattern text [, flags text ] ) → setof text string ကို POSIX regular expression တစ်ခုကို delimiter အဖြစ် သုံးပြီး ခွဲကာ — ရလဒ်တွေရဲ့ set တစ်ခု ထုတ်ပေးပါတယ်; အပိုင်း 9.7.3 ကို ကြည့်ပါ။ regexp_split_to_table('hello world', '\s+') →   hello  world |
| regexp_substr ( string text, pattern text [, start integer [, N integer [, flags text [, subexpr integer ] ] ] ] ) → text POSIX regular expression pattern ရဲ့ N'th ပေါ်ပွားမှု (occurrence) နဲ့ ကိုက်ညီတဲ့ string ထဲက substring ကို ပြန်ပေးပါတယ် — အဲဒီလို ကိုက်ညီမှု မရှိရင် NULL ဖြစ်ပါတယ်; အပိုင်း 9.7.3 ကို ကြည့်ပါ။ regexp_substr('ABCDEF', 'c(.)(..)', 1, 1, 'i') → CDEF regexp_substr('ABCDEF', 'c(.)(..)', 1, 1, 'i', 2) → EF |
| repeat ( string text, number integer ) → text string ကို သတ်မှတ်ထားတဲ့ အကြိမ်အရေအတွက် ထပ်ခါထပ်ခါ လုပ်ပေးပါတယ်။ repeat('Pg', 4) → PgPgPgPg |
| replace ( string text, from text, to text ) → text string ထဲမှာ from ဆိုတဲ့ substring ရဲ့ ပေါ်ပွားမှု အားလုံးကို — to ဆိုတဲ့ substring နဲ့ အစားထိုးပေးပါတယ်။ replace('abcdefabcdef', 'cd', 'XX') → abXXefabXXef |
| reverse ( text ) → text string ထဲက characters တွေရဲ့ အစီအစဉ်ကို ပြောင်းပြန် လှန်ပေးပါတယ်။ reverse('abcde') → edcba |
| right ( string text, n integer ) → text string ထဲက နောက်ဆုံး n characters တွေကို ပြန်ပေးပါတယ် — n က အနုတ် ဖြစ်ရင်တော့ ပထမ \|n\| characters တွေကလွဲပြီး ကျန်တာကို ပြန်ပေးပါတယ်။ right('abcde', 2) → de |
| split_part ( string text, delimiter text, n integer ) → text string ကို delimiter ရဲ့ ပေါ်ပွားမှုတွေမှာ ခွဲပြီး — n'th field ကို ပြန်ပေးပါတယ် (တစ်ကနေ စရေတွက်သည်) — n က အနုတ် ဖြစ်ရင်တော့ နောက်ဆုံးကနေ \|n\|'th field ကို ပြန်ပေးပါတယ်။ split_part('abc~@~def~@~ghi', '~@~', 2) → def split_part('abc,def,ghi,jkl', ',', -2) → ghi |
| starts_with ( string text, prefix text ) → boolean string က prefix နဲ့ စတင်နေရင် true ပြန်ပေးပါတယ်။ starts_with('alphabet', 'alph') → t |
| string_to_array ( string text, delimiter text [, null_string text ] ) → text[] string ကို delimiter ရဲ့ ပေါ်ပွားမှုတွေမှာ ခွဲပြီး — ရလဒ် fields တွေကနေ text array တစ်ခု ဖွဲ့ပေးပါတယ်။ delimiter က NULL ဆိုရင် — string ထဲက character တစ်ခုချင်းစီက array ထဲမှာ သီးခြား element တစ်ခု ဖြစ်လာပါတယ်။ delimiter က empty string ဆိုရင် — string တစ်ခုလုံးကို field တစ်ခုတည်းအနေနဲ့ သဘောထားပါတယ်။ null_string ကို ပေးထားပြီး NULL မဟုတ်ရင် — အဲဒီ string နဲ့ ကိုက်ညီတဲ့ fields တွေကို NULL နဲ့ အစားထိုးပါတယ်။ array_to_string ကိုလည်း ကြည့်ပါ။ string_to_array('xx~~yy~~zz', '~~', 'yy') → {xx,NULL,zz} |
| string_to_table ( string text, delimiter text [, null_string text ] ) → setof text string ကို delimiter ရဲ့ ပေါ်ပွားမှုတွေမှာ ခွဲပြီး — ရလဒ် fields တွေကို text rows တွေရဲ့ set တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ delimiter က NULL ဆိုရင် — string ထဲက character တစ်ခုချင်းစီက ရလဒ်ရဲ့ သီးခြား row တစ်ခု ဖြစ်လာပါတယ်။ delimiter က empty string ဆိုရင် — string တစ်ခုလုံးကို field တစ်ခုတည်းအနေနဲ့ သဘောထားပါတယ်။ null_string ကို ပေးထားပြီး NULL မဟုတ်ရင် — အဲဒီ string နဲ့ ကိုက်ညီတဲ့ fields တွေကို NULL နဲ့ အစားထိုးပါတယ်။ string_to_table('xx~^~yy~^~zz', '~^~', 'yy') →   xx  NULL  zz |
| strpos ( string text, substring text ) → integer string ထဲမှာ သတ်မှတ်ထားတဲ့ substring ရဲ့ ပထမဆုံး စတင်သည့် index ကို ပြန်ပေးပါတယ် — မတွေ့ရရင် သုည ဖြစ်ပါတယ်။ (position(substring in string) နဲ့ တူညီပေမယ့် — argument တွေရဲ့ အစီအစဉ် ပြောင်းပြန် ဖြစ်တာကို သတိပြုပါ။) strpos('high', 'ig') → 2 |
| substr ( string text, start integer [, count integer ] ) → text string ထဲက — start'th character ကနေ စပြီး — သတ်မှတ်ထားရင် count characters အထိ ရှိတဲ့ substring ကို ထုတ်ယူပေးပါတယ်။ (substring(string from start for count) နဲ့ တူညီပါတယ်။) substr('alphabet', 3) → phabet substr('alphabet', 3, 2) → ph |
| to_ascii ( string text ) → text to_ascii ( string text, encoding name ) → text to_ascii ( string text, encoding integer ) → text string ကို တခြား encoding တစ်ခုကနေ ASCII အဖြစ် ပြောင်းပေးပါတယ် — အဲဒီ encoding ကို နာမည် ဒါမှမဟုတ် နံပါတ်နဲ့ ခွဲခြားနိုင်ပါတယ်။ encoding ကို ချန်လိုက်ရင် — database encoding လို့ ယူဆပါတယ် (လက်တွေ့မှာ အသုံးဝင်တဲ့ တစ်ခုတည်းသော ကိစ္စ ဖြစ်ပါတယ်)။ ဒီ conversion က အဓိကအားဖြင့် — accents တွေကို ဖယ်ရှားခြင်း ဖြစ်ပါတယ်။ Conversion ကို LATIN1၊ LATIN2၊ LATIN9 နဲ့ WIN1250 encodings တွေကနေပဲ ထောက်ပံ့ပါတယ်။ (နောက်ထပ် ပိုပြီး ပြောင်းလွယ်တဲ့ ဖြေရှင်းနည်းတစ်ခုအတွက် unaccent module ကို ကြည့်ပါ။) to_ascii('Karél') → Karel |
| to_bin ( integer ) → text to_bin ( bigint ) → text ဂဏန်းကို ၎င်းနဲ့ ညီမျှတဲ့ two's complement binary ကိုယ်စားပြုမှုအဖြစ် ပြောင်းပေးပါတယ်။ to_bin(2147483647) → 1111111111111111111111111111111 to_bin(-1234) → 11111111111111111111101100101110 |
| to_hex ( integer ) → text to_hex ( bigint ) → text ဂဏန်းကို ၎င်းနဲ့ ညီမျှတဲ့ two's complement hexadecimal ကိုယ်စားပြုမှုအဖြစ် ပြောင်းပေးပါတယ်။ to_hex(2147483647) → 7fffffff to_hex(-1234) → fffffb2e |
| to_oct ( integer ) → text to_oct ( bigint ) → text ဂဏန်းကို ၎င်းနဲ့ ညီမျှတဲ့ two's complement octal ကိုယ်စားပြုမှုအဖြစ် ပြောင်းပေးပါတယ်။ to_oct(2147483647) → 17777777777 to_oct(-1234) → 37777775456 |
| translate ( string text, from text, to text ) → text string ထဲမှာ from set ထဲက character တစ်ခုခုနဲ့ ကိုက်ညီတဲ့ character တစ်ခုချင်းစီကို — to set ထဲက သက်ဆိုင်ရာ character နဲ့ အစားထိုးပေးပါတယ်။ from က to ထက် ပိုရှည်ရင် — from ထဲက အပို characters တွေရဲ့ ပေါ်ပွားမှုတွေကို ဖျက်ပစ်ပါတယ်။ translate('12345', '143', 'ax') → a2x5 |
| unistr ( text ) → text argument ထဲက escaped Unicode characters တွေကို အကဲဖြတ် (evaluate) ပေးပါတယ်။ Unicode characters တွေကို \XXXX (hexadecimal ဂဏန်း 4 လုံး)၊ \+XXXXXX (hexadecimal ဂဏန်း 6 လုံး)၊ \uXXXX (hexadecimal ဂဏန်း 4 လုံး) ဒါမှမဟုတ် \UXXXXXXXX (hexadecimal ဂဏန်း 8 လုံး) အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။ Backslash တစ်ခုကို သတ်မှတ်ချင်ရင် — backslash နှစ်ခု ရေးပါ။ တခြား characters တွေ အားလုံးကိုတော့ literal အတိုင်း ယူပါတယ်။ Server encoding က UTF-8 မဟုတ်ရင် — ဒီ escape sequences တွေထဲက တစ်ခုနဲ့ ခွဲခြားထားတဲ့ Unicode code point ကို တကယ့် server encoding အဖြစ် ပြောင်းပေးပြီး — အဲဒီလို မပြောင်းနိုင်ရင် error တစ်ခု အစီရင်ခံပါတယ်။ ဒီ function က Unicode escapes ပါတဲ့ string constants တွေအတွက် (standard မဟုတ်တဲ့) အခြားရွေးချယ်စရာ တစ်ခုကို ပေးပါတယ် (အပိုင်း 4.1.2.3 ကို ကြည့်ပါ)။ unistr('d\0061t\+000061') → data unistr('d\u0061t\U00000061') → data |

`concat`၊ `concat_ws` နဲ့ `format` functions တွေက variadic တွေ ဖြစ်လို့ — ဆက်စပ်ရန် ဒါမှမဟုတ် format လုပ်ရန် တန်ဖိုးတွေကို — `VARIADIC` key word နဲ့ အမှတ်အသားပြုထားတဲ့ array တစ်ခုအနေနဲ့ ပေးပို့နိုင်ပါတယ် ([အပိုင်း 36.5.6](https://www.postgresql.org/docs/current/xfunc-sql.html#XFUNC-SQL-VARIADIC-FUNCTIONS) ကို ကြည့်ပါ)။ Array ရဲ့ elements တွေကို — function အတွက် သီးခြား သာမန် arguments တွေလိုပဲ သဘောထားပါတယ်။ Variadic array argument က NULL ဆိုရင် — `concat` နဲ့ `concat_ws` တို့က NULL ပြန်ပေးပြီး — `format` ကတော့ NULL ကို element သုည ရှိတဲ့ array တစ်ခုအနေနဲ့ သဘောထားပါတယ်။

`string_agg` ဆိုတဲ့ aggregate function ကို [အပိုင်း 9.21](/docs/postgresql/functions-aggregate) မှာ လည်းကောင်း — strings နဲ့ `bytea` type အကြား ပြောင်းလဲပေးတဲ့ functions တွေကို [ဇယား 9.13](/docs/postgresql/functions-binarystring) မှာ လည်းကောင်း — ကြည့်နိုင်ပါတယ်။

### 9.4.1. `format` (format လုပ်ဆောင်ချက်)

`format` function က — C function `sprintf` နဲ့ ဆင်တဲ့ ပုံစံမျိုးဖြင့် — format string တစ်ခုအတိုင်း format လုပ်ထားတဲ့ output တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။

```sql
format(formatstr text [, formatarg "any" [, ...] ])
```

*formatstr* က — ရလဒ်ကို ဘယ်လို format လုပ်ရမယ်ဆိုတာ သတ်မှတ်ပေးတဲ့ format string တစ်ခု ဖြစ်ပါတယ်။ Format string ထဲက text တွေကို — *format specifiers* (format သတ်မှတ်ချက်များ) သုံးထားတဲ့ နေရာတွေကလွဲပြီး — ရလဒ်ထဲကို တိုက်ရိုက် ကူးယူပါတယ်။ Format specifiers တွေက string ထဲမှာ placeholders တွေအဖြစ် ဆောင်ရွက်ပြီး — နောက်က function arguments တွေကို ဘယ်လို format လုပ်ပြီး ရလဒ်ထဲ ထည့်သွင်းရမယ်ဆိုတာ သတ်မှတ်ပေးပါတယ်။ *formatarg* argument တစ်ခုစီကို — ၎င်းရဲ့ data type အတွက် ပုံမှန် output စည်းမျဉ်းတွေအတိုင်း text အဖြစ် ပြောင်းပြီးမှ — format specifier(s) တွေအတိုင်း format လုပ်ပြီး ရလဒ် string ထဲ ထည့်သွင်းပါတယ်။

Format specifiers တွေကို `%` character တစ်ခုက စတင်ပြီး — ပုံစံကတော့:

```sql
%[position][flags][width]type
```

အဲဒီမှာ component fields တွေကတော့:

- **position (optional)** — `n$` ပုံစံရှိတဲ့ string တစ်ခု — ဒီမှာ n က ပုံနှိပ်ရမယ့် argument ရဲ့ index ဖြစ်ပါတယ်။ Index 1 ဆိုတာ formatstr ပြီးနောက် ပထမ argument ကို ဆိုလိုပါတယ်။ Position ကို ချန်လိုက်ရင် — ပုံမှန်အားဖြင့် နောက် argument ကို အစဉ်လိုက် သုံးပါတယ်။
- **flags (optional)** — format specifier ရဲ့ output ကို ဘယ်လို format လုပ်မလဲဆိုတာကို ထိန်းချုပ်တဲ့ နောက်ထပ် option တွေ ဖြစ်ပါတယ်။ လောလောဆယ် ထောက်ပံ့ထားတဲ့ flag တစ်ခုတည်းက minus sign (`-`) ဖြစ်ပြီး — format specifier ရဲ့ output ကို ဘယ်ဘက် ညှိပေးဖို့ (left-justified) ဖြစ်စေပါတယ်။ width field ကိုပါ သတ်မှတ်ထားမှသာ ဒါက သက်ရောက်မှု ရှိပါတယ်။
- **width (optional)** — format specifier ရဲ့ output ကို ပြသဖို့ သုံးရမယ့် အနည်းဆုံး characters အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Output ကို width ပြည့်အောင် — (- flag ပေါ် မူတည်ပြီး) ဘယ် ဒါမှမဟုတ် ညာဘက်ကနေ — လိုအပ်သလို space တွေနဲ့ ဖြည့်ပေးပါတယ် (padded)။ Width က သေးလွန်းရင် output ကို ဖြတ်တောက်တာ မဟုတ်ဘဲ — ရိုးရိုး လျစ်လျူရှုပါတယ်။ Width ကို အောက်ပါတွေထဲက တစ်ခုခုနဲ့ သတ်မှတ်နိုင်ပါတယ်: positive integer (အပေါင်း ကိန်းပြည့်) တစ်ခု; width အဖြစ် နောက် function argument ကို သုံးဖို့ asterisk (`*`) တစ်ခု; ဒါမှမဟုတ် nth function argument ကို width အဖြစ် သုံးဖို့ `*n$` ပုံစံရှိတဲ့ string တစ်ခု။
Width က function argument တစ်ခုကနေ လာတယ်ဆိုရင် — အဲဒီ argument ကို format specifier ရဲ့ တန်ဖိုးအတွက် သုံးမယ့် argument မတိုင်ခင် စားသုံးပါတယ်။ Width argument က အနုတ် ဖြစ်ရင် — ရလဒ်ကို abs(width) အလျား ရှိတဲ့ field တစ်ခုအတွင်းမှာ — (- flag သတ်မှတ်ထားသလိုပဲ) ဘယ်ဘက် ညှိပေးပါတယ် (left aligned)။
- **type (required)** — format specifier ရဲ့ output ကို ထုတ်လုပ်ဖို့ သုံးမယ့် format conversion ရဲ့ အမျိုးအစား ဖြစ်ပါတယ်။ အောက်ပါ type တွေကို ထောက်ပံ့ပါတယ်:

`s` က argument တန်ဖိုးကို ရိုးရိုး string (simple string) တစ်ခုအနေနဲ့ format လုပ်ပေးပါတယ်။ Null တန်ဖိုးကို empty string အဖြစ် သဘောထားပါတယ်။

`I` က argument တန်ဖိုးကို SQL identifier တစ်ခုအနေနဲ့ သဘောထားပြီး — လိုအပ်ရင် double quotes တွေနဲ့ ကာရံပေးပါတယ်။ တန်ဖိုးက null ဖြစ်ရင် error ဖြစ်ပါတယ် (quote_ident နဲ့ ညီမျှသည်)။

`L` က argument တန်ဖိုးကို SQL literal တစ်ခုအနေနဲ့ quote လုပ်ပေးပါတယ်။ Null တန်ဖိုးကို — quotes မပါဘဲ — NULL ဆိုတဲ့ string အနေနဲ့ ပြသပါတယ် (quote_nullable နဲ့ ညီမျှသည်)။

အပေါ်မှာ ဖော်ပြထားတဲ့ format specifiers တွေအပြင် — special sequence `%%` ကို literal `%` character တစ်ခု ထုတ်ပေးဖို့ သုံးနိုင်ပါတယ်။

အခြေခံ format conversions တွေရဲ့ ဥပမာတချို့:

```sql
SELECT format('Hello %s', 'World');
Result: Hello World

SELECT format('Testing %s, %s, %s, %%', 'one', 'two', 'three');
Result: Testing one, two, three, %

SELECT format('INSERT INTO %I VALUES(%L)', 'Foo bar', E'O\'Reilly');
Result: INSERT INTO "Foo bar" VALUES('O''Reilly')

SELECT format('INSERT INTO %I VALUES(%L)', 'locations', 'C:\Program Files');
Result: INSERT INTO locations VALUES('C:\Program Files')
```

width fields နဲ့ `-` flag သုံးထားတဲ့ ဥပမာတွေ:

```sql
SELECT format('|%10s|', 'foo');
Result: |       foo|

SELECT format('|%-10s|', 'foo');
Result: |foo       |

SELECT format('|%*s|', 10, 'foo');
Result: |       foo|

SELECT format('|%*s|', -10, 'foo');
Result: |foo       |

SELECT format('|%-*s|', 10, 'foo');
Result: |foo       |

SELECT format('|%-*s|', -10, 'foo');
Result: |foo       |
```

ဒီဥပမာတွေက *position* fields တွေရဲ့ အသုံးပြုပုံကို ပြပါတယ်:

```sql
SELECT format('Testing %3$s, %2$s, %1$s', 'one', 'two', 'three');
Result: Testing three, two, one

SELECT format('|%*2$s|', 'foo', 10, 'bar');
Result: |       bar|

SELECT format('|%1$*2$s|', 'foo', 10, 'bar');
Result: |       foo|
```

Standard C function `sprintf` နဲ့ မတူဘဲ — PostgreSQL ရဲ့ `format` function က — *position* fields ပါတဲ့ format specifiers တွေနဲ့ မပါတဲ့ format specifiers တွေကို — format string တစ်ခုတည်းထဲမှာ ရောနှော သုံးခွင့်ပြုပါတယ်။ *Position* field မပါတဲ့ format specifier တစ်ခုက — နောက်ဆုံး စားသုံးခဲ့တဲ့ argument ရဲ့ နောက် argument ကို အမြဲ သုံးပါတယ်။ ဒါ့အပြင် — `format` function က function arguments အားလုံးကို format string ထဲမှာ သုံးဖို့ မလိုအပ်ပါဘူး။ ဥပမာ:

```sql
SELECT format('Testing %3$s, %2$s, %s', 'one', 'two', 'three');
Result: Testing three, two, three
```

`%I` နဲ့ `%L` format specifiers တွေက — dynamic SQL statements တွေကို လုံခြုံစွာ (safely) တည်ဆောက်ရာမှာ အထူး အသုံးဝင်ပါတယ်။ [ဥပမာ 41.1](https://www.postgresql.org/docs/current/plpgsql-statements.html#PLPGSQL-QUOTE-LITERAL-EXAMPLE) ကို ကြည့်ပါ။
