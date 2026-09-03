---
title: "Custom domain တစ်ခုနဲ့ API documentation ကို host လုပ်ခြင်း (Host API documentation with a custom domain)"
description: "Postman မှာ custom domain တစ်ခု ထည့်ခြင်းနဲ့ verify လုပ်ခြင်း — DNS records တွေ ထည့်နည်း, DNS ပြဿနာတွေ ဖြေရှင်းခြင်း, ပြီးတော့ ကိုယ့် custom domain ပေါ်မှာ documentation publish လုပ်ခြင်း"
order: 147
source: "https://learning.postman.com/docs/publishing-your-api/custom-doc-domains/"
status: translated
updated: 2026-09-03
---

ဒီ feature က Postman ရဲ့ paid plans တွေမှာ ရနိုင်ပါတယ်။ အသေးစိတ်အတွက် — [pricing page](https://www.postman.com/pricing/) ကို ကြည့်ပါ။

ကိုယ့် [published API documentation](/docs/postman/publishing-your-docs) တွေကို `getpostman.com` ပေါ်မှာ မဟုတ်ဘဲ — custom domain တစ်ခုပေါ်မှာ host လုပ်နိုင်ပါတယ်။ Custom domain တစ်ခုကို ထည့်ပြီး verify လုပ်ပြီးတာနဲ့ — users တွေက အဲဒီ custom domain ကို သုံးပြီး ကိုယ့် API documentation ကို ဝင်ကြည့်နိုင်ပါတယ်။

## Custom domain တစ်ခု ထည့်ခြင်း

Postman header ထဲမှာ **Organization or Team > Organization or team settings** ကို နှိပ်ပြီး [organization ဒါမှမဟုတ် team settings](https://go.postman.co/settings/team/custom-domains) ကို ဝင်ပါ။

**Custom domains** ကို နှိပ်ပြီး — ကိုယ့် team အတွက် ထည့်ထားတဲ့ custom domains တွေနဲ့ domain တစ်ခုချင်းစီရဲ့ verification status ကို ကြည့်ပါ။ [ကိုယ့် domain ကို verify လုပ်ဖို့](#ကိုယ့်-domain-ကို-verify-လုပ်ခြင်း) လိုအပ်တဲ့ verification records တွေ ရဖို့ — domain တစ်ခုဘေးက **View Details** ကို နှိပ်ပါ။

Domain အသစ်တစ်ခု ထည့်ဖို့ — **Add custom domain** ကို နှိပ်ပြီး ကိုယ့် domain ရဲ့ URL ကို ရိုက်ထည့်ပါ။ Subdomain တစ်ခု (ဥပမာ `docs.example.com`) ရိုက်ထည့်လို့ ရပေမယ့် — ကိုယ့် main domain (ဥပမာ `example.com`) ကိုတော့ ရိုက်ထည့်လို့ မရပါဘူး။

Custom domain ကို verify လုပ်ဖို့ — **Proceed** ကို နှိပ်ပါ။

## ကိုယ့် domain ကို verify လုပ်ခြင်း

Custom domain တစ်ခု ထည့်ပြီးတာနဲ့ — domain ပိုင်ဆိုင်မှု verify လုပ်ဖို့ လိုအပ်တဲ့ DNS records တွေကို Postman က ပြသပေးပါတယ်။ ထည့်ဖို့ ကြိုးစားနေတဲ့ domain ကို ကိုယ် ထိန်းချုပ်ထားကြောင်း verify လုပ်ဖို့ — ပေးထားတဲ့ tokens တွေကို copy လုပ်ပြီး ကိုယ့် domain မှာ TXT နဲ့ CNAME records တွေ ထည့်ဖို့ သုံးပါ။ Records တွေ ထည့်ပြီးတာနဲ့ — Postman ရဲ့ [organization ဒါမှမဟုတ် team settings](https://go.postman.co/settings/team/custom-domains) ထဲမှာ verification ကို အပြီးသတ်နိုင်ပါတယ်။

Custom documentation domains တွေအတွက် domain verification က domain capture အတွက် domain verification နဲ့ မတူပါဘူး။ Domain capture အတွက် domain verification က CNAME records တွေ မလိုအပ်ပါဘူး။ Domain capture အတွက် ကိုယ့် organization ရဲ့ domain ကို verify လုပ်ချင်နေတယ်ဆိုရင် — [Postman မှာ ကိုယ့် organization ရဲ့ domain ကို verify လုပ်ခြင်း](https://learning.postman.com/docs/administration/domain-verification-and-capture/add-and-verify-a-domain/) ကို ကြည့်ပါ။

### DNS records တွေ ထည့်ခြင်း

ကိုယ့် domain မှာ DNS records တွေ ထည့်ဖို့ — browser tab အသစ်တစ်ခု ဖွင့်ပြီး ကိုယ့် domain registrar ဒါမှမဟုတ် DNS provider ထဲ ဝင်ပါ။ Postman က ပေးထားတဲ့ tokens တွေကို သုံးပြီး ကိုယ့် domain မှာ TXT record တစ်ခုနဲ့ CNAME record တစ်ခု ထည့်ပါ။

* **TXT record** — ကိုယ့် domain မှာ TXT record အသစ်တစ်ခု ထည့်ပါ။ **Name** အတွက် — root domain မှာ record ထည့်ဖို့ "@" လို့ ရိုက်ထည့်ပါ။ **Value** အတွက် — Postman ကနေ copy လုပ်ထားတဲ့ TXT token ကို သုံးပါ။
* **CNAME record** — ကိုယ့် domain မှာ CNAME record အသစ်တစ်ခု ထည့်ပါ။ **Name** အတွက် — ကိုယ့် public documentation ကို host လုပ်ချင်တဲ့ subdomain (ဥပမာ `docs.example.com`) ကို ရိုက်ထည့်ပါ။ Value အတွက် — `phs.getpostman.com` လို့ ရိုက်ထည့်ပါ။

TXT နဲ့ CNAME records တွေ ထည့်တဲ့ အဆင့်တွေက domain registrar ဒါမှမဟုတ် DNS provider ပေါ်မူတည်ပြီး ကွဲပြားနိုင်သလို — ပြထားတာတွေနဲ့လည်း မတူနိုင်ပါတယ်။ ပိုပြီး အကူအညီ လိုအပ်ရင် ကိုယ့် provider ရဲ့ documentation တွေကို စစ်ကြည့်ပါ။

### Verification အပြီးသတ်ခြင်း

Verification အပြီးသတ်ဖို့ — Postman ထဲက Organization ဒါမှမဟုတ် Team settings ဆီ ပြန်သွားပါ။ **The TXT and CNAME records have been added** ဘေးက checkbox ကို ရွေးပြီး — **Verify Domain** ကို နှိပ်ပါ။ Domain ကို verify လုပ်ပြီးကြောင်း အတည်ပြုတဲ့ message တစ်ခုကို Postman က ပြသပါလိမ့်မယ်။

ဒီအချိန်မှာ domain ကို verify မလုပ်ချင်ဘူးဆိုရင် — **Verify Later** ကို နှိပ်ပါ။ TXT နဲ့ CNAME tokens တွေကို နောက်တစ်ကြိမ် copy လုပ်ဖို့ — domain တစ်ခုဘေးက **View Details** ကို နှိပ်ပါ။ Custom domain တစ်ခုကို ဖယ်ရှားဖို့ — domain ဘေးက ![Delete icon](https://assets.postman.com/postman-docs/aether-icons/action-delete-stroke.svg#icon) **Delete** ကို နှိပ်ပါ။

Postman က — ကိုယ့် domain ပေါ်မှာ public documentation တွေ host လုပ်နိုင်အောင် — SSL certificate provider အနေနဲ့ [Let's Encrypt](https://letsencrypt.org/) ကို သုံးပါတယ်။ ကိုယ့် domain မှာ CAA records တွေ မရှိရင် — Let's Encrypt က certificate တစ်ခုကို implicitly ထုတ်ပေးပါတယ်။ ကိုယ့် domain မှာ CAA records တွေ ရှိပြီးသားဆိုရင် — အဲဒီ domain အတွက် certificate ထုတ်ပေးဖို့ Let's Encrypt က explicit CAA record တစ်ခု လိုအပ်ပါတယ်။ Let's Encrypt ကို certificate ထုတ်ပေးနိုင်အောင် — [Let's Encrypt documentation](https://letsencrypt.org/docs/caa/) ကို ကိုးကားပါ။

DNS settings အသစ်တွေ အလုပ်ဖြစ်ဖို့ 24 နာရီအထိ ကြာနိုင်ပါတယ်။ အဲဒီအထိ — ကိုယ့် custom domain ကို ဝင်ကြည့်တဲ့အခါ error message တစ်ခု ရနိုင်ပါတယ်။ DNS အပြောင်းအလဲရဲ့ status ကို စစ်ကြည့်ဖို့ — [whatsmydns.net](https://www.whatsmydns.net/) ကို ဝင်ကြည့်ပါ။

## DNS ပြဿနာတွေကို ဖြေရှင်းခြင်း

ကိုယ့် domain မှာ TXT ဒါမှမဟုတ် CNAME record တစ်ခု ထည့်ဖို့ ကြိုးစားတဲ့အခါ error message တစ်ခု ရရင် — အောက်ပါ လိုအပ်ချက်တွေကို စစ်ဆေးပါ:

* **CNAME records တွေက domain တစ်ခုတည်းအတွက် တခြား records တွေနဲ့အတူ အတူယှဉ်တွဲ မနေနိုင်ပါဘူး။** ကိုယ့် public documentation ကို host လုပ်ချင်တဲ့ subdomain အတွက် record တစ်ခု ရှိပြီးသားဆိုရင် — record type ကို CNAME အဖြစ် ပြောင်းဖို့ ဒါမှမဟုတ် subdomain အသစ်တစ်ခု ထည့်ဖို့ လိုပါတယ်။
* **CNAME record ကို root domain မှာ ထည့်လို့ မရပါဘူး။** TXT record "@" က root domain ရဲ့ ပိုင်ဆိုင်မှုကို verify လုပ်ပေးပါတယ်။ အဲဒီအစား — ကိုယ့် public documentation ကို host လုပ်ချင်တဲ့ subdomain (ဥပမာ `docs.example.com`) မှာ CNAME record ကို ထည့်ပြီး — value ကို `phs.getpostman.com` အဖြစ် သတ်မှတ်ပါ။
* **ကိုယ့် domain registrar ဒါမှမဟုတ် DNS provider က DNS proxy တစ်ခု သုံးနေတယ်။** Domain registrar နဲ့ DNS provider တချို့ (Cloudflare လိုမျိုး) က DNS proxy တစ်ခုကို default အနေနဲ့ ဖွင့်ထားပါတယ်။ Domain ကို verify မလုပ်နိုင်ရင် — DNS proxy ကို ပိတ်ပါ။ အသေးစိတ်အတွက် ကိုယ့် provider ရဲ့ documentation တွေကို ကြည့်ပါ ဒါမှမဟုတ် သူတို့ဆီ အကူအညီ တောင်းပါ။

## ကိုယ့် custom domain ပေါ်ကို documentation publish လုပ်ခြင်း

ကိုယ့် custom domain ကို verify လုပ်ပြီးတာနဲ့ — [ကိုယ့် API documentation ကို publish လုပ်ဖို့](/docs/postman/publishing-your-docs#ကိုယ့်-documentation-တွေကို-public-ဖြစ်အောင်-လုပ်ခြင်း) အဲဒီ domain ကို သုံးနိုင်ပါတယ်။ ရှိပြီးသား publish လုပ်ထားတဲ့ collection တစ်ခု ရှိနေရင် — domain အသစ်ကို သုံးဖို့ [publication settings တွေကို တည်းဖြတ်](/docs/postman/publishing-your-docs#publication-settings-တွေ-ပြောင်းလဲခြင်း)နိုင်ပါတယ်။
