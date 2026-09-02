---
title: "Postman မှာ API requests များအတွက် custom settings ရွေးချယ်ခြင်း"
description: "Request တစ်ခုစီအတွက် custom settings — Settings tab သုံးပြီး SSL certificate validation, URL encoding စတာတွေ ဖွင့်/ပိတ်ခြင်း"
order: 83
source: "https://learning.postman.com/docs/use/send-requests/create-requests/request-settings/"
status: translated
updated: 2026-09-02
---

Postman မှာ ကိုယ့်ရဲ့ API requests တွေအတွက် setting အမျိုးမျိုးကို configure လုပ်နိုင်ပါတယ်။ ဒီ settings တွေက request တစ်ခု ပို့တဲ့အခါ Postman ရဲ့ အပြုအမူကို စိတ်ကြိုက် ပြင်ဆင်နိုင်စေပါတယ်။ ဥပမာ — request တစ်ခုအတွက် SSL certificate validation ကို ဖွင့်ထားနိုင်သလို URL encoding ကိုလည်း ပိတ်ထားနိုင်ပါတယ်။

## Custom request settings တွေကို configure လုပ်ခြင်း

Custom settings တွေကို configure လုပ်ဖို့ — request ရဲ့ **Settings** tab ကို နှိပ်ပါ။ Setting တစ်ခုချင်းစီက request ပို့တဲ့အခါ သူ့ရဲ့ သက်ရောက်မှုအကြောင်း ဖော်ပြချက် ပေးထားပါတယ်။

Settings တွေ configure လုပ်ပြီးတာနဲ့ — request ကို ပို့ဖို့ **Send** ကို နှိပ်ပါ။ [Postman မှာ requests တွေ ဖန်တီးပြီး ပို့ခြင်း](/docs/postman/request-basics) အကြောင်း ပိုလေ့လာပါ။

## Request URLs တွေကို encode လုပ်ခြင်း

Postman က API call တစ်ခု အောင်မြင်စွာ ဖြစ်မြောက်ဖို့ ကူညီရန် — request ရဲ့ URL ကို parse လုပ်ပြီး encode လုပ်ပါတယ်။ Postman က URL ထဲက characters တွေကို encode လုပ်ပြီး — ကိုယ့် API က လက်ခံဖို့ မျှော်လင့်ထားတဲ့ representation တစ်ခုဆီ map လုပ်ပါတယ်။ Postman ရဲ့ URL processor က server အမျိုးအစား အများကြီးက request ကို မှန်ကန်စွာ ကိုင်တွယ်နိုင်ခြေကို မြင့်တက်စေပါတယ်။

Processor က characters တွေကို URL ထဲမှာ သူတို့ ရှိနေတဲ့ နေရာပေါ်မူတည်ပြီး encode လုပ်ပါတယ်:

| URL အစိတ်အပိုင်း | Encode လုပ်ရမယ့် characters                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| Path              | `"` `<` `>` `` ` `` `#` `?` `{` `}` `SPACE`                                                      |
| Query             | `"` `#` `&` `'` `<` `=` `>` `SPACE`                                                               |
| Userinfo          | `"` `<` `>` `` ` `` `#` `?` `{` `}` `/` `:` `;` `=` `@` `[` `\` `]` `^` `SPACE`                  |

Processor ကို Postman မှာ ပုံမှန်အားဖြင့် ဖွင့်ထားပေမယ့် — ပုံမှန်မဟုတ်တဲ့ server implementation တစ်ခုနဲ့ အလုပ်လုပ်နေရရင် encoding ကို ပိတ်ထားနိုင်ပါတယ်။ ဒီ setting ကို request ထဲမှာ ပြောင်းဖို့ — **Settings** tab ကို ရွေးပြီး **Encode URL automatically** ကို ပိတ်ပါ။

URL ရဲ့ အစိတ်အပိုင်းတချို့ကို ရွေးချယ် encode လုပ်ဖို့ — text ကို မီးမောင်းထိုးပြီး right-click နှိပ်ကာ **EncodeURIComponent** ကို ရွေးပါ။
