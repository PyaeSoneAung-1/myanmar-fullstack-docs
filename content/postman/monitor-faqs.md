---
title: "Postman Monitors အမေးများသော မေးခွန်းများ (Postman Monitors frequently asked questions)"
description: "Postman Monitors အကြောင်း အမေးများသော မေးခွန်းများ — configuring, running, updating, securing နဲ့ troubleshooting — monitor settings, runs, data handling, updates, privacy/security နဲ့ performance"
order: 69
source: "https://learning.postman.com/docs/monitoring-your-api/faqs-monitors/"
status: translated
updated: 2026-09-02
---

အောက်ပါတွေက Postman Monitors တွေကို configure လုပ်ခြင်း, run လုပ်ခြင်း, update လုပ်ခြင်း, လုံခြုံစေခြင်း နဲ့ troubleshoot လုပ်ခြင်းအကြောင်း အမေးများတဲ့ မေးခွန်းတွေပါ။

## Monitor settings တွေ

### Monitors တွေနဲ့ ဘာတွေ test လုပ်လို့ရလဲ

Monitors တွေအတွက် — မှန်ကန်တဲ့ အပြုအမူ, business logic နဲ့ error handling တွေကို စစ်ဆေးဖို့ [post-response scripts တွေ ရေးနိုင်ပါတယ်](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/)။

### Monitors ဘယ်နှစ်ခုအထိ ဖန်တီးလို့ရလဲ

Monitors ဖန်တီးလို့ရတဲ့ အရေအတွက်ကို ကန့်သတ်ချက် မရှိပါဘူး။ Collections တွေ ဘယ်နှစ်ခုမဆို ရှိနိုင်ပြီး — collection တစ်ခုချင်းစီမှာ monitors ဘယ်နှစ်ခုမဆို ရှိနိုင်ကာ — monitor တစ်ခုချင်းစီက schedule မတူညီတဲ့အတိုင်း run နိုင်ပါတယ်။

### ကိုယ့် monitor က region ဘယ်နှစ်ခုမှာ run လို့ရလဲ

