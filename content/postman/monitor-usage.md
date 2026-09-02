---
title: "Postman မှာ monitor usage ကို စီမံခန့်ခွဲခြင်း (Manage monitor usage in Postman)"
description: "Monitor usage စီမံခန့်ခွဲနည်း — monthly usage limit တွေကို ခြေရာခံခြင်း, usage တွက်ချက်ပုံ, overages enable လုပ်ခြင်း, monitoring blocks ဝယ်ယူခြင်း နဲ့ monitor activity limits"
order: 67
source: "https://learning.postman.com/docs/monitoring-your-api/monitor-usage/"
status: translated
updated: 2026-09-02
---

Postman က ကိုယ့် team ရဲ့ monitor usage ကို စီမံခန့်ခွဲဖို့ tools တွေ ပံ့ပိုးပေးပါတယ်။ ကိုယ့် plan ရဲ့ monthly usage limit တစ်ခုနဲ့ နှိုင်းယှဉ်ပြီး — လုပ်ဆောင်ပြီးသား monitoring requests အရေအတွက်ကို ခြေရာခံနိုင်သလို — လိုအပ်ရင် overages တွေ enable လုပ်နိုင် ဒါမှမဟုတ် blocks တွေ ထပ်ဝယ်နိုင်ပါတယ်။ ဒါ့အပြင် — ကိုယ့် team က ဖန်တီးထားတဲ့ monitors တွေအားလုံးကို ကြည့်ရှုပြီး monitor activity limits တွေကို မကျော်လွန်စေဖို့ သေချာစေနိုင်ပါတယ်။

