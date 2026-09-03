---
title: "Postman မှာ public APIs တွေအတွက် Guided Auth setup လုပ်ခြင်း (Set up Guided Auth for public APIs in Postman)"
description: "Postman မှာ public APIs တွေအတွက် Guided Auth setup လုပ်နည်း — OAuth 2.0 authentication ကို configure လုပ်ခြင်း, Guided Auth configurations တွေကို တည်းဖြတ်ခြင်း/ဖျက်ခြင်း, domain ကို verify လုပ်ခြင်း"
order: 148
source: "https://learning.postman.com/docs/publishing-your-api/setting-up-authentication-for-public-apis/"
status: translated
updated: 2026-09-03
---

Postman မှာ ကိုယ့် public APIs တွေအတွက် Guided Auth ကို setup လုပ်ပြီး — ကိုယ့် API consumers တွေကို onboarding လုပ်နိုင်ပါတယ်။ Guided Auth နဲ့ဆိုရင် — users တွေ ကိုယ့် API ဆီ ပထမဆုံး request တစ်ခု ပို့ဖို့ လုပ်ရမယ့် အဆင့်တွေ (developer account တစ်ခု register လုပ်ခြင်း ဒါမှမဟုတ် ကိုယ့် dashboard ပေါ်မှာ app တစ်ခု ဖန်တီးခြင်းလို) ကို ဆက်သွယ်ပြောပြနိုင်ပါတယ်။ User တစ်ယောက်က ကိုယ့် API ဆီ request တစ်ခု ဖန်တီးတဲ့အခါ — အဲဒါက authentication လိုအပ်ကြောင်း Postman က အလိုအလျောက် သိရှိပြီး — setup လုပ်ဖို့ ကိုယ် ပေးထားတဲ့ အဆင့်တွေကို ပြသပေးပါတယ်။

## API authentication setup လုပ်ခြင်း

Guided Auth နဲ့ဆိုရင် — ကိုယ့် API ရဲ့ base URL ဆီ ပို့တဲ့ requests တွေကို Postman က သိရှိပြီး — authentication setup လုပ်ဖို့ ကိုယ့် API ရဲ့ consumers တွေကို အဆင့်တွေ ပြသပေးပါတယ်။ ကိုယ့် API ရဲ့ consumers တွေက — ကိုယ့် public collection ကို fork လုပ်ထားတာပဲ ဖြစ်ဖြစ်, ကိုယ့် API ဆီ request တစ်ခုကို အစကနေ ဖန်တီးထားတာပဲ ဖြစ်ဖြစ် — ဒါကို သုံးပြီး ကိုယ့် API အတွက် authentication setup လုပ်နိုင်ပါတယ်။

