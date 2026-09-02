---
title: "Postman မှာ monitor reports တွေ publish လုပ်ခြင်း (Publish monitor reports in Postman)"
description: "Monitor report တစ်ခုကို publish လုပ်နည်း — plans တွေပေါ်မူတည်ပြီး ရနိုင်မှု, Enterprise plans မှာ approval request လုပ်ခြင်း, request update/withdraw လုပ်ခြင်း, requests တွေကို approve/deny လုပ်ခြင်း နဲ့ published report ကို ကြည့်ရှုခြင်း"
order: 65
source: "https://learning.postman.com/docs/monitoring-your-api/monitor-reports/publish-monitor-reports/"
status: translated
updated: 2026-09-02
---

Published monitor reports တွေကို Postman Solo, Team နဲ့ Enterprise plans တွေမှာ ရနိုင်ပါတယ်။ အသေးစိတ်အတွက် — [pricing page](https://www.postman.com/pricing/) ကို ကြည့်ပါ။

Published monitor reports တွေနဲ့ဆိုရင် — API uptime, performance နဲ့ မကြာသေးခင်က run results တွေကို Postman ရဲ့ အပြင်ဘက်မှာ share လုပ်ဖို့ read-only link တစ်ခု generate လုပ်နိုင်ပါတယ်။ Link ရှိတဲ့ ဘယ်သူမဆို — Postman account ဒါမှမဟုတ် workspace access မလိုဘဲ report ကို ကြည့်ရှုနိုင်ပါတယ်။ ဒါက ကိုယ့် workspace ထဲ မပါဝင်တဲ့ stakeholders တွေကို API ရဲ့ ယုံကြည်စိတ်ချရမှုကို ဆက်သွယ်ပြောဆိုဖို့ အသုံးဝင်ပါတယ်။ ဥပမာ — production API တစ်ခုရဲ့ ကျန်းမာရေးကို ကိုယ့် monitors တွေဆီ တိုက်ရိုက် access မပေးဘဲ customers တွေကို မြင်နိုင်စေနိုင်ပါတယ်။

## Monitor report တစ်ခု publish လုပ်ခြင်း

[Monitor Editor](https://learning.postman.com/docs/administration/roles-and-permissions/#monitor-roles) တစ်ယောက်အနေနဲ့ — ကိုယ့်မှာ access ရှိတဲ့ monitors တွေအတွက် monitor reports တွေကို publish လုပ်နိုင်ပါတယ်။ Published monitor reports တွေက နောက်ဆုံး monitor runs ၃၀ နဲ့ run တစ်ခုချင်းစီအတွက် request-level အသေးစိတ်တွေကို ပြသပါတယ်။ Monitor တစ်ခုမှာ တစ်ကြိမ်မှာ published report တစ်ခုပဲ ရှိနိုင်ပါတယ်။ [Team Admin](https://learning.postman.com/docs/administration/roles-and-permissions/#team-roles) တစ်ယောက်က [publish လုပ်ဖို့ requests တွေကို approve](#monitor-reports-တွေ-publish-လုပ်ဖို့-requests-တွေကို-ပြန်လည်သုံးသပ်ခြင်း) လုပ်ပေးရတဲ့ Enterprise plan ပေါ်မှာ ရှိနေရင်တော့ — monitor reports တွေ publish လုပ်ဖို့ approve လိုအပ်ပါတယ်။

Monitor reports တွေကို internal team workspaces တွေနဲ့ public workspaces တွေမှာ publish လုပ်နိုင်ပါတယ်။ Internal private workspaces တွေနဲ့ Partner Workspaces တွေမှာတော့ — published monitor reports တွေကို ပံ့ပိုးမပေးပါဘူး။

Monitor report တစ်ခု publish လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက ![Services icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-services-stroke.svg#icon) **Services** ကို နှိပ်ပါ။
2. **Monitor** ကို နှိပ်ပြီး report publish လုပ်ချင်တဲ့ monitor တစ်ခုကို ရွေးပါ။
3. Workbench ရဲ့ ညာဘက်အပေါ်မှာ — ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions > Publish** ကို ရွေးပါ။
4. (ထည့်စရာမလို) Context နဲ့ search visibility ကောင်းစေဖို့ monitor report အတွက် **Title** နဲ့ **Description** တစ်ခု ထည့်ပါ။ Title မပေးထားရင် — monitor ရဲ့ နာမည်ကို သုံးပါတယ်။
5. (ထည့်စရာမလို) Performance data တွေကို ဆက်လက် share လုပ်ရင်း — published report ထဲမှာ request endpoint အသေးစိတ်တွေ ပြသစေဖို့ **Show request endpoints** checkbox ကို ရွေးပါ။
6. (Enterprise plans တွေမှာပဲ) Report publish လုပ်ဖို့ Team Admin ဆီကနေ approval request လုပ်တဲ့ message တစ်ခု ရိုက်ထည့်ပါ။
7. **Publish** ဒါမှမဟုတ် **Request to publish** ကို နှိပ်ပါ။

Monitor report တစ်ခု publish ပြီးတာနဲ့ — link ကို သုံးပြီး တခြားသူတွေနဲ့ share လုပ်နိုင်ပါတယ်။ Monitor report ဆီ link ရဖို့ — workbench ရဲ့ ညာဘက်အပေါ်မှာ ![Published icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-state-published-stroke.svg#icon) **Published monitor** ကို နှိပ်ပြီး ![Link icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-link-stroke.svg#icon) **Copy link** ကို နှိပ်ပါ။ Workbench ထဲမှာ ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions > Monitor report > Copy link** ကို ရွေးပြီးလည်း ရနိုင်ပါတယ်။

Enterprise plan ပေါ်မှာ ဆိုရင် — Team Admin တစ်ယောက်က monitor report publish ဖို့ ကိုယ့် request ကို approve ဒါမှမဟုတ် deny လုပ်တဲ့အခါ Postman ထဲမှာ notification တစ်ခု ရပါတယ်။ Request ကို deny လုပ်ခဲ့ရင် — ပေးထားတဲ့ အကြောင်းရင်းကို ပြန်သုံးသပ်ပြီး publish ဖို့ request အသစ်တစ်ခု တင်သွင်းနိုင်ပါတယ်။ [publish ဖို့ requests တွေကို update လုပ်ခြင်း](#monitor-report-တစ်ခု-publish-ဖို့-request-ကို-update-လုပ်ခြင်း) အကြောင်းလည်း ပိုလေ့လာနိုင်ပါတယ်။

## Monitor report တစ်ခု publish ဖို့ request ကို update လုပ်ခြင်း

Enterprise plan ပေါ်မှာဆိုရင် — request ကို approve ဒါမှမဟုတ် deny မလုပ်ရသေးခင် monitor report တစ်ခုကို [publish](#monitor-report-တစ်ခု-publish-လုပ်ခြင်း) ဒါမှမဟုတ် [update](/docs/postman/update-monitor-reports#monitor-report-တစ်ခုကို-update-လုပ်ခြင်း) လုပ်ဖို့ ကိုယ့် request ကို update ဒါမှမဟုတ် withdraw လုပ်နိုင်ပါတယ်။

1. Sidebar ထဲက ![Services icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-services-stroke.svg#icon) **Services** ကို နှိပ်ပါ။
2. **Monitor** ကို နှိပ်ပြီး approval စောင့်ဆိုင်းနေတဲ့ (pending) request ရှိတဲ့ monitor တစ်ခုကို ရွေးပါ။
3. Workbench ရဲ့ ညာဘက်အပေါ်မှာ — ![Published icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-state-published-stroke.svg#icon) **Pending publish approval** ဒါမှမဟုတ် **Published -- a change request is in review** ကို နှိပ်ပါ။
4. အောက်ပါ action တွေထဲက တစ်ခုကို လုပ်နိုင်ပါတယ်:

   * Title, description, request endpoint visibility ဒါမှမဟုတ် message တွေကို update ပြီး **Update request** ကို နှိပ်ပါ။
   * Pending ဖြစ်နေတဲ့ publish request ကို ဖျက်သိမ်းဖို့ **Withdraw request** ကို နှိပ်ပါ။

Workbench ရဲ့ ညာဘက်အပေါ်မှာ — publish ဖို့ ကိုယ့် request ကို update ဒါမှမဟုတ် withdraw လုပ်ဖို့ ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions > Monitor report** ကိုလည်း ရွေးနိုင်ပါတယ်။

## Monitor reports တွေ publish လုပ်ဖို့ requests တွေကို ပြန်လည်သုံးသပ်ခြင်း

Enterprise plan ပေါ်က Team Admin တစ်ယောက်အနေနဲ့ — monitor reports တွေကို [publish](#monitor-report-တစ်ခု-publish-လုပ်ခြင်း) ဒါမှမဟုတ် [update](/docs/postman/update-monitor-reports#monitor-report-တစ်ခုကို-update-လုပ်ခြင်း) လုပ်ဖို့ requests တွေကို approve ဒါမှမဟုတ် deny လုပ်နိုင်ပါတယ်။ Monitor report တစ်ခု publish ဒါမှမဟုတ် update လုပ်ဖို့ request တစ်ခု တင်သွင်းတဲ့အခါ — Team Admins တွေက Postman ထဲမှာ notification တစ်ခု ရပါတယ်။

1. Sidebar ထဲက ![Services icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-services-stroke.svg#icon) **Services** ကို နှိပ်ပါ။

2. **Monitor** ကို နှိပ်ပြီး publish ဒါမှမဟုတ် update လုပ်ဖို့ approval စောင့်ဆိုင်းနေတဲ့ request ရှိတဲ့ monitor တစ်ခုကို ရွေးပါ။

3. Workbench ရဲ့ ညာဘက်အပေါ်မှာ — ![Published icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-state-published-stroke.svg#icon) **Pending publish approval** ကို နှိပ်ပါ။

4. Request လုပ်သူရဲ့ message အပါအဝင် — request အသေးစိတ်တွေကို ပြန်လည်သုံးသပ်ပြီး ကိုယ့် ဆုံးဖြတ်ချက် ချပါ။

5. အောက်ပါ action တွေထဲက တစ်ခုကို လုပ်ဆောင်ပါ:

   * **Approve** ကို နှိပ်ပြီး — monitor report ကို publish ဒါမှမဟုတ် update လုပ်ကာ shared link တစ်ခုနဲ့ ရနိုင်အောင် ပြုလုပ်ပါ။
   * **Deny** ကို နှိပ်ပြီး — request ကို ပယ်ကာ monitor report ကို publish ဒါမှမဟုတ် update မလုပ်အောင် တားဆီးပါ။ Published report တစ်ခုကို update လုပ်ဖို့ request တစ်ခုကို deny လုပ်တာက — ရှိပြီးသား report ကို ပြောင်းလဲမှု မရှိဘဲ published အတိုင်း ဆက်ထားပေးပါတယ်။

6. Request ကို deny လုပ်ရင် — publish ဒါမှမဟုတ် update လုပ်ဖို့ request ကို deny လုပ်တဲ့ အကြောင်းရင်းတစ်ခု ပေးနိုင်ပါတယ်။ Request ကို ပယ်ဖို့ **Deny** ကို နှိပ်ပါ။

Workbench ရဲ့ ညာဘက်အပေါ်မှာ — publish ဒါမှမဟုတ် update လုပ်ဖို့ request ကို ပြန်လည်သုံးသပ်ဖို့ ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions > Monitor report** ကိုလည်း ရွေးနိုင်ပါတယ်။

## Published monitor report တစ်ခုကို ကြည့်ရှုခြင်း

Published monitor report ကို web browser တစ်ခုထဲမှာ shared link နဲ့ ဖွင့်ပါ။ Monitor report ရဲ့ public URL က `statuspage.getpostman.com/<reportId>` ဖြစ်ပါတယ်။ Report က နောက်ဆုံး monitor runs ၃၀ ကို ပြသပြီး — monitor ရဲ့ health status ကို ဖော်ပြကာ အလုံးစုံ အောင်မြင်မှုနှုန်း (overall success rate) တစ်ခု ပါဝင်ပါတယ်။

Monitor run တစ်ခုကို နှိပ်ပြီး — အဲဒီ run အတွက် request-level အသေးစိတ်တွေကို ကြည့်ရှုနိုင်ပါတယ်။ ပုံမှန်အားဖြင့် — response times တွေ, status codes တွေ နဲ့ test assertion failures အရေအတွက် အပါအဝင် request တစ်ခုချင်းစီအတွက် အသေးစိတ် အချက်အလက်တွေကို ကြည့်ရှုနိုင်ပါတယ်။

![Published monitor report showing run details](https://assets.postman.com/postman-docs/v12/published-monitor-report-v12.png)

Workbench ရဲ့ ညာဘက်အပေါ်မှာ — published monitor report တစ်ခုကို ကြည့်ရှုဖို့ ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions > Monitor report** ကိုလည်း ရွေးနိုင်ပါတယ်။
