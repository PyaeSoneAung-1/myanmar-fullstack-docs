---
title: "Postman Collections Schemas များ"
description: "Postman Collections တွေရဲ့ အခြေခံဖြစ်တဲ့ open source collection format အကြောင်း — schema 3.0.0 ရဲ့ file နဲ့ directory structure, naming နဲ့ path rules, ordering နဲ့ extensibility"
order: 140
source: "https://learning.postman.com/docs/use/use-collections/collections-schemas/"
status: translated
updated: 2026-09-03
---

Postman Collections တွေက open source ဖြစ်တဲ့ *collection format* ကို အခြေခံထားပါတယ်။ အဲဒီ format က API requests တွေကို စုစည်းပြီး API workflows တွေကို ပုံစံထုတ်ဖို့အတွက် ဖွဲ့စည်းပုံတစ်ခုကို သတ်မှတ်ပေးပါတယ်။ ဒီ format က portable ဖြစ်ပြီး — machine တွေရော လူတွေပါ ဖတ်လို့ရတဲ့အတွက်၊ client နဲ့ server SDKs, documentation နဲ့ mock servers တွေ ထုတ်လုပ်ဖို့ သုံးနိုင်ပါတယ်။ Postman ရဲ့ လက်ရှိ version က schema 3.0.0 ကို သုံးပါတယ်။ အရင်က Postman schemas တွေကိုတော့ [Postman Schemas site](https://schema.postman.com/) မှာ ကြည့်နိုင်ပါတယ်။

Collections schema 3.0.0 က collection တစ်ခုကို — disk ပေါ်မှာ စုစည်းထားတဲ့ YAML files အများအပြားနဲ့ သတ်မှတ်ပါတယ်။ ဒါကြောင့် လူတွေ၊ AI agents တွေနဲ့ automation tools တွေက source code တစ်ခုကို ကိုင်တွယ်သလိုပဲ — collections တွေကို ဖတ်နိုင်၊ diff လုပ်နိုင်၊ ပြန်လည်သုံးသပ်နိုင်ပြီး ဘေးကင်းစွာ ပြောင်းလဲနိုင်ပါတယ်။

## File နဲ့ directory structure

ဘယ် folder မဆို collection root အဖြစ် လုပ်ဆောင်နိုင်ပြီး — requests တွေကို `*.request.yaml` files တွေအနေနဲ့ သိမ်းပြီး၊ အထောက်အကူပြု assets တွေက reserved `.resources/` directories တွေထဲမှာ ရှိပါတယ်။ Request တစ်ခုစီမှာ — သူ့ရဲ့ examples နဲ့ scripts subdirectories တွေ ပါဝင်တဲ့ `<request-name>.resources` directory တစ်ခု ဘေးချင်းကပ်လျက် ရှိပြီး၊ collection နဲ့ folder အဆင့် metadata တွေက optional ဖြစ်တဲ့ `definition.yaml` files တွေထဲမှာ သိမ်းပါတယ်။

## Naming နဲ့ path rules

Collections schema version 3.0.0 က filename-safe ဖြစ်တဲ့ naming rules တွေကို — normalization အတွက် လမ်းညွှန်ချက်တွေ၊ case-insensitive uniqueness နဲ့ forward-slash paths တွေ မဖြစ်မနေ သုံးရမယ့် စည်းမျဉ်းတွေနဲ့အတူ ကျင့်သုံးပါတယ်။ `.yml` extension ကို parser alias အနေနဲ့ လက်ခံပေမယ့် — authoring output အတွက်တော့ `.yaml` ကို လိုအပ်ပြီး၊ explicit ဖြစ်တဲ့ path-resolution rules တွေက request resources တွေကို သူတို့ရဲ့ canonical directory ထဲမှာပဲ ရှိနေအောင် ထိန်းထားပါတယ်။

Postman v12 မှာ — Newman က 2.1.0 format နဲ့ export လုပ်ထားတဲ့ Postman Collection တစ်ခုကို run နိုင်ပေမယ့် 3.0 collections တွေကိုတော့ run လို့ မရပါဘူး။ 3.0 collections တွေကို run ဖို့ဆိုရင် — Newman အစား Postman CLI ကို သုံးပါ။ အသေးစိတ်အတွက် — [Native Git နဲ့ locally မှာ develop လုပ်ခြင်း](https://learning.postman.com/docs/use/native-git/develop-locally/) ကို ကြည့်ပါ။

## Ordering နဲ့ extensibility

Ordering နဲ့ sorting တွေကို numeric fractional indexes တွေနဲ့ ကိုင်တွယ်ပြီး — folders, requests နဲ့ examples တွေကို စဉ်ပေးပါတယ်။ Examples နဲ့ scripts တွေက ကနဦး normative resource types တွေ ဖြစ်ပေမယ့် — ရှိပြီးသား naming rules တွေကို မချိုးဖျက်ဘဲ `<request-name>.resources` အောက်မှာ resource directories အသစ်တွေ ထပ်ထည့်လို့ရပါတယ်။ Explicit type field တစ်ခုပါတဲ့ shared model တစ်ခုက format ကို protocol နဲ့ မသက်ဆိုင်ဘဲ နောင်အနာဂတ်အတွက်ပါ ရေရှည်အသုံးပြုလို့ရအောင် ထားပေးပါတယ်။