Paid plans တွေနဲ့ဆိုရင် — ကိုယ့် monitor ကို run ဖို့ ပထဝီဝင် region တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရွေးနိုင်သလို — region တစ်ခုကို Postman က ကိုယ့်အတွက် အလိုအလျောက် ရွေးပေးတာကိုလည်း ရွေးနိုင်ပါတယ်။ Free plan ပေါ်မှာဆိုရင် — Postman က region တစ်ခုကို အမြဲတမ်း ရွေးပေးပါတယ်။ Region တွေကို ကိုယ်တိုင် ရွေးချင်ရင် — ကိုယ့် [Postman plan ကို upgrade](https://www.postman.com/pricing/) လုပ်ပါ။

Monitor တစ်ခု ဖန်တီးတဲ့အခါ ရနိုင်တဲ့ region တွေထဲမှာ မပါတဲ့ region တစ်ခု လိုချင်ရင် — [Postman support team](https://www.postman.com/support/) ကို ဆက်သွယ်ပါ။

### ကိုယ့် monitor ကို ဘယ် time zone နဲ့ သတ်မှတ်ထားလဲ

Monitor တစ်ခု ဖန်တီးတဲ့အခါ — ကိုယ့် monitor ရဲ့ time zone ကို ကိုယ့် ကွန်ပျူတာရဲ့ time zone နဲ့ အလိုအလျောက် သတ်မှတ်ပေးပါတယ်။

## Monitor runs တွေ

### Monitor တစ်ခုက ဘယ်လောက်ကြာအောင် run လို့ရလဲ

Monitors တွေကို run တစ်ခုချင်းစီအတွက် အများဆုံး မိနစ် ၁၀ (Postman Free plan) ဒါမှမဟုတ် မိနစ် ၁၅ (Postman paid plans) အထိ ကန့်သတ်ထားပါတယ်။ HTTP requests တွေ, responses တွေ, pre-request scripts တွေ နဲ့ post-response scripts တွေ အားလုံးက time limit အတွင်းမှာ ပြီးစီးရမှာ ဖြစ်ပြီး — မဟုတ်ရင် monitor က timeout ဖြစ်ပါလိမ့်မယ်။

### Monitor runs တွေကြားမှာ variables တွေကို ဘယ်လို ထိန်းသိမ်းမလဲ

ရှိပြီးသား global variables တွေကို monitor တစ်ခုထဲကို import လုပ်လို့ မရပါဘူး — ဒါပေမဲ့ run တစ်ခုအတွင်းမှာ global variables အသစ်တွေ ဖန်တီးနိုင်ပါတယ်။ Global နဲ့ environment variables တွေကို monitoring run တစ်ခုအတွင်းမှာ update လုပ်ပြီး နောက်ပိုင်းမှာ သုံးလို့ ရပါတယ် — ဒါပေမဲ့ သူတို့က မူရင်း values တွေဆီ ပြန်ရောက်သွားပါလိမ့်မယ်။ ဒီအပြုအမူကို ပြောင်းပြီး variable values တွေကို ထိန်းသိမ်းချင်ရင် — ကိုယ့် monitor က run တိုင်း environment ကို update လုပ်ဖို့ [Postman API](/api-docs/api-reference/) ကို သုံးနိုင်ပါတယ်။

### Monitor တစ်ခုက HTTP requests ဘယ်နှစ်ခုအထိ ပို့လို့ရလဲ

Monitors တွေအတွက် requests အရေအတွက်ကို ကန့်သတ်ချက် မရှိပါဘူး — ဒါပေမဲ့ စုစုပေါင်း runtime က မိနစ် ၁၀ (Postman Free plan) ဒါမှမဟုတ် မိနစ် ၁၅ (Postman paid plans) ထက် မကျော်လွန်နိုင်ပါဘူး။

### Request တစ်ခုကို အကြိမ်များစွာ run လို့ရလား

Monitors တွေက default အနေနဲ့ iteration တစ်ခုပဲ run ပါတယ် — ဒါပေမဲ့ iterations အများကြီး run ဖို့ `setNextRequest()` ကို သုံးနိုင်ပါတယ်။

## Data ကိုင်တွယ်ခြင်း

### Monitor တစ်ခုက data ဘယ်လောက်အထိ ပို့လို့ ဒါမှမဟုတ် လက်ခံလို့ရလဲ

Request တစ်ခုနဲ့အတူ ပို့လို့ ဒါမှမဟုတ် လက်ခံလို့ရတဲ့ data ပမာဏအတွက် သီးခြား ကန့်သတ်ချက် မရှိပါဘူး။ ဒါပေမဲ့ — request ဒါမှမဟုတ် response ကြီးတွေက ပို့ဖို့ လက်ခံဖို့ အချိန် ပိုကြာပါတယ်။ Requests တွေ အားလုံး မိနစ် ၁၀ (Postman Free plan) ဒါမှမဟုတ် မိနစ် ၁၅ (Postman paid plans) time limit အတွင်းမှာ ပြီးစီးနိုင်အောင် သေချာပါစေ။

### Monitor တစ်ခုဆီ data files တွေ upload လုပ်လို့ ဒါမှမဟုတ် attach လုပ်လို့ရလား

Custom data files တွေကို Postman paid plans တွေမှာ ရနိုင်ပါတယ်။ အသေးစိတ်အတွက် — [pricing page](https://www.postman.com/pricing/) ကို ကြည့်ပါ။

Monitor ကို run တဲ့အခါ variable inputs တွေအဖြစ် သုံးဖို့ — values set တွေနဲ့ data file တစ်ခုကို upload လုပ်နိုင်ပါတယ် — [collection runner](/docs/postman/working-with-data-files) နဲ့ ဆင်တူပါတယ်။ Data files တွေက အရွယ်အစား 1 MB နဲ့ — data rows ၅၀ (CSV) ဒါမှမဟုတ် objects ၅၀ (JSON) အထိ ကန့်သတ်ထားပါတယ်။ ကိုယ့် data source အဖြစ် Postman dataset တစ်ခုနဲ့ view တစ်ခုကိုလည်း သုံးနိုင်ပါတယ်။ [Monitor တစ်ခုနဲ့ data file သုံးခြင်း](https://learning.postman.com/docs/monitoring-your-api/test-data/monitors-data-files/) နဲ့ [Monitor တစ်ခုနဲ့ dataset သုံးခြင်း](https://learning.postman.com/docs/monitoring-your-api/test-data/monitors-datasets/) မှာ ပိုလေ့လာနိုင်ပါတယ်။

Scheduled collection runs တွေနဲ့ monitors တွေက Postman cloud ထဲမှာ run တာကြောင့် — [request builder](https://learning.postman.com/docs/use/send-requests/create-requests/parameters/)#send-body-data-with-requests) ထဲမှာ လုပ်နိုင်သလို requests တွေဆီ form data ဒါမှမဟုတ် binary files တွေကို attach လုပ်လို့ မရပါဘူး။ အဲဒီအစား — request နဲ့အတူ JSON ဒါမှမဟုတ် တခြား text data တွေ ပို့ဖို့ request ရဲ့ **Body** tab ပေါ်မှာ [raw data](https://learning.postman.com/docs/use/send-requests/create-requests/parameters/)#raw-data) ထည့်နိုင်ပါတယ်။

Monitor တစ်ခုက — Google Docs ဒါမှမဟုတ် Dropbox စတဲ့ cloud services တွေကနေ API တစ်ခုက ပြန်ယူလို့ရတဲ့ files တွေကိုလည်း သုံးနိုင်ပါတယ်။

## Monitor updates တွေ

### Monitor တစ်ခုကို ရွှေ့လို့ရလား

Monitors တွေကို workspaces တွေကြားမှာ ရွှေ့လို့ မရပါဘူး။ Monitor တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ collection တစ်ခုကို — သူ့ရဲ့ monitor တည်ရှိတဲ့ workspace ကနေ ရွှေ့လိုက်ရင် — monitor ကို pause လုပ်လိုက်ပါတယ်။ ပိုလေ့လာဖို့ — [Elements တွေကို workspaces တွေဆီ ရွှေ့ခြင်း](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/internal-workspaces/manage-workspaces/#move-elements-to-workspaces) ကို ကြည့်ပါ။

### Monitor တစ်ခုကို ဖျက်လို့ရလား

Monitor တစ်ခုကို ဘယ်အချိန်မဆို ဖျက်နိုင်ပါတယ်။ ဖျက်လိုက်တာနဲ့ — monitor ရဲ့ run history အားလုံးပါ ဖျက်လိုက်ပါတယ်။ History တွေကို ထိန်းသိမ်းထားချင်ရင် — monitor ကို ဖျက်မယ့်အစား pause လုပ်ထားပါ။

## Privacy နဲ့ security

### Static IP addresses တွေက customer တစ်ဦးချင်းစီအတွက် သီးသန့်လား ဒါမှမဟုတ် အားလုံး share လုပ်ထားလား

ပေးထားတဲ့ static IP addresses တွေက သတ်မှတ်ထားတဲ့ region တစ်ခုမှာ ပုံသေသတ်မှတ်ထားပြီး — ဒီ feature ကို enable လုပ်တဲ့ customers အားလုံးက share လုပ်သုံးပါတယ် — ဒီ feature ကို Postman Enterprise teams တွေမှာ ရနိုင်ပါတယ်။ အသေးစိတ်အတွက် — [Static IPs တွေကနေ run ဖို့ Postman Monitors တွေကို configure လုပ်ခြင်း](/docs/postman/using-static-ips-to-monitor) ကို ကြည့်ပါ။

### ကိုယ့် monitors တွေကို ဘယ်သူတွေ မြင်နိုင်လဲ

Monitor တစ်ခုကို — monitor ကို ဖန်တီးထားတဲ့ workspace ကို access ရှိတဲ့ users အားလုံး မြင်နိုင်ပါတယ်။ ပိုလေ့လာဖို့ — [Elements တွေကို workspaces တွေဆီ ရွှေ့ခြင်း](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/internal-workspaces/manage-workspaces/#move-elements-to-workspaces) ကို ကြည့်ပါ။

### ကိုယ့် monitors တွေကို ဘယ်သူတွေ edit လုပ်နိုင်လဲ

Monitors တွေကို — monitor ပေါ်မှာ [Editor permissions](https://learning.postman.com/docs/administration/roles-and-permissions/)) ပေးထားတဲ့ members တွေက သက်ဆိုင်ရာ workspace ထဲမှာ edit လုပ်နိုင်ပါတယ်။ Monitor တစ်ခုအတိအကျပေါ်မှာ Editor ဒါမှမဟုတ် Viewer permissions ရှိတဲ့ team members တွေကို ပြန်လည်သုံးသပ်ဖို့ ဒါမှမဟုတ် စီမံဖို့ — ကိုယ့် workspace ကို ဖွင့်ပြီး ![Services icon](https://assets.postman.com/postman-docs/aether-icons/v12/descriptive-services-stroke.svg#icon) **Services** tab ကို နှိပ်ကာ sidebar ထဲက **Monitors** ကို ချဲ့ပါ။ Monitor တစ်ခုပေါ်မှာ mouse ချပြီး ![Options icon](https://assets.postman.com/postman-docs/aether-icons/action-options-stroke.svg#icon) **More actions** ကို နှိပ်ကာ **Manage Roles** ကို ရွေးပါ။

### Monitors တွေ ဘယ်မှာ run လဲ

Monitors တွေက Postman ရဲ့ cloud infrastructure ပေါ်မှာ run ပါတယ် — Amazon Web Services (AWS) က host လုပ်ထားတာပါ။ Postman ရဲ့ cloud infrastructure အကြောင်း နောက်ထပ် အချက်အလက်တွေကို [Security overview](https://www.postman.com/trust/security/) မှာ ရနိုင်ပါတယ်။

### Monitors တွေက restricted networks တွေကို access လုပ်လို့ရလား

Monitors တွေက default အနေနဲ့ restricted networks တွေကို access လုပ်လို့ မရပါဘူး။ Virtual private cloud တစ်ခုလိုမျိုး — ကိုယ့် restricted network ကနေ internal APIs တွေကို monitor လုပ်ဖို့ [Private API Monitoring](https://learning.postman.com/docs/monitoring-your-api/runners/overview/)) နဲ့ runners တွေကို သုံးနိုင်ပါတယ်။

Postman က public APIs တွေကို monitor လုပ်တာကို default အနေနဲ့ ပံ့ပိုးပေးပါတယ်။ Monitors တွေက Postman cloud ထဲမှာ run တာကြောင့် — endpoints တွေအားလုံး internet ပေါ်မှာ အများသုံးနိုင် (publicly available) ဖြစ်ရပါမယ်။ ဆိုလိုတာက — monitors တွေက ကိုယ့် `localhost` ကို တိုက်ရိုက် access လုပ်လို့ မရသလို firewall တစ်ခုနောက်မှာ ရှိတဲ့ requests တွေကိုလည်း run လို့ မရပါဘူး။ ဒါ့အပြင် — private networks တွေ, VPNs တွေ ဒါမှမဟုတ် corporate intranets တွေပေါ်မှာ run တဲ့ APIs တွေကိုလည်း monitor လုပ်လို့ မရပါဘူး။

Private API Monitoring နဲ့ဆိုရင် — ကိုယ့် endpoints တွေကို အများသိအောင် ဖော်ထုတ်စရာ မလိုဘဲ ကိုယ့် restricted network ကနေ internal APIs တွေကို monitor လုပ်ဖို့ နဲ့ test လုပ်ဖို့ runners တွေနဲ့ Postman CLI ကို သုံးနိုင်ပါတယ်။ Setup ပြီးတာနဲ့ — monitors တွေက ကိုယ့် restricted network ထဲမှာ run ပြီး runner က results တွေကို Postman cloud ဆီ ပို့ပေးပါတယ်။

ကိုယ့်က [Postman Enterprise plan](https://www.postman.com/pricing/) တစ်ခုပေါ်မှာ ဆိုရင် — restricted firewall တစ်ခုရဲ့ နောက်မှာ ရှိတဲ့ APIs တွေကို monitor လုပ်ဖို့ [static IPs တွေကိုလည်း သုံး](/docs/postman/using-static-ips-to-monitor)နိုင်ပါတယ်။

## Performance နဲ့ troubleshooting

### Monitors တွေက ကိုယ့် API ရဲ့ performance ကို သက်ရောက်မှု ရှိလား

Monitor activity တွေရဲ့ သက်ရောက်မှုကို ကန့်သတ်ဖို့ — ကိုယ့် API endpoints တွေထဲက ဘယ်ဟာတွေကို ဘယ်နှစ်ကြိမ် call လုပ်မလဲ ဆိုတာကို configure လုပ်နိုင်ပါတယ်။ Postman က monitor တစ်ခုချင်းစီရဲ့ စုစုပေါင်း runtime ကိုလည်း မိနစ် ၁၀ (Postman Free plan) ဒါမှမဟုတ် မိနစ် ၁၅ (Postman paid plans) အထိ ကန့်သတ်ထားပါတယ်။ ဒါက monitor က လုပ်ဆောင်နိုင်တဲ့ requests အရေအတွက်ကို ကန့်သတ်ပေးပါတယ်။

### ပြဿနာတွေကို ဘယ်လို troubleshoot လုပ်မလဲ

Monitors တွေအတွက် — errors တွေ အပါအဝင် monitor run တစ်ခုချင်းစီအတွက် Postman Console output အပြည့်အစုံကို ကြည့်ရှုနိုင်ပါတယ်။ ကိုယ်ပိုင် debugging information တွေ output လုပ်ဖို့ `console.log()` နဲ့ `console.warn()` စတဲ့ methods တွေကိုလည်း သုံးနိုင်ပါတယ်။ Console ကနေ အချက်အလက်တွေကို ရှင်းလင်းဖို့ `console.clear()` method ကို သုံးနိုင်ပါတယ်။ ပိုလေ့လာဖို့ — [Monitors တွေကို troubleshoot လုပ်ခြင်း](/docs/postman/troubleshooting-monitors) ကို ကြည့်ပါ။

ကိုယ့် security နဲ့ privacy အတွက် — Postman က Console ထဲမှာ request ဒါမှမဟုတ် response bodies တွေကို log မလုပ်ပါဘူး။ Cookies တွေနဲ့ authorization keys တွေလိုမျိုး အရာတွေ ပါဝင်နိုင်တာကြောင့် — headers တွေကိုလည်း Postman က log မလုပ်ပါဘူး။
