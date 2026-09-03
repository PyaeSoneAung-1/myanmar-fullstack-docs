---
title: "Operator Classes and Operator Families (operator class နဲ့ operator family များ)"
description: "Index column တစ်ခုချင်းစီအတွက် သုံးမယ့် operator တွေကို သတ်မှတ်ပေးတဲ့ operator class နဲ့ operator class တွေ စုဖွဲ့ရာ operator family သဘောတရား — text_pattern_ops လို built-in operator class များ၊ pattern-matching query တွေအတွက် xxx_pattern_ops operator class များ သုံးပုံနဲ့ operator class / operator family စာရင်းကြည့်ရန် catalog query များ"
order: 77
source: "https://www.postgresql.org/docs/current/indexes-opclass.html"
status: translated
updated: 2026-09-03
---

## 11.10. Operator Classes and Operator Families (operator class နဲ့ operator family များ)

Index definition တစ်ခုက index ရဲ့ column တစ်ခုချင်းစီအတွက် *operator class* (operator အတန်းအစား) တစ်ခုကို သတ်မှတ်ပေးနိုင်ပါတယ်။

```sql
CREATE INDEX name ON table (column opclass [ ( opclass_options ) ] [sort options] [, ...]);
```

Operator class က — အဲဒီ column အတွက် index က သုံးမယ့် operator တွေကို သတ်မှတ်ပေးပါတယ်။ ဥပမာ — `int4` type ပေါ်က B-tree index တစ်ခုက `int4_ops` class ကို သုံးပါတယ်; ဒီ operator class ထဲမှာ `int4` type တန်ဖိုးတွေအတွက် comparison function (နှိုင်းယှဉ်ခြင်း လုပ်ဆောင်ချက်များ) တွေ ပါဝင်ပါတယ်။ လက်တွေ့မှာတော့ column ရဲ့ data type အတွက် default operator class ကပဲ ပုံမှန်အားဖြင့် လုံလောက်လေ့ ရှိပါတယ်။ Operator class တွေ ထားရှိရတဲ့ အဓိက အကြောင်းရင်းကတော့ — data type အချို့အတွက် — အဓိပ္ပာယ်ရှိတဲ့ index အပြုအမူ (index behavior) တစ်ခုထက်ပို ရှိနိုင်လို့ ဖြစ်ပါတယ်။ ဥပမာ — complex-number data type တစ်ခုကို absolute value (ပကတိ တန်ဖိုး) အလိုက် ဒါမှမဟုတ် real part (ကိန်းစစ် အစိတ်အပိုင်း) အလိုက် စီချင်တာ ဖြစ်နိုင်ပါတယ်။ အဲဒါကို — အဲဒီ data type အတွက် operator class နှစ်ခု သတ်မှတ်ပြီး index တစ်ခု ဖန်တီးတဲ့အခါ သင့်လျော်တဲ့ class ကို ရွေးချယ်ခြင်းအားဖြင့် လုပ်နိုင်ပါတယ်။ Operator class က အခြေခံ sort ordering (စီစဉ်မှု အစီအစဉ်) ကို သတ်မှတ်ပေးပါတယ် — အဲဒါကို `COLLATE`, `ASC`/`DESC` နဲ့ `NULLS FIRST`/`NULLS LAST` စတဲ့ sort options တွေ ထည့်ပေါင်းခြင်းအားဖြင့် နောက်ထပ် ပြုပြင်လို့လည်း ရပါတယ်။

ပုံမှန် operator class တွေအပြင် — built-in operator class အချို့လည်း ရှိပါသေးတယ်:

- text_pattern_ops, varchar_pattern_ops နဲ့ bpchar_pattern_ops operator class တွေက text, varchar နဲ့ char type တွေပေါ်က B-tree index တွေကို အသီးသီး ထောက်ပံ့ပါတယ်။ Default operator class တွေနဲ့ ကွာခြားတဲ့ အချက်ကတော့ — တန်ဖိုးတွေကို locale အလိုက် သတ်မှတ်ထားတဲ့ collation စည်းမျဉ်း (စာလုံးများ စီစဉ်/နှိုင်းယှဉ်သည့် စည်းမျဉ်း) တွေအရ မဟုတ်ဘဲ — character တစ်လုံးချင်းစီ (character by character) တင်းတင်းကျပ်ကျပ် နှိုင်းယှဉ်တာ ဖြစ်ပါတယ်။ ဒါကြောင့် — database က စံ “C” locale ကို မသုံးတဲ့အခါ — pattern matching expression (LIKE ဒါမှမဟုတ် POSIX regular expression) တွေ ပါဝင်တဲ့ query တွေအတွက် ဒီ operator class တွေက သင့်လျော်ပါတယ်။ ဥပမာအနေနဲ့ — varchar column တစ်ခုကို ဒီလို index လုပ်နိုင်ပါတယ်:
  
  CREATE INDEX test_index ON test_table (col varchar_pattern_ops);
  
  သတိပြုရမှာက — သာမန် <, <=, > ဒါမှမဟုတ် >= comparison တွေ ပါဝင်တဲ့ query တွေကို index သုံးစေချင်ရင် — default operator class နဲ့ index တစ်ခုကိုပါ ဖန်တီးထားသင့်ပါတယ်။ ဒီလို query တွေက xxx_pattern_ops operator class တွေကို မသုံးနိုင်လို့ ဖြစ်ပါတယ်။ (ဒါပေမယ့် — သာမန် equality comparison (ညီမျှမှု နှိုင်းယှဉ်မှု) တွေကတော့ ဒီ operator class တွေကို သုံးနိုင်ပါတယ်။) Column တစ်ခုတည်းပေါ်မှာ operator class အမျိုးမျိုးနဲ့ index အများအပြား ဖန်တီးထားဖို့လည်း ဖြစ်နိုင်ပါတယ်။ C locale ကို သုံးနေတယ်ဆိုရင်တော့ xxx_pattern_ops operator class တွေ မလိုအပ်ပါဘူး — အကြောင်းကတော့ C locale မှာ default operator class ပါတဲ့ index တစ်ခုက pattern-matching query တွေအတွက် အသုံးပြုလို့ ရလို့ပါ။

