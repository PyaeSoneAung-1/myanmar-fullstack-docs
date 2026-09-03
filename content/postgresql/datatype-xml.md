---
title: "XML Type (XML type)"
description: "xml data type — XML values များကို XMLPARSE/XMLSERIALIZE ဖြင့် input/output လုပ်ခြင်း၊ DOCUMENT/CONTENT ရွေးချယ်မှုနှင့် XML option၊ encoding (character set) ကိုင်တွယ်ခြင်း"
order: 60
source: "https://www.postgresql.org/docs/current/datatype-xml.html"
status: translated
updated: 2026-09-03
---

## 8.13. XML Type (XML type)

- **8.13.1. Creating XML Values (XML values များ ဖန်တီးခြင်း)**
- **8.13.2. Encoding Handling (encoding ကိုင်တွယ်ခြင်း)**
- **8.13.3. Accessing XML Values (XML values များကို ဝင်ရောက် အသုံးပြုခြင်း)**

`xml` data type က XML data တွေကို သိမ်းဆည်းဖို့ သုံးနိုင်ပါတယ်။ `text` field တစ်ခုထဲမှာ XML data သိမ်းတာထက် အားသာချက်က — input values တွေကို well-formed (ဖွဲ့စည်းပုံ စည်းမျဉ်းနဲ့ ကိုက်ညီ) မှု ရှိမရှိ စစ်ဆေးပေးပြီး — type-safe (type ပိုင်း လုံခြုံသော) လုပ်ဆောင်ချက်တွေ လုပ်ပေးနိုင်တဲ့ support functions တွေ ပါရှိတာပဲ ဖြစ်ပါတယ်; [အပိုင်း 9.15](https://www.postgresql.org/docs/current/functions-xml.html) ကို ကြည့်ပါ။ ဒီ data type ကို သုံးနိုင်ဖို့ဆိုရင် — installation ကို `configure --with-libxml` နဲ့ build လုပ်ထားဖို့ လိုအပ်ပါတယ်။

`xml` type က XML standard မှာ သတ်မှတ်ထားတဲ့အတိုင်း well-formed “documents” (စာတမ်းများ) တွေကိုရော — XQuery နဲ့ XPath data model ရဲ့ ပိုပြီး လွတ်လပ်တဲ့ (permissive) [“document node”](https://www.w3.org/TR/2010/REC-xpath-datamodel-20101214/#DocumentNode) (XML document တစ်ခုလုံးကို ကိုယ်စားပြုသည့် root node အမျိုးအစား) ကို ရည်ညွှန်းပြီး သတ်မှတ်ထားတဲ့ “content” fragments (အပိုင်းအစများ) တွေကိုပါ သိမ်းဆည်းနိုင်ပါတယ်။ အကြမ်းဖျင်း ပြောရရင် — content fragments တွေမှာ top-level element ဒါမှမဟုတ် character node တစ်ခုထက်ပိုပြီး ပါဝင်နိုင်ပါတယ်။ `xmlvalue IS DOCUMENT` ဆိုတဲ့ expression က `xml` value တစ်ခုက document အပြည့်အစုံ လား — ဒါမှမဟုတ် content fragment တစ်ခုပဲလားဆိုတာ စစ်ဆေးဖို့ သုံးနိုင်ပါတယ်။

`xml` data type ရဲ့ ကန့်သတ်ချက်တွေနဲ့ လိုက်ဖက်ညီမှု (compatibility) မှတ်စုတွေကို [အပိုင်း D.3](https://www.postgresql.org/docs/current/xml-limits-conformance.html) မှာ တွေ့နိုင်ပါတယ်။

### 8.13.1. Creating XML Values (XML values များ ဖန်တီးခြင်း)

Character data (စာလုံး ဒေတာ) ကနေ `xml` type ရဲ့ တန်ဖိုးတစ်ခု ထုတ်လုပ်ဖို့ — `xmlparse` function ကို သုံးပါ:

```sql
XMLPARSE ( { DOCUMENT | CONTENT } value)
```

ဥပမာများ:

```sql
XMLPARSE (DOCUMENT '<?xml version="1.0"?><book><title>Manual</title><chapter>...</chapter></book>')
XMLPARSE (CONTENT 'abc<foo>bar</foo><bar>foo</bar>')
```

SQL standard အရ — character strings တွေကို XML values တွေအဖြစ် ပြောင်းလဲနိုင်တဲ့ တစ်ခုတည်းသော နည်းလမ်းက ဒါပဲ ဖြစ်ပေမယ့် — PostgreSQL မှာပဲ ရှိတဲ့ အောက်ပါ syntax တွေကိုလည်း သုံးနိုင်ပါတယ်:

```sql
xml '<foo>bar</foo>'
'<foo>bar</foo>'::xml
```

`xml` type က input values တွေကို document type declaration (DTD) နဲ့ ဆန့်ကျင်ပြီး validate (စိစစ်) လုပ်မပေးပါဘူး — input value ထဲမှာ DTD တစ်ခု သတ်မှတ်ထားရင်တောင် ဖြစ်ပါတယ်။ ဒါ့အပြင် — XML Schema လိုမျိုး တခြား XML schema languages တွေနဲ့ validate လုပ်ဖို့ built-in support (ထည့်သွင်းပြီးသား ထောက်ပံ့မှု) ကလည်း လောလောဆယ် မရှိသေးပါဘူး။

ပြောင်းပြန် လုပ်ဆောင်ချက်ဖြစ်တဲ့ — `xml` ကနေ character string value တစ်ခု ထုတ်လုပ်တာကိုတော့ `xmlserialize` function နဲ့ လုပ်ပါတယ်:

```sql
XMLSERIALIZE ( { DOCUMENT | CONTENT } value AS type [ [ NO ] INDENT ] )
```

`type` က `character`, `character varying` ဒါမှမဟုတ် `text` (ဒါမှမဟုတ် ၎င်းတို့ထဲက တစ်ခုခုရဲ့ alias) ဖြစ်နိုင်ပါတယ်။ SQL standard အရ — `xml` type နဲ့ character types တွေကြားမှာ ပြောင်းလဲနိုင်တဲ့ တစ်ခုတည်းသော နည်းလမ်းကလည်း ဒါပဲ ဖြစ်ပေမယ့် — PostgreSQL က value ကို ရိုးရိုး cast (type ပြောင်း) လုပ်တာကိုလည်း ခွင့်ပြုပါတယ်။

`INDENT` option က ရလဒ်ကို pretty-printed (စာကြောင်းများ လှပစွာ စီစဉ်ဖော်ပြ) ဖြစ်စေပြီး — `NO INDENT` (default ဖြစ်တဲ့) ကတော့ မူရင်း input string ကိုပဲ ထုတ်ပေးပါတယ်။ Character type တစ်ခုအဖြစ် cast လုပ်တာကလည်း အလားတူ မူရင်း string ကိုပဲ ထုတ်ပေးပါတယ်။

Character string value တစ်ခုကို `XMLPARSE` ဒါမှမဟုတ် `XMLSERIALIZE` ကနေ ဖြတ်သန်းစရာ မလိုဘဲ `xml` type အဖြစ် cast လုပ်တဲ့အခါ (အပြန်အလှန် cast လုပ်တာလည်း အလားတူ) — `DOCUMENT` ကို ရွေးမလား `CONTENT` ကို ရွေးမလားဆိုတာကို “XML option” ဆိုတဲ့ session configuration parameter (session သတ်မှတ်ချက်) က ဆုံးဖြတ်ပေးပါတယ်။ ၎င်းကို standard command နဲ့ ဒီလို သတ်မှတ်နိုင်ပါတယ်:

```sql
SET XML OPTION { DOCUMENT | CONTENT };
```

ဒါမှမဟုတ် PostgreSQL ပုံစံ ပိုဆန်တဲ့ ဒီ syntax နဲ့လည်း ရပါတယ်:

```sql
SET xmloption TO { DOCUMENT | CONTENT };
```

Default ကတော့ `CONTENT` ဖြစ်ပါတယ် — ဒါကြောင့် XML data ပုံစံ အားလုံးကို ခွင့်ပြုပါတယ်။

### 8.13.2. Encoding Handling (encoding ကိုင်တွယ်ခြင်း)

Client, server နဲ့ ၎င်းတို့ကြားမှာ ဖြတ်သန်း ပေးပို့တဲ့ XML data တွေထဲမှာ character encoding (စာလုံး ကုဒ်စနစ်) အမျိုးမျိုး ပါဝင်နေတဲ့အခါ — သတိထား ကိုင်တွယ်ရပါမယ်။ Queries တွေကို server ဆီ ပို့ပြီး query ရလဒ်တွေကို client ဆီ ပြန်ပို့တဲ့အခါ text mode ကို သုံးတဲ့အခါ (ဒါက ပုံမှန် mode ပါ) — PostgreSQL က client နဲ့ server ကြားမှာ နှစ်ဖက်လုံးကို ဦးတည် ဖြတ်သန်းတဲ့ character data အားလုံးကို — လက်ခံတဲ့ဘက် တစ်ဖက်တစ်ချက်စီရဲ့ character encoding အဖြစ် ပြောင်းလဲပေးပါတယ်; [အပိုင်း 23.3](https://www.postgresql.org/docs/current/multibyte.html) ကို ကြည့်ပါ။ ဒီထဲမှာ XML values တွေရဲ့ string ကိုယ်စားပြုပုံတွေ (အပေါ်က ဥပမာတွေထဲကလိုမျိုး) လည်း ပါဝင်ပါတယ်။ ဒါရဲ့ ပုံမှန် အဓိပ္ပာယ်ကတော့ — XML data ထဲမှာ ပါဝင်တဲ့ encoding ကြေညာချက် (declaration) တွေက မမှန်ကန်တော့တဲ့ အခြေအနေ ဖြစ်သွားနိုင်တယ်ဆိုတာပါ — ဘာလို့လဲဆိုတော့ character data တွေ client နဲ့ server ကြား သွားလာနေစဉ် တခြား encoding တွေအဖြစ် ပြောင်းလဲခံရချိန်မှာ data ထဲမှာ မြှုပ်နှံထားတဲ့ (embedded) encoding ကြေညာချက်ကို အတူ မပြောင်းလဲပေးလို့ပါ။ ဒီအပြုအမူကို ရင်ဆိုင်ဖို့ — `xml` type ထဲကို input လုပ်ဖို့ တင်ပြတဲ့ character strings တွေထဲမှာ ပါဝင်တဲ့ encoding ကြေညာချက်တွေကို လျစ်လျူရှုပြီး — content တွေက လက်ရှိ server encoding နဲ့ ရေးထားတယ်လို့ ယူဆပါတယ်။ အကျိုးဆက်အနေနဲ့ — မှန်ကန်စွာ process လုပ်နိုင်ဖို့ဆိုရင် XML data ရဲ့ character strings တွေကို client ကနေ လက်ရှိ client encoding နဲ့ပဲ ပို့ပေးရပါမယ်။ Document တွေကို server ဆီ မပို့ခင် လက်ရှိ client encoding အဖြစ် ပြောင်းပေးဖို့ ဒါမှမဟုတ် client encoding ကို သင့်လျော်သလို ချိန်ညှိပေးဖို့ဆိုတာ client ရဲ့ တာဝန် ဖြစ်ပါတယ်။ Output ဘက်မှာတော့ — `xml` type တန်ဖိုးတွေမှာ encoding ကြေညာချက် မပါဝင်တော့ဘဲ — data အားလုံးက လက်ရှိ client encoding နဲ့ ဖြစ်တယ်လို့ clients တွေက ယူဆသင့်ပါတယ်။

Query parameters တွေကို server ဆီ ပို့ပြီး query ရလဒ်တွေကို client ဆီ ပြန်ပို့တဲ့အခါ binary mode ကို သုံးတဲ့အခါမှာတော့ — encoding ပြောင်းလဲခြင်း ဘာမှ မလုပ်တာမို့ — အခြေအနေ ကွဲပြားပါတယ်။ ဒီကိစ္စမှာ XML data ထဲက encoding ကြေညာချက်ကို အလေးထား လိုက်နာပြီး — ကြေညာချက် မပါဘူးဆိုရင် data က UTF-8 နဲ့ ရေးထားတယ်လို့ ယူဆပါတယ် (XML standard က ဒါကို လိုအပ်ချက်အဖြစ် သတ်မှတ်ထားပြီး — PostgreSQL က UTF-16 ကို ထောက်ပံ့မထားတာကို သတိပြုပါ)။ Output ဘက်မှာ — data မှာ client encoding ကို ဖော်ပြတဲ့ encoding ကြေညာချက် ပါဝင်ပါလိမ့်မယ် — client encoding က UTF-8 ဖြစ်နေရင်တော့ ကြေညာချက်ကို ချန်လှပ်လိုက်ပါတယ်။

XML data encoding, client encoding နဲ့ server encoding တွေ တစ်ခုတည်း တူညီနေရင် — PostgreSQL နဲ့ XML data process လုပ်တာ error ဖြစ်နိုင်ခြေ ပိုနည်းပြီး ပိုထိရောက်မယ်ဆိုတာ ပြောစရာတောင် မလိုပါဘူး။ XML data ကို အတွင်းပိုင်းမှာ UTF-8 နဲ့ process လုပ်တာမို့ — server encoding ပါ UTF-8 ဖြစ်နေရင် တွက်ချက်မှုတွေ အထိရောက်ဆုံး ဖြစ်ပါတယ်။

> **သတိပြုရန်:** Server encoding က UTF-8 မဟုတ်တဲ့အခါ — XML နဲ့ ဆက်စပ်တဲ့ function တချို့က non-ASCII data တွေပေါ်မှာ လုံးဝ အလုပ်မလုပ်တာ ရှိနိုင်ပါတယ်။ အထူးသဖြင့် `xmltable()` နဲ့ `xpath()` တွေမှာ ဒါက သိထားပြီးသား ပြဿနာတစ်ခု ဖြစ်ပါတယ်။

### 8.13.3. Accessing XML Values (XML values များကို ဝင်ရောက် အသုံးပြုခြင်း)

`xml` data type က comparison operators (နှိုင်းယှဉ်မှု စစ်ဆေးရန် operator များ) ကို လုံးဝ မပေးထားတဲ့အတွက် ထူးခြားပါတယ်။ အကြောင်းကတော့ XML data တွေအတွက် — ကောင်းမွန်စွာ သတ်မှတ်ထားပြီး နေရာတိုင်းမှာ အသုံးဝင်တဲ့ (universally useful) နှိုင်းယှဉ် algorithm တစ်ခု မရှိလို့ပါ။ ဒါရဲ့ အကျိုးဆက်တစ်ခုက — `xml` column တစ်ခုကို ရှာဖွေတဲ့ value တစ်ခုနဲ့ နှိုင်းယှဉ်ပြီး rows တွေကို ပြန်ယူလို့ မရတာပါ။ ဒါကြောင့် XML values တွေနဲ့အတူ — ID လိုမျိုး သီးခြား key field တစ်ခုကို ပုံမှန်အားဖြင့် တွဲထားသင့်ပါတယ်။ XML values တွေကို နှိုင်းယှဉ်ဖို့ အခြား နည်းလမ်းတစ်ခုကတော့ — အရင်ဆုံး character strings အဖြစ် ပြောင်းပြီးမှ နှိုင်းယှဉ်တာပါ — ဒါပေမယ့် character string နှိုင်းယှဉ်မှုက အသုံးဝင်တဲ့ XML နှိုင်းယှဉ် နည်းလမ်းတစ်ခုနဲ့ သိပ်ပြီး မသက်ဆိုင်ဘူးဆိုတာ သတိပြုပါ။

`xml` data type အတွက် comparison operators တွေ မရှိတာမို့ — ဒီ type ရဲ့ column တစ်ခုပေါ်မှာ index တစ်ခုကို တိုက်ရိုက် ဖန်တီးလို့ မရပါဘူး။ XML data ထဲမှာ မြန်ဆန်တဲ့ ရှာဖွေမှုတွေ လိုချင်တယ်ဆိုရင် — ဖြစ်နိုင်တဲ့ နည်းလမ်းတွေကတော့ expression ကို character string type တစ်ခုအဖြစ် cast လုပ်ပြီး အဲဒါကို index လုပ်တာ၊ ဒါမှမဟုတ် XPath expression တစ်ခုကို index လုပ်တာတွေ ဖြစ်ပါတယ်။ တကယ့် query ကိုတော့ index လုပ်ထားတဲ့ expression နဲ့ ရှာဖွေနိုင်အောင် ချိန်ညှိပေးရမှာ အမှန်ပါပဲ။

PostgreSQL ရဲ့ text-search (စာသား ရှာဖွေမှု) လုပ်ဆောင်နိုင်စွမ်းကို XML data တွေရဲ့ full-document (စာတမ်း တစ်ခုလုံး) ရှာဖွေမှုတွေ မြန်ဆန်စေဖို့လည်း သုံးနိုင်ပါတယ်။ ဒါပေမယ့် — လိုအပ်တဲ့ ကြိုတင် ပြင်ဆင်မှု (preprocessing) အတွက် ထောက်ပံ့မှုကတော့ PostgreSQL distribution ထဲမှာ လောလောဆယ် မရသေးပါဘူး။