ကိုယ့် public APIs တွေအတွက် authentication setup လုပ်ဖို့ — [Guided Auth dashboard](https://go.postman.co/settings/team/api-authentication) ကို သွားပါ။ Postman header ထဲမှာ — **Organization or Team > Organization or team settings** ကို နှိပ်ပြီး ဘယ်ဘက် sidebar ထဲက **Guided Auth** ကို နှိပ်ပါ။

Postman က [Bearer Token](/docs/postman/authorization-types#bearer-token), [Basic Auth](/docs/postman/authorization-types#basic-auth), [API Key](/docs/postman/authorization-types#api-key) နဲ့ [OAuth 2.0](/docs/postman/oauth-20) authorization တွေကို ပံ့ပိုးပေးပါတယ်။

ကိုယ့် public APIs တွေအတွက် OAuth 2.0 authorization ကို configure လုပ်ဖို့ အကြံပြုပါတယ် — ဘာလို့လဲဆိုတော့ အဲဒါက ကိုယ့် API consumers တွေအတွက် setup အနည်းငယ်ပဲ လိုလို့ပါ။

Guided Auth ကို ပထမဆုံးအကြိမ် setup လုပ်နေတယ်ဆိုရင် — **Set up guided authorization** form ကို တွေ့ရပါလိမ့်မယ်။ Base URL တစ်ခုတည်းပေါ်က မတူညီတဲ့ endpoints တွေအတွက် authentication တစ်ခုစီ သပ်သပ်စီ လိုချင်ရင် — form ကို သုံးပြီး ကိုယ့် APIs တွေအတွက် Guided Auth configurations အများအပြား setup လုပ်ဖို့ **Add Guided Auth** ကို နှိပ်ပါ။ Authentication scheme တစ်ခုချင်းစီကို ဘယ်အချိန် သုံးရမလဲ ဆိုတာ ဖော်ပြထားဖို့ အကြံပြုပါတယ် — ဒါမှ ကိုယ့် consumers တွေက မှန်ကန်တဲ့ option ကို ရွေးနိုင်မှာပါ။ ကိုယ့် လိုအပ်ချက်ပေါ် မူတည်ပြီး [configurations တွေကို တည်းဖြတ် ဒါမှမဟုတ် ဖျက်](#guided-auth-configurations-တွေကို-တည်းဖြတ်ခြင်း-ဒါမှမဟုတ်-ဖျက်ခြင်း)နိုင်ပါတယ်။

## OAuth 2.0 authentication setup လုပ်ခြင်း

အောက်ပါ ဥပမာက OAuth 2.0 သုံးတဲ့ API တစ်ခုအတွက် Guided Auth ကို ဘယ်လို configure လုပ်ရမလဲ ဆိုတာ ပြသပေးပါတယ်:

1. API ရဲ့ နာမည်ကို ရိုက်ထည့်ပါ။ Authentication scheme အများအပြား setup လုပ်ဖို့ ဆုံးဖြတ်ထားရင် — consumers တွေ မှန်ကန်တဲ့ option ရွေးနိုင်အောင် ဒီ field ကို သုံးပါ။
2. ကိုယ့် API ရဲ့ base URL ကို ရိုက်ထည့်ပါ။ နောက်ပိုင်းမှာ authorization ဖွင့်နိုင်ဖို့ — [ဒါကို verify လုပ်ရပါမယ်](#ကိုယ့်-domain-ကို-verify-လုပ်ခြင်း)။

   ရွေးချယ်စရာအနေနဲ့ — consumers တွေက သူတို့ရဲ့ ကိုယ်ပိုင် values တွေနဲ့ အစားထိုးရမယ့် တန်ဖိုးတွေကို ဖော်ပြဖို့ ကိုယ့် base URL ထဲမှာ [variables](/docs/postman/variables) တွေ သုံးနိုင်ပါတယ်။ ဥပမာ — ကိုယ့် API ဆီ အောင်မြင်တဲ့ call တစ်ခု လုပ်ဖို့ သူတို့ URL ထဲမှာ အစားထိုးရမယ့် region, product ဒါမှမဟုတ် organization ကို ဖော်ပြတဲ့ variable တစ်ခု ထည့်နိုင်ပါတယ်: `https://{{org-name}}.example.com`။

3. **OAuth 2.0** authorization type ကို ရွေးပါ။
4. **Grant type** menu ကနေ — **Authorization code** ကို ရွေးပါ။ [Authorization code တစ်ခု သတ်မှတ်ခြင်း](/docs/postman/oauth-20#authorization-code-တစ်ခု-သတ်မှတ်ခြင်း) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။
5. **Generate Callback URL** ကို နှိပ်ပါ။ URL ကို copy လုပ်ပြီး — ကိုယ့် application ရဲ့ settings ထဲက allow list ထဲ ထည့်ပါ။
6. Access token URL ကို ရိုက်ထည့်ပါ။ ဒီ URL က ကိုယ့် authentication server ရဲ့ endpoint ဖြစ်ပြီး — access token တစ်ခု ရဖို့ သုံးပါတယ်။
7. Authorization URL ကို ရိုက်ထည့်ပါ။ ဒါက users တွေကို ကိုယ့် API နဲ့ authenticate လုပ်ဖို့ ပို့ပေးတဲ့ နေရာ ဖြစ်ပါတယ်။
8. ဒီ integration အတွက် ကိုယ် ဖန်တီးထားတဲ့ application ရဲ့ application client ID ကို ရိုက်ထည့်ပါ။
9. ဒီ integration အတွက် ကိုယ် ဖန်တီးထားတဲ့ application ရဲ့ application client secret ကို ရိုက်ထည့်ပါ။ Secrets တွေကို at rest ရော in transit ပါ encrypt လုပ်ပြီး သိမ်းထားပြီး — consumers တွေကို ဘယ်တော့မှ မပြပါဘူး။
10. (Optional) Postman users တွေ access လုပ်နိုင်တာတွေကို ကန့်သတ်ဖို့ — comma နဲ့ ခွဲထားတဲ့ authentication scopes စာရင်းတစ်ခု ရိုက်ထည့်ပါ။ ဥပမာ — `read:public_key, write:org`။
11. **How should client credentials be sent?** section ထဲမှာ — **As a Basic Auth header** ကို ရွေးပါ။
12. (Optional) Authorization type ကို customize လုပ်ဖို့ — **Advanced settings** ကို နှိပ်ပါ:

    * Refresh token URL ကို ရိုက်ထည့်ပါ။ ဒါက refresh server ရဲ့ endpoint ဖြစ်ပြီး — refresh token ကို access token တစ်ခုနဲ့ လဲလှယ်ပေးပါတယ်။ Refresh token URL က ဗလာ ဖြစ်နေရင် — access token URL ကို အစားထိုး သုံးပါတယ်။
    * Auth requests, token requests ဒါမှမဟုတ် refresh requests တွေနဲ့အတူ ပို့ချင်တဲ့ custom parameters တွေကို ရိုက်ထည့်ပါ။ Token requests ဒါမှမဟုတ် refresh requests တွေထဲမှာ ကိုယ် define လုပ်တဲ့ key-value pair တစ်ခုချင်းစီအတွက် — parameter ကို request body, request URL ဒါမှမဟုတ် request headers ထဲမှာ ပို့ချင်လား ဆိုတာ ရွေးပါ။ Auth requests တွေထဲမှာ ကိုယ် define လုပ်တဲ့ key-value pairs တွေကို request URL ထဲမှာ ပို့ပေးပါတယ်။ Key နာမည်တူတဲ့ keys အများအပြား ထည့်ထားရင် — request နဲ့အတူ array တစ်ခုအနေနဲ့ ပို့ပေးပါတယ်။

13. Users တွေ ကိုယ့် API ဆီ request တစ်ခု လုပ်ဖို့ လုပ်ရမယ့် prerequisite အဆင့်တွေ ရှိရင် ထည့်ပါ။ ဒါတွေက developer account တစ်ခု register လုပ်ခြင်း, integration တစ်ခု ဖန်တီးခြင်း ဒါမှမဟုတ် token တစ်ခု copy လုပ်ခြင်းလို အဆင့်တွေ ပါဝင်ပါတယ်။ Users တွေ ကိုယ့် API ဆီ request တစ်ခု ဖန်တီးတဲ့အခါ ဒါတွေကို ပြသပေးပြီး — authentication setup လုပ်တဲ့အခါ သူတို့ကို လမ်းညွှန်ပေးပါတယ်။

    Content တွေကို ဖွဲ့စည်းဖို့ bold, italics, underline, bullet points နဲ့ links တွေအတွက် အခြေခံ Markdown syntax ကို သုံးနိုင်ပါတယ်။

14. Authorization ထည့်တာ အပြီးသတ်ဖို့ — [ကိုယ့် domain ကို verify လုပ်](#ကိုယ့်-domain-ကို-verify-လုပ်ခြင်း)ပါ။
15. ကိုယ့် API authorization settings တွေ သိမ်းဖို့ — **Save** ကို နှိပ်ပါ။

ကိုယ့် configuration ကို ကြိုကြည့်ဖို့ — **Try it out** ကို နှိပ်ပါ။ ဒီ endpoint ဆီ API call တစ်ခု လုပ်ပြီး ကိုယ့် configuration ကို test လုပ်ပြီး validate လုပ်နိုင်ပါတယ်။

## Guided Auth configurations တွေကို တည်းဖြတ်ခြင်း ဒါမှမဟုတ် ဖျက်ခြင်း

Guided Auth setup လုပ်ပြီးတာနဲ့ — ကိုယ့် လိုအပ်ချက်ပေါ် မူတည်ပြီး configurations တွေကို တည်းဖြတ် ဒါမှမဟုတ် ဖျက်နိုင်ပါတယ်။

Configuration တစ်ခုကို တည်းဖြတ်ဖို့ ဒါမှမဟုတ် ဖျက်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Postman header ထဲမှာ — **Organization or Team > Organization or team settings** ကို နှိပ်ပြီး ဘယ်ဘက် sidebar ထဲက **Guided Auth** ကို နှိပ်ပါ။
2. Table ထဲမှာ — ပြောင်းချင်တဲ့ configuration ပါတဲ့ row ပေါ်မှာ mouse ချ (hover) လုပ်ပြီး ![Edit icon](https://assets.postman.com/postman-docs/aether-icons/action-edit-stroke.svg#icon) **Edit** ဒါမှမဟုတ် ![Delete icon](https://assets.postman.com/postman-docs/aether-icons/action-delete-stroke.svg#icon) **Delete** ကို နှိပ်ပါ။

## ကိုယ့် domain ကို verify လုပ်ခြင်း

Postman က ကိုယ့် team နဲ့ ကိုယ့် public API ကြားက ချိတ်ဆက်မှုကို ယုံကြည်နိုင်ဖို့ — ကိုယ့်ဟာ domain ရဲ့ ပိုင်ရှင် ဖြစ်ကြောင်း သက်သေပြဖို့ ကိုယ့် domain ကို verify လုပ်ပါ။ ဒီနည်းနဲ့ — တခြားသူတွေ ကိုယ့် API ကို အတုခိုးပြီး ကိုယ့် consumers တွေရဲ့ လုံခြုံမှုကို ထိခိုက်အောင် လုပ်တာမျိုးကနေ ကာကွယ်နိုင်ပါတယ်။ ကိုယ့် API authentication configuration ကို Postman community နဲ့ မမျှဝေခင် — API authentication configuration ရဲ့ domain ကို verify လုပ်ဖို့ Postman က လိုအပ်ပါတယ်။

Domain ကို verify လုပ်ပြီးတာနဲ့ — ကိုယ့် API ဆီ အသစ်ဖန်တီးလိုက်တဲ့ requests တွေကို Postman က သိရှိပြီး — ကိုယ် ပေးထားတဲ့ အဆင့်တွေနဲ့ authenticate လုပ်ဖို့ ကိုယ့် API consumers တွေကို prompt လုပ်ပေးပါတယ်။

Domain ကို verify လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Postman header ထဲမှာ — **Organization or Team > Organization or team settings** ကို နှိပ်ပြီး — **Authorization** ကို နှိပ်ပါ။
2. [**Domains**](https://go.postman.co/settings/team/domain-capture/) tab ကို နှိပ်ပြီး — verify လုပ်ချင်တဲ့ domain ဘေးက **Verify** ကို နှိပ်ပါ။
3. Domain ရဲ့ TXT Record ကို copy လုပ်ဖို့ — ![Copy icon](https://assets.postman.com/postman-docs/aether-icons/action-copy-stroke.svg#icon) **Copy** ကို နှိပ်ပါ။
4. Copy လုပ်ထားတဲ့ value ကို ကိုယ့် domain မှာ DNS TXT record တစ်ခုအနေနဲ့ ထည့်ပါ။
5. Postman ထဲမှာ — **I have added the text record to the DNS tool** ဘေးက checkbox ကို ရွေးပြီး — Postman ထဲမှာ **Verify Domain** ကို နှိပ်ပြီး အတည်ပြုပါ။
