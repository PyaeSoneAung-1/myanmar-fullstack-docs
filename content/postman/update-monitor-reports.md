---
title: "Postman မှာ monitor reports တွေ update လုပ်ခြင်း (Update monitor reports in Postman)"
description: "Monitor report တစ်ခုကို update ဒါမှမဟုတ် unpublish လုပ်နည်း — title/description/request endpoint visibility ပြောင်းလဲခြင်း, Enterprise plans မှာ approval request လုပ်ခြင်း နဲ့ report ဖယ်ရှားခြင်း"
order: 66
source: "https://learning.postman.com/docs/monitoring-your-api/monitor-reports/update-monitor-reports/"
status: translated
updated: 2026-09-02
---

Published monitor reports တွေကို Postman Solo, Team နဲ့ Enterprise plans တွေမှာ ရနိုင်ပါတယ်။ အသေးစိတ်အတွက် — [pricing page](https://www.postman.com/pricing/) ကို ကြည့်ပါ။

[Monitor report တစ်ခု publish လုပ်ပြီး](/docs/postman/publish-monitor-reports) တာနဲ့ — ဘယ်အချိန်မဆို update လုပ်နိုင်ပါတယ်။ ဥပမာ — title ဒါမှမဟုတ် description ကို ပြန်ပြင်နိုင်သလို — request endpoints တွေ မြင်ရမရ ချိန်ညှိနိုင်ပြီး — report မလိုအပ်တော့ဘူးဆိုရင် unpublish လုပ်နိုင်ပါတယ်။

## Monitor report တစ်ခုကို update လုပ်ခြင်း

Monitor Editor တစ်ယောက်အနေနဲ့ — ကိုယ့်မှာ access ရှိတဲ့ monitors တွေအတွက် monitor reports တွေကို update လုပ်နိုင်ပါတယ်။ Team Admin တစ်ယောက်က [update လုပ်ဖို့ requests တွေကို approve](/docs/postman/publish-monitor-reports#monitor-reports-တွေ-publish-လုပ်ဖို့-requests-တွေကို-ပြန်လည်သုံးသပ်ခြင်း) လုပ်ပေးရတဲ့ Enterprise plan ပေါ်မှာ ရှိနေရင်တော့ — published monitor report တစ်ခုကို update လုပ်ဖို့ approve လိုအပ်ပါတယ်။

Monitor report တစ်ခုကို update လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက ![Services icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-services-stroke.svg#icon) **Services** ကို နှိပ်ပါ။
2. **Monitor** ကို နှိပ်ပြီး published report ရှိတဲ့ monitor တစ်ခုကို ရွေးပါ။
3. Workbench ရဲ့ ညာဘက်အပေါ်မှာ — ![Published icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-state-published-stroke.svg#icon) **Published monitor** ကို နှိပ်ပါ။
4. Published report ရဲ့ title, description နဲ့ request endpoint visibility တွေကို update လုပ်နိုင်ပါတယ်။
5. (Enterprise plans တွေမှာပဲ) Published report ကို update လုပ်ဖို့ Team Admin ဆီကနေ approval request လုပ်တဲ့ message တစ်ခု ရိုက်ထည့်ပါ။
6. **Publish** ဒါမှမဟုတ် **Request to publish** ကို နှိပ်ပါ။

Enterprise plan ပေါ်မှာ ဆိုရင် — Team Admin တစ်ယောက်က monitor report တစ်ခုကို update လုပ်ဖို့ ကိုယ့် request ကို approve ဒါမှမဟုတ် deny လုပ်တဲ့အခါ Postman ထဲမှာ notification တစ်ခု ရပါတယ်။ Request ကို deny လုပ်ခဲ့ရင် — ပေးထားတဲ့ အကြောင်းရင်းကို ပြန်သုံးသပ်ပြီး request အသစ်တစ်ခု တင်သွင်းနိုင်ပါတယ်။ [publish ဖို့ requests တွေကို update လုပ်ခြင်း](/docs/postman/publish-monitor-reports#monitor-report-တစ်ခု-publish-ဖို့-request-ကို-update-လုပ်ခြင်း) အကြောင်းလည်း ပိုလေ့လာနိုင်ပါတယ်။

Workbench ရဲ့ ညာဘက်အပေါ်မှာ — report ကို update လုပ်ဖို့ ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions > Monitor report** ကိုလည်း ရွေးနိုင်ပါတယ်။

## Monitor report တစ်ခုကို unpublish လုပ်ခြင်း

Monitor Editor တစ်ယောက်အနေနဲ့ — ကိုယ့်မှာ access ရှိတဲ့ monitors တွေအတွက် monitor reports တွေကို unpublish လုပ်နိုင်ပါတယ်။ Enterprise plan ပေါ်မှာတော့ — Team Admin တစ်ယောက်ပဲ monitor report တစ်ခုကို unpublish လုပ်နိုင်ပါတယ်။

Monitor report တစ်ခုကို unpublish လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက ![Services icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-services-stroke.svg#icon) **Services** ကို နှိပ်ပါ။
2. **Monitor** ကို နှိပ်ပြီး published report ရှိတဲ့ monitor တစ်ခုကို ရွေးပါ။
3. Workbench ရဲ့ ညာဘက်အပေါ်မှာ — ![Published icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-state-published-stroke.svg#icon) **Published monitor** ကို နှိပ်ပါ။
4. Published report ကို ဖယ်ရှားဖို့ **Unpublish** ကို နှိပ်ပါ။

Workbench ရဲ့ ညာဘက်အပေါ်မှာ — report ကို unpublish လုပ်ဖို့ ![Options icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-options-stroke.svg#icon) **View more actions > Monitor report** ကိုလည်း ရွေးနိုင်ပါတယ်။
