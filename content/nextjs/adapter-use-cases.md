---
title: "Use Cases (အသုံးပြုပုံများ)"
description: "Deployment adapter implementation များအတွက် အသုံးများသော pattern များနဲ့ ဥပမာများ"
order: 257
source: "https://nextjs.org/docs/app/api-reference/adapters/use-cases"
status: translated
updated: 2026-09-03
---

Adapters တွေအတွက် အသုံးများတဲ့ use cases တွေကတော့:

- **Deployment Platform Integration (deployment platform ပေါင်းစည်းခြင်း):** သတ်မှတ်ထားတဲ့ hosting platforms တွေအတွက် build outputs တွေကို အလိုအလျောက် configure လုပ်ပေးခြင်း
- **Asset Processing (assets ပြုပြင်ခြင်း):** Build outputs တွေကို transform (အသွင်ပြောင်း) လုပ်ခြင်း (သို့) optimize လုပ်ပေးခြင်း
- **Monitoring Integration (monitoring ပေါင်းစည်းခြင်း):** Build metrics နဲ့ route information တွေကို စုဆောင်းခြင်း
- **Custom Bundling (custom bundling):** Outputs တွေကို platform-specific formats (platform အလိုက် ပုံစံများ) နဲ့ package လုပ်ခြင်း
- **Build Validation (build စစ်ဆေးခြင်း):** Outputs တွေက သတ်မှတ်ထားတဲ့ requirements တွေနဲ့ ကိုက်ညီကြောင်း သေချာစေခြင်း
- **Route Generation (route ထုတ်လုပ်ခြင်း):** Processed route information တွေကို သုံးပြီး platform-specific routing configs တွေကို ထုတ်လုပ်ခြင်း
