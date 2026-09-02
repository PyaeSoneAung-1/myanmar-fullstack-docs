---
title: "ABI တည်ငြိမ်မှု (ABI Stability)"
description: "ABI (Application Binary Interface) ဆိုတာ ဘာလဲ — Node.js မှာ ABI stability နဲ့ semantic versioning, N-API ရဲ့ Node.js major versions ဖြတ်ကျော် forward-compatibility guarantee"
order: 59
source: "https://nodejs.org/learn/modules/abi-stability"
status: translated
updated: 2026-09-02
---

## ABI ဆိုတာ ဘာလဲ

**ABI** (Application Binary Interface — အပလီကေးရှင်း နှစ်ခုကြားက binary အဆင့် ဆက်သွယ်ရေး စံသတ်မှတ်ချက်) ဆိုတာ — program တစ်ခုက တခြား compiled program တွေရဲ့ function တွေကို ခေါ်ပြီး data structures တွေကို သုံးနိုင်အောင် သတ်မှတ်ပေးတဲ့ နည်းလမ်းပါ။ ၎င်းက **API** (Application Programming Interface) ရဲ့ compiled ပုံစံ ဖြစ်ပါတယ်။ တစ်နည်းပြောရရင် — application တစ်ခု လိုချင်တဲ့ အလုပ်ကို လုပ်နိုင်အောင် ဖော်ပြထားတဲ့ classes, functions, data structures, enumerations, constants တွေ ပါတဲ့ header files တွေဟာ — compile လုပ်တဲ့အခါမှာ ABI ကို ထောက်ပံ့ပေးတဲ့သူ (provider) က compile လုပ်ထားတဲ့ addresses, expected parameter values, memory structure sizes နဲ့ layouts အစုတစ်ခုနဲ့ ကိုက်ညီသွားပါတယ်။

ABI ကို သုံးတဲ့ application ကလည်း — ရနိုင်တဲ့ addresses တွေ၊ မျှော်လင့်ထားတဲ့ parameter values တွေ၊ memory structure sizes နဲ့ layouts တွေ ABI provider နဲ့ ကိုက်ညီအောင် compile လုပ်ထားရပါတယ်။ ပုံမှန်အားဖြင့် ဒါကို ABI provider က ထောက်ပံ့ပေးထားတဲ့ headers တွေနဲ့ တွဲပြီး compile လုပ်ခြင်းအားဖြင့် ရရှိပါတယ်။

ABI provider ရော user ရော — မတူညီတဲ့ အချိန်၊ မတူညီတဲ့ compiler version တွေနဲ့ compile လုပ်ခံရနိုင်လို့ — ABI compatibility သေချာစေဖို့ တာဝန် တစိတ်တပိုင်းက compiler အပေါ်မှာ ကျရောက်ပါတယ်။ Vendor အမျိုးမျိုးရဲ့ compiler version အမျိုးမျိုးက — ပေးထားတဲ့ header file တစ်ခုကနေ ABI တူတူပဲ ထုတ်ပေးရမယ်၊ ပြီးတော့ ABI ရဲ့ စည်းမျဉ်းတွေအတိုင်း API ကို ဝင်ရောက်သုံးတဲ့ code ကို ထုတ်ပေးရပါတယ်။ ခေတ်သစ် compiler တွေက သူတို့ compile လုပ်တဲ့ application တွေရဲ့ ABI compatibility ကို မချိုးဖျက်တဲ့ကိစ္စမှာ အတော်လေး ကောင်းမွန်တဲ့ စံချိန် ရှိပါတယ်။

ကျန်တဲ့ တာဝန်ကတော့ — compile လုပ်လိုက်တဲ့အခါ တည်ငြိမ်နေရမယ့် ABI ကို ဖြစ်ပေါ်စေတဲ့ API ကို ထောက်ပံ့ပေးနေတဲ့ header files တွေကို ထိန်းသိမ်းတဲ့ team အပေါ်မှာ ကျရောက်ပါတယ်။ Header files တွေကို ပြောင်းလဲလို့ ရပေမယ့် — ပြောင်းလဲမှုရဲ့ သဘောသဘာဝကို အနီးကပ် ခြေရာခံထားရပါတယ်။ ဘာကြောင့်လဲဆိုရင် — compile ပြီးတဲ့ ABI က ရှိပြီးသား ABI user တွေ version အသစ်နဲ့ မကိုက်ညီဖြစ်သွားမယ့် ပုံစံမျိုး ပြောင်းမသွားဖို့ပါ။

## Node.js မှာ ABI Stability

