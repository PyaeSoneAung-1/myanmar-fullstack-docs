---
title: "Limitations (ကန့်သတ်ချက်များ)"
description: "PostgreSQL text search feature များ၏ လက်ရှိ ကန့်သတ်ချက်များ — lexeme/tsvector/tsquery အရွယ်အစားနှင့် အရေအတွက် ကန့်သတ်ချက်များ"
order: 127
source: "https://www.postgresql.org/docs/current/textsearch-limitations.html"
status: translated
updated: 2026-09-03
---

## 12.11. Limitations (ကန့်သတ်ချက်များ)

PostgreSQL ရဲ့ text search feature တွေမှာ လက်ရှိ ကန့်သတ်ချက်တွေကတော့:

- Lexeme တစ်ခုချင်းစီရဲ့ အလျားက 2 kilobytes ထက် နည်းရပါမယ်
- `tsvector` တစ်ခုရဲ့ အလျား (lexemes + positions) က 1 megabyte ထက် နည်းရပါမယ်
- Lexeme အရေအတွက်က 2^64 ထက် နည်းရပါမယ်
- `tsvector` ထဲက position တန်ဖိုးတွေက 0 ထက် ကြီးပြီး — 16,383 ထက် မပိုရပါဘူး
- `<N>` (FOLLOWED BY) `tsquery` operator တစ်ခုရဲ့ match distance (ကိုက်ညီမှု အကွာအဝေး) က 16,384 ထက် မပိုရပါဘူး
- Lexeme တစ်ခုစီမှာ position 256 ခုထက် ပိုလို့ မရပါဘူး
- `tsquery` တစ်ခုထဲက node (lexemes + operators) အရေအတွက်က 32,768 ထက် နည်းရပါမယ်

နှိုင်းယှဉ်ကြည့်ဖို့အတွက် — PostgreSQL 8.1 documentation မှာ ထူးခြားတဲ့ (unique) စကားလုံး 10,441 လုံး၊ စုစုပေါင်း စကားလုံး 335,420 လုံး ပါဝင်ခဲ့ပြီး — အသုံးအများဆုံး စကားလုံးဖြစ်တဲ့ “postgresql” ကို document 655 ခုထဲမှာ အကြိမ် 6,127 ခါ သုံးထားခဲ့ပါတယ်။

နောက်ထပ် ဥပမာတစ်ခုကတော့ — PostgreSQL mailing list archives မှာ message 461,020 ခုထဲမှာ ထူးခြားတဲ့ စကားလုံး 910,989 လုံးနဲ့ lexeme 57,491,343 ခု ပါဝင်ခဲ့ပါတယ်။
