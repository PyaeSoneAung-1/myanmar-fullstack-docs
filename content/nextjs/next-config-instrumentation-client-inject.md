---
title: "instrumentationClientInject (client instrumentation modules ထည့်သွင်းခြင်း)"
description: "instrumentationClientInject option — user ၏ instrumentation-client.{js,ts} file run မလုပ်မီနှင့် React hydration မတိုင်မီ side effects အတွက် client ပေါ်တွင် import လုပ်မည့် modules စာရင်း; next.config.js plugins (withSentry/withAnalytics ကဲ့သို့) အတွက် အဓိက ရည်ရွယ်; onRouterTransitionStart navigation hook ပေါင်းစပ်ခြင်း; v16.3.0"
order: 203
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/instrumentationClientInject"
status: translated
updated: 2026-09-03
---

`instrumentationClientInject` ဆိုတာ — user ရဲ့ [`instrumentation-client.{js,ts}`](/docs/nextjs/file-conventions-instrumentation-client) file က run မလုပ်ခင်နဲ့ React hydration မတိုင်ခင်၊ သူတို့ရဲ့ side effects တွေအတွက် client ပေါ်မှာ import လုပ်မယ့် modules စာရင်းတစ်ခုပါ။

ဒီ option က အဓိကအားဖြင့် **`next.config.js` plugins** တွေအတွက် ရည်ရွယ်ပါတယ် — ဥပမာ project တစ်ခုရဲ့ config ကို တိုးချဲ့ပေးတဲ့ `withSentry` (သို့) `withAnalytics` လိုမျိုး wrapper တွေပါ။ ဒါက ဒီလို plugin တစ်ခုကို navigation hook အပါအဝင် ကိုယ်ပိုင် client instrumentation module တစ်ခုကို ထည့်သွင်းနိုင်စေပါတယ် — project တိုင်းက `instrumentation-client` file တစ်ခုကို ရေးသား (သို့) ပြင်ဆင်စရာ မလိုတော့ပါဘူး။ Application code တွေကတော့ ယေဘုယျအားဖြင့် [`instrumentation-client.{js,ts}`](/docs/nextjs/file-conventions-instrumentation-client) file convention ကိုပဲ တိုက်ရိုက် ဆက်သုံးသင့်ပါတယ်။

Plugin တစ်ခုက ပုံမှန်အားဖြင့် project မှာ ရှိပြီးသား configuration ရဲ့နောက်မှာ ကိုယ်ပိုင် module ကို ထပ်ပေါင်းပါတယ်:

```js filename="withMyInstrumentation.js"
module.exports = function withMyInstrumentation(nextConfig = {}) {
  return {
    ...nextConfig,
    instrumentationClientInject: [
      ...(nextConfig.instrumentationClientInject ?? []),
      'my-instrumentation-package/client',
    ],
  }
}
```

ဒါကို တိုက်ရိုက်လည်း သတ်မှတ်နိုင်ပါတယ်:

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
module.exports = {
  instrumentationClientInject: [
    'my-analytics-package',
    './lib/sentry-client.js',
  ],
}
```

Entry တစ်ခုချင်းစီက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:

- Project ရဲ့ `node_modules` ကနေ ဖြေရှင်းတဲ့ (resolve လုပ်တဲ့) bare npm package name တစ်ခု။
- Project root နဲ့ နှိုင်းယှဉ်တဲ့ path တစ်ခု။

## လုပ်ဆောင်မှု အစီအစဉ် (Execution order)

Modules တွေက client ပေါ်မှာ အောက်ပါအတိုင်း အစီအစဉ်ကျ run ပါတယ်:

1. `instrumentationClientInject` ထဲက entry တစ်ခုချင်းစီ — array order အတိုင်း။
2. Project ရဲ့ `instrumentation-client.{js,ts}` file — ရှိရင်။
3. React hydration။

## Router navigation hook

ထည့်သွင်းထားတဲ့ module တစ်ခုချင်းစီက [`instrumentation-client` file convention](/docs/nextjs/file-conventions-instrumentation-client) မှာ ဖော်ပြထားတဲ့အတိုင်း signature တူညီတဲ့ `onRouterTransitionStart` function တစ်ခုကို optionally export လုပ်နိုင်ပါတယ်။ Next.js က hook တစ်ခုတည်းကို ပေါင်းစပ်ဖွဲ့စည်းပြီး — navigation တစ်ခုစီမှာ export လုပ်ထားတဲ့ `onRouterTransitionStart` တိုင်းဆီကို array order အတိုင်း ဖြန့်ခေါ်ပေးပါတယ်။ User file ရဲ့ hook က နောက်ဆုံးမှ run ပါတယ်။

```js filename="lib/sentry-client.js"
// Load လုပ်ချိန်မှာ run တဲ့ side-effectful setup
setupSentry()

export function onRouterTransitionStart(url, navigationType) {
  recordNavigationBreadcrumb(url, navigationType)
}
```

`onRouterTransitionStart` ကို export မလုပ်တဲ့ modules တွေကို navigation အတွင်း ကျော်သွားပါတယ်။

## Version History

| Version   | Changes                                  |
| --------- | ---------------------------------------- |
| `v16.3.0` | `instrumentationClientInject` စတင် မိတ်ဆက် |
