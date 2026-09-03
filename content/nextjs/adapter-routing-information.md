---
title: "Routing Information (routing အချက်အလက်များ)"
description: "onBuildComplete မှာ ရတဲ့ routing phases/route fields ကိုးကား"
order: 256
source: "https://nextjs.org/docs/app/api-reference/adapters/routing-information"
status: translated
updated: 2026-09-03
---

`onBuildComplete` ထဲက `routing` object က — deployment အတွက် အသင့်ဖြစ်ပြီးသား processed patterns တွေ ပါဝင်တဲ့ — ပြည့်စုံတဲ့ routing အချက်အလက်တွေကို ပေးအပ်ပါတယ်:

## `routing.beforeMiddleware` (middleware မလုပ်ဆောင်မီ အသုံးပြုသော routes)

Middleware မလုပ်ဆောင်ခင် အသုံးပြုတဲ့ routes တွေ ဖြစ်ပါတယ်။ ဒါတွေထဲမှာ generate လုပ်ထားတဲ့ header နဲ့ redirect အပြုအမူတွေ ပါဝင်ပါတယ်။

## `routing.middlewareMatchers` (middleware matcher အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ)

ဒီ build အတွက် ထုတ်လွှတ်လိုက်တဲ့ (emitted) middleware matcher အဓိပ္ပါယ်ဖွင့်ဆိုချက်တွေ ဖြစ်ပါတယ်။ Request တစ်ခုအတွက် middleware ကို invoke လုပ်သင့် မလုပ်သင့် ဆုံးဖြတ်ဖို့ ဒါတွေကို သုံးပါ။

## `routing.beforeFiles` (filesystem route matching မတိုင်မီ စစ်ဆေးသော rewrite routes)

Filesystem route matching မလုပ်ခင် စစ်ဆေးတဲ့ rewrite routes တွေ ဖြစ်ပါတယ်။

## `routing.afterFiles` (filesystem route matching ပြီးနောက် စစ်ဆေးသော rewrite routes)

Filesystem route matching ပြီးမှ စစ်ဆေးတဲ့ rewrite routes တွေ ဖြစ်ပါတယ်။

## `routing.dynamicRoutes` (dynamic matchers များ)

`[slug]` နဲ့ catch-all routes လို route segments တွေကနေ ထုတ်ပေးလိုက်တဲ့ dynamic matchers တွေ ဖြစ်ပါတယ်။

## `routing.onMatch` (match အောင်မြင်ပြီးနောက် အသုံးပြုသော routes)

Match တစ်ခု အောင်မြင်ပြီးတဲ့နောက်မှာ အသုံးပြုတဲ့ routes တွေ ဖြစ်ပါတယ် — ဥပမာ hashed static assets တွေအတွက် immutable cache headers လိုမျိုးပါ။

## `routing.fallback` (နောက်ဆုံး fallback rewrites)

အစောပိုင်း phases တွေမှာ match တစ်ခုမှ မထွက်ခဲ့ဘူးဆိုရင် — နောက်ဆုံးအနေနဲ့ စစ်ဆေးတဲ့ rewrite routes တွေ ဖြစ်ပါတယ်။

## Common Route Fields (အသုံးများသော route fields)

Route entry တစ်ခုချင်းစီမှာ အောက်ပါတို့ ပါဝင်နိုင်ပါတယ်:

- `source`: မူရင်း route pattern (generated internal rules တွေအတွက်တော့ optional)
- `sourceRegex`: Requests တွေနဲ့ ကိုက်ညီမှု စစ်ဆေးဖို့ compile လုပ်ထားတဲ့ regex
- `destination`: အတွင်းပိုင်း destination (သို့) redirect destination
- `headers`: Apply လုပ်ရမယ့် headers
- `has`: Positive ကိုက်ညီမှု အခြေအနေတွေ (request ထဲမှာ ပါဝင်ရမယ့်အရာတွေ)
- `missing`: Negative ကိုက်ညီမှု အခြေအနေတွေ (request ထဲမှာ မပါဝင်ရမယ့်အရာတွေ)
- `status`: Redirect လုပ်တဲ့အခါ သုံးတဲ့ status code
- `priority`: အတွင်းပိုင်း route ဦးစားပေး flag
