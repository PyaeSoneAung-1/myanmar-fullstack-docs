---
title: "Preferred Index Types for Text Search (text search အတွက် ဦးစားပေး index type များ)"
description: "Full text search ကို မြန်ဆန်စေရန် သုံးသော index type များ — GIN နှင့် GiST နှစ်မျိုး၏ သဘောတရား၊ lossy signature နှင့် siglen parameter၊ covering index (INCLUDE)၊ maintenance_work_mem နှင့် partitioning အကြောင်း"
order: 94
source: "https://www.postgresql.org/docs/current/textsearch-indexes.html"
status: translated
updated: 2026-09-03
---

## 12.9. Preferred Index Types for Text Search (text search အတွက် ဦးစားပေး index type များ)

Full text search (စာသား အပြည့်အစုံ ရှာဖွေမှု) တွေကို မြန်ဆန်အောင် လုပ်ပေးနိုင်တဲ့ index အမျိုးအစား နှစ်မျိုး ရှိပါတယ် — [GIN](https://www.postgresql.org/docs/current/gin.html) နဲ့ [GiST](https://www.postgresql.org/docs/current/gist.html) တို့ ဖြစ်ပါတယ်။ Full text search အတွက် index တွေက မဖြစ်မနေ လိုအပ်တာတော့ မဟုတ်ဘူးဆိုတာ သတိပြုပါ — ဒါပေမယ့် column တစ်ခုကို ပုံမှန် ရှာဖွေလေ့ ရှိတဲ့ အခြေအနေမျိုးမှာတော့ index တစ်ခု ရှိထားတာ ပုံမှန်အားဖြင့် လိုလားဖွယ် ကောင်းပါတယ်။

ဒီလို index တစ်ခု ဖန်တီးဖို့ဆိုရင် — အောက်ပါတို့ထဲက တစ်ခုကို လုပ်ပါ:

- **CREATE INDEX name ON table USING GIN (column);** — GIN (Generalized Inverted Index) အခြေခံတဲ့ index တစ်ခုကို ဖန်တီးပါတယ်။ Column က tsvector type ဖြစ်ရပါမယ်။
- **CREATE INDEX name ON table USING GIST (column [ { DEFAULT | tsvector_ops } (siglen = number) ] );** — GiST (Generalized Search Tree) အခြေခံတဲ့ index တစ်ခုကို ဖန်တီးပါတယ်။ Column က tsvector ဒါမှမဟုတ် tsquery type ဖြစ်နိုင်ပါတယ်။ Optional (ချန်လည်း ထားလို့ရတဲ့) integer parameter ဖြစ်တဲ့ siglen က signature ရဲ့ အလျားကို bytes နဲ့ သတ်မှတ်ပေးပါတယ် (အသေးစိတ်အတွက် အောက်မှာ ကြည့်ပါ)။

GIN index တွေက text search အတွက် ဦးစားပေး index type ဖြစ်ပါတယ်။ Inverted index (ပြောင်းပြန် index) တွေအနေနဲ့ — ၎င်းတို့ထဲမှာ စကားလုံး (lexeme) တစ်လုံးချင်းစီအတွက် index entry တစ်ခုစီ ပါဝင်ပြီး — ကိုက်ညီတဲ့ နေရာများရဲ့ compressed (ချုံ့ထားသော) စာရင်းနဲ့အတူ သိမ်းဆည်းထားပါတယ်။ Multi-word (စကားလုံးများစွာ) ရှာဖွေမှုတွေက ပထမဆုံး ကိုက်ညီမှုကို ရှာတွေ့ပြီး — ကျန်တဲ့ စကားလုံးတွေ မပါဝင်တဲ့ row တွေကို ဖယ်ရှားဖို့ index ကို သုံးနိုင်ပါတယ်။ GIN index တွေက `tsvector` value တွေရဲ့ စကားလုံး (lexeme) တွေကိုပဲ သိမ်းဆည်းပြီး — သူတို့ရဲ့ weight label (အလေးချိန် အမှတ်အသား) တွေကိုတော့ မသိမ်းဆည်းပါဘူး။ ဒါကြောင့် weights တွေ ပါဝင်တဲ့ query တစ်ခုကို သုံးတဲ့အခါ — table row ကို ပြန်လည် စစ်ဆေး (recheck) လုပ်ဖို့ လိုအပ်ပါတယ်။

GiST index က *lossy* (ဆုံးရှုံးမှု သဘောရှိသော) ဖြစ်ပါတယ် — ဆိုလိုတာက index က false match (မှားယွင်းသော ကိုက်ညီမှု) တွေ ထုတ်ပေးနိုင်ပြီး — အဲဒီလို false match တွေကို ဖယ်ရှားဖို့ တကယ့် table row ကို စစ်ဆေးဖို့ လိုအပ်ပါတယ်။ (လိုအပ်တဲ့အခါ PostgreSQL က ဒါကို အလိုအလျောက် လုပ်ပေးပါတယ်။) GiST index တွေ lossy ဖြစ်ရတာက — document တစ်ခုချင်းစီကို index ထဲမှာ fixed-length signature (အလျား သတ်မှတ်ထားသော signature) တစ်ခုအနေနဲ့ ကိုယ်စားပြုလို့ပါ။ Signature ရဲ့ bytes အလျားကို optional integer parameter `siglen` ရဲ့ တန်ဖိုးက သတ်မှတ်ပါတယ်။ Default signature အလျားက (`siglen` ကို သတ်မှတ်မထားတဲ့အခါ) 124 bytes ဖြစ်ပြီး — signature အလျား အများဆုံးကတော့ 2024 bytes ဖြစ်ပါတယ်။ Signature ကို — စကားလုံး တစ်လုံးချင်းစီကို n-bit string ထဲက bit တစ်နေရာစီအဖြစ် hash (တွက်ချက် ပြောင်းလဲ) လုပ်ပြီး — အဲဒီ bits အားလုံးကို OR နဲ့ ပေါင်းစပ်ကာ — n-bit document signature တစ်ခု ထုတ်လုပ်ခြင်းဖြင့် ဖြစ်ပေါ်ပါတယ်။ စကားလုံး နှစ်လုံးက bit နေရာ တစ်ခုတည်းကို hash လုပ်မိတဲ့အခါ — false match ဖြစ်ပါတယ်။ Query ထဲက စကားလုံးတွေ အားလုံးမှာ (အစစ်အမှန် ဖြစ်စေ၊ မှားယွင်း၍ ဖြစ်စေ) ကိုက်ညီမှု ရှိနေရင် — ကိုက်ညီမှုက မှန်ကန်လားဆိုတာ သိရှိဖို့ table row ကို ပြန်လည် ရယူ စစ်ဆေးရပါတယ်။ Signature ပိုရှည်လေလေ — ရှာဖွေမှု ပိုတိကျလေလေ ဖြစ်ပြီး (index ရဲ့ သေးငယ်တဲ့ အပိုင်းကိုပဲ scan လုပ်ရပြီး — heap page တွေလည်း နည်းပါတယ်) — index ပိုကြီးလာတဲ့ ကုန်ကျစရိတ်နဲ့အတူ ပါ။

GiST index တစ်ခုက covering (လွှမ်းခြုံ) လည်း ဖြစ်နိုင်ပါတယ် — ဆိုလိုတာက `INCLUDE` clause ကို သုံးတာပါ။ Included column တွေမှာ GiST operator class မရှိတဲ့ data type တွေ ရှိနိုင်ပါတယ်။ Included attribute တွေကို compressed (ချုံ့) မလုပ်ဘဲ သိမ်းဆည်းပါလိမ့်မယ်။

Lossiness (ဆုံးရှုံးမှု သဘောသဘာဝ) က false match တွေ ဖြစ်သွားတဲ့ table record တွေကို မလိုအပ်ဘဲ ယူဆောင်ရတာကြောင့် performance (စွမ်းဆောင်ရည်) ကျဆင်းစေပါတယ်။ Table record တွေကို random access (ကျပန်း ဝင်ရောက်မှု) လုပ်တာက နှေးကွေးတာကြောင့် — ဒါက GiST index တွေရဲ့ အသုံးဝင်မှုကို ကန့်သတ်ပါတယ်။ False match ဖြစ်နိုင်ခြေက အချက်များစွာပေါ် မူတည်ပါတယ် — အထူးသဖြင့် ထူးခြားတဲ့ (unique) စကားလုံး အရေအတွက်ပေါ်ပါ — ဒါကြောင့် ဒီအရေအတွက်ကို လျှော့ချဖို့ dictionaries တွေ သုံးဖို့ အကြံပြုလိုပါတယ်။

GIN index ရဲ့ build (တည်ဆောက်မှု) အချိန်ကို [maintenance_work_mem](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAINTENANCE-WORK-MEM) ကို တိုးမြှင့်ခြင်းဖြင့် မကြာခဏ တိုးတက်အောင် လုပ်နိုင်ပေမယ့် — GiST index ရဲ့ build time ကတော့ အဲဒီ parameter ရဲ့ သက်ရောက်မှုကို မခံစားရပါဘူးဆိုတာ သတိပြုပါ။

Collection အကြီးကြီးတွေကို partitioning (အပိုင်းပိုင်း ခွဲခြင်း) လုပ်ခြင်းနဲ့ GIN / GiST index တွေကို သင့်လျော်စွာ သုံးခြင်းက — online update (အွန်လိုင်း မွမ်းမံမှု) နဲ့အတူ အလွန် မြန်ဆန်တဲ့ ရှာဖွေမှုတွေကို အကောင်အထည် ဖော်နိုင်စေပါတယ်။ Partitioning ကို database အဆင့်မှာ table inheritance (အမွေဆက်ခံခြင်း) ကို သုံးပြီး လုပ်နိုင်သလို — documents တွေကို server အများအပြားပေါ် ဖြန့်ဝေပြီး — ဥပမာ [Foreign Data](/docs/postgresql/ddl-foreign-data) access ကတစ်ဆင့် — ပြင်ပ ရှာဖွေမှု ရလဒ်တွေကို စုစည်းခြင်းဖြင့်လည်း လုပ်နိုင်ပါတယ်။ ဒုတိယ နည်းလမ်းက ဖြစ်နိုင်တာက — ranking functions (အဆင့်သတ်မှတ်ရေး function များ) တွေက local (ဒေသဆိုင်ရာ) အချက်အလက်တွေကိုပဲ သုံးလို့ပါ။