အောက်ပါ query က သတ်မှတ်ထားတဲ့ operator class တွေ အားလုံးကို ပြသပါတယ်:

```sql
SELECT am.amname AS index_method,
       opc.opcname AS opclass_name,
       opc.opcintype::regtype AS indexed_type,
       opc.opcdefault AS is_default
    FROM pg_am am, pg_opclass opc
    WHERE opc.opcmethod = am.oid
    ORDER BY index_method, opclass_name;
```

Operator class တစ်ခုဆိုတာ တကယ်တော့ *operator family* (operator မိသားစု) လို့ ခေါ်တဲ့ ပိုကြီးတဲ့ တည်ဆောက်ပုံတစ်ခုရဲ့ အစိတ်အပိုင်း (subset) တစ်ခုမျှသာ ဖြစ်ပါတယ်။ Data type အများအပြားမှာ ဆင်တူတဲ့ အပြုအမူတွေ ရှိတတ်တဲ့ အခြေအနေမျိုးမှာ — cross-data-type operator (data type အမျိုးမျိုးကြား ဖြတ်၍ လုပ်ဆောင်သော operator) တွေကို သတ်မှတ်ပြီး အဲဒါတွေကို index တွေနဲ့ တွဲဖက် အလုပ်လုပ်စေတာက မကြာခဏ အသုံးဝင်ပါတယ်။ အဲဒီလို လုပ်ဖို့အတွက် — type တစ်ခုချင်းစီရဲ့ operator class တွေကို operator family တစ်ခုတည်းထဲမှာ စုစည်းထားရပါတယ်။ Cross-type operator တွေက family ရဲ့ အဖွဲ့ဝင်တွေ ဖြစ်ပေမယ့် — family ထဲက class တစ်ခုချင်းစီနဲ့တော့ ဆက်စပ်မှု မရှိပါဘူး။

အထက်က query ရဲ့ ချဲ့ထွင်ထားတဲ့ ဒီဗားရှင်းက operator class တစ်ခုချင်းစီ ပါဝင်နေတဲ့ operator family ကို ပြသပါတယ်:

```sql
SELECT am.amname AS index_method,
       opc.opcname AS opclass_name,
       opf.opfname AS opfamily_name,
       opc.opcintype::regtype AS indexed_type,
       opc.opcdefault AS is_default
    FROM pg_am am, pg_opclass opc, pg_opfamily opf
    WHERE opc.opcmethod = am.oid AND
          opc.opcfamily = opf.oid
    ORDER BY index_method, opclass_name;
```

ဒီ query က သတ်မှတ်ထားတဲ့ operator family တွေ အားလုံးနဲ့ — family တစ်ခုချင်းစီထဲ ပါဝင်တဲ့ operator တွေ အားလုံးကို ပြသပါတယ်:

```sql
SELECT am.amname AS index_method,
       opf.opfname AS opfamily_name,
       amop.amopopr::regoperator AS opfamily_operator
    FROM pg_am am, pg_opfamily opf, pg_amop amop
    WHERE opf.opfmethod = am.oid AND
          amop.amopfamily = opf.oid
    ORDER BY index_method, opfamily_name, opfamily_operator;
```

> **အကြံပြုချက်:** [psql](https://www.postgresql.org/docs/current/app-psql.html) မှာ `\dAc`, `\dAf` နဲ့ `\dAo` commands တွေ ပါဝင်ပြီး — ဒါတွေက ဒီ query တွေရဲ့ နည်းနည်း ပိုပြီး အဆင့်မြင့်တဲ့ (slightly more sophisticated) ဗားရှင်းတွေကို ပေးစွမ်းပါတယ်။
