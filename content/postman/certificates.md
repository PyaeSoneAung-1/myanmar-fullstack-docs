---
title: "Postman မှာ CA နဲ့ client certificates တွေ ထည့်ခြင်း နဲ့ စီမံခြင်း (Add and Manage CA and Client Certificates)"
description: "CA နဲ့ client certificates တွေ Postman မှာ ထည့်ခြင်း စီမံခြင်း — CA certificate ထည့်နည်း, mutual TLS အတွက် client certificate ထည့်နည်း, certificates edit/remove လုပ်ခြင်း, certificate errors troubleshoot လုပ်ခြင်း"
order: 41
source: "https://learning.postman.com/docs/use/send-requests/authorization/certificates/"
status: translated
updated: 2026-09-02
---

Requests တွေ ပို့တဲ့အခါ authentication လုပ်နိုင်အောင် — Postman မှာ certificates တွေကို ထည့်သွင်းပြီး စီမံနိုင်ပါတယ်။ Postman ထဲကို ထည့်ထားတဲ့ certificates တွေကို local မှာ သိမ်းဆည်းပြီး — Postman cloud ဆီကို sync မလုပ်ပါဘူး။

Mutual TLS (mTLS) သုံးတဲ့ API တစ်ခုဆီ ချိတ်ဆက်ဖို့ — Postman ထဲကို client certificate တစ်ခု ထည့်ဖို့ လိုအပ်ပါတယ်။ Mutual TLS ဆိုတာ — client ရော server ရော ကိုယ့်ရဲ့ သက်သေခံချက်ကို certificate တစ်ခုနဲ့ အတည်ပြုဖို့ လိုအပ်တဲ့ authentication method တစ်ခုပါ။ နှစ်ဖက်စလုံးရဲ့ သက်သေခံချက် အတည်ပြုပြီးတာနဲ့ — encrypt လုပ်ထားတဲ့ connection တစ်ခု တည်ဆောက်ပေးပါတယ်။

