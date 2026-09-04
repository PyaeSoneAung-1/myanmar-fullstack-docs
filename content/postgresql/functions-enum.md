---
title: "Enum Support Functions (enum အတွက် ထောက်ပံ့ပေးသော functions များ)"
description: "Enum types အတွက် ထောက်ပံ့ပေးသော functions များ — enum_first, enum_last, enum_range တို့၏ ဖော်ပြချက်နှင့် ဥပမာများ"
order: 77
source: "https://www.postgresql.org/docs/current/functions-enum.html"
status: translated
updated: 2026-09-04
---

## 9.10. Enum Support Functions (enum အတွက် ထောက်ပံ့ပေးသော functions များ)

Enum types တွေကို [အပိုင်း 8.7](/docs/postgresql/datatype-enum) မှာ ဖော်ပြထားပါတယ်။ အဲဒီ enum types တွေအတွက် — enum type တစ်ခုရဲ့ တန်ဖိုး အတိအကျတွေကို hard-coding (တိုက်ရိုက် ရေးသွင်းခြင်း) မလုပ်ဘဲ ပိုမို သပ်ရပ်တဲ့ programming လုပ်နိုင်စေမယ့် functions တွေ အများအပြား ရှိပါတယ်။ အဲဒီ functions တွေကို ဇယား 9.35 မှာ စာရင်းပြထားပါတယ်။ ဥပမာတွေက အောက်ပါအတိုင်း ဖန်တီးထားတဲ့ enum type တစ်ခုကို ယူဆထားပါတယ်:

```sql
CREATE TYPE rainbow AS ENUM ('red', 'orange', 'yellow', 'green', 'blue', 'purple');
```

**ဇယား 9.35. Enum Support Functions (enum အတွက် ထောက်ပံ့ပေးသော functions များ)**

| Function ဖော်ပြချက် ဥပမာ(များ) |
| --- |
| enum_first ( anyenum ) → anyenum input enum type ရဲ့ ပထမဆုံး တန်ဖိုးကို ပြန်ပေးပါတယ်။ enum_first(null::rainbow) → red |
| enum_last ( anyenum ) → anyenum input enum type ရဲ့ နောက်ဆုံး တန်ဖိုးကို ပြန်ပေးပါတယ်။ enum_last(null::rainbow) → purple |
| enum_range ( anyenum ) → anyarray input enum type ရဲ့ တန်ဖိုး အားလုံးကို စီစဉ်ထားတဲ့ (ordered) array တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ enum_range(null::rainbow) → {red,orange,yellow,green,blue,purple} |
| enum_range ( anyenum, anyenum ) → anyarray ပေးထားတဲ့ enum တန်ဖိုး နှစ်ခုကြားက range (အကွာအဝေး) ကို စီစဉ်ထားတဲ့ array တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ တန်ဖိုး နှစ်ခုလုံးက enum type တစ်ခုတည်းက ဖြစ်ရပါမယ်။ ပထမ parameter က null ဖြစ်နေရင် — ရလဒ်က enum type ရဲ့ ပထမဆုံး တန်ဖိုးကနေ စတင်ပါလိမ့်မယ်။ ဒုတိယ parameter က null ဖြစ်နေရင်တော့ — ရလဒ်က enum type ရဲ့ နောက်ဆုံး တန်ဖိုးမှာ အဆုံးသတ်ပါလိမ့်မယ်။ enum_range('orange'::rainbow, 'green'::rainbow) → {orange,yellow,green} enum_range(NULL, 'green'::rainbow) → {red,orange,yellow,green} enum_range('orange'::rainbow, NULL) → {orange,yellow,green,blue,purple} |

Argument နှစ်ခု ပါတဲ့ `enum_range` ပုံစံ ကလွဲလို့ — ဒီ functions တွေက သူတို့ဆီ ပို့လိုက်တဲ့ တန်ဖိုး အတိအကျကို ထည့်တွက်ခြင်း မရှိဘဲ — အဲဒီတန်ဖိုးရဲ့ ကြေညာထားတဲ့ (declared) data type ကိုပဲ သက်ဆိုင်တယ်ဆိုတာ သတိပြုပါ။ Type ရဲ့ null ဖြစ်စေ၊ type ရဲ့ တန်ဖိုး အတိအကျ ဖြစ်စေ — ဘယ်ဟာကို ပို့လိုက်လိုက် ရလဒ် အတူတူပဲ ဖြစ်ပါတယ်။ ဒီ functions တွေကို — ဥပမာတွေထဲမှာ သုံးထားသလို type name တစ်ခုကို တိုက်ရိုက် ရေးသွင်းပြီး သုံးတာထက် — table column တစ်ခု သို့မဟုတ် function argument တစ်ခုအပေါ်မှာ အသုံးချတာက ပိုပြီး အဖြစ်များပါတယ်။
