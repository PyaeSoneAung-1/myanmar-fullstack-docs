---
title: "Parsers (parser များ)"
description: "Text search parser များ — raw document text ကို token အဖြစ် ပိုင်းခြားပြီး type ဖော်ထုတ်ခြင်း၊ built-in pg_catalog.default parser နှင့် ၎င်း၏ token type 23 မျိုး"
order: 90
source: "https://www.postgresql.org/docs/current/textsearch-parsers.html"
status: translated
updated: 2026-09-03
---

## 12.5. Parsers (parser များ)

Text search parser (စာသား ရှာဖွေရေး parser) များရဲ့ တာဝန်က — raw document text (မူရင်း စာတမ်း စာသား) ကို *tokens* (token များ) အဖြစ် ပိုင်းခြားပြီး token တစ်ခုချင်းစီရဲ့ type ကို ဖော်ထုတ်ပေးတာ ဖြစ်ပါတယ် — ဖြစ်နိုင်တဲ့ type တွေရဲ့ အစုကိုတော့ parser ကိုယ်တိုင် သတ်မှတ်ပါတယ်။ Parser က text ကို လုံးဝ ပြုပြင်မွမ်းမံမှု မရှိဘူးဆိုတာ သတိပြုပါ — ၎င်းက ဖြစ်နိုင်ခြေ ရှိတဲ့ စကားလုံး နယ်နိမိတ် (word boundary) တွေကိုပဲ ရှာဖွေ ဖော်ထုတ်ပေးပါတယ်။ ဒီလို တာဝန် နယ်ပယ် ကျဉ်းမြောင်းတာကြောင့် — custom dictionary တွေနဲ့ ယှဉ်ရင် application-specific (application အလိုက် သီးသန့်) custom parser တွေ လိုအပ်မှု နည်းပါးပါတယ်။ လက်ရှိမှာ PostgreSQL က built-in parser တစ်ခုတည်းကိုပဲ ပံ့ပိုးပေးထားပြီး — အဲဒီ parser က application မျိုးစုံအတွက် အသုံးဝင်တယ်လို့ တွေ့ရှိထားပါတယ်။

Built-in parser ရဲ့ နာမည်က `pg_catalog.default` ဖြစ်ပါတယ်။ ၎င်းက token type 23 မျိုးကို အသိအမှတ်ပြုပြီး — ဒီ type တွေကို ဇယား 12.1 မှာ ပြထားပါတယ်။

**ဇယား 12.1. Default Parser's Token Types (default parser ၏ token type များ)**

| Alias | ဖော်ပြချက် | ဥပမာ |
| --- | --- | --- |
| `asciiword` | ASCII letter များသာ ပါဝင်သော စကားလုံး | `elephant` |
| `word` | letter များသာ ပါဝင်သော စကားလုံး | `mañana` |
| `numword` | letter နှင့် digit များ ပါဝင်သော စကားလုံး | `beta1` |
| `asciihword` | hyphen ဖြင့် ဆက်ထားသော စကားလုံး — ASCII letter များသာ | `up-to-date` |
| `hword` | hyphen ဖြင့် ဆက်ထားသော စကားလုံး — letter များသာ | `lógico-matemática` |
| `numhword` | hyphen ဖြင့် ဆက်ထားသော စကားလုံး — letter နှင့် digit များ | `postgresql-beta1` |
| `hword_asciipart` | hyphen ဖြင့် ဆက်ထားသော စကားလုံး၏ အစိတ်အပိုင်း — ASCII letter များသာ | `postgresql-beta1` context ထဲမှ `postgresql` |
| `hword_part` | hyphen ဖြင့် ဆက်ထားသော စကားလုံး၏ အစိတ်အပိုင်း — letter များသာ | `lógico-matemática` context ထဲမှ `lógico` သို့မဟုတ် `matemática` |
| `hword_numpart` | hyphen ဖြင့် ဆက်ထားသော စကားလုံး၏ အစိတ်အပိုင်း — letter နှင့် digit များ | `postgresql-beta1` context ထဲမှ `beta1` |
| `email` | Email လိပ်စာ | `foo@example.com` |
| `protocol` | Protocol head (protocol အစပိုင်း) | `http://` |
| `url` | URL | `example.com/stuff/index.html` |
| `host` | Host | `example.com` |
| `url_path` | URL path (URL လမ်းကြောင်း) | URL တစ်ခု၏ context အတွင်းမှ `/stuff/index.html` |
| `file` | File သို့မဟုတ် path အမည် | URL တစ်ခုအတွင်းမှ မဟုတ်ပါက `/usr/local/foo.txt` |
| `sfloat` | Scientific notation (သိပ္ပံနည်း ဖော်ပြမှု) | `-1.234e56` |
| `float` | Decimal notation (ဒသမ ဖော်ပြမှု) | `-1.234` |
| `int` | Signed integer (လက္ခဏာ ပါ integer) | `-1234` |
| `uint` | Unsigned integer (လက္ခဏာ မပါ integer) | `1234` |
| `version` | Version နံပါတ် | `8.3.0` |
| `tag` | XML tag | `<a href="dictionaries.html">` |
| `entity` | XML entity | `&amp;` |
| `blank` | Space သင်္ကေတများ (space symbols) | (အခြားနည်းဖြင့် အသိအမှတ်ပြုထားခြင်း မရှိသော whitespace သို့မဟုတ် punctuation မှန်သမျှ) |

