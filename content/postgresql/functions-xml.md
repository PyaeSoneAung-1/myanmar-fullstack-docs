---
title: "XML Functions (XML လုပ်ဆောင်ချက်များ)"
description: "XML data ထုတ်လုပ်ခြင်း၊ စစ်ဆေးခြင်းနှင့် process လုပ်ခြင်းအတွက် functions များ — xmltext, xmlcomment, xmlconcat, xmlelement, xmlforest, xmlpi, xmlroot, xmlagg, XPath/xpath, XMLTABLE နှင့် table/query/cursor/schema/database များကို XML သို့ mapping လုပ်ခြင်း"
order: 82
source: "https://www.postgresql.org/docs/current/functions-xml.html"
status: translated
updated: 2026-09-04
---

## 9.15. XML Functions (XML လုပ်ဆောင်ချက်များ)

- **9.15.1. Producing XML Content (XML content ထုတ်လုပ်ခြင်း)**
- **9.15.2. XML Predicates (XML predicate များ)**
- **9.15.3. Processing XML (XML process လုပ်ခြင်း)**
- **9.15.4. Mapping Tables to XML (Table များကို XML သို့ mapping လုပ်ခြင်း)**

ဒီ section မှာ ဖော်ပြထားတဲ့ functions နဲ့ function-like expressions တွေက `xml` type ရဲ့ values တွေအပေါ်မှာ အလုပ်လုပ်ပါတယ်။ `xml` type အကြောင်း အချက်အလက်အတွက် [အပိုင်း 8.13](/docs/postgresql/datatype-xml) ကို ကြည့်ပါ။ `xml` type ဆီ ပြောင်းခြင်းနဲ့ `xml` type ကနေ ပြောင်းခြင်းအတွက် သုံးတဲ့ `xmlparse` နဲ့ `xmlserialize` ဆိုတဲ့ function-like expressions တွေကိုတော့ ဒီ section မှာ မဟုတ်ဘဲ — အဲဒီနေရာမှာ မှတ်တမ်းတင်ထားပါတယ်။

ဒီ functions တွေထဲက အများစုကို သုံးနိုင်ဖို့အတွက် PostgreSQL ကို `configure --with-libxml` နဲ့ တည်ဆောက် (build) ထားရန် လိုအပ်ပါတယ်။

### 9.15.1. Producing XML Content (XML content ထုတ်လုပ်ခြင်း)

SQL data တွေကနေ XML content ထုတ်လုပ်ဖို့ functions နဲ့ function-like expressions အစုတစ်စု ရနိုင်ပါတယ်။ ဒါကြောင့် — query ရလဒ်တွေကို client applications တွေမှာ process လုပ်ဖို့ XML documents အဖြစ် ပုံစံသွင်းရာမှာ — သူတို့က အထူးသင့်လျော်ပါတယ်။

#### 9.15.1.1. `xmltext`

```sql
xmltext ( text ) → xml
```

`xmltext` function က — input argument ကို ၎င်းရဲ့ content အဖြစ် ပါဝင်တဲ့ text node တစ်ခုတည်း ပါတဲ့ XML value တစ်ခုကို ပြန်ပေးပါတယ်။ Ampersand (`&`), left/right angle brackets (`< >`) နဲ့ quotation marks (`""`) လို predefined entities (ကြိုတင် သတ်မှတ်ထားသော entity များ) တွေကို escape လုပ်ပါတယ်။

ဥပမာ:

```sql
SELECT xmltext('< foo & bar >');
         xmltext
-------------------------
 &lt; foo &amp; bar &gt;
```

#### 9.15.1.2. `xmlcomment`

```sql
xmlcomment ( text ) → xml
```

`xmlcomment` function က — သတ်မှတ်ထားတဲ့ text ကို content အဖြစ် ပါဝင်တဲ့ XML comment တစ်ခု ပါဝင်တဲ့ XML value တစ်ခုကို ဖန်တီးပေးပါတယ်။ Text ထဲမှာ “--” ပါဝင်လို့ မရသလို — “-” နဲ့လည်း အဆုံးသတ်လို့ မရပါဘူး — မဟုတ်ရင် ရလာတဲ့ construct က valid XML comment တစ်ခု ဖြစ်မှာ မဟုတ်ပါဘူး။ Argument က null ဖြစ်ရင် ရလဒ်လည်း null ဖြစ်ပါတယ်။

ဥပမာ:

```sql
SELECT xmlcomment('hello');

  xmlcomment
--------------
 <!--hello-->
```

#### 9.15.1.3. `xmlconcat`

```sql
xmlconcat ( xml [, ...] ) → xml
```

`xmlconcat` function က — XML value တစ်ခုချင်းစီရဲ့ list တစ်ခုကို ဆက်စပ်ပြီး — XML content fragment (content fragment — content ၏ အပိုင်းအစ) တစ်ခု ပါဝင်တဲ့ value တစ်ခုတည်းကို ဖန်တီးပေးပါတယ်။ Null values တွေကို ချန်လှပ်ပါတယ်; nonnull argument တွေ လုံးဝမရှိမှသာ ရလဒ်က null ဖြစ်ပါတယ်။

ဥပမာ:

```sql
SELECT xmlconcat('<abc/>', '<bar>foo</bar>');

      xmlconcat
----------------------
 <abc/><bar>foo</bar>
```

XML declarations တွေ ရှိခဲ့ရင် အောက်ပါအတိုင်း ပေါင်းစည်းပါတယ်။ Argument values အားလုံးမှာ XML version declaration အတူတူ ရှိရင် အဲဒီ version ကို ရလဒ်မှာ သုံးပြီး — မဟုတ်ရင် version ဘာမှ မသုံးပါဘူး။ Argument values အားလုံးရဲ့ standalone declaration value က “yes” ဆိုရင် အဲဒီ value ကို ရလဒ်မှာ သုံးပါတယ်။ Argument values အားလုံးမှာ standalone declaration value ရှိပြီး အနည်းဆုံး တစ်ခုက “no” ဆိုရင် အဲဒါကို ရလဒ်မှာ သုံးပါတယ်။ မဟုတ်ရင် ရလဒ်မှာ standalone declaration မပါဝင်ပါဘူး။ ရလဒ်က standalone declaration လိုအပ်တယ်လို့ သတ်မှတ်ခံရပေမယ့် version declaration မရှိဘူးဆိုရင် — XML က XML declaration တစ်ခုမှာ version declaration ပါဝင်ရန် လိုအပ်လို့ — version 1.0 ပါတဲ့ version declaration ကို သုံးပါလိမ့်မယ်။ Encoding declarations တွေကိုတော့ ကိစ္စအားလုံးမှာ လျစ်လျူရှုပြီး ဖယ်ရှားပါတယ်။

ဥပမာ:

```sql
SELECT xmlconcat('<?xml version="1.1"?><foo/>', '<?xml version="1.1" standalone="no"?><bar/>');

             xmlconcat
-----------------------------------
 <?xml version="1.1"?><foo/><bar/>
```

#### 9.15.1.4. `xmlelement`

```sql
xmlelement ( NAME name [, XMLATTRIBUTES ( attvalue [ AS attname ] [, ...] ) ] [, content [, ...]] ) → xml
```

