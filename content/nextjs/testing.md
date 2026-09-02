---
title: "Testing (စမ်းသပ်ခြင်း)"
description: "Next.js ကို testing tools အသုံးများ — Cypress, Playwright, Vitest, Jest တွေနဲ့ စနစ်ထည့်သွင်းနည်း ခြုံငုံသုံးသပ်ချက်; test အမျိုးအစားများ (unit, component, integration, E2E, snapshot) နှင့် async Server Components အတွက် အကြံပြုချက်"
order: 107
source: "https://nextjs.org/docs/app/guides/testing"
status: translated
updated: 2026-09-02
---

React နဲ့ Next.js မှာ — test အမျိုးအစား အနည်းငယ် ရေးနိုင်ပြီး တစ်ခုချင်းစီမှာ ကိုယ်ပိုင် ရည်ရွယ်ချက်နဲ့ အသုံးပြုပုံတွေ ရှိပါတယ်။ ဒီ page က test အမျိုးအစားတွေနဲ့ — သင့် application ကို စမ်းသပ်ဖို့ အသုံးများတဲ့ tools တွေရဲ့ ခြုံငုံ သုံးသပ်ချက်ကို ပေးပါတယ်။

## Test အမျိုးအစားများ (Types of tests)

- **Unit Testing** — code ရဲ့ unit တစ်ခုချင်းစီ (သို့) block တွေကို သီးခြား (isolation) အနေနဲ့ စမ်းသပ်တာပါ။ React မှာ unit တစ်ခုက function, hook (သို့) component တစ်ခုတည်း ဖြစ်နိုင်ပါတယ်။
- **Component Testing** — unit testing ရဲ့ ပိုပြီး အာရုံစိုက်ထားတဲ့ ပုံစံတစ်မျိုး ဖြစ်ပြီး — အဓိက စမ်းသပ်စရာက React components တွေပါ။ Component တွေ ဘယ်လို render ဖြစ်လဲ၊ props တွေနဲ့ ဘယ်လို ဆက်သွယ်လဲ၊ user events တွေကို ဘယ်လို တုံ့ပြန်လဲ စတာတွေကို စမ်းသပ်တာ ပါဝင်နိုင်ပါတယ်။
- **Integration Testing** — unit အများအပြား တွဲပြီး ဘယ်လို အလုပ်လုပ်လဲ စမ်းသပ်တာပါ။ ဒါက components, hooks နဲ့ functions တွေရဲ့ ပေါင်းစပ်မှု ဖြစ်နိုင်ပါတယ်။
- **End-to-End (E2E) Testing** — browser လိုမျိုး လက်တွေ့ user အခြေအနေတွေကို အတုယူတဲ့ environment တစ်ခုထဲမှာ user flows တွေကို စမ်းသပ်တာပါ။ ဆိုလိုတာက — production နဲ့ ဆင်တူတဲ့ environment တစ်ခုထဲမှာ သတ်သတ်မှတ်မှတ် task တွေ (ဥပမာ signup flow) ကို စမ်းသပ်တာပါ။
- **Snapshot Testing** — component တစ်ခုရဲ့ rendered output ကို ဖမ်းယူပြီး snapshot file တစ်ခုထဲ သိမ်းတာပါ။ Test တွေ run တဲ့အခါ — လက်ရှိ rendered output ကို သိမ်းထားတဲ့ snapshot နဲ့ ယှဉ်ကြည့်ပါတယ်။ Snapshot ထဲက ပြောင်းလဲမှုတွေက အပြုအမူထဲမှာ မမျှော်လင့်ထားတဲ့ အပြောင်းအလဲတွေ ရှိနေတာကို ညွှန်ပြပါတယ်။

## Async Server Components

`async` Server Components တွေက React ecosystem အတွက် အသစ်မို့ — tools တချို့က သူတို့ကို အပြည့်အဝ ထောက်ပံ့မထားပါဘူး။ ဒီအတောအတွင်းမှာ `async` components တွေအတွက် **Unit Testing** ထက် **End-to-End Testing** ကို သုံးဖို့ အကြံပြုပါတယ်။

## လမ်းညွှန်များ (Guides)

ဒီအသုံးများတဲ့ testing tools တွေနဲ့ Next.js ကို ဘယ်လို စနစ်ထည့်သွင်းရမလဲ သိရှိဖို့ အောက်က လမ်းညွှန်တွေကို ကြည့်ပါ:

- [Testing with Vitest](https://nextjs.org/docs/app/guides/testing/vitest)
- [Testing with Jest](https://nextjs.org/docs/app/guides/testing/jest)
- [Testing with Playwright](https://nextjs.org/docs/app/guides/testing/playwright)
- [Testing with Cypress](https://nextjs.org/docs/app/guides/testing/cypress)