> **မှတ်ချက်:** Parser က “letter” (အက္ခရာ) လို့ ယူဆတာကို database ရဲ့ locale setting (ဒေသစံ သတ်မှတ်ချက်) — အထူးသဖြင့် `lc_ctype` — နဲ့ ဆုံးဖြတ်ပါတယ်။ Basic ASCII letter တွေပဲ ပါဝင်တဲ့ စကားလုံးတွေကို သီးခြား token type အဖြစ် ဖော်ပြပါတယ် — ဘာလို့လဲဆိုတော့ တခါတရံမှာ ၎င်းတို့ကို ခွဲခြား သိရှိနိုင်ဖို့ အသုံးဝင်လို့ပါ။ ဥရောပ ဘာသာစကား အများစုမှာတော့ `word` နဲ့ `asciiword` token type တွေကို အတူတူပဲ သဘောထား ကိုင်တွယ်သင့်ပါတယ်။
> 
> `email` က [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) မှာ သတ်မှတ်ထားတဲ့ valid email character (တရားဝင် email စာလုံး) အားလုံးကို ထောက်ပံ့တာ မဟုတ်ပါဘူး။ အထူးသဖြင့် — email user name တွေအတွက် ထောက်ပံ့ပေးတဲ့ alphanumeric မဟုတ်တဲ့ စာလုံးတွေက period (အစက်)၊ dash (တုံးတို) နဲ့ underscore (အောက်မျဉ်း) တို့ပဲ ဖြစ်ပါတယ်။
> 
> `tag` က [W3C Recommendation, XML](https://www.w3.org/TR/xml/) မှာ သတ်မှတ်ထားတဲ့ valid tag name အားလုံးကို ထောက်ပံ့တာ မဟုတ်ပါဘူး။ အထူးသဖြင့် — ထောက်ပံ့ပေးတဲ့ tag name တွေက ASCII letter၊ underscore ဒါမှမဟုတ် colon (အူပိုင်း) နဲ့ စတင်ပြီး — letter၊ digit၊ hyphen၊ underscore၊ period နဲ့ colon တွေပဲ ပါဝင်တဲ့ နာမည်မျိုးတွေ ဖြစ်ပါတယ်။ `tag` က `<!--` နဲ့ စတင်ပြီး `-->` နဲ့ ဆုံးတဲ့ XML comments တွေနဲ့ XML declarations တွေကိုလည်း ထည့်သွင်းပါတယ် (ဒါထဲမှာ `<?x` နဲ့ စပြီး `>` နဲ့ ဆုံးတဲ့ မည်သည့်အရာမဆို ပါဝင်တယ်ဆိုတာ သတိပြုပါ)။

Parser က text အပိုင်း တစ်ခုတည်းကနေ ထပ်နေတဲ့ (overlapping) tokens တွေကို ထုတ်ပေးနိုင်ပါတယ်။ ဥပမာ — hyphenated word (hyphen ဆက်စကားလုံး) တစ်လုံးကို စကားလုံး တစ်လုံးလုံးအနေနဲ့ရော — အစိတ်အပိုင်း တစ်ခုချင်းစီအနေနဲ့ပါ ဖော်ပြပါလိမ့်မယ်:

```sql
SELECT alias, description, token FROM ts_debug('foo-bar-beta1');
      alias      |               description                |     token
-----------------+------------------------------------------+---------------
 numhword        | Hyphenated word, letters and digits      | foo-bar-beta1
 hword_asciipart | Hyphenated word part, all ASCII          | foo
 blank           | Space symbols                            | -
 hword_asciipart | Hyphenated word part, all ASCII          | bar
 blank           | Space symbols                            | -
 hword_numpart   | Hyphenated word part, letters and digits | beta1
```

ဒီအပြုအမူက လိုလားဖွယ် ကောင်းပါတယ် — ဘာလို့လဲဆိုတော့ ရှာဖွေမှုတွေက compound word (ပေါင်းစပ်စကားလုံး) တစ်လုံးလုံးအတွက်ရော — ၎င်းရဲ့ အစိတ်အပိုင်း တစ်ခုချင်းစီအတွက်ပါ အလုပ်လုပ်နိုင်လို့ပါ။ နောက်ထပ် သင်ခန်းစာကောင်း ဥပမာ တစ်ခုကို ကြည့်ရအောင်:

```sql
SELECT alias, description, token FROM ts_debug('http://example.com/stuff/index.html');
  alias   |  description  |            token
----------+---------------+------------------------------
 protocol | Protocol head | http://
 url      | URL           | example.com/stuff/index.html
 host     | Host          | example.com
 url_path | URL path      | /stuff/index.html
```