Node.js က လွတ်လပ်တဲ့ team အများအပြား ထိန်းသိမ်းတဲ့ header files တွေကို ထောက်ပံ့ပေးပါတယ်။ ဥပမာ — `node.h` နဲ့ `node_buffer.h` လိုမျိုး headers တွေကို Node.js team က ထိန်းသိမ်းပြီး — `v8.h` ကိုတော့ V8 team က ထိန်းသိမ်းပါတယ်။ V8 team က Node.js team နဲ့ နီးကပ်စွာ ပူးပေါင်းပေမယ့် သီးခြား အဖွဲ့အစည်း ဖြစ်ပြီး — ကိုယ်ပိုင် schedule နဲ့ priorities တွေ ရှိပါတယ်။ ဒါကြောင့် Node.js team က project ထောက်ပံ့ပေးတဲ့ headers တွေထဲ ထည့်သွင်းလာတဲ့ ပြောင်းလဲမှုတွေကို တစိတ်တပိုင်းပဲ ထိန်းချုပ်နိုင်ပါတယ်။ ရလဒ်အနေနဲ့ — Node.js project က **semantic versioning** ကို ကျင့်သုံးခဲ့ပါတယ်။

ဒါက — project က ထောက်ပံ့ပေးတဲ့ APIs တွေဟာ major version တစ်ခုအတွင်းက Node.js version တွေ (minor နဲ့ patch versions အားလုံး) အတွက် **stable ABI** ဖြစ်စေပါတယ်။ လက်တွေ့မှာ ဆိုလိုတာက — Node.js project က **major version တစ်ခုနဲ့ compile လုပ်ထားတဲ့ native addon တစ်ခုဟာ အဲဒီ major version အတွင်းက ဘယ် Node.js minor/patch version နဲ့မဆို load လုပ်ရင် အောင်မြင်စွာ load ဖြစ်မယ်** ဆိုတာကို အာမခံထားပါတယ်။

## N-API

Node.js major versions အများအပြားကို ဖြတ်ကျော်ပြီး stable ဖြစ်နေတဲ့ ABI ကို ရလာမယ့် API တစ်ခု Node.js မှာ ထည့်ပေးဖို့ လိုအပ်ချက် ပေါ်ပေါက်လာခဲ့ပါတယ်။ အဲဒီလို API တစ်ခု ဖန်တီးရတဲ့ ရည်ရွယ်ချက်တွေက အောက်ပါအတိုင်းပါ:

- **JavaScript ဘာသာစကား** က သူ့ရဲ့ အစောပိုင်းကာလကတည်းက သူ့ဘာသာသူ compatible ဖြစ်နေခဲ့ပေမယ့် — JavaScript code တွေကို run ပေးတဲ့ engine ရဲ့ ABI ကတော့ Node.js major version တိုင်းနဲ့ ပြောင်းလဲပါတယ်။ ဆိုလိုတာက — JavaScript နဲ့ သက်သက် ရေးထားတဲ့ package တွေ ပါတဲ့ application တွေက production environment ထဲ Node.js major version အသစ် ထည့်လိုက်ရင် — recompile, reinstall, redeploy လုပ်စရာ မလိုပါဘူး။ ဒါပေမယ့် application က native addon ပါတဲ့ package တစ်ခုကို မှီခိုနေရရင်တော့ — Node.js major version အသစ် ထည့်တိုင်း recompile, reinstall, redeploy လုပ်ရပါတယ်။ Native addons ပါတဲ့ package တွေနဲ့ JavaScript သက်သက် ရေးထားတဲ့ package တွေကြားက ဒီကွာဟချက်က — native addons အပေါ် မှီခိုနေတဲ့ production system တွေရဲ့ maintenance burden ကို ပိုတိုးစေပါတယ်။
- တခြား project တွေက — Node.js ရဲ့ JavaScript interfaces တွေကို အခြေခံအားဖြင့် ပြန်လည် အကောင်အထည်ဖော်တဲ့ (alternative implementations) JavaScript interfaces တွေကို စတင် ထုတ်လုပ်လာပါတယ်။ ဒီ project တွေက V8 မဟုတ်တဲ့ JavaScript engine တွေပေါ်မှာ ဆောက်ထားလေ့ ရှိတာမို့ — သူတို့ရဲ့ native addons တွေက မတူတဲ့ structure နဲ့ API ကို သုံးစွဲရပါတယ်။ ဒါပေမယ့် Node.js JavaScript API ရဲ့ အကောင်အထည်ဖော်မှု အမျိုးမျိုးကြားမှာ native addon အတွက် API တစ်ခုတည်း သုံးနိုင်ရင် — ဒီ project တွေက Node.js တဝိုက်မှာ စုစည်းထားတဲ့ JavaScript package ecosystem ရဲ့ အကျိုးကို ခံစားနိုင်မှာ ဖြစ်ပါတယ်။
- Node.js က အနာဂတ်မှာ JavaScript engine တစ်မျိုး ထည့်သွင်းသုံးစွဲလာနိုင်ပါတယ်။ ဒါဆိုရင် — အပြင်ပန်းအားဖြင့် Node.js interfaces အားလုံး အတူတူပဲ ဖြစ်နေပေမယ့် V8 header file ကတော့ ပျောက်ကွယ်သွားနိုင်ပါတယ်။ ဒီလို ခြေလှမ်းက — JavaScript engine ပေါ် မမှီခိုတဲ့ (engine-agnostic) API တစ်ခုကို Node.js က အရင်မပေးဘဲ native addons တွေက မလက်ခံနိုင်ဘူးဆိုရင် — Node.js ecosystem တစ်ခုလုံး၊ အထူးသဖြင့် native addons တွေရဲ့ လုပ်ငန်းစဉ်တွေကို အနှောင့်အယှက် ဖြစ်စေမှာပါ။