`xmlelement` expression က — ပေးထားတဲ့ name, attributes နဲ့ content ပါဝင်တဲ့ XML element တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။ Syntax ထဲမှာ ပြထားတဲ့ `name` နဲ့ `attname` items တွေက values တွေ မဟုတ်ဘဲ ရိုးရှင်းတဲ့ identifiers တွေ ဖြစ်ပါတယ်။ `attvalue` နဲ့ `content` items တွေကတော့ expressions တွေ ဖြစ်ပြီး — PostgreSQL data type မည်သည်မဆို ထွက်ပေးနိုင်ပါတယ်။ `XMLATTRIBUTES` ထဲက argument(s) တွေက XML element ရဲ့ attributes တွေကို ထုတ်ပေးပြီး — `content` value(s) တွေကို ဆက်စပ်ပြီး ၎င်းရဲ့ content အဖြစ် ဖွဲ့စည်းပါတယ်။

ဥပမာများ:

```sql
SELECT xmlelement(name foo);

 xmlelement
------------
 <foo/>

SELECT xmlelement(name foo, xmlattributes('xyz' as bar));

    xmlelement
------------------
 <foo bar="xyz"/>

SELECT xmlelement(name foo, xmlattributes(current_date as bar), 'cont', 'ent');

             xmlelement
-------------------------------------
 <foo bar="2007-01-26">content</foo>
```

Valid XML names မဟုတ်တဲ့ element နဲ့ attribute names တွေကို — ပြဿနာ ဖြစ်စေတဲ့ characters တွေကို `_xHHHH_` ဆိုတဲ့ sequence နဲ့ အစားထိုးပြီး — escape လုပ်ပါတယ်။ ဒီမှာ `HHHH` က character ရဲ့ Unicode codepoint ကို hexadecimal (ဆယ့်ခြောက်လုံးကိန်းစနစ်) notation နဲ့ ရေးထားတာ ဖြစ်ပါတယ်။ ဥပမာ:

```sql
SELECT xmlelement(name "foo$bar", xmlattributes('xyz' as "a&b"));

            xmlelement
----------------------------------
 <foo_x0024_bar a_x0026_b="xyz"/>
```

Attribute value က column reference တစ်ခု ဖြစ်နေရင် explicit attribute name ကို သတ်မှတ်စရာ မလိုပါဘူး — အဲဒီအခါ column ရဲ့ နာမည်ကို attribute name အဖြစ် default နဲ့ သုံးပါတယ်။ တခြား ကိစ္စတွေမှာတော့ attribute ကို explicit name ပေးရပါတယ်။ ဒါကြောင့် ဒီ ဥပမာက valid ဖြစ်ပါတယ်:

```sql
CREATE TABLE test (a xml, b xml);
SELECT xmlelement(name test, xmlattributes(a, b)) FROM test;
```

ဒါတွေကတော့ မရပါဘူး:

```sql
SELECT xmlelement(name test, xmlattributes('constant'), a, b) FROM test;
SELECT xmlelement(name test, xmlattributes(func(a, b))) FROM test;
```

Element content ကို သတ်မှတ်ထားရင် — ၎င်းရဲ့ data type အလိုက် ပုံစံသွင်းပါတယ်။ Content ကိုယ်တိုင် `xml` type ဖြစ်နေရင် — ရှုပ်ထွေးတဲ့ XML documents တွေကို တည်ဆောက်လို့ ရပါတယ်။ ဥပမာ:

```sql
SELECT xmlelement(name foo, xmlattributes('xyz' as bar),
                            xmlelement(name abc),
                            xmlcomment('test'),
                            xmlelement(name xyz));

                  xmlelement
----------------------------------------------
 <foo bar="xyz"><abc/><!--test--><xyz/></foo>
```

