---
title: "Route Groups ((folderName) — routes များကို အုပ်စုဖွဲ့ခြင်း)"
description: "Route Groups file convention — folder နာမည်ကို parenthesis ((folderName)) နဲ့ ပတ်ပြီး routes တွေကို အမျိုးအစား/team အလိုက် စုစည်းနည်း; URL path မှာ မပါဝင်စေဘဲ ဖွဲ့စည်းပုံ ပိုင်းခြားခြင်း — use cases နဲ့ caveats"
order: 104
source: "https://nextjs.org/docs/app/api-reference/file-conventions/route-groups"
status: translated
updated: 2026-09-02
---

Route Groups တွေက folder convention တစ်ခု ဖြစ်ပြီး — routes တွေကို အမျိုးအစား (သို့) team အလိုက် စနစ်တကျ ဖွဲ့စည်းနိုင်စေပါတယ်။

## Convention (စည်းမျဉ်း)

Route group တစ်ခုကို folder နာမည်ကို parenthesis နဲ့ ပတ်ပြီး ဖန်တီးနိုင်ပါတယ်: `(folderName)`။

ဒီ convention က folder က organization (စနစ်တကျ စုစည်းခြင်း) ရည်ရွယ်ချက်အတွက်သာ ဖြစ်ပြီး — route ရဲ့ URL path ထဲ **မပါဝင်ရ** ဆိုတာ ညွှန်ပြပါတယ်။

## အသုံးပြုပုံများ (Use cases)

- Routes တွေကို team, လုပ်ဆောင်ချက် (concern) (သို့) feature အလိုက် စုစည်းဖို့။
- [Root layouts](/docs/nextjs/file-conventions-layout#root-layout) အများအပြား သတ်မှတ်ဖို့။
- Route segment တချို့ကိုပဲ layout တစ်ခုခု share လုပ်ဖို့ ရွေးချယ်ပြီး — ကျန်တဲ့အရာတွေကို ဖယ်ထုတ်ထားဖို့။

## သတိထားစရာများ (Caveats)

- **Full page load**: Root layouts မတူညီတဲ့ routes တွေကြား navigate လုပ်ရင် full page reload ဖြစ်စေပါတယ်။ ဥပမာ — `app/(shop)/layout.js` သုံးတဲ့ `/cart` ကနေ `app/(marketing)/layout.js` သုံးတဲ့ `/blog` ဆီ သွားတာမျိုးပါ။ ဒါက root layouts အများအပြား ရှိတဲ့အခါမှာပဲ သက်ရောက်ပါတယ်။
- **Conflicting paths (လမ်းကြောင်း ကွဲလွဲမှု)**: Group မတူတဲ့ routes တွေက URL path တူတူကို resolve မလုပ်သင့်ပါဘူး။ ဥပမာ — `(marketing)/about/page.js` နဲ့ `(shop)/about/page.js` နှစ်ခုလုံးက `/about` ကို resolve ဖြစ်ပြီး error ဖြစ်စေပါတယ်။
- **Top-level root layout**: Top-level `layout.js` file မရှိဘဲ root layouts အများအပြား သုံးနေရင် — သင့် home route (/) ကို route groups ထဲက တစ်ခုခုအတွင်းမှာ သတ်မှတ်ထားဖို့ သေချာပါစေ။ ဥပမာ — `app/(marketing)/page.js`။
