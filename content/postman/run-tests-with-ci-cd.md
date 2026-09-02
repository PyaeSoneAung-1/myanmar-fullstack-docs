---
title: "Postman သုံးပြီး CI/CD pipeline ထဲမှာ API tests တွေ run လုပ်ခြင်း (Run API tests in your CI/CD pipeline using Postman)"
description: "Postman CLI ကို သုံးပြီး သင့် CI/CD pipeline ထဲမှာ test collections တွေ run လုပ်ခြင်း — Postman CLI test runs တွေကို configure လုပ်ခြင်း"
order: 94
source: "https://learning.postman.com/docs/tests-and-scripts/run-tests/run-tests-with-ci-cd/"
status: translated
updated: 2026-09-02
---

Continuous integration နဲ့ continuous delivery (CI/CD) နဲ့ဆိုရင် — ပန်းတိုင်က အသုံးပြုသူတွေအတွက် တန်ဖိုးရှိတဲ့ software updates တွေကို မကြာခဏ ပို့ပေးဖို့ ဖြစ်ပါတယ်။ တစ်ချိန်တည်းမှာပဲ — software အရည်အသွေးကို ထိန်းသိမ်းထားဖို့ကလည်း အရေးကြီးပါတယ်။ Build process အတွင်းမှာ API tests တွေကို အလိုအလျောက် run လုပ်ခြင်းက — code change တိုင်းက production အတွက် အသင့်ဖြစ်နေစေဖို့ ကူညီပေးပါတယ်။

[Postman CLI](https://learning.postman.com/docs/postman-cli/postman-cli-overview/) က သင့် test collections တွေ, monitors တွေ, flows တွေနဲ့ နောက်ထပ်တွေကို သင့် CI/CD pipeline ရဲ့ အစိတ်အပိုင်းအနေနဲ့ run လုပ်နိုင်စေပါတယ်။ Postman CLI နဲ့ဆိုရင် — သင့် code repository ဆီကို push လုပ်တိုင်း tests တွေ run လုပ်ပြီး ၎င်းတို့ရဲ့ ရလဒ်တွေကို စောင့်ကြည့်နိုင်ပါတယ်။

## Postman CLI test runs တွေကို configure လုပ်ခြင်း (Configure Postman CLI test runs)

Tests တွေကို CI/CD pipeline ရဲ့ အစိတ်အပိုင်းအနေနဲ့ run လုပ်ဖို့ — အရင်ဆုံး သင်ရဲ့ run လုပ်ချင်တဲ့ tests တွေ ပါဝင်တဲ့ [Postman Collection](https://learning.postman.com/docs/use/use-collections/overview/) တစ်ခုကို ဖန်တီးပါ။ ပြီးရင် — သင့် CI/CD pipeline configuration ထဲမှာ ထည့်လို့ရတဲ့ code snippet တစ်ခုကို ထုတ်ပေးဖို့ Postman ကို သုံးပါ။ Pipeline run လုပ်တိုင်း [Postman CLI](https://learning.postman.com/docs/postman-cli/postman-cli-overview/) က သင့် tests တွေကို run လုပ်ပါတယ်။ ဒါက test results တွေအပေါ် မူတည်ပြီး — သင့် changes တွေကို push လုပ်ဖို့ ဒါမှမဟုတ် roll back လုပ်ဖို့ နိုင်စေပါတယ်။

သင့် CI/CD pipeline ကို collection တစ်ခု run လုပ်ဖို့ configure လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Sidebar ထဲက **Items** ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပြီး collection တစ်ခုကို ရွေးကာ — သင့် CI/CD pipeline ထဲမှာ run လုပ်ချင်တဲ့ collection ဒါမှမဟုတ် folder ကို နှိပ်ပါ။
3. **Run** ကို နှိပ်ပါ။
4. **Functional** tab ကို နှိပ်ပြီး — **Automate runs via CLI** ကို နှိပ်ပါ။
5. **Run on CI/CD** အောက်မှာ **Configure command** ကို နှိပ်ပါ။
6. Run လုပ်ချင်တဲ့ collection တစ်ခုနဲ့ optional [environment](/docs/postman/managing-environments) တစ်ခုကို ရွေးပါ။ Collection တစ်ခုစီကို ၎င်းတို့နဲ့ သက်ဆိုင်တဲ့ environment တစ်ခုစီနဲ့ တွဲပြီး အများကြီး ထည့်နိုင်ပါတယ်။ သင့် CI/CD provider နဲ့ operating system ကိုလည်း ရွေးပါ။
7. Code ကို ကူးယူဖို့ **Copy Postman CLI Command** ကို နှိပ်ပါ။ ပြီးရင် ဒါကို သင့် CI/CD pipeline configuration ထဲမှာ ထည့်ပါ။

သင့် CI/CD pipeline ထဲမှာ Postman CLI ကို configure လုပ်ခြင်းအကြောင်း ပိုလေ့လာဖို့ — [Postman CLI commands နဲ့ options overview](https://learning.postman.com/docs/postman-cli/postman-cli-options) ကို ကြည့်ပါ။
