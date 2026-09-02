---
title: "Static IPs တွေကနေ run ဖို့ Postman Monitors တွေကို configure လုပ်ခြင်း (Configure Postman Monitors to run from static IPs)"
description: "Restricted firewall နောက်မှာ ရှိတဲ့ APIs တွေကို static IPs တွေကနေ monitor လုပ်နည်း — US plans နဲ့ EU Data Residency plans တွေအတွက် IP addresses allowlist လုပ်ခြင်း, monitor အသစ် ဖန်တီးခြင်း နဲ့ ရှိပြီးသား monitor ကို ပြောင်းခြင်း"
order: 70
source: "https://learning.postman.com/docs/monitoring-your-api/using-static-IPs-to-monitor/"
status: translated
updated: 2026-09-02
---

ဒီ feature ကို Postman Enterprise plans တွေမှာ ရနိုင်ပါတယ်။ အသေးစိတ်အတွက် — [pricing page](https://www.postman.com/pricing/) ကို ကြည့်ပါ။

Postman ရဲ့ static IP feature က — restricted firewall တစ်ခုရဲ့ နောက်မှာ ရှိတဲ့ APIs တွေကို [Postman Monitors](/docs/postman/setting-up-monitor) နဲ့ monitor လုပ်နိုင်စေပါတယ်။ ဒီ feature အတွက် ကိုယ့် IT team က static IP addresses တစ်ချို့ကို allowlist လုပ်ပေးဖို့ လိုအပ်ပါတယ်။ Allowlist လုပ်ရမယ့် IPs တွေက — ကိုယ့်မှာ [US Enterprise plan](#us-plans-တွေအတွက်-static-ip-address-monitoring) တစ်ခု ရှိလား [EU Data Residency plan](#eu-data-residency-plans-တွေအတွက်-static-ip-address-monitoring) တစ်ခု ရှိလားပေါ်မှာ မူတည်ပါတယ်။ IP address တစ်ခုချင်းစီက ၎င်းရဲ့ သတ်မှတ်ထားတဲ့ region မှာ ပုံသေသတ်မှတ်ထားပြီး — ဒီ feature ကို သုံးတဲ့ customers အားလုံးက share လုပ်ပါတယ်။

[Private API Monitoring](https://learning.postman.com/docs/monitoring-your-api/runners/overview/) နဲ့ဆိုရင် — ကိုယ့် endpoints တွေကို အများသိအောင် ဖော်ထုတ်စရာ မလိုဘဲ ကိုယ့် internal network ကနေ ကိုယ့် organization ရဲ့ APIs တွေကို monitor လုပ်ဖို့ နဲ့ test လုပ်ဖို့ runners တွေနဲ့ Postman CLI ကို သုံးနိုင်ပါတယ်။ Setup ပြီးတာနဲ့ — monitors တွေက ကိုယ့် internal network ထဲမှာ run ပြီး runner က results တွေကို Postman cloud ဆီ ပို့ပေးပါတယ်။

## US plans တွေအတွက် static IP address monitoring

US အခြေစိုက် Postman Enterprise plan တစ်ခု ရှိရင် — static IP address monitoring ကို setup လုပ်နိုင်ပါတယ်။ IP နှစ်ခုထဲက တစ်ခု ဒါမှမဟုတ် နှစ်ခုလုံးကို ရွေးနိုင်ပါတယ် — တစ်ခုက US (East) region ကနေ ဖြစ်ပြီး နောက်တစ်ခုက US (West) region ကနေ ဖြစ်ပါတယ်။

### Static IP addresses တွေကို allowlist လုပ်ခြင်း

Static IP addresses တွေကို US (East) နဲ့ US (West) regions တွေမှာ ရနိုင်ပါတယ်။ အောက်ပါ IP addresses တွေကို allowlist လုပ်ဖို့ ကိုယ့် IT team ကို ဆက်သွယ်ပါ:

* US (East): `34.201.186.27`
* US (West): `52.89.173.88`

### Static IP address တစ်ခုကနေ run ဖို့ monitor အသစ်တစ်ခု ဖန်တီးခြင်း

[Monitor အသစ်တစ်ခု ဖန်တီးတဲ့အခါ](/docs/postman/setting-up-monitor#monitor-တစ်ခု-ဖန်တီးခြင်း) — **Runner** အောက်က dropdown list ကို နှိပ်ပါ။ **Cloud** section ကနေ ကိုယ် လိုချင်တဲ့ static IP regions တွေကို ရွေးပြီး — **Create** ကို နှိပ်ပါ။

### Static IP address တစ်ခုကနေ run ဖို့ monitor အဟောင်းတစ်ခုကို ပြောင်းခြင်း

![Services icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-services-stroke.svg#icon) **Services** tab ကို နှိပ်ပြီး sidebar ထဲက **Monitors** ကို ချဲ့ပါ။ Monitor တစ်ခုကို ရွေးပြီး — ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **More actions > Edit** ကို ရွေးပါ။

**Runner** အောက်မှာ dropdown list ကို နှိပ်ပါ။ **Cloud** section ကနေ ကိုယ် လိုချင်တဲ့ static IP regions တွေကို ရွေးပြီး — **Update Monitor** ကို နှိပ်ပါ။

## EU Data Residency plans တွေအတွက် static IP address monitoring

[Postman EU Data Residency](https://learning.postman.com/docs/administration/enterprise/about-eu-data-residency/) plan တစ်ခု ရှိရင် — EU (Central) region မှာ တည်ရှိတဲ့ static IPs တွေနဲ့ static IP address monitoring ကို setup လုပ်နိုင်ပါတယ်။

### Static IP addresses တွေကို allowlist လုပ်ခြင်း

အောက်ပါ IP addresses တွေကို allowlist လုပ်ဖို့ ကိုယ့် IT team ကို ဆက်သွယ်ပါ:

* EU (Central): `63.179.82.81`, `3.71.240.166`, `3.124.150.113`

Static IP address monitoring ကို မှန်ကန်စွာ configure လုပ်ဖို့ — ဒီမှာ ဖော်ပြထားတဲ့ IP addresses သုံးခုလုံးကို allowlist လုပ်ရပါမယ်။

### Static IP address တစ်ခုကနေ run ဖို့ monitor အသစ်တစ်ခု ဖန်တီးခြင်း

[Monitor အသစ်တစ်ခု ဖန်တီးတဲ့အခါ](/docs/postman/setting-up-monitor#monitor-တစ်ခု-ဖန်တီးခြင်း) — **Runner** အောက်က dropdown list ကို နှိပ်ပါ။ **Cloud** section ကနေ ကိုယ် လိုချင်တဲ့ static IP regions တွေကို ရွေးပြီး — **Create** ကို နှိပ်ပါ။

### Static IP address တစ်ခုကနေ run ဖို့ monitor အဟောင်းတစ်ခုကို ပြောင်းခြင်း

![Services icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-services-stroke.svg#icon) **Services** tab ကို နှိပ်ပြီး sidebar ထဲက **Monitors** ကို ချဲ့ပါ။ Monitor တစ်ခုကို ရွေးပြီး — ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **More actions > Edit** ကို နှိပ်ပါ။

**Runner** အောက်မှာ dropdown list ကို နှိပ်ပါ။ **Cloud** section ကနေ ကိုယ် လိုချင်တဲ့ static IP regions တွေကို ရွေးပြီး — **Update Monitor** ကို နှိပ်ပါ။

## နောက်ထပ်အဆင့်များ

Restricted firewall တစ်ခုရဲ့ နောက်မှာ ရှိတဲ့ APIs တွေအတွက် monitor တစ်ခု setup လုပ်ပြီးတာနဲ့ — ကိုယ့် development workflow ထဲက တခြား tools တွေနဲ့ integration တစ်ခုကို setup လုပ်နိုင်ပါတယ်။

ကိုယ့် monitor results တွေအတွက် integrations တွေ setup လုပ်နည်းကို လေ့လာဖို့ — [Postman နဲ့ ပေါင်းစည်းခြင်း](https://learning.postman.com/docs/integrations/intro-integrations/) ကို ကြည့်ပါ။