ဒီရည်ရွယ်ချက်တွေအတွက် — Node.js က **N-API** ကို version 8.6.0 မှာ စတင် မိတ်ဆက်ပြီး Node.js 8.12.0 ကစပြီး project ရဲ့ stable component အဖြစ် သတ်မှတ်ခဲ့ပါတယ်။ N-API ကို `node_api.h` နဲ့ `node_api_types.h` headers တွေမှာ သတ်မှတ်ထားပြီး — **Node.js major version နယ်နိမိတ်ကို ဖြတ်ကျော်တဲ့ forward-compatibility guarantee** တစ်ခု ပေးပါတယ်။ ဒီ guarantee ကို ဒီလို ဖော်ပြလို့ ရပါတယ်:

> N-API version *n* တစ်ခုက — အဲဒီ version ကို စတင် ထုတ်ဝေခဲ့တဲ့ Node.js major version မှာရော၊ နောက်ပိုင်း Node.js version တွေ အားလုံးမှာပါ (နောက်ပိုင်း major versions တွေ အပါအဝင်) ရနိုင်မှာ ဖြစ်ပါတယ်။

Native addon author တစ်ယောက်က — addon ထဲမှာ `node_api.h` မှာ သတ်မှတ်ထားတဲ့ APIs တွေနဲ့ `node_api_types.h` မှာ သတ်မှတ်ထားတဲ့ data structures နဲ့ constants တွေကိုပဲ သုံးထားအောင် သေချာစေခြင်းအားဖြင့် — N-API ရဲ့ forward-compatibility guarantee ကို အသုံးချနိုင်ပါတယ်။ ဒီလိုလုပ်ခြင်းက — production user တွေကို သူတို့ရဲ့ project ထဲကို ဒီ native addon ထည့်လိုက်တာဟာ pure JavaScript package တစ်ခု ထည့်လိုက်တာထက် maintenance burden ပိုမတိုးစေဘူးဆိုတာ ပြသပြီး — addon ကို လက်ခံကျင့်သုံးမှု (adoption) ကို အထောက်အကူ ပြုပါတယ်။

N-API ကို versioning လုပ်ထားတာက — API အသစ်တွေ ရံဖန်ရံခါ ထပ်ထည့်လို့ပါ။ Semantic versioning နဲ့ မတူတာက — **N-API versioning က cumulative (စုပုံတဲ့ သဘော) ဖြစ်ပါတယ်**။ ဆိုလိုတာက — N-API version တိုင်းက semver စနစ်ရဲ့ minor version တစ်ခုလို အဓိပ္ပာယ် ဆောင်ပြီး — N-API အတွက် ပြုလုပ်တဲ့ ပြောင်းလဲမှုအားလုံးဟာ backwards compatible ဖြစ်ပါတယ်။ ဒါ့အပြင် — N-API အသစ်တွေကို community က production environment မှာ စမ်းသပ်ခွင့် ရစေဖို့ experimental flag အောက်မှာ ထည့်သွင်းပါတယ်။ Experimental status ဆိုတာ — ဒီ API အသစ်ကို အနာဂတ်မှာ ABI-incompatible ပုံစံနဲ့ ပြင်ရမှာ မဟုတ်အောင် ဂရုစိုက်ထားပေမယ့် — production မှာ ဒီဇိုင်းထုတ်ထားတဲ့အတိုင်း မှန်ကန်ပြီး အသုံးဝင်ကြောင်း လုံလောက်အောင် သက်သေမပြနိုင်သေးလို့ — လာမယ့် N-API version ထဲ အပြီးသတ် မထည့်ခင် ABI-incompatible ပြောင်းလဲမှုတွေ ဖြစ်နိုင်ပါသေးတယ်။ တစ်နည်းအားဖြင့် — experimental N-API တစ်ခုက forward-compatibility guarantee ရဲ့ အကျုံးဝင်မှု မရသေးပါဘူး။