ကိုယ့် Postman plan နဲ့ ပါဝင်တဲ့ resources တွေအကြောင်း နဲ့ usage limits တွေ ရောက်တဲ့အခါ ဘာတွေ ဖြစ်မလဲ ဆိုတာ သိဖို့ — [About resource usage](https://learning.postman.com/docs/billing/resource-usage/) ကို ကြည့်ပါ။

## Monitor usage ကြည့်ရှုခြင်း

တစ်လကို လုပ်နိုင်တဲ့ အများဆုံး monitoring API calls အရေအတွက်က ကိုယ့် [Postman plan](https://www.postman.com/pricing/) ပေါ်မှာ မူတည်ပါတယ်။ ကိုယ့် team ရဲ့ monitor usage ကို စစ်ဆေးဖို့ — အောက်ပါ dashboards တွေကို ပြန်လည်သုံးသပ်ပါ:

* ကိုယ့် team ရဲ့ လက်ရှိ monitoring usage ကို စစ်ဆေးဖို့ — ညာဘက်အပေါ်ထောင့်က ကိုယ့် profile icon ကို နှိပ်ပြီး [**Resource usage** dashboard](https://go.postman.co/billing/add-ons/overview) ကို ဖွင့်ဖို့ **Billing & resource usage** ကို ရွေးပါ။
* အသေးစိတ် ခွဲခြမ်းစိတ်ဖြာချက်တစ်ခု ရဖို့ — (**Monitoring Usage** ဘေးက) **View detailed usage** ကို နှိပ်ပြီး [**Monitoring Usage** dashboard](https://go.postman.co/usage/monitors) ကို ကြည့်ပါ။

**Monitoring Usage** dashboard က ကိုယ့် team ရဲ့ လက်ရှိ billing period, လုပ်ဆောင်ပြီးသား monitoring APIs အရေအတွက် နဲ့ ဘယ် monitors တွေ run ခဲ့လဲ ဆိုတာကို ပြသပေးပါတယ်။ Dashboard က monitor တစ်ခုချင်းစီရဲ့ နာမည်, status, creator နဲ့ ပို့လိုက်တဲ့ requests အရေအတွက်ကိုလည်း ပြသပါတယ်။

**Overages တွေအတွက် စိုးရိမ်နေလား။** ကိုယ့် team ရဲ့ active monitors တွေအားလုံးရဲ့ စာရင်းကို တစ်နေရာတည်းမှာ ရဖို့ ကိုယ့် [Monitoring Usage dashboard](https://go.postman.co/usage/monitors) ကို သွားပါ။ Monitoring frequency စတာတွေပေါ်မှာ အသိဉာဏ်ရှိရှိ ဆုံးဖြတ်ချက်တွေ ချနိုင်ဖို့ ကူညီမယ့် အချက်အလက်တွေကိုလည်း တွေ့ရပါလိမ့်မယ်။ [Monitor overages](#monitor-overages-တွေ-enable-လုပ်ခြင်း) အကြောင်း ပိုလေ့လာပါ။

## Postman က monitor usage ကို ဘယ်လို တွက်ချက်လဲ

Monitor usage ကို monitoring API calls အရေအတွက်အပေါ် အခြေခံပြီး တွက်ချက်ပါတယ်:

* Region တစ်ခုမှာ request တစ်ခု (ဆိုလိုတာက API endpoint တစ်ခုကို call လုပ်ခြင်း) run လုပ်တာက monitoring API call တစ်ခုအဖြစ် ရေတွက်ပါတယ်။
* Monitor က သုံးတဲ့ collection မှာ requests အများကြီး ရှိရင် — collection ထဲက request တစ်ခုချင်းစီက API call တစ်ခုအဖြစ် ရေတွက်ပါတယ်။
* Monitor က region အများအပြားမှာ run ဖို့ schedule လုပ်ထားရင် — region တစ်ခုစီမှာ လုပ်ဆောင်တဲ့ request တစ်ခုချင်းစီက API call တစ်ခုအဖြစ် ရေတွက်ပါတယ်။

Request တစ်ခုကို [skip လုပ်ဖို့ ဒါမှမဟုတ် အကြိမ်များစွာ run လုပ်ဖို့](/docs/postman/building-workflows) `pm.execution.setNextRequest()` function ကို သုံးရင် — Postman က monitor usage ကို လိုအပ်သလို ချိန်ညှိပေးပါတယ်။ [authorization](/docs/postman/authorization) အတွက် လိုအပ်တဲ့ requests တွေကိုလည်း Postman က ရေတွက်ပါတယ်။

## Monitor overages တွေ enable လုပ်ခြင်း

Postman Free account တစ်ခုနဲ့ဆိုရင် — ကိုယ့် monthly usage limit ကို ရောက်တာနဲ့ — ကိုယ့် monitors တွေကို billing period ရဲ့ ကျန်တဲ့ ကာလအတွက် အလိုအလျောက် pause လုပ်လိုက်ပါတယ်။ Billing period ရဲ့ ကျန်တဲ့ ကာလအတွက် monitoring ကို ဆက်သုံးချင်ရင် — ကိုယ့် [Postman plan ကို upgrade](https://go.postman.co/purchase) လုပ်ပါ။

Postman paid account တစ်ခုနဲ့ဆိုရင် — monitoring overages တွေကို enable လုပ်ဖို့ option ရှိပါတယ်။ ကိုယ့် monthly usage limit ကို ရောက်ပြီးတာနဲ့ — ကိုယ့် monitors တွေက ဆက်ပြီး run နေပြီး — monitoring API call တစ်ခုချင်းစီအတွက် pay-as-you-go နှုန်းနဲ့ ကောက်ခံပါတယ်။

Paid Postman accounts တွေအတွက် overages တွေကို default အနေနဲ့ ခွင့်ပြုထားပါတယ်။ Overages တွေကို မလိုချင်ရင် — ညာဘက်အပေါ်ထောင့်က ကိုယ့် profile icon ကို နှိပ်ပြီး **Billing & resource usage** ကို ရွေးကာ — **Monitoring Usage** အောက်က **Pay-as-you-go** ကို ပိတ်လိုက်ပါ။

## Monitoring blocks တွေ ဝယ်ယူခြင်း

ကိုယ့် monthly usage limit ကို ရောက်ပြီးနောက် overages တွေအတွက် ပေးဆောင်မယ့်အစား — monitoring calls blocks တွေ ထပ်ဝယ်ဖို့ option ရှိပါတယ်။ Blocks တွေ ဝယ်တာက — ကိုယ့် team က လုပ်တဲ့ monitoring calls အရေအတွက်ပေါ် မူတည်ပြီး pay-as-you-go နှုန်းနဲ့ ယှဉ်ရင် ငွေစေ့စေနိုင်ပါတယ်။

Monitoring call blocks တွေ ထပ်ဝယ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ညာဘက်အပေါ်ထောင့်က ကိုယ့် profile icon ကို နှိပ်ပြီး **Billing & resource usage** ကို ရွေးပါ။
2. [**Monitoring Usage** dashboard](https://go.postman.co/usage/monitors) ကို ဖွင့်ဖို့ **Monitoring Usage** section ထဲက **View detailed usage** ကို နှိပ်ပါ။
3. **Update usage plan** ကို နှိပ်ပါ။
4. **Edit plan** dashboard ထဲမှာ — **50K monitoring requests** ဘေးမှာ ဝယ်ချင်တဲ့ blocks အရေအတွက်ကို ရိုက်ထည့်ပါ။
5. **Next** ကို နှိပ်ပြီး — ကိုယ့် ပြောင်းလဲမှုတွေကို ပြန်သုံးသပ်ကာ ဝယ်ယူမှု ပြီးမြောက်ဖို့ **Confirm Changes** ကို နှိပ်ပါ။

မသုံးရသေးတဲ့ monitoring calls တွေ ဒါမှမဟုတ် blocks တွေက billing period ရဲ့ အဆုံးမှာ သက်တမ်းကုန်ပြီး — နောက်လကို မရွှေ့ပေးပါဘူး။

## Monitor activity limits တွေ

Postman က monitoring ရဲ့ အလုံးစုံ performance နဲ့ availability ကို သေချာစေဖို့ — team နဲ့ user actions အမျိုးမျိုးအတွက် default limits တွေ ထိန်းသိမ်းထားပါတယ်။ ကိုယ့် team က ဒီ limits တွေကို ရောက်ရင် — Postman က ကိုယ့် Admins တွေကို email ပို့ပါလိမ့်မယ်။ ဒါ့အပြင် — team members တွေက Postman ထဲမှာ alert တစ်ခု ရပါလိမ့်မယ်။

Postman က team တစ်ခုစီအတွက် အောက်ပါ monitoring limits တွေကို ထိန်းသိမ်းထားပါတယ်:

* Active နဲ့ paused monitors တွေရဲ့ အများဆုံး အရေအတွက် — ၃၀၀
* Monitors အားလုံးရဲ့ အများဆုံး parallel runs — ၅၀၀
* Monitor တစ်ခုတည်းရဲ့ အများဆုံး parallel runs — ၂၀၀

ဒီ limits တွေနဲ့ ပတ်သက်ပြီး အကူအညီ လိုအပ်ရင် — [Postman support team](https://support.postman.com/hc/en-us) ကို ဆက်သွယ်ပါ။