Postman ထဲကို custom CA certificate တစ်ခုလည်း ထည့်နိုင်ပါတယ်။ Endpoint တစ်ခုက internal certificate registry တစ်ခုမှာ register လုပ်ထားတဲ့ certificate တစ်ခုကို သုံးနေရင် — Postman ကနေ ပို့တဲ့ requests တွေက "SSL Error: Self signed certificate" ဆိုတဲ့ error message နဲ့ ကျဆုံးနိုင်ပါတယ်။ Custom CA certificate တစ်ခု ထည့်လိုက်ရင် — [SSL verification ကို ပိတ်စရာ မလိုဘဲ](#certificate-errors-တွေ-troubleshoot-လုပ်ခြင်း) endpoint ဆီ requests တွေ ပို့နိုင်ပါတယ်။

Postman web app ကို သုံးပြီး certificates တွေ ထည့်တာ စီမံတာ လုပ်နေရင် — [Postman Desktop Agent](https://learning.postman.com/docs/getting-started/basics/about-postman-agent/)#postman-desktop-agent) ကို သုံးရပါမယ်။ နောက်ဆုံးရတဲ့ အပြောင်းအလဲတွေနဲ့ တိုးတက်မှုတွေ ရဖို့ — [Postman Desktop Agent ရဲ့ နောက်ဆုံး version](https://learning.postman.com/docs/getting-started/basics/about-postman-agent/)#update-the-postman-desktop-agent) ကို သုံးဖို့ Postman က အကြံပြုပါတယ်။

## Certificates တွေကို စီမံခန့်ခွဲခြင်း

[Postman settings](https://learning.postman.com/docs/getting-started/installation/settings/certificates/) ထဲမှာ — install လုပ်ထားတဲ့ certificates တွေကို ကြည့်ရှုခြင်း, certificate အသစ်တစ်ခု ထည့်ခြင်း ဒါမှမဟုတ် certificate တစ်ခုကို ဖယ်ရှားခြင်း စတာတွေ လုပ်နိုင်ပါတယ်။

Certificates အတွက် settings တွေဆီ သွားဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Header ထဲမှာ ![Setting icon](https://assets.postman.com/postman-docs/aether-icons/descriptive-setting-stroke.svg#icon) **Settings > App settings** ကို ရွေးပါ။

2. **Certificates** tab ကို ရွေးပါ။

   ![Certificates tab](https://assets.postman.com/postman-docs/v12/manage-certs-3-5-26-v12.png)

CA နဲ့ client certificates တွေကို စီမံဖို့ — [Postman VS Code extension](https://learning.postman.com/docs/reference/vs-code-extension/overview/)) ကိုလည်း သုံးနိုင်ပါတယ်။

## CA certificate တစ်ခု ထည့်ခြင်း

Requests တွေ ပို့တဲ့အခါ "Self signed certificate" errors တွေ မဖြစ်အောင် — ကိုယ့်ရဲ့ custom CA certificate ကို Postman ထဲကို ထည့်ပါ။

1. **CA certificates** toggle ကို ဖွင့်ပါ။
2. ကိုယ့် CA certificate အတွက် **PEM file** ကို ရွေးပါ။ (PEM file ထဲမှာ CA certificates အများကြီး ပါဝင်နိုင်ပါတယ်။)

   ![Add a CA certificate](https://assets.postman.com/postman-docs/v12/add-cert-3-5-26-v12.png)

## Client certificate တစ်ခု ထည့်ခြင်း

Mutual TLS authentication သုံးတဲ့ API တစ်ခုဆီ requests တွေ ပို့ဖို့ — ကိုယ့်ရဲ့ client certificate ကို Postman ထဲကို ထည့်ပါ။

1. **Add Certificate** ကို ရွေးပါ။

2. Certificate အတွက် **Host** domain ကို ရိုက်ထည့်ပါ (protocol မပါပါဘူး)။ ဥပမာ — [Postman Echo API](https://www.postman.com/postman/published-postman-templates/documentation/ae2ja6x/postman-echo) ဆီ requests တွေ ပို့ဖို့ "postman-echo.com" လို့ ရိုက်ထည့်ပါ။

   **Host** field က pattern matching ကို ပံ့ပိုးပေးပါတယ်။ "\*.example.com" လို့ ရိုက်ထည့်ထားရင် — example.com ရဲ့ subdomains အားလုံးအတွက် client certificate တစ်ခုတည်းကို သုံးပေးပါလိမ့်မယ်။

3. (ထည့်စရာမလို) Domain နဲ့ တွဲဖို့ custom port number တစ်ခု ရိုက်ထည့်နိုင်ပါတယ်။ Port သတ်မှတ်မပေးထားရင် — Postman က default HTTPS port (443) ကို သုံးပါတယ်။

4. ကိုယ့် certificate အတွက် **CRT file** နဲ့ **Key file** ကို ရွေးပါ။ ဒါမှမဟုတ် ကိုယ့် certificate ရဲ့ **PFX file** ကို ရွေးပါ။

5. Client certificate ကို generate လုပ်တုန်းက **Passphrase** တစ်ခု သုံးခဲ့ရင် — box ထဲမှာ ရိုက်ထည့်ပါ။ မသုံးခဲ့ရင် — box ကို ဗလာထားပါ။

6. **Add** ကို ရွေးပါ။

Client certificate တစ်ခုချင်းစီက domain တစ်ခုနဲ့ပဲ သက်ဆိုင်ပါတယ်။ Domains တွေ ထပ်ပြီး requests တွေ ပို့ချင်ရင် — domain တစ်ခုချင်းစီအတွက် သင့်တော်တဲ့ certificate ကို ထည့်ပါ။ Domain တစ်ခုတည်းအတွက် certificate တစ်ခုထက်ပိုပြီး မထည့်ပါနဲ့။ Domain တစ်ခုအတွက် certificate တစ်ခုထက်ပိုပြီး ထည့်ထားရင် — Postman က နောက်ဆုံး ထည့်ထားတဲ့ certificate ကိုပဲ သုံးပါလိမ့်မယ်။

### Certificate တစ်ခုကို တည်းဖြတ်ခြင်း

Certificate တစ်ခုကို ထည့်ပြီးတာနဲ့ — တည်းဖြတ်လို့ မရတော့ပါဘူး။ အပြောင်းအလဲတွေ လုပ်ချင်ရင် — ပထမဆုံး certificate ကို [ဖယ်ရှား](#certificate-တစ်ခုကို-ဖယ်ရှားခြင်း)ပြီး certificate အသစ်တစ်ခု generate လုပ်ကာ Postman ထဲကို ထည့်ပါ။

[Let's Encrypt](https://letsencrypt.org/) SSL certificates တွေရဲ့ သက်တမ်းက ရက် 90 ပါ။ Let's Encrypt က — ကိုယ့် certificate ကို ရက် 60 တစ်ကြိမ် အလိုအလျောက် renew လုပ်ဖို့ [ACME client](https://letsencrypt.org/docs/client-options/) တစ်ခု သုံးဖို့ အကြံပြုပါတယ်။

### Certificate တစ်ခုကို ဖယ်ရှားခြင်း

Postman ကနေ requests တွေ ပို့ဖို့ certificate တစ်ခု မလိုအပ်တော့ဘူးဆိုရင် — ဖယ်ရှားလိုက်ပါ။

* CA certificate တစ်ခုကို ဖယ်ရှားဖို့ — certificate ဘေးက ![Close icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-close-stroke.svg#icon) **Remove** ကို နှိပ်ပါ။
* Client certificate တစ်ခုကို ဖယ်ရှားဖို့ — certificate ဘေးက ![Delete icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-delete-stroke.svg#icon) **Delete** ကို နှိပ်ပါ။

## Certificate တစ်ခု သုံးခြင်း

Client certificate တစ်ခု ထည့်ပြီးတာနဲ့ — Postman မှာ အဲဒီ certificate ကို သုံးဖို့ နောက်ထပ် ဘာအဆင့်မှ လုပ်စရာ မလိုပါဘူး။ သတ်မှတ်ထားတဲ့ domain တစ်ခုဆီ HTTPS request တစ်ခု လုပ်တဲ့အခါ — Postman က client certificate ကို request နဲ့အတူ အလိုအလျောက် ပို့ပေးပါတယ်။ Certificate ကို OpenSSL handling သုံးပြီး ပို့ပေးတာဖြစ်ပြီး — Postman က certificate ကို ပြောင်းလဲမှု မလုပ်ပါဘူး။

HTTP request တစ်ခု လုပ်ရင် — Postman က certificate ကို မပို့ပါဘူး။

### Certificate ပို့ခဲ့ကြောင်း အတည်ပြုခြင်း

Certificate တစ်ခု ပို့ခဲ့ကြောင်းကို [Postman Console](https://learning.postman.com/docs/use/send-requests/response-data/troubleshooting-api-requests/) သုံးပြီး အတည်ပြုနိုင်ပါတယ်။ Postman footer ထဲက **Console** ကို ရွေးပြီး Postman Console ကို ဖွင့်ပါ — ပြီးရင် request တစ်ခု ပို့ပါ။

Request နဲ့အတူ ပို့လိုက်တဲ့ certificate အကြောင်း အသေးစိတ်တွေ ကြည့်ဖို့ request ကို ချဲ့ကြည့်နိုင်ပါတယ်။

### Certificate အသေးစိတ်တွေ ကြည့်ရှုခြင်း

Response pane ထဲမှာ certificate အကြောင်း အသေးစိတ်တွေ ထပ်ကြည့်နိုင်ပါတယ်။ Request တစ်ခုကို HTTPS နဲ့ ပို့ခဲ့ရင် — ![Connection secure icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-state-connectionSecure-stroke-small.svg#icon) **Network** icon မှာ padlock တစ်ခု ပါပါတယ်။ ![Connection secure icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-state-connectionSecure-stroke-small.svg#icon) **Network** ပေါ်မှာ mouse ချ (hover) လုပ်ရင် — request နဲ့အတူ ပို့လိုက်တဲ့ certificate အကြောင်း အချက်အလက်တွေ နဲ့ self-signed ဒါမှမဟုတ် သက်တမ်းကုန်သွားတဲ့ certificates တွေအတွက် warnings ဒါမှမဟုတ် errors တွေကို မြင်ရပါတယ်။

### Certificate errors တွေ troubleshoot လုပ်ခြင်း

Request တစ်ခု ပို့တဲ့အခါ certificate verification ကျဆုံးရင် — Postman က response pane ထဲမှာ error message တစ်ခု ပြသပါတယ်။ Error ကို ဖြေရှင်းဖို့ — request အတွက် SSL verification ကို ပိတ်ပါ။

Request အတွက် SSL verification ပိတ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Request ကို ဖွင့်ပြီး **Settings** tab ကို နှိပ်ပါ။
2. **Enable SSL certificate verification** toggle ကို **OFF** အနေအထားမှာ ထားပါ။
3. Request ကို နောက်တစ်ကြိမ် ပို့ပါ။

SSL verification ကို [Postman settings](https://learning.postman.com/docs/getting-started/installation/settings/general-settings/) ရဲ့ **General** tab ထဲမှာ — တစ်ကမ္ဘာလုံး (globally) ပိတ်ထားနိုင်ပါတယ်။

SSL verification ပိတ်ထားရင် — response pane ထဲက ![Network information error icon](https://assets.postman.com/postman-docs/icon-globe-error.jpg#icon) **Network** ပေါ်မှာ mouse ချပြီး certificate errors ဒါမှမဟုတ် warnings တွေအကြောင်း အသေးစိတ် ကြည့်နိုင်ပါတယ်။

Certificate errors တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေကို [Postman Console](https://learning.postman.com/docs/use/send-requests/response-data/troubleshooting-api-requests/) မှာလည်း ရှာတွေ့နိုင်ပါတယ်။
