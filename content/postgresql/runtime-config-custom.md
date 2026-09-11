---
title: "Customized Options (စိတ်ကြိုက် သတ်မှတ်နိုင်သော ရွေးချယ်စရာများ)"
description: "PostgreSQL ၏ customized option များ — add-on module များက ထည့်သွင်းနိုင်သည့် အပိုင်းနှစ်ပိုင်းပါ parameter နာမည်များ၊ extension နာမည်နှင့် parameter နာမည်ကို dot ဖြင့် ခွဲခြားသတ်မှတ်ပုံ၊ placeholder တန်ဖိုးများနှင့် extension module load လုပ်ချိန် ၎င်းတို့ကို ပြောင်းလဲပုံ အကြောင်း ရှင်းလင်းချက်"
order: 171
source: "https://www.postgresql.org/docs/current/runtime-config-custom.html"
status: translated
updated: 2026-09-11
---

## 19.16. Customized Options (စိတ်ကြိုက် သတ်မှတ်နိုင်သော ရွေးချယ်စရာများ)

ဒီ feature ကို — PostgreSQL ဆီမှာ ပုံမှန်အားဖြင့် မသိရှိထားတဲ့ parameter တွေကို add-on module တွေ (ဥပမာ — procedural language များ) က ထည့်သွင်းနိုင်စေဖို့ ဒီဇိုင်း ရေးဆွဲထားတာပါ။ ဒါက extension module တွေကို စံနည်းလမ်းများအတိုင်း configure လုပ်နိုင်စေပါတယ်။

Custom option တွေမှာ အပိုင်းနှစ်ပိုင်း ပါဝင်တဲ့ နာမည် ရှိပါတယ် — extension နာမည် တစ်ခု၊ ပြီးရင် dot တစ်ခု၊ ပြီးရင် parameter ရဲ့ နာမည် အစစ် ဖြစ်ပါတယ်။ ဒါက SQL ထဲက qualified name (အရည်အချင်း ပြည့်မီသော နာမည်) များနဲ့ အတော်လေး တူပါတယ်။ ဥပမာ တစ်ခုက `plpgsql.variable_conflict` ဖြစ်ပါတယ်။

Custom option တွေကို — သက်ဆိုင်ရာ extension module ကို load မလုပ်ရသေးတဲ့ process တွေမှာ သတ်မှတ်ဖို့ လိုအပ်နိုင်တာကြောင့် — PostgreSQL က အပိုင်းနှစ်ပိုင်း ပါတဲ့ parameter နာမည် မည်သည့်အတွက်မဆို setting တစ်ခုကို လက်ခံပါလိမ့်မယ်။ အဲဒီလို variable တွေကို placeholder (နေရာယူ သတ်မှတ်ချက်) အဖြစ် သတ်မှတ်ပြီး — သူတို့ကို သတ်မှတ်ပေးတဲ့ module ကို load လုပ်တဲ့အထိ မည်သည့် လုပ်ဆောင်ချက်မှ မရှိပါဘူး။ Extension module တစ်ခုကို load လုပ်တဲ့အခါ — သူက သူ့ variable definition တွေကို ထည့်သွင်းပြီး — placeholder တန်ဖိုး မည်သည့်အတွက်မဆိုကို အဲဒီ definition တွေနဲ့ အညီ ပြောင်းလဲပေးပါလိမ့်မယ်။ သူ့ extension နာမည်နဲ့ စတင်တဲ့ မမှတ်မိတဲ့ (unrecognized) placeholder တွေ ရှိနေရင် — warning တွေ ထုတ်ပြီး အဲဒီ placeholder တွေကို ဖယ်ရှားပါလိမ့်မယ်။