တခြား types တွေရဲ့ content ကိုတော့ valid XML character data အဖြစ် ပုံစံသွင်းပါတယ်။ ဆိုလိုတာက အထူးသဖြင့် <, > နဲ့ & ဆိုတဲ့ characters တွေကို entities တွေအဖြစ် ပြောင်းလဲပေးမှာ ဖြစ်ပါတယ်။ Binary data (`bytea` data type) ကိုတော့ — [xmlbinary](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-XMLBINARY) ဆိုတဲ့ configuration parameter ရဲ့ setting ပေါ်မူတည်ပြီး — base64 ဒါမှမဟုတ် hex encoding နဲ့ ကိုယ်စားပြုပါတယ်။ Data type တစ်ခုချင်းစီအတွက် သီးခြား အပြုအမူကတော့ — [အပိုင်း D.3.1.3](https://www.postgresql.org/docs/current/xml-limits-conformance.html#FUNCTIONS-XML-LIMITS-CASTS) မှာ ဆွေးနွေးထားသလို — PostgreSQL ရဲ့ mappings တွေကို SQL:2006 နဲ့ ၎င်းနောက်ပိုင်း စံသတ်မှတ်ချက်တွေနဲ့ ညှိရန် — နောင်မှာ ပြောင်းလဲဖွယ် ရှိပါတယ်။

#### 9.15.1.5. `xmlforest`

```sql
xmlforest ( content [ AS name ] [, ...] ) → xml
```

`xmlforest` expression က — ပေးထားတဲ့ names နဲ့ content တွေကို သုံးပြီး — elements တွေရဲ့ XML forest (sequence) တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။ `xmlelement` မှာလိုပဲ — `name` တစ်ခုချင်းစီက ရိုးရှင်းတဲ့ identifier ဖြစ်ရပြီး — `content` expressions တွေကတော့ data type မည်သည်မဆို ရှိနိုင်ပါတယ်။

ဥပမာများ:

```sql
SELECT xmlforest('abc' AS foo, 123 AS bar);

          xmlforest
------------------------------
 <foo>abc</foo><bar>123</bar>

SELECT xmlforest(table_name, column_name)
FROM information_schema.columns
WHERE table_schema = 'pg_catalog';

                                xmlforest
------------------------------------​-----------------------------------
 <table_name>pg_authid</table_name>​<column_name>rolname</column_name>
 <table_name>pg_authid</table_name>​<column_name>rolsuper</column_name>
 ...
```

ဒုတိယ ဥပမာမှာ မြင်ရသလို — content value က column reference တစ်ခု ဖြစ်နေရင် element name ကို ချန်လိုက်လို့ ရပါတယ် — အဲဒီအခါ column name ကို default အနေနဲ့ သုံးပါတယ်။ မဟုတ်ရင်တော့ name တစ်ခု သတ်မှတ်ပေးရပါမယ်။

Valid XML names မဟုတ်တဲ့ element names တွေကို အပေါ်မှာ `xmlelement` အတွက် ပြထားတဲ့အတိုင်း escape လုပ်ပါတယ်။ အလားတူပဲ — content data က `xml` type ဖြစ်ပြီးသား မဟုတ်ရင် — valid XML content ဖြစ်အောင် escape လုပ်ပါတယ်။

XML forests တွေက element တစ်ခုထက်ပို ပါဝင်နေရင် valid XML documents တွေ မဟုတ်တာကို သတိပြုပါ — ဒါကြောင့် `xmlforest` expressions တွေကို `xmlelement` ထဲမှာ ထုပ်ပေးတာ (wrap) က အသုံးဝင်နိုင်ပါတယ်။

#### 9.15.1.6. `xmlpi`

```sql
xmlpi ( NAME name [, content ] ) → xml
```

`xmlpi` expression က XML processing instruction (လုပ်ဆောင်ရန် ညွှန်ကြားချက်) တစ်ခုကို ဖန်တီးပေးပါတယ်။ `xmlelement` မှာလိုပဲ — `name` က ရိုးရှင်းတဲ့ identifier ဖြစ်ရပြီး — `content` expression ကတော့ data type မည်သည်မဆို ရှိနိုင်ပါတယ်။ `content` မှာ — ပါဝင်ခဲ့ရင် — `?>` ဆိုတဲ့ character sequence ပါဝင်လို့ မရပါဘူး။

ဥပမာ:

```sql
SELECT xmlpi(name php, 'echo "hello world";');

            xmlpi
-----------------------------
 <?php echo "hello world";?>
```

#### 9.15.1.7. `xmlroot`

```sql
xmlroot ( xml, VERSION {text|NO VALUE} [, STANDALONE {YES|NO|NO VALUE} ] ) → xml
```

`xmlroot` expression က XML value တစ်ခုရဲ့ root node ရဲ့ properties (ဂုဏ်သတ္တိများ) တွေကို ပြောင်းလဲပေးပါတယ်။ Version ကို သတ်မှတ်ထားရင် — root node ရဲ့ version declaration ထဲက value ကို အစားထိုးပြီး — standalone setting ကို သတ်မှတ်ထားရင် — root node ရဲ့ standalone declaration ထဲက value ကို အစားထိုးပါတယ်။

```sql
SELECT xmlroot(xmlparse(document '<?xml version="1.1"?><content>abc</content>'),
               version '1.0', standalone yes);

                xmlroot
----------------------------------------
 <?xml version="1.0" standalone="yes"?>
 <content>abc</content>
```

#### 9.15.1.8. `xmlagg`

```sql
xmlagg ( xml ) → xml
```

`xmlagg` function က — ဒီနေရာမှာ ဖော်ပြထားတဲ့ တခြား functions တွေနဲ့ မတူဘဲ — aggregate function တစ်ခု ဖြစ်ပါတယ်။ ၎င်းက aggregate function call ဆီ input values တွေကို — `xmlconcat` လုပ်သလိုပဲ — ဆက်စပ်ပေးပေမယ့် — ဆက်စပ်မှုက row တစ်ခုတည်းထဲက expressions တွေကြားမှာ မဟုတ်ဘဲ — rows တွေကြားမှာ ဖြစ်ပွားတာပဲ ကွာပါတယ်။ Aggregate functions တွေအကြောင်း နောက်ထပ် အချက်အလက်အတွက် [အပိုင်း 9.21](/docs/postgresql/functions-aggregate) ကို ကြည့်ပါ။

ဥပမာ:

```sql
CREATE TABLE test (y int, x xml);
INSERT INTO test VALUES (1, '<foo>abc</foo>');
INSERT INTO test VALUES (2, '<bar/>');
SELECT xmlagg(x) FROM test;
        xmlagg
----------------------
 <foo>abc</foo><bar/>
```

ဆက်စပ်မှုရဲ့ အစဉ်ကို သတ်မှတ်ဖို့ — [အပိုင်း 4.2.7](/docs/postgresql/sql-expressions) မှာ ဖော်ပြထားတဲ့အတိုင်း — aggregate call ထဲမှာ `ORDER BY` clause တစ်ခု ထပ်ထည့်လို့ ရပါတယ်။ ဥပမာ:

```sql
SELECT xmlagg(x ORDER BY y DESC) FROM test;
        xmlagg
----------------------
 <bar/><foo>abc</foo>
```

အောက်ပါ non-standard နည်းလမ်းကို အရင် versions တွေမှာ အကြံပြုခဲ့ဖူးပြီး — သီးခြား ကိစ္စတချို့မှာ အသုံးဝင်ဆဲ ဖြစ်နိုင်ပါတယ်:

```sql
SELECT xmlagg(x) FROM (SELECT * FROM test ORDER BY y DESC) AS tab;
        xmlagg
----------------------
 <bar/><foo>abc</foo>
```

### 9.15.2. XML Predicates (XML predicate များ)

ဒီ section မှာ ဖော်ပြထားတဲ့ expressions တွေက `xml` values တွေရဲ့ properties တွေကို စစ်ဆေးပေးပါတယ်။

#### 9.15.2.1. `IS DOCUMENT`

```sql
xml IS DOCUMENT → boolean
```

`IS DOCUMENT` expression က — argument XML value က သင့်လျော်တဲ့ (proper) XML document တစ်ခု ဖြစ်ရင် true၊ မဟုတ်ရင် (ဆိုလိုတာက content fragment တစ်ခု ဖြစ်နေရင်) false၊ argument က null ဆိုရင် null ကို ပြန်ပေးပါတယ်။ Documents တွေနဲ့ content fragments တွေကြားက ခြားနားချက်အတွက် [အပိုင်း 8.13](/docs/postgresql/datatype-xml) ကို ကြည့်ပါ။

#### 9.15.2.2. `IS NOT DOCUMENT`

```sql
xml IS NOT DOCUMENT → boolean
```

`IS NOT DOCUMENT` expression က — argument XML value က သင့်လျော်တဲ့ XML document တစ်ခု ဖြစ်ရင် false၊ မဟုတ်ရင် (ဆိုလိုတာက content fragment တစ်ခု ဖြစ်နေရင်) true၊ argument က null ဆိုရင် null ကို ပြန်ပေးပါတယ်။

#### 9.15.2.3. `XMLEXISTS`

```sql
XMLEXISTS ( text PASSING [BY {REF|VALUE}] xml [BY {REF|VALUE}] ) → boolean
```

`xmlexists` function က — ပို့လိုက်တဲ့ XML value ကို ၎င်းရဲ့ context item အဖြစ် သုံးပြီး — XPath 1.0 expression (ပထမ argument) တစ်ခုကို အကဲဖြတ်ပါတယ်။ အဲဒီ အကဲဖြတ်မှုရဲ့ ရလဒ်က empty node-set (node-set — node အစု) တစ်ခု ထွက်ရင် function က false ကို ပြန်ပြီး — တခြား value တစ်ခုခု ထွက်ရင်တော့ true ကို ပြန်ပါတယ်။ Argument တစ်ခုခု null ဖြစ်ရင် function က null ကို ပြန်ပါတယ်။ Context item အဖြစ် ပို့လိုက်တဲ့ nonnull value က — content fragment ဒါမှမဟုတ် XML မဟုတ်တဲ့ value တစ်ခုခု မဟုတ်ဘဲ — XML document တစ်ခု ဖြစ်ရပါမယ်။

ဥပမာ:

```sql
SELECT xmlexists('//town[text() = ''Toronto'']' PASSING BY VALUE '<towns><town>Toronto</town><town>Ottawa</town></towns>');

 xmlexists
------------
 t
(1 row)
```

`BY REF` နဲ့ `BY VALUE` clauses တွေကို PostgreSQL မှာ လက်ခံပေမယ့် — [အပိုင်း D.3.2](https://www.postgresql.org/docs/current/xml-limits-conformance.html#FUNCTIONS-XML-LIMITS-POSTGRESQL) မှာ ဆွေးနွေးထားသလို — လျစ်လျူရှုပါတယ်။

SQL standard မှာတော့ `xmlexists` function က XML Query language နဲ့ ရေးထားတဲ့ expression တစ်ခုကို အကဲဖြတ်ပေမယ့် — [အပိုင်း D.3.1](https://www.postgresql.org/docs/current/xml-limits-conformance.html#FUNCTIONS-XML-LIMITS-XPATH1) မှာ ဆွေးနွေးထားသလို — PostgreSQL ကတော့ XPath 1.0 expression တစ်ခုကိုပဲ ခွင့်ပြုပါတယ်။

#### 9.15.2.4. `xml_is_well_formed`

```sql
xml_is_well_formed ( text ) → boolean
xml_is_well_formed_document ( text ) → boolean
xml_is_well_formed_content ( text ) → boolean
```

ဒီ functions တွေက `text` string တစ်ခုက well-formed (ဖွဲ့စည်းပုံ စည်းမျဉ်းနဲ့ ကိုက်ညီသော) XML ကို ကိုယ်စားပြုမပြု စစ်ဆေးပြီး — Boolean ရလဒ်တစ်ခုကို ပြန်ပေးပါတယ်။ `xml_is_well_formed_document` က well-formed document ဖြစ်မဖြစ် စစ်ဆေးပြီး — `xml_is_well_formed_content` ကတော့ well-formed content ဖြစ်မဖြစ် စစ်ဆေးပါတယ်။ `xml_is_well_formed` ကတော့ — [xmloption](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-XMLOPTION) configuration parameter ကို `DOCUMENT` လို့ သတ်မှတ်ထားရင် ပထမ ပုံစံကို — `CONTENT` လို့ သတ်မှတ်ထားရင် ဒုတိယ ပုံစံကို လုပ်ဆောင်ပါတယ်။ ဆိုလိုတာက — `xml_is_well_formed` က `xml` type ဆီ ရိုးရှင်းတဲ့ cast တစ်ခု အောင်မြင်မလား ဆိုတာ ကြည့်ဖို့ အသုံးဝင်ပြီး — ကျန် function နှစ်ခုကတော့ `XMLPARSE` ရဲ့ သက်ဆိုင်ရာ variant တွေ အောင်မြင်မလား ဆိုတာ ကြည့်ဖို့ အသုံးဝင်ပါတယ်။

ဥပမာများ:

```sql
SET xmloption TO DOCUMENT;
SELECT xml_is_well_formed('<>');
 xml_is_well_formed
--------------------
 f
(1 row)

SELECT xml_is_well_formed('<abc/>');
 xml_is_well_formed
--------------------
 t
(1 row)

SET xmloption TO CONTENT;
SELECT xml_is_well_formed('abc');
 xml_is_well_formed
--------------------
 t
(1 row)

SELECT xml_is_well_formed_document('<pg:foo xmlns:pg="http://postgresql.org/stuff">bar</pg:foo>');
 xml_is_well_formed_document
-----------------------------
 t
(1 row)

SELECT xml_is_well_formed_document('<pg:foo xmlns:pg="http://postgresql.org/stuff">bar</my:foo>');
 xml_is_well_formed_document
-----------------------------
 f
(1 row)
```

နောက်ဆုံး ဥပမာက — စစ်ဆေးမှုတွေမှာ namespaces တွေ မှန်ကန်စွာ ကိုက်ညီမကိုက်ညီပါ ပါဝင်ကြောင်း ပြသပါတယ်။

### 9.15.3. Processing XML (XML process လုပ်ခြင်း)

`xml` data type ရဲ့ values တွေကို process လုပ်ဖို့ — PostgreSQL က XPath 1.0 expressions တွေကို အကဲဖြတ်ပေးတဲ့ `xpath` နဲ့ `xpath_exists` functions တွေနဲ့ — `XMLTABLE` table function ကို ထောက်ပံ့ပေးပါတယ်။

#### 9.15.3.1. `xpath`

```sql
xpath ( xpath text, xml xml [, nsarray text[] ] ) → xml[]
```

`xpath` function က — XML value *xml* ပေါ်မှာ XPath 1.0 expression *xpath* (text အဖြစ် ပေးထားတဲ့) ကို အကဲဖြတ်ပါတယ်။ ၎င်းက XPath expression က ထုတ်လုပ်လိုက်တဲ့ node-set နဲ့ ကိုက်ညီတဲ့ XML values တွေရဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ XPath expression က node-set တစ်ခု အစား scalar value တစ်ခု ပြန်ပေးရင်တော့ — element တစ်ခုတည်း ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။

ဒုတိယ argument က well formed XML document တစ်ခု ဖြစ်ရပါမယ်။ အထူးသဖြင့် — root node element တစ်ခုတည်း ရှိရပါမယ်။

Function ရဲ့ optional တတိယ argument က namespace mappings တွေရဲ့ array တစ်ခု ဖြစ်ပါတယ်။ ဒီ array က — ဒုတိယ axis ရဲ့ length က 2 နဲ့ ညီနေတဲ့ — two-dimensional `text` array တစ်ခု ဖြစ်သင့်ပါတယ် (ဆိုလိုတာက — array တစ်ခုချင်းစီမှာ element အတိအကျ 2 ခု ပါဝင်တဲ့ — arrays တွေရဲ့ array တစ်ခု ဖြစ်သင့်ပါတယ်)။ Array entry တစ်ခုချင်းစီရဲ့ ပထမ element က namespace name (alias) ဖြစ်ပြီး — ဒုတိယ element က namespace URI ဖြစ်ပါတယ်။ ဒီ array ထဲမှာ ပေးထားတဲ့ aliases တွေက XML document ကိုယ်တိုင်ထဲမှာ သုံးထားတာတွေနဲ့ အတူတူ ဖြစ်ဖို့ မလိုအပ်ပါဘူး (တနည်းအားဖြင့် — XML document ထဲမှာရော `xpath` function ရဲ့ context ထဲမှာပါ — aliases တွေက local တွေ ဖြစ်ပါတယ်)။

ဥပမာ:

```sql
SELECT xpath('/my:a/text()', '<my:a xmlns:my="http://example.com">test</my:a>',
             ARRAY[ARRAY['my', 'http://example.com']]);

 xpath
--------
 {test}
(1 row)
```

Default (anonymous) namespaces တွေကို ကိုင်တွယ်ဖို့ ဒီလိုမျိုး လုပ်ပါ:

```sql
SELECT xpath('//mydefns:b/text()', '<a xmlns="http://example.com"><b>test</b></a>',
             ARRAY[ARRAY['mydefns', 'http://example.com']]);

 xpath
--------
 {test}
(1 row)
```

#### 9.15.3.2. `xpath_exists`

```sql
xpath_exists ( xpath text, xml xml [, nsarray text[] ] ) → boolean
```

`xpath_exists` function က `xpath` function ရဲ့ အထူးပြု (specialized) ပုံစံတစ်ခု ဖြစ်ပါတယ်။ XPath 1.0 expression ကို ကျေနပ်စေတဲ့ XML value တစ်ခုချင်းစီကို ပြန်ပေးမယ့်အစား — ဒီ function က query ကျေနပ်ခဲ့မကျေနပ်ခဲ့ (အထူးသဖြင့် — empty node-set မဟုတ်တဲ့ value တစ်ခုခု ထုတ်ပေးခဲ့မခဲ့) ကို ညွှန်ပြတဲ့ Boolean တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ function က `XMLEXISTS` predicate နဲ့ ညီမျှပေမယ့် — namespace mapping argument တစ်ခုအတွက် ထောက်ပံ့မှုကိုပါ ထပ်ဆောင်း ပေးတာပဲ ကွာပါတယ်။

ဥပမာ:

```sql
SELECT xpath_exists('/my:a/text()', '<my:a xmlns:my="http://example.com">test</my:a>',
                     ARRAY[ARRAY['my', 'http://example.com']]);

 xpath_exists
--------------
 t
(1 row)
```

#### 9.15.3.3. `xmltable`

```sql
XMLTABLE (
    [ XMLNAMESPACES ( namespace_uri AS namespace_name [, ...] ), ]
    row_expression PASSING [BY {REF|VALUE}] document_expression [BY {REF|VALUE}]
    COLUMNS name { type [PATH column_expression] [DEFAULT default_expression] [NOT NULL | NULL]
                  | FOR ORDINALITY }
            [, ...]
) → setof record
```

`xmltable` expression က — XML value တစ်ခု၊ rows တွေ ထုတ်ယူဖို့ XPath filter တစ်ခုနဲ့ column definitions အစုတစ်စုတို့ကို အခြေခံပြီး — table တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။ Syntax အရ function တစ်ခုနဲ့ ဆင်ပေမယ့် — query တစ်ခုရဲ့ `FROM` clause ထဲမှာ table တစ်ခုအနေနဲ့ပဲ ပေါ်လို့ ရပါတယ်။

Optional ဖြစ်တဲ့ `XMLNAMESPACES` clause က — `namespace_uri` တစ်ခုချင်းစီက `text` expression တစ်ခု ဖြစ်ပြီး `namespace_name` တစ်ခုချင်းစီက ရိုးရှင်းတဲ့ identifier တစ်ခု ဖြစ်တဲ့ — comma နဲ့ ခြားထားတဲ့ namespace definitions စာရင်းတစ်ခုကို ပေးပါတယ်။ ၎င်းက document ထဲမှာ သုံးထားတဲ့ XML namespaces တွေနဲ့ သူတို့ရဲ့ aliases တွေကို သတ်မှတ်ပေးပါတယ်။ Default namespace specification တစ်ခုကိုတော့ လက်ရှိမှာ ထောက်ပံ့မထားပါဘူး။

မဖြစ်မနေ လိုအပ်တဲ့ `row_expression` argument က — XML nodes အစုတစ်စု ရရှိဖို့ — XML value `document_expression` ကို ၎င်းရဲ့ context item အဖြစ် ပို့ပြီး — အကဲဖြတ်တဲ့ XPath 1.0 expression (`text` အဖြစ် ပေးထားတဲ့) တစ်ခု ဖြစ်ပါတယ်။ `xmltable` က output rows တွေအဖြစ် ပြောင်းလဲပေးတာက ဒီ nodes တွေပဲ ဖြစ်ပါတယ်။ `document_expression` က null ဖြစ်ရင် ဒါမှမဟုတ် — `row_expression` က empty node-set တစ်ခု ဒါမှမဟုတ် node-set မဟုတ်တဲ့ value တစ်ခုခု ထုတ်ပေးရင်တော့ — rows တွေ ဘာမှ ထုတ်လုပ်မှာ မဟုတ်ပါဘူး။

`document_expression` က `row_expression` အတွက် context item ကို ထောက်ပံ့ပေးပါတယ်။ ၎င်းက well-formed XML document တစ်ခု ဖြစ်ရပါမယ်; fragments/forests တွေကိုတော့ လက်မခံပါဘူး။ `BY REF` နဲ့ `BY VALUE` clauses တွေကို လက်ခံပေမယ့် — [အပိုင်း D.3.2](https://www.postgresql.org/docs/current/xml-limits-conformance.html#FUNCTIONS-XML-LIMITS-POSTGRESQL) မှာ ဆွေးနွေးထားသလို — လျစ်လျူရှုပါတယ်။

SQL standard မှာတော့ `xmltable` function က XML Query language နဲ့ ရေးထားတဲ့ expressions တွေကို အကဲဖြတ်ပေမယ့် — [အပိုင်း D.3.1](https://www.postgresql.org/docs/current/xml-limits-conformance.html#FUNCTIONS-XML-LIMITS-XPATH1) မှာ ဆွေးနွေးထားသလို — PostgreSQL ကတော့ XPath 1.0 expressions တွေကိုပဲ ခွင့်ပြုပါတယ်။

မဖြစ်မနေ လိုအပ်တဲ့ `COLUMNS` clause က output table ထဲမှာ ထုတ်လုပ်မယ့် column(s) တွေကို သတ်မှတ်ပေးပါတယ်။ Format အတွက် အပေါ်က syntax အကျဉ်းချုပ်ကို ကြည့်ပါ။ Column တစ်ခုချင်းစီအတွက် name ရော data type ရော လိုအပ်ပါတယ် (`FOR ORDINALITY` ကို သတ်မှတ်ထားရင်တော့ လွဲပါတယ် — အဲဒီအခါ `integer` type ကို သွယ်ဝိုက် (implicit) အနေနဲ့ သုံးပါတယ်)။ Path, default နဲ့ nullability clauses တွေကတော့ optional ပါ။

`FOR ORDINALITY` လို့ အမှတ်အသား လုပ်ထားတဲ့ column တစ်ခုကို — `row_expression` ရဲ့ ရလဒ် node-set ကနေ ထုတ်ယူလိုက်တဲ့ nodes တွေရဲ့ အစဉ်အတိုင်း — 1 ကနေ စတင်တဲ့ row numbers တွေနဲ့ ဖြည့်ပါတယ်။ Column တစ်ခုထက်ပိုပြီး `FOR ORDINALITY` လို့ အမှတ်အသား လုပ်လို့ မရပါဘူး။

> **မှတ်ချက်:** XPath 1.0 က node-set တစ်ခုထဲက nodes တွေအတွက် အစဉ်တစ်ခုကို သတ်မှတ်မပေးပါဘူး — ဒါကြောင့် ရလဒ်တွေရဲ့ သီးခြား အစဉ်တစ်ခုပေါ်မှာ အားကိုးထားတဲ့ code တွေက implementation-dependent (အကောင်အထည်ဖော်မှုအပေါ် မူတည်သော) ဖြစ်ပါလိမ့်မယ်။ အသေးစိတ်ကို [အပိုင်း D.3.1.2](https://www.postgresql.org/docs/current/xml-limits-conformance.html#XML-XPATH-1-SPECIFICS) မှာ တွေ့နိုင်ပါတယ်။

Column တစ်ခုအတွက် `column_expression` က — column ရဲ့ တန်ဖိုးကို ရှာဖွေဖို့ — `row_expression` ရလဒ်ထဲက လက်ရှိ node ကို ၎င်းရဲ့ context item အဖြစ် သုံးပြီး — row တစ်ခုချင်းစီအတွက် အကဲဖြတ်တဲ့ XPath 1.0 expression တစ်ခု ဖြစ်ပါတယ်။ `column_expression` ကို မပေးထားဘူးဆိုရင် — column name ကို implicit path အဖြစ် သုံးပါတယ်။

Column တစ်ခုရဲ့ XPath expression က non-XML value တစ်ခု ပြန်ပေးပြီး (XPath 1.0 မှာ ဒါက string, boolean ဒါမှမဟုတ် double ဆိုတာတွေပဲ ဖြစ်ပါတယ်) — column ရဲ့ PostgreSQL type က `xml` မဟုတ်ဘူးဆိုရင် — value ရဲ့ string representation ကို အဲဒီ PostgreSQL type ဆီ assign လုပ်လိုက်သလိုပဲ — column ကို သတ်မှတ်ပေးပါတယ်။ (Value က boolean ဖြစ်ရင် — output column ရဲ့ type category က numeric ဖြစ်နေရင် သူ့ရဲ့ string representation ကို `1` ဒါမှမဟုတ် `0` အနေနဲ့ ယူပြီး — မဟုတ်ရင် `true` ဒါမှမဟုတ် `false` အနေနဲ့ ယူပါတယ်။)

Column တစ်ခုရဲ့ XPath expression က XML nodes တွေရဲ့ non-empty set တစ်ခု ပြန်ပေးပြီး — column ရဲ့ PostgreSQL type က `xml` ဖြစ်ရင် — အဲဒီ ရလဒ်က document ဒါမှမဟုတ် content form ဖြစ်နေတယ်ဆိုရင် — expression ရဲ့ ရလဒ်ကို အတိအကျ column ဆီ assign လုပ်ပါတယ်။ [8]

`xml` output column တစ်ခုဆီ assign လုပ်လိုက်တဲ့ non-XML ရလဒ်တစ်ခုက — ရလဒ်ရဲ့ string value ပါဝင်တဲ့ text node တစ်ခုတည်း ပါတဲ့ content တစ်ခုကို ထုတ်ပေးပါတယ်။ တခြား type တစ်ခုခုရဲ့ column တစ်ခုဆီ assign လုပ်လိုက်တဲ့ XML ရလဒ်တစ်ခုမှာတော့ — node တစ်ခုထက်ပို မပါဝင်ရပါဘူး — ပါဝင်ခဲ့ရင် error တက်ပါတယ်။ Node အတိအကျ တစ်ခုပဲ ရှိရင် — node ရဲ့ string value (XPath 1.0 `string` function မှာ သတ်မှတ်ထားတဲ့အတိုင်း) ကို PostgreSQL type ဆီ assign လုပ်လိုက်သလိုပဲ — column ကို သတ်မှတ်ပေးပါတယ်။

XML element တစ်ခုရဲ့ string value ဆိုတာ — အဲဒီ element နဲ့ ၎င်းရဲ့ descendants တွေထဲမှာ ပါဝင်တဲ့ text nodes တွေ အားလုံးကို document order (document ထဲ ပေါ်လာသည့် အစဉ်) အတိုင်း ဆက်စပ်ထားတာ ဖြစ်ပါတယ်။ Descendant text nodes တွေ လုံးဝမရှိတဲ့ element တစ်ခုရဲ့ string value က empty string (ဗလာ string — `NULL` မဟုတ်) ပါ။ `xsi:nil` attributes တွေကိုတော့ လျစ်လျူရှုပါတယ်။ Non-text elements နှစ်ခုကြားက whitespace-only `text()` node ကို ထိန်းသိမ်းထားပြီး — `text()` node တစ်ခုပေါ်က ရှေ့ဆုံး (leading) whitespace တွေကိုတော့ flatten မလုပ်ပါဘူးဆိုတာ သတိပြုပါ။ တခြား XML node types တွေနဲ့ non-XML values တွေရဲ့ string value တွေကို သတ်မှတ်ပေးတဲ့ စည်းမျဉ်းတွေအတွက် XPath 1.0 `string` function ကို ကိုးကားနိုင်ပါတယ်။

ဒီနေရာမှာ တင်ပြထားတဲ့ conversion rules တွေက — [အပိုင်း D.3.1.3](https://www.postgresql.org/docs/current/xml-limits-conformance.html#FUNCTIONS-XML-LIMITS-CASTS) မှာ ဆွေးနွေးထားသလို — SQL standard ရဲ့ စည်းမျဉ်းတွေနဲ့ အတိအကျတော့ မတူပါဘူး။

Path expression က ပေးထားတဲ့ row တစ်ခုအတွက် empty node-set တစ်ခု ပြန်ပေးရင် (ပုံမှန်အားဖြင့် — မကိုက်ညီတဲ့အခါ) — column ကို `NULL` လို့ သတ်မှတ်ပါတယ်; `default_expression` တစ်ခု သတ်မှတ်ထားရင်တော့ — အဲဒီ expression ကို အကဲဖြတ်ခြင်းကနေ ရလာတဲ့ တန်ဖိုးကို သုံးပါတယ်။

`default_expression` တစ်ခုကို — `xmltable` ကို ခေါ်ယူတဲ့အခါ ချက်ချင်း အကဲဖြတ်မယ့်အစား — column အတွက် default တစ်ခု လိုအပ်တိုင်း အကဲဖြတ်ပါတယ်။ Expression က stable ဒါမှမဟုတ် immutable အဖြစ် အရည်အချင်း ပြည့်မီနေရင် — ထပ်ခါထပ်ခါ အကဲဖြတ်တာကို ကျော်လိုက်နိုင်ပါတယ်။ ဆိုလိုတာက — `nextval` လို volatile functions တွေကို `default_expression` ထဲမှာ အသုံးဝင်စွာ သုံးနိုင်ပါတယ်။

Columns တွေကို `NOT NULL` လို့ အမှတ်အသား လုပ်လို့ ရပါတယ်။ `NOT NULL` column တစ်ခုအတွက် `column_expression` က ဘာနဲ့မှ မကိုက်ညီဘဲ — `DEFAULT` လည်း မရှိဘူး ဒါမှမဟုတ် `default_expression` ကပါ null လို့ အကဲဖြတ်နေရင်တော့ error တစ်ခု သတင်းပို့ပါတယ်။

ဥပမာများ:

```
CREATE TABLE xmldata AS SELECT
xml $$
<ROWS>
  <ROW id="1">
    <COUNTRY_ID>AU</COUNTRY_ID>
    <COUNTRY_NAME>Australia</COUNTRY_NAME>
  </ROW>
  <ROW id="5">
    <COUNTRY_ID>JP</COUNTRY_ID>
    <COUNTRY_NAME>Japan</COUNTRY_NAME>
    <PREMIER_NAME>Shinzo Abe</PREMIER_NAME>
    <SIZE unit="sq_mi">145935</SIZE>
  </ROW>
  <ROW id="6">
    <COUNTRY_ID>SG</COUNTRY_ID>
    <COUNTRY_NAME>Singapore</COUNTRY_NAME>
    <SIZE unit="sq_km">697</SIZE>
  </ROW>
</ROWS>
$$ AS data;

SELECT xmltable.*
  FROM xmldata,
       XMLTABLE('//ROWS/ROW'
                PASSING data
                COLUMNS id int PATH '@id',
                        ordinality FOR ORDINALITY,
                        "COUNTRY_NAME" text,
                        country_id text PATH 'COUNTRY_ID',
                        size_sq_km float PATH 'SIZE[@unit = "sq_km"]',
                        size_other text PATH
                             'concat(SIZE[@unit!="sq_km"], " ", SIZE[@unit!="sq_km"]/@unit)',
                        premier_name text PATH 'PREMIER_NAME' DEFAULT 'not specified');

 id | ordinality | COUNTRY_NAME | country_id | size_sq_km |  size_other  | premier_name
----+------------+--------------+------------+------------+--------------+---------------
  1 |          1 | Australia    | AU         |            |              | not specified
  5 |          2 | Japan        | JP         |            | 145935 sq_mi | Shinzo Abe
  6 |          3 | Singapore    | SG         |        697 |              | not specified
```

အောက်ပါ ဥပမာက text() nodes အများအပြားရဲ့ concatenation (ဆက်စပ်ခြင်း)၊ column name ကို XPath filter အဖြစ် သုံးတာနဲ့ — whitespace, XML comments နဲ့ processing instructions တွေကို ကိုင်တွယ်ပုံတို့ကို ပြသပါတယ်:

```
CREATE TABLE xmlelements AS SELECT
xml $$
  <root>
   <element>  Hello<!-- xyxxz -->2a2<?aaaaa?> <!--x-->  bbb<x>xxx</x>CC  </element>
  </root>
$$ AS data;

SELECT xmltable.*
  FROM xmlelements, XMLTABLE('/root' PASSING data COLUMNS element text);
         element
-------------------------
   Hello2a2   bbbxxxCC
```

အောက်ပါ ဥပမာက — XML document ထဲမှာရော XPath expressions တွေထဲမှာပါ သုံးထားတဲ့ namespaces တွေရဲ့ စာရင်းတစ်ခုကို သတ်မှတ်ဖို့ `XMLNAMESPACES` clause ကို ဘယ်လို သုံးနိုင်တယ်ဆိုတာ သရုပ်ပြပါတယ်:

```sql
WITH xmldata(data) AS (VALUES ('
<example xmlns="http://example.com/myns" xmlns:B="http://example.com/b">
 <item foo="1" B:bar="2"/>
 <item foo="3" B:bar="4"/>
 <item foo="4" B:bar="5"/>
</example>'::xml)
)
SELECT xmltable.*
  FROM XMLTABLE(XMLNAMESPACES('http://example.com/myns' AS x,
                              'http://example.com/b' AS "B"),
             '/x:example/x:item'
                PASSING (SELECT data FROM xmldata)
                COLUMNS foo int PATH '@foo',
                  bar int PATH '@B:bar');
 foo | bar
-----+-----
   1 |   2
   3 |   4
   4 |   5
(3 rows)
```

### 9.15.4. Mapping Tables to XML (Table များကို XML သို့ mapping လုပ်ခြင်း)

အောက်ပါ functions တွေက relational tables တွေရဲ့ contents တွေကို XML values တွေအဖြစ် mapping လုပ်ပေးပါတယ်။ သူတို့ကို XML export လုပ်နိုင်စွမ်း (functionality) တစ်ခုအနေနဲ့ ယူဆလို့ ရပါတယ်:

```sql
table_to_xml ( table regclass, nulls boolean,
               tableforest boolean, targetns text ) → xml
query_to_xml ( query text, nulls boolean,
               tableforest boolean, targetns text ) → xml
cursor_to_xml ( cursor refcursor, count integer, nulls boolean,
                tableforest boolean, targetns text ) → xml
```

`table_to_xml` က — parameter *table* အနေနဲ့ ပို့လိုက်တဲ့ နာမည်ပေးထားတဲ့ table ရဲ့ content ကို mapping လုပ်ပါတယ်။ `regclass` type က — optional schema qualification (schema နဲ့ ရှေ့ဆွဲခြင်း) နဲ့ double quotes တွေ အပါအဝင် (အသေးစိတ်အတွက် [အပိုင်း 8.19](/docs/postgresql/datatype-oid) ကို ကြည့်ပါ) — ပုံမှန် notation သုံးပြီး tables တွေကို ဖော်ထုတ်တဲ့ strings တွေကို လက်ခံပါတယ်။ `query_to_xml` က parameter *query* အနေနဲ့ ပို့လိုက်တဲ့ text ပါဝင်တဲ့ query ကို execute လုပ်ပြီး — ရလဒ် set ကို mapping လုပ်ပါတယ်။ `cursor_to_xml` က parameter *cursor* နဲ့ သတ်မှတ်ထားတဲ့ cursor ကနေ ညွှန်ပြထားတဲ့ row အရေအတွက်ကို ထုတ်ယူပါတယ်။ ရလဒ် value တွေကို function တစ်ခုချင်းစီက memory ထဲမှာ တည်ဆောက်တာမို့ — table ကြီးတွေကို mapping လုပ်ရမယ်ဆိုရင် ဒီ variant ကို အကြံပြုပါတယ်။

*tableforest* က false ဖြစ်ရင် — ရလာတဲ့ XML document က ဒီလိုပုံ ပေါက်ပါတယ်:

```sql
<tablename>
  <row>
    <columnname1>data</columnname1>
    <columnname2>data</columnname2>
  </row>

  <row>
    ...
  </row>

  ...
</tablename>
```

*tableforest* က true ဖြစ်ရင် — ရလဒ်က ဒီလိုပုံ ပေါက်တဲ့ XML content fragment တစ်ခု ဖြစ်ပါတယ်:

```sql
<tablename>
  <columnname1>data</columnname1>
  <columnname2>data</columnname2>
</tablename>

<tablename>
  ...
</tablename>

...
```

Table name မရနိုင်တဲ့အခါ — ဆိုလိုတာက query တစ်ခု ဒါမှမဟုတ် cursor တစ်ခုကို mapping လုပ်နေတဲ့အခါ — ပထမ format မှာ `table` ဆိုတဲ့ string ကို သုံးပြီး — ဒုတိယ format မှာတော့ `row` ကို သုံးပါတယ်။

ဒီ formats နှစ်ခုကြားက ရွေးချယ်မှုက user အပေါ်မှာ မူတည်ပါတယ်။ ပထမ format က သင့်လျော်တဲ့ XML document တစ်ခု ဖြစ်လို့ — application အများအပြားမှာ အရေးပါပါတယ်။ ဒုတိယ format ကတော့ — ရလဒ် values တွေကို နောက်ပိုင်းမှာ document တစ်ခုတည်းအဖြစ် ပြန်စုစည်းမယ်ဆိုရင် — `cursor_to_xml` function မှာ ပိုပြီး အသုံးဝင်တတ်ပါတယ်။ အပေါ်မှာ ဆွေးနွေးခဲ့တဲ့ XML content ထုတ်လုပ်ရေး functions တွေ — အထူးသဖြင့် `xmlelement` — ကို ရလဒ်တွေကို မိမိနှစ်သက်ရာ ပုံစံအတိုင်း ပြုပြင်ဖို့ သုံးနိုင်ပါတယ်။

Data values တွေကို အပေါ်မှာ `xmlelement` function အတွက် ဖော်ပြထားတဲ့ နည်းအတိုင်းပဲ mapping လုပ်ပါတယ်။

*nulls* parameter က null values တွေကို output ထဲမှာ ထည့်သွင်းသင့်မသင့် ဆုံးဖြတ်ပေးပါတယ်။ True ဖြစ်ရင် — columns တွေထဲက null values တွေကို ဒီလို ကိုယ်စားပြုပါတယ်:

```sql
<columnname xsi:nil="true"/>
```

ဒီမှာ `xsi` က XML Schema Instance အတွက် XML namespace prefix ဖြစ်ပါတယ်။ သင့်လျော်တဲ့ namespace declaration တစ်ခုကို ရလဒ် value ထဲမှာ ထပ်ထည့်ပေးပါလိမ့်မယ်။ False ဖြစ်ရင် — null values တွေ ပါဝင်တဲ့ columns တွေကို output ကနေ ရိုးရိုးလေး ချန်လှပ်လိုက်ပါတယ်။

*targetns* parameter က ရလဒ်ရဲ့ လိုချင်တဲ့ XML namespace ကို သတ်မှတ်ပေးပါတယ်။ သီးခြား namespace တစ်ခုခု မလိုချင်ဘူးဆိုရင် — empty string (ဗလာ string) တစ်ခုကို ပို့ပေးသင့်ပါတယ်။

အောက်ပါ functions တွေက — အပေါ်က သက်ဆိုင်ရာ functions တွေ လုပ်ဆောင်တဲ့ mappings တွေကို ဖော်ပြတဲ့ XML Schema documents တွေကို ပြန်ပေးပါတယ်:

```sql
table_to_xmlschema ( table regclass, nulls boolean,
                     tableforest boolean, targetns text ) → xml
query_to_xmlschema ( query text, nulls boolean,
                     tableforest boolean, targetns text ) → xml
cursor_to_xmlschema ( cursor refcursor, nulls boolean,
                      tableforest boolean, targetns text ) → xml
```

ကိုက်ညီတဲ့ XML data mappings နဲ့ XML Schema documents တွေ ရရှိဖို့ — parameters တွေ အတူတူပဲ ပို့ပေးဖို့ မရှိမဖြစ် လိုအပ်ပါတယ်။

အောက်ပါ functions တွေက XML data mappings တွေနဲ့ သက်ဆိုင်တဲ့ XML Schema ကို — ချိတ်ဆက်ထားတဲ့ — document (သို့မဟုတ် forest) တစ်ခုတည်းထဲမှာ ထုတ်လုပ်ပေးပါတယ်။ Self-contained (ပါဝင်ရင်း ပြည့်စုံသော) ပြီး self-describing (ကိုယ့်ကိုယ်ကို ဖော်ပြနိုင်သော) ရလဒ်တွေ လိုချင်တဲ့နေရာမှာ ဒါတွေ အသုံးဝင်နိုင်ပါတယ်:

```sql
table_to_xml_and_xmlschema ( table regclass, nulls boolean,
                             tableforest boolean, targetns text ) → xml
query_to_xml_and_xmlschema ( query text, nulls boolean,
                             tableforest boolean, targetns text ) → xml
```

ထို့အပြင် — schema တစ်ခုလုံး ဒါမှမဟုတ် လက်ရှိ database တစ်ခုလုံးရဲ့ ဆင်တူတဲ့ mappings တွေကို ထုတ်လုပ်ဖို့ — အောက်ပါ functions တွေလည်း ရနိုင်ပါတယ်:

```sql
schema_to_xml ( schema name, nulls boolean,
                tableforest boolean, targetns text ) → xml
schema_to_xmlschema ( schema name, nulls boolean,
                      tableforest boolean, targetns text ) → xml
schema_to_xml_and_xmlschema ( schema name, nulls boolean,
                              tableforest boolean, targetns text ) → xml

database_to_xml ( nulls boolean,
                  tableforest boolean, targetns text ) → xml
database_to_xmlschema ( nulls boolean,
                        tableforest boolean, targetns text ) → xml
database_to_xml_and_xmlschema ( nulls boolean,
                                tableforest boolean, targetns text ) → xml
```

ဒီ functions တွေက လက်ရှိ user ဖတ်လို့ မရတဲ့ tables တွေကို လျစ်လျူရှုပါတယ်။ Database တစ်ခုလုံးနဲ့ ဆိုင်တဲ့ functions တွေကတော့ — လက်ရှိ user မှာ `USAGE` (lookup) privilege မရှိတဲ့ schemas တွေကိုပါ ထပ်ပြီး လျစ်လျူရှုပါတယ်။

ဒါတွေက data အမြောက်အများကို ထုတ်လုပ်နိုင်ပြီး — အဲဒါတွေကို memory ထဲမှာ တည်ဆောက်ရတာကို သတိပြုပါ။ Schema ကြီးတွေ ဒါမှမဟုတ် databases တွေရဲ့ content mappings တွေကို တောင်းဆိုတဲ့အခါ — အဲဒီအစား tables တွေကို သီးခြားစီ mapping လုပ်တာကို စဉ်းစားကြည့်ဖို့ ထိုက်တန်ပါတယ် — ဖြစ်နိုင်ရင် cursor တစ်ခုကနေတစ်ဆင့်တောင် ပြုလုပ်လို့ ရပါတယ်။

Schema content mapping တစ်ခုရဲ့ ရလဒ်က ဒီလိုပုံ ပေါက်ပါတယ်:

```sql
<schemaname>

table1-mapping

table2-mapping

...

</schemaname>
```

ဒီမှာ table mapping တစ်ခုရဲ့ format က အပေါ်မှာ ရှင်းပြထားတဲ့အတိုင်း — *tableforest* parameter ပေါ်မှာ မူတည်ပါတယ်။

Database content mapping တစ်ခုရဲ့ ရလဒ်က ဒီလိုပုံ ပေါက်ပါတယ်:

```sql
<dbname>

<schema1name>
  ...
</schema1name>

<schema2name>
  ...
</schema2name>

...

</dbname>
```

ဒီမှာ schema mapping က အပေါ်မှာ ဖော်ပြထားတဲ့အတိုင်းပဲ ဖြစ်ပါတယ်။

ဒီ functions တွေ ထုတ်လုပ်တဲ့ output ကို သုံးတဲ့ ဥပမာအနေနဲ့ — ဥပမာ 9.1 က — `table_to_xml_and_xmlschema` ရဲ့ output ကို — table data တွေရဲ့ ဇယားကွက် (tabular) ပုံစံ ကိုယ်စားပြုမှု ပါဝင်တဲ့ HTML document တစ်ခုအဖြစ် ပြောင်းပေးတဲ့ XSLT stylesheet တစ်ခုကို ပြသထားပါတယ်။ အလားတူ နည်းနဲ့ပဲ — ဒီ functions တွေရဲ့ ရလဒ်တွေကို တခြား XML-based formats တွေအဖြစ်လည်း ပြောင်းလဲလို့ ရပါတယ်။

**ဥပမာ 9.1. SQL/XML Output ကို HTML အဖြစ် ပြောင်းရန် XSLT Stylesheet**

```sql
<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns="http://www.w3.org/1999/xhtml"
>

  <xsl:output method="xml"
      doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
      doctype-public="-//W3C/DTD XHTML 1.0 Strict//EN"
      indent="yes"/>

  <xsl:template match="/*">
    <xsl:variable name="schema" select="//xsd:schema"/>
    <xsl:variable name="tabletypename"
                  select="$schema/xsd:element[@name=name(current())]/@type"/>
    <xsl:variable name="rowtypename"
                  select="$schema/xsd:complexType[@name=$tabletypename]/xsd:sequence/xsd:element[@name='row']/@type"/>

    <html>
      <head>
        <title><xsl:value-of select="name(current())"/></title>
      </head>
      <body>
        <table>
          <tr>
            <xsl:for-each select="$schema/xsd:complexType[@name=$rowtypename]/xsd:sequence/xsd:element/@name">
              <th><xsl:value-of select="."/></th>
            </xsl:for-each>
          </tr>

          <xsl:for-each select="row">
            <tr>
              <xsl:for-each select="*">
                <td><xsl:value-of select="."/></td>
              </xsl:for-each>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
```

---

[8] Top-level မှာ element node တစ်ခုထက်ပို ပါဝင်တဲ့ ရလဒ်တစ်ခု၊ ဒါမှမဟုတ် element တစ်ခုရဲ့ အပြင်ဘက်မှာ non-whitespace text ပါဝင်တဲ့ ရလဒ်တစ်ခုက content form ရဲ့ ဥပမာတွေ ဖြစ်ပါတယ်။ XPath ရလဒ်တစ်ခုက — ဥပမာ — သူ့ကို ထည့်ထားတဲ့ element ကနေ ရွေးချယ်လိုက်တဲ့ attribute node တစ်ခုကို ပြန်ပေးရင် — form နှစ်မျိုးလုံးထဲက တစ်ခုမှ မဟုတ်ဘဲ ဖြစ်နိုင်ပါတယ်။ အဲဒီလို ရလဒ်မျိုးကို — ခွင့်မပြုထားတဲ့ node တစ်ခုချင်းစီကို XPath 1.0 `string` function မှာ သတ်မှတ်ထားတဲ့အတိုင်း ၎င်းရဲ့ string value နဲ့ အစားထိုးပြီး — content form ထဲ ထည့်သွင်းပါလိမ့်မယ်။
